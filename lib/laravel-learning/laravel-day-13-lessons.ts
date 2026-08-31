import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_13_LESSONS: LessonDay = {
  day: 13,
  title: "Query Builder & pagination",
  totalMinutes: 95,
  difficulty: "Beginner",
  lessons: [
    {
      id: "query-builder-and-db-table",
      title: "The Query Builder, and picking your columns",
      durationMinutes: 10,
      explanation: "Yesterday you wrote SQL by hand and were told the Query Builder was coming. Here it is.\n\n<b>The <i>Query Builder</i></b> (Laravel's fluent way of composing a database query in PHP) turns this:\n\n```sql\nSELECT *\nFROM users\nWHERE active = true\nORDER BY created_at DESC;\n```\n\ninto this:\n\n```php\nDB::table('users')\n    ->where('active', true)\n    ->orderByDesc('created_at')\n    ->get();\n```\n\n```text\nYour PHP Code\n      ↓\nLaravel Query Builder\n      ↓\nSQL Query\n      ↓\nDatabase\n      ↓\nResults\n```\n\nSame query, built in pieces you can add to conditionally, with every value bound for you.\n\n---\n\n### 1. Basic — `DB::table()` and `get()`\n\n```php\nuse Illuminate\\Support\\Facades\\DB;\n\n$users = DB::table('users')->get();\n```\n\n```text\nDB::table('users')\n       ↓\n   users table\n       ↓\n      get()\n       ↓\n   the rows\n```\n\nTwo halves to notice. `DB::table('users')` starts a query and returns a builder, and every method after it returns the same builder, which is why they chain. Nothing touches the database until the last call.\n\n<b>`get()` is what runs the query.</b> Until you call it, or one of its siblings, you are holding a description of a query and nothing more:\n\n```text\nDB::table('users')->where(...)      nothing has run yet\n           ↓\n         get()                      now the database is asked\n```\n\nThat is what lets you build a query up over several lines and several `if` statements before executing it.\n\nThe methods that actually run something:\n\n```text\nget()      all matching rows\nfirst()    the first row, or null\nvalue()    a single column from the first row\npluck()    one column from every row\nfind()     the row with this primary key\ncount()    a number\nexists()   true or false\n```\n\n---\n\n### 2. Intermediate — Query Builder or Eloquent?\n\nTomorrow brings Eloquent, so it is worth knowing now why both exist.\n\n```text\nDatabase\n   │\n   ├── Query Builder  →  DB::table('users')->get()\n   │\n   └── Eloquent       →  User::all()\n```\n\nEloquent gives you model objects: relationships, accessors, events, scopes. The Query Builder gives you rows. Neither is more advanced than the other, they answer different questions.\n\nReach for the Query Builder when:\n\n```text\nReports and dashboards\nComplex joins across several tables\nAggregations: counts, sums, averages\nLarge datasets you do not want as objects\nAnything where model behaviour is just overhead\n```\n\nAnd for the rest of an application, Eloquent will read better. The good news is that they are the same builder underneath, so everything you learn today works on an Eloquent query too.\n\n---\n\n### 3. Advanced — choosing columns\n\nBy default you get every column. `select()` narrows it:\n\n```php\n$users = DB::table('users')\n    ->select('id', 'name', 'email')\n    ->get();\n```\n\n```sql\nSELECT id, name, email FROM users;\n```\n\nWorth doing on wide tables. A `users` table with a long `bio` column costs real bandwidth when you only wanted the name.\n\nFor anything the builder cannot express, there is `selectRaw()`:\n\n```php\n$totals = DB::table('orders')\n    ->selectRaw('COUNT(*) as total')\n    ->get();\n```\n\nThat string is passed to the database as written, which is exactly why it is powerful and exactly why it needs care. Yesterday's rule has not changed: <b>a raw expression must never contain user input.</b> A hard-coded `COUNT(*)` is safe; a column name that arrived in a request is not.",
      diagram: `From PHP to rows

  Your PHP Code
        ↓
  Laravel Query Builder
        ↓
  SQL Query
        ↓
  Database
        ↓
  Results

  DB::table('users')          SELECT *
      ->where('active', 1)      FROM users
      ->orderByDesc('id')       WHERE active = 1
      ->get();                  ORDER BY id DESC


Nothing runs until you ask

  DB::table('users')->where(...)->orderBy(...)
                                      ↓
                          still just a description
                                      ↓
                                   get()
                                      ↓
                            now the database is asked

  Runs the query:  get()  first()  value()  pluck()
                   find()  count()  exists()


Query Builder or Eloquent

  Database
     │
     ├── Query Builder   DB::table('users')->get()    rows
     │
     └── Eloquent        User::all()                  objects

  Query Builder suits    reports, joins, aggregates,
                         large datasets, no model behaviour needed

  Same builder underneath, so today's methods work on both.`,
      codeExample: {
        title: "Starting a query and choosing columns",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- Every row, every column ----------

$users = DB::table('users')->get();

foreach ($users as $user) {
    echo $user->name;
}


// ---------- Only the columns you need ----------

$users = DB::table('users')
    ->select('id', 'name', 'email')
    ->get();

// SELECT id, name, email FROM users


// ---------- The methods that actually run the query ----------

DB::table('users')->get();                    // all matching rows
DB::table('users')->first();                  // one row, or null
DB::table('users')->find(1);                  // by primary key
DB::table('users')->value('email');           // one column, first row
DB::table('users')->pluck('email');           // one column, every row
DB::table('users')->count();                  // a number
DB::table('users')->where('id', 1)->exists(); // true / false


// ---------- Build it up, then run it ----------

$query = DB::table('users')->select('id', 'name');

if ($onlyActive) {
    $query->where('active', true);   // still nothing has run
}

$users = $query->get();              // now it runs


// ---------- Raw expressions ----------

// Safe: the expression is written by you, not by a user.
$totals = DB::table('orders')
    ->selectRaw('COUNT(*) as total')
    ->get();

// ❌ Never: the column name came from the request.
DB::table('orders')->selectRaw(request('column'));`,
      },
      keyTakeaways: [
        "<b>The Query Builder composes a database query in PHP</b>, binding every value for you.",
        "`DB::table('users')` starts a query, and each method returns the builder, which is why calls chain.",
        "<b>Nothing touches the database until you call `get()`</b> or one of its siblings.",
        "`first()`, `value()`, `pluck()`, `find()`, `count()` and `exists()` also run the query.",
        "Because the query only runs at the end, you can build it across several `if` statements.",
        "<b>The Query Builder returns rows; Eloquent returns model objects.</b> They share the same builder underneath.",
        "Query Builder suits reports, joins, aggregations and large datasets where model behaviour is overhead.",
        "`select()` narrows the columns, and <b>`selectRaw()` passes SQL through untouched, so it must never contain user input.</b>",
      ],
      commonMistakes: [
        "<b>Forgetting `get()`.</b> You end up with a builder object rather than rows, and no query ever runs.",
        "<b>Expecting Eloquent behaviour from `DB::table()`.</b> There are no relationships, accessors or model events.",
        "<b>Selecting every column out of habit.</b> On a wide table you are paying for text you never read.",
        "<b>Putting a request value inside `selectRaw()`.</b> Raw means raw, and that is an injection.",
        "<b>Calling `get()` and then filtering in PHP.</b> Let the database do the filtering; that is what it is for.",
      ],
      quiz: [
        {
          question: "When does `DB::table('users')->where('active', true)` hit the database?",
          options: [
            "As soon as `table()` is called",
            "When `where()` is called",
            "Not until you call `get()` or a similar method",
            "At the end of the request",
          ],
          correctIndex: 2,
          explanation: "Which is what lets you build a query up conditionally before running it.",
        },
        {
          question: "What is the main difference between `DB::table('users')->get()` and `User::all()`?",
          options: [
            "One is faster",
            "The Query Builder returns rows; Eloquent returns model objects",
            "Only Eloquent can filter",
            "They return identical objects",
          ],
          correctIndex: 1,
          explanation: "Same builder underneath, different thing handed back.",
        },
        {
          question: "When is the Query Builder usually the better choice?",
          options: [
            "For every query in the application",
            "For reports, complex joins and aggregations",
            "Only inside migrations",
            "Only when Eloquent is unavailable",
          ],
          correctIndex: 1,
          explanation: "Model behaviour is overhead when all you want is numbers.",
        },
        {
          question: "What must never appear inside `selectRaw()`?",
          options: [
            "A column alias",
            "An aggregate function",
            "User input",
            "A table name",
          ],
          correctIndex: 2,
          explanation: "Raw SQL is passed through as written, so user input there is an injection.",
        },
      ],
    },
    {
      id: "filtering-with-where",
      title: "where(), orWhere(), nesting & when()",
      durationMinutes: 12,
      explanation: "Filtering is most of what a query does, so this lesson is the one you will use every day.\n\n---\n\n### 1. Basic — the three forms of `where()`\n\n```php\n$users = DB::table('users')\n    ->where('active', true)\n    ->get();\n```\n\n```text\nusers\n   ↓\nactive = true\n   ↓\nmatching users\n```\n\nTwo arguments means equals. Three arguments lets you choose the operator:\n\n```php\n->where('age', 30)             // age = 30\n->where('age', '>', 18)        // age > 18\n->where('status', '=', 'active')\n```\n\n```text\nwhere(column, value)              equals\nwhere(column, operator, value)    anything else\n```\n\nThe operators are the SQL ones: `=`, `!=`, `>`, `>=`, `<`, `<=`, `like`.\n\n<b>Every value you pass is bound</b>, whichever form you use. That is the quiet reason to prefer the builder over hand-written SQL: the safe thing is also the easy thing.\n\n---\n\n### 2. Intermediate — AND, OR, and the parentheses problem\n\nCall `where()` twice and you get `AND`:\n\n```php\n->where('active', true)\n->where('age', '>=', 18)\n```\n\n```text\nactive = true\n      AND\nage >= 18\n```\n\n`orWhere()` gives you `OR`:\n\n```php\n->where('role', 'admin')\n->orWhere('role', 'manager')\n```\n\nAnd now the trap. Mix them carelessly and you get a query that looks right and is not:\n\n```php\n// ❌ Not what you meant\n->where('active', true)\n->where('role', 'admin')\n->orWhere('role', 'manager')\n```\n\nThat reads as `(active AND admin) OR manager`, so every manager comes back, active or not. In SQL you would reach for brackets:\n\n```sql\nWHERE active = true\nAND (role = 'admin' OR role = 'manager')\n```\n\nIn the builder, <b>a closure is the brackets</b>:\n\n```php\n->where('active', true)\n->where(function ($query) {\n    $query->where('role', 'admin')\n          ->orWhere('role', 'manager');\n})\n```\n\n```text\nactive = true\n     AND\n┌───────────────────────┐\n│ role = admin          │\n│        OR             │\n│ role = manager        │\n└───────────────────────┘\n```\n\nThe rule to carry: <b>the moment a query mixes `AND` and `OR`, group the `OR` part in a closure.</b>\n\n---\n\n### 3. Advanced — `when()`, for filters that may not be there\n\nA search page has filters the user might not have used. The obvious version breaks the chain:\n\n```php\n$query = DB::table('users');\n\nif ($status) {\n    $query->where('status', $status);\n}\n\n$users = $query->get();\n```\n\n`when()` keeps it in one expression:\n\n```php\n$users = DB::table('users')\n    ->when($status, function ($query, $status) {\n        $query->where('status', $status);\n    })\n    ->get();\n```\n\n```text\nstatus provided?\n      │\n   ┌──┴──┐\n  YES    NO\n   ↓      ↓\n where   skip\n```\n\nThe first argument is the condition. If it is truthy the closure runs, and the value is handed to it as the second parameter so you do not have to `use` it.\n\nOne thing to be careful about: <b>`when()` tests for truthiness</b>. A filter whose valid value is `0` or an empty string will be skipped, so check explicitly in that case:\n\n```php\n->when($minAge !== null, fn ($query) => $query->where('age', '>=', $minAge))\n```\n\nThere is also a second closure for the else branch:\n\n```php\n->when(\n    $sort,\n    fn ($query, $sort) => $query->orderBy($sort),\n    fn ($query) => $query->orderByDesc('created_at'),\n)\n```\n\nThree or four optional filters in a row is where `when()` earns its place, and it is exactly the shape of every admin list page you will ever build.",
      diagram: `The two shapes of where()

  where(column, value)              age = 30
  where(column, operator, value)    age > 18

  operators:  =  !=  >  >=  <  <=  like

  Every value is bound for you, in both forms.


AND is free. OR needs care.

  ->where('active', true)
  ->where('age', '>=', 18)          active = true AND age >= 18

  ❌ ->where('active', true)
     ->where('role', 'admin')
     ->orWhere('role', 'manager')

     reads as  (active AND admin) OR manager
     so every manager comes back, active or not

  ✓ ->where('active', true)
    ->where(function (\$query) {
        \$query->where('role', 'admin')
              ->orWhere('role', 'manager');
    })

     active = true
          AND
     ┌───────────────────────┐
     │ role = admin          │
     │        OR             │
     │ role = manager        │
     └───────────────────────┘

  A closure IS the brackets.


when(): filters that may not be there

  status provided?
        │
     ┌──┴──┐
    YES    NO
     ↓      ↓
   where   skip

  Careful: when() tests truthiness, so 0 and ''
  are treated as "not provided".`,
      codeExample: {
        title: "Filtering, grouping conditions, and optional filters",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- Equals, and everything else ----------

DB::table('users')->where('age', 30)->get();
DB::table('users')->where('age', '>', 18)->get();
DB::table('users')->where('name', 'like', 'Raj%')->get();


// ---------- AND ----------

$users = DB::table('users')
    ->where('active', true)
    ->where('age', '>=', 18)
    ->get();

// WHERE active = 1 AND age >= 18


// ---------- OR, and the mistake it invites ----------

// ❌ (active AND admin) OR manager  --  inactive managers included
DB::table('users')
    ->where('active', true)
    ->where('role', 'admin')
    ->orWhere('role', 'manager')
    ->get();

// ✓ active AND (admin OR manager)
DB::table('users')
    ->where('active', true)
    ->where(function ($query) {
        $query->where('role', 'admin')
              ->orWhere('role', 'manager');
    })
    ->get();


// ---------- Optional filters ----------

$status = request('status');

$users = DB::table('users')
    ->when($status, function ($query, $status) {
        // Only runs when $status is truthy.
        // The value arrives as the second parameter.
        $query->where('status', $status);
    })
    ->get();


// A filter whose valid value might be 0 or '' needs an explicit test.
->when($minAge !== null, fn ($query) => $query->where('age', '>=', $minAge))


// ---------- The shape of a real filter page ----------

$users = DB::table('users')
    ->when(request('search'), fn ($q, $search) =>
        $q->where('name', 'like', "%{$search}%"))
    ->when(request('role'), fn ($q, $role) =>
        $q->where('role', $role))
    ->when(request('active'), fn ($q) =>
        $q->where('active', true))
    ->get();`,
      },
      keyTakeaways: [
        "<b>`where(column, value)` means equals</b>; a third argument lets you pick the operator.",
        "The operators are the SQL ones: `=`, `!=`, `>`, `>=`, `<`, `<=` and `like`.",
        "<b>Every value passed to the builder is bound</b>, so the easy way is also the safe way.",
        "<b>Calling `where()` repeatedly gives you `AND`</b>; `orWhere()` gives you `OR`.",
        "Mixing them without grouping produces `(A AND B) OR C`, which is almost never what you meant.",
        "<b>A closure passed to `where()` is the parentheses</b>, so group the `OR` part inside one.",
        "<b>`when()` applies a filter only when its condition is truthy</b>, and hands the value to the closure.",
        "`when()` tests truthiness, so a filter whose valid value is `0` or `''` needs an explicit comparison.",
      ],
      commonMistakes: [
        "<b>Mixing `where()` and `orWhere()` without a closure.</b> The `OR` escapes and widens the whole query.",
        "<b>Passing an operator as the second argument of a two-argument `where()`.</b> It is read as the value.",
        "<b>Using `when(request('page'))` for a value that can legitimately be `0`.</b> Zero is falsy, so the filter never applies.",
        "<b>Breaking the chain with `if` statements everywhere.</b> `when()` keeps a filter page readable.",
        "<b>Writing `where('name', 'like', $search)` and forgetting the `%` wildcards.</b> It becomes an exact match.",
      ],
      quiz: [
        {
          question: "What does calling `where()` twice produce?",
          options: ["An OR condition", "An AND condition", "The second replaces the first", "An error"],
          correctIndex: 1,
          explanation: "`orWhere()` is how you ask for OR.",
        },
        {
          question: "How do you express `active = true AND (role = 'admin' OR role = 'manager')`?",
          options: [
            "Three chained `where()` calls",
            "`where()` then `orWhere()` twice",
            "`where('active', true)` then `where()` with a closure containing the OR",
            "It cannot be done in the builder",
          ],
          correctIndex: 2,
          explanation: "The closure is what produces the parentheses.",
        },
        {
          question: "What does `when($status, ...)` do?",
          options: [
            "Runs the closure only when `$status` is truthy",
            "Always runs the closure",
            "Runs the closure after the query executes",
            "Caches the result per status",
          ],
          correctIndex: 0,
          explanation: "Which is what keeps optional filters inside the chain.",
        },
        {
          question: "Why can `when()` be wrong for a filter whose value might be `0`?",
          options: [
            "Zero is not a valid column value",
            "`when()` tests truthiness, and `0` is falsy, so the filter is skipped",
            "It would apply the filter twice",
            "The builder rejects integers",
          ],
          correctIndex: 1,
          explanation: "Pass an explicit comparison like `$value !== null` instead.",
        },
      ],
    },
    {
      id: "specialised-where-clauses",
      title: "whereIn, ranges, NULL, dates & ordering",
      durationMinutes: 11,
      explanation: "`where()` handles one column against one value. These handle everything else, and each one exists because writing it by hand is fiddly and easy to get wrong.\n\n---\n\n### 1. Basic — one of several, or somewhere in a range\n\n<b>`whereIn()`</b> matches any value in a list:\n\n```php\n->whereIn('role', ['admin', 'manager', 'editor'])\n```\n\n```text\nrole IN (admin, manager, editor)\n```\n\nWhich beats three `orWhere()` calls, and beats them by more as the list grows. `whereNotIn()` is the opposite.\n\n<b>`whereBetween()`</b> matches a range, and it includes both ends:\n\n```php\n->whereBetween('age', [18, 30])\n```\n\n```text\n18 ─────────────── 30\n     ↑\n   match\n```\n\nEighteen and thirty are both in. Useful for prices, dates, ages, scores, anything with a low and a high.\n\nBoth take arrays, and both bind every element, so a `whereIn()` built from request data is safe as long as the array itself is what you expect.\n\n---\n\n### 2. Intermediate — NULL and dates\n\n`NULL` is not a value you can compare with `=`. SQL needs `IS NULL`, and the builder has a method for it:\n\n```php\n->whereNull('deleted_at')\n->whereNotNull('email_verified_at')\n```\n\n```text\ndeleted_at IS NULL              never soft-deleted\nemail_verified_at IS NOT NULL   has confirmed their email\n```\n\n<b>`->where('deleted_at', null)` is not the same thing</b> and will not match. This is the one that catches people, because it looks perfectly reasonable.\n\nDates have their own problem. A `created_at` holds a moment, not a day:\n\n```text\ncreated_at\n2026-09-01 14:35:20\n       ↓\ndate portion\n2026-09-01\n```\n\nSo comparing it to `'2026-09-01'` matches only rows created at exactly midnight. `whereDate()` compares the date part:\n\n```php\n->whereDate('created_at', '2026-09-01')\n```\n\nThe family: `whereDate()`, `whereMonth()`, `whereDay()`, `whereYear()`, `whereTime()`.\n\n---\n\n### 3. Advanced — comparing two columns, and ordering\n\nEverything so far compares a column against a PHP value. <b>`whereColumn()`</b> compares two columns:\n\n```php\n$orders = DB::table('orders')\n    ->whereColumn('updated_at', '>', 'created_at')\n    ->get();\n```\n\n```text\ncolumn ↔ column        whereColumn()\ncolumn ↔ PHP value     where()\n```\n\nThat query finds orders that have been changed since they were made. Written with `where()` you would be comparing against the string `'created_at'`, which matches nothing.\n\nThen ordering:\n\n```php\n->orderBy('created_at')            // ascending\n->orderBy('created_at', 'desc')\n->orderByDesc('created_at')        // the same thing, more readable\n```\n\n```text\nNewest\n  ↓\nUser 5\nUser 4\nUser 3\nUser 2\nUser 1\n  ↓\nOldest\n```\n\nOrder by more than one column by calling it more than once, and the order of the calls is the order of precedence:\n\n```php\n->orderBy('role')->orderByDesc('created_at')\n```\n\nOne habit worth forming now, because it matters for pagination later: <b>an order that is not unique is not stable.</b> Sorting a thousand rows by `created_at` alone, where several share a timestamp, lets the database return those in any order it likes, and a row can appear on two pages or none. Adding `id` as a tie-breaker fixes it:\n\n```php\n->orderByDesc('created_at')->orderBy('id')\n```",
      diagram: `Matching a list or a range

  ->whereIn('role', ['admin', 'manager', 'editor'])

     role IN (admin, manager, editor)
     beats three orWhere() calls, and scales

  ->whereBetween('age', [18, 30])

     18 ─────────────── 30
          ↑
        match          both ends included


NULL is not a value

  ✓ ->whereNull('deleted_at')            deleted_at IS NULL
  ✓ ->whereNotNull('email_verified_at')  IS NOT NULL

  ❌ ->where('deleted_at', null)          matches nothing


Dates hold a moment, not a day

  created_at
  2026-09-01 14:35:20
         ↓
  whereDate() compares the date part only
         ↓
  2026-09-01

  whereDate  whereMonth  whereDay  whereYear  whereTime


Column against column

  where()         column ↔ PHP value
  whereColumn()   column ↔ column

  ->whereColumn('updated_at', '>', 'created_at')
     orders that have changed since they were made


Ordering, and why a tie-breaker matters

  ->orderByDesc('created_at')          not unique
        ↓
  rows sharing a timestamp can come back in ANY order
        ↓
  a row appears on two pages, or none

  ->orderByDesc('created_at')->orderBy('id')    stable`,
      codeExample: {
        title: "The specialised where clauses",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- One of several values ----------

DB::table('users')
    ->whereIn('role', ['admin', 'manager', 'editor'])
    ->get();

DB::table('users')
    ->whereNotIn('status', ['banned', 'deleted'])
    ->get();


// ---------- A range, inclusive at both ends ----------

DB::table('users')
    ->whereBetween('age', [18, 30])
    ->get();

DB::table('orders')
    ->whereBetween('created_at', [$start, $end])
    ->get();


// ---------- NULL ----------

DB::table('users')->whereNull('deleted_at')->get();
DB::table('users')->whereNotNull('email_verified_at')->get();

// ❌ Matches nothing: NULL cannot be compared with =
DB::table('users')->where('deleted_at', null)->get();


// ---------- Dates ----------

// created_at is 2026-09-01 14:35:20, so a plain where() on the
// date string would only match rows created at midnight.
DB::table('users')->whereDate('created_at', '2026-09-01')->get();

DB::table('orders')->whereYear('created_at', 2026)->get();
DB::table('orders')->whereMonth('created_at', 9)->get();


// ---------- Column against column ----------

$changed = DB::table('orders')
    ->whereColumn('updated_at', '>', 'created_at')
    ->get();

// Orders that have been modified since they were placed.


// ---------- Ordering ----------

DB::table('users')->orderBy('created_at')->get();        // ascending
DB::table('users')->orderBy('created_at', 'desc')->get();
DB::table('users')->orderByDesc('created_at')->get();    // clearer

// Several columns: call order matters.
DB::table('users')
    ->orderBy('role')
    ->orderByDesc('created_at')
    ->get();

// Always finish with something unique, or paging will duplicate
// and skip rows that share a timestamp.
DB::table('posts')
    ->orderByDesc('created_at')
    ->orderBy('id')
    ->get();`,
      },
      keyTakeaways: [
        "<b>`whereIn()` matches any value in a list</b>, and reads far better than a chain of `orWhere()` calls.",
        "<b>`whereBetween()` matches a range and includes both ends.</b>",
        "<b>`NULL` cannot be compared with `=`</b>, so `where('deleted_at', null)` matches nothing.",
        "Use `whereNull()` and `whereNotNull()` instead, which produce `IS NULL` and `IS NOT NULL`.",
        "<b>A timestamp column holds a moment, not a day</b>, so comparing it to a date string only matches midnight.",
        "`whereDate()`, `whereMonth()`, `whereDay()`, `whereYear()` and `whereTime()` compare the part you mean.",
        "<b>`whereColumn()` compares two columns</b>, where `where()` compares a column against a PHP value.",
        "<b>An ordering that is not unique is not stable</b>, so add `id` as a tie-breaker before you paginate.",
      ],
      commonMistakes: [
        "<b>Writing `where('deleted_at', null)`.</b> It produces `= NULL`, which is never true.",
        "<b>Comparing a timestamp column to a date string with `where()`.</b> Only rows created at exactly midnight match.",
        "<b>Using `where('updated_at', '>', 'created_at')`.</b> That compares against the literal text, not the column.",
        "<b>Chaining `orWhere()` for a list of values.</b> `whereIn()` is shorter and does not need grouping.",
        "<b>Paginating on `created_at` alone.</b> Rows sharing a timestamp get duplicated or skipped between pages.",
      ],
      quiz: [
        {
          question: "How do you find rows where `deleted_at` has no value?",
          options: [
            "`where('deleted_at', null)`",
            "`where('deleted_at', '=', 'NULL')`",
            "`whereNull('deleted_at')`",
            "`whereNotNull('deleted_at')`",
          ],
          correctIndex: 2,
          explanation: "`NULL` cannot be compared with `=`, so SQL needs `IS NULL`.",
        },
        {
          question: "Why use `whereDate()` rather than `where()` on a `created_at` column?",
          options: [
            "It is faster",
            "`created_at` holds a time too, so `where()` only matches midnight exactly",
            "`where()` cannot take a string",
            "It formats the output",
          ],
          correctIndex: 1,
          explanation: "`whereDate()` compares only the date part of the timestamp.",
        },
        {
          question: "What does `whereColumn('updated_at', '>', 'created_at')` do?",
          options: [
            "Compares `updated_at` with the text `created_at`",
            "Compares the two columns against each other",
            "Orders by both columns",
            "Filters rows where either is null",
          ],
          correctIndex: 1,
          explanation: "`where()` would compare against the literal string and match nothing.",
        },
        {
          question: "Why add `orderBy('id')` after `orderByDesc('created_at')`?",
          options: [
            "To sort by id first",
            "To make the ordering stable when rows share a timestamp",
            "It is required by the builder",
            "To improve index usage",
          ],
          correctIndex: 1,
          explanation: "Without a unique tie-breaker, paging can duplicate and skip rows.",
        },
      ],
    },
    {
      id: "grouping-and-aggregates",
      title: "Aggregates, groupBy() & having()",
      durationMinutes: 11,
      explanation: "So far every query has returned rows. These return answers: how many, how much, what is the average.\n\n---\n\n### 1. Basic — the five aggregates\n\n```php\n$count   = DB::table('users')->count();\n$total   = DB::table('orders')->sum('amount');\n$average = DB::table('orders')->avg('amount');\n$lowest  = DB::table('orders')->min('amount');\n$highest = DB::table('orders')->max('amount');\n```\n\n```text\n             Orders\n                │\n     ┌──────────┼──────────┐\n     ↓          ↓          ↓\n    avg        min        max\n```\n\nEach of these runs the query and hands back a single number, not a collection. And each of them accepts every filter you have already learned:\n\n```php\nDB::table('orders')\n    ->where('status', 'completed')\n    ->whereBetween('created_at', [$start, $end])\n    ->sum('amount');\n```\n\nThe database does the adding up. Fetching ten thousand rows to add them in PHP does the same job in a fraction of the speed and a great deal more memory.\n\n---\n\n### 2. Intermediate — `groupBy()`, one answer per group\n\nAn aggregate on its own gives you one number for the whole table. <b>`groupBy()`</b> gives you one per group:\n\n```text\norders\n\nuser_id | amount\n--------|-------\n1       | 100\n1       | 200\n2       | 150\n2       | 50\n```\n\nGrouped by `user_id` and summed:\n\n```text\nuser_id | total\n--------|------\n1       | 300\n2       | 200\n```\n\nIn the builder, the aggregate becomes a selected column rather than a method on the end:\n\n```php\nDB::table('orders')\n    ->select('user_id')\n    ->selectRaw('SUM(amount) as total')\n    ->groupBy('user_id')\n    ->get();\n```\n\nThat is the shape of every report you will ever write, so it is worth reading twice.\n\nOne rule the database will enforce for you: <b>every plain column you select must also be grouped by.</b> Selecting `name` without grouping by it is asking which of the many names in the group you meant, and the database has no answer.\n\n---\n\n### 3. Advanced — `having()`, and why it is not `where()`\n\n<b>`having()`</b> filters the groups after they have been formed:\n\n```php\nDB::table('orders')\n    ->select('user_id')\n    ->selectRaw('COUNT(*) as total_orders')\n    ->groupBy('user_id')\n    ->having('total_orders', '>', 10)\n    ->get();\n```\n\n```text\norders\n  ↓\ngroupBy(user_id)\n  ↓\nCOUNT(*)\n  ↓\nhaving total_orders > 10\n  ↓\nresults\n```\n\nThe distinction is the whole lesson:\n\n```text\nWHERE      filters individual rows      before grouping\nGROUP BY   forms the groups\nHAVING     filters whole groups         after grouping\n```\n\nSo they answer different questions and often appear together:\n\n```text\nWHERE amount > 100          keep only the large orders\n       ↓\nGROUP BY user_id            one group per customer\n       ↓\nHAVING COUNT(*) > 5         keep customers with more than five of them\n```\n\nThe practical test: if the condition is about one row, it is a `where()`. If it is about the aggregate, it has to be a `having()`, because at `where()` time the aggregate does not exist yet.\n\nAnd because `where()` runs first, it is also the cheaper place to filter. Narrow the rows before grouping wherever the logic allows it.",
      diagram: `Five answers instead of rows

               Orders
                  │
      ┌────────┬──┴──┬────────┐
      ↓        ↓     ↓        ↓
    count    sum    avg   min / max

  Each runs the query and returns ONE number.
  Each accepts every filter you already know.

  Let the database add up. Fetching 10,000 rows
  to sum them in PHP is slower and far heavier.


groupBy: one answer per group

  orders                      grouped by user_id, summed

  user_id | amount            user_id | total
  --------|-------            --------|------
  1       | 100        →      1       | 300
  1       | 200               2       | 200
  2       | 150
  2       |  50

  ->select('user_id')
  ->selectRaw('SUM(amount) as total')
  ->groupBy('user_id')

  Every plain column you select must also be grouped by.


WHERE vs HAVING

  WHERE amount > 100        filters ROWS      before grouping
        ↓
  GROUP BY user_id          forms the groups
        ↓
  HAVING COUNT(*) > 5       filters GROUPS    after grouping

  About one row?        →  where()
  About the aggregate?  →  having()

  where() runs first, so it is also the cheaper place to filter.`,
      codeExample: {
        title: "From a single number to a grouped report",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- One number for the whole table ----------

$count   = DB::table('users')->count();
$total   = DB::table('orders')->sum('amount');
$average = DB::table('orders')->avg('amount');
$lowest  = DB::table('orders')->min('amount');
$highest = DB::table('orders')->max('amount');


// ---------- Aggregates accept every filter ----------

$revenue = DB::table('orders')
    ->where('status', 'completed')
    ->whereBetween('created_at', [$start, $end])
    ->sum('amount');


// ---------- One number per group ----------

$perUser = DB::table('orders')
    ->select('user_id')
    ->selectRaw('SUM(amount) as total')
    ->groupBy('user_id')
    ->get();

// user_id | total
// --------|------
// 1       | 300
// 2       | 200


// ---------- Filtering the groups ----------

$frequent = DB::table('orders')
    ->select('user_id')
    ->selectRaw('COUNT(*) as total_orders')
    ->groupBy('user_id')
    ->having('total_orders', '>', 10)
    ->get();


// ---------- WHERE and HAVING together ----------

$bigSpenders = DB::table('orders')
    ->where('amount', '>', 100)          // filter rows first (cheaper)
    ->groupBy('user_id')
    ->select('user_id')
    ->selectRaw('COUNT(*) as large_orders')
    ->having('large_orders', '>', 5)     // then filter the groups
    ->get();


// ---------- The rule the database enforces ----------

// ❌ Which of the group's many names did you mean?
DB::table('orders')
    ->select('user_id', 'customer_name')
    ->selectRaw('SUM(amount) as total')
    ->groupBy('user_id')
    ->get();

// ✓ Group by everything you select plainly.
DB::table('orders')
    ->select('user_id', 'customer_name')
    ->selectRaw('SUM(amount) as total')
    ->groupBy('user_id', 'customer_name')
    ->get();`,
      },
      keyTakeaways: [
        "<b>`count()`, `sum()`, `avg()`, `min()` and `max()` return a single number</b>, not a collection.",
        "Aggregates accept every filter you already know, so you can total a filtered subset directly.",
        "<b>Let the database aggregate.</b> Fetching thousands of rows to add them in PHP is slower and far heavier.",
        "<b>`groupBy()` turns one answer for the table into one answer per group.</b>",
        "In a grouped query the aggregate becomes a selected column, usually via `selectRaw('SUM(amount) as total')`.",
        "<b>Every plain column you select must also appear in `groupBy()`</b>, or the database cannot say which value you meant.",
        "<b>`where()` filters rows before grouping; `having()` filters whole groups afterwards.</b>",
        "If the condition is about an aggregate it must be `having()`, because at `where()` time the aggregate does not exist yet.",
      ],
      commonMistakes: [
        "<b>Fetching all rows and summing them in PHP.</b> The database does it in one query with almost no memory.",
        "<b>Using `where()` on a `COUNT(*)` alias.</b> It has not been calculated yet, so it has to be `having()`.",
        "<b>Selecting a column you did not group by.</b> The database rejects it, or picks a value at random.",
        "<b>Putting a row-level condition in `having()`.</b> It works, but you have grouped rows you could have excluded first.",
        "<b>Expecting `sum()` to return rows.</b> Aggregates end the chain and hand back a number.",
      ],
      quiz: [
        {
          question: "What does `DB::table('orders')->sum('amount')` return?",
          options: ["A collection of orders", "A single number", "A builder", "An array of totals"],
          correctIndex: 1,
          explanation: "Aggregates run the query and hand back one value.",
        },
        {
          question: "What is the difference between `where()` and `having()`?",
          options: [
            "There is none",
            "`where()` filters rows before grouping; `having()` filters groups after",
            "`having()` is for joins",
            "`where()` only works on indexed columns",
          ],
          correctIndex: 1,
          explanation: "Which is why an aggregate condition has to be `having()`.",
        },
        {
          question: "Why must every plain selected column appear in `groupBy()`?",
          options: [
            "Laravel requires it for readability",
            "Otherwise the database cannot say which of the group's values you meant",
            "To create an index",
            "To keep the ordering stable",
          ],
          correctIndex: 1,
          explanation: "A group holds many rows, so a non-grouped column has no single value.",
        },
        {
          question: "You want customers with more than five orders above 100. Where does each condition go?",
          options: [
            "Both in `where()`",
            "Both in `having()`",
            "`amount > 100` in `where()`, `COUNT(*) > 5` in `having()`",
            "`amount > 100` in `having()`, `COUNT(*) > 5` in `where()`",
          ],
          correctIndex: 2,
          explanation: "Row conditions first, then the aggregate condition on the groups.",
        },
      ],
    },
    {
      id: "joins-and-unions",
      title: "Joins — inner, left, cross & unions",
      durationMinutes: 13,
      explanation: "Yesterday you connected two tables with a foreign key. <b>A <i>join</i></b> (a database operation that combines rows from two tables into one result) is how you query across that connection.\n\n---\n\n### 1. Basic — the inner join\n\n```text\nusers                    posts\n┌────┬───────┐           ┌────┬─────────┬─────────┐\n│ id │ name  │           │ id │ user_id │ title   │\n├────┼───────┤           ├────┼─────────┼─────────┤\n│ 1  │ Rajan │           │ 1  │ 1       │ Laravel │\n│ 2  │ Alice │           │ 2  │ 1       │ PHP     │\n└────┴───────┘           │ 3  │ 2       │ React   │\n                         └────┴─────────┴─────────┘\n```\n\nThe join condition says how the two relate:\n\n```php\n$posts = DB::table('posts')\n    ->join('users', 'posts.user_id', '=', 'users.id')\n    ->select('posts.title', 'users.name')\n    ->get();\n```\n\n```text\ntitle       name\n----------------\nLaravel     Rajan\nPHP         Rajan\nReact       Alice\n```\n\nOne detail that saves an hour later: <b>once you join, qualify your column names.</b> Both tables have an `id` and both may have a `created_at`, so `select('id')` is ambiguous and `select('posts.id')` is not.\n\n<b>An <i>inner join</i></b> returns only rows where both sides match:\n\n```text\nUsers ∩ Posts\n     ↓\nmatching records only\n```\n\nA user with no posts does not appear at all.\n\n---\n\n### 2. Intermediate — left, right and the difference that matters\n\n<b>A <i>left join</i></b> keeps every row from the left table whether or not it matches:\n\n```php\n$users = DB::table('users')\n    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')\n    ->get();\n```\n\n```text\nINNER JOIN               LEFT JOIN\n\nUsers    Posts           Users    Posts\n  ●───────●                ●───────●\n                           ●            ← kept, with NULLs\n  ●───────●                ●───────●\n     ↓                        ↓\nmatches only             ALL users\n                         + matching posts\n```\n\nThis is the distinction that decides whether a report is right or wrong. Counting posts per user with an inner join silently drops every user with zero posts, and the total looks fine until somebody asks why a name is missing.\n\n```text\nOnly rows that match          →  join()\nEvery row on the left,\neven without a match          →  leftJoin()\n```\n\n`rightJoin()` does the same from the other side. It is supported and rarely used, because swapping the table order and writing a left join reads more easily.\n\n<b>A <i>cross join</i></b> produces every combination:\n\n```text\ncolors     sizes          crossJoin\nRed        S              Red  × S\nBlue       M              Red  × M\n                          Blue × S\n                          Blue × M\n```\n\n```php\nDB::table('colors')->crossJoin('sizes')->get();\n```\n\nGenuinely useful for building variant grids, and genuinely dangerous elsewhere: 1,000 rows crossed with 1,000 rows is a million.\n\n---\n\n### 3. Advanced — complex conditions and unions\n\nWhen the join needs more than one condition, pass a closure:\n\n```php\nDB::table('users')\n    ->join('orders', function ($join) {\n        $join->on('users.id', '=', 'orders.user_id')\n             ->where('orders.status', 'completed');\n    })\n    ->get();\n```\n\n```text\nJOIN orders\n     │\n     ├── users.id = orders.user_id\n     │\n     └── orders.status = completed\n```\n\nInside the closure, <b>`on()` compares two columns and `where()` compares a column to a value.</b> Mixing them up is the usual mistake.\n\nThere is a real difference between putting that status condition in the join and putting it in a `where()` after a left join. In the join, non-completed orders simply do not join, and the user still appears with nulls. In a `where()`, the user is filtered out entirely, which quietly turns your left join back into an inner one.\n\nFinally, <b>a <i>union</i></b> stacks the results of two queries:\n\n```php\n$admins = DB::table('users')->where('role', 'admin');\n$managers = DB::table('users')->where('role', 'manager');\n\n$users = $admins->union($managers)->get();\n```\n\n```text\nunion       combines and removes duplicates\nunionAll    combines and keeps them\n```\n\n`unionAll()` is faster because it does not have to compare rows looking for duplicates. Both need the two queries to select compatible columns, in the same order.\n\nFor the example above a `whereIn()` would be simpler. Unions earn their place when the two halves genuinely differ, such as pulling recent activity from two unrelated tables into one feed.",
      diagram: `Inner join: only where both sides match

  users                posts
  ┌────┬───────┐       ┌────┬─────────┬─────────┐
  │ 1  │ Rajan │       │ 1  │ 1       │ Laravel │
  │ 2  │ Alice │       │ 2  │ 1       │ PHP     │
  └────┴───────┘       │ 3  │ 2       │ React   │
                       └────┴─────────┴─────────┘

  ->join('users', 'posts.user_id', '=', 'users.id')

  title       name
  ----------------
  Laravel     Rajan
  PHP         Rajan
  React       Alice

  Once joined, qualify your columns: posts.id, not id.


Inner vs left: the difference that breaks reports

  INNER JOIN               LEFT JOIN

  Users    Posts           Users    Posts
    ●───────●                ●───────●
                             ●            ← kept, columns NULL
    ●───────●                ●───────●
       ↓                        ↓
  matches only             ALL users + matching posts

  Counting posts per user with an inner join
  silently drops every user who has none.


Cross join multiplies

  colors     sizes         Red  × S
  Red        S             Red  × M
  Blue       M             Blue × S
                           Blue × M

  1,000 × 1,000 = 1,000,000 rows. Handle with care.


Condition in the join, or in a where?

  join(..., fn) with where('orders.status', 'completed')
      → non-completed orders do not join, user still appears

  leftJoin(...) then ->where('orders.status', 'completed')
      → user is filtered out entirely
      → your left join just became an inner join

  Inside the closure:  on() compares columns
                       where() compares a column to a value`,
      codeExample: {
        title: "Joining tables, and combining queries",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- Inner join: only matching rows ----------

$posts = DB::table('posts')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->select('posts.title', 'users.name')
    ->get();

// Qualify column names once you join. Both tables have an id.


// ---------- Left join: keep everything on the left ----------

$users = DB::table('users')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->select('users.name')
    ->selectRaw('COUNT(posts.id) as post_count')
    ->groupBy('users.id', 'users.name')
    ->get();

// Users with no posts appear with a count of 0.
// An inner join would have dropped them entirely.


// ---------- Right and cross ----------

DB::table('users')
    ->rightJoin('posts', 'users.id', '=', 'posts.user_id')
    ->get();

// Every colour paired with every size.
DB::table('colors')->crossJoin('sizes')->get();


// ---------- A join with more than one condition ----------

DB::table('users')
    ->join('orders', function ($join) {
        $join->on('users.id', '=', 'orders.user_id')   // column = column
             ->where('orders.status', 'completed');    // column = value
    })
    ->get();


// ---------- The trap ----------

// ✓ Users with no completed orders still appear.
DB::table('users')
    ->leftJoin('orders', function ($join) {
        $join->on('users.id', '=', 'orders.user_id')
             ->where('orders.status', 'completed');
    })
    ->get();

// ❌ The where() filters out the NULL rows, so this is
//    an inner join wearing a left join's clothes.
DB::table('users')
    ->leftJoin('orders', 'users.id', '=', 'orders.user_id')
    ->where('orders.status', 'completed')
    ->get();


// ---------- Unions ----------

$admins   = DB::table('users')->where('role', 'admin');
$managers = DB::table('users')->where('role', 'manager');

$users = $admins->union($managers)->get();      // duplicates removed
$users = $admins->unionAll($managers)->get();   // duplicates kept, faster

// Both queries must select compatible columns in the same order.`,
      },
      keyTakeaways: [
        "<b>A join combines rows from two tables</b> using a condition, usually a foreign key against a primary key.",
        "<b>Qualify column names after a join</b>, because both tables may have `id` and `created_at`.",
        "<b>An inner join returns only rows that match on both sides</b>, so unmatched rows disappear.",
        "<b>A left join keeps every row from the left table</b>, filling the right side with `NULL` where there is no match.",
        "Counting per user with an inner join silently drops everyone with zero, which is how reports go wrong.",
        "`rightJoin()` exists but is rarely used, since swapping the tables and using a left join reads better.",
        "<b>A cross join produces every combination</b>, so row counts multiply and grow very fast.",
        "<b>Inside a join closure, `on()` compares columns and `where()` compares a column to a value</b>, and a `where()` after a left join turns it into an inner join.",
        "<b>`union()` combines two queries and removes duplicates; `unionAll()` keeps them and is faster.</b>",
      ],
      commonMistakes: [
        "<b>Selecting `id` after a join.</b> It is ambiguous, and you get whichever table the database picked.",
        "<b>Using an inner join for a per-row count.</b> Every row with zero matches vanishes from the report.",
        "<b>Filtering a left-joined table in `where()`.</b> The `NULL` rows fail the test, so the left join is undone.",
        "<b>Using `where()` instead of `on()` inside a join closure for a column comparison.</b> It compares against a string.",
        "<b>Reaching for `crossJoin()` without checking the row counts.</b> Two thousand-row tables produce a million rows.",
      ],
      quiz: [
        {
          question: "What does an inner join return?",
          options: [
            "Every row from both tables",
            "Only rows where both sides match",
            "Every row from the left table",
            "Every combination of rows",
          ],
          correctIndex: 1,
          explanation: "Unmatched rows on either side are dropped.",
        },
        {
          question: "You want a post count for every user, including those with none. Which join?",
          options: ["`join()`", "`leftJoin()`", "`crossJoin()`", "`union()`"],
          correctIndex: 1,
          explanation: "An inner join would silently drop users with zero posts.",
        },
        {
          question: "What happens if you `leftJoin('orders', ...)` and then `where('orders.status', 'completed')`?",
          options: [
            "Nothing, the left join still keeps unmatched users",
            "The unmatched rows have NULL status, fail the test, and are removed, making it an inner join",
            "The query fails",
            "The status filter is ignored",
          ],
          correctIndex: 1,
          explanation: "Put the condition inside the join closure to keep the unmatched rows.",
        },
        {
          question: "What is the difference between `union()` and `unionAll()`?",
          options: [
            "`unionAll()` sorts the results",
            "`union()` removes duplicate rows; `unionAll()` keeps them and is faster",
            "`union()` only works on two queries",
            "There is none",
          ],
          correctIndex: 1,
          explanation: "Removing duplicates means comparing rows, which costs time.",
        },
      ],
    },
    {
      id: "writes-and-raw-expressions",
      title: "Insert, update, delete, upsert & raw expressions",
      durationMinutes: 12,
      explanation: "Reading is most of what a query does. This is the other part.\n\n---\n\n### 1. Basic — insert, update, delete\n\n```php\nDB::table('users')->insert([\n    'name'  => 'Rajan',\n    'email' => 'rajan@example.com',\n]);\n```\n\nPass an array of arrays and you insert several rows in one statement, which is far quicker than a loop of single inserts:\n\n```php\nDB::table('users')->insert([\n    ['name' => 'Rajan', 'email' => 'rajan@example.com'],\n    ['name' => 'Alice', 'email' => 'alice@example.com'],\n]);\n```\n\nWhen you need the new row's id:\n\n```php\n$id = DB::table('users')->insertGetId([...]);\n```\n\n```text\nINSERT\n  ↓\ndatabase creates the id\n  ↓\ninsertGetId()\n  ↓\n$id\n```\n\nUpdating and deleting are the same builder with a filter on the front:\n\n```php\nDB::table('users')->where('id', 1)->update(['name' => 'Rajan Updated']);\n\nDB::table('users')->where('id', 1)->delete();\n```\n\nBoth return the number of rows affected, which is worth checking when you expected exactly one.\n\nAnd the warning that belongs in bold:\n\n```php\nDB::table('users')->delete();   // every single row\n```\n\n<b>A missing `where()` is not an error, it is a full-table operation.</b> The same is true of `update()`. Write the `where()` first and the verb second, and the habit protects you.\n\n---\n\n### 2. Intermediate — `increment()`, `decrement()` and why they exist\n\nThis looks harmless:\n\n```php\n$views = DB::table('posts')->where('id', 1)->value('views');\nDB::table('posts')->where('id', 1)->update(['views' => $views + 1]);\n```\n\nIt is a bug waiting for traffic. Two requests read `views` as 100 at the same moment, both write 101, and one view is gone. Yesterday's stock example, in a different costume.\n\n```php\nDB::table('posts')->where('id', 1)->increment('views');\n```\n\n```text\nviews = views + 1\n```\n\nThe addition happens inside the database, in one statement, so there is nothing to race. `decrement()` is the same going down, and both take an amount:\n\n```php\n->increment('views', 5);\n->decrement('stock', $quantity);\n```\n\nYou can update other columns at the same time:\n\n```php\n->increment('views', 1, ['last_viewed_at' => now()]);\n```\n\n---\n\n### 3. Advanced — upsert, and raw expressions\n\n<b>An <i>upsert</i></b> (insert a row, or update it if it already exists) is what you want whenever data arrives from somewhere else:\n\n```php\nDB::table('users')->upsert(\n    [['email' => 'rajan@example.com', 'name' => 'Rajan']],\n    ['email'],\n    ['name'],\n);\n```\n\nThree arguments, and the second two are the ones people get wrong:\n\n```text\n1. the rows\n2. the column(s) that identify a row uniquely\n3. the columns to update when it already exists\n```\n\n```text\nDoes the email exist?\n       │\n   ┌───┴───┐\n  NO      YES\n   ↓        ↓\n INSERT   UPDATE\n```\n\nThe second argument needs a unique index behind it, which is exactly the `unique()` you added in a migration yesterday. Without one, the database cannot tell what counts as the same row.\n\nUpserts are the right tool for imports, syncing from an external API, and any bulk update where some rows are new.\n\nFinally, raw expressions. `DB::raw()` and the `...Raw` methods drop a fragment of SQL straight into the query:\n\n```php\nDB::table('orders')->selectRaw('SUM(amount) as total')->get();\n```\n\nSafe, because you wrote every character of it. This is not:\n\n```php\n// ❌ $column came from the request\nDB::select(\"SELECT * FROM users ORDER BY $column\");\n```\n\n<b>The line is not raw versus not raw, it is whether user input touches the SQL text.</b> A hard-coded aggregate is fine. A column name, a direction or a table name from a request is an injection, and the fix is a whitelist:\n\n```php\n$sort = in_array(request('sort'), ['name', 'created_at']) ? request('sort') : 'created_at';\n```\n\nFor values, you already have the answer: pass them to the builder and let it bind them.",
      diagram: `Writing rows

  insert([...])                one row
  insert([[...], [...]])       many rows, one statement
  insertGetId([...])           returns the new id

  ->where(...)->update([...])  returns rows affected
  ->where(...)->delete()       returns rows deleted


  ⚠️  DB::table('users')->delete();

      No where() is not an error. It is every row.
      Write the where() first, the verb second.


increment(): not a convenience, a fix

  ❌ read 100 → add 1 → write 101
     two requests do this at once
     both read 100, both write 101
     one view lost

  ✓ ->increment('views')

     views = views + 1, computed inside the database,
     in one statement, so there is nothing to race

  ->increment('views', 5)
  ->decrement('stock', \$quantity)


upsert: three arguments

  1. the rows
  2. the column(s) that identify a row uniquely   ← needs a unique index
  3. the columns to update when it already exists

  Does the email exist?
         │
     ┌───┴───┐
    NO      YES
     ↓        ↓
   INSERT   UPDATE

  For imports, API syncs, bulk updates where some rows are new.


Where the injection line actually is

  ✓ selectRaw('SUM(amount) as total')     you wrote every character
  ❌ "ORDER BY \$column"                    \$column came from a request

  Not raw vs safe. User input touching SQL TEXT vs not.
  For column names and directions, use a whitelist.
  For values, let the builder bind them.`,
      codeExample: {
        title: "Writing rows safely",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- Insert ----------

DB::table('users')->insert([
    'name'  => 'Rajan',
    'email' => 'rajan@example.com',
]);

// Several rows in one statement, much faster than a loop.
DB::table('users')->insert([
    ['name' => 'Rajan', 'email' => 'rajan@example.com'],
    ['name' => 'Alice', 'email' => 'alice@example.com'],
]);

$id = DB::table('users')->insertGetId([
    'name'  => 'Rajan',
    'email' => 'rajan@example.com',
]);


// ---------- Update and delete ----------

$affected = DB::table('users')
    ->where('id', 1)
    ->update(['name' => 'Rajan Updated']);

$deleted = DB::table('users')
    ->where('id', 1)
    ->delete();

// ⚠️ No where() means every row. This is not an error.
DB::table('users')->delete();


// ---------- Counters ----------

// ❌ Two requests read 100, both write 101, one view is lost.
$views = DB::table('posts')->where('id', 1)->value('views');
DB::table('posts')->where('id', 1)->update(['views' => $views + 1]);

// ✓ The addition happens inside the database.
DB::table('posts')->where('id', 1)->increment('views');

DB::table('posts')->where('id', 1)->increment('views', 5);
DB::table('products')->where('id', 1)->decrement('stock', $quantity);

// Update other columns at the same time.
DB::table('posts')
    ->where('id', 1)
    ->increment('views', 1, ['last_viewed_at' => now()]);


// ---------- Upsert ----------

DB::table('users')->upsert(
    // 1. the rows
    [
        ['email' => 'rajan@example.com', 'name' => 'Rajan'],
        ['email' => 'alice@example.com', 'name' => 'Alice'],
    ],
    // 2. what makes a row unique (needs a unique index)
    ['email'],
    // 3. what to update when it already exists
    ['name'],
);


// ---------- Raw expressions ----------

// ✓ You wrote every character of this.
DB::table('orders')->selectRaw('SUM(amount) as total')->get();

// ❌ $column came from the request.
DB::select("SELECT * FROM users ORDER BY $column");

// ✓ Whitelist anything that is not a value.
$sort = in_array(request('sort'), ['name', 'created_at'], true)
    ? request('sort')
    : 'created_at';

DB::table('users')->orderBy($sort)->get();`,
      },
      keyTakeaways: [
        "<b>`insert()` takes one array, or an array of arrays</b> to write several rows in a single statement.",
        "`insertGetId()` returns the id the database generated for the new row.",
        "`update()` and `delete()` return the number of rows affected, worth checking when you expected one.",
        "<b>A missing `where()` on `update()` or `delete()` is not an error, it affects every row.</b>",
        "<b>`increment()` and `decrement()` do the arithmetic inside the database</b>, so two requests cannot lose each other's change.",
        "Read-add-write in PHP is a race condition, and it is the same bug as overselling stock.",
        "<b>An upsert inserts or updates</b>, taking the rows, the columns that identify a row, and the columns to update.",
        "The identifying columns of an upsert need a unique index behind them.",
        "<b>The injection line is whether user input reaches the SQL text</b>, so whitelist column names and let the builder bind values.",
      ],
      commonMistakes: [
        "<b>Running `update()` or `delete()` without a `where()`.</b> The whole table changes and nothing warns you.",
        "<b>Reading a counter, adding one, and writing it back.</b> Concurrent requests overwrite each other.",
        "<b>Looping single inserts for a bulk import.</b> One `insert()` with an array of rows is far faster.",
        "<b>Calling `upsert()` without a unique index on the identifying column.</b> The database cannot match existing rows.",
        "<b>Interpolating a sort column into raw SQL.</b> Values can be bound; column names need a whitelist.",
      ],
      quiz: [
        {
          question: "What does `DB::table('users')->delete()` with no `where()` do?",
          options: [
            "Throws an error",
            "Deletes nothing",
            "Deletes every row in the table",
            "Deletes the first row",
          ],
          correctIndex: 2,
          explanation: "Laravel does not stop you, so write the `where()` first.",
        },
        {
          question: "Why use `increment('views')` rather than reading the value and writing it back?",
          options: [
            "It is shorter to type",
            "The addition happens in the database, so concurrent requests cannot lose an update",
            "It bypasses validation",
            "It works without a `where()`",
          ],
          correctIndex: 1,
          explanation: "Read-add-write is the same race condition as overselling stock.",
        },
        {
          question: "What are the second and third arguments to `upsert()`?",
          options: [
            "The table and the connection",
            "The columns that identify a row uniquely, and the columns to update if it exists",
            "The ordering and the limit",
            "The where conditions and the bindings",
          ],
          correctIndex: 1,
          explanation: "The identifying columns need a unique index behind them.",
        },
        {
          question: "Which of these is unsafe?",
          options: [
            "`selectRaw('SUM(amount) as total')`",
            "`->where('email', request('email'))`",
            "`DB::select(\"SELECT * FROM users ORDER BY $column\")` where `$column` is from a request",
            "`->orderBy('created_at')`",
          ],
          correctIndex: 2,
          explanation: "User input reaching the SQL text is the injection; whitelist column names.",
        },
      ],
    },
    {
      id: "large-result-sets-and-locking",
      title: "chunk, lazy, cursor & pessimistic locking",
      durationMinutes: 12,
      explanation: "Every query so far has assumed the results fit comfortably in memory. Sooner or later one does not.\n\n---\n\n### 1. Basic — why `get()` stops working\n\n```php\n$users = DB::table('users')->get();   // 10,000,000 rows\n```\n\nThat asks PHP to hold ten million rows at once, and PHP will refuse long before it finishes. The answer is to work in pieces.\n\n<b>`chunk()`</b> fetches a fixed number at a time and hands each batch to a closure:\n\n```php\nDB::table('users')\n    ->orderBy('id')\n    ->chunk(1000, function ($users) {\n        foreach ($users as $user) {\n            // process one user\n        }\n    });\n```\n\n```text\n10,000,000 users\n       ↓\n┌──────────────┐\n│ 1,000 users  │ → process\n└──────────────┘\n       ↓\n┌──────────────┐\n│ 1,000 users  │ → process\n└──────────────┘\n       ↓\n      ...\n```\n\nMemory holds a thousand rows instead of ten million. Note the `orderBy()`: chunking without a stable order gives the database permission to return rows in an order that shifts between batches.\n\nYou can stop early by returning `false` from the closure.\n\n---\n\n### 2. Intermediate — the four ways, and when each fits\n\n`chunk()` pages through with an offset, which creates a specific bug: <b>if you modify the rows you are chunking over, the offsets shift underneath you and rows get skipped.</b> Update `active` to false while chunking on `active = true` and every second batch is missed.\n\n<b>`chunkById()`</b> avoids it by remembering the last id instead of counting from the start:\n\n```php\nDB::table('users')->chunkById(1000, function ($users) {\n    // safe even while updating the rows\n});\n```\n\n<b>`lazy()`</b> gives you one collection you can loop over normally, fetching batches behind the scenes:\n\n```php\nforeach (DB::table('users')->orderBy('id')->lazy() as $user) {\n    // process one user\n}\n```\n\n<b>`cursor()`</b> uses a PHP generator (a mechanism that produces values one at a time rather than building the whole list) and holds a single row at a time:\n\n```php\nforeach (DB::table('users')->orderBy('id')->cursor() as $user) {\n    // process one user\n}\n```\n\n```text\nchunk()       process fixed-size groups\nchunkById()   the same, but safe while modifying rows\nlazy()        stream through a lazy collection, batched behind the scenes\ncursor()      one record at a time, lowest memory\n```\n\n```text\nNeed batches?                 →  chunk / chunkById\nNeed low-memory iteration?    →  lazy / cursor\nModifying as you go?          →  chunkById\n```\n\nOne caveat on `cursor()`: it holds a database connection open for the whole loop, so it suits a command more than a web request.\n\n---\n\n### 3. Advanced — pessimistic locking\n\nYesterday's transactions protected a group of writes. They do not, on their own, stop two transactions reading the same row at the same time.\n\n```text\nStock = 1\n\nRequest A → buy item\nRequest B → buy item\n\nA reads 1        B reads 1\nA buys           B buys\n       ↓\n❌ two items sold, one in stock\n```\n\n<b>A <i>pessimistic lock</i></b> (a database lock that makes other transactions wait before touching the same row) closes the gap:\n\n```php\nDB::transaction(function () {\n    $product = DB::table('products')\n        ->where('id', 1)\n        ->lockForUpdate()\n        ->first();\n\n    // nobody else can read this row for update until we commit\n});\n```\n\n```text\nTransaction A\n      ↓\nlockForUpdate()\n      ↓\n🔒 row locked\n      ↓\nread, decide, update\n      ↓\ncommit\n      ↓\n🔓 unlocked\n      ↓\nTransaction B reads the UPDATED stock\n```\n\nTwo rules. <b>`lockForUpdate()` only means anything inside a transaction</b>, because the lock is released when the transaction ends. And keep the locked section short, since every other request wanting that row is waiting on you.\n\nThere is a lighter `sharedLock()`, which lets others read but not write.\n\nAnd remember the cheaper option from the last lesson: if all you are doing is adding or subtracting, `decrement()` needs no lock at all. Reach for locking when you must read a value, make a decision in PHP, and then write.",
      diagram: `get() has a ceiling

  DB::table('users')->get()      10,000,000 rows
        ↓
  PHP holds all of them at once
        ↓
  out of memory

  chunk(1000)

  ┌──────────────┐
  │ 1,000 users  │ → process
  └──────────────┘
         ↓
  ┌──────────────┐
  │ 1,000 users  │ → process
  └──────────────┘
         ↓
        ...

  Always orderBy() when chunking. Return false to stop early.


Four ways, one table

  chunk()       fixed-size groups, offset-based
  chunkById()   same, but tracks the last id
  lazy()        one loop, batches fetched behind the scenes
  cursor()      one row at a time, lowest memory

  Need batches?              →  chunk / chunkById
  Need low-memory iteration? →  lazy / cursor
  Modifying rows as you go?  →  chunkById

  Why: chunk() counts from the start. Change the rows you are
  chunking over and the offsets shift, so batches get SKIPPED.


Pessimistic locking

  Stock = 1,  two requests arrive

  without a lock              with lockForUpdate()

  A reads 1   B reads 1       A 🔒 locks the row
  A buys      B buys             reads 1 → writes 0 → commits 🔓
       ↓                      B waits, then reads 0
  ❌ 2 sold, 1 in stock       ✓ correctly refused

  lockForUpdate()  only means anything inside a transaction
  sharedLock()     others may read, not write

  Just adding or subtracting? decrement() needs no lock.`,
      codeExample: {
        title: "Processing large tables, and locking a row",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- Fixed-size batches ----------

DB::table('users')
    ->orderBy('id')
    ->chunk(1000, function ($users) {
        foreach ($users as $user) {
            // process one user
        }

        // return false;   // stops the whole chunking early
    });


// ---------- Safe while modifying the rows you are reading ----------

// chunk() counts from the start, so updating rows shifts the offsets
// and whole batches get skipped. chunkById() tracks the last id.
DB::table('users')
    ->where('active', true)
    ->chunkById(1000, function ($users) {
        foreach ($users as $user) {
            DB::table('users')
                ->where('id', $user->id)
                ->update(['active' => false]);
        }
    });


// ---------- One loop, batched behind the scenes ----------

foreach (DB::table('users')->orderBy('id')->lazy() as $user) {
    // process one user
}


// ---------- One row at a time, lowest memory ----------

foreach (DB::table('users')->orderBy('id')->cursor() as $user) {
    // Holds a connection open for the whole loop,
    // so this suits an Artisan command more than a web request.
}


// ---------- Pessimistic locking ----------

DB::transaction(function () {
    // Nobody else can read this row for update until we commit.
    $product = DB::table('products')
        ->where('id', 1)
        ->lockForUpdate()
        ->first();

    if ($product->stock < 1) {
        throw new RuntimeException('Out of stock.');
    }

    DB::table('products')
        ->where('id', 1)
        ->decrement('stock');
});

// Outside a transaction, lockForUpdate() does nothing useful:
// the lock is released the moment the statement finishes.

// Others may read, but not write.
DB::table('products')->where('id', 1)->sharedLock()->first();


// ---------- The cheaper option ----------

// No lock needed: the database does the arithmetic itself.
DB::table('products')->where('id', 1)->decrement('stock');

// Locking is for: read a value → decide in PHP → write.`,
      },
      keyTakeaways: [
        "<b>`get()` loads every matching row into memory</b>, which stops working on large tables.",
        "<b>`chunk()` processes a fixed number of rows at a time</b>, and returning `false` stops it early.",
        "Always `orderBy()` when chunking, or the order can shift between batches.",
        "<b>`chunk()` counts from the start, so modifying the rows you are chunking over skips batches.</b>",
        "<b>`chunkById()` tracks the last id instead</b>, which makes it safe while updating rows.",
        "<b>`lazy()` streams through a lazy collection</b> and `cursor()` yields one row at a time for the lowest memory.",
        "`cursor()` holds a connection open for the whole loop, so it suits commands more than web requests.",
        "<b>`lockForUpdate()` makes other transactions wait</b>, and only means anything inside a transaction.",
        "Keep locked sections short, and prefer `increment()`/`decrement()` when no decision happens in PHP.",
      ],
      commonMistakes: [
        "<b>Calling `get()` on a table with millions of rows.</b> PHP runs out of memory before the loop starts.",
        "<b>Using `chunk()` while updating the rows being chunked.</b> The offsets shift and batches are skipped.",
        "<b>Chunking without an `orderBy()`.</b> The database is free to return rows in a different order each batch.",
        "<b>Calling `lockForUpdate()` outside a transaction.</b> The lock is released immediately and protects nothing.",
        "<b>Locking a row and then making an HTTP call.</b> Every other request for that row waits for the remote service.",
      ],
      quiz: [
        {
          question: "Why use `chunk()` instead of `get()` on a very large table?",
          options: [
            "It produces different results",
            "It processes a fixed number of rows at a time instead of loading them all into memory",
            "It is required for ordering",
            "It runs the query in the background",
          ],
          correctIndex: 1,
          explanation: "A thousand rows in memory instead of ten million.",
        },
        {
          question: "When should you use `chunkById()` rather than `chunk()`?",
          options: [
            "When the table has no primary key",
            "When you are modifying the rows you are chunking over",
            "When you need the rows sorted by name",
            "When the table is small",
          ],
          correctIndex: 1,
          explanation: "`chunk()` counts from the start, so changing rows shifts the offsets and skips batches.",
        },
        {
          question: "What does `cursor()` do?",
          options: [
            "Loads everything and iterates in PHP",
            "Yields one record at a time using a generator, for the lowest memory use",
            "Caches the result set",
            "Paginates the results",
          ],
          correctIndex: 1,
          explanation: "It holds a connection open for the whole loop, so it suits commands.",
        },
        {
          question: "Where does `lockForUpdate()` have to be used?",
          options: [
            "Inside a transaction",
            "Inside a chunk closure",
            "Before the `where()` clause",
            "Anywhere, it works the same",
          ],
          correctIndex: 0,
          explanation: "The lock lasts until the transaction commits; outside one it protects nothing.",
        },
      ],
    },
    {
      id: "pagination",
      title: "Pagination — paginate, simplePaginate & cursorPaginate",
      durationMinutes: 14,
      explanation: "A hundred thousand users is not a page. Pagination is how you hand them over twenty at a time, and Laravel gives you three ways to do it.\n\n---\n\n### 1. Basic — `paginate()`\n\n```php\n$users = DB::table('users')\n    ->orderBy('id')\n    ->paginate(20);\n```\n\nYou get the rows plus everything a page needs around them:\n\n```text\n20 users\n   +\ntotal count\n   +\ncurrent page, last page\n   +\nnavigation links\n```\n\nAnd in Blade it renders itself:\n\n```blade\n@foreach ($users as $user)\n    <p>{{ $user->name }}</p>\n@endforeach\n\n{{ $users->links() }}\n```\n\n```text\nPrevious  1  2  3  ...  50  Next\n```\n\nLaravel reads the page number from the query string, so `?page=3` works without you touching it.\n\nThe cost is hidden in that list: to know there are 50 pages, the database has to `COUNT(*)` the whole filtered set on every single request. On a big table that count is often slower than fetching the rows.\n\n---\n\n### 2. Intermediate — the two cheaper options\n\n<b>`simplePaginate()`</b> drops the total:\n\n```php\n->simplePaginate(20);\n```\n\n```text\npaginate()          rows + total count + page numbers\nsimplePaginate()    rows + next / previous only\n```\n\nIt fetches 21 rows to answer \"is there another page?\" and skips the count entirely. If your interface only has Next and Previous buttons, you were paying for numbers nobody clicks.\n\n<b>`cursorPaginate()`</b> changes the question. Traditional pagination says give me page 50, which the database answers with an offset:\n\n```text\nPage 1     OFFSET 0     LIMIT 20\nPage 2     OFFSET 20    LIMIT 20\nPage 500   OFFSET 9980  LIMIT 20\n```\n\nOFFSET is not free. To skip 9,980 rows the database walks past them first, so deep pages get slower and slower.\n\nCursor pagination says give me the next twenty after this one:\n\n```text\nlast_seen_id = 20\n      ↓\nWHERE id > 20\n      ↓\nLIMIT 20\n```\n\nThat is an index lookup, and page 500 costs exactly what page 1 costs.\n\nIt has a second advantage. With offsets, a row inserted while someone reads page 1 pushes everything down, so a row they have already seen reappears on page 2. Cursor pagination is anchored to a position, so it does not shuffle.\n\nThe trade is that you cannot jump to page 50, only forwards and backwards. Which is fine for infinite scroll and API feeds, and useless for an admin table with page numbers.\n\n```text\nNeed total pages and numbers?     →  paginate()\nOnly need next / previous?        →  simplePaginate()\nHuge dataset, feed, infinite scroll?  →  cursorPaginate()\n```\n\n<b>Cursor pagination needs a stable, unique ordering</b>, because the cursor is a position in that order. `orderBy('id')` is ideal. Ordering by `created_at` alone is not, since duplicate timestamps make the position ambiguous, so pair it: `orderByDesc('created_at')->orderBy('id')`.\n\n---\n\n### 3. Advanced — keeping the filters\n\nHere is the bug every filter page has once. The URL is:\n\n```text\n/users?role=admin&sort=name\n```\n\nThe user clicks page 2 and lands on:\n\n```text\n/users?page=2\n```\n\nThe filters are gone. `withQueryString()` carries them along:\n\n```php\n$users = DB::table('users')\n    ->when(request('search'), fn ($q, $search) =>\n        $q->where('name', 'like', \"%{$search}%\"))\n    ->when(request('role'), fn ($q, $role) =>\n        $q->where('role', $role))\n    ->orderByDesc('created_at')\n    ->orderBy('id')\n    ->paginate(20)\n    ->withQueryString();\n```\n\n```text\n/users?search=Rajan&role=admin&page=2\n```\n\nUse `appends(['role' => 'admin'])` when you want to add something that is not in the current query string.\n\nThe pagination markup itself is publishable:\n\n```bash\nphp artisan vendor:publish --tag=laravel-pagination\n```\n\nwhich gives you the view files to edit, or you can point at your own:\n\n```blade\n{{ $users->links('pagination.custom') }}\n```\n\nA last note on `when()` plus `paginate()`: this combination is most of a real admin page, and it is worth writing once and keeping. Filters via `when()`, a stable order, `paginate()`, `withQueryString()`.\n\n---\n\n### The builder, in the order you think about it\n\n```text\n1. FROM        DB::table()\n2. SELECT      select(), selectRaw()\n3. FILTER      where(), whereIn(), whereBetween(), when()\n4. JOIN        join(), leftJoin()\n5. GROUP       groupBy()\n6. GROUP FILTER  having()\n7. ORDER       orderBy()\n8. PAGE        paginate(), cursorPaginate()\n9. RUN         get(), first()\n```\n\nWhich is SQL's own order, which is why the builder feels natural once you have seen it twice.",
      diagram: `Three ways to paginate

  paginate(20)          rows + total count + page numbers + links
  simplePaginate(20)    rows + next / previous only
  cursorPaginate(20)    rows + a cursor, forwards and backwards

  paginate() runs a COUNT(*) over the whole filtered set
  on EVERY request. On a big table that count often costs
  more than fetching the rows.


Offset vs cursor

  OFFSET                          CURSOR

  Page 1    OFFSET 0              WHERE id > 0    LIMIT 20
  Page 2    OFFSET 20             WHERE id > 20   LIMIT 20
  Page 500  OFFSET 9980           WHERE id > 9980 LIMIT 20
                ↓                        ↓
  the database walks past          an index lookup
  9,980 rows to skip them          page 500 costs what page 1 costs

  Offset also shuffles: a row inserted while someone reads
  page 1 pushes everything down, so they see it twice.
  A cursor is anchored, so it does not.

  The trade: no jumping to page 50, only next and previous.


Choosing

  Need page numbers and a total?        →  paginate()
  Only next / previous?                 →  simplePaginate()
  Huge dataset, feed, infinite scroll?  →  cursorPaginate()

  Cursor pagination needs a stable, UNIQUE ordering.
  orderBy('id')                            ✓
  orderByDesc('created_at')                ❌ ties are ambiguous
  orderByDesc('created_at')->orderBy('id') ✓


Keeping the filters across pages

  /users?role=admin&sort=name
        ↓  click page 2
  /users?page=2                    ← filters gone

  ->paginate(20)->withQueryString()
        ↓
  /users?role=admin&sort=name&page=2


The builder in the order you think about it

  FROM → SELECT → FILTER → JOIN → GROUP → HAVING → ORDER → PAGE → RUN

  Which is SQL's own order.`,
      codeExample: {
        title: "Pagination, filters, and a real report",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- Full pagination ----------

$users = DB::table('users')
    ->orderBy('id')
    ->paginate(20);

// Rows + total + page numbers. The COUNT(*) is the cost.


// ---------- No total, just next and previous ----------

$users = DB::table('users')
    ->orderBy('id')
    ->simplePaginate(20);


// ---------- Cursor: constant cost at any depth ----------

$users = DB::table('users')
    ->orderBy('id')            // must be stable and unique
    ->cursorPaginate(20);

// Ordering by a non-unique column needs a tie-breaker.
DB::table('posts')
    ->orderByDesc('created_at')
    ->orderBy('id')
    ->cursorPaginate(20);


// ---------- The shape of a real admin list page ----------

$users = DB::table('users')
    ->when(request('search'), fn ($q, $search) =>
        $q->where('name', 'like', "%{$search}%"))
    ->when(request('role'), fn ($q, $role) =>
        $q->where('role', $role))
    ->orderByDesc('created_at')
    ->orderBy('id')
    ->paginate(20)
    ->withQueryString();   // keeps ?search=...&role=... on page 2

// Add something not already in the query string:
$users->appends(['role' => 'admin']);


// ---------- A report: orders and revenue per user ----------

$report = DB::table('users')
    ->leftJoin('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.id', 'users.name')
    ->selectRaw('COUNT(orders.id) as order_count')
    ->selectRaw('COALESCE(SUM(orders.amount), 0) as total_revenue')
    ->groupBy('users.id', 'users.name')
    ->orderByDesc('total_revenue')
    ->get();

// leftJoin, so customers with no orders still appear with 0.


// ---------- The same report, paginated for a large table ----------

$report = DB::table('users')
    ->leftJoin('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.id', 'users.name')
    ->selectRaw('COUNT(orders.id) as order_count')
    ->selectRaw('COALESCE(SUM(orders.amount), 0) as total_revenue')
    ->groupBy('users.id', 'users.name')
    ->orderBy('users.id')
    ->cursorPaginate(50);


// ---------- In Blade ----------
?>

@foreach ($users as $user)
    <p>{{ $user->name }}</p>
@endforeach

{{ $users->links() }}

{{-- Your own markup instead --}}
{{ $users->links('pagination.custom') }}


<?php
// Publish the default pagination views to edit them:
// php artisan vendor:publish --tag=laravel-pagination`,
      },
      keyTakeaways: [
        "<b>`paginate()` returns the rows plus a total, page numbers and links</b>, and reads `?page=` itself.",
        "<b>That total costs a `COUNT(*)` over the whole filtered set on every request</b>, which is often slower than the rows.",
        "<b>`simplePaginate()` skips the count</b> and gives you next and previous only.",
        "<b>OFFSET makes deep pages slow</b>, because the database walks past every skipped row.",
        "<b>`cursorPaginate()` asks for the rows after a position</b>, so page 500 costs the same as page 1.",
        "A cursor is anchored, so rows inserted mid-browse do not push others onto the next page.",
        "The trade is no jumping to a page number, which suits feeds and infinite scroll rather than admin tables.",
        "<b>Cursor pagination needs a stable, unique ordering</b>, so pair `created_at` with `id`.",
        "<b>`withQueryString()` keeps the current filters in the pagination links</b>, and `appends()` adds extra ones.",
        "`{{ $users->links() }}` renders the markup, and `vendor:publish --tag=laravel-pagination` lets you edit it.",
      ],
      commonMistakes: [
        "<b>Using `paginate()` on a huge table for a feed.</b> You pay for a `COUNT(*)` nobody looks at.",
        "<b>Forgetting `withQueryString()`.</b> The filters vanish the moment someone clicks page 2.",
        "<b>Cursor paginating on a non-unique column.</b> Ties make the position ambiguous, so rows repeat or vanish.",
        "<b>Paginating with no `orderBy()` at all.</b> The database may return a different order per page.",
        "<b>Expecting page numbers from `cursorPaginate()`.</b> It only knows next and previous.",
      ],
      quiz: [
        {
          question: "What does `paginate()` do that `simplePaginate()` does not?",
          options: [
            "Applies the filters",
            "Runs a `COUNT(*)` so it can report the total and page numbers",
            "Orders the results",
            "Renders the links",
          ],
          correctIndex: 1,
          explanation: "On a large table that count often costs more than fetching the rows.",
        },
        {
          question: "Why does `cursorPaginate()` stay fast on deep pages?",
          options: [
            "It caches earlier pages",
            "It uses `WHERE id > last_seen` instead of an OFFSET the database has to walk past",
            "It fetches fewer columns",
            "It runs in the background",
          ],
          correctIndex: 1,
          explanation: "An index lookup, so page 500 costs what page 1 costs.",
        },
        {
          question: "What does cursor pagination require of your ordering?",
          options: [
            "That it is ascending",
            "That it uses an indexed string column",
            "That it is stable and unique, so pair a timestamp with `id`",
            "Nothing in particular",
          ],
          correctIndex: 2,
          explanation: "The cursor is a position in that order, so ties make it ambiguous.",
        },
        {
          question: "A user filters by role, then clicks page 2 and the filter disappears. What is missing?",
          options: [
            "`orderBy()`",
            "`withQueryString()`",
            "`simplePaginate()`",
            "`links()`",
          ],
          correctIndex: 1,
          explanation: "It carries the current query string into the pagination links.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "When does a Query Builder chain actually run?",
      options: [
        "As soon as `DB::table()` is called",
        "After each `where()`",
        "When you call `get()`, `first()`, `count()` or a similar method",
        "At the end of the request",
      ],
      correctIndex: 2,
      explanation: "Which is what lets you build the query up conditionally first.",
    },
    {
      question: "How do you express `active = true AND (role = 'admin' OR role = 'manager')`?",
      options: [
        "Chain three `where()` calls",
        "Put the OR conditions inside a closure passed to `where()`",
        "Use `whereIn()` for all three",
        "Use `orWhere()` three times",
      ],
      correctIndex: 1,
      explanation: "The closure is what produces the parentheses.",
    },
    {
      question: "Where does a condition on `COUNT(*)` belong?",
      options: ["`where()`", "`having()`", "`select()`", "`orderBy()`"],
      correctIndex: 1,
      explanation: "At `where()` time the aggregate has not been calculated yet.",
    },
    {
      question: "You need a post count for every user, including users with no posts. Which join?",
      options: ["`join()`", "`leftJoin()`", "`crossJoin()`", "`union()`"],
      correctIndex: 1,
      explanation: "An inner join drops every row that has no match.",
    },
    {
      question: "Why is `increment('views')` better than reading the value and writing it back?",
      options: [
        "It is shorter",
        "The database does the arithmetic, so concurrent requests cannot overwrite each other",
        "It skips the where clause",
        "It avoids a transaction",
      ],
      correctIndex: 1,
      explanation: "Read-add-write in PHP is a race condition.",
    },
    {
      question: "You are updating rows while iterating over them in batches. Which method?",
      options: ["`chunk()`", "`chunkById()`", "`get()`", "`paginate()`"],
      correctIndex: 1,
      explanation: "`chunk()` counts from the start, so modified rows shift the offsets and batches get skipped.",
    },
    {
      question: "Which pagination method suits an infinite-scroll feed over millions of rows?",
      options: ["`paginate()`", "`simplePaginate()`", "`cursorPaginate()`", "`chunk()`"],
      correctIndex: 2,
      explanation: "No `COUNT(*)`, no OFFSET, and the position does not shuffle as rows are inserted.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Build the InvoiceHub invoice list properly: filters that combine, a stable order, pagination that keeps the filters, and a revenue report.",
    brief: "Yesterday InvoiceHub got real tables. Today it gets a screen worth using.\n\nThe list page needs a search box, a status filter, a date range, sorting and paging, and all of those have to work together rather than one at a time. That combination is what `when()` exists for, and getting it right once means you have the pattern for every admin screen you will ever build.\n\nStill no Eloquent. Everything goes through `DB::table()`, so that tomorrow you can see exactly what Eloquent is adding on top.\n\nBefore you start, seed some data. A few hundred invoices across a handful of customers is enough to make pagination behave like the real thing, and a couple of customers with no invoices at all will keep your joins honest.",
    steps: [
      "Seed the database: at least 300 invoices spread across 10 customers, with a mix of statuses and created dates over a few months. Add two customers with no invoices.",
      "Build the list query with `DB::table('invoices')`, selecting only the columns the page shows. Confirm you get rows back before adding anything else.",
      "Add a search filter with `when(request('search'), ...)` matching the invoice number or customer name. Use a closure so the two conditions are grouped, or the OR will widen the whole query.",
      "Add a status filter with `whereIn()` so several statuses can be selected at once, and a date range with `whereBetween()` on `created_at`.",
      "Add sorting from `request('sort')`, whitelisted against an array of allowed columns. Then explain in one comment why the whitelist is not optional.",
      "Order by the chosen column and then by `id`, and write down what breaks without that second `orderBy()`.",
      "Paginate with `paginate(20)->withQueryString()`. Apply two filters, go to page 2, and confirm the filters survive in the URL.",
      "Render the list in Blade with `{{ $invoices->links() }}`. Check what happens on page 2 if you remove `withQueryString()`, then put it back.",
      "Swap `paginate()` for `simplePaginate()` and note what disappears from the page. Decide which one this screen actually needs.",
      "Build a revenue report: one row per customer with an invoice count and a total, using a `leftJoin` so customers with no invoices appear with 0. Order by total, highest first.",
      "Add a `having()` clause to show only customers who have more than five invoices, and confirm you understand why that could not have been a `where()`.",
      "Write an Artisan command that marks every invoice older than 90 days as `archived`, using `chunkById(100)`. Explain in a comment why `chunk()` would have skipped rows here.",
      "Add a payment action that reads an invoice's balance inside `DB::transaction()` with `lockForUpdate()`, refuses to overpay, and records the payment. Then note where `decrement()` alone would have been enough.",
    ],
    acceptance: [
      "Search, status and date filters all work together in one query, and any combination of them returns the right rows.",
      "Applying filters and moving to page 2 keeps every filter in the URL and in the results.",
      "Sorting only accepts columns from your whitelist, and an unknown value falls back to a default rather than reaching the SQL.",
      "The list order is stable: refreshing page 2 twice returns the same rows in the same order.",
      "The revenue report includes customers with zero invoices, showing a count and total of 0.",
      "The `having()` filter changes which customers appear, and removing it brings the rest back.",
      "The archive command processes every eligible invoice, with none skipped, and never holds more than 100 rows in memory.",
      "No SQL string anywhere in the project contains an interpolated variable.",
    ],
    stretch: [
      "Add a second list page using `cursorPaginate()` for infinite scroll, and compare the queries the two pages run.",
      "Publish the pagination views with `php artisan vendor:publish --tag=laravel-pagination` and restyle them to match InvoiceHub.",
      "Time `paginate()` against `simplePaginate()` on your seeded table, then seed 100,000 invoices and time them again. Write down what changed and why.",
    ],
  },
};
