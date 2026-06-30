import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Think of Laravel as a ready-made toolbox for PHP web apps — instead of building every piece from scratch, you get routing, a database layer, queues, a CLI, and more all wired together on day one. It follows the <b>MVC pattern</b> (Model–View–Controller) to keep your code organized.\n\n<b>What is MVC?</b>\n• <b>Model</b> — the data layer. Talks to the database and holds business rules\n• <b>View</b> — what the user sees. HTML pages built with Blade templates\n• <b>Controller</b> — the glue. Receives a request, asks the Model for data, hands it to the View\n  ↳ Think of it like a restaurant: the Controller is the waiter, the Model is the kitchen, the View is the plate of food\n\nLaravel 10/11 requires PHP 8.1+ and Composer 2.",
      np: "Laravel PHP MVC फ्रेमवर्क हो — Taylor Otwell ले बनाएका। routing, ORM, queue, CLI सब built-in।",
      jp: "Laravel は Taylor Otwell が作成した PHP の **MVC フレームワーク**。ルーティング・ORM・キューなどが揃っています。",
    },
    {
      en: "<b>Laravel 11</b> simplified the project skeleton — two files that used to exist (`Http/Kernel.php` and `app/Console/Kernel.php`) were removed entirely. Everything they did — registering middleware, exceptions, and routes — now lives in one place: `bootstrap/app.php`.\n• Fewer files to navigate\n• Same power as before\n  ↳ If you learned on Laravel 10, the biggest adjustment is finding config in `bootstrap/app.php` instead of the old Kernel files",
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
            en: "To create a new project, run `composer create-project laravel/laravel my-app` in your terminal. If you have the global Laravel installer, you can also use `laravel new my-app` — it walks you through a small interactive setup where you can pick a starter kit (<b>Breeze</b> for simple auth scaffolding, <b>Jetstream</b> for a more full-featured kit) and a test runner (Pest or PHPUnit).",
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
            en: "Every request your browser sends follows this exact path through Laravel:\n\n• Browser hits a URL → request arrives at `public/index.php`\n• `index.php` boots the <b>Application</b> — loads all service providers and sets up the container\n• The <b>Kernel</b> (configured in `bootstrap/app.php` in Laravel 11) receives the request\n• The <b>Router</b> reads the URI and HTTP verb to find the matching route definition\n• The request passes through the <b>Middleware</b> pipeline — each middleware can inspect, modify, or reject the request\n• The matching <b>Controller</b> action runs, fetches data from Models, and returns a Response\n• The Response travels back out through middleware in reverse order before reaching the browser\n  ↳ Think of middleware like airport security checkpoints — each one has a chance to check, stamp, or turn you away",
            np: "Request `public/index.php` बाट आउँछ → Application boot → Kernel → Router → Middleware → Controller → Response।",
            jp: "リクエストは `public/index.php` → Application（サービスプロバイダ起動）→ Kernel → Router → ミドルウェア → Controller → Response の順に流れます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "<b>Model</b> — Eloquent ORM classes that represent your database tables. They handle fetching, saving, and relating data, plus business rules like scopes, mutators, and casts.",
              np: "**Model** — Eloquent ORM; डाटा र business rules।",
              jp: "**Model** — Eloquent ORM。データアクセス・リレーション・ビジネスロジックを担当。",
            },
            {
              en: "<b>View</b> — Blade templates (`.blade.php`) that produce HTML. They are purely presentational — they receive data from the controller via `view('name', $data)` and display it.",
              np: "**View** — Blade templates; controller बाट data लिन्छन्।",
              jp: "**View** — Blade テンプレート。コントローラから渡されたデータを表示するだけ。",
            },
            {
              en: "<b>Controller</b> — Receives the HTTP request, coordinates calls to Models or services, and returns a Response — which could be a rendered view, a JSON payload, or a redirect.",
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
            en: "Imagine you are building a `CheckoutController` that needs a payment service. Without a container you would write `new StripePaymentGateway()` inside the controller — hardwiring the two classes together. If you ever switch to PayPal, you have to hunt down every `new Stripe...` in your codebase.\n\nThe <b>Service Container</b> solves this. It is Laravel's dependency injection engine:\n• You declare what your class <i>needs</i> by type-hinting it in the constructor\n• Laravel reads that type-hint and <b>automatically creates and injects</b> the right object\n  ↳ This is called <b>auto-resolution</b> — no manual `new` keyword needed\n• For concrete classes (real PHP classes), the container resolves them automatically\n• For interfaces (which could have many implementations), you register a manual binding that says \"when someone asks for this interface, give them this class\"",
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
            en: "<b>Service Providers</b> are where you register things with the container. Every provider has two methods:\n• `register()` — runs first, across all providers. Only bind things to the container here. Do not trigger side effects\n• `boot()` — runs after every provider has registered. Safe to use other services here. This is where you put event listeners, view composers, macros, and Gate definitions\n  ↳ Rule of thumb: if it depends on another service being ready first, it goes in `boot()`",
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
        en: "The biggest change is the <b>slimmed skeleton</b>. Two files that used to exist — `App\\Http\\Kernel` and `App\\Console\\Kernel` — were removed entirely. Instead, middleware and exception handling are registered in `bootstrap/app.php` using a fluent API (`->withMiddleware()`, `->withExceptions()`). Route files are also registered there. The result is fewer files to navigate with the same power. If you are upgrading from Laravel 10, follow the official upgrade guide at laravel.com/docs.",
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
        en: "A <b>Service Provider</b> is the place where you tell Laravel how to wire things together — registering container bindings, event listeners, gates, macros, and view composers. All providers listed in `bootstrap/providers.php` (Laravel 11) are loaded on every request. Keep `register()` free of side-effects — only bind things there. Anything that depends on other services being ready goes in `boot()`.",
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
        en: "When Laravel creates a class (controller, job, command, listener…) it uses PHP's reflection API to read the constructor parameters. For each type-hinted parameter it calls `$app->make(TypeHint::class)`. If the type is a <b>concrete class</b>, the container creates it directly — and recursively resolves its own dependencies too. If it is an <b>interface</b>, a manual binding must exist in a service provider, otherwise Laravel throws an error.",
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
        en: "No — Laravel's built-in server (`php artisan serve`) handles PHP for you. For a database during development, the easiest option is <b>SQLite</b> — zero configuration, just set `DB_CONNECTION=sqlite` in your `.env` file. If you want a full local environment with MySQL, Redis, and email testing, try <b>Laravel Herd</b> (macOS/Windows, GUI-based) or <b>Laravel Sail</b> (Docker-based, cross-platform).",
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
        en: "<b>Composer</b> manages PHP packages — the backend dependencies like Laravel itself, Pest, and PHPUnit. <b>npm</b> (or pnpm/yarn) manages JavaScript and Node packages — the frontend tooling like Vite, Tailwind, and React. A Laravel project uses both at the same time: `composer.json` for the PHP side, `package.json` for the JS pipeline. They are completely independent and do not interfere with each other.",
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
        en: "On <b>macOS</b>: use Homebrew (`brew install php@8.3 && brew link --overwrite php@8.3`), or use <b>Laravel Herd</b> which lets you switch PHP versions through a GUI. On <b>Linux</b>: use `update-alternatives` or `phpenv`. On <b>Windows</b>: switch via the XAMPP PHP folder, or use a dedicated version switcher. Whichever method you use, confirm the active version by running `php -v` in your terminal.",
        np: "macOS मा Homebrew/Herd; Linux मा `update-alternatives`; Windows मा XAMPP। `php -v` ले पुष्टि।",
        jp: "macOS は Homebrew または Herd で GUI 切り替え可。Linux は `update-alternatives`、Windows は XAMPP など。`php -v` でバージョン確認。",
      },
    },
  ],
};
