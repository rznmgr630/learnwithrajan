import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_1_LESSONS: LessonDay = {
  day: 1,
  title: "Install and set up Laravel",
  totalMinutes: 35,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-is-laravel",
      title: "What Laravel is, and why a framework",
      durationMinutes: 8,
      explanation: "<b>Laravel</b> (a PHP framework for building web applications) gives you structure and tools so you do not build everything from scratch.\n\nWithout a framework, every project makes you handle all of this yourself:\n\n```text\nHTTP Request\n     ↓\nURL routing\n     ↓\nAuthentication\n     ↓\nValidation\n     ↓\nDatabase\n     ↓\nSessions\n     ↓\nErrors\n     ↓\nHTTP Response\n```\n\nLaravel ships tools for each of those.\n\n```text\n                 Laravel\n                    │\n        ┌───────────┼───────────┐\n        ↓           ↓           ↓\n      Routing    Database    Validation\n        ↓           ↓           ↓\n Authentication   Queues     Testing\n        ↓           ↓           ↓\n     Sessions     Cache       APIs\n```\n\n---\n\n### 1. Basic — why a framework at all\n\nThink about building a house. You could make everything yourself:\n\n```text\nBuild your own tools\n        ↓\nBuild the foundation\n        ↓\nBuild the walls\n        ↓\nBuild the electrical system\n        ↓\nBuild everything else\n```\n\nOr start from something already standing:\n\n```text\nFramework\n    ↓\nFoundation already provided\n    ↓\nYou focus on your application\n```\n\nA framework does not build your application. It gives you a <b>standard way to build it</b>.\n\n---\n\n### 2. Intermediate — what conventions buy you\n\nWithout Laravel, you decide everything yourself:\n\n```text\nWhere should routes go?\nHow should authentication work?\nHow should database queries work?\nHow should validation work?\nHow should errors work?\nWhere should application code live?\n```\n\nEvery answer is defensible, and every project answers differently — which is why joining a new codebase is slow.\n\nLaravel already provides <b>conventions</b> (common, recommended ways of doing things):\n\n```text\nLaravel conventions\n        ↓\nConsistent project structure\n        ↓\nFaster development\n        ↓\nEasier maintenance\n```\n\nThe value is not that Laravel's answers are the only good ones. It is that everyone using Laravel gives the <b>same</b> answers, so you can open any Laravel project and know where to look.\n\n---\n\n### 3. Advanced — what sits under Laravel\n\nLaravel is written in PHP, and Composer manages the PHP packages it needs:\n\n```text\nYour Laravel Application\n          ↓\n       Laravel\n          ↓\n      Composer\n          ↓\n    PHP packages\n          ↓\n         PHP\n```\n\nSo before you can install Laravel you need four things:\n\n```text\nPHP 8.3+\nComposer\nTerminal\nCode Editor\n```\n\nCheck the first two now:\n\n```bash\nphp -v            # PHP 8.3.x or newer\ncomposer --version # Composer version 2.x\n```\n\n```text\nPHP\n │\n └── Runs Laravel\n\nComposer\n │\n └── Installs PHP dependencies\n```\n\n<b>Composer</b> (PHP's dependency manager) installs the packages your application needs. If you know JavaScript, the mapping is direct: `npm` is `composer`, `package.json` is `composer.json`, `node_modules` is `vendor/`.",
      diagram: `What you would build yourself without a framework

HTTP Request → routing → auth → validation → database
             → sessions → errors → HTTP Response

Laravel ships a tool for each of those boxes


The stack, top to bottom

Your Laravel Application
          ↓
       Laravel
          ↓
      Composer          installs the packages
          ↓
    PHP packages
          ↓
         PHP            runs all of it


Four things you need before installing

PHP 8.3+          php -v
Composer          composer --version
Terminal
Code editor


Composer, if you already know npm

npm            →  composer
package.json   →  composer.json
node_modules   →  vendor/
npm install    →  composer install`,
      codeExample: {
        title: "Checking your machine is ready",
        code: `# ── Is PHP new enough for Laravel 13? ─────────────────────────────
php -v
# PHP 8.3.x (cli) ...        ← 8.3 or newer is what you want

# ── Is Composer installed? ────────────────────────────────────────
composer --version
# Composer version 2.x.x ...

# ── What each one is responsible for ──────────────────────────────
# PHP       runs Laravel itself
# Composer  installs the PHP packages Laravel depends on

# ── Composer, side by side with npm ───────────────────────────────
# npm install          →  composer install
# npm update           →  composer update
# package.json         →  composer.json
# node_modules/        →  vendor/

composer require some-package    # downloads it and its dependencies

# If either command above is "not found", install that tool first.
# Nothing else in this lesson will work until both report a version.`,
      },
      keyTakeaways: [
        "<b>Laravel</b> is a PHP framework: structure and tools for the parts every web app needs.",
        "A framework does not write your application — it gives you a <b>standard way</b> to write it.",
        "<b>Conventions</b> matter because everyone answers the same questions the same way.",
        "The stack is <b>your app → Laravel → Composer → PHP</b>.",
        "You need <b>PHP 8.3+, Composer, a terminal and an editor</b> before installing anything.",
        "`php -v` and `composer --version` are the two commands that tell you if you are ready.",
      ],
      commonMistakes: [
        "<b>Expecting the framework to make design decisions for you</b> — Laravel gives you a place to put things, not an application. You still design the features.",
        "<b>Installing Laravel before checking PHP</b> — if `php -v` reports an older version, the install fails partway with a confusing dependency error.",
        "<b>Confusing PHP with Laravel</b> — PHP is the language that runs; Laravel is a set of PHP packages written in it. Upgrading one is not upgrading the other.",
      ],
      quiz: [
        {
          question: "What is Laravel?",
          options: [
            "A database",
            "A code editor",
            "A PHP framework",
            "A JavaScript package",
          ],
          correctIndex: 2,
          explanation: "It gives you structure and tools for the parts every web application needs.",
        },
        {
          question: "What does Composer do?",
          options: [
            "Runs SQL queries",
            "Creates Git branches",
            "Manages PHP dependencies",
            "Runs the browser",
          ],
          correctIndex: 2,
          explanation: "It is to PHP what npm is to JavaScript.",
        },
        {
          question: "What does a framework actually give you?",
          options: [
            "A standard way to build your application",
            "A finished application",
            "A database server",
          ],
          correctIndex: 0,
          explanation: "You still design the features; Laravel decides where things go.",
        },
        {
          question: "Which command checks that PHP is new enough?",
          options: [
            "`laravel --check`",
            "`composer --version`",
            "`php -v`",
          ],
          correctIndex: 2,
          explanation: "Laravel 13 wants PHP 8.3 or newer.",
        },
        {
          question: "In the stack, what sits directly under Laravel?",
          options: [
            "Composer and the PHP packages it installs",
            "The browser",
            "The database",
          ],
          correctIndex: 0,
          explanation: "Your app → Laravel → Composer → PHP packages → PHP.",
        },
      ],
    },
    {
      id: "create-your-first-app",
      title: "Creating your first application",
      durationMinutes: 9,
      explanation: "Now you make something real.\n\n---\n\n### 1. Basic — Laravel Herd and `.test` domains\n\n<b>Laravel Herd</b> (a local development environment that makes running Laravel and PHP applications easy) removes most of the setup work.\n\nWithout it you would configure all of this yourself:\n\n```text\nInstall PHP\n    ↓\nConfigure PHP\n    ↓\nConfigure web server\n    ↓\nConfigure local domains\n    ↓\nConfigure certificates\n    ↓\nStart application\n```\n\nWith it:\n\n```text\nInstall Herd\n     ↓\nPHP + local environment\n     ↓\nCreate Laravel project\n     ↓\nOpen .test domain\n```\n\nHerd serves your projects at a <b>`.test` domain</b>, so `my-app.test` works instead of `localhost:8000`. That is a local convenience only:\n\n```text\nInternet\n   │\n   X          not publicly reachable\n   │\nYour computer\n   │\n   ↓\n Herd\n   │\n   ↓\nmy-app.test\n   │\n   ↓\nLaravel application\n```\n\n`.test` does <b>not</b> mean your app is on the internet.\n\n---\n\n### 2. Intermediate — `laravel new`\n\nThe Laravel installer gives you one command:\n\n```bash\nlaravel new blog\n```\n\nThat creates a complete application:\n\n```text\nblog/\n├── app/\n├── bootstrap/\n├── config/\n├── database/\n├── public/\n├── resources/\n├── routes/\n├── storage/\n├── tests/\n├── vendor/\n├── .env\n├── .env.example\n├── artisan\n└── composer.json\n```\n\nDo not try to understand every folder today. The high-level map is enough:\n\n```text\napp/          → your application code\nbootstrap/    → framework startup files\nconfig/       → configuration\ndatabase/     → migrations, factories, seeders\npublic/       → the public entry point\nresources/    → views and frontend assets\nroutes/       → your routes\nstorage/      → logs, cache, generated files\ntests/        → automated tests\n.env          → local environment configuration\nartisan       → Laravel's command-line tool\ncomposer.json → PHP dependencies\n```\n\n---\n\n### 3. Advanced — starter kits, and why to skip one\n\nWhile creating a project you may be offered a <b>starter kit</b> (a pre-built starting point containing common application functionality) — React, Vue, Svelte, Livewire, or None.\n\nChoosing <b>None</b> gives a clean application:\n\n```text\nLaravel\n   │\n   ↓\nClean foundation\n   │\n   ↓\nYou build your application\n```\n\nChoosing a kit gives you <b>scaffolding</b> (pre-generated code that provides a starting structure):\n\n```text\nLaravel\n   │\n   ↓\nStarter Kit\n   │\n   ├── Authentication\n   ├── Frontend setup\n   ├── Login\n   ├── Registration\n   └── Other scaffolding\n```\n\nFor learning Laravel itself, <b>None</b> is strongly recommended. A starter kit hides the very things you are here to understand:\n\n```text\nLaravel fundamentals\n        ↓\nUnderstand backend\n        ↓\nUnderstand routing\n        ↓\nUnderstand controllers\n        ↓\nUnderstand database\n        ↓\nUnderstand APIs\n        ↓\nThen add your preferred frontend\n```\n\n<b>Today's task is to create two applications</b>, so you can see exactly what a kit changes:\n\n```bash\nlaravel new laravel-basic     # starter kit → None\nlaravel new laravel-starter   # starter kit → React, say\n```\n\nThen open both and compare `app/`, `resources/`, `routes/`, `composer.json` and `package.json`. You will not understand every file yet. Seeing the difference is the point.",
      diagram: `Herd removes the setup, not the understanding

Without Herd                    With Herd

Install PHP                     Install Herd
    ↓                                ↓
Configure PHP                   PHP + local environment
    ↓                                ↓
Configure web server            Create Laravel project
    ↓                                ↓
Configure local domains         Open .test domain
    ↓
Configure certificates
    ↓
Start application


A .test domain is local only

Internet ── X ── not publicly reachable

Your computer → Herd → my-app.test → Laravel application


What laravel new leaves you with

blog/
├── app/           your application code
├── bootstrap/     framework startup
├── config/        configuration
├── database/      migrations, factories, seeders
├── public/        the public entry point
├── resources/     views and frontend assets
├── routes/        your routes
├── storage/       logs, cache, generated files
├── tests/         automated tests
├── .env           local environment configuration
├── artisan        Laravel's command-line tool
└── composer.json  PHP dependencies


Starter kit, or none

None                        A kit
  │                           │
  ↓                           ↓
clean foundation        auth, login, registration,
  │                     frontend scaffolding
  ↓                           │
you build it                  ↓
                        faster start, more to unlearn`,
      codeExample: {
        title: "Creating both applications and comparing them",
        code: `# ── Application 1: no starter kit, the one you learn from ─────────
laravel new laravel-basic
# when prompted:  Starter kit → None

# ── Application 2: with a kit, so you can see the difference ──────
laravel new laravel-starter
# when prompted:  Starter kit → React (or any other)

# ── Compare them ──────────────────────────────────────────────────
# Open both projects and look at the same four places:
#
#   app/            did the kit add controllers or models?
#   resources/      did it add frontend files?
#   routes/         did it add auth routes you did not write?
#   composer.json   which PHP packages were added?
#   package.json    which JavaScript packages were added?
#
# Ask: what did the starter kit actually add?
# You will not understand every file yet. Seeing the difference is the point.

# ── The folders you will meet first ───────────────────────────────
# app/           your code
# routes/        where a URL is matched to code        (day 2)
# app/Http/      controllers live here                 (day 3)
# database/      migrations and seeders                (later)
# .env           configuration that differs per machine`,
      },
      keyTakeaways: [
        "<b>Herd</b> gives you PHP, a web server and local domains without configuring each one.",
        "A <b>`.test` domain</b> is local only — it does not put your app on the internet.",
        "<b>`laravel new blog`</b> creates the whole application structure in one command.",
        "A <b>starter kit</b> is optional pre-built scaffolding — authentication, login, frontend setup.",
        "Choose <b>None</b> while learning — a kit hides the parts you are trying to understand.",
        "Build <b>both</b> today and compare `app/`, `resources/`, `routes/` and the two manifests.",
      ],
      commonMistakes: [
        "<b>Picking a starter kit on day 1 because it looks impressive</b> — the generated auth and frontend are exactly the parts this course teaches you to build.",
        "<b>Thinking a `.test` address is public</b> — it resolves only on your machine. Nobody else can reach it, and it is not a deployment.",
        "<b>Trying to learn every folder today</b> — `bootstrap/`, `storage/` and `vendor/` will make sense once you have a reason to open them.",
        "<b>Editing files inside `vendor/`</b> — it is generated by Composer and will be wiped by the next `composer install`.",
      ],
      quiz: [
        {
          question: "What does `laravel new blog` do?",
          options: [
            "Creates a new Laravel application",
            "Deletes a project",
            "Starts MySQL",
            "Creates a Git branch",
          ],
          correctIndex: 0,
          explanation: "It scaffolds the whole directory structure in one command.",
        },
        {
          question: "What is a starter kit?",
          options: [
            "Optional pre-built scaffolding such as authentication and frontend setup",
            "A required part of every Laravel app",
            "A database seeder",
          ],
          correctIndex: 0,
          explanation: "You can create a Laravel application without one, and while learning you should.",
        },
        {
          question: "What does a `.test` domain mean?",
          options: [
            "Your app is live on the internet",
            "A local address served by Herd on your own machine",
            "The app is in testing mode",
          ],
          correctIndex: 1,
          explanation: "Nobody outside your machine can reach it.",
        },
        {
          question: "Which starter kit should you choose while learning Laravel fundamentals?",
          options: [
            "React, so you get a frontend",
            "None, so nothing hides the parts you are learning",
            "Livewire, because it is the newest",
          ],
          correctIndex: 1,
          explanation: "The generated auth and frontend are exactly what the course teaches you to build.",
        },
        {
          question: "Why create both `laravel-basic` and `laravel-starter` today?",
          options: [
            "To test the database connection",
            "Because Laravel requires two projects",
            "To see exactly what a starter kit adds",
          ],
          correctIndex: 2,
          explanation: "Compare `app/`, `resources/`, `routes/`, `composer.json` and `package.json`.",
        },
      ],
    },
    {
      id: "artisan-and-env",
      title: "Artisan, .env and running the app",
      durationMinutes: 9,
      explanation: "You have a project. Now run it, and understand its configuration.\n\n---\n\n### 1. Basic — Artisan and `php artisan serve`\n\n<b>Artisan</b> (Laravel's command-line tool) performs common Laravel tasks from the terminal. The first one you need:\n\n```bash\nphp artisan serve\n```\n\n```text\nINFO  Server running on [http://127.0.0.1:8000].\n```\n\nOpen that address and you get the Laravel welcome page.\n\n```text\nBrowser\n   │\n   │ http://127.0.0.1:8000\n   ↓\nLaravel\n   │\n   ↓\nYour application\n```\n\nA <b>development server</b> (a server used while building and testing on your own machine) is not a production server:\n\n```text\nDevelopment                Production\n\nYour Mac/PC                Internet\n    ↓                          ↓\n Laravel                 Production server\n    ↓                          ↓\n Browser                    Laravel\n                               ↓\n                             Users\n```\n\nIf you use Herd, you now have two ways in — `php artisan serve` at `127.0.0.1:8000`, and Herd at `laravel-basic.test`. Both run the same application:\n\n```text\n                  Local Laravel App\n                         │\n              ┌──────────┴──────────┐\n              ↓                     ↓\n       artisan serve              Herd\n              │                     │\n              ↓                     ↓\n      localhost:8000          project.test\n```\n\n---\n\n### 2. Intermediate — `.env` and `.env.example`\n\n`.env` is the <b>environment file</b>. An <b>environment variable</b> (a value given to an application by its environment rather than hard-coded) holds configuration that changes between machines:\n\n```env\nAPP_NAME=Laravel\nAPP_ENV=local\nAPP_DEBUG=true\nAPP_URL=http://localhost\n\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_DATABASE=my_database\nDB_USERNAME=root\nDB_PASSWORD=\n```\n\nThe reason it exists: the same code runs in several places against different databases.\n\n```text\nApplication code\n       │\n       ↓\nEnvironment variables\n       │\n       ├── Development  → local database\n       ├── Staging      → staging database\n       └── Production   → production database\n```\n\nThe code never changes; only the values do.\n\nLaravel ships two files. `.env` holds your <b>real</b> local values. `.env.example` is a <b>template</b> listing the keys with the values blank:\n\n```text\n.env.example\n      │ template, committed to Git\n      ↓\n   Developer\n      │\n      ↓\n     .env\n      │ real values, never committed\n      ↓\nlocal configuration\n```\n\n`.env` stays out of version control because it holds database passwords, API keys and service credentials. Everyone clones the repository, copies `.env.example`, and fills in their own values.\n\n---\n\n### 3. Advanced — `APP_KEY` and writable directories\n\n`APP_KEY` is a secret Laravel generates for your application:\n\n```env\nAPP_KEY=base64:...\n```\n\nLaravel uses it for security work such as <b>encryption</b> (turning readable information into protected information that needs a key to read):\n\n```text\nSensitive data\n      │\n      ↓\n  Encryption\n      │\n      ↓\nProtected data\n```\n\nYou never invent this value:\n\n```bash\nphp artisan key:generate\n```\n\nDo not casually share a production `APP_KEY`.\n\nLaravel also needs to <b>write</b> to two directories:\n\n```text\nstorage/            logs, cache, compiled files\nbootstrap/cache/    cached configuration\n```\n\nWhen it cannot, you get failures that look unrelated:\n\n```text\nApplication error\n       ↓\n    Laravel\n       ↓\n storage/logs/\n       ↓\n Permission denied\n```\n\nA normal local setup usually gets this right. When you do hit a permissions error, resist the reflex:\n\n```bash\nchmod -R 777 .\n```\n\n`777` grants everyone full access to everything, which is almost never the actual fix. Find out which user the web server runs as first.\n\n---\n\n### Editor setup\n\nGive your editor PHP understanding. In VS Code, <b>Intelephense</b> (a PHP language server providing autocomplete, navigation and code analysis) is the common choice:\n\n```text\nYour PHP code\n      ↓\n Intelephense\n      ↓\nEditor understands your code\n      ↓\nAutocomplete + errors + navigation\n```\n\nWith it, typing `$user->` suggests the real properties on that model instead of nothing.",
      diagram: `Two doors into the same local application

                  Local Laravel App
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
       artisan serve              Herd
              │                     │
              ↓                     ↓
      localhost:8000          project.test


Development is not production

Development                Production

Your Mac/PC                Internet
    ↓                          ↓
 Laravel                 Production server
    ↓                          ↓
 Browser                    Laravel
                               ↓
                             Users


One codebase, three sets of values

Application code
       │
       ↓
Environment variables
       │
       ├── Development  → local database
       ├── Staging      → staging database
       └── Production   → production database


The two env files, and which one Git sees

.env.example  →  template, committed, values blank
     │
     ↓  copied by each developer
   .env       →  real values, never committed
                 database password, API keys, APP_KEY


Where Laravel must be able to write

storage/            logs, cache, compiled files
bootstrap/cache/    cached configuration

cannot write → "Permission denied" in places that look unrelated`,
      codeExample: {
        title: "Running it, configuring it, keeping it secret",
        code: `# ── Run the application ───────────────────────────────────────────
cd laravel-basic
php artisan serve
# INFO  Server running on [http://127.0.0.1:8000].

# With Herd you also get http://laravel-basic.test — same app, two doors.

# ── Generate the application key (once per project) ───────────────
php artisan key:generate
# writes APP_KEY=base64:... into .env

# ── .env holds what changes between machines ──────────────────────
# APP_NAME=Laravel
# APP_ENV=local
# APP_DEBUG=true
# APP_URL=http://localhost
#
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_DATABASE=my_database
# DB_USERNAME=root
# DB_PASSWORD=

# ── .env.example is the same keys with the values blank ───────────
# DB_DATABASE=
# DB_USERNAME=
# DB_PASSWORD=
#
# .env.example is committed.  .env is not: it holds passwords,
# API keys and APP_KEY. New developers copy the example and fill it in.

cp .env.example .env      # what you run after cloning someone's project
php artisan key:generate  # then give this copy its own key

# ── Laravel needs to write here ───────────────────────────────────
# storage/            logs, cache, compiled files
# bootstrap/cache/    cached configuration

# If you hit a permissions error, do NOT reach for this:
#   chmod -R 777 .
# 777 gives everyone full access to everything. Find out which user
# the web server runs as, and give that user access to those two paths.`,
      },
      keyTakeaways: [
        "<b>Artisan</b> is Laravel's command-line tool; `php artisan serve` starts a local development server.",
        "A <b>development server</b> runs on your machine and is not the same thing as a production server.",
        "<b>`.env`</b> holds configuration that changes between machines, so the code itself never has to.",
        "<b>`.env.example`</b> is the committed template; <b>`.env`</b> holds real secrets and is never committed.",
        "<b>`APP_KEY`</b> is a generated secret Laravel uses for encryption — run `php artisan key:generate`.",
        "Laravel must be able to write to <b>`storage/`</b> and <b>`bootstrap/cache/`</b>.",
        "<b>`chmod -R 777`</b> is not the fix for a permissions error — find out which user the server runs as.",
      ],
      commonMistakes: [
        "<b>Committing `.env`</b> — it carries database passwords, API keys and `APP_KEY`. Once pushed, those secrets are in the history even after you delete the file.",
        "<b>Forgetting `php artisan key:generate` after copying `.env.example`</b> — the app starts without an `APP_KEY` and fails on anything involving encryption.",
        "<b>Running `chmod -R 777 .` to clear a permissions error</b> — it makes every file writable by everyone and hides the real cause, which is usually which user the web server runs as.",
        "<b>Treating `php artisan serve` as a way to deploy</b> — it is a development server for your own machine, not something to put in front of users.",
      ],
      quiz: [
        {
          question: "What is Artisan?",
          options: [
            "Laravel's database",
            "Laravel's command-line tool",
            "Laravel's frontend framework",
            "A PHP editor",
          ],
          correctIndex: 1,
          explanation: "`php artisan serve` is the first of many Artisan commands you will use.",
        },
        {
          question: "What does `php artisan serve` do?",
          options: [
            "Creates a database",
            "Starts a local development server",
            "Installs Composer",
            "Creates a controller",
          ],
          correctIndex: 1,
          explanation: "It is for your own machine, not for putting an app in front of users.",
        },
        {
          question: "What is `.env`?",
          options: [
            "An environment configuration file",
            "A database",
            "A PHP class",
            "A Git branch",
          ],
          correctIndex: 0,
          explanation: "It holds the values that differ between your machine, staging and production.",
        },
        {
          question: "What is `.env.example` mainly for?",
          options: [
            "Storing production passwords",
            "Storing database rows",
            "Running Laravel",
            "Providing a committed template of the configuration a project expects",
          ],
          correctIndex: 3,
          explanation: "Each developer copies it to `.env` and fills in their own values.",
        },
        {
          question: "What is `APP_KEY` used for?",
          options: [
            "Laravel's security work such as encryption",
            "Naming your application",
            "Starting the server",
            "Creating database tables",
          ],
          correctIndex: 0,
          explanation: "Generate it with `php artisan key:generate`; never invent it yourself.",
        },
        {
          question: "Which directories must Laravel be able to write to?",
          options: [
            "`routes/` and `config/`",
            "`.env` and `artisan`",
            "`tests/` and `resources/`",
            "`storage/` and `bootstrap/cache/`",
          ],
          correctIndex: 3,
          explanation: "Logs, cache and compiled files are written there.",
        },
      ],
    },
    {
      id: "mvc-and-the-request",
      title: "MVC and how a request travels",
      durationMinutes: 9,
      explanation: "Your application runs. Now the mental model everything else hangs off.\n\nLaravel follows <b>MVC</b> (Model-View-Controller), a way of splitting application code by <b>responsibility</b> rather than by feature.\n\n```text\n             MVC\n              │\n      ┌───────┼───────┐\n      ↓       ↓       ↓\n    Model   View   Controller\n      │       │       │\n    Data      UI     Request\n```\n\n---\n\n### 1. Basic — the three parts\n\nA <b>Model</b> (a PHP class that represents and works with application data) usually talks to one database table:\n\n```text\nUser Model\n    │\n    ↓\nusers table\n```\n\nLaravel's <b>Eloquent ORM</b> (Laravel's system for working with database rows as PHP objects) means you write this:\n\n```php\n$user = User::find(10);\n```\n\ninstead of hand-writing SQL for every read.\n\nA <b>View</b> (the part responsible for showing information to the user) produces the interface. Laravel uses <b>Blade</b> (Laravel's template system for generating HTML), in files like `resources/views/home.blade.php`:\n\n```blade\n<h1>Hello, {{ $name }}</h1>\n```\n\nA <b>Controller</b> (a class that receives a request and coordinates what happens) sits between the two:\n\n```php\nclass UserController\n{\n    public function show(int $id)\n    {\n        $user = User::find($id);\n\n        return view('users.show', [\n            'user' => $user,\n        ]);\n    }\n}\n```\n\nRead what it actually does — it receives the request, asks the model for a user, hands that user to a view, and returns the result. It does not query the database itself, and it does not build HTML itself. That restraint is the whole point of the pattern.\n\n---\n\n### 2. Intermediate — MVC end to end\n\nSomeone visits `/users/10`:\n\n```text\nBrowser\n   │ GET /users/10\n   ↓\nRoute\n   ↓\nController\n   ↓\nModel\n   ↓\nDatabase\n   ↓\nModel\n   ↓\nController\n   ↓\nView\n   ↓\nHTML\n   ↓\nBrowser\n```\n\nNotice it goes <b>down</b> to the database and back <b>up</b> the same path. The controller is visited twice: once to ask for data, once to turn it into a response.\n\n---\n\n### 3. Advanced — the real request lifecycle\n\nMVC is the shape of your code. The <b>request lifecycle</b> is the route a request actually takes through the framework, and it has two stops MVC does not mention:\n\n```text\nBrowser\n   │ HTTP Request\n   ↓\npublic/index.php          the entry point\n   ↓\nLaravel Application\n   ↓\nMiddleware                checks before your code runs\n   ↓\nRouter\n   ↓\nController\n   ↓\nModel / Services\n   ↓\nDatabase\n   ↓\nController\n   ↓\nResponse\n   ↓\nMiddleware                and again on the way out\n   ↓\nBrowser\n```\n\n<b>`public/index.php`</b> is the entry point — the single file a web request actually reaches. Everything else in your project sits behind it, which is why the web server points at `public/` and not at the project root.\n\n<b>Middleware</b> (code that sits between a request and your application logic) gets first look at every request, and last look at every response. Authentication, permission checks and rate limits all live there. Think of airport security:\n\n```text\nPassenger\n   ↓\nSecurity check\n   ↓\nPassport check\n   ↓\nGate\n```\n\nEach layer can wave the request through or turn it back before it ever reaches the gate.\n\nYou are not building any of these boxes today. Days 3 to 7 build them one at a time — routes, then controllers, then middleware. Recognising the shape is what makes those days feel like filling in a diagram rather than learning disconnected tricks.",
      diagram: `MVC splits code by responsibility

             MVC
              │
      ┌───────┼───────┐
      ↓       ↓       ↓
    Model   View   Controller
      │       │       │
    Data      UI     Request

Model       talks to the database
View        produces what the user sees
Controller  receives the request, coordinates the other two


Down to the database and back up

Browser → Route → Controller → Model → Database
                                          │
Browser ← HTML ← View ← Controller ← Model ┘

the controller is visited twice: once to ask, once to answer


The real lifecycle adds two stops MVC does not mention

Browser
   ↓
public/index.php     the single file a request reaches
   ↓
Middleware           first look on the way in
   ↓
Router
   ↓
Controller
   ↓
Model / Services → Database
   ↓
Controller → Response
   ↓
Middleware           last look on the way out
   ↓
Browser


Middleware is airport security

Passenger → Security check → Passport check → Gate

each layer can wave it through, or turn it back`,
      codeExample: {
        title: "One request, through all three parts",
        code: `<?php

// ── The route: a URL matched to code ──────────────────────────────
// routes/web.php
Route::get('/users/{id}', [UserController::class, 'show']);

// ── The controller: coordinates, does not do the work itself ──────
// app/Http/Controllers/UserController.php
class UserController
{
    public function show(int $id)
    {
        $user = User::find($id);        // ask the model

        return view('users.show', [     // hand it to the view
            'user' => $user,
        ]);
    }
}
// Note what is NOT here: no SQL, no HTML. That restraint is the pattern.

// ── The model: represents one table ───────────────────────────────
// app/Models/User.php
class User extends Model
{
    // Eloquent gives you find(), where(), create() and the rest,
    // so you rarely write SQL by hand.
}

// ── The view: produces what the user sees ─────────────────────────
// resources/views/users/show.blade.php
//   <h1>Hello, {{ $user->name }}</h1>

// ── The journey, for GET /users/10 ────────────────────────────────
// public/index.php   the one file the web request reaches
//        ↓
// Middleware         authentication, permissions, rate limits
//        ↓
// Router             matches /users/{id}
//        ↓
// Controller         show(10)
//        ↓
// Model → Database   User::find(10)
//        ↓
// Controller → View → HTML
//        ↓
// Middleware         on the way back out
//        ↓
// Browser

// You build none of these today. Days 3 to 7 build them one at a time.`,
      },
      keyTakeaways: [
        "<b>MVC</b> splits code by responsibility: data, interface, and coordination.",
        "A <b>Model</b> represents application data and usually maps to one database table.",
        "A <b>View</b> produces what the user sees; Laravel uses <b>Blade</b> templates.",
        "A <b>Controller</b> coordinates — it neither queries the database nor builds HTML itself.",
        "<b>`public/index.php`</b> is the single entry point, which is why the web server points at `public/`.",
        "<b>Middleware</b> sees every request on the way in and every response on the way out.",
        "The lifecycle diagram is worth remembering — days 3 to 7 build one box at a time.",
      ],
      commonMistakes: [
        "<b>Querying the database inside a view</b> — a Blade template that calls `User::all()` puts data logic in the layer meant only to display it, and hides the query from anyone reading the controller.",
        "<b>Putting business logic in the controller</b> — a controller that also calculates prices and sends email is doing three jobs. It should coordinate, and hand the work to models and services.",
        "<b>Pointing the web server at the project root</b> — that exposes `.env`, `config/` and `database/` to the internet. It must point at `public/`.",
        "<b>Trying to memorise the lifecycle today</b> — you will build each box yourself over the next week. Recognising the shape is all that is needed now.",
      ],
      quiz: [
        {
          question: "What does MVC stand for?",
          options: [
            "Model View Controller",
            "Main View Code",
            "Model Variable Controller",
            "Middleware View Cache",
          ],
          correctIndex: 0,
          explanation: "It splits code by responsibility: data, interface, coordination.",
        },
        {
          question: "What does a Model usually represent?",
          options: [
            "A database-related entity",
            "A browser",
            "A route",
            "A Git branch",
          ],
          correctIndex: 0,
          explanation: "`User::find(10)` reads from the `users` table through Eloquent.",
        },
        {
          question: "What does a Controller do?",
          options: [
            "Stores database tables",
            "Receives a request and coordinates the work",
            "Installs PHP",
            "Stores environment variables",
          ],
          correctIndex: 1,
          explanation: "It should not query the database or build HTML itself.",
        },
        {
          question: "What is `public/index.php`?",
          options: [
            "A database model",
            "The entry point a web request actually reaches",
            "A configuration file",
            "A migration",
          ],
          correctIndex: 1,
          explanation: "That is why the web server points at `public/`, not the project root.",
        },
        {
          question: "Where does middleware sit in the lifecycle?",
          options: [
            "Only after the controller returns",
            "Before the router on the way in, and again on the way out",
            "Inside the database",
          ],
          correctIndex: 1,
          explanation: "Authentication, permissions and rate limits all live there.",
        },
        {
          question: "In the MVC flow, how many times is the controller involved?",
          options: [
            "Once, at the start",
            "Twice — once to ask for data, once to turn it into a response",
            "Never, the router calls the view directly",
          ],
          correctIndex: 1,
          explanation: "The request goes down to the database and back up the same path.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is Laravel?",
      options: [
        "A database",
        "A code editor",
        "A PHP framework",
        "A JavaScript package",
      ],
      correctIndex: 2,
      explanation: "It gives structure and tools for the parts every web application needs.",
    },
    {
      question: "What does Composer do?",
      options: [
        "Manages PHP dependencies",
        "Runs SQL queries",
        "Creates Git branches",
        "Runs the browser",
      ],
      correctIndex: 0,
      explanation: "It is to PHP what npm is to JavaScript.",
    },
    {
      question: "What does `laravel new blog` do?",
      options: [
        "Deletes a project",
        "Creates a Git branch",
        "Starts MySQL",
        "Creates a new Laravel application",
      ],
      correctIndex: 3,
      explanation: "One command scaffolds the whole directory structure.",
    },
    {
      question: "What is Artisan?",
      options: [
        "Laravel's database",
        "Laravel's command-line tool",
        "Laravel's frontend framework",
        "A PHP editor",
      ],
      correctIndex: 1,
      explanation: "`php artisan serve` and `php artisan key:generate` are both Artisan commands.",
    },
    {
      question: "What does `php artisan serve` do?",
      options: [
        "Creates a database",
        "Installs Composer",
        "Starts a local development server",
        "Creates a controller",
      ],
      correctIndex: 2,
      explanation: "It is a development server, not a way to deploy.",
    },
    {
      question: "What is `.env`?",
      options: [
        "An environment configuration file",
        "A database",
        "A PHP class",
        "A Git branch",
      ],
      correctIndex: 0,
      explanation: "It holds what changes between development, staging and production.",
    },
    {
      question: "What is `.env.example` mainly used for?",
      options: [
        "Storing production passwords",
        "Providing a committed template of the expected configuration",
        "Running Laravel",
        "Storing database rows",
      ],
      correctIndex: 1,
      explanation: "`.env` itself stays out of Git because it holds real secrets.",
    },
    {
      question: "What is `APP_KEY` used for?",
      options: [
        "Laravel's security work such as encryption",
        "Naming your application",
        "Starting the server",
        "Creating database tables",
      ],
      correctIndex: 0,
      explanation: "Generate it with `php artisan key:generate`.",
    },
    {
      question: "Which directories need to be writable by Laravel?",
      options: [
        "`routes/` and `config/`",
        "`.env` and `artisan`",
        "`tests/` and `resources/`",
        "`storage/` and `bootstrap/cache/`",
      ],
      correctIndex: 3,
      explanation: "Logs, cache and compiled files are written there.",
    },
    {
      question: "Which starter kit should you pick while learning Laravel fundamentals?",
      options: [
        "None, so nothing hides the parts you are learning",
        "Whichever looks most impressive",
        "Always React",
      ],
      correctIndex: 0,
      explanation: "The generated auth and frontend are what the course teaches you to build.",
    },
    {
      question: "What does MVC stand for?",
      options: [
        "Model View Controller",
        "Main View Code",
        "Model Variable Controller",
        "Middleware View Cache",
      ],
      correctIndex: 0,
      explanation: "It splits application code by responsibility.",
    },
    {
      question: "What is `public/index.php`?",
      options: [
        "A database model",
        "The entry point a web request actually reaches",
        "A configuration file",
      ],
      correctIndex: 1,
      explanation: "The web server points at `public/`, keeping `.env` and `config/` out of reach.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Get the app running and put a list of invoices on screen.",
    brief: "You are going to build one application across this whole track: <b>InvoiceHub</b>, a small invoicing tool. Clients, invoices, line items, payments. Every day from here adds another slice to the same codebase, so by Day 28 you are deploying something you actually built.\n\nToday it does not touch a database. There is no such thing yet. Today's job is narrower and more important: get the thing running, and prove a request can reach code you wrote and come back as a page. Hard-coded data is fine, and you will replace it on Day 13.",
    steps: [
      "Create the project with `composer create-project laravel/laravel invoicehub`, then `cd invoicehub` and start it with `php artisan serve`.",
      "Set `APP_NAME=\"InvoiceHub\"` in `.env`, then confirm it with `php artisan about`.",
      "Make a controller: `php artisan make:controller InvoiceController`.",
      "Give it an `index()` method returning a hard-coded array of three invoices. Each one needs a number, a client name, an amount and a status of `draft`, `sent` or `paid`.",
      "Register `Route::get('/invoices', [InvoiceController::class, 'index']);` in `routes/web.php`.",
      "Create `resources/views/invoices/index.blade.php` and render the invoices as a table. Pass the data in with `view('invoices.index', ['invoices' => $invoices])`.",
      "Add a `/invoices/{number}` route and a `show()` method that finds one invoice in the array and renders it on its own page.",
      "Link each row in the table through to its own page.",
    ],
    acceptance: [
      "`/invoices` lists three invoices in a table.",
      "`/invoices/INV-001` shows that one invoice on its own page.",
      "The controller holds the data and the view holds the markup. Neither does the other's job.",
      "No invoice data is written inside the Blade file.",
    ],
    stretch: [
      "Show a total of all invoice amounts under the table.",
      "Give overdue invoices a different colour, based on a status the controller sets rather than a rule the view invents.",
    ],
  },
};
