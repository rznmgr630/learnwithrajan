import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_27_LESSONS: LessonDay = {
  day: 27,
  title: "Events, listeners, scheduling, mail & notifications",
  totalMinutes: 91,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "events-and-listeners",
      title: "Events, listeners & the difference from commands",
      durationMinutes: 11,
      explanation: "Yesterday moved slow work off the request. Today is about <b>decoupling actions from their side effects</b>, which is a different problem with a different answer.\n\n---\n\n### 1. Basic — the method that keeps growing\n\nA user registers. What has to happen?\n\n```php\nregisterUser();\nsendWelcomeEmail();\ncreateProfile();\ntrackAnalytics();\nsendSlackNotification();\nsubscribeToNewsletter();\n```\n\nEvery new requirement is another line in one method, and that method now knows about email, analytics, Slack and a newsletter. <b>Registration has become the place where everything about a new user lives</b>, and nobody can change any of it safely.\n\nEvents invert it:\n\n```text\nregisterUser()\n      ↓\nUserRegistered\n      ↓\n ┌────┼─────────┐\n ▼    ▼         ▼\nEmail Profile Analytics\n```\n\n<b>Registration announces what happened, and does not know who is listening.</b> Adding a sixth consequence means adding a listener and touching nothing else.\n\n---\n\n### 2. Intermediate — an event is not a command\n\nThis distinction decides whether events help you or confuse you:\n\n```text\nProcessPodcast       a command   →  \"do this\"\nPodcastProcessed     an event    →  \"this happened\"\n```\n\nA command names an action and has exactly one handler. <b>An event names a fact, in the past tense, and can have any number of listeners including none.</b>\n\nWhich means an event should not describe what should happen next:\n\n```text\n✓ UserRegistered           a fact\n✗ SendWelcomeEmailEvent    a command wearing an event's name\n```\n\nThe second one has already decided the consequence, so it gains nothing over calling the method directly.\n\nThe past tense is a genuinely useful test. If you cannot name it in the past tense, you have a command:\n\n```text\nOrderPlaced · PaymentCompleted · InvoicePaid\nSubscriptionCancelled · PodcastProcessed\n```\n\n---\n\n### 3. Advanced — when events are worth it\n\nThey are not free, and it is worth being honest about the cost.\n\n<b>An event makes the consequences invisible from the call site.</b> Somebody reading `registerUser()` sees an event dispatched and has no idea that six things happen. That is exactly the decoupling you wanted, and exactly what makes debugging harder.\n\nSo the judgement:\n\n```text\nWorth an event                   Not worth an event\n──────────────                   ──────────────────\nseveral unrelated consequences   one consequence\nconsequences added over time     the consequence is the point\ndifferent parts of the app       the caller needs the result\n  care about the same fact\nthe caller should not know\n```\n\n<b>One consequence, called directly, is clearer than an event with one listener.</b> The event costs a file, a class and an indirection, and buys nothing until there is a second listener.\n\nAnd the one that matters most: <b>if the caller needs the result, it is not an event.</b> An event is fire-and-forget by design; a listener's return value goes nowhere. Something you need an answer from is a method call.\n\nOne more thing worth knowing now, because it shapes everything after: <b>listeners run synchronously by default.</b> Dispatching `UserRegistered` with three listeners runs all three before the next line, in the request. Making them asynchronous is the next lesson, and until then an event is a decoupling tool, not a speed one.",
      diagram: `The method that keeps growing

    registerUser();
    sendWelcomeEmail();
    createProfile();
    trackAnalytics();
    sendSlackNotification();
    subscribeToNewsletter();

  Every new requirement is another line, and registration
  now knows about email, analytics, Slack and a newsletter.
  It has become the place where everything about a new
  user lives, and nobody can change any of it safely.


  Events invert it:

    registerUser()
          ↓
    UserRegistered
          ↓
     ┌────┼─────────┐
     ▼    ▼         ▼
    Email Profile Analytics

  Registration announces what HAPPENED and does not know
  who is listening. A sixth consequence is a new listener
  and nothing else touched.


An event is not a command

    ProcessPodcast     a command  →  "do this"
    PodcastProcessed   an event   →  "this happened"

  A command names an ACTION and has exactly one handler.
  An event names a FACT, in the past tense, and can have
  any number of listeners — including none.

    ✓ UserRegistered          a fact
    ✗ SendWelcomeEmailEvent   a command in an event's name

  The second has already decided the consequence, so it
  gains nothing over calling the method.

  The past tense is a real test:

    OrderPlaced · PaymentCompleted · InvoicePaid
    SubscriptionCancelled · PodcastProcessed


When events are worth it

  ⚠️  An event makes the consequences INVISIBLE from the
      call site. Somebody reading registerUser() sees a
      dispatch and has no idea six things happen.

      That is the decoupling you wanted, and what makes
      debugging harder.

  Worth an event                  Not worth an event
  ──────────────                  ──────────────────
  several unrelated               one consequence
    consequences                  the consequence IS
  consequences added over time      the point
  different parts of the app      the caller needs
    care about the same fact        the result
  the caller should not know

  One consequence, called directly, is clearer than an
  event with one listener. The event costs a file, a
  class and an indirection, and buys nothing until
  there is a second listener.

  And: if the caller needs the RESULT, it is not an
  event. An event is fire-and-forget; a listener's
  return value goes nowhere.


  ⚠️  Listeners run SYNCHRONOUSLY by default.
      Three listeners run before the next line, in the
      request. Making them async is the next lesson.

      Until then, an event is a decoupling tool,
      not a speed one.`,
      codeExample: {
        title: "An event, and the listeners that react to it",
        code: `<?php
// ---------- The method that kept growing ----------

public function register(Request $request)
{
    $user = User::create($request->validated());

    // Registration now knows about all of this.
    Mail::to($user)->send(new WelcomeEmail($user));
    $user->profile()->create(['bio' => '']);
    Analytics::track('registered', $user->id);
    Slack::notify("New user: {$user->email}");
    Newsletter::subscribe($user->email);

    return redirect('/dashboard');
}


<?php
// ---------- With an event ----------

// php artisan make:event UserRegistered

namespace App\\Events;

use App\\Models\\User;
use Illuminate\\Foundation\\Events\\Dispatchable;

class UserRegistered
{
    use Dispatchable;

    public function __construct(public User $user) {}
}

// A fact, in the past tense. It does not say what
// should happen next.


<?php
// The controller now announces, and stops there.

public function register(Request $request)
{
    $user = User::create($request->validated());

    UserRegistered::dispatch($user);

    return redirect('/dashboard');
}


<?php
// ---------- The listeners ----------

// php artisan make:listener SendWelcomeEmail --event=UserRegistered

namespace App\\Listeners;

use App\\Events\\UserRegistered;

class SendWelcomeEmail
{
    public function handle(UserRegistered $event): void
    {
        Mail::to($event->user)->send(new WelcomeEmail($event->user));
    }
}

class CreateUserProfile
{
    public function handle(UserRegistered $event): void
    {
        $event->user->profile()->create(['bio' => '']);
    }
}

class TrackRegistration
{
    public function handle(UserRegistered $event): void
    {
        Analytics::track('registered', $event->user->id);
    }
}

// A sixth consequence is a sixth listener, and the
// controller does not change.


<?php
// ---------- Naming: a fact, not an instruction ----------

// ✓ Facts.
class OrderPlaced {}
class PaymentCompleted {}
class SubscriptionCancelled {}

// ❌ A command wearing an event's name. It has already
//    decided the consequence, so it gains nothing over
//    calling the method.
class SendWelcomeEmailEvent {}
class ShouldGenerateInvoice {}


<?php
// ---------- When NOT to use an event ----------

// ❌ One consequence. The event costs a file, a class and
//    an indirection, and buys nothing.
InvoiceCreated::dispatch($invoice);   // one listener: send it

// ✓
Mail::to($invoice->customer)->send(new InvoiceCreated($invoice));


// ❌ The caller needs the answer. A listener's return
//    value goes nowhere.
$total = InvoiceTotalRequested::dispatch($invoice);

// ✓ That is a method call.
$total = $this->calculator->total($invoice);`,
      },
      keyTakeaways: [
        "<b>Events decouple an action from its side effects</b>, so one method stops accumulating every consequence.",
        "<b>The dispatcher announces what happened and does not know who is listening.</b>",
        "Adding a new consequence means adding a listener, with the original code untouched.",
        "<b>A command says \"do this\" and has one handler; an event says \"this happened\" and can have any number.</b>",
        "<b>Name events as facts in the past tense</b>: `OrderPlaced`, `PaymentCompleted`, `InvoicePaid`.",
        "An event that names an action, such as `SendWelcomeEmailEvent`, has already decided the consequence.",
        "<b>Events make consequences invisible from the call site</b>, which is the decoupling and the debugging cost.",
        "<b>One consequence is clearer called directly</b> than dispatched to a single listener.",
        "<b>If the caller needs a result, it is not an event</b>: a listener's return value goes nowhere.",
        "<b>Listeners run synchronously by default</b>, so an event is a decoupling tool rather than a speed one.",
      ],
      commonMistakes: [
        "<b>Naming an event after the action it should cause.</b> That is a command with extra indirection.",
        "<b>Dispatching an event with exactly one listener.</b> A direct call says the same thing more clearly.",
        "<b>Expecting a return value from an event.</b> Dispatch is fire-and-forget by design.",
        "<b>Assuming an event makes the request faster.</b> Listeners run inline unless you queue them.",
        "<b>Putting the whole workflow in one listener.</b> That is the original method, moved.",
      ],
      quiz: [
        {
          question: "What is the difference between a command and an event?",
          options: [
            "None",
            "A command says \"do this\" and has one handler; an event says \"this happened\" and can have many",
            "Commands are queued",
            "Events return values",
          ],
          correctIndex: 1,
          explanation: "Which is why events are named as facts, in the past tense.",
        },
        {
          question: "Which is a well-named event?",
          options: ["SendWelcomeEmail", "ProcessOrder", "OrderPlaced", "ShouldNotifyUser"],
          correctIndex: 2,
          explanation: "A fact in the past tense, which has not decided the consequence.",
        },
        {
          question: "When is an event not the right tool?",
          options: [
            "When there are several consequences",
            "When the caller needs the result of the work",
            "When the consequences change over time",
            "When different parts of the app care",
          ],
          correctIndex: 1,
          explanation: "A listener's return value goes nowhere; that is a method call.",
        },
        {
          question: "Do listeners run asynchronously by default?",
          options: [
            "Yes, always",
            "No; they run inline, before the next line of the dispatcher",
            "Only in production",
            "Only if queued workers exist",
          ],
          correctIndex: 1,
          explanation: "An event decouples; queueing the listener is what makes it asynchronous.",
        },
      ],
    },
    {
      id: "registration-and-queued-listeners",
      title: "Discovery, registration & queued listeners",
      durationMinutes: 12,
      explanation: "Connecting a listener to an event, and getting it off the request.\n\n---\n\n### 1. Basic — how Laravel finds a listener\n\n```bash\nphp artisan make:event UserRegistered\nphp artisan make:listener SendWelcomeEmail --event=UserRegistered\n```\n\n```php\npublic function handle(UserRegistered $event): void\n{\n    // ...\n}\n```\n\n<b>Laravel discovers the wiring from that type hint.</b> A class in `app/Listeners` whose `handle()` takes `UserRegistered` is registered for it, with nothing to configure.\n\nWhich is convenient, and has a cost: <b>nothing lists what happens when an event fires.</b> Finding out means searching the codebase for the type hint.\n\n```bash\nphp artisan event:list\n```\n\nis the answer to that, and worth knowing before you need it.\n\nManual registration is the alternative:\n\n```php\nEvent::listen(UserRegistered::class, SendWelcomeEmail::class);\n```\n\n```text\ndiscovery              nothing to wire, nothing to read\nmanual registration    one file listing every consequence\n```\n\nUse manual registration when the wiring is unusual, when a listener lives outside the conventional place, or when you want one file somebody can audit.\n\n---\n\n### 2. Intermediate — queued listeners\n\nListeners run inline, so this is a problem:\n\n```text\nUserRegistered\n      ↓\ngenerate a 50-page PDF\n```\n\nThe user waits for it, which is exactly what yesterday was about.\n\n<b>`ShouldQueue` on the listener moves it to the queue:</b>\n\n```php\nclass SendWelcomeEmail implements ShouldQueue\n{\n}\n```\n\n```text\nUserRegistered → Queue → Worker → the PDF\n```\n\nAnd the two ideas compose properly:\n\n```text\nevent       decoupling: the caller does not know\nqueue       timing: the user does not wait\n```\n\nA listener can be queued while its siblings stay inline, which is usually right: creating a profile is instant and belongs in the request, and sending mail is not.\n\n<b>A queued listener is a job.</b> Everything from yesterday applies: it is serialised, `$tries` and `$backoff` work, it can fail, and it appears in `failed_jobs`. Which also means a failing listener no longer breaks the request that dispatched it, and that is a change in behaviour worth knowing about.\n\n---\n\n### 3. Advanced — the details, and debouncing\n\n<b>Order is not guaranteed once listeners are queued.</b> Three queued listeners are three independent jobs; if the second depends on the first, they are a chain, not listeners.\n\n<b>A queued listener sees the state at execution time</b>, not at dispatch. Yesterday's point, and it matters more here because the event is named after something that already happened: `SubscriptionCancelled` fires, the listener runs a minute later, and the subscription may have been reinstated.\n\n<b>And events inside a transaction fire before it commits</b>, unless the listener implements `ShouldQueueAfterCommit` (or `ShouldHandleEventsAfterCommit`). Otherwise a queued listener can start, look up the model, and find nothing there yet, which is a race that only appears under load.\n\n---\n\n### Debounced listeners\n\nLaravel 13 adds debouncing, for a specific and common shape:\n\n```text\nprofile updated → event → listener\nprofile updated → event → listener\nprofile updated → event → listener\n```\n\nSomebody editing a form triggers the same expensive work three times in five seconds, and only the last result matters.\n\n```text\nevent\nevent\nevent\nevent\n  │\n  └── debounce\n        ↓\n  one execution\n```\n\n<b>Rapid repeated triggers collapse into one run</b>, which suits exactly the work where re-running is wasteful rather than wrong:\n\n```text\nsearch indexing · document processing\ncache rebuilding · synchronisation\n```\n\nThe trade is a delay: the work happens after the quiet period rather than immediately. For a search index that is invisible; for something a user is waiting to see, it is not.",
      diagram: `How Laravel finds a listener

    php artisan make:listener SendWelcomeEmail \\
        --event=UserRegistered

    public function handle(UserRegistered \$event)

  Discovery reads that TYPE HINT. A class in app/Listeners
  whose handle() takes the event is registered for it.

  ⚠️  Convenient, and nothing lists what happens when an
      event fires. Finding out means grepping for the
      type hint.

      php artisan event:list

  Manual registration is the alternative:

    Event::listen(UserRegistered::class, SendWelcomeEmail::class)

    discovery     nothing to wire, nothing to read
    manual        one file listing every consequence

  Use manual for unusual wiring, listeners outside the
  conventional place, or when you want something to audit.


Queued listeners

  Listeners run inline, so:

    UserRegistered → generate a 50-page PDF

  means the user waits for it.

    implements ShouldQueue

    UserRegistered → Queue → Worker → the PDF

  And the two ideas compose:

    event   decoupling: the caller does not know
    queue   timing: the user does not wait

  One listener can be queued while its siblings stay
  inline — usually right: creating a profile is instant
  and belongs in the request; sending mail is not.

  A queued listener IS a job. Serialised, \$tries and
  \$backoff work, it can fail, it appears in failed_jobs.

  Which also means a failing listener no longer breaks
  the request that dispatched it.


Three details

  Order is NOT guaranteed once listeners are queued.
  Three queued listeners are three independent jobs. If
  the second depends on the first, that is a chain.

  A queued listener sees the state at EXECUTION time.
  SubscriptionCancelled fires, the listener runs a minute
  later, and the subscription may have been reinstated.

  Events inside a transaction fire BEFORE it commits,
  unless the listener uses ShouldQueueAfterCommit. A
  queued listener can otherwise start, look up the model,
  and find nothing — a race that only appears under load.


Debouncing

    profile updated → event → listener
    profile updated → event → listener
    profile updated → event → listener

  Somebody editing a form triggers the same expensive
  work three times in five seconds, and only the last
  result matters.

    event
    event
    event
      │
      └── debounce
            ↓
      one execution

  Suits work where re-running is WASTEFUL rather than
  wrong:

    search indexing · document processing
    cache rebuilding · synchronisation

  The trade is a delay: the work happens after the quiet
  period. Invisible for a search index; not invisible
  for something a user is waiting to see.`,
      codeExample: {
        title: "Wiring listeners, and getting them off the request",
        code: `<?php
// ---------- Discovery: the type hint is the wiring ----------

namespace App\\Listeners;

use App\\Events\\UserRegistered;

class SendWelcomeEmail
{
    // This type hint is what registers the listener.
    public function handle(UserRegistered $event): void
    {
        Mail::to($event->user)->send(new WelcomeEmail($event->user));
    }
}


# What is actually listening to what:
php artisan event:list


<?php
// ---------- Manual registration, when you want a list ----------

// app/Providers/AppServiceProvider.php

use Illuminate\\Support\\Facades\\Event;

public function boot(): void
{
    Event::listen(UserRegistered::class, SendWelcomeEmail::class);
    Event::listen(UserRegistered::class, CreateUserProfile::class);
    Event::listen(UserRegistered::class, TrackRegistration::class);

    // Or a closure, for something trivial.
    Event::listen(function (InvoicePaid $event) {
        Log::info('Invoice paid', ['id' => $event->invoice->id]);
    });
}


<?php
// ---------- Queued, and inline, side by side ----------

// Instant, and the request should wait for it.
class CreateUserProfile
{
    public function handle(UserRegistered $event): void
    {
        $event->user->profile()->create(['bio' => '']);
    }
}

// Slow, and the request should not.
class SendWelcomeEmail implements ShouldQueue
{
    use InteractsWithQueue, Queueable;

    // A queued listener IS a job: all of yesterday applies.
    public int $tries = 3;
    public array $backoff = [10, 30, 60];
    public string $queue = 'emails';

    public function handle(UserRegistered $event): void
    {
        Mail::to($event->user)->send(new WelcomeEmail($event->user));
    }

    public function failed(UserRegistered $event, \\Throwable $e): void
    {
        Log::error('Welcome email failed', ['user' => $event->user->id]);
    }
}


<?php
// ---------- The transaction race ----------

DB::transaction(function () use ($data) {
    $user = User::create($data);

    // Fires here, INSIDE the transaction. A queued
    // listener can start and find no such user yet.
    UserRegistered::dispatch($user);
});

// ✓ Wait for the commit.
use Illuminate\\Contracts\\Events\\ShouldQueueAfterCommit;

class SendWelcomeEmail implements ShouldQueue, ShouldQueueAfterCommit
{
}

// A race that only appears under load, which is the
// worst kind to find in production.


<?php
// ---------- Order is not guaranteed ----------

// ❌ Three queued listeners are three independent jobs.
//    The second may run before the first finishes.
class GenerateInvoicePdf implements ShouldQueue {}
class EmailInvoicePdf implements ShouldQueue {}     // needs the PDF

// ✓ That is a chain, from yesterday.
Bus::chain([
    new GenerateInvoicePdf($invoice),
    new EmailInvoicePdf($invoice),
])->dispatch();


<?php
// ---------- Debounced ----------

// Somebody editing a form fires this three times in five
// seconds, and only the last one matters.
class ReindexProfile implements ShouldQueue
{
    public function handle(ProfileUpdated $event): void
    {
        Search::index($event->user);
    }
}

// Collapsing the rapid repeats into one run suits
// indexing, cache rebuilding and synchronisation:
// re-running is wasteful rather than wrong.
//
// The trade is a delay. Fine for a search index; not
// fine for something a user is waiting to see.`,
      },
      keyTakeaways: [
        "<b>Laravel discovers a listener from the event type hint on its `handle()` method.</b>",
        "<b>Discovery means nothing lists an event's consequences</b>, so `php artisan event:list` is worth knowing.",
        "<b>Manual registration puts every wiring in one auditable file</b>, which suits unusual or important cases.",
        "<b>`ShouldQueue` on a listener moves it to the queue</b>, so the user does not wait for it.",
        "<b>An event decouples and a queue defers</b>: they solve different problems and compose.",
        "One listener can be queued while its siblings stay inline, which is usually the right split.",
        "<b>A queued listener is a job</b>: serialised, retryable, failable, and visible in `failed_jobs`.",
        "<b>Order is not guaranteed between queued listeners</b>; dependent steps are a chain, not listeners.",
        "<b>Events inside a transaction fire before the commit</b>, so a queued listener needs `ShouldQueueAfterCommit`.",
        "<b>Debouncing collapses rapid repeated events into one run</b>, at the cost of a delay.",
      ],
      commonMistakes: [
        "<b>Relying on discovery and then not knowing what fires.</b> `event:list` or manual registration answers it.",
        "<b>Queueing every listener.</b> Instant work belongs in the request, where its failure is visible.",
        "<b>Depending on the order of queued listeners.</b> They are independent jobs; use a chain.",
        "<b>Dispatching inside a transaction without `ShouldQueueAfterCommit`.</b> The listener may find nothing there.",
        "<b>Debouncing something a user is waiting for.</b> The delay is the whole mechanism.",
      ],
      quiz: [
        {
          question: "How does Laravel know which event a listener handles?",
          options: [
            "From the class name",
            "From the event type hint on `handle()`",
            "From a config file only",
            "From the directory",
          ],
          correctIndex: 1,
          explanation: "Which is convenient, and means nothing lists an event's consequences.",
        },
        {
          question: "What does `ShouldQueue` on a listener change?",
          options: [
            "The listener runs first",
            "It runs on the queue, so the request does not wait for it",
            "It runs after the response",
            "It is retried automatically only",
          ],
          correctIndex: 1,
          explanation: "The event decouples; the queue defers.",
        },
        {
          question: "Two queued listeners must run in order. What should you use?",
          options: [
            "Listener priorities",
            "A chain, because queued listeners are independent jobs",
            "A debounce",
            "Manual registration",
          ],
          correctIndex: 1,
          explanation: "Nothing guarantees the order in which independent jobs run.",
        },
        {
          question: "Why can a queued listener fail to find a model that was just created?",
          options: [
            "The queue is slow",
            "The event fired inside a transaction that had not committed yet",
            "The model was serialised wrongly",
            "The worker cached it",
          ],
          correctIndex: 1,
          explanation: "`ShouldQueueAfterCommit` waits for the commit.",
        },
      ],
    },
    {
      id: "subscribers-and-model-events",
      title: "Subscribers, and model events versus domain events",
      durationMinutes: 10,
      explanation: "Grouping listeners, and a naming decision that shapes how an application reads.\n\n---\n\n### 1. Basic — subscribers\n\nFour listeners for four events in the same area means four files:\n\n```text\nListener A · Listener B · Listener C · Listener D\n```\n\n<b>A <i>subscriber</i></b> puts them in one class:\n\n```text\nUserEventSubscriber\n ├── user registered\n ├── user logged in\n ├── user updated\n └── user deleted\n```\n\n```php\nclass UserEventSubscriber\n{\n    public function subscribe(Dispatcher $events): array\n    {\n        return [\n            UserRegistered::class => 'onRegistered',\n            UserDeleted::class    => 'onDeleted',\n        ];\n    }\n}\n```\n\n<b>The gain is that the whole area is readable in one place</b>, which is exactly what discovery costs you. Four separate listeners are four files to find; one subscriber is one file that lists what it reacts to.\n\nThe cost is that a subscriber cannot be queued as a unit: each handler is inline unless you dispatch a job from it. So a subscriber suits cheap, related reactions, and slow work still wants its own queued listener.\n\n---\n\n### 2. Intermediate — model events are events too\n\nDay 14's model lifecycle:\n\n```text\ncreating · created · updating · updated\nsaving · saved · deleting · deleted\n```\n\nThose are events, dispatched by Eloquent. Which raises a fair question: <b>if `User::created` already fires, why write `UserRegistered`?</b>\n\nBecause they mean different things:\n\n```text\nUser was created           an Eloquent fact\nUserRegistered             a business fact\n```\n\nA `User` row is created by registration, by an admin adding somebody, by an import, by a seeder and by a test factory. <b>Only one of those is a registration</b>, and a listener on `created` cannot tell them apart.\n\n```php\nprotected $dispatchesEvents = [\n    'created' => UserCreated::class,\n];\n```\n\nmaps one to the other when that is genuinely what you want. Usually it is not.\n\n---\n\n### 3. Advanced — naming for the domain\n\nThe deeper version of the same point:\n\n```text\nUserUpdated             generic. Which field? Why?\nSubscriptionUpgraded    a thing the business does\n```\n\n<b>A generic event forces every listener to work out whether it cares.</b> A listener on `UserUpdated` starts with \"was it the plan that changed, and did it go up?\", and that logic is now in the listener rather than in the thing that knew.\n\n```php\nif ($user->wasChanged('plan_id') && $user->plan->tier > $previous->tier) {\n    // ...\n}\n```\n\nrepeated in three listeners, each with its own version of the check.\n\n<b>The code that made the change knows what the change meant.</b> Dispatch `SubscriptionUpgraded` there, and the listeners are three lines with no conditions.\n\nWhich gives a rule worth carrying:\n\n```text\nmodel events        infrastructure: timestamps, slugs,\n                    cache invalidation, audit rows\n\ndomain events       business facts: registered, upgraded,\n                    cancelled, paid, shipped\n```\n\nModel events for the things that are true of every row however it arrived. Domain events for the things that happened for a reason.\n\nAnd the pragmatic note, because this can be overdone: <b>a small application does not need a domain event for every state change.</b> Start with a direct call, promote to an event when there is a second consumer, and name it after what happened rather than after the model that changed.",
      diagram: `Subscribers

  Four listeners in the same area, four files:

    Listener A · B · C · D

  A subscriber puts them together:

    UserEventSubscriber
     ├── user registered
     ├── user logged in
     ├── user updated
     └── user deleted

  The gain is that the whole AREA is readable in one
  place — which is what discovery costs you. Four
  listeners are four files to find; one subscriber lists
  what it reacts to.

  The cost: it cannot be queued as a unit. Each handler
  is inline unless it dispatches a job. Cheap related
  reactions suit a subscriber; slow work still wants its
  own queued listener.


Model events are events too

  creating · created · updating · updated
  saving · saved · deleting · deleted

  So if User::created already fires, why write
  UserRegistered?

    User was created    an ELOQUENT fact
    UserRegistered      a BUSINESS fact

  A User row is created by registration, by an admin
  adding somebody, by an import, by a seeder and by a
  test factory.

  Only one of those is a registration, and a listener on
  created cannot tell them apart.


Naming for the domain

    UserUpdated            generic. Which field? Why?
    SubscriptionUpgraded   a thing the business does

  A generic event forces every listener to work out
  whether it cares:

    if (\$user->wasChanged('plan_id')
        && \$user->plan->tier > \$previous->tier) { ... }

  repeated in three listeners, each with its own version
  of the check.

  The code that MADE the change knows what the change
  meant. Dispatch SubscriptionUpgraded there, and the
  listeners are three lines with no conditions.


The rule

  model events    infrastructure: timestamps, slugs,
                  cache invalidation, audit rows
                  — true of every row, however it arrived

  domain events   business facts: registered, upgraded,
                  cancelled, paid, shipped
                  — things that happened for a reason


  And the pragmatic note: a small application does not
  need a domain event for every state change.

    start with a direct call
    promote to an event when there is a second consumer
    name it after what HAPPENED, not after the model`,
      codeExample: {
        title: "One class per area, and events that mean something",
        code: `<?php
// ---------- A subscriber ----------

namespace App\\Listeners;

use App\\Events\\UserDeleted;
use App\\Events\\UserRegistered;
use Illuminate\\Events\\Dispatcher;

class UserEventSubscriber
{
    public function onRegistered(UserRegistered $event): void
    {
        Analytics::track('registered', $event->user->id);
    }

    public function onDeleted(UserDeleted $event): void
    {
        Analytics::track('deleted', $event->user->id);
    }

    public function subscribe(Dispatcher $events): array
    {
        return [
            UserRegistered::class => 'onRegistered',
            UserDeleted::class    => 'onDeleted',
        ];
    }
}

// One file listing what this area reacts to, rather than
// four files to find. Each handler is inline, so slow
// work still belongs in its own queued listener.


<?php
// ---------- Model events: infrastructure ----------

class Post extends Model
{
    protected static function booted(): void
    {
        // True of every post, however it was created.
        static::creating(fn (Post $post) => $post->slug = Str::slug($post->title));

        static::saved(fn (Post $post) => Cache::forget("post:{$post->id}"));
    }
}


<?php
// ---------- Why a domain event is different ----------

// A User row is created by:
//   registration · an admin adding somebody
//   an import · a seeder · a test factory
//
// A listener on created cannot tell them apart, and
// only one of them is a registration.

// ❌ Every seeded user now gets a welcome email.
static::created(fn (User $user) => Mail::to($user)->send(new WelcomeEmail($user)));

// ✓ Dispatched by the thing that knows.
public function register(Request $request)
{
    $user = User::create($request->validated());

    UserRegistered::dispatch($user);
}


<?php
// ---------- Generic events push logic into listeners ----------

// ❌ Every listener starts by working out whether it cares.
class HandleUserUpdate
{
    public function handle(UserUpdated $event): void
    {
        if (! $event->user->wasChanged('plan_id')) {
            return;
        }

        if ($event->user->plan->tier <= $event->previousTier) {
            return;
        }

        // ...and that check is repeated in two other listeners.
    }
}

// ✓ The code that made the change knows what it meant.
public function upgrade(User $user, Plan $plan): void
{
    $previous = $user->plan;

    $user->update(['plan_id' => $plan->id]);

    if ($plan->tier > $previous->tier) {
        SubscriptionUpgraded::dispatch($user, $previous, $plan);
    }
}

// And the listener is three lines with no conditions:
class SendUpgradeThanks
{
    public function handle(SubscriptionUpgraded $event): void
    {
        Mail::to($event->user)->send(new UpgradeThanks($event->plan));
    }
}


<?php
// ---------- Mapping a model event, when you do want one ----------

class Order extends Model
{
    protected $dispatchesEvents = [
        'created' => OrderCreated::class,
    ];
}

// Reasonable when "an order row exists" really is the
// business fact. Usually the business fact is
// OrderPlaced, and it happens somewhere more specific.`,
      },
      keyTakeaways: [
        "<b>A subscriber groups several event handlers into one class</b>, so an area is readable in one file.",
        "That is what discovery costs you: four listeners are four files to find.",
        "<b>A subscriber cannot be queued as a unit</b>, so slow work still belongs in its own queued listener.",
        "<b>Eloquent's lifecycle events are events too</b>, dispatched for every row however it was created.",
        "<b>A `User` row is created by registration, an admin, an import, a seeder and a factory</b>, and `created` cannot tell them apart.",
        "<b>A model event is an Eloquent fact; a domain event is a business fact.</b>",
        "<b>A generic event pushes the \"do I care\" logic into every listener</b>, repeated and slightly different each time.",
        "<b>The code that made the change knows what it meant</b>, so dispatch the specific event there.",
        "<b>Model events suit infrastructure</b>: slugs, cache invalidation, audit rows.",
        "<b>Domain events suit business facts</b>: registered, upgraded, cancelled, paid, shipped.",
        "Start with a direct call and promote to an event when a second consumer appears.",
      ],
      commonMistakes: [
        "<b>Sending a welcome email from a `created` model event.</b> Every seeded and imported user gets one too.",
        "<b>Dispatching `UserUpdated` and filtering in the listener.</b> The same check is repeated and drifts.",
        "<b>Putting slow work in a subscriber.</b> Each handler runs inline, so the request waits.",
        "<b>Naming an event after the model rather than the fact.</b> `SubscriptionUpgraded` says something; `UserUpdated` does not.",
        "<b>Creating a domain event for every state change in a small application.</b> A direct call is clearer until there are two consumers.",
      ],
      quiz: [
        {
          question: "What does a subscriber give you?",
          options: [
            "Queued listeners",
            "Several event handlers in one class, so an area is readable in one file",
            "Automatic registration",
            "Priority ordering",
          ],
          correctIndex: 1,
          explanation: "Which is what discovery across four separate listeners costs.",
        },
        {
          question: "Why not send a welcome email from the `created` model event?",
          options: [
            "It is slower",
            "Rows are also created by imports, seeders and factories, and `created` cannot tell them apart",
            "Model events cannot send mail",
            "It runs twice",
          ],
          correctIndex: 1,
          explanation: "Registration is a business fact; row creation is not.",
        },
        {
          question: "What is wrong with a generic `UserUpdated` event?",
          options: [
            "It is too slow",
            "Every listener has to work out whether it cares, repeating the same drifting check",
            "It cannot be queued",
            "Nothing",
          ],
          correctIndex: 1,
          explanation: "The code that made the change already knew what it meant.",
        },
        {
          question: "What are model events best suited to?",
          options: [
            "Business workflows",
            "Infrastructure: slugs, cache invalidation, audit rows",
            "Sending notifications",
            "Anything that must be queued",
          ],
          correctIndex: 1,
          explanation: "Things true of every row, however it arrived.",
        },
      ],
    },
    {
      id: "scheduling",
      title: "Task scheduling — frequencies & constraints",
      durationMinutes: 11,
      explanation: "Events react to something happening. The scheduler handles work that happens because of the time.\n\n---\n\n### 1. Basic — one cron entry\n\nWithout Laravel, every recurring task is a crontab line:\n\n```text\n0 2 * * *   php /var/www/artisan report:daily\n*/15 * * * * php /var/www/artisan sync:customers\n0 * * * *   php /var/www/artisan cache:warm\n```\n\nWhich lives on a server, outside your repository, unreviewed and undiscoverable. Somebody adds one during an incident and nobody knows about it two years later.\n\n<b>Laravel inverts it: one cron entry, and the schedule lives in your code:</b>\n\n```text\nsystem cron (every minute)\n        ↓\nLaravel scheduler\n        ↓\nyour scheduled tasks\n```\n\n```php\n// routes/console.php\n\nSchedule::job(GenerateDailyReport::class)->daily();\n```\n\n<b>Now the schedule is in version control</b>, reviewed like anything else, and visible to everybody.\n\n---\n\n### 2. Intermediate — schedule a job, not the work\n\n```php\nSchedule::job(GenerateDailyReport::class)->dailyAt('02:00');\n```\n\n```text\nScheduler → Queue → Worker → the heavy work\n```\n\nThat indirection is the good architecture, and it is worth being deliberate about.\n\n<b>The scheduler process should decide <i>when</i>, and a worker should do the work.</b> A `Schedule::call()` containing an hour of report generation blocks the scheduler for an hour, so nothing else scheduled in that hour runs on time. Dispatching a job takes a millisecond.\n\nThe three forms:\n\n```text\nSchedule::job(...)        dispatch a queued job     ← usually this\nSchedule::command(...)    run an Artisan command\nSchedule::call(...)       run a closure, inline\n```\n\nAnd the frequencies:\n\n```text\neveryMinute() · everyFiveMinutes() · hourly()\ndaily() · dailyAt('02:00') · weekly() · monthly()\nweeklyOn(1, '8:00') · cron('0 2 * * *')\n```\n\n<b>Prefer a specific time to `daily()`</b>, because `daily()` means midnight, and everything else defaulting to midnight means everything runs at once.\n\n---\n\n### 3. Advanced — constraints and hooks\n\nA schedule can carry conditions:\n\n```php\nSchedule::job(SendInvoiceReminders::class)\n    ->weekdays()\n    ->at('09:00')\n    ->timezone('Asia/Kathmandu')\n    ->environments(['production']);\n```\n\n```text\nweekdays · weekends · mondays() · sundays()\nbetween('9:00', '17:00') · unlessBetween(...)\nwhen(fn () => ...) · skip(fn () => ...)\ntimezone(...) · environments([...])\n```\n\n<b>Which lets the schedule express a business rule rather than hiding it in the task.</b> \"Reminders on weekdays at nine\" belongs next to the schedule; a task that starts by checking whether today is a Saturday has that rule buried in it.\n\n<b>`timezone()` is not optional for anything user-facing.</b> A server on UTC running a nine o'clock reminder sends it at a quarter to three in the afternoon in Kathmandu, and the bug report will say \"the emails arrive at a weird time\".\n\n<b>And `environments()` matters more than it looks.</b> Without it, a staging environment sharing a database happily sends the same invoice reminders your production environment does. That is a real incident, and one line prevents it.\n\nHooks run around a task:\n\n```php\n->before(fn () => Log::info('starting'))\n->after(fn () => Log::info('done'))\n->onSuccess(fn () => ...)\n->onFailure(fn () => Notification::route(...))\n```\n\n<b>`onFailure()` is the one to actually use.</b> A scheduled task that stops working fails silently by definition: nobody is watching, nothing is broken on the site, and you find out when somebody asks where last month's report went.",
      diagram: `One cron entry

  Without Laravel, every recurring task is a crontab line:

    0 2 * * *    php artisan report:daily
    */15 * * * * php artisan sync:customers
    0 * * * *    php artisan cache:warm

  Living on a server, outside your repository,
  unreviewed and undiscoverable. Somebody adds one
  during an incident and nobody knows two years later.

  Laravel inverts it:

    system cron (every minute)
            ↓
    Laravel scheduler
            ↓
    your scheduled tasks

    // routes/console.php
    Schedule::job(GenerateDailyReport::class)->daily();

  The schedule is now in version control, reviewed, and
  visible to everybody.


Schedule a JOB, not the work

    Schedule::job(GenerateDailyReport::class)->dailyAt('02:00')

    Scheduler → Queue → Worker → the heavy work

  ⚠️  The scheduler decides WHEN. A worker does the work.

      A Schedule::call() containing an hour of report
      generation blocks the scheduler for an hour, so
      nothing else scheduled in that hour runs on time.

      Dispatching a job takes a millisecond.

    Schedule::job(...)      dispatch a queued job  ← usually
    Schedule::command(...)  run an Artisan command
    Schedule::call(...)     run a closure, inline

  everyMinute() · everyFiveMinutes() · hourly()
  daily() · dailyAt('02:00') · weekly() · monthly()
  weeklyOn(1, '8:00') · cron('0 2 * * *')

  ⚠️  Prefer a specific time to daily(). daily() means
      midnight, and everything defaulting to midnight
      runs at once.


Constraints

    ->weekdays()->at('09:00')
    ->timezone('Asia/Kathmandu')
    ->environments(['production'])

    weekdays · weekends · mondays() · sundays()
    between('9:00','17:00') · unlessBetween(...)
    when(fn () => ...) · skip(fn () => ...)

  The schedule expresses a BUSINESS RULE rather than
  hiding it in the task. "Reminders on weekdays at nine"
  belongs next to the schedule; a task that starts by
  checking whether today is Saturday has it buried.

  ⚠️  timezone() is not optional for anything user-facing.
      A UTC server running a nine o'clock reminder sends
      it at 2:45pm in Kathmandu, and the bug report says
      "the emails arrive at a weird time".

  ⚠️  environments() matters more than it looks. Without
      it, a staging environment sharing a database sends
      the same invoice reminders production does. That
      is a real incident, and one line prevents it.


Hooks

    ->before()  ->after()  ->onSuccess()  ->onFailure()

  onFailure() is the one to actually use.

  A scheduled task that stops working fails SILENTLY by
  definition: nobody is watching, nothing is broken on
  the site, and you find out when somebody asks where
  last month's report went.`,
      codeExample: {
        title: "A schedule that lives in the repository",
        code: `# ---------- The one cron entry ----------

* * * * * cd /var/www && php artisan schedule:run >> /dev/null 2>&1

# That is the only crontab line you add. Everything else
# lives in the repository.


<?php
// routes/console.php

use App\\Jobs\\GenerateDailyReport;
use App\\Jobs\\SendInvoiceReminders;
use Illuminate\\Support\\Facades\\Schedule;

// ---------- Dispatch a job: the scheduler stays free ----------

Schedule::job(GenerateDailyReport::class)
    ->dailyAt('02:00')
    ->timezone('Asia/Kathmandu');

// Scheduler → Queue → Worker → the heavy work
//
// ❌ This blocks the scheduler for as long as it runs,
//    so nothing else scheduled meanwhile runs on time.
// Schedule::call(fn () => (new ReportBuilder)->build())->dailyAt('02:00');


// ---------- An Artisan command ----------

Schedule::command('sync:customers')
    ->everyFifteenMinutes()
    ->environments(['production']);


// ---------- Constraints as business rules ----------

Schedule::job(SendInvoiceReminders::class)
    ->weekdays()                    // not at the weekend
    ->at('09:00')
    ->timezone('Asia/Kathmandu')    // 09:00 for the reader
    ->environments(['production']); // staging shares the
                                    // database and must not
                                    // email real customers

// The rule is next to the schedule, rather than buried
// in a task that starts by checking today's date.


Schedule::command('cache:warm')
    ->hourly()
    ->between('6:00', '23:00');     // nobody is browsing at 4am

Schedule::command('backups:run')
    ->dailyAt('03:00')
    ->when(fn () => config('backups.enabled'));


// ---------- Hooks ----------

Schedule::job(GenerateDailyReport::class)
    ->dailyAt('02:00')

    ->onSuccess(function () {
        Log::info('Daily report dispatched');
    })

    // The one that matters. A scheduled task that stops
    // working fails silently: nobody is watching, and
    // nothing on the site is broken.
    ->onFailure(function () {
        Notification::route('slack', config('services.slack.ops'))
            ->notify(new ScheduledTaskFailed('daily report'));
    });


// ---------- Prefer a specific time ----------

// ❌ daily() means midnight, and so does everything else
//    that used daily(). They all run at once.
Schedule::command('reports:daily')->daily();
Schedule::command('cleanup:old')->daily();
Schedule::command('sync:all')->daily();

// ✓ Spread them.
Schedule::command('reports:daily')->dailyAt('02:00');
Schedule::command('cleanup:old')->dailyAt('03:30');
Schedule::command('sync:all')->dailyAt('04:15');`,
      },
      keyTakeaways: [
        "<b>Without the scheduler, every recurring task is a crontab line outside your repository</b>, unreviewed and undiscoverable.",
        "<b>One cron entry runs `schedule:run` every minute</b>, and the schedule itself lives in `routes/console.php`.",
        "<b>Schedule a job rather than the work</b>: the scheduler decides when, a worker does it.",
        "<b>A long `Schedule::call()` blocks the scheduler</b>, so nothing else scheduled meanwhile runs on time.",
        "`Schedule::job()`, `Schedule::command()` and `Schedule::call()` cover the three forms.",
        "<b>Prefer `dailyAt('02:00')` to `daily()`</b>, because everything defaulting to midnight runs at once.",
        "<b>Constraints let the schedule express a business rule</b> rather than burying it in the task.",
        "<b>`timezone()` is not optional for user-facing tasks</b>, or nine o'clock happens at somebody else's teatime.",
        "<b>`environments(['production'])` stops staging emailing real customers</b> when it shares a database.",
        "<b>`onFailure()` matters because a scheduled task fails silently</b>: nobody is watching, and nothing looks broken.",
      ],
      commonMistakes: [
        "<b>Adding crontab entries per task.</b> They live outside the repository and nobody knows they exist.",
        "<b>Doing the work in `Schedule::call()`.</b> The scheduler is blocked and everything else runs late.",
        "<b>Using `daily()` for everything.</b> They all run at midnight, together.",
        "<b>Omitting `timezone()`.</b> The reminder arrives at the wrong hour for every user.",
        "<b>Omitting `environments()`.</b> Staging sends production's emails to real customers.",
      ],
      quiz: [
        {
          question: "How many cron entries does a Laravel application need?",
          options: [
            "One per task",
            "One, running `schedule:run` every minute",
            "None",
            "One per environment",
          ],
          correctIndex: 1,
          explanation: "The schedule itself then lives in your repository.",
        },
        {
          question: "Why schedule a job rather than doing the work in the schedule?",
          options: [
            "Jobs are faster",
            "A long-running task blocks the scheduler, so nothing else runs on time",
            "Closures cannot be scheduled",
            "It enables retries only",
          ],
          correctIndex: 1,
          explanation: "The scheduler decides when; a worker does the work.",
        },
        {
          question: "What does `environments(['production'])` prevent?",
          options: [
            "Overlapping runs",
            "Staging running the task and, for example, emailing real customers",
            "Timezone errors",
            "Failed jobs",
          ],
          correctIndex: 1,
          explanation: "Particularly when staging shares a database.",
        },
        {
          question: "Why does `onFailure()` matter for a scheduled task?",
          options: [
            "It retries the task",
            "A scheduled task fails silently: nobody is watching and nothing on the site looks broken",
            "It is required",
            "It logs the output",
          ],
          correctIndex: 1,
          explanation: "You otherwise find out when somebody asks where last month's report went.",
        },
      ],
    },
    {
      id: "overlaps-and-servers",
      title: "Overlaps, multiple servers & running the scheduler",
      durationMinutes: 12,
      explanation: "The two ways a schedule goes wrong in production, and the commands for finding out.\n\n---\n\n### 1. Basic — overlapping runs\n\nAn hourly report that takes two hours:\n\n```text\n01:00  report starts\n02:00  the scheduler starts another one\n03:00  and another\n```\n\n```text\nReport A ──────────────────>\nReport B         ──────────────────>\nReport C                   ──────────────────>\n```\n\n<b>Three copies of the same task running at once</b>, competing for the same rows, doubling the load, and producing whatever a race produces.\n\nAnd it compounds: each run is slower because of the others, so more overlap, until nothing finishes.\n\n```php\n->withoutOverlapping()\n```\n\n```text\ntask starts → lock acquired → another invocation? → skipped\n```\n\n<b>Essential for anything that takes an unpredictable time</b>, which is most real work: billing, reports, imports, synchronisation, cleanup.\n\nThe lock has an expiry, defaulting to 24 hours. <b>Set it from the work</b>, because a task killed in a way that skips its cleanup leaves the lock behind, and then the task silently never runs again until it expires.\n\n---\n\n### 2. Intermediate — more than one server\n\nTwo application servers, both running the scheduler:\n\n```text\nServer A → the task\nServer B → the task\nServer C → the task\n```\n\n<b>Every invoice reminder is sent three times.</b> Which is not a subtle bug: it is customer-visible, and it happens the moment you scale from one server.\n\n```php\n->onOneServer()\n```\n\nThe first server to acquire a shared lock runs it; the others skip.\n\n<b>The requirement is a shared cache</b>: Redis or Memcached, not `file` and not `array`. With a per-server cache, each acquires its own lock and all three still run, and nothing warns you.\n\nSo the pair together:\n\n```text\nwithoutOverlapping   the same server, twice, over time\nonOneServer          several servers, at once\n```\n\nBoth are needed on anything scheduled in a multi-server deployment, and they are answering different questions.\n\n---\n\n### 3. Advanced — running and inspecting\n\n```bash\nphp artisan schedule:run\n```\n\nchecks what is due and runs it, then exits. That is the command the cron entry calls, every minute.\n\n```bash\nphp artisan schedule:work\n```\n\nstays alive and does the checking itself:\n\n```text\nschedule:run     check once, then exit        ← cron calls this\nschedule:work    keep checking, continuously  ← a long-running process\n```\n\n`work` suits local development, and containers where a cron daemon is awkward. <b>Laravel 13 improved its graceful shutdown</b>, so a deploy or a container replacement lets running work finish rather than killing it mid-task, which matters because that is exactly when it happens.\n\n```bash\nphp artisan schedule:list\n```\n\n<b>This is the first thing to run when a scheduled task did not happen.</b>\n\n```text\ntask · frequency · next run\n```\n\nIt answers the four usual causes in one look: the task is not registered, the frequency is not what you thought, the timezone shifted it, or an `environments()` constraint excluded it.\n\nAnd the fifth cause, which `schedule:list` cannot show: <b>the cron entry is not there at all.</b> On a fresh server that is the answer more often than anything in your code.\n\nOne last thing worth checking early, because it is invisible: <b>the scheduler runs as a user</b>, and that user needs to be able to write your logs and read your `.env`. A scheduler running as `root` while the application runs as `www-data` produces log files nobody else can write to, and the failure appears somewhere else entirely.",
      diagram: `Overlapping runs

  An hourly report that takes two hours:

    01:00  report starts
    02:00  the scheduler starts another
    03:00  and another

    Report A ──────────────────>
    Report B         ──────────────────>
    Report C                   ──────────────────>

  Three copies competing for the same rows, doubling
  the load, producing whatever a race produces.

  And it compounds: each run is slower because of the
  others, so more overlap, until nothing finishes.

    ->withoutOverlapping()

    task starts → lock acquired
                → another invocation? → skipped

  Essential for anything of unpredictable duration —
  which is most real work: billing, reports, imports,
  synchronisation, cleanup.

  ⚠️  The lock expires (24h by default). Set it from the
      work: a task killed without cleanup leaves the lock
      behind, and the task silently never runs again
      until it expires.


More than one server

    Server A → the task
    Server B → the task
    Server C → the task

  Every invoice reminder sent three times. Not subtle:
  customer-visible, and it happens the moment you scale
  past one server.

    ->onOneServer()

  The first to acquire a SHARED lock runs it.

  ⚠️  Requires a shared cache: Redis or Memcached, not
      file and not array. With a per-server cache each
      acquires its own lock, all three still run, and
      nothing warns you.


  withoutOverlapping   the same server, twice, over time
  onOneServer          several servers, at once

  Different questions. A multi-server deployment needs
  both.


Running it

    schedule:run     check once, then exit  ← cron calls this
    schedule:work    keep checking          ← long-running

  work suits local development, and containers where a
  cron daemon is awkward. Laravel 13 improved its
  graceful shutdown, so a deploy lets running work
  finish rather than killing it mid-task — which is
  exactly when deploys happen.


Inspecting it

    php artisan schedule:list

      task · frequency · next run

  The FIRST thing to run when a task did not happen. It
  answers four of the five usual causes at a glance:

    the task is not registered
    the frequency is not what you thought
    the timezone shifted it
    an environments() constraint excluded it

  And the fifth, which it cannot show:

    ⚠️  the cron entry is not there at all

      On a fresh server, that is the answer more often
      than anything in your code.


  One more invisible one: the scheduler runs as a USER,
  and that user must be able to write your logs and read
  your .env. Running as root while the app runs as
  www-data produces log files nobody else can write, and
  the failure surfaces somewhere else entirely.`,
      codeExample: {
        title: "A schedule that survives production",
        code: `<?php
// routes/console.php

use Illuminate\\Support\\Facades\\Schedule;

// ---------- Overlapping: the same server, twice ----------

// ❌ Takes two hours, runs hourly. By 03:00 there are three.
Schedule::command('reports:hourly')->hourly();

// ✓ A second invocation is skipped while the first runs.
Schedule::command('reports:hourly')
    ->hourly()
    ->withoutOverlapping(120);      // the lock expires after
                                     // 120 minutes, set from
                                     // the work — not the
                                     // 24-hour default


// ---------- Several servers, at once ----------

// ❌ Three application servers, three copies of every
//    reminder, sent to real customers.
Schedule::job(SendInvoiceReminders::class)->dailyAt('09:00');

// ✓ The first to take a shared lock runs it.
Schedule::job(SendInvoiceReminders::class)
    ->dailyAt('09:00')
    ->onOneServer();

// ⚠️ Requires a shared cache. With CACHE_STORE=file each
//    server takes its own lock and all three still run.


// ---------- Both, because they answer different questions ----------

Schedule::command('billing:run')
    ->dailyAt('01:00')
    ->withoutOverlapping(180)   // not twice over time
    ->onOneServer()             // not on three servers at once
    ->environments(['production'])
    ->onFailure(fn () => Notification::route('slack', $ops)
        ->notify(new ScheduledTaskFailed('billing')));


# ---------- Running the scheduler ----------

# Production: one cron entry, calling schedule:run each minute.
* * * * * cd /var/www && php artisan schedule:run >> /dev/null 2>&1

# Local development, or a container with no cron daemon:
php artisan schedule:work

#   schedule:run    check once, then exit
#   schedule:work   keep checking, continuously


# ---------- When a task did not run ----------

php artisan schedule:list

# Command                        Interval      Next Due
# ------------------------------ ------------- -----------
# billing:run                    0 1 * * *     11 hours from now
# reports:hourly                 0 * * * *     23 minutes from now
#
# Four of the five usual causes are visible here:
#   not registered · wrong frequency
#   timezone shift · environments() excluded it
#
# The fifth is not:
#   the cron entry is missing.  crontab -l


# ---------- Testing without waiting ----------

php artisan schedule:run          # run anything due now
php artisan schedule:test         # pick a task and run it


# ---------- The permissions one ----------

# The scheduler runs as a user. That user must be able
# to write storage/logs and read .env.
#
# root running the scheduler while www-data runs the app
# creates log files nobody else can write to, and the
# failure appears somewhere else entirely.

* * * * * cd /var/www && sudo -u www-data php artisan schedule:run`,
      },
      keyTakeaways: [
        "<b>A task that takes longer than its interval overlaps with itself</b>, and each run makes the next slower.",
        "<b>`withoutOverlapping()` skips a run while one is already going</b>, which most real work needs.",
        "<b>Set the lock expiry from the work</b>, because a killed task can leave the lock and silently stop running.",
        "<b>Several servers each run the scheduler</b>, so a daily email is sent once per server.",
        "<b>`onOneServer()` lets the first server to take a shared lock run it</b>, and the others skip.",
        "<b>It requires a shared cache</b>: with a per-server cache, all of them still run and nothing warns you.",
        "<b>`withoutOverlapping()` and `onOneServer()` answer different questions</b>, and both are needed on several servers.",
        "<b>`schedule:run` checks once; `schedule:work` keeps checking</b>, and cron calls the first every minute.",
        "<b>`schedule:list` is the first thing to run when a task did not happen</b>, showing four of the five usual causes.",
        "<b>The fifth is a missing cron entry</b>, which on a fresh server is the answer more often than the code.",
        "The scheduler runs as a user, which must be able to write your logs and read your `.env`.",
      ],
      commonMistakes: [
        "<b>Scheduling a long task hourly with no overlap guard.</b> Three copies compete and each makes the next slower.",
        "<b>Setting no lock expiry.</b> A killed task leaves the lock and the schedule silently stops for a day.",
        "<b>Deploying to several servers without `onOneServer()`.</b> Every customer email is sent once per server.",
        "<b>Using `onOneServer()` with a file cache.</b> Each server takes its own lock, so all of them run.",
        "<b>Debugging a missing task in the code first.</b> Check `schedule:list`, then check the crontab.",
      ],
      quiz: [
        {
          question: "What does `withoutOverlapping()` prevent?",
          options: [
            "Two servers running the task",
            "A new run starting while a previous run of the same task is still going",
            "The task failing",
            "The task running at the wrong time",
          ],
          correctIndex: 1,
          explanation: "Essential for anything of unpredictable duration.",
        },
        {
          question: "What does `onOneServer()` require to work?",
          options: [
            "A queue worker",
            "A cache shared between the servers, such as Redis",
            "A database lock table",
            "Nothing",
          ],
          correctIndex: 1,
          explanation: "With a per-server cache, each takes its own lock and all still run.",
        },
        {
          question: "What is the difference between `schedule:run` and `schedule:work`?",
          options: [
            "None",
            "`run` checks once and exits; `work` keeps checking continuously",
            "`work` is for production",
            "`run` only lists tasks",
          ],
          correctIndex: 1,
          explanation: "Cron calls `schedule:run` every minute.",
        },
        {
          question: "A scheduled task did not run. What should you check first?",
          options: [
            "The queue workers",
            "`schedule:list`, then whether the cron entry exists at all",
            "The database",
            "The job class",
          ],
          correctIndex: 1,
          explanation: "It shows registration, frequency, timezone and environment constraints in one look.",
        },
      ],
    },
    {
      id: "mail",
      title: "Mail — mailables, Markdown & attachments",
      durationMinutes: 11,
      explanation: "Sending email, and the parts of it that are not obvious.\n\n---\n\n### 1. Basic — a mailable\n\n```text\napplication → Mailable → transport → provider → recipient\n```\n\n```bash\nphp artisan make:mail WelcomeEmail\n```\n\n<b>A mailable is a class representing one email:</b>\n\n```text\nsubject · content · view · data · attachments\n```\n\n```php\nMail::to($user)->send(new WelcomeEmail($user));\n```\n\nWhich reads well, and hides something worth knowing: <b>that line talks to an SMTP server during your request.</b> A slow mail provider is a slow page, and a mail provider that is down is a failed request for something that had nothing to do with mail.\n\n```php\nclass WelcomeEmail extends Mailable implements ShouldQueue\n{\n}\n```\n\n<b>Almost every mailable should be queued.</b> The exception is one the user is explicitly waiting for confirmation of, and even then the queue is usually right.\n\n---\n\n### 2. Intermediate — Markdown mail\n\nEmail HTML is not web HTML. Clients strip stylesheets, ignore flexbox, and require tables for layout, and the result has to survive Outlook, Gmail and a phone.\n\n<b>Markdown mailables give you components that already handle that:</b>\n\n```text\nMailable → Markdown → HTML email\n```\n\n```blade\n<x-mail::message>\n# Welcome, {{ $user->name }}\n\nThanks for joining.\n\n<x-mail::button :url=\"$url\">\nGet started\n</x-mail::button>\n</x-mail::message>\n```\n\n```text\nbutton · panel · table · subcopy\n```\n\n<b>Which is the difference between writing an email and writing email HTML.</b> The components are publishable if you need to restyle them, and the fallback plain-text version is generated for you.\n\nOne detail: <b>a mailable can define a plain-text version</b>, and some clients and filters prefer one. Markdown gives you it automatically; a hand-written HTML mailable does not.\n\n---\n\n### 3. Advanced — attachments, and their limits\n\n```text\nInvoice → PDF → attachment\n```\n\n```php\npublic function attachments(): array\n{\n    return [\n        Attachment::fromStorageDisk('s3', $this->invoice->pdf_path)\n            ->as('invoice.pdf')\n            ->withMime('application/pdf'),\n    ];\n}\n```\n\n<b>And attachments are where email gets awkward.</b>\n\n```text\nsize      most providers reject over ~10–25 MB\nencoding  base64 adds about a third to the size\nspam      attachments raise the odds of being filtered\nmemory    the file is read into the message\n```\n\nSo the honest guidance: <b>attach small things, and link to large ones.</b> A signed temporary URL from Day 22 is better than a 20 MB attachment in every way, including that you can revoke it and see whether it was downloaded.\n\n<b>Inline images</b> are the other kind:\n\n```blade\n<img src=\"{{ $message->embed($pathToLogo) }}\">\n```\n\nWhich embeds the image in the message rather than linking to it. That matters because <b>most clients block remote images by default</b>, so a linked logo is an empty box until the reader clicks \"show images\". Embedding it costs message size and gains a header that renders.\n\nTwo last practical notes.\n\n<b>A queued mailable serialises its constructor</b>, exactly like a job. Passing a model passes an id, and the mail is rendered against the state when it sends.\n\n<b>And `Mail::to()` accepts anything with an email</b>: a user, a collection of users, or a bare address. Sending to a collection sends one message per recipient, which is what you want; putting fifty addresses in one `to()` shows all fifty to each of them.\n\nQueueing can also be decided at the call site rather than on the class:\n\n```php\nMail::to($user)->queue(new WelcomeEmail($user));\nMail::to($user)->later(now()->addHours(3), new OnboardingTip($user));\n```\n\n<b>`later()` is the one worth remembering</b>, because delayed mail is a whole category of feature: the tip three hours after signup, the reminder the day before the due date, the nudge a week after an abandoned draft. `ShouldQueue` on the class cannot express any of those.",
      diagram: `A mailable

  application → Mailable → transport → provider → recipient

    php artisan make:mail WelcomeEmail

    subject · content · view · data · attachments

    Mail::to(\$user)->send(new WelcomeEmail(\$user));

  ⚠️  That line talks to an SMTP server DURING your
      request. A slow provider is a slow page; a provider
      that is down is a failed request for something
      unrelated to mail.

    class WelcomeEmail extends Mailable implements ShouldQueue

  Almost every mailable should be queued.


Markdown mail

  Email HTML is not web HTML. Clients strip stylesheets,
  ignore flexbox, and want tables for layout — and the
  result has to survive Outlook, Gmail and a phone.

    Mailable → Markdown → HTML email

    <x-mail::message>
    # Welcome
    <x-mail::button :url="\$url">Get started</x-mail::button>
    </x-mail::message>

    button · panel · table · subcopy

  The difference between writing an EMAIL and writing
  email HTML. The components are publishable, and the
  plain-text version is generated for you — which a
  hand-written HTML mailable does not give you, and
  some clients and filters prefer.


Attachments

    Invoice → PDF → attachment

    Attachment::fromStorageDisk('s3', \$path)->as('invoice.pdf')

  Where email gets awkward:

    size      most providers reject over ~10–25 MB
    encoding  base64 adds about a third
    spam      attachments raise filtering odds
    memory    the file is read into the message

  So: attach small things, LINK to large ones.

  A signed temporary URL from Day 22 beats a 20 MB
  attachment in every way — including that you can
  revoke it and see whether it was downloaded.


Inline images

    <img src="{{ \$message->embed(\$pathToLogo) }}">

  Embeds the image rather than linking it.

  ⚠️  Most clients BLOCK remote images by default, so a
      linked logo is an empty box until the reader clicks
      "show images". Embedding costs size and gains a
      header that renders.


Two last notes

  A queued mailable serialises its constructor, exactly
  like a job. A model becomes an id, and the mail is
  rendered against the state when it SENDS.

  Mail::to() accepts a user, a collection, or a bare
  address. A collection sends one message PER recipient
  — which is what you want. Fifty addresses in one to()
  shows all fifty to each of them.`,
      codeExample: {
        title: "A queued, Markdown mailable with an attachment",
        code: `<?php
// php artisan make:mail InvoicePaid --markdown=mail.invoices.paid

namespace App\\Mail;

use App\\Models\\Invoice;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Mail\\Mailable;
use Illuminate\\Mail\\Mailables\\Attachment;
use Illuminate\\Mail\\Mailables\\Content;
use Illuminate\\Mail\\Mailables\\Envelope;

// Queued: this otherwise talks to an SMTP server during
// the request.
class InvoicePaid extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    // Serialised like a job: the invoice becomes an id,
    // and the mail renders against the state when it sends.
    public function __construct(public Invoice $invoice) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Invoice {$this->invoice->number} paid",

            // Defaults to MAIL_FROM_ADDRESS / MAIL_FROM_NAME.
            // Override per mailable when one message should
            // come from somewhere else — billing, support:
            from: new Address('billing@example.com', 'InvoiceHub Billing'),

            replyTo: [config('mail.support')],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.invoices.paid',
            with: ['invoice' => $this->invoice],
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromStorageDisk('s3', $this->invoice->pdf_path)
                ->as("invoice-{$this->invoice->number}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
?>

{{-- resources/views/mail/invoices/paid.blade.php --}}

<x-mail::message>
# Invoice {{ $invoice->number }} paid

Thank you. We received {{ $invoice->total->format() }} on
{{ $invoice->paid_at->format('j F Y') }}.

<x-mail::panel>
The PDF is attached for your records.
</x-mail::panel>

<x-mail::button :url="route('invoices.show', $invoice)">
View invoice
</x-mail::button>

<x-mail::subcopy>
Questions? Just reply to this email.
</x-mail::subcopy>
</x-mail::message>

{{-- Components that already survive Outlook, Gmail and a
     phone — and a plain-text version generated for you. --}}


<?php
// ---------- Sending ----------

Mail::to($invoice->customer)->send(new InvoicePaid($invoice));

Mail::to($user)
    ->cc($accountant)
    ->bcc(config('mail.archive'))
    ->send(new InvoicePaid($invoice));

// ✓ One message per recipient.
Mail::to($team->members)->send(new WeeklyDigest());

// ❌ Every recipient sees all fifty addresses.
Mail::to($fiftyAddresses)->send(new Announcement());


<?php
// ---------- Attach small, link large ----------

// ❌ 20 MB: likely rejected, likely filtered, and base64
//    makes it about 27 MB on the wire.
Attachment::fromStorageDisk('s3', $export->path);
Attachment::fromPath(storage_path('app/terms.pdf'));   // a local path
Attachment::fromData(fn () => $pdfBytes, 'invoice.pdf'); // generated in memory

// ✓ A signed temporary URL from Day 22. Revocable, and
//   you can see whether it was downloaded.
'downloadUrl' => Storage::disk('s3')->temporaryUrl(
    $export->path,
    now()->addDays(7),
),


{{-- ---------- Inline images ---------- --}}

{{-- Most clients block remote images, so a linked logo
     is an empty box until "show images" is clicked. --}}
<img src="{{ $message->embed(public_path('logo.png')) }}"
     alt="InvoiceHub" width="120">`,
      },
      keyTakeaways: [
        "<b>A mailable is a class representing one email</b>, holding its subject, content, data and attachments.",
        "<b>`Mail::send()` talks to an SMTP server during the request</b>, so a slow provider is a slow page.",
        "<b>Almost every mailable should implement `ShouldQueue`.</b>",
        "<b>Email HTML is not web HTML</b>: clients strip stylesheets and want tables, across Outlook, Gmail and phones.",
        "<b>Markdown mailables give you components that already survive that</b>, plus a generated plain-text version.",
        "<b>Attachments are limited by size, encoding, spam filtering and memory</b>, so attach small things and link to large ones.",
        "<b>A signed temporary URL beats a large attachment</b>, and can be revoked and tracked.",
        "<b>Most clients block remote images</b>, so a logo should be embedded rather than linked.",
        "<b>A queued mailable serialises its constructor</b>, so a model becomes an id and renders against later state.",
        "<b>`Mail::to()` on a collection sends one message per recipient</b>, where fifty addresses in one `to()` exposes them all.",
      ],
      commonMistakes: [
        "<b>Sending mail synchronously in a request.</b> A slow or failing provider breaks a page about something else.",
        "<b>Hand-writing email HTML.</b> Markdown components already handle the clients you have to support.",
        "<b>Attaching a large export.</b> It may be rejected, filtered, or read entirely into memory.",
        "<b>Linking to a logo.</b> Most clients block remote images and the reader sees an empty box.",
        "<b>Putting many addresses in one `to()`.</b> Every recipient sees the full list.",
      ],
      quiz: [
        {
          question: "Why should most mailables implement `ShouldQueue`?",
          options: [
            "For retries only",
            "Otherwise the request talks to an SMTP server, so a slow provider is a slow page",
            "Laravel requires it",
            "To attach files",
          ],
          correctIndex: 1,
          explanation: "A provider outage otherwise fails a request about something else.",
        },
        {
          question: "What do Markdown mailables give you?",
          options: [
            "Faster sending",
            "Components that survive real email clients, plus a generated plain-text version",
            "Automatic attachments",
            "Localisation",
          ],
          correctIndex: 1,
          explanation: "Email HTML is not web HTML, and the components already handle that.",
        },
        {
          question: "What should you do with a large export?",
          options: [
            "Attach it",
            "Link to it with a signed temporary URL",
            "Split it across several emails",
            "Compress and attach it",
          ],
          correctIndex: 1,
          explanation: "It is revocable, trackable, and will not be rejected or filtered.",
        },
        {
          question: "Why embed a logo rather than linking it?",
          options: [
            "It loads faster",
            "Most email clients block remote images, so a linked logo is an empty box",
            "Links are stripped",
            "It reduces message size",
          ],
          correctIndex: 1,
          explanation: "Embedding costs size and gains a header that actually renders.",
        },
      ],
    },
    {
      id: "mail-drivers-and-testing",
      title: "Mail drivers, previewing & testing",
      durationMinutes: 11,
      explanation: "Where mail actually goes, and how to see it before a customer does.\n\n---\n\n### 1. Basic — transports\n\n```text\nLaravel Mail\n     ↓\ntransport abstraction\n     ↓\nSMTP · SES · Postmark · Resend · log\n```\n\n<b>Your application code does not change when the provider does</b>, which is the same abstraction argument as the filesystem on Day 22. `Mail::to($user)->send(...)` is the same line whichever transport is configured.\n\nAnd the one that matters most while you work:\n\n```text\nMail → log\n```\n\n<b>The `log` driver writes the email to your log file instead of sending it.</b> Which means you can build and re-run a registration flow forty times without emailing anybody, and read exactly what would have gone out.\n\nThere is a better local option than the log too: a local mail catcher that gives you an inbox in the browser, so you see the rendered HTML rather than a wall of it in a log file.\n\nLaravel 13 also adds SES tenant support, for multi-tenant systems that need per-tenant sending configuration and isolation.\n\n---\n\n### 2. Intermediate — previewing\n\nEmail is the one part of an application you cannot see while building it, which is why it is the part most often broken.\n\n<b>A mailable can be returned from a route</b>, and Laravel renders it in the browser:\n\n```php\nRoute::get('/preview/invoice', fn () => new InvoicePaid(Invoice::first()));\n```\n\n```text\nbuild → preview → check the HTML\n      → check it on a phone → test → production\n```\n\nWhich takes ten seconds and catches the things that are otherwise found by a customer: a broken layout, a variable that renders as nothing, a link pointing at `localhost`.\n\n<b>That last one is worth naming.</b> A mailable built with `route()` uses `APP_URL`, so an email sent from a queue worker with the wrong `APP_URL` contains links nobody outside your machine can open. It is invisible locally, because your links work.\n\n---\n\n### 3. Advanced — testing\n\nA test that actually sends email is slow, flaky, costs money, and eventually emails a real person from a seeded address.\n\n```php\nMail::fake();\n```\n\n```text\nMail::fake() → run the code → assert what was sent\n```\n\nAnd the assertions are the point:\n\n```php\nMail::assertSent(InvoicePaid::class);\n\nMail::assertSent(InvoicePaid::class, fn ($mail) =>\n    $mail->hasTo($customer->email) && $mail->invoice->is($invoice));\n\nMail::assertNotSent(InvoicePaid::class);\nMail::assertSentCount(1);\nMail::assertQueued(WelcomeEmail::class);\n```\n\n<b>`assertNotSent()` is the underrated one.</b> \"A draft invoice does not email the customer\" is a rule worth a test, and it is exactly the kind that breaks quietly when somebody moves a dispatch.\n\nTwo details.\n\n<b>A queued mailable is asserted with `assertQueued()`, not `assertSent()`</b>, and getting that wrong produces a passing-looking failure that says nothing was sent when it was queued perfectly.\n\n<b>And `Mail::fake()` stops mail actually being sent</b>, which means anything the mailable would have done — rendering, attaching, hitting storage — does not happen. A mailable that throws while rendering passes a faked test and fails in production. <b>Rendering it in a test is what catches that:</b>\n\n```php\n(new InvoicePaid($invoice))->render();\n```\n\nOne assertion that the email can be built at all, which is the failure mode a fake cannot see.",
      diagram: `Transports

    Laravel Mail
         ↓
    transport abstraction
         ↓
    SMTP · SES · Postmark · Resend · log

  Your code does not change when the provider does —
  the same argument as the filesystem on Day 22.

  And the one that matters while you work:

    Mail → log

  The log driver writes the email to your log file
  instead of sending it. Build and re-run a registration
  flow forty times without emailing anybody, and read
  exactly what would have gone out.

  Better still locally: a mail catcher, giving you an
  inbox in the browser so you see the rendered HTML
  rather than a wall of it in a log.

  Laravel 13 adds SES tenant support, for multi-tenant
  systems needing per-tenant sending configuration.


Previewing

  Email is the one part of an application you cannot see
  while building it — which is why it is the part most
  often broken.

    Route::get('/preview/invoice',
        fn () => new InvoicePaid(Invoice::first()));

    build → preview → check the HTML
          → check it on a phone → test → production

  Ten seconds, and it catches what a customer otherwise
  finds: a broken layout, a variable rendering as
  nothing, a link pointing at localhost.

  ⚠️  That last one. A mailable built with route() uses
      APP_URL, so mail sent from a worker with the wrong
      APP_URL contains links nobody outside your machine
      can open — and it is invisible locally, because
      your links work.


Testing

  A test that really sends email is slow, flaky, costs
  money, and eventually emails a real person from a
  seeded address.

    Mail::fake() → run the code → assert what was sent

    Mail::assertSent(InvoicePaid::class)
    Mail::assertSent(InvoicePaid::class, fn (\$mail) =>
        \$mail->hasTo(\$customer->email))
    Mail::assertNotSent(...)
    Mail::assertSentCount(1)
    Mail::assertQueued(...)

  assertNotSent() is the underrated one. "A draft invoice
  does not email the customer" is a rule worth a test,
  and exactly the kind that breaks quietly when somebody
  moves a dispatch.


Two details

  A QUEUED mailable is asserted with assertQueued(), not
  assertSent(). Getting that wrong produces a failure
  saying nothing was sent, when it was queued perfectly.

  ⚠️  Mail::fake() stops the mail being BUILT as well as
      sent. Rendering, attachments, storage access —
      none of it happens.

      A mailable that throws while rendering passes a
      faked test and fails in production.

      (new InvoicePaid(\$invoice))->render();

      One assertion that the email can be built at all,
      which is the failure a fake cannot see.`,
      codeExample: {
        title: "Local mail, previews and tests",
        code: `# ---------- Local: do not send anything ----------

# .env
MAIL_MAILER=log

# The email is written to storage/logs/laravel.log.
# Build a registration flow forty times without emailing
# anybody.

# Better: Mailpit, a local catcher with an inbox in the
# browser. Laravel Sail ships it; otherwise brew/docker.
MAIL_MAILER=smtp
MAIL_HOST=localhost
MAIL_PORT=1025


# ---------- Production SMTP ----------

MAIL_MAILER=smtp
MAIL_HOST=smtp.postmarkapp.com
MAIL_PORT=587
MAIL_USERNAME=your-token
MAIL_PASSWORD=your-token
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME="InvoiceHub"

# ⚠️ Gmail will not accept your account password here.
#    It needs an app password, with 2FA enabled on the
#    account — and Gmail is a poor choice for
#    transactional mail anyway: low limits, and your
#    deliverability is somebody else's reputation.


<?php
// config/mail.php

'mailers' => [
    'smtp'     => ['transport' => 'smtp',     /* ... */],
    'ses'      => ['transport' => 'ses'],
    'postmark' => ['transport' => 'postmark'],
    'resend'   => ['transport' => 'resend'],
    'log'      => ['transport' => 'log'],
    'array'    => ['transport' => 'array'],   // tests
],

// The same Mail::to(...)->send(...) line, whichever is
// configured.


<?php
// ---------- Previewing ----------

// routes/web.php

if (! app()->isProduction()) {
    Route::get('/preview/invoice-paid', function () {
        return new InvoicePaid(Invoice::latest()->first());
    });

    Route::get('/preview/welcome', function () {
        return new WelcomeEmail(User::latest()->first());
    });
}

// Ten seconds in a browser, and it catches a broken
// layout, a variable rendering as nothing, and a link
// pointing at localhost.


# ---------- The links-to-localhost one ----------

# A mailable built with route() uses APP_URL. A worker
# with the wrong APP_URL sends links nobody can open,
# and it is invisible locally because yours work.

APP_URL=https://invoicehub.example.com


<?php
// ---------- Testing ----------

use Illuminate\\Support\\Facades\\Mail;

it('emails the customer when an invoice is paid', function () {
    Mail::fake();

    $invoice = Invoice::factory()->create();

    $this->post("/invoices/{$invoice->id}/pay", ['amount' => 100]);

    Mail::assertSent(InvoicePaid::class, function ($mail) use ($invoice) {
        return $mail->hasTo($invoice->customer->email)
            && $mail->invoice->is($invoice);
    });
});

it('does not email the customer for a draft invoice', function () {
    Mail::fake();

    $invoice = Invoice::factory()->draft()->create();

    $this->post("/invoices/{$invoice->id}/send");

    // The underrated assertion. This rule breaks quietly
    // when somebody moves a dispatch.
    Mail::assertNotSent(InvoicePaid::class);
});


<?php
// ---------- Queued mailables ----------

// ❌ Reports that nothing was sent, when it was queued
//    perfectly.
Mail::assertSent(WelcomeEmail::class);

// ✓
Mail::assertQueued(WelcomeEmail::class);


<?php
// ---------- What a fake cannot catch ----------

// Mail::fake() stops the mailable being BUILT: no
// rendering, no attachments, no storage access.
//
// A mailable that throws while rendering passes this
// test and fails in production.

it('renders', function () {
    $invoice = Invoice::factory()->create();

    // No fake. Actually build it.
    expect((new InvoicePaid($invoice))->render())
        ->toContain($invoice->number);
});

// One assertion that the email can be built at all.`,
      },
      keyTakeaways: [
        "<b>Laravel abstracts the mail transport</b>, so switching provider does not change your code.",
        "<b>The `log` driver writes the email to your log instead of sending it</b>, which is what local development wants.",
        "A local mail catcher is better still, because you see the rendered HTML rather than a log dump.",
        "<b>Email is the part of an application you cannot see while building it</b>, and therefore the part most often broken.",
        "<b>Returning a mailable from a route renders it in the browser</b>, which catches layout and data problems in seconds.",
        "<b>A wrong `APP_URL` produces emails full of links nobody can open</b>, and it is invisible locally.",
        "<b>`Mail::fake()` makes tests fast, deterministic and free</b>, and stops a seeded address emailing a real person.",
        "<b>`assertNotSent()` is the underrated assertion</b>, because \"this must not send\" breaks quietly.",
        "<b>A queued mailable is asserted with `assertQueued()`</b>, and using `assertSent()` reports a failure that is not one.",
        "<b>A fake stops the mailable being built</b>, so render it in one test to catch a mailable that throws.",
      ],
      commonMistakes: [
        "<b>Testing against a real mail provider.</b> Slow, flaky, and eventually a real person receives a test email.",
        "<b>Never previewing an email.</b> The broken layout is found by a customer.",
        "<b>Deploying with the wrong `APP_URL`.</b> Every link in every email points somewhere unreachable.",
        "<b>Using `assertSent()` on a queued mailable.</b> The test fails despite the code being correct.",
        "<b>Only ever faking mail.</b> A mailable that throws while rendering passes every test.",
      ],
      quiz: [
        {
          question: "What does the `log` mail driver do?",
          options: [
            "Sends the email and logs it",
            "Writes the email to the log instead of sending it",
            "Queues the email",
            "Sends only to admins",
          ],
          correctIndex: 1,
          explanation: "Which is what lets you re-run a flow without emailing anybody.",
        },
        {
          question: "Why does a wrong `APP_URL` matter for email?",
          options: [
            "Mail fails to send",
            "Links built with `route()` point somewhere nobody outside your machine can open",
            "The subject is wrong",
            "Attachments break",
          ],
          correctIndex: 1,
          explanation: "And it is invisible locally, because your own links work.",
        },
        {
          question: "How do you assert a queued mailable was sent?",
          options: [
            "`Mail::assertSent()`",
            "`Mail::assertQueued()`",
            "`Queue::assertPushed()` only",
            "You cannot",
          ],
          correctIndex: 1,
          explanation: "`assertSent()` reports a failure that is not one.",
        },
        {
          question: "What can `Mail::fake()` not catch?",
          options: [
            "The wrong recipient",
            "A mailable that throws while rendering, because a fake never builds it",
            "The wrong subject",
            "A missing attachment name",
          ],
          correctIndex: 1,
          explanation: "One test that actually calls `render()` covers it.",
        },
      ],
    },
    {
      id: "notifications",
      title: "Notifications & the whole architecture",
      durationMinutes: 13,
      explanation: "Mail is one way of telling somebody something. Notifications are the general case.\n\n---\n\n### 1. Basic — one message, several channels\n\n```text\n                Notification\n                     │\n        ┌────────────┼────────────┐\n        ▼            ▼            ▼\n       Mail       Database      Slack\n```\n\n```text\nMailable        one thing: email\nNotification    the message, and how it reaches somebody\n```\n\nWhich matters as soon as a message has more than one destination:\n\n```text\nInvoicePaid\n ├── email\n ├── the in-app bell\n └── the finance Slack channel\n```\n\nWith mailables that is three pieces of code that must agree. With a notification it is one class with a `via()` and three formatting methods.\n\n```php\npublic function via(object $notifiable): array\n{\n    return ['mail', 'database', 'slack'];\n}\n```\n\nTwo pieces of setup make that work, and both are easy to miss because the default `User` already has one of them. <b>The `Notifiable` trait</b> is what puts `notify()` and the notification relations on a model, so a `Team` or a `Client` needs it added. And <b>the database channel needs a table</b>:\n\n```bash\nphp artisan make:notifications-table\nphp artisan migrate\n```\n\nBeyond mail, database, Slack and broadcast, there is a `vonage` channel for SMS, and community packages for most things you would want.\n\n<b>And `via()` can decide per recipient</b>, which is the real payoff: a user's notification preferences become one method rather than conditionals everywhere.\n\n---\n\n### 2. Intermediate — the channels\n\n<b>Database notifications</b> are stored, not sent:\n\n```text\nnotifications\n ├── \"Your invoice was paid\"\n ├── \"New comment\"\n └── \"Your report is ready\"\n```\n\n```text\n🔔 3\n```\n\nWhich is what gives an application a bell with a count, a read state and a history. Nothing is delivered anywhere; the frontend queries them.\n\nReading them back:\n\n```php\n$user->unreadNotifications;      // and $user->readNotifications\n$notification->data['message'];  // whatever toDatabase() returned\n$notification->markAsRead();\n```\n\n<b>If `toDatabase()` is absent the channel falls back to `toArray()`</b>, which is worth knowing because it means one method can serve both.\n\nAnd they are ordinary rows, which means <b>something has to delete them</b>. A notifications table nobody prunes is a table that grows for the life of the application.\n\n<b>Broadcast notifications</b> push to the browser over a websocket:\n\n```text\nLaravel → broadcast → WebSocket → the UI updates\n```\n\nSo the bell increments without a refresh, and that is tomorrow's topic.\n\n<b>On-demand notifications</b> are for when there is no user:\n\n```php\nNotification::route('mail', 'ops@example.com')->notify(new BackupFailed());\n```\n\nUseful for administrators, alerting, and anywhere the recipient is an address rather than a model.\n\nAnd when the recipient <i>is</i> a model but the address is not where the channel expects, the model says so:\n\n```php\npublic function routeNotificationForMail(): string\n{\n    return $this->billing_contact_email;\n}\n```\n\n<b>Each channel looks for a `routeNotificationFor{Channel}` method</b> before falling back to its default, which is what lets a `Team` receive mail at a billing address that has nothing to do with any user.\n\n<b>Queued notifications</b> work exactly as queued mail:\n\n```text\nrequest → queue the notifications → response → workers send them\n```\n\nWhich matters more here, because a notification with three channels is three external calls.\n\n<b>And localization</b> connects straight back to Day 25:\n\n```php\n$user->notify((new InvoicePaid($invoice))->locale($user->locale));\n```\n\n```text\nUser A → en → English\nUser B → ja → Japanese\n```\n\nA notification sent from a queue worker has no request locale, so <b>if you do not set it, everybody gets the application default</b>. That is the bug where translations work perfectly on screen and every email is in English.\n\n---\n\n### 3. Advanced — the whole picture\n\nThree days now fit together:\n\n```text\n                 business action\n                       │\n                       ▼\n                     Event\n                       │\n           ┌───────────┼───────────┐\n           ▼           ▼           ▼\n       Listener    Listener    Listener\n           │           │           │\n           ▼           ▼           ▼\n         Queue       Queue       Queue\n           │           │           │\n           ▼           ▼           ▼\n         Mail    Notification   other work\n```\n\nand separately:\n\n```text\nScheduler → dispatch a job → Queue → Worker\n```\n\n<b>Both end in the same place and start from completely different reasons</b>, and that difference is the thing to take from today.\n\nSo the question is not \"how do I send an email\". It is:\n\n> <b>Should this happen during the request, through a queued listener, as a notification, or from a scheduled job?</b>\n\n```text\nsomething happened, and several things\n  should follow                          →  an event\n\nthe user should not wait for it          →  a queued listener\n\none message, several destinations,\n  per-user preferences                   →  a notification\n\nit happens because of the time,\n  not because of an action                →  the scheduler\n\nthe caller needs the result               →  none of these.\n                                             call the method.\n```\n\nA welcome email and a nightly summary both end as mail. <b>One is event-driven and one is time-driven, and building the second as the first is how a report ends up being sent whenever somebody logs in.</b>",
      diagram: `One message, several channels

                  Notification
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
         Mail       Database      Slack

    Mailable       one thing: email
    Notification   the message, and how it reaches somebody

  Which matters as soon as there is more than one
  destination:

    InvoicePaid
     ├── email
     ├── the in-app bell
     └── the finance Slack channel

  Three mailables must agree. One notification has a
  via() and three formatting methods.

  And via() can decide PER RECIPIENT — so a user's
  notification preferences become one method rather
  than conditionals everywhere.


The channels

  database    stored, not sent

    notifications
     ├── "Your invoice was paid"
     ├── "New comment"
     └── "Your report is ready"

    🔔 3

    A bell with a count, a read state and a history.
    Nothing is delivered; the frontend queries them.

  broadcast   Laravel → WebSocket → the UI updates
              The bell increments with no refresh.
              Tomorrow's topic.

  on-demand   when there is no user

    Notification::route('mail', 'ops@example.com')
        ->notify(new BackupFailed());

  queued      request → queue them → response
                      → workers send them

    Matters more here: three channels is three
    external calls.

  localised   Day 25, connected

    \$user->notify((new InvoicePaid(\$i))->locale(\$user->locale))

      User A → en → English
      User B → ja → Japanese

    ⚠️  A notification sent from a WORKER has no request
        locale. Without setting it, everybody gets the
        application default — the bug where the screen
        translates perfectly and every email is English.


The whole picture

                   business action
                         │
                         ▼
                       Event
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
         Listener    Listener    Listener
             │           │           │
             ▼           ▼           ▼
           Queue       Queue       Queue
             │           │           │
             ▼           ▼           ▼
           Mail    Notification   other work

  and separately:

    Scheduler → dispatch a job → Queue → Worker

  Both end in the same place, from completely different
  reasons. That difference is the thing to take away.


The question

  Not "how do I send an email", but:

    something happened, and several things
      should follow                        →  an event

    the user should not wait                →  a queued listener

    one message, several destinations,
      per-user preferences                  →  a notification

    it happens because of the TIME,
      not because of an action               →  the scheduler

    the caller needs the result              →  none of these.
                                                call the method.


  A welcome email and a nightly summary both end as mail.
  One is event-driven and one is time-driven, and
  building the second as the first is how a report ends
  up being sent whenever somebody logs in.`,
      codeExample: {
        title: "One notification, three channels",
        code: `<?php
// ---------- Two things that must exist first ----------

// 1. The trait. It is what puts notify() and the
//    notification relations on the model — and it is on
//    the default User, which is why nobody notices it
//    until they add notifications to a Team or a Client.
use Illuminate\\Notifications\\Notifiable;

class User extends Authenticatable
{
    use Notifiable;
}

// 2. The table the database channel writes to:
//    php artisan make:notifications-table
//    php artisan migrate


<?php
// php artisan make:notification InvoicePaid

namespace App\\Notifications;

use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Notifications\\Messages\\MailMessage;
use Illuminate\\Notifications\\Notification;

class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Invoice $invoice) {}

    // Per recipient: preferences become one method rather
    // than conditionals everywhere.
    public function via(object $notifiable): array
    {
        return array_filter([
            'database',
            $notifiable->wants_email ? 'mail' : null,
            $notifiable->slack_webhook ? 'slack' : null,
        ]);
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Invoice {$this->invoice->number} paid")
            ->greeting("Hello {$notifiable->name},")
            ->line("We received {$this->invoice->total->format()}.")
            ->action('View invoice', route('invoices.show', $this->invoice));
    }

    // Stored, not sent. This is what the bell reads.
    // Omit it and the database channel falls back to
    // toArray(), which is fine when both want the same
    // payload — define toArray() and skip this one.
    public function toDatabase(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'message'    => "Invoice {$this->invoice->number} was paid",
        ];
    }

    public function toSlack(object $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->text("Invoice {$this->invoice->number} paid");
    }
}


<?php
// ---------- Sending ----------

$user->notify(new InvoicePaid($invoice));

Notification::send($team->members, new InvoicePaid($invoice));

// No user: an address, a webhook, a phone number.
Notification::route('mail', 'ops@example.com')
    ->route('slack', config('services.slack.ops'))
    ->notify(new BackupFailed());


<?php
// ---------- Localisation ----------

// ⚠️ A queued notification has no request locale, so
//    without this everybody gets the application default:
//    the screen translates and every email is English.
$user->notify(
    (new InvoicePaid($invoice))->locale($user->locale)
);

// Or, once, for the whole notification class:
public function __construct(public Invoice $invoice)
{
    $this->locale = $invoice->customer->locale;
}


<?php
// ---------- The bell ----------

// The database channel writes to the notifications table.

$user->unreadNotifications->count();     // 🔔 3

$user->notifications()->latest()->take(10)->get();
$user->readNotifications;                // the other half

foreach ($user->unreadNotifications as $notification) {
    // The array you returned from toDatabase()/toArray()
    echo $notification->data['message'];
    echo $notification->created_at->diffForHumans();
}

$notification->markAsRead();
$user->unreadNotifications->markAsRead();

// And they are ordinary rows, so they delete like rows.
// Something has to, or this table grows forever:
$user->notifications()->where('created_at', '<', now()->subMonths(3))->delete();


<?php
// ---------- When the address is not on the model ----------

class Team extends Model
{
    use Notifiable;

    // The mail channel looks for an email column. When
    // there is not one, say where to send instead:
    public function routeNotificationForMail(): string
    {
        return $this->billing_contact_email;
    }

    public function routeNotificationForVonage(): string
    {
        return $this->owner->phone;
    }
}

$user->unreadNotifications->markAsRead();

// Nothing is delivered anywhere. The frontend queries it,
// which is what gives you a count, a read state and a
// history.


<?php
// ---------- Where each belongs ----------

// Something happened, and several things should follow.
UserRegistered::dispatch($user);

// The user should not wait.
class SendWelcomeEmail implements ShouldQueue {}

// One message, several destinations, per-user preferences.
$user->notify(new InvoicePaid($invoice));

// It happens because of the time.
Schedule::job(SendDailySummary::class)->dailyAt('02:00');

// The caller needs the result: none of the above.
$total = $this->calculator->total($invoice);


// A welcome email and a nightly summary both end as mail.
// One is event-driven, one is time-driven, and building
// the second as the first is how a report gets sent
// whenever somebody logs in.`,
      },
      keyTakeaways: [
        "<b>A mailable is one thing: email. A notification is a message plus how it reaches somebody.</b>",
        "<b>One notification can go to mail, the database, Slack and broadcast</b>, from one class with a `via()`.",
        "<b>`via()` can decide per recipient</b>, which turns user notification preferences into one method.",
        "<b>Database notifications are stored rather than sent</b>, giving you a bell with a count, a read state and history.",
        "<b>Broadcast notifications push to the browser</b> so the bell updates without a refresh.",
        "<b>On-demand notifications go to an address or webhook</b> when there is no user model.",
        "<b>The `Notifiable` trait is what gives a model `notify()`</b>, and a `Team` or `Client` needs it added explicitly.",
        "<b>The database channel needs its table</b>: `make:notifications-table` then `migrate`.",
        "<b>`toArray()` is the database channel's fallback</b> when `toDatabase()` is absent, so one method can serve both.",
        "<b>`routeNotificationForMail()` overrides where a channel sends</b>, for models with no `email` column.",
        "<b>Read them back with `unreadNotifications`, `readNotifications` and `$notification->data`</b>, and prune them, or the table grows forever.",
        "<b>Queued notifications matter more than queued mail</b>, because three channels is three external calls.",
        "<b>A notification sent from a worker has no request locale</b>, so it must be set explicitly.",
        "<b>Events, queues, notifications and the scheduler all end in the same place for different reasons.</b>",
        "<b>Ask whether something is event-driven, time-driven, multi-channel, or simply a method call.</b>",
        "<b>Building a time-driven task as an event-driven one</b> is how a nightly report gets sent whenever somebody logs in.",
      ],
      commonMistakes: [
        "<b>Adding notifications to a model without `Notifiable`.</b> `notify()` simply does not exist on it.",
        "<b>Never pruning the notifications table.</b> It grows for the life of the application.",
        "<b>Writing three mailables for one message with three destinations.</b> They drift, and only one gets updated.",
        "<b>Sending notifications synchronously.</b> Three channels is three external calls in the request.",
        "<b>Forgetting `->locale()` on a queued notification.</b> The interface translates and every email is in English.",
        "<b>Using a notification when only email is involved and always will be.</b> A mailable says it more directly.",
        "<b>Triggering time-based work from an event.</b> The nightly summary now depends on somebody logging in.",
      ],
      quiz: [
        {
          question: "What is the difference between a mailable and a notification?",
          options: [
            "None",
            "A mailable is email; a notification is a message plus the channels it reaches somebody through",
            "Notifications cannot be queued",
            "Mailables support more formatting",
          ],
          correctIndex: 1,
          explanation: "Which matters as soon as a message has more than one destination.",
        },
        {
          question: "What does the database notification channel do?",
          options: [
            "Emails and logs it",
            "Stores the notification so the application can show a bell with a count and read state",
            "Broadcasts it",
            "Queues it",
          ],
          correctIndex: 1,
          explanation: "Nothing is delivered; the frontend queries the table.",
        },
        {
          question: "Why does a queued notification need `->locale()` set?",
          options: [
            "For formatting",
            "A worker has no request locale, so everybody would get the application default",
            "It is required by the mail driver",
            "It is not needed",
          ],
          correctIndex: 1,
          explanation: "The bug where the interface translates and every email is English.",
        },
        {
          question: "A nightly summary email. Which mechanism?",
          options: [
            "An event with a queued listener",
            "The scheduler dispatching a job",
            "A notification on login",
            "A direct call in a controller",
          ],
          correctIndex: 1,
          explanation: "It happens because of the time, not because of an action.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the difference between a command and an event?",
      options: [
        "None",
        "A command says \"do this\" and has one handler; an event says \"this happened\" and can have many",
        "Commands are queued",
        "Events return values",
      ],
      correctIndex: 1,
      explanation: "Which is why events are named as facts, in the past tense.",
    },
    {
      question: "When is an event the wrong tool?",
      options: [
        "When there are several consequences",
        "When the caller needs the result of the work",
        "When consequences change over time",
        "When the listener is slow",
      ],
      correctIndex: 1,
      explanation: "A listener's return value goes nowhere; that is a method call.",
    },
    {
      question: "Do listeners run asynchronously by default?",
      options: [
        "Yes",
        "No; they run inline unless the listener implements `ShouldQueue`",
        "Only in production",
        "Only when a worker is running",
      ],
      correctIndex: 1,
      explanation: "An event decouples; the queue is what defers.",
    },
    {
      question: "Why can a queued listener fail to find a model that was just created?",
      options: [
        "The queue is slow",
        "The event fired inside a transaction that had not committed yet",
        "The model was not serialised",
        "The worker cached it",
      ],
      correctIndex: 1,
      explanation: "`ShouldQueueAfterCommit` waits for the commit.",
    },
    {
      question: "Why not send a welcome email from Eloquent's `created` event?",
      options: [
        "It is slower",
        "Rows are also created by imports, seeders and factories, and `created` cannot tell them apart",
        "Model events cannot send mail",
        "It fires twice",
      ],
      correctIndex: 1,
      explanation: "Registration is a business fact; row creation is not.",
    },
    {
      question: "Why schedule a job rather than doing the work in the schedule?",
      options: [
        "Jobs are faster",
        "A long-running task blocks the scheduler, so nothing else runs on time",
        "Closures cannot be scheduled",
        "For retries",
      ],
      correctIndex: 1,
      explanation: "The scheduler decides when; a worker does the work.",
    },
    {
      question: "What does `withoutOverlapping()` prevent?",
      options: [
        "Two servers running the task",
        "A new run starting while a previous run of the same task is still going",
        "The task failing",
        "Timezone problems",
      ],
      correctIndex: 1,
      explanation: "`onOneServer()` is the one that handles several servers.",
    },
    {
      question: "What does `onOneServer()` require?",
      options: [
        "A queue worker",
        "A cache shared between the servers, such as Redis",
        "A lock table",
        "Nothing",
      ],
      correctIndex: 1,
      explanation: "With a per-server cache each takes its own lock and all of them still run.",
    },
    {
      question: "A scheduled task did not run. What do you check first?",
      options: [
        "The job class",
        "`schedule:list`, then whether the cron entry exists at all",
        "The queue",
        "The database",
      ],
      correctIndex: 1,
      explanation: "It shows registration, frequency, timezone and environment constraints at a glance.",
    },
    {
      question: "Why should most mailables be queued?",
      options: [
        "For retries",
        "Otherwise the request talks to an SMTP server, so a slow provider is a slow page",
        "Laravel requires it",
        "To allow attachments",
      ],
      correctIndex: 1,
      explanation: "A provider outage otherwise fails a request about something else.",
    },
    {
      question: "What should you do with a large export rather than attaching it?",
      options: [
        "Compress it",
        "Link to it with a signed temporary URL",
        "Split it across emails",
        "Send it as plain text",
      ],
      correctIndex: 1,
      explanation: "Revocable, trackable, and it will not be rejected or filtered.",
    },
    {
      question: "What can `Mail::fake()` not catch?",
      options: [
        "The wrong recipient",
        "A mailable that throws while rendering, because a fake never builds it",
        "The wrong subject",
        "A missing attachment",
      ],
      correctIndex: 1,
      explanation: "One test that calls `render()` covers it.",
    },
    {
      question: "What is the difference between a mailable and a notification?",
      options: [
        "None",
        "A mailable is email; a notification is a message plus the channels it reaches somebody through",
        "Notifications cannot be queued",
        "Mailables cannot be localised",
      ],
      correctIndex: 1,
      explanation: "One class with a `via()` instead of three that must agree.",
    },
    {
      question: "A nightly summary email. Which mechanism?",
      options: [
        "An event with a queued listener",
        "The scheduler dispatching a job",
        "A notification triggered on login",
        "A direct call in a controller",
      ],
      correctIndex: 1,
      explanation: "It happens because of the time, not because of an action.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Decouple InvoiceHub's side effects into events and listeners, then add a nightly summary that can never overlap or double-send.",
    brief: "InvoiceHub's controllers do everything. Marking an invoice paid updates the record, sends an email, writes an audit row, posts to Slack and refreshes a cache, all in one method that nobody wants to touch.\n\nToday that becomes an event and four listeners. And the point is not that events are tidier: <b>it is that adding a fifth consequence should not require opening the controller.</b> You will prove that at the end by adding one.\n\nThe second half is the nightly summary, and its acceptance criteria are the interesting ones. It must not overlap with itself, must not run twice if you had two servers, must not email real customers from staging, and must tell somebody when it fails. Every one of those is a line, and every one of them is a real incident when it is missing.\n\nRun a queue worker throughout. Several things today only behave correctly when something is actually processing the queue.",
    steps: [
      "Find the fattest controller method in InvoiceHub, copy it into `NOTES.md` untouched, and list every side effect it performs.",
      "Create an `InvoicePaid` event carrying the invoice. Name it as a fact and write one sentence explaining why it is not called `SendInvoicePaidEmail`.",
      "Move each side effect into its own listener. Confirm the controller is down to the state change and one dispatch.",
      "Queue the slow listeners and leave the instant ones inline. Write down which is which and why.",
      "Dispatch the event inside a transaction, with a queued listener that reads the invoice. Under a worker, try to make it fail by committing late, then fix it with `ShouldQueueAfterCommit`.",
      "Run `php artisan event:list` and check that everything you expect is registered. Then decide whether this event should use manual registration instead, and justify the answer.",
      "Add a fifth consequence, such as a webhook to a partner, without opening the controller. That is the acceptance test for the first half.",
      "Convert `InvoicePaid` from a mailable into a notification with `mail`, `database` and one more channel. Add a `via()` that respects a per-user preference column.",
      "Build a notification bell that reads `unreadNotifications` and shows a count. Mark one read and confirm the count changes.",
      "Send the notification to a user whose locale is not English and confirm the email is in their language. Then remove the `->locale()` call and confirm what happens.",
      "Preview the invoice email by returning the mailable from a route. Check it in a browser and on a narrow window, and fix whatever is broken.",
      "Deliberately set `APP_URL` wrongly, queue the email, and look at the links in the log. Then fix it, and write down why this is invisible locally.",
      "Write three mail tests: it sends on payment, it does not send for a draft, and the mailable renders. Note which of the three a `Mail::fake()` alone could not have caught.",
      "Now the scheduler. Create `SendDailySummary` as a queued job and schedule it at 02:00 with an explicit timezone.",
      "Add `withoutOverlapping()` with an expiry set from the work. Then make the job sleep for longer than its interval and observe what happens with and without it.",
      "Add `onOneServer()` and `environments(['production'])`. Explain in a comment what each one prevents, with the specific incident in mind.",
      "Add an `onFailure()` hook that alerts somebody. Then make the job throw and confirm the alert fires.",
      "Run `php artisan schedule:list` and check the next run time is what you expect in your timezone. Then run `schedule:run` and watch the job reach the queue and the worker.",
      "Finally, list every email InvoiceHub sends and classify each one: event-driven, time-driven, or a direct call. Anything in the wrong category, move it.",
    ],
    acceptance: [
      "The controller does the state change and dispatches one event, and `NOTES.md` holds the original for comparison.",
      "Each side effect is its own listener, with slow ones queued and instant ones inline, and you can justify the split.",
      "A queued listener dispatched inside a transaction reliably finds the record, and you saw it fail before you fixed it.",
      "A fifth consequence was added without touching the controller.",
      "`InvoicePaid` is one notification reaching mail, the database and one more channel, respecting a per-user preference.",
      "The bell shows an unread count that changes when a notification is marked read.",
      "A non-English user receives the email in their language, and you saw what happens without `->locale()`.",
      "The invoice email was previewed in a browser before any test was written.",
      "You reproduced the wrong-`APP_URL` bug and can explain why it is invisible locally.",
      "Three mail tests pass, and you know which one a fake could not have replaced.",
      "The nightly summary is scheduled at 02:00 in an explicit timezone, dispatching a queued job rather than doing the work.",
      "A long-running summary does not overlap itself, and you observed the overlap before adding the guard.",
      "`onOneServer()`, `environments()` and `onFailure()` are all present, each with a comment naming what it prevents.",
      "`schedule:list` shows the task with the next run time you expect.",
      "Every email InvoiceHub sends is classified as event-driven, time-driven or direct, and anything miscategorised has been moved.",
    ],
    stretch: [
      "Group the invoice listeners into a subscriber and write down what you gained and what you gave up.",
      "Add a debounced listener for something recalculated on every edit, and demonstrate three rapid changes producing one run.",
      "Add an on-demand notification alerting an operations address when the nightly summary fails, and test it by making the job throw.",
    ],
  },
};
