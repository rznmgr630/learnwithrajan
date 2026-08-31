import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_12_LESSONS: LessonDay = {
  day: 12,
  title: "Database connections, raw queries & transactions",
  totalMinutes: 90,
  difficulty: "Beginner",
  lessons: [
    {
      id: "connections-and-configuration",
      title: "How Laravel connects to a database",
      durationMinutes: 11,
      explanation: "Everything you have built so far has kept its data in an array, a session or a file. Today that stops. A database is where a real application keeps the things it must not lose.\n\nLaravel gives you a set of tools for working with one:\n\n```text\nLaravel Database\n       │\n       ├── Connections\n       ├── Query Builder\n       ├── Transactions\n       ├── Migrations\n       ├── Indexes\n       └── Schema management\n```\n\nStart with the first of those, because nothing else works until it does.\n\n---\n\n### 1. Basic — the layer in the middle\n\nYour code never talks to MySQL directly. It talks to Laravel's database layer, and that layer talks to whichever database you configured.\n\n```text\nYour Laravel Code\n       ↓\nLaravel Database Layer\n       ↓\nDatabase Connection\n       ↓\nMySQL / PostgreSQL / SQLite / SQL Server / MongoDB\n```\n\nSo this line works the same way whatever is sitting at the bottom of that stack:\n\n```php\nDB::select('SELECT * FROM users');\n```\n\nThat indirection is the point. Swapping SQLite for MySQL is a configuration change, not a rewrite.\n\n---\n\n### 2. Intermediate — two files, two jobs\n\nDatabase configuration lives in two places, and confusing them is a first-week classic.\n\n```text\nconfig/database.php     the shape of every connection\n.env                    the values for THIS machine\n```\n\n`config/database.php` is committed to Git and describes what connections exist. `.env` is not committed, and holds the host, database name and password for the machine you are on right now:\n\n```env\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=my_app\nDB_USERNAME=root\nDB_PASSWORD=\n```\n\n<b>An <i>environment</i></b> (one place your application runs: your laptop, staging, production) has its own `.env`. Same code, different values. That is why your local password never has to match production's, and why production's password never has to be in your repository.\n\n`DB_CONNECTION` is the switch. It names which connection from `config/database.php` is the default one.\n\n---\n\n### 3. Advanced — the five drivers, and what changes between them\n\n<b>MySQL</b> is the common choice for Laravel applications:\n\n```env\nDB_CONNECTION=mysql\nDB_PORT=3306\n```\n\n<b>PostgreSQL</b> differs by two words and a port number:\n\n```env\nDB_CONNECTION=pgsql\nDB_PORT=5432\n```\n\nYour application code does not change:\n\n```php\nDB::table('users')->get();\n```\n\n<b>SQLite</b> is not a server at all. The whole database is one file:\n\n```env\nDB_CONNECTION=sqlite\n```\n\n```text\ndatabase/database.sqlite\n```\n\nNothing to install, nothing to start, which is why it suits local development, automated tests and prototypes.\n\n<b>SQL Server</b> uses `sqlsrv` on port 1433, for teams already in the Microsoft ecosystem.\n\n<b>MongoDB</b> is the odd one out, because it is not relational. Laravel works with it through the official MongoDB integration, and the vocabulary is different:\n\n```text\nRelational              MongoDB\n----------              -------\nDatabase                Database\n   ↓                       ↓\nTable                   Collection\n   ↓                       ↓\nRows                    Documents\n   ↓                       ↓\nColumns                 Fields\n```\n\nA document is closer to the JSON you already write:\n\n```json\n{\n    \"name\": \"Rajan\",\n    \"email\": \"rajan@example.com\"\n}\n```\n\nChoosing between them, in one line each:\n\n```text\nMySQL         a traditional relational application\nPostgreSQL    relational, with more advanced features\nSQLite        a simple file, ideal for tests and local work\nSQL Server    the Microsoft ecosystem\nMongoDB       document-oriented data\n```\n\nFor now, get comfortable with MySQL and PostgreSQL. Everything else on this track works on top of either.",
      diagram: `The layer in the middle

  Your Laravel Code
         ↓
  Laravel Database Layer
         ↓
  Database Connection
         ↓
  MySQL / PostgreSQL / SQLite / SQL Server / MongoDB

  DB::select('SELECT * FROM users') is the same line
  whatever sits at the bottom of that stack.


Two files, two jobs

  config/database.php    the SHAPE of every connection    committed
  .env                   the VALUES for this machine      never committed

  DB_CONNECTION is the switch that picks the default one.

  laptop      .env  →  sqlite, no password
  staging     .env  →  mysql, staging host
  production  .env  →  mysql, production host

  Same code. Different values.


Relational vs MongoDB

  Relational              MongoDB
  ----------              -------
  Database                Database
     ↓                       ↓
  Table                   Collection
     ↓                       ↓
  Rows                    Documents
     ↓                       ↓
  Columns                 Fields`,
      codeExample: {
        title: "Configuring a connection, and where each value lives",
        code: `# .env  --  never committed, one per machine

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_app
DB_USERNAME=root
DB_PASSWORD=secret


# PostgreSQL: two words and a port number differ.

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=my_app
DB_USERNAME=postgres
DB_PASSWORD=secret


# SQLite: no server, no host, no password. One file.
# Create it first:  touch database/database.sqlite

DB_CONNECTION=sqlite


# SQL Server.

DB_CONNECTION=sqlsrv
DB_PORT=1433


<?php
// config/database.php  --  committed, describes the connections themselves

return [

    // Which connection is used when you do not name one.
    'default' => env('DB_CONNECTION', 'mysql'),

    'connections' => [

        'mysql' => [
            'driver'   => 'mysql',
            'host'     => env('DB_HOST', '127.0.0.1'),
            'port'     => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE'),
            'username' => env('DB_USERNAME'),
            'password' => env('DB_PASSWORD'),
        ],

        'sqlite' => [
            'driver'   => 'sqlite',
            'database' => database_path('database.sqlite'),
        ],

    ],
];

// env() reads from .env, and the second argument is the fallback.
// The file says WHAT a connection looks like.
// .env says what the values are HERE.


<?php
// Your application code does not care which of those is active.

DB::select('SELECT * FROM users');

DB::table('users')->get();`,
      },
      keyTakeaways: [
        "Your code talks to <b>Laravel's database layer</b>, and that layer talks to the database, so swapping drivers is a configuration change.",
        "<b>`config/database.php` describes the shape of every connection</b> and is committed to Git.",
        "<b>`.env` holds the values for the machine you are on</b> and is never committed.",
        "`DB_CONNECTION` names which connection is the default.",
        "MySQL is `mysql` on 3306, PostgreSQL is `pgsql` on 5432, SQL Server is `sqlsrv` on 1433.",
        "<b>SQLite is a single file</b>, which is why it suits local development and automated tests.",
        "MongoDB is document-oriented: collections and documents rather than tables and rows.",
        "Start with MySQL or PostgreSQL, because everything later on this track sits on top of either.",
      ],
      commonMistakes: [
        "<b>Committing `.env` to Git.</b> That publishes your database password to everyone with repository access.",
        "<b>Editing `config/database.php` when you meant to change a value.</b> Hard-coding a host there puts it in every environment at once.",
        "<b>Changing `.env` and wondering why nothing happened.</b> Config caching means you may need `php artisan config:clear`.",
        "<b>Choosing SQLite for production because it was easy locally.</b> One file does not survive concurrent writes at scale.",
        "<b>Assuming MongoDB works like MySQL with different words.</b> There are no joins or foreign keys to fall back on.",
      ],
      quiz: [
        {
          question: "What is the difference between `config/database.php` and `.env`?",
          options: [
            "They are two names for the same file",
            "`config/database.php` describes the connections; `.env` holds this machine's values",
            "`.env` is for production only",
            "`config/database.php` is generated from the database",
          ],
          correctIndex: 1,
          explanation: "One is committed and structural, the other is local and secret.",
        },
        {
          question: "Which `DB_CONNECTION` value selects PostgreSQL?",
          options: ["postgres", "postgresql", "pgsql", "psql"],
          correctIndex: 2,
          explanation: "MySQL is `mysql`, PostgreSQL is `pgsql`, SQL Server is `sqlsrv`.",
        },
        {
          question: "What makes SQLite convenient for local development and tests?",
          options: [
            "It is faster than MySQL at everything",
            "The whole database is a single file, with no server to install or start",
            "It supports more column types",
            "Laravel only supports it in testing",
          ],
          correctIndex: 1,
          explanation: "No server, no host, no password.",
        },
        {
          question: "In MongoDB, what corresponds to a relational table?",
          options: ["A document", "A field", "A collection", "A row"],
          correctIndex: 2,
          explanation: "Collection holds documents, and documents hold fields.",
        },
      ],
    },
    {
      id: "multiple-connections-and-replicas",
      title: "Multiple connections, read replicas & poolers",
      durationMinutes: 11,
      explanation: "One application, one database, is the usual starting point. It is not the only arrangement, and the day you meet a second database you want to know this already exists rather than inventing something.\n\n---\n\n### 1. Basic — more than one connection\n\n`config/database.php` holds a list of connections, not just one, so a single application can talk to several databases:\n\n```text\nLaravel\n   │\n   ├── MySQL\n   │\n   └── PostgreSQL\n```\n\nYou pick one by name:\n\n```php\nDB::connection('mysql')->select(...);\n\nDB::connection('pgsql')->select(...);\n```\n\nLeave `connection()` off and you get the default from `DB_CONNECTION`. That is what every example on this page has been doing quietly.\n\nWhy would you want a second one? The usual reason is that the second database was not your choice:\n\n```text\nMain application database\n        +\nLegacy database\n        +\nAnalytics database\n```\n\n```text\n                 Laravel\n                /   │   \\\n               ↓    ↓    ↓\n            Main  Legacy Analytics\n             DB     DB      DB\n```\n\nA company has an old system nobody wants to rewrite, and a reporting database somebody in finance depends on. Your application reads from all three.\n\n---\n\n### 2. Intermediate — read and write, split\n\nA busier arrangement splits one logical database into a primary and its copies.\n\n```text\nWRITE            READ\n  ↓                ↓\nPrimary        Read replicas\n```\n\n<b>A <i>read replica</i></b> (a copy of the primary database kept up to date automatically) exists because reads and writes are wildly unequal:\n\n```text\n100,000 reads\n     +\n  1,000 writes\n```\n\nSending all of that to one machine works until it does not. So writes go to the primary, and reads can be answered by replicas:\n\n```text\n                  Laravel\n                     │\n             ┌───────┴───────┐\n             ↓               ↓\n           WRITE            READ\n             ↓               ↓\n         Primary DB      Replica DB\n```\n\nLaravel supports this in the connection itself: give the connection a `read` and a `write` block, and it routes each query for you. Your controllers do not change.\n\nOne honest caveat, because it bites people. Replicas lag behind the primary by a small amount. Write a row and immediately read it back from a replica and it may not be there yet. That is not a Laravel bug, it is how replication works.\n\n---\n\n### 3. Advanced — poolers, and the `::direct` escape hatch\n\nOpening a database connection is not free, and an application handling many requests can spend real time doing it. <b>A <i>connection pooler</i></b> (a service that keeps a set of database connections open and hands them out as needed) sits in the middle:\n\n```text\nWithout pooling        With pooling\n───────────────        ────────────\nLaravel                Laravel\n  ↓                      ↓\nPostgreSQL             Connection Pooler\n                         ↓\n                       PostgreSQL\n```\n\nPgBouncer, RDS Proxy and Neon are the names you will meet.\n\nThe catch is <b>transaction pooling</b>, where a connection is handed back to the pool between transactions rather than staying assigned to your request. Anything that relied on the connection being yours from one statement to the next stops being safe.\n\nLaravel 13 lets you tell the connection it is going through a pooler:\n\n```php\n'pooled' => true,\n```\n\nand offers a `::direct` suffix for the occasional operation that must bypass the pool:\n\n```text\npgsql            → through the pool\npgsql::direct    → straight to PostgreSQL\n```\n\nMost traffic goes through the pool. The rare operation that cannot uses `::direct`. Exactly which operations those are depends on your provider, so read their documentation rather than guessing.",
      diagram: `One application, several databases

                   Laravel
                  /   │   \\
                 ↓    ↓    ↓
              Main  Legacy Analytics
               DB     DB      DB

  DB::connection('mysql')->select(...)
  DB::connection('pgsql')->select(...)

  Leave connection() off and you get DB_CONNECTION's default.


Read / write splitting

                    Laravel
                       │
               ┌───────┴───────┐
               ↓               ↓
             WRITE            READ
               ↓               ↓
           Primary DB      Replica DB

  100,000 reads   →  spread across replicas
    1,000 writes  →  all to the primary

  Caveat: replicas lag. Write then immediately read
  and the row may not be there yet.


Connection pooling

  Without pooling        With pooling
  ───────────────        ────────────
  Laravel                Laravel
    ↓                      ↓
  PostgreSQL             Connection Pooler   (PgBouncer, RDS Proxy, Neon)
                           ↓
                         PostgreSQL

  pgsql          →  through the pool      'pooled' => true
  pgsql::direct  →  straight to PostgreSQL`,
      codeExample: {
        title: "Naming connections, splitting reads, and pooling",
        code: `<?php
// config/database.php

'connections' => [

    // ---------- Several databases in one application ----------

    'mysql' => [
        'driver'   => 'mysql',
        'database' => env('DB_DATABASE'),
        // ...
    ],

    'legacy' => [
        'driver'   => 'mysql',
        'host'     => env('LEGACY_DB_HOST'),
        'database' => env('LEGACY_DB_DATABASE'),
        // ...
    ],

    // ---------- One database, split into read and write ----------

    'mysql_replicated' => [
        'driver' => 'mysql',

        'read' => [
            'host' => [
                env('DB_READ_HOST_1'),
                env('DB_READ_HOST_2'),
            ],
        ],

        'write' => [
            'host' => [
                env('DB_WRITE_HOST'),
            ],
        ],

        'database' => env('DB_DATABASE'),
        'username' => env('DB_USERNAME'),
        'password' => env('DB_PASSWORD'),
    ],

    // ---------- PostgreSQL behind a transaction pooler ----------

    'pgsql' => [
        'driver'   => 'pgsql',
        'host'     => env('DB_HOST'),
        'database' => env('DB_DATABASE'),

        // Tell Laravel this connection goes through a pooler,
        // so it does not assume the connection stays yours.
        'pooled'   => true,
    ],

],


<?php
// ---------- Using them ----------

// The default connection, from DB_CONNECTION.
DB::table('users')->get();

// A named one.
DB::connection('legacy')->table('old_customers')->get();

// With read/write splitting, Laravel routes these for you.
DB::table('posts')->get();                       // → a read replica
DB::table('posts')->insert(['title' => 'Hi']);   // → the primary

// The rare operation that must bypass the pool.
DB::connection('pgsql::direct')->statement('...');


// ---------- The replica lag trap ----------

DB::table('posts')->insert(['title' => 'Hi']);

// This may return nothing: the replica has not caught up yet.
DB::table('posts')->where('title', 'Hi')->first();

// Anything that must read its own write belongs on the primary.`,
      },
      keyTakeaways: [
        "`config/database.php` holds <b>a list of connections</b>, so one application can use several databases.",
        "`DB::connection('name')` picks one; leaving it off uses the `DB_CONNECTION` default.",
        "The usual reason for a second connection is a database you inherited: a legacy system or a reporting database.",
        "<b>A read replica is an automatically maintained copy of the primary</b>, there to absorb read traffic.",
        "Give a connection `read` and `write` blocks and Laravel routes each query itself, with no controller changes.",
        "<b>Replicas lag</b>, so a row written to the primary may not be readable from a replica straight away.",
        "<b>A connection pooler keeps connections open and hands them out</b>, which is PgBouncer, RDS Proxy or Neon.",
        "Laravel 13 supports `'pooled' => true` for pooled PostgreSQL and a `::direct` suffix to bypass the pool.",
      ],
      commonMistakes: [
        "<b>Writing a row and immediately reading it back through a replica.</b> Replication lag means it may not be there.",
        "<b>Adding a second connection to split one application's own tables.</b> That is not what multiple connections are for.",
        "<b>Hard-coding the legacy host in `config/database.php`.</b> Put it in `.env` like every other credential.",
        "<b>Assuming a pooler is transparent.</b> Transaction pooling changes what you can rely on between statements.",
        "<b>Reaching for `::direct` everywhere because it feels safer.</b> That throws away the reason you added the pooler.",
      ],
      quiz: [
        {
          question: "How do you run a query against a connection other than the default?",
          options: [
            "Change `DB_CONNECTION` at runtime",
            "`DB::connection('legacy')->...`",
            "Create a second application",
            "Pass the host to `DB::select()`",
          ],
          correctIndex: 1,
          explanation: "Leaving `connection()` off uses whatever `DB_CONNECTION` names.",
        },
        {
          question: "In a read/write split, where do inserts and updates go?",
          options: [
            "To whichever host answers first",
            "To a read replica",
            "To the primary database",
            "To both, in parallel",
          ],
          correctIndex: 2,
          explanation: "Writes go to the primary, and replicas copy from it.",
        },
        {
          question: "Why can reading a row back immediately after writing it fail with replicas?",
          options: [
            "Laravel caches reads by default",
            "Replicas lag slightly behind the primary",
            "The write is queued until the request ends",
            "Replicas reject recent rows",
          ],
          correctIndex: 1,
          explanation: "Replication takes a moment, so a read-your-own-write needs the primary.",
        },
        {
          question: "What does the `::direct` suffix on a PostgreSQL connection do?",
          options: [
            "Skips the query builder",
            "Disables transactions",
            "Bypasses the connection pooler and talks to PostgreSQL directly",
            "Forces a read replica",
          ],
          correctIndex: 2,
          explanation: "For the occasional operation that transaction pooling cannot support.",
        },
      ],
    },
    {
      id: "raw-queries-and-bindings",
      title: "Raw queries — the DB facade & bindings",
      durationMinutes: 11,
      explanation: "Sometimes you want to write SQL yourself. Laravel does not stop you, and the `DB` facade is the door.\n\n```php\nuse Illuminate\\Support\\Facades\\DB;\n```\n\nThis lesson is as much about one security habit as it is about two methods, so read the middle section twice.\n\n---\n\n### 1. Basic — `select()` and `statement()`\n\n`DB::select()` runs SQL that returns rows:\n\n```php\n$users = DB::select('SELECT * FROM users');\n```\n\nYou get back a plain PHP array of objects. Not Eloquent models, not collections, just rows.\n\n`DB::statement()` runs SQL that does not return a normal result set:\n\n```php\nDB::statement('SET SESSION some_setting = ?', [$value]);\n```\n\nThe split is simply what you want out of it:\n\n```text\nDB::select()\n    ↓\n\"I need results.\"\n\nDB::statement()\n    ↓\n\"I need this SQL to run.\"\n```\n\n---\n\n### 2. Intermediate — the `?` is not optional\n\nHere is the same query written two ways.\n\n```php\n// ❌ Never do this\nDB::select(\n    \"SELECT * FROM users WHERE email = '$email'\"\n);\n```\n\n```php\n// ✓ Do this\nDB::select(\n    'SELECT * FROM users WHERE email = ?',\n    [$email]\n);\n```\n\nThe first one builds a string out of whatever the user typed. If they type `' OR '1'='1`, the SQL you meant is not the SQL that runs. That is <b>SQL injection</b> (an attack where user input changes the meaning of your query rather than being treated as a value).\n\nThe second passes the value separately:\n\n```text\nSQL sent to the database\n   ↓\nSELECT ... WHERE email = ?\n                         ↑\n              value supplied separately\n```\n\nThe database receives the query shape and the value as two different things, so nothing in the value can change the shape. This is <b>parameter binding</b> (supplying values separately from the SQL text), and it is the single habit that makes raw SQL safe.\n\nThere is no version of this rule with exceptions. Not for an admin-only page, not for a value you are sure is an integer, not for a quick test you will tidy later.\n\nNamed bindings read better once a query has several values:\n\n```php\nDB::select(\n    'SELECT * FROM users WHERE email = :email AND active = :active',\n    ['email' => $email, 'active' => true]\n);\n```\n\n---\n\n### 3. Advanced — when to use raw SQL at all\n\nThe `DB` facade has a method per kind of statement:\n\n```text\nDB::select()      rows back\nDB::insert()      insert a row\nDB::update()      returns the number of rows affected\nDB::delete()      returns the number of rows deleted\nDB::statement()   anything else\nDB::unprepared()  no bindings at all, avoid it\n```\n\n`DB::unprepared()` deserves its warning. No bindings means no protection, so it exists for migration-style statements with no user input anywhere near them.\n\nThe more useful judgement is when to reach for raw SQL in the first place. Tomorrow you meet the Query Builder and Eloquent, and for almost all everyday work they are the better answer: they compose, they bind parameters for you, and they read like your application rather than like a database.\n\n```text\nEveryday reads and writes        →  Query Builder / Eloquent\nA report with heavy SQL          →  raw, deliberately\nA database-specific feature      →  raw, deliberately\nA statement with no result set   →  DB::statement()\n```\n\nRaw SQL is a tool for the cases where the alternatives genuinely get in the way, not the default way to talk to your database.",
      diagram: `Two methods, one question

  DB::select()        \"I need results.\"
        ↓
  array of plain PHP objects  (not models, not collections)

  DB::statement()     \"I need this SQL to run.\"
        ↓
  no normal result set


Why the ? matters

  String building                    Parameter binding
  ───────────────                    ─────────────────
  \"... email = '$email'\"             '... email = ?', [$email]

  user types:  ' OR '1'='1           user types:  ' OR '1'='1
        ↓                                  ↓
  the SQL's MEANING changes          it is just a value
        ↓                                  ↓
  SQL injection                      no rows found


  SELECT ... WHERE email = ?
                           ↑
                value supplied separately

  The database gets the SHAPE and the VALUE as two
  different things, so the value cannot change the shape.


The DB facade at a glance

  DB::select()      rows back
  DB::insert()      insert a row
  DB::update()      number of rows affected
  DB::delete()      number of rows deleted
  DB::statement()   anything else
  DB::unprepared()  no bindings, no protection, avoid`,
      codeExample: {
        title: "Raw queries, bound properly",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- select(): rows back ----------

$users = DB::select('SELECT * FROM users');

foreach ($users as $user) {
    echo $user->email;   // plain objects, not Eloquent models
}


// ---------- Positional bindings ----------

$users = DB::select(
    'SELECT * FROM users WHERE email = ?',
    ['rajan@example.com']
);


// ---------- Named bindings, easier to read ----------

$users = DB::select(
    'SELECT * FROM users WHERE email = :email AND active = :active',
    [
        'email'  => $email,
        'active' => true,
    ]
);


// ---------- NEVER build the SQL from user input ----------

// If $email is:  ' OR '1'='1
// then this returns every user in the table.
DB::select(
    "SELECT * FROM users WHERE email = '$email'"   // SQL injection
);

// There is no safe version of this. Not for admins,
// not for integers, not "just for now".


// ---------- statement(): no normal result set ----------

DB::statement('SET SESSION some_setting = ?', [$value]);


// ---------- The rest of the facade ----------

DB::insert('INSERT INTO logs (message) VALUES (?)', ['started']);

$affected = DB::update(
    'UPDATE users SET active = ? WHERE id = ?',
    [false, $id]
);

$deleted = DB::delete('DELETE FROM logs WHERE created_at < ?', [$cutoff]);


// ---------- For everyday work, prefer this ----------

DB::table('users')
    ->where('email', $email)
    ->first();

// Same safety, less string handling. Query Builder comes next.`,
      },
      keyTakeaways: [
        "<b>`DB::select()` runs SQL that returns rows</b>, giving you plain PHP objects rather than models or collections.",
        "<b>`DB::statement()` runs SQL that has no normal result set.</b>",
        "<b>Parameter binding supplies values separately from the SQL text</b>, using `?` or `:name`.",
        "<b>SQL injection is user input changing the meaning of your query</b>, and binding is what prevents it.",
        "There are no exceptions to the binding rule, not for admin pages, integers or temporary code.",
        "`DB::insert()`, `DB::update()` and `DB::delete()` exist too, with update and delete returning row counts.",
        "`DB::unprepared()` takes no bindings, so keep it away from anything a user can influence.",
        "<b>Raw SQL is for reports and database-specific features</b>; the Query Builder and Eloquent are the everyday tools.",
      ],
      commonMistakes: [
        "<b>Interpolating a variable into the SQL string.</b> That is the injection, whatever the variable holds.",
        "<b>Believing casting to an integer makes concatenation safe.</b> Bind the value and stop thinking about it.",
        "<b>Expecting Eloquent models back from `DB::select()`.</b> You get plain objects with no model behaviour.",
        "<b>Using `DB::statement()` for a `SELECT`.</b> If you want rows, `select()` is the method.",
        "<b>Reaching for raw SQL by default.</b> Most queries read better and bind automatically through the Query Builder.",
      ],
      quiz: [
        {
          question: "What does `DB::select()` return?",
          options: [
            "A collection of Eloquent models",
            "An array of plain PHP objects",
            "An associative array of columns",
            "The number of rows found",
          ],
          correctIndex: 1,
          explanation: "No model behaviour and no collection methods, just rows.",
        },
        {
          question: "What is the purpose of the `?` placeholder?",
          options: [
            "It makes the query faster",
            "It marks an optional column",
            "It sends the value separately so it cannot change the query's meaning",
            "It escapes quotes in the SQL string",
          ],
          correctIndex: 2,
          explanation: "The database receives the shape and the value as two separate things.",
        },
        {
          question: "Which of these is a SQL injection risk?",
          options: [
            "`DB::select('... WHERE email = ?', [$email])`",
            "`DB::select(\"... WHERE email = '$email'\")`",
            "`DB::table('users')->where('email', $email)->first()`",
            "`DB::select('... WHERE email = :email', ['email' => $email])`",
          ],
          correctIndex: 1,
          explanation: "The value is glued into the SQL text, so it can change what the SQL means.",
        },
        {
          question: "When is raw SQL the right choice?",
          options: [
            "For all queries, since it is fastest",
            "For heavy reports or database-specific features the builder cannot express",
            "Whenever a query has more than one condition",
            "Never, under any circumstances",
          ],
          correctIndex: 1,
          explanation: "Everyday reads and writes belong in the Query Builder or Eloquent.",
        },
      ],
    },
    {
      id: "transactions",
      title: "Transactions — all of it, or none of it",
      durationMinutes: 11,
      explanation: "This is the most important idea in the day, and the one most likely to save you from a bug you cannot undo.\n\n<b>A <i>transaction</i></b> (a group of database operations treated as a single unit) either happens completely or does not happen at all.\n\n---\n\n### 1. Basic — the half-finished operation\n\nMoving money between two accounts is two operations:\n\n```text\nAccount A          Account B\n    ↓                  ↓\n  - $100            + $100\n```\n\nAnd here is the failure you must never allow:\n\n```text\nA loses $100\n     ↓\nApplication crashes\n     ↓\nB never receives $100\n```\n\nThe money is gone. No error message, no exception on screen, just a database that is now wrong and stays wrong.\n\nA transaction removes that possibility. Both updates land, or neither does.\n\nMoney is the classic example, but the same shape is everywhere: creating an order and reducing stock, registering a user and creating their profile, deleting an invoice and its line items. Any time two writes only make sense together, they belong in a transaction.\n\n---\n\n### 2. Intermediate — commit and rollback\n\nA transaction has three moments:\n\n```text\nBEGIN\n  ↓\nOperation 1\n  ↓\nOperation 2\n  ↓\nOperation 3\n  ↓\nCOMMIT          ← now it is real\n```\n\nIf anything fails partway:\n\n```text\nBEGIN\n  ↓\nOperation 1\n  ↓\nOperation 2 ❌\n  ↓\nROLLBACK\n  ↓\nEverything undone\n```\n\nSo, in two lines:\n\n```text\nSUCCESS → COMMIT     the changes become permanent\nFAILURE → ROLLBACK   the database returns to how it started\n```\n\nUntil `COMMIT`, nothing you did inside the transaction is visible to anyone else. Rolling back is not repair work, it is simply never having happened.\n\n---\n\n### 3. Advanced — the two ways to write one\n\nLaravel's `DB::transaction()` takes a closure and handles both endings for you:\n\n```php\nDB::transaction(function () use ($from, $to) {\n    $from->decrement('balance', 100);\n\n    $to->increment('balance', 100);\n});\n```\n\n```text\nDB::transaction()\n       ↓\n     BEGIN\n       ↓\n  decrement()\n       ↓\n  increment()\n       ↓\n    COMMIT\n```\n\nThrow an exception anywhere inside the closure and Laravel rolls back, then rethrows so your error handling from Day 11 still sees it. You never write `commit` or `rollBack` yourself, which means you cannot forget one.\n\nYou can also drive it manually:\n\n```php\nDB::beginTransaction();\n\ntry {\n    // database operations\n\n    DB::commit();\n} catch (Throwable $e) {\n    DB::rollBack();\n\n    throw $e;\n}\n```\n\nNote the `throw $e` at the end. Rolling back and swallowing the exception leaves you with a silently failed operation, which is worse than the crash.\n\n<b>Prefer the closure.</b> Reach for the manual form only when the begin and the commit genuinely cannot live in one function.\n\nTwo things worth knowing before you meet them in production. `DB::transaction()` accepts a second argument, the number of times to retry when the database reports a deadlock:\n\n```php\nDB::transaction(function () { /* ... */ }, 3);\n```\n\nAnd keep transactions short. A transaction holds locks while it is open, so an HTTP call to a payment provider in the middle of one keeps rows locked for as long as that call takes. Do the slow outside work first, then open the transaction for the writes.",
      diagram: `The failure a transaction prevents

  Account A                 Account B
      ↓                         ↓
   - $100                    + $100

  Without a transaction:

    A loses $100
         ↓
    Application crashes
         ↓
    B never receives $100      ← money gone, no error, database wrong


The two endings

  BEGIN                        BEGIN
    ↓                            ↓
  Operation 1                  Operation 1
    ↓                            ↓
  Operation 2                  Operation 2  ❌
    ↓                            ↓
  Operation 3                  ROLLBACK
    ↓                            ↓
  COMMIT                       everything undone

  SUCCESS → COMMIT     changes become permanent
  FAILURE → ROLLBACK   database returns to how it started

  Until COMMIT, nobody else can see any of it.


Closure vs manual

  DB::transaction(fn)              DB::beginTransaction()
         ↓                                 ↓
       BEGIN                         try operations
         ↓                            │           │
    your closure                     ok        failure
         ↓                            ↓           ↓
  COMMIT, or ROLLBACK               commit()   rollBack()
  and rethrow on exception                     + throw again

  Prefer the closure. You cannot forget a commit you never write.`,
      codeExample: {
        title: "Transactions, both forms",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- The closure form: prefer this ----------

DB::transaction(function () use ($from, $to) {
    $from->decrement('balance', 100);

    $to->increment('balance', 100);
});

// Throw anywhere inside and Laravel rolls back, then rethrows,
// so your Day 11 exception handling still sees the failure.


// ---------- A more realistic one ----------

DB::transaction(function () use ($request) {
    $order = Order::create([
        'user_id' => $request->user()->id,
        'total'   => $request->total,
    ]);

    foreach ($request->items as $item) {
        $order->items()->create($item);

        // If this throws because stock ran out, the order
        // and every item created above disappear too.
        Product::findOrFail($item['product_id'])
            ->decrement('stock', $item['quantity']);
    }
});


// ---------- Retrying on deadlock ----------

// Second argument: how many times to retry if the database
// reports a deadlock before giving up.
DB::transaction(function () {
    // ...
}, 3);


// ---------- The manual form ----------

DB::beginTransaction();

try {
    $from->decrement('balance', 100);
    $to->increment('balance', 100);

    DB::commit();
} catch (Throwable $e) {
    DB::rollBack();

    // Do not swallow it. A silent rollback is worse than a crash.
    throw $e;
}


// ---------- Keep them short ----------

// ❌ The payment call holds locks for its whole duration.
DB::transaction(function () use ($order) {
    $order->update(['status' => 'paying']);
    $result = Http::post('https://payments.example.com/charge');
    $order->update(['status' => $result['status']]);
});

// ✓ Slow work outside, writes inside.
$result = Http::post('https://payments.example.com/charge');

DB::transaction(function () use ($order, $result) {
    $order->update(['status' => $result['status']]);
});`,
      },
      keyTakeaways: [
        "<b>A transaction is a group of operations treated as one unit</b>: all of it happens, or none of it does.",
        "<b>`COMMIT` makes the changes permanent; `ROLLBACK` returns the database to how it started.</b>",
        "Nothing inside a transaction is visible to anyone else until it commits.",
        "<b>`DB::transaction()` takes a closure</b> and commits or rolls back for you.",
        "An exception inside the closure triggers a rollback, and Laravel rethrows it afterwards.",
        "The manual form is `beginTransaction()`, `commit()`, `rollBack()`, and it must rethrow the exception.",
        "A second argument to `DB::transaction()` sets how many times to retry on a deadlock.",
        "<b>Keep transactions short</b>, because they hold locks; do slow outside work before opening one.",
      ],
      commonMistakes: [
        "<b>Writing two related updates without a transaction.</b> A crash between them leaves the database permanently wrong.",
        "<b>Catching the exception, rolling back and returning normally.</b> The operation failed and nobody was told.",
        "<b>Forgetting `commit()` in the manual form.</b> The transaction stays open and your changes never land.",
        "<b>Putting an API call inside a transaction.</b> Rows stay locked for as long as the remote service takes.",
        "<b>Assuming a rollback undoes non-database work.</b> Emails sent and files written inside the closure are still gone.",
      ],
      quiz: [
        {
          question: "What does a transaction guarantee?",
          options: [
            "Queries run faster",
            "Every operation in the group happens, or none of them do",
            "Other users cannot read the table",
            "The operations run in parallel",
          ],
          correctIndex: 1,
          explanation: "Which is what stops a half-finished operation from becoming permanent.",
        },
        {
          question: "What happens if an exception is thrown inside a `DB::transaction()` closure?",
          options: [
            "The committed part stays and the rest is skipped",
            "Laravel commits anyway and logs a warning",
            "Laravel rolls back and rethrows the exception",
            "The exception is swallowed",
          ],
          correctIndex: 2,
          explanation: "So your existing error handling still sees the failure.",
        },
        {
          question: "In the manual form, why does the `catch` block end with `throw $e`?",
          options: [
            "To trigger the rollback",
            "So the failure is not silently hidden after the rollback",
            "Because PHP requires it",
            "To retry the transaction",
          ],
          correctIndex: 1,
          explanation: "Rolling back and returning normally means nobody ever learns it failed.",
        },
        {
          question: "Why should an HTTP call to a payment provider sit outside the transaction?",
          options: [
            "HTTP calls cannot run inside a closure",
            "The transaction holds locks for the whole duration of the call",
            "Laravel forbids it",
            "It would be rolled back",
          ],
          correctIndex: 1,
          explanation: "Do the slow work first, then open the transaction for the writes.",
        },
      ],
    },
    {
      id: "migrations-and-columns",
      title: "Migrations — describing your tables in code",
      durationMinutes: 12,
      explanation: "You have a connection and you can run queries. What you do not have yet is any tables. That is what migrations are for.\n\n<b>A <i>migration</i></b> (a version-controlled description of a change to your database structure) puts your schema in the same place as your code: in files, in Git, reviewed in pull requests.\n\n---\n\n### 1. Basic — why not just click around in a database tool?\n\nBecause of what happens next. Here is a team without migrations:\n\n```text\nDeveloper A\n   ↓\nchanges the database by hand\n\nDeveloper B\n   ↓\ndoes not know what changed\n\nProduction\n   ↓\na different database again\n```\n\nAnd the same team with them:\n\n```text\nMigration\n   ↓\n  Git\n   ↓\nDeveloper A · Developer B · Production\n   ↓\nthe same database changes, in the same order\n```\n\nInstead of opening a database tool and clicking through create table, add column, add index, you write:\n\n```php\nSchema::create(...)\n```\n\ncommit it, and everyone else runs:\n\n```bash\nphp artisan migrate\n```\n\nThis is why migrations are not optional on a team. They are how a schema change gets reviewed, shared and repeated.\n\n---\n\n### 2. Intermediate — `up()` and `down()`\n\nCreate one with Artisan:\n\n```bash\nphp artisan make:migration create_posts_table\n```\n\nYou get a file in `database/migrations/` with a timestamp in front of its name:\n\n```text\n2026_09_01_000000_create_posts_table.php\n```\n\nThat timestamp is not decoration. It is how Laravel knows the order to run them in, which matters the moment one migration depends on a table another one created.\n\nInside are two methods:\n\n```php\npublic function up(): void\n{\n    // apply the change\n}\n\npublic function down(): void\n{\n    // undo it\n}\n```\n\n```text\nup()    → create the posts table\ndown()  → drop the posts table\n```\n\nWrite `down()` properly even when you cannot imagine using it. It is what makes a rollback possible, and the day you need one is not the day you want to discover it is empty.\n\nCreating a table:\n\n```php\nSchema::create('posts', function (Blueprint $table) {\n    $table->id();\n    $table->string('title');\n    $table->text('body');\n    $table->timestamps();\n});\n```\n\nWhich produces:\n\n```text\nposts\n├── id\n├── title\n├── body\n├── created_at\n└── updated_at\n```\n\n`$table->id()` gives you an auto-incrementing primary key. `$table->timestamps()` gives you `created_at` and `updated_at`, which Eloquent maintains for you from tomorrow onwards.\n\n---\n\n### 3. Advanced — columns and modifiers\n\nThe common column types:\n\n```php\n$table->id();\n$table->string('name');\n$table->text('description');\n$table->integer('age');\n$table->boolean('active');\n$table->decimal('price', 10, 2);\n$table->date('birthday');\n$table->dateTime('published_at');\n$table->timestamp('created_at');\n$table->json('settings');\n```\n\nDo not memorise the list. The skill is going from a requirement to a type:\n\n```text\nwhat the value is  →  the column type that fits\n```\n\nThe question that comes up first is `string` against `text`:\n\n```text\nstring   short text, with a length limit    \"Rajan\"\ntext     long text, no practical limit      \"A very long article...\"\n```\n\nA name, an email, a title: `string`. An article body, a description, a comment: `text`.\n\nOne to be careful with is `decimal`. Money belongs in `decimal('price', 10, 2)`, never in a float, because floats cannot represent every decimal value exactly and small errors accumulate.\n\n<b>Modifiers</b> (methods chained onto a column to change how it behaves) do the rest:\n\n```php\n$table->string('nickname')->nullable();\n$table->boolean('active')->default(true);\n$table->string('email')->unique();\n```\n\n```text\nnullable()   the column may hold NULL\ndefault()    the value used when none is given\nunique()     no two rows may share this value\n```\n\nWithout `nullable()`, a column normally cannot hold `NULL` at all, so leaving it out of an insert is an error rather than a blank. That is usually what you want, and `nullable()` is how you say this one is genuinely optional.",
      diagram: `Why migrations exist

  Without                            With
  ───────                            ────
  Developer A                        Migration
     ↓                                  ↓
  changes the DB by hand               Git
                                        ↓
  Developer B                    ┌──────┼──────┐
     ↓                           ↓      ↓      ↓
  has no idea what changed      Dev A  Dev B  Production
                                        ↓
  Production                    the same changes,
     ↓                          in the same order
  different again


One migration, two directions

  database/migrations/2026_09_01_000000_create_posts_table.php
                      └────────┬───────┘
                        timestamp = the order Laravel runs them in

  up()    →  apply the change    →  create the posts table
  down()  →  undo the change     →  drop the posts table

  Write down() even when you cannot imagine needing it.


Schema::create, and what it produces

  Schema::create('posts', function (Blueprint $table) {
      $table->id();              posts
      $table->string('title');   ├── id
      $table->text('body');      ├── title
      $table->timestamps();      ├── body
  });                            ├── created_at
                                 └── updated_at


string vs text, and the modifiers

  string   short, length-limited     \"Rajan\"
  text     long, no real limit       \"A very long article...\"
  decimal  money, never a float      decimal('price', 10, 2)

  nullable()   may hold NULL
  default()    value used when none is given
  unique()     no two rows share this value`,
      codeExample: {
        title: "A migration from Artisan to table",
        code: `# Create the file.
php artisan make:migration create_posts_table

# → database/migrations/2026_09_01_000000_create_posts_table.php


<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();                    // auto-incrementing primary key

            $table->string('title');         // short text
            $table->text('body');            // long text

            $table->boolean('published')
                ->default(false);            // value used when none is given

            $table->string('slug')
                ->unique();                  // no two rows may share it

            $table->string('subtitle')
                ->nullable();                // genuinely optional

            $table->timestamps();            // created_at + updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};


<?php
// ---------- The column types you will actually use ----------

$table->id();                         // bigint, auto-increment, primary key
$table->string('name');               // VARCHAR, short text
$table->text('description');          // long text
$table->integer('age');
$table->boolean('active');
$table->decimal('price', 10, 2);      // money: 10 digits, 2 after the point
$table->date('birthday');
$table->dateTime('published_at');
$table->timestamp('created_at');
$table->json('settings');

// Money in a float looks fine until the rounding errors add up.
// Use decimal.`,
      },
      keyTakeaways: [
        "<b>A migration is a version-controlled description of a database structure change</b>, kept in Git with your code.",
        "Without migrations, every developer's database and production drift apart with nobody able to see how.",
        "`php artisan make:migration create_posts_table` creates a timestamped file in `database/migrations/`.",
        "<b>The timestamp in the filename decides the order Laravel runs migrations in.</b>",
        "<b>`up()` applies the change and `down()` undoes it</b>, and `down()` is what makes a rollback possible.",
        "`$table->id()` adds an auto-incrementing primary key; `$table->timestamps()` adds `created_at` and `updated_at`.",
        "<b>`string` is for short text and `text` is for long text</b>; money belongs in `decimal`, never a float.",
        "Modifiers change how a column behaves: `nullable()`, `default()` and `unique()` are the everyday three.",
      ],
      commonMistakes: [
        "<b>Changing the database by hand and not writing a migration.</b> Nobody else gets the change, including production.",
        "<b>Leaving `down()` empty.</b> Rollback then does nothing, or fails, exactly when you need it.",
        "<b>Editing a migration that has already run on another machine.</b> Laravel will not rerun it; write a new one.",
        "<b>Renaming a migration file to reorder it.</b> Laravel tracks the name, so it looks like an unrun migration.",
        "<b>Storing money in a float.</b> Small rounding errors accumulate into balances that do not add up.",
      ],
      quiz: [
        {
          question: "What is a migration?",
          options: [
            "A backup of the database",
            "A version-controlled description of a database structure change",
            "A command that copies data between servers",
            "A way to seed test data",
          ],
          correctIndex: 1,
          explanation: "Which is what lets a schema change be reviewed, shared and repeated.",
        },
        {
          question: "What does the timestamp in a migration filename decide?",
          options: [
            "When it expires",
            "Which developer wrote it",
            "The order Laravel runs migrations in",
            "Nothing, it is only a label",
          ],
          correctIndex: 2,
          explanation: "It matters as soon as one migration depends on another's table.",
        },
        {
          question: "What belongs in `down()`?",
          options: [
            "Nothing, it is optional",
            "The same code as `up()`",
            "Whatever undoes what `up()` did",
            "The seed data for the table",
          ],
          correctIndex: 2,
          explanation: "An empty `down()` means rollback silently does nothing.",
        },
        {
          question: "Which type should hold an article body?",
          options: ["`string`", "`text`", "`json`", "`char`"],
          correctIndex: 1,
          explanation: "`string` is for short, length-limited values like a name or a title.",
        },
      ],
    },
    {
      id: "indexes-and-foreign-keys",
      title: "Indexes, primary keys & foreign keys",
      durationMinutes: 12,
      explanation: "Columns hold your data. Indexes and keys are what make it fast to find and impossible to corrupt.\n\n---\n\n### 1. Basic — what an index is for\n\n<b>An <i>index</i></b> (a structure the database maintains so it can find rows without reading every one) is the difference between a table that stays usable and one that does not.\n\nImagine a million users and this query:\n\n```sql\nWHERE email = ?\n```\n\nWithout an index, the database reads every row until it finds a match. With one on `email`, it goes more or less straight there. The book analogy is exact: an index at the back, or turning every page.\n\nThe cost is real but small. An index takes space, and every insert has to update it, so you index the columns you actually search on rather than all of them.\n\nA unique index does two jobs at once:\n\n```php\n$table->string('email')->unique();\n```\n\n```text\nemail\n  ↓\nindexed  +  no duplicate values allowed\n```\n\n```text\nrajan@example.com   ✓\nalice@example.com   ✓\nrajan@example.com   ❌ rejected by the database\n```\n\nThat last line is the part worth appreciating. Validation from Day 9 checks uniqueness at the moment of the request; the unique index enforces it in the database itself, so a race between two simultaneous signups cannot slip a duplicate through.\n\n---\n\n### 2. Intermediate — primary keys and composite indexes\n\n```php\n$table->id();\n```\n\ncreates an auto-incrementing <b>primary key</b> (the column that uniquely identifies a row):\n\n```text\nusers\n\nid\n1\n2\n3\n4\n```\n\nEvery table gets one, and Laravel gives it to you without asking.\n\nWhen queries filter on two columns together, <b>a <i>composite index</i></b> (a single index covering more than one column) fits better than two separate ones:\n\n```php\n$table->index(['user_id', 'created_at']);\n```\n\n```text\nIndex\n ├── user_id\n └── created_at\n```\n\nwhich helps:\n\n```sql\nWHERE user_id = ? AND created_at > ?\n```\n\nColumn order matters. An index on `[user_id, created_at]` helps a query filtering on `user_id` alone, but not one filtering on `created_at` alone. Put the column you always filter on first.\n\nThe rule underneath all of this: <b>index for the queries you actually run.</b> Not for the ones you imagine running one day.\n\n---\n\n### 3. Advanced — foreign keys\n\n<b>A <i>foreign key</i></b> (a rule connecting a column in one table to another table's primary key) is how tables relate:\n\n```text\nusers          posts\n-----          -----\nid             id\n               user_id\n```\n\n```text\nusers\n  1\n  │\n  └────────── *\n             posts\n```\n\nOne user, many posts. In a migration:\n\n```php\n$table->foreignId('user_id')->constrained();\n```\n\n```text\nposts.user_id  →  users.id\n```\n\nLaravel works out the table from the column name: `user_id` points at `users`. `constrained()` is the part that makes it a real database rule rather than just a number in a column, which means the database will refuse a `user_id` that does not exist.\n\nThen there is the question that follows: if a user is deleted, what happens to their posts?\n\n```php\n$table->foreignId('user_id')\n    ->constrained()\n    ->cascadeOnDelete();\n```\n\n```text\nDelete User\n     ↓\ndatabase deletes the related Posts too\n```\n\nWithout choosing a behaviour, the delete simply fails with a foreign key constraint error, because the database will not leave posts pointing at a user who no longer exists.\n\nThe options, in plain terms:\n\n```text\ncascadeOnDelete()     delete the children too\nnullOnDelete()        set the column to NULL (needs nullable())\nrestrictOnDelete()    refuse the delete while children exist\n```\n\nChoose deliberately. `cascadeOnDelete()` on the wrong relationship is how one delete quietly removes half a database.",
      diagram: `An index is the index at the back of a book

  1,000,000 users,  WHERE email = ?

  no index    →  read every row until you find it
  index       →  go more or less straight to it

  Cost: space, plus a little work on every insert.
  So index the columns you actually search on.


unique() does two things

  $table->string('email')->unique();

  email
    ↓
  indexed  +  no duplicate values

    rajan@example.com   ✓
    alice@example.com   ✓
    rajan@example.com   ❌ rejected by the database

  Validation checks at request time.
  The index enforces it even when two signups race.


Composite index: order matters

  $table->index(['user_id', 'created_at']);

  Index
   ├── user_id
   └── created_at

  helps    WHERE user_id = ? AND created_at > ?
  helps    WHERE user_id = ?
  does NOT WHERE created_at > ?

  Put the column you always filter on first.


Foreign keys

  users                          posts
  ┌────────────┐                 ┌────────────┐
  │ id         │ ←───────────────│ user_id    │
  │ name       │      1     *    │ id         │
  └────────────┘                 │ title      │
                                 └────────────┘

  $table->foreignId('user_id')->constrained();

  Delete a user, and then what?

    cascadeOnDelete()    delete their posts too
    nullOnDelete()       set user_id to NULL   (needs nullable)
    restrictOnDelete()   refuse while posts exist
    nothing chosen       the delete fails with a constraint error`,
      codeExample: {
        title: "Indexes, keys and a real relationship",
        code: `<?php

use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

// ---------- users ----------

Schema::create('users', function (Blueprint $table) {
    $table->id();                        // primary key

    $table->string('name');

    $table->string('email')->unique();   // index + no duplicates

    $table->timestamps();
});


// ---------- posts, related to users ----------

Schema::create('posts', function (Blueprint $table) {
    $table->id();

    // posts.user_id → users.id
    // Laravel infers the table from the column name.
    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->string('title');
    $table->text('body');

    $table->boolean('published')->default(false);

    $table->timestamps();

    // Indexed together because this is how the app queries them:
    //   WHERE user_id = ? AND created_at > ?
    $table->index(['user_id', 'created_at']);
});


<?php
// ---------- The delete behaviours ----------

// Delete the user, delete their posts.
$table->foreignId('user_id')
    ->constrained()
    ->cascadeOnDelete();

// Keep the posts, but detach them. The column must be nullable.
$table->foreignId('author_id')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

// Refuse to delete a user who still has posts.
$table->foreignId('user_id')
    ->constrained()
    ->restrictOnDelete();

// Choose none of them and the delete fails with a constraint
// error, because the database will not leave orphaned rows.


<?php
// ---------- Indexes on their own ----------

$table->index('status');                        // plain index
$table->index(['user_id', 'created_at']);       // composite
$table->unique(['team_id', 'slug']);            // unique across two columns`,
      },
      keyTakeaways: [
        "<b>An index lets the database find rows without reading every one</b>, which is the difference between fast and unusable.",
        "Indexes cost space and a little work on every insert, so index the columns you actually search on.",
        "<b>`unique()` creates an index and forbids duplicate values</b>, enforcing it even when two requests race.",
        "`$table->id()` creates the auto-incrementing <b>primary key</b> that uniquely identifies a row.",
        "<b>A composite index covers several columns</b>, and the first column in the list is the one it helps on its own.",
        "<b>A foreign key ties a column to another table's primary key</b>, so the database rejects values that do not exist.",
        "`foreignId('user_id')->constrained()` infers the `users` table from the column name.",
        "<b>`cascadeOnDelete()` deletes the children too</b>; `nullOnDelete()` detaches them and `restrictOnDelete()` blocks the delete.",
      ],
      commonMistakes: [
        "<b>Indexing every column just in case.</b> Each index slows down writes and takes space for nothing.",
        "<b>Relying on validation alone for uniqueness.</b> Two simultaneous signups can both pass the check.",
        "<b>Expecting a composite index to help a query on its second column alone.</b> Order decides what it covers.",
        "<b>Using `foreignId()` without `constrained()`.</b> That is just an integer column with no rule behind it.",
        "<b>Adding `cascadeOnDelete()` by habit.</b> On the wrong relationship, one delete takes half the database with it.",
      ],
      quiz: [
        {
          question: "What does an index do?",
          options: [
            "Compresses the table",
            "Lets the database find matching rows without reading every one",
            "Prevents NULL values",
            "Caches query results",
          ],
          correctIndex: 1,
          explanation: "The book analogy is exact: an index at the back, or turning every page.",
        },
        {
          question: "What does `->unique()` give you beyond an index?",
          options: [
            "Automatic sorting",
            "A primary key",
            "A guarantee that no two rows share the value",
            "Faster inserts",
          ],
          correctIndex: 2,
          explanation: "Enforced by the database, so a race between two requests cannot slip past it.",
        },
        {
          question: "An index on `['user_id', 'created_at']` helps which query?",
          options: [
            "`WHERE created_at > ?` alone",
            "`WHERE user_id = ?`",
            "Neither",
            "Only queries using both columns",
          ],
          correctIndex: 1,
          explanation: "It covers the first column alone, and both together, but not the second alone.",
        },
        {
          question: "What happens when you delete a user whose posts have a foreign key with no delete behaviour set?",
          options: [
            "The posts are deleted",
            "The posts' `user_id` becomes NULL",
            "The delete fails with a constraint error",
            "The posts are hidden",
          ],
          correctIndex: 2,
          explanation: "The database refuses to leave posts pointing at a user who no longer exists.",
        },
      ],
    },
    {
      id: "changing-an-existing-table",
      title: "Changing a table that already exists",
      durationMinutes: 10,
      explanation: "Your first migration creates a table. Everything after that changes one, and the rule is the same every time: <b>never edit a migration that has already run. Write a new one.</b>\n\nLaravel records which migrations have run, so editing an old file changes nothing on your machine and nothing in production, while quietly giving a new teammate a different database from yours.\n\n---\n\n### 1. Basic — adding a column\n\n```bash\nphp artisan make:migration add_phone_to_users_table\n```\n\n`Schema::table()` opens an existing table, where `Schema::create()` made a new one:\n\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->string('phone')->nullable();\n});\n```\n\n```text\nBefore              After\n\nusers               users\n├── id              ├── id\n├── name            ├── name\n└── email           ├── email\n                    └── phone\n```\n\nNotice the `nullable()`. The table already has rows, and they have no phone number, so a column that cannot hold `NULL` needs either a default or the migration fails. That is the first thing to think about whenever you add a column to a table with data in it.\n\nAnd the matching `down()`:\n\n```php\nSchema::table('users', function (Blueprint $table) {\n    $table->dropColumn('phone');\n});\n```\n\n---\n\n### 2. Intermediate — dropping and renaming\n\n```php\n$table->dropColumn('phone');\n\n$table->dropColumn(['phone', 'fax']);\n\n$table->renameColumn('phone', 'phone_number');\n```\n\nDropping a column destroys the data in it. There is no rollback that brings it back, because `down()` can recreate the column but not what was inside it.\n\nSo the safe order for removing a column that is still in use:\n\n```text\n1. stop writing to it\n2. stop reading from it, deploy that\n3. then drop it, in a later migration\n```\n\nDropping the column in the same release that removes the code is how you get an error from a server still running the old version.\n\n---\n\n### 3. Advanced — changing a column, and PostgreSQL's `using()`\n\nExisting columns can be modified with `change()`:\n\n```php\n$table->string('name', 100)->change();\n```\n\nOne detail catches everyone once: `change()` replaces the whole definition. Leave off a modifier the column already had and you have just removed it, so restate everything you want to keep:\n\n```php\n$table->string('nickname', 100)->nullable()->change();\n```\n\nA schema change is not only PHP. It rewrites real stored data, so before changing a type, think about:\n\n```text\nExisting data          will every value survive the new type?\nIndexes                does an index need rebuilding?\nConstraints            does a foreign key still make sense?\nDatabase differences   MySQL and PostgreSQL do not behave alike\n```\n\nShortening a `string` to 100 characters when a row holds 180 is not a Laravel problem, it is a data problem, and the migration will fail on the row that does not fit.\n\nPostgreSQL is stricter than MySQL here. Asked to turn text into an integer, it refuses unless you tell it how to convert the existing values. Laravel 13 supports its `using()` clause for exactly that:\n\n```text\nExisting column\n      ↓\nexisting values\n      ↓\n  using(...)\n      ↓\nconverted values\n      ↓\nnew column type\n```\n\n> <b>`using()` tells PostgreSQL how to convert existing values when a column's type changes.</b>\n\nIf you are on MySQL you will never touch it. If you are on PostgreSQL, it is the answer to the type-change error you are about to hit.",
      diagram: `The rule

  A migration that has already run is FINISHED.
  Never edit it. Write a new one.

  Laravel records what has run, so editing an old file:
    your machine     nothing happens
    production       nothing happens
    a new teammate   gets a different database from yours


create vs table

  Schema::create('posts', ...)   a NEW table
  Schema::table('users', ...)    an EXISTING one

  Before              After

  users               users
  ├── id              ├── id
  ├── name            ├── name
  └── email           ├── email
                      └── phone


Adding a column to a table with rows in it

  existing rows have no value for the new column
        ↓
  so it needs nullable(), or a default()
        ↓
  otherwise the migration fails


Dropping safely

  1. stop writing to it
  2. stop reading from it, deploy that
  3. drop it in a later migration

  down() can recreate the column. It cannot recreate the data.


change() replaces the whole definition

  $table->string('nickname', 100)->change();
                                   ↑
             was it nullable before? it is not any more.

  Restate every modifier you want to keep.

  PostgreSQL, changing a type:
    text → integer needs using(...) to say HOW to convert
    MySQL never asks`,
      codeExample: {
        title: "Adding, dropping and changing columns",
        code: `# One migration per change. Name it after what it does.
php artisan make:migration add_phone_to_users_table


<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Schema::table() opens an existing table.
        Schema::table('users', function (Blueprint $table) {
            // nullable() because existing rows have no phone number.
            $table->string('phone')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('phone');
        });
    }
};


<?php
// ---------- The common operations ----------

Schema::table('users', function (Blueprint $table) {

    $table->string('phone')->nullable();          // add

    $table->dropColumn('phone');                  // drop one
    $table->dropColumn(['phone', 'fax']);         // drop several

    $table->renameColumn('phone', 'phone_number');

    // change() replaces the ENTIRE definition, so restate
    // every modifier the column should keep.
    $table->string('nickname', 100)
        ->nullable()
        ->change();

});


<?php
// ---------- Adding a NOT NULL column to a table with rows ----------

// ❌ Fails: existing rows have nothing to put here.
$table->string('country');

// ✓ Either allow NULL...
$table->string('country')->nullable();

// ...or give every existing row a value.
$table->string('country')->default('NP');


<?php
// ---------- PostgreSQL: converting existing values ----------

// PostgreSQL refuses to reinterpret text as an integer on its own.
// using() tells it how to convert what is already stored.
// On MySQL you will never need this.`,
      },
      keyTakeaways: [
        "<b>Never edit a migration that has already run.</b> Laravel will not rerun it, so write a new migration instead.",
        "<b>`Schema::table()` changes an existing table; `Schema::create()` makes a new one.</b>",
        "A new column on a table with rows needs `nullable()` or `default()`, or the migration fails.",
        "`dropColumn()` accepts one name or an array, and `renameColumn()` renames in place.",
        "<b>Dropping a column destroys its data</b>, and `down()` can recreate the column but not the contents.",
        "Remove a column in stages: stop writing, stop reading and deploy, then drop it later.",
        "<b>`change()` replaces the whole column definition</b>, so restate every modifier you want to keep.",
        "Laravel 13 supports PostgreSQL's <b>`using()` clause, which says how to convert existing values</b> during a type change.",
      ],
      commonMistakes: [
        "<b>Editing the original migration to add a column.</b> It never runs again, so only new machines get the change.",
        "<b>Adding a `NOT NULL` column to a table that already has rows.</b> There is no value for them, so it fails.",
        "<b>Calling `change()` and losing `nullable()` or `default()`.</b> Anything you leave out is removed.",
        "<b>Dropping a column in the same release that stops using it.</b> Servers still on the old code break immediately.",
        "<b>Assuming a type change is only PHP.</b> It rewrites stored data, and a value that does not fit stops the migration.",
      ],
      quiz: [
        {
          question: "You need to add a column to a table that is already in production. What do you do?",
          options: [
            "Edit the original `create` migration",
            "Write a new migration using `Schema::table()`",
            "Change it by hand and tell the team",
            "Roll back everything and start again",
          ],
          correctIndex: 1,
          explanation: "A migration that has already run is finished; changes come as new files.",
        },
        {
          question: "Why does a new column on a table with existing rows usually need `nullable()`?",
          options: [
            "Laravel requires it on every added column",
            "Existing rows have no value for it, so a `NOT NULL` column fails",
            "It makes the migration faster",
            "It prevents an index being created",
          ],
          correctIndex: 1,
          explanation: "A `default()` solves the same problem by giving every existing row a value.",
        },
        {
          question: "What does `$table->string('nickname', 100)->change()` do to a column that was previously nullable?",
          options: [
            "Keeps it nullable",
            "Makes it nullable and unique",
            "Removes the nullable modifier, because `change()` replaces the whole definition",
            "Fails with an error",
          ],
          correctIndex: 2,
          explanation: "Restate every modifier the column should keep.",
        },
        {
          question: "What is PostgreSQL's `using()` clause for?",
          options: [
            "Choosing which index to use",
            "Telling PostgreSQL how to convert existing values when a column's type changes",
            "Selecting a connection",
            "Naming a foreign key",
          ],
          correctIndex: 1,
          explanation: "MySQL does not ask; PostgreSQL refuses the change without it.",
        },
      ],
    },
    {
      id: "running-migrations",
      title: "Running migrations — the commands & the workflow",
      durationMinutes: 12,
      explanation: "You have written migrations. Now for running them, and for the one command that can ruin your afternoon.\n\n---\n\n### 1. Basic — `migrate`, and how Laravel knows what has run\n\n```bash\nphp artisan migrate\n```\n\nLaravel only runs what has not run before:\n\n```text\nMigration A ✓ already run\nMigration B ✓ already run\nMigration C ✗ not yet\n        ↓\nphp artisan migrate\n        ↓\nonly C runs\n```\n\nIt knows because it keeps a table in your database called `migrations`:\n\n```text\nmigrations\n├── migration   the filename\n└── batch       which run it belonged to\n```\n\nThat is the whole mechanism. The filename is the identity, which is why renaming a migration file makes Laravel treat it as a new one, and why editing an old file does nothing.\n\n<b>The `batch` column</b> groups everything that ran together in one `migrate` call, and it is what makes rollback possible.\n\nTo see the state without changing anything:\n\n```bash\nphp artisan migrate:status\n```\n\n```text\nMigration                         Ran?\n---------------------------------------\ncreate_users_table                Yes\ncreate_posts_table                Yes\nadd_phone_to_users_table          No\n```\n\nThis is the first thing to run when a database is not what you expected.\n\n---\n\n### 2. Intermediate — undoing things\n\n```bash\nphp artisan migrate:rollback\n```\n\nRollback undoes <b>the latest batch</b>, not the latest file:\n\n```text\nBatch 1              Batch 2\n├── users            └── comments\n└── posts\n\nmigrate:rollback\n      ↓\nbatch 2 only\n      ↓\ncomments migration undone\n```\n\nRun it again and batch 1 goes too. It works by calling each migration's `down()`, which is why an empty `down()` turns rollback into a command that reports success and does nothing.\n\nThe two rebuild commands look similar and are not:\n\n```bash\nphp artisan migrate:refresh   # roll everything back, then run it all again\nphp artisan migrate:fresh     # drop every table, then run it all again\n```\n\n```text\nrefresh   runs down() on everything, then up() on everything\nfresh     drops the tables outright, then up() on everything\n```\n\n`refresh` respects your `down()` methods, so it fails if one of them is broken. `fresh` does not care: it drops the tables and starts over, which is why it is the one people reach for when a `down()` is wrong.\n\n⚠️ <b>Both destroy every row in your database.</b> `fresh` in production is a catastrophe with no undo. Local and testing only, and check which `.env` you are pointing at before you press enter.\n\nThe whole set, worth keeping in your head:\n\n```text\nmigrate            run pending migrations\nmigrate:status     see what has and has not run\nmigrate:rollback   undo the latest batch\nmigrate:refresh    roll back and run again\nmigrate:fresh      drop all tables and run again   ⚠️ destroys data\n```\n\n---\n\n### 3. Advanced — the workflow, and squashing\n\nThe loop you will repeat for the rest of the track:\n\n```text\na requirement changes\n        ↓\nmake:migration\n        ↓\nwrite up() and down()\n        ↓\nphp artisan migrate\n        ↓\ncommit the migration to Git\n```\n\nand for everyone else:\n\n```text\ngit pull\n   ↓\nphp artisan migrate\n   ↓\nthe same database structure\n```\n\nAfter a few years, that loop leaves you with a lot of files:\n\n```text\n001_create_users\n002_create_posts\n003_add_phone\n...\n250_more_changes\n```\n\nEvery new machine and every CI run replays all 250 to arrive at a structure you could have described directly. So Laravel can snapshot it:\n\n```bash\nphp artisan schema:dump\n\nphp artisan schema:dump --prune\n```\n\n```text\nBefore                     After the dump\n\n250 migrations             schema.sql\n      ↓                        ↓\nfresh database             current structure in one step\n      ↓                        ↓\nrun all 250                only migrations newer than the dump\n```\n\n`--prune` deletes the old migration files after writing the dump. That is a real change to the repository, so agree it with your team before running it, and make sure the dump is committed alongside.\n\nOne last picture, tying the day together:\n\n```text\nMigration → Schema → Tables → Columns → Indexes → Foreign Keys\n```\n\nTomorrow you stop describing the database and start reading and writing rows in it.",
      diagram: `How Laravel knows what has run

  migrations table
  ├── migration   the filename
  └── batch       which migrate run it belonged to

  Migration A ✓        Migration B ✓        Migration C ✗
                          ↓
                php artisan migrate
                          ↓
                    only C runs

  The FILENAME is the identity.
  Rename a file  →  looks like a new migration
  Edit a file    →  nothing happens, it already ran


Rollback works on batches

  Batch 1              Batch 2
  ├── users            └── comments
  └── posts

  migrate:rollback  →  batch 2 only  →  calls down() on comments
  again             →  batch 1

  An empty down() means rollback succeeds and does nothing.


refresh vs fresh

  migrate:refresh    down() on everything, then up() on everything
                     respects your down() methods, fails if one is broken

  migrate:fresh      DROP the tables, then up() on everything
                     does not care about down() at all

  ⚠️  Both destroy every row. Local and testing only.
      Check which .env you are pointing at first.


The commands

  migrate            run pending migrations
  migrate:status     see what has and has not run
  migrate:rollback   undo the latest batch
  migrate:refresh    roll back and run again
  migrate:fresh      drop all tables and run again   ⚠️


The everyday loop

  a requirement changes            git pull
          ↓                            ↓
  make:migration                 php artisan migrate
          ↓                            ↓
  write up() and down()          the same structure as you
          ↓
  php artisan migrate
          ↓
  commit it to Git`,
      codeExample: {
        title: "Every migration command, and when to reach for it",
        code: `# ---------- Run what has not run yet ----------

php artisan migrate

# Laravel checks the migrations table and runs only the new files.


# ---------- Look before you touch anything ----------

php artisan migrate:status

#  Migration                         Ran?
#  ---------------------------------------
#  create_users_table                Yes
#  create_posts_table                Yes
#  add_phone_to_users_table          No


# ---------- Undo the latest batch ----------

php artisan migrate:rollback

# Calls down() on every migration in the most recent batch.
# Run it again to undo the batch before that.

php artisan migrate:rollback --step=1   # one migration at a time


# ---------- Rebuild ----------

php artisan migrate:refresh   # down() everything, then up() everything
php artisan migrate:fresh     # DROP every table, then up() everything

# Both destroy all data. Local and testing only.
# refresh needs your down() methods to work. fresh does not.


# ---------- In production ----------

php artisan migrate --force

# Laravel asks for confirmation in production unless you pass --force,
# which is why deploy scripts include it.


# ---------- Squashing a long history ----------

php artisan schema:dump

# Writes the current structure to database/schema/mysql-schema.sql
# A new database loads that, then runs only newer migrations.

php artisan schema:dump --prune

# Same, but deletes the old migration files afterwards.
# Agree this with your team first, and commit the dump.


# ---------- The daily loop ----------

php artisan make:migration add_status_to_posts_table
# write up() and down()
php artisan migrate
git add database/migrations && git commit -m "Add status to posts"`,
      },
      keyTakeaways: [
        "<b>`php artisan migrate` runs only the migrations that have not run before.</b>",
        "Laravel tracks this in a <b>`migrations` table holding the filename and a batch number</b>.",
        "The filename is the identity, so renaming a migration makes it look new and editing one does nothing.",
        "`migrate:status` shows what has and has not run, and is the first thing to check when a database looks wrong.",
        "<b>`migrate:rollback` undoes the latest batch</b> by calling each migration's `down()`.",
        "<b>`migrate:refresh` rolls back and reruns; `migrate:fresh` drops every table and reruns.</b>",
        "⚠️ <b>Both destroy all data</b>, so they belong in local and testing environments only.",
        "<b>`schema:dump` snapshots the current structure</b> so a new database skips replaying hundreds of migrations, and `--prune` deletes the old files.",
      ],
      commonMistakes: [
        "<b>Running `migrate:fresh` against a production `.env`.</b> Every row is gone, and there is no undo.",
        "<b>Expecting `migrate:rollback` to undo one file.</b> It undoes the whole batch that ran together.",
        "<b>Wondering why rollback did nothing.</b> An empty `down()` reports success and changes nothing.",
        "<b>Renaming a migration file to tidy it up.</b> Laravel then sees an unrun migration and tries to run it again.",
        "<b>Running `schema:dump --prune` without telling the team.</b> Their branches still reference the files you deleted.",
      ],
      quiz: [
        {
          question: "How does Laravel know which migrations have already run?",
          options: [
            "From the file modification times",
            "From a `migrations` table storing the filename and batch",
            "It reruns everything and skips errors",
            "From a cache file in `bootstrap/`",
          ],
          correctIndex: 1,
          explanation: "The filename is the identity, which is why renaming one confuses it.",
        },
        {
          question: "What does `migrate:rollback` undo?",
          options: [
            "The single most recent migration",
            "Every migration ever run",
            "The most recent batch",
            "Only migrations you name",
          ],
          correctIndex: 2,
          explanation: "A batch is everything that ran together in one `migrate` call.",
        },
        {
          question: "What is the difference between `migrate:refresh` and `migrate:fresh`?",
          options: [
            "There is none",
            "`refresh` rolls back using `down()`; `fresh` drops the tables outright",
            "`fresh` keeps your data",
            "`refresh` only works in production",
          ],
          correctIndex: 1,
          explanation: "Which is why `fresh` still works when a `down()` method is broken.",
        },
        {
          question: "What does `php artisan schema:dump` give you?",
          options: [
            "A backup of all your rows",
            "A snapshot of the current structure so new databases skip replaying every migration",
            "A list of pending migrations",
            "An export of the migrations table",
          ],
          correctIndex: 1,
          explanation: "Structure, not data, and `--prune` removes the old migration files too.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Where do the values for your database connection belong?",
      options: [
        "Hard-coded in `config/database.php`",
        "In `.env`, which is never committed",
        "In `routes/web.php`",
        "In the migration files",
      ],
      correctIndex: 1,
      explanation: "`config/database.php` describes the shape; `.env` holds this machine's values.",
    },
    {
      question: "Why must raw SQL use `?` or `:name` bindings?",
      options: [
        "To make the query run faster",
        "Because Laravel cannot parse quotes",
        "So user input is treated as a value and cannot change the query's meaning",
        "Only when the value is a string",
      ],
      correctIndex: 2,
      explanation: "That is the difference between a lookup and SQL injection.",
    },
    {
      question: "What does `DB::transaction()` do when the closure throws?",
      options: [
        "Commits what succeeded",
        "Rolls back everything and rethrows the exception",
        "Retries forever",
        "Logs it and continues",
      ],
      correctIndex: 1,
      explanation: "All of it, or none of it, and your error handling still sees the failure.",
    },
    {
      question: "You need to add a column to a table that has already been deployed. What do you do?",
      options: [
        "Edit the original migration",
        "Write a new migration using `Schema::table()`",
        "Run `migrate:fresh`",
        "Change it directly in the database",
      ],
      correctIndex: 1,
      explanation: "A migration that has run is finished, and Laravel will never rerun it.",
    },
    {
      question: "What does `->constrained()` add that `foreignId()` alone does not?",
      options: [
        "An index on the column",
        "A default value",
        "A real foreign key rule, so the database rejects ids that do not exist",
        "Automatic cascading deletes",
      ],
      correctIndex: 2,
      explanation: "Without it you have an integer column and nothing enforcing what goes in it.",
    },
    {
      question: "Which command should never be run against production?",
      options: ["`migrate`", "`migrate:status`", "`migrate:fresh`", "`make:migration`"],
      correctIndex: 2,
      explanation: "It drops every table, and there is no undo.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Give InvoiceHub a real database: migrations for invoices and their lines, a foreign key, and a transaction so a half-saved invoice cannot exist.",
    brief: "Every invoice in InvoiceHub so far has lived in a hard-coded array, which means it disappears the moment the request ends. Today it gets a database.\n\nUse SQLite if you want to start in thirty seconds: set `DB_CONNECTION=sqlite` and run `touch database/database.sqlite`. Use MySQL if you have it running and would rather work with what production uses. Either way the migrations below are identical, which is the point of the connection layer.\n\nYou are not writing Eloquent models today. Reads and writes go through `DB::table()` and, where the lesson calls for it, raw SQL. Tomorrow those become models, and none of the migrations you write today will need to change.",
    steps: [
      "Set up the connection in `.env`, run `php artisan migrate`, and confirm you get the default Laravel tables plus a `migrations` table. Open `migrate:status` and read what it tells you.",
      "Create `create_invoices_table`: `id()`, `number` as a unique string, `customer_name`, `total` as `decimal(10, 2)`, `status` as a string defaulting to `draft`, and `timestamps()`. Write a real `down()`.",
      "Create `create_invoice_lines_table`: `id()`, a `foreignId('invoice_id')->constrained()->cascadeOnDelete()`, `description` as text, `quantity` as an integer, `unit_price` as `decimal(10, 2)`, and `timestamps()`.",
      "Run `php artisan migrate` and then `migrate:rollback`, then migrate again. If rollback leaves anything behind, your `down()` methods are wrong.",
      "Write a `store` action that inserts the invoice and all its lines inside `DB::transaction()`, calculating the total from the lines. Throw an exception deliberately after the first line, confirm nothing at all was saved, then remove the throw.",
      "Delete an invoice that has lines and confirm the lines went with it. Then temporarily change the migration to `restrictOnDelete()` on a fresh database and watch the delete fail instead. Put it back to cascade.",
      "Create `add_due_date_to_invoices_table` adding a nullable `due_date`. Explain in the migration, in one comment, why it has to be nullable.",
      "Add an index for the query your list page actually runs: `$table->index(['status', 'created_at'])`. Write down which query you added it for.",
      "Write one raw-SQL report with `DB::select()`: total invoiced per customer, filtered by a date the caller supplies. Bind the date. Then write the same thing with `DB::table()` and keep whichever reads better.",
      "Deliberately try the unsafe version of that query with a value like `' OR '1'='1` to see what string building does, then delete it and never write it again.",
      "Run `php artisan migrate:fresh` on your local database and confirm you get a working empty schema back. Note in a comment why this command must not touch production.",
      "Commit every migration. Ask a friend, or a second clone of the repo, to pull and run `php artisan migrate` and end up with the same schema.",
    ],
    acceptance: [
      "`php artisan migrate:status` shows every migration as run, with no pending files.",
      "`php artisan migrate:rollback` followed by `php artisan migrate` returns the database to exactly the same structure.",
      "Creating an invoice whose second line fails leaves no invoice and no lines behind.",
      "Deleting an invoice removes its lines, and the database refuses an `invoice_id` that does not exist.",
      "Inserting two invoices with the same `number` is rejected by the database, not only by validation.",
      "Every raw query in the project uses bindings, and no SQL string in the codebase contains a variable.",
      "A fresh clone of the repository plus `php artisan migrate` produces your schema with no manual steps.",
    ],
    stretch: [
      "Add a second connection in `config/database.php` pointing at a separate SQLite file, and write one report that reads from it with `DB::connection('reports')`.",
      "Add `restrictOnDelete()` to a `payments` table so an invoice with payments cannot be deleted, and handle the resulting exception with the error handling you built on Day 11.",
      "Run `php artisan schema:dump` on your project, read the generated file, and write two sentences on what it would save a new developer.",
    ],
  },
};
