import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Laravel** is an opinionated PHP **MVC framework** created by Taylor Otwell. It ships with routing, an ORM (Eloquent), a queue system, a CLI (Artisan), and more—so you spend time on features, not wiring. Laravel 10/11 requires PHP 8.1+ and Composer 2.",
      np: "Laravel PHP MVC फ्रेमवर्क हो — Taylor Otwell ले बनाएका। routing, ORM, queue, CLI सब built-in।",
      jp: "Laravel は Taylor Otwell が作成した PHP の **MVC フレームワーク**。ルーティング・ORM・キューなどが揃っています。",
    },
    {
      en: "**Laravel 11** introduced a slimmed-down skeleton: no `Http/Kernel.php`, no `app/Console/Kernel.php`—middleware, exceptions, and routing registration all live in `bootstrap/app.php`. Fewer files, same power.",
      np: "Laravel 11 मा skeleton सानो भयो — `Http/Kernel.php` हटाइयो; सब `bootstrap/app.php` मा।",
      jp: "Laravel 11 では `Http/Kernel.php` が廃止され、`bootstrap/app.php` にミドルウェア・例外・ルート設定が集約されました。",
    },
  ],
  sections: [
    {
      title: {
        en: "Laravel project structure",
        np: "Laravel परियोजना संरचना",
        jp: "Laravel プロジェクト構造",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Run `composer create-project laravel/laravel my-app` (or `laravel new my-app` with the global installer). The installer lets you pick a starter kit (**Breeze**, **Jetstream**, or none) and a testing suite (Pest or PHPUnit).",
            np: "`composer create-project laravel/laravel my-app` चलाउनुहोस्। installer बाट Breeze/Jetstream र Pest/PHPUnit छान्न सकिन्छ।",
            jp: "`composer create-project laravel/laravel my-app` で作成。グローバル installer では Breeze・Jetstream・テストスイートを選べます。",
          },
        },
        {
          type: "code",
          title: { en: "Create a new Laravel 11 app", np: "नयाँ Laravel 11 एप", jp: "新規 Laravel 11 プロジェクト" },
          code: `# Via Composer (always works)
composer create-project laravel/laravel my-app
cd my-app
php artisan serve

# Via the Laravel installer (after: composer global require laravel/installer)
laravel new my-app
# Follow the interactive prompts for starter kit + test suite`,
        },
        {
          type: "table",
          caption: {
            en: "Key directories and files in a fresh Laravel 11 project",
            np: "नयाँ Laravel 11 परियोजनाका मुख्य फोल्डर/फाइल",
            jp: "Laravel 11 の主要ディレクトリとファイル",
          },
          headers: [
            { en: "Path", np: "पथ", jp: "パス" },
            { en: "Purpose", np: "उद्देश्य", jp: "役割" },
          ],
          rows: [
            [
              { en: "`app/Models/`", np: "`app/Models/`", jp: "`app/Models/`" },
              { en: "Eloquent model classes (data layer)", np: "Eloquent मोडेल", jp: "Eloquent モデル（データ層）" },
            ],
            [
              { en: "`app/Http/Controllers/`", np: "`app/Http/Controllers/`", jp: "`app/Http/Controllers/`" },
              { en: "HTTP controller classes", np: "HTTP नियन्त्रक", jp: "HTTP コントローラ" },
            ],
            [
              { en: "`app/Http/Middleware/`", np: "`app/Http/Middleware/`", jp: "`app/Http/Middleware/`" },
              { en: "Request/response pipeline filters", np: "मिडलवेयर", jp: "ミドルウェア（パイプライン）" },
            ],
            [
              { en: "`bootstrap/app.php`", np: "`bootstrap/app.php`", jp: "`bootstrap/app.php`" },
              { en: "Laravel 11 central config: middleware, exceptions, routing", np: "L11 केन्द्रीय विन्यास", jp: "Laravel 11 の中枢：ミドルウェア・例外・ルート" },
            ],
            [
              { en: "`config/`", np: "`config/`", jp: "`config/`" },
              { en: "PHP config files (`app.php`, `database.php`, …)", np: "PHP विन्यास फाइल", jp: "PHP 設定ファイル群" },
            ],
            [
              { en: "`database/`", np: "`database/`", jp: "`database/`" },
              { en: "Migrations, seeders, factories", np: "माइग्रेशन, सिडर, फ्याक्ट्री", jp: "マイグレーション・シーダ・ファクトリ" },
            ],
            [
              { en: "`public/`", np: "`public/`", jp: "`public/`" },
              { en: "Web root — `index.php` bootstrap, compiled assets", np: "वेब रूट — `index.php`", jp: "Web ルート。`index.php` とアセット" },
            ],
            [
              { en: "`resources/views/`", np: "`resources/views/`", jp: "`resources/views/`" },
              { en: "Blade template files (`.blade.php`)", np: "Blade टेम्प्लेट", jp: "Blade テンプレート" },
            ],
            [
              { en: "`routes/web.php`", np: "`routes/web.php`", jp: "`routes/web.php`" },
              { en: "Browser-facing routes (session, CSRF)", np: "वेब रूट (session, CSRF)", jp: "Web ルート（セッション・CSRF 付き）" },
            ],
            [
              { en: "`routes/api.php`", np: "`routes/api.php`", jp: "`routes/api.php`" },
              { en: "Stateless API routes (prefixed `/api` by default)", np: "API रूट, `/api` prefix", jp: "API ルート（`/api` プレフィックス）" },
            ],
            [
              { en: "`storage/`", np: "`storage/`", jp: "`storage/`" },
              { en: "Logs, cache, uploaded files, compiled views", np: "लग, क्यास, फाइल", jp: "ログ・キャッシュ・アップロード・コンパイル済みビュー" },
            ],
            [
              { en: "`tests/`", np: "`tests/`", jp: "`tests/`" },
              { en: "Feature and unit tests (Pest or PHPUnit)", np: "परीक्षण", jp: "テスト（Pest / PHPUnit）" },
            ],
            [
              { en: "`.env`", np: "`.env`", jp: "`.env`" },
              { en: "Environment variables — never commit secrets", np: "वातावरण चर — commit नगर्नु", jp: "環境変数。秘密情報はコミットしないこと" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "MVC & request lifecycle",
        np: "MVC र request lifecycle",
        jp: "MVC とリクエストライフサイクル",
      },
      blocks: [
        {
          type: "diagram",
          id: "laravel-request-lifecycle",
        },
        {
          type: "paragraph",
          text: {
            en: "Every HTTP request enters through `public/index.php`, which boots the **Application** (binds service providers) then hands off to the **Kernel**. In Laravel 11 the kernel responsibilities are configured in `bootstrap/app.php`. The **Router** matches the URI to a route, runs the **middleware** pipeline, calls the **Controller** action, and finally sends the **Response** back through the same middleware stack (in reverse).",
            np: "Request `public/index.php` बाट आउँछ → Application boot → Kernel → Router → Middleware → Controller → Response।",
            jp: "リクエストは `public/index.php` → Application（サービスプロバイダ起動）→ Kernel → Router → ミドルウェア → Controller → Response の順に流れます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Model** — Eloquent ORM classes. Encapsulate data access, relationships, and business rules (scopes, mutators, casts).",
              np: "**Model** — Eloquent ORM; डाटा र business rules।",
              jp: "**Model** — Eloquent ORM。データアクセス・リレーション・ビジネスロジックを担当。",
            },
            {
              en: "**View** — Blade templates (`.blade.php`). Purely presentational; receive data from controllers via `view('name', $data)`.",
              np: "**View** — Blade templates; controller बाट data लिन्छन्।",
              jp: "**View** — Blade テンプレート。コントローラから渡されたデータを表示するだけ。",
            },
            {
              en: "**Controller** — Receives the HTTP request, coordinates Model queries / service calls, returns a Response (view, JSON, redirect).",
              np: "**Controller** — HTTP request, Model call, Response फर्काउँछ।",
              jp: "**Controller** — HTTP リクエストを受け取り、モデル・サービスを呼び出し、レスポンスを返します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Service Container & dependency injection",
        np: "Service Container र dependency injection",
        jp: "サービスコンテナと依存性注入",
      },
      blocks: [
        {
          type: "diagram",
          id: "laravel-service-container",
        },
        {
          type: "paragraph",
          text: {
            en: "The **Service Container** (IoC container) is Laravel's dependency injection engine. When Laravel instantiates a controller or job, it inspects constructor type-hints and **auto-resolves** concrete classes automatically. You only need to manually bind when a type-hint is an **interface** (which has multiple possible implementations).",
            np: "**Service Container** ले constructor type-hint हेरेर dependency inject गर्छ। Interface bind गर्दा manual binding चाहिन्छ।",
            jp: "**Service Container** は DI エンジン。コンストラクタの型ヒントを見て依存を自動解決します。インタフェースの場合は手動バインドが必要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Binding an interface in AppServiceProvider",
            np: "AppServiceProvider मा interface bind गर्ने",
            jp: "AppServiceProvider でインタフェースをバインド",
          },
          code: `<?php
// app/Providers/AppServiceProvider.php
namespace App\\Providers;

use App\\Contracts\\PaymentGateway;
use App\\Services\\StripePaymentGateway;
use Illuminate\\Support\\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     * bind() creates a new instance each time; singleton() reuses one.
     */
    public function register(): void
    {
        $this->app->bind(PaymentGateway::class, StripePaymentGateway::class);

        // Singleton: only one instance per request cycle
        $this->app->singleton(PaymentGateway::class, StripePaymentGateway::class);
    }

    /**
     * Boot runs AFTER all providers are registered — safe to use other services.
     */
    public function boot(): void
    {
        // e.g. register view composers, event listeners
    }
}`,
        },
        {
          type: "code",
          title: {
            en: "Auto-resolution in a controller constructor",
            np: "Controller constructor मा auto-resolution",
            jp: "コントローラのコンストラクタで自動解決",
          },
          code: `<?php
namespace App\\Http\\Controllers;

use App\\Contracts\\PaymentGateway;

class CheckoutController extends Controller
{
    // Laravel resolves PaymentGateway automatically from the container
    public function __construct(private PaymentGateway $payments) {}

    public function store(): \\Illuminate\\Http\\JsonResponse
    {
        $result = $this->payments->charge(request('amount'));
        return response()->json($result);
    }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Service Providers** are the *registration point*. The `register()` method runs first (bind things here). `boot()` runs after all providers have registered—use it for event listeners, view composers, macros, or anything that depends on other services being ready.",
            np: "**Service Provider** मा `register()` पहिले, `boot()` पछि। event, view composer, macro boot मा।",
            jp: "**Service Provider** の `register()` が先に全プロバイダで実行され、その後 `boot()` が呼ばれます。イベントやビューコンポーザは `boot()` に書きます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Artisan commands reference",
        np: "Artisan आदेश सन्दर्भ",
        jp: "Artisan コマンド リファレンス",
      },
      blocks: [
        {
          type: "table",
          headers: [
            { en: "Command", np: "आदेश", jp: "コマンド" },
            { en: "What it does", np: "के गर्छ", jp: "内容" },
          ],
          rows: [
            [
              { en: "`php artisan serve`", np: "`php artisan serve`", jp: "`php artisan serve`" },
              { en: "Start the built-in dev server (default port 8000)", np: "dev सर्भर सुरु (port 8000)", jp: "開発用サーバ起動（デフォルト 8000 番）" },
            ],
            [
              { en: "`php artisan list`", np: "`php artisan list`", jp: "`php artisan list`" },
              { en: "List all available Artisan commands", np: "सबै Artisan आदेश सूची", jp: "全コマンド一覧" },
            ],
            [
              { en: "`php artisan make:model Post -mc`", np: "`php artisan make:model Post -mc`", jp: "`php artisan make:model Post -mc`" },
              { en: "Create model + migration + controller in one shot", np: "मोडेल, माइग्रेशन, नियन्त्रक एकैपटक", jp: "モデル・マイグレーション・コントローラを一括生成" },
            ],
            [
              { en: "`php artisan make:controller UserController --resource`", np: "`make:controller --resource`", jp: "`make:controller --resource`" },
              { en: "Scaffold a resource controller (7 CRUD methods)", np: "CRUD controller बनाउने", jp: "CRUD 7 メソッドを持つコントローラを作成" },
            ],
            [
              { en: "`php artisan make:migration create_posts_table`", np: "`make:migration`", jp: "`make:migration`" },
              { en: "Create a new database migration file", np: "माइग्रेशन फाइल बनाउने", jp: "マイグレーションファイルを作成" },
            ],
            [
              { en: "`php artisan migrate`", np: "`php artisan migrate`", jp: "`php artisan migrate`" },
              { en: "Run pending migrations against the database", np: "माइग्रेशन चलाउने", jp: "未実行のマイグレーションを適用" },
            ],
            [
              { en: "`php artisan migrate:rollback`", np: "`migrate:rollback`", jp: "`migrate:rollback`" },
              { en: "Roll back the last batch of migrations", np: "अन्तिम batch rollback", jp: "最後のバッチをロールバック" },
            ],
            [
              { en: "`php artisan route:list`", np: "`route:list`", jp: "`route:list`" },
              { en: "Print all registered routes (use `--path=api` to filter)", np: "सबै रूट सूची; `--path=api` filter", jp: "全ルート一覧。`--path=api` でフィルタ可" },
            ],
            [
              { en: "`php artisan config:cache`", np: "`config:cache`", jp: "`config:cache`" },
              { en: "Cache config for production (run after every deploy)", np: "production मा config cache", jp: "本番向けに設定キャッシュを作成" },
            ],
            [
              { en: "`php artisan down --secret=token`", np: "`artisan down --secret`", jp: "`artisan down --secret`" },
              { en: "Maintenance mode; pass `?secret=token` in URL to bypass", np: "मर्मत मोड; secret URL बाट bypass", jp: "メンテナンスモード。URL に `?secret=token` で抜け道" },
            ],
            [
              { en: "`php artisan tinker`", np: "`php artisan tinker`", jp: "`php artisan tinker`" },
              { en: "REPL inside your app — great for quick model queries", np: "REPL — मोडेल query गर्न", jp: "アプリ内 REPL。モデルを素早く試せる" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What changed in Laravel 11 compared to Laravel 10?",
        np: "Laravel 11 मा Laravel 10 भन्दा के बदलियो?",
        jp: "Laravel 11 と Laravel 10 の主な違いは？",
      },
      answer: {
        en: "The biggest change is the **slimmed skeleton**: `App\\Http\\Kernel`, `App\\Console\\Kernel`, and the `app/Http/Middleware/*.php` defaults were removed. Middleware and exception handling are registered in `bootstrap/app.php` using a fluent API (`->withMiddleware()`, `->withExceptions()`). Routes are also registered there. Fewer files means less noise, but the same power is available. Upgrade from L10 → L11 using the official upgrade guide at laravel.com/docs.",
        np: "सबैभन्दा ठूलो परिवर्तन: `Http/Kernel`, `Console/Kernel` हटाइयो। सब `bootstrap/app.php` मा।",
        jp: "最大の変更は **スリムスケルトン**。`Http/Kernel` 等が廃止され、`bootstrap/app.php` の fluent API にまとまりました。アップグレードは公式ガイドを参照してください。",
      },
    },
    {
      question: {
        en: "What is a Service Provider and why does it matter?",
        np: "Service Provider के हो र किन महत्त्वपूर्ण?",
        jp: "Service Provider とは何ですか？",
      },
      answer: {
        en: "A **Service Provider** is the canonical place to *register* container bindings and *boot* application services (event listeners, gates, macros, view composers). All providers listed in `bootstrap/providers.php` (L11) are loaded on every request. Keep `register()` free of side-effects and put observable behavior in `boot()`.",
        np: "**Service Provider** container binding र boot को लागि। `register()` मा binding; `boot()` मा side-effects।",
        jp: "**Service Provider** は DI バインドとブートの場所。`register()` でバインド、`boot()` でイベント・マクロ等。全プロバイダは全リクエストで読み込まれます。",
      },
    },
    {
      question: {
        en: "How does automatic constructor injection (auto-resolution) work?",
        np: "Auto-resolution कसरी काम गर्छ?",
        jp: "コンストラクタの自動解決はどう動く？",
      },
      answer: {
        en: "When Laravel instantiates a class (controller, job, command, listener…) it uses PHP reflection to read the constructor parameters. For each type-hinted parameter it calls `$app->make(TypeHint::class)`. If the type is a **concrete class**, the container instantiates it directly (recursively resolving its own dependencies). If it is an **interface**, a manual binding must exist in a service provider.",
        np: "Laravel PHP reflection ले constructor parameter हेर्छ र `$app->make()` गर्छ। concrete class मा direct; interface मा binding चाहिन्छ।",
        jp: "PHP リフレクションでコンストラクタ引数を読み、`$app->make()` で再帰的に解決します。具象クラスなら直接、インタフェースは手動バインドが必要です。",
      },
    },
    {
      question: {
        en: "Do I need XAMPP to run Laravel locally?",
        np: "Laravel चलाउन XAMPP चाहिन्छ?",
        jp: "Laravel のローカル開発に XAMPP は必要？",
      },
      answer: {
        en: "No — Laravel's built-in server (`php artisan serve`) handles PHP. For a database you can use **SQLite** (zero config, just set `DB_CONNECTION=sqlite` in `.env`) during development. Alternatively, **Laravel Herd** (macOS/Windows) or **Laravel Sail** (Docker) provide a fully integrated local environment including MySQL/PostgreSQL, Redis, and MailHog.",
        np: "XAMPP अनिवार्य छैन। SQLite zero-config चल्छ। Herd (macOS/Win) वा Sail (Docker) राम्रो option।",
        jp: "必須ではありません。`php artisan serve` で PHP は動きます。DB は SQLite でゼロ設定可。**Laravel Herd** や **Sail**（Docker）が統合環境として便利です。",
      },
    },
    {
      question: {
        en: "What is the difference between Composer and npm?",
        np: "Composer र npm को फरक?",
        jp: "Composer と npm の違いは？",
      },
      answer: {
        en: "**Composer** manages PHP packages (backend dependencies like Laravel itself, Pest, PHPUnit). **npm** (or pnpm/yarn) manages JavaScript/Node packages (frontend tooling like Vite, Tailwind, React). A Laravel project uses both: `composer.json` for PHP, `package.json` for the JS pipeline. They operate completely independently.",
        np: "**Composer** PHP package (backend); **npm** JavaScript package (frontend). दुवै एकै project मा प्रयोग।",
        jp: "**Composer** は PHP パッケージ管理。**npm** は JS/Node パッケージ管理。Laravel プロジェクトは両方を使います（`composer.json` と `package.json` が共存）。",
      },
    },
    {
      question: {
        en: "How do I switch PHP versions on my machine?",
        np: "PHP version कसरी बदल्ने?",
        jp: "PHP バージョンの切り替え方法は？",
      },
      answer: {
        en: "On macOS use **Homebrew** with `brew install php@8.3 && brew link --overwrite php@8.3`, or use **Laravel Herd** which manages PHP versions via a GUI. On Linux, use `update-alternatives` or `phpenv`. On Windows use **NVM for PHP** or switch via XAMPP PHP folder. Confirm the active version with `php -v`.",
        np: "macOS मा Homebrew/Herd; Linux मा `update-alternatives`; Windows मा XAMPP। `php -v` ले पुष्टि।",
        jp: "macOS は Homebrew または Herd で GUI 切り替え可。Linux は `update-alternatives`、Windows は XAMPP など。`php -v` でバージョン確認。",
      },
    },
  ],
};
