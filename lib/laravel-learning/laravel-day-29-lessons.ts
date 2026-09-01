import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_29_LESSONS: LessonDay = {
  day: 29,
  title: "Testing — Pest, feature tests, fakes & coverage",
  totalMinutes: 94,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "pest-and-environment",
      title: "Pest, PHPUnit & the test environment",
      durationMinutes: 11,
      explanation: "Twenty-eight days of building. Today is about proving any of it works.\n\n```text\ncode → test → run the behaviour → assert → pass or fail\n```\n\n---\n\n### 1. Basic — two syntaxes, one runner\n\nLaravel supports both, and Pest is built on PHPUnit:\n\n```php\n// PHPUnit\npublic function test_user_can_create_post(): void\n{\n    $response = $this->postJson('/api/posts', ['title' => 'Hello']);\n\n    $response->assertStatus(201);\n}\n```\n\n```php\n// Pest\nit('allows a user to create a post', function () {\n    $response = $this->postJson('/api/posts', ['title' => 'Hello']);\n\n    $response->assertStatus(201);\n});\n```\n\nSame runner, same assertions, less ceremony. And the name is the real difference: <b>`test_user_can_create_post` is a method name pretending to be a sentence</b>, while `it('allows a user to create a post')` is a sentence.\n\nWhich matters because <b>a failing test's name is the first thing you read</b>, often months later, and \"allows a user to create a post\" tells you what broke where `testPostStore` does not.\n\n<b>The advice is not that one is better.</b> It is: pick one and keep the suite consistent, because two styles in one project means two ways to find, name and read everything. <b>Pest for a new project</b>, PHPUnit if the codebase already is.\n\n---\n\n### 2. Intermediate — the environment\n\n```text\ndevelopment environment  ≠  testing environment\n```\n\nTests get their own configuration: their own database, cache, mail, queue and filesystem.\n\n<b>And the reason is not tidiness.</b> `RefreshDatabase` from a later lesson wipes the database between tests. Point it at your development database and your seeded work is gone; point it at production and the sentence finishes itself.\n\n```text\n❌ php artisan test  →  production database\n```\n\nThat is configured in `phpunit.xml`, which sets the environment to `testing` and overrides what tests should not share:\n\n```text\nDB_CONNECTION      an in-memory SQLite, or a separate database\nCACHE_STORE        array\nMAIL_MAILER        array\nQUEUE_CONNECTION   sync\nSESSION_DRIVER     array\n```\n\n<b>Every one of those makes tests faster and isolated</b>, and `array` drivers mean nothing survives a test.\n\n---\n\n### 3. Advanced — the decisions inside that config\n\nTwo worth understanding rather than copying.\n\n<b>SQLite in memory is fast and is not your database.</b> A suite running on `:memory:` is seconds rather than minutes, and it will not catch a MySQL-specific problem: a JSON column, a strict-mode error, a full-text index, a difference in how a date sorts. If production is MySQL, <b>run the suite against MySQL somewhere</b>, even if the fast local loop uses SQLite.\n\n<b>And `QUEUE_CONNECTION=sync` means jobs run inline.</b> Which makes tests simple and hides the queue: nothing is serialised, nothing is retried, and a job that cannot be serialised passes every test. Day 26's warning, arriving in the test suite.\n\nOne more thing worth setting early: <b>tests must not reach the network.</b> An unfaked HTTP call in a test is a test that fails when a third party has an outage, and passes for reasons unrelated to your code. Later lessons cover the fakes; the configuration decision is to make the default no.\n\nAnd the practical loop:\n\n```bash\nphp artisan test\nphp artisan test --filter=invoice\nphp artisan test tests/Feature/InvoiceTest.php\n```\n\n<b>A suite you do not run is not a safety net</b>, so the thing to optimise first is how long it takes and how often you run it.",
      diagram: `Two syntaxes, one runner

  PHPUnit
    public function test_user_can_create_post(): void

  Pest
    it('allows a user to create a post', function () { ... })

  Same runner, same assertions, less ceremony.

  The NAME is the real difference:

    test_user_can_create_post
      a method name pretending to be a sentence

    it('allows a user to create a post')
      a sentence

  A failing test's name is the first thing you read,
  often months later. "allows a user to create a post"
  tells you what broke. testPostStore does not.

  The advice is not that one is better. Pick one and
  keep the suite consistent: two styles is two ways to
  find, name and read everything.

    new project      Pest
    existing PHPUnit stay with it


The environment

    development environment  ≠  testing environment

  Tests get their own database, cache, mail, queue and
  filesystem.

  ⚠️  And the reason is not tidiness. RefreshDatabase
      WIPES the database between tests. Point it at your
      development database and your seeded work is gone.
      Point it at production and the sentence finishes
      itself.

    ❌ php artisan test  →  production database

  phpunit.xml sets APP_ENV=testing and overrides:

    DB_CONNECTION      in-memory SQLite, or a separate db
    CACHE_STORE        array
    MAIL_MAILER        array
    QUEUE_CONNECTION   sync
    SESSION_DRIVER     array

  array drivers mean nothing survives a test.


Two decisions inside that config

  SQLite in memory is FAST and is NOT your database.

    seconds instead of minutes — and it will not catch a
    MySQL-specific problem: a JSON column, a strict-mode
    error, a full-text index, a date sorting differently.

    If production is MySQL, run the suite against MySQL
    somewhere, even if the fast local loop is SQLite.

  QUEUE_CONNECTION=sync means jobs run INLINE.

    Simple, and it hides the queue: nothing is
    serialised, nothing is retried, and a job that
    cannot be serialised passes every test.

    Day 26's warning, arriving in the test suite.

  And: tests must not reach the NETWORK. An unfaked HTTP
  call fails when a third party has an outage and passes
  for reasons unrelated to your code.


The loop

    php artisan test
    php artisan test --filter=invoice
    php artisan test tests/Feature/InvoiceTest.php

  A suite you do not run is not a safety net. Optimise
  how long it takes and how often you run it.`,
      codeExample: {
        title: "Pest, PHPUnit and phpunit.xml",
        code: `<?php
// ---------- PHPUnit ----------

namespace Tests\\Feature;

use Tests\\TestCase;

class PostTest extends TestCase
{
    public function test_user_can_create_post(): void
    {
        $response = $this->postJson('/api/posts', ['title' => 'Hello']);

        $response->assertStatus(201);
    }
}


<?php
// ---------- Pest ----------

it('allows a user to create a post', function () {
    $response = $this->postJson('/api/posts', ['title' => 'Hello']);

    $response->assertStatus(201);
});

// Same runner. Same assertions. And the name is a
// sentence rather than a method name pretending to be
// one — which is what you read when it fails.


<?php
// tests/Pest.php — shared setup, once
uses(Tests\\TestCase::class, Illuminate\\Foundation\\Testing\\RefreshDatabase::class)
    ->in('Feature');


// ---------- phpunit.xml ----------
//
// <php>
//     <env name="APP_ENV" value="testing"/>
//
//     <!-- Not your development database. RefreshDatabase
//          wipes this between tests. -->
//     <env name="DB_CONNECTION" value="sqlite"/>
//     <env name="DB_DATABASE" value=":memory:"/>
//
//     <!-- Nothing survives a test. -->
//     <env name="CACHE_STORE" value="array"/>
//     <env name="SESSION_DRIVER" value="array"/>
//     <env name="MAIL_MAILER" value="array"/>
//
//     <!-- Jobs run inline, which hides the queue. -->
//     <env name="QUEUE_CONNECTION" value="sync"/>
//
//     <!-- No broadcasting from tests. -->
//     <env name="BROADCAST_CONNECTION" value="null"/>
// </php>


# ---------- Fast locally, honest in CI ----------

# Local: SQLite in memory. Seconds, not minutes.
php artisan test

# CI: the database production actually uses, because
# SQLite will not catch a JSON column, a strict-mode
# error, a full-text index, or a date sorting differently.
#
# .github/workflows/ci.yml
#   services:
#     mysql:
#       image: mysql:8
#   env:
#     DB_CONNECTION: mysql


# ---------- The loop ----------

php artisan test
php artisan test --filter=invoice
php artisan test tests/Feature/InvoiceTest.php
php artisan test --parallel

# A suite you do not run is not a safety net.


<?php
// ---------- What sync hides ----------

// QUEUE_CONNECTION=sync runs jobs inline, so:
//
//   nothing is serialised   → a job holding a closure
//                             passes every test
//   nothing is retried      → the retry path is untested
//   nothing is queued       → assertPushed finds nothing
//
// Queue::fake() is how you test dispatching, and a job's
// own test can call handle() directly.`,
      },
      keyTakeaways: [
        "<b>Pest is built on PHPUnit</b>, so both share a runner and the same assertions.",
        "<b>Pest's test name is a sentence</b>, which is what you read when a test fails months later.",
        "<b>Pick one style and keep the suite consistent</b>: Pest for a new project, PHPUnit if the codebase already is.",
        "<b>The testing environment is separate</b>, with its own database, cache, mail, queue and filesystem.",
        "<b>That is not tidiness</b>: `RefreshDatabase` wipes the database, so pointing it anywhere real destroys data.",
        "`phpunit.xml` sets `APP_ENV=testing` and overrides drivers so nothing survives a test.",
        "<b>In-memory SQLite is fast and is not your database</b>, and will not catch MySQL-specific problems.",
        "<b>Run the suite against the real database somewhere</b>, even if the fast local loop uses SQLite.",
        "<b>`QUEUE_CONNECTION=sync` runs jobs inline</b>, hiding serialisation, retries and the queue entirely.",
        "<b>Tests must not reach the network</b>, or they fail during somebody else's outage.",
        "<b>A suite you do not run is not a safety net</b>, so speed and frequency matter.",
      ],
      commonMistakes: [
        "<b>Running tests against the development database.</b> `RefreshDatabase` deletes everything in it.",
        "<b>Mixing Pest and PHPUnit styles.</b> Two ways to find, name and read every test.",
        "<b>Trusting SQLite to represent MySQL.</b> JSON columns, strict mode and full-text indexes all differ.",
        "<b>Assuming `sync` tests the queue.</b> Nothing is serialised, so an unserialisable job passes.",
        "<b>Letting tests make real HTTP calls.</b> They fail during outages and pass for unrelated reasons.",
      ],
      quiz: [
        {
          question: "What is the practical difference between Pest and PHPUnit?",
          options: [
            "Pest is a different runner",
            "Pest is built on PHPUnit with less ceremony, and its test names read as sentences",
            "PHPUnit cannot test HTTP",
            "Pest has different assertions",
          ],
          correctIndex: 1,
          explanation: "The name is what you read when a test fails months later.",
        },
        {
          question: "Why must tests use a separate database?",
          options: [
            "For speed only",
            "`RefreshDatabase` wipes it between tests, so anything real would be destroyed",
            "Laravel requires it",
            "To allow parallel runs",
          ],
          correctIndex: 1,
          explanation: "Pointing it at development loses your seeded work; production is worse.",
        },
        {
          question: "What does in-memory SQLite not catch?",
          options: [
            "Validation errors",
            "MySQL-specific behaviour: JSON columns, strict mode, full-text indexes, date sorting",
            "Authorization failures",
            "Missing routes",
          ],
          correctIndex: 1,
          explanation: "Run the suite against the real database somewhere too.",
        },
        {
          question: "What does `QUEUE_CONNECTION=sync` hide in tests?",
          options: [
            "Validation",
            "Serialisation, retries and the queue itself, so an unserialisable job passes",
            "Authorization",
            "Database writes",
          ],
          correctIndex: 1,
          explanation: "`Queue::fake()` is how you test that something was dispatched.",
        },
      ],
    },
    {
      id: "unit-vs-feature",
      title: "Unit tests, feature tests & what to test",
      durationMinutes: 11,
      explanation: "Two kinds of test, and most Laravel advice gets the ratio backwards.\n\n```text\nunit test     → isolated logic\nfeature test  → real application behaviour\n```\n\n---\n\n### 1. Basic — a unit test\n\nA unit test runs one piece of logic with no framework around it:\n\n```php\nclass PriceCalculator\n{\n    public function calculate(int $price, int $tax): int\n    {\n        return $price + $tax;\n    }\n}\n```\n\n```text\ninput → class → output\n```\n\n`100 + 10 = 110`, with <b>no HTTP, no database, no authentication, no routes</b>. Which makes it fast, precise and completely silent about whether the application works.\n\n---\n\n### 2. Intermediate — a feature test\n\nA feature test drives the real stack:\n\n```text\nHTTP request → route → middleware → controller → service → database → response\n```\n\nOne test proves:\n\n```text\nauthenticated user → POST /posts → post created → 201 → database contains it\n```\n\n<b>That is closer to the real application than any unit test can be</b>, because the route, the middleware, the validation, the authorization, the controller and the database all had to work together.\n\nAnd this is why <b>feature tests should be your primary weapon in Laravel</b>. In many languages the pyramid says \"mostly unit tests\", because wiring up the framework in a test is expensive. Laravel makes it nearly free: `$this->postJson(...)` boots the whole application. <b>So the thing that is usually expensive is cheap here</b>, and the ratio should follow.\n\n---\n\n### 3. Advanced — test behaviour, not implementation\n\nThe rule that decides whether a suite helps or hurts:\n\n```text\n❌ \"the controller calls the service's store method\"\n✅ \"the user creates a post and the database contains it\"\n```\n\n<b>The first one fails when you refactor.</b> Move the logic from the controller into an action class, and the behaviour is identical while the test is red. Now the suite is punishing you for improving the code, which is the opposite of a safety net.\n\n<b>The second one survives every refactor</b> that keeps the behaviour, and fails only when the behaviour actually breaks. That is the entire point.\n\nA useful way to hear it: <b>a test should read like a sentence a non-programmer would care about.</b> \"An unauthorised user cannot delete somebody else's invoice\" is a sentence your client would care about; \"`InvoiceController@destroy` calls `authorize`\" is not.\n\nWhen a unit test <b>is</b> the right tool: pure logic with real branching. A tax calculator, a date-range splitter, a state machine, a proration formula. <b>Twelve edge cases through an HTTP request is twelve slow tests</b>; through a class it is twelve fast ones. The split is not \"unit for small things\" but <b>unit where the logic has many cases and no dependencies</b>.",
      diagram: `Two kinds of test

  UNIT
    input → class → output

    PriceCalculator: 100 + 10 = 110

    no HTTP, no database, no auth, no routes
    fast, precise, and completely silent about
    whether the APPLICATION works


  FEATURE
    HTTP request
       ↓
    route → middleware → controller → service → database
       ↓
    response

    authenticated user
       ↓  POST /posts
    post created
       ↓
    201  +  database contains it

    Route, middleware, validation, authorization,
    controller and database ALL had to work.


Why the Laravel ratio is different

  In many languages the pyramid says "mostly unit
  tests" — because wiring the framework into a test
  is expensive.

  Laravel makes it nearly free:

    $this->postJson(...)   boots the whole application

  So the usually-expensive thing is cheap here, and
  the ratio should follow:

    feature tests are your primary weapon


The rule that decides everything

    ❌  "the controller calls the service's store method"
    ✅  "the user creates a post and the database has it"

  The first FAILS WHEN YOU REFACTOR. Move the logic
  into an action class: behaviour identical, test red.
  The suite is now punishing you for improving the
  code — the opposite of a safety net.

  The second survives every refactor that keeps the
  behaviour, and fails only when behaviour breaks.

  A test should read like a sentence a non-programmer
  would care about:

    ✅  "an unauthorised user cannot delete someone
         else's invoice"
    ❌  "InvoiceController@destroy calls authorize"


When a unit test IS the right tool

  Pure logic with real branching:
    tax calculator · date-range splitter
    state machine  · proration formula

  12 edge cases through HTTP = 12 slow tests
  12 edge cases through a class = 12 fast ones

  The split is not "unit for small things" — it is
  unit where the logic has MANY CASES and NO
  DEPENDENCIES.`,
      codeExample: {
        title: "Unit and feature, and testing behaviour",
        code: `<?php
// ---------- A unit test: pure logic, no framework ----------

// app/Support/InvoiceTotal.php
final class InvoiceTotal
{
    public function forLines(array $lines, float $taxRate): int
    {
        $subtotal = array_sum(array_map(
            fn (array $line) => $line['quantity'] * $line['unit_price'],
            $lines,
        ));

        return (int) round($subtotal * (1 + $taxRate));
    }
}

// tests/Unit/InvoiceTotalTest.php
it('adds tax to the line subtotal', function () {
    $total = new InvoiceTotal();

    expect($total->forLines([
        ['quantity' => 2, 'unit_price' => 1000],
        ['quantity' => 1, 'unit_price' => 500],
    ], 0.20))->toBe(3000);
});

it('rounds half up', function () {
    expect((new InvoiceTotal())->forLines(
        [['quantity' => 1, 'unit_price' => 101]],
        0.15,
    ))->toBe(116);
});

// Twelve edge cases here are twelve fast tests.
// Twelve edge cases through HTTP are twelve slow ones.


<?php
// ---------- A feature test: the real stack ----------

// tests/Feature/CreateInvoiceTest.php
it('lets an authenticated user create an invoice', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/invoices', [
        'client_id' => Client::factory()->create()->id,
        'due_on'    => '2026-10-01',
    ]);

    $response->assertCreated();

    $this->assertDatabaseHas('invoices', [
        'user_id' => $user->id,
        'due_on'  => '2026-10-01',
    ]);
});

// Route + middleware + validation + authorization +
// controller + database, proven in one test.


<?php
// ---------- Behaviour, not implementation ----------

// ❌ Fails the moment you refactor, even though nothing broke
it('calls the service', function () {
    $this->mock(InvoiceService::class)
        ->shouldReceive('store')
        ->once();

    $this->actingAs(User::factory()->create())
        ->postJson('/api/invoices', [...]);
});
// Move the logic into an action class → behaviour
// identical, test red. The suite is punishing you for
// improving the code.

// ✅ Survives every refactor that keeps the behaviour
it('stores the invoice', function () {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/invoices', ['due_on' => '2026-10-01', ...])
        ->assertCreated();

    $this->assertDatabaseHas('invoices', ['due_on' => '2026-10-01']);
});


<?php
// ---------- The sentence test ----------
//
// Would a non-programmer care about this sentence?
//
//   ✅ "an unauthorised user cannot delete someone
//       else's invoice"
//   ❌ "InvoiceController@destroy calls authorize"
//
// If the answer is no, you are testing implementation.

it('does not let one user delete another user\\'s invoice', function () {
    $invoice = Invoice::factory()->create();

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('invoices', ['id' => $invoice->id]);
});`,
      },
      keyTakeaways: [
        "<b>A unit test runs isolated logic</b>: input, class, output, with no HTTP, database, auth or routes.",
        "<b>A feature test drives the real stack</b>: request, route, middleware, controller, database, response.",
        "<b>Feature tests are Laravel's primary weapon</b>, because booting the app in a test is nearly free here.",
        "<b>That is why the usual pyramid advice inverts</b>: elsewhere framework wiring is expensive, here it is one method call.",
        "<b>Test behaviour, not implementation.</b> \"The database contains the post\", not \"the controller called store\".",
        "<b>Implementation tests fail when you refactor</b>, punishing you for improving code that still works.",
        "<b>A good test reads like a sentence a non-programmer would care about.</b>",
        "<b>Reach for a unit test where logic has many cases and no dependencies</b>: calculators, state machines, date maths.",
        "<b>Twelve edge cases through HTTP is twelve slow tests</b>; through a class it is twelve fast ones.",
      ],
      commonMistakes: [
        "<b>Writing mostly unit tests because a pyramid diagram said so.</b> Laravel makes feature tests cheap.",
        "<b>Asserting that a controller called a method.</b> The test goes red on refactor while behaviour is fine.",
        "<b>Testing only the happy path.</b> The failure paths are where the bugs live.",
        "<b>Pushing every calculator edge case through an HTTP request.</b> Slow, and the failure points nowhere useful.",
      ],
      quiz: [
        {
          question: "Why are feature tests the primary tool in Laravel specifically?",
          options: [
            "Unit tests do not work in PHP",
            "Booting the whole app in a test is nearly free here, so the usually-expensive thing is cheap",
            "They run faster than unit tests",
            "Laravel cannot test classes in isolation",
          ],
          correctIndex: 1,
          explanation: "`$this->postJson(...)` runs the entire stack in one call.",
        },
        {
          question: "What is wrong with asserting that a controller called a service method?",
          options: [
            "Nothing, it is precise",
            "It fails when you refactor even though behaviour is unchanged, punishing you for improving the code",
            "Mocks are not supported",
            "It is too slow",
          ],
          correctIndex: 1,
          explanation: "Behaviour assertions survive refactors; implementation assertions do not.",
        },
        {
          question: "When is a unit test the right choice?",
          options: [
            "For anything small",
            "Where the logic has many cases and no dependencies: calculators, state machines, date maths",
            "Never in Laravel",
            "For controllers",
          ],
          correctIndex: 1,
          explanation: "Twelve edge cases are twelve fast tests instead of twelve slow HTTP ones.",
        },
        {
          question: "What is a good sanity check for a test's name?",
          options: [
            "It names the class under test",
            "It reads like a sentence a non-programmer would care about",
            "It includes the HTTP method",
            "It is under 40 characters",
          ],
          correctIndex: 1,
          explanation: "If a client would not care about the sentence, you are testing implementation.",
        },
      ],
    },
    {
      id: "http-tests",
      title: "HTTP tests, assertions & query helpers",
      durationMinutes: 11,
      explanation: "Laravel gives you the whole HTTP layer in one method call.\n\n---\n\n### 1. Basic — making requests\n\nFor Blade applications:\n\n```php\n$this->get('/posts');\n$this->post('/posts', [...]);\n$this->put('/posts/1', [...]);\n$this->delete('/posts/1');\n```\n\nFor APIs, the JSON variants:\n\n```php\n$this->getJson('/api/posts');\n$this->postJson('/api/posts', [...]);\n$this->putJson('/api/posts/1', [...]);\n$this->deleteJson('/api/posts/1');\n```\n\n<b>The `Json` suffix is not cosmetic.</b> It sets `Accept: application/json`, which is what makes Laravel return a `422` with a JSON error body instead of a redirect back to a form. Use `post()` on an API route and your validation assertions will look bizarre, because you are testing the Blade path.\n\nAnd none of this starts a web server. It builds a request object, runs it through the kernel in-process and hands you the response, which is why these tests are fast.\n\n---\n\n### 2. Intermediate — assertions\n\n```php\n$response->assertStatus(200);\n$response->assertOk();          // same thing, reads better\n```\n\nThe named ones cover almost everything:\n\n```text\nassertOk()            200\nassertCreated()       201\nassertNoContent()     204\nassertRedirect()      302\nassertUnauthorized()  401   not logged in\nassertForbidden()     403   logged in, not allowed\nassertNotFound()      404\nassertUnprocessable() 422   validation failed\n```\n\n<b>Those last three are where the meaning lives.</b> 401 and 403 are different failures: one is \"who are you\", the other is \"I know who you are and no\". A test that accepts either is not testing your authorization.\n\nAssertions chain, and each one that fails prints the response, so a red test usually tells you what happened without adding a `dump()`:\n\n```php\n$this->getJson('/api/invoices')\n    ->assertOk()\n    ->assertJsonCount(3, 'data');\n```\n\n---\n\n### 3. Advanced — query strings\n\nHalf your API surface is query parameters: filters, sorting, pagination, search. Laravel 13 adds helpers so you can test them as data rather than by hand-building URLs:\n\n```text\nGET /posts?search=laravel&sort=latest\n```\n\n<b>The problem with string-building is that it hides encoding bugs.</b> A search term with a space, a plus sign or a `&` in it goes through a different code path than `?search=laravel`, and that is exactly where filter endpoints break. Building the query as an array and letting the framework encode it tests the real thing.\n\nAnd the deeper point: <b>asserting `200` on a filtered endpoint tests almost nothing.</b> An endpoint that ignores every filter you send returns `200` all day. The assertion has to be that the filter <b>changed the result</b>: three invoices exist, one is overdue, the overdue filter returns exactly one. <b>Create data that would fail if the filter were a no-op</b>, or the test is decoration.",
      diagram: `Making requests

  Blade                      API
    $this->get(...)            $this->getJson(...)
    $this->post(...)           $this->postJson(...)
    $this->put(...)            $this->putJson(...)
    $this->delete(...)         $this->deleteJson(...)

  ⚠️  The Json suffix is NOT cosmetic.

      It sets Accept: application/json — which is what
      makes Laravel return 422 + JSON errors instead of
      a redirect back to a form.

      Use post() on an API route and your validation
      assertions look bizarre: you are testing the
      Blade path.

  And no web server starts. A request object runs
  through the kernel in-process. That is the speed.


Assertions

    assertOk()              200
    assertCreated()         201
    assertNoContent()       204
    assertRedirect()        302
    assertUnauthorized()    401   who are you?
    assertForbidden()       403   I know you. No.
    assertNotFound()        404
    assertUnprocessable()   422   validation failed

  401 and 403 are DIFFERENT failures. A test that
  accepts either is not testing your authorization.

  They chain, and a failing one prints the response:

    $this->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonCount(3, 'data');


Query strings — Laravel 13 helpers

    GET /posts?search=laravel&sort=latest

  Hand-building URLs hides ENCODING bugs. A search
  term with a space, a +, or an & takes a different
  path than ?search=laravel — which is exactly where
  filter endpoints break.

  Pass the query as an array; let the framework encode.


  ⚠️  The bigger trap:

      Asserting 200 on a filtered endpoint tests
      NOTHING. An endpoint that ignores every filter
      returns 200 all day.

    ❌  ->assertOk()

    ✅  3 invoices exist, 1 is overdue
        ?filter=overdue returns exactly 1

      Create data that would FAIL if the filter were
      a no-op. Otherwise the test is decoration.`,
      codeExample: {
        title: "Requests, assertions and query parameters",
        code: `<?php
// ---------- Blade vs API ----------

// Blade: redirect + session errors
$this->post('/invoices', ['due_on' => '']);       // → 302 back

// API: JSON + 422
$this->postJson('/api/invoices', ['due_on' => '']); // → 422 JSON

// The Json suffix sets Accept: application/json.
// Get it wrong and you are testing the other path.


<?php
// ---------- Status assertions carry meaning ----------

it('rejects a guest', function () {
    $this->getJson('/api/invoices')->assertUnauthorized();   // 401
});

it('rejects a user who does not own the invoice', function () {
    $invoice = Invoice::factory()->create();

    $this->actingAs(User::factory()->create())
        ->getJson("/api/invoices/{$invoice->id}")
        ->assertForbidden();                                  // 403
});

// 401 = who are you. 403 = I know you, and no.
// A test that accepts either is not testing authorization.


<?php
// ---------- Chaining, and readable failures ----------

$this->actingAs($user)
    ->getJson('/api/invoices')
    ->assertOk()
    ->assertJsonCount(3, 'data')
    ->assertJsonPath('data.0.status', 'draft');

// Each failed assertion prints the response body, so a
// red test usually explains itself without a dump().


<?php
// ---------- Query parameters as DATA ----------

it('filters invoices by status', function () {
    $user = User::factory()->create();

    // Data that would FAIL the test if the filter did nothing
    Invoice::factory()->count(2)->for($user)->create(['status' => 'paid']);
    Invoice::factory()->for($user)->create(['status' => 'overdue']);

    $this->actingAs($user)
        ->getJson('/api/invoices?' . http_build_query([
            'status' => 'overdue',
            'sort'   => 'latest',
        ]))
        ->assertOk()
        ->assertJsonCount(1, 'data')            // ← the real assertion
        ->assertJsonPath('data.0.status', 'overdue');
});

// ❌ ->assertOk() alone would pass on an endpoint that
//    ignores the filter entirely.


<?php
// ---------- Encoding is where filters break ----------

it('handles a search term with spaces and symbols', function () {
    $user = User::factory()->create();
    Invoice::factory()->for($user)->create(['reference' => 'ACME & Co #12']);
    Invoice::factory()->for($user)->create(['reference' => 'Other']);

    $this->actingAs($user)
        ->getJson('/api/invoices?' . http_build_query(['search' => 'ACME & Co']))
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

// Hand-writing "?search=ACME & Co" into the URL string
// tests a different request than the one a browser sends.


<?php
// ---------- Headers, when they matter ----------

$this->withHeaders(['X-Tenant' => 'acme'])
    ->getJson('/api/invoices')
    ->assertOk();

$this->withToken($token)->getJson('/api/invoices')->assertOk();`,
      },
      keyTakeaways: [
        "<b>`get`/`post` for Blade, `getJson`/`postJson` for APIs</b>, and the suffix decides which code path runs.",
        "<b>The `Json` variants set `Accept: application/json`</b>, which is what turns a redirect into a `422` with JSON errors.",
        "<b>No web server starts</b>: the request runs through the kernel in-process, which is why these tests are fast.",
        "<b>Named assertions carry meaning</b>: `assertOk`, `assertCreated`, `assertForbidden`, `assertUnprocessable`.",
        "<b>401 and 403 are different failures</b>, so a test that accepts either is not testing authorization.",
        "<b>Assertions chain</b>, and a failing one prints the response, so red tests usually explain themselves.",
        "<b>Build query strings as data</b>, because hand-written URLs hide the encoding bugs that break filters.",
        "<b>Asserting `200` on a filtered endpoint tests nothing.</b> Assert that the filter changed the result.",
        "<b>Create data that would fail if the filter were a no-op</b>, or the test is decoration.",
      ],
      commonMistakes: [
        "<b>Using `post()` on an API route.</b> You get a redirect, not a `422`, and the validation assertions make no sense.",
        "<b>Accepting 401 or 403 interchangeably.</b> They mean different things and only one is correct.",
        "<b>Asserting only the status on a filter endpoint.</b> An endpoint ignoring every filter still returns `200`.",
        "<b>Seeding data where every row matches the filter.</b> The test passes whether or not filtering works.",
        "<b>Hand-writing query strings with spaces and symbols.</b> That is not the request a browser sends.",
      ],
      quiz: [
        {
          question: "What does the `Json` suffix on `postJson` actually change?",
          options: [
            "It encodes the body as JSON only",
            "It sets `Accept: application/json`, so failures return `422` with JSON errors instead of a redirect",
            "It speeds up the request",
            "It skips middleware",
          ],
          correctIndex: 1,
          explanation: "Without it you are exercising the Blade redirect path.",
        },
        {
          question: "Why is asserting `200` on a filtered endpoint not enough?",
          options: [
            "`200` is the wrong status",
            "An endpoint that ignores every filter still returns `200`, so the assertion proves nothing",
            "Filters always return `204`",
            "It is enough",
          ],
          correctIndex: 1,
          explanation: "Assert that the filter changed the result set.",
        },
        {
          question: "Why build query strings as data rather than by hand?",
          options: [
            "It is shorter",
            "Hand-written URLs hide encoding bugs, and spaces or `&` in a term are exactly where filters break",
            "Laravel rejects string URLs",
            "It avoids middleware",
          ],
          correctIndex: 1,
          explanation: "Let the framework encode, so you test the request a browser sends.",
        },
        {
          question: "What is the difference between 401 and 403?",
          options: [
            "They are interchangeable",
            "401 is \"who are you\", 403 is \"I know who you are and you may not\"",
            "401 is for APIs, 403 for Blade",
            "403 means the route is missing",
          ],
          correctIndex: 1,
          explanation: "A test accepting either is not testing authorization.",
        },
      ],
    },
    {
      id: "json-session-and-validation-assertions",
      title: "JSON, session & validation assertions",
      durationMinutes: 12,
      explanation: "Status codes tell you the request survived. These tell you it did the right thing.\n\n---\n\n### 1. Basic — asserting on JSON\n\nGiven this response:\n\n```json\n{\n    \"data\": { \"id\": 10, \"title\": \"Laravel\" }\n}\n```\n\n`assertJson` checks a subset:\n\n```php\n$response->assertJson([\n    'data' => ['title' => 'Laravel'],\n]);\n```\n\n<b>Subset matching is the useful part.</b> You do not have to know the `id`, the timestamps or anything else the response carries, so the test does not break when you add a field.\n\n---\n\n### 2. Intermediate — path and structure\n\n`assertJsonPath` targets one place with dot notation:\n\n```php\n$response->assertJsonPath('data.title', 'Laravel');\n$response->assertJsonPath('data.0.status', 'overdue');\n```\n\n```text\nJSON → data → title → expected value\n```\n\n<b>And it is strict where `assertJson` is loose</b>: `assertJsonPath('data.total', 3000)` fails if the API returns the string `\"3000\"`. Which is the bug you want caught, because a client doing arithmetic on that value will silently get string concatenation.\n\n`assertJsonStructure` checks the shape and ignores the values:\n\n```php\n$response->assertJsonStructure([\n    'data' => ['id', 'title', 'created_at'],\n]);\n```\n\nThat answers a different question: <b>does the API return what clients expect?</b> Values change per test; the contract should not. It is the closest thing to a schema test, and the one that catches an accidentally renamed field.\n\n<b>Use both.</b> Structure proves the contract, path proves the values, and neither alone is enough.\n\n---\n\n### 3. Advanced — sessions and validation\n\nFor Blade forms, the result lands in the session rather than the body:\n\n```php\n$response->assertSessionHas('success');\n$response->assertSessionHasErrors(['email', 'title']);\n```\n\nFor APIs, the same failure is a `422`:\n\n```php\n$response->assertUnprocessable()\n    ->assertJsonValidationErrors(['email', 'title']);\n```\n\n<b>And validation deserves real tests, because validation is part of your contract.</b> It is the layer that decides what your database is allowed to contain. An untested rule is a rule that can be deleted during a refactor without a single test turning red, and the first sign is bad data in production.\n\nTwo assertions that catch the opposite mistake:\n\n```php\n$response->assertSessionHasNoErrors();\n$response->assertJsonMissingValidationErrors(['name']);\n```\n\n<b>Over-strict validation is a real bug too.</b> A rule rejecting a legitimate value blocks users, and nothing fails until somebody complains. Asserting that a valid edge case is <b>accepted</b> is as important as asserting an invalid one is rejected.\n\nOne more habit worth building: <b>assert what is not there.</b>\n\n```php\n$response->assertJsonMissing(['password_hash']);\n$response->assertJsonMissingPath('data.internal_notes');\n```\n\nA leaked field passes every positive assertion you have written. Day 16's API Resources decide what goes out; <b>this is the test that proves it.</b>",
      diagram: `assertJson — subset matching

    {"data": {"id": 10, "title": "Laravel"}}

    ->assertJson(['data' => ['title' => 'Laravel']])

  You do not need to know the id or the timestamps.
  Add a field later and the test still passes.


assertJsonPath — one place, strictly

    ->assertJsonPath('data.title', 'Laravel')
    ->assertJsonPath('data.0.status', 'overdue')

    JSON → data → title → expected value

  ⚠️  STRICT where assertJson is loose:

      assertJsonPath('data.total', 3000)
        fails if the API returns "3000"

      Which is the bug you WANT caught — a client
      doing arithmetic on that gets string
      concatenation instead.


assertJsonStructure — the contract

    ->assertJsonStructure(['data' => ['id','title','created_at']])

  Shape, not values. Values change per test; the
  contract should not.

  The closest thing to a schema test, and what catches
  an accidentally renamed field.

    structure → the contract
    path      → the values
    neither alone is enough


Blade vs API failure

  BLADE                        API
    302 back                     422
    ->assertSessionHasErrors       ->assertUnprocessable
        (['email','title'])        ->assertJsonValidationErrors
    ->assertSessionHas('success')       (['email','title'])


Validation is part of your CONTRACT

  It decides what your database is allowed to contain.

  An untested rule can be deleted in a refactor without
  one test going red. The first sign is bad data in
  production.

  And over-strict validation is a real bug too:

    ->assertSessionHasNoErrors()
    ->assertJsonMissingValidationErrors(['name'])

  A rule rejecting a legitimate value blocks users, and
  nothing fails until somebody complains.


Assert what is NOT there

    ->assertJsonMissing(['password_hash'])
    ->assertJsonMissingPath('data.internal_notes')

  A leaked field passes every positive assertion you
  have written. Day 16's Resources decide what goes
  out; this is the test that proves it.`,
      codeExample: {
        title: "JSON, structure, session and validation",
        code: `<?php
// ---------- Subset, path, structure ----------

it('returns the invoice', function () {
    $user    = User::factory()->create();
    $invoice = Invoice::factory()->for($user)->create(['reference' => 'INV-001']);

    $response = $this->actingAs($user)->getJson("/api/invoices/{$invoice->id}");

    // subset: ignores id, timestamps, anything added later
    $response->assertJson(['data' => ['reference' => 'INV-001']]);

    // path: strict — "3000" would FAIL against 3000
    $response->assertJsonPath('data.total_cents', 3000);

    // structure: the contract, independent of values
    $response->assertJsonStructure([
        'data' => ['id', 'reference', 'total_cents', 'status', 'created_at'],
    ]);
});


<?php
// ---------- Assert what must NOT be there ----------

it('never exposes internal fields', function () {
    $user    = User::factory()->create();
    $invoice = Invoice::factory()->for($user)->create();

    $this->actingAs($user)
        ->getJson("/api/invoices/{$invoice->id}")
        ->assertJsonMissingPath('data.internal_notes')
        ->assertJsonMissingPath('data.cost_price_cents');
});

// A leaked field passes every positive assertion you
// have written. This is the one that catches it.


<?php
// ---------- Blade: session assertions ----------

it('shows errors when the form is empty', function () {
    $this->actingAs(User::factory()->create())
        ->post('/invoices', ['reference' => '', 'due_on' => ''])
        ->assertRedirect()
        ->assertSessionHasErrors(['reference', 'due_on']);
});

it('flashes success on a valid submission', function () {
    $this->actingAs(User::factory()->create())
        ->post('/invoices', ['reference' => 'INV-002', 'due_on' => '2026-10-01'])
        ->assertRedirect()
        ->assertSessionHasNoErrors()
        ->assertSessionHas('success');
});


<?php
// ---------- API: validation assertions ----------

it('rejects an invoice with no due date', function () {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/invoices', ['reference' => 'INV-003'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['due_on']);
});


<?php
// ---------- Over-strict validation is a bug too ----------

it('accepts a reference containing a slash', function () {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/invoices', [
            'reference' => 'INV/2026/003',      // legitimate
            'due_on'    => '2026-10-01',
        ])
        ->assertCreated()
        ->assertJsonMissingValidationErrors(['reference']);
});

// Nothing fails when a rule is too strict — until a
// user complains. Assert that valid edge cases pass.


<?php
// ---------- Fluent JSON, for bigger payloads ----------

use Illuminate\\Testing\\Fluent\\AssertableJson;

$response->assertJson(fn (AssertableJson $json) =>
    $json->has('data', 3)
         ->first(fn (AssertableJson $invoice) =>
             $invoice->where('status', 'overdue')
                     ->missing('internal_notes')
                     ->etc()
         )
);`,
      },
      keyTakeaways: [
        "<b>`assertJson` matches a subset</b>, so the test survives new fields being added to the response.",
        "<b>`assertJsonPath` targets one value with dot notation</b> and is strict about type.",
        "<b>That strictness is the point</b>: `\"3000\"` instead of `3000` breaks clients doing arithmetic.",
        "<b>`assertJsonStructure` checks the shape</b>, which is the contract clients depend on.",
        "<b>Use structure and path together</b>: one proves the contract, the other proves the values.",
        "<b>Blade failures land in the session</b> (`assertSessionHasErrors`), API failures are `422` (`assertJsonValidationErrors`).",
        "<b>Validation is part of your contract</b>, because it decides what the database may contain.",
        "<b>An untested rule can vanish in a refactor</b> with no test going red, and bad data is the first sign.",
        "<b>Over-strict validation is also a bug</b>, so assert that legitimate edge cases are accepted.",
        "<b>Assert what is not there</b> too, since a leaked field passes every positive assertion.",
      ],
      commonMistakes: [
        "<b>Only asserting status codes.</b> A `200` with the wrong body is still a broken endpoint.",
        "<b>Comparing the entire response.</b> The test breaks every time you add a harmless field.",
        "<b>Never testing that a valid edge case is accepted.</b> Over-strict rules block users silently.",
        "<b>Skipping validation tests.</b> A deleted rule turns nothing red until production data goes bad.",
        "<b>Never asserting absent fields.</b> A leaked secret satisfies every assertion you wrote.",
      ],
      quiz: [
        {
          question: "Why is `assertJson` matching a subset useful?",
          options: [
            "It runs faster",
            "The test does not break when unrelated fields are added to the response",
            "It ignores types",
            "It works on arrays only",
          ],
          correctIndex: 1,
          explanation: "You assert what you care about, not the whole payload.",
        },
        {
          question: "What does `assertJsonStructure` check that `assertJsonPath` does not?",
          options: [
            "The status code",
            "The shape of the response, independent of the values, which is the contract clients depend on",
            "The headers",
            "The database",
          ],
          correctIndex: 1,
          explanation: "It catches an accidentally renamed field.",
        },
        {
          question: "Why test that valid edge cases are accepted?",
          options: [
            "It is not necessary",
            "Over-strict validation blocks real users and nothing fails until somebody complains",
            "To increase coverage",
            "To test the database",
          ],
          correctIndex: 1,
          explanation: "The failure mode is silent, unlike a rule that is too loose.",
        },
        {
          question: "Why assert that a field is missing from a response?",
          options: [
            "For speed",
            "A leaked field passes every positive assertion you wrote, so nothing else catches it",
            "It is required by API Resources",
            "To validate the structure",
          ],
          correctIndex: 1,
          explanation: "Resources decide what goes out; this test proves it.",
        },
      ],
    },
    {
      id: "auth-and-database-testing",
      title: "actingAs, RefreshDatabase & database assertions",
      durationMinutes: 12,
      explanation: "Two things every feature test needs: a logged-in user, and a database that does not remember the last test.\n\n---\n\n### 1. Basic — `actingAs`\n\nYou do not want every test performing a real login:\n\n```php\n$user = User::factory()->create();\n\n$this->actingAs($user);\n```\n\n```text\nuser → actingAs() → authenticated request\n```\n\nThat sets the authenticated user directly, skipping the login form, the password hash and the session round-trip. <b>Which is correct, because the login flow is not what this test is about</b>: it gets its own test, once, and every other test starts from \"a user is logged in\".\n\nFor a specific guard or Sanctum ability:\n\n```php\n$this->actingAs($user, 'api');\nSanctum::actingAs($user, ['invoices:read']);\n```\n\n---\n\n### 2. Intermediate — `RefreshDatabase`\n\nWithout isolation, tests contaminate each other:\n\n```text\nTest A  creates User 1\nTest B  expects no users  →  FAIL\n```\n\nAnd worse than the failure is the <b>order dependence</b>: the suite passes alone, fails in CI, passes again on a rerun. `RefreshDatabase` fixes it:\n\n```php\nuse Illuminate\\Foundation\\Testing\\RefreshDatabase;\n```\n\n```text\ntest starts → fresh database → run → cleanup\n```\n\nIt migrates once, then wraps every test in a transaction that is rolled back at the end. So it is <b>fast</b>, despite the name suggesting a full rebuild each time.\n\n`DatabaseTransactions` does the transaction part without the migration step, for a database you maintain yourself:\n\n```text\nBEGIN → run test → ROLLBACK\n```\n\n<b>The goal is identical:</b> tests must not leak state into one another.\n\n---\n\n### 3. Advanced — asserting on the database\n\n```php\n$this->assertDatabaseHas('invoices', ['reference' => 'INV-001']);\n$this->assertDatabaseMissing('invoices', ['id' => $invoice->id]);\n$this->assertDatabaseCount('invoices', 3);\n$this->assertSoftDeleted($invoice);\n```\n\n<b>This is what proves persistence actually happened.</b> A `201` means the controller returned a status; it does not mean a row exists. A transaction that silently rolled back, a mass-assignment guard dropping a field, a save inside a conditional that never ran: all of them return `201`.\n\nAnd the sharpest one is `assertDatabaseMissing` after a delete, because <b>a delete that quietly does nothing looks exactly like a delete that worked</b> from the response side.\n\nTwo traps.\n\n<b>Soft deletes break `assertDatabaseMissing`.</b> The row is still there with `deleted_at` set, so the assertion fails on a delete that worked perfectly. Use `assertSoftDeleted` when the model soft-deletes, and `assertDatabaseMissing` when it does not. <b>Getting this backwards is how people conclude soft deletes are broken.</b>\n\n<b>And the transaction rollback hides one class of bug.</b> Because each test rolls back, code that depends on data being committed, a `DB::afterCommit` callback or a queued job reading the row from another connection, behaves differently than in production. It is the price of the speed, and worth knowing when a test passes and production does not.",
      diagram: `actingAs — skip the login flow

    $user = User::factory()->create();
    $this->actingAs($user);

    user → actingAs() → authenticated request

  No login form, no password hash, no session
  round-trip. Correct, because the login flow is not
  what this test is about: it gets its OWN test, once.

    $this->actingAs($user, 'api');
    Sanctum::actingAs($user, ['invoices:read']);


Isolation — the failure it prevents

    Test A  creates User 1
    Test B  expects no users     →  FAIL

  Worse than the failure is the ORDER DEPENDENCE:
  passes alone, fails in CI, passes on a rerun.

  RefreshDatabase

    test starts → fresh database → run → cleanup

    migrates ONCE, then wraps each test in a
    transaction and rolls it back. Fast, despite
    the name.

  DatabaseTransactions

    BEGIN → run test → ROLLBACK

    the transaction part without the migration step.

  Same goal: tests must not leak state into each other.


Asserting the database

    assertDatabaseHas('invoices', ['reference' => 'INV-001'])
    assertDatabaseMissing('invoices', ['id' => $id])
    assertDatabaseCount('invoices', 3)
    assertSoftDeleted($invoice)

  ⚠️  A 201 means the CONTROLLER returned a status.
      It does not mean a row exists.

      A rolled-back transaction, a mass-assignment
      guard dropping a field, a save inside a
      conditional that never ran — all return 201.

  And a delete that quietly does nothing looks exactly
  like one that worked, from the response side.


Two traps

  Soft deletes break assertDatabaseMissing

      row still there, deleted_at set
        ❌ assertDatabaseMissing  → fails on a
                                    delete that WORKED
        ✅ assertSoftDeleted

    Getting this backwards is how people conclude
    soft deletes are broken.

  Rollback hides commit-dependent behaviour

      DB::afterCommit callbacks and queued jobs
      reading the row from another connection behave
      differently than in production.

      The price of the speed. Worth knowing when a
      test passes and production does not.`,
      codeExample: {
        title: "Authentication, isolation and database assertions",
        code: `<?php
// ---------- tests/Pest.php: isolation for every feature test ----------

uses(
    Tests\\TestCase::class,
    Illuminate\\Foundation\\Testing\\RefreshDatabase::class,
)->in('Feature');


<?php
// ---------- actingAs ----------

it('lists only the current user\\'s invoices', function () {
    $user  = User::factory()->create();
    $other = User::factory()->create();

    Invoice::factory()->count(2)->for($user)->create();
    Invoice::factory()->count(3)->for($other)->create();

    $this->actingAs($user)
        ->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

// The login flow gets its own test, once:
it('logs a user in with the right password', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-pass')]);

    $this->post('/login', ['email' => $user->email, 'password' => 'secret-pass'])
        ->assertRedirect('/dashboard');

    $this->assertAuthenticatedAs($user);
});

// Guards and abilities
$this->actingAs($user, 'api');
Sanctum::actingAs($user, ['invoices:read']);


<?php
// ---------- 201 is not proof ----------

it('actually persists the invoice', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/api/invoices', [
        'reference' => 'INV-001',
        'due_on'    => '2026-10-01',
    ])->assertCreated();

    // The assertion that matters
    $this->assertDatabaseHas('invoices', [
        'reference' => 'INV-001',
        'user_id'   => $user->id,
    ]);
});

// Without the second assertion this passes when a
// $fillable guard silently drops 'reference'.


<?php
// ---------- Delete: soft vs hard ----------

// Hard delete
it('removes the row', function () {
    $user    = User::factory()->create();
    $invoice = Invoice::factory()->for($user)->create();

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('invoices', ['id' => $invoice->id]);
});

// Soft delete — assertDatabaseMissing would FAIL here,
// on a delete that worked perfectly.
it('soft deletes the invoice', function () {
    $user    = User::factory()->create();
    $invoice = Invoice::factory()->for($user)->create();

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}")
        ->assertNoContent();

    $this->assertSoftDeleted($invoice);
    $this->assertDatabaseCount('invoices', 1);   // the row is still there
});


<?php
// ---------- Counts catch the opposite bug ----------

it('does not create duplicates on a repeated submit', function () {
    $user    = User::factory()->create();
    $payload = ['reference' => 'INV-009', 'due_on' => '2026-10-01'];

    $this->actingAs($user)->postJson('/api/invoices', $payload)->assertCreated();
    $this->actingAs($user)->postJson('/api/invoices', $payload)->assertUnprocessable();

    $this->assertDatabaseCount('invoices', 1);
});`,
      },
      keyTakeaways: [
        "<b>`actingAs($user)` authenticates directly</b>, skipping the login form, hashing and session round-trip.",
        "<b>The login flow gets its own test once</b>, and every other test starts from a logged-in user.",
        "<b>`Sanctum::actingAs($user, [...])`</b> sets abilities for token-scoped API tests.",
        "<b>`RefreshDatabase` gives each test a clean database</b>, migrating once and rolling back per test.",
        "<b>The real danger without it is order dependence</b>: passes alone, fails in CI, passes on rerun.",
        "<b>`DatabaseTransactions` is the same idea without the migration step</b>, for a database you maintain.",
        "<b>`assertDatabaseHas` is what proves persistence</b>, because a `201` only proves the controller returned one.",
        "<b>A dropped `$fillable` field or a rolled-back transaction still returns `201`.</b>",
        "<b>Use `assertSoftDeleted` for soft-deleting models</b>, since `assertDatabaseMissing` fails on a correct delete.",
        "<b>Rollback hides commit-dependent behaviour</b> like `DB::afterCommit` and cross-connection queue reads.",
      ],
      commonMistakes: [
        "<b>Logging in through the form in every test.</b> Slow, and it retests the login flow hundreds of times.",
        "<b>Skipping `RefreshDatabase`.</b> You get order-dependent tests that pass locally and fail in CI.",
        "<b>Asserting only the status after a write.</b> A `201` with no row is a passing test and a broken feature.",
        "<b>Using `assertDatabaseMissing` on a soft-deleting model.</b> It fails on a delete that worked.",
        "<b>Forgetting counts.</b> Duplicate rows satisfy `assertDatabaseHas` perfectly.",
      ],
      quiz: [
        {
          question: "Why use `actingAs` instead of posting to the login route?",
          options: [
            "The login route cannot be tested",
            "The login flow is not what the test is about, and it gets its own test once",
            "`actingAs` is more accurate",
            "Sessions do not work in tests",
          ],
          correctIndex: 1,
          explanation: "Otherwise every test retests login and runs slower for it.",
        },
        {
          question: "What is the worst symptom of missing test isolation?",
          options: [
            "Slow tests",
            "Order dependence: the suite passes alone, fails in CI, passes on rerun",
            "Migration errors",
            "Higher memory use",
          ],
          correctIndex: 1,
          explanation: "Intermittent failures are far more expensive than consistent ones.",
        },
        {
          question: "Why is `assertCreated()` not enough after a write?",
          options: [
            "It is enough",
            "It proves the controller returned a status, not that a row exists",
            "`201` is the wrong status",
            "It only checks headers",
          ],
          correctIndex: 1,
          explanation: "A dropped fillable field or a rolled-back transaction still returns `201`.",
        },
        {
          question: "Which assertion belongs after deleting a soft-deleting model?",
          options: [
            "`assertDatabaseMissing`",
            "`assertSoftDeleted`, since the row still exists with `deleted_at` set",
            "`assertDatabaseCount(0)`",
            "`assertNoContent` only",
          ],
          correctIndex: 1,
          explanation: "`assertDatabaseMissing` fails on a delete that worked correctly.",
        },
      ],
    },
    {
      id: "factories-and-time",
      title: "Factories in tests & controlling time",
      durationMinutes: 11,
      explanation: "Two things that decide whether a test is readable and whether it is reliable.\n\n---\n\n### 1. Basic — factories\n\nDay 17's factories exist for this:\n\n```php\n// instead of\nUser::create(['name' => 'John', 'email' => 'john@example.com', ...]);\n\n// this\n$user = User::factory()->create();\nUser::factory()->count(10)->create();\n$user = User::factory()->has(Invoice::factory()->count(3))->create();\n```\n\n<b>The saving is not typing.</b> A hand-written `create` breaks every time you add a non-nullable column, in every test that used it. A factory has one definition, so a new column is one edit.\n\n---\n\n### 2. Intermediate — test data should tell the story\n\n```text\n❌ create 17 random users, 43 random posts, 8 random comments\n✅ create an authenticated user\n   create another user\n   create a post owned by the authenticated user\n```\n\n<b>The first is a test you cannot read.</b> When it fails, you have no idea which of the 43 posts mattered, and the numbers were chosen so the assertion happened to pass.\n\nThe second is the scenario in three lines, and every row exists <b>because the assertion needs it.</b> A useful check: <b>if you can delete a row and the test still passes, that row was noise.</b>\n\nSo state the interesting values explicitly and let the factory handle the rest:\n\n```php\nInvoice::factory()->for($user)->create(['status' => 'overdue']);\n```\n\nThat line says what the test is about. `'overdue'` is in the test because the assertion is about overdue invoices; the reference, the amount and the dates are noise the factory can invent.\n\n---\n\n### 3. Advanced — controlling time\n\nTime-dependent code is untestable unless you control the clock:\n\n```php\n$this->travel(5)->days();\n$this->travelTo(now()->setDate(2026, 9, 1));\n$this->freezeTime();\n$this->travelBack();\n```\n\n<b>Why freeze?</b> Consider:\n\n```php\n$expiresAt = now()->addDays(7);\n```\n\nAssert the exact timestamp against the real clock and the test fails whenever the two `now()` calls land on either side of a second boundary. <b>That is a flaky test</b>, and flaky tests are worse than missing ones: people learn to rerun until green, and then a real failure gets rerun too.\n\nFrozen, it is deterministic:\n\n```text\nfreeze at 2026-09-01 10:00 → expires at 2026-09-08 10:00\n```\n\nAnd travel is how you test anything with a deadline without waiting for it:\n\n```text\ncreate an invoice due in 7 days\ntravel 8 days\nassert it is now overdue\n```\n\nWhich covers <b>subscriptions, expirations, scheduled tasks, password reset tokens, trials and reports</b>: all the logic that is otherwise impossible to test honestly.\n\n<b>One trap.</b> Time travel moves PHP's clock, not the database's. `now()` obeys it; `CURRENT_TIMESTAMP` in a default or a raw query does not. If a test travels a year forward and a `created_at` still says today, the database wrote that value.",
      diagram: `Factories

    ❌ User::create(['name' => ..., 'email' => ..., ...])
    ✅ User::factory()->create()
       User::factory()->count(10)->create()
       User::factory()->has(Invoice::factory()->count(3))->create()

  The saving is not typing. A hand-written create()
  breaks in EVERY test when you add a non-nullable
  column. A factory has one definition.


Test data should tell the story

    ❌  17 random users
        43 random posts
        8 random comments

        Unreadable. When it fails you have no idea
        which of the 43 posts mattered — and the
        numbers were chosen so it happened to pass.

    ✅  an authenticated user
        another user
        a post owned by the authenticated user

        The scenario, in three lines.

  The check:

    if you can DELETE a row and the test still
    passes, that row was noise

  State the interesting value, let the factory
  invent the rest:

    Invoice::factory()->for($user)->create(['status' => 'overdue'])
                                            └─ the test is about this
    reference, amount, dates → noise


Controlling time

    $this->freezeTime();
    $this->travel(5)->days();
    $this->travelTo(now()->setDate(2026, 9, 1));
    $this->travelBack();

  Why freeze?

    $expiresAt = now()->addDays(7);

    Two now() calls either side of a second boundary
    and the assertion fails. That is a FLAKY test —
    worse than a missing one, because people learn to
    rerun until green, and then rerun the real
    failure too.

    frozen at 2026-09-01 10:00
      → expires at 2026-09-08 10:00     deterministic

  Travel tests deadlines without waiting:

    create invoice due in 7 days
      ↓  travel 8 days
    assert it is overdue

  Covers subscriptions · expirations · scheduled tasks
  reset tokens · trials · reports


  ⚠️  Travel moves PHP's clock, NOT the database's.

      now()              obeys it
      CURRENT_TIMESTAMP  does not

      A created_at still saying today after travelling
      a year means the DATABASE wrote that value.`,
      codeExample: {
        title: "Readable data and a controlled clock",
        code: `<?php
// ---------- Data that tells the story ----------

// ❌ Unreadable, and the numbers were reverse-engineered
//    from whatever made the assertion pass
it('lists invoices', function () {
    User::factory()->count(17)->create();
    Invoice::factory()->count(43)->create();

    $this->actingAs(User::first())->getJson('/api/invoices')->assertOk();
});

// ✅ Every row exists because the assertion needs it
it('lists only the invoices the user owns', function () {
    $user  = User::factory()->create();
    $other = User::factory()->create();

    Invoice::factory()->count(2)->for($user)->create();
    Invoice::factory()->for($other)->create();       // must NOT appear

    $this->actingAs($user)
        ->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

// Delete any of those three lines and the test stops
// proving something. That is the check.


<?php
// ---------- Say what matters, let the factory invent the rest ----------

Invoice::factory()->for($user)->create(['status' => 'overdue']);
//                                       ↑ the test is about this
// reference, amount, dates → noise the factory handles

Invoice::factory()
    ->for($user)
    ->has(LineItem::factory()->count(3))
    ->create(['status' => 'draft']);


<?php
// ---------- Freeze: kill the flake ----------

it('expires a reset token seven days out', function () {
    $this->freezeTime();                       // deterministic from here

    $token = PasswordResetToken::issueFor(User::factory()->create());

    expect($token->expires_at->toDateTimeString())
        ->toBe(now()->addDays(7)->toDateTimeString());
});

// Without freezeTime the two now() calls can land on
// either side of a second boundary. That test fails
// roughly never — which is the worst frequency.


<?php
// ---------- Travel: test a deadline without waiting for it ----------

it('marks an invoice overdue once the due date passes', function () {
    $user = User::factory()->create();

    $invoice = Invoice::factory()->for($user)->create([
        'due_on' => now()->addDays(7),
        'status' => 'sent',
    ]);

    $this->travel(8)->days();

    Artisan::call('invoices:mark-overdue');

    expect($invoice->fresh()->status)->toBe('overdue');
});

it('does not mark it overdue a day early', function () {
    $user    = User::factory()->create();
    $invoice = Invoice::factory()->for($user)
        ->create(['due_on' => now()->addDays(7), 'status' => 'sent']);

    $this->travel(6)->days();
    Artisan::call('invoices:mark-overdue');

    expect($invoice->fresh()->status)->toBe('sent');
});

// Both sides of the boundary. One alone passes with a
// command that marks everything, or nothing.


<?php
// ---------- The trap: the database has its own clock ----------

$this->travel(1)->years();

Invoice::factory()->create();

// now()              → 2027   (PHP's clock moved)
// CURRENT_TIMESTAMP  → 2026   (the database's did not)
//
// A created_at still showing today after travelling a
// year means the DATABASE wrote that column, not Eloquent.


<?php
// ---------- Scoped travel ----------

$this->travel(5)->days(function () {
    // only inside this closure
    expect(now()->toDateString())->toBe('2026-09-06');
});

$this->travelBack();   // or let the test teardown do it`,
      },
      keyTakeaways: [
        "<b>Factories keep tests short and survive schema changes</b>, because there is one definition to update.",
        "<b>Test data should tell the story of the scenario</b>, not fill the database with noise.",
        "<b>If deleting a row leaves the test passing, that row was noise.</b>",
        "<b>State the interesting value explicitly</b> and let the factory invent the rest.",
        "<b>`freezeTime()` makes timestamp assertions deterministic</b>, killing the second-boundary flake.",
        "<b>Flaky tests are worse than missing ones</b>, because people learn to rerun until green.",
        "<b>`travel()` tests deadlines without waiting for them</b>: expiry, trials, overdue, scheduled work.",
        "<b>Test both sides of a time boundary</b>, since one side alone passes on a command that does nothing.",
        "<b>Time travel moves PHP's clock, not the database's</b>, so `CURRENT_TIMESTAMP` defaults ignore it.",
      ],
      commonMistakes: [
        "<b>Creating 40 random rows to test a list.</b> Unreadable when it fails, and the count was reverse-engineered.",
        "<b>Hand-writing `create([...])` in every test.</b> One new column breaks all of them.",
        "<b>Asserting exact timestamps against the real clock.</b> A test that fails once a month is the worst kind.",
        "<b>Only testing after the deadline passes.</b> A command that marks everything overdue passes too.",
        "<b>Expecting travel to move database defaults.</b> `CURRENT_TIMESTAMP` uses the database's own clock.",
      ],
      quiz: [
        {
          question: "What is the real saving from using factories in tests?",
          options: [
            "Less typing",
            "One definition to update, so a new non-nullable column does not break every test",
            "Faster inserts",
            "Automatic assertions",
          ],
          correctIndex: 1,
          explanation: "Hand-written `create` calls scatter the schema across the suite.",
        },
        {
          question: "How do you tell whether a test's data is noise?",
          options: [
            "Count the rows",
            "Delete a row: if the test still passes, that row was noise",
            "Check the factory",
            "Run it twice",
          ],
          correctIndex: 1,
          explanation: "Every row should exist because an assertion needs it.",
        },
        {
          question: "Why is `freezeTime()` worth using for expiry logic?",
          options: [
            "It speeds the test up",
            "Two `now()` calls either side of a second boundary make the assertion intermittently fail",
            "It is required by Carbon",
            "It resets the database",
          ],
          correctIndex: 1,
          explanation: "A test that fails roughly never is the worst kind to debug.",
        },
        {
          question: "What does time travel not affect?",
          options: [
            "`now()`",
            "The database's clock, so `CURRENT_TIMESTAMP` defaults still use the real time",
            "Carbon instances",
            "Scheduled tasks",
          ],
          correctIndex: 1,
          explanation: "A timestamp that ignores your travel was written by the database.",
        },
      ],
    },
    {
      id: "fakes",
      title: "Faking mail, queues, events, storage & HTTP",
      durationMinutes: 13,
      explanation: "One rule underneath this whole lesson:\n\n<b>Ordinary tests do not call real external services.</b>\n\nNot because it is slow, though it is. Because a test that sends real email eventually emails a customer, a test that hits a real API fails during somebody else's outage, and a test that writes to real S3 leaves files behind. <b>None of those failures are about your code.</b>\n\nLaravel gives every facade a fake.\n\n---\n\n### 1. Basic — the shape is always the same\n\n```php\nMail::fake();          // swap the real thing\n// ... run the code ...\nMail::assertSent(WelcomeEmail::class);   // assert on the recording\n```\n\n```text\nfake it → run → assert what it recorded\n```\n\nThe fake replaces the driver and records every call instead of performing it. Nothing is sent, dispatched, written or requested.\n\n---\n\n### 2. Intermediate — the ones you will use\n\n```php\nMail::fake();          Mail::assertSent(InvoiceMail::class);\nQueue::fake();         Queue::assertPushed(SendInvoice::class);\nBus::fake();           Bus::assertBatched(...);\nEvent::fake();         Event::assertDispatched(InvoicePaid::class);\nNotification::fake();  Notification::assertSentTo($user, InvoicePaid::class);\nStorage::fake('public'); Storage::disk('public')->assertExists('avatars/photo.jpg');\nHttp::fake();          Http::assertSent(fn ($r) => $r->url() === '...');\n```\n\n<b>`Queue::fake()` changes what you are testing</b>, and that is the point: it proves the job was <b>dispatched</b> with the right payload, without running it. The job's own behaviour gets its own test, calling `handle()` directly. Two small tests instead of one big one that fails for two different reasons.\n\n<b>`Storage::fake()` gives you a real in-memory disk</b>, so uploads genuinely work and you assert on the result:\n\n```php\n$file = UploadedFile::fake()->image('avatar.jpg');\n```\n\n<b>`Http::fake()` is the one that pays for itself</b>, because you can finally test the failure paths. Stripe returning 500, a timeout, a 422, a malformed body: impossible to trigger against the real API, trivial to fake. And those are exactly the paths that break in production.\n\n---\n\n### 3. Advanced — the sharp edges\n\n<b>`Event::fake()` stops listeners from running.</b> That is what you want when asserting an event fired, and a trap the rest of the time: fake events and the listener that creates the audit row never runs, so the test that expects the row fails for a reason unrelated to the code. Use `Event::fake([InvoicePaid::class])` to fake one event and leave the others alone.\n\n<b>`Http::fake()` with no arguments returns an empty 200 for everything.</b> Which silently passes a request to a URL you did not intend, including a typo. Fake specific URLs and add `Http::preventStrayRequests()` so an unfaked call throws instead of quietly succeeding.\n\n<b>And every fake tests intent, not delivery.</b> `Mail::assertSent` proves your code asked to send. It says nothing about SMTP credentials, a bounced address or a spam filter. <b>Fakes prove your application is correct; they do not prove the email arrived.</b> That gap is real, and it belongs in a staging check rather than the suite.\n\nThe fakes also assert absence, which is the underused half:\n\n```php\nMail::assertNothingSent();\nHttp::assertNothingSent();\nQueue::assertNotPushed(ChargeCard::class);\n```\n\n<b>Not charging a card twice is a requirement</b>, and `assertNotPushed` is the only thing that tests it.",
      diagram: `The rule

    Ordinary tests do NOT call real external services.

  Not mainly for speed. Because:

    a test that sends real email eventually emails
    a customer

    a test that hits a real API fails during someone
    else's outage

    a test that writes to real S3 leaves files behind

  None of those failures are about your code.


The shape, always

    Mail::fake();                     ← swap the real thing
    ... run the code ...
    Mail::assertSent(WelcomeEmail::class);   ← assert the recording

    fake it → run → assert what it recorded


The fakes

    Mail::fake()          assertSent / assertNothingSent
    Queue::fake()         assertPushed / assertNotPushed
    Bus::fake()           assertDispatched / assertBatched
    Event::fake()         assertDispatched
    Notification::fake()  assertSentTo
    Storage::fake('s3')   disk()->assertExists
    Http::fake()          assertSent / preventStrayRequests

  Queue::fake() CHANGES what you test, on purpose:

    proves the job was DISPATCHED with the right payload
    the job's behaviour gets its own test → handle()

    two small tests, not one that fails for two reasons

  Http::fake() is the one that pays for itself:

    500 · timeout · 422 · malformed body
    impossible against the real API, trivial to fake
    — and exactly what breaks in production


Sharp edges

  ⚠️  Event::fake() STOPS LISTENERS RUNNING.

      Right when asserting an event fired. Wrong the
      rest of the time: the listener that writes the
      audit row never runs, and the test fails for a
      reason unrelated to the code.

        Event::fake([InvoicePaid::class])   ← fake one

  ⚠️  Http::fake() with no arguments returns an empty
      200 for EVERYTHING — including a URL you did not
      intend, including a typo.

        Http::preventStrayRequests()   ← unfaked = throw

  ⚠️  Fakes test INTENT, not DELIVERY.

      assertSent proves your code asked to send.
      It says nothing about SMTP credentials, a
      bounced address, or a spam filter.

      That gap belongs in a staging check.


The underused half — asserting absence

    Mail::assertNothingSent();
    Http::assertNothingSent();
    Queue::assertNotPushed(ChargeCard::class);

  Not charging a card twice is a REQUIREMENT, and
  assertNotPushed is the only thing that tests it.`,
      codeExample: {
        title: "Every fake, and the traps",
        code: `<?php
// ---------- Queue: dispatched, with the right payload ----------

it('queues the invoice email on send', function () {
    Queue::fake();

    $user    = User::factory()->create();
    $invoice = Invoice::factory()->for($user)->create(['status' => 'draft']);

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/send")
        ->assertOk();

    Queue::assertPushed(SendInvoiceEmail::class, fn ($job) =>
        $job->invoice->is($invoice)
    );
});

// The job's own behaviour is a separate, smaller test:
it('marks the invoice sent when the job runs', function () {
    $invoice = Invoice::factory()->create(['status' => 'draft']);

    (new SendInvoiceEmail($invoice))->handle();

    expect($invoice->fresh()->status)->toBe('sent');
});


<?php
// ---------- Mail and Notification ----------

it('mails the client', function () {
    Mail::fake();

    $invoice = Invoice::factory()->create();
    (new SendInvoiceEmail($invoice))->handle();

    Mail::assertSent(InvoiceMail::class, fn ($mail) =>
        $mail->hasTo($invoice->client->email)
    );
});

it('notifies the owner when payment lands', function () {
    Notification::fake();

    $invoice = Invoice::factory()->create();
    event(new InvoicePaid($invoice));

    Notification::assertSentTo($invoice->user, InvoicePaidNotification::class);
});


<?php
// ---------- Storage: a real in-memory disk ----------

it('stores the uploaded logo', function () {
    Storage::fake('public');

    $this->actingAs(User::factory()->create())
        ->postJson('/api/settings/logo', [
            'logo' => UploadedFile::fake()->image('logo.png', 200, 200),
        ])
        ->assertOk();

    expect(Storage::disk('public')->allFiles('logos'))->toHaveCount(1);
});


<?php
// ---------- Http: finally testable failure paths ----------

it('marks the invoice paid when the gateway succeeds', function () {
    Http::fake([
        'api.stripe.com/*' => Http::response(['status' => 'succeeded'], 200),
    ]);

    $invoice = Invoice::factory()->create();
    (new ChargeInvoice($invoice))->handle();

    expect($invoice->fresh()->status)->toBe('paid');
});

it('leaves the invoice unpaid when the gateway is down', function () {
    Http::fake(['api.stripe.com/*' => Http::response('', 500)]);

    $invoice = Invoice::factory()->create(['status' => 'sent']);
    (new ChargeInvoice($invoice))->handle();

    expect($invoice->fresh()->status)->toBe('sent');
});

it('handles a timeout', function () {
    Http::fake(fn () => throw new ConnectionException('timed out'));
    // ...
});

// 500, timeout, 422, malformed body — impossible against
// the real API, and exactly what breaks in production.


<?php
// ---------- Trap 1: Event::fake() silences listeners ----------

// ❌ The audit listener never runs, so this fails for a
//    reason that has nothing to do with the code
it('writes an audit row', function () {
    Event::fake();
    event(new InvoicePaid($invoice));
    $this->assertDatabaseHas('audit_logs', [...]);   // FAILS
});

// ✅ Fake only what you are asserting on
Event::fake([InvoicePaid::class]);


<?php
// ---------- Trap 2: a bare Http::fake() passes typos ----------

Http::fake();                      // empty 200 for EVERYTHING
Http::preventStrayRequests();      // unfaked call → throws

Http::fake([
    'api.stripe.com/*' => Http::response(['status' => 'succeeded']),
]);
Http::preventStrayRequests();


<?php
// ---------- Assert absence ----------

it('does not charge a card that is already paid', function () {
    Queue::fake();

    $invoice = Invoice::factory()->create(['status' => 'paid']);

    $this->actingAs($invoice->user)
        ->postJson("/api/invoices/{$invoice->id}/charge")
        ->assertUnprocessable();

    Queue::assertNotPushed(ChargeInvoice::class);
});

it('sends nothing when validation fails', function () {
    Mail::fake();

    $this->actingAs(User::factory()->create())
        ->postJson('/api/invoices', [])
        ->assertUnprocessable();

    Mail::assertNothingSent();
});`,
      },
      keyTakeaways: [
        "<b>Ordinary tests must not call real external services</b>, or they eventually email a customer or fail during an outage.",
        "<b>Every fake has the same shape</b>: fake it, run the code, assert on what it recorded.",
        "<b>`Queue::fake()` proves the job was dispatched with the right payload</b>, and the job gets its own test.",
        "<b>That split matters</b>: two small tests instead of one that fails for two different reasons.",
        "<b>`Storage::fake()` is a real in-memory disk</b>, so uploads work and you assert on the stored file.",
        "<b>`Http::fake()` makes failure paths testable</b>: 500, timeout, 422, malformed body.",
        "<b>`Event::fake()` stops listeners running</b>, so anything a listener does silently disappears.",
        "<b>Fake one event with `Event::fake([X::class])`</b> when other listeners still need to run.",
        "<b>A bare `Http::fake()` returns 200 for every URL</b>, so add `preventStrayRequests()`.",
        "<b>Fakes test intent, not delivery</b>: `assertSent` says nothing about SMTP, bounces or spam filters.",
        "<b>Assert absence too.</b> `assertNotPushed` is the only thing testing that you do not charge twice.",
      ],
      commonMistakes: [
        "<b>Letting a test hit a real API.</b> It fails during someone else's outage and passes for unrelated reasons.",
        "<b>Blanket `Event::fake()` in a test that depends on a listener.</b> The listener never runs.",
        "<b>Bare `Http::fake()` with no `preventStrayRequests()`.</b> A typo'd URL quietly returns 200.",
        "<b>Reading `assertSent` as proof the email arrived.</b> It proves your code asked to send it.",
        "<b>Only asserting things happened.</b> Not charging twice is a requirement and needs its own assertion.",
      ],
      quiz: [
        {
          question: "Why does `Queue::fake()` change what a test proves?",
          options: [
            "It makes jobs faster",
            "It proves the job was dispatched with the right payload; the job's behaviour gets its own test",
            "It runs jobs twice",
            "It disables the queue driver",
          ],
          correctIndex: 1,
          explanation: "Two small tests beat one failing for two different reasons.",
        },
        {
          question: "What is the trap with `Event::fake()`?",
          options: [
            "It is slow",
            "It stops listeners running, so anything a listener does silently disappears",
            "It only fakes queued events",
            "It requires a database",
          ],
          correctIndex: 1,
          explanation: "`Event::fake([X::class])` fakes one event and leaves the rest alone.",
        },
        {
          question: "Why add `Http::preventStrayRequests()`?",
          options: [
            "It speeds up tests",
            "A bare `Http::fake()` returns an empty 200 for every URL, including a typo",
            "It enables real requests",
            "It is required for `assertSent`",
          ],
          correctIndex: 1,
          explanation: "Unfaked calls should throw, not quietly succeed.",
        },
        {
          question: "What does `Mail::assertSent` actually prove?",
          options: [
            "The email arrived",
            "Your code asked to send it, which says nothing about SMTP, bounces or spam filters",
            "The mail driver works",
            "The template rendered in a browser",
          ],
          correctIndex: 1,
          explanation: "Fakes test intent, not delivery.",
        },
      ],
    },
    {
      id: "mocking-console-dusk-and-coverage",
      title: "Mocks, console, Dusk, coverage & the pyramid",
      durationMinutes: 13,
      explanation: "The rest of the toolbox, and the judgement about how much of it to use.\n\n---\n\n### 1. Basic — mock vs fake\n\n```text\nFake  a simplified working implementation\n      Storage, Mail, Http\n\nMock  a controlled dependency, where you check the interaction\n      called? how many times? with what arguments?\n```\n\nMocking replaces a dependency and lets you dictate its behaviour:\n\n```text\nOrderService → PaymentGateway\n\ncharge() must be called once, with $100, and returns success\n```\n\n<b>The distinction matters because they fail differently.</b> A fake fails when your code produces the wrong result. A mock fails when your code makes the wrong <b>calls</b>, which is the implementation-detail trap from lesson 2 wearing a different hat.\n\n<b>So do not mock everything.</b> Over-mocking produces a suite that passes while the application is broken, because you have replaced everything that could actually fail. When a fake exists, prefer the fake.\n\nA <b>partial mock</b> is the compromise: keep the real class, replace one method. Right when most of the behaviour is worth exercising but one part is expensive or external.\n\n---\n\n### 2. Intermediate — processes and console\n\nIf your application shells out, `Process::fake()` applies the same idea:\n\n```text\nProcess::run(...) → fake process → the result you specified\n```\n\nUseful for CLI tools, image processing, FFmpeg, Python scripts. <b>And the reason is not only speed:</b> the real command may not exist on CI, and its output differs by version and platform.\n\nArtisan commands are testable too:\n\n```php\n$this->artisan('reports:generate')\n    ->expectsOutput('Report generated.')\n    ->assertExitCode(0);\n\n$this->artisan('invoices:purge')\n    ->expectsConfirmation('Delete 12 invoices?', 'no')\n    ->assertExitCode(1);\n```\n\n<b>Commands are the most-forgotten code in a codebase.</b> They run at 3am with nobody watching, they often do destructive things, and they are the last thing anyone tests. That combination is why the exit code matters: a scheduled command failing silently with exit `0` is a broken pipeline nobody notices for a month.\n\n---\n\n### 3. Advanced — Dusk, coverage and the shape of a suite\n\n<b>Dusk</b> drives a real browser:\n\n```text\nreal browser → click → type → submit → the browser sees the result\n```\n\nUse it for what only a browser can prove: JavaScript, frontend integration, a critical end-to-end path. <b>Do not build your suite from it</b>, because browser tests are slow, need a driver, and are the flakiest thing you can own. A handful covering login and checkout is worth a great deal; two hundred is a suite nobody trusts.\n\n<b>Coverage</b> measures which lines ran, not whether they were checked:\n\n```text\n70% coverage ≠ the application is 70% correct\n```\n\n<b>You can have 100% line coverage with no assertions at all.</b> Every line executed, nothing verified. So chasing a number produces the tests that are easy to write, which are rarely the tests that catch bugs.\n\nBetter questions: <b>are the critical workflows tested? Authorization rules? Validation failures? Destructive operations? The important integrations? The edge cases?</b> A thoughtful 75% beats a decorative 95%.\n\n<b>Parallel testing</b> is how a large suite stays usable:\n\n```text\n1,000 tests → 10 minutes → split across workers → minutes\n```\n\nEach worker gets its own database, so it only works if your tests are genuinely isolated. <b>Parallel runs are an isolation test you did not write.</b>\n\nAnd the pyramid, adjusted for Laravel:\n\n```text\nfew    browser tests\nmany   feature tests\nmany   unit tests, where logic has branches\n```\n\n<b>Now the mindset.</b> Not \"I need tests for my controller\" but <b>\"what behaviour must never break?\"</b>\n\nA good feature test covers most of this in one pass:\n\n```text\nrequest → authentication → authorization → validation\n       → business logic → database → event/job → response\n```\n\nAnd the rule that matters more than any tool on this page: <b>test the happy path and the important failure paths.</b> A senior engineer does not prove \"a user can create a post\". They prove a user can create one, invalid data is rejected, guests are rejected, the wrong user is rejected, the database state is right, the side effects happened, and no external service was touched. <b>That is the difference between having tests and having a safety net.</b>",
      diagram: `Mock vs fake

  FAKE   a simplified working implementation
           Storage · Mail · Http
           fails when your code produces the WRONG RESULT

  MOCK   a controlled dependency, checking interaction
           called? how many times? with what arguments?
           fails when your code makes the WRONG CALLS

    OrderService → PaymentGateway
      charge() once, with $100, returns success

  ⚠️  A mock is the implementation-detail trap wearing
      a different hat. Over-mocking gives a suite that
      passes while the app is broken — you replaced
      everything that could fail.

      When a fake exists, prefer the fake.

  PARTIAL MOCK   real class + one method replaced
                 most behaviour worth exercising, one
                 part expensive or external


Processes and console

    Process::run(...) → fake process → your result

    Not only speed: the real command may not exist on
    CI, and its output differs by version and platform.

    $this->artisan('reports:generate')
        ->expectsOutput('Report generated.')
        ->assertExitCode(0);

    $this->artisan('invoices:purge')
        ->expectsConfirmation('Delete 12 invoices?', 'no')
        ->assertExitCode(1);

  ⚠️  Commands are the most-forgotten code you own.
      They run at 3am, unwatched, often destructively,
      and are tested last.

      A scheduled command failing silently with exit 0
      is a broken pipeline nobody notices for a month.


Dusk

    real browser → click → type → submit → sees result

    For what only a browser proves: JavaScript,
    frontend integration, one critical end-to-end path.

    Do NOT build the suite from it. Slow, needs a
    driver, flakiest thing you can own.

      a handful covering login and checkout  → valuable
      two hundred                            → nobody
                                                trusts it


Coverage

    70% coverage  ≠  the application is 70% correct

  You can have 100% LINE COVERAGE WITH NO ASSERTIONS.
  Every line ran; nothing was verified.

  Chasing the number produces the tests that are easy
  to write — rarely the ones that catch bugs.

  Better questions:
    critical workflows?    authorization rules?
    validation failures?   destructive operations?
    important integrations?  edge cases?

  A thoughtful 75% beats a decorative 95%.


Parallel

    1,000 tests → 10 min
         │
    ┌────┼────┐
    ▼    ▼    ▼
   w1   w2   w3      each with its OWN database

  Only works if tests are genuinely isolated — a
  parallel run is an isolation test you did not write.


The pyramid, Laravel-adjusted

           ▲
          / \\
         / Dusk \\        few
        /--------\\
       / Feature  \\      many
      /------------\\
     /    Unit      \\    many, where logic branches
    /----------------\\


The mindset

    not  "I need tests for my controller"
    but  "what behaviour must NEVER break?"

  One good feature test covers:

    request → authentication → authorization
      → validation → business logic → database
      → event/job → response

  The rule that outranks every tool here:

    TEST THE HAPPY PATH + THE IMPORTANT FAILURE PATHS

  A senior engineer does not prove "a user can create
  a post". They prove:

    a user can create one
      + invalid data is rejected
      + guests are rejected
      + the wrong user is rejected
      + database state is right
      + side effects happened
      + no external service was touched

  That is the difference between having tests and
  having a safety net.`,
      codeExample: {
        title: "Mocks, commands, Dusk and the full-stack test",
        code: `<?php
// ---------- Mock: when no fake exists ----------

it('charges the gateway once with the invoice total', function () {
    $this->mock(PaymentGateway::class, function ($mock) {
        $mock->shouldReceive('charge')
             ->once()
             ->with(3000, 'usd')
             ->andReturn(new ChargeResult(succeeded: true));
    });

    $invoice = Invoice::factory()->create(['total_cents' => 3000]);
    (new ChargeInvoice($invoice))->handle();

    expect($invoice->fresh()->status)->toBe('paid');
});

// Note the second assertion. Without it this only proves
// a method was called — the implementation-detail trap.


<?php
// ---------- Partial mock: real class, one method replaced ----------

$this->partialMock(InvoiceReport::class, function ($mock) {
    $mock->shouldReceive('renderPdf')->andReturn('fake-pdf-bytes');
});
// Every other method runs for real.


<?php
// ---------- Process ----------

it('converts the uploaded logo', function () {
    Process::fake([
        'convert *' => Process::result(output: 'done', exitCode: 0),
    ]);

    (new ConvertLogo('logo.png'))->handle();

    Process::assertRan(fn ($process) => str_contains($process->command, 'convert'));
});

// The real binary may not exist on CI, and its output
// differs by version and platform.


<?php
// ---------- Console commands ----------

it('reports how many invoices it marked overdue', function () {
    Invoice::factory()->count(3)->create([
        'due_on' => now()->subDay(),
        'status' => 'sent',
    ]);

    $this->artisan('invoices:mark-overdue')
        ->expectsOutput('Marked 3 invoices overdue.')
        ->assertExitCode(0);
});

it('exits non-zero when the purge is declined', function () {
    Invoice::factory()->count(12)->create(['status' => 'draft']);

    $this->artisan('invoices:purge')
        ->expectsConfirmation('Delete 12 invoices?', 'no')
        ->assertExitCode(1);

    $this->assertDatabaseCount('invoices', 12);
});

// Exit codes matter: a scheduled command failing
// silently with 0 is a pipeline nobody notices for
// a month.


<?php
// ---------- Dusk: reserved for what only a browser proves ----------

// tests/Browser/CreateInvoiceTest.php
$this->browse(function (Browser $browser) use ($user) {
    $browser->loginAs($user)
            ->visit('/invoices/create')
            ->type('reference', 'INV-100')
            ->click('@add-line-item')          // JavaScript
            ->type('lines[0][description]', 'Design work')
            ->press('Save')
            ->assertSee('INV-100');
});

// A handful of these. Not two hundred.


<?php
// ---------- What one good feature test covers ----------

it('creates an invoice, queues the email and touches nothing external', function () {
    Queue::fake();
    Http::fake();
    Http::preventStrayRequests();

    $user   = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'client_id' => $client->id,
            'due_on'    => '2026-10-01',
            'lines'     => [['description' => 'Design', 'quantity' => 2, 'unit_price' => 1500]],
        ])
        ->assertCreated()
        ->assertJsonPath('data.total_cents', 3000)
        ->assertJsonMissingPath('data.internal_notes');

    $this->assertDatabaseHas('invoices', ['user_id' => $user->id, 'total_cents' => 3000]);
    $this->assertDatabaseCount('invoice_lines', 1);

    Queue::assertPushed(SendInvoiceEmail::class);
    Http::assertNothingSent();
});

// request → auth → authorization → validation →
// business logic → database → job → response,
// in one test.


# ---------- Parallel ----------

php artisan test --parallel
php artisan test --parallel --recreate-databases

# Each worker gets its own database. It only works if
# your tests are isolated — a parallel run is an
# isolation test you did not write.

php artisan test --coverage --min=75
# A thoughtful 75% beats a decorative 95%.`,
      },
      keyTakeaways: [
        "<b>A fake is a working simplified implementation; a mock is a controlled dependency you assert calls on.</b>",
        "<b>They fail differently</b>: a fake fails on the wrong result, a mock on the wrong calls.",
        "<b>Over-mocking gives a suite that passes while the app is broken</b>, so prefer a fake when one exists.",
        "<b>A partial mock keeps the real class and replaces one method</b>, for one expensive or external part.",
        "<b>`Process::fake()` avoids depending on a binary</b> that may not exist on CI or may differ by version.",
        "<b>Artisan commands are testable</b> with `expectsOutput`, `expectsConfirmation` and `assertExitCode`.",
        "<b>Commands are the most-forgotten code you own</b>: unwatched, often destructive, tested last.",
        "<b>Dusk drives a real browser</b> and belongs on a handful of critical paths, never the whole suite.",
        "<b>Coverage measures lines executed, not behaviour verified</b>, and 100% with no assertions is possible.",
        "<b>Ask what is covered, not what percentage</b>: workflows, authorization, validation, destructive operations.",
        "<b>Parallel runs need genuine isolation</b>, so they double as an isolation test you never wrote.",
        "<b>Test the happy path and the important failure paths</b>, which is what turns tests into a safety net.",
      ],
      commonMistakes: [
        "<b>Mocking everything.</b> You replace all the code that could fail, so the suite proves nothing.",
        "<b>Asserting only that a mocked method was called.</b> That is an implementation test in disguise.",
        "<b>Never testing Artisan commands.</b> They run unwatched at 3am and often delete things.",
        "<b>Ignoring exit codes.</b> A scheduled command failing with exit `0` breaks a pipeline invisibly.",
        "<b>Building a suite out of Dusk tests.</b> Slow, flaky, and eventually nobody trusts a red run.",
        "<b>Chasing a coverage number.</b> It produces the easy tests, not the ones that catch bugs.",
      ],
      quiz: [
        {
          question: "Why prefer a fake over a mock when both are available?",
          options: [
            "Fakes are faster",
            "A mock asserts on calls, which is an implementation test, and over-mocking replaces everything that could fail",
            "Mocks do not work in Laravel",
            "Fakes give better coverage",
          ],
          correctIndex: 1,
          explanation: "A fake fails on the wrong result; a mock fails on the wrong calls.",
        },
        {
          question: "Why do Artisan command tests matter more than people assume?",
          options: [
            "They are quick to write",
            "Commands run unwatched, often do destructive things, and a silent exit `0` hides a broken pipeline",
            "They increase coverage",
            "They replace feature tests",
          ],
          correctIndex: 1,
          explanation: "The exit code is what a scheduler acts on.",
        },
        {
          question: "What does 100% line coverage guarantee?",
          options: [
            "The application is correct",
            "Nothing on its own, since every line can run with no assertions at all",
            "All branches are covered",
            "No bugs in production",
          ],
          correctIndex: 1,
          explanation: "Coverage measures execution, not verification.",
        },
        {
          question: "What extra thing does running tests in parallel reveal?",
          options: [
            "Slow queries",
            "Whether your tests are genuinely isolated, since each worker gets its own database",
            "Memory leaks",
            "Missing migrations",
          ],
          correctIndex: 1,
          explanation: "It is an isolation test you never wrote.",
        },
        {
          question: "What separates a test suite from a safety net?",
          options: [
            "The number of tests",
            "Covering the happy path and the important failure paths: invalid data, guests, wrong user, side effects",
            "Using Pest",
            "High coverage",
          ],
          correctIndex: 1,
          explanation: "\"A user can create a post\" alone proves very little.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why must the testing environment use its own database?",
      options: [
        "For speed",
        "`RefreshDatabase` wipes it between tests, so pointing it at development or production destroys data",
        "Laravel refuses to run otherwise",
        "To allow migrations",
      ],
      correctIndex: 1,
      explanation: "The isolation is not tidiness, it is data safety.",
    },
    {
      question: "What does in-memory SQLite fail to catch?",
      options: [
        "Missing routes",
        "MySQL-specific behaviour: JSON columns, strict mode, full-text indexes, date sorting",
        "Validation errors",
        "Authorization failures",
      ],
      correctIndex: 1,
      explanation: "Run the suite against the real engine somewhere, even if local runs use SQLite.",
    },
    {
      question: "Why are feature tests Laravel's primary tool rather than unit tests?",
      options: [
        "Unit tests are unsupported",
        "Booting the whole app in a test is nearly free here, so the usually-expensive thing is cheap",
        "They run faster",
        "They give better coverage numbers",
      ],
      correctIndex: 1,
      explanation: "`$this->postJson(...)` exercises the entire stack in one call.",
    },
    {
      question: "What is the problem with asserting that a controller called a service method?",
      options: [
        "It is too slow",
        "It fails on refactors that keep behaviour identical, punishing you for improving the code",
        "Mockery cannot do it",
        "Nothing",
      ],
      correctIndex: 1,
      explanation: "Assert behaviour, which survives refactors and fails only when something really breaks.",
    },
    {
      question: "What does the `Json` suffix on `postJson` change?",
      options: [
        "Only the request body encoding",
        "It sets `Accept: application/json`, turning a redirect into a `422` with JSON errors",
        "It skips middleware",
        "It speeds up the request",
      ],
      correctIndex: 1,
      explanation: "Without it you exercise the Blade redirect path instead.",
    },
    {
      question: "Why is `assertOk()` alone insufficient on a filtered endpoint?",
      options: [
        "`200` is wrong for filters",
        "An endpoint that ignores every filter still returns `200`",
        "Filters return `204`",
        "It is sufficient",
      ],
      correctIndex: 1,
      explanation: "Seed data that would fail if the filter were a no-op, then assert the result changed.",
    },
    {
      question: "What does `assertJsonStructure` prove that `assertJsonPath` does not?",
      options: [
        "The values are correct",
        "The shape of the response, which is the contract clients depend on",
        "The status code",
        "The database state",
      ],
      correctIndex: 1,
      explanation: "It catches an accidentally renamed field regardless of values.",
    },
    {
      question: "Why assert that a legitimate edge case passes validation?",
      options: [
        "For coverage",
        "Over-strict rules block real users and nothing fails until somebody complains",
        "Laravel requires it",
        "To test the database",
      ],
      correctIndex: 1,
      explanation: "The failure mode is silent, unlike a rule that is too loose.",
    },
    {
      question: "Why is `assertCreated()` not proof that a record was saved?",
      options: [
        "It is proof",
        "It proves the controller returned a status; a dropped fillable field or a rolled-back transaction still returns `201`",
        "`201` means queued",
        "It only checks headers",
      ],
      correctIndex: 1,
      explanation: "`assertDatabaseHas` is what proves persistence.",
    },
    {
      question: "Which assertion follows deleting a soft-deleting model?",
      options: [
        "`assertDatabaseMissing`",
        "`assertSoftDeleted`, because the row remains with `deleted_at` set",
        "`assertDatabaseCount(0)`",
        "`assertNoContent` only",
      ],
      correctIndex: 1,
      explanation: "`assertDatabaseMissing` fails on a delete that worked perfectly.",
    },
    {
      question: "What is the sign that a test's data contains noise?",
      options: [
        "It uses factories",
        "You can delete a row and the test still passes",
        "It creates more than three records",
        "It uses `count()`",
      ],
      correctIndex: 1,
      explanation: "Every row should exist because an assertion needs it.",
    },
    {
      question: "Why use `freezeTime()` when asserting an expiry timestamp?",
      options: [
        "It is faster",
        "Two `now()` calls either side of a second boundary make the test intermittently fail",
        "Carbon requires it",
        "It resets the database",
      ],
      correctIndex: 1,
      explanation: "A flaky test is worse than a missing one, because people learn to rerun until green.",
    },
    {
      question: "What does time travel not move?",
      options: [
        "`now()`",
        "The database's clock, so `CURRENT_TIMESTAMP` defaults keep the real time",
        "Carbon instances",
        "Queued jobs",
      ],
      correctIndex: 1,
      explanation: "A timestamp ignoring your travel was written by the database, not Eloquent.",
    },
    {
      question: "What does `Queue::fake()` let you separate?",
      options: [
        "Validation from authorization",
        "That the job was dispatched with the right payload, from what the job does when it runs",
        "The queue from the database",
        "Nothing useful",
      ],
      correctIndex: 1,
      explanation: "Two small tests instead of one failing for two different reasons.",
    },
    {
      question: "What is the danger of a blanket `Event::fake()`?",
      options: [
        "It is slow",
        "Listeners stop running, so anything a listener does silently disappears",
        "Events are dispatched twice",
        "It needs a queue worker",
      ],
      correctIndex: 1,
      explanation: "`Event::fake([X::class])` fakes one event and leaves the others alone.",
    },
    {
      question: "Why pair `Http::fake()` with `preventStrayRequests()`?",
      options: [
        "To allow real requests",
        "A bare `Http::fake()` returns an empty `200` for every URL, including a typo",
        "It is required for `assertSent`",
        "It speeds up tests",
      ],
      correctIndex: 1,
      explanation: "An unfaked call should throw rather than quietly succeed.",
    },
    {
      question: "What does `Mail::assertSent` actually prove?",
      options: [
        "The email was delivered",
        "Your code asked to send it, which says nothing about SMTP, bounces or spam filters",
        "The mailer is configured",
        "The template renders",
      ],
      correctIndex: 1,
      explanation: "Fakes test intent, not delivery.",
    },
    {
      question: "Why does over-mocking hurt a suite?",
      options: [
        "Mocks are slow",
        "You replace everything that could actually fail, so the tests pass while the app is broken",
        "Mockery is unsupported",
        "It reduces coverage",
      ],
      correctIndex: 1,
      explanation: "When a fake exists, prefer the fake.",
    },
    {
      question: "Why do Artisan command tests matter disproportionately?",
      options: [
        "They are easy to write",
        "Commands run unwatched, often destructively, and a silent exit `0` hides a broken pipeline",
        "They replace feature tests",
        "They boost coverage",
      ],
      correctIndex: 1,
      explanation: "The exit code is what the scheduler acts on.",
    },
    {
      question: "What does 100% line coverage guarantee on its own?",
      options: [
        "Correctness",
        "Nothing, since every line can execute with no assertions at all",
        "Full branch coverage",
        "No production bugs",
      ],
      correctIndex: 1,
      explanation: "Coverage measures execution, not verification.",
    },
    {
      question: "What does a parallel test run additionally reveal?",
      options: [
        "Slow queries",
        "Whether your tests are genuinely isolated, since each worker gets its own database",
        "Memory leaks",
        "Missing routes",
      ],
      correctIndex: 1,
      explanation: "It is an isolation test you never wrote.",
    },
    {
      question: "What turns a set of tests into a safety net?",
      options: [
        "Volume",
        "Covering the happy path plus the important failure paths: invalid data, guests, wrong user, side effects",
        "Using Pest",
        "A high coverage percentage",
      ],
      correctIndex: 1,
      explanation: "\"A user can create a post\" alone proves very little.",
    },
  ],
  project: {
    name: "InvoiceHub — the CRUD test that would catch a real bug",
    goal: "Write one feature test file covering the whole invoice lifecycle, then prove it works by breaking the application seven times and watching a different test go red each time.",
    brief:
      "You have twenty-eight days of InvoiceHub and no tests. Today you write the file that lets you refactor any of it without fear.\n\nThe self-check is a full CRUD flow including a failed validation case, and this project takes it one step further. <b>Writing a passing test proves nothing.</b> A test that passes when the code is correct and also passes when the code is broken is decoration. So the acceptance criteria here are not \"the tests pass\" but <b>\"each deliberate break turns exactly one test red\"</b>.\n\nThe endpoints:\n\n```text\nPOST   /api/invoices\nGET    /api/invoices\nGET    /api/invoices/{invoice}\nPUT    /api/invoices/{invoice}\nDELETE /api/invoices/{invoice}\n```\n\nAnd the flow one test file should prove:\n\n```text\n                    Invoice CRUD\n                         │\n        ┌────────────────┼────────────────┐\n        ▼                ▼                ▼\n     CREATE            READ             UPDATE\n   valid data         200 OK          new values\n        │                │                │\n        ▼                ▼                ▼\n    database         correct row      database updated\n\n     DELETE                INVALID CREATE\n        │                        │\n        ▼                        ▼\n  row gone / soft            422 + errors\n\n     WRONG USER              GUEST\n        │                      │\n        ▼                      ▼\n       403                    401\n```\n\nBy the end you are testing CRUD plus validation plus authentication plus authorization plus database state plus side effects, which is what makes a feature test worth its runtime.",
    steps: [
      "Set up. Confirm `phpunit.xml` points at a test database and not your development one, and that `CACHE_STORE`, `SESSION_DRIVER` and `MAIL_MAILER` are `array`. Add `RefreshDatabase` to every feature test in `tests/Pest.php`.",
      "Create `tests/Feature/InvoiceCrudTest.php` with a helper that creates an authenticated user and returns it, so every test starts from `actingAs` rather than the login form.",
      "CREATE. Post valid data, assert `assertCreated()`, then `assertDatabaseHas` for the row with the correct `user_id`. Both assertions, not just the status.",
      "VALIDATION. Post an empty payload and assert `assertUnprocessable()` plus `assertJsonValidationErrors` naming every field you expect. Then post a legitimate awkward value (a reference with a slash, an amount of zero if that is allowed) and assert it is accepted with `assertJsonMissingValidationErrors`.",
      "READ. Create three invoices for your user and two for another, then assert the index returns exactly three. Assert the show endpoint returns the right one and `assertJsonStructure` for the contract, plus `assertJsonMissingPath` for any internal field that must never leak.",
      "UPDATE. Put new values, assert success, then `assertDatabaseHas` with the new values and `assertDatabaseMissing` with the old reference. Proving the change landed is not the same as proving the response said so.",
      "DELETE. Assert the response, then `assertSoftDeleted` if the model soft-deletes or `assertDatabaseMissing` if it does not. Add `assertDatabaseCount` so a delete that removes two rows also fails.",
      "AUTHORIZATION. User B tries to show, update and delete User A's invoice and gets `403` each time, and the row is unchanged afterwards. Then a guest hits the index and gets `401`. Four short tests.",
      "SIDE EFFECTS. Add `Queue::fake()` to the create test and assert the invoice email job was pushed. Add `Http::fake()` and `Http::preventStrayRequests()` and assert `Http::assertNothingSent()` on the paths that should touch nothing external.",
      "TIME. Freeze time and assert the due date is exactly what you expect. Then travel past the due date, run your overdue command, and assert the status changed. Add the mirror test that travels only partway and asserts it did not.",
      "NOW BREAK IT, one change at a time, reverting each before the next. Comment out a validation rule. Delete the `authorize` call. Change `assertDatabaseHas`'s column in the controller so the field is never saved. Remove the model's `$fillable` entry for one field. Make the delete a no-op. Return a leaked internal field from the API Resource. Make the overdue command mark everything overdue regardless of date. Record which test went red for each.",
      "Write up the seven breaks in a comment block or a short note: the break, the test that caught it, and the failure message. Any break that turned nothing red is a missing test, so write it now.",
    ],
    acceptance: [
      "Every test uses `actingAs`, and the login flow is tested exactly once, in its own file.",
      "Every write assertion has two halves: the HTTP status and a database assertion.",
      "The validation test asserts both that invalid data is rejected and that a legitimate awkward value is accepted.",
      "Guests get `401` and non-owners get `403`, and the two are asserted separately, never interchangeably.",
      "The delete test uses `assertSoftDeleted` or `assertDatabaseMissing` correctly for the model, plus a count.",
      "No test touches a real external service, and `Http::preventStrayRequests()` is on.",
      "Time-dependent assertions are frozen or travelled, never compared against the live clock.",
      "All seven deliberate breaks turn at least one test red, and you can name which one for each.",
      "Deleting any factory row from a test causes a test to fail, proving no row is noise.",
      "The suite passes with `php artisan test --parallel`, proving the tests are genuinely isolated.",
    ],
    stretch: [
      "Run `php artisan test --coverage` and note the number. Then find one uncovered branch that matters, such as a destructive path or an authorization edge, and cover it. Note that the number barely moved and the suite got meaningfully better.",
      "Write a unit test for whatever calculates the invoice total, with at least six cases: zero lines, one line, rounding, a discount, tax, and a negative adjustment if you allow one. Time it against the same coverage through HTTP.",
      "Add one Dusk test for the create-invoice screen if it uses JavaScript to add line items. Time it, and compare against the feature test covering the same endpoint. That ratio is why the pyramid has a narrow top.",
      "Add `Process::fake()` coverage if InvoiceHub shells out for PDF generation, and assert the command that ran rather than the file that appeared.",
    ],
  },
};
