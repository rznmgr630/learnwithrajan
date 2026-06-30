import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Think of Eloquent relationships like the connections between people in real life — a user has many posts, a post belongs to a user, a student belongs to many courses.\n\nEloquent turns these real-world connections into simple PHP methods so you never have to write raw SQL joins.\n\n<b>The four core relationship types</b>\n• <b>hasOne</b> — one parent, one child (a user has one profile)\n• <b>hasMany</b> — one parent, many children (a user has many posts)\n• <b>belongsTo</b> — the child points back to its parent (a post belongs to a user)\n• <b>belongsToMany</b> — two models connected through a middle table called a pivot (a user belongs to many roles)\n\nRelationships are <b>lazy by default</b> — they only hit the database when you actually access them, not when you define them.",
      np: "Eloquent relationship ले FK joins PHP methods मा। hasOne/hasMany parent; belongsTo child; belongsToMany pivot।",
      jp: "Eloquent リレーションは外部キー結合を PHP メソッドで表現します。hasOne/hasMany が親側、belongsTo が子側、belongsToMany が多対多のピボットです。",
    },
    {
      en: "Three more concepts round out this day:\n\n<b>N+1 problem</b>\n• Loading 100 posts then looping to get each post's author fires 101 queries — one for posts, then one per post for its author\n  ↳ Fix: use `with('author')` to load everything in 2 queries instead of 101\n\n<b>Soft deletes</b>\n• Instead of physically deleting a row, Laravel marks it with a timestamp in a `deleted_at` column\n  ↳ The row stays in the table but is invisible to normal queries — you can restore it any time\n\n<b>Observers</b>\n• An observer is a class that listens for model events (created, updated, deleted) and runs your code automatically\n  ↳ Keeps model-related side effects out of controllers and in one organised place",
      np: "N+1 problem: `with()` ले solve। Soft delete: row physically remove नगरी mark। Observer ले event logic centralize।",
      jp: "N+1 問題は `with()` で解決します。ソフトデリートは行を物理削除せず `deleted_at` を記録。オブザーバでモデルイベントロジックを集中管理できます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Core relationship types",
        np: "Core relationship types",
        jp: "基本のリレーション型",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel figures out the foreign key automatically by looking at the model name.\n\n<b>How the naming convention works</b>\n• If you call `belongsTo(User::class)`, Laravel looks for a `user_id` column on the current table\n  ↳ It takes the model name, converts it to snake_case, and adds `_id`\n• You can override this by passing the column name as the second argument: `$this->belongsTo(User::class, 'author_id')`\n\n<b>Avoiding null errors with `withDefault()`</b>\n• If a post has no `user_id`, accessing `$post->user` returns `null` — which causes a crash if you then try `$post->user->name`\n  ↳ `withDefault(['name' => 'Anonymous'])` returns a placeholder User model instead of `null`\n  ↳ Much safer when dealing with optional relationships",
            np: "Convention ले `user_id` infer। Override गर्न explicit argument। `withDefault()` ले null बाट जोगिन सकिन्छ।",
            jp: "規約で `user_id` などを自動推定。上書きするには関係メソッドに引数を渡します。`withDefault()` で外部キーが null のとき空モデルを返せます。",
          },
        },
        {
          type: "code",
          title: {
            en: "hasOne, hasMany, belongsTo",
            np: "hasOne, hasMany, belongsTo उदाहरण",
            jp: "hasOne・hasMany・belongsTo の定義",
          },
          code: `// app/Models/User.php
class User extends Model
{
    // One user → one profile (FK: profiles.user_id)
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
        // Override FK: $this->hasOne(Profile::class, 'user_id', 'id');
    }

    // One user → many posts (FK: posts.user_id)
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}

// app/Models/Post.php
class Post extends Model
{
    // Many posts → one user (FK: posts.user_id)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // withDefault: returns empty User model when user_id is null
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id')
            ->withDefault(['name' => 'Anonymous']);
    }
}

// ---- Accessing relationships ----
$user    = User::find(1);
$profile = $user->profile;          // hasOne → single model or null
$posts   = $user->posts;            // hasMany → Collection
$author  = Post::first()->user;     // belongsTo → single model or null`,
        },
        {
          type: "code",
          title: {
            en: "belongsToMany — pivot table operations",
            np: "belongsToMany — pivot operations",
            jp: "belongsToMany とピボットテーブル操作",
          },
          code: `// Pivot table convention: alphabetical singular model names → role_user
// Migration: $table->foreignId('user_id'); $table->foreignId('role_id');

// app/Models/User.php
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class)
        ->withTimestamps()                // created_at, updated_at on pivot
        ->withPivot('assigned_by');       // extra pivot column
}

// app/Models/Role.php
public function users(): BelongsToMany
{
    return $this->belongsToMany(User::class)->withTimestamps();
}

// ---- Pivot operations ----
$user = User::find(1);

$user->roles()->attach($roleId);              // add a role
$user->roles()->attach($roleId, ['assigned_by' => auth()->id()]); // with pivot data
$user->roles()->detach($roleId);              // remove a role
$user->roles()->detach();                     // remove ALL roles

// sync: detaches roles NOT in the array, attaches new ones
$user->roles()->sync([1, 2, 3]);

// syncWithoutDetaching: only attaches, never removes
$user->roles()->syncWithoutDetaching([4]);

// toggle: attaches if missing, detaches if present
$user->roles()->toggle([1, 2]);

// Access pivot columns
foreach ($user->roles as $role) {
    echo $role->pivot->assigned_by;
    echo $role->pivot->created_at;
}`,
        },
        {
          type: "diagram",
          id: "laravel-eloquent-relations",
        },
      ],
    },
    {
      title: {
        en: "Pivot tables & advanced relations",
        np: "Pivot tables र advanced relations",
        jp: "ピボットテーブルと高度なリレーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Sometimes two models are connected through a third, and you want to jump straight to the end without a direct foreign key.\n\n<b>hasManyThrough explained with an analogy</b>\n• Think of it like: Country → has many Users → each User has many Posts\n  ↳ You want to ask \"give me all posts written by users in this country\" — but there's no direct `country_id` on the `posts` table\n• `hasManyThrough(Post::class, User::class)` builds the two-step join for you automatically\n  ↳ Laravel figures out the chain — you don't have to write raw SQL",
            np: "hasOneThrough/hasManyThrough: Country→Users→Posts — direct FK बिना। Country ले Posts access।",
            jp: "hasOneThrough / hasManyThrough で 2 つの外部キーをまたいでモデルにアクセス。Country→Users→Posts が典型例です。",
          },
        },
        {
          type: "code",
          title: {
            en: "hasOneThrough / hasManyThrough",
            np: "hasManyThrough उदाहरण",
            jp: "hasManyThrough の使用例",
          },
          code: `// app/Models/Country.php
class Country extends Model
{
    // Country → Users → Posts (through users)
    public function posts(): HasManyThrough
    {
        return $this->hasManyThrough(
            Post::class,    // final model
            User::class,    // intermediate model
            'country_id',   // FK on users table
            'user_id',      // FK on posts table
            'id',           // local key on countries
            'id',           // local key on users
        );
    }
}

$country = Country::find(1);
$posts   = $country->posts; // all posts by users in this country`,
        },
        {
          type: "paragraph",
          text: {
            en: "A polymorphic relationship lets one model belong to multiple different model types — without creating a separate table for each.\n\n<b>Real-world example: comments</b>\n• Imagine you want users to leave comments on both blog posts and videos\n  ↳ Without polymorphism you'd need a `post_comments` table AND a `video_comments` table\n  ↳ With polymorphism, one `comments` table serves both — using two special columns\n• `commentable_type` stores which model owns the comment (e.g., `App\\Models\\Post` or `App\\Models\\Video`)\n• `commentable_id` stores the ID of that specific post or video\n  ↳ Together they uniquely identify the parent — no matter what type it is",
            np: "Polymorphic: Comment ले Post वा Video दुवैमा belong गर्न सक्छ। `commentable_type` र `commentable_id`।",
            jp: "ポリモーフィック関係で 1 つのリレーションが複数のモデル型につながります。Comment が Post にも Video にも属せる典型例です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Polymorphic morphMany / morphTo",
            np: "Polymorphic उदाहरण",
            jp: "ポリモーフィックリレーションの例",
          },
          code: `// Migration: comments table
// $table->morphs('commentable');
// → adds commentable_type (VARCHAR) and commentable_id (BIGINT UNSIGNED)

// app/Models/Comment.php
class Comment extends Model
{
    public function commentable(): MorphTo
    {
        return $this->morphTo(); // resolves to Post or Video
    }
}

// app/Models/Post.php
class Post extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

// app/Models/Video.php
class Video extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

// ---- Usage ----
$post->comments()->create(['body' => 'Great post!']);
$video->comments()->create(['body' => 'Nice video!']);

$comment = Comment::first();
$parent  = $comment->commentable; // returns Post or Video instance`,
        },
      ],
    },
    {
      title: {
        en: "Eager loading & the N+1 problem",
        np: "Eager loading र N+1 problem",
        jp: "Eager loading と N+1 問題",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The N+1 problem is the most common performance mistake in Eloquent — and the easiest to fix once you spot it.\n\n<b>What is the N+1 problem?</b>\n• Imagine you load 100 blog posts, then loop through them to get each post's author\n  ↳ That's 1 query to get the posts + 100 queries to get each author = 101 total\n• The number of extra queries grows with your data — at 1,000 posts it becomes 1,001 queries\n  ↳ This kills performance and is easy to miss in development where datasets are small\n\n<b>The fix: eager loading with `with()`</b>\n• `Post::with('user')->get()` runs exactly 2 SQL queries — one for posts, one for all their users at once\n  ↳ Laravel connects them in memory — no extra query per post in the loop\n• Always use `with()` when you know you'll be accessing a relationship inside a loop",
            np: "N+1: loop भित्र lazy relationship access — 1+N queries। `with()` ले 1+1 queries मात्र।",
            jp: "N+1 問題はループ内で遅延リレーションにアクセスすることで発生。`with()` で `WHERE IN (...)` の 1 クエリに置き換えます。",
          },
        },
        {
          type: "code",
          title: {
            en: "N+1 demonstration — before and after",
            np: "N+1 problem — before/after",
            jp: "N+1 問題の before/after",
          },
          code: `// ❌ N+1 problem — fires 1 + N queries
$posts = Post::all(); // 1 query: SELECT * FROM posts
foreach ($posts as $post) {
    echo $post->user->name; // N queries: SELECT * FROM users WHERE id = ?
}
// If $posts has 100 rows → 101 SQL queries

// ✅ Eager loading — fires exactly 2 queries
$posts = Post::with('user')->get();
// query 1: SELECT * FROM posts
// query 2: SELECT * FROM users WHERE id IN (1, 2, 3, …)
foreach ($posts as $post) {
    echo $post->user->name; // no extra query — already loaded
}

// ---- Deep / nested eager loading ----
$posts = Post::with('user.profile')->get(); // posts + users + profiles
$users = User::with(['posts', 'posts.comments'])->get(); // nested

// ---- Constrained eager load ----
$users = User::with(['posts' => function ($query) {
    $query->published()->latest()->limit(5);
}])->get();

// Shorter closure syntax (PHP 7.4+)
$users = User::with(['posts' => fn ($q) => $q->published()->latest()])->get();

// ---- Lazy eager loading (after query already ran) ----
$users = User::all();           // already fetched
$users->load('posts');          // load relationship in-place
$users->loadMissing('posts');   // only load if not already loaded

// ---- withCount: get relation count without hydrating models ----
$users = User::withCount('posts')->get();
echo $users->first()->posts_count; // no extra query for each user`,
        },
      ],
    },
    {
      title: {
        en: "Soft deletes & model events",
        np: "Soft deletes र Model events",
        jp: "ソフトデリートとモデルイベント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Soft deletes give you a safety net — deleted records aren't really gone, just hidden.\n\n<b>How soft deletes work</b>\n• When you call `$post->delete()` on a model using `SoftDeletes`, Laravel sets `deleted_at` to the current timestamp instead of running `DELETE FROM posts`\n  ↳ The row stays in the database — it's just marked as deleted\n• All normal queries automatically add `WHERE deleted_at IS NULL` so soft-deleted rows are invisible\n  ↳ You don't need to add any filtering yourself — it's handled behind the scenes\n\n<b>Working with soft-deleted records</b>\n• `Post::withTrashed()->get()` — returns all records, including soft-deleted ones\n• `Post::onlyTrashed()->get()` — returns only the soft-deleted records\n• `$post->restore()` — clears `deleted_at` and brings the record back\n• `$post->forceDelete()` — physically removes the row from the database permanently",
            np: "`SoftDeletes` trait ले `deleted_at` set गर्छ। Normal query मा filter। `withTrashed()` ले सब देखाउँछ।",
            jp: "`SoftDeletes` トレイトは物理削除の代わりに `deleted_at` を記録。通常クエリは自動的にフィルタ。`withTrashed()` で全件、`onlyTrashed()` で削除済みのみ取得できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "SoftDeletes trait — setup and usage",
            np: "SoftDeletes trait उदाहरण",
            jp: "SoftDeletes トレイトの設定と使用",
          },
          code: `// Migration: add the column
$table->softDeletes(); // deleted_at TIMESTAMP NULL DEFAULT NULL

// app/Models/Post.php
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;
}

// ---- Soft delete operations ----
$post = Post::find(1);
$post->delete();          // sets deleted_at = now()  (soft delete)
$post->forceDelete();     // physically removes the row from DB

// ---- Querying soft-deleted records ----
Post::all();              // excludes soft-deleted rows
Post::withTrashed()->find(1);       // includes soft-deleted
Post::withTrashed()->where('user_id', 1)->get();
Post::onlyTrashed()->get();         // only soft-deleted

// ---- Restore ----
Post::withTrashed()->find(1)->restore(); // clears deleted_at

// ---- Cascade soft deletes manually (no DB cascade for soft deletes) ----
// In a model observer or in the delete() method:
// $post->comments()->delete(); // soft-deletes related comments`,
        },
        {
          type: "paragraph",
          text: {
            en: "Model events let you run code automatically when something happens to a model — like auto-generating a slug when a post is created, or soft-deleting related comments when a post is deleted.\n\n<b>When each event fires</b>\n• `creating` / `created` — fires before and after a new record is inserted into the database\n• `updating` / `updated` — fires before and after an existing record is changed\n• `saving` / `saved` — fires on both creates and updates (a catch-all for either)\n• `deleting` / `deleted` — fires before and after a record is deleted\n• `restoring` / `restored` — fires when a soft-deleted record is brought back\n\n<b>Two ways to listen to events</b>\n• For simple cases: add an inline closure inside `boot()` in your model\n  ↳ Quick and easy, but gets messy when you stack up multiple events\n• For complex cases: create a dedicated <b>Observer</b> class with one method per event\n  ↳ All event logic lives in one organised file — easier to read, test, and maintain",
            np: "Model events: `creating`, `created`, `updating`, `deleted` आदि। Simple: `boot()` मा inline। Complex: observer class।",
            jp: "モデルイベントはライフサイクルの各段階で発火。シンプルなら `boot()` に直接、複雑なロジックはオブザーバクラスに切り出します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Observer pattern — PostObserver",
            np: "Observer उदाहरण",
            jp: "オブザーバパターンの例",
          },
          code: `php artisan make:observer PostObserver --model=Post

// app/Observers/PostObserver.php
<?php

namespace App\\Observers;

use App\\Models\\Post;
use Illuminate\\Support\\Str;

class PostObserver
{
    public function creating(Post $post): void
    {
        // Auto-generate slug if not provided
        if (empty($post->slug)) {
            $post->slug = Str::slug($post->title);
        }
    }

    public function created(Post $post): void
    {
        // Notify subscribers after a post is published
        if ($post->is_published) {
            // NotifySubscribers::dispatch($post);
        }
    }

    public function deleting(Post $post): void
    {
        // Soft-delete related comments when post is deleted
        $post->comments()->delete();
    }
}

// Register in app/Providers/AppServiceProvider.php (or bootstrap/app.php)
use App\\Models\\Post;
use App\\Observers\\PostObserver;

public function boot(): void
{
    Post::observe(PostObserver::class);
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How does Laravel know the foreign key name for a relationship?",
        np: "Laravel ले foreign key name कसरी थाहा पाउँछ?",
        jp: "Laravel はどうやって外部キー名を知りますか？",
      },
      answer: {
        en: "Laravel follows a naming convention so you don't have to spell out every column name.\n\n• For `belongsTo(User::class)` — Laravel looks for a `user_id` column on the current table\n• For `hasMany(Post::class)` on a `User` model — Laravel looks for `user_id` on the `posts` table\n  ↳ The pattern is always: the related model name in snake_case + `_id`\n\nIf your column has a different name (like `author_id` instead of `user_id`), pass it as the second argument:\n`$this->belongsTo(User::class, 'author_id')`\n  ↳ The third argument overrides the local key on your own table (defaults to `id`)",
        np: "Snake_case model name + `_id`। Override: `$this->belongsTo(User::class, 'author_id')`।",
        jp: "スネークケースのモデル名 + `_id` が規約です。上書きするには `$this->belongsTo(User::class, 'author_id')` のように第 2 引数で指定します。",
      },
    },
    {
      question: {
        en: "What if my pivot table has a different name than the convention?",
        np: "Pivot table को नाम convention अनुसार नभए?",
        jp: "ピボットテーブル名が規約と異なる場合は？",
      },
      answer: {
        en: "By convention, Laravel expects the pivot table to be named using both model names in alphabetical order, singular, joined with an underscore — for example, `role_user` for User and Role.\n\nIf your table has a different name, pass it as the second argument:\n`$this->belongsToMany(Role::class, 'user_role_assignments')`\n\nIf your foreign key column names also don't match the convention, pass them as the third and fourth arguments:\n`$this->belongsToMany(Role::class, 'user_role_assignments', 'member_id', 'permission_id')`\n  ↳ Third argument = the foreign key pointing to the current model's table\n  ↳ Fourth argument = the foreign key pointing to the related model's table",
        np: "`$this->belongsToMany(Role::class, 'user_role_assignments')` — table name explicit।",
        jp: "`belongsToMany(Role::class, 'user_role_assignments')` のように第 2 引数でテーブル名を指定します。外部キー列名は第 3・第 4 引数で上書きできます。",
      },
    },
    {
      question: {
        en: "How do I filter records based on a related model's columns?",
        np: "Related model को column अनुसार filter गर्ने?",
        jp: "リレーションのカラムでフィルタするには？",
      },
      answer: {
        en: "Use `whereHas()` — it lets you filter parent models based on a condition in their related records.\n\n<b>Examples</b>\n• Get all posts that have at least one approved comment:\n`Post::whereHas('comments', fn ($q) => $q->where('approved', true))->get()`\n  ↳ Only returns posts where a matching comment exists — posts with no approved comments are excluded\n• `whereDoesntHave('comments')` — returns posts with zero comments (the inverse)\n• `has('comments', '>=', 3)` — returns posts with 3 or more comments\n\n<b>Counting without loading</b>\n• `withCount('comments')` adds a `comments_count` integer to each post — without loading the actual comment models\n  ↳ Perfect for showing \"12 comments\" in a list without fetching all 12 comment rows",
        np: "`whereHas('comments', fn($q) => $q->where('approved', true))` — related condition। `withCount()` ले count।",
        jp: "`whereHas('comments', fn($q) => $q->where('approved', true))` で条件付きリレーションフィルタ。`withCount()` は件数を追加属性として取得します。",
      },
    },
    {
      question: {
        en: "What is `withCount` and when should I use it?",
        np: "`withCount` के हो र कहिले प्रयोग?",
        jp: "`withCount` とは何ですか、どんな場面で使いますか？",
      },
      answer: {
        en: "`withCount()` gives you a number attached to each model — without loading all the related records.\n\n• `User::withCount('posts')->get()` adds a `posts_count` attribute to every User\n  ↳ Laravel runs a `COUNT(*)` in the SQL — no Post models are loaded into memory\n• Use it when you want to show \"Rajan has 12 posts\" in a list — you just need the number, not the posts themselves\n• You can also sort by it: `->orderByDesc('posts_count')` to rank users by most posts\n  ↳ Much more efficient than loading all posts and counting them in PHP",
        np: "`withCount('posts')` ले `posts_count` attribute add — Post models load गर्दैन। List display को लागि।",
        jp: "`withCount('posts')` は `posts_count` 属性を追加しますが Post モデルはロードしません。「X 件の投稿」表示や `orderByDesc('posts_count')` による並び替えに最適です。",
      },
    },
    {
      question: {
        en: "How do observers differ from listening to model events directly in boot()?",
        np: "Observer र `boot()` direct event listener मा के फरक?",
        jp: "オブザーバと `boot()` での直接イベントリスニングの違いは？",
      },
      answer: {
        en: "Both approaches work the same way at runtime — the difference is about keeping your code clean.\n\n<b>Inline listeners in `boot()`</b>\n• Quick to write for one or two simple events\n  ↳ Can get hard to read when you stack up many event closures in one method\n\n<b>Observer class</b>\n• All event methods (creating, updating, deleting, etc.) live in one file\n  ↳ Easy to find, read, test independently, and temporarily disable during tests\n\nAs a rule of thumb: use an observer as soon as you have more than 2–3 model events, or when the event logic is more than a couple of lines.",
        np: "Runtime मा same। Observer ले सबै event एक file मा — test गर्न सजिलो। 2-3 events भन्दा बढी भए observer।",
        jp: "ランタイムでの動作は同じ。オブザーバは全イベントを 1 ファイルにまとめ、テストでのモックや一時的な無効化が容易です。イベントが 2〜3 件を超えたらオブザーバへ移しましょう。",
      },
    },
  ],
};
