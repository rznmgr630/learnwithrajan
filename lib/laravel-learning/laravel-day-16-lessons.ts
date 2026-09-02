import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_16_LESSONS: LessonDay = {
  day: 16,
  title: "Advanced Eloquent — casts, scopes, API Resources & JSON:API",
  totalMinutes: 93,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "accessors-and-mutators",
      title: "Accessors & mutators",
      durationMinutes: 11,
      explanation: "Four days of Eloquent have been about getting data in and out. Today is about what happens to it on the way.\n\nThe question stops being <i>how do I retrieve this model</i> and becomes <i>how should this model behave</i>.\n\n---\n\n### 1. Basic — the two directions\n\n<b>An <i>accessor</i></b> transforms an attribute when you read it. <b>A <i>mutator</i></b> transforms it when you write it.\n\n```text\nwriting          reading\n───────          ───────\n$user->email =   $user->email\n     ↓                ↑\n  mutator         accessor\n     ↓                ↑\n  database         database\n```\n\nSuppose the table holds two columns and you want one value:\n\n```text\nusers\n─────\nfirst_name\nlast_name\n```\n\n```php\n$user->full_name;   // \"Rajan Magar\"\n```\n\nThere is no `full_name` column. An accessor invents it.\n\nOr the reverse: an email that should always be stored lowercase, whatever the form sent.\n\n---\n\n### 2. Intermediate — the modern syntax\n\nOlder Laravel used a method per direction, with a naming convention:\n\n```php\npublic function getFullNameAttribute()\n{\n    return \"{$this->first_name} {$this->last_name}\";\n}\n\npublic function setEmailAttribute($value)\n{\n    $this->attributes['email'] = strtolower($value);\n}\n```\n\nYou will meet those in older codebases and they still work. New code uses the `Attribute` class, which puts both directions in one method:\n\n```php\nuse Illuminate\\Database\\Eloquent\\Casts\\Attribute;\n\nprotected function fullName(): Attribute\n{\n    return Attribute::make(\n        get: fn () => \"{$this->first_name} {$this->last_name}\",\n    );\n}\n\nprotected function email(): Attribute\n{\n    return Attribute::make(\n        get: fn (string $value) => strtolower($value),\n        set: fn (string $value) => strtolower(trim($value)),\n    );\n}\n```\n\nThe naming rule from Day 14 still holds: <b>a camelCase method becomes a snake_case property.</b> `fullName()` gives you `$user->full_name`.\n\nThe closure receives the stored value as its first argument, and all the model's raw attributes as its second when you need them.\n\n---\n\n### 3. Advanced — where it goes wrong, and the alternative\n\nThree things worth knowing before you reach for one.\n\n<b>A mutator only runs on assignment.</b> `$user->email = '...'` goes through it; `User::where(...)->update(['email' => '...'])` does not, because no model is involved. That is the mass-operation warning from Day 14 again, and it means a mutator is a convenience, never a guarantee.\n\n<b>An accessor cannot be queried.</b> `$user->full_name` exists in PHP and nowhere in SQL, so `where('full_name', 'Rajan Magar')` fails. If you need to search on it, it has to be a real column, or a database expression.\n\n<b>And an accessor that touches a relationship is an N+1</b>, especially once it is in `$appends`. Yesterday's lesson, in a different disguise.\n\nAn accessor can be cached when it is expensive:\n\n```php\nreturn Attribute::make(\n    get: fn () => $this->expensiveCalculation(),\n)->shouldCache();\n```\n\nFinally, the distinction that decides which tool you want, since the next lesson is about casts:\n\n```text\naccessor / mutator          cast\n──────────────────          ────\none attribute, one model    a type, reusable across models\nusually presentation        usually the value's real type\nfull_name from two columns  a JSON column that is an array\nformatting a phone number   a boolean that is a boolean\n```\n\n<b>If you are describing what the value <i>is</i>, that is a cast. If you are describing how it should <i>look</i>, that is an accessor.</b>",
      diagram: `Two directions

  writing                    reading
  ───────                    ───────
  \$user->email = '...'       \$user->email
        ↓                          ↑
     mutator                   accessor
        ↓                          ↑
     database                  database


An accessor invents a value that is not a column

  users
  ─────
  first_name        \$user->full_name  →  "Rajan Magar"
  last_name

  protected function fullName(): Attribute
  {
      return Attribute::make(
          get: fn () => \$this->first_name . ' ' . \$this->last_name,
      );
  }

  camelCase method  →  snake_case property


Old and new

  old   getFullNameAttribute()      still works, you will meet it
        setEmailAttribute(\$value)

  new   protected function email(): Attribute
        {
            return Attribute::make(
                get: fn (\$value) => strtolower(\$value),
                set: fn (\$value) => strtolower(trim(\$value)),
            );
        }

  One method, both directions.


Three things that catch people

  1. A mutator only runs on ASSIGNMENT.
     \$user->email = '...'                    ✓ runs
     User::where(...)->update([...])          ✗ no model, no mutator
     A convenience, never a guarantee.

  2. An accessor cannot be QUERIED.
     \$user->full_name exists in PHP, not in SQL.
     where('full_name', ...) fails.

  3. An accessor that touches a relationship is an N+1,
     and in \$appends it runs for every model in every response.


Accessor or cast?

  accessor / mutator            cast
  ──────────────────            ────
  one attribute, one model      a type, reusable
  how it should LOOK            what the value IS
  full_name from two columns    a JSON column that is an array
  formatting a phone number     a boolean that is a boolean`,
      codeExample: {
        title: "Reading and writing through an Attribute",
        code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Casts\\Attribute;
use Illuminate\\Database\\Eloquent\\Model;

class User extends Model
{
    // ---------- Read only: a value with no column ----------

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->first_name} {$this->last_name}",
        );
    }

    // ---------- Read and write ----------

    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => strtolower($value),
            set: fn (string $value) => strtolower(trim($value)),
        );
    }

    // ---------- The second argument: all raw attributes ----------

    protected function address(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) =>
                $attributes['street'] . ', ' . $attributes['city'],
        );
    }

    // ---------- Cache an expensive one ----------

    protected function reportSummary(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->buildSummary(),
        )->shouldCache();
    }
}


<?php
// ---------- Using them ----------

$user = User::findOrFail(1);

$user->full_name;                    // "Rajan Magar"

$user->email = '  RAJAN@Example.com ';
$user->email;                        // "rajan@example.com"
$user->save();


<?php
// ---------- The old syntax, for older codebases ----------

public function getFullNameAttribute()
{
    return "{$this->first_name} {$this->last_name}";
}

public function setEmailAttribute($value)
{
    $this->attributes['email'] = strtolower($value);
}


<?php
// ---------- What accessors and mutators cannot do ----------

// ❌ A mutator only runs on assignment. No model here, so no mutator.
User::where('id', 1)->update(['email' => 'RAJAN@EXAMPLE.COM']);

// ❌ full_name is not a column, so the database has never heard of it.
User::where('full_name', 'Rajan Magar')->get();

// ✓ Search the real columns instead.
User::where('first_name', 'Rajan')->where('last_name', 'Magar')->get();

// ❌ An accessor that queries, appended, is an N+1 per response.
protected function postCount(): Attribute
{
    return Attribute::make(get: fn () => $this->posts()->count());
}`,
      },
      keyTakeaways: [
        "<b>An accessor transforms an attribute when you read it; a mutator transforms it when you write it.</b>",
        "An accessor can invent a value with no column behind it, such as `full_name` from two columns.",
        "<b>Modern Laravel uses one `Attribute` method with `get:` and `set:` closures</b>, replacing the old `getXAttribute` pair.",
        "A camelCase method becomes a snake_case property, so `fullName()` gives `$user->full_name`.",
        "The `get:` closure receives the stored value, and all raw attributes as a second argument.",
        "<b>A mutator only runs on assignment</b>, so a mass update bypasses it entirely.",
        "<b>An accessor cannot be queried</b>, because the database has never heard of it.",
        "An accessor that touches a relationship is an N+1, and worse once it is in `$appends`.",
        "<b>Describing what a value <i>is</i> means a cast; describing how it should <i>look</i> means an accessor.</b>",
      ],
      commonMistakes: [
        "<b>Filtering on an accessor.</b> `where('full_name', ...)` fails, because there is no such column.",
        "<b>Relying on a mutator for data integrity.</b> A mass update writes straight past it.",
        "<b>Naming the method in snake_case.</b> `full_name()` will not become `$user->full_name`; `fullName()` will.",
        "<b>Using an accessor where a cast belongs.</b> A boolean or a JSON column is a type, not a presentation choice.",
        "<b>Appending an accessor that runs a query.</b> Every model in every response pays for it.",
      ],
      quiz: [
        {
          question: "What does an accessor do?",
          options: [
            "Validates an attribute before saving",
            "Transforms an attribute when you read it",
            "Adds a database column",
            "Hides an attribute from JSON",
          ],
          correctIndex: 1,
          explanation: "A mutator is the write-side equivalent.",
        },
        {
          question: "You define `protected function fullName(): Attribute`. How do you read it?",
          options: ["`$user->fullName`", "`$user->full_name`", "`$user->getFullName()`", "`$user->fullname`"],
          correctIndex: 1,
          explanation: "camelCase method, snake_case property.",
        },
        {
          question: "Why does `User::where('id', 1)->update(['email' => 'X@Y.COM'])` skip the email mutator?",
          options: [
            "Mutators only run on create",
            "No model is loaded, so no mutator runs",
            "`update()` bypasses `$fillable`",
            "It does run",
          ],
          correctIndex: 1,
          explanation: "A mutator is a convenience on assignment, never a guarantee.",
        },
        {
          question: "When should you use a cast rather than an accessor?",
          options: [
            "When the value needs formatting for display",
            "When you are describing what the value actually is, such as a boolean or an array",
            "Casts are always better",
            "When the attribute is hidden",
          ],
          correctIndex: 1,
          explanation: "Type belongs in a cast; presentation belongs in an accessor.",
        },
      ],
    },
    {
      id: "casting-and-enums",
      title: "Casts — arrays, collections, enums & encryption",
      durationMinutes: 12,
      explanation: "Day 14 introduced `casts()` for booleans and dates. This is the rest of it, and one cast in particular changes how you model your domain.\n\n---\n\n### 1. Basic — the built-in casts\n\n```php\nprotected function casts(): array\n{\n    return [\n        'is_admin'     => 'boolean',\n        'age'          => 'integer',\n        'balance'      => 'decimal:2',\n        'settings'     => 'array',\n        'published_at' => 'datetime',\n    ];\n}\n```\n\n```text\ndatabase value  →  casts()  →  PHP value\n```\n\nThe `array` cast is the one you will use most. A JSON column becomes an array on read and JSON on write, including when you change it:\n\n```php\n$user->settings['theme'] = 'dark';\n$user->save();          // encoded back to JSON for you\n```\n\nOne caution: you cannot modify a single key in place on some setups, because the cast returns a fresh array each time. The safe pattern is to take the whole array, change it, and assign it back:\n\n```php\n$settings = $user->settings;\n$settings['theme'] = 'dark';\n$user->settings = $settings;\n```\n\n<b>`collection` is the same as `array` but gives you a Laravel collection</b>, so `$user->settings->get('theme')` and every collection method work.\n\n---\n\n### 2. Intermediate — enum casts\n\nThis is the one worth slowing down for.\n\nA status column holds a string, so your code fills with string comparisons:\n\n```php\nif ($order->status === 'paid') { ... }\n```\n\nEvery one of those is a place a typo compiles fine and silently never matches. And nothing anywhere states what the valid statuses are.\n\nA PHP enum states them once:\n\n```php\nenum OrderStatus: string\n{\n    case Pending   = 'pending';\n    case Paid      = 'paid';\n    case Cancelled = 'cancelled';\n}\n```\n\n```php\nprotected function casts(): array\n{\n    return ['status' => OrderStatus::class];\n}\n```\n\nNow:\n\n```php\n$order->status === OrderStatus::Paid;\n$order->status = OrderStatus::Cancelled;\n```\n\n```text\nstring comparison            enum comparison\n────────────────            ───────────────\n'paid'                      OrderStatus::Paid\ntypo compiles, never matches typo is an error\nvalid values are nowhere    valid values are the enum\nno autocomplete             autocomplete everywhere\n```\n\nAnd because an enum is a class, behaviour can live on it:\n\n```php\npublic function label(): string\n{\n    return match ($this) {\n        self::Pending => 'Awaiting payment',\n        self::Paid    => 'Paid',\n        self::Cancelled => 'Cancelled',\n    };\n}\n```\n\n<b>That is the step from storing a string to modelling a domain.</b>\n\n---\n\n### 3. Advanced — encryption, and the costs\n\n```php\n'secret' => 'encrypted',\n'notes'  => 'encrypted:array',\n```\n\nLaravel encrypts on write and decrypts on read, using your `APP_KEY`.\n\nTwo consequences that decide whether you can use it. <b>An encrypted column cannot be searched</b>, because every row's ciphertext is different, so no `where`, no index, no sorting. And <b>losing `APP_KEY` means losing the data</b>, permanently.\n\nSo encrypt what you must store and never query: an API token, a note, an answer to a security question. Not an email you need to look people up by.\n\nThe hashed cast is different and often what people actually want:\n\n```php\n'password' => 'hashed',\n```\n\nThat is one-way. You can check a value against it, never read it back, and it is the right choice for a password.\n\nThe full set worth knowing:\n\n```text\nboolean  integer  float  string\narray  collection  object  json\ndate  datetime  immutable_datetime  timestamp\ndecimal:2  encrypted  encrypted:array  hashed\nAppEnum::class\n```\n\nOne last thing, since casts and accessors overlap. Both run on the model, so both are bypassed by mass operations, and neither can be used in a `where`. Casting a column to an enum does not stop the database holding an invalid string; only a check constraint or careful writes do that.",
      diagram: `The built-in casts

  database value  →  casts()  →  PHP value

  boolean  integer  float  string
  array  collection  object  json
  date  datetime  immutable_datetime  timestamp
  decimal:2  encrypted  encrypted:array  hashed
  AppEnum::class


The array cast, and its one gotcha

  'settings' => 'array'       JSON column ↔ PHP array

  ❌ \$user->settings['theme'] = 'dark';    may not stick
  ✓ \$settings = \$user->settings;
    \$settings['theme'] = 'dark';
    \$user->settings = \$settings;

  'collection' is the same, but you get a Laravel
  collection: \$user->settings->get('theme')


The enum cast: from string to domain

  enum OrderStatus: string {
      case Pending = 'pending';
      case Paid = 'paid';
      case Cancelled = 'cancelled';
  }

  'status' => OrderStatus::class

  string comparison              enum comparison
  ────────────────               ───────────────
  \$order->status === 'paid'      \$order->status === OrderStatus::Paid
  a typo compiles and never      a typo is an error
  matches
  valid values are nowhere       valid values ARE the enum
  no autocomplete                autocomplete everywhere

  And behaviour can live on the enum:

  public function label(): string {
      return match (\$this) { ... };
  }


encrypted: two consequences

  'secret' => 'encrypted'

  ⚠️  cannot be searched — every row's ciphertext differs,
      so no where, no index, no sort
  ⚠️  lose APP_KEY, lose the data, permanently

  Encrypt what you must store and never query.
  Not an email you look people up by.

  'password' => 'hashed'    one-way: check it, never read it


  Casts run on the MODEL. So, like accessors:
    bypassed by mass updates
    invisible to the database
  Casting to an enum does not stop the column
  holding an invalid string.`,
      codeExample: {
        title: "Every cast worth knowing",
        code: `<?php

namespace App\\Models;

use App\\Enums\\OrderStatus;
use Illuminate\\Database\\Eloquent\\Model;

class Order extends Model
{
    protected function casts(): array
    {
        return [
            // Types
            'is_paid'   => 'boolean',
            'quantity'  => 'integer',
            'total'     => 'decimal:2',

            // JSON columns
            'meta'      => 'array',        // PHP array
            'options'   => 'collection',   // Laravel collection

            // Dates
            'placed_at'   => 'datetime',
            'delivery_on' => 'date',

            // Domain
            'status'    => OrderStatus::class,

            // Sensitive
            'api_token' => 'encrypted',
            'password'  => 'hashed',
        ];
    }
}


<?php
// ---------- The enum ----------

namespace App\\Enums;

enum OrderStatus: string
{
    case Pending   = 'pending';
    case Paid      = 'paid';
    case Cancelled = 'cancelled';

    // Behaviour lives on the enum, not scattered through views.
    public function label(): string
    {
        return match ($this) {
            self::Pending   => 'Awaiting payment',
            self::Paid      => 'Paid',
            self::Cancelled => 'Cancelled',
        };
    }

    public function isFinal(): bool
    {
        return $this === self::Paid || $this === self::Cancelled;
    }
}


<?php
// ---------- Using them ----------

$order = Order::findOrFail(1);

$order->total;          // a decimal string with 2 places
$order->placed_at->diffForHumans();

// ❌ Comparing strings: a typo compiles and never matches.
if ($order->status === 'paied') { }

// ✓ A typo here is an error your editor catches.
if ($order->status === OrderStatus::Paid) { }

$order->status->label();       // "Paid"
$order->status = OrderStatus::Cancelled;
$order->save();                // 'cancelled' goes to the database


// ---------- JSON columns ----------

$order->meta['source'];              // read

// Take it, change it, put it back.
$meta = $order->meta;
$meta['source'] = 'api';
$order->meta = $meta;
$order->save();

$order->options->get('gift_wrap');   // 'collection' cast


// ---------- Encryption ----------

$order->api_token = 'secret-value';
$order->save();                      // stored encrypted
$order->api_token;                   // decrypted on read

// ❌ Cannot be searched: every row's ciphertext is different.
Order::where('api_token', 'secret-value')->first();

// ⚠️ Lose APP_KEY and this column is unreadable forever.`,
      },
      keyTakeaways: [
        "<b>`casts()` converts a stored value into the PHP type you actually want</b>, on read and on write.",
        "<b>The `array` cast turns a JSON column into a PHP array</b>, and `collection` gives you a Laravel collection instead.",
        "Change a JSON column by taking the array, editing it and assigning it back, rather than in place.",
        "<b>Casting a column to a PHP enum replaces string comparisons with type-checked ones</b>, so a typo becomes an error.",
        "An enum is also the one place that states every valid value, and behaviour such as a label can live on it.",
        "<b>`encrypted` encrypts on write and decrypts on read</b>, using `APP_KEY`.",
        "<b>An encrypted column cannot be searched, indexed or sorted</b>, and losing `APP_KEY` loses the data.",
        "`hashed` is one-way and is the right cast for a password.",
        "<b>Casts run on the model</b>, so mass updates bypass them and the database still accepts an invalid value.",
      ],
      commonMistakes: [
        "<b>Modifying a JSON attribute key in place.</b> Take the array, change it, assign it back.",
        "<b>Encrypting a column you need to search.</b> Every ciphertext differs, so no `where` will ever match.",
        "<b>Using `encrypted` for a password.</b> A password should be `hashed`, which is one-way.",
        "<b>Assuming an enum cast validates the database.</b> A mass update can still write an invalid string.",
        "<b>Comparing an enum-cast attribute to a string.</b> It is an enum instance now, not `'paid'`.",
      ],
      quiz: [
        {
          question: "What does the `collection` cast give you that `array` does not?",
          options: [
            "Encryption",
            "A Laravel collection object with all its methods",
            "Automatic validation",
            "A database index",
          ],
          correctIndex: 1,
          explanation: "Same JSON column, richer object.",
        },
        {
          question: "Why cast a status column to a PHP enum?",
          options: [
            "It makes queries faster",
            "A typo becomes an error, and the enum states every valid value in one place",
            "It adds a database constraint",
            "It encrypts the column",
          ],
          correctIndex: 1,
          explanation: "String comparisons fail silently; enum comparisons do not.",
        },
        {
          question: "What can you not do with an `encrypted` column?",
          options: [
            "Read it back",
            "Search, index or sort by it",
            "Store JSON in it",
            "Cast it",
          ],
          correctIndex: 1,
          explanation: "Every row's ciphertext is different, so no `where` matches.",
        },
        {
          question: "Which cast belongs on a password column?",
          options: ["`encrypted`", "`hashed`", "`string`", "`encrypted:array`"],
          correctIndex: 1,
          explanation: "Hashing is one-way: you check a value against it, never read it back.",
        },
      ],
    },
    {
      id: "custom-casts-and-value-objects",
      title: "Custom casts & value objects",
      durationMinutes: 11,
      explanation: "The built-in casts cover types. This covers <i>your</i> types.\n\n---\n\n### 1. Basic — the problem a value object solves\n\nA money column is stored as a decimal:\n\n```text\nbalance = \"1500.50\"\n```\n\nSo every place that touches money re-invents the same handling. Formatting it in three views, rounding it in two services, and one place that adds a float to it and produces `1500.4999999`.\n\n<b>A <i>value object</i></b> (a small class representing a value, with the behaviour that belongs to it) puts that in one place:\n\n```php\n$user->balance instanceof Money;\n\n$user->balance->format();      // \"£1,500.50\"\n$user->balance->add($other);\n$user->balance->isNegative();\n```\n\nThe database still holds a decimal. The model hands you a `Money`.\n\n---\n\n### 2. Intermediate — writing the cast\n\n<b>A <i>custom cast</i></b> is a class with two methods, one for each direction:\n\n```php\nuse Illuminate\\Contracts\\Database\\Eloquent\\CastsAttributes;\n\nclass MoneyCast implements CastsAttributes\n{\n    public function get($model, string $key, $value, array $attributes): Money\n    {\n        return Money::fromString($value);\n    }\n\n    public function set($model, string $key, $value, array $attributes): mixed\n    {\n        return $value->toString();\n    }\n}\n```\n\n```php\nprotected function casts(): array\n{\n    return ['balance' => MoneyCast::class];\n}\n```\n\n```text\ndatabase          get()          your code\n\"1500.50\"    →    Money      →   $user->balance->format()\n\nyour code         set()          database\nMoney        →    \"1500.50\"  →   the column\n```\n\n`get()` receives the raw column value; `set()` returns what should be stored. Return an array from `set()` when one object spans several columns:\n\n```php\nreturn [\n    'amount'   => $value->amount,\n    'currency' => $value->currency,\n];\n```\n\nWhich is how an `Address` object maps onto `street`, `city` and `country` columns while your code sees one thing.\n\n---\n\n### 3. Advanced — Castable, and when this is worth it\n\nA cast class per value object gets repetitive. <b>`Castable`</b> lets the value object supply its own:\n\n```php\nclass Address implements Castable\n{\n    public static function castUsing(array $arguments): string\n    {\n        return AddressCast::class;\n    }\n}\n```\n\n```php\nprotected function casts(): array\n{\n    return ['address' => Address::class];\n}\n```\n\nThe model now names the concept rather than the machinery, and the class owns how it is stored. That matters when the same object appears on several models.\n\nBefore you build one, though, it is worth being honest about the cost. A custom cast adds a class, an object allocation per attribute per model, and a layer somebody has to read.\n\n```text\nWorth it when                     Not worth it when\n────────────                      ─────────────────\nthe value has real behaviour      you only need formatting\nit appears on several models      it appears once\ngetting it wrong causes bugs      an accessor would do\n  money, coordinates, ranges        a display name\n```\n\nThe test: <b>if the behaviour lives on the value rather than the model, it wants to be a value object.</b> Money knows how to add itself to money. A date range knows whether it overlaps another. A full name does not know anything, so it is just an accessor.\n\nOne performance note. A cast runs for every model loaded, so an expensive constructor multiplied by a thousand rows is a thousand constructions. Keep value objects cheap to build, and remember that `->shouldCache()` from the last lesson exists for the accessor case.",
      diagram: `The problem

  balance = "1500.50"       a decimal in the database

  ...so money handling scatters:
    formatted in three views
    rounded in two services
    one place adds a float and produces 1500.4999999

  A value object gathers it:

  \$user->balance instanceof Money

  \$user->balance->format()
  \$user->balance->add(\$other)
  \$user->balance->isNegative()

  The database still holds a decimal.


A custom cast is two methods

  class MoneyCast implements CastsAttributes
  {
      public function get(...): Money    { ... }
      public function set(...): mixed    { ... }
  }

  database          get()          your code
  "1500.50"    →    Money      →   ->format()

  your code         set()          database
  Money        →    "1500.50"  →   the column

  set() may return an ARRAY when one object
  spans several columns:

  return ['street' => ..., 'city' => ..., 'country' => ...];

  One Address object, three columns.


Castable: the object supplies its own cast

  class Address implements Castable {
      public static function castUsing(array \$args): string {
          return AddressCast::class;
      }
  }

  'address' => Address::class

  The model names the concept.
  The class owns how it is stored.


Worth it, or not

  Worth it when                    Not worth it when
  ────────────                     ─────────────────
  the value has real behaviour     you only need formatting
  it appears on several models     it appears once
  getting it wrong causes bugs     an accessor would do
    money, coordinates, ranges       a display name

  Test: does the behaviour live on the VALUE or the model?

    Money knows how to add itself to money.       → value object
    A date range knows if it overlaps another.    → value object
    A full name knows nothing.                    → accessor

  And keep them cheap: a cast runs for every model loaded.`,
      codeExample: {
        title: "A value object, its cast, and the Castable shortcut",
        code: `<?php
// ---------- The value object ----------

namespace App\\Values;

final class Money
{
    public function __construct(
        public readonly int $cents,
        public readonly string $currency = 'GBP',
    ) {}

    public static function fromString(string $value): self
    {
        return new self((int) round(((float) $value) * 100));
    }

    public function toString(): string
    {
        return number_format($this->cents / 100, 2, '.', '');
    }

    // The behaviour that would otherwise be scattered.
    public function add(self $other): self
    {
        return new self($this->cents + $other->cents, $this->currency);
    }

    public function isNegative(): bool
    {
        return $this->cents < 0;
    }

    public function format(): string
    {
        return '£' . number_format($this->cents / 100, 2);
    }
}


<?php
// ---------- The cast ----------

namespace App\\Casts;

use App\\Values\\Money;
use Illuminate\\Contracts\\Database\\Eloquent\\CastsAttributes;
use Illuminate\\Database\\Eloquent\\Model;

class MoneyCast implements CastsAttributes
{
    // Database → PHP
    public function get(
        Model $model,
        string $key,
        mixed $value,
        array $attributes,
    ): ?Money {
        return $value === null ? null : Money::fromString($value);
    }

    // PHP → database
    public function set(
        Model $model,
        string $key,
        mixed $value,
        array $attributes,
    ): mixed {
        return $value?->toString();
    }
}


<?php
// ---------- On the model ----------

class Account extends Model
{
    protected function casts(): array
    {
        return ['balance' => MoneyCast::class];
    }
}

$account = Account::findOrFail(1);

$account->balance->format();          // "£1,500.50"
$account->balance = $account->balance->add(new Money(500));
$account->save();                     // stored as "1505.50"


<?php
// ---------- One object across several columns ----------

class AddressCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): Address
    {
        return new Address(
            $attributes['street'],
            $attributes['city'],
            $attributes['country'],
        );
    }

    // Returning an array writes several columns at once.
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        return [
            'street'  => $value->street,
            'city'    => $value->city,
            'country' => $value->country,
        ];
    }
}


<?php
// ---------- Castable: the value object names its own cast ----------

namespace App\\Values;

use Illuminate\\Contracts\\Database\\Eloquent\\Castable;

class Address implements Castable
{
    public static function castUsing(array $arguments): string
    {
        return \\App\\Casts\\AddressCast::class;
    }
}

// The model now reads as the concept, not the machinery:
protected function casts(): array
{
    return ['address' => Address::class];
}`,
      },
      keyTakeaways: [
        "<b>A value object is a small class representing a value, carrying the behaviour that belongs to it.</b>",
        "It gathers logic that would otherwise scatter across views and services.",
        "<b>A custom cast implements `CastsAttributes` with a `get()` and a `set()`</b>, one for each direction.",
        "`get()` receives the raw column value; `set()` returns what should be stored.",
        "<b>Returning an array from `set()` writes several columns</b>, so one object can map onto `street`, `city` and `country`.",
        "<b>`Castable` lets the value object name its own cast</b>, so the model reads as the concept.",
        "<b>Use one when the behaviour lives on the value rather than the model</b>: money, coordinates, date ranges.",
        "An accessor is enough when you only need formatting, or when the value appears once.",
        "A cast runs for every model loaded, so keep value objects cheap to construct.",
      ],
      commonMistakes: [
        "<b>Building a value object for a display string.</b> An accessor does that with no extra class.",
        "<b>Forgetting to handle `null` in `get()` and `set()`.</b> A nullable column will hit it.",
        "<b>Doing expensive work in the constructor.</b> It runs once per attribute per model, on every query.",
        "<b>Returning the object itself from `set()`.</b> It must return what the database should store.",
        "<b>Scattering money formatting through views instead of onto the object.</b> That is the problem the object exists to fix.",
      ],
      quiz: [
        {
          question: "What two methods does a custom cast implement?",
          options: ["`read()` and `write()`", "`get()` and `set()`", "`from()` and `to()`", "`cast()` and `uncast()`"],
          correctIndex: 1,
          explanation: "`get()` is database to PHP; `set()` is PHP to database.",
        },
        {
          question: "How does one value object map onto three database columns?",
          options: [
            "It cannot",
            "`set()` returns an array of column names and values",
            "By defining three casts",
            "Using `$appends`",
          ],
          correctIndex: 1,
          explanation: "Which is how an Address covers street, city and country.",
        },
        {
          question: "What does implementing `Castable` on a value object do?",
          options: [
            "Makes it serialisable",
            "Lets the model reference the value object directly, while the class names its own cast",
            "Encrypts it",
            "Registers it globally",
          ],
          correctIndex: 1,
          explanation: "The model names the concept, not the machinery.",
        },
        {
          question: "When is a value object worth the extra class?",
          options: [
            "Whenever a column needs formatting",
            "When the behaviour belongs to the value itself, such as money adding to money",
            "On every model",
            "Only for JSON columns",
          ],
          correctIndex: 1,
          explanation: "If the value knows nothing, an accessor is enough.",
        },
      ],
    },
    {
      id: "local-scopes",
      title: "Local query scopes",
      durationMinutes: 10,
      explanation: "The same `where` clause, written in eleven places, is a bug waiting for somebody to change the rule.\n\n---\n\n### 1. Basic — naming a condition\n\n```php\nPost::where('published', true)->get();\n```\n\nThat line appears in the controller, the sitemap, the feed, the search, the widget. Then \"published\" comes to mean `published = true AND published_at <= now()`, and you have to find all eleven.\n\n<b>A <i>local scope</i></b> (a reusable, named query condition on a model) gives the rule one home:\n\n```php\nclass Post extends Model\n{\n    public function scopePublished($query)\n    {\n        return $query->where('published', true);\n    }\n}\n```\n\n```php\nPost::published()->get();\n```\n\nThe method is prefixed with `scope`, and you call it without the prefix. Change the definition once and every caller follows.\n\nAnd because a scope is just a query, they chain with everything else:\n\n```php\nPost::published()\n    ->where('author_id', $id)\n    ->orderByDesc('created_at')\n    ->paginate(20);\n```\n\n---\n\n### 2. Intermediate — arguments, and reading well\n\nA scope can take parameters after the query:\n\n```php\npublic function scopeOfType($query, string $type)\n{\n    return $query->where('type', $type);\n}\n```\n\n```php\nPost::ofType('tutorial')->get();\n```\n\nModern Laravel also supports an attribute instead of the prefix:\n\n```php\nuse Illuminate\\Database\\Eloquent\\Attributes\\Scope;\n\n#[Scope]\nprotected function published(Builder $query): void\n{\n    $query->where('published', true);\n}\n```\n\nEither works. The `scope` prefix is what you will see in most codebases.\n\nThe real gain is that <b>the query starts reading like the domain</b>:\n\n```text\nPost::where('published', true)\n    ->where('published_at', '<=', now())\n    ->whereNull('deleted_at')\n    ->where('type', 'tutorial')\n\nPost::published()->ofType('tutorial')\n```\n\nThe second one can be read by somebody who does not know the schema, and cannot drift out of step with the first.\n\n---\n\n### 3. Advanced — the details that matter\n\n<b>Return `$query`, or return nothing.</b> Both work, because the builder is modified in place, but be consistent within a codebase.\n\n<b>Scopes and `orWhere` do not mix without care.</b> A scope adding two conditions, followed by an `orWhere`, produces the ungrouped `(A AND B) OR C` from Day 13. If a scope might be combined with an `or`, group inside it:\n\n```php\npublic function scopeActive($query)\n{\n    return $query->where(function ($q) {\n        $q->where('status', 'active')->orWhere('status', 'trial');\n    });\n}\n```\n\n<b>A scope can use another scope</b>, which is how a small vocabulary composes:\n\n```php\npublic function scopeVisible($query)\n{\n    return $query->published()->notArchived();\n}\n```\n\nAnd a scope is a query, not a filter on a loaded collection. `$user->posts->published()` will fail; `$user->posts()->published()->get()` is the version that works, which is the property-versus-method distinction from Day 15 again.\n\nWhen to write one:\n\n```text\nWrite a scope when                  Leave it inline when\n──────────────────                  ────────────────────\nthe condition has a name            it is a one-off\n  published, overdue, recent\nit appears more than twice          it is specific to one screen\nthe rule might change               it reads fine as it is\n```\n\n<b>The name is the point.</b> If you cannot name the condition in a word or two, it probably is not a concept yet.",
      diagram: `The problem a scope solves

  Post::where('published', true)->get();

  ...in the controller, the sitemap, the feed,
  the search, the widget.

  Then "published" starts meaning
      published = true AND published_at <= now()

  Now find all eleven.


A scope gives the rule one home

  public function scopePublished(\$query)
  {
      return \$query->where('published', true);
  }

  Post::published()->get();

  Defined with the scope prefix. Called without it.
  Change the definition once; every caller follows.

  With arguments:

  public function scopeOfType(\$query, string \$type)
  Post::ofType('tutorial')->get();


The query starts reading like the domain

  Post::where('published', true)
      ->where('published_at', '<=', now())
      ->whereNull('deleted_at')
      ->where('type', 'tutorial')

  Post::published()->ofType('tutorial')

  The second can be read by someone who does not
  know the schema, and cannot drift out of step.


Details that matter

  Scopes chain with everything, and with each other:

    public function scopeVisible(\$query) {
        return \$query->published()->notArchived();
    }

  ⚠️  Scopes and orWhere: a scope adding two conditions
      followed by an orWhere gives (A AND B) OR C.
      Group inside the scope if it might meet an or.

  A scope is a QUERY, not a collection filter:

    \$user->posts->published()      ✗
    \$user->posts()->published()    ✓


  Write a scope when                Leave it inline when
  ──────────────────                ────────────────────
  the condition has a name          it is a one-off
  it appears more than twice        it is specific to one screen
  the rule might change             it reads fine as it is

  If you cannot name it in a word or two,
  it is probably not a concept yet.`,
      codeExample: {
        title: "Scopes that build a small vocabulary",
        code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Builder;
use Illuminate\\Database\\Eloquent\\Model;

class Post extends Model
{
    // ---------- The classic form ----------

    public function scopePublished($query)
    {
        return $query->where('published', true)
            ->where('published_at', '<=', now());
    }

    public function scopeNotArchived($query)
    {
        return $query->whereNull('archived_at');
    }

    // ---------- With arguments ----------

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeCreatedAfter($query, $date)
    {
        return $query->where('created_at', '>=', $date);
    }

    // ---------- Scopes composing scopes ----------

    public function scopeVisible($query)
    {
        return $query->published()->notArchived();
    }

    // ---------- Grouped, so an orWhere cannot escape ----------

    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->where('status', 'active')
              ->orWhere('status', 'trial');
        });
    }

    // ---------- The attribute form ----------

    // #[Scope]
    // protected function recent(Builder $query): void
    // {
    //     $query->where('created_at', '>=', now()->subWeek());
    // }
}


<?php
// ---------- Using them ----------

Post::published()->get();

Post::visible()
    ->ofType('tutorial')
    ->createdAfter(now()->subMonth())
    ->orderByDesc('published_at')
    ->paginate(20);

// Compare with the version that spells everything out:
Post::where('published', true)
    ->where('published_at', '<=', now())
    ->whereNull('archived_at')
    ->where('type', 'tutorial')
    ->where('created_at', '>=', now()->subMonth())
    ->orderByDesc('published_at')
    ->paginate(20);


// ---------- On a relationship ----------

// ❌ A collection has no published() method.
$user->posts->published();

// ✓ The method gives you the builder.
$user->posts()->published()->get();

// And inside a whereHas, from yesterday:
User::whereHas('posts', fn ($q) => $q->published())->get();`,
      },
      keyTakeaways: [
        "<b>A local scope is a named, reusable query condition</b> defined on the model.",
        "Define it as `scopePublished($query)` and call it as `Post::published()`, without the prefix.",
        "<b>It gives a rule one home</b>, so changing the definition updates every caller.",
        "Scopes take arguments after the query, so `scopeOfType($query, $type)` becomes `ofType('tutorial')`.",
        "Modern Laravel also supports a `#[Scope]` attribute instead of the prefix.",
        "<b>Scopes chain with each other and with everything else</b>, which builds a small vocabulary for the model.",
        "<b>A scope adding two conditions followed by an `orWhere` produces `(A AND B) OR C`</b>, so group inside it.",
        "<b>A scope is a query, not a collection filter</b>, so use `$user->posts()->published()`, with the parentheses.",
        "Write one when the condition has a name and appears more than twice; leave a one-off inline.",
      ],
      commonMistakes: [
        "<b>Calling a scope on a loaded collection.</b> `$user->posts->published()` has no such method.",
        "<b>Including the `scope` prefix at the call site.</b> It is `Post::published()`, not `Post::scopePublished()`.",
        "<b>Combining a multi-condition scope with `orWhere`.</b> The `or` escapes the group unless the scope brackets it.",
        "<b>Writing a scope for a condition used once.</b> The indirection costs more than it saves.",
        "<b>Naming a scope after the columns rather than the concept.</b> `scopeWherePublishedTrue` explains nothing.",
      ],
      quiz: [
        {
          question: "How do you call a scope defined as `scopePublished()`?",
          options: [
            "`Post::scopePublished()`",
            "`Post::published()`",
            "`Post::scope('published')`",
            "`Post::query()->scopePublished()`",
          ],
          correctIndex: 1,
          explanation: "Defined with the prefix, called without it.",
        },
        {
          question: "What problem do local scopes solve?",
          options: [
            "Slow queries",
            "The same condition being written in many places, so a rule change means finding them all",
            "Missing indexes",
            "N+1 queries",
          ],
          correctIndex: 1,
          explanation: "One definition, and every caller follows it.",
        },
        {
          question: "Why does `$user->posts->published()` fail?",
          options: [
            "Scopes only work on static calls",
            "That is a loaded collection, not a query builder; use `$user->posts()`",
            "The scope needs an argument",
            "Relationships cannot use scopes",
          ],
          correctIndex: 1,
          explanation: "The property gives models; the method gives the builder.",
        },
        {
          question: "A scope adds two conditions and the caller adds `orWhere`. What happens?",
          options: [
            "The scope groups automatically",
            "You get `(A AND B) OR C`, which is usually not what was meant",
            "The `orWhere` is ignored",
            "An error is thrown",
          ],
          correctIndex: 1,
          explanation: "Group inside the scope if it might meet an `or`.",
        },
      ],
    },
    {
      id: "global-scopes",
      title: "Global scopes & pending attributes",
      durationMinutes: 11,
      explanation: "A local scope is applied when you ask for it. A global scope is applied whether you ask or not, which makes it powerful and easy to regret.\n\n---\n\n### 1. Basic — a condition on every query\n\n<b>A <i>global scope</i></b> (a condition automatically added to every query for a model) is something you have already used. Soft deletes from Day 14 are a global scope adding `WHERE deleted_at IS NULL`.\n\nYour own:\n\n```php\nclass User extends Model\n{\n    protected static function booted(): void\n    {\n        static::addGlobalScope('active', function ($query) {\n            $query->where('active', true);\n        });\n    }\n}\n```\n\nNow every query for a `User` carries it:\n\n```php\nUser::all();          // WHERE active = 1\nUser::find(1);        // WHERE active = 1, so an inactive user is null\nUser::count();        // active users only\n$post->user;          // and through relationships too\n```\n\n```text\nLocal scope             Global scope\n───────────             ────────────\napplied when asked      applied always\nPost::published()       every query, everywhere\nvisible at the call     invisible at the call\n```\n\nThat last line is the whole trade-off.\n\n---\n\n### 2. Intermediate — taking it off\n\nSooner or later something needs the full table:\n\n```php\nUser::withoutGlobalScope('active')->get();\nUser::withoutGlobalScopes()->get();          // all of them\n```\n\nWhich is exactly what `withTrashed()` does for soft deletes.\n\nThe places that need this are predictable:\n\n```text\nadmin dashboards\nreports and exports\nbackground jobs\ndata migrations\n```\n\nA class-based scope is tidier for anything real, and gives you a name to remove:\n\n```php\nclass ActiveScope implements Scope\n{\n    public function apply(Builder $builder, Model $model): void\n    {\n        $builder->where('active', true);\n    }\n}\n\n// on the model\n#[ScopedBy([ActiveScope::class])]\nclass User extends Model {}\n```\n\nand `User::withoutGlobalScope(ActiveScope::class)`.\n\n---\n\n### 3. Advanced — when it is a good idea\n\nA global scope is invisible. Somebody writes `User::count()`, gets 240, and the database has 900 rows. Nothing at the call site explains the difference, and the person debugging it has no reason to look at the model.\n\nSo the honest guidance:\n\n```text\nGood global scope                 Bad global scope\n─────────────────                 ────────────────\nsoft deletes                      \"active\" users\nmulti-tenancy: current tenant     \"published\" posts\nsomething that is ALWAYS true     something usually true\n  in every context                  but not always\n```\n\n<b>The test: would seeing the excluded rows ever be correct?</b> For soft deletes, essentially never, so a global scope is right. For active users, an admin screen needs them, a report needs them, an export needs them, and now every one of those must remember to opt out. That is a local scope wearing the wrong clothes.\n\nMulti-tenancy is the strongest case. Every query in the application should be limited to the current tenant, and a query that forgets is a data leak, so making it automatic is the point.\n\nOne related feature, on the other side of the same problem. When new records through a relationship should always carry a value, <b>`withAttributes()`</b> applies it:\n\n```php\n$user->posts()\n    ->withAttributes(['published' => true])\n    ->create(['title' => 'Laravel']);\n```\n\nThe created post gets `published = true` without you passing it. It also constrains queries through that relationship, so it reads as \"this user's published posts\" in both directions.",
      diagram: `Local vs global

  Local scope             Global scope
  ───────────             ────────────
  applied when asked      applied ALWAYS
  Post::published()       every query, everywhere
  visible at the call     invisible at the call

  You have used one already: soft deletes add
  WHERE deleted_at IS NULL to every query.


Defining one

  protected static function booted(): void
  {
      static::addGlobalScope('active', function (\$query) {
          \$query->where('active', true);
      });
  }

  User::all()      WHERE active = 1
  User::find(1)    an inactive user comes back null
  User::count()    active only
  \$post->user      through relationships too


Taking it off

  User::withoutGlobalScope('active')->get();
  User::withoutGlobalScopes()->get();

  Which is exactly what withTrashed() does.

  Predictably needed by:
    admin dashboards
    reports and exports
    background jobs
    data migrations


The judgement

  Somebody writes User::count(), gets 240,
  and the table has 900 rows. Nothing at the
  call site explains the difference.

  Good global scope              Bad global scope
  ─────────────────              ────────────────
  soft deletes                   "active" users
  multi-tenancy                  "published" posts
  ALWAYS true, everywhere        usually true, but not always

  Test: would seeing the excluded rows ever be correct?

    soft deletes    → essentially never   → global
    active users    → admin, reports,
                      exports all need
                      them                → local

  Multi-tenancy is the strongest case: a query that
  forgets the tenant is a data leak, so make it automatic.


The other side: pending attributes

  \$user->posts()
      ->withAttributes(['published' => true])
      ->create(['title' => 'Laravel']);

  The new post gets published = true without passing it,
  and the relationship reads as "this user's published
  posts" in both directions.`,
      codeExample: {
        title: "Global scopes, and how to get out of them",
        code: `<?php
// ---------- The quick form ----------

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class User extends Model
{
    protected static function booted(): void
    {
        static::addGlobalScope('active', function ($query) {
            $query->where('active', true);
        });
    }
}

User::all();       // WHERE active = 1
User::find(1);     // null if that user is inactive
User::count();     // active only


// ---------- Getting out ----------

User::withoutGlobalScope('active')->get();
User::withoutGlobalScopes()->get();

// An admin screen, a report, an export and a job
// all need one of these. That is the warning sign.


<?php
// ---------- The class form, for anything real ----------

namespace App\\Models\\Scopes;

use Illuminate\\Database\\Eloquent\\Builder;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if ($tenantId = auth()->user()?->tenant_id) {
            $builder->where('tenant_id', $tenantId);
        }
    }
}


<?php
// ---------- Attaching it ----------

namespace App\\Models;

use App\\Models\\Scopes\\TenantScope;
use Illuminate\\Database\\Eloquent\\Attributes\\ScopedBy;
use Illuminate\\Database\\Eloquent\\Model;

// The strongest case for a global scope: a query that
// forgets the tenant is a data leak.
#[ScopedBy([TenantScope::class])]
class Invoice extends Model
{
}

Invoice::withoutGlobalScope(TenantScope::class)->get();


<?php
// ---------- Pending attributes on a relationship ----------

class User extends Model
{
    public function publishedPosts()
    {
        return $this->hasMany(Post::class)
            ->withAttributes(['published' => true]);
    }
}

// Constrains the query:
$user->publishedPosts;    // WHERE published = 1

// ...and fills the attribute on create:
$user->publishedPosts()->create(['title' => 'Laravel']);
// published = true, without passing it

// One-off, at the call site:
$user->posts()
    ->withAttributes(['published' => true])
    ->create(['title' => 'Laravel']);`,
      },
      keyTakeaways: [
        "<b>A global scope is added to every query for a model</b>, whether the caller asks or not.",
        "Soft deletes are a global scope, adding `WHERE deleted_at IS NULL`.",
        "Register one in `booted()` with `addGlobalScope()`, or as a class attached with `#[ScopedBy]`.",
        "<b>It applies through relationships too</b>, so `$post->user` is filtered as well.",
        "<b>`withoutGlobalScope('name')` removes one and `withoutGlobalScopes()` removes all</b>, which is what `withTrashed()` does.",
        "<b>A global scope is invisible at the call site</b>, so a wrong count has nothing explaining it.",
        "<b>Use one only when seeing the excluded rows would never be correct</b>: soft deletes, multi-tenancy.",
        "\"Active\" or \"published\" belong in local scopes, because admin screens, reports and exports all need the rest.",
        "<b>`withAttributes()` sets values on models created through a relationship</b> and constrains queries through it.",
      ],
      commonMistakes: [
        "<b>Making \"active\" or \"published\" a global scope.</b> Every admin screen, report and job then has to opt out.",
        "<b>Debugging a wrong count without checking the model.</b> A global scope explains nothing at the call site.",
        "<b>Forgetting that global scopes apply through relationships.</b> `$post->user` is filtered too.",
        "<b>Using an anonymous global scope you later need to remove.</b> A class gives you a name to pass to `withoutGlobalScope()`.",
        "<b>Writing a tenant filter by hand in every query.</b> The one query that forgets is a data leak.",
      ],
      quiz: [
        {
          question: "What is a global scope?",
          options: [
            "A scope shared between models",
            "A condition added automatically to every query for a model",
            "A scope defined in a service provider",
            "A scope that applies to the whole application",
          ],
          correctIndex: 1,
          explanation: "Soft deletes are the one you have already been using.",
        },
        {
          question: "How do you query without a named global scope?",
          options: [
            "`User::all(false)`",
            "`User::withoutGlobalScope('active')`",
            "`User::raw()`",
            "You cannot",
          ],
          correctIndex: 1,
          explanation: "`withoutGlobalScopes()` removes all of them at once.",
        },
        {
          question: "Which is the strongest case for a global scope?",
          options: [
            "Published posts",
            "Active users",
            "Limiting every query to the current tenant",
            "Recent records",
          ],
          correctIndex: 2,
          explanation: "A query that forgets the tenant is a data leak, so make it automatic.",
        },
        {
          question: "What does `withAttributes(['published' => true])` on a relationship do?",
          options: [
            "Hides the attribute from JSON",
            "Constrains queries through the relationship and sets the value on models created through it",
            "Casts the attribute",
            "Validates the attribute",
          ],
          correctIndex: 1,
          explanation: "It works in both directions: reading and creating.",
        },
      ],
    },
    {
      id: "eloquent-collections",
      title: "Eloquent collections & custom collection classes",
      durationMinutes: 10,
      explanation: "Every Eloquent query hands back a collection, and it is not the same collection you get from `collect()`.\n\n---\n\n### 1. Basic — what you actually have\n\n```php\n$users = User::all();\n```\n\nThat is an `Illuminate\\Database\\Eloquent\\Collection`, which extends Laravel's base collection. So everything you know still works:\n\n```php\n$users->filter(fn ($u) => $u->active);\n$users->map(fn ($u) => $u->name);\n$users->pluck('email');\n$users->groupBy('role');\n$users->sortBy('name');\n$users->each(fn ($u) => $u->notify(...));\n```\n\nA few worth knowing if you have not met them: `pluck()` for one column, `keyBy()` to index by a field, `partition()` to split on a condition, and `sum()` / `avg()` for arithmetic.\n\nBut none of that is Eloquent-specific.\n\n---\n\n### 2. Intermediate — the methods that know about models\n\nAn Eloquent collection understands that its contents are models:\n\n```php\n$users->find($id);        // by primary key, without another query\n$users->modelKeys();      // [1, 5, 9]\n$users->fresh();          // reload them all from the database\n$users->load('posts');    // eager load, from Day 15\n$users->loadMissing('posts');\n$users->only([1, 2]);     // by key\n$users->except([3]);\n$users->contains($user);  // compares the model, not the object\n```\n\nAnd on individual models:\n\n```php\n$user->is($other);\n$user->isNot($other);\n```\n\n<b>`find()` on a collection is worth calling out.</b> It searches what you already have, so it costs nothing, where `User::find($id)` is another query. In a loop over ids you already fetched, that is the difference between one query and fifty.\n\nOne trap: <b>a collection method runs in PHP, a query method runs in the database.</b>\n\n```text\nUser::where('active', true)->get()      the database filters, 240 rows returned\nUser::all()->where('active', true)     900 rows fetched, then PHP filters\n```\n\nBoth give the same answer. Only one of them is sensible. Filter in the query whenever the condition can be expressed there.\n\n---\n\n### 3. Advanced — a collection of your own\n\nWhen the same collection logic keeps appearing, give the model its own collection class:\n\n```php\nuse Illuminate\\Database\\Eloquent\\Collection;\n\nclass UserCollection extends Collection\n{\n    public function active(): static\n    {\n        return $this->filter(fn ($user) => $user->active);\n    }\n\n    public function totalBalance(): int\n    {\n        return $this->sum(fn ($user) => $user->balance->cents);\n    }\n}\n```\n\nand tell the model to use it:\n\n```php\nclass User extends Model\n{\n    public function newCollection(array $models = []): UserCollection\n    {\n        return new UserCollection($models);\n    }\n}\n```\n\n```php\n$users = User::all();\n\n$users->active();\n$users->totalBalance();\n```\n\n```text\nscope                    collection method\n─────                    ─────────────────\nruns in the database     runs in PHP\nnarrows what you fetch   works on what you fetched\nUser::active()->get()    $users->active()\n```\n\n<b>They are not alternatives.</b> A scope is how you avoid fetching rows you do not want. A collection method is for work on rows you already have, especially work the database cannot do: formatting, grouping into a shape for a view, or arithmetic across value objects.\n\nWhen the same `->filter(...)->map(...)->groupBy(...)` chain appears in three controllers, that is the signal. Until then, the chain in place reads perfectly well.",
      diagram: `What a query returns

  User::all()   →   Illuminate\\Database\\Eloquent\\Collection

  extends Laravel's base collection, so:

    filter  map  pluck  groupBy  sortBy  each
    keyBy  partition  sum  avg  chunk


Plus methods that know about models

  \$users->find(\$id)        by primary key, NO extra query
  \$users->modelKeys()      [1, 5, 9]
  \$users->fresh()          reload from the database
  \$users->load('posts')    eager load, after the fact
  \$users->only([1, 2])     by key
  \$users->contains(\$user)  compares the model, not the object

  \$user->is(\$other)  /  \$user->isNot(\$other)

  find() on a collection searches what you already have.
  In a loop over ids you fetched, that is one query
  instead of fifty.


The trap: PHP or the database?

  User::where('active', true)->get()
      the database filters, 240 rows come back

  User::all()->where('active', true)
      900 rows fetched, then PHP filters

  Same answer. Only one is sensible.
  Filter in the query whenever the condition fits there.


A collection of your own

  class UserCollection extends Collection {
      public function active(): static { ... }
      public function totalBalance(): int { ... }
  }

  class User extends Model {
      public function newCollection(array \$models = []) {
          return new UserCollection(\$models);
      }
  }

  \$users = User::all();
  \$users->active();


  scope                     collection method
  ─────                     ─────────────────
  runs in the DATABASE      runs in PHP
  narrows what you fetch    works on what you fetched
  User::active()->get()     \$users->active()

  Not alternatives. A scope avoids fetching rows.
  A collection method does what the database cannot:
  formatting, shaping for a view, value-object arithmetic.

  Signal to extract one: the same filter/map/groupBy
  chain in three controllers.`,
      codeExample: {
        title: "Collections that understand models",
        code: `<?php

use App\\Models\\User;

$users = User::all();   // Eloquent\\Collection, not a plain array


// ---------- Everything from the base collection ----------

$users->filter(fn ($u) => $u->active);
$users->map(fn ($u) => $u->name);
$users->pluck('email');
$users->keyBy('id');
$users->groupBy('role');
$users->sortByDesc('created_at');
$users->partition(fn ($u) => $u->active);   // [active, inactive]


// ---------- Methods that know these are models ----------

$users->find(5);            // searches what you have, no query
$users->modelKeys();        // [1, 5, 9]
$users->only([1, 2]);       // by primary key
$users->except([3]);
$users->contains($user);    // compares the model, not the object
$users->fresh();            // reload them all
$users->load('posts');      // eager load after the fact
$users->loadMissing('profile');
$users->loadCount('posts');


// ---------- The trap ----------

// ✓ The database filters. 240 rows come back.
User::where('active', true)->get();

// ❌ 900 rows fetched, then PHP throws most of them away.
User::all()->where('active', true);


// ---------- find() in a loop ----------

// ❌ One query per id.
foreach ($ids as $id) {
    $user = User::find($id);
}

// ✓ One query, then in-memory lookups.
$users = User::findMany($ids);

foreach ($ids as $id) {
    $user = $users->find($id);
}


<?php
// ---------- A custom collection ----------

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Collection;

class UserCollection extends Collection
{
    public function active(): static
    {
        return $this->filter(fn ($user) => $user->active);
    }

    // Work the database cannot do: arithmetic across value objects.
    public function totalBalance(): int
    {
        return $this->sum(fn ($user) => $user->balance->cents);
    }

    // Shaping for a view.
    public function groupedByCountry(): Collection
    {
        return $this->groupBy(fn ($user) => $user->address->country);
    }
}


<?php
// ---------- Telling the model to use it ----------

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class User extends Model
{
    public function newCollection(array $models = []): UserCollection
    {
        return new UserCollection($models);
    }
}

$users = User::all();

$users->active();
$users->totalBalance();
$users->groupedByCountry();`,
      },
      keyTakeaways: [
        "<b>An Eloquent query returns an `Eloquent\\Collection`</b>, which extends Laravel's base collection.",
        "Every base method works: `filter`, `map`, `pluck`, `groupBy`, `sortBy`, `keyBy`, `partition`.",
        "<b>Eloquent collections add model-aware methods</b>: `find()`, `modelKeys()`, `fresh()`, `load()`, `only()`, `contains()`.",
        "<b>`find()` on a collection searches what you already have</b>, with no extra query.",
        "<b>A collection method runs in PHP; a query method runs in the database.</b>",
        "`User::all()->where(...)` fetches every row and then discards most of them, so filter in the query.",
        "<b>A custom collection class holds repeated collection logic</b>, returned from the model's `newCollection()`.",
        "<b>Scopes and collection methods are not alternatives</b>: one narrows what you fetch, the other works on what you fetched.",
        "Extract a collection method when the same chain appears in several places, not before.",
      ],
      commonMistakes: [
        "<b>Calling `->where()` on a collection when you meant the query.</b> Every row is fetched first.",
        "<b>Using `User::find()` inside a loop.</b> Fetch once with `findMany()` and use the collection's `find()`.",
        "<b>Assuming a scope works on a collection.</b> Scopes are query methods.",
        "<b>Building a custom collection for one method used once.</b> The chain in place reads fine.",
        "<b>Doing arithmetic in PHP that the database could do.</b> `withSum()` beats summing a loaded collection.",
      ],
      quiz: [
        {
          question: "What does `User::all()` return?",
          options: [
            "A PHP array",
            "An `Eloquent\\Collection` of models",
            "A query builder",
            "A base `Collection` of arrays",
          ],
          correctIndex: 1,
          explanation: "It extends the base collection and adds model-aware methods.",
        },
        {
          question: "What is wrong with `User::all()->where('active', true)`?",
          options: [
            "Nothing",
            "It fetches every row and filters in PHP, instead of letting the database filter",
            "`where()` does not exist on collections",
            "It returns arrays, not models",
          ],
          correctIndex: 1,
          explanation: "Same answer, far more work.",
        },
        {
          question: "What does `$users->find(5)` do differently from `User::find(5)`?",
          options: [
            "Nothing",
            "It searches the already-loaded collection, with no extra query",
            "It throws when missing",
            "It returns an array",
          ],
          correctIndex: 1,
          explanation: "In a loop over ids you already fetched, that is one query instead of fifty.",
        },
        {
          question: "When should logic be a scope rather than a collection method?",
          options: [
            "When it formats values",
            "When the condition can be expressed in SQL, so you fetch fewer rows",
            "Always",
            "When it involves value objects",
          ],
          correctIndex: 1,
          explanation: "Collection methods are for work on rows you already have.",
        },
      ],
    },
    {
      id: "serialization-and-api-resources",
      title: "Serialization & API Resources",
      durationMinutes: 14,
      explanation: "Returning a model from a controller works. That is the problem.\n\n---\n\n### 1. Basic — what a model gives you\n\n```php\n$user->toArray();\n$user->toJson();\n\nreturn $user;      // Laravel calls toJson() for you\n```\n\n```json\n{\"id\": 1, \"name\": \"Rajan\", \"email\": \"rajan@example.com\"}\n```\n\nThe controls from Day 14 shape it:\n\n```text\n$hidden    keep attributes out\n$visible   allow only these\n$appends   add computed ones\ncasts()    decide their types\n```\n\nDates need a decision too. Eloquent serialises them in ISO 8601, and you can change that:\n\n```php\nprotected function serializeDate(DateTimeInterface $date)\n{\n    return $date->format('Y-m-d H:i:s');\n}\n```\n\nBefore you do, be sure. <b>ISO 8601 with a timezone is what every client can parse.</b> A format of your own means every consumer writes a parser, and one of them gets the timezone wrong. Pick a format once, in UTC, and keep it across the whole API.\n\n---\n\n### 2. Intermediate — why models are not API responses\n\nReturning the model directly ties your API to your schema. Which sounds abstract until it happens:\n\n```text\nyou add a column          it appears in the API\nyou rename a column       every client breaks\nyou add a sensitive       it leaks until somebody\n  column                    remembers $hidden\nyou need a field the      you cannot, without\n  API should shape          changing the database\n```\n\nEvery migration becomes an API change, and nothing anywhere says what the API returns.\n\n<b>An <i>API Resource</i></b> (a class that turns a model into its API representation) puts a layer between them:\n\n```text\nDatabase Model\n      ↓\nAPI Resource\n      ↓\nJSON response\n```\n\n```bash\nphp artisan make:resource UserResource\n```\n\n```php\nclass UserResource extends JsonResource\n{\n    public function toArray(Request $request): array\n    {\n        return [\n            'id'    => $this->id,\n            'name'  => $this->name,\n            'email' => $this->email,\n        ];\n    }\n}\n```\n\n```php\nreturn new UserResource($user);\nreturn UserResource::collection($users);\n```\n\nNow the API contract is one file you can read, and a new column changes nothing until you decide it should.\n\nBy default the output is wrapped:\n\n```json\n{ \"data\": { \"id\": 1, \"name\": \"Rajan\" } }\n```\n\nand `public static $wrap = 'user';` changes the key. Return a paginated result through a resource collection and you get `meta` and `links` for free, which is the pagination from Day 13 arriving in the response.\n\n---\n\n### 3. Advanced — conditionals, and the one that matters\n\nA field only some callers should see:\n\n```php\n'email' => $this->when($request->user()?->isAdmin(), $this->email),\n```\n\nWhen the condition is false the key is <i>absent</i>, not null. That is usually what you want, and worth knowing when a client asks why the key vanished.\n\nAnd the important one:\n\n```php\n'posts' => PostResource::collection($this->whenLoaded('posts')),\n```\n\n<b>`whenLoaded()` includes the relationship only if the controller eager loaded it.</b> Without it, a resource that serialises a relationship triggers a query per model, and you have built an N+1 into your API where nobody will look for it.\n\n```text\nUser::with('posts')->get()      →  resource includes posts\nUser::all()->get()              →  resource omits them, silently\n                                   and runs no extra queries\n```\n\nThis is why yesterday's `Model::preventLazyLoading()` and `whenLoaded()` belong together: one makes the mistake impossible, the other makes the correct version easy.\n\nThe rest of the family:\n\n```text\nwhen($condition, $value)          include if true\nwhenLoaded('relation')            include if eager loaded\nwhenNotNull($value)               include if not null\nwhenCounted('posts')              include a withCount result\nmergeWhen($condition, [...])      several keys at once\n```\n\nAnd metadata, when a response needs more than the records:\n\n```php\nreturn UserResource::collection($users)->additional([\n    'meta' => ['version' => 'v1'],\n]);\n```\n\n`with()` is the other half of that pair, and it lives on the resource rather than the call site:\n\n```php\npublic function with(Request $request): array\n{\n    return ['meta' => ['version' => 'v1']];\n}\n```\n\n<b>Use `additional()` when the metadata depends on the request, and `with()` when it is true of every response from that resource.</b>\n\nAnd `::collection()` does not return the class you might assume. It returns an <i>AnonymousResourceCollection</i>, which is fine until the collection itself needs behaviour:\n\n```bash\nphp artisan make:resource UserCollection\n```\n\n```php\nclass UserCollection extends ResourceCollection\n{\n    public function toArray(Request $request): array\n    {\n        return [\n            'data'         => $this->collection,\n            'total_active' => $this->collection->where('active', true)->count(),\n        ];\n    }\n}\n```\n\n<b>Reach for a named collection class when the response needs something the individual records cannot express</b>: an aggregate, a summary, a count across the whole set. Otherwise `::collection()` is the right answer and a named class is ceremony.\n\nThe distinction to leave with:\n\n```text\nModel        the database and domain representation\nResource     the API representation\n```\n\n<b>Do not confuse those two.</b> They change for different reasons and at different times, and keeping them separate is what lets your schema evolve without breaking anybody.",
      diagram: `What a model gives you

  \$user->toArray()   \$user->toJson()   return \$user;

  shaped by the Day 14 controls:

    \$hidden    keep attributes out
    \$visible   allow only these
    \$appends   add computed ones
    casts()    decide their types

  Dates: Eloquent serialises ISO 8601. Keep it.
  A format of your own means every consumer writes
  a parser, and one gets the timezone wrong.


Why a model is not an API response

  you add a column        →  it appears in the API
  you rename a column     →  every client breaks
  you add a sensitive     →  it leaks until somebody
    column                   remembers \$hidden
  the API needs a         →  you cannot, without
    different shape          changing the database

  Every migration becomes an API change, and nothing
  anywhere states what the API returns.


  Database Model
        ↓
  API Resource          ← the contract, in one readable file
        ↓
  JSON response

  return new UserResource(\$user);
  return UserResource::collection(\$users);

  wrapped as { "data": ... }, or \$wrap = 'user'
  paginated collections get meta and links for free


Conditionals

  when(\$cond, \$value)         include if true
  whenLoaded('posts')         include if EAGER LOADED
  whenNotNull(\$value)         include if not null
  whenCounted('posts')        include a withCount result
  mergeWhen(\$cond, [...])     several keys at once

  A false condition OMITS the key. It is absent, not null.


whenLoaded is the important one

  'posts' => PostResource::collection(\$this->whenLoaded('posts'))

  User::with('posts')->get()   →  posts included
  User::all()                  →  posts omitted, no queries

  Without it, a resource that touches a relationship runs
  a query per model — an N+1 inside your API, where
  nobody thinks to look.

  preventLazyLoading() makes the mistake impossible.
  whenLoaded() makes the correct version easy.


Metadata, two ways

  ->additional(['meta' => [...]])
      per call — when it depends on the request

  public function with(Request \$request): array
      on the resource — when it is true of every
      response from it


::collection() returns an AnonymousResourceCollection

  Fine, until the collection ITSELF needs behaviour:

    php artisan make:resource UserCollection
    class UserCollection extends ResourceCollection

  Reach for a named class when the response needs
  something the individual records cannot express —
  an aggregate, a summary, a count across the set.

  Otherwise ::collection() is right, and a named class
  is ceremony.


  Model     →  the database and domain representation
  Resource  →  the API representation

  They change for different reasons. Keep them apart.`,
      codeExample: {
        title: "From model to API contract",
        code: `<?php
// ---------- What the model does on its own ----------

$user->toArray();
$user->toJson();

return $user;      // Laravel serialises it

// Shaped by $hidden, $visible, $appends and casts().

// Changing date serialisation, if you must:
protected function serializeDate(DateTimeInterface $date)
{
    return $date->format('Y-m-d H:i:s');
}
// ISO 8601 in UTC is what every client can already parse.


<?php
// ---------- The resource ----------

// php artisan make:resource UserResource

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'created_at' => $this->created_at,

            // Only for admins. False means the key is ABSENT.
            'email' => $this->when(
                $request->user()?->isAdmin(),
                $this->email,
            ),

            // Only if the controller eager loaded it.
            'posts' => PostResource::collection(
                $this->whenLoaded('posts')
            ),

            // Only if the query asked for the count.
            'post_count' => $this->whenCounted('posts'),

            // Several keys at once.
            $this->mergeWhen($request->user()?->isAdmin(), [
                'last_login_ip' => $this->last_login_ip,
                'internal_note' => $this->internal_note,
            ]),
        ];
    }
}


<?php
// ---------- Using it ----------

namespace App\\Http\\Controllers;

class UserController extends Controller
{
    public function show(User $user)
    {
        // Ask for what the resource may include.
        $user->load('posts')->loadCount('posts');

        return new UserResource($user);
    }

    public function index()
    {
        $users = User::with('posts')
            ->withCount('posts')
            ->paginate(20);

        // Paginated collections get meta and links for free.
        return UserResource::collection($users);
    }
}

// {
//   "data": [ ... ],
//   "links": { "first": "...", "next": "..." },
//   "meta":  { "current_page": 1, "total": 240 }
// }


<?php
// ---------- Wrapping and metadata ----------

class UserResource extends JsonResource
{
    public static $wrap = 'user';     // { "user": ... }
}

return UserResource::collection($users)->additional([
    'meta' => ['version' => 'v1'],
]);

// additional() is per call. with() is per resource:
class UserResource extends JsonResource
{
    public function with(Request $request): array
    {
        return ['meta' => ['version' => 'v1']];
    }
}


<?php
// ---------- A named collection class ----------

// ::collection() returns an AnonymousResourceCollection.
// Name one only when the collection itself needs behaviour:
php artisan make:resource UserCollection

class UserCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data'         => $this->collection,
            'total_active' => $this->collection->where('active', true)->count(),
        ];
    }
}

return new UserCollection($users);

// An aggregate the individual records cannot express.
// Without one of those, ::collection() is the right call.


<?php
// ---------- The N+1 this prevents ----------

// ❌ Without whenLoaded: one query per user, inside the API.
'posts' => PostResource::collection($this->posts),

// ✓ With it: included when loaded, omitted otherwise.
'posts' => PostResource::collection($this->whenLoaded('posts')),

// And in a service provider, so the mistake cannot ship:
Model::preventLazyLoading(! app()->isProduction());`,
      },
      keyTakeaways: [
        "<b>`toArray()` and `toJson()` serialise a model</b>, shaped by `$hidden`, `$visible`, `$appends` and `casts()`.",
        "<b>Keep ISO 8601 dates in UTC</b>, because a custom format means every client writes its own parser.",
        "<b>Returning a model directly ties your API to your schema</b>, so every migration becomes an API change.",
        "<b>An API Resource is a class that turns a model into its API representation</b>, and states the contract in one file.",
        "`new UserResource($user)` for one, `UserResource::collection($users)` for many.",
        "Output is wrapped in `data` by default, and a paginated collection gains `meta` and `links` automatically.",
        "<b>`when()` includes a key only if a condition holds</b>, and a false condition omits the key entirely.",
        "<b>`whenLoaded()` includes a relationship only if it was eager loaded</b>, which prevents an N+1 inside your API.",
        "`whenNotNull()`, `whenCounted()` and `mergeWhen()` cover the rest of the conditional cases.",
        "<b>`additional()` attaches metadata per call; `with()` attaches it to every response from that resource.</b>",
        "<b>`::collection()` returns an `AnonymousResourceCollection`</b>, not a class you named.",
        "<b>Write a `ResourceCollection` class only when the collection needs its own behaviour</b>, such as an aggregate or summary.",
        "<b>The model is the database representation and the resource is the API representation.</b> They change for different reasons.",
      ],
      commonMistakes: [
        "<b>Returning Eloquent models from a public API.</b> A new column is published the moment it exists.",
        "<b>Serialising a relationship without `whenLoaded()`.</b> One query per model, hidden inside the resource.",
        "<b>Expecting `when()` to produce `null`.</b> A false condition removes the key altogether.",
        "<b>Inventing a date format.</b> Every consumer then writes a parser, and one gets the timezone wrong.",
        "<b>Putting business logic in a resource.</b> It is a representation, not a place to make decisions.",
      ],
      quiz: [
        {
          question: "Why not return Eloquent models directly from an API?",
          options: [
            "It is slower",
            "The API becomes tied to the schema, so every migration is an API change",
            "Models cannot be serialised",
            "Laravel forbids it",
          ],
          correctIndex: 1,
          explanation: "A resource states the contract in one readable file.",
        },
        {
          question: "What does `whenLoaded('posts')` do?",
          options: [
            "Loads the posts",
            "Includes the relationship only if it was already eager loaded",
            "Counts the posts",
            "Hides the posts from admins",
          ],
          correctIndex: 1,
          explanation: "Without it, the resource triggers a query per model.",
        },
        {
          question: "What happens to a key whose `when()` condition is false?",
          options: [
            "It is `null`",
            "It is an empty string",
            "It is absent from the response",
            "The resource throws",
          ],
          correctIndex: 2,
          explanation: "Absent, not null, which is usually what you want.",
        },
        {
          question: "What do you get by returning a paginated query through a resource collection?",
          options: [
            "Nothing extra",
            "`meta` and `links` blocks describing the pagination",
            "Automatic eager loading",
            "A JSON:API document",
          ],
          correctIndex: 1,
          explanation: "Day 13's pagination arriving in the response for free.",
        },
      ],
    },
    {
      id: "json-api-and-large-datasets",
      title: "JSON:API & processing large datasets",
      durationMinutes: 14,
      explanation: "Two things that both matter once an API has real clients and a real table behind it.\n\n---\n\n### 1. Basic — what JSON:API actually is\n\nA plain resource lets you choose the shape:\n\n```json\n{ \"id\": 1, \"name\": \"Rajan\" }\n```\n\nWhich is fine, and it means every API you write has a different shape, and every client writes its own handling.\n\n<b>JSON:API</b> is a specification: a defined document structure for resources, relationships, links and included records. Laravel 13 supports it directly.\n\nA resource object:\n\n```json\n{\n    \"type\": \"users\",\n    \"id\": \"1\",\n    \"attributes\": {\n        \"name\": \"Rajan\",\n        \"email\": \"rajan@example.com\"\n    }\n}\n```\n\nThree things are different from the plain version. <b>The type is explicit</b>, so a client always knows what it is holding. <b>The id is a string</b>, always. And <b>attributes are separated from identity</b>, so `id` and `type` can never collide with a column name.\n\n---\n\n### 2. Intermediate — relationships and includes\n\nThis is where the specification earns its complexity. Relationships are part of the document, not something each API invents:\n\n```json\n{\n    \"type\": \"users\",\n    \"id\": \"1\",\n    \"attributes\": { \"name\": \"Rajan\" },\n    \"relationships\": {\n        \"posts\": {\n            \"data\": [{ \"type\": \"posts\", \"id\": \"10\" }]\n        }\n    }\n}\n```\n\nThe relationship holds <i>linkage</i>: type and id, not the whole record. The record itself goes in a top-level `included` block when the client asks for it:\n\n```text\n?include=posts\n\ndata\n └── User\n\nincluded\n └── Posts\n```\n\nOne request instead of two, and a post referenced by three users appears once rather than three times.\n\n<b>Sparse fieldsets</b> let the client narrow it further:\n\n```text\n?fields[users]=name,email\n```\n\nAnd `links` give each resource its own address:\n\n```json\n{ \"links\": { \"self\": \"/users/1\" } }\n```\n\nOne detail that is easy to miss: JSON:API has its own media type.\n\n```text\nContent-Type: application/vnd.api+json\n```\n\n<b>It is a specification, not a JSON shape</b>, and the header is part of it.\n\nSo the choice:\n\n```text\nPlain API Resource              JSON:API\n──────────────────              ────────\nyou choose the shape            the shape is specified\nflexible, simple                strict, predictable\ngreat for your own frontend     great for public or many clients\nno client tooling               client libraries already exist\nrelationships as you like       relationships in the contract\n```\n\nInternal API for one frontend you also write: a plain resource is less ceremony. Public API, several teams, or clients you do not control: the specification pays for itself.\n\n---\n\n### 3. Advanced — the other end, processing everything\n\nAn API returns twenty rows. A nightly job touches ten million, and that is where the day ends.\n\n```php\nUser::all()->each(function ($user) { ... });   // ten million models in memory\n```\n\nDay 13 covered the alternatives on the Query Builder, and they work identically on Eloquent:\n\n```php\nUser::chunk(1000, function ($users) { ... });\nUser::chunkById(1000, function ($users) { ... });\nUser::lazy()->each(function ($user) { ... });\nforeach (User::cursor() as $user) { ... }\n```\n\n```text\nchunk()       fixed batches, offset based\nchunkById()   the same, safe while modifying the rows\nlazy()        one loop, batches fetched behind the scenes\ncursor()      one row at a time, lowest memory\n```\n\nTwo things are specific to Eloquent here, and both bite.\n\n<b>Every row becomes a model.</b> Ten thousand rows is ten thousand objects, with casts running on each, so a chunk of 1,000 Eloquent models costs considerably more than 1,000 rows from the Query Builder. When the job does not need model behaviour, `DB::table()` is genuinely the right tool.\n\n<b>And eager loading still applies.</b> Touching a relationship inside a chunk closure is an N+1 per chunk, so eager load on the query:\n\n```php\nUser::with('profile')->chunkById(1000, function ($users) { ... });\n```\n\nThe question from Day 15 is still the one to ask, just with a bigger number in it: <b>how many queries, and how many objects, will this produce?</b>\n\nAnd the answer for ten million users is: a fixed small number of objects at any moment, a query per chunk, and nothing loaded that the job does not use.",
      diagram: `A plain resource vs JSON:API

  { "id": 1, "name": "Rajan" }

  Fine. And every API has a different shape,
  so every client writes its own handling.

  JSON:API is a SPECIFICATION:

  {
      "type": "users",          ← type is explicit
      "id": "1",                ← id is always a string
      "attributes": {           ← identity separated from data
          "name": "Rajan"
      }
  }


Relationships are part of the document

  "relationships": {
      "posts": { "data": [{ "type": "posts", "id": "10" }] }
  }

  The relationship holds LINKAGE: type and id.
  The record itself goes in a top-level included block.

  ?include=posts

    data
     └── User
    included
     └── Posts

  One request instead of two. A post referenced by
  three users appears once, not three times.

  ?fields[users]=name,email      sparse fieldsets
  "links": { "self": "/users/1" }

  Content-Type: application/vnd.api+json
  A specification, not a JSON shape. The header is part of it.


Choosing

  Plain API Resource            JSON:API
  ──────────────────            ────────
  you choose the shape          the shape is specified
  flexible, simple              strict, predictable
  your own frontend             public, or many clients
  no client tooling             client libraries exist
  relationships as you like     relationships in the contract


The other end: ten million rows

  ❌ User::all()->each(...)      ten million models in memory

  chunk(1000)       fixed batches, offset based
  chunkById(1000)   the same, safe while modifying rows
  lazy()            one loop, batches behind the scenes
  cursor()          one row at a time, lowest memory


Two things specific to Eloquent

  1. Every row becomes a MODEL, with casts running on each.
     1,000 Eloquent models cost far more than 1,000 rows
     from DB::table(). No model behaviour needed? Use the
     Query Builder.

  2. Eager loading still applies. Touching a relationship
     inside a chunk closure is an N+1 per chunk.

     User::with('profile')->chunkById(1000, ...)

  The Day 15 question, with a bigger number:
  how many queries, and how many objects?`,
      codeExample: {
        title: "A JSON:API document, and a job over ten million rows",
        code: `<?php
// ---------- A JSON:API document ----------

// {
//   "data": {
//     "type": "users",
//     "id": "1",
//     "attributes": {
//       "name": "Rajan",
//       "email": "rajan@example.com"
//     },
//     "relationships": {
//       "posts": {
//         "data": [
//           { "type": "posts", "id": "10" }
//         ],
//         "links": { "related": "/users/1/posts" }
//       }
//     },
//     "links": { "self": "/users/1" }
//   },
//   "included": [
//     {
//       "type": "posts",
//       "id": "10",
//       "attributes": { "title": "Laravel" }
//     }
//   ]
// }
//
// type is explicit. id is a string. attributes are separated
// from identity. The relationship holds linkage; the record
// itself sits in included, once, however many times it is
// referenced.


# Requests the specification defines:

GET /users/1?include=posts
GET /users/1?fields[users]=name,email
GET /users?include=posts&fields[posts]=title

# And the media type, which is part of the specification:

Content-Type: application/vnd.api+json
Accept: application/vnd.api+json


<?php
// ---------- Processing everything ----------

use App\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

// ❌ Ten million models in memory.
User::all()->each(fn ($user) => $user->recalculate());


// ✓ A thousand at a time.
User::chunk(1000, function ($users) {
    foreach ($users as $user) {
        $user->recalculate();
    }
});


// ✓ Safe when the job modifies the rows it is reading.
User::where('needs_sync', true)
    ->chunkById(1000, function ($users) {
        foreach ($users as $user) {
            $user->update(['needs_sync' => false]);
        }
    });


// ✓ One loop, batches fetched behind the scenes.
User::lazy()->each(fn ($user) => $user->recalculate());

// ✓ Lowest memory: one row at a time.
foreach (User::cursor() as $user) {
    // Holds a connection open for the whole loop.
}


// ---------- Eager loading still applies ----------

// ❌ An N+1 inside every chunk.
User::chunkById(1000, function ($users) {
    foreach ($users as $user) {
        echo $user->profile->country;
    }
});

// ✓ Two queries per chunk instead of a thousand.
User::with('profile')->chunkById(1000, function ($users) {
    foreach ($users as $user) {
        echo $user->profile->country;
    }
});


// ---------- When no model behaviour is needed ----------

// Ten thousand models means ten thousand objects, with
// casts running on each. If the job only reads columns:
DB::table('users')
    ->select('id', 'email')
    ->orderBy('id')
    ->chunkById(5000, function ($rows) {
        foreach ($rows as $row) {
            // plain objects, a fraction of the cost
        }
    });`,
      },
      keyTakeaways: [
        "<b>JSON:API is a specification, not a JSON shape</b>: a defined structure for resources, relationships, links and includes.",
        "<b>A resource object states its `type`, a string `id`, and its data under `attributes`</b>, separating identity from columns.",
        "<b>Relationships hold linkage (type and id)</b>, with the records themselves in a top-level `included` block.",
        "`?include=posts` returns related records in one request, and a shared record appears once rather than repeatedly.",
        "<b>Sparse fieldsets (`?fields[users]=name,email`) let a client ask for fewer fields</b>, and `links` give each resource an address.",
        "<b>The media type `application/vnd.api+json` is part of the specification.</b>",
        "A plain resource suits an internal API; JSON:API pays off for public APIs and clients you do not control.",
        "<b>`chunk()`, `chunkById()`, `lazy()` and `cursor()` work on Eloquent exactly as on the Query Builder.</b>",
        "<b>Every row becomes a model with casts</b>, so use `DB::table()` when the job needs no model behaviour.",
        "<b>Eager loading still applies inside a chunk closure</b>, or you get an N+1 per batch.",
      ],
      commonMistakes: [
        "<b>Calling a hand-shaped JSON response JSON:API.</b> It is a specification, media type included.",
        "<b>Putting whole related records inside `relationships`.</b> That holds linkage; the records go in `included`.",
        "<b>Returning a numeric `id` in JSON:API.</b> The specification says it is a string.",
        "<b>Using `all()->each()` on a large table.</b> Every row becomes a model in memory first.",
        "<b>Touching a relationship inside a chunk closure without eager loading.</b> That is an N+1 in every batch.",
      ],
      quiz: [
        {
          question: "What makes JSON:API different from a hand-shaped JSON response?",
          options: [
            "It is faster",
            "It is a specification defining document structure, relationships, includes and a media type",
            "It uses XML",
            "It requires Eloquent",
          ],
          correctIndex: 1,
          explanation: "Clients can rely on the shape, and libraries already understand it.",
        },
        {
          question: "In JSON:API, what does the `relationships` block contain?",
          options: [
            "The full related records",
            "Linkage: the type and id of each related record",
            "A URL only",
            "The foreign keys",
          ],
          correctIndex: 1,
          explanation: "The records themselves go in the top-level `included` block.",
        },
        {
          question: "Which method is safest when a job modifies the rows it is iterating?",
          options: ["`all()`", "`chunk()`", "`chunkById()`", "`cursor()`"],
          correctIndex: 2,
          explanation: "`chunk()` uses offsets, which shift when rows change.",
        },
        {
          question: "Why can a chunked Eloquent job cost far more than the same job on `DB::table()`?",
          options: [
            "Eloquent runs more queries",
            "Every row becomes a model object with casts applied",
            "Eloquent cannot chunk",
            "It loads relationships automatically",
          ],
          correctIndex: 1,
          explanation: "When no model behaviour is needed, the Query Builder is the right tool.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "When should a value be a cast rather than an accessor?",
      options: [
        "When it needs formatting for display",
        "When you are describing what the value is, such as a boolean, an array or an enum",
        "Casts are always preferable",
        "When the attribute is hidden",
      ],
      correctIndex: 1,
      explanation: "Type belongs in a cast; presentation belongs in an accessor.",
    },
    {
      question: "Why cast a status column to a PHP enum?",
      options: [
        "It adds a database constraint",
        "A typo becomes an error, and the enum is the one place stating every valid value",
        "It makes the query faster",
        "It encrypts the value",
      ],
      correctIndex: 1,
      explanation: "String comparisons fail silently.",
    },
    {
      question: "What problem does a local scope solve?",
      options: [
        "N+1 queries",
        "The same condition appearing in many places, so a rule change means finding them all",
        "Missing indexes",
        "Mass assignment",
      ],
      correctIndex: 1,
      explanation: "One definition, and every caller follows it.",
    },
    {
      question: "Which is the right use for a global scope?",
      options: [
        "Filtering to published posts",
        "Filtering to active users",
        "Limiting every query to the current tenant",
        "Ordering by created_at",
      ],
      correctIndex: 2,
      explanation: "A query that forgets the tenant is a data leak, so it should be automatic.",
    },
    {
      question: "How do you run a query without a named global scope?",
      options: [
        "`withoutGlobalScope('name')`",
        "`withTrashed()`",
        "`Model::unguard()`",
        "You cannot",
      ],
      correctIndex: 0,
      explanation: "`withoutGlobalScopes()` removes all of them.",
    },
    {
      question: "Why not return Eloquent models directly from a public API?",
      options: [
        "It is slower",
        "The API becomes tied to your schema, so every migration is an API change",
        "Models cannot be serialised",
        "It breaks pagination",
      ],
      correctIndex: 1,
      explanation: "A resource states the contract in one file you can read.",
    },
    {
      question: "What does `whenLoaded('posts')` protect against?",
      options: [
        "Mass assignment",
        "An N+1 caused by the resource serialising a relationship that was never eager loaded",
        "Missing relationships",
        "Invalid JSON",
      ],
      correctIndex: 1,
      explanation: "Include it only when the controller asked for it.",
    },
    {
      question: "What is fundamentally different about a JSON:API response?",
      options: [
        "It uses a different HTTP method",
        "It follows a specification: resource objects, relationships, includes and its own media type",
        "It is always paginated",
        "It cannot include relationships",
      ],
      correctIndex: 1,
      explanation: "A shape clients and libraries can rely on, rather than one you invented.",
    },
    {
      question: "How do you process ten million users without exhausting memory?",
      options: [
        "`User::all()->each(...)`",
        "`chunkById()`, `lazy()` or `cursor()`, and `DB::table()` if no model behaviour is needed",
        "Raise `memory_limit`",
        "Paginate through every page",
      ],
      correctIndex: 1,
      explanation: "A fixed small number of objects at any moment, one query per batch.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Give InvoiceHub a real API: an enum-backed status, money as a value object, named scopes, resources with no N+1, and a job that can process every invoice ever written.",
    brief: "Everything so far has been for InvoiceHub's own screens. Today it gets an API that another team could build against, which changes what matters.\n\nThe screens forgave a lot. A model returned straight from a controller looked fine, an extra query per row was invisible, and a status column full of loose strings never caused a problem you noticed. An API contract forgives none of it: a new column leaks, a per-row query multiplies by every client, and a typo in a status string is a bug that ships.\n\nSo the day is about drawing the line between what InvoiceHub stores and what it publishes, and then proving the line holds. Build the plain-resource version first and get it right; the JSON:API version afterwards is where you feel what a specification buys you.",
    steps: [
      "Create an `InvoiceStatus` string enum with `draft`, `sent`, `paid`, `overdue` and `cancelled`, plus a `label()` and an `isFinal()` method. Cast `Invoice::status` to it.",
      "Find every string comparison against a status in the codebase and replace it with the enum. Deliberately mistype one and confirm your editor catches it.",
      "Build a `Money` value object with `fromString()`, `toString()`, `add()` and `format()`, and a `MoneyCast`. Cast `Invoice::total` and `InvoiceLine::unit_price` to it.",
      "Delete every place that formatted money by hand and use `->format()` instead. Note in a comment what that removed.",
      "Add scopes to `Invoice`: `draft()`, `unpaid()`, `overdue()`, `forCustomer($id)` and `issuedBetween($from, $to)`. Rewrite the list page to use them and compare the two versions side by side.",
      "Add a `visible()` scope composed from two of the others, and use it on the dashboard.",
      "Decide whether InvoiceHub needs a global scope. Write down your reasoning either way, applying the test: would seeing the excluded rows ever be correct?",
      "Create `InvoiceResource`, `InvoiceLineResource` and `CustomerResource`. Include the customer and lines with `whenLoaded()`, and a line count with `whenCounted()`.",
      "Add an admin-only field with `when()`, and confirm from a non-admin request that the key is absent rather than null.",
      "Build `GET /api/invoices` returning a paginated resource collection, and confirm you get `meta` and `links` without writing them.",
      "With `preventLazyLoading()` still on from Day 15, hit that endpoint with the eager loads removed. Watch it throw, then put them back and record the query count.",
      "Load the endpoint with 5 invoices and then with 200, and confirm the query count is identical.",
      "Now build the same invoice as a JSON:API document: `type`, a string `id`, `attributes`, a `relationships` block with linkage for the customer and lines, and an `included` block. Return the `application/vnd.api+json` content type.",
      "Support `?include=lines` so the included block is only present when asked for, and `?fields[invoices]=number,total` for sparse fieldsets.",
      "Write a paragraph comparing the two representations of the same invoice: what each makes easy, and which one you would choose for InvoiceHub's own frontend versus a partner integration.",
      "Write an Artisan command that recalculates every invoice total from its lines using `chunkById(1000)` with the lines eager loaded. Log the query count and the peak memory.",
      "Run that command a second time using `DB::table()` instead of models, and compare the memory. Write down when each version is the right choice.",
    ],
    acceptance: [
      "No string literal status comparison remains anywhere in the codebase.",
      "`$invoice->total` is a `Money` object, and no view formats currency by hand.",
      "The invoice list page reads as named scopes rather than raw `where` clauses.",
      "`GET /api/invoices` returns a wrapped, paginated collection with `meta` and `links`.",
      "The endpoint runs the same number of queries with 5 invoices as with 200.",
      "A non-admin request omits the admin-only key entirely rather than returning null.",
      "Removing an eager load makes the endpoint throw in development, not silently slow down.",
      "The JSON:API document has a string `id`, an explicit `type`, linkage in `relationships`, records in `included`, and the correct content type.",
      "`?include=lines` and `?fields[invoices]=...` both change the response as the specification describes.",
      "The recalculation command processes every invoice with flat memory use, and you can state its query count.",
    ],
    stretch: [
      "Give `Invoice` a custom collection class with a `totalOutstanding()` method that sums `Money` objects, and use it on the dashboard.",
      "Add an `Address` value object implementing `Castable`, mapping onto the customer's street, city and country columns.",
      "Version the API: keep `InvoiceResource` as v1 and add a v2 that renames two fields, then prove both endpoints work from the same models.",
    ],
  },
};
