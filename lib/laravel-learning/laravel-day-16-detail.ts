import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_16_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Eloquent has <b>magic features</b> beyond basic CRUD — think of it as a smart filing clerk.\n\nThis clerk can:\n• <b>Reformat documents</b> as they're filed or retrieved (<b>accessors</b> and <b>mutators</b>)\n• <b>Apply automatic labels</b> to every document that enters the system (<b>casts</b>)\n• <b>Save pre-built search filters</b> you can reuse any time (<b>scopes</b>)\n• <b>File documents</b> that could belong to any department — posts, videos, or products (<b>polymorphic relations</b>)\n• <b>Watch for changes</b> and react automatically (<b>observers</b>)\n\nToday we go beyond `find()`, `create()`, and `where()` — and unlock the full power of Eloquent.",
      np: "Eloquent का advanced features: accessors, mutators, casts, scopes, polymorphic relations र observers।",
      jp: "Eloquent の高度な機能 — アクセサ・キャスト・スコープ・ポリモーフィック・オブザーバを学びます。",
    },
    {
      en: "Here is what we cover today:\n\n• <b>Accessors</b> — transform data as it is <b>READ</b> from the model (e.g. combine `first_name` + `last_name` into `full_name`)\n  ↳ The DB stores them separately; your code sees one tidy attribute\n• <b>Mutators</b> — transform data as it is <b>WRITTEN</b> to the model (e.g. always lowercase email before saving)\n  ↳ Great for normalising input so your DB stays consistent\n• <b>Casts</b> — auto-convert column values (JSON string ↔ PHP array, `0`/`1` ↔ boolean, timestamp ↔ Carbon date)\n  ↳ Define once in `$casts`; Eloquent handles conversion on every read and write\n• <b>Local scopes</b> — reusable named query fragments like `scopePublished()` that you chain fluently\n• <b>Global scopes</b> — filters that apply to EVERY query on a model automatically\n• <b>Polymorphic relations</b> — one `comments` table that works for posts, videos, products, and more\n• <b>Observers</b> — centralised event handlers that fire when models are created, updated, or deleted",
      np: "Accessors (read), mutators (write), casts (type conversion), local/global scopes, polymorphic relations, observers।",
      jp: "アクセサ・ミューテタ・キャスト・スコープ・ポリモーフィック・オブザーバを順に解説します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Accessors & mutators (new attribute syntax)",
        np: "Accessors र mutators",
        jp: "アクセサとミューテタ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The <b>old way</b> (Laravel 8 and below) required two separate methods:\n• `getFirstNameAttribute()` — called when you READ the attribute\n• `setFirstNameAttribute($value)` — called when you WRITE the attribute\n\nAnalogy: two separate post-office windows — one labelled <b>IN</b>, one labelled <b>OUT</b>.\n\n<b>Laravel 9+ replaces both with a single `Attribute::make()` call.</b>\n• One computed property handles both directions\n• The `get:` closure runs on read; the `set:` closure runs on write\n  ↳ If you only need one direction, omit the other closure entirely\n\nThis is now the standard — use the new syntax for all new code.",
            np: "पुरानो: `getXAttribute()` / `setXAttribute()`। नयाँ (Laravel 9+): `Attribute::make(get:, set:)`।",
            jp: "旧来の get/set メソッドは Laravel 9+ で `Attribute::make()` に統一されました。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/Models/User.php — accessor, mutator & auto-hash mutator",
            np: "Accessor, mutator र auto-hash",
            jp: "アクセサ・ミューテタの例",
          },
          code: `<?php

use Illuminate\\Database\\Eloquent\\Casts\\Attribute;
use Illuminate\\Support\\Facades\\Hash;

class User extends Model
{
    // Accessor: combine first_name + last_name into a virtual attribute
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->first_name} {$this->last_name}",
        );
    }

    // Mutator: always store email as lowercase
    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => $value,
            set: fn (string $value) => strtolower($value),
        );
    }

    // Mutator only: auto-hash password on assignment
    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => Hash::make($value),
        );
    }
}

// Usage
$user = User::find(1);
echo $user->full_name;   // "Jane Doe"  ← accessor fires
$user->email = 'JANE@EXAMPLE.COM';  // stored as "jane@example.com"
$user->password = 'secret123';     // stored as hashed value`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Accessor vs database computed column — when to use each:</b>\n\n• <b>Use an accessor</b> when the transformation is cheap and you do not need to search/sort by the result in SQL\n  ↳ Examples: formatting a phone number for display, combining name parts, masking a card number\n• <b>Use a DB computed column</b> when you need to `WHERE`, `ORDER BY`, or index the result\n  ↳ Example: `full_name` as a stored generated column so `WHERE full_name LIKE '%Jane%'` uses an index\n\nAccessors are PHP-side — fast and free, but invisible to the database.",
            np: "Accessor = PHP-side transformation। DB computed column = SQL मा searchable।",
            jp: "アクセサは PHP 側の変換。SQL で検索したい場合は DB 計算列を使う。",
          },
        },
      ],
    },
    {
      title: {
        en: "Model casts — auto-converting column types",
        np: "Model casts",
        jp: "モデルキャスト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Think of casts as a <b>universal power adapter</b>.\n\nThe database stores data in its own formats: `1`/`0` for booleans, JSON strings for arrays, Unix timestamps for dates. Without casts, your PHP code would need to manually convert every time.\n\n<b>Casts declare the conversion once</b> in the `$casts` property — Eloquent handles the rest automatically on every read and write.\n\n• <b>`boolean`</b> — `0`/`1` in DB becomes `true`/`false` in PHP\n• <b>`array`</b> — JSON string in DB becomes PHP array (and back)\n• <b>`datetime`</b> — timestamp string becomes a Carbon object\n• <b>`encrypted`</b> — value is encrypted before saving, decrypted on read\n• <b>`AsCollection`</b> — like `array`, but returns a Laravel Collection\n  ↳ Collections have `map()`, `filter()`, `sum()`, etc. built in",
            np: "Casts: `boolean`, `array`, `datetime`, `encrypted`, `AsCollection` — DB format ↔ PHP format।",
            jp: "`$casts` で DB 型と PHP 型の変換を自動化。boolean・array・datetime・encrypted など。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/Models/Post.php — built-in casts + custom cast class",
            np: "Built-in casts र custom cast",
            jp: "組み込みキャストとカスタムキャスト",
          },
          code: `<?php

use Illuminate\\Database\\Eloquent\\Casts\\AsCollection;

class Post extends Model
{
    protected $casts = [
        'is_published' => 'boolean',        // 0/1 → true/false
        'metadata'     => 'array',          // JSON string → PHP array
        'settings'     => AsCollection::class, // JSON string → Collection
        'published_at' => 'datetime',       // string → Carbon
        'price'        => 'decimal:2',      // stored as string, precision 2
        'secret_token' => 'encrypted',      // auto encrypt/decrypt
    ];
}

// Custom cast class — for reusable type conversions
// app/Casts/Money.php
namespace App\\Casts;

use Illuminate\\Contracts\\Database\\Eloquent\\CastsAttributes;

class Money implements CastsAttributes
{
    public function get($model, $key, $value, $attributes): string
    {
        return '$' . number_format($value / 100, 2); // stored in cents
    }

    public function set($model, $key, $value, $attributes): int
    {
        return (int) ($value * 100); // convert dollars to cents for DB
    }
}

// In the model
protected $casts = [
    'price' => Money::class,
];

// Usage
$post->price = 19.99;   // stored as 1999 (cents)
echo $post->price;       // "$19.99"`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>`array` vs `AsCollection` — which one to pick:</b>\n\n• <b>`array`</b> — returns a plain PHP array. Use when you just need to read/write key-value data and don't need transformation methods.\n• <b>`AsCollection`</b> — returns a Laravel Collection object. Use when you want to call `->filter()`, `->map()`, `->sum()`, `->pluck()`, etc. on the data.\n\n↳ Both store the same JSON in the database — the difference is only what PHP hands you back on read.\n\nPro tip: add `->sortBy()` or `->groupBy()` to a Collection cast and your model method becomes a clean one-liner.",
            np: "`array` = PHP array। `AsCollection` = Laravel Collection (map, filter, etc.)।",
            jp: "`array` は PHP 配列、`AsCollection` は Collection — どちらも DB は JSON。",
          },
        },
      ],
    },
    {
      title: {
        en: "Local scopes — reusable query filters",
        np: "Local scopes",
        jp: "ローカルスコープ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>scope</b> is a saved, named query fragment — like a saved search in your email inbox.\n\nInstead of writing `->where('status', 'published')->where('published_at', '<=', now())` in every controller, you name it once as `scopePublished()` and chain it anywhere.\n\n<b>Two types of scopes:</b>\n• <b>Local scope</b> — opt-in, called explicitly: `Post::published()->get()`\n  ↳ Defined as a method prefixed with `scope` on the model\n  ↳ The `scope` prefix is stripped when you call it: `scopePublished()` → `->published()`\n• <b>Global scope</b> — automatic, applies to EVERY query on the model\n  ↳ Useful for multi-tenancy (always filter by `company_id`) or soft-deletes\n  ↳ Use sparingly — invisible filters make queries hard to debug",
            np: "Local scope = opt-in query fragment। Global scope = automatic filter on every query।",
            jp: "ローカルスコープは明示的に呼ぶ再利用可能フィルタ。グローバルスコープは全クエリに自動適用。",
          },
        },
        {
          type: "code",
          title: {
            en: "app/Models/Post.php — local scopes + global scope",
            np: "Local र global scope",
            jp: "ローカル・グローバルスコープ",
          },
          code: `<?php

use Illuminate\\Database\\Eloquent\\Builder;
use Illuminate\\Database\\Eloquent\\Model;

class Post extends Model
{
    // ── LOCAL SCOPES ──────────────────────────────────────────

    // No extra parameters
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at');
    }

    // With a required parameter
    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    // With an optional parameter (default value)
    public function scopeRecent(Builder $query, int $days = 30): Builder
    {
        return $query->where('published_at', '>=', now()->subDays($days));
    }

    // ── GLOBAL SCOPE ──────────────────────────────────────────
    protected static function booted(): void
    {
        // Always filter to the authenticated user's posts
        static::addGlobalScope('owner', function (Builder $query) {
            if (auth()->check()) {
                $query->where('user_id', auth()->id());
            }
        });
    }
}

// Chaining local scopes
$posts = Post::published()
             ->byUser(auth()->id())
             ->recent(7)
             ->orderByDesc('published_at')
             ->get();

// Removing a global scope when you need all posts (e.g. admin panel)
$allPosts = Post::withoutGlobalScope('owner')->get();`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Global scope gotcha — the invisible filter problem:</b>\n\nGlobal scopes are powerful but can surprise you:\n• A new developer calls `Post::all()` expecting every post — but only their posts come back\n  ↳ The global scope is invisible in the controller code\n• Unit tests may fail unexpectedly because no user is logged in and the scope returns nothing\n\n<b>Best practices:</b>\n• Name your global scope (second argument to `addGlobalScope`) so it can be removed with `withoutGlobalScope('name')`\n• Document global scopes prominently in the model's docblock\n• For multi-tenancy, consider a dedicated package (Tenancy for Laravel) instead of hand-rolled global scopes",
            np: "Global scope invisible हुन्छ — debug गाह्रो। नाम दिनुहोस् र document गर्नुहोस्।",
            jp: "グローバルスコープは見えないフィルタ — 名前付きで追加して `withoutGlobalScope` で除外可能。",
          },
        },
      ],
    },
    {
      title: {
        en: "Polymorphic relationships",
        np: "Polymorphic relationships",
        jp: "ポリモーフィックリレーション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Polymorphic</b> means \"many shapes.\" It solves a specific problem:\n\n<b>Problem:</b> You want `Comment` to belong to both `Post` and `Video`. Without polymorphic, you'd need:\n• A `post_comments` table with a `post_id` foreign key\n• A `video_comments` table with a `video_id` foreign key\n• Two separate models, two sets of routes, two sets of controllers\n\n<b>Solution:</b> One `comments` table with two special columns:\n• `commentable_id` — stores the ID of the parent (e.g. `42`)\n• `commentable_type` — stores the class name of the parent (e.g. `App\\Models\\Post`)\n\nLaravel's `morphTo()` and `morphMany()` handle the magic of knowing which table to join based on the `_type` column.\n\n↳ One table, one model, works with any number of parent types.",
            np: "Polymorphic = एउटै `comments` table जुन Post, Video, Product सबैमा काम गर्छ।",
            jp: "ポリモーフィックは 1 テーブルが複数の親モデルに属せる仕組み（`_id` + `_type` カラム）。",
          },
        },
        {
          type: "code",
          title: {
            en: "Migration + Comment model + Post & Video models",
            np: "Polymorphic migration र models",
            jp: "マイグレーションとモデルの実装",
          },
          code: `// database/migrations/create_comments_table.php
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->text('body');
    $table->morphs('commentable'); // creates commentable_id + commentable_type
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
});

// app/Models/Comment.php
class Comment extends Model
{
    protected $fillable = ['body', 'user_id'];

    // "I can belong to anything"
    public function commentable(): MorphTo
    {
        return $this->morphTo();
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

// Usage
$post->comments()->create(['body' => 'Great post!', 'user_id' => 1]);
$video->comments()->create(['body' => 'Nice video!', 'user_id' => 2]);

// Get the parent of a comment (either a Post or Video)
$comment = Comment::find(1);
$parent = $comment->commentable; // returns Post or Video instance`,
        },
        {
          type: "table",
          caption: {
            en: "Eloquent relationship cheat-sheet — pick the right one for your data shape",
            np: "Relationship cheat-sheet",
            jp: "リレーション早見表",
          },
          headers: [
            { en: "Relationship", np: "Relationship", jp: "リレーション" },
            { en: "Method", np: "Method", jp: "メソッド" },
            { en: "Use when…", np: "कहिले प्रयोग", jp: "使う場面" },
          ],
          rows: [
            [
              { en: "Has one", np: "Has one", jp: "hasOne" },
              { en: "`hasOne()`", np: "`hasOne()`", jp: "`hasOne()`" },
              { en: "User → one Profile", np: "User → एउटा Profile", jp: "User → 1つの Profile" },
            ],
            [
              { en: "Has many", np: "Has many", jp: "hasMany" },
              { en: "`hasMany()`", np: "`hasMany()`", jp: "`hasMany()`" },
              { en: "User → many Posts", np: "User → धेरै Posts", jp: "User → 複数の Post" },
            ],
            [
              { en: "Belongs to", np: "Belongs to", jp: "belongsTo" },
              { en: "`belongsTo()`", np: "`belongsTo()`", jp: "`belongsTo()`" },
              { en: "Post → one User (owner)", np: "Post → एउटा User", jp: "Post → 1つの User" },
            ],
            [
              { en: "Belongs to many", np: "Belongs to many", jp: "belongsToMany" },
              { en: "`belongsToMany()`", np: "`belongsToMany()`", jp: "`belongsToMany()`" },
              { en: "Post ↔ many Tags (pivot table)", np: "Post ↔ धेरै Tags", jp: "Post ↔ 複数の Tag（中間テーブル）" },
            ],
            [
              { en: "Morph to", np: "Morph to", jp: "morphTo" },
              { en: "`morphTo()`", np: "`morphTo()`", jp: "`morphTo()`" },
              { en: "Comment → Post OR Video", np: "Comment → Post वा Video", jp: "Comment → Post か Video" },
            ],
            [
              { en: "Morph many", np: "Morph many", jp: "morphMany" },
              { en: "`morphMany()`", np: "`morphMany()`", jp: "`morphMany()`" },
              { en: "Post → many Comments (poly)", np: "Post → धेरै Comments", jp: "Post → 複数の Comment（ポリ）" },
            ],
            [
              { en: "Morph to many", np: "Morph to many", jp: "morphToMany" },
              { en: "`morphToMany()`", np: "`morphToMany()`", jp: "`morphToMany()`" },
              { en: "Post/Video → shared Tags", np: "Post/Video → shared Tags", jp: "Post/Video → 共通 Tag" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Model observers — reacting to lifecycle events",
        np: "Model observers",
        jp: "モデルオブザーバ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "An <b>observer</b> is like a security camera for your model.\n\nWhenever something happens — a record is created, updated, or deleted — the observer fires the matching handler automatically. No manual calls in your controllers needed.\n\n<b>Without observers</b>, side-effects scatter across controllers:\n• `PostController::store()` sends a welcome notification\n• `PostController::update()` logs the change\n• `PostController::destroy()` deletes related files\n• If someone adds another way to create a post (a command, a seeder, an API), they must remember to add the side-effect too\n\n<b>With observers</b>, the side-effect logic lives in one place — if a post is created anywhere in the app, the observer fires.\n\n↳ Think of it as a pub/sub pattern built into Eloquent.",
            np: "Observer = model lifecycle events (created, updated, deleted) मा centralised reactions।",
            jp: "オブザーバはモデルの lifecycle イベントに対する一元的なハンドラ。",
          },
        },
        {
          type: "code",
          title: {
            en: "PostObserver — generate, implement, register",
            np: "PostObserver बनाउने र register गर्ने",
            jp: "PostObserver の生成・実装・登録",
          },
          code: `// Generate the observer class
php artisan make:observer PostObserver --model=Post

// app/Observers/PostObserver.php
namespace App\\Observers;

use App\\Models\\Post;
use Illuminate\\Support\\Facades\\Log;

class PostObserver
{
    public function created(Post $post): void
    {
        // Side-effect: notify the author's followers
        $post->user->notify(new PostPublishedNotification($post));
    }

    public function updating(Post $post): void
    {
        // Log who changed what (before the save)
        if ($post->isDirty('status')) {
            Log::info("Post #{$post->id} status changed", [
                'from' => $post->getOriginal('status'),
                'to'   => $post->status,
                'by'   => auth()->id(),
            ]);
        }
    }

    public function deleted(Post $post): void
    {
        // Clean up associated files when a post is deleted
        Storage::delete("posts/{$post->id}");
    }
}

// Register in AppServiceProvider::boot()
use App\\Models\\Post;
use App\\Observers\\PostObserver;

public function boot(): void
{
    Post::observe(PostObserver::class);
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Critical gotcha — bulk operations bypass observers:</b>\n\nObservers are Eloquent-level hooks. They fire when you call `->save()`, `->create()`, `->delete()` on a model instance. They do <b>NOT</b> fire for SQL-level bulk operations:\n\n• `Post::where('user_id', $id)->delete()` → NO observer\n• `Post::truncate()` → NO observer\n• `Post::insert([...])` → NO observer (also bypasses `$fillable`!)\n\n↳ If you need side-effects for bulk deletes, dispatch an event or job manually before/after the bulk query.\n\n↳ Available hooks: `creating`, `created`, `updating`, `updated`, `saving`, `saved`, `deleting`, `deleted`, `restoring`, `restored` (for soft-deletes).",
            np: "Bulk operations (`where()->delete()`, `truncate()`) ले observers trigger गर्दैन।",
            jp: "バルク操作（`where()->delete()` など）はオブザーバを発火しない点に注意。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use an accessor vs a plain getter method on the model?",
        np: "Accessor vs getter method — कहिले कुन?",
        jp: "アクセサとゲッターメソッドはどう使い分けますか？",
      },
      answer: {
        en: "<b>Use an accessor</b> when the value behaves like a natural attribute of the model:\n• It integrates with `$model->attribute_name` syntax automatically\n• It is included in `->toArray()` and JSON serialisation\n• Example: `full_name`, `avatar_url`, `formatted_price`\n\n<b>Use a plain method</b> when the operation reads like an action or requires parameters:\n• `$model->getFormattedAddress($format)` — takes a parameter\n• `$model->calculateTax($rate)` — performs a calculation, not just reading data\n• It's clearer that calling it has intent, not just property access\n\nRule of thumb: if you'd describe it as \"the model's X\", use an accessor. If you'd describe it as \"getting the model's X given Y\", use a method.",
        np: "Accessor = attribute-like value (toArray मा पनि)। Method = parameter लिने वा calculation गर्ने।",
        jp: "属性のように扱うならアクセサ、引数や計算が必要ならメソッドが適切。",
      },
    },
    {
      question: {
        en: "What is the difference between `$casts` and `$dates`?",
        np: "`$casts` र `$dates` को फरक?",
        jp: "`$casts` と `$dates` の違いは？",
      },
      answer: {
        en: "`$dates` is the <b>old way</b> to tell Eloquent \"cast this column to a Carbon instance.\" It is <b>deprecated as of Laravel 10</b> and will be removed in a future version.\n\n<b>Always use `$casts` for new code:</b>\n• `'published_at' => 'datetime'` → Carbon (mutable)\n• `'published_at' => 'immutable_datetime'` → CarbonImmutable (preferred — mutations return a new instance)\n• `'created_at'` and `'updated_at'` are automatically cast to Carbon by Eloquent — no entry needed\n\n↳ `immutable_datetime` is safer in pipelines because you can't accidentally mutate the original value.",
        np: "`$dates` deprecated छ। `$casts` मा `datetime` वा `immutable_datetime` प्रयोग गर्नुहोस्।",
        jp: "`$dates` は非推奨。`$casts` で `datetime` または `immutable_datetime` を使用する。",
      },
    },
    {
      question: {
        en: "Can local scopes conflict with each other when chained?",
        np: "Chained scopes conflict हुन्छन् कि?",
        jp: "スコープをチェーンするとき競合しますか？",
      },
      answer: {
        en: "No — local scopes are just query builder calls under the hood, and query builder calls stack cleanly. Each scope adds its `WHERE` clause to the same underlying query.\n\nThe only potential conflict is if <b>two global scopes</b> filter the same column with incompatible conditions:\n• Global scope A: `->where('status', 'published')`\n• Global scope B: `->where('status', 'draft')`\n→ Both apply; the query returns no results (impossible condition)\n\nFix: remove the conflicting scope with `withoutGlobalScope(MyScope::class)` or `withoutGlobalScopes()` (removes all).\n\nFor local scopes, the only thing to watch is ordering — `scopeRecent()` using `orderBy` after another `orderBy` can produce surprising results. Use `reorder()` to clear previous orderings first.",
        np: "Local scopes stack cleanly। Global scopes same column filter गर्छन् भने conflict हुन सक्छ।",
        jp: "ローカルスコープはスタックで問題なし。グローバルスコープ同士が同列を競合する場合は `withoutGlobalScope` で除外。",
      },
    },
    {
      question: {
        en: "What is a polymorphic many-to-many relationship?",
        np: "Polymorphic many-to-many भनेको के हो?",
        jp: "ポリモーフィック多対多とは？",
      },
      answer: {
        en: "A regular `belongsToMany` links <b>two specific models</b> via a pivot table (e.g. `Post` ↔ `Tag`).\n\nA <b>polymorphic many-to-many</b> lets a model relate to <b>multiple different model types</b> via a single pivot table.\n\nExample: `Tag` can belong to both `Post` AND `Video`:\n• Migration: `taggables` pivot with `tag_id`, `taggable_id`, `taggable_type`\n• `Tag` model: `morphedByMany(Post::class, 'taggable')` and `morphedByMany(Video::class, 'taggable')`\n• `Post` and `Video` models: `morphToMany(Tag::class, 'taggable')`\n\nOne `tags` table, one `taggables` pivot — works for any model that needs tags.",
        np: "Polymorphic many-to-many: Tag ले Post र Video दुवैमा belongsToMany हुन्छ।",
        jp: "ポリモーフィック多対多は 1 つのピボットテーブルで複数モデルと多対多を実現（例: Tag ↔ Post/Video）。",
      },
    },
    {
      question: {
        en: "Do model observers run inside database transactions?",
        np: "Observers DB transaction भित्र fire हुन्छन् कि?",
        jp: "オブザーバはトランザクション内で実行されますか？",
      },
      answer: {
        en: "Yes — and this can cause a subtle bug.\n\nIf you run a save inside a `DB::transaction()` and the transaction is <b>rolled back</b>, the `created`/`updated` event has already fired and your observer's side-effects have already happened:\n• Email sent to user → cannot be unsent\n• File written to disk → file is now orphaned\n\n<b>Two solutions:</b>\n1. Use `DB::afterCommit()` to delay the observer logic until after a successful commit\n2. Set `public bool $afterCommit = true` on any listener/job dispatched from the observer — queued jobs won't dispatch until the transaction commits\n\n↳ For simple apps without transactions, this is a non-issue. For financial or critical data, always use the `$afterCommit` flag.",
        np: "Transaction rollback हुँदा observer पहिल्यै fire भइसकेको हुन्छ। `$afterCommit = true` प्रयोग गर्नुहोस्।",
        jp: "ロールバック後もオブザーバは発火済み。`$afterCommit = true` でコミット後のみ実行できる。",
      },
    },
  ],
};
