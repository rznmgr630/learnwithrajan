import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_23_LESSONS: LessonDay = {
  day: 23,
  title: "Caching and Redis",
  totalMinutes: 104,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "what-to-cache",
      title: "What to cache, and the question to ask first",
      durationMinutes: 11,
      explanation:
        "<b>Caching</b> (keeping the result of expensive work somewhere faster so you do not repeat it).\n\n```text\nRequest → cache → hit?  → response\n                → miss? → database → cache → response\n```\n\n---\n\n## The wrong question\n\n> \"Can I cache this?\" is answerable for almost anything, which makes it useless. The question that decides is <b>\"what happens if this value is stale?\"</b>\n>\n> A country list being an hour out of date is invisible. A permission check being an hour out of date means a fired employee still has access. Same mechanism, same TTL, completely different consequence, and the mechanism cannot tell you which you have.\n\n---\n\n## Good candidates\n\n```text\nExpensive to compute, cheap to be slightly wrong\n  ↳ reference data, aggregates, rendered content, slow third-party responses\nRead far more often than written\nThe same for many users\n```\n\n> That last one matters more than it looks. A cache entry shared by ten thousand users is a hit rate near 100%; one per user is a hit rate near zero unless each user returns often. Per-user caching frequently makes things <b>slower</b>, because you pay the write and the memory and rarely collect the read.\n\n---\n\n## Be careful with\n\n```text\nHighly personalised data      low hit rate, high risk of cross-user leaks\nAuthorization decisions       stale means someone keeps access they lost\nMonetary balances             stale means a wrong number shown as fact\nAnything you cannot invalidate\n```\n\n> The dangerous one is authorization. Day 19 built ownership into the query on purpose, and caching a permission result quietly undoes it: a revoked role now takes effect at TTL expiry rather than on the next request. If you cache anything security-relevant, cache it for <b>seconds</b>, and be able to say out loud how long a revoked permission survives.\n\n---\n\n## Measure before and after\n\n> The goal is not \"I added Redis\", it is \"I can show what changed\". Four numbers, before and after: <b>p95 latency</b>, requests per second, database queries per request, and memory. Day 21's percentile lesson applies, and so does its warning: the mean will improve first and tell you least.\n>\n> And measure the <b>hit rate</b>. A cache below about 80% is doing two pieces of work for most requests, and one below 50% is usually slower than no cache. That single number tells you whether the key is right, and it is the one people forget to record.\n\n---\n\n## The costs you are accepting\n\n> Worth naming, because caching is usually presented as free.\n>\n> <b>A second source of truth.</b> Two places can now disagree, and the code that keeps them agreeing is code you have to get right.\n>\n> <b>A new failure mode.</b> A cache that is down, slow or full is a new way for your endpoint to fail, which is why the previous day's timeouts and circuit breakers apply here too.\n>\n> <b>Harder debugging.</b> \"It works for me\" acquires a new cause: you have a hit and they have a miss, or one of you has an entry written by the previous deploy.\n>\n> None of that argues against caching. It argues for caching the few things that need it rather than everything, because each cache is a small ongoing liability.",
      diagram: `Request → CACHE
            hit?  → response
            miss? → database → cache → response


⚠ The wrong question

    "can I cache this?"

    answerable for almost anything, so it decides
    nothing.

    THE QUESTION IS:

      "WHAT HAPPENS IF THIS VALUE IS STALE?"

    a country list an hour out of date
      → invisible

    a PERMISSION CHECK an hour out of date
      → a fired employee still has access

    same mechanism. same TTL. completely different
    consequence.

    and the mechanism cannot tell you which you
    have.


Good candidates

    expensive to compute, cheap to be slightly
    wrong
      reference data · aggregates
      rendered content · slow third-party calls

    read far more often than written

    THE SAME FOR MANY USERS

      ⚠ that last one matters more than it looks.

        one entry shared by 10,000 users
          → hit rate near 100%
        one entry per user
          → hit rate near ZERO, unless each user
            returns often

        per-user caching frequently makes things
        SLOWER: you pay the write and the memory
        and rarely collect the read.


Be careful with

    highly personalised   low hit rate, and a
                          cross-user leak risk
    AUTHORIZATION         stale = someone keeps
                          access they lost
    monetary balances     stale = a wrong number
                          shown as fact
    anything you cannot invalidate

    ⚠ the dangerous one is AUTHORIZATION.

      Day 19 built ownership into the QUERY on
      purpose. caching a permission result quietly
      undoes it:

        a revoked role now takes effect at TTL
        EXPIRY, not on the next request

      if you cache anything security-relevant,
      cache it for SECONDS, and be able to say out
      loud how long a revoked permission survives.


Measure before and after

    the goal is not "I added Redis".
    it is "I can SHOW what changed".

    four numbers, before and after:
      p95 latency
      requests per second
      DB queries per request
      memory

    Day 21 applies, including its warning: the
    MEAN will improve first and tell you least.

    ⚠ and measure the HIT RATE.

      below ~80%   two pieces of work for most
                   requests
      below 50%    usually SLOWER than no cache

      that one number tells you whether the KEY is
      right, and it is the one people forget to
      record.


The costs you are accepting

    caching is usually presented as free. it is
    not:

    A SECOND SOURCE OF TRUTH
      two places can disagree, and the code that
      keeps them agreeing is code you must get
      right

    A NEW FAILURE MODE
      a cache down, slow or full is a new way for
      your endpoint to fail
      → Day 22's timeouts and breakers apply here

    HARDER DEBUGGING
      "it works for me" gains a new cause: you
      have a hit and they have a miss, or one of
      you holds an entry from the last deploy

    none of that argues against caching.

    it argues for caching the FEW THINGS THAT NEED
    IT, because each cache is a small ongoing
    liability.`,
      codeExample: {
        title: "Deciding what to cache, with the numbers",
        code: `// ── Ask the staleness question, per value ───────────────────
//
//   value                    stale for 60s means...        cache?
//   ──────────────────────────────────────────────────────────────
//   country list             nothing                       yes, 24h
//   product catalogue page   a price is 60s old            yes, 60s
//   exchange rate            a quote is 60s old            yes, 30s
//                            (and say so in the response)
//   user's own profile       they edited it and see the    short, or
//                            old one for a minute          invalidate
//   cart contents            they added an item and it     NO
//                            is missing
//   permission check         a REVOKED ROLE STILL WORKS    seconds only
//   account balance          a wrong number, shown as      NO
//                            fact
//
// Making this table is the work. Every row where the middle
// column is unacceptable is a row you do not cache, however
// slow the query is.


// ── ⚠ The authorization case, specifically ──────────────────
// ✗ This looks like an obvious win. It is a security change.
async function getPermissions(userId) {
  const cached = await redis.get(\`perms:\${userId}\`);
  if (cached) return new Set(JSON.parse(cached));

  const perms = await loadPermissions(db, userId);
  await redis.set(\`perms:\${userId}\`, JSON.stringify([...perms]), { EX: 3600 });
  return perms;
}
//
// You have just decided that revoking an admin's access takes
// up to an hour. Day 18 made exactly this argument about JWT
// claims and chose a session lookup instead; this puts the
// staleness back with a longer window.
//
// ✓ If you must, make the window tiny and explicit, and
//   invalidate on change:
const PERMISSION_TTL_SECONDS = 10;

async function getPermissions(userId) {
  const key = \`perms:\${userId}\`;
  const cached = await redis.get(key);
  if (cached) return new Set(JSON.parse(cached));

  const perms = await loadPermissions(db, userId);
  await redis.set(key, JSON.stringify([...perms]), { EX: PERMISSION_TTL_SECONDS });
  return perms;
}

export async function revokePermission(db, userId, permission) {
  await db.delete(userPermissions).where(and(
    eq(userPermissions.userId, userId),
    eq(userPermissions.permission, permission),
  ));
  await redis.del(\`perms:\${userId}\`);      // ← not optional
}
// Ten seconds is a number you can defend in a security review.
// An hour is not, and "we cache permissions" with no number
// attached is the answer that fails one.


// ── ⚠ Per-user caching often loses ──────────────────────────
// A dashboard query taking 200ms, cached per user for 5
// minutes.
//
//   10,000 users, each visiting roughly once an hour
//
//   In any 5-minute window: ~830 visits, almost all by
//   different users. Nearly every request is a miss.
//
//   So you pay:
//     the 200ms query          (unchanged)
//     a Redis round trip       (added)
//     a serialise + write      (added)
//     memory for 10,000 entries that mostly expire unread
//
//   Hit rate: single digits. You made it slower.
//
// ✓ Cache the SHARED part instead. If the dashboard is
//   80% company-wide aggregates and 20% personal:
async function getDashboard(userId, companyId) {
  const shared = await cached(\`dash:company:\${companyId}\`, 300, () =>
    expensiveCompanyAggregates(db, companyId));
  //  ^^^^^^^^^^^^^^^^^^^^^^^ one entry, every employee hits it

  const personal = await personalWidgets(db, userId);   // fast, uncached

  return { ...shared, ...personal };
}
// One entry per company at a near-100% hit rate beats ten
// thousand entries at 5%, and it is the same total code.


// ── Measure it, four numbers, twice ─────────────────────────
// Day 21's histogram, plus the number people forget.
const cacheHits = meter.createCounter("cache_hits_total");
const cacheMisses = meter.createCounter("cache_misses_total");
const dbQueries = meter.createCounter("db_queries_total");

export async function cached(key, ttlSeconds, load, { name } = {}) {
  const label = { cache: name ?? key.split(":")[0] };
  //             ^^^^^ Day 21: the PREFIX, not the key. A label
  //             per key is one time series per cached entity.

  const hit = await redis.get(key);
  if (hit !== null) {
    cacheHits.add(1, label);
    return JSON.parse(hit);
  }

  cacheMisses.add(1, label);
  const value = await load();
  await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
  return value;
}
//
// Then the report you should be able to produce:
//
//                        before     after
//   p95 latency          250ms      22ms
//   requests/sec         180        1,400
//   DB queries/request   3.0        0.06
//   heap used            180MB      190MB
//   cache hit rate       -          98%
//
// The hit rate is the one that tells you whether the KEY was
// right. Latency can improve while the hit rate is 40%, which
// means most requests still do both pieces of work and you
// have not finished.
//
// ✓ An endpoint worth caching:  high hit rate, expensive miss
// ✗ One that is not:            low hit rate, cheap miss


// ── The liabilities, stated once ────────────────────────────
// 1. A second source of truth. Two places can disagree, and
//    the invalidation code is now yours to get right.
//
// 2. A new failure mode. Day 22 applies:
//
//    ✗ const cached = await redis.get(key);
//      Redis is slow, and now every request waits on it
//      BEFORE reaching the database that would have worked.
//
//    ✓ const cached = await Promise.race([
//        redis.get(key),
//        sleep(50).then(() => null),      // treat slow as a miss
//      ]).catch(() => null);              // treat down as a miss
//
//    A cache should never be able to make an endpoint slower
//    than it was without the cache. That property does not
//    come free, and it is one line.
//
// 3. Harder debugging. "Works for me" now also means "I have
//    a hit and you have a miss", or "my entry was written by
//    the previous deploy". The next lessons make both of
//    those concrete.`,
      },
      keyTakeaways: [
        "\"Can I cache this?\" is answerable for almost anything. The deciding question is what happens if the value is stale.",
        "A stale country list is invisible; a stale permission check means a revoked role still works. Same mechanism, different consequence.",
        "Caching something security-relevant is a security decision. Use seconds, invalidate on change, and be able to say how long a revocation takes to apply.",
        "Shared entries are what make caching work. One entry for ten thousand users is a near-100% hit rate; one per user is often single digits.",
        "Per-user caching frequently makes things slower, because you pay the write and the memory and rarely collect the read.",
        "Cache the shared part of a mixed response rather than the whole thing per user.",
        "Measure four numbers before and after: p95 latency, requests per second, database queries per request, and memory.",
        "Also measure the hit rate. Below about 80% most requests do both pieces of work, and below 50% the cache is usually a net loss.",
        "The hit rate is what tells you whether the key is right, and latency can improve while it is still wrong.",
        "You are accepting three costs: a second source of truth, a new failure mode, and a new cause of \"works for me\".",
        "A cache must never make an endpoint slower than it was without one. Treat slow and down as a miss, which is one line.",
        "Label cache metrics by prefix, not by key, or Day 21's cardinality problem returns.",
      ],
      commonMistakes: [
        "Asking whether something can be cached rather than what a stale value would cost.",
        "Caching permissions or roles for minutes, which turns a revocation into something that takes effect at TTL expiry.",
        "Caching per user without checking the hit rate, so you add work to nearly every request.",
        "Reporting only latency, so a cache with a 40% hit rate looks like a success.",
        "Never recording the hit rate, so you cannot tell whether the key is wrong.",
        "Awaiting a cache read with no timeout, so a slow cache makes the endpoint slower than having none.",
        "Letting a cache error propagate, so a cache outage becomes an application outage.",
        "Using the full cache key as a metric label, creating one time series per cached entity.",
        "Treating caching as free, when each cache is a second source of truth plus a new failure mode.",
      ],
      quiz: [
        {
          question: "What is the question that decides whether to cache something?",
          options: [
            "Is it expensive to compute?",
            "What happens if this value is stale?",
            "Can it be serialised?",
            "How often is it read?",
          ],
          correctIndex: 1,
          explanation:
            "A stale country list is invisible and a stale permission check means a fired employee still has access. The mechanism cannot tell you which you have.",
        },
        {
          question: "Why does per-user caching often make things slower?",
          options: [
            "Redis is slow for small values",
            "The hit rate is near zero unless each user returns often, so you pay the write and the memory and rarely collect the read",
            "Keys get too long",
            "Serialisation dominates",
          ],
          correctIndex: 1,
          explanation:
            "Cache the shared part instead: one entry per company at a near-100% hit rate beats ten thousand at 5%.",
        },
        {
          question: "Why is caching a permission check a security decision?",
          options: [
            "Permissions are large",
            "A revoked role now takes effect at TTL expiry rather than on the next request, which undoes Day 19's per-request check",
            "Redis is not encrypted",
            "It breaks the ownership predicate",
          ],
          correctIndex: 1,
          explanation:
            "If you do it, use seconds, invalidate on change, and be able to state the window in a security review.",
        },
        {
          question: "Which number tells you whether your cache key is right?",
          options: [
            "p95 latency",
            "The hit rate. Below about 80% most requests do both pieces of work, and latency can improve while the key is still wrong.",
            "Requests per second",
            "Memory used",
          ],
          correctIndex: 1,
          explanation:
            "It is also the number people forget to record, which is why a cache with a 40% hit rate can look like a success.",
        },
        {
          question: "How do you stop a cache making an endpoint slower than no cache?",
          options: [
            "Use a faster client",
            "Treat a slow or failed cache read as a miss, with a short timeout and a catch",
            "Cache in memory instead",
            "Increase the TTL",
          ],
          correctIndex: 1,
          explanation:
            "Day 22's timeout lesson applies to your cache too. That property is one line and it does not come free.",
        },
      ],
    },
    {
      id: "in-memory-and-redis",
      title: "In-memory caches, and why Redis",
      durationMinutes: 11,
      explanation:
        "The simplest cache is a `Map`, and it is genuinely useful before it is a problem.\n\n```javascript\nconst cache = new Map();\ncache.set(\"user:123\", user);\n```\n\nNo network, no serialisation, nanoseconds. And three limits.\n\n---\n\n## It is per instance\n\n```text\nInstance A   cache → user 123 (new name)\nInstance B   cache → nothing\nInstance C   cache → user 123 (old name)\n```\n\n> Day 21 met this as a session bug and it is the same mechanism. With three instances behind a load balancer, a user updates their name, gets a fresh value from the instance that handled the write, refreshes, and sees the old name from a different instance. It looks intermittent because it is: it depends which instance you land on.\n>\n> A restart or a deploy also empties every entry, so a cache that is warm after ten minutes is cold again on every release.\n\n---\n\n## It leaks\n\n> Verified, and this is the one that surprises people. Take a `Map` with an expiry check on read:\n>\n> ```text\n> 10,000 entries written with a 1ms TTL\n> after 20ms:  getTtl(\"k0\") → undefined      (correct)\n>              cache.size   → 10000          (still there)\n> ```\n>\n> Expiry on <b>read</b> never deletes anything. Every key you ever cache stays in memory until the process restarts, because nothing sweeps it. A naive TTL cache is an unbounded memory leak with a correctness feature bolted on.\n>\n> The fix is a bounded cache with eviction, which is what `lru-cache` exists for: a maximum size, so old entries leave whether or not anyone reads them.\n\n---\n\n## Redis\n\n<b>Redis</b> (an in-memory data store used for caching, sessions, rate limiting, locks and other shared state).\n\n```text\nInstance A ─┐\nInstance B ─┼── Redis\nInstance C ─┘\n```\n\n> What you buy is <b>one shared view</b>: every instance sees the same entry, invalidation reaches everybody, and a deploy does not empty it. What you pay is a network round trip, serialisation, and a new dependency to run and monitor.\n>\n> Its TTL support is the underrated part. `SET key value EX 60` makes expiry the store's problem, which is exactly the sweeping you had to write yourself for the `Map`.\n\n---\n\n## Both, on purpose\n\n> The useful arrangement is two layers rather than a choice. A tiny bounded in-process cache in front of Redis, holding the handful of keys read constantly, cuts most of the network round trips for the hottest data. Redis behind it gives correctness and sharing.\n>\n> The catch is that the top layer reintroduces per-instance staleness, so keep its TTL very short, a few seconds, and use it only where being briefly out of date is harmless. That is a deliberate trade rather than an oversight, and it should be written down next to the code.\n\n---\n\n## Eviction\n\n<b>Eviction policy</b> (the rule for removing data when memory is full).\n\n> The important part is knowing what happens when Redis is full, because the default may not be what you expect: with `noeviction`, writes start <b>failing</b> rather than making room. For a pure cache you want an LRU policy and a `maxmemory` set, so a full cache degrades into a less effective cache rather than into errors.\n>\n> And if the same Redis holds sessions or rate limit counters, eviction can silently delete those too, which is a reason to keep cache and durable state in separate databases or separate instances.",
      diagram: `The simplest cache is a Map, and it works

    const cache = new Map();
    cache.set("user:123", user);

    no network. no serialisation. nanoseconds.

    and three limits.


1. IT IS PER INSTANCE

    A   cache → user 123 (new name)
    B   cache → nothing
    C   cache → user 123 (OLD name)

    Day 21 met this as a session bug. same
    mechanism.

    a user updates their name, gets a fresh value
    from the instance that handled the write,
    refreshes, and sees the OLD name from a
    different one.

    it looks INTERMITTENT because it is: it
    depends which instance you land on.

    and a restart or deploy empties every entry,
    so a cache warm after ten minutes is cold
    again on every release.


⚠⚠ 2. IT LEAKS. Verified.

    a Map with an expiry check on READ:

      10,000 entries, 1ms TTL
      after 20ms:
        getTtl("k0")  →  undefined   ✓ correct
        cache.size    →  10000       ← still there

    EXPIRY ON READ NEVER DELETES ANYTHING.

    every key you ever cache stays in memory until
    the process restarts, because nothing sweeps
    it.

    → a naive TTL cache is an UNBOUNDED MEMORY
      LEAK with a correctness feature bolted on.

    fix: a BOUNDED cache with eviction.
    that is what lru-cache exists for: a maximum
    size, so old entries leave whether or not
    anyone reads them.


3. And Redis: one SHARED view

    A ─┐
    B ─┼── Redis
    C ─┘

    you buy:
      every instance sees the same entry
      invalidation reaches everybody
      a deploy does not empty it

    you pay:
      a network round trip
      serialisation
      a dependency to run and monitor

    TTL is the underrated part:
      SET key value EX 60
      → expiry becomes the STORE'S problem, which
        is exactly the sweeping you had to write
        for the Map


Both, on purpose

    a tiny BOUNDED in-process cache in front of
    Redis, holding the handful of keys read
    constantly, cuts most round trips for the
    hottest data.

    Redis behind it gives correctness and sharing.

    ⚠ the catch: the top layer REINTRODUCES
      per-instance staleness.

      so keep its TTL very short, a few seconds,
      and use it only where being briefly out of
      date is harmless.

      a deliberate trade, written down next to the
      code.


⚠ Eviction: know what a FULL Redis does

    the default may not be what you expect:

      noeviction → writes start FAILING rather
                   than making room

    for a pure cache you want an LRU policy and a
    maxmemory, so a full cache degrades into a
    LESS EFFECTIVE CACHE rather than into ERRORS.

    ⚠ and if the same Redis holds sessions or rate
      limit counters, eviction can silently delete
      THOSE.

      → keep cache and durable state in separate
        databases or instances.`,
      codeExample: {
        title: "The Map that leaks, and a two-layer cache",
        code: `// ── ⚠ The leak, verified ────────────────────────────────────
const ttlCache = new Map();

function setTtl(key, value, ms) {
  ttlCache.set(key, { value, exp: Date.now() + ms });
}
function getTtl(key) {
  const entry = ttlCache.get(key);
  if (!entry) return undefined;
  if (entry.exp < Date.now()) return undefined;   // ← "expired"
  return entry.value;
}

for (let i = 0; i < 10_000; i++) setTtl("k" + i, { i }, 1);
await sleep(20);

getTtl("k0");        // undefined       ← VERIFIED, correct
ttlCache.size;       // 10000           ← VERIFIED, still there
//
// Every one of those entries is expired and every one is
// still in memory. The read path returns undefined, which
// makes the cache CORRECT and hides the fact that it never
// releases anything.
//
// In a long-running process this grows at the rate of your
// key space. Cache per user id and you eventually hold an
// entry for every user who has ever visited.
//
// The \`if (entry.exp < Date.now()) return undefined\` line is
// what makes this invisible: it looks like the expiry is
// handled.


// ── ✓ A bounded cache instead ───────────────────────────────
import { LRUCache } from "lru-cache";

const local = new LRUCache({
  max: 1_000,                    // ← the important number
  ttl: 5_000,                    // 5s, deliberately short
  updateAgeOnGet: false,         // a hot key still expires on time
});
//
// max is what makes it bounded: the 1,001st key evicts the
// least recently used one, whether or not anything read it.
// TTL alone never bounds anything, which is the whole point
// of the verified leak above.
//
// If you must use a Map, sweep it:
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of ttlCache) {
    if (entry.exp < now) ttlCache.delete(key);
  }
}, 60_000).unref();
// Day 21's session cleanup, and the same reason: a TTL that
// nothing enforces is documentation.


// ── ⚠ Per-instance staleness, concretely ────────────────────
// Three instances, an in-process user cache:
//
//   PATCH /users/8811  { name: "John" }
//     → instance A. Updates the DB, updates ITS cache.
//
//   GET /users/8811
//     → instance B. Cache miss, reads the DB. "John". ✓
//
//   GET /users/8811
//     → instance C. Cache HIT from ten minutes ago. "Rajan". ✗
//
// The user refreshes twice and sees two different names. The
// bug report says "sometimes my changes do not save", which
// is the least useful description of this problem and the
// most likely one you will get.
//
// Day 21 had the identical shape with sessions. Anything in a
// module-level variable is per instance, and "works on my
// machine" is guaranteed because your machine runs one.


// ── ✓ Two layers, deliberately ──────────────────────────────
import { createClient } from "redis";
const redis = createClient({ url: config.redis.url });
await redis.connect();

export async function cached(key, ttlSeconds, load) {
  // Layer 1: in process. Nanoseconds, bounded, very short TTL.
  const hot = local.get(key);
  if (hot !== undefined) {
    cacheHits.add(1, { layer: "local" });
    return hot;
  }

  // Layer 2: Redis. Shared, correct, one round trip.
  // Day 22: a cache must never be able to make this slower
  // than no cache, so slow and down both mean "miss".
  let raw = null;
  try {
    raw = await Promise.race([
      redis.get(key),
      sleep(50).then(() => null),
    ]);
  } catch (err) {
    log().warn({ err, key }, "cache read failed, falling through");
  }

  if (raw !== null) {
    const value = JSON.parse(raw);
    local.set(key, value);
    cacheHits.add(1, { layer: "redis" });
    return value;
  }

  // Miss on both. Do the work.
  cacheMisses.add(1, {});
  const value = await load();

  local.set(key, value);
  // Fire and forget the Redis write: a slow cache write should
  // not delay a response that is already ready.
  redis.set(key, JSON.stringify(value), { EX: ttlSeconds })
    .catch((err) => log().warn({ err, key }, "cache write failed"));

  return value;
}
//
// ⚠ And write down what layer 1 costs you:
//
//   The local TTL is 5 seconds, so for up to 5 seconds after
//   an invalidation an instance can still serve the old
//   value from memory, even though Redis is correct.
//
//   That is acceptable for a product catalogue and NOT
//   acceptable for a permission check, so the two-layer
//   helper is not the one you use for everything. This
//   comment is the deliberate part.


// ── Invalidation has to reach both layers ───────────────────
export async function invalidate(key) {
  local.delete(key);                         // this instance
  await redis.del(key);                      // everyone's layer 2
  // ⚠ Other instances' layer 1 still holds it for up to their
  // TTL. That window is the price of layer 1, and it is why
  // the TTL is 5 seconds and not 5 minutes.
  //
  // If you need it gone everywhere immediately, publish an
  // invalidation on a Redis channel and have every instance
  // drop its local entry. That is real complexity; do not add
  // it until the 5-second window is actually a problem.
}


// ── ⚠ Eviction: what a full Redis does ──────────────────────
// redis.conf
//
//   maxmemory 2gb
//   maxmemory-policy allkeys-lru
//
// Without maxmemory-policy set to an eviction strategy, the
// default refuses WRITES when memory is full rather than
// making room. A cache that starts erroring instead of
// evicting is a cache that takes your application down when
// it fills up, which is the opposite of what you added it for.
//
// ⚠ And note allkeys-lru evicts ANYTHING, including keys you
//   did not think of as cache:
//
//     sess:abc123        ← a session. Now the user is logged out.
//     ratelimit:1.2.3.4  ← a counter. Now the limit resets.
//     idem:payment-abc   ← Day 22's idempotency key. Now a
//                          retry charges twice.
//
// So: cache and durable state do not share a Redis database.
//
//   redis://host/0   cache        maxmemory + allkeys-lru
//   redis://host/1   sessions, rate limits, idempotency keys
//
// Or separate instances, which is better and costs more. The
// idempotency case is the one that should decide it: an
// evicted key there is a double charge.


// ── When a Map is the right answer ──────────────────────────
// ✓ Immutable, derived at startup, bounded by your own code:
const countryByCode = new Map(COUNTRIES.map((c) => [c.code, c]));
// No TTL, no invalidation, no growth. This is not really a
// cache, it is a lookup table, and it needs none of this
// lesson.
//
// ✓ A compiled regex, a parsed template, a prepared statement.
//   Bounded by the number of distinct routes or templates,
//   which is a number you control.
//
// ✗ Anything keyed by a user id, an order id or a URL. That
//   key space is unbounded and belongs in something with a
//   max.`,
      },
      keyTakeaways: [
        "An in-process `Map` is nanoseconds with no network, and genuinely the right tool for immutable lookup tables built at startup.",
        "It is per instance. Three instances mean a user can update a value and then see the old one, which reads as an intermittent bug.",
        "Verified: a `Map` with expiry checked on read never deletes. 10,000 expired entries, `size` still 10,000.",
        "So a naive TTL cache is an unbounded memory leak, and the expiry check on read is what makes it invisible.",
        "TTL alone bounds nothing. `max` is what bounds a cache, which is why `lru-cache` exists and why a `Map` needs a sweep.",
        "Redis buys one shared view: every instance sees the same entry, invalidation reaches everybody, and a deploy does not empty it.",
        "Redis's TTL support is the underrated part, because expiry becomes the store's problem rather than a sweep you write.",
        "Two layers is the useful arrangement: a small bounded local cache in front of Redis for the hottest keys.",
        "The top layer reintroduces per-instance staleness for the length of its TTL, so keep it at seconds and write down that trade.",
        "A cache read must never make an endpoint slower than no cache. Treat slow and failed reads as a miss.",
        "Fire and forget the cache write, so a slow cache does not delay a response that is already ready.",
        "Know what a full Redis does. Without an eviction policy, writes fail rather than making room, so a full cache becomes an outage.",
        "`allkeys-lru` evicts anything, including sessions, rate limit counters and idempotency keys. An evicted idempotency key is a double charge.",
        "Keep cache and durable state in separate Redis databases or instances.",
      ],
      commonMistakes: [
        "A `Map` with a read-time TTL check, which is correct and leaks every key you ever cache.",
        "Assuming a TTL bounds memory. Only a maximum size does.",
        "An in-process cache behind a load balancer, producing changes that appear to save intermittently.",
        "Awaiting a cache read with no timeout, so a slow cache is slower than no cache.",
        "Awaiting the cache write before responding, adding latency to a response that was ready.",
        "Letting a cache error propagate, turning a cache outage into an application outage.",
        "Invalidating Redis and forgetting the local layer, so the instance that handled the write still serves the old value.",
        "Running Redis with no `maxmemory-policy`, so writes fail when it fills instead of evicting.",
        "Sharing one Redis between cache and sessions or idempotency keys, where LRU eviction silently deletes them.",
        "Caching by user id or URL in a `Map`, which is an unbounded key space in an unbounded container.",
      ],
      quiz: [
        {
          question: "What was verified about a `Map` cache that checks expiry on read?",
          options: [
            "Expired entries are removed automatically",
            "Reads correctly return `undefined` while `size` stayed at 10,000, so nothing is ever deleted",
            "It throws when full",
            "TTL is not supported",
          ],
          correctIndex: 1,
          explanation:
            "The read-time check is what makes the leak invisible: the cache is correct and holds every key you ever wrote.",
        },
        {
          question: "What actually bounds a cache's memory?",
          options: [
            "A TTL",
            "A maximum size, so the next key evicts the least recently used one whether or not anything read it",
            "A sweep interval alone",
            "Serialisation",
          ],
          correctIndex: 1,
          explanation:
            "That is why `lru-cache` takes a `max`, and why a plain `Map` needs an explicit sweep as well.",
        },
        {
          question: "What does an in-process cache do behind a load balancer?",
          options: [
            "Nothing unusual",
            "Different instances hold different values, so a user can update something and then see the old value, which reads as an intermittent bug",
            "It synchronises automatically",
            "It doubles memory use",
          ],
          correctIndex: 1,
          explanation:
            "Day 21 met the same mechanism with sessions. Anything in a module-level variable is per instance.",
        },
        {
          question: "Why keep a local cache's TTL to a few seconds when it sits in front of Redis?",
          options: [
            "Memory",
            "It reintroduces per-instance staleness, so an invalidated value can still be served locally for the length of that TTL",
            "Redis requires it",
            "To avoid eviction",
          ],
          correctIndex: 1,
          explanation:
            "That window is the price of layer one, and it is why the two-layer helper is not the one you use for permission checks.",
        },
        {
          question: "What happens to a Redis with no eviction policy when it fills up?",
          options: [
            "It evicts the oldest keys",
            "Writes start failing, so a full cache becomes an application outage rather than a less effective cache",
            "It flushes everything",
            "It grows into swap",
          ],
          correctIndex: 1,
          explanation:
            "Set `maxmemory` and an LRU policy, and keep durable state out of that database, because eviction does not distinguish a cache entry from an idempotency key.",
        },
        {
          question: "Why should cache and idempotency keys not share a Redis database?",
          options: [
            "Performance isolation",
            "`allkeys-lru` evicts anything, and an evicted idempotency key means a retry charges twice",
            "Different serialisation",
            "Key naming conflicts",
          ],
          correctIndex: 1,
          explanation:
            "The same applies to sessions and rate limit counters. That case is the one that should decide the separation.",
        },
      ],
    },
    {
      id: "cache-aside-and-serialisation",
      title: "Cache-aside, TTL and the serialisation trap",
      durationMinutes: 11,
      explanation:
        "## Cache-aside\n\n<b>Cache-aside</b> (the application checks the cache and loads from the database on a miss).\n\n```text\nRequest → check cache → HIT  → return\n                      → MISS → database → write cache → return\n```\n\n```javascript\nconst cached = await redis.get(\"user:123\");\nif (cached) return JSON.parse(cached);\n\nconst user = await db.user.findById(123);\nawait redis.set(\"user:123\", JSON.stringify(user), { EX: 60 });\nreturn user;\n```\n\n> It is the common pattern because the application stays in control: it decides what is cached, for how long, and what happens on a failure. The alternative patterns move that decision into the cache layer, and the next lesson covers the trade.\n\n---\n\n## The bug in that snippet\n\n> `if (cached)` is wrong, and it is in almost every tutorial. A cached value of `0`, `\"\"` or `false` is falsy, so a legitimate hit is treated as a miss and you query the database on every request for exactly the values that were cheapest to cache.\n>\n> Redis returns `null` for a missing key, so the test is `if (cached !== null)`. Small, and it silently disables your cache for a whole class of values.\n\n---\n\n## The serialisation trap\n\nThis is the important part of the lesson. Verified:\n\n```text\ncreatedAt instanceof Date   before: true   after: false\n  → \"2026-01-01T00:00:00.000Z\", a string\nnested.at                   → a string too\nmeta: undefined             → the key is gone entirely\nBigInt                      → TypeError: Do not know how to serialize a BigInt\n```\n\n> So a cached object has a <b>different shape</b> from an uncached one. Which means your code works on a miss and breaks on a hit:\n>\n> ```javascript\n> const user = await getUser(123);\n> user.createdAt.toISOString();   // fine on a miss, throws on a hit\n> ```\n>\n> That is the worst kind of bug: it passes every test that starts with an empty cache, appears intermittently in production, and depends on timing. And the same applies in reverse to a `Date` you compare or sort by, which silently becomes a string comparison.\n\nThe fix is to make the cached shape the <b>only</b> shape: parse the value back into real types on read, or cache a plain serialisable object and never put a `Date` in it.\n\n---\n\n## TTL\n\n<b>TTL (Time To Live)</b> (how long an entry may live before it expires).\n\n> A TTL is not primarily a freshness setting, it is a <b>bound on how wrong you can be</b>. If invalidation is perfect the TTL never matters; the TTL is what saves you when invalidation is missed, which it will be, because it lives in different code from the write.\n>\n> So choose it by consequence rather than by feel: how long can this be wrong before somebody is materially affected? Then, separately, make invalidation good enough that the TTL rarely fires.\n\n---\n\n## Key design\n\n> Two rules that prevent most cache incidents.\n>\n> Include a <b>version</b> in the key: `user:v2:123`. A deploy that changes the cached shape then reads no old entries, instead of reading yesterday's shape into today's code. Without it, changing a cached object is a deploy that breaks until the TTL clears.\n>\n> And make the key include <b>everything the value depends on</b>. A key of `products:page:1` for a response that varies by locale or by user role will serve one user's view to another, which is Day 19's leak arriving through a cache.",
      diagram: `Cache-aside: the application stays in control

    request → check cache
                HIT  → return
                MISS → database → write cache
                     → return

    it decides WHAT is cached, FOR HOW LONG, and
    what happens ON FAILURE.


⚠ The bug in the standard snippet

    if (cached) return JSON.parse(cached);
        ^^^^^^ WRONG, and it is in almost every
               tutorial

    a cached 0, "" or false is FALSY.

    → a legitimate hit is treated as a miss

    → you query the database on every request for
      exactly the values that were cheapest to
      cache

    Redis returns null for a missing key, so:

      if (cached !== null)


⚠⚠ THE SERIALISATION TRAP. Verified.

    createdAt instanceof Date
      before  true
      after   FALSE
              → "2026-01-01T00:00:00.000Z"

    nested.at        → a string too
    meta: undefined  → the KEY IS GONE
    BigInt           → TypeError: Do not know how
                       to serialize a BigInt

    so a CACHED object has a DIFFERENT SHAPE from
    an UNCACHED one.

    which means your code works on a MISS and
    breaks on a HIT:

      const user = await getUser(123);
      user.createdAt.toISOString();
        fine on a miss
        THROWS on a hit

    the worst kind of bug:

      passes every test that starts with an empty
      cache
      appears intermittently in production
      depends on TIMING

    and in reverse: a Date you SORT BY silently
    becomes a string comparison.

    ✓ fix: make the cached shape the ONLY shape.

      parse back into real types on read
      or cache a plain serialisable object and
        never put a Date in it


TTL: a bound on HOW WRONG YOU CAN BE

    a TTL is not primarily a freshness setting.

    if invalidation were perfect, the TTL would
    never matter.

    THE TTL IS WHAT SAVES YOU WHEN INVALIDATION IS
    MISSED

    ...which it will be, because it lives in
    different code from the write.

    → choose it by CONSEQUENCE:

      how long can this be wrong before somebody
      is materially affected?

    then, separately, make invalidation good
    enough that the TTL rarely fires.


Key design: two rules that prevent incidents

    1. VERSION THE KEY

       user:v2:123

       a deploy that changes the cached shape then
       reads NO OLD ENTRIES, instead of reading
       yesterday's shape into today's code.

       without it, changing a cached object is a
       deploy that BREAKS until the TTL clears.

    2. THE KEY MUST INCLUDE EVERYTHING THE VALUE
       DEPENDS ON

       products:page:1

       for a response that varies by LOCALE or by
       ROLE will serve one user's view to another.

       → Day 19's leak, arriving through a cache.`,
      codeExample: {
        title: "Cache-aside with the traps closed",
        code: `// ── ⚠ Trap 1: the falsy check ───────────────────────────────
// ✗ In almost every tutorial:
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
//  ^^^^^^ a cached "0", "false" or "" is falsy
//
// So caching a count of 0, a boolean flag, or an empty string
// means every request is a "miss" and hits the database. The
// cache silently does nothing for the cheapest values in it,
// and the hit rate metric from the first lesson is how you
// would notice.

// ✓
const raw = await redis.get(key);
if (raw !== null) return JSON.parse(raw);
//         ^^^^^^^^ Redis returns null for a missing key, and
//         only for a missing key.


// ── ⚠⚠ Trap 2: the shape changes. Verified. ─────────────────
const user = {
  id: 1,
  name: "Rajan",
  createdAt: new Date("2026-01-01"),
  deletedAt: undefined,
  nested: { at: new Date() },
};

const round = JSON.parse(JSON.stringify(user));

user.createdAt instanceof Date;    // true
round.createdAt instanceof Date;   // false     ← VERIFIED
round.createdAt;                   // "2026-01-01T00:00:00.000Z"
typeof round.nested.at;            // "string"  ← VERIFIED
"deletedAt" in round;              // false     ← VERIFIED, key gone

JSON.stringify({ n: 10n });
// TypeError: Do not know how to serialize a BigInt  ← VERIFIED
//
// So this function returns two different shapes:
async function getUserBroken(id) {
  const raw = await redis.get(\`user:\${id}\`);
  if (raw !== null) return JSON.parse(raw);      // createdAt: string

  const u = await db.select().from(users).where(eq(users.id, id));
  await redis.set(\`user:\${id}\`, JSON.stringify(u[0]), { EX: 60 });
  return u[0];                                   // createdAt: Date
}

// And the caller is correct either way and broken one way:
const u = await getUserBroken(123);
u.createdAt.toISOString();
//          ^^^^^^^^^^^ works on the first request of every
//          minute and throws on the other 999
//
// TypeError: u.createdAt.toISOString is not a function
//
// Which passes every test that starts with an empty cache,
// appears intermittently in production, and depends on
// whether you were the unlucky one to hit a warm cache.
//
// The reverse is quieter and worse:
//   rows.sort((a, b) => a.createdAt - b.createdAt)
//   → NaN for strings, so the sort silently does nothing


// ── ✓ Fix: one shape, always ────────────────────────────────
// Option A: revive on read. Explicit and cheap.
const USER_DATES = ["createdAt", "updatedAt", "deletedAt"];

function reviveUser(obj) {
  for (const field of USER_DATES) {
    if (obj[field]) obj[field] = new Date(obj[field]);
  }
  return obj;
}

export async function getUser(id) {
  const key = \`user:v2:\${id}\`;
  const raw = await redis.get(key);
  if (raw !== null) return reviveUser(JSON.parse(raw));

  const [row] = await db.select().from(users).where(eq(users.id, id));
  if (!row) return null;

  await redis.set(key, JSON.stringify(row), { EX: 60 });
  return row;
}
// Both paths now return real Dates. Note reviveUser runs only
// on the cache path, which means a bug in it shows up as an
// intermittent failure, so it is worth a test.

// Option B, and usually better: cache a shape with no Dates.
// Day 16's response schema already gives you one.
export async function getUserView(id) {
  const key = \`user-view:v2:\${id}\`;
  const raw = await redis.get(key);
  if (raw !== null) return JSON.parse(raw);
  //                       ^^^^^^^^^^^^^^ no revive step,
  //                       because there is nothing to revive

  const [row] = await db.select().from(users).where(eq(users.id, id));
  if (!row) return null;

  const view = {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt.toISOString(),   // a string, on purpose
  };

  await redis.set(key, JSON.stringify(view), { EX: 60 });
  return view;
}
// If the thing you cache is the response you send, the round
// trip is lossless by construction: it was already going to
// be JSON. This is the version to prefer.


// ── ⚠ Caching a miss, so a hot 404 does not hammer the DB ───
export async function getUserOrNull(id) {
  const key = \`user:v2:\${id}\`;
  const raw = await redis.get(key);

  if (raw === "null") return null;      // a cached MISS
  if (raw !== null) return reviveUser(JSON.parse(raw));

  const [row] = await db.select().from(users).where(eq(users.id, id));

  await redis.set(key, JSON.stringify(row ?? null), {
    EX: row ? 60 : 10,
    //         ^^ a shorter TTL for a negative result, since a
    //         user that does not exist yet may exist soon
  });

  return row ? reviveUser(row) : null;
}
// Without negative caching, a client requesting a
// non-existent id in a loop bypasses your cache entirely, and
// Day 19's IDOR-probing attacker does exactly that.


// ── TTL by consequence, not by feel ─────────────────────────
const TTL = {
  countries: 24 * 3600,     // wrong for a day: nobody notices
  productList: 60,          // wrong for a minute: a price is stale
  exchangeRate: 30,         // wrong for 30s: mark it stale in the
                            //   response
  userProfile: 60,          // wrong for a minute: their own edit
                            //   looks unsaved
  permissions: 10,          // wrong for 10s: a revoked role still
                            //   works. defensible. 3600 is not.
  cartTotal: 0,             // not cached. wrong is unacceptable.
};
//
// Write the middle column. A TTL with no stated consequence
// is a number somebody guessed, and it will be defended in an
// incident review by whoever guessed it.


// ── ⚠ Key design: version and completeness ──────────────────
// 1. VERSION. Without it, this is a broken deploy:
//
//    Monday:   cache { id, name }          under user:123
//    Tuesday:  deploy code reading .email  under user:123
//              → every cache hit returns an object with no
//                email, for 60 seconds after every restart,
//                and for the full TTL after the deploy
//
//    With user:v2:123, the new code reads no old entries.
//    Bump the version whenever the cached shape changes, and
//    keep it next to the shape it describes.

// 2. COMPLETENESS. Every input to the value must be in the key.
//
// ✗ \`products:page:\${page}\`
//   for a response that varies by locale and by role:
//
//     an admin warms the cache with admin-visible products
//     a normal user gets the admin view
//
//   Day 19's authorization leak, delivered by your cache, and
//   invisible to every ownership predicate you wrote.
//
// ✓
const key = [
  "products", "v2",
  \`page:\${page}\`,
  \`limit:\${limit}\`,
  \`locale:\${locale}\`,
  \`role:\${role}\`,
].join(":");
//
// ⚠ And if the key needs a USER id to be correct, that is the
//   first lesson's warning: you are about to cache per user,
//   with a hit rate to match. Often the right answer is not to
//   cache that response at all, and to cache the shared query
//   underneath it instead.`,
      },
      keyTakeaways: [
        "Cache-aside keeps the application in control of what is cached, for how long, and what happens on failure.",
        "`if (cached)` is wrong: a cached `0`, `\"\"` or `false` is falsy, so a hit is treated as a miss. Test `!== null`.",
        "That bug silently disables the cache for the cheapest values in it, and the hit rate is how you would notice.",
        "Verified: `JSON.parse(JSON.stringify(obj))` turns a `Date` into a string, including nested ones, drops `undefined` keys, and throws on `BigInt`.",
        "So a cached object has a different shape from an uncached one, and your code works on a miss and breaks on a hit.",
        "That failure passes every test starting with an empty cache and appears intermittently in production.",
        "The quiet version is worse: sorting by a `Date` that is now a string produces `NaN` and silently does nothing.",
        "Fix it by making the cached shape the only shape: revive types on read, or cache a plain view object with no `Date` in it.",
        "Caching the response shape from Day 16 is lossless by construction, because it was already going to be JSON.",
        "Cache negative results with a shorter TTL, or a client probing non-existent ids bypasses the cache entirely.",
        "A TTL is a bound on how wrong you can be. It is what saves you when invalidation is missed, which it will be.",
        "Choose the TTL by consequence and write the consequence down, or it is a number somebody guessed.",
        "Version the key. Changing a cached shape without it is a deploy that breaks for the length of the TTL.",
        "The key must include every input the value depends on. A missing role or locale serves one user's view to another, which is an authorization leak through a cache.",
      ],
      commonMistakes: [
        "`if (cached)` rather than `if (cached !== null)`, disabling the cache for zero, empty strings and false.",
        "Putting a `Date` in a cached object, so the cached shape differs from the fresh one and callers break on a hit.",
        "Sorting or comparing a field that is a `Date` on a miss and a string on a hit, which fails silently.",
        "Caching a database row directly rather than a serialisable view.",
        "Not caching misses, so a client probing unknown ids bypasses the cache.",
        "Choosing a TTL by feel with no stated consequence.",
        "Treating the TTL as the freshness mechanism instead of as the backstop for missed invalidation.",
        "Unversioned keys, so a shape change breaks every request that gets a hit until the TTL clears.",
        "A key missing the locale, role or tenant, which serves one user's response to another.",
        "Caching per user without noticing that the key needing a user id is a sign the response should not be cached.",
      ],
      quiz: [
        {
          question: "What is wrong with `if (cached) return JSON.parse(cached)`?",
          options: [
            "Nothing",
            "A cached `0`, `\"\"` or `false` is falsy, so a real hit is treated as a miss. Test `cached !== null`.",
            "`JSON.parse` may throw",
            "It needs `await`",
          ],
          correctIndex: 1,
          explanation:
            "It disables the cache for exactly the cheapest values in it, and a low hit rate is the only symptom.",
        },
        {
          question: "What was verified about `JSON.parse(JSON.stringify(obj))` with a `Date`?",
          options: [
            "The `Date` survives",
            "`instanceof Date` becomes false and the value is an ISO string, including nested dates; `undefined` keys vanish and `BigInt` throws",
            "It throws for all objects",
            "Only top-level dates change",
          ],
          correctIndex: 1,
          explanation:
            "So a cached object has a different shape, and `user.createdAt.toISOString()` works on a miss and throws on a hit.",
        },
        {
          question: "Why is that serialisation bug particularly nasty?",
          options: [
            "It is slow",
            "It passes every test that starts with an empty cache and appears intermittently in production depending on whether you hit a warm cache",
            "It corrupts Redis",
            "It only affects TypeScript",
          ],
          correctIndex: 1,
          explanation:
            "The quiet version is worse still: sorting by a field that is now a string produces `NaN` and does nothing.",
        },
        {
          question: "What is a TTL actually for?",
          options: [
            "Freshness",
            "A bound on how wrong you can be. If invalidation were perfect it would never matter; it is the backstop for the invalidation you missed.",
            "Memory management",
            "Rate limiting",
          ],
          correctIndex: 1,
          explanation:
            "Choose it by consequence and write the consequence next to the number, or it is a guess somebody will defend in an incident review.",
        },
        {
          question: "Why version a cache key?",
          options: [
            "For debugging",
            "A deploy that changes the cached shape otherwise reads yesterday's shape into today's code for the full TTL",
            "Redis requires it",
            "To improve the hit rate",
          ],
          correctIndex: 1,
          explanation:
            "Bump the version whenever the shape changes, and keep it next to the shape it describes.",
        },
        {
          question: "What happens if a cache key omits the user's role?",
          options: [
            "A lower hit rate",
            "An admin can warm the cache with an admin view and a normal user receives it, which is an authorization leak through the cache",
            "Nothing, roles rarely differ",
            "The TTL is ignored",
          ],
          correctIndex: 1,
          explanation:
            "Every ownership predicate from Day 19 is bypassed, because the response never reaches the query.",
        },
      ],
    },
    {
      id: "stampedes-and-invalidation",
      title: "Stampedes and invalidation",
      durationMinutes: 12,
      explanation:
        "## Cache stampede\n\n<b>Cache stampede</b> (many requests discovering the same missing key at once and all doing the work).\n\nVerified, with 1000 concurrent requests for one missing key:\n\n```text\nnaive cache-aside  →  1000 database calls\n```\n\n> Every one of them checked the cache, found nothing, and started the query. The cache-aside pattern from the last lesson has a gap between the read and the write, and under concurrency <b>every</b> request fits inside it.\n>\n> That makes a popular key expiring a scheduled outage. Your database has been handling one query a minute for this value, and then it gets a thousand at once, which is the moment a cache stops protecting the database and starts synchronising an attack on it.\n\n---\n\n## Request coalescing\n\n<b>Request coalescing</b> (making concurrent requests for the same key share one in-flight load).\n\nVerified, same 1000 requests:\n\n```text\ncoalesced  →  1 database call\n```\n\n> The technique is one line of insight: <b>cache the promise, not the value</b>. Store the in-flight promise in a map keyed by the cache key, and a second caller arriving mid-flight awaits the same promise rather than starting its own work.\n>\n> That is per instance, which is usually enough: ten instances means ten queries instead of a thousand. If you need one across the fleet, that is a distributed lock, and the last lesson on this day explains why you should want to avoid needing it.\n\n---\n\n## Cache invalidation\n\n<b>Cache invalidation</b> (removing or updating a cached value when the underlying data changes).\n\n```text\nUPDATE database → DELETE cache → next read is fresh\n```\n\n> Delete rather than update. Writing the new value into the cache looks better and introduces a race: two concurrent updates can write in the opposite order to the one they committed in, leaving the cache holding the older value indefinitely. A delete has no such ordering problem, because the next read is authoritative.\n>\n> And the delete must happen <b>after</b> the commit. Deleting first leaves a window where a concurrent read repopulates the cache from the not-yet-committed old value, which is the same stale entry you were trying to remove, now with a fresh TTL.\n\n---\n\n## What invalidation actually costs\n\n> The hard part is not the `DEL`, it is <b>knowing every key affected by a write</b>. Updating one product may invalidate the product, three list pages that contain it, a category count, a search result and a homepage fragment. Nothing in the write knows about any of them.\n>\n> Two things help. Keep the number of keys per entity small enough to enumerate, which usually means caching fewer, coarser things. And treat the TTL as the real safety net, because the key you forget is the one that stays wrong.\n\n---\n\n## The invalidation you cannot do\n\n> Some keys have no single owner. A cached aggregate over every order changes on every order, so invalidating it precisely means invalidating it constantly, at which point the cache is doing nothing.\n>\n> The answer there is a short TTL and accepting the staleness, or a background refresh that recomputes on a schedule and serves the last result. That second option is worth knowing: it turns a stampede-prone expensive key into a value that is always warm and always slightly old, which is often exactly what you want.",
      diagram: `⚠⚠ Cache stampede. Verified.

    1000 concurrent requests, ONE missing key:

      naive cache-aside  →  1000 DATABASE CALLS

    every one checked the cache, found nothing,
    and started the query.

    the cache-aside pattern has a GAP between the
    read and the write, and under concurrency
    EVERY request fits inside it.

    → a popular key expiring is a SCHEDULED
      OUTAGE.

      your database handles one query a minute for
      this value, then gets a thousand at once.

      the moment a cache stops protecting the
      database and starts SYNCHRONISING AN ATTACK
      on it.


✓ Request coalescing. Verified.

    same 1000 requests  →  1 DATABASE CALL

    the technique is one line of insight:

      CACHE THE PROMISE, NOT THE VALUE.

    store the in-flight promise in a map keyed by
    the cache key. a second caller arriving
    mid-flight awaits THE SAME PROMISE.

    that is PER INSTANCE, which is usually enough:
    ten instances = ten queries, not a thousand.

    one across the fleet is a DISTRIBUTED LOCK,
    and the last lesson explains why you want to
    avoid needing one.


Invalidation: DELETE, do not update

    UPDATE database → DELETE cache
                    → next read is fresh

    writing the new value in looks better and adds
    a RACE:

      two concurrent updates can write to the
      cache in the OPPOSITE ORDER to the one they
      committed in

      → the cache holds the OLDER value
        indefinitely

    a delete has no ordering problem, because the
    next read is authoritative.


⚠ And delete AFTER the commit

    deleting first leaves a window where a
    concurrent read repopulates the cache from the
    NOT-YET-COMMITTED old value

    → the same stale entry you were removing, now
      with a FRESH TTL


What invalidation actually costs

    the hard part is not the DEL.

    IT IS KNOWING EVERY KEY AFFECTED BY A WRITE.

    updating one product may invalidate
      the product
      three list pages containing it
      a category count
      a search result
      a homepage fragment

    and NOTHING IN THE WRITE KNOWS ABOUT ANY OF
    THEM.

    two things help:

      keep the keys per entity few enough to
      ENUMERATE, which usually means caching
      fewer, coarser things

      treat the TTL as the real safety net,
      because the key you FORGET is the one that
      stays wrong


The invalidation you cannot do

    some keys have no single owner.

      a cached aggregate over every order changes
      on EVERY order

      so invalidating it precisely means
      invalidating it constantly, at which point
      the cache does nothing

    → a short TTL and accepted staleness

    → or a BACKGROUND REFRESH: recompute on a
      schedule, serve the last result

      that turns a stampede-prone expensive key
      into a value that is ALWAYS WARM and always
      slightly old.

      often exactly what you want.`,
      codeExample: {
        title: "Coalescing, and invalidation that does not race",
        code: `// ── ⚠ The stampede, verified ────────────────────────────────
let dbCalls = 0;
async function slowQuery() {
  dbCalls++;
  await sleep(50);
  return { id: 1, name: "Widget" };
}

const cache = new Map();

async function naive(key) {
  if (cache.has(key)) return cache.get(key);
  const value = await slowQuery();
  cache.set(key, value);
  return value;
}

dbCalls = 0;
await Promise.all(Array.from({ length: 1000 }, () => naive("p")));
dbCalls;      // 1000        ← VERIFIED
//
// A thousand requests, a thousand queries. The gap between
// \`cache.has\` and \`cache.set\` is 50ms wide, and every request
// arrived inside it.
//
// In production the trigger is a TTL expiring on a popular
// key. The database has been seeing one query a minute for
// this value; now it sees a thousand in 50ms.


// ── ✓ Coalescing: cache the PROMISE ─────────────────────────
const inflight = new Map();

async function coalesced(key) {
  if (cache.has(key)) return cache.get(key);

  // A second caller arriving here mid-flight gets the SAME
  // promise, and does no work of its own.
  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = slowQuery()
    .then((value) => {
      cache.set(key, value);
      return value;
    })
    .finally(() => inflight.delete(key));
    //        ^^^^^^^ in finally, or a failed load leaves a
    //        rejected promise in the map and every subsequent
    //        request gets the same failure forever

  inflight.set(key, promise);
  return promise;
}

dbCalls = 0;
await Promise.all(Array.from({ length: 1000 }, () => coalesced("p")));
dbCalls;      // 1            ← VERIFIED
//
// One thousand to one, for about six lines. This is the
// highest value-per-line change on the whole day.


// ── The real version, with Redis behind it ──────────────────
const inflightRedis = new Map();

export async function cached(key, ttlSeconds, load) {
  const raw = await redis.get(key).catch(() => null);
  if (raw !== null) return JSON.parse(raw);
  //         ^^^^^^ the previous lesson's null check

  const existing = inflightRedis.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const value = await load();
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds })
      .catch((err) => log().warn({ err, key }, "cache write failed"));
    return value;
  })().finally(() => inflightRedis.delete(key));

  inflightRedis.set(key, promise);
  return promise;
}
//
// Per instance, so ten instances means ten queries when a hot
// key expires rather than ten thousand. That is almost always
// enough, and it needs no coordination, no lock and no new
// failure mode.


// ── ✓ Or avoid the expiry entirely: background refresh ──────
// For a small number of expensive, always-needed keys, do not
// let them expire at all.
export function refreshAhead(key, ttlSeconds, load, intervalMs) {
  async function refresh() {
    try {
      const value = await load();
      // A TTL well beyond the refresh interval, so a failed
      // refresh serves a slightly older value instead of a
      // stampede.
      await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch (err) {
      log().error({ err, key }, "background refresh failed");
    }
  }

  refresh();
  const timer = setInterval(refresh, intervalMs);
  timer.unref();      // Day 11
  return () => clearInterval(timer);
}

refreshAhead("homepage:v2", 600, buildHomepage, 60_000);
//            ^^^^^^^^^^^^^ TTL 10 minutes, refreshed every
//            minute. The key is never missing, so there is
//            never a stampede, and a nine-minute run of failed
//            refreshes degrades gracefully into stale data
//            rather than into a thundering herd.
//
// This is the right shape for a homepage, a dashboard
// aggregate, or anything expensive that everyone reads.


// ── ⚠ Invalidation: delete, and delete AFTER ────────────────
// ✗ Update the cache with the new value:
export async function renameUserBad(db, id, name) {
  await db.update(users).set({ name }).where(eq(users.id, id));
  await redis.set(\`user:v2:\${id}\`, JSON.stringify({ id, name }), { EX: 60 });
}
//
// Two concurrent renames:
//
//   A: UPDATE name = "John"     commits second
//   B: UPDATE name = "Jane"     commits first
//   A: SET cache = "John"       lands first
//   B: SET cache = "Jane"       lands second
//
// The database says John. The cache says Jane, for the full
// TTL. The two writes reached Redis in a different order from
// the one they committed in, and nothing detects it.

// ✗ Delete before the write:
export async function renameUserAlsoBad(db, id, name) {
  await redis.del(\`user:v2:\${id}\`);
  await db.update(users).set({ name }).where(eq(users.id, id));
}
//
// Between those two lines, a concurrent read misses, queries
// the database, gets the OLD name, and writes it back with a
// fresh 60-second TTL. You have re-cached exactly the value
// you were removing.

// ✓ Commit, then delete:
export async function renameUser(db, id, name) {
  await db.transaction(async (tx) => {
    await tx.update(users).set({ name }).where(eq(users.id, id));
  });
  // After the commit, so a concurrent read cannot repopulate
  // from the old value.
  await redis.del(\`user:v2:\${id}\`);
  local.delete(\`user:v2:\${id}\`);        // the layer-1 copy too
}
// A small window remains: a read that started before the
// delete and finishes after it can still write a stale value.
// Closing that needs versioned values or a lock, and for most
// data a 60-second TTL is a better trade than either.


// ── ⚠ The hard part: knowing every affected key ─────────────
// Updating one product touches:
//
//   product:v2:{id}                    obvious
//   products:v2:page:1:locale:en       is it on page 1?
//   products:v2:page:2:locale:en       or page 2?
//   category:v2:{catId}:count          the count changed
//   search:v2:{anyQueryMatchingIt}     unknowable
//   homepage:v2                        if featured
//
// Nothing in the write knows about most of those, and the
// search one is not enumerable at all.
//
// ✓ So keep a per-entity index of what to drop:
async function invalidateProduct(productId, categoryId, locale) {
  const keys = [
    \`product:v2:\${productId}\`,
    \`category:v2:\${categoryId}:count\`,
    // Pages are enumerable only because we cap them.
    ...Array.from({ length: 5 }, (_, i) =>
      \`products:v2:page:\${i + 1}:locale:\${locale}\`),
  ];
  await redis.del(keys);
  // Search results and the homepage are NOT invalidated here,
  // deliberately: they carry a 60s TTL and being a minute
  // stale is acceptable. That sentence is the design.
}
//
// ✗ And do not reach for this:
//   const keys = await redis.keys("products:v2:*");
//
//   KEYS scans the entire keyspace and blocks Redis while it
//   does. On a large instance that is a stall for every other
//   client, which is a self-inflicted outage during a routine
//   product edit. SCAN is the non-blocking version, and
//   needing either usually means your keys should have been
//   grouped differently.


// ── The trade, stated ───────────────────────────────────────
// Precise invalidation:  fresh data, and you must enumerate
//                        every dependent key correctly, forever
// TTL only:              simple, and everything can be wrong
//                        for up to the TTL
// Both:                  invalidate what you can enumerate,
//                        and let the TTL cover what you forgot
//
// The third is the honest choice, and it means the TTL is not
// a fallback you hope never fires. It is the mechanism that
// makes forgetting survivable, which is why the last lesson
// insisted on choosing it by consequence.`,
      },
      keyTakeaways: [
        "Verified: 1000 concurrent requests for one missing key produced 1000 database calls with naive cache-aside.",
        "The gap between the cache read and the cache write is where every concurrent request fits, so a popular key expiring is a scheduled load spike.",
        "Verified: coalescing reduced the same 1000 requests to 1 database call.",
        "The technique is to cache the promise, not the value, so a second caller awaits the in-flight load rather than starting its own.",
        "Delete the in-flight entry in a `finally`, or a failed load leaves a rejected promise that every later request receives.",
        "Coalescing is per instance, which is usually enough: ten instances means ten queries instead of a thousand, with no coordination.",
        "For a few expensive always-needed keys, refresh in the background with a TTL well beyond the refresh interval, so the key never expires.",
        "Invalidate by deleting, not by writing the new value: two concurrent updates can reach the cache in the opposite order to their commits.",
        "Delete after the commit. Deleting first lets a concurrent read repopulate the cache from the uncommitted old value with a fresh TTL.",
        "The hard part of invalidation is knowing every key a write affects, and nothing in the write knows about most of them.",
        "So cache fewer, coarser things, keep the affected keys enumerable, and let the TTL cover what you forget.",
        "Never use `KEYS` to find keys to invalidate. It scans the whole keyspace and blocks Redis for every other client.",
        "Some values have no single owner, so precise invalidation is impossible. Accept a short TTL or refresh in the background.",
      ],
      commonMistakes: [
        "Naive cache-aside on a hot key, so its expiry sends every concurrent request to the database at once.",
        "Not deleting the in-flight promise in a `finally`, so one failed load poisons every subsequent request.",
        "Reaching for a distributed lock before trying per-instance coalescing, which is usually enough and has no failure modes.",
        "Writing the new value into the cache after an update, which two concurrent writers can order incorrectly.",
        "Deleting the cache entry before the commit, letting a concurrent read re-cache the old value with a fresh TTL.",
        "Assuming the only affected key is the entity's own, and leaving list pages and counts stale.",
        "Using `redis.keys(\"prefix:*\")` to find keys to drop, which blocks Redis while it scans everything.",
        "Trying to invalidate a global aggregate precisely, which means invalidating it on every write.",
        "Treating the TTL as a fallback you hope never fires, rather than the mechanism that makes forgetting survivable.",
      ],
      quiz: [
        {
          question: "What was measured for 1000 concurrent requests for one missing key?",
          options: [
            "1 database call, the cache handled it",
            "1000 database calls with naive cache-aside, and 1 with coalescing",
            "About 10 calls",
            "The requests queued",
          ],
          correctIndex: 1,
          explanation:
            "Verified both. The gap between the cache read and write is where every concurrent request fits.",
        },
        {
          question: "What is the technique behind request coalescing?",
          options: [
            "A distributed lock",
            "Cache the promise, not the value, so a second caller awaits the in-flight load instead of starting its own",
            "A longer TTL",
            "A queue",
          ],
          correctIndex: 1,
          explanation:
            "And delete the in-flight entry in a `finally`, or one failed load is returned to every subsequent request forever.",
        },
        {
          question: "Why delete a cache entry rather than write the new value?",
          options: [
            "Deleting is faster",
            "Two concurrent updates can reach the cache in the opposite order to their commits, leaving the older value cached for the full TTL",
            "Writing needs a transaction",
            "Redis has no atomic set",
          ],
          correctIndex: 1,
          explanation:
            "A delete has no ordering problem, because the next read is authoritative.",
        },
        {
          question: "Why must the delete happen after the commit?",
          options: [
            "For transaction safety",
            "Deleting first leaves a window where a concurrent read repopulates the cache from the uncommitted old value, with a fresh TTL",
            "Redis requires it",
            "It avoids a deadlock",
          ],
          correctIndex: 1,
          explanation:
            "You would re-cache exactly the stale value you were trying to remove.",
        },
        {
          question: "What is the genuinely hard part of cache invalidation?",
          options: [
            "The `DEL` command",
            "Knowing every key a write affects, when nothing in the write knows about the list pages, counts and fragments that contain it",
            "Network latency",
            "Serialisation",
          ],
          correctIndex: 1,
          explanation:
            "So cache fewer coarser things, keep the affected keys enumerable, and let the TTL cover what you forget.",
        },
        {
          question: "Why not use `redis.keys(\"products:*\")` to find keys to invalidate?",
          options: [
            "It is deprecated",
            "It scans the entire keyspace and blocks Redis while it does, stalling every other client during a routine edit",
            "It misses keys",
            "It requires admin rights",
          ],
          correctIndex: 1,
          explanation:
            "`SCAN` is the non-blocking version, and needing either usually means the keys should have been grouped differently.",
        },
      ],
    },
    {
      id: "http-caching",
      title: "HTTP caching, ETags and CDNs",
      durationMinutes: 11,
      explanation:
        "Caching is not only Redis. HTTP has its own layer, and it is the only one that removes the request from your server entirely.\n\n---\n\n## `Cache-Control`\n\n<b>`Cache-Control`</b> (a header telling clients and intermediaries how a response may be cached).\n\n```text\npublic, max-age=3600            anyone may cache it for an hour\nprivate, max-age=60             only the browser, not a shared cache\nno-store                        do not cache at all, anywhere\ns-maxage=300                    a shared cache may keep it 5 minutes\nstale-while-revalidate=60       serve stale for 60s while refreshing\n```\n\n> The distinction that matters most is <b>`public` versus `private`</b>. A response that varies by user must be `private` or `no-store`, because `public` invites a CDN to store one user's response and serve it to the next person who asks. That is Day 19's authorization leak, delivered by infrastructure you do not control.\n>\n> `stale-while-revalidate` is the underrated one: it gives you the background-refresh behaviour from the last lesson, implemented by the cache rather than by you.\n\n---\n\n## ETag\n\n<b>ETag</b> (an identifier for a specific version of a response).\n\nVerified with `@fastify/etag`:\n\n```text\nfirst request                       200, etag: \"5/XGT5IpAIyxcrlVR3rr5F8FmMI=\"\nwith If-None-Match: <that etag>     304, body length 0\nwith If-None-Match: \"stale\"         200, full body\n```\n\n> A 304 with a zero-byte body, which is the win. And here is the limitation the usual explanation leaves out: <b>the handler still ran</b>. Your route executed, the database was queried, the array was built and the ETag was computed from it. A 304 saves <b>bandwidth</b>, not server work.\n>\n> So an ETag is not a server-side cache. It helps a slow client on a large response, and it does nothing for a database under load. If the problem is your server, you need Redis or `s-maxage`; if the problem is the network, an ETag is exactly right.\n\n---\n\n## `Last-Modified`\n\nThe same mechanism with a timestamp: the client sends `If-Modified-Since` and gets a 304 if nothing changed.\n\n> ETags are generally better because they detect any change, while `Last-Modified` has one-second granularity and cannot see two edits in the same second. Use `Last-Modified` when you already have a reliable timestamp and computing an ETag would mean serialising the response anyway.\n\n---\n\n## CDN\n\n<b>CDN</b> (a distributed network of servers that caches responses closer to users).\n\n> This is the only layer that makes a request <b>not reach you at all</b>, which makes it categorically different from everything else today. Redis makes your response fast; a CDN hit means your server was never involved and neither was your database.\n>\n> `s-maxage` is how you talk to it, and it is separate from `max-age` on purpose: a CDN can hold a response for five minutes while a browser holds it for thirty seconds, so a change propagates quickly to users and your origin still sees one request per five minutes.\n\n---\n\n## The header that prevents the worst bug\n\n> <b>`Vary`</b> tells a shared cache which request headers change the response. Without `Vary: Accept-Language`, a CDN serves the French response to an English speaker. Without `Vary: Authorization`, it can serve an authenticated response to an anonymous request, which is the same class of failure as the last lesson's incomplete cache key and considerably harder to notice.\n>\n> The safe default for anything user-specific is `Cache-Control: private, no-store` and no reliance on `Vary` at all. `Vary` on a header with many values also destroys your hit rate, so a response that genuinely varies per user is a response not to cache in a shared cache.",
      diagram: `HTTP caching: the only layer that removes the
request from your server ENTIRELY


Cache-Control

    public, max-age=3600      anyone, one hour
    private, max-age=60       the browser only
    no-store                  nowhere, ever
    s-maxage=300              a SHARED cache, 5 min
    stale-while-revalidate=60 serve stale while
                              refreshing

⚠ public vs private is the one that matters

    a response that varies by USER must be private
    or no-store.

    public invites a CDN to store one user's
    response and serve it to the next person who
    asks.

    → Day 19's authorization leak, delivered by
      infrastructure you do not control.

    and stale-while-revalidate is underrated: it
    is the last lesson's background refresh,
    implemented by the CACHE rather than by you.


ETag. Verified with @fastify/etag.

    first request
      200, etag "5/XGT5IpAIyxcrlVR3rr5F8FmMI="

    If-None-Match: <that etag>
      304, BODY LENGTH 0

    If-None-Match: "stale"
      200, full body


⚠⚠ And the limitation usually left out

    THE HANDLER STILL RAN.

      your route executed
      the database was queried
      the array was built
      the ETag was computed FROM it

    a 304 saves BANDWIDTH, not SERVER WORK.

    → an ETag is NOT a server-side cache.

      it helps a slow client on a large response
      it does NOTHING for a database under load

    if the problem is your SERVER  → Redis or
                                     s-maxage
    if the problem is the NETWORK  → an ETag is
                                     exactly right


Last-Modified

    the same mechanism with a timestamp:
    If-Modified-Since → 304

    ETags are generally better: they detect ANY
    change, while Last-Modified has ONE-SECOND
    granularity and cannot see two edits in the
    same second.

    use it when you already have a reliable
    timestamp and an ETag would mean serialising
    the response anyway.


CDN: categorically different

    Redis makes your RESPONSE fast.

    a CDN hit means YOUR SERVER WAS NEVER
    INVOLVED, and neither was your database.

    s-maxage is how you talk to it, and it is
    separate from max-age on purpose:

      CDN holds it 5 minutes
      browser holds it 30 seconds

      → a change propagates quickly to users AND
        your origin sees one request per 5 minutes


⚠⚠ Vary prevents the worst bug

    Vary tells a shared cache WHICH REQUEST
    HEADERS CHANGE THE RESPONSE.

    without Vary: Accept-Language
      → a CDN serves the French response to an
        English speaker

    without Vary: Authorization
      → it can serve an AUTHENTICATED response to
        an ANONYMOUS request

    same class as the last lesson's incomplete
    cache key, and considerably harder to notice.

    ✓ safe default for anything user-specific:

      Cache-Control: private, no-store
      and no reliance on Vary at all

    and Vary on a high-cardinality header destroys
    your hit rate, so a response that genuinely
    varies per user is a response NOT to cache in
    a shared cache.`,
      codeExample: {
        title: "Headers per route, and the ones that leak",
        code: `import etag from "@fastify/etag";
await app.register(etag);


// ── Verified ETag behaviour ─────────────────────────────────
app.get("/products", async (request, reply) => {
  reply.header("cache-control", "public, max-age=60");
  return [{ id: 1, name: "Widget" }];
});

// VERIFIED:
//   1st request
//     200, etag: "5/XGT5IpAIyxcrlVR3rr5F8FmMI="
//     cache-control: public, max-age=60
//
//   If-None-Match: "5/XGT5IpAIyxcrlVR3rr5F8FmMI="
//     304, body length 0
//
//   If-None-Match: "stale"
//     200, full body
//
// ⚠ And the part to internalise: on the 304, this handler
// RAN. The array was built, the ETag was computed from it.
//
// So if listing products is a 300ms database query, a 304
// costs you 300ms and saves 4KB of transfer. That is a good
// trade on a mobile network and no help at all if your
// database is the bottleneck.


// ── ✓ Combining the layers, so each does its job ────────────
app.get("/products", {
  schema: { querystring: listQuerySchema },
}, async (request, reply) => {
  const { page, limit } = request.query;

  // Redis: removes the DATABASE work.
  const products = await cached(
    \`products:v2:page:\${page}:limit:\${limit}\`,
    60,
    () => listProducts(app.db, { page, limit }),
  );

  reply.header(
    "cache-control",
    // max-age: the browser holds it 30s
    // s-maxage: a CDN holds it 5 minutes
    // stale-while-revalidate: serve stale while refreshing
    "public, max-age=30, s-maxage=300, stale-while-revalidate=60",
  );

  // ETag: removes the TRANSFER on a repeat request.
  return products;
});
//
// Three layers, three different savings:
//
//   CDN hit         your server never sees the request
//   Redis hit       your database never sees the query
//   304            the bytes are never transferred
//
// Only the first one is free for you, which is why s-maxage
// on a genuinely public endpoint is the highest-leverage line
// on this page.


// ── ⚠⚠ The header that leaks a user's data ──────────────────
// ✗ This is a real incident, repeatedly:
app.get("/me", { preHandler: authenticate }, async (request, reply) => {
  reply.header("cache-control", "public, max-age=60");
  //                             ^^^^^^ NO
  return request.user;
});
//
// A CDN or any shared proxy caches the first user's response
// under the URL /me, and serves it to the next person who
// asks. Every authorization check you wrote is irrelevant,
// because the request never reached your server.
//
// This is the same failure as the last lesson's cache key
// missing the user id, except the cache belongs to somebody
// else and you cannot inspect it.

// ✓ Anything user-specific:
app.get("/me", { preHandler: authenticate }, async (request, reply) => {
  reply.header("cache-control", "private, no-store");
  //                             ^^^^^^^  ^^^^^^^^
  //                             browser  not even there
  return request.user;
});

// ✓ And make it structural rather than per-route:
app.addHook("onSend", async (request, reply, payload) => {
  if (!reply.getHeader("cache-control")) {
    // Deny by default, exactly like Day 19's authorization.
    // An endpoint is cacheable only if it says so.
    reply.header("cache-control", request.user ? "private, no-store" : "no-store");
  }
  return payload;
});
// A new route added next year is not publicly cacheable
// because somebody forgot a header. That default is worth
// more than remembering.


// ── ⚠ Vary, and why to avoid needing it ─────────────────────
app.get("/products", async (request, reply) => {
  const locale = request.headers["accept-language"] ?? "en";

  reply.header("cache-control", "public, s-maxage=300");
  reply.header("vary", "accept-language");
  //                    ^^^^^^^^^^^^^^^ without this, a CDN
  //                    stores the first response it sees and
  //                    serves the French list to English
  //                    speakers

  return cached(\`products:v2:locale:\${locale}\`, 60,
    () => listProducts(app.db, { locale }));
});
//
// ⚠ Two cautions.
//
// Vary: Authorization on a public-cacheable response is a
// trap: it looks like it makes the response safe, and a proxy
// with no Authorization header can still receive an entry
// cached for an anonymous request. Use private, no-store
// instead. Vary is for varying, not for securing.
//
// And Vary on a high-cardinality header destroys the hit
// rate. Accept-Language has dozens of real values including
// full lists like "en-GB,en;q=0.9,fr;q=0.8", so each variant
// gets its own entry. Normalise it into a path or query
// parameter instead:
//
//   /products?locale=en     one key, one cache entry, and it
//                           is visible in your logs

// ── Immutable assets, the easy win ──────────────────────────
app.register(fastifyStatic, {
  root: "./dist/assets",
  prefix: "/assets/",
  cacheControl: true,
  maxAge: 31536000,          // one year
  immutable: true,
});
// Safe only because the filenames contain a content hash:
//
//   /assets/app.4f3a91c2.js
//
// The file at that URL can never change, so a year is
// correct, and a new build produces a new URL. This is the
// single best caching arrangement there is, and it works
// because the key includes a hash of the content, which is
// the last lesson's completeness rule taken to its limit.


// ── ⚠ And the one you must get right ────────────────────────
// index.html must NOT be cached the same way:
//
//   Cache-Control: no-cache
//
// It is the file that tells the browser which hashed asset
// URLs to load. Cache it for a year and users run last year's
// application forever, pointing at asset URLs you have long
// since deleted, and there is nothing you can deploy to fix
// it.
//
// So: hashed assets immutable for a year, and the HTML that
// references them never cached. Getting that pair the wrong
// way round is the most expensive caching mistake available,
// because you cannot recall it.


// ── Testing it, since headers are easy to get wrong ─────────
test("no authenticated route is publicly cacheable", async (t) => {
  const app = buildApp({ logger: false });
  t.after(() => app.close());
  await app.ready();

  const authed = ["/me", "/orders", "/invoices/1", "/settings"];

  for (const url of authed) {
    const res = await app.inject({
      url, headers: { authorization: \`Bearer \${token}\` },
    });
    const cc = res.headers["cache-control"] ?? "";
    assert.ok(!cc.includes("public"), \`\${url} is publicly cacheable\`);
    assert.ok(!cc.includes("s-maxage"), \`\${url} is CDN-cacheable\`);
  }
});
// Four lines, and it catches the one caching mistake that is
// a security incident rather than a performance problem.`,
      },
      keyTakeaways: [
        "HTTP caching is the only layer that stops a request reaching your server at all, which makes a CDN categorically different from Redis.",
        "`public` versus `private` is the distinction that matters. A `public` response that varies by user invites a shared cache to serve one user's data to another.",
        "Verified: `@fastify/etag` returns a 304 with a zero-byte body when `If-None-Match` matches, and a 200 with the full body when it does not.",
        "The limitation usually omitted: the handler still ran. A 304 saves bandwidth, not server work, so an ETag is not a server-side cache.",
        "If the bottleneck is your database, you need Redis or `s-maxage`. If it is the network, an ETag is the right tool.",
        "`Last-Modified` has one-second granularity, so it cannot see two edits in the same second. Prefer ETags unless you already have a timestamp.",
        "`s-maxage` is separate from `max-age` on purpose: a CDN can hold a response longer than a browser, so changes propagate fast and your origin sees few requests.",
        "`stale-while-revalidate` gives you the background-refresh pattern implemented by the cache rather than by you.",
        "`Vary` tells a shared cache which headers change the response. Without it, a CDN serves the wrong language or an authenticated response to an anonymous request.",
        "`Vary: Authorization` is not a security mechanism. Use `private, no-store` for anything user-specific.",
        "`Vary` on a high-cardinality header destroys the hit rate. Normalise a locale into a query parameter instead.",
        "Set a deny-by-default `Cache-Control` in an `onSend` hook, so a route is only publicly cacheable if it says so.",
        "Hashed asset filenames can be immutable for a year, because the URL includes a hash of the content.",
        "The HTML referencing them must never be cached that way, or users run last year's application against deleted asset URLs with no fix you can deploy.",
      ],
      commonMistakes: [
        "`Cache-Control: public` on an authenticated response, which lets a shared cache serve one user's data to another.",
        "Believing an ETag reduces server load. Verified: the handler ran and produced the response before the 304 was decided.",
        "Using an ETag to solve a slow database, when the query still executes on every request.",
        "Omitting `Vary` on a response that varies by header, so a CDN serves the wrong variant.",
        "Using `Vary: Authorization` as a safety measure instead of `private, no-store`.",
        "`Vary` on `Accept-Language`, which fragments the cache across dozens of header variants.",
        "No default `Cache-Control`, so a new route inherits whatever an intermediary decides.",
        "Caching `index.html` for a long period, which pins users to an old build referencing deleted asset URLs.",
        "Long-lived caching on assets without a content hash in the filename, so a deploy cannot invalidate them.",
        "Never testing that authenticated routes are not publicly cacheable, which is the one caching bug that is a security incident.",
      ],
      quiz: [
        {
          question: "What did the verified 304 response contain, and what did it not save?",
          options: [
            "A full body, and it saved nothing",
            "A zero-byte body, and it did not save server work: the handler ran and produced the response before the ETag was compared",
            "A partial body",
            "It saved both bandwidth and the query",
          ],
          correctIndex: 1,
          explanation:
            "So an ETag helps a slow client on a large response and does nothing for a database under load.",
        },
        {
          question: "What is the risk of `Cache-Control: public` on an authenticated response?",
          options: [
            "A lower hit rate",
            "A shared cache stores one user's response under that URL and serves it to the next person, bypassing every authorization check",
            "The browser ignores it",
            "It breaks ETags",
          ],
          correctIndex: 1,
          explanation:
            "The same failure as an incomplete cache key, except the cache belongs to somebody else and you cannot inspect it.",
        },
        {
          question: "Why is `s-maxage` separate from `max-age`?",
          options: [
            "Legacy compatibility",
            "So a CDN can hold a response longer than a browser: changes reach users quickly while your origin sees far fewer requests",
            "It is for HTTPS only",
            "Browsers ignore `max-age`",
          ],
          correctIndex: 1,
          explanation:
            "A CDN hit is the only saving that costs you nothing at all, which makes `s-maxage` the highest-leverage header on a public endpoint.",
        },
        {
          question: "What does `Vary` do, and what is it not?",
          options: [
            "It varies the TTL",
            "It tells a shared cache which request headers change the response. It is not a security mechanism; use `private, no-store` for user data.",
            "It disables caching",
            "It sets the ETag",
          ],
          correctIndex: 1,
          explanation:
            "`Vary: Authorization` looks protective and a proxy can still serve an entry cached for an anonymous request.",
        },
        {
          question: "Why can hashed asset files be cached for a year?",
          options: [
            "Assets rarely change",
            "The filename contains a content hash, so the file at that URL can never change and a new build produces a new URL",
            "Browsers revalidate anyway",
            "CDNs override the TTL",
          ],
          correctIndex: 1,
          explanation:
            "That is the cache-key completeness rule taken to its limit: the key includes a hash of the content.",
        },
        {
          question: "What must never be cached the same way as hashed assets?",
          options: [
            "Images",
            "The HTML that references them, or users run an old build pointing at asset URLs you deleted, with no fix you can deploy",
            "CSS files",
            "The favicon",
          ],
          correctIndex: 1,
          explanation:
            "Getting that pair the wrong way round is the most expensive caching mistake available, because you cannot recall it.",
        },
      ],
    },
    {
      id: "redis-beyond-cache",
      title: "Redis beyond caching, and why locks are hard",
      durationMinutes: 12,
      explanation:
        "Redis is a shared, fast, expiring key-value store, and caching is only one use of that.\n\n---\n\n## Sessions\n\nDay 21 covered this: Redis's TTL means expiry is the store's problem, with no cleanup query and no table of dead rows.\n\n> One thing to add now: if that Redis also holds your cache with `allkeys-lru`, eviction can delete a live session and log a user out at random. Sessions belong in a separate database or instance from anything evictable.\n\n---\n\n## Rate limiting\n\nDay 19 verified this: an in-process counter is per instance, so ten instances allow ten times your configured limit, silently.\n\n> The Redis version works because `INCR` is <b>atomic</b>. Two instances incrementing the same key cannot both read 99 and both write 100, which is the whole reason a shared store is required rather than merely convenient.\n\n---\n\n## Distributed lock\n\n<b>Distributed lock</b> (a mechanism so only one instance performs an operation at a time).\n\n```text\nA acquires → B waits → C waits → A releases\n```\n\nAcquire with `SET key owner NX PX 30000`: set only if absent, with an expiry.\n\n> `NX` is what makes it a lock rather than a suggestion, and `PX` is what stops a crashed holder blocking everyone forever. Both are required, and a lock without an expiry is a lock that outlives the process holding it.\n\n---\n\n## Why locks are harder than they look\n\nTwo failures, both demonstrated in a simulation rather than assumed.\n\n> <b>The TTL is a guess about how long the job takes.</b> Set 10 seconds on a job that occasionally takes 15 and a second worker acquires the lock while the first is still working. Demonstrated: with the TTL expired and A still running, B acquired successfully. <b>No code was wrong.</b> Two workers generating the same report, or charging the same card, and the lock reported success to both.\n>\n> <b>Releasing is not one operation.</b> The natural release is \"read the owner, delete if it is mine\", and that is two round trips. Demonstrated: A read the lock, stalled, its TTL expired, B acquired, and then A's delete landed and <b>removed B's lock</b>. B carried on believing it held a lock that no longer existed, so a third worker could acquire it.\n>\n> The fix for the second is a compare-and-delete in one atomic step, which in Redis means a small Lua script. The fix for the first is that there is no fix: you extend the lease while working, and accept that a long enough pause defeats it.\n\n---\n\n## So prefer not needing one\n\n> A lock is a coordination mechanism with failure modes, and the alternatives usually have none.\n>\n> A <b>unique constraint</b> makes duplicate work impossible rather than unlikely, which is Day 22's idempotency lesson. A <b>queue</b> with one consumer per key serialises by construction. A <b>database advisory lock</b> is tied to a transaction, so it releases when the connection dies rather than when a timer expires.\n>\n> Reach for a Redis lock when you want to <b>reduce duplicate work</b> and duplication is merely wasteful. Do not use one where duplication is <b>unacceptable</b>, because it cannot promise that, and the two demonstrations above are why.",
      diagram: `Redis is a shared, fast, EXPIRING key-value
store. caching is one use of that.


Sessions (Day 21)

    TTL means expiry is the STORE'S problem: no
    cleanup query, no table of dead rows.

    ⚠ and if that Redis also holds your cache with
      allkeys-lru, eviction can delete a LIVE
      SESSION and log a user out at random.

      → separate database or instance from
        anything evictable.


Rate limiting (Day 19)

    an in-process counter is per instance, so ten
    instances allow TEN TIMES your limit, silently.

    the Redis version works because INCR is
    ATOMIC.

      two instances cannot both read 99 and both
      write 100

    → which is why a shared store is REQUIRED, not
      merely convenient.


Distributed lock

    SET key owner NX PX 30000

    NX  set only if absent
        → what makes it a LOCK, not a suggestion
    PX  an expiry
        → what stops a CRASHED holder blocking
          everyone forever

    both required. a lock without an expiry
    outlives the process holding it.


⚠⚠ Failure 1: THE TTL IS A GUESS

    demonstrated:

      A acquires with a 10s TTL
      A is still working at 15s
      B acquires SUCCESSFULLY

    NO CODE WAS WRONG.

    two workers generating the same report, or
    charging the same card, and the lock reported
    success to BOTH.


⚠⚠ Failure 2: RELEASING IS NOT ONE OPERATION

    the natural release is
      "read the owner, delete if it is mine"

    that is TWO round trips.

    demonstrated:

      A reads the lock  (owner: A)
      A stalls
      A's TTL expires
      B acquires
      A's delete lands  →  DELETES B'S LOCK

      B carries on believing it holds a lock that
      no longer exists

      → a THIRD worker can now acquire it

    ✓ fix: compare-and-delete in ONE atomic step
      → a small Lua script in Redis

    ✗ fix for failure 1: there isn't one.
      you EXTEND THE LEASE while working, and
      accept that a long enough pause defeats it.


So prefer NOT NEEDING one

    a lock is coordination WITH failure modes.
    the alternatives usually have none:

    UNIQUE CONSTRAINT
      makes duplicate work IMPOSSIBLE rather than
      unlikely            (Day 22's idempotency)

    A QUEUE with one consumer per key
      serialises BY CONSTRUCTION

    A DATABASE ADVISORY LOCK
      tied to a TRANSACTION, so it releases when
      the CONNECTION dies rather than when a
      TIMER expires

    → use a Redis lock to REDUCE DUPLICATE WORK
      when duplication is merely WASTEFUL.

      do NOT use one where duplication is
      UNACCEPTABLE. it cannot promise that, and
      the two demonstrations above are why.`,
      codeExample: {
        title: "A lock, its two failure modes, and better options",
        code: `import { randomUUID } from "node:crypto";

// ── Acquire: NX and PX, both required ───────────────────────
async function acquire(key, ttlMs) {
  const owner = randomUUID();
  const ok = await redis.set(key, owner, { NX: true, PX: ttlMs });
  //                                       ^^^^^^^^  ^^^^^^^^^
  //                                       only if   or a crash
  //                                       absent    blocks
  //                                                 forever
  return ok === "OK" ? owner : null;
}
//
// A unique owner token per acquisition is what makes a safe
// release possible at all. Without it you cannot tell your own
// lock from the one somebody acquired after yours expired.


// ── ⚠⚠ Failure 1: the TTL is a guess. Demonstrated. ─────────
// A acquires with a 10-second lease. The job usually takes 6
// seconds and occasionally takes 15.
//
//   t=0    A: acquire, ttl 10s   →  ok
//   t=10   A's lease expires. A is still working.
//   t=10   B: acquire            →  OK
//
// Demonstrated in a simulation: with A's TTL expired and A
// still running, B acquired successfully.
//
// Two workers now run the same job. Neither did anything
// wrong, no error was raised, and the lock told both of them
// they held it.
//
// ✓ Extend the lease while you work:
async function withLock(key, ttlMs, fn) {
  const owner = await acquire(key, ttlMs);
  if (!owner) return { acquired: false };

  // Renew at a third of the lease, so two missed renewals do
  // not lose it.
  const renew = setInterval(async () => {
    try {
      await extend(key, owner, ttlMs);
    } catch (err) {
      log().warn({ err, key }, "lease renewal failed");
    }
  }, Math.floor(ttlMs / 3));
  renew.unref();

  try {
    return { acquired: true, result: await fn() };
  } finally {
    clearInterval(renew);
    await release(key, owner);
  }
}
// This narrows the window and does not close it. A long
// garbage collection pause, a stalled network or a suspended
// container can still outlast the lease, and then you are back
// to two holders. Design for that being possible.


// ── ⚠⚠ Failure 2: the release race. Demonstrated. ───────────
// ✗ The natural release, and it is two operations:
async function releaseUnsafe(key, owner) {
  const current = await redis.get(key);      // read
  if (current === owner) await redis.del(key);  // delete
}
//
// Demonstrated:
//
//   A: GET key            →  owner A
//   A: (stalls: GC, network, scheduler)
//      A's TTL expires
//   B: SET key NX         →  OK, B holds it
//   A: DEL key            →  DELETES B'S LOCK
//
// Result: the key is gone. B believes it holds a lock that no
// longer exists, so C can acquire it immediately and now two
// workers are running while both think they are protected.
//
// This is the same check-then-act shape as Day 22's
// idempotency window and Day 18's session fixation: two
// operations with a gap that concurrency fits inside.

// ✓ Compare-and-delete atomically. One round trip, no gap.
const RELEASE = \`
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
\`;

async function release(key, owner) {
  return redis.eval(RELEASE, { keys: [key], arguments: [owner] });
}

// And extending needs the same treatment.
const EXTEND = \`
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("pexpire", KEYS[1], ARGV[2])
  else
    return 0
  end
\`;

async function extend(key, owner, ttlMs) {
  return redis.eval(EXTEND, { keys: [key], arguments: [owner, String(ttlMs)] });
}
// Redis runs a script atomically, so nothing interleaves
// between the GET and the DEL. Any lock implementation without
// these two scripts has the demonstrated race.


// ── ✓ Using it where duplication is merely wasteful ─────────
export async function generateMonthlyReport(month) {
  const { acquired, result } = await withLock(
    \`lock:report:\${month}\`, 60_000,
    () => buildReport(db, month),
  );

  if (!acquired) {
    log().info({ month }, "report already being generated elsewhere");
    return null;
  }
  return result;
}
// If the lock fails and two instances build the report, you
// have wasted CPU. Acceptable. That is the right use of a
// Redis lock: it reduces duplicate work, and nothing depends
// on it being perfect.


// ── ✗✗ And where NOT to use one ─────────────────────────────
export async function chargeOnceBad(orderId, amountCents) {
  const { acquired } = await withLock(\`lock:charge:\${orderId}\`, 10_000,
    () => stripe.charges.create({ amount: amountCents }));
  if (!acquired) throw new ConflictError("charge in progress");
}
//
// Both demonstrated failures charge the card twice:
//
//   the TTL expires mid-charge, a second worker acquires
//   a stale release deletes a live lock, a third acquires
//
// A lock cannot promise "exactly once", so do not build
// exactly-once on top of one.


// ── ✓ Three better options ──────────────────────────────────

// 1. A unique constraint. Day 22.
//
//    ALTER TABLE payments ADD CONSTRAINT payments_order_unique
//      UNIQUE (order_id);
//
// Now a duplicate charge is IMPOSSIBLE, not unlikely, and the
// guarantee holds against a script, a migration and the next
// service. No lease, no TTL, no Lua.

// 2. A database advisory lock, tied to the transaction.
await db.transaction(async (tx) => {
  const [{ locked }] = await tx.execute(
    sql\`SELECT pg_try_advisory_xact_lock(\${hashKey(orderId)}) AS locked\`,
  );
  if (!locked) throw new ConflictError("in progress");

  await doTheWork(tx);
});
// Held for the transaction and released when it ends,
// including when the connection dies. There is no lease to
// expire and no release to race, because the database owns the
// lifetime rather than a timer. Day 17's transaction lesson
// paying off.

// 3. A queue with one consumer per key, which serialises by
//    construction and needs no lock at all. Two messages for
//    the same order are processed one after another because
//    that is what the queue does.


// ── The rule ────────────────────────────────────────────────
// Ask what happens if the lock fails, because it can:
//
//   "we do some work twice"          → a Redis lock is fine
//   "we charge a customer twice"     → use a constraint
//   "we send two emails"             → idempotency key
//   "we corrupt data"                → a transaction
//
// A distributed lock reduces the probability of concurrent
// work. It does not eliminate it, and the two demonstrations
// above are the reason. Build correctness on something that
// fails closed.`,
      },
      keyTakeaways: [
        "Redis is a shared, fast, expiring key-value store, and caching is only one use of it.",
        "Keep sessions out of a cache database with `allkeys-lru`, or eviction logs users out at random.",
        "Rate limiting needs Redis because `INCR` is atomic: two instances cannot both read 99 and both write 100.",
        "A lock needs both `NX` and `PX`. Without an expiry a crashed holder blocks everyone forever.",
        "A unique owner token per acquisition is what makes a safe release possible at all.",
        "Demonstrated: with the lease expired and the first worker still running, a second worker acquired successfully. No code was wrong.",
        "So the TTL is a guess about how long the job takes, and there is no fix, only lease renewal that narrows the window.",
        "Demonstrated: a read-then-delete release let a stalled holder delete a lock a second worker had acquired, leaving that worker unprotected and unaware.",
        "That is the same check-then-act gap as Day 22's idempotency window and Day 18's session fixation.",
        "Fix the release with a compare-and-delete Lua script, and the same for extending the lease.",
        "Use a Redis lock to reduce duplicate work when duplication is merely wasteful.",
        "Never build exactly-once on a lock. Use a unique constraint, a transaction-scoped advisory lock, or a queue with one consumer per key.",
        "A `pg_try_advisory_xact_lock` releases when the transaction ends, including when the connection dies, so there is no lease to expire and no release to race.",
        "Ask what happens if the lock fails. If the answer involves money or data, the answer is not a lock.",
      ],
      commonMistakes: [
        "A lock with no expiry, so a crashed process blocks the operation until somebody notices.",
        "A lock with no owner token, so you cannot distinguish your own lock from a later holder's.",
        "Releasing with a read followed by a delete, which lets a stalled holder delete somebody else's lock.",
        "Assuming the TTL is long enough. The one time it is not, two workers run and nothing reports an error.",
        "No lease renewal on a long job, so the lock expires mid-work.",
        "Building exactly-once semantics on a distributed lock, which cannot provide them.",
        "Using a Redis lock where a unique constraint would make the duplicate impossible.",
        "Reaching for a lock before trying a queue partitioned by key, which serialises without coordination.",
        "Sharing one Redis between the cache and locks, sessions or rate limits, where eviction can delete them.",
        "Not asking what happens when the lock fails, which is the question that decides whether a lock is the right tool.",
      ],
      quiz: [
        {
          question: "Why must a distributed lock use both `NX` and `PX`?",
          options: [
            "For performance",
            "`NX` makes it a lock rather than a suggestion, and `PX` stops a crashed holder blocking everyone forever",
            "Redis requires both",
            "To support renewal",
          ],
          correctIndex: 1,
          explanation:
            "A lock without an expiry outlives the process holding it, and one without `NX` does not exclude anybody.",
        },
        {
          question: "What was demonstrated about a TTL shorter than the job?",
          options: [
            "The lock refuses to expire",
            "A second worker acquired successfully while the first was still working, with no error and no code being wrong",
            "The first worker is killed",
            "The lock auto-extends",
          ],
          correctIndex: 1,
          explanation:
            "There is no fix, only lease renewal that narrows the window. A long enough pause still defeats it.",
        },
        {
          question: "What goes wrong with a read-then-delete release?",
          options: [
            "It is slow",
            "A stalled holder whose lease expired can delete the lock a second worker acquired, leaving that worker unprotected and unaware",
            "It leaves the key forever",
            "It needs a transaction",
          ],
          correctIndex: 1,
          explanation:
            "Demonstrated. It is the same check-then-act gap as Day 22's idempotency window, and the fix is an atomic compare-and-delete script.",
        },
        {
          question: "When is a Redis lock the right tool?",
          options: [
            "Whenever two instances might collide",
            "When you want to reduce duplicate work and duplication is merely wasteful, such as generating a report twice",
            "For payments",
            "For any write",
          ],
          correctIndex: 1,
          explanation:
            "It reduces the probability of concurrent work rather than eliminating it, so nothing that must be exactly once should depend on it.",
        },
        {
          question: "Why is a PostgreSQL advisory transaction lock safer than a Redis lock?",
          options: [
            "It is faster",
            "Its lifetime is the transaction, so it releases when the transaction ends or the connection dies. There is no lease to expire and no release to race.",
            "It never blocks",
            "It works across databases",
          ],
          correctIndex: 1,
          explanation:
            "The database owns the lifetime rather than a timer, which removes both demonstrated failure modes.",
        },
        {
          question: "What is the question that decides whether to use a lock?",
          options: [
            "How many instances do we run?",
            "What happens if the lock fails? If the answer involves money or data, use a constraint, a transaction or a queue instead.",
            "How long is the job?",
            "Is Redis available?",
          ],
          correctIndex: 1,
          explanation:
            "A lock can fail, and both ways it fails were demonstrated. Build correctness on something that fails closed.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the question that decides whether to cache something?",
      options: [
        "Is it expensive to compute?",
        "What happens if this value is stale?",
        "Is it serialisable?",
        "How often is it read?",
      ],
      correctIndex: 1,
      explanation:
        "A stale country list is invisible and a stale permission check means a fired employee still has access. The mechanism cannot tell you which you have.",
    },
    {
      question: "Why does per-user caching often make an endpoint slower?",
      options: [
        "Redis latency",
        "The hit rate is near zero unless each user returns often, so you pay the write and the memory and rarely collect the read",
        "Keys are too long",
        "Serialisation dominates",
      ],
      correctIndex: 1,
      explanation:
        "Cache the shared part instead: one entry per company at a near-100% hit rate beats ten thousand at 5%.",
    },
    {
      question: "What was verified about a `Map` cache that checks expiry on read?",
      options: [
        "Expired entries are removed",
        "Reads correctly return `undefined` while `size` stayed at 10,000, so nothing is ever deleted",
        "It throws when full",
        "TTL is unsupported",
      ],
      correctIndex: 1,
      explanation:
        "The read-time check is what makes the leak invisible: the cache is correct and holds every key you ever wrote.",
    },
    {
      question: "What actually bounds a cache's memory?",
      options: [
        "A TTL",
        "A maximum size, so a new key evicts the least recently used one whether or not anything read it",
        "A sweep interval",
        "Compression",
      ],
      correctIndex: 1,
      explanation:
        "Which is why `lru-cache` takes a `max`, and why a plain `Map` also needs an explicit sweep.",
    },
    {
      question: "What is wrong with `if (cached) return JSON.parse(cached)`?",
      options: [
        "Nothing",
        "A cached `0`, `\"\"` or `false` is falsy, so a real hit is treated as a miss. Test `cached !== null`.",
        "`JSON.parse` may throw",
        "It needs a timeout",
      ],
      correctIndex: 1,
      explanation:
        "It disables the cache for exactly the cheapest values in it, and a low hit rate is the only symptom.",
    },
    {
      question: "What was verified about a `Date` surviving a cache round trip?",
      options: [
        "It survives as a `Date`",
        "`instanceof Date` becomes false and it is an ISO string, including nested dates; `undefined` keys vanish and `BigInt` throws",
        "It becomes a number",
        "Only nested dates change",
      ],
      correctIndex: 1,
      explanation:
        "So `user.createdAt.toISOString()` works on a miss and throws on a hit, passing every test that starts with an empty cache.",
    },
    {
      question: "What is a TTL actually for?",
      options: [
        "Freshness",
        "A bound on how wrong you can be. It is the backstop for the invalidation you missed, which lives in different code from the write.",
        "Memory management",
        "Rate limiting",
      ],
      correctIndex: 1,
      explanation:
        "So choose it by consequence and write the consequence next to the number.",
    },
    {
      question: "Why version a cache key?",
      options: [
        "For debugging",
        "A deploy that changes the cached shape otherwise reads yesterday's shape into today's code for the full TTL",
        "Redis requires it",
        "To improve the hit rate",
      ],
      correctIndex: 1,
      explanation:
        "Bump the version whenever the shape changes, and keep it next to the shape it describes.",
    },
    {
      question: "What happens if a cache key omits the user's role or locale?",
      options: [
        "A lower hit rate",
        "One user's view is served to another, which is an authorization leak that bypasses every ownership predicate because the response never reaches the query",
        "Nothing meaningful",
        "The TTL is ignored",
      ],
      correctIndex: 1,
      explanation:
        "The key must include every input the value depends on.",
    },
    {
      question: "What was measured for 1000 concurrent requests for one missing key?",
      options: [
        "1 database call",
        "1000 database calls with naive cache-aside, and 1 with coalescing",
        "About 10",
        "They queued",
      ],
      correctIndex: 1,
      explanation:
        "Verified both. The gap between the cache read and the cache write is where every concurrent request fits.",
    },
    {
      question: "What is the technique behind request coalescing?",
      options: [
        "A distributed lock",
        "Cache the promise, not the value, so a second caller awaits the in-flight load rather than starting its own",
        "A longer TTL",
        "A queue",
      ],
      correctIndex: 1,
      explanation:
        "Delete the in-flight entry in a `finally`, or one failed load is returned to every later request forever.",
    },
    {
      question: "Why delete a cache entry on update rather than writing the new value?",
      options: [
        "Deleting is faster",
        "Two concurrent updates can reach the cache in the opposite order to their commits, leaving the older value cached for the full TTL",
        "Writing needs a transaction",
        "Redis lacks an atomic set",
      ],
      correctIndex: 1,
      explanation:
        "And delete after the commit, or a concurrent read repopulates the cache from the uncommitted old value.",
    },
    {
      question: "Why not use `redis.keys(\"products:*\")` to find keys to invalidate?",
      options: [
        "It is deprecated",
        "It scans the whole keyspace and blocks Redis while it does, stalling every other client during a routine edit",
        "It misses keys",
        "It needs admin rights",
      ],
      correctIndex: 1,
      explanation:
        "`SCAN` is the non-blocking version, and needing either usually means the keys should have been grouped differently.",
    },
    {
      question: "What did the verified 304 response show about ETags?",
      options: [
        "It skipped the handler",
        "A zero-byte body, but the handler still ran, so a 304 saves bandwidth rather than server work",
        "It cached in Redis",
        "It saved the database query",
      ],
      correctIndex: 1,
      explanation:
        "So an ETag helps a slow client on a large response and does nothing for a database under load.",
    },
    {
      question: "What is the risk of `Cache-Control: public` on an authenticated response?",
      options: [
        "A lower hit rate",
        "A shared cache stores one user's response under that URL and serves it to the next person, bypassing every authorization check",
        "Browsers ignore it",
        "It breaks ETags",
      ],
      correctIndex: 1,
      explanation:
        "The same failure as an incomplete cache key, except the cache belongs to somebody else and you cannot inspect it.",
    },
    {
      question: "What must never be cached like a hashed asset?",
      options: [
        "Images",
        "The HTML referencing them, or users run an old build pointing at asset URLs you deleted, with no fix you can deploy",
        "CSS",
        "Fonts",
      ],
      correctIndex: 1,
      explanation:
        "Hashed assets can be immutable for a year because the URL includes a content hash. The HTML that names them cannot.",
    },
    {
      question: "What happens to a Redis with no eviction policy when it fills up?",
      options: [
        "It evicts the oldest keys",
        "Writes start failing, so a full cache becomes an application outage rather than a less effective cache",
        "It flushes everything",
        "It uses swap",
      ],
      correctIndex: 1,
      explanation:
        "And `allkeys-lru` evicts anything, including sessions and idempotency keys, so keep durable state in a separate database.",
    },
    {
      question: "What was demonstrated about a lock TTL shorter than the job?",
      options: [
        "The lock will not expire",
        "A second worker acquired successfully while the first was still running, with no error and no code being wrong",
        "The first worker is killed",
        "It auto-extends",
      ],
      correctIndex: 1,
      explanation:
        "Lease renewal narrows the window and cannot close it, so a long enough pause still produces two holders.",
    },
    {
      question: "What goes wrong with a read-then-delete lock release?",
      options: [
        "It is slow",
        "A stalled holder whose lease expired can delete the lock a second worker acquired, leaving that worker unprotected and unaware",
        "The key leaks",
        "It needs a transaction",
      ],
      correctIndex: 1,
      explanation:
        "Demonstrated, and the same check-then-act gap as Day 22's idempotency window. Use an atomic compare-and-delete script.",
    },
    {
      question: "What is the question that decides whether a distributed lock is the right tool?",
      options: [
        "How many instances run?",
        "What happens if the lock fails? If the answer involves money or data, use a unique constraint, a transaction or a queue instead.",
        "How long is the job?",
        "Is Redis available?",
      ],
      correctIndex: 1,
      explanation:
        "A lock reduces the probability of concurrent work rather than eliminating it, and both ways it fails were demonstrated.",
    },
  ],
  project: {
    name: "day-23",
    goal: "Cache your slowest endpoint and prove it helped with five numbers, then reproduce the four caching bugs that are invisible until they are not: the falsy check, the Date that changes shape, the 1000-request stampede, and the lock that deletes somebody else's lock.",
    brief:
      "Adding Redis is easy and produces a number that looks good. This project is about the four things that go wrong afterwards, all of which pass tests that start with an empty cache. Two of them you should measure rather than read: a thousand concurrent misses hitting your database at once, and a cached Date that is a string on a hit and a Date on a miss. Record the before and after table with the hit rate in it, because a cache with a 40% hit rate can improve latency and still be the wrong design.",
    steps: [
      "Start from your Day 22 project or create `day-23/` with `\"type\": \"module\"` and install `fastify`, `redis`, `lru-cache`, `@fastify/etag`, `zod`, `drizzle-orm` and `pg`.",
      "Run Redis locally with `docker run -p 6379:6379 redis:7-alpine`, and configure `maxmemory` and `allkeys-lru` on a cache database while leaving database 1 for durable state.",
      "Seed enough data that your list endpoint takes at least 150ms, and record its p95, requests per second, database queries per request and memory with no cache.",
      "Write a `cached(key, ttl, load)` helper using cache-aside, and record the same four numbers plus the hit rate.",
      "Write the before-and-after table with all five numbers in it.",
      "Cache a value of `0` using `if (cached)`, then confirm from your hit rate metric that every request is a miss.",
      "Change it to `!== null` and confirm the hit rate recovers.",
      "Cache an object containing a `Date`, then call `.toISOString()` on it in the handler and hit the endpoint twice. Record which request threw.",
      "Sort a cached list by that date field and confirm the sort silently does nothing on a hit.",
      "Fix it twice: once by reviving dates on read, once by caching a view object with an ISO string, and say which you prefer.",
      "Add `undefined` and a `BigInt` to a cached object and record what each does.",
      "Write a `Map` cache with a read-time TTL, write 10,000 entries with a 1ms TTL, wait, then log both a read and `cache.size`.",
      "Replace it with `lru-cache` with a `max` and confirm the size is bounded.",
      "Build the stampede: clear the key, fire 1000 concurrent requests, and count the database calls.",
      "Add coalescing by caching the promise, repeat, and count again.",
      "Make the load function reject, and confirm that without a `finally` every subsequent request receives the same failure.",
      "Add a `refreshAhead` helper for one expensive key and confirm the key never expires under load.",
      "Implement invalidation on update. First delete before the commit, run a concurrent read, and confirm the stale value is re-cached with a fresh TTL.",
      "Move the delete after the commit and confirm the window closes.",
      "Try writing the new value into the cache instead, run two concurrent updates, and see whether the cache can end up holding the older one.",
      "List every key a single product update should invalidate, then implement it without using `KEYS`.",
      "Register `@fastify/etag`, request an endpoint twice with `If-None-Match`, and record the status and body length.",
      "Add a log line inside that handler and confirm it still runs on the 304.",
      "Set `Cache-Control: public, max-age=30, s-maxage=300` on a public endpoint and `private, no-store` on an authenticated one.",
      "Add an `onSend` hook that applies a deny-by-default `Cache-Control`, then add a new route and confirm it is not publicly cacheable.",
      "Write the test asserting no authenticated route sends `public` or `s-maxage`.",
      "Add a locale to a cached list endpoint, omit it from the key, and confirm one locale's response is served for another.",
      "Add it to the key and confirm the fix, then decide whether `Vary` or a query parameter is the better approach.",
      "Implement a Redis lock with `NX` and `PX`, plus atomic compare-and-delete release and extend scripts.",
      "Simulate the TTL race: acquire with a 1-second lease, sleep 2 seconds, then acquire from a second worker and record the result.",
      "Simulate the release race: read the lock, stall past the TTL, let a second worker acquire, then complete the unsafe release and check who owns the lock.",
      "Replace the unsafe release with the Lua script and confirm the race is gone.",
      "Replace the lock entirely with a `UNIQUE` constraint for one operation, and write down what that guarantees that the lock did not.",
      "Fill Redis past `maxmemory` and confirm what happens to writes with and without an eviction policy.",
      "Put a session in the same database as the cache, fill it, and confirm the session can be evicted.",
    ],
    acceptance: [
      "You have a before-and-after table with p95 latency, requests per second, database queries per request, memory and hit rate.",
      "You can state your cache hit rate and say whether the key is right.",
      "You saw `if (cached)` treat a cached `0` as a miss, and the hit rate recover after the `!== null` fix.",
      "You have a recorded stack trace or error from calling `.toISOString()` on a cached date, and you know which request threw.",
      "You saw a sort by a cached date silently do nothing.",
      "You recorded what `undefined` and `BigInt` do in a cached object.",
      "You have the `Map` cache numbers: a read returning undefined and a `size` of 10,000.",
      "The `lru-cache` version stays bounded under the same load.",
      "You have the database call counts for 1000 concurrent misses with and without coalescing.",
      "A rejected load does not poison later requests, and you know why the `finally` is required.",
      "Deleting before the commit re-cached the stale value, and moving it after closed the window.",
      "You can describe how two concurrent cache writes can leave the older value cached.",
      "Your product invalidation lists every affected key and does not call `KEYS`.",
      "You have the 304 status and zero body length recorded, plus proof from a log line that the handler still ran.",
      "No authenticated route sends `public` or `s-maxage`, enforced by a test.",
      "A new route added after the `onSend` hook is not publicly cacheable by default.",
      "You reproduced one locale's response being served for another, and fixed it.",
      "You reproduced both lock races and recorded who held the lock afterwards.",
      "The Lua release script removes the second race.",
      "You can state what a `UNIQUE` constraint guarantees that the lock does not.",
      "You know what your Redis does to writes when full, with and without an eviction policy.",
      "You saw a session evicted from a shared cache database.",
      "`npx tsc --noEmit` passes if you used TypeScript, and `node --test` passes.",
    ],
    stretch: [
      "Add `stale-while-revalidate` and observe the difference in origin requests during a load test.",
      "Implement a Redis pub/sub invalidation channel so every instance drops its local entry immediately, then measure how much complexity it added.",
      "Add cache hit and miss metrics labelled by prefix only, and graph the hit rate per prefix.",
      "Run two instances and demonstrate the per-instance staleness of a local cache with a real HTTP request.",
      "Implement negative caching for a non-existent id and measure the database load from a probing loop with and without it.",
      "Add a circuit breaker from Day 22 in front of Redis and confirm an endpoint stays up when Redis is stopped.",
      "Compare `pg_try_advisory_xact_lock` with your Redis lock by killing the process mid-work and seeing which releases.",
      "Cache a response and then change the cached shape without bumping the key version, and record how long the breakage lasts.",
      "Measure the cost of `JSON.stringify` on your largest cached value and decide whether it is a meaningful share of the saving.",
      "Set a one-year immutable cache header on a hashed asset and a `no-cache` header on the HTML, then deploy twice and confirm the client picks up the new build.",
    ],
  },
};
