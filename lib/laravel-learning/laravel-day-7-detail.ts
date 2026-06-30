import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Think of your database as a shared document your whole team edits — without version control, one developer adds a column manually and everyone else's app breaks.\n\n<b>Migrations</b> solve this: they are PHP files that describe a database change, so the whole team stays in sync by running `php artisan migrate`.\n\n• <b>Seeders</b> fill the database with test or static data (admin accounts, country lists)\n  ↳ Run with `php artisan db:seed`\n• <b>Factories</b> generate realistic fake data using the Faker library\n  ↳ Perfect for development and testing — create 100 posts in a single line of code",
      np: "Migration database schema को version control। Seeder/Factory ले dev data तयार।",
      jp: "マイグレーション はスキーマをバージョン管理します。Seeder・Factory と組み合わせて開発環境を一コマンドで再現できます。",
    },
    {
      en: "Laravel gives you two ways to query the database, both powered by PDO under the hood.\n\n• <b>Query Builder</b> (`DB::table()`) — returns plain arrays or objects, no overhead\n  ↳ Great for raw aggregations, reports, or tables without a model\n• <b>Eloquent ORM</b> — returns model instances with built-in superpowers: relationships, casting, scopes, soft deletes, and more\n  ↳ The default choice for most application code\n\nRule of thumb: use Eloquent by default. Only switch to the Query Builder when you need a performance-critical aggregate and don't want the overhead of hydrating model objects.",
      np: "Eloquent ORM र Query Builder दुवै PDO मा। Eloquent ले casting, relationship, scope थप्छ।",
      jp: "Eloquent は PDO 上に ORM 機能を追加。キャスト・リレーション・スコープなどが使えます。集計だけのクエリはクエリビルダで十分です。",
    },
  ],
  sections: [
    {
      title: {
        en: "Migrations & schema design",
        np: "Migration र Schema डिजाइन",
        jp: "マイグレーションとスキーマ設計",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Imagine your database schema as source code — migrations are its commit history.\n\n• Use `php artisan make:migration create_posts_table` to create a new migration file\n  ↳ Laravel infers whether it's a `create` or `alter` operation from the name you give it\n• The `up()` method applies the change (add a table, add a column)\n• The `down()` method reverses it exactly — this is what `migrate:rollback` uses\n  ↳ Golden rule: <b>never edit a migration that has already been run in production</b> — create a new one instead",
            np: "`up()` ले apply गर्छ; `down()` ले reverse। Production मा run भएको migration नबदल्नुस्।",
            jp: "`up()` で適用・`down()` で巻き戻し。本番で実行済みのマイグレーションは絶対に編集せず、新しいマイグレーションを追加してください。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create and write a migration",
            np: "Migration बनाउनु र लेख्नु",
            jp: "マイグレーションの生成と記述",
          },
          code: `# Create migration (Laravel infers create vs alter from the name)
php artisan make:migration create_posts_table
php artisan make:migration add_published_at_to_posts_table

// database/migrations/xxxx_create_posts_table.php
<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();                                    // BIGINT UNSIGNED AUTO_INCREMENT PK
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');                         // VARCHAR(255)
            $table->string('slug')->unique();
            $table->text('body');
            $table->string('excerpt', 500)->nullable();
            $table->integer('views')->unsigned()->default(0);
            $table->decimal('price', 8, 2)->nullable();
            $table->boolean('is_published')->default(false);
            $table->json('meta')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();                           // deleted_at TIMESTAMP NULL
            $table->timestamps();                            // created_at + updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};

# Run, rollback, and reset
php artisan migrate
php artisan migrate:rollback          # undo last batch
php artisan migrate:rollback --step=3 # undo last 3 batches
php artisan migrate:fresh             # drop ALL tables, re-run from scratch
php artisan migrate:fresh --seed      # + run seeders`,
        },
        {
          type: "table",
          caption: {
            en: "Common column types",
            np: "सामान्य column types",
            jp: "よく使うカラム型",
          },
          headers: [
            { en: "Method", np: "Method", jp: "メソッド" },
            { en: "SQL type", np: "SQL type", jp: "SQL 型" },
            { en: "Common use", np: "प्रयोग", jp: "用途" },
          ],
          rows: [
            [
              { en: "`$table->id()`", np: "`id()`", jp: "`id()`" },
              { en: "BIGINT UNSIGNED PK AI", np: "BIGINT PK", jp: "BIGINT PK AI" },
              { en: "Primary key", np: "PK", jp: "主キー" },
            ],
            [
              { en: "`string('col', 100)`", np: "`string()`", jp: "`string()`" },
              { en: "VARCHAR(n)", np: "VARCHAR", jp: "VARCHAR" },
              { en: "Short text, names", np: "छोटो text", jp: "短いテキスト" },
            ],
            [
              { en: "`text()` / `longText()`", np: "`text()`", jp: "`text()`" },
              { en: "TEXT / LONGTEXT", np: "TEXT", jp: "TEXT / LONGTEXT" },
              { en: "Long content, articles", np: "लामो content", jp: "長文コンテンツ" },
            ],
            [
              { en: "`integer()` / `bigInteger()`", np: "`integer()`", jp: "`integer()`" },
              { en: "INT / BIGINT", np: "INT", jp: "INT / BIGINT" },
              { en: "Counts, IDs", np: "संख्या", jp: "数値・ID" },
            ],
            [
              { en: "`decimal('col', 8, 2)`", np: "`decimal()`", jp: "`decimal()`" },
              { en: "DECIMAL(8,2)", np: "DECIMAL", jp: "DECIMAL" },
              { en: "Currency / prices", np: "मूल्य", jp: "金額・価格" },
            ],
            [
              { en: "`boolean()`", np: "`boolean()`", jp: "`boolean()`" },
              { en: "TINYINT(1)", np: "TINYINT(1)", jp: "TINYINT(1)" },
              { en: "Flags, toggles", np: "flag", jp: "フラグ" },
            ],
            [
              { en: "`json()`", np: "`json()`", jp: "`json()`" },
              { en: "JSON", np: "JSON", jp: "JSON" },
              { en: "Flexible attributes, settings", np: "लचिलो attribute", jp: "柔軟な属性・設定" },
            ],
            [
              { en: "`foreignId('x_id')->constrained()`", np: "`foreignId()`", jp: "`foreignId()`" },
              { en: "BIGINT UNSIGNED FK", np: "FK", jp: "外部キー" },
              { en: "Relation to parent table", np: "सम्बन्ध", jp: "親テーブルへの参照" },
            ],
            [
              { en: "`softDeletes()`", np: "`softDeletes()`", jp: "`softDeletes()`" },
              { en: "TIMESTAMP NULL", np: "TIMESTAMP NULL", jp: "TIMESTAMP NULL" },
              { en: "Soft delete timestamp column", np: "soft delete", jp: "ソフトデリート列" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Factories & Seeders",
        np: "Factory र Seeder",
        jp: "ファクトリとシーダー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every developer on your team needs test data — factories and seeders make this reproducible with a single command.\n\n• <b>Factories</b> describe how to generate a fake version of a model using the Faker library\n  ↳ Define once in `database/factories/`, use anywhere in tests or seeders\n• <b>Seeders</b> call factories (or insert static data) and are the entry point for `php artisan db:seed`\n  ↳ The `DatabaseSeeder` class calls all other seeders in order\n\nEnd result: any developer can run `php artisan migrate:fresh --seed` and get a fully populated database identical to everyone else's.",
            np: "Factory ले Faker द्वारा fake data। Seeder ले factory call गर्छ; DatabaseSeeder सबैको entry point।",
            jp: "ファクトリは Faker でモデルの偽データを生成。シーダーがファクトリを呼び出し、`DatabaseSeeder` で一括実行します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create and define a Factory",
            np: "Factory बनाउनु",
            jp: "ファクトリの生成と定義",
          },
          code: `php artisan make:model Post -mf   # model + migration + factory in one command
php artisan make:factory PostFactory --model=Post

// database/factories/PostFactory.php
<?php

namespace Database\\Factories;

use App\\Models\\User;
use Illuminate\\Database\\Eloquent\\Factories\\Factory;
use Illuminate\\Support\\Str;

class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'user_id'      => User::factory(),          // creates a related user
            'title'        => $title,
            'slug'         => Str::slug($title),
            'body'         => fake()->paragraphs(4, true),
            'excerpt'      => fake()->sentence(20),
            'is_published' => fake()->boolean(70),       // 70% chance true
            'views'        => fake()->numberBetween(0, 10000),
            'status'       => fake()->randomElement(['draft', 'published']),
            'published_at' => fake()->optional()->dateTimeThisYear(),
        ];
    }

    // Named state: Post::factory()->draft()->create()
    public function draft(): static
    {
        return $this->state(['status' => 'draft', 'is_published' => false]);
    }
}`,
        },
        {
          type: "code",
          title: {
            en: "Seeders & running factories",
            np: "Seeder र factory चलाउनु",
            jp: "シーダーとファクトリの実行",
          },
          code: `php artisan make:seeder PostSeeder

// database/seeders/PostSeeder.php
<?php

namespace Database\\Seeders;

use App\\Models\\Post;
use App\\Models\\User;
use Illuminate\\Database\\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        // 5 users, each with 10 posts
        User::factory(5)->has(Post::factory(10))->create();

        // Posts for an existing user
        $user = User::first();
        Post::factory(50)->for($user)->create();

        // Specific post with overrides
        Post::factory()->draft()->create([
            'title'   => 'Hello World',
            'user_id' => $user->id,
        ]);
    }
}

// database/seeders/DatabaseSeeder.php
public function run(): void
{
    $this->call([PostSeeder::class]);
}

# Run seeders
php artisan db:seed
php artisan db:seed --class=PostSeeder
php artisan migrate:fresh --seed    # fresh DB + all seeders`,
        },
      ],
    },
    {
      title: {
        en: "Query Builder & Eloquent queries",
        np: "Query Builder र Eloquent queries",
        jp: "クエリビルダと Eloquent クエリ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The key difference between the two is what you get back.\n\n• <b>Query Builder</b> returns plain arrays or `stdClass` objects — fast, lightweight, no overhead\n  ↳ Great for raw aggregations, reports, or when you don't need model methods\n• <b>Eloquent</b> returns full model instances — you can call relationships, use scopes, fire events\n  ↳ This process is called \"hydration\" — wrapping a database row into a PHP object\n\n<b>Local scopes</b> let you name common query conditions and chain them naturally:\n• Define `scopePublished($query)` on the model\n  ↳ Call it as `Post::published()->latest()->get()` — reads like plain English",
            np: "Query Builder ले plain array; Eloquent ले model instance। Local scope ले common constraint मा नाम।",
            jp: "クエリビルダは配列・`stdClass`、Eloquent はモデルインスタンスを返します。ローカルスコープで共通クエリ条件に名前を付けられます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Query Builder — filtering, aggregates, joins",
            np: "Query Builder उदाहरण",
            jp: "クエリビルダの使用例",
          },
          code: `use Illuminate\\Support\\Facades\\DB;

// Basic select + where
$users = DB::table('users')
    ->select('id', 'name', 'email')
    ->where('active', 1)
    ->where('age', '>=', 18)
    ->orWhere('is_admin', true)
    ->whereIn('role', ['editor', 'author'])
    ->whereBetween('created_at', [now()->subDays(30), now()])
    ->whereNotNull('email_verified_at')
    ->orderBy('name')
    ->limit(50)
    ->get();

// Aggregates
$count = DB::table('posts')->where('is_published', true)->count();
$total = DB::table('orders')->sum('amount');
$avg   = DB::table('reviews')->avg('rating');
$max   = DB::table('orders')->max('amount');

// Group by + having
DB::table('orders')
    ->select('user_id', DB::raw('SUM(amount) as total'))
    ->groupBy('user_id')
    ->having('total', '>', 1000)
    ->get();

// Joins
DB::table('posts')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->leftJoin('categories', 'posts.category_id', '=', 'categories.id')
    ->select('posts.*', 'users.name as author', 'categories.name as category')
    ->get();

// Chunking (avoids memory exhaustion on huge tables)
DB::table('users')->orderBy('id')->chunk(500, function ($users) {
    foreach ($users as $user) { /* process */ }
});`,
        },
        {
          type: "code",
          title: {
            en: "Eloquent CRUD & model configuration",
            np: "Eloquent CRUD र model config",
            jp: "Eloquent の CRUD とモデル設定",
          },
          code: `// app/Models/Post.php
<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Casts\\Attribute;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    // Mass-assignment whitelist (preferred)
    protected $fillable = ['title', 'slug', 'body', 'user_id', 'status', 'published_at'];

    // Attribute casting — automatic type conversion on get/set
    protected $casts = [
        'is_published'  => 'boolean',
        'meta'          => 'array',     // JSON column <-> PHP array
        'published_at'  => 'datetime',
        'price'         => 'decimal:2',
    ];

    protected $hidden  = ['deleted_at'];
    protected $appends = ['reading_time'];

    // Accessor (Laravel 9+ syntax)
    protected function readingTime(): Attribute
    {
        return Attribute::get(
            fn () => ceil(str_word_count($this->body) / 200) . ' min'
        );
    }

    // Local scope
    public function scopePublished($query): void
    {
        $query->where('status', 'published')->whereNotNull('published_at');
    }
}

// ---- CRUD operations ----
$post  = Post::create(['title' => 'Hello', 'slug' => 'hello', 'body' => '...', 'user_id' => 1]);
$post  = Post::find(1);                          // null if missing
$post  = Post::findOrFail(1);                    // 404 if missing
$posts = Post::where('status', 'published')->orderByDesc('published_at')->get();
$post  = Post::firstOrCreate(['slug' => 'hello'], ['title' => 'Hello', 'body' => '...']);
$post  = Post::updateOrCreate(['slug' => 'hello'], ['title' => 'Updated']);
$post->update(['title' => 'New Title']);
$post->delete();           // soft delete (SoftDeletes trait)
Post::destroy([1, 2, 3]);  // delete by primary keys

// Scope chaining
$posts = Post::published()->orderByDesc('published_at')->paginate(10);`,
        },
        {
          type: "diagram",
          id: "laravel-eloquent-query",
        },
      ],
    },
    {
      title: {
        en: "Pagination & scopes",
        np: "Pagination र Scope",
        jp: "ページネーションとスコープ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Pagination splits a large result set into pages — without it, fetching 100,000 posts at once would exhaust your server's memory.\n\nLaravel gives you three flavors:\n• <b>`paginate(15)`</b> — runs a `COUNT(*)` query to know the total, gives you full page metadata (first, last, total)\n  ↳ Best for traditional \"Page 2 of 14\" style navigation\n• <b>`simplePaginate(15)`</b> — skips the count query, only knows \"previous\" and \"next\"\n  ↳ Faster for huge tables where the total page count doesn't matter\n• <b>`cursorPaginate(20)`</b> — uses an opaque cursor token instead of page numbers, ideal for infinite scroll\n  ↳ The most performant option for real-time feeds and APIs",
            np: "`paginate()` COUNT सहित; `simplePaginate()` prev/next; `cursorPaginate()` cursor — infinite scroll।",
            jp: "`paginate()` は COUNT 付き全ページ情報。`simplePaginate()` は前後のみ。`cursorPaginate()` はカーソルベースで大規模データに最適です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Pagination variants",
            np: "Pagination उदाहरण",
            jp: "ページネーションの使い方",
          },
          code: `// Full pagination (includes total count + page links)
$posts = Post::published()->latest()->paginate(15);

// Simple (no count query — faster on huge tables)
$posts = Post::published()->simplePaginate(15);

// Cursor pagination (for infinite scroll / APIs)
$posts = Post::published()->orderBy('id')->cursorPaginate(20);

// Blade: renders Bootstrap or Tailwind links automatically
{{ $posts->links() }}

// Preserve all current GET query parameters in pagination links
{{ $posts->withQueryString()->links() }}

// API controller — JSON response includes pagination meta automatically
return response()->json($posts);
// JSON shape: { data: [...], current_page, last_page, per_page, total, next_page_url, ... }`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `migrate:fresh` and `migrate:rollback`?",
        np: "`migrate:fresh` र `migrate:rollback` मा के फरक?",
        jp: "`migrate:fresh` と `migrate:rollback` はどう違いますか？",
      },
      answer: {
        en: "These two are very different — don't confuse them.\n\n• <b>`migrate:rollback`</b> reverses only the <b>last batch</b> of migrations by calling their `down()` methods\n  ↳ Your data is preserved wherever possible\n  ↳ Safe to use on staging and production\n• <b>`migrate:fresh`</b> drops <b>every single table</b> in the database (skipping `down()`) then re-runs all migrations from scratch\n  ↳ All data is permanently destroyed\n  ↳ Only use this in local development\n\nRule: use `migrate:fresh --seed` for local dev; use `migrate` or `migrate:rollback` everywhere else.",
        np: "`rollback` ले last batch undo; `fresh` ले सबै drop गरेर re-run। Production मा `fresh` नगर्नुस्।",
        jp: "`rollback` は最新バッチだけ `down()` で巻き戻し。`fresh` は全テーブルをドロップしてゼロから再実行。本番では `fresh` は使いません。",
      },
    },
    {
      question: {
        en: "What does `$fillable` protect against?",
        np: "`$fillable` ले के बचाउँछ?",
        jp: "`$fillable` は何を防ぎますか？",
      },
      answer: {
        en: "`$fillable` protects against a security attack called <b>mass assignment</b>.\n\nHere's the problem: if you write `User::create($request->all())` without `$fillable`, a malicious user can POST `is_admin=true` in a form and it silently gets saved to the database.\n\n• `$fillable` is a whitelist — only the listed columns can be filled via `create()` or `fill()`\n  ↳ Everything not listed is silently ignored, not rejected with an error\n• `$guarded = []` disables protection entirely\n  ↳ Only safe for internal CLI-only models that never touch user input",
        np: "Mass-assignment attack रोक्छ — `is_admin=true` submit भए। `$fillable` ले allowed columns मात्र accept।",
        jp: "大量代入の脆弱性を防ぎます。`$fillable` がないと `is_admin=true` のようなフォーム改ざんが通ってしまいます。`$guarded = []` は保護を完全に無効化するため注意が必要です。",
      },
    },
    {
      question: {
        en: "When should I use `firstOrCreate` versus `updateOrCreate`?",
        np: "`firstOrCreate` बनाम `updateOrCreate` कहिले?",
        jp: "`firstOrCreate` と `updateOrCreate` の使い分けは？",
      },
      answer: {
        en: "Both do \"find or create\" — the difference is what happens when the record already exists.\n\n• <b>`firstOrCreate(['slug' => 'hello'], $attributes)`</b>\n  ↳ Finds the record and returns it unchanged if found — <b>never updates</b>\n  ↳ Use for idempotent inserts (e.g. registering an OAuth provider for the first time)\n• <b>`updateOrCreate(['slug' => 'hello'], $newAttributes)`</b>\n  ↳ Finds the record, then <b>updates it</b> with the second array if it already exists\n  ↳ Use when syncing data from an external source (e.g. importing a CSV file)",
        np: "`firstOrCreate`: नभए create, छ भने unchanged। `updateOrCreate`: नभए create, छ भने update।",
        jp: "`firstOrCreate` は存在しなければ作成するだけ。`updateOrCreate` は存在する場合も第 2 配列で更新します。CSV インポートなど同期処理には `updateOrCreate`、OAuth 登録などには `firstOrCreate` が典型的です。",
      },
    },
    {
      question: {
        en: "How do I query JSON columns in Eloquent?",
        np: "JSON column कसरी query गर्ने?",
        jp: "JSON カラムをどうクエリしますか？",
      },
      answer: {
        en: "Laravel supports querying inside JSON columns using an arrow `->` notation inside `where()`.\n\n• `Post::where('meta->color', 'red')->get()` — query a top-level JSON key\n• `Post::where('meta->settings->theme', 'dark')` — query nested keys\n  ↳ Works on MySQL 5.7+, PostgreSQL, and SQLite 3.38+\n\nFor PHP-side access, cast the column as `'array'` in `$casts`, then access it like a normal PHP array: `$post->meta['color']`.",
        np: "`->where('meta->color', 'red')` arrow notation। `$casts` मा `'array'` cast।",
        jp: "`where('meta->color', 'red')` のように `->` で JSON パスを指定。`$casts` に `'array'` を設定すると PHP 側で配列として扱えます。",
      },
    },
    {
      question: {
        en: "What are Eloquent observers and when should I use them?",
        np: "Eloquent observer के हो र कहिले प्रयोग गर्ने?",
        jp: "Eloquent オブザーバとはいつ使いますか？",
      },
      answer: {
        en: "An <b>observer</b> is a class that groups all the lifecycle event hooks for a single model in one place.\n\nModels fire events at key moments: `creating`, `created`, `updating`, `updated`, `deleting`, `deleted`, `restored`.\n\n• Without an observer: you scatter these hooks across model `boot()` methods, service providers, or controllers\n• With an observer: all of a model's event logic lives in one clean class\n  ↳ Register it with `Post::observe(PostObserver::class)` in a service provider\n\nWhen to use one: if a model's event logic grows beyond a few lines, move it to an observer. For a single one-liner, an inline closure in `boot()` is perfectly fine.",
        np: "Observer ले model event listeners एक class मा। `Post::observe(PostObserver::class)` गरेर register।",
        jp: "オブザーバは `creating`・`updated` などのモデルイベントをまとめたクラスです。ロジックが複数行になったらオブザーバに移しましょう。",
      },
    },
    {
      question: {
        en: "How do I add an index to an existing column without re-creating the table?",
        np: "Existing column मा index थप्ने?",
        jp: "既存カラムにインデックスを追加するには？",
      },
      answer: {
        en: "Create a new migration that modifies the existing table — never edit the original migration once it has been run.\n\nInside the new migration's `up()` method use `Schema::table()` (not `Schema::create()`): `$table->index('slug')` for a regular index, `$table->unique('email')` for a unique index, or `$table->index(['user_id', 'status'])` for a composite index.\n\n• A <b>composite index</b> on columns you always filter together (e.g. `WHERE user_id = 1 AND status = 'published'`) is far faster than two separate single-column indexes\n  ↳ The order of columns in a composite index matters — put the most selective column first",
        np: "नयाँ migration मा `Schema::table` → `->index()` वा `->unique()`। Original migration नबदल्नुस्।",
        jp: "新しいマイグレーションで `Schema::table` を使い `->index()` / `->unique()` を追加します。既存のマイグレーションは変更しません。複合インデックスは複数列でフィルタするクエリを大幅に高速化します。",
      },
    },
  ],
};
