import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_31_LESSONS: LessonDay = {
  day: 31,
  title: "Semantic search — Scout, pgvector & hybrid ranking",
  totalMinutes: 93,
  difficulty: "Advanced",
  lessons: [
    {
      id: "scout-and-search-engines",
      title: "Laravel Scout & why search engines exist",
      durationMinutes: 11,
      explanation: "Today is about getting from text search to meaning search, and knowing when that is a downgrade.\n\n```text\ntraditional   \"Laravel queues\" → match words → documents with those words\n\nsemantic      \"how do I run work in the background?\"\n              → understand meaning → vector similarity\n              → the Laravel queue documentation\n```\n\n<b>The senior skill is not building semantic search.</b> It is knowing when it helps and when it makes your search worse, which it very often does.\n\n---\n\n### 1. Basic — Scout\n\nScout makes an Eloquent model searchable:\n\n```php\nclass Product extends Model\n{\n    use Searchable;\n}\n```\n\n```php\nProduct::search('MacBook')->get();\n```\n\n```text\nwithout Scout   controller → Eloquent → LIKE query → database\nwith Scout      model → Scout → search engine\n```\n\n<b>The benefit is that your application does not learn a search engine's query language.</b> The same `search()` call works whether the driver is your database or a dedicated engine, so the decision is reversible.\n\n---\n\n### 2. Intermediate — why not just use the database?\n\nYour database is excellent at:\n\n```text\nCRUD · relationships · transactions · constraints\n```\n\nA search engine is built for:\n\n```text\ntext search · ranking · typo tolerance\nautocomplete · facets · filters · large indexes\n```\n\n<b>Ranking is the one people underestimate.</b> `LIKE '%laptop%'` gives you rows that contain the word, in whatever order the database felt like. It has no concept of one result being <b>better</b> than another. A search engine scores every match: a term in the title beats a term buried in paragraph nine, a rare word counts for more than a common one, and two matching terms beat one.\n\n<b>And typo tolerance is what users actually experience.</b> `LIKE '%macbok%'` returns nothing. A real search engine returns MacBooks, and the user never knows they made a mistake.\n\n---\n\n### 3. Advanced — the split, and its cost\n\n```text\nPostgreSQL      your application data, the source of truth\nsearch engine   a searchable representation of it\n```\n\n<b>That is two copies of your data</b>, and everything awkward about search follows from it.\n\n<b>The index goes stale.</b> Scout syncs on save, which means a direct SQL update, a mass `update()` on a query builder, or a migration that rewrites a column all change the database without telling the index. Your search then confidently returns a product whose price changed last week.\n\n<b>The index can be down while your app is fine.</b> So `Product::search(...)` must have an answer for \"the engine is unreachable\", and that answer is usually a degraded database search rather than a 500 on your busiest page.\n\n<b>And deletes matter more than writes.</b> A stale price is embarrassing; a deleted record still appearing in search results is a data leak with a nice interface on it. Confirm your delete path removes from the index, especially for soft deletes, where the row still exists.\n\nThe honest summary: <b>you do not need a search engine because you have a search box.</b> You need one when ranking, typo tolerance or facets are the difference between users finding things and giving up.",
      diagram: `The day in one picture

  TRADITIONAL
    "Laravel queues"
      ↓  match words
    documents containing those words

  SEMANTIC
    "how do I run work in the background?"
      ↓  understand meaning
      ↓  vector similarity
    the Laravel queue documentation

  The senior skill is NOT building semantic search.
  It is knowing when it helps and when it makes your
  search worse — which it very often does.


Scout

    class Product extends Model { use Searchable; }

    Product::search('MacBook')->get();

    without   controller → Eloquent → LIKE → database
    with      model → Scout → search engine

  Your application never learns a search engine's
  query language, so the decision stays reversible.


Why not just the database?

    the database is great at
      CRUD · relationships · transactions · constraints

    a search engine is built for
      text search · RANKING · typo tolerance
      autocomplete · facets · filters · large indexes

  RANKING is the underestimated one:

    LIKE '%laptop%' returns rows containing the word,
    in whatever order the database felt like. It has
    no concept of one result being BETTER.

    A search engine scores every match:
      title beats paragraph nine
      a rare word counts more than a common one
      two matching terms beat one

  TYPO TOLERANCE is what users actually experience:

    LIKE '%macbok%'  → nothing
    search engine    → MacBooks, and the user never
                       knows they mistyped


  ⚠️  The split, and its cost

      PostgreSQL      source of truth
      search engine   a COPY, shaped for searching

      Two copies of your data. Everything awkward
      about search follows from that.

    The index goes STALE
      Scout syncs on save — so a raw SQL update, a
      mass update() on a builder, or a migration
      rewriting a column changes the database and
      not the index

    The index can be DOWN while your app is fine
      search() needs an answer for "engine
      unreachable", and it should be a degraded
      database search, not a 500 on your busiest page

    DELETES matter more than writes
      a stale price is embarrassing
      a deleted record still in search results is a
      data leak with a nice interface on it
      (watch soft deletes — the row still exists)


  You do not need a search engine because you have a
  search box. You need one when ranking, typo
  tolerance or facets decide whether users find
  things or give up.`,
      codeExample: {
        title: "Making a model searchable, and the parts nobody mentions",
        code: `<?php

namespace App\\Models;

use Laravel\\Scout\\Searchable;

class Product extends Model
{
    use Searchable;

    // What actually goes into the index — not the whole row
    public function toSearchableArray(): array
    {
        return [
            'id'          => (int) $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'brand'       => $this->brand->name,        // denormalised on purpose
            'price_cents' => (int) $this->price_cents,   // for filtering
            'in_stock'    => (bool) $this->in_stock,
            'team_id'     => (int) $this->team_id,       // for scoping
        ];
    }

    // Do not index what should not be findable
    public function shouldBeSearchable(): bool
    {
        return $this->published_at !== null && ! $this->trashed();
    }
}


<?php
// ---------- Searching ----------

Product::search('MacBook')->get();
Product::search('MacBook')->paginate(20);
Product::search('MacBook')->where('team_id', $user->team_id)->get();


<?php
// ---------- ⚠️ What silently does NOT update the index ----------

// Scout syncs on model events. These skip them:

DB::table('products')->where('id', 5)->update(['price_cents' => 999]);   // raw
Product::where('discontinued', true)->update(['in_stock' => false]);     // mass
// and any migration that rewrites a column

// Your search now confidently returns last week's price.

// The fix — be explicit when you bypass Eloquent:
Product::where('discontinued', true)->update(['in_stock' => false]);
Product::where('discontinued', true)->searchable();      // re-index them


<?php
// ---------- Deletes matter more than writes ----------

// A stale price is embarrassing.
// A deleted record still appearing is a data leak.

$product->delete();          // Scout removes it — good

// Soft deletes: the row still exists, so be explicit
class Product extends Model
{
    use SoftDeletes, Searchable;

    public function shouldBeSearchable(): bool
    {
        return ! $this->trashed();
    }
}

// config/scout.php
'soft_delete' => false,      // do not index trashed records at all


<?php
// ---------- The engine can be down while your app is fine ----------

class ProductSearch
{
    public function search(string $query, User $user): Collection
    {
        try {
            return Product::search($query)
                ->where('team_id', $user->team_id)
                ->take(50)
                ->get();
        } catch (SearchEngineUnavailable $e) {
            report($e);

            // Degraded, not broken. A 500 on your busiest
            // page is a worse outcome than mediocre ranking.
            return Product::query()
                ->where('team_id', $user->team_id)
                ->where('name', 'like', "%{$query}%")
                ->limit(50)
                ->get();
        }
    }
}


# ---------- What ranking buys you ----------

# LIKE '%laptop%'
#   → rows containing "laptop", in arbitrary order
#   → no concept of one result being better
#
# search('laptop')
#   → title match ranks above a mention in paragraph 9
#   → a rare term counts more than a common one
#   → 'macbok' still finds MacBooks`,
      },
      keyTakeaways: [
        "<b>Scout makes an Eloquent model searchable</b> with `use Searchable` and `Model::search(...)`.",
        "<b>Your application never learns a search engine's query language</b>, so the choice stays reversible.",
        "<b>Databases are built for CRUD, relationships, transactions and constraints.</b>",
        "<b>Search engines are built for ranking, typo tolerance, autocomplete, facets and large indexes.</b>",
        "<b>Ranking is the underestimated part</b>: `LIKE` has no notion of one result being better than another.",
        "<b>Typo tolerance is what users actually experience</b>: `LIKE '%macbok%'` returns nothing.",
        "<b>An index is a second copy of your data</b>, and every awkward thing about search follows from that.",
        "<b>Raw SQL, mass updates and migrations bypass Scout's sync</b> and silently leave the index stale.",
        "<b>Deletes matter more than writes</b>: a deleted record still in search results is a leak.",
        "<b>Soft deletes need explicit handling</b>, because the row still exists.",
        "<b>Search must degrade rather than 500</b> when the engine is unreachable.",
        "<b>A search box is not a reason to add a search engine</b>; ranking, typos and facets are.",
      ],
      commonMistakes: [
        "<b>Assuming every write updates the index.</b> Raw SQL and mass updates do not fire model events.",
        "<b>Indexing soft-deleted records.</b> They come back in results after being deleted.",
        "<b>Indexing the whole model.</b> Pick fields deliberately, including what you will filter on.",
        "<b>No fallback when the engine is down.</b> A search outage becomes a site outage.",
        "<b>Adding a search engine for a small dataset.</b> A second service and a sync problem you did not need.",
      ],
      quiz: [
        {
          question: "What does Scout give you architecturally?",
          options: [
            "A faster database",
            "A common interface so your application never learns a search engine's query language",
            "Automatic embeddings",
            "Free hosting",
          ],
          correctIndex: 1,
          explanation: "Which is what makes the driver choice reversible.",
        },
        {
          question: "What does a search engine offer that `LIKE` cannot?",
          options: [
            "Transactions",
            "Ranking and typo tolerance: better matches first, and `macbok` still finds MacBooks",
            "Constraints",
            "Relationships",
          ],
          correctIndex: 1,
          explanation: "`LIKE` has no concept of one result being better than another.",
        },
        {
          question: "Which operations silently leave the search index stale?",
          options: [
            "All model saves",
            "Raw SQL updates, mass `update()` on a builder, and migrations rewriting columns",
            "Deletes",
            "None",
          ],
          correctIndex: 1,
          explanation: "Scout syncs on model events, which those bypass.",
        },
        {
          question: "Why do stale deletes matter more than stale updates?",
          options: [
            "They are harder to fix",
            "A deleted record still appearing in search is a data leak, not just wrong data",
            "They break pagination",
            "They do not",
          ],
          correctIndex: 1,
          explanation: "Soft deletes especially, since the row still exists.",
        },
      ],
    },
    {
      id: "scout-drivers",
      title: "Scout drivers — database, Meilisearch, Algolia, Typesense",
      durationMinutes: 11,
      explanation: "One interface, several engines behind it.\n\n```text\n              Scout\n     ┌──────────┼──────────┐\n  database  Meilisearch  Algolia\n                        Typesense\n```\n\n---\n\n### 1. Basic — the database driver\n\nThe simplest start: search stays inside the database you already run.\n\n```text\nsmall application · moderate search needs · simple infrastructure\n```\n\n<b>You do not need another service just because you have a search box.</b> A second service means another thing to deploy, monitor, back up, secure and keep in sync, and for a few thousand rows it buys you very little.\n\n<b>Start here.</b> Scout's interface is the same, so moving later is a config change plus a re-import, not a rewrite. That is the entire point of the abstraction.\n\n---\n\n### 2. Intermediate — the dedicated engines\n\n<b>Meilisearch</b> is built for fast, user-friendly search: product search, documentation, autocomplete, typo tolerance. Self-hosted, one binary, sensible defaults. <b>For most applications outgrowing the database driver, this is the answer.</b>\n\n<b>Algolia</b> is hosted, so somebody else operates the cluster. Attractive when search is a major product feature and you do not want to run infrastructure. <b>The trade is cost, which is usage-based and scales with your traffic</b>, so model it before you commit.\n\n<b>Typesense</b> is the third option, similar in shape to Meilisearch, self-hosted or cloud.\n\n<b>The lesson is not the driver list.</b> It is that Scout gives you a common interface while the driver does the work.\n\n---\n\n### 3. Advanced — what the abstraction does not cover\n\n<b>The searching is portable. The configuration is not.</b>\n\nRanking rules, synonyms, stop words, typo tolerance settings, faceting and filterable attributes are all engine-specific, and they live in each engine's own configuration rather than in Scout. <b>So the switch is a config change plus a re-import plus rebuilding all of that tuning</b>, which is where the real time goes.\n\nThree things worth knowing before you pick.\n\n<b>The database driver does not do typo tolerance or real ranking.</b> If your users mistype, and they do, you have already outgrown it. That, not row count, is usually the signal.\n\n<b>Index size and memory.</b> Meilisearch and Typesense keep indexes largely in memory, so a very large corpus is a hosting decision, not just a `composer require`.\n\n<b>And the sync path matters more than the engine.</b> Scout can queue index updates, and in production it should: an inline index write means your product save now depends on the search engine being up. <b>Queue it, and a search outage stops being a write outage.</b>\n\nOne practical note on choosing: <b>the correct question is not which engine is best, but whether you need one at all yet.</b> Most applications reach for a search engine well before their search is bad enough to justify it.",
      diagram: `One interface, several engines

                  Scout
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    database   Meilisearch   Algolia
                             Typesense


The database driver

    small application · moderate search needs
    simple infrastructure

  You do not need another service just because you
  have a search box. A second service is another
  thing to deploy, monitor, back up, secure and keep
  in sync.

  START HERE. Moving later is a config change plus a
  re-import, not a rewrite. That is the entire point
  of the abstraction.


The dedicated engines

  Meilisearch   fast, user-friendly, typo-tolerant
                self-hosted, one binary, good defaults
                → for most apps outgrowing the
                  database driver, this is the answer

  Algolia       hosted; somebody else runs the cluster
                good when search IS the product
                ⚠️ usage-based cost that scales with
                   your traffic — model it first

  Typesense     similar shape to Meilisearch,
                self-hosted or cloud

  The lesson is not the driver list. It is that Scout
  gives you a common interface while the driver does
  the work.


  ⚠️  What the abstraction does NOT cover

      The SEARCHING is portable.
      The CONFIGURATION is not.

        ranking rules · synonyms · stop words
        typo tolerance settings · faceting
        filterable attributes

      All engine-specific, all living in the engine's
      own config rather than in Scout.

      So a switch is: config change + re-import +
      REBUILDING ALL THAT TUNING. That last part is
      where the time goes.


Three things before you pick

  The database driver has no typo tolerance and no
  real ranking

    if your users mistype — and they do — you have
    already outgrown it
    that, not row count, is usually the signal

  Index size is a MEMORY decision

    Meilisearch and Typesense hold indexes largely in
    memory; a very large corpus is a hosting
    decision, not a composer require

  The SYNC PATH matters more than the engine

    inline index writes mean your product save now
    depends on the search engine being up

      queue it → a search outage stops being a
                 write outage


  The right question is not which engine is best.
  It is whether you need one AT ALL yet. Most apps
  reach for one long before their search is bad
  enough to justify it.`,
      codeExample: {
        title: "Choosing a driver, and queueing the sync",
        code: `# ---------- config/scout.php ----------

'driver' => env('SCOUT_DRIVER', 'database'),

# Queue index updates. In production this is not optional:
# inline writes make your product save depend on the
# search engine being up.
'queue' => [
    'connection' => 'redis',
    'queue'      => 'scout',
],

'chunk' => [
    'searchable'   => 500,
    'unsearchable' => 500,
],


# ---------- Start here ----------

SCOUT_DRIVER=database

# No second service to deploy, monitor, back up or
# secure. For a few thousand rows it buys very little.


# ---------- Outgrown it? ----------

composer require meilisearch/meilisearch-php http-interop/http-factory-guzzle

SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey

php artisan scout:import "App\\Models\\Product"

# The application code did not change. That is the
# whole point of the abstraction.


<?php
// ---------- What does NOT move with you ----------

// config/scout.php — Meilisearch-specific tuning
'meilisearch' => [
    'index-settings' => [
        Product::class => [
            'filterableAttributes' => ['brand', 'price_cents', 'in_stock', 'team_id'],
            'sortableAttributes'   => ['price_cents', 'created_at'],
            'searchableAttributes' => ['name', 'description', 'brand'],  // order = weight
            'rankingRules' => [
                'words', 'typo', 'proximity', 'attribute', 'exactness',
                'price_cents:asc',
            ],
            'synonyms' => [
                'laptop' => ['notebook', 'macbook'],
                'phone'  => ['mobile', 'smartphone'],
            ],
            'stopWords' => ['the', 'a', 'of'],
        ],
    ],
],

php artisan scout:sync-index-settings

// None of this is portable. Switching engines means
// rebuilding every one of these rules in the new
// engine's own vocabulary — which is where the real
// time goes, not the config change.


<?php
// ---------- The signal that you have outgrown the database driver ----------

// Database driver
Product::search('macbok')->get();     // → nothing

// Meilisearch
Product::search('macbok')->get();     // → MacBooks

// It is usually typos and ranking that force the move,
// not row count.


<?php
// ---------- Filtering differs per engine ----------

// Meilisearch / Typesense
Product::search('laptop')
    ->where('in_stock', true)
    ->whereIn('brand', ['Apple', 'Dell'])
    ->get();

// Algolia
Product::search('laptop', function ($algolia, $query, $options) {
    $options['filters'] = 'in_stock=1 AND price_cents < 100000';

    return $algolia->search($query, $options);
})->get();

// Scout normalises the common cases. Anything
// engine-specific leaks through the callback — and
// that callback does not survive a driver change.


# ---------- Hosting reality ----------

# Meilisearch and Typesense keep indexes largely in
# memory. A 20M-document corpus is a hosting decision,
# not a composer require.
#
# Algolia removes that problem and adds a usage-based
# bill that scales with your traffic. Model it before
# you commit.`,
      },
      keyTakeaways: [
        "<b>Scout supports a database driver plus Meilisearch, Algolia and Typesense.</b>",
        "<b>Start with the database driver.</b> A search box is not a reason to run another service.",
        "<b>Moving later is a config change and a re-import</b>, which is exactly what the abstraction is for.",
        "<b>Meilisearch is the usual answer</b> when you outgrow the database driver: self-hosted, fast, typo-tolerant.",
        "<b>Algolia is hosted</b>, good when search is the product, with usage-based cost that scales with traffic.",
        "<b>The searching is portable; the configuration is not.</b>",
        "<b>Ranking rules, synonyms, stop words and facets are engine-specific</b> and must be rebuilt on a switch.",
        "<b>The database driver has no typo tolerance or real ranking</b>, and that is usually the signal to move.",
        "<b>Meilisearch and Typesense hold indexes in memory</b>, so a large corpus is a hosting decision.",
        "<b>Queue your index updates</b>, or a search-engine outage becomes a write outage.",
        "<b>The right question is whether you need an engine yet</b>, not which one is best.",
      ],
      commonMistakes: [
        "<b>Adding a search service on day one.</b> Another thing to deploy, monitor, secure and keep in sync.",
        "<b>Expecting a driver switch to be free.</b> Ranking rules and synonyms do not travel with you.",
        "<b>Syncing the index inline.</b> Every product save now depends on the search engine being up.",
        "<b>Choosing Algolia without modelling cost.</b> Usage-based pricing grows exactly as your traffic does.",
        "<b>Judging readiness by row count.</b> Typos and bad ranking are the real signal.",
      ],
      quiz: [
        {
          question: "Which driver should most applications start with?",
          options: [
            "Algolia",
            "The database driver, since a search box alone does not justify another service",
            "Meilisearch",
            "Typesense",
          ],
          correctIndex: 1,
          explanation: "Moving later is a config change plus a re-import.",
        },
        {
          question: "What does Scout's abstraction not cover?",
          options: [
            "Searching",
            "Engine-specific configuration: ranking rules, synonyms, stop words and facets",
            "Pagination",
            "Indexing",
          ],
          correctIndex: 1,
          explanation: "Rebuilding that tuning is where a driver switch actually costs you.",
        },
        {
          question: "What usually signals you have outgrown the database driver?",
          options: [
            "Row count",
            "Typos returning nothing and results arriving in no useful order",
            "Disk usage",
            "Query volume",
          ],
          correctIndex: 1,
          explanation: "`LIKE '%macbok%'` returns nothing, and users mistype constantly.",
        },
        {
          question: "Why queue Scout index updates in production?",
          options: [
            "For speed only",
            "Inline writes make every model save depend on the search engine being up",
            "Queues are required",
            "To batch requests",
          ],
          correctIndex: 1,
          explanation: "Queued, a search outage stops being a write outage.",
        },
      ],
    },
    {
      id: "indexing-pagination-and-filters",
      title: "Importing, flushing, pagination & filters",
      durationMinutes: 12,
      explanation: "The operational half of search, which is where most of the surprises live.\n\n---\n\n### 1. Basic — importing\n\nYour database has data. Your index does not.\n\n```text\ndatabase → scout:import → search index\n```\n\n```bash\nphp artisan scout:import \"App\\Models\\Product\"\nphp artisan scout:flush \"App\\Models\\Product\"\n```\n\n<b>Flush then import is the standard rebuild</b>, and you need it when:\n\n```text\nsearchable fields changed\nindex configuration changed\ndata drifted out of sync\n```\n\n---\n\n### 2. Intermediate — the rebuild problem\n\nHere is the part that bites in production: <b>flush deletes the index, and import takes minutes.</b> In between, your search returns nothing.\n\n```text\nflush → [ search is empty for 8 minutes ] → import\n```\n\nOn a live site that is an outage you scheduled yourself.\n\n<b>The fix is an index alias</b>: build a new index alongside the old one, then swap the alias atomically when it is complete. Users search the old index right up until the moment they search the new one. If your engine does not support that, rebuild during your quietest hour and know exactly how long it takes, because you will need that number under pressure.\n\n<b>And import is not free either.</b> It reads every row and writes every document, which is real load on both systems. Chunk it, run it off-peak, and watch memory: `scout:import` with eager-loaded relations on a large table is a classic out-of-memory kill.\n\n---\n\n### 3. Advanced — pagination and filters\n\nSearch results need ordinary UX:\n\n```text\nsearch → ranking → pagination → response\n```\n\n```php\nProduct::search('laptop')->paginate(20);\n```\n\n<b>But search pagination is not database pagination.</b> Two differences that catch people.\n\n<b>Engines cap total results.</b> Most refuse to paginate past a few thousand hits, because deep pagination in a ranked index is expensive and nobody visits page 400. Your UI has to handle \"no more results\" rather than assuming every page exists.\n\n<b>And the index shifts under the user.</b> Between page one and page two, a product is added and the ranking changes, so an item can appear twice or never. Cursor pagination helps; accepting it is usually fine for search, where nobody expects a stable list.\n\nThen filters. Real search is never just a keyword:\n\n```text\n\"laptop\" + brand: Apple + price: 1000–2000 + in stock\n```\n\n```text\nkeyword + filters + ranking + pagination\n```\n\n<b>Two rules.</b>\n\n<b>Filter in the engine, not in PHP.</b> Fetching a hundred results and filtering the collection breaks your counts, your pagination and your ranking all at once. The engine has to know the filterable attributes up front, which is why the index configuration from the last lesson matters.\n\n<b>And scope in the query, not the interface.</b> A multi-tenant search must filter by tenant inside the search call. This is exactly the tool-scoping rule from Day 30: if the constraint lives anywhere except the query, something will eventually return another customer's data.",
      diagram: `Importing

    database → scout:import → search index

    php artisan scout:import "App\\Models\\Product"
    php artisan scout:flush  "App\\Models\\Product"

  Flush + import is the standard rebuild. You need it
  when searchable fields changed, index config
  changed, or data drifted.


  ⚠️  Flush DELETES the index. Import takes minutes.

      flush → [ search returns NOTHING for 8 min ]
            → import

      On a live site that is an outage you scheduled
      yourself.

      The fix: an INDEX ALIAS

        build products_v2 alongside products_v1
        swap the alias atomically when complete

        users search the old index right up until
        they search the new one

      No alias support? Rebuild in your quietest hour
      and KNOW HOW LONG IT TAKES — you will need that
      number under pressure.

  And import is not free: every row read, every
  document written, real load on both systems.
  Chunk it, run it off-peak, and watch memory —
  scout:import with eager-loaded relations on a big
  table is a classic OOM kill.


Pagination

    search → ranking → pagination → response

    Product::search('laptop')->paginate(20);

  ⚠️  Search pagination is NOT database pagination.

      Engines CAP total results
        most refuse to paginate past a few thousand
        hits — deep pagination in a ranked index is
        expensive and nobody visits page 400
        → your UI must handle "no more results"

      The index SHIFTS under the user
        between page 1 and page 2 a product is added,
        ranking changes, an item appears twice or
        never
        → cursor pagination helps; accepting it is
          usually fine, nobody expects search to be
          a stable list


Filters — real search is never just a keyword

    "laptop"
      + brand: Apple
      + price: 1000–2000
      + in stock

    keyword + filters + ranking + pagination

  Two rules:

    FILTER IN THE ENGINE, not in PHP

      fetching 100 results and filtering the
      collection breaks your counts, your pagination
      AND your ranking, all at once

      the engine must know filterable attributes up
      front — which is why index configuration matters

    SCOPE IN THE QUERY, not the interface

      multi-tenant search filters by tenant INSIDE
      the search call

      exactly Day 30's tool-scoping rule: a
      constraint that lives anywhere but the query
      will eventually return another customer's data`,
      codeExample: {
        title: "Rebuilds without downtime, and filters that hold",
        code: `# ---------- The commands ----------

php artisan scout:import "App\\Models\\Product"
php artisan scout:flush  "App\\Models\\Product"
php artisan scout:sync-index-settings

# ❌ The naive rebuild, on a live site
php artisan scout:flush "App\\Models\\Product"    # search now returns nothing
php artisan scout:import "App\\Models\\Product"   # ...for the next 8 minutes


<?php
// ---------- ✅ Build alongside, then swap ----------

class RebuildProductIndex extends Command
{
    protected $signature = 'products:reindex';

    public function handle(): int
    {
        $new = 'products_' . now()->format('YmdHis');

        // Build the new index while the old one keeps serving
        Product::query()
            ->with('brand')
            ->chunkById(500, function ($products) use ($new) {
                $products->searchableUsing(app(EngineManager::class)->engine())
                         ->searchableOn($new);
            });

        // Atomic swap: users search the old index right up
        // until they search the new one
        $this->engine->swapAlias('products', $new);

        $this->info("Swapped alias to {$new}.");

        return self::SUCCESS;
    }
}

// chunkById, not all() — scout:import with eager-loaded
// relations on a large table is a classic OOM kill.


<?php
// ---------- Pagination, with the caps acknowledged ----------

class ProductSearchController
{
    public function index(SearchRequest $request)
    {
        $results = Product::search($request->validated('q'))
            // Scope in the QUERY. Day 30's rule, again.
            ->where('team_id', $request->user()->team_id)
            ->where('in_stock', true)
            ->whereIn('brand', $request->validated('brands', []))
            ->paginate(20);

        return ProductResource::collection($results);
    }
}

// Engines cap total hits — most refuse to paginate past
// a few thousand. The UI must handle "no more results"
// rather than assuming page 400 exists.


<?php
// ---------- ❌ Filtering in PHP breaks three things at once ----------

$results = Product::search($query)->take(100)->get()
    ->filter(fn ($p) => $p->price_cents < 100000)
    ->filter(fn ($p) => $p->team_id === $user->team_id);   // ← and a leak risk

// The total count is wrong.
// The pagination is wrong.
// The ranking is wrong — you kept the top 100 by
// relevance, then threw most away, so page 2 is
// arbitrary.

// ✅ Filter in the engine
Product::search($query)
    ->where('team_id', $user->team_id)
    ->where('price_cents', '<', 100000)
    ->paginate(20);


<?php
// ---------- Which requires declaring them filterable ----------

// config/scout.php
'meilisearch' => [
    'index-settings' => [
        Product::class => [
            'filterableAttributes' => ['team_id', 'brand', 'price_cents', 'in_stock'],
            'sortableAttributes'   => ['price_cents', 'created_at'],
        ],
    ],
],

php artisan scout:sync-index-settings

// A ->where() on an attribute the engine does not know
// is filterable fails at query time, in production,
// on the one filter nobody tested.


<?php
// ---------- Keeping the index honest ----------

// After any operation that bypasses model events
Product::where('discontinued', true)->update(['in_stock' => false]);
Product::where('discontinued', true)->searchable();

// A nightly consistency check is cheap insurance
Schedule::command('products:reindex')->weeklyOn(0, '03:00')->onOneServer();`,
      },
      keyTakeaways: [
        "<b>`scout:import` populates the index; `scout:flush` empties it.</b>",
        "<b>Flush then import is the standard rebuild</b>, needed when fields, configuration or data change.",
        "<b>On a live site that sequence is a self-inflicted outage</b>, because search returns nothing in between.",
        "<b>Build a new index alongside the old and swap an alias</b>, so users never see an empty index.",
        "<b>Without alias support, rebuild off-peak and know exactly how long it takes.</b>",
        "<b>Import is real load on both systems</b>, so chunk it and watch memory with eager-loaded relations.",
        "<b>Search pagination is not database pagination.</b>",
        "<b>Engines cap total hits</b>, so your UI must handle \"no more results\" rather than assuming a page exists.",
        "<b>The index shifts between pages</b>, so items can appear twice or not at all.",
        "<b>Filter in the engine, never in PHP</b>, or you break counts, pagination and ranking together.",
        "<b>Attributes must be declared filterable</b> in the engine's configuration first.",
        "<b>Scope multi-tenant search inside the query</b>, exactly as with AI tools.",
      ],
      commonMistakes: [
        "<b>Running flush then import on a live site.</b> Search is empty for the whole import.",
        "<b>Importing with `all()` or heavy eager loading.</b> The command dies partway with an OOM.",
        "<b>Filtering the result collection in PHP.</b> Wrong counts, wrong pages, wrong ranking.",
        "<b>Filtering on an attribute the engine does not know is filterable.</b> It fails at query time in production.",
        "<b>Assuming search pagination behaves like the database.</b> Caps and shifting results are normal.",
        "<b>Scoping tenants outside the search call.</b> One missed filter returns another customer's data.",
      ],
      quiz: [
        {
          question: "Why is flush-then-import dangerous on a live site?",
          options: [
            "It is slow",
            "The index is empty for the whole import, so search returns nothing for minutes",
            "It corrupts data",
            "It locks the database",
          ],
          correctIndex: 1,
          explanation: "Build a new index alongside and swap an alias instead.",
        },
        {
          question: "What breaks when you filter search results in PHP?",
          options: [
            "Nothing",
            "Counts, pagination and ranking all at once, since you discard part of a ranked page",
            "Only the count",
            "Only performance",
          ],
          correctIndex: 1,
          explanation: "Filter in the engine, with attributes declared filterable.",
        },
        {
          question: "How does search pagination differ from database pagination?",
          options: [
            "It does not",
            "Engines cap total hits, and results shift between pages as the index changes",
            "It is always faster",
            "It cannot be cursor-based",
          ],
          correctIndex: 1,
          explanation: "The UI must handle \"no more results\" and occasional duplicates.",
        },
        {
          question: "Where must a multi-tenant constraint live?",
          options: [
            "In the UI",
            "Inside the search query itself",
            "In a middleware",
            "In the index settings",
          ],
          correctIndex: 1,
          explanation: "Same rule as scoping AI tools on Day 30.",
        },
      ],
    },
    {
      id: "keyword-vs-semantic",
      title: "Keyword search vs semantic search",
      durationMinutes: 11,
      explanation: "The distinction the rest of the day depends on.\n\n---\n\n### 1. Basic — two different questions\n\n<b>Keyword search asks:</b>\n\n```text\nquery:  \"Laravel queue\"\nsearch: does this document contain these words?\n```\n\n<b>Semantic search asks:</b>\n\n```text\nquery:  \"how can I run expensive work in the background?\"\nsearch: which documents mean something similar?\n```\n\n<b>One matches characters. The other matches meaning.</b>\n\nAnd notice the second query contains none of the words in your documentation. Not \"queue\", not \"job\", not \"dispatch\". <b>Keyword search has nothing to work with.</b>\n\n---\n\n### 2. Intermediate — how meaning becomes a number\n\n```text\n\"Laravel queues allow background jobs\"\n            ↓ embedding model\n   [0.13, -0.52, 0.77, …]\n\n\"Run expensive operations asynchronously\"\n            ↓ embedding model\n   [0.15, -0.48, 0.74, …]\n```\n\nThe vectors are close because the <b>concepts</b> are close, and not one word overlaps.\n\nThat is the trick in its entirety: <b>similarity of meaning becomes distance between points</b>, and distance is something a database can sort by.\n\n---\n\n### 3. Advanced — what \"meaning\" actually means here\n\nThree things worth understanding before you trust it.\n\n<b>The model decides what similar means, and you did not choose the model's opinion.</b> Embeddings are trained on general text, so they know \"physician\" and \"doctor\" are close. They may not know that in <b>your</b> domain, \"draft\" and \"pending\" are different states with different rules. <b>General semantics is not your semantics</b>, and where they diverge, semantic search confidently returns the wrong thing.\n\n<b>Similarity is not the same as opposite-detection.</b> \"The invoice was paid\" and \"the invoice was not paid\" are semantically very close: same subject, same vocabulary, one negation. Vectors are poor at negation, which matters enormously when the difference between two documents is a single \"not\".\n\n<b>And there is no exact match.</b> Keyword search can tell you a document definitely contains a word. Semantic search returns a ranked list of things that are <b>kind of like</b> what you asked, always, including when the right answer is not in your corpus at all. <b>That is the failure mode to keep in mind for the next three lessons.</b>\n\nSo the honest framing, and the one to carry forward:\n\n> <b>Semantic search is not better search. It is a different signal.</b>\n\nIt answers \"what is this about?\" where keyword search answers \"does this contain that?\", and knowing which question your user is asking is the entire skill.",
      diagram: `Two different questions

  KEYWORD
    query   "Laravel queue"
    asks    does this document CONTAIN these words?

  SEMANTIC
    query   "how can I run expensive work in the
             background?"
    asks    which documents MEAN something similar?

  One matches characters. The other matches meaning.

  Notice: that second query contains none of your
  documentation's words. Not "queue", not "job", not
  "dispatch". Keyword search has nothing to work with.


How meaning becomes a number

    "Laravel queues allow background jobs"
                ↓  embedding model
        [0.13, -0.52, 0.77, …]

    "Run expensive operations asynchronously"
                ↓  embedding model
        [0.15, -0.48, 0.74, …]

  Close vectors, because the CONCEPTS are close —
  and not one word overlaps.

  That is the whole trick:

    similarity of meaning → distance between points
    distance → something a database can sort by


  ⚠️  Three things before you trust it

    1. The model decides what "similar" means, and
       you did not choose its opinion.

       Embeddings are trained on general text. They
       know physician ≈ doctor. They may NOT know
       that in YOUR domain "draft" and "pending" are
       different states with different rules.

         general semantics ≠ your semantics

       Where they diverge, semantic search
       confidently returns the wrong thing.

    2. Vectors are BAD AT NEGATION.

         "the invoice was paid"
         "the invoice was NOT paid"

       Same subject, same vocabulary, one negation —
       and semantically very close. Which matters
       enormously when a single "not" is the whole
       difference.

    3. There is no EXACT MATCH.

       Keyword search can tell you a document
       definitely contains a word.

       Semantic search returns a ranked list of
       things that are KIND OF LIKE what you asked —
       always, including when the right answer is not
       in your corpus at all.


  The framing to carry forward:

    SEMANTIC SEARCH IS NOT BETTER SEARCH.
    IT IS A DIFFERENT SIGNAL.

    keyword    "does this contain that?"
    semantic   "what is this about?"

    Knowing which question your user is asking is
    the entire skill.`,
      codeExample: {
        title: "The same corpus, two kinds of query",
        code: `<?php
// ---------- The corpus ----------

// Document A: "Laravel queues process background jobs."
// Document B: "Laravel validation rules."
// Document C: "Laravel database migrations."


<?php
// ---------- Keyword: does it contain these words? ----------

Document::where('content', 'like', '%queue%')->get();
// → A

Document::where('content', 'like', '%background%')->get();
// → A

Document::where('content', 'like', '%run work later%')->get();
// → nothing. The user's words are not in your documents.


<?php
// ---------- Semantic: what is this about? ----------

Document::query()
    ->whereVectorSimilarTo('embedding', 'How do I run work later without blocking?')
    ->limit(3)
    ->get();
// → A first, because "run work later without blocking"
//   and "queues process background jobs" mean nearly
//   the same thing, sharing not one word.


<?php
// ---------- Where general semantics is not YOUR semantics ----------

// Your invoice states, with different rules each:
//   draft     → editable, not sent
//   pending   → sent, awaiting payment
//   overdue   → past due date

Invoice::query()
    ->whereVectorSimilarTo('notes_embedding', 'invoices still waiting')
    ->get();

// The embedding model considers draft ≈ pending ≈
// awaiting. It has no idea your business treats them
// as different things with different rules.
//
// ✅ State is structured data. Filter it.
Invoice::where('status', 'pending')
    ->whereVectorSimilarTo('notes_embedding', 'chase this client')
    ->get();


<?php
// ---------- Negation: where vectors quietly fail ----------

// These two sentences are semantically VERY close:
//   "The invoice was paid on time."
//   "The invoice was not paid on time."
//
// Same subject, same vocabulary, one word different —
// and that word inverts the meaning completely.

// ❌ Do not ask a vector search to distinguish them
Invoice::whereVectorSimilarTo('notes_embedding', 'invoices that were not paid')->get();

// ✅ That is a column, not a meaning
Invoice::where('paid_at', null)->get();


<?php
// ---------- No exact match, ever ----------

// Keyword: a definite answer, including "no"
Document::where('content', 'like', '%CP-10460%')->exists();   // true / false

// Semantic: ALWAYS a ranked list, even when your corpus
// contains nothing relevant
Document::whereVectorSimilarTo('embedding', 'CP-10460')->limit(5)->get();
// → five documents. All of them wrong. None of them
//   flagged as wrong.
//
// Which is why the next three lessons exist.`,
      },
      keyTakeaways: [
        "<b>Keyword search asks whether a document contains these words.</b>",
        "<b>Semantic search asks which documents mean something similar.</b>",
        "<b>A natural-language question often contains none of your documents' words</b>, leaving keyword search nothing.",
        "<b>An embedding turns meaning into a vector</b>, so similarity becomes distance a database can sort by.",
        "<b>Two sentences with no shared words can have very close vectors.</b>",
        "<b>The model decides what \"similar\" means, and you did not choose its opinion.</b>",
        "<b>General semantics is not your domain's semantics</b>: it may treat your distinct states as the same.",
        "<b>Vectors are poor at negation</b>, so \"paid\" and \"not paid\" sit very close together.",
        "<b>Semantic search has no exact match</b>: it always returns a ranked list, even with nothing relevant.",
        "<b>Semantic search is not better search, it is a different signal.</b>",
      ],
      commonMistakes: [
        "<b>Treating semantic search as an upgrade.</b> It answers a different question, not the same one better.",
        "<b>Assuming the model shares your domain's distinctions.</b> Draft and pending may be identical to it.",
        "<b>Relying on vectors to handle negation.</b> \"Not paid\" is nearly identical to \"paid\".",
        "<b>Forgetting there is no \"no results\".</b> A ranked list of irrelevant documents looks like an answer.",
      ],
      quiz: [
        {
          question: "What is the fundamental difference between the two?",
          options: [
            "Speed",
            "Keyword asks whether words are present; semantic asks what a document is about",
            "Semantic is always more accurate",
            "Keyword cannot rank",
          ],
          correctIndex: 1,
          explanation: "Different questions, not better and worse answers.",
        },
        {
          question: "How does semantic similarity become searchable?",
          options: [
            "Through synonyms",
            "Meaning becomes a vector, so similarity becomes distance a database can sort by",
            "Through stemming",
            "By expanding the query",
          ],
          correctIndex: 1,
          explanation: "Two sentences with no shared words can sit very close together.",
        },
        {
          question: "Why are vectors unreliable for negation?",
          options: [
            "They ignore short words",
            "\"Paid\" and \"not paid\" share subject and vocabulary, so their vectors are very close",
            "Negation is not embedded",
            "They are reliable",
          ],
          correctIndex: 1,
          explanation: "When a single \"not\" is the whole difference, use a column instead.",
        },
        {
          question: "What does semantic search never do?",
          options: [
            "Rank results",
            "Return nothing: it always gives a ranked list, even when nothing relevant exists",
            "Handle long queries",
            "Use an index",
          ],
          correctIndex: 1,
          explanation: "Irrelevant results look exactly like relevant ones.",
        },
      ],
    },
    {
      id: "pgvector-and-vector-queries",
      title: "pgvector & whereVectorSimilarTo()",
      durationMinutes: 12,
      explanation: "If you already run PostgreSQL, you may not need another service at all.\n\n---\n\n### 1. Basic — vectors in your database\n\n<b>pgvector</b> lets PostgreSQL store and search embeddings:\n\n```text\ndocuments\n─────────\nid\ntitle\ncontent\nembedding    ← the vector\n```\n\n```text\nLaravel → PostgreSQL\n           ├── normal columns\n           └── vector column\n```\n\n<b>That is a genuinely big deal.</b> Your vectors live next to your data, in the same transaction, with the same backups, joinable against every other table you have. No second service, no sync problem, no second copy to go stale.\n\nGenerating them:\n\n```text\ntitle + content → embedding model → vector → database\n```\n\n---\n\n### 2. Intermediate — querying\n\n```php\nDocument::query()\n    ->whereVectorSimilarTo('embedding', 'Best wineries in Napa Valley')\n    ->get();\n```\n\nWhat happens:\n\n```text\nquery text → embedding → compare against every document vector\n→ similarity score → rank\n```\n\n```text\n         [Q]\n        / | \\\n       A  B  C     ← distance(Q,A), distance(Q,B), distance(Q,C)\n     closest = best semantic match\n```\n\n<b>You do not implement the maths.</b> The database computes distance and sorts by it, which is exactly the kind of work a database is good at.\n\n---\n\n### 3. Advanced — the three things that decide whether it works\n\n<b>The query is itself an embedding call.</b> Every search costs you a model request before the database sees anything, which adds latency and money to every keystroke. <b>So never embed on an autocomplete keypress</b>, and cache embeddings of repeated queries: the same text always produces the same vector, so caching is free correctness.\n\n<b>You need a vector index, and it changes the answers.</b> Without one, PostgreSQL compares your query against every row, which is fine at ten thousand documents and unusable at ten million. With an HNSW or IVFFlat index it is fast, and <b>approximate</b>: the index trades a small amount of recall for a large amount of speed, so a result that should have been fourth occasionally is not returned at all. That is the deal, and it is usually the right one.\n\n<b>And the vector column has a fixed dimension.</b> `vector(1536)` accepts vectors of exactly that size, so switching embedding models means a migration, not just a re-embed. Combined with Day 30's rule about storing the model name, that gives you the full picture: <b>changing embedding models is a schema change, a backfill and a re-index.</b>\n\nOne more thing that surprises people: <b>the vector is large.</b> A 1536-dimension float vector is about 6KB per row, so a million documents is several gigabytes before you index them. Vectors are not a free extra column.\n\n<b>And the practical rule for choosing pgvector over a dedicated engine:</b> if your corpus is in the low millions and you already run PostgreSQL, pgvector is almost always the right answer, because one system you understand beats two you half-understand.",
      diagram: `Vectors in your own database

    documents
    ─────────
    id
    title
    content
    embedding     ← the vector

    Laravel → PostgreSQL
                ├── normal columns
                └── vector column

  Genuinely a big deal: vectors live NEXT TO your
  data — same transaction, same backups, joinable
  against every other table.

    no second service
    no sync problem
    no second copy to go stale

    title + content → embedding model → vector → db


Querying

    Document::query()
        ->whereVectorSimilarTo('embedding',
              'Best wineries in Napa Valley')
        ->get();

    query text
        ↓  embedding
    compare against every document vector
        ↓
    similarity score → rank

               [Q]
              / | \\
             ▼  ▼  ▼
             A  B  C

        distance(Q,A) · distance(Q,B) · distance(Q,C)
        closest = best semantic match

  You do not implement the maths. The database
  computes distance and sorts by it.


  ⚠️  Three things that decide whether it works

    1. The QUERY is itself an embedding call.

       Every search costs a model request before the
       database sees anything: latency and money on
       every keystroke.

         never embed on an autocomplete keypress
         cache query embeddings — same text always
         gives the same vector, so caching is free
         correctness

    2. You need a vector index, and it CHANGES THE
       ANSWERS.

       without   compare against every row
                 fine at 10k, unusable at 10M
       with      HNSW / IVFFlat — fast, and
                 APPROXIMATE

         the index trades a little recall for a lot
         of speed: a result that should have been 4th
         occasionally is not returned at all

       That is the deal, and usually the right one.

    3. The column has a FIXED DIMENSION.

         vector(1536) accepts exactly 1536

       Switching embedding models is a MIGRATION, not
       just a re-embed.

       With Day 30's "store the model name" rule:

         changing embedding models
           = schema change + backfill + re-index


  And vectors are BIG. A 1536-dim float vector is
  ~6KB per row — a million documents is several GB
  before you index them. Not a free extra column.


  Choosing pgvector over a dedicated engine:

    low-millions corpus + you already run PostgreSQL
      → pgvector, almost always

    one system you understand beats two you
    half-understand`,
      codeExample: {
        title: "pgvector end to end",
        code: `<?php
// ---------- Migration ----------

DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

Schema::create('documents', function (Blueprint $table) {
    $table->id();
    $table->foreignId('team_id')->constrained();
    $table->string('title');
    $table->text('content');
    $table->vector('embedding', 1536);        // ← fixed dimension
    $table->string('embedding_model');        // ← Day 30's rule
    $table->timestamps();
});

// Without an index, PostgreSQL compares your query to
// EVERY row. Fine at 10k documents. Unusable at 10M.
DB::statement('
    CREATE INDEX documents_embedding_idx
    ON documents
    USING hnsw (embedding vector_cosine_ops)
');

// HNSW is APPROXIMATE: a little recall traded for a lot
// of speed. A result that should have ranked 4th
// occasionally will not come back at all.


<?php
// ---------- Embed on write, in a job ----------

class EmbedDocument implements ShouldQueue
{
    public function handle(): void
    {
        $this->document->update([
            'embedding'       => Str::of($this->document->title . "\\n\\n" . $this->document->content)
                                    ->toEmbeddings(),
            'embedding_model' => config('ai.uses.embeddings'),
        ]);
    }
}


<?php
// ---------- Searching ----------

Document::query()
    ->where('team_id', $user->team_id)                 // scope in the query
    ->where('embedding_model', config('ai.uses.embeddings'))
    ->whereVectorSimilarTo('embedding', $question)
    ->limit(5)
    ->get();

// The vector lives beside your normal columns, so this
// is one query with one WHERE clause — not a search
// engine call plus a database call plus a merge.


<?php
// ---------- ⚠️ The query is an embedding call ----------

// ❌ An embedding request on every keystroke: latency
//    and money, per character
Route::get('/autocomplete', fn (Request $r) =>
    Document::whereVectorSimilarTo('embedding', $r->query('q'))->limit(5)->get()
);

// ✅ Keyword for autocomplete, semantic on submit
Route::get('/autocomplete', fn (Request $r) =>
    Document::where('title', 'ilike', $r->query('q') . '%')->limit(5)->get()
);

// ✅ And cache query embeddings — identical text always
//    produces an identical vector
$vector = Cache::rememberForever(
    'embedding:' . config('ai.uses.embeddings') . ':' . sha1($question),
    fn () => Str::of($question)->toEmbeddings(),
);


<?php
// ---------- Changing embedding model is a schema change ----------

// The new model produces 3072-dimension vectors.
// vector(1536) will not take them.

Schema::table('documents', function (Blueprint $table) {
    $table->vector('embedding_v2', 3072)->nullable();
});

// Backfill in a command, keeping the old column serving
Document::whereNull('embedding_v2')->chunkById(200, function ($docs) {
    foreach ($docs as $doc) {
        $doc->update([
            'embedding_v2'    => Str::of($doc->searchableText())->toEmbeddings(),
            'embedding_model' => config('ai.uses.embeddings'),
        ]);
    }
});

// Then rebuild the index, swap the column, drop the old.
// Schema change + backfill + re-index. Plan for it.


# ---------- Storage is not free ----------

# 1536 dimensions × 4 bytes ≈ 6KB per row
#   100,000 documents  ≈ 600 MB
# 1,000,000 documents  ≈   6 GB   before indexing
#
# Vectors are not a free extra column.


# ---------- When pgvector is the right call ----------

# corpus in the low millions
# + you already run PostgreSQL
#   → pgvector
#
# One system you understand beats two you
# half-understand.`,
      },
      keyTakeaways: [
        "<b>pgvector stores and searches embeddings inside PostgreSQL</b>, beside your normal columns.",
        "<b>That removes the second service, the sync problem and the second copy of your data.</b>",
        "<b>`whereVectorSimilarTo()` embeds the query, compares distances and ranks</b>, without you writing the maths.",
        "<b>Every semantic query is itself an embedding call</b>, adding latency and cost before the database is touched.",
        "<b>Never embed on an autocomplete keystroke</b>, and cache query embeddings since identical text is identical vectors.",
        "<b>You need an HNSW or IVFFlat index</b>, or PostgreSQL compares against every row.",
        "<b>Those indexes are approximate</b>: they trade a little recall for a lot of speed.",
        "<b>The vector column has a fixed dimension</b>, so a new embedding model means a migration.",
        "<b>Changing embedding models is a schema change, a backfill and a re-index.</b>",
        "<b>Vectors are large</b>: about 6KB per row at 1536 dimensions, so a million documents is gigabytes.",
        "<b>If your corpus is in the low millions and you run PostgreSQL, pgvector is usually right.</b>",
      ],
      commonMistakes: [
        "<b>No vector index.</b> Every query scans every row, and it degrades silently as you grow.",
        "<b>Embedding on every keystroke.</b> You pay a model request per character typed.",
        "<b>Assuming an approximate index returns exactly the top N.</b> Some recall is traded for speed.",
        "<b>Planning a model switch as a re-embed.</b> The dimension changes, so the schema changes.",
        "<b>Ignoring storage.</b> A million vectors is several gigabytes before indexing.",
      ],
      quiz: [
        {
          question: "What is the main architectural advantage of pgvector?",
          options: [
            "It is faster than dedicated engines",
            "Vectors live beside your data: same transaction, same backups, no second service to sync",
            "It generates embeddings for you",
            "It needs no index",
          ],
          correctIndex: 1,
          explanation: "One system you understand beats two you half-understand.",
        },
        {
          question: "What does every semantic query cost before the database is involved?",
          options: [
            "Nothing",
            "An embedding call for the query text, adding latency and money",
            "A full table scan",
            "An index rebuild",
          ],
          correctIndex: 1,
          explanation: "Which is why autocomplete should stay keyword-based.",
        },
        {
          question: "What is the trade-off of an HNSW index?",
          options: [
            "Storage only",
            "It is approximate: a little recall traded for a lot of speed",
            "It is slower to query",
            "It requires more memory only",
          ],
          correctIndex: 1,
          explanation: "A result that should rank fourth occasionally will not come back.",
        },
        {
          question: "What does switching embedding models require?",
          options: [
            "A re-embed only",
            "A schema change for the new dimension, a backfill and a re-index",
            "A config change",
            "Nothing",
          ],
          correctIndex: 1,
          explanation: "`vector(1536)` will not accept 3072-dimension vectors.",
        },
      ],
    },
    {
      id: "when-semantic-is-better",
      title: "When semantic search actually wins",
      durationMinutes: 11,
      explanation: "Semantic search is not magic, and \"AI search is always better\" is simply false. So here is the narrow, real set of cases where it wins clearly.\n\n---\n\n### 1. Basic — the user does not know your vocabulary\n\nThis is the main one, and it covers most genuine wins.\n\n```text\nuser:          \"how do I make something happen later without blocking the request?\"\nyour docs say: \"Laravel queues and delayed jobs\"\n```\n\nKeyword search has: `make`, `happen`, `later`, `blocking`. <b>None of them appear in the answer.</b>\n\nSemantic search sees:\n\n```text\n\"execute later without blocking\"  ≈  \"queues and delayed jobs\"\n```\n\n<b>The pattern: the user describes an outcome, your content uses a technical term.</b> That gap is exactly what embeddings close, and it is why documentation search and support search are the flagship use cases.\n\n---\n\n### 2. Intermediate — synonyms and paraphrase\n\n```text\nuser types \"car\"        your data says \"automobile\"\nuser types \"doctor\"     your data says \"physician\"\n```\n\n<b>A semantic system recognises the relationship without you writing a synonym list.</b>\n\nWhich is the real saving: synonym lists work, and they are permanent manual labour. Somebody has to think of \"notebook\" for \"laptop\", and nobody thinks of all of them. <b>Embeddings give you the long tail for free.</b>\n\n---\n\n### 3. Advanced — two worked examples, and the shared pattern\n\n<b>Documentation search.</b> Your corpus covers queues, events, authentication, middleware, Eloquent. A user asks:\n\n```text\n\"how do I execute work after the user leaves the page?\"\n```\n\nNo document contains \"after the user leaves the page\". One discusses `dispatchAfterResponse()`. <b>Semantic search finds the conceptual link that no keyword ever would.</b>\n\n<b>Ecommerce.</b> A user searches:\n\n```text\n\"lightweight laptop for programming\"\n```\n\nProducts described as portable, developer-friendly, long battery life, 16GB RAM. <b>None contain that phrase.</b> Semantic ranking surfaces them, and then structured filters handle price, brand, RAM and availability.\n\n<b>Notice what both examples share.</b> The query is long, natural language, and describes an intent rather than naming a thing. <b>That is the signal.</b>\n\nAnd notice what neither does. <b>Neither user was looking for a specific known record.</b> They were exploring, which is the honest boundary: <b>semantic search helps people who do not yet know what they are looking for.</b>\n\nOne last thing worth naming. <b>Semantic search is much better at recall than at precision.</b> It finds things keyword search misses entirely, and it also finds several things that are merely adjacent. That is a good trade when the alternative is zero results, and a bad one when the user knew exactly what they wanted, which is where the next lesson starts.",
      diagram: `The main win — the user does not know your vocabulary

    user says   "how do I make something happen later
                 without blocking the request?"
    docs say    "Laravel queues and delayed jobs"

  Keyword search has: make · happen · later · blocking
  None of them appear in the answer.

  Semantic sees:

    "execute later without blocking"
              ≈
    "queues and delayed jobs"

  THE PATTERN

    the user describes an OUTCOME
    your content uses a TECHNICAL TERM

  That gap is what embeddings close — which is why
  documentation and support search are the flagship
  use cases.


Synonyms and paraphrase, for free

    user types "car"     data says "automobile"
    user types "doctor"  data says "physician"

  A synonym list also solves this — and is permanent
  manual labour. Somebody has to think of "notebook"
  for "laptop", and nobody thinks of all of them.

    embeddings give you the LONG TAIL for free


Two worked examples

  DOCUMENTATION
    corpus: queues · events · auth · middleware · Eloquent
    query:  "how do I execute work after the user
             leaves the page?"

    No document contains that phrase.
    One discusses dispatchAfterResponse().

    Semantic finds the conceptual link no keyword
    would.

  ECOMMERCE
    query: "lightweight laptop for programming"

    products described as: portable · developer-
    friendly · long battery life · 16GB RAM

    None contain that phrase. Semantic ranking
    surfaces them; structured filters then handle
    price, brand, RAM, availability.


  WHAT BOTH SHARE

    the query is LONG, NATURAL LANGUAGE, and
    describes an INTENT rather than naming a thing

    that is the signal


  AND WHAT NEITHER DOES

    neither user was looking for a specific KNOWN
    RECORD — they were exploring

    semantic search helps people who do not yet know
    what they are looking for


  One last thing:

    semantic is much better at RECALL than PRECISION

    it finds what keyword misses entirely — and also
    several things that are merely adjacent

      good trade when the alternative is zero results
      bad trade when the user knew exactly what they
      wanted  → which is the next lesson`,
      codeExample: {
        title: "The queries where semantic earns its keep",
        code: `<?php
// ---------- Documentation search ----------

// Corpus:
//   "Laravel queues process background jobs."
//   "dispatchAfterResponse sends the response first, then runs the job."
//   "Laravel validation rules."
//   "Laravel database migrations."

$question = 'How do I execute work after the user leaves the page?';

// ❌ Keyword: the phrase appears nowhere
Doc::where('content', 'like', "%{$question}%")->get();      // nothing
Doc::whereFullText('content', $question)->get();            // noise at best

// ✅ Semantic: finds dispatchAfterResponse, which shares
//    not one word with the question
Doc::query()
    ->whereVectorSimilarTo('embedding', $question)
    ->limit(5)
    ->get();


<?php
// ---------- Synonyms you never had to write down ----------

// A synonym list works, and is permanent manual labour:
'synonyms' => [
    'laptop'  => ['notebook', 'macbook', 'ultrabook'],
    'doctor'  => ['physician', 'gp', 'clinician'],
    'car'     => ['automobile', 'vehicle'],
    // ...and the fifty you did not think of
],

// Embeddings cover the long tail without a list
Product::whereVectorSimilarTo('embedding', 'automobile')->get();
// → cars, vehicles, motors


<?php
// ---------- Ecommerce: intent, then structured filters ----------

class ProductSearch
{
    public function search(User $user, SearchFilters $filters): LengthAwarePaginator
    {
        return Product::query()
            ->where('team_id', $user->team_id)
            ->where('in_stock', true)

            // Structured constraints stay structured
            ->when($filters->brand, fn ($q, $b) => $q->where('brand', $b))
            ->when($filters->maxPrice, fn ($q, $p) => $q->where('price_cents', '<=', $p))
            ->when($filters->minRam, fn ($q, $r) => $q->where('ram_gb', '>=', $r))

            // Meaning does the ranking
            ->whereVectorSimilarTo('embedding', $filters->query)
            ->paginate(24);
    }
}

// "lightweight laptop for programming"
//   → products described as portable, developer-friendly,
//     long battery life — none containing that phrase
//   → then price, brand and RAM as real filters


<?php
// ---------- The signal, in code ----------

final class QueryShape
{
    // Long, natural language, describing an intent
    public static function looksSemantic(string $query): bool
    {
        return str_word_count($query) >= 5
            && ! preg_match('/[A-Z]{2,}-\\d+|\\d{4,}|@/', $query);
    }
}

// ✅ semantic
//   "how do I run work in the background?"
//   "lightweight laptop for programming"
//   "what happens when a payment fails halfway through"
//
// ❌ not semantic
//   "CP-10460"
//   "rajan@example.com"
//   "Mac"


<?php
// ---------- Recall vs precision, made explicit ----------

// Semantic search finds what keyword misses ENTIRELY —
// and also several things that are merely adjacent.

$results = Doc::whereVectorSimilarTo('embedding', $question)
    ->limit(10)
    ->get();

// Good trade: the alternative was zero results.
//
// Bad trade: the user typed an invoice number and now
// has ten invoices, one of which might be theirs.
//
// Which is the next lesson.`,
      },
      keyTakeaways: [
        "<b>Semantic search is not magic</b>, and \"AI search is always better\" is false.",
        "<b>Its main win is a vocabulary gap</b>: the user describes an outcome, your content uses a technical term.",
        "<b>That is why documentation and support search are the flagship cases.</b>",
        "<b>It handles synonyms and paraphrase without a synonym list.</b>",
        "<b>Synonym lists work and are permanent manual labour</b>; embeddings give you the long tail free.",
        "<b>Documentation example</b>: \"work after the user leaves the page\" finds `dispatchAfterResponse`.",
        "<b>Ecommerce example</b>: \"lightweight laptop for programming\" finds products described as portable.",
        "<b>The signal is a long, natural-language query describing an intent</b> rather than naming a thing.",
        "<b>Neither example was looking for a specific known record.</b>",
        "<b>Semantic search helps people who do not yet know what they are looking for.</b>",
        "<b>It is better at recall than precision</b>, which is a good trade only when the alternative is zero results.",
      ],
      commonMistakes: [
        "<b>Treating semantic search as a general upgrade.</b> Its wins are a specific, narrow shape.",
        "<b>Using it for users who know exactly what they want.</b> Extra adjacent results are noise, not help.",
        "<b>Letting semantic ranking decide structured constraints.</b> Price and brand are filters, not meanings.",
        "<b>Ignoring the query shape.</b> A four-word query rarely has enough context to be worth embedding.",
      ],
      quiz: [
        {
          question: "What is the main pattern where semantic search wins?",
          options: [
            "Short queries",
            "The user describes an outcome while your content uses a technical term",
            "Exact identifiers",
            "Numeric filters",
          ],
          correctIndex: 1,
          explanation: "That vocabulary gap is exactly what embeddings close.",
        },
        {
          question: "What does semantic search give you over a synonym list?",
          options: [
            "Faster queries",
            "The long tail for free, without somebody manually thinking of every related word",
            "Better filters",
            "Exact matching",
          ],
          correctIndex: 1,
          explanation: "Synonym lists work and are permanent manual labour.",
        },
        {
          question: "What do the documentation and ecommerce examples have in common?",
          options: [
            "Short queries",
            "Long natural-language queries describing an intent rather than naming a specific record",
            "Numeric constraints",
            "Exact identifiers",
          ],
          correctIndex: 1,
          explanation: "And neither user was looking for a record they already knew existed.",
        },
        {
          question: "Where does semantic search sit on recall versus precision?",
          options: [
            "Better precision",
            "Better recall: it finds what keyword misses, and also things that are merely adjacent",
            "Equal on both",
            "Worse on both",
          ],
          correctIndex: 1,
          explanation: "A good trade against zero results, a bad one when the user knew what they wanted.",
        },
      ],
    },
    {
      id: "when-semantic-is-worse",
      title: "When semantic search is worse than LIKE",
      durationMinutes: 12,
      explanation: "This is the most useful lesson in the elective, because it is the part everyone skips.\n\n---\n\n### 1. Basic — exact identifiers\n\nA user types:\n\n```text\nCP-10460\n```\n\nThey are not asking \"what concept resembles CP-10460?\". They are asking <b>find this exact thing</b>.\n\n```sql\nWHERE ticket_number = 'CP-10460'\n```\n\n<b>Semantic search here is worse in every way</b>: slower, more expensive, and it returns five tickets that are vaguely similar instead of the one that exists. The correct behaviour for a wrong identifier is <b>no results</b>, and a vector search cannot express that.\n\nThe whole category:\n\n```text\nuser IDs · order IDs · ticket numbers · SKUs · invoice numbers\nproduct codes · email addresses · URLs · phone numbers\nfile names · version numbers · postcodes · VINs\n```\n\n<b>`INV-2026-00982` should return that invoice or nothing.</b> \"Similar invoices\" is not an answer anyone wanted.\n\n---\n\n### 2. Intermediate — short queries and names\n\n<b>Short queries have no context to embed.</b>\n\n```text\n\"Mac\"  →  MacBook? macOS? MAC address? macaroni?\n```\n\nA model given three characters is guessing, and it will guess confidently. <b>Keyword search is far more predictable</b>, and prefix matching is what an autocomplete actually wants.\n\n<b>Names and proper nouns are the same problem.</b> Somebody searching \"Rajan\" wants records containing Rajan, not people who are semantically similar to Rajan. There is no such thing as a person who is 0.91 similar to a name, and returning one is a strange experience.\n\n---\n\n### 3. Advanced — structured data is not a meaning\n\n```text\n\"red Nike shoes under $100\"\n```\n\n<b>Do not ask semantic similarity to work out that `color = red`, `brand = Nike`, `price < 100`.</b> Those are structured constraints with exact answers, and a vector will get them approximately right, which is the worst kind of right: a £110 shoe is semantically very close to a £100 one, and returning it is simply wrong.\n\n```text\nsemantic ranking  +  brand = Nike  +  price < 100  +  color = red\n```\n\n<b>Meaning for the fuzzy part, columns for the exact part.</b> That split is the entire architecture of good search.\n\nAnd the deeper reason all of these fail the same way: <b>semantic search cannot say \"no\".</b> Every one of these queries returns a confident ranked list. A wrong ticket number returns five tickets. A misspelled name returns five people. A price constraint returns things nearby. <b>The user cannot tell a good result from a bad one</b>, because both look identical.\n\nOne more, worth stating plainly: <b>this is also a cost decision.</b> Every semantic query costs an embedding call plus a vector search. Running that for `CP-10460` means paying money and adding latency to produce a worse answer than a `WHERE` clause would have given you for free.",
      diagram: `Exact identifiers

    user types    CP-10460

    They are not asking "what concept resembles
    CP-10460?" They are asking FIND THIS EXACT THING.

      WHERE ticket_number = 'CP-10460'

  Semantic here is worse in EVERY way: slower, more
  expensive, and it returns five vaguely similar
  tickets instead of the one that exists.

  ⚠️  The correct answer for a wrong identifier is
      NO RESULTS — and a vector search cannot express
      that.

  The whole category:

    user IDs · order IDs · ticket numbers · SKUs
    invoice numbers · product codes · emails · URLs
    phone numbers · file names · version numbers
    postcodes · VINs

    INV-2026-00982 → that invoice, or nothing
    "similar invoices" is not an answer anyone wanted


Short queries

    "Mac"  →  MacBook? macOS? MAC address? macaroni?

  Three characters is not context. The model guesses,
  and guesses confidently.

  Keyword is far more predictable — and prefix
  matching is what autocomplete actually wants.


Names and proper nouns

    "Rajan"  →  records containing Rajan

  Not people semantically similar to Rajan. There is
  no such thing as a person who is 0.91 similar to a
  name, and returning one is a strange experience.


Structured data is not a meaning

    "red Nike shoes under $100"

  Do NOT ask similarity to work out:

    color = red · brand = Nike · price < 100

  A vector gets them APPROXIMATELY right, which is
  the worst kind of right:

    a £110 shoe is semantically very close to a £100
    one — and returning it is simply wrong

    semantic ranking
      + brand = Nike
      + price < 100
      + color = red

  Meaning for the fuzzy part. Columns for the exact
  part. That split is the whole architecture of good
  search.


  ⚠️  THE COMMON CAUSE

      SEMANTIC SEARCH CANNOT SAY "NO".

      Every one of these returns a confident ranked
      list:

        wrong ticket number  → five tickets
        misspelled name      → five people
        price constraint     → things nearby

      And the user cannot tell a good result from a
      bad one, because they look identical.


  And it is a COST decision too. Every semantic query
  is an embedding call plus a vector search. Running
  that for CP-10460 means paying money and adding
  latency to produce a worse answer than a free WHERE
  clause.`,
      codeExample: {
        title: "The queries where LIKE wins outright",
        code: `<?php
// ---------- Exact identifiers ----------

// ✅ Right answer, or no answer
Ticket::where('reference', 'CP-10460')->first();
Invoice::where('reference', 'INV-2026-00982')->first();
User::where('email', 'rajan@example.com')->first();

// ❌ Five vaguely similar tickets, none of them the one
Ticket::whereVectorSimilarTo('embedding', 'CP-10460')->limit(5)->get();
//
// And when the reference does not exist, this STILL
// returns five tickets. There is no "no results".


<?php
// ---------- Detect the shape before you choose ----------

final class QueryClassifier
{
    private const EXACT_PATTERNS = [
        '/^[A-Z]{2,5}-\\d+$/i',                 // CP-10460
        '/^INV-\\d{4}-\\d+$/i',                 // INV-2026-00982
        '/^[\\w.+-]+@[\\w-]+\\.[\\w.]+$/',      // email
        '/^\\+?\\d[\\d\\s-]{6,}$/',             // phone
        '/^https?:\\/\\//i',                    // URL
        '/^\\d{4,}$/',                          // bare long number
        '/^v?\\d+\\.\\d+(\\.\\d+)?$/',          // version
    ];

    public function isExact(string $query): bool
    {
        foreach (self::EXACT_PATTERNS as $pattern) {
            if (preg_match($pattern, trim($query))) {
                return true;
            }
        }

        // Too short to embed meaningfully: "Mac" is
        // MacBook, macOS, MAC address or macaroni
        return str_word_count($query) < 3;
    }
}


<?php
// ---------- Structured constraints are columns, not meanings ----------

// ❌ Asking a vector to understand "under $100"
Product::whereVectorSimilarTo('embedding', 'red Nike shoes under $100')->get();
//
// A £110 shoe is semantically very close to a £100 one.
// The vector will happily return it. That is not
// "close enough" — it is wrong.

// ✅ Meaning for the fuzzy part, columns for the exact part
Product::query()
    ->where('brand', 'Nike')
    ->where('color', 'red')
    ->where('price_cents', '<', 10000)
    ->whereVectorSimilarTo('embedding', 'shoes')
    ->get();


<?php
// ---------- Names: exact, with a little tolerance ----------

// ❌ People "semantically similar to Rajan"
User::whereVectorSimilarTo('embedding', 'Rajan')->get();

// ✅ What the user meant
User::where('name', 'ilike', '%Rajan%')->get();

// With typo tolerance, if you need it — still not semantic
User::search('Rajen')->get();      // Scout + Meilisearch


<?php
// ---------- The routing, in one place ----------

class SearchRouter
{
    public function search(User $user, string $query): Collection
    {
        // Free, instant, and correct — including the
        // ability to return nothing
        if ($this->classifier->isExact($query)) {
            return $this->exactSearch($user, $query);
        }

        return $this->semanticSearch($user, $query);
    }

    private function exactSearch(User $user, string $query): Collection
    {
        return Ticket::query()
            ->where('team_id', $user->team_id)
            ->where(fn ($q) => $q
                ->where('reference', $query)
                ->orWhere('title', 'ilike', "%{$query}%"))
            ->limit(20)
            ->get();
        // Returns an empty collection for a wrong reference.
        // That is the correct answer, and semantic search
        // cannot produce it.
    }
}


<?php
// ---------- Autocomplete is prefix matching, not meaning ----------

// ❌ An embedding call per keystroke, for three characters
Product::whereVectorSimilarTo('embedding', $request->query('q'))->limit(5)->get();

// ✅
Product::where('name', 'ilike', $request->query('q') . '%')
    ->limit(5)
    ->get();`,
      },
      keyTakeaways: [
        "<b>Exact identifiers should use exact search</b>: the user wants that record or nothing.",
        "<b>The category is large</b>: IDs, tickets, SKUs, invoices, emails, URLs, phones, filenames, versions.",
        "<b>A wrong identifier should return no results</b>, and semantic search cannot express that.",
        "<b>Short queries have no context to embed</b>: \"Mac\" could be four unrelated things.",
        "<b>Names and proper nouns want exact matching</b>, because \"similar to Rajan\" is meaningless.",
        "<b>Structured constraints are columns, not meanings.</b>",
        "<b>A vector gets \"under $100\" approximately right</b>, which is the worst kind of right.",
        "<b>Meaning for the fuzzy part, columns for the exact part.</b>",
        "<b>Everything here fails the same way: semantic search cannot say no.</b>",
        "<b>A wrong query returns a confident ranked list</b>, and users cannot tell good results from bad.",
        "<b>It is also a cost decision</b>: paying for an embedding call to get a worse answer than a `WHERE`.",
      ],
      commonMistakes: [
        "<b>Routing every query through embeddings.</b> Slower, costlier and worse for half of them.",
        "<b>Semantic autocomplete.</b> An embedding call per keystroke, on three characters of context.",
        "<b>Letting a vector handle price or date constraints.</b> Approximately right is wrong.",
        "<b>Semantic search for names.</b> Users get people who are not the person they typed.",
        "<b>Forgetting that no results is a valid answer.</b> Vector search always returns something.",
      ],
      quiz: [
        {
          question: "Why is semantic search wrong for `CP-10460`?",
          options: [
            "It is too slow",
            "The user wants that exact record or nothing, and a vector search always returns similar ones",
            "Vectors cannot handle hyphens",
            "It is not wrong",
          ],
          correctIndex: 1,
          explanation: "No results is the correct answer for a wrong identifier.",
        },
        {
          question: "Why do short queries suit keyword search?",
          options: [
            "They are faster",
            "Three characters carry no context, so the model guesses confidently between unrelated meanings",
            "Vectors reject them",
            "They cannot be embedded",
          ],
          correctIndex: 1,
          explanation: "\"Mac\" could be MacBook, macOS, MAC address or macaroni.",
        },
        {
          question: "How should \"red Nike shoes under $100\" be handled?",
          options: [
            "Pure semantic search",
            "Semantic ranking for \"shoes\" plus real column filters for colour, brand and price",
            "Pure keyword search",
            "A synonym list",
          ],
          correctIndex: 1,
          explanation: "A £110 shoe is semantically close to a £100 one, and returning it is wrong.",
        },
        {
          question: "What single flaw connects every failure case in this lesson?",
          options: [
            "Cost",
            "Semantic search cannot say no: it always returns a confident ranked list",
            "Latency",
            "Index size",
          ],
          correctIndex: 1,
          explanation: "And the user cannot tell a good result from a bad one.",
        },
      ],
    },
    {
      id: "hybrid-search-and-the-decision-rule",
      title: "Hybrid search, cost & the decision rule",
      durationMinutes: 13,
      explanation: "Two lessons said semantic wins, then semantic loses. Here is how to stop choosing.\n\n---\n\n### 1. Basic — run both\n\n```text\n            search\n         ┌────┴────┐\n     keyword    semantic\n         └────┬────┘\n         combined ranking\n              ↓\n           results\n```\n\n<b>That is hybrid search</b>, and it beats either alone because a real query usually contains both kinds of signal:\n\n```text\n\"CP-10460 Laravel queue issue\"\n```\n\nKeyword nails `CP-10460`. Semantic understands \"Laravel queue issue\". <b>Together you get the exact ticket and the conceptually related ones</b>, which is what the user actually wanted.\n\n---\n\n### 2. Intermediate — combining the rankings\n\nThe hard part is that the two searches return <b>incomparable scores</b>. A BM25 keyword score of 8.4 and a cosine distance of 0.23 are not on the same scale, so you cannot add them.\n\nThe standard fix is <b>reciprocal rank fusion</b>: ignore the scores, use the positions.\n\n```text\nscore(doc) = Σ  1 / (k + rank in that list)\n```\n\nA document that appears in both lists rises; one that appears only in a single list still ranks, just lower. <b>It needs no tuning and no score normalisation</b>, which is why it is the default answer.\n\n---\n\n### 3. Advanced — routing, cost, and the rule\n\nBefore fusing anything, <b>classify the query</b>:\n\n```text\n         user query\n      ┌──────┴──────┐\n  exact/structured?   natural language?\n      ↓                    ↓\n exact search        semantic search\n      └──────┬────────────┘\n          results\n```\n\n<b>Routing saves you the embedding call entirely</b> on the queries where semantic search adds nothing, which is a real share of your traffic. `CP-10460` should never reach a model.\n\nAnd cost is why routing matters:\n\n```text\nper document   embedding generation + vector storage\nper query      embedding generation + vector search\n```\n\n<b>Every search costs money and latency before your database is touched.</b> Keyword search is free by comparison. So route first, embed second.\n\n<b>The decision rule</b>, which is the thing to remember from the entire day:\n\n> <b>Does the user care about exact words, or about meaning?</b>\n\n```text\nexact words  → LIKE / full-text / exact\nmeaning      → semantic\nboth         → hybrid\n```\n\n```text\nCP-10460                            exact\nINV-2026-0098                       exact\nrajan@example.com                   exact\n\"Laravel queues\"                    keyword / hybrid\n\"how do I run work in background?\"  semantic\n\"best laptop for programming\"       semantic\n\"Nike shoes under $100\"             hybrid + filters\n\"doctor near Tokyo\"                 hybrid + filters\n\"red shirt SKU 8821\"                exact + filters\n```\n\n<b>And the golden rule underneath all of it:</b>\n\n> <b>Semantic search is not a replacement for traditional search. It is another search signal.</b>\n\nFor IDs, names, SKUs, codes, emails and exact terms: keyword. For natural-language questions where the user expresses an idea rather than your words: semantic. <b>For real applications: hybrid plus structured filters</b>, which is almost always the strongest architecture and the one nobody builds first because it is less exciting than the other two.",
      diagram: `Hybrid — stop choosing, run both

                 search
                   │
             ┌─────┴─────┐
             ▼           ▼
         keyword      semantic
             │           │
             └─────┬─────┘
                   ▼
           combined ranking
                   ↓
                results

  A real query usually carries BOTH signals:

    "CP-10460 Laravel queue issue"

      keyword   nails CP-10460
      semantic  understands "Laravel queue issue"

      together: the exact ticket AND the
      conceptually related ones


Combining the rankings

  ⚠️  The two searches return INCOMPARABLE scores.

      BM25 keyword score  8.4
      cosine distance     0.23

      Not the same scale. You cannot add them.

  RECIPROCAL RANK FUSION — ignore scores, use
  positions:

      score(doc) = Σ  1 / (k + rank in that list)

    a document in BOTH lists rises
    a document in one list still ranks, lower

    no tuning, no score normalisation
    → which is why it is the default answer


Route before you fuse

              user query
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
  exact/structured?    natural language?
        │                     │
        ▼                     ▼
   exact search        semantic search
        └──────────┬──────────┘
                   ▼
                results

  Routing saves the embedding call ENTIRELY on the
  queries where semantic adds nothing — a real share
  of your traffic.

    CP-10460 should never reach a model.


Cost is why routing matters

    per document   embedding generation
                   + vector storage

    per query      embedding generation
                   + vector search

  Every semantic search costs money and latency
  BEFORE your database is touched. Keyword search is
  free by comparison.

    route first, embed second


  THE DECISION RULE

    Does the user care about EXACT WORDS or MEANING?

      exact words  →  LIKE / full-text / exact
      meaning      →  semantic
      both         →  hybrid

  ┌────────────────────────────────┬────────────────┐
  │ CP-10460                       │ exact          │
  │ INV-2026-0098                  │ exact          │
  │ rajan@example.com              │ exact          │
  │ "Laravel queues"               │ keyword/hybrid │
  │ "how do I run work in the bg?" │ semantic       │
  │ "best laptop for programming"  │ semantic       │
  │ "Nike shoes under $100"        │ hybrid+filters │
  │ "doctor near Tokyo"            │ hybrid+filters │
  │ "red shirt SKU 8821"           │ exact+filters  │
  └────────────────────────────────┴────────────────┘


  THE GOLDEN RULE

    Semantic search is not a REPLACEMENT for
    traditional search. It is ANOTHER SIGNAL.

      IDs, names, SKUs, codes, emails  → keyword
      natural-language ideas           → semantic
      real applications                → HYBRID
                                         + filters

  Which almost nobody builds first, because it is
  less exciting than the other two.`,
      codeExample: {
        title: "Routing, fusing and the full search service",
        code: `<?php

namespace App\\Search;

class HybridSearch
{
    public function __construct(
        private QueryClassifier $classifier,
        private KeywordSearch $keyword,
        private SemanticSearch $semantic,
    ) {}

    public function search(User $user, string $query, SearchFilters $filters): Collection
    {
        // 1. ROUTE. CP-10460 should never reach a model.
        if ($this->classifier->isExact($query)) {
            return $this->keyword->search($user, $query, $filters);
        }

        // 2. Both lists, filtered identically
        $keywordHits  = $this->keyword->search($user, $query, $filters, limit: 50);
        $semanticHits = $this->semantic->search($user, $query, $filters, limit: 50);

        // 3. FUSE by rank, because the scores are not comparable
        return $this->reciprocalRankFusion([$keywordHits, $semanticHits]);
    }

    // BM25 8.4 and cosine 0.23 are not on the same scale.
    // Ignore the scores; use the positions.
    private function reciprocalRankFusion(array $lists, int $k = 60): Collection
    {
        $scores = [];
        $byId   = [];

        foreach ($lists as $list) {
            foreach ($list->values() as $rank => $item) {
                $scores[$item->id] = ($scores[$item->id] ?? 0) + 1 / ($k + $rank + 1);
                $byId[$item->id]   = $item;
            }
        }

        arsort($scores);

        return collect($scores)->keys()->map(fn ($id) => $byId[$id]);
    }
}

// A document appearing in BOTH lists rises. One in a
// single list still ranks, lower. No tuning required.


<?php
// ---------- Both sides, filtered the same way ----------

class KeywordSearch
{
    public function search(User $user, string $q, SearchFilters $f, int $limit = 50): Collection
    {
        return Document::query()
            ->where('team_id', $user->team_id)              // always
            ->when($f->type, fn ($query, $t) => $query->where('type', $t))
            ->whereFullText(['title', 'content'], $q)
            ->limit($limit)
            ->get();
    }
}

class SemanticSearch
{
    public function search(User $user, string $q, SearchFilters $f, int $limit = 50): Collection
    {
        return Document::query()
            ->where('team_id', $user->team_id)              // always
            ->when($f->type, fn ($query, $t) => $query->where('type', $t))
            ->whereVectorSimilarTo('embedding', $this->embed($q))
            ->limit($limit)
            ->get();
    }

    // Same text, same vector — caching is free correctness
    private function embed(string $q): array
    {
        return Cache::remember(
            'embedding:' . config('ai.uses.embeddings') . ':' . sha1($q),
            now()->addDays(7),
            fn () => Str::of($q)->toEmbeddings(),
        );
    }
}


<?php
// ---------- "CP-10460 Laravel queue issue" ----------

// keyword  → the exact ticket, ranked 1
// semantic → tickets about queue failures, ranked 1–5
// fused    → the exact ticket first, related ones after
//
// Which is what the user actually wanted, and what
// neither search alone would have given them.


<?php
// ---------- The decision rule, in one method ----------

public function strategyFor(string $query): SearchStrategy
{
    // Does the user care about exact words, or meaning?
    return match (true) {
        $this->classifier->isExact($query)      => SearchStrategy::Exact,
        str_word_count($query) >= 6             => SearchStrategy::Hybrid,
        default                                 => SearchStrategy::Keyword,
    };
}

// CP-10460                            → Exact
// INV-2026-0098                       → Exact
// rajan@example.com                   → Exact
// "Laravel queues"                    → Keyword
// "how do I run work in background?"  → Hybrid
// "best laptop for programming"       → Hybrid


# ---------- Where the money goes ----------

# per document   embedding generation + vector storage
# per query      embedding generation + vector search
#
# Every semantic search costs money and latency before
# your database is touched. Keyword is free by
# comparison.
#
# Routing removes that cost on the queries where
# semantic search adds nothing — and that is a real
# share of your traffic.`,
      },
      keyTakeaways: [
        "<b>Hybrid search runs keyword and semantic and combines the rankings.</b>",
        "<b>Real queries carry both signals</b>: an identifier plus a natural-language description.",
        "<b>The two searches return incomparable scores</b>, so you cannot simply add them.",
        "<b>Reciprocal rank fusion uses positions instead of scores</b>, needing no tuning or normalisation.",
        "<b>A document in both lists rises; one in a single list still ranks, lower.</b>",
        "<b>Classify the query before searching</b>, so exact identifiers never reach a model.",
        "<b>Routing removes the embedding cost on a real share of your traffic.</b>",
        "<b>Cost is per document and per query</b>: generation, storage, and generation again on every search.",
        "<b>The decision rule: does the user care about exact words or meaning?</b>",
        "<b>Exact words means keyword, meaning means semantic, both means hybrid.</b>",
        "<b>Structured constraints stay as filters</b> on either path.",
        "<b>The golden rule: semantic search is not a replacement, it is another signal.</b>",
        "<b>Hybrid plus structured filters is usually the strongest architecture</b>, and the one nobody builds first.",
      ],
      commonMistakes: [
        "<b>Adding keyword and vector scores together.</b> They are on different scales and the result is noise.",
        "<b>Embedding every query.</b> You pay for identifiers and autocomplete that gain nothing from it.",
        "<b>Applying filters to only one side of a hybrid search.</b> The fused list then contains excluded records.",
        "<b>Replacing keyword search entirely.</b> Semantic is a signal, not an upgrade.",
        "<b>Building semantic-only first because it is more interesting.</b> Hybrid is what actually works.",
      ],
      quiz: [
        {
          question: "Why can you not add keyword and vector scores together?",
          options: [
            "They are the same scale",
            "BM25 relevance and cosine distance are on different scales, so the sum is meaningless",
            "One is always higher",
            "You can",
          ],
          correctIndex: 1,
          explanation: "Reciprocal rank fusion uses positions instead.",
        },
        {
          question: "What does classifying the query before searching save you?",
          options: [
            "Index size",
            "The embedding call on queries where semantic search adds nothing, which is real traffic",
            "Database load",
            "Storage",
          ],
          correctIndex: 1,
          explanation: "`CP-10460` should never reach a model.",
        },
        {
          question: "What is the decision rule for choosing a search strategy?",
          options: [
            "Corpus size",
            "Does the user care about exact words or about meaning, and hybrid when both",
            "Query volume",
            "Latency budget",
          ],
          correctIndex: 1,
          explanation: "Exact words means keyword; meaning means semantic.",
        },
        {
          question: "What is the golden rule of the elective?",
          options: [
            "Always use semantic search",
            "Semantic search is not a replacement for traditional search, it is another signal",
            "Always use keyword search",
            "Always use pgvector",
          ],
          correctIndex: 1,
          explanation: "Hybrid plus structured filters is usually the strongest architecture.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What does Scout give you architecturally?",
      options: [
        "A faster database",
        "A common interface, so your application never learns a search engine's query language",
        "Automatic embeddings",
        "Free hosting",
      ],
      correctIndex: 1,
      explanation: "Which is what makes the driver choice reversible.",
    },
    {
      question: "What does a search engine offer that `LIKE` cannot?",
      options: [
        "Transactions",
        "Ranking and typo tolerance: better matches first, and `macbok` still finds MacBooks",
        "Constraints",
        "Joins",
      ],
      correctIndex: 1,
      explanation: "`LIKE` has no concept of one result being better than another.",
    },
    {
      question: "Which operations silently leave a Scout index stale?",
      options: [
        "All saves",
        "Raw SQL updates, mass `update()` on a builder, and migrations rewriting columns",
        "Deletes",
        "None",
      ],
      correctIndex: 1,
      explanation: "Scout syncs on model events, which those bypass.",
    },
    {
      question: "Why do stale deletes matter more than stale updates?",
      options: [
        "They are harder to fix",
        "A deleted record still appearing in search is a data leak, not just wrong data",
        "They break pagination",
        "They do not",
      ],
      correctIndex: 1,
      explanation: "Soft deletes especially, since the row still exists.",
    },
    {
      question: "Which Scout driver should most applications start with?",
      options: [
        "Algolia",
        "The database driver, since a search box alone does not justify another service",
        "Meilisearch",
        "Typesense",
      ],
      correctIndex: 1,
      explanation: "Moving later is a config change plus a re-import.",
    },
    {
      question: "What does Scout's abstraction not cover?",
      options: [
        "Searching",
        "Engine-specific configuration: ranking rules, synonyms, stop words and facets",
        "Pagination",
        "Importing",
      ],
      correctIndex: 1,
      explanation: "Rebuilding that tuning is where a driver switch actually costs you.",
    },
    {
      question: "Why should Scout index updates be queued in production?",
      options: [
        "For batching",
        "Inline writes make every model save depend on the search engine being up",
        "Queues are required",
        "For ordering",
      ],
      correctIndex: 1,
      explanation: "Queued, a search outage stops being a write outage.",
    },
    {
      question: "Why is flush-then-import dangerous on a live site?",
      options: [
        "It corrupts data",
        "The index is empty for the whole import, so search returns nothing for minutes",
        "It locks the database",
        "It is slow only",
      ],
      correctIndex: 1,
      explanation: "Build a new index alongside and swap an alias.",
    },
    {
      question: "What breaks when you filter search results in PHP?",
      options: [
        "Nothing",
        "Counts, pagination and ranking together, since you discard part of a ranked page",
        "Only the count",
        "Only performance",
      ],
      correctIndex: 1,
      explanation: "Filter in the engine, with attributes declared filterable.",
    },
    {
      question: "How does search pagination differ from database pagination?",
      options: [
        "It does not",
        "Engines cap total hits, and results shift between pages as the index changes",
        "It is always faster",
        "It cannot be cursor-based",
      ],
      correctIndex: 1,
      explanation: "The UI must handle \"no more results\" and occasional duplicates.",
    },
    {
      question: "What is the fundamental difference between keyword and semantic search?",
      options: [
        "Speed",
        "Keyword asks whether words are present; semantic asks what a document is about",
        "Semantic is more accurate",
        "Keyword cannot rank",
      ],
      correctIndex: 1,
      explanation: "Different questions, not better and worse answers.",
    },
    {
      question: "How does semantic similarity become searchable?",
      options: [
        "Through synonyms",
        "Meaning becomes a vector, so similarity becomes distance a database can sort by",
        "Through stemming",
        "By query expansion",
      ],
      correctIndex: 1,
      explanation: "Two sentences with no shared words can sit very close together.",
    },
    {
      question: "Why are vectors unreliable for negation?",
      options: [
        "They drop short words",
        "\"Paid\" and \"not paid\" share subject and vocabulary, so their vectors are very close",
        "Negation is stripped",
        "They are reliable",
      ],
      correctIndex: 1,
      explanation: "When a single \"not\" is the whole difference, use a column.",
    },
    {
      question: "What is the main architectural advantage of pgvector?",
      options: [
        "Raw speed",
        "Vectors live beside your data: same transaction, same backups, no second service to sync",
        "It generates embeddings",
        "It needs no index",
      ],
      correctIndex: 1,
      explanation: "One system you understand beats two you half-understand.",
    },
    {
      question: "What does every semantic query cost before the database is touched?",
      options: [
        "Nothing",
        "An embedding call for the query text, adding latency and money",
        "A table scan",
        "An index rebuild",
      ],
      correctIndex: 1,
      explanation: "Which is why autocomplete should stay keyword-based.",
    },
    {
      question: "What is the trade-off of an HNSW vector index?",
      options: [
        "Storage only",
        "It is approximate: a little recall traded for a lot of speed",
        "Slower queries",
        "No trade-off",
      ],
      correctIndex: 1,
      explanation: "A result that should rank fourth occasionally will not come back.",
    },
    {
      question: "What does switching embedding models require?",
      options: [
        "A re-embed",
        "A schema change for the new dimension, a backfill and a re-index",
        "A config change",
        "Nothing",
      ],
      correctIndex: 1,
      explanation: "`vector(1536)` will not accept 3072-dimension vectors.",
    },
    {
      question: "What is the main pattern where semantic search wins?",
      options: [
        "Short queries",
        "The user describes an outcome while your content uses a technical term",
        "Exact identifiers",
        "Numeric filters",
      ],
      correctIndex: 1,
      explanation: "That vocabulary gap is exactly what embeddings close.",
    },
    {
      question: "What does semantic search give you over a synonym list?",
      options: [
        "Faster queries",
        "The long tail for free, without manually listing every related word",
        "Better filters",
        "Exact matching",
      ],
      correctIndex: 1,
      explanation: "Synonym lists work and are permanent manual labour.",
    },
    {
      question: "Where does semantic search sit on recall versus precision?",
      options: [
        "Better precision",
        "Better recall: it finds what keyword misses, plus things that are merely adjacent",
        "Equal",
        "Worse on both",
      ],
      correctIndex: 1,
      explanation: "Good against zero results, bad when the user knew what they wanted.",
    },
    {
      question: "Why is semantic search wrong for `CP-10460`?",
      options: [
        "It is slow",
        "The user wants that exact record or nothing, and vector search always returns similar ones",
        "Vectors cannot handle hyphens",
        "It is not wrong",
      ],
      correctIndex: 1,
      explanation: "No results is the correct answer for a wrong identifier.",
    },
    {
      question: "Why do short queries suit keyword search?",
      options: [
        "Speed",
        "Three characters carry no context, so the model guesses between unrelated meanings",
        "Vectors reject them",
        "They cannot be embedded",
      ],
      correctIndex: 1,
      explanation: "\"Mac\" could be MacBook, macOS, MAC address or macaroni.",
    },
    {
      question: "How should \"red Nike shoes under $100\" be handled?",
      options: [
        "Pure semantic",
        "Semantic ranking for \"shoes\" plus real column filters for colour, brand and price",
        "Pure keyword",
        "A synonym list",
      ],
      correctIndex: 1,
      explanation: "A £110 shoe is semantically close to a £100 one, and returning it is wrong.",
    },
    {
      question: "What single flaw connects every semantic failure case?",
      options: [
        "Cost",
        "Semantic search cannot say no: it always returns a confident ranked list",
        "Latency",
        "Index size",
      ],
      correctIndex: 1,
      explanation: "And the user cannot tell a good result from a bad one.",
    },
    {
      question: "Why can you not add keyword and vector scores together?",
      options: [
        "They are comparable",
        "BM25 relevance and cosine distance are on different scales, so the sum is meaningless",
        "One is always higher",
        "You can",
      ],
      correctIndex: 1,
      explanation: "Reciprocal rank fusion uses positions instead.",
    },
    {
      question: "What does routing a query before searching save?",
      options: [
        "Index size",
        "The embedding call on queries where semantic adds nothing, which is real traffic",
        "Database load",
        "Storage",
      ],
      correctIndex: 1,
      explanation: "`CP-10460` should never reach a model.",
    },
    {
      question: "What is the decision rule for choosing a strategy?",
      options: [
        "Corpus size",
        "Does the user care about exact words or meaning, and hybrid when both",
        "Query volume",
        "Latency budget",
      ],
      correctIndex: 1,
      explanation: "Exact words means keyword; meaning means semantic.",
    },
    {
      question: "What is the golden rule of this elective?",
      options: [
        "Always use semantic search",
        "Semantic search is not a replacement for traditional search, it is another signal",
        "Always use keyword search",
        "Always use pgvector",
      ],
      correctIndex: 1,
      explanation: "Hybrid plus structured filters is usually the strongest architecture.",
    },
  ],
  project: {
    name: "InvoiceHub — the search box that knows which search to run",
    goal: "Build keyword, semantic and hybrid search over InvoiceHub documents, then run nine real queries through all three and record which one won each time.",
    brief:
      "The self-check is a search page with keyword and semantic paths and combined ranking. <b>Building all three is straightforward. Knowing which to run is the actual skill</b>, and the only way to learn it is to see the same query answered three ways and notice which answer you would want.\n\nThe architecture:\n\n```text\n              search query\n                   │\n           ┌───────┴───────┐\n           ▼               ▼\n     keyword search   semantic search\n           │               │\n           └───────┬───────┘\n                   ▼\n            ranked results\n```\n\nThe schema:\n\n```text\ndocuments\n─────────\nid\nteam_id\ntitle\ncontent\nembedding\nembedding_model\n```\n\nAnd the deliverable that matters is not the code. It is <b>a table of nine queries with the winning strategy for each and one sentence saying why</b>, because that table is the thing you will still be using in two years when the models have all changed.",
    steps: [
      "Set up the schema with pgvector: a `documents` table with `title`, `content`, a `vector(1536)` embedding, an `embedding_model` column and a `team_id`. Add an HNSW index. Note in a comment that the index is approximate.",
      "Seed a corpus of at least sixty documents with real variety: support tickets with references like `CP-10460`, invoices like `INV-2026-00982`, help articles about queues and background jobs, product descriptions, and a few client names. You need this variety or every query will look the same.",
      "Embed on write in a queued job, from `title` plus `content`, storing the model name alongside. Confirm no embedding happens in a web request.",
      "Build `KeywordSearch`: full-text or `LIKE` over title and content, scoped by `team_id`, with filters and a limit. This is your baseline and it must be genuinely good, not a straw man.",
      "Build `SemanticSearch`: embed the query (cached by hash and model), `whereVectorSimilarTo`, scoped by `team_id` and `embedding_model`, with a distance threshold so it can return nothing.",
      "Build `QueryClassifier` that detects exact shapes: `XX-1234` references, `INV-YYYY-NNNNN`, emails, URLs, phone numbers, bare long numbers, version strings, and anything under three words. Test it with twenty inputs, half of each kind.",
      "Build `HybridSearch` that routes exact queries straight to keyword, and for everything else runs both searches and fuses them with reciprocal rank fusion. Apply the same filters and the same `team_id` scope to <b>both</b> sides, or the fused list will contain records the filters excluded.",
      "Build one search endpoint with pagination and filters, plus a `?strategy=` parameter you can force to `keyword`, `semantic` or `hybrid`. That parameter is what makes the next step possible.",
      "NOW RUN THE COMPARISON. Nine queries, three strategies each, twenty-seven result sets: `CP-10460` · `INV-2026-00982` · `rajan@example.com` · `Mac` · `Laravel queues` · `how do I run work in the background?` · `lightweight laptop for programming` · `Nike shoes under $100` · `CP-10460 queue issue`. Record the top three results for each.",
      "Write the table: query, winning strategy, one sentence why. Then find the queries where semantic search returned a confident, entirely wrong list, and note what the user would have thought looking at it.",
      "Add the operational pieces: queue the index sync, add a fallback so a search-engine or embedding failure degrades to keyword rather than 500ing, and confirm soft-deleted documents do not appear in results.",
      "Write tests for the classifier (exact shapes route to keyword), the tenant scope (one team never sees another's documents through any strategy), the threshold (a nonsense query returns nothing rather than five documents), and the fallback (embedding failure still returns keyword results).",
    ],
    acceptance: [
      "Embeddings are generated in a queued job, never in a web request, and cached by hash plus model for queries.",
      "Every search path scopes by `team_id` inside the query, and a test proves one team cannot see another's documents through keyword, semantic or hybrid.",
      "The classifier routes all seven exact shapes to keyword, verified by tests, and those queries never trigger an embedding call.",
      "Semantic search has a distance threshold and returns an empty result for a query with no relevant documents.",
      "Hybrid fusion uses ranks rather than raw scores, and both sides receive identical filters.",
      "Pagination works and handles the case where no further pages exist.",
      "A search-engine or embedding failure degrades to keyword search instead of returning a 500.",
      "Soft-deleted documents are absent from all three strategies.",
      "The comparison table exists: nine queries, the winning strategy, and one sentence of reasoning each.",
      "You can point to at least two queries where semantic search returned a confident, entirely wrong result set.",
    ],
    stretch: [
      "Time all twenty-seven searches and add a latency column to your table. Then add a cost column using your provider's embedding price. The gap between the keyword row and the semantic row on `CP-10460` is the entire argument for routing.",
      "Remove the distance threshold and re-run the nonsense query. Look at the five documents it confidently returns and ask whether a user could tell they were wrong. That is the failure mode this elective exists for.",
      "Add a synonym list to your keyword search for five terms, then find a query where semantic search handles a synonym you did not think to add. That difference is the long tail.",
      "Break the index deliberately: update a document with raw SQL, then search for its old content and watch it come back. Fix it with `->searchable()` and note where else in your codebase that could happen.",
      "Try the same nine queries after switching your embedding model in config, without re-embedding. Watch what happens when vectors from two spaces sit in one column, and then write the migration you would actually need.",
    ],
  },
};
