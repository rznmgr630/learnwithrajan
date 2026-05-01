import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Laravel 11 is a PHP MVC framework for production web apps: routing, DI, ORM, queues, and more ship in an opinionated layout. Taylor Otwell created Laravel; the community and documentation at laravel.com/docs are your primary references.",
      np: "Laravel 11 PHP MVC फ्रेमवर्क हो — routing, DI, ORM आदि। Taylor Otwell ले बनाएका। आधिकारिक डकुमेन्टेशन laravel.com/docs।",
      jp: "Laravel 11 は本番向けの PHP MVC フレームワークです。Taylor Otwell が創始者。公式は laravel.com/docs を参照してください。",
    },
    {
      en: "MVC splits concerns: Models (data & rules), Views (templates / HTML), Controllers (HTTP in → coordinate model + view). Laravel adds routing, middleware, service container—think MVC plus these layers.",
      np: "MVC: Model डाटा, View UI, Controller इनपुट र समन्वय। Laravel मा routing, middleware पनि।",
      jp: "MVC は Model（データ）・View（表示）・Controller（入力と調整）。Laravel ではルートやミドルウェアなどが加わります。",
    },
  ],
  sections: [
    {
      title: {
        en: "Composer, dependencies & project creation",
        np: "Composer र परियोजना सिर्जना",
        jp: "Composer とプロジェクト作成",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Composer is PHP’s dependency manager. Declared packages live in `composer.json`; `composer.lock` pins exact resolved versions so installs are reproducible—commit both to version control.",
            np: "Composer PHP प्याकेज म्यानेजर। `composer.json` मा घोषणा; `composer.lock` ले संस्करण फिक्स गर्छ।",
            jp: "Composer で依存関係を管理します。`composer.json` が要件、`composer.lock` が実際に解決されたバージョンです。",
          },
        },
        {
          type: "code",
          title: { en: "New Laravel 11 app", np: "नयाँ Laravel 11 एप", jp: "新規 Laravel 11 プロジェクト" },
          code: `composer create-project laravel/laravel my-app
cd my-app
php artisan serve
# optional: php artisan serve --port=4000`,
        },
        {
          type: "paragraph",
          text: {
            en: "Alternatively install the Laravel installer globally (`composer global require laravel/installer`) then run `laravel new my-app`. Ensure PHP and Composer meet the versions listed in the docs for Laravel 11.",
            np: "Laravel installer वैकल्पिक। PHP र Composer संस्करण डकुमेन्टेशन अनुसार।",
            jp: "グローバルの Laravel installer（`laravel new`）も可。PHP / Composer の要件は公式を確認。",
          },
        },
      ],
    },
    {
      title: {
        en: "Artisan, maintenance mode & environment",
        np: "Artisan, मर्मत र वातावरण",
        jp: "Artisan・メンテナンス・環境変数",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`php artisan` — CLI entry point for migrations, queues, route:list, etc.",
              np: "`php artisan` — CLI प्रवेश बिन्दु।",
              jp: "`php artisan` — マイグレーションや `route:list` など CLI の入口。",
            },
            {
              en: "Maintenance: `php artisan down` serves 503 (“Be right back”); `php artisan up` restores traffic.",
              np: "`php artisan down` ले 503; `up` ले सामान्य।",
              jp: "`php artisan down` でメンテナンス（503）、`php artisan up` で復旧。",
            },
            {
              en: "`.env` — environment-specific config (never commit secrets). Read values with `config()` / `env()` from published config files (prefer `config()` in application code).",
              np: "`.env` — विन्यास; गोप्य मान commit नगर्नु। एपमा `config()` प्राथमिकता।",
              jp: "`.env` は環境ごとの設定。本番では `config()` 経由で参照するのが無難です。",
            },
            {
              en: "`vendor/` — installed Composer packages. Inspect tree with `composer show --tree`.",
              np: "`vendor/` — प्याकेजहरू। `composer show --tree`।",
              jp: "`vendor/` に依存パッケージ。`composer show --tree` で確認。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Local stack & editor extensions",
        np: "स्थानीय स्टाक र सम्पादक",
        jp: "ローカル環境とエディタ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "XAMPP bundles Apache, MariaDB/MySQL, PHP (and Perl)—handy for local DB/browser testing. VS Code extensions many teams use: Laravel Artisan, Blade snippets/spacer, Goto View, Laravel Snippets, Extra IntelliSense, PHP IntelliSense, Live Sass Compiler, Emmet Live — pick what matches your workflow.",
            np: "XAMPP — Apache, MySQL, PHP स्थानीय परीक्षणको लागि। VS Code मा Laravel/Blade सम्बन्धित एक्सटेन्सन।",
            jp: "XAMPP でローカル Web/DB。VS Code は Laravel Artisan・Blade・Goto View などを用途に合わせて。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What are Laravel’s main advantages and trade-offs?",
        np: "Laravel का मुख्य फाइदा र सम्झौता?",
        jp: "Laravel の長所と注意点は？",
      },
      answer: {
        en: "Pros: batteries included (auth scaffolding options, mail, queues, scheduling), expressive APIs, strong docs, large ecosystem. Cons: framework upgrades need a changelog pass; Composer solves PHP deps well but the JS frontend story is separate (use Vite/npm there)—compare npm only when talking about asset tooling, not replacing Composer for PHP.",
        np: "फाइदा: धेरै सुविधा, राम्रो डकुमेन्टेशन। बुँदा: अपग्रेड योजना चाहिन्छ; PHP को लागि Composer, फ्रन्टको लागि npm/Vite अलग।",
        jp: "利点: 機能が揃いドキュメントが厚い。負担: メジャーアップデートはリリースノート確認。PHP は Composer、フロントは npm/Vite が別レイヤです。",
      },
    },
    {
      question: {
        en: "composer.json vs composer.lock — which do I deploy?",
        np: "composer.json बनाम composer.lock — के deploy गर्ने?",
        jp: "composer.json と lock、どちらを重視？",
      },
      answer: {
        en: "Commit both. `composer.json` declares constraints (e.g. `^11.0`); `composer.lock` locks what was actually resolved. On servers run `composer install` (not `update`) for reproducible builds unless you intentionally bump dependencies.",
        np: "दुवै commit गर्नुहोस्। सर्वरमा `composer install` ले lock अनुसार स्थापना गर्छ।",
        jp: "両方コミット。本番は通常 `composer install` で lock に従う。`update` は依存を更新するときだけ。",
      },
    },
  ],
};
