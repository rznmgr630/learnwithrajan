import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_4_LESSONS: LessonDay = {
  day: 4,
  title: "Service Providers & Facades",
  totalMinutes: 66,
  difficulty: "Beginner",
  lessons: [
    {
      id: "providers-in-the-lifecycle",
      title: "Providers in the startup sequence",
      durationMinutes: 9,
      explanation: "A <b>service provider</b> (a class that registers and prepares services when Laravel starts) is a term you already have. Day 2 pointed at the list that loads them, and on Day 3 you wrote bindings inside one. What neither day showed is how a provider actually runs.\n\nToday's three words:\n\n```text\nService Provider  → \"here is what exists, and how to prepare it\"\nService Container → \"I store it, and I hand it out\"            ← Day 3\nFacade            → \"here is a short way to reach it\"          ← new today\n```\n\nThe recap, in four lines:\n\n```text\nDay 2   bootstrap/providers.php lists your application's providers\nDay 3   the container resolves whatever those providers bind\nDay 3   bindings belong in a provider's register() method\nDay 3   the PaymentGateway binding is why a provider was worth having\n```\n\nIf any of those feels fuzzy, go back rather than forward. Everything below assumes them.\n\n---\n\n### 1. Basic — a provider is more than a place for bindings\n\nBindings are the part you have seen, and they are not the only thing a provider does. A provider is your application's <b>startup configuration</b> (setup that has to happen once, before any request is handled):\n\n• container bindings, the Day 3 material\n• event listeners, wired up once at boot\n• view composers, data shared into a view every time it renders\n• Blade directives and macros, extending things the framework already owns\n• authorization gates and policies\n\nOne way to hold it: a provider is a setup class, not a working class. It arranges. The services it registers do the work.\n\n```text\nProvider          \"here is InvoiceTotals, and here is how to build it\"\nInvoiceTotals     actually adds up an invoice\n```\n\nIf you find yourself generating a report or sending mail inside a provider, the code is in the wrong file.\n\n---\n\n### 2. Intermediate — your providers, and the framework's\n\nThere are two populations of providers, and you only manage one.\n\n```text\nAPPLICATION PROVIDERS           FRAMEWORK PROVIDERS\nyours                           Laravel's own\n\nlisted by you in                loaded by the framework\nbootstrap/providers.php         itself\n\nAppServiceProvider              database, cache, queue,\nInvoiceServiceProvider          filesystem, routing, events,\nPaymentServiceProvider          mail, sessions, validation\n```\n\nEverything you take for granted is a framework provider doing its job. `DB` works because a provider registered the database manager. Routing works because a provider registered the router. You do not list those and you do not maintain them.\n\nPackages behave the same way. A modern package declares its own provider through Composer, so installing it is usually enough, which is why `bootstrap/providers.php` stays short. It holds your application's providers only.\n\n---\n\n### 3. Advanced — creating one, and the two phases\n\nArtisan writes the file:\n\n```bash\nphp artisan make:provider InvoiceServiceProvider\n```\n\n```text\napp/Providers/InvoiceServiceProvider.php\n```\n\nWhat comes back is almost empty:\n\n```php\nclass InvoiceServiceProvider extends ServiceProvider\n{\n    public function register(): void {}\n\n    public function boot(): void {}\n}\n```\n\nTwo methods, and that is the entire surface of a provider. Which matters more than it looks, because those two methods are not called one after the other for your provider. They are two separate passes over every provider in the application:\n\n```text\nLaravel starts\n      ↓\nbootstrap/providers.php  +  framework providers\n      ↓\nPASS 1   register() on every provider\n      ↓\nPASS 2   boot() on every provider\n      ↓\napplication ready\n```\n\nDay 2 gave you the one-line rule: `register()` declares what exists, `boot()` is for everything else. That rule is easy to repeat and easy to break, because breaking it often appears to work. The next lesson is why.",
      diagram: `Where providers sit, and the two passes

              Laravel starts
                     │
                     ↓
        ┌────────────────────────────┐
        │  bootstrap/providers.php   │   yours
        │  + framework providers     │   Laravel's, loaded for you
        └─────────────┬──────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  PASS 1   register() on EVERY provider      │
│           declarations only                 │
└─────────────────────┬───────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  PASS 2   boot() on EVERY provider          │
│           everything now exists             │
└─────────────────────┬───────────────────────┘
                      ↓
              application ready


A PROVIDER IS A SETUP CLASS, NOT A WORKING CLASS

  InvoiceServiceProvider
        │ registers
        ↓
  InvoiceTotals            ← the work happens here
        │
   ┌────┴────┐
   ↓         ↓
Controller  Facade


WHAT A PROVIDER SETS UP

  container bindings            ← Day 3
  event listeners
  view composers
  Blade directives and macros
  authorization gates`,
      codeExample: {
        title: "A generated provider, and the list that loads it",
        code: `<?php

// php artisan make:provider InvoiceServiceProvider
// → app/Providers/InvoiceServiceProvider.php

namespace App\\Providers;

use App\\Services\\Invoicing\\InvoiceTotals;
use Illuminate\\Support\\ServiceProvider;

class InvoiceServiceProvider extends ServiceProvider
{
    /**
     * PASS 1. Declarations only.
     * Runs before some other providers have registered anything.
     */
    public function register(): void
    {
        $this->app->singleton(InvoiceTotals::class);
    }

    /**
     * PASS 2. Runs after every provider has registered.
     * Safe to reach for other services here.
     */
    public function boot(): void
    {
        //
    }
}


// ---------- bootstrap/providers.php ----------
// Your providers only. The framework's own are loaded for you.

return [
    App\\Providers\\AppServiceProvider::class,
    App\\Providers\\InvoiceServiceProvider::class,
];


// ---------- The work does NOT live in the provider ----------
namespace App\\Services\\Invoicing;

class InvoiceTotals
{
    public function for(string $number): array
    {
        // Adding up an invoice is this class's job.
        // The provider only said that this class exists.
        return ['subtotal' => 4000.00, 'tax' => 200.00, 'total' => 4200.00];
    }
}`,
      },
      keyTakeaways: [
        "A provider is your application's <b>startup configuration</b>: bindings, listeners, view composers, directives, macros, gates.",
        "A provider is a setup class, not a working class. It arranges services, it does not do their work.",
        "You manage only your own providers, in `bootstrap/providers.php`. Framework and package providers load themselves.",
        "`php artisan make:provider NameServiceProvider` writes the file with both methods stubbed out.",
        "A provider has exactly two methods, and Laravel calls them in two separate passes over all providers.",
        "Pass one is every `register()`. Pass two is every `boot()`. Never one provider start to finish.",
        "Almost every provider bug is something sitting in the wrong pass.",
      ],
      commonMistakes: [
        "<b>Making a provider for every class you write.</b> A plain concrete class needs no provider, because the container can already build it. Reach for one when there is a decision or some setup to record.",
        "<b>Doing the actual work inside a provider.</b> Generating a report, sending mail or calling an API belongs in the service the provider registers.",
        "<b>Trying to manage Laravel's own providers.</b> The database, cache and routing providers are the framework's business.",
        "<b>Expecting `register()` and `boot()` to run back to back for your provider.</b> Every provider registers before any provider boots, which is the source of most surprises.",
      ],
      quiz: [
        {
          question: "Besides container bindings, what else does a provider set up?",
          options: [
            "Database tables and seeders",
            "Event listeners, view composers, Blade directives and gates",
            "Route parameters",
            "Composer dependencies",
          ],
          correctIndex: 1,
          explanation: "A provider holds startup configuration, not just bindings.",
        },
        {
          question: "Which providers do you list yourself?",
          options: [
            "Every provider, including Laravel's",
            "Only your application's providers",
            "Only package providers",
            "None, Laravel scans `app/Providers`",
          ],
          correctIndex: 1,
          explanation: "Framework and modern package providers load themselves.",
        },
        {
          question: "How does Laravel call the two provider methods?",
          options: [
            "One provider at a time, `register()` then `boot()`",
            "`boot()` on all providers, then `register()` on all providers",
            "Two passes: every `register()` first, then every `boot()`",
            "Only `register()`, unless you enable booting",
          ],
          correctIndex: 2,
          explanation: "That two-pass order is what makes `boot()` safe and `register()` restricted.",
        },
        {
          question: "Which of these does NOT belong in a service provider?",
          options: [
            "Binding an interface to an implementation",
            "Registering a Blade directive",
            "Generating a customer's monthly report",
            "Registering an event listener",
          ],
          correctIndex: 2,
          explanation: "That is work. It belongs in a service the provider registers.",
        },
      ],
    },
    {
      id: "register-and-boot",
      title: "register() and boot() in depth",
      durationMinutes: 13,
      explanation: "This is the lesson that pays for the day.\n\n<b>`register()`</b> (the provider method where you only declare services with the container) and <b>`boot()`</b> (the provider method that runs after every provider has been registered) look interchangeable. They are not, and putting something in the wrong one produces a bug that comes and goes with no obvious cause.\n\nOne line to keep:\n\n```text\nregister()  →  REGISTER\nboot()      →  USE / CONFIGURE\n```\n\n---\n\n### 1. Basic — register() only declares\n\n`register()` exists for one purpose: putting things into the container.\n\n```php\npublic function register(): void\n{\n    $this->app->singleton(InvoiceTotals::class);\n\n    $this->app->bind(ExchangeRates::class, FixerExchangeRates::class);\n}\n```\n\nNotice what those two lines do not do. Nothing is called. Nothing is read. No other service is touched. You are writing rules the container will follow later, when somebody actually resolves something.\n\n```text\nregister()  →  writes the rule\nlater       →  someone resolves, and the rule is used\n```\n\nWhat `bind()`, `singleton()` and `scoped()` mean is Day 3's material, and the `PaymentGateway` binding you wrote there has exactly this shape. The only new fact is how strict the rule is about what else may appear beside them.\n\n---\n\n### 2. Intermediate — what must never go in register(), and why\n\n`register()` must not perform any action that depends on another service already being ready. So none of this:\n\n```php\npublic function register(): void\n{\n    $rate = DB::table('settings')->value('tax_rate');  // no\n    Mail::to($admin)->send(new Booted());              // no\n    Route::get('/health', fn () => 'ok');              // no\n    Event::listen(InvoicePaid::class, SendReceipt::class);  // no\n    config(['invoicing.gateway' => 'stripe']);         // no\n}\n```\n\nThe reason is timing, and it is worth being precise about it. While your `register()` runs, Laravel is part way down the provider list. Some providers have registered. Some have not. The database manager, the mailer, the router and the event dispatcher each arrive with their own provider, and you have no idea whether yours runs before or after them.\n\nSo the outcome depends on the order of a list you did not write:\n\n```text\nyour provider runs BEFORE the mail provider   →  it breaks\nyour provider runs AFTER  the mail provider   →  it works\n```\n\nThat is the worst kind of bug, because \"it works on my machine\" is technically true. Install a package, reorder the list, upgrade the framework, and the same code fails with an error that points at Laravel's internals rather than at your provider.\n\nThink of building a house:\n\n```text\nregister()  →  run the cable through the walls\n                 the power is not on yet.\n                 do not plug the kettle in to test it.\n\n     ↓  every provider finishes its wiring\n\nboot()      →  the power is on\n                 now switch things on and check them\n```\n\nYou would not plug an appliance into a socket while the electrician is still pulling cable through the wall. `register()` is the cable stage. So: <b>register services, do not use them.</b>\n\n---\n\n### 3. Advanced — why boot() has to exist\n\nNow the other side. `boot()` runs only after every provider in the application has been registered, so by then the container knows about everything.\n\n```text\nLaravel starts\n     ↓\nProvider A register()  →  Provider B register()  →  Provider C register()\n     ↓\nall services registered\n     ↓\nProvider A boot()      →  Provider B boot()      →  Provider C boot()\n     ↓\napplication ready\n```\n\nRead that diagram with a question in mind: suppose Provider B needs something Provider A registers.\n\n```text\nduring register()\n  B runs after  A  →  it exists      ✓\n  B runs before A  →  it does not    ✗\n  and you do not control which\n\nduring boot()\n  pass 1 finished for everybody\n  before pass 2 started for anybody   ✓ always\n```\n\nThat is the entire reason `boot()` exists. It is not a second place to write bindings, and it is not a constructor. It is the phase where you are finally allowed to assume the rest of the application is there.\n\nWhich also explains the mirror-image mistake. Bindings in `boot()` usually seem fine, because most resolution happens later, during a request. But anything resolved during another provider's `register()` or early `boot()` will not see your binding, and you get the same intermittent failure from the opposite direction.\n\n```text\nbindings in boot()      →  works until something resolves early\nusing services in       →  works until the order changes\n  register()\n```\n\nBoth failures are the same mistake: assuming an order that is not guaranteed. Put declarations in `register()`, put everything else in `boot()`, and the order stops mattering.",
      diagram: `Two passes, and why the order is the whole point

Laravel starts
      │
      ↓
┌──────────────────────────────────────────────┐
│ PASS 1   every provider's register()         │
│                                              │
│   Provider A register()                      │
│   Provider B register()                      │
│   Provider C register()                      │
│                                              │
│   declarations only.                         │
│   nothing may be USED here, because the      │
│   provider you need may not have run yet.    │
└───────────────────────┬──────────────────────┘
                        ↓
          all services now registered
                        ↓
┌──────────────────────────────────────────────┐
│ PASS 2   every provider's boot()             │
│                                              │
│   Provider A boot()                          │
│   Provider B boot()                          │
│   Provider C boot()                          │
│                                              │
│   safe to use anything at all.               │
└───────────────────────┬──────────────────────┘
                        ↓
                application ready


THE BUG THIS PREVENTS

  DB::table('settings') inside register()
            │
            ├── database provider already ran   →  works
            └── database provider has not run   →  breaks
                        ↑
        decided by a list you did not write.
        install a package and the answer changes.


BUILDING A HOUSE

  register()   run the cable through the walls
               power is off. plug nothing in.

  boot()       power is on
               switch things on and check them`,
      codeExample: {
        title: "The same provider, wrong then right",
        code: `<?php

namespace App\\Providers;

use App\\Events\\InvoicePaid;
use App\\Listeners\\SendReceipt;
use App\\Services\\Invoicing\\ExchangeRates;
use App\\Services\\Invoicing\\FixerExchangeRates;
use App\\Services\\Invoicing\\InvoiceTotals;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Facades\\Event;
use Illuminate\\Support\\Facades\\View;
use Illuminate\\Support\\ServiceProvider;

class InvoiceServiceProvider extends ServiceProvider
{
    // ─────────── WRONG ───────────
    public function register(): void
    {
        // The database provider may not have run yet. This works or
        // explodes depending on the order of the provider list.
        $rate = DB::table('settings')->value('tax_rate');

        // Same problem: the event dispatcher might not be there yet.
        Event::listen(InvoicePaid::class, SendReceipt::class);

        $this->app->singleton(InvoiceTotals::class);
    }


    // ─────────── RIGHT ───────────
    public function register(): void
    {
        // Declarations only. Nothing called, nothing read.
        $this->app->singleton(InvoiceTotals::class);

        $this->app->bind(ExchangeRates::class, FixerExchangeRates::class);
    }

    public function boot(): void
    {
        // Every provider has registered, so the database, the event
        // dispatcher and the view layer all exist now.
        $rate = DB::table('settings')->value('tax_rate');

        Event::listen(InvoicePaid::class, SendReceipt::class);

        View::composer('invoices.show', function ($view) {
            $view->with('taxRate', config('invoicing.tax_rate'));
        });
    }
}

// And the mirror-image mistake, worth seeing once:
//
//   public function boot(): void
//   {
//       $this->app->bind(ExchangeRates::class, FixerExchangeRates::class);
//   }
//
// Usually fine, because most resolving happens during a request. But
// anything resolved earlier misses the binding entirely, and you get the
// same intermittent failure from the other direction.`,
      },
      keyTakeaways: [
        "`register()` is only for putting things into the container. Declarations, and nothing beside them.",
        "Never call `DB`, `Mail`, `Route`, `Event` or `config([...])` from `register()`. The provider behind them may not have run yet.",
        "Whether such a call works is decided by the order of the provider list, which is why the bug is intermittent.",
        "`boot()` runs only after every provider has registered, so using other services there cannot fail on ordering.",
        "House wiring: `register()` pulls the cable, `boot()` is when the power is on.",
        "Writing bindings in `boot()` is the mirror mistake. Anything resolved early will not see them.",
        "Both failures are the same error: assuming a provider order that Laravel never promised.",
      ],
      commonMistakes: [
        "<b>Doing application work in `register()`</b>, for example `DB::table('users')->get()`. It may pass today and fail after an unrelated package changes the order.",
        "<b>Registering event listeners or view composers in `register()`.</b> Both reach into other services, so both belong in `boot()`.",
        "<b>Writing bindings in `boot()`.</b> It often appears to work, right up to the first thing that resolves during startup.",
        "<b>Assuming your provider runs before somebody else's.</b> If order matters to you, what you wanted was `boot()`.",
        "<b>Treating `boot()` as a constructor.</b> It runs once while the application starts, not once per object and not per request handler.",
      ],
      quiz: [
        {
          question: "What belongs in `register()`?",
          options: [
            "Event listeners",
            "Container bindings, and nothing beside them",
            "Database queries",
            "Route definitions",
          ],
          correctIndex: 1,
          explanation: "It writes rules the container follows later. It never uses another service.",
        },
        {
          question: "Why is `DB::table(...)` inside `register()` dangerous rather than simply wrong?",
          options: [
            "Queries are always slow at startup",
            "It works or fails depending on the provider order, so the bug is intermittent",
            "`register()` cannot return values",
            "Laravel blocks all facades in providers",
          ],
          correctIndex: 1,
          explanation: "\"It works on my machine\" can be true, until a package reorders the list.",
        },
        {
          question: "Provider B needs something Provider A registers. Where is that guaranteed to work?",
          options: [
            "In B's `register()`",
            "In A's `register()`",
            "In B's `boot()`",
            "Anywhere, Laravel sorts providers by dependency",
          ],
          correctIndex: 2,
          explanation: "Pass one finished for every provider before pass two started for any of them.",
        },
        {
          question: "What is the mirror-image mistake to using services in `register()`?",
          options: [
            "Putting bindings in `boot()`",
            "Having an empty `boot()`",
            "Listing a provider twice",
            "Using a facade in a controller",
          ],
          correctIndex: 0,
          explanation: "Anything resolved during startup will not see a binding written in `boot()`.",
        },
      ],
    },
    {
      id: "inside-boot-and-deferred-providers",
      title: "Inside boot(), and providers that wait",
      durationMinutes: 10,
      explanation: "Lesson 2 gave you the rule. This lesson is the list.\n\n<b>`boot()`</b> (the provider phase that runs once every provider has been registered) has a small set of real jobs, and knowing them tells you when you need a provider at all.\n\n---\n\n### 1. Basic — the five things boot() is really for\n\n<b>Event listeners.</b> Connecting something that happens to something that should follow:\n\n```php\nEvent::listen(InvoicePaid::class, SendReceipt::class);\n```\n\n<b>View composers.</b> A <b>view composer</b> (a callback that adds data to a view every time it renders) saves you passing the same variable from twenty places:\n\n```php\nView::composer('invoices.*', function ($view) {\n    $view->with('company', config('invoicing.company'));\n});\n```\n\n<b>Blade directives.</b> A <b>Blade directive</b> (a custom `@something` you can use in templates) is registered once here:\n\n```php\nBlade::directive('money', function ($amount) {\n    return \"<?php echo number_format({$amount}, 2); ?>\";\n});\n```\n\n<b>Macros.</b> A <b>macro</b> (a method added to an existing framework class from outside it) lets you extend classes you do not own:\n\n```php\nStr::macro('invoiceNumber', fn (int $id) => 'INV-' . str_pad($id, 4, '0', STR_PAD_LEFT));\n```\n\n<b>Authorization setup.</b> Gates and policies are declared here too:\n\n```php\nGate::define('view-invoice', fn ($user, $invoice) => $user->id === $invoice->owner_id);\n```\n\nOne thing every item on that list has in common: each reaches into a service somebody else registered. That is exactly why they cannot be done in pass one.\n\n```text\nregister()   put things in the container\nboot()       reach into what everyone put there\n```\n\n---\n\n### 2. Intermediate — the cost of always being loaded\n\nHere is the price of this arrangement. Every listed provider runs both passes on every single request, whether or not anything needs it.\n\nPicture an application with payments, PDF generation, analytics and image processing:\n\n```text\nrequest for the invoice list\n     ↓\npayments provider     loads   (not needed)\nPDF provider          loads   (not needed)\nanalytics provider    loads   (not needed)\nimage provider        loads   (not needed)\n     ↓\nrender a list of invoices\n```\n\nFor a binding, that is nothing worth worrying about. For a provider that reads a config file, builds a client or opens a connection, it is work nobody asked for, repeated on every request.\n\n---\n\n### 3. Advanced — deferred providers\n\nA <b>deferred provider</b> (a provider loaded only when one of its services is actually resolved) fixes that.\n\n```text\nNORMAL\napplication starts  →  provider loads  →  service registered\n                       every request, whether used or not\n\nDEFERRED\napplication starts  →  provider does NOT load\n                            ↓\n            something resolves PdfRenderer\n                            ↓\n            provider loads now, registers, done\n```\n\nTwo pieces make it work: implement `DeferrableProvider`, and declare what the provider provides so Laravel knows which resolution should wake it.\n\n```php\nclass PdfServiceProvider extends ServiceProvider implements DeferrableProvider\n{\n    public function register(): void\n    {\n        $this->app->singleton(PdfRenderer::class);\n    }\n\n    public function provides(): array\n    {\n        return [PdfRenderer::class];\n    }\n}\n```\n\nTwo conditions come with it. A deferred provider is for bindings only, because there is no meaningful boot phase for a provider that has not been loaded. And `provides()` must be complete: a service you forget to list will never resolve, since nothing tells Laravel to load the provider that binds it.\n\nLaravel leans on deferred providers heavily inside the framework, which is part of why a large framework starts as quickly as it does. In your own application you usually do not need them. Reach for one when a provider is genuinely expensive to set up and most requests never touch it. Correct first, deferred later.",
      diagram: `What boot() is actually for

  boot()
    │
    ├── Event::listen(...)        something happens → something follows
    ├── View::composer(...)       data added to a view on every render
    ├── Blade::directive(...)     your own @money in templates
    ├── Str::macro(...)           a method bolted onto a framework class
    └── Gate::define(...)         who is allowed to do what

  every one of those reaches into a service
  somebody ELSE registered.
  that is why none of them can happen in pass one.


NORMAL vs DEFERRED

  request 1 ──→ provider loads ──→ PdfRenderer ready   (unused)
  request 2 ──→ provider loads ──→ PdfRenderer ready   (unused)
  request 3 ──→ provider loads ──→ PdfRenderer ready   (used)
                    two loads wasted


  request 1 ──→ nothing happens
  request 2 ──→ nothing happens
  request 3 ──→ resolves PdfRenderer
                        │
                        ↓
                  provider loads now
                        ↓
                  binding registered


  implements DeferrableProvider
  provides()  →  [PdfRenderer::class]
                     ↑
        forget an entry here and that service
        can never be resolved at all`,
      codeExample: {
        title: "A provider that boots properly, and one that waits",
        code: `<?php

namespace App\\Providers;

use App\\Events\\InvoicePaid;
use App\\Listeners\\SendReceipt;
use Illuminate\\Support\\Facades\\Blade;
use Illuminate\\Support\\Facades\\Event;
use Illuminate\\Support\\Facades\\Gate;
use Illuminate\\Support\\Facades\\View;
use Illuminate\\Support\\Str;
use Illuminate\\Support\\ServiceProvider;

class InvoiceServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // 1. React to something happening.
        Event::listen(InvoicePaid::class, SendReceipt::class);

        // 2. Share data with every invoice view, without passing it
        //    from every controller method.
        View::composer('invoices.*', function ($view) {
            $view->with('company', config('invoicing.company'));
        });

        // 3. @money(4200) in any Blade template.
        Blade::directive('money', function ($amount) {
            return "<?php echo number_format({$amount}, 2); ?>";
        });

        // 4. Add a method to a framework class you do not own.
        Str::macro('invoiceNumber', function (int $id) {
            return 'INV-' . str_pad((string) $id, 4, '0', STR_PAD_LEFT);
        });

        // 5. Who may see an invoice.
        Gate::define('view-invoice', function ($user, $invoice) {
            return $user->id === $invoice->owner_id;
        });
    }
}


// ---------- A deferred provider ----------
namespace App\\Providers;

use App\\Services\\Pdf\\PdfRenderer;
use Illuminate\\Contracts\\Support\\DeferrableProvider;
use Illuminate\\Support\\ServiceProvider;

class PdfServiceProvider extends ServiceProvider implements DeferrableProvider
{
    public function register(): void
    {
        $this->app->singleton(PdfRenderer::class, function ($app) {
            // Expensive setup that most requests never need.
            return new PdfRenderer(config('pdf.binary_path'));
        });
    }

    /**
     * Laravel loads this provider only when one of these is resolved.
     * Anything missing from this list can never be resolved at all.
     */
    public function provides(): array
    {
        return [PdfRenderer::class];
    }
}`,
      },
      keyTakeaways: [
        "`boot()` has a short list of real jobs: event listeners, view composers, Blade directives, macros, authorization gates.",
        "A <b>view composer</b> adds data to a view every time it renders, instead of passing it from every controller.",
        "A <b>macro</b> adds a method to a framework class you do not own. A <b>Blade directive</b> adds your own `@something` to templates.",
        "Everything on that list reaches into a service someone else registered, which is why none of it fits in `register()`.",
        "Every listed provider runs on every request, needed or not.",
        "A <b>deferred provider</b> loads only when one of its services is resolved, using `DeferrableProvider` plus `provides()`.",
        "Deferred providers hold bindings only, and `provides()` must list every one of them.",
      ],
      commonMistakes: [
        "<b>Registering the same event listener in two providers.</b> `boot()` runs once per application start, so the listener fires twice per event.",
        "<b>Defining a Blade directive or macro on every request instead of in `boot()`.</b> Startup configuration belongs at startup, declared once.",
        "<b>Deferring a provider but forgetting an entry in `provides()`.</b> That service will never resolve, because nothing tells Laravel to load the provider.",
        "<b>Putting `boot()` work in a deferred provider.</b> There is no reliable boot phase for a provider that has not been loaded. Deferred means bindings only.",
        "<b>Deferring everything for speed.</b> A binding that costs nothing to declare gains nothing from waiting, and you have made startup harder to follow.",
      ],
      quiz: [
        {
          question: "What is a view composer?",
          options: [
            "A Blade template that renders other templates",
            "A callback that adds data to a view every time it renders",
            "A controller that returns views",
            "A macro on the View class",
          ],
          correctIndex: 1,
          explanation: "Registered in `boot()`, so you stop passing the same variable from everywhere.",
        },
        {
          question: "Why do listeners, composers, directives and gates all belong in `boot()`?",
          options: [
            "They are slower than bindings",
            "Each one reaches into a service another provider registered",
            "`register()` cannot contain closures",
            "They only apply to web requests",
          ],
          correctIndex: 1,
          explanation: "In pass one that service might not exist yet.",
        },
        {
          question: "What is a deferred provider?",
          options: [
            "A provider that runs last in the list",
            "A provider loaded only when one of its services is resolved",
            "A provider with no `register()` method",
            "A provider that runs after the response is sent",
          ],
          correctIndex: 1,
          explanation: "It keeps expensive setup off requests that never touch the service.",
        },
        {
          question: "You defer a provider and leave one binding out of `provides()`. What happens?",
          options: [
            "Laravel loads the provider anyway",
            "That binding is registered twice",
            "That service can never be resolved, because the provider is never loaded",
            "The provider stops being deferred",
          ],
          correctIndex: 2,
          explanation: "`provides()` is the only hint Laravel has about when to wake it.",
        },
      ],
    },
    {
      id: "what-a-facade-is",
      title: "What a facade is",
      durationMinutes: 13,
      explanation: "A <b>facade</b> (a static-looking interface that gives you access to an object managed by the service container) is why so much Laravel code reads as short as it does.\n\nYou write this:\n\n```php\nCache::get('user');\n```\n\ninstead of this:\n\n```php\n$cache = app(CacheManager::class);\n\n$cache->get('user');\n```\n\nSame work, one line.\n\n---\n\n### 1. Basic — the shortcut\n\nFacades are names you have already been typing:\n\n```php\nCache::get('user');\nLog::info('Invoice paid');\nDB::table('invoices')->get();\nStorage::put('invoice.pdf', $bytes);\n```\n\nEach one is a small class in `Illuminate\\Support\\Facades`, standing in front of a real service the container manages. The pattern never changes:\n\n```text\nFacade  →  Laravel service  →  the actual work\n```\n\nThe ones you will meet most:\n\n• `Cache::get()` and `Cache::put()`\n• `Log::info()`\n• `DB::table()`\n• `Mail::to()`\n• `Storage::put()`\n• `Http::get()`\n• `Queue::push()`\n• `Event::dispatch()`\n\n---\n\n### 2. Intermediate — how a static-looking call reaches an object\n\nHere is the part worth understanding, because it explains almost everything else about facades.\n\n<b>Facades are not static classes.</b> The `Cache` facade has no `get()` method at all. Look inside and you find one small method:\n\n```php\nclass Cache extends Facade\n{\n    protected static function getFacadeAccessor(): string\n    {\n        return 'cache';\n    }\n}\n```\n\nThat string is a container key. When you call `Cache::get('user')`, PHP finds no `get()` method, so it falls back to `__callStatic()` on the parent `Facade` class, which does three things: read the accessor, resolve that key from the container, then forward your call to the object it gets back.\n\n```text\nCache::get('user')\n      ↓\nno get() method here\n      ↓\n__callStatic() catches the call\n      ↓\ngetFacadeAccessor() says 'cache'\n      ↓\nthe container resolves 'cache'\n      ↓\nCacheManager instance  →  ->get('user')\n```\n\nSo the call looks static and is not. You are talking to an ordinary object, resolved from the container, through a very short piece of syntax. `Log::info('Invoice paid')` takes the same journey to the logger service.\n\nThis is why \"facades are just static helpers\" causes trouble as a mental model. Everything a facade touches is container-managed, which is exactly what makes the next two lessons possible: you can change what sits behind a facade, and you can replace it in a test.\n\n---\n\n### 3. Advanced — a facade for your own service\n\nNone of this is reserved for the framework. Take a service of your own:\n\n```php\nnamespace App\\Services;\n\nclass NotificationService\n{\n    public function send(string $message): void\n    {\n        // ...\n    }\n}\n```\n\nRegister it in a provider, the way you did in lesson 2:\n\n```php\npublic function register(): void\n{\n    $this->app->singleton(NotificationService::class);\n}\n```\n\nThen write a facade whose accessor is that container key:\n\n```php\nnamespace App\\Facades;\n\nuse Illuminate\\Support\\Facades\\Facade;\n\nclass Notification extends Facade\n{\n    protected static function getFacadeAccessor(): string\n    {\n        return \\App\\Services\\NotificationService::class;\n    }\n}\n```\n\nAnd now:\n\n```php\nNotification::send('Invoice INV-0001 is paid');\n```\n\nThe pieces line up like this:\n\n```text\nProvider  register()  →  Container  →  NotificationService\n                                            ↑        ↑\n                                     injection    facade\n```\n\nTwo doors into the same object. Choosing between them is the next lesson.",
      diagram: `Cache::get('user') step by step

  Your code
      │  Cache::get('user')             looks like a static call
      ↓
  ┌────────────────────────────────────┐
  │  Cache facade                      │
  │                                    │
  │  has no get() method of its own    │
  │  __callStatic() catches the call   │
  │  getFacadeAccessor() returns the   │
  │  container key: 'cache'            │
  └─────────────────┬──────────────────┘
                    │  resolve 'cache'
                    ↓
  ┌────────────────────────────────────┐
  │  Service Container                 │
  └─────────────────┬──────────────────┘
                    │  hands back a real object
                    ↓
  ┌────────────────────────────────────┐
  │  CacheManager instance             │
  │  ->get('user')                     │
  └─────────────────┬──────────────────┘
                    ↓
                the value


The pattern never changes

  Log::info()      →  logger service      →  writes a line
  DB::table()      →  database manager    →  runs a query
  Storage::put()   →  filesystem          →  saves a file
  Http::get()      →  HTTP client         →  calls an API
  Queue::push()    →  queue manager       →  queues a job


Your own service, two doors in

  Provider register()
          ↓
     Container
          ↓
  NotificationService
       ↑       ↑
  injection  facade`,
      codeExample: {
        title: "A facade for your own service",
        code: `<?php

// ---------- 1. The service ----------
namespace App\\Services;

class NotificationService
{
    public function send(string $message): void
    {
        // Real work lives here, not in the facade.
    }
}


// ---------- 2. Register it in a provider ----------
namespace App\\Providers;

use App\\Services\\NotificationService;
use Illuminate\\Support\\ServiceProvider;

class NotificationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(NotificationService::class);
    }
}

// ...then add it to bootstrap/providers.php:
//   App\\Providers\\NotificationServiceProvider::class,


// ---------- 3. The facade ----------
namespace App\\Facades;

use Illuminate\\Support\\Facades\\Facade;

class Notification extends Facade
{
    /** The container key every call is forwarded to. */
    protected static function getFacadeAccessor(): string
    {
        return \\App\\Services\\NotificationService::class;
    }
}


// ---------- 4. Two ways to use the same object ----------

// Facade
use App\\Facades\\Notification;

Notification::send('Invoice INV-0001 is paid');


// Injection
use App\\Services\\NotificationService;

class InvoiceController extends Controller
{
    public function __construct(
        private NotificationService $notifications
    ) {}

    public function pay()
    {
        $this->notifications->send('Invoice INV-0001 is paid');
    }
}`,
      },
      keyTakeaways: [
        "A <b>facade</b> is a static-looking interface to an object the service container manages.",
        "Facades are not static classes. `Cache` has no `get()` method of its own.",
        "`__callStatic()` catches the call, `getFacadeAccessor()` names a container key, and the call is forwarded to the resolved object.",
        "The shape is always <b>facade → Laravel service → actual work</b>.",
        "`Cache`, `Log`, `DB`, `Mail`, `Storage`, `Http`, `Queue` and `Event` are the ones you will meet most.",
        "You can write a facade for your own service: register the service in a provider, then return that container key from `getFacadeAccessor()`.",
        "Because everything behind a facade is container-managed, it can be changed or replaced without touching the calling code.",
      ],
      commonMistakes: [
        "<b>Thinking facades are ordinary static classes.</b> `Cache::get()` forwards to a container-managed object. Read it as an instance call in disguise.",
        "<b>Putting logic inside the facade class.</b> A facade should contain `getFacadeAccessor()` and nothing else. Behaviour belongs in the service.",
        "<b>Writing a facade for a service that is not registered.</b> The accessor is a container key, so an unregistered service means the facade resolves nothing.",
        "<b>Confusing `App\\Facades\\Notification` with `Illuminate\\Support\\Facades\\Notification`.</b> Two different classes with the same short name. Check the `use` line when calls go somewhere unexpected.",
        "<b>Calling a facade inside a provider's `register()`.</b> It resolves from the container, and in pass one the service behind it may not be there yet.",
      ],
      quiz: [
        {
          question: "What is a facade?",
          options: [
            "A static utility class with all its logic inside",
            "A static-looking interface to an object managed by the container",
            "A Blade template helper",
            "A kind of middleware",
          ],
          correctIndex: 1,
          explanation: "It forwards your call to a real instance resolved from the container.",
        },
        {
          question: "What does `getFacadeAccessor()` return?",
          options: [
            "The method to call",
            "An HTML string",
            "A container key naming the service behind the facade",
            "The facade's own class name",
          ],
          correctIndex: 2,
          explanation: "The facade resolves that key and forwards the call to whatever comes back.",
        },
        {
          question: "Why does `Cache::get('user')` work when `Cache` has no `get()` method?",
          options: [
            "PHP creates it automatically",
            "`__callStatic()` catches the call and forwards it to the resolved service",
            "Laravel compiles the facade into a real class",
            "`get()` is inherited from `Facade`",
          ],
          correctIndex: 1,
          explanation: "That is the whole mechanism: catch, resolve, forward.",
        },
        {
          question: "To give your own service a facade, what has to be true?",
          options: [
            "The service must be registered in the container",
            "The service must extend `Facade`",
            "The service must be bound in `boot()`",
            "The service must live in `app/Facades`",
          ],
          correctIndex: 0,
          explanation: "The accessor is a container key, so the container must know how to build it.",
        },
      ],
    },
    {
      id: "facades-injection-helpers",
      title: "Facades, injection and helpers",
      durationMinutes: 12,
      explanation: "Three routes now lead to the same object, and you have met two of them.\n\nA <b>helper function</b> (a plain global function Laravel defines for convenience, such as `config()`, `route()`, `app()`, `response()` or `now()`) is the third, alongside the facade and the injected dependency. Helpers are a different mechanism from facades, not a kind of facade.\n\n```text\nFacade      Cache::get('user')      static-looking access to a service\nHelper      config('app.name')      a convenient global function\nInjection   $this->cache->get()     an explicit, declared dependency\n```\n\n---\n\n### 1. Basic — facade or injection\n\nThe same controller, both ways. With a facade:\n\n```php\nuse Illuminate\\Support\\Facades\\Cache;\n\nclass UserController extends Controller\n{\n    public function show()\n    {\n        return Cache::get('user');\n    }\n}\n```\n\nWith injection, which is Day 3's material:\n\n```php\nuse Illuminate\\Contracts\\Cache\\Repository;\n\nclass UserController extends Controller\n{\n    public function __construct(\n        private Repository $cache\n    ) {}\n\n    public function show()\n    {\n        return $this->cache->get('user');\n    }\n}\n```\n\nBoth reach the same cache. What differs is what a reader can see.\n\nFacades are short, easy to read and idiomatic Laravel. Injection makes the dependency explicit: the constructor lists everything the class needs, which matters for a class you will reuse, test in isolation, or point at an interface.\n\nA workable rule: <b>use a facade when it keeps ordinary Laravel code simple, and use injection when you want a class's dependencies to be visible.</b> A one-line `Log::info()` in a controller is a facade. A service a whole feature depends on gets injected.\n\n---\n\n### 2. Intermediate — helpers, and the three side by side\n\nHelpers are ordinary functions, available everywhere:\n\n```php\nconfig('invoicing.gateway');\nroute('invoices.show', ['number' => 'INV-0001']);\nnow()->addDays(30);\napp(InvoiceTotals::class);\nresponse()->json(['ok' => true]);\n```\n\nCompare two ways of reaching the cache:\n\n```php\n// helper, resolving by hand\n$cache = app('cache');\n$value = $cache->get('user');\n\n// facade\n$value = Cache::get('user');\n```\n\nThe facade is plainly cleaner, and that is a large part of why Laravel code feels expressive.\n\nOne caution on `app()`. Resolving out of the container by hand is convenient, and it hides the dependency completely, from readers and from tests. Treat `app()` as a tool for places that cannot use injection, not as a habit inside your own classes.\n\n```text\n                    reads short   dependency visible   easy to replace\nFacade                  yes             no                  yes\nHelper app()            yes             no                  no\nInjection               no              yes                 yes\n```\n\n---\n\n### 3. Advanced — real-time facades\n\nA <b>real-time facade</b> (a way to call your own class with facade syntax, without writing a facade class) removes the third step from the last lesson.\n\nTake a plain service:\n\n```php\nnamespace App\\Services;\n\nclass Podcast\n{\n    public function publish(): void\n    {\n        // ...\n    }\n}\n```\n\nImport it with a `Facades\\` prefix and call it statically:\n\n```php\nuse Facades\\App\\Services\\Podcast;\n\nPodcast::publish();\n```\n\nNote the prefix. There is no `Facades\\App\\Services` directory and no `PodcastFacade.php`. Laravel sees the prefix and generates the facade behaviour at runtime, resolving `App\\Services\\Podcast` from the container.\n\n```text\nFacades\\App\\Services\\Podcast::publish()\n            ↓\nLaravel sees the Facades\\ prefix\n            ↓\nresolves App\\Services\\Podcast from the container\n            ↓\n->publish()\n```\n\nUseful, and easy to overuse. Facade syntax hides your application's own dependencies just as effectively as it hides the framework's, and your own services are the ones a reader most needs to see. For most application code, ordinary injection is clearer:\n\n```php\nclass PodcastController extends Controller\n{\n    public function __construct(\n        private Podcast $podcast\n    ) {}\n}\n```\n\nThe honest use for a real-time facade is a class buried somewhere injection cannot reach, or making an existing static-feeling call replaceable in a test. Do not turn every service into one.",
      diagram: `Three doors, one object

                    ┌─────────────────────┐
                    │  Service Container  │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │  CacheManager       │
                    └──────────┬──────────┘
              ┌────────────────┼────────────────┐
              ↑                ↑                ↑
      Cache::get('user')  app('cache')   $this->cache->get()
         FACADE              HELPER          INJECTION
      short, idiomatic    convenient,    explicit, listed
      dependency hidden   hides the      in the constructor
                          dependency


WHEN TO REACH FOR WHICH

  one-off framework call in a controller   →  facade
    Log::info(), Cache::get(), DB::table()

  a service the class genuinely depends on →  injection
    InvoiceTotals, PaymentGateway

  config, routes, dates, responses         →  helper
    config(), route(), now(), response()

  resolving by hand inside your own class  →  usually a smell
    app(Something::class)


REAL-TIME FACADE

  use Facades\\App\\Services\\Podcast;
  Podcast::publish();
            ↓
  the Facades\\ prefix is the whole trick.
  no facade class is written. Laravel generates it at runtime.
  handy, and easy to overuse.`,
      codeExample: {
        title: "The same job three ways, plus a real-time facade",
        code: `<?php

// ---------- Facade: short, idiomatic, dependency hidden ----------
namespace App\\Http\\Controllers;

use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Support\\Facades\\Log;

class InvoiceController extends Controller
{
    public function show(string $number)
    {
        Log::info('Invoice viewed', ['number' => $number]);

        return Cache::get("invoice.{$number}");
    }
}


// ---------- Injection: explicit, testable, reusable ----------
use App\\Services\\Invoicing\\InvoiceTotals;
use Illuminate\\Contracts\\Cache\\Repository;

class InvoiceTotalsController extends Controller
{
    // A reader sees everything this class needs, in one place.
    public function __construct(
        private InvoiceTotals $totals,
        private Repository $cache,
    ) {}

    public function show(string $number)
    {
        return $this->cache->remember(
            "totals.{$number}",
            60,
            fn () => $this->totals->for($number),
        );
    }
}


// ---------- Helpers: convenient globals ----------
$gateway = config('invoicing.gateway');
$url     = route('invoices.show', ['number' => 'INV-0001']);
$due     = now()->addDays(30);

// Works, but hides the dependency from readers and tests.
// Prefer injection inside your own classes.
$totals = app(InvoiceTotals::class);


// ---------- Real-time facade: no facade class written ----------
namespace App\\Services;

class Podcast
{
    public function publish(): void
    {
        // ...
    }
}

// Elsewhere. Note the Facades\\ prefix on the import.
use Facades\\App\\Services\\Podcast;

Podcast::publish();

// Laravel generates the facade behaviour at runtime and resolves
// App\\Services\\Podcast from the container. Convenient, but it hides
// your own dependencies, so do not make it the default.`,
      },
      keyTakeaways: [
        "Facade, helper and injection all reach the same container-managed object through different syntax.",
        "Facades win on brevity and read as idiomatic Laravel. Injection wins on making dependencies explicit.",
        "Rule of thumb: facade for a one-off framework call, injection for a service the class truly depends on.",
        "<b>Helper functions</b> like `config()`, `route()`, `now()` and `response()` are plain globals, a different mechanism from facades.",
        "`app(Something::class)` inside your own class hides the dependency. Prefer a constructor parameter.",
        "A <b>real-time facade</b> gives facade syntax to your own class through the `Facades\\` import prefix, with no facade class written.",
        "Do not turn every service into a real-time facade. Your own dependencies are the ones a reader most needs to see.",
      ],
      commonMistakes: [
        "<b>Treating the choice as a style war.</b> Both are correct Laravel. Judge each case on whether the reader needs to see that dependency.",
        "<b>Reaching for `app()` all over a class.</b> The class now has hidden dependencies that no constructor and no test can see.",
        "<b>Injecting a concrete framework class instead of its contract.</b> Type-hint `Illuminate\\Contracts\\Cache\\Repository`, not a specific manager, so it stays swappable.",
        "<b>Making a real-time facade out of every service.</b> Facade syntax hides your application's own wiring, which is where clarity matters most.",
        "<b>Forgetting the `Facades\\` prefix on a real-time facade import.</b> Without it PHP looks for real static methods on your class and the call fails.",
      ],
      quiz: [
        {
          question: "What is a helper function in Laravel?",
          options: [
            "A method on a facade",
            "A plain global function such as `config()` or `route()`",
            "A trait added to controllers",
            "A container binding",
          ],
          correctIndex: 1,
          explanation: "Helpers are a separate mechanism from facades, not a kind of facade.",
        },
        {
          question: "What is the main advantage of injection over a facade?",
          options: [
            "It runs faster",
            "It avoids the container",
            "The class's dependencies are explicit and visible in one place",
            "It works without a provider",
          ],
          correctIndex: 2,
          explanation: "That visibility is what makes a class easy to read, reuse and test.",
        },
        {
          question: "What marks a real-time facade?",
          options: [
            "A `RealTime` attribute on the class",
            "The `Facades\\` prefix on the import",
            "Extending `Facade` in your service",
            "Listing it in `bootstrap/providers.php`",
          ],
          correctIndex: 1,
          explanation: "Laravel sees the prefix and generates the facade behaviour at runtime.",
        },
        {
          question: "Why is `app(InvoiceTotals::class)` inside a class usually worse than injecting it?",
          options: [
            "It is deprecated",
            "It bypasses the provider",
            "It hides the dependency from readers and from tests",
            "It creates a new container",
          ],
          correctIndex: 2,
          explanation: "Nothing in the constructor tells anyone the class needs it.",
        },
      ],
    },
    {
      id: "testing-with-fakes",
      title: "Testing with fakes",
      durationMinutes: 9,
      explanation: "Now the payoff for everything above.\n\nA <b>fake</b> (a stand-in that records what your code asked for instead of actually doing it) is what `Mail::fake()` slides in behind the mail facade for the length of a test.\n\n```php\nMail::fake();\n\n$this->post('/register');\n\nMail::assertSent(WelcomeMail::class);\n```\n\nNo email left the machine, and you still proved the code tried to send one.\n\n---\n\n### 1. Basic — why this is possible at all\n\nRemember what a facade really is. `Mail::to(...)` does not do the sending. It resolves the mail service from the container and forwards the call. So there is a swap point, and `Mail::fake()` uses it: it replaces the container binding with a recording object.\n\n```text\nREAL\nController  →  Mail facade  →  real mail system  →  an email leaves\n\nTEST\nMail::fake()\n     ↓ rebinds the container\nController  →  Mail facade  →  fake mail system  →  nothing sent,\n                                                    everything recorded\n```\n\nDay 3 showed you the manual version: bind a fake implementation and the class under test never notices. A facade fake is the same idea in one line, handed to you by the framework.\n\nNotice what you are testing. Not \"did an email arrive\", which is not your application's job, but \"did my code ask for the right email to be sent\". That is the behaviour you actually own.\n\n---\n\n### 2. Intermediate — the assertions\n\nCalling `fake()` is half of it. The other half is asking what was recorded.\n\n```php\nMail::fake();\n\n$this->post('/invoices/INV-0001/pay');\n\nMail::assertSent(PaymentReceipt::class);\nMail::assertNotSent(PaymentFailed::class);\nMail::assertSentCount(1);\n```\n\nNotifications work the same way:\n\n```php\nNotification::fake();\n\n$this->post('/register');\n\nNotification::assertSentTo($user, WelcomeNotification::class);\nNotification::assertNothingSent();\n```\n\nMost assertions also take a closure, so you can check the contents rather than only the class:\n\n```php\nMail::assertSent(PaymentReceipt::class, function ($mail) {\n    return $mail->invoiceNumber === 'INV-0001';\n});\n```\n\nThe negative assertions matter as much as the positive ones. \"No receipt is sent when payment fails\" is a rule worth locking down, and `assertNotSent()` is how you say it.\n\n---\n\n### 3. Advanced — the family, and where fakes stop\n\nThe same trick runs across the framework:\n\n• `Mail::fake()` with `assertSent`, `assertNotSent`, `assertQueued`\n• `Notification::fake()` with `assertSentTo`, `assertNothingSent`\n• `Queue::fake()` with `assertPushed`, so jobs are recorded instead of dispatched\n• `Bus::fake()` for dispatched commands and batches\n• `Event::fake()` with `assertDispatched`\n• `Storage::fake('invoices')` for a throwaway disk\n• `Http::fake()` for stubbed outbound API responses\n\nThe reason to care is not tidiness. Without fakes, a test suite either sends real email, queues real jobs and calls real APIs, or you write your code so those calls can be switched off by hand, which is worse. Fakes give you tests that are fast, repeatable and safe to run a hundred times a day.\n\nTwo limits worth knowing. A fake replaces the service, so nothing downstream of it runs. If your mailable's `build()` method has a bug, `assertSent()` will not find it, and a test that renders the mailable will. And `Event::fake()` in particular silences every listener, including ones the rest of the test relies on, so prefer faking only the specific events you are asserting on.\n\n```text\nfake()      →  swap the service in the container\nact         →  hit the route or call the code\nassert*()   →  ask what the fake recorded\n```\n\nThat is the shape of most Laravel feature tests, and it exists because facades resolve through the container instead of doing the work themselves.",
      diagram: `Why a fake can slot in at all

REAL RUN
  Controller
      │  Mail::to($user)->send(new PaymentReceipt())
      ↓
  Mail facade
      │  resolve 'mailer' from the container
      ↓
  real mail system  ──→  SMTP  ──→  an email arrives


UNDER TEST
  Mail::fake()
      │  rebinds 'mailer' in the container
      ↓
  Controller
      │  the exact same line of code
      ↓
  Mail facade
      │  resolve 'mailer' from the container
      ↓
  fake mailer
      │  records the call, sends nothing
      ↓
  Mail::assertSent(PaymentReceipt::class)   ✓


THE SHAPE OF THE TEST

  fake()      swap the service
     ↓
  act         post to the route
     ↓
  assert*()   ask the fake what it recorded


AVAILABLE FAKES

  Mail    Notification    Queue    Bus
  Event   Storage         Http`,
      codeExample: {
        title: "A feature test built on fakes",
        code: `<?php

namespace Tests\\Feature;

use App\\Jobs\\GenerateInvoicePdf;
use App\\Mail\\PaymentFailed;
use App\\Mail\\PaymentReceipt;
use App\\Notifications\\InvoicePaid;
use Illuminate\\Support\\Facades\\Mail;
use Illuminate\\Support\\Facades\\Notification;
use Illuminate\\Support\\Facades\\Queue;
use Tests\\TestCase;

class PayInvoiceTest extends TestCase
{
    public function test_paying_an_invoice_sends_a_receipt(): void
    {
        // 1. Swap the real services for recorders.
        Mail::fake();
        Notification::fake();
        Queue::fake();

        // 2. Act. The controller code is completely unchanged.
        $response = $this->post('/invoices/INV-0001/pay');

        $response->assertRedirect('/invoices/INV-0001');

        // 3. Ask what was recorded.
        Mail::assertSent(PaymentReceipt::class, function ($mail) {
            return $mail->invoiceNumber === 'INV-0001';
        });

        Mail::assertSentCount(1);

        Notification::assertSentTo(
            $this->accountsUser(),
            InvoicePaid::class
        );

        Queue::assertPushed(GenerateInvoicePdf::class);
    }

    public function test_a_failed_payment_sends_no_receipt(): void
    {
        Mail::fake();

        $this->post('/invoices/INV-9999/pay')
            ->assertSessionHasErrors();

        // The negative assertion is the rule worth locking down.
        Mail::assertNotSent(PaymentReceipt::class);
        Mail::assertSent(PaymentFailed::class);
    }
}

// Nothing left the machine. No SMTP, no queue worker, no API call.
// This works only because the facade resolves through the container,
// which is the whole reason the swap is possible.`,
      },
      keyTakeaways: [
        "A <b>fake</b> replaces a service with an object that records calls instead of performing them.",
        "`Mail::fake()` works because the facade resolves from the container, so the binding can be swapped.",
        "The shape is always the same: `fake()`, act, then `assert*()`.",
        "`assertSent`, `assertNotSent`, `assertSentCount` and `assertSentTo` are the ones you will use most.",
        "Most assertions take a closure, so you can check the contents of the mail or notification, not just its class.",
        "`Queue`, `Bus`, `Event`, `Storage` and `Http` all offer the same kind of fake.",
        "You are testing that your code asked for the right thing, not that an email physically arrived.",
      ],
      commonMistakes: [
        "<b>Calling `fake()` after the action.</b> The swap has to happen before the code runs, or the real service has already done the work.",
        "<b>Asserting only the positive case.</b> \"No receipt when payment fails\" matters just as much, and `assertNotSent()` is how you state it.",
        "<b>Believing a passing `assertSent()` means the email is correct.</b> The fake never rendered it. Add a test that builds the mailable if the content matters.",
        "<b>Reaching for `Event::fake()` broadly.</b> It silences every listener, including ones the rest of the test depends on. Fake only the events you assert on.",
        "<b>Sending real email from the test suite because the code called `new Mailer()` directly.</b> Nothing created outside the container can be faked, which is the practical argument for everything taught today.",
      ],
      quiz: [
        {
          question: "Why can `Mail::fake()` replace the mail system?",
          options: [
            "It rewrites the facade class",
            "The facade resolves from the container, so the binding can be swapped",
            "It edits your `.env` file",
            "It patches SMTP at the network level",
          ],
          correctIndex: 1,
          explanation: "Everything behind a facade is container-managed, which is what makes the swap possible.",
        },
        {
          question: "What does `Mail::assertSent(PaymentReceipt::class)` prove?",
          options: [
            "An email reached the inbox",
            "SMTP is configured correctly",
            "Your code asked for that mail to be sent",
            "The mailable renders without errors",
          ],
          correctIndex: 2,
          explanation: "The fake records intent. It never renders or delivers anything.",
        },
        {
          question: "Where must `Notification::fake()` be called?",
          options: [
            "Before the code under test runs",
            "After the assertions",
            "Inside the controller",
            "In `bootstrap/providers.php`",
          ],
          correctIndex: 0,
          explanation: "The swap has to be in place before anything resolves the real service.",
        },
        {
          question: "Which of these has no facade fake of its own?",
          options: [
            "`Queue`",
            "`Storage`",
            "`Http`",
            "A service you built with `new` inside a controller",
          ],
          correctIndex: 3,
          explanation: "Anything created outside the container cannot be swapped or faked.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "How does Laravel run your providers?",
      options: [
        "One provider fully at a time, `register()` then `boot()`",
        "Two passes: every `register()` first, then every `boot()`",
        "`boot()` first, then `register()` on demand",
        "In alphabetical order, both methods together",
      ],
      correctIndex: 1,
      explanation: "That two-pass order is what makes `boot()` safe and `register()` restricted.",
    },
    {
      question: "Which of these must NOT go in `register()`?",
      options: [
        "`$this->app->bind(...)`",
        "`$this->app->singleton(...)`",
        "`DB::table('settings')->value('tax_rate')`",
        "A closure binding",
      ],
      correctIndex: 2,
      explanation: "The database provider may not have run yet, so it works or fails by accident.",
    },
    {
      question: "Which of these belongs in `boot()`?",
      options: [
        "A view composer",
        "Binding an interface to an implementation",
        "Registering a singleton",
        "Nothing, `boot()` is optional decoration",
      ],
      correctIndex: 0,
      explanation: "It reaches into the view layer, which another provider registered.",
    },
    {
      question: "What is a deferred provider?",
      options: [
        "A provider that runs after the response is sent",
        "A provider loaded only when one of its services is resolved",
        "A provider with an empty `register()`",
        "A provider Laravel loads twice",
      ],
      correctIndex: 1,
      explanation: "It needs `DeferrableProvider` plus a complete `provides()` list.",
    },
    {
      question: "What actually happens when you call `Cache::get('user')`?",
      options: [
        "A static method on the `Cache` class runs",
        "Laravel opens a new cache connection each time",
        "`__callStatic()` resolves a container key and forwards the call to a real object",
        "The value is read straight from a global array",
      ],
      correctIndex: 2,
      explanation: "That container hop is also why test fakes can replace what sits behind a facade.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Give invoice totals a service of their own, wire it up in a provider you write, then reach it two ways.",
    brief: "Day 3 left InvoiceHub taking payments through a contract the container resolved. The totals, though, are still added up wherever they happen to be needed.\n\nToday you give that logic a service, register it in a provider of your own, use `boot()` for the one piece of setup that needs it, and then reach the service twice: once by injection and once through a facade you add. Doing both is the point. By the end you should be able to say which one you would keep, and why.\n\nThere is still no database until Day 12, so invoices stay hard-coded in an array or a config file. That is fine. Today's subject is wiring, not storage.",
    steps: [
      "Create `app/Services/Invoicing/InvoiceTotals.php` with `for(string $number): array` returning subtotal, tax and total from a hard-coded list of invoices.",
      "Run `php artisan make:provider InvoiceServiceProvider`, bind `InvoiceTotals` as a `singleton()` in `register()`, and check the provider is listed in `bootstrap/providers.php`.",
      "Inject `InvoiceTotals` into `InvoiceController::show()` and render the totals on the invoice page.",
      "Move the tax rate into `config/invoicing.php`. Read it in `boot()`, never in `register()`, and add a one-line comment saying why.",
      "In the same `boot()`, register a view composer that shares the company name with every `invoices.*` view, and delete the variable from the controller that used to pass it.",
      "Add a `@money` Blade directive in `boot()` and use it for the totals in the view.",
      "Add `app/Facades/Totals.php` extending `Facade`, returning `InvoiceTotals::class` from `getFacadeAccessor()`.",
      "Add a second route or a partial that uses `Totals::for('INV-0001')` instead of the injected service, and confirm the numbers match.",
      "Write down, in the provider file or a scratch note, which of the two you would keep for this service and why.",
      "Add a feature test that calls `Mail::fake()`, pays an invoice, and asserts a receipt was sent with the right invoice number.",
    ],
    acceptance: [
      "`InvoiceTotals` is bound in your own provider, and the provider is listed in `bootstrap/providers.php`.",
      "The invoice page renders totals through the injected service, and the second route renders the same numbers through the facade.",
      "`register()` contains bindings only. The config read, the view composer and the Blade directive all live in `boot()`.",
      "No controller passes the company name to a view any more, and the pages still show it.",
      "The `Mail::fake()` test passes and sends no real email.",
    ],
    stretch: [
      "Move the config read from `boot()` back into `register()` and see whether it still works. Then explain why \"it worked\" is not the same as \"it is correct\".",
      "Make `InvoiceServiceProvider` deferrable: implement `DeferrableProvider`, add `provides()`, and confirm the page still works. Then remove an entry from `provides()` and watch it break.",
      "Try a real-time facade instead of your own facade class: `use Facades\\App\\Services\\Invoicing\\InvoiceTotals;` and call it statically. Delete `app/Facades/Totals.php` and see whether you miss it.",
    ],
  },
};
