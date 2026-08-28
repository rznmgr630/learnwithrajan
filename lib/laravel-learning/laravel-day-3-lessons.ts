import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_3_LESSONS: LessonDay = {
  day: 3,
  title: "Request lifecycle & the Service Container in depth",
  totalMinutes: 59,
  difficulty: "Beginner",
  lessons: [
    {
      id: "request-lifecycle",
      title: "The journey of a request",
      durationMinutes: 14,
      explanation: "Day 2 showed you where files live. Today you follow a request through them.\n\nWhen you type a URL and press enter, a lot happens before your code runs. Knowing that path is what turns \"it doesn't work\" into \"it stops at step 4\".\n\n```text\nBrowser\n   │ HTTP Request\n   ↓\npublic/index.php\n   ↓\nLaravel starts up\n   ↓\nMiddleware\n   ↓\nRouter\n   ↓\nController\n   ↓\nModels / Services\n   ↓\nResponse\n   ↓\nBrowser\n```\n\n---\n\n### 1. Basic — the front door\n\nSay you open `http://my-app.test/users/10`. Your browser sends:\n\n```text\nGET /users/10 HTTP/1.1\nHost: my-app.test\n```\n\nThat request carries the method, the URL, headers, cookies and a body.\n\nIt arrives at exactly one file:\n\n```text\nInternet\n   │\n   ↓\n┌──────────────────┐\n│ public/index.php │  ← the front door\n└────────┬─────────┘\n         ↓\n      Laravel\n```\n\nEvery web request enters here. Not through `app/`, not through `routes/`. The web server points at `public/`, so `index.php` is the only PHP file the outside world can reach, and it hands control to Laravel.\n\nYou will almost never edit this file. You only need to know it is the door.\n\n---\n\n### 2. Intermediate — starting up, then the checkpoints\n\nLaravel cannot answer a request the moment it arrives. It has to get itself ready first. That is called <b>bootstrapping</b> (starting and preparing the application before it handles work).\n\n```text\nindex.php\n   │\n   ↓\nBootstrap Laravel\n   │\n   ├── Load configuration\n   ├── Register service providers\n   ├── Configure middleware\n   └── Prepare routing and error handling\n```\n\nMuch of that is configured in `bootstrap/app.php`, the file you met yesterday:\n\n```text\n              bootstrap/app.php\n                     │\n        ┌────────────┼────────────┐\n        ↓            ↓            ↓\n    Routing      Middleware   Exceptions\n```\n\nOnce Laravel is ready, the request meets <b>middleware</b> (code that inspects or changes a request before and after your application handles it). Think of airport checkpoints:\n\n```text\nPassenger → Passport → Security → Boarding → Plane\nRequest   → Auth     → Permission → CSRF   → Controller\n```\n\nAny checkpoint can stop the request:\n\n```text\nRequest\n   ↓\n\"Is the user logged in?\"\n   ├── NO  → redirect or 401\n   └── YES → continue\n```\n\nMiddleware does not only reject. It can also add or adjust information before your code sees it, which is why it suits anything that should happen on many routes at once.\n\nIf the request survives, the <b>router</b> looks for a matching route:\n\n```php\nRoute::get('/users/{id}', [UserController::class, 'show']);\n```\n\n`/users/10` matches `/users/{id}`, so `id` is `10`, and the router knows which controller method to call.\n\n```text\nGET /users/10\n      ↓\n    Router\n      ↓\nUserController@show\n```\n\nThe controller then does the actual work: validate input, query a model, call a service, and return something.\n\n---\n\n### 3. Advanced — the whole path, and how to debug it\n\nPut every step together:\n\n```text\n                    Browser\n                       │ HTTP Request\n                       ↓\n              public/index.php\n                       ↓\n              Laravel bootstraps\n                       ↓\n                  Middleware\n                       ↓\n                    Router\n                       ↓\n                  Controller\n                       │\n              ┌────────┴────────┐\n              ↓                 ↓\n           Model            Services\n              ↓                 ↓\n          Database          APIs, mail\n              └────────┬────────┘\n                       ↓\n                   Response\n                       ↓\n                    Browser\n```\n\nThe controller finishes by returning a response:\n\n```php\nreturn response()->json(['name' => 'Rajan']);\n```\n\nLaravel turns that into a real HTTP response and sends it back:\n\n```text\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"name\": \"Rajan\"}\n```\n\nThe reason this diagram is worth memorising is debugging. When something breaks, walk the same path in order:\n\n```text\n1. Did the request reach Laravel at all?\n2. Did middleware let it through?\n3. Did the router find a matching route?\n4. Did the controller run?\n5. Did the model or service work?\n6. Did Laravel build the response?\n```\n\nA 404 means step 3. A redirect to login means step 2. A 500 usually means step 4 or 5. Instead of guessing, you check the stages in order and the failure names itself.",
      diagram: `The full lifecycle, top to bottom

                    Browser
                       │ GET /users/10
                       ↓
              public/index.php          ← the only exposed entry
                       ↓
              Laravel bootstraps        ← config, providers, middleware
                       ↓
                  Middleware            ← auth, permissions, CSRF
                       │
                 ┌─────┴─────┐
                 ↓           ↓
              rejected    allowed
                 │           ↓
                 │        Router        ← match URL to a route
                 │           ↓
                 │      Controller      ← your code runs here
                 │           │
                 │    ┌──────┴──────┐
                 │    ↓             ↓
                 │  Model        Services
                 │    ↓             ↓
                 │ Database      APIs, mail
                 │    └──────┬──────┘
                 └───────────┤
                             ↓
                         Response
                             ↓
                          Browser

Debugging reads the same list downward:
reached Laravel? → passed middleware? → matched a route?
→ ran the controller? → data returned? → response built?`,
      codeExample: {
        title: "One request, end to end",
        code: `<?php

// routes/web.php — the router matches the URL to this route
use App\\Http\\Controllers\\UserController;
use Illuminate\\Support\\Facades\\Route;

Route::get('/users/{id}', [UserController::class, 'show']);

// A route can also require middleware before the controller runs.
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth');


// app/Http/Middleware/EnsureUserIsActive.php
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()?->is_active) {
            // Stop here. The controller never runs.
            return redirect('/suspended');
        }

        // Hand the request on to the next checkpoint.
        return $next($request);
    }
}


// app/Http/Controllers/UserController.php
namespace App\\Http\\Controllers;

use App\\Models\\User;

class UserController extends Controller
{
    public function show(int $id)
    {
        // $id is 10, taken from the URL by the router
        $user = User::findOrFail($id);

        return response()->json($user);
    }
}


// What comes back:
// HTTP/1.1 200 OK
// Content-Type: application/json
//
// {"id":10,"name":"Rajan"}`,
      },
      keyTakeaways: [
        "Every web request enters through <b>`public/index.php`</b>, the only PHP file the outside world can reach.",
        "<b>Bootstrapping</b> is Laravel preparing itself: configuration, service providers, middleware and error handling.",
        "<b>Middleware</b> runs before your controller and can stop a request or add information to it.",
        "The <b>router</b> matches the URL to a route and pulls out parameters like `{id}`.",
        "The controller does the work and returns a value; Laravel turns that into a real HTTP response.",
        "Debug by walking the lifecycle in order rather than guessing: a 404 is the router, a login redirect is middleware.",
      ],
      commonMistakes: [
        "<b>Editing `public/index.php` to add application logic.</b> It is the entry point, not a place for your code. Anything you put there runs for every single request and is easy to lose in an upgrade.",
        "<b>Assuming the controller always runs.</b> Middleware sits in front of it. If you never see your controller's output, check whether a middleware returned early.",
        "<b>Debugging a 404 inside the controller.</b> A 404 from the router means the controller was never reached. Check the route definition and the HTTP method first.",
        "<b>Forgetting that route parameters arrive as strings.</b> `/users/10` gives you `\"10\"`. Type-hint `int $id` and Laravel will convert it for you.",
      ],
      quiz: [
        {
          question: "Which file does every Laravel web request enter through?",
          options: [
            "`public/index.php`",
            "`routes/web.php`",
            "`app/Models/User.php`",
            "`.env`",
          ],
          correctIndex: 0,
          explanation: "The web server points at `public/`, so `index.php` is the only reachable PHP file.",
        },
        {
          question: "What does bootstrapping mean?",
          options: [
            "Installing Composer",
            "Starting and preparing the Laravel application",
            "Creating a database",
            "Writing a controller",
          ],
          correctIndex: 1,
          explanation: "Configuration, service providers and middleware are all set up before the request is handled.",
        },
        {
          question: "What does middleware do?",
          options: [
            "Always queries the database",
            "Acts as a checkpoint before and after your controller",
            "Creates models",
            "Installs packages",
          ],
          correctIndex: 1,
          explanation: "It can stop a request, or add information to it, before your code runs.",
        },
        {
          question: "You get a 404. Which stage of the lifecycle failed?",
          options: [
            "The router could not match the URL",
            "The database was down",
            "The response could not be built",
            "Middleware rejected the request",
          ],
          correctIndex: 0,
          explanation: "A 404 means no route matched, so the controller never ran.",
        },
      ],
    },
    {
      id: "dependencies-and-di",
      title: "Dependencies and Dependency Injection",
      durationMinutes: 10,
      explanation: "The second half of today is about how Laravel gives your classes the objects they need.\n\nStart with the word itself. A <b>dependency</b> (an object a class needs in order to do its job) is anything your class cannot work without.\n\n```php\nclass OrderController\n{\n    public function __construct(\n        private PaymentService $payment\n    ) {}\n}\n```\n\n`OrderController` cannot take an order without a way to charge a card, so:\n\n```text\nOrderController\n       │ needs\n       ↓\n PaymentService\n```\n\n---\n\n### 1. Basic — building dependencies by hand\n\nThe obvious approach is to create what you need, where you need it:\n\n```php\nclass OrderController\n{\n    public function store()\n    {\n        $payment = new PaymentService();\n\n        $payment->charge(100);\n    }\n}\n```\n\nThis works. On a small application you would not notice a problem.\n\nIt gets uncomfortable as the class grows:\n\n```text\nOrderController\n      │\n      ├── new PaymentService()\n      ├── new EmailService()\n      ├── new Logger()\n      └── new InvoiceGenerator()\n```\n\nThe controller's job was to handle a request. Now it is also responsible for knowing how to build four other objects, including any settings each one needs.\n\n---\n\n### 2. Intermediate — asking instead of building\n\n<b>Dependency Injection</b> (giving a class the objects it needs from outside, instead of letting it build them itself) flips the arrangement:\n\n```php\nclass OrderController\n{\n    public function __construct(\n        private PaymentService $payment\n    ) {}\n\n    public function store()\n    {\n        $this->payment->charge(100);\n    }\n}\n```\n\nNothing is created inside the class any more. The controller just declares, in its constructor, \"I need a `PaymentService`\". Somebody else decides how to build one.\n\n```text\nOrderController\n       │ declares what it needs\n       ↓\n PaymentService\n       ↑\n       │ provides it\nService Container\n```\n\nTwo things improved. The dependencies are now visible in one place, and the controller no longer cares how a `PaymentService` gets built.\n\n---\n\n### 3. Advanced — what the container actually is\n\nThe <b>Service Container</b> (Laravel's system for creating and handing out the objects your application needs) is the \"somebody else\" in that diagram.\n\nPicture a warehouse counter:\n\n```text\n              Service Container\n                     │\n       ┌─────────────┼─────────────┐\n       ↓             ↓             ↓\n PaymentService  MailService  UserService\n```\n\nYour controller says \"I need a `PaymentService`\". The container builds one, or fetches one it already built, and hands it over.\n\n```text\nController\n    │ needs PaymentService\n    ↓\nService Container\n    │ builds or reuses\n    ↓\nPaymentService\n```\n\nYou have already been using it without noticing. Every controller Laravel calls, every job it runs, every Artisan command it executes goes through the container. That is why type-hinting a class in a controller constructor simply works.\n\nThe payoff is not that you write fewer `new` keywords. It is this:\n\n```text\nYour class\n     ↓\ndeclares what it needs\n     ↓\nthe container decides what to give it\n```\n\nBecause the decision moved out of the class, you can change it later without touching the class. The next lesson shows exactly how.",
      diagram: `Building your own vs. being given what you need

BY HAND
                OrderController
                      │
    ┌─────────┬───────┼───────┬──────────┐
    ↓         ↓       ↓       ↓          ↓
   new       new     new     new        new
 Payment    Email   Logger  Invoice   Whatever
 Service   Service          Generator

  The controller must know how to build all of them,
  and every setting each one requires.


INJECTED
                OrderController
                      │
                      │ "I need a PaymentService"
                      ↓
              Service Container
                      │ builds or reuses one
                      ↓
                PaymentService

  The controller declares a need.
  The container answers it.`,
      codeExample: {
        title: "The same controller, built two ways",
        code: `<?php

// ---------- 1. Building dependencies inside the class ----------
class OrderController
{
    public function store()
    {
        $payment = new PaymentService(config('services.stripe.key'));
        $mailer  = new EmailService();
        $logger  = new Logger(storage_path('logs/orders.log'));

        $payment->charge(100);
        $mailer->send('Order confirmed');
        $logger->info('Order stored');
    }
}
// The controller now knows how to construct three unrelated things.


// ---------- 2. Declaring what it needs instead ----------
class OrderController
{
    public function __construct(
        private PaymentService $payment,
        private EmailService $mailer,
        private Logger $logger,
    ) {}

    public function store()
    {
        $this->payment->charge(100);
        $this->mailer->send('Order confirmed');
        $this->logger->info('Order stored');
    }
}
// Laravel reads the constructor, builds each one, and passes them in.
// The dependencies are visible at the top instead of buried in a method.`,
      },
      keyTakeaways: [
        "A <b>dependency</b> is any object a class needs to do its job.",
        "<b>Dependency Injection</b> means the class declares what it needs and receives it, instead of building it.",
        "The <b>Service Container</b> is what builds and hands over those objects.",
        "Constructor injection puts every dependency in one visible place at the top of the class.",
        "Laravel already runs your controllers, jobs and commands through the container, which is why type-hinting works with no setup.",
        "The real gain is that the decision of <b>what</b> to provide moves out of the class, so it can change without editing the class.",
      ],
      commonMistakes: [
        "<b>Thinking DI is only about avoiding `new`.</b> Avoiding `new` is the visible part. The point is that your class stops deciding which implementation it gets.",
        "<b>Injecting things a class does not really need.</b> A constructor with eight dependencies is usually telling you the class is doing eight jobs.",
        "<b>Creating a dependency inside a method anyway.</b> `new PaymentService()` half way down a controller undoes the benefit, because tests can no longer swap it.",
      ],
      quiz: [
        {
          question: "What is a dependency?",
          options: [
            "A Composer package",
            "An HTTP method",
            "A database table",
            "An object a class needs to do its job",
          ],
          correctIndex: 3,
          explanation: "If the class cannot work without it, it is a dependency.",
        },
        {
          question: "What is Dependency Injection?",
          options: [
            "Installing packages with Composer",
            "Giving a class the objects it needs from outside",
            "Deleting unused classes",
            "Creating database relationships",
          ],
          correctIndex: 1,
          explanation: "The class declares what it needs; something else supplies it.",
        },
        {
          question: "What is the Service Container?",
          options: [
            "A Docker container",
            "A database table",
            "Laravel's system for creating and handing out dependencies",
            "A route group",
          ],
          correctIndex: 2,
          explanation: "Every controller, job and command Laravel runs goes through it.",
        },
        {
          question: "Why is building dependencies inside a class a problem as it grows?",
          options: [
            "The class becomes responsible for knowing how to construct everything it uses",
            "PHP forbids it",
            "It is slower to run",
            "Composer cannot autoload it",
          ],
          correctIndex: 0,
          explanation: "Construction details and their settings pile up in a class whose job was something else.",
        },
      ],
    },
    {
      id: "binding-and-autowiring",
      title: "Binding, resolving and autowiring",
      durationMinutes: 12,
      explanation: "You know the container hands out objects. Now: how does it know what to hand out?\n\nTwo words cover it.\n\n```text\nBinding\n   ↓\n\"When someone asks for X, give them Y.\"\n\nResolving\n   ↓\n\"Give me an X.\"\n```\n\n---\n\n### 1. Basic — binding and resolving\n\n<b>Binding</b> (telling the container which class to use when something is asked for) is a single line, usually written in a service provider:\n\n```php\n$this->app->bind(\n    PaymentGateway::class,\n    StripePaymentGateway::class\n);\n```\n\nRead it as a rule:\n\n```text\nSomeone asks for PaymentGateway\n              ↓\n     give them StripePaymentGateway\n```\n\n<b>Resolving</b> (asking the container to produce something) is the other side of the same coin:\n\n```php\n$payment = app(PaymentGateway::class);\n```\n\n```text\napp(PaymentGateway::class)\n            ↓\n    Service Container\n            ↓\n  StripePaymentGateway\n            ↓\n          Object\n```\n\nBinding writes the rule. Resolving uses it.\n\n---\n\n### 2. Intermediate — when you do not need a binding at all\n\nMost of the time you write no binding, and injection still works. That is <b>autowiring</b> (Laravel working out a class's dependencies from its type hints and building them for you).\n\nTake three plain classes:\n\n```php\nclass UserRepository {}\n\nclass UserService\n{\n    public function __construct(private UserRepository $repository) {}\n}\n\nclass UserController\n{\n    public function __construct(private UserService $users) {}\n}\n```\n\nAsk for a `UserController` and the container reads the type hints and works backwards:\n\n```text\nUserController\n      │ needs UserService\n      ↓\n UserService\n      │ needs UserRepository\n      ↓\nUserRepository\n      │ needs nothing\n      ↓\n   built, and passed back up the chain\n```\n\nYou never wrote a binding, and you never wrote `new UserRepository()`. The container could see, from the type hints alone, exactly what to build.\n\nThis works because each of those is a <b>concrete class</b> (a real class with actual code in it). There is only one possible thing to build.\n\n---\n\n### 3. Advanced — why interfaces are different\n\nNow make it an interface:\n\n```php\ninterface PaymentGateway\n{\n    public function charge(float $amount): bool;\n}\n```\n\nAn <b>interface</b> (a contract listing what a class must provide, with no code behind it) cannot be built. There is nothing to construct. And you may well have several classes that fulfil it:\n\n```text\nPaymentGateway\n      ├── StripePaymentGateway\n      ├── PayPalPaymentGateway\n      └── FakePaymentGateway\n```\n\nThe container has no way to guess which one you meant, so it stops and asks. That is when you must write the binding:\n\n```php\n$this->app->bind(PaymentGateway::class, StripePaymentGateway::class);\n```\n\nNow your controller can depend on the contract rather than a specific class:\n\n```php\nclass CheckoutController\n{\n    public function __construct(\n        private PaymentGateway $payments\n    ) {}\n}\n```\n\nNotice what the controller does <b>not</b> know: that payments go through Stripe.\n\nWhich is what makes the next part possible. Suppose you switch to PayPal. Change one line:\n\n```php\n$this->app->bind(PaymentGateway::class, PayPalPaymentGateway::class);\n```\n\n```text\nCheckoutController\n        │ depends on\n        ↓\n  PaymentGateway\n        ↑ container decides\n        │\n ┌──────┴──────┐\n ↓             ↓\nStripe       PayPal\n```\n\n`CheckoutController` is untouched. So is every other class that asked for a `PaymentGateway`. You changed a payment provider by editing one line in a provider, because your code depended on the contract instead of the implementation.",
      diagram: `Concrete class vs. interface

CONCRETE — the container can work it out alone

  UserController
        │ type hint says UserService
        ↓
   UserService
        │ type hint says UserRepository
        ↓
  UserRepository
        │ needs nothing
        ↓
      built ✓            no binding needed


INTERFACE — the container has to be told

  CheckoutController
        │ type hint says PaymentGateway
        ↓
   PaymentGateway  (an interface, nothing to build)
        │
        ├── StripePaymentGateway
        ├── PayPalPaymentGateway   which one? ✗
        └── FakePaymentGateway
        │
        ↓  you write the binding
  $this->app->bind(PaymentGateway::class, StripePaymentGateway::class)
        ↓
      built ✓

Swapping provider = editing that one line.
CheckoutController never changes.`,
      codeExample: {
        title: "Binding an interface, then swapping it",
        code: `<?php

// ---------- The contract ----------
namespace App\\Contracts;

interface PaymentGateway
{
    public function charge(float $amount): bool;
}


// ---------- Two implementations ----------
namespace App\\Services;

use App\\Contracts\\PaymentGateway;

class StripePaymentGateway implements PaymentGateway
{
    public function charge(float $amount): bool
    {
        // talk to Stripe
        return true;
    }
}

class PayPalPaymentGateway implements PaymentGateway
{
    public function charge(float $amount): bool
    {
        // talk to PayPal
        return true;
    }
}


// ---------- The binding, in app/Providers/AppServiceProvider.php ----------
public function register(): void
{
    $this->app->bind(
        PaymentGateway::class,
        StripePaymentGateway::class
    );
}


// ---------- The consumer ----------
class CheckoutController extends Controller
{
    public function __construct(
        private PaymentGateway $payments
    ) {}

    public function store()
    {
        return response()->json([
            'success' => $this->payments->charge(100),
        ]);
    }
}


// ---------- Switching to PayPal ----------
// Change one line in the provider:
//
//   $this->app->bind(PaymentGateway::class, PayPalPaymentGateway::class);
//
// CheckoutController is not edited. Neither is anything else
// that asked for a PaymentGateway.`,
      },
      keyTakeaways: [
        "<b>Binding</b> tells the container which class to hand over when something is requested.",
        "<b>Resolving</b> is asking the container for it, for example with `app(PaymentGateway::class)`.",
        "<b>Autowiring</b> means the container reads type hints and builds a whole chain of concrete classes with no binding from you.",
        "A concrete class can be built automatically; an <b>interface</b> cannot, because it has no code and may have several implementations.",
        "Depending on an interface lets you swap the implementation by changing one binding.",
        "Bindings normally live in the `register()` method of a service provider.",
      ],
      commonMistakes: [
        "<b>Writing bindings for plain concrete classes.</b> If the class can be built from its type hints, the container already handles it. The binding adds noise and nothing else.",
        "<b>Type-hinting the implementation instead of the interface.</b> `__construct(StripePaymentGateway $g)` works, but you have just hard-wired Stripe into the class and lost the ability to swap it.",
        "<b>Expecting the container to guess an interface.</b> `Target [PaymentGateway] is not instantiable` almost always means you forgot the binding, or the provider holding it is not registered.",
        "<b>Reaching for `app(...)` everywhere instead of constructor injection.</b> It resolves the same object but hides the dependency from anyone reading the class.",
      ],
      quiz: [
        {
          question: "What does `bind()` do?",
          options: [
            "Creates a database binding",
            "Tells the container which class to give when something is asked for",
            "Registers a route",
            "Starts the application",
          ],
          correctIndex: 1,
          explanation: "It writes the rule the container follows when resolving.",
        },
        {
          question: "What is autowiring?",
          options: [
            "Automatically writing PHP code",
            "Laravel resolving dependencies automatically from type hints",
            "Automatically generating routes",
            "Automatically creating database tables",
          ],
          correctIndex: 1,
          explanation: "The container reads the constructor and builds the whole chain.",
        },
        {
          question: "Why can Laravel not resolve an interface on its own?",
          options: [
            "PHP does not support interfaces",
            "Composer must be reinstalled first",
            "An interface has no code and may have many implementations",
            "Controllers cannot use interfaces",
          ],
          correctIndex: 2,
          explanation: "There is nothing to construct and no way to pick between candidates.",
        },
        {
          question: "You depend on `PaymentGateway` and want to switch from Stripe to PayPal. What changes?",
          options: [
            "Every controller using it",
            "The interface itself",
            "Only the binding in the service provider",
            "The route definitions",
          ],
          correctIndex: 2,
          explanation: "That is the whole reason for depending on the contract instead of the class.",
        },
      ],
    },
    {
      id: "binding-lifetimes",
      title: "bind, singleton, scoped and contextual binding",
      durationMinutes: 11,
      explanation: "A binding says <b>which</b> class to hand over. It also decides <b>how often</b> a new one gets built.\n\nThree methods cover almost everything you will meet.\n\n---\n\n### 1. Basic — `bind()`\n\nThe plain one:\n\n```php\n$this->app->bind(PaymentGateway::class, StripePaymentGateway::class);\n```\n\nEvery time something resolves it, the container is free to build a fresh object:\n\n```text\nResolve #1 → StripePaymentGateway #1\nResolve #2 → StripePaymentGateway #2\nResolve #3 → StripePaymentGateway #3\n```\n\nThis is the right default. A new object holds no leftover state from whoever used it last, so nothing can leak between two parts of your application by accident.\n\n---\n\n### 2. Intermediate — `singleton()` and `scoped()`\n\nA <b>singleton</b> (one shared instance that the container builds once and then reuses) is for objects that are expensive to build, or that are meant to be shared:\n\n```php\n$this->app->singleton(PaymentGateway::class, StripePaymentGateway::class);\n```\n\n```text\nFirst resolve\n      ↓\nStripePaymentGateway #1\n      ↓\nremembered by the container\n      ↓\nSecond resolve → the same object\nThird resolve  → the same object\n```\n\nEveryone gets the same instance:\n\n```text\n        Service Container\n               │\n               ↓\n     StripePaymentGateway\n               ↑\n          ┌────┴────┐\n       Controller  Service\n```\n\nA <b>scoped binding</b> (one shared instance per request or job, rebuilt for the next one) sits between the two:\n\n```php\n$this->app->scoped(PaymentGateway::class, StripePaymentGateway::class);\n```\n\nWithin one request everything shares an instance. The next request starts fresh:\n\n```text\nRequest 1 → Gateway #1   (controller, service and job all share it)\nRequest 2 → Gateway #2\nRequest 3 → Gateway #3\n```\n\nSide by side:\n\n```text\nbind()       new object each time it is resolved\nsingleton()  one object, shared for as long as the app runs\nscoped()     one object per request or job, then a new one\n```\n\nDo not memorise the mechanics. Ask instead: <i>would it be a bug if two parts of my app shared this object's state?</i> If yes, `bind()`. If sharing is the point, `singleton()`. If sharing should not survive into the next request, `scoped()`.\n\n---\n\n### 3. Advanced — closures, and different answers in different places\n\nSometimes building the object takes more than picking a class. Bind a closure (a function with no name) and you control the construction:\n\n```php\n$this->app->bind(PaymentGateway::class, function () {\n    return new StripePaymentGateway(\n        config('services.stripe.key')\n    );\n});\n```\n\n```text\nPaymentGateway\n      ↓\n  Container\n      ↓\n   Closure          ← your code runs\n      ↓\nnew StripePaymentGateway($key)\n```\n\nAnd sometimes the honest answer to \"which implementation?\" is \"it depends who is asking\". That is <b>contextual binding</b> (giving a different implementation depending on which class is asking for it):\n\n```php\n$this->app->when(ProfileService::class)\n    ->needs(Storage::class)\n    ->give(S3Storage::class);\n\n$this->app->when(ReportService::class)\n    ->needs(Storage::class)\n    ->give(LocalStorage::class);\n```\n\n```text\n      Storage\n         │\n         ├── asked for by ProfileService → S3Storage\n         └── asked for by ReportService  → LocalStorage\n```\n\nBoth services still just type-hint `Storage`. Neither knows where its files actually go, and neither had to change.\n\nThis one is easy to overuse. Reach for it only when the same contract genuinely needs different answers in different parts of the application. If there is one right implementation, a plain binding is clearer.",
      diagram: `How often does the container build a new one?

bind()
  Request 1 ──┬── resolve → object A
              ├── resolve → object B
              └── resolve → object C      every ask, a new one

singleton()
  Request 1 ──┬── resolve → object A
              └── resolve → object A
  Request 2 ──┬── resolve → object A      one object, always
              └── resolve → object A

scoped()
  Request 1 ──┬── resolve → object A
              └── resolve → object A      shared inside the request
  Request 2 ──┬── resolve → object B
              └── resolve → object B      new one next request


Contextual binding — the answer depends on who asks

                      Storage
                         │
          ┌──────────────┴──────────────┐
          ↓                             ↓
   ProfileService                 ReportService
          ↓                             ↓
      S3Storage                    LocalStorage

  Both classes type-hint Storage. Neither knows the difference.`,
      codeExample: {
        title: "The three lifetimes, plus closures and context",
        code: `<?php
// app/Providers/AppServiceProvider.php

public function register(): void
{
    // A new instance every time it is resolved. The safe default.
    $this->app->bind(
        PaymentGateway::class,
        StripePaymentGateway::class
    );

    // Built once, then reused for the life of the application.
    $this->app->singleton(
        MetricsCollector::class,
        StatsdMetricsCollector::class
    );

    // Shared within one request or job, rebuilt for the next.
    $this->app->scoped(
        RequestContext::class,
        RequestContext::class
    );

    // A closure, for when construction needs configuration.
    $this->app->bind(PaymentGateway::class, function ($app) {
        return new StripePaymentGateway(
            config('services.stripe.key'),
            $app->make(Logger::class),
        );
    });

    // Contextual: the same contract, a different answer per caller.
    $this->app->when(ProfileService::class)
        ->needs(Storage::class)
        ->give(S3Storage::class);

    $this->app->when(ReportService::class)
        ->needs(Storage::class)
        ->give(LocalStorage::class);
}


// Neither service knows which storage it got.
class ProfileService
{
    public function __construct(private Storage $storage) {}
}

class ReportService
{
    public function __construct(private Storage $storage) {}
}`,
      },
      keyTakeaways: [
        "<b>`bind()`</b> gives a new instance every time something is resolved. Use it unless you have a reason not to.",
        "<b>`singleton()`</b> builds one instance and reuses it for as long as the application runs.",
        "<b>`scoped()`</b> shares one instance within a request or job, then builds a new one for the next.",
        "Pick by asking whether shared state between callers would be a bug.",
        "Bind a <b>closure</b> when constructing the object needs configuration or other services.",
        "<b>Contextual binding</b> gives a different implementation depending on which class is asking, without either class knowing.",
      ],
      commonMistakes: [
        "<b>Making everything a singleton because it sounds efficient.</b> A shared object keeps whatever state the last caller left in it, and that state now leaks between unrelated parts of your app.",
        "<b>Using a singleton to hold request data.</b> Anything tied to the current request belongs in `scoped()`, or it will be wrong the moment a second request is served.",
        "<b>Using contextual binding as the default.</b> If there is one correct implementation, a plain binding says so more clearly.",
        "<b>Putting `bind()` calls in `boot()` instead of `register()`.</b> `register()` is where bindings are declared; `boot()` runs after every provider has registered and is for work that needs other services ready.",
      ],
      quiz: [
        {
          question: "What does `singleton()` do?",
          options: [
            "Builds a new object on every resolve",
            "Registers a route",
            "Creates a database table",
            "Builds one object and reuses it",
          ],
          correctIndex: 3,
          explanation: "The container remembers the first instance and hands it back every time.",
        },
        {
          question: "What does `scoped()` do?",
          options: [
            "Shares one instance within the current request or job, then rebuilds",
            "Restricts a route to a prefix",
            "Limits a database query",
            "Scopes a Blade component",
          ],
          correctIndex: 0,
          explanation: "It is a singleton whose life ends when the request or job does.",
        },
        {
          question: "Which binding should hold data about the current request?",
          options: [
            "`scoped()`",
            "`bind()`",
            "`singleton()`",
          ],
          correctIndex: 0,
          explanation: "A singleton would carry that data into the next request, which would be wrong.",
        },
        {
          question: "When is contextual binding the right tool?",
          options: [
            "When the same contract needs different implementations per caller",
            "Always, it is the modern way",
            "When you need a new object each time",
            "When a class has no dependencies",
          ],
          correctIndex: 0,
          explanation: "For example one service storing to S3 while another stores locally.",
        },
      ],
    },
    {
      id: "injecting-everywhere",
      title: "Injecting across the app, and why testing gets easier",
      durationMinutes: 12,
      explanation: "The container is not a controller feature. It runs everything Laravel calls for you, so injection works in the same way wherever you are.\n\n---\n\n### 1. Basic — controllers, jobs and commands\n\nA controller, as you have seen:\n\n```php\nclass OrderController extends Controller\n{\n    public function __construct(\n        private PaymentGateway $payments\n    ) {}\n\n    public function store()\n    {\n        $this->payments->charge(100);\n    }\n}\n```\n\nA <b>job</b> (a piece of work Laravel runs in the background) can type-hint what it needs on `handle()`:\n\n```php\nclass ProcessPayment\n{\n    public function handle(PaymentGateway $payments)\n    {\n        $payments->charge(100);\n    }\n}\n```\n\nSo can an Artisan command:\n\n```php\nclass SendReports extends Command\n{\n    public function handle(ReportService $reports)\n    {\n        $reports->send();\n    }\n}\n```\n\nOne container serves all of them:\n\n```text\nController ──┐\nJob ─────────┼──→ Service Container\nCommand ─────┤\nService ─────┘\n```\n\nThat is worth pausing on. A job running at 3am on a queue worker gets its dependencies resolved exactly the way a controller does during a web request.\n\n---\n\n### 2. Intermediate — resolving by hand\n\nSometimes you need something in the middle of a method rather than in the constructor. Two helpers do that:\n\n```php\n$payments = app(PaymentGateway::class);\n\n// or\nuse Illuminate\\Support\\Facades\\App;\n$payments = App::make(PaymentGateway::class);\n```\n\nBoth ask the container the same question and follow the same bindings.\n\n```text\n       Service Container\n              ↑\n    ┌─────────┼─────────┐\n    ↓         ↓         ↓\nConstructor  app()   App::make()\n injection\n```\n\nWhich to use:\n\n```text\nDoes the class always need it?\n        ↓\nConstructor injection     ← nearly always the answer\n\nDo you need it only in one branch, or decided at runtime?\n        ↓\napp()\n```\n\nConstructor injection wins because it is honest. Read the top of the class and you know everything it depends on. Scatter `app(...)` through the methods and those dependencies are invisible until you read every line.\n\n---\n\n### 3. Advanced — providers, testing, and debugging\n\nBindings live in a <b>service provider</b> (a class where you register what the container should hand out), usually `app/Providers/AppServiceProvider.php`:\n\n```php\nclass AppServiceProvider extends ServiceProvider\n{\n    public function register(): void\n    {\n        $this->app->bind(PaymentGateway::class, StripePaymentGateway::class);\n    }\n\n    public function boot(): void\n    {\n        // runs after every provider has registered\n    }\n}\n```\n\nNow the part that pays for all of this. In production you charge real cards:\n\n```text\nPaymentGateway → StripePaymentGateway\n```\n\nIn tests you certainly do not want to. So bind something else:\n\n```text\nPaymentGateway → FakePaymentGateway\n```\n\n```php\n$this->app->bind(PaymentGateway::class, FakePaymentGateway::class);\n```\n\n`CheckoutController` does not change. It never knew which gateway it had. Your test runs the real controller, the real route and the real validation, and only the payment call is fake.\n\nThe whole flow, once:\n\n```text\nBrowser → Router → CheckoutController\n                        │ \"I need a PaymentGateway\"\n                        ↓\n                 Service Container\n                        │ checks the binding\n                        ↓\n                StripePaymentGateway\n                        ↓\n                    Response\n```\n\nAnd when it breaks, you will see:\n\n```text\nTarget [App\\Contracts\\PaymentGateway] is not instantiable.\n```\n\nWalk down this list:\n\n```text\n1. Does the interface exist and is it imported correctly?\n2. Does the implementation actually implement it?\n3. Is the binding written in register()?\n4. Is that provider listed in bootstrap/providers.php?\n5. Can the implementation itself be built?\n```\n\nStep 5 catches the sneaky one: your binding is fine, but the class you bound needs an API key it cannot get. The error names the interface, while the real problem is one level deeper.\n\n---\n\n### Try it yourself\n\nBuild the whole chain end to end.\n\n1. Create `interface PaymentGateway` with `charge(float $amount): bool`.\n2. Create `StripePaymentGateway implements PaymentGateway`, returning `true`.\n3. Bind them in `AppServiceProvider::register()`.\n4. Create `CheckoutController` that type-hints `PaymentGateway` and calls `charge(100)`. Do not write `new` anywhere in it.\n5. Create `PayPalPaymentGateway`, change only the binding, and confirm the route still works.\n\nIf step 5 needed no change to `CheckoutController`, you have understood today.",
      diagram: `One container, every entry point

  HTTP Request ──→ Controller ──┐
  Queue worker ──→ Job ─────────┤
  Artisan ──────→ Command ──────┼──→ Service Container
  Another class ─→ Service ─────┘         │
                                          │ checks bindings
                                          ↓
                                   the object you asked for


Why tests become easy

  PRODUCTION                        TESTING
  CheckoutController                CheckoutController   ← identical
         ↓                                 ↓
   PaymentGateway                    PaymentGateway      ← identical
         ↓                                 ↓
  StripePaymentGateway              FakePaymentGateway   ← only this differs

  One binding changes. Your controller, routes and
  validation are all still the real ones under test.`,
      codeExample: {
        title: "Injection everywhere, and a fake for tests",
        code: `<?php

// ---------- Controller: constructor injection ----------
class OrderController extends Controller
{
    public function __construct(
        private PaymentGateway $payments
    ) {}

    public function store()
    {
        return response()->json([
            'paid' => $this->payments->charge(100),
        ]);
    }
}


// ---------- Job: injected on handle() ----------
class ProcessPayment implements ShouldQueue
{
    public function handle(PaymentGateway $payments): void
    {
        $payments->charge(100);
    }
}


// ---------- Artisan command: same idea ----------
class SendReports extends Command
{
    protected $signature = 'reports:send';

    public function handle(ReportService $reports): int
    {
        $reports->send();

        return self::SUCCESS;
    }
}


// ---------- Resolving by hand, when you must ----------
public function export(string $format)
{
    // Which exporter is only known at runtime, so ask the container here.
    $exporter = app("App\\\\Exports\\\\{$format}Exporter");

    return $exporter->run();
}


// ---------- A fake, so tests never call Stripe ----------
class FakePaymentGateway implements PaymentGateway
{
    public array $charges = [];

    public function charge(float $amount): bool
    {
        $this->charges[] = $amount;

        return true;
    }
}

// tests/Feature/CheckoutTest.php
it('charges the customer', function () {
    $fake = new FakePaymentGateway();
    app()->instance(PaymentGateway::class, $fake);

    $this->postJson('/checkout')->assertOk();

    expect($fake->charges)->toBe([100.0]);
});
// The controller, route and validation under test are the real ones.`,
      },
      keyTakeaways: [
        "The container resolves dependencies for controllers, jobs, commands and services alike.",
        "Jobs and Artisan commands can type-hint what they need on `handle()`.",
        "<b>`app()`</b> and <b>`App::make()`</b> resolve manually and follow the same bindings.",
        "Prefer constructor injection: it makes every dependency visible at the top of the class.",
        "Bindings belong in a <b>service provider</b>'s `register()` method.",
        "Swapping a real service for a fake in tests is one binding, with no change to the code under test.",
        "`Target [X] is not instantiable` means a missing binding, an unregistered provider, or a dependency of the bound class that cannot be built.",
      ],
      commonMistakes: [
        "<b>Using `app(...)` as the normal way to get dependencies.</b> It works, but it hides what the class needs. Reserve it for things chosen at runtime.",
        "<b>Calling `new` inside a job or command.</b> They go through the container just like controllers, so type-hint on `handle()` instead.",
        "<b>Writing a binding but forgetting the provider.</b> If the provider is not listed in `bootstrap/providers.php`, `register()` never runs and the binding does not exist.",
        "<b>Reading `Target [X] is not instantiable` as always meaning a missing binding.</b> Often the binding is there and the bound class itself cannot be built.",
        "<b>Mocking the controller instead of the gateway.</b> Swap the dependency and test the real controller, otherwise you are only testing your mock.",
      ],
      quiz: [
        {
          question: "Can Laravel inject dependencies into queued jobs?",
          options: [
            "No, only controllers",
            "Only with a package",
            "Yes, type-hint them on `handle()`",
            "Only in tests",
          ],
          correctIndex: 2,
          explanation: "Jobs run through the same container as everything else.",
        },
        {
          question: "Where do bindings normally get registered?",
          options: [
            "In a route file",
            "In a migration",
            "In `.env`",
            "In a service provider's `register()` method",
          ],
          correctIndex: 3,
          explanation: "`register()` declares bindings; `boot()` is for work needing other services.",
        },
        {
          question: "Why is constructor injection usually better than `app()`?",
          options: [
            "It runs faster",
            "`app()` is deprecated",
            "It makes every dependency visible at the top of the class",
            "It skips the container",
          ],
          correctIndex: 2,
          explanation: "Scattered `app()` calls hide what a class actually needs.",
        },
        {
          question: "Why does the container make testing easier?",
          options: [
            "It disables the database",
            "It caches responses",
            "It skips middleware",
            "You can bind a fake implementation without changing the code under test",
          ],
          correctIndex: 3,
          explanation: "The controller never knew which implementation it had, so swapping it changes nothing else.",
        },
      ],
    },
  ],
  selfCheck: [
    {
      question: "What happens when you visit `/users/10`?",
      answer: "The browser sends `GET /users/10`. It reaches `public/index.php`, Laravel bootstraps itself, and the request runs through middleware.\n\nIf middleware lets it through, the router matches `/users/{id}`, works out that `id` is `10`, and calls the matching controller method. The controller fetches the user, returns a value, and Laravel turns that into an HTTP response.",
    },
    {
      question: "Why is `public/index.php` called the front door?",
      answer: "Because it is the only PHP file the outside world can reach. The web server points at `public/`, so every single web request, whatever the URL, enters through that one file and is handed to Laravel from there.\n\nNothing in `app/`, `config/` or `routes/` is reachable directly.",
    },
    {
      question: "What is bootstrapping?",
      answer: "Laravel preparing itself before it can handle a request: loading configuration, registering service providers, setting up middleware, routing and error handling.\n\nIt happens on every request, between `index.php` and your code running.",
    },
    {
      question: "What is the purpose of middleware?",
      answer: "To handle the things that should happen on many routes without repeating them in every controller.\n\nIt sits in front of your controller like an airport checkpoint. It can stop a request, for example redirecting a logged-out visitor, or let it through after adding information to it. It also runs on the way back out, which is how things like response headers get added.",
    },
    {
      question: "What does the router do?",
      answer: "It matches the incoming URL and HTTP method against your route definitions, extracts any parameters from the URL, and works out which controller method should run.\n\nWhen no route matches, that is your 404.",
    },
    {
      question: "What is the difference between a dependency and Dependency Injection?",
      answer: "A <b>dependency</b> is the thing: any object a class needs to do its job, like a `PaymentService`.\n\n<b>Dependency Injection</b> is the technique: giving the class that object from outside instead of having it build one. One is a noun, the other is how it gets there.",
    },
    {
      question: "What problem does the Service Container solve?",
      answer: "Without it, every class is responsible for knowing how to construct everything it uses, including each one's configuration. That knowledge spreads through your application and is duplicated everywhere.\n\nThe container centralises it. Your class declares what it needs; the container decides what to give it. Because the decision lives in one place, you can change it without editing the classes that depend on it.",
    },
    {
      question: "What is binding?",
      answer: "Telling the container which class to hand over when something is asked for:\n\n```php\n$this->app->bind(PaymentGateway::class, StripePaymentGateway::class);\n```\n\nRead as a rule: when someone asks for `PaymentGateway`, give them `StripePaymentGateway`.",
    },
    {
      question: "What is resolving?",
      answer: "Asking the container to produce something, for example `app(PaymentGateway::class)`.\n\nBinding writes the rule; resolving uses it. Most of the time you never resolve by hand, because type-hinting a constructor makes Laravel resolve it for you.",
    },
    {
      question: "What is autowiring?",
      answer: "The container reading a class's type hints and building its dependencies automatically, with no binding from you.\n\nAsk for a `UserController` that needs a `UserService` that needs a `UserRepository`, and the container walks the whole chain and constructs each one.",
    },
    {
      question: "When can Laravel automatically resolve a class?",
      answer: "When it is a concrete class and everything it needs is also resolvable.\n\nA class with no constructor arguments is trivially resolvable. A class whose constructor type-hints other concrete classes is fine too, because the container just recurses. It stops being automatic as soon as something in the chain is an interface, or needs a plain value like an API key.",
    },
    {
      question: "Why does an interface usually need a container binding?",
      answer: "An interface is a contract with no code behind it, so there is nothing to construct. And it may have several implementations: Stripe, PayPal, a fake for tests.\n\nThe container has no basis for picking one, so it refuses and asks you to say which.",
    },
    {
      question: "What is the difference between `bind()` and `singleton()`?",
      answer: "`bind()` lets the container build a fresh object every time something resolves it. `singleton()` builds one object the first time and reuses it from then on.\n\n`bind()` is the safer default, because a fresh object carries no leftover state from whoever used it last. Reach for `singleton()` when the object is expensive to build or when sharing it is the actual point.",
    },
    {
      question: "What is `scoped()`?",
      answer: "A binding shared within one request or job, then rebuilt for the next one.\n\nIt sits between the other two: like a singleton inside a single request, like `bind()` across requests. It is the right choice for anything holding data about the current request, which a real singleton would wrongly carry into the next one.",
    },
    {
      question: "When would contextual binding be useful?",
      answer: "When the same contract honestly needs different answers depending on who is asking.\n\nFor example `ProfileService` should store files on S3 while `ReportService` stores them locally. Both type-hint `Storage`, neither knows the difference, and the container decides based on which class is asking. Use it sparingly: if there is one right implementation, a plain binding says so more clearly.",
    },
    {
      question: "What is the difference between constructor injection and `app()`?",
      answer: "Both get you the same object through the same bindings. The difference is visibility.\n\nConstructor injection puts every dependency at the top of the class, so reading the constructor tells you what the class needs. `app()` calls hide dependencies inside method bodies, and you only find them by reading every line. Use constructor injection unless what you need is genuinely decided at runtime.",
    },
    {
      question: "Where would you normally register an interface binding?",
      answer: "In the `register()` method of a service provider, usually `app/Providers/AppServiceProvider.php`.\n\nIf you write a binding and it seems to have no effect, check that the provider holding it is listed in `bootstrap/providers.php`. An unregistered provider means `register()` never runs.",
    },
    {
      question: "Can Laravel inject dependencies into jobs?",
      answer: "Yes. Type-hint what you need on the job's `handle()` method and the container resolves it when the job runs.\n\nThis is worth appreciating: a job running at 3am on a queue worker gets its dependencies exactly the way a controller does during a web request. It is the same container.",
    },
    {
      question: "Can Laravel inject dependencies into Artisan commands?",
      answer: "Yes, the same way: type-hint them on the command's `handle()` method.\n\nControllers, jobs, commands and services all resolve through one container, which is why the pattern you learn once applies everywhere.",
    },
    {
      question: "Why is Dependency Injection useful for testing?",
      answer: "Because you can swap a real implementation for a fake without touching the code being tested.\n\nIn production `PaymentGateway` resolves to `StripePaymentGateway`. In a test you bind it to `FakePaymentGateway` instead. Your controller, routes, validation and middleware are all still the real ones under test, and only the payment call is fake. The controller never knew which gateway it had, which is exactly what makes the swap possible.",
      callout: "If a test has to mock the controller itself, the dependency is probably still being created inside it.",
    },
  ],
  finalQuiz: [
    {
      question: "What is the first entry point of a Laravel web request?",
      options: [
        "`public/index.php`",
        "`routes/web.php`",
        "`app/Models/User.php`",
        "`.env`",
      ],
      correctIndex: 0,
      explanation: "The web server points at `public/`, so `index.php` is the only PHP file reachable from outside.",
    },
    {
      question: "What is bootstrapping?",
      options: [
        "Installing Composer",
        "Creating a controller",
        "Creating a database",
        "Starting and preparing the Laravel application",
      ],
      correctIndex: 3,
      explanation: "Configuration, providers and middleware are set up before any request is handled.",
    },
    {
      question: "What does middleware do?",
      options: [
        "Acts as a checkpoint in the request pipeline",
        "Always queries the database",
        "Creates models",
        "Installs packages",
      ],
      correctIndex: 0,
      explanation: "It can stop a request or add information to it before your controller runs.",
    },
    {
      question: "What does the router do?",
      options: [
        "Generates migrations",
        "Creates database tables",
        "Compiles PHP",
        "Finds the route matching the request",
      ],
      correctIndex: 3,
      explanation: "It also pulls out parameters like `{id}` from the URL.",
    },
    {
      question: "What is a dependency?",
      options: [
        "A Composer package",
        "Something a class needs to do its job",
        "A database table",
        "An HTTP method",
      ],
      correctIndex: 1,
      explanation: "If the class cannot work without it, it is a dependency.",
    },
    {
      question: "What is Dependency Injection?",
      options: [
        "Removing dependencies",
        "Installing dependencies",
        "Giving a class the objects it needs from outside",
        "Creating database relations",
      ],
      correctIndex: 2,
      explanation: "The class declares what it needs instead of building it.",
    },
    {
      question: "What is the Service Container?",
      options: [
        "A database container",
        "Laravel's system for creating and handing out dependencies",
        "A Docker container",
        "A route container",
      ],
      correctIndex: 1,
      explanation: "Controllers, jobs, commands and services all resolve through it.",
    },
    {
      question: "What does `bind()` do?",
      options: [
        "Creates a database binding",
        "Connects a contract to an implementation",
        "Creates a route",
        "Starts Laravel",
      ],
      correctIndex: 1,
      explanation: "It writes the rule the container follows when resolving.",
    },
    {
      question: "Why can't Laravel choose between multiple implementations of an interface?",
      options: [
        "Controllers cannot use interfaces",
        "PHP does not support interfaces",
        "Composer is required",
        "An interface has no implementation of its own",
      ],
      correctIndex: 3,
      explanation: "There is nothing to build and no way to guess which class you meant.",
    },
    {
      question: "What is `singleton()`?",
      options: [
        "One shared instance built once and reused",
        "A database table",
        "A route",
        "A middleware",
      ],
      correctIndex: 0,
      explanation: "Everything that resolves it gets the same object.",
    },
    {
      question: "What is `scoped()`?",
      options: [
        "A database migration",
        "A service reused within the current request or job",
        "A route prefix",
        "A Blade feature",
      ],
      correctIndex: 1,
      explanation: "The next request or job gets a new instance.",
    },
    {
      question: "What is autowiring?",
      options: [
        "Automatically creating routes",
        "Automatically writing PHP code",
        "Laravel resolving dependencies from type hints",
        "Automatically creating database tables",
      ],
      correctIndex: 2,
      explanation: "It builds a whole chain of concrete classes with no binding from you.",
    },
    {
      question: "Which binding should hold data belonging to the current request?",
      options: [
        "`scoped()`",
        "`singleton()`",
        "`bind()`",
      ],
      correctIndex: 0,
      explanation: "A singleton would carry that data into the next request.",
    },
    {
      question: "When is contextual binding useful?",
      options: [
        "Always",
        "When a class has no dependencies",
        "When the same contract needs a different implementation per caller",
        "When you need a fresh object each time",
      ],
      correctIndex: 2,
      explanation: "For example one service writing to S3 while another writes locally.",
    },
    {
      question: "Why does depending on an interface make testing easier?",
      options: [
        "You bind a fake without changing the code under test",
        "It disables the database",
        "It skips middleware",
        "Tests run in parallel",
      ],
      correctIndex: 0,
      explanation: "The controller never knew which implementation it had.",
    },
    {
      question: "You see `Target [PaymentGateway] is not instantiable`. What is NOT a likely cause?",
      options: [
        "The binding was never written",
        "The provider is not registered",
        "The route is missing a name",
        "The bound class needs something that cannot be built",
      ],
      correctIndex: 2,
      explanation: "Route names have nothing to do with container resolution.",
    },
  ],
  practice: [
    "Build the payment exercise end to end: a `PaymentGateway` interface, a `StripePaymentGateway` that implements it, a binding in `AppServiceProvider::register()`, and a `CheckoutController` that type-hints the interface and calls `charge(100)`. Write no `new` inside the controller.",
    "Now add `PayPalPaymentGateway`, change only the binding, and confirm the route still works. If you had to touch `CheckoutController`, something is still wired to the implementation.",
    "Write a middleware that logs the URL of every request, register it, and watch it run before your controller does.",
    "Delete your binding, hit the route, and read the `Target [PaymentGateway] is not instantiable` error properly. Recognising it on sight saves you time later.",
    "Bind a class with `bind()`, resolve it twice in one request, and compare `spl_object_id()` on both. Switch the binding to `singleton()` and compare again.",
    "Inject a dependency into an Artisan command through `handle()` and run it, so you see the container working outside a web request.",
    "Write a `FakePaymentGateway` that records its charges, bind it in a test, and assert the controller charged 100. Notice that the controller under test is the real one.",
    "Stretch: write a small service, register it in a provider, and expose it through a facade. Facades are not covered until later, so treat this as a reach and lean on the Laravel docs.",
  ],
};
