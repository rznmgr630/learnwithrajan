import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_22_LESSONS: LessonDay = {
  day: 22,
  title: "Building a REST API with Sanctum",
  totalMinutes: 91,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "api-routes-and-sanctum",
      title: "API routes, and what makes them different",
      durationMinutes: 11,
      explanation: "Everything so far has been a browser talking to Blade. An API is the same application answering a different kind of client.\n\n```text\nClient\n  │  HTTP + JSON\n  ▼\nLaravel API\n  ├── Authentication\n  ├── Authorization\n  ├── Validation\n  ├── Business logic\n  ├── Eloquent\n  └── API Resources\n           ↓\n         JSON\n```\n\nEvery one of those is a day you have already done. <b>Today is about what changes when the caller is a mobile app rather than a browser.</b>\n\n---\n\n### 1. Basic — turning it on\n\n```bash\nphp artisan install:api\n```\n\nWhich creates `routes/api.php`, registers it, and installs Sanctum. API routes are not there by default because plenty of applications never need them.\n\n```text\nroutes/\n├── web.php\n└── api.php\n```\n\nRoutes in `api.php` are prefixed with `/api` automatically:\n\n```http\nGET    /api/posts\nPOST   /api/posts\nGET    /api/posts/123\nPATCH  /api/posts/123\nDELETE /api/posts/123\n```\n\n---\n\n### 2. Intermediate — why two files\n\nThey are not two files for tidiness. <b>They have different middleware, and that is the whole point.</b>\n\n```text\nweb.php                    api.php\n───────                    ───────\nsessions                   no session\ncookies                    no cookies\nCSRF protection            no CSRF\nredirects on failure       JSON on failure\nstateful                   stateless\n```\n\nEach line follows from the client.\n\n<b>No session, because there is nothing to remember between requests.</b> A mobile app sends its credentials every time, so the server keeps nothing.\n\n<b>No CSRF, because there is nothing to forge.</b> Day 20: CSRF exists because browsers attach cookies automatically. A token in an `Authorization` header is attached deliberately, by code, so an attacker's page cannot cause one to be sent.\n\n<b>And failures come back as JSON.</b> A browser gets redirected back to the form with errors in the session; an API client gets a 422 with a body it can read. Same validation, different presentation, decided by which file the route is in.\n\n```text\niOS / Android\n      ↓\n    HTTPS\n      ↓\n  Laravel API\n```\n\nIt never asked for a Blade view, and it cannot follow a redirect to one.\n\n---\n\n### 3. Advanced — what Sanctum is\n\n<b>Sanctum</b> is Laravel's lightweight API authentication, and it does two quite different jobs. Knowing they are different is the thing people get wrong first.\n\n```text\nAPI tokens                 SPA cookies\n──────────                 ───────────\nmobile apps                a first-party SPA on your domain\nCLI tools                  React or Vue you also wrote\nthird-party clients\n\nAuthorization: Bearer …    the session cookie\nstateless                  stateful\nno CSRF                    CSRF still applies\n```\n\nThe token flow, which is most of today:\n\n```text\nclient\n  ↓ log in\nLaravel\n  ↓ issues a token\nclient stores it\n  ↓\nAuthorization: Bearer …  on every request\n```\n\nThe SPA flow is different: your JavaScript and your API are on the same site, the browser holds a normal session cookie, and Sanctum simply lets that count as authentication for `api.php` routes. <b>No token is involved, and CSRF protection comes back</b>, because cookies are automatic again.\n\nThe choice is not about preference:\n\n```text\nyou control the frontend and it runs on your domain  →  SPA cookies\nanything else                                        →  tokens\n```\n\nAnd it is worth being clear about one thing before the next lesson: <b>a token is a credential, not a session.</b> It does not expire when a browser closes, it is stored on the client, and anybody holding it is that user until it is revoked. Everything in the next two lessons follows from that.",
      diagram: `The same application, a different client

  Client
    │  HTTP + JSON
    ▼
  Laravel API
    ├── Authentication      Day 18
    ├── Authorization       Day 19
    ├── Validation          Day 9
    ├── Business logic
    ├── Eloquent            Days 14–16
    └── API Resources       Day 16
             ↓
           JSON

  Every one is a day you have done. Today is what
  changes when the caller is not a browser.


Turning it on

  php artisan install:api

  creates routes/api.php, registers it, installs Sanctum.
  Not there by default, because plenty of apps never
  need it.

  Routes are prefixed /api automatically.


Why two files: different MIDDLEWARE

  web.php                   api.php
  ───────                   ───────
  sessions                  no session
  cookies                   no cookies
  CSRF protection           no CSRF
  redirects on failure      JSON on failure
  stateful                  stateless

  No session: a mobile app sends its credentials every
  time, so the server remembers nothing.

  No CSRF: CSRF exists because browsers attach cookies
  automatically. A token in an Authorization header is
  attached deliberately, by code. Nothing to forge.

  JSON on failure: a browser is redirected back to the
  form; an API client gets a 422 with a readable body.
  Same validation, different presentation, decided by
  which file the route lives in.


Sanctum does TWO different jobs

  API tokens                SPA cookies
  ──────────                ───────────
  mobile apps               a first-party SPA on your domain
  CLI tools                 React or Vue you also wrote
  third-party clients

  Authorization: Bearer …   the session cookie
  stateless                 stateful
  no CSRF                   CSRF STILL APPLIES

  The token flow (most of today):

    client → log in → Laravel → issues a token
                                    ↓
                         client stores it
                                    ↓
                  Authorization: Bearer … every request

  The SPA flow: your JavaScript and your API are on the
  same site, the browser holds a normal session cookie,
  and Sanctum lets that authenticate api.php routes.
  No token, and CSRF is back, because cookies are
  automatic again.

    you control the frontend, on your domain → SPA cookies
    anything else                            → tokens


  And before the next lesson:

    A token is a CREDENTIAL, not a session.

  It does not expire when a browser closes, it is stored
  on the client, and anybody holding it is that user
  until it is revoked.`,
      codeExample: {
        title: "Setting up an API",
        code: `# Creates routes/api.php, registers it, installs Sanctum.
php artisan install:api


<?php
// routes/api.php
//
// Automatically prefixed with /api and given the api
// middleware group: no session, no cookies, no CSRF.

use App\\Http\\Controllers\\Api\\PostController;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());

    Route::apiResource('posts', PostController::class);
});

// GET    /api/posts
// POST   /api/posts
// GET    /api/posts/{post}
// PATCH  /api/posts/{post}
// DELETE /api/posts/{post}


<?php
// ---------- The same validation, two presentations ----------

// In web.php: a failure redirects back with errors in
// the session, and the Blade form renders them.
//
// In api.php: a failure is a 422 with a JSON body.
//
// You write the rules once; the route file decides how
// a failure is delivered.

$request->validate([
    'title' => ['required', 'string', 'max:255'],
]);

// api.php response:
// 422
// {
//   "message": "The title field is required.",
//   "errors": { "title": ["The title field is required."] }
// }


<?php
// ---------- Why an API route needs no CSRF ----------

// Day 20: CSRF exists because a browser attaches cookies
// automatically, so a request from evil.com is genuinely
// authenticated.
//
// A token is attached by code:
//
//   Authorization: Bearer 3|abc...
//
// An attacker's page cannot cause that header to be sent,
// so there is nothing to forge.
//
// ⚠️ This stops being true for Sanctum SPA authentication,
//    which uses cookies. CSRF applies there.


# ---------- The two Sanctum flows ----------

# Token: a mobile app, a CLI, a third-party client.
curl https://example.com/api/posts \\
  -H "Authorization: Bearer 3|abcdef..." \\
  -H "Accept: application/json"

# SPA: your own React app on your own domain, using the
# session cookie the browser already holds. No token.


# ---------- The SPA flow, wired up ----------

# .env — which domains count as "first party"
SANCTUM_STATEFUL_DOMAINS=localhost:5173,app.example.com
SESSION_DOMAIN=.example.com

# The frontend must do this ONCE, before logging in:
#
#   GET /sanctum/csrf-cookie
#
# It sets the XSRF-TOKEN cookie. Without it, your very
# first POST /login returns 419 and looks like a broken
# login rather than a missing setup step.

// resources/js/bootstrap.js
axios.defaults.withCredentials = true;      // send cookies
axios.defaults.withXSRFToken  = true;       // echo the CSRF cookie

// And then, in order:
await axios.get('/sanctum/csrf-cookie');    // 1. get the cookie
await axios.post('/login', { email, password });   // 2. log in
await axios.get('/api/user');               // 3. authenticated by session

// No token anywhere. The browser holds a session cookie,
// exactly as it does for your Blade pages — which is why
// CSRF still applies here and does not for tokens.`,
      },
      keyTakeaways: [
        "<b>An API is the same application answering a client that is not a browser.</b>",
        "`php artisan install:api` creates `routes/api.php`, registers it and installs Sanctum.",
        "<b>`web.php` and `api.php` exist to have different middleware</b>, not for tidiness.",
        "<b>API routes have no session and no cookies</b>, because the client sends its credentials every time.",
        "<b>API routes need no CSRF</b>, because a token header is attached by code rather than automatically.",
        "<b>Failures come back as JSON rather than a redirect</b>, which is the same validation presented differently.",
        "<b>Sanctum does two different jobs</b>: API tokens, and cookie authentication for a first-party SPA.",
        "Token authentication is stateless and header-based; SPA authentication uses the session cookie and still needs CSRF.",
        "<b>SPA mode needs three things wired up</b>: `SANCTUM_STATEFUL_DOMAINS`, `withCredentials` on the client, and a `GET /sanctum/csrf-cookie` before the first login.",
        "<b>Use SPA cookies when you control the frontend and it runs on your domain</b>, and tokens for everything else.",
        "<b>A token is a credential, not a session</b>: anybody holding it is that user until it is revoked.",
      ],
      commonMistakes: [
        "<b>Putting API routes in `web.php`.</b> They pick up sessions and CSRF, and failures redirect instead of returning JSON.",
        "<b>Confusing the two Sanctum flows.</b> SPA authentication uses cookies and does need CSRF.",
        "<b>Skipping `GET /sanctum/csrf-cookie`.</b> The first login returns 419 and looks like broken credentials.",
        "<b>Expecting a redirect to work for an API client.</b> It cannot follow one, and would not want the HTML.",
        "<b>Forgetting the `Accept: application/json` header when testing.</b> Laravel then answers as if you were a browser.",
        "<b>Treating a token like a session.</b> It survives everything until you revoke it.",
      ],
      quiz: [
        {
          question: "Why do API routes not need CSRF protection?",
          options: [
            "APIs are trusted",
            "A token header is attached deliberately by code, not automatically like a cookie",
            "CSRF only applies to GET",
            "Laravel disables it for performance",
          ],
          correctIndex: 1,
          explanation: "An attacker's page cannot cause an `Authorization` header to be sent.",
        },
        {
          question: "What is the real difference between `web.php` and `api.php`?",
          options: [
            "The URL prefix only",
            "Different middleware: sessions, cookies and CSRF versus stateless JSON",
            "API routes are faster",
            "They use different controllers",
          ],
          correctIndex: 1,
          explanation: "Which is also why a failure redirects in one and returns a 422 in the other.",
        },
        {
          question: "Which Sanctum flow still needs CSRF protection?",
          options: [
            "Token authentication",
            "SPA cookie authentication",
            "Both",
            "Neither",
          ],
          correctIndex: 1,
          explanation: "It uses the session cookie, which the browser attaches automatically.",
        },
        {
          question: "When should you use Sanctum's SPA cookie authentication rather than tokens?",
          options: [
            "For mobile applications",
            "When you control the frontend and it runs on your own domain",
            "For third-party clients",
            "Whenever the API is public",
          ],
          correctIndex: 1,
          explanation: "Anything else, including mobile and CLI clients, uses tokens.",
        },
      ],
    },
    {
      id: "tokens",
      title: "Issuing tokens & protecting routes",
      durationMinutes: 12,
      explanation: "How a client gets a credential, and how the server recognises it.\n\n---\n\n### 1. Basic — issuing one\n\nThe model needs Sanctum's trait:\n\n```php\nuse Laravel\\Sanctum\\HasApiTokens;\n\nclass User extends Authenticatable\n{\n    use HasApiTokens;\n}\n```\n\nThen, after checking credentials:\n\n```php\n$token = $user->createToken('mobile-app');\n\nreturn ['token' => $token->plainTextToken];\n```\n\n```text\nuser\n ↓\ncreateToken()\n ↓\na row in personal_access_tokens\n ↓\nthe plain text token, once\n```\n\n<b>`plainTextToken` is available exactly once</b>, on the object you just created. The database stores a hash, exactly as it does for a password, so a leak of that table does not hand over anybody's tokens, and there is no way to look one up later.\n\nWhich means the client stores it, and \"I lost my token\" is answered by issuing a new one, never by retrieving the old one.\n\nThe name (`'mobile-app'`) is for humans: it is what a \"your devices\" screen lists, so the user can see and revoke them individually.\n\n---\n\n### 2. Intermediate — the login endpoint\n\nEverything from Day 18 still applies, minus the session:\n\n```php\n$request->validate([\n    'email'    => ['required', 'email'],\n    'password' => ['required'],\n]);\n\n$user = User::where('email', $request->email)->first();\n\nif (! $user || ! Hash::check($request->password, $user->password)) {\n    throw ValidationException::withMessages([\n        'email' => ['Invalid credentials.'],\n    ]);\n}\n\nreturn ['token' => $user->createToken($request->device_name)->plainTextToken];\n```\n\nNote what is <i>not</i> there. No `Auth::attempt()`, because there is no session to establish, and no `session()->regenerate()`, because there is no session to fix.\n\nWhat is still there: <b>one error message for a wrong password and an unknown email</b>, and <b>rate limiting on this route</b>. An API login is a better target than a web one, because there is no interface slowing anybody down.\n\n---\n\n### 3. Advanced — the request, and the guard\n\nThe client sends:\n\n```http\nAuthorization: Bearer 3|abcdef...\n```\n\n```text\nrequest\n  ↓\nBearer token\n  ↓\nSanctum: hash it, find the row, load the user\n  ↓\n$request->user()\n```\n\nAnd you protect routes with the guard:\n\n```php\nRoute::middleware('auth:sanctum')->group(function () {\n    Route::get('/user', fn (Request $request) => $request->user());\n    Route::apiResource('posts', PostController::class);\n});\n```\n\n```text\nGET /api/posts\n      ↓\nauth:sanctum\n  ┌───┴───┐\nvalid   invalid\n  ↓        ↓\nuser      401\n```\n\n<b>`auth:sanctum` is the guard name from Day 18</b>, doing exactly what that lesson described: the guard decides how identity is established, the provider fetches the user. Here the guard reads a header instead of a session, and the provider is the same one.\n\nInside a controller, `$request->user()` is the authenticated user, as always.\n\nTwo practical notes.\n\n<b>Ask for JSON.</b> Without `Accept: application/json`, an unauthenticated request gets redirected to a login page that does not exist, and you spend twenty minutes debugging a 302 that should have been a 401.\n\n<b>And the token is only as safe as its transport.</b> A bearer token over plain HTTP is readable by anybody on the network, and unlike a session cookie there is no `secure` flag to forget: it is your job to serve the API over HTTPS and nothing else.\n\n<b>One piece of history, because you will meet it in older codebases.</b> Before Sanctum, Laravel shipped a `token` guard backed by a single `api_token` column on `users`:\n\n```php\n// config/auth.php — the old way\n'api' => ['driver' => 'token', 'provider' => 'users'],\n```\n\nOne token per user, stored in plain text, with no scopes, no expiry, no revocation short of overwriting the column, and no record of when it was last used. <b>Every one of those is a reason `personal_access_tokens` exists.</b> Recognise it, and never start a new project with it.\n\n<b>Registration is the same shape as login, one step earlier:</b>\n\n```php\n$user = User::create([...]);\n\nreturn response()->json([\n    'token' => $user->createToken($request->device_name)->plainTextToken,\n], 201);\n```\n\nNote what is missing compared with Day 18's web version: no `Auth::login()`, no `session()->regenerate()`, no redirect. <b>The client gets a credential and goes away</b>, which is the whole difference between an API and a form.\n\nAnd then the question nobody answers until it is a problem: <b>where does the client keep it?</b>\n\n```text\niOS         Keychain\nAndroid     Keystore\nbrowser     an HttpOnly cookie, or use SPA mode instead\n```\n\n<b>Not `localStorage`</b>, which any script on the page can read, and never in a log line. A token in your application logs is a credential in your log aggregator, readable by everyone with access and retained as long as your policy says.\n\nOne practical note for building: <b>Postman and Insomnia both have an Authorization tab</b> where you paste the token as a Bearer credential. Save it as an environment variable and reference it as `{{token}}`, so one login updates every request in the collection.",
      diagram: `Issuing a token

  use Laravel\\Sanctum\\HasApiTokens;

  \$token = \$user->createToken('mobile-app');
  \$token->plainTextToken

    user → createToken() → a row in personal_access_tokens

  ⚠️  What it replaced, still in older codebases:

      config/auth.php
        'api' => ['driver' => 'token', ...]

      one api_token column on users:
        plain text · one per user · no scopes
        no expiry · no revocation · no last-used

      Every one of those is why personal_access_tokens
      exists. Recognise it; never start with it.
                                 ↓
                       the plain text token, ONCE

  The database stores a HASH, as it does for a password.
  A leak of that table hands over nothing, and there is
  no way to look a token up later.

  "I lost my token" is answered by issuing a new one.

  The name is for humans: it is what a "your devices"
  screen lists, so tokens can be revoked individually.


The login endpoint

  Everything from Day 18, minus the session:

    validate
    find the user
    Hash::check
    createToken()

  NOT there:
    Auth::attempt()          no session to establish
    session()->regenerate()  no session to fix

  Still there:
    one message for a wrong password AND an unknown email
    rate limiting on this route

  An API login is a better target than a web one:
  no interface slows anybody down.


The request

  Authorization: Bearer 3|abcdef...

    request → Bearer token → Sanctum hashes it, finds
              the row, loads the user → \$request->user()


  Route::middleware('auth:sanctum')

    GET /api/posts
          ↓
    auth:sanctum
      ┌───┴───┐
    valid   invalid
      ↓        ↓
     user     401

  auth:sanctum is the GUARD from Day 18, doing exactly
  what that lesson described: the guard decides how
  identity is established, the provider fetches the user.
  Here the guard reads a header instead of a session.


Two practical notes

  Send Accept: application/json.
    Without it, an unauthenticated request is REDIRECTED
    to a login page that does not exist, and you debug a
    302 that should have been a 401.

  A bearer token is only as safe as its transport.
    Over plain HTTP anybody on the network reads it, and
    unlike a session cookie there is no secure flag to
    forget: serving the API over HTTPS is your job.`,
      codeExample: {
        title: "A login endpoint and a protected route",
        code: `<?php
// ---------- The model ----------

namespace App\\Models;

use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $hidden = ['password', 'remember_token'];
}


<?php
// ---------- The login endpoint ----------

namespace App\\Http\\Controllers\\Api;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Validation\\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'       => ['required', 'email'],
            'password'    => ['required'],
            'device_name' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        // One message for both cases, exactly as on Day 18.
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        // plainTextToken is available exactly once.
        return response()->json([
            'token' => $user->createToken($request->device_name)->plainTextToken,
        ]);
    }
}

// No Auth::attempt() and no session()->regenerate():
// there is no session here to establish or to fix.


<?php
// ---------- routes/api.php ----------

// Rate limit it. An API login has no interface slowing
// anybody down.
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());

    Route::apiResource('posts', PostController::class);
});


# ---------- The client ----------

# Log in.
curl -X POST https://example.com/api/login \\
  -H "Accept: application/json" \\
  -d "email=rajan@example.com&password=secret&device_name=iphone"

# { "token": "3|kZ9x..." }

# Every request afterwards.
curl https://example.com/api/posts \\
  -H "Authorization: Bearer 3|kZ9x..." \\
  -H "Accept: application/json"


# ⚠️ Without Accept: application/json, an unauthenticated
#    request is redirected to a login page that does not
#    exist, and you debug a 302 instead of reading a 401.


<?php
// ---------- In a controller ----------

public function index(Request $request)
{
    // The authenticated user, exactly as in web routes.
    return $request->user()->posts()->paginate(20);
}

// And the token itself, when you need it:
$request->user()->currentAccessToken();`,
      },
      keyTakeaways: [
        "<b>The user model needs the `HasApiTokens` trait</b> before it can issue tokens.",
        "<b>`createToken('name')` creates a token row</b>, and `plainTextToken` gives you the value exactly once.",
        "<b>The database stores a hash, not the token</b>, so a leak of that table hands over nothing.",
        "There is no way to retrieve a lost token; you issue a new one.",
        "<b>The token's name is for humans</b>, and is what a \"your devices\" screen lists for individual revocation.",
        "<b>An API login has no `Auth::attempt()` and no session regeneration</b>, because there is no session.",
        "It still needs one error message for both failures, and rate limiting.",
        "<b>The client sends `Authorization: Bearer …`, and `auth:sanctum` turns it into a user or a 401.</b>",
        "<b>`auth:sanctum` is a guard</b>: the same Day 18 concept, reading a header instead of a session.",
        "<b>Send `Accept: application/json`</b>, or an unauthenticated request is redirected rather than answered with a 401.",
        "<b>A bearer token over plain HTTP is readable by anybody on the network</b>, so the API must be HTTPS only.",
        "<b>The legacy `token` guard used one plain-text `api_token` column</b>: no scopes, no expiry, no revocation.",
      ],
      commonMistakes: [
        "<b>Trying to read a token back later.</b> Only the hash is stored; issue a new one instead.",
        "<b>Using `Auth::attempt()` in an API login.</b> It establishes a session the API will never use.",
        "<b>Omitting `Accept: application/json`.</b> A 401 arrives as a redirect and the debugging goes sideways.",
        "<b>Leaving the API login unthrottled.</b> There is no interface to slow an attacker down.",
        "<b>Serving an API over plain HTTP.</b> The token is in a header anybody on the network can read.",
      ],
      quiz: [
        {
          question: "How many times can you read `plainTextToken`?",
          options: ["Any number of times", "Once, on the object you just created", "Until it expires", "Only in tests"],
          correctIndex: 1,
          explanation: "The database stores a hash, so there is nothing to read back.",
        },
        {
          question: "What does an API login endpoint not need?",
          options: [
            "Validation",
            "Rate limiting",
            "`Auth::attempt()` and a session regeneration",
            "A password check",
          ],
          correctIndex: 2,
          explanation: "There is no session to establish or to protect from fixation.",
        },
        {
          question: "What does `auth:sanctum` do?",
          options: [
            "Creates a token",
            "Reads the bearer token, resolves the user, and returns 401 when it cannot",
            "Checks policies",
            "Adds CSRF protection",
          ],
          correctIndex: 1,
          explanation: "It is a guard, in the Day 18 sense of the word.",
        },
        {
          question: "Why send `Accept: application/json`?",
          options: [
            "It is required by Sanctum",
            "Without it, an unauthenticated request is redirected instead of returning a 401",
            "It speeds up the response",
            "It selects the API version",
          ],
          correctIndex: 1,
          explanation: "Laravel otherwise answers as though you were a browser.",
        },
      ],
    },
    {
      id: "abilities",
      title: "Token abilities & least privilege",
      durationMinutes: 11,
      explanation: "A token says who the request is. <b>Abilities say what that token may do</b>, which is not the same question.\n\n---\n\n### 1. Basic — a token with limits\n\n```php\n$token = $user->createToken('mobile', ['orders:read']);\n```\n\nThe second argument is a list of abilities:\n\n```text\norders:read     ✓\norders:delete   ✗\nusers:admin     ✗\n```\n\nCheck one:\n\n```php\nif ($request->user()->tokenCan('orders:read')) {\n    // ...\n}\n```\n\nor on a route:\n\n```php\nRoute::get('/orders', ...)->middleware(['auth:sanctum', 'abilities:orders:read']);\n```\n\n<b>By default a token has `['*']`</b>, meaning every ability, which is why `tokenCan()` returns true for everything until you start naming them.\n\n---\n\n### 2. Intermediate — what abilities are actually for\n\nThis is where it gets misused, so it is worth being precise.\n\n<b>Abilities limit the credential, not the person.</b> Yesterday's policy answers \"may this user delete this invoice\". An ability answers \"may this <i>token</i> be used to delete invoices at all\".\n\n```text\nauthorization    may this USER do this to this record?     a policy\nabilities        may this TOKEN be used for this at all?   the credential\n```\n\nBoth apply, and neither replaces the other:\n\n```text\nthe token allows orders:delete\n            AND\nthe policy says this user owns that order\n            ↓\n         allowed\n```\n\nA token with `orders:delete` held by somebody who does not own the order is still refused, by the policy. And a user who owns the order, using a read-only token, is also refused, by the ability. <b>Two different questions, both of which have to say yes.</b>\n\nWhich makes the useful case clear: <b>a token you issue for one purpose should only do that thing.</b> A deploy script that reads a status endpoint gets a token that can read a status endpoint. If it leaks, that is what the attacker has.\n\n---\n\n### 3. Advanced — least privilege in practice\n\nThe temptation is to give every token `['*']`, because it always works and nothing ever fails confusingly. And that is exactly the cost: <b>a leaked `['*']` token is the user's entire account.</b>\n\n```text\n['*']                     everything the user can do\n['orders:read']           read orders, nothing else\n```\n\nSo the useful habit is to name abilities when you issue a token for a <i>purpose</i>:\n\n```text\na mobile app the user lives in          broad, or ['*']\na CI job posting deployment status      ['deployments:write']\na third-party integration               exactly what it asked for\na CLI tool that only reads              ['*:read']\n```\n\nAnd the naming convention matters more than it looks. `resource:action` reads well, groups well, and lets you add `orders:write` later without renaming anything.\n\nThree things worth knowing before you rely on this.\n\n<b>`tokenCan()` returns true when there is no token at all.</b> On a Sanctum SPA-authenticated request there is no token to limit, so it passes. If a route must be token-only, check for the token, not just the ability.\n\n<b>The `abilities` middleware requires all listed; `ability` requires any.</b> One of those is what you meant.\n\n<b>And abilities are set at creation and do not change.</b> Granting more means issuing a new token, which is a feature: a credential's scope cannot quietly widen after it was handed out.",
      diagram: `A token with limits

  \$user->createToken('mobile', ['orders:read'])

    orders:read     ✓
    orders:delete   ✗
    users:admin     ✗

  \$request->user()->tokenCan('orders:read')

  ->middleware(['auth:sanctum', 'abilities:orders:read'])

  Default is ['*'] — every ability — which is why
  tokenCan() returns true for everything until you
  start naming them.


What abilities are actually for

  Abilities limit the CREDENTIAL, not the person.

    authorization   may this USER do this to this record?
                    → a policy

    abilities       may this TOKEN be used for this at all?
                    → the credential

  Both apply. Neither replaces the other:

    the token allows orders:delete
                AND
    the policy says this user owns that order
                ↓
             allowed

  A token with orders:delete held by somebody who does
  not own the order → refused by the POLICY.

  The owner, using a read-only token → refused by the
  ABILITY.

  Two questions. Both must say yes.


Least privilege in practice

  The temptation is ['*'] on everything, because it
  always works and never fails confusingly. That is
  exactly the cost:

    a leaked ['*'] token IS the user's whole account

  Name abilities when a token exists for a PURPOSE:

    a mobile app the user lives in     broad, or ['*']
    a CI job posting deploy status     ['deployments:write']
    a third-party integration          exactly what it asked
    a CLI tool that only reads         ['*:read']

  resource:action reads well, groups well, and lets you
  add orders:write later without renaming anything.


Three things before you rely on it

  tokenCan() returns TRUE when there is no token at all.
    On a Sanctum SPA request there is no token to limit,
    so it passes. A token-only route must check for the
    token, not just the ability.

  abilities:  requires ALL listed
  ability:    requires ANY
    One of those is what you meant.

  Abilities are set at creation and do not change.
    Granting more means a new token — which is a feature:
    a credential's scope cannot quietly widen after it
    has been handed out.`,
      codeExample: {
        title: "Abilities, and where they sit next to policies",
        code: `<?php
// ---------- Issuing a scoped token ----------

// Broad: the user's own app.
$user->createToken('iphone')->plainTextToken;              // ['*']

// Narrow: a token that exists for one purpose.
$user->createToken('ci-deploy', ['deployments:write']);
$user->createToken('reporting', ['orders:read', 'invoices:read']);
$user->createToken('readonly-cli', ['*:read']);

// A leaked ['*'] token is the user's entire account.
// A leaked ['orders:read'] token can read orders.


<?php
// ---------- Checking ----------

if ($request->user()->tokenCan('orders:delete')) {
    // ...
}

// ⚠️ Returns TRUE when there is no token at all, such as
//    on a Sanctum SPA-authenticated request.
if ($request->user()->currentAccessToken()
    && ! $request->user()->tokenCan('orders:delete')) {
    abort(403);
}


<?php
// ---------- On routes ----------

// abilities: ALL of them
Route::delete('/orders/{order}', ...)
    ->middleware(['auth:sanctum', 'abilities:orders:delete']);

// ability: ANY of them
Route::get('/reports', ...)
    ->middleware(['auth:sanctum', 'ability:orders:read,invoices:read']);


<?php
// ---------- Abilities and policies are different questions ----------

class OrderController extends Controller
{
    public function destroy(Request $request, Order $order)
    {
        // May this TOKEN be used to delete orders at all?
        if (! $request->user()->tokenCan('orders:delete')) {
            abort(403, 'This token cannot delete orders.');
        }

        // May this USER delete THIS order?
        Gate::authorize('delete', $order);

        $order->delete();

        return response()->noContent();
    }
}

// A token with orders:delete, held by somebody who does
// not own the order → refused by the policy.
//
// The owner, using a read-only token → refused by the
// ability.


<?php
// ---------- Issuing a scoped token for an integration ----------

public function createIntegrationToken(Request $request)
{
    $request->validate([
        'name'        => ['required', 'string', 'max:255'],
        'abilities'   => ['required', 'array'],
        'abilities.*' => ['in:orders:read,orders:write,invoices:read'],
    ]);

    // Only the abilities that were asked for, whitelisted.
    $token = $request->user()->createToken(
        $request->name,
        $request->abilities,
    );

    // Shown once, and never again.
    return response()->json(['token' => $token->plainTextToken], 201);
}

// Abilities are fixed at creation. Granting more means a
// new token, so a credential's scope cannot quietly widen.`,
      },
      keyTakeaways: [
        "<b>`createToken('name', ['orders:read'])` limits what a token may be used for.</b>",
        "<b>A token defaults to `['*']`</b>, so `tokenCan()` passes everything until you name abilities.",
        "<b>Abilities limit the credential; a policy limits the person.</b> They are different questions.",
        "<b>Both have to say yes</b>: the right token used by the wrong user is still refused, and the reverse too.",
        "<b>A leaked `['*']` token is the user's entire account</b>, which is what least privilege avoids.",
        "Scope a token to its purpose: a CI job gets exactly the ability that job needs.",
        "<b>`resource:action` naming groups well</b> and lets you add abilities later without renaming.",
        "<b>`tokenCan()` returns true when there is no token</b>, such as on an SPA-authenticated request.",
        "<b>`abilities:` requires all listed and `ability:` requires any</b>, so pick the one you meant.",
        "<b>Abilities are fixed at creation</b>, so widening a credential's scope means issuing a new token.",
      ],
      commonMistakes: [
        "<b>Using abilities instead of policies.</b> An ability cannot know whether this user owns that record.",
        "<b>Giving every token `['*']`.</b> A leak then hands over the whole account.",
        "<b>Relying on `tokenCan()` alone on a route an SPA can reach.</b> With no token, it returns true.",
        "<b>Mixing up `abilities:` and `ability:`.</b> One requires all of them and one requires any.",
        "<b>Expecting to add an ability to an existing token.</b> Issue a new one; the scope is fixed.",
      ],
      quiz: [
        {
          question: "What do token abilities limit?",
          options: [
            "What the user may do",
            "What that particular token may be used for",
            "Which routes exist",
            "How long the token lasts",
          ],
          correctIndex: 1,
          explanation: "The policy still decides what the user may do to a given record.",
        },
        {
          question: "A token has `orders:delete` but the user does not own the order. What happens?",
          options: [
            "Allowed, because the token permits it",
            "Refused by the policy",
            "Refused by the ability",
            "A 401",
          ],
          correctIndex: 1,
          explanation: "Both questions must say yes, and this one fails the policy.",
        },
        {
          question: "What does a token's default ability list contain?",
          options: ["Nothing", "`['*']`, meaning everything", "`['read']`", "Whatever the guard defines"],
          correctIndex: 1,
          explanation: "Which is why `tokenCan()` passes until you start naming abilities.",
        },
        {
          question: "Why does `tokenCan()` return true on a Sanctum SPA request?",
          options: [
            "SPAs are trusted",
            "There is no token, so there is nothing limiting the request",
            "It is a bug",
            "SPAs always get `['*']`",
          ],
          correctIndex: 1,
          explanation: "A token-only route should check for the token as well as the ability.",
        },
      ],
    },
    {
      id: "revocation-and-expiry",
      title: "Revoking tokens & expiry",
      durationMinutes: 10,
      explanation: "A token is a credential that works until something stops it. This is the something.\n\n---\n\n### 1. Basic — logging out\n\nA web logout destroys a session. There is no session here, so <b>logging out means deleting the token</b>:\n\n```php\n$request->user()->currentAccessToken()->delete();\n```\n\nThat is \"log out this device\". The token the request arrived with stops working; every other token the user has carries on.\n\nAnd the other one:\n\n```php\n$request->user()->tokens()->delete();\n```\n\n<b>\"Log out everywhere.\"</b> Every device, every integration, every CLI tool.\n\n```text\ncurrentAccessToken()->delete()   this device\ntokens()->delete()               everywhere\n```\n\nThe second is the one that matters after a security incident. Somebody's phone is stolen, or a token was pasted into a public repository: one call and every credential the account has is dead.\n\nWhich is also a good reason to give tokens meaningful names. A \"your devices\" screen listing `iphone`, `ipad` and `ci-deploy` lets somebody revoke the one that was lost, rather than logging themselves out of everything.\n\n---\n\n### 2. Intermediate — why revocation is not enough\n\nRevocation is manual. It requires somebody to notice.\n\n```text\ntoken leaks\n     ↓\nnobody notices\n     ↓\nit works forever\n```\n\nThat is the real problem with a long-lived credential: not that it can be stolen, but that a stolen one stays useful indefinitely.\n\n<b>Expiry puts a limit on that without anybody noticing anything:</b>\n\n```text\ntoken\n  ↓\nvalid\n  ↓\nexpiration reached\n  ↓\n401\n```\n\nSanctum can expire tokens globally through configuration, or per token when you create one. A stolen credential then has a lifetime, and the question stops being \"will anybody notice\" and becomes \"how much time does this buy an attacker\".\n\n---\n\n### 3. Advanced — the three together\n\nExpiry, revocation and abilities each limit a different dimension, and a serious API uses all three:\n\n```text\nabilities     what a token can do\nexpiry        how long it can do it\nrevocation    stopping it early\n```\n\nWhich turns into a real design question per token, and the answer differs:\n\n```text\na mobile app the user opens daily\n  long expiry, or none, plus revocation from a devices screen\n  a short one means logging in constantly, and people\n  work around friction\n\na CI token\n  narrow abilities, and an expiry matching the project\n\na third-party integration\n  exactly the abilities asked for, and an expiry the\n  customer can see\n\nanything with elevated access\n  short expiry, narrow abilities, and an audit trail\n```\n\n<b>Security that makes an app unusable gets removed</b>, which is why \"expire everything after an hour\" is not automatically the safer answer.\n\nTwo practical notes.\n\n<b>Expired tokens stay in the table.</b> They stop working, and they accumulate. `sanctum:prune-expired` clears them out, and it belongs in the scheduler alongside your other cleanup.\n\n<b>And revocation should follow the events that imply it.</b> A password change, a role change, or an account being suspended are all moments where existing tokens are suspect. Day 18 made that point about sessions; the same applies here, and it has to be deliberate because nothing does it for you.",
      diagram: `Logging out, when there is no session

  \$request->user()->currentAccessToken()->delete()
      this device

  \$request->user()->tokens()->delete()
      everywhere

  The second is the one that matters after an incident:
  a stolen phone, or a token pasted into a public repo.
  One call, every credential dead.

  Which is why token NAMES matter. A devices screen
  listing iphone, ipad, ci-deploy lets somebody revoke
  the one that was lost, instead of signing out of
  everything.


Why revocation is not enough

  Revocation is manual. It needs somebody to notice.

    token leaks → nobody notices → it works forever

  That is the real problem with a long-lived credential:
  not that it can be stolen, but that a stolen one stays
  useful indefinitely.

  Expiry puts a limit on it with nobody noticing anything:

    token → valid → expiration reached → 401

  The question stops being "will anybody notice" and
  becomes "how much time does this buy an attacker".


Three dimensions, all three used

  abilities     WHAT a token can do
  expiry        HOW LONG it can do it
  revocation    stopping it EARLY

  And the answer differs per token:

    a mobile app the user opens daily
      long expiry or none, plus a devices screen
      a short one means logging in constantly, and
      people work around friction

    a CI token
      narrow abilities, expiry matching the project

    a third-party integration
      exactly the abilities asked for, and an expiry
      the customer can see

    anything with elevated access
      short expiry, narrow abilities, an audit trail

  Security that makes an app unusable gets removed.
  "Expire everything after an hour" is not automatically
  the safer answer.


Two practical notes

  Expired tokens stay in the table.
    They stop working and they accumulate.
    sanctum:prune-expired belongs in the scheduler.

  Revocation should follow the events that imply it.
    A password change, a role change, a suspension —
    all moments where existing tokens are suspect.
    Nothing does it for you.`,
      codeExample: {
        title: "Logout, revocation and expiry",
        code: `<?php
// ---------- Logout ----------

namespace App\\Http\\Controllers\\Api;

class AuthController extends Controller
{
    // This device.
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    // Everywhere. The one that matters after an incident.
    public function logoutEverywhere(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->noContent();
    }
}


<?php
// ---------- A devices screen ----------

public function devices(Request $request)
{
    return $request->user()->tokens()
        ->select('id', 'name', 'abilities', 'last_used_at', 'created_at')
        ->latest()
        ->get();
}

public function revoke(Request $request, int $tokenId)
{
    // Only your own tokens.
    $request->user()->tokens()->where('id', $tokenId)->delete();

    return response()->noContent();
}

// Meaningful names are what make this screen useful:
// iphone, ipad, ci-deploy — revoke the one that was lost
// rather than signing out of everything.


<?php
// ---------- Expiry ----------

// config/sanctum.php — globally, in minutes.
'expiration' => 60 * 24 * 30,   // 30 days

// Or per token, which is usually what you want.
$user->createToken('ci-deploy', ['deployments:write'], now()->addDays(90));

$user->createToken('support-access', ['*'], now()->addHours(2));


# Expired tokens stop working and stay in the table.
php artisan sanctum:prune-expired --hours=24

<?php
// routes/console.php
Schedule::command('sanctum:prune-expired --hours=24')->daily();


<?php
// ---------- Revoking on the events that imply it ----------

class User extends Authenticatable
{
    protected static function booted(): void
    {
        static::updated(function (User $user) {
            // A password change should not leave old
            // credentials working. Nothing does this for you.
            if ($user->wasChanged('password')) {
                $user->tokens()->delete();
            }

            if ($user->wasChanged('is_suspended') && $user->is_suspended) {
                $user->tokens()->delete();
            }
        });
    }
}


<?php
// ---------- The three dimensions ----------

// abilities   what it can do
// expiry      how long
// revocation  stopping it early

$user->createToken(
    'partner-integration',
    ['orders:read'],          // narrow
    now()->addMonths(6),      // limited
);                            // and revocable from the devices screen`,
      },
      keyTakeaways: [
        "<b>An API logout deletes a token</b>, because there is no session to destroy.",
        "<b>`currentAccessToken()->delete()` logs out this device; `tokens()->delete()` logs out everywhere.</b>",
        "The second is what an incident needs: one call and every credential on the account is dead.",
        "<b>Meaningful token names make a devices screen useful</b>, so one lost device can be revoked alone.",
        "<b>Revocation is manual and requires somebody to notice</b>, which a leaked token relies on nobody doing.",
        "<b>Expiry limits a stolen credential's lifetime</b> without anybody noticing anything.",
        "<b>Abilities, expiry and revocation limit three different dimensions</b>, and a serious API uses all three.",
        "<b>The right expiry differs per token</b>: a daily-use app is not a CI job is not elevated access.",
        "<b>Security that makes an app unusable gets removed</b>, so a very short expiry is not automatically safer.",
        "<b>Expired tokens stay in the table</b>, so schedule `sanctum:prune-expired`.",
        "<b>Revoke on the events that imply it</b>: a password change, a role change, a suspension.",
      ],
      commonMistakes: [
        "<b>Deleting all tokens on a normal logout.</b> The user is signed out of every other device too.",
        "<b>Issuing tokens with no expiry and no devices screen.</b> Nothing can ever stop one except a full purge.",
        "<b>Leaving tokens alive after a password change.</b> The credential the attacker took still works.",
        "<b>Setting a very short expiry on a consumer app.</b> Constant logins are friction people route around.",
        "<b>Never pruning.</b> Expired rows accumulate in `personal_access_tokens` indefinitely.",
      ],
      quiz: [
        {
          question: "What does an API logout do?",
          options: [
            "Destroys the session",
            "Deletes the token the request arrived with",
            "Expires all tokens",
            "Clears the cache",
          ],
          correctIndex: 1,
          explanation: "There is no session; the token is the credential.",
        },
        {
          question: "When would you call `$user->tokens()->delete()`?",
          options: [
            "On every logout",
            "After a security incident, or when the user asks to be signed out everywhere",
            "When a token expires",
            "When creating a new token",
          ],
          correctIndex: 1,
          explanation: "On a normal logout it also signs them out of every other device.",
        },
        {
          question: "Why is expiry needed when tokens can be revoked?",
          options: [
            "Revocation is slow",
            "Revocation requires somebody to notice; expiry limits a leaked token even when nobody does",
            "Expired tokens are deleted automatically",
            "It is not needed",
          ],
          correctIndex: 1,
          explanation: "The question becomes how much time a leak buys, rather than whether anybody notices.",
        },
        {
          question: "Which event should usually revoke a user's tokens?",
          options: [
            "Logging in",
            "A password change",
            "Viewing their profile",
            "Creating a post",
          ],
          correctIndex: 1,
          explanation: "Otherwise the credential an attacker took still works after the reset.",
        },
      ],
    },
    {
      id: "restful-crud",
      title: "RESTful CRUD & apiResource",
      durationMinutes: 10,
      explanation: "REST is a convention, and its value is entirely that other people already know it.\n\n---\n\n### 1. Basic — the five routes\n\nOne resource, five things you can do to it:\n\n```http\nGET    /api/posts           list them\nPOST   /api/posts           create one\nGET    /api/posts/{post}    read one\nPATCH  /api/posts/{post}    update one\nDELETE /api/posts/{post}    delete one\n```\n\nWhich map to five controller methods:\n\n```text\nindex   store   show   update   destroy\n```\n\n<b>The URL names the resource; the verb says what to do with it.</b> That is the whole idea, and it is why a client that has used one REST API can guess yours.\n\nThe symptom of ignoring it:\n\n```text\nPOST /api/getPosts\nPOST /api/deletePost\nPOST /api/updatePostTitle\n```\n\nEverything is a POST, the verb is in the URL, and nothing about it is predictable. Caches cannot cache the reads, and nobody can guess the next endpoint.\n\n---\n\n### 2. Intermediate — generating it\n\n```bash\nphp artisan make:controller Api/PostController --api\n```\n\n`--api` gives you exactly those five methods, without `create` and `edit`, which existed to render forms an API does not have.\n\n```php\nRoute::apiResource('posts', PostController::class);\n```\n\nOne line for all five routes, correctly named:\n\n```text\nposts.index   posts.store   posts.show\nposts.update  posts.destroy\n```\n\n<b>The value is not the typing it saves.</b> It is that the routes cannot drift: nobody adds a sixth verb, misspells a path, or protects four of the five.\n\nWhen you need a subset:\n\n```php\nRoute::apiResource('posts', PostController::class)->only(['index', 'show']);\nRoute::apiResource('posts', PostController::class)->except(['destroy']);\n```\n\nAnd nested, when a resource only exists inside another:\n\n```php\nRoute::apiResource('posts.comments', CommentController::class);\n// GET /api/posts/{post}/comments\n```\n\n---\n\n### 3. Advanced — where the convention runs out\n\nCRUD covers most of an API and not all of it. The question that comes up is what to do with an action that is not create, read, update or delete:\n\n```text\npublish a post\nrefund an order\nresend an invoice\n```\n\nTwo answers, and the second is usually better.\n\n<b>Bend the verb:</b> `POST /api/posts/{post}/publish`. Readable, obvious, and no longer strictly REST.\n\n<b>Or model the thing as a resource:</b> a publication is a thing that exists or does not, so `POST /api/posts/{post}/publication` creates one and `DELETE` removes it. Which sounds like pedantry until you need to know <i>when</i> it was published and <i>by whom</i>, and discover the resource had data all along.\n\nThe honest guidance: <b>use the convention where it fits, and do not contort a domain to keep it.</b> An endpoint everybody understands beats a purist one nobody does.\n\nTwo details worth getting right.\n\n<b>`PATCH` and `PUT` are not the same.</b> `PUT` replaces the resource; `PATCH` updates part of it. Most APIs mean `PATCH`, and most send `PUT`. Accept both if you like, but be clear which one you implemented, because a client sending `PUT` with two fields may expect the rest to be cleared.\n\n<b>And a collection endpoint needs pagination from the start.</b> `GET /api/posts` returning every row works until there are fifty thousand. Day 13's `paginate()` belongs there on the first day, not after the first outage.",
      diagram: `The five routes

  GET    /api/posts           list them        index
  POST   /api/posts           create one       store
  GET    /api/posts/{post}    read one         show
  PATCH  /api/posts/{post}    update one       update
  DELETE /api/posts/{post}    delete one       destroy

  The URL names the RESOURCE. The verb says what to do.

  That is the whole idea, and it is why a client that
  has used one REST API can guess yours.


  Ignoring it looks like:

    POST /api/getPosts
    POST /api/deletePost
    POST /api/updatePostTitle

  Everything a POST, the verb in the URL, nothing
  predictable. Caches cannot cache the reads and
  nobody can guess the next endpoint.


Generating it

  php artisan make:controller Api/PostController --api

    exactly those five methods — no create or edit,
    which existed to render forms an API does not have

  Route::apiResource('posts', PostController::class)

    posts.index  posts.store  posts.show
    posts.update  posts.destroy

  The value is not the typing. It is that the routes
  cannot drift: nobody adds a sixth verb, misspells a
  path, or protects four of the five.

  ->only([...])  ->except([...])

  Route::apiResource('posts.comments', ...)
    GET /api/posts/{post}/comments


Where the convention runs out

  publish a post · refund an order · resend an invoice

  Bend the verb:
    POST /api/posts/{post}/publish
    readable, obvious, not strictly REST

  Or model it as a resource:
    POST   /api/posts/{post}/publication
    DELETE /api/posts/{post}/publication

  Which sounds like pedantry until you need to know WHEN
  it was published and BY WHOM, and discover the resource
  had data all along.

  Use the convention where it fits. Do not contort a
  domain to keep it. An endpoint everybody understands
  beats a purist one nobody does.


Two details

  PATCH ≠ PUT
    PUT replaces the resource. PATCH updates part of it.
    Most APIs mean PATCH and most clients send PUT.
    Be clear which you implemented: a client sending PUT
    with two fields may expect the rest to be cleared.

  A collection endpoint needs pagination FROM THE START.
    GET /api/posts returning every row works until there
    are fifty thousand. paginate() belongs there on day
    one, not after the first outage.`,
      codeExample: {
        title: "A resource controller, wired in one line",
        code: `# php artisan make:controller Api/PostController --api --model=Post

<?php

namespace App\\Http\\Controllers\\Api;

use App\\Models\\Post;
use Illuminate\\Http\\Request;

class PostController extends Controller
{
    // GET /api/posts
    public function index(Request $request)
    {
        // Pagination from the first day, not after the
        // first outage.
        return PostResource::collection(
            Post::latest()->paginate(20)
        );
    }

    // POST /api/posts
    public function store(Request $request)
    {
        $post = $request->user()->posts()->create(
            $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'body'  => ['required', 'string'],
            ])
        );

        return new PostResource($post);
    }

    // GET /api/posts/{post}
    public function show(Post $post)
    {
        return new PostResource($post);
    }

    // PATCH /api/posts/{post}
    public function update(Request $request, Post $post)
    {
        $post->update($request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'body'  => ['sometimes', 'string'],
        ]));

        return new PostResource($post);
    }

    // DELETE /api/posts/{post}
    public function destroy(Post $post)
    {
        $post->delete();

        return response()->noContent();
    }
}

// No create() or edit(): those rendered forms.
// 'sometimes' in update() is what makes it a PATCH:
// a field that is absent is left alone, not cleared.


<?php
// ---------- routes/api.php ----------

Route::middleware('auth:sanctum')->group(function () {
    // Five routes, correctly named, that cannot drift.
    Route::apiResource('posts', PostController::class);

    // Subsets.
    Route::apiResource('users', UserController::class)->only(['index', 'show']);
    Route::apiResource('orders', OrderController::class)->except(['destroy']);

    // Nested, when the child only exists inside the parent.
    Route::apiResource('posts.comments', CommentController::class);
    // GET /api/posts/{post}/comments
});


<?php
// ---------- Actions that are not CRUD ----------

// Bending the verb: readable, and no longer strictly REST.
Route::post('/posts/{post}/publish', [PostController::class, 'publish']);

// Modelling it as a resource: sounds like pedantry until
// you need to know when it was published and by whom.
Route::post('/posts/{post}/publication', [PublicationController::class, 'store']);
Route::delete('/posts/{post}/publication', [PublicationController::class, 'destroy']);


# ---------- What ignoring the convention looks like ----------

# POST /api/getPosts
# POST /api/deletePost
# POST /api/updatePostTitle
#
# Everything a POST, the verb in the URL, nothing
# predictable, and no read a cache can cache.`,
      },
      keyTakeaways: [
        "<b>REST puts the resource in the URL and the action in the verb</b>, which is why clients can guess your API.",
        "The five routes map to `index`, `store`, `show`, `update` and `destroy`.",
        "<b>`--api` generates a controller without `create` and `edit`</b>, which existed to render forms.",
        "<b>`Route::apiResource()` registers all five, correctly named</b>, so the routes cannot drift apart.",
        "`only()` and `except()` take a subset, and dotted names nest a child resource inside its parent.",
        "<b>Not every action is CRUD</b>, and the two answers are bending the verb or modelling the action as a resource.",
        "<b>Modelling it as a resource often turns out to have data</b>, such as when and by whom.",
        "<b>Use the convention where it fits and do not contort the domain to keep it.</b>",
        "<b>`PUT` replaces and `PATCH` updates part</b>, so be clear which one you implemented.",
        "<b>A collection endpoint needs pagination from the first day</b>, not after the first outage.",
      ],
      commonMistakes: [
        "<b>Putting the verb in the URL.</b> `POST /getPosts` is unpredictable and uncacheable.",
        "<b>Writing the five routes by hand.</b> One eventually differs in name, path or middleware.",
        "<b>Returning every row from an index endpoint.</b> It works until the table grows.",
        "<b>Treating `PUT` and `PATCH` as the same.</b> A client sending `PUT` may expect absent fields to be cleared.",
        "<b>Forcing every action into CRUD.</b> An endpoint nobody understands is worse than an unRESTful one.",
      ],
      quiz: [
        {
          question: "What does `--api` change about a generated controller?",
          options: [
            "It adds authentication",
            "It omits `create` and `edit`, which existed to render forms",
            "It returns JSON automatically",
            "It adds validation",
          ],
          correctIndex: 1,
          explanation: "An API has no forms to render.",
        },
        {
          question: "What is the main value of `Route::apiResource()`?",
          options: [
            "Fewer characters",
            "All five routes are registered consistently, so they cannot drift in name, path or middleware",
            "It generates the controller",
            "It adds pagination",
          ],
          correctIndex: 1,
          explanation: "Hand-written routes eventually differ in one of those.",
        },
        {
          question: "What is the difference between `PUT` and `PATCH`?",
          options: [
            "None",
            "`PUT` replaces the resource; `PATCH` updates part of it",
            "`PATCH` is for collections",
            "`PUT` is deprecated",
          ],
          correctIndex: 1,
          explanation: "Most APIs mean `PATCH`, and most clients send `PUT`.",
        },
        {
          question: "How should a \"publish this post\" action be exposed?",
          options: [
            "`POST /api/publishPost`",
            "As a sub-resource or a bent verb, such as `POST /posts/{post}/publication`",
            "`GET /api/posts/{post}/publish`",
            "It cannot be exposed in REST",
          ],
          correctIndex: 1,
          explanation: "Modelling it as a resource often reveals it had data all along.",
        },
      ],
    },
    {
      id: "resources-and-consistency",
      title: "API Resources & a consistent shape",
      durationMinutes: 11,
      explanation: "Day 16 introduced resources. This is why they matter more for an API than anywhere else.\n\n---\n\n### 1. Basic — the boundary\n\n```php\nreturn $post;\n```\n\nworks, and it publishes your table. Every column, including the ones you did not think about:\n\n```text\nyour table          your API, accidentally\n──────────          ──────────────────────\nid                  id\ntitle               title\nbody                body\nuser_id             user_id\ninternal_status     internal_status\nadmin_notes         admin_notes\n```\n\nA resource is the boundary between the two:\n\n```text\ndatabase model\n      ↓\nAPI Resource\n      ↓\npublic JSON\n```\n\n```bash\nphp artisan make:resource PostResource\n```\n\n```php\nreturn new PostResource($post);\n\nreturn PostResource::collection($posts);\n```\n\n<b>The resource is your API contract, in a file somebody can read.</b> Which is the difference between \"what does this endpoint return\" being answerable and being a question you answer by running it.\n\n---\n\n### 2. Intermediate — why it matters more here\n\nOn a web page, returning too much data is invisible: the Blade template only renders what it renders. <b>On an API, everything you return is published</b>, and clients start depending on it.\n\nThree consequences follow:\n\n```text\nyou add a column         it appears in the API\nyou rename a column      every client breaks\nyou add a sensitive      it leaks until somebody\n  column                   remembers $hidden\n```\n\nAnd the last one is the ugly case: a migration adding `internal_notes` publishes it to every client, silently, on deploy. Nothing fails, nothing warns you, and the data is out.\n\n<b>With a resource, a new column changes nothing until you decide it should.</b> That is the entire argument, and it is why `$hidden` is a safety net rather than a solution: `$hidden` fails open, and a resource fails closed.\n\nThe two conditionals from Day 16 matter here too:\n\n```php\n'email' => $this->when($request->user()->isAdmin(), $this->email),\n'comments' => CommentResource::collection($this->whenLoaded('comments')),\n```\n\n<b>`whenLoaded()` is what keeps an N+1 out of your API</b>, where it would run once per model, on every response, invisibly.\n\n---\n\n### 3. Advanced — consistency\n\nA resource wraps its output:\n\n```json\n{ \"data\": { \"id\": 123, \"title\": \"Laravel\" } }\n```\n\nand a collection:\n\n```json\n{ \"data\": [ { \"id\": 123 }, { \"id\": 124 } ] }\n```\n\n<b>The envelope is a design choice; consistency is not.</b> A client should not have to remember that one endpoint returns `{data: …}`, another a bare object, and a third `{result: …}`. Every deviation is a special case in somebody's code.\n\nPick a shape and hold it, including for the cases people forget:\n\n```text\na single resource     { \"data\": {...} }\na collection          { \"data\": [...] }\na paginated list      { \"data\": [...], \"links\": {...}, \"meta\": {...} }\nan error              { \"message\": \"...\" }\na validation error    { \"message\": \"...\", \"errors\": {...} }\nno content            204, an empty body\n```\n\nLaravel gives you most of that for free: a paginated collection through a resource produces `links` and `meta` without you writing them, and validation failures already have that shape.\n\nTwo things worth deciding once, for the whole API.\n\n<b>Dates.</b> ISO 8601 in UTC, everywhere. A custom format means every client writes a parser, and one gets the timezone wrong.\n\n<b>And ids.</b> Whether they are integers or strings, be the same everywhere. An API that returns `123` in one place and `\"123\"` in another produces a real bug in a typed client.\n\nThe underlying idea, one more time: <b>the model is your database representation and the resource is your API representation.</b> They change for different reasons, at different times, and keeping them apart is what lets your schema evolve without breaking anybody.\n\nTwo notes on pagination. <b>A bare paginator returns its own shape</b>, which is what you get without a resource:\n\n```text\ndata · current_page · last_page · per_page · total\nnext_page_url · prev_page_url · from · to\n```\n\nA resource collection reorganises that into `data`, `links` and `meta`. <b>Either is fine, and mixing them across endpoints is not.</b>\n\nAnd let the client choose the page size, within a limit:\n\n```php\n$perPage = min($request->integer('per_page', 15), 100);\n\nreturn InvoiceResource::collection($query->paginate($perPage));\n```\n\n<b>The `min()` is the part that matters.</b> Without a ceiling, `?per_page=100000` is a denial-of-service request your own API happily serves.",
      diagram: `The boundary

  return \$post;   works, and publishes your table

  your table          your API, accidentally
  ──────────          ──────────────────────
  id                  id
  title               title
  body                body
  user_id             user_id
  internal_status     internal_status
  admin_notes         admin_notes

  A resource sits between:

    database model → API Resource → public JSON

  The resource is your API CONTRACT, in a file somebody
  can read. Which is the difference between "what does
  this endpoint return" being answerable and being a
  question you answer by running it.


Why it matters more on an API

  On a web page, extra data is invisible: the template
  renders what it renders.

  On an API, everything you return is PUBLISHED, and
  clients start depending on it.

    you add a column       → it appears in the API
    you rename a column    → every client breaks
    you add a sensitive    → it leaks until somebody
      column                 remembers \$hidden

  A migration adding internal_notes publishes it to
  every client, silently, on deploy. Nothing fails and
  nothing warns you.

  With a resource, a new column changes nothing until
  you decide it should.

    \$hidden    fails OPEN
    a resource fails CLOSED

  And whenLoaded() is what keeps an N+1 out of your API,
  where it would run once per model, on every response,
  invisibly.


Consistency

  { "data": { ... } }        a single resource
  { "data": [ ... ] }        a collection

  The envelope is a design choice. Consistency is not.
  A client should not have to remember that one endpoint
  returns {data: …}, another a bare object, and a third
  {result: …}.

  Pick a shape and hold it, including the forgotten cases:

    single            { "data": {...} }
    collection        { "data": [...] }
    paginated         { "data": [...], "links": {...},
                        "meta": {...} }
    error             { "message": "..." }
    validation error  { "message": "...", "errors": {...} }
    no content        204, empty body

  Laravel gives most of that free: a paginated collection
  produces links and meta, and validation failures already
  have that shape.


Decide once, for the whole API

  Dates    ISO 8601 in UTC, everywhere. A custom format
           means every client writes a parser, and one
           gets the timezone wrong.

  Ids      integers or strings, but the SAME everywhere.
           123 in one place and "123" in another is a
           real bug in a typed client.


  The model is your DATABASE representation.
  The resource is your API representation.
  They change for different reasons.`,
      codeExample: {
        title: "A resource as the contract",
        code: `<?php
// php artisan make:resource PostResource

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'title'      => $this->title,
            'body'       => $this->body,

            // ISO 8601, in UTC, everywhere in the API.
            'created_at' => $this->created_at,

            // Only for admins. A false condition omits the key.
            'internal_status' => $this->when(
                $request->user()?->isAdmin(),
                $this->internal_status,
            ),

            // Only if the controller eager loaded it. Without
            // this, the resource runs a query per model on
            // every response.
            'author' => new UserResource($this->whenLoaded('user')),

            'comment_count' => $this->whenCounted('comments'),
        ];
    }
}

// internal_notes, admin_notes and anything else added by
// a future migration are not here, and will not appear
// until somebody decides they should.


<?php
// ---------- Using it ----------

class PostController extends Controller
{
    public function index()
    {
        // Ask for exactly what the resource may include.
        $posts = Post::with('user')
            ->withCount('comments')
            ->latest()
            ->paginate(20);

        // links and meta come for free.
        return PostResource::collection($posts);
    }

    public function show(Post $post)
    {
        $post->load('user')->loadCount('comments');

        return new PostResource($post);
    }
}

// {
//   "data": [ { "id": 123, "title": "Laravel", ... } ],
//   "links": { "first": "...", "next": "..." },
//   "meta":  { "current_page": 1, "total": 240 }
// }


<?php
// ---------- What returning the model does ----------

// ❌ Publishes every column, including ones added later.
public function show(Post $post)
{
    return $post;
}

// A migration adding internal_notes ships it to every
// client, silently, on deploy.
//
// $hidden fails open: a new column is exposed until
//   somebody remembers to list it.
// A resource fails closed: a new column is invisible
//   until somebody adds it.


<?php
// ---------- One shape, everywhere ----------

// single            { "data": {...} }
return new PostResource($post);

// collection        { "data": [...] }
return PostResource::collection($posts);

// no content        204, empty body
return response()->noContent();

// error             { "message": "..." }
return response()->json(['message' => 'Post not found.'], 404);

// validation error  { "message": "...", "errors": {...} }
// Laravel already produces this shape.

// A client should not have to remember which endpoint
// deviates. Every deviation is a special case in
// somebody else's code.`,
      },
      keyTakeaways: [
        "<b>Returning a model publishes your table</b>, including columns added by future migrations.",
        "<b>An API Resource is the boundary between your schema and your API contract.</b>",
        "<b>On a web page extra data is invisible; on an API it is published</b> and clients depend on it.",
        "<b>A migration adding a column ships it to every client silently</b>, unless a resource stands in the way.",
        "<b>`$hidden` fails open and a resource fails closed</b>, which is why the resource is the solution.",
        "`when()` includes a key conditionally, and a false condition omits it entirely.",
        "<b>`whenLoaded()` keeps an N+1 out of your API</b>, where it would run once per model on every response.",
        "<b>The envelope is a design choice; consistency is not.</b>",
        "<b>Hold one shape for single resources, collections, pagination, errors and no content.</b>",
        "<b>Decide dates and id types once for the whole API</b>: ISO 8601 in UTC, and one type everywhere.",
      ],
      commonMistakes: [
        "<b>Returning Eloquent models from a public API.</b> The next migration is an unannounced API change.",
        "<b>Relying on `$hidden` instead of a resource.</b> A new sensitive column is exposed until somebody notices.",
        "<b>Serialising a relationship without `whenLoaded()`.</b> One query per model, per response, invisibly.",
        "<b>Varying the envelope between endpoints.</b> Every deviation becomes a special case in a client.",
        "<b>Returning ids as an integer in one place and a string in another.</b> Typed clients break on it.",
      ],
      quiz: [
        {
          question: "What is the risk of `return $post;` from an API endpoint?",
          options: [
            "It is slower",
            "Every column is published, including ones added by future migrations",
            "It cannot be paginated",
            "It breaks route model binding",
          ],
          correctIndex: 1,
          explanation: "A resource fails closed where `$hidden` fails open.",
        },
        {
          question: "What does `whenLoaded()` prevent?",
          options: [
            "Exposing a hidden column",
            "An N+1 caused by the resource serialising a relationship nobody eager loaded",
            "A 404",
            "Duplicate keys",
          ],
          correctIndex: 1,
          explanation: "It would run once per model, on every response.",
        },
        {
          question: "What comes for free from returning a paginated query through a resource collection?",
          options: [
            "Authentication",
            "`links` and `meta` describing the pagination",
            "Eager loading",
            "Caching",
          ],
          correctIndex: 1,
          explanation: "Day 13's pagination arriving in the response shape.",
        },
        {
          question: "Why does the response envelope need to be consistent?",
          options: [
            "It is required by REST",
            "Every deviation becomes a special case in every client's code",
            "It makes responses smaller",
            "Laravel enforces it",
          ],
          correctIndex: 1,
          explanation: "The specific shape is a choice; varying it is not.",
        },
      ],
    },
    {
      id: "status-codes",
      title: "Status codes — saying what happened",
      durationMinutes: 13,
      explanation: "An API's status code is not decoration. It is the part of the response a client acts on before reading a single byte of the body.\n\n---\n\n### 1. Basic — success\n\n```text\n200 OK          here is the thing        GET, PATCH\n201 Created     it now exists            POST\n204 No Content  done, nothing to say     DELETE\n```\n\nAll three mean success, and they mean different things:\n\n<b>`201` should carry the created resource</b>, so the client does not need a second request to learn its id.\n\n<b>`204` has an empty body</b>, genuinely empty. A `204` with `{\"message\": \"Deleted\"}` in it is a contradiction, and some clients will not read it.\n\n---\n\n### 2. Intermediate — the four failures\n\n```text\n401 Unauthorized   who are you?\n403 Forbidden      I know who you are, and no\n404 Not Found      there is no such thing\n422 Unprocessable  I understood you, and the data is wrong\n```\n\n<b>401 versus 403 is the one people get wrong.</b>\n\n```text\nno token, or a bad one          →  401\na valid token, wrong user       →  403\n```\n\nA user editing somebody else's post is authenticated perfectly well. Returning 401 tells their client to log in again, which it does, successfully, and then fails identically. <b>401 means try again with credentials; 403 means credentials will not help.</b>\n\n<b>404 versus 422</b> is the other pair:\n\n```text\nGET /api/posts/999999      the post does not exist    404\nPOST /api/posts {title:\"\"} the post is invalid        422\n```\n\nRoute model binding gives you the 404 without writing anything, and a failed `validate()` gives you the 422 with a structured body:\n\n```json\n{\n  \"message\": \"The title field is required.\",\n  \"errors\": { \"title\": [\"The title field is required.\"] }\n}\n```\n\n<b>That `errors` object is the useful part</b>, because a frontend can put each message next to its field rather than showing one sentence at the top.\n\nAnd from Day 19, the one nuance: <b>a 403 confirms the resource exists.</b> On sequential ids, a 403 on `/api/invoices/91` tells a stranger invoice 91 belongs to somebody. `Response::denyAsNotFound()` returns 404 instead, when that matters.\n\n---\n\n### 3. Advanced — the pipeline\n\nEvery status code corresponds to a layer, and they run in order:\n\n```text\nPOST /api/v1/posts\n        ↓\nauth:sanctum        authenticated?   no → 401\n        ↓\nvalidation          valid?           no → 422\n        ↓\npolicy              allowed?         no → 403\n        ↓\ncontroller\n        ↓\nEloquent\n        ↓\nPostResource\n        ↓\n201 + JSON\n```\n\n<b>Read that top to bottom and the whole day is in it.</b> Each layer is a separate day of this track, and each one has exactly one status code it produces.\n\nWhich also settles the order questions people argue about. Authentication first, because everything else needs to know who is asking. Then, for a route-level policy, authorization before validation: there is no point telling somebody their input is malformed when they were never allowed to send it. Inside a controller, validation usually runs first simply because the check needs the data.\n\nTwo more worth knowing:\n\n<b>429 Too Many Requests</b>, from Day 20, with `Retry-After`.\n\n<b>500</b> for anything you did not anticipate, and the rule that goes with it: <b>a 500 body must not contain a stack trace.</b> `APP_DEBUG=false` in production, as Day 11 said, and an API leaks internals faster than a web page because the client stores whatever it receives.\n\nAnd the summary worth memorising, because it is what a client's error handling switches on:\n\n```text\n2xx  it worked\n4xx  you did something wrong        do not retry unchanged\n5xx  we did something wrong         retrying may work\n```\n\nOne related piece of wiring, because `Accept: application/json` only helps when you control the client. An unauthenticated API request otherwise redirects to a login route that does not exist:\n\n```php\n// bootstrap/app.php\n->withExceptions(function (Exceptions $exceptions) {\n    $exceptions->render(function (AuthenticationException $e, Request $request) {\n        if ($request->is('api/*')) {\n            return response()->json(['message' => 'Unauthenticated.'], 401);\n        }\n    });\n})\n```\n\n<b>Now the API returns 401 regardless of what headers the caller sent</b>, which is the difference between a documented contract and one that depends on the client behaving.",
      diagram: `Success

  200 OK          here is the thing      GET, PATCH
  201 Created     it now exists          POST
  204 No Content  done, nothing to say   DELETE

  201 should CARRY the created resource, so the client
  does not need a second request for its id.

  204 has a genuinely empty body. A 204 containing
  {"message": "Deleted"} is a contradiction, and some
  clients will not read it.


The four failures

  401 Unauthorized   who are you?
  403 Forbidden      I know who you are, and no
  404 Not Found      there is no such thing
  422 Unprocessable  I understood you, the data is wrong


  401 vs 403 — the one people get wrong

    no token, or a bad one       →  401
    a valid token, wrong user    →  403

  A user editing somebody else's post is authenticated
  perfectly well. A 401 tells their client to log in
  again — which it does, successfully, and then fails
  identically.

    401  try again with credentials
    403  credentials will not help


  404 vs 422

    GET /posts/999999        does not exist   404
    POST /posts {title:""}   invalid          422

  Route model binding gives the 404 for free.
  A failed validate() gives the 422, with:

    { "message": "...",
      "errors": { "title": ["..."] } }

  The errors object is the useful part: a frontend can
  put each message next to its field.


  And from Day 19: a 403 CONFIRMS the resource exists.
  On sequential ids, a 403 on /api/invoices/91 tells a
  stranger invoice 91 belongs to somebody.
  denyAsNotFound() returns 404 instead.


The pipeline

  POST /api/v1/posts
          ↓
  auth:sanctum      authenticated?   no → 401
          ↓
  validation        valid?           no → 422
          ↓
  policy            allowed?         no → 403
          ↓
  controller
          ↓
  Eloquent
          ↓
  PostResource
          ↓
  201 + JSON

  Each layer is a separate day of this track, and each
  produces exactly one status code.

  Authentication first: everything else needs to know
  who is asking. A route-level policy before validation:
  no point critiquing input they were never allowed to
  send. Inside a controller, validation first, because
  the check needs the data.


  429  too many requests, with Retry-After   (Day 20)
  500  anything you did not anticipate

  ⚠️  A 500 body must not contain a stack trace.
      APP_DEBUG=false in production. An API leaks
      internals faster than a web page, because the
      client stores whatever it receives.


  2xx  it worked
  4xx  you did something wrong    do not retry unchanged
  5xx  we did something wrong     retrying may work`,
      codeExample: {
        title: "Every status this API can return",
        code: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Models\\Post;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Gate;

class PostController extends Controller
{
    // 200 — here is the thing
    public function index()
    {
        return PostResource::collection(Post::paginate(20));
    }

    // 404 — route model binding, with nothing written
    public function show(Post $post)
    {
        Gate::authorize('view', $post);          // 403 if not

        return new PostResource($post);          // 200
    }

    // 201 — created, carrying the resource
    public function store(Request $request)
    {
        $data = $request->validate([             // 422 if invalid
            'title' => ['required', 'string', 'max:255'],
            'body'  => ['required', 'string'],
        ]);

        $post = $request->user()->posts()->create($data);

        // 201, with the resource, so no second request is needed.
        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    // 200 — updated
    public function update(Request $request, Post $post)
    {
        Gate::authorize('update', $post);        // 403

        $post->update($request->validate([       // 422
            'title' => ['sometimes', 'string', 'max:255'],
        ]));

        return new PostResource($post);          // 200
    }

    // 204 — done, nothing to say
    public function destroy(Post $post)
    {
        Gate::authorize('delete', $post);        // 403

        $post->delete();

        // Genuinely empty. A 204 with a body is a contradiction.
        return response()->noContent();
    }
}


<?php
// ---------- 401 vs 403 ----------

// No token, or an invalid one → auth:sanctum returns 401.
//   "who are you?"

// A valid token, wrong user → the policy returns 403.
//   "I know who you are, and no."

// ❌ Returning 401 here tells the client to log in again.
//    It does, successfully, and fails identically.


<?php
// ---------- 422, and why the shape matters ----------

// {
//   "message": "The title field is required.",
//   "errors": {
//     "title": ["The title field is required."],
//     "body":  ["The body field is required."]
//   }
// }
//
// The errors object lets a frontend put each message next
// to its field, instead of one sentence at the top.


<?php
// ---------- Not confirming that something exists ----------

// A 403 on /api/invoices/91 tells a stranger that invoice
// 91 belongs to somebody. On sequential ids that is a leak.

public function view(User $user, Invoice $invoice): Response
{
    return $invoice->user_id === $user->id
        ? Response::allow()
        : Response::denyAsNotFound();      // 404, not 403
}


<?php
// ---------- What a client switches on ----------

// 2xx  it worked
// 4xx  you did something wrong   → do not retry unchanged
// 5xx  we did something wrong    → retrying may work
//
// Which is exactly the retry rule from Day 21.

// And in production:
//   APP_DEBUG=false
// A 500 body must never contain a stack trace. An API
// leaks internals faster than a web page, because the
// client stores whatever it receives.`,
      },
      keyTakeaways: [
        "<b>`200` returns the thing, `201` means created, `204` means done with an empty body.</b>",
        "<b>A `201` should carry the created resource</b>, so the client does not need a second request.",
        "<b>A `204` body is genuinely empty</b>, and putting a message in one is a contradiction.",
        "<b>`401` means \"who are you\" and `403` means \"credentials will not help\".</b>",
        "Returning 401 for a wrong user makes the client log in again, succeed, and fail identically.",
        "<b>`404` means the resource does not exist; `422` means the data is wrong.</b>",
        "<b>Route model binding produces the 404</b>, and a failed `validate()` produces a structured 422.",
        "<b>The `errors` object lets a frontend put each message beside its field.</b>",
        "<b>A 403 confirms the resource exists</b>, so use `denyAsNotFound()` when that itself is a leak.",
        "<b>Each layer produces one status</b>: guard 401, validation 422, policy 403, controller 200 or 201.",
        "<b>4xx means do not retry unchanged; 5xx means retrying may work</b>, which is what a client switches on.",
        "<b>A 500 body must never contain a stack trace</b>, so `APP_DEBUG=false` in production.",
      ],
      commonMistakes: [
        "<b>Returning 401 when a user may not touch a record.</b> They are authenticated; that is a 403.",
        "<b>Returning 200 with an error message in the body.</b> Clients switch on the status, not the text.",
        "<b>Putting a body in a 204.</b> Some clients will not read it, and the status says there is none.",
        "<b>Returning 201 without the created resource.</b> The client needs a second request just for the id.",
        "<b>Leaving `APP_DEBUG=true` in production.</b> A 500 then hands the client a stack trace it will store.",
      ],
      quiz: [
        {
          question: "A valid token, but the user does not own the record. What status?",
          options: ["401", "403", "404", "422"],
          correctIndex: 1,
          explanation: "They are authenticated; logging in again would change nothing.",
        },
        {
          question: "What is the difference between 404 and 422?",
          options: [
            "None",
            "404 means the resource does not exist; 422 means the data sent is invalid",
            "422 is for authentication",
            "404 is for collections",
          ],
          correctIndex: 1,
          explanation: "Route model binding gives the first; validation gives the second.",
        },
        {
          question: "What should a `201 Created` response contain?",
          options: [
            "An empty body",
            "The created resource, so the client does not need a second request",
            "A redirect",
            "The list of all resources",
          ],
          correctIndex: 1,
          explanation: "A 204 is the one with an empty body.",
        },
        {
          question: "Why does a 403 sometimes leak information?",
          options: [
            "It includes the policy name",
            "It confirms the resource exists, which on sequential ids tells a stranger it belongs to somebody",
            "It logs the request",
            "It does not",
          ],
          correctIndex: 1,
          explanation: "`denyAsNotFound()` returns 404 instead when that matters.",
        },
      ],
    },
    {
      id: "versioning-cors-and-passport",
      title: "Versioning, CORS, throttling & choosing Passport",
      durationMinutes: 13,
      explanation: "The things that only matter once somebody else depends on your API.\n\n---\n\n### 1. Basic — versioning\n\nAn API with clients you do not control cannot change shape freely. Renaming a field breaks an app in an app store that somebody installed six months ago.\n\n```text\n/api/v1/posts    { \"title\": \"Laravel\" }\n/api/v2/posts    { \"title\": \"Laravel\", \"author\": { \"id\": 123 } }\n```\n\nThree ways to say which version:\n\n```text\nURL           /api/v1/posts\n              obvious, visible in logs, easy to route\n\nheader        Accept: application/vnd.myapp.v2+json\n              keeps the URL stable, invisible in a browser\n\nquery         /api/posts?version=2\n              simple, and easy to forget\n```\n\n<b>URL versioning is the pragmatic default</b>: a client can see it, you can route it, and a support conversation can say \"which version are you calling\" and get an answer.\n\nAnd the point worth understanding: <b>a version is a promise you keep, not a folder you make.</b> `v1` only means something if `v1` keeps working. Two versions means two sets of resources and two sets of tests, and the reason to think before adding one.\n\nAdditive changes need no version. <b>Adding a field is safe; removing or renaming one is not.</b>\n\n---\n\n### 2. Intermediate — CORS and throttling\n\n<b>CORS</b> is the browser refusing a cross-origin request unless the server says it is allowed:\n\n```text\nhttps://app.example.com   your frontend\nhttps://api.example.com   your API\n```\n\nDifferent origins, so the browser asks first and your API answers with which origins, methods and headers it permits.\n\nTwo things to be clear about.\n\n<b>CORS is a browser mechanism, not a security control.</b> `curl` ignores it entirely, and so does every mobile app. It stops one <i>website</i> reading another's responses in a user's browser; it protects nothing else. Authentication and authorization are still the security.\n\n<b>And do not allow everything.</b> `*` for origins is fine for a genuinely public read-only API and wrong for one using cookies, where it undoes the protection the browser was giving you. List the origins you actually have.\n\n<b>Throttling</b> is Day 20, applied per endpoint class:\n\n```text\npublic API           60/min\nauthenticated API   300/min\nlogin                 5/min per IP\nexpensive report      3/min\n```\n\nOne limit for everything is either too tight for the cheap endpoints or too loose for the expensive ones.\n\n---\n\n### 3. Advanced — Sanctum or Passport, and documentation\n\n```text\nSanctum                    Passport\n───────                    ────────\nAPI tokens                 a full OAuth2 server\nSPA cookie auth            authorization grants\nmobile apps                refresh tokens\nfirst-party clients        third-party client registration\n                           delegated authorization\n```\n\nThe question that decides it is not how professional something sounds. It is: <b>does somebody need to authorize your application to act on their behalf in a third party's system, or the reverse?</b>\n\n```text\nyour own mobile app                          Sanctum\nyour own SPA                                 Sanctum\na customer's server calling your API         Sanctum\n\n\"Log in with YourApp\" on somebody else's     Passport\nthird parties registering their own clients  Passport\nthe full grant and refresh flow              Passport\n```\n\n<b>Passport is an OAuth2 authorization server.</b> If you are not building one, it is a great deal of machinery for a token in a header, and Sanctum already does that.\n\n---\n\n### Documentation\n\nAn API that nobody can use is not finished. What a consumer needs:\n\n```text\nendpoints\nauthentication\nrequest body\nresponse body\nstatus codes\nerrors\npagination\nrate limits\nversioning\n```\n\nAt minimum, per endpoint:\n\n```text\nPOST /api/v1/posts\n\nAuthorization: Bearer <token>\n\nBody:      { \"title\": \"Laravel\", \"body\": \"...\" }\nResponses: 201 · 401 · 403 · 422 · 429\n```\n\nFor anything larger, <b>OpenAPI</b>, because a specification is machine-readable: it generates the documentation page, client libraries and a test collection from one file, and it can be checked against the real API so the documentation cannot quietly go stale.\n\nAnd the separation the whole day comes down to:\n\n```text\nwho are you?               Sanctum\nwhat can you do?           policies and abilities\nis this input valid?       the validator\nwhat should they receive?  the API Resource\nwhat happened?             the status code\n```\n\n<b>Five questions, five mechanisms, each answered in one place.</b> That is what makes an API a system rather than a pile of CRUD routes.\n\nOne CORS key worth knowing because its absence is confusing: <b>`exposed_headers`</b>. A browser lets JavaScript read only a handful of response headers by default, so a custom `X-Total-Count` or `X-RateLimit-Remaining` is sent, arrives, and is invisible to the client. Listing it in `exposed_headers` is what makes it readable.",
      diagram: `Versioning

  An API with clients you do not control cannot change
  shape freely. Renaming a field breaks an app somebody
  installed six months ago.

    /api/v1/posts   { "title": "Laravel" }
    /api/v2/posts   { "title": "...", "author": {...} }

  URL      /api/v1/posts
           obvious, visible in logs, easy to route
  header   Accept: application/vnd.myapp.v2+json
           stable URL, invisible in a browser
  query    /api/posts?version=2
           simple, easy to forget

  URL versioning is the pragmatic default: the client
  can see it, you can route it, and support can ask
  "which version" and get an answer.

  ⚠️  A version is a PROMISE YOU KEEP, not a folder you
      make. v1 only means something if v1 keeps working.
      Two versions is two sets of resources and two sets
      of tests.

  Adding a field is safe. Removing or renaming one is not.


CORS

    https://app.example.com   your frontend
    https://api.example.com   your API

  Different origins, so the browser asks first and your
  API answers with which origins, methods and headers
  it permits.

  ⚠️  CORS is a BROWSER mechanism, not a security control.
      curl ignores it. So does every mobile app. It stops
      one website reading another's responses in a user's
      browser, and protects nothing else.

      Authentication and authorization are the security.

  And do not allow *. Fine for a public read-only API.
  Wrong for one using cookies, where it undoes what the
  browser was doing for you.


Throttling, per endpoint class

    public API          60/min
    authenticated API  300/min
    login                5/min per IP
    expensive report     3/min

  One limit for everything is too tight for the cheap
  endpoints or too loose for the expensive ones.


Sanctum or Passport

  Sanctum                  Passport
  ───────                  ────────
  API tokens               a full OAuth2 server
  SPA cookie auth          authorization grants
  mobile apps              refresh tokens
  first-party clients      third-party client registration
                           delegated authorization

  The question is not which sounds professional. It is:
  does somebody need to authorize your application to
  act on their behalf in a third party's system, or
  the reverse?

    your own mobile app                     Sanctum
    your own SPA                            Sanctum
    a customer's server calling your API    Sanctum

    "Log in with YourApp" elsewhere         Passport
    third parties registering clients       Passport
    the full grant and refresh flow         Passport

  Passport is an OAuth2 authorization server. If you are
  not building one, it is a lot of machinery for a token
  in a header.


Documentation

  endpoints · authentication · request body ·
  response body · status codes · errors ·
  pagination · rate limits · versioning

    POST /api/v1/posts
    Authorization: Bearer <token>
    Body:      { "title": "...", "body": "..." }
    Responses: 201 · 401 · 403 · 422 · 429

  For anything larger: OpenAPI. A specification is
  machine-readable, so one file generates the docs page,
  client libraries and a test collection — and can be
  checked against the real API so it cannot go stale.


The separation this day comes down to

  who are you?               Sanctum
  what can you do?           policies and abilities
  is this input valid?       the validator
  what should they receive?  the API Resource
  what happened?             the status code

  Five questions, five mechanisms, each in one place.
  That is what makes an API a system rather than a
  pile of CRUD routes.`,
      codeExample: {
        title: "Versioning, CORS, limits and the choice",
        code: `<?php
// ---------- URL versioning ----------

// routes/api.php

Route::prefix('v1')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('posts', V1\\PostController::class);
    });
});

Route::prefix('v2')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('posts', V2\\PostController::class);
    });
});

// Two versions is two sets of resources and two sets of
// tests. v1 only means something if v1 keeps working.

// Adding a field is safe. Removing or renaming one is not.


<?php
// ---------- Separate resources per version ----------

// app/Http/Resources/V1/PostResource.php
return [
    'id'    => $this->id,
    'title' => $this->title,
];

// app/Http/Resources/V2/PostResource.php
return [
    'id'     => $this->id,
    'title'  => $this->title,
    'author' => new UserResource($this->whenLoaded('user')),
];


<?php
// ---------- CORS ----------

// config/cors.php

return [
    'paths' => ['api/*'],

    // The origins you actually have.
    'allowed_origins' => [
        'https://app.example.com',
        'https://admin.example.com',
    ],

    'allowed_methods' => ['GET', 'POST', 'PATCH', 'DELETE'],
    'allowed_headers' => ['Content-Type', 'Authorization', 'Accept'],

    // Only for Sanctum SPA cookie authentication, and it
    // cannot be combined with an allowed_origins of *.
    'supports_credentials' => false,
];

// ⚠️ CORS is a browser mechanism. curl ignores it, and so
//    does every mobile app. It is not your security.


<?php
// ---------- Throttling, per endpoint class ----------

// AppServiceProvider

RateLimiter::for('api', fn (Request $r) =>
    Limit::perMinute(300)->by($r->user()?->id ?? $r->ip()));

RateLimiter::for('api-public', fn (Request $r) =>
    Limit::perMinute(60)->by($r->ip()));

RateLimiter::for('reports', fn (Request $r) =>
    Limit::perMinute(3)->by($r->user()->id));


// routes/api.php

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::apiResource('posts', PostController::class);

    Route::get('/reports/revenue', ReportController::class)
        ->middleware('throttle:reports');
});

Route::middleware('throttle:api-public')->group(function () {
    Route::get('/status', StatusController::class);
});


<?php
// ---------- Sanctum or Passport ----------

// Sanctum: a token in a header, and SPA cookies.
//   your own mobile app
//   your own SPA
//   a customer's server calling your API
//
// Passport: an OAuth2 authorization server.
//   "Log in with YourApp" on somebody else's site
//   third parties registering their own clients
//   the full grant and refresh flow
//
// If you are not building an authorization server,
// Passport is a lot of machinery for something Sanctum
// already does.


# ---------- The minimum documentation ----------

# POST /api/v1/posts
#
# Authorization: Bearer <token>
# Accept: application/json
#
# Body:
#   { "title": "Laravel", "body": "..." }
#
# Responses:
#   201  the created post
#   401  no or invalid token
#   403  not permitted
#   422  { "message": "...", "errors": {...} }
#   429  rate limited, with Retry-After
#
# For anything larger: OpenAPI, so one file generates the
# docs, the client libraries and a test collection — and
# can be verified against the real API.`,
      },
      keyTakeaways: [
        "<b>An API with clients you do not control cannot change shape freely</b>, which is what versioning is for.",
        "<b>URL versioning is the pragmatic default</b>: visible to the client, routable, and answerable in support.",
        "<b>A version is a promise you keep</b>, so two versions means two sets of resources and two sets of tests.",
        "<b>Adding a field is safe; removing or renaming one is not.</b>",
        "<b>CORS is the browser refusing a cross-origin request unless the server permits it.</b>",
        "<b>CORS is a browser mechanism, not a security control</b>: `curl` and mobile apps ignore it entirely.",
        "Allowing `*` is fine for a public read-only API and wrong for one using cookies.",
        "<b>Throttle per endpoint class</b>, because one limit is too tight for cheap endpoints or too loose for expensive ones.",
        "<b>Sanctum covers tokens and first-party SPAs; Passport is a full OAuth2 authorization server.</b>",
        "Choose Passport only when third parties register clients or somebody delegates authorization.",
        "<b>Document endpoints, auth, bodies, statuses, errors, pagination, limits and versions</b>, and use OpenAPI for anything large.",
        "<b>Five questions, five mechanisms</b>: Sanctum, policies, the validator, the resource, the status code.",
      ],
      commonMistakes: [
        "<b>Creating a `v2` and abandoning `v1`.</b> A version nobody maintains is worse than no version.",
        "<b>Versioning for an added field.</b> Additive changes do not break clients.",
        "<b>Treating CORS as security.</b> Anything that is not a browser ignores it completely.",
        "<b>Allowing `*` origins with credentials.</b> That undoes the protection the browser was providing.",
        "<b>Choosing Passport because OAuth sounds more professional.</b> It is an authorization server, not a token library.",
      ],
      quiz: [
        {
          question: "Which change requires a new API version?",
          options: [
            "Adding a field to a response",
            "Renaming or removing a field",
            "Adding a new endpoint",
            "Adding an optional query parameter",
          ],
          correctIndex: 1,
          explanation: "Additive changes do not break existing clients.",
        },
        {
          question: "What does CORS actually protect?",
          options: [
            "Your API from any unauthorised client",
            "One website from reading another's responses in a user's browser",
            "Tokens in transit",
            "Against rate limit abuse",
          ],
          correctIndex: 1,
          explanation: "`curl` and mobile apps ignore it, so it is not your security.",
        },
        {
          question: "When should you choose Passport over Sanctum?",
          options: [
            "For any mobile application",
            "When third parties register their own clients, or somebody delegates authorization",
            "Whenever the API is public",
            "When you need refresh tokens for your own app",
          ],
          correctIndex: 1,
          explanation: "Passport is an OAuth2 authorization server, not a token library.",
        },
        {
          question: "Why is a single throttle limit for a whole API a poor fit?",
          options: [
            "Laravel does not allow it",
            "It is either too tight for cheap endpoints or too loose for expensive ones",
            "It cannot key on the user",
            "It breaks CORS",
          ],
          correctIndex: 1,
          explanation: "A report costing seconds and a status check are not the same endpoint.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why does `php artisan install:api` exist rather than API routes being there by default?",
      options: [
        "It is a licensing requirement",
        "Plenty of applications never expose an API, so the routes and Sanctum are opt-in",
        "It configures the database",
        "It is required for Blade",
      ],
      correctIndex: 1,
      explanation: "It creates `routes/api.php`, registers it and installs Sanctum.",
    },
    {
      question: "Why do API routes not need CSRF protection?",
      options: [
        "APIs are trusted",
        "A token header is attached by code, not automatically like a cookie, so there is nothing to forge",
        "CSRF only applies to forms",
        "Laravel disables it for speed",
      ],
      correctIndex: 1,
      explanation: "This stops being true for Sanctum SPA cookie authentication.",
    },
    {
      question: "How many times can you read a token's plain text value?",
      options: ["Any number of times", "Once, when it is created", "Until it expires", "Only from the database"],
      correctIndex: 1,
      explanation: "The database stores a hash, exactly as it does for a password.",
    },
    {
      question: "What do token abilities limit?",
      options: [
        "What the user may do to a record",
        "What that particular token may be used for",
        "How many requests a token may make",
        "Which routes exist",
      ],
      correctIndex: 1,
      explanation: "The policy still decides what the user may do to a given record.",
    },
    {
      question: "What does `$user->tokens()->delete()` do?",
      options: [
        "Logs out the current device",
        "Revokes every token the user has, on every device",
        "Expires tokens after an hour",
        "Deletes the user",
      ],
      correctIndex: 1,
      explanation: "`currentAccessToken()->delete()` is the one for a normal logout.",
    },
    {
      question: "Why does expiry matter when tokens can be revoked?",
      options: [
        "It is faster",
        "Revocation needs somebody to notice; expiry limits a leaked token even when nobody does",
        "Expired tokens are removed automatically",
        "It replaces abilities",
      ],
      correctIndex: 1,
      explanation: "The question becomes how much time a leak buys, not whether anybody notices.",
    },
    {
      question: "What is the main value of `Route::apiResource()`?",
      options: [
        "It generates the controller",
        "All five routes are registered consistently, so they cannot drift in name, path or middleware",
        "It adds authentication",
        "It paginates the index",
      ],
      correctIndex: 1,
      explanation: "Hand-written routes eventually differ in one of those.",
    },
    {
      question: "Why return an API Resource rather than the model?",
      options: [
        "It is faster",
        "The model publishes every column, including ones added by future migrations",
        "Models cannot be serialised",
        "Resources add pagination",
      ],
      correctIndex: 1,
      explanation: "`$hidden` fails open; a resource fails closed.",
    },
    {
      question: "A valid token, but the user does not own the record. What status?",
      options: ["401", "403", "404", "422"],
      correctIndex: 1,
      explanation: "They are authenticated, so logging in again would change nothing.",
    },
    {
      question: "What is the difference between 404 and 422?",
      options: [
        "None",
        "404 means the resource does not exist; 422 means the data sent is invalid",
        "422 is for missing authentication",
        "404 is only for collections",
      ],
      correctIndex: 1,
      explanation: "Route model binding gives the first; validation gives the second.",
    },
    {
      question: "What does CORS actually protect?",
      options: [
        "Your API from unauthorised clients",
        "One website from reading another's responses in a user's browser",
        "Tokens in transit",
        "Against rate-limit abuse",
      ],
      correctIndex: 1,
      explanation: "`curl` and mobile apps ignore it entirely, so it is not your security.",
    },
    {
      question: "When is Passport the right choice over Sanctum?",
      options: [
        "For any mobile application",
        "When third parties register their own clients or somebody delegates authorization",
        "Whenever tokens need to expire",
        "For any public API",
      ],
      correctIndex: 1,
      explanation: "Passport is an OAuth2 authorization server, not a token library.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Expose InvoiceHub as a token-authenticated REST API that a mobile client could build against, and prove every failure returns the right status.",
    brief: "InvoiceHub has screens. Today it gets an interface something else can call.\n\nAlmost nothing here is new. The authentication is Day 18, the policies are Day 19, the validation is Day 9, the resources are Day 16, the rate limiting is Day 20. <b>What is new is that all of it now has to be visible in the response.</b> A browser can be redirected and shown a message; a client gets a number and a body, and has to decide what to do from those alone.\n\nSo the day is measured in status codes. For every endpoint, five requests: no token, a valid token from the wrong user, a missing record, invalid data, and a correct request. Each has one right answer, and until all five are right the endpoint is not finished.\n\nWork in `routes/api.php`, keep everything under `/api/v1`, and treat the resource files as the contract: if it is not in a resource, it is not in your API.",
    steps: [
      "Run `php artisan install:api` and read what it changed. Write down which middleware `api.php` has that `web.php` does not, and what each difference means for a mobile client.",
      "Add `HasApiTokens` to `User` and build a login endpoint that validates, checks the password, and returns a token. Use one error message for a wrong password and an unknown email.",
      "Rate limit that endpoint with the `login` limiter from Day 20, then fail it six times and confirm the 429 and its `Retry-After` header.",
      "Add `GET /api/v1/user` behind `auth:sanctum`. Call it with no token and confirm a 401. Then call it without `Accept: application/json` and note what you get instead, and why.",
      "Build `InvoiceController` with `--api` and register it with `apiResource` under a `v1` prefix. Confirm all five routes exist with `php artisan route:list`.",
      "Write `InvoiceResource` and `CustomerResource`. Include the customer with `whenLoaded()` and a line count with `whenCounted()`. Nothing that is not in the resource should appear in a response.",
      "Add a column to the invoices table, deploy nothing else, and confirm it does not appear in the API. Write down what would have happened if the controller returned the model.",
      "Make `index` paginated and confirm the response carries `links` and `meta` without you writing them.",
      "Apply the Day 19 policy to every action, and confirm a second user gets a 403 on show, update and destroy.",
      "Change the `view` policy to `denyAsNotFound()` and note what a stranger can now learn from a sequential id, compared with before.",
      "Get the statuses right: 201 with the created invoice on store, 200 on update, 204 with an empty body on destroy. Check the delete response really is empty.",
      "Trigger a 422 and read the body. Confirm the `errors` object maps messages to fields, and write down how a mobile client would use it.",
      "Now the five-request test, for every endpoint: no token, wrong user, missing record, invalid data, correct request. Record the status you got for each in a table.",
      "Issue a second token with `['invoices:read']` and confirm it can list invoices and cannot delete one. Then confirm the delete failure is a 403 and not a 401.",
      "Build a devices endpoint listing the user's tokens with their names and last use, and a revoke endpoint. Revoke one from a second client and confirm it stops working immediately.",
      "Add token revocation on password change, then change a password and confirm every other client is signed out.",
      "Configure CORS for one specific origin, call the API from a page on that origin and from another, and write down which one the browser refused and why `curl` succeeded from both.",
      "Write the documentation: for each endpoint, the method, path, auth, request body, and every status it can return. Compare it against your table from step 13 and fix whichever is wrong.",
    ],
    acceptance: [
      "Every endpoint lives under `/api/v1` and is registered through `apiResource`.",
      "No token returns 401, a valid token from the wrong user returns 403, and you can explain why those are different.",
      "A missing invoice returns 404 and invalid data returns 422 with a field-keyed `errors` object.",
      "Creating returns 201 with the invoice; deleting returns 204 with a genuinely empty body.",
      "The API returns only what the resource files list, and a newly added column does not appear.",
      "The index endpoint is paginated and returns `links` and `meta`.",
      "A read-only token can list invoices and is refused with a 403 on delete.",
      "The devices endpoint lists tokens, revoking one takes effect immediately, and a password change signs out every client.",
      "The login endpoint is rate limited and returns 429 with `Retry-After`.",
      "CORS permits your frontend origin and refuses another in a browser, and you can explain why `curl` is unaffected.",
      "Your documentation lists every status each endpoint can return, and matches what the API actually does.",
    ],
    stretch: [
      "Add `/api/v2` that renames one field, keep `v1` working, and write a test proving both still return the right shape.",
      "Publish an OpenAPI specification for the API and generate a documentation page from it.",
      "Add a `POST /api/v1/invoices/{invoice}/payment` sub-resource rather than a `pay` verb, and write down what modelling it as a resource gave you.",
    ],
  },
};
