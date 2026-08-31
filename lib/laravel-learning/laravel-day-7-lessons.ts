import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_7_LESSONS: LessonDay = {
  day: 7,
  title: "Controllers, the Request object & responses",
  totalMinutes: 76,
  difficulty: "Beginner",
  lessons: [
    {
      id: "controllers",
      title: "Controllers, and the invokable kind",
      durationMinutes: 10,
      explanation: "You have been pointing routes at controllers since Day 5 without looking closely at them. Today the controller is the subject.\n\nA <b>controller</b> (a class that handles requests for one part of your application) sits between the route and everything else:\n\n```text\nRoute\n  ↓\nController\n  ├── read the request\n  ├── do the work, or ask something else to\n  └── return a response\n```\n\nAn <b>invokable controller</b> is that same idea narrowed to one action: a controller with a single `__invoke` method, for a job that deserves its own class but only ever does one thing.\n\n---\n\n### 1. Basic — why not just use closures?\n\nYou can put logic straight in a route:\n\n```php\nRoute::get('/invoices/{invoice}', function ($invoice) {\n    // twenty lines of work\n});\n```\n\nThis stops working for three separate reasons, and only the first is obvious.\n\nIt gets long. A route file should be a table of contents, and it stops being readable once each entry is a paragraph.\n\nIt cannot be cached. You met this on Day 5: `php artisan route:cache` fails on closure routes, so a single one blocks the optimisation for your whole application.\n\nIt cannot be tested directly. There is no class to instantiate, so the only way to exercise that code is through a full HTTP request.\n\nA controller fixes all three:\n\n```bash\nphp artisan make:controller InvoiceController\n```\n\n```php\nnamespace App\\Http\\Controllers;\n\nclass InvoiceController extends Controller\n{\n    public function index()\n    {\n        return view('invoices.index');\n    }\n}\n```\n\n```php\nRoute::get('/invoices', [InvoiceController::class, 'index']);\n```\n\nThe route now says <i>where</i> a request goes. The controller says <i>what happens</i>.\n\n---\n\n### 2. Intermediate — one controller, one job\n\nSome actions do not belong to a resource. Generating a report, exporting a CSV, handling a webhook: each is one action, and putting it in a controller alongside six unrelated methods is filing it in the wrong place.\n\nAn <b>invokable controller</b> exists for this:\n\n```bash\nphp artisan make:controller GenerateStatementController --invokable\n```\n\n```php\nclass GenerateStatementController extends Controller\n{\n    public function __invoke(string $client)\n    {\n        // the one thing this class does\n    }\n}\n```\n\nThe route names no method, because there is only one:\n\n```php\nRoute::get('/clients/{client}/statement', GenerateStatementController::class);\n```\n\n`__invoke` is a PHP feature, not a Laravel one: it lets an object be called like a function. Laravel just takes advantage of it.\n\nThe naming convention is worth following. `GenerateStatementController` says what it does; a `StatementController` with one method called `handle` does not.\n\n---\n\n### 3. Advanced — what belongs in a controller\n\nThe most common mistake in a Laravel codebase is not a bug. It is controllers that do too much.\n\nA controller is a <b>coordinator</b>. Its job is to translate an HTTP request into a call on something else, then translate the result into an HTTP response:\n\n```text\nHTTP in  →  controller  →  the actual work\n                        ←  result\nHTTP out ←  controller\n```\n\nRead that literally. Anything that is not about HTTP probably does not belong here:\n\n```text\nBelongs in a controller       Belongs elsewhere\n───────────────────────       ─────────────────\nread input from the request   business rules      → a service\ndecide the status code        database queries    → a model\nchoose a view or JSON         formatting money    → a helper or cast\nredirect after success        sending mail        → a mailable or job\n```\n\nA useful test: <i>could this code be needed outside a web request?</i> If an Artisan command or a queued job might also want to do it, it belongs in a service the controller calls, not in the controller.\n\nYour `InvoiceTotals` service from Day 2 is exactly this. The controller reads the request, hands the line items to the service, and turns the answer into a page. If a scheduled command later needs the same totals, it calls the same service.\n\nKeep controller methods short enough to read at a glance. When one grows past about fifteen lines, the extra is usually work that has a better home.",
      diagram: `Where a controller sits

  HTTP Request
       ↓
     Route          "where does this go?"
       ↓
   Controller       "what happens?"
       │
       ├── read the request
       ├── call a service / model     ← the actual work happens here
       └── build a response
       ↓
  HTTP Response


Standard vs invokable

  STANDARD                        INVOKABLE
  class InvoiceController         class GenerateStatementController
  {                               {
      index()                         __invoke()
      show()                      }
      store()
      update()                    Route::get('/statement',
      destroy()                       GenerateStatementController::class);
  }
                                  No method named: there is only one.
  Route::resource(...)


Why closures stop working

  long route file      a table of contents should not be paragraphs
  route:cache fails    ONE closure blocks caching for the whole app
  cannot unit test     no class to instantiate`,
      codeExample: {
        title: "Standard, invokable, and a controller doing too much",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Services\\InvoiceTotals;
use Illuminate\\Http\\Request;

// ---------- A standard controller ----------
class InvoiceController extends Controller
{
    public function index()
    {
        return view('invoices.index', ['invoices' => []]);
    }

    public function show(string $invoice)
    {
        return view('invoices.show', ['invoice' => $invoice]);
    }
}


// ---------- An invokable controller: one class, one action ----------
class GenerateStatementController extends Controller
{
    public function __invoke(string $client)
    {
        return view('statements.show', ['client' => $client]);
    }
}
// Route::get('/clients/{client}/statement', GenerateStatementController::class);


// ---------- Doing too much ----------
class BadInvoiceController extends Controller
{
    public function store(Request $request)
    {
        $lines = $request->input('lines', []);

        // Business rules, in a controller.
        $subtotal = 0;
        foreach ($lines as $line) {
            $subtotal += $line['quantity'] * $line['unit_price'];
        }
        $tax   = $subtotal * 0.13;
        $total = $subtotal + $tax;

        // A scheduled command needing the same totals cannot reuse any of this.
        return view('invoices.show', compact('subtotal', 'tax', 'total'));
    }
}


// ---------- Coordinating instead ----------
class GoodInvoiceController extends Controller
{
    public function __construct(private InvoiceTotals $totals) {}

    public function store(Request $request)
    {
        $totals = $this->totals->for($request->input('lines', []));

        return view('invoices.show', ['totals' => $totals]);
    }
}
// The command, the job and the controller all call the same service.`,
      },
      keyTakeaways: [
        "A controller turns an HTTP request into a call on something else, then turns the result into a response.",
        "Closures in routes make the file long, <b>break `route:cache`</b>, and cannot be tested without a full request.",
        "`php artisan make:controller Name` creates a standard controller; `--invokable` creates a single-action one.",
        "An <b>invokable controller</b> uses `__invoke()` and its route names no method.",
        "Name invokable controllers after the action: `GenerateStatementController`, not `StatementController`.",
        "Controllers <b>coordinate</b>. Business rules, queries and formatting belong in services, models and helpers.",
        "The test: if a command or a job might need the same code, it does not belong in the controller.",
      ],
      commonMistakes: [
        "<b>Leaving one closure route in the application.</b> It is enough to make `php artisan route:cache` fail at deploy time.",
        "<b>Putting business rules in a controller.</b> The moment a queued job needs the same calculation, it gets copied instead of reused.",
        "<b>Making every controller a resource controller.</b> A single action deserves an invokable controller, not five empty methods around it.",
        "<b>Naming an invokable controller after a noun.</b> `ReportController` with one `__invoke` tells the reader nothing about what it does.",
        "<b>Letting a controller method grow past a screen.</b> The excess is nearly always work with a better home elsewhere.",
      ],
      quiz: [
        {
          question: "Why do closure routes cause a problem at deploy time?",
          options: [
            "`route:cache` cannot serialise them, so it fails",
            "They are slower",
            "They cannot use middleware",
            "They break CSRF",
          ],
          correctIndex: 0,
          explanation: "One closure anywhere blocks route caching for the whole application.",
        },
        {
          question: "What makes a controller invokable?",
          options: [
            "It extends a different base class",
            "It uses an attribute",
            "It is registered in a provider",
            "It has a single `__invoke()` method",
          ],
          correctIndex: 3,
          explanation: "The route then names the class alone, with no method.",
        },
        {
          question: "Which of these belongs in a controller?",
          options: [
            "Deciding whether to return a view or JSON",
            "Calculating tax on line items",
            "Querying the database directly",
            "Formatting currency for display",
          ],
          correctIndex: 0,
          explanation: "Choosing the response type is an HTTP concern, which is the controller's domain.",
        },
        {
          question: "What is the test for whether code belongs in a controller?",
          options: [
            "Is it more than ten lines?",
            "Does it use the Request object?",
            "Could a command or a job need the same code?",
            "Is it in the routes file?",
          ],
          correctIndex: 2,
          explanation: "If so, it belongs in a service both can call.",
        },
      ],
    },
    {
      id: "resource-controllers",
      title: "Resource controllers and the seven actions",
      durationMinutes: 10,
      explanation: "Day 5 gave you `Route::resource`, which creates seven routes. This is the other half: the controller those routes point at.\n\nA <b>resource controller</b> is a controller holding the seven standard CRUD actions under the method names `Route::resource` expects. You write one line in the route file and one class with the matching methods, and the two line up without any wiring in between.\n\n```bash\nphp artisan make:controller InvoiceController --resource\n```\n\nLaravel writes all seven methods for you, empty and ready.\n\n---\n\n### 1. Basic — what each method is for\n\n```text\nMethod       HTTP   URL                     Does\nindex()      GET    /invoices               list them\ncreate()     GET    /invoices/create        show a blank form\nstore()      POST   /invoices               save the new one\nshow()       GET    /invoices/{invoice}     display one\nedit()       GET    /invoices/{invoice}/edit show a filled form\nupdate()     PUT    /invoices/{invoice}     save the changes\ndestroy()    DELETE /invoices/{invoice}     delete it\n```\n\nThe pairing is the thing to notice. Two methods do nothing but <b>show a form</b>, and two do nothing but <b>receive one</b>:\n\n```text\ncreate()  shows the form   →   store()   receives it\nedit()    shows the form   →   update()  receives it\n```\n\n`create` and `edit` are `GET` requests that change nothing. `store` and `update` are the ones that write. Once you see that pairing, the seven names stop needing memorisation.\n\n---\n\n### 2. Intermediate — the convention is the point\n\nNothing forces you to use these names. `Route::resource` simply expects them.\n\nThe reason to follow the convention anyway is that it removes a decision. Every Laravel developer already knows what `store()` does. A controller with `addNew()`, `saveInvoice()` and `removeIt()` works exactly as well and makes every reader stop and check.\n\nIt also means `route:list` reads predictably, route names line up with method names, and a resource route wires itself with no configuration.\n\nFor an API, drop the two form methods:\n\n```bash\nphp artisan make:controller InvoiceController --api\n```\n\n```text\nindex()   store()   show()   update()   destroy()\n```\n\nAn API returns data, and there is no form to show, so `create` and `edit` have nothing to do.\n\nYou can generate the model and a form request at the same time, which is the command worth remembering:\n\n```bash\nphp artisan make:controller InvoiceController --resource --model=Invoice --requests\n```\n\nThat gives you a controller type-hinting `Invoice` on the right methods, plus `StoreInvoiceRequest` and `UpdateInvoiceRequest` classes ready for Day 9.\n\n---\n\n### 3. Advanced — keeping resource controllers honest\n\nTwo habits keep these classes from decaying.\n\n<b>Do not add methods.</b> The moment you write an eighth method, the controller has stopped being a resource controller and the route file has to special-case it. Usually that eighth action is really a resource of its own:\n\n```text\nInstead of                         Prefer\n──────────                         ──────\nInvoiceController::markPaid()      PaymentController::store()\nInvoiceController::sendEmail()     InvoiceMailController::__invoke()\nInvoiceController::duplicate()     InvoiceDuplicateController::__invoke()\n```\n\nEach of those reads as \"creating a payment\", \"sending a mail\", \"making a copy\", which is a `store` or an invokable controller. The URL comes out better too: `POST /invoices/10/payments` rather than `POST /invoices/10/mark-paid`.\n\n<b>Keep the write methods thin.</b> `store` and `update` attract logic, because that is where things happen. The shape to aim for is: validate, delegate, redirect.\n\n```php\npublic function store(StoreInvoiceRequest $request)\n{\n    $invoice = $this->invoices->create($request->validated());\n\n    return redirect()\n        ->route('invoices.show', $invoice)\n        ->with('success', 'Invoice created.');\n}\n```\n\nThree lines. Validation happens in the form request, the work happens in a service, and the controller only decides where the user goes next.",
      diagram: `The seven actions, and how they pair

  LIST AND VIEW                 CREATE                UPDATE
  index()   GET /invoices       create()  GET  /create   edit()   GET /{id}/edit
  show()    GET /invoices/{id}      ↓ shows a form           ↓ shows a form
                                store()   POST /invoices  update() PUT /{id}
                                    ↓ receives it            ↓ receives it

                                            DELETE
                                            destroy() DELETE /{id}

  create → store   and   edit → update
  One shows the form, the other receives it.
  Once you see the pairing, the names stop needing memorising.


resource vs api

  --resource   7 methods   index create store show edit update destroy
  --api        5 methods   index        store show      update destroy
                                  └── no forms in an API


The eighth method is a smell

  InvoiceController::markPaid()    →  PaymentController::store()
  InvoiceController::sendEmail()   →  InvoiceMailController::__invoke()
  InvoiceController::duplicate()   →  InvoiceDuplicateController::__invoke()

  POST /invoices/10/payments   beats   POST /invoices/10/mark-paid`,
      codeExample: {
        title: "A resource controller, and where the eighth action goes",
        code: `<?php
// php artisan make:controller InvoiceController --resource --model=Invoice --requests

namespace App\\Http\\Controllers;

use App\\Http\\Requests\\StoreInvoiceRequest;
use App\\Http\\Requests\\UpdateInvoiceRequest;
use App\\Models\\Invoice;

class InvoiceController extends Controller
{
    public function index()
    {
        return view('invoices.index', ['invoices' => Invoice::all()]);
    }

    public function create()
    {
        return view('invoices.create');          // just shows a blank form
    }

    public function store(StoreInvoiceRequest $request)
    {
        $invoice = Invoice::create($request->validated());

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice created.');
    }

    public function show(Invoice $invoice)
    {
        return view('invoices.show', compact('invoice'));
    }

    public function edit(Invoice $invoice)
    {
        return view('invoices.edit', compact('invoice'));   // shows a filled form
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $invoice->update($request->validated());

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice updated.');
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice deleted.');
    }
}


// ---------- The eighth action belongs somewhere else ----------

// NOT InvoiceController::markPaid()
class PaymentController extends Controller
{
    public function store(Invoice $invoice)      // POST /invoices/{invoice}/payments
    {
        // "marking paid" is really "creating a payment"
    }
}

// NOT InvoiceController::sendEmail()
class InvoiceMailController extends Controller
{
    public function __invoke(Invoice $invoice)   // POST /invoices/{invoice}/mail
    {
        // one action, one class
    }
}`,
      },
      keyTakeaways: [
        "`--resource` generates seven methods; `--api` generates five, dropping the two form actions.",
        "The seven pair up: <b>`create` shows a form and `store` receives it</b>; `edit` shows one and `update` receives it.",
        "`create` and `edit` change nothing; `store`, `update` and `destroy` are the ones that write.",
        "Following the convention removes a decision and makes `route:list` predictable.",
        "`--model=Invoice --requests` also generates the type hints and the form request classes.",
        "An <b>eighth method</b> usually means a missing resource: `markPaid` is really `PaymentController::store`.",
        "Aim for <b>validate, delegate, redirect</b> in the write methods, and keep them a few lines long.",
      ],
      commonMistakes: [
        "<b>Inventing your own method names.</b> `saveInvoice()` works but breaks the convention every other reader relies on.",
        "<b>Adding an eighth action to a resource controller.</b> It needs a special-case route and usually hides a resource you have not named yet.",
        "<b>Using `--resource` for an API.</b> You get `create` and `edit` methods that can only ever return forms nobody requests.",
        "<b>Putting the work in `store()`.</b> Validation belongs in a form request and the work in a service, leaving the controller to redirect.",
        "<b>Confusing `store` with `create`.</b> `create` shows the form; `store` is the POST that saves. Getting them the wrong way round produces a form that submits to itself.",
      ],
      quiz: [
        {
          question: "Which two resource methods only show a form?",
          options: [
            "`index` and `show`",
            "`show` and `edit`",
            "`store` and `update`",
            "`create` and `edit`",
          ],
          correctIndex: 3,
          explanation: "They pair with `store` and `update`, which receive those forms.",
        },
        {
          question: "Why does `--api` generate five methods instead of seven?",
          options: [
            "APIs are read-only",
            "It is a performance choice",
            "An API has no forms, so `create` and `edit` have nothing to do",
            "APIs cannot delete",
          ],
          correctIndex: 2,
          explanation: "Those two exist purely to return HTML forms.",
        },
        {
          question: "You need a `markPaid` action on invoices. What is usually better?",
          options: [
            "Add an eighth method to InvoiceController",
            "Treat it as creating a payment: `PaymentController::store`",
            "Use `Route::any`",
            "Put it in middleware",
          ],
          correctIndex: 1,
          explanation: "The URL becomes `POST /invoices/10/payments`, which describes what happens.",
        },
        {
          question: "What shape should a `store()` method aim for?",
          options: [
            "Query, format, render",
            "Validate, delegate, redirect",
            "Authorize, query, log",
            "Read, calculate, echo",
          ],
          correctIndex: 1,
          explanation: "Validation lives in a form request and the work in a service.",
        },
      ],
    },
    {
      id: "controller-injection",
      title: "Constructor and method injection",
      durationMinutes: 9,
      explanation: "Day 3 covered the container. This is where you use it every day.\n\n<b>Dependency injection</b> is asking for what you need by type-hinting it and letting the container build it, instead of reaching for `new` yourself. In a controller there are two places to ask, and choosing between them is what the rest of this lesson is about.\n\n---\n\n### 1. Basic — the two places to ask\n\n<b>Constructor injection</b> puts a dependency at the top of the class, available to every method:\n\n```php\nclass InvoiceController extends Controller\n{\n    public function __construct(\n        private InvoiceTotals $totals,\n    ) {}\n\n    public function show(string $invoice)\n    {\n        return view('invoices.show', [\n            'totals' => $this->totals->for($invoice),\n        ]);\n    }\n}\n```\n\n<b>Method injection</b> puts it on the one method that needs it:\n\n```php\npublic function store(Request $request, PaymentGateway $payments)\n{\n    // both were resolved by the container\n}\n```\n\nBoth go through the same container and follow the same bindings. The only difference is scope.\n\n---\n\n### 2. Intermediate — choosing between them\n\n```text\nNeeded by most methods?      → constructor\nNeeded by one method?        → that method\n```\n\nThat is the whole rule, and it is worth applying honestly. A constructor listing five dependencies where each method uses one is a signal that the controller is doing several jobs.\n\nTwo things can be injected into a method, and they are easy to confuse:\n\n```php\npublic function update(Request $request, Invoice $invoice, InvoiceTotals $totals)\n```\n\n```text\nRequest $request      the container builds it\nInvoice $invoice      ROUTE MODEL BINDING, from the URL\nInvoiceTotals $totals the container builds it\n```\n\n`$invoice` is not resolved from the container at all. It comes from the route parameter, via the binding you met on Day 5. Laravel sorts this out by type, so the order does not strictly matter, but the conventional order is request first, then bound models, then services.\n\n---\n\n### 3. Advanced — the trap with constructors\n\nConstructor injection has one behaviour worth knowing about: the constructor runs on <b>every</b> request to that controller, whichever method is being called.\n\n```php\npublic function __construct(private ReportBuilder $reports) {}\n```\n\nHit `index()`, and `ReportBuilder` is still constructed, along with everything <i>it</i> depends on. If that chain is expensive, opens a connection, or reads a remote configuration, you pay for it on every single request to the controller, including the ones that never touch it.\n\nMethod injection avoids that: the dependency is built only when that method is actually called.\n\n```text\nConstructor    built on every request to the controller\nMethod         built only when that method runs\n```\n\nFor most services this does not matter. For anything expensive to construct, prefer the method.\n\nTwo related notes. Laravel's `Request` is almost always taken as a method argument rather than a constructor one, and there is a reason beyond habit: the constructor runs early enough that relying on request state there is fragile. Take it as a method argument and you always get the current request.\n\nAnd if you find yourself wanting the container inside a method:\n\n```php\n$gateway = app(PaymentGateway::class);\n```\n\nthat works, but it hides the dependency. Type-hint it on the method instead and the signature tells the truth about what the method needs.",
      diagram: `Two places to ask, one container

  CONSTRUCTOR                      METHOD
  class InvoiceController          public function store(
  {                                    Request $request,
      public function __construct(     PaymentGateway $payments,
          private InvoiceTotals $t ) {
      ) {}
                                   available to this method only
      available to every method
  }

  Needed by most methods? → constructor
  Needed by one method?   → that method


Three arguments, two different mechanisms

  public function update(Request $request, Invoice $invoice, InvoiceTotals $totals)
                              │                  │                  │
                         container           ROUTE MODEL         container
                                              BINDING
                                          (from the URL, not
                                           from the container)


The cost of a constructor dependency

  GET /invoices  (index)
        ↓
  constructor runs ALWAYS
        ↓
  ReportBuilder built            ← even though index() never uses it
        ↓
  index() runs

  Expensive to construct? Put it on the method that needs it.`,
      codeExample: {
        title: "Choosing where to inject",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Contracts\\PaymentGateway;
use App\\Services\\InvoiceTotals;
use App\\Services\\ReportBuilder;
use App\\Models\\Invoice;
use Illuminate\\Http\\Request;

class InvoiceController extends Controller
{
    // Used by most methods, cheap to build: constructor.
    public function __construct(
        private InvoiceTotals $totals,
    ) {}

    public function index()
    {
        return view('invoices.index');
    }

    public function show(Invoice $invoice)
    {
        return view('invoices.show', [
            'invoice' => $invoice,
            'totals'  => $this->totals->for($invoice->lines),
        ]);
    }

    // Three arguments, two mechanisms:
    //   $request  → built by the container
    //   $invoice  → ROUTE MODEL BINDING, from the URL
    //   $payments → built by the container
    public function pay(Request $request, Invoice $invoice, PaymentGateway $payments)
    {
        $payments->charge($this->totals->for($invoice->lines)->total, $invoice->number);

        return back()->with('success', 'Payment taken.');
    }

    // Expensive to construct and used by ONE method:
    // inject it here, not in the constructor, so index() and show()
    // never pay to build it.
    public function statement(Invoice $invoice, ReportBuilder $reports)
    {
        return $reports->for($invoice)->download();
    }
}


// ---------- Hiding a dependency ----------
public function badPay(Invoice $invoice)
{
    // Works, but the signature no longer says what this method needs.
    $payments = app(PaymentGateway::class);

    $payments->charge(100, $invoice->number);
}`,
      },
      keyTakeaways: [
        "<b>Constructor injection</b> makes a dependency available to every method in the controller.",
        "<b>Method injection</b> scopes it to the one method that needs it.",
        "The rule: needed by most methods, use the constructor; needed by one, use that method.",
        "A method can mix both mechanisms: `Request` and services come from the container, models come from <b>route model binding</b>.",
        "The constructor runs on <b>every</b> request to the controller, whichever method is called.",
        "So anything expensive to construct belongs on the method that uses it, not the constructor.",
        "Take `Request` as a method argument, and type-hint dependencies rather than calling `app()` inside a method.",
      ],
      commonMistakes: [
        "<b>Putting an expensive dependency in the constructor.</b> Every request to the controller pays to build it, including the methods that never touch it.",
        "<b>A constructor with five dependencies each used by one method.</b> That is a controller doing several jobs, not an injection problem.",
        "<b>Thinking a bound model comes from the container.</b> `Invoice $invoice` is route model binding; the container never sees it.",
        "<b>Calling `app(Thing::class)` inside a method.</b> It resolves fine but hides what the method depends on.",
        "<b>Injecting `Request` into the constructor.</b> Take it per method, where you are guaranteed the current request.",
      ],
      quiz: [
        {
          question: "When should a dependency go in the constructor?",
          options: [
            "When most methods need it and it is cheap to build",
            "Always",
            "Only for the Request",
            "Never in a controller",
          ],
          correctIndex: 0,
          explanation: "The constructor runs on every request to the controller, whichever method is called.",
        },
        {
          question: "In `update(Request $request, Invoice $invoice)`, where does `$invoice` come from?",
          options: [
            "Route model binding, from the URL",
            "The service container",
            "The session",
            "The request body",
          ],
          correctIndex: 0,
          explanation: "Two different mechanisms filling arguments on the same method.",
        },
        {
          question: "Why avoid an expensive dependency in a controller constructor?",
          options: [
            "It cannot be injected",
            "It is built on every request, even for methods that never use it",
            "Laravel forbids it",
            "It breaks route caching",
          ],
          correctIndex: 1,
          explanation: "Method injection builds it only when that method actually runs.",
        },
        {
          question: "What is the drawback of `app(PaymentGateway::class)` inside a method?",
          options: [
            "It is slower",
            "It hides what the method depends on",
            "It bypasses bindings",
            "It cannot be tested",
          ],
          correctIndex: 1,
          explanation: "A type hint on the signature tells the truth about the method's needs.",
        },
      ],
    },
    {
      id: "reading-the-request",
      title: "Reading data from the Request",
      durationMinutes: 12,
      explanation: "The <b>Request object</b> is Laravel's wrapper around the incoming HTTP request: one object holding the URL, query string, form fields, JSON body, files, headers and cookies. Type-hint `Illuminate\\Http\\Request` on a controller method and Laravel hands it to you.\n\nMost of what you read comes out of the <b>input bag</b>, the merged pool of query-string and body values that `input()` looks in. That is why one method can fetch a value without you knowing which half of the request it arrived in.\n\n```php\nuse Illuminate\\Http\\Request;\n\npublic function store(Request $request)\n{\n    $number = $request->input('number');\n}\n```\n\n---\n\n### 1. Basic — input(), and where it looks\n\n`input()` is the one you will use most:\n\n```php\n$number = $request->input('number');\n$number = $request->input('number', 'INV-000');   // with a default\n```\n\nIt reads from the query string <b>and</b> the body, which is convenient and occasionally surprising. Three narrower methods exist when you care where a value came from:\n\n```php\n$request->query('page');    // URL query string only\n$request->post('number');   // request body only\n$request->input('number');  // either\n```\n\nDot notation reaches into nested data:\n\n```php\n// { \"client\": { \"name\": \"Acme\" }, \"lines\": [{ \"price\": 100 }] }\n$request->input('client.name');    // \"Acme\"\n$request->input('lines.0.price');  // 100\n```\n\nAnd a few checks worth knowing, because they are not the same:\n\n```php\n$request->has('number');       // the key is present, even if empty\n$request->filled('number');    // present AND not empty\n$request->missing('number');   // not present\n```\n\n`has()` returns `true` for an empty text field. `filled()` is what you usually mean.\n\n---\n\n### 2. Intermediate — taking several fields at once\n\n```php\n$data = $request->only(['number', 'client', 'amount']);\n$data = $request->except(['password', '_token']);\n```\n\n<b>Prefer `only()`.</b> The difference matters more than it looks:\n\n```text\nRequest body\n├── number     ✓ you expect this\n├── client     ✓ you expect this\n└── is_admin   ← someone added it to the form data\n\nonly(['number','client'])  → is_admin is dropped\nexcept(['password'])       → is_admin comes through\n```\n\n`except()` is a blocklist, and a blocklist only stops what you thought of. If that array is later passed to `Model::create()`, an unexpected field can end up written to your database. `only()` is an allowlist and cannot have that problem.\n\nDay 9's form requests do this properly with `validated()`, which returns only the fields you wrote rules for. Until then, `only()` is the safe habit.\n\n---\n\n### 3. Advanced — typed accessors\n\nHTTP is all strings. These convert as they read, so your code works with real types:\n\n```php\n$request->boolean('is_paid');           // \"1\" \"true\" \"on\" \"yes\" → true\n$request->integer('quantity');          // \"5\" → 5\n$request->float('amount');              // \"99.50\" → 99.5\n$request->string('number');             // a Stringable, so ->trim()->upper()\n$request->date('due_at');               // a Carbon date object\n$request->enum('status', Status::class); // a PHP enum case\n```\n\n<b>`boolean()`</b> earns its place immediately. An unchecked checkbox sends nothing at all, and a checked one sends `\"on\"`:\n\n```php\n$paid = $request->input('is_paid');     // \"on\", or null. Both are truthy-ish traps.\n$paid = $request->boolean('is_paid');   // true or false. Always.\n```\n\nWriting `if ($request->input('is_paid'))` looks correct and quietly treats the string `\"0\"` as true.\n\n<b>`enum()`</b> is the one that changes how code reads downstream:\n\n```php\nenum Status: string\n{\n    case Draft = 'draft';\n    case Sent  = 'sent';\n    case Paid  = 'paid';\n}\n\n$status = $request->enum('status', Status::class);\n\nif ($status === Status::Paid) { /* ... */ }\n```\n\nComparing against `Status::Paid` cannot be misspelt; comparing against `'paid'` can. Invalid input gives `null` rather than a bad string travelling deeper into your application.\n\nOne thing to be clear about: none of this is validation. `integer('quantity')` on the input `\"abc\"` gives you `0`, not an error. These methods control the <i>type</i> you get; making sure the value is <i>acceptable</i> is Day 9's job.",
      diagram: `Where each accessor looks

  GET /invoices?page=2      body: { "number": "INV-001" }

  $request->query('page')      → query string only
  $request->post('number')     → body only
  $request->input('number')    → either

  Nested data, with dots
  { "client": { "name": "Acme" }, "lines": [{ "price": 100 }] }
       input('client.name')    → "Acme"
       input('lines.0.price')  → 100


only() vs except(): allowlist beats blocklist

  Request body
  ├── number     expected
  ├── client     expected
  └── is_admin   ← nobody put this in the form

  only(['number','client'])   is_admin DROPPED     ✓ allowlist
  except(['password'])        is_admin PASSES      ✗ blocklist

  If that array reaches Model::create(), the difference is a bug.


Typed accessors: HTTP is all strings

  input('is_paid')     "on" / null      ← "0" is truthy-ish trouble
  boolean('is_paid')   true / false     ← always a real bool

  input('status')      "paid"           ← misspellable
  enum('status', ...)  Status::Paid     ← cannot be misspelt

  None of this is validation:
  integer('quantity') on "abc" gives 0, not an error.`,
      codeExample: {
        title: "Every way to read the request",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Enums\\Status;
use Illuminate\\Http\\Request;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        // ---------- Basic reads ----------
        $number = $request->input('number');
        $number = $request->input('number', 'INV-000');     // with a default

        $page   = $request->query('page', 1);               // query string only
        $body   = $request->post('number');                 // body only

        // ---------- Nested, with dot notation ----------
        $client = $request->input('client.name');
        $first  = $request->input('lines.0.price');

        // ---------- Presence checks (these differ) ----------
        $request->has('number');       // key present, even if ""
        $request->filled('number');    // present AND not empty   ← usually this
        $request->missing('number');

        // ---------- Several fields ----------
        // Prefer only(): an allowlist cannot let through a field
        // you never thought about.
        $data = $request->only(['number', 'client', 'amount']);

        // except() is a blocklist. If an unexpected field arrives and
        // this array reaches Model::create(), it gets written.
        $risky = $request->except(['password', '_token']);

        // ---------- Typed accessors ----------
        $isPaid   = $request->boolean('is_paid');            // "on"/"1"/"yes" → true
        $quantity = $request->integer('quantity');           // "5" → 5
        $amount   = $request->float('amount');               // "99.50" → 99.5
        $clean    = $request->string('number')->trim()->upper();
        $dueAt    = $request->date('due_at');                // Carbon instance
        $status   = $request->enum('status', Status::class); // Status::Paid, or null

        // Comparing against an enum case cannot be misspelt.
        if ($status === Status::Paid) {
            // ...
        }

        // ---------- Everything else on the request ----------
        $request->all();
        $request->url();
        $request->fullUrl();
        $request->path();
        $request->method();
        $request->header('X-App-Version');
        $request->cookie('theme');
        $request->user();
        $request->ip();

        return back();
    }
}


// app/Enums/Status.php
enum Status: string
{
    case Draft = 'draft';
    case Sent  = 'sent';
    case Paid  = 'paid';
}`,
      },
      keyTakeaways: [
        "<b>`input()`</b> reads from the query string and the body; `query()` and `post()` narrow it to one.",
        "Dot notation reaches nested values: `input('client.name')`, `input('lines.0.price')`.",
        "<b>`has()` is true for an empty field</b>; `filled()` checks present and not empty, which is usually what you mean.",
        "<b>Prefer `only()` over `except()`.</b> An allowlist cannot pass through a field you never considered.",
        "<b>`boolean()`</b> handles checkboxes correctly: unchecked sends nothing, checked sends `\"on\"`.",
        "<b>`enum()`</b> gives you a case you can compare safely, instead of a string you can misspell.",
        "None of these validate. <b>`integer('abc')` returns `0`</b>, not an error. Validation is Day 9.",
      ],
      commonMistakes: [
        "<b>Using `except()` and passing the result to `Model::create()`.</b> A blocklist only stops fields you thought of, so an unexpected one gets written.",
        "<b>Using `has()` when you mean `filled()`.</b> An empty text field is present, so `has()` returns true and your check passes.",
        "<b>Reading a checkbox with `input()`.</b> Unchecked sends nothing and checked sends `\"on\"`. Use `boolean()`.",
        "<b>Treating typed accessors as validation.</b> `integer()` on `\"abc\"` gives `0` silently, and that zero travels onward.",
        "<b>Using `query()` for form data.</b> A POST body is not the query string, so you get `null` and wonder why.",
      ],
      quiz: [
        {
          question: "What is the difference between `has()` and `filled()`?",
          options: [
            "`has()` is true for an empty field; `filled()` requires a value",
            "They are identical",
            "`filled()` works only on files",
            "`has()` checks the query string only",
          ],
          correctIndex: 0,
          explanation: "An empty text input is present, so `has()` returns true.",
        },
        {
          question: "Why prefer `only()` over `except()`?",
          options: [
            "It is faster",
            "`except()` is deprecated",
            "An allowlist cannot let through a field you never considered",
            "`only()` validates the data",
          ],
          correctIndex: 2,
          explanation: "That matters most when the array is passed on to `Model::create()`.",
        },
        {
          question: "How should you read a checkbox?",
          options: [
            "`input('is_paid')`",
            "`has('is_paid')`",
            "`string('is_paid')`",
            "`boolean('is_paid')`",
          ],
          correctIndex: 3,
          explanation: "Unchecked sends nothing at all and checked sends the string \"on\".",
        },
        {
          question: "What does `$request->integer('quantity')` return for the input `\"abc\"`?",
          options: [
            "0",
            "null",
            "An exception",
            "\"abc\"",
          ],
          correctIndex: 0,
          explanation: "These accessors convert types; they do not validate.",
        },
      ],
    },
    {
      id: "old-input-and-files",
      title: "Old input, flashing and file uploads",
      durationMinutes: 11,
      explanation: "Two things every real form needs: keeping what the user typed when something goes wrong, and handling uploads.\n\n<b>Old input</b> is the previous request's input, kept for exactly one request so a rejected form can be refilled with what the user already typed. It gets there by <b>flashing</b>, which means putting data in the session for the next request only and then discarding it.\n\n---\n\n### 1. Basic — why forms empty themselves\n\nA user fills in eight fields, submits, and one is invalid. You redirect back with an error. Every field is blank and they have to start again.\n\nThe fix is <b>old input</b>:\n\n```php\nreturn back()->withInput();\n```\n\nThen in Blade:\n\n```blade\n<input name=\"number\" value=\"{{ old('number') }}\">\n```\n\n```text\nForm → submit → validation fails → redirect back\n                                        ↓\n                              input kept in session\n                                        ↓\n                          old('number') fills the field\n```\n\nTwo details make this work properly:\n\n```blade\n{{-- Second argument is the fallback, which is how edit forms work --}}\n<input name=\"number\" value=\"{{ old('number', $invoice->number) }}\">\n```\n\nOn a fresh edit form there is no old input, so the model's value shows. After a failed submit, what the user typed wins. One line covers both.\n\nThe good news is that Laravel's validation does `withInput()` for you. When Day 9's form requests fail, old input is already there; you only need `old()` in the template.\n\n---\n\n### 2. Intermediate — flashing, and what not to flash\n\nOld input is one use of the session's <b>flash</b> storage:\n\n```php\n$request->flash();                          // everything\n$request->flashOnly(['number', 'client']);  // just these\n$request->flashExcept(['password']);        // all but these\n```\n\nSame allowlist argument as before: `flashOnly()` is safer than `flashExcept()`.\n\nLaravel already excludes some fields from ever being flashed, `password` and `password_confirmation` among them, configured in `bootstrap/app.php`:\n\n```php\n$middleware->dontFlash(['current_password', 'password', 'password_confirmation']);\n```\n\nAdd anything else sensitive to that list: card numbers, tokens, national ID numbers. Flashed input goes into the session store, so a value that should never be written to disk should never be flashed.\n\nThe same mechanism carries success messages:\n\n```php\nreturn redirect()->route('invoices.index')->with('success', 'Invoice created.');\n```\n\n```blade\n@if (session('success'))\n    <div class=\"alert\">{{ session('success') }}</div>\n@endif\n```\n\n---\n\n### 3. Advanced — file uploads\n\nA form must declare an encoding type, or files silently never arrive:\n\n```blade\n<form method=\"POST\" action=\"/invoices\" enctype=\"multipart/form-data\">\n```\n\nLeave off `enctype` and `$request->file('attachment')` is `null`, with no error explaining why. It is the first thing to check when an upload \"does not work\".\n\nThen:\n\n```php\nif ($request->hasFile('attachment')) {\n    $path = $request->file('attachment')->store('attachments', 'public');\n}\n```\n\n`store()` generates a unique filename and returns the path to save in your database:\n\n```text\nquarterly report.pdf\n        ↓\nstore('attachments', 'public')\n        ↓\nattachments/9xKp2mQ1vB8nR4tY.pdf\n```\n\nThat generated name is a feature, not an inconvenience. Using the original filename invites two problems: two users uploading `invoice.pdf` overwrite each other, and a crafted filename can escape the directory you intended.\n\nUseful methods before storing:\n\n```php\n$file = $request->file('attachment');\n\n$file->getClientOriginalName();   // what the user called it (untrusted)\n$file->getClientOriginalExtension();\n$file->getSize();                 // bytes\n$file->getMimeType();\n$file->isValid();\n```\n\nTreat `getClientOriginalName()` as untrusted text. It comes from the client. Store it in a database column if you want to show a friendly name, but never use it to build a path.\n\nThe <b>disk</b> decides where the file physically goes:\n\n```text\n'local'   storage/app/private/   not reachable over the web\n'public'  storage/app/public/    reachable, after storage:link\n's3'      Amazon S3\n```\n\nFor `public` files to actually be reachable you need the symlink:\n\n```bash\nphp artisan storage:link\n```\n\nMiss that and every uploaded image 404s while the file sits happily on disk. It is a one-time command per environment, and forgetting it on a new server is common.\n\nChoose deliberately: an invoice attachment probably belongs on `local`, served through a controller that checks the user may see it. `public` means anyone with the URL can read it.",
      diagram: `Old input keeps the form filled

  Form filled in → submit → validation fails → redirect back
                                                    ↓
                                        input flashed to session
                                                    ↓
                                       old('number') repopulates

  <input value="{{ old('number', $invoice->number) }}">
                        │            │
                  after a failure    fresh edit form
                  the typed value    the model value

  Laravel's validation calls withInput() for you.


Uploads: the two things that silently fail

  1. Missing enctype
     <form method="POST">                        file() → null
     <form method="POST" enctype="multipart/form-data">   ✓

  2. Missing symlink
     store('attachments', 'public')  → file written fine
     <img src="/storage/...">        → 404
     php artisan storage:link        → ✓  (once per environment)


Disks decide reachability

  local    storage/app/private/   NOT reachable over the web
  public   storage/app/public/    reachable (after storage:link)
  s3       Amazon S3

  An invoice attachment on 'public' is readable by anyone
  with the URL. That is a decision, not a default.`,
      codeExample: {
        title: "Old input, flashing, and a real upload",
        code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        // ---------- Keep the user's input if we send them back ----------
        if (! $request->filled('number')) {
            return back()
                ->withInput()                       // flash it for one request
                ->with('error', 'An invoice number is required.');
        }

        // Flash a subset instead. Allowlist beats blocklist here too.
        // $request->flashOnly(['number', 'client']);

        // ---------- File upload ----------
        $path = null;

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');

            // The original name is CLIENT-SUPPLIED. Never build a path from it.
            $originalName = $file->getClientOriginalName();

            // store() generates a unique name and returns the path to save.
            // 'local' is not reachable over the web, which is what an
            // invoice attachment usually wants.
            $path = $file->store('attachments', 'local');
        }

        // ... create the invoice, saving $path and $originalName ...

        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice created.');
    }

    // Serving a private file through a controller, so access can be checked.
    public function attachment(string $invoice)
    {
        // ... check the user may see this invoice ...

        return response()->file(storage_path('app/private/attachments/x.pdf'));
    }
}
?>

{{-- resources/views/invoices/create.blade.php --}}

{{-- Without enctype, files silently never arrive. --}}
<form method="POST" action="{{ route('invoices.store') }}" enctype="multipart/form-data">
    @csrf

    {{-- old() first, the model value as fallback: works for create AND edit --}}
    <input name="number" value="{{ old('number', $invoice->number ?? '') }}">

    <input type="file" name="attachment">

    <button type="submit">Save</button>
</form>

@if (session('success'))
    <div class="alert">{{ session('success') }}</div>
@endif
?>

<?php
// bootstrap/app.php — never flash these into the session
$middleware->dontFlash([
    'current_password',
    'password',
    'password_confirmation',
    'card_number',      // add your own
]);

// Once per environment, or every public upload 404s:
//   php artisan storage:link`,
      },
      keyTakeaways: [
        "<b>`back()->withInput()`</b> flashes the input so a failed form does not empty itself.",
        "<b>`old('number', $invoice->number)`</b> covers both cases: the typed value after a failure, the model value on a fresh edit form.",
        "Laravel's validation calls `withInput()` for you, so form requests need only `old()` in the template.",
        "Flashed data lives in the session for <b>one request</b>; add sensitive fields to `dontFlash`.",
        "A form uploading files <b>must</b> have `enctype=\"multipart/form-data\"`, or `file()` is silently null.",
        "<b>`store()` generates a unique filename</b>, which prevents collisions and path traversal. Never build a path from the client's filename.",
        "The <b>disk</b> decides reachability: `local` is private, `public` needs `php artisan storage:link` or every file 404s.",
      ],
      commonMistakes: [
        "<b>Forgetting `enctype=\"multipart/form-data\"`.</b> The upload silently never arrives and `hasFile()` is false, with nothing to explain it.",
        "<b>Forgetting `php artisan storage:link`.</b> Files are written correctly and every URL 404s.",
        "<b>Using the client's filename as the stored path.</b> Two users overwrite each other, and a crafted name can escape the directory.",
        "<b>Writing `old('number')` with no fallback on an edit form.</b> The field renders empty until the user submits once.",
        "<b>Flashing a whole request that contains a card number or token.</b> It goes into the session store. Use `flashOnly()` and `dontFlash`.",
        "<b>Putting private uploads on the `public` disk.</b> Anyone with the URL can read them, with no permission check anywhere.",
      ],
      quiz: [
        {
          question: "Why does `old('number', $invoice->number)` take a second argument?",
          options: [
            "For type safety",
            "To set a placeholder",
            "So an edit form shows the model value when there is no old input",
            "It is required syntax",
          ],
          correctIndex: 2,
          explanation: "One line then works for both create and edit forms.",
        },
        {
          question: "A file upload silently never arrives. What is the first thing to check?",
          options: [
            "The disk configuration",
            "`storage:link`",
            "The form's `enctype=\"multipart/form-data\"`",
            "The file size limit",
          ],
          correctIndex: 2,
          explanation: "Without it `$request->file()` is null and nothing explains why.",
        },
        {
          question: "Why does `store()` generate its own filename?",
          options: [
            "To save space",
            "It is required by S3",
            "To make files sortable",
            "To prevent collisions and path traversal from client-supplied names",
          ],
          correctIndex: 3,
          explanation: "Two users uploading `invoice.pdf` would otherwise overwrite each other.",
        },
        {
          question: "You stored a file on the `public` disk and its URL 404s. What is missing?",
          options: [
            "A route definition",
            "`php artisan cache:clear`",
            "The `enctype` attribute",
            "`php artisan storage:link`",
          ],
          correctIndex: 3,
          explanation: "The file is on disk; the symlink making it reachable is not there.",
        },
      ],
    },
    {
      id: "responses",
      title: "Response types, headers and cookies",
      durationMinutes: 12,
      explanation: "A controller's return value becomes an HTTP response. Laravel accepts several shapes and converts each one sensibly.\n\nA <b>response</b> is the object Laravel sends back to the client, carrying a status code, headers and a body. Returning a string, an array or a view is shorthand: each one gets wrapped in a response object before it leaves your application.\n\n---\n\n### 1. Basic — the shapes you return most\n\n```php\nreturn 'Hello';                                  // plain text\nreturn ['name' => 'Acme'];                       // array → JSON automatically\nreturn view('invoices.index', ['invoices' => $invoices]);   // HTML\nreturn response()->json(['message' => 'Created'], 201);     // JSON, explicit\n```\n\nReturning an array works because Laravel converts arrays and anything `Jsonable` into a JSON response for you. It is fine for a quick endpoint.\n\nReach for `response()->json()` when you need anything more: a status code, headers, or simply to make the intent obvious to the next reader.\n\n```text\nreturn ['ok' => true];                    200, JSON, inferred\nreturn response()->json(['ok' => true], 201);   explicit, with a status\n```\n\n---\n\n### 2. Intermediate — files, downloads and streams\n\nThree different things, and the difference is what the browser does with them.\n\n<b>`file()`</b> sends the contents and lets the browser decide. A PDF or image opens in the tab:\n\n```php\nreturn response()->file(storage_path('app/invoices/INV-001.pdf'));\n```\n\n<b>`download()`</b> sends a `Content-Disposition: attachment` header, which tells the browser to save it. You can also give it a friendly name:\n\n```php\nreturn response()->download($path, 'Invoice INV-001.pdf');\n```\n\nThis pairing is where the unique filenames from the last lesson pay off. The file on disk is `9xKp2mQ1vB8n.pdf`; the user downloads `Invoice INV-001.pdf`.\n\n<b>`streamDownload()`</b> generates the content as it sends, instead of building it all in memory first:\n\n```php\nreturn response()->streamDownload(function () {\n    $out = fopen('php://output', 'w');\n    foreach (Invoice::cursor() as $invoice) {\n        fputcsv($out, [$invoice->number, $invoice->total]);\n    }\n    fclose($out);\n}, 'invoices.csv');\n```\n\nThe reason to care: building a 200,000-row CSV in a string means holding all of it in memory at once, and that is how an export takes down a server. Streaming writes each row and forgets it.\n\n```text\nNormal      build the WHOLE response → then send it\nStreamed    send a piece → forget it → send the next\n```\n\n---\n\n### 3. Advanced — headers and cookies\n\nAny response can carry headers:\n\n```php\nreturn response('Done')\n    ->header('X-App-Version', '1.0')\n    ->header('Cache-Control', 'no-store');\n\nreturn response('Done')->withHeaders([\n    'X-App-Version' => '1.0',\n    'X-Request-Id'  => $id,\n]);\n```\n\nCookies attach the same way:\n\n```php\nreturn response('Done')->cookie('theme', 'dark', 60);   // minutes\n```\n\nThree things about Laravel cookies are worth knowing, because they explain surprising behaviour.\n\nThey are <b>encrypted by default</b>. Laravel's `EncryptCookies` middleware encrypts on the way out and decrypts on the way in, so a cookie your JavaScript sets is not readable by PHP in the way you expect, and vice versa. If a cookie must be readable by client-side code, it has to be excepted from that middleware.\n\nThey are <b>queued as well as attached</b>. `Cookie::queue('theme', 'dark', 60)` attaches to whatever response is eventually sent, which is what you want when setting a cookie before a redirect.\n\nAnd they respect the flags in `config/session.php`. `http_only` prevents JavaScript reading a cookie, `secure` sends it only over HTTPS, and `same_site` controls whether it travels on cross-site requests. Anything holding a session or a token wants `http_only` on.\n\nThe `response()` helper with no arguments gives you a blank response to build up, which is the general escape hatch:\n\n```php\nreturn response('', 204);                     // no content\nreturn response()->noContent();               // the same, more readable\nreturn response($pdfBytes, 200)->header('Content-Type', 'application/pdf');\n```",
      diagram: `What a controller can return

  return 'text';                    plain text, 200
  return ['ok' => true];            array → JSON, 200, inferred
  return view('invoices.index');    HTML from Blade
  return response()->json([...], 201);   JSON with a chosen status
  return response()->file($path);        browser DISPLAYS it
  return response()->download($path);    browser SAVES it
  return response()->streamDownload(...) sent as it is generated
  return redirect()->route(...);         go somewhere else
  return response()->noContent();        204, empty body


file() vs download()

  file()       Content-Type only            PDF opens in the tab
  download()   + Content-Disposition        browser saves it
               attachment; filename="..."   and you choose the name

  Disk:      9xKp2mQ1vB8n.pdf     ← unique, safe
  Downloads: Invoice INV-001.pdf  ← friendly


Why stream a big export

  NORMAL                          STREAMED
  build all 200,000 rows          write a row → forget it
  hold it in memory               write a row → forget it
  then send                       ...
        ↓                               ↓
  memory exhausted                constant memory


Laravel cookies are encrypted by default

  PHP sets it  → EncryptCookies encrypts → browser stores ciphertext
  JS reads it  → gets ciphertext, not your value

  Needs to be readable by JavaScript? Except it from that middleware.`,
      codeExample: {
        title: "Every response type worth knowing",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Invoice;
use Illuminate\\Support\\Facades\\Cookie;

class InvoiceController extends Controller
{
    public function index()
    {
        // ---------- The common shapes ----------
        return view('invoices.index', ['invoices' => Invoice::all()]);
    }

    public function apiIndex()
    {
        // An array becomes JSON automatically.
        return ['data' => Invoice::all()];

        // Explicit is better when you need a status or headers.
        // return response()->json(['data' => []], 200);
    }

    public function store()
    {
        return response()->json(['message' => 'Invoice created'], 201);
    }

    // ---------- Files ----------
    public function preview(Invoice $invoice)
    {
        // Browser DISPLAYS it: a PDF opens in the tab.
        return response()->file(storage_path("app/invoices/{$invoice->file}"));
    }

    public function download(Invoice $invoice)
    {
        // Browser SAVES it, under a name of your choosing.
        // The file on disk keeps its safe generated name.
        return response()->download(
            storage_path("app/invoices/{$invoice->file}"),
            "Invoice {$invoice->number}.pdf",
        );
    }

    // ---------- Streaming a large export ----------
    public function export()
    {
        // Building 200,000 rows in a string would hold them all in
        // memory. This writes each row and forgets it.
        return response()->streamDownload(function () {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Number', 'Client', 'Total']);

            foreach (Invoice::cursor() as $invoice) {
                fputcsv($out, [$invoice->number, $invoice->client, $invoice->total]);
            }

            fclose($out);
        }, 'invoices.csv');
    }

    // ---------- Headers and cookies ----------
    public function withExtras()
    {
        return response('Done')
            ->withHeaders([
                'X-App-Version' => '1.0',
                'Cache-Control' => 'no-store',
            ])
            ->cookie('theme', 'dark', 60);      // minutes
    }

    public function beforeRedirect()
    {
        // Queued cookies attach to whatever response is finally sent,
        // which is what you want before a redirect.
        Cookie::queue('theme', 'dark', 60);

        return redirect()->route('invoices.index');
    }

    public function nothing()
    {
        return response()->noContent();          // 204, empty body
    }
}`,
      },
      keyTakeaways: [
        "Returning a <b>string</b> gives text, an <b>array</b> becomes JSON, and a <b>view</b> becomes HTML.",
        "Use `response()->json()` when you need a status code, headers, or clearer intent.",
        "<b>`file()` displays</b> in the browser; <b>`download()` saves</b>, and lets you set a friendly filename.",
        "<b>`streamDownload()`</b> sends content as it is generated, so a huge export does not sit in memory.",
        "Attach headers with `->header()` or `->withHeaders([...])`.",
        "Laravel <b>encrypts cookies by default</b>, so JavaScript cannot read one your PHP set without an exception.",
        "`Cookie::queue()` attaches to whatever response is finally sent, which is what a redirect needs.",
        "`response()->noContent()` returns a 204 for actions with nothing to say.",
      ],
      commonMistakes: [
        "<b>Building a large export in a string.</b> Two hundred thousand rows in memory is how an export takes down a server. Stream it.",
        "<b>Using `file()` when you meant `download()`.</b> The browser displays a CSV as text instead of saving it.",
        "<b>Expecting JavaScript to read a Laravel cookie.</b> It is encrypted, so JS sees ciphertext unless the cookie is excepted.",
        "<b>Setting a cookie on a response you then discard.</b> Before a redirect, use `Cookie::queue()` so it attaches to the real response.",
        "<b>Returning 200 with an empty body for a delete.</b> `noContent()` says 204, which is what a client expects.",
        "<b>Using the client's original filename in `download()` without cleaning it.</b> It is untrusted text and ends up in a header.",
      ],
      quiz: [
        {
          question: "What is the difference between `file()` and `download()`?",
          options: [
            "`file()` displays in the browser; `download()` tells it to save",
            "`download()` is faster",
            "`file()` only works for images",
            "There is none",
          ],
          correctIndex: 0,
          explanation: "`download()` sends a Content-Disposition attachment header.",
        },
        {
          question: "Why use `streamDownload()` for a large CSV?",
          options: [
            "It compresses the file",
            "It is required for CSV",
            "It is faster to write",
            "It sends rows as they are generated instead of holding them all in memory",
          ],
          correctIndex: 3,
          explanation: "Building the whole export as a string is how a server runs out of memory.",
        },
        {
          question: "Why can JavaScript not read a cookie your Laravel app set?",
          options: [
            "Cookies are server-only",
            "Laravel encrypts cookies by default",
            "The browser blocks it",
            "It needs a header",
          ],
          correctIndex: 1,
          explanation: "The cookie must be excepted from EncryptCookies to be readable client-side.",
        },
        {
          question: "You need to set a cookie and then redirect. What should you use?",
          options: [
            "`response()->cookie()` on a response you discard",
            "`session()->put()`",
            "`Cookie::queue()`",
            "A header",
          ],
          correctIndex: 2,
          explanation: "A queued cookie attaches to whatever response is finally sent.",
        },
      ],
    },
    {
      id: "redirects-and-status",
      title: "Redirects, status codes and abort()",
      durationMinutes: 12,
      explanation: "How a controller ends: sending the user somewhere, or stopping with an error.\n\nA <b>redirect</b> is a response that tells the browser to go somewhere else instead of rendering anything itself. An <b>HTTP status code</b> is the three-digit number on every response saying how the request went: 200 fine, 302 go here instead, 404 no such thing, 500 the server failed. <b>abort()</b> stops the request there and then with an error response, so nothing after it in the method runs.\n\n---\n\n### 1. Basic — the redirect family\n\n```php\nreturn redirect('/invoices');                                // a URL\nreturn redirect()->route('invoices.show', $invoice);         // a named route\nreturn redirect()->action([InvoiceController::class, 'index']);\nreturn back();                                               // where they came from\nreturn redirect()->away('https://stripe.com/checkout');      // off-site\n```\n\nPrefer the named-route form. Day 5's argument applies unchanged: `redirect('/invoices/'.$id)` breaks silently when the URL changes, and `redirect()->route('invoices.show', $invoice)` does not.\n\n`away()` exists because the others prepend your application's URL. It is the only one that should ever receive a URL from user input, and even then, only after checking it against a list of hosts you trust. An open redirect, where your domain will forward anyone anywhere, is a real phishing vector.\n\n---\n\n### 2. Intermediate — the pattern behind almost every form\n\nThis shape appears in every Laravel application:\n\n```php\nreturn redirect()\n    ->route('invoices.show', $invoice)\n    ->with('success', 'Invoice created.');\n```\n\n```blade\n@if (session('success'))\n    <div class=\"alert\">{{ session('success') }}</div>\n@endif\n```\n\nThe redirect matters more than the message. After a successful POST you should redirect rather than return HTML, because a page rendered directly from a POST re-submits when the user hits refresh, and they create a second invoice by accident. Redirecting means refresh re-runs a harmless GET.\n\n```text\nPOST /invoices → render HTML     refresh → POSTS AGAIN → duplicate\nPOST /invoices → redirect → GET  refresh → harmless GET\n```\n\nThe failure counterpart, which validation does for you:\n\n```php\nreturn back()->withInput()->withErrors(['number' => 'That number is taken.']);\n```\n\n---\n\n### 3. Advanced — status codes and abort()\n\nThe codes worth knowing, and what each actually claims:\n\n```text\n200 OK              here is what you asked for\n201 Created         a new resource exists, at the Location header\n204 No Content      it worked, there is nothing to send back\n301 Moved           permanently, and browsers CACHE this\n302 Found           temporary redirect (Laravel's default)\n400 Bad Request     malformed\n401 Unauthenticated we do not know who you are      → log in\n403 Forbidden       we know who you are, and no     → do not retry\n404 Not Found       no such thing\n409 Conflict        clashes with the current state\n422 Unprocessable   well-formed but failed validation\n429 Too Many        rate limited\n500 Server Error    we broke\n```\n\nTwo pairs cause most of the confusion.\n\n<b>401 vs 403.</b> 401 means \"we do not know who you are\", so logging in would help. 403 means \"we know exactly who you are and the answer is still no\". Returning 401 for a permissions failure sends API clients into a pointless re-authentication loop.\n\n<b>301 vs 302.</b> Browsers cache a 301 aggressively, sometimes indefinitely. Ship a wrong 301 and returning visitors keep following it even after you fix the server. Use 302 unless you are certain the move is permanent.\n\n`abort()` stops the request from wherever you are, by throwing:\n\n```php\nabort(404);\nabort(403, 'This invoice belongs to another client.');\nabort_if($invoice->isPaid(), 409, 'Already paid.');\nabort_unless($user->can('view', $invoice), 403);\n```\n\nBecause it throws rather than returns, it works from a service several calls deep, and Laravel converts it to an HTML error page or a JSON body depending on what the client asked for.\n\n`abort_if` and `abort_unless` are worth adopting. They turn a four-line guard into one that reads as a sentence:\n\n```php\nif ($invoice->isPaid()) {\n    abort(409, 'Already paid.');\n}\n// becomes\nabort_if($invoice->isPaid(), 409, 'Already paid.');\n```\n\nOne thing to be careful about: an `abort()` message is shown to the user. Keep it useful and free of internal detail.\n\nFinally, recent Laravel versions allow declaring authorization on a controller method with an attribute:\n\n```php\n#[Authorize('update', 'invoice')]\npublic function update(Request $request, Invoice $invoice) { /* ... */ }\n```\n\nThe policy behind it arrives on Day 17. The trade-off is the same one from Day 6's middleware attributes: proximity against auditability.",
      diagram: `Redirect, do not render, after a POST

  POST /invoices → render HTML directly
        ↓
  user hits refresh
        ↓
  the POST is re-sent → a SECOND invoice

  POST /invoices → redirect → GET /invoices/10
        ↓
  user hits refresh
        ↓
  harmless GET

  return redirect()->route('invoices.show', $invoice)
                   ->with('success', 'Invoice created.');


The two pairs people get wrong

  401 Unauthenticated     "we do not know who you are"   → logging in helps
  403 Forbidden           "we know, and the answer is no" → do not retry

  Sending 401 for a permissions failure puts API clients
  into a re-authentication loop that can never succeed.

  301 Moved Permanently   browsers CACHE this, sometimes forever
  302 Found               temporary; Laravel's default

  A wrong 301 keeps redirecting returning visitors
  long after you have fixed the server.


abort() throws, so it works from anywhere

  Controller → Service → deep helper
                              ↓
                        abort(403)
                              ↓
              Laravel catches it and renders
              an HTML page or JSON, to match the client`,
      codeExample: {
        title: "Redirects, statuses and guards",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Invoice;
use Illuminate\\Http\\Request;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        $invoice = Invoice::create($request->only(['number', 'client']));

        // Redirect after a POST, so a refresh does not create a second one.
        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice created.');
    }

    public function update(Request $request, Invoice $invoice)
    {
        // Guards that read as sentences.
        abort_if($invoice->isPaid(), 409, 'That invoice is already paid.');
        abort_unless($request->user()->owns($invoice), 403);

        $invoice->update($request->only(['client']));

        return back()->with('success', 'Invoice updated.');
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice deleted.');
    }

    // ---------- API equivalents ----------
    public function apiStore(Request $request)
    {
        $invoice = Invoice::create($request->only(['number']));

        // 201 Created, pointing at the new resource.
        return response()
            ->json($invoice, 201)
            ->header('Location', route('invoices.show', $invoice));
    }

    public function apiDestroy(Invoice $invoice)
    {
        $invoice->delete();

        return response()->noContent();          // 204
    }

    // ---------- Redirecting off-site ----------
    public function checkout()
    {
        // away() does not prepend your app URL. Never hand it a URL that
        // came from user input without checking it against trusted hosts,
        // or your domain becomes an open redirect for phishing.
        return redirect()->away('https://stripe.com/checkout/abc123');
    }
}


// ---------- 401 vs 403 ----------
// abort(401)  we do not know who you are   → logging in would help
// abort(403)  we know, and the answer is no → retrying will never help

// ---------- 301 vs 302 ----------
// return redirect('/new', 301);   browsers CACHE this, possibly forever
// return redirect('/new');        302 by default, safe to change later`,
      },
      keyTakeaways: [
        "Prefer <b>`redirect()->route(...)`</b> over a hard-coded URL, for the same reason as Day 5.",
        "<b>Redirect after a successful POST.</b> Rendering HTML directly means a refresh re-submits and duplicates the record.",
        "`->with('success', ...)` flashes a message the next page reads from `session('success')`.",
        "<b>401 means we do not know you; 403 means we do and the answer is no.</b> Confusing them sends API clients into a retry loop.",
        "<b>Browsers cache a 301.</b> Use 302 unless the move is genuinely permanent.",
        "<b>`abort()` throws</b>, so it works from deep in a service and renders HTML or JSON to match the client.",
        "`abort_if()` and `abort_unless()` turn a multi-line guard into one readable line.",
        "<b>`away()`</b> is the only redirect that leaves your app, so never hand it unchecked user input.",
      ],
      commonMistakes: [
        "<b>Returning a view directly from a POST.</b> The user refreshes and creates a duplicate record with no warning.",
        "<b>Returning 401 when you mean 403.</b> The client re-authenticates, succeeds, and is refused again, forever.",
        "<b>Using a 301 for a redirect you might change.</b> Browsers cache it, so returning visitors keep following the old one after you fix it.",
        "<b>Passing user input to `away()`.</b> Your domain becomes an open redirect and a convenient phishing hop.",
        "<b>Putting internal detail in an `abort()` message.</b> It is displayed to the user, exception traces and all.",
        "<b>Hard-coding a redirect URL.</b> It keeps working until the route changes, then fails silently at runtime.",
      ],
      quiz: [
        {
          question: "Why redirect instead of rendering HTML after a successful POST?",
          options: [
            "It is faster",
            "HTML cannot be returned from POST",
            "A refresh would otherwise re-submit the POST and duplicate the record",
            "It is required for CSRF",
          ],
          correctIndex: 2,
          explanation: "After a redirect, refreshing re-runs a harmless GET.",
        },
        {
          question: "What is the difference between 401 and 403?",
          options: [
            "401 is for APIs only",
            "401 means we do not know who you are; 403 means we do and still refuse",
            "403 is a server error",
            "They are interchangeable",
          ],
          correctIndex: 1,
          explanation: "Returning 401 for a permissions failure causes pointless re-authentication.",
        },
        {
          question: "Why prefer a 302 over a 301?",
          options: [
            "302 is faster",
            "Browsers cache a 301, sometimes indefinitely",
            "301 is deprecated",
            "302 works with more clients",
          ],
          correctIndex: 1,
          explanation: "A wrong 301 keeps redirecting returning visitors after you fix it.",
        },
        {
          question: "Why does `abort()` work from deep inside a service?",
          options: [
            "It returns a response",
            "Services get special handling",
            "It writes to the session",
            "It throws an exception Laravel catches centrally",
          ],
          correctIndex: 3,
          explanation: "Which is also why it can render HTML or JSON to match the client.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why do closure routes cause a problem at deploy time?",
      options: [
        "They are slow",
        "They break CSRF",
        "`route:cache` cannot serialise them and fails",
        "They cannot use middleware",
      ],
      correctIndex: 2,
      explanation: "One closure anywhere blocks route caching for the whole application.",
    },
    {
      question: "What makes a controller invokable?",
      options: [
        "A single `__invoke()` method",
        "An attribute",
        "A special base class",
        "Registration in a provider",
      ],
      correctIndex: 0,
      explanation: "The route then names the class alone, with no method.",
    },
    {
      question: "Which of these belongs in a controller?",
      options: [
        "Deciding whether to return a view or JSON",
        "Calculating tax",
        "Querying the database directly",
        "Formatting currency",
      ],
      correctIndex: 0,
      explanation: "Choosing the response type is an HTTP concern.",
    },
    {
      question: "Which two resource methods only show a form?",
      options: [
        "`index` and `show`",
        "`create` and `edit`",
        "`show` and `edit`",
        "`store` and `update`",
      ],
      correctIndex: 1,
      explanation: "They pair with `store` and `update`, which receive those forms.",
    },
    {
      question: "Why does `--api` generate five methods rather than seven?",
      options: [
        "An API has no forms, so `create` and `edit` have nothing to do",
        "APIs are read-only",
        "Performance",
        "APIs cannot delete",
      ],
      correctIndex: 0,
      explanation: "Those two exist purely to return HTML forms.",
    },
    {
      question: "You need a `markPaid` action. What is usually better than an eighth method?",
      options: [
        "`Route::any`",
        "Middleware",
        "Treating it as `PaymentController::store`",
        "A closure route",
      ],
      correctIndex: 2,
      explanation: "The URL becomes POST /invoices/10/payments, which describes what happens.",
    },
    {
      question: "When should a dependency go in the controller constructor?",
      options: [
        "Always",
        "Never",
        "When most methods need it and it is cheap to build",
        "Only for the Request",
      ],
      correctIndex: 2,
      explanation: "The constructor runs on every request to the controller.",
    },
    {
      question: "In `update(Request $request, Invoice $invoice)`, where does `$invoice` come from?",
      options: [
        "The request body",
        "The container",
        "The session",
        "Route model binding",
      ],
      correctIndex: 3,
      explanation: "Two different mechanisms fill arguments on the same method.",
    },
    {
      question: "What is the difference between `has()` and `filled()`?",
      options: [
        "`has()` is true for an empty field; `filled()` requires a value",
        "They are identical",
        "`filled()` works only on files",
        "`has()` checks the query string only",
      ],
      correctIndex: 0,
      explanation: "An empty text input is present, so `has()` returns true.",
    },
    {
      question: "Why prefer `only()` over `except()`?",
      options: [
        "It is faster",
        "An allowlist cannot let through a field you never considered",
        "`except()` is deprecated",
        "`only()` validates",
      ],
      correctIndex: 1,
      explanation: "That matters most when the array is passed to `Model::create()`.",
    },
    {
      question: "How should you read a checkbox from the request?",
      options: [
        "`input()`",
        "`boolean()`",
        "`has()`",
        "`string()`",
      ],
      correctIndex: 1,
      explanation: "Unchecked sends nothing and checked sends the string \"on\".",
    },
    {
      question: "What does `$request->integer('quantity')` return for `\"abc\"`?",
      options: [
        "An exception",
        "\"abc\"",
        "null",
        "0",
      ],
      correctIndex: 3,
      explanation: "Typed accessors convert; they do not validate.",
    },
    {
      question: "A file upload silently never arrives. What is the first thing to check?",
      options: [
        "The disk",
        "`storage:link`",
        "File permissions",
        "The `enctype=\"multipart/form-data\"` attribute",
      ],
      correctIndex: 3,
      explanation: "Without it `$request->file()` is null and nothing explains why.",
    },
    {
      question: "Why does `store()` generate its own filename?",
      options: [
        "To prevent collisions and path traversal from client-supplied names",
        "To save space",
        "For sorting",
        "S3 requires it",
      ],
      correctIndex: 0,
      explanation: "Two users uploading `invoice.pdf` would otherwise overwrite each other.",
    },
    {
      question: "A file stored on the `public` disk 404s at its URL. What is missing?",
      options: [
        "The enctype attribute",
        "A route",
        "`cache:clear`",
        "`php artisan storage:link`",
      ],
      correctIndex: 3,
      explanation: "The file is written; the symlink making it reachable is not there.",
    },
    {
      question: "What is the difference between `file()` and `download()`?",
      options: [
        "`download()` is faster",
        "`file()` displays in the browser; `download()` tells it to save",
        "`file()` is images only",
        "None",
      ],
      correctIndex: 1,
      explanation: "`download()` sends a Content-Disposition attachment header.",
    },
    {
      question: "Why use `streamDownload()` for a large export?",
      options: [
        "It compresses",
        "It sends rows as generated instead of holding them all in memory",
        "It is required for CSV",
        "It is faster to write",
      ],
      correctIndex: 1,
      explanation: "Building the whole export as a string is how a server runs out of memory.",
    },
    {
      question: "Why can JavaScript not read a cookie your Laravel app set?",
      options: [
        "Browsers block it",
        "It needs a header",
        "Cookies are server-only",
        "Laravel encrypts cookies by default",
      ],
      correctIndex: 3,
      explanation: "The cookie must be excepted from EncryptCookies to be readable client-side.",
    },
    {
      question: "Why redirect rather than render HTML after a successful POST?",
      options: [
        "Speed",
        "CSRF requires it",
        "A refresh would re-submit the POST and duplicate the record",
        "HTML cannot be returned from POST",
      ],
      correctIndex: 2,
      explanation: "After a redirect, refreshing re-runs a harmless GET.",
    },
    {
      question: "What is the difference between 401 and 403?",
      options: [
        "401 means we do not know you; 403 means we do and still refuse",
        "403 is a server error",
        "They are interchangeable",
        "401 is API-only",
      ],
      correctIndex: 0,
      explanation: "Returning 401 for a permissions failure causes pointless re-authentication.",
    },
    {
      question: "Why prefer 302 over 301 unless you are certain?",
      options: [
        "302 is faster",
        "Browsers cache a 301, sometimes indefinitely",
        "301 is deprecated",
        "302 has wider support",
      ],
      correctIndex: 1,
      explanation: "A wrong 301 keeps redirecting returning visitors after you fix it.",
    },
    {
      question: "Why does `abort()` work from deep inside a service?",
      options: [
        "Services are special",
        "It returns a response",
        "It throws an exception Laravel catches centrally",
        "It writes to the session",
      ],
      correctIndex: 2,
      explanation: "Which is also why it renders HTML or JSON to match the client.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Fill in the controller properly: real input, uploads, and the right responses.",
    brief: "Day 5 gave InvoiceHub seven resource routes, and most of the methods behind them still just redirect. Today you make them real.\n\nThere is still no database, so keep the hard-coded array in a service and treat it as your store for now. Everything you build today, reading input, handling an upload, redirecting with a flash message, choosing status codes, survives Day 12 unchanged when Eloquent arrives. Validation comes on Day 9, so read input directly and accept that it is not yet safe.",
    steps: [
      "Move your hard-coded invoices into an `InvoiceStore` service with `all()`, `find()`, `create()` and `delete()` methods backed by a session array. Inject it into `InvoiceController` through the constructor.",
      "Fill in `create()` to return a form view, and `store()` to read the request, add an invoice through the service, and redirect to `invoices.show` with a success flash. Show that flash in your layout.",
      "Test the redirect matters: temporarily return a view from `store()` instead, submit the form, hit refresh, and watch a second invoice appear. Then put the redirect back.",
      "Add `old('number', ...)` to every field in your create and edit forms, then reject a submit with `back()->withInput()` and confirm the values survive.",
      "Add an attachment field to the form with `enctype=\"multipart/form-data\"`. Store the file on the `local` disk with `store('attachments', 'local')`, and keep both the generated path and the original filename.",
      "Add a `download` route serving that attachment with `response()->download($path, $originalName)`, so the disk keeps its safe name and the user gets a friendly one.",
      "Deliberately drop the `enctype` attribute and submit again. Confirm `hasFile()` is false with no error, so you recognise that symptom later.",
      "Add an `export` action returning a CSV via `response()->streamDownload()`.",
      "Guard `destroy()` with `abort_if($invoice['status'] === 'paid', 409, 'That invoice is already paid.')` and confirm you get a 409 rather than a deleted record.",
      "Add an `api` route group returning the same invoices as JSON: 200 for a list, 201 with a `Location` header from `store`, and `noContent()` from `destroy`.",
    ],
    acceptance: [
      "Creating an invoice redirects to its page and shows a flash message, and refreshing does not create a second one.",
      "A failed submit returns to the form with every field still filled in.",
      "An uploaded file lands on the `local` disk with a generated name, and downloads under its original name.",
      "Removing `enctype` makes `hasFile()` false, and you can say why without looking it up.",
      "Deleting a paid invoice returns 409, not a deletion.",
      "The API routes return 200, 201 with a `Location` header, and 204 respectively.",
      "`InvoiceController` contains no arithmetic and no array manipulation. All of it is in the service.",
    ],
    stretch: [
      "Add a `status` PHP enum and read it with `$request->enum('status', Status::class)`, then compare against cases rather than strings.",
      "Add `Cookie::queue()` to remember the last filter the user chose, and set it before a redirect so you see queued cookies working.",
      "Convert your export to compare memory usage with and without streaming, using `memory_get_peak_usage()`.",
    ],
  },
};
