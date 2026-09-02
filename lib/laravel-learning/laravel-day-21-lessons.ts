import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_21_LESSONS: LessonDay = {
  day: 21,
  title: "Application security — CSRF, XSS, rate limiting & headers",
  totalMinutes: 89,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "csrf",
      title: "CSRF — cross-site request forgery",
      durationMinutes: 12,
      explanation: "Two days on who somebody is and what they may do. Today is about everything else that can go wrong, and it starts from one idea:\n\n> <b>Every piece of data arriving at your application is untrusted until you have explicitly validated or constrained it.</b>\n\n```text\nIncoming Request\n      │\n      ├── CSRF protection\n      ├── Input validation\n      ├── XSS protection\n      ├── SQL injection protection\n      ├── Mass assignment protection\n      ├── Rate limiting\n      ├── Security headers\n      └── HTTPS + secrets\n               ↓\n          Application\n```\n\n---\n\n### 1. Basic — the attack\n\n<b>CSRF</b> is <i>cross-site request forgery</i>: making somebody's browser send a request they did not intend.\n\nYou are logged into your bank. Your browser holds a valid session cookie. An attacker gets you to open their page, which contains a form or a bit of JavaScript pointed at your bank:\n\n```http\nPOST https://bank.com/transfer\n```\n\nAnd here is the part that surprises people: <b>the browser attaches your bank cookies to that request</b>, because cookies are sent based on where the request is <i>going</i>, not where it came from.\n\n```text\nevil.com's page\n      ↓\nPOST to bank.com\n      ↓\nbrowser attaches bank.com's cookies\n      ↓\nbank.com sees an authenticated request\n```\n\nAuthentication does not help. The request <i>is</i> authenticated; it just was not asked for. So the server needs a different question:\n\n> Did this request actually originate from my application?\n\n---\n\n### 2. Intermediate — how Laravel answers it\n\nA <b>CSRF token</b> is a value your application generates, ties to the session, and embeds in its own pages. A form submitted from your site carries it; a form on `evil.com` cannot, <i>because the attacker cannot read your pages</i>.\n\nIn Blade:\n\n```blade\n<form method=\"POST\" action=\"/profile\">\n    @csrf\n    ...\n</form>\n```\n\n```html\n<input type=\"hidden\" name=\"_token\" value=\"...\">\n```\n\n```text\nform → token → request → middleware → valid?\n```\n\nLaravel 13's middleware is `PreventRequestForgery`, and the change worth understanding is conceptual: <b>it checks the request's origin as well as its token.</b>\n\n```text\nRequest\n  │\n  ├── CSRF token\n  └── request origin\n         ↓\n   is this legitimate?\n```\n\nThinking of CSRF as \"a hidden field\" makes it feel like paperwork. Thinking of it as \"prove this came from my application\" explains why a token alone was never the whole answer, and why the browser telling you the origin is useful.\n\nFor JavaScript, expose the token and send it as a header:\n\n```blade\n<meta name=\"csrf-token\" content=\"{{ csrf_token() }}\">\n```\n\n```js\nheaders: { 'X-CSRF-TOKEN': document.querySelector('meta[name=\"csrf-token\"]').content }\n```\n\nAxios and Laravel's own bundled setup do this for you; the point is not the header name but that <b>the token has to reach the server somehow</b>.\n\n---\n\n### 3. Advanced — the details that matter\n\n<b>Only state-changing requests are protected.</b> `GET` is not, which is exactly why a `GET` route must never change anything. A `GET /posts/1/delete` is a CSRF hole by construction, and no middleware can save it.\n\n<b>Some routes legitimately cannot carry a token.</b> A webhook from a payment provider is not using anybody's browser session:\n\n```text\nStripe  →  your webhook endpoint\n```\n\nSo it is excluded from CSRF verification, and <b>it must then be protected some other way</b>: the provider's signature header, verified before you trust the body. Excluding a route without adding that check is not a fix, it is an unauthenticated endpoint.\n\nThe temptation worth naming: a CSRF failure looks like a bug, and the fastest way to make it go away is to exclude the route. <b>That converts a confusing error into a silent vulnerability</b>, and it is the single most common self-inflicted security wound in a Laravel application.\n\nThe usual real causes:\n\n```text\na missing @csrf in a form\na cached page with an expired token      (419 after leaving a tab open)\nJavaScript not sending the header\nSPA and API on different origins\n```\n\nAnd one that is not a bug at all: <b>a token-authenticated API does not need CSRF.</b> CSRF exists because browsers attach cookies automatically. A request authenticated by an `Authorization` header carries nothing automatically, so there is nothing to forge. Sanctum's stateful browser sessions do need it; a pure token API does not.\n\nOne function to know while you are here: when you compare a signature yourself, <b>use `hash_equals()`</b>:\n\n```php\nif (! hash_equals($expected, $request->header('X-Signature'))) {\n    abort(403);\n}\n```\n\n<b>`===` on a secret leaks how much of it you got right</b>, because it returns as soon as two characters differ, and the difference is measurable across enough requests. `hash_equals()` takes the same time whatever the input. Same reasoning as `Hash::check()` on Day 19.",
      diagram: `The day, in one picture

  Incoming Request
        │
        ├── CSRF protection
        ├── Input validation
        ├── XSS protection
        ├── SQL injection protection
        ├── Mass assignment protection
        ├── Rate limiting
        ├── Security headers
        └── HTTPS + secrets
                 ↓
            Application

  Everything arriving is untrusted until you
  explicitly validate or constrain it.


The CSRF attack

  You are logged into bank.com. An attacker gets you
  to open evil.com, which posts to bank.com.

    evil.com's page
          ↓
    POST to bank.com
          ↓
    the browser attaches bank.com's cookies
          ↓
    bank.com sees an AUTHENTICATED request

  Cookies are sent based on where the request is GOING,
  not where it came from. Authentication does not help:
  the request is authenticated, it was just not asked for.

  So the server needs a different question:
    did this request originate from MY application?


How Laravel answers it

  A token your app generates, ties to the session, and
  embeds in its own pages. evil.com cannot read your
  pages, so it cannot include it.

    @csrf  →  <input type="hidden" name="_token" ...>

    form → token → request → middleware → valid?

  Laravel 13: PreventRequestForgery checks the request
  ORIGIN as well as the token.

    Request
      ├── CSRF token
      └── request origin
             ↓
       is this legitimate?

  JavaScript: expose it in a meta tag, send it as
  X-CSRF-TOKEN. The header name is not the point;
  the token reaching the server is.


Details that matter

  Only state-changing requests are protected. GET is not,
  which is why a GET route must never change anything.
  GET /posts/1/delete is a CSRF hole by construction.

  Webhooks legitimately cannot carry a token:

    Stripe  →  your webhook endpoint

  So exclude it, and protect it with the provider's
  SIGNATURE instead. Excluding without that is not a
  fix, it is an unauthenticated endpoint.

  ⚠️  A CSRF failure looks like a bug, and the fastest
      way to make it go away is to exclude the route.
      That turns a confusing error into a silent hole.

  Usual real causes:
    a missing @csrf
    a cached page with an expired token  (the 419)
    JavaScript not sending the header
    SPA and API on different origins

  And not a bug: a TOKEN-authenticated API needs no CSRF.
  CSRF exists because browsers attach cookies
  automatically. An Authorization header is not automatic,
  so there is nothing to forge.`,
      codeExample: {
        title: "Tokens in forms, in JavaScript, and the webhook exception",
        code: `{{-- resources/views/profile/edit.blade.php --}}

<form method="POST" action="/profile">
    @csrf
    @method('PUT')

    <input name="name" value="{{ old('name', $user->name) }}">
    <button>Save</button>
</form>

{{-- @csrf renders: --}}
{{-- <input type="hidden" name="_token" value="..."> --}}


{{-- In the layout, for JavaScript --}}
<meta name="csrf-token" content="{{ csrf_token() }}">


<script>
// The token has to reach the server somehow. Axios and
// Laravel's bundled setup do this for you.
fetch('/profile', {
    method: 'POST',
    headers: {
        'X-CSRF-TOKEN': document
            .querySelector('meta[name="csrf-token"]')
            .content,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'Rajan' }),
});
</script>


<?php
// ---------- The webhook exception ----------

// bootstrap/app.php

->withMiddleware(function (Middleware $middleware) {
    // Stripe is not using anybody's browser session and
    // cannot have your token.
    $middleware->validateCsrfTokens(except: [
        'webhooks/stripe',
    ]);
})


<?php
// ---------- ...which means it needs its own check ----------

class StripeWebhookController extends Controller
{
    public function __invoke(Request $request)
    {
        // Excluding from CSRF without this is not a fix.
        // It is an unauthenticated endpoint.
        $signature = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                $signature,
                config('services.stripe.webhook_secret'),
            );
        } catch (SignatureVerificationException $e) {
            abort(400);
        }

        // Only now is the body trustworthy.
    }
}


<?php
// ---------- The rule GET routes must follow ----------

// ❌ A CSRF hole by construction: GET is not protected,
//    so any page anywhere can trigger it with an <img>.
Route::get('/posts/{post}/delete', [PostController::class, 'destroy']);

// ✓ State changes use a verb that CSRF protection covers.
Route::delete('/posts/{post}', [PostController::class, 'destroy']);`,
      },
      keyTakeaways: [
        "<b>Treat everything arriving at your application as untrusted until you validate or constrain it.</b>",
        "<b>CSRF is making somebody's browser send a request they did not intend</b>, using the session it already has.",
        "<b>Browsers attach cookies based on where a request is going</b>, so the forged request is genuinely authenticated.",
        "<b>A CSRF token proves the request came from your own pages</b>, which an attacker's site cannot read.",
        "`@csrf` renders the hidden field; a `csrf-token` meta tag plus a header covers JavaScript.",
        "<b>Laravel 13's `PreventRequestForgery` checks the request origin as well as the token.</b>",
        "<b>`GET` requests are not protected</b>, which is why a `GET` route must never change anything.",
        "<b>A webhook cannot carry your token</b>, so it is excluded and protected by the provider's signature instead.",
        "<b>Excluding a route to make a CSRF error go away turns a visible bug into a silent hole.</b>",
        "<b>A token-authenticated API needs no CSRF</b>, because nothing is attached automatically.",
      ],
      commonMistakes: [
        "<b>Excluding a route because CSRF was failing.</b> The failure was the signal, and now there is none.",
        "<b>Excluding a webhook without verifying its signature.</b> Anybody can now post to it.",
        "<b>Using a `GET` route for a delete.</b> CSRF protection does not cover it, and an `<img>` tag can trigger it.",
        "<b>Forgetting `@csrf` in a form.</b> The 419 that follows is the protection working.",
        "<b>Adding CSRF to a pure token API.</b> There are no automatic cookies, so there is nothing to forge.",
      ],
      quiz: [
        {
          question: "Why does authentication not prevent CSRF?",
          options: [
            "Sessions expire too slowly",
            "The forged request genuinely carries the user's cookies, so it is authenticated",
            "CSRF happens before authentication",
            "It does prevent it",
          ],
          correctIndex: 1,
          explanation: "Browsers attach cookies based on the destination, not the origin.",
        },
        {
          question: "Why can an attacker's site not include your CSRF token?",
          options: [
            "The token is encrypted",
            "It cannot read your pages, which is where the token lives",
            "Tokens are IP-bound",
            "Browsers block it",
          ],
          correctIndex: 1,
          explanation: "That is exactly what makes the token proof of origin.",
        },
        {
          question: "A webhook endpoint is excluded from CSRF. What must it have instead?",
          options: [
            "Nothing; webhooks are safe",
            "The provider's signature, verified before the body is trusted",
            "Rate limiting only",
            "An API token in the URL",
          ],
          correctIndex: 1,
          explanation: "Excluding without a replacement leaves an unauthenticated endpoint.",
        },
        {
          question: "Why must a `GET` route never change state?",
          options: [
            "It is slower",
            "`GET` is not CSRF protected, so any page can trigger it",
            "Laravel forbids it",
            "It cannot be cached",
          ],
          correctIndex: 1,
          explanation: "An `<img src=\"...\">` on any site would fire it.",
        },
      ],
    },
    {
      id: "xss",
      title: "XSS — escaping output",
      durationMinutes: 11,
      explanation: "CSRF was about requests you did not mean to send. This is about scripts you did not mean to run.\n\n---\n\n### 1. Basic — the attack\n\n<b>XSS</b> is <i>cross-site scripting</i>: getting your application to render an attacker's JavaScript so it runs in somebody else's browser.\n\nA user submits a comment:\n\n```html\n<script>alert('Hacked')</script>\n```\n\nIf your page renders that as HTML, every visitor runs it. And an alert is the harmless demonstration. Real payloads read the session cookie, submit forms as the victim, or rewrite the page to ask for a password.\n\n<b>The damage is that the script runs as your site.</b> It has whatever access the visitor has, which on a logged-in page is everything.\n\n---\n\n### 2. Intermediate — Blade escapes by default\n\n```blade\n{{ $name }}\n```\n\nEscapes HTML. `<script>` becomes `&lt;script&gt;`, which the browser prints instead of running.\n\n```blade\n{!! $html !!}\n```\n\nDoes not. The string goes into the page as markup.\n\n```text\n{{ $content }}      →  escaped, printed as text\n{!! $content !!}    →  raw HTML, executed\n```\n\nSo the default is safe and you have to opt out of it. <b>Which makes `{!! !!}` worth treating as a small alarm</b>: every one in a codebase is a place somebody decided the content was trustworthy, and that decision needs to still be true.\n\nThe legitimate uses are narrow:\n\n```text\nmarkup you generated yourself\ncontent already sanitised by a library\nrich text from an editor, sanitised on the way in\n```\n\nAnd the illegitimate one is the common one: a field a user typed, rendered raw because it needed one `<br>`.\n\n---\n\n### 3. Advanced — escaping is context-dependent\n\nHere is the part that catches people who think escaping is one thing.\n\n<b>`{{ }}` escapes for HTML.</b> Inside a `<script>` block or an HTML attribute, HTML escaping is not the right escaping:\n\n```blade\n<script>\n    let name = \"{{ $name }}\";     // wrong context\n</script>\n```\n\nHTML-escaping does not neutralise a quote and a closing brace in JavaScript. The fix is to hand data to JavaScript as data, not as text spliced into a script:\n\n```blade\n<script>\n    const user = @json($user);\n</script>\n```\n\nor an attribute the script reads:\n\n```blade\n<div data-user=\"{{ json_encode($user) }}\">\n```\n\nThe same applies to attributes generally. An unquoted attribute value can be escaped from without any angle brackets at all, so <b>quote your attributes</b>, always.\n\nAnd one that gets missed:\n\n```blade\n<a href=\"{{ $url }}\">Link</a>\n```\n\nHTML-escaped, and still dangerous, because `javascript:alert(1)` contains nothing to escape. <b>A URL from a user needs validating as a URL</b>, with a scheme you allow, before it reaches an `href`.\n\nTwo defences that work alongside all this rather than instead of it:\n\n<b>Validate on the way in.</b> If a display name cannot contain `<`, an XSS payload never reaches the database, and every place that renders it is safe rather than one of them being lucky.\n\n<b>And a Content Security Policy limits the damage</b> when something does slip through, by refusing to run inline scripts at all. That is later today, and it is the reason CSP is worth the effort: it is the layer that assumes your escaping will one day be wrong.\n\nAnd since \"use a real purifier\" is advice you cannot act on without a name: <b>HTMLPurifier</b> is the one:\n\n```bash\ncomposer require ezyang/htmlpurifier\n```\n\n```php\n$config   = HTMLPurifier_Config::createDefault();\n$config->set('HTML.Allowed', 'p,b,i,a[href],ul,ol,li');\n\n$clean = (new HTMLPurifier($config))->purify($request->input('bio'));\n```\n\n<b>It parses the HTML properly and rebuilds it from an allowlist</b>, which is why it survives the encodings and malformed tags that defeat a regex or `strip_tags()`.",
      diagram: `The attack

  A user submits:

    <script>alert('Hacked')</script>

  If your page renders that as HTML, every visitor
  runs it. The alert is the harmless demo. Real
  payloads read the session cookie, submit forms as
  the victim, or ask for a password.

  The script runs AS YOUR SITE. It has whatever
  access the visitor has.


Blade escapes by default

  {{ \$content }}      escaped, printed as text
  {!! \$content !!}    raw HTML, executed

  Safe by default, and you opt out.

  So treat every {!! !!} as a small alarm: somebody
  decided that content was trustworthy, and that
  decision has to still be true.

  Legitimate:
    markup you generated yourself
    content already sanitised by a library
    rich text sanitised on the way IN

  The common illegitimate one: a user-typed field
  rendered raw because it needed one <br>.


Escaping is CONTEXT-dependent

  {{ }} escapes for HTML. Inside a script block,
  HTML escaping is the wrong escaping:

    <script>
        let name = "{{ \$name }}";      ← wrong context
    </script>

  Hand data to JavaScript as DATA:

    <script>
        const user = @json(\$user);
    </script>

    <div data-user="{{ json_encode(\$user) }}">

  And quote your attributes, always. An unquoted
  attribute value can be escaped from with no angle
  brackets at all.


The one that gets missed

  <a href="{{ \$url }}">Link</a>

  HTML-escaped, and still dangerous:

    javascript:alert(1)

  contains nothing to escape. A URL from a user needs
  validating as a URL, with an allowed scheme, before
  it reaches an href.


Two layers alongside

  Validate on the way IN.
    If a display name cannot contain <, the payload
    never reaches the database, and every renderer is
    safe rather than one of them being lucky.

  A Content Security Policy limits the damage when
  something slips through, by refusing inline scripts.
  It is the layer that assumes your escaping will one
  day be wrong.`,
      codeExample: {
        title: "Escaping, and the contexts where it is not enough",
        code: `{{-- ---------- The default: safe ---------- --}}

{{ $comment->body }}

{{-- <script>alert(1)</script> is printed, not run. --}}


{{-- ---------- Opting out: an alarm, not a tool ---------- --}}

{!! $post->rendered_html !!}

{{-- Only when the content is genuinely trusted:
       markup you generated
       output of a sanitiser
       rich text sanitised on the way in --}}


{{-- ---------- Wrong context: HTML escaping inside a script --}}

<script>
    // ❌ {{ }} escapes for HTML, not for JavaScript.
    let name = "{{ $user->name }}";
</script>

<script>
    // ✓ Hand it over as data.
    const user = @json($user);
</script>

{{-- Or via an attribute the script reads --}}
<div id="app" data-user="{{ json_encode($user) }}"></div>


{{-- ---------- Attributes: always quote them ---------- --}}

{{-- ❌ An unquoted value can be escaped from with no
       angle brackets at all. --}}
<div class={{ $class }}>

{{-- ✓ --}}
<div class="{{ $class }}">


{{-- ---------- The one that gets missed ---------- --}}

{{-- ❌ HTML-escaped, and still dangerous:
       javascript:alert(1) contains nothing to escape. --}}
<a href="{{ $user->website }}">Website</a>


<?php
// ✓ Validate it as a URL, with a scheme you allow.

$request->validate([
    'website' => ['nullable', 'url:http,https'],
]);

// Or check before rendering:
$safe = filter_var($url, FILTER_VALIDATE_URL)
    && in_array(parse_url($url, PHP_URL_SCHEME), ['http', 'https'], true);


<?php
// ---------- Stop it at the door ----------

// If a display name cannot contain markup, the payload
// never reaches the database, and every place that
// renders it is safe rather than one of them being lucky.

$request->validate([
    'name' => ['required', 'string', 'max:255', 'regex:/^[\\pL\\pN\\s.\\-]+$/u'],
]);


// ---------- And when rich text really is needed ----------

// Sanitise on the way IN with a library that understands
// HTML, then the stored value is safe for every renderer.
// Never write your own tag stripper: the edge cases are
// the entire problem.`,
      },
      keyTakeaways: [
        "<b>XSS is getting your application to render an attacker's JavaScript so it runs in another user's browser.</b>",
        "The script runs as your site, with whatever access the visitor has.",
        "<b>`{{ }}` escapes HTML; `{!! !!}` does not.</b> The default is safe and you have to opt out.",
        "<b>Treat every `{!! !!}` as an alarm</b>: somebody decided that content was trustworthy.",
        "<b>Escaping is context-dependent</b>: HTML escaping is not the right escaping inside a `<script>` block.",
        "Hand data to JavaScript with `@json()` or a data attribute, rather than splicing it into a script.",
        "<b>Always quote HTML attributes</b>, because an unquoted value can be escaped from without angle brackets.",
        "<b>A user-supplied URL in an `href` is still dangerous after escaping</b>, because `javascript:` contains nothing to escape.",
        "<b>Validating on the way in</b> means the payload never reaches the database, so every renderer is safe.",
        "<b>A Content Security Policy limits the damage when escaping is wrong</b>, which is why it is worth the effort.",
      ],
      commonMistakes: [
        "<b>Using `{!! !!}` on user input to allow one tag.</b> It allows every tag.",
        "<b>Putting `{{ $value }}` inside a `<script>` block.</b> That is HTML escaping in a JavaScript context.",
        "<b>Leaving an attribute unquoted.</b> The value can break out without any angle brackets.",
        "<b>Trusting an escaped URL in an `href`.</b> `javascript:` needs no characters that escaping would touch.",
        "<b>Writing your own HTML sanitiser.</b> The edge cases are the entire problem; use a library.",
      ],
      quiz: [
        {
          question: "What is the difference between `{{ $x }}` and `{!! $x !!}`?",
          options: [
            "None",
            "`{{ }}` escapes HTML; `{!! !!}` outputs it raw",
            "`{!! !!}` is faster",
            "`{{ }}` only works on strings",
          ],
          correctIndex: 1,
          explanation: "Safe by default, and you have to opt out deliberately.",
        },
        {
          question: "Why is `let name = \"{{ $name }}\";` inside a `<script>` block unsafe?",
          options: [
            "Blade cannot run inside script tags",
            "`{{ }}` escapes for HTML, which is not the right escaping for a JavaScript string",
            "It is safe",
            "The quotes are wrong",
          ],
          correctIndex: 1,
          explanation: "Hand the data over with `@json()` instead.",
        },
        {
          question: "Why is `<a href=\"{{ $url }}\">` still risky?",
          options: [
            "The URL is not escaped",
            "`javascript:alert(1)` contains nothing that HTML escaping would change",
            "Links cannot be escaped",
            "It is not risky",
          ],
          correctIndex: 1,
          explanation: "A user-supplied URL needs validating as a URL with an allowed scheme.",
        },
        {
          question: "What does validating input on the way in buy you?",
          options: [
            "Faster rendering",
            "The payload never reaches the database, so every place that renders it is safe",
            "It replaces escaping",
            "Nothing; escaping is enough",
          ],
          correctIndex: 1,
          explanation: "Layers: validate in, escape out, and CSP for when one of those is wrong.",
        },
      ],
    },
    {
      id: "sql-injection",
      title: "SQL injection & parameter binding",
      durationMinutes: 10,
      explanation: "You met this on Day 13 as a rule to follow. Here is why the rule works, because understanding it is what lets you recognise the cases the rule does not cover.\n\n---\n\n### 1. Basic — the attack\n\nAn attacker types this into a login form:\n\n```text\n' OR 1=1 --\n```\n\nAnd your code builds SQL by gluing strings together:\n\n```php\nDB::select(\"SELECT * FROM users WHERE email = '$email'\");\n```\n\nThe database receives:\n\n```sql\nSELECT * FROM users WHERE email = '' OR 1=1 --'\n```\n\n`OR 1=1` is true for every row, and `--` comments out the rest. Every user comes back, and the first one is usually an administrator.\n\n<b>The root cause is that the value became part of the command.</b> The database has no way to tell which characters you meant as SQL and which arrived from a form, because by the time it sees the query they are the same string.\n\n---\n\n### 2. Intermediate — why binding fixes it\n\n```php\nDB::table('users')->where('email', $email)->first();\n\nDB::select('SELECT * FROM users WHERE email = ?', [$email]);\n```\n\nBoth send the query and the value <i>separately</i>:\n\n```text\nSQL structure   +   parameter        →  database\n     (fixed)        (just a value)\n```\n\nrather than:\n\n```text\nSQL + user input  →  database reads all of it as SQL\n```\n\nThe database parses the statement first, with `?` as a placeholder, and only then receives the value. <b>At that point the shape of the query is already decided</b>, so nothing in the value can change it. `' OR 1=1 --` becomes an email address nobody has.\n\nThat is why the query builder is safe by construction. You are not remembering to escape anything; there is nothing to escape, because the value never travels as SQL.\n\n---\n\n### 3. Advanced — what binding does not cover\n\nHere is the part worth knowing, and the reason \"just use the query builder\" is slightly too simple.\n\n<b>Only values can be bound.</b> Table names, column names and sort directions are part of the query's structure, so they cannot be placeholders:\n\n```php\n// ❌ $column is structure, and it came from a request\nDB::table('users')->orderBy(request('sort'))->get();\n\nDB::select(\"SELECT * FROM users ORDER BY $column\");\n```\n\nNo binding will help. <b>Structure from user input needs a whitelist:</b>\n\n```php\n$sort = in_array(request('sort'), ['name', 'created_at'], true)\n    ? request('sort')\n    : 'created_at';\n```\n\nThe same applies to a direction (`asc` or `desc`), a table name, or anything else that decides the query's shape.\n\n<b>And raw expressions are not automatically dangerous.</b> `DB::raw('SUM(amount) as total')` is fine, because you wrote every character. It becomes dangerous the moment a request value is interpolated into it. The line is not raw versus not raw:\n\n```text\nDoes user input reach the SQL TEXT?\n\n  yes  →  a problem, whatever method you used\n  no   →  fine, including raw\n```\n\nTwo more places worth checking in an existing codebase:\n\n<b>`whereRaw`, `havingRaw`, `orderByRaw` and `selectRaw`</b> all take bindings as a second argument. Use them:\n\n```php\n->whereRaw('price > ?', [$min])\n```\n\n<b>And a `LIKE` value still needs binding</b>, even though the wildcards are yours:\n\n```php\n->where('name', 'like', \"%{$search}%\")   // bound, safe\n```\n\nThe builder binds the whole string including your `%`, which is exactly right.",
      diagram: `The attack

  A user types:   ' OR 1=1 --

  Your code:      "SELECT * FROM users WHERE email = '\$email'"

  The database receives:

    SELECT * FROM users WHERE email = '' OR 1=1 --'

  OR 1=1 is true for every row. -- comments out the rest.
  Every user comes back, and the first is usually an admin.

  Root cause: the VALUE became part of the COMMAND. By the
  time the database sees it, your SQL and their input are
  the same string.


Why binding fixes it

  ->where('email', \$email)
  DB::select('... WHERE email = ?', [\$email])

    SQL structure  +  parameter      →  database
       (fixed)        (just a value)

  instead of

    SQL + user input                 →  all read as SQL

  The database parses the statement FIRST, with ? as a
  placeholder, and receives the value afterwards. The
  shape is already decided, so nothing in the value can
  change it.

  ' OR 1=1 -- becomes an email address nobody has.


What binding does NOT cover

  Only VALUES can be bound. Table names, column names
  and sort directions are STRUCTURE.

    ❌ ->orderBy(request('sort'))
    ❌ "SELECT * FROM users ORDER BY \$column"

  No binding helps. Structure from user input needs
  a whitelist:

    \$sort = in_array(request('sort'),
        ['name', 'created_at'], true)
            ? request('sort')
            : 'created_at';


  And raw is not automatically dangerous:

    Does user input reach the SQL TEXT?

      yes  →  a problem, whatever method you used
      no   →  fine, including DB::raw()


  Worth grepping for in an existing codebase:

    whereRaw  havingRaw  orderByRaw  selectRaw
       all take bindings as a second argument. Use them.

       ->whereRaw('price > ?', [\$min])

    LIKE values still need binding, even though the
    wildcards are yours:

       ->where('name', 'like', "%{\$search}%")   bound, safe`,
      codeExample: {
        title: "Values, structure, and the line between them",
        code: `<?php

use Illuminate\\Support\\Facades\\DB;

// ---------- The attack ----------

// $email = "' OR 1=1 --"
//
// ❌ Returns every user in the table.
DB::select("SELECT * FROM users WHERE email = '$email'");


// ---------- Bound: safe by construction ----------

DB::table('users')->where('email', $email)->first();

DB::select('SELECT * FROM users WHERE email = ?', [$email]);

DB::select(
    'SELECT * FROM users WHERE email = :email AND active = :active',
    ['email' => $email, 'active' => true],
);

// The statement is parsed first, with ? as a placeholder.
// The value arrives after the shape is decided.


// ---------- What binding cannot do ----------

// Column names, table names and sort directions are
// STRUCTURE. There is no placeholder for them.

// ❌ Both of these, however you write them.
DB::table('users')->orderBy(request('sort'))->get();
DB::select("SELECT * FROM users ORDER BY $column");

// ✓ Whitelist anything that shapes the query.
$sort = in_array(request('sort'), ['name', 'created_at', 'email'], true)
    ? request('sort')
    : 'created_at';

$direction = request('dir') === 'asc' ? 'asc' : 'desc';

DB::table('users')->orderBy($sort, $direction)->get();


// ---------- Raw is not the problem; input is ----------

// ✓ You wrote every character.
DB::table('orders')->selectRaw('SUM(amount) as total')->get();

// ❌ A request value in the SQL text.
DB::table('orders')->selectRaw("SUM($column) as total")->get();

// ✓ Raw methods take bindings. Use them.
DB::table('orders')
    ->whereRaw('amount > ?', [$min])
    ->havingRaw('COUNT(*) > ?', [$count])
    ->orderByRaw('FIELD(status, ?, ?)', ['overdue', 'unpaid'])
    ->get();


// ---------- LIKE ----------

// The wildcards are yours; the value is still bound.
DB::table('users')
    ->where('name', 'like', "%{$search}%")
    ->get();

// ❌ Not this.
DB::select("SELECT * FROM users WHERE name LIKE '%$search%'");


// ---------- What to grep for in an existing codebase ----------

//   DB::select("      with a variable inside
//   whereRaw(         without a bindings argument
//   selectRaw(        with interpolation
//   orderBy(request   or any request value as a column`,
      },
      keyTakeaways: [
        "<b>SQL injection happens when a value becomes part of the command</b>, because both arrive as one string.",
        "`' OR 1=1 --` makes the condition true for every row and comments out the rest of the query.",
        "<b>Parameter binding sends the statement and the value separately</b>, so the database parses the shape first.",
        "<b>Once the shape is decided, nothing in the value can change it</b>, which is why the query builder is safe by construction.",
        "<b>Only values can be bound.</b> Table names, column names and sort directions are structure.",
        "<b>Structure from user input needs a whitelist</b>, and no amount of escaping substitutes for one.",
        "<b>Raw SQL is not automatically dangerous</b>: the question is whether user input reaches the SQL text.",
        "`whereRaw`, `havingRaw`, `orderByRaw` and `selectRaw` all accept bindings, so use them.",
        "<b>A `LIKE` value still needs binding</b>, and the builder binds the wildcards along with it.",
      ],
      commonMistakes: [
        "<b>Interpolating a value into a raw query.</b> That is the injection, whatever the value looks like.",
        "<b>Passing a request value to `orderBy()`.</b> A column name cannot be bound; it needs a whitelist.",
        "<b>Using `whereRaw()` without the bindings argument.</b> The second parameter exists for exactly this.",
        "<b>Casting to an integer and calling it safe.</b> Bind the value and stop reasoning about it.",
        "<b>Building a `LIKE` pattern inside a raw string.</b> Bind the whole pattern, wildcards included.",
      ],
      quiz: [
        {
          question: "Why does parameter binding prevent SQL injection?",
          options: [
            "It escapes dangerous characters",
            "The statement is parsed before the value arrives, so the value cannot change the query's shape",
            "It encrypts the value",
            "It validates the input",
          ],
          correctIndex: 1,
          explanation: "Structure and data travel separately.",
        },
        {
          question: "Can a column name be bound as a parameter?",
          options: [
            "Yes, the same way as a value",
            "No; it is part of the query's structure, so it needs a whitelist",
            "Only in raw queries",
            "Only on MySQL",
          ],
          correctIndex: 1,
          explanation: "Placeholders exist for values, not for structure.",
        },
        {
          question: "Is `DB::raw('SUM(amount) as total')` dangerous?",
          options: [
            "Yes, all raw SQL is dangerous",
            "No; you wrote every character, and no user input reaches the SQL text",
            "Only in production",
            "Only with joins",
          ],
          correctIndex: 1,
          explanation: "The line is whether user input reaches the SQL, not raw versus not raw.",
        },
        {
          question: "How should a `LIKE` search value be handled?",
          options: [
            "Interpolated into a raw query",
            "Passed as a bound value, wildcards included",
            "Escaped manually",
            "Validated only",
          ],
          correctIndex: 1,
          explanation: "`->where('name', 'like', \"%{$search}%\")` binds the whole pattern.",
        },
      ],
    },
    {
      id: "mass-assignment",
      title: "Mass assignment & trusting the request",
      durationMinutes: 10,
      explanation: "Day 14 introduced `$fillable`. This is the same feature seen from the attacker's side, plus the wider habit it belongs to.\n\n---\n\n### 1. Basic — the attack\n\nYour `users` table has a column your form does not:\n\n```text\nname\nemail\nis_admin\n```\n\nAnd your controller does the convenient thing:\n\n```php\nUser::create($request->all());\n```\n\nThe attacker adds a key:\n\n```json\n{\n    \"name\": \"Rajan\",\n    \"email\": \"rajan@example.com\",\n    \"is_admin\": true\n}\n```\n\n<b>The form never had that field, and it did not need one.</b> A request body is whatever the sender chooses to send, and a form is a suggestion. `curl` ignores suggestions.\n\nThat is <b>mass assignment</b>: setting many attributes at once from an array you did not check.\n\n---\n\n### 2. Intermediate — the two lists\n\n```php\nprotected $fillable = ['name', 'email', 'password'];\n```\n\n```text\nname       ✓\nemail      ✓\npassword   ✓\nis_admin   ✗   silently dropped\n```\n\nAn allow list. Or the inverse:\n\n```php\nprotected $guarded = ['is_admin'];\n```\n\n```text\n$fillable   only these may be mass assigned\n$guarded    everything except these\n```\n\nThe security argument for `$fillable` is about what happens next month, when somebody adds a column:\n\n```text\n$fillable   not assignable until listed\n            → the field does not save\n            → you notice immediately\n\n$guarded    assignable the moment it exists\n            → the field saves when it should not\n            → you notice when it matters\n```\n\n<b>Both are reasonable; only one fails loudly.</b> And `$guarded = []` is not a middle ground, it is the protection switched off.\n\nOne detail worth repeating from Day 14: <b>mass assignment is about arrays.</b> `$user->is_admin = true; $user->save();` is unaffected, because you wrote that line deliberately.\n\n---\n\n### 3. Advanced — the habit underneath\n\n`$fillable` is a safety net. The habit is not to need it:\n\n```php\n// ❌ whatever they sent\nUser::create($request->all());\n\n// ✓ what you asked for\nUser::create($request->validate([\n    'name'  => ['required', 'string', 'max:255'],\n    'email' => ['required', 'email', 'unique:users'],\n]));\n```\n\n<b>`validate()` returns only the validated keys</b>, so an extra field is gone before the model ever sees it. Two independent locks, and neither is a reason to skip the other:\n\n```text\nvalidation   what the request is allowed to contain\n$fillable    what the model is allowed to accept\n```\n\nThe same shape appears elsewhere, and recognising it is the useful part:\n\n<b>A hidden form field is a request field.</b> A `<select>` of five options accepts a sixth, so validate with `in:` or `exists:`. A price in a hidden input is a price the customer chose; look it up on the server instead.\n\n<b>And route model binding is not authorization.</b> `PUT /invoices/91` resolves invoice 91 whoever asks, which is exactly what yesterday's policies are for.\n\nThe common thread across today: <b>every one of these attacks is somebody sending something your interface did not offer.</b> The interface is a convenience for honest users. The server is the only thing that decides.",
      diagram: `The attack

  users:  name  email  is_admin

  User::create(\$request->all());

  {
      "name": "Rajan",
      "email": "rajan@example.com",
      "is_admin": true          ← the form never had this field
  }

  A request body is whatever the SENDER chooses to send.
  A form is a suggestion, and curl ignores suggestions.


The two lists

  protected \$fillable = ['name', 'email', 'password'];

    name ✓   email ✓   password ✓   is_admin ✗ dropped

  protected \$guarded = ['is_admin'];

    everything EXCEPT these


  Next month, somebody adds a column:

    \$fillable   not assignable until listed
                → the field does not save
                → you notice immediately

    \$guarded    assignable the moment it exists
                → the field saves when it should not
                → you notice when it matters

  Both reasonable. Only one fails loudly.

  \$guarded = [] is not a middle ground.
  It is the protection switched off.

  And mass assignment is about ARRAYS. Writing
  \$user->is_admin = true is unaffected: you meant it.


The habit underneath

  ❌ User::create(\$request->all())        whatever they sent
  ✓ User::create(\$request->validate([...]))  what you asked for

  validate() returns only the validated keys, so an extra
  field is gone before the model sees it.

    validation   what the REQUEST may contain
    \$fillable    what the MODEL may accept

  Two locks. Neither is a reason to skip the other.


The same shape elsewhere

  A hidden form field is a request field.
  A <select> of five options accepts a sixth  → in: / exists:
  A price in a hidden input is the customer's price
      → look it up on the server
  Route model binding is not authorization
      → PUT /invoices/91 resolves it for whoever asks


  The thread through today: every one of these attacks is
  somebody sending something your interface did not offer.
  The interface is a convenience. The server decides.`,
      codeExample: {
        title: "Closing the gap between the form and the request",
        code: `<?php
// ---------- The vulnerability ----------

// users: name, email, is_admin
class User extends Authenticatable
{
    // No $fillable and no $guarded.
}

// ❌ The attacker adds "is_admin": true and becomes an admin.
User::create($request->all());


<?php
// ---------- Lock one: the model ----------

class User extends Authenticatable
{
    // Allow list. A new column is not assignable until listed,
    // so the mistake is a field that does not save.
    protected $fillable = ['name', 'email', 'password'];

    // The inverse. A new column is assignable immediately,
    // so the mistake is a field that saves when it should not.
    // protected $guarded = ['is_admin'];

    // ❌ Not a middle ground. This is protection off.
    // protected $guarded = [];
}


<?php
// ---------- Lock two: the request ----------

public function store(Request $request)
{
    // validate() returns ONLY the validated keys, so
    // is_admin is gone before the model sees it.
    $data = $request->validate([
        'name'  => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'unique:users'],
        'password' => ['required', 'confirmed', Password::defaults()],
    ]);

    $user = User::create($data);

    return redirect()->route('users.show', $user);
}


<?php
// ---------- The same shape, elsewhere ----------

// A <select> of five options accepts a sixth.
$request->validate([
    'status'      => ['required', 'in:draft,sent,paid'],
    'customer_id' => ['required', 'exists:customers,id'],
]);

// ❌ The price came from a hidden input the customer controls.
Order::create([
    'product_id' => $request->product_id,
    'price'      => $request->price,
]);

// ✓ Look it up on the server.
$product = Product::findOrFail($request->product_id);

Order::create([
    'product_id' => $product->id,
    'price'      => $product->price,
]);


// ❌ Route model binding resolves invoice 91 for whoever asks.
public function update(Request $request, Invoice $invoice)
{
    $invoice->update($request->validated());
}

// ✓ Yesterday's policy decides whether they may.
#[Authorize('update', 'invoice')]
public function update(Request $request, Invoice $invoice)
{
    $invoice->update($request->validated());
}`,
      },
      keyTakeaways: [
        "<b>Mass assignment is setting many attributes at once from an array you did not check.</b>",
        "<b>A request body is whatever the sender chooses to send</b>, so a form field list is not a limit.",
        "<b>`$fillable` is an allow list</b> and anything not on it is silently dropped.",
        "<b>`$guarded` is a block list</b>, and `$guarded = []` is the protection switched off.",
        "<b>A new column is unassignable under `$fillable` and assignable under `$guarded`</b>, so one fails loudly and one quietly.",
        "Mass assignment concerns arrays; a deliberate `$user->is_admin = true` is unaffected.",
        "<b>`validate()` returns only the validated keys</b>, so an extra field never reaches the model.",
        "<b>Validation limits what the request may contain; `$fillable` limits what the model may accept.</b>",
        "<b>A `<select>` accepts values it never offered</b>, so constrain it with `in:` or `exists:`.",
        "<b>Every attack today is somebody sending something the interface did not offer.</b> The server decides, not the form.",
      ],
      commonMistakes: [
        "<b>Passing `$request->all()` to `create()` or `update()`.</b> Every column becomes writable by the sender.",
        "<b>Setting `$guarded = []` to make an error go away.</b> That removes the protection entirely.",
        "<b>Assuming validation makes `$fillable` unnecessary.</b> They guard different doors, and one may be forgotten.",
        "<b>Trusting a price or an id from a hidden field.</b> Look it up on the server instead.",
        "<b>Trusting a `<select>` to limit its own values.</b> Any value can be posted; validate with `in:`.",
      ],
      quiz: [
        {
          question: "Why can a request contain a field your form never rendered?",
          options: [
            "Laravel adds defaults",
            "A request body is whatever the sender chooses to send; the form is only a suggestion",
            "The browser adds hidden fields",
            "It cannot",
          ],
          correctIndex: 1,
          explanation: "`curl` and the developer tools ignore your markup entirely.",
        },
        {
          question: "What is the security argument for `$fillable` over `$guarded`?",
          options: [
            "It is faster",
            "A newly added column is not assignable until listed, so the mistake fails loudly",
            "`$guarded` does not work with `create()`",
            "There is none",
          ],
          correctIndex: 1,
          explanation: "Under `$guarded`, a new column becomes writable the moment it exists.",
        },
        {
          question: "What does `$request->validate()` return?",
          options: [
            "The whole request",
            "Only the keys that were validated",
            "A boolean",
            "The model",
          ],
          correctIndex: 1,
          explanation: "So an extra field is gone before the model sees it.",
        },
        {
          question: "A price arrives in a hidden input. What should the server do?",
          options: [
            "Validate it as numeric",
            "Look the price up from the product on the server",
            "Encrypt the field",
            "Trust it; the form set it",
          ],
          correctIndex: 1,
          explanation: "Anything the client can edit is a value the client chose.",
        },
      ],
    },
    {
      id: "rate-limiting",
      title: "Rate limiting & named limiters",
      durationMinutes: 11,
      explanation: "The attacks so far were about one crafted request. This one is about a great many ordinary ones.\n\n---\n\n### 1. Basic — what it protects\n\nWithout a limit, an endpoint answers as fast as your server can:\n\n```text\nattacker\n   ↓\n10,000 requests\n   ↓\nyour application\n```\n\nWhich turns several things from impractical into routine:\n\n```text\nlogin           guessing passwords\npassword reset  emailing somebody a thousand times\nsearch          expensive queries, repeated\nAPI             scraping your data\nsignup          creating accounts in bulk\n```\n\n<b>Yesterday's password hashing is what makes login rate limiting work.</b> A slow hash makes each guess expensive; a rate limit makes the number of guesses small. Either alone is much weaker than both.\n\n```text\nattacker → 5 requests → blocked\n```\n\n---\n\n### 2. Intermediate — named limiters\n\nA limiter is defined once and referenced by name:\n\n```php\nRateLimiter::for('login', function (Request $request) {\n    return Limit::perMinute(5)->by($request->ip());\n});\n```\n\n```text\nlogin limiter\n      ↓\n5 requests per minute\n      ↓\nper IP\n```\n\nand applied as middleware:\n\n```php\nRoute::post('/login', ...)->middleware('throttle:login');\n```\n\n```text\nPOST /login\n     ↓\nthrottle:login\n     ↓\nRateLimiter\n     ↓\nallowed?  →  yes: continue\n          →  no:  429\n```\n\nThe name matters more than it looks. <b>A named limiter is a security rule with a home</b>, so \"how many login attempts do we allow\" has one answer that somebody can find, change and review, rather than a number in a middleware string on one route.\n\nAn API limiter usually keys on the user when there is one:\n\n```php\nRateLimiter::for('api', function (Request $request) {\n    return Limit::perMinute(60)->by($request->user()?->id ?? $request->ip());\n});\n```\n\n---\n\n### 3. Advanced — the part people get wrong\n\n<b>Failed attempts must count.</b>\n\nThis sounds obvious and is easy to get backwards, because a limiter applied after a successful login, or one that resets on failure, protects nothing. The whole point is the attempts that <i>do not</i> work:\n\n```text\nrequest 1  →  401\nrequest 2  →  401\nrequest 3  →  401\nrequest 4  →  401\nrequest 5  →  401\nrequest 6  →  429      ← this is the feature\n```\n\nIf failures were free, an attacker gets unlimited guesses and the limit is decoration.\n\n<b>And the limit belongs on the endpoint, not on the outcome.</b> Middleware runs before your controller, so every request counts whatever happens inside.\n\nTwo more things worth deciding deliberately.\n\n<b>What to key on.</b> IP is the only option for an unauthenticated endpoint, and it is imperfect: an office shares one address, and an attacker can rotate through many. It raises the cost rather than removing the attack, which is usually enough.\n\n<b>What the limit protects against.</b> A five-per-minute login limit is aimed at guessing one account's password. It does nothing about the same password tried against a thousand accounts, because each account sees one attempt. That needs a different key, and knowing which attack a limit stops is the difference between security and a number.\n\nLaravel's own login also limits by email plus IP together, which covers both directions better than either alone.\n\nTwo small additions. `Limit::perHour()` and `Limit::perDay()` exist alongside `perMinute()`, and are the natural shape for an export or upload quota rather than a login form.\n\nAnd a boundary worth naming: <b>application rate limiting cannot absorb an attack aimed at your bandwidth.</b> Laravel counting requests still requires PHP to boot for each one. A WAF or edge network in front of the application, Cloudflare or AWS WAF, drops that traffic before it reaches you. <b>They solve different problems</b>: throttling is for abuse of your logic, the edge is for volume.",
      diagram: `What it protects

  Without a limit, an endpoint answers as fast as
  your server can.

    attacker → 10,000 requests → your application

  Which makes routine:

    login           guessing passwords
    password reset  emailing somebody a thousand times
    search          expensive queries, repeated
    API             scraping your data
    signup          accounts in bulk

  Yesterday's slow password hash makes each guess
  EXPENSIVE. A rate limit makes the number of guesses
  SMALL. Either alone is much weaker than both.


Named limiters

  RateLimiter::for('login', function (Request \$request) {
      return Limit::perMinute(5)->by(\$request->ip());
  });

    login limiter → 5 per minute → per IP

  Route::post('/login', ...)->middleware('throttle:login')

    POST /login
         ↓
    throttle:login
         ↓
    RateLimiter
         ↓
    allowed?  → yes: continue
              → no:  429

  The NAME matters. "How many login attempts do we allow"
  now has one answer somebody can find, change and review,
  instead of a number in a string on one route.


The part people get wrong

  FAILED attempts must count.

    request 1 → 401
    request 2 → 401
    request 3 → 401
    request 4 → 401
    request 5 → 401
    request 6 → 429      ← this is the feature

  A limiter that only counts successes protects nothing.
  If failures are free, guesses are unlimited.

  Middleware runs before the controller, so every request
  counts whatever happens inside. The limit is on the
  ENDPOINT, not on the outcome.


Two things to decide deliberately

  What to key on
    IP is the only option when unauthenticated, and it
    is imperfect: an office shares one, an attacker
    rotates many. It raises the cost rather than
    removing the attack. Usually enough.

  Which attack it stops
    5/minute per IP stops guessing ONE account's password.
    It does nothing about one password tried against a
    thousand accounts: each account sees one attempt.

    Knowing which attack a limit stops is the difference
    between security and a number.

  Laravel's own login limits by email AND IP together.`,
      codeExample: {
        title: "Defining and applying limiters",
        code: `<?php
// app/Providers/AppServiceProvider.php

use Illuminate\\Cache\\RateLimiting\\Limit;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\RateLimiter;

public function boot(): void
{
    // Unauthenticated: IP is all there is.
    RateLimiter::for('login', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });

    // Authenticated where possible, IP otherwise.
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)
            ->by($request->user()?->id ?? $request->ip());
    });

    // Expensive, so tighter.
    RateLimiter::for('reports', function (Request $request) {
        return Limit::perMinute(3)->by($request->user()->id);
    });

    // Sending email on somebody else's behalf: tighter still.
    RateLimiter::for('password-reset', function (Request $request) {
        return Limit::perMinutes(15, 3)->by($request->ip());
    });
}


<?php
// ---------- Applying them ----------

Route::post('/login', [LoginController::class, 'store'])
    ->middleware('throttle:login');

Route::post('/forgot-password', [PasswordResetController::class, 'send'])
    ->middleware('throttle:password-reset');

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::apiResource('invoices', InvoiceController::class);
});

// An inline limit, without a named limiter:
Route::get('/search', SearchController::class)->middleware('throttle:30,1');


<?php
// ---------- Why failed attempts must count ----------

// The limiter is middleware, so it runs BEFORE the
// controller. Every request counts, whether the login
// succeeded, failed, or threw.

//   request 1 → 401
//   ...
//   request 5 → 401
//   request 6 → 429     ← the point of the feature

// ❌ Counting only successes protects nothing: an
//    attacker gets unlimited failed guesses.


<?php
// ---------- Which attack does this stop? ----------

// Stops guessing ONE account's password.
Limit::perMinute(5)->by($request->ip());

// Does NOT stop one password tried against a thousand
// accounts: each account sees a single attempt.

// Laravel's own login keys on both directions:
RateLimiter::for('login', function (Request $request) {
    $key = Str::lower($request->input('email')) . '|' . $request->ip();

    return Limit::perMinute(5)->by($key);
});`,
      },
      keyTakeaways: [
        "<b>Without a limit, an endpoint answers as fast as your server can</b>, which makes guessing and scraping routine.",
        "<b>A slow password hash makes each guess expensive; a rate limit makes the guesses few.</b> Both together is the defence.",
        "<b>`RateLimiter::for('name', ...)` defines a limiter once</b>, applied with `throttle:name` middleware.",
        "<b>A named limiter gives a security rule a home</b>, so the number can be found, changed and reviewed.",
        "An API limiter usually keys on the user id when there is one and the IP otherwise.",
        "<b>Failed attempts must count</b>, because the attempts that fail are exactly what you are limiting.",
        "<b>The limiter is middleware, so it runs before the controller</b> and counts every request regardless of outcome.",
        "<b>IP keying is imperfect</b>: offices share one and attackers rotate many, so it raises cost rather than removing the attack.",
        "<b>A per-IP login limit does not stop one password tried against many accounts</b>, because each account sees one attempt.",
        "<b>Knowing which attack a limit stops is the difference between security and a number.</b>",
      ],
      commonMistakes: [
        "<b>Counting only successful logins.</b> The failures are the attack, and they stay free.",
        "<b>Applying the limit inside the controller.</b> Middleware runs first and counts every request.",
        "<b>Leaving password reset unthrottled.</b> It becomes a way to email somebody a thousand times.",
        "<b>Assuming a per-IP limit stops credential stuffing.</b> Spread across accounts, each sees one attempt.",
        "<b>Writing the number inline on every route.</b> A named limiter is one place to read and change.",
      ],
      quiz: [
        {
          question: "Why must failed login attempts count towards the limit?",
          options: [
            "For accurate metrics",
            "The failures are the attack; if they are free, guesses are unlimited",
            "Laravel requires it",
            "They do not need to",
          ],
          correctIndex: 1,
          explanation: "A limiter that only counts successes protects nothing.",
        },
        {
          question: "What does `RateLimiter::for('login', ...)` give you over an inline limit?",
          options: [
            "Better performance",
            "A named rule with one home, which can be found, changed and reviewed",
            "Automatic IP detection",
            "A different status code",
          ],
          correctIndex: 1,
          explanation: "The number stops being buried in a middleware string on one route.",
        },
        {
          question: "Why is a per-IP limit imperfect?",
          options: [
            "IPs are unavailable behind a proxy",
            "Offices share one address and attackers can rotate many",
            "Laravel cannot read them",
            "It is not imperfect",
          ],
          correctIndex: 1,
          explanation: "It raises the cost of an attack rather than removing it.",
        },
        {
          question: "What does a 5-per-minute per-IP login limit not stop?",
          options: [
            "Guessing one account's password",
            "One password tried against a thousand different accounts",
            "Repeated logins from one browser",
            "Automated form submission",
          ],
          correctIndex: 1,
          explanation: "Each account sees a single attempt, so keying on email plus IP covers both.",
        },
      ],
    },
    {
      id: "limit-keys-and-responses",
      title: "Keys, multiple limits & the 429 response",
      durationMinutes: 12,
      explanation: "A limiter is two decisions: how many, and <i>per what</i>. The second one is where the thinking is.\n\n---\n\n### 1. Basic — choosing the key\n\n<b>The key is what the counter is kept against.</b> One counter per key.\n\n```php\nLimit::perMinute(5)->by($request->ip());\n```\n\n```text\nIP 1  →  5 per minute\nIP 2  →  5 per minute\nIP 3  →  5 per minute\n```\n\nUse the IP when there is no user yet: login, registration, password reset, a public API.\n\n```php\nLimit::perMinute(60)->by($request->user()->id);\n```\n\n```text\nUser 1  →  60 per minute\nUser 2  →  60 per minute\n```\n\nUse the user id once somebody is authenticated. It follows them across devices and networks, which an IP does not.\n\nAnd the combination, when you want both to matter:\n\n```php\n->by($request->user()?->id . '|' . $request->ip())\n```\n\n```text\n123|192.168.1.20\n```\n\n<b>Getting the key wrong is the whole bug.</b> A login limiter keyed on the user id cannot work, because there is no user until the login succeeds. A limiter with no `by()` at all counts every request from everybody into one bucket, so one busy user locks out the world.\n\n---\n\n### 2. Intermediate — more than one limit\n\nA limiter can return an array, and all of them apply:\n\n```php\nRateLimiter::for('api', function (Request $request) {\n    return [\n        Limit::perMinute(100)->by($request->user()->id),\n        Limit::perMinute(20)->by($request->ip()),\n    ];\n});\n```\n\n```text\n100 per minute per user\n        +\n 20 per minute per IP\n```\n\nWhich covers two different abuses at once: one account hammering the API, and one machine driving many accounts.\n\nA limiter can also decide per request:\n\n```php\nreturn $request->user()->onPremiumPlan()\n    ? Limit::none()\n    : Limit::perMinute(10)->by($request->user()->id);\n```\n\n<b>`Limit::none()` exempts</b>, which is how a paid tier or an internal service gets past the limit without a second route.\n\n---\n\n### 3. Advanced — the response, and what it tells people\n\nExceeding a limit is <b>429 Too Many Requests</b>. Not 403, not 400: a specific status that means <i>slow down</i>, and clients know how to handle it.\n\nLaravel sends headers with it:\n\n```text\nX-RateLimit-Limit       the ceiling\nX-RateLimit-Remaining   what is left\nRetry-After             seconds until it resets\n```\n\n<b>`Retry-After` is the useful one.</b> A well-written client waits that long instead of retrying immediately, which is the difference between a limit that protects you and one that produces a retry storm.\n\nA custom response, when the default is not friendly enough:\n\n```php\nLimit::perMinute(5)\n    ->by($request->ip())\n    ->response(function (Request $request, array $headers) {\n        return response()->json([\n            'message' => 'Too many login attempts. Please try again later.',\n        ], 429, $headers);\n    });\n```\n\n<b>Pass the `$headers` through.</b> Dropping them removes `Retry-After`, and the client has nothing to work with.\n\nOne judgement about the wording. A rate limit response is shown to somebody who may be an attacker or may be a customer having a bad day:\n\n```text\n✓ \"Too many attempts. Try again in a minute.\"\n✗ \"Too many attempts for user 4192 from 10.0.0.7\"\n```\n\nSay enough to help, and nothing that confirms what they were probing for.\n\nAnd one operational note. <b>Counters live in the cache.</b> On the `array` driver they vanish on restart, and across several servers each keeps its own unless the cache is shared. A five-per-minute limit across four web servers is twenty per minute in practice, which is worth knowing before you rely on the number.",
      diagram: `The key is what the counter is kept against

  ->by(\$request->ip())

    IP 1 → 5/min    IP 2 → 5/min    IP 3 → 5/min

  Use the IP when there is no user yet:
    login, registration, password reset, public API

  ->by(\$request->user()->id)

    User 1 → 60/min    User 2 → 60/min

  Use the user id once authenticated. It follows them
  across devices and networks; an IP does not.

  ->by(\$request->user()?->id . '|' . \$request->ip())

    123|192.168.1.20


  ⚠️  Getting the key wrong IS the bug.

      A login limiter keyed on the user id cannot work:
      there is no user until the login succeeds.

      No by() at all counts everybody into one bucket,
      so one busy user locks out the world.


Several limits at once

  return [
      Limit::perMinute(100)->by(\$request->user()->id),
      Limit::perMinute(20)->by(\$request->ip()),
  ];

    100/min per user   +   20/min per IP

  Covers two abuses: one account hammering the API,
  and one machine driving many accounts.

  Limit::none()   exempts, for a paid tier or an
                  internal service, with no second route


The response

  429 Too Many Requests

  Not 403, not 400. A specific status meaning SLOW DOWN,
  which clients know how to handle.

    X-RateLimit-Limit       the ceiling
    X-RateLimit-Remaining   what is left
    Retry-After             seconds until it resets

  Retry-After is the useful one: a good client waits
  that long instead of retrying immediately. That is
  the difference between a limit that protects you and
  one that produces a retry storm.

  A custom response must PASS THE HEADERS THROUGH.
  Dropping them removes Retry-After.


  Wording: the reader may be an attacker or a customer
  having a bad day.

    ✓ "Too many attempts. Try again in a minute."
    ✗ "Too many attempts for user 4192 from 10.0.0.7"


  Counters live in the CACHE. On the array driver they
  vanish on restart, and across four web servers each
  keeps its own — so 5/minute is really 20/minute
  unless the cache is shared.`,
      codeExample: {
        title: "Keys, stacked limits and a custom 429",
        code: `<?php

use Illuminate\\Cache\\RateLimiting\\Limit;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\RateLimiter;

// ---------- Choosing the key ----------

// No user yet, so the IP is all there is.
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});

// Authenticated: follows them across devices and networks.
RateLimiter::for('reports', function (Request $request) {
    return Limit::perMinute(3)->by($request->user()->id);
});

// Both, when both should matter.
RateLimiter::for('uploads', function (Request $request) {
    return Limit::perMinute(10)
        ->by($request->user()?->id . '|' . $request->ip());
});

// ❌ There is no user until the login succeeds.
RateLimiter::for('login', fn (Request $r) => Limit::perMinute(5)->by($r->user()->id));

// ❌ No by(): everybody shares one counter, so one busy
//    user locks out the world.
RateLimiter::for('search', fn () => Limit::perMinute(30));


<?php
// ---------- Several limits at once ----------

RateLimiter::for('api', function (Request $request) {
    return [
        // One account hammering the API.
        Limit::perMinute(100)->by($request->user()->id),

        // One machine driving many accounts.
        Limit::perMinute(20)->by($request->ip()),
    ];
});


// ---------- Deciding per request ----------

RateLimiter::for('exports', function (Request $request) {
    return $request->user()->onPremiumPlan()
        ? Limit::none()
        : Limit::perMinute(2)->by($request->user()->id);
});


<?php
// ---------- The response ----------

RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)
        ->by($request->ip())
        ->response(function (Request $request, array $headers) {
            return response()->json([
                'message' => 'Too many login attempts. Please try again later.',
            ], 429, $headers);   // pass the headers through
        });
});

// Dropping $headers removes Retry-After, and the client
// has nothing to wait for.

// Sent with a 429:
//   X-RateLimit-Limit: 5
//   X-RateLimit-Remaining: 0
//   Retry-After: 47


<?php
// ---------- Reading a limiter yourself ----------

// Outside middleware, such as in a job or a command:
if (RateLimiter::tooManyAttempts('send-invoice:' . $user->id, 3)) {
    return;
}

RateLimiter::hit('send-invoice:' . $user->id, 3600);

// And clearing it, such as after a successful login:
RateLimiter::clear('login:' . $request->ip());`,
      },
      keyTakeaways: [
        "<b>The key decides what the counter is kept against</b>, and one counter exists per key.",
        "<b>Use the IP when there is no user yet</b>: login, registration, password reset, a public API.",
        "<b>Use the user id once authenticated</b>, because it follows them across devices and networks.",
        "<b>A login limiter keyed on the user id cannot work</b>, since there is no user until login succeeds.",
        "<b>A limiter with no `by()` counts everybody into one bucket</b>, so one busy user locks out the world.",
        "<b>Returning an array applies several limits at once</b>, covering per-user and per-IP abuse together.",
        "`Limit::none()` exempts a request, which is how a paid tier bypasses a limit with no second route.",
        "<b>Exceeding a limit is 429 Too Many Requests</b>, with `X-RateLimit-*` and `Retry-After` headers.",
        "<b>A custom response must pass the headers through</b>, or the client loses `Retry-After`.",
        "<b>Counters live in the cache</b>, so an unshared cache across four servers quadruples your limit in practice.",
      ],
      commonMistakes: [
        "<b>Keying a login limiter on the user.</b> There is no user until the credentials check out.",
        "<b>Omitting `by()`.</b> Everybody shares one counter, and one user can lock out the rest.",
        "<b>Dropping `$headers` from a custom response.</b> Clients lose `Retry-After` and retry immediately.",
        "<b>Returning 403 instead of 429.</b> Clients cannot tell a refusal from a slow-down.",
        "<b>Assuming the limit holds across servers.</b> Each keeps its own counter unless the cache is shared.",
      ],
      quiz: [
        {
          question: "Why can a login limiter not key on the user id?",
          options: [
            "User ids are not unique",
            "There is no authenticated user until the login succeeds",
            "It would be too slow",
            "It can",
          ],
          correctIndex: 1,
          explanation: "The IP, or the email plus IP, is what is available at that point.",
        },
        {
          question: "What happens if a limiter has no `by()`?",
          options: [
            "It applies per route",
            "Every request shares one counter, so one busy user locks out everyone",
            "It is disabled",
            "It defaults to the IP",
          ],
          correctIndex: 1,
          explanation: "The key is what makes the counter per-anything.",
        },
        {
          question: "What status is returned when a rate limit is exceeded?",
          options: ["403", "400", "429", "503"],
          correctIndex: 2,
          explanation: "429 Too Many Requests, with `Retry-After` telling the client how long to wait.",
        },
        {
          question: "Why must a custom 429 response include the `$headers` argument?",
          options: [
            "For CORS",
            "It carries `Retry-After` and the rate-limit headers the client needs",
            "Laravel requires it",
            "It sets the status code",
          ],
          correctIndex: 1,
          explanation: "Without it, clients retry immediately and make things worse.",
        },
      ],
    },
    {
      id: "headers-and-https",
      title: "Security headers & HTTPS",
      durationMinutes: 12,
      explanation: "Everything so far happened inside your application. This is what you tell the browser to do, and what happens on the wire.\n\n---\n\n### 1. Basic — headers are instructions to the browser\n\nThree that matter:\n\n```text\nContent-Security-Policy     what the page may load and run\nStrict-Transport-Security   always use HTTPS for this site\nX-Frame-Options             who may put this page in a frame\n```\n\n<b>None of them fixes insecure code.</b> They are a second layer that limits the damage when the first one is wrong:\n\n```text\nsecure code\n     +\nsecure browser policies\n     +\nsecure transport\n```\n\nThat framing matters, because headers are easy to add and easy to over-trust. A CSP does not make unescaped output safe; it means that when your escaping is wrong once, the payload may not run.\n\n---\n\n### 2. Intermediate — the three headers\n\n<b>Content-Security-Policy</b> lists which sources the browser may load scripts, styles, images and fonts from.\n\n```http\nContent-Security-Policy: default-src 'self'\n```\n\n\"Only load things from this origin.\" An injected `<script src=\"//evil.com/x.js\">` is refused, and with a strict policy an inline `<script>` is refused too, which is what most XSS payloads are.\n\nThe catch is that real applications load from real places:\n\n```text\nyour JavaScript\na CDN\nGoogle Fonts\nanalytics\nan API on another domain\n```\n\nSo <b>a CSP has to be built from what your application actually does</b>, not copied from an article. Copy a strict one and half your page stops working; write a loose one and it stops being worth much. Start in report-only mode, watch what breaks, then enforce.\n\n<b>Strict-Transport-Security</b> tells the browser to use HTTPS for this site from now on:\n\n```text\nhttp://example.com\n       ↓\nthe browser remembers\n       ↓\nhttps://example.com\n```\n\nSo even a typed `http://` never leaves the machine unencrypted. <b>Be careful with `includeSubDomains` and `preload`</b>: they are hard to undo, and a subdomain without a certificate becomes unreachable rather than insecure.\n\n<b>X-Frame-Options: DENY</b> stops your page being embedded in a frame, which is what clickjacking needs: your real page, invisible, over the attacker's decoy button. CSP's `frame-ancestors` does the same with more nuance and is where new policies go, though sending both is common.\n\n---\n\n### 3. Advanced — HTTPS, and the limits of `forceScheme`\n\nWithout HTTPS, everything today is decoration. Session cookies, passwords and CSRF tokens all cross the network in the clear, and anybody on the same network reads them.\n\nLaravel can generate `https://` URLs:\n\n```php\nURL::forceScheme('https');\n```\n\n<b>And that is all it does.</b> It changes the links your application writes. It does not:\n\n```text\nobtain a certificate\nconfigure the web server\nredirect http to https\nterminate TLS\n```\n\n<b>HTTPS is infrastructure.</b> The certificate, the redirect and the TLS termination live in your web server, load balancer or platform, and `forceScheme` is the small part that stops your own links pointing back at `http://`.\n\nTwo related settings that people miss.\n\n<b>Cookies should be marked secure and http-only.</b> `secure` means the browser never sends them over plain HTTP; `http-only` means JavaScript cannot read them, which limits what an XSS payload can steal. Laravel's session config has both, and `SESSION_SECURE_COOKIE=true` belongs in production.\n\n<b>And behind a proxy, trust it deliberately.</b> A load balancer terminates TLS and forwards plain HTTP, so your application sees an insecure request unless it trusts the `X-Forwarded-Proto` header. Get that wrong and you see redirect loops, `http://` links and an IP address that is the balancer's rather than the visitor's, which quietly breaks the rate limiting from the last lesson.\n\nOne header worth adding to that middleware, because it costs a line and closes a whole category:\n\n```text\nPermissions-Policy: geolocation=(), camera=(), microphone=(), payment=()\n```\n\n<b>It tells the browser which device features the page may use</b>, and the empty parentheses mean \"nobody, including me\". An injected script or a compromised third-party embed then cannot ask for the camera, because the browser refuses before the permission prompt appears.",
      diagram: `Headers are instructions to the browser

  Content-Security-Policy     what the page may load and run
  Strict-Transport-Security   always use HTTPS for this site
  X-Frame-Options             who may frame this page

  None of them fixes insecure code.

    secure code  +  secure browser policies  +  secure transport

  A CSP does not make unescaped output safe. It means
  that when your escaping is wrong ONCE, the payload
  may not run.


Content-Security-Policy

  default-src 'self'      only load things from this origin

  An injected <script src="//evil.com/x.js"> is refused,
  and a strict policy refuses inline <script> too — which
  is what most XSS payloads are.

  The catch: real applications load from real places.

    your JavaScript · a CDN · Google Fonts
    analytics · an API on another domain

  So build it from what your app actually does. Copy a
  strict one and half the page breaks; write a loose one
  and it is not worth much.

  Start in report-only, watch what breaks, then enforce.


Strict-Transport-Security

    http://example.com
           ↓
    the browser remembers
           ↓
    https://example.com

  Even a typed http:// never leaves the machine
  unencrypted.

  ⚠️  includeSubDomains and preload are hard to undo.
      A subdomain without a certificate becomes
      unreachable, not merely insecure.


X-Frame-Options: DENY

  Stops your page being embedded in a frame, which is
  what clickjacking needs: your real page, invisible,
  over the attacker's decoy button.

  CSP's frame-ancestors does the same with more nuance.
  Sending both is common.


HTTPS, and what forceScheme does not do

  Without HTTPS, everything today is decoration: session
  cookies, passwords and CSRF tokens all cross the network
  in the clear.

  URL::forceScheme('https')

  ...changes the links your application WRITES. That is all.

  It does NOT:
    obtain a certificate
    configure the web server
    redirect http to https
    terminate TLS

  HTTPS is infrastructure. forceScheme is the small part
  that stops your own links pointing back at http://.


Two settings people miss

  Cookies: secure + http-only
    secure     never sent over plain HTTP
    http-only  JavaScript cannot read them, which limits
               what an XSS payload can steal
    SESSION_SECURE_COOKIE=true in production

  Behind a proxy: trust it deliberately
    The balancer terminates TLS and forwards plain HTTP,
    so your app sees an insecure request unless it trusts
    X-Forwarded-Proto.

    Get it wrong and you get redirect loops, http:// links,
    and the BALANCER's IP instead of the visitor's — which
    quietly breaks your rate limiting.`,
      codeExample: {
        title: "Headers, cookies and proxies",
        code: `<?php
// ---------- A middleware that adds headers ----------

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Built from what this application actually loads.
        $response->headers->set('Content-Security-Policy', implode('; ', [
            "default-src 'self'",
            "script-src 'self' https://cdn.example.com",
            "style-src 'self' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data:",
            "frame-ancestors 'none'",
        ]));

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        if ($request->secure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000',
            );
        }

        return $response;
    }
}

// Start with Content-Security-Policy-Report-Only, watch the
// console, then switch to enforcing.


<?php
// ---------- HTTPS ----------

// app/Providers/AppServiceProvider.php

use Illuminate\\Support\\Facades\\URL;

public function boot(): void
{
    if ($this->app->isProduction()) {
        // Changes the links this application WRITES.
        URL::forceScheme('https');
    }
}

// It does not obtain a certificate, configure the web
// server, redirect http to https, or terminate TLS.
// That is infrastructure.


# ---------- Cookies ----------

# .env, in production
SESSION_SECURE_COOKIE=true

<?php
// config/session.php
'secure'    => env('SESSION_SECURE_COOKIE', false),  // HTTPS only
'http_only' => true,       // JavaScript cannot read it
'same_site' => 'lax',      // helps against CSRF too

// http_only is what stops an XSS payload reading the
// session cookie, which limits the damage of the one
// escaping mistake that gets through.


<?php
// ---------- Behind a load balancer ----------

// bootstrap/app.php

->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
})

// Without this, the balancer terminates TLS and forwards
// plain HTTP, so:
//   $request->secure() is false      → redirect loops
//   generated URLs are http://
//   $request->ip() is the balancer's → your rate limiter
//                                      counts everybody
//                                      into one bucket`,
      },
      keyTakeaways: [
        "<b>Security headers are instructions to the browser</b>, and none of them fixes insecure code.",
        "They are a second layer that limits damage when the first one is wrong.",
        "<b>A Content-Security-Policy lists which sources may be loaded</b>, and a strict one refuses inline scripts.",
        "<b>A CSP has to be built from what your application actually loads</b>, so start in report-only mode.",
        "<b>HSTS tells the browser to always use HTTPS</b>, so even a typed `http://` never leaves the machine in the clear.",
        "<b>`includeSubDomains` and `preload` are hard to undo</b>, and can make an uncertificated subdomain unreachable.",
        "<b>`X-Frame-Options: DENY` prevents clickjacking</b>, and CSP's `frame-ancestors` is the modern equivalent.",
        "<b>Without HTTPS everything else is decoration</b>, because cookies and passwords cross the network readable.",
        "<b>`URL::forceScheme('https')` only changes the links you generate</b>; certificates and redirects are infrastructure.",
        "<b>Session cookies should be `secure` and `http_only`</b>, which is what stops an XSS payload reading them.",
        "<b>Behind a proxy, trust it deliberately</b>, or `$request->ip()` is the balancer's and your rate limiting breaks.",
      ],
      commonMistakes: [
        "<b>Copying a strict CSP from an article.</b> Half the page stops loading, and the policy gets removed rather than fixed.",
        "<b>Treating a CSP as a substitute for escaping.</b> It limits damage; it does not prevent the injection.",
        "<b>Enabling HSTS `preload` early.</b> It is very hard to undo, and it applies to subdomains you forgot about.",
        "<b>Thinking `forceScheme('https')` gives you HTTPS.</b> It only rewrites the URLs you generate.",
        "<b>Not trusting the proxy.</b> Redirect loops, `http://` links, and every visitor sharing the balancer's rate limit.",
      ],
      quiz: [
        {
          question: "What does a Content-Security-Policy do?",
          options: [
            "Escapes output",
            "Tells the browser which sources it may load and run, limiting the damage of an injection",
            "Encrypts the response",
            "Blocks SQL injection",
          ],
          correctIndex: 1,
          explanation: "A layer that assumes your escaping will one day be wrong.",
        },
        {
          question: "What does HSTS tell the browser?",
          options: [
            "To cache the page",
            "To use HTTPS for this site from now on, even if the user types http://",
            "Not to frame the page",
            "To send the CSRF token",
          ],
          correctIndex: 1,
          explanation: "`includeSubDomains` and `preload` are hard to reverse, so enable them deliberately.",
        },
        {
          question: "What does `URL::forceScheme('https')` do?",
          options: [
            "Redirects http to https",
            "Makes the URLs your application generates use https, and nothing more",
            "Obtains a certificate",
            "Terminates TLS",
          ],
          correctIndex: 1,
          explanation: "The certificate, redirect and TLS termination are infrastructure.",
        },
        {
          question: "Why does `http_only` on the session cookie matter?",
          options: [
            "It speeds up requests",
            "JavaScript cannot read it, so an XSS payload cannot steal the session",
            "It encrypts the cookie",
            "It prevents CSRF",
          ],
          correctIndex: 1,
          explanation: "It limits the damage of the one escaping mistake that gets through.",
        },
      ],
    },
    {
      id: "secrets-and-dependencies",
      title: "Secrets, dependencies & the security mindset",
      durationMinutes: 11,
      explanation: "Two attack surfaces that are nothing to do with your code, and then the way of thinking that ties the day together.\n\n---\n\n### 1. Basic — secrets\n\n<b>Never commit `.env`.</b> Laravel gitignores it, and the mistake is usually adding it deliberately to make a deploy work.\n\nWhat is in there:\n\n```text\nAPP_KEY\ndatabase passwords\nAPI keys\nAWS credentials\nOAuth secrets\npayment provider secrets\n```\n\n```text\n.env\n  ↓\n.gitignore\n  ↓\nsecret management / the deployment environment\n```\n\nYour code holds `config('services.stripe.secret')`. The value lives wherever you deploy.\n\n<b>And a committed secret is not fixed by deleting it.</b> Git keeps history, so the commit still holds it and anybody who cloned the repository has it. The only fix is to rotate the secret: issue a new key, revoke the old one. Removing the line makes it invisible, not safe.\n\nWhich is worth knowing before it happens, because the instinct is to quietly delete and move on.\n\n---\n\n### 2. Intermediate — `APP_KEY`\n\nIt deserves its own paragraph, because Day 19 showed why:\n\n```text\nencryption of database columns\nsigned URLs\nsession cookies\n```\n\nAll of it depends on that one value.\n\n<b>A leaked production `APP_KEY` is an incident</b>, not a chore. Anything encrypted with it can be read, and signed URLs can be forged.\n\n<b>And regenerating it casually is a different kind of incident.</b> `php artisan key:generate` on a running production application makes every encrypted column unreadable and logs everybody out. Day 19's `APP_PREVIOUS_KEYS` is what makes a planned rotation possible; there is no undo for an unplanned one.\n\nSo, two rules: keep it out of the repository, and never regenerate it in production without knowing what is encrypted with it.\n\n---\n\n### 3. Advanced — dependencies, automation, and the question\n\nYour application is your code plus Laravel plus a hundred packages, and a vulnerability in any of them is a vulnerability in your application.\n\n```bash\ncomposer audit\n```\n\nchecks what you have installed against known advisories.\n\n```text\nyour code  +  Laravel  +  packages\n                ↓\n         composer audit\n```\n\n<b>Run it in CI, not from memory.</b> A check you have to remember is a check that happens twice a year:\n\n```text\npush\n ↓\ntests\n ↓\nstatic analysis\n ↓\ncomposer audit\n ↓\nbuild\n ↓\ndeploy\n```\n\nSecurity that depends on somebody remembering is not a control, it is a hope.\n\nAnd now the thing worth taking away from the whole day. These are not nine features to memorise:\n\n```text\nCSRF · XSS · SQL injection · mass assignment\nrate limiting · headers · HTTPS · secrets · dependencies\n```\n\nThey are <b>different attack surfaces</b>, each one a place where something outside your application crosses into it:\n\n```text\nHTTP Request\n     │\n ┌───┼───────────┐\n ▼   ▼           ▼\nCSRF XSS       SQLi\n │    │          │\nrequest output database\nforgery injection injection\n     │\n     ▼\nmass assignment  →  Eloquent\n     │\n     ▼\nrate limiting    →  abuse\n     │\n ┌───┴────┐\n ▼        ▼\nheaders  HTTPS\n │        │\nbrowser  transport\n     │\n     ▼\nsecrets + dependencies\n```\n\nWhich turns the skill into one question you can ask about any feature you build:\n\n> <b>What can an attacker control here, what trust boundary are they crossing, and what mechanism stops them?</b>\n\nA search box: they control the query, it crosses into SQL, and binding stops them. A profile page: they control the name, it crosses into HTML, and escaping stops them. An upload: they control the filename and the contents, and neither of those has come up today, which is precisely why the question is more useful than the list.\n\nOne more tool alongside `composer audit`, aimed at your configuration rather than your dependencies:\n\n```bash\ncomposer require enlightn/enlightn --dev\nphp artisan enlightn\n```\n\n<b>It scans for the misconfigurations that cause real incidents</b>: debug mode left on, a wildcard CORS origin, an exposed `.env`, missing security headers, unindexed foreign keys. Worth running once now and once in CI, because every item it finds is something nobody would have noticed until it mattered.\n\nAnd a five-minute audit that needs no tool: `php artisan route:list` and read down the middleware column. <b>Every route without `auth` is public</b>, and seeing that list in one place is how you find the one you forgot.",
      diagram: `Secrets

  Never commit .env. Laravel gitignores it, and the
  mistake is usually adding it deliberately to make
  a deploy work.

    APP_KEY · database passwords · API keys
    AWS credentials · OAuth secrets · payment secrets

    .env  →  .gitignore  →  the deployment environment

  Your code holds config('services.stripe.secret').
  The value lives where you deploy.


  ⚠️  A committed secret is not fixed by deleting it.

      Git keeps history. The commit still holds it, and
      anybody who cloned the repo has it.

      The only fix is to ROTATE: new key, revoke the old.
      Deleting the line makes it invisible, not safe.


APP_KEY

  encryption of database columns
  signed URLs
  session cookies

  All of it depends on one value.

  Leaked in production   → an incident. Encrypted data
                           can be read, signed URLs forged.

  Regenerated casually   → a different incident. Every
                           encrypted column becomes
                           unreadable and everybody is
                           logged out. There is no undo.

  APP_PREVIOUS_KEYS is what makes a PLANNED rotation work.


Dependencies

  your code  +  Laravel  +  a hundred packages

  A vulnerability in any of them is a vulnerability in
  your application.

    composer audit

  Run it in CI, not from memory:

    push → tests → static analysis → composer audit
         → build → deploy

  Security that depends on somebody remembering is not
  a control. It is a hope.


The day, as attack surfaces

  These are not nine features to memorise. They are
  places where something outside your application
  crosses into it.

                   HTTP Request
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
      CSRF             XSS             SQLi
        │               │                │
     request          output          database
     forgery         injection        injection
                        │
                        ▼
                 mass assignment  →  Eloquent
                        │
                        ▼
                  rate limiting   →  abuse
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
          headers               HTTPS
             │                     │
          browser              transport
                        │
                        ▼
             secrets + dependencies


The question that replaces the list

  What can an attacker control here, what trust
  boundary are they crossing, and what mechanism
  stops them?

    a search box  → they control the query
                  → it crosses into SQL
                  → binding stops them

    a profile     → they control the name
                  → it crosses into HTML
                  → escaping stops them

    an upload     → they control the filename AND the
                    contents, and neither came up today

  Which is exactly why the question beats the list.`,
      codeExample: {
        title: "Secrets, audits, and a pipeline",
        code: `# ---------- .gitignore ----------

.env
.env.backup
.env.production

# .env.example IS committed: the keys, never the values.


# .env.example
APP_KEY=
DB_PASSWORD=
STRIPE_SECRET=


<?php
// ---------- Code references config, never the value ----------

// ❌ Committed to the repository forever.
$stripe = new StripeClient('sk_live_51H...');

// ✓
$stripe = new StripeClient(config('services.stripe.secret'));

// config/services.php
'stripe' => [
    'secret' => env('STRIPE_SECRET'),
],

// And never call env() outside a config file: cached
// config returns null for it in production.


# ---------- If a secret is committed ----------

# Deleting the line does NOT fix it. Git keeps history,
# and anybody who cloned the repo has it.
#
#   1. rotate the secret at the provider
#   2. revoke the old one
#   3. deploy the new value
#   4. then, optionally, purge the history
#
# Steps 1 and 2 are the fix. Step 4 is tidying.


# ---------- APP_KEY ----------

# Leaked in production → an incident: encrypted columns
# can be read and signed URLs forged.
#
# Regenerated in production → a different incident:
# every encrypted column becomes unreadable and everybody
# is logged out.

# A planned rotation, from Day 19:
APP_KEY=base64:newkey...
APP_PREVIOUS_KEYS=base64:oldkey...


# ---------- Dependencies ----------

composer audit

# Checks installed packages against known advisories.
# Your application is your code + Laravel + everything
# you installed.


# ---------- In CI, not from memory ----------

# .github/workflows/ci.yml

name: CI
on: [push, pull_request]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install
        run: composer install --no-interaction --prefer-dist

      - name: Tests
        run: php artisan test

      - name: Static analysis
        run: ./vendor/bin/phpstan analyse

      - name: Security advisories
        run: composer audit

# A check you have to remember is a check that happens
# twice a year.`,
      },
      keyTakeaways: [
        "<b>Never commit `.env`.</b> Commit `.env.example` with the keys and none of the values.",
        "Code references `config(...)`; the value lives in the deployment environment.",
        "<b>Deleting a committed secret does not fix it</b>, because Git keeps history and clones already have it.",
        "<b>The only fix for a leaked secret is to rotate it</b>: issue a new one and revoke the old.",
        "<b>`APP_KEY` underpins encryption, signed URLs and session cookies</b>, so a leak is an incident.",
        "<b>Regenerating `APP_KEY` in production makes encrypted columns unreadable</b> and logs everybody out.",
        "<b>Your application is your code plus Laravel plus every package</b>, and a vulnerability in any of them is yours.",
        "<b>`composer audit` checks installed packages against known advisories</b>, and belongs in CI.",
        "<b>Security that depends on somebody remembering is a hope, not a control.</b>",
        "<b>These are attack surfaces, not features</b>: places where something outside your application crosses into it.",
        "<b>Ask of any feature: what can an attacker control, what boundary are they crossing, and what stops them?</b>",
      ],
      commonMistakes: [
        "<b>Committing `.env` to make a deploy work.</b> Every secret in it is now permanent history.",
        "<b>Deleting a leaked key and considering it handled.</b> It is still in the history and in every clone.",
        "<b>Running `key:generate` on production.</b> Encrypted data becomes unreadable with no way back.",
        "<b>Calling `env()` outside a config file.</b> Cached config returns null in production.",
        "<b>Running `composer audit` by hand occasionally.</b> Put it in the pipeline where it cannot be skipped.",
      ],
      quiz: [
        {
          question: "A secret was committed and you deleted the line. Is it safe?",
          options: [
            "Yes",
            "No; Git keeps the history and clones already have it, so the secret must be rotated",
            "Yes, after a force push",
            "Only if the repo is private",
          ],
          correctIndex: 1,
          explanation: "Rotate and revoke. Purging history is tidying, not the fix.",
        },
        {
          question: "What happens if you run `key:generate` on a live production application?",
          options: [
            "Nothing noticeable",
            "Encrypted columns become unreadable and every session is invalidated",
            "Laravel migrates the data",
            "Only new data is affected",
          ],
          correctIndex: 1,
          explanation: "A planned rotation uses `APP_PREVIOUS_KEYS`; an unplanned one has no undo.",
        },
        {
          question: "What does `composer audit` do?",
          options: [
            "Runs your tests",
            "Checks installed packages against known security advisories",
            "Updates dependencies",
            "Scans your code for vulnerabilities",
          ],
          correctIndex: 1,
          explanation: "Your application is your code plus everything you installed.",
        },
        {
          question: "What question replaces memorising the list of attacks?",
          options: [
            "Which Laravel version am I on?",
            "What can an attacker control here, what boundary are they crossing, and what stops them?",
            "Is this route authenticated?",
            "Have I added the security headers?",
          ],
          correctIndex: 1,
          explanation: "It covers the surfaces the list never mentioned, such as uploads.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What problem does CSRF protection solve?",
      options: [
        "Stolen passwords",
        "A request the user's browser was tricked into sending, carrying their cookies",
        "Injected SQL",
        "Scraping",
      ],
      correctIndex: 1,
      explanation: "The request is genuinely authenticated; it was just never asked for.",
    },
    {
      question: "Why is a CSRF token needed even though authentication uses cookies?",
      options: [
        "Cookies can be forged",
        "Cookies are attached based on where the request is going, so an attacker's page gets them too",
        "Tokens replace cookies",
        "Cookies are not encrypted",
      ],
      correctIndex: 1,
      explanation: "The token proves the request came from your own pages.",
    },
    {
      question: "Why is `{{ }}` safer than `{!! !!}` for untrusted content?",
      options: [
        "It is faster",
        "It escapes HTML, so a script tag is printed rather than executed",
        "It validates the value",
        "It strips tags",
      ],
      correctIndex: 1,
      explanation: "`{!! !!}` puts the string into the page as markup.",
    },
    {
      question: "How does parameter binding prevent SQL injection?",
      options: [
        "It escapes quotes",
        "The statement is parsed before the value arrives, so the value cannot change the query's shape",
        "It validates the input",
        "It encrypts the value",
      ],
      correctIndex: 1,
      explanation: "Structure and data travel separately.",
    },
    {
      question: "Why is `User::create($request->all())` dangerous?",
      options: [
        "It is slow",
        "The request can contain any field, including ones your form never rendered",
        "It bypasses validation rules",
        "It ignores casts",
      ],
      correctIndex: 1,
      explanation: "A form is a suggestion; the request body is whatever the sender chooses.",
    },
    {
      question: "Why must login rate limiting count failed attempts?",
      options: [
        "For accurate metrics",
        "The failures are the attack, so if they are free the number of guesses is unlimited",
        "Successes are harder to count",
        "It does not need to",
      ],
      correctIndex: 1,
      explanation: "A limiter that only counts successes protects nothing.",
    },
    {
      question: "What status should a rate-limited request receive?",
      options: ["403", "400", "429", "503"],
      correctIndex: 2,
      explanation: "429 Too Many Requests, with `Retry-After` telling the client how long to wait.",
    },
    {
      question: "What is the purpose of a Content-Security-Policy?",
      options: [
        "To escape output",
        "To tell the browser which sources it may load and run, limiting the damage of an injection",
        "To force HTTPS",
        "To block SQL injection",
      ],
      correctIndex: 1,
      explanation: "It is the layer that assumes your escaping will one day be wrong.",
    },
    {
      question: "Why does `URL::forceScheme('https')` not replace HTTPS infrastructure?",
      options: [
        "It only works in development",
        "It only changes the URLs your application generates; certificates, redirects and TLS live elsewhere",
        "It requires a package",
        "It does replace it",
      ],
      correctIndex: 1,
      explanation: "The web server, load balancer or platform terminates TLS.",
    },
    {
      question: "A secret was committed and the line has been deleted. What now?",
      options: [
        "Nothing; it is removed",
        "Rotate the secret and revoke the old one, because the history and every clone still hold it",
        "Make the repository private",
        "Add it to .gitignore",
      ],
      correctIndex: 1,
      explanation: "Deleting makes it invisible, not safe.",
    },
    {
      question: "What does `composer audit` protect against?",
      options: [
        "Bugs in your own code",
        "Installed packages with known published vulnerabilities",
        "Outdated PHP versions",
        "Insecure configuration",
      ],
      correctIndex: 1,
      explanation: "Your application is your code plus Laravel plus everything you installed.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Attack InvoiceHub yourself, one surface at a time, and close what you find: CSRF, XSS, injection, mass assignment, rate limiting, headers and secrets.",
    brief: "InvoiceHub has accounts and it has policies. It has never been attacked.\n\nToday you attack it. Every step is the same shape: try the exploit first, confirm it works, then fix it and confirm it stops. That order matters more than it sounds. <b>A defence you have never seen fail is a defence you cannot be sure exists</b>, and half of the security code in the world protects against nothing because nobody ever checked.\n\nYou will need `curl` or the browser's developer tools, because most of these attacks involve sending something the interface does not offer. That is the point: the form is a convenience for honest users, and the server is the only thing that decides.\n\nWork through the surfaces in order. Each one ends with a note in a file called `SECURITY.md`: what you tried, what happened, and what stops it now.",
    steps: [
      "Create `SECURITY.md`. For every step below, record the attack, the result before, and the result after. This file is the deliverable as much as the code is.",
      "CSRF: build a tiny HTML file on your machine that posts to InvoiceHub's invoice-delete route, open it while logged in, and see what happens. Then check whether `@csrf` is on every form in the application.",
      "Find any `GET` route that changes state. If there is one, rewrite it as a `DELETE` or `POST` and note why a `GET` could never be protected.",
      "XSS: put `<script>alert(1)</script>` into a customer name, then view the invoice list. If it runs, find the `{!! !!}` and decide whether the content is genuinely trusted.",
      "Try the same payload in a field rendered inside an attribute or a script block. Note whether escaping alone was enough there.",
      "Add a `website` field to a customer and try `javascript:alert(1)` in it. Confirm the link is dangerous even though the value was escaped, then validate the scheme.",
      "SQL injection: find every raw query in the project. Try `' OR 1=1 --` in any input that reaches one. Then grep for `whereRaw`, `selectRaw` and `orderByRaw` without a bindings argument.",
      "Add a sortable column to the invoice list driven by `request('sort')`, do it the unsafe way first, and see what a column name from a request can do. Then whitelist it.",
      "Mass assignment: add an `is_admin` column to users, remove `$fillable` temporarily, and register with `is_admin=true` in the body. Confirm it works, then put `$fillable` back and confirm it does not.",
      "Find every `create()` and `update()` that receives `$request->all()` and replace it with `$request->validate()`. Note which fields were reachable that should not have been.",
      "Rate limiting: define a `login` limiter of five per minute per IP with a custom 429 response. Fail the login six times and confirm the sixth is refused, then wait for the window and confirm it opens again.",
      "Check that failed attempts count. Write down what would happen if the limiter only counted successful logins.",
      "Add a `password-reset` limiter and confirm you cannot use the form to send somebody twenty emails.",
      "Headers: add a middleware setting `Content-Security-Policy-Report-Only`, browse the whole application, and collect what the console reports. Build the real policy from that, then switch to enforcing.",
      "Add `X-Frame-Options: DENY`, then build a local HTML file that tries to iframe InvoiceHub and confirm it refuses.",
      "Set `SESSION_SECURE_COOKIE` and `http_only`, then try to read `document.cookie` from the console and confirm the session cookie is not there.",
      "Secrets: run `git log -p -- .env` and confirm it has never been committed. Then grep the codebase for anything that looks like a key or a password hard-coded in a file.",
      "Run `composer audit` and record the result. Add it to your CI pipeline alongside the tests, so it runs on every push rather than when you remember.",
      "Finally, pick one feature you have not touched today, such as file upload or PDF generation, and answer the question for it: what can an attacker control, what boundary does it cross, and what stops them?",
    ],
    acceptance: [
      "`SECURITY.md` records every attack you tried, with the before and after result.",
      "The local CSRF page fails against every state-changing route, and no route was excluded without a signature check replacing it.",
      "No `GET` route in the application changes state.",
      "A script payload in a customer name is printed, not executed, on every page that displays it.",
      "A `javascript:` URL in a user-supplied link is rejected by validation.",
      "No raw query contains an interpolated variable, and every `whereRaw` family call passes bindings.",
      "The sortable column is whitelisted, and an unknown value falls back to a default.",
      "Registering with `is_admin=true` in the body creates a normal user.",
      "The sixth login attempt in a minute returns 429 with a `Retry-After` header, and the window resets.",
      "The CSP is built from what the application actually loads, and no console errors remain after enforcing it.",
      "The session cookie is not readable from JavaScript.",
      "`.env` has never appeared in the Git history, and `composer audit` runs in CI.",
    ],
    stretch: [
      "Add a file upload and work out its attack surface: the filename, the size, the MIME type, the contents, and where the file is served from. Write it up in `SECURITY.md`.",
      "Key the login limiter on email plus IP and demonstrate that it now also slows one password tried against many accounts.",
      "Set up HSTS locally with a self-signed certificate, then try to reach the site over `http://` and watch the browser refuse before it sends anything.",
    ],
  },
};
