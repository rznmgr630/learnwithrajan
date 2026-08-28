import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_PHASE_0_LESSONS: LessonDay = {
  day: 0,
  title: "Phase 0 — Before You Start",
  totalMinutes: 38,
  difficulty: "Preparation",
  lessons: [
    {
      id: "php-oop",
      title: "PHP you must know — classes, interfaces, traits",
      durationMinutes: 10,
      explanation: "Before the 30-day Laravel journey, you need a few PHP, Git, SQL and web fundamentals. <b>This phase is not part of the 30 days</b> — it is a preparation checklist.\n\nYou do not need to be an expert in everything here. You need enough to follow the Laravel lessons without getting stuck on PHP syntax.\n\n```text\n                  Laravel 13\n                      │\n          ┌───────────┼───────────┐\n          ↓           ↓           ↓\n         PHP         SQL         HTTP\n          │           │           │\n          ↓           ↓           ↓\n      Composer       Database     Web\n          │\n          ↓\n         Git\n```\n\nLaravel is built on top of these. If the foundations are weak, Laravel feels complicated. If they are clear, Laravel becomes much easier.\n\n---\n\n### 1. Basic — classes\n\nA <b>class</b> (a blueprint for creating objects) describes what an object should contain and do.\n\n```php\nclass User\n{\n    public string $name;\n\n    public function sayHello(): string\n    {\n        return \"Hello, \" . $this->name;\n    }\n}\n```\n\nCreate an object from it:\n\n```php\n$user = new User();\n$user->name = \"Rajan\";\necho $user->sayHello();   // Hello, Rajan\n```\n\n```text\n             Class\n          ┌───────────┐\n          │   User    │\n          ├───────────┤\n          │ name      │\n          │ sayHello  │\n          └─────┬─────┘\n                │\n             new User()\n                │\n                ↓\n          ┌───────────┐\n          │  Object   │\n          │  Rajan    │\n          └───────────┘\n```\n\nLaravel uses classes everywhere: `Controller → Service → Repository → Model → Database`.\n\n---\n\n### 2. Intermediate — interfaces and traits\n\nAn <b>interface</b> (a contract saying which methods a class must provide) defines <b>what</b> a class does without saying <b>how</b>.\n\n```php\ninterface PaymentGateway\n{\n    public function charge(float $amount): bool;\n}\n\nclass StripePayment implements PaymentGateway\n{\n    public function charge(float $amount): bool\n    {\n        return true;\n    }\n}\n```\n\n```text\nInterface\n   │ defines the rules\n   ↓\nPaymentGateway\n   │\n   ├───────────────┐\n   ↓               ↓\nStripe          PayPal\n```\n\nBoth must provide `charge()`. Laravel uses interfaces when you want to separate what something does from how it does it.\n\nA <b>trait</b> (a reusable group of methods and properties) shares code between classes that are otherwise unrelated:\n\n```php\ntrait HasActivityLog\n{\n    public function logActivity(): void\n    {\n        echo \"Activity logged\";\n    }\n}\n\nclass User  { use HasActivityLog; }\nclass Order { use HasActivityLog; }\n```\n\n```text\n             HasActivityLog\n                    │\n          ┌─────────┴─────────┐\n          ↓                   ↓\n        User                Order\n          │                   │\n          └──── logActivity ──┘\n```\n\n---\n\n### 3. Advanced — abstract classes\n\nAn <b>abstract class</b> (a class designed to be inherited, never created directly) gives child classes shared behaviour and forces them to fill in the rest:\n\n```php\nabstract class Animal\n{\n    public function sleep(): void\n    {\n        echo \"Sleeping\";\n    }\n\n    abstract public function makeSound(): string;\n}\n\nclass Dog extends Animal\n{\n    public function makeSound(): string\n    {\n        return \"Woof\";\n    }\n}\n```\n\n`new Animal()` is not allowed, because `Animal` is abstract.\n\n```text\n             Animal\n          (abstract)\n               │\n       ┌───────┴───────┐\n       ↓               ↓\n      Dog             Cat\n       │               │\n     Woof             Meow\n```\n\n<b>Interface or abstract class?</b> An interface is a pure contract with no code. An abstract class is a partly-built parent that also carries shared code.",
      diagram: `What Laravel stands on

                  Laravel 13
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
         PHP         SQL         HTTP
          │           │           │
          ↓           ↓           ↓
      Composer       Database     Web
          │
          ↓
         Git


Class to object

             Class                        Object
          ┌───────────┐                ┌───────────┐
          │   User    │  new User()    │  Rajan    │
          │ name      │ ─────────────► │           │
          │ sayHello  │                └───────────┘
          └───────────┘


Three ways to share behaviour

interface          a contract, no code
                   Stripe and PayPal both promise charge()

trait              reusable methods, dropped into any class
                   User and Order both gain logActivity()

abstract class     a half-built parent
                   Dog and Cat inherit sleep(), must write makeSound()`,
      codeExample: {
        title: "Classes, interfaces, traits and abstract classes",
        code: `<?php

// ── 1. Basic — a class is a blueprint ─────────────────────────────
class User
{
    public string $name;

    public function sayHello(): string
    {
        return "Hello, " . $this->name;
    }
}

$user = new User();
$user->name = "Rajan";
echo $user->sayHello();          // Hello, Rajan

// ── 2. Interface — what, not how ──────────────────────────────────
interface PaymentGateway
{
    public function charge(float $amount): bool;
}

class StripePayment implements PaymentGateway
{
    public function charge(float $amount): bool
    {
        return true;                 // Stripe's own way of charging
    }
}

class PayPalPayment implements PaymentGateway
{
    public function charge(float $amount): bool
    {
        return true;                 // a different way, same contract
    }
}

// ── 3. Trait — shared code between unrelated classes ──────────────
trait HasActivityLog
{
    public function logActivity(): void
    {
        echo "Activity logged";
    }
}

class Order
{
    use HasActivityLog;              // Order and User are unrelated,
}                                    // but both can log activity

// ── 4. Abstract class — a parent you cannot instantiate ───────────
abstract class Animal
{
    public function sleep(): void    // shared with every child
    {
        echo "Sleeping";
    }

    abstract public function makeSound(): string;   // each child fills this in
}

class Dog extends Animal
{
    public function makeSound(): string
    {
        return "Woof";
    }
}

// $animal = new Animal();           // Error: Animal is abstract
$dog = new Dog();
$dog->sleep();                       // inherited
echo $dog->makeSound();              // Woof`,
      },
      keyTakeaways: [
        "Phase 0 is a <b>preparation checklist</b>, not one of the 30 days.",
        "A <b>class</b> is a blueprint; `new` turns it into an object you can use.",
        "An <b>interface</b> is a contract: it says which methods must exist, never how they work.",
        "A <b>trait</b> shares methods between classes that are otherwise unrelated.",
        "An <b>abstract class</b> cannot be instantiated; it gives children shared code plus methods they must implement.",
        "Interface = pure contract. Abstract class = half-built parent with code in it.",
      ],
      commonMistakes: [
        "<b>Trying to instantiate an abstract class</b> — `new Animal()` is a fatal error; you instantiate `Dog`, which extends it.",
        "<b>Putting code inside an interface</b> — an interface declares method signatures only. If you need shared code, use an abstract class or a trait.",
        "<b>Forgetting to implement an abstract method</b> — a child class that skips `makeSound()` will not compile; PHP requires every abstract method to be filled in.",
        "<b>Reaching for a trait when inheritance fits</b> — traits suit unrelated classes needing the same helper, not a genuine parent-child relationship.",
      ],
      quiz: [
        {
          question: "What is a class?",
          options: [
            "A database table",
            "A blueprint for creating objects",
            "An HTTP request",
            "A Git branch",
          ],
          correctIndex: 1,
          explanation: "`new User()` turns the blueprint into an object you can use.",
        },
        {
          question: "What does an interface provide?",
          options: [
            "A database connection",
            "A Git repository",
            "A contract that a class must follow",
            "A browser cookie",
          ],
          correctIndex: 2,
          explanation: "It says which methods must exist, never how they work.",
        },
        {
          question: "When is a trait the right tool?",
          options: [
            "When one class is a kind of another",
            "When two unrelated classes need the same helper method",
            "When you need a database table",
          ],
          correctIndex: 1,
          explanation: "A genuine parent-child relationship is what inheritance is for.",
        },
        {
          question: "What happens with `new Animal()` when `Animal` is abstract?",
          options: [
            "It creates an empty object",
            "It silently returns null",
            "It is a fatal error — abstract classes cannot be instantiated",
          ],
          correctIndex: 2,
          explanation: "You instantiate a child such as `Dog`, which implements the abstract methods.",
        },
        {
          question: "What is the difference between an interface and an abstract class?",
          options: [
            "They are the same thing with different keywords",
            "An interface is a pure contract; an abstract class can also carry shared code",
            "An interface can be instantiated",
          ],
          correctIndex: 1,
          explanation: "Use an interface for a promise; an abstract class when children also share behaviour.",
        },
      ],
    },
    {
      id: "modern-php",
      title: "Modern PHP — namespaces, types, enums, closures",
      durationMinutes: 10,
      explanation: "These are the pieces of modern PHP you will meet on the first day of Laravel code.\n\n---\n\n### 1. Basic — namespaces and `use`\n\nA <b>namespace</b> (a way to organise PHP classes and avoid naming conflicts) tells PHP where a class belongs:\n\n```php\nnamespace App\\Services;\n\nclass UserService {}\n```\n\nAnother class can share the name in a different namespace, and they stay separate: `App\\Services\\UserService` and `App\\Admin\\UserService`.\n\nA Laravel project has many classes, and namespaces keep them apart:\n\n```text\napp/\n├── Models/\n├── Controllers/\n├── Services/\n├── Jobs/\n├── Events/\n└── Requests/\n```\n\nThe `use` statement (a way to import a class so you do not write its full namespace every time) keeps code readable:\n\n```php\n// without use\n$user = new \\App\\Models\\User();\n\n// with use\nuse App\\Models\\User;\n\n$user = new User();\n```\n\nYou will see `use` at the top of nearly every Laravel file.\n\n---\n\n### 2. Intermediate — type hints, unions, nullables\n\nA <b>type hint</b> (telling PHP what type a parameter or return value should be) makes code safer:\n\n```php\nfunction add(int $a, int $b): int\n{\n    return $a + $b;\n}\n```\n\n`int $a` says the parameter must be an integer; `: int` says the function returns one.\n\nA <b>union type</b> (a value allowed to be one of several types) uses `|`:\n\n```php\nfunction findUser(int|string $id) {}\n\nfindUser(10);\nfindUser(\"10\");     // both valid\n```\n\nA <b>nullable type</b> (a type that may also be `null`) uses `?`:\n\n```php\nfunction getUserName(?string $name): string\n{\n    return $name ?? \"Unknown\";\n}\n```\n\n`?string` means a string <b>or</b> `null`. The `??` is the null coalescing operator — use the left value unless it is null, otherwise the right one.\n\n---\n\n### 3. Advanced — enums, readonly, promotion, attributes\n\nAn <b>enum</b> (a fixed list of allowed values) stops stray strings getting into your data:\n\n```php\nenum OrderStatus: string\n{\n    case Pending = 'pending';\n    case Paid = 'paid';\n    case Cancelled = 'cancelled';\n}\n\n$status = OrderStatus::Paid;\n```\n\n```text\nOrderStatus\n     │\n     ├── pending\n     ├── paid\n     └── cancelled\n```\n\nThe value has to come from the defined choices, so `\"something-random\"` is impossible.\n\nA <b>readonly property</b> (a property that cannot change after it is first set) prevents accidental writes:\n\n```php\nclass User\n{\n    public function __construct(\n        public readonly int $id\n    ) {}\n}\n\n$user = new User(10);\n$user->id = 20;      // Error: id is readonly\n```\n\n<b>Constructor property promotion</b> (declaring and assigning a property in the constructor signature) removes boilerplate:\n\n```php\n// without promotion\nclass User\n{\n    public string $name;\n\n    public function __construct(string $name)\n    {\n        $this->name = $name;\n    }\n}\n\n// with promotion\nclass User\n{\n    public function __construct(\n        public string $name\n    ) {}\n}\n```\n\nLaravel code uses this style constantly.\n\nAn <b>attribute</b> (metadata attached to a class, method or property) uses `#[...]`:\n\n```php\n#[SomeAttribute]\npublic function index() {}\n```\n\nYou do not need to master attributes before Laravel — just recognise the syntax.\n\n---\n\n### Closures and arrow functions\n\nA <b>closure</b> (a function stored in a variable or passed to another function) is everywhere in Laravel:\n\n```php\n$greet = function (string $name) {\n    return \"Hello \" . $name;\n};\n\necho $greet(\"Rajan\");        // Hello Rajan\n```\n\nThat route definition you will write on day 2 is a closure:\n\n```php\nRoute::get('/hello', function () {\n    return 'Hello World';\n});\n```\n\nAn <b>arrow function</b> (shorter syntax for a small closure) uses `fn`:\n\n```php\n$result = array_map(fn ($number) => $number * 2, [1, 2, 3]);\n// [2, 4, 6]\n```\n\n---\n\n### Exceptions\n\nAn <b>exception</b> (an object representing an error or unexpected situation) lets you handle problems deliberately:\n\n```php\ntry {\n    throw new Exception(\"Something went wrong\");\n} catch (Exception $e) {\n    echo $e->getMessage();       // Something went wrong\n}\n```\n\n```text\nCode runs\n   │\n   ↓\nProblem?\n   │\n  YES\n   │\n   ↓\nthrow Exception\n   │\n   ↓\ncatch\n   │\n   ↓\nHandle error\n```\n\nLaravel builds its own exception handling on top of this.",
      diagram: `A full name, shortened once at the top of the file

App\\Models\\User
       │
       ↓
      use
       │
       ↓
     User


Types, narrowing what a value may be

int $a           an integer, nothing else
int|string $id   either one of the two
?string $name    a string, or null
: int            what the function hands back


An enum closes the list of valid values

OrderStatus
     │
     ├── pending
     ├── paid
     └── cancelled

"something-random" cannot get in


An exception, from problem to handled

Code runs
   │
   ↓
Problem? ── NO ──► carry on
   │
  YES
   ↓
throw Exception
   ↓
catch
   ↓
Handle error`,
      codeExample: {
        title: "Namespaces, types, enums, closures and exceptions",
        code: `<?php

// ── 1. Basic — namespace and use ──────────────────────────────────
namespace App\\Services;

use App\\Models\\User;          // now "User" means App\\Models\\User

$user = new User();             // instead of new \\App\\Models\\User()

// ── 2. Type hints, unions and nullables ───────────────────────────
function add(int $a, int $b): int
{
    return $a + $b;             // parameters and return are both int
}

function findUser(int|string $id) {}   // either type is accepted

findUser(10);
findUser("10");

function getUserName(?string $name): string
{
    return $name ?? "Unknown";  // ?string means "string or null"
}

// ── 3. Enums close the list of valid values ───────────────────────
enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
}

$status = OrderStatus::Paid;    // "something-random" is impossible

// ── 4. readonly and constructor property promotion ────────────────
class Order
{
    public function __construct(
        public readonly int $id,     // declared and assigned in one line
        public string $reference,
    ) {}
}

$order = new Order(10, "ORD-1");
// $order->id = 20;             // Error: id is readonly
$order->reference = "ORD-2";    // fine, not readonly

// ── 5. Closures and arrow functions ───────────────────────────────
$greet = function (string $name) {
    return "Hello " . $name;
};

echo $greet("Rajan");           // Hello Rajan

$doubled = array_map(fn ($n) => $n * 2, [1, 2, 3]);   // [2, 4, 6]

// Laravel routes are closures you will write on day 2
// Route::get('/hello', function () { return 'Hello World'; });

// ── 6. Exceptions ─────────────────────────────────────────────────
try {
    throw new \\Exception("Something went wrong");
} catch (\\Exception $e) {
    echo $e->getMessage();      // Something went wrong
}`,
      },
      keyTakeaways: [
        "A <b>namespace</b> says where a class belongs, so two classes can share a name.",
        "<b>`use`</b> imports a class once, so you write `User` instead of the full path.",
        "A <b>type hint</b> states what a parameter takes and what the function returns.",
        "`int|string` is a <b>union</b> (either type); `?string` is <b>nullable</b> (string or null).",
        "An <b>enum</b> fixes the list of valid values, so a stray string cannot get in.",
        "<b>`readonly`</b> blocks writes after construction; <b>promotion</b> declares and assigns in one line.",
        "A <b>closure</b> is a function in a variable — Laravel routes are closures.",
      ],
      commonMistakes: [
        "<b>Forgetting the `use` line</b> — PHP then looks for `User` in the current namespace and reports a class-not-found error, even though the file exists.",
        "<b>Writing `string $name` when null is possible</b> — passing `null` throws a TypeError. Use `?string` and handle the null case.",
        "<b>Assigning to a readonly property</b> — `$user->id = 20` is an error after construction; set it in the constructor or drop `readonly`.",
        "<b>Catching an exception and doing nothing</b> — an empty `catch` block hides the failure and makes the bug much harder to find later.",
      ],
      quiz: [
        {
          question: "What does `?string` mean?",
          options: [
            "String or `null` is allowed",
            "Only strings are allowed",
            "Only integers are allowed",
            "Anything is allowed",
          ],
          correctIndex: 0,
          explanation: "The `?` adds `null` to whatever type follows it.",
        },
        {
          question: "What does `use App\\Models\\User;` do?",
          options: [
            "Imports the class so you can write `User` instead of the full path",
            "Creates a new User object",
            "Runs the User class",
          ],
          correctIndex: 0,
          explanation: "Without it, PHP looks for `User` in the current namespace and fails.",
        },
        {
          question: "Why use an enum instead of plain strings for order status?",
          options: [
            "The value must come from the defined list, so a typo cannot get in",
            "Enums are faster",
            "Enums are stored in the database automatically",
          ],
          correctIndex: 0,
          explanation: "`\"something-random\"` becomes impossible rather than merely unlikely.",
        },
        {
          question: "What does constructor property promotion save you from writing?",
          options: [
            "The class keyword",
            "The return type",
            "The separate property declaration and the `$this->name = $name` assignment",
          ],
          correctIndex: 2,
          explanation: "The parameter declares the property and assigns it in one line.",
        },
        {
          question: "What is a closure?",
          options: [
            "A class that cannot be extended",
            "A function stored in a variable or passed to another function",
            "A closed database connection",
          ],
          correctIndex: 1,
          explanation: "The function you pass to `Route::get()` is a closure.",
        },
      ],
    },
    {
      id: "composer-git-sql",
      title: "Composer, Git and SQL",
      durationMinutes: 9,
      explanation: "Three tools you will use every day, none of which Laravel replaces.\n\n---\n\n### 1. Basic — Composer\n\n<b>Composer</b> (PHP's dependency manager) installs and manages the packages your project needs. A <b>package</b> (code written by someone else that your application uses) arrives with one command:\n\n```bash\ncomposer require laravel/framework\n```\n\nIf you know JavaScript, the mapping is direct:\n\n```text\nJavaScript          PHP\n\nnpm                 Composer\npackage.json        composer.json\nnode_modules        vendor/\nnpm install         composer install\nnpm update          composer update\n```\n\n`composer.json` answers \"what packages does my project need?\":\n\n```json\n{\n    \"require\": {\n        \"laravel/framework\": \"^13.0\"\n    }\n}\n```\n\n<b>`composer install`</b> installs the versions already recorded for the project — this is what you run after cloning:\n\n```text\ngit clone project\n       ↓\ncomposer install\n       ↓\n   vendor/\n       ↓\nLaravel can run\n```\n\n<b>`composer update`</b> looks for newer versions allowed by the rules in `composer.json` and updates them. The difference matters:\n\n```text\ncomposer install → install the versions recorded for the project\ncomposer update  → find newer allowed versions and change them\n```\n\n---\n\n### 2. Intermediate — Git\n\n<b>Git</b> (a version control system that tracks changes to your code) lets you work without fear of losing anything. You need `branch`, `checkout` or `switch`, `add`, `commit`, `merge`, `pull` and `push`, and this workflow:\n\n```text\n              main\n               │\n            branch\n               │\n               ↓\n        Make changes\n               │\n               ↓\n             git add\n               │\n               ↓\n           git commit\n               │\n               ↓\n            git push\n               │\n               ↓\n          Pull Request\n```\n\nAdvanced Git can wait. Being comfortable with branches and commits cannot.\n\n---\n\n### 3. Advanced — SQL\n\nLaravel makes database work easier, but it does not remove the need to understand SQL. You should recognise `SELECT`, `WHERE`, `JOIN`, `INSERT`, `UPDATE`, `DELETE`, `ORDER BY`, `GROUP BY` and indexes.\n\n<b>`SELECT`</b> reads data, <b>`WHERE`</b> filters rows:\n\n```sql\nSELECT * FROM users;\n\nSELECT * FROM users WHERE id = 10;\n```\n\n```text\nusers\n  │\n  ├── id 1\n  ├── id 10  ← returned\n  ├── id 20\n  └── id 30\n```\n\nA <b>`JOIN`</b> (combining related data from more than one table) is the one to really understand, because Eloquent relationships are built on it:\n\n```text\nusers                      orders\n┌────┬────────┐            ┌────┬─────────┬─────────┐\n│ id │ name   │            │ id │ user_id │ amount  │\n├────┼────────┤            ├────┼─────────┼─────────┤\n│ 1  │ Rajan  │            │ 10 │ 1       │ 500     │\n│ 2  │ Kenji  │            │ 11 │ 1       │ 200     │\n└────┴────────┘            │ 12 │ 2       │ 100     │\n                           └────┴─────────┴─────────┘\n```\n\n```sql\nSELECT users.name, orders.amount\nFROM users\nJOIN orders ON orders.user_id = users.id;\n```\n\n```text\nRajan   500\nRajan   200\nKenji   100\n```\n\nThe link is `users.id → orders.user_id`. That single idea becomes `hasMany` and `belongsTo` in Eloquent.\n\nAn <b>index</b> (a database structure that helps it find rows faster) is the difference between reading every page of a book and using its index:\n\n```text\nWithout an index          With an index\n\nSearch \"Laravel\"          Search \"Laravel\"\n       ↓                         ↓\nRead every page           Check the index\n       ↓                         ↓\n     Slow                 Go straight to the page\n                                 ↓\n                               Fast\n```\n\n```sql\nCREATE INDEX users_email_index ON users(email);\n```\n\nAfter that, `WHERE email = 'rajan@example.com'` can be dramatically faster on a large table.",
      diagram: `Composer, if you already know npm

JavaScript          PHP
──────────          ───
npm                 Composer
package.json        composer.json
node_modules        vendor/
npm install         composer install
npm update          composer update


install and update are not the same command twice

composer install → the versions recorded for this project
composer update  → newer versions the rules allow, written back


The Git loop you need before day 1

main → branch → change → git add → git commit → git push → Pull Request


A JOIN is the idea behind every Eloquent relationship

users                      orders
┌────┬────────┐            ┌────┬─────────┬─────────┐
│ id │ name   │            │ id │ user_id │ amount  │
├────┼────────┤            ├────┼─────────┼─────────┤
│ 1  │ Rajan  │◄───────────│ 10 │ 1       │ 500     │
│ 2  │ Kenji  │            │ 11 │ 1       │ 200     │
└────┴────────┘            │ 12 │ 2       │ 100     │
                           └────┴─────────┴─────────┘
        users.id  →  orders.user_id


An index, in one picture

no index    search → read every page  → slow
index       search → check the index  → straight to the page → fast`,
      codeExample: {
        title: "The commands and queries you need on day 1",
        code: `# ── Composer ──────────────────────────────────────────────────────
composer require laravel/framework   # add a package
composer install                     # install the recorded versions
composer update                      # find newer allowed versions

# after cloning any Laravel project:
#   git clone project → composer install → vendor/ → it runs

# ── Git, the loop you need before day 1 ───────────────────────────
git switch -c feature/routing        # branch off main
git add .
git commit -m "Add the routes file"
git push -u origin feature/routing   # then open a pull request

git switch main
git pull                             # bring main up to date
git merge feature/routing

-- ── SQL: read and filter ─────────────────────────────────────────
SELECT * FROM users;

SELECT * FROM users WHERE id = 10;

-- ── JOIN: the idea behind Eloquent relationships ─────────────────
SELECT users.name, orders.amount
FROM users
JOIN orders ON orders.user_id = users.id;
-- Rajan  500
-- Rajan  200
-- Kenji  100

-- ── An index turns a full scan into a lookup ─────────────────────
CREATE INDEX users_email_index ON users(email);

SELECT * FROM users WHERE email = 'rajan@example.com';`,
      },
      keyTakeaways: [
        "<b>Composer</b> is PHP's dependency manager — the direct counterpart to npm.",
        "`composer install` installs the <b>recorded</b> versions; `composer update` looks for <b>newer</b> ones.",
        "After cloning a Laravel project, `composer install` is what creates `vendor/` and makes it run.",
        "For <b>Git</b>, branches and commits are enough to start; advanced usage can wait.",
        "A <b>`JOIN`</b> combines related rows across tables — the idea Eloquent relationships are built on.",
        "An <b>index</b> turns a full table scan into a direct lookup, like a book's index.",
      ],
      commonMistakes: [
        "<b>Running `composer update` on a shared project</b> — it can pull in newer versions and change behaviour for everyone. After cloning you want `composer install`.",
        "<b>Committing the `vendor/` directory</b> — it is generated from `composer.json`, the way `node_modules` is generated from `package.json`.",
        "<b>Committing straight to `main`</b> — branch first, so work in progress never blocks anyone else and can be reviewed.",
        "<b>Assuming Laravel means you can skip SQL</b> — Eloquent writes the queries, but you still have to read them when one is slow.",
      ],
      quiz: [
        {
          question: "What is Composer?",
          options: [
            "PHP's dependency manager",
            "A JavaScript framework",
            "A database",
            "An HTTP server",
          ],
          correctIndex: 0,
          explanation: "It is to PHP what npm is to JavaScript.",
        },
        {
          question: "What is the difference between `composer install` and `composer update`?",
          options: [
            "They are the same command",
            "`install` uses the recorded versions; `update` looks for newer allowed ones",
            "`install` is for production only",
          ],
          correctIndex: 1,
          explanation: "After cloning a project you want `install`, not `update`.",
        },
        {
          question: "What does an SQL JOIN do?",
          options: [
            "Deletes tables",
            "Starts Laravel",
            "Creates a Git branch",
            "Combines related data from more than one table",
          ],
          correctIndex: 3,
          explanation: "`users.id → orders.user_id` is the same idea as `hasMany` in Eloquent.",
        },
        {
          question: "What does a database index do?",
          options: [
            "Helps the database find matching rows without scanning every one",
            "Stores a backup of the table",
            "Encrypts the column",
          ],
          correctIndex: 0,
          explanation: "Like a book's index: check it, then go straight to the page.",
        },
        {
          question: "Which file lists a PHP project's dependencies?",
          options: [
            "`package.json`",
            "`vendor.json`",
            "`composer.json`",
          ],
          correctIndex: 2,
          explanation: "`vendor/` is the installed result, the way `node_modules` is.",
        },
      ],
    },
    {
      id: "web-fundamentals",
      title: "Web fundamentals — request to response",
      durationMinutes: 9,
      explanation: "Laravel is a web framework, so the last thing to be comfortable with is how the web itself works.\n\n---\n\n### 1. Basic — request and response\n\nAn <b>HTTP request</b> (a message a client sends to a server) asks the server to do something. An <b>HTTP response</b> (the server's reply) carries the result.\n\n```text\nBrowser\n   │\n   │ HTTP Request\n   ↓\nLaravel Application\n   │\n   │ Process request\n   ↓\nDatabase\n   │\n   │ Data\n   ↓\nLaravel Application\n   │\n   │ HTTP Response\n   ↓\nBrowser\n```\n\nThe browser sends `GET /users/10`, and Laravel may reply with:\n\n```json\n{\n    \"id\": 10,\n    \"name\": \"Rajan\"\n}\n```\n\nAn <b>HTTP verb</b> (the action the client wants performed) says what kind of request it is:\n\n```text\nGET     read data\nPOST    create data\nPUT     replace data\nPATCH   update part of data\nDELETE  delete data\n```\n\nApplied to a user API:\n\n```text\nGET     /users       → list users\nGET     /users/10    → get user 10\nPOST    /users       → create a user\nPATCH   /users/10    → update user 10\nDELETE  /users/10    → delete user 10\n```\n\nLaravel routes use these constantly.\n\n---\n\n### 2. Intermediate — status codes and headers\n\nA <b>status code</b> (a number saying what happened) comes back with every response. The families matter more than the individual numbers:\n\n```text\n2xx → Success\n3xx → Redirect\n4xx → Client error\n5xx → Server error\n```\n\nThe ones you will meet most:\n\n```text\n200 → OK\n201 → Created\n204 → No Content\n\n400 → Bad Request\n401 → Unauthenticated\n403 → Forbidden\n404 → Not Found\n422 → Validation Error\n\n500 → Server Error\n```\n\n`401` and `403` are the pair people confuse: 401 means we do not know who you are; 403 means we know, and you still may not.\n\nA <b>header</b> (extra information attached to a request or response) carries metadata:\n\n```http\nContent-Type: application/json\nAuthorization: Bearer token123\nAccept: application/json\n```\n\n```text\nHTTP Request\n│\n├── Method\n│   └── POST\n│\n├── URL\n│   └── /users\n│\n├── Headers\n│   ├── Content-Type\n│   └── Authorization\n│\n└── Body\n    └── User data\n```\n\nA <b>cookie</b> (a small piece of data the browser stores for a site) is how information survives between requests:\n\n```text\nBrowser → Login → Server\n                    │ Set Cookie\n                    ↓\nBrowser stores it\n   │\n   │ next request sends it back\n   ↓\nServer knows the browser\n```\n\nThat is what makes login sessions possible.\n\n---\n\n### 3. Advanced — the whole journey\n\n<b>JSON</b> (a text format for exchanging structured data) is what APIs speak, and an <b>HTML form</b> is how a browser submits data without one:\n\n```html\n<form method=\"POST\" action=\"/users\">\n    <input type=\"text\" name=\"name\">\n    <input type=\"email\" name=\"email\">\n    <button type=\"submit\">Create User</button>\n</form>\n```\n\n```text\nUser → fills form → POST /users → Laravel → Validate → Save\n```\n\nPut it all together and a single request to `/users/10` looks like this:\n\n```text\n┌──────────────┐\n│   Browser    │\n└──────┬───────┘\n       │ GET /users/10\n       ↓\n┌──────────────┐\n│    Router    │  find the matching route\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│  Controller  │  ask for the user\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│    Model     │  SQL query\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│   Database   │\n└──────┬───────┘\n       │ user data\n       ↓\n┌──────────────┐\n│  Controller  │  build the response\n└──────┬───────┘\n       ↓\n┌──────────────┐\n│   Browser    │\n└──────────────┘\n```\n\nDo not memorise this. You will build each box during the 30 days — router on day 2, controllers on day 3, models and Eloquent later. Recognising the shape now is enough.\n\n---\n\n### You are ready\n\nThe goal of Phase 0 is not mastery:\n\n```text\nPHP fundamentals + Composer + Git + SQL + Web fundamentals\n                          │\n                          ↓\n                      Laravel 13\n                          │\n                          ↓\n                    30-Day Journey\n```\n\nIf the ideas above make sense, start Day 1. Laravel will teach you how the pieces fit together.",
      diagram: `One request, end to end

┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ GET /users/10
       ↓
┌──────────────┐
│    Router    │   day 2
└──────┬───────┘
       ↓
┌──────────────┐
│  Controller  │   day 3
└──────┬───────┘
       ↓
┌──────────────┐
│    Model     │   Eloquent, later
└──────┬───────┘
       ↓
┌──────────────┐
│   Database   │
└──────┬───────┘
       │ user data
       ↓
┌──────────────┐
│  Controller  │
└──────┬───────┘
       ↓
┌──────────────┐
│   Browser    │
└──────────────┘


Verbs, mapped to one resource

GET     /users       list
GET     /users/10    read one
POST    /users       create
PATCH   /users/10    update part
DELETE  /users/10    delete


Status codes, by family

2xx  Success          200 OK, 201 Created, 204 No Content
3xx  Redirect
4xx  Client error     400, 401, 403, 404, 422
5xx  Server error     500

401 = we do not know who you are
403 = we do, and you still may not


What Phase 0 adds up to

PHP + Composer + Git + SQL + Web
              │
              ↓
          Laravel 13
              │
              ↓
        30-Day Journey`,
      codeExample: {
        title: "Verbs, status codes, headers and a form",
        code: `# ── A request is a verb, a URL, headers and sometimes a body ──────
POST /users HTTP/1.1
Content-Type: application/json
Authorization: Bearer token123
Accept: application/json

{
    "name": "Rajan",
    "email": "rajan@example.com"
}

# ── The response carries a status code and a body ─────────────────
HTTP/1.1 201 Created
Content-Type: application/json

{
    "id": 10,
    "name": "Rajan"
}

# ── The five verbs against one resource ───────────────────────────
GET     /users        # list them
GET     /users/10     # read one
POST    /users        # create
PATCH   /users/10     # update part of it
DELETE  /users/10     # delete

# ── Status codes worth knowing on sight ───────────────────────────
# 200 OK            204 No Content       401 Unauthenticated
# 201 Created       400 Bad Request      403 Forbidden
#                   404 Not Found        422 Validation Error
#                                        500 Server Error

# 401 = we do not know who you are
# 403 = we do know, and you still may not

<!-- A browser submits a form without any JSON involved -->
<form method="POST" action="/users">
    <input type="text" name="name">
    <input type="email" name="email">
    <button type="submit">Create User</button>
</form>

<!-- User fills it in → POST /users → Laravel validates → saves -->`,
      },
      keyTakeaways: [
        "A <b>request</b> asks the server to do something; a <b>response</b> carries the result back.",
        "The <b>verb</b> says what kind of action it is: GET, POST, PUT, PATCH, DELETE.",
        "Status codes come in families: <b>2xx</b> success, <b>3xx</b> redirect, <b>4xx</b> client, <b>5xx</b> server.",
        "<b>401</b> means we do not know who you are; <b>403</b> means we do, and you still may not.",
        "<b>Headers</b> carry metadata such as `Content-Type` and `Authorization`.",
        "A <b>cookie</b> is what lets a server recognise the same browser on the next request.",
        "The full journey is Browser → Router → Controller → Model → Database and back — you build each box during the 30 days.",
      ],
      commonMistakes: [
        "<b>Using GET to change data</b> — browsers and proxies may repeat a GET freely, so a GET that deletes something will eventually delete it twice.",
        "<b>Returning 200 for an error</b> — a body saying `error` with a 200 status makes every client treat the failure as success.",
        "<b>Confusing 401 with 403</b> — sending 403 to a logged-out user hides the fact that logging in would fix it.",
        "<b>Trying to memorise the request lifecycle now</b> — you will build the router, controller and model yourself over the 30 days. Recognising the shape is enough today.",
      ],
      quiz: [
        {
          question: "Which HTTP method is normally used to create a resource?",
          options: [
            "GET",
            "POST",
            "DELETE",
            "PATCH",
          ],
          correctIndex: 1,
          explanation: "`PATCH` updates part of an existing resource; `POST` creates a new one.",
        },
        {
          question: "What does HTTP 404 usually mean?",
          options: [
            "Success",
            "Created",
            "Not Found",
            "Server Error",
          ],
          correctIndex: 2,
          explanation: "It is a 4xx, so the problem is with the request, not the server.",
        },
        {
          question: "What is the difference between 401 and 403?",
          options: [
            "401 means we do not know who you are; 403 means we do, and you still may not",
            "They are interchangeable",
            "401 is a server error",
          ],
          correctIndex: 0,
          explanation: "Sending 403 to a logged-out user hides the fact that logging in would fix it.",
        },
        {
          question: "What is a cookie for?",
          options: [
            "Letting the server recognise the same browser on the next request",
            "Storing files on the server",
            "Encrypting the response body",
          ],
          correctIndex: 0,
          explanation: "That is what makes a login session possible across requests.",
        },
        {
          question: "In the request lifecycle, what comes between the Router and the Database?",
          options: [
            "The browser",
            "Nothing, the router queries the database",
            "The Controller and the Model",
          ],
          correctIndex: 2,
          explanation: "Router → Controller → Model → Database, then back out as a response.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is a class?",
      options: [
        "A blueprint for creating objects",
        "A database table",
        "An HTTP request",
        "A Git branch",
      ],
      correctIndex: 0,
      explanation: "`new User()` turns the blueprint into an object you can use.",
    },
    {
      question: "What does an interface provide?",
      options: [
        "A database connection",
        "A contract that a class must follow",
        "A Git repository",
        "A browser cookie",
      ],
      correctIndex: 1,
      explanation: "It says which methods must exist, never how they work.",
    },
    {
      question: "What does `?string` mean?",
      options: [
        "String or `null` is allowed",
        "Only strings are allowed",
        "Only integers are allowed",
        "Anything is allowed",
      ],
      correctIndex: 0,
      explanation: "The `?` adds `null` to whatever type follows it.",
    },
    {
      question: "What is a trait for?",
      options: [
        "Connecting to a database",
        "Sharing methods between unrelated classes",
        "Defining a route",
      ],
      correctIndex: 1,
      explanation: "A real parent-child relationship is what inheritance is for.",
    },
    {
      question: "What is Composer?",
      options: [
        "A JavaScript framework",
        "A database",
        "PHP's dependency manager",
        "An HTTP server",
      ],
      correctIndex: 2,
      explanation: "It is to PHP what npm is to JavaScript.",
    },
    {
      question: "Which command do you run after cloning a Laravel project?",
      options: [
        "`composer update`",
        "`npm install`",
        "`composer install`",
      ],
      correctIndex: 2,
      explanation: "`install` uses the recorded versions; `update` would look for newer ones.",
    },
    {
      question: "What does an SQL JOIN do?",
      options: [
        "Deletes tables",
        "Starts Laravel",
        "Creates a Git branch",
        "Combines related data from more than one table",
      ],
      correctIndex: 3,
      explanation: "`users.id → orders.user_id` is the idea behind `hasMany` in Eloquent.",
    },
    {
      question: "Which HTTP method is normally used to create a resource?",
      options: [
        "GET",
        "DELETE",
        "POST",
        "PATCH",
      ],
      correctIndex: 2,
      explanation: "`PATCH` updates part of an existing resource; `POST` creates a new one.",
    },
    {
      question: "What does HTTP 404 usually mean?",
      options: [
        "Success",
        "Not Found",
        "Created",
        "Server Error",
      ],
      correctIndex: 1,
      explanation: "It is a 4xx, so the problem is with the request, not the server.",
    },
    {
      question: "What is the goal of Phase 0?",
      options: [
        "To understand the ideas well enough to follow the Laravel lessons",
        "To master PHP, Git, SQL and HTTP before starting",
        "To build a Laravel application",
      ],
      correctIndex: 0,
      explanation: "Do not memorise Phase 0. Understand the ideas; Laravel teaches how they fit.",
    },
  ],
};
