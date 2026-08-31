import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_5_LESSONS: LessonDay = {
  day: 5,
  title: "Middleware — the checkpoint between a request and your code",
  totalMinutes: 74,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-middleware-is",
      title: "What middleware is, and where it sits",
      durationMinutes: 10,
      explanation: "You have met middleware twice already: once in the request lifecycle on Day 3, once as a route group on Day 4. Today it gets its own day, because almost everything cross-cutting in a Laravel application ends up living here.\n\n<b>Middleware</b> is a class that sits between a request arriving and your route's code running. It can inspect the request, change it, or reject it outright before your controller is ever called, and it gets another turn on the way back out to act on the response.\n\nOne sentence:\n\n```text\nMiddleware is a checkpoint a request must pass\nbefore it reaches your controller.\n```\n\n---\n\n### 1. Basic — the checkpoint\n\nThink of an airport:\n\n```text\nPassenger → Security → Passport → Boarding gate → Plane\n```\n\nNobody reaches the plane without clearing every checkpoint, and any one of them can turn you back.\n\n```text\nRequest → Auth → Permissions → Rate limit → Controller\n```\n\nEach layer gets to say one of two things:\n\n```text\n\"Carry on.\"      → the request continues\n\"Stop here.\"     → the controller never runs\n```\n\nThat second option is the whole point. When an unauthenticated visitor asks for `/invoices`, your controller is not asked to check anything, because it is never called.\n\n---\n\n### 2. Intermediate — why not just check inside the controller?\n\nYou could. The check is three lines:\n\n```php\npublic function index()\n{\n    if (! auth()->check()) {\n        return redirect('/login');\n    }\n\n    // ... the actual work\n}\n```\n\nNow write those three lines in all forty controller methods that need them. The problem is not the typing. It is that one day you add method forty-one and forget, and nothing tells you. There is no error, no failing test, no warning. Just an endpoint that is quietly public.\n\nMiddleware inverts that:\n\n```php\nRoute::middleware('auth')->group(function () {\n    // everything in here is protected, including\n    // whatever you add next month\n});\n```\n\nForgetting is now the safe direction. A route you add inside the group is protected by default; a route you add outside it is obviously outside it.\n\nThis is what \"cross-cutting\" means in practice: a concern that applies to many routes, does not belong to any one of them, and is dangerous to handle by repetition.\n\n```text\nBelongs in a controller        Belongs in middleware\n────────────────────────       ─────────────────────\n\"fetch this invoice\"           \"is anyone logged in?\"\n\"calculate the total\"          \"is this request too frequent?\"\n\"save the payment\"             \"does this response need a header?\"\n```\n\n---\n\n### 3. Advanced — it wraps, it does not just precede\n\nThe picture most people carry is a queue: middleware runs, then the controller runs. That is half of it.\n\nMiddleware <b>wraps</b> the controller. The request goes down through every layer, the controller runs at the bottom, and the response comes back up through the same layers in reverse:\n\n```text\nRequest\n   ↓\n Auth ──────────────┐\n   ↓                │\n Permissions ────┐  │\n   ↓             │  │\n Rate limit ──┐  │  │\n   ↓          │  │  │\nController    │  │  │\n   ↓          │  │  │\nResponse ─────┘  │  │\n   ↓             │  │\n back up ────────┘  │\n   ↓                │\n back up ───────────┘\n   ↓\nBrowser\n```\n\nSo a single middleware can act before the controller, after it, or both. Adding a header to every response, timing how long a request took, logging the status code: all of that is the same mechanism, on the way back out.\n\nThe order this creates is worth noticing now, because it explains behaviour later: the <b>first</b> middleware in is the <b>last</b> one out. Layers, not a queue.",
      diagram: `Middleware wraps the controller, it does not just precede it

              Request
                 │
        ┌────────▼────────┐
        │  Authentication │ ──────────────┐
        └────────┬────────┘               │
                 │                        │
        ┌────────▼────────┐               │
        │  Authorization  │ ───────────┐  │
        └────────┬────────┘            │  │
                 │                     │  │
        ┌────────▼────────┐            │  │
        │  Rate limiting  │ ────────┐  │  │
        └────────┬────────┘         │  │  │
                 │                  │  │  │
        ┌────────▼────────┐         │  │  │
        │   Controller    │         │  │  │
        └────────┬────────┘         │  │  │
                 │                  │  │  │
              Response ─────────────┘  │  │
                 │  on the way back up │  │
                 └─────────────────────┘  │
                 └────────────────────────┘
                          │
                       Browser

  First one in is the LAST one out.


Why not check inside the controller?

  IN EVERY CONTROLLER            ON THE GROUP
  method 1  ✓ checks             ┌─ method 1
  method 2  ✓ checks             │  method 2     all covered,
  method 3  ✗ FORGOT             │  method 3     including the
     → silently public           └─ method 4     one added next`,
      codeExample: {
        title: "The same guard, two ways",
        code: `<?php
// ---------- 1. Checked by hand, in every method ----------
class InvoiceController extends Controller
{
    public function index()
    {
        if (! auth()->check()) {
            return redirect('/login');
        }

        return view('invoices.index');
    }

    public function show(string $invoice)
    {
        if (! auth()->check()) {          // repeated
            return redirect('/login');
        }

        return view('invoices.show');
    }

    public function destroy(string $invoice)
    {
        // ... and the day you forget it here, this is public,
        // with no error and no failing test to tell you.
        return redirect()->route('invoices.index');
    }
}


// ---------- 2. Stated once, in the route file ----------
// routes/web.php

Route::middleware('auth')->group(function () {
    Route::resource('invoices', InvoiceController::class);
    // Every route here is protected, including the ones
    // you add next month.
});

// The controller now only does its own job.
class InvoiceController extends Controller
{
    public function index()
    {
        return view('invoices.index');
    }
}`,
      },
      keyTakeaways: [
        "Middleware is a <b>checkpoint</b> between the request and your controller, and it can stop a request outright.",
        "It exists for <b>cross-cutting</b> concerns: things many routes need that belong to none of them.",
        "Checking in every controller works until the day you forget once, and nothing warns you.",
        "On a group, forgetting becomes the safe direction: new routes inside are protected by default.",
        "Middleware <b>wraps</b> the controller. The request goes down through the layers and the response comes back up.",
        "The first middleware in is the <b>last one out</b>, which explains ordering behaviour you will meet later.",
      ],
      commonMistakes: [
        "<b>Picturing middleware as a queue that runs before the controller.</b> It wraps the controller, which is why after-response work is possible at all.",
        "<b>Putting business logic in middleware.</b> Fetching an invoice is the controller's job. Middleware answers questions about the request, not about your domain.",
        "<b>Protecting routes one at a time.</b> It works right up until the once you forget, and that failure is completely silent.",
        "<b>Assuming a middleware that returns nothing still passes the request on.</b> It does not. Forgetting to return `$next($request)` gives you a blank response.",
      ],
      quiz: [
        {
          question: "What is middleware, in one sentence?",
          options: [
            "A checkpoint between the request and your controller",
            "Code that queries the database",
            "A way to define routes",
            "A template engine",
          ],
          correctIndex: 0,
          explanation: "Its defining ability is that it can stop a request before the controller runs.",
        },
        {
          question: "Why put an auth check in middleware rather than each controller method?",
          options: [
            "Forgetting becomes the safe direction, so new routes are protected by default",
            "It runs faster",
            "Controllers cannot check auth",
            "It uses less memory",
          ],
          correctIndex: 0,
          explanation: "A forgotten check in one method is a silently public endpoint.",
        },
        {
          question: "How does middleware relate to the controller?",
          options: [
            "It runs entirely before, then stops",
            "It runs after the controller only",
            "It wraps the controller: down on the way in, back up on the way out",
            "It replaces the controller",
          ],
          correctIndex: 2,
          explanation: "That is why the same middleware can also modify the response.",
        },
        {
          question: "Which of these belongs in middleware rather than a controller?",
          options: [
            "Calculating an invoice total",
            "Fetching an invoice by number",
            "Checking whether the request is rate limited",
            "Rendering a Blade view",
          ],
          correctIndex: 2,
          explanation: "It is a question about the request, not about your domain.",
        },
      ],
    },
    {
      id: "next-and-blocking",
      title: "$next, before, after, and stopping a request",
      durationMinutes: 11,
      explanation: "Every middleware is one method. Understanding that one method is most of the topic.\n\n<b>$next</b> is the callable Laravel hands you for passing the request on to the rest of the pipeline. A <b>before middleware</b> does its work before calling `$next`; an <b>after middleware</b> does its work after `$next` comes back with a response. <b>Short-circuiting</b> is returning without ever calling `$next`, so nothing downstream runs at all.\n\n```php\npublic function handle(Request $request, Closure $next)\n{\n    return $next($request);\n}\n```\n\nThat is a middleware that does nothing: it receives the request and passes it on unchanged.\n\n---\n\n### 1. Basic — what `$next` actually is\n\n`$next` is a closure meaning <i>the rest of the application</i>: every middleware after this one, and eventually the controller.\n\n```php\nreturn $next($request);\n```\n\nRead it as: \"I am done. Carry on.\"\n\n```text\nMiddleware A\n     │\n  $next($request)\n     ↓\nMiddleware B\n     │\n  $next($request)\n     ↓\nController\n```\n\nCalling `$next($request)` hands control forward. What comes <b>back</b> from that call is the response, which is the part people miss at first:\n\n```php\n$response = $next($request);   // the whole rest of the app ran here\n```\n\nBy the time that line finishes, your controller has already executed.\n\n---\n\n### 2. Intermediate — before, after, and both\n\n<b>Before</b> the controller: do your work, then pass on.\n\n```php\npublic function handle(Request $request, Closure $next)\n{\n    // runs before the controller\n    Log::info('Request in', ['url' => $request->url()]);\n\n    return $next($request);\n}\n```\n\n<b>After</b> the controller: pass on first, then work with what comes back.\n\n```php\npublic function handle(Request $request, Closure $next)\n{\n    $response = $next($request);\n\n    // runs after the controller\n    $response->headers->set('X-App', 'InvoiceHub');\n\n    return $response;\n}\n```\n\n<b>Both</b>, in one middleware. This is how request timing works:\n\n```php\npublic function handle(Request $request, Closure $next)\n{\n    $start = microtime(true);         // before\n\n    $response = $next($request);      // the app runs\n\n    $ms = round((microtime(true) - $start) * 1000);\n    $response->headers->set('X-Duration', \"{$ms}ms\");   // after\n\n    return $response;\n}\n```\n\nThe position of `$next($request)` is the only thing that decides whether your code is \"before\" or \"after\". There is no separate mechanism.\n\n---\n\n### 3. Advanced — stopping the request\n\nTo block a request, simply do not call `$next`. Return a response instead:\n\n```php\npublic function handle(Request $request, Closure $next)\n{\n    if (! $request->user()) {\n        return response()->json(['message' => 'You must log in.'], 401);\n    }\n\n    return $next($request);\n}\n```\n\n```text\nRequest\n   ↓\nIs the user logged in?\n   ├── YES → $next($request) → controller\n   └── NO  → 401, and nothing below ever runs\n```\n\nEverything downstream is skipped: later middleware, the controller, the database queries it would have made. That is the efficiency argument for middleware as well as the security one.\n\nYou have three reasonable ways to stop:\n\n```php\nreturn redirect('/login');                        // browsers\nreturn response()->json([...], 401);              // APIs\nabort(403, 'Not allowed');                        // throws, handled centrally\n```\n\n`abort()` throws an exception rather than returning, so it works from anywhere in the call stack and produces a consistent error page or JSON body depending on the request. For a plain \"you may not do this\", it is usually the tidiest.\n\nNow the mistake that costs people an afternoon:\n\n```php\npublic function handle(Request $request, Closure $next)\n{\n    $next($request);      // called, but not returned\n}\n```\n\nThe application runs perfectly. The controller executes, the query runs, the invoice is created. And the browser gets a blank page, because the middleware returned `null` and `null` is what gets sent. Nothing errors. The clue is that the side effects happened but the screen is empty.\n\nAlways `return` the result of `$next($request)`.",
      diagram: `One method, three behaviours, decided by where $next sits

BEFORE                    AFTER                     BOTH
──────                    ─────                     ────
// work                   $r = $next($request);     $start = ...
return $next($request);   // work                   $r = $next($request);
                          return $r;                // work
                                                    return $r;

  $next($request) IS the rest of the application.
  When that line returns, your controller has already run.


Blocking: just do not call $next

  Request
     ↓
  Is the user logged in?
     ├── YES → $next($request) → later middleware → controller → response
     └── NO  → return 401
                    ↓
         nothing below runs at all:
         no middleware, no controller, no queries


The silent failure

  $next($request);          ← called, not returned
        ↓
  controller runs, invoice IS created
        ↓
  middleware returns null
        ↓
  browser gets a BLANK PAGE, no error

  Side effects happened but the screen is empty? Check your returns.`,
      codeExample: {
        title: "Before, after, both, and blocking",
        code: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Log;

// ---------- Before ----------
class LogIncoming
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('Request in', ['url' => $request->url()]);

        return $next($request);
    }
}


// ---------- After ----------
class AddAppHeader
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);      // the whole app runs here

        $response->headers->set('X-App', 'InvoiceHub');

        return $response;
    }
}


// ---------- Both: timing a request ----------
class MeasureDuration
{
    public function handle(Request $request, Closure $next)
    {
        $start = microtime(true);

        $response = $next($request);

        $ms = round((microtime(true) - $start) * 1000);
        $response->headers->set('X-Duration', "{$ms}ms");

        return $response;
    }
}


// ---------- Blocking ----------
class EnsureInvoiceIsPayable
{
    public function handle(Request $request, Closure $next)
    {
        $invoice = $request->route('invoice');

        if ($invoice === null) {
            abort(404);
        }

        if ($this->alreadyPaid($invoice)) {
            // Do not call $next. Nothing below this line runs.
            return redirect()
                ->route('invoices.show', $invoice)
                ->with('error', 'That invoice is already paid.');
        }

        return $next($request);
    }
}


// ---------- The bug that produces a blank page ----------
class Broken
{
    public function handle(Request $request, Closure $next)
    {
        $next($request);     // BUG: the app runs, but null is returned
    }                        // No error. Just an empty response.
}`,
      },
      keyTakeaways: [
        "<b>`$next`</b> is a closure standing for the rest of the application: later middleware, then the controller.",
        "`$next($request)` <b>returns the response</b>, so after that line your controller has already run.",
        "Code before `$next` runs on the way in; code after it runs on the way out. That is the only difference.",
        "To block a request, do not call `$next`. Return a redirect, a JSON response, or call `abort()`.",
        "Blocking skips everything downstream: later middleware, the controller, and its queries.",
        "<b>Always `return` `$next($request)`.</b> Calling it without returning gives a blank page and no error.",
      ],
      commonMistakes: [
        "<b>Calling `$next($request)` without returning it.</b> The application runs and the browser gets a blank page. Side effects with an empty screen is the tell.",
        "<b>Expecting code after `$next` to run when the request was blocked upstream.</b> An earlier middleware returning a response means yours is never entered.",
        "<b>Modifying the response before calling `$next`.</b> There is no response yet. It does not exist until `$next` returns.",
        "<b>Using `abort()` when you wanted a redirect.</b> `abort(403)` shows an error page; a logged-out browser visitor usually wants to be sent to the login form.",
        "<b>Assuming a blocked request still logs or records.</b> Anything downstream, including your own logging middleware, is skipped entirely.",
      ],
      quiz: [
        {
          question: "What does `$next($request)` represent?",
          options: [
            "The current controller only",
            "The rest of the application: later middleware and the controller",
            "The previous middleware",
            "The HTTP response",
          ],
          correctIndex: 1,
          explanation: "Which is why the line returns a response once everything downstream has run.",
        },
        {
          question: "How do you make code run after the controller?",
          options: [
            "Put it after `$next($request)` in `handle()`",
            "Use a separate `after()` method",
            "Use `terminate()` only",
            "It is not possible",
          ],
          correctIndex: 0,
          explanation: "The position of `$next` is the only thing that decides before or after.",
        },
        {
          question: "How do you block a request in middleware?",
          options: [
            "Call `$next(null)`",
            "Return `false`",
            "Do not call `$next`; return a response instead",
            "Throw any exception",
          ],
          correctIndex: 2,
          explanation: "Everything downstream is then skipped entirely.",
        },
        {
          question: "Your middleware calls `$next($request)` but does not return it. What happens?",
          options: [
            "A 500 error",
            "The app runs and the browser gets a blank page",
            "The request is blocked",
            "Laravel returns it automatically",
          ],
          correctIndex: 1,
          explanation: "No error is raised, which is what makes it hard to spot.",
        },
      ],
    },
    {
      id: "writing-middleware",
      title: "Writing your own middleware",
      durationMinutes: 10,
      explanation: "Time to build one.\n\nThe <b>handle()</b> method is the single entry point Laravel calls on a middleware. It takes the request and `$next`, and everything your middleware does happens inside it.\n\n```bash\nphp artisan make:middleware EnsureInvoiceIsPayable\n```\n\n```text\napp/\n└── Http/\n    └── Middleware/\n        └── EnsureInvoiceIsPayable.php\n```\n\n---\n\n### 1. Basic — the skeleton\n\nLaravel gives you this:\n\n```php\n<?php\n\nnamespace App\\Http\\Middleware;\n\nuse Closure;\nuse Illuminate\\Http\\Request;\nuse Symfony\\Component\\HttpFoundation\\Response;\n\nclass EnsureInvoiceIsPayable\n{\n    public function handle(Request $request, Closure $next): Response\n    {\n        return $next($request);\n    }\n}\n```\n\nOne method, two arguments, one return. Everything you write goes in `handle()`.\n\nNaming is worth a moment. Laravel's own middleware reads as a sentence: `EnsureEmailIsVerified`, `RedirectIfAuthenticated`, `ValidateSignature`. Follow that and a route file explains itself:\n\n```php\nRoute::post('/invoices/{invoice}/pay', ...)\n    ->middleware(EnsureInvoiceIsPayable::class);\n```\n\nA class called `InvoiceMiddleware` tells the next reader nothing.\n\n---\n\n### 2. Intermediate — reading the request\n\nMiddleware runs before your controller, so the request is what you have to work with. The useful methods:\n\n```php\n$request->user();                    // the logged-in user, or null\n$request->route('invoice');          // a route parameter\n$request->header('X-App-Version');   // a header\n$request->hasHeader('X-App-Version');\n$request->ip();\n$request->isMethod('post');\n$request->expectsJson();             // API client or browser?\n$request->is('admin/*');             // does the path match?\n```\n\nThat last pair matter more than they look. `expectsJson()` is how one middleware serves both browsers and API clients correctly:\n\n```php\nif (! $request->user()) {\n    return $request->expectsJson()\n        ? response()->json(['message' => 'Unauthenticated.'], 401)\n        : redirect()->route('login');\n}\n```\n\nA browser gets sent to the login page. An API client gets a 401 it can actually parse. Same middleware, right answer for each.\n\nA worked example, requiring an API version header:\n\n```php\npublic function handle(Request $request, Closure $next): Response\n{\n    if (! $request->hasHeader('X-App-Version')) {\n        return response()->json([\n            'message' => 'The X-App-Version header is required.',\n        ], 400);\n    }\n\n    return $next($request);\n}\n```\n\n---\n\n### 3. Advanced — modifying the request\n\nMiddleware can change the request before your controller sees it. Two things are commonly useful.\n\n<b>Adding data</b> the rest of the application can rely on:\n\n```php\npublic function handle(Request $request, Closure $next): Response\n{\n    $request->merge([\n        'tenant_id' => $this->resolveTenant($request),\n    ]);\n\n    return $next($request);\n}\n```\n\nYour controller now reads `$request->input('tenant_id')` without knowing how it was worked out.\n\n<b>Cleaning input</b> before validation runs:\n\n```php\n$request->merge([\n    'email' => strtolower(trim($request->input('email', ''))),\n]);\n```\n\nLaravel ships two middleware doing exactly this: `TrimStrings` and `ConvertEmptyStringsToNull`. That second one is why a blank form field arrives as `null` rather than `\"\"`, which is worth knowing when a validation rule behaves unexpectedly.\n\nOne caution. Middleware can also resolve services from the container:\n\n```php\npublic function __construct(private InvoiceRepository $invoices) {}\n```\n\nThat works, and it is occasionally right. But it is also the point where middleware starts absorbing business logic that belongs in a controller or a service. The test: middleware should answer <i>may this request proceed</i>, or <i>what should be true of every request</i>. If it is deciding what the response should contain, it has gone too far.",
      diagram: `Anatomy of a middleware

  php artisan make:middleware EnsureInvoiceIsPayable
                        ↓
  app/Http/Middleware/EnsureInvoiceIsPayable.php

  class EnsureInvoiceIsPayable
  {
      public function handle(Request $request, Closure $next): Response
      {                    │              │
      //                   │              └── the rest of the app
      //                   └── everything you know about this request
          return $next($request);
      }
  }


Serving browsers and APIs from one middleware

              request fails the check
                        │
             $request->expectsJson()
                 ┌──────┴──────┐
                yes            no
                 │              │
                 ↓              ↓
     401 JSON response   redirect to /login
     (API client can      (browser shows the
      parse this)          login form)


Where the line is

  MIDDLEWARE                      NOT MIDDLEWARE
  may this request proceed?       what should the response contain?
  is the header present?          fetch the invoice
  normalise the email             calculate the total
  add tenant_id to the request    decide which view to render`,
      codeExample: {
        title: "Three middleware you would actually write",
        code: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

// ---------- 1. Require a header, API style ----------
class RequireAppVersion
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->hasHeader('X-App-Version')) {
            return response()->json([
                'message' => 'The X-App-Version header is required.',
            ], 400);
        }

        return $next($request);
    }
}


// ---------- 2. One middleware, correct for browsers AND APIs ----------
class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->is_active) {
            return $next($request);
        }

        return $request->expectsJson()
            ? response()->json(['message' => 'Your account is suspended.'], 403)
            : redirect()->route('suspended');
    }
}


// ---------- 3. Normalise input before validation sees it ----------
class NormaliseInvoiceInput
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->merge([
            'number' => strtoupper(trim($request->input('number', ''))),
            'email'  => strtolower(trim($request->input('email', ''))),
        ]);

        // The controller and the validator both see the cleaned values.
        return $next($request);
    }
}


// ---------- Reading the request: the useful methods ----------
// $request->user();                  the logged-in user, or null
// $request->route('invoice');        a route parameter
// $request->header('X-App-Version'); a header
// $request->ip();
// $request->isMethod('post');
// $request->expectsJson();           API client or browser?
// $request->is('admin/*');           path matching`,
      },
      keyTakeaways: [
        "`php artisan make:middleware Name` creates the class in `app/Http/Middleware/`.",
        "Everything happens in <b>`handle(Request $request, Closure $next)`</b>.",
        "Name middleware as a sentence, like `EnsureInvoiceIsPayable`, so route files read clearly.",
        "<b>`$request->expectsJson()`</b> lets one middleware redirect browsers and return 401 JSON to API clients.",
        "<b>`$request->merge([...])`</b> adds or cleans data before the controller and the validator see it.",
        "Laravel's `TrimStrings` and `ConvertEmptyStringsToNull` work this way, which is why empty fields arrive as `null`.",
        "Middleware answers <i>may this proceed</i>. Deciding what the response contains is the controller's job.",
      ],
      commonMistakes: [
        "<b>Always redirecting on an auth failure.</b> An API client receives an HTML login page it cannot parse. Branch on `expectsJson()`.",
        "<b>Naming middleware after a noun.</b> `InvoiceMiddleware` says nothing; `EnsureInvoiceIsPayable` says exactly what it guards.",
        "<b>Putting business logic in middleware.</b> Fetching records and building responses belongs downstream, where it can be tested directly.",
        "<b>Assuming `$request->user()` is set.</b> If your middleware runs before the auth middleware, it is `null`. Use `?->` and mind the ordering.",
        "<b>Reading raw input and forgetting Laravel already normalised it.</b> An empty text field is `null`, not an empty string, because a built-in middleware converted it.",
      ],
      quiz: [
        {
          question: "Which command creates a middleware class?",
          options: [
            "`php artisan new:middleware`",
            "`php artisan make:middleware Name`",
            "`php artisan middleware:create`",
            "`composer make:middleware`",
          ],
          correctIndex: 1,
          explanation: "It lands in `app/Http/Middleware/`.",
        },
        {
          question: "What does `$request->expectsJson()` let you do?",
          options: [
            "Force a JSON response",
            "Validate JSON input",
            "Answer browsers with a redirect and API clients with JSON",
            "Convert the response to JSON",
          ],
          correctIndex: 2,
          explanation: "One middleware then behaves correctly for both kinds of caller.",
        },
        {
          question: "What does `$request->merge([...])` do?",
          options: [
            "Adds or replaces input data before the controller sees it",
            "Merges two requests",
            "Merges middleware groups",
            "Combines route parameters",
          ],
          correctIndex: 0,
          explanation: "Laravel's own TrimStrings middleware works this way.",
        },
        {
          question: "Which of these does NOT belong in middleware?",
          options: [
            "Checking a required header",
            "Fetching an invoice and deciding which view to render",
            "Normalising an email address",
            "Blocking a suspended account",
          ],
          correctIndex: 1,
          explanation: "Middleware decides whether a request proceeds, not what the response contains.",
        },
      ],
    },
    {
      id: "registering-middleware",
      title: "Registering middleware in bootstrap/app.php",
      durationMinutes: 12,
      explanation: "Writing a middleware does nothing on its own. Laravel has to be told when to run it, and there are four different answers depending on how widely it should apply.\n\n<b>Global middleware</b> runs on every single request. A <b>middleware group</b> is a named bundle of middleware applied together, like `web` or `api`. A <b>middleware alias</b> is a short name standing in for a class, so you can write `auth` instead of a full class path. <b>Route middleware</b> is middleware attached to one route or one route group and nothing else.\n\nAll of it happens in `bootstrap/app.php`, the file you met on Day 2:\n\n```php\n->withMiddleware(function (Middleware $middleware) {\n    // everything in this lesson goes here\n})\n```\n\n<i>If a tutorial tells you to edit `app/Http/Kernel.php`, it predates this file. Same job, older Laravel.</i>\n\n---\n\n### 1. Basic — on a single route, or a group\n\nThe narrowest option needs no registration at all. Name the class in the route:\n\n```php\nRoute::post('/invoices/{invoice}/pay', [PaymentController::class, 'store'])\n    ->middleware(EnsureInvoiceIsPayable::class);\n```\n\nOr on a group, which is where most application middleware belongs:\n\n```php\nRoute::middleware(['auth', EnsureUserIsActive::class])->group(function () {\n    Route::resource('invoices', InvoiceController::class);\n});\n```\n\nIf a middleware applies to some routes and not others, stop here. The route file is the most obvious place for it, because the guard is visible next to what it guards.\n\n---\n\n### 2. Intermediate — globally, and by alias\n\nSome middleware genuinely applies to every request: forcing HTTPS, adding a security header, logging.\n\n```php\n->withMiddleware(function (Middleware $middleware) {\n    $middleware->append(AddSecurityHeaders::class);    // runs last\n    $middleware->prepend(ForceHttps::class);           // runs first\n})\n```\n\n```text\nprepend()  →  before Laravel's own middleware\nappend()   →  after Laravel's own middleware\n```\n\nThe choice matters more than it sounds. `ForceHttps` must run before anything reads the request, so it prepends. A middleware adding a response header can append, because on the way back out it still gets its turn.\n\nTyping full class names in route files gets old, so give them short names with <b>`alias()`</b>:\n\n```php\n$middleware->alias([\n    'payable' => EnsureInvoiceIsPayable::class,\n    'active'  => EnsureUserIsActive::class,\n]);\n```\n\n```php\nRoute::post('/invoices/{invoice}/pay', ...)->middleware('payable');\n```\n\nYou have already used aliases without knowing: `auth`, `guest`, `throttle` and `signed` are all Laravel's own. `signed` is the one you have seen up close, on Day 4 with signed URLs.\n\n---\n\n### 3. Advanced — groups, and the two you already have\n\nA <b>middleware group</b> is a named bundle that runs together. Laravel gives you two, and Day 4 explained the consequences without naming the mechanism.\n\n```text\nweb                              api\n├── cookies                      ├── (stateless)\n├── session                      └── throttle, if you add it\n├── CSRF verification\n└── share errors with views\n```\n\nThat is why a `web.php` route knows who is logged in and an `api.php` route does not: they run through different groups.\n\nAdd to a group rather than replacing it:\n\n```php\n$middleware->appendToGroup('web', [MeasureDuration::class]);\n$middleware->prependToGroup('api', [RequireAppVersion::class]);\n```\n\nDefine your own bundle when several middleware always travel together:\n\n```php\n$middleware->group('admin', [\n    'auth',\n    EnsureUserIsActive::class,\n    EnsureUserIsAdmin::class,\n]);\n```\n\n```php\nRoute::middleware('admin')->prefix('admin')->group(function () {\n    Route::resource('invoices', InvoiceController::class);\n});\n```\n\nThree guards, one word, and adding a fourth later updates every admin route at once.\n\nYou can also remove middleware, which is occasionally necessary:\n\n```php\n$middleware->remove(TrimStrings::class);\n$middleware->validateCsrfTokens(except: ['stripe/webhook']);\n```\n\nThat second line is one you will genuinely need. A payment provider posting to your webhook has no CSRF token and cannot get one, so the request would be rejected with a 419. Excepting the route is the correct fix, not disabling CSRF everywhere.\n\nChoosing between the four:\n\n```text\nEvery request?              append() or prepend()\nEvery browser request?      appendToGroup('web', ...)\nA named bundle of routes?   group('admin', [...])\nSome routes only?           ->middleware(...) in the route file\n```\n\nDefault to the narrowest one that works. Global middleware runs on your health check, your webhooks and your asset routes too.",
      diagram: `Four scopes, narrowest first

  ROUTE          Route::post(...)->middleware('payable')
    │            visible right next to what it guards
    ↓
  GROUP          Route::middleware('admin')->group(...)
    │            a named bundle you defined
    ↓
  WEB / API      $middleware->appendToGroup('web', [...])
    │            every browser request, or every API request
    ↓
  GLOBAL         $middleware->append(...)
                 EVERY request: health checks, webhooks, assets


prepend vs append

  prepend  →  [ yours ][ Laravel's own middleware ]   runs first
  append   →  [ Laravel's own middleware ][ yours ]   runs last

  ForceHttps must prepend: nothing should read the
  request before it. A response header can append.


Why web.php knows who is logged in and api.php does not

  web group                     api group
  ├── cookies                   ├── stateless
  ├── session      ← this       └── throttle
  ├── CSRF
  └── share errors

  Same routing, different bundle. That is the whole difference.`,
      codeExample: {
        title: "All four registration scopes",
        code: `<?php
// bootstrap/app.php

use App\\Http\\Middleware\\AddSecurityHeaders;
use App\\Http\\Middleware\\EnsureInvoiceIsPayable;
use App\\Http\\Middleware\\EnsureUserIsActive;
use App\\Http\\Middleware\\ForceHttps;
use App\\Http\\Middleware\\RequireAppVersion;
use Illuminate\\Foundation\\Configuration\\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
    )
    ->withMiddleware(function (Middleware $middleware) {

        // ---------- Global: every single request ----------
        $middleware->prepend(ForceHttps::class);          // before Laravel's own
        $middleware->append(AddSecurityHeaders::class);   // after Laravel's own

        // ---------- Into an existing group ----------
        $middleware->appendToGroup('web', [MeasureDuration::class]);
        $middleware->prependToGroup('api', [RequireAppVersion::class]);

        // ---------- Your own named bundle ----------
        $middleware->group('admin', [
            'auth',
            EnsureUserIsActive::class,
            EnsureUserIsAdmin::class,
        ]);

        // ---------- Short names for route files ----------
        $middleware->alias([
            'payable' => EnsureInvoiceIsPayable::class,
            'active'  => EnsureUserIsActive::class,
        ]);

        // ---------- Exceptions ----------
        // A payment provider's webhook has no CSRF token and cannot get one.
        // Except the route; do not disable CSRF everywhere.
        $middleware->validateCsrfTokens(except: [
            'stripe/webhook',
        ]);
    })
    ->create();
?>

<?php
// routes/web.php — the narrowest scope, and usually the right one

// One route
Route::post('/invoices/{invoice}/pay', [PaymentController::class, 'store'])
    ->middleware('payable');

// A group of routes
Route::middleware(['auth', 'active'])->group(function () {
    Route::resource('invoices', InvoiceController::class);
});

// Your named bundle: three guards, one word
Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
    Route::resource('invoices', InvoiceController::class);
});`,
      },
      keyTakeaways: [
        "All middleware registration happens in <b>`bootstrap/app.php`</b>, inside `->withMiddleware(...)`.",
        "<b>`append()`</b> and <b>`prepend()`</b> apply a middleware to every request, before or after Laravel's own.",
        "<b>`alias()`</b> gives a short name for route files. `auth`, `guest` and `throttle` are Laravel's own aliases.",
        "<b>`appendToGroup()`</b> adds to the existing `web` or `api` bundles rather than replacing them.",
        "<b>`group()`</b> defines your own bundle, so several guards can be applied with one word.",
        "The `web` and `api` groups are why browser routes have sessions and CSRF while API routes do not.",
        "<b>Prefer the narrowest scope that works.</b> Global middleware also runs on webhooks, health checks and assets.",
      ],
      commonMistakes: [
        "<b>Looking for `app/Http/Kernel.php`.</b> It no longer exists. Middleware is configured in `bootstrap/app.php`.",
        "<b>Making a middleware global when only some routes need it.</b> It now also runs on your health check and your webhooks, where it may be actively wrong.",
        "<b>Replacing the `web` group instead of appending to it.</b> You lose sessions and CSRF, and login mysteriously stops persisting.",
        "<b>Disabling CSRF globally because a webhook returns 419.</b> Except that one route with `validateCsrfTokens(except: [...])` and leave the protection on everywhere else.",
        "<b>Using `append()` for something that must run first.</b> `ForceHttps` after Laravel's middleware is too late to be useful.",
      ],
      quiz: [
        {
          question: "Where is middleware registered in a modern Laravel application?",
          options: [
            "`app/Http/Kernel.php`",
            "`config/middleware.php`",
            "`routes/web.php`",
            "`bootstrap/app.php`",
          ],
          correctIndex: 3,
          explanation: "`Kernel.php` was the old location and no longer exists.",
        },
        {
          question: "What is the difference between `append()` and `prepend()`?",
          options: [
            "Append is faster",
            "Prepend only works in groups",
            "Append is for API routes",
            "Prepend runs before Laravel's own middleware, append runs after",
          ],
          correctIndex: 3,
          explanation: "Something like ForceHttps must prepend, because nothing should read the request first.",
        },
        {
          question: "What does `alias()` do?",
          options: [
            "Gives a middleware class a short name for route files",
            "Renames a route",
            "Creates a middleware group",
            "Duplicates a middleware",
          ],
          correctIndex: 0,
          explanation: "`auth`, `guest` and `throttle` are aliases Laravel defines for you.",
        },
        {
          question: "A payment webhook returns 419. What is the correct fix?",
          options: [
            "Disable CSRF protection globally",
            "Add `Route::any()`",
            "Move it to `api.php` and hope",
            "Except that route with `validateCsrfTokens(except: [...])`",
          ],
          correctIndex: 3,
          explanation: "The provider has no CSRF token and cannot get one, but only that route should be excepted.",
        },
      ],
    },
    {
      id: "middleware-parameters",
      title: "Parameters and controller attributes",
      durationMinutes: 11,
      explanation: "One middleware often needs to answer slightly different questions on different routes. Rather than writing `EnsureUserIsAdmin`, `EnsureUserIsManager` and `EnsureUserIsAccountant`, pass the answer in.\n\nA <b>middleware parameter</b> is an argument passed to a middleware from the route, written after a colon like `role:admin`. It lets one class cover several variations instead of you writing a class per variation.\n\n---\n\n### 1. Basic — passing a parameter\n\nAnything after a colon in the route becomes an argument:\n\n```php\nRoute::get('/admin', ...)->middleware('role:admin');\n```\n\nYour middleware receives it after `$next`:\n\n```php\npublic function handle(Request $request, Closure $next, string $role): Response\n{\n    if ($request->user()?->role !== $role) {\n        abort(403);\n    }\n\n    return $next($request);\n}\n```\n\n```text\n'role:admin'\n      │\n      ↓\n  $role = 'admin'\n```\n\nSeveral parameters are comma-separated:\n\n```php\nRoute::get('/reports', ...)->middleware('role:admin,manager');\n```\n\n```php\npublic function handle(Request $request, Closure $next, string ...$roles): Response\n{\n    if (! in_array($request->user()?->role, $roles)) {\n        abort(403);\n    }\n\n    return $next($request);\n}\n```\n\nThe variadic `...$roles` is worth preferring over naming each argument. It accepts one role or five without changing the signature.\n\nYou have used this already. `throttle:60,1` is a parameterised middleware: sixty requests per one minute.\n\n---\n\n### 2. Intermediate — building the string safely\n\nRoute strings are easy to typo, and a typo here fails open or closed in confusing ways. Laravel lets a middleware build its own:\n\n```php\nclass EnsureUserHasRole\n{\n    public static function using(string ...$roles): string\n    {\n        return static::class.':'.implode(',', $roles);\n    }\n\n    public function handle(Request $request, Closure $next, string ...$roles): Response\n    {\n        // ...\n    }\n}\n```\n\n```php\nRoute::get('/reports', ...)\n    ->middleware(EnsureUserHasRole::using('admin', 'manager'));\n```\n\nNow your editor autocompletes it and a misspelt class fails immediately, instead of `'roles:admin'` silently matching no registered alias.\n\n---\n\n### 3. Advanced — declaring middleware on the controller\n\nMiddleware does not have to live in the route file. Recent Laravel versions let you declare it as a PHP <b>attribute</b> (metadata written with `#[...]`) on the controller itself:\n\n```php\n#[Middleware('auth')]\nclass InvoiceController extends Controller\n{\n    // every method requires auth\n}\n```\n\nOr on one method:\n\n```php\nclass InvoiceController extends Controller\n{\n    #[Middleware(['auth', 'payable'])]\n    public function pay(string $invoice)\n    {\n        // ...\n    }\n}\n```\n\nAnd you can subtract, for a single public method on an otherwise protected controller:\n\n```php\n#[Middleware('auth')]\nclass InvoiceController extends Controller\n{\n    #[WithoutMiddleware('auth')]\n    public function publicPreview(string $invoice)\n    {\n        // deliberately reachable by anyone\n    }\n}\n```\n\nThe older equivalent, which works in every version, is a static method on the controller:\n\n```php\npublic static function middleware(): array\n{\n    return [\n        'auth',\n        new Middleware('payable', only: ['pay']),\n    ];\n}\n```\n\nWhich should you use? There is a genuine trade-off, and it is not obvious.\n\n```text\nIN THE ROUTE FILE              ON THE CONTROLLER\none place shows every guard    the guard sits next to the code\nroute:list tells the truth     survives a route being redefined\neasy to audit before a         easy to see while editing the\n  release                        method\n```\n\nThe argument for route files is auditability: one file answers \"what is protected?\" for the whole application. The argument for attributes is proximity: someone editing `pay()` sees its guard without opening another file.\n\nA workable rule: keep <b>authentication</b> in route groups, where it can be audited at a glance, and use attributes for guards specific to one method. And whichever you choose, `php artisan route:list -v` shows what is actually applied, which beats reading either file.\n\n`#[WithoutMiddleware]` deserves particular care. It is the only construct here that <i>removes</i> protection, and a reader skimming the class sees `#[Middleware('auth')]` at the top and may not notice the exception below it. Use it rarely, and make the method name say it is public.",
      diagram: `Parameters after the colon

  ->middleware('role:admin,manager')
                 │      │      │
                 │      └──────┴── arguments
                 └── the alias

  public function handle($request, Closure $next, string ...$roles)
                                                  │
                          $roles = ['admin', 'manager']

  You already use this: throttle:60,1 = 60 requests per 1 minute


Where to declare it, and what you trade

  ROUTE FILE                     CONTROLLER ATTRIBUTE

  Route::middleware('auth')      #[Middleware('auth')]
       ->group(function () {     class InvoiceController
         Route::resource(...)    {
       });                           public function pay() {}
                                 }

  one file lists every guard     guard sits beside the code
  easy to audit in one pass      easy to see while editing
  ─────────────────────────────────────────────────────────
  Rule of thumb: auth in route groups (auditable),
  method-specific guards as attributes.

  Either way, route:list -v shows what is REALLY applied.


#[WithoutMiddleware] removes protection

  #[Middleware('auth')]          ← reader sees this
  class InvoiceController
  {
      #[WithoutMiddleware('auth')]   ← and may miss this
      public function publicPreview() {}
  }

  Name the method so it announces itself.`,
      codeExample: {
        title: "Parameterised middleware and attributes",
        code: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class EnsureUserHasRole
{
    // Build the middleware string in a type-safe way:
    //   ->middleware(EnsureUserHasRole::using('admin', 'manager'))
    public static function using(string ...$roles): string
    {
        return static::class.':'.implode(',', $roles);
    }

    // Variadic, so one role or five needs no signature change.
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! in_array($request->user()?->role, $roles, strict: true)) {
            abort(403, 'You do not have access to this area.');
        }

        return $next($request);
    }
}
?>

<?php
// routes/web.php

// By alias, with parameters
Route::get('/admin', ...)->middleware('role:admin');
Route::get('/reports', ...)->middleware('role:admin,manager');

// Type-safe, autocompleted, fails loudly on a typo
Route::get('/reports', ...)->middleware(EnsureUserHasRole::using('admin', 'manager'));

// Laravel's own parameterised middleware: 60 requests per minute
Route::post('/invoices', ...)->middleware('throttle:60,1');
?>

<?php
// app/Http/Controllers/InvoiceController.php

use Illuminate\\Routing\\Controllers\\Middleware;
use Illuminate\\Routing\\Controllers\\HasMiddleware;

#[Middleware('auth')]
class InvoiceController extends Controller
{
    #[Middleware(['payable', 'throttle:10,1'])]
    public function pay(string $invoice)
    {
        // ...
    }

    // Deliberately public. The method name says so, because a reader
    // sees #[Middleware('auth')] above the class and may miss this.
    #[WithoutMiddleware('auth')]
    public function publicPreview(string $invoice)
    {
        // ...
    }
}


// The version-independent equivalent:
class PaymentController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('payable', only: ['store']),
            new Middleware('throttle:10,1', except: ['index']),
        ];
    }
}`,
      },
      keyTakeaways: [
        "Anything after a colon becomes an argument: `'role:admin'` arrives as `$role`.",
        "Comma-separate several, and accept them with a <b>variadic</b> `string ...$roles`.",
        "`throttle:60,1` is a parameterised middleware you have already been using.",
        "A static `using()` helper builds the string type-safely, so typos fail loudly.",
        "<b>`#[Middleware]`</b> declares middleware on a controller class or a single method.",
        "<b>`#[WithoutMiddleware]`</b> removes it, and should be rare and obviously named.",
        "Keep authentication in route groups for auditability; use attributes for method-specific guards.",
        "`php artisan route:list -v` shows what is actually applied, wherever it was declared.",
      ],
      commonMistakes: [
        "<b>Forgetting parameters come after `$next`.</b> The signature is `handle($request, $next, $role)`, and getting the order wrong produces confusing type errors.",
        "<b>Typos in a middleware string.</b> `'roles:admin'` matches no alias and fails in a way that does not name the mistake. A `using()` helper avoids this entirely.",
        "<b>Writing one middleware per role.</b> `EnsureUserIsAdmin`, `EnsureUserIsManager` and so on is the duplication parameters exist to prevent.",
        "<b>Scattering `#[WithoutMiddleware]` through a controller.</b> Every one is a hole in protection that a reader skimming the class will miss.",
        "<b>Declaring guards in both the route file and the controller.</b> Both apply, and now two places have to agree. Pick one per concern.",
      ],
      quiz: [
        {
          question: "How does a middleware receive `'role:admin'`?",
          options: [
            "As a route parameter",
            "Through the constructor",
            "Via `$request->input()`",
            "As an argument after `$next`",
          ],
          correctIndex: 3,
          explanation: "The signature becomes `handle($request, $next, $role)`.",
        },
        {
          question: "How do you accept a variable number of middleware parameters?",
          options: [
            "An array argument",
            "A JSON string",
            "A variadic `string ...$roles`",
            "You cannot",
          ],
          correctIndex: 2,
          explanation: "One role or five then needs no change to the signature.",
        },
        {
          question: "What is `throttle:60,1`?",
          options: [
            "A route name",
            "A parameterised middleware allowing 60 requests per minute",
            "A cache setting",
            "A queue configuration",
          ],
          correctIndex: 1,
          explanation: "Parameterised middleware is something you have used since before today.",
        },
        {
          question: "What is the main argument for declaring auth in route groups rather than attributes?",
          options: [
            "It runs faster",
            "One file answers what is protected, so it can be audited at a glance",
            "Attributes do not work for auth",
            "It is required by Laravel",
          ],
          correctIndex: 1,
          explanation: "Attributes win on proximity; route files win on auditability.",
        },
      ],
    },
    {
      id: "order-and-terminable",
      title: "Execution order, priority and terminate()",
      durationMinutes: 11,
      explanation: "Middleware runs in an order, and when that order is wrong the failures are strange rather than loud.\n\n<b>Middleware priority</b> is the order Laravel runs your middleware in, and it is something you can set explicitly when the default order is wrong for you. <b>Terminable middleware</b> is a middleware with a `terminate()` method, which Laravel calls after the response has already been sent to the browser.\n\n---\n\n### 1. Basic — down and back up\n\nThree middleware around a controller:\n\n```text\nRequest\n   ↓\n  A  (before)\n   ↓\n  B  (before)\n   ↓\n  C  (before)\n   ↓\nController\n   ↓\n  C  (after)\n   ↓\n  B  (after)\n   ↓\n  A  (after)\n   ↓\nResponse\n```\n\nThe first one in is the last one out. Nesting, not a queue.\n\nThis falls out of how `$next` works. `A` calls `$next`, which is `B`, which calls `$next`, which is `C`. Each is still sitting inside its own `handle()` waiting for that call to return.\n\nThe practical consequence: a middleware that wants to <b>see the finished response</b> should be early in the list, because early means outermost, and outermost sees the response last, after everyone else has modified it.\n\n```text\nwant to guard the request first?      → run early\nwant to see the final response?       → run early (you unwind last)\nwant to modify the request last       → run late\n  before the controller sees it?\n```\n\n---\n\n### 2. Intermediate — when order goes wrong\n\nThe classic:\n\n```php\nRoute::middleware(['role:admin', 'auth'])->group(...);\n```\n\n`role:admin` runs first and asks `$request->user()?->role`. Nobody has authenticated yet, so `user()` is `null`, the role is `null`, and every request is rejected with a 403. Including the requests from actual admins.\n\nYou get a 403 where you expected a login page, which sends people hunting through their roles table rather than looking at ordering.\n\nReversed, it works:\n\n```php\nRoute::middleware(['auth', 'role:admin'])->group(...);\n```\n\n```text\nauth        → is anyone logged in?  no → redirect to login\n   ↓\nrole:admin  → is that person an admin?  no → 403\n   ↓\nController\n```\n\nRoute middleware runs in the order you list it. Read the list as a sentence and it usually reads correctly or obviously wrongly.\n\n---\n\n### 3. Advanced — priority, and work after the response\n\nRoute order is under your control. Order <b>between</b> sources is not: Laravel's own middleware, group middleware and route middleware all arrive from different places.\n\nFor that, Laravel keeps a priority list, and you can set it:\n\n```php\n->withMiddleware(function (Middleware $middleware) {\n    $middleware->priority([\n        \\Illuminate\\Cookie\\Middleware\\EncryptCookies::class,\n        \\Illuminate\\Session\\Middleware\\StartSession::class,\n        \\Illuminate\\Auth\\Middleware\\Authenticate::class,\n        \\App\\Http\\Middleware\\EnsureUserIsActive::class,\n    ]);\n})\n```\n\nAnything in that list runs in that order regardless of where it was registered. You will rarely need this, and when you do, it is usually because a middleware depends on the session or the authenticated user existing.\n\nNow the other tool. Sometimes work should happen <b>after the response has already gone to the browser</b>. Logging is the obvious case: the user should not wait for it.\n\nAdd a `terminate()` method:\n\n```php\nclass LogRequest\n{\n    public function handle(Request $request, Closure $next): Response\n    {\n        return $next($request);\n    }\n\n    public function terminate(Request $request, Response $response): void\n    {\n        Log::info('Request completed', [\n            'url'      => $request->url(),\n            'status'   => $response->status(),\n            'duration' => microtime(true) - LARAVEL_START,\n        ]);\n    }\n}\n```\n\n```text\nRequest → middleware → controller → response → BROWSER\n                                                  │\n                                            terminate()\n                                                  ↓\n                                            logging, cleanup\n```\n\nThe distinction:\n\n```text\nhandle()      part of producing the response; the user waits for it\nterminate()   after the response is sent; the user does not wait\n```\n\nTwo caveats worth knowing before you rely on it.\n\nIt only helps on setups that can close the connection early, such as PHP-FPM. On some setups the work still happens before the process is free, so it is a latency improvement, not a guarantee.\n\nAnd `terminate()` is not a queue. If the work is slow or can fail, it belongs in a queued job, which arrives on Day 16. Use `terminate()` for quick, fire-and-forget things where losing one occasionally does not matter.",
      diagram: `First in, last out

  Request
     ↓
   A before ─────────────────────────────┐
     ↓                                   │
   B before ──────────────────┐          │
     ↓                        │          │
   C before ───────┐          │          │
     ↓             │          │          │
  Controller       │          │          │
     ↓             │          │          │
   C after ────────┘          │          │
     ↓                        │          │
   B after ───────────────────┘          │
     ↓                                   │
   A after ──────────────────────────────┘
     ↓
  Response

  A guards first and sees the finished response last.


The ordering bug you will actually hit

  WRONG                          RIGHT
  ['role:admin', 'auth']         ['auth', 'role:admin']
        │                              │
  role runs first                auth runs first
        ↓                              ↓
  user() is null                 user is known
        ↓                              ↓
  role is null → 403             role checked properly
        ↓                              ↓
  EVERYONE rejected,             admins get in,
  including real admins          others get 403

  Symptom: a 403 where you expected a login redirect.


handle() vs terminate()

  handle()      response ───→ browser   user waits
  terminate()   response ───→ browser
                                 ↓
                            terminate()   user does not wait

  Not a queue. Slow or failure-prone work belongs in a job.`,
      codeExample: {
        title: "Ordering, priority and terminable middleware",
        code: `<?php
// routes/web.php — route middleware runs in the order you list it

// WRONG: role runs before anyone is authenticated, so user() is null
// and every request 403s, including real admins.
Route::middleware(['role:admin', 'auth'])->group(function () {
    Route::get('/admin/invoices', ...);
});

// RIGHT: establish who they are, then what they may do.
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/invoices', ...);
});
?>

<?php
// bootstrap/app.php — order BETWEEN sources, when you cannot control the list

->withMiddleware(function (Middleware $middleware) {
    $middleware->priority([
        \\Illuminate\\Cookie\\Middleware\\EncryptCookies::class,
        \\Illuminate\\Session\\Middleware\\StartSession::class,
        \\Illuminate\\View\\Middleware\\ShareErrorsFromSession::class,
        \\Illuminate\\Auth\\Middleware\\Authenticate::class,
        \\App\\Http\\Middleware\\EnsureUserIsActive::class,   // needs the user
        \\Illuminate\\Routing\\Middleware\\SubstituteBindings::class,
    ]);
})
?>

<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Log;
use Symfony\\Component\\HttpFoundation\\Response;

class LogRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        // Part of producing the response. The user waits for this.
        return $next($request);
    }

    // Runs AFTER the response has been sent to the browser.
    // Good for quick fire-and-forget work like logging.
    // Not a queue: if it can be slow or fail, use a queued job instead.
    public function terminate(Request $request, Response $response): void
    {
        Log::info('Request completed', [
            'url'    => $request->url(),
            'method' => $request->method(),
            'status' => $response->status(),
            'user'   => $request->user()?->id,
        ]);
    }
}`,
      },
      keyTakeaways: [
        "Middleware nests: the <b>first one in is the last one out</b>.",
        "Route middleware runs in the order you list it, so read the list as a sentence.",
        "<b>`['role:admin', 'auth']` is a real bug</b>: the role check sees a null user and rejects everyone, including admins.",
        "The symptom of that bug is a 403 where you expected a login redirect.",
        "<b>`priority()`</b> fixes ordering between middleware arriving from different sources.",
        "<b>`terminate()`</b> runs after the response has been sent, so the user does not wait for it.",
        "`terminate()` is not a queue. Slow or failure-prone work belongs in a queued job.",
      ],
      commonMistakes: [
        "<b>Putting an authorization check before authentication.</b> `user()` is null, the check fails, and every request 403s including the ones that should succeed.",
        "<b>Debugging that 403 by looking at roles.</b> The roles are fine. The ordering is not.",
        "<b>Expecting a middleware to see the final response when it is registered last.</b> Last in means first out, so it unwinds before the others have touched the response.",
        "<b>Doing slow work in `terminate()`.</b> On some setups it still delays the worker, and there is no retry if it fails.",
        "<b>Using `terminate()` for anything that must not be lost.</b> There is no guarantee and no retry. Queue it.",
      ],
      quiz: [
        {
          question: "In what order does middleware unwind after the controller?",
          options: [
            "The same order it ran in",
            "Alphabetically",
            "Reverse order: first in, last out",
            "Randomly",
          ],
          correctIndex: 2,
          explanation: "Each middleware is still inside its own `handle()`, waiting for `$next` to return.",
        },
        {
          question: "What happens with `->middleware(['role:admin', 'auth'])`?",
          options: [
            "It works fine",
            "It throws an exception",
            "Laravel reorders it automatically",
            "The role check sees a null user and rejects everyone, including admins",
          ],
          correctIndex: 3,
          explanation: "The symptom is a 403 where you expected a login redirect.",
        },
        {
          question: "When does `terminate()` run?",
          options: [
            "After the response has been sent to the browser",
            "Instead of `handle()`",
            "Before the controller",
            "Only on failures",
          ],
          correctIndex: 0,
          explanation: "Which is why the user does not wait for it.",
        },
        {
          question: "Why should slow work not go in `terminate()`?",
          options: [
            "It is not allowed",
            "There is no retry and it can still delay the worker",
            "It runs twice",
            "It blocks the browser",
          ],
          correctIndex: 1,
          explanation: "Anything that must not be lost belongs in a queued job.",
        },
      ],
    },
    {
      id: "proxies-and-hosts",
      title: "Trusted proxies and trusted hosts",
      durationMinutes: 9,
      explanation: "Two pieces of middleware you will not write and will eventually need to configure. Both are about the same thing: deciding which parts of an incoming request you are willing to believe.\n\nA <b>trusted proxy</b> is a server you tell Laravel to believe, so the headers it adds about the real client IP and protocol are treated as true instead of ignored. A <b>trusted host</b> is a domain you tell Laravel to accept in a request's Host header, so a request claiming to come from any other domain is refused.\n\n---\n\n### 1. Basic — what a proxy does to your request\n\nIn production your application usually sits behind something:\n\n```text\nUser (203.0.113.10)\n      ↓\nCloudflare / load balancer (10.0.0.5)\n      ↓\nLaravel\n```\n\nLaravel's connection is with the load balancer, not the user. So by default:\n\n```php\n$request->ip();          // 10.0.0.5   the load balancer\n$request->isSecure();    // false      even though the user used HTTPS\n```\n\nThe real information is not lost; the proxy forwards it in headers:\n\n```text\nX-Forwarded-For    203.0.113.10\nX-Forwarded-Proto  https\nX-Forwarded-Host   invoicehub.com\n```\n\nLaravel ignores those headers unless you tell it the proxy is trustworthy. And it is right to: anyone can send an `X-Forwarded-For` header claiming to be any IP address. Believing it unconditionally would mean IP-based rate limiting and blocking could be bypassed by typing a header.\n\n<b>Trusted proxies</b> configuration says: when the request comes from <i>this</i> proxy, its forwarding headers can be believed.\n\n---\n\n### 2. Intermediate — configuring it, and what breaks without it\n\nIn `bootstrap/app.php`:\n\n```php\n->withMiddleware(function (Middleware $middleware) {\n    $middleware->trustProxies(at: [\n        '10.0.0.5',\n        '192.168.1.0/24',\n    ]);\n})\n```\n\nIf your application only ever receives traffic through a load balancer you control, trusting all of them is acceptable:\n\n```php\n$middleware->trustProxies(at: '*');\n```\n\nOnly when nothing can reach the application directly. If your origin server is also reachable on its public IP, `'*'` means anyone can spoof any header.\n\nThree things break in specific, confusing ways when this is not configured:\n\n```text\nRate limiting     every request looks like it came from the load\n                  balancer, so all your users share one bucket and\n                  throttle each other\n\nHTTPS detection   isSecure() is false, so Laravel generates http://\n                  URLs, which browsers then block as mixed content\n\nLogging           every log line and audit record shows the same\n                  internal IP, so you cannot trace anything\n```\n\nThat first one is worth dwelling on. `throttle:60,1` behind an unconfigured proxy is not sixty requests per user per minute. It is sixty requests <i>in total</i>, shared by everyone, because Laravel thinks every request came from the same address. It looks like a mysterious rate-limiting bug under load.\n\n---\n\n### 3. Advanced — trusted hosts\n\nThe other one concerns the `Host` header, which says which domain the request thinks it is for.\n\nLaravel uses that header to generate absolute URLs: password reset links, email links, redirects. And the header is supplied by the client, so it can be a lie:\n\n```text\nGET /forgot-password\nHost: attacker.example.com\n```\n\nIf nothing validates it, your application generates a reset link pointing at `attacker.example.com`, and emails it to a real user. They click a link in a genuine email from you and hand over their token. This class of bug is called host header injection.\n\n<b>Trusted hosts</b> validates the header against a list:\n\n```php\n->withMiddleware(function (Middleware $middleware) {\n    $middleware->trustHosts(at: [\n        'invoicehub.com',\n        'www.invoicehub.com',\n    ]);\n})\n```\n\nYou can include subdomains:\n\n```php\n$middleware->trustHosts(at: ['invoicehub.com'], subdomains: true);\n```\n\n```text\nIncoming Host header\n        ↓\n   in the list?\n   ┌────┴────┐\n  yes        no\n   ↓          ↓\n allow    400 Bad Request\n```\n\nWhether this matters depends on your setup: if your web server already rejects unknown hostnames before Laravel sees them, you have the same protection a layer earlier. Configuring both is cheap and means the application is safe wherever it is deployed.\n\nA related setting worth knowing:\n\n```php\n// config/app.php\n'url' => env('APP_URL', 'http://localhost'),\n```\n\nQueued jobs and Artisan commands have no incoming request to read a host from, so they build URLs from `APP_URL`. If your emailed links work from the browser and are wrong when sent from a queue worker, that is the setting to check.",
      diagram: `Why Laravel ignores forwarding headers by default

  User 203.0.113.10
        ↓
  Proxy 10.0.0.5      adds X-Forwarded-For: 203.0.113.10
        ↓
  Laravel             sees a connection from 10.0.0.5

  Believe the header unconditionally?
        ↓
  Anyone can send X-Forwarded-For: 1.2.3.4
        ↓
  IP blocking and rate limiting bypassed by typing a header

  trustProxies(at: [...]) = "from THIS proxy, believe them"


What silently breaks when it is not configured

  throttle:60,1   every request looks like the load balancer
                  → 60 requests TOTAL, shared by all users
                  → users throttle each other under load

  isSecure()      false, so links generate as http://
                  → browsers block them as mixed content

  logs            every entry shows the same internal IP


Host header injection

  GET /forgot-password
  Host: attacker.example.com        ← supplied by the client

  no trustHosts                     with trustHosts
        ↓                                 ↓
  reset link built for              Host not in the list
  attacker.example.com                    ↓
        ↓                           400 Bad Request
  emailed to a real user
        ↓
  they click a genuine email
  and hand over their token`,
      codeExample: {
        title: "Configuring proxies and hosts",
        code: `<?php
// bootstrap/app.php

use Illuminate\\Foundation\\Configuration\\Middleware;
use Illuminate\\Http\\Request;

->withMiddleware(function (Middleware $middleware) {

    // ---------- Trusted proxies ----------
    // Believe X-Forwarded-* headers, but only from these addresses.
    $middleware->trustProxies(at: [
        '10.0.0.5',
        '192.168.1.0/24',
    ]);

    // Trust any proxy. ONLY when nothing can reach the app directly.
    // If the origin is also reachable on its public IP, this lets
    // anyone spoof any forwarded header.
    $middleware->trustProxies(at: '*');

    // Choose which headers to honour, if your proxy differs.
    $middleware->trustProxies(headers: Request::HEADER_X_FORWARDED_FOR
        | Request::HEADER_X_FORWARDED_HOST
        | Request::HEADER_X_FORWARDED_PORT
        | Request::HEADER_X_FORWARDED_PROTO);


    // ---------- Trusted hosts ----------
    // Reject requests whose Host header is not one of ours, so a
    // forged Host cannot end up inside a password reset link.
    $middleware->trustHosts(at: [
        'invoicehub.com',
        'www.invoicehub.com',
    ]);

    // Include every subdomain of the listed hosts.
    $middleware->trustHosts(at: ['invoicehub.com'], subdomains: true);
})
?>

# ---------- Checking it worked ----------
# Behind a correctly configured proxy:
#   $request->ip()        the real client IP, not the load balancer
#   $request->isSecure()  true when the user connected over HTTPS
#   url('/invoices')      https://invoicehub.com/invoices

# .env — queued jobs and Artisan commands have no incoming request,
# so they build URLs from this instead of a Host header.
APP_URL=https://invoicehub.com`,
      },
      keyTakeaways: [
        "Behind a proxy, Laravel sees the <b>proxy's</b> IP and connection, not the user's.",
        "The real details arrive in `X-Forwarded-*` headers, which Laravel ignores until you say the proxy is trusted.",
        "That default is correct: anyone can forge those headers, so trusting them blindly defeats IP blocking.",
        "<b>`trustProxies(at: [...])`</b> configures it; `'*'` is only safe when nothing can reach the app directly.",
        "Unconfigured, `throttle:60,1` becomes 60 requests <b>shared by everyone</b>, because all requests look identical.",
        "It also breaks HTTPS detection, so generated links come out as `http://` and browsers block them.",
        "<b>`trustHosts(at: [...])`</b> rejects forged `Host` headers, preventing poisoned password reset links.",
        "Queued jobs have no request to read, so they build URLs from <b>`APP_URL`</b>.",
      ],
      commonMistakes: [
        "<b>Deploying behind a load balancer without configuring trusted proxies.</b> Rate limiting, HTTPS detection and logging all break quietly and at once.",
        "<b>Blaming the rate limiter when users throttle each other.</b> They share one bucket because every request appears to come from the proxy.",
        "<b>Using `trustProxies(at: '*')` on a server that is also publicly reachable.</b> Anyone can then spoof any forwarded header.",
        "<b>Chasing mixed-content errors in your asset pipeline.</b> If `isSecure()` is false behind a proxy, every generated URL is `http://`.",
        "<b>Leaving `APP_URL` at its default.</b> Links in queued emails point at `localhost`, while the same links work fine from the browser.",
      ],
      quiz: [
        {
          question: "Behind a load balancer, what does `$request->ip()` return by default?",
          options: [
            "The user's real IP",
            "The server's IP",
            "null",
            "The load balancer's IP",
          ],
          correctIndex: 3,
          explanation: "The real IP is in `X-Forwarded-For`, which Laravel ignores until the proxy is trusted.",
        },
        {
          question: "Why does Laravel ignore `X-Forwarded-For` by default?",
          options: [
            "It is slow to parse",
            "It is only for HTTPS",
            "It is deprecated",
            "Anyone can forge it, which would defeat IP blocking and rate limiting",
          ],
          correctIndex: 3,
          explanation: "Trusting it unconditionally would let a header bypass your protections.",
        },
        {
          question: "What happens to `throttle:60,1` behind an unconfigured proxy?",
          options: [
            "All users share one 60-request bucket and throttle each other",
            "It stops working entirely",
            "Each user gets 60 requests as normal",
            "It throws an exception",
          ],
          correctIndex: 0,
          explanation: "Every request appears to come from the same address.",
        },
        {
          question: "What does `trustHosts` prevent?",
          options: [
            "Slow requests",
            "CSRF attacks",
            "A forged Host header ending up in generated links such as password resets",
            "SQL injection",
          ],
          correctIndex: 2,
          explanation: "The user clicks a genuine email from you and lands on the attacker's domain.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is middleware?",
      options: [
        "A database layer",
        "A checkpoint between the request and your controller",
        "A template engine",
        "A routing method",
      ],
      correctIndex: 1,
      explanation: "Its defining ability is stopping a request before the controller runs.",
    },
    {
      question: "How does middleware relate to the controller?",
      options: [
        "It wraps the controller: down on the way in, back up on the way out",
        "It replaces the controller",
        "It runs before and stops",
        "It runs only after",
      ],
      correctIndex: 0,
      explanation: "Which is why the same middleware can also modify the response.",
    },
    {
      question: "What does `$next($request)` represent?",
      options: [
        "The response object",
        "The previous middleware",
        "The rest of the application: later middleware and the controller",
        "The route",
      ],
      correctIndex: 2,
      explanation: "The line returns a response once everything downstream has run.",
    },
    {
      question: "How do you make code run after the controller?",
      options: [
        "Use an `after()` method",
        "It is not possible",
        "Use `terminate()` only",
        "Put it after `$next($request)`",
      ],
      correctIndex: 3,
      explanation: "The position of `$next` is the only thing that decides before or after.",
    },
    {
      question: "How do you block a request in middleware?",
      options: [
        "Return `false`",
        "Call `$next(null)`",
        "Do not call `$next`; return a response instead",
        "Throw any exception",
      ],
      correctIndex: 2,
      explanation: "Everything downstream is then skipped entirely.",
    },
    {
      question: "Your middleware calls `$next($request)` without returning it. What happens?",
      options: [
        "A 500 error",
        "The app runs and the browser gets a blank page",
        "The request is blocked",
        "Laravel returns it for you",
      ],
      correctIndex: 1,
      explanation: "No error is raised, which is what makes it hard to find.",
    },
    {
      question: "Which command creates a middleware class?",
      options: [
        "`composer require middleware`",
        "`php artisan new:middleware`",
        "`php artisan middleware:make`",
        "`php artisan make:middleware Name`",
      ],
      correctIndex: 3,
      explanation: "It lands in `app/Http/Middleware/`.",
    },
    {
      question: "What does `$request->expectsJson()` let one middleware do?",
      options: [
        "Force JSON output",
        "Parse the request body",
        "Validate JSON",
        "Redirect browsers and return 401 JSON to API clients",
      ],
      correctIndex: 3,
      explanation: "The same guard then behaves correctly for both kinds of caller.",
    },
    {
      question: "Where is middleware registered in a modern Laravel application?",
      options: [
        "`app/Http/Kernel.php`",
        "`bootstrap/app.php`",
        "`config/middleware.php`",
        "`routes/web.php`",
      ],
      correctIndex: 1,
      explanation: "`Kernel.php` was the old location and no longer exists.",
    },
    {
      question: "What is the difference between `append()` and `prepend()`?",
      options: [
        "Append is faster",
        "Prepend runs before Laravel's own middleware, append runs after",
        "Prepend is for APIs",
        "There is none",
      ],
      correctIndex: 1,
      explanation: "Something like ForceHttps must prepend to be useful.",
    },
    {
      question: "What does `alias()` do?",
      options: [
        "Renames a route",
        "Creates a group",
        "Gives a middleware class a short name for route files",
        "Duplicates middleware",
      ],
      correctIndex: 2,
      explanation: "`auth`, `guest` and `throttle` are aliases Laravel defines for you.",
    },
    {
      question: "Why do `web.php` routes have sessions while `api.php` routes do not?",
      options: [
        "They run through different middleware groups",
        "Different route files are cached differently",
        "APIs cannot use sessions",
        "It is a configuration bug",
      ],
      correctIndex: 0,
      explanation: "The `web` group includes session and CSRF middleware; the `api` group is stateless.",
    },
    {
      question: "How does a middleware receive `'role:admin'`?",
      options: [
        "Through the constructor",
        "Via `$request->input()`",
        "As an argument after `$next`",
        "As a route parameter",
      ],
      correctIndex: 2,
      explanation: "The signature becomes `handle($request, $next, $role)`.",
    },
    {
      question: "What does `#[WithoutMiddleware]` do?",
      options: [
        "Removes middleware from a route or method",
        "Adds middleware",
        "Reorders middleware",
        "Disables all middleware",
      ],
      correctIndex: 0,
      explanation: "It removes protection, so it should be rare and obviously named.",
    },
    {
      question: "In what order does middleware unwind after the controller?",
      options: [
        "The same order it ran in",
        "Alphabetically",
        "Reverse order: first in, last out",
        "By priority only",
      ],
      correctIndex: 2,
      explanation: "Each middleware is still inside its own `handle()` waiting for `$next` to return.",
    },
    {
      question: "What is wrong with `->middleware(['role:admin', 'auth'])`?",
      options: [
        "Nothing",
        "It needs a group",
        "Roles cannot be checked in middleware",
        "The role check runs before anyone is authenticated, so it rejects everyone",
      ],
      correctIndex: 3,
      explanation: "The symptom is a 403 where you expected a login redirect.",
    },
    {
      question: "When does `terminate()` run?",
      options: [
        "Before the controller",
        "Only on errors",
        "Instead of `handle()`",
        "After the response has been sent to the browser",
      ],
      correctIndex: 3,
      explanation: "Which is why the user does not wait for it.",
    },
    {
      question: "Why should slow work not go in `terminate()`?",
      options: [
        "There is no retry and it can still delay the worker",
        "It runs twice",
        "It is not allowed",
        "It blocks the browser",
      ],
      correctIndex: 0,
      explanation: "Anything that must not be lost belongs in a queued job.",
    },
    {
      question: "What breaks when trusted proxies are not configured behind a load balancer?",
      options: [
        "Nothing",
        "Rate limiting, HTTPS detection and logging all break quietly",
        "Routing stops working",
        "Sessions are disabled",
      ],
      correctIndex: 1,
      explanation: "All users share one rate-limit bucket because every request looks identical.",
    },
    {
      question: "What does `trustHosts` prevent?",
      options: [
        "A forged Host header ending up in generated links",
        "SQL injection",
        "CSRF attacks",
        "Slow queries",
      ],
      correctIndex: 0,
      explanation: "Otherwise a password reset link can be built for an attacker's domain.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Put real checkpoints in front of the app, and see what runs when.",
    brief: "You wrote one middleware on Day 3 without much explanation of how it worked. Today you build the layer properly.\n\nInvoiceHub still has no database and no real authentication, which is fine. You can build and register every kind of middleware here against a fake user in the session, and everything you write will keep working when real auth arrives on Day 14. The goal today is to feel the ordering, not to secure anything for production.",
    steps: [
      "Create `MeasureDuration` with `php artisan make:middleware MeasureDuration`. Record the time before `$next`, and set an `X-Duration` header after it. Append it to the `web` group in `bootstrap/app.php` and confirm the header appears in your browser's network tab.",
      "Deliberately break it: remove the `return` from in front of `$next($request)` and reload. You should get a blank page with no error. Put it back, and remember what that symptom means.",
      "Create `EnsureUserHasRole` taking a variadic `string ...$roles`. For now, read a fake role out of the session, defaulting to `guest`. Give it a `using()` static helper.",
      "Alias it as `role` in `bootstrap/app.php` and protect your admin group from Day 4 with `role:admin`.",
      "Add a quick route that sets `session(['role' => 'admin'])` and another that clears it, so you can switch between admin and guest while testing.",
      "Define a `group('admin', [...])` bundle containing your role check plus anything else the admin section needs, and use the single word `admin` on the group instead of listing them.",
      "Create `LogRequest` with an empty `handle()` and a `terminate()` that logs the URL and response status. Watch `storage/logs/laravel.log` and confirm entries appear after pages load.",
      "Prove ordering to yourself: write two throwaway middleware that each log on the way in and on the way out, register both on one route, and read the log. You should see A-in, B-in, B-out, A-out.",
      "Set `trustProxies(at: '*')` and `trustHosts(at: ['localhost', '127.0.0.1'])` in `bootstrap/app.php`. Then request the site with a bogus `Host` header using `curl -H \"Host: evil.test\" http://127.0.0.1:8000/invoices` and confirm it is rejected.",
    ],
    acceptance: [
      "Every page response carries an `X-Duration` header.",
      "Visiting the admin section as a guest is rejected, and works after you set the session role to admin.",
      "You can explain, from your own log output, why the order is A-in, B-in, B-out, A-out.",
      "`storage/logs/laravel.log` gains an entry per request, written from `terminate()` rather than `handle()`.",
      "A request with a forged `Host` header is rejected before it reaches any controller.",
      "`php artisan route:list -v` shows the middleware you expect on the admin routes, and nothing unexpected elsewhere.",
    ],
    stretch: [
      "Swap your role middleware order to `['role:admin', 'auth']` once real auth exists on Day 14, observe the 403, and confirm it matches the ordering bug from this lesson.",
      "Write `NormaliseInvoiceInput` that upper-cases the invoice number with `$request->merge()`, and prove the controller sees the cleaned value.",
      "Add `throttle:5,1` to the pay route and hit it six times quickly to see the 429.",
    ],
  },
};
