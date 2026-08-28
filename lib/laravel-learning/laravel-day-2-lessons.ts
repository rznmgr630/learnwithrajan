import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_2_LESSONS: LessonDay = {
  day: 2,
  title: "Directory structure, configuration & the Service Container",
  totalMinutes: 39,
  difficulty: "Beginner",
  lessons: [
    {
      id: "project-structure",
      title: "Where everything lives",
      durationMinutes: 9,
      explanation: "Yesterday you created an application. Today you open it.\n\nThe goal is not to memorise every file. It is to learn <b>where to look when you need something</b>.\n\n```text\nlaravel-app/\n│\n├── app/\n├── bootstrap/\n├── config/\n├── database/\n├── public/\n├── resources/\n├── routes/\n├── storage/\n├── tests/\n│\n├── .env\n├── .env.example\n├── artisan\n└── composer.json\n```\n\n---\n\n### 1. Basic — `app/` and `routes/`\n\n<b>`app/`</b> holds your application's PHP code. This is where you will spend most of your Laravel career:\n\n```text\napp/\n├── Models/          data\n├── Http/\n│   ├── Controllers/ request handling\n│   └── Middleware/  checks before your code\n├── Services/\n├── Jobs/\n├── Events/\n└── Providers/\n```\n\nYour business code lives here. Laravel's own framework code does not — that sits in `vendor/`.\n\n<b>`routes/`</b> holds route definitions. A <b>route</b> (a rule saying what Laravel should do when a URL is requested) connects a URL to code:\n\n```php\nuse Illuminate\\Support\\Facades\\Route;\n\nRoute::get('/hello', function () {\n    return 'Hello World';\n});\n```\n\n```text\nGET /hello\n    ↓\nroutes/web.php\n    ↓\nMatching route\n    ↓\n\"Hello World\"\n```\n\n`web.php` is for browser routes. You may also see `console.php`, and other route files depending on the application.\n\n---\n\n### 2. Intermediate — `resources/`, `database/`, `config/`\n\n<b>`resources/`</b> holds what builds the interface — Blade views, and frontend assets if you have them:\n\n```text\nresources/\n└── views/\n    └── welcome.blade.php\n```\n\n<b>`database/`</b> holds everything about your database's shape and sample data:\n\n```text\ndatabase/\n├── migrations/ → database structure\n├── factories/  → generate sample data\n└── seeders/    → insert sample data\n```\n\nA <b>migration</b> (a PHP file describing a database structure change) lets you create tables in code rather than by hand:\n\n```php\nSchema::create('users', function (Blueprint $table) {\n    $table->id();\n    $table->string('name');\n    $table->string('email');\n});\n```\n\n<b>`config/`</b> holds application settings — database, cache, mail, queues, filesystems. You will meet it properly in the next lesson.\n\n---\n\n### 3. Advanced — `public/`, and why it matters\n\n<b>`public/`</b> is the only directory the web server should expose. Its key file:\n\n```text\npublic/index.php\n```\n\nis the entry point every web request reaches.\n\n```text\nBrowser\n   │ GET /users\n   ↓\npublic/index.php\n   ↓\nLaravel\n   ↓\nRoute → Controller → Response\n```\n\nNow look at what is <b>not</b> in `public/`:\n\n```text\n.env          database passwords, API keys, APP_KEY\nconfig/       application settings\ndatabase/     migrations and seeders\napp/          your source code\n```\n\nIf you point the web server at the project root instead of `public/`, all of that becomes fetchable over HTTP. Someone requesting `/.env` gets your database password.\n\n```text\n                 Internet\n                    │\n                    ↓\n                 public/         ← the only thing exposed\n                    │\n                    ↓\n              index.php\n                    │\n                    ↓\n                 Laravel         ← everything else, behind it\n```\n\nThat is not a detail. It is the single most consequential thing on this page.",
      diagram: `The map, by responsibility

app/          your application's PHP code
routes/       which URL runs which code
resources/    views and frontend assets
database/     migrations, factories, seeders
config/       application settings
public/       the web entry point
bootstrap/    application startup
storage/      logs, cache, generated files
tests/        automated tests


Inside app/

app/
├── Models/          data
├── Http/
│   ├── Controllers/ request handling
│   └── Middleware/  checks before your code
├── Services/
├── Jobs/
└── Providers/


Inside database/

database/
├── migrations/ → the structure
├── factories/  → generate sample rows
└── seeders/    → insert them


Only public/ faces the internet

                 Internet
                    │
                    ↓
                 public/     ← exposed
                    │
              index.php
                    │
                    ↓
                 Laravel     ← behind it:
                             .env, config/, database/, app/

point the server at the project root instead and
a request for /.env returns your database password`,
      codeExample: {
        title: "Reading the project like a map",
        code: `<?php

// ── routes/web.php — which URL runs which code ────────────────────
use Illuminate\\Support\\Facades\\Route;

Route::get('/hello', function () {
    return 'Hello World';
});

// GET /hello → routes/web.php → this closure → "Hello World"

// ── app/Models/User.php — one class per table ─────────────────────
class User extends Model
{
}

// ── app/Http/Controllers/UserController.php — request handling ────
class UserController
{
    public function show(int $id) { /* ... */ }
}

// ── database/migrations/… — the structure, in code ────────────────
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email');
});

// ── resources/views/welcome.blade.php — what the user sees ────────
//   <h1>Hello, {{ $name }}</h1>

// ── public/index.php — the entry point, and the security boundary ─
// Point your web server here, never at the project root.
//
// Exposed:      public/
// Behind it:    .env, config/, database/, app/, storage/
//
// Root-pointed server → GET /.env → your database password, in plain
// text, to anyone who asks. This is the one mistake worth fearing.`,
      },
      keyTakeaways: [
        "<b>`app/`</b> holds your application's PHP code; Laravel's own code lives in `vendor/`.",
        "<b>`routes/`</b> maps a URL to the code that answers it.",
        "<b>`resources/`</b> holds views and frontend assets; <b>`database/`</b> holds migrations, factories and seeders.",
        "A <b>migration</b> describes a database structure change in PHP rather than by hand.",
        "<b>`public/`</b> is the only directory the web server should expose.",
        "Pointing the server at the project root makes <b>`.env` fetchable over HTTP</b> — the mistake with the worst consequences here.",
      ],
      commonMistakes: [
        "<b>Pointing the web server at the project root</b> — `.env`, `config/` and `database/` become fetchable over HTTP. A request for `/.env` returns your database password in plain text.",
        "<b>Editing files in `vendor/`</b> — that is Laravel's own code, regenerated by Composer. Your changes vanish on the next `composer install`.",
        "<b>Putting business logic in `routes/web.php`</b> — a route file full of closures with real logic becomes unreadable and untestable. Routes should point at controllers.",
        "<b>Trying to memorise every directory today</b> — `storage/`, `bootstrap/cache/` and `tests/` make sense once you have a reason to open them.",
      ],
      quiz: [
        {
          question: "Where does most of your application's PHP code live?",
          options: [
            "`public/`",
            "`routes/`",
            "`config/`",
            "`app/`",
          ],
          correctIndex: 3,
          explanation: "Laravel's own framework code lives in `vendor/`, not `app/`.",
        },
        {
          question: "Where do application routes normally live?",
          options: [
            "`routes/`",
            "`database/`",
            "`storage/`",
            "`public/`",
          ],
          correctIndex: 0,
          explanation: "`web.php` handles browser routes.",
        },
        {
          question: "What is `public/index.php`?",
          options: [
            "Database configuration",
            "An application model",
            "The entry point for web requests",
            "A cache file",
          ],
          correctIndex: 2,
          explanation: "Every web request reaches Laravel through this one file.",
        },
        {
          question: "Why must the web server point at `public/` and not the project root?",
          options: [
            "Otherwise `.env`, `config/` and `database/` become fetchable over HTTP",
            "It is faster",
            "Laravel refuses to start otherwise",
          ],
          correctIndex: 0,
          explanation: "A request for `/.env` would return your database password in plain text.",
        },
        {
          question: "What does `database/migrations/` contain?",
          options: [
            "Sample rows to insert",
            "PHP files describing database structure changes",
            "Cached query results",
          ],
          correctIndex: 1,
          explanation: "Factories generate sample data and seeders insert it.",
        },
      ],
    },
    {
      id: "bootstrap-and-kernel",
      title: "How Laravel starts, and where Kernel.php went",
      durationMinutes: 9,
      explanation: "<b>Bootstrap</b> (the process of starting and preparing an application) is what the `bootstrap/` directory is named after.\n\n```text\nbootstrap/\n├── app.php\n├── providers.php\n└── cache/\n```\n\nTwo files matter today.\n\n---\n\n### 1. Basic — `bootstrap/app.php`\n\nThis is the central setup file for a modern Laravel application. It configures:\n\n```text\n              bootstrap/app.php\n                     │\n        ┌────────────┼────────────┐\n        ↓            ↓            ↓\n     Routing     Middleware   Exceptions\n        │            │            │\n        ↓            ↓            ↓\n      URLs      Request rules   Errors\n```\n\nOne file, three concerns: which route files to load, which middleware runs, and how exceptions are handled.\n\n---\n\n### 2. Intermediate — why `app/Http/Kernel.php` is missing\n\nOpen almost any older Laravel tutorial and you will read:\n\n> \"Go to `app/Http/Kernel.php` and add your middleware.\"\n\nThen you look in your project and it is not there. Nothing is broken — the file genuinely no longer exists.\n\n```text\nOlder Laravel              Modern Laravel\n\napp/Http/Kernel.php   →    bootstrap/app.php\n```\n\nMiddleware that used to be registered in `Http/Kernel.php` is now configured through the application bootstrap. This is the single biggest reason old Laravel tutorials confuse people: they describe a file that was removed, and the reader assumes their install is broken.\n\nWhen a tutorial mentions `Http/Kernel.php`, that tells you its age. Look for the same concept in `bootstrap/app.php` instead.\n\n---\n\n### What middleware actually is\n\n<b>Middleware</b> (code that inspects or changes an HTTP request before it reaches your application logic) sits in front of your controller:\n\n```text\nBrowser\n   │ Request\n   ↓\nMiddleware\n   ├── Is the user authenticated?\n   ├── Is this request allowed?\n   ↓\nController\n   ↓\nResponse\n```\n\nA concrete case:\n\n```text\nRequest\n   ↓\nAuthentication middleware\n   ↓\nIs the user logged in?\n   │\n   ├── NO  → return a login response, controller never runs\n   │\n   └── YES → continue\n                 ↓\n             Controller\n```\n\nYou will build middleware properly later. Today, know two things: what it is, and that modern Laravel configures it in `bootstrap/app.php`.\n\n---\n\n### 3. Advanced — `bootstrap/providers.php`\n\nThe second file lists your application's service providers:\n\n```php\nreturn [\n    App\\Providers\\AppServiceProvider::class,\n];\n```\n\nA <b>service provider</b> (a class that registers and prepares services when Laravel starts) tells Laravel which parts of your application to set up.\n\n```text\nLaravel starts\n      ↓\nbootstrap/providers.php\n      ↓\nwhich providers to load\n      ↓\nService Providers\n      ↓\nservices registered\n      ↓\nApplication ready\n```\n\nPut the whole startup together:\n\n```text\n                   Laravel starts\n                         │\n                         ↓\n                bootstrap/app.php\n                         │\n          ┌──────────────┼──────────────┐\n          ↓              ↓              ↓\n       Routing       Middleware     Exceptions\n          │              │              │\n          └──────────────┼──────────────┘\n                         ↓\n                bootstrap/providers.php\n                         ↓\n                  Service Providers\n                         ↓\n                 Application ready\n```\n\nProviders are the bridge into the last lesson of today, where you will see what they actually register.",
      diagram: `One file, three concerns

              bootstrap/app.php
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
     Routing     Middleware   Exceptions
        │            │            │
        ↓            ↓            ↓
      URLs      Request rules   Errors


The rename that confuses every old tutorial

Older Laravel              Modern Laravel

app/Http/Kernel.php   →    bootstrap/app.php

a tutorial that says "open Http/Kernel.php" is telling you its age


Middleware decides whether your controller ever runs

Request
   ↓
Authentication middleware
   ↓
Is the user logged in?
   │
   ├── NO  → login response, controller never runs
   │
   └── YES → Controller → Response


The whole startup

Laravel starts
      ↓
bootstrap/app.php        routing, middleware, exceptions
      ↓
bootstrap/providers.php  which providers to load
      ↓
Service Providers        services registered
      ↓
Application ready`,
      codeExample: {
        title: "The two bootstrap files",
        code: `<?php

// ── bootstrap/app.php — the central setup file ────────────────────
// Configures three things:
//   routing      which route files to load
//   middleware   what runs before and after your code
//   exceptions   how errors become responses
//
// This is where middleware registration lives in modern Laravel.

// ── What older tutorials tell you to open ─────────────────────────
// app/Http/Kernel.php     ← does not exist any more
//
// If a tutorial says "add your middleware to Http/Kernel.php", it is
// describing an older Laravel. Nothing is wrong with your install.
// Look for the same concept in bootstrap/app.php instead.

// ── bootstrap/providers.php — which providers to load ─────────────
return [
    App\\Providers\\AppServiceProvider::class,
];

// ── What middleware does, in shape ────────────────────────────────
// Request
//    ↓
// Authentication middleware
//    ↓
// logged in?  NO  → return a login response; the controller never runs
//             YES → continue to the controller
//
// Middleware sees the request on the way in and the response on the
// way out, which is why authentication, permissions and rate limiting
// all live there rather than at the top of every controller method.`,
      },
      keyTakeaways: [
        "<b>Bootstrap</b> means starting and preparing the application — hence the directory name.",
        "<b>`bootstrap/app.php`</b> configures routing, middleware and exceptions in one place.",
        "<b>`app/Http/Kernel.php` no longer exists</b> — modern Laravel moved that configuration into the bootstrap.",
        "A tutorial that says \"open `Http/Kernel.php`\" is telling you <b>how old it is</b>, not that your install is broken.",
        "<b>Middleware</b> runs before your controller and can stop the request from reaching it at all.",
        "<b>`bootstrap/providers.php`</b> lists the service providers Laravel loads at startup.",
      ],
      commonMistakes: [
        "<b>Searching for `app/Http/Kernel.php` and assuming the install failed</b> — the file was removed. Follow the tutorial's <i>concept</i> into `bootstrap/app.php`.",
        "<b>Creating `app/Http/Kernel.php` yourself</b> because a tutorial said so — modern Laravel does not read it, so the middleware you register there never runs.",
        "<b>Putting authentication checks at the top of every controller method</b> — that is what middleware exists for, and it runs in one place instead of thirty.",
      ],
      quiz: [
        {
          question: "Where is middleware configuration handled in modern Laravel?",
          options: [
            "`app/Http/Kernel.php`",
            "`bootstrap/app.php`",
            "`.env.example`",
            "`database/`",
          ],
          correctIndex: 1,
          explanation: "That file also configures routing and exception handling.",
        },
        {
          question: "Why can you not find `app/Http/Kernel.php`?",
          options: [
            "Modern Laravel uses a different application structure",
            "Composer failed",
            "You deleted it",
            "It is hidden",
          ],
          correctIndex: 0,
          explanation: "A tutorial that mentions it is describing an older version of Laravel.",
        },
        {
          question: "What does `bootstrap/app.php` configure?",
          options: [
            "Only the database connection",
            "The list of installed packages",
            "Routing, middleware and exception handling",
          ],
          correctIndex: 2,
          explanation: "One file, three concerns, all at application startup.",
        },
        {
          question: "What can middleware do that a controller cannot?",
          options: [
            "Query the database",
            "Stop a request before the controller runs at all",
            "Return JSON",
          ],
          correctIndex: 1,
          explanation: "An unauthenticated request gets a login response and never reaches your code.",
        },
        {
          question: "What does `bootstrap/providers.php` contain?",
          options: [
            "Environment variables",
            "Cached routes",
            "A list of the application's service providers",
          ],
          correctIndex: 2,
          explanation: "Laravel loads them at startup so their services are registered.",
        },
      ],
    },
    {
      id: "configuration",
      title: "Configuration — env() vs config()",
      durationMinutes: 10,
      explanation: "Yesterday you met `.env`. Today you connect it to the `config/` directory.\n\n---\n\n### 1. Basic — the chain from `.env` to your code\n\nSay `.env` contains:\n\n```env\nAPP_NAME=\"My Blog\"\n```\n\nA configuration file reads it:\n\n```php\n// config/app.php\n'name' => env('APP_NAME', 'Laravel'),\n```\n\nAnd your application reads the configuration:\n\n```php\nconfig('app.name');   // \"My Blog\"\n```\n\n```text\n.env\n │ APP_NAME=\"My Blog\"\n ↓\nenv()\n │\n ↓\nconfig/app.php\n │\n ↓\nconfig('app.name')\n │\n ↓\nApplication code\n```\n\n<b>`env()`</b> reads an environment variable. The second argument is a fallback:\n\n```php\nenv('APP_NAME', 'Laravel')   // use APP_NAME if set, otherwise \"Laravel\"\n```\n\n<b>`config()`</b> reads a value from your configuration files, using dot notation: `config('app.name')` means the `name` key in `config/app.php`.\n\n---\n\n### 2. Intermediate — the rule that matters\n\n> <b>Use `env()` inside configuration files. Use `config()` everywhere else.</b>\n\nNot this:\n\n```php\nclass UserService\n{\n    public function getAppName()\n    {\n        return env('APP_NAME');    // wrong layer\n    }\n}\n```\n\nThis:\n\n```php\n// config/app.php\n'name' => env('APP_NAME', 'Laravel'),\n\n// anywhere in your application\nconfig('app.name');\n```\n\n```text\nRecommended                    Not this\n\n.env                           .env\n  ↓                              ↓\nenv()                          env()\n  ↓                              ↓\nconfig file                    everywhere in the application\n  ↓\nconfig()\n  ↓\nApplication\n```\n\nThe reason is caching, which is the next section.\n\n---\n\n### 3. Advanced — configuration caching\n\n<b>Configuration cache</b> (a saved, combined version of your configuration so Laravel can load it in one step) speeds up production:\n\n```text\nconfig/*.php\n     ↓\nconfig:cache\n     ↓\nCached configuration\n     ↓\nFaster startup\n```\n\n```bash\nphp artisan config:cache    # build the cache\nphp artisan config:clear    # remove it\n```\n\nHere is the catch, and the reason for the rule above. <b>Once configuration is cached, Laravel loads the cache instead of re-reading `.env`.</b> A call to `env()` scattered through your application code has nothing to read, and quietly returns `null`.\n\nCode that reads through `config()` keeps working, because the value was captured into the cache when it was built.\n\n```text\n.env changed\n    │\n    ↓\nIs configuration cached?\n    │\n    ├── YES → the cached value is still in use\n    │\n    └── NO  → Laravel reads fresh configuration\n```\n\nThat is a genuinely confusing bug the first time: you edit `.env`, reload, and nothing changes. Run `php artisan config:clear`.\n\n---\n\n### A slimmer `config/`\n\nOpen `config/` and you may think: \"where are all the files the older tutorials show?\"\n\nModern Laravel ships a slimmer <b>skeleton</b> (the starting structure a new application is created with). It does not include every possible configuration file by default. If you need one:\n\n```bash\nphp artisan config:publish cache\n```\n\nThat places `config/cache.php` in your application so you can customise it. Publish only what you actually need to change.\n\n---\n\n### `php artisan about`\n\nOne command answers most \"what is this project running?\" questions:\n\n```bash\nphp artisan about\n```\n\nIt reports the Laravel version, PHP version, environment, application URL, and the cache, database, queue, session and filesystem drivers in use — rather than opening five files to find out.",
      diagram: `The chain, and where each helper belongs

.env
 │  APP_NAME="My Blog"
 ↓
env()          ← belongs here, inside config files
 │
 ↓
config/app.php
 │  'name' => env('APP_NAME', 'Laravel')
 ↓
config()       ← belongs everywhere else
 │
 ↓
Application code


Why the rule exists

php artisan config:cache
        ↓
Laravel loads the cache, and stops re-reading .env
        ↓
env() in application code has nothing to read → null
config() still works → the value was captured into the cache


The bug you will hit once

.env changed
    │
    ↓
Is configuration cached?
    │
    ├── YES → your edit appears to do nothing
    │           php artisan config:clear
    │
    └── NO  → Laravel reads it fresh


Two commands, one pair

config:cache   build the combined cache      (production)
config:clear   remove it                     (when .env changes)

php artisan about   what is this project actually running?`,
      codeExample: {
        title: "Reading configuration, and the caching trap",
        code: `<?php

// ── The chain: .env → config file → application ───────────────────

// .env
//   APP_NAME="My Blog"
//   CACHE_STORE=file

// config/app.php — env() belongs HERE
'name' => env('APP_NAME', 'Laravel'),   // second argument is the fallback

// anywhere in your application — config() belongs HERE
config('app.name');            // "My Blog"
config('cache.default');       // "file"   dot notation: file.key

// ── The wrong layer ───────────────────────────────────────────────
class UserService
{
    public function getAppName()
    {
        return env('APP_NAME');   // works today, returns null once cached
    }
}

// ── Why: caching stops Laravel re-reading .env ────────────────────
// php artisan config:cache
//     ↓
// Laravel loads one combined cached file
//     ↓
// env() in application code → null
// config() in application code → still correct

// ── The bug you will hit once ─────────────────────────────────────
// 1. edit .env
// 2. reload the page
// 3. nothing changes
// 4. php artisan config:clear     ← the fix

// ── Publishing a config file the slim skeleton omits ──────────────
// php artisan config:publish cache    → creates config/cache.php
// Publish only what you actually need to customise.

// ── One command instead of opening five files ─────────────────────
// php artisan about
//   Laravel version, PHP version, environment, application URL,
//   and the cache / database / queue / session drivers in use.`,
      },
      keyTakeaways: [
        "The chain is <b>`.env` → `env()` → config file → `config()` → your code</b>.",
        "<b>`env()` belongs inside config files</b>; application code should call `config()`.",
        "`config('app.name')` uses dot notation: the `name` key inside `config/app.php`.",
        "<b>`config:cache`</b> combines configuration into one cached file for faster startup.",
        "Once cached, Laravel <b>stops re-reading `.env`</b> — so stray `env()` calls return `null`.",
        "Edited `.env` and nothing changed? Run <b>`php artisan config:clear`</b>.",
        "<b>`php artisan about`</b> reports versions, environment and every driver in use.",
      ],
      commonMistakes: [
        "<b>Calling `env()` throughout application code</b> — it works in development and returns `null` in production the moment configuration is cached. Read through `config()` instead.",
        "<b>Forgetting the configuration cache after editing `.env`</b> — the change appears to do nothing. `php artisan config:clear` is the fix, and it is worth checking before debugging anything else.",
        "<b>Editing `.env.example` and expecting Laravel to use it</b> — Laravel reads `.env`. The example file is a template for other developers.",
        "<b>Publishing every configuration file</b> — the slim skeleton is deliberate. Publish a file when you actually need to change something in it.",
      ],
      quiz: [
        {
          question: "What does `env()` do?",
          options: [
            "Creates database tables",
            "Reads environment values",
            "Starts Laravel",
            "Creates routes",
          ],
          correctIndex: 1,
          explanation: "The second argument is the fallback when the variable is not set.",
        },
        {
          question: "Where should `env()` normally be used?",
          options: [
            "Everywhere in controllers",
            "Everywhere in models",
            "Blade templates",
            "Configuration files",
          ],
          correctIndex: 3,
          explanation: "Application code should read the value through `config()`.",
        },
        {
          question: "What does `config:cache` do?",
          options: [
            "Combines configuration into one cached file",
            "Deletes configuration",
            "Creates a database",
            "Clears the application cache",
          ],
          correctIndex: 0,
          explanation: "Laravel then loads that one file instead of reading each config file.",
        },
        {
          question: "Why does a stray `env()` call break once configuration is cached?",
          options: [
            "`env()` is removed in production",
            "Laravel stops re-reading `.env`, so the call returns `null`",
            "The cache encrypts the values",
          ],
          correctIndex: 1,
          explanation: "`config()` keeps working, because the value was captured into the cache.",
        },
        {
          question: "You edited `.env` and nothing changed. What should you try?",
          options: [
            "`php artisan config:clear`",
            "Reinstall Composer",
            "Delete `.env.example`",
          ],
          correctIndex: 0,
          explanation: "A stale configuration cache is the usual explanation.",
        },
        {
          question: "What does `php artisan about` show?",
          options: [
            "Versions, environment and the drivers in use",
            "The list of routes",
            "The contents of `.env`",
          ],
          correctIndex: 0,
          explanation: "It answers \"what is this project running?\" without opening five files.",
        },
      ],
    },
    {
      id: "service-container",
      title: "The Service Container and Dependency Injection",
      durationMinutes: 11,
      explanation: "`bootstrap/providers.php` listed some service providers. This lesson is what they actually do.\n\nThe <b>Service Container</b> (Laravel's system for creating and handing out the objects your application needs) sounds abstract. Start with the problem it solves.\n\n---\n\n### 1. Basic — the problem\n\nA checkout controller needs a payment service, so it makes one:\n\n```php\nclass CheckoutController\n{\n    public function store()\n    {\n        $payment = new StripePaymentGateway();\n\n        $payment->charge(100);\n    }\n}\n```\n\n```text\nCheckoutController\n       │\n       ↓\nStripePaymentGateway\n```\n\nNow switch to PayPal. You edit the controller. Now write a test — you cannot, because every run charges a real card. The controller is welded to one specific class.\n\nThat is <b>tight coupling</b> (one piece of code depending directly on one specific implementation).\n\n---\n\n### 2. Intermediate — dependency injection\n\n<b>Dependency injection</b> (giving a class the objects it needs instead of letting it build them) breaks the weld. Instead of `new StripePaymentGateway()` inside the method, ask for it in the constructor:\n\n```php\nclass CheckoutController\n{\n    public function __construct(\n        private PaymentGateway $payments\n    ) {}\n}\n```\n\nYou are telling Laravel: <i>this controller needs something that implements `PaymentGateway`</i>. It no longer knows or cares which one.\n\nThe interface states the contract:\n\n```php\ninterface PaymentGateway\n{\n    public function charge(float $amount): bool;\n}\n```\n\nand an implementation fulfils it:\n\n```php\nclass StripePaymentGateway implements PaymentGateway\n{\n    public function charge(float $amount): bool\n    {\n        return true;\n    }\n}\n```\n\n```text\nPaymentGateway\n     │ \"any payment gateway must provide charge()\"\n     │\n     ├── StripePaymentGateway   \"here is how Stripe does it\"\n     ├── PayPalPaymentGateway\n     └── FakePaymentGateway     \"here is how tests do it\"\n```\n\n---\n\n### 3. Advanced — binding, and who does the work\n\nLaravel can build a <b>concrete class</b> on its own. Given `class UserService {}` and a controller asking for `UserService`, it just makes one.\n\nAn <b>interface</b> is different. Asked for `PaymentGateway`, Laravel has no way to guess whether you meant Stripe, PayPal or the fake. So you tell it once, in a service provider:\n\n```php\nnamespace App\\Providers;\n\nuse App\\Contracts\\PaymentGateway;\nuse App\\Services\\StripePaymentGateway;\nuse Illuminate\\Support\\ServiceProvider;\n\nclass AppServiceProvider extends ServiceProvider\n{\n    public function register(): void\n    {\n        $this->app->bind(\n            PaymentGateway::class,\n            StripePaymentGateway::class\n        );\n    }\n\n    public function boot(): void\n    {\n        //\n    }\n}\n```\n\nNow the resolution runs itself:\n\n```text\nCheckoutController\n       │ needs\n       ↓\nPaymentGateway\n       │\n       ↓\nService Container\n       │ finds the binding\n       ↓\nStripePaymentGateway\n       │\n       ↓\ninjected into the controller\n```\n\nThat is <b>auto-resolution</b> — you never wrote `new` anywhere.\n\n---\n\n### `register()` vs `boot()`\n\n```text\nregister()   declare what exists    → bindings go here\nboot()       runs after every provider has registered\n                                    → use other services here\n```\n\nPut a binding in `register()`. Put work that needs another service already available in `boot()`.\n\n---\n\n### `bind()` vs `singleton()`\n\n```text\nbind()        resolve → a new instance each time\nsingleton()   resolve → the same stored instance\n```\n\nUse `singleton()` when one shared instance is genuinely right, such as a client holding an open connection.\n\n---\n\n### Why any of this matters\n\n```text\nWithout the container          With it\n\nController                     Controller\n    ↓                              ↓\n  Stripe                     PaymentGateway\n                                   ↑\n                             Service Container\n                                   │\n                          ┌────────┼────────┐\n                          ↓        ↓        ↓\n                       Stripe   PayPal    Fake\n```\n\nYour controller now depends on an <b>abstraction</b> rather than one concrete class. Swapping providers is a one-line change in a provider. Testing means binding the fake. Neither touches the controller.\n\nYou will meet this again the moment you write your first test.",
      diagram: `The problem, in one picture

CheckoutController
       │
       ↓
StripePaymentGateway     welded on

switch to PayPal → edit the controller
write a test     → every run charges a real card


Dependency injection asks instead of building

public function __construct(
    private PaymentGateway $payments      ← "I need one of these"
) {}

the controller no longer knows which one it gets


One contract, several implementations

PaymentGateway
     │ any gateway must provide charge()
     │
     ├── StripePaymentGateway
     ├── PayPalPaymentGateway
     └── FakePaymentGateway     ← what tests bind


Resolution, with no new anywhere

CheckoutController
       │ needs
       ↓
PaymentGateway
       ↓
Service Container
       │ finds the binding registered in a provider
       ↓
StripePaymentGateway
       ↓
injected into the controller


Two pairs worth memorising

register()   declare bindings
boot()       runs after all providers registered

bind()       a new instance each resolve
singleton()  the same instance every resolve`,
      codeExample: {
        title: "From new to injected, in four steps",
        code: `<?php

// ── 1. The contract ───────────────────────────────────────────────
interface PaymentGateway
{
    public function charge(float $amount): bool;
}

// ── 2. An implementation (and, later, others) ─────────────────────
class StripePaymentGateway implements PaymentGateway
{
    public function charge(float $amount): bool
    {
        return true;
    }
}

class FakePaymentGateway implements PaymentGateway
{
    public function charge(float $amount): bool
    {
        return true;              // what a test binds instead
    }
}

// ── 3. Tell the container which one to hand out ───────────────────
class AppServiceProvider extends ServiceProvider
{
    public function register(): void          // declare what exists
    {
        $this->app->bind(
            PaymentGateway::class,
            StripePaymentGateway::class
        );
    }

    public function boot(): void              // runs after all providers
    {
        //
    }
}

// ── 4. Ask for the contract, never the class ──────────────────────
class CheckoutController extends Controller
{
    public function __construct(
        private PaymentGateway $payments      // no "new" anywhere
    ) {}

    public function store()
    {
        $this->payments->charge(100);
    }
}

// ── What NOT to write ─────────────────────────────────────────────
// public function store()
// {
//     $payment = new StripePaymentGateway();   // welded to one class
//     $payment->charge(100);                    // and untestable
// }

// ── bind() vs singleton() ─────────────────────────────────────────
// $this->app->bind(...)        a new instance every time it resolves
// $this->app->singleton(...)   the same instance, reused

// ── Resolving by hand, when you have no constructor to inject into ─
$service = app(PaymentGateway::class);
// Constructor injection is clearer when the class has a dependency;
// app() is for the cases where you cannot inject.`,
      },
      keyTakeaways: [
        "The <b>Service Container</b> creates and hands out the objects your application asks for.",
        "Calling `new SomeClass()` inside a method creates <b>tight coupling</b> — hard to swap, hard to test.",
        "<b>Dependency injection</b> means asking for what you need in the constructor instead of building it.",
        "Laravel can build a <b>concrete class</b> automatically; an <b>interface</b> needs a binding.",
        "A <b>service provider</b> is where bindings are registered, in its `register()` method.",
        "<b>`register()`</b> declares what exists; <b>`boot()`</b> runs after every provider has registered.",
        "<b>`bind()`</b> gives a new instance each time; <b>`singleton()`</b> reuses one.",
        "The payoff is testing: bind a <b>fake</b> gateway and the controller never changes.",
      ],
      commonMistakes: [
        "<b>Calling `new` on a dependency inside a method</b> — it welds the class to one implementation, so switching providers means editing the controller and testing means charging a real card.",
        "<b>Expecting Laravel to resolve an interface without a binding</b> — it cannot guess whether you meant Stripe, PayPal or the fake, and throws.",
        "<b>Putting work that uses another service in `register()`</b> — that method runs before every provider has registered, so the service you reach for may not exist yet. Use `boot()`.",
        "<b>Reaching for `singleton()` by default</b> — a shared instance carries state between requests in some setups. Use it when one instance is genuinely correct, not as a habit.",
      ],
      quiz: [
        {
          question: "What is the Service Container?",
          options: [
            "A database table",
            "Laravel's system for creating and resolving the objects your application needs",
            "A Blade template",
            "A Git repository",
          ],
          correctIndex: 1,
          explanation: "Service providers register what it should hand out.",
        },
        {
          question: "What is dependency injection?",
          options: [
            "Installing dependencies manually",
            "Creating database tables",
            "Giving a class the objects it needs instead of letting it build them",
            "Sending HTTP requests",
          ],
          correctIndex: 2,
          explanation: "Ask for it in the constructor rather than calling `new` inside a method.",
        },
        {
          question: "Why must you bind an interface?",
          options: [
            "To create a route",
            "To create a database",
            "Laravel cannot know which implementation you meant",
            "To compile Blade",
          ],
          correctIndex: 2,
          explanation: "A concrete class it can build on its own; an interface has several candidates.",
        },
        {
          question: "What is the difference between `register()` and `boot()`?",
          options: [
            "`boot()` runs first",
            "They are interchangeable",
            "`register()` declares bindings; `boot()` runs after every provider has registered",
          ],
          correctIndex: 2,
          explanation: "Work that needs another service already available belongs in `boot()`.",
        },
        {
          question: "What is the difference between `bind()` and `singleton()`?",
          options: [
            "`singleton()` is faster to write",
            "`bind()` gives a new instance each resolve; `singleton()` reuses the same one",
            "`bind()` only works for interfaces",
          ],
          correctIndex: 1,
          explanation: "Reach for `singleton()` when one shared instance is genuinely right.",
        },
        {
          question: "What is the practical payoff of injecting an interface?",
          options: [
            "You can swap the implementation, and bind a fake one in tests, without touching the controller",
            "The code runs faster",
            "Interfaces are required by PHP",
          ],
          correctIndex: 0,
          explanation: "Otherwise every test run charges a real card.",
        },
      ],
    },
  ],
  selfCheck: [
    {
      question: "What lives in `app/`?",
      answer: "Your application's PHP code: models, controllers, middleware, jobs, events, services and providers.\n\nThis is where you spend most of your time. Laravel's own framework code is <b>not</b> here, it is in `vendor/`.",
    },
    {
      question: "What is in `vendor/`, and why should you never edit it?",
      answer: "`vendor/` holds every package Composer installed, including Laravel itself.\n\nNever edit it because Composer owns it. The next `composer install` or `composer update` overwrites your change without warning, and the change is not in git, so nobody else has it either. When you need different behaviour, change your own code or configuration.",
    },
    {
      question: "Where do routes live, and what is a route?",
      answer: "In `routes/`. A route is a rule connecting a URL to the code that answers it.\n\n`web.php` holds browser routes. Depending on the application you may also see `console.php` for Artisan commands and an API route file.",
    },
    {
      question: "What does `database/` hold?",
      answer: "Three things: <b>migrations</b> (the shape of your tables, described in PHP), <b>factories</b> (recipes for generating fake records) and <b>seeders</b> (code that inserts starting data).\n\nA migration means you create tables in code that lives in git, instead of clicking around a database tool that nobody else can replay.",
    },
    {
      question: "Why must the web server point at `public/` rather than the project root?",
      answer: "Because `public/` is the only directory that is safe to expose. Everything sensitive sits outside it: `.env` with your database password and API keys, `config/`, `database/` and all of `app/`.\n\nPoint the server at the project root and a request for `/.env` returns your credentials in plain text. This is the single most consequential setup detail in a Laravel project.",
      callout: "If you can fetch `/.env` over HTTP, stop and fix the document root before anything else.",
    },
    {
      question: "You are following a tutorial that says to edit `app/Http/Kernel.php`, but the file does not exist. What is going on?",
      answer: "Nothing is broken. Modern Laravel removed that file and moved what it did into `bootstrap/app.php`.\n\nA tutorial mentioning `app/Http/Kernel.php` is telling you its age. Look for the same idea in `bootstrap/app.php` instead of trying to recreate the old file.",
    },
    {
      question: "What is configured in `bootstrap/app.php`?",
      answer: "The application's wiring: routing, middleware and exception handling.\n\nIt is the file you open when you want to register a middleware globally, change how errors are reported, or adjust which route files load.",
    },
    {
      question: "What is middleware, in one sentence?",
      answer: "Code that runs before and after your controller, and can inspect the request, change it, or stop it entirely.\n\nAuthentication is the obvious example: the middleware checks whether someone is logged in, and if not the controller never runs at all.",
    },
    {
      question: "Describe the chain from a value in `.env` to your application code.",
      answer: "`.env` holds the raw value. A file in `config/` reads it with `env()` and gives it a name. Your code reads that name with `config()`.\n\n```text\n.env  →  config/*.php via env()  →  your code via config()\n```\n\nThe indirection is what lets configuration be cached later.",
    },
    {
      question: "Why should `env()` only ever appear inside `config/` files?",
      answer: "Because once you run `config:cache`, Laravel loads one pre-built configuration file and stops reading `.env` at all. Any `env()` call outside `config/` then returns `null`.\n\nThe symptom is nasty: the code works locally, and silently breaks in production where configuration is cached. Read configuration with `config()` and the problem cannot happen.",
    },
    {
      question: "What does `php artisan config:cache` do, and what does it break?",
      answer: "It combines every file in `config/` into one cached file, so Laravel does not read them individually on each request. It is a production speed-up.\n\nWhat it breaks is `env()` outside config files, as above, and it also means edits to `.env` have no effect until you clear the cache.",
    },
    {
      question: "You edited `.env`, reloaded the page, and nothing changed. What do you check?",
      answer: "Almost always a stale configuration cache. Run `php artisan config:clear`.\n\nIf you are running `php artisan serve`, also restart it, since the process read your environment when it started.",
    },
    {
      question: "What is the Service Container?",
      answer: "Laravel's system for creating and handing out the objects your application needs.\n\nWhen a controller says it needs a `PaymentService`, the container is what builds one and passes it in. You have been using it since your first controller without having to think about it.",
    },
    {
      question: "What is Dependency Injection, in plain terms?",
      answer: "Giving a class the objects it needs from outside, instead of letting it build them itself.\n\nIn practice: type-hint what you need in the constructor rather than writing `new` inside a method. The class stops being responsible for knowing how its dependencies get built.",
    },
    {
      question: "Why does an interface need a binding when a normal class does not?",
      answer: "A normal class can be built: the container reads its type hints and constructs it. An interface has no code to run and may have several implementing classes.\n\nSo the container genuinely cannot guess which one you meant, and you have to say: `$this->app->bind(PaymentGateway::class, StripePaymentGateway::class)`.",
    },
    {
      question: "What is the difference between `register()` and `boot()` in a service provider?",
      answer: "`register()` is where you declare bindings. Nothing else is guaranteed to exist yet, so it should only tell the container what to hand out.\n\n`boot()` runs after every provider has registered, so by then the whole application is wired up. Anything that needs another service already available belongs there.",
    },
  ],
  finalQuiz: [
    {
      question: "Where does most of your application's PHP code live?",
      options: [
        "`app/`",
        "`public/`",
        "`config/`",
        "`routes/`",
      ],
      correctIndex: 0,
      explanation: "Laravel's own framework code lives in `vendor/`.",
    },
    {
      question: "Where do application routes normally live?",
      options: [
        "`database/`",
        "`routes/`",
        "`storage/`",
        "`public/`",
      ],
      correctIndex: 1,
      explanation: "`web.php` handles browser routes.",
    },
    {
      question: "What is `public/index.php`?",
      options: [
        "Database configuration",
        "An application model",
        "The public entry point for web requests",
        "A cache file",
      ],
      correctIndex: 2,
      explanation: "Every web request reaches Laravel through this one file.",
    },
    {
      question: "Why must the web server point at `public/` rather than the project root?",
      options: [
        "It is faster",
        "Laravel refuses to start otherwise",
        "Otherwise `.env`, `config/` and `database/` become fetchable over HTTP",
      ],
      correctIndex: 2,
      explanation: "A request for `/.env` would return your database password in plain text.",
    },
    {
      question: "Where is middleware configuration handled in modern Laravel?",
      options: [
        "`app/Http/Kernel.php`",
        "`.env.example`",
        "`bootstrap/app.php`",
        "`database/`",
      ],
      correctIndex: 2,
      explanation: "That file also configures routing and exception handling.",
    },
    {
      question: "Why can you not find `app/Http/Kernel.php` in a modern Laravel application?",
      options: [
        "Modern Laravel uses a different application structure",
        "Composer failed",
        "You deleted it",
        "It is hidden",
      ],
      correctIndex: 0,
      explanation: "A tutorial that mentions it is describing an older version of Laravel.",
    },
    {
      question: "What does `env()` do?",
      options: [
        "Creates database tables",
        "Reads environment values",
        "Starts Laravel",
        "Creates routes",
      ],
      correctIndex: 1,
      explanation: "The second argument is the fallback when the variable is not set.",
    },
    {
      question: "Where should `env()` normally be used?",
      options: [
        "Everywhere in controllers",
        "Configuration files",
        "Everywhere in models",
        "Blade templates",
      ],
      correctIndex: 1,
      explanation: "Application code should read the value through `config()`.",
    },
    {
      question: "What should application code use to read configuration?",
      options: [
        "`env()`",
        "`artisan()`",
        "`phpinfo()`",
        "`config()`",
      ],
      correctIndex: 3,
      explanation: "`config()` keeps working once configuration is cached; `env()` does not.",
    },
    {
      question: "What does `config:cache` do?",
      options: [
        "Deletes configuration",
        "Clears the application cache",
        "Creates a database",
        "Caches application configuration",
      ],
      correctIndex: 3,
      explanation: "Laravel then loads one combined file instead of reading each config file.",
    },
    {
      question: "You edited `.env` and nothing changed. What should you try?",
      options: [
        "Reinstall Composer",
        "`php artisan config:clear`",
        "Delete `.env.example`",
      ],
      correctIndex: 1,
      explanation: "A stale configuration cache is the usual explanation.",
    },
    {
      question: "What is the Service Container?",
      options: [
        "Laravel's system for creating and resolving the objects your application needs",
        "A database table",
        "A Blade template",
        "A Git repository",
      ],
      correctIndex: 0,
      explanation: "Service providers register what it should hand out.",
    },
    {
      question: "What is Dependency Injection?",
      options: [
        "Installing dependencies manually",
        "Sending HTTP requests",
        "Creating database tables",
        "Giving a class the objects it needs instead of letting it build them",
      ],
      correctIndex: 3,
      explanation: "Ask for it in the constructor rather than calling `new` inside a method.",
    },
    {
      question: "Why must you bind an interface?",
      options: [
        "To create a route",
        "To create a database",
        "Laravel cannot know which implementation you meant",
        "To compile Blade",
      ],
      correctIndex: 2,
      explanation: "A concrete class it can build alone; an interface has several candidates.",
    },
    {
      question: "What is the difference between `register()` and `boot()`?",
      options: [
        "`register()` declares bindings; `boot()` runs after every provider has registered",
        "They are interchangeable",
        "`boot()` runs first",
      ],
      correctIndex: 0,
      explanation: "Work needing another service already available belongs in `boot()`.",
    },
  ],
};
