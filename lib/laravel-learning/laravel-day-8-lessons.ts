import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_8_LESSONS: LessonDay = {
  day: 8,
  title: "Validation — rules, Form Requests, custom rules & error display",
  totalMinutes: 67,
  difficulty: "Beginner",
  lessons: [
    {
      id: "why-validate",
      title: "Why validate, and what validate() does",
      durationMinutes: 9,
      explanation: "Yesterday's forms accepted anything. Today they stop doing that.\n\nOne sentence carries the whole topic:\n\n```text\nNever trust data coming from the browser.\n```\n\nYour HTML might say:\n\n```html\n<input type=\"email\" name=\"email\" required maxlength=\"100\">\n```\n\nand someone can still send:\n\n```bash\ncurl -X POST https://invoicehub.test/invoices -d \"email=nonsense\"\n```\n\nBrowser-side rules are a convenience for honest users. They are not a control. Anyone can bypass them with a terminal, and someone eventually will.\n\n---\n\n### 1. Basic — the one-liner\n\n```php\npublic function store(Request $request)\n{\n    $validated = $request->validate([\n        'number' => 'required',\n        'client' => 'required',\n        'amount' => 'required|numeric',\n    ]);\n\n    // Only reached when everything passed.\n    Invoice::create($validated);\n}\n```\n\nThe `|` separates rules for one field:\n\n```text\namount\n ├── required\n └── numeric\n```\n\nAn array is the same thing and reads better once rules get long:\n\n```php\n'amount' => ['required', 'numeric', 'min:0'],\n```\n\nPrefer the array form. It avoids escaping problems when a rule contains a pipe or a comma, which happens with regular expressions.\n\n---\n\n### 2. Intermediate — what happens on failure\n\nThis is the part people find surprising, so it is worth being explicit.\n\n`validate()` does not return `false`. It <b>throws</b> a `ValidationException`, and Laravel catches it for you:\n\n```text\n$request->validate([...])\n          │\n    ┌─────┴─────┐\n  passes       fails\n    │            │\nreturns the   throws ValidationException\nvalidated       │\ndata       ┌────┴────┐\n        browser     API\n           │          │\n     redirect back   422 JSON\n     + errors        with errors\n     + old input\n```\n\nSo you never write this:\n\n```php\n// Not needed. Ever.\nif (! $validated) {\n    return back();\n}\n```\n\nLaravel decides the response format by looking at the request. A browser gets a redirect back with errors and old input already flashed. A client sending `Accept: application/json` gets a <b>422</b> response with an `errors` object.\n\nThat 422 is worth remembering: it means \"I understood your request, but the data is not acceptable\". Not 400, and not 500.\n\n---\n\n### 3. Advanced — why the return value matters\n\n`validate()` returns <b>only the fields you wrote rules for</b>. That is a security feature, not a convenience.\n\n```text\nClient sends              Rules cover           $validated contains\n───────────               ───────────           ──────────────────\nnumber  ✓                 number                number\nclient  ✓                 client                client\namount  ✓                 amount                amount\nis_paid ✗ (not a rule)                          (dropped)\n```\n\nCompare the two ways to save:\n\n```php\nInvoice::create($request->all());        // everything the client sent\nInvoice::create($validated);             // only what you asked for\n```\n\nThe first is <b>mass assignment</b> (letting client input decide which columns get written). If your table has an `is_paid` column and someone adds `is_paid=1` to the form data, the first line marks the invoice paid. Nothing errors, because from the database's point of view nothing is wrong.\n\nEloquent's `$fillable` is a second line of defence here, and you will meet it tomorrow. But validation is the first: if a field has no rule, it never reaches your model.\n\nSo the habit is simple, and it is the single most important one in this lesson:\n\n```text\nAlways save $validated. Never save $request->all().\n```",
      diagram: `Client-side rules are a convenience, not a control

  <input type="email" required maxlength="100">
                    ↓
  curl -X POST ... -d "email=nonsense"    ← bypasses all of it
                    ↓
            SERVER-side validation        ← the only real gate


validate() throws; it does not return false

  $request->validate([...])
            │
      ┌─────┴─────┐
    passes       fails
      │            │
  returns the   ValidationException
  validated       │
  data       ┌────┴────┐
          browser     API client
             │            │
       redirect back   422 + errors JSON
       + errors
       + old input

  So you never write: if (! $validated) { ... }


validate() returns ONLY the fields you wrote rules for

  sent          rules        $validated
  ────          ─────        ──────────
  number   ✓    number       number
  client   ✓    client       client
  amount   ✓    amount       amount
  is_paid  ✗    (none)       DROPPED

  Invoice::create($request->all())  → is_paid=1 gets written
  Invoice::create($validated)       → it never arrives`,
      codeExample: {
        title: "Validating, and the mass-assignment trap",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Invoice;
use Illuminate\\Http\\Request;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        // Pipe syntax: fine for short rule lists.
        $validated = $request->validate([
            'number' => 'required',
            'amount' => 'required|numeric',
        ]);

        // Array syntax: prefer this. No escaping problems when a rule
        // contains a pipe or comma, as regular expressions do.
        $validated = $request->validate([
            'number' => ['required', 'string', 'max:20'],
            'client' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'numeric', 'min:0'],
            'notes'  => ['nullable', 'string', 'max:1000'],
        ]);

        // Only reached when everything passed. On failure Laravel has
        // already redirected back (browser) or returned 422 (API).
        Invoice::create($validated);

        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice created.');
    }
}


// ---------- The mass-assignment trap ----------

// DANGEROUS: everything the client sent reaches the model.
// A form field named is_paid=1 marks the invoice paid, silently.
Invoice::create($request->all());

// SAFE: only the fields you wrote rules for.
Invoice::create($validated);


// ---------- What Laravel returns on failure ----------

// Browser request:
//   302 redirect back, with $errors and old input flashed
//
// Request with Accept: application/json
//   HTTP/1.1 422 Unprocessable Content
//   {
//     "message": "The number field is required.",
//     "errors": {
//       "number": ["The number field is required."],
//       "amount": ["The amount field must be a number."]
//     }
//   }
//
// 422 means "understood, but the data is not acceptable".
// Not 400, and not 500.`,
      },
      keyTakeaways: [
        "<b>Never trust the browser.</b> HTML attributes like `required` are a convenience and are trivially bypassed.",
        "<b>`$request->validate([...])`</b> is the quickest way to validate, straight in the controller.",
        "Prefer the <b>array form</b> of rules; it avoids escaping trouble when a rule contains a pipe or comma.",
        "`validate()` <b>throws</b> on failure rather than returning false, so you never check its result.",
        "A browser gets a redirect back with errors and old input; an API client gets a <b>422</b> with an errors object.",
        "<b>422 means the data is unacceptable</b>, not 400 and not 500.",
        "`validate()` returns <b>only the fields you wrote rules for</b>, which is what makes it safe to save.",
        "<b>Always save `$validated`, never `$request->all()`</b>, or client input decides which columns get written.",
      ],
      commonMistakes: [
        "<b>Relying on HTML `required` or `maxlength`.</b> A terminal bypasses both in one command.",
        "<b>Checking the return value of `validate()`.</b> It throws on failure, so an `if` around it never runs.",
        "<b>Saving `$request->all()`.</b> This is mass assignment: an unexpected field in the form data gets written to your table.",
        "<b>Returning 400 or 500 for invalid input.</b> 422 is the code clients expect and can act on.",
        "<b>Validating only on the front end because the form already checks.</b> The form is not what sends the request.",
      ],
      quiz: [
        {
          question: "What happens when `$request->validate()` fails?",
          options: [
            "It returns false",
            "It throws a ValidationException that Laravel converts to a response",
            "It returns an empty array",
            "It logs a warning",
          ],
          correctIndex: 1,
          explanation: "Which is why you never write an `if` around it.",
        },
        {
          question: "What status code does a failed validation return to an API client?",
          options: [
            "422",
            "400",
            "500",
            "403",
          ],
          correctIndex: 0,
          explanation: "422 means the request was understood but the data is not acceptable.",
        },
        {
          question: "Why is saving `$request->all()` dangerous?",
          options: [
            "It is slow",
            "It can be null",
            "Any field the client sends reaches your model, including ones you never intended",
            "It skips validation",
          ],
          correctIndex: 2,
          explanation: "A form field named `is_paid=1` would be written straight to the column.",
        },
        {
          question: "What does `validate()` return on success?",
          options: [
            "Everything the client sent",
            "Only the fields you wrote rules for",
            "A boolean",
            "The Request object",
          ],
          correctIndex: 1,
          explanation: "Which is exactly what makes it safe to pass to `create()`.",
        },
      ],
    },
    {
      id: "common-rules",
      title: "The rules you will use constantly",
      durationMinutes: 12,
      explanation: "There are over ninety built-in rules. You need about fifteen.\n\n---\n\n### 1. Basic — presence and shape\n\n```php\n'number' => ['required'],           // present and not empty\n'notes'  => ['nullable'],           // may be null, but validate if given\n'email'  => ['required', 'email'],\n'amount' => ['required', 'numeric'],\n'count'  => ['required', 'integer'],\n'active' => ['required', 'boolean'],\n'due_at' => ['required', 'date'],\n'status' => ['required', 'in:draft,sent,paid'],\n```\n\n<b>`nullable` is the one people miss.</b> Without it, an optional field that arrives empty fails every other rule you attached:\n\n```php\n'notes' => ['string', 'max:500']            // empty note → fails \"string\"\n'notes' => ['nullable', 'string', 'max:500'] // empty note → skipped\n```\n\nRemember from Day 6 that Laravel converts empty form fields to `null`. So an untouched optional input arrives as `null`, and without `nullable` your rules reject it.\n\nLength rules change meaning by type, which trips people up:\n\n```text\n'max:100' on a string   →  100 characters\n'max:100' on a number   →  the value 100\n'max:100' on an array   →  100 items\n'max:100' on a file     →  100 kilobytes\n```\n\nSo `'amount' => 'numeric|max:100'` caps the amount at one hundred, not at a hundred digits.\n\n---\n\n### 2. Intermediate — the database rules\n\nTwo rules query your database.\n\n<b>`unique`</b> makes sure a value is not already taken:\n\n```php\n'number' => ['required', 'unique:invoices,number'],\n```\n\n<b>`exists`</b> makes sure it is already there:\n\n```php\n'client_id' => ['required', 'exists:clients,id'],\n```\n\n`exists` is doing more work than it looks. Without it, someone can post `client_id=999` and either get a foreign-key error at the database level, or worse, attach the invoice to a client belonging to someone else. It turns \"this id is real\" from an assumption into a check.\n\n<b>`confirmed`</b> is the password pattern:\n\n```php\n'password' => ['required', 'confirmed', 'min:8'],\n```\n\nIt looks for a second field named `password_confirmation` and requires the two to match. The naming is a convention: `field` pairs with `field_confirmation`.\n\n---\n\n### 3. Advanced — files, and where beginners get burned\n\nFile rules look simple and hide a real security decision.\n\n```php\n'attachment' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:10240'],\n'logo'       => ['required', 'image', 'mimes:jpg,png', 'max:2048'],\n```\n\n```text\nfile    an upload arrived\nimage   it is jpg, png, bmp, gif, svg or webp\nmimes   restrict to these extensions\nmax     SIZE IN KILOBYTES, so 2048 is 2 MB\n```\n\nThat `max` unit catches everyone once. `max:2` is two kilobytes, not two megabytes.\n\nNow the part that matters. <b>`mimes` checks the file's actual content</b>, not just the name. Laravel reads the file and compares its real type against the extensions you listed. So renaming `virus.php` to `invoice.pdf` does not get past it.\n\nBut `image` includes <b>SVG</b>, and an SVG can contain JavaScript. Accepting one and serving it from your own domain gives an attacker a script running on your site. If you only need photographs, say so:\n\n```php\n'logo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],\n```\n\nTwo more worth knowing:\n\n```php\n'logo'     => ['dimensions:min_width=100,min_height=100'],\n'document' => ['mimetypes:application/pdf'],   // by MIME type, not extension\n```\n\nAnd always set a `max`. Without one your upload limit is whatever `php.ini` allows, which is rarely what you intended and is an easy way to fill a disk.",
      diagram: `max changes meaning by type

  'max:100' on a string  →  100 characters
  'max:100' on a number  →  the VALUE 100
  'max:100' on an array  →  100 items
  'max:100' on a file    →  100 KILOBYTES

  So max:2048 on an upload is 2 MB, and max:2 is 2 KB.


nullable: the rule people forget

  'notes' => ['string', 'max:500']
      empty field arrives as null → fails "string"  ✗

  'notes' => ['nullable', 'string', 'max:500']
      empty field arrives as null → skipped         ✓

  Laravel turns empty form fields into null,
  so every optional field needs nullable.


unique vs exists

  unique:invoices,number   must NOT already be there   (new invoice number)
  exists:clients,id        must ALREADY be there       (real client id)

  Without exists, client_id=999 either errors at the
  database or attaches to someone else's record.


mimes checks CONTENT, not the filename

  virus.php renamed to invoice.pdf   →  still rejected ✓

  But 'image' allows SVG, and an SVG can carry JavaScript.
  Serving one from your domain runs that script on your site.

  'image', 'mimes:jpg,jpeg,png,webp'   ← say what you mean`,
      codeExample: {
        title: "A realistic rule set",
        code: `<?php

$validated = $request->validate([

    // ---------- Presence ----------
    'number'  => ['required', 'string', 'max:20'],
    'notes'   => ['nullable', 'string', 'max:1000'],   // nullable, or an
                                                       // empty field fails
    // ---------- Types ----------
    'amount'  => ['required', 'numeric', 'min:0'],
    'count'   => ['required', 'integer', 'between:1,999'],
    'is_paid' => ['required', 'boolean'],
    'due_at'  => ['required', 'date', 'after:today'],
    'email'   => ['required', 'email', 'max:255'],
    'website' => ['nullable', 'url'],

    // ---------- A fixed set of values ----------
    'status'  => ['required', 'in:draft,sent,paid'],

    // ---------- Database checks ----------
    // Must NOT already exist:
    'number'    => ['required', 'unique:invoices,number'],
    // Must ALREADY exist. Without this, client_id=999 either errors at
    // the database or attaches to another account's client.
    'client_id' => ['required', 'exists:clients,id'],

    // ---------- Passwords ----------
    // Looks for a second field named password_confirmation.
    'password' => ['required', 'confirmed', 'min:8'],

    // ---------- Files ----------
    // max is in KILOBYTES: 10240 = 10 MB, 2048 = 2 MB.
    // mimes reads the file's real content, so renaming does not help.
    'attachment' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],

    // 'image' allows SVG, and an SVG can contain JavaScript. Naming the
    // formats you actually want avoids serving a script from your domain.
    'logo' => [
        'nullable',
        'image',
        'mimes:jpg,jpeg,png,webp',
        'max:2048',
        'dimensions:min_width=100,min_height=100',
    ],

    // By MIME type rather than extension:
    'contract' => ['nullable', 'mimetypes:application/pdf', 'max:10240'],
]);


// ---------- Other rules worth knowing ----------
// 'starts_with:INV-'      'ends_with:.pdf'
// 'regex:/^INV-[0-9]{3}$/'   (array syntax only, no pipes)
// 'different:other_field'  'same:other_field'
// 'after:2024-01-01'       'before_or_equal:due_at'
// 'digits:10'              'digits_between:8,12'
// 'lowercase'  'uppercase'  'alpha'  'alpha_num'  'alpha_dash'`,
      },
      keyTakeaways: [
        "<b>`nullable`</b> is required on every optional field, because Laravel turns empty inputs into `null`.",
        "<b>`max` changes meaning by type</b>: characters for strings, value for numbers, items for arrays, <b>kilobytes for files</b>.",
        "`in:draft,sent,paid` restricts a field to a known set of values.",
        "<b>`unique`</b> means not already present; <b>`exists`</b> means already present, and it stops forged ids.",
        "<b>`confirmed`</b> looks for `field_confirmation` and requires the two to match.",
        "<b>`mimes` inspects the file's real content</b>, so renaming an executable does not fool it.",
        "<b>`image` accepts SVG</b>, which can contain JavaScript. List the formats you actually want.",
        "Always set a `max` on uploads, or the limit is whatever `php.ini` happens to allow.",
      ],
      commonMistakes: [
        "<b>Omitting `nullable` on an optional field.</b> The empty input arrives as `null` and fails `string`, `numeric` or whatever else you attached.",
        "<b>Reading `max:2048` on a file as 2048 bytes or megabytes.</b> It is kilobytes, so 2 MB.",
        "<b>Using `max` on a number and expecting a length check.</b> `numeric|max:100` caps the value at one hundred.",
        "<b>Accepting `image` without naming formats.</b> SVG is allowed, and an SVG served from your domain can run JavaScript on your site.",
        "<b>Skipping `exists` on a foreign key.</b> A forged id either crashes at the database or attaches to another account's record.",
        "<b>Leaving uploads with no `max`.</b> Your real limit becomes a PHP setting nobody chose deliberately.",
      ],
      quiz: [
        {
          question: "Why does an optional text field need `nullable`?",
          options: [
            "For performance",
            "Laravel turns empty inputs into null, which fails rules like `string`",
            "It is required syntax",
            "To allow an empty string",
          ],
          correctIndex: 1,
          explanation: "Without it, leaving an optional field blank produces a validation error.",
        },
        {
          question: "What does `max:2048` mean on a file upload?",
          options: [
            "2048 bytes",
            "2048 megabytes",
            "2048 kilobytes, so about 2 MB",
            "2048 characters",
          ],
          correctIndex: 2,
          explanation: "The unit for files is kilobytes, which catches most people once.",
        },
        {
          question: "What is the difference between `unique` and `exists`?",
          options: [
            "They are the same",
            "`unique` only works on strings",
            "`exists` is for files",
            "`unique` must not already exist; `exists` must already exist",
          ],
          correctIndex: 3,
          explanation: "`exists` is what stops a forged foreign key reaching your database.",
        },
        {
          question: "Why is `'image'` alone risky for uploads?",
          options: [
            "It accepts SVG, which can contain JavaScript",
            "It only allows JPEG",
            "It is slow",
            "It ignores file size",
          ],
          correctIndex: 0,
          explanation: "Serving that SVG from your own domain runs the script on your site.",
        },
      ],
    },
    {
      id: "form-requests",
      title: "Form Requests, and the Validator facade",
      durationMinutes: 12,
      explanation: "Controller validation is fine until the rule list is longer than the method around it. Then it moves out.\n\n---\n\n### 1. Basic — a dedicated class\n\n```bash\nphp artisan make:request StoreInvoiceRequest\n```\n\n```php\nnamespace App\\Http\\Requests;\n\nuse Illuminate\\Foundation\\Http\\FormRequest;\n\nclass StoreInvoiceRequest extends FormRequest\n{\n    public function authorize(): bool\n    {\n        return true;\n    }\n\n    public function rules(): array\n    {\n        return [\n            'number' => ['required', 'string', 'max:20'],\n            'client' => ['required', 'string', 'max:100'],\n            'amount' => ['required', 'numeric', 'min:0'],\n        ];\n    }\n}\n```\n\nType-hint it instead of `Request`, and everything happens before your method runs:\n\n```php\npublic function store(StoreInvoiceRequest $request)\n{\n    Invoice::create($request->validated());\n\n    return redirect()->route('invoices.index');\n}\n```\n\nThree lines, and the controller says only what it does.\n\nThe mechanism is worth naming: this is the method injection from Day 6. Laravel resolves the argument, and a `FormRequest` runs `authorize()` and `rules()` during resolution. Failure throws before your code is entered, exactly as `validate()` did.\n\nNaming convention: `StoreInvoiceRequest` and `UpdateInvoiceRequest`, matching the resource actions. `php artisan make:controller InvoiceController --resource --requests` generates both.\n\n---\n\n### 2. Intermediate — the two methods do different jobs\n\n```text\nauthorize()   MAY this person do this?\nrules()       IS the submitted data acceptable?\n```\n\nThey are genuinely separate questions, and mixing them up produces confusing behaviour.\n\n```php\npublic function authorize(): bool\n{\n    return $this->user()?->can('create', Invoice::class) ?? false;\n}\n```\n\nReturning `false` gives a <b>403</b>, not a validation error. That is correct: a permission problem is not something the user can fix by editing a field.\n\nTwo things about `authorize()` catch people out.\n\nReturning `true` is not laziness by default; it means \"anyone who reached this route may submit it\", which is often right because route middleware already handled access. But leaving `true` on a request that genuinely needs a check is a silent hole, since nothing complains.\n\nAnd inside a form request, `$this` <i>is</i> the request. So `$this->user()`, `$this->route('invoice')` and `$this->input('client')` all work, which is how you write a check that depends on the record being edited.\n\n---\n\n### 3. Advanced — getting the data out, and the Validator facade\n\n```php\n$request->validated();                      // everything that passed\n$request->safe()->only(['number']);         // a subset\n$request->safe()->except(['notes']);\n$request->validated('number');              // one field\n```\n\n`validated()` is the one to reach for. Note that it returns validated fields only, which is why `Invoice::create($request->validated())` is safe in a way `$request->all()` never is.\n\nYou can also prepare input <b>before</b> the rules run:\n\n```php\nprotected function prepareForValidation(): void\n{\n    $this->merge([\n        'number' => strtoupper(trim($this->input('number', ''))),\n    ]);\n}\n```\n\nThis is the right place to normalise. Uppercase an invoice number here and your `unique` rule compares the cleaned value, rather than treating `inv-001` and `INV-001` as different.\n\nFinally, the <b>Validator facade</b>, for when neither approach fits:\n\n```php\nuse Illuminate\\Support\\Facades\\Validator;\n\n$validator = Validator::make($request->all(), [\n    'number' => ['required'],\n]);\n\nif ($validator->fails()) {\n    return back()->withErrors($validator)->withInput();\n}\n\n$validated = $validator->validated();\n```\n\nIt returns an object instead of throwing, so you decide what happens next. Use it when you need to validate something that is not the current request at all: a CSV row during an import, a payload from a queued job, data from an external API.\n\nChoosing between the three:\n\n```text\n$request->validate()   a short rule list, one place\nForm Request           a real form, reused rules, an authorize check\nValidator::make()      data that is not the current HTTP request\n```",
      diagram: `Where validation lives, as rules grow

  $request->validate([...])          Form Request
  ────────────────────────           ────────────
  short list                         long list
  used once                          reused (store + update)
  no permission check                authorize() belongs somewhere
  visible in the method              controller stays 3 lines

  Validator::make()
  ─────────────────
  data that is NOT the current request:
  a CSV row, a queue payload, an API response
  returns an object instead of throwing


authorize() and rules() answer different questions

  authorize()  MAY this person do this?   false → 403
  rules()      IS the data acceptable?    fail  → 422 / redirect

  403 is not something the user can fix by editing a field.
  Leaving authorize() as \`true\` on a request that needs a
  check is a silent hole: nothing complains.


prepareForValidation runs BEFORE the rules

  input: "  inv-001  "
            ↓ prepareForValidation
        "INV-001"
            ↓ rules, including unique:invoices,number
      compares the CLEANED value

  Without it, inv-001 and INV-001 look like different invoices.`,
      codeExample: {
        title: "A Form Request end to end",
        code: `<?php
// php artisan make:request StoreInvoiceRequest

namespace App\\Http\\Requests;

use App\\Models\\Invoice;
use Illuminate\\Foundation\\Http\\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    // MAY this person do this? Returning false gives a 403,
    // not a validation error.
    public function authorize(): bool
    {
        return $this->user()?->can('create', Invoice::class) ?? false;
    }

    // Runs BEFORE the rules. The right place to normalise input, so
    // \`unique\` compares the cleaned value rather than the raw one.
    protected function prepareForValidation(): void
    {
        $this->merge([
            'number' => strtoupper(trim($this->input('number', ''))),
            'email'  => strtolower(trim($this->input('email', ''))),
        ]);
    }

    // IS the submitted data acceptable?
    public function rules(): array
    {
        return [
            'number'    => ['required', 'string', 'max:20', 'unique:invoices,number'],
            'client_id' => ['required', 'exists:clients,id'],
            'amount'    => ['required', 'numeric', 'min:0'],
            'notes'     => ['nullable', 'string', 'max:1000'],
        ];
    }
}
?>

<?php
// app/Http/Controllers/InvoiceController.php

class InvoiceController extends Controller
{
    // Authorization and validation both happen while Laravel resolves
    // this argument, so the method body is only ever reached on success.
    public function store(StoreInvoiceRequest $request)
    {
        Invoice::create($request->validated());

        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice created.');
    }
}


// ---------- Getting the data out ----------
$request->validated();                    // everything that passed
$request->validated('number');            // one field
$request->safe()->only(['number', 'amount']);
$request->safe()->except(['notes']);

// Inside a form request, $this IS the request:
//   $this->user()            the authenticated user
//   $this->route('invoice')  a route parameter
//   $this->input('client')   submitted input
?>

<?php
// ---------- The Validator facade: data that is not the request ----------

use Illuminate\\Support\\Facades\\Validator;

foreach ($csvRows as $index => $row) {
    $validator = Validator::make($row, [
        'number' => ['required', 'string'],
        'amount' => ['required', 'numeric'],
    ]);

    if ($validator->fails()) {
        // It returns an object rather than throwing, so you decide.
        $errors[$index] = $validator->errors()->all();
        continue;
    }

    Invoice::create($validator->validated());
}`,
      },
      keyTakeaways: [
        "`php artisan make:request StoreInvoiceRequest` creates a class holding `authorize()` and `rules()`.",
        "Type-hint it instead of `Request` and both run <b>before your method body</b>, via Day 6's method injection.",
        "<b>`authorize()` answers may-they; `rules()` answers is-it-valid.</b> They are different questions.",
        "Returning `false` from `authorize()` gives a <b>403</b>, not a validation error.",
        "Leaving `authorize()` as `true` is fine when route middleware guards access, and a silent hole when it does not.",
        "Inside a form request, `$this` is the request: `$this->user()`, `$this->route(...)`, `$this->input(...)`.",
        "<b>`prepareForValidation()`</b> normalises input before the rules run, so `unique` compares the cleaned value.",
        "<b>`Validator::make()`</b> returns an object instead of throwing; use it for CSV rows, queue payloads and API data.",
      ],
      commonMistakes: [
        "<b>Leaving `authorize()` returning `true` on a request that needs a check.</b> Nothing warns you, and the endpoint is open.",
        "<b>Putting permission logic in `rules()`.</b> A permission failure becomes a field error the user cannot possibly fix.",
        "<b>Normalising input in the controller instead of `prepareForValidation()`.</b> The rules then run against the raw value, so `unique` misses near-duplicates.",
        "<b>Using `$request->all()` inside a controller that took a Form Request.</b> You did the work and then threw the result away.",
        "<b>Reaching for `Validator::make()` for ordinary form data.</b> It gives you an object to handle when `validate()` would have done it for you.",
        "<b>Sharing one request class between store and update.</b> `unique` needs to ignore the current record on update, which store must not do.",
      ],
      quiz: [
        {
          question: "When does a Form Request run its rules?",
          options: [
            "When you call `validated()`",
            "Only in middleware",
            "After the controller returns",
            "While Laravel resolves the controller argument, before your method body",
          ],
          correctIndex: 3,
          explanation: "Which is why the method body is only reached on success.",
        },
        {
          question: "What happens when `authorize()` returns false?",
          options: [
            "A 403 response",
            "A validation error",
            "A redirect to login",
            "The rules are skipped silently",
          ],
          correctIndex: 0,
          explanation: "A permission problem is not something the user can fix by editing a field.",
        },
        {
          question: "What is `prepareForValidation()` for?",
          options: [
            "Running rules twice",
            "Authorizing the request",
            "Preparing the response",
            "Normalising input before the rules run",
          ],
          correctIndex: 3,
          explanation: "So `unique` compares the cleaned value rather than the raw one.",
        },
        {
          question: "When is `Validator::make()` the right choice?",
          options: [
            "For every form",
            "When you need better performance",
            "When validating data that is not the current HTTP request",
            "Only in tests",
          ],
          correctIndex: 2,
          explanation: "A CSV row during an import, or a payload inside a queued job.",
        },
      ],
    },
    {
      id: "showing-errors",
      title: "Showing errors in Blade",
      durationMinutes: 10,
      explanation: "Validation that rejects a form and shows nothing is worse than no validation at all: the user sees the page reload with no explanation.\n\n---\n\n### 1. Basic — `$errors` is always there\n\nAfter a failed validation, Laravel redirects back and flashes the errors. In every Blade view, `$errors` is available:\n\n```blade\n@if ($errors->any())\n    <div class=\"alert alert-error\">\n        <ul>\n            @foreach ($errors->all() as $error)\n                <li>{{ $error }}</li>\n            @endforeach\n        </ul>\n    </div>\n@endif\n```\n\n`$errors` exists in <b>every</b> view, always, even when nothing failed. It is an empty `MessageBag` in that case, so `$errors->any()` is safe without any check. That is done by a middleware in the `web` group, which is why it works in `web.php` routes and not in `api.php` ones.\n\n---\n\n### 2. Intermediate — per-field errors\n\nA summary at the top is a poor experience on a long form. Put the message next to the field:\n\n```blade\n<label for=\"number\">Invoice number</label>\n\n<input id=\"number\"\n       name=\"number\"\n       value=\"{{ old('number') }}\"\n       class=\"@error('number') border-red-500 @enderror\">\n\n@error('number')\n    <p class=\"text-red-600\">{{ $message }}</p>\n@enderror\n```\n\nTwo things there.\n\n`@error` gives you `$message` inside the block, and the block only renders when that field failed. It also works inline, which is how you highlight the input itself.\n\nAnd `old('number')` refills what the user typed. Validation flashes old input automatically, so this is all that is needed. Without it the user retypes everything, which is the fastest way to make someone abandon a form.\n\nOn an edit form, remember the fallback from Day 6:\n\n```blade\nvalue=\"{{ old('number', $invoice->number) }}\"\n```\n\nUseful methods:\n\n```blade\n$errors->has('number')\n$errors->first('number')\n$errors->get('number')        {{-- all messages for the field --}}\n$errors->count()\n```\n\n---\n\n### 3. Advanced — error bags and API responses\n\nWhen one page has two forms, both post to different routes and both redirect back to the same page. Errors from either would appear on both.\n\n<b>Named error bags</b> separate them:\n\n```php\nreturn back()->withErrors($validator, 'password');\n```\n\n```blade\n@if ($errors->password->any())\n    ...\n@endif\n\n@error('current_password', 'password')\n    <p>{{ $message }}</p>\n@enderror\n```\n\nFrom a Form Request, override the bag name:\n\n```php\nprotected $errorBag = 'password';\n```\n\nWithout this, submitting the password form and failing shows the error under your profile form as well, which looks like a bug in your application.\n\nFor an API you write no Blade at all. Laravel returns the shape for you:\n\n```json\n{\n  \"message\": \"The number field is required.\",\n  \"errors\": {\n    \"number\": [\"The number field is required.\"],\n    \"amount\": [\"The amount field must be a number.\"]\n  }\n}\n```\n\n`errors` maps each field to an <b>array</b> of messages, because a field can fail several rules at once. Client code that reads `errors.number` as a string will break the first time that happens; it should read `errors.number[0]` or join them.\n\nThat plural is also why `bail`, later today, changes the response shape as well as the behaviour.",
      diagram: `$errors exists in every view, always

  validation fails
        ↓
  redirect back, errors + old input flashed
        ↓
  $errors available in EVERY Blade view
  (an empty MessageBag when nothing failed,
   so ->any() is safe with no guard)

  Provided by a middleware in the \`web\` group.
  Not present on api.php routes.


Summary vs per-field

  @if ($errors->any())          @error('number')
    list them all at the top      <p>{{ $message }}</p>
  @endif                        @enderror

  fine for a short form         better on a long one:
                                the message sits next to
                                the field that failed

  And always: value="{{ old('number') }}"
  or the user retypes the whole form.


Two forms, one page

  profile form ──┐
                 ├── both redirect back here
  password form ─┘
        ↓
  without named bags: a password error also appears
  under the profile form, and looks like a bug

  return back()->withErrors($validator, 'password');
  @error('current_password', 'password')


API shape: errors are ARRAYS

  "errors": { "number": ["required", "too long"] }
                          └─ a field can fail several rules

  errors.number     → an array, not a string
  errors.number[0]  → the first message`,
      codeExample: {
        title: "Errors in Blade, and named bags",
        code: `{{-- resources/views/invoices/create.blade.php --}}

<x-layout title="New invoice">

    {{-- A summary. Fine for a short form. --}}
    @if ($errors->any())
        <div class="alert alert-error">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('invoices.store') }}">
        @csrf

        <label for="number">Invoice number</label>
        <input id="number"
               name="number"
               {{-- old() refills what they typed; validation flashes it --}}
               value="{{ old('number') }}"
               {{-- @error works inline, to highlight the field itself --}}
               class="input @error('number') border-red-500 @enderror">

        @error('number')
            <p class="text-red-600">{{ $message }}</p>
        @enderror


        <label for="amount">Amount</label>
        <input id="amount"
               name="amount"
               value="{{ old('amount') }}"
               class="input @error('amount') border-red-500 @enderror">

        @error('amount')
            <p class="text-red-600">{{ $message }}</p>
        @enderror

        <button type="submit">Create invoice</button>
    </form>


    {{-- On an EDIT form, fall back to the model's value --}}
    {{-- value="{{ old('number', $invoice->number) }}" --}}


    {{-- ---------- Two forms on one page ---------- --}}
    {{-- Without a named bag, a password error shows under the
         profile form too, and looks like a bug. --}}

    <form method="POST" action="{{ route('profile.update') }}">
        @csrf @method('PATCH')
        <input name="name" value="{{ old('name', $user->name) }}">
        @error('name')<p>{{ $message }}</p>@enderror
    </form>

    <form method="POST" action="{{ route('password.update') }}">
        @csrf @method('PUT')
        <input type="password" name="current_password">
        {{-- second argument: the bag name --}}
        @error('current_password', 'password')<p>{{ $message }}</p>@enderror
    </form>

</x-layout>
?>

<?php
// ---------- Naming the bag ----------

// From a controller:
return back()->withErrors($validator, 'password')->withInput();

// From a Form Request:
class UpdatePasswordRequest extends FormRequest
{
    protected $errorBag = 'password';
}

// ---------- Useful on $errors ----------
// $errors->any()               anything failed?
// $errors->has('number')       did this field fail?
// $errors->first('number')     its first message
// $errors->get('number')       ALL its messages
// $errors->count()`,
      },
      keyTakeaways: [
        "<b>`$errors` is available in every Blade view</b>, always, as an empty bag when nothing failed.",
        "It is provided by a `web` group middleware, so it exists on browser routes and not on `api.php` ones.",
        "<b>`@error('field')`</b> renders only when that field failed and gives you `$message`.",
        "`@error` works inline too, which is how you add an error class to the input itself.",
        "<b>`old('field')`</b> refills what the user typed; validation flashes it automatically.",
        "On edit forms use `old('field', $model->field)` so the form is populated before any submit.",
        "<b>Named error bags</b> keep two forms on one page from showing each other's errors.",
        "In JSON, <b>each field maps to an array</b> of messages, so client code must not treat it as a string.",
      ],
      commonMistakes: [
        "<b>Validating without displaying anything.</b> The page reloads with no explanation, which is worse than no validation.",
        "<b>Forgetting `old()`.</b> The user retypes the entire form after one mistake, and usually gives up instead.",
        "<b>Guarding `$errors` with `isset()`.</b> It is always defined; `$errors->any()` is enough.",
        "<b>Expecting `$errors` on an `api.php` route.</b> The middleware that shares it is in the `web` group.",
        "<b>Two forms on one page without named bags.</b> Failing one shows errors under both, and looks like a bug in your app.",
        "<b>Reading `errors.email` as a string in JavaScript.</b> It is an array, and breaks the moment a field fails two rules.",
      ],
      quiz: [
        {
          question: "When is `$errors` available in a Blade view?",
          options: [
            "Only after a failed validation",
            "Only on POST requests",
            "Only inside `@error`",
            "Always, as an empty bag when nothing failed",
          ],
          correctIndex: 3,
          explanation: "Which is why `$errors->any()` needs no `isset()` guard.",
        },
        {
          question: "What does `@error('number')` give you inside the block?",
          options: [
            "`$errors`",
            "`$field`",
            "`$message`",
            "`$old`",
          ],
          correctIndex: 2,
          explanation: "And the block only renders when that field actually failed.",
        },
        {
          question: "Why do you need `old()` on a form input?",
          options: [
            "For validation to work",
            "To set a placeholder",
            "So the user does not retype everything after one mistake",
            "It is required by CSRF",
          ],
          correctIndex: 2,
          explanation: "Validation flashes the old input for you; `old()` reads it back.",
        },
        {
          question: "Why are named error bags useful?",
          options: [
            "They are faster",
            "They stop two forms on one page showing each other's errors",
            "They validate more strictly",
            "They enable JSON responses",
          ],
          correctIndex: 1,
          explanation: "Otherwise failing the password form shows an error under the profile form.",
        },
      ],
    },
    {
      id: "conditional-rules",
      title: "Conditional rules and Rule objects",
      durationMinutes: 12,
      explanation: "Real forms are not uniform. A field can be required only sometimes, or forbidden depending on another field.\n\n---\n\n### 1. Basic — validating only when present\n\n<b>`sometimes`</b> means: if this field was sent, validate it; if not, say nothing.\n\n```php\n'notes' => ['sometimes', 'string', 'max:1000'],\n```\n\nThe distinction from `nullable` matters and is easy to blur:\n\n```text\nnullable    the field may arrive as null\nsometimes   the field may not arrive at all\n```\n\n`sometimes` is what makes `PATCH` work. A partial update sends only the fields being changed, and every rule you wrote should apply to what <i>was</i> sent while ignoring what was not:\n\n```php\npublic function rules(): array\n{\n    return [\n        'number' => ['sometimes', 'required', 'string', 'max:20'],\n        'amount' => ['sometimes', 'required', 'numeric', 'min:0'],\n    ];\n}\n```\n\n`sometimes` plus `required` reads oddly and is exactly right: <i>if you send it, it must not be empty.</i>\n\n---\n\n### 2. Intermediate — rules that depend on other fields\n\n```php\n'company_name' => ['required_if:client_type,company'],\n'vat_number'   => ['required_with:company_name'],\n'discount'     => ['prohibited_if:client_type,individual'],\n```\n\n```text\nrequired_if:other,value      required when that field equals value\nrequired_unless:other,value  required unless it equals value\nrequired_with:a,b            required when any of those are present\nrequired_with_all:a,b        required when all of them are present\nrequired_without:a           required when that one is absent\nprohibited_if:other,value    must NOT be present in that case\n```\n\n`prohibited_if` and `prohibited_unless` are underused and genuinely valuable. They stop a field being submitted at all in a state where it should not apply, which is more precise than accepting it and ignoring it later. Ignoring it silently is how a discount ends up applied to an account that should never have had one.\n\n---\n\n### 3. Advanced — Rule objects\n\nString rules run out of road once a rule needs a variable, a comma, or a query.\n\n```php\nuse Illuminate\\Validation\\Rule;\n\n'status' => ['required', Rule::in(['draft', 'sent', 'paid'])],\n```\n\nWhich looks like more typing until the list is dynamic:\n\n```php\n'status' => ['required', Rule::in($this->allowedStatusesForUser())],\n```\n\nThe one you will genuinely need is <b>`Rule::unique()->ignore()`</b>. Consider editing an invoice without changing its number:\n\n```php\n'number' => ['required', 'unique:invoices,number'],\n```\n\nThat fails. The number already exists, in the very record being edited. The user is told their own invoice number is taken.\n\n```php\n'number' => [\n    'required',\n    Rule::unique('invoices', 'number')->ignore($this->route('invoice')),\n],\n```\n\nNow the check skips the current row. This is the single most common validation bug in Laravel applications, and it is why store and update usually need <b>separate Form Request classes</b>: the store rules must not ignore anything.\n\nMore `Rule` helpers:\n\n```php\nRule::unique('invoices')->where(fn ($q) => $q->where('client_id', $clientId)),\nRule::exists('clients', 'id')->where('account_id', auth()->user()->account_id),\nRule::requiredIf(fn () => auth()->user()->isAdmin()),\nRule::when($condition, ['required'], ['nullable']),\n```\n\nThat `Rule::exists(...)->where(...)` deserves attention. Plain `exists:clients,id` proves the client exists <i>somewhere</i>, not that it belongs to the person submitting. Scoping it to the account is what stops one customer attaching an invoice to another customer's client, which is a data-leak class of bug that plain `exists` will not catch.",
      diagram: `nullable vs sometimes

  nullable    the field may arrive as NULL
  sometimes   the field may NOT ARRIVE AT ALL

  PATCH sends only what changed, so update rules want:

    'amount' => ['sometimes', 'required', 'numeric']
                     │           │
                     │           └─ if sent, must not be empty
                     └─ but it need not be sent


The bug almost every Laravel app has had

  Editing invoice INV-001 without changing its number:

  'number' => ['required', 'unique:invoices,number']
                                  ↓
        the number exists ... in the row being edited
                                  ↓
        "The number has already been taken."
        The user is told their OWN number is taken.

  Rule::unique('invoices', 'number')->ignore($this->route('invoice'))
                                  ↓
                  skips the current row  ✓

  This is why store and update need SEPARATE request classes.


exists proves it exists SOMEWHERE

  'client_id' => ['exists:clients,id']
        client 42 is real ✓ ... but whose client is it?

  Rule::exists('clients', 'id')->where('account_id', $accountId)
        real AND yours ✓

  Plain exists will not catch one customer attaching an
  invoice to another customer's client.`,
      codeExample: {
        title: "Conditional rules, and store vs update",
        code: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;
use Illuminate\\Validation\\Rule;

// ---------- STORE: nothing to ignore ----------
class StoreInvoiceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'number' => [
                'required',
                'string',
                Rule::unique('invoices', 'number'),
            ],

            // Real AND belonging to this account. Plain exists:clients,id
            // would let someone attach an invoice to another account's client.
            'client_id' => [
                'required',
                Rule::exists('clients', 'id')
                    ->where('account_id', $this->user()->account_id),
            ],

            'status' => ['required', Rule::in(['draft', 'sent', 'paid'])],

            // Conditional on other fields
            'company_name' => ['required_if:client_type,company', 'max:100'],
            'vat_number'   => ['required_with:company_name', 'max:30'],
            'discount'     => ['prohibited_if:client_type,individual', 'numeric'],

            'notes' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ];
    }
}


// ---------- UPDATE: must ignore the current row ----------
class UpdateInvoiceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            // Without ->ignore(), saving an unchanged invoice tells the
            // user their own invoice number is already taken.
            'number' => [
                'sometimes',
                'required',
                'string',
                Rule::unique('invoices', 'number')->ignore($this->route('invoice')),
            ],

            // sometimes + required: if you send it, it must not be empty,
            // but a PATCH need not send it at all.
            'amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'status' => ['sometimes', 'required', Rule::in(['draft', 'sent', 'paid'])],
        ];
    }
}


// ---------- More Rule helpers ----------

// Unique within a scope, rather than globally
Rule::unique('invoices', 'number')->where(fn ($q) => $q->where('client_id', $id));

// Required only when a condition holds
Rule::requiredIf(fn () => $this->user()->isAdmin());

// Pick a rule set at runtime
Rule::when($isDraft, ['nullable'], ['required']);

// Dynamic list, which is where Rule::in beats the string form
Rule::in($this->allowedStatusesForUser());`,
      },
      keyTakeaways: [
        "<b>`nullable`</b> means the value may be null; <b>`sometimes`</b> means the field may be absent entirely.",
        "`['sometimes', 'required', ...]` is the correct shape for a `PATCH`: if sent, it must not be empty.",
        "`required_if`, `required_with`, `required_unless` make a field conditional on another.",
        "<b>`prohibited_if`</b> rejects a field outright rather than accepting and ignoring it.",
        "<b>`Rule::in([...])`</b> beats the string form when the allowed list is built at runtime.",
        "<b>`Rule::unique()->ignore($id)`</b> is essential on update, or saving unchanged data reports the record's own value as taken.",
        "That is why <b>store and update usually need separate Form Request classes</b>.",
        "<b>`Rule::exists()->where(...)`</b> proves a record is real <i>and</i> yours; plain `exists` only proves it is real.",
      ],
      commonMistakes: [
        "<b>Using plain `unique` on an update.</b> The record's own value counts as a duplicate, so the user is told their own invoice number is taken.",
        "<b>Sharing one request class between store and update.</b> Store must not ignore a row, and update must.",
        "<b>Confusing `nullable` and `sometimes`.</b> A PATCH with `required` and no `sometimes` rejects every field the client did not send.",
        "<b>Using plain `exists` for a foreign key in a multi-tenant app.</b> It proves the id exists, not that it belongs to this account.",
        "<b>Accepting a field that should not apply and ignoring it later.</b> `prohibited_if` rejects it up front, where the intent is visible.",
        "<b>Building a comma-separated `in:` string by hand.</b> A value containing a comma silently becomes two options.",
      ],
      quiz: [
        {
          question: "What is the difference between `nullable` and `sometimes`?",
          options: [
            "None",
            "`nullable` allows a null value; `sometimes` allows the field to be absent",
            "`sometimes` is for files",
            "`nullable` only works on strings",
          ],
          correctIndex: 1,
          explanation: "A PATCH needs `sometimes`, because it sends only the changed fields.",
        },
        {
          question: "Why does plain `unique` break an update form?",
          options: [
            "It is too slow",
            "It only works on new records",
            "It needs an index",
            "The record's own value counts as a duplicate",
          ],
          correctIndex: 3,
          explanation: "The user is told their own invoice number is already taken.",
        },
        {
          question: "What fixes that?",
          options: [
            "`Rule::unique(...)->ignore($id)`",
            "`sometimes`",
            "`nullable`",
            "`bail`",
          ],
          correctIndex: 0,
          explanation: "It excludes the current row from the uniqueness check.",
        },
        {
          question: "Why use `Rule::exists()->where('account_id', ...)` instead of plain `exists`?",
          options: [
            "It is faster",
            "Plain `exists` is deprecated",
            "Plain `exists` proves the record is real, not that it belongs to this account",
            "It allows null",
          ],
          correctIndex: 2,
          explanation: "Otherwise one customer can attach an invoice to another customer's client.",
        },
      ],
    },
    {
      id: "arrays-and-custom-rules",
      title: "Arrays, custom rules and messages",
      durationMinutes: 12,
      explanation: "The last group: validating structured data, writing your own rules, and controlling what the user reads.\n\n---\n\n### 1. Basic — arrays and wildcards\n\nAn invoice has line items, so the request contains an array of objects:\n\n```json\n{\n  \"lines\": [\n    { \"description\": \"Design\", \"quantity\": 2, \"unit_price\": 250 },\n    { \"description\": \"Hosting\", \"quantity\": 1, \"unit_price\": 50 }\n  ]\n}\n```\n\nThe `*` wildcard means \"every item\":\n\n```php\n'lines'                => ['required', 'array', 'min:1'],\n'lines.*.description'  => ['required', 'string', 'max:200'],\n'lines.*.quantity'     => ['required', 'integer', 'min:1'],\n'lines.*.unit_price'   => ['required', 'numeric', 'min:0'],\n```\n\n```text\nlines\n ├── [0] description ✓  quantity ✓  unit_price ✓\n └── [1] description ✓  quantity ✓  unit_price ✓\n```\n\nValidate the array itself as well as its items. `'array'` alone accepts an empty one, so add `min:1` when at least one line is required. And add a `max` too: without it, someone can post fifty thousand lines and your loop will dutifully process all of them.\n\nSimple nesting uses dots:\n\n```php\n'client'       => ['required', 'array'],\n'client.name'  => ['required', 'string'],\n'client.email' => ['required', 'email'],\n```\n\n---\n\n### 2. Intermediate — messages the user can act on\n\nLaravel's defaults are serviceable and often not what you want a customer to read.\n\n```php\npublic function messages(): array\n{\n    return [\n        'number.required' => 'Every invoice needs a number.',\n        'number.unique'   => 'That invoice number is already in use.',\n        'lines.min'       => 'Add at least one line item.',\n        'lines.*.quantity.min' => 'Quantities must be at least 1.',\n    ];\n}\n```\n\nThe key is `field.rule`. Wildcards work there too.\n\nWhen only the field <i>name</i> reads badly, rename it rather than rewriting every message:\n\n```php\npublic function attributes(): array\n{\n    return [\n        'client_id'          => 'client',\n        'lines.*.unit_price' => 'unit price',\n    ];\n}\n```\n\n\"The client_id field is required\" becomes \"The client field is required\", and every message for that field improves at once.\n\nPlaceholders work in your own messages:\n\n```php\n'amount.min' => 'The :attribute must be at least :min.',\n```\n\nFor messages that need translating rather than customising, the real answer is `lang/en/validation.php`, which holds the defaults and can be published per locale.\n\n---\n\n### 3. Advanced — your own rules, and `bail`\n\nA closure handles a one-off:\n\n```php\n'number' => [\n    'required',\n    function (string $attribute, mixed $value, Closure $fail) {\n        if (! str_starts_with($value, 'INV-')) {\n            $fail('The :attribute must start with INV-.');\n        }\n    },\n],\n```\n\nYou call `$fail` to reject. Returning a value does nothing.\n\nFor anything reused, make a class:\n\n```bash\nphp artisan make:rule ValidInvoiceNumber\n```\n\n```php\nclass ValidInvoiceNumber implements ValidationRule\n{\n    public function validate(string $attribute, mixed $value, Closure $fail): void\n    {\n        if (! preg_match('/^INV-\\d{3}$/', $value)) {\n            $fail('The :attribute must look like INV-001.');\n        }\n    }\n}\n```\n\n```php\n'number' => ['required', new ValidInvoiceNumber],\n```\n\nWhen a check spans several fields, `after()` runs once the normal rules have passed:\n\n```php\npublic function after(): array\n{\n    return [\n        function (Validator $validator) {\n            if ($this->input('paid_at') && ! $this->input('payment_method')) {\n                $validator->errors()->add('payment_method', 'Required when a payment date is set.');\n            }\n        },\n    ];\n}\n```\n\nFinally, <b>`bail`</b> stops checking a field after its first failure:\n\n```php\n'number' => ['bail', 'required', 'string', 'unique:invoices,number'],\n```\n\nThis is not only about tidier messages. Without `bail`, a missing `number` still runs the `unique` rule, which means <b>a database query for a value you already know is invalid</b>. On a form with several database rules, `bail` is the difference between one query and several on every failed submission.\n\nThere is a related default worth knowing: Laravel stops validating a field after `required` fails anyway, but not after other rules. `bail` makes the behaviour explicit for the whole chain.",
      diagram: `Wildcards validate every item

  'lines'               => ['required', 'array', 'min:1', 'max:100']
  'lines.*.description' => ['required', 'string']
  'lines.*.quantity'    => ['required', 'integer', 'min:1']

  lines
   ├── [0] description ✓ quantity ✓
   └── [1] description ✓ quantity ✓

  Validate the ARRAY too, not just the items:
    'array'   alone accepts an empty one
    'min:1'   at least one line
    'max:100' or someone posts 50,000 and your loop runs them all


Messages: key is field.rule

  'number.required' => 'Every invoice needs a number.'
  'lines.*.quantity.min' => 'Quantities must be at least 1.'

  Only the NAME reads badly? Rename it once instead:
    attributes(): ['client_id' => 'client']
    → every message for that field improves at once


bail is about queries, not just tidiness

  WITHOUT bail                    WITH bail
  required  ✗ fails               required  ✗ fails
  string    → still checked            ↓
  unique    → DATABASE QUERY        STOP
                for a value you
                already know is bad

  On a form with several database rules, that is
  several wasted queries on every failed submit.`,
      codeExample: {
        title: "Arrays, custom rules, messages and bail",
        code: `<?php

namespace App\\Http\\Requests;

use App\\Rules\\ValidInvoiceNumber;
use Closure;
use Illuminate\\Foundation\\Http\\FormRequest;
use Illuminate\\Validation\\Validator;

class StoreInvoiceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            // bail: stop at the first failure, so \`unique\` never runs a
            // query for a value already known to be invalid.
            'number' => ['bail', 'required', 'string', new ValidInvoiceNumber,
                         'unique:invoices,number'],

            // ---------- Nested object ----------
            'client'       => ['required', 'array'],
            'client.name'  => ['required', 'string', 'max:100'],
            'client.email' => ['required', 'email'],

            // ---------- Array of objects ----------
            // Validate the array itself as well as its items: 'array'
            // alone accepts an empty one, and without max someone can
            // post 50,000 lines.
            'lines'               => ['required', 'array', 'min:1', 'max:100'],
            'lines.*.description' => ['required', 'string', 'max:200'],
            'lines.*.quantity'    => ['required', 'integer', 'min:1'],
            'lines.*.unit_price'  => ['required', 'numeric', 'min:0'],

            // ---------- A one-off closure rule ----------
            'reference' => [
                'nullable',
                function (string $attribute, mixed $value, Closure $fail) {
                    if (str_contains($value, ' ')) {
                        $fail('The :attribute cannot contain spaces.');
                    }
                },
            ],
        ];
    }

    // Key is field.rule. Wildcards work here too.
    public function messages(): array
    {
        return [
            'number.required'      => 'Every invoice needs a number.',
            'number.unique'        => 'That invoice number is already in use.',
            'lines.min'            => 'Add at least one line item.',
            'lines.*.quantity.min' => 'Quantities must be at least 1.',
            'amount.min'           => 'The :attribute must be at least :min.',
        ];
    }

    // Fix the NAME once instead of rewriting every message for it.
    public function attributes(): array
    {
        return [
            'client_id'          => 'client',
            'lines.*.unit_price' => 'unit price',
        ];
    }

    // Runs after the normal rules: for checks spanning several fields.
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($this->input('paid_at') && ! $this->input('payment_method')) {
                    $validator->errors()->add(
                        'payment_method',
                        'A payment method is required when a payment date is set.',
                    );
                }
            },
        ];
    }
}
?>

<?php
// php artisan make:rule ValidInvoiceNumber
namespace App\\Rules;

use Closure;
use Illuminate\\Contracts\\Validation\\ValidationRule;

class ValidInvoiceNumber implements ValidationRule
{
    // Call $fail to reject. Returning a value does nothing.
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! preg_match('/^INV-\\d{3}$/', $value)) {
            $fail('The :attribute must look like INV-001.');
        }
    }
}`,
      },
      keyTakeaways: [
        "<b>`field.*`</b> validates every item in an array; `field.*.key` reaches inside each one.",
        "Validate the array itself too: `['required', 'array', 'min:1', 'max:100']`.",
        "Without a `max` on an array, someone can post tens of thousands of items and your code will process them.",
        "<b>`messages()`</b> is keyed `field.rule`, and supports `:attribute`, `:min` and other placeholders.",
        "<b>`attributes()`</b> renames a field once, improving every message that mentions it.",
        "A <b>closure rule</b> handles a one-off; call `$fail(...)` to reject, since returning does nothing.",
        "<b>`php artisan make:rule`</b> creates a reusable rule class implementing `ValidationRule`.",
        "<b>`after()`</b> runs once the normal rules pass, for checks that span several fields.",
        "<b>`bail`</b> stops at the first failure, which avoids running database rules for values already known to be invalid.",
      ],
      commonMistakes: [
        "<b>Validating `lines.*` but not `lines`.</b> An empty array passes every item rule, because there are no items.",
        "<b>Leaving an array without a `max`.</b> A huge payload is accepted and processed.",
        "<b>Returning `false` from a custom rule.</b> Only calling `$fail()` rejects; a return value is ignored.",
        "<b>Writing a message per field when the name is the problem.</b> `attributes()` fixes all of them at once.",
        "<b>Omitting `bail` on a field with database rules.</b> Every failed submit runs queries for values already known to be bad.",
        "<b>Putting a cross-field check in `rules()`.</b> It belongs in `after()`, where every field has already been validated.",
      ],
      quiz: [
        {
          question: "What does `lines.*.quantity` validate?",
          options: [
            "The quantity key inside every item of the lines array",
            "The lines array itself",
            "The first line only",
            "A field named lines.*.quantity",
          ],
          correctIndex: 0,
          explanation: "The wildcard means every item.",
        },
        {
          question: "Why validate `lines` as well as `lines.*`?",
          options: [
            "For speed",
            "`'array'` alone accepts an empty array, so item rules never run",
            "It is required syntax",
            "To allow nesting",
          ],
          correctIndex: 1,
          explanation: "Add `min:1` when at least one item is required, and `max` to cap the size.",
        },
        {
          question: "How does a custom rule reject a value?",
          options: [
            "Call `$fail(...)`",
            "Throw an exception",
            "Return false",
            "Return null",
          ],
          correctIndex: 0,
          explanation: "A return value is ignored entirely.",
        },
        {
          question: "What is the practical benefit of `bail` beyond tidier messages?",
          options: [
            "It caches results",
            "It skips authorization",
            "It validates faster in memory",
            "Database rules like `unique` never run for a value already known to be invalid",
          ],
          correctIndex: 3,
          explanation: "On a form with several database rules that is several wasted queries per failed submit.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What happens when `$request->validate()` fails?",
      options: [
        "It returns false",
        "It returns an empty array",
        "It throws a ValidationException that Laravel turns into a response",
        "It logs a warning",
      ],
      correctIndex: 2,
      explanation: "Which is why you never write an `if` around it.",
    },
    {
      question: "What status code does failed validation return to an API client?",
      options: [
        "400",
        "422",
        "500",
        "403",
      ],
      correctIndex: 1,
      explanation: "422 means the request was understood but the data is unacceptable.",
    },
    {
      question: "Why is `Model::create($request->all())` dangerous?",
      options: [
        "It is slow",
        "It skips validation",
        "Any field the client sends reaches the model, including ones you never intended",
        "It can be null",
      ],
      correctIndex: 2,
      explanation: "A form field named `is_paid=1` gets written straight to the column.",
    },
    {
      question: "What does `validate()` return on success?",
      options: [
        "Everything sent",
        "A boolean",
        "Only the fields you wrote rules for",
        "The Request",
      ],
      correctIndex: 2,
      explanation: "Which is what makes it safe to pass to `create()`.",
    },
    {
      question: "Why does an optional text field need `nullable`?",
      options: [
        "Laravel turns empty inputs into null, which fails rules like `string`",
        "Performance",
        "It is required syntax",
        "To allow an empty string",
      ],
      correctIndex: 0,
      explanation: "Otherwise leaving an optional field blank produces an error.",
    },
    {
      question: "What does `max:2048` mean on a file?",
      options: [
        "2048 bytes",
        "2048 megabytes",
        "2048 characters",
        "2048 kilobytes, about 2 MB",
      ],
      correctIndex: 3,
      explanation: "The unit for files is kilobytes.",
    },
    {
      question: "What is the difference between `unique` and `exists`?",
      options: [
        "`unique` must not already exist; `exists` must already exist",
        "They are the same",
        "`exists` is for files",
        "`unique` only works on strings",
      ],
      correctIndex: 0,
      explanation: "`exists` is what stops a forged foreign key.",
    },
    {
      question: "Why is `'image'` alone risky?",
      options: [
        "It accepts SVG, which can contain JavaScript",
        "It only allows JPEG",
        "It ignores size",
        "It is slow",
      ],
      correctIndex: 0,
      explanation: "Served from your domain, that script runs on your site.",
    },
    {
      question: "When does a Form Request run its rules?",
      options: [
        "When you call `validated()`",
        "While Laravel resolves the controller argument",
        "After the controller returns",
        "In middleware",
      ],
      correctIndex: 1,
      explanation: "So the method body is only reached on success.",
    },
    {
      question: "What happens when `authorize()` returns false?",
      options: [
        "A validation error",
        "A redirect to login",
        "A 403",
        "Rules are skipped",
      ],
      correctIndex: 2,
      explanation: "A permission problem is not fixable by editing a field.",
    },
    {
      question: "What is `prepareForValidation()` for?",
      options: [
        "Normalising input before the rules run",
        "Preparing the response",
        "Authorizing",
        "Running rules twice",
      ],
      correctIndex: 0,
      explanation: "So `unique` compares the cleaned value.",
    },
    {
      question: "When is `Validator::make()` the right tool?",
      options: [
        "For every form",
        "When validating data that is not the current HTTP request",
        "Only in tests",
        "For better performance",
      ],
      correctIndex: 1,
      explanation: "A CSV row during an import, or a queued job payload.",
    },
    {
      question: "When is `$errors` available in Blade?",
      options: [
        "Only after a failure",
        "Always, as an empty bag when nothing failed",
        "Only inside `@error`",
        "Only on POST",
      ],
      correctIndex: 1,
      explanation: "So `$errors->any()` needs no `isset()` guard.",
    },
    {
      question: "Why do you need `old()` on a form input?",
      options: [
        "For validation to work",
        "To set a placeholder",
        "For CSRF",
        "So the user does not retype everything after one mistake",
      ],
      correctIndex: 3,
      explanation: "Validation flashes the old input; `old()` reads it back.",
    },
    {
      question: "Why are named error bags useful?",
      options: [
        "They stop two forms on one page showing each other's errors",
        "Stricter validation",
        "They enable JSON",
        "Speed",
      ],
      correctIndex: 0,
      explanation: "Otherwise failing one form shows errors under the other.",
    },
    {
      question: "What is the difference between `nullable` and `sometimes`?",
      options: [
        "None",
        "`nullable` allows a null value; `sometimes` allows the field to be absent",
        "`sometimes` is for files",
        "`nullable` is for strings only",
      ],
      correctIndex: 1,
      explanation: "A PATCH needs `sometimes`, because it sends only changed fields.",
    },
    {
      question: "Why does plain `unique` break an update form?",
      options: [
        "It is slow",
        "The record's own value counts as a duplicate",
        "It needs an index",
        "It only works on new records",
      ],
      correctIndex: 1,
      explanation: "The user is told their own invoice number is taken.",
    },
    {
      question: "Why prefer `Rule::exists()->where('account_id', ...)` to plain `exists`?",
      options: [
        "Speed",
        "It allows null",
        "Plain `exists` is deprecated",
        "Plain `exists` proves the record is real, not that it belongs to this account",
      ],
      correctIndex: 3,
      explanation: "Otherwise one customer can reference another customer's records.",
    },
    {
      question: "Why validate `lines` as well as `lines.*`?",
      options: [
        "`'array'` alone accepts an empty array, so item rules never run",
        "It is required syntax",
        "For speed",
        "To allow nesting",
      ],
      correctIndex: 0,
      explanation: "Add `min:1` when at least one item is required.",
    },
    {
      question: "How does a custom rule reject a value?",
      options: [
        "Return false",
        "Throw an exception",
        "Call `$fail(...)`",
        "Return null",
      ],
      correctIndex: 2,
      explanation: "A return value is ignored.",
    },
    {
      question: "What does `attributes()` do?",
      options: [
        "Adds rules",
        "Defines the error bag",
        "Sets HTML attributes",
        "Renames a field in every message that mentions it",
      ],
      correctIndex: 3,
      explanation: "Better than rewriting each message when only the name reads badly.",
    },
    {
      question: "What is the practical benefit of `bail`?",
      options: [
        "It caches",
        "It skips authorization",
        "It validates in parallel",
        "Database rules never run for a value already known to be invalid",
      ],
      correctIndex: 3,
      explanation: "That is several wasted queries per failed submit on a form with database rules.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Put a real gate in front of the data, and show errors people can act on.",
    brief: "InvoiceHub accepts anything you type. Today it stops.\n\nThe database still arrives tomorrow, so `unique` and `exists` cannot be tested against real tables yet. Write those rules anyway and comment them with what they will do; everything else on this list works today. The Form Request classes you build now are the ones Day 9 will start saving through.",
    steps: [
      "Create `StoreInvoiceRequest` with `php artisan make:request`. Move your rules out of the controller: `number` required and matching `INV-###`, `client` required, `amount` required and numeric, `notes` nullable.",
      "Type-hint it in `store()` and delete the manual checks. The method should be down to three lines: validate, create, redirect.",
      "Add `@error` blocks and `old()` to every field in the create form, plus an error class on the input itself. Submit an empty form and confirm every field explains itself and keeps what you typed.",
      "Prove the mass-assignment point: temporarily save `$request->all()` instead of `$request->validated()`, add a hidden `<input name=\"is_paid\" value=\"1\">` to the form, and watch it get written. Then put `validated()` back.",
      "Create `UpdateInvoiceRequest` separately, with `sometimes` on each field so a partial update works, and write the `Rule::unique(...)->ignore(...)` line with a comment explaining why store must not have it.",
      "Add line items to the form and validate them with wildcards: `lines` as `required|array|min:1|max:100`, then `lines.*.description`, `lines.*.quantity` and `lines.*.unit_price`.",
      "Submit with an empty `lines` array and confirm `min:1` catches it. Then remove `min:1` and watch an empty array pass every item rule.",
      "Write a `ValidInvoiceNumber` rule class with `php artisan make:rule` and use it in place of the inline regex.",
      "Add `messages()` and `attributes()` so no customer ever reads the words `client_id` or `lines.0.unit_price`.",
      "Add an attachment field validated as `nullable|file|mimes:pdf|max:10240`. Rename a `.txt` file to `.pdf` and upload it, and confirm `mimes` rejects it by reading the content rather than the name.",
      "Add `bail` to the `number` rule and note in a comment what it saves once `unique` is hitting a real table.",
    ],
    acceptance: [
      "Submitting an empty form returns to it with a message under every field and everything you typed still there.",
      "`InvoiceController` contains no validation logic at all.",
      "A partial update succeeds without sending every field.",
      "An empty `lines` array is rejected, and you can explain why `array` alone was not enough.",
      "A `.txt` file renamed to `.pdf` is rejected on upload.",
      "No error message shown to a user contains a database column name.",
      "You have seen `$request->all()` write a field you never intended, and put `validated()` back.",
    ],
    stretch: [
      "Add a second form to the invoice page and give it a named error bag, then submit each and confirm the errors stay separate.",
      "Add an `after()` check requiring a payment method whenever a payment date is set.",
      "Point a client at your store route with `curl` and no `Accept` header, then with `Accept: application/json`, and compare the two responses.",
    ],
  },
};
