import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_26_LESSONS: LessonDay = {
  day: 26,
  title: "Performance",
  totalMinutes: 96,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "measure-first",
      title: "Measure first, and measure honestly",
      durationMinutes: 12,
      explanation:
        "```text\n✗  \"Node is slow\" → change random code → maybe faster?\n✓  measure → find the bottleneck → fix it → measure again\n```\n\n---\n\n## Performance optimisation\n\n<b>Performance optimisation</b> (changing a system so it is faster or uses fewer resources).\n\n> The reason to start with measurement is <b>Amdahl's argument</b>, and it is worth stating as arithmetic. If Node's own CPU is 10% of a 500ms request, making it twice as fast saves 25ms out of 500, which is 5%. You could make it <b>infinitely</b> fast and save 50ms. Three days of work for a change nobody notices.\n>\n> So the first question is not \"how do I make this faster\", it is <b>\"what fraction of the time is this?\"</b>\n\n---\n\n## Load testing\n\n<b>Load testing</b> (sending many requests to see how a system behaves under traffic).\n\n```bash\nnpx autocannon -c 50 -d 10 http://localhost:3000/users\n```\n\n---\n\n## Your first measurement is unreliable\n\nVerified, running autocannon twice against the <b>same unchanged route</b>:\n\n```text\nrun 1   12,490 req/sec\nrun 2   20,156 req/sec\n```\n\n> A 60% difference with nothing changed. That is not a broken tool, it is what benchmarking on a normal machine looks like: other processes, thermal behaviour, JIT warm-up, garbage collection timing.\n>\n> So a single run proves nothing, and a single run before and after a change proves less than nothing, because it will happily tell you a change helped when it did not. <b>Run it three times, interleaved, and look at the spread before you look at the difference.</b> If your change is smaller than your noise, you have not measured anything.\n\n---\n\n## What to record\n\n```text\nrequests/sec   throughput\np50, p95, p99  latency distribution\nerrors         a fast failure is not a fast response\nbytes/response the payload size, which explains a lot\n```\n\n> Errors matter more than people expect. An endpoint that starts returning 500s under load will look <b>faster</b>, because an error is cheap. A benchmark without an error count can report a large improvement that is entirely a rise in failures.\n\n---\n\n## Load testing lies in specific ways\n\n> Three things to know before you trust a number.\n>\n> <b>Localhost has no network.</b> Your measurement excludes the latency that dominates real requests, so a 2ms local p50 tells you nothing about a user in another country.\n>\n> <b>An empty database is not your database.</b> Day 17's lesson: a query that is fast on a thousand rows may be a sequential scan on a million, and the load test will not tell you which you have.\n>\n> <b>The load generator competes with the server.</b> Both on one laptop means autocannon's CPU is taken from your application's, which caps your measured throughput at something unrelated to production.\n>\n> None of that makes load testing useless. It makes it a tool for <b>comparing</b> two versions of your code on the same machine, which is exactly what you need for \"did my change help\", and not a predictor of production numbers.",
      diagram: `✗  "Node is slow" → change random code
                    → maybe faster?

✓  measure → find the bottleneck → fix
           → measure again


Start with arithmetic, not intuition

    if Node's CPU is 10% of a 500ms request:

      twice as fast   saves 25ms of 500   = 5%
      INFINITELY fast saves 50ms          = 10%

    three days of work for a change nobody
    notices.

    → the first question is not "how do I make
      this faster".

      it is "WHAT FRACTION OF THE TIME IS THIS?"


⚠⚠ Your first measurement is unreliable

    verified, autocannon twice against the SAME
    UNCHANGED route:

      run 1   12,490 req/sec
      run 2   20,156 req/sec

    a 60% DIFFERENCE with nothing changed.

    not a broken tool. that is what benchmarking
    on a normal machine looks like:

      other processes
      thermal behaviour
      JIT warm-up
      GC timing

    → a single run proves NOTHING.

      a single run before and after a change
      proves LESS than nothing, because it will
      happily tell you a change helped when it
      did not.

    ✓ run it three times, INTERLEAVED, and look at
      the SPREAD before the DIFFERENCE.

      if your change is smaller than your noise,
      you have not measured anything.


What to record

    requests/sec     throughput
    p50, p95, p99    the distribution
    ERRORS           a fast failure is not a fast
                     response
    bytes/response   the payload size explains a
                     lot

⚠ errors matter more than people expect:

    an endpoint that starts returning 500s under
    load looks FASTER, because an error is cheap.

    a benchmark with no error count can report a
    large improvement that is entirely a rise in
    failures.


⚠ Load testing lies in three specific ways

    LOCALHOST HAS NO NETWORK
      your measurement excludes the latency that
      dominates real requests. a 2ms local p50
      says nothing about a user in another
      country.

    AN EMPTY DATABASE IS NOT YOUR DATABASE
      Day 17: fast on a thousand rows may be a
      sequential scan on a million, and the load
      test will not tell you which you have.

    THE GENERATOR COMPETES WITH THE SERVER
      both on one laptop means autocannon's CPU
      is taken from your application's, capping
      measured throughput at something unrelated
      to production.

    → none of that makes it useless.

      it makes it a tool for COMPARING TWO
      VERSIONS OF YOUR CODE ON THE SAME MACHINE,
      which is exactly what "did my change help"
      needs.

      it is not a predictor of production numbers.`,
      codeExample: {
        title: "A comparison you can trust",
        code: `// ── ⚠ The measurement noise, verified ───────────────────────
// Two autocannon runs, same route, same code, nothing changed:
//
//   $ npx autocannon -c 50 -d 4 http://127.0.0.1:3112/plain
//     12,490 req/sec
//
//   $ npx autocannon -c 50 -d 4 http://127.0.0.1:3112/plain
//     20,156 req/sec
//
// 60% apart. If you had changed something between those two
// runs you would now believe it made the endpoint 60% faster
// or 38% slower, depending on which order you ran them.
//
// This is the single most common way performance work goes
// wrong, and it is not a tooling problem.


// ── ✓ Interleave the runs ───────────────────────────────────
// scripts/compare.sh
//
//   for i in 1 2 3; do
//     echo "--- A run $i ---"
//     npx autocannon -c 50 -d 10 -j http://localhost:3000/a | jq '.requests.average'
//     echo "--- B run $i ---"
//     npx autocannon -c 50 -d 10 -j http://localhost:3000/b | jq '.requests.average'
//   done
//
// Interleaved, so a machine that gets slower over ten minutes
// affects both equally. Running all of A then all of B is how
// you measure your laptop warming up.
//
// Then compare the ranges, not the means:
//
//   A: 12,490  20,156  18,900     range 12.5k - 20.2k
//   B: 13,286  12,640  19,400     range 12.6k - 19.4k
//
//   → overlapping ranges. THIS TELLS YOU NOTHING.
//     Do not ship a conclusion from it.
//
// Versus a real difference:
//
//   A:  1,200   1,180   1,210     range 1.18k - 1.21k
//   B: 11,900  12,100  11,800     range 11.8k - 12.1k
//
//   → no overlap, 10x apart. That is a result.


// ── The full record, not just req/sec ───────────────────────
// $ npx autocannon -c 50 -d 10 -j http://localhost:3000/users
//
// {
//   "requests": { "average": 16250, ... },
//   "latency":  { "p50": 2, "p97_5": 5, "p99": 6, "max": 41 },
//   "throughput": { "average": 858783744 },
//   "errors": 0,          ← ⚠ CHECK THIS
//   "non2xx": 0,          ← ⚠ AND THIS
//   "timeouts": 0
// }
//
// A run reporting 40,000 req/sec with 39,000 non-2xx responses
// is not a fast endpoint, it is a broken one. And the req/sec
// number on its own looks like a triumph.
//
// So the honest summary line is:
//
//   16,250 req/s | p50 2ms p99 6ms | 0 errors | 52.9KB/resp
//
// All four, or the number is not interpretable.


// ── Start from the breakdown, not from Node ─────────────────
// Before profiling anything, find out where the time goes.
// Day 21's trace answers this directly, and if you have no
// tracing, a few timers will do:

app.get("/orders/:id", async (request, reply) => {
  const t0 = performance.now();
  const order = await loadOrder(app.db, request.params.id);
  const t1 = performance.now();
  const enriched = await enrich(order);
  const t2 = performance.now();
  const priced = computePricing(enriched);
  const t3 = performance.now();

  request.log.info({
    db: Math.round(t1 - t0),
    enrich: Math.round(t2 - t1),
    pricing: Math.round(t3 - t2),
    total: Math.round(t3 - t0),
  }, "timing");

  return priced;
});
//
// A typical result, and the reason this lesson exists:
//
//   db      470ms
//   enrich   15ms
//   pricing  10ms
//   total   495ms
//
// Node's own CPU is the 10ms of pricing. Making it twice as
// fast saves 5ms out of 495, which is 1%.
//
// Every remaining lesson today is useful, and none of it is
// useful HERE. This endpoint needs Day 17's index.


// ── ⚠ What your load test is not telling you ────────────────
// 1. Localhost has no network.
//
//    local p50   2ms
//    real user   2ms + 40ms round trip + TLS
//
//    So a change that takes your p50 from 4ms to 2ms is a 50%
//    improvement locally and a 4% improvement for a user in
//    another country. Both numbers are true; only one
//    matters to them.
//
// 2. An empty database is not your database.
//
//    Seed it. Day 17's EXPLAIN ANALYZE on a thousand rows and
//    on a million give different plans, and the load test
//    reports the first one confidently.
//
//    $ psql -c "SELECT count(*) FROM orders"   ← check before believing anything
//
// 3. The generator competes with the server.
//
//    $ npx autocannon -c 500 ...
//
//    On one laptop, autocannon at 500 connections is taking
//    CPU from the process you are measuring. Your measured
//    ceiling is then a property of your laptop, not your
//    application.
//
//    If the number matters, run the generator on a different
//    machine. If you only need "is B better than A", one
//    machine is fine, which is the usual case.


// ── The loop, written down ──────────────────────────────────
// 1. Measure, three interleaved runs, recording all four
//    numbers.
// 2. Find the fraction. If the thing you want to optimise is
//    under 20% of the time, stop and pick something else.
// 3. Change ONE thing.
// 4. Measure again, three interleaved runs.
// 5. If the difference is inside the noise, you have not
//    demonstrated anything. Revert or measure harder.
//
// Step 2 is the one people skip, and it is the only step that
// decides whether the other four are worth doing.`,
      },
      keyTakeaways: [
        "Start with arithmetic: if Node's CPU is 10% of the request, making it infinitely fast saves 10%.",
        "So the first question is what fraction of the time something is, not how to make it faster.",
        "Verified: two autocannon runs against the same unchanged route gave 12,490 and 20,156 req/sec, a 60% spread.",
        "A single run proves nothing, and a single run before and after a change is worse than nothing because it will confirm whatever you hoped.",
        "Run three times, interleaved, and compare the ranges. Overlapping ranges are not a result.",
        "Record requests per second, p50, p95, p99, errors and bytes per response. Four numbers or the result is uninterpretable.",
        "Errors matter most: an endpoint returning 500s under load looks faster, because an error is cheap.",
        "Localhost has no network, so a local p50 improvement can be a rounding error for a real user.",
        "An empty database is not your database. Day 17's query plans differ between a thousand rows and a million.",
        "The load generator competes with the server on one machine, so your measured ceiling is a property of your laptop.",
        "Load testing is a tool for comparing two versions of your code on one machine, not for predicting production numbers.",
        "A few timers around the phases of a request tell you the fraction, which is the step that decides whether any optimisation is worth doing.",
      ],
      commonMistakes: [
        "Optimising Node's CPU when it is 10% of the request time, which caps the possible gain at 10%.",
        "Running the benchmark once before and once after a change, which cannot distinguish a real difference from 60% noise.",
        "Running all of version A then all of version B, which measures the machine warming up.",
        "Reporting requests per second with no error count, so a rise in 500s reads as a performance win.",
        "Believing a localhost p50 predicts what a real user experiences.",
        "Benchmarking against an empty database, so the query plan you measured is not the one you run.",
        "Running the load generator on the same machine at high concurrency and treating the ceiling as your application's.",
        "Changing several things between measurements, so a difference cannot be attributed.",
        "Skipping the breakdown, so the work goes into whichever part was easiest to find rather than the part that dominates.",
      ],
      quiz: [
        {
          question: "Node's CPU is 10% of a 500ms request. What is the most an optimisation there can save?",
          options: [
            "Half the request",
            "50ms, which is 10%, even if you make it infinitely fast",
            "It depends on concurrency",
            "There is no limit",
          ],
          correctIndex: 1,
          explanation:
            "So the first question is what fraction of the time something is. That step decides whether any optimisation is worth doing.",
        },
        {
          question: "What was measured running autocannon twice against the same unchanged route?",
          options: [
            "Nearly identical results",
            "12,490 and 20,156 req/sec, a 60% spread with nothing changed",
            "The second run was always faster",
            "The tool errored",
          ],
          correctIndex: 1,
          explanation:
            "So one run before and one after a change will confirm whatever you hoped. Interleave three runs and compare the ranges.",
        },
        {
          question: "Why does an error count matter in a benchmark?",
          options: [
            "For completeness",
            "An error is cheap, so an endpoint returning 500s under load reports higher throughput and looks like an improvement",
            "Errors slow the client",
            "It affects the p99 only",
          ],
          correctIndex: 1,
          explanation:
            "A run reporting 40,000 req/sec with 39,000 non-2xx responses is not a fast endpoint.",
        },
        {
          question: "What is a localhost load test actually good for?",
          options: [
            "Predicting production throughput",
            "Comparing two versions of your own code on the same machine, which is what \"did my change help\" needs",
            "Measuring network latency",
            "Capacity planning",
          ],
          correctIndex: 1,
          explanation:
            "It excludes the network, runs against a database that is not yours, and shares CPU with the generator.",
        },
        {
          question: "Your before and after ranges overlap. What have you demonstrated?",
          options: [
            "A small improvement",
            "Nothing. If the change is smaller than the noise, the measurement does not support a conclusion.",
            "That the change is safe",
            "That you need more connections",
          ],
          correctIndex: 1,
          explanation:
            "Given a verified 60% spread on an unchanged route, an apparent 20% gain is well inside the noise.",
        },
      ],
    },
    {
      id: "percentiles",
      title: "Percentiles, and what an average hides",
      durationMinutes: 11,
      explanation:
        "## Latency\n\n<b>Latency</b> (how long one request takes).\n\n> An average is the wrong summary and it is worth being precise about <b>why</b>. Latency distributions are not symmetric: there is a floor, no ceiling, and a long tail. So the mean sits between the common case and the rare bad case, describing neither.\n\n---\n\n## The three numbers\n\n<b>p50</b> (the median: half of requests are faster). The typical experience.\n\n<b>p95</b> (95% are faster). Where slowness starts being visible.\n\n<b>p99</b> (99% are faster). The tail, which is more people than it sounds.\n\n```text\n1,000,000 requests → 1% is 10,000 slow requests\n```\n\n---\n\n## The measurement from Day 21, restated because it matters\n\nWith 990 requests at about 25ms and 10 at about 3,000ms:\n\n```text\nmean  57ms\np50   25ms\np95   30ms\np99   30ms\nmax   3458ms\n```\n\n> The mean is <b>57ms and no request took 57ms</b>. Half took 25 and one percent took over three seconds. And the mean is <b>higher than the p99</b>, so a dashboard showing it reports a service as uniformly slightly slow when it is actually bimodal.\n>\n> That is the whole argument in one table: an average is a number pulled between two populations by outliers, and it describes neither of them.\n\n---\n\n## Which one to act on\n\n> <b>p50 rising</b> means something got slower for everybody, which is usually a code change or a query plan flipping.\n>\n> <b>p99 rising with a flat p50</b> means a subset of requests hit something the rest do not: a cold cache, a lock, one slow shard, a garbage collection pause, or a customer with far more data than the others.\n>\n> Those need different investigations, and only having a mean tells you neither.\n\n---\n\n## Percentiles do not add\n\n> The rule people get wrong. If your request calls three services each with a p99 of 100ms, your p99 is <b>not</b> 300ms and it is not 100ms either. A request is slow if <b>any</b> call is slow, so with three independent calls roughly 3% of requests hit at least one p99 case.\n>\n> The practical consequence: <b>the more dependencies a request has, the worse its tail</b>, even when every dependency looks healthy. A request fanning out to ten services with a 99% fast rate each is fast only 90% of the time.\n\n---\n\n## And you cannot average percentiles\n\n> Day 21 said it and it is worth repeating because it is such a common dashboard bug: the p95 of two instances' p95 values is <b>not</b> the p95. Percentiles must be computed from the underlying distribution, which is why metrics systems store histogram buckets rather than computed numbers.\n>\n> If your dashboard averages a percentile across instances or across time, the number on it is not a percentile of anything.",
      diagram: `Why an average is the wrong summary

    latency distributions are NOT SYMMETRIC:

      a floor
      no ceiling
      a long tail

    → so the mean sits BETWEEN the common case and
      the rare bad case, describing NEITHER.


The three numbers

    p50   half are faster    the typical
                             experience
    p95   95% are faster     where slowness
                             becomes visible
    p99   99% are faster     the tail

    1,000,000 requests → 1% is 10,000 SLOW
                         REQUESTS


⚠⚠ The measurement, restated (Day 21)

    990 requests at ~25ms, 10 at ~3000ms:

      mean   57ms
      p50    25ms
      p95    30ms
      p99    30ms
      max  3458ms

    THE MEAN IS 57ms AND NO REQUEST TOOK 57ms.

      half took 25
      one percent took over THREE SECONDS

    and the mean is HIGHER THAN THE p99.

    → a dashboard showing the mean reports a
      service as UNIFORMLY SLIGHTLY SLOW when it
      is actually BIMODAL.

    that is the whole argument: an average is a
    number pulled between two populations by
    outliers, describing neither.


Which one to act on

    p50 RISING
      something got slower for EVERYBODY
      → usually a code change, or a query plan
        flipping

    p99 RISING, p50 FLAT
      a SUBSET hits something the rest do not
      → a cold cache · a lock · one slow shard
        a GC pause · a customer with far more
        data

    different investigations. a mean tells you
    NEITHER.


⚠⚠ Percentiles do not ADD

    three services, each p99 = 100ms.

    your p99 is NOT 300ms.
    it is not 100ms either.

    a request is slow if ANY call is slow, so with
    three independent calls roughly 3% hit at
    least one p99 case.

    → THE MORE DEPENDENCIES A REQUEST HAS, THE
      WORSE ITS TAIL, even when every dependency
      looks healthy.

      ten services at 99% fast each
        = fast only 90% of the time


⚠ And you cannot AVERAGE percentiles

    the p95 of two instances' p95 values is NOT
    the p95.

    percentiles must be computed from the
    underlying DISTRIBUTION, which is why metrics
    systems store HISTOGRAM BUCKETS.

    if your dashboard averages a percentile across
    instances or across time, the number on it is
    not a percentile of anything.`,
      codeExample: {
        title: "Computing percentiles, and the traps in reading them",
        code: `// ── The measurement, reproducible in ten lines ──────────────
const fast = Array.from({ length: 990 }, () => 20 + Math.random() * 10);
const slow = Array.from({ length: 10 }, () => 3000 + Math.random() * 500);
const all = [...fast, ...slow].sort((a, b) => a - b);

const pct = (p) => all[Math.ceil((p / 100) * all.length) - 1];
const mean = all.reduce((s, x) => s + x, 0) / all.length;

// VERIFIED output:
//   mean   57ms
//   p50    25ms
//   p95    30ms
//   p99    30ms
//   max  3458ms
//
// Read the first two lines together. The mean is 57ms and
// the median is 25ms, so the "average" request is more than
// twice as slow as the typical request, and NO request took
// 57ms.
//
// And the mean exceeds the p99, which means a mean-based
// dashboard is not merely imprecise. It is describing a
// different service from the one you have.


// ── ⚠ What each number tells you to look at ─────────────────
//
//   p50 up, p99 up          everything is slower
//                           → a deploy, a query plan, a
//                             saturated resource
//
//   p50 flat, p99 up        a SUBSET is slow
//                           → a cold cache (Day 23)
//                           → a lock (Day 17)
//                           → GC pauses
//                           → one customer with 100x the data
//
//   p50 up, p99 flat        unusual, and real: something
//                           added a fixed cost to every
//                           request, while the tail was
//                           already dominated by something
//                           else
//
// A mean moving up is consistent with all three.


// ── ⚠⚠ Percentiles do not add ───────────────────────────────
// A request that calls three services, each with a p99 of
// 100ms and a p50 of 10ms.
//
// ✗ The intuition: "my p99 is 300ms" or "my p99 is 100ms".
//
// ✓ The reality: a request is slow if ANY of the three is
//   slow. With independent calls:
//
//     P(all three fast) = 0.99³ = 0.970
//     → 3% of requests hit at least one slow call
//
//   So your p97 is already around 100ms, and your p99 is
//   worse than any single dependency's p99.
//
// Simulate it, because the arithmetic is not intuitive:
function simulate(dependencies) {
  const one = () => (Math.random() < 0.01 ? 100 : 10);
  const samples = Array.from({ length: 100_000 }, () => {
    let total = 0;
    for (let i = 0; i < dependencies; i++) total += one();
    return total;
  }).sort((a, b) => a - b);
  return {
    deps: dependencies,
    p50: samples[50_000],
    p99: samples[99_000],
    fastRate: (samples.filter((s) => s === dependencies * 10).length / 1000).toFixed(1) + "%",
  };
}

for (const n of [1, 3, 10]) console.log(simulate(n));
//
//   { deps: 1,  p50: 10,  p99: 100, fastRate: '99.0%' }
//   { deps: 3,  p50: 30,  p99: 120, fastRate: '97.0%' }
//   { deps: 10, p50: 100, p99: 190, fastRate: '90.4%' }
//
// Ten dependencies at 99% fast each is fast only 90% of the
// time. This is why a microservice fan-out has a worse tail
// than any of its parts, and why Day 22's timeouts and
// Day 23's caching matter more the more calls you make.


// ── ⚠ And you cannot average percentiles ────────────────────
// ✗ A dashboard that does this:
//
//   instance A p95 = 100ms
//   instance B p95 = 200ms
//   "overall p95" = 150ms          ← not a percentile
//
// Consider: A served 1 request at 100ms, B served 999,999 at
// 200ms. The real p95 is 200ms, not 150ms.
//
// ✓ Aggregate the histograms. This is why Day 21's metrics
//   lesson used a histogram instrument:
const requestDuration = meter.createHistogram("http_request_duration_ms", {
  unit: "ms",
});

app.addHook("onResponse", async (request, reply) => {
  requestDuration.record(reply.elapsedTime, {
    method: request.method,
    route: request.routeOptions?.url ?? "unmatched",
    status: reply.statusCode,
  });
});
// The backend stores bucket counts, so a percentile across
// instances or across an hour is computed from the combined
// distribution rather than from other percentiles.
//
// The same rule applies over TIME: the p95 of twelve 5-minute
// p95 values is not the hourly p95.


// ── If you have no metrics backend yet ──────────────────────
// A crude in-process recorder that is honest about its limits.
class Latencies {
  constructor(max = 10_000) { this.samples = []; this.max = max; }

  record(ms) {
    // ⚠ A fixed window, or this is Day 23's unbounded Map.
    if (this.samples.length >= this.max) this.samples.shift();
    this.samples.push(ms);
  }

  summary() {
    if (!this.samples.length) return null;
    const s = [...this.samples].sort((a, b) => a - b);
    const p = (n) => s[Math.ceil((n / 100) * s.length) - 1];
    return {
      count: s.length,
      p50: p(50), p95: p(95), p99: p(99),
      max: s.at(-1),
      mean: Math.round(s.reduce((a, b) => a + b, 0) / s.length),
      //    ^^^^ include it, so you can SEE the gap between the
      //    mean and the p50 on your own traffic. That gap is
      //    the argument.
    };
  }
}
//
// Good enough to answer "did my change help". Not a
// substitute for a real histogram, because it holds every
// sample in memory and cannot be aggregated across instances.


// ── The reporting habit ─────────────────────────────────────
// ✗ "the endpoint takes about 60ms"
// ✓ "p50 25ms, p95 30ms, p99 30ms, max 3.4s, 0 errors"
//
// The second one is four numbers instead of one, and it is
// the only version somebody can act on. The first one is
// consistent with the verified table above, where a third of
// a second was the real experience for one user in a hundred.`,
      },
      keyTakeaways: [
        "Latency distributions have a floor, no ceiling and a long tail, so the mean sits between two populations and describes neither.",
        "Verified: 990 requests at 25ms and 10 at 3000ms give a mean of 57ms, and no request took 57ms.",
        "The mean was also higher than the p99, so a mean-based dashboard describes a uniformly slightly-slow service that does not exist.",
        "p50 rising means everything got slower. p99 rising with a flat p50 means a subset hits something the rest do not.",
        "Those need different investigations, and a mean is consistent with either.",
        "Percentiles do not add. Three dependencies each 99% fast means about 3% of requests hit at least one slow call.",
        "Simulated: one dependency is fast 99% of the time, three 97%, and ten only 90%.",
        "So the more dependencies a request has, the worse its tail, even when every dependency looks healthy.",
        "You cannot average percentiles across instances or across time. The p95 of two p95s is not the p95.",
        "Aggregate histogram buckets instead, which is why Day 21's metrics used a histogram instrument.",
        "A fixed-window in-process recorder is enough to answer \"did my change help\", and cannot be aggregated.",
        "Report four numbers: p50, p95, p99 and max, plus errors. One number is not actionable.",
      ],
      commonMistakes: [
        "Reporting or alerting on a mean, which can be higher than the p99 and describes no actual request.",
        "Assuming a p99 problem is a general slowdown, when a flat p50 means it is a specific subset.",
        "Adding dependency percentiles, or assuming your p99 equals your slowest dependency's p99.",
        "Ignoring that fan-out degrades the tail even when every dependency is healthy.",
        "Averaging p95 values across instances, producing a number that is not a percentile.",
        "Averaging percentiles across time buckets, which has the same problem.",
        "Storing every latency sample in an unbounded array, which is Day 23's leak.",
        "Quoting a single latency figure, which hides whether the distribution is tight or bimodal.",
      ],
      quiz: [
        {
          question: "With 990 requests at 25ms and 10 at 3000ms, what were the mean and the p99?",
          options: [
            "Mean 25ms, p99 3000ms",
            "Mean 57ms and p99 30ms, so the mean exceeded the p99 and no request took 57ms",
            "Both about 57ms",
            "Mean 3000ms, p99 25ms",
          ],
          correctIndex: 1,
          explanation:
            "The mean is pulled between two populations by outliers and describes neither, which is why it can exceed the p99.",
        },
        {
          question: "Your p99 rises while your p50 is flat. What does that tell you?",
          options: [
            "Everything is slower",
            "A subset of requests hits something the rest do not: a cold cache, a lock, a GC pause, or one customer with far more data",
            "The load generator is saturated",
            "Nothing useful",
          ],
          correctIndex: 1,
          explanation:
            "A general slowdown moves the p50 too. A mean rising is consistent with either, which is why it cannot direct an investigation.",
        },
        {
          question: "Three dependencies each have a p99 of 100ms. What is your p99?",
          options: [
            "100ms",
            "Worse than 100ms, because a request is slow if any call is slow: about 3% hit at least one slow call",
            "300ms",
            "33ms",
          ],
          correctIndex: 1,
          explanation:
            "Simulated: one dependency is fast 99% of the time, three 97%, and ten only 90%. Fan-out degrades the tail.",
        },
        {
          question: "Why can you not average p95 values across instances?",
          options: [
            "Clock skew",
            "A percentile must be computed from the underlying distribution. One instance serving one request and another serving a million would give a meaningless midpoint.",
            "Instances measure differently",
            "You can, it is standard",
          ],
          correctIndex: 1,
          explanation:
            "Aggregate histogram buckets. The same applies across time: the p95 of twelve five-minute p95s is not the hourly p95.",
        },
        {
          question: "What should a latency report contain?",
          options: [
            "The average",
            "p50, p95, p99 and max, plus the error count, because one number cannot show whether the distribution is tight or bimodal",
            "Just the p99",
            "Requests per second",
          ],
          correctIndex: 1,
          explanation:
            "\"About 60ms\" is consistent with the verified table where one user in a hundred waited over three seconds.",
        },
      ],
    },
    {
      id: "profiling-and-blocking",
      title: "Profiling, and what blocks the event loop",
      durationMinutes: 12,
      explanation:
        "## CPU profiling\n\n<b>CPU profiling</b> (recording which functions consume CPU time).\n\n```bash\nnode --cpu-prof server.js\n```\n\nDay 14 verified this writes a `.cpuprofile` you load into Chrome DevTools.\n\n<b>Flame graph</b> (a visualisation of a profile where width is time spent).\n\n> The thing to know about reading one: <b>width is time, and depth is only call nesting</b>. A tall narrow tower is a deep call stack that costs nothing. Look for wide plateaus, and prefer the <b>inverted</b> or bottom-up view first, because it aggregates a function called from twenty places into one row rather than twenty slivers.\n\n---\n\n## What a profile cannot tell you\n\n> A CPU profile shows where your process spent <b>CPU</b>. A request waiting 470ms on a database appears as almost nothing, because waiting is not CPU. So a profile of a database-bound endpoint looks flat and idle, and it is easy to conclude wrongly that nothing is slow.\n>\n> Profile when you have established the time is <b>in Node</b>. Use Day 21's traces or timers to establish that first.\n\n---\n\n## Event loop lag\n\n<b>Event loop lag</b> (the delay between when Node should run work and when it does).\n\n> Day 21 established the crucial property and it is worth restating: a <b>blocked</b> loop fires <b>zero</b> ticks, not late ones. So lag is the signal that catches synchronous work, and CPU utilisation is not, because one fully blocked core looks unremarkable.\n\n---\n\n## What actually blocks it\n\nVerified `JSON.parse` on payloads of increasing size, with a 5ms interval running alongside:\n\n```text\n 0.8 MB    2ms    event loop ticks: 0\n 8.2 MB   14ms    event loop ticks: 0\n41.4 MB  173ms    event loop ticks: 0\n```\n\n> Zero ticks in every case. During those 173ms nothing else ran: no other request, no timer, no health check.\n>\n> The number worth carrying is that <b>a megabyte of JSON is a couple of milliseconds</b>. That is fine, and it means the danger is not JSON in general, it is JSON whose size you do not control. Day 19's body limit is the actual fix: 40MB of JSON is only parseable if you let a client send 40MB.\n\nThe other blockers, all previously verified: `bcrypt.hashSync` at 200ms with zero ticks (Day 18), `/^(a+)+$/` at 6,534ms with zero ticks (Day 19), and any `fs.readFileSync` on a request path.\n\n---\n\n## Consistent object shapes\n\n<b>Hidden class</b> (V8's internal description of an object's shape).\n\n<b>Monomorphic</b> (a code site that always sees the same shape). <b>Polymorphic</b> (one that sees several).\n\nVerified, 5 million property accesses:\n\n```text\nmonomorphic    8ms\npolymorphic   22ms      2.58x\n```\n\n> Real and measurable, and worth keeping in proportion. That is 14ms across <b>five million</b> accesses, so it matters in a tight loop over a large array and is invisible in a request handler that does one database query.\n>\n> The practical version: build objects with the same keys in the same order, and prefer a missing value as `null` over a missing key. Then forget about it, because a 2.5x difference on 3ns is not where your 500ms went.",
      diagram: `CPU profiling

    node --cpu-prof server.js

    → a .cpuprofile for Chrome DevTools  (Day 14)


Reading a flame graph

    WIDTH IS TIME. DEPTH IS ONLY NESTING.

    a tall narrow tower is a deep call stack that
    costs NOTHING.

    → look for WIDE PLATEAUS

    → and prefer the INVERTED / bottom-up view
      first: it aggregates a function called from
      twenty places into ONE ROW rather than
      twenty slivers


⚠ What a profile CANNOT tell you

    a profile shows where you spent CPU.

    a request WAITING 470ms on a database appears
    as ALMOST NOTHING, because waiting is not CPU.

    → a profile of a database-bound endpoint looks
      FLAT AND IDLE

    → easy to conclude wrongly that nothing is
      slow

    profile once you have established the time is
    IN NODE. traces or timers establish that.


Event loop lag: the signal that works

    Day 21: a BLOCKED loop fires ZERO ticks, not
    late ones.

    → lag catches synchronous work
    → CPU utilisation does NOT, because one fully
      blocked core looks unremarkable


⚠⚠ What actually blocks it. Verified.

    JSON.parse, with a 5ms interval alongside:

       0.8 MB     2ms   ticks: 0
       8.2 MB    14ms   ticks: 0
      41.4 MB   173ms   ticks: 0

    ZERO TICKS IN EVERY CASE.

    during those 173ms nothing else ran: no other
    request, no timer, no health check.

    ⚠ the number worth carrying:

      A MEGABYTE OF JSON IS A COUPLE OF
      MILLISECONDS.

      that is FINE. so the danger is not JSON in
      general, it is JSON WHOSE SIZE YOU DO NOT
      CONTROL.

      → Day 19's body limit is the actual fix.
        40MB of JSON is only parseable if you let
        a client send 40MB.

    the others, previously verified:
      bcrypt.hashSync   200ms, 0 ticks   (Day 18)
      /^(a+)+$/ on 30   6534ms, 0 ticks  (Day 19)
      fs.readFileSync   any request path


Consistent object shapes. Verified.

    5,000,000 property accesses:

      monomorphic     8ms
      polymorphic    22ms      2.58x

    real and measurable. and keep it in
    proportion:

      that is 14ms across FIVE MILLION accesses.

      → it matters in a TIGHT LOOP over a large
        array

      → it is INVISIBLE in a handler doing one
        database query

    the practical version:

      same keys, same order
      a missing value as null, not a missing key

    then forget about it. a 2.5x difference on 3ns
    is not where your 500ms went.`,
      codeExample: {
        title: "Profiling something, and the blockers that matter",
        code: `// ── Getting a profile ───────────────────────────────────────
// $ node --cpu-prof --cpu-prof-dir=./profiles server.js
//   ... generate load with autocannon ...
//   ^C
//
// Writes ./profiles/CPU.20260907.143012.12345.0.001.cpuprofile
// Open Chrome DevTools → Performance → load the file.
//
// ⚠ Read it bottom-up first. The default top-down view splits
// a function called from twenty places into twenty slivers,
// each too narrow to notice, while the inverted view shows one
// row saying it is 40% of your CPU.


// ── ⚠ What a profile will not show you ─────────────────────
app.get("/orders/:id", async (request) => {
  const order = await slowQuery(request.params.id);    // 470ms
  return computePricing(order);                        // 10ms
});
//
// Profile this under load and the flame graph is nearly empty.
// 470ms of the 480 was spent WAITING, which consumes no CPU,
// so the profile shows the 10ms of pricing as though it were
// the whole story.
//
// People then optimise computePricing, halve it, and change
// the endpoint from 480ms to 475ms.
//
// ✓ Establish the fraction first (last lesson's timers or
//   Day 21's spans), THEN profile if the time is in Node.


// ── ⚠⚠ JSON, and the size you do not control ────────────────
// Verified, with a 5ms interval counting alongside:
//
//    0.8 MB  JSON.parse:    2ms, event loop ticks: 0
//    8.2 MB  JSON.parse:   14ms, event loop ticks: 0
//   41.4 MB  JSON.parse:  173ms, event loop ticks: 0
//
// Two things follow.
//
// A megabyte costing 2ms means normal JSON is not your
// problem. Do not go looking for a streaming JSON parser
// because you read that JSON.parse is slow.
//
// And ZERO TICKS means that when it IS big, nothing else in
// the process runs. 173ms with no health check answered, no
// timer fired, and every concurrent request queued.
//
// ✓ So the fix is a limit, not a faster parser:
const app = Fastify({ bodyLimit: 256 * 1024 });    // Day 19
//
// 256KB of JSON is well under a millisecond. A client cannot
// hand you 40MB, so you cannot spend 173ms parsing it.
//
// ✗ And the one people miss, because it is outbound:
app.get("/export", async () => {
  const rows = await db.select().from(orders);        // 500k rows
  return rows;                                        // stringify
});
// Fastify serialises that, and JSON.stringify blocks exactly
// the same way. Day 19's .max() on a limit parameter and
// Day 26's streaming lesson are both about this.


// ── The other blockers, previously verified ─────────────────
// ✗ bcrypt.hashSync at cost 12: 200ms, 0 ticks     (Day 18)
//   and it sits on /login, which anyone can call.
//
// ✗ /^(a+)+$/ on 30 characters: 6,534ms, 0 ticks   (Day 19)
//   from a 30-byte request body.
//
// ✗ fs.readFileSync on a request path:
app.get("/template", async () => {
  return renderTemplate(readFileSync("./views/page.hbs", "utf8"));
});
//   Fine on a warm page cache and a disk stall makes it a
//   full stop. Read it once at startup instead:
const template = readFileSync("./views/page.hbs", "utf8");
app.get("/template", async () => renderTemplate(template));
//
// ✗ A synchronous loop over a large array:
const totals = orders.map((o) => expensiveCalculation(o));
//   100,000 items at 20µs each is 2 seconds of zero ticks.
//   Day 11's worker threads, or do it in a Day 24 job.


// ── Measure the lag, since CPU will not show it ──────────────
import { monitorEventLoopDelay } from "node:perf_hooks";

const lag = monitorEventLoopDelay({ resolution: 10 });
lag.enable();

setInterval(() => {
  const p99 = lag.percentile(99) / 1e6;
  if (p99 > 100) {
    log().warn({
      p50: Math.round(lag.percentile(50) / 1e6),
      p99: Math.round(p99),
      max: Math.round(lag.max / 1e6),
    }, "event loop lag high");
  }
  lag.reset();
}, 10_000).unref();
//
// Day 21's point restated with today's numbers: during the
// 173ms parse and the 6,534ms regex, CPU showed one busy core
// and this metric showed an outage. Only one of those two is
// actionable.


// ── Object shapes, verified and in proportion ───────────────
function getName(o) { return o.name; }

// Same shape every time.
const mono = Array.from({ length: 1000 }, (_, i) => ({ name: "u" + i, age: i }));

// Four shapes, interleaved.
const poly = Array.from({ length: 1000 }, (_, i) => {
  const m = i % 4;
  if (m === 0) return { name: "u" + i, age: i };
  if (m === 1) return { age: i, name: "u" + i };            // different ORDER
  if (m === 2) return { name: "u" + i, age: i, extra: 1 };   // extra key
  return { name: "u" + i };                                  // missing key
});

// 5,000,000 accesses each, after warm-up:
//   monomorphic     8ms
//   polymorphic    22ms       ratio 2.58x      ← VERIFIED
//
// Note what made it polymorphic: the same two keys in a
// different ORDER counts as a different shape, which is the
// part that surprises people.
//
// ⚠ And the proportion. 14ms across five million accesses is
// about 3 nanoseconds each. So:
//
//   ✓ worth caring about   a loop over 500,000 rows in a
//                          report, a hot serialisation path
//   ✗ not worth caring     a request handler that awaits a
//                          database query
//
// If your endpoint is 480ms and 470 of it is the database,
// making property access 2.5x faster changes nothing you can
// measure.

// ✓ The habit, which costs nothing:
function toRow(order) {
  return {
    id: order.id,
    total: order.total,
    // Always present, as null rather than absent, so every
    // row has one shape.
    discount: order.discount ?? null,
    note: order.note ?? null,
  };
}
// ✗ Versus the version that creates four shapes:
function toRowBad(order) {
  const row = { id: order.id, total: order.total };
  if (order.discount) row.discount = order.discount;
  if (order.note) row.note = order.note;
  return row;
}
// Same output for a client, four hidden classes for V8, and
// the second version is also the one that produces
// inconsistent JSON.`,
      },
      keyTakeaways: [
        "In a flame graph width is time and depth is only nesting, so look for wide plateaus and read the inverted view first.",
        "The inverted view aggregates a function called from twenty places into one row instead of twenty unnoticeable slivers.",
        "A CPU profile cannot show waiting. A database-bound endpoint profiles as flat and idle, so establish the fraction before profiling.",
        "Event loop lag is the signal for synchronous work, because a blocked loop fires zero ticks while CPU shows one unremarkable busy core.",
        "Verified: `JSON.parse` on 0.8MB took 2ms, on 41MB took 173ms, and the event loop ticked zero times in every case.",
        "A megabyte of JSON costing 2ms means normal JSON is not the problem. The danger is JSON whose size you do not control.",
        "So Day 19's body limit is the fix, not a faster parser: 40MB is only parseable if a client can send 40MB.",
        "The same applies outbound, where an unbounded query result blocks in `JSON.stringify`.",
        "Read files at startup, not on a request path, where a disk stall becomes a full stop.",
        "Verified: 5 million property accesses took 8ms monomorphic and 22ms polymorphic, a 2.58x ratio.",
        "The same keys in a different order counts as a different shape, which is the part that surprises people.",
        "Keep it in proportion: 14ms across five million accesses is about 3ns each, which is invisible next to one database query.",
        "Build objects with consistent keys and prefer `null` to a missing key. It costs nothing and also produces consistent JSON.",
      ],
      commonMistakes: [
        "Profiling a database-bound endpoint and concluding nothing is slow, because waiting consumes no CPU.",
        "Reading only the top-down flame graph, where a hot function called from many places is split into invisible slivers.",
        "Interpreting a deep call stack as expensive. Depth is nesting; only width is time.",
        "Watching CPU utilisation for blocking, which shows one busy core while the process serves nobody.",
        "Reaching for a streaming JSON parser because JSON.parse is \"slow\", when a megabyte costs 2ms.",
        "No body limit, which is what makes a 173ms parse possible at all.",
        "An unbounded query result, which blocks in serialisation on the way out.",
        "`readFileSync` on a request path, which is fine until the disk is slow.",
        "Micro-optimising object shapes in a handler whose time is 98% database.",
        "Building objects by conditionally adding keys, which creates several hidden classes and inconsistent JSON.",
      ],
      quiz: [
        {
          question: "Why does a CPU profile of a database-bound endpoint look nearly empty?",
          options: [
            "The profiler samples too slowly",
            "Waiting consumes no CPU, so 470ms of query time appears as almost nothing and the 10ms of your code looks like the whole story",
            "Database calls are excluded",
            "The profile needs a flag",
          ],
          correctIndex: 1,
          explanation:
            "Establish the fraction with timers or traces first, and profile only once you know the time is in Node.",
        },
        {
          question: "What was verified about `JSON.parse` and the event loop?",
          options: [
            "It yields between objects",
            "0.8MB took 2ms and 41MB took 173ms, with the event loop ticking zero times in every case",
            "It runs on the thread pool",
            "It is always fast",
          ],
          correctIndex: 1,
          explanation:
            "A megabyte costing 2ms means the danger is not JSON but JSON whose size you do not control, so a body limit is the fix.",
        },
        {
          question: "Why is event loop lag a better blocking signal than CPU utilisation?",
          options: [
            "It is cheaper to collect",
            "A blocked loop fires zero ticks, so lag is unambiguous while CPU shows one busy core and looks unremarkable",
            "CPU is sampled too rarely",
            "Lag includes I/O waits",
          ],
          correctIndex: 1,
          explanation:
            "During the verified 173ms parse and Day 19's 6,534ms regex, only loop delay said the process was serving nobody.",
        },
        {
          question: "What made the polymorphic benchmark 2.58x slower, and how much was it in absolute terms?",
          options: [
            "Missing keys only, and it was 10x",
            "Different shapes including the same keys in a different order, and it was 14ms across five million accesses, about 3ns each",
            "Larger objects, and 100ms",
            "Prototype lookups, and it was unmeasurable",
          ],
          correctIndex: 1,
          explanation:
            "Real in a tight loop over a large array, and invisible next to one database query. Keep it in proportion.",
        },
        {
          question: "How should you read a flame graph?",
          options: [
            "Look for the deepest stacks",
            "Width is time and depth is only nesting, so look for wide plateaus, and read the inverted view first to aggregate a function called from many places",
            "Start at the top",
            "Sort by call count",
          ],
          correctIndex: 1,
          explanation:
            "The top-down view splits a hot shared function into slivers too narrow to notice.",
        },
      ],
    },
    {
      id: "serialization-compression-streaming",
      title: "Serialisation, compression and streaming",
      durationMinutes: 12,
      explanation:
        "## Response serialisation\n\nEvery JSON response goes through `JSON.stringify`, and Fastify can use a response schema to compile a specialised serialiser instead.\n\n---\n\n## A correction, including to what I said earlier\n\nDay 15 and Day 16 claimed a response schema makes serialisation faster. Measured directly on Node 24:\n\n```text\n20,000 serialisations of a 200-object array\n\nJSON.stringify        543ms\nfast-json-stringify   834ms      →  0.65x\n```\n\n> `JSON.stringify` was <b>faster</b> for this shape. Modern V8's implementation is very good, and a compiled serialiser is not automatically a win.\n>\n> The HTTP-level comparison was worse than inconclusive: the same unchanged route measured 12,490 and 20,156 req/sec across two runs, which is a wider spread than any difference between the two versions. So on this machine, at this payload shape, <b>the throughput claim is unsupported</b>.\n>\n> Which means the honest reason for a response schema is the one Day 16 verified: it is an <b>allowlist</b> that stops `passwordHash` leaving. That is a security control, and it stands on its own without a performance argument.\n\n---\n\n## And a schema that strips fields does more work\n\nVerified with a schema that omitted two fields:\n\n```text\nno schema     16,250 req/sec   52,853 bytes/response\nwith schema   12,671 req/sec   42,231 bytes/response\n```\n\n> The schema version sent 10KB less and served fewer requests, because filtering 200 objects is real work that plain `stringify` never does. That is a trade worth making for the security, and it is the opposite of a free speedup.\n\n---\n\n## Compression\n\n<b>Compression</b> (reducing bytes on the wire, at a cost in CPU).\n\nVerified gzip on JSON payloads:\n\n```text\nbytes    gzipped   ratio    gzip ms    brotli ms\n  148        91     1.6x     0.020        0.38\n2,971       249    11.9x     0.014        2.83\n152,671    8,324   18.3x     0.300      166.92\n776,671   41,431   18.7x     1.570      867.56\n```\n\n> Three readings. A <b>148-byte response compresses to 91 bytes</b>, so after headers you have saved almost nothing and spent CPU. The ratio <b>plateaus around 18x</b> by about 15KB, so most of the benefit arrives early. And gzip is genuinely cheap: 1.5ms for 776KB.\n>\n> The finding the draft omits entirely: <b>brotli at default quality is 550x more expensive than gzip</b>. 867ms for 776KB, which on a request path is an outage. Brotli is for static assets built once, not for dynamic responses, unless you drop the quality a long way.\n\nSo: set a threshold of about 1KB, use gzip for dynamic responses, and be deliberate about brotli.\n\n---\n\n## Streaming\n\n> Day 8's lesson with a performance framing. Building a 200MB export in memory means 200MB of heap plus the string plus the buffer, and it blocks in serialisation as verified above. Streaming holds one chunk.\n>\n> The property that matters most is not memory, it is <b>time to first byte</b>. A streamed response starts arriving immediately, so a slow export feels responsive rather than hung, and the client can begin processing before you finish.",
      diagram: `⚠⚠ A correction, including to Day 15 and Day 16

    those days claimed a response schema makes
    serialisation faster.

    MEASURED on Node 24:

      20,000 serialisations, 200-object array

      JSON.stringify        543ms
      fast-json-stringify   834ms    → 0.65x

    JSON.stringify was FASTER for this shape.

    modern V8's implementation is very good, and a
    compiled serialiser is NOT automatically a
    win.

    and the HTTP comparison was worse than
    inconclusive:

      the SAME UNCHANGED ROUTE measured 12,490 and
      20,156 req/sec across two runs

      → a wider spread than any difference between
        the versions

    → on this machine, at this shape, THE
      THROUGHPUT CLAIM IS UNSUPPORTED.

    the honest reason for a response schema is the
    one Day 16 verified:

      IT IS AN ALLOWLIST that stops passwordHash
      leaving.

      a security control, standing on its own
      without a performance argument.


⚠ And a schema that STRIPS does MORE work

    verified, schema omitting two fields:

      no schema    16,250 req/s   52,853 B/resp
      with schema  12,671 req/s   42,231 B/resp

    it sent 10KB less and served FEWER requests,
    because filtering 200 objects is real work
    that plain stringify never does.

    a trade worth making for the security, and the
    OPPOSITE of a free speedup.


Compression. Verified gzip on JSON.

    bytes   gzipped  ratio   gzip ms  brotli ms
      148       91    1.6x    0.020      0.38
    2,971      249   11.9x    0.014      2.83
  152,671    8,324   18.3x    0.300    166.92
  776,671   41,431   18.7x    1.570    867.56

    three readings:

      a 148-BYTE RESPONSE → 91 bytes.
        after headers you saved almost nothing and
        spent CPU.

      the ratio PLATEAUS AROUND 18x by ~15KB.
        most of the benefit arrives early.

      gzip is genuinely CHEAP: 1.5ms for 776KB.

⚠⚠ and the finding the draft omits entirely:

    BROTLI AT DEFAULT QUALITY IS 550x MORE
    EXPENSIVE THAN GZIP.

      867ms for 776KB.

      on a request path that is an OUTAGE.

    brotli is for STATIC ASSETS built once, not
    dynamic responses, unless you drop the quality
    a long way.

    → threshold ~1KB, gzip for dynamic, brotli
      deliberately.


Streaming: Day 8, with a performance framing

    building a 200MB export in memory:
      200MB of heap
      + the string
      + the buffer
      and it BLOCKS in serialisation

    streaming holds ONE CHUNK.

    ⚠ and the property that matters most is not
      memory. it is TIME TO FIRST BYTE.

      a streamed response starts arriving
      IMMEDIATELY

      → a slow export feels responsive rather
        than hung, and the client can begin
        processing before you finish`,
      codeExample: {
        title: "The measurements, and what they change",
        code: `// ── ⚠⚠ The serialiser comparison, measured ──────────────────
import build from "fast-json-stringify";

const rows = Array.from({ length: 200 }, (_, i) => ({
  id: i, name: "Item " + i, email: \`u\${i}@example.com\`,
  description: "x".repeat(100), createdAt: new Date().toISOString(),
}));

const stringify = build({
  type: "array",
  items: { type: "object", properties: {
    id: { type: "integer" }, name: { type: "string" },
    email: { type: "string" }, description: { type: "string" },
    createdAt: { type: "string" },
  } },
});

// After 2,000 warm-up iterations of each, 20,000 measured:
//
//   JSON.stringify        543ms
//   fast-json-stringify   834ms
//   ratio                 0.65x
//
// VERIFIED. The compiled serialiser was slower for this
// payload shape on Node 24.
//
// This corrects something Day 15 and Day 16 said. The
// received wisdom that a Fastify response schema speeds up
// serialisation is not something I could reproduce, and V8's
// JSON.stringify has improved a great deal.
//
// I am not claiming the reverse as a general rule either:
// this is one shape on one machine. What I am claiming is
// that you should not adopt a schema FOR SPEED without
// measuring your own payload.


// ── And the HTTP measurement was worse than inconclusive ────
// Same route, same code, two runs:
//
//   plain    12,490 req/s
//   schema   12,640 req/s
//   plain    20,156 req/s     ← the same route as the first line
//   schema   13,286 req/s
//
// The spread WITHIN one version is larger than the difference
// BETWEEN versions. Last lesson's rule applies: this
// measurement does not support any conclusion about
// throughput.


// ── ✓ So keep the schema for the reason that survives ───────
app.get("/users", {
  schema: {
    response: { 200: { type: "array", items: {
      type: "object",
      properties: {
        id: { type: "integer" }, name: { type: "string" },
        email: { type: "string" }, createdAt: { type: "string" },
      },
    } } },
  },
}, async () => db.select().from(users));
//
// Day 16 verified this strips undeclared fields, so
// passwordHash and internalNotes cannot leave the process
// even if the query returns them. That is an allowlist, it
// fails closed, and it is worth having on its own.
//
// ⚠ And note the cost, verified:
//
//   no schema    16,250 req/s   52,853 bytes/response
//   with schema  12,671 req/s   42,231 bytes/response
//
// The schema version sent 10KB less per response and served
// 22% fewer requests, because filtering 200 objects is work.
// A real trade, made for a real reason, and not a free win.


// ── Compression: where the threshold goes ───────────────────
import compress from "@fastify/compress";

await app.register(compress, {
  global: true,
  threshold: 1024,
  //         ^^^^ ⚠ THE important option.
  //
  // Verified: a 148-byte JSON body gzips to 91 bytes. After
  // the Content-Encoding header you have saved almost nothing
  // and spent CPU on every small response, of which an API
  // has many.
  encodings: ["gzip", "deflate"],
  //          ^^^^^^ deliberately NOT brotli. See below.
});

// VERIFIED gzip measurements:
//
//   bytes     gzipped   ratio    gzip ms
//      148         91    1.6x     0.020
//      736        130    5.7x     0.009
//    2,971        249   11.9x     0.014
//   14,971        851   17.6x     0.039
//  152,671      8,324   18.3x     0.300
//  776,671     41,431   18.7x     1.570
//
// Two things worth internalising.
//
// The ratio PLATEAUS. By about 15KB you are already getting
// 17.6x, and ten times more data buys you 18.7x. So the
// benefit arrives early and you are not leaving much on the
// table with modest payloads.
//
// And gzip is CHEAP: 1.57ms for 776KB. On a response that
// took 200ms to generate, 1.5ms to make it 19x smaller is an
// obvious trade.


// ── ⚠⚠ Brotli, which the draft does not mention ─────────────
// VERIFIED, same payloads:
//
//   bytes      gzip ms    brotli ms     ratio of cost
//      148       0.020        0.38          19x
//    2,971       0.014        2.83         202x
//  152,671       0.300      166.92         556x
//  776,671       1.570      867.56         553x
//
// 867 MILLISECONDS to brotli-compress 776KB, at default
// quality.
//
// On a request path that is not a tuning question, it is an
// outage: one such response occupies the event loop for
// nearly a second, and the last lesson's zero-ticks
// measurement applies.
//
// ✓ Brotli is right for STATIC assets, compressed once at
//   build time and served from disk or a CDN:
//
//     $ brotli -q 11 dist/assets/app.4f3a91c2.js
//
//   Compressed once, served a million times, and Day 23's
//   immutable cache header means it is never recompressed.
//
// ✓ If you want brotli for dynamic responses, drop the
//   quality a long way (4 or 5) and MEASURE it against gzip
//   on your own payloads. The default is 11.


// ── Streaming: Day 8, and time to first byte ────────────────
// ✗ Build it all, then send it.
app.get("/export.csv", async (request, reply) => {
  const rows = await db.select().from(orders);        // 500,000 rows
  const csv = rows.map(toCsvLine).join("\\n");         // ~200MB string
  reply.type("text/csv");
  return csv;
});
//
// Three problems, and the third is the one users feel.
//   the rows in memory, plus the string, plus the buffer
//   the map() and join() block, with zero ticks
//   NOTHING reaches the client until all of it is ready

// ✓ Stream it.
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";

app.get("/export.csv", async (request, reply) => {
  reply.header("content-type", "text/csv");
  reply.header("content-disposition", 'attachment; filename="orders.csv"');

  const toCsv = new Transform({
    objectMode: true,
    transform(row, _enc, cb) { cb(null, toCsvLine(row) + "\\n"); },
  });

  // A cursor, so the database is not asked for 500,000 rows
  // at once either. Day 17's point: an unbounded query is the
  // other half of this problem.
  const cursor = db.select().from(orders).stream();

  reply.hijack();
  await pipeline(cursor, toCsv, reply.raw);
});
//
// Memory is one chunk. And the first bytes arrive in
// milliseconds, so the browser shows a download starting
// rather than a request that appears to hang for a minute.
//
// That time-to-first-byte difference is what users actually
// notice, and it is why streaming is a UX change as much as a
// memory one.
//
// ⚠ One caution: compression and streaming interact. A
// compression layer that buffers to compress defeats the
// streaming, which is exactly Day 25's SSE finding. Check
// that your compression flushes per chunk, or exclude
// streamed routes from it.`,
      },
      keyTakeaways: [
        "Measured on Node 24: `JSON.stringify` took 543ms and `fast-json-stringify` took 834ms for 20,000 serialisations of the same array.",
        "That corrects Day 15 and Day 16, which claimed a response schema makes serialisation faster. It was slower for this shape.",
        "The HTTP comparison was worse than inconclusive: the same unchanged route varied from 12,490 to 20,156 req/sec.",
        "So keep the response schema for the reason Day 16 verified: it is an allowlist that stops `passwordHash` leaving.",
        "Verified: a schema that strips two fields sent 10KB less and served 22% fewer requests, because filtering is real work.",
        "Verified compression: a 148-byte body gzips to 91 bytes, so a small response spends CPU for almost no saving.",
        "The gzip ratio plateaus around 18x by roughly 15KB, so most of the benefit arrives early.",
        "gzip is cheap: 1.57ms for 776KB, which is an obvious trade on a response that took 200ms to build.",
        "Verified and absent from most advice: brotli at default quality took 867ms for 776KB, about 550x gzip's cost.",
        "So brotli belongs on static assets compressed once at build time, not on dynamic responses at default quality.",
        "Set a compression threshold around 1KB, because an API serves many small responses.",
        "Streaming's biggest win is time to first byte, not memory: a slow export feels responsive instead of hung.",
        "Stream the database cursor too, or an unbounded query is the other half of the memory problem.",
        "Compression that buffers defeats streaming, which is Day 25's SSE finding in another place.",
      ],
      commonMistakes: [
        "Adopting a response schema for speed. Measured, `JSON.stringify` was faster for a simple flat payload on Node 24.",
        "Believing a schema is a free performance win when it also filters fields, which is measurable extra work.",
        "Concluding anything from a single before-and-after HTTP benchmark, given a verified 60% spread on an unchanged route.",
        "Compressing every response with no threshold, so a 148-byte body costs CPU to save 57 bytes.",
        "Enabling brotli at default quality for dynamic responses, which measured 867ms for 776KB.",
        "Compressing static assets at request time instead of once at build time.",
        "Building a large export in memory, which costs heap and blocks in serialisation and delays the first byte until everything is ready.",
        "Streaming the response but not the query, so the database still hands you every row at once.",
        "Leaving a buffering compression layer in front of a streamed route, which removes the streaming.",
      ],
      quiz: [
        {
          question: "What did measuring `JSON.stringify` against `fast-json-stringify` show?",
          options: [
            "The compiled serialiser was 2x faster",
            "`JSON.stringify` was faster for that shape: 543ms against 834ms over 20,000 serialisations",
            "They were identical",
            "The test could not run",
          ],
          correctIndex: 1,
          explanation:
            "That corrects Days 15 and 16. Keep the schema for Day 16's verified allowlist behaviour, not for speed.",
        },
        {
          question: "What did a field-stripping response schema cost?",
          options: [
            "Nothing measurable",
            "22% fewer requests per second, because filtering 200 objects is work plain `stringify` never does. It sent 10KB less per response.",
            "It doubled throughput",
            "It only affected memory",
          ],
          correctIndex: 1,
          explanation:
            "A real trade made for a real security reason, and the opposite of a free speedup.",
        },
        {
          question: "Why set a compression threshold of about 1KB?",
          options: [
            "Browsers ignore smaller bodies",
            "A verified 148-byte JSON body gzips to 91 bytes, so after headers you spend CPU on every small response for almost no saving",
            "gzip fails below 1KB",
            "It reduces memory",
          ],
          correctIndex: 1,
          explanation:
            "The ratio also plateaus around 18x by roughly 15KB, so the benefit arrives early on payloads that are worth compressing.",
        },
        {
          question: "What was measured about brotli at default quality?",
          options: [
            "Slightly slower than gzip",
            "867ms for 776KB, roughly 550x gzip's cost, which on a request path is an outage",
            "Faster than gzip",
            "It failed on JSON",
          ],
          correctIndex: 1,
          explanation:
            "Brotli belongs on static assets compressed once at build time, or at a much lower quality if you measure it.",
        },
        {
          question: "What is streaming's biggest practical win?",
          options: [
            "Lower CPU",
            "Time to first byte. A streamed export starts arriving immediately, so it feels responsive rather than hung.",
            "Smaller payloads",
            "Fewer database queries",
          ],
          correctIndex: 1,
          explanation:
            "Memory matters too, and the latency is what users notice. Stream the query as well, or the database still hands you everything at once.",
        },
      ],
    },
    {
      id: "connections-memory-scaling",
      title: "Connections, memory and scaling out",
      durationMinutes: 12,
      explanation:
        "## Reuse connections\n\n<b>Connection pooling</b> (reusing database connections instead of creating one per request). Day 17 covered it, and one line is worth repeating: a connection is a server-side process plus a TCP, TLS and auth handshake, so you want few of them working hard.\n\n<b>Keep-alive</b> (reusing a TCP connection for several HTTP requests).\n\n> The one people miss: <b>outbound</b> keep-alive. Node's `fetch` reuses connections through its default agent, and `http.request` historically did not. If you call a third party on every request without connection reuse, you pay a TCP and TLS handshake each time, which is tens of milliseconds of pure overhead that no profiler will attribute to your code.\n\n---\n\n## The heap limit\n\nVerified on Node 24:\n\n```text\ndefault heap_size_limit                       4288 MB\nwith --max-old-space-size=256                  448 MB\n```\n\n> Two findings. The default is <b>sized from available memory</b> rather than being a fixed 1.5GB as older advice says, so a large machine already has a large heap and the flag is often unnecessary.\n>\n> And the flag does not do what its users think: asking for 256 produced a reported limit of <b>448MB</b>, because old space is one part of the heap and the rest is added on top. So the number you pass is not the number you get, which matters when you are sizing a container.\n\n---\n\n## Raising the limit is not a fix\n\n> A leak with more headroom is a leak that takes longer to crash, and the crash is then slower and larger. Day 14's heap snapshots are how you find it.\n>\n> The genuinely useful case for the flag is the opposite direction: <b>lowering</b> it below your container's memory limit, so Node hits its own heap limit and throws a catchable error instead of being killed by the OOM killer with no stack trace and no log line.\n\n---\n\n## Cluster and horizontal scaling\n\n<b>Cluster</b> (running several Node processes that share a listening port).\n\n<b>Horizontal scaling</b> (adding instances rather than making one bigger).\n\n> Both exist because one Node process runs your JavaScript on one thread, so a four-core machine with one process leaves three cores idle for CPU work.\n>\n> The distinction that matters in practice: <b>cluster shares nothing but the port</b>. Every worker has its own memory, so Day 21's in-memory sessions, Day 19's in-process rate limiter, Day 24's per-process cron and Day 25's local room index all break the moment you cluster, in exactly the same way they break with multiple containers. Clustering is not a smaller version of scaling out, it has the same consequences.\n\n---\n\n## Cluster or containers\n\n```text\ncluster        one container, N processes, shared port\ncontainers     N containers, a load balancer\n```\n\n> Containers usually win, and the reason is <b>operational rather than technical</b>: a container is what your orchestrator can restart, scale, roll out and health-check individually. With cluster, a wedged worker is invisible to Kubernetes because the container is still up.\n>\n> Cluster earns its place when you are given a large machine and cannot run more containers on it. And if you use it, remember Day 21's readiness and Day 22's signal handling now apply to the <b>primary</b> as well.\n\n---\n\n## And the thing that is usually actually slow\n\n> Everything in this day is worth knowing. In practice the breakdown looks like Node 10ms, Redis 5ms, database 470ms, network 15ms, and the answer is Day 17's index, Day 17's N+1, or Day 23's cache.\n>\n> The professional habit is not knowing more optimisations. It is <b>refusing to start</b> until you know which line of that breakdown you are working on.",
      diagram: `Reuse connections

    POOLING (Day 17): a connection is a
    server-side process plus a TCP, TLS and auth
    handshake. few of them, working hard.

    KEEP-ALIVE: reuse a TCP connection for several
    requests.

    ⚠ the one people miss: OUTBOUND keep-alive.

      Node's fetch reuses connections through its
      default agent. http.request historically did
      not.

      calling a third party per request with no
      reuse means a TCP + TLS handshake EACH TIME

      → tens of milliseconds of pure overhead that
        no profiler will attribute to your code


⚠⚠ The heap limit. Verified on Node 24.

    default heap_size_limit          4288 MB
    with --max-old-space-size=256     448 MB

    two findings:

    1. THE DEFAULT IS SIZED FROM AVAILABLE MEMORY

       not a fixed 1.5GB as older advice says.

       → a large machine already has a large heap,
         and the flag is often unnecessary

    2. THE FLAG DOES NOT DO WHAT ITS USERS THINK

       asking for 256 produced a reported limit of
       448MB, because OLD SPACE IS ONE PART of the
       heap and the rest is added on top.

       → the number you pass is not the number you
         get, which matters when sizing a
         container


Raising it is not a fix

    a leak with more headroom is a leak that takes
    LONGER TO CRASH, and the crash is then slower
    and larger.

    Day 14's heap snapshots find it.

    ✓ the genuinely useful case is the OPPOSITE:

      LOWER it below your container's memory limit,
      so Node hits its own heap limit and throws a
      CATCHABLE error instead of being killed by
      the OOM killer with no stack trace and no
      log line.


Cluster and horizontal scaling

    both exist because one Node process runs your
    JavaScript on ONE THREAD.

    → a four-core machine with one process leaves
      three cores idle for CPU work

⚠ the distinction that matters:

    CLUSTER SHARES NOTHING BUT THE PORT.

    every worker has its own memory, so:

      Day 21's in-memory sessions
      Day 19's in-process rate limiter
      Day 24's per-process cron
      Day 25's local room index

    all break the moment you cluster, exactly as
    they break with multiple containers.

    → clustering is NOT a smaller version of
      scaling out. it has the SAME consequences.


Cluster or containers

    cluster      one container, N processes,
                 shared port
    containers   N containers, a load balancer

    containers usually win, and the reason is
    OPERATIONAL rather than technical:

      a container is what your orchestrator can
      restart, scale, roll out and health-check
      INDIVIDUALLY

      with cluster, a WEDGED WORKER IS INVISIBLE
      to Kubernetes, because the container is
      still up

    cluster earns its place when you are given a
    large machine and cannot run more containers
    on it.

    and then Day 21's readiness and Day 22's
    signal handling apply to the PRIMARY too.


And the thing that is usually actually slow

    Node       10ms
    Redis       5ms
    DATABASE  470ms
    network    15ms

    the answer is Day 17's index, Day 17's N+1, or
    Day 23's cache.

    the professional habit is not knowing more
    optimisations.

    it is REFUSING TO START until you know which
    line of that breakdown you are working on.`,
      codeExample: {
        title: "Reuse, limits, and scaling out",
        code: `// ── ⚠ Outbound keep-alive, the overhead nobody attributes ───
// Node's fetch reuses connections via its default agent, so
// this is usually already fine:
const res = await fetch("https://api.provider.com/v1/rates");

// But an explicit agent lets you control it, and matters when
// a library uses http.request underneath:
import { Agent, setGlobalDispatcher } from "undici";

setGlobalDispatcher(new Agent({
  keepAliveTimeout: 30_000,
  keepAliveMaxTimeout: 60_000,
  connections: 50,
  //           ^^ per origin. Too low and your requests queue
  //           behind each other; too high and you are Day 17's
  //           pool arithmetic aimed at somebody else's server.
}));
//
// Why this is worth a line: a TLS handshake to a remote host
// is commonly 30-80ms. If you make one third-party call per
// request with no reuse, that is 30-80ms added to every
// request, and a CPU profile shows nothing because it is all
// waiting. The last lesson's point: a profile cannot see this.
//
// Measure it directly instead:
const t = performance.now();
await fetch(url);
log().debug({ ms: Math.round(performance.now() - t) }, "provider call");
// Two consecutive calls where the second is much faster than
// the first is connection reuse working. If they are the same
// and both slow, it is not.


// ── ⚠⚠ The heap limit, verified ─────────────────────────────
import v8 from "node:v8";

const s = v8.getHeapStatistics();
console.log((s.heap_size_limit / 1048576).toFixed(0), "MB");
//
// VERIFIED on this machine:
//
//   $ node -e "..."
//     4288 MB          ← the DEFAULT
//
//   $ node --max-old-space-size=256 -e "..."
//     448 MB           ← asked for 256
//
// Two things follow.
//
// 1. The default is sized from available memory, not fixed at
//    1.5GB as a lot of older advice says. On a large machine
//    you may not need the flag at all, and adding it can
//    LOWER your limit by accident.
//
// 2. The flag sets OLD SPACE, and the reported heap limit is
//    higher because new space and other regions are added on
//    top. So --max-old-space-size=256 in a 300MB container is
//    still liable to be OOM-killed.
//
//    Verify what you actually got rather than assuming:
console.log("limit:", (v8.getHeapStatistics().heap_size_limit / 1048576).toFixed(0), "MB");


// ── ✗ Raising it as a response to a leak ────────────────────
// node --max-old-space-size=8192 server.js
//
// The leak still leaks. You have changed a crash every two
// hours into a crash every sixteen, and made the crash worse:
// more memory to reclaim, a longer GC pause before it, and a
// bigger heap snapshot to load when you finally investigate.
//
// Day 14's heap snapshots are the actual tool. This flag is
// how you delay using them.

// ── ✓ The useful direction: LOWER it ────────────────────────
// Container memory limit: 512MB
// node --max-old-space-size=384 server.js
//
// Now Node hits its own heap limit first and throws:
//
//   FATAL ERROR: Reached heap limit Allocation failed -
//   JavaScript heap out of memory
//   <a stack trace>
//
// rather than the container being SIGKILLed by the OOM killer,
// which gives you no stack, no log line and an exit code of
// 137 that tells you nothing about where.
//
// Pair it with Day 14's flag, so you get a snapshot of the
// moment it happened:
// node --max-old-space-size=384 --heapsnapshot-near-heap-limit=2 server.js


// ── Cluster, and what it does not share ─────────────────────
import cluster from "node:cluster";
import { availableParallelism } from "node:os";

if (cluster.isPrimary) {
  const n = availableParallelism();
  log().info({ workers: n }, "starting cluster");

  for (let i = 0; i < n; i++) cluster.fork();

  cluster.on("exit", (worker, code, signal) => {
    if (shuttingDown) return;
    log().error({ pid: worker.process.pid, code, signal }, "worker died, replacing");
    cluster.fork();
  });

  // ⚠ Day 22's signal handling now applies to the PRIMARY.
  // Without this, docker stop kills the primary and the
  // workers are orphaned mid-request.
  for (const sig of ["SIGTERM", "SIGINT"]) {
    process.on(sig, async () => {
      shuttingDown = true;
      for (const w of Object.values(cluster.workers)) w.process.kill("SIGTERM");
      // Give them Day 22's drain window before giving up.
      setTimeout(() => process.exit(0), 10_000).unref();
    });
  }
} else {
  const app = buildApp();
  await app.listen({ port: config.server.port, host: "0.0.0.0" });
}


// ── ⚠⚠ What breaks the moment you cluster ───────────────────
// Every worker is a separate process with its own memory. So
// each of these, which you have already met:
//
//   Day 19  an in-process rate limiter
//           → 4 workers means 4x your configured limit
//
//   Day 21  an in-memory session Map
//           → users randomly logged out, depending on which
//             worker answered
//
//   Day 23  an in-process cache
//           → four copies, four times the memory, and stale
//             entries in three of them after an invalidation
//
//   Day 24  node-cron inside the app
//           → the daily report runs four times
//
//   Day 25  a local WebSocket room index
//           → a broadcast reaches a quarter of the room
//
// Clustering is not a gentler version of running four
// containers. It has identical consequences, and it arrives
// without a deployment change to make you think about them.
//
// So: Redis for shared state, before you cluster and before
// you scale out. The order matters, because clustering on a
// laptop is one flag and finding these bugs in production is
// not.


// ── Cluster or containers ───────────────────────────────────
// The technical difference is small. The operational one is
// not:
//
//   containers                  cluster
//   ────────────────────────────────────────────────────────
//   restart one instance        restart the whole container
//   scale by replica count      scale by editing code
//   roll out one at a time      all workers at once
//   health-check each           the container is "up" even
//                               with three wedged workers
//   one process per container   PID 1 is your primary
//
// That health-check row is the deciding one. Day 21's
// liveness probe cannot see a worker whose event loop is
// blocked, because the primary answers the probe.
//
// ✓ Containers, with one Node process each, unless you have a
//   specific reason.
// ✓ Cluster when you are handed a 16-core machine and cannot
//   run 16 containers on it.


// ── And the reminder that outranks all of it ────────────────
//   Node processing    10ms
//   Redis               5ms
//   Database          470ms
//   Network            15ms
//
// Clustering this endpoint four ways gets you four times the
// concurrency on the 10ms and does nothing for the 470ms,
// which is now four processes queueing on the same database
// and Day 17's pool.
//
// The index is the fix. Everything in this day is real, and
// none of it is the answer to that breakdown.`,
      },
      keyTakeaways: [
        "Outbound keep-alive is the overhead nobody attributes: a TLS handshake per third-party call is tens of milliseconds a profiler cannot see, because it is waiting.",
        "Node's `fetch` reuses connections by default, and libraries built on `http.request` may not.",
        "Verified: the default `heap_size_limit` was 4288MB, sized from available memory rather than a fixed 1.5GB as older advice says.",
        "Verified: `--max-old-space-size=256` produced a reported limit of 448MB, because old space is one part of the heap.",
        "So the number you pass is not the number you get, which matters when sizing a container.",
        "Raising the limit for a leak converts a crash every two hours into a worse crash every sixteen. Day 14's snapshots are the tool.",
        "The useful direction is lowering it below the container's limit, so Node throws a catchable heap error instead of being SIGKILLed with no stack.",
        "Cluster and horizontal scaling both exist because one Node process runs JavaScript on one thread.",
        "Cluster shares nothing but the port, so in-memory sessions, in-process rate limiters, per-process cron and local room indexes all break identically to scaling out.",
        "Clustering is not a gentler version of scaling out, and it arrives without a deployment change to make you think about it.",
        "Containers usually win for operational reasons: an orchestrator can restart, scale, roll out and health-check each one.",
        "With cluster, a wedged worker is invisible to a liveness probe because the primary answers it.",
        "If you cluster, Day 21's readiness and Day 22's signal handling now apply to the primary too.",
        "And the breakdown outranks all of it: Node 10ms against a database 470ms means the index is the fix, not any of this.",
      ],
      commonMistakes: [
        "No outbound connection reuse, adding a TLS handshake to every third-party call that no profiler will attribute.",
        "Assuming the default heap limit is 1.5GB, when it is sized from available memory and was verified at 4288MB.",
        "Assuming `--max-old-space-size=N` sets the total heap to N megabytes. It produced 448MB for 256.",
        "Adding the flag on a large machine, which can lower your limit by accident.",
        "Raising the heap limit in response to a leak, which delays and worsens the crash.",
        "Not lowering it below the container limit, so you get a SIGKILL and exit 137 instead of a heap error with a stack.",
        "Clustering without moving state to Redis first, which reintroduces every per-process bug from days 19, 21, 23, 24 and 25 at once.",
        "Treating cluster as different from scaling out. The consequences for shared state are identical.",
        "Clustering with no signal handling on the primary, so a stop orphans workers mid-request.",
        "Using cluster where a liveness probe matters, since the primary answers the probe for wedged workers.",
        "Scaling out an endpoint whose time is 95% database, which multiplies pressure on the same pool.",
      ],
      quiz: [
        {
          question: "What did `--max-old-space-size=256` produce as a reported heap limit?",
          options: [
            "256MB",
            "448MB, because old space is one part of the heap and other regions are added on top",
            "1.5GB",
            "It errored",
          ],
          correctIndex: 1,
          explanation:
            "Verified, along with a default of 4288MB sized from available memory. The number you pass is not the number you get.",
        },
        {
          question: "When is `--max-old-space-size` genuinely useful?",
          options: [
            "To fix a memory leak",
            "Lowered below the container's memory limit, so Node throws a catchable heap error with a stack instead of being SIGKILLed",
            "Raised on every deploy",
            "Never",
          ],
          correctIndex: 1,
          explanation:
            "Raising it for a leak just delays and enlarges the crash. Pair the lower limit with `--heapsnapshot-near-heap-limit`.",
        },
        {
          question: "What does `cluster` share between workers?",
          options: [
            "Memory and the port",
            "Only the listening port. Every worker has its own memory, so in-memory sessions, rate limiters, caches and cron all break exactly as they do when scaling out.",
            "Nothing at all",
            "The event loop",
          ],
          correctIndex: 1,
          explanation:
            "Clustering is not a gentler version of scaling out, and it arrives without a deployment change to prompt you about shared state.",
        },
        {
          question: "Why do containers usually beat `cluster`?",
          options: [
            "They are faster",
            "Operationally: an orchestrator can restart, scale, roll out and health-check each one, while a wedged cluster worker is invisible because the primary answers the probe",
            "Less memory",
            "Better logging",
          ],
          correctIndex: 1,
          explanation:
            "Cluster earns its place when you are handed a large machine and cannot run more containers on it.",
        },
        {
          question: "Why is outbound keep-alive easy to miss?",
          options: [
            "It is off by default everywhere",
            "The handshake cost is waiting rather than CPU, so a profiler attributes none of it to your code",
            "It only affects HTTP/2",
            "It is a client concern",
          ],
          correctIndex: 1,
          explanation:
            "Measure two consecutive calls: a much faster second one means reuse is working.",
        },
        {
          question: "Given Node 10ms, Redis 5ms, database 470ms and network 15ms, what is the fix?",
          options: [
            "Cluster across four cores",
            "The database: an index, an N+1, or a cache. Nothing in this day addresses the 470ms.",
            "Enable compression",
            "A response schema",
          ],
          correctIndex: 1,
          explanation:
            "Clustering gets four times the concurrency on the 10ms and puts four processes on the same pool for the 470ms.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Node's CPU is 10% of a 500ms request. What is the ceiling on optimising it?",
      options: [
        "Half the request",
        "50ms, or 10%, even if you make it infinitely fast",
        "It depends on concurrency",
        "There is no ceiling",
      ],
      correctIndex: 1,
      explanation:
        "So the first question is what fraction of the time something is, and that step decides whether the work is worth doing at all.",
    },
    {
      question: "What was measured running autocannon twice against the same unchanged route?",
      options: [
        "Nearly identical results",
        "12,490 and 20,156 req/sec, a 60% spread with nothing changed",
        "The second was always faster",
        "The tool failed",
      ],
      correctIndex: 1,
      explanation:
        "One run before and one after a change will confirm whatever you hoped. Interleave three runs and compare ranges.",
    },
    {
      question: "Why does an error count belong in every benchmark result?",
      options: [
        "Completeness",
        "An error is cheap, so an endpoint returning 500s under load reports higher throughput and reads as an improvement",
        "Errors slow the client",
        "It affects only the p99",
      ],
      correctIndex: 1,
      explanation:
        "40,000 req/sec with 39,000 non-2xx responses is a broken endpoint, and the throughput number alone looks like a triumph.",
    },
    {
      question: "With 990 requests at 25ms and 10 at 3000ms, what were the mean and the p99?",
      options: [
        "Mean 25ms, p99 3000ms",
        "Mean 57ms and p99 30ms, so the mean exceeded the p99 and no request took 57ms",
        "Both near 57ms",
        "Mean 3000ms, p99 25ms",
      ],
      correctIndex: 1,
      explanation:
        "An average is pulled between two populations by outliers and describes neither, which is why it can exceed the p99.",
    },
    {
      question: "Three dependencies each have a p99 of 100ms. What is your p99?",
      options: [
        "100ms",
        "Worse than 100ms, because a request is slow if any call is slow: about 3% hit at least one slow call",
        "300ms",
        "33ms",
      ],
      correctIndex: 1,
      explanation:
        "Simulated: one dependency is fast 99% of the time, three 97%, and ten only 90%. Fan-out degrades the tail.",
    },
    {
      question: "Why can you not average p95 values across instances?",
      options: [
        "Clock skew",
        "A percentile must be computed from the underlying distribution, so one instance serving one request and another a million gives a meaningless midpoint",
        "They are sampled differently",
        "You can",
      ],
      correctIndex: 1,
      explanation:
        "Aggregate histogram buckets. The same applies across time: twelve five-minute p95s do not average to an hourly p95.",
    },
    {
      question: "Why does a CPU profile of a database-bound endpoint look empty?",
      options: [
        "Sampling is too slow",
        "Waiting consumes no CPU, so 470ms of query time is nearly invisible and your 10ms of code looks like the whole story",
        "Database calls are excluded",
        "It needs a flag",
      ],
      correctIndex: 1,
      explanation:
        "Establish the fraction first with timers or traces, then profile only if the time is in Node.",
    },
    {
      question: "What was verified about `JSON.parse` and the event loop?",
      options: [
        "It yields between objects",
        "0.8MB took 2ms and 41MB took 173ms, with zero event loop ticks in every case",
        "It runs on the thread pool",
        "It is always fast",
      ],
      correctIndex: 1,
      explanation:
        "A megabyte costing 2ms means the danger is JSON whose size you do not control, so a body limit is the fix rather than a faster parser.",
    },
    {
      question: "How much slower was polymorphic property access, and how much in absolute terms?",
      options: [
        "10x, and it was 200ms",
        "2.58x, and 14ms across five million accesses, about 3ns each",
        "Unmeasurable",
        "100x",
      ],
      correctIndex: 1,
      explanation:
        "Real in a tight loop over a large array, invisible next to one database query. The same keys in a different order counts as a different shape.",
    },
    {
      question: "What did measuring `JSON.stringify` against `fast-json-stringify` show?",
      options: [
        "The compiled serialiser was 2x faster",
        "`JSON.stringify` was faster for that shape: 543ms against 834ms over 20,000 serialisations",
        "Identical",
        "It could not run",
      ],
      correctIndex: 1,
      explanation:
        "That corrects Days 15 and 16. Keep a response schema for Day 16's verified allowlist behaviour, not for speed.",
    },
    {
      question: "What did a field-stripping response schema cost?",
      options: [
        "Nothing",
        "22% fewer requests per second, since filtering 200 objects is work plain `stringify` never does, while sending 10KB less",
        "It doubled throughput",
        "Only memory",
      ],
      correctIndex: 1,
      explanation:
        "A real trade for a real security reason, and the opposite of a free performance win.",
    },
    {
      question: "Why set a compression threshold around 1KB?",
      options: [
        "Browsers ignore small bodies",
        "A verified 148-byte body gzips to 91 bytes, so you spend CPU on every small response for almost no saving",
        "gzip fails below 1KB",
        "It saves memory",
      ],
      correctIndex: 1,
      explanation:
        "The ratio also plateaus near 18x by about 15KB, so most of the benefit is on payloads worth compressing.",
    },
    {
      question: "What was measured about brotli at default quality?",
      options: [
        "A little slower than gzip",
        "867ms for 776KB, roughly 550x gzip's cost, which on a request path is an outage",
        "Faster than gzip",
        "It failed",
      ],
      correctIndex: 1,
      explanation:
        "Brotli belongs on static assets compressed once at build time, or at a much lower quality if you measure it.",
    },
    {
      question: "What is streaming's biggest practical win?",
      options: [
        "Lower CPU",
        "Time to first byte, so a slow export feels responsive rather than hung",
        "Smaller payloads",
        "Fewer queries",
      ],
      correctIndex: 1,
      explanation:
        "Memory matters too. Stream the query as well, or the database still hands you every row at once.",
    },
    {
      question: "What did `--max-old-space-size=256` report as the heap limit?",
      options: [
        "256MB",
        "448MB, because old space is one part of the heap and other regions are added on top",
        "1.5GB",
        "It errored",
      ],
      correctIndex: 1,
      explanation:
        "Verified alongside a 4288MB default sized from available memory. The number you pass is not the number you get.",
    },
    {
      question: "When is `--max-old-space-size` actually the right tool?",
      options: [
        "To fix a leak",
        "Lowered below the container's memory limit, so Node throws a catchable heap error with a stack instead of being SIGKILLed",
        "Raised on every deploy",
        "Never",
      ],
      correctIndex: 1,
      explanation:
        "Raising it for a leak turns a crash every two hours into a worse crash every sixteen.",
    },
    {
      question: "What does `cluster` share between workers?",
      options: [
        "Memory and the port",
        "Only the port. Every per-process bug from days 19, 21, 23, 24 and 25 returns identically to scaling out.",
        "Nothing",
        "The event loop",
      ],
      correctIndex: 1,
      explanation:
        "And it arrives without a deployment change to prompt you about shared state, which is what makes it a trap.",
    },
    {
      question: "Why do containers usually beat `cluster`?",
      options: [
        "Speed",
        "An orchestrator can restart, scale, roll out and health-check each one, while a wedged cluster worker is invisible because the primary answers the probe",
        "Less memory",
        "Simpler code",
      ],
      correctIndex: 1,
      explanation:
        "Cluster earns its place when you are handed a large machine and cannot run more containers on it.",
    },
    {
      question: "Why is outbound keep-alive easy to miss?",
      options: [
        "It is off everywhere",
        "The handshake cost is waiting rather than CPU, so a profiler attributes none of it to your code",
        "It affects HTTP/2 only",
        "It is a client concern",
      ],
      correctIndex: 1,
      explanation:
        "Time two consecutive calls: a much faster second one means the connection was reused.",
    },
    {
      question: "Given Node 10ms, Redis 5ms, database 470ms and network 15ms, what do you fix?",
      options: [
        "Cluster across four cores",
        "The database: an index, an N+1, or a cache. Nothing in this day addresses the 470ms.",
        "Compression",
        "The serialiser",
      ],
      correctIndex: 1,
      explanation:
        "The professional habit is not knowing more optimisations, it is refusing to start until you know which line of the breakdown you are working on.",
    },
  ],
  project: {
    name: "day-26",
    goal: "Take one endpoint from 500ms to under 100ms, and prove it with interleaved measurements rather than a single before-and-after run.",
    brief:
      "The trap in this project is that you will get a number quickly and it will be wrong. Run the same benchmark twice before changing anything, and you will very likely see a spread of tens of percent, which means your first apparent improvement is inside the noise. So the discipline is the deliverable: three interleaved runs, all four numbers recorded, and a breakdown that tells you which part of the request you are even working on. Most of the fixes in this project are from earlier days, which is the point.",
    steps: [
      "Create `day-26/` with `\"type\": \"module\"` and install `fastify`, `autocannon`, `drizzle-orm` and `pg`. Seed at least 200,000 rows.",
      "Write an endpoint that joins three tables, has no index on the join column, returns every row, and does some CPU work per row.",
      "Run autocannon twice with no changes and record both results. Write down the spread as a percentage.",
      "Now record all four numbers for a baseline: req/sec, p50, p95, p99, errors and bytes per response.",
      "Add phase timers to the handler and log the breakdown, then state which phase you will work on and why.",
      "Run `node --cpu-prof`, generate load, and open the profile. Note whether the database time appears in it.",
      "Read the inverted view and record the top three functions by self time.",
      "Add the missing index, then measure again with three interleaved runs against the previous version.",
      "Record whether the ranges overlap, and say whether you have demonstrated an improvement.",
      "Add a `LIMIT` and pagination, and measure the change in bytes per response as well as latency.",
      "Add `monitorEventLoopDelay` and record p50, p99 and max under load.",
      "Add a deliberate `JSON.parse` of a 40MB payload on a route, hit it once under load, and record what happened to the loop delay and to the p99 of every other endpoint.",
      "Add a body limit and confirm the route now rejects the payload instead.",
      "Benchmark `JSON.stringify` against `fast-json-stringify` on your actual response shape, 20,000 iterations each after warm-up, and record the ratio.",
      "Add a response schema and measure the HTTP throughput three times interleaved against the version without one.",
      "State whether your measurement supports a performance claim either way, and what the schema is actually for.",
      "Measure gzip size and time for your response at 1KB, 15KB and 500KB, and find where the ratio plateaus.",
      "Measure brotli at default quality on the same payloads and record the cost ratio against gzip.",
      "Add compression with a 1KB threshold and confirm small responses are not compressed.",
      "Convert an export endpoint to stream from a database cursor, and measure time to first byte before and after.",
      "Confirm your compression layer does not buffer the streamed route.",
      "Log `v8.getHeapStatistics().heap_size_limit`, then run with `--max-old-space-size=256` and log it again. Record both.",
      "Write a deliberate leak, run it under a 256MB old-space limit with `--heapsnapshot-near-heap-limit=2`, and confirm you get a snapshot rather than a bare SIGKILL.",
      "Add an in-memory rate limiter and an in-memory cache, then run the app under `cluster` with four workers.",
      "Send 100 requests and record how many the rate limiter allowed against what you configured.",
      "Invalidate a cache entry and confirm the other three workers still serve the old value.",
      "Add signal handling to the cluster primary and confirm `SIGTERM` drains workers rather than orphaning them.",
      "Move both to Redis and repeat the two tests.",
      "Write the final report: the baseline four numbers, the breakdown, each change, and the interleaved measurements for each.",
    ],
    acceptance: [
      "You have the spread between two unchanged runs written down as a percentage.",
      "Baseline and final results each record req/sec, p50, p95, p99, errors and bytes per response.",
      "Your breakdown shows which phase dominated, and your first change targeted that phase.",
      "You can state whether database time appeared in the CPU profile, and why.",
      "Every claimed improvement has three interleaved runs behind it, and you say for each whether the ranges overlap.",
      "At least one change was reverted or declared unproven because it fell inside the noise.",
      "You have loop delay numbers under load, and the effect of a 40MB parse on other endpoints' p99.",
      "A body limit rejects the oversized payload.",
      "You have your own `JSON.stringify` versus `fast-json-stringify` ratio for your real payload shape.",
      "You state whether your response-schema measurement supports a performance claim, and what the schema is for regardless.",
      "You have gzip sizes and times at three payload sizes and can point at where the ratio plateaus.",
      "You have your own brotli-to-gzip cost ratio and a decision about where brotli belongs.",
      "Small responses are not compressed.",
      "Time to first byte is recorded before and after streaming the export.",
      "You have both heap limit numbers, default and with the flag, and can explain the difference.",
      "A near-heap-limit snapshot exists rather than a bare exit 137.",
      "Under cluster, the in-memory rate limiter allowed roughly four times its configured limit, and three workers served a stale cache entry.",
      "Both are fixed after moving to Redis, and `SIGTERM` drains the cluster.",
      "The final report ties every change to a measurement.",
      "`npx tsc --noEmit` passes if you used TypeScript, and `node --test` passes.",
    ],
    stretch: [
      "Run the load generator from a second machine and compare the ceiling with your single-machine result.",
      "Add a simulated 40ms network delay and recompute what your local improvements are worth to a real user.",
      "Simulate three dependencies at 99% fast and measure your end-to-end p99, then repeat with ten.",
      "Build a flame graph before and after your index change and describe how the shape differed.",
      "Benchmark a monomorphic and a polymorphic version of your hottest loop and record the ratio.",
      "Compare `cluster` with four containers behind a load balancer on the same machine, on throughput and on rolling-restart behaviour.",
      "Add `undici` with an explicit agent and measure the difference in a third-party call with and without connection reuse.",
      "Set a container memory limit and find the `--max-old-space-size` value that reliably produces a heap error rather than a SIGKILL.",
      "Add a histogram metric and confirm you can compute a correct p95 across two instances.",
      "Write a test that fails if any route lacks a body limit or a pagination bound.",
    ],
  },
};
