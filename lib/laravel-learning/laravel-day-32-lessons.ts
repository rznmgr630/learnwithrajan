import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_32_LESSONS: LessonDay = {
  day: 32,
  title: "Caching & performance — measure, then optimise",
  totalMinutes: 94,
  difficulty: "Advanced",
  lessons: [
    {
      id: "cache-drivers",
      title: "Cache drivers — file, database, Redis, Memcached, array",
      durationMinutes: 11,
      explanation: "This elective is about making a Laravel application faster <b>without blindly adding caching everywhere</b>.\n\n```text\nslow application → measure → find the bottleneck\n→ fix the query or the code → cache only when useful → measure again\n```\n\n<b>Do not start with \"it's slow, add Redis\".</b> Start with \"why is it slow?\". Everything today serves that order, and the last lesson comes back to it.\n\n---\n\n### 1. Basic — one API, several backends\n\n```text\n            Cache API\n   ┌────┬─────────┬───────┬───────────┐\n  file database Redis Memcached array\n```\n\nYour code stays `Cache::get('key')` while the driver changes underneath. Same abstraction shape as Storage, Queue and Scout.\n\n<b>File</b> is the simplest: cache entries as files on disk. Fine for local development and a single small server.\n\n<b>Array</b> lives only for the current request and vanishes when it ends, which makes it the right driver for tests. <b>It is also why a cache bug can pass every test</b>: your test cache is empty every time, so a stale-value problem never appears.\n\n---\n\n### 2. Intermediate — where file and database fall down\n\n<b>File cache breaks the moment you have two servers:</b>\n\n```text\nserver A → its own cache\nserver B → a different cache\nserver C → a different cache\n```\n\nNothing is shared, so a user's next request may hit a server that never cached anything, and `Cache::forget()` on one server leaves the value alive on the other two. <b>That is not a slow cache, it is an inconsistent one</b>, which is worse.\n\nAnd it is the same failure you met on Day 29 with `onOneServer()` and isolation locks: <b>anything coordinating across servers needs shared storage</b>, and a file driver silently provides none.\n\n<b>Database cache</b> avoids running another service, which is genuinely convenient. But notice what you are doing:\n\n> <b>You are using the database to avoid database work.</b>\n\nIt helps when the cached thing is expensive to compute rather than expensive to read, and it stops helping at high throughput, where your cache reads become load on the system you were protecting.\n\n---\n\n### 3. Advanced — Redis, and separating workloads\n\n<b>Redis</b> is the usual production answer: memory-based, so reads are fast, and it does far more than caching:\n\n```text\ncache · queues · locks · sessions · counters · pub/sub · rate limiting\n```\n\n<b>Memcached</b> is also in-memory, deliberately narrower, and does caching only. Redis has the richer feature set, which is why it usually wins.\n\n<b>But that versatility is a trap.</b> If cache, queue, session and locks all share one Redis instance, then `cache:clear` can wipe your queued jobs, a cache-driven memory spike evicts your sessions, and one busy workload starves the others.\n\n<b>So separate them</b>, by connection or by instance:\n\n```text\nRedis: cache      evictable, allowed to lose data\nRedis: queue      persistent, must not lose data\nRedis: sessions   persistent-ish, losing it logs everyone out\n```\n\n<b>The critical setting is eviction.</b> A cache Redis should evict old keys when memory fills, which is exactly right. A queue Redis with the same policy <b>silently deletes jobs</b> under pressure, and you will not find out until somebody's invoice never sent.\n\nAnd one thing every driver shares: <b>a cache must be allowed to disappear.</b> If clearing it breaks your application, it was not a cache, it was a database with no backups.\n\nThree footnotes.\n\n<b>Two Redis clients exist.</b> `phpredis` is a C extension, faster and the default; `predis` is pure PHP, installed with `composer require predis/predis`, and the answer when you cannot install an extension. `REDIS_CLIENT` picks between them and nothing else in your code changes.\n\n<b>The env key was renamed.</b> Laravel 11 uses `CACHE_STORE`; Laravel 10 and earlier use `CACHE_DRIVER`. An old tutorial's `.env` line is silently ignored on a current version, which looks like a cache that will not switch.\n\n<b>And do not confuse the cache with the session.</b>\n\n```text\nsession   private to one user, and scoped to their browser\ncache     shared by every user and every server\n```\n\nThey often sit on the same Redis, which is where the confusion starts. <b>Anything user-specific in the cache needs the user in the key</b>, and anything genuinely sensitive belongs in the session or nowhere, because a cache is a shared space with a shared namespace.",
      diagram: `The order this elective follows

    slow application
        ↓
    MEASURE
        ↓
    find the bottleneck
        ↓
    fix the query or the code
        ↓
    cache only when useful
        ↓
    measure again

  Do NOT start with "it's slow, add Redis".
  Start with "why is it slow?".


One API, several backends

               Cache API
      ┌────┬────────┬───────┬──────────┬───────┐
     file  database  Redis  Memcached  array

    Cache::get('key')   stays the same

  FILE     simplest; files on disk
           fine for local dev and one small server

  ARRAY    lives for one request, then vanishes
           the right driver for tests

    ⚠️  which is also why a cache bug passes every
        test — your test cache is empty each time,
        so a stale-value problem never appears


  ⚠️  File cache breaks with two servers

      server A → its own cache
      server B → a different cache
      server C → a different cache

      Nothing shared. A user's next request may hit
      a server that cached nothing, and forget() on
      one leaves the value alive on the other two.

        not a SLOW cache — an INCONSISTENT one,
        which is worse

      Same failure as Day 29's onOneServer() and
      isolation locks: cross-server coordination
      needs shared storage, and file provides none.


  DATABASE cache

    convenient — no extra service. But notice:

      YOU ARE USING THE DATABASE TO AVOID DATABASE
      WORK.

    helps when the value is expensive to COMPUTE
    stops helping at high throughput, where cache
    reads become load on the system you were
    protecting


REDIS — the usual production answer

    memory-based, and far more than a cache:

      cache · queues · locks · sessions
      counters · pub/sub · rate limiting

    Memcached: also in-memory, deliberately narrower,
    caching only

  ⚠️  That versatility is a trap.

      one Redis for everything means:
        cache:clear can wipe queued jobs
        a cache memory spike evicts sessions
        one busy workload starves the others

      Separate by connection or instance:

        cache      evictable, allowed to lose data
        queue      persistent, must NOT lose data
        sessions   losing it logs everyone out

  ⚠️  EVICTION is the critical setting.

      cache Redis   evicts old keys when full  ✅
      queue Redis   same policy SILENTLY DELETES JOBS

      You find out when somebody's invoice never sent.


  And every driver shares one rule:

    A CACHE MUST BE ALLOWED TO DISAPPEAR.

    If clearing it breaks your application, it was
    not a cache — it was a database with no backups.`,
      codeExample: {
        title: "Drivers, separation and the settings that matter",
        code: `# ---------- .env ----------

CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# Local / tests
CACHE_STORE=array          # vanishes each request — right for tests,
                           # and why cache bugs hide there


<?php
// ---------- config/database.php: separate the workloads ----------

'redis' => [
    'client' => env('REDIS_CLIENT', 'phpredis'),

    // Evictable. Losing this is fine, by definition.
    'cache' => [
        'host'     => env('REDIS_HOST'),
        'port'     => env('REDIS_PORT', 6379),
        'database' => 1,
    ],

    // Must NOT lose data. A job deleted under memory
    // pressure is an invoice that never sent.
    'queue' => [
        'host'     => env('REDIS_QUEUE_HOST', env('REDIS_HOST')),
        'port'     => env('REDIS_PORT', 6379),
        'database' => 2,
    ],

    // Losing this logs everyone out.
    'sessions' => [
        'host'     => env('REDIS_HOST'),
        'database' => 3,
    ],
],

// One instance for everything means cache:clear can wipe
// your queued jobs, and a cache spike evicts sessions.


# ---------- The eviction policy, per instance ----------

# Cache Redis — correct behaviour
maxmemory 2gb
maxmemory-policy allkeys-lru      # evict old keys when full

# Queue Redis — the same line here silently deletes jobs
maxmemory 1gb
maxmemory-policy noeviction       # refuse writes instead of losing data


<?php
// ---------- Why file cache fails on two servers ----------

// Server A
Cache::put('product:5', $product, now()->addHour());

// Server B — different disk, different cache
Cache::get('product:5');            // null

// Server A
Cache::forget('product:5');         // B and C still serve the old value

// Not a slow cache. An INCONSISTENT one, which is worse.
// Same failure as Day 29's onOneServer() with a file driver.


<?php
// ---------- Database cache: using the database to avoid the database ----------

php artisan make:cache-table
php artisan migrate

// CACHE_STORE=database
//
// Helps when the value is expensive to COMPUTE:
Cache::remember('monthly-report', now()->addHours(6),
    fn () => $this->reportBuilder->build());     // 8s of aggregation

// Does not help when the value is expensive to READ:
Cache::remember('user:5', now()->addHour(),
    fn () => User::find(5));                     // you swapped one row read
                                                 // for another row read


<?php
// ---------- The rule that tests everything ----------

// Ask: can I run this right now, in production?
php artisan cache:clear

// If the answer is "no, that would break things", it is
// not a cache. It is a database with no backups.

// ✅ A cache
$total = Cache::remember("team:{$team->id}:invoice-total", now()->addMinutes(10),
    fn () => $team->invoices()->sum('total_cents'));

// ❌ Not a cache — nothing else knows this value
Cache::forever("user:{$user->id}:onboarding-step", 3);`,
      },
      keyTakeaways: [
        "<b>The order is measure, find the bottleneck, fix the code or query, then cache.</b>",
        "<b>One Cache API sits over file, database, Redis, Memcached and array drivers.</b>",
        "<b>The array driver lives for one request</b>, which is right for tests and hides stale-cache bugs.",
        "<b>File cache breaks with more than one server</b>: each has its own, and `forget()` only clears one.",
        "<b>That is inconsistency, not slowness</b>, and it is the same shared-storage rule as Day 29's locks.",
        "<b>Database cache means using the database to avoid database work.</b>",
        "<b>It helps for expensive computation, not expensive reads</b>, and stops helping at high throughput.",
        "<b>Redis is the usual production answer</b> and also does queues, locks, sessions, counters and rate limiting.",
        "<b>That versatility is a trap</b>: one instance means `cache:clear` can wipe queued jobs.",
        "<b>Separate cache, queue and session Redis by connection or instance.</b>",
        "<b>Eviction policy is the critical difference</b>: a cache should evict, a queue must never.",
        "<b>A cache must be allowed to disappear</b>, or it is a database with no backups.",
      ],
      commonMistakes: [
        "<b>File cache on multiple servers.</b> Three different caches and a `forget()` that clears one.",
        "<b>One Redis for everything.</b> `cache:clear` deletes jobs and a cache spike evicts sessions.",
        "<b>`allkeys-lru` on a queue Redis.</b> Jobs vanish silently under memory pressure.",
        "<b>Storing something only the cache knows.</b> That is not a cache, and clearing it loses data.",
        "<b>Trusting tests with the array driver to catch cache bugs.</b> The cache is empty every time.",
      ],
      quiz: [
        {
          question: "Why is file cache a problem on multiple servers?",
          options: [
            "It is slow",
            "Each server has its own cache, so nothing is shared and `forget()` only clears one",
            "It cannot store objects",
            "It has no TTL",
          ],
          correctIndex: 1,
          explanation: "That is inconsistency, which is worse than slowness.",
        },
        {
          question: "What is the catch with the database cache driver?",
          options: [
            "It has no TTL support",
            "You are using the database to avoid database work, so it helps computation but not reads",
            "It cannot be cleared",
            "It is not supported in production",
          ],
          correctIndex: 1,
          explanation: "At high throughput your cache reads become load on the system you were protecting.",
        },
        {
          question: "Why separate cache and queue Redis instances?",
          options: [
            "For speed",
            "`cache:clear` can wipe queued jobs, and a cache eviction policy silently deletes them",
            "Laravel requires it",
            "For monitoring",
          ],
          correctIndex: 1,
          explanation: "A cache should evict; a queue must never.",
        },
        {
          question: "What is the test for whether something is really a cache?",
          options: [
            "It has a TTL",
            "You could run `cache:clear` in production right now without breaking anything",
            "It uses Redis",
            "It is under 1MB",
          ],
          correctIndex: 1,
          explanation: "Otherwise it is a database with no backups.",
        },
      ],
    },
    {
      id: "the-cache-api",
      title: "get, put, remember, rememberForever & touch",
      durationMinutes: 11,
      explanation: "Five methods cover almost everything you will write.\n\n---\n\n### 1. Basic — get and put\n\n```php\n$value = Cache::get('users');          // null if missing\n$value = Cache::get('users', []);      // with a default\n\nCache::put('users', $users, now()->addMinutes(10));\n```\n\n<b>TTL</b> is time to live: after ten minutes the entry is no longer valid.\n\n```text\nkey → cache → value\n```\n\n---\n\n### 2. Intermediate — remember\n\nThe one you will use most:\n\n```php\n$users = Cache::remember('users', now()->addMinutes(10), fn () => User::all());\n```\n\n```text\ncache exists?\n  yes → return it\n  no  → run the closure → store the result → return it\n```\n\n<b>The expensive work happens only on a miss</b>, and the read-check-write logic you would otherwise write by hand is gone, along with the race between checking and writing.\n\n`rememberForever` has no expiry:\n\n```php\nCache::rememberForever('countries', fn () => Country::all());\n```\n\n<b>\"Forever\" does not mean \"never needs invalidating\".</b> It means you have taken responsibility for invalidating it yourself, and if you forget, the value is wrong until somebody runs `cache:clear`. <b>Use it only for genuinely static data</b>, and even then, ask what happens when it changes.\n\n---\n\n### 3. Advanced — TTL is a correctness decision\n\n<b>The TTL is how long you are willing to serve wrong data.</b> That is the whole question, and it is a business one rather than a technical one:\n\n```text\nan invoice total       seconds, or invalidate on write\na product listing      minutes\na country list         hours or days\n```\n\n<b>Ten minutes is not a default, it is a decision</b> that says a user may see a ten-minute-old figure. Sometimes that is fine. On a payment page it is not.\n\n<b>And a `remember` block is not automatically a win.</b> If the closure takes two milliseconds, you have replaced a fast query with a network round trip to Redis plus serialisation, and made the code harder to reason about. <b>Cache what is slow, not what is frequent.</b>\n\n`Cache::touch()` extends a TTL without rewriting the value:\n\n```text\nvalue: same    TTL: 5 minutes → 10 minutes\n```\n\nUseful when the value is still valid and you want to keep it alive, typically for something expensive to rebuild that is still being actively used.\n\nTwo practical points that cause real bugs.\n\n<b>Keys must include everything the value depends on.</b> A key of `dashboard` on a multi-tenant application serves one tenant's dashboard to everybody. It should be `dashboard:team:{id}:v2`, and the version suffix is how you invalidate a shape change without a deploy-time flush.\n\n<b>And do not cache `null` accidentally.</b> `Cache::remember` stores whatever the closure returns, including `null`, so a lookup that failed once keeps returning \"not found\" for the whole TTL. That is a cached outage.\n\nThe rest of the surface, briefly:\n\n```php\nCache::has($key);            // present and unexpired\nCache::missing($key);        // the inverse, reads better in a guard\nCache::pull($key);           // read it and forget it, in one call\nCache::increment('views');\nCache::decrement('slots');\nCache::forever($key, $value); // no expiry\n```\n\n<b>`pull()` is the one worth remembering</b>, because it is how you consume a single-use value, a one-time token or a queued flash message, without the gap between reading and deleting where a second request can read it too.\n\nAnd the TTL takes plain seconds as well as a date:\n\n```php\nCache::put($key, $value, 3600);\nCache::put($key, $value, now()->addHour());\n```\n\n<b>The second form is worth the extra characters</b>, because `3600` is a number somebody has to decode and `addHour()` is not.\n\nOne piece of vocabulary for reading other people's code: what `remember()` does has a name, the <b>cache-aside pattern</b>. Check the cache, compute on a miss, store, return. You have been writing it all along; that is what it is called.",
      diagram: `get and put

    Cache::get('users');           null if missing
    Cache::get('users', []);       with a default

    Cache::put('users', $users, now()->addMinutes(10));

      key → cache → value

    TTL = time to live. After 10 minutes the entry is
    no longer valid.


remember — the one you will use most

    Cache::remember('users', now()->addMinutes(10),
        fn () => User::all());

              cache exists?
                   │
             ┌─────┴─────┐
            YES          NO
             │            │
             ▼            ▼
         return      run the closure
         value            ↓
                     store result
                          ↓
                     return result

  The expensive work happens only on a miss, and the
  read-check-write logic (and its race) is gone.


rememberForever

    Cache::rememberForever('countries',
        fn () => Country::all());

  ⚠️  "Forever" does not mean "never needs
      invalidating".

      It means YOU have taken responsibility for
      invalidating it. Forget, and the value is wrong
      until somebody runs cache:clear.

      Genuinely static data only — and even then, ask
      what happens when it changes.


  ⚠️  THE TTL IS HOW LONG YOU ARE WILLING TO SERVE
      WRONG DATA.

      A business question, not a technical one:

        an invoice total     seconds, or invalidate
                             on write
        a product listing    minutes
        a country list       hours or days

      Ten minutes is not a default. It is a decision
      that a user may see a ten-minute-old figure.

      Fine on a listing page. Not on a payment page.


  ⚠️  A remember block is not automatically a win.

      closure takes 2ms
        → you replaced a fast query with a network
          round trip plus serialisation, and made the
          code harder to reason about

      CACHE WHAT IS SLOW, NOT WHAT IS FREQUENT.


Cache::touch()

    value: unchanged      TTL: 5 min → 10 min

  Extend the lifetime without rewriting the value.
  For something expensive to rebuild that is still
  actively used.


Two bugs worth avoiding

  KEYS must include everything the value depends on

    'dashboard'                  ← serves one tenant's
                                   dashboard to everyone
    'dashboard:team:5:v2'        ← and the version
                                   suffix invalidates a
                                   shape change with no
                                   deploy-time flush

  Do not cache NULL by accident

    remember() stores whatever the closure returns,
    including null — so a lookup that failed once
    keeps returning "not found" for the whole TTL

      that is a CACHED OUTAGE`,
      codeExample: {
        title: "The five methods, and the traps in each",
        code: `<?php
// ---------- The basics ----------

$users = Cache::get('users');                        // null if missing
$users = Cache::get('users', []);                    // default

Cache::put('users', $users, now()->addMinutes(10));
Cache::add('lock:import', true, now()->addMinute());  // only if absent
Cache::increment('views:post:5');


<?php
// ---------- remember: the workhorse ----------

$total = Cache::remember(
    "team:{$team->id}:invoice-total",
    now()->addMinutes(10),
    fn () => $team->invoices()->sum('total_cents'),
);

// Replaces this, including the race between the check
// and the write:
//
//   if (Cache::has($key)) { return Cache::get($key); }
//   $value = expensive();
//   Cache::put($key, $value, $ttl);
//   return $value;


<?php
// ---------- Keys must carry everything the value depends on ----------

// ❌ One tenant's dashboard, served to everybody
Cache::remember('dashboard', now()->addMinutes(5),
    fn () => $this->build($user));

// ✅ Scoped, and versioned
Cache::remember(
    "dashboard:team:{$user->team_id}:v2",
    now()->addMinutes(5),
    fn () => $this->build($user),
);

// The v2 suffix is how you invalidate a SHAPE change:
// bump it, and every old entry is orphaned instantly —
// no deploy-time flush, no stampede.


<?php
// ---------- ⚠️ The cached outage ----------

// The API was down for ten seconds. Now "not found" is
// cached for an hour.
$profile = Cache::remember("profile:{$id}", now()->addHour(),
    fn () => $this->api->fetchProfile($id));      // returned null

// ✅ Decide what a miss means, and cache it differently
$profile = Cache::get("profile:{$id}");

if ($profile === null) {
    $profile = $this->api->fetchProfile($id);

    Cache::put(
        "profile:{$id}",
        $profile,
        $profile ? now()->addHour() : now()->addSeconds(30),   // short negative TTL
    );
}


<?php
// ---------- TTL is a business decision ----------

// Seconds, or invalidated on write — a stale total on a
// payment page is a support ticket
Cache::remember("invoice:{$id}:total", now()->addSeconds(30), $fn);

// Minutes — a listing can lag
Cache::remember('products:featured', now()->addMinutes(15), $fn);

// Days — this genuinely does not change
Cache::rememberForever('countries', fn () => Country::all());
// ...and you still need a plan for the day it does.


<?php
// ---------- touch(): keep it alive without rebuilding ----------

$report = Cache::get("report:{$id}");

if ($report) {
    Cache::touch("report:{$id}", now()->addMinutes(10));   // still valid, keep it
}

// Useful for something expensive to rebuild that is
// still being actively used.


<?php
// ---------- Cache what is SLOW, not what is FREQUENT ----------

// ❌ A 2ms query, replaced by a network round trip plus
//    serialisation — and now harder to reason about
Cache::remember("user:{$id}", now()->addMinutes(5),
    fn () => User::find($id));

// ✅ Eight seconds of aggregation
Cache::remember("team:{$team->id}:annual-report", now()->addHours(6),
    fn () => $this->reportBuilder->build($team));`,
      },
      keyTakeaways: [
        "<b>`get` reads with an optional default; `put` writes with a TTL.</b>",
        "<b>`remember` runs the closure only on a miss</b>, replacing read-check-write and its race.",
        "<b>`rememberForever` means you have taken responsibility for invalidation</b>, not that none is needed.",
        "<b>The TTL is how long you are willing to serve wrong data</b>, which is a business decision.",
        "<b>Ten minutes is not a default</b>: fine on a listing, wrong on a payment page.",
        "<b>Cache what is slow, not what is frequent.</b>",
        "<b>Caching a 2ms query adds a network round trip and serialisation</b> for no gain.",
        "<b>`Cache::touch()` extends a TTL without rewriting the value.</b>",
        "<b>Keys must include everything the value depends on</b>, especially the tenant.",
        "<b>A version suffix in the key invalidates a shape change instantly</b>, with no flush.",
        "<b>`remember` caches `null` too</b>, so a failed lookup becomes a cached outage for the whole TTL.",
      ],
      commonMistakes: [
        "<b>An unscoped key like `dashboard`.</b> One tenant's data served to everyone.",
        "<b>Caching a null from a failed API call.</b> The outage now lasts as long as your TTL.",
        "<b>Picking ten minutes because it looks reasonable.</b> Decide what staleness the page can tolerate.",
        "<b>Caching fast queries.</b> You added a network hop and complexity to save nothing.",
        "<b>Treating `rememberForever` as fire and forget.</b> It is wrong until somebody clears the cache.",
      ],
      quiz: [
        {
          question: "What does `Cache::remember` actually save you?",
          options: [
            "Memory",
            "The read-check-write logic and its race, running the expensive closure only on a miss",
            "Serialisation",
            "The TTL",
          ],
          correctIndex: 1,
          explanation: "It is the method you will reach for most.",
        },
        {
          question: "How should you choose a TTL?",
          options: [
            "Ten minutes by default",
            "By deciding how long you are willing to serve wrong data on that page",
            "By query duration",
            "By cache size",
          ],
          correctIndex: 1,
          explanation: "A business decision, not a technical one.",
        },
        {
          question: "What is a cached outage?",
          options: [
            "A Redis failure",
            "`remember` storing the `null` from a failed lookup, so \"not found\" persists for the whole TTL",
            "An expired key",
            "A cache stampede",
          ],
          correctIndex: 1,
          explanation: "Give negative results a much shorter TTL.",
        },
        {
          question: "When is caching a query not worth it?",
          options: [
            "When it runs rarely",
            "When it is already fast: you add a network round trip and serialisation to save nothing",
            "When it returns many rows",
            "When it uses a join",
          ],
          correctIndex: 1,
          explanation: "Cache what is slow, not what is frequent.",
        },
      ],
    },
    {
      id: "invalidation-tags-and-locks",
      title: "Invalidation, cache tags & atomic locks",
      durationMinutes: 12,
      explanation: "Storing a value is easy. Knowing when it stopped being true is the hard part.\n\n---\n\n### 1. Basic — forget\n\n```php\nCache::forget('users');\n```\n\nThe standard flow:\n\n```text\nupdate the database → invalidate the cache\n```\n\n```text\nuser updated → DB update → Cache::forget(\"user:123\")\n```\n\n---\n\n### 2. Intermediate — why invalidation is hard\n\n```text\ndatabase: price = $100        cache: price = $100\n```\n\nSomebody changes the price:\n\n```text\ndatabase: price = $120        cache: price = $100\n```\n\n```text\ndatabase ≠ cache\n```\n\nTwo strategies:\n\n```text\nwrite → database → forget the cache      (recompute on next read)\nwrite → database → update the cache      (write-through)\n```\n\n<b>Forgetting is safer.</b> Updating means writing the value twice, and if the two writes disagree, or the second one fails after the first succeeded, you have cached something that was never true.\n\n<b>And the real difficulty is not one key, it is the other five.</b> Changing a price invalidates the product, the category listing, the search facet, the homepage block and the cached total. <b>Miss one and it stays wrong indefinitely</b>, which is why invalidation bugs are so long-lived: nothing errors, the page just quietly lies.\n\n---\n\n### 3. Advanced — tags and locks\n\n<b>Cache tags</b> group related entries:\n\n```text\nproducts\n ├── product:1\n ├── product:2\n └── product:3\n```\n\nSo you invalidate the group rather than tracking every key. <b>But not every driver supports tags</b>: file and database drivers do not, so a design built on tags cannot fall back to them. Check before you depend on it.\n\n<b>Atomic locks</b> solve a different problem. A popular key expires:\n\n```text\n100 requests → all miss → all run the expensive query\n```\n\n<b>That is a cache stampede</b>, and it is at its worst exactly when you can least afford it: the key expired because the page is popular, so a hundred copies of your slowest query arrive at once and the database falls over. <b>The cache expiring took the site down.</b>\n\nA lock serialises the rebuild:\n\n```text\nA obtains the lock → B, C, D wait\nA computes → A stores → A releases\nB, C, D read the cached value\n```\n\nThree things to get right.\n\n<b>Always set a lock timeout.</b> A process killed mid-rebuild without releasing leaves everyone waiting until it expires, which is the same 24-hour trap as Day 29's `withoutOverlapping()`.\n\n<b>Decide what waiters do.</b> Blocking is fine for a few seconds; beyond that, serving slightly stale data beats holding a hundred connections open.\n\n<b>And locks need shared storage.</b> On a file driver each server takes its own lock, so you have not prevented the stampede, you have made it three-way.\n\nAnd the blunt instrument, for completeness:\n\n```php\nCache::flush();     // the whole store, from PHP\n```\n\n<b>Which is almost never what you want in application code.</b> On a shared Redis it discards every other feature's cache too, and if your sessions live on the same store, it logs everybody out. Reach for a scoped `forget()` or a tag; keep `flush()` for `php artisan cache:clear` during a deploy.",
      diagram: `Invalidation

    Cache::forget('users');

    update the database → invalidate the cache

      user updated → DB update
                   → Cache::forget("user:123")


Why it is hard

    database: price = $100   cache: price = $100
              ↓ someone edits
    database: price = $120   cache: price = $100

              database ≠ cache

  Two strategies:

    write → database → FORGET      recompute on read
    write → database → UPDATE      write-through

    Forgetting is SAFER: updating writes the value
    twice, and if the two disagree — or the second
    fails after the first succeeded — you have cached
    something that was never true.

  ⚠️  The real difficulty is not one key. It is the
      other five.

      changing a price invalidates:
        the product · the category listing
        the search facet · the homepage block
        the cached total

      Miss one and it stays wrong INDEFINITELY.

      Which is why invalidation bugs are so
      long-lived: nothing errors, the page just
      quietly lies.


Cache tags

    products
      ├── product:1
      ├── product:2
      └── product:3

    invalidate the GROUP, not every key

  ⚠️  Not every driver supports tags. File and
      database do not — so a design built on tags
      cannot fall back to them.


Atomic locks — a different problem

    a popular key expires

      100 requests → all miss → all run the
                                expensive query

    THAT IS A CACHE STAMPEDE

  And it is worst exactly when you can least afford
  it: the key expired BECAUSE the page is popular, so
  a hundred copies of your slowest query arrive at
  once and the database falls over.

    the cache EXPIRING took the site down

  A lock serialises the rebuild:

    A obtains the lock
    B, C, D wait
        ↓
    A computes → stores → releases
        ↓
    B, C, D read the cached value


Three things to get right

  ALWAYS set a lock timeout

    a process killed mid-rebuild without releasing
    leaves everyone waiting until it expires

    same trap as Day 29's withoutOverlapping()

  Decide what WAITERS do

    blocking is fine for a few seconds
    beyond that, serving slightly stale data beats
    holding a hundred connections open

  Locks need SHARED STORAGE

    on a file driver each server takes its own lock —
    you have not prevented the stampede, you have
    made it three-way`,
      codeExample: {
        title: "Invalidating on write, tagging groups, and stopping a stampede",
        code: `<?php
// ---------- Invalidate on write, in one place ----------

class Product extends Model
{
    protected static function booted(): void
    {
        static::saved(fn (Product $p) => $p->flushCaches());
        static::deleted(fn (Product $p) => $p->flushCaches());
    }

    public function flushCaches(): void
    {
        // It is never one key. This is the list you will
        // forget to update in six months.
        Cache::forget("product:{$this->id}");
        Cache::forget("category:{$this->category_id}:products");
        Cache::forget('homepage:featured');
        Cache::forget("team:{$this->team_id}:catalogue-total");
    }
}

// Miss one and it stays wrong indefinitely. Nothing
// errors — the page just quietly lies.


<?php
// ---------- Tags: invalidate a group instead ----------

// Requires Redis or Memcached. File and database
// drivers do not support tags.
Cache::tags(['products', "category:{$id}"])
    ->remember("product:{$productId}", now()->addHour(), $fn);

// One line replaces the list above
Cache::tags(['products'])->flush();

// ⚠️ Check driver support before designing around this.
if (! Cache::supportsTags()) {
    // your fallback has to exist
}


<?php
// ---------- Forget vs update ----------

// ✅ Safer: recompute on the next read
DB::transaction(function () use ($product, $price) {
    $product->update(['price_cents' => $price]);
});
Cache::forget("product:{$product->id}");

// ⚠️ Write-through: the value is written twice, so a
//    disagreement or a failed second write caches
//    something that was never true
$product->update(['price_cents' => $price]);
Cache::put("product:{$product->id}", $product->fresh(), now()->addHour());


<?php
// ---------- The stampede, and the lock that stops it ----------

// ❌ A popular key expires at 09:00. One hundred
//    requests all miss, all run the eight-second query,
//    and the database falls over.
$report = Cache::remember('dashboard:global', now()->addMinutes(10),
    fn () => $this->buildExpensiveReport());

// ✅ One rebuild, everyone else waits for it
$report = Cache::get('dashboard:global');

if ($report === null) {
    $lock = Cache::lock('dashboard:global:rebuild', 30);   // ← always a timeout

    if ($lock->get()) {
        try {
            $report = $this->buildExpensiveReport();
            Cache::put('dashboard:global', $report, now()->addMinutes(10));
        } finally {
            $lock->release();
        }
    } else {
        // Decide what waiters do. Blocking for seconds is
        // fine; holding 100 connections is not.
        $lock->block(5);
        $report = Cache::get('dashboard:global') ?? $this->staleFallback();
    }
}


<?php
// ---------- Or: serve stale while one process rebuilds ----------

// Store with a longer TTL than the "freshness" window,
// so there is always something to serve.
$entry = Cache::get('dashboard:global');

if ($entry && $entry['fresh_until'] > now()) {
    return $entry['value'];                    // fresh
}

if ($entry && Cache::lock('dashboard:rebuild', 30)->get()) {
    dispatch(new RebuildDashboard());          // refresh in the background
}

return $entry['value'] ?? $this->buildExpensiveReport();   // stale beats down


<?php
// ---------- Locks need shared storage ----------

// CACHE_STORE=file, three servers:
//   server A takes its own lock  → runs the query
//   server B takes its own lock  → runs the query
//   server C takes its own lock  → runs the query
//
// You did not prevent the stampede. You made it
// three-way. Same rule as Day 29's isolation locks.`,
      },
      keyTakeaways: [
        "<b>The standard flow is write to the database, then invalidate the cache.</b>",
        "<b>Stale cache means the database and cache disagree</b>, and nothing errors while it happens.",
        "<b>Forgetting is safer than updating</b>, because write-through writes the value twice.",
        "<b>The hard part is the other five keys</b>: product, listing, facet, homepage block, total.",
        "<b>A missed key stays wrong indefinitely</b>, which is why invalidation bugs live so long.",
        "<b>Cache tags group related entries</b> so you can invalidate the group.",
        "<b>File and database drivers do not support tags</b>, so a tag-based design cannot fall back to them.",
        "<b>A cache stampede is a hundred requests all missing and all running the expensive query.</b>",
        "<b>It happens at the worst moment</b>, because the key expired precisely because the page is popular.",
        "<b>An atomic lock serialises the rebuild</b> so one process computes and the rest read the result.",
        "<b>Always give a lock a timeout</b>, or a killed process blocks everyone until it expires.",
        "<b>Locks need shared storage</b>, or each server takes its own and the stampede becomes three-way.",
      ],
      commonMistakes: [
        "<b>Invalidating only the obvious key.</b> The listing and the totals stay wrong for weeks.",
        "<b>Designing around tags without checking the driver.</b> File and database drivers do not support them.",
        "<b>No lock on an expensive popular key.</b> Its expiry becomes an outage.",
        "<b>A lock with no timeout.</b> One killed process blocks every request behind it.",
        "<b>Locks on a file cache driver.</b> Each server locks itself and nothing is coordinated.",
      ],
      quiz: [
        {
          question: "Why is forgetting a key safer than updating it?",
          options: [
            "It is faster",
            "Write-through writes the value twice, so a disagreement or failed second write caches something untrue",
            "It uses less memory",
            "It is not safer",
          ],
          correctIndex: 1,
          explanation: "Forgetting makes the next read recompute from the source of truth.",
        },
        {
          question: "What makes invalidation bugs so long-lived?",
          options: [
            "They throw silently",
            "Nothing errors: a missed key just serves wrong data indefinitely",
            "They only occur in production",
            "Tags hide them",
          ],
          correctIndex: 1,
          explanation: "One price change usually invalidates five different keys.",
        },
        {
          question: "Why is a cache stampede worst on your most popular pages?",
          options: [
            "They have more data",
            "The key expired because the page is popular, so a hundred copies of the slow query arrive at once",
            "They use more memory",
            "They have longer TTLs",
          ],
          correctIndex: 1,
          explanation: "The cache expiring is what takes the site down.",
        },
        {
          question: "What does an atomic lock need to work across servers?",
          options: [
            "A queue",
            "Shared cache storage, or each server takes its own lock and nothing is coordinated",
            "A database transaction",
            "A longer TTL",
          ],
          correctIndex: 1,
          explanation: "Same rule as Day 29's isolation locks.",
        },
      ],
    },
    {
      id: "redis-pipelining-and-pubsub",
      title: "Redis connections, pipelining & pub/sub",
      durationMinutes: 11,
      explanation: "Beyond `Cache::get`, Redis is a general-purpose tool you talk to directly.\n\n---\n\n### 1. Basic — connections\n\nRedis supports multiple logical connections and databases:\n\n```text\nLaravel\n  ├── cache Redis\n  ├── queue Redis\n  └── application Redis\n```\n\nSame reasoning as the first lesson: <b>separating workloads stops one from destroying another.</b> The application connection is for things you use Redis for deliberately, counters, leaderboards, sets, rather than as a cache.\n\n---\n\n### 2. Intermediate — pipelining\n\nWithout it, every command is a round trip:\n\n```text\nLaravel → Redis\nLaravel → Redis\nLaravel → Redis\nLaravel → Redis\n```\n\nWith pipelining:\n\n```text\nLaravel ──── batch ────→ Redis (many operations)\n```\n\n<b>The saving is network latency, not Redis time.</b> Redis handles a command in microseconds; the round trip takes a millisecond or so. So a thousand commands is roughly a second of waiting, almost all of it doing nothing, and pipelined it becomes a few milliseconds.\n\n<b>Which means the loop is the thing to look for</b>, not the individual call. `Cache::get` inside a `foreach` over five hundred items is five hundred round trips, and it is the exact same shape as the N+1 problem from Day 15, just against Redis instead of your database. <b>Use `Cache::many()` and `Cache::putMany()`</b>, which pipeline for you.\n\n---\n\n### 3. Advanced — pub/sub, and what it is not\n\n```text\npublisher → Redis channel → subscribers\n```\n\n```text\norder service → \"order.created\" → Redis\n   ├── email\n   ├── analytics\n   └── notifications\n```\n\n<b>The critical distinction:</b>\n\n> <b>Pub/sub is messaging, not storage.</b>\n\nA message is delivered to whoever is listening <b>at that moment</b> and then it is gone. No subscriber connected means nobody receives it, and there is no retry, no acknowledgement and no record that it happened. <b>A subscriber restarting during a deploy misses everything published during the restart</b>, silently.\n\nSo the rule is straightforward: <b>if losing the message matters, use a queue.</b> Day 25's queues persist jobs, retry them and record failures, which is exactly what pub/sub does not do.\n\nPub/sub is right for genuinely ephemeral fan-out: live dashboard updates, cache-invalidation signals between servers, presence pings. <b>Anything you would be upset to lose belongs on a queue</b>, and this is also why Day 27's broadcasting sits on top of a different mechanism when durability matters.\n\nOne last note: a Redis subscriber holds a connection open and blocks, so it is a long-running process with all the supervision needs of a queue worker, not something you start in a controller.\n\nOne last note on using Redis directly, since `Cache::` is not the only door:\n\n```php\nRedis::set('invoice:5:status', 'paid');\nRedis::get('invoice:5:status');\nRedis::expire('invoice:5:status', 3600);\nRedis::del('invoice:5:status');\n```\n\nAnd <b>hashes</b>, which store a record as fields under one key:\n\n```php\nRedis::hset('invoice:5', 'status', 'paid');\nRedis::hset('invoice:5', 'total', 3000);\n\nRedis::hget('invoice:5', 'status');\nRedis::hgetall('invoice:5');\n```\n\n<b>The gain over one serialised blob is that you can read or update a single field</b> without fetching and rewriting the whole thing. Worth knowing, and worth noting that anything you reach for `Redis::` directly for is outside `Cache::`, so it has no driver abstraction and does not disappear on `cache:clear`.",
      diagram: `Connections — separate the workloads

    Laravel
      ├── cache Redis
      ├── queue Redis
      └── application Redis

  Same reasoning as lesson 1: separating workloads
  stops one destroying another.

  The application connection is for what you use Redis
  for DELIBERATELY — counters, leaderboards, sets —
  rather than as a cache.


Pipelining

  Without:

    Laravel → Redis
    Laravel → Redis
    Laravel → Redis
    Laravel → Redis        ← a round trip each time

  With:

    Laravel ──── batch ────→ Redis
                            many operations

  ⚠️  The saving is NETWORK LATENCY, not Redis time.

      Redis handles a command in microseconds.
      The round trip takes ~1ms.

        1,000 commands ≈ 1 second of waiting,
        almost all of it doing nothing

        pipelined ≈ a few milliseconds

  So look for the LOOP, not the call:

    Cache::get inside a foreach over 500 items
      = 500 round trips

    the exact shape of Day 15's N+1 — against Redis
    instead of your database

      Cache::many() · Cache::putMany()
      pipeline for you


Pub/sub

    publisher → Redis channel → subscribers

    order service → "order.created" → Redis
                       ├── email
                       ├── analytics
                       └── notifications


  ⚠️  THE CRITICAL DISTINCTION

      PUB/SUB IS MESSAGING, NOT STORAGE.

      Delivered to whoever is listening AT THAT
      MOMENT, then gone.

        no subscriber connected → nobody receives it
        no retry
        no acknowledgement
        no record that it happened

      A subscriber restarting during a deploy misses
      everything published during the restart —
      silently.


  THE RULE

    If losing the message matters, USE A QUEUE.

    Day 25's queues persist, retry and record
    failures. That is exactly what pub/sub does not
    do.

  Pub/sub is right for genuinely ephemeral fan-out:

    live dashboard updates
    cache-invalidation signals between servers
    presence pings

  Anything you would be upset to lose belongs on a
  queue.


  And a subscriber holds a connection open and blocks:
  a long-running process with all the supervision
  needs of a queue worker — not something you start in
  a controller.`,
      codeExample: {
        title: "Pipelining a loop, and choosing pub/sub or a queue",
        code: `<?php
// ---------- The Redis N+1 ----------

// ❌ 500 network round trips. ~500ms of pure waiting.
foreach ($productIds as $id) {
    $prices[$id] = Cache::get("product:{$id}:price");
}

// ✅ One round trip
$keys   = collect($productIds)->map(fn ($id) => "product:{$id}:price");
$prices = Cache::many($keys->all());

// Same shape as Day 15's N+1, against Redis instead of
// your database.


<?php
// ---------- Writing many ----------

// ❌
foreach ($products as $product) {
    Cache::put("product:{$product->id}:price", $product->price_cents, 3600);
}

// ✅
Cache::putMany(
    $products->mapWithKeys(fn ($p) => ["product:{$p->id}:price" => $p->price_cents])->all(),
    3600,
);


<?php
// ---------- Raw pipelining, when you need Redis commands ----------

Redis::pipeline(function ($pipe) use ($views) {
    foreach ($views as $postId => $count) {
        $pipe->incrby("views:post:{$postId}", $count);
        $pipe->expire("views:post:{$postId}", 86400);
    }
});

// 2,000 commands, one round trip.

// transaction() when they must all apply together
Redis::transaction(function ($tx) use ($from, $to, $amount) {
    $tx->decrby("credits:{$from}", $amount);
    $tx->incrby("credits:{$to}", $amount);
});


<?php
// ---------- Separate connections ----------

Redis::connection('cache')->get('key');
Redis::connection('queue')->llen('queues:default');
Redis::connection('default')->zadd('leaderboard', 950, "user:{$id}");


<?php
// ---------- ⚠️ Pub/sub: fire and forget, literally ----------

// Publisher
Redis::publish('dashboard.updated', json_encode([
    'team_id' => $team->id,
    'total'   => $total,
]));

// Subscriber — a long-running process, supervised like
// a queue worker. Never started from a controller.
class SubscribeToDashboard extends Command
{
    protected $signature = 'dashboard:subscribe';

    public function handle(): int
    {
        Redis::subscribe(['dashboard.updated'], function (string $message) {
            $this->broadcastToWebsocket(json_decode($message, true));
        });

        return self::SUCCESS;
    }
}

// During a deploy this process restarts. Everything
// published in those four seconds is gone. No retry,
// no record, no error.


<?php
// ---------- The choice, made explicit ----------

// ❌ Pub/sub for something that matters
Redis::publish('invoice.paid', json_encode(['id' => $invoice->id]));
// The listener was restarting. The receipt never sent.
// Nothing failed. Nothing was logged.

// ✅ A queue: persisted, retried, failures recorded
SendPaymentReceipt::dispatch($invoice);

// ✅ Pub/sub for genuinely ephemeral fan-out
Redis::publish('presence.ping', json_encode(['user' => $user->id]));
Redis::publish('cache.invalidate', json_encode(['key' => "product:{$id}"]));


<?php
// ---------- A useful non-cache use of Redis ----------

Redis::zadd('leaderboard:weekly', $score, "user:{$user->id}");
Redis::zrevrange('leaderboard:weekly', 0, 9, 'WITHSCORES');

// Sorted sets, counters and sets are things Redis does
// well that your database does awkwardly. That is the
// "application" connection.`,
      },
      keyTakeaways: [
        "<b>Redis supports separate connections and databases</b>, so cache, queue and application data stay apart.",
        "<b>Pipelining batches commands into one round trip.</b>",
        "<b>The saving is network latency</b>: Redis is microseconds, the round trip is a millisecond.",
        "<b>A thousand un-pipelined commands is about a second of pure waiting.</b>",
        "<b>Look for the loop, not the call.</b> `Cache::get` inside a `foreach` is Day 15's N+1 against Redis.",
        "<b>`Cache::many()` and `Cache::putMany()` pipeline for you.</b>",
        "<b>Pub/sub is messaging, not storage</b>: delivered to whoever is listening, then gone.",
        "<b>No subscriber means nobody receives it</b>, with no retry, acknowledgement or record.",
        "<b>A subscriber restarting during a deploy silently misses everything published.</b>",
        "<b>If losing the message matters, use a queue</b>, which persists, retries and records failures.",
        "<b>Pub/sub suits ephemeral fan-out</b>: live dashboard updates, invalidation signals, presence pings.",
        "<b>A subscriber is a supervised long-running process</b>, never started from a controller.",
      ],
      commonMistakes: [
        "<b>Cache calls inside a loop.</b> Hundreds of round trips, and the profile blames Redis rather than your loop.",
        "<b>Using pub/sub for anything that matters.</b> A deploy-time restart drops messages silently.",
        "<b>Expecting pub/sub retries.</b> There is no acknowledgement and no record it happened.",
        "<b>One Redis connection for cache, queue and app data.</b> One workload's problem becomes everyone's.",
        "<b>Starting a subscriber from a web request.</b> It blocks and holds a connection open.",
      ],
      quiz: [
        {
          question: "What does pipelining actually save?",
          options: [
            "Redis CPU time",
            "Network round trips: Redis is microseconds per command, the round trip is a millisecond",
            "Memory",
            "Serialisation",
          ],
          correctIndex: 1,
          explanation: "A thousand un-pipelined commands is about a second of waiting.",
        },
        {
          question: "What pattern should you look for when profiling Redis usage?",
          options: [
            "Large values",
            "Cache calls inside a loop, which is the N+1 shape against Redis",
            "Long keys",
            "Expired keys",
          ],
          correctIndex: 1,
          explanation: "`Cache::many()` and `putMany()` pipeline it for you.",
        },
        {
          question: "What is the critical property of Redis pub/sub?",
          options: [
            "It persists messages",
            "It is messaging, not storage: no listener means the message is simply gone",
            "It retries automatically",
            "It acknowledges delivery",
          ],
          correctIndex: 1,
          explanation: "A subscriber restarting during a deploy misses everything silently.",
        },
        {
          question: "When should you use a queue instead of pub/sub?",
          options: [
            "For live dashboards",
            "Whenever losing the message matters, since queues persist, retry and record failures",
            "For presence pings",
            "Never",
          ],
          correctIndex: 1,
          explanation: "Pub/sub suits genuinely ephemeral fan-out only.",
        },
      ],
    },
    {
      id: "query-optimization",
      title: "Indexes, EXPLAIN, columns & N+1",
      durationMinutes: 13,
      explanation: "Before you cache anything, fix the thing you were about to cache.\n\n<b>Caching is not the first solution to a bad query.</b> It is a way to run a bad query less often, which leaves the bad query in place for every cache miss, every invalidation and every new page that needs the same data.\n\n---\n\n### 1. Basic — indexes\n\n```sql\nSELECT * FROM orders WHERE user_id = 123 ORDER BY created_at DESC;\n```\n\nWith no index on `user_id`, the database reads a great many rows to find a few.\n\n```text\nwithout   1M rows → scan → find matches\nwith      1M rows → index → jump to matches\n```\n\n```sql\nCREATE INDEX orders_user_id_index ON orders(user_id);\n```\n\n<b>An index frequently beats caching by more</b>, and it helps every query on that column rather than the one you remembered to wrap.\n\n---\n\n### 2. Intermediate — composite indexes and EXPLAIN\n\nFor:\n\n```sql\nWHERE user_id = ? AND status = ? ORDER BY created_at DESC\n```\n\nOne composite index beats three separate ones:\n\n```text\n(user_id, status, created_at)\n```\n\n<b>Order matters, and it is not arbitrary.</b> An index on `(user_id, status)` serves a query filtering on `user_id` alone; one on `(status, user_id)` does not. <b>Equality columns first, then the range or sort column</b>, and having `created_at` last is what lets the database skip sorting entirely.\n\nAnd then stop guessing:\n\n```sql\nEXPLAIN ANALYZE SELECT ...\n```\n\n```text\nindex scan or sequential scan?  rows examined vs returned?\njoin strategy?  sort cost?\n```\n\n<b>The number to look at is rows examined versus rows returned.</b> Examining 400,000 to return 20 tells you exactly what is wrong, and no amount of reading the query would have.\n\n<b>Indexes are not free.</b> Each one slows every insert and update and takes disk space, so an unused index is pure cost. Add them from real query patterns, not speculation.\n\n---\n\n### 3. Advanced — data volume and N+1\n\n<b>Select only what you need:</b>\n\n```php\nUser::select(['id', 'name'])->get();\n```\n\nInstead of pulling every column, you move less data and hydrate less:\n\n```text\nless I/O · less memory · less network · less hydration\n```\n\n<b>The hidden win is covering indexes.</b> If an index contains every column you selected, the database answers from the index and never touches the table at all.\n\n<b>And then N+1</b>, from Day 15:\n\n```php\n$posts = Post::all();\nforeach ($posts as $post) { echo $post->user->name; }   // 101 queries\n\n$posts = Post::with('user')->get();                      // 2 queries\n```\n\n<b>Caching is not the fix for N+1.</b> It hides it: the first request still runs 101 queries, every cache miss runs 101 queries, and the moment the data changes you are back to 101. <b>Fix the query architecture first</b>, then decide whether the two remaining queries are worth caching.\n\nOne more, because it is the version that bites in production: <b>a page that is fast on your machine and slow on production usually has an N+1 you cannot see at 50 rows.</b> Ten posts is eleven queries and feels fine. Ten thousand is unusable. Turn on `Model::preventLazyLoading()` in development and the problem announces itself instead of waiting.",
      diagram: `Caching is not the fix for a bad query

  It runs the bad query LESS OFTEN — leaving it in
  place for every cache miss, every invalidation, and
  every new page that needs the same data.


Indexes

    SELECT * FROM orders
    WHERE user_id = 123
    ORDER BY created_at DESC;

    without   1M rows → scan → find matches
    with      1M rows → index → jump to matches

    CREATE INDEX orders_user_id_index ON orders(user_id);

  Frequently beats caching by more — and helps EVERY
  query on that column, not just the one you
  remembered to wrap.


Composite indexes

    WHERE user_id = ? AND status = ?
    ORDER BY created_at DESC

      (user_id, status, created_at)

  ⚠️  Order matters, and is not arbitrary.

      (user_id, status)  serves a query on user_id
                         alone
      (status, user_id)  does not

      EQUALITY columns first, then the range/sort
      column. created_at last is what lets the
      database skip sorting entirely.


EXPLAIN — stop guessing

    EXPLAIN ANALYZE SELECT ...

      index scan or sequential scan?
      rows examined vs rows RETURNED?
      join strategy?  sort cost?

  ⚠️  The number to look at is EXAMINED vs RETURNED.

      examining 400,000 to return 20 tells you
      exactly what is wrong — and no amount of
      reading the query would have

  And indexes are not free: each slows every insert
  and update and costs disk. An unused index is pure
  cost. Add them from real query patterns.


Select only what you need

    User::select(['id', 'name'])->get();

      less I/O · less memory · less network
      less hydration

  The hidden win: a COVERING INDEX. If the index
  contains every column you selected, the database
  answers from the index and never touches the table.


N+1 — Day 15, again

    Post::all();
    foreach → $post->user->name        101 queries

    Post::with('user')->get();           2 queries

  ⚠️  CACHING IS NOT THE FIX FOR N+1.

      It hides it:
        the first request still runs 101 queries
        every cache miss runs 101 queries
        the data changes → back to 101

      Fix the query architecture FIRST. Then decide
      whether the two remaining queries are worth
      caching.


  And the production version:

    fast on your machine, slow in production
      = an N+1 you cannot see at 50 rows

      10 posts     → 11 queries, feels fine
      10,000 posts → unusable

    Model::preventLazyLoading() in development makes
    it announce itself instead of waiting.`,
      codeExample: {
        title: "Index, explain, trim, and kill the N+1",
        code: `<?php
// ---------- The index ----------

Schema::table('orders', function (Blueprint $table) {
    // Equality first, then the sort column — so the
    // database can skip sorting entirely
    $table->index(['user_id', 'status', 'created_at']);
});

// This one composite index serves:
//   WHERE user_id = ?
//   WHERE user_id = ? AND status = ?
//   WHERE user_id = ? AND status = ? ORDER BY created_at DESC
//
// It does NOT serve:
//   WHERE status = ?          ← wrong leading column


# ---------- EXPLAIN: ask, do not guess ----------

EXPLAIN ANALYZE
SELECT * FROM orders
WHERE user_id = 123 AND status = 'paid'
ORDER BY created_at DESC
LIMIT 20;

# Before
#   Seq Scan on orders  (rows=412,000)
#   Filter: (user_id = 123 AND status = 'paid')
#   Rows Removed by Filter: 411,980
#   Execution Time: 890 ms
#
#   ← 412,000 examined to return 20. That is the number.

# After
#   Index Scan using orders_user_id_status_created_at_index
#   (rows=20)
#   Execution Time: 0.8 ms


<?php
// ---------- Laravel-side profiling ----------

DB::listen(function ($query) {
    if ($query->time > 100) {
        Log::warning('Slow query', [
            'sql'      => $query->sql,
            'bindings' => $query->bindings,
            'time'     => $query->time,
        ]);
    }
});

// Or for one page, right now:
DB::enableQueryLog();
// ... the code ...
dd(count(DB::getQueryLog()), DB::getQueryLog());


<?php
// ---------- Select only what you need ----------

// ❌ Every column, including a 40KB description
User::all();

// ✅
User::select(['id', 'name'])->get();

// And if an index covers (id, name), the database
// answers from the index and never reads the table.

// The relation version, which people forget:
Post::with(['user:id,name', 'comments:id,post_id,body'])->get();


<?php
// ---------- N+1: fix it, do not cache it ----------

// ❌ 1 + 100 + 100 + 100 = 301 queries
$posts = Post::latest()->get();

foreach ($posts as $post) {
    echo $post->user->name;

    foreach ($post->comments as $comment) {
        echo $comment->user->name;
    }
}

// ❌❌ Worse: caching the symptom
Cache::remember('posts-page', now()->addMinutes(5), function () {
    // still 301 queries on every miss, and every
    // invalidation, and the first request after a deploy
});

// ✅ 4 queries
$posts = Post::with(['user', 'comments.user'])->latest()->get();

// ✅ And when you only need a count
$posts = Post::withCount('comments')->latest()->get();


<?php
// ---------- Make it impossible to reintroduce ----------

// app/Providers/AppServiceProvider.php
public function boot(): void
{
    Model::preventLazyLoading(! $this->app->isProduction());
    Model::preventSilentlyDiscardingAttributes(! $this->app->isProduction());
}

// Now a lazy load throws in development instead of
// waiting to be slow in production, where 10,000 rows
// makes the difference you could not see at 50.


<?php
// ---------- Chunk what you cannot trim ----------

// ❌ 400,000 models in memory
foreach (Order::all() as $order) { ... }

// ✅
Order::query()->chunkById(500, function ($orders) { ... });
Order::query()->lazyById()->each(function ($order) { ... });`,
      },
      keyTakeaways: [
        "<b>Caching a bad query runs it less often; it does not fix it.</b>",
        "<b>An index turns a scan into a jump</b>, and helps every query on that column.",
        "<b>A composite index beats three separate ones</b> for a multi-column filter.",
        "<b>Column order matters</b>: equality columns first, then the range or sort column.",
        "<b>`(user_id, status)` serves a `user_id`-only query; `(status, user_id)` does not.</b>",
        "<b>`EXPLAIN ANALYZE` tells you what the database will actually do.</b>",
        "<b>Rows examined versus rows returned is the number that matters.</b>",
        "<b>Indexes are not free</b>: each slows writes and costs disk, so an unused one is pure cost.",
        "<b>Selecting only needed columns cuts I/O, memory, network and hydration.</b>",
        "<b>A covering index lets the database answer without touching the table.</b>",
        "<b>Caching is not the fix for N+1</b>: every miss still runs all 101 queries.",
        "<b>An N+1 invisible at 50 rows is fatal at 10,000</b>, so use `preventLazyLoading` in development.",
      ],
      commonMistakes: [
        "<b>Caching the slow page instead of fixing the query.</b> Every miss pays the full cost.",
        "<b>Guessing at query plans.</b> `EXPLAIN ANALYZE` answers in seconds what an afternoon of reading will not.",
        "<b>Adding an index per column.</b> Three single-column indexes rarely beat one composite one.",
        "<b>Getting composite column order wrong.</b> The index then serves fewer queries than you think.",
        "<b>Indexing speculatively.</b> Unused indexes slow every write for nothing.",
        "<b>`select *` everywhere.</b> You move and hydrate columns nobody reads.",
      ],
      quiz: [
        {
          question: "Why is caching not the answer to a slow query?",
          options: [
            "It is too complex",
            "It runs the bad query less often, leaving it for every miss, invalidation and new page",
            "Caches are unreliable",
            "It is the answer",
          ],
          correctIndex: 1,
          explanation: "Fix the query, then decide whether it still needs caching.",
        },
        {
          question: "What order should a composite index use?",
          options: [
            "Alphabetical",
            "Equality columns first, then the range or sort column",
            "Most selective last",
            "Any order",
          ],
          correctIndex: 1,
          explanation: "`(user_id, status)` serves a `user_id`-only query; `(status, user_id)` does not.",
        },
        {
          question: "What is the key number in an `EXPLAIN ANALYZE` output?",
          options: [
            "Total cost",
            "Rows examined versus rows returned",
            "Planning time",
            "Buffer count",
          ],
          correctIndex: 1,
          explanation: "Examining 400,000 to return 20 tells you exactly what is wrong.",
        },
        {
          question: "Why does an N+1 often only appear in production?",
          options: [
            "Different PHP version",
            "Eleven queries at 50 rows feels fine; at 10,000 rows it is unusable",
            "Caching is disabled there",
            "The index is missing",
          ],
          correctIndex: 1,
          explanation: "`preventLazyLoading` in development makes it announce itself.",
        },
      ],
    },
    {
      id: "deployment-caches",
      title: "Route, config, view & event caching",
      durationMinutes: 11,
      explanation: "A different kind of caching: not your data, but Laravel's own startup work.\n\n---\n\n### 1. Basic — the four\n\n```bash\nphp artisan route:cache\nphp artisan config:cache\nphp artisan view:cache\nphp artisan event:cache\n```\n\n```text\nroute files  → a compiled representation → faster bootstrap\nconfig files → one cached array          → faster config loading\nBlade views  → precompiled PHP           → no compilation per request\nlisteners    → a discovered map          → no discovery per boot\n```\n\n<b>These are deployment steps, not things you touch while developing.</b> In development they actively get in your way, because a cached route file means your new route does not exist until you clear it.\n\nOr all at once:\n\n```bash\nphp artisan optimize\nphp artisan optimize:clear\n```\n\n---\n\n### 2. Intermediate — the config rule\n\n<b>This is the one that causes real incidents:</b>\n\n> After config is cached, `env()` returns `null` outside config files.\n\n```text\nnot cached   env() reads .env, everywhere, and works\ncached       env() returns null anywhere except config/\n```\n\nSo a service class calling `env('STRIPE_KEY')` works perfectly in development and returns `null` in production, <b>the moment somebody runs `config:cache`</b>. Not at deploy time necessarily. Whenever that command next runs.\n\n<b>The rule is absolute: `env()` belongs in `config/` files only.</b> Everywhere else, `config('services.stripe.key')`. Grep for `env(` outside `config/` right now; on most codebases you will find some.\n\nAnd the sequel: <b>changing `.env` in production does nothing until you re-run `config:cache`.</b> People edit the file, restart nothing, and spend an hour wondering why the new API key is not being used.\n\n---\n\n### 3. Advanced — what breaks, and what the gain is\n\n<b>`route:cache` fails with closure routes.</b> A closure cannot be serialised, so the command errors out. That is a reason to use controller classes, which is where they belonged anyway.\n\n<b>And a cached route file that is stale is invisible.</b> Nothing warns you; the old routes just keep working. So caching must be part of the deploy script, not something a person remembers.\n\n<b>Be honest about the size of the win.</b> These save framework bootstrap time: a few milliseconds to perhaps twenty on a large application. <b>That is worth having and it is not going to fix a 1.8-second page.</b> If your page is slow, it is your queries, not Laravel's boot.\n\nWhere it does matter is <b>high request volume</b>, because you pay boot cost on every single request. Twenty milliseconds across a million requests a day is real.\n\n<b>The rule that ties it together:</b> caching must go in the deploy script, and clearing must happen before anything else in development. A half-cached deploy, config cached against the previous `.env`, is a genuinely confusing outage, because the code is right, the environment file is right, and the application disagrees with both.",
      diagram: `Four deployment caches

    php artisan route:cache
    php artisan config:cache
    php artisan view:cache
    php artisan event:cache

    route files  → compiled representation
                   → faster bootstrap
    config files → one cached array
                   → faster config loading
    Blade views  → precompiled PHP
                   → no compilation per request
    listeners    → a discovered map
                   → no discovery per boot

  DEPLOYMENT steps. Not things you touch while
  developing — a cached route file means your new
  route does not exist until you clear it.

    php artisan optimize
    php artisan optimize:clear


  ⚠️  THE CONFIG RULE — the one that causes incidents

      After config is cached, env() returns NULL
      outside config files.

        not cached   env() reads .env everywhere,
                     and works
        cached       env() → null anywhere except
                     config/

      So a service calling env('STRIPE_KEY') works
      perfectly in development and returns null in
      production — the moment somebody runs
      config:cache.

      Not necessarily at deploy time. Whenever that
      command next runs.

    THE RULE IS ABSOLUTE

      env()    in config/ files ONLY
      config() everywhere else

    Grep for env( outside config/ right now. Most
    codebases have some.

  And the sequel:

    changing .env in production does NOTHING until
    you re-run config:cache

    people edit the file, restart nothing, and spend
    an hour wondering why the new API key is ignored


What breaks

  route:cache FAILS with closure routes

    a closure cannot be serialised — which is a
    reason to use controller classes, where they
    belonged anyway

  A stale cached route file is INVISIBLE

    nothing warns you; the old routes keep working
    → caching belongs in the DEPLOY SCRIPT, not in
      somebody's memory


Be honest about the win

    these save FRAMEWORK BOOTSTRAP time
    a few ms, up to ~20ms on a large app

    worth having. NOT going to fix a 1.8s page.

    if your page is slow it is your QUERIES, not
    Laravel's boot

  Where it does matter: HIGH REQUEST VOLUME. You pay
  boot cost on every request, and 20ms × 1M/day is
  real.


  ⚠️  A half-cached deploy — config cached against
      the PREVIOUS .env — is a genuinely confusing
      outage: the code is right, the env file is
      right, and the application disagrees with both.`,
      codeExample: {
        title: "The deploy script, and the env() rule",
        code: `# ---------- The deploy script ----------

php artisan down --render="errors::503"

git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force

# Clear first, then cache — against the CURRENT .env
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

php artisan queue:restart        # workers hold old code in memory
php artisan up

# A half-cached deploy — config cached against the
# PREVIOUS .env — is a confusing outage: the code is
# right, the env file is right, and the app disagrees
# with both.


<?php
// ---------- ⚠️ The env() rule ----------

// ❌ Works in development. Returns null in production
//    the moment config:cache runs.
class StripeGateway
{
    public function __construct()
    {
        $this->key = env('STRIPE_SECRET');      // null once cached
    }
}

// ✅ config/services.php — the ONLY place env() belongs
return [
    'stripe' => [
        'secret' => env('STRIPE_SECRET'),
        'key'    => env('STRIPE_KEY'),
    ],
];

// ✅ Everywhere else
class StripeGateway
{
    public function __construct()
    {
        $this->key = config('services.stripe.secret');
    }
}


# ---------- Find them now ----------

grep -rn "env(" app/ routes/ database/ | grep -v "config/"

# Most codebases have at least one. Each is a
# production null waiting for somebody to run
# config:cache.


<?php
// ---------- route:cache and closures ----------

// ❌ php artisan route:cache fails: closures cannot be
//    serialised
Route::get('/health', function () {
    return response()->json(['ok' => true]);
});

// ✅
Route::get('/health', HealthController::class);

// Which is where it belonged anyway.


# ---------- Changing .env in production ----------

# ❌ Edit .env, wonder why nothing changed
vim .env

# ✅
vim .env
php artisan config:cache          # rebuild against the new values
php artisan queue:restart         # workers cached the old config too


# ---------- Local development: the opposite ----------

php artisan optimize:clear

# A cached route file locally means your new route
# genuinely does not exist. This is the first thing to
# try when a route 404s for no reason.


# ---------- Honest numbers ----------

# Before optimize:  bootstrap ≈ 25ms
# After optimize:   bootstrap ≈  6ms
#
# Real, and worth having on every request.
#
# Your 1.8s page was 1.75s of queries. This changes
# nothing about that. Fix the queries.
#
# Where it counts: 19ms × 1,000,000 requests/day.


<?php
// ---------- Verify what is actually cached ----------

php artisan about        // shows which caches are active

// Output includes:
//   Config ............ CACHED
//   Events ............ NOT CACHED
//   Routes ............ CACHED
//   Views ............. CACHED`,
      },
      keyTakeaways: [
        "<b>`route:cache`, `config:cache`, `view:cache` and `event:cache` speed up framework bootstrap.</b>",
        "<b>They are deployment steps</b>, and in development they get in your way.",
        "<b>After config is cached, `env()` returns `null` outside config files.</b>",
        "<b>So `env()` belongs in `config/` only, and `config()` everywhere else.</b>",
        "<b>The failure appears whenever `config:cache` runs</b>, not necessarily at deploy time.",
        "<b>Changing `.env` in production does nothing until you re-run `config:cache`.</b>",
        "<b>`route:cache` fails on closure routes</b>, since closures cannot be serialised.",
        "<b>A stale cached route file is invisible</b>: the old routes simply keep working.",
        "<b>So caching belongs in the deploy script</b>, not in somebody's memory.",
        "<b>The gain is a few milliseconds to about twenty of bootstrap time.</b>",
        "<b>That will not fix a slow page</b>, which is almost always queries rather than boot.",
        "<b>It matters most at high request volume</b>, since you pay boot cost on every request.",
      ],
      commonMistakes: [
        "<b>Calling `env()` outside config files.</b> It returns `null` the moment config is cached.",
        "<b>Editing `.env` in production without re-caching.</b> Nothing changes and nobody knows why.",
        "<b>Caching routes with closures still in the file.</b> The command fails during deploy.",
        "<b>Caching before clearing.</b> You cache against the previous environment values.",
        "<b>Expecting these to fix a slow page.</b> Twenty milliseconds against 1.8 seconds of queries.",
        "<b>Forgetting `queue:restart`.</b> Workers keep running the old code and old config.",
      ],
      quiz: [
        {
          question: "What happens to `env()` after `config:cache` runs?",
          options: [
            "Nothing",
            "It returns `null` anywhere outside config files",
            "It reads from the cache",
            "It throws an exception",
          ],
          correctIndex: 1,
          explanation: "So `env()` belongs in `config/` only, and `config()` everywhere else.",
        },
        {
          question: "Why does changing `.env` in production appear to do nothing?",
          options: [
            "The file is read-only",
            "Config is cached, so the values are not re-read until `config:cache` runs again",
            "Laravel ignores it",
            "It needs a reboot",
          ],
          correctIndex: 1,
          explanation: "And workers need `queue:restart` too.",
        },
        {
          question: "Why does `route:cache` fail on some applications?",
          options: [
            "Too many routes",
            "Closure routes cannot be serialised",
            "Missing middleware",
            "Duplicate names",
          ],
          correctIndex: 1,
          explanation: "Use controller classes instead, which is where they belonged.",
        },
        {
          question: "How much do these caches actually save?",
          options: [
            "Most of the page time",
            "A few milliseconds to about twenty of bootstrap, which matters at volume but will not fix a slow page",
            "Nothing measurable",
            "Half the response time",
          ],
          correctIndex: 1,
          explanation: "A 1.8-second page is queries, not boot.",
        },
      ],
    },
    {
      id: "octane",
      title: "Octane — long-running workers & shared state",
      durationMinutes: 12,
      explanation: "Octane changes the execution model PHP has had since the beginning, and that change is both the gain and the danger.\n\n---\n\n### 1. Basic — the shift\n\n<b>Traditional PHP:</b>\n\n```text\nrequest → boot Laravel → execute → response → process ends\n```\n\nEvery request rebuilds the entire framework, then throws it away.\n\n<b>Octane:</b>\n\n```text\nLaravel boots once → request 1 → request 2 → request 3 → …\n```\n\nThe application stays in memory. <b>You stop paying for boot on every request</b>, which is where the gain comes from.\n\nIt runs on <b>FrankenPHP</b> or <b>Swoole</b>, and the server matters far less than the idea: <b>keep the application alive between requests.</b>\n\n---\n\n### 2. Intermediate — why this is dangerous\n\nTraditional PHP forgives a lot, because everything is destroyed at the end of the request. Under Octane it is not.\n\n```php\nclass Something\n{\n    public static array $data = [];\n}\n```\n\n```text\nrequest 1 → static state changes\nrequest 2 → same process → the state is still there\n```\n\n<b>That is a state leak between users.</b> And it is worse than a normal bug, because the symptom is one customer seeing another's data, intermittently, on a server that has been up for a while, which is close to impossible to reproduce locally.\n\n<b>The pattern to look for is anything holding a request-specific value beyond the request:</b> static properties, singletons that captured the current user, a container binding resolved with a request in its constructor, a config value mutated at runtime, a global set once.\n\n<b>Singletons are the sharp one.</b> A singleton resolved during request 1 keeps whatever it captured, so a service that took `Auth::user()` in its constructor serves request 2 with request 1's user.\n\n---\n\n### 3. Advanced — memory, and whether you need it\n\n```text\ntraditional  request → memory allocated → process ends → released\nOctane       request → allocated → worker stays alive → request 2 → 3 → 4\n```\n\nA leak that was invisible now accumulates:\n\n```text\n100 MB → 150 MB → 250 MB → 500 MB → the worker dies\n```\n\n<b>Set a max-requests limit</b> so workers recycle, which turns a slow leak into a non-event. That is a mitigation and not a fix: <b>find the leak</b>, because a worker restarting every fifty requests has given back most of what Octane bought you.\n\n<b>And be clear about whether you need it.</b> Octane removes boot cost, which is the twenty milliseconds from the last lesson. <b>If your page takes 1.8 seconds, Octane makes it 1.78 seconds</b> and introduces a class of bug you have never debugged before.\n\nSo the honest positioning: <b>Octane is the last item on the list, not the first.</b> It is for applications that have already fixed their queries, already cache well, and are now bound by framework overhead at high volume. Reaching for it before that is choosing the hardest optimisation to get the smallest win, and paying for it in state bugs.",
      diagram: `The shift

  TRADITIONAL PHP

    request → boot Laravel → execute → response
            → process ends

    every request rebuilds the framework, then
    throws it away

  OCTANE

    Laravel boots ONCE
        ↓
    request 1 → request 2 → request 3 → request 4 …

    the application stays in memory
    you stop paying boot cost per request

    runs on FrankenPHP or Swoole — the server matters
    far less than the idea:

      KEEP THE APPLICATION ALIVE BETWEEN REQUESTS


  ⚠️  Why this is dangerous

      Traditional PHP forgives a lot, because
      everything is destroyed at the end of the
      request. Octane does not.

        class Something {
            public static array $data = [];
        }

        request 1 → static state changes
        request 2 → same process
                  → the state is STILL THERE

      THAT IS A STATE LEAK BETWEEN USERS.

      Worse than a normal bug: the symptom is one
      customer seeing another's data, intermittently,
      on a server that has been up a while — close to
      impossible to reproduce locally.

  The pattern: anything holding a request-specific
  value BEYOND the request

    static properties
    singletons that captured the current user
    container bindings resolved with a request
    config mutated at runtime
    globals set once

  ⚠️  Singletons are the sharp one.

      resolved during request 1, it keeps what it
      captured — a service that took Auth::user() in
      its constructor serves request 2 with request
      1's user


Memory

    traditional  request → allocated → process ends
                                     → released

    Octane       request → allocated
                 worker stays alive
                 → request 2 → 3 → 4 …

    a leak that was invisible now accumulates:

      100 MB → 150 MB → 250 MB → 500 MB → 💥

  Set a MAX-REQUESTS limit so workers recycle. That
  turns a slow leak into a non-event.

  It is a mitigation, not a fix — a worker restarting
  every 50 requests has given back most of what
  Octane bought you. FIND THE LEAK.


  ⚠️  Do you need it?

      Octane removes BOOT COST — the ~20ms from the
      last lesson.

        a 1.8s page becomes a 1.78s page

      and introduces a class of bug you have never
      debugged before.

    OCTANE IS THE LAST ITEM ON THE LIST, NOT THE
    FIRST.

    For applications that have already fixed their
    queries, already cache well, and are now bound by
    framework overhead at high volume.

    Reaching for it earlier is choosing the hardest
    optimisation for the smallest win, and paying in
    state bugs.`,
      codeExample: {
        title: "The state leaks Octane exposes",
        code: `# ---------- Running it ----------

composer require laravel/octane
php artisan octane:install --server=frankenphp

php artisan octane:start --workers=4 --max-requests=500
#                                     └─ recycle workers,
#                                        so a slow leak
#                                        is a non-event

php artisan octane:reload      # after a deploy — workers
                               # hold the old code in memory


<?php
// ---------- ❌ Static state: one customer's data, served to another ----------

class TenantContext
{
    public static ?Team $current = null;      // survives the request

    public static function set(Team $team): void
    {
        static::$current = $team;
    }
}

// Request 1 (team 5) sets it.
// Request 2 (team 9) reads it before setting it.
// Team 9 sees team 5's data. Intermittently. On a server
// that has been up a while.


<?php
// ---------- ❌ A singleton that captured the request ----------

$this->app->singleton(ReportBuilder::class, function ($app) {
    return new ReportBuilder(
        user: auth()->user(),          // ← frozen at first resolution
        team: request()->route('team'),
    );
});

// Resolved during request 1. Every later request gets
// request 1's user.

// ✅ Resolve per request
$this->app->bind(ReportBuilder::class, fn () => new ReportBuilder());

// ✅ Or take the dependency at call time
class ReportBuilder
{
    public function buildFor(User $user, Team $team): Report { ... }
}


<?php
// ---------- ❌ Mutating config at runtime ----------

public function handle(Request $request, Closure $next)
{
    config(['mail.from.address' => $request->user()->team->from_address]);

    return $next($request);       // and it stays that way for the worker
}

// ✅ Pass it where it is needed
Mail::to($user)->send((new InvoiceMail($invoice))->from($team->from_address));


<?php
// ---------- Octane's own hooks ----------

// config/octane.php
'listeners' => [
    RequestReceived::class => [
        // ...
    ],
],

// Reset anything that must not survive a request
'flush' => [
    TenantContext::class,
],

// And the container bindings to rebuild each request
'warm' => [...],


<?php
// ---------- Finding a leak ----------

Route::get('/octane-memory', fn () => [
    'mb'       => round(memory_get_usage(true) / 1048576, 1),
    'peak_mb'  => round(memory_get_peak_usage(true) / 1048576, 1),
    'requests' => app('octane.requests') ?? null,
]);

// Watch it across a few hundred requests. Flat is
// healthy. Climbing means something is accumulating —
// usually a static array, a growing collection on a
// singleton, or an event listener registered per request.


<?php
// ---------- ⚠️ Registering listeners per request ----------

// ❌ Under Octane this adds another listener every request
public function boot(): void
{
    Event::listen(InvoicePaid::class, fn ($e) => $this->log($e));
}
// Request 500 fires the listener 500 times.

// ✅ Register once, in a service provider that boots once


# ---------- Where Octane belongs on the list ----------

# 1. measure
# 2. fix the code
# 3. fix the queries
# 4. add indexes
# 5. fix N+1
# 6. reduce payload
# 7. add caching
# 8. Redis / CDN
# 9. Octane          ← here. Not before.
#
# A 1.8s page becomes 1.78s, and you have inherited a
# class of bug you have never debugged.`,
      },
      keyTakeaways: [
        "<b>Traditional PHP boots Laravel per request and discards it; Octane boots once and stays alive.</b>",
        "<b>The gain is eliminating boot cost on every request.</b>",
        "<b>It runs on FrankenPHP or Swoole</b>, and the idea matters more than the server.",
        "<b>Static properties now survive between requests</b>, which is a state leak between users.",
        "<b>The symptom is one customer seeing another's data, intermittently</b>, on a long-lived worker.",
        "<b>Look for anything holding request-specific values beyond the request.</b>",
        "<b>Singletons are the sharp edge</b>: one resolved with `Auth::user()` serves everyone that user.",
        "<b>Config mutated at runtime stays mutated for the worker's lifetime.</b>",
        "<b>Memory leaks accumulate instead of being freed at the end of the request.</b>",
        "<b>Set a max-requests limit so workers recycle</b>, which is mitigation rather than a fix.",
        "<b>Octane removes boot cost, so a 1.8-second page becomes 1.78 seconds.</b>",
        "<b>It is the last item on the optimisation list, not the first.</b>",
      ],
      commonMistakes: [
        "<b>Static properties holding request data.</b> Request two reads request one's values.",
        "<b>Singletons capturing the authenticated user.</b> Every later request gets the first one's identity.",
        "<b>Mutating config in middleware.</b> The change persists for the whole worker.",
        "<b>Registering event listeners per request.</b> Request 500 fires the listener 500 times.",
        "<b>Reaching for Octane before fixing queries.</b> The smallest win for the hardest debugging.",
        "<b>No max-requests limit.</b> A slow leak eventually kills the worker under load.",
      ],
      quiz: [
        {
          question: "What does Octane change?",
          options: [
            "How queries run",
            "The execution model: Laravel boots once and stays in memory across requests",
            "The cache driver",
            "How Blade compiles",
          ],
          correctIndex: 1,
          explanation: "You stop paying boot cost on every request.",
        },
        {
          question: "Why are static properties dangerous under Octane?",
          options: [
            "They use more memory",
            "They survive between requests, so one user's data can be served to another",
            "They are slower",
            "They cannot be serialised",
          ],
          correctIndex: 1,
          explanation: "The symptom is intermittent and nearly impossible to reproduce locally.",
        },
        {
          question: "What is the risk with a singleton under Octane?",
          options: [
            "It is rebuilt too often",
            "It keeps whatever it captured at first resolution, such as the authenticated user",
            "It cannot be injected",
            "It leaks database connections",
          ],
          correctIndex: 1,
          explanation: "Bind per request, or take dependencies at call time.",
        },
        {
          question: "Where does Octane belong in the optimisation order?",
          options: [
            "First, for the biggest win",
            "Last, after queries, indexes, N+1 and caching are already handled",
            "Second, after indexes",
            "It is not an optimisation",
          ],
          correctIndex: 1,
          explanation: "It removes boot cost, so a 1.8-second page becomes 1.78 seconds.",
        },
      ],
    },
    {
      id: "measure-response-caching-and-the-hierarchy",
      title: "Response caching, CDNs & measuring first",
      durationMinutes: 13,
      explanation: "The last two tools, and then the rule that governs all of them.\n\n---\n\n### 1. Basic — response caching and CDNs\n\nSometimes you can cache the entire response:\n\n```text\nnormal   request → Laravel → database → Eloquent → Blade → response\ncached   request → response cache → the whole response\n```\n\nExtremely fast, and <b>extremely dangerous when the response is personalised.</b> Cache a page with a \"Hi, Rajan\" header and the next visitor is greeted as Rajan. <b>Response caching belongs on genuinely public pages</b>, and the cache key must include everything that varies the output: locale, currency, device, feature flags.\n\n<b>A CDN</b> puts content near users:\n\n```text\nwithout   Tokyo user → US server → response\nwith      Tokyo user → Tokyo edge → cached content\n```\n\nGreat for images, CSS, JavaScript, video and cacheable responses. <b>And the win is latency, not compute</b>: a round trip to another continent costs 150ms or more before your server does anything at all, which is often larger than everything you have optimised so far.\n\n---\n\n### 2. Intermediate — measure first\n\n<b>This is the most important idea in the elective.</b>\n\nDo not say \"Redis will make it faster\". Measure.\n\n```text\nslow page → measure → database? or PHP?\n→ slow query / expensive code → fix → measure again\n```\n\nWhat to look at:\n\n```text\nresponse time · query count · query duration · memory\nCPU · external API calls · cache hit rate · N+1\n```\n\n<b>Numbers, before and after:</b>\n\n```text\nbefore   1.8s · 152 queries · 80 MB\nafter    420ms · 12 queries · 35 MB\n```\n\n<b>Without the before, you have an opinion.</b> With it you have evidence, and you also find out when a change made things worse, which happens more than people admit.\n\n<b>Telescope</b> answers \"what happened in this request?\" and shows you the 152 queries. <b>Pulse</b> answers \"how is the application doing?\". <b>Nightwatch</b> is production monitoring. Day 29 covered all three.\n\n---\n\n### 3. Advanced — the hierarchy\n\n```text\n1 measure\n2 fix algorithm and code problems\n3 fix database queries\n4 add indexes\n5 fix N+1\n6 reduce payload and data\n7 add caching\n8 add Redis / CDN\n9 consider Octane\n```\n\n<b>Do not jump to 8 or 9.</b> The order is deliberate: each step is cheaper, safer and larger than the ones below it. Caching at step 7 is where most people start, and it is the first step that adds a whole category of new bugs, invalidation, staleness, stampedes, rather than removing work.\n\n<b>The rule that separates senior performance work from cargo cult:</b>\n\n> <b>Do not optimise what you have not measured.</b>\n\nA slow page with 150 queries does not need Octane. <b>It needs those 150 queries to become 10</b>, and once they are, you may find you did not need anything else on the list.\n\nOne final honesty check: <b>every item from step 7 down adds operational complexity you carry forever</b>, more services, more failure modes, more things to reason about. Steps 2 to 6 remove work permanently and make the code simpler. <b>That asymmetry is why the order is what it is.</b>",
      diagram: `Response caching

    normal   request → Laravel → database → Eloquent
                     → Blade → response

    cached   request → response cache
                     → the whole response

  Extremely fast — and extremely dangerous when the
  response is PERSONALISED.

  ⚠️  Cache a page with a "Hi, Rajan" header and the
      next visitor is greeted as Rajan.

      Public pages only, and the key must include
      everything that varies the output: locale,
      currency, device, feature flags.


CDN

    without   Tokyo user → US server → response
    with      Tokyo user → Tokyo edge → cached content

    images · CSS · JS · video · cacheable responses

  The win is LATENCY, not compute: a cross-continent
  round trip costs 150ms+ before your server does
  anything — often more than everything you have
  optimised so far.


  ⚠️  MEASURE FIRST — the most important idea here

      Do not say "Redis will make it faster".

              slow page
                  ↓
               MEASURE
                  ↓
          ┌───────┴───────┐
          ▼               ▼
       database          PHP
          │               │
      slow query    expensive code
          └───────┬───────┘
                  ▼
                 FIX
                  ↓
            MEASURE AGAIN

    What to look at:

      response time · query count · query duration
      memory · CPU · external API calls
      cache hit rate · N+1

    Numbers, before and after:

      before   1.8s  · 152 queries · 80 MB
      after    420ms ·  12 queries · 35 MB

    Without the BEFORE you have an opinion. With it
    you have evidence — and you find out when a
    change made things worse, which happens more than
    people admit.

      Telescope   what happened in THIS request?
      Pulse       how is the application doing?
      Nightwatch  production monitoring


THE HIERARCHY

    1  measure
    2  fix algorithm and code problems
    3  fix database queries
    4  add indexes
    5  fix N+1
    6  reduce payload and data
    7  add caching
    8  add Redis / CDN
    9  consider Octane

  Do NOT jump to 8 or 9.

  The order is deliberate: each step is cheaper,
  safer and larger than the ones below it.

  Caching at 7 is where most people START — and it is
  the first step that ADDS a category of bugs
  (invalidation, staleness, stampedes) rather than
  removing work.


  THE RULE

    DO NOT OPTIMISE WHAT YOU HAVE NOT MEASURED.

    A slow page with 150 queries does not need
    Octane. It needs those 150 queries to become 10 —
    and once they are, you may not need anything else
    on the list.


  The asymmetry behind the order:

    steps 2–6   REMOVE work permanently, and make
                the code simpler

    steps 7–9   ADD operational complexity you carry
                forever: more services, more failure
                modes, more to reason about`,
      codeExample: {
        title: "Measuring, then response caching, in that order",
        code: `<?php
// ---------- 1. MEASURE. Always first. ----------

// The crudest version, and often enough
DB::enableQueryLog();
$start = microtime(true);

$response = $this->buildPage();

dd([
    'ms'      => round((microtime(true) - $start) * 1000),
    'queries' => count(DB::getQueryLog()),
    'memory'  => round(memory_get_peak_usage(true) / 1048576, 1) . ' MB',
]);

// Before: ['ms' => 1834, 'queries' => 152, 'memory' => '80 MB']


<?php
// ---------- A middleware that records it for every request ----------

class RecordPerformance
{
    public function handle(Request $request, Closure $next)
    {
        DB::enableQueryLog();
        $start = microtime(true);

        $response = $next($request);

        $ms      = (microtime(true) - $start) * 1000;
        $queries = count(DB::getQueryLog());

        if ($ms > 500 || $queries > 30) {
            Log::warning('Slow request', [
                'route'   => $request->route()?->getName(),
                'ms'      => round($ms),
                'queries' => $queries,
                'memory'  => round(memory_get_peak_usage(true) / 1048576, 1),
            ]);
        }

        return $response;
    }
}

// Now "the dashboard feels slow" becomes a log line with
// a query count in it.


<?php
// ---------- 2–6. Fix, then measure again ----------

// $posts = Post::latest()->get();          // 152 queries
$posts = Post::with(['user', 'comments.user'])
    ->select(['id', 'user_id', 'title', 'created_at'])
    ->latest()
    ->limit(20)
    ->get();

// After: ['ms' => 420, 'queries' => 12, 'memory' => '35 MB']
//
// Now you have evidence. And you would also have seen
// it if the change made things WORSE.


<?php
// ---------- 7–8. Only now: response caching ----------

class CacheResponse
{
    public function handle(Request $request, Closure $next)
    {
        // Never cache a personalised response. "Hi, Rajan"
        // served to the next visitor is the classic
        // version of this bug.
        if ($request->user() || ! $request->isMethod('GET')) {
            return $next($request);
        }

        // The key must carry everything that varies output
        $key = 'response:' . sha1(implode('|', [
            $request->fullUrl(),
            app()->getLocale(),
            $request->header('X-Currency', 'GBP'),
        ]));

        return Cache::remember($key, now()->addMinutes(10),
            fn () => $next($request));
    }
}


# ---------- CDN: the latency win ----------

# Without: Tokyo → US origin  ≈ 150ms round trip,
#          before your server does anything
#
# With:    Tokyo → Tokyo edge ≈ 10ms
#
# Often larger than everything you optimised in PHP.

Cache-Control: public, max-age=31536000, immutable   # hashed assets
Cache-Control: public, s-maxage=300, max-age=0       # cacheable HTML


<?php
// ---------- The hierarchy, as a checklist ----------

// 1. measure                    ← you are here
// 2. fix code / algorithms
// 3. fix queries
// 4. add indexes
// 5. fix N+1
// 6. reduce payload
// 7. add caching                ← first step that ADDS bugs
// 8. Redis / CDN
// 9. Octane
//
// 152 queries → 12 is step 5.
// Octane would have made 1.834s into 1.814s.


<?php
// ---------- Prove it in a test, so it stays fixed ----------

it('renders the dashboard in under 15 queries', function () {
    $user = User::factory()->has(Post::factory()->count(30))->create();

    DB::enableQueryLog();

    $this->actingAs($user)->get('/dashboard')->assertOk();

    expect(count(DB::getQueryLog()))->toBeLessThan(15);
});

// An N+1 reintroduced in six months now turns a test
// red instead of a page slow.`,
      },
      keyTakeaways: [
        "<b>Response caching returns the whole response</b> without touching Laravel's normal pipeline.",
        "<b>It is dangerous for personalised pages</b>: one user's greeting served to the next visitor.",
        "<b>The cache key must include everything that varies output</b>: locale, currency, device, flags.",
        "<b>A CDN wins latency, not compute</b>, and a cross-continent round trip can exceed all your PHP work.",
        "<b>Measuring first is the most important idea in the elective.</b>",
        "<b>Track response time, query count, query duration, memory, CPU, external calls and cache hit rate.</b>",
        "<b>Without a before number you have an opinion, not evidence.</b>",
        "<b>Telescope shows one request; Pulse shows application health; Nightwatch monitors production.</b>",
        "<b>The order is measure, code, queries, indexes, N+1, payload, caching, Redis/CDN, Octane.</b>",
        "<b>Caching is step seven and the first that adds bugs</b> rather than removing work.",
        "<b>Do not optimise what you have not measured.</b>",
        "<b>A 150-query page needs 10 queries, not Octane.</b>",
        "<b>Steps two to six remove work permanently; steps seven onward add complexity you carry forever.</b>",
      ],
      commonMistakes: [
        "<b>Caching a personalised response.</b> The next visitor sees somebody else's page.",
        "<b>A response cache key missing locale or currency.</b> Everyone gets the first visitor's version.",
        "<b>Optimising without a baseline.</b> You cannot tell improvement from regression.",
        "<b>Starting at caching or Octane.</b> The smallest wins, the most new bugs, the query still broken.",
        "<b>Never re-measuring.</b> Some optimisations make things slower and nobody notices.",
        "<b>No test locking in the query count.</b> The N+1 comes back within a year.",
      ],
      quiz: [
        {
          question: "When is response caching unsafe?",
          options: [
            "For static pages",
            "For personalised responses, where one user's page is served to the next visitor",
            "For JSON",
            "For GET requests",
          ],
          correctIndex: 1,
          explanation: "The key must also carry locale, currency and anything else that varies output.",
        },
        {
          question: "What does a CDN primarily save?",
          options: [
            "Server CPU",
            "Latency: a cross-continent round trip costs more than most of your PHP optimisation",
            "Database queries",
            "Memory",
          ],
          correctIndex: 1,
          explanation: "150ms before your server does anything at all.",
        },
        {
          question: "Why measure before optimising?",
          options: [
            "For reporting",
            "Without a baseline you have an opinion, and you cannot tell an improvement from a regression",
            "To pick a cache driver",
            "It is not necessary",
          ],
          correctIndex: 1,
          explanation: "Some optimisations make things slower.",
        },
        {
          question: "What does a slow page with 150 queries need?",
          options: [
            "Octane",
            "Those 150 queries to become 10, which is step five, not step nine",
            "Redis",
            "A CDN",
          ],
          correctIndex: 1,
          explanation: "Octane would turn 1.834 seconds into 1.814 seconds.",
        },
        {
          question: "Why is caching placed at step seven rather than first?",
          options: [
            "It is slow to set up",
            "It is the first step that adds bugs, invalidation, staleness and stampedes, instead of removing work",
            "It requires Redis",
            "It only helps reads",
          ],
          correctIndex: 1,
          explanation: "Steps two to six remove work permanently and simplify the code.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why is file cache a problem on multiple servers?",
      options: [
        "It is slow",
        "Each server has its own cache, so nothing is shared and `forget()` clears only one",
        "It cannot store objects",
        "It has no TTL",
      ],
      correctIndex: 1,
      explanation: "That is inconsistency, which is worse than slowness.",
    },
    {
      question: "What is the catch with the database cache driver?",
      options: [
        "No TTL support",
        "You use the database to avoid database work, so it helps computation but not reads",
        "It cannot be cleared",
        "It is unsupported in production",
      ],
      correctIndex: 1,
      explanation: "At high throughput the cache reads become load on the system you were protecting.",
    },
    {
      question: "Why separate cache and queue Redis instances?",
      options: [
        "For speed",
        "`cache:clear` can wipe queued jobs, and a cache eviction policy silently deletes them",
        "Laravel requires it",
        "For monitoring",
      ],
      correctIndex: 1,
      explanation: "A cache should evict; a queue must never.",
    },
    {
      question: "What is the test for whether something is really a cache?",
      options: [
        "It has a TTL",
        "You could run `cache:clear` in production right now without breaking anything",
        "It uses Redis",
        "It is small",
      ],
      correctIndex: 1,
      explanation: "Otherwise it is a database with no backups.",
    },
    {
      question: "What does `Cache::remember` save you?",
      options: [
        "Memory",
        "The read-check-write logic and its race, running the closure only on a miss",
        "Serialisation",
        "The TTL",
      ],
      correctIndex: 1,
      explanation: "It is the method you will use most.",
    },
    {
      question: "How should you choose a TTL?",
      options: [
        "Ten minutes by default",
        "By deciding how long you are willing to serve wrong data on that page",
        "By query duration",
        "By cache size",
      ],
      correctIndex: 1,
      explanation: "A business decision, not a technical one.",
    },
    {
      question: "What is a cached outage?",
      options: [
        "A Redis failure",
        "`remember` storing the `null` from a failed lookup, so \"not found\" persists for the whole TTL",
        "An expired key",
        "A stampede",
      ],
      correctIndex: 1,
      explanation: "Give negative results a much shorter TTL.",
    },
    {
      question: "When is caching a query not worth it?",
      options: [
        "When it runs rarely",
        "When it is already fast: you add a network round trip and serialisation to save nothing",
        "When it returns many rows",
        "When it joins",
      ],
      correctIndex: 1,
      explanation: "Cache what is slow, not what is frequent.",
    },
    {
      question: "Why is forgetting a key safer than updating it?",
      options: [
        "It is faster",
        "Write-through writes the value twice, so a disagreement or failed write caches something untrue",
        "It uses less memory",
        "It is not safer",
      ],
      correctIndex: 1,
      explanation: "Forgetting makes the next read recompute from the source of truth.",
    },
    {
      question: "What makes invalidation bugs so long-lived?",
      options: [
        "They throw quietly",
        "Nothing errors: a missed key just serves wrong data indefinitely",
        "They only occur in production",
        "Tags hide them",
      ],
      correctIndex: 1,
      explanation: "One price change usually invalidates five different keys.",
    },
    {
      question: "Why is a cache stampede worst on popular pages?",
      options: [
        "They have more data",
        "The key expired because the page is popular, so a hundred copies of the slow query arrive at once",
        "They use more memory",
        "They have longer TTLs",
      ],
      correctIndex: 1,
      explanation: "The cache expiring is what takes the site down.",
    },
    {
      question: "What does an atomic lock need to work across servers?",
      options: [
        "A queue",
        "Shared cache storage, or each server takes its own lock and nothing is coordinated",
        "A transaction",
        "A longer TTL",
      ],
      correctIndex: 1,
      explanation: "Same rule as Day 29's isolation locks.",
    },
    {
      question: "What does Redis pipelining save?",
      options: [
        "Redis CPU",
        "Network round trips: Redis is microseconds per command, the round trip is a millisecond",
        "Memory",
        "Serialisation",
      ],
      correctIndex: 1,
      explanation: "A thousand un-pipelined commands is about a second of waiting.",
    },
    {
      question: "What is the critical property of Redis pub/sub?",
      options: [
        "It persists messages",
        "It is messaging, not storage: no listener means the message is simply gone",
        "It retries",
        "It acknowledges delivery",
      ],
      correctIndex: 1,
      explanation: "A subscriber restarting during a deploy misses everything silently.",
    },
    {
      question: "When should you use a queue rather than pub/sub?",
      options: [
        "For live dashboards",
        "Whenever losing the message matters, since queues persist, retry and record failures",
        "For presence pings",
        "Never",
      ],
      correctIndex: 1,
      explanation: "Pub/sub suits genuinely ephemeral fan-out only.",
    },
    {
      question: "Why is caching not the answer to a slow query?",
      options: [
        "It is complex",
        "It runs the bad query less often, leaving it for every miss, invalidation and new page",
        "Caches are unreliable",
        "It is the answer",
      ],
      correctIndex: 1,
      explanation: "Fix the query, then decide whether it still needs caching.",
    },
    {
      question: "What order should a composite index use?",
      options: [
        "Alphabetical",
        "Equality columns first, then the range or sort column",
        "Least selective first",
        "Any order",
      ],
      correctIndex: 1,
      explanation: "`(user_id, status)` serves a `user_id`-only query; `(status, user_id)` does not.",
    },
    {
      question: "What is the key number in an `EXPLAIN ANALYZE` output?",
      options: [
        "Total cost",
        "Rows examined versus rows returned",
        "Planning time",
        "Buffer count",
      ],
      correctIndex: 1,
      explanation: "Examining 400,000 to return 20 tells you exactly what is wrong.",
    },
    {
      question: "Why does an N+1 often only appear in production?",
      options: [
        "Different PHP version",
        "Eleven queries at 50 rows feels fine; at 10,000 rows it is unusable",
        "Caching is off there",
        "The index is missing",
      ],
      correctIndex: 1,
      explanation: "`preventLazyLoading` in development makes it announce itself.",
    },
    {
      question: "What happens to `env()` after `config:cache` runs?",
      options: [
        "Nothing",
        "It returns `null` anywhere outside config files",
        "It reads from the cache",
        "It throws",
      ],
      correctIndex: 1,
      explanation: "`env()` belongs in `config/` only; `config()` everywhere else.",
    },
    {
      question: "Why does editing `.env` in production appear to do nothing?",
      options: [
        "The file is read-only",
        "Config is cached, so values are not re-read until `config:cache` runs again",
        "Laravel ignores it",
        "It needs a reboot",
      ],
      correctIndex: 1,
      explanation: "And workers need `queue:restart` too.",
    },
    {
      question: "How much do the deployment caches actually save?",
      options: [
        "Most of the page time",
        "A few milliseconds to about twenty of bootstrap, which matters at volume but will not fix a slow page",
        "Nothing measurable",
        "Half the response time",
      ],
      correctIndex: 1,
      explanation: "A 1.8-second page is queries, not boot.",
    },
    {
      question: "Why are static properties dangerous under Octane?",
      options: [
        "They use more memory",
        "They survive between requests, so one user's data can be served to another",
        "They are slower",
        "They cannot be serialised",
      ],
      correctIndex: 1,
      explanation: "The symptom is intermittent and nearly impossible to reproduce locally.",
    },
    {
      question: "What is the risk with a singleton under Octane?",
      options: [
        "It rebuilds too often",
        "It keeps whatever it captured at first resolution, such as the authenticated user",
        "It cannot be injected",
        "It leaks connections",
      ],
      correctIndex: 1,
      explanation: "Bind per request, or take dependencies at call time.",
    },
    {
      question: "Where does Octane belong in the optimisation order?",
      options: [
        "First",
        "Last, after queries, indexes, N+1 and caching are handled",
        "Second",
        "It is not an optimisation",
      ],
      correctIndex: 1,
      explanation: "It removes boot cost, so a 1.8-second page becomes 1.78 seconds.",
    },
    {
      question: "When is response caching unsafe?",
      options: [
        "For static pages",
        "For personalised responses, where one user's page is served to the next visitor",
        "For JSON",
        "For GET requests",
      ],
      correctIndex: 1,
      explanation: "The key must also carry locale, currency and anything else that varies output.",
    },
    {
      question: "What does a CDN primarily save?",
      options: [
        "Server CPU",
        "Latency: a cross-continent round trip can cost more than all your PHP optimisation",
        "Queries",
        "Memory",
      ],
      correctIndex: 1,
      explanation: "150ms before your server does anything at all.",
    },
    {
      question: "Why measure before optimising?",
      options: [
        "For reporting",
        "Without a baseline you have an opinion, and cannot tell an improvement from a regression",
        "To pick a driver",
        "It is unnecessary",
      ],
      correctIndex: 1,
      explanation: "Some optimisations make things slower.",
    },
    {
      question: "What does a slow page with 150 queries need?",
      options: [
        "Octane",
        "Those 150 queries to become 10, which is step five, not step nine",
        "Redis",
        "A CDN",
      ],
      correctIndex: 1,
      explanation: "Octane would turn 1.834 seconds into 1.814 seconds.",
    },
    {
      question: "Why is caching step seven rather than step one?",
      options: [
        "It is slow to set up",
        "It is the first step that adds bugs, invalidation, staleness and stampedes, rather than removing work",
        "It needs Redis",
        "It only helps reads",
      ],
      correctIndex: 1,
      explanation: "Steps two to six remove work permanently and simplify the code.",
    },
  ],
  project: {
    name: "InvoiceHub — profile a slow page and halve the queries",
    goal: "Build a deliberately slow dashboard, measure it properly, then work down the hierarchy step by step, recording the numbers after each change so you can see which step actually mattered.",
    brief:
      "The self-check is to take a slow page, profile it, and cut the query count by half. <b>Halving it is easy. The exercise is proving which change did it</b>, because the whole elective is about not guessing.\n\nBuild the slow page first, on purpose:\n\n```php\n$invoices = Invoice::latest()->get();\n\nforeach ($invoices as $invoice) {\n    echo $invoice->client->name;\n\n    foreach ($invoice->lines as $line) {\n        echo $line->product->name;\n    }\n}\n```\n\nWhich gives you roughly:\n\n```text\n1 query   → invoices\nN queries → clients\nN queries → lines\nN queries → products\n```\n\nThen work the hierarchy in order, measuring after every single step:\n\n```text\n1 measure → 2 code → 3 queries → 4 indexes → 5 N+1\n→ 6 payload → 7 caching → 8 Redis/CDN → 9 Octane\n```\n\n<b>The deliverable is a table with one row per step</b>: query count, response time, memory. By the end you will be able to point at the row where the page actually got fast, and it will not be the caching row.",
    steps: [
      "Seed real volume: 300 invoices, each with 5 lines, across 40 clients and 60 products. A page that is fast at 20 rows teaches you nothing, and that gap is the whole reason N+1 hides until production.",
      "Build the deliberately slow dashboard exactly as above, with no eager loading, `select *`, and a total computed in PHP by looping. Add a second slow element: a per-client outstanding balance calculated inside the loop.",
      "MEASURE THE BASELINE before touching anything. Record response time, query count, slowest single query, and peak memory. Write these four numbers down before you read further, because you cannot recover a baseline afterwards.",
      "Add a middleware that logs route, milliseconds, query count and peak memory for every request over a threshold. This is the tool you will use for the rest of the project and, more usefully, for the rest of your career.",
      "Step 2, code: find anything computing in PHP that the database should do. Replace the looped total with a `sum()` and the per-client balance with `withSum`. Measure. Record.",
      "Step 3 and 4, queries and indexes: run `EXPLAIN ANALYZE` on your slowest query. Note rows examined versus rows returned before adding anything. Add the composite index the query actually needs, with equality columns first. Re-run `EXPLAIN`, and record both numbers.",
      "Step 5, N+1: add the eager loads. Measure. <b>This is the row where the page gets fast</b>, and the point of recording everything is that you will be able to see that.",
      "Step 6, payload: select only the columns the page renders, including on the relations (`with('client:id,name')`). Add pagination. Measure and record memory in particular.",
      "Turn on `Model::preventLazyLoading()` in development, then write a test asserting the dashboard renders in under fifteen queries. That test is what stops the N+1 coming back in six months.",
      "Step 7, caching: only now, cache one genuinely expensive thing, such as a monthly aggregate that takes real time to compute. Give it a key scoped by team and a version suffix, invalidate it on invoice save, and pick a TTL by deciding how stale the number may be.",
      "Add an atomic lock around that cache rebuild with a timeout, then prove the stampede is real: clear the key and fire fifty concurrent requests with and without the lock, watching the query log both times.",
      "Write the table: nine rows, four columns, one line each on what changed. Then answer two questions in writing. Which single step produced the biggest improvement? And how much would Octane have saved you, given your final numbers?",
    ],
    acceptance: [
      "A baseline exists with all four numbers, recorded before any change.",
      "A performance-logging middleware records route, duration, query count and peak memory for slow requests.",
      "`EXPLAIN ANALYZE` output is recorded before and after the index, including rows examined versus returned.",
      "The composite index puts equality columns first, and you can say which queries it does not serve.",
      "Query count is at least halved, and in practice cut by far more than half.",
      "Selected columns are explicit, on the model and on eager-loaded relations, and the page is paginated.",
      "`preventLazyLoading` is on in development, and a test asserts the dashboard stays under fifteen queries.",
      "Exactly one thing is cached, and it is genuinely expensive to compute rather than merely frequent.",
      "The cache key is scoped by team and versioned, and invalidation happens on write.",
      "The cache rebuild is protected by a lock with a timeout, and you have query-log evidence of the stampede with and without it.",
      "The results table has one row per step with all four numbers.",
      "You can name the single step that mattered most, and estimate what Octane would have saved.",
    ],
    stretch: [
      "Deliberately cache a personalised value with an unscoped key, log in as two different users, and watch one see the other's data. That is thirty seconds of work and the clearest possible memory of why keys carry the tenant.",
      "Run the same page with `CACHE_STORE=file` on two local processes writing to different directories, invalidate on one, and confirm the other keeps serving the old value. That is the multi-server failure, reproduced on your laptop.",
      "Cache a value returned from a deliberately failing API call and watch the failure persist for the full TTL. Then add a short negative TTL and confirm the recovery time drops from an hour to thirty seconds.",
      "Add `config:cache` to a local deploy script, then move one `env()` call from a config file into a service class and watch it return null. Put it back, and grep your whole codebase for `env(` outside `config/`.",
      "Install Octane locally, add a static property that stores the current user, and hit the page as two different users. The bug you see is the one that is nearly impossible to find in production.",
      "Add a `Cache::many()` version of a loop that currently calls `Cache::get()` per item, and time both. The gap is Day 15's N+1, measured against Redis.",
    ],
  },
};
