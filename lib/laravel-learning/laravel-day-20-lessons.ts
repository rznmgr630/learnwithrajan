import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_20_LESSONS: LessonDay = {
  day: 20,
  title: "Authorization — Gates, Policies & the #[Authorize] attribute",
  totalMinutes: 89,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "gates",
      title: "Gates — the simplest authorization rule",
      durationMinutes: 11,
      explanation: "Yesterday answered <i>who are you</i>. Today answers the other question, and it is the one that actually protects your data.\n\n```text\nAuthentication   Who is this user?\nAuthorization    What is this user allowed to do?\n```\n\nThe `auth` middleware from yesterday lets any logged-in user through. Nothing so far stops one customer opening another customer's invoice, and that is what today fixes.\n\n```text\nAuthenticated User\n        │\n        ▼\n   Authorization\n        │\n   ┌────┴────┐\n   ▼         ▼\n Gates     Policies\n   │         │\n simple    model / resource\n checks     permissions\n```\n\n---\n\n### 1. Basic — defining and checking a gate\n\n<b>A <i>gate</i></b> (a named authorization rule, defined as a closure) is the simplest form:\n\n```php\nuse Illuminate\\Support\\Facades\\Gate;\n\nGate::define('access-admin', function (User $user) {\n    return $user->is_admin;\n});\n```\n\nDefine them in `AppServiceProvider::boot()`, and check them anywhere:\n\n```php\nif (Gate::allows('access-admin')) {\n    // allowed\n}\n```\n\n<b>The authenticated user is passed in for you.</b> You never write `Gate::allows('access-admin', $user)`; the first closure parameter is always the current user.\n\nWhich means a guest cannot pass a gate at all. `Gate::allows()` returns `false` for a guest without running your closure, so a gate never has to worry about `$user` being null.\n\n---\n\n### 2. Intermediate — gates that take a model\n\nA gate can receive more:\n\n```php\nGate::define('update-post', function (User $user, Post $post) {\n    return $user->id === $post->user_id;\n});\n```\n\n```php\nGate::allows('update-post', $post);\n```\n\n```text\nUser  +  Post\n      ↓\n  can update?\n```\n\nThat works, and it is also the moment to notice something. As soon as a gate takes a model, you will want `view-post`, `delete-post`, `restore-post` and `publish-post` too, and `AppServiceProvider` fills with closures.\n\n<b>That is what policies are for</b>, two lessons from now. Gates stay useful for the checks that are <i>not</i> about a particular model:\n\n```text\naccess the admin dashboard\nview analytics\nrun an import\nimpersonate a user\n```\n\nNone of those has an obvious model to hang off.\n\n---\n\n### 3. Advanced — the three ways to ask\n\n```php\nGate::allows('access-admin');       // true when allowed\nGate::denies('access-admin');       // the inverse, reads better in a guard clause\nGate::any(['update', 'delete'], $post);    // any of these\nGate::none(['update', 'delete'], $post);   // none of these\n```\n\nAnd the one that does not return a boolean:\n\n```php\nGate::authorize('update-post', $post);\n```\n\n<b>`authorize()` throws when denied</b>, which Laravel turns into a 403. It is the right choice in a controller, where a denial should end the request rather than be handled with an `if`.\n\n```text\nallows() / denies()   →  a boolean, for branching\nauthorize()           →  throws, for stopping the request\n```\n\nA gate can also be a class method rather than a closure, which keeps a complex rule testable:\n\n```php\nGate::define('access-admin', [AdminPolicy::class, 'access']);\n```\n\nOne caution before the next lesson. <b>A gate is invisible from the outside.</b> Nothing in a controller says which rules exist, and a rule nobody checks protects nothing. The habit that saves you is to write the check first, at the top of the action, before the code that does the work.",
      diagram: `Two questions

  Authentication   Who is this user?          ← yesterday
  Authorization    What may they do?          ← today

  The auth middleware lets ANY logged-in user through.
  Nothing yet stops one customer opening another
  customer's invoice.


  Authenticated User
          │
          ▼
     Authorization
          │
     ┌────┴────┐
     ▼         ▼
   Gates     Policies
     │         │
   simple    model / resource
   checks     permissions


Defining a gate

  Gate::define('access-admin', function (User \$user) {
      return \$user->is_admin;
  });

  Gate::allows('access-admin')

  The authenticated user is passed in for you. You never
  pass it yourself, and a guest fails without your closure
  ever running.


Gates with a model

  Gate::define('update-post', function (User \$user, Post \$post) {
      return \$user->id === \$post->user_id;
  });

  Gate::allows('update-post', \$post)

  ...and then you want view-post, delete-post,
  restore-post, publish-post, and AppServiceProvider
  fills with closures.

  That is what policies are for.

  Gates stay right for checks with no model:
    access the admin dashboard
    view analytics
    run an import
    impersonate a user


Three ways to ask

  Gate::allows('x')            true when allowed
  Gate::denies('x')            the inverse, reads better in a guard
  Gate::any(['a','b'], \$post)  any of these
  Gate::authorize('x', \$post)  THROWS when denied → 403

  allows / denies   →  a boolean, for branching
  authorize         →  stops the request


  ⚠️  A gate is invisible from the outside. Nothing in a
      controller says which rules exist, and a rule nobody
      checks protects nothing. Write the check FIRST, at
      the top of the action.`,
      codeExample: {
        title: "Defining gates and checking them",
        code: `<?php
// app/Providers/AppServiceProvider.php

namespace App\\Providers;

use App\\Models\\Post;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\Gate;
use Illuminate\\Support\\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // No model: a system-level ability.
        Gate::define('access-admin', function (User $user) {
            return $user->is_admin;
        });

        Gate::define('view-analytics', function (User $user) {
            return $user->is_admin || $user->role === 'analyst';
        });

        // With a model. This shape is what policies replace.
        Gate::define('update-post', function (User $user, Post $post) {
            return $user->id === $post->user_id;
        });

        // A class method, when the rule is worth testing on its own.
        Gate::define('impersonate', [AdminGate::class, 'impersonate']);
    }
}


<?php
// ---------- Checking ----------

use Illuminate\\Support\\Facades\\Gate;

if (Gate::allows('access-admin')) {
    // allowed
}

if (Gate::denies('access-admin')) {
    abort(403);
}

Gate::allows('update-post', $post);

Gate::any(['update-post', 'delete-post'], $post);
Gate::none(['update-post', 'delete-post'], $post);

// The authenticated user is passed for you. Never this:
Gate::allows('access-admin', $user);

// A guest returns false without your closure running,
// so a gate never has to handle a null user.


<?php
// ---------- In a controller ----------

class AdminController extends Controller
{
    public function index()
    {
        // Throws, and Laravel turns it into a 403.
        Gate::authorize('access-admin');

        return view('admin.dashboard');
    }
}

// Compare:
//   allows() / denies()  →  a boolean, for branching
//   authorize()          →  ends the request when denied


<?php
// ---------- Another user, when you need it ----------

// Occasionally you are checking on behalf of someone else,
// such as an admin previewing what a customer can see.
Gate::forUser($otherUser)->allows('update-post', $post);`,
      },
      keyTakeaways: [
        "<b>Authentication asks who you are; authorization asks what you may do.</b>",
        "The `auth` middleware lets every logged-in user through, so ownership checks are a separate job.",
        "<b>A gate is a named authorization rule defined as a closure</b>, usually in `AppServiceProvider::boot()`.",
        "<b>The authenticated user is passed in as the first argument</b>, so you never supply it yourself.",
        "A guest fails a gate without your closure running, so gates never handle a null user.",
        "<b>A gate can take a model as a second argument</b>, but that shape is what policies exist for.",
        "<b>Gates are right for abilities with no model</b>: the admin dashboard, analytics, running an import.",
        "<b>`allows()` and `denies()` return booleans; `authorize()` throws and becomes a 403.</b>",
        "`Gate::any()` and `Gate::none()` check several abilities at once, and `Gate::forUser()` checks on behalf of someone else.",
        "<b>A rule nobody checks protects nothing</b>, so write the check at the top of the action.",
      ],
      commonMistakes: [
        "<b>Passing the user to `Gate::allows()`.</b> The authenticated user is already the first argument.",
        "<b>Relying on `auth` middleware for ownership.</b> It only says somebody is logged in.",
        "<b>Defining a gate and never checking it.</b> The rule exists and protects nothing.",
        "<b>Filling `AppServiceProvider` with model gates.</b> Four abilities per model is what policies are for.",
        "<b>Using `allows()` in a controller and forgetting the `abort(403)`.</b> `authorize()` does both.",
      ],
      quiz: [
        {
          question: "What does authorization decide?",
          options: [
            "Whether someone is logged in",
            "What the authenticated user is allowed to do",
            "Which guard is used",
            "Whether the password is correct",
          ],
          correctIndex: 1,
          explanation: "Authentication is the other question, and it was yesterday.",
        },
        {
          question: "Where does the user come from in `Gate::define('x', function (User $user) {...})`?",
          options: [
            "You pass it to `Gate::allows()`",
            "Laravel passes the authenticated user in automatically",
            "It is resolved from the route",
            "From the session manually",
          ],
          correctIndex: 1,
          explanation: "A guest fails before your closure ever runs.",
        },
        {
          question: "What is the difference between `Gate::allows()` and `Gate::authorize()`?",
          options: [
            "None",
            "`allows()` returns a boolean; `authorize()` throws when denied, which becomes a 403",
            "`authorize()` is for policies only",
            "`allows()` also logs the check",
          ],
          correctIndex: 1,
          explanation: "Booleans for branching, `authorize()` for ending the request.",
        },
        {
          question: "Which is a good fit for a gate rather than a policy?",
          options: [
            "Can this user update this post?",
            "Can this user delete this invoice?",
            "Can this user access the admin dashboard?",
            "Can this user view this project?",
          ],
          correctIndex: 2,
          explanation: "There is no particular model behind it.",
        },
      ],
    },
    {
      id: "before-after-and-responses",
      title: "before, after & gate responses",
      durationMinutes: 11,
      explanation: "Three features that turn a set of yes-or-no checks into something you can operate.\n\n---\n\n### 1. Basic — `before()`, the override\n\nEvery application eventually wants somebody who can do everything:\n\n```text\nSuper admin\n     ↓\neverything allowed\n```\n\nWritten into each rule, that is `$user->is_super_admin ||` repeated forty times, and the fortieth is the one somebody forgets.\n\n<b>`Gate::before()` runs ahead of every check:</b>\n\n```php\nGate::before(function (User $user, string $ability) {\n    if ($user->is_super_admin) {\n        return true;\n    }\n});\n```\n\n```text\nauthorization request\n        ↓\n     before()\n        │\n    ┌───┴────┐\n   true     null\n    │        │\n allowed   the normal check runs\n```\n\n<b>Returning `null` is what lets the normal check happen</b>, and it is the detail that trips people. Return `false` and you have denied everything for everybody, because a `before` hook that returns anything non-null is the final answer.\n\nSo: return `true` to grant, and nothing at all otherwise.\n\n---\n\n### 2. Intermediate — `after()`, the observer\n\n```php\nGate::after(function (User $user, string $ability, ?bool $result, $arguments) {\n    // the decision has been made\n});\n```\n\n```text\nbefore()   runs before the decision, and can make it\nafter()    runs after the decision, and can see it\n```\n\nIt is mostly for the things you want around authorization rather than in it:\n\n```text\nauditing        who was denied what\nlogging         a denial that keeps recurring is a bug or an attack\nmetrics\ndebugging       why is this user getting a 403?\n```\n\n`after()` can also grant, by returning `true` when the result was null, but that is rare and easy to misuse. <b>Treat it as read-only and you will not surprise anybody.</b>\n\nThe auditing case is worth taking seriously. A log line for every denial tells you when a permission model is wrong, because users hitting 403s on things they should be able to do is a support ticket you can see coming.\n\n---\n\n### 3. Advanced — responses with a reason\n\nA gate returning `false` gives the user \"This action is unauthorized.\" and nothing else. Sometimes the reason matters:\n\n```php\nuse Illuminate\\Auth\\Access\\Response;\n\nGate::define('update-post', function (User $user, Post $post) {\n    return $user->id === $post->user_id\n        ? Response::allow()\n        : Response::deny('You do not own this post.');\n});\n```\n\nNow the denial carries a message, and `authorize()` uses it in the 403.\n\nYou can inspect it directly:\n\n```php\n$response = Gate::inspect('update-post', $post);\n\n$response->allowed();\n$response->message();\n```\n\n<b>This is where authorization messages belong.</b> The alternative is a controller full of `abort(403, 'You do not own this post.')`, with the rule in one place and the explanation in another, drifting apart.\n\nA response can also set its own status:\n\n```php\nResponse::denyWithStatus(404);\nResponse::denyAsNotFound();\n```\n\nWhich exists for a real reason. <b>A 403 confirms the thing exists</b>, so on a private resource, replying 404 tells a stranger nothing at all. If your invoice ids are sequential, a 403 on `/invoices/91` is confirmation that invoice 91 belongs to somebody.\n\nSo the judgement:\n\n```text\nthe user knows the resource exists   →  403 with a helpful reason\nthe user should not know it exists   →  404\n```\n\nAnd one thing to keep in mind about messages: they are shown to somebody who was just refused. <b>Say what is wrong, not why your system said no</b>: \"You do not own this post\" is fine, \"role_id 3 lacks posts.update\" is an information leak dressed as helpfulness.",
      diagram: `before(): the override

  Every app eventually wants somebody who can do everything.

  Written into each rule, that is
    \$user->is_super_admin ||
  repeated forty times, and the fortieth is forgotten.

  Gate::before(function (User \$user, string \$ability) {
      if (\$user->is_super_admin) return true;
  });

  authorization request
          ↓
       before()
          │
      ┌───┴────┐
     true     null
      │        │
   allowed   the normal check runs

  ⚠️  Returning NULL is what lets the normal check happen.
      Return false and you have denied everything, for
      everybody. Anything non-null is the final answer.


after(): the observer

  before()   runs before the decision, and can MAKE it
  after()    runs after the decision, and can SEE it

  auditing    who was denied what
  logging     a recurring denial is a bug or an attack
  metrics
  debugging   why is this user getting a 403?

  It can grant, by returning true on a null result.
  Treat it as read-only and you will surprise nobody.


Responses with a reason

  return \$user->id === \$post->user_id
      ? Response::allow()
      : Response::deny('You do not own this post.');

  Gate::inspect('update-post', \$post)
      ->allowed()
      ->message()

  This is where authorization messages belong. The
  alternative is abort(403, '...') scattered through
  controllers, with the rule and the explanation in
  different files, drifting apart.


403 or 404?

  Response::denyAsNotFound()

  A 403 CONFIRMS the thing exists. On sequential ids,
  a 403 on /invoices/91 tells a stranger invoice 91
  belongs to somebody.

  user knows it exists      →  403 with a helpful reason
  user should not know      →  404


  And the message is shown to someone just refused.
  Say what is wrong, not why your system said no.

    ✓ "You do not own this post."
    ✗ "role_id 3 lacks posts.update"`,
      codeExample: {
        title: "Overrides, auditing and reasons",
        code: `<?php
// app/Providers/AppServiceProvider.php

use App\\Models\\User;
use Illuminate\\Auth\\Access\\Response;
use Illuminate\\Support\\Facades\\Gate;
use Illuminate\\Support\\Facades\\Log;

public function boot(): void
{
    // ---------- before: grant, or say nothing ----------

    Gate::before(function (User $user, string $ability) {
        if ($user->is_super_admin) {
            return true;
        }

        // Returning nothing (null) lets the normal check run.
        // ❌ return false;  would deny everything, for everybody.
    });


    // ---------- after: watch, do not decide ----------

    Gate::after(function (User $user, string $ability, ?bool $result, $arguments) {
        if ($result === false) {
            Log::info('Authorization denied', [
                'user_id' => $user->id,
                'ability' => $ability,
            ]);
        }
    });

    // Recurring denials are either a wrong permission model
    // or somebody probing. Both are worth seeing.


    // ---------- Responses that carry a reason ----------

    Gate::define('update-post', function (User $user, Post $post) {
        return $user->id === $post->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');
    });

    Gate::define('publish-post', function (User $user, Post $post) {
        if ($user->id !== $post->user_id) {
            return Response::deny('You do not own this post.');
        }

        if (! $user->hasVerifiedEmail()) {
            return Response::deny('Verify your email before publishing.');
        }

        return Response::allow();
    });

    // A private resource: do not confirm that it exists.
    Gate::define('view-invoice', function (User $user, Invoice $invoice) {
        return $user->id === $invoice->user_id
            ? Response::allow()
            : Response::denyAsNotFound();
    });
}


<?php
// ---------- Reading the response ----------

$response = Gate::inspect('update-post', $post);

if ($response->allowed()) {
    // ...
} else {
    return back()->withErrors(['post' => $response->message()]);
}

// And authorize() uses the message in the 403 automatically:
Gate::authorize('update-post', $post);


<?php
// ---------- Where messages should NOT live ----------

// ❌ The rule is in one file and the explanation in another.
if (! Gate::allows('update-post', $post)) {
    abort(403, 'You do not own this post.');
}

// ✓ Both in the gate.
Gate::authorize('update-post', $post);`,
      },
      keyTakeaways: [
        "<b>`Gate::before()` runs ahead of every check</b>, which is how a super admin bypasses everything in one place.",
        "<b>Return `true` to grant and nothing at all otherwise</b>: any non-null return is the final answer.",
        "<b>Returning `false` from a `before` hook denies everything for everybody.</b>",
        "<b>`Gate::after()` runs once the decision is made</b>, and is for auditing, logging, metrics and debugging.",
        "Treat `after()` as read-only, even though it can grant, so nothing surprising happens.",
        "<b>Logging denials shows you a wrong permission model before the support tickets do.</b>",
        "<b>`Response::allow()` and `Response::deny('reason')` attach a message to the decision.</b>",
        "`Gate::inspect()` returns the response so you can read `allowed()` and `message()`.",
        "<b>A 403 confirms the resource exists</b>, so `denyAsNotFound()` is right when it should stay secret.",
        "<b>Denial messages say what is wrong, not why your system said no</b>, which would leak your permission model.",
      ],
      commonMistakes: [
        "<b>Returning `false` from `Gate::before()`.</b> Every check for every user now fails.",
        "<b>Repeating a super-admin check in every rule.</b> One of them will be forgotten.",
        "<b>Granting from `after()`.</b> It works, and nobody reading the gate expects it.",
        "<b>Putting the denial message in the controller.</b> The rule and the reason then drift apart.",
        "<b>Returning 403 for a resource the user should not know exists.</b> The status itself is the leak.",
      ],
      quiz: [
        {
          question: "What should `Gate::before()` return when it has no opinion?",
          options: ["`false`", "`true`", "Nothing, so it returns null", "An empty array"],
          correctIndex: 2,
          explanation: "Any non-null return is the final answer, so `false` would deny everything.",
        },
        {
          question: "What is `Gate::after()` mainly for?",
          options: [
            "Granting access to admins",
            "Auditing, logging, metrics and debugging, after the decision is made",
            "Defining new gates",
            "Caching results",
          ],
          correctIndex: 1,
          explanation: "It can grant, but treating it as read-only avoids surprises.",
        },
        {
          question: "What does `Response::deny('You do not own this post.')` add?",
          options: [
            "A redirect",
            "A message that travels with the denial and is used in the 403",
            "A log entry",
            "A retry",
          ],
          correctIndex: 1,
          explanation: "So the reason lives with the rule, not scattered in controllers.",
        },
        {
          question: "Why would a policy return 404 rather than 403?",
          options: [
            "404 is faster",
            "A 403 confirms the resource exists, which can be a leak on a private resource",
            "403 is deprecated",
            "It avoids logging",
          ],
          correctIndex: 1,
          explanation: "On sequential ids, a 403 tells a stranger that record belongs to somebody.",
        },
      ],
    },
    {
      id: "policies",
      title: "Policies & the seven methods",
      durationMinutes: 12,
      explanation: "Gates scale badly for models, and this is the fix.\n\n---\n\n### 1. Basic — one class per model\n\nFour abilities on one model, written as gates:\n\n```text\nGate\n ├── view-post\n ├── update-post\n ├── delete-post\n └── restore-post\n```\n\nMultiply by eight models and `AppServiceProvider` is four hundred lines of closures that nothing groups.\n\n<b>A <i>policy</i></b> (a class holding the authorization rules for one model) gathers them:\n\n```text\nPostPolicy\n ├── view\n ├── create\n ├── update\n ├── delete\n └── restore\n```\n\n```bash\nphp artisan make:policy PostPolicy --model=Post\n```\n\n```text\napp/Policies/PostPolicy.php\n```\n\nThe `--model` flag stubs out the conventional methods, which saves you looking them up.\n\n```php\nclass PostPolicy\n{\n    public function view(User $user, Post $post): bool\n    {\n        return $post->published || $user->id === $post->user_id;\n    }\n\n    public function update(User $user, Post $post): bool\n    {\n        return $user->id === $post->user_id;\n    }\n\n    public function delete(User $user, Post $post): bool\n    {\n        return $user->id === $post->user_id;\n    }\n}\n```\n\n<b>The rules now live next to the resource they protect</b>, which means somebody wondering who can delete a post has one file to open.\n\n---\n\n### 2. Intermediate — the seven conventional methods\n\nLaravel's resource controllers and its authorization share a vocabulary:\n\n```text\nviewAny       the collection: may they see the list at all?\nview          one model\ncreate        a new one\nupdate        an existing one\ndelete        remove it\nrestore       bring back a soft-deleted one\nforceDelete   remove it permanently\n```\n\nThe signatures split into two groups, and the split is the thing to notice:\n\n```php\npublic function viewAny(User $user): bool          // no model yet\npublic function create(User $user): bool           // no model yet\n\npublic function view(User $user, Post $post): bool\npublic function update(User $user, Post $post): bool\npublic function delete(User $user, Post $post): bool\npublic function restore(User $user, Post $post): bool\npublic function forceDelete(User $user, Post $post): bool\n```\n\n<b>`viewAny` and `create` take no model, because there is not one yet.</b> You cannot ask \"may they create this post\" about a post that does not exist, so the rule can only be about the user.\n\nImplement only what you need. A missing method means that ability is denied, which is the safe default and occasionally a confusing one: <b>a check against a method you never wrote fails silently rather than erroring.</b>\n\n---\n\n### 3. Advanced — what belongs in a policy\n\nA policy is not a dumping ground for validation, and the boundary is worth getting right:\n\n```text\nPolicy                        Validation\n──────                        ──────────\nmay this user do this?        is this input acceptable?\nabout identity and            about the request body\n  ownership\n403                           422\n```\n\n\"Is the title under 255 characters\" is validation. \"Does this user own the post\" is authorization. A rule that would be the same for every user is almost always validation.\n\nA policy can take extra arguments after the model:\n\n```php\npublic function update(User $user, Post $post, bool $force = false): bool\n```\n\nand it can use a guest-friendly signature when a resource is publicly viewable:\n\n```php\npublic function view(?User $user, Post $post): bool\n{\n    return $post->published || $user?->id === $post->user_id;\n}\n```\n\n<b>Making `$user` nullable is what lets a guest pass a policy at all.</b> Without the `?`, Laravel denies guests before your method runs, which is right for `update` and wrong for `view` on a public blog.\n\nOne more habit worth forming now. <b>Keep policies free of queries where you can.</b> A policy method runs once per model, so a `$post->comments()->count()` inside `view()` is a query per row on any list page. If a rule needs related data, load it in the controller and let the policy read what is already there.",
      diagram: `Why policies exist

  Four abilities on one model, as gates:

    Gate
     ├── view-post
     ├── update-post
     ├── delete-post
     └── restore-post

  × eight models = 400 lines of closures with
  nothing grouping them.

  A policy gathers them:

    PostPolicy
     ├── view
     ├── create
     ├── update
     ├── delete
     └── restore

  php artisan make:policy PostPolicy --model=Post

  The rules now live next to the resource they protect.


The seven conventional methods

  viewAny       the collection: may they see the list?
  view          one model
  create        a new one
  update        an existing one
  delete        remove it
  restore       bring back a soft-deleted one
  forceDelete   remove it permanently


  And the split that matters:

    viewAny(User \$user)              no model yet
    create(User \$user)               no model yet

    view(User \$user, Post \$post)
    update(User \$user, Post \$post)
    delete(User \$user, Post \$post)
    restore(User \$user, Post \$post)
    forceDelete(User \$user, Post \$post)

  You cannot ask "may they create THIS post" about a post
  that does not exist, so the rule is only about the user.

  ⚠️  A missing method DENIES. Safe, and occasionally
      confusing: a check against a method you never wrote
      fails silently rather than erroring.


Policy or validation?

  Policy                      Validation
  ──────                      ──────────
  may this user do this?      is this input acceptable?
  identity and ownership      the request body
  403                         422

  A rule that would be the same for every user is
  almost always validation.


Guests

  public function view(?User \$user, Post \$post): bool
  {
      return \$post->published || \$user?->id === \$post->user_id;
  }

  The ? is what lets a guest pass at all. Without it,
  Laravel denies guests before your method runs — right
  for update, wrong for view on a public blog.


  Keep queries out of policies. A policy method runs once
  per model, so a query inside view() is a query per row
  on every list page.`,
      codeExample: {
        title: "A complete policy",
        code: `<?php
// php artisan make:policy PostPolicy --model=Post

namespace App\\Policies;

use App\\Models\\Post;
use App\\Models\\User;
use Illuminate\\Auth\\Access\\Response;

class PostPolicy
{
    // ---------- No model yet ----------

    public function viewAny(User $user): bool
    {
        // May they see the list at all?
        return true;
    }

    public function create(User $user): bool
    {
        // Cannot be about a post: it does not exist yet.
        return $user->hasVerifiedEmail();
    }

    // ---------- With a model ----------

    // Nullable user, so guests can view a published post.
    public function view(?User $user, Post $post): bool
    {
        return $post->published || $user?->id === $post->user_id;
    }

    public function update(User $user, Post $post): Response
    {
        return $user->id === $post->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function forceDelete(User $user, Post $post): bool
    {
        // Permanent deletion, deliberately narrower.
        return $user->is_admin;
    }
}


<?php
// ---------- Policy or validation? ----------

class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        // ✓ Authorization: about who is asking.
        return $user->id === $post->user_id;

        // ❌ Validation: the same answer for every user,
        //    and it belongs in a form request, as a 422.
        // return strlen($post->title) < 255;
    }
}


<?php
// ---------- Keep queries out ----------

// ❌ One query per post on every list page.
public function view(User $user, Post $post): bool
{
    return $post->comments()->count() > 0 || $user->id === $post->user_id;
}

// ✓ Read what the controller already loaded.
public function view(User $user, Post $post): bool
{
    return $post->comments_count > 0 || $user->id === $post->user_id;
}

// Controller:
Post::withCount('comments')->paginate(20);


<?php
// ---------- Extra arguments ----------

public function update(User $user, Post $post, bool $ignoreLock = false): bool
{
    if ($post->is_locked && ! $ignoreLock) {
        return false;
    }

    return $user->id === $post->user_id;
}

// $user->can('update', [$post, true]);`,
      },
      keyTakeaways: [
        "<b>A policy is a class holding the authorization rules for one model.</b>",
        "It replaces four or five gates per model, so the rules live next to the resource they protect.",
        "`php artisan make:policy PostPolicy --model=Post` stubs out the conventional methods.",
        "<b>The seven conventional methods are `viewAny`, `view`, `create`, `update`, `delete`, `restore` and `forceDelete`.</b>",
        "<b>`viewAny` and `create` take no model</b>, because there is not one yet, so the rule is only about the user.",
        "<b>A missing policy method denies</b>, which is safe and silent, so a typo looks like a failing rule.",
        "<b>A policy answers \"may this user\"; validation answers \"is this input acceptable\"</b>, and they are 403 and 422.",
        "A rule with the same answer for every user is almost always validation.",
        "<b>Make `$user` nullable to let guests pass a policy</b>, which is what a public blog's `view` needs.",
        "<b>Keep queries out of policies</b>, because a policy method runs once per model on every list page.",
      ],
      commonMistakes: [
        "<b>Giving `viewAny` or `create` a model parameter.</b> There is no model at that point.",
        "<b>Misspelling a method name.</b> The ability is silently denied rather than erroring.",
        "<b>Putting validation in a policy.</b> Input rules belong in a form request, as a 422.",
        "<b>Forgetting the `?` on `$user` for a publicly viewable resource.</b> Guests are denied before your method runs.",
        "<b>Querying inside a policy method.</b> On a list of fifty, that is fifty extra queries.",
      ],
      quiz: [
        {
          question: "Why does `create()` take no model?",
          options: [
            "Laravel does not support it",
            "The model does not exist yet, so the rule can only be about the user",
            "Creation is always allowed",
            "It takes the request instead",
          ],
          correctIndex: 1,
          explanation: "The same is true of `viewAny`.",
        },
        {
          question: "What happens if you check an ability whose policy method does not exist?",
          options: [
            "It is allowed",
            "It is denied, silently",
            "An exception is thrown",
            "It falls back to a gate of the same name",
          ],
          correctIndex: 1,
          explanation: "Safe, and it makes a typo look like a failing rule.",
        },
        {
          question: "Which of these belongs in validation rather than a policy?",
          options: [
            "Does this user own the post?",
            "Is the title under 255 characters?",
            "Is this user an admin?",
            "Has this user verified their email?",
          ],
          correctIndex: 1,
          explanation: "The answer is the same for every user, so it is not authorization.",
        },
        {
          question: "How do you let a guest pass a policy method?",
          options: [
            "Register it as a gate instead",
            "Make the `$user` parameter nullable with `?User $user`",
            "Return true by default",
            "Guests can never pass a policy",
          ],
          correctIndex: 1,
          explanation: "Without the `?`, Laravel denies guests before your method runs.",
        },
      ],
    },
    {
      id: "discovery-and-checking",
      title: "Policy discovery & the ways to check",
      durationMinutes: 11,
      explanation: "You wrote a policy. Nothing yet connects it to the model, and nothing yet calls it.\n\n---\n\n### 1. Basic — Laravel finds it for you\n\n```text\napp/Models/Post.php\n        ↓\napp/Policies/PostPolicy.php\n```\n\n<b>Auto-discovery</b> matches a model to a policy by name and location: the model's name plus `Policy`, in the `Policies` directory alongside `Models`. Follow the convention and there is nothing to register.\n\nWhen the convention does not fit, say so explicitly:\n\n```php\nGate::policy(Post::class, PostPolicy::class);\n```\n\nor with an attribute on the model, which is more visible:\n\n```php\n#[UsePolicy(PostPolicy::class)]\nclass Post extends Model\n{\n}\n```\n\nReach for registration when your models live somewhere unusual, when a package's model needs your policy, or when one policy covers several models. <b>Otherwise leave it: an unnecessary registration is a line that can go stale.</b>\n\nThe symptom of discovery not working is worth recognising, because it looks like a broken rule: every check returns denied, because Laravel found no policy and defaults to no.\n\n---\n\n### 2. Intermediate — the same check, three ways\n\nOnce discovered, a policy is reached through the same API as a gate:\n\n```php\nGate::allows('update', $post);\n```\n\n```text\nGate::allows('update', $post)\n        ↓\nthe argument is a Post\n        ↓\nPostPolicy\n        ↓\nupdate($user, $post)\n```\n\n<b>The model argument is what tells Laravel to look for a policy.</b> `Gate::allows('update')` with no model looks for a gate named `update`; with a `Post`, it looks for `PostPolicy::update()`.\n\nThe user object can be asked directly, which usually reads better:\n\n```php\nif ($user->can('update', $post)) { }\nif ($user->cannot('update', $post)) { }\n\n$request->user()->can('update', $post);\n```\n\n```text\n\"Can this user update this post?\"\n$user->can('update', $post)\n```\n\nFor abilities with no model, name the class:\n\n```php\n$user->can('create', Post::class);\n$user->can('viewAny', Post::class);\n```\n\n<b>That is the one people forget.</b> `$user->can('create')` finds nothing, because without an argument Laravel has no idea which policy you meant.\n\n---\n\n### 3. Advanced — choosing between them\n\n```text\nGate::allows('update', $post)     a boolean, from anywhere\n$user->can('update', $post)       a boolean, reads as a sentence\nGate::authorize('update', $post)  throws, so the request ends\n$this->authorize('update', $post) the same, inside a controller\n```\n\nThe first two are identical in effect. Prefer `$user->can()` when you have the user, because the code says what it means; use `Gate::` when you do not, such as in a service with no request.\n\nAnd the rule that decides between boolean and throwing:\n\n```text\ndeciding what to render     →  a boolean\nguarding an action          →  authorize()\n```\n\nA sidebar link is a boolean. A `PUT /posts/1` is `authorize()`, because there is nothing sensible to do with `false` except stop.\n\nOne last piece of vocabulary. `Gate::forUser($other)->can(...)` checks on somebody else's behalf, which is what an admin previewing a customer's view needs.\n\nAnd the thing worth stating plainly, because it is the whole point of the day: <b>a check in Blade is not authorization.</b> Hiding the edit button stops nobody from sending the request. The template check is politeness; the controller check is security. You need both, and only one of them protects anything.",
      diagram: `Discovery

  app/Models/Post.php
          ↓
  app/Policies/PostPolicy.php

  Model name + Policy, in Policies alongside Models.
  Follow the convention and there is nothing to register.

  When it does not fit:

    Gate::policy(Post::class, PostPolicy::class);

    #[UsePolicy(PostPolicy::class)]
    class Post extends Model {}

  Register when models live somewhere unusual, when a
  package's model needs your policy, or when one policy
  covers several models. Otherwise leave it.

  ⚠️  Discovery failing looks like a broken rule: every
      check is denied, because no policy was found and
      the default is no.


The model argument is the routing

  Gate::allows('update', \$post)
          ↓
  the argument is a Post
          ↓
  PostPolicy::update(\$user, \$post)

  Gate::allows('update')          → looks for a GATE
  Gate::allows('update', \$post)   → looks for a POLICY

  For abilities with no model, name the class:

    \$user->can('create', Post::class)
    \$user->can('viewAny', Post::class)

  \$user->can('create') finds nothing. Laravel has no
  idea which policy you meant.


Four ways, two behaviours

  Gate::allows('update', \$post)      boolean, from anywhere
  \$user->can('update', \$post)        boolean, reads as a sentence
  Gate::authorize('update', \$post)   THROWS → 403
  \$this->authorize('update', \$post)  the same, in a controller

  deciding what to RENDER   →  a boolean
  guarding an ACTION        →  authorize()

  A sidebar link is a boolean. A PUT /posts/1 is
  authorize(), because there is nothing to do with
  false except stop.

  Gate::forUser(\$other)->can(...)   on somebody else's behalf


  And the point of the whole day:

    A check in Blade is NOT authorization.

  Hiding the edit button stops nobody from sending the
  request. The template check is politeness. The
  controller check is security. You need both, and only
  one of them protects anything.`,
      codeExample: {
        title: "Connecting the policy, and calling it",
        code: `<?php
// ---------- Discovery: nothing to do ----------

// app/Models/Post.php      →  app/Policies/PostPolicy.php
// Laravel finds it by name and location.


// ---------- Registration, when the convention does not fit ----------

// app/Providers/AppServiceProvider.php
use Illuminate\\Support\\Facades\\Gate;

public function boot(): void
{
    Gate::policy(Post::class, PostPolicy::class);
}

// Or on the model, which is more visible:
use Illuminate\\Database\\Eloquent\\Attributes\\UsePolicy;

#[UsePolicy(PostPolicy::class)]
class Post extends Model
{
}


<?php
// ---------- Checking ----------

use Illuminate\\Support\\Facades\\Gate;

// The model argument is what sends this to a policy.
Gate::allows('update', $post);      // PostPolicy::update()
Gate::allows('access-admin');       // a gate, no model

// Reads better when you have the user:
$user->can('update', $post);
$user->cannot('update', $post);
$request->user()->can('delete', $post);

// Abilities with no model: name the class.
$user->can('create', Post::class);
$user->can('viewAny', Post::class);

// ❌ Finds nothing: Laravel cannot tell which policy.
$user->can('create');

// On somebody else's behalf.
Gate::forUser($customer)->can('view', $invoice);


<?php
// ---------- In a controller ----------

class PostController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Post::class);

        // A boolean, because this decides what to render.
        return view('posts.index', [
            'posts'     => Post::paginate(20),
            'canCreate' => $request->user()->can('create', Post::class),
        ]);
    }

    public function update(Request $request, Post $post)
    {
        // Throws when denied. There is nothing else to do here.
        Gate::authorize('update', $post);

        $post->update($request->validated());

        return redirect()->route('posts.show', $post);
    }
}


<?php
// ---------- The point of the day ----------

// In a view: politeness. It hides a button.
// @can('update', $post) ... @endcan

// In the controller: security. It stops the request.
Gate::authorize('update', $post);

// Without the second one, anybody can send
// PUT /posts/1 with curl and it works.`,
      },
      keyTakeaways: [
        "<b>Laravel discovers a policy by name and location</b>: `Post` finds `PostPolicy` in `app/Policies`.",
        "<b>Register manually with `Gate::policy()` or `#[UsePolicy]`</b> when the convention does not fit.",
        "<b>Discovery failing looks like a broken rule</b>, because a missing policy means every check is denied.",
        "<b>The model argument is what sends a check to a policy</b> rather than to a gate of the same name.",
        "<b>Abilities with no model need the class name</b>, as in `$user->can('create', Post::class)`.",
        "`$user->can()` and `Gate::allows()` are the same check, and `can()` usually reads better.",
        "<b>Use a boolean when deciding what to render, and `authorize()` when guarding an action.</b>",
        "`Gate::forUser($other)` checks on somebody else's behalf.",
        "<b>A check in Blade is not authorization.</b> Hiding a button stops nobody from sending the request.",
        "<b>The template check is politeness; the controller check is security.</b> You need both.",
      ],
      commonMistakes: [
        "<b>Only checking in the view.</b> The route still accepts the request from anyone who sends it.",
        "<b>Calling `$user->can('create')` with no class.</b> Laravel cannot tell which policy you meant.",
        "<b>Putting a policy somewhere discovery cannot find it.</b> Every check silently denies.",
        "<b>Registering a policy that discovery already handles.</b> One more line that can go stale.",
        "<b>Using `allows()` in a controller and forgetting to abort.</b> The check runs and nothing happens.",
      ],
      quiz: [
        {
          question: "How does Laravel find `PostPolicy` for the `Post` model?",
          options: [
            "It must be registered in a provider",
            "By convention: the model name plus `Policy`, in `app/Policies`",
            "From a config file",
            "From the database",
          ],
          correctIndex: 1,
          explanation: "Register manually only when the convention does not fit.",
        },
        {
          question: "What sends `Gate::allows('update', $post)` to a policy rather than a gate?",
          options: [
            "The ability name",
            "The model passed as an argument",
            "A config setting",
            "The controller it is called from",
          ],
          correctIndex: 1,
          explanation: "With no argument, Laravel looks for a gate named `update`.",
        },
        {
          question: "How do you check an ability that has no model, such as `create`?",
          options: [
            "`$user->can('create')`",
            "`$user->can('create', Post::class)`",
            "`Gate::define('create')`",
            "You cannot",
          ],
          correctIndex: 1,
          explanation: "The class name tells Laravel which policy to use.",
        },
        {
          question: "Is `@can('update', $post)` in a view enough to protect the update route?",
          options: [
            "Yes",
            "No; it only hides the button, and the request can still be sent directly",
            "Yes, if the route is named",
            "Only for authenticated users",
          ],
          correctIndex: 1,
          explanation: "The template check is politeness; the controller check is security.",
        },
      ],
    },
    {
      id: "authorize-and-the-attribute",
      title: "authorize(), and the #[Authorize] attribute",
      durationMinutes: 11,
      explanation: "The same rule, expressed three ways, each one further from the code that does the work.\n\n---\n\n### 1. Basic — `authorize()` in the controller\n\n```php\npublic function update(Request $request, Post $post)\n{\n    $this->authorize('update', $post);\n\n    $post->update($request->validated());\n}\n```\n\n```text\nallowed  →  continue\ndenied   →  AuthorizationException  →  403\n```\n\nCompare it with the version people write first:\n\n```php\nif (! $request->user()->can('update', $post)) {\n    abort(403);\n}\n```\n\nSame behaviour, more line noise, and one more place to get the negation backwards. In a controller, <b>`authorize()` is the default choice</b>, because a denial there has no sensible handling except stopping.\n\nIt is also available as a helper anywhere:\n\n```php\nGate::authorize('update', $post);\n```\n\nWhich matters in a route closure, a job, or an action class that has no controller around it.\n\n---\n\n### 2. Intermediate — the three styles, side by side\n\n```php\nGate::allows('update', $post);        // boolean\n$user->can('update', $post);          // boolean\n$this->authorize('update', $post);    // throws\n```\n\nThe rule stays identical in all three. What changes is what happens when the answer is no:\n\n```text\nboolean       you decide what to do next\nauthorize()   the request ends with a 403\n```\n\nWhich is why the choice follows the situation rather than taste:\n\n```text\nrendering a menu item        →  can()\nfiltering a list             →  can()\nreturning JSON about state   →  can()\nguarding a write             →  authorize()\nguarding a read of one       →  authorize()\n  private record\n```\n\nFor a resource controller there is a shortcut that wires all seven policy methods to the seven actions at once:\n\n```php\npublic function __construct()\n{\n    $this->authorizeResource(Post::class, 'post');\n}\n```\n\n<b>`index` checks `viewAny`, `show` checks `view`, `store` checks `create`, and so on.</b> One line instead of seven, and impossible to forget one.\n\n---\n\n### 3. Advanced — moving it out of the method\n\nLaravel 13 adds an attribute, so authorization becomes part of the method's declaration rather than its first statement:\n\n```php\n#[Authorize('update', 'post')]\npublic function update(Request $request, Post $post)\n{\n    $post->update($request->validated());\n}\n```\n\n```text\nHTTP request\n     ↓\n#[Authorize(...)]\n     ↓\nPostPolicy::update()\n     ↓\nallowed → the method runs\ndenied  → 403, the method never runs\n```\n\nThe second argument names the route parameter to authorize against, matching your route's binding.\n\nWhat this buys you is not fewer characters. <b>It is that the method body contains only the operation.</b> Reading `update()`, you see an update. The authorization is stated where the signature is, alongside the route model binding it depends on, and it cannot be lost in a refactor that rewrites the body.\n\nAnd the point the exercise at the end of this day makes:\n\n```text\nVERSION 1   Gate         →  update-post  →  the rule\nVERSION 2   Policy       →  PostPolicy::update()  →  the rule\nVERSION 3   #[Authorize] →  PostPolicy::update()  →  the rule\n```\n\n<b>The rule never changed.</b> `$user->id === $post->user_id` is the same line in all three. What moved is where it is declared and how it is invoked.\n\nThat is worth holding onto, because it is the difference between learning five Laravel APIs and understanding one system with several doors into it. When you meet middleware and Blade directives in the next lesson, they are two more doors, not two more concepts.",
      diagram: `authorize() in a controller

  \$this->authorize('update', \$post);

    allowed  →  continue
    denied   →  AuthorizationException  →  403

  versus the version people write first:

    if (! \$request->user()->can('update', \$post)) {
        abort(403);
    }

  Same behaviour, more noise, one more place to get
  the negation backwards.

  Gate::authorize(...) works outside controllers too:
  route closures, jobs, action classes.


The three styles

  Gate::allows('update', \$post)       boolean
  \$user->can('update', \$post)         boolean
  \$this->authorize('update', \$post)   throws

  The RULE is identical. Only the failure differs.

    boolean       you decide what to do next
    authorize()   the request ends with a 403

  rendering a menu item       →  can()
  filtering a list            →  can()
  guarding a write            →  authorize()
  reading one private record  →  authorize()


A resource controller, in one line

  \$this->authorizeResource(Post::class, 'post');

    index   → viewAny
    show    → view
    create  → create
    store   → create
    edit    → update
    update  → update
    destroy → delete

  Seven checks, impossible to forget one.


Laravel 13: out of the method entirely

  #[Authorize('update', 'post')]
  public function update(Request \$request, Post \$post)
  {
      \$post->update(\$request->validated());
  }

  HTTP request
       ↓
  #[Authorize(...)]
       ↓
  PostPolicy::update()
       ↓
  allowed → the method runs
  denied  → 403, the method never runs

  Not fewer characters. The method body now contains
  only the operation, and the authorization sits with
  the signature where a refactor cannot lose it.


The lesson of all three

  VERSION 1   Gate          →  update-post           →  the rule
  VERSION 2   Policy        →  PostPolicy::update()  →  the rule
  VERSION 3   #[Authorize]  →  PostPolicy::update()  →  the rule

  \$user->id === \$post->user_id is the same line in all
  three. Only where it is declared changed.

  Five APIs, or one system with several doors into it.`,
      codeExample: {
        title: "The same rule, three ways",
        code: `<?php
// ---------- Version 1: a gate ----------

// AppServiceProvider
Gate::define('update-post', function (User $user, Post $post) {
    return $user->id === $post->user_id;
});

// Controller
public function update(Request $request, Post $post)
{
    Gate::authorize('update-post', $post);

    $post->update($request->validated());
}


<?php
// ---------- Version 2: a policy ----------

// app/Policies/PostPolicy.php
public function update(User $user, Post $post): bool
{
    return $user->id === $post->user_id;   // the same line
}

// Controller
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post);

    $post->update($request->validated());
}


<?php
// ---------- Version 3: the attribute ----------

use Illuminate\\Auth\\Access\\Attributes\\Authorize;

#[Authorize('update', 'post')]
public function update(Request $request, Post $post)
{
    // Only the operation. Nothing else.
    $post->update($request->validated());
}

// The rule never changed. Only where it is declared.


<?php
// ---------- A whole resource controller ----------

class PostController extends Controller
{
    public function __construct()
    {
        // Wires all seven policy methods to the seven actions.
        $this->authorizeResource(Post::class, 'post');
    }

    public function index()   { /* viewAny */ }
    public function create()  { /* create  */ }
    public function store()   { /* create  */ }
    public function show(Post $post)    { /* view   */ }
    public function edit(Post $post)    { /* update */ }
    public function update(Post $post)  { /* update */ }
    public function destroy(Post $post) { /* delete */ }
}


<?php
// ---------- Choosing between boolean and throwing ----------

public function index(Request $request)
{
    Gate::authorize('viewAny', Post::class);   // guard the action

    return view('posts.index', [
        'posts' => Post::paginate(20),

        // Booleans, because these decide what to render.
        'canCreate' => $request->user()->can('create', Post::class),
    ]);
}

// Outside a controller, where $this->authorize() does not exist:
Route::delete('/posts/{post}', function (Post $post) {
    Gate::authorize('delete', $post);

    $post->delete();
});`,
      },
      keyTakeaways: [
        "<b>`$this->authorize('update', $post)` throws when denied</b>, which Laravel turns into a 403.",
        "It replaces `if (! $user->can(...)) abort(403)` with one line and no negation to get wrong.",
        "<b>`Gate::authorize()` works outside controllers</b>, in route closures, jobs and action classes.",
        "<b>The three styles share one rule and differ only in what happens on failure.</b>",
        "<b>Use a boolean for rendering decisions and `authorize()` for guarding actions.</b>",
        "<b>`authorizeResource(Post::class, 'post')` wires all seven policy methods to a resource controller</b> in one line.",
        "<b>Laravel 13's `#[Authorize]` attribute moves the check out of the method body</b> and onto its declaration.",
        "The gain is that the method contains only the operation, and a refactor cannot lose the check.",
        "<b>Across gate, policy and attribute, the rule itself never changes</b>: only where it is declared and how it is invoked.",
        "<b>These are doors into one authorization system, not separate features.</b>",
      ],
      commonMistakes: [
        "<b>Writing `if (! $user->can(...)) abort(403)` everywhere.</b> `authorize()` says the same thing once.",
        "<b>Calling `$this->authorize()` outside a controller.</b> Use `Gate::authorize()` there.",
        "<b>Using a boolean check to guard a write.</b> There is nothing sensible to do with `false` except stop.",
        "<b>Writing seven `authorize()` calls in a resource controller.</b> `authorizeResource()` does it in one, and cannot miss one.",
        "<b>Naming the wrong route parameter in `#[Authorize]`.</b> It has to match the binding in the route.",
      ],
      quiz: [
        {
          question: "What does `$this->authorize('update', $post)` do when denied?",
          options: [
            "Returns false",
            "Throws `AuthorizationException`, which Laravel turns into a 403",
            "Redirects to login",
            "Logs a warning",
          ],
          correctIndex: 1,
          explanation: "Which is why it needs no `if` and no `abort()`.",
        },
        {
          question: "What does `authorizeResource(Post::class, 'post')` do?",
          options: [
            "Registers the policy",
            "Wires each resource controller action to its matching policy method",
            "Creates the policy file",
            "Adds middleware to the routes",
          ],
          correctIndex: 1,
          explanation: "`index` to `viewAny`, `show` to `view`, and so on.",
        },
        {
          question: "What does `#[Authorize('update', 'post')]` change?",
          options: [
            "The authorization rule",
            "Where the check is declared: on the method rather than inside it",
            "The policy used",
            "The HTTP status returned",
          ],
          correctIndex: 1,
          explanation: "The method body is left with only the operation.",
        },
        {
          question: "Moving from a gate to a policy to the attribute, what changed?",
          options: [
            "The rule became stricter",
            "Nothing about the rule; only where it is declared and how it is invoked",
            "The user object",
            "The HTTP status",
          ],
          correctIndex: 1,
          explanation: "Several doors into one system, not several systems.",
        },
      ],
    },
    {
      id: "blade-and-middleware",
      title: "Blade directives & the can middleware",
      durationMinutes: 11,
      explanation: "Two more doors into the same system: one for what the user sees, one for what the request reaches.\n\n---\n\n### 1. Basic — Blade\n\n```blade\n@can('update', $post)\n    <a href=\"/posts/{{ $post->id }}/edit\">Edit</a>\n@endcan\n\n@cannot('update', $post)\n    <p>You cannot edit this post.</p>\n@endcannot\n\n@canany(['update', 'delete'], $post)\n    <div class=\"actions\">...</div>\n@endcanany\n```\n\n`@canany` means <i>any</i> of the listed abilities, which is what an actions menu needs: show the container if there is at least one thing to put in it.\n\nThey run the same policies as everything else, so a `@can` and an `authorize()` cannot disagree.\n\n<b>And the warning from the last lesson, because this is where it bites.</b> These directives decide what is <i>rendered</i>. They do not protect anything. A user who never sees the edit button can still send `PUT /posts/1`, and if the controller does not check, it works.\n\n```text\n@can          the button is hidden\nauthorize()   the request is refused\n```\n\nOne is a courtesy, the other is the lock. Write both, and never let the template be the only one.\n\n---\n\n### 2. Intermediate — the `can` middleware\n\nSometimes the check should happen before the controller runs at all:\n\n```php\nRoute::put('/posts/{post}', [PostController::class, 'update'])\n    ->middleware('can:update,post');\n```\n\n```text\nPUT /posts/123\n       ↓\ncan:update,post\n       ↓\nresolve the route parameter {post}  →  Post #123\n       ↓\nPostPolicy::update($user, $post)\n       ↓\n403, or on to the controller\n```\n\n<b>The second argument is the route parameter name, not a variable.</b> `can:update,post` means \"the `{post}` in the URL\", which Laravel resolves through route model binding before running the check.\n\nFor abilities with no model, pass the class:\n\n```php\n->middleware('can:create,App\\Models\\Post');\n```\n\nThere is a fluent version that reads better and avoids the string:\n\n```php\nRoute::put('/posts/{post}', ...)->can('update', 'post');\n```\n\nAnd it works on a group, which is where it earns its place:\n\n```php\nRoute::middleware('can:access-admin')->prefix('admin')->group(function () {\n    // every route inside\n});\n```\n\n---\n\n### 3. Advanced — choosing the door\n\nFour ways to reach the same policy method:\n\n```text\n@can              hide UI                    not security\ncan: middleware   before the controller      whole routes, groups\nauthorize()       inside the controller      needs data first\n#[Authorize]      on the method              the modern default\n```\n\nThe question that decides it: <b>does the check need anything the controller has to work out?</b>\n\n```text\nno   →  middleware or the attribute\nyes  →  authorize() inside the method\n```\n\nA route protected by \"can this user update this post\" needs only the model, which route binding already gives you, so it belongs on the route. A check that depends on the request body, such as \"can this user move the post into <i>that</i> category\", needs the request read first, so it belongs in the method.\n\nTwo practical notes.\n\n<b>Middleware runs before validation.</b> An unauthorized request with an invalid body gets a 403 rather than a 422, which is the right order: there is no point telling somebody their input is malformed when they were never allowed to send it.\n\n<b>And a group-level `can:` is worth more than it looks.</b> Twenty admin routes each carrying their own check is twenty chances to miss one; one check on the group is a single place to read and a single place to be wrong.\n\nThe pattern most applications settle on is: a coarse check on the group, a precise check per action, and Blade directives so the interface never offers something that will be refused.",
      diagram: `Blade

  @can('update', \$post)      ... @endcan
  @cannot('update', \$post)   ... @endcannot
  @canany(['update','delete'], \$post) ... @endcanany

  canany = ANY of these, which is what an actions
  menu needs: show the container if there is at least
  one thing to put in it.

  Same policies as everywhere else, so a @can and an
  authorize() cannot disagree.

  ⚠️  @can          the button is hidden
      authorize()   the request is REFUSED

      A user who never sees the button can still send
      PUT /posts/1. One is a courtesy, the other is
      the lock.


The can middleware

  ->middleware('can:update,post')

  PUT /posts/123
         ↓
  can:update,post
         ↓
  resolve {post} via route binding → Post #123
         ↓
  PostPolicy::update(\$user, \$post)
         ↓
  403, or on to the controller

  The second argument is the ROUTE PARAMETER NAME,
  not a variable.

  No model:  'can:create,App\\Models\\Post'
  Fluent:    ->can('update', 'post')
  On a group: Route::middleware('can:access-admin')->group(...)


Choosing the door

  @can              hide UI                 NOT security
  can: middleware   before the controller   whole routes, groups
  authorize()       inside the controller   needs data first
  #[Authorize]      on the method           the modern default

  Does the check need something the controller
  must work out first?

    no   →  middleware or the attribute
    yes  →  authorize() inside the method

  "Can this user update this post" needs only the model,
  which route binding gives you → put it on the route.

  "Can this user move it into THAT category" needs the
  request body → put it in the method.


  Middleware runs BEFORE validation, so an unauthorized
  request with a bad body gets 403, not 422. Right order:
  no point critiquing input they were never allowed to send.

  A group-level can: is worth more than it looks. Twenty
  admin routes each carrying their own check is twenty
  chances to miss one.

  Most applications settle on: a coarse check on the
  group, a precise check per action, and Blade directives
  so the UI never offers what will be refused.`,
      codeExample: {
        title: "Blade, middleware, and where each belongs",
        code: `{{-- resources/views/posts/show.blade.php --}}

<article>
    <h1>{{ $post->title }}</h1>
    <p>{{ $post->body }}</p>
</article>

@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit</a>
@endcan

@cannot('update', $post)
    <p class="muted">You cannot edit this post.</p>
@endcannot

{{-- Show the actions box if there is at least one action --}}
@canany(['update', 'delete'], $post)
    <div class="actions">
        @can('update', $post)
            <a href="{{ route('posts.edit', $post) }}">Edit</a>
        @endcan

        @can('delete', $post)
            <form method="POST" action="{{ route('posts.destroy', $post) }}">
                @csrf @method('DELETE')
                <button>Delete</button>
            </form>
        @endcan
    </div>
@endcanany

{{-- An ability with no model --}}
@can('create', App\Models\Post::class)
    <a href="{{ route('posts.create') }}">New post</a>
@endcan


<?php
// ---------- routes/web.php ----------

use App\\Http\\Controllers\\PostController;
use Illuminate\\Support\\Facades\\Route;

// The second argument is the ROUTE PARAMETER name.
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->middleware('can:update,post');

// The fluent version, without the string.
Route::delete('/posts/{post}', [PostController::class, 'destroy'])
    ->can('delete', 'post');

// No model: pass the class.
Route::post('/posts', [PostController::class, 'store'])
    ->middleware('can:create,App\\Models\\Post');

// A coarse check on a whole group: one place to read,
// one place to be wrong.
Route::middleware(['auth', 'can:access-admin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/reports', [ReportController::class, 'index']);
    });


<?php
// ---------- When the check needs the request ----------

class PostController extends Controller
{
    // Only the model is needed, so it goes on the route.
    #[Authorize('update', 'post')]
    public function update(Request $request, Post $post)
    {
        $post->update($request->validated());
    }

    // This one depends on the request body, so it has to
    // happen after the controller has read it.
    public function move(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $category = Category::findOrFail($request->category_id);

        // Not knowable from the route alone.
        $this->authorize('addPost', $category);

        $post->update(['category_id' => $category->id]);
    }
}


{{-- And the thing to remember --}}
{{-- @can hides the button. It does not stop the request. --}}
{{-- Every guarded action needs a check on the server too. --}}`,
      },
      keyTakeaways: [
        "<b>`@can`, `@cannot` and `@canany` run the same policies as the rest of the system.</b>",
        "`@canany` passes when any listed ability is allowed, which suits an actions menu.",
        "<b>Blade directives decide what is rendered, not what is permitted.</b>",
        "A user who never sees the edit button can still send the request, so the server must check too.",
        "<b>`can:update,post` middleware runs the policy before the controller</b>, resolving the route parameter first.",
        "<b>The second argument is the route parameter name</b>, not a variable, and a class name is used for model-less abilities.",
        "`->can('update', 'post')` is the fluent form, and `can:` works on a whole route group.",
        "<b>Put the check on the route when it needs only the model, and in the method when it needs the request.</b>",
        "<b>Middleware runs before validation</b>, so an unauthorized request gets a 403 rather than a 422.",
        "<b>A group-level check is one place to read and one place to be wrong</b>, instead of twenty chances to forget.",
      ],
      commonMistakes: [
        "<b>Treating `@can` as protection.</b> It hides the button and nothing else.",
        "<b>Passing a variable to `can:` middleware.</b> It expects the route parameter's name.",
        "<b>Forgetting the class for a model-less ability.</b> `can:create` alone has no policy to reach.",
        "<b>Putting a request-dependent check on the route.</b> The body has not been read yet.",
        "<b>Repeating the same coarse check on twenty routes.</b> Put it on the group instead.",
      ],
      quiz: [
        {
          question: "What does `@can('update', $post)` protect?",
          options: [
            "The update route",
            "Nothing; it only decides whether the markup is rendered",
            "The model from being changed",
            "The form submission",
          ],
          correctIndex: 1,
          explanation: "The request can still be sent directly, so the server must check too.",
        },
        {
          question: "In `can:update,post`, what is `post`?",
          options: [
            "A variable in the controller",
            "The name of the route parameter, resolved by route model binding",
            "The policy class",
            "The table name",
          ],
          correctIndex: 1,
          explanation: "Laravel resolves `{post}` to the model before checking.",
        },
        {
          question: "When should a check live inside the controller method rather than on the route?",
          options: [
            "Always",
            "When it depends on something the controller must read first, such as the request body",
            "When the model is soft-deletable",
            "When the route is a GET",
          ],
          correctIndex: 1,
          explanation: "Route-level checks only have the bound model.",
        },
        {
          question: "Why does an unauthorized request with an invalid body return 403 rather than 422?",
          options: [
            "Validation is disabled",
            "Middleware runs before validation, and there is no point critiquing input they were never allowed to send",
            "422 is only for APIs",
            "Laravel merges the two",
          ],
          correctIndex: 1,
          explanation: "Authorization first, then the shape of the input.",
        },
      ],
    },
    {
      id: "filtering-and-performance",
      title: "Filtering collections & authorization performance",
      durationMinutes: 10,
      explanation: "Authorization is application code, so it has the same performance problems as application code. This is the one nobody warns you about.\n\n---\n\n### 1. Basic — filtering by policy\n\nA page listing everything the user can act on:\n\n```php\n$posts = Post::all();\n\n$editable = $posts->filter(\n    fn (Post $post) => $request->user()->can('update', $post)\n);\n```\n\n```text\nall posts\n    ↓\npolicy check, per post\n    ↓\nonly the authorized ones\n```\n\nWhich is genuinely useful for admin dashboards, action lists and bulk-operation screens, where you cannot express the rule as a query.\n\nAnd immediately worth being careful about, because <b>you are now running your authorization logic once per row.</b>\n\n---\n\n### 2. Intermediate — the N+1 hiding in a policy\n\nHere is the trap:\n\n```php\n$posts = Post::all();\n\n$posts->filter(fn ($post) => $post->author->id === auth()->id());\n```\n\n`$post->author` is a lazy relationship. Day 15's N+1, except it is inside authorization code, where nobody looks for it.\n\n```text\n1 query    the posts\n100 queries  one author per post\n```\n\nThe fix is the same as it was then:\n\n```php\n$posts = Post::with('author')->get();\n```\n\nBut the reason it is worth restating is that <b>the query is in a policy, and the fix is in a controller.</b> Somebody profiling the page sees a hundred queries and no loop that explains them, because the loop is a `filter()` calling a method in another file.\n\nSo two habits:\n\n<b>Keep relationship access out of policies where you can.</b> Compare `$post->user_id` rather than `$post->author->id`: the foreign key is already on the row, and no query happens at all.\n\n<b>And when a policy does need a relationship, eager load it at the call site.</b> `Model::preventLazyLoading()` from Day 15 will tell you loudly if you forget.\n\n---\n\n### 3. Advanced — filter in the database instead\n\nStep back and the real answer is often that you should not be filtering in PHP.\n\n```text\nfilter in PHP                  filter in the query\n─────────────                  ───────────────────\nfetch every row                fetch only what matters\nrun the policy per row         one WHERE clause\npaginate afterwards, wrongly   paginate correctly\n```\n\nThat last line is the one that bites. <b>Paginate then filter and your pages have different sizes</b>, because you fetched twenty and threw eleven away. The count is wrong, the page links are wrong, and there is no way to fix it without asking the database the right question in the first place:\n\n```php\nPost::where('user_id', $request->user()->id)->paginate(20);\n```\n\nSame rule, expressed as a query. Twenty rows, correct pagination, no policy calls at all.\n\nWhich leaves a real question: the rule now exists twice, in the policy and in the query. A common answer is a scope that mirrors it:\n\n```php\npublic function scopeVisibleTo($query, User $user)\n{\n    return $query->where('user_id', $user->id)->orWhere('published', true);\n}\n```\n\nand a policy that reads the same way. <b>They can still drift, and a test that checks they agree is worth more than either of them.</b>\n\nSo the guidance, in order:\n\n```text\nCan the rule be a WHERE clause?      →  put it in the query\nNeeds per-model logic on a small     →  filter with the policy\n  set?\nA large list?                        →  the rule has to be a query\n```\n\nPolicies protect individual actions extremely well. They are not a filter for a list of ten thousand rows, and reaching for them there is how a page ends up loading the whole table.",
      diagram: `Filtering by policy

  \$posts->filter(fn (\$post) => \$user->can('update', \$post))

    all posts
        ↓
    policy check, per post
        ↓
    only the authorized ones

  Useful for admin dashboards, action lists and bulk
  screens. And you are now running authorization once
  per row.


The N+1 hiding in a policy

  \$posts = Post::all();
  \$posts->filter(fn (\$post) => \$post->author->id === auth()->id());

    1 query      the posts
    100 queries  one author per post

  Day 15's N+1, inside authorization code, where nobody
  looks for it. Someone profiling sees a hundred queries
  and no loop, because the loop is a filter() calling a
  method in another file.

  Two habits:

    Compare \$post->user_id, not \$post->author->id.
      The foreign key is already on the row.

    When a policy does need a relationship, eager load
      it at the call site. preventLazyLoading() will
      tell you loudly if you forget.


The real answer: filter in the database

  filter in PHP                 filter in the query
  ─────────────                 ───────────────────
  fetch every row               fetch only what matters
  policy per row                one WHERE clause
  pagination BREAKS             pagination is correct

  ⚠️  Paginate then filter and your pages have different
      sizes: you fetched 20 and threw 11 away. The count
      is wrong, the links are wrong, and there is no fix
      except asking the database the right question.

    Post::where('user_id', \$user->id)->paginate(20)

  Same rule. Twenty rows. No policy calls.


  The rule now exists twice: in the policy and in the
  query. A scope can mirror it:

    scopeVisibleTo(\$query, User \$user)

  They can still drift, and a test that checks they
  agree is worth more than either of them.


In order

  Can the rule be a WHERE clause?   →  put it in the query
  Per-model logic, small set?       →  filter with the policy
  A large list?                     →  it has to be a query

  Policies protect individual actions extremely well.
  They are not a filter for ten thousand rows.`,
      codeExample: {
        title: "Filtering, and the two ways it goes wrong",
        code: `<?php

use App\\Models\\Post;

// ---------- Filtering by policy: fine on a small set ----------

$posts = Post::all();

$editable = $posts->filter(
    fn (Post $post) => $request->user()->can('update', $post)
);

// Genuinely useful for admin dashboards and bulk-action
// screens, where the rule is not expressible as a query.


// ---------- The N+1 inside the policy ----------

// ❌ $post->author is lazy. 1 query for posts, 100 for authors.
public function update(User $user, Post $post): bool
{
    return $post->author->id === $user->id;
}

// ✓ The foreign key is already on the row. No query at all.
public function update(User $user, Post $post): bool
{
    return $post->user_id === $user->id;
}

// And when a relationship really is needed, load it at
// the call site:
$posts = Post::with('author')->get();

// Model::preventLazyLoading() from Day 15 turns the
// mistake into an exception in development.


<?php
// ---------- The one that breaks pagination ----------

// ❌ Fetch 20, throw 11 away. Pages have different sizes,
//    the total is wrong, and the links are wrong.
$posts = Post::paginate(20)
    ->filter(fn ($post) => $request->user()->can('update', $post));

// ✓ Ask the database the right question.
$posts = Post::where('user_id', $request->user()->id)->paginate(20);

// Twenty rows, correct pagination, no policy calls.


<?php
// ---------- Keeping the query and the policy in step ----------

// app/Models/Post.php
public function scopeVisibleTo($query, User $user)
{
    return $query->where(function ($q) use ($user) {
        $q->where('published', true)
          ->orWhere('user_id', $user->id);
    });
}

// app/Policies/PostPolicy.php
public function view(User $user, Post $post): bool
{
    return $post->published || $post->user_id === $user->id;
}

// The same rule, twice. They can drift, so test that
// they agree:

// test:
//   $visible = Post::visibleTo($user)->pluck('id');
//   $allowed = Post::all()->filter(fn ($p) => $user->can('view', $p))
//                          ->pluck('id');
//   expect($visible->sort()->values())
//       ->toEqual($allowed->sort()->values());


<?php
// ---------- The order to think in ----------

// 1. Can the rule be a WHERE clause?      → the query
$posts = Post::visibleTo($user)->paginate(20);

// 2. Per-model logic on a small set?      → filter with the policy
$actions = $selected->filter(fn ($p) => $user->can('delete', $p));

// 3. A large list?                        → it has to be a query`,
      },
      keyTakeaways: [
        "<b>Filtering a collection with `can()` runs your authorization logic once per row.</b>",
        "It suits admin dashboards and bulk-action screens where the rule is not expressible as a query.",
        "<b>A policy that reads a relationship creates an N+1</b>, hidden inside authorization code.",
        "<b>Compare `$post->user_id` rather than `$post->author->id`</b>: the foreign key is already on the row.",
        "When a policy genuinely needs a relationship, eager load it at the call site.",
        "`Model::preventLazyLoading()` turns the mistake into an exception in development.",
        "<b>Paginating and then filtering breaks pagination</b>: page sizes vary and the totals and links are wrong.",
        "<b>Express the rule as a query instead</b>, so the database returns exactly the rows the user may see.",
        "<b>A scope mirroring the policy keeps them aligned</b>, and a test that they agree is worth more than either.",
        "<b>Policies protect individual actions well; they are not a filter for a large list.</b>",
      ],
      commonMistakes: [
        "<b>Loading every row to filter by policy.</b> On a large table the page loads the whole table.",
        "<b>Reading a relationship inside a policy method.</b> One query per row, in a file nobody profiles.",
        "<b>Calling `paginate()` and then `filter()`.</b> Page sizes, totals and links all become wrong.",
        "<b>Duplicating the rule in a query without testing that they agree.</b> They drift, and one of them is wrong.",
        "<b>Using policies as the list filter on ten thousand rows.</b> The rule needs to be a `WHERE` clause.",
      ],
      quiz: [
        {
          question: "What is the risk of `$posts->filter(fn ($p) => $user->can('update', $p))`?",
          options: [
            "It bypasses the policy",
            "Authorization runs once per row, and any relationship the policy reads becomes an N+1",
            "It returns an array",
            "It ignores gates",
          ],
          correctIndex: 1,
          explanation: "The loop is in a `filter()` calling a method in another file, so it is easy to miss.",
        },
        {
          question: "How do you avoid a query inside a policy that checks ownership?",
          options: [
            "Cache the policy result",
            "Compare `$post->user_id` instead of `$post->author->id`",
            "Use a gate instead",
            "Eager load inside the policy",
          ],
          correctIndex: 1,
          explanation: "The foreign key is already on the row, so no query happens.",
        },
        {
          question: "What breaks when you paginate and then filter?",
          options: [
            "Nothing",
            "Page sizes vary and the totals and links are wrong, because rows were fetched then discarded",
            "The policy stops running",
            "The order changes",
          ],
          correctIndex: 1,
          explanation: "The database has to be asked the right question in the first place.",
        },
        {
          question: "For a list of ten thousand rows, where should the visibility rule live?",
          options: [
            "In the policy, applied with `filter()`",
            "In the query, as a `WHERE` clause, usually via a scope",
            "In Blade",
            "In middleware",
          ],
          correctIndex: 1,
          explanation: "Policies protect actions; they are not a list filter.",
        },
      ],
    },
    {
      id: "roles-permissions-and-choosing",
      title: "Roles, permissions & choosing the right tool",
      durationMinutes: 12,
      explanation: "Everything so far answers \"does this user own this thing\". Larger applications need something else.\n\n---\n\n### 1. Basic — roles and permissions\n\n```text\nUser\n ↓\nRole\n ↓\nPermissions\n```\n\n```text\nAdmin              Editor\n ├── users.view     ├── posts.view\n ├── users.create   ├── posts.create\n ├── users.update   └── posts.update\n └── users.delete\n```\n\n<b>A <i>role</i></b> is a named bundle of permissions; <b>a <i>permission</i></b> is a single named ability. The indirection is the point: promote somebody by changing their role, and every rule follows, without touching any code.\n\nThe distinction from ownership is worth stating:\n\n```text\nownership       does this user own this post?          the model decides\npermission      may this user update posts at all?     the role decides\n```\n\nMost real policies use both:\n\n```php\npublic function update(User $user, Post $post): bool\n{\n    return $user->hasPermission('posts.update')\n        && ($user->id === $post->user_id || $user->hasPermission('posts.update.any'));\n}\n```\n\n<b>Roles and policies are not alternatives.</b> The role says what kind of thing you may do; the policy says whether you may do it to <i>this</i> record.\n\n---\n\n### 2. Intermediate — building it yourself\n\nThe schema is Day 15's many-to-many, twice:\n\n```text\nusers    roles    permissions    role_user    permission_role\n```\n\n```text\nUser ──belongsToMany──> Role ──belongsToMany──> Permission\n```\n\nWhich is a morning's work. What follows is not:\n\n```text\nrole assignment UI\npermission checks that are fast\ncaching, because every request asks\nmiddleware integration\npolicy integration\nseeding and migrations for new permissions\ntesting all of it\n```\n\n<b>The performance one is the trap.</b> `$user->hasPermission('posts.update')` naively written is two joins on every check, and a page checking twelve abilities runs twelve of them. The fix is to load a user's permissions once per request and cache them, which is straightforward once you know to do it and invisible until the page is slow.\n\nBuild it yourself when the model is genuinely simple: a fixed set of roles, checked with `$user->role === 'admin'`, needs no tables at all and often no more than an enum.\n\n---\n\n### 3. Advanced — the actual decision\n\nThe question is not whether packages are good.\n\n```text\nSimple authorization?\n       ↓\nGates + Policies, and maybe a role column\n\nComplex RBAC?\n       ↓\nconsider a mature package\n```\n\nReach for a package when you need:\n\n```text\nmultiple roles per user\nmany permissions, changing over time\nteams or tenants\npermissions editable by admins at runtime\nrole management UI\n```\n\nAnd do not when you need \"the owner can edit their own posts\", which is four lines of policy and no dependency.\n\n<b>The cost of a package is not the code, it is that permissions become data.</b> A rule in a policy is in version control, reviewed and testable. A rule in a permissions table can be changed in production by somebody in an admin screen, and your tests will never know. That is exactly what you want for a product where customers configure their own roles, and exactly what you do not want for a rule that must always hold.\n\nAnd the summary of the whole day:\n\n```text\nSystem-level ability          →  Gate\n  access the admin dashboard\n\nModel or resource ability     →  Policy\n  update THIS post\n\nWhat kind of user is this     →  roles and permissions\n  editors may publish\n```\n\n```text\nHTTP Request\n     ↓\nAuthentication\n     ↓\nAuthenticated User\n     ↓\nAuthorization\n     │\n ┌───┴────────────┐\n ▼                ▼\nGate           Policy\n │                │\n └───────┬────────┘\n         ▼\n   allowed / 403\n```\n\nOne last piece of advice, and it is the one that matters most. <b>Authorization is the code most likely to be wrong and least likely to be noticed</b>, because the happy path works perfectly whether or not the rules do. Test the denials: log in as the wrong user and confirm the 403. Nothing else tells you the lock is fitted.",
      diagram: `Roles and permissions

  User  →  Role  →  Permissions

  Admin              Editor
   ├── users.view     ├── posts.view
   ├── users.create   ├── posts.create
   ├── users.update   └── posts.update
   └── users.delete

  A role is a named bundle. Promote somebody by changing
  their role, and every rule follows, with no code change.


  ownership     does this user own THIS post?      the model decides
  permission    may they update posts at all?      the role decides

  Most real policies use both, and they are not
  alternatives:

    return \$user->hasPermission('posts.update')
        && (\$user->id === \$post->user_id
            || \$user->hasPermission('posts.update.any'));


Building it yourself

  users  roles  permissions  role_user  permission_role

  User ─belongsToMany→ Role ─belongsToMany→ Permission

  The schema is a morning. What follows is not:

    role assignment UI
    permission checks that are fast
    caching, because every request asks
    middleware integration
    policy integration
    seeding for new permissions
    testing all of it

  ⚠️  hasPermission() naively written is two joins per
      check, and a page checking twelve abilities runs
      twelve of them. Load once per request and cache.

  A fixed set of roles checked with \$user->role === 'admin'
  needs no tables at all. Often an enum is the answer.


The decision

  Simple?        →  Gates + Policies, maybe a role column
  Complex RBAC?  →  consider a mature package

  Reach for a package when you need:
    multiple roles per user
    many permissions, changing over time
    teams or tenants
    permissions editable by admins at runtime
    a role management UI

  Do not, for "the owner can edit their own posts".


  The real cost of a package: permissions become DATA.

    a rule in a policy      in version control,
                            reviewed, testable
    a rule in a table       changeable in production by
                            somebody in an admin screen,
                            and your tests never know

  Right for a product where customers configure roles.
  Wrong for a rule that must always hold.


The whole day

  System-level ability       →  Gate
  Model or resource ability  →  Policy
  What kind of user is this  →  roles and permissions

  HTTP Request → Authentication → Authenticated User
                                        ↓
                                  Authorization
                                        │
                                  ┌─────┴─────┐
                                  ▼           ▼
                                Gate       Policy
                                  └─────┬─────┘
                                        ▼
                                 allowed / 403


  Authorization is the code most likely to be wrong and
  least likely to be noticed: the happy path works
  perfectly whether or not the rules do.

  Test the DENIALS.`,
      codeExample: {
        title: "Roles, permissions, and where policies fit",
        code: `<?php
// ---------- The simplest thing that works ----------

// A fixed set of roles needs no tables at all.
enum Role: string
{
    case Admin  = 'admin';
    case Editor = 'editor';
    case Reader = 'reader';
}

class User extends Authenticatable
{
    protected function casts(): array
    {
        return ['role' => Role::class];
    }

    public function isEditor(): bool
    {
        return in_array($this->role, [Role::Admin, Role::Editor], true);
    }
}

// PostPolicy
public function create(User $user): bool
{
    return $user->isEditor();
}


<?php
// ---------- Roles and permissions as tables ----------

// users  roles  permissions  role_user  permission_role

class User extends Authenticatable
{
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasPermission(string $name): bool
    {
        // ❌ Two joins on EVERY check. A page checking twelve
        //    abilities runs twelve of these.
        // return $this->roles()
        //     ->whereHas('permissions', fn ($q) => $q->where('name', $name))
        //     ->exists();

        // ✓ Load once per request, then check in memory.
        return $this->permissionNames()->contains($name);
    }

    protected function permissionNames(): Collection
    {
        return once(fn () => $this->roles
            ->loadMissing('permissions')
            ->flatMap->permissions
            ->pluck('name')
            ->unique());
    }
}


<?php
// ---------- Permissions and ownership, together ----------

class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        // The role says what kind of thing you may do.
        if (! $user->hasPermission('posts.update')) {
            return false;
        }

        // The policy says whether you may do it to THIS one.
        return $post->user_id === $user->id
            || $user->hasPermission('posts.update.any');
    }
}

// Roles and policies are not alternatives.


<?php
// ---------- Test the denials ----------

it('lets an owner update their post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->for($user)->create();

    $this->actingAs($user)
        ->put("/posts/{$post->id}", ['title' => 'New'])
        ->assertRedirect();
});

it('stops another user updating it', function () {
    $post    = Post::factory()->create();
    $someone = User::factory()->create();

    // This is the test that proves the lock is fitted.
    $this->actingAs($someone)
        ->put("/posts/{$post->id}", ['title' => 'New'])
        ->assertForbidden();
});

it('stops a guest updating it', function () {
    $post = Post::factory()->create();

    $this->put("/posts/{$post->id}", ['title' => 'New'])
        ->assertRedirect('/login');
});`,
      },
      keyTakeaways: [
        "<b>A role is a named bundle of permissions</b>, so promoting somebody changes what they may do with no code change.",
        "<b>Ownership asks whether this user owns this record; a permission asks what kind of thing they may do at all.</b>",
        "<b>Roles and policies are not alternatives</b>: most real policies check a permission and then ownership.",
        "Rolling your own is a many-to-many schema plus assignment, caching, middleware, seeding and tests.",
        "<b>A naive `hasPermission()` runs two joins per check</b>, so load a user's permissions once per request.",
        "<b>A fixed set of roles needs no tables</b>, and an enum plus a policy is often the whole answer.",
        "<b>Reach for a package when permissions must change at runtime</b>, or you need teams, many roles, or a management UI.",
        "<b>The real cost of a package is that permissions become data</b>, changeable in production and invisible to your tests.",
        "That is right when customers configure their own roles, and wrong for a rule that must always hold.",
        "<b>Gates for system-level abilities, policies for model abilities, roles for what kind of user somebody is.</b>",
        "<b>Authorization is the code most likely to be wrong and least likely to be noticed</b>, so test the denials.",
      ],
      commonMistakes: [
        "<b>Replacing policies with roles.</b> A role cannot know whether this particular record belongs to you.",
        "<b>Querying permissions on every check.</b> Twelve abilities on a page means twelve round trips.",
        "<b>Reaching for a package for \"owners can edit their own posts\".</b> That is four lines and no dependency.",
        "<b>Putting a rule that must always hold into an editable permissions table.</b> It can be switched off in production.",
        "<b>Only testing the happy path.</b> The application behaves identically whether or not the rules work.",
      ],
      quiz: [
        {
          question: "What is the difference between a permission check and an ownership check?",
          options: [
            "None",
            "A permission says what kind of thing you may do; ownership says whether you may do it to this record",
            "Permissions are for admins only",
            "Ownership is checked by middleware",
          ],
          correctIndex: 1,
          explanation: "Most real policies use both.",
        },
        {
          question: "What is the performance trap in a hand-rolled permission system?",
          options: [
            "Too many roles",
            "Checking a permission queries the database every time, so a page runs one query per ability",
            "Policies cannot be cached",
            "Migrations are slow",
          ],
          correctIndex: 1,
          explanation: "Load a user's permissions once per request and check in memory.",
        },
        {
          question: "When is a roles-and-permissions package worth it?",
          options: [
            "Always",
            "When permissions change at runtime, or you need many roles, teams or a management UI",
            "For any application with an admin",
            "Never; policies are enough",
          ],
          correctIndex: 1,
          explanation: "For \"owners edit their own posts\", a policy is four lines.",
        },
        {
          question: "Why test the denials rather than only the happy path?",
          options: [
            "Denials are faster to test",
            "The application behaves identically whether or not the rules work, so only a denial proves the lock is fitted",
            "Laravel requires it",
            "To measure performance",
          ],
          correctIndex: 1,
          explanation: "Authorization is the code most likely to be wrong and least likely to be noticed.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the difference between authentication and authorization?",
      options: [
        "None",
        "Authentication asks who you are; authorization asks what you may do",
        "Authorization runs first",
        "Authentication is for APIs only",
      ],
      correctIndex: 1,
      explanation: "The `auth` middleware answers the first and nothing about the second.",
    },
    {
      question: "When should you use a gate rather than a policy?",
      options: [
        "When the model is soft-deletable",
        "When the ability is not about a particular model, such as accessing the admin dashboard",
        "When there are more than three abilities",
        "Gates are always preferable",
      ],
      correctIndex: 1,
      explanation: "Model abilities belong in a policy, gathered in one class.",
    },
    {
      question: "What should `Gate::before()` return when it has no opinion?",
      options: ["`false`", "`true`", "Nothing, so it returns null", "An empty response"],
      correctIndex: 2,
      explanation: "Any non-null return is the final answer, so `false` denies everything.",
    },
    {
      question: "What are the seven conventional policy methods?",
      options: [
        "index, show, create, store, edit, update, destroy",
        "viewAny, view, create, update, delete, restore, forceDelete",
        "read, write, delete, restore, publish, archive, share",
        "can, cannot, allow, deny, before, after, inspect",
      ],
      correctIndex: 1,
      explanation: "`viewAny` and `create` take no model, because there is not one yet.",
    },
    {
      question: "How does Laravel discover a policy automatically?",
      options: [
        "From a config array",
        "By convention: the model name plus `Policy`, in `app/Policies`",
        "By scanning for the `Policy` interface",
        "It does not; policies must be registered",
      ],
      correctIndex: 1,
      explanation: "A policy discovery cannot find means every check is silently denied.",
    },
    {
      question: "What is the difference between `$user->can()` and `authorize()`?",
      options: [
        "None",
        "`can()` returns a boolean; `authorize()` throws when denied, which becomes a 403",
        "`authorize()` only works with gates",
        "`can()` also checks authentication",
      ],
      correctIndex: 1,
      explanation: "Booleans for rendering decisions, `authorize()` for guarding actions.",
    },
    {
      question: "What does `#[Authorize]` change about a controller method?",
      options: [
        "The authorization rule itself",
        "Where the check is declared: on the method rather than as its first statement",
        "The policy that runs",
        "The status code returned",
      ],
      correctIndex: 1,
      explanation: "The body is left with only the operation.",
    },
    {
      question: "Is `@can('update', $post)` enough to protect the update route?",
      options: [
        "Yes",
        "No; it only hides the markup, and the request can still be sent directly",
        "Yes, with route model binding",
        "Only for guests",
      ],
      correctIndex: 1,
      explanation: "The template check is politeness; the controller check is security.",
    },
    {
      question: "In `can:update,post` middleware, what is `post`?",
      options: [
        "A controller property",
        "The route parameter name, resolved by route model binding",
        "The policy class",
        "The database table",
      ],
      correctIndex: 1,
      explanation: "Laravel resolves `{post}` before running the policy.",
    },
    {
      question: "How can filtering a collection with policies cause N+1 queries?",
      options: [
        "It runs the query twice",
        "The policy runs per row, so any relationship it reads is fetched once per model",
        "Collections cannot be filtered",
        "It reloads the user each time",
      ],
      correctIndex: 1,
      explanation: "The loop is a `filter()` calling a method in another file, so nobody spots it.",
    },
    {
      question: "When should you use a roles-and-permissions package rather than policies alone?",
      options: [
        "For any application with an admin user",
        "When permissions must change at runtime, or you need many roles, teams or a management UI",
        "Whenever there is more than one role",
        "Never",
      ],
      correctIndex: 1,
      explanation: "For \"owners can edit their own posts\", a policy is four lines.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Lock InvoiceHub down: nobody sees or touches an invoice that is not theirs, expressed as a policy and enforced everywhere a request can arrive.",
    brief: "Yesterday gave InvoiceHub accounts. It did not give it any protection: every signed-in user can still open every invoice, because `auth` middleware only says somebody is logged in.\n\nToday closes that, and the interesting part is that the rule is trivial. `$invoice->user_id === $user->id` is the whole thing. What takes the day is making sure that one line is consulted on every path into an invoice: the list, the detail page, the edit form, the update, the delete, the PDF, the API, and whatever else you built.\n\nSo the discipline for the day is the opposite of usual: <b>write the failing case first.</b> For every route, log in as the wrong user and confirm you get a 403 before you write the check that produces it. A test that has never failed proves nothing.\n\nYou will also do the same rule three times, as a gate, then a policy, then an attribute. That is deliberate. Feeling the rule stay identical while the plumbing changes is the point of the exercise.",
    steps: [
      "Log in as user A, create an invoice, note its id. Log in as user B and open that invoice's URL. Write down everything B can currently see and do.",
      "Start with a gate: `Gate::define('update-invoice', ...)` comparing `user_id`. Call `Gate::authorize()` in the update action and confirm B now gets a 403.",
      "Move it into an `InvoicePolicy` with `php artisan make:policy InvoicePolicy --model=Invoice`, and switch the controller to `$this->authorize('update', $invoice)`. Confirm the test still passes without touching the rule.",
      "Move it once more onto the method with `#[Authorize('update', 'invoice')]`. Write down what changed between the three versions and what did not.",
      "Fill in the rest of the policy: `viewAny`, `view`, `create`, `update`, `delete`, and `forceDelete` restricted to admins. Note which two take no model and why.",
      "Add `$this->authorizeResource(Invoice::class, 'invoice')` to the controller and delete the individual calls. Confirm every action is still protected by testing each one as the wrong user.",
      "Fix the list page. It currently shows every invoice; make the query return only the signed-in user's, and confirm the policy and the query agree.",
      "Deliberately do it the wrong way first: `Invoice::paginate(20)->filter(...)`. Look at the page sizes and the total, write down what broke, then revert to the query.",
      "Add `@can` and `@canany` in the views so the edit and delete buttons only appear for the owner. Then send the delete request with curl as the wrong user and confirm it is still refused.",
      "Add an `access-admin` gate and put the admin routes behind `can:access-admin` at the group level rather than per route. Explain in a comment why the group is the better place.",
      "Add a `Gate::before()` for a super admin, then deliberately return `false` from it instead of null, and see what breaks. Put it back.",
      "Give the view policy a denial reason with `Response::deny()`, then change it to `denyAsNotFound()` and note which one you would ship for invoices, and why.",
      "Add a `Gate::after()` that logs every denial with the user id and ability. Browse as the wrong user for a minute and read the log.",
      "Check the policy for hidden queries: if anything reads a relationship, replace it with the foreign key or eager load at the call site. Confirm the invoice list runs the same number of queries with 5 invoices as with 200.",
      "Add a role: `admin` may view any invoice, `user` may view only their own. Put the permission check and the ownership check in the same policy method and note which part each answers.",
      "Write the denial tests: guest on each route, wrong user on each route, owner on each route, admin on each route. Include the API endpoints if you built any.",
      "Finally, list every path into an invoice in your application and tick off the check protecting each one. Anything without a tick is the bug this day exists to find.",
    ],
    acceptance: [
      "User B gets a 403 or 404 on every route belonging to user A's invoice: view, edit, update, delete and any API endpoint.",
      "The invoice list shows only the signed-in user's invoices, filtered in the query rather than in PHP.",
      "Pagination is correct: every page holds the same number of rows and the total matches.",
      "The edit and delete buttons are hidden for non-owners, and the requests are still refused when sent directly.",
      "Every action of the invoice controller is authorized, and you proved it by testing each one as the wrong user.",
      "Admin routes are protected at the group level, not route by route.",
      "The policy runs no queries, and the invoice list has the same query count with 5 invoices as with 200.",
      "The denial log shows the user id and the ability for every refusal.",
      "There is a test for the guest, the wrong user, the owner and the admin on each route, and the denial tests failed before you wrote the checks.",
      "You can list every path into an invoice and name the check protecting it.",
    ],
    stretch: [
      "Write a test asserting that the list query and the `view` policy agree: every invoice the query returns passes the policy, and every one it excludes fails it.",
      "Add a `shared_with` many-to-many so an invoice can be shared with another user, and extend the policy without breaking any existing test.",
      "Add `Response::denyAsNotFound()` for invoices and prove from an incognito window that sequential ids reveal nothing about which invoices exist.",
    ],
  },
};
