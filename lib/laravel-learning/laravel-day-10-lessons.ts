import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_10_LESSONS: LessonDay = {
  day: 10,
  title: "Session, flash data & cookies",
  totalMinutes: 67,
  difficulty: "Beginner",
  lessons: [
    {
      id: "why-sessions-exist",
      title: "Why sessions exist, and how they differ from cookies",
      durationMinutes: 10,
      explanation: "A web application needs a way to remember things between requests.\n\nA <b>session</b> (server-side data remembered between requests) is what carries \"this is Rajan\" from the request that logged him in to the request that loads his dashboard. HTTP will not do that for you.\n\nHTTP is <b>stateless</b>, meaning every request is independent and does not automatically remember anything about the requests before it.\n\nThat sounds harmless until you try to build a login. The request that logs the user in and the request that loads the dashboard are two separate conversations, and the second one has no memory of the first.\n\nSessions are how you bridge that gap: write on one request, read on the next.\n\n---\n\n### 1. Basic — three requests, no memory\n\n```text\nBrowser  →  GET  /login       →  Server: here is the login page\nBrowser  →  POST /login       →  Server: login successful\nBrowser  →  GET  /dashboard   →  Server: ...who is this user?\n```\n\nThe third request has no idea what happened in the second one. Put a session in the middle and the gap closes:\n\n```text\nRequest 1  →  Laravel  →  save information\n                            │\n                            ↓\n                       session storage\n                            │\n                            ↓\nRequest 2  →  Laravel  →  read information\n```\n\nThat is the whole idea. Everything else today is method names.\n\n---\n\n### 2. Intermediate — what actually goes in a session\n\n• Login information, meaning which user is signed in\n• Flash messages such as \"Saved successfully\"\n• Shopping carts\n• Temporary form data across a multi-step form\n• User preferences and short-lived application state\n\nThe mental model to keep for the rest of the day:\n\n```text\nsession()->put()      remember this value\nsession()->get()      give me back the remembered value\nsession()->flash()    remember this only for the next request\nsession()->forget()   remove this one value\nsession()->flush()    remove everything\n$request->cookie()    read something the browser sent us\n```\n\nOne sentence: sessions let Laravel remember users between requests, and cookies let the browser hold small pieces of data.\n\n---\n\n### 3. Advanced — session vs cookie, precisely\n\nThese two get mixed up constantly, so it is worth being precise about where the data actually sits.\n\n• <b>Session</b> — the browser carries only a session ID. The real data lives on the server, in whatever session driver you configured.\n  ↳ It can hold as much as you like, and the user cannot read or change it\n• <b>Cookie</b> — a small piece of data stored in the user's browser, sent back with every request to your domain.\n  ↳ Small, roughly 4KB, and the user can inspect and delete it\n\nSo a session <i>uses</i> a cookie to carry its ID, but a session is not a cookie. A session is application state across requests; a cookie is a small piece of data parked in the browser.\n\n```text\nSESSION\n  Browser  ──[ session ID cookie ]──→  Laravel  ──→  session storage\n                                                     (file / database / redis)\n\nCOOKIE\n  Laravel  ──[ Set-Cookie: theme=dark ]──→  Browser  ──→  stored locally\n```\n\nOne thing blurs the line, and it is worth knowing before it confuses you: Laravel's `cookie` session driver puts the session data itself into an encrypted cookie. That is a session stored in a cookie, which is unusual and still a session as far as your controller code is concerned.",
      diagram: `HTTP is stateless: three requests, no memory

  Browser  →  GET  /login       →  here is the login page
  Browser  →  POST /login       →  login successful
  Browser  →  GET  /dashboard   →  ...who is this user?

  The third request knows nothing about the second.


A session bridges the gap

  Request 1  →  Laravel  →  save information
                              │
                              ↓
                         session storage
                              │
                              ↓
  Request 2  →  Laravel  →  read information


Where the data actually lives

  SESSION
    Browser  ──[ session ID ]──→  Laravel  ──→  session storage
                                                (file / database / redis)

    Real data on the SERVER. The browser only carries the ID.
    As big as you like. The user cannot read or change it.

  COOKIE
    Laravel  ──[ Set-Cookie: theme=dark ]──→  Browser  ──→  stored locally

    Real data in the BROWSER, riding along on every request.
    About 4KB. The user can read, edit and delete it.

  A session USES a cookie to carry its ID.
  It is not a cookie.`,
      codeExample: {
        title: "Write on one request, read on the next",
        code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class AuthController extends Controller
{
    // REQUEST 1: this method remembers something.
    public function login(Request $request)
    {
        // Real authentication arrives on Day 16. For now, pretend.
        $request->session()->put('user_id', 123);

        return redirect('/dashboard');
    }
}

class DashboardController extends Controller
{
    // REQUEST 2: a completely separate request, which can still read it.
    public function index(Request $request)
    {
        $userId = $request->session()->get('user_id');

        // Without the session, $userId would be null here and there
        // would be no way to know who is asking.
        return view('dashboard', ['userId' => $userId]);
    }
}


// ---------- What travels on the wire ----------

// SESSION: only the ID leaves your server.
//   Response:  Set-Cookie: laravel_session=eyJpdiI6...
//   Request:   Cookie: laravel_session=eyJpdiI6...
//   The value 123 never goes near the browser.

// COOKIE: the value itself leaves your server.
//   Response:  Set-Cookie: theme=dark
//   Request:   Cookie: theme=dark

// So: user id, cart, permissions  →  session (server side)
//     theme, language, "hide this banner"  →  cookie is fine`,
      },
      keyTakeaways: [
        "<b>HTTP is stateless</b>: every request is independent and remembers nothing about the ones before it.",
        "A <b>session</b> is server-side data remembered between requests: write on one request, read on the next.",
        "Sessions hold login state, flash messages, carts, multi-step form data and short-lived preferences.",
        "<b>Session data lives on the server.</b> The browser carries only a session ID.",
        "<b>Cookie data lives in the browser</b>, is about 4KB at most, and the user can read and delete it.",
        "A session <i>uses</i> a cookie to carry its ID, which is why the two get confused, but they are not the same thing.",
        "Laravel's `cookie` session driver is the exception that blurs the line: the session data itself goes into an encrypted cookie.",
      ],
      commonMistakes: [
        "<b>Using the words session and cookie interchangeably.</b> The question that settles it is always: where does the data physically sit?",
        "<b>Expecting a value to survive without a session.</b> Setting a property on a controller does nothing for the next request; the object is gone.",
        "<b>Putting large data in a cookie.</b> Roughly 4KB is the whole budget, and browsers silently drop what does not fit.",
        "<b>Assuming the session ID cookie is optional.</b> Block cookies for your domain and every session feature stops working.",
        "<b>Storing a user id in a plain cookie to \"save a session lookup\".</b> That is a value the user can edit, so it is a value you cannot trust.",
      ],
      quiz: [
        {
          question: "What does it mean that HTTP is stateless?",
          options: [
            "Requests cannot carry data",
            "Every request is independent and remembers nothing about earlier ones",
            "The server has no memory at all",
            "Only GET requests are allowed",
          ],
          correctIndex: 1,
          explanation: "Which is exactly the gap a session exists to bridge.",
        },
        {
          question: "Where does the data in a session physically live?",
          options: [
            "In the browser",
            "In the URL",
            "On the server, in the configured session driver",
            "In the HTML of the page",
          ],
          correctIndex: 2,
          explanation: "The browser only carries the session ID.",
        },
        {
          question: "What does the browser hold for a session?",
          options: [
            "The full session data",
            "Nothing at all",
            "A copy of the user record",
            "A session ID, in a cookie",
          ],
          correctIndex: 3,
          explanation: "So a session depends on a cookie without being one.",
        },
        {
          question: "Roughly how much data can a single cookie hold?",
          options: [
            "About 4KB",
            "About 4MB",
            "Unlimited",
            "Exactly 1024 characters",
          ],
          correctIndex: 0,
          explanation: "Which is why anything sizeable belongs in the session instead.",
        },
      ],
    },
    {
      id: "session-drivers",
      title: "Session drivers, and choosing one",
      durationMinutes: 11,
      explanation: "The session API never changes. Where the data lands does.\n\nA <b>session driver</b> (the storage backend Laravel keeps session data in) is simply the place your session values are written. Same code in your controllers, different storage behind it.\n\n---\n\n### 1. Basic — the four you will meet\n\n```text\nDriver      Where the data lives                When to use it\n──────      ────────────────────                ──────────────\nfile        storage/framework/sessions/         the default, fine locally\ndatabase    a sessions table                    sessions in your database\nredis       Redis, an in-memory store           fast, shared across servers\ncookie      the browser, encrypted              no server storage at all\n```\n\nYou pick one in `.env`:\n\n```bash\nSESSION_DRIVER=file        # default, fine for local development\n# SESSION_DRIVER=database\n# SESSION_DRIVER=redis\n# SESSION_DRIVER=cookie\n```\n\nAnd `config/session.php` holds the rest:\n\n```php\n'driver'   => env('SESSION_DRIVER', 'file'),\n'lifetime' => env('SESSION_LIFETIME', 120),   // minutes\n'encrypt'  => false,\n'cookie'   => env('SESSION_COOKIE', 'laravel_session'),\n```\n\nThe exact set of options varies with the Laravel version, so read `config/session.php` in your own project rather than trusting memory.\n\n---\n\n### 2. Intermediate — which one to start with\n\nStart with `file` and change it only when something forces you to.\n\n• <b>`file`</b> is the default and needs zero setup. Sessions land in `storage/framework/sessions/`.\n  ↳ Perfectly fine for local development and small single-server sites\n• <b>`database`</b> when you want sessions queryable alongside your data, or when you run more than one application server.\n  ↳ Needs a `sessions` table, which means a migration, and migrations are Day 12\n• <b>`redis`</b> when session reads and writes become a bottleneck, or you have several servers behind a load balancer.\n  ↳ Fastest option, but Redis is one more service you have to keep running\n• <b>`cookie`</b> when you want no server-side storage at all.\n  ↳ Practically limited by the roughly 4KB a cookie can hold\n\n<i>A note on timing: stay on `file` today. Come back and switch the driver once migrations from \"Migrations, Query Builder, Eloquent models & CRUD patterns\" on Day 12 feel familiar.</i>\n\nThe useful part is that your controller code does not change at all. Swapping `SESSION_DRIVER` in `.env` is the whole migration path.\n\n---\n\n### 3. Advanced — the Redis key prefix\n\nOne practical detail if you run sessions on Redis.\n\nRedis stores everything as flat keys, and one Redis server is often shared by several applications, plus your own cache sitting alongside your sessions. Without a prefix, two applications both writing `session:123` will overwrite each other, and you get logged-out users with no obvious cause.\n\n```text\nOne Redis server, two applications, no prefix:\n\n  session:123        ←  which application owns this?\n  cache:homepage     ←  and this?\n\nWith a prefix per application:\n\n  app1_database_session:123\n  app1_database_cache:homepage\n  app2_database_session:123      ←  no longer collides\n```\n\n```bash\n# .env\nREDIS_PREFIX=myapp_database_\n```\n\n```php\n// config/database.php\n'redis' => [\n    'options' => [\n        'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel')) . '_database_'),\n    ],\n],\n```\n\nIt keeps keys readable when you inspect Redis by hand, and it stops collisions between applications. The failure it prevents is a nasty one, because nothing errors: keys just quietly belong to whoever wrote last.",
      diagram: `One API, four places to put the data

  $request->session()->put('user_id', 123)
                    │
      ┌─────────────┼─────────────┬──────────────┐
      ↓             ↓             ↓              ↓
    file        database        redis         cookie
  storage/     a sessions     in-memory     the browser,
  framework/     table          store        encrypted
  sessions/

  Your controller code is identical in all four.
  Swapping SESSION_DRIVER in .env is the whole migration.


Which one, and when

  file      → default, zero setup, one server, local dev
  database  → queryable, several app servers
              needs a sessions table → a migration → Day 12
  redis     → fastest, shared cleanly across servers
              one more service to keep running
  cookie    → no server storage, capped by ~4KB


The Redis prefix, and the bug it prevents

  No prefix, one Redis, two apps:

    app A writes  session:123  ─┐
                                ├─→  same key, last write wins
    app B writes  session:123  ─┘         users log out at random

  With a prefix:

    app1_database_session:123
    app2_database_session:123    ←  no collision

  Nothing errors either way. That is what makes it nasty.`,
      codeExample: {
        title: "Configuring a driver",
        code: `# ---------- .env: pick exactly one ----------

SESSION_DRIVER=file          # the default, fine for local development
# SESSION_DRIVER=database    # needs a sessions table (a migration, Day 12)
# SESSION_DRIVER=redis       # fastest, and shared across several servers
# SESSION_DRIVER=cookie      # no server-side storage, capped by cookie size

SESSION_LIFETIME=120         # minutes of inactivity before it expires

# Prefix every Redis key with this application's name, so two apps
# sharing one Redis server cannot overwrite each other's sessions.
REDIS_PREFIX=invoicehub_database_


<?php
// ---------- config/session.php ----------
// Read this file in your own project. The option list changes
// between Laravel versions.

return [
    'driver'   => env('SESSION_DRIVER', 'file'),
    'lifetime' => env('SESSION_LIFETIME', 120),   // minutes
    'encrypt'  => false,
    'files'    => storage_path('framework/sessions'),
    'cookie'   => env('SESSION_COOKIE', 'laravel_session'),
];


<?php
// ---------- config/database.php ----------

return [
    'redis' => [
        'options' => [
            'prefix' => env(
                'REDIS_PREFIX',
                Str::slug(env('APP_NAME', 'laravel')) . '_database_',
            ),
        ],
    ],
];

// Without a prefix  →  session:123
// With a prefix     →  invoicehub_database_session:123


// ---------- The point of drivers ----------
// This line is the same no matter which driver is configured:
$request->session()->put('user_id', 123);`,
      },
      keyTakeaways: [
        "A <b>session driver</b> is just the storage behind the session API; your controller code never changes.",
        "<b>`file`</b> is the default, needs no setup, and is the right place to start.",
        "<b>`database`</b> needs a `sessions` table, so it needs a migration, which is Day 12.",
        "<b>`redis`</b> is fastest and shares cleanly across several servers, at the cost of running one more service.",
        "<b>`cookie`</b> stores the session in the browser itself and is capped by the roughly 4KB a cookie holds.",
        "Swapping `SESSION_DRIVER` in `.env` is the entire migration path between drivers.",
        "On Redis, set a <b>key prefix</b> per application, or two apps sharing one server overwrite each other's session keys with no error.",
      ],
      commonMistakes: [
        "<b>Switching to `database` before running the migration.</b> The driver has nowhere to write, and the error rarely mentions sessions.",
        "<b>Reaching for `redis` on day one.</b> You take on a service to keep running before you have a problem it solves.",
        "<b>Putting a lot of data in the session while on the `cookie` driver.</b> Past roughly 4KB the browser drops it and values vanish.",
        "<b>Running several application servers on the `file` driver.</b> Each server has its own directory, so a user's session exists on one machine and not the others.",
        "<b>Leaving the Redis prefix at its default while two applications share one Redis.</b> Both write `session:123` and users log out at random.",
      ],
      quiz: [
        {
          question: "Which session driver is Laravel's default?",
          options: [
            "redis",
            "database",
            "file",
            "cookie",
          ],
          correctIndex: 2,
          explanation: "It writes to `storage/framework/sessions/` and needs no setup.",
        },
        {
          question: "What does the `database` session driver need before it will work?",
          options: [
            "A `sessions` table, created by a migration",
            "Redis installed",
            "An API key",
            "Encryption turned off",
          ],
          correctIndex: 0,
          explanation: "Which is why the switch waits until Day 12.",
        },
        {
          question: "What has to change in your controllers when you swap session drivers?",
          options: [
            "Every `get()` call",
            "Nothing at all",
            "The session key names",
            "The middleware",
          ],
          correctIndex: 1,
          explanation: "That single API over swappable storage is the whole point of drivers.",
        },
        {
          question: "Why set a Redis key prefix per application?",
          options: [
            "It compresses the values",
            "Redis requires it",
            "It makes reads faster",
            "Two apps sharing one Redis would both write `session:123` and overwrite each other",
          ],
          correctIndex: 3,
          explanation: "Nothing errors when they collide, so users just get logged out for no visible reason.",
        },
      ],
    },
    {
      id: "reading-and-writing",
      title: "Reading and writing session data",
      durationMinutes: 12,
      explanation: "Six methods cover almost everything you will ever do with a session.\n\nYou reach the session through the request object: `$request->session()`. There is also a global `session()` helper, which is what Blade views normally use. All of these methods behave identically no matter which driver you picked, which is the whole point of having drivers.\n\n---\n\n### 1. Basic — get and put\n\n```php\n// Read, with a fallback when the key is not there\n$name = $request->session()->get('name');\n$name = $request->session()->get('name', 'Guest');\n\n// Write. Arrays are fine too.\n$request->session()->put('name', 'Rajan');\n$request->session()->put('user', ['id' => 10, 'name' => 'Rajan']);\n```\n\nThe second argument to `get()` is a default, and using it is a habit worth forming:\n\n```text\nDoes \"name\" exist?   YES → the stored value\n                     NO  → \"Guest\"\n```\n\nWithout a default you get `null`, and `null` has a way of travelling a long distance through your code before it causes a visible problem.\n\nIn Blade, the helper is shorter:\n\n```blade\n{{ session('name') }}\n{{ session('name', 'Guest') }}\n```\n\n---\n\n### 2. Intermediate — the rest of the set\n\n```text\nMethod      What it does                                    Example\n──────      ───────────                                    ───────\nget()       reads a value, with an optional fallback        get('name', 'Guest')\nput()       stores a value; arrays are fine                 put('user', ['id' => 10])\nhas()       true when the key exists AND is not null        has('cart')\npull()      reads the value and removes it in one step      pull('redirect_to')\nforget()    removes one key, or several from an array       forget(['name', 'email'])\nflush()     removes EVERYTHING in the session              flush()\n```\n\nTwo of these deserve a second look.\n\n<b>`has()` returns false for a key that exists but holds `null`.</b> If you genuinely need to know whether the key is present regardless of its value, that is `exists()`. Most of the time `has()` is what you meant.\n\n<b>`pull()` is `get()` and `forget()` in one call.</b> It is the right tool for a value that should be consumed once, such as the URL you stashed before sending someone off to log in.\n\nAnd `flush()` removes everything, including the values Laravel itself keeps in there. Reach for `forget()` unless you really mean to clear the lot.\n\n---\n\n### 3. Advanced — the login flow end to end\n\nThis is the pattern the whole day builds towards. Real authentication arrives on Day 16 with \"Authentication — Breeze, Sanctum & user registration\", and it is doing exactly this underneath.\n\n```php\npublic function login(Request $request)\n{\n    // Authentication would normally happen here (Day 16).\n\n    $request->session()->put('user_id', 123);\n\n    return redirect('/dashboard');\n}\n\npublic function dashboard(Request $request)\n{\n    $userId = $request->session()->get('user_id');\n\n    return view('dashboard', ['userId' => $userId]);\n}\n```\n\n```text\nPOST /login\n    ↓\nput('user_id', 123)  ──→  session storage\n    ↓\nredirect('/dashboard')\n    ↓\nGET /dashboard\n    ↓\nget('user_id')  ←──  session storage\n    ↓\n123\n```\n\nTwo requests, one remembered value, and the redirect in the middle is the part people forget is even possible. The session survives it because the browser sends the session ID cookie with the next request automatically.\n\nOne security note that matters here: on login you should call `$request->session()->regenerate()`, which issues a fresh session ID. Without it, a session ID an attacker planted before the user logged in is still valid afterwards. Laravel's own auth does this for you, which is one more reason not to hand-roll it.",
      diagram: `The six methods, by what they do to the store

  READ            get('name', 'Guest')     value or the fallback
                  has('cart')              exists AND not null
                  session('name')          the Blade helper

  WRITE           put('name', 'Rajan')     stays until removed

  READ + REMOVE   pull('redirect_to')      get() and forget() in one

  REMOVE          forget('name')           one key
                  forget(['a', 'b'])       several
                  flush()                  EVERYTHING, care needed


has() vs exists()

  put('name', null)
      has('name')     → false   (present but null)
      exists('name')  → true    (the key is there)

  has() is almost always what you meant.


The login flow, and why the redirect survives

  POST /login
      ↓
  put('user_id', 123)  ──→  session storage
      ↓
  redirect('/dashboard')          ← a NEW request starts here
      ↓
  GET /dashboard
      │  browser sends the session ID cookie automatically
      ↓
  get('user_id')  ←──  session storage
      ↓
     123

  On login also call regenerate(), or a session ID
  planted before login stays valid after it.`,
      codeExample: {
        title: "Every session method, and a login flow",
        code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class SessionDemoController extends Controller
{
    public function demo(Request $request)
    {
        // ---------- Read ----------
        $name = $request->session()->get('name');            // null when missing
        $name = $request->session()->get('name', 'Guest');   // prefer a default

        // ---------- Write ----------
        $request->session()->put('name', 'Rajan');
        $request->session()->put('user', ['id' => 10, 'name' => 'Rajan']);

        // ---------- Check ----------
        // has() is false for a key that exists but holds null.
        if ($request->session()->has('cart')) {
            // present and not null
        }

        // Present regardless of value:
        if ($request->session()->exists('cart')) {
            // the key is there, even if it is null
        }

        // ---------- Read and remove in one step ----------
        // Right for a value meant to be consumed once.
        $target = $request->session()->pull('redirect_to', '/dashboard');

        // ---------- Remove ----------
        $request->session()->forget('name');
        $request->session()->forget(['name', 'email']);
        $request->session()->flush();   // removes EVERYTHING, Laravel's own keys too

        // ---------- The global helper ----------
        session()->put('theme', 'dark');
        $theme = session('theme', 'light');

        return redirect('/');
    }
}


// ---------- The login flow, end to end ----------

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Real authentication is Day 16. This is what it does underneath.

        // Issue a fresh session ID first, so an ID planted before login
        // cannot be reused after it.
        $request->session()->regenerate();

        $request->session()->put('user_id', 123);

        return redirect('/dashboard');
    }

    public function dashboard(Request $request)
    {
        // A different request entirely, and the value is still here.
        $userId = $request->session()->get('user_id');

        return view('dashboard', ['userId' => $userId]);
    }

    public function logout(Request $request)
    {
        // On the way out, clear it and invalidate the ID.
        $request->session()->invalidate();

        return redirect('/');
    }
}
?>

{{-- ---------- In Blade, the helper is shorter ---------- --}}
{{ session('name', 'Guest') }}

@if (session()->has('cart'))
    <span>{{ count(session('cart')) }} items</span>
@endif`,
      },
      keyTakeaways: [
        "Reach the session with <b>`$request->session()`</b> in a controller, or the global <b>`session()`</b> helper in Blade.",
        "<b>`get('key', $default)`</b>: always pass a default, or a missing key hands you a `null` that travels a long way before it breaks something.",
        "<b>`put()`</b> stores anything, arrays included, and the value stays until something removes it.",
        "<b>`has()` is false for a key holding `null`</b>; `exists()` is the one that only asks whether the key is present.",
        "<b>`pull()`</b> is `get()` plus `forget()` in one call, which is exactly right for a value meant to be consumed once.",
        "<b>`flush()` removes everything</b>, Laravel's own keys included. Prefer `forget()` unless you really mean the lot.",
        "The login flow is just `put()` on one request and `get()` on the next; the redirect between them changes nothing.",
        "Call <b>`regenerate()`</b> on login and <b>`invalidate()`</b> on logout, so a session ID cannot be reused across that boundary.",
      ],
      commonMistakes: [
        "<b>Calling `get()` with no default.</b> The `null` you get back surfaces as a broken page somewhere far from the cause.",
        "<b>Using `has()` to test a key you deliberately set to `null`.</b> It returns false; `exists()` is the method you wanted.",
        "<b>Reading a value then calling `forget()` on the next line.</b> That is `pull()`, in one call.",
        "<b>Using `flush()` to clear one thing.</b> You also wipe every other key in the session, including Laravel's own.",
        "<b>Skipping `regenerate()` on login.</b> A session ID planted before login stays valid after it, which is a real attack and not a theoretical one.",
      ],
      quiz: [
        {
          question: "What does `pull('redirect_to')` do?",
          options: [
            "Reads the value and removes it in the same step",
            "Reads it without removing it",
            "Removes it without reading it",
            "Copies it to a cookie",
          ],
          correctIndex: 0,
          explanation: "Which is what you want for a value meant to be consumed once.",
        },
        {
          question: "What does `flush()` remove?",
          options: [
            "Only flash data",
            "Everything in the session",
            "Only the keys you name",
            "Only expired keys",
          ],
          correctIndex: 1,
          explanation: "Laravel's own session keys included, so reach for `forget()` unless you mean the lot.",
        },
        {
          question: "When does `has('name')` return false?",
          options: [
            "Only when the key is missing",
            "Never; it always returns true",
            "When the key is missing, or present but holding null",
            "When the value is an array",
          ],
          correctIndex: 2,
          explanation: "`exists()` is the method that only asks whether the key is present.",
        },
        {
          question: "Why call `$request->session()->regenerate()` on login?",
          options: [
            "To clear flash data",
            "To speed up the session driver",
            "To switch drivers",
            "So a session ID planted before login cannot be reused after it",
          ],
          correctIndex: 3,
          explanation: "Laravel's own authentication does this for you, which is a reason not to hand-roll login.",
        },
      ],
    },
    {
      id: "flash-data",
      title: "Flash data, and why it is not just put()",
      durationMinutes: 12,
      explanation: "You already used this on Day 7 without being told how it works.\n\n<b>Flash data</b> (session data that survives exactly one more request, then deletes itself) is what a \"Saved successfully\" banner is made of.\n\nOn Day 7, in \"Controllers, the Request object & responses\", a controller finished its work, flashed a message, and redirected. The next page read the message and showed it. What Day 7 did not explain is why `flash()` and not `put()`.\n\nThe difference is cleanup. A value stored with `put()` stays until you remove it, so a \"Saved successfully!\" banner would follow the user around the site until something called `forget()`. A value stored with `flash()` disappears on its own after the next request reads it, which is exactly the lifetime a one-off message needs.\n\n---\n\n### 1. Basic — two different lifetimes\n\n```text\nput()    →  value stays until something removes it\n            Request 1 ✓   Request 2 ✓   Request 3 ✓   Request 4 ✓ ...\n\nflash()  →  value survives the next request, then vanishes\n            Request 1 ✓   Request 2 ✓   Request 3 ✗ gone\n```\n\nThe question to ask is always how long the value should live.\n\n• Use <b>`flash()`</b> when the value is meant to be shown once and then forgotten.\n  ↳ \"User created successfully.\", \"Password changed\", validation errors after a redirect\n  ↳ Laravel deletes it for you, so there is no cleanup code to write or forget\n• Use <b>`put()`</b> when the value should persist across many requests.\n  ↳ The logged-in user's ID, a shopping cart, a chosen language\n  ↳ It stays until you call `forget()` or `flush()`\n\nA good tell: if you find yourself writing `forget()` right after reading a value, you wanted `flash()` in the first place. And if you only need it once inside the same request, `pull()` reads and removes in one step.\n\n---\n\n### 2. Intermediate — flash then redirect\n\nThis is the pattern to memorise, and you will write it hundreds of times.\n\n```php\npublic function store(Request $request)\n{\n    // ...save the invoice...\n\n    $request->session()->flash('success', 'Invoice created successfully.');\n\n    return redirect()->route('invoices.index');\n}\n```\n\n```blade\n@if (session('success'))\n    <div class=\"alert alert-success\">{{ session('success') }}</div>\n@endif\n```\n\n```text\nPOST /invoices\n    ↓\ncontroller saves the invoice\n    ↓\nflash('success', 'Invoice created successfully.')\n    ↓\nredirect()\n    ↓\nGET /invoices  →  Blade reads session('success')  →  the banner shows\n    ↓\nnext request  →  the message is already gone\n```\n\nLaravel gives you a shortcut for the same thing, and it is what you will actually type:\n\n```php\nreturn redirect()\n    ->route('invoices.index')\n    ->with('success', 'Invoice created successfully.');\n```\n\n`->with()` on a redirect <i>is</i> flashing. Same lifetime, one line.\n\n---\n\n### 3. Advanced — when one request is not enough\n\nSometimes the message never reaches a view. If the request that receives the flash redirects again instead of rendering something, the message is consumed by a page nobody looked at.\n\nA typical chain: you flash a message, redirect to `/dashboard`, and middleware on `/dashboard` redirects again to `/onboarding`. The flash was spent on `/dashboard`, and the user sees nothing.\n\nTwo methods buy you one more request:\n\n```php\n// Keep everything currently flashed for one more request\n$request->session()->reflash();\n\n// Keep only the keys you name\n$request->session()->keep(['success', 'warning']);\n```\n\n```text\nRequest 1  flash('success', ...)\n    ↓\nRequest 2  redirects again, and calls reflash()\n    ↓\nRequest 3  session('success') is still readable here\n```\n\nPrefer `keep()` when you know which message matters. `reflash()` extends everything, including stale keys you had no intention of carrying forward.\n\nAnd if you find yourself reflashing repeatedly, the redirect chain itself is probably the real problem. Two or three redirects to reach a page is a routing decision worth revisiting, not something to paper over with `reflash()`.",
      diagram: `Two lifetimes, one storage

  put()    value stays until something removes it
           R1 ✓    R2 ✓    R3 ✓    R4 ✓ ...

  flash()  value survives the NEXT request, then vanishes
           R1 ✓    R2 ✓    R3 ✗ gone

  Writing forget() right after a read? You wanted flash().


Flash then redirect: the pattern

  POST /invoices
      ↓
  controller saves the invoice
      ↓
  flash('success', 'Invoice created successfully.')
      ↓
  redirect()
      ↓
  GET /invoices  →  Blade reads session('success')  →  banner shows
      ↓
  next request  →  already gone, no cleanup written

  Shorthand for the same thing:
    return redirect()->route('invoices.index')
                     ->with('success', '...');


Why a flash message vanishes unseen

  flash('success')
      ↓
  redirect → /dashboard
      ↓          middleware redirects AGAIN
  redirect → /onboarding
      ↓
  the flash was spent on /dashboard, which rendered nothing

  Fix, one extra request:
    reflash()              keep ALL flash data
    keep(['success'])      keep only these keys  ← prefer this

  Reflashing over and over? The redirect chain is the bug.`,
      codeExample: {
        title: "Flash, redirect, and extending the lifetime",
        code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        // ...save the invoice...

        // The long form, so you can see what is happening:
        $request->session()->flash('success', 'Invoice created successfully.');

        return redirect()->route('invoices.index');
    }

    public function update(Request $request, string $id)
    {
        // ...update the invoice...

        // The short form, which is what you will actually type.
        // ->with() on a redirect IS flashing: same lifetime, one line.
        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice updated.');
    }
}


// ---------- put() vs flash(): choose by lifetime ----------

// Shown once, then forgotten. Laravel cleans up for you.
$request->session()->flash('success', 'Password changed.');

// Needed across many requests. Stays until you remove it.
$request->session()->put('user_id', 123);
$request->session()->put('cart', ['INV-001', 'INV-002']);


// ---------- When the message never reaches a view ----------

class OnboardingMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()->hasCompletedOnboarding()) {
            // This request redirects again, so any flash data set by the
            // previous request would be consumed by a page nobody sees.

            // Keep only what matters. reflash() would keep stale keys too.
            $request->session()->keep(['success', 'warning']);

            return redirect()->route('onboarding.show');
        }

        return $next($request);
    }
}

// reflash()  keep ALL current flash data for one more request
// keep([..]) keep only the listed keys, which is usually better
?>

{{-- ---------- Reading it in Blade ---------- --}}

@if (session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
@endif

@if (session('warning'))
    <div class="alert alert-warning">{{ session('warning') }}</div>
@endif

{{-- A shared partial is worth extracting once you have three of these --}}`,
      },
      keyTakeaways: [
        "<b>Flash data survives exactly one more request</b>, then deletes itself, with no cleanup code from you.",
        "<b>`put()` stays until removed</b>, so a banner stored with `put()` follows the user around the site.",
        "Choose by lifetime: <b>`flash()`</b> for shown-once messages, <b>`put()`</b> for user id, cart and language.",
        "<b>`redirect()->with('key', 'value')` is flashing</b>, and is the form you will actually write.",
        "Writing `forget()` right after reading a value means you wanted `flash()` from the start.",
        "A flash message vanishes unseen when the receiving request redirects again instead of rendering a view.",
        "<b>`reflash()`</b> extends everything by one request; <b>`keep(['success'])`</b> extends only what you name, and is usually the better choice.",
        "Repeated reflashing is a sign the redirect chain itself needs fixing.",
      ],
      commonMistakes: [
        "<b>Using `put()` for a success message.</b> The banner reappears on every page until something calls `forget()`.",
        "<b>Flashing and then rendering a view instead of redirecting.</b> The message is already spent on the request that set it, so the next page shows nothing.",
        "<b>Blaming the flash when a redirect chain ate it.</b> Middleware redirecting again consumes the message on a page nobody sees.",
        "<b>Reaching for `reflash()` first.</b> It carries stale keys forward too; `keep()` says what you actually mean.",
        "<b>Reflashing on every request to make a message stick.</b> At that point the value is not flash data, and the routing is the real problem.",
      ],
      quiz: [
        {
          question: "How long does flash data live?",
          options: [
            "Until the session expires",
            "For exactly one more request, then it deletes itself",
            "For the current request only",
            "Until you call `forget()`",
          ],
          correctIndex: 1,
          explanation: "Which is exactly the lifetime a one-off message needs.",
        },
        {
          question: "Why use `flash()` rather than `put()` for a \"Saved successfully\" banner?",
          options: [
            "`flash()` is faster",
            "`put()` does not work in Blade",
            "`put()` would keep the banner around until something removes it",
            "`flash()` encrypts the value",
          ],
          correctIndex: 2,
          explanation: "The message would follow the user from page to page.",
        },
        {
          question: "What is `redirect()->route('x')->with('success', '...')` doing?",
          options: [
            "Flashing the value, in one line",
            "Storing it permanently",
            "Passing it as a query string",
            "Setting a cookie",
          ],
          correctIndex: 0,
          explanation: "Same lifetime as `flash()`, less typing.",
        },
        {
          question: "A flash message disappeared before the user ever saw it. What most likely happened?",
          options: [
            "The session driver was wrong",
            "The receiving request redirected again, so the message was spent on a page nobody saw",
            "Flash data needs `put()` as well",
            "The browser blocked it",
          ],
          correctIndex: 1,
          explanation: "`keep(['success'])` buys one more request, but the redirect chain is usually the real fix.",
        },
      ],
    },
    {
      id: "session-blocking",
      title: "Session blocking",
      durationMinutes: 9,
      explanation: "A bug that produces no error, no log entry, and a very confused user.\n\n<b>Session blocking</b> (Laravel making one request wait until another has finished with the same session) exists because two requests from the same user can arrive at almost the same moment.\n\nA double-clicked submit button. A page firing several AJAX calls at once. An impatient user hitting refresh mid-request. All of those produce two requests sharing one session.\n\n---\n\n### 1. Basic — what goes wrong\n\nBoth requests read the session, both change it, and both write it back. Whichever finishes last overwrites the other, so one of the changes quietly disappears. With some drivers this can also corrupt the stored session.\n\n```text\nWithout blocking\n  Request A  ──→ read session ──→ change ──→ write\n  Request B  ──→ read session ──→ change ──→ write\n                 (B read the old copy, so A's change is lost)\n\nWith blocking\n  Request A  ──→ [ session locked ] ──→ work ──→ [ unlocked ]\n  Request B  ─────────────── waits ────────────────→ read ──→ write\n```\n\nHere is the sequence spelled out, because the ordering is the whole story:\n\n• Request A reads the session and starts working\n• Request B reads the <b>same</b> old copy of the session\n• A writes its changes back\n• B writes its changes back, on top of A's\n\nA's change is gone, silently. No error, no log entry, just a cart item that never got added or a step of a wizard that reset.\n\n---\n\n### 2. Intermediate — turning it on\n\nBlocking is applied per route, with `->block()`:\n\n```php\nRoute::post('/cart/add', [CartController::class, 'add'])->block(10, 10);\n```\n\nThe two numbers are seconds, and they mean different things:\n\n```text\n->block($lockSeconds, $waitSeconds)\n         │            │\n         │            └─ how long another request will wait for the lock\n         └─ how long this request may hold the lock before it is released\n```\n\nThe second number matters more than it looks. If the wait expires, Laravel throws rather than silently proceeding, so you find out instead of guessing.\n\n```php\n// Sensible defaults for a route that writes session data\nRoute::post('/checkout', [CheckoutController::class, 'store'])->block(10, 10);\n\n// A whole group, when several routes write session state\nRoute::middleware('auth')->group(function () {\n    Route::post('/cart/add', [CartController::class, 'add']);\n    Route::post('/cart/remove', [CartController::class, 'remove']);\n})->block(10, 10);\n```\n\n---\n\n### 3. Advanced — why not everywhere\n\nApply `->block()` to the routes that actually write session data, not to everything.\n\nBlocking makes requests queue up. On a page that fires six AJAX calls at once, blocking all six turns six parallel requests into six sequential ones, and the page feels slow for no benefit if five of them only ever read.\n\nSo the rule of thumb:\n\n```text\nwrites session data, and can be double-fired  →  block()\nreads only                                    →  leave it alone\n```\n\nTwo practical notes. Blocking needs a driver that supports atomic locks, which in practice means `database`, `redis`, `memcached`, `dynamodb` or the array driver in tests; `file` and `cookie` do not qualify. And blocking is per session, not global, so one user queueing never affects another.\n\nThe idea to hold on to: session blocking stops competing requests from modifying the same session at the same time.",
      diagram: `The lost change, step by step

  time →

  A   read session ────────── change ── write
  B        read session (old copy) ───────── write
                                             ↑
                            B writes over A. A's change is gone.

  No error. No log entry. Just a cart item that never
  appeared, or a wizard step that reset itself.


With blocking, the second request waits

  A   [ session locked ] ── work ── [ unlocked ]
  B   ──────── waits ────────────────→ read ── change ── write

       B reads AFTER A wrote, so it sees A's change.


->block(10, 10)

  ->block($lockSeconds, $waitSeconds)
           │             │
           │             └─ how long another request waits for the lock
           └─ how long this request may hold it

  Wait expires → Laravel throws, so you find out.


Where to apply it

  writes session data, can be double-fired  →  block()
  reads only                                →  leave alone

  Six AJAX calls all blocked = six sequential requests.
  Needs a driver with atomic locks: database, redis,
  memcached, dynamodb. Not file, not cookie.`,
      codeExample: {
        title: "Blocking the routes that write",
        code: `<?php
// routes/web.php

use App\\Http\\Controllers\\CartController;
use App\\Http\\Controllers\\CheckoutController;
use App\\Http\\Controllers\\InvoiceController;
use Illuminate\\Support\\Facades\\Route;

// ---------- Block the routes that WRITE session data ----------

// A double-clicked "Add to cart" fires this twice. Without blocking,
// the second request reads the cart before the first one saved it,
// and one of the two items silently never arrives.
Route::post('/cart/add', [CartController::class, 'add'])->block(10, 10);
//                                                             │   │
//   how long this request may hold the lock (seconds) ─────────┘   │
//   how long another request will wait for it (seconds) ───────────┘

Route::post('/checkout', [CheckoutController::class, 'store'])->block(10, 10);

// A group, when several routes write session state
Route::middleware('auth')->group(function () {
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::post('/cart/remove', [CartController::class, 'remove']);
})->block(10, 10);


// ---------- Leave read-only routes alone ----------

// Blocking these would turn parallel AJAX calls into sequential ones
// and slow the page down for no benefit.
Route::get('/invoices', [InvoiceController::class, 'index']);
Route::get('/cart', [CartController::class, 'show']);


<?php
// ---------- What the race looks like in a controller ----------

class CartController extends Controller
{
    public function add(Request $request)
    {
        // Read ... change ... write. Three steps, and a second request
        // arriving between the read and the write reads a stale copy.
        $cart = $request->session()->get('cart', []);

        $cart[] = $request->input('invoice_id');

        $request->session()->put('cart', $cart);

        return back()->with('success', 'Added to cart.');
    }
}

// Blocking needs a driver with atomic locks:
//   database, redis, memcached, dynamodb, array (tests)
// NOT file, and NOT cookie.
//
// It is per session, so one user queueing never affects another.`,
      },
      keyTakeaways: [
        "Two requests from one user can arrive at once: a double-clicked button, several AJAX calls, a refresh mid-request.",
        "The failure is a <b>lost change</b>: both requests read the same old copy, and the last write wins.",
        "It is silent. <b>No error and no log entry</b>, just a cart item that never appeared.",
        "<b>`->block($lock, $wait)`</b> on a route makes the second request wait for the first to finish with the session.",
        "If the wait expires Laravel throws rather than proceeding, so the problem surfaces instead of hiding.",
        "<b>Apply it only to routes that write session data.</b> Blocking read-only routes turns parallel requests into sequential ones.",
        "Blocking needs a driver with atomic locks: `database`, `redis`, `memcached` or `dynamodb`, not `file` or `cookie`.",
        "The lock is per session, so one user queueing never slows anybody else down.",
      ],
      commonMistakes: [
        "<b>Assuming a lost session change must be a bug in your code.</b> Two concurrent requests explain it, and neither one logged anything.",
        "<b>Blocking every route.</b> Requests queue up and pages that fire several AJAX calls get slower for no benefit.",
        "<b>Blocking only the read routes.</b> The write is where the race happens.",
        "<b>Enabling `->block()` on the `file` driver.</b> That driver has no atomic locks, so the protection is not there.",
        "<b>Setting the wait to zero to \"avoid slow requests\".</b> You have kept the race and added a failure.",
      ],
      quiz: [
        {
          question: "What does session blocking protect against?",
          options: [
            "Session hijacking",
            "Expired sessions",
            "Two concurrent requests from one user overwriting each other's session changes",
            "Oversized cookies",
          ],
          correctIndex: 2,
          explanation: "Both read the same old copy, and the last write silently wins.",
        },
        {
          question: "How do you enable it?",
          options: [
            "`->block(10, 10)` on the route",
            "A config flag in `session.php`",
            "Middleware named `block`",
            "It is always on",
          ],
          correctIndex: 0,
          explanation: "The two numbers are how long to hold the lock, and how long to wait for it.",
        },
        {
          question: "Why not apply blocking to every route?",
          options: [
            "It costs money",
            "Requests queue up, so parallel calls become sequential and pages feel slower",
            "It breaks flash data",
            "It only works on POST",
          ],
          correctIndex: 1,
          explanation: "Block the routes that write session data, and leave the read-only ones alone.",
        },
        {
          question: "What does the lost-change bug look like when it happens?",
          options: [
            "A 500 error page",
            "A validation error",
            "A logged exception",
            "Nothing at all: no error, no log, just a change that quietly did not happen",
          ],
          correctIndex: 3,
          explanation: "Which is why it is so hard to track down without knowing the pattern.",
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies — reading, setting, queueing and encryption",
      durationMinutes: 13,
      explanation: "The last piece, and the one with the sharpest edge.\n\nA <b>cookie</b> (a small piece of data the browser stores on the user's machine) is set by your server, kept by the browser, and sent back with every future request to your domain.\n\nThree things to know in Laravel:\n\n• You <b>read</b> a cookie off the request\n• You <b>set</b> a cookie on the response\n• You can also <b>queue</b> a cookie, which tells Laravel to attach it to whatever response ends up going out\n\n---\n\n### 1. Basic — read and set\n\n```php\n// Read from the request, with an optional default\n$theme = $request->cookie('theme');\n$theme = $request->cookie('theme', 'light');\n\n// Set on the response  (name, value, minutes)\nreturn response('Hello')->cookie('theme', 'dark', 60 * 24 * 30);\n```\n\nThe third argument is <b>minutes</b>, not seconds and not days. `60 * 24 * 30` is thirty days, and writing it as an expression rather than `43200` is worth the extra characters.\n\n```text\nLaravel  →  Response  →  body + Set-Cookie: theme=dark  →  Browser\nBrowser  →  Cookie: theme=dark  →  $request->cookie('theme')\n```\n\nNotice the asymmetry: you read from the request and write to the response. A cookie you set is not readable in the same request, because the browser has not sent it back yet. That trips up everyone once.\n\n---\n\n### 2. Intermediate — queueing\n\nSometimes you do not have the response object in hand. Deep inside a service class, an event listener or a job, there is no `$response` to call `->cookie()` on.\n\n```php\nuse Illuminate\\Support\\Facades\\Cookie;\n\nCookie::queue('theme', 'dark', 60 * 24 * 30);\nCookie::queue(Cookie::forget('theme'));   // remove it\n```\n\n`Cookie::queue()` says \"attach this to whatever response goes out\", and saves you from threading a response object through half your application.\n\nRemoving a cookie is not something a server can do directly. `Cookie::forget()` sends back the same cookie with an expiry in the past, and the browser deletes it. Which means the name, path and domain have to match the original, or you will be sending an expiry for a cookie that does not exist.\n\n---\n\n### 3. Advanced — encryption is not trust\n\nLaravel <b>encrypts cookies by default</b>. Rather than sending `user_id=123` in plain text, it encrypts and signs the value using your application's `APP_KEY`, then decrypts it automatically on the way back in. If a user edits the cookie by hand, the signature no longer matches and Laravel treats the cookie as absent.\n\n```text\nOutgoing\n  'user_id=123'  →  encrypt with APP_KEY  →  eyJpdiI6Ik...  →  Browser\n\nIncoming\n  eyJpdiI6Ik...  →  Laravel  →  decrypt with APP_KEY  →  'user_id=123'\n\nTampered value\n  eyJpdiI6Ik... (edited by the user)  →  signature does not match\n                                      →  Laravel ignores the cookie\n```\n\nThat protection is real, but do not stretch it into something it is not. <b>The browser is not a trusted environment.</b> The user owns that browser.\n\nWhat encryption does not give you:\n\n• The cookie sits on a machine you do not control. It can be copied, kept after logout, or handed to someone else.\n• An old cookie stays valid until it expires, so you cannot revoke it the way you can delete a server-side session.\n• Everything rests on `APP_KEY`. If that key leaks, every encrypted cookie is readable. If it changes, they all become unreadable and every user is logged out.\n\nSo the rule is: API keys, prices, roles, permissions and anything else your code will trust belong on the server, in the session or the database. <b>Cookies hold preferences and identifiers, not secrets and not trust.</b>\n\nOne last mechanical detail. Some cookies must stay unencrypted, usually because JavaScript on the page needs to read them. Laravel lets you list those as exceptions to the encryption middleware. Add a name to that list and you have made it plain text, so it is a decision worth making deliberately rather than to fix a bug quickly.",
      diagram: `Read from the request, write to the response

  Browser  ──[ Cookie: theme=dark ]──→  $request->cookie('theme')

  return response($body)->cookie('theme', 'dark', 60 * 24 * 30)
                                                   │
                                         MINUTES, not seconds
                                         60*24*30 = thirty days

  A cookie you just set is NOT readable this request.
  The browser has not sent it back yet.


Three ways to set one

  have the response      →  $response->cookie(...)
  deep in a service      →  Cookie::queue(...)
  removing one           →  Cookie::queue(Cookie::forget('theme'))
                            (an expiry in the PAST; the browser deletes it)


Encryption travels with the value

  Outgoing
    'user_id=123'  →  encrypt with APP_KEY  →  eyJpdiI6Ik...  →  Browser

  Incoming
    eyJpdiI6Ik...  →  decrypt with APP_KEY  →  'user_id=123'

  Tampered
    eyJpdiI6Ik... edited by the user  →  signature mismatch
                                      →  Laravel ignores the cookie


Encryption is not trust

  it DOES     stop the user reading the value
              stop the user changing the value

  it DOES NOT stop the cookie being copied or replayed
              let you revoke one before it expires
              survive APP_KEY changing (everyone logs out)

  server, in session or database  →  roles, prices, keys, permissions
  browser, in a cookie            →  theme, language, "hide this banner"`,
      codeExample: {
        title: "Reading, setting, queueing and forgetting",
        code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Cookie;

class PreferenceController extends Controller
{
    public function show(Request $request)
    {
        // ---------- Read: off the REQUEST ----------
        $theme = $request->cookie('theme');            // null when absent
        $theme = $request->cookie('theme', 'light');   // prefer a default

        return view('preferences', ['theme' => $theme]);
    }

    public function store(Request $request)
    {
        // ---------- Set: on the RESPONSE ----------
        // Third argument is MINUTES. 60 * 24 * 30 = thirty days.
        // Written as an expression it stays readable; 43200 does not.
        return redirect()
            ->route('preferences.show')
            ->cookie('theme', $request->input('theme'), 60 * 24 * 30)
            ->with('success', 'Preference saved.');

        // Note: $request->cookie('theme') here would still return the OLD
        // value. The browser has not sent the new one back yet.
    }

    public function reset()
    {
        // ---------- Remove ----------
        // A server cannot delete a cookie directly. forget() sends the same
        // cookie with an expiry in the past, and the browser removes it.
        // Name, path and domain must match the original.
        Cookie::queue(Cookie::forget('theme'));

        return redirect()->route('preferences.show');
    }
}


<?php
// ---------- Queueing, when there is no response object here ----------

namespace App\\Services;

use Illuminate\\Support\\Facades\\Cookie;

class FilterMemory
{
    public function remember(array $filters): void
    {
        // No $response in scope, and threading one through every caller
        // would be worse than this. queue() attaches the cookie to
        // whatever response ends up going out.
        Cookie::queue('invoice_filters', json_encode($filters), 60 * 24 * 30);
    }
}


<?php
// ---------- What belongs where ----------

// Cookie: preferences and identifiers.
Cookie::queue('theme', 'dark', 60 * 24 * 30);
Cookie::queue('locale', 'en', 60 * 24 * 365);

// Session or database: anything your code will TRUST.
$request->session()->put('user_id', 123);
$request->session()->put('role', 'admin');

// Never a cookie, encrypted or not. Encryption stops the user reading
// and editing the value. It does not stop the cookie being copied,
// replayed, or kept after logout, and it cannot be revoked early.
// Cookie::queue('is_admin', true);        // no
// Cookie::queue('price', 0);              // no
// Cookie::queue('api_key', $secret);      // no`,
      },
      keyTakeaways: [
        "You <b>read a cookie off the request</b> and <b>set it on the response</b>. A cookie you just set is not readable until the next request.",
        "The lifetime argument is in <b>minutes</b>; `60 * 24 * 30` reads better than `43200`.",
        "<b>`Cookie::queue()`</b> attaches a cookie to whatever response goes out, for code with no response object in hand.",
        "<b>`Cookie::forget()`</b> works by sending an expiry in the past, so the name, path and domain must match the original.",
        "Laravel <b>encrypts and signs cookies by default</b> with `APP_KEY`, and ignores any cookie whose signature no longer matches.",
        "<b>Encryption is not trust.</b> A cookie can still be copied, replayed, kept after logout, and cannot be revoked before it expires.",
        "If `APP_KEY` changes, every encrypted cookie becomes unreadable and every user is logged out.",
        "<b>Cookies hold preferences and identifiers</b>; roles, prices, permissions and keys belong on the server.",
      ],
      commonMistakes: [
        "<b>Reading a cookie you set earlier in the same request.</b> The browser has not sent it back yet, so you get the old value or null.",
        "<b>Treating the lifetime as seconds or days.</b> It is minutes, so `30` is half an hour and not thirty days.",
        "<b>Storing a role, a price or an API key in a cookie because Laravel encrypts it.</b> Encryption stops reading and tampering, not copying, replaying or keeping it after logout.",
        "<b>Calling `Cookie::forget()` with a different path or domain.</b> Nothing is deleted, because it is a different cookie as far as the browser is concerned.",
        "<b>Adding a cookie to the encryption exception list to make a bug go away.</b> You have just made that value plain text and editable.",
      ],
      quiz: [
        {
          question: "Where do you read a cookie from, and where do you set one?",
          options: [
            "Read from the request, set on the response",
            "Both on the request",
            "Both on the response",
            "Read from the session, set on the response",
          ],
          correctIndex: 0,
          explanation: "Which is why a cookie you just set is not readable until the next request.",
        },
        {
          question: "What is `Cookie::queue()` for?",
          options: [
            "Delaying the cookie until tomorrow",
            "Attaching a cookie when you do not have the response object in hand",
            "Storing several cookies in one",
            "Queueing a background job",
          ],
          correctIndex: 1,
          explanation: "It saves threading a response object through half your application.",
        },
        {
          question: "Laravel encrypts cookies. Can you store secrets in them?",
          options: [
            "Yes, encryption makes them safe",
            "Yes, as long as they are short",
            "No: the cookie can still be copied, replayed or kept after logout, and cannot be revoked",
            "Only with `APP_KEY` rotated daily",
          ],
          correctIndex: 2,
          explanation: "The browser is not a trusted environment; roles, prices and keys belong on the server.",
        },
        {
          question: "What happens to existing encrypted cookies if `APP_KEY` changes?",
          options: [
            "They are re-encrypted automatically",
            "Nothing changes",
            "Only new cookies are affected",
            "They become unreadable, which logs everybody out",
          ],
          correctIndex: 3,
          explanation: "Which is why rotating that key is a deliberate operation, not a tidy-up.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Where does session data physically live, and what does the browser hold?",
      options: [
        "Both on the server",
        "The data lives on the server; the browser holds only a session ID",
        "Both in the browser",
        "The data lives in the browser; the server holds an ID",
      ],
      correctIndex: 1,
      explanation: "A session uses a cookie to carry its ID, which is why the two get confused.",
    },
    {
      question: "Which session driver needs a migration before it works?",
      options: [
        "file",
        "cookie",
        "database",
        "None of them",
      ],
      correctIndex: 2,
      explanation: "It writes to a `sessions` table, and tables come from migrations on Day 12.",
    },
    {
      question: "What is the difference between `flash()` and `put()`?",
      options: [
        "`flash()` survives one more request then deletes itself; `put()` stays until removed",
        "`flash()` is encrypted",
        "`put()` only works in Blade",
        "There is none",
      ],
      correctIndex: 0,
      explanation: "Which is exactly why a success banner uses `flash()`.",
    },
    {
      question: "What does session blocking prevent?",
      options: [
        "Expired sessions",
        "Session hijacking",
        "Oversized session payloads",
        "Two concurrent requests from one user overwriting each other's session changes",
      ],
      correctIndex: 3,
      explanation: "The lost change is silent: no error and no log entry.",
    },
    {
      question: "Laravel encrypts cookies by default. What does that not give you?",
      options: [
        "Protection against the user reading the value",
        "Protection against the user editing the value",
        "A safe place for roles, prices and API keys",
        "Automatic decryption on the way back in",
      ],
      correctIndex: 2,
      explanation: "The cookie can still be copied, replayed and kept after logout, and it cannot be revoked early.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Make InvoiceHub remember things: a banner after saving, the filters you last used, and the invoices you just looked at.",
    brief: "Everything InvoiceHub knows today dies at the end of the request. Three small features change that, and each one uses a different tool.\n\nThere is still no database, so keep the invoice list hard-coded in an array exactly as it is now. Stay on the `file` session driver too; the `database` driver needs a `sessions` table and that is Day 12. Nothing here needs either.\n\nThe flash message you build in step one is the same pattern you already wrote on Day 7 with `redirect()->with()`. This time you will know why it disappears on its own.",
    steps: [
      "Flash a success message from `store()`: after adding the invoice to your hard-coded array, `return redirect()->route('invoices.index')->with('success', 'Invoice created.')`.",
      "Read it in Blade with `@if (session('success'))` and a styled banner. Reload the index page and confirm the banner is gone the second time, without you writing any cleanup.",
      "Prove the difference: swap `->with('success', ...)` for `session()->put('success', ...)` and navigate around. The banner follows you. Put `flash` back.",
      "Add a filter form to the invoice index with a status dropdown and a sort order. On submit, save the chosen values to a cookie with `Cookie::queue('invoice_filters', json_encode($filters), 60 * 24 * 30)`.",
      "On the way in, read that cookie with `$request->cookie('invoice_filters')`, decode it, and use it as the default filter state. Close the browser, reopen it, and the filters should still be there.",
      "Add a \"recently viewed\" list using the session. In `show()`, read `session('recent', [])`, push the invoice number, keep only the last five with `array_slice`, and `put()` it back.",
      "Render the recently-viewed list in your layout so it shows on every page. Visit six invoices and confirm the oldest drops off.",
      "Add a \"Clear recently viewed\" button posting to a route that calls `session()->forget('recent')`. Use `forget()`, not `flush()`, and write a one-line comment saying why.",
      "Add `->block(10, 10)` to the route that writes the recently-viewed list, and note in a comment what it protects against and why the read routes do not need it.",
      "Try the wrong tool on purpose: store the recently-viewed array in a cookie instead of the session, then answer in a comment why the session is the better home for it.",
    ],
    acceptance: [
      "Creating an invoice shows a banner once, and it is gone on the next page load with no cleanup code of your own.",
      "You can explain, in one sentence, why `flash()` and not `put()` for that banner.",
      "Closing and reopening the browser keeps your chosen filters, because they are in a cookie and not the session.",
      "The recently-viewed list holds at most five invoices, newest first, and survives moving between pages.",
      "Clearing it uses `forget('recent')` and leaves the rest of the session intact.",
      "The route that writes the recently-viewed list has `->block()` on it, and the read routes do not.",
      "Nothing in a cookie is a value your code trusts: no user id, no role, no price.",
    ],
    stretch: [
      "Set the filter cookie without a response object in hand: move the logic into a small service class and use `Cookie::queue()` from there.",
      "Add a \"Forget my filters\" button using `Cookie::queue(Cookie::forget('invoice_filters'))`, then look at the response headers and find the expiry in the past.",
      "Flash a message, then add middleware that redirects again before the view renders. Watch the message vanish, then rescue it with `keep(['success'])`.",
      "Inspect the `laravel_session` cookie in your browser's developer tools, then open the matching file in `storage/framework/sessions/`, and match the ID to the file name.",
    ],
  },
};
