import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_14_LESSONS: LessonDay = {
  day: 14,
  title: "Eloquent basics — models, CRUD, soft deletes & events",
  totalMinutes: 95,
  difficulty: "Beginner",
  lessons: [
    {
      id: "models-and-conventions",
      title: "Models, and the conventions behind them",
      durationMinutes: 11,
      explanation: "For two days you have been writing `DB::table('users')`. Today that becomes `User`.\n\n<b>Eloquent</b> is Laravel's <b>ORM</b> (an <i>object-relational mapper</i>, a system that lets you work with database rows as PHP objects). Instead of thinking in tables and rows, you think in models:\n\n```text\nQuery Builder            Eloquent\n─────────────            ────────\nDatabase                 PHP\n   ↓                      ↓\nTable                   Model\n   ↓                      ↓\nRows                  Database Table\n   ↓                      ↓\nSQL                     Rows\n```\n\n```php\n$user = User::find(1);\n\necho $user->name;\n```\n\ninstead of:\n\n```sql\nSELECT * FROM users WHERE id = 1;\n```\n\n---\n\n### 1. Basic — what a model actually is\n\nA <b>model</b> (a PHP class that represents a database table) is remarkably small:\n\n```php\n<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass User extends Model\n{\n    //\n}\n```\n\nThat empty class can already query the `users` table, create rows, update them and delete them. Everything comes from `extends Model`.\n\n```text\nUser.php\n   ↓\nUser model\n   ↓\nusers table\n   ├── id\n   ├── name\n   ├── email\n   └── created_at\n```\n\nCreate one with Artisan:\n\n```bash\nphp artisan make:model Product\n```\n\n```text\napp/Models/Product.php\n```\n\nAnd because a model rarely arrives alone, the flags save you four more commands:\n\n```bash\nphp artisan make:model Product -mcrsf\n```\n\n```text\n-m  migration\n-c  controller\n-r  make that controller a resource controller\n-s  seeder\n-f  factory\n```\n\n```text\nProduct.php\ncreate_products_table.php\nProductController.php\nProductFactory.php\nProductSeeder.php\n```\n\n---\n\n### 2. Intermediate — the conventions\n\nThat empty class works because Eloquent assumes things. This is <b>convention over configuration</b> (the framework picks sensible defaults so you only write what differs).\n\nThe table name is the plural, snake_case form of the class name:\n\n```text\nModel        Table\n─────────────────────\nUser         users\nPost         posts\nOrder        orders\nBlogPost     blog_posts\n```\n\nAnd three more assumptions:\n\n```text\nprimary key    id\ntimestamps     created_at, updated_at\nnamespace      App\\Models\n```\n\nName your tables the way yesterday's migrations did and you will never think about this again. The pluralisation is English-aware, so `Person` finds `people`, though a model with an unusual name is worth checking once.\n\n---\n\n### 3. Advanced — when the convention does not fit\n\nInherited databases rarely follow anyone's convention. Every assumption has an override.\n\nA table with a different name:\n\n```php\nclass BlogPost extends Model\n{\n    protected $table = 'blog_entries';\n}\n```\n\nA different primary key:\n\n```php\nclass User extends Model\n{\n    protected $primaryKey = 'user_id';\n}\n```\n\nAnd the ones you meet in legacy schemas:\n\n```php\npublic $timestamps = false;        // no created_at / updated_at\nprotected $keyType = 'string';     // a non-integer key\npublic $incrementing = false;      // the database does not generate it\nprotected $connection = 'legacy';  // the second connection from Day 12\n```\n\nOne useful rule: <b>an override is a statement that this table is unusual.</b> On a table you are creating yourself, prefer renaming the table over adding a `$table` property, because a convention everybody knows beats a configuration line everybody has to read.",
      diagram: `Two ways of thinking about the same rows

  Query Builder            Eloquent
  ─────────────            ────────
  Database                 PHP
     ↓                      ↓
  Table                   Model
     ↓                      ↓
  Rows                  Database Table
     ↓                      ↓
  SQL                     Rows

  DB::table('users')->where('id', 1)->first()
  User::find(1)


An empty class is a working model

  class User extends Model {}

  User.php
     ↓
  User model
     ↓
  users table
     ├── id
     ├── name
     ├── email
     └── created_at

  Everything comes from extends Model.


make:model, with company

  php artisan make:model Product -mcrsf

  -m  migration          create_products_table.php
  -c  controller         ProductController.php
  -r  resource controller
  -s  seeder             ProductSeeder.php
  -f  factory            ProductFactory.php


What Eloquent assumes, and how to override it

  Model        Table
  ─────────────────────
  User         users
  Post         posts
  BlogPost     blog_posts

  primary key   id                 protected \$primaryKey = 'user_id';
  table         plural snake_case  protected \$table = 'blog_entries';
  timestamps    created_at/updated_at   public \$timestamps = false;
  key type      integer            protected \$keyType = 'string';
  connection    the default        protected \$connection = 'legacy';

  An override says "this table is unusual".
  On a table you own, rename the table instead.`,
      codeExample: {
        title: "A model, and every convention it relies on",
        code: `<?php
// app/Models/User.php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class User extends Model
{
    //
}

// That is enough to query, create, update and delete rows
// in the users table.


<?php
// ---------- Using it ----------

use App\\Models\\User;

$user = User::find(1);

echo $user->name;         // a column, read as a property
echo $user->created_at;   // already a date object

$user->name = 'Rajan';
$user->save();


<?php
// ---------- When the conventions do not fit ----------

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class BlogPost extends Model
{
    // Convention would look for blog_posts.
    protected $table = 'blog_entries';

    // Convention would look for id.
    protected $primaryKey = 'entry_id';

    // A UUID rather than an auto-incrementing integer.
    protected $keyType = 'string';
    public $incrementing = false;

    // This table has no created_at / updated_at.
    public $timestamps = false;

    // Not the default connection. The legacy database from Day 12.
    protected $connection = 'legacy';
}


# ---------- Generating one ----------

php artisan make:model Product

# Everything a new resource usually needs, in one command:
php artisan make:model Product -mcrsf

#   -m  migration
#   -c  controller
#   -r  resource controller
#   -s  seeder
#   -f  factory`,
      },
      keyTakeaways: [
        "<b>Eloquent is an object-relational mapper: it hands you database rows as PHP objects.</b>",
        "<b>A model is a PHP class representing a table</b>, and an empty class extending `Model` already works.",
        "`php artisan make:model Product` creates it; `-mcrsf` also generates the migration, controller, seeder and factory.",
        "<b>The table name is the plural, snake_case form of the class name</b>, so `BlogPost` finds `blog_posts`.",
        "Eloquent also assumes an `id` primary key and `created_at` / `updated_at` timestamps.",
        "This is <b>convention over configuration</b>: defaults you only override when your table differs.",
        "`$table`, `$primaryKey`, `$keyType`, `$incrementing`, `$timestamps` and `$connection` are the overrides.",
        "<b>An override signals an unusual table</b>, so on a table you control, rename the table instead.",
      ],
      commonMistakes: [
        "<b>Putting models outside `App\\Models`.</b> Laravel's generators and conventions expect them there.",
        "<b>Naming the model in the plural.</b> `Users` would look for a `userss` table.",
        "<b>Adding `$table` because the pluralisation looked wrong without checking.</b> Eloquent handles most irregular plurals.",
        "<b>Leaving `$timestamps = true` on a table with no timestamp columns.</b> Every insert then fails.",
        "<b>Overriding conventions on a brand new table.</b> Rename the table and delete the configuration line.",
      ],
      quiz: [
        {
          question: "What table does `class BlogPost extends Model` use by default?",
          options: ["blogpost", "blog_posts", "blogPosts", "BlogPosts"],
          correctIndex: 1,
          explanation: "The plural, snake_case form of the class name.",
        },
        {
          question: "What does an empty class extending `Model` give you?",
          options: [
            "Nothing until you configure the table",
            "Full query, create, update and delete behaviour for its table",
            "Only read access",
            "A migration",
          ],
          correctIndex: 1,
          explanation: "Everything comes from `extends Model` plus the conventions.",
        },
        {
          question: "Your table's primary key is `user_id`. What do you add?",
          options: [
            "`protected $table = 'user_id';`",
            "`protected $primaryKey = 'user_id';`",
            "`public $incrementing = false;`",
            "Nothing, Eloquent detects it",
          ],
          correctIndex: 1,
          explanation: "Eloquent assumes `id` unless you say otherwise.",
        },
        {
          question: "What does `php artisan make:model Product -mcrsf` create?",
          options: [
            "Only the model",
            "The model plus a migration, resource controller, seeder and factory",
            "The model and a test",
            "A model and its relationships",
          ],
          correctIndex: 1,
          explanation: "It saves four more commands when starting a new resource.",
        },
      ],
    },
    {
      id: "retrieving-models",
      title: "Retrieving models — all, find, first & friends",
      durationMinutes: 12,
      explanation: "Reading rows, now that rows are objects.\n\n---\n\n### 1. Basic — `all()` and `find()`\n\n```php\n$users = User::all();\n```\n\n```text\nusers table\n    ↓\nUser::all()\n    ↓\nCollection\n    ↓\nUser objects\n```\n\nNote what comes back: <b>a collection of `User` objects</b>, not an array of plain rows. Every helper you know from a Laravel collection works on it, and every object inside understands the model.\n\n```php\nforeach ($users as $user) {\n    echo $user->name;\n}\n```\n\n`find()` looks a row up by primary key:\n\n```php\n$user = User::find(10);   // WHERE id = 10\n```\n\nand hands back `null` when there is no such row. It also takes an array:\n\n```php\n$users = User::find([1, 2, 3]);\n```\n\n<b>`all()` deserves one warning.</b> It fetches every row in the table, so it belongs on a small reference table and nowhere near `users` in production. On anything that grows, filter first.\n\n---\n\n### 2. Intermediate — the missing-row family\n\nFour methods, four ways of answering \"what if it is not there?\":\n\n```php\nUser::find(10);                       // null\nUser::where('email', $email)->first(); // null\nUser::findOrFail(10);                  // throws → 404\nUser::where(...)->firstOrFail();       // throws → 404\n```\n\n<b>`firstOrFail()` and `findOrFail()` throw `ModelNotFoundException`</b>, and Laravel's exception handling from Day 11 turns that into a 404 without you writing anything:\n\n```text\nQuery\n  ↓\nFound?\n ├── YES → the model\n └── NO\n      ↓\n  exception\n      ↓\n    404\n```\n\nThat is why controllers are usually cleaner with `findOrFail()`. The alternative is the `if ($user === null) abort(404)` you would otherwise write on every single action.\n\nWhen you want a fallback rather than an error:\n\n```php\n$user = User::findOr(10, fn () => 'User not found');\n```\n\n```text\nfind(10)\n   ↓\nFound?\n ├── YES → the model\n └── NO  → your closure's return value\n```\n\nAnd a rule that saves an hour of debugging: <b>the `OrFail` methods throw, they do not return `false`.</b> Wrapping one in an `if` will not catch anything.\n\n---\n\n### 3. Advanced — models are query builders\n\nEverything from yesterday works on a model:\n\n```php\n$users = User::where('active', true)\n    ->whereIn('role', ['admin', 'manager'])\n    ->orderByDesc('created_at')\n    ->paginate(20);\n```\n\n```text\nUser::where()\n      ↓\nthe same Query Builder\n      ↓\nDatabase\n      ↓\nUser models        ← the difference\n```\n\nA static call like `User::where()` quietly starts a query for you. `User::query()` does the same thing more explicitly, which reads better when you are building up a query in stages.\n\nSo what is actually different?\n\n```text\nQuery Builder                Eloquent\n─────────────                ────────\nDB::table('users')->get()    User::query()->get()\n      ↓                            ↓\nplain row objects            User models\n                                   ↓\n                             casts, events, accessors,\n                             relationships, soft deletes\n```\n\nThe query is the same; what comes back is not. A plain row is data. A model is data plus every behaviour you are about to give it in the next six lessons.\n\nSo the choice is not about power:\n\n```text\nWorking with your application's things?   →  Eloquent\nA report, an aggregate, a bulk operation? →  Query Builder\n```\n\nOne last convenience worth knowing early: <b>route model binding.</b> Type-hint a model in a controller and Laravel does the `findOrFail()` for you.\n\n```php\npublic function show(User $user)\n{\n    return view('users.show', compact('user'));\n}\n```\n\nA missing id becomes a 404 before your method runs.",
      diagram: `What comes back

  users table
      ↓
  User::all()
      ↓
  Collection
      ↓
  User objects        not plain rows

  ⚠️  all() fetches EVERY row. Fine for a small reference
      table, not for users in production. Filter first.


Four answers to "what if it is missing?"

  User::find(10)                        →  null
  User::where(...)->first()             →  null
  User::findOrFail(10)                  →  throws → 404
  User::where(...)->firstOrFail()       →  throws → 404
  User::findOr(10, fn () => 'fallback') →  your closure's value

  Query
    ↓
  Found?
   ├── YES → the model
   └── NO
        ↓
    ModelNotFoundException
        ↓
      404, handled by Laravel

  The OrFail methods THROW. They never return false,
  so wrapping one in an if catches nothing.


Same query, different return

  Query Builder                Eloquent
  ─────────────                ────────
  DB::table('users')->get()    User::query()->get()
        ↓                            ↓
  plain row objects            User models
                                     ↓
                               casts, events, accessors,
                               relationships, soft deletes

  Your application's things?   →  Eloquent
  Reports, aggregates, bulk?   →  Query Builder`,
      codeExample: {
        title: "Every way to fetch a model",
        code: `<?php

use App\\Models\\User;

// ---------- Everything ----------

$users = User::all();       // a Collection of User objects

foreach ($users as $user) {
    echo $user->name;
}

// ⚠️ Every row in the table. Filter instead on anything large.


// ---------- By primary key ----------

$user  = User::find(10);          // null when missing
$users = User::find([1, 2, 3]);   // a collection


// ---------- By anything else ----------

$user = User::where('email', 'rajan@example.com')->first();


// ---------- When missing should be a 404 ----------

$user = User::findOrFail(10);
$user = User::where('email', $email)->firstOrFail();

// Throws ModelNotFoundException, which Laravel's exception
// handling turns into a 404. No if-statement needed.

// ❌ This catches nothing: the method throws, it does not return false.
if (! User::findOrFail(10)) {
    abort(404);
}


// ---------- When missing should be a fallback ----------

$name = User::findOr(10, fn () => 'Unknown user');


// ---------- Models are query builders ----------

$users = User::where('active', true)
    ->whereIn('role', ['admin', 'manager'])
    ->orderByDesc('created_at')
    ->orderBy('id')
    ->paginate(20)
    ->withQueryString();

// User::query() is the same thing, written explicitly.
$query = User::query();

if ($search) {
    $query->where('name', 'like', "%{$search}%");
}

$users = $query->get();


// ---------- Route model binding ----------

// Laravel resolves the id from the URL and calls findOrFail()
// before your method runs. A missing id is a 404 already.
public function show(User $user)
{
    return view('users.show', compact('user'));
}`,
      },
      keyTakeaways: [
        "<b>`User::all()` returns a collection of model objects</b>, not plain rows, but it fetches the whole table.",
        "<b>`find()` looks up by primary key</b> and returns `null` when there is no match; it also accepts an array of keys.",
        "`first()` returns the first row of a query, or `null`.",
        "<b>`findOrFail()` and `firstOrFail()` throw `ModelNotFoundException`</b>, which Laravel turns into a 404.",
        "That is why controllers are cleaner with `findOrFail()` than with a null check on every action.",
        "<b>The `OrFail` methods throw rather than returning `false`</b>, so an `if` around one catches nothing.",
        "`findOr()` runs your closure instead of throwing when the row is missing.",
        "<b>Every Query Builder method works on a model</b>, and `User::query()` starts one explicitly.",
        "<b>Route model binding type-hints the model in a controller</b> and does the `findOrFail()` for you.",
      ],
      commonMistakes: [
        "<b>Calling `all()` on a large table.</b> Every row is loaded into memory before you filter anything.",
        "<b>Wrapping `findOrFail()` in an `if`.</b> It throws, so the branch is never reached.",
        "<b>Using `find()` with a non-primary-key column.</b> `find()` only looks at the primary key.",
        "<b>Checking `if ($user)` after `firstOrFail()`.</b> If it returned, it found something.",
        "<b>Fetching a whole collection to `count()` it.</b> `User::count()` asks the database instead.",
      ],
      quiz: [
        {
          question: "What does `User::all()` return?",
          options: [
            "An array of plain rows",
            "A collection of User model objects",
            "A query builder",
            "The number of users",
          ],
          correctIndex: 1,
          explanation: "And it fetches every row, so filter first on anything large.",
        },
        {
          question: "What happens when `User::findOrFail(10)` finds nothing?",
          options: [
            "Returns null",
            "Returns false",
            "Throws `ModelNotFoundException`, which Laravel turns into a 404",
            "Creates the user",
          ],
          correctIndex: 2,
          explanation: "Which is why it removes the null check from your controllers.",
        },
        {
          question: "What is the real difference between `DB::table('users')->get()` and `User::query()->get()`?",
          options: [
            "Eloquent runs a different SQL query",
            "Eloquent returns model objects with casts, events and relationships",
            "The Query Builder cannot filter",
            "Eloquent is always faster",
          ],
          correctIndex: 1,
          explanation: "The query is the same; what comes back is not.",
        },
        {
          question: "What does route model binding do?",
          options: [
            "Validates the request",
            "Resolves the model from the URL and 404s when it is missing, before your method runs",
            "Caches the model",
            "Creates the model if absent",
          ],
          correctIndex: 1,
          explanation: "It does the `findOrFail()` for you from the type-hint.",
        },
      ],
    },
    {
      id: "creating-and-mass-assignment",
      title: "Creating models & mass assignment",
      durationMinutes: 12,
      explanation: "There are two ways to create a model, and one security concept sitting between them that Laravel will not let you skip.\n\n---\n\n### 1. Basic — `save()` and `create()`\n\nThe long way, one property at a time:\n\n```php\n$user = new User();\n\n$user->name  = 'Rajan';\n$user->email = 'rajan@example.com';\n\n$user->save();\n```\n\n```text\nnew User()\n    ↓\nset properties\n    ↓\nsave()\n    ↓\nINSERT\n```\n\nThe short way, from an array:\n\n```php\n$user = User::create([\n    'name'  => 'Rajan',\n    'email' => 'rajan@example.com',\n]);\n```\n\nBoth return a saved model with its new `id` filled in.\n\n```text\ncreate()\n ↓\narray → model → save\n\nsave()\n ↓\nmodel → save\n```\n\nThe difference that matters: <b>`create()` goes through mass-assignment rules and `save()` on individual properties does not.</b> Run `create()` on a fresh model and you will get an exception until you have read the next section.\n\n`save()` also handles updates. Called on a model that came from the database, it issues an `UPDATE` rather than an `INSERT`, and only for the columns you actually changed.\n\n---\n\n### 2. Intermediate — why mass assignment is guarded\n\n<b>Mass assignment</b> (setting many model attributes at once from an array) is convenient and, unguarded, dangerous. Here is the whole problem in one example.\n\nYour `users` table has:\n\n```text\nid\nname\nemail\nis_admin\n```\n\nAnd your controller does the tempting thing:\n\n```php\nUser::create(request()->all());\n```\n\nA user posts:\n\n```json\n{\n    \"name\": \"Rajan\",\n    \"email\": \"rajan@example.com\",\n    \"is_admin\": true\n}\n```\n\nYour form never had an `is_admin` field. It did not need one. The request is just JSON, and anybody can add a key to it.\n\n<b>`$fillable` is the allow list:</b>\n\n```php\nprotected $fillable = ['name', 'email'];\n```\n\n```text\nincoming data\n     ↓\n  $fillable\n     ↓\nallowed fields only\n     ↓\n   model\n```\n\nNow `is_admin` is silently dropped, and the attack does nothing.\n\n---\n\n### 3. Advanced — `$guarded`, and turning it off\n\n`$guarded` is the same idea inverted, a block list:\n\n```php\nprotected $guarded = ['is_admin'];\n```\n\n```text\n$fillable   allow list   only these may be mass assigned\n$guarded    block list   everything except these\n```\n\nThe difference is what happens when somebody adds a column. With `$fillable`, a new column is not assignable until you add it: the failure is a field that does not save, which you notice immediately. With `$guarded`, a new column is assignable the moment it exists: the failure is a field that should not have saved, which you notice much later.\n\n<b>Prefer `$fillable`.</b> Its mistakes are loud.\n\nAnd note that `protected $guarded = [];` means nothing is guarded at all, which is mass assignment fully open.\n\nLaravel also offers:\n\n```php\nModel::unguard();\n```\n\nwhich turns the protection off entirely. It has a legitimate home in seeders, where the data comes from you rather than from a request. Anywhere near a controller it is a mistake.\n\nThe cleanest habit, whatever you configure, is to never hand a request array straight to a model:\n\n```php\n// ❌ whatever they sent\nUser::create($request->all());\n\n// ✓ what you asked for\nUser::create($request->validate([\n    'name'  => ['required', 'string', 'max:255'],\n    'email' => ['required', 'email', 'unique:users'],\n]));\n```\n\nDay 9's validation and today's `$fillable` are two independent locks. Use both.",
      diagram: `Two ways in

  new User()                    User::create([...])
      ↓                                ↓
  set properties                 array of attributes
      ↓                                ↓
  save()                         mass-assignment rules
      ↓                                ↓
  INSERT                             INSERT

  save() on a model from the database issues an
  UPDATE instead, for the changed columns only.


The attack $fillable stops

  users table:  id  name  email  is_admin

  User::create(request()->all());

  the form has no is_admin field...
  ...but the request is just JSON, and anyone can add a key

  {
      "name": "Rajan",
      "email": "rajan@example.com",
      "is_admin": true          ← they made themselves an admin
  }

  protected \$fillable = ['name', 'email'];

  incoming data → \$fillable → allowed fields only → model
                                is_admin dropped


fillable vs guarded

  \$fillable   allow list    only these may be mass assigned
  \$guarded    block list    everything EXCEPT these

  Somebody adds a column:

  \$fillable   not assignable until you add it
              → the field does not save, you notice at once

  \$guarded    assignable the moment it exists
              → the field saves when it should not, you notice later

  Prefer \$fillable. Its mistakes are loud.

  \$guarded = []      nothing guarded at all
  Model::unguard()   protection off. Seeders only.


Two independent locks

  request → validate() → \$fillable → model
             Day 9        today

  Never hand \$request->all() straight to a model.`,
      codeExample: {
        title: "Creating models without opening a hole",
        code: `<?php
// app/Models/User.php

class User extends Model
{
    // The allow list. Anything not here is dropped by create().
    protected $fillable = [
        'name',
        'email',
    ];

    // The alternative, a block list. Prefer $fillable.
    // protected $guarded = ['is_admin'];
}


<?php
// ---------- Property by property ----------

$user = new User();

$user->name  = 'Rajan';
$user->email = 'rajan@example.com';

$user->save();

echo $user->id;   // filled in after save()

// Direct property assignment is NOT mass assignment,
// so $fillable does not apply here.


// ---------- From an array ----------

$user = User::create([
    'name'  => 'Rajan',
    'email' => 'rajan@example.com',
]);


// ---------- The vulnerability ----------

// ❌ Whatever they sent, straight into the model.
User::create($request->all());

// A request body they control:
// { "name": "Rajan", "email": "...", "is_admin": true }
//
// With no $fillable, that user is now an administrator.


// ---------- The fix, twice over ----------

// 1. Validation decides what you accept.
$data = $request->validate([
    'name'  => ['required', 'string', 'max:255'],
    'email' => ['required', 'email', 'unique:users'],
]);

// 2. $fillable decides what the model accepts.
$user = User::create($data);

// Anything not in both lists never reaches the database.


// ---------- Updating an existing model ----------

$user = User::findOrFail(1);

$user->name = 'Rajan Updated';
$user->save();          // UPDATE, only the changed column


// ---------- Turning protection off ----------

// Legitimate in a seeder, where the data is yours.
Model::unguard();
// ... seed ...
Model::reguard();

// Never near a controller.`,
      },
      keyTakeaways: [
        "<b>`save()` sets properties then writes; `create()` takes an array and writes in one call.</b>",
        "`save()` on a model loaded from the database issues an `UPDATE` for the changed columns.",
        "<b>Mass assignment is setting many attributes at once from an array</b>, and only `create()` and `update()` use it.",
        "Direct property assignment bypasses mass-assignment rules entirely, which is why `save()` needs no `$fillable`.",
        "<b>`$fillable` is an allow list</b>: only the listed attributes can be mass assigned.",
        "<b>`$guarded` is a block list</b>, and `$guarded = []` means no protection at all.",
        "<b>Prefer `$fillable`, because a forgotten column fails loudly</b> rather than silently becoming writable.",
        "`Model::unguard()` disables the protection and belongs in seeders, never near a controller.",
        "<b>Validate the request and set `$fillable`</b>: two independent locks, and neither replaces the other.",
      ],
      commonMistakes: [
        "<b>Passing `$request->all()` into `create()`.</b> Anyone can add a key your form never had.",
        "<b>Setting `$guarded = []` to make an error go away.</b> That removes the protection entirely.",
        "<b>Assuming validation is enough.</b> It guards the request; `$fillable` guards the model.",
        "<b>Wondering why a field does not save.</b> It is missing from `$fillable` and was silently dropped.",
        "<b>Calling `Model::unguard()` in application code.</b> It is a seeding tool, not a fix.",
      ],
      quiz: [
        {
          question: "What is mass assignment?",
          options: [
            "Updating many rows at once",
            "Setting many model attributes at once from an array",
            "Saving several models in a transaction",
            "Assigning a model to a variable",
          ],
          correctIndex: 1,
          explanation: "Which is what `create()` and `update()` do, and why they are guarded.",
        },
        {
          question: "What does `$fillable` do?",
          options: [
            "Lists columns that must be present",
            "Lists the only attributes that may be mass assigned",
            "Lists attributes hidden from JSON",
            "Lists required validation rules",
          ],
          correctIndex: 1,
          explanation: "Anything not listed is silently dropped by `create()`.",
        },
        {
          question: "Why is `$fillable` usually safer than `$guarded`?",
          options: [
            "It is faster",
            "A newly added column is not assignable until you add it, so mistakes fail loudly",
            "`$guarded` does not work with `create()`",
            "It also validates the values",
          ],
          correctIndex: 1,
          explanation: "With `$guarded`, a new column becomes writable the moment it exists.",
        },
        {
          question: "Does `$fillable` apply when you write `$user->is_admin = true; $user->save();`?",
          options: [
            "Yes, it is blocked",
            "No, direct property assignment is not mass assignment",
            "Only in production",
            "Only if the model is new",
          ],
          correctIndex: 1,
          explanation: "Mass assignment is about arrays; the guard exists for request data.",
        },
      ],
    },
    {
      id: "updating-and-find-or-create",
      title: "Updating, firstOrCreate & updateOrCreate",
      durationMinutes: 11,
      explanation: "Three ways to change data, and one difference between them that surprises everybody once.\n\n---\n\n### 1. Basic — updating one model\n\n```php\n$user = User::findOrFail(1);\n\n$user->name = 'Rajan Updated';\n\n$user->save();\n```\n\n```text\nfind()\n  ↓\nmodel\n  ↓\nchange\n  ↓\nsave()\n  ↓\nUPDATE\n```\n\nOr in one call, which uses mass-assignment rules:\n\n```php\n$user->update(['name' => 'Rajan Updated']);\n```\n\n`save()` is clever about this. It tracks which attributes changed and writes only those columns, so setting a name does not rewrite the whole row. You can ask it what changed:\n\n```php\n$user->isDirty('email');   // changed but not yet saved\n$user->wasChanged('name'); // changed by the last save\n$user->getOriginal('name'); // the value before you touched it\n```\n\n---\n\n### 2. Intermediate — find it, or make it\n\n<b>`firstOrCreate()`</b> answers \"find this, and create it if it is not there\":\n\n```php\n$user = User::firstOrCreate(\n    ['email' => 'rajan@example.com'],   // how to find it\n    ['name'  => 'Rajan'],               // extra values if creating\n);\n```\n\n```text\nsearch by email\n     ↓\nFound?\n ┌───┴────┐\nYES       NO\n ↓         ↓\nreturn   create\n```\n\n<b>`updateOrCreate()`</b> goes one step further and updates the row when it does exist:\n\n```php\n$user = User::updateOrCreate(\n    ['email' => 'rajan@example.com'],\n    ['name'  => 'Rajan Updated'],\n);\n```\n\n```text\nsearch by email\n      ↓\n ┌────┴─────┐\nfound     not found\n  ↓           ↓\nupdate      create\n```\n\nBoth take the same two arrays, and the split is the thing to remember: <b>the first array is how to find the row, the second is what to set.</b> Attributes in the first array are used for both.\n\nThese are the tools for importing and syncing. Pulling a customer list from an external system nightly is `updateOrCreate()` in a loop, and it stays correct however many times it runs.\n\nOne caveat inherited from yesterday: neither is atomic. Two simultaneous requests can both find nothing and both create. A unique index on the search column is what actually prevents the duplicate, so put one there.\n\nThere is also `firstOrNew()`, which builds the model without saving it, for when you want to adjust it first.\n\n---\n\n### 3. Advanced — mass updates skip your model\n\nThis updates many rows in one statement:\n\n```php\nUser::where('active', false)->update(['status' => 'inactive']);\n```\n\nIt is fast, and it has a consequence worth understanding properly.\n\n<b>A mass update goes straight to the database. No models are loaded, so no model events fire.</b> The `updating` and `updated` events from two lessons' time, any observer you have written, any logic sitting in them, none of it runs. The same is true of `Model::where(...)->delete()`.\n\n```text\n$user->update([...])              User::where(...)->update([...])\n      ↓                                   ↓\none model is loaded               one UPDATE statement\n      ↓                                   ↓\nupdating / updated fire           no models, no events\n```\n\nNeither is wrong. They are answers to different questions:\n\n```text\nA handful of rows, with model behaviour?   →  load and save each\nThousands of rows, no side effects needed? →  one mass update\n```\n\nIf you need both, loop with `chunkById()` from yesterday and call `save()` on each model. Slower, but every event fires.\n\nTwo more that bypass the model entirely, worth naming because they look like Eloquent:\n\n```php\nUser::insert([[...], [...]]);   // no events, and no $fillable either\nUser::truncate();                // empties the table, no events\n```\n\n<b>`insert()` skipping `$fillable` is the surprising one</b>, since it is the query builder underneath rather than the model.\n\nThe symptom to recognise: a listener that works when you edit one record and silently does nothing after a bulk operation. That is this, every time.",
      diagram: `Updating one model

  find()  →  model  →  change  →  save()  →  UPDATE

  save() writes only the columns that actually changed.

  \$user->isDirty('email')      changed, not yet saved
  \$user->wasChanged('name')    changed by the last save
  \$user->getOriginal('name')   the value before you touched it


Find it, or make it

  firstOrCreate(['email' => ...], ['name' => ...])

    search by email
         ↓
      Found?
     ┌───┴────┐
    YES       NO
     ↓         ↓
   return    create

  updateOrCreate(['email' => ...], ['name' => ...])

    search by email
          ↓
     ┌────┴─────┐
   found     not found
     ↓           ↓
   update      create

  1st array = how to find it
  2nd array = what to set

  Neither is atomic. A unique index on the search
  column is what actually prevents duplicates.


The one that surprises everybody

  \$user->update([...])          User::where(...)->update([...])
        ↓                              ↓
  the model is loaded            one UPDATE statement
        ↓                              ↓
  updating / updated fire        NO models, NO events
  observers run                  observers never run

  Same for Model::where(...)->delete()

  Symptom: a listener that works when you edit one record
  and silently does nothing after a bulk operation.

  Need both? chunkById() and save() each model.`,
      codeExample: {
        title: "Updating one row, many rows, and rows that may not exist",
        code: `<?php

use App\\Models\\User;

// ---------- One model ----------

$user = User::findOrFail(1);

$user->name = 'Rajan Updated';
$user->save();          // UPDATE, changed columns only

// The same thing through mass assignment.
$user->update(['name' => 'Rajan Updated']);


// ---------- What changed ----------

$user->name = 'New name';

$user->isDirty();            // true: unsaved changes
$user->isDirty('name');      // true
$user->getOriginal('name');  // the value before the change

$user->save();

$user->wasChanged('name');   // true: the last save changed it


// ---------- Find it, or create it ----------

$user = User::firstOrCreate(
    ['email' => 'rajan@example.com'],   // how to find it
    ['name'  => 'Rajan'],               // extra values when creating
);

// Build it without saving, so you can adjust it first.
$user = User::firstOrNew(['email' => 'rajan@example.com']);
$user->name = 'Rajan';
$user->save();


// ---------- Update it, or create it ----------

// The shape of every nightly import.
foreach ($rowsFromTheApi as $row) {
    User::updateOrCreate(
        ['email' => $row['email']],
        ['name' => $row['name'], 'plan' => $row['plan']],
    );
}

// Add a unique index on email. Two simultaneous requests can
// both find nothing and both create; the index is what stops it.


// ---------- Mass update: fast, and event-free ----------

User::where('active', false)->update(['status' => 'inactive']);

// One UPDATE statement. No models are loaded, so:
//   - no updating / updated events
//   - no observers
//   - no accessors or mutators

// Need the events? Load each model instead.
User::where('active', false)
    ->chunkById(500, function ($users) {
        foreach ($users as $user) {
            $user->update(['status' => 'inactive']);   // events fire
        }
    });`,
      },
      keyTakeaways: [
        "<b>Change properties then call `save()`</b>, or use `update()` to do both in one call.",
        "`save()` writes only the columns that actually changed.",
        "`isDirty()`, `wasChanged()` and `getOriginal()` tell you what changed and what it was before.",
        "<b>`firstOrCreate()` finds a row or creates it</b>; the first array is how to find it, the second is what to set.",
        "<b>`updateOrCreate()` updates the row when it exists</b>, which is the shape of every import and sync.",
        "`firstOrNew()` builds the model without saving, for when you want to adjust it first.",
        "Neither is atomic, so <b>a unique index on the search column is what actually prevents duplicates.</b>",
        "<b>A mass update runs one statement and loads no models, so no model events or observers fire.</b>",
        "The same applies to `Model::where(...)->delete()`; loop with `chunkById()` when you need the events.",
      ],
      commonMistakes: [
        "<b>Expecting observers to run after a mass update.</b> No models are loaded, so nothing fires.",
        "<b>Swapping the two arrays of `updateOrCreate()`.</b> The first finds the row, the second sets values.",
        "<b>Relying on `firstOrCreate()` alone to prevent duplicates.</b> Two requests can both create; add a unique index.",
        "<b>Looping `save()` over thousands of rows when no events are needed.</b> One mass update does it in a single statement.",
        "<b>Forgetting `save()` after `firstOrNew()`.</b> The model exists in PHP and nowhere else.",
      ],
      quiz: [
        {
          question: "What are the two arrays passed to `updateOrCreate()`?",
          options: [
            "The values, then the validation rules",
            "How to find the row, then what to set",
            "What to set, then how to find the row",
            "The columns, then the connection",
          ],
          correctIndex: 1,
          explanation: "The search attributes are used for both finding and creating.",
        },
        {
          question: "Why do observers not run after `User::where('active', false)->update([...])`?",
          options: [
            "Observers only work on creates",
            "It runs one statement without loading any models, so no model events fire",
            "The query is cached",
            "Mass updates run in a queue",
          ],
          correctIndex: 1,
          explanation: "Loop with `chunkById()` and `save()` each model when you need the events.",
        },
        {
          question: "What actually prevents `firstOrCreate()` from creating a duplicate under concurrent requests?",
          options: [
            "Laravel locks the table",
            "A unique index on the search column",
            "The `$fillable` list",
            "Nothing can create a duplicate",
          ],
          correctIndex: 1,
          explanation: "Two requests can both find nothing and both create.",
        },
        {
          question: "What does `save()` write?",
          options: [
            "The whole row every time",
            "Only the columns that changed",
            "Only the primary key",
            "Nothing unless you call `update()` first",
          ],
          correctIndex: 1,
          explanation: "Eloquent tracks which attributes are dirty.",
        },
      ],
    },
    {
      id: "deleting-and-soft-deletes",
      title: "Deleting, soft deletes & pruning",
      durationMinutes: 13,
      explanation: "Deleting is easy. Deciding what deleted should mean is the interesting part.\n\n---\n\n### 1. Basic — the two deletes\n\n```php\n$user = User::findOrFail(1);\n$user->delete();\n```\n\nor without loading the model:\n\n```php\nUser::where('id', 1)->delete();\n```\n\nThe first loads the model and fires its events. The second is a mass delete, so nothing fires, exactly as with mass updates in the last lesson.\n\nThere is a third form for deleting by key, which loads each model and fires its events:\n\n```php\nUser::destroy(1);\nUser::destroy([1, 2, 3]);\n```\n\n```text\n$user->delete()          you already have the model\nUser::destroy([1, 2, 3])  you only have the keys, events still fire\nUser::where(...)->delete()  one statement, no models, no events\n```\n\nEither way, by default, the row is gone. Which raises the question every application eventually asks: was that supposed to be permanent?\n\nAn invoice deleted by accident. A user who wants their account back. An audit that needs to know a record existed. <b>Soft deletes</b> (marking a record as deleted rather than removing it) exist for all three:\n\n```text\nusers\n┌────┬───────┬─────────────────────┐\n│ id │ name  │ deleted_at          │\n├────┼───────┼─────────────────────┤\n│ 1  │ Rajan │ NULL                │\n│ 2  │ Alice │ 2026-09-01 10:00:00 │\n└────┴───────┴─────────────────────┘\n```\n\nAlice is deleted. Her row is not.\n\n---\n\n### 2. Intermediate — enabling and using them\n\nTwo steps. A column in a migration:\n\n```php\n$table->softDeletes();     // adds a nullable deleted_at\n```\n\nand a <b>trait</b> (a reusable group of PHP methods) on the model:\n\n```php\nuse Illuminate\\Database\\Eloquent\\SoftDeletes;\n\nclass User extends Model\n{\n    use SoftDeletes;\n}\n```\n\nNow `delete()` sets a timestamp instead of removing the row:\n\n```text\nBefore                    After delete()\n\nRajan                     Rajan\ndeleted_at = NULL   →     deleted_at = 2026-09-01 10:00:00\n```\n\nAnd every query quietly ignores those rows:\n\n```php\nUser::all();       // WHERE deleted_at IS NULL, added for you\n```\n\n<b>That automatic filter is the whole feature.</b> Your existing code carries on as if the rows were gone, without a single change.\n\nWhen you do want them:\n\n```php\nUser::withTrashed()->get();   // active + deleted\nUser::onlyTrashed()->get();   // deleted only\n\n$user->trashed();             // is this one deleted?\n$user->restore();             // deleted_at back to NULL\n$user->forceDelete();         // actually remove the row\n```\n\n```text\ndelete()       →  soft delete, deleted_at set\nrestore()      →  deleted_at back to NULL\nforceDelete()  →  the row is really gone\n```\n\n---\n\n### 3. Advanced — the costs, and pruning\n\nSoft deletes are not free, and the trade-offs are worth knowing before you add the trait to everything.\n\n<b>Unique indexes still see the deleted rows.</b> A soft-deleted `rajan@example.com` still occupies that email as far as the unique index is concerned, so signing up again fails. Solutions vary; the point is to expect it.\n\n<b>Foreign keys still see them too.</b> `cascadeOnDelete()` from Day 12 is a database rule and a soft delete is only an `UPDATE`, so nothing cascades. Related records stay behind, pointing at a row your application treats as gone.\n\n<b>And the table grows forever.</b> Every deleted row stays, indexes keep covering them, and queries carry them along.\n\nWhich is what <b>pruning</b> (automatically removing models that meet a cleanup condition) is for:\n\n```php\nuse Illuminate\\Database\\Eloquent\\Prunable;\n\nclass User extends Model\n{\n    use Prunable;\n\n    public function prunable()\n    {\n        return static::where('deleted_at', '<', now()->subMonth());\n    }\n}\n```\n\n```text\nsoft deleted\n     ↓\nwait 30 days\n     ↓\nprunable() matches\n     ↓\npermanently removed\n```\n\n`php artisan model:prune`, scheduled daily, does the work. You get a recovery window and a table that does not grow without limit.\n\nSo the decision, plainly:\n\n```text\nCan a person ask for this back?          →  soft delete\nDoes an audit or report need the row?    →  soft delete\nNeither, and the table is large?         →  hard delete\n```\n\nSoft-deleting everything by default is a habit that quietly makes every query slower for records nobody will ever restore.",
      diagram: `Three deletes, then a question

  \$user->delete()                 you have the model
        ↓                          events fire

  User::destroy([1, 2, 3])        you have only the keys
        ↓                          models loaded, events fire

  User::where(...)->delete()      one statement
        ↓                          no models, no events

  Both remove the row. Should they?

    an invoice deleted by accident
    a user who wants their account back
    an audit that needs to know it existed


Soft deletes: the row stays

  users
  ┌────┬───────┬─────────────────────┐
  │ id │ name  │ deleted_at          │
  ├────┼───────┼─────────────────────┤
  │ 1  │ Rajan │ NULL                │
  │ 2  │ Alice │ 2026-09-01 10:00:00 │  ← deleted
  └────┴───────┴─────────────────────┘

  migration:  \$table->softDeletes();
  model:      use SoftDeletes;

  Every query then gets  WHERE deleted_at IS NULL  for free.
  Your existing code carries on unchanged. That is the feature.

  withTrashed()   active + deleted
  onlyTrashed()   deleted only
  trashed()       is this one deleted?
  restore()       deleted_at → NULL
  forceDelete()   the row is really gone


What soft deletes cost you

  unique index    still sees the deleted row
                  → the old email cannot be reused

  foreign keys    a soft delete is only an UPDATE,
                  so cascadeOnDelete() never fires

  table size      grows forever, indexes and all


Pruning: a recovery window with an end

  soft deleted  →  wait 30 days  →  prunable()  →  really removed

  use Prunable;  +  php artisan model:prune, scheduled daily

  Can someone ask for it back?   →  soft delete
  Audit or report needs it?      →  soft delete
  Neither, and the table is big? →  hard delete`,
      codeExample: {
        title: "Soft deletes end to end",
        code: `<?php
// ---------- 1. The migration ----------

Schema::table('users', function (Blueprint $table) {
    $table->softDeletes();   // a nullable deleted_at column
});


<?php
// ---------- 2. The model ----------

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class User extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'email'];
}


<?php
// ---------- 3. Using it ----------

$user = User::findOrFail(1);

$user->delete();          // UPDATE users SET deleted_at = now()

// By key, when you do not have the model. Each one is loaded,
// so events and observers still fire.
User::destroy(1);
User::destroy([1, 2, 3]);

User::all();              // ...WHERE deleted_at IS NULL, added for you
User::find(1);            // null: it is filtered out


// ---------- Reaching the deleted rows ----------

User::withTrashed()->get();          // active + deleted
User::onlyTrashed()->get();          // deleted only
User::withTrashed()->findOrFail(1);  // a specific deleted one

$user = User::onlyTrashed()->findOrFail(1);

$user->trashed();        // true
$user->restore();        // deleted_at back to NULL
$user->forceDelete();    // now the row is really gone


// ---------- The surprises ----------

// 1. A unique index still counts the deleted row.
User::create(['email' => 'rajan@example.com']);  // fails: still taken

// 2. cascadeOnDelete() does not fire. A soft delete is an UPDATE,
//    so related rows stay, pointing at a "deleted" user.


<?php
// ---------- Pruning: keep the window, lose the growth ----------

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Prunable;
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class User extends Model
{
    use SoftDeletes, Prunable;

    public function prunable()
    {
        // Deleted more than a month ago: really remove it.
        return static::where('deleted_at', '<', now()->subMonth());
    }
}


# Run it, and schedule it daily.
php artisan model:prune`,
      },
      keyTakeaways: [
        "<b>`$user->delete()` loads the model and fires its events; `Model::where(...)->delete()` does not.</b>",
        "<b>`User::destroy([1, 2, 3])` deletes by key</b>, loading each model so events and observers still fire.",
        "<b>A soft delete marks the row as deleted rather than removing it</b>, using a `deleted_at` timestamp.",
        "Enable it with `$table->softDeletes()` in a migration and `use SoftDeletes;` on the model.",
        "<b>Every query then gets `WHERE deleted_at IS NULL` automatically</b>, so existing code needs no changes.",
        "`withTrashed()` includes deleted rows, `onlyTrashed()` returns just them, and `trashed()` tests one model.",
        "<b>`restore()` clears `deleted_at`; `forceDelete()` removes the row for real.</b>",
        "<b>A unique index still counts soft-deleted rows</b>, so a deleted email cannot simply be reused.",
        "<b>`cascadeOnDelete()` does not fire on a soft delete</b>, because the database only sees an `UPDATE`.",
        "<b>Pruning removes models matching a `prunable()` condition</b> via `php artisan model:prune`, keeping a recovery window without endless growth.",
      ],
      commonMistakes: [
        "<b>Adding the trait without the `deleted_at` column.</b> Every query then fails on a missing column.",
        "<b>Expecting related rows to disappear.</b> A soft delete is an `UPDATE`, so no foreign key cascades.",
        "<b>Being surprised that a deleted email is still taken.</b> The unique index counts the soft-deleted row.",
        "<b>Using `delete()` when you meant `forceDelete()`.</b> The row is still there, just hidden.",
        "<b>Soft-deleting every model by default.</b> Tables grow forever and every query carries rows nobody will restore.",
      ],
      quiz: [
        {
          question: "What does `$user->delete()` do on a model using `SoftDeletes`?",
          options: [
            "Removes the row",
            "Sets `deleted_at` to the current timestamp",
            "Throws unless you call `forceDelete()`",
            "Moves the row to another table",
          ],
          correctIndex: 1,
          explanation: "The row stays; every query then filters it out for you.",
        },
        {
          question: "How do you include soft-deleted rows in a query?",
          options: ["`onlyTrashed()`", "`withTrashed()`", "`restore()`", "`trashed()`"],
          correctIndex: 1,
          explanation: "`onlyTrashed()` returns the deleted rows and nothing else.",
        },
        {
          question: "Why does `cascadeOnDelete()` not fire when a model is soft deleted?",
          options: [
            "Laravel disables it for soft-deleting models",
            "The database only sees an `UPDATE`, not a `DELETE`",
            "Cascades only work on inserts",
            "It does fire",
          ],
          correctIndex: 1,
          explanation: "Related rows stay behind, pointing at a row your app treats as gone.",
        },
        {
          question: "What is model pruning for?",
          options: [
            "Removing unused columns",
            "Permanently removing models that match a cleanup condition, such as long-deleted rows",
            "Restoring soft-deleted models",
            "Compressing old rows",
          ],
          correctIndex: 1,
          explanation: "It gives you a recovery window without the table growing forever.",
        },
      ],
    },
    {
      id: "model-events-and-observers",
      title: "Model events & observers",
      durationMinutes: 12,
      explanation: "A model has a life, and Laravel lets you attach behaviour to every moment of it.\n\n---\n\n### 1. Basic — the lifecycle\n\n<b>Model events</b> (hooks Eloquent fires around database operations) come in pairs: one before, one after.\n\n```text\ncreating   →   INSERT   →   created\nupdating   →   UPDATE   →   updated\ndeleting   →   DELETE   →   deleted\n```\n\nAnd two that wrap both writes:\n\n```text\nsaving  →  creating/updating  →  created/updated  →  saved\n```\n\nSo `saving` fires whether the model is new or not, which is what you want for something like normalising an email address. `creating` fires only for a new one, which is what you want for generating a slug or a reference number.\n\nThe full list:\n\n```text\nretrieved     loaded from the database\ncreating      created\nupdating      updated\nsaving        saved\ndeleting      deleted\nrestoring     restored      (with SoftDeletes)\nreplicating\n```\n\nThe <b>before</b> events are the powerful ones. They run before anything is written, they can still change the model, and <b>returning `false` from one cancels the operation.</b>\n\n---\n\n### 2. Intermediate — small hooks on the model\n\nFor a line or two, register the listener in `booted()`:\n\n```php\nclass User extends Model\n{\n    protected static function booted(): void\n    {\n        static::creating(function (User $user) {\n            $user->uuid = (string) Str::uuid();\n        });\n\n        static::deleted(function (User $user) {\n            // clean something up\n        });\n    }\n}\n```\n\n`booted()` runs once when the model class is first used, so it is the place to register anything model-wide.\n\nThis suits behaviour that genuinely belongs to the model, such as filling a derived column. It stops suiting anything the moment it grows, and the sign is easy to spot: <b>if `booted()` needs its own imports and a paragraph of logic, it wants to be an observer.</b>\n\nOne thing to remember before you rely on any of this: <b>mass operations do not fire events.</b> `User::where(...)->update([...])` and `->delete()` never load a model, so nothing here runs. That is the same warning as the last lesson, and it matters most here.\n\n---\n\n### 3. Advanced — observers\n\n<b>An <i>observer</i></b> (a class holding the handlers for one model's events) puts all of it in one file:\n\n```bash\nphp artisan make:observer UserObserver --model=User\n```\n\n```php\nclass UserObserver\n{\n    public function created(User $user): void\n    {\n        Mail::to($user)->send(new WelcomeMail());\n    }\n\n    public function deleted(User $user): void\n    {\n        Log::info('User deleted', ['user_id' => $user->id]);\n    }\n}\n```\n\nThe method names are the event names. Nothing else registers them.\n\n```text\nUser model\n    │\n    │ event\n    ↓\nUserObserver\n    │\n    ↓\ndeleted()\n```\n\nAttach it with an attribute on the model:\n\n```php\nuse Illuminate\\Database\\Eloquent\\Attributes\\ObservedBy;\n\n#[ObservedBy([UserObserver::class])]\nclass User extends Model\n{\n}\n```\n\nOne line, right at the top of the model, which means the next person to open it can see that something observes it.\n\nA word on judgement, because this is a feature that can quietly make an application hard to follow. An observer runs invisibly. Someone reading a controller sees `$user->delete()` and has no reason to suspect that three other things happened.\n\n```text\nGood in an observer          Better elsewhere\n───────────────────          ────────────────\nfilling a derived column     charging a card\nlogging the change           a multi-step workflow\ninvalidating a cache         anything with its own errors\nsending a simple notice      anything that must be retried\n```\n\nThe test: <b>if it can fail in a way somebody needs to hear about, it does not belong in an observer.</b> Put it in the controller or a job, where the failure is visible.\n\nAnd keep observers quick. They run inside the request, so a slow one slows every save. Queue the slow part.\n\n<b>One more registration form, because it is what older codebases use:</b>\n\n```php\n// AppServiceProvider::boot()\nUser::observe(UserObserver::class);\n```\n\nIdentical in effect. The attribute is better only because it sits on the model rather than in a provider nobody opens.\n\nAnd the trap that produces a genuinely confusing bug:\n\n```php\nDB::transaction(function () use ($data) {\n    $user = User::create($data);      // created fires → welcome email sent\n\n    $this->billing->charge($user);    // throws → everything rolls back\n});\n```\n\n<b>The user row is gone. The email is not.</b> The observer fired the moment the model was created, which is inside the transaction, and an email cannot be rolled back. The same is true of a file written, a webhook posted or a job dispatched.\n\nDefer the side effect until the transaction actually commits:\n\n```php\nclass UserObserver\n{\n    public bool $afterCommit = true;\n}\n```\n\nor, for one piece of work:\n\n```php\nDB::afterCommit(fn () => Mail::to($user)->send(new WelcomeMail()));\n```\n\n<b>With no transaction open both run immediately</b>, so this is safe to leave on. Queued jobs carry the same setting for the same reason.",
      diagram: `The lifecycle, in pairs

  creating   →   INSERT   →   created
  updating   →   UPDATE   →   updated
  deleting   →   DELETE   →   deleted

  and wrapping both writes:

  saving  →  creating/updating  →  created/updated  →  saved

  saving    fires for new AND existing   → normalise an email
  creating  fires only for new           → generate a slug

  Full list: retrieved, creating/created, updating/updated,
             saving/saved, deleting/deleted,
             restoring/restored, replicating

  A "before" event can still change the model,
  and returning false CANCELS the operation.


  ⚠️  Mass operations load no models, so NO events fire.
      User::where(...)->update([...])
      User::where(...)->delete()


Two places to put a listener

  booted() on the model            an observer class

  static::creating(fn (\$u) =>      php artisan make:observer \\
      \$u->uuid = Str::uuid());         UserObserver --model=User

  one or two lines                 method name = event name
  behaviour that IS the model      everything in one file

  If booted() needs its own imports and a paragraph
  of logic, it wants to be an observer.

  #[ObservedBy([UserObserver::class])]
  User::observe(UserObserver::class);   ← older form,
                                          same effect


  ⚠️  Observers inside a TRANSACTION

      DB::transaction(function () {
          User::create(...)  → created → EMAIL SENT
          \$this->charge(...) → throws
          ROLLBACK           → the row disappears
      });

      The row is gone. The email is not.

      An observer fires INSIDE the transaction, and an
      email cannot be rolled back. Same for a file
      written, a webhook posted, a job dispatched.

        public bool \$afterCommit = true;   the observer
        DB::afterCommit(fn () => ...)      one piece

      No transaction open? Both run immediately — so it
      is safe to leave on.
  class User extends Model {}


Judgement: observers run invisibly

  Someone reads \$user->delete() and has no reason to
  suspect three other things happened.

  Good in an observer          Better elsewhere
  ───────────────────          ────────────────
  filling a derived column     charging a card
  logging the change           a multi-step workflow
  invalidating a cache         anything with its own errors
  sending a simple notice      anything that must be retried

  If it can fail in a way somebody needs to hear about,
  it does not belong in an observer.`,
      codeExample: {
        title: "Hooks on the model, and observers for the rest",
        code: `<?php
// ---------- Small: register in booted() ----------

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Support\\Str;

class Post extends Model
{
    protected static function booted(): void
    {
        // Only for new models.
        static::creating(function (Post $post) {
            $post->slug = Str::slug($post->title);
        });

        // For new and existing ones.
        static::saving(function (Post $post) {
            $post->excerpt = Str::limit(strip_tags($post->body), 150);
        });

        // Returning false cancels the operation.
        static::deleting(function (Post $post) {
            if ($post->is_locked) {
                return false;
            }
        });
    }
}


<?php
// ---------- Larger: an observer ----------

// php artisan make:observer UserObserver --model=User

namespace App\\Observers;

use App\\Models\\User;
use Illuminate\\Support\\Facades\\Log;

class UserObserver
{
    public function created(User $user): void
    {
        Log::info('User created', ['user_id' => $user->id]);
    }

    public function updated(User $user): void
    {
        if ($user->wasChanged('email')) {
            Log::info('Email changed', ['user_id' => $user->id]);
        }
    }

    public function deleted(User $user): void
    {
        Log::info('User deleted', ['user_id' => $user->id]);
    }
}

// The method names ARE the event names. Nothing else registers them.


<?php
// ---------- Attaching it ----------

namespace App\\Models;

use App\\Observers\\UserObserver;
use Illuminate\\Database\\Eloquent\\Attributes\\ObservedBy;
use Illuminate\\Database\\Eloquent\\Model;

#[ObservedBy([UserObserver::class])]
class User extends Model
{
    protected $fillable = ['name', 'email'];
}

// Older form, and what most existing codebases have:
// AppServiceProvider::boot()
User::observe(UserObserver::class);


<?php
// ---------- The transaction trap ----------

class UserObserver
{
    // Defer every handler until the transaction commits.
    // Without it, this observer's email survives a rollback
    // that deleted the user it welcomed.
    public bool $afterCommit = true;

    public function created(User $user): void
    {
        Mail::to($user)->send(new WelcomeMail());
    }
}

// Or for one piece of work, anywhere:
DB::afterCommit(fn () => Mail::to($user)->send(new WelcomeMail()));

// With no transaction open, both run immediately.

// One line at the top of the model, so the next reader
// can see that something observes it.


<?php
// ---------- The warning worth repeating ----------

$user->delete();                        // observer runs

User::where('active', false)->delete(); // no model, no observer

// And keep observers quick: they run inside the request,
// so queue anything slow rather than doing it here.`,
      },
      keyTakeaways: [
        "<b>Model events fire in pairs around each write</b>: `creating`/`created`, `updating`/`updated`, `deleting`/`deleted`.",
        "<b>`saving` and `saved` wrap both inserts and updates</b>, while `creating` fires only for new models.",
        "There is also `retrieved`, plus `restoring`/`restored` with soft deletes and `replicating`.",
        "<b>A before-event can still change the model, and returning `false` cancels the operation.</b>",
        "<b>`booted()` is where small, model-specific listeners go</b>, such as filling a derived column.",
        "<b>An observer is a class holding one model's event handlers</b>, and its method names are the event names.",
        "`#[ObservedBy([UserObserver::class])]` attaches it in one visible line at the top of the model.",
        "<b>`User::observe(...)` in a provider is the older form</b>, identical in effect and far less visible.",
        "<b>An observer fires inside a transaction</b>, so its email survives a rollback that removed the row.",
        "<b>`public bool $afterCommit = true` defers handlers until commit</b>, and is safe when no transaction is open.",
        "<b>Mass updates and deletes fire no events at all</b>, because no model is ever loaded.",
        "<b>If a side effect can fail in a way somebody needs to hear about, keep it out of an observer</b> and put it where the failure is visible.",
      ],
      commonMistakes: [
        "<b>Sending mail from an observer inside a transaction.</b> A rollback removes the row and not the email.",
        "<b>Relying on an observer after a mass update or delete.</b> No models load, so nothing fires.",
        "<b>Using `created` when you needed `creating`.</b> By then the row is written and you cannot change it.",
        "<b>Putting a payment or a multi-step workflow in an observer.</b> It fails invisibly, far from the code that triggered it.",
        "<b>Doing slow work in an observer.</b> It runs inside the request, so every save waits for it.",
        "<b>Naming an observer method something other than the event.</b> The name is the registration; a typo means silence.",
      ],
      quiz: [
        {
          question: "Which event fires for both new and existing models?",
          options: ["`creating`", "`saving`", "`updated`", "`retrieved`"],
          correctIndex: 1,
          explanation: "`saving` and `saved` wrap both inserts and updates.",
        },
        {
          question: "What does returning `false` from a `deleting` listener do?",
          options: [
            "Logs a warning",
            "Cancels the delete",
            "Soft deletes instead",
            "Nothing, the return value is ignored",
          ],
          correctIndex: 1,
          explanation: "Before-events can veto the operation.",
        },
        {
          question: "How does Laravel know which observer method handles which event?",
          options: [
            "From an array in the observer",
            "From the method names, which match the event names",
            "From a config file",
            "From the order of the methods",
          ],
          correctIndex: 1,
          explanation: "A typo in the name means the handler silently never runs.",
        },
        {
          question: "Which of these is a poor fit for an observer?",
          options: [
            "Filling a slug before saving",
            "Logging that a record changed",
            "Charging a customer's card",
            "Invalidating a cache entry",
          ],
          correctIndex: 2,
          explanation: "It can fail in a way somebody needs to hear about, and an observer hides that.",
        },
      ],
    },
    {
      id: "casts-hidden-and-appends",
      title: "Casts, hidden attributes & computed values",
      durationMinutes: 13,
      explanation: "A database stores a narrow set of types. Your application wants richer ones, and it wants control over what leaves the building as JSON. Four properties do most of that work:\n\n```text\ncasts()     what type an attribute is in PHP\n$hidden     what never appears in JSON\n$visible    what is the only thing that appears\n$appends    computed values added to JSON\n```\n\n---\n\n### 1. Basic — casting\n\n<b>Casting</b> (converting a stored value into a specific PHP type) fixes a mismatch you meet on day one. MySQL stores a boolean as:\n\n```text\nis_active\n---------\n1\n```\n\nand hands it back as the string `\"1\"`, which is not `true` and behaves oddly in comparisons and JSON.\n\n```php\nprotected function casts(): array\n{\n    return [\n        'is_active' => 'boolean',\n        'settings'  => 'array',\n        'birthday'  => 'date',\n        'price'     => 'decimal:2',\n    ];\n}\n```\n\n```text\ndatabase value\n      ↓\n   casts()\n      ↓\n  PHP value\n```\n\nNow `$user->is_active` is `true`, and `json_encode` produces `true` rather than `\"1\"`.\n\nThe `array` cast is the one that changes how you work. A `json` column becomes a PHP array on the way out and JSON on the way in:\n\n```php\n$user->settings['theme'];       // 'dark'\n```\n\nAnd dates are already cast for you: `created_at` and `updated_at` arrive as Carbon objects, which is why `$user->created_at->diffForHumans()` works without any setup. Add your own date columns to `casts()` to get the same.\n\nThe common casts:\n\n```text\nboolean  integer  float  string\narray  collection  object\ndate  datetime  immutable_datetime\ndecimal:2  encrypted  hashed\n```\n\n---\n\n### 2. Intermediate — what leaves as JSON\n\nReturn a model from a controller and Laravel serialises every attribute, including the ones you would rather it did not.\n\n```php\nprotected $hidden = ['password', 'remember_token'];\n```\n\n```text\nUser model\n   ├── name       → JSON ✓\n   ├── email      → JSON ✓\n   ├── password   → JSON ✗\n   └── token      → JSON ✗\n```\n\n`$visible` is the same idea inverted, listing the only attributes that may appear:\n\n```php\nprotected $visible = ['id', 'name', 'email'];\n```\n\n```text\n$hidden    hide these\n$visible   show only these\n```\n\nPick one. Setting both on a model is a puzzle for the next reader.\n\nThe same argument as `$fillable` applies here, in reverse. `$hidden` fails open: add a `secret_token` column and it is in your API until somebody remembers. `$visible` fails closed: a new column is invisible until you list it.\n\n<b>Neither is a substitute for deciding what your API returns.</b> These properties are a safety net; API Resources, later in the track, are the actual answer.\n\n---\n\n### 3. Advanced — computed attributes\n\nSome values are not columns. A full name, a formatted total, a status derived from two dates. Modern Eloquent expresses them with an `Attribute`:\n\n```php\nuse Illuminate\\Database\\Eloquent\\Casts\\Attribute;\n\nprotected function fullName(): Attribute\n{\n    return Attribute::make(\n        get: fn () => \"{$this->first_name} {$this->last_name}\",\n    );\n}\n```\n\n```php\n$user->full_name;   // works, with no such column\n```\n\nThe method is camelCase, the property is snake_case, and Eloquent connects them.\n\nAn `Attribute` can also intercept writes:\n\n```php\nprotected function email(): Attribute\n{\n    return Attribute::make(\n        get: fn (string $value) => strtolower($value),\n        set: fn (string $value) => strtolower(trim($value)),\n    );\n}\n```\n\nComputed attributes are not in JSON by default, because Laravel only serialises what it loaded. <b>`$appends` adds them:</b>\n\n```php\nprotected $appends = ['full_name'];\n```\n\nOne caution. An appended attribute is computed for <i>every</i> model in <i>every</i> response. If it queries anything, you have just created an N+1 problem across your whole API, silently. Keep appended attributes to arithmetic and string work on columns you already have.\n\nLast, `$timestamps`. Eloquent maintains `created_at` and `updated_at` on every save, and a table without them needs:\n\n```php\npublic $timestamps = false;\n```\n\notherwise every insert fails on a column that is not there.",
      diagram: `Four properties, four jobs

  casts()     what type an attribute is in PHP
  \$hidden     what never appears in JSON
  \$visible    what is the ONLY thing that appears
  \$appends    computed values added to JSON


Casting fixes a real mismatch

  database                  PHP without a cast    with a cast
  ────────                  ──────────────────    ───────────
  is_active = 1             "1"                   true
  settings  = {json}        a JSON string         an array
  birthday  = 2026-09-01    a string              a Carbon date

  database value  →  casts()  →  PHP value

  boolean  integer  float  string
  array  collection  object
  date  datetime  immutable_datetime
  decimal:2  encrypted  hashed

  created_at and updated_at are cast for you,
  which is why ->diffForHumans() just works.


What leaves as JSON

  User model
     ├── name       → JSON ✓
     ├── email      → JSON ✓
     ├── password   → JSON ✗      protected \$hidden = ['password']
     └── token      → JSON ✗

  \$hidden    hide these        fails OPEN: a new column is exposed
  \$visible   show only these   fails CLOSED: a new column is hidden

  Pick one, not both. And neither replaces deciding
  what your API returns — that is API Resources, later.


Computed attributes

  protected function fullName(): Attribute
  {
      return Attribute::make(
          get: fn () => \$this->first_name . ' ' . \$this->last_name,
      );
  }

  fullName()  →  \$user->full_name        camelCase → snake_case

  Not in JSON until:  protected \$appends = ['full_name'];

  ⚠️  An appended attribute is computed for EVERY model in
      EVERY response. If it queries anything, that is an
      N+1 across your whole API. Keep them to arithmetic
      and strings on columns you already have.`,
      codeExample: {
        title: "Types, visibility and computed values",
        code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Casts\\Attribute;
use Illuminate\\Database\\Eloquent\\Model;

class User extends Model
{
    protected $fillable = ['first_name', 'last_name', 'email'];

    // ---------- What type is each attribute in PHP? ----------

    protected function casts(): array
    {
        return [
            'is_active'         => 'boolean',   // "1" becomes true
            'settings'          => 'array',     // JSON becomes an array
            'birthday'          => 'date',      // a Carbon date
            'email_verified_at' => 'datetime',
            'price'             => 'decimal:2',
            'password'          => 'hashed',
        ];
    }

    // ---------- What never leaves as JSON? ----------

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // The inverse. Use one or the other, not both.
    // protected $visible = ['id', 'first_name', 'last_name'];

    // ---------- Computed values ----------

    protected $appends = ['full_name'];

    // fullName() becomes $user->full_name
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->first_name . ' ' . $this->last_name,
        );
    }

    // An attribute can intercept writes too.
    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => strtolower($value),
            set: fn (string $value) => strtolower(trim($value)),
        );
    }

    // A table with no created_at / updated_at would need:
    // public $timestamps = false;
}


<?php
// ---------- Using it ----------

$user = User::findOrFail(1);

$user->is_active;              // true, not "1"
$user->settings['theme'];      // 'dark', from a json column
$user->birthday->format('j F Y');
$user->created_at->diffForHumans();   // cast for you, always

$user->full_name;              // "Rajan Magar", with no such column

$user->email = '  RAJAN@Example.com ';
$user->email;                  // 'rajan@example.com'

return response()->json($user);
// name, email, full_name ✓
// password, remember_token ✗


<?php
// ---------- The appends trap ----------

// ❌ Runs a query for every model in every response.
protected function orderCount(): Attribute
{
    return Attribute::make(
        get: fn () => $this->orders()->count(),
    );
}
protected $appends = ['order_count'];

// Return 50 users and you have just run 51 queries.`,
      },
      keyTakeaways: [
        "<b>Casting converts a stored value into a specific PHP type</b>, declared in the `casts()` method.",
        "Without a cast, a MySQL boolean arrives as the string `\"1\"`, which is not `true` and serialises wrongly.",
        "<b>The `array` cast turns a JSON column into a PHP array</b> on read and back to JSON on write.",
        "`created_at` and `updated_at` are cast to Carbon dates for you; add your own date columns to get the same.",
        "<b>`$hidden` keeps attributes out of JSON</b>, which is how `password` stays out of API responses.",
        "<b>`$visible` lists the only attributes that may appear</b>, and fails closed where `$hidden` fails open.",
        "Use one or the other, and remember neither replaces deciding what your API returns.",
        "<b>An `Attribute` defines a computed value</b>, with a camelCase method becoming a snake_case property.",
        "<b>`$appends` adds a computed attribute to JSON</b>, and an appended attribute that queries creates an N+1 across every response.",
        "`public $timestamps = false;` is required on a table without `created_at` and `updated_at`.",
      ],
      commonMistakes: [
        "<b>Comparing an uncast boolean with `===`.</b> The database gave you `\"1\"`, not `true`.",
        "<b>Calling `json_decode()` on a JSON column yourself.</b> The `array` cast already did it.",
        "<b>Forgetting `$hidden` on a new sensitive column.</b> It is in your API from the moment it exists.",
        "<b>Setting both `$hidden` and `$visible`.</b> The interaction is a puzzle for the next reader.",
        "<b>Appending an attribute that runs a query.</b> Fifty models in a response become fifty-one queries.",
      ],
      quiz: [
        {
          question: "What does `'is_active' => 'boolean'` in `casts()` do?",
          options: [
            "Adds a database constraint",
            "Makes `$user->is_active` a real PHP boolean instead of the stored `\"1\"`",
            "Validates the value",
            "Hides it from JSON",
          ],
          correctIndex: 1,
          explanation: "Which also makes it serialise as `true` rather than `\"1\"`.",
        },
        {
          question: "What is `$hidden` for?",
          options: [
            "Blocking mass assignment",
            "Keeping attributes out of the model's array and JSON output",
            "Preventing the column from being read",
            "Hiding the column from migrations",
          ],
          correctIndex: 1,
          explanation: "`$fillable` guards what goes in; `$hidden` guards what comes out.",
        },
        {
          question: "You define `fullName(): Attribute`. What property does it become?",
          options: ["`$user->fullName`", "`$user->full_name`", "`$user->fullname`", "`$user->getFullName`"],
          correctIndex: 1,
          explanation: "camelCase method, snake_case property.",
        },
        {
          question: "Why is an appended attribute that runs a query dangerous?",
          options: [
            "It cannot be cached",
            "It is computed for every model in every response, creating an N+1",
            "Laravel forbids queries in accessors",
            "It breaks `$hidden`",
          ],
          correctIndex: 1,
          explanation: "Fifty models in one response become fifty-one queries.",
        },
      ],
    },
    {
      id: "replicate-compare-and-the-flow",
      title: "Replicating, comparing & the whole Eloquent flow",
      durationMinutes: 11,
      explanation: "Three smaller methods worth knowing, and then the picture everything today fits into.\n\n---\n\n### 1. Basic — copying and comparing\n\n<b>`replicate()`</b> copies a model without saving it:\n\n```php\n$copy = $user->replicate();\n\n$copy->email = 'new@example.com';\n$copy->save();\n```\n\n```text\noriginal\n   ↓\nreplicate()\n   ↓\nnew unsaved model      (no id, no timestamps)\n   ↓\nmodify\n   ↓\nsave()\n   ↓\nnew row\n```\n\nThe copy has every attribute except the primary key and timestamps, which is exactly right for \"duplicate this invoice\" or \"start from this template\". You can exclude more:\n\n```php\n$user->replicate(['email', 'api_token']);\n```\n\n<b>`is()`</b> asks whether two model instances are the same record:\n\n```php\n$a = User::find(1);\n$b = User::find(1);\n\n$a->is($b);      // true\n$a->isNot($b);   // false\n```\n\nTwo separate PHP objects, so `===` would say false. `is()` compares the key, the table and the connection, which is the question you actually meant. It is what you want in a policy check: `$post->user->is($request->user())`.\n\n---\n\n### 2. Intermediate — just the keys\n\nSometimes you want ids, not models:\n\n```php\n$keys = User::where('active', true)->get()->modelKeys();\n// [1, 5, 9, 12]\n```\n\n```text\nusers\n  ↓\nactive = true\n  ↓\nmodels\n  ↓\nmodelKeys()\n  ↓\n[1, 5, 9, 12]\n```\n\nUseful when feeding another query, though if the models themselves are not needed, `pluck('id')` asks the database for one column instead of hydrating every model:\n\n```php\nUser::where('active', true)->pluck('id');\n```\n\nSame answer, a fraction of the work. `modelKeys()` is for when you already have the collection in hand.\n\n---\n\n### 3. Advanced — the whole flow\n\nHere is where every piece of today sits:\n\n```text\nHTTP Request\n     ↓\nController\n     ↓\nUser::where(...)      ← the Query Builder, from Day 13\n     ↓\nDatabase\n     ↓\nUser model            ← rows become objects\n     ↓\ncasts, accessors, events\n     ↓\nController\n     ↓\nJSON or a view\n```\n\nA create, end to end:\n\n```text\nRequest\n   ↓\nvalidate()            what you accept        Day 9\n   ↓\nUser::create()\n   ↓\n$fillable             what the model accepts\n   ↓\ncreating event        your last chance to change it\n   ↓\nINSERT\n   ↓\ncreated event         observers run\n   ↓\n$hidden / $casts      what leaves as JSON\n   ↓\nResponse\n```\n\nFive gates, each answering a different question, and none of them replacing another.\n\nAnd a delete on a soft-deleting model:\n\n```text\n$user->delete()\n      ↓\nSoftDeletes\n      ↓\ndeleted_at = now()\n      ↓\ndeleted event\n      ↓\nUserObserver\n      ↓\nlog written\n```\n\nThe CRUD you now know:\n\n```text\nUser::all()                  every row\nUser::find(1)                by key, or null\nUser::findOrFail(1)          by key, or 404\nUser::where(...)->first()    the first match\nUser::create([...])          create, via $fillable\n$user->save()                insert or update\nUser::firstOrCreate(...)     find, or create\nUser::updateOrCreate(...)    update, or create\n$user->update([...])         update one model\n$user->delete()              delete, or soft delete\nUser::withTrashed()          include deleted\nUser::onlyTrashed()          only deleted\n$user->restore()             undelete\n$user->forceDelete()         really delete\n$user->trashed()             is it deleted?\n$user->replicate()           copy, unsaved\n$user->is($other)            same record?\n$collection->modelKeys()     just the ids\n```\n\n> <b>The Query Builder helps you query the database. Eloquent gives you those rows as models that understand your application.</b>\n\nTomorrow: relationships, where a model stops being one table and starts being a graph.",
      diagram: `Copying a model

  original
     ↓
  replicate()
     ↓
  new unsaved model      no id, no timestamps
     ↓
  modify
     ↓
  save()
     ↓
  new row

  \$user->replicate(['email', 'api_token'])   exclude more


Comparing models

  \$a = User::find(1);
  \$b = User::find(1);

  \$a === \$b        false    two separate PHP objects
  \$a->is(\$b)       true     same key, table and connection

  The one you want in a policy check:
  \$post->user->is(\$request->user())


Just the ids

  ->get()->modelKeys()      from a collection you already have
  ->pluck('id')             asks the database for one column

  Same answer. pluck() never hydrates the models.


One create, five gates

  Request
     ↓
  validate()          what you ACCEPT            Day 9
     ↓
  User::create()
     ↓
  \$fillable           what the MODEL accepts
     ↓
  creating event      last chance to change it
     ↓
  INSERT
     ↓
  created event       observers run
     ↓
  \$hidden / casts()   what LEAVES as JSON
     ↓
  Response

  Five different questions. None replaces another.


Where Eloquent sits

  HTTP Request → Controller → User::where(...) → Database
                                                      ↓
  JSON / view ← Controller ← casts, events ← User model

  Query Builder queries the database.
  Eloquent hands you rows as models that
  understand your application.`,
      codeExample: {
        title: "The small methods, and a controller using all of it",
        code: `<?php

use App\\Models\\User;

// ---------- Copy a model ----------

$copy = $user->replicate();     // everything but the key and timestamps

$copy->email = 'new@example.com';
$copy->save();

// Exclude more attributes from the copy.
$copy = $user->replicate(['email', 'api_token']);


// ---------- Same record? ----------

$a = User::find(1);
$b = User::find(1);

$a === $b;        // false: two separate PHP objects
$a->is($b);       // true:  same key, table and connection
$a->isNot($b);    // false

// Where you actually use it:
if ($post->user->is($request->user())) {
    // they own it
}


// ---------- Just the keys ----------

$keys = User::where('active', true)->get()->modelKeys();  // [1, 5, 9]

// Cheaper when you do not need the models at all:
$keys = User::where('active', true)->pluck('id');


<?php
// ---------- Everything from today, in one controller ----------

namespace App\\Http\\Controllers;

use App\\Models\\User;
use Illuminate\\Http\\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        return User::query()
            ->when($request->search, fn ($q, $search) =>
                $q->where('name', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->orderBy('id')
            ->paginate(20)
            ->withQueryString();
    }

    public function store(Request $request)
    {
        // 1. what you accept
        $data = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
        ]);

        // 2. what the model accepts ($fillable)
        // 3. creating / created events fire around the INSERT
        $user = User::create($data);

        // 4. $hidden and casts() decide what leaves
        return response()->json($user, 201);
    }

    // Route model binding: a missing id is already a 404.
    public function update(Request $request, User $user)
    {
        $user->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]));

        return $user;
    }

    public function destroy(User $user)
    {
        $user->delete();   // soft delete, and the observer runs

        return response()->noContent();
    }
}`,
      },
      keyTakeaways: [
        "<b>`replicate()` copies a model without its key or timestamps</b>, unsaved, for duplicating a record.",
        "`replicate(['email'])` excludes further attributes from the copy.",
        "<b>`is()` asks whether two instances are the same record</b>, comparing key, table and connection.",
        "`===` compares PHP objects, so two fetches of the same row are not equal; `is()` is the question you meant.",
        "<b>`modelKeys()` returns the ids from a collection you already have</b>, while `pluck('id')` asks the database directly.",
        "<b>A create passes five gates</b>: validation, `$fillable`, the `creating` event, the insert, then `$hidden` and casts.",
        "Each gate answers a different question, and none of them replaces another.",
        "<b>The Query Builder queries the database; Eloquent hands you those rows as models</b> that carry your application's behaviour.",
      ],
      commonMistakes: [
        "<b>Comparing models with `===`.</b> Two fetches of the same row are two objects; use `is()`.",
        "<b>Forgetting to `save()` after `replicate()`.</b> The copy exists in PHP only.",
        "<b>Loading a full collection just to call `modelKeys()`.</b> `pluck('id')` fetches one column instead.",
        "<b>Assuming `$fillable` makes validation unnecessary.</b> They guard different doors.",
        "<b>Reaching for Eloquent on a large report.</b> Hydrating thousands of models to sum a column is work you do not need.",
      ],
      quiz: [
        {
          question: "What does `replicate()` return?",
          options: [
            "A saved copy of the model",
            "An unsaved copy, without the primary key or timestamps",
            "The same model instance",
            "An array of the model's attributes",
          ],
          correctIndex: 1,
          explanation: "Call `save()` on it to create the new row.",
        },
        {
          question: "Why use `$a->is($b)` rather than `$a === $b`?",
          options: [
            "`===` is slower",
            "Two fetches of the same row are separate objects, so `===` is false",
            "`is()` also compares timestamps",
            "`===` does not work on objects",
          ],
          correctIndex: 1,
          explanation: "`is()` compares the key, table and connection.",
        },
        {
          question: "Which gate stops `is_admin` arriving from a request?",
          options: [
            "`$hidden`",
            "`casts()`",
            "`$fillable`, and validation before it",
            "The `created` event",
          ],
          correctIndex: 2,
          explanation: "`$hidden` guards what leaves; `$fillable` guards what goes in.",
        },
        {
          question: "In one sentence, what does Eloquent add over the Query Builder?",
          options: [
            "Faster queries",
            "It returns rows as models carrying casts, events, accessors and relationships",
            "It writes the SQL for you",
            "It removes the need for migrations",
          ],
          correctIndex: 1,
          explanation: "The query is the same; what comes back is not.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What table does `class BlogPost extends Model` use, with no configuration?",
      options: ["blogpost", "blog_posts", "BlogPosts", "blogPost"],
      correctIndex: 1,
      explanation: "The plural, snake_case form of the class name.",
    },
    {
      question: "What happens when `User::findOrFail(99)` finds nothing?",
      options: [
        "Returns null",
        "Returns false",
        "Throws `ModelNotFoundException`, which becomes a 404",
        "Creates the user",
      ],
      correctIndex: 2,
      explanation: "Which is why controllers using it need no null check.",
    },
    {
      question: "What does `$fillable` protect against?",
      options: [
        "Invalid email addresses",
        "A request setting an attribute your form never offered, such as `is_admin`",
        "SQL injection",
        "Missing columns",
      ],
      correctIndex: 1,
      explanation: "Anyone can add a key to a JSON request body.",
    },
    {
      question: "Why do observers not run after `User::where('active', false)->delete()`?",
      options: [
        "Observers only handle creates",
        "No models are loaded, so no model events fire",
        "The query is queued",
        "They do run",
      ],
      correctIndex: 1,
      explanation: "Loop with `chunkById()` and call `delete()` on each model when you need them.",
    },
    {
      question: "With `SoftDeletes`, what does `$user->delete()` do?",
      options: [
        "Removes the row",
        "Sets `deleted_at` and leaves the row in place",
        "Throws unless you use `forceDelete()`",
        "Moves it to an archive table",
      ],
      correctIndex: 1,
      explanation: "Every query then filters those rows out automatically.",
    },
    {
      question: "Why does a soft-deleted user's email stay unavailable for signup?",
      options: [
        "Laravel caches it",
        "The unique index still counts the soft-deleted row",
        "Soft deletes lock the column",
        "It does not; the email is free",
      ],
      correctIndex: 1,
      explanation: "The row is still there, so the index still sees it.",
    },
    {
      question: "What does `'settings' => 'array'` in `casts()` give you?",
      options: [
        "A validation rule",
        "A JSON column that reads as a PHP array and writes back as JSON",
        "A relationship",
        "A hidden attribute",
      ],
      correctIndex: 1,
      explanation: "No `json_decode()` of your own needed.",
    },
    {
      question: "What is the risk of an appended attribute that runs a query?",
      options: [
        "It cannot be cached",
        "It is computed for every model in every response, creating an N+1",
        "It breaks `$hidden`",
        "It fails on soft-deleted models",
      ],
      correctIndex: 1,
      explanation: "Fifty models in a response become fifty-one queries.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Turn InvoiceHub's raw tables into real models: Invoice and Customer, with mass-assignment guards, casts, soft deletes and an observer.",
    brief: "For two days InvoiceHub has talked to the database through `DB::table()`. Today every one of those calls becomes a model, and you get to see exactly what Eloquent adds.\n\nThe work is mostly conversion, and the interesting part is what conversion makes possible. Once an invoice is an `Invoice`, the total can be a decimal rather than a string, deleting one can be reversible, and the audit log can write itself.\n\nKeep the old Query Builder version of at least one screen alongside the new one until the end. Comparing them is the point of the day.",
    steps: [
      "Create `Customer` and `Invoice` models with `php artisan make:model Customer` and `php artisan make:model Invoice`. Confirm each finds its table with no configuration, and note what the convention gave you.",
      "Add `$fillable` to both, listing only what a form actually submits. Deliberately leave one column out, try to set it through `create()`, and watch it be dropped.",
      "Convert the invoice list page from `DB::table('invoices')` to `Invoice::query()`. Every filter, order and paginate call should work unchanged. Note in a comment what did change.",
      "Convert the show page to route model binding: type-hint `Invoice $invoice` in the controller and delete the `findOrFail()` you no longer need. Visit an id that does not exist and confirm the 404.",
      "Add `casts()` to `Invoice`: `total` as `decimal:2`, `issued_at` as a date, and a `meta` JSON column as an array. Check each one from `php artisan tinker`.",
      "Add a computed `is_overdue` attribute using `Attribute::make()`, comparing the due date with today. Do not append it yet.",
      "Append `is_overdue` to the JSON, then measure: does it run any queries? If it does, rewrite it so it does not.",
      "Add `$hidden` for anything an API response should not carry, then hit the JSON endpoint and confirm those fields are gone.",
      "Add soft deletes to `Invoice`: the migration column and the trait. Delete an invoice, confirm it disappears from the list, then find it with `onlyTrashed()` and restore it.",
      "Build an archive page using `onlyTrashed()` with a restore button and a permanent delete button, so you have used both `restore()` and `forceDelete()`.",
      "Try to create a new invoice with the same number as a soft-deleted one. Write down what happens and why, and decide what the application should do about it.",
      "Create an `InvoiceObserver` with `created`, `updated` and `deleted` handlers that write to the log with the invoice id. Attach it with `#[ObservedBy]`.",
      "Run a mass update, `Invoice::where('status', 'draft')->update(['status' => 'sent'])`, and confirm the observer did not fire. Then rewrite it with `chunkById()` so it does, and note which version you would actually ship.",
      "Add an import command that reads a small CSV and calls `updateOrCreate()` keyed on the invoice number. Run it twice and confirm the second run creates nothing.",
    ],
    acceptance: [
      "Every `DB::table()` call for invoices and customers is gone, replaced by models.",
      "The list page still filters, sorts and paginates exactly as it did yesterday.",
      "A field left out of `$fillable` cannot be set through `create()` or `update()`.",
      "`$invoice->total` is a decimal, `$invoice->issued_at` is a date object, and `$invoice->meta` is an array.",
      "`is_overdue` appears in the JSON and adds no queries, however many invoices are returned.",
      "Deleting an invoice hides it from the list and leaves the row in the table with `deleted_at` set.",
      "The archive page can restore an invoice and permanently delete one.",
      "The log contains one line per create, update and delete made through a model.",
      "Running the import twice leaves the same number of invoices as running it once.",
    ],
    stretch: [
      "Add `Prunable` to `Invoice` so invoices soft-deleted more than 90 days ago are removed by `php artisan model:prune`, and schedule it.",
      "Add a `replicate()`-based duplicate button that copies an invoice and its lines as a new draft.",
      "Write the revenue report from Day 13 twice, once with Eloquent and once with the Query Builder, then compare the queries and the memory each uses on a few thousand rows.",
    ],
  },
};
