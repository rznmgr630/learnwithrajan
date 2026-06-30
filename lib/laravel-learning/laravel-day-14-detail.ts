import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_14_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Writing tests sounds like extra work, but it's actually the fastest way to move forward without fear.\n• A good test suite means you can change code confidently — if something breaks, you find out in seconds, not after a user reports a bug\n\n<b>What Laravel gives you</b>\n• <b>Pest</b> — a modern, readable testing framework built on top of PHPUnit\n  ↳ No class boilerplate — just `it('does something', fn() => ...)` functions\n• <b>HTTP helpers</b> — simulate requests like `$this->get('/users')` without a real browser\n• <b>Database helpers</b> — check that data was saved or deleted correctly\n• <b>Fake facades</b> — intercept emails, queued jobs, and events so tests stay fast and isolated",
      np: "Laravel testing first-class। Pest = PHPUnit माथि functional syntax। HTTP, DB, mail, queue assert।",
      jp: "Laravel はテストを標準サポート。Pest は PHPUnit 上のクリーンな構文。HTTP・DB・メール・キューのアサーションが簡単。",
    },
  ],
  sections: [
    {
      title: {
        en: "Pest setup & syntax",
        np: "Pest setup र syntax",
        jp: "Pest のセットアップと構文",
      },
      blocks: [
        {
          type: "diagram",
          id: "laravel-test-pyramid",
        },
        {
          type: "paragraph",
          text: {
            en: "PHPUnit is the traditional PHP testing framework — it works, but every test file requires a class, every method name starts with `test_`, and the assertion syntax can feel clunky.\n\n<b>Pest is the modern alternative</b>\n• It wraps PHPUnit under the hood — every PHPUnit assertion still works, nothing is lost\n• But the outer syntax is much cleaner:\n  ↳ No class required — just call `it()` or `test()` with a closure\n  ↳ `it('can create a post', fn() => ...)` reads like a plain English sentence\n  ↳ The `expect()` API chains naturally: `expect($user)->not->toBeNull()->name->toBe('Alice')`\n• Laravel 11 ships with Pest pre-installed — zero extra setup needed",
            np: "Pest Laravel 11 मा pre-installed। PHPUnit को wrapper। Class boilerplate छैन।",
            jp: "Pest は Laravel 11 にプリインストール。PHPUnit のラッパーなのでアサーションはすべて使える。クラス不要で `it()` / `test()` だけ。",
          },
        },
        {
          type: "code",
          title: { en: "Install Pest in Laravel 10", np: "Laravel 10 मा install", jp: "Laravel 10 でのインストール" },
          code: `composer require pestphp/pest --dev --with-all-dependencies
composer require pestphp/pest-plugin-laravel --dev

# Initialize Pest (creates Pest.php, updates phpunit.xml)
php artisan pest:install

# Generate test files
php artisan make:test PostTest --pest           # Feature test (in tests/Feature/)
php artisan make:test PostUnitTest --pest --unit # Unit test (in tests/Unit/)`,
        },
        {
          type: "code",
          title: { en: "Pest test anatomy", np: "Pest test structure", jp: "Pest テストの構造" },
          code: `<?php
// tests/Feature/PostTest.php

use App\\Models\\{Post, User};

// beforeEach runs before every test in this file
beforeEach(function () {
    $this->user = User::factory()->create();
});

// 'it' reads as a sentence: "it can create a post"
it('can create a post', function () {
    $response = $this->actingAs($this->user)
        ->post('/posts', [
            'title' => 'Hello World',
            'body'  => 'My first post.',
        ]);

    $response->assertRedirect('/posts');
    expect(Post::count())->toBe(1);
});

// 'test' is an alias
test('guests cannot create posts', function () {
    $response = $this->post('/posts', ['title' => 'Hack']);
    $response->assertRedirect('/login');
});

// Datasets — run the same test with multiple inputs
it('validates post title length', function (string $title) {
    $this->actingAs($this->user)
         ->post('/posts', ['title' => $title, 'body' => 'x'])
         ->assertSessionHasErrors('title');
})->with([
    'empty string'    => [''],
    'too long'        => [str_repeat('a', 256)],
]);`,
        },
        {
          type: "code",
          title: { en: "Pest expectations cheat-sheet", np: "Expectations", jp: "Expectations チートシート" },
          code: `// Pest's expect() wraps PHPUnit assertions in a fluent API

expect($value)
    ->toBe(42)                  // strict equality (===)
    ->toEqual(['a' => 1])       // loose equality (==)
    ->toBeNull()                // === null
    ->not->toBeNull()           // negation
    ->toBeTrue()                // === true
    ->toBeFalse()               // === false
    ->toBeString()
    ->toBeInt()
    ->toBeArray()
    ->toBeInstanceOf(User::class)
    ->toContain('needle')       // string or array contains
    ->toHaveCount(3)            // array/collection count
    ->toHaveKey('id')           // array has key
    ->toHaveKeys(['id', 'name'])
    ->toMatchArray(['name' => 'Alice'])  // subset match
    ->toThrow(\\Exception::class)
    ->toThrow(\\Exception::class, 'message')
    ->toBeGreaterThan(0)
    ->toBeLessThanOrEqual(100);

// Multiple assertions chained
expect(User::find(1))
    ->not->toBeNull()
    ->name->toBe('Alice')
    ->email->toContain('@');`,
        },
      ],
    },
    {
      title: {
        en: "HTTP feature tests",
        np: "HTTP feature test",
        jp: "HTTP フィーチャーテスト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A feature test simulates a real HTTP request through your entire application — the route resolves, middleware runs, the controller executes, and the database is hit.\n• You don't need a running server or a browser — Laravel handles the full request/response cycle in memory\n  ↳ `$this->get('/posts')` fires a GET request and returns a response object you can assert against\n  ↳ `$this->actingAs($user)->post('/posts', [...])` simulates a logged-in user submitting a form\n• These tests are the most valuable kind — they test your app the same way a real user would interact with it",
            np: "Feature test = full stack। Real server चाहिँदैन। Response assert methods।",
            jp: "フィーチャーテストはルーティングから DB まで全スタックを通す。実サーバーは不要。",
          },
        },
        {
          type: "code",
          title: { en: "Full HTTP test example with actingAs", np: "HTTP test + actingAs", jp: "actingAs を使った HTTP テスト" },
          code: `<?php
// tests/Feature/PostControllerTest.php

use App\\Models\\{Post, User};
use Illuminate\\Http\\UploadedFile;
use Illuminate\\Support\\Facades\\Storage;

uses(\\Illuminate\\Foundation\\Testing\\RefreshDatabase::class);

it('shows a paginated list of posts', function () {
    Post::factory()->count(20)->create();

    $response = $this->get('/posts');

    $response
        ->assertStatus(200)    // same as assertOk()
        ->assertSee('Posts')
        ->assertViewIs('posts.index')
        ->assertViewHas('posts');
});

it('authenticated user can create a post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/posts', [
        'title' => 'Test Post',
        'body'  => 'Some body content here.',
    ]);

    $response->assertRedirect(route('posts.index'));
    $this->assertDatabaseHas('posts', [
        'title'   => 'Test Post',
        'user_id' => $user->id,
    ]);
});

it('returns 401 for unauthenticated API request', function () {
    $this->getJson('/api/posts')->assertUnauthorized(); // 401
});

it('returns JSON post list from API', function () {
    $user  = User::factory()->create();
    $posts = Post::factory()->count(3)->for($user)->create();

    $this->actingAs($user, 'sanctum')
         ->getJson('/api/posts')
         ->assertOk()
         ->assertJsonCount(3, 'data')
         ->assertJsonStructure([
             'data' => [['id', 'title', 'body', 'author']],
             'links',
             'meta',
         ]);
});

it('validates post creation fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->post('/posts', [])              // empty payload
         ->assertSessionHasErrors(['title', 'body']);
});

it('redirects guests to login', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});`,
        },
        {
          type: "table",
          caption: {
            en: "Common response assertion methods",
            np: "Response assertions",
            jp: "主要レスポンスアサーション",
          },
          headers: [
            { en: "Method", np: "Method", jp: "メソッド" },
            { en: "What it checks", np: "के check गर्छ", jp: "確認内容" },
          ],
          rows: [
            [
              { en: "`assertStatus(200)`", np: "`assertStatus(200)`", jp: "`assertStatus(200)`" },
              { en: "HTTP status code", np: "Status code", jp: "HTTP ステータスコード" },
            ],
            [
              { en: "`assertOk()` / `assertNotFound()`", np: "`assertOk()`", jp: "`assertOk()`" },
              { en: "200 / 404 shorthand", np: "Shorthand", jp: "200 / 404 の省略形" },
            ],
            [
              { en: "`assertJson(['key' => 'val'])`", np: "`assertJson()`", jp: "`assertJson()`" },
              { en: "JSON contains subset", np: "JSON subset", jp: "JSON のサブセット一致" },
            ],
            [
              { en: "`assertJsonCount(3, 'data')`", np: "`assertJsonCount()`", jp: "`assertJsonCount()`" },
              { en: "Array length at JSON path", np: "Array length", jp: "JSON パスの配列長" },
            ],
            [
              { en: "`assertSee('text')`", np: "`assertSee()`", jp: "`assertSee()`" },
              { en: "Text appears in response body", np: "Text present", jp: "レスポンスボディにテキスト存在" },
            ],
            [
              { en: "`assertRedirect('/login')`", np: "`assertRedirect()`", jp: "`assertRedirect()`" },
              { en: "Location header matches", np: "Redirect", jp: "リダイレクト先の一致" },
            ],
            [
              { en: "`assertSessionHasErrors('field')`", np: "`assertSessionHasErrors()`", jp: "`assertSessionHasErrors()`" },
              { en: "Validation error in session", np: "Validation error", jp: "セッションにバリデーションエラー" },
            ],
            [
              { en: "`assertUnauthorized()` / `assertForbidden()`", np: "401 / 403", jp: "401 / 403" },
              { en: "401 / 403 responses", np: "401 / 403", jp: "401 / 403 レスポンス" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Database testing",
        np: "Database testing",
        jp: "データベーステスト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Tests that touch the database need a clean slate before each test — otherwise results from one test bleed into the next.\n\n<b>`RefreshDatabase`</b> handles this automatically:\n• Before the first test runs, it migrates the database from scratch\n• Before each subsequent test, it wraps everything in a transaction — then rolls it back after\n  ↳ Every test starts with a completely empty database\n\n<b>Factories</b> are how you create test data without hand-writing SQL `INSERT` statements:\n• `User::factory()->create()` — creates a real database row with realistic fake data\n• `User::factory()->count(10)->create()` — create 10 rows at once\n• `User::factory()->admin()->create()` — use a custom state defined in the factory class",
            np: "`RefreshDatabase` — clean DB। Factory ले test data बनाउँछ।",
            jp: "`RefreshDatabase` でテストごとに DB をクリーン。Factory でリアルなテストデータを生成。",
          },
        },
        {
          type: "code",
          title: { en: "RefreshDatabase + assertDatabaseHas", np: "DB assert", jp: "DB アサーション" },
          code: `<?php
// tests/Feature/UserRegistrationTest.php

use App\\Models\\User;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;

uses(RefreshDatabase::class);

it('registers a new user', function () {
    $response = $this->post('/register', [
        'name'                  => 'Alice',
        'email'                 => 'alice@example.com',
        'password'              => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect('/dashboard');

    // Assert a row exists with exact column values
    $this->assertDatabaseHas('users', [
        'name'  => 'Alice',
        'email' => 'alice@example.com',
    ]);

    // Assert user count
    $this->assertDatabaseCount('users', 1);
});

it('does not store plain-text password', function () {
    $this->post('/register', [
        'name'                  => 'Bob',
        'email'                 => 'bob@example.com',
        'password'              => 'secret123',
        'password_confirmation' => 'secret123',
    ]);

    // Row should NOT have this value
    $this->assertDatabaseMissing('users', [
        'email'    => 'bob@example.com',
        'password' => 'secret123',
    ]);
});`,
        },
        {
          type: "code",
          title: { en: "Factories — creating test data", np: "Factory", jp: "Factory でテストデータ生成" },
          code: `// Basic factory usage
$user    = User::factory()->create();         // persisted
$user    = User::factory()->make();           // in memory only
$users   = User::factory()->count(10)->create();

// States defined in the factory class
$admin   = User::factory()->admin()->create();
$unverified = User::factory()->unverified()->create();

// With relationships
$post = Post::factory()
    ->for(User::factory()->create())    // belongsTo
    ->has(Comment::factory()->count(3)) // hasMany
    ->create();

// Inline attribute override
$post = Post::factory()->create([
    'title'     => 'Custom Title',
    'published' => true,
]);

// UserFactory example
// database/factories/UserFactory.php
public function definition(): array
{
    return [
        'name'              => fake()->name(),
        'email'             => fake()->unique()->safeEmail(),
        'password'          => Hash::make('password'),
        'email_verified_at' => now(),
    ];
}

public function admin(): static
{
    return $this->state(['role' => 'admin']);
}

public function unverified(): static
{
    return $this->state(['email_verified_at' => null]);
}`,
        },
      ],
    },
    {
      title: {
        en: "Faking external services",
        np: "External service fake",
        jp: "外部サービスのフェイク",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Testing code that calls external services (email, queues, events) is tricky — you don't want real emails sent or real jobs running during tests.\n\n<b>Laravel's fake facades solve this</b>\n• Call `Mail::fake()`, `Queue::fake()`, or `Event::fake()` at the start of a test\n  ↳ From that point on, nothing is actually sent or dispatched — Laravel just records what would have happened\n• After running the code under test, use assertion methods to verify the right things were triggered:\n  ↳ `Mail::assertSent(WelcomeMail::class)` — was this email triggered?\n  ↳ `Queue::assertPushed(SendWelcomeEmail::class)` — was this job queued?\n  ↳ `Event::assertDispatched(OrderShipped::class)` — was this event fired?\n• Tests stay fast (no network calls) and reliable (no flaky external dependencies)",
            np: "Fake facade ले real implementation replace। Assert ले check। Real service hit हुँदैन।",
            jp: "フェイクファサードは実装をスタブに差し替え。実際には何も送らずアサーションのみ。高速・決定的。",
          },
        },
        {
          type: "code",
          title: { en: "Mail::fake() — email assertions", np: "Mail fake", jp: "Mail::fake()" },
          code: `<?php
use App\\Mail\\WelcomeMail;
use Illuminate\\Support\\Facades\\Mail;

it('sends a welcome email after registration', function () {
    Mail::fake();

    $this->post('/register', [
        'name'                  => 'Carol',
        'email'                 => 'carol@example.com',
        'password'              => 'password',
        'password_confirmation' => 'password',
    ]);

    // Assert a specific mailable was sent to an address
    Mail::assertSent(WelcomeMail::class, function (WelcomeMail $mail) {
        return $mail->hasTo('carol@example.com');
    });

    // Assert exactly one email was sent
    Mail::assertSent(WelcomeMail::class, 1);

    // Assert nothing else was sent
    Mail::assertNothingQueued();
});`,
        },
        {
          type: "code",
          title: { en: "Queue::fake() — job assertions", np: "Queue fake", jp: "Queue::fake()" },
          code: `<?php
use App\\Jobs\\SendWelcomeEmail;
use App\\Jobs\\GenerateThumbnail;
use Illuminate\\Support\\Facades\\Queue;

it('dispatches a welcome email job on registration', function () {
    Queue::fake();

    $user = User::factory()->create();
    $this->actingAs($user)->post('/posts', ['title' => 'Hi', 'body' => 'World']);

    Queue::assertPushed(GenerateThumbnail::class);

    Queue::assertPushedOn('emails', SendWelcomeEmail::class);

    Queue::assertPushed(SendWelcomeEmail::class, function ($job) use ($user) {
        return $job->user->id === $user->id;
    });

    // Opposite — nothing of this type was dispatched
    Queue::assertNotPushed(SomeOtherJob::class);
});`,
        },
        {
          type: "code",
          title: { en: "Event::fake() — event & notification assertions", np: "Event fake", jp: "Event::fake()" },
          code: `<?php
use App\\Events\\OrderShipped;
use App\\Notifications\\OrderShippedNotification;
use Illuminate\\Support\\Facades\\{Event, Notification};

it('fires OrderShipped event when order is shipped', function () {
    Event::fake();

    $order = Order::factory()->create();
    $order->ship();

    Event::assertDispatched(OrderShipped::class, function ($event) use ($order) {
        return $event->order->id === $order->id;
    });

    Event::assertDispatchedTimes(OrderShipped::class, 1);
    Event::assertNotDispatched(SomeOtherEvent::class);
});

it('notifies user when order ships', function () {
    Notification::fake();

    $user  = User::factory()->create();
    $order = Order::factory()->for($user)->create();
    $order->ship();

    Notification::assertSentTo($user, OrderShippedNotification::class);
    Notification::assertSentToTimes($user, OrderShippedNotification::class, 1);
});`,
        },
        {
          type: "code",
          title: { en: "Storage::fake() + Http::fake() + artisan command tests", np: "Other fakes", jp: "その他のフェイク" },
          code: `<?php
use Illuminate\\Http\\UploadedFile;
use Illuminate\\Support\\Facades\\{Http, Storage};

// Storage::fake — test file uploads without touching disk
it('stores an uploaded avatar', function () {
    Storage::fake('avatars');

    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

    $this->actingAs($user)
         ->post('/profile/avatar', ['avatar' => $file])
         ->assertOk();

    Storage::disk('avatars')->assertExists("avatars/{$user->id}.jpg");
});

// Http::fake — fake outbound HTTP calls
it('syncs data from external API', function () {
    Http::fake([
        'api.example.com/items' => Http::response([
            ['id' => 1, 'name' => 'Widget'],
            ['id' => 2, 'name' => 'Gadget'],
        ], 200),
        '*' => Http::response([], 500), // catch-all fallback
    ]);

    $this->artisan('app:sync-items')->assertSuccessful();
    $this->assertDatabaseCount('items', 2);
});

// Artisan command tests
it('runs the weekly report command', function () {
    $this->artisan('reports:weekly')
         ->expectsOutput('Report generated.')
         ->assertExitCode(0);   // or assertSuccessful()
});`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use Pest or PHPUnit?",
        np: "Pest वा PHPUnit?",
        jp: "Pest と PHPUnit どちらを使うべき？",
      },
      answer: {
        en: "<b>Pest</b> is the recommended default for all new Laravel projects — here's why:\n• Less boilerplate: no class, no `setUp()`, no `public function test_...` naming convention\n  ↳ A Pest test is just an `it()` call with a closure — much easier to read and write\n• Better assertions: `expect($value)->toBe(42)` reads more like English than `$this->assertEquals(42, $value)`\n• Extras built in: datasets (`it()->with([...])`), architecture tests (`arch()`), and parallel test execution\n• No feature loss: it compiles to PHPUnit under the hood — every PHPUnit assertion works inside Pest\n\nThe only reason to stick with PHPUnit is if you have an existing test suite you're not ready to migrate yet.",
        np: "New project मा Pest। PHPUnit wrapper, feature loss छैन। Old project छ भने PHPUnit ठीक।",
        jp: "新規プロジェクトは Pest が推奨。PHPUnit のラッパーなので機能差なし。既存スイートがある場合は PHPUnit をそのまま使ってよい。",
      },
    },
    {
      question: {
        en: "What does `RefreshDatabase` do to performance?",
        np: "`RefreshDatabase` performance मा असर?",
        jp: "`RefreshDatabase` はパフォーマンスにどう影響しますか？",
      },
      answer: {
        en: "`RefreshDatabase` is the most common approach and works like this:\n• <b>First test in the suite</b>: runs all your migrations from scratch against the test database\n• <b>Every subsequent test</b>: wraps the test in a database transaction, then rolls it back after\n  ↳ Each test starts clean without re-running migrations — so it's fast after the first one\n\n<b>Speed tips</b>\n• Use an in-memory SQLite database for tests: set `DB_CONNECTION=sqlite` and `DB_DATABASE=:memory:` in `phpunit.xml`\n  ↳ SQLite migrations run almost instantly — great for local development\n• For very large migration suites, `LazilyRefreshDatabase` only migrates when a test actually needs the database",
        np: "First test मा migrate एकपटक, बाकी transaction rollback। SQLite in-memory सबभन्दा fast।",
        jp: "最初の 1 回だけマイグレーション実行、以降はトランザクションロールバック。SQLite インメモリが最速。",
      },
    },
    {
      question: {
        en: "How do I test validation errors?",
        np: "Validation error test कसरी?",
        jp: "バリデーションエラーをテストする方法は？",
      },
      answer: {
        en: "It depends on whether the route returns HTML or JSON:\n\n<b>Web (Blade) routes</b> — validation errors are flashed to the session and the user is redirected back:\n• `->assertSessionHasErrors('title')` — one field failed\n• `->assertSessionHasErrors(['title', 'body'])` — multiple fields failed\n\n<b>API (JSON) routes</b> — Laravel returns a 422 response with an errors object:\n• `->assertUnprocessable()` — confirms a 422 status code\n• `->assertJsonValidationErrors('email')` — confirms the field appears in the errors list\n• `->assertJsonValidationErrors(['email' => 'The email field is required.'])` — checks the exact message",
        np: "Web: `assertSessionHasErrors()`। API: `assertJsonValidationErrors()`। 422 = `assertUnprocessable()`।",
        jp: "Web は `assertSessionHasErrors()`、API は `assertJsonValidationErrors()` と `assertUnprocessable()`（422）。",
      },
    },
    {
      question: {
        en: "How do I assert a notification was sent?",
        np: "Notification send भयो कि भएन assert?",
        jp: "通知が送信されたことをアサートする方法は？",
      },
      answer: {
        en: "Call `Notification::fake()` at the start of your test — after that, no notifications actually go out.\n\nThen, after running the action that should trigger the notification:\n• `Notification::assertSentTo($user, MyNotification::class)` — was this notification sent to this user?\n• Pass a callback as a third argument to check the notification's data:\n  ↳ `Notification::assertSentTo($user, MyNotification::class, fn($n) => $n->order->id === 5)`\n• `Notification::assertNothingSent()` — confirms nothing was sent at all\n\nThis works regardless of which channel the notification uses — email, Slack, SMS, database — because `Notification::fake()` intercepts all of them.",
        np: "`Notification::fake()` → assert। `assertSentTo()` user र class दिनु।",
        jp: "`Notification::fake()` 後に `assertSentTo($user, MyNotification::class)`。チャンネル問わず動作。",
      },
    },
    {
      question: {
        en: "Can I test middleware in isolation?",
        np: "Middleware isolation मा test?",
        jp: "ミドルウェアを独立してテストできますか？",
      },
      answer: {
        en: "Yes, though the most practical approach is to test middleware <b>indirectly through feature tests</b>:\n• `$this->get('/dashboard')->assertRedirect('/login')` — confirms the auth middleware is working\n  ↳ You don't need to instantiate the middleware class itself — the full stack proves it\n\nFor direct unit testing of a middleware class:\n• Instantiate it, pass a `Request` object and a `$next` closure, and assert the response\n  ↳ Useful when middleware has complex internal logic that's hard to test via HTTP\n\nTo isolate a controller by skipping middleware in a test, call `$this->withoutMiddleware()` at the top — it disables all middleware for that test only.",
        np: "Feature test मा indirect test सजिलो। Direct unit test को लागि Request र Closure pass।",
        jp: "HTTPテストで間接的にテストが一般的。直接 `new Middleware()` して Request と Closure を渡す方法もある。",
      },
    },
    {
      question: {
        en: "How do I test exception handling?",
        np: "Exception handling test?",
        jp: "例外処理をテストする方法は？",
      },
      answer: {
        en: "For <b>HTTP responses</b>, assert the status code — that's usually all you need:\n• `->assertNotFound()` — 404 (e.g. when a model isn't found)\n• `->assertForbidden()` — 403 (e.g. when authorization fails)\n• `->assertStatus(500)` — any specific code\n\nFor <b>non-HTTP code</b> that throws an exception, use Pest's `expect()` wrapper:\n• `expect(fn() => $thing->doSomething())->toThrow(ModelNotFoundException::class)`\n\n<b>Debugging tip</b>: by default, Laravel's exception handler catches exceptions and converts them to HTTP responses (like a 500 page). If you want to see the raw exception instead of a response, call `$this->withoutExceptionHandling()` at the top of your test.",
        np: "HTTP: status code assert। Raw exception: `toThrow()`। `withoutExceptionHandling()` debug को लागि।",
        jp: "HTTP は `assertNotFound()` など。例外を直接テストは `toThrow()`。`withoutExceptionHandling()` で生の例外を確認。",
      },
    },
    {
      question: {
        en: "How do I test that a queued mailable was queued (not sent immediately)?",
        np: "Queued mailable test कसरी?",
        jp: "キューに入れられたメールをテストする方法は？",
      },
      answer: {
        en: "There are two different assertion methods and they check different things:\n\n• `Mail::assertSent()` — checks for mail that was sent <b>immediately</b> (synchronous, no queue)\n• `Mail::assertQueued()` — checks for mail that was <b>pushed onto the queue</b> (the mailable implements `ShouldQueue`)\n\nIf your mailable implements `ShouldQueue` and you use `assertSent()`, the assertion will fail even if the code is working — because the mail was queued, not sent directly.\n\nUse `assertQueued()` for any mailable with `ShouldQueue`. After calling `Mail::fake()`, both kinds are intercepted — no real email goes out either way.",
        np: "`Mail::assertQueued()` — `assertSent()` होइन। `ShouldQueue` implement भएको mailable को लागि।",
        jp: "`ShouldQueue` を実装したメールは `assertQueued()` でチェック。`assertSent()` は同期送信のみ。",
      },
    },
  ],
};
