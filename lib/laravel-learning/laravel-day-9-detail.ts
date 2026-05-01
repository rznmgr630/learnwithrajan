import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Eloquent relationships map database foreign-key joins into expressive PHP methods. **hasOne / hasMany** define the parent side; **belongsTo** defines the child. **belongsToMany** handles many-to-many through a pivot table. Relationships are lazy by default — they only query when accessed.",
      np: "Eloquent relationship ले FK joins PHP methods मा। hasOne/hasMany parent; belongsTo child; belongsToMany pivot।",
      jp: "Eloquent リレーションは外部キー結合を PHP メソッドで表現します。hasOne/hasMany が親側、belongsTo が子側、belongsToMany が多対多のピボットです。",
    },
    {
      en: "The **N+1 problem** — accidentally firing one SQL query per related model — is the most common Eloquent performance pitfall. Solve it with `with()` (eager loading). **Soft deletes** mark records as deleted without physically removing rows, enabling `restore()` and audit trails. **Observers** centralize model event logic out of controllers.",
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
            en: "By convention Laravel infers the foreign key from the model name (e.g., `user_id` for `User`). You can override it by passing explicit arguments to the relation method. `belongsTo` can also use `withDefault()` to return a stub model instead of `null` when the foreign key is missing.",
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
            en: "**hasOneThrough** and **hasManyThrough** let you reach models across two foreign keys without a direct relationship. The classic example: a `Country` hasMany `User`s, and each `User` hasMany `Post`s — `Country` can access `Post`s through `User`s without a direct FK.",
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
            en: "**Polymorphic relations** allow a single relationship to connect one model to multiple target model types. The classic use case: `Comment` can belong to either `Post` or `Video`. The `commentable_type` column stores the target model class, `commentable_id` stores the target ID.",
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
            en: "The **N+1 problem** occurs when you iterate over a collection and access a lazy relationship inside the loop — Laravel fires 1 query to get the parent records, then N more (one per parent) to get each child. **Eager loading** with `with()` replaces the N queries with a single `WHERE IN (...)` query.",
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
            en: "The `SoftDeletes` trait adds a `deleted_at` timestamp instead of physically deleting the row. All normal queries automatically filter out soft-deleted records (`WHERE deleted_at IS NULL`). Use `withTrashed()` to include them, `onlyTrashed()` to show only deleted records, and `restore()` to undelete.",
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
            en: "**Model events** fire at defined lifecycle points: `creating`, `created`, `updating`, `updated`, `saving`, `saved`, `deleting`, `deleted`, `restoring`, `restored`. Listen inline in `boot()` for simple cases, or create a dedicated **observer** class for more complex logic.",
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
        en: "Laravel uses the snake_case model name plus `_id`. For `belongsTo(User::class)` it expects `user_id`. For `hasMany(Post::class)` defined on a `User` model it expects `user_id` on the `posts` table. Override by passing the second argument: `$this->belongsTo(User::class, 'author_id')`. The third argument overrides the local key (usually `id`).",
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
        en: "Pass the table name as the second argument to `belongsToMany()`: `return $this->belongsToMany(Role::class, 'user_role_assignments')`. You can also override both foreign key columns as the third and fourth arguments: `$this->belongsToMany(Role::class, 'user_role_assignments', 'member_id', 'permission_id')`.",
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
        en: "Use `whereHas()` to require that at least one related record matches a condition: `Post::whereHas('comments', fn ($q) => $q->where('approved', true))->get()`. Use `whereDoesntHave()` for the inverse. For counting, `withCount()` adds a `_count` attribute without loading the relation. `has('comments', '>=', 3)` matches models with at least 3 related records.",
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
        en: "`User::withCount('posts')->get()` adds a `posts_count` integer attribute to each User without loading the actual Post models — the count is done as a subquery or aggregate in the SQL. Use it whenever you need to display \"X posts\" in a list without needing the post data itself, or to sort users by their post count with `->orderByDesc('posts_count')`.",
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
        en: "Both work identically at runtime. The difference is **organisation**: inline closures in `boot()` keep the logic close to the model definition but become messy with multiple events. An observer class groups all event methods in one file, making it easy to register, mock in tests, and disable temporarily. Prefer observers when you have more than 2–3 model events.",
        np: "Runtime मा same। Observer ले सबै event एक file मा — test गर्न सजिलो। 2-3 events भन्दा बढी भए observer।",
        jp: "ランタイムでの動作は同じ。オブザーバは全イベントを 1 ファイルにまとめ、テストでのモックや一時的な無効化が容易です。イベントが 2〜3 件を超えたらオブザーバへ移しましょう。",
      },
    },
  ],
};
