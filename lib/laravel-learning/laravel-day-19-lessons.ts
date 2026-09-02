import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_19_LESSONS: LessonDay = {
  day: 19,
  title: "Authentication — guards, sessions, hashing & password resets",
  totalMinutes: 91,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "guards-and-providers",
      title: "Guards & providers",
      durationMinutes: 11,
      explanation: "Authentication answers one question, and it is worth being precise about which one:\n\n```text\nWho are you?          →  authentication\nAre you allowed to?   →  authorization\n```\n\n<b>Today is entirely the first.</b> The second is a separate system with its own vocabulary, and mixing them up is the most common confusion in this part of Laravel.\n\n---\n\n### 1. Basic — two moving parts\n\nLaravel's authentication is built from two things, and everything else follows from them:\n\n```text\nAuthentication\n      │\n      ├── Guard\n      │     ↓\n      │   HOW the user is authenticated\n      │\n      └── Provider\n            ↓\n          WHERE the user comes from\n```\n\n<b>A <i>guard</i></b> decides how Laravel remembers who you are between requests. The default `web` guard uses the session from Day 10: log in once, and a cookie carries the session id, and the session holds the user's id.\n\n<b>A <i>provider</i></b> decides where the user record is fetched from. The default provider uses Eloquent and your `User` model.\n\nBoth live in `config/auth.php`:\n\n```php\n'guards' => [\n    'web' => [\n        'driver'   => 'session',\n        'provider' => 'users',\n    ],\n],\n\n'providers' => [\n    'users' => [\n        'driver' => 'eloquent',\n        'model'  => App\\Models\\User::class,\n    ],\n],\n```\n\n---\n\n### 2. Intermediate — the chain\n\nRead it top to bottom and the whole system is one line:\n\n```text\nGuard\n  ↓\nweb, session driver\n  ↓\nProvider\n  ↓\nEloquent\n  ↓\nUser model\n  ↓\nusers table\n```\n\nA request arrives with a session cookie. The guard reads the user id out of the session and hands it to the provider. The provider fetches that user from the database. `Auth::user()` returns it.\n\n<b>Guard = how. Provider = from where.</b>\n\nThat sounds like trivia until an application has more than one of either, and then it is the only thing that makes the configuration readable.\n\n---\n\n### 3. Advanced — why the split exists\n\nThe separation pays off in two situations you will meet.\n\n<b>Two kinds of user.</b> An application with customers and staff in separate tables needs two providers, and often two guards so that logging into the admin area does not log you into the shop:\n\n```php\n'guards' => [\n    'web'   => ['driver' => 'session', 'provider' => 'users'],\n    'admin' => ['driver' => 'session', 'provider' => 'admins'],\n],\n```\n\n```php\nAuth::guard('admin')->attempt($credentials);\nAuth::guard('admin')->user();\n```\n\nLeave the guard off and you get the default from `config/auth.php`, which is what every example on this page does quietly.\n\n<b>Two ways of authenticating the same user.</b> A browser session and an API token are different guards over the same provider. The session guard reads a cookie; a token guard reads an `Authorization` header. Same users table, same model, different mechanism:\n\n```text\nbrowser  →  session guard  ┐\n                           ├─→  users provider  →  User\nAPI      →  token guard    ┘\n```\n\nThat is the arrangement Sanctum sets up, and it is why the split exists at all.\n\nOne detail worth carrying: <b>the user model must be `Authenticatable`.</b> Laravel's `User` extends `Illuminate\\Foundation\\Auth\\User`, which supplies the password field, the remember token and the interface the provider expects. A model that does not extend it cannot be authenticated, whatever the config says.",
      diagram: `Two questions, one system each

  Who are you?          →  authentication    ← today
  Are you allowed to?   →  authorization     ← a separate topic


Two moving parts

  Authentication
        │
        ├── Guard      HOW the user is authenticated
        │
        └── Provider   WHERE the user comes from

  config/auth.php

  'guards' => [
      'web' => ['driver' => 'session', 'provider' => 'users'],
  ],
  'providers' => [
      'users' => ['driver' => 'eloquent', 'model' => User::class],
  ],


The chain, top to bottom

  Guard
    ↓
  web, session driver          reads the user id from the session
    ↓
  Provider
    ↓
  Eloquent                     fetches that user
    ↓
  User model
    ↓
  users table

  Guard = how.  Provider = from where.


Why the split exists

  Two kinds of user: two providers, often two guards

    'web'   → users provider
    'admin' → admins provider

    Auth::guard('admin')->attempt(\$credentials);

  Two ways to authenticate the same user:

    browser  →  session guard  ┐
                               ├─→ users provider → User
    API      →  token guard    ┘

    Same table, same model, different mechanism.
    That is what Sanctum sets up.


  The model must be Authenticatable. Laravel's User extends
  Illuminate\\Foundation\\Auth\\User, which supplies the password
  field, the remember token and the interface the provider
  expects. Without it, nothing authenticates.`,
      codeExample: {
        title: "config/auth.php, and using a named guard",
        code: `<?php
// config/auth.php

return [

    // Used when you do not name a guard.
    'defaults' => [
        'guard'     => 'web',
        'passwords' => 'users',
    ],

    // HOW: the mechanism that remembers who you are.
    'guards' => [
        'web' => [
            'driver'   => 'session',
            'provider' => 'users',
        ],

        // A second guard over a second provider.
        'admin' => [
            'driver'   => 'session',
            'provider' => 'admins',
        ],
    ],

    // WHERE: how a user record is fetched.
    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model'  => App\\Models\\User::class,
        ],

        'admins' => [
            'driver' => 'eloquent',
            'model'  => App\\Models\\Admin::class,
        ],
    ],
];


<?php
// ---------- Using the default guard ----------

use Illuminate\\Support\\Facades\\Auth;

Auth::attempt($credentials);
Auth::user();
Auth::check();

// Identical to:
Auth::guard('web')->attempt($credentials);


// ---------- Using a named guard ----------

Auth::guard('admin')->attempt($credentials);
Auth::guard('admin')->user();
Auth::guard('admin')->logout();

// And in routes:
Route::middleware('auth:admin')->group(function () {
    // ...
});


<?php
// ---------- The model the provider returns ----------

namespace App\\Models;

use Illuminate\\Foundation\\Auth\\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password'];

    // Never serialise these. Day 14's $hidden, doing security work.
    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }
}

// Extending Authenticatable is what supplies the password field,
// the remember token and the interface the provider expects.`,
      },
      keyTakeaways: [
        "<b>Authentication asks who you are; authorization asks what you may do.</b> They are separate systems.",
        "<b>A guard decides how Laravel remembers who you are between requests</b>, and the default `web` guard uses the session.",
        "<b>A provider decides where the user record comes from</b>, and the default uses Eloquent and your `User` model.",
        "Both are configured in `config/auth.php`, along with the default guard.",
        "<b>Guard = how. Provider = from where.</b>",
        "The chain is: session holds the id, guard reads it, provider fetches the user, `Auth::user()` returns it.",
        "<b>Two kinds of user need two providers</b>, and usually two guards so the sessions stay separate.",
        "<b>Two ways of authenticating the same user are two guards over one provider</b>, which is what Sanctum sets up.",
        "`Auth::guard('admin')` names a guard; leaving it off uses the default.",
        "<b>The user model must extend `Authenticatable`</b>, which supplies the password field and the interface the provider expects.",
      ],
      commonMistakes: [
        "<b>Treating authentication and authorization as one thing.</b> Logging in says nothing about what you may do.",
        "<b>Adding a second user table without a second provider.</b> The default provider only knows about one model.",
        "<b>Forgetting the guard name on a second guard's calls.</b> `Auth::user()` returns the default guard's user.",
        "<b>Building a user model that does not extend `Authenticatable`.</b> Nothing about it can be authenticated.",
        "<b>Leaving `password` out of `$hidden`.</b> The hash then appears in any JSON response containing the user.",
      ],
      quiz: [
        {
          question: "What does a guard decide?",
          options: [
            "Which users exist",
            "How Laravel maintains the authenticated state between requests",
            "What a user is allowed to do",
            "How passwords are hashed",
          ],
          correctIndex: 1,
          explanation: "The default `web` guard uses the session.",
        },
        {
          question: "What does a provider decide?",
          options: [
            "How the user is authenticated",
            "Where the user record is fetched from",
            "Which routes are protected",
            "The session lifetime",
          ],
          correctIndex: 1,
          explanation: "Guard = how, provider = from where.",
        },
        {
          question: "An API and a browser both authenticate the same users table. What does that look like in config?",
          options: [
            "Two providers over one guard",
            "Two guards over one provider",
            "One guard and one provider",
            "Two separate applications",
          ],
          correctIndex: 1,
          explanation: "Different mechanism, same source of users. That is what Sanctum sets up.",
        },
        {
          question: "Why must the user model extend `Authenticatable`?",
          options: [
            "For the factory to work",
            "It supplies the password field, remember token and the interface the provider expects",
            "To enable migrations",
            "It is only a convention",
          ],
          correctIndex: 1,
          explanation: "Without it, nothing about the model can be authenticated.",
        },
      ],
    },
    {
      id: "logging-in-and-out",
      title: "attempt, login, logout & session regeneration",
      durationMinutes: 13,
      explanation: "Four calls, and one line most people leave out.\n\n---\n\n### 1. Basic — `Auth::attempt()`\n\n```php\nif (Auth::attempt(['email' => $email, 'password' => $password])) {\n    // authenticated\n}\n```\n\nWhat it does, in order:\n\n```text\n1. hands the credentials minus the password to the provider\n2. the provider finds a matching user\n3. Hash::check() compares the given password to the stored hash\n4. on success, the user's id goes into the session\n5. returns true\n```\n\nThe password is never queried. <b>Every key except `password` becomes a `where` clause</b>, which is worth knowing because it means you can add conditions:\n\n```php\nAuth::attempt(['email' => $email, 'password' => $password, 'active' => true]);\n```\n\nInactive users now fail to log in, with no extra code.\n\nA complete login action:\n\n```php\n$credentials = $request->validate([\n    'email'    => ['required', 'email'],\n    'password' => ['required'],\n]);\n\nif (! Auth::attempt($credentials)) {\n    return back()->withErrors(['email' => 'Invalid credentials.']);\n}\n\n$request->session()->regenerate();\n\nreturn redirect()->intended('/dashboard');\n```\n\nNote the error message. <b>Say \"invalid credentials\", never \"no account with that email\"</b>, which tells an attacker which addresses are registered.\n\n---\n\n### 2. Intermediate — the line people leave out\n\n```php\n$request->session()->regenerate();\n```\n\nLeave it out and the application works perfectly, which is why it gets left out.\n\n<b>Session fixation</b> (an attack where the attacker fixes the victim's session id before they log in) works like this. The attacker visits your site, gets session id `A`, and tricks the victim into using it. The victim logs in. If the id does not change, session `A` is now an authenticated session, and the attacker has it.\n\n```text\nBefore login          After login, no regenerate\n\nSession A       →     Session A, authenticated\nattacker has it       attacker still has it\n\n\nWith regenerate\n\nSession A       →     Session B, authenticated\nattacker has A        A is worthless\n```\n\nOne line, and the attack does not exist. Regenerate after <i>every</i> authentication, including registration and impersonation.\n\n---\n\n### 3. Advanced — the rest of the API\n\n<b>`Auth::login($user)`</b> authenticates a user you already have, skipping the credential check:\n\n```php\n$user = User::create([...]);\n\nAuth::login($user);\n$request->session()->regenerate();\n```\n\nWhich is exactly what you want after registration, and what impersonation and custom flows use. It trusts you completely, so anything reaching it must have established identity some other way.\n\n`Auth::loginUsingId($id)` is the same thing from a primary key, for when you have an id rather than a model:\n\n```php\nAuth::loginUsingId(1);\n```\n\n<b>Treat it with the same suspicion.</b> It performs no credential check at all, so an id reaching it from a request is an authentication bypass written as one line.\n\n<b>Logging out is three lines, not one:</b>\n\n```php\nAuth::logout();\n\n$request->session()->invalidate();\n$request->session()->regenerateToken();\n```\n\n```text\nAuth::logout()          forget the authenticated user\ninvalidate()            throw the session data away\nregenerateToken()       new CSRF token\n```\n\nWith only the first, the session survives and still holds whatever else was in it. On a shared computer that matters.\n\n<b>Remember me</b> is a second argument:\n\n```php\nAuth::attempt($credentials, $request->boolean('remember'));\n```\n\nIt stores a long-lived token in the `remember_token` column and a matching cookie, so the user stays authenticated after the session expires. Two things follow. The column must exist, and `Auth::logout()` clears the token, which is why logging out on one device signs you out of that browser properly.\n\nOne security note: a remembered user is authenticated but not <i>recently</i> authenticated. That distinction is what password confirmation, in the next lesson, exists for.",
      diagram: `What Auth::attempt() actually does

  1. hands the credentials MINUS the password to the provider
  2. the provider finds a matching user
  3. Hash::check() compares the password to the stored hash
  4. on success, the user's id goes into the session
  5. returns true

  The password is never queried. Every OTHER key
  becomes a where clause:

    Auth::attempt([... , 'active' => true])
    → inactive users cannot log in, with no extra code


  Error message: "Invalid credentials."
  Never "no account with that email" — that tells an
  attacker which addresses are registered.


The line people leave out

  \$request->session()->regenerate();

  Without it the app works perfectly, which is the problem.

  Session fixation:

  Before login          After login, NO regenerate

  Session A       →     Session A, authenticated
  attacker has it       attacker still has it


  With regenerate

  Session A       →     Session B, authenticated
  attacker has A        A is worthless

  Regenerate after EVERY authentication,
  including registration and impersonation.


The rest of the API

  Auth::login(\$user)      authenticate a user you already have
  Auth::loginUsingId(1)   the same, from a primary key
                          ⚠️ no credential check — an id
                             from a request is a bypass
                          (registration, impersonation)
                          trusts you completely

  Logout is THREE lines:

    Auth::logout();                         forget the user
    \$request->session()->invalidate();      throw the data away
    \$request->session()->regenerateToken(); new CSRF token

  With only the first, the session survives and still holds
  whatever else was in it.


Remember me

  Auth::attempt(\$credentials, \$request->boolean('remember'))

  a long-lived token in remember_token + a cookie
  the column must exist
  Auth::logout() clears it

  ⚠️  A remembered user is authenticated, but not RECENTLY
      authenticated. That is what password confirmation is for.`,
      codeExample: {
        title: "A complete login and logout",
        code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class LoginController extends Controller
{
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Every key except password becomes a where clause.
        $credentials['active'] = true;

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            // Never "no account with that email".
            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'Invalid credentials.']);
        }

        // Session fixation protection. Do not skip this.
        $request->session()->regenerate();

        // intended() sends them where they were originally going.
        return redirect()->intended('/dashboard');
    }

    public function destroy(Request $request)
    {
        Auth::logout();                          // forget the user

        $request->session()->invalidate();       // throw the data away
        $request->session()->regenerateToken();  // new CSRF token

        return redirect('/');
    }
}


<?php
// ---------- Authenticating a user you already have ----------

public function register(Request $request)
{
    $data = $request->validate([
        'name'     => ['required', 'string', 'max:255'],
        'email'    => ['required', 'email', 'unique:users'],
        'password' => ['required', 'confirmed', Password::defaults()],
    ]);

    $user = User::create($data);   // the 'hashed' cast handles the password

    Auth::login($user);
    $request->session()->regenerate();

    return redirect('/dashboard');
}

// Or from an id you already trust:
Auth::loginUsingId($userId);

// ⚠️ No credential check. An id arriving from a request
//    and reaching this line is an authentication bypass.

// Auth::login() skips the credential check entirely, so anything
// reaching it must have established identity another way.


<?php
// ---------- Remember me ----------

// The form:
// <input type="checkbox" name="remember">

Auth::attempt($credentials, $request->boolean('remember'));

// Needs a remember_token column:
// $table->rememberToken();
//
// Auth::logout() clears it, so signing out really signs out.


<?php
// ---------- A named guard ----------

Auth::guard('admin')->attempt($credentials);
Auth::guard('admin')->logout();`,
      },
      keyTakeaways: [
        "<b>`Auth::attempt()` finds the user, checks the password hash, and puts the user's id in the session.</b>",
        "<b>Every credential key except `password` becomes a `where` clause</b>, so `'active' => true` blocks inactive users.",
        "<b>Say \"invalid credentials\"</b>, never that an email is unknown, which reveals who has an account.",
        "<b>`$request->session()->regenerate()` after login prevents session fixation.</b>",
        "Without it the application still works, which is exactly why the line gets left out.",
        "Regenerate after every authentication, including registration and impersonation.",
        "<b>`Auth::login($user)` authenticates a user you already have</b>, skipping the credential check entirely.",
        "<b>`Auth::loginUsingId($id)` does the same from a primary key</b>, and an id from a request reaching it is a bypass.",
        "<b>Logging out is three calls</b>: `logout()`, `session()->invalidate()` and `session()->regenerateToken()`.",
        "<b>Remember me is a second argument to `attempt()`</b>, needs a `remember_token` column, and is cleared on logout.",
        "A remembered user is authenticated but not recently authenticated, which is what password confirmation addresses.",
      ],
      commonMistakes: [
        "<b>Skipping `session()->regenerate()`.</b> Everything works, and session fixation is possible.",
        "<b>Telling the user the email was not found.</b> That enumerates your accounts for an attacker.",
        "<b>Calling only `Auth::logout()`.</b> The session survives with its data and its CSRF token intact.",
        "<b>Hashing the password before passing it to `attempt()`.</b> It compares the plain value against the stored hash.",
        "<b>Adding remember me without the `remember_token` column.</b> The token has nowhere to go.",
      ],
      quiz: [
        {
          question: "What does `Auth::attempt()` do with the `password` key?",
          options: [
            "Adds it to the `where` clause",
            "Uses it in `Hash::check()` against the stored hash, after finding the user by the other keys",
            "Hashes it and compares the strings",
            "Ignores it",
          ],
          correctIndex: 1,
          explanation: "Every other key becomes a `where` clause; the password is verified separately.",
        },
        {
          question: "Why regenerate the session after login?",
          options: [
            "To clear old flash data",
            "So an attacker who fixed the pre-login session id cannot hold the authenticated one",
            "To refresh the user model",
            "For performance",
          ],
          correctIndex: 1,
          explanation: "Session fixation, and the fix is one line.",
        },
        {
          question: "What does a complete logout need beyond `Auth::logout()`?",
          options: [
            "Nothing",
            "`session()->invalidate()` and `session()->regenerateToken()`",
            "A redirect",
            "Clearing the cache",
          ],
          correctIndex: 1,
          explanation: "Otherwise the session survives with its data and CSRF token.",
        },
        {
          question: "When would you use `Auth::login($user)` rather than `Auth::attempt()`?",
          options: [
            "When the password is wrong",
            "When identity is already established, such as straight after registration",
            "For API requests only",
            "Never; it is deprecated",
          ],
          correctIndex: 1,
          explanation: "It skips the credential check, so it trusts the caller completely.",
        },
      ],
    },
    {
      id: "the-user-and-protecting-routes",
      title: "The authenticated user, middleware & password confirmation",
      durationMinutes: 12,
      explanation: "Having logged somebody in, two things follow: reading who they are, and keeping everybody else out.\n\n---\n\n### 1. Basic — reading the user\n\n```php\n$user = Auth::user();       // the model, or null\n$user = $request->user();   // the same thing\n\nAuth::id();                 // just the id, no query\nAuth::check();              // logged in?\nAuth::guest();              // the opposite\n```\n\n`Auth::user()` and `$request->user()` are the same. Prefer `$request->user()` in a controller, because it makes the dependency visible in the method signature rather than reaching for a facade.\n\n<b>`Auth::id()` is worth knowing.</b> When you only need the id, it avoids fetching the whole user, which matters inside a loop or a query.\n\nIn Blade:\n\n```blade\n@auth\n    <p>Hello, {{ auth()->user()->name }}</p>\n@endauth\n\n@guest\n    <a href=\"/login\">Log in</a>\n@endguest\n```\n\nAnd the mistake to avoid: <b>`Auth::user()` returns `null` for a guest</b>, so `Auth::user()->name` on a public page is a fatal error. Use `Auth::user()?->name`, or check first.\n\n---\n\n### 2. Intermediate — protecting routes\n\n```php\nRoute::get('/dashboard', fn () => view('dashboard'))->middleware('auth');\n```\n\n```text\nGuest → /dashboard → redirected to /login\nUser  → /dashboard → allowed\n```\n\nThe `auth` middleware redirects a guest to the login route and remembers where they were going, which is what `redirect()->intended()` used in the last lesson.\n\nGroups save the repetition:\n\n```php\nRoute::middleware('auth')->group(function () {\n    Route::get('/dashboard', ...);\n    Route::get('/profile', ...);\n    Route::get('/settings', ...);\n});\n```\n\nA named guard goes after a colon: `middleware('auth:admin')`.\n\n<b>And the distinction that keeps this lesson honest.</b> The `auth` middleware answers \"is anybody logged in\", nothing more:\n\n```text\nauth middleware      is Rajan logged in?\nauthorization        can Rajan delete THIS post?\n```\n\nA route protected by `auth` alone lets any authenticated user reach it, including one editing somebody else's record. Authorization, with policies and gates, is a separate topic and a separate day.\n\n---\n\n### 3. Advanced — password confirmation\n\nSome actions deserve more than \"you logged in three weeks ago and ticked remember me\":\n\n```text\nchange password\nchange email\nview or rotate API keys\ndelete the account\n```\n\nFor these, Laravel can ask for the password again:\n\n```php\nRoute::get('/settings/security', ...)\n    ->middleware(['auth', 'password.confirm']);\n```\n\n```text\nalready authenticated\n        ↓\nsensitive action\n        ↓\nconfirm password\n        ↓\ncontinue, for a while\n```\n\nThe confirmation timestamp is stored in the session, so it holds for a configurable window (three hours by default) rather than prompting on every click.\n\n<b>The threat this addresses is not a stranger, it is an unattended browser.</b> Someone sitting at a logged-in machine can read email and change settings; password confirmation stops them taking over the account outright.\n\nTwo related habits worth adopting at the same time.\n\n<b>Rate limit the login route.</b> Without it, nothing stops an attacker trying passwords as fast as your server answers:\n\n```php\nRoute::post('/login', ...)->middleware('throttle:5,1');\n```\n\nLaravel's own login also has `RateLimiter` support keyed on the email plus IP, which is better than either alone.\n\n<b>And redirect authenticated users away from the login page.</b> The `guest` middleware does it:\n\n```php\nRoute::middleware('guest')->group(function () {\n    Route::get('/login', ...);\n    Route::get('/register', ...);\n});\n```\n\nSmall thing, but a logged-in user landing on a login form is a bug report waiting to happen.",
      diagram: `Reading the user

  Auth::user()         the model, or NULL
  \$request->user()     the same thing, visible in the signature
  Auth::id()           just the id, no query
  Auth::check()        logged in?
  Auth::guest()        the opposite

  @auth ... @endauth      @guest ... @endguest

  ⚠️  Auth::user() is null for a guest, so
      Auth::user()->name on a public page is fatal.
      Use ?-> or check first.


Protecting routes

  ->middleware('auth')

    Guest → /dashboard → redirected to /login
    User  → /dashboard → allowed

  The redirect remembers where they were going, which is
  what redirect()->intended() uses.

  Route::middleware('auth')->group(function () { ... });
  ->middleware('auth:admin')          a named guard


  auth middleware      is Rajan logged in?
  authorization        can Rajan delete THIS post?

  A route with auth alone lets ANY authenticated user in,
  including one editing somebody else's record.


Password confirmation

  change password · change email · rotate API keys · delete account

  ->middleware(['auth', 'password.confirm'])

    already authenticated
            ↓
    sensitive action
            ↓
    confirm password
            ↓
    continue, for ~3 hours

  The threat is not a stranger. It is an unattended
  browser. Reading email is bad; taking over the
  account is worse.


Two habits to adopt at the same time

  Rate limit the login route
    ->middleware('throttle:5,1')
    nothing else stops an attacker trying passwords
    as fast as your server answers

  Send logged-in users away from /login
    Route::middleware('guest')->group(...)`,
      codeExample: {
        title: "Reading the user, and keeping everyone else out",
        code: `<?php

use Illuminate\\Support\\Facades\\Auth;

// ---------- Reading the user ----------

$user = Auth::user();        // the model, or null
$user = $request->user();    // the same, and visible in the signature

Auth::id();                  // just the id, no query
Auth::check();               // true when logged in
Auth::guest();               // true when not

// ❌ Fatal on a public page: user() is null for a guest.
Auth::user()->name;

// ✓
Auth::user()?->name;
$request->user()?->name;


<?php
// ---------- In a controller ----------

public function update(Request $request)
{
    // The dependency is in the signature, not hidden in a facade.
    $user = $request->user();

    $user->update($request->validate([
        'name' => ['required', 'string', 'max:255'],
    ]));

    return back();
}


<?php
// ---------- routes/web.php ----------

use Illuminate\\Support\\Facades\\Route;

// Guests only: a logged-in user visiting /login is a bug report.
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create']);
    Route::post('/login', [LoginController::class, 'store'])
        ->middleware('throttle:5,1');          // 5 attempts a minute
    Route::get('/register', [RegisterController::class, 'create']);
});

// Authenticated only.
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'edit']);

    // Sensitive: ask for the password again.
    Route::middleware('password.confirm')->group(function () {
        Route::get('/settings/security', [SecurityController::class, 'edit']);
        Route::put('/settings/password', [PasswordController::class, 'update']);
        Route::delete('/account', [AccountController::class, 'destroy']);
    });

    Route::post('/logout', [LoginController::class, 'destroy']);
});

// A named guard.
Route::middleware('auth:admin')->prefix('admin')->group(function () {
    // ...
});


<?php
// ---------- What auth middleware does NOT do ----------

Route::get('/posts/{post}/edit', function (Post $post) {
    // Any authenticated user reaches this, including one
    // editing somebody else's post.
    return view('posts.edit', compact('post'));
})->middleware('auth');

// "Can this user edit THIS post?" is authorization:
// policies, gates and the can middleware. A separate day.`,
      },
      keyTakeaways: [
        "<b>`Auth::user()` and `$request->user()` return the authenticated model, or `null` for a guest.</b>",
        "Prefer `$request->user()` in a controller, so the dependency is visible in the signature.",
        "<b>`Auth::id()` gives the id without fetching the user</b>, which matters inside loops and queries.",
        "`Auth::check()`, `Auth::guest()` and Blade's `@auth` / `@guest` cover the conditional cases.",
        "<b>`Auth::user()->name` is fatal on a public page</b>, so use `?->` or check first.",
        "<b>The `auth` middleware redirects guests to login and remembers where they were going.</b>",
        "<b>`auth` answers \"is anybody logged in\", not \"may this person do this\"</b>, which is authorization.",
        "<b>`password.confirm` asks for the password again before sensitive actions</b>, holding for about three hours.",
        "The threat it addresses is an unattended logged-in browser, not a stranger.",
        "<b>Rate limit the login route</b>, and use the `guest` middleware so logged-in users are sent away from it.",
      ],
      commonMistakes: [
        "<b>Calling `Auth::user()->name` on a page guests can see.</b> `null` has no properties.",
        "<b>Treating `auth` middleware as authorization.</b> It lets every logged-in user through, including the wrong one.",
        "<b>Fetching the whole user when you only wanted the id.</b> `Auth::id()` avoids the query.",
        "<b>Leaving the login route unthrottled.</b> Passwords can then be tried as fast as your server answers.",
        "<b>Skipping password confirmation on account-level changes.</b> An unattended browser becomes a stolen account.",
      ],
      quiz: [
        {
          question: "What does `Auth::user()` return for a guest?",
          options: ["A guest user object", "`false`", "`null`", "It throws"],
          correctIndex: 2,
          explanation: "Which is why `Auth::user()->name` is fatal on a public page.",
        },
        {
          question: "What does the `auth` middleware guarantee?",
          options: [
            "That the user owns the record",
            "That somebody is logged in, and nothing more",
            "That the email is verified",
            "That the password was recently confirmed",
          ],
          correctIndex: 1,
          explanation: "Ownership is authorization, a separate system.",
        },
        {
          question: "What is `password.confirm` middleware for?",
          options: [
            "Confirming a password on registration",
            "Requiring the password again before sensitive actions, against an unattended logged-in browser",
            "Checking password strength",
            "Rehashing the password",
          ],
          correctIndex: 1,
          explanation: "The confirmation is held in the session for a few hours.",
        },
        {
          question: "Why put the login route behind `throttle`?",
          options: [
            "To reduce server load",
            "Otherwise passwords can be tried as fast as the server can answer",
            "Laravel requires it",
            "To prevent session fixation",
          ],
          correctIndex: 1,
          explanation: "Rate limiting is what makes guessing impractical.",
        },
      ],
    },
    {
      id: "password-hashing",
      title: "Password hashing, bcrypt, Argon2 & rehashing",
      durationMinutes: 12,
      explanation: "The one part of authentication where getting it wrong is unrecoverable.\n\n---\n\n### 1. Basic — never store the password\n\n```text\npassword\n─────────────────────────────────\npassword123          ❌ plain text\n```\n\nOne database leak and every account is gone, along with every other site where that person reused the password.\n\n<b>Hash it instead:</b>\n\n```php\n$user->password = Hash::make($request->password);\n```\n\n```text\npassword\n─────────────────────────────────\n$2y$12$k9.3f...      ✓ a hash\n```\n\n<b>A <i>hash</i></b> (a one-way transformation of a value) cannot be reversed. There is no `Hash::unmake()`, and that is the point: your database never contains anything that could be used to log in elsewhere.\n\nTo check a password:\n\n```php\nif (Hash::check($request->password, $user->password)) {\n    // correct\n}\n```\n\nHash the attempt, compare the hashes. <b>You never decrypt a password, because a password hash is not encrypted.</b>\n\nSince Day 14 you have had a shorter way:\n\n```php\nprotected function casts(): array\n{\n    return ['password' => 'hashed'];\n}\n```\n\nNow assigning a plain password hashes it on the way in, and `User::create([...])` needs no `Hash::make()` at all.\n\n---\n\n### 2. Intermediate — why hashing is slow on purpose\n\nA hash for a file is designed to be fast. <b>A password hash is designed to be slow.</b>\n\nAn attacker with your database tries billions of guesses. If each check costs a microsecond, a common password falls in seconds. If each costs a tenth of a second, the same attack takes years.\n\nThat slowness is the <i>work factor</i>, and it is configurable:\n\n```text\nbcrypt   rounds       12 by default; each step doubles the work\nargon2   memory,      memory-hard, so it also resists\n         time, threads   parallel attacks on graphics hardware\n```\n\n<b>bcrypt</b> is mature, extremely well understood, and Laravel's default. <b>Argon2id</b> was designed specifically for passwords and is memory-hard, which makes the massively parallel attacks that graphics hardware enables much more expensive.\n\nWhich to choose:\n\n```text\nno strong reason to change?   bcrypt, Laravel's default\nyou can spare the memory?     argon2id\n```\n\nThe honest answer is that both are fine, and the configuration matters more than the choice. A badly configured Argon2 is worse than a well configured bcrypt. Set it in `config/hashing.php` and leave it alone.\n\n---\n\n### 3. Advanced — rehashing\n\nWork factors get raised as hardware gets faster. But existing hashes were made with the old one:\n\n```text\n2026    bcrypt, 10 rounds       every existing user\n  ↓\n2028    bcrypt, 12 rounds       every new user\n```\n\nYou cannot re-hash them yourself, because you do not have anybody's password. You only ever see one at a single moment: <b>login.</b>\n\n```text\nsuccessful login\n      ↓\nyou have the plain password, briefly\n      ↓\ndoes the stored hash use the old work factor?\n      ↓\nyes → hash it again with the new one, and save\n```\n\nLaravel does this automatically when the configuration changes. Over a few weeks, active users are silently upgraded, and nobody is asked to reset anything.\n\nThat is worth appreciating as a pattern, not just a feature: <b>a security upgrade that costs users nothing gets deployed; one that requires a password reset email to everybody does not.</b>\n\nThree last rules, each of which has cost somebody an incident.\n\n<b>Never log the request.</b> A `Log::info($request->all())` in a login controller writes plain passwords to a file, and probably to a log service you do not control.\n\n<b>Keep `password` in `$hidden`.</b> Laravel's `User` does this already; a model you write yourself does not.\n\n<b>And never write your own comparison.</b> `Hash::check()` compares in constant time, so it does not leak information through how long it takes.",
      diagram: `Never store the password

  password123          ❌  one leak and every account is gone,
                           along with every site where that
                           person reused it

  Hash::make(\$password)

  \$2y\$12\$k9.3f...      ✓  one-way. There is no Hash::unmake().


  Checking: hash the attempt, compare the hashes.

    Hash::check(\$plain, \$user->password)

  You never DECRYPT a password. It is not encrypted.

  Or let the cast do it:  'password' => 'hashed'


Why a password hash is slow ON PURPOSE

  A file hash is designed to be fast.
  A password hash is designed to be slow.

  1 microsecond per guess  →  common password falls in seconds
  0.1 seconds per guess    →  the same attack takes years

  bcrypt    rounds (12 default), each step doubles the work
  argon2id  memory-hard: also resists parallel attacks
            on graphics hardware

  no strong reason to change?  bcrypt, the default
  can spare the memory?        argon2id

  Both are fine. The CONFIGURATION matters more than
  the choice. Set it in config/hashing.php and leave it.


Rehashing: upgrading without asking anybody

  2026   bcrypt, 10 rounds      every existing user
    ↓
  2028   bcrypt, 12 rounds      every new user

  You cannot rehash them yourself: you do not have
  anybody's password. You see one at exactly one moment.

    successful login
          ↓
    you have the plain password, briefly
          ↓
    does the stored hash use the old work factor?
          ↓
    yes → hash again with the new one, save

  Over a few weeks, active users are upgraded silently.

  A security upgrade that costs users nothing gets
  deployed. One that emails everybody does not.


Three rules that have each cost somebody an incident

  Never log the request in a login controller.
    Log::info(\$request->all()) writes plain passwords
    to a file, and to a log service you do not control.

  Keep password in \$hidden.
    Laravel's User does. A model you wrote does not.

  Never write your own comparison.
    Hash::check() compares in constant time, so it does
    not leak information through how long it takes.`,
      codeExample: {
        title: "Hashing, checking and rehashing",
        code: `<?php

use Illuminate\\Support\\Facades\\Hash;

// ---------- Storing ----------

$user->password = Hash::make($request->password);
$user->save();

// In the database: $2y$12$k9.3f...
// The original password is not stored anywhere.


// ---------- Or let the cast do it (Day 14) ----------

class User extends Authenticatable
{
    protected function casts(): array
    {
        return ['password' => 'hashed'];
    }
}

// Now this is enough:
User::create([
    'name'     => $request->name,
    'email'    => $request->email,
    'password' => $request->password,   // hashed on the way in
]);


// ---------- Checking ----------

if (Hash::check($request->password, $user->password)) {
    // correct
}

// Hash::attempt() does this for you inside Auth::attempt().

// ❌ There is no way back. This does not exist:
// Hash::unmake($user->password);

// ❌ And never write your own comparison: == is not
//    constant time, so it leaks information through timing.
if ($user->password === Hash::make($request->password)) { }


<?php
// ---------- Configuration ----------

// config/hashing.php

return [
    'driver' => 'bcrypt',        // or 'argon2id'

    'bcrypt' => [
        'rounds' => env('BCRYPT_ROUNDS', 12),
    ],

    'argon' => [
        'memory' => 65536,
        'threads' => 1,
        'time' => 4,
    ],
];

// Each extra bcrypt round doubles the work an attacker does.


<?php
// ---------- Rehashing on login ----------

// Laravel does this automatically when the config changes:

if (Hash::needsRehash($user->password)) {
    // Only possible here, because this is the one moment
    // you hold the plain password.
    $user->password = Hash::make($request->password);
    $user->save();
}

// Active users are upgraded silently over a few weeks.
// Nobody is asked to reset anything.


<?php
// ---------- Things that leak passwords ----------

// ❌ Writes plain passwords to your logs, and to whatever
//    log service they are shipped to.
Log::info('Login attempt', $request->all());

// ✓
Log::info('Login attempt', ['email' => $request->email]);

// ❌ A model without $hidden puts the hash in every JSON
//    response containing a user.
protected $hidden = ['password', 'remember_token'];`,
      },
      keyTakeaways: [
        "<b>Never store a plain password.</b> One leak exposes every account, and every site where it was reused.",
        "<b>`Hash::make()` is one-way</b>: there is no way back, and that is the point.",
        "<b>`Hash::check($plain, $hash)` verifies a password</b> by hashing the attempt, not by decrypting anything.",
        "The `'password' => 'hashed'` cast does it automatically on assignment.",
        "<b>A password hash is slow on purpose</b>, and that slowness is what makes guessing impractical.",
        "<b>bcrypt is mature and the default; Argon2id is memory-hard</b> and resists parallel attacks better.",
        "<b>The configuration matters more than the choice</b>, so set it in `config/hashing.php` and leave it.",
        "<b>Rehashing upgrades a hash at login</b>, the one moment the plain password is available.",
        "That lets security improve without asking every user to reset their password.",
        "<b>Never log the request in a login controller, keep `password` in `$hidden`, and never write your own comparison.</b>",
      ],
      commonMistakes: [
        "<b>Trying to recover a password.</b> Hashing is not encryption; there is nothing to decrypt.",
        "<b>Hashing the input before `Auth::attempt()`.</b> It expects the plain password and hashes it itself.",
        "<b>Logging `$request->all()` in a login controller.</b> Plain passwords go straight into your logs.",
        "<b>Comparing hashes with `===`.</b> `Hash::check()` compares in constant time for a reason.",
        "<b>Assuming a newer algorithm is automatically safer.</b> A badly configured Argon2 loses to a well configured bcrypt.",
      ],
      quiz: [
        {
          question: "How do you verify a password against a stored hash?",
          options: [
            "Decrypt the hash and compare",
            "`Hash::check($plain, $hash)`, which hashes the attempt and compares",
            "`$plain === $hash`",
            "`Hash::make($hash)`",
          ],
          correctIndex: 1,
          explanation: "There is nothing to decrypt; hashing is one-way.",
        },
        {
          question: "Why is a password hash deliberately slow?",
          options: [
            "To reduce server load",
            "So an attacker with the database cannot try billions of guesses cheaply",
            "To allow rehashing",
            "It is a side effect of the algorithm",
          ],
          correctIndex: 1,
          explanation: "The work factor is what turns seconds into years.",
        },
        {
          question: "What makes Argon2id different from bcrypt?",
          options: [
            "It is faster",
            "It is memory-hard, which resists massively parallel attacks better",
            "It is reversible",
            "It needs no configuration",
          ],
          correctIndex: 1,
          explanation: "Both are fine; configuration matters more than the choice.",
        },
        {
          question: "Why can a password only be rehashed at login?",
          options: [
            "Laravel only allows it then",
            "That is the one moment the plain password is available",
            "The database is locked otherwise",
            "It is a performance choice",
          ],
          correctIndex: 1,
          explanation: "Which is what lets the work factor rise without a mass reset.",
        },
      ],
    },
    {
      id: "encryption",
      title: "Encryption, and how it differs from hashing",
      durationMinutes: 10,
      explanation: "Two operations that sound similar, solve different problems, and are constantly confused.\n\n---\n\n### 1. Basic — the difference\n\n```text\nHashing                      Encryption\n───────                      ──────────\npassword                     secret\n   ↓                            ↓\nhash                         encrypted value\n                                ↓\n(no way back)                decrypt\n                                ↓\n                             secret\n```\n\n<b>Hashing is one-way.</b> You use it when you never need the original value back, only to check whether something matches it. Passwords, and essentially nothing else.\n\n<b>Encryption is two-way.</b> You use it when you <i>do</i> need the value back: an API token you must send to a provider, a bank account number you have to display, a note only the owner should read.\n\n<b>The question that decides it: do you ever need the original value?</b>\n\n```text\nno   →  hash it\nyes  →  encrypt it\n```\n\nEncrypting a password is a real mistake with a real consequence. It means the plain passwords are recoverable, so a leak of your database plus your key hands over every account, and every other site those people reused the password on.\n\n---\n\n### 2. Intermediate — using it\n\n```php\n$encrypted = Crypt::encryptString('sensitive information');\n\n$value = Crypt::decryptString($encrypted);\n```\n\n`encrypt()` and `decrypt()` handle any serialisable value; the `String` variants are for plain text and are what you usually want.\n\nOr let the model do it, with Day 16's cast:\n\n```php\nprotected function casts(): array\n{\n    return ['api_token' => 'encrypted'];\n}\n```\n\nThe key comes from `APP_KEY` in your `.env`. Two consequences, both from that lesson and both worth repeating here because this is where they bite:\n\n<b>An encrypted column cannot be searched.</b> Every row's ciphertext is different, so no `where`, no index, no sorting.\n\n<b>Lose `APP_KEY` and the data is gone.</b> Not \"hard to recover\": gone. It is not a password you can reset; it is the only thing that can read those bytes.\n\nOne more property worth knowing: Laravel's encryption is authenticated, so tampering with a ciphertext produces a `DecryptException` rather than quiet nonsense. Catch it rather than letting it become a 500.\n\n---\n\n### 3. Advanced — key rotation\n\nKeys are infrastructure, and infrastructure sometimes has to change. Perhaps it leaked, perhaps a policy requires rotation.\n\nThe problem states itself:\n\n```text\nexisting data\n     ↓\nencrypted with the old key\n\nreplace APP_KEY\n     ↓\nnothing can read any of it\n```\n\nSo a rotation is not a single edit. Laravel supports previous keys:\n\n```env\nAPP_KEY=base64:newkey...\nAPP_PREVIOUS_KEYS=base64:oldkey...\n```\n\n```text\nnew values  →  encrypted with the current key\nold values  →  still decryptable with a previous key\n```\n\nThat gives you a window. During it you re-encrypt the existing rows, and only when everything is on the new key do you drop the old one.\n\n```text\n1. generate a new key, keep the old one as previous\n2. deploy: new writes use the new key, old reads still work\n3. re-encrypt existing rows, in batches\n4. remove the previous key\n```\n\n<b>And the thing worth internalising: this is only possible because you planned for it.</b> An application that hard-codes a key, or has no idea which columns are encrypted, cannot rotate at all. Keep a note of which columns use the `encrypted` cast, and rotation stays a task rather than a crisis.\n\nOne closing note on sessions, connecting this to the rest of the day: `APP_KEY` also signs session cookies. Change it and everybody is logged out, which is inconvenient but not dangerous, and occasionally exactly what you want after a breach.",
      diagram: `The difference

  Hashing                      Encryption
  ───────                      ──────────
  password                     secret
     ↓                            ↓
  hash                         encrypted value
                                  ↓
  (no way back)                decrypt
                                  ↓
                               secret

  Do you ever need the original value back?

    no   →  hash it        passwords, essentially nothing else
    yes  →  encrypt it     API tokens, account numbers, notes


  Encrypting a password means plain passwords are
  recoverable. Your database plus your key hands over
  every account, and every site those people reused it on.


Using it

  Crypt::encryptString('sensitive information')
  Crypt::decryptString(\$encrypted)

  or the cast:  'api_token' => 'encrypted'

  The key is APP_KEY.

  ⚠️  Cannot be searched: every ciphertext differs,
      so no where, no index, no sort.
  ⚠️  Lose APP_KEY and the data is GONE. Not hard to
      recover. Gone.

  Encryption is authenticated, so tampering raises a
  DecryptException rather than producing quiet nonsense.


Key rotation

  existing data encrypted with the old key
        ↓
  replace APP_KEY
        ↓
  nothing can read any of it

  So Laravel keeps previous keys:

    APP_KEY=base64:newkey...
    APP_PREVIOUS_KEYS=base64:oldkey...

    new values  →  current key
    old values  →  still readable

  1. generate a new key, keep the old as previous
  2. deploy: new writes new key, old reads still work
  3. re-encrypt existing rows, in batches
  4. remove the previous key

  Only possible because you planned for it. An app that
  hard-codes a key, or does not know which columns are
  encrypted, cannot rotate at all.


  APP_KEY also signs session cookies, so changing it
  logs everybody out. Inconvenient, and occasionally
  exactly what you want after a breach.`,
      codeExample: {
        title: "Encrypting values you need back",
        code: `<?php

use Illuminate\\Support\\Facades\\Crypt;

// ---------- Two-way ----------

$encrypted = Crypt::encryptString('sensitive information');

$value = Crypt::decryptString($encrypted);


// Any serialisable value:
$encrypted = encrypt(['card' => '4242', 'expires' => '12/28']);
$data      = decrypt($encrypted);


// ---------- Or the cast (Day 16) ----------

class Integration extends Model
{
    protected function casts(): array
    {
        return [
            'api_token' => 'encrypted',
            'settings'  => 'encrypted:array',
        ];
    }
}

$integration->api_token = 'sk_live_...';   // encrypted on write
$integration->api_token;                    // decrypted on read


// ---------- Tampering is detected ----------

use Illuminate\\Contracts\\Encryption\\DecryptException;

try {
    $value = Crypt::decryptString($fromTheUser);
} catch (DecryptException $e) {
    // Modified or from a different key. Handle it; do not 500.
    abort(400);
}


<?php
// ---------- Choosing between them ----------

// Do you ever need the original value back?

// No: a password. Hash it.
$user->password = Hash::make($request->password);

// Yes: a token you must send to a provider. Encrypt it.
$integration->api_token = $request->token;   // 'encrypted' cast

// ❌ Never. This makes every password recoverable.
$user->password = Crypt::encryptString($request->password);


# ---------- Key rotation ----------

# .env
APP_KEY=base64:bmV3a2V5...
APP_PREVIOUS_KEYS=base64:b2xka2V5...

# New writes use APP_KEY. Existing values still decrypt
# with a previous key, which gives you a window.

<?php
// During that window, re-encrypt in batches:

Integration::chunkById(500, function ($integrations) {
    foreach ($integrations as $integration) {
        // Reading decrypts with whichever key works;
        // saving re-encrypts with the current one.
        $integration->api_token = $integration->api_token;
        $integration->save();
    }
});

// Then remove APP_PREVIOUS_KEYS.

// Keep a note of which columns are encrypted. Without it,
// rotation is not a task, it is a crisis.`,
      },
      keyTakeaways: [
        "<b>Hashing is one-way and encryption is two-way</b>, and they answer different questions.",
        "<b>The deciding question: do you ever need the original value back?</b> No means hash, yes means encrypt.",
        "<b>Encrypting a password is a real mistake</b>: it makes every password recoverable from your database plus the key.",
        "`Crypt::encryptString()` and `Crypt::decryptString()` handle text; `encrypt()` and `decrypt()` handle any value.",
        "The `'encrypted'` cast does it on the model, using `APP_KEY`.",
        "<b>An encrypted column cannot be searched, indexed or sorted.</b>",
        "<b>Losing `APP_KEY` loses the data permanently.</b>",
        "Laravel's encryption is authenticated, so a tampered ciphertext raises `DecryptException` rather than returning nonsense.",
        "<b>`APP_PREVIOUS_KEYS` lets old values still decrypt while new ones use the new key</b>, which is what makes rotation possible.",
        "<b>Rotation only works if you planned for it</b>, so keep a note of which columns are encrypted.",
      ],
      commonMistakes: [
        "<b>Encrypting passwords instead of hashing them.</b> The plain values become recoverable.",
        "<b>Encrypting a column you need to search.</b> Every ciphertext differs, so no `where` will match.",
        "<b>Replacing `APP_KEY` without previous keys.</b> Every encrypted value in the database becomes unreadable.",
        "<b>Letting `DecryptException` become a 500.</b> Tampered input should be a 400, handled deliberately.",
        "<b>Not recording which columns are encrypted.</b> Rotation then has no list to work from.",
      ],
      quiz: [
        {
          question: "When should you encrypt rather than hash?",
          options: [
            "Whenever the value is sensitive",
            "When you need the original value back later",
            "For passwords",
            "When the column is indexed",
          ],
          correctIndex: 1,
          explanation: "Hashing is for values you only ever need to match against.",
        },
        {
          question: "What is wrong with encrypting passwords?",
          options: [
            "It is slower",
            "It makes them recoverable, so a leak of the database plus the key exposes every account",
            "It cannot be done",
            "Nothing",
          ],
          correctIndex: 1,
          explanation: "A password should never be recoverable, by anyone, including you.",
        },
        {
          question: "What happens if you lose `APP_KEY`?",
          options: [
            "Laravel regenerates it",
            "Encrypted data is permanently unreadable",
            "Users must log in again, and nothing else",
            "The data decrypts with the previous key automatically",
          ],
          correctIndex: 1,
          explanation: "It also signs sessions, so everybody is logged out too.",
        },
        {
          question: "What does `APP_PREVIOUS_KEYS` make possible?",
          options: [
            "Multiple applications sharing data",
            "Rotating the key while old values remain decryptable",
            "Faster decryption",
            "Encrypting more columns",
          ],
          correctIndex: 1,
          explanation: "It gives you a window to re-encrypt existing rows.",
        },
      ],
    },
    {
      id: "password-resets",
      title: "Password resets & reset tokens",
      durationMinutes: 11,
      explanation: "The feature most likely to be built badly, because the obvious implementation is a security hole.\n\n---\n\n### 1. Basic — what it must not be\n\nThe naive version emails the user their current password. It cannot: you hashed it, and there is nothing to send. <b>That is the hashing lesson paying off already</b> — a site that can email you your password is telling you it stores passwords it should not have.\n\nThe correct flow never touches the old password at all:\n\n```text\nUser\n ↓\n\"Forgot password?\"\n ↓\nenter email\n ↓\ngenerate a reset token, store its hash\n ↓\nemail a link containing the token\n ↓\nuser clicks it\n ↓\nnew password\n ↓\nHash::make()\n ↓\nsave, and delete the token\n```\n\nThe token is a temporary, single-use proof that the person controls that inbox.\n\nLaravel provides the whole thing. `Password::sendResetLink()` and `Password::reset()`, backed by a `password_reset_tokens` table:\n\n```php\n$status = Password::sendResetLink($request->only('email'));\n```\n\nThat `$status` is a constant you can branch on:\n\n```text\nPassword::RESET_LINK_SENT     the email went out\nPassword::INVALID_USER        no account with that address\nPassword::RESET_THROTTLED     asked again too soon\n```\n\n<b>Useful for logging, and useless for the response</b>, for the reason two sections down: branching on it in the user-facing message is exactly the leak you are trying to avoid.\n\n---\n\n### 2. Intermediate — the four properties a token needs\n\nEvery one of these has been the cause of a real breach somewhere.\n\n```text\nunpredictable      cannot be guessed or derived\nexpires            useless after a short window\nsingle use         invalidated the moment it works\nstored hashed      a database leak does not hand over resets\n```\n\n<b>Unpredictable</b> rules out the mistake that looks reasonable:\n\n```text\n/reset-password/user/123      ❌ the id is the token\n/reset-password/{64 random chars}   ✓\n```\n\nAnything derived from the user id, the email, or a timestamp is guessable. It must be random.\n\n<b>Expires</b> because an old email in an inbox should not be a permanent key. Laravel defaults to sixty minutes.\n\n<b>Single use</b> because a token that still works after the password changed lets anybody who saw the link do it again.\n\n<b>Stored hashed</b> for exactly the reason passwords are. Laravel hashes reset tokens in the database, so leaking that table does not let an attacker reset anybody's password.\n\n---\n\n### 3. Advanced — the details around the edges\n\n<b>Do not reveal whether the email exists.</b>\n\n```text\n❌ \"No account with that email.\"\n✓ \"If that email is registered, we have sent a link.\"\n```\n\nThe same message either way. Otherwise the forgot-password form becomes a tool for discovering who has an account, which is how a credential-stuffing list gets refined.\n\n<b>Rate limit it.</b> Without a limit, the form is a way to send somebody unlimited email. Laravel throttles resend attempts per email by default; keep that, and add `throttle` middleware on the route.\n\n<b>Decide what a reset does to existing sessions.</b> This is the question people forget. Somebody resetting their password because it was stolen expects the thief to be logged out. If sessions survive the reset, they are not.\n\n```php\n$user->forceFill([\n    'password'       => $password,\n    'remember_token' => Str::random(60),\n])->save();\n```\n\nRegenerating `remember_token` kills remembered logins. Laravel can also invalidate other sessions when the password changes, and on a real application you want that on.\n\n<b>And validate the new password properly:</b>\n\n```php\n'password' => ['required', 'confirmed', Password::defaults()],\n```\n\n`Password::defaults()` is configurable in one place, and `->uncompromised()` additionally checks the password against known breach data without ever sending it anywhere useful.\n\nOne last note tying back to the last lesson. A reset link arrives by email, so <b>the security of the whole flow is the security of the inbox.</b> That is a reasonable trade for most applications, and it is also the reason two-factor authentication exists.",
      diagram: `What it must NOT be

  Emailing the current password. You cannot: you hashed it.

  A site that can email your password is telling you
  it stores passwords it should not have.


The correct flow

  "Forgot password?"
        ↓
  enter email
        ↓
  generate a reset token, store its HASH
        ↓
  email a link containing the token
        ↓
  user clicks it
        ↓
  new password → Hash::make() → save
        ↓
  delete the token

  The token is temporary, single-use proof that the
  person controls that inbox.


Four properties a token needs

  unpredictable   cannot be guessed or derived
  expires         useless after a short window (60 min)
  single use      invalidated the moment it works
  stored hashed   a database leak does not hand over resets

  /reset-password/user/123            ❌ the id IS the token
  /reset-password/{64 random chars}   ✓

  Anything derived from the id, the email or a timestamp
  is guessable. It must be random.


The edges people forget

  Do not reveal whether the email exists

    ❌ "No account with that email."
    ✓ "If that email is registered, we have sent a link."

    The same message either way, or the form becomes a
    tool for discovering who has an account.

  Rate limit it
    Otherwise it is a way to send somebody unlimited email.

  Decide what a reset does to existing SESSIONS
    Someone resetting because their password was stolen
    expects the thief to be logged out. If sessions
    survive, they are not.

    Regenerate remember_token, and invalidate other
    sessions on password change.

  Validate the new password
    ['required', 'confirmed', Password::defaults()]
    ->uncompromised() checks it against breach data


  The link arrives by email, so the security of the whole
  flow is the security of the inbox. A reasonable trade
  for most applications, and the reason 2FA exists.`,
      codeExample: {
        title: "A reset flow that holds up",
        code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Auth\\Events\\PasswordReset;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Support\\Facades\\Password;
use Illuminate\\Support\\Str;
use Illuminate\\Validation\\Rules\\Password as PasswordRule;

class PasswordResetController extends Controller
{
    // ---------- Step 1: send the link ----------

    public function sendLink(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        // Branch on the status for LOGGING, never for the response
        if ($status === Password::RESET_THROTTLED) {
            Log::info('Reset link throttled', ['email' => $request->email]);
        }

        // The SAME message whether or not the email exists.
        // Otherwise this form tells an attacker who has an account.
        return back()->with('status',
            'If that email is registered, we have sent a link.');
    }

    // ---------- Step 2: accept the new password ----------

    public function reset(Request $request)
    {
        $request->validate([
            'token'    => ['required'],
            'email'    => ['required', 'email'],
            'password' => [
                'required',
                'confirmed',
                PasswordRule::defaults(),   // configured in one place
            ],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),

                    // Kills remembered logins on other devices.
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            },
        );

        // Laravel deletes the token once it has been used.

        return $status === Password::PASSWORD_RESET
            ? redirect('/login')->with('status', 'Password updated.')
            : back()->withErrors(['email' => __($status)]);
    }
}


<?php
// ---------- routes/web.php ----------

Route::middleware('guest')->group(function () {
    Route::get('/forgot-password', ...)->name('password.request');

    // Rate limit: otherwise this sends somebody unlimited email.
    Route::post('/forgot-password', [PasswordResetController::class, 'sendLink'])
        ->middleware('throttle:5,1')
        ->name('password.email');

    Route::get('/reset-password/{token}', ...)->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'reset'])
        ->middleware('throttle:5,1')
        ->name('password.update');
});


<?php
// ---------- Password rules, in one place ----------

// app/Providers/AppServiceProvider.php

use Illuminate\\Validation\\Rules\\Password;

public function boot(): void
{
    Password::defaults(fn () => $this->app->isProduction()
        ? Password::min(12)->letters()->numbers()->uncompromised()
        : Password::min(8));
}

// uncompromised() checks the password against known breach
// data without sending anything useful anywhere.


<?php
// ---------- The URL shape ----------

// ❌ The id is the token. Anyone can reset anyone.
// /reset-password/user/123

// ✓ Unpredictable, expiring, single use, stored hashed.
// /reset-password/8f3a...64 random characters...?email=...`,
      },
      keyTakeaways: [
        "<b>A reset never emails the old password</b>, because it was hashed and does not exist to send.",
        "The flow is: request, generate a token, email a link, verify the token, hash the new password, delete the token.",
        "<b>A reset token must be unpredictable, expiring, single use, and stored hashed.</b>",
        "<b>A URL containing the user id is not a token</b>, and neither is anything derived from the email or a timestamp.",
        "Laravel stores reset tokens hashed, so leaking that table does not hand over resets.",
        "<b>Give the same response whether or not the email exists</b>, or the form enumerates your accounts.",
        "<b>`sendResetLink()` returns a status</b> (`RESET_LINK_SENT`, `INVALID_USER`, `RESET_THROTTLED`) worth logging, never surfacing.",
        "<b>Rate limit both reset routes</b>, or the form becomes a way to send somebody unlimited email.",
        "<b>Decide what a reset does to existing sessions</b>: someone resetting a stolen password expects the thief logged out.",
        "Regenerating `remember_token` kills remembered logins on other devices.",
        "<b>Validate with `Password::defaults()`</b>, and consider `uncompromised()` to reject known-breached passwords.",
      ],
      commonMistakes: [
        "<b>Building a reset URL from the user id.</b> Anybody can then reset anybody's password.",
        "<b>Saying \"no account with that email\".</b> The forgot-password form becomes an account-discovery tool.",
        "<b>Leaving reset tokens valid after use.</b> Anyone who saw the link can reset the password again.",
        "<b>Leaving other sessions alive after a reset.</b> The attacker whose access prompted it stays logged in.",
        "<b>Not throttling the request route.</b> It becomes an email-sending tool aimed at whoever you like.",
      ],
      quiz: [
        {
          question: "Why can a password reset not email the current password?",
          options: [
            "It would be too long",
            "The password is hashed, so it does not exist in a form that could be sent",
            "Email is not secure enough",
            "It can, with encryption",
          ],
          correctIndex: 1,
          explanation: "A site that can email your password stores something it should not.",
        },
        {
          question: "Which of these is not a required property of a reset token?",
          options: ["Unpredictable", "Expires", "Single use", "Human readable"],
          correctIndex: 3,
          explanation: "It should be random; readability would make it guessable.",
        },
        {
          question: "Why respond identically whether or not the email exists?",
          options: [
            "It is simpler to code",
            "Different responses let an attacker discover which emails have accounts",
            "It is faster",
            "Laravel requires it",
          ],
          correctIndex: 1,
          explanation: "That is how a credential-stuffing list gets refined.",
        },
        {
          question: "Why regenerate `remember_token` during a reset?",
          options: [
            "To invalidate the reset token",
            "So remembered logins on other devices stop working, including an attacker's",
            "To hash the new password",
            "It is required by the database",
          ],
          correctIndex: 1,
          explanation: "Someone resetting a stolen password expects the thief logged out.",
        },
      ],
    },
    {
      id: "email-verification",
      title: "Email verification & the whole flow",
      durationMinutes: 10,
      explanation: "Registration proves somebody typed an email address. Verification proves they can read it.\n\n---\n\n### 1. Basic — why it exists\n\nWithout verification, anybody can register as anybody:\n\n```text\nsignup form\n     ↓\nemail: someone.else@example.com\n     ↓\naccount created\n```\n\nThat matters more than it first looks. Password resets go to that address, so an unverified account attached to an email you do not control is an account somebody else can take. And an application that emails unverified addresses eventually gets marked as spam.\n\nThe flow:\n\n```text\nregistration\n     ↓\nuser created, email_verified_at = null\n     ↓\nverification email with a signed link\n     ↓\nuser clicks it\n     ↓\nemail_verified_at = now()\n```\n\nTwo steps to turn it on. The model declares the contract:\n\n```php\nclass User extends Authenticatable implements MustVerifyEmail\n{\n    //\n}\n```\n\nand the routes get a second middleware:\n\n```php\nRoute::get('/dashboard', ...)->middleware(['auth', 'verified']);\n```\n\n---\n\n### 2. Intermediate — two middlewares, two questions\n\n```text\nauth       is anybody logged in?\nverified   has that person proved they own the address?\n```\n\nThey stack, and the order matters conceptually if not mechanically: there is no point asking the second question until the first is answered.\n\n```text\nguest            → /login\nlogged in,       → /email/verify\n  unverified\nlogged in,       → the page\n  verified\n```\n\nNote what verification does <i>not</i> do: it does not block logging in. An unverified user is authenticated, and can reach anything protected by `auth` alone. That is usually right, because they need somewhere to land and a resend button, but it means you have to decide which routes carry `verified` rather than assuming it applies everywhere.\n\nThe verification link is <b>signed</b>: it carries a hash Laravel checks, so nobody can craft a link verifying an address they do not control, and it expires.\n\n---\n\n### 3. Advanced — the whole picture\n\nEverything today, in one diagram:\n\n```text\n              Registration\n                   ↓\n                 User\n                   ↓\n            Hash::make(password)\n                   ↓\n               Database\n                   ↓\n           Email verification\n                   ↓\n               Verified\n                   ↓\n                 Login\n                   ↓\n            Auth::attempt()\n                   ↓\n         session regeneration\n                   ↓\n             Authenticated\n                   ↓\n        ┌──────────┴──────────┐\n        ↓                     ↓\n  auth middleware      verified middleware\n        └──────────┬──────────┘\n                   ↓\n               Dashboard\n```\n\nand separately:\n\n```text\nForgot password → reset token → email → new password\n     → Hash::make() → database\n```\n\nThree practical notes to finish.\n\n<b>Sending mail during registration slows registration.</b> Queue the verification email rather than making the user wait for an SMTP round trip, which is a good habit before you meet queues properly.\n\n<b>Give unverified users somewhere to be.</b> A page saying what happened, with a resend button, throttled so it cannot be used to flood an inbox.\n\n<b>And decide deliberately what unverified users may do.</b> Blocking everything is safe and frustrating; blocking nothing makes the feature pointless. Most applications let them see their account and nothing that acts on the world.",
      diagram: `Why it exists

  signup form
       ↓
  email: someone.else@example.com
       ↓
  account created                    ← nobody checked

  Password resets go to that address, so an unverified
  account on an email you do not control is an account
  somebody else can take.


The flow

  registration
       ↓
  user created, email_verified_at = null
       ↓
  verification email, SIGNED link
       ↓
  user clicks it
       ↓
  email_verified_at = now()

  Two steps to turn on:

    class User extends Authenticatable implements MustVerifyEmail
    ->middleware(['auth', 'verified'])


Two middlewares, two questions

  auth       is anybody logged in?
  verified   has that person proved they own the address?

  guest                    → /login
  logged in, unverified    → /email/verify
  logged in, verified      → the page

  Verification does NOT block logging in. An unverified
  user is authenticated and can reach anything protected
  by auth alone — which is usually right, because they
  need somewhere to land and a resend button.

  The link is signed, so nobody can craft one for an
  address they do not control, and it expires.


The whole day, in one picture

              Registration
                   ↓
                 User
                   ↓
            Hash::make(password)
                   ↓
               Database
                   ↓
           Email verification
                   ↓
               Verified
                   ↓
                 Login
                   ↓
            Auth::attempt()
                   ↓
         session regeneration
                   ↓
             Authenticated
                   ↓
        ┌──────────┴──────────┐
        ↓                     ↓
  auth middleware      verified middleware
        └──────────┬──────────┘
                   ↓
               Dashboard

  Forgot password → reset token → email → new password
       → Hash::make() → database


Three practical notes

  Queue the verification email, or registration waits
  for an SMTP round trip.

  Give unverified users a page with a resend button,
  throttled so it cannot flood an inbox.

  Decide deliberately what they may do. Blocking
  everything is safe and frustrating. Blocking nothing
  makes the feature pointless.`,
      codeExample: {
        title: "Turning verification on",
        code: `<?php
// ---------- 1. The model declares the contract ----------

namespace App\\Models;

use Illuminate\\Contracts\\Auth\\MustVerifyEmail;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }
}


<?php
// ---------- 2. Routes ----------

Route::middleware('auth')->group(function () {

    // Somewhere for unverified users to be.
    Route::get('/email/verify', fn () => view('auth.verify-email'))
        ->name('verification.notice');

    // The signed link from the email.
    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();          // sets email_verified_at

        return redirect('/dashboard');
    })->middleware('signed')->name('verification.verify');

    // Resend, throttled so it cannot flood an inbox.
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'Verification link sent.');
    })->middleware('throttle:6,1')->name('verification.send');

    // Authenticated AND verified.
    Route::middleware('verified')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::post('/invoices', [InvoiceController::class, 'store']);
    });
});


<?php
// ---------- 3. Registration ----------

public function register(Request $request)
{
    $user = User::create($request->validate([
        'name'     => ['required', 'string', 'max:255'],
        'email'    => ['required', 'email', 'unique:users'],
        'password' => ['required', 'confirmed', Password::defaults()],
    ]));

    // Queue it, or registration waits for an SMTP round trip.
    event(new Registered($user));

    Auth::login($user);
    $request->session()->regenerate();

    return redirect()->route('verification.notice');
}


<?php
// ---------- Checking it yourself ----------

$request->user()->hasVerifiedEmail();
$request->user()->markEmailAsVerified();

// The three states:
//   guest                 → /login
//   logged in, unverified → /email/verify
//   logged in, verified   → the page`,
      },
      keyTakeaways: [
        "<b>Registration proves somebody typed an address; verification proves they can read it.</b>",
        "An unverified account on an address you do not control is an account somebody else can take, via password reset.",
        "<b>Implement `MustVerifyEmail` on the model and add `verified` middleware to routes.</b>",
        "<b>`auth` asks whether anybody is logged in; `verified` asks whether they proved they own the address.</b>",
        "<b>Verification does not block logging in</b>, so decide which routes carry `verified`.",
        "The verification link is signed and expiring, so nobody can craft one for an address they do not control.",
        "`hasVerifiedEmail()` and `markEmailAsVerified()` let you check and set it yourself.",
        "<b>Queue the verification email</b>, or registration waits for an SMTP round trip.",
        "<b>Give unverified users a page with a throttled resend button</b>, so it cannot flood an inbox.",
        "Blocking everything is frustrating and blocking nothing is pointless, so choose deliberately.",
      ],
      commonMistakes: [
        "<b>Adding `verified` middleware without implementing `MustVerifyEmail`.</b> Nothing sends and nothing verifies.",
        "<b>Putting `verified` on the verification notice page.</b> The user can never reach the page telling them to verify.",
        "<b>Assuming an unverified user cannot log in.</b> They are authenticated; only `verified` routes are closed.",
        "<b>Leaving the resend route unthrottled.</b> It becomes a way to flood somebody's inbox.",
        "<b>Sending the verification email synchronously.</b> Registration then waits for the mail server.",
      ],
      quiz: [
        {
          question: "What does email verification prove?",
          options: [
            "That the password is strong",
            "That the person can read the address they registered with",
            "That the account is authorized",
            "That the email is unique",
          ],
          correctIndex: 1,
          explanation: "Which matters because password resets go to that address.",
        },
        {
          question: "What two things turn verification on?",
          options: [
            "A migration and a seeder",
            "Implementing `MustVerifyEmail` on the model and adding `verified` middleware",
            "A config flag",
            "A trait and a factory",
          ],
          correctIndex: 1,
          explanation: "The contract makes Laravel send the mail; the middleware enforces it.",
        },
        {
          question: "Can an unverified user log in?",
          options: [
            "No, login is blocked",
            "Yes; they are authenticated, but `verified` routes are closed to them",
            "Only for an hour",
            "Only with remember me",
          ],
          correctIndex: 1,
          explanation: "Which is why they need a landing page with a resend button.",
        },
        {
          question: "Why is the verification link signed?",
          options: [
            "For tracking",
            "So nobody can craft a link verifying an address they do not control",
            "To identify the mail client",
            "To allow reuse",
          ],
          correctIndex: 1,
          explanation: "It expires too, so an old email is not a permanent key.",
        },
      ],
    },
    {
      id: "starter-kits-fortify-socialite",
      title: "Starter kits, Fortify & Socialite",
      durationMinutes: 12,
      explanation: "Everything so far is what these tools generate for you. Knowing it first is what makes them safe to use.\n\n---\n\n### 1. Basic — starter kits\n\nA starter kit scaffolds registration, login, password reset, verification and the routes and views around them. Current Laravel offers them for:\n\n```text\nReact    Vue    Svelte    Livewire\n```\n\n> <b>Breeze and Jetstream are no longer the maintained direction for new applications.</b> Learn the newer starter-kit approach rather than building new projects on them.\n\nThe important framing: <b>a starter kit is application scaffolding, not the authentication concept.</b> It writes the controllers you wrote today, into your project, for you to own and change. It does not hide them.\n\nWhich means the useful question is not \"should I use one\", but \"do I understand what it generated\". If a starter kit's login controller is the first time you have seen `session()->regenerate()`, you cannot tell whether removing it matters.\n\nThere is also a WorkOS AuthKit variant, for applications whose authentication is more than email and password:\n\n```text\nYour Laravel application\n        │\n        ▼\n   WorkOS AuthKit\n        │\n        ├── Social login\n        ├── Passkeys\n        └── SSO\n```\n\nSSO is the one that decides it. A company buying your product for five hundred employees expects them to sign in with the company identity provider, not five hundred new passwords.\n\n---\n\n### 2. Intermediate — Fortify\n\nSometimes you want the authentication backend and none of the frontend. A React or Vue application, or a mobile app, has its own screens.\n\n<b>Fortify</b> is that: routes, controllers and the authentication logic, with no views.\n\n```text\nYour React / Vue / mobile frontend\n         │\n         ▼\n   Laravel Fortify\n         │\n         ├── Login\n         ├── Registration\n         ├── Password reset\n         ├── Email verification\n         └── Two-factor authentication\n```\n\n```text\nStarter kit          Fortify\n───────────          ───────\nroutes + views       routes only\ncontrollers in       controllers in the package\n  your project\nyou own and edit     you configure\nquickest start       your own frontend\n```\n\nThe two-factor support is the strongest argument. Implementing TOTP, recovery codes and the confirmation flow correctly is real work, and getting it slightly wrong is worse than not having it.\n\n---\n\n### 3. Advanced — Socialite, and the model behind it\n\n<b>Socialite</b> handles logging in with Google, GitHub, Facebook and the rest:\n\n```text\nyour application\n      ↓\n\"Log in with Google\"\n      ↓\nGoogle authenticates them\n      ↓\nredirects back with an identity\n      ↓\nfind or create a local user\n      ↓\nAuth::login()\n```\n\nAnd here is the part people get wrong. <b>A Google identity is not a Laravel user.</b>\n\n```text\n❌ Google user = Laravel user\n\n✓ Google identity\n       ↓\n  external provider id\n       ↓\n  local User\n       ↓\n  Laravel authentication\n```\n\nYour application still needs its own user record, because everything else in it points at that record: invoices, sessions, roles.\n\nThe naive implementation matches on email:\n\n```php\nUser::firstOrCreate(['email' => $googleUser->getEmail()]);\n```\n\nwhich has two problems. An email can change at the provider, and matching on email alone means anybody who can get a provider account with your email address can walk into your account.\n\nStore the provider identity separately:\n\n```text\nusers                 social_accounts\n─────                 ───────────────\nid                    user_id\nname                  provider        'google'\nemail                 provider_id     '10429...'\n```\n\nNow the same person can attach GitHub later, changing their Google email breaks nothing, and the join is on the provider's stable id rather than a display value.\n\n<b>And after all of it, the last line is the one from lesson two:</b>\n\n```php\nAuth::login($user);\n$request->session()->regenerate();\n```\n\nSocial login authenticates through somebody else. Your session, your rules, and every habit from today still applies.",
      diagram: `Starter kits

  React    Vue    Svelte    Livewire

  > Breeze and Jetstream are no longer the maintained
    direction for new applications.

  A starter kit is application SCAFFOLDING, not the
  authentication concept. It writes the controllers you
  wrote today into your project, for you to own.

  So the question is not "should I use one" but
  "do I understand what it generated".

  If a starter kit's login controller is the first time
  you have seen session()->regenerate(), you cannot tell
  whether removing it matters.


  WorkOS AuthKit variant, when auth is more than a password:

    Your application → WorkOS AuthKit
                          ├── Social login
                          ├── Passkeys
                          └── SSO

  SSO decides it. A company buying your product for 500
  employees expects their identity provider, not 500
  new passwords.


Fortify: the backend, no frontend

  Your React / Vue / mobile frontend
           ↓
     Laravel Fortify
           ├── Login
           ├── Registration
           ├── Password reset
           ├── Email verification
           └── Two-factor authentication

  Starter kit          Fortify
  ───────────          ───────
  routes + views       routes only
  controllers in       controllers in the package
    your project
  you own and edit     you configure
  quickest start       your own frontend

  The 2FA support is the strongest argument: TOTP,
  recovery codes and the confirmation flow are real
  work, and slightly wrong is worse than absent.


Socialite, and the model behind it

  your application
        ↓
  "Log in with Google"
        ↓
  Google authenticates them
        ↓
  redirects back with an identity
        ↓
  find or create a LOCAL user
        ↓
  Auth::login()


  ❌ Google user = Laravel user

  ✓ Google identity → provider id → local User
                                        ↓
                              Laravel authentication

  Matching on email alone has two problems:
    an email can change at the provider
    anyone who gets a provider account with your email
    walks into your account

  users              social_accounts
  ─────              ───────────────
  id                 user_id
  name               provider      'google'
  email              provider_id   '10429...'

  Same person can add GitHub later. Changing their
  Google email breaks nothing. The join is on a
  stable id, not a display value.


  And the last line is still lesson two's:

    Auth::login(\$user);
    \$request->session()->regenerate();`,
      codeExample: {
        title: "Socialite, done properly",
        code: `<?php
// ---------- The tables ----------

Schema::create('social_accounts', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')->constrained()->cascadeOnDelete();

    $table->string('provider');       // 'google', 'github'
    $table->string('provider_id');    // the provider's stable id

    $table->timestamps();

    // One provider account maps to one local user.
    $table->unique(['provider', 'provider_id']);
});


<?php
// ---------- The controller ----------

namespace App\\Http\\Controllers;

use App\\Models\\SocialAccount;
use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;
use Laravel\\Socialite\\Facades\\Socialite;

class SocialLoginController extends Controller
{
    public function redirect(string $provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback(Request $request, string $provider)
    {
        $socialUser = Socialite::driver($provider)->user();

        // Match on the provider's stable id, not the email.
        $account = SocialAccount::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($account) {
            $user = $account->user;
        } else {
            $user = DB::transaction(function () use ($socialUser, $provider) {
                $user = User::create([
                    'name'              => $socialUser->getName(),
                    'email'             => $socialUser->getEmail(),
                    'password'          => Str::random(40),   // unusable
                    'email_verified_at' => now(),             // the provider checked
                ]);

                $user->socialAccounts()->create([
                    'provider'    => $provider,
                    'provider_id' => $socialUser->getId(),
                ]);

                return $user;
            });
        }

        // Every habit from earlier today still applies.
        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->intended('/dashboard');
    }
}


<?php
// ---------- The mistake worth naming ----------

// ❌ An email can change at the provider, and anyone who
//    obtains a provider account with this address walks
//    straight into the local account.
User::firstOrCreate(['email' => $socialUser->getEmail()]);

// ✓ Join on provider + provider_id, kept in its own table,
//   so the same person can attach GitHub later and changing
//   their Google email breaks nothing.


<?php
// ---------- Routes ----------

Route::get('/auth/{provider}/redirect', [SocialLoginController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [SocialLoginController::class, 'callback']);`,
      },
      keyTakeaways: [
        "<b>A starter kit is application scaffolding</b>: it writes the controllers you wrote today into your project.",
        "Current kits target React, Vue, Svelte and Livewire; <b>Breeze and Jetstream are no longer the maintained direction.</b>",
        "<b>The question is not whether to use one, but whether you understand what it generated.</b>",
        "The WorkOS AuthKit variant adds social login, passkeys and SSO, which matters for company customers.",
        "<b>Fortify provides the authentication backend with no views</b>, for applications with their own frontend.",
        "Its two-factor support is the strongest argument, because TOTP and recovery codes are easy to get subtly wrong.",
        "<b>Socialite handles the OAuth round trip</b>, but your application still needs its own local user.",
        "<b>A Google identity is not a Laravel user</b>: everything else in your application points at the local record.",
        "<b>Match on the provider's stable id, not the email</b>, which can change and can be obtained by somebody else.",
        "<b>Store provider identities in their own table</b>, so a user can attach several providers.",
        "After any social login, `Auth::login()` and `session()->regenerate()` still apply.",
      ],
      commonMistakes: [
        "<b>Using a starter kit before understanding what it generates.</b> You cannot tell which lines matter.",
        "<b>Matching a social login on email alone.</b> Anyone obtaining a provider account with that address gets in.",
        "<b>Treating the provider's user as your user.</b> Your invoices, roles and sessions all point at a local record.",
        "<b>Storing `provider` and `provider_id` on the users table.</b> A second provider then has nowhere to go.",
        "<b>Skipping `session()->regenerate()` after a social login.</b> The same session fixation risk as any other login.",
      ],
      quiz: [
        {
          question: "What is a starter kit?",
          options: [
            "A package that hides authentication behind an API",
            "Scaffolding that writes authentication routes, controllers and views into your project",
            "A replacement for guards and providers",
            "A hosted identity service",
          ],
          correctIndex: 1,
          explanation: "You own and edit what it generates, which is why you need to understand it.",
        },
        {
          question: "When would you choose Fortify over a starter kit?",
          options: [
            "When you want it done fastest",
            "When you have your own frontend and want the authentication backend only",
            "When you need a second guard",
            "When you cannot use Eloquent",
          ],
          correctIndex: 1,
          explanation: "Routes and logic, no views, plus two-factor support.",
        },
        {
          question: "Why should a social login not match on email alone?",
          options: [
            "Emails are slow to query",
            "An email can change at the provider, and anyone obtaining a provider account with that address gets in",
            "Providers do not return emails",
            "It breaks eager loading",
          ],
          correctIndex: 1,
          explanation: "Match on the provider's stable id, in its own table.",
        },
        {
          question: "What does your application still need after a successful social login?",
          options: [
            "Nothing; the provider handles it",
            "Its own local user record, then `Auth::login()` and a session regeneration",
            "A second guard",
            "A password from the user",
          ],
          correctIndex: 1,
          explanation: "Everything else in your application points at the local record.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the difference between a guard and a provider?",
      options: [
        "None",
        "A guard decides how the user is authenticated; a provider decides where the user comes from",
        "A guard is for APIs, a provider for browsers",
        "A provider validates passwords",
      ],
      correctIndex: 1,
      explanation: "Guard = how. Provider = from where.",
    },
    {
      question: "What happens when `Auth::attempt()` succeeds?",
      options: [
        "The password is stored in the session",
        "The user's id is put in the session, after `Hash::check()` verifies the password",
        "A token is emailed",
        "The user model is cached",
      ],
      correctIndex: 1,
      explanation: "Every credential key except `password` becomes a `where` clause.",
    },
    {
      question: "Why regenerate the session after login?",
      options: [
        "To clear flash data",
        "To prevent session fixation, where an attacker's pre-login session id becomes the authenticated one",
        "To refresh the CSRF token only",
        "For performance",
      ],
      correctIndex: 1,
      explanation: "One line, and the attack does not exist.",
    },
    {
      question: "Why is hashing different from encryption?",
      options: [
        "Hashing is faster",
        "Hashing is one-way, so the original value can never be recovered",
        "Encryption is one-way",
        "They are the same with different names",
      ],
      correctIndex: 1,
      explanation: "Encrypt when you need the value back; hash when you never do.",
    },
    {
      question: "How does password rehashing improve security without a mass reset?",
      options: [
        "It re-encrypts the stored hash",
        "At login, the plain password is briefly available, so an outdated hash can be replaced",
        "It emails every user a new password",
        "It runs as a scheduled job",
      ],
      correctIndex: 1,
      explanation: "Login is the one moment you hold the password.",
    },
    {
      question: "Why must logout invalidate the session?",
      options: [
        "To free memory",
        "Otherwise the session survives with its data and CSRF token intact",
        "To clear the remember token",
        "It does not need to",
      ],
      correctIndex: 1,
      explanation: "`Auth::logout()` alone only forgets the authenticated user.",
    },
    {
      question: "How does `auth` middleware differ from `verified`?",
      options: [
        "They are the same",
        "`auth` asks whether anybody is logged in; `verified` asks whether they proved they own the email address",
        "`verified` also checks permissions",
        "`auth` requires a password confirmation",
      ],
      correctIndex: 1,
      explanation: "An unverified user is still authenticated.",
    },
    {
      question: "What must a password reset token be?",
      options: [
        "Readable and short",
        "Unpredictable, expiring, single use, and stored hashed",
        "Derived from the user id",
        "Permanent, so the link keeps working",
      ],
      correctIndex: 1,
      explanation: "A URL containing the user id is not a token.",
    },
    {
      question: "Why would you choose Fortify over a starter kit?",
      options: [
        "It is faster to set up",
        "You have your own frontend and want the authentication backend only, plus two-factor support",
        "It supports more guards",
        "Starter kits cannot do password resets",
      ],
      correctIndex: 1,
      explanation: "Routes and controllers in the package, no views.",
    },
    {
      question: "How should a social login connect an external identity to a local user?",
      options: [
        "By matching on email",
        "By storing the provider and the provider's stable id, and joining on those",
        "By using the provider's user as the Laravel user",
        "By generating a password from the provider id",
      ],
      correctIndex: 1,
      explanation: "An email can change, and can be obtained by somebody else.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Build InvoiceHub's authentication by hand: registration, login, verification, password reset and logout, with the security reason for every step written down.",
    brief: "InvoiceHub has had no users at all. Every invoice belongs to nobody, and anybody who can reach the URL can see everything.\n\nToday it gets accounts, and you build them without a starter kit. That is deliberate. A starter kit would generate all of this in a minute, and you would not be able to tell which lines are load-bearing. Build it once by hand and every starter kit you use afterwards is readable.\n\nThe rule for the day: <b>for every step, write down the attack it prevents.</b> If you cannot name one, you have either found a line that does not matter or a gap in your understanding, and both are worth knowing.\n\nAuthorization stays out of scope. Today is only about who somebody is, not what they may do. Making sure a customer cannot read another customer's invoices comes later.",
    steps: [
      "Read `config/auth.php` before writing anything. Write down which guard and which provider a request to InvoiceHub uses, and what each one does.",
      "Build registration: a form, validation with `Password::defaults()`, and `User::create()`. Add the `'password' => 'hashed'` cast rather than calling `Hash::make()` yourself, and confirm from tinker that the column holds a hash.",
      "Log the user in after registration with `Auth::login()` and regenerate the session. Write a comment naming the attack that regeneration prevents.",
      "Build login: `Auth::attempt()`, a session regeneration, and `redirect()->intended()`. Use one error message for both a wrong password and an unknown email, and note why.",
      "Add a remember-me checkbox, confirm the `remember_token` column exists, and test both paths. Close the browser and reopen it to see the difference.",
      "Build logout as all three calls. Then remove `session()->invalidate()`, log out, and check what survives in the session. Put it back.",
      "Protect the invoice routes with `auth`, and put the login and registration routes behind `guest`. Confirm a logged-in user visiting `/login` is redirected.",
      "Add `throttle:5,1` to the login route and test it by failing five times. Note what a user sees and whether that is acceptable.",
      "Implement `MustVerifyEmail` on `User`, add a verification notice page with a throttled resend button, and put `verified` on the invoice routes. Log in as an unverified user and confirm exactly which pages you can reach.",
      "Build the password reset flow: request, email, token form, and update. Use Laravel's `Password` facade rather than rolling your own tokens.",
      "Regenerate `remember_token` during the reset. Then test it properly: log in on two browsers, reset the password in one, and confirm the other is signed out.",
      "Try to reuse a reset token after it has worked. Confirm it fails, and note where Laravel stores and deletes it.",
      "Add `password.confirm` middleware to a settings page that changes the email address. Confirm the prompt appears, and that it does not appear again immediately afterwards.",
      "Attach the invoices to users: add `user_id`, a relationship, and scope the list to `$request->user()`. Then log in as a second user and confirm the first user's invoices are gone from the list.",
      "Write the security tests: wrong password, unknown email, duplicate registration, weak password, expired reset token, reused reset token, unverified user on a verified route, guest on a protected route, and a session that changes id after login.",
      "Grep the codebase for anywhere the password could leak: a `Log::info($request->all())`, a missing `$hidden`, a JSON response containing a user. Fix whatever you find.",
      "Finally, draw the whole flow from memory: registration through hashing, verification, login, session regeneration, the two middlewares, and separately the reset flow. Compare it with what you built.",
    ],
    acceptance: [
      "A user can register, verify their email, log in, reset their password and log out, with no starter kit involved.",
      "The `users` table contains no plain passwords, and no log file or JSON response contains one either.",
      "The session id changes after every login, and you can demonstrate it.",
      "Logging out leaves no usable session and issues a fresh CSRF token.",
      "A wrong password and an unknown email produce the same message.",
      "An unverified user can log in and reach the notice page, and nothing else.",
      "Resetting a password signs the user out of other browsers.",
      "A used reset token cannot be used again.",
      "Failing login five times is throttled.",
      "The invoice list shows only the signed-in user's invoices.",
      "You can state, for each step, which attack it prevents.",
    ],
    stretch: [
      "Add Socialite for one provider, with a `social_accounts` table keyed on provider and provider id rather than email.",
      "Add a second guard for an admin area with its own provider, and confirm logging into one does not log you into the other.",
      "Raise `BCRYPT_ROUNDS`, log in as an existing user, and prove from the database that the stored hash was upgraded without a password reset.",
    ],
  },
};
