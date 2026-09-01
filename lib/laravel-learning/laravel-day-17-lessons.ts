import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_17_LESSONS: LessonDay = {
  day: 17,
  title: "Model factories & database seeding",
  totalMinutes: 87,
  difficulty: "Beginner",
  lessons: [
    {
      id: "factories-and-definition",
      title: "Factories, definition() & make vs create",
      durationMinutes: 11,
      explanation: "Five days of building models, and every time you wanted to see a screen work you typed data in by hand.\n\nToday that stops. Factories and seeders answer one question between them:\n\n> <b>How do I quickly create realistic, consistent database data?</b>\n\nAnd they split it cleanly:\n\n```text\nFactory\n   ↓\nWhat should one model look like?\n\nSeeder\n   ↓\nHow many, and how are they connected?\n\nDatabase\n   ↓\nRealistic development data\n```\n\n---\n\n### 1. Basic — a blueprint for one model\n\n<b>A <i>factory</i></b> (a class describing how to build a fake instance of a model) lives in `database/factories`:\n\n```bash\nphp artisan make:factory UserFactory --model=User\n```\n\nAnd it is one method:\n\n```php\nclass UserFactory extends Factory\n{\n    public function definition(): array\n    {\n        return [\n            'name'     => fake()->name(),\n            'email'    => fake()->unique()->safeEmail(),\n            'password' => Hash::make('password'),\n        ];\n    }\n}\n```\n\n<b>`definition()` returns the default attributes for one model.</b> Every value is generated fresh each time, so a hundred users are a hundred different people rather than a hundred copies.\n\n```php\nUser::factory()->create();\n```\n\nThat works because the model uses the `HasFactory` trait, and Laravel finds `UserFactory` by name. A factory in an unusual place needs a `newFactory()` method on the model to point at it.\n\n---\n\n### 2. Intermediate — `make()` or `create()`\n\nThe distinction people trip over:\n\n```php\n$user = User::factory()->make();     // a PHP object, nothing saved\n$user = User::factory()->create();   // a PHP object AND a database row\n```\n\n```text\nmake()                    create()\n──────                    ────────\nbuilds the model          builds and saves it\nno database at all        an INSERT\nno id                     an id\nfast                      slower\n```\n\n<b>`make()` is for when you only need the shape of a model</b>, such as testing a method that takes one, or checking how a view renders. Nothing touches the database, which makes it fast and means no cleanup.\n\n<b>`create()` is for when the row has to exist</b>, which is anything involving a relationship, a query, or a real request.\n\nOne consequence worth knowing: `make()` gives you a model with no `id`, so anything that saves a child pointing at it will fail. If a relationship is involved, you wanted `create()`.\n\nBoth accept overrides, and this is the single most useful thing in the whole day:\n\n```php\nUser::factory()->create(['email' => 'known@example.com']);\n```\n\nEverything else is random; the one attribute your test cares about is fixed.\n\n---\n\n### 3. Advanced — many at once\n\n```php\nUser::factory()->count(10)->create();\nUser::factory(10)->create();          // the same thing\n```\n\nOne row means one model back; more than one means a collection:\n\n```php\n$user  = User::factory()->create();       // a User\n$users = User::factory(3)->create();      // a Collection of 3\n```\n\nForgetting that is a common half-hour: `->count(1)` still gives you a collection.\n\nA few things worth knowing before the seeding lesson.\n\n<b>Factory creation is not fast.</b> Each `create()` is an insert, plus model events, plus any observer you wrote on Day 14. Ten thousand rows one at a time is slow, and `make()` plus a bulk insert is the usual answer when you need volume rather than behaviour.\n\n<b>And a factory is code you maintain.</b> Add a `NOT NULL` column with no default and every factory missing it starts failing, which is a good thing: it means your seeded data and your schema cannot drift apart quietly.\n\n```text\nUser::factory()                 the builder\n    ->count(10)                 how many\n    ->create(['role' => 'x'])   save, with overrides\n```",
      diagram: `The split

  Factory                    Seeder
     ↓                          ↓
  What should ONE            How many, and how
  model look like?           are they connected?
                 ↓
             Database
                 ↓
     realistic development data


A factory is one method

  php artisan make:factory UserFactory --model=User
  → database/factories/UserFactory.php

  public function definition(): array
  {
      return [
          'name'     => fake()->name(),
          'email'    => fake()->unique()->safeEmail(),
          'password' => Hash::make('password'),
      ];
  }

  Every value is generated fresh, so a hundred users
  are a hundred different people.


make() or create()

  make()                    create()
  ──────                    ────────
  builds the model          builds AND saves it
  no database at all        an INSERT
  no id                     an id
  fast                      slower

  make()    testing a method that takes a model,
            checking how a view renders
  create()  anything with a relationship, a query,
            or a real request

  A make()d model has no id, so saving a child
  that points at it will fail.


Overrides: the most useful thing here

  User::factory()->create(['email' => 'known@example.com']);

  Everything random except the one attribute
  your test actually cares about.


Counts

  User::factory()->count(10)->create()
  User::factory(10)->create()             the same

  ->create()            one model back
  ->count(1)->create()  a COLLECTION of one   ← catches people


  Factory creation is not fast: each create() is an insert
  plus model events plus your observers. For volume without
  behaviour, make() and a bulk insert.`,
      codeExample: {
        title: "A factory, and every way to call it",
        code: `<?php
// database/factories/UserFactory.php

namespace Database\\Factories;

use Illuminate\\Database\\Eloquent\\Factories\\Factory;
use Illuminate\\Support\\Facades\\Hash;

class UserFactory extends Factory
{
    // The default attributes for one model.
    public function definition(): array
    {
        return [
            'name'              => fake()->name(),
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => Hash::make('password'),
            'is_admin'          => false,
        ];
    }
}


<?php
// The model needs the trait:

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class User extends Model
{
    use HasFactory;
}


<?php
// ---------- Using it ----------

// In memory only. No database, no id.
$user = User::factory()->make();

// Saved. Has an id.
$user = User::factory()->create();

// Ten of them.
User::factory()->count(10)->create();
User::factory(10)->create();              // identical


// ---------- Overrides: the useful part ----------

// Everything random except what this test cares about.
$user = User::factory()->create([
    'email'             => 'known@example.com',
    'email_verified_at' => null,
]);

// Works on make() too.
$user = User::factory()->make(['name' => 'Rajan']);

// And on a batch: all ten are admins.
User::factory(10)->create(['is_admin' => true]);


// ---------- One, or many ----------

$user  = User::factory()->create();       // a User model
$users = User::factory(3)->create();      // a Collection
$users = User::factory()->count(1)->create();  // still a Collection


// ---------- When you need volume, not behaviour ----------

// ❌ 10,000 inserts, plus model events, plus observers.
User::factory(10000)->create();

// ✓ Build in memory, insert in batches.
User::factory(10000)->make()
    ->chunk(500)
    ->each(fn ($chunk) => User::insert($chunk->toArray()));

// Note: insert() skips model events and timestamps.`,
      },
      keyTakeaways: [
        "<b>A factory describes what one fake model looks like; a seeder decides how many and how they connect.</b>",
        "<b>`definition()` returns the default attributes</b>, generated fresh for every model created.",
        "`php artisan make:factory UserFactory --model=User` creates it in `database/factories`.",
        "The model needs the `HasFactory` trait for `User::factory()` to work.",
        "<b>`make()` builds the model in memory with no database row and no id.</b>",
        "<b>`create()` builds it and saves it</b>, which is what anything involving a relationship or a query needs.",
        "<b>Both accept an array of overrides</b>, so everything is random except the attribute you care about.",
        "`count(10)` and `factory(10)` are the same, and any count returns a collection, including one.",
        "<b>Factory creation runs inserts and model events</b>, so bulk volume wants `make()` plus a batched insert.",
      ],
      commonMistakes: [
        "<b>Using `make()` and then trying to attach a child.</b> There is no id to point at yet.",
        "<b>Expecting a single model back from `count(1)`.</b> Any count returns a collection.",
        "<b>Forgetting `HasFactory` on the model.</b> `User::factory()` then does not exist.",
        "<b>Hard-coding values in `definition()`.</b> Every model comes out identical, and unique columns collide.",
        "<b>Creating ten thousand models one at a time.</b> Each is an insert plus every observer you wrote.",
      ],
      quiz: [
        {
          question: "What is the difference between `make()` and `create()`?",
          options: [
            "None",
            "`make()` builds the model in memory; `create()` also saves it to the database",
            "`create()` is for tests only",
            "`make()` returns an array",
          ],
          correctIndex: 1,
          explanation: "A `make()`d model has no id, so relationships need `create()`.",
        },
        {
          question: "What does `definition()` return?",
          options: [
            "The model class",
            "The default attributes for one model, generated fresh each time",
            "The database schema",
            "A saved model",
          ],
          correctIndex: 1,
          explanation: "Which is why a hundred users are a hundred different people.",
        },
        {
          question: "How do you fix one attribute while leaving the rest random?",
          options: [
            "Edit `definition()`",
            "Pass an array of overrides to `make()` or `create()`",
            "Use a seeder",
            "You cannot",
          ],
          correctIndex: 1,
          explanation: "`User::factory()->create(['email' => '...'])`.",
        },
        {
          question: "What does `User::factory()->count(1)->create()` return?",
          options: ["A User model", "A collection containing one User", "An array", "Null"],
          correctIndex: 1,
          explanation: "Any count returns a collection, including a count of one.",
        },
      ],
    },
    {
      id: "states-and-callbacks",
      title: "Factory states & callbacks",
      durationMinutes: 11,
      explanation: "One factory, several kinds of model, without writing several factories.\n\n---\n\n### 1. Basic — naming a variation\n\nA user is not just a user:\n\n```text\nUser\n ├── admin\n ├── unverified\n └── suspended\n```\n\nYou could pass overrides every time:\n\n```php\nUser::factory()->create(['is_admin' => true]);\n```\n\nBut that spreads the definition of \"admin\" across every test that needs one. <b>A <i>state</i></b> (a named variation of a factory) gives it a home:\n\n```php\npublic function admin(): static\n{\n    return $this->state(fn (array $attributes) => [\n        'is_admin' => true,\n    ]);\n}\n```\n\n```php\nUser::factory()->admin()->create();\n```\n\nThe closure receives the attributes generated so far, so a state can build on them:\n\n```php\npublic function suspended(): static\n{\n    return $this->state(fn (array $attributes) => [\n        'suspended_at' => now(),\n        'suspend_reason' => 'Suspended after ' . $attributes['name'],\n    ]);\n}\n```\n\n<b>States compose.</b> `User::factory()->admin()->unverified()->create()` applies both, in order, which is where the payoff is: three states give you eight combinations with no extra code.\n\n---\n\n### 2. Intermediate — states with arguments\n\n```php\npublic function withRole(string $role): static\n{\n    return $this->state(['role' => $role]);\n}\n```\n\n```php\nUser::factory()->withRole('editor')->create();\n```\n\nWhich raises a fair question: how is that better than `create(['role' => 'editor'])`?\n\nIt is better when the state means more than one thing. \"Editor\" might mean a role, a permission set and a flag, and a parameterised state keeps those three in step:\n\n```php\npublic function withRole(string $role): static\n{\n    return $this->state([\n        'role'        => $role,\n        'is_staff'    => in_array($role, ['editor', 'admin']),\n        'can_publish' => $role !== 'reader',\n    ]);\n}\n```\n\n<b>The test: if the concept has a name and more than one attribute, it is a state.</b> A single attribute is usually just an override.\n\nLaravel ships one you already have: `unverified()` on the default `UserFactory`.\n\n---\n\n### 3. Advanced — callbacks\n\nSometimes creating a model is not enough. Two hooks:\n\n```php\npublic function configure(): static\n{\n    return $this->afterMaking(function (User $user) {\n        // built, not saved yet\n    })->afterCreating(function (User $user) {\n        // saved, has an id\n    });\n}\n```\n\n```text\nFactory\n   ↓\nbuild the model\n   ↓\nafterMaking()       no id yet\n   ↓\nINSERT\n   ↓\nafterCreating()     id exists, relationships possible\n```\n\n<b>`afterMaking()` runs before the row exists</b>, so it is for adjusting the model itself: deriving one attribute from another, or fixing something the definition could not know.\n\n<b>`afterCreating()` runs once the row exists</b>, so it is the only one that can create related records or anything needing the id.\n\n```php\n->afterCreating(function (User $user) {\n    $user->profile()->create(['bio' => fake()->paragraph()]);\n})\n```\n\nA state can carry its own callback too, which is how \"a user who has already ordered\" becomes one named thing.\n\nOne caution, and it is the reason for tomorrow's rule about business logic. A callback runs on <i>every</i> model this factory creates, everywhere. An `afterCreating()` that makes three related records means every test that needed one user quietly created four rows. Keep callbacks to what the model genuinely cannot exist without, and put the rest in the relationship methods you will meet in the next lesson.",
      diagram: `A state names a variation

  User
   ├── admin
   ├── unverified
   └── suspended

  Instead of spreading this across every caller:

    User::factory()->create(['is_admin' => true]);

  Give it a home:

    public function admin(): static {
        return \$this->state(fn (array \$attributes) => [
            'is_admin' => true,
        ]);
    }

    User::factory()->admin()->create();

  The closure receives the attributes so far,
  so a state can build on them.


States compose

  User::factory()->admin()->unverified()->create()

  Three states → eight combinations, no extra code.


State or override?

  ->create(['role' => 'editor'])        one attribute
  ->withRole('editor')                  a CONCEPT

  public function withRole(string \$role): static {
      return \$this->state([
          'role'        => \$role,
          'is_staff'    => in_array(\$role, ['editor', 'admin']),
          'can_publish' => \$role !== 'reader',
      ]);
  }

  Test: does the concept have a name and more than
  one attribute? Then it is a state.


Two callbacks

  Factory
     ↓
  build the model
     ↓
  afterMaking()        no id yet
     ↓
  INSERT
     ↓
  afterCreating()      id exists, relationships possible

  afterMaking()    adjust the model itself
  afterCreating()  create related records, anything
                   that needs the id

  ⚠️  A callback runs on EVERY model this factory creates.
      An afterCreating() making three related records means
      every test that wanted one user made four rows.`,
      codeExample: {
        title: "States, parameters and callbacks",
        code: `<?php

namespace Database\\Factories;

use App\\Models\\User;
use Illuminate\\Database\\Eloquent\\Factories\\Factory;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'              => fake()->name(),
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'is_admin'          => false,
            'role'              => 'reader',
        ];
    }

    // ---------- A simple state ----------

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
            'role'     => 'admin',
        ]);
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    // ---------- Building on what came before ----------

    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'suspended_at' => now(),
            'suspend_note' => 'Suspended: ' . $attributes['name'],
        ]);
    }

    // ---------- With an argument ----------

    // Worth a state because "editor" means three things at once.
    public function withRole(string $role): static
    {
        return $this->state([
            'role'        => $role,
            'is_staff'    => in_array($role, ['editor', 'admin'], true),
            'can_publish' => $role !== 'reader',
        ]);
    }

    // ---------- Callbacks ----------

    public function configure(): static
    {
        return $this
            ->afterMaking(function (User $user) {
                // No id yet. Adjust the model itself.
                $user->slug = str($user->name)->slug();
            })
            ->afterCreating(function (User $user) {
                // The row exists, so relationships are possible.
                $user->profile()->create([
                    'bio' => fake()->paragraph(),
                ]);
            });
    }

    // ---------- A state with its own callback ----------

    public function withOrders(int $count = 3): static
    {
        return $this->afterCreating(function (User $user) use ($count) {
            Order::factory($count)->for($user)->create();
        });
    }
}


<?php
// ---------- Using them ----------

User::factory()->admin()->create();

// States compose, in order.
User::factory()->admin()->unverified()->create();

User::factory()->withRole('editor')->create();

// Ten suspended admins.
User::factory(10)->admin()->suspended()->create();

// A whole scenario, named.
User::factory()->withOrders(5)->create();

// And overrides still win, applied last.
User::factory()->admin()->create(['email' => 'known@example.com']);`,
      },
      keyTakeaways: [
        "<b>A state is a named variation of a factory</b>, defined once and reused everywhere.",
        "`$this->state(fn (array $attributes) => [...])` returns the attributes to change.",
        "<b>The closure receives the attributes generated so far</b>, so a state can build on them.",
        "<b>States compose</b>, so three states give you eight combinations with no extra code.",
        "A state can take arguments, which is worth doing when the concept sets more than one attribute.",
        "<b>A single attribute is usually just an override; a named concept with several is a state.</b>",
        "<b>`afterMaking()` runs before the row exists</b>, so it can only adjust the model itself.",
        "<b>`afterCreating()` runs once the row exists</b>, so it is the only one that can create related records.",
        "<b>A callback runs on every model the factory creates</b>, so keep it to what the model cannot exist without.",
      ],
      commonMistakes: [
        "<b>Creating related records in `afterMaking()`.</b> There is no id to point at yet.",
        "<b>Writing a state for a single attribute.</b> An override at the call site says the same thing with less code.",
        "<b>Putting heavy `afterCreating()` logic in `configure()`.</b> Every test that wanted one model now creates several.",
        "<b>Repeating `create(['is_admin' => true])` everywhere.</b> The definition of \"admin\" ends up in twenty files.",
        "<b>Expecting a state to override an explicit override.</b> Values passed to `create()` are applied last and win.",
      ],
      quiz: [
        {
          question: "What is a factory state?",
          options: [
            "The saved state of a model",
            "A named variation of a factory, such as `admin()` or `unverified()`",
            "A database transaction",
            "The factory's definition",
          ],
          correctIndex: 1,
          explanation: "Defined once, composed freely.",
        },
        {
          question: "What is the difference between `afterMaking()` and `afterCreating()`?",
          options: [
            "None",
            "`afterMaking()` runs before the row exists; `afterCreating()` runs once it does",
            "`afterCreating()` runs only in tests",
            "`afterMaking()` runs after saving",
          ],
          correctIndex: 1,
          explanation: "Only `afterCreating()` has an id, so only it can create related records.",
        },
        {
          question: "When is a state better than passing overrides?",
          options: [
            "Always",
            "When the concept has a name and sets more than one attribute",
            "When the model has a factory",
            "Only in seeders",
          ],
          correctIndex: 1,
          explanation: "A single attribute is usually just an override.",
        },
        {
          question: "Why keep `afterCreating()` light in `configure()`?",
          options: [
            "It runs twice",
            "It runs on every model the factory creates, so extra rows appear everywhere",
            "It cannot access the model",
            "It breaks states",
          ],
          correctIndex: 1,
          explanation: "A test that wanted one user quietly created four rows.",
        },
      ],
    },
    {
      id: "factory-relationships",
      title: "Factory relationships — has, for & hasAttached",
      durationMinutes: 12,
      explanation: "Yesterday's relationships, expressed as data. This is where factories stop being a convenience and start being how you describe a domain.\n\n---\n\n### 1. Basic — `has()` and `for()`\n\nTwo directions, matching the two sides of Day 15.\n\n<b>`has()` creates children</b> from the parent:\n\n```php\nUser::factory()\n    ->has(Post::factory()->count(3))\n    ->create();\n```\n\n```text\nUser #1\n ├── Post #1\n ├── Post #2\n └── Post #3\n```\n\n<b>`for()` creates or attaches a parent</b> from the child:\n\n```php\nPost::factory()\n    ->for(User::factory())\n    ->create();\n```\n\n```text\nUser #1\n   ↑ user_id\nPost #1\n```\n\n```text\nhas()   the parent makes children       hasOne, hasMany\nfor()   the child gets a parent         belongsTo\n```\n\nWhich is the `hasMany` / `belongsTo` split again: <b>`for()` goes on the side holding the foreign key.</b> Laravel sets it either way.\n\n`for()` also takes an existing model, which is what you want most of the time:\n\n```php\n$user = User::factory()->create();\n\nPost::factory(5)->for($user)->create();\n```\n\nFive posts for that user, rather than five users.\n\n---\n\n### 2. Intermediate — naming and nesting\n\nWhen the relationship is not named after the model, say so:\n\n```php\nUser::factory()->has(Post::factory()->count(3), 'articles')->create();\nPost::factory()->for(User::factory(), 'author')->create();\n```\n\nThere are magic methods too, which read nicely:\n\n```php\nUser::factory()->hasPosts(3)->create();\nPost::factory()->forUser()->create();\n```\n\nAnd the part that matters: <b>they nest.</b>\n\n```php\nUser::factory()\n    ->has(\n        Post::factory()\n            ->count(3)\n            ->has(Comment::factory()->count(10))\n    )\n    ->create();\n```\n\n```text\nUser\n └── Post × 3\n       └── Comment × 10\n```\n\nOne expression, one user, three posts, thirty comments. Written by hand that is a loop inside a loop with two foreign keys to keep straight.\n\nA child can also see its parent, which is how you make related data consistent:\n\n```php\nPost::factory()->has(\n    Comment::factory()->count(3)->state(\n        fn (array $attributes, Post $post) => ['is_author' => $post->user_id === 1],\n    )\n)\n```\n\n---\n\n### 3. Advanced — many-to-many\n\n<b>`hasAttached()`</b> handles the pivot:\n\n```php\nUser::factory()\n    ->hasAttached(Role::factory()->count(2))\n    ->create();\n```\n\nRows in `users`, rows in `roles`, and rows in `role_user` joining them.\n\nPivot data goes in the second argument:\n\n```php\nUser::factory()\n    ->hasAttached(Role::factory(), ['assigned_by' => 1])\n    ->create();\n```\n\nAnd existing models work here too:\n\n```php\n$roles = Role::all();\n\nUser::factory(10)->hasAttached($roles)->create();\n```\n\nTen users, all sharing the roles that already exist, rather than twenty new roles nobody asked for.\n\n<b>That is the trap worth naming.</b> Every `Post::factory()` inside a `has()` builds a new parent unless you hand it one, so a careless graph multiplies:\n\n```text\nUser::factory(10)->has(Post::factory(5)->hasAttached(Tag::factory(3)))\n\n10 users\n50 posts\n150 tags        ← almost certainly not what you wanted\n```\n\nA real application has ten tags shared by every post. The next lesson's `recycle()` is the fix, and knowing the problem exists is most of it.\n\nThe skill this is all pointing at: <b>read your relationship diagram, and write it down as a factory graph.</b> `User hasMany Post hasMany Comment` becomes `User::factory()->has(Post::factory()->has(Comment::factory()))`, more or less directly.",
      diagram: `Two directions, matching Day 15

  has()   the PARENT makes children      hasOne, hasMany
  for()   the CHILD gets a parent        belongsTo

  User::factory()->has(Post::factory()->count(3))->create()

    User #1
     ├── Post #1
     ├── Post #2
     └── Post #3

  Post::factory()->for(User::factory())->create()

    User #1
       ↑ user_id
    Post #1

  for() goes on the side holding the foreign key.


Existing models, not new ones

  \$user = User::factory()->create();
  Post::factory(5)->for(\$user)->create();

  Five posts for THAT user, not five users.


Naming, and the magic methods

  ->has(Post::factory()->count(3), 'articles')
  ->for(User::factory(), 'author')

  ->hasPosts(3)
  ->forUser()


They nest, and that is the point

  User::factory()
      ->has(Post::factory()->count(3)
          ->has(Comment::factory()->count(10)))
      ->create();

  User
   └── Post × 3
         └── Comment × 10

  One expression. By hand that is a loop inside a
  loop with two foreign keys to keep straight.


Many-to-many

  ->hasAttached(Role::factory()->count(2))
  ->hasAttached(Role::factory(), ['assigned_by' => 1])
  ->hasAttached(\$existingRoles)


⚠️  The multiplication trap

  User::factory(10)
      ->has(Post::factory(5)
          ->hasAttached(Tag::factory(3)))

    10 users
    50 posts
   150 tags        ← a real app has ten tags, shared

  Every factory inside a has() builds a NEW parent
  unless you hand it one. recycle() is next.


The skill: read the diagram, write the graph.

  User hasMany Post hasMany Comment
      ↓
  User::factory()->has(Post::factory()->has(Comment::factory()))`,
      codeExample: {
        title: "Building object graphs",
        code: `<?php

use App\\Models\\Comment;
use App\\Models\\Post;
use App\\Models\\Role;
use App\\Models\\User;

// ---------- Parent makes children ----------

User::factory()
    ->has(Post::factory()->count(3))
    ->create();

// The magic method reads better for the simple case.
User::factory()->hasPosts(3)->create();

// A named relationship.
User::factory()
    ->has(Post::factory()->count(3), 'articles')
    ->create();


// ---------- Child gets a parent ----------

// Creates a new user too.
Post::factory()->for(User::factory())->create();

// Usually what you want: an existing parent.
$user = User::factory()->create();

Post::factory(5)->for($user)->create();

Post::factory()->for($user, 'author')->create();


// ---------- Nesting: the whole graph in one expression ----------

User::factory()
    ->count(50)
    ->has(
        Post::factory()
            ->count(3)
            ->has(
                Comment::factory()->count(10)
            )
    )
    ->create();

// 50 users, 150 posts, 1500 comments.


// ---------- A child that can see its parent ----------

Post::factory()
    ->has(
        Comment::factory()
            ->count(3)
            ->state(fn (array $attributes, Post $post) => [
                'title' => 'Re: ' . $post->title,
            ])
    )
    ->create();


// ---------- Many-to-many ----------

User::factory()
    ->hasAttached(Role::factory()->count(2))
    ->create();

// With pivot data.
User::factory()
    ->hasAttached(
        Role::factory(),
        ['assigned_by' => 1, 'assigned_at' => now()],
    )
    ->create();

// Existing roles, shared by everyone.
$roles = Role::all();

User::factory(10)->hasAttached($roles)->create();


// ---------- The multiplication trap ----------

// ❌ 10 users, 50 posts, and 150 different tags.
User::factory(10)
    ->has(Post::factory(5)->hasAttached(Tag::factory(3)))
    ->create();

// ✓ Ten tags, shared, which is what a real application has.
$tags = Tag::factory(10)->create();

User::factory(10)
    ->has(Post::factory(5)->hasAttached($tags->random(3)))
    ->create();`,
      },
      keyTakeaways: [
        "<b>`has()` creates children from the parent</b>, matching `hasOne` and `hasMany`.",
        "<b>`for()` gives the child a parent</b>, matching `belongsTo`, and goes on the side holding the foreign key.",
        "<b>`for()` accepts an existing model</b>, which is usually what you want: five posts for one user, not five users.",
        "Pass a relationship name as a second argument when it is not named after the model.",
        "`hasPosts(3)` and `forUser()` are magic-method shorthands for the common cases.",
        "<b>Factory relationships nest</b>, so one expression can build a user, its posts and their comments.",
        "A nested state closure receives the parent model, which keeps related data consistent.",
        "<b>`hasAttached()` handles many-to-many</b>, creating the pivot rows, and takes pivot data as a second argument.",
        "<b>Every factory inside a `has()` builds a new parent unless you hand it one</b>, so graphs multiply fast.",
        "<b>Read your relationship diagram and write it down as a factory graph</b>; that is the skill this is building.",
      ],
      commonMistakes: [
        "<b>Using `has()` where `for()` was meant.</b> The direction follows the foreign key, exactly as in the model.",
        "<b>Passing a factory to `for()` when a model already exists.</b> You get a new parent per child.",
        "<b>Nesting `hasAttached(Tag::factory(3))` inside a loop of posts.</b> Every post invents three tags of its own.",
        "<b>Forgetting the relationship name when it does not match the model.</b> `has(Post::factory(), 'articles')`.",
        "<b>Building graphs by hand with loops and foreign keys.</b> The nested expression is shorter and cannot get the keys wrong.",
      ],
      quiz: [
        {
          question: "Which method creates a `belongsTo` parent for a model?",
          options: ["`has()`", "`for()`", "`hasAttached()`", "`state()`"],
          correctIndex: 1,
          explanation: "`for()` goes on the side holding the foreign key.",
        },
        {
          question: "How many comments does `User::factory(10)->has(Post::factory(2)->has(Comment::factory(5)))->create()` produce?",
          options: ["50", "100", "10", "20"],
          correctIndex: 1,
          explanation: "10 users × 2 posts × 5 comments = 100 comments, and 20 posts.",
        },
        {
          question: "What does `hasAttached()` handle?",
          options: [
            "A `hasMany` relationship",
            "A many-to-many relationship, including the pivot rows",
            "A polymorphic relationship",
            "Attaching a file",
          ],
          correctIndex: 1,
          explanation: "Its second argument is the pivot data.",
        },
        {
          question: "Why does `->has(Post::factory(5)->hasAttached(Tag::factory(3)))` produce so many tags?",
          options: [
            "Tags are duplicated by Laravel",
            "Every post builds three new tags, because a factory inside `has()` creates new models",
            "`hasAttached()` doubles the count",
            "It does not; tags are shared",
          ],
          correctIndex: 1,
          explanation: "Hand it existing models, or use `recycle()`.",
        },
      ],
    },
    {
      id: "sequences-and-recycling",
      title: "Sequences & recycling models",
      durationMinutes: 11,
      explanation: "Random data is realistic. It is also useless when you need to see every case on one screen.\n\n---\n\n### 1. Basic — predictable variation\n\nTen users from a factory are ten random users. If `role` is random, you might get ten readers and no admin, and your dashboard looks empty for reasons that have nothing to do with your code.\n\n<b>A <i>sequence</i></b> (a set of states applied in turn) gives you variation you control:\n\n```php\nuse Illuminate\\Database\\Eloquent\\Factories\\Sequence;\n\nUser::factory()\n    ->count(3)\n    ->state(new Sequence(\n        ['role' => 'admin'],\n        ['role' => 'editor'],\n        ['role' => 'user'],\n    ))\n    ->create();\n```\n\n```text\nUser 1 → admin\nUser 2 → editor\nUser 3 → user\n```\n\nAnd it cycles when there are more models than states:\n\n```php\nPost::factory()\n    ->count(6)\n    ->state(new Sequence(\n        ['status' => 'draft'],\n        ['status' => 'published'],\n    ))\n    ->create();\n```\n\n```text\n1 → draft       4 → published\n2 → published   5 → draft\n3 → draft       6 → published\n```\n\nThree of each, every time, which is what a screen showing both statuses needs.\n\nThere is a shorthand for the common case:\n\n```php\n->sequence(['status' => 'draft'], ['status' => 'published'])\n```\n\nand a closure form when the value should depend on the index:\n\n```php\n->sequence(fn (Sequence $sequence) => ['number' => 'INV-' . $sequence->index])\n```\n\n---\n\n### 2. Intermediate — the multiplication problem\n\nThe trap from the last lesson, stated properly.\n\n```php\nPost::factory()->count(100)->create();\n```\n\nIf the post factory creates its own user, that is a hundred posts and a hundred users. Every user has exactly one post, which is not what any real application looks like:\n\n```text\nWithout recycling          What you wanted\n─────────────────          ───────────────\n100 posts                  100 posts\n100 users                  10 users\n1 post each                10 posts each\n```\n\nAnd it matters more than it looks. A dashboard grouping orders by customer shows a hundred rows of one. A test for \"customers with more than five orders\" finds none. The data is technically valid and tells you nothing.\n\n---\n\n### 3. Advanced — `recycle()`\n\n<b>`recycle()` hands a factory a pool of existing models to draw from</b> instead of creating new ones:\n\n```php\n$users = User::factory()->count(10)->create();\n\nPost::factory()\n    ->count(100)\n    ->recycle($users)\n    ->create();\n```\n\n```text\n10 users\n   ↓\n100 posts, spread across them\n```\n\nIt applies wherever that model is needed anywhere in the graph, including nested factories, which is what makes it worth knowing. One `recycle()` at the top fixes the multiplication all the way down:\n\n```php\n$tags = Tag::factory(10)->create();\n\nUser::factory(10)\n    ->has(Post::factory(5)->hasAttached(Tag::factory(3)))\n    ->recycle($tags)\n    ->create();\n```\n\nTen users, fifty posts, and the same ten tags shared between them. Without it, a hundred and fifty tags.\n\nYou can recycle several models at once:\n\n```php\n->recycle([$users, $categories])\n```\n\n<b>The habit worth forming: decide the shape of the data before you write the factory call.</b> Not \"a hundred posts\", but:\n\n```text\n10 customers\n40 invoices        4 each on average\n120 lines          3 per invoice\n8 tags             shared\n```\n\nWrite those numbers down, then make the factory produce them. Data that has the shape of the real thing finds bugs that a hundred rows of one-each never will.",
      diagram: `Random is realistic, and useless for seeing cases

  Ten users with a random role might be
  ten readers and no admin, and your dashboard
  looks empty for reasons that are not your code.


A sequence applies states in turn

  ->state(new Sequence(
        ['role' => 'admin'],
        ['role' => 'editor'],
        ['role' => 'user'],
    ))

  User 1 → admin
  User 2 → editor
  User 3 → user

  And it CYCLES:

  6 posts, 2 states       1 → draft      4 → published
                          2 → published  5 → draft
                          3 → draft      6 → published

  ->sequence([...], [...])                     shorthand
  ->sequence(fn (\$seq) => ['n' => \$seq->index])  by index


The multiplication problem

  Post::factory()->count(100)->create();

  If the factory creates its own user:

  Without recycling          What you wanted
  ─────────────────          ───────────────
  100 posts                  100 posts
  100 users                  10 users
  1 post each                10 posts each

  A dashboard grouping by customer shows a hundred
  rows of one. A test for "customers with 5+ orders"
  finds none. Valid data that tells you nothing.


recycle() hands the factory a pool

  \$users = User::factory(10)->create();

  Post::factory(100)->recycle(\$users)->create();

    10 users
       ↓
    100 posts, spread across them

  It applies ANYWHERE that model is needed in the
  graph, including nested factories. One recycle()
  at the top fixes the multiplication all the way down.

  ->recycle([\$users, \$categories])   several at once


The habit: decide the shape first

  Not "a hundred posts", but:

    10 customers
    40 invoices     4 each on average
   120 lines        3 per invoice
     8 tags         shared

  Then make the factory produce those numbers.`,
      codeExample: {
        title: "Controlling the shape of your data",
        code: `<?php

use App\\Models\\Post;
use App\\Models\\Tag;
use App\\Models\\User;
use Illuminate\\Database\\Eloquent\\Factories\\Sequence;

// ---------- Predictable variation ----------

User::factory()
    ->count(3)
    ->state(new Sequence(
        ['role' => 'admin'],
        ['role' => 'editor'],
        ['role' => 'user'],
    ))
    ->create();

// The shorthand.
Post::factory()
    ->count(6)
    ->sequence(
        ['status' => 'draft'],
        ['status' => 'published'],
    )
    ->create();

// Three of each, cycling. Every time.


// ---------- Depending on the index ----------

Invoice::factory()
    ->count(50)
    ->sequence(fn (Sequence $sequence) => [
        'number' => 'INV-' . str_pad($sequence->index + 1, 5, '0', STR_PAD_LEFT),
    ])
    ->create();

// INV-00001, INV-00002, ...


// ---------- The multiplication problem ----------

// ❌ 100 posts and 100 users, one post each.
Post::factory()->count(100)->create();

// ✓ 10 users, 100 posts spread across them.
$users = User::factory()->count(10)->create();

Post::factory()
    ->count(100)
    ->recycle($users)
    ->create();


// ---------- recycle() reaches the whole graph ----------

// ❌ 10 users, 50 posts, 150 different tags.
User::factory(10)
    ->has(Post::factory(5)->hasAttached(Tag::factory(3)))
    ->create();

// ✓ 10 users, 50 posts, and the same 10 tags shared.
$tags = Tag::factory(10)->create();

User::factory(10)
    ->has(Post::factory(5)->hasAttached(Tag::factory(3)))
    ->recycle($tags)
    ->create();

// Several pools at once.
User::factory(10)
    ->has(Post::factory(5))
    ->recycle([$tags, $categories])
    ->create();


// ---------- Decide the shape, then write it ----------

// 10 customers
// 40 invoices     4 each on average
// 120 lines       3 per invoice
// 8 tags          shared

$tags = Tag::factory(8)->create();

Customer::factory(10)
    ->has(
        Invoice::factory(4)
            ->has(InvoiceLine::factory(3))
            ->sequence(
                ['status' => 'paid'],
                ['status' => 'unpaid'],
                ['status' => 'overdue'],
                ['status' => 'draft'],
            )
    )
    ->recycle($tags)
    ->create();

// Every status appears. Every customer has several invoices.
// Grouping and filtering screens have something to show.`,
      },
      keyTakeaways: [
        "<b>A sequence applies a set of states in turn</b>, giving you variation you control instead of luck.",
        "<b>It cycles</b>, so six models and two states give three of each, every time.",
        "`->sequence(...)` is the shorthand, and a closure form receives the index for numbering.",
        "<b>Every factory in a graph creates its own parents unless told otherwise</b>, so 100 posts can mean 100 users.",
        "That data is valid and useless: one post each means grouping and filtering screens show nothing.",
        "<b>`recycle()` hands a factory a pool of existing models to reuse.</b>",
        "<b>It applies anywhere that model is needed in the graph</b>, so one call at the top fixes nested factories too.",
        "`recycle([$a, $b])` supplies several pools at once.",
        "<b>Decide the shape of the data before writing the factory call</b>: how many of each, and how they distribute.",
      ],
      commonMistakes: [
        "<b>Creating a hundred children and getting a hundred parents.</b> Recycle a small pool instead.",
        "<b>Relying on random values to produce every case.</b> A sequence guarantees them; chance does not.",
        "<b>Seeding one child per parent.</b> Every screen that groups or counts then looks broken.",
        "<b>Recycling models that were only made in memory.</b> `recycle()` needs saved models with ids.",
        "<b>Writing the factory call before deciding the numbers.</b> The shape of the data is the actual decision.",
      ],
      quiz: [
        {
          question: "What does a `Sequence` do?",
          options: [
            "Orders the models by id",
            "Applies a set of states in turn, cycling when there are more models than states",
            "Numbers the records",
            "Runs the factory in order",
          ],
          correctIndex: 1,
          explanation: "Six models and two states give three of each.",
        },
        {
          question: "What problem does `recycle()` solve?",
          options: [
            "Slow factories",
            "Every nested factory creating new parents, so 100 posts means 100 users",
            "Duplicate emails",
            "Missing foreign keys",
          ],
          correctIndex: 1,
          explanation: "It hands the factory a pool of existing models to draw from.",
        },
        {
          question: "Where does `recycle()` apply?",
          options: [
            "Only to the top-level factory",
            "Anywhere that model is needed in the graph, including nested factories",
            "Only to many-to-many relationships",
            "Only in seeders",
          ],
          correctIndex: 1,
          explanation: "One call at the top fixes the multiplication all the way down.",
        },
        {
          question: "Why is one post per user bad seed data?",
          options: [
            "It is slower to create",
            "Screens that group, count or filter by parent have nothing meaningful to show",
            "Laravel rejects it",
            "It breaks eager loading",
          ],
          correctIndex: 1,
          explanation: "The data is valid and tells you nothing about your application.",
        },
      ],
    },
    {
      id: "seeders",
      title: "Seeders & migrate:fresh --seed",
      durationMinutes: 11,
      explanation: "A factory says what one model looks like. A seeder says what the database should contain.\n\n---\n\n### 1. Basic — the entry point\n\n```bash\nphp artisan make:seeder UserSeeder\n```\n\n```text\ndatabase/seeders/\n```\n\nEvery seeder is one `run()` method:\n\n```php\nclass UserSeeder extends Seeder\n{\n    public function run(): void\n    {\n        User::factory(50)->create();\n    }\n}\n```\n\nLaravel gives you `DatabaseSeeder` as the entry point, and:\n\n```bash\nphp artisan db:seed\n```\n\nruns it. A specific one:\n\n```bash\nphp artisan db:seed --class=UserSeeder\n```\n\nUnlike migrations, <b>seeders are not tracked.</b> There is no `seeders` table and nothing remembers what ran, so running `db:seed` twice runs everything twice. That is the source of most seeding confusion, and the reason for the reset command below.\n\n---\n\n### 2. Intermediate — splitting it up\n\nOne `DatabaseSeeder` holding everything becomes unreadable quickly. Split by concept and call them in order:\n\n```php\npublic function run(): void\n{\n    $this->call([\n        RoleSeeder::class,\n        UserSeeder::class,\n        PostSeeder::class,\n    ]);\n}\n```\n\n```text\nDatabaseSeeder\n      │\n      ├── RoleSeeder\n      ├── UserSeeder\n      └── PostSeeder\n```\n\n<b>The order is the dependency order.</b> Users referencing roles means roles first, and a foreign key will tell you loudly if you get it wrong.\n\nSeeders divide naturally into two kinds, and it is worth being deliberate about which you are writing:\n\n```text\nReference data          Sample data\n──────────────          ───────────\nroles, permissions      50 users\ncountries, currencies   200 posts\nplan tiers              1000 comments\n\nproduction needs it     development only\nuse firstOrCreate()     use factories\nrunning twice is safe   running twice doubles it\n```\n\nReference data belongs in a seeder that is safe to re-run, which is `updateOrCreate()` from Day 14 doing its job. Sample data belongs behind a check:\n\n```php\nif (! app()->isProduction()) {\n    User::factory(50)->create();\n}\n```\n\n---\n\n### 3. Advanced — the command you will use every day\n\n```bash\nphp artisan migrate:fresh --seed\n```\n\n```text\nDROP every table\n       ↓\nrun all migrations\n       ↓\nrun the seeders\n       ↓\na known, realistic database\n```\n\nThis is the loop that makes local development pleasant. Broke the data testing something? One command and you are back to a known state. Changed a migration? Same command. No manual cleanup, ever.\n\n<b>And it drops every table in whatever database `.env` points at.</b> Day 12 said this about `migrate:fresh` and it is worth repeating with seeding attached, because the command is now something you type ten times a day and muscle memory does not check `.env`.\n\nA related note on tests. A test suite usually uses `RefreshDatabase`, which runs migrations and rolls back after each test, and it does <i>not</i> run your seeders unless you ask. That is deliberate: tests want the small controlled data of the next lesson, not fifty users.\n\nOne last practical point. Seeding a realistic dataset can take a while, because every `create()` is an insert plus events. Two things help: wrap a large seeder in a transaction, and prefer a handful of well-shaped records over tens of thousands of random ones. <b>Seed data exists to make the application usable and its bugs visible, not to load-test it.</b>",
      diagram: `Seeder: what the database should contain

  php artisan make:seeder UserSeeder
  → database/seeders/

  public function run(): void
  {
      User::factory(50)->create();
  }

  php artisan db:seed                       runs DatabaseSeeder
  php artisan db:seed --class=UserSeeder    runs one


  ⚠️  Seeders are NOT tracked. No seeders table,
      nothing remembers what ran. db:seed twice
      runs everything twice.


Split by concept, call in dependency order

  DatabaseSeeder
        │
        ├── RoleSeeder        roles first...
        ├── UserSeeder        ...because users reference them
        └── PostSeeder

  \$this->call([RoleSeeder::class, UserSeeder::class, ...]);


Two kinds of seeder

  Reference data            Sample data
  ──────────────            ───────────
  roles, permissions        50 users
  countries, currencies     200 posts
  plan tiers                1000 comments

  production needs it       development only
  use firstOrCreate()       use factories
  running twice is safe     running twice doubles it

  if (! app()->isProduction()) { ... }


The command you will use every day

  php artisan migrate:fresh --seed

    DROP every table
           ↓
    run all migrations
           ↓
    run the seeders
           ↓
    a known, realistic database

  Broke the data? One command. Changed a migration?
  Same command. No manual cleanup, ever.

  ⚠️  It drops every table in whatever database .env
      points at, and you now type this ten times a day.
      Muscle memory does not check .env.


  Tests: RefreshDatabase runs migrations and rolls back
  after each test. It does NOT run your seeders unless
  you ask, and that is deliberate.`,
      codeExample: {
        title: "Seeders, split and safe to re-run",
        code: `<?php
// database/seeders/DatabaseSeeder.php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Order is dependency order: roles before the users
        // that reference them.
        $this->call([
            RoleSeeder::class,
            CountrySeeder::class,
            UserSeeder::class,
            PostSeeder::class,
        ]);
    }
}


<?php
// ---------- Reference data: safe to run twice ----------

namespace Database\\Seeders;

use App\\Models\\Role;
use Illuminate\\Database\\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['admin', 'editor', 'reader'];

        foreach ($roles as $name) {
            // Running this again changes nothing.
            Role::updateOrCreate(
                ['name' => $name],
                ['label' => ucfirst($name)],
            );
        }
    }
}


<?php
// ---------- Sample data: development only ----------

namespace Database\\Seeders;

use App\\Models\\Post;
use App\\Models\\User;
use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Facades\\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // One known account you can always log in with.
        User::updateOrCreate(
            ['email' => 'rajan@example.com'],
            ['name' => 'Rajan', 'password' => bcrypt('password')],
        );

        if (app()->isProduction()) {
            return;
        }

        // A transaction keeps a large seeder from being slow
        // and from leaving half a dataset behind if it fails.
        DB::transaction(function () {
            $users = User::factory(50)->create();

            Post::factory(200)->recycle($users)->create();
        });
    }
}


# ---------- Running them ----------

php artisan db:seed                       # DatabaseSeeder
php artisan db:seed --class=UserSeeder    # one seeder

# The loop you will actually live in:
php artisan migrate:fresh --seed

#   DROP every table → migrate → seed
#
# ⚠️ Whatever database .env points at. Check it.`,
      },
      keyTakeaways: [
        "<b>A seeder's `run()` method says what the database should contain</b>, using factories for the volume.",
        "`php artisan db:seed` runs `DatabaseSeeder`; `--class=` runs a specific one.",
        "<b>Seeders are not tracked</b>, so running `db:seed` twice runs everything twice.",
        "<b>Split seeders by concept and call them in dependency order</b> from `DatabaseSeeder`.",
        "<b>Reference data (roles, countries) belongs in a seeder that is safe to re-run</b>, using `updateOrCreate()`.",
        "Sample data belongs behind an `app()->isProduction()` check.",
        "<b>`php artisan migrate:fresh --seed` drops every table, migrates and seeds</b>, which is the local development loop.",
        "<b>It drops whatever database `.env` points at</b>, and you will type it often enough to stop reading it.",
        "`RefreshDatabase` in tests runs migrations but not your seeders, which is deliberate.",
        "<b>Seed data exists to make the application usable and its bugs visible</b>, not to load-test it.",
      ],
      commonMistakes: [
        "<b>Running `db:seed` twice and wondering why there are a hundred users.</b> Nothing tracks what already ran.",
        "<b>Putting everything in `DatabaseSeeder`.</b> It becomes unreadable and impossible to run in parts.",
        "<b>Calling seeders in the wrong order.</b> A foreign key fails when the parent has not been seeded.",
        "<b>Using factories for reference data.</b> Roles and countries are known values, not random ones.",
        "<b>Running `migrate:fresh --seed` against the wrong `.env`.</b> Every table is dropped, with no undo.",
      ],
      quiz: [
        {
          question: "What is the difference between a factory and a seeder?",
          options: [
            "None",
            "A factory describes one model; a seeder decides what the database should contain",
            "A seeder is for production only",
            "A factory saves rows, a seeder does not",
          ],
          correctIndex: 1,
          explanation: "Seeders use factories to produce the volume.",
        },
        {
          question: "What happens if you run `php artisan db:seed` twice?",
          options: [
            "Nothing, Laravel skips seeders that have run",
            "Everything runs again, so factory data is duplicated",
            "It throws an error",
            "Only new seeders run",
          ],
          correctIndex: 1,
          explanation: "Unlike migrations, seeders are not tracked.",
        },
        {
          question: "What does `php artisan migrate:fresh --seed` do?",
          options: [
            "Runs pending migrations and seeds",
            "Drops every table, runs all migrations, then runs the seeders",
            "Rolls back and reseeds only the latest batch",
            "Seeds without touching the schema",
          ],
          correctIndex: 1,
          explanation: "A known starting point, and no undo.",
        },
        {
          question: "How should reference data such as roles be seeded?",
          options: [
            "With a factory",
            "With `updateOrCreate()`, so running the seeder again changes nothing",
            "Manually in the database",
            "In a migration",
          ],
          correctIndex: 1,
          explanation: "Reference data is known values that production needs too.",
        },
      ],
    },
    {
      id: "faker",
      title: "Faker — realistic values & locales",
      durationMinutes: 10,
      explanation: "The library behind every `fake()` call in your factories.\n\n---\n\n### 1. Basic — the providers you will use\n\n```php\nfake()->name();\nfake()->email();\nfake()->phoneNumber();\nfake()->address();\nfake()->city();\nfake()->country();\nfake()->sentence();\nfake()->paragraph();\nfake()->date();\nfake()->numberBetween(1, 100);\nfake()->randomElement(['draft', 'sent', 'paid']);\nfake()->boolean(70);          // true 70% of the time\nfake()->dateTimeBetween('-1 year', 'now');\n```\n\nIn a factory:\n\n```php\nreturn [\n    'name'  => fake()->name(),\n    'email' => fake()->unique()->safeEmail(),\n    'bio'   => fake()->paragraph(),\n];\n```\n\n<b>Use `safeEmail()` rather than `email()`.</b> It generates addresses on reserved example domains, so a bug that sends mail from your seeded data cannot reach a real inbox. The same instinct applies to anything that might leave the machine.\n\n---\n\n### 2. Intermediate — `unique()`, and what it does not do\n\nFaker draws from finite lists, so duplicates happen:\n\n```php\n'email' => fake()->email(),      // 500 users, some duplicates\n```\n\nand a unique index turns that into a failed seed halfway through.\n\n```php\n'email' => fake()->unique()->safeEmail(),\n```\n\ntracks what it has produced and never repeats.\n\nThree things about it. <b>Uniqueness is per Faker instance</b>, so it resets between runs and cannot know what is already in the database. <b>It can exhaust</b>: ask for a thousand unique values from a list of two hundred and it throws rather than looping forever. And most importantly:\n\n> <b>`unique()` is not a replacement for a database unique constraint.</b>\n\nFaker prevents duplicates in <i>this</i> batch of generated data. The database prevents them from every source, forever, including your application code and a second seeder run. Keep the index; use `unique()` so the seed does not trip over it.\n\nWhen you need certainty rather than randomness, do not use Faker at all:\n\n```php\n'email' => 'user' . $this->faker->unique()->numberBetween(1, 9999) . '@example.com',\n```\n\nis still random. A sequence from the last lesson gives you exact values.\n\n---\n\n### 3. Advanced — locales, and how far to take realism\n\nFaker can generate localised data:\n\n```text\nen_US    ja_JP    fr_FR    de_DE    ne_NP\n```\n\nset in `config/app.php` via `faker_locale`, or per factory:\n\n```php\n$this->faker = \\Faker\\Factory::create('ja_JP');\n```\n\nWhich matters more than it sounds when you are testing anything international:\n\n```text\nnames          a layout that fits \"Bob Smith\" and not much else\naddresses      a form assuming a postcode format\nphone numbers  a validation rule assuming ten digits\ndates          a display assuming day/month\n```\n\nSeeding with only English data means those bugs wait until a real user finds them.\n\n<b>Verify the provider before trusting it.</b> Locale coverage is uneven: some locales have full name, address and phone data, others fall back to English for everything but names. If realism matters for a particular field, check what you actually get.\n\nAnd a word on how much realism to buy. Faker is a means to an end, and the end is data that makes your application usable and its bugs visible. A seeded invoice with a plausible customer, a sensible total and a mix of statuses does that. One with a perfectly formatted VAT number for a jurisdiction you do not operate in does not.\n\n<b>Spend the effort on the shape of the data, not the plausibility of every field.</b>",
      diagram: `The providers you will use

  fake()->name()              fake()->sentence()
  fake()->safeEmail()         fake()->paragraph()
  fake()->phoneNumber()       fake()->date()
  fake()->address()           fake()->numberBetween(1, 100)
  fake()->city()              fake()->randomElement([...])
  fake()->country()           fake()->boolean(70)
                              fake()->dateTimeBetween('-1 year', 'now')

  Use safeEmail(), not email(): reserved example domains,
  so a bug that sends mail cannot reach a real inbox.


unique(), and its limits

  fake()->email()               500 users, some duplicates
                                → the seed fails halfway
  fake()->unique()->safeEmail() never repeats

  per Faker INSTANCE     resets between runs, knows
                         nothing about existing rows
  can EXHAUST            1,000 unique values from a
                         list of 200 throws

  > unique() is NOT a replacement for a database
    unique constraint.

  Faker prevents duplicates in this batch.
  The database prevents them from every source, forever.

  Keep the index. Use unique() so the seed
  does not trip over it.


Locales

  en_US   ja_JP   fr_FR   de_DE   ne_NP

  config/app.php → faker_locale

  Why it matters:

    names          a layout that fits "Bob Smith" and little else
    addresses      a form assuming one postcode format
    phone numbers  a rule assuming ten digits
    dates          a display assuming day/month

  Seed only in English and those bugs wait
  for a real user to find them.

  ⚠️  Coverage is uneven. Some locales have full name,
      address and phone data; others fall back to English.
      Check the provider when realism matters.


How much realism to buy

  The end is data that makes the application usable
  and its bugs visible.

  ✓ a plausible customer, a sensible total, a mix of statuses
  ✗ a perfectly formatted VAT number for a country
    you do not operate in

  Spend the effort on the SHAPE of the data.`,
      codeExample: {
        title: "Faker in a factory",
        code: `<?php

namespace Database\\Factories;

use Illuminate\\Database\\Eloquent\\Factories\\Factory;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'   => fake()->name(),

            // safeEmail() uses reserved example domains, so seeded
            // data can never send mail to a real address.
            'email'  => fake()->unique()->safeEmail(),

            'phone'  => fake()->phoneNumber(),
            'bio'    => fake()->paragraph(),
            'city'   => fake()->city(),
            'country'=> fake()->country(),

            // Controlled randomness.
            'age'      => fake()->numberBetween(18, 80),
            'role'     => fake()->randomElement(['reader', 'editor', 'admin']),
            'active'   => fake()->boolean(80),          // true 80% of the time
            'joined_at'=> fake()->dateTimeBetween('-2 years', 'now'),

            // Nullable columns, sometimes null.
            'twitter'  => fake()->optional()->userName(),
        ];
    }
}


<?php
// ---------- unique(), and why the index still matters ----------

// ❌ Faker draws from finite lists, so 500 users will collide
//    and the seed fails halfway through.
'email' => fake()->email(),

// ✓ Never repeats within this run.
'email' => fake()->unique()->safeEmail(),

// But uniqueness is per Faker instance:
//   - it resets between runs
//   - it knows nothing about rows already in the database
//   - it throws if you exhaust the underlying list
//
// So keep the database constraint:
//   $table->string('email')->unique();
//
// Faker stops the seed tripping over it.
// The index is what actually guarantees uniqueness.


<?php
// ---------- Locales ----------

// config/app.php
'faker_locale' => 'ne_NP',

// Or per factory, when one model should be localised:
class JapaneseUserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $this->faker = \\Faker\\Factory::create('ja_JP');

        return [
            'name'    => $this->faker->name(),
            'address' => $this->faker->address(),
            'phone'   => $this->faker->phoneNumber(),
        ];
    }
}

// Seed a mix, and the layout bugs show up on your machine
// rather than in front of a user.


<?php
// ---------- When you want certainty, not randomness ----------

// ❌ Still random, just differently.
'email' => 'user' . fake()->numberBetween(1, 9999) . '@example.com',

// ✓ Exact values, from a sequence.
User::factory(3)->sequence(
    ['email' => 'admin@example.com'],
    ['email' => 'editor@example.com'],
    ['email' => 'reader@example.com'],
)->create();`,
      },
      keyTakeaways: [
        "<b>Faker generates the realistic values behind every `fake()` call</b> in a factory.",
        "<b>Use `safeEmail()` rather than `email()`</b>, so seeded data cannot send mail to a real address.",
        "`randomElement()`, `boolean(70)`, `numberBetween()` and `dateTimeBetween()` give you controlled randomness.",
        "`optional()` produces null some of the time, which is right for a nullable column.",
        "<b>`unique()` stops Faker repeating a value within one run</b>, which unique indexes otherwise break.",
        "<b>Uniqueness is per Faker instance</b>: it resets between runs and knows nothing about existing rows.",
        "It can also exhaust, throwing when you ask for more unique values than the list holds.",
        "<b>`unique()` is not a replacement for a database unique constraint</b>; keep the index and use both.",
        "<b>Locales generate localised names, addresses and phone numbers</b>, which surfaces layout and validation bugs early.",
        "<b>Spend effort on the shape of the data</b>, not the plausibility of every individual field.",
      ],
      commonMistakes: [
        "<b>Using `email()` instead of `safeEmail()`.</b> A seeded bug can then email a real person.",
        "<b>Omitting `unique()` on a column with a unique index.</b> The seed fails partway through.",
        "<b>Trusting `unique()` to prevent duplicates across runs.</b> It resets, and knows nothing about the database.",
        "<b>Dropping the unique index because Faker handles it.</b> Faker only covers this batch of generated data.",
        "<b>Seeding only English data.</b> Layout, validation and formatting bugs wait for a real user instead.",
      ],
      quiz: [
        {
          question: "Why use `safeEmail()` rather than `email()`?",
          options: [
            "It is faster",
            "It generates reserved example domains, so seeded data cannot email a real person",
            "It is always unique",
            "It validates the address",
          ],
          correctIndex: 1,
          explanation: "The same instinct applies to anything that might leave the machine.",
        },
        {
          question: "What does `fake()->unique()` guarantee?",
          options: [
            "No duplicates ever, in any run",
            "No duplicates within this Faker instance's run",
            "A database constraint",
            "That the value is not already in the table",
          ],
          correctIndex: 1,
          explanation: "It resets between runs and knows nothing about existing rows.",
        },
        {
          question: "Why keep a unique index if the factory uses `unique()`?",
          options: [
            "For performance",
            "Faker only covers this batch; the database enforces uniqueness from every source, forever",
            "Laravel requires it",
            "You do not need to",
          ],
          correctIndex: 1,
          explanation: "Use both: the index guarantees it, `unique()` stops the seed tripping over it.",
        },
        {
          question: "Why seed with a non-English Faker locale?",
          options: [
            "It is more realistic in general",
            "It surfaces layout, validation and formatting bugs on your machine rather than in front of a user",
            "English data is not unique",
            "Laravel defaults to it",
          ],
          correctIndex: 1,
          explanation: "Names, addresses, phone formats and dates all differ.",
        },
      ],
    },
    {
      id: "demo-vs-test-data",
      title: "Demo data vs test data",
      durationMinutes: 10,
      explanation: "The same factory serves two purposes that pull in opposite directions, and confusing them makes both worse.\n\n---\n\n### 1. Basic — two different goals\n\n<b>Demo and development data exists to make the application look real.</b>\n\n```text\n50 users\n200 posts\n1000 comments\n20 products\n```\n\nYou want variety, volume and every screen populated. A dashboard with three rows tells you nothing about how it will look; a list with two hundred tells you the pagination works, the sorting is sensible and the empty states are not the only thing you ever see.\n\n<b>Test data exists to prove a behaviour.</b>\n\n```php\n$user = User::factory()->create(['email_verified_at' => null]);\n```\n\nOne user, one attribute that matters, nothing else. The test is \"an unverified user cannot reach this page\", and fifty users and a hundred and fifty posts would make it slower, harder to read and no more convincing.\n\n```text\nDemo data              Test data\n─────────              ─────────\nrealistic              minimal\nvaried                 controlled\nlots of it             as little as possible\nrandom is fine         deterministic\nregenerated often      built per test\n```\n\n---\n\n### 2. Intermediate — what goes wrong when you mix them\n\nTwo failure modes, and you will meet both.\n\n<b>Tests that seed the whole database.</b> Every test runs the full seeder, so the suite crawls, and a test failure could be caused by any of a thousand rows nobody chose. Worse, the test passes for a reason nobody understands, and a change to seed data breaks tests in a file nobody edited.\n\n<b>Demo data built like test data.</b> Three users, one post each, no variety. Every screen looks fine and every screen is lying, because nothing has enough rows to paginate, group or sort meaningfully.\n\nThe fix is a rule worth holding to: <b>a test creates exactly the data it needs, in the test.</b>\n\n```php\npublic function test_unverified_users_cannot_access_billing(): void\n{\n    $user = User::factory()->unverified()->create();\n\n    $this->actingAs($user)->get('/billing')->assertRedirect('/verify');\n}\n```\n\nEverything the test depends on is visible in the test. Six months later, that is the difference between fixing it in a minute and rewriting it.\n\n---\n\n### 3. Advanced — keep the logic out\n\nA related temptation, and the reason for the day's last rule.\n\nA factory that creates a user is simple. Then somebody needs a user with a subscription, so the factory creates one. Then a payment, then a welcome email, then a call to a billing provider:\n\n```text\nFactory\n ├── payment\n ├── email\n ├── external API\n ├── notifications\n └── business process\n```\n\nNow every test that wanted a user sends an email and hits an API, tests are slow and flaky, and nobody can tell what a factory call actually does.\n\n<b>Factories generate data. They do not run your application.</b>\n\nThe scenario still needs building, so build it out of parts:\n\n```text\nfactory        one model, plus what it cannot exist without\nstate          a named variation of that model\nfactory graph  the shape of related data\nseeder         a whole realistic dataset\ntest setup     exactly what this test needs\n```\n\nA user with a subscription is `User::factory()->has(Subscription::factory())`, composed at the call site where it is visible, not hidden in `configure()` where every caller pays for it.\n\nAnd when a test genuinely needs the application's own logic, call the application: run the real registration action, then assert. That is a test of the thing you care about, rather than a test of your factory.",
      diagram: `Two goals, pulling in opposite directions

  Demo / development data        Test data
  ───────────────────────        ─────────
  make it look REAL              prove a BEHAVIOUR

  50 users                       1 user
  200 posts                      the one attribute that matters
  1000 comments                  nothing else

  realistic                      minimal
  varied                         controlled
  lots of it                     as little as possible
  random is fine                 deterministic
  regenerated often              built per test


What goes wrong when you mix them

  Tests that seed everything
    the suite crawls
    a failure could be caused by any of a thousand rows
    the test passes for a reason nobody understands
    changing seed data breaks tests nobody edited

  Demo data built like test data
    3 users, 1 post each, no variety
    every screen looks fine and every screen is lying
    nothing paginates, groups or sorts meaningfully


The rule

  A test creates exactly the data it needs, IN the test.

  public function test_unverified_users_cannot_access_billing()
  {
      \$user = User::factory()->unverified()->create();

      \$this->actingAs(\$user)->get('/billing')
           ->assertRedirect('/verify');
  }

  Everything it depends on is visible in the test.


Keep the logic out

  Factory
   ├── payment
   ├── email
   ├── external API        ← every test that wanted a user
   ├── notifications          now sends mail and hits an API
   └── business process

  Factories generate DATA. They do not run your application.

  Build scenarios out of parts:

    factory        one model, plus what it cannot exist without
    state          a named variation
    factory graph  the shape of related data
    seeder         a whole realistic dataset
    test setup     exactly what this test needs

  A user with a subscription is
    User::factory()->has(Subscription::factory())
  composed where it is visible, not hidden in configure()
  where every caller pays for it.`,
      codeExample: {
        title: "The same factory, used two ways",
        code: `<?php
// ---------- Demo data: realistic, varied, plenty of it ----------

namespace Database\\Seeders;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([RoleSeeder::class]);

        if (app()->isProduction()) {
            return;
        }

        $tags = Tag::factory(8)->create();

        Customer::factory(20)
            ->has(
                Invoice::factory(6)
                    ->has(InvoiceLine::factory(3))
                    ->sequence(
                        ['status' => 'paid'],
                        ['status' => 'unpaid'],
                        ['status' => 'overdue'],
                    )
            )
            ->recycle($tags)
            ->create();

        // 20 customers, 120 invoices, 360 lines, every status
        // represented, 8 shared tags. Every screen has something
        // real to show.
    }
}


<?php
// ---------- Test data: one thing, deliberately ----------

class BillingTest extends TestCase
{
    use RefreshDatabase;

    public function test_unverified_users_cannot_access_billing(): void
    {
        // Exactly what this test needs, visible in the test.
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->get('/billing')
            ->assertRedirect('/verify');
    }

    public function test_overdue_invoices_appear_first(): void
    {
        $customer = Customer::factory()->create();

        Invoice::factory()->for($customer)->create(['status' => 'paid']);
        $overdue = Invoice::factory()->for($customer)->create(['status' => 'overdue']);

        $this->get("/customers/{$customer->id}")
            ->assertSeeInOrder([$overdue->number, 'paid']);
    }
}

// Two invoices, not two hundred. The assertion is about
// ordering, so two is enough to prove it.


<?php
// ---------- Keeping logic out of factories ----------

// ❌ Every test that wanted a user now sends an email
//    and calls a payment provider.
public function configure(): static
{
    return $this->afterCreating(function (User $user) {
        $subscription = $user->subscriptions()->create([...]);
        Payment::create([...]);
        Mail::to($user)->send(new WelcomeMail());
        Billing::createCustomer($user);
    });
}

// ✓ Compose the scenario where it is visible.
$user = User::factory()
    ->has(Subscription::factory()->active())
    ->create();

// ✓ And when the test needs the real behaviour,
//    call the real thing.
$this->post('/register', [
    'name' => 'Rajan',
    'email' => 'rajan@example.com',
    'password' => 'password',
]);

Mail::assertSent(WelcomeMail::class);`,
      },
      keyTakeaways: [
        "<b>Demo data exists to make the application look real</b>: varied, plentiful, every screen populated.",
        "<b>Test data exists to prove a behaviour</b>: minimal, controlled and deterministic.",
        "A dashboard with three rows tells you nothing about pagination, grouping or sorting.",
        "<b>A test that seeds the whole database is slow, and fails for reasons nobody chose.</b>",
        "<b>A test should create exactly the data it needs, inside the test</b>, so everything it depends on is visible.",
        "Demo data built like test data makes every screen look fine while telling you nothing.",
        "<b>Factories generate data; they do not run your application.</b>",
        "A factory full of payments, emails and API calls makes every test slow, flaky and opaque.",
        "<b>Compose scenarios from factories, states, graphs and seeders</b>, at the call site where they are visible.",
        "When a test needs real behaviour, call the real action rather than reproducing it in a factory.",
      ],
      commonMistakes: [
        "<b>Running the full seeder before every test.</b> The suite crawls and failures become unexplainable.",
        "<b>Seeding three records and calling it demo data.</b> Nothing paginates, groups or sorts meaningfully.",
        "<b>Hiding a scenario in `configure()`.</b> Every caller creates rows it never asked for.",
        "<b>Sending mail or calling an API from a factory.</b> Tests become slow, flaky and hard to trust.",
        "<b>Relying on seeded rows in a test.</b> A change to the seeder breaks tests in files nobody touched.",
      ],
      quiz: [
        {
          question: "What is demo data for?",
          options: [
            "Proving behaviour in tests",
            "Making the application look and behave realistically while developing",
            "Load testing",
            "Production records",
          ],
          correctIndex: 1,
          explanation: "Variety and volume, so screens have something real to show.",
        },
        {
          question: "What should a test create?",
          options: [
            "The full seeded dataset",
            "Exactly the data that test needs, inside the test",
            "Nothing; it should reuse seeded data",
            "As much as possible, for realism",
          ],
          correctIndex: 1,
          explanation: "Everything the test depends on is then visible in the test.",
        },
        {
          question: "Why keep business logic out of factories?",
          options: [
            "Factories cannot call services",
            "Every test that wanted a model then runs emails, payments and API calls",
            "It is slower to write",
            "Laravel forbids it",
          ],
          correctIndex: 1,
          explanation: "Slow, flaky, and nobody can tell what a factory call actually does.",
        },
        {
          question: "Where should \"a user with an active subscription\" be composed?",
          options: [
            "In `configure()` on the factory",
            "At the call site, with `->has(Subscription::factory()->active())`",
            "In a seeder only",
            "In the model",
          ],
          correctIndex: 1,
          explanation: "Visible where it is used, rather than paid for by every caller.",
        },
      ],
    },
    {
      id: "building-a-graph",
      title: "Building a whole graph, and checking it",
      durationMinutes: 11,
      explanation: "Everything so far, in one expression, and then the part people skip.\n\n---\n\n### 1. Basic — reading the diagram\n\nThe skill this day is really teaching is a translation. You have a relationship diagram:\n\n```text\nUser\n ↓ hasMany\nPost\n ↓ hasMany\nComment\n```\n\nand you write it down as a factory graph:\n\n```text\nUser::factory()\n    → has Posts\n        → has Comments\n```\n\n```php\nUser::factory()\n    ->count(50)\n    ->has(\n        Post::factory()\n            ->count(3)\n            ->has(Comment::factory()->count(10))\n    )\n    ->create();\n```\n\n```text\n50 Users\n    ×\n 3 Posts   = 150 Posts\n    ×\n10 Comments = 1500 Comments\n```\n\n<b>Do the multiplication before you run it.</b> Fifty times three times ten is 1,500 comments, which is fine. Change those numbers to a hundred, ten and fifty and you have 50,000 rows and a seeder that takes minutes.\n\nThat is the whole trick. Not memorising `has()`, `for()`, `hasAttached()` and `recycle()`, but looking at a domain and knowing what shape of data it should produce.\n\n---\n\n### 2. Intermediate — put it in a seeder\n\n```php\nclass DatabaseSeeder extends Seeder\n{\n    public function run(): void\n    {\n        User::factory()\n            ->count(50)\n            ->has(Post::factory()->count(3)->has(Comment::factory()->count(10)))\n            ->create();\n    }\n}\n```\n\n```bash\nphp artisan migrate:fresh --seed\n```\n\nOne command, a complete database.\n\nA few refinements worth making once the basic version works:\n\n```text\nrecycle()      so comments come from the 50 users, not 1,500 new ones\nsequence()     so posts are not all the same status\na known login  one user with a fixed email you can always sign in as\n```\n\nThat middle one matters more than it looks. Without `recycle()`, each comment's author is a brand new user, and you end up with 1,550 users where you meant 50.\n\n---\n\n### 3. Advanced — verify the numbers\n\nHere is the part that gets skipped, and it is the reason seeded data quietly lies to people.\n\n<b>Do not assume it worked. Check.</b>\n\n```php\nUser::count();      // 50\nPost::count();      // 150\nComment::count();   // 1500\n```\n\nThen check the <i>shape</i>, not just the totals:\n\n```php\n$user = User::withCount('posts')->first();\n$user->posts_count;      // 3\n\n$post = Post::withCount('comments')->first();\n$post->comments_count;   // 10\n```\n\nTotals can be right while the distribution is wrong. Fifty users and a hundred and fifty posts is also what you get when one user has all 150, and every screen that groups by user would look broken for a reason that is not your code.\n\nA `tinker` session is the fastest way:\n\n```bash\nphp artisan tinker\n```\n\nand three counts tell you in ten seconds whether the seed did what you meant.\n\nThe questions worth being able to answer before moving on:\n\n```text\nmake() or create()?             in memory, or saved\nafterMaking or afterCreating?   before the id, or after\nhas() or for()?                 parent makes children, or child gets parent\nwhy a Sequence?                 variation you control, not luck\nwhat does recycle() fix?        every nested factory making new parents\nfactory or seeder?              one model, or a whole dataset\nmigrate:fresh --seed?           drop, migrate, seed\n```\n\nAnd the one that matters most: <b>can you look at a relationship diagram and write the factory graph that fills it?</b> If yes, seeding is no longer something you fight with. It is how you get a realistic application on your screen in one command, every time.",
      diagram: `The translation this day is teaching

  Relationship diagram        Factory graph
  ────────────────────        ─────────────
  User                        User::factory()
   ↓ hasMany                      → has Posts
  Post                                → has Comments
   ↓ hasMany
  Comment

  User::factory()
      ->count(50)
      ->has(Post::factory()->count(3)
          ->has(Comment::factory()->count(10)))
      ->create();

    50 Users
        ×
     3 Posts    =  150 Posts
        ×
    10 Comments = 1500 Comments

  ⚠️  Do the multiplication BEFORE you run it.
      100 × 10 × 50 is 50,000 rows and a slow seeder.


Refinements, once the basic version works

  recycle()      so comments come from the 50 users,
                 not 1,500 brand new ones
  sequence()     so posts are not all the same status
  a known login  one user with a fixed email you can
                 always sign in as

  Without recycle(): 50 users become 1,550.


Then verify. This is the part people skip.

  User::count()       50
  Post::count()       150
  Comment::count()    1500

  And the SHAPE, not just the totals:

  User::withCount('posts')->first()->posts_count      3
  Post::withCount('comments')->first()->comments_count  10

  50 users and 150 posts is also what you get when
  ONE user has all 150. Every screen that groups by
  user then looks broken for reasons that are not
  your code.

  php artisan tinker, three counts, ten seconds.


Before moving on, be able to answer

  make() or create()?           in memory, or saved
  afterMaking / afterCreating?  before the id, or after
  has() or for()?               parent makes children,
                                or child gets parent
  why a Sequence?               variation you control
  what does recycle() fix?      nested factories making
                                new parents
  factory or seeder?            one model, or a dataset
  migrate:fresh --seed?         drop, migrate, seed

  And: can you read a relationship diagram and write
  the factory graph that fills it?`,
      codeExample: {
        title: "50 users, 150 posts, 1500 comments, verified",
        code: `<?php
// ---------- The graph ----------

use App\\Models\\Comment;
use App\\Models\\Post;
use App\\Models\\User;

User::factory()
    ->count(50)
    ->has(
        Post::factory()
            ->count(3)
            ->has(
                Comment::factory()->count(10)
            )
    )
    ->create();

// 50 × 3 = 150 posts
// 150 × 10 = 1500 comments


<?php
// ---------- The refined version, in a seeder ----------

namespace Database\\Seeders;

use App\\Models\\Comment;
use App\\Models\\Post;
use App\\Models\\User;
use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // A login you can always use.
        User::factory()->create([
            'name'  => 'Rajan',
            'email' => 'rajan@example.com',
        ]);

        $users = User::factory(50)->create();

        Post::factory()
            ->count(150)
            ->recycle($users)          // authors come from those 50
            ->sequence(
                ['status' => 'draft'],
                ['status' => 'published'],
                ['status' => 'archived'],
            )
            ->has(
                Comment::factory()
                    ->count(10)
                    ->recycle($users)  // commenters too
            )
            ->create();
    }
}


# php artisan migrate:fresh --seed


<?php
// ---------- Verify. Do not assume. ----------

// php artisan tinker

User::count();       // 51  (50 + the known login)
Post::count();       // 150
Comment::count();    // 1500

// Totals can be right while the shape is wrong.
// 150 posts is also what you get if ONE user has all of them.

$user = User::withCount('posts')->first();
$user->posts_count;          // ~3, not 0 and not 150

$post = Post::withCount('comments')->first();
$post->comments_count;       // 10

// Every status present?
Post::select('status')
    ->selectRaw('COUNT(*) as total')
    ->groupBy('status')
    ->get();
// draft 50, published 50, archived 50

// And no accidental extra users:
User::doesntHave('posts')->count();   // should be small, not 1500`,
      },
      keyTakeaways: [
        "<b>The skill is translating a relationship diagram into a factory graph</b>, not memorising the methods.",
        "`User::factory()->has(Post::factory()->has(Comment::factory()))` mirrors `User hasMany Post hasMany Comment`.",
        "<b>Do the multiplication before running it</b>: 50 × 3 × 10 is 1,500 rows, and small changes make it 50,000.",
        "Put the graph in `DatabaseSeeder` so `migrate:fresh --seed` rebuilds everything in one command.",
        "<b>Add `recycle()` so nested factories reuse the parents</b>, or 50 users quietly becomes 1,550.",
        "Add a `sequence()` so every status appears, and one fixed login you can always sign in with.",
        "<b>Verify the counts rather than assuming.</b> `User::count()`, `Post::count()`, `Comment::count()`.",
        "<b>Check the shape too</b>: correct totals can still mean one user owning everything.",
        "`withCount()` in tinker tells you the distribution in ten seconds.",
      ],
      commonMistakes: [
        "<b>Running a graph without multiplying the counts first.</b> Three innocent numbers become fifty thousand rows.",
        "<b>Skipping `recycle()` in a nested graph.</b> Every comment invents a new author.",
        "<b>Trusting the seeder because it did not error.</b> Wrong shape is not an error.",
        "<b>Checking totals but not distribution.</b> One user with 150 posts gives the same total as fifty with three.",
        "<b>Seeding without a known login.</b> You cannot sign in to look at any of it.",
      ],
      quiz: [
        {
          question: "How many comments does `User::factory(50)->has(Post::factory(3)->has(Comment::factory(10)))->create()` produce?",
          options: ["500", "1500", "150", "30"],
          correctIndex: 1,
          explanation: "50 × 3 = 150 posts, and 150 × 10 = 1,500 comments.",
        },
        {
          question: "Without `recycle()`, how many users does that graph create?",
          options: [
            "50",
            "Far more, because every nested factory needing a user creates a new one",
            "150",
            "Exactly 1,500",
          ],
          correctIndex: 1,
          explanation: "Each comment inventing an author is how 50 becomes 1,550.",
        },
        {
          question: "Why check `withCount()` and not just the totals?",
          options: [
            "Totals are unreliable",
            "Correct totals can still mean one parent owns everything, which breaks every grouped screen",
            "`count()` is slow",
            "It verifies the migrations",
          ],
          correctIndex: 1,
          explanation: "Shape matters as much as volume.",
        },
        {
          question: "What is the actual skill this day builds?",
          options: [
            "Memorising `has()`, `for()` and `recycle()`",
            "Reading a relationship diagram and writing the factory graph that fills it",
            "Writing faster seeders",
            "Using Faker locales",
          ],
          correctIndex: 1,
          explanation: "The methods follow once you know the shape you want.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the difference between `make()` and `create()`?",
      options: [
        "None",
        "`make()` builds the model in memory; `create()` also saves it",
        "`make()` is for tests only",
        "`create()` returns an array",
      ],
      correctIndex: 1,
      explanation: "A `make()`d model has no id, so relationships need `create()`.",
    },
    {
      question: "When should you write a factory state rather than passing overrides?",
      options: [
        "Always",
        "When the concept has a name and sets more than one attribute",
        "When the model has relationships",
        "Only in seeders",
      ],
      correctIndex: 1,
      explanation: "A single attribute is usually just an override at the call site.",
    },
    {
      question: "What can `afterCreating()` do that `afterMaking()` cannot?",
      options: [
        "Change attributes",
        "Create related records, because the model now has an id",
        "Run in tests",
        "Access the factory",
      ],
      correctIndex: 1,
      explanation: "`afterMaking()` runs before the row exists.",
    },
    {
      question: "Which method gives a model its `belongsTo` parent?",
      options: ["`has()`", "`for()`", "`hasAttached()`", "`recycle()`"],
      correctIndex: 1,
      explanation: "`for()` goes on the side holding the foreign key.",
    },
    {
      question: "Why use a `Sequence`?",
      options: [
        "To order records by id",
        "To get variation you control, so every case appears instead of relying on luck",
        "To speed up seeding",
        "To make values unique",
      ],
      correctIndex: 1,
      explanation: "Six models and two states give three of each, every time.",
    },
    {
      question: "What problem does `recycle()` solve?",
      options: [
        "Duplicate emails",
        "Nested factories creating new parents, so 100 posts means 100 users",
        "Slow seeders",
        "Missing foreign keys",
      ],
      correctIndex: 1,
      explanation: "It hands the factory a pool of existing models to draw from.",
    },
    {
      question: "What is the difference between a factory and a seeder?",
      options: [
        "None",
        "A factory describes one model; a seeder decides what the database should contain",
        "Seeders are for production",
        "Factories run migrations",
      ],
      correctIndex: 1,
      explanation: "Seeders use factories to produce the volume.",
    },
    {
      question: "Why is `fake()->unique()` not a replacement for a database unique constraint?",
      options: [
        "It is slower",
        "It only prevents duplicates within one Faker run, and knows nothing about existing rows",
        "It only works on emails",
        "It is deprecated",
      ],
      correctIndex: 1,
      explanation: "Keep the index; use `unique()` so the seed does not trip over it.",
    },
    {
      question: "What should a test create?",
      options: [
        "The full seeded dataset",
        "Exactly the data that test needs, inside the test",
        "Fifty users, for realism",
        "Nothing; it should reuse seeded rows",
      ],
      correctIndex: 1,
      explanation: "Everything the test depends on is then visible in the test.",
    },
    {
      question: "What does `php artisan migrate:fresh --seed` do?",
      options: [
        "Runs pending migrations and seeds",
        "Drops every table, runs all migrations, then runs the seeders",
        "Reseeds without touching the schema",
        "Rolls back the last batch and reseeds",
      ],
      correctIndex: 1,
      explanation: "A known starting point, against whatever database `.env` points at.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Replace InvoiceHub's hand-typed data with factories and a seeder, so one command produces a realistic database with every screen populated.",
    brief: "For five days you have typed invoices in by hand to see whether a screen works. Today that ends, and it changes how you build everything after it.\n\nThe target is one command that gives you a believable InvoiceHub: customers with several invoices each, invoices with lines that add up, every status represented, tags shared rather than invented, and a login you can always use. Get that right and every feature you build from here starts with real data in front of you.\n\nOne instruction for the whole day, and it is the one people skip: <b>decide the numbers before you write the factory call.</b> Write down how many customers, how many invoices each, how many lines, how many tags. Then make the factories produce exactly that, and check that they did.",
    steps: [
      "Write down the shape you want before touching any code: customers, invoices per customer, lines per invoice, shared tags, and the split of statuses. Keep that list beside you.",
      "Create `CustomerFactory` with a name, email using `safeEmail()`, phone, city and country. Confirm `Customer::factory()->create()` works from tinker.",
      "Create `InvoiceFactory` with a number, a total, an issue date from `dateTimeBetween()`, and a status. Add `InvoiceLineFactory` with a description, quantity and unit price.",
      "Add states to `InvoiceFactory`: `draft()`, `paid()`, `overdue()` and `cancelled()`. Give `overdue()` a due date in the past so it is genuinely overdue rather than merely labelled.",
      "Add an `afterCreating()` to `InvoiceFactory` that recalculates the invoice total from its lines. Explain in a comment why this cannot be `afterMaking()`.",
      "Build the graph: customers, each with several invoices, each with several lines. Run it once and count the rows before adding anything else.",
      "Add a `sequence()` across the invoice statuses so every status appears on the list page. Load the page and confirm you can see all of them.",
      "Add a `TagFactory` and attach tags with `hasAttached()`. Run it, count the tags, and note how many you got.",
      "Now add `recycle()` for the tags and run it again. Compare the two tag counts and write down what changed.",
      "Do the same for customers on the invoice factory, so invoices belong to the customers you created rather than inventing new ones.",
      "Create a `TagSeeder` for a fixed set of tags using `updateOrCreate()`, and confirm running it twice leaves the same number of rows.",
      "Split `DatabaseSeeder` into `TagSeeder`, `CustomerSeeder` and `InvoiceSeeder`, called in dependency order. Add a known login with a fixed email.",
      "Guard the sample data behind `app()->isProduction()` and explain in a comment which parts must still run in production.",
      "Run `php artisan migrate:fresh --seed` and verify from tinker: total counts, then `withCount()` on a customer and an invoice to check the distribution.",
      "Deliberately break the shape: seed one invoice per customer, load the customer list, and note which screens now tell you nothing.",
      "Write one test that creates exactly what it needs, such as an overdue invoice for one customer, and confirm it passes without any seeded data.",
    ],
    acceptance: [
      "`php artisan migrate:fresh --seed` produces a working InvoiceHub with no manual steps.",
      "The counts match the numbers you wrote down at the start, and you checked rather than assumed.",
      "`withCount()` shows invoices spread across customers, not concentrated on one.",
      "Every invoice status appears on the list page, every time you reseed.",
      "Tags are shared across invoices rather than one set per invoice, and the count proves it.",
      "Running `TagSeeder` twice leaves the tag count unchanged.",
      "There is one known email you can always log in with.",
      "Invoice totals equal the sum of their lines for every seeded invoice.",
      "At least one test creates its own data and passes with an empty database.",
      "No factory sends mail, calls an API or runs a business process.",
    ],
    stretch: [
      "Seed a second set of customers with a `ne_NP` or `ja_JP` Faker locale and see which screens break on longer names or different address formats.",
      "Add a `withOverdueInvoices()` state on `CustomerFactory` that composes the invoice factory, and use it to build a dashboard scenario in one line.",
      "Time `migrate:fresh --seed`, then rewrite the largest seeder using `make()` plus batched `insert()` and time it again. Write down what you gave up.",
    ],
  },
};
