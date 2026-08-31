import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_4_LESSONS: LessonDay = {
  day: 4,
  title: "Routing — verbs, parameters, names, groups & model binding",
  totalMinutes: 71,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-routing-is",
      title: "What routing is, and where routes live",
      durationMinutes: 9,
      explanation: "Yesterday you followed a request through Laravel. One of the stops was the router. Today that stop gets a whole day.\n\nA <b>route</b> is one rule pairing a URL and an HTTP method with the code that should answer it. The <b>router</b> is the part of Laravel that reads each incoming request and finds the route that matches. <b>Routing</b> is the whole job of getting from a URL to the right code.\n\nRouting answers one question:\n\n```text\nWhen someone visits this URL with this HTTP method,\nwhat code should run?\n```\n\n```text\nGET /invoices\n       ↓\nInvoiceController@index\n\nGET /invoices/10\n       ↓\nInvoiceController@show\n\nPOST /invoices\n       ↓\nInvoiceController@store\n```\n\n---\n\n### 1. Basic — the three parts of a route\n\nEvery route is the same shape:\n\n```php\nRoute::get('/invoices', function () {\n    return 'Invoices';\n});\n```\n\nRead it as three pieces:\n\n```text\nRoute\n  │\n  ├── HTTP method → get\n  ├── URL         → /invoices\n  └── handler     → the code that answers\n```\n\nThe <b>handler</b> (the code that runs when the route matches) can be a closure, as above, or a controller method, which is what you will use in real applications:\n\n```php\nRoute::get('/invoices', [InvoiceController::class, 'index']);\n```\n\nThat is genuinely all a route is. Everything else today is a convenience on top of these three parts.\n\n---\n\n### 2. Intermediate — the two route files\n\nRoutes live in `routes/`:\n\n```text\nroutes/\n├── web.php   → pages people open in a browser\n└── api.php   → endpoints other programs call\n```\n\nThe split is not cosmetic. The two files get different middleware, which changes how requests behave.\n\n<b>`web.php`</b> routes get sessions, cookies and CSRF protection:\n\n```php\nRoute::get('/invoices', function () {\n    return view('invoices.index');\n});\n```\n\nSessions mean Laravel can remember who is logged in between requests. CSRF protection means a form posted from another site is rejected. Both matter for a browser and neither makes sense for an API.\n\n<b>`api.php`</b> routes are stateless. Every request carries its own credentials, usually a token:\n\n```php\nRoute::get('/invoices', function () {\n    return Invoice::all();\n});\n```\n\nThey are also prefixed with `/api` automatically, so that route answers `/api/invoices`.\n\n```text\nweb.php  →  /invoices       sessions, cookies, CSRF\napi.php  →  /api/invoices   stateless, token auth\n```\n\n---\n\n### 3. Advanced — api.php may not exist yet\n\nA fresh Laravel application ships with `web.php` only. This surprises people who expect both.\n\nAdd API routing when you need it:\n\n```bash\nphp artisan install:api\n```\n\nThat creates `routes/api.php`, registers it, and installs Sanctum for token authentication.\n\n```text\nFresh install\n      ↓\nroutes/web.php only\n      ↓\nphp artisan install:api\n      ↓\nroutes/web.php + routes/api.php\n```\n\nIf you are following a tutorial that opens `routes/api.php` and yours is missing, you have not broken anything. You just have not run that command yet.\n\nWhich file should a route go in? Ask who is calling it. A person with a browser gets `web.php`. A mobile app, a JavaScript front end, or another server gets `api.php`.",
      diagram: `Two files, two kinds of caller

                     Request
                        │
          ┌─────────────┴─────────────┐
          ↓                           ↓
      web.php                      api.php
          │                           │
  a person in a browser      another program
          │                           │
          ↓                           ↓
  sessions, cookies, CSRF      stateless, token auth
          │                           │
          ↓                           ↓
      /invoices                  /api/invoices


The anatomy of any route

  Route::get('/invoices', [InvoiceController::class, 'index']);
         │        │                    │
         │        │                    └── handler: what runs
         │        └── URL: what was requested
         └── HTTP method: what kind of request`,
      codeExample: {
        title: "The same route, four ways to write it",
        code: `<?php
// routes/web.php

use App\\Http\\Controllers\\InvoiceController;
use Illuminate\\Support\\Facades\\Route;

// 1. A closure. Fine for a quick test, awkward once there is real logic.
Route::get('/invoices', function () {
    return 'Invoices';
});

// 2. A controller method. What you will use in practice.
Route::get('/invoices', [InvoiceController::class, 'index']);

// 3. Returning a view.
Route::get('/invoices', function () {
    return view('invoices.index', ['invoices' => []]);
});

// 4. A view with no logic at all has its own shortcut.
Route::view('/about', 'about');


// routes/api.php  (only exists after: php artisan install:api)
// Note the URL: this answers /api/invoices, not /invoices.
Route::get('/invoices', function () {
    return ['data' => []];
});`,
      },
      keyTakeaways: [
        "A route connects an <b>HTTP method</b> and a <b>URL</b> to a <b>handler</b>. Everything else is convenience on top.",
        "The handler can be a closure or, more usually, a controller method.",
        "<b>`routes/web.php`</b> is for browsers: sessions, cookies and CSRF protection.",
        "<b>`routes/api.php`</b> is for other programs: stateless, token-authenticated, and automatically prefixed with `/api`.",
        "A fresh Laravel application has no `api.php`. Run `php artisan install:api` to add it.",
        "Choose the file by asking who calls the route, not by what it returns.",
      ],
      commonMistakes: [
        "<b>Expecting `routes/api.php` in a fresh install.</b> It is not there until you run `php artisan install:api`. Nothing is broken.",
        "<b>Forgetting that `api.php` adds `/api` for you.</b> Writing `Route::get('/api/invoices', ...)` in `api.php` gives you `/api/api/invoices`.",
        "<b>Putting browser routes in `api.php`.</b> They lose sessions, so `auth()->user()` is empty and login appears not to work.",
        "<b>Posting a form to a `web.php` route without a CSRF token.</b> You get a 419 error. Add `@csrf` inside the form.",
      ],
      quiz: [
        {
          question: "What three things does a route connect?",
          options: [
            "A model, a view and a controller",
            "An HTTP method, a URL and a handler",
            "A database, a query and a result",
            "A request, a session and a cookie",
          ],
          correctIndex: 1,
          explanation: "Everything else in routing is a convenience built on those three.",
        },
        {
          question: "What is the main difference between `web.php` and `api.php`?",
          options: [
            "`api.php` is faster",
            "`web.php` cannot return JSON",
            "They get different middleware: sessions and CSRF versus stateless token auth",
            "There is no difference",
          ],
          correctIndex: 2,
          explanation: "The split changes how requests behave, not just where the code sits.",
        },
        {
          question: "You cannot find `routes/api.php`. What is wrong?",
          options: [
            "The install failed",
            "Nothing. Run `php artisan install:api` to add it",
            "It is hidden by `.gitignore`",
            "You need a package",
          ],
          correctIndex: 1,
          explanation: "Fresh Laravel applications ship with `web.php` only.",
        },
        {
          question: "A route in `api.php` is written as `/invoices`. What URL answers it?",
          options: [
            "`/invoices`",
            "Both of the first two",
            "`/api/api/invoices`",
            "`/api/invoices`",
          ],
          correctIndex: 3,
          explanation: "The `/api` prefix is added for you, which is why you should not write it yourself.",
        },
      ],
    },
    {
      id: "http-verbs",
      title: "HTTP verbs and what each one means",
      durationMinutes: 9,
      explanation: "A URL on its own is not enough. `/invoices` could mean \"show me the invoices\" or \"create an invoice\". The <b>HTTP method</b> (the verb describing what the request wants to do) is what separates them.\n\n```php\nRoute::get('/invoices', ...);    // show them\nRoute::post('/invoices', ...);   // create one\n```\n\nSame URL. Different intent. Different code.\n\n---\n\n### 1. Basic — the four you will use constantly\n\n<b>`GET`</b> retrieves something and changes nothing:\n\n```php\nRoute::get('/invoices', [InvoiceController::class, 'index']);\nRoute::get('/invoices/{id}', [InvoiceController::class, 'show']);\n```\n\n<b>`POST`</b> creates something:\n\n```php\nRoute::post('/invoices', [InvoiceController::class, 'store']);\n```\n\n<b>`PUT`</b> and <b>`PATCH`</b> both update, and the difference is how much:\n\n```php\nRoute::put('/invoices/{id}', ...);    // replace the whole thing\nRoute::patch('/invoices/{id}', ...);  // change part of it\n```\n\n<b>`DELETE`</b> removes something:\n\n```php\nRoute::delete('/invoices/{id}', ...);\n```\n\n```text\nGET     read, changes nothing\nPOST    create\nPUT     replace entirely\nPATCH   change part\nDELETE  remove\n```\n\n---\n\n### 2. Intermediate — why GET must not change anything\n\nThis is the rule people break first, so it is worth being blunt about.\n\nA `GET` request must be <b>safe</b>: calling it should leave the application unchanged. Browsers, search engines and link previewers all assume this and will happily fetch a URL without being asked.\n\nSo this is a genuine bug:\n\n```php\n// Never do this.\nRoute::get('/invoices/{id}/delete', ...);\n```\n\nIt looks harmless. Then a crawler follows every link on the page and deletes your invoices. Nobody clicked anything.\n\nDeletion is a `DELETE`, or at minimum a `POST`:\n\n```php\nRoute::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);\n```\n\n<b>PUT vs PATCH</b>, concretely. An invoice has a client, an amount and a status:\n\n```text\nPUT /invoices/10\n{ \"client\": \"Acme\", \"amount\": 500, \"status\": \"sent\" }\n   ↓ send every field; what you omit is wiped\n\nPATCH /invoices/10\n{ \"status\": \"paid\" }\n   ↓ change only what you send; everything else stays\n```\n\nIn practice most applications use `PATCH` for edits, because forms rarely submit every field.\n\n---\n\n### 3. Advanced — browsers only speak GET and POST\n\nAn HTML form cannot send `PUT`, `PATCH` or `DELETE`. It has two options and that is it.\n\nLaravel works around this with a hidden field:\n\n```html\n<form method=\"POST\" action=\"/invoices/10\">\n    @csrf\n    @method('DELETE')\n    <button>Delete</button>\n</form>\n```\n\nThe browser sends a `POST`. Laravel sees `_method=DELETE` and routes it to your `DELETE` route.\n\n```text\nBrowser sends:   POST /invoices/10  (_method=DELETE)\n                         ↓\nLaravel reads _method and treats it as:\n                 DELETE /invoices/10\n```\n\nThis only applies to HTML forms. JavaScript, mobile apps and API clients send the real verb.\n\nTwo catch-all methods exist. Use them sparingly:\n\n```php\nRoute::match(['get', 'post'], '/search', ...);  // just these two\nRoute::any('/webhook', ...);                    // every method\n```\n\n`any()` is almost always a mistake in application code. Being explicit documents what a URL accepts and lets Laravel return a proper <i>405 Method Not Allowed</i> for the rest, instead of silently accepting a `DELETE` you never intended.",
      diagram: `One URL, several meanings

  /invoices
      ├── GET    → list them
      └── POST   → create one

  /invoices/10
      ├── GET    → show it
      ├── PUT    → replace it entirely
      ├── PATCH  → change part of it
      └── DELETE → remove it


PUT vs PATCH on the same invoice

  Before   { client: Acme, amount: 500, status: sent }

  PUT      { status: paid }
    ↓      { client: null, amount: null, status: paid }
           everything you left out is gone

  PATCH    { status: paid }
    ↓      { client: Acme, amount: 500, status: paid }
           only what you sent changed


How a browser sends DELETE (it cannot)

  <form method="POST"> + @method('DELETE')
                ↓
  POST /invoices/10  with _method=DELETE
                ↓
  Laravel routes it to the DELETE route`,
      codeExample: {
        title: "Every verb, and the form trick",
        code: `<?php
// routes/web.php

use App\\Http\\Controllers\\InvoiceController;
use Illuminate\\Support\\Facades\\Route;

Route::get('/invoices', [InvoiceController::class, 'index']);
Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
Route::post('/invoices', [InvoiceController::class, 'store']);
Route::put('/invoices/{id}', [InvoiceController::class, 'replace']);
Route::patch('/invoices/{id}', [InvoiceController::class, 'update']);
Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);

// Responds to two methods only.
Route::match(['get', 'post'], '/search', [SearchController::class, 'handle']);

// Responds to all of them. Rarely what you want.
Route::any('/webhook', [WebhookController::class, 'handle']);


// This is a bug, not a shortcut. A crawler following links will
// delete your data without anyone clicking anything.
// Route::get('/invoices/{id}/delete', ...);
?>

{{-- resources/views/invoices/show.blade.php --}}
{{-- A browser can only send GET and POST, so spoof the verb. --}}
<form method="POST" action="/invoices/{{ $invoice['number'] }}">
    @csrf
    @method('DELETE')
    <button type="submit">Delete invoice</button>
</form>

{{-- Same idea for an update --}}
<form method="POST" action="/invoices/{{ $invoice['number'] }}">
    @csrf
    @method('PATCH')
    <input name="status" value="paid">
    <button type="submit">Mark paid</button>
</form>`,
      },
      keyTakeaways: [
        "The HTTP method is what lets one URL mean several different things.",
        "<b>`GET`</b> must be safe: it reads and changes nothing.",
        "<b>`POST`</b> creates, <b>`PUT`</b> replaces entirely, <b>`PATCH`</b> changes part, <b>`DELETE`</b> removes.",
        "Most edit forms want `PATCH`, because they rarely submit every field.",
        "HTML forms can only send `GET` and `POST`. Use `@method('DELETE')` to spoof the rest.",
        "Prefer explicit verbs over `any()`, so Laravel can reject the methods you did not intend.",
      ],
      commonMistakes: [
        "<b>Using `GET` for anything destructive.</b> A `GET /invoices/10/delete` route will eventually be followed by a crawler or a link preview, and your data goes with it.",
        "<b>Forgetting `@method('PATCH')` on an edit form.</b> The request arrives as a `POST`, no route matches, and you get a confusing 405.",
        "<b>Sending a partial payload to a `PUT` route.</b> Fields you omit are meant to be wiped. If that surprises you, you wanted `PATCH`.",
        "<b>Reaching for `Route::any()` to make an error go away.</b> It hides the real problem, which is usually a form sending the wrong method.",
      ],
      quiz: [
        {
          question: "Which HTTP method should never change data?",
          options: [
            "POST",
            "PATCH",
            "GET",
            "DELETE",
          ],
          correctIndex: 2,
          explanation: "Crawlers and link previewers fetch URLs without being asked, so `GET` must be safe.",
        },
        {
          question: "What is the difference between PUT and PATCH?",
          options: [
            "PUT is faster",
            "They are identical",
            "PATCH is for APIs only",
            "PUT replaces the whole resource; PATCH changes only what you send",
          ],
          correctIndex: 3,
          explanation: "Fields omitted from a `PUT` are meant to be wiped.",
        },
        {
          question: "Why do you need `@method('DELETE')` in a form?",
          options: [
            "To add security",
            "To make it faster",
            "Because HTML forms can only send GET and POST",
            "To enable CSRF",
          ],
          correctIndex: 2,
          explanation: "Laravel reads the hidden `_method` field and routes it as a DELETE.",
        },
        {
          question: "Why is `Route::any()` usually a poor choice?",
          options: [
            "It is slow",
            "It breaks caching",
            "It cannot use controllers",
            "It accepts methods you never intended and hides form bugs",
          ],
          correctIndex: 3,
          explanation: "Explicit verbs let Laravel return a proper 405 instead.",
        },
      ],
    },
    {
      id: "route-parameters",
      title: "Parameters, optional values and constraints",
      durationMinutes: 11,
      explanation: "Most URLs carry information. `/invoices/10` is not a fixed page, it is a pattern with a value in it.\n\nA <b>route parameter</b> (a named placeholder written in braces, like `{id}`) is the part of the URL that changes. A <b>constraint</b> is a rule limiting what that placeholder will match, so `/invoices/abc` can be turned away by the router instead of by your code.\n\n```text\n/invoices/{id}\n          │\n          ↓\n    /invoices/10\n          │\n          ↓\n      id = 10\n```\n\n---\n\n### 1. Basic — capturing values from the URL\n\nWrap the changing part in braces and accept it as an argument:\n\n```php\nRoute::get('/invoices/{id}', function ($id) {\n    return $id;   // \"10\"\n});\n```\n\nYou can have as many as you need. They arrive <b>in the order they appear in the URL</b>, not by name:\n\n```php\nRoute::get('/clients/{client}/invoices/{invoice}', function ($client, $invoice) {\n    return \"Client {$client}, invoice {$invoice}\";\n});\n```\n\n```text\n/clients/10/invoices/50\n         │           │\n         ↓           ↓\n     client=10   invoice=50\n```\n\nSwap the argument names in your function and Laravel will not notice. Position is what counts, which is a good reason to keep the names matching.\n\n---\n\n### 2. Intermediate — optional parameters\n\nA required parameter means the route does not match without it:\n\n```php\nRoute::get('/invoices/{id}', ...);\n```\n\n```text\n/invoices/10   ✓ matches\n/invoices      ✗ no match, 404\n```\n\nAdd `?` to make it optional, and give the PHP argument a default:\n\n```php\nRoute::get('/invoices/{status?}', function ($status = 'all') {\n    return \"Showing {$status} invoices\";\n});\n```\n\n```text\n/invoices/paid  →  \"Showing paid invoices\"\n/invoices       →  \"Showing all invoices\"\n```\n\nThe default is not optional. Leave it out and PHP throws an <i>ArgumentCountError</i> as soon as someone omits the parameter, because the function still expects an argument.\n\nOptional parameters must also come last. `{a?}/{b}` cannot work: there is no way to tell which value you meant.\n\n---\n\n### 3. Advanced — constraining what a parameter accepts\n\nNothing so far stops this:\n\n```text\n/invoices/banana\n```\n\nThe route matches, `$id` is `\"banana\"`, and your controller goes looking for it. A <b>constraint</b> (a rule limiting what a parameter can contain) stops it at the router instead:\n\n```php\nRoute::get('/invoices/{id}', ...)->whereNumber('id');\n```\n\n```text\n/invoices/10       ✓ matches\n/invoices/banana   ✗ no match → 404\n```\n\nThat 404 is the point. Bad input never reaches your code, so your controller does not need to defend against it.\n\nLaravel ships readable helpers:\n\n```php\n->whereNumber('id')                              // digits\n->whereAlpha('name')                             // letters\n->whereAlphaNumeric('code')                      // letters and digits\n->whereUuid('id')                                // a UUID\n->whereIn('status', ['draft', 'sent', 'paid'])   // an allowed list\n```\n\n`whereIn` is the one people underuse. It turns a whole class of invalid input into a 404 for free:\n\n```php\nRoute::get('/invoices/status/{status}', ...)\n    ->whereIn('status', ['draft', 'sent', 'paid']);\n```\n\n```text\n/invoices/status/paid       ✓\n/invoices/status/exploded   ✗ 404\n```\n\nFor anything the helpers do not cover, a <b>regular expression</b> (a pattern describing which text is allowed) works:\n\n```php\nRoute::get('/invoices/{number}', ...)->where('number', 'INV-[0-9]{3}');\n```\n\n```text\n/invoices/INV-001   ✓\n/invoices/INV-1     ✗\n/invoices/10        ✗\n```\n\nYou do not need to be good at regular expressions to use Laravel. Reach for the named helpers first and drop to `where()` only when your format is genuinely custom, as an invoice number is.\n\nOne ordering rule worth knowing: Laravel matches routes <b>top to bottom, first match wins</b>. So a broad route placed above a specific one will swallow it:\n\n```php\nRoute::get('/invoices/{id}', ...);      // matches /invoices/create too\nRoute::get('/invoices/create', ...);    // never reached\n```\n\nPut the specific route first, or constrain the broad one so it cannot match.",
      diagram: `Capturing values

  /clients/{client}/invoices/{invoice}
            │                  │
            ↓                  ↓
  /clients/10/invoices/50
            │                  │
        client=10          invoice=50

  Arguments arrive by POSITION, not by name.


Required vs optional

  {id}     /invoices/10  ✓      /invoices  ✗ 404
  {id?}    /invoices/10  ✓      /invoices  ✓ uses the default

  Optional parameters must come last.


Constraints stop bad input at the router

  /invoices/banana
        ↓
  whereNumber('id')
        ↓
     ✗ no match
        ↓
      404          ← your controller never runs


Order matters: first match wins

  Route::get('/invoices/{id}')      ← swallows everything
  Route::get('/invoices/create')    ← never reached

  Put the specific route ABOVE the general one.`,
      codeExample: {
        title: "Parameters and every constraint helper",
        code: `<?php
// routes/web.php

// One parameter
Route::get('/invoices/{id}', function ($id) {
    return $id;
});

// Several. They arrive in URL order, not by name.
Route::get('/clients/{client}/invoices/{invoice}', function ($client, $invoice) {
    return "Client {$client}, invoice {$invoice}";
});

// Optional, with a PHP default. The default is required.
Route::get('/invoices/{status?}', function ($status = 'all') {
    return "Showing {$status} invoices";
});

// Constraints: the readable helpers
Route::get('/invoices/{id}', fn ($id) => $id)->whereNumber('id');
Route::get('/clients/{name}', fn ($name) => $name)->whereAlpha('name');
Route::get('/codes/{code}', fn ($code) => $code)->whereAlphaNumeric('code');
Route::get('/jobs/{id}', fn ($id) => $id)->whereUuid('id');

// An allowed list. Anything else is a 404.
Route::get('/invoices/status/{status}', fn ($status) => $status)
    ->whereIn('status', ['draft', 'sent', 'paid']);

// A custom format needs a regular expression.
Route::get('/invoices/{number}', fn ($number) => $number)
    ->where('number', 'INV-[0-9]{3}');

// Several constraints at once
Route::get('/clients/{client}/invoices/{number}', fn ($client, $number) => "$client $number")
    ->where(['client' => '[0-9]+', 'number' => 'INV-[0-9]{3}']);


// ORDER MATTERS. This is wrong:
// Route::get('/invoices/{id}', ...);      // matches "create" as an id
// Route::get('/invoices/create', ...);    // unreachable

// Either put the specific route first:
Route::get('/invoices/create', [InvoiceController::class, 'create']);
Route::get('/invoices/{id}', [InvoiceController::class, 'show']);

// Or constrain the general one so it cannot match:
Route::get('/invoices/{id}', [InvoiceController::class, 'show'])->whereNumber('id');`,
      },
      keyTakeaways: [
        "Wrap the changing part of a URL in braces to capture it as a parameter.",
        "Parameters arrive <b>in URL order</b>, not matched by name, so keep the names aligned anyway.",
        "`{param?}` makes a parameter optional, and the PHP argument then <b>needs a default value</b>.",
        "Optional parameters must be last, or Laravel cannot tell which value you meant.",
        "A <b>constraint</b> turns invalid input into a 404 at the router, before your controller runs.",
        "Prefer `whereNumber`, `whereIn` and friends over raw regular expressions; drop to `where()` only for genuinely custom formats.",
        "Routes match <b>top to bottom, first match wins</b>, so a broad route above a specific one hides it.",
      ],
      commonMistakes: [
        "<b>Marking a parameter optional but giving the function no default.</b> The route matches, then PHP throws an <i>ArgumentCountError</i> the moment someone omits it.",
        "<b>Putting an optional parameter before a required one.</b> `{a?}/{b}` is unmatchable, because there is no way to know which value is which.",
        "<b>Defining `/invoices/{id}` above `/invoices/create`.</b> The first route wins and treats `create` as an id, so the create page 404s or explodes.",
        "<b>Validating a parameter's format inside the controller.</b> A constraint does it at the router, keeps the controller clean, and returns a proper 404.",
        "<b>Assuming parameters arrive as the right type.</b> `/invoices/10` gives you the string `\"10\"`. Type-hint `int $id` if you want a number.",
      ],
      quiz: [
        {
          question: "How do route parameters get passed to your function?",
          options: [
            "In the order they appear in the URL",
            "Matched by name",
            "As one array",
            "Alphabetically",
          ],
          correctIndex: 0,
          explanation: "Renaming the arguments changes nothing, so keep them aligned for readability.",
        },
        {
          question: "What must you add when a parameter is optional?",
          options: [
            "A constraint",
            "A name for the route",
            "A default value on the PHP argument",
            "A middleware",
          ],
          correctIndex: 2,
          explanation: "Without it PHP throws an ArgumentCountError when the parameter is omitted.",
        },
        {
          question: "What does `whereNumber('id')` do when someone visits `/invoices/banana`?",
          options: [
            "The route does not match, so Laravel returns 404",
            "Throws an exception",
            "Passes it through as a string",
            "Converts it to 0",
          ],
          correctIndex: 0,
          explanation: "Bad input is stopped at the router and never reaches your controller.",
        },
        {
          question: "Why does `/invoices/create` 404 when `/invoices/{id}` is defined above it?",
          options: [
            "Laravel caches the first route",
            "`create` is a reserved word",
            "You need a constraint on `create`",
            "Routes match top to bottom and the first match wins",
          ],
          correctIndex: 3,
          explanation: "The broad route treats `create` as an id, so the specific one is never reached.",
        },
      ],
    },
    {
      id: "named-routes-and-groups",
      title: "Named routes and route groups",
      durationMinutes: 11,
      explanation: "Two features that stop route files becoming unmaintainable. One removes hard-coded URLs from your application; the other removes repetition from the route file itself.\n\nA <b>named route</b> is a route given a label, so the rest of your application refers to it by that label rather than by its URL. A <b>route group</b> is a set of routes that share settings, written once around them instead of repeated on each one.\n\n---\n\n### 1. Basic — naming a route\n\nGive a route a name:\n\n```php\nRoute::get('/invoices/{id}', [InvoiceController::class, 'show'])\n    ->name('invoices.show');\n```\n\nNow build URLs from the name instead of typing them:\n\n```php\nroute('invoices.show', ['id' => 10]);   // \"/invoices/10\"\n```\n\nIn Blade:\n\n```blade\n<a href=\"{{ route('invoices.show', ['id' => $invoice['number']]) }}\">View</a>\n```\n\nThe convention is `resource.action`: `invoices.index`, `invoices.show`, `invoices.store`.\n\n---\n\n### 2. Intermediate — why this matters more than it looks\n\nSuppose you hard-code URLs everywhere:\n\n```blade\n<a href=\"/invoices/{{ $id }}\">View</a>\n```\n\nThen the business decides invoices are now called bills. You change the route to `/bills/{id}` and every one of those links breaks. Silently. They still render, they still look like links, they just 404 when clicked. Nothing tells you which files to fix except searching and hoping.\n\nWith names, you change the route:\n\n```php\nRoute::get('/bills/{id}', ...)->name('invoices.show');\n```\n\nand every `route('invoices.show')` in the application produces the new URL. Nothing else changes.\n\n```text\nHard-coded         Named\n/invoices/10       route('invoices.show', ...)\n     ↓                      ↓\nURL changes        URL changes\n     ↓                      ↓\nlinks silently     every link updates\nbreak                itself\n```\n\nThere is a second benefit: `route()` fails loudly. Misspell a route name and you get an exception naming the route, immediately. A misspelt hard-coded URL is a 404 you find in production.\n\n---\n\n### 3. Advanced — grouping shared configuration\n\nRoutes that share settings can be grouped instead of repeating them.\n\nA <b>prefix</b> puts text at the front of each URL:\n\n```php\nRoute::prefix('admin')->group(function () {\n    Route::get('/invoices', ...);   // /admin/invoices\n    Route::get('/clients', ...);    // /admin/clients\n});\n```\n\nA <b>name prefix</b> does the same for names. Note the trailing dot, which is easy to forget:\n\n```php\nRoute::name('admin.')->group(function () {\n    Route::get('/invoices', ...)->name('invoices');   // admin.invoices\n});\n```\n\n<b>Middleware</b> applies to everything in the group at once:\n\n```php\nRoute::middleware('auth')->group(function () {\n    Route::get('/profile', ...);\n    Route::get('/invoices', ...);\n});\n```\n\nThis is the one that matters for security. Protecting routes one by one means the day you add a route and forget the middleware, it is public and nothing warns you. Put the group around them and new routes are protected by default.\n\nA <b>controller group</b> saves naming the same class repeatedly:\n\n```php\nRoute::controller(InvoiceController::class)->group(function () {\n    Route::get('/invoices', 'index');\n    Route::get('/invoices/{id}', 'show');\n});\n```\n\nThey combine, and this is how real route files are written:\n\n```php\nRoute::prefix('admin')\n    ->name('admin.')\n    ->middleware(['auth', 'can:manage-invoices'])\n    ->group(function () {\n        Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices');\n    });\n```\n\n```text\nURL         /admin/invoices\nName        admin.invoices\nMiddleware  auth, can:manage-invoices\n```\n\nGroups also nest, and settings accumulate as you go down.\n\nFinally, groups can be split by <b>domain</b>, which is how subdomains get handled:\n\n```php\nRoute::domain('admin.invoicehub.test')->group(function () {\n    Route::get('/invoices', ...);\n});\n```\n\nA subdomain can even be a parameter, captured like any other:\n\n```php\nRoute::domain('{tenant}.invoicehub.test')->group(function () {\n    Route::get('/invoices', function ($tenant) {\n        return \"Invoices for {$tenant}\";\n    });\n});\n```",
      diagram: `Why names beat hard-coded URLs

  HARD-CODED                      NAMED
  <a href="/invoices/10">         route('invoices.show', ...)
        │                                   │
  route changes to /bills/10       route changes to /bills/10
        │                                   │
        ↓                                   ↓
  every link 404s, silently        every link updates itself
  found by users, in production    nothing to change


Groups stack their settings

  Route::prefix('admin')
       ->name('admin.')
       ->middleware('auth')
       ->group(...)
              │
    ┌─────────┼─────────┐
    ↓         ↓         ↓
  prefix    name     middleware
  /admin    admin.     auth
    │         │         │
    └─────────┼─────────┘
              ↓
    Route::get('/invoices')->name('invoices')
              ↓
  URL:   /admin/invoices
  Name:  admin.invoices
  Guard: auth


Middleware on the group, not the route

  one by one            on the group
  ─────────             ────────────
  route ✓ auth          ┌─ route
  route ✓ auth          │  route      all covered,
  route ✗ FORGOT        │  route      including the
  → publicly exposed    └─ route      one you add next`,
      codeExample: {
        title: "Names, groups, and how they combine",
        code: `<?php
// routes/web.php

use App\\Http\\Controllers\\InvoiceController;
use Illuminate\\Support\\Facades\\Route;

// ---------- Naming ----------
Route::get('/invoices/{id}', [InvoiceController::class, 'show'])
    ->name('invoices.show');

// Build URLs from the name, never by hand:
//   route('invoices.show', ['id' => 10])       => /invoices/10
//   route('invoices.show', ['id' => 10], false) => relative URL


// ---------- Prefix ----------
Route::prefix('admin')->group(function () {
    Route::get('/invoices', ...);   // /admin/invoices
    Route::get('/clients', ...);    // /admin/clients
});


// ---------- Name prefix (mind the trailing dot) ----------
Route::name('admin.')->group(function () {
    Route::get('/invoices', ...)->name('invoices');   // admin.invoices
});


// ---------- Middleware for the whole group ----------
Route::middleware('auth')->group(function () {
    Route::get('/profile', ...);
    Route::get('/invoices', ...);
});


// ---------- Controller once, methods by name ----------
Route::controller(InvoiceController::class)->group(function () {
    Route::get('/invoices', 'index')->name('invoices.index');
    Route::get('/invoices/{id}', 'show')->name('invoices.show');
});


// ---------- All of it together: how real route files look ----------
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'can:manage-invoices'])
    ->group(function () {
        Route::get('/invoices', [InvoiceController::class, 'index'])
            ->name('invoices');          // /admin/invoices, admin.invoices

        Route::get('/clients', [ClientController::class, 'index'])
            ->name('clients');           // /admin/clients, admin.clients
    });


// ---------- Subdomains, including as a parameter ----------
Route::domain('{tenant}.invoicehub.test')->group(function () {
    Route::get('/invoices', function ($tenant) {
        return "Invoices for {$tenant}";
    });
});`,
      },
      keyTakeaways: [
        "`->name('invoices.show')` lets you build URLs with `route('invoices.show', [...])` instead of typing them.",
        "Named routes mean changing a URL updates every link automatically; hard-coded URLs break silently.",
        "`route()` throws immediately on a misspelt name, whereas a bad hard-coded URL becomes a production 404.",
        "<b>`prefix()`</b> adds to the URL, <b>`name()`</b> adds to the route name (remember the trailing dot).",
        "<b>`middleware()`</b> on a group protects every route inside it, including ones you add later.",
        "Groups combine and nest, and their settings accumulate downward.",
        "<b>`domain()`</b> splits routes by subdomain, and the subdomain itself can be a parameter.",
      ],
      commonMistakes: [
        "<b>Forgetting the trailing dot in a name prefix.</b> `Route::name('admin')` gives you `admininvoices` rather than `admin.invoices`.",
        "<b>Hard-coding URLs in Blade.</b> They keep rendering after a route change and only fail when a user clicks, which is the worst time to find out.",
        "<b>Applying auth middleware route by route.</b> Sooner or later you add a route and forget, and it is public with nothing to warn you.",
        "<b>Reusing a route name in two places.</b> The last one silently wins, and `route()` starts returning a URL you did not expect.",
        "<b>Passing the wrong parameter key to `route()`.</b> Extra keys become a query string instead of failing, so `/invoices/10?id=10` is a clue you named it wrong.",
      ],
      quiz: [
        {
          question: "Why use named routes instead of hard-coded URLs?",
          options: [
            "They render faster",
            "Changing the URL updates every link automatically",
            "They are required for controllers",
            "They add security",
          ],
          correctIndex: 1,
          explanation: "Hard-coded URLs keep rendering after a change and 404 only when clicked.",
        },
        {
          question: "What does `Route::name('admin')` (no trailing dot) produce for a route named `invoices`?",
          options: [
            "`admin.invoices`",
            "`invoices`",
            "`admininvoices`",
            "An error",
          ],
          correctIndex: 2,
          explanation: "The prefix is concatenated literally, so the dot has to be part of it.",
        },
        {
          question: "Why apply auth middleware to a group rather than each route?",
          options: [
            "Routes you add later are protected by default",
            "It is faster",
            "Routes cannot take middleware individually",
            "It avoids caching issues",
          ],
          correctIndex: 0,
          explanation: "Protecting them one by one means one forgotten route is silently public.",
        },
        {
          question: "What happens if you misspell a route name in `route()`?",
          options: [
            "Laravel throws an exception naming the route",
            "It returns an empty string",
            "It returns the home page",
            "It returns a 404 page",
          ],
          correctIndex: 0,
          explanation: "Failing loudly at the point of the mistake is the main advantage over a hard-coded URL.",
        },
      ],
    },
    {
      id: "resource-routes",
      title: "Resource routes and nesting",
      durationMinutes: 11,
      explanation: "Almost every resource in an application needs the same seven routes. Laravel will write them for you.\n\nA <b>resource</b> is one kind of thing your application stores: invoices, clients, users. A <b>resource route</b> is a single declaration that registers all seven of those routes for one resource, pointing them at the controller method names Laravel expects.\n\n---\n\n### 1. Basic — seven routes in one line\n\nBy hand, a full CRUD resource looks like this:\n\n```php\nRoute::get('/invoices',            [InvoiceController::class, 'index']);\nRoute::get('/invoices/create',     [InvoiceController::class, 'create']);\nRoute::post('/invoices',           [InvoiceController::class, 'store']);\nRoute::get('/invoices/{invoice}',  [InvoiceController::class, 'show']);\nRoute::get('/invoices/{invoice}/edit', [InvoiceController::class, 'edit']);\nRoute::put('/invoices/{invoice}',  [InvoiceController::class, 'update']);\nRoute::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy']);\n```\n\nAll of that is one line:\n\n```php\nRoute::resource('invoices', InvoiceController::class);\n```\n\nYou also get the names for free: `invoices.index`, `invoices.create`, `invoices.store`, `invoices.show`, `invoices.edit`, `invoices.update`, `invoices.destroy`.\n\nGenerate the matching controller with every method already stubbed:\n\n```bash\nphp artisan make:controller InvoiceController --resource\n```\n\n```text\nMethod     URL                       Controller  Name\nGET        /invoices                 index       invoices.index\nGET        /invoices/create          create      invoices.create\nPOST       /invoices                 store       invoices.store\nGET        /invoices/{invoice}       show        invoices.show\nGET        /invoices/{invoice}/edit  edit        invoices.edit\nPUT/PATCH  /invoices/{invoice}       update      invoices.update\nDELETE     /invoices/{invoice}       destroy     invoices.destroy\n```\n\nTwo of those return HTML forms rather than data: `create` shows a blank form, `edit` shows a filled one. The other five do the work.\n\n---\n\n### 2. Intermediate — trimming it down\n\nAn API has no forms, so `create` and `edit` are pointless:\n\n```php\nRoute::apiResource('invoices', InvoiceController::class);\n```\n\nThat gives five routes instead of seven, dropping `/create` and `/edit`.\n\n```bash\nphp artisan make:controller InvoiceController --api\n```\n\nYou can also take only what you need:\n\n```php\nRoute::resource('invoices', InvoiceController::class)->only(['index', 'show']);\nRoute::resource('invoices', InvoiceController::class)->except(['destroy']);\n```\n\n`only()` is worth preferring over `except()`. It states what exists rather than what does not, so adding a method later is a deliberate decision instead of an accident.\n\nOne ordering trap: `Route::resource` registers `/invoices/create` before `/invoices/{invoice}`, so the create page works. Hand-written routes are where people get this wrong.\n\n---\n\n### 3. Advanced — nesting, and why shallow exists\n\nResources often belong to other resources. An invoice has payments:\n\n```php\nRoute::resource('invoices.payments', PaymentController::class);\n```\n\n```text\nGET    /invoices/{invoice}/payments\nPOST   /invoices/{invoice}/payments\nGET    /invoices/{invoice}/payments/{payment}\nPUT    /invoices/{invoice}/payments/{payment}\nDELETE /invoices/{invoice}/payments/{payment}\n```\n\nController methods now receive both:\n\n```php\npublic function show(string $invoice, string $payment) { /* ... */ }\n```\n\nThe relationship is visible in the URL, which is the appeal.\n\nThe problem shows up on the deeper routes. To view payment 50 you must write:\n\n```text\n/invoices/10/payments/50\n```\n\nBut payment 50 already knows which invoice it belongs to. The `10` is redundant, and worse, it is a second thing that can be wrong.\n\n<b>Shallow nesting</b> keeps the parent only where it is genuinely needed:\n\n```php\nRoute::resource('invoices.payments', PaymentController::class)->shallow();\n```\n\n```text\nNeeds the parent:              Does not:\nGET  /invoices/10/payments     GET    /payments/50\nPOST /invoices/10/payments     PUT    /payments/50\n                               DELETE /payments/50\n```\n\nListing and creating need to know which invoice. Showing, updating and deleting an existing payment do not.\n\nThe rule of thumb: nest one level, and use `shallow()`. Two levels of nesting produces URLs like `/clients/1/invoices/10/payments/50/notes/3`, which nobody enjoys building or debugging.",
      diagram: `One line, seven routes

  Route::resource('invoices', InvoiceController::class)
                        │
   ┌──────────┬─────────┼─────────┬──────────┐
   ↓          ↓         ↓         ↓          ↓
 index     create     store     show      edit/update/destroy
   │          │         │         │              │
   ↓          ↓         ↓         ↓              ↓
GET        GET       POST       GET        GET/PUT/DELETE
/invoices  /create   /invoices  /{invoice}  /{invoice}[/edit]

  resource     → 7 routes (create + edit return forms)
  apiResource  → 5 routes (no forms in an API)


Shallow nesting: keep the parent only where it is needed

  FULL NESTING                    SHALLOW
  /invoices/10/payments           /invoices/10/payments      ← needs parent
  /invoices/10/payments  (POST)   /invoices/10/payments      ← needs parent
  /invoices/10/payments/50        /payments/50               ← does not
  /invoices/10/payments/50 (PUT)  /payments/50               ← does not
  /invoices/10/payments/50 (DEL)  /payments/50               ← does not

  Payment 50 already knows its invoice.
  Repeating it is redundant, and a second thing to get wrong.`,
      codeExample: {
        title: "Resource routes, trimmed and nested",
        code: `<?php
// routes/web.php

use App\\Http\\Controllers\\InvoiceController;
use App\\Http\\Controllers\\PaymentController;
use Illuminate\\Support\\Facades\\Route;

// Seven routes and seven names, in one line.
Route::resource('invoices', InvoiceController::class);

// Five routes: no /create or /edit, because an API has no forms.
Route::apiResource('invoices', InvoiceController::class);

// Only what you need. Prefer only() over except().
Route::resource('invoices', InvoiceController::class)->only(['index', 'show']);
Route::resource('invoices', InvoiceController::class)->except(['destroy']);

// Rename the URL segment without renaming the routes.
Route::resource('invoices', InvoiceController::class)
    ->parameters(['invoices' => 'number']);   // /invoices/{number}

// Nested: payments belong to an invoice.
Route::resource('invoices.payments', PaymentController::class);

// Shallow: parent only where it is actually needed.
Route::resource('invoices.payments', PaymentController::class)->shallow();

// Resources work inside groups like anything else.
Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    Route::resource('invoices', InvoiceController::class);
    // /admin/invoices ... named admin.invoices.index, etc.
});
?>

<?php
// app/Http/Controllers/PaymentController.php
// Generated with: php artisan make:controller PaymentController --resource

class PaymentController extends Controller
{
    // Nested routes pass the parent first, then the child.
    public function index(string $invoice)
    {
        return "Payments for invoice {$invoice}";
    }

    public function show(string $invoice, string $payment)
    {
        return "Payment {$payment} on invoice {$invoice}";
    }

    // With ->shallow() this route is /payments/{payment},
    // so the parent is no longer passed at all.
}`,
      },
      keyTakeaways: [
        "<b>`Route::resource`</b> creates the seven standard CRUD routes and names them for you.",
        "<b>`Route::apiResource`</b> creates five, dropping `/create` and `/edit`, which only exist to show forms.",
        "`php artisan make:controller X --resource` (or `--api`) stubs the matching methods.",
        "Use <b>`only()`</b> to state which routes exist, rather than `except()` to state which do not.",
        "Nested resources put the relationship in the URL: `/invoices/{invoice}/payments/{payment}`.",
        "<b>`shallow()`</b> keeps the parent for index and store, and drops it once the child's own id is enough.",
        "Nest one level at most. Deeper URLs get painful to build and to debug.",
      ],
      commonMistakes: [
        "<b>Writing `/invoices/{invoice}` above `/invoices/create` by hand.</b> `Route::resource` orders these correctly; hand-written routes are where the create page mysteriously 404s.",
        "<b>Using `resource()` for an API.</b> You get two dead routes that return forms nobody will ever request.",
        "<b>Nesting more than one level.</b> `/clients/1/invoices/10/payments/50` is miserable to generate and to read.",
        "<b>Forgetting nested routes pass the parent first.</b> `show(string $payment)` on a nested route silently receives the invoice id instead.",
        "<b>Assuming `resource()` protects anything.</b> It generates routes, not authorization. Anyone can hit `destroy` until you add middleware or a policy.",
      ],
      quiz: [
        {
          question: "How many routes does `Route::resource` create?",
          options: [
            "Five",
            "Seven",
            "Four",
            "Ten",
          ],
          correctIndex: 1,
          explanation: "Two of them, `create` and `edit`, exist only to show HTML forms.",
        },
        {
          question: "Why does `apiResource` create fewer routes than `resource`?",
          options: [
            "An API has no forms, so `create` and `edit` are pointless",
            "APIs are simpler",
            "APIs cannot delete",
            "It is a performance optimisation",
          ],
          correctIndex: 0,
          explanation: "That drops it from seven routes to five.",
        },
        {
          question: "What does `shallow()` do to a nested resource?",
          options: [
            "Removes all nesting",
            "Limits nesting depth to two",
            "Makes routes faster",
            "Keeps the parent for index and store, drops it once the child's id is enough",
          ],
          correctIndex: 3,
          explanation: "Payment 50 already knows its invoice, so repeating it adds nothing.",
        },
        {
          question: "In a nested resource, what does `show()` receive first?",
          options: [
            "The parent id",
            "The child id",
            "An array of both",
            "The request",
          ],
          correctIndex: 0,
          explanation: "Parameters arrive in URL order, so the parent comes first.",
        },
      ],
    },
    {
      id: "route-model-binding",
      title: "Route model binding",
      durationMinutes: 12,
      explanation: "So far your route parameters have been strings you then have to look up. Laravel can do the lookup for you.\n\n<b>Route model binding</b> is Laravel using a route parameter to fetch the record itself, handing your code the model instead of the raw value. When no record matches, it returns a 404 before your code runs.\n\n<i>A note on timing: this lesson uses Eloquent models and a database, which InvoiceHub does not have until Day 9. Read it now so the pattern is familiar, and it will click properly when the database arrives.</i>\n\n---\n\n### 1. Basic — from id to model\n\nWithout binding, every controller method starts the same way:\n\n```php\nRoute::get('/invoices/{id}', function ($id) {\n    $invoice = Invoice::findOrFail($id);\n\n    return $invoice;\n});\n```\n\nWith <b>route model binding</b> (Laravel resolving a model from a route parameter automatically), you ask for the model directly:\n\n```php\nRoute::get('/invoices/{invoice}', function (Invoice $invoice) {\n    return $invoice;\n});\n```\n\n```text\n/invoices/10\n     ↓\n{invoice} = 10\n     ↓\ntype hint says Invoice\n     ↓\nInvoice::findOrFail(10)\n     ↓\n$invoice\n```\n\nTwo conditions make this work, and both matter:\n\n```text\n1. The route parameter is named {invoice}\n2. The argument is type-hinted Invoice\n```\n\nThe names must match. `{id}` with an `Invoice $invoice` argument will not bind, and the failure is quiet: you get a fresh empty model rather than an error, which is a confusing afternoon.\n\nYou also get 404 handling for free. No matching record means Laravel returns a 404 before your code runs, so there is no null to check.\n\n---\n\n### 2. Intermediate — binding on something other than the id\n\nBy default Laravel looks up the primary key. Often the public URL should show something more meaningful.\n\nSpecify the column inline:\n\n```php\nRoute::get('/invoices/{invoice:number}', function (Invoice $invoice) {\n    return $invoice;\n});\n```\n\n```text\nDefault:  /invoices/10\n              ↓\n          WHERE id = 10\n\nCustom:   /invoices/INV-001\n              ↓\n          WHERE number = 'INV-001'\n```\n\nIf a model should <i>always</i> bind on that column, say so once on the model:\n\n```php\nclass Invoice extends Model\n{\n    public function getRouteKeyName(): string\n    {\n        return 'number';\n    }\n}\n```\n\nRecent Laravel versions also let you mark it as an attribute on the property with `#[RouteKey]`. Both express the same idea, so check which your version supports:\n\n```text\n#[RouteKey]\n     ↓\n\"bind on this property\"\n```\n\nWhichever column you bind on needs to be <b>unique and indexed</b>. Unique because two matches means Laravel silently takes the first. Indexed because every request now queries that column, and an unindexed lookup on a large table is a slow page nobody attributes to routing.\n\n---\n\n### 3. Advanced — nested models and scoped bindings\n\nHere is a real security problem. Consider:\n\n```php\nRoute::get('/invoices/{invoice}/payments/{payment}', ...);\n```\n\nSomeone requests `/invoices/10/payments/50`, where payment 50 actually belongs to invoice 20. By default Laravel resolves each parameter independently:\n\n```text\nInvoice::find(10)   ✓ found\nPayment::find(50)   ✓ found\n                    ↓\nBoth exist, so the request proceeds\n```\n\nNothing checked that they are related. Your page happily shows another invoice's payment.\n\n<b>Scoped binding</b> resolves the child <i>through</i> the parent:\n\n```php\nRoute::get('/invoices/{invoice}/payments/{payment}', ...)->scopeBindings();\n```\n\n```text\nInvoice::find(10)\n     ↓\n$invoice->payments()->where('id', 50)->firstOrFail()\n     ↓\nNot related? → 404\n```\n\nNow the relationship is enforced by the router. On a resource:\n\n```php\nRoute::resource('invoices.payments', PaymentController::class)->scoped();\n```\n\nLaravel applies this automatically when the child uses a custom key, for example `{payment:reference}`. It does <b>not</b> when both use ids, which is the common case and exactly where the hole is. Ask for it explicitly.\n\nYou can also apply it to a whole group:\n\n```php\nRoute::scopeBindings()->group(function () {\n    // every nested route here is scoped\n});\n```\n\nThis is worth treating as a security default rather than a nicety. It is not authorization, which comes on Day 14, but it does stop one whole category of accidental data exposure.",
      diagram: `Binding turns an id into a model

  /invoices/10
       ↓
  {invoice} = "10"
       ↓
  type hint: Invoice $invoice
       ↓
  Invoice::findOrFail(10)
       ↓
  no record? → 404 before your code runs

  BOTH must line up:
    parameter named {invoice}   +   argument typed Invoice
  Mismatch binds nothing and hands you an empty model, silently.


Why scoped bindings matter

  /invoices/10/payments/50      (payment 50 belongs to invoice 20)

  WITHOUT scopeBindings()          WITH scopeBindings()
  Invoice::find(10)   ✓            Invoice::find(10)   ✓
  Payment::find(50)   ✓                    ↓
        ↓                          $invoice->payments()
  both exist → proceed                  ->where('id', 50)
        ↓                                 ->firstOrFail()
  another invoice's payment                    ↓
  rendered on your page                     404 ✓`,
      codeExample: {
        title: "Implicit, custom-key and scoped binding",
        code: `<?php
// routes/web.php

// ---------- Without binding ----------
Route::get('/invoices/{id}', function ($id) {
    $invoice = Invoice::findOrFail($id);
    return $invoice;
});

// ---------- With implicit binding ----------
// Parameter name and type hint must match.
Route::get('/invoices/{invoice}', function (Invoice $invoice) {
    return $invoice;
});

// In a controller, the same thing:
Route::get('/invoices/{invoice}', [InvoiceController::class, 'show']);

// ---------- Bind on a different column ----------
Route::get('/invoices/{invoice:number}', function (Invoice $invoice) {
    return $invoice;   // WHERE number = 'INV-001'
});

// ---------- Nested, and scoped so the child must belong to the parent ----------
Route::get('/invoices/{invoice}/payments/{payment}', function (Invoice $invoice, Payment $payment) {
    return $payment;
})->scopeBindings();

Route::resource('invoices.payments', PaymentController::class)->scoped();

Route::scopeBindings()->group(function () {
    // every nested route in here is scoped
});
?>

<?php
// app/Models/Invoice.php

class Invoice extends Model
{
    // Always bind on \`number\` instead of \`id\`, everywhere.
    // The column must be unique AND indexed: unique so two rows
    // cannot match, indexed so every request is not a table scan.
    public function getRouteKeyName(): string
    {
        return 'number';
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}


// app/Http/Controllers/InvoiceController.php

class InvoiceController extends Controller
{
    // No findOrFail, no null check. A missing invoice 404s
    // before this method is ever called.
    public function show(Invoice $invoice)
    {
        return view('invoices.show', ['invoice' => $invoice]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $invoice->update($request->validated());

        return redirect()->route('invoices.show', $invoice);
    }
}`,
      },
      keyTakeaways: [
        "<b>Route model binding</b> turns a route parameter into a model, so you skip the `findOrFail` in every method.",
        "It needs the parameter name and the type hint to match: `{invoice}` with `Invoice $invoice`.",
        "A missing record becomes a <b>404 before your controller runs</b>, so there is no null to handle.",
        "`{invoice:number}` binds on another column; `getRouteKeyName()` makes that the default for the model.",
        "A custom binding column must be <b>unique and indexed</b>, or you get wrong results and slow pages.",
        "<b>`scopeBindings()`</b> resolves a child through its parent, so unrelated records 404 instead of rendering.",
        "Scoping is not automatic when both parameters use ids, which is exactly the case that needs it.",
      ],
      commonMistakes: [
        "<b>Mismatching the parameter name and the type hint.</b> `{id}` with `Invoice $invoice` binds nothing and hands you an empty model, with no error to explain it.",
        "<b>Calling `findOrFail` on a bound model.</b> The lookup already happened. Doing it again runs a second query for no reason.",
        "<b>Binding on a column that is not unique.</b> Two matching rows means Laravel takes the first, and which one is anybody's guess.",
        "<b>Binding on an unindexed column.</b> Every request now scans the table, and the slow page rarely gets blamed on routing.",
        "<b>Assuming nested bindings check the relationship.</b> Without `scopeBindings()` they do not, and one invoice's payment renders happily under another.",
        "<b>Treating scoped binding as authorization.</b> It proves the records are related, not that this user may see them.",
      ],
      quiz: [
        {
          question: "What two things must match for implicit binding to work?",
          options: [
            "The route name and the controller name",
            "The parameter name and the type-hinted class",
            "The URL and the view name",
            "The model and the migration",
          ],
          correctIndex: 1,
          explanation: "`{invoice}` with `Invoice $invoice`. A mismatch binds nothing, silently.",
        },
        {
          question: "What happens when a bound model is not found?",
          options: [
            "You get null",
            "Laravel returns a 404 before your controller runs",
            "An empty model is created",
            "The route is skipped",
          ],
          correctIndex: 1,
          explanation: "Which is why bound methods need no null check.",
        },
        {
          question: "Why must a custom binding column be unique and indexed?",
          options: [
            "Laravel requires it",
            "To enable caching",
            "Non-unique silently picks the first match, and unindexed scans the table on every request",
            "For migrations to run",
          ],
          correctIndex: 2,
          explanation: "Both failure modes are quiet, which is what makes them dangerous.",
        },
        {
          question: "What does `scopeBindings()` prevent?",
          options: [
            "Slow queries",
            "Duplicate route names",
            "Unauthenticated access",
            "Loading a child record that belongs to a different parent",
          ],
          correctIndex: 3,
          explanation: "Without it, `/invoices/10/payments/50` renders even when payment 50 belongs elsewhere.",
        },
      ],
    },
    {
      id: "fallbacks-and-tooling",
      title: "Fallbacks, route:list and caching",
      durationMinutes: 8,
      explanation: "Three things that make working with a large route file bearable.\n\nA <b>fallback route</b> is the one that runs when nothing else matched, so you decide what a 404 looks like instead of taking Laravel's default. <b>Route caching</b> compiles every route into a single file, so the router stops re-reading your route files on each request.\n\n---\n\n### 1. Basic — catching what nothing matched\n\nWhen no route matches, Laravel returns its default 404. You can decide what happens instead:\n\n```php\nRoute::fallback(function () {\n    return response()->view('errors.404', [], 404);\n});\n```\n\nFor an API, JSON is more useful than an HTML page:\n\n```php\nRoute::fallback(function () {\n    return response()->json(['message' => 'Not Found'], 404);\n});\n```\n\n```text\nRequest\n   ↓\nroute matching\n   ├── match → controller\n   └── no match → fallback → your 404\n```\n\nTwo rules. The fallback must be defined <b>last</b>, because routes match top to bottom and a fallback declared early would swallow everything below it. And keep returning a real 404 status: a friendly page that returns 200 tells search engines the page exists.\n\n---\n\n### 2. Intermediate — seeing what you actually have\n\nOnce an application has a few hundred routes, reading the route file stops being a reliable way to know what exists. Ask Laravel:\n\n```bash\nphp artisan route:list\n```\n\n```text\nGET|HEAD   invoices                invoices.index    InvoiceController@index\nPOST       invoices                invoices.store    InvoiceController@store\nGET|HEAD   invoices/create         invoices.create   InvoiceController@create\nGET|HEAD   invoices/{invoice}      invoices.show     InvoiceController@show\nPUT|PATCH  invoices/{invoice}      invoices.update   InvoiceController@update\nDELETE     invoices/{invoice}      invoices.destroy  InvoiceController@destroy\n```\n\nThe filters are what make it usable:\n\n```bash\nphp artisan route:list --path=invoices     # only URLs containing \"invoices\"\nphp artisan route:list --name=invoices     # only routes whose name matches\nphp artisan route:list --method=POST       # only POST routes\nphp artisan route:list --except-vendor     # hide package routes\nphp artisan route:list -v                  # show middleware too\n```\n\nThis is the fastest way to answer three questions people usually guess at: is my route registered at all, what is its real name, and what middleware is actually on it. `-v` in particular settles a lot of \"why is this route public\" arguments.\n\n---\n\n### 3. Advanced — caching, and the closure trap\n\nIn production, Laravel can compile every route into a single file:\n\n```bash\nphp artisan route:cache\n```\n\nOn a large application this is a real speed-up, because Laravel loads one prepared file instead of executing every route definition on every request.\n\nThen the catch. <b>Closure routes cannot be cached.</b> Serialising a closure is not possible, so the command fails:\n\n```text\nLogicException: Unable to prepare route [/] for serialization.\nUses Closure.\n```\n\nWhich means this is fine in development and fatal at deploy time:\n\n```php\nRoute::get('/health', function () {\n    return 'ok';\n});\n```\n\nThe fix is to move it to a controller:\n\n```php\nRoute::get('/health', [HealthController::class, 'show']);\n```\n\nThis is the honest reason production applications put everything in controllers. Not purity, cacheability.\n\nTwo more things about caching that catch people out:\n\n```text\nRoutes changed but the app still serves the old ones\n    → the cache is stale. Run route:clear, or re-run route:cache.\n```\n\nCache in deployment, never in development. Otherwise every route edit appears to do nothing, and you lose twenty minutes before remembering why.\n\n```text\nDeploy\n  ↓\ninstall code\n  ↓\nphp artisan route:cache\nphp artisan config:cache\n  ↓\nserve\n```\n\n`php artisan optimize` runs the caching commands together, and `php artisan optimize:clear` undoes them all, which is the one to reach for when something inexplicable is being served.",
      diagram: `Fallback catches what nothing matched

  Request
     ↓
  route matching, top to bottom
     ├── match found → controller
     └── nothing matched
              ↓
          fallback        ← must be defined LAST
              ↓
     your 404 page, with a real 404 status


route:list answers what guessing cannot

  is it registered?     route:list --path=invoices
  what is it named?     route:list --name=invoices
  what guards it?       route:list -v


Caching, and the trap

  php artisan route:cache
            ↓
  ┌─────────────────────────┐
  │ any closure routes?     │
  └───────────┬─────────────┘
        ┌─────┴─────┐
        ↓           ↓
       yes          no
        ↓           ↓
  LogicException   one compiled file,
  "Uses Closure"   loaded fast
        ↓
  move it to a controller

  Cache on deploy. Never in development,
  or every route edit appears to do nothing.`,
      codeExample: {
        title: "Fallback, and making routes cacheable",
        code: `<?php
// routes/web.php

use App\\Http\\Controllers\\HealthController;
use Illuminate\\Support\\Facades\\Route;

// ... all your other routes ...


// The fallback MUST come last. Routes match top to bottom,
// so a fallback defined early swallows everything below it.
Route::fallback(function () {
    return response()->view('errors.404', [], 404);
});

// For an API, JSON is more useful than an HTML page:
// Route::fallback(fn () => response()->json(['message' => 'Not Found'], 404));


// ---------- Cacheable vs not ----------

// NOT cacheable. route:cache fails with:
//   LogicException: Unable to prepare route [health] for serialization. Uses Closure.
// Route::get('/health', function () {
//     return 'ok';
// });

// Cacheable. This is the real reason production apps use controllers.
Route::get('/health', [HealthController::class, 'show']);
?>

# ---------- Inspecting routes ----------
php artisan route:list
php artisan route:list --path=invoices      # URLs containing "invoices"
php artisan route:list --name=invoices      # names matching
php artisan route:list --method=POST        # one verb
php artisan route:list --except-vendor      # hide package routes
php artisan route:list -v                   # include middleware

# ---------- Deployment ----------
php artisan route:cache
php artisan config:cache
php artisan view:cache

# All three at once
php artisan optimize

# Undo them all. Reach for this when something inexplicable is served.
php artisan optimize:clear

# Just the routes
php artisan route:clear`,
      },
      keyTakeaways: [
        "<b>`Route::fallback`</b> decides what happens when nothing matches, and must be defined last.",
        "Keep a real 404 status on your fallback; a friendly page returning 200 tells search engines it exists.",
        "<b>`php artisan route:list`</b> is the reliable answer to what is registered, what it is named, and what guards it.",
        "`--path`, `--name`, `--method` and `-v` are what make that output usable on a real application.",
        "<b>`route:cache`</b> compiles routes into one file and is a genuine production speed-up.",
        "<b>Closure routes cannot be cached.</b> `route:cache` fails outright, which is the practical reason to use controllers.",
        "Cache on deploy, never in development, and reach for `optimize:clear` when stale caches are serving old behaviour.",
      ],
      commonMistakes: [
        "<b>Defining the fallback anywhere but last.</b> Routes match top to bottom, so an early fallback swallows every route below it.",
        "<b>Returning a 200 from a custom 404 page.</b> Crawlers take you at your word and index a page that does not exist.",
        "<b>Running `route:cache` in development.</b> Every route change then appears to do nothing until you clear it.",
        "<b>Deploying with a closure route.</b> `route:cache` fails at deploy time, when you least want to be converting routes to controllers.",
        "<b>Forgetting to re-cache after deploying route changes.</b> The old compiled file keeps being served.",
      ],
      quiz: [
        {
          question: "Where must a fallback route be defined?",
          options: [
            "First, so it catches everything",
            "Last, after every other route",
            "In `api.php` only",
            "Anywhere",
          ],
          correctIndex: 1,
          explanation: "Routes match top to bottom, so an early fallback swallows the rest.",
        },
        {
          question: "Why does `php artisan route:cache` fail on some applications?",
          options: [
            "Too many routes",
            "Duplicate route names",
            "Missing config cache",
            "Closure routes cannot be serialised",
          ],
          correctIndex: 3,
          explanation: "This is the practical reason production applications put handlers in controllers.",
        },
        {
          question: "Which command shows the middleware on each route?",
          options: [
            "`route:list --path=x`",
            "`route:cache`",
            "`route:list -v`",
            "`route:clear`",
          ],
          correctIndex: 2,
          explanation: "It settles most \"why is this route public\" questions immediately.",
        },
        {
          question: "You changed a route and the old behaviour is still served. What is likely?",
          options: [
            "A stale route cache; run `route:clear`",
            "A syntax error",
            "The wrong HTTP method",
            "A missing controller",
          ],
          correctIndex: 0,
          explanation: "Caching in development is the usual cause of this particular confusion.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What three things does a route connect?",
      options: [
        "A model, a view and a controller",
        "An HTTP method, a URL and a handler",
        "A request, a session and a response",
        "A prefix, a name and a group",
      ],
      correctIndex: 1,
      explanation: "Everything else in routing is convenience on top of those three.",
    },
    {
      question: "What is the practical difference between `web.php` and `api.php`?",
      options: [
        "Different middleware: sessions and CSRF versus stateless token auth",
        "`api.php` is faster",
        "`web.php` cannot return JSON",
        "None",
      ],
      correctIndex: 0,
      explanation: "`api.php` is also prefixed with `/api` automatically.",
    },
    {
      question: "Which HTTP method must never change data?",
      options: [
        "GET",
        "DELETE",
        "POST",
        "PATCH",
      ],
      correctIndex: 0,
      explanation: "Crawlers fetch URLs unprompted, so a destructive GET route will eventually fire on its own.",
    },
    {
      question: "What is the difference between PUT and PATCH?",
      options: [
        "PUT is for APIs only",
        "PUT replaces the whole resource; PATCH changes only what you send",
        "PATCH is faster",
        "They are the same",
      ],
      correctIndex: 1,
      explanation: "Fields omitted from a PUT are meant to be wiped.",
    },
    {
      question: "Why does an HTML form need `@method('DELETE')`?",
      options: [
        "For CSRF protection",
        "Because forms can only send GET and POST",
        "To speed up the request",
        "To name the route",
      ],
      correctIndex: 1,
      explanation: "Laravel reads the hidden `_method` field and routes it accordingly.",
    },
    {
      question: "How are route parameters passed to your handler?",
      options: [
        "Matched by name",
        "Alphabetically",
        "As an array",
        "In the order they appear in the URL",
      ],
      correctIndex: 3,
      explanation: "Renaming the arguments changes nothing, which surprises people on nested routes.",
    },
    {
      question: "What must accompany an optional `{param?}`?",
      options: [
        "A default value on the PHP argument",
        "A route name",
        "A constraint",
        "A middleware",
      ],
      correctIndex: 0,
      explanation: "Without it PHP throws an ArgumentCountError when the parameter is omitted.",
    },
    {
      question: "What does a constraint like `whereNumber('id')` do to bad input?",
      options: [
        "Casts it to an integer",
        "Throws an exception",
        "The route does not match, so Laravel returns 404",
        "Passes it through",
      ],
      correctIndex: 2,
      explanation: "Invalid input is rejected at the router, before your controller runs.",
    },
    {
      question: "Why does `/invoices/create` 404 when `/invoices/{id}` sits above it?",
      options: [
        "`create` is reserved",
        "It needs a name",
        "Routes match top to bottom and the first match wins",
        "Resource routes are required",
      ],
      correctIndex: 2,
      explanation: "The broad route treats `create` as an id. `Route::resource` orders these correctly for you.",
    },
    {
      question: "What is the main benefit of named routes?",
      options: [
        "Faster rendering",
        "They add authorization",
        "They enable caching",
        "Changing a URL updates every link automatically",
      ],
      correctIndex: 3,
      explanation: "Hard-coded URLs keep rendering after a change and 404 only when someone clicks.",
    },
    {
      question: "Why put auth middleware on a group rather than each route?",
      options: [
        "It is faster",
        "Routes added later are protected by default",
        "Routes cannot take middleware individually",
        "It enables route caching",
      ],
      correctIndex: 1,
      explanation: "One forgotten route is otherwise silently public.",
    },
    {
      question: "How many routes does `Route::resource` create, and `apiResource`?",
      options: [
        "Five and three",
        "Seven and seven",
        "Six and four",
        "Seven and five",
      ],
      correctIndex: 3,
      explanation: "`apiResource` drops `create` and `edit`, which exist only to return forms.",
    },
    {
      question: "What does `shallow()` do to a nested resource?",
      options: [
        "Removes nesting entirely",
        "Limits nesting to two levels",
        "Keeps the parent for index and store, drops it once the child's id is enough",
        "Caches the routes",
      ],
      correctIndex: 2,
      explanation: "The child already knows its parent, so repeating it adds nothing.",
    },
    {
      question: "What two things must line up for implicit model binding?",
      options: [
        "The model and the migration",
        "The route name and the controller",
        "The parameter name and the type-hinted class",
        "The URL and the view",
      ],
      correctIndex: 2,
      explanation: "A mismatch binds nothing and hands you an empty model, with no error.",
    },
    {
      question: "What does `scopeBindings()` prevent?",
      options: [
        "Slow queries",
        "Loading a child that belongs to a different parent",
        "Unauthenticated access",
        "Duplicate route names",
      ],
      correctIndex: 1,
      explanation: "Without it, `/invoices/10/payments/50` renders even when payment 50 belongs elsewhere.",
    },
    {
      question: "Why must a custom route key column be unique and indexed?",
      options: [
        "Non-unique picks the first match silently, and unindexed scans the table each request",
        "Laravel refuses otherwise",
        "To allow caching",
        "For scoped bindings to work",
      ],
      correctIndex: 0,
      explanation: "Both failure modes are quiet, which is what makes them costly.",
    },
    {
      question: "Why can `php artisan route:cache` fail?",
      options: [
        "Closure routes cannot be serialised",
        "Duplicate names",
        "Too many routes",
        "Missing config cache",
      ],
      correctIndex: 0,
      explanation: "This is the real reason production applications keep handlers in controllers.",
    },
    {
      question: "Where must `Route::fallback` be defined?",
      options: [
        "First",
        "Inside a group",
        "In `api.php` only",
        "Last, after every other route",
      ],
      correctIndex: 3,
      explanation: "Routes match top to bottom, so an early fallback swallows everything below.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Give it a real routing layer: resource routes, constraints and named URLs.",
    brief: "InvoiceHub currently has two routes you wrote by hand, and Blade templates with URLs typed into them. That works at two routes and stops working at twenty.\n\nToday you replace all of it with the routing you have just learned. There is still no database, so the controller keeps returning its hard-coded array. Route model binding has to wait for Day 9, and that is fine: everything else on this list works without it.",
    steps: [
      "Regenerate the controller with every CRUD method stubbed: `php artisan make:controller InvoiceController --resource`. Move your existing `index` and `show` logic into it.",
      "Replace your two hand-written routes with `Route::resource('invoices', InvoiceController::class)`. Implement `index`, `show`, `create` and `edit` against the hard-coded array; `store`, `update` and `destroy` can redirect back with a message for now.",
      "Constrain the invoice parameter to your number format with `->where('invoice', 'INV-[0-9]{3}')`, so `/invoices/banana` returns a 404 from the router rather than an error from your code.",
      "Replace every hard-coded URL in your Blade files with `route('invoices.show', ...)` and friends. There should be no `/invoices` string left in a template.",
      "Wrap an admin section in a group with a prefix, a name prefix and middleware: `Route::prefix('admin')->name('admin.')->middleware('auth')->group(...)`. Put a second invoice list inside it.",
      "Move the pay route from Day 3 into that group, and confirm it is now `/admin/invoices/{invoice}/pay` with the name `admin.invoices.pay`.",
      "Add a `Route::fallback` returning a friendly 404 view, and make sure it returns a real 404 status. Put it last.",
      "Run `php artisan route:list --path=invoices` and check the methods, names and URLs are what you expect.",
      "Run `php artisan route:cache`. If it fails with <i>Uses Closure</i>, find the closure route and move it into a controller. Then run `php artisan route:clear`, because you do not want a route cache in development.",
    ],
    acceptance: [
      "`php artisan route:list --path=invoices` shows the seven resource routes, named `invoices.*`.",
      "No Blade file contains a hard-coded invoice URL. Every link goes through `route()`.",
      "`/invoices/banana` returns a 404 from the constraint, not an exception from your controller.",
      "`php artisan route:cache` completes without error, which means no closure routes are left.",
      "Changing the resource from `invoices` to `bills` in one line changes every URL, and no template needs editing.",
    ],
    stretch: [
      "Add `Route::resource('invoices.payments', PaymentController::class)->shallow()` and compare the generated URLs with the non-shallow version in `route:list`.",
      "Add a `--method=POST` filter to `route:list` and check every state-changing route is a POST, PATCH, PUT or DELETE, and never a GET.",
      "Put the admin section on its own subdomain with `Route::domain(...)` and see what `route:list` reports.",
    ],
  },
};
