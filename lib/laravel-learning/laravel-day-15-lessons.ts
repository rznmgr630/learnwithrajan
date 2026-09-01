import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_15_LESSONS: LessonDay = {
  day: 15,
  title: "Eloquent relationships, eager loading & the N+1 problem",
  totalMinutes: 93,
  difficulty: "Beginner",
  lessons: [
    {
      id: "one-to-one-and-one-to-many",
      title: "hasOne, hasMany & belongsTo",
      durationMinutes: 12,
      explanation: "Day 12 gave your tables foreign keys. Yesterday gave you models. Today the two meet, and you stop writing joins by hand:\n\n```php\n$user->posts\n$post->author\n$post->comments\n```\n\nThe important thing is not memorising method names. It is being able to look at two tables and know which method goes where, and the rule that decides it is simple: <b>whichever table holds the foreign key uses `belongsTo`.</b>\n\n---\n\n### 1. Basic — one-to-one\n\nA user has one profile:\n\n```text\nUser\n └── Profile\n```\n\nThe parent declares what it has:\n\n```php\nclass User extends Model\n{\n    public function profile()\n    {\n        return $this->hasOne(Profile::class);\n    }\n}\n```\n\nThe child declares where it belongs:\n\n```php\nclass Profile extends Model\n{\n    public function user()\n    {\n        return $this->belongsTo(User::class);\n    }\n}\n```\n\n```php\n$user->profile;\n$profile->user;\n```\n\nEloquent works out the foreign key from the method's model name plus `_id`, so `hasOne(Profile::class)` looks for `profiles.user_id`.\n\n```text\nUser\n  │ hasOne        \"I have one of these\"\n  ▼\nProfile\n  │ belongsTo     \"I belong to this\"\n  ▼\nUser\n```\n\n---\n\n### 2. Intermediate — one-to-many\n\nOne user, many posts. The only change is the method name:\n\n```php\nclass User extends Model\n{\n    public function posts()\n    {\n        return $this->hasMany(Post::class);\n    }\n}\n\nclass Post extends Model\n{\n    public function user()\n    {\n        return $this->belongsTo(User::class);\n    }\n}\n```\n\n`$user->posts` gives a collection; `$post->user` gives one model.\n\nAnd the tables have not changed at all:\n\n```text\nusers            posts\n─────            ─────\nid               id\nname             user_id      ← the foreign key\n                 title\n```\n\n```text\nusers.id\n   ↑\nposts.user_id\n```\n\n<b>The foreign key always lives on the \"many\" side</b>, because a row can hold one value, not a list. That single fact tells you which model gets `belongsTo`, every time, without thinking about it.\n\nSo `hasOne` and `hasMany` differ only in how many rows come back. Both live on the table without the foreign key.\n\n---\n\n### 3. Advanced — naming, and the two forms\n\nWhen the column does not follow the convention, pass the keys yourself:\n\n```php\nreturn $this->hasMany(Post::class, 'author_id');\nreturn $this->belongsTo(User::class, 'author_id');\n```\n\nThe full signatures differ between the two, which is the detail people get wrong:\n\n```text\nhasMany(Post::class, 'foreign key on posts', 'local key on users')\nbelongsTo(User::class, 'foreign key on posts', 'owner key on users')\n```\n\nBoth take the foreign key second, but the first is the column on the <i>other</i> table and the second is the column on <i>this</i> one.\n\nName the method after what it returns, not after the model:\n\n```php\npublic function author()   { return $this->belongsTo(User::class, 'author_id'); }\npublic function comments() { return $this->hasMany(Comment::class); }\n```\n\n`$post->author` reads better than `$post->user`, and Eloquent does not care as long as you give it the key.\n\nOne distinction to hold on to, because everything later depends on it:\n\n```text\n$user->posts     the property   → runs the query, returns models\n$user->posts()   the method     → returns a query builder\n```\n\nThe property is what you read. <b>The method is what you keep building on:</b>\n\n```php\n$user->posts()->where('published', true)->count();\n```\n\nAnd `hasOne` has a useful cousin. `latestOfMany()` turns \"many\" into \"the newest one\":\n\n```php\npublic function latestOrder()\n{\n    return $this->hasOne(Order::class)->latestOfMany();\n}\n```",
      diagram: `The rule that decides everything

  Whichever table holds the foreign key uses belongsTo.

  users            posts
  ─────            ─────
  id      ←────    user_id      the foreign key
  name             title

  A row holds one value, not a list, so the key
  always sits on the "many" side.

  User::hasMany(Post::class)     no foreign key here
  Post::belongsTo(User::class)   the key is here


One-to-one, one-to-many: the same shape

  User                       User
    │ hasOne                   │ hasMany
    ▼                          ▼
  Profile                   Post  Post  Post
    │ belongsTo                │ belongsTo
    ▼                          ▼
  User                       User

  hasOne   → one model, or null
  hasMany  → a collection

  Both live on the table WITHOUT the foreign key.


Custom keys: the signatures differ

  hasMany(Post::class, 'author_id', 'id')
                        ↑            ↑
                  column on posts   column on users

  belongsTo(User::class, 'author_id', 'id')
                          ↑            ↑
                   column on posts   column on users

  Both take the foreign key second, but hasMany means
  "on the other table" and belongsTo means "on mine".


Property or method?

  \$user->posts      runs the query, gives you models
  \$user->posts()    gives you a query builder

  \$user->posts()->where('published', true)->count();

  The property is what you read.
  The method is what you keep building on.`,
      codeExample: {
        title: "Both directions of both relationships",
        code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

// ---------- One-to-one ----------

class User extends Model
{
    // Looks for profiles.user_id
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    // ---------- One-to-many ----------

    // Looks for posts.user_id
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // "Many", narrowed to one.
    public function latestPost()
    {
        return $this->hasOne(Post::class)->latestOfMany();
    }
}


class Profile extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}


class Post extends Model
{
    // The foreign key lives here, so this side is belongsTo.
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Named after what it returns, with the key spelled out.
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}


<?php
// ---------- Reading them ----------

$user = User::findOrFail(1);

$user->profile;          // one Profile, or null
$user->posts;            // a Collection of Post models

foreach ($user->posts as $post) {
    echo $post->title;
}

$post = Post::findOrFail(1);

$post->user;             // one User
$post->author->name;


// ---------- Property vs method ----------

$user->posts;            // runs the query now, returns models

$user->posts()           // a query builder: keep going
    ->where('published', true)
    ->orderByDesc('created_at')
    ->take(5)
    ->get();

$user->posts()->count();           // one COUNT query
$user->posts->count();             // loads every post, then counts


// ---------- Custom keys ----------

// hasMany: the second argument is the column on the OTHER table.
$this->hasMany(Post::class, 'author_id', 'id');

// belongsTo: the second argument is the column on THIS table.
$this->belongsTo(User::class, 'author_id', 'id');`,
      },
      keyTakeaways: [
        "<b>Whichever table holds the foreign key uses `belongsTo`</b>, and that single rule decides every relationship.",
        "<b>The foreign key always lives on the \"many\" side</b>, because a row can hold one value, not a list.",
        "`hasOne` and `hasMany` both sit on the table without the foreign key, and differ only in how many rows come back.",
        "Eloquent infers the foreign key from the related model's name plus `_id`, so `hasMany(Post::class)` finds `posts.user_id`.",
        "<b>Name relationship methods after what they return</b>, such as `author()` rather than `user()`.",
        "`hasMany()` takes the foreign key on the other table; `belongsTo()` takes the foreign key on this one.",
        "<b>`$user->posts` runs the query and returns models; `$user->posts()` returns a query builder you can keep building on.</b>",
        "`$user->posts()->count()` runs one COUNT, while `$user->posts->count()` loads every row first.",
      ],
      commonMistakes: [
        "<b>Putting `hasMany` on the table that holds the foreign key.</b> That side is always `belongsTo`.",
        "<b>Swapping the key arguments between `hasMany` and `belongsTo`.</b> One means the other table's column, one means yours.",
        "<b>Calling `$user->posts->count()` to get a number.</b> Every post is loaded into memory first.",
        "<b>Adding `()` when you wanted the models.</b> `$user->posts()` is a builder, not a collection.",
        "<b>Naming a relationship in the plural for a `belongsTo`.</b> It returns one model, so name it in the singular.",
      ],
      quiz: [
        {
          question: "Which model gets `belongsTo`?",
          options: [
            "The one with more rows",
            "The one whose table holds the foreign key",
            "Always the parent",
            "Whichever you define first",
          ],
          correctIndex: 1,
          explanation: "A row holds one value, so the key sits on the many side.",
        },
        {
          question: "What foreign key does `hasMany(Post::class)` look for by default?",
          options: ["`posts.id`", "`posts.user_id`", "`users.post_id`", "`posts.owner_id`"],
          correctIndex: 1,
          explanation: "The declaring model's name plus `_id`, on the related table.",
        },
        {
          question: "What is the difference between `$user->posts` and `$user->posts()`?",
          options: [
            "None",
            "The property runs the query and returns models; the method returns a query builder",
            "The method is faster",
            "The property returns ids only",
          ],
          correctIndex: 1,
          explanation: "The method is what you chain further conditions onto.",
        },
        {
          question: "Which counts a user's published posts most efficiently?",
          options: [
            "`$user->posts->where('published', true)->count()`",
            "`$user->posts()->where('published', true)->count()`",
            "`count($user->posts)`",
            "`$user->posts->count()`",
          ],
          correctIndex: 1,
          explanation: "The method builds a COUNT query; the property loads every post first.",
        },
      ],
    },
    {
      id: "writing-through-relationships",
      title: "Creating, attaching & touching through relationships",
      durationMinutes: 11,
      explanation: "Relationships are not only for reading. Writing through one means you never set a foreign key by hand, and never set the wrong one.\n\n---\n\n### 1. Basic — creating a child\n\n```php\n$user->posts()->create([\n    'title' => 'My first post',\n]);\n```\n\nEloquent fills in `user_id` for you:\n\n```text\n$user->posts()->create([...])\n          ↓\n  user_id = $user->id, automatically\n          ↓\n        INSERT\n```\n\nCompare that with the manual version:\n\n```php\n$post = new Post(['title' => 'My first post']);\n$post->user_id = $user->id;      // easy to forget, easy to get wrong\n$post->save();\n```\n\nNote the `()`. You are calling the relationship method to get the builder, then creating through it. `$user->posts->create(...)` would be calling `create` on a collection, which is not a thing.\n\nThe variants:\n\n```php\n$user->posts()->create([...]);        // one\n$user->posts()->createMany([...]);    // several\n$user->posts()->save($post);          // an existing unsaved model\n$user->posts()->saveMany([$a, $b]);\n```\n\n`create()` goes through `$fillable`, exactly as yesterday. `save()` takes a model you built yourself.\n\n---\n\n### 2. Intermediate — the other direction\n\nSometimes you have the child and want to point it at a parent. That is `associate()`:\n\n```php\n$post->user()->associate($user);\n$post->save();\n```\n\n```text\nassociate()\n     ↓\nposts.user_id = $user->id\n     ↓\n  save()\n```\n\nAnd to break the link:\n\n```php\n$post->user()->dissociate();\n$post->save();      // user_id = NULL\n```\n\nThat needs a nullable column, or the database will refuse it.\n\n<b>`associate()` does not save.</b> It sets the key on the model in memory, which is what lets you set several things and save once. Forgetting the `save()` is the classic bug here, and it fails silently: no error, no change.\n\n```text\nhasMany side     $user->posts()->create([...])   creates and saves\nbelongsTo side   $post->user()->associate($u)    sets the key, you save\n```\n\n---\n\n### 3. Advanced — keeping the parent fresh\n\nHere is a problem you meet on any page that caches or sorts by `updated_at`. Somebody edits a comment. The post it belongs to has not changed, so `posts.updated_at` stays where it was, and anything keyed on that timestamp now shows stale content.\n\n<b>`$touches`</b> fixes it:\n\n```php\nclass Comment extends Model\n{\n    protected $touches = ['post'];\n\n    public function post()\n    {\n        return $this->belongsTo(Post::class);\n    }\n}\n```\n\n```text\ncomment saved\n      ↓\nposts.updated_at = now()\n```\n\nThe array holds relationship names, and it works on save and delete.\n\nUse it deliberately. Every touched parent is an extra `UPDATE` on every child save, and touching a parent that itself touches a grandparent multiplies quietly. It earns its place for cache keys and \"last activity\" ordering, and not much else.\n\nOne more piece of consistency worth knowing, since you met transactions on Day 12: creating a parent and its children is several statements. If the children matter, wrap them:\n\n```php\nDB::transaction(function () use ($data) {\n    $invoice = Invoice::create($data['invoice']);\n\n    $invoice->lines()->createMany($data['lines']);\n});\n```\n\nAn invoice with no lines is worse than no invoice at all.",
      diagram: `Creating through the relationship

  \$user->posts()->create(['title' => '...'])
            ↓
    user_id = \$user->id, filled in for you
            ↓
          INSERT

  vs. the manual version:

  \$post = new Post([...]);
  \$post->user_id = \$user->id;    ← easy to forget, easy to get wrong
  \$post->save();

  Note the ()  — you need the builder, not the collection.

  create()      one, through \$fillable
  createMany()  several
  save()        an existing unsaved model
  saveMany()    several of those


The other direction

  hasMany side     \$user->posts()->create([...])
                   creates AND saves

  belongsTo side   \$post->user()->associate(\$user)
                   sets posts.user_id in memory
                   \$post->save();          ← you must do this

  \$post->user()->dissociate()   user_id = NULL (needs nullable)

  associate() without save() fails SILENTLY.
  No error, no change.


\$touches: keeping the parent fresh

  Somebody edits a comment.
  posts.updated_at does not move.
  Anything cached or sorted by it is now stale.

  class Comment extends Model
  {
      protected \$touches = ['post'];
  }

  comment saved  →  posts.updated_at = now()

  Costs an extra UPDATE on every child save, and a parent
  that touches ITS parent multiplies. Use it for cache keys
  and "last activity" ordering, not by default.


  Parent plus children is several statements:

  DB::transaction(fn () => ...)

  An invoice with no lines is worse than no invoice.`,
      codeExample: {
        title: "Writing through both sides of a relationship",
        code: `<?php

use App\\Models\\Post;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

// ---------- Creating a child ----------

$user = User::findOrFail(1);

// user_id is set for you.
$post = $user->posts()->create([
    'title' => 'My first post',
    'body'  => '...',
]);

// Several at once.
$user->posts()->createMany([
    ['title' => 'First'],
    ['title' => 'Second'],
]);

// A model you built yourself.
$post = new Post(['title' => 'Third']);
$user->posts()->save($post);

// ❌ create() on the collection, not the builder.
$user->posts->create([...]);


// ---------- Pointing a child at a parent ----------

$post = Post::findOrFail(1);

$post->user()->associate($user);
$post->save();                    // associate() alone saves nothing

$post->user()->dissociate();
$post->save();                    // user_id = NULL, needs nullable


<?php
// ---------- Touching the parent ----------

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Comment extends Model
{
    // Saving or deleting a comment updates posts.updated_at.
    protected $touches = ['post'];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}

// Now a cache key built from $post->updated_at invalidates
// when a comment changes, which is the point.


<?php
// ---------- Parent and children together ----------

DB::transaction(function () use ($data, $user) {
    $invoice = $user->invoices()->create([
        'number' => $data['number'],
        'total'  => $data['total'],
    ]);

    $invoice->lines()->createMany($data['lines']);
});

// If a line fails, the invoice goes with it.
// An invoice with no lines is worse than no invoice.`,
      },
      keyTakeaways: [
        "<b>`$user->posts()->create([...])` sets the foreign key for you</b> and saves the row.",
        "Note the `()`: you need the relationship's query builder, not the loaded collection.",
        "`createMany()`, `save()` and `saveMany()` cover several children and models you built yourself.",
        "<b>`associate()` points a `belongsTo` child at a parent</b> by setting the key on the model in memory.",
        "<b>`associate()` does not save</b>, so a forgotten `save()` changes nothing and reports nothing.",
        "`dissociate()` clears the foreign key, which requires the column to be nullable.",
        "<b>`$touches` updates a parent's `updated_at` when a child is saved or deleted</b>, which keeps cache keys honest.",
        "Every touched parent costs an extra `UPDATE` per child save, so use it deliberately.",
        "<b>Creating a parent and its children is several statements</b>, so wrap them in a transaction when both matter.",
      ],
      commonMistakes: [
        "<b>Calling `associate()` and forgetting `save()`.</b> Nothing is written and nothing complains.",
        "<b>Writing `$user->posts->create(...)` without the parentheses.</b> That is the collection, not the builder.",
        "<b>Setting the foreign key by hand when a relationship exists.</b> It is the easiest place to write the wrong id.",
        "<b>Adding `$touches` everywhere.</b> Each one is an extra write on every child save.",
        "<b>Creating an invoice and its lines outside a transaction.</b> A failure halfway leaves a half-built record.",
      ],
      quiz: [
        {
          question: "What does `$user->posts()->create(['title' => 'Hi'])` do that `Post::create(['title' => 'Hi'])` does not?",
          options: [
            "Validates the title",
            "Sets `user_id` to the user's id automatically",
            "Skips `$fillable`",
            "Runs inside a transaction",
          ],
          correctIndex: 1,
          explanation: "Which is why you never write the foreign key by hand.",
        },
        {
          question: "What is missing from `$post->user()->associate($user);`?",
          options: [
            "Nothing, it saves",
            "`$post->save()`",
            "`$user->save()`",
            "A transaction",
          ],
          correctIndex: 1,
          explanation: "`associate()` sets the key in memory only, and failing to save is silent.",
        },
        {
          question: "What does `protected $touches = ['post'];` on a Comment do?",
          options: [
            "Loads the post with every comment",
            "Updates the post's `updated_at` when the comment is saved or deleted",
            "Deletes the post when the comment is deleted",
            "Validates that a post exists",
          ],
          correctIndex: 1,
          explanation: "Useful for cache keys and last-activity ordering.",
        },
        {
          question: "Why wrap creating an invoice and its lines in a transaction?",
          options: [
            "It is faster",
            "They are separate statements, so a failure halfway leaves an invoice with no lines",
            "Eloquent requires it",
            "To fire the model events",
          ],
          correctIndex: 1,
          explanation: "All of it, or none of it, exactly as on Day 12.",
        },
      ],
    },
    {
      id: "many-to-many-and-pivots",
      title: "Many-to-many & pivot tables",
      durationMinutes: 12,
      explanation: "A user has many roles. A role has many users. Neither table can hold the foreign key, because neither side has just one.\n\n---\n\n### 1. Basic — the pivot table\n\nThe answer is a third table that holds nothing but the pairs:\n\n```text\nusers            roles            role_user\n─────            ─────            ─────────\nid               id               user_id\nname             name             role_id\n```\n\n<b>A <i>pivot table</i></b> (a table whose rows connect two other tables) is what makes many-to-many possible. Every pairing is one row.\n\nBoth models declare the same relationship:\n\n```php\nclass User extends Model\n{\n    public function roles()\n    {\n        return $this->belongsToMany(Role::class);\n    }\n}\n\nclass Role extends Model\n{\n    public function users()\n    {\n        return $this->belongsToMany(User::class);\n    }\n}\n```\n\n```php\n$user->roles;\n$role->users;\n```\n\n<b>`belongsToMany` on both sides.</b> There is no `hasMany` here, because neither table owns the other.\n\nThe conventions for the pivot table catch everyone once:\n\n```text\nname       the two model names, singular, snake_case, alphabetical\n           role_user   ✓        user_role   ✗\n           post_tag    ✓        tag_post    ✗\ncolumns    user_id, role_id\n```\n\nAlphabetical, and singular. When your table is named otherwise, say so:\n\n```php\nreturn $this->belongsToMany(Role::class, 'user_roles');\n```\n\n---\n\n### 2. Intermediate — data on the relationship itself\n\nSometimes the pairing carries information. A user enrolls in a course, and the enrolment has a date and a status:\n\n```text\ncourse_user\n───────────\nuser_id\ncourse_id\nstatus\nenrolled_at\n```\n\nThose columns describe neither the user nor the course. They describe the <i>relationship</i>, which is exactly what a pivot table is for.\n\nBy default Eloquent only fetches the two keys, so ask for the rest:\n\n```php\nreturn $this->belongsToMany(Course::class)\n    ->withPivot('status', 'enrolled_at');\n```\n\nThen every related model carries a `pivot` object:\n\n```php\n$user->courses->first()->pivot->status;\n```\n\nIf the pivot table has `created_at` and `updated_at`:\n\n```php\n->withTimestamps();\n```\n\nand Eloquent maintains them. Without it, those columns simply never get filled.\n\nA useful signal: <b>the moment your pivot table has a column that is not a foreign key, ask whether the relationship is really an entity.</b> An enrolment has a date, a status, a certificate and a price. That is a thing, not a link.\n\n---\n\n### 3. Advanced — when the pivot becomes a model\n\nWhen it is a thing, give it a class:\n\n```php\nuse Illuminate\\Database\\Eloquent\\Relations\\Pivot;\n\nclass Enrollment extends Pivot\n{\n    protected $table = 'course_user';\n\n    public function isActive(): bool\n    {\n        return $this->status === 'active';\n    }\n}\n```\n\nand tell the relationship to use it:\n\n```php\nreturn $this->belongsToMany(Course::class)\n    ->using(Enrollment::class)\n    ->withPivot('status', 'enrolled_at');\n```\n\n```text\nBefore                    After\n\nUser ── course_user ── Course     User ── Enrollment ── Course\n         a table                          a model\n```\n\nNow `$course->pivot` is an `Enrollment`, with methods, casts and events of its own.\n\nOne more thing worth knowing before you build a schema on this. A pivot model still has no primary key of its own by default, and cannot be a parent in another relationship. If your enrolment needs its own children, such as payments or progress records, make it an ordinary model with `id`, `hasMany` on both sides, and skip `belongsToMany` entirely:\n\n```text\nUser ──hasMany──> Enrollment <──hasMany── Course\n```\n\n<b>That is the same data with the link promoted to a first-class model</b>, and it is where most real applications end up once the relationship grows.",
      diagram: `Neither side can hold the key

  A user has many roles. A role has many users.
  A row holds one value, so neither table can store the link.

  users            roles            role_user
  ─────            ─────            ─────────
  id               id               user_id
  name             name             role_id

  belongsToMany on BOTH sides. There is no hasMany here.


Pivot table conventions

  name      the two model names, singular, snake_case, ALPHABETICAL

              role_user  ✓        user_role  ✗
              post_tag   ✓        tag_post   ✗

  columns   user_id, role_id

  Otherwise: belongsToMany(Role::class, 'user_roles')


Data that belongs to the relationship

  course_user
  ───────────
  user_id
  course_id
  status         describes neither the user nor the course
  enrolled_at    it describes the RELATIONSHIP

  ->withPivot('status', 'enrolled_at')   fetch them
  ->withTimestamps()                     maintain created_at/updated_at

  \$user->courses->first()->pivot->status

  Without withPivot, only the two keys come back.
  Without withTimestamps, those columns never get filled.


When the link becomes a thing

  Before                        After

  User ── course_user ── Course     User ── Enrollment ── Course
           a table                          a Pivot model

  ->using(Enrollment::class)     methods, casts, events

  And if the enrolment needs children of its own
  (payments, progress), promote it fully:

  User ──hasMany──> Enrollment <──hasMany── Course

  Same data, the link is now a first-class model.
  Most real applications end up here.`,
      codeExample: {
        title: "Many-to-many, with and without data on the link",
        code: `<?php
// ---------- The migration ----------

Schema::create('role_user', function (Blueprint $table) {
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('role_id')->constrained()->cascadeOnDelete();

    // One pairing, once.
    $table->primary(['user_id', 'role_id']);
});


<?php
// ---------- Both sides declare belongsToMany ----------

namespace App\\Models;

class User extends Model
{
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}

class Role extends Model
{
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}

// Non-conventional table or columns:
// belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id')


<?php
// ---------- Data on the relationship ----------

class User extends Model
{
    public function courses()
    {
        return $this->belongsToMany(Course::class)
            ->withPivot('status', 'enrolled_at')   // fetch these
            ->withTimestamps();                    // maintain these
    }
}

$course = $user->courses->first();

$course->name;                  // from courses
$course->pivot->status;         // from course_user
$course->pivot->enrolled_at;

// Filter on a pivot column.
$user->courses()->wherePivot('status', 'active')->get();


<?php
// ---------- Promoting the pivot to a model ----------

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Relations\\Pivot;

class Enrollment extends Pivot
{
    protected $table = 'course_user';

    protected function casts(): array
    {
        return ['enrolled_at' => 'datetime'];
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}

class User extends Model
{
    public function courses()
    {
        return $this->belongsToMany(Course::class)
            ->using(Enrollment::class)
            ->withPivot('status', 'enrolled_at');
    }
}

$user->courses->first()->pivot->isActive();


<?php
// ---------- When the link needs children of its own ----------

// Drop belongsToMany and make it an ordinary model with an id.
class Enrollment extends Model
{
    public function user()     { return $this->belongsTo(User::class); }
    public function course()   { return $this->belongsTo(Course::class); }
    public function payments() { return $this->hasMany(Payment::class); }
}

// User ──hasMany──> Enrollment <──hasMany── Course`,
      },
      keyTakeaways: [
        "<b>Many-to-many needs a pivot table</b>, because neither side can hold a single foreign key.",
        "<b>`belongsToMany` goes on both models</b>; there is no `hasMany` in a many-to-many.",
        "The conventional pivot name is the two model names, singular, snake_case and <b>alphabetical</b>, so `role_user`.",
        "Pass the table name as the second argument when it does not follow that convention.",
        "<b>`withPivot()` fetches extra pivot columns</b>, which are otherwise ignored.",
        "<b>`withTimestamps()` maintains the pivot's `created_at` and `updated_at`</b>, which stay empty without it.",
        "Related models then carry a `pivot` object, and `wherePivot()` filters on those columns.",
        "<b>`using()` maps the pivot to a `Pivot` model</b> so it can have methods, casts and events.",
        "<b>When the link needs children of its own, promote it to an ordinary model</b> with `hasMany` on both sides.",
      ],
      commonMistakes: [
        "<b>Naming the pivot table in the wrong order.</b> It is alphabetical, so `role_user`, not `user_role`.",
        "<b>Pluralising the pivot table name.</b> The convention is singular on both halves.",
        "<b>Reading a pivot column without `withPivot()`.</b> Only the two keys are fetched by default.",
        "<b>Expecting pivot timestamps to fill themselves.</b> They need `withTimestamps()`.",
        "<b>Forcing `belongsToMany` on a link that has grown its own children.</b> Make it a proper model instead.",
      ],
      quiz: [
        {
          question: "What relationship method goes on each side of a many-to-many?",
          options: [
            "`hasMany` on one side, `belongsTo` on the other",
            "`belongsToMany` on both",
            "`hasManyThrough` on both",
            "`morphToMany` on both",
          ],
          correctIndex: 1,
          explanation: "Neither table owns the other, so neither uses `hasMany`.",
        },
        {
          question: "What is the conventional pivot table name for User and Role?",
          options: ["user_roles", "role_user", "roles_users", "user_role_pivot"],
          correctIndex: 1,
          explanation: "Both singular, snake_case, in alphabetical order.",
        },
        {
          question: "Your pivot has a `status` column and `$course->pivot->status` is null. What is missing?",
          options: [
            "`withTimestamps()`",
            "`withPivot('status')`",
            "`using()`",
            "A cast",
          ],
          correctIndex: 1,
          explanation: "Only the two keys are fetched unless you ask for more.",
        },
        {
          question: "When should the pivot become an ordinary model rather than a `Pivot`?",
          options: [
            "When it has more than two columns",
            "When it needs relationships of its own, such as payments",
            "When there are many rows",
            "Never",
          ],
          correctIndex: 1,
          explanation: "At that point it is an entity, so give it an id and `hasMany` on both sides.",
        },
      ],
    },
    {
      id: "attach-detach-sync",
      title: "attach, detach, sync & toggle",
      durationMinutes: 11,
      explanation: "`create()` and `save()` do not fit a many-to-many, because there is no child to create. There is only a pairing to add or remove.\n\n---\n\n### 1. Basic — attach and detach\n\n```php\n$user->roles()->attach($roleId);\n$user->roles()->attach([1, 2, 3]);\n```\n\n```text\nattach(2)\n    ↓\nINSERT INTO role_user (user_id, role_id) VALUES (1, 2)\n```\n\nWith pivot data:\n\n```php\n$user->roles()->attach($roleId, ['assigned_by' => $adminId]);\n```\n\nRemoving:\n\n```php\n$user->roles()->detach($roleId);   // one\n$user->roles()->detach([1, 2]);    // several\n$user->roles()->detach();          // all of them\n```\n\n<b>`detach()` with no argument removes every pairing</b>, and it will not ask whether you meant it. It is the `delete()` with no `where()` from Day 13, wearing a different name.\n\nOne thing `attach()` does not do is check for duplicates. Attach the same role twice and you get two rows, unless the pivot table has a composite primary key stopping you. Which is a good reason to add one.\n\n---\n\n### 2. Intermediate — `sync()`\n\nAttach and detach answer \"add this\" and \"remove that\". A form answers something different: <b>these are the roles this user should have now.</b>\n\n```php\n$user->roles()->sync([1, 3, 5]);\n```\n\n```text\nhas now:     1, 2, 3\nshould have: 1, 3, 5\n         ↓\nadd 5\nremove 2\nleave 1 and 3 alone\n```\n\nOne call, and the database matches the array. That is exactly what a checkbox list submits, which is why `sync()` is the method you will reach for most.\n\nIt takes pivot data too, as an array keyed by id:\n\n```php\n$user->roles()->sync([\n    1 => ['assigned_by' => $adminId],\n    3 => ['assigned_by' => $adminId],\n]);\n```\n\nAnd `sync()` returns what it did:\n\n```php\n$changes = $user->roles()->sync([1, 3, 5]);\n// ['attached' => [5], 'detached' => [2], 'updated' => []]\n```\n\nHandy for logging who gained and lost what, which on a permissions screen you usually want.\n\n---\n\n### 3. Advanced — the variants, and what to reach for\n\n<b>`syncWithoutDetaching()`</b> adds what is missing and removes nothing:\n\n```php\n$user->roles()->syncWithoutDetaching([1, 3]);\n```\n\nWhich is `attach()` made safe against duplicates. Use it whenever you are adding from a partial list.\n\n<b>`toggle()`</b> flips each id:\n\n```php\n$post->likes()->toggle($userId);\n```\n\n```text\nalready there?  →  remove it\nnot there?      →  add it\n```\n\nOne method for a like button, a favourite, a subscription. Anything with exactly two states and no separate add and remove endpoints.\n\nAnd `updateExistingPivot()` changes pivot data without touching the pairing:\n\n```php\n$user->courses()->updateExistingPivot($courseId, ['status' => 'completed']);\n```\n\nChoosing between them is really one question, <b>what does the caller know?</b>\n\n```text\nthe complete list           →  sync()\nsomething to add            →  syncWithoutDetaching()\nsomething to remove         →  detach()\na two-state switch          →  toggle()\njust the pivot data         →  updateExistingPivot()\nan add you know is new      →  attach()\n```\n\nA last note on safety. These write immediately, so a form that syncs roles and then fails validation on something else has already changed the roles. Validate first, and put multi-step permission changes in a transaction.",
      diagram: `Adding and removing pairings

  attach(2)        INSERT INTO role_user VALUES (1, 2)
  attach([1,2,3])  three rows
  attach(2, ['assigned_by' => 7])   with pivot data

  detach(2)        remove that pairing
  detach([1,2])    remove those
  detach()         ⚠️  removes EVERY pairing, no confirmation

  attach() does not check for duplicates. A composite
  primary key on the pivot table is what stops them.


sync(): the whole list at once

  has now:      1, 2, 3
  should have:  1, 3, 5
            ↓
  add 5
  remove 2
  leave 1 and 3 alone

  \$user->roles()->sync([1, 3, 5]);

  Exactly what a checkbox list submits, which is
  why this is the one you reach for most.

  returns  ['attached' => [5], 'detached' => [2], 'updated' => []]


Choosing: what does the caller know?

  the complete list       →  sync()
  something to add        →  syncWithoutDetaching()
  something to remove     →  detach()
  a two-state switch      →  toggle()          like, favourite
  just the pivot data     →  updateExistingPivot()
  an add you know is new  →  attach()


  ⚠️  All of these write immediately. A form that syncs
      roles then fails validation has already changed them.
      Validate first. Wrap multi-step changes in a transaction.`,
      codeExample: {
        title: "Managing a many-to-many from a form",
        code: `<?php

use App\\Models\\User;

$user = User::findOrFail(1);

// ---------- Add ----------

$user->roles()->attach($roleId);
$user->roles()->attach([1, 2, 3]);

// With pivot data.
$user->roles()->attach($roleId, [
    'assigned_by' => auth()->id(),
]);


// ---------- Remove ----------

$user->roles()->detach($roleId);
$user->roles()->detach([1, 2]);

// ⚠️ Every pairing, with no confirmation.
$user->roles()->detach();


// ---------- The whole list: what a form submits ----------

$user->roles()->sync($request->input('roles', []));

// With pivot data, keyed by id.
$user->roles()->sync([
    1 => ['assigned_by' => auth()->id()],
    3 => ['assigned_by' => auth()->id()],
]);

// What actually changed.
$changes = $user->roles()->sync([1, 3, 5]);
// ['attached' => [5], 'detached' => [2], 'updated' => []]

logger()->info('Roles changed', [
    'user_id'  => $user->id,
    'attached' => $changes['attached'],
    'detached' => $changes['detached'],
]);


// ---------- Add without removing ----------

$user->roles()->syncWithoutDetaching([1, 3]);

// attach(), made safe against duplicates.


// ---------- Two-state switches ----------

// One method for a like button.
$post->likes()->toggle(auth()->id());

// Already there → removed. Not there → added.


// ---------- Pivot data only ----------

$user->courses()->updateExistingPivot($courseId, [
    'status'       => 'completed',
    'completed_at' => now(),
]);


<?php
// ---------- In a controller, safely ----------

public function updateRoles(Request $request, User $user)
{
    // Validate BEFORE writing: sync() takes effect immediately.
    $data = $request->validate([
        'roles'   => ['array'],
        'roles.*' => ['exists:roles,id'],
    ]);

    DB::transaction(function () use ($user, $data) {
        $changes = $user->roles()->sync($data['roles'] ?? []);

        activity()->log('roles.updated', $changes);
    });

    return back();
}`,
      },
      keyTakeaways: [
        "<b>`attach()` adds a pairing</b> and accepts one id, an array of ids, and pivot data.",
        "<b>`detach()` removes pairings, and with no argument removes every one of them.</b>",
        "`attach()` does not prevent duplicates, so give the pivot table a composite primary key.",
        "<b>`sync()` makes the pairings match an array exactly</b>, adding, removing and leaving the rest alone.",
        "`sync()` is what a checkbox form submits, and it returns what was attached, detached and updated.",
        "<b>`syncWithoutDetaching()` adds what is missing and removes nothing</b>, which is a safe `attach()`.",
        "<b>`toggle()` flips each id</b>, which is a like button, a favourite or a subscription in one call.",
        "`updateExistingPivot()` changes pivot data without touching the pairing itself.",
        "<b>All of these write immediately</b>, so validate before calling them and wrap multi-step changes in a transaction.",
      ],
      commonMistakes: [
        "<b>Calling `detach()` with no argument by accident.</b> Every pairing is gone with no warning.",
        "<b>Using `attach()` where `syncWithoutDetaching()` was meant.</b> Repeat submissions create duplicate rows.",
        "<b>Using `sync()` with a partial list.</b> Everything not in the array is removed.",
        "<b>Syncing before validating.</b> The write has already happened when the validation fails.",
        "<b>Writing separate add and remove endpoints for a like button.</b> `toggle()` is one call.",
      ],
      quiz: [
        {
          question: "A form submits the complete list of roles a user should have. Which method?",
          options: ["`attach()`", "`sync()`", "`syncWithoutDetaching()`", "`toggle()`"],
          correctIndex: 1,
          explanation: "It adds the missing, removes the absent, and leaves the rest.",
        },
        {
          question: "What does `$user->roles()->detach()` with no arguments do?",
          options: [
            "Nothing",
            "Removes every pairing",
            "Throws an error",
            "Removes the first pairing",
          ],
          correctIndex: 1,
          explanation: "The many-to-many version of a `delete()` with no `where()`.",
        },
        {
          question: "You want to add roles without removing existing ones. Which method?",
          options: ["`sync()`", "`syncWithoutDetaching()`", "`detach()`", "`updateExistingPivot()`"],
          correctIndex: 1,
          explanation: "It behaves like `attach()` but cannot create duplicates.",
        },
        {
          question: "Which method suits a like button?",
          options: ["`attach()`", "`sync()`", "`toggle()`", "`updateExistingPivot()`"],
          correctIndex: 2,
          explanation: "It removes the pairing if present and adds it if not.",
        },
      ],
    },
    {
      id: "has-through",
      title: "hasOneThrough & hasManyThrough",
      durationMinutes: 9,
      explanation: "Two models that are related, but only by way of a third.\n\n---\n\n### 1. Basic — the shape\n\nA country has users. A user has posts. So a country has posts, through its users:\n\n```text\nCountry\n   │ hasMany\n   ▼\nUser\n   │ hasMany\n   ▼\nPost\n```\n\nThere is no `country_id` on `posts`. The link exists, but it runs through `users`.\n\n```php\nclass Country extends Model\n{\n    public function posts()\n    {\n        return $this->hasManyThrough(Post::class, User::class);\n    }\n}\n```\n\n```php\n$country->posts;\n```\n\nThe argument order is the one thing to get right: <b>what you want first, what you go through second.</b>\n\n```text\nhasManyThrough(Post::class, User::class)\n                 ↑             ↑\n           the destination   the middle\n```\n\nA single query with a join, not two queries.\n\n`hasOneThrough` is the same idea for a single result:\n\n```text\nMechanic → Car → Owner\n```\n\n```php\nreturn $this->hasOneThrough(Owner::class, Car::class);\n```\n\n---\n\n### 2. Intermediate — the keys it assumes\n\nThe conventions here involve four keys, which is why the errors can be confusing:\n\n```text\nusers.country_id       the middle model's key back to you\nposts.user_id          the destination's key back to the middle\ncountries.id           your local key\nusers.id               the middle model's local key\n```\n\nIn the order the method takes them:\n\n```php\nreturn $this->hasManyThrough(\n    Post::class,       // destination\n    User::class,       // through\n    'country_id',      // on users\n    'user_id',         // on posts\n    'id',              // on countries\n    'id',              // on users\n);\n```\n\nYou rarely write all six. When something is not found, though, it is nearly always one of the middle two, so read them in that order.\n\n---\n\n### 3. Advanced — when to use it, and when not to\n\nThis relationship is narrower than it first appears. It is worth being clear about what it is good at.\n\n<b>It is good at reading down a chain you do not otherwise have a name for.</b> A country's posts, an organisation's invoices through its accounts, a mechanic's owner through the car. One query, no intermediate collection.\n\n<b>It is not good at anything more than that.</b> You cannot create through it, because Eloquent has no way to know what the intermediate row should be. And it only spans two hops; a chain of three needs a different approach.\n\nThe honest alternative for most cases:\n\n```text\nhasManyThrough              a nested whereHas or a join\n     ↓                              ↓\nreads well when the         reads better when the\nchain is a real concept     chain is incidental\n```\n\nIf you find yourself explaining what the relationship means, it probably wants to be a query. If a product person would say the phrase out loud, such as \"posts from this country\", it earns its place as a relationship.\n\nOne performance note carried from Day 12: a `hasManyThrough` joins on the middle table's foreign key, so <b>index it.</b> An unindexed `users.country_id` turns this into a scan of the whole users table for every country you load.",
      diagram: `Related, but only by way of a third

  Country
     │ hasMany
     ▼
  User
     │ hasMany
     ▼
  Post

  There is no country_id on posts.
  The link runs through users.

  hasManyThrough(Post::class, User::class)
                   ↑             ↑
             the destination   the middle

  What you WANT first. What you go THROUGH second.

  One query with a join, not two queries.


hasOneThrough is the same, singular

  Mechanic → Car → Owner

  hasOneThrough(Owner::class, Car::class)


The four keys it assumes

  users.country_id    the middle model's key back to you
  posts.user_id       the destination's key back to the middle
  countries.id        your local key
  users.id            the middle model's local key

  hasManyThrough(Post::class, User::class,
                 'country_id',   ← on users
                 'user_id',      ← on posts
                 'id', 'id')

  When nothing is found, it is nearly always
  one of the middle two. Read them in that order.


What it is, and is not, for

  ✓  reading down a chain that has a real name
     "posts from this country", "invoices for this organisation"

  ✗  creating through it — Eloquent cannot know
     what the intermediate row should be
  ✗  chains of three or more hops

  If you have to explain what the relationship means,
  it probably wants to be a whereHas or a join instead.

  And index the middle foreign key. Without it this
  scans the whole middle table for every parent.`,
      codeExample: {
        title: "Reading across an intermediate model",
        code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

// countries ──hasMany──> users ──hasMany──> posts
//
// posts has no country_id. The link runs through users.

class Country extends Model
{
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Destination first, intermediate second.
    public function posts()
    {
        return $this->hasManyThrough(Post::class, User::class);
    }
}

$country = Country::findOrFail(1);

$country->posts;                          // one query, with a join
$country->posts()->where('published', true)->count();


<?php
// ---------- Singular ----------

// mechanics ──hasMany──> cars ──hasOne──> owners

class Mechanic extends Model
{
    public function carOwner()
    {
        return $this->hasOneThrough(Owner::class, Car::class);
    }
}

$mechanic->carOwner;


<?php
// ---------- Spelling out the keys ----------

class Country extends Model
{
    public function posts()
    {
        return $this->hasManyThrough(
            Post::class,     // what you want
            User::class,     // what you go through
            'country_id',    // foreign key on users
            'user_id',       // foreign key on posts
            'id',            // local key on countries
            'id',            // local key on users
        );
    }
}

// When nothing comes back, check the middle two first.


<?php
// ---------- The alternative, for an incidental chain ----------

// A relationship you would have to explain is usually a query.
$posts = Post::whereHas('user', function ($query) use ($country) {
    $query->where('country_id', $country->id);
})->get();

// And index the middle key, or every parent scans the users table:
// $table->foreignId('country_id')->constrained();   // indexed`,
      },
      keyTakeaways: [
        "<b>`hasManyThrough` reaches a model across an intermediate one</b>, where no direct foreign key exists.",
        "<b>The destination comes first and the intermediate second</b>: `hasManyThrough(Post::class, User::class)`.",
        "`hasOneThrough` is the same relationship when only a single result is expected.",
        "It runs one query with a join, rather than loading the intermediate collection.",
        "<b>It assumes four keys</b>, and a relationship that returns nothing is nearly always wrong on the middle two.",
        "<b>You cannot create through it</b>, because Eloquent cannot know what the intermediate row should be.",
        "It spans exactly two hops, so longer chains need a query rather than a relationship.",
        "<b>Use it when the chain has a real name</b> such as \"posts from this country\", and a `whereHas` or join otherwise.",
        "<b>Index the intermediate foreign key</b>, or each parent scans the whole middle table.",
      ],
      commonMistakes: [
        "<b>Passing the intermediate model first.</b> The destination comes first, the middle second.",
        "<b>Trying to `create()` through it.</b> There is no way to say what the intermediate row should be.",
        "<b>Reaching for it on a three-hop chain.</b> It only spans two.",
        "<b>Guessing at the key arguments.</b> The middle two are the ones that go wrong; check those first.",
        "<b>Leaving the intermediate foreign key unindexed.</b> Every parent then scans the middle table.",
      ],
      quiz: [
        {
          question: "In `hasManyThrough(A::class, B::class)`, which is which?",
          options: [
            "A is the intermediate, B is the destination",
            "A is the destination, B is the intermediate",
            "Both are destinations",
            "The order does not matter",
          ],
          correctIndex: 1,
          explanation: "What you want first, what you go through second.",
        },
        {
          question: "Why does a country need `hasManyThrough` to reach its posts?",
          options: [
            "Posts are too numerous for `hasMany`",
            "There is no `country_id` on posts; the link runs through users",
            "`hasMany` cannot cross tables",
            "Posts are polymorphic",
          ],
          correctIndex: 1,
          explanation: "The relationship exists, but only by way of the intermediate model.",
        },
        {
          question: "What can you not do with `hasManyThrough`?",
          options: [
            "Filter it",
            "Count it",
            "Create through it",
            "Eager load it",
          ],
          correctIndex: 2,
          explanation: "Eloquent cannot know what the intermediate row should be.",
        },
        {
          question: "A `hasManyThrough` returns nothing. Where do you look first?",
          options: [
            "The local keys",
            "The two middle key arguments, on the intermediate and destination tables",
            "The model's `$table`",
            "The `$fillable` list",
          ],
          correctIndex: 1,
          explanation: "Those are the ones that are usually wrong.",
        },
      ],
    },
    {
      id: "polymorphic-relationships",
      title: "Polymorphic relationships & morph maps",
      durationMinutes: 13,
      explanation: "The most useful advanced relationship, and the one with the sharpest trade-off.\n\n---\n\n### 1. Basic — one child, several kinds of parent\n\nComments belong to posts. Then somebody adds videos, and photos:\n\n```text\nPost ──────┐\n           │\nVideo ─────┼──> Comment\n           │\nPhoto ─────┘\n```\n\nThe obvious approach gives you three near-identical tables:\n\n```text\npost_comments\nvideo_comments\nphoto_comments\n```\n\nand three models, and every feature written three times.\n\n<b>A <i>polymorphic relationship</i></b> (one where a model can belong to more than one type of parent) uses one table and two columns:\n\n```text\ncomments\n────────\nid\ncommentable_id      which row\ncommentable_type    which model\nbody\n```\n\n```text\nid: 1\ncommentable_id: 10\ncommentable_type: App\\Models\\Post\nbody: \"Great post!\"\n```\n\nThe pair of columns is the whole idea: an id, plus what kind of thing that id refers to.\n\n---\n\n### 2. Intermediate — the three shapes\n\n<b>One-to-many.</b> The child says `morphTo`, every parent says `morphMany`:\n\n```php\nclass Comment extends Model\n{\n    public function commentable()\n    {\n        return $this->morphTo();\n    }\n}\n\nclass Post extends Model\n{\n    public function comments()\n    {\n        return $this->morphMany(Comment::class, 'commentable');\n    }\n}\n```\n\nThe string `'commentable'` is the prefix of those two columns, and the relationship method on the child has the same name. Get it consistent and everything else follows.\n\n```php\n$post->comments;\n$video->comments;\n$comment->commentable;   // a Post, or a Video\n```\n\n<b>One-to-one</b> is the same with `morphOne`, for something like an image that belongs to either a user or a post.\n\n<b>Many-to-many</b> adds a polymorphic pivot. A tag on posts, videos and products:\n\n```text\ntaggables\n─────────\ntag_id\ntaggable_id\ntaggable_type\n```\n\n```php\n// on Post, Video, Product\npublic function tags()\n{\n    return $this->morphToMany(Tag::class, 'taggable');\n}\n\n// on Tag\npublic function posts()\n{\n    return $this->morphedByMany(Post::class, 'taggable');\n}\n```\n\n`morphToMany` on the models being tagged, `morphedByMany` on the tag. One pivot table for every taggable thing you ever add.\n\n---\n\n### 3. Advanced — the price, and morph maps\n\nBy default the type column stores the fully qualified class name:\n\n```text\nApp\\Models\\Post\n```\n\nWhich means <b>your database now depends on your PHP namespace.</b> Move `Post` into `App\\Models\\Content\\Post` and every existing row points at a class that no longer exists.\n\nA <b>morph map</b> fixes it:\n\n```php\nRelation::enforceMorphMap([\n    'post'  => Post::class,\n    'video' => Video::class,\n]);\n```\n\nregistered in a service provider. The column then stores `post`, the rows survive any refactor, and the values are readable when you look at the table.\n\n<b>Set this up before you have data.</b> Adding it later means migrating every existing row.\n\nThe other cost is structural: <b>a polymorphic column cannot have a foreign key.</b> The database cannot constrain a column that points at three different tables, so there is no `cascadeOnDelete`, no protection against an orphaned row, and nothing stopping a `commentable_id` that refers to nothing. Delete a post and its comments stay unless your application removes them.\n\nSo the judgement:\n\n```text\nUse it when                        Prefer separate tables when\n──────────                         ──────────────────────────\nthe child is genuinely the same    each parent needs different columns\nthing for every parent             on the child\n\nthe list of parents will grow      there are exactly two, and always\n                                   will be\n\nyou would otherwise write the      you want real foreign keys and\nsame table three times             cascading deletes\n```\n\nComments, tags, images, activity logs and attachments are the classic wins. A relationship with two parents that will never grow is usually cleaner as two ordinary foreign keys.",
      diagram: `One child, several kinds of parent

  Post ──────┐
             │
  Video ─────┼──> Comment
             │
  Photo ─────┘

  Without it:  post_comments, video_comments, photo_comments
               three tables, three models, every feature 3×

  With it, one table and two columns:

  comments
  ────────
  id
  commentable_id      which row
  commentable_type    which model
  body

  id: 1  commentable_id: 10  commentable_type: App\\Models\\Post


The three shapes

  one-to-many    child: morphTo()
                 parents: morphMany(Comment::class, 'commentable')

  one-to-one     parents: morphOne(Image::class, 'imageable')

  many-to-many   taggables: tag_id, taggable_id, taggable_type
                 tagged models: morphToMany(Tag::class, 'taggable')
                 the tag:       morphedByMany(Post::class, 'taggable')

  The string is the column prefix AND the child's
  method name. Keep them consistent.


The price, part 1: your namespace is in the database

  commentable_type = App\\Models\\Post

  Move the class, and every row points at nothing.

  Relation::enforceMorphMap([
      'post'  => Post::class,
      'video' => Video::class,
  ]);

  Now it stores 'post'. Readable, and refactor-proof.

  ⚠️  Set this up BEFORE you have data.


The price, part 2: no foreign key

  A column pointing at three tables cannot be constrained.

  no cascadeOnDelete
  no protection against orphans
  nothing stops an id that refers to nothing

  Delete a post and its comments stay, unless you remove them.


  Use it when                     Prefer separate tables when
  ──────────                      ──────────────────────────
  the child is the same thing     each parent needs different
  for every parent                columns on the child

  the parent list will grow       there are exactly two, forever

  you would write the same        you want real foreign keys
  table three times               and cascading deletes`,
      codeExample: {
        title: "All three polymorphic shapes, plus the morph map",
        code: `<?php
// ---------- The migration ----------

Schema::create('comments', function (Blueprint $table) {
    $table->id();

    // Adds commentable_id and commentable_type, indexed together.
    $table->morphs('commentable');

    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->text('body');
    $table->timestamps();
});

// Note: no foreign key on commentable_id. There cannot be one.


<?php
// ---------- One-to-many ----------

namespace App\\Models;

class Comment extends Model
{
    public function commentable()
    {
        return $this->morphTo();       // a Post, or a Video
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

class Post extends Model
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

class Video extends Model
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

$post->comments;
$video->comments;
$comment->commentable;          // whichever it belongs to

$post->comments()->create(['body' => 'Great post!', 'user_id' => 1]);


<?php
// ---------- One-to-one ----------

class Image extends Model
{
    public function imageable()
    {
        return $this->morphTo();
    }
}

class User extends Model
{
    public function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}


<?php
// ---------- Many-to-many ----------

// taggables: tag_id, taggable_id, taggable_type

class Post extends Model
{
    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}

class Tag extends Model
{
    public function posts()
    {
        return $this->morphedByMany(Post::class, 'taggable');
    }

    public function videos()
    {
        return $this->morphedByMany(Video::class, 'taggable');
    }
}

$post->tags()->attach($tagId);
$tag->posts;


<?php
// ---------- The morph map: do this before you have data ----------

// app/Providers/AppServiceProvider.php

use Illuminate\\Database\\Eloquent\\Relations\\Relation;

public function boot(): void
{
    Relation::enforceMorphMap([
        'post'  => \\App\\Models\\Post::class,
        'video' => \\App\\Models\\Video::class,
        'user'  => \\App\\Models\\User::class,
    ]);
}

// commentable_type now stores 'post' instead of App\\Models\\Post,
// so moving or renaming the class does not break existing rows.


<?php
// ---------- Cleaning up, since the database will not ----------

class Post extends Model
{
    protected static function booted(): void
    {
        static::deleting(function (Post $post) {
            $post->comments()->delete();
        });
    }
}`,
      },
      keyTakeaways: [
        "<b>A polymorphic relationship lets one model belong to several types of parent</b>, using an id and a type column.",
        "It replaces three near-identical tables with one, and one model instead of three.",
        "<b>The child uses `morphTo()` and each parent uses `morphMany()` or `morphOne()`</b>, naming the column prefix.",
        "The prefix string, the column names and the child's method name must all match.",
        "<b>`morphToMany()` goes on the models being tagged and `morphedByMany()` on the tag</b>, over a polymorphic pivot.",
        "<b>The type column stores the fully qualified class name by default</b>, which puts your PHP namespace in the database.",
        "<b>A morph map stores a short alias instead</b>, surviving refactors and reading better, and it must be set up before you have data.",
        "<b>A polymorphic column cannot have a foreign key</b>, so there is no cascade and nothing prevents orphaned rows.",
        "Use it when the child is genuinely the same for every parent and the list will grow; prefer separate tables otherwise.",
      ],
      commonMistakes: [
        "<b>Mismatching the prefix and the method name.</b> `morphMany(Comment::class, 'commentable')` needs a `commentable()` on the child.",
        "<b>Adding a morph map after you have data.</b> Every existing row now holds the wrong value.",
        "<b>Expecting `cascadeOnDelete` to work.</b> There is no foreign key, so deleting a parent leaves its children.",
        "<b>Renaming or moving a model without a morph map.</b> Every stored class name points at nothing.",
        "<b>Reaching for polymorphism with exactly two parents that will never grow.</b> Two ordinary foreign keys are clearer.",
      ],
      quiz: [
        {
          question: "What two columns does a polymorphic relationship use?",
          options: [
            "The parent id and a boolean",
            "An id column and a type column, such as `commentable_id` and `commentable_type`",
            "Two foreign keys",
            "A pivot id and a class name",
          ],
          correctIndex: 1,
          explanation: "An id, plus what kind of thing that id refers to.",
        },
        {
          question: "Which method goes on the Comment model?",
          options: ["`morphMany()`", "`morphTo()`", "`morphOne()`", "`morphedByMany()`"],
          correctIndex: 1,
          explanation: "The child says `morphTo`; each parent says `morphMany`.",
        },
        {
          question: "Why use a morph map?",
          options: [
            "It makes queries faster",
            "So the database stores a short alias instead of a PHP class name that a refactor could break",
            "It enables foreign keys",
            "It is required for `morphToMany`",
          ],
          correctIndex: 1,
          explanation: "And it must be set up before there is data to migrate.",
        },
        {
          question: "What does a polymorphic relationship give up?",
          options: [
            "Eager loading",
            "Foreign key constraints, so no cascading deletes and no protection against orphans",
            "The ability to be counted",
            "Timestamps",
          ],
          correctIndex: 1,
          explanation: "A column pointing at several tables cannot be constrained.",
        },
      ],
    },
    {
      id: "querying-relationships",
      title: "has, whereHas & relationship aggregates",
      durationMinutes: 11,
      explanation: "Filtering by a relationship without loading it, and counting one without fetching it.\n\n---\n\n### 1. Basic — does the relationship exist?\n\n```php\nUser::has('posts')->get();        // users who have at least one post\nUser::doesntHave('posts')->get(); // users who have none\n```\n\nNo posts are loaded. Laravel writes an `EXISTS` subquery:\n\n```sql\nWHERE EXISTS (SELECT 1 FROM posts WHERE posts.user_id = users.id)\n```\n\nYou can ask for a number:\n\n```php\nUser::has('posts', '>=', 3)->get();\n```\n\nAnd go down a chain with dots:\n\n```php\nUser::has('posts.comments')->get();   // users whose posts have comments\n```\n\n<b>`whereHas()` adds a condition to the subquery:</b>\n\n```php\nUser::whereHas('posts', function ($query) {\n    $query->where('published', true);\n})->get();\n```\n\nUsers with at least one <i>published</i> post. Still no posts loaded.\n\nThe difference from `with()` is worth stating plainly, because they are constantly confused:\n\n```text\nwhereHas()   filters the PARENT by its children     loads nothing extra\nwith()       loads the children with the parent     filters nothing\n```\n\nThey solve different problems and are frequently used together.\n\n---\n\n### 2. Intermediate — counting without loading\n\nThis is the obvious way to show a post count, and it is wrong:\n\n```php\n$users = User::all();\n\nforeach ($users as $user) {\n    echo $user->posts->count();   // loads every post, for every user\n}\n```\n\nA hundred users with fifty posts each loads five thousand models to print a hundred numbers.\n\n<b>`withCount()` asks the database instead:</b>\n\n```php\n$users = User::withCount('posts')->get();\n\n$user->posts_count;\n```\n\nOne query, one extra column, no models. The attribute name is the relationship plus `_count`.\n\nThe rest of the family works the same way:\n\n```php\nUser::withSum('orders', 'amount')->get();   // $user->orders_sum_amount\nUser::withAvg('reviews', 'rating')->get();  // $user->reviews_avg_rating\nUser::withMax('orders', 'total')->get();\nUser::withExists('posts')->get();           // $user->posts_exists\n```\n\nAnd they take conditions:\n\n```php\nUser::withCount([\n    'posts',\n    'posts as published_count' => fn ($q) => $q->where('published', true),\n])->get();\n```\n\nTwo counts from one query, each with its own name.\n\n---\n\n### 3. Advanced — choosing the right one\n\nThree methods that sound alike, doing three different things:\n\n```text\nhas('posts')          filter: keep parents that have any\nwithCount('posts')    add a number, keep everyone\nwith('posts')         load the children\n```\n\nUse them together and each does one job:\n\n```php\nUser::whereHas('posts', fn ($q) => $q->where('published', true))\n    ->withCount('posts')\n    ->with('profile')\n    ->paginate(20);\n```\n\n\"Users with at least one published post, each with a post count and their profile loaded, twenty per page.\" Four ideas, one query plan, no N+1.\n\nTwo things worth knowing about cost.\n\n<b>`withExists()` is cheaper than `withCount()`</b> when you only need a yes or no, because the database can stop at the first match instead of counting every row. If the template says \"has any comments\", use `withExists()`.\n\nAnd <b>`whereHas()` runs a subquery per parent row</b>, so it depends entirely on the child's foreign key being indexed. That is the `foreignId()->constrained()` from Day 12 doing its job. Without the index, a `whereHas` on a large table is the slowest thing on the page.\n\nOne last shortcut for the common case:\n\n```php\nUser::whereRelation('posts', 'published', true)->get();\n```\n\nThe same as a `whereHas` with a single condition, without the closure.",
      diagram: `Filter by a relationship, load nothing

  User::has('posts')            has at least one
  User::doesntHave('posts')     has none
  User::has('posts', '>=', 3)   has three or more
  User::has('posts.comments')   whose posts have comments

  WHERE EXISTS (SELECT 1 FROM posts WHERE posts.user_id = users.id)

  whereHas('posts', fn (\$q) => \$q->where('published', true))
      users with at least one PUBLISHED post

  whereRelation('posts', 'published', true)
      the same, without the closure


The two that get confused

  whereHas()   filters the PARENT by its children   loads nothing
  with()       loads the children with the parent   filters nothing

  Different problems. Often used together.


Counting without loading

  ❌ foreach (User::all() as \$user)
         echo \$user->posts->count();

     100 users × 50 posts = 5,000 models loaded
     to print 100 numbers

  ✓ User::withCount('posts')->get();
     \$user->posts_count

     one query, one extra column, no models

  withCount   →  posts_count
  withSum     →  orders_sum_amount
  withAvg     →  reviews_avg_rating
  withExists  →  posts_exists

  Named counts, from one query:

  withCount(['posts',
             'posts as published_count' =>
                 fn (\$q) => \$q->where('published', true)])


Three that sound alike

  has('posts')         filter: keep parents that have any
  withCount('posts')   add a number, keep everyone
  with('posts')        load the children

  All three at once, each doing one job:

  User::whereHas('posts', fn (\$q) => \$q->where('published', true))
      ->withCount('posts')
      ->with('profile')
      ->paginate(20);


Cost

  withExists  cheaper than withCount: the database can stop
              at the first match instead of counting every row

  whereHas    a subquery per parent row, so it lives or dies
              on the child's foreign key being INDEXED`,
      codeExample: {
        title: "Filtering and counting without loading",
        code: `<?php

use App\\Models\\User;

// ---------- Does the relationship exist? ----------

User::has('posts')->get();            // at least one
User::doesntHave('posts')->get();     // none
User::has('posts', '>=', 3)->get();   // three or more
User::has('posts.comments')->get();   // whose posts have comments

// No posts are loaded. Laravel writes an EXISTS subquery.


// ---------- With a condition ----------

User::whereHas('posts', function ($query) {
    $query->where('published', true);
})->get();

// The same thing, for a single condition:
User::whereRelation('posts', 'published', true)->get();

// The inverse:
User::whereDoesntHave('posts', fn ($q) => $q->where('published', true))->get();


// ---------- Counting ----------

// ❌ 100 users × 50 posts = 5,000 models, to print 100 numbers.
foreach (User::all() as $user) {
    echo $user->posts->count();
}

// ✓ One query, one extra column, no models.
$users = User::withCount('posts')->get();

foreach ($users as $user) {
    echo $user->posts_count;
}


// ---------- The rest of the family ----------

User::withSum('orders', 'amount')->get();    // $user->orders_sum_amount
User::withAvg('reviews', 'rating')->get();   // $user->reviews_avg_rating
User::withMax('orders', 'total')->get();     // $user->orders_max_total
User::withExists('posts')->get();            // $user->posts_exists

// Cheaper than withCount when you only need yes or no: the
// database stops at the first match.


// ---------- Named and conditional counts ----------

$users = User::withCount([
    'posts',
    'posts as published_count' => fn ($q) => $q->where('published', true),
    'posts as draft_count'     => fn ($q) => $q->where('published', false),
])->get();

$user->posts_count;
$user->published_count;
$user->draft_count;


// ---------- All of it, doing one job each ----------

$users = User::query()
    ->whereHas('posts', fn ($q) => $q->where('published', true))  // filter
    ->withCount('posts')                                          // count
    ->with('profile')                                             // load
    ->orderByDesc('posts_count')
    ->paginate(20);

// Users with at least one published post, each with a post count
// and their profile loaded, twenty per page. No N+1.`,
      },
      keyTakeaways: [
        "<b>`has()` filters parents by whether a relationship exists</b>, using an `EXISTS` subquery and loading nothing.",
        "It takes an operator and a count, and a dotted path for nested relationships.",
        "<b>`whereHas()` adds conditions to that subquery</b>, and `whereRelation()` is the shorthand for a single condition.",
        "<b>`whereHas()` filters the parent; `with()` loads the children.</b> Different problems, often used together.",
        "<b>`withCount()` adds a count as a column</b>, exposed as the relationship name plus `_count`.",
        "Counting through `$user->posts->count()` loads every related model just to produce a number.",
        "`withSum()`, `withAvg()`, `withMax()` and `withExists()` work the same way with their own suffixes.",
        "<b>`withExists()` is cheaper than `withCount()`</b> when a yes or no is all you need.",
        "<b>`whereHas()` depends on the child's foreign key being indexed</b>, or it becomes the slowest query on the page.",
      ],
      commonMistakes: [
        "<b>Using `with()` when you meant `whereHas()`.</b> Loading the children does not filter the parents.",
        "<b>Calling `$user->posts->count()` in a loop.</b> Every related row is loaded to produce one number.",
        "<b>Using `withCount()` for a yes-or-no check.</b> `withExists()` stops at the first match.",
        "<b>Forgetting the `_count` suffix.</b> The attribute is `posts_count`, not `count`.",
        "<b>Running `whereHas()` against an unindexed foreign key.</b> The subquery scans the child table for every parent.",
      ],
      quiz: [
        {
          question: "What does `User::has('posts')` do?",
          options: [
            "Loads each user's posts",
            "Keeps only users who have at least one post, loading none of them",
            "Counts the posts",
            "Creates a post for each user",
          ],
          correctIndex: 1,
          explanation: "It becomes an `EXISTS` subquery.",
        },
        {
          question: "What is the difference between `whereHas('posts', ...)` and `with('posts')`?",
          options: [
            "None",
            "`whereHas` filters the parents; `with` loads the children",
            "`with` filters; `whereHas` loads",
            "`whereHas` is faster",
          ],
          correctIndex: 1,
          explanation: "They solve different problems and are often used together.",
        },
        {
          question: "What attribute does `User::withCount('posts')` add?",
          options: ["`count`", "`posts_count`", "`postsCount`", "`total_posts`"],
          correctIndex: 1,
          explanation: "The relationship name plus `_count`.",
        },
        {
          question: "You only need to know whether each user has any posts. Which is cheapest?",
          options: ["`with('posts')`", "`withCount('posts')`", "`withExists('posts')`", "`$user->posts->isNotEmpty()`"],
          correctIndex: 2,
          explanation: "The database can stop at the first match instead of counting every row.",
        },
      ],
    },
    {
      id: "eager-loading-and-n-plus-one",
      title: "Eager loading & the N+1 problem",
      durationMinutes: 14,
      explanation: "The most important lesson of the day, and the one that separates code that works locally from code that survives production.\n\n---\n\n### 1. Basic — the problem\n\nThis looks completely reasonable:\n\n```php\n$posts = Post::all();\n\nforeach ($posts as $post) {\n    echo $post->user->name;\n}\n```\n\nHere is what it actually runs. Relationships are <b>lazy</b>: the first time you touch `$post->user`, Eloquent goes and fetches it. For every post.\n\n```text\n1 query    → the posts\n100 queries → one user each\n─────────────────────────\n101 queries\n```\n\n<b>That is the N+1 problem</b> (one query for the parents, plus one per parent for the relationship). With ten posts on your machine it is invisible. With ten thousand in production it is the page that times out.\n\nThe fix is one word:\n\n```php\n$posts = Post::with('user')->get();\n```\n\n```text\n1 query → the posts\n1 query → SELECT * FROM users WHERE id IN (1, 2, 3, ...)\n──────────────────────────────────────────────────────\n2 queries\n```\n\n<b>Eager loading</b> (fetching the relationship up front, in one extra query) collects every foreign key from the parents and asks for all of them at once. Two queries whether there are ten posts or ten thousand.\n\n---\n\n### 2. Intermediate — the ways to load\n\nSeveral relationships:\n\n```php\nPost::with(['user', 'comments'])->get();\n```\n\nNested, with dots:\n\n```php\nPost::with(['user.profile', 'comments.author'])->get();\n```\n\n```text\nPost\n ├── User\n │    └── Profile\n └── Comments\n      └── Author\n```\n\nOne query per level, not per row.\n\nConstrained, when you do not want every child:\n\n```php\nPost::with([\n    'comments' => fn ($query) => $query->where('approved', true),\n])->get();\n```\n\nThat filters what gets loaded, and it does not filter the posts. A post with no approved comments still appears, with an empty collection. If you wanted only posts that have one, that is `whereHas()` from the last lesson, and you will often want both.\n\nAnd when you already have the models:\n\n```php\n$posts = Post::all();\n\n// ...later, you realise you need the users\n$posts->load('user');\n```\n\n<b>Lazy eager loading.</b> Still two queries in total.\n\n```text\nwith()   eager load during the original query\nload()   eager load after you already have the models\n```\n\n`loadMissing()` is the safer version, skipping anything already loaded.\n\nA model can also declare relationships it always needs:\n\n```php\nprotected $with = ['user'];\n```\n\nUse that sparingly. It loads on <i>every</i> query for that model, including ones that never touch the relationship.\n\n---\n\n### 3. Advanced — finding them before production does\n\nThe reason N+1 is so common is that nothing tells you. The code is correct, the page renders, the tests pass. It just runs 101 queries.\n\nSo make Laravel tell you:\n\n```php\nModel::preventLazyLoading(! app()->isProduction());\n```\n\nin a service provider. Now touching a relationship that was not eager loaded throws an exception in development, and does nothing in production. The N+1 becomes a failure in front of you rather than a slow page in front of a user.\n\n<b>Turn this on at the start of a project.</b> Turning it on later means finding out how much of the codebase has the problem.\n\nTo see the queries themselves:\n\n```php\nDB::listen(function ($query) {\n    logger($query->sql, ['time' => $query->time]);\n});\n```\n\nDebugbar and Telescope do the same with a nicer interface, and either is worth installing on day one.\n\nThe skill this is all pointing at is a question you should be able to ask about any block of code, before you run it:\n\n> <b>How many queries will this produce?</b>\n\nWith a loop over models, the answer is always one of two things. Either the relationship was eager loaded and the answer is a small constant, or it was not and the answer grows with the number of rows.\n\nTwo places worth checking specifically, because both hide the loop:\n\n```text\na Blade @foreach touching $item->relation\nan appended attribute that reads a relationship\n```\n\nThe second is the one from yesterday: an `$appends` entry that touches a relationship runs a query for every model in every response, and it is invisible from the controller.",
      diagram: `The problem

  \$posts = Post::all();

  foreach (\$posts as \$post) {
      echo \$post->user->name;      ← a query, every time round
  }

  Relationships are LAZY. The first time you touch
  \$post->user, Eloquent goes and fetches it.

    1 query    → the posts
  100 queries  → one user each
  ────────────────────────────
  101 queries        = N + 1

  Ten posts locally: invisible.
  Ten thousand in production: the page that times out.


The fix

  \$posts = Post::with('user')->get();

  1 query → the posts
  1 query → SELECT * FROM users WHERE id IN (1, 2, 3, ...)
  ────────────────────────────────────────────────────────
  2 queries, whether there are 10 posts or 10,000


The ways to load

  with(['user', 'comments'])           several
  with(['user.profile'])               nested, one query per LEVEL
  with(['comments' => fn (\$q) =>       constrained
        \$q->where('approved', true)])

  \$posts->load('user')                 after you already have them
  \$posts->loadMissing('user')          skip what is already loaded

  protected \$with = ['user'];          always. Use sparingly:
                                       it loads on EVERY query.

  Constrained loading filters the CHILDREN, not the parents.
  A post with no approved comments still appears, empty.
  Want only posts that have one? That is whereHas().


Finding them before production does

  Nothing tells you. The code is correct, the page renders,
  the tests pass. It just runs 101 queries.

  Model::preventLazyLoading(! app()->isProduction());

  Now an un-eager-loaded relationship THROWS in development
  and does nothing in production.

  Turn it on at the START of a project.

  DB::listen(fn (\$q) => logger(\$q->sql, ['time' => \$q->time]));
  ...or Debugbar, or Telescope.


The question to ask about any loop

  "How many queries will this produce?"

  Either the relationship was eager loaded (a small constant)
  or it was not (it grows with the rows).

  Two places that hide the loop:
    a Blade @foreach touching \$item->relation
    an appended attribute that reads a relationship`,
      codeExample: {
        title: "N+1, and every way to avoid it",
        code: `<?php

use App\\Models\\Post;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Support\\Facades\\DB;

// ---------- The problem ----------

$posts = Post::all();               // 1 query

foreach ($posts as $post) {
    echo $post->user->name;         // 1 query, every iteration
}

// 100 posts = 101 queries.


// ---------- The fix ----------

$posts = Post::with('user')->get();  // 2 queries, always

foreach ($posts as $post) {
    echo $post->user->name;          // already loaded
}


// ---------- Several, and nested ----------

Post::with(['user', 'comments'])->get();

Post::with(['user.profile', 'comments.author'])->get();
// Post
//  ├── User
//  │    └── Profile
//  └── Comments
//       └── Author
// One query per level, not per row.


// ---------- Constrained ----------

Post::with([
    'comments' => fn ($query) => $query
        ->where('approved', true)
        ->latest()
        ->limit(3),
])->get();

// Filters the COMMENTS, not the posts. A post with no approved
// comments still appears, with an empty collection.

// Only posts that have one, each with their approved comments:
Post::whereHas('comments', fn ($q) => $q->where('approved', true))
    ->with(['comments' => fn ($q) => $q->where('approved', true)])
    ->get();


// ---------- After the fact ----------

$posts = Post::all();

$posts->load('user');            // still 2 queries in total
$posts->loadMissing('user');     // skips what is already loaded
$posts->loadCount('comments');   // adds comments_count


<?php
// ---------- Always loaded, for this model ----------

class Comment extends Model
{
    // Loads on EVERY query for a Comment. Use sparingly.
    protected $with = ['user'];
}


<?php
// ---------- Make N+1 impossible to miss ----------

// app/Providers/AppServiceProvider.php

public function boot(): void
{
    // Throws in development, does nothing in production.
    Model::preventLazyLoading(! app()->isProduction());
}

// Now this throws before it can reach a user:
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name;      // LazyLoadingViolationException
}


<?php
// ---------- Seeing the queries ----------

DB::listen(function ($query) {
    logger($query->sql, [
        'bindings' => $query->bindings,
        'time'     => $query->time,
    ]);
});


<?php
// ---------- The hidden one, from yesterday ----------

// ❌ An appended attribute that reads a relationship runs a
//    query for every model in every response, invisibly.
protected $appends = ['comment_count'];

protected function commentCount(): Attribute
{
    return Attribute::make(get: fn () => $this->comments()->count());
}

// ✓ Ask for it in the query instead.
Post::withCount('comments')->paginate(20);`,
      },
      keyTakeaways: [
        "<b>Relationships are lazy</b>: touching one runs a query the first time, which is what creates the problem.",
        "<b>The N+1 problem is one query for the parents plus one per parent</b>, so a hundred posts means 101 queries.",
        "It is invisible with ten rows locally and fatal with ten thousand in production.",
        "<b>`with()` eager loads the relationship in one extra query</b> using `WHERE id IN (...)`, so the total stays at two.",
        "Dots load nested relationships, at one query per level rather than per row.",
        "<b>A closure constrains what gets loaded</b>, and it filters the children, not the parents.",
        "<b>`load()` eager loads after you already have the models</b>, and `loadMissing()` skips what is loaded.",
        "`protected $with` loads a relationship on every query for that model, so use it sparingly.",
        "<b>`Model::preventLazyLoading()` turns an N+1 into an exception in development</b>, and should be on from day one.",
        "<b>Ask of any loop: how many queries will this produce?</b> Blade loops and appended attributes are where it hides.",
      ],
      commonMistakes: [
        "<b>Looping over models and touching a relationship inside.</b> That is an N+1, every time.",
        "<b>Assuming a constrained `with()` filters the parents.</b> Parents with no matching children still appear.",
        "<b>Adding `protected $with` to fix one page.</b> Every other query for that model now pays for it.",
        "<b>Appending an attribute that reads a relationship.</b> One query per model per response, invisibly.",
        "<b>Waiting until production is slow to look at query counts.</b> `preventLazyLoading()` finds them while you write the code.",
      ],
      quiz: [
        {
          question: "How many queries does looping over 100 posts and reading `$post->user->name` produce?",
          options: ["1", "2", "100", "101"],
          correctIndex: 3,
          explanation: "One for the posts, plus one per post. That is the N+1.",
        },
        {
          question: "What does `Post::with('user')->get()` change?",
          options: [
            "It filters posts to those with a user",
            "It fetches all the users in one extra query, so the total is two",
            "It caches the users",
            "It joins the tables into one row",
          ],
          correctIndex: 1,
          explanation: "`WHERE id IN (...)`, whether there are ten posts or ten thousand.",
        },
        {
          question: "What is the difference between `with()` and `load()`?",
          options: [
            "None",
            "`with()` loads during the original query; `load()` loads after you already have the models",
            "`load()` is lazy",
            "`with()` only works on collections",
          ],
          correctIndex: 1,
          explanation: "Both end up at two queries in total.",
        },
        {
          question: "What does `Model::preventLazyLoading()` do?",
          options: [
            "Disables relationships",
            "Throws when you touch a relationship that was not eager loaded, so N+1 fails in development",
            "Eager loads everything automatically",
            "Caches relationship queries",
          ],
          correctIndex: 1,
          explanation: "Enable it outside production, and from the start of a project.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Two tables are related. Which one gets `belongsTo`?",
      options: [
        "The one with fewer rows",
        "The one whose table holds the foreign key",
        "Always the parent",
        "Both of them",
      ],
      correctIndex: 1,
      explanation: "The key sits on the many side, and that side is always `belongsTo`.",
    },
    {
      question: "What is the conventional pivot table name for Post and Tag?",
      options: ["post_tags", "post_tag", "tag_post", "tags_posts"],
      correctIndex: 1,
      explanation: "Both singular, snake_case, alphabetical.",
    },
    {
      question: "A form submits the full list of roles a user should have. Which method?",
      options: ["`attach()`", "`sync()`", "`toggle()`", "`syncWithoutDetaching()`"],
      correctIndex: 1,
      explanation: "It adds the missing, removes the absent and leaves the rest alone.",
    },
    {
      question: "Which method goes on the model that can belong to several types of parent?",
      options: ["`morphMany()`", "`morphTo()`", "`morphOne()`", "`morphToMany()`"],
      correctIndex: 1,
      explanation: "The child says `morphTo`; each parent says `morphMany`.",
    },
    {
      question: "Why does a polymorphic relationship have no cascading delete?",
      options: [
        "Laravel disables it",
        "A column pointing at several tables cannot have a foreign key constraint",
        "The type column is a string",
        "It does cascade",
      ],
      correctIndex: 1,
      explanation: "Your application has to clean up the children itself.",
    },
    {
      question: "You need a post count per user, for 100 users. What do you use?",
      options: [
        "`$user->posts->count()` in a loop",
        "`User::withCount('posts')`",
        "`User::with('posts')`",
        "`User::has('posts')`",
      ],
      correctIndex: 1,
      explanation: "One query and one extra column, with no models loaded.",
    },
    {
      question: "How many queries does looping over 50 posts and reading `$post->user->name` produce, with no eager loading?",
      options: ["1", "2", "50", "51"],
      correctIndex: 3,
      explanation: "One for the posts plus one per post: the N+1.",
    },
    {
      question: "What is the difference between `whereHas('comments', ...)` and `with('comments', ...)`?",
      options: [
        "None",
        "`whereHas` filters the parents; `with` loads the children",
        "`with` filters the parents",
        "`whereHas` loads the comments too",
      ],
      correctIndex: 1,
      explanation: "A constrained `with()` leaves parents with no matching children in the results.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Wire InvoiceHub's models together: customers, invoices and lines, tags on anything, a polymorphic comment thread, and not one N+1 on any page.",
    brief: "Yesterday every table became a model. Today they learn about each other.\n\nThe schema is already mostly there from Day 12: invoices belong to customers, lines belong to invoices. What is missing is everything that makes those useful, plus two new pieces: tags that can go on invoices or customers, and a comment thread that works on either.\n\nOne rule for the whole day, and it is the one that matters. <b>Turn on `Model::preventLazyLoading()` before you write a line of it.</b> Every page you build has to declare what it loads. If it throws, you have found an N+1 that would otherwise have reached production, and fixing it now costs a minute.\n\nKeep a query counter visible while you work, through Debugbar, Telescope or a `DB::listen()` that logs a count per request. You should be able to state the number for every page you build before you load it.",
    steps: [
      "Add `Model::preventLazyLoading(! app()->isProduction());` to `AppServiceProvider::boot()` and reload the invoice list. Fix whatever it throws before going further.",
      "Define `Customer::invoices()` and `Invoice::customer()`, then `Invoice::lines()` and `InvoiceLine::invoice()`. Name each method after what it returns.",
      "Rewrite invoice creation to go through the relationship: `$customer->invoices()->create([...])` and `$invoice->lines()->createMany([...])`, inside a transaction. Delete every place you set a foreign key by hand.",
      "Add `$touches = ['invoice']` to `InvoiceLine` so editing a line moves the invoice's `updated_at`. Explain in a comment what that buys you.",
      "Add a `tags` table and a polymorphic `taggables` pivot. Give `Invoice` and `Customer` a `tags()` using `morphToMany`, and give `Tag` a `morphedByMany` for each.",
      "Build a tag editor that submits the full list of tag ids and applies it with `sync()`. Log what `sync()` returns so you can see what was attached and detached.",
      "Set up a morph map in `AppServiceProvider` so `taggable_type` stores `invoice` and `customer` rather than class names. Do this before you have real data, and say in a comment why.",
      "Add a `comments` table with `morphs('commentable')` and a `user_id`. Give `Invoice` and `Customer` a `comments()` relationship and `Comment` both `commentable()` and `user()`.",
      "Build a comment thread on the invoice page. Load it with `with(['comments.user'])` and confirm the page runs a fixed number of queries whether there are 2 comments or 200.",
      "Deliberately break it: change that to `with('comments')` only, and touch `$comment->user->name` in the view. Watch `preventLazyLoading()` throw, then fix it.",
      "Add a customer list showing each customer's invoice count and total invoiced, using `withCount('invoices')` and `withSum('invoices', 'total')`. No loops, no relationship loading.",
      "Add a filter to that list for customers with at least one overdue invoice, using `whereHas()`. Confirm no invoices are loaded, and check that `invoices.customer_id` is indexed.",
      "Add a second count to the same query, `'invoices as unpaid_count' => fn ($q) => $q->where('status', 'unpaid')`, and show both numbers.",
      "Add a `Country` model and give it `hasManyThrough(Invoice::class, Customer::class)` for a country-level revenue page. Write down the query it runs.",
      "Delete a customer that has invoices, comments and tags. Note exactly what the database cleaned up and what it did not, and fix the polymorphic leftovers yourself.",
      "Finish by writing down the query count for every page you built, and be able to explain each number.",
    ],
    acceptance: [
      "`preventLazyLoading()` is on outside production and no page throws.",
      "No code sets an invoice's `customer_id` or a line's `invoice_id` by hand.",
      "The invoice page runs the same number of queries with 2 comments as with 200.",
      "The customer list shows an invoice count and total without loading a single invoice.",
      "The overdue filter changes which customers appear and loads no invoices.",
      "`taggable_type` contains `invoice` and `customer`, not fully qualified class names.",
      "The tag editor can add and remove tags in one submission, and logging shows what changed.",
      "Deleting a customer leaves no orphaned comments or tag rows.",
      "You can state the query count for every page and explain why it is that number.",
    ],
    stretch: [
      "Promote the tag pivot to a model recording who applied the tag and when, using `using()` and `withPivot()`.",
      "Add a `latestOfMany()` relationship for a customer's most recent invoice and use it on the customer list without an extra query per row.",
      "Take one page that currently runs six queries and get it to three, then write down what you changed and what it cost in readability.",
    ],
  },
};
