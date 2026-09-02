import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_11_LESSONS: LessonDay = {
  day: 11,
  title: "Error handling & logging",
  totalMinutes: 67,
  difficulty: "Beginner",
  lessons: [
    {
      id: "exceptions-and-where-handling-lives",
      title: "Exceptions, and where handling lives",
      durationMinutes: 10,
      explanation: "Every application eventually breaks. Someone visits `/invoices/999999` for an invoice that does not exist, or the database connection drops mid-request. What happens next is not luck, it is something you configure.\n\nAn <b>exception</b> (an object representing a problem that interrupts normal program execution) is what your code throws when it cannot carry on:\n\n```php\nthrow new Exception('Something went wrong.');\n```\n\nLaravel splits what happens next into two systems, and the split is the whole day:\n\n• <b>Error handling</b> — what should the <i>user</i> receive?\n  ↳ A friendly 404 page, a JSON error body, a redirect back with a message\n• <b>Logging</b> — what should <i>developers</i> record?\n  ↳ A line in a file, a Slack alert, a message shipped to a log service\n\nThe same failure usually needs both, and they are answered by different code.\n\n---\n\n### 1. Basic — one failure, two audiences\n\nA payment fails. The user should see \"We could not complete your payment, please try again.\" You should see the payment ID, the user ID, the provider's response and a stack trace.\n\nThose are two completely different messages for two completely different audiences, which is why Laravel keeps them in two systems. Mix them up and you get the two classic failures: a user staring at a stack trace, or a developer staring at a log line that says nothing but `Payment failed`.\n\n```text\nRequest → Controller → Application → something fails\n                                          │\n                                     Exception\n                                          │\n                    ┌─────────────────────┴─────────────────────┐\n                    ↓                                           ↓\n                 report()                                    render()\n                    ↓                                           ↓\n            log file / Slack                              HTTP response\n                    ↓                                           ↓\n               developers                                 user / browser\n```\n\nShow developers the details. Do not show users your internals.\n\n---\n\n### 2. Intermediate — what throwing actually does\n\nThrowing stops the current method immediately and hands control upwards, looking for something willing to catch it. If nothing does, the exception reaches Laravel, and Laravel's exception handling decides what happens instead of the application simply dying without explanation.\n\n```text\nApplication → something goes wrong → throw\n                                       │\n                           caught by your code?\n                            │                │\n                           YES               NO\n                            │                │\n                     you handle it     Laravel handles it\n                                             │\n                                             ↓\n                                   report + render → response\n```\n\nSo an \"unhandled exception\" does not really mean nothing handled it. It means Laravel handled it with its defaults, and today is about replacing those defaults with your own choices.\n\n---\n\n### 3. Advanced — where handling is configured\n\nIn modern Laravel, exception handling is configured in `bootstrap/app.php`. That one file holds routing, middleware, exceptions and the rest of the application's wiring. Older Laravel put this in a dedicated handler class, so tutorials pointing you at `app/Exceptions/Handler.php` are describing the previous arrangement.\n\n```php\nuse Illuminate\\Foundation\\Configuration\\Exceptions;\n\nreturn Application::configure(basePath: dirname(__DIR__))\n    ->withExceptions(function (Exceptions $exceptions) {\n        // report(...)      what should we record?\n        // render(...)      what should the user receive?\n        // dontReport(...)  what should we stay quiet about?\n    })\n    ->create();\n```\n\nThe `$exceptions` object passed into that closure is where you say how Laravel should report, render and otherwise handle what goes wrong.\n\nKeep this list next to you for the rest of the day. It is the whole vocabulary:\n\n```text\n$exceptions->report()      what should happen when this is reported?\n$exceptions->render()      what response should the user receive?\n$exceptions->dontReport()  do not send this one through reporting\nLog::error()               something failed, record useful information\nLog::withContext()         attach fields to every log line after this\nContext::add()             carry data through the work, into queued jobs\nAPP_DEBUG=false            production must not expose your internals\n```\n\nOne sentence: exception handling decides how Laravel responds when something goes wrong, and logging records enough for you to work out why.",
      diagram: `One failure, two paths

  Request → Controller → Application → something fails
                                            │
                                       Exception
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ↓                                               ↓
                 report()                                        render()
                    │                                               │
                    ↓                                               ↓
            log file / Slack                                  HTTP response
                    │                                               │
                    ↓                                               ↓
               developers                                    user / browser

  Show developers the details. Do not show users your internals.


The path of a thrown exception

  Application → something goes wrong → throw
                                         │
                             caught by your code?
                              │                │
                             YES               NO
                              │                │
                       you handle it     Laravel handles it
                                               │
                                               ↓
                                     report + render → response

  "Unhandled" means Laravel used its defaults, not that nobody handled it.


Where the configuration lives

  modern Laravel     bootstrap/app.php  →  withExceptions(...)
  older Laravel      app/Exceptions/Handler.php

  A tutorial pointing at Handler.php is describing the old arrangement.`,
      codeExample: {
        title: "bootstrap/app.php, the one place handling is wired",
        code: `<?php
// bootstrap/app.php

use Illuminate\\Foundation\\Application;
use Illuminate\\Foundation\\Configuration\\Exceptions;
use Illuminate\\Foundation\\Configuration\\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // report(...)      what should we record, for developers?
        // render(...)      what should we send back, to the user?
        // dontReport(...)  what should we deliberately stay quiet about?
    })
    ->create();


// ---------- Throwing one ----------

// Throwing stops this method immediately and hands control upwards.
if (! $invoice) {
    throw new Exception('Invoice could not be loaded.');
}

// Anything after the throw never runs.


// ---------- Catching one ----------

try {
    $invoice = $this->loadInvoice($id);
} catch (Exception $e) {
    // You handled it, so Laravel never sees it.
    return back()->with('error', 'We could not load that invoice.');
}

// If nothing catches it, the exception reaches Laravel and the
// withExceptions() configuration above decides what happens.`,
      },
      keyTakeaways: [
        "An <b>exception</b> is an object representing a problem that interrupts normal program execution.",
        "`throw` stops the current method immediately and hands control upwards, looking for a catch.",
        "If nothing catches it, the exception reaches Laravel, which reports and renders it.",
        "Laravel splits the problem in two: <b>error handling</b> is for the user, <b>logging</b> is for developers.",
        "The same failure usually needs both, and they are answered by different code.",
        "<b>Exception handling is configured in `bootstrap/app.php`</b> via `withExceptions()`.",
        "`app/Exceptions/Handler.php` is the older arrangement, so tutorials mentioning it are out of date.",
      ],
      commonMistakes: [
        "<b>Showing the user what belongs in a log.</b> A stack trace on screen tells them nothing and tells an attacker plenty.",
        "<b>Logging what belongs in the response.</b> `Payment failed` with no detail helps nobody at 2am.",
        "<b>Looking for `app/Exceptions/Handler.php` in a new project.</b> Handling moved into `bootstrap/app.php`.",
        "<b>Writing code after a `throw` and expecting it to run.</b> Throwing leaves the method there and then.",
        "<b>Catching an exception just to hide it.</b> An empty `catch` block turns a failure into silence.",
      ],
      quiz: [
        {
          question: "What happens when nothing in your code catches a thrown exception?",
          options: [
            "The request continues without the failed step",
            "PHP returns null",
            "It reaches Laravel, which reports and renders it",
            "The exception is discarded",
          ],
          correctIndex: 2,
          explanation: "Which is why \"unhandled\" really means \"handled by Laravel's defaults\".",
        },
        {
          question: "Where is exception handling configured in modern Laravel?",
          options: [
            "`bootstrap/app.php`, in `withExceptions()`",
            "`app/Exceptions/Handler.php`",
            "`config/logging.php`",
            "`routes/web.php`",
          ],
          correctIndex: 0,
          explanation: "The dedicated handler class is the previous arrangement.",
        },
        {
          question: "Why does Laravel keep error handling and logging as two systems?",
          options: [
            "For performance",
            "They serve two different audiences: the user and the developer",
            "Because logging is optional",
            "One replaced the other",
          ],
          correctIndex: 1,
          explanation: "The user needs a friendly response; you need every detail you can gather.",
        },
        {
          question: "What does `throw` do to the current method?",
          options: [
            "Returns false from it",
            "Retries it",
            "Ends it immediately and hands control upwards",
            "Logs a warning and continues",
          ],
          correctIndex: 2,
          explanation: "Nothing after the throw runs.",
        },
      ],
    },
    {
      id: "report-vs-render",
      title: "report() vs render() — the central distinction",
      durationMinutes: 11,
      explanation: "This is the lesson the rest of the day leans on, so it is worth being slow about.\n\n<b>Reporting</b> (deciding what happens to an exception for the sake of developers) means logging it, notifying someone, or shipping it to an error tracker. <b>Rendering</b> (turning that same exception into an HTTP response) is what the user actually receives.\n\nThe quickest way to remember it: report is for the log, render is for the browser.\n\n---\n\n### 1. Basic — two questions, one exception\n\n```text\n                    report()                      render()\n                    ────────                      ────────\nThe question        What should we record?        What should we send back?\nAudience            Developers and operations     The user or the API client\nTypical output      A log line, a Slack alert,    An error page, a JSON\n                    an error tracker entry        body, a redirect\nDetail level        As much as you can gather     Only what is safe to show\nIf you skip it      The failure happens           Laravel falls back to its\n                    invisibly                     default error response\n```\n\nRead the last row twice, because it is where the two differ in a way that matters. Skipping `render()` is often fine: Laravel's default response is reasonable. Skipping `report()` means the failure happens and nobody ever knows.\n\n---\n\n### 2. Intermediate — they are independent\n\nOne exception can be reported to Slack and rendered as a polite page. Or reported and left to Laravel's default response. Or rendered nicely and never reported at all. You are answering two questions, and you can answer either one, both, or neither.\n\n```php\n->withExceptions(function (Exceptions $exceptions) {\n\n    // Developers: record it with everything useful attached.\n    $exceptions->report(function (PaymentFailed $e) {\n        Log::error('Payment failed', ['payment_id' => $e->paymentId]);\n    });\n\n    // Users: send back something they can act on.\n    $exceptions->render(function (PaymentFailed $e, Request $request) {\n        return response()->view('errors.payment-failed', [], 500);\n    });\n})\n```\n\n```text\nPaymentFailed\n   ├──→ report()  →  Log / Slack     →  developers\n   └──→ render()  →  friendly page   →  user\n```\n\nNotice the type-hint. Each closure names the exception class it cares about, and Laravel only calls it for that class. That is how one file can hold different treatment for a dozen different failures without a single `if`.\n\n---\n\n### 3. Advanced — the render closure is a normal response\n\nA `render()` closure returns whatever a controller could return, so the request type decides the shape:\n\n```php\n$exceptions->render(function (InvoiceNotFound $e, Request $request) {\n    if ($request->expectsJson()) {\n        return response()->json(['message' => 'Invoice not found.'], 404);\n    }\n\n    return response()->view('errors.404', [], 404);\n});\n```\n\n`expectsJson()` is the same request-inspection you saw on Day 9, where validation returns a redirect to a browser and a 422 to an API client. Same idea, your own exception.\n\nTwo details that save time later.\n\nReturning nothing from a `render()` closure lets Laravel carry on to its default handling, so you can render a special response only in some cases and let everything else fall through.\n\nAnd `report()` closures do not replace the default log entry unless you say so. If you find one failure appearing twice in your log, that is usually a custom `report()` plus Laravel's own reporting both running. Laravel exposes a `stop()` on the returned reportable when you genuinely want yours to be the only one; the principle to hold onto is that reporting is a pipeline, not a single slot.",
      diagram: `Two questions about the same exception

                    report()                    render()
                    ────────                    ────────
  question          what should we record?      what should we send back?
  audience          developers, operations      the user / API client
  output            log line, Slack alert       error page, JSON, redirect
  detail            as much as you can get      only what is safe to show
  skip it           the failure is INVISIBLE    Laravel uses its default

  Skipping render() is often fine.
  Skipping report() means nobody ever finds out.


They are independent

  PaymentFailed
     ├──→ report()  →  Log / Slack      →  developers get the detail
     └──→ render()  →  friendly page    →  user gets something to act on

  report only      recorded, default response shown
  render only      pretty page, nobody told
  both             the usual choice for a real failure


The render closure is just a response

  $request->expectsJson()
        │                 │
       YES                NO
        │                 │
  404 JSON body     errors/404.blade.php

  Same request-inspection Day 9's validation uses
  to choose between 422 JSON and a redirect back.`,
      codeExample: {
        title: "Configuring both for one exception",
        code: `<?php
// bootstrap/app.php

use App\\Exceptions\\InvoiceNotFound;
use App\\Exceptions\\PaymentFailed;
use Illuminate\\Foundation\\Configuration\\Exceptions;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withExceptions(function (Exceptions $exceptions) {

        // ---------- report(): for developers ----------
        // Everything useful, because nobody outside sees this.
        $exceptions->report(function (PaymentFailed $e) {
            Log::error('Payment failed', [
                'payment_id' => $e->paymentId,
                'user_id'    => $e->userId,
                'provider'   => $e->providerResponse,
            ]);
        });

        // ---------- render(): for the user ----------
        // Only what is safe to show, and something they can act on.
        $exceptions->render(function (PaymentFailed $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'We could not complete your payment.',
                ], 500);
            }

            return response()->view('errors.payment-failed', [], 500);
        });

        // The closure type-hint is the filter. This one only runs for
        // InvoiceNotFound, so no if-statement is needed.
        $exceptions->render(function (InvoiceNotFound $e, Request $request) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Invoice not found.'], 404)
                : response()->view('errors.404', [], 404);
        });
    })
    ->create();


// ---------- Choosing what to configure ----------
//
// report() only    recorded fully, user gets Laravel's default response
// render() only    friendly response, but nothing is recorded
// both             the normal choice for a failure that is your fault
// neither          Laravel's defaults: logged, generic error page
//
// Returning nothing from a render() closure lets Laravel carry on with
// its default handling, so you can special-case only what you mean to.`,
      },
      keyTakeaways: [
        "<b>`report()` answers \"what should we record?\"</b> Its audience is you, so attach everything.",
        "<b>`render()` answers \"what should we send back?\"</b> Its audience is the user, so show only what is safe.",
        "They are <b>independent</b>: an exception can use one, both, or neither.",
        "Skipping `render()` is often fine, because Laravel's default response is reasonable.",
        "<b>Skipping `report()` means the failure happens invisibly</b>, which is the expensive mistake.",
        "The closure's <b>type-hint is the filter</b>, so Laravel only calls it for that exception class.",
        "A `render()` closure returns a normal response, so `expectsJson()` lets you serve pages and APIs from one place.",
      ],
      commonMistakes: [
        "<b>Thinking `render()` also records the failure.</b> It only builds the response; nothing reaches your log.",
        "<b>Putting user-facing wording in `report()` and internals in `render()`.</b> That is the two audiences swapped.",
        "<b>Returning a view from `render()` for an API client.</b> Check `expectsJson()` and return JSON instead.",
        "<b>Wondering why one failure appears twice in the log.</b> A custom `report()` runs alongside Laravel's own reporting.",
        "<b>Writing one giant `render()` closure with a chain of `instanceof` checks.</b> Type-hint separate closures and let Laravel do the matching.",
      ],
      quiz: [
        {
          question: "What question does `report()` answer?",
          options: [
            "What response should the user receive?",
            "What should we record, for developers?",
            "Should this exception be thrown?",
            "Which status code applies?",
          ],
          correctIndex: 1,
          explanation: "Report is for the log, render is for the browser.",
        },
        {
          question: "What happens if you configure `report()` but not `render()`?",
          options: [
            "The exception is swallowed",
            "The user sees a stack trace regardless of APP_DEBUG",
            "The failure is recorded and Laravel returns its default error response",
            "Nothing is recorded",
          ],
          correctIndex: 2,
          explanation: "Which is frequently all you need.",
        },
        {
          question: "How does Laravel know which `render()` closure to call?",
          options: [
            "It calls all of them in order",
            "From the exception class you type-hint in the closure",
            "From the status code",
            "You register it by name in config",
          ],
          correctIndex: 1,
          explanation: "That is what keeps a dozen failures apart with no if-statements.",
        },
        {
          question: "Inside a `render()` closure, how do you serve JSON to an API client and a page to a browser?",
          options: [
            "Check `$request->expectsJson()`",
            "Register two closures for the same class",
            "Set a config flag",
            "You cannot; render is HTML only",
          ],
          correctIndex: 0,
          explanation: "The same request-inspection validation uses to pick 422 JSON over a redirect.",
        },
      ],
    },
    {
      id: "dontreport-and-custom-exceptions",
      title: "dontReport() and custom exception classes",
      durationMinutes: 12,
      explanation: "Two tools that sound unrelated and are actually the same idea: telling your application which failures are which.\n\n<b>`dontReport()`</b> (a list of exception classes Laravel should skip normal reporting for) quietens the expected. A <b>custom exception class</b> (your own exception type, named after the thing that went wrong) is what makes \"expected\" something your code can recognise in the first place.\n\n---\n\n### 1. Basic — not everything deserves a log entry\n\nSome exceptions are ordinary, expected outcomes that happen to travel as exceptions, and letting them pile up buries the failures you actually need to see.\n\n```php\n$exceptions->dontReport([\n    SomeExpectedException::class,\n]);\n```\n\nNote carefully what it does <i>not</i> do. The exception is still thrown, still handled, still rendered into a response. Only the recording step is skipped, so the user's experience does not change at all.\n\n```text\nException thrown\n      │\nshould developers know about this?\n      │                        │\n     YES                      NO\n      │                        │\n   report()             dontReport()\n      │                        │\n   log / alert         nothing recorded\n      │                        │\n      └────────→ still rendered ←────────┘\n```\n\nGood reasons to reach for it:\n\n• Invalid user input you already handle by showing a message\n• A business restriction being hit, such as a plan limit or a closed booking window\n• A known temporary condition your code already retries\n\nAnd the bad reason, which is the common one: the logs are noisy and you want quiet. That is hiding a bug, not fixing it. <b>Never use `dontReport()` to quieten a real bug.</b> Frequent exceptions are telling you something, and silencing one deletes the only evidence you had.\n\n---\n\n### 2. Intermediate — naming the failure\n\nArtisan generates an exception class:\n\n```bash\nphp artisan make:exception PaymentFailed\n```\n\n```text\napp/Exceptions/PaymentFailed.php\n```\n\nThe gain is recognition:\n\n```php\nthrow new Exception('Payment failed');   // just a message\nthrow new PaymentFailed(...);            // a type your code can recognise\n```\n\nA string is something nothing can act on reliably. A type can be singled out by a `catch (PaymentFailed $e)`, a `report()` closure, a `render()` closure or a `dontReport()` entry, and treated differently from every other failure. In a small application this looks like ceremony; in a large one it is how error handling stays organised.\n\nA useful signal that it is time: you find yourself matching on the message text, or writing a comment to explain which kind of failure a generic exception represents.\n\nGive the class the data the handler will want, rather than stuffing it into the message:\n\n```php\nclass PaymentFailed extends Exception\n{\n    public function __construct(public readonly int $paymentId)\n    {\n        parent::__construct('The payment provider rejected the payment.');\n    }\n}\n```\n\nNow `report()` can log `$e->paymentId` instead of parsing a sentence.\n\n---\n\n### 3. Advanced — an exception that handles itself\n\nAn exception can carry its own `report()` and `render()` methods. Laravel looks for them and uses them, so you register nothing in `bootstrap/app.php`.\n\n```php\nclass PaymentFailed extends Exception\n{\n    public function report(): void\n    {\n        Log::error('Payment failed', ['message' => $this->getMessage()]);\n    }\n\n    public function render($request)\n    {\n        return response()->view('errors.payment-failed', [], 500);\n    }\n}\n```\n\nThrown from a service several calls deep, the developer gets the detail and the user gets a friendly message, and nobody had to wire the two together at the call site.\n\nWhich to choose is a matter of where the behaviour belongs:\n\n```text\nMethods on the class            Closures in bootstrap/app.php\n────────────────────            ─────────────────────────────\neverything about this           handling for several exceptions\nfailure in one file             in one central place\nreads well when the             reads better when they share\nhandling is specific to it      the same treatment\n```\n\nBoth are normal, and a real application uses both.",
      diagram: `dontReport() skips the recording step ONLY

  Exception thrown
        │
  should developers know about this?
        │                        │
       YES                      NO
        │                        │
     report()             dontReport()
        │                        │
     log / alert         nothing recorded
        │                        │
        └────────→ still rendered ←────────┘

  The user's experience is identical either way.


Good reason vs bad reason

  GOOD   expected input error you already message about
  GOOD   a plan limit or closed booking window
  GOOD   a temporary condition your code already retries

  BAD    "the logs are noisy and I want quiet"
         → that is hiding a bug and deleting the evidence


Why a named exception beats a message

  throw new Exception('Payment failed')   →  a string
  throw new PaymentFailed($paymentId)     →  a TYPE

  a type can be singled out by:
    catch (PaymentFailed $e)
    $exceptions->report(fn (PaymentFailed $e) => ...)
    $exceptions->render(fn (PaymentFailed $e) => ...)
    $exceptions->dontReport([PaymentFailed::class])

  Signal that it is time: you start matching on message text.


Where the handling belongs

  report()/render() ON THE CLASS      closures in bootstrap/app.php
  ──────────────────────────────      ─────────────────────────────
  one failure, one file               several failures, one place
  specific handling                   shared treatment`,
      codeExample: {
        title: "An exception that reports and renders itself",
        code: `<?php
// php artisan make:exception PaymentFailed
// → app/Exceptions/PaymentFailed.php

namespace App\\Exceptions;

use Exception;
use Illuminate\\Support\\Facades\\Log;

class PaymentFailed extends Exception
{
    // Carry the data the handler will want, instead of hiding it
    // inside the message text where nothing can read it back.
    public function __construct(
        public readonly int $paymentId,
        public readonly ?string $providerResponse = null,
    ) {
        parent::__construct('The payment provider rejected the payment.');
    }

    // Laravel finds and calls this. Nothing to register.
    public function report(): void
    {
        Log::error('Payment failed', [
            'payment_id' => $this->paymentId,
            'provider'   => $this->providerResponse,
        ]);
    }

    // And this. The user never sees the two fields above.
    public function render($request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'We could not complete your payment.',
            ], 500);
        }

        return response()->view('errors.payment-failed', [], 500);
    }
}
?>

<?php
// ---------- Throwing it, several calls deep ----------

class PaymentService
{
    public function charge(Payment $payment): void
    {
        $result = $this->provider->charge($payment->amount);

        if (! $result->successful()) {
            // The controller does not need to know what happens next.
            throw new PaymentFailed($payment->id, $result->body());
        }
    }
}
?>

<?php
// ---------- dontReport(): quieten the EXPECTED ----------
// bootstrap/app.php

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->dontReport([
        // A plan limit being reached is expected behaviour, not a failure.
        PlanLimitReached::class,

        // The booking window closed. The user is told; we need no log line.
        BookingWindowClosed::class,
    ]);

    // NOT this. If something fails often enough to be annoying in the
    // logs, that is information. Silencing it removes the only evidence.
    // $exceptions->dontReport([DatabaseConnectionFailed::class]);
})

// dontReport() skips reporting only. The exception is still thrown,
// still handled, and still rendered into a response for the user.`,
      },
      keyTakeaways: [
        "<b>`dontReport()` skips the recording step only.</b> The exception is still thrown, handled and rendered.",
        "Use it for expected outcomes: handled input errors, plan limits, conditions you already retry.",
        "<b>Never use it to quieten a real bug.</b> A frequent exception is information, and silencing it deletes the evidence.",
        "`php artisan make:exception PaymentFailed` creates a named exception in `app/Exceptions`.",
        "A message is a string nothing can act on; a <b>class is a type</b> that `catch`, `report`, `render` and `dontReport` can single out.",
        "Put the failure's data on the class as properties, so `report()` logs fields rather than parsing a sentence.",
        "An exception can define its own <b>`report()` and `render()` methods</b>, and Laravel uses them with no registration.",
        "Methods on the class keep one failure in one file; closures in `bootstrap/app.php` suit exceptions sharing one treatment.",
      ],
      commonMistakes: [
        "<b>Using `dontReport()` because the logs are noisy.</b> That hides a bug and destroys the only evidence you had.",
        "<b>Thinking `dontReport()` stops the response too.</b> The user still gets exactly the same response as before.",
        "<b>Matching on `$e->getMessage()` text to decide what a failure was.</b> That is the moment to create a class.",
        "<b>Stuffing identifiers into the message string.</b> Put them on the class as properties so handlers can read them.",
        "<b>Registering a closure in `bootstrap/app.php` for an exception that already has `report()` and `render()`.</b> You now have two places to look and possibly two log entries.",
      ],
      quiz: [
        {
          question: "What does `dontReport()` change about the user's experience?",
          options: [
            "The exception is swallowed silently",
            "Nothing, because only the recording step is skipped",
            "They get a 204 response",
            "They see a generic page instead of a custom one",
          ],
          correctIndex: 1,
          explanation: "The exception is still thrown, handled and rendered.",
        },
        {
          question: "Which is a bad reason to add a class to `dontReport()`?",
          options: [
            "A plan limit was reached, and the user is told",
            "A validation-style input error you already message about",
            "The logs are noisy and you want them quiet",
            "A temporary condition your code already retries",
          ],
          correctIndex: 2,
          explanation: "Frequent exceptions are telling you something; silencing one removes the evidence.",
        },
        {
          question: "What do you actually gain from a custom exception class?",
          options: [
            "Better performance",
            "Automatic logging",
            "A type your code can recognise and treat differently",
            "A shorter stack trace",
          ],
          correctIndex: 2,
          explanation: "A message is a string, and nothing can act on a string reliably.",
        },
        {
          question: "What happens if an exception class defines its own `report()` and `render()`?",
          options: [
            "Laravel finds and uses them, with nothing to register",
            "They are ignored unless registered in `bootstrap/app.php`",
            "Only `render()` is used",
            "They must be static",
          ],
          correctIndex: 0,
          explanation: "Which keeps everything about that one failure in a single file.",
        },
      ],
    },
    {
      id: "error-pages-and-statuses",
      title: "Custom error pages & HTTP status codes",
      durationMinutes: 10,
      explanation: "Laravel's default error page is fine for you and wrong for a customer. Replacing it takes one file.\n\nAn <b>error view</b> (a Blade file in `resources/views/errors/` named after a status code) is what Laravel renders for that status. An <b>HTTP exception</b> (an exception representing an HTTP error such as 404, 403 or 500) is how you stop a request with a specific status on purpose.\n\n---\n\n### 1. Basic — the filename is the configuration\n\nCreate `resources/views/errors/404.blade.php` and every 404 in your application uses it. No registration, no config entry, just the file being there.\n\n```text\nresources/views/errors/\n  ├── 403.blade.php\n  ├── 404.blade.php\n  └── 500.blade.php\n```\n\nThese are ordinary Blade views, so they can extend your layout and look like the rest of the site:\n\n```blade\n{{-- 404: the thing you asked for does not exist --}}\n<h1>Page not found</h1>\n<p>Sorry, we couldn't find the page you're looking for.</p>\n<a href=\"{{ route('home') }}\">Go home</a>\n```\n\n```blade\n{{-- 500: we broke, and it is not your fault --}}\n<h1>Something went wrong</h1>\n<p>We're working on the problem.</p>\n```\n\nWrite those two first. In production they beat a technical stack trace by a wide margin.\n\nOne caution on the 500 page: it renders while your application is already broken, so keep it simple. A 500 view that queries the database or reads a config value that is itself the cause will fail to render, and the user gets a blank page instead.\n\n---\n\n### 2. Intermediate — stopping a request with a status\n\nYou already have the tools. `abort()`, `abort_if()` and `abort_unless()` came on Day 7, along with the 401 versus 403 and 301 versus 302 distinctions. Go back there if any of that feels hazy; today does not repeat it.\n\nWhat is new is the reporting angle. The status code you send is also a claim about whose fault the failure was, and that decides whether it belongs in your logs at all.\n\n---\n\n### 3. Advanced — which statuses deserve a log entry\n\n```text\nStatus                     Whose problem              Report it?\n──────                     ─────────────              ──────────\n403 Forbidden              the client, asking for     Usually not, though a\n                           something not allowed      spike is worth noticing\n\n404 Not Found              nobody's, most of the      No. Reporting these\n                           time: old links, bots      floods your logs\n\n422 Unprocessable          the client. Well-formed    No. This is your\n    Content                but failed validation      validation working as\n                           (Day 9)                    designed\n\n429 Too Many Requests      the client, hitting a      Log the pattern, not\n                           rate limit (Day 22)        each individual hit\n\n500 Server Error           yours. Your code or        Always, with as much\n                           infrastructure broke       context as you can get\n```\n\nThe pattern is easy once you see it. <b>4xx is usually a statement about the request; 5xx is a statement about you.</b> Log the ones that are your fault.\n\nThe 429 row is the interesting one, because \"log the pattern, not each hit\" is a different instruction from the others. One client hitting a rate limit a thousand times should not produce a thousand log lines, but the fact that it happened at all is worth knowing. That is a job for aggregation rather than a log call per request.\n\nAnd 404 is where most beginners lose their logs. A crawler walking old URLs can generate thousands of them a day. Report those and the one 500 that matters is buried somewhere in the middle.",
      diagram: `The filename IS the configuration

  resources/views/errors/
    ├── 403.blade.php
    ├── 404.blade.php
    └── 500.blade.php

  User requests a page → it does not exist → 404 → errors/404.blade.php

  No registration. No config entry. Just the file being there.

  Keep the 500 view simple: it renders while the app is
  already broken, so a query in it can fail too.


Status codes and whether they deserve a log entry

  status                whose problem            report it?
  ──────                ─────────────            ──────────
  403 Forbidden         the client               usually not
  404 Not Found         nobody's, mostly         NO  → floods the log
  422 Unprocessable     the client (Day 9)       NO  → validation working
  429 Too Many Req.     the client (Day 22)      the PATTERN, not each hit
  500 Server Error      YOURS                    ALWAYS, with context

  4xx  a statement about the request
  5xx  a statement about YOU        ← these are the ones to log


Where beginners lose their logs

  a crawler walking old URLs
        ↓
  thousands of 404s a day, all reported
        ↓
  the one 500 that mattered is buried in the middle

  abort(), abort_if(), abort_unless() and 401 vs 403
  were Day 7. Today is only about what to record.`,
      codeExample: {
        title: "Error views, and choosing what to report",
        code: `{{-- resources/views/errors/404.blade.php --}}
{{-- The filename is the status code. Nothing else to configure. --}}

<x-layout title="Page not found">
    <h1>Page not found</h1>
    <p>Sorry, we couldn't find the page you're looking for.</p>
    <a href="{{ route('invoices.index') }}">Back to invoices</a>
</x-layout>


{{-- resources/views/errors/500.blade.php --}}
{{-- Keep this one simple. It renders while the application is already
     broken, so a database query here can fail as well and leave the
     user with a blank page. --}}

<h1>Something went wrong</h1>
<p>We're working on the problem. Please try again shortly.</p>


<?php
// ---------- Stopping a request with a status (Day 7) ----------

abort(404);
abort_if($invoice->account_id !== $user->account_id, 403);
abort_unless($user->can('view', $invoice), 403);


// ---------- The reporting angle, which IS today ----------
// bootstrap/app.php

use Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException;
use Illuminate\\Validation\\ValidationException;

->withExceptions(function (Exceptions $exceptions) {

    // 404s come from old links and crawlers. Reporting them buries
    // the 500 that actually needed your attention.
    // 422s are your validation working exactly as designed.
    $exceptions->dontReport([
        NotFoundHttpException::class,
        ValidationException::class,
    ]);

    // 500s are yours. Record them with everything you can attach.
    $exceptions->report(function (Throwable $e) {
        Log::error('Unhandled failure', [
            'exception' => get_class($e),
            'message'   => $e->getMessage(),
        ]);
    });
})

// 4xx  a statement about the request
// 5xx  a statement about you        ← log these`,
      },
      keyTakeaways: [
        "Error views live in <b>`resources/views/errors/`</b> and the filename is the status code.",
        "No registration is needed: creating `404.blade.php` is the whole configuration.",
        "They are ordinary Blade views, so they can extend your layout and match the site.",
        "<b>Keep the 500 view simple.</b> It renders while the application is already broken.",
        "<b>`abort()`, `abort_if()` and `abort_unless()` were Day 7</b>, along with 401 versus 403 and 301 versus 302.",
        "The status code is a claim about whose fault the failure was, which decides whether to log it.",
        "<b>4xx is about the request; 5xx is about you.</b> Log the 5xx, and log it with context.",
        "Reporting 404s and 422s floods your log and buries the failures that matter.",
      ],
      commonMistakes: [
        "<b>Leaving the default error page in production.</b> A customer meets a technical page instead of your site.",
        "<b>Querying the database in `500.blade.php`.</b> If the database is the problem, the error page fails too.",
        "<b>Reporting every 404.</b> One crawler on old URLs can bury the single 500 you needed to see.",
        "<b>Reporting validation failures as errors.</b> A 422 is your validation working, not a fault.",
        "<b>Logging every 429 individually.</b> A thousand rate-limited requests is one pattern, not a thousand incidents.",
      ],
      quiz: [
        {
          question: "How do you make Laravel use your own 404 page?",
          options: [
            "Register a view in `config/app.php`",
            "Create `resources/views/errors/404.blade.php`",
            "Add a route for `/404`",
            "Set `APP_DEBUG=false`",
          ],
          correctIndex: 1,
          explanation: "The filename is the status code, and that is the whole configuration.",
        },
        {
          question: "Why should a 500 error view stay simple?",
          options: [
            "Blade cannot use components there",
            "It has no access to routes",
            "It renders while the application is already broken, so its own queries can fail",
            "It is cached forever",
          ],
          correctIndex: 2,
          explanation: "Otherwise the user gets a blank page instead of an apology.",
        },
        {
          question: "Which status code should always be reported?",
          options: [
            "404",
            "422",
            "403",
            "500",
          ],
          correctIndex: 3,
          explanation: "A 5xx says the fault is yours, so record it with as much context as you can.",
        },
        {
          question: "Why is reporting every 404 a bad idea?",
          options: [
            "It is slow",
            "Old links and crawlers generate thousands, burying the failures that matter",
            "404s cannot be logged",
            "It breaks the error view",
          ],
          correctIndex: 1,
          explanation: "Most 404s are nobody's fault.",
        },
      ],
    },
    {
      id: "logging-levels-and-context",
      title: "Logging — the Log facade, levels & context",
      durationMinutes: 12,
      explanation: "Error handling asks what should happen when something goes wrong. <b>Logging</b> (recording what happened so a developer, possibly you at 2am, can work out why) asks what information you should save.\n\nOne facade covers it, and a <b>log level</b> (a label saying how serious the message is) is a method on it.\n\n```php\nuse Illuminate\\Support\\Facades\\Log;\n\nLog::info('Invoice created.');\n```\n\n---\n\n### 1. Basic — the eight levels\n\n```text\nLevels, increasing severity:\ndebug → info → notice → warning → error → critical → alert → emergency\n```\n\nEight is more than you need on day one. Learn four properly and the rest are obvious when you meet them.\n\n```text\nlevel      what it means                          example\n─────      ────────────                          ───────\ndebug      detail useful while developing,       Log::debug('Checking payment status')\n           and noise in production\ninfo       normal, useful application events     Log::info('User logged in')\nwarning    unusual, but the app carried on       Log::warning('Payment provider is slow')\nerror      something failed and needs            Log::error('Payment failed')\n           attention\n```\n\nThe remaining four, `notice`, `critical`, `alert` and `emergency`, sit above and around those, and become useful once you route levels to different channels. `critical` going to Slack while `error` goes to a file is a common arrangement.\n\nThe honest advice: choosing between `error` and `critical` matters far less than what comes next. A `warning` with the right identifiers beats a perfectly graded `critical` that says nothing.\n\n---\n\n### 2. Intermediate — context is the whole point\n\nEvery log method takes a second argument: an array of <b>context</b> (the surrounding facts that make the message useful).\n\n```php\n// Almost useless\nLog::error('Payment failed');\n\n// Actually actionable\nLog::error('Payment failed', [\n    'user_id'    => $user->id,\n    'payment_id' => $payment->id,\n    'amount'     => $payment->amount,\n]);\n```\n\n`Log::error('Payment failed')` tells you a payment failed. Which payment? Whose? You cannot answer either, so the line is close to useless.\n\nThe habit to build: whenever you write a log line, ask what you would immediately want to know if you found this line in production at 2am, and pass that.\n\nOne thing to keep out of context: passwords, tokens, card numbers, full request bodies from an authentication endpoint. Logs are read by more people than your database is, and they are frequently shipped to a third-party service. Log the identifier, not the secret.\n\n---\n\n### 3. Advanced — logging around a failure\n\nA common shape is catch, record, and let the exception keep travelling:\n\n```php\ntry {\n    $payment->charge();\n} catch (PaymentFailed $e) {\n    Log::error('Payment failed', ['payment_id' => $payment->id]);\n    throw $e;      // rethrow, so the exception handler still renders a response\n}\n```\n\nThat `throw $e` is the part people leave out. Without it you have recorded the failure and then told the caller everything went fine, which is the worst of both worlds: the user carries on into a broken state and only you know.\n\n```text\nPayment fails  →  PaymentFailed\n    ├──→ Log                →  developers get the detail\n    └──→ exception handler  →  user gets a response\n```\n\nWorth noticing: if the exception is going to be reported anyway, the `try/catch` may be redundant. Reach for it when you can add context at the call site that the exception itself does not carry. Otherwise let it travel and let `report()` do the logging.",
      diagram: `Levels, increasing severity

  debug → info → notice → warning → error → critical → alert → emergency
   └──── the four you will actually use ────┘        └── route these to Slack

  debug    detail while developing, noise in production
  info     normal useful events        "Invoice created"
  warning  unusual, app carried on     "Provider is slow"
  error    failed, needs attention     "Payment failed"


The path a log message takes

  Application → something happens → log message
                                        │
                                        ↓
                                   log channel
                                        │
                                        ↓
                                 log destination
                              (file / Slack / stderr)


Context is what makes a log line usable

  Log::error('Payment failed')
        ↓
  which payment? whose? how much?   ← you cannot answer any of it

  Log::error('Payment failed', [
      'user_id'    => $user->id,
      'payment_id' => $payment->id,
      'amount'     => $payment->amount,
  ])
        ↓
  a starting point instead of a shrug

  Ask: at 2am, what would I want to know? Pass that.
  Never pass: passwords, tokens, card numbers.


Catch, record, RETHROW

  try { $payment->charge(); }
  catch (PaymentFailed $e) {
      Log::error(...);
      throw $e;        ← without this, the caller is told all is well
  }

  Payment fails → PaymentFailed
      ├──→ Log                →  developers get the detail
      └──→ exception handler  →  user gets a response`,
      codeExample: {
        title: "Levels, context, and logging around a failure",
        code: `<?php

use Illuminate\\Support\\Facades\\Log;

// ---------- One method per level ----------

Log::debug('Checking payment status');       // developing only
Log::info('Invoice created');                // normal event
Log::notice('Using the fallback provider');
Log::warning('Payment provider is slow');    // unusual, app continues
Log::error('Payment failed');                // failed, needs attention
Log::critical('Database unavailable');
Log::alert('Payments are down site-wide');
Log::emergency('The application is unusable');


// ---------- Context: the second argument ----------

// Almost useless. Which payment? Whose? How much?
Log::error('Payment failed');

// Actually actionable.
Log::error('Payment failed', [
    'user_id'    => $user->id,
    'payment_id' => $payment->id,
    'amount'     => $payment->amount,
    'currency'   => $payment->currency,
]);

// Keep secrets OUT of context. Logs travel further than your database,
// and are often shipped to a third-party service.
Log::info('Login attempt', [
    'user_id' => $user->id,          // yes
    // 'password' => $request->password,   // never
    // 'token'    => $request->bearerToken(),
]);


// ---------- Catch, record, rethrow ----------

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        try {
            $this->payments->charge($request->user(), $request->integer('amount'));
        } catch (PaymentFailed $e) {
            // Context the exception itself does not carry: this is the
            // only reason the try/catch earns its place here.
            Log::error('Payment failed', [
                'payment_id' => $e->paymentId,
                'route'      => $request->path(),
                'ip'         => $request->ip(),
            ]);

            // Rethrow, so the exception handler still renders a response.
            // Without this line you have logged the failure and told the
            // caller everything went fine.
            throw $e;
        }

        return redirect()->route('invoices.index');
    }
}


// ---------- Choosing a level ----------
//
// The gap between error and critical matters far less than context.
// A warning with the right identifiers beats a perfectly graded
// critical that says nothing at all.`,
      },
      keyTakeaways: [
        "One facade covers logging: `use Illuminate\\Support\\Facades\\Log;` and a method per level.",
        "The eight levels in order: <b>debug, info, notice, warning, error, critical, alert, emergency</b>.",
        "Four carry almost everything you write: <b>`debug`, `info`, `warning`, `error`</b>.",
        "The upper levels earn their keep once you route them to different channels, such as `critical` to Slack.",
        "<b>Every log method takes a context array</b> as its second argument, and that is where the value is.",
        "<b>`Log::error('Payment failed')` is close to useless.</b> Which payment, and whose?",
        "<b>Never log secrets</b>: passwords, tokens, card numbers. Log the identifier instead.",
        "When you catch to log, <b>rethrow</b>, or the caller is told everything went fine.",
      ],
      commonMistakes: [
        "<b>Logging a bare message with no context.</b> You learn that something failed and nothing about which one.",
        "<b>Agonising over `error` versus `critical`.</b> The level matters far less than the identifiers you attach.",
        "<b>Leaving `debug` calls in production code.</b> They are noise, and they often contain the most sensitive detail.",
        "<b>Catching an exception, logging it, and not rethrowing.</b> The request continues as if it succeeded.",
        "<b>Dumping the whole request body into context.</b> That is how passwords and tokens end up in a log service.",
      ],
      quiz: [
        {
          question: "Which four levels cover almost everything you will write?",
          options: [
            "debug, info, warning, error",
            "notice, alert, critical, emergency",
            "info, notice, alert, error",
            "debug, notice, critical, alert",
          ],
          correctIndex: 0,
          explanation: "The other four become useful once you route levels to different channels.",
        },
        {
          question: "What is the second argument to every `Log` method?",
          options: [
            "The channel name",
            "A context array of surrounding facts",
            "The status code",
            "A callback",
          ],
          correctIndex: 1,
          explanation: "It is what turns \"Payment failed\" into a starting point.",
        },
        {
          question: "You catch an exception, log it, and return a response. What did you get wrong?",
          options: [
            "You should have used `Log::info`",
            "Nothing",
            "You did not rethrow, so callers are told everything succeeded",
            "Logging inside a catch is not allowed",
          ],
          correctIndex: 2,
          explanation: "Rethrow so the exception handler still renders the real response.",
        },
        {
          question: "Which of these should never go into a log context array?",
          options: [
            "A user id",
            "An invoice number",
            "A route path",
            "An API token",
          ],
          correctIndex: 3,
          explanation: "Logs are read by more people than your database, and are often shipped off-site.",
        },
      ],
    },
    {
      id: "channels-and-app-debug",
      title: "Shared context, channels & APP_DEBUG",
      durationMinutes: 12,
      explanation: "Three things that turn working logging into useful logging: attaching context once, sending it somewhere sensible, and not showing any of it to the public.\n\nA <b>logging channel</b> (a configured destination or method for storing and sending logs) answers \"where does this message actually go?\", and it is configured in `config/logging.php`.\n\n---\n\n### 1. Basic — attach once, appear everywhere\n\nPassing the same `request_id` into fifteen separate log calls is tedious and easy to forget. `Log::withContext()` attaches information once, and every log message after it in that request carries the same fields.\n\n```php\nLog::withContext([\n    'request_id' => $request->header('X-Request-ID'),\n]);\n\nLog::info('Invoice validated');   // carries request_id\nLog::info('Invoice saved');        // carries request_id\nLog::info('Email queued');         // carries request_id\n```\n\nThat is what turns a log file into something readable. Instead of fifteen unrelated lines you have fifteen lines stamped with the same identifier, and you can follow one request from start to finish.\n\nThe <b>`Context` facade</b> goes a step further. Context here means data attached to the current execution so it can follow the work through different parts of the application, not just the logging calls.\n\nWhich to use comes down to how far the information needs to travel:\n\n```text\nLog::withContext()    fields on every log line after this, in this request\n                      ↳ reach for it to group a request's lines by request_id\n\nContext::add()        data on the current execution, following the work,\n                      including into queued jobs\n                      ↳ reach for it when the work continues elsewhere\n```\n\nThe queue part is the interesting half. A queued job runs later, in a separate process, so it normally knows nothing about the request that created it.\n\n```text\nWithout shared context:\n  Log 1  \"Invoice created\"   ← which request?\n  Log 2  \"Email queued\"      ← which invoice?\n  Log 3  \"Email sent\"        ← which job? whose invoice?\n\nWith context:\n  Log 1  \"Invoice created\"   request_id=abc123 invoice_id=789\n  Log 2  \"Email queued\"      request_id=abc123 invoice_id=789\n  Log 3  \"Email sent\"        request_id=abc123 invoice_id=789\n```\n\nOne user's journey, readable end to end, across two processes. Queues are Day 18, so for now just remember that `Context` is the tool for this.\n\n---\n\n### 2. Intermediate — channels\n\nYour code does not change when the channel does. `Log::error()` is the same call whether the message lands in a file, in Slack, or on standard output for a container platform to collect.\n\n```text\nchannel    where it sends                      when to use it\n───────    ─────────────                      ──────────────\nsingle     one file, storage/logs/laravel.log  simple apps, local dev\ndaily      one file per day,                   anything long-running.\n           laravel-2026-08-31.log              far easier to search\nstack      several channels at once,           when one Log::error()\n           such as daily plus slack            should reach two places\nslack      a Slack channel                     critical failures only,\n                                               never routine info\nsyslog     the OS logging service              where your infrastructure\n                                               already collects system logs\nstderr     standard error                      Docker, containers and\n                                               platforms forwarding stderr\n```\n\nLaravel 13 adds support for a monthly log driver. It behaves like `daily` but groups by month, so you get one file per month rather than one per day, which helps on applications where daily rotation produces more files than anyone wants to sift through.\n\nReserve Slack for: payment system unavailable, database unavailable, a major integration down. Not \"user logged in\". A Slack channel that alerts on everything is a Slack channel everybody mutes, and then the one alert that mattered goes unread.\n\n---\n\n### 3. Advanced — APP_DEBUG, which is a rule and not a preference\n\n`APP_DEBUG` controls how much Laravel puts in an error response.\n\n• <b>`APP_DEBUG=true`</b> locally, so you see the exception, the file, the line and the full stack trace. This is how you find problems quickly.\n• <b>`APP_DEBUG=false`</b> in production, always.\n\nA debug error page is a detailed report on your application, shown to whoever managed to trigger it. What it can hand a stranger:\n\n• Absolute file paths, which reveal your directory structure and often your server layout\n• Fragments of your source code, including the lines around the failure\n• Database details and connection information\n• Environment configuration and variable names\n• The internal shape of your application, class by class\n\nAn attacker does not need a clever exploit for this. They need one error, and errors are easy to cause.\n\nThe part people worry about needlessly: you are not losing the information. With debug off the full detail still goes to your logs.\n\n```text\nLocal        APP_DEBUG=true\n             Exception → exception class, file, line, stack trace\n                       → on screen, for you\n\nProduction   APP_DEBUG=false\n             Exception → friendly error page, for the user\n                       → full detail, in the log, for you\n```\n\nSo: `true` locally, `false` in production, no exceptions. If you need to debug a production problem, read the logs. Which is the whole reason the rest of this day existed.",
      diagram: `Attach once, appear everywhere

  Log::withContext(['request_id' => $id])

  Log::info('Invoice validated')    carries request_id
  Log::info('Invoice saved')        carries request_id
  Log::info('Email queued')         carries request_id

  without it            with it
  ──────────            ───────
  three loose lines     three lines you can group by request_id


Log::withContext() vs the Context facade

  Log::withContext()   this request's log lines
  Context::add()       the current execution, INCLUDING queued jobs

  HTTP request  ──→  Context  ──→  request logs
                        │
                        ↓
                   queued job  ──→  job logs (same request_id)

  without:  "Invoice created" / "Email queued" / "Email sent"
            three unrelated lines, two processes
  with:     all three stamped request_id=abc123 invoice_id=789

  Queues are Day 18. For now, just know Context is the tool.


Channels: same call, different destination

  single   Application  →  single  →  storage/logs/laravel.log

  daily    Application  →  daily   →  laravel-2026-08-31.log
                                      laravel-2026-08-30.log

  stack    Log::error() →  stack  ─┬─→  daily  →  file
                                   └─→  slack  →  #engineering

  slack    Log::critical() → Slack → the team wakes up

  stderr   Application  →  stderr →  the platform's log collector

  Reserve Slack for: payments down, database down, integration down.
  Not "user logged in". A channel that alerts on everything gets muted.


The same failure, two environments

  Local        APP_DEBUG=true
               Exception → class, file, line, stack trace
                         → on screen, for you

  Production   APP_DEBUG=false
               Exception → friendly error page, for the user
                         → full detail, in the log, for you

  What a debug page leaks in production:
    file paths · source code · database credentials
    environment configuration · stack traces · internal structure

  An attacker needs one error, not a clever exploit.`,
      codeExample: {
        title: "Shared context, channels and the debug switch",
        code: `<?php

use Illuminate\\Support\\Facades\\Context;
use Illuminate\\Support\\Facades\\Log;

// ---------- Log::withContext(): this request's log lines ----------
// Good place for it: a middleware, so every request is stamped.

class AddRequestId
{
    public function handle($request, Closure $next)
    {
        Log::withContext([
            'request_id' => $request->header('X-Request-ID', (string) Str::uuid()),
            'user_id'    => $request->user()?->id,
        ]);

        return $next($request);
    }
}

// Everything after it carries those fields, with nothing repeated:
Log::info('Invoice validated');
Log::info('Invoice saved');
Log::info('Email queued');


// ---------- Context: follows the work, including into queues ----------

Context::add('invoice_id', $invoice->id);

// A queued job runs later, in another process, and normally knows
// nothing about the request that created it. Context is how the
// identifiers travel with it. Queues are Day 18.


// ---------- Channels: config/logging.php ----------
//
// single   one file, storage/logs/laravel.log      simple apps, local dev
// daily    one file per day                        anything long-running
// stack    several channels at once                one call, two places
// slack    a Slack channel                         critical failures ONLY
// syslog   the OS logging service                  existing infrastructure
// stderr   standard error                          Docker and containers
//
// Laravel 13 adds support for a monthly log driver, which behaves like
// daily but groups by month rather than by day.

// Your code never changes when the channel does:
Log::error('Payment failed', ['payment_id' => $id]);

// Sending one message to a specific channel:
Log::channel('slack')->critical('Database unavailable');


// ---------- APP_DEBUG: a rule, not a preference ----------
//
// .env, local
//   APP_DEBUG=true      exception class, file, line, full stack trace
//                       on screen, for you
//
// .env, production
//   APP_DEBUG=false     a friendly error page, for the user
//                       the full detail, in the log, for you
//
// A debug page can hand a stranger: absolute file paths, fragments of
// your source, database details, environment configuration, and the
// internal shape of your application class by class.
//
// You lose nothing by turning it off. The detail still goes to the log.
// If you need to debug production, read the logs.`,
      },
      keyTakeaways: [
        "<b>`Log::withContext()`</b> attaches fields to every log line after it in the current request.",
        "A middleware is the natural place for it, so every request is stamped with a `request_id`.",
        "<b>The `Context` facade</b> attaches data to the current execution, and it can follow work into queued jobs.",
        "A queued job runs later in a separate process, so without shared context its log lines are orphans (Day 18).",
        "A <b>logging channel</b> is where a message goes, configured in `config/logging.php`. Your code never changes.",
        "`single` for local, `daily` for anything long-running, `stack` to reach two places, `stderr` for containers.",
        "<b>Reserve Slack for critical failures.</b> A channel that alerts on everything gets muted.",
        "<b>`APP_DEBUG=true` locally, `false` in production, always.</b> The detail still goes to your logs either way.",
      ],
      commonMistakes: [
        "<b>Repeating the same `request_id` in fifteen log calls.</b> `Log::withContext()` does it once, and never forgets one.",
        "<b>Expecting `Log::withContext()` to reach a queued job.</b> That is what the `Context` facade is for.",
        "<b>Sending routine `info` messages to Slack.</b> The channel gets muted, and the one real alert goes unread.",
        "<b>Running `single` on a busy production app.</b> One enormous file is painful to search and never rotates.",
        "<b>Leaving `APP_DEBUG=true` in production.</b> One triggered error hands a stranger your file paths, source and database details.",
      ],
      quiz: [
        {
          question: "What does `Log::withContext()` do?",
          options: [
            "Changes the log channel",
            "Attaches fields to every log message after it in this request",
            "Logs a message at context level",
            "Sends context to a queued job",
          ],
          correctIndex: 1,
          explanation: "So you can group a request's lines by something like a `request_id`.",
        },
        {
          question: "What can the `Context` facade do that `Log::withContext()` cannot?",
          options: [
            "Set the log level",
            "Write to two channels",
            "Carry data into a queued job running in another process",
            "Encrypt the log file",
          ],
          correctIndex: 2,
          explanation: "Queues are Day 18, but this is the reason to remember Context exists.",
        },
        {
          question: "Which channel should you use for a long-running production application?",
          options: [
            "`daily`, so files rotate and stay searchable",
            "`single`, so everything is in one place",
            "`slack`, so nothing is missed",
            "`syslog` always",
          ],
          correctIndex: 0,
          explanation: "One enormous file is painful to search and never rotates.",
        },
        {
          question: "Why must `APP_DEBUG` be false in production?",
          options: [
            "Debug mode disables logging",
            "It makes the site slower",
            "A debug page exposes file paths, source code and database details to anyone who triggers an error",
            "Laravel refuses to boot otherwise",
          ],
          correctIndex: 2,
          explanation: "You lose nothing: the full detail still goes to your logs.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the difference between `report()` and `render()`?",
      options: [
        "They are two names for the same thing",
        "`report()` records for developers; `render()` builds the response for the user",
        "`report()` is for 5xx and `render()` is for 4xx",
        "`render()` records and `report()` responds",
      ],
      correctIndex: 1,
      explanation: "Report is for the log, render is for the browser, and they are independent.",
    },
    {
      question: "What does `dontReport()` actually stop?",
      options: [
        "The exception being thrown",
        "The response being rendered",
        "The recording step only",
        "Both reporting and rendering",
      ],
      correctIndex: 2,
      explanation: "The user's experience is identical; only the log entry disappears.",
    },
    {
      question: "How do you give your application a custom 404 page?",
      options: [
        "Create `resources/views/errors/404.blade.php`",
        "Register it in `config/app.php`",
        "Add a catch-all route",
        "Set `APP_DEBUG=false`",
      ],
      correctIndex: 0,
      explanation: "The filename is the status code, and no registration is needed.",
    },
    {
      question: "Which status code always deserves a log entry, and which floods your logs?",
      options: [
        "Log 404s, skip 500s",
        "Log both equally",
        "Log 422s, skip 500s",
        "Log 500s, skip 404s",
      ],
      correctIndex: 3,
      explanation: "4xx is a statement about the request; 5xx is a statement about you.",
    },
    {
      question: "What makes a log line worth having?",
      options: [
        "Choosing exactly the right level",
        "The context array of identifiers attached to it",
        "Sending it to Slack",
        "Writing it at `critical`",
      ],
      correctIndex: 1,
      explanation: "A warning with the right identifiers beats a perfectly graded critical that says nothing.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Make InvoiceHub fail properly: a named exception, real error pages, and logs you could actually debug from.",
    brief: "InvoiceHub currently dies with a stack trace when you ask for an invoice that does not exist. Today it stops doing that.\n\nThere is still no database until Day 13, so keep the invoices hard-coded in an array or a small in-memory service, exactly as they are now. Nothing here needs storage. What you build today is the handling layer, and it will keep working unchanged once real records arrive.\n\nOne thing to set up first: make sure `APP_DEBUG=true` in your local `.env`, so you can see what you are replacing, and check the value you would use in production before you finish.",
    steps: [
      "Create the exception: `php artisan make:exception InvoiceNotFound`. Give it a constructor taking the invoice number and setting a message, and expose the number as a public readonly property.",
      "Throw it from wherever you look an invoice up in the hard-coded list, instead of returning null or calling `abort(404)`.",
      "Add a `report()` method to the class that calls `Log::warning('Invoice not found', ['number' => $this->number])`. Warning, not error: a missing invoice is usually a bad link, not a broken application.",
      "Add a `render($request)` method that returns JSON with a 404 when `$request->expectsJson()`, and `response()->view('errors.404', [], 404)` otherwise.",
      "Write `resources/views/errors/404.blade.php` extending your layout, with a heading, one sentence, and a link back to the invoice list.",
      "Write `resources/views/errors/500.blade.php` with no layout, no components and no data at all. Explain in a comment why it must not touch the database.",
      "Trigger both: visit an invoice number that does not exist, then temporarily `throw new Exception('boom')` in a controller. Confirm you get your pages and not Laravel's.",
      "Hit the same missing invoice with `curl -H \"Accept: application/json\"` and confirm you get the JSON body, not HTML.",
      "Add a middleware that calls `Log::withContext(['request_id' => (string) Str::uuid()])`, and register it on the web group.",
      "Add `Log::info()` calls with context to the create and delete actions: what happened, plus the invoice number. Submit a few actions and confirm every line in `storage/logs/laravel.log` carries the same `request_id` per request.",
      "In `bootstrap/app.php`, add `NotFoundHttpException` and `ValidationException` to `dontReport()`. Then browse a few nonexistent URLs and confirm your log stays clean.",
      "Switch `APP_DEBUG=false`, trigger the deliberate exception again, and compare what the browser shows with what the log file holds. Then switch it back.",
    ],
    acceptance: [
      "Asking for an invoice that does not exist returns your 404 page, and a JSON client asking for the same thing gets a 404 JSON body.",
      "`storage/logs/laravel.log` contains one `Invoice not found` warning per miss, with the invoice number attached.",
      "Every log line from a single request carries the same `request_id`.",
      "No log line contains the words `Invoice not found` twice for one request, so you know your `report()` is not doubling up.",
      "Browsing a handful of nonexistent URLs adds nothing to your log.",
      "With `APP_DEBUG=false`, a deliberate exception shows your 500 page and no file paths, while the log holds the full detail.",
      "You can say, without looking, which of your log calls is for the user and which is for you.",
    ],
    stretch: [
      "Add a `PlanLimitReached` exception for creating more than five invoices, put it in `dontReport()`, and confirm the user still gets a clear message with nothing in the log.",
      "Configure the `daily` channel in `config/logging.php` and watch a second file appear the next day, or fake it by changing your system date.",
      "Add a `Log::critical()` call for a failure you would want to be woken up for, and write a comment naming the channel you would route it to and why Slack must not receive anything below it.",
    ],
  },
};
