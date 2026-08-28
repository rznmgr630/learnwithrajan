import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_1_LESSONS: LessonDay = {
  day: 1,
  title: { en: "Install and set up Laravel", np: "Laravel install र setup", jp: "Laravelの導入とセットアップ" },
  totalMinutes: 26,
  difficulty: { en: "Beginner", np: "प्रारम्भिक", jp: "初級" },
  lessons: [
    {
      id: "what-is-laravel",
      title: { en: "What Laravel is, and why a framework", np: "Laravel के हो, र framework किन", jp: "Laravelとは何か、なぜフレームワークか" },
      durationMinutes: 8,
      explanation: {
        en: "<b>Laravel</b> (a PHP framework for building web applications) gives you structure and tools so you do not build everything from scratch.\n\nWithout a framework, every project makes you handle all of this yourself:\n\n```text\nHTTP Request\n     ↓\nURL routing\n     ↓\nAuthentication\n     ↓\nValidation\n     ↓\nDatabase\n     ↓\nSessions\n     ↓\nErrors\n     ↓\nHTTP Response\n```\n\nLaravel ships tools for each of those.\n\n```text\n                 Laravel\n                    │\n        ┌───────────┼───────────┐\n        ↓           ↓           ↓\n      Routing    Database    Validation\n        ↓           ↓           ↓\n Authentication   Queues     Testing\n        ↓           ↓           ↓\n     Sessions     Cache       APIs\n```\n\n---\n\n### 1. Basic — why a framework at all\n\nThink about building a house. You could make everything yourself:\n\n```text\nBuild your own tools\n        ↓\nBuild the foundation\n        ↓\nBuild the walls\n        ↓\nBuild the electrical system\n        ↓\nBuild everything else\n```\n\nOr start from something already standing:\n\n```text\nFramework\n    ↓\nFoundation already provided\n    ↓\nYou focus on your application\n```\n\nA framework does not build your application. It gives you a <b>standard way to build it</b>.\n\n---\n\n### 2. Intermediate — what conventions buy you\n\nWithout Laravel, you decide everything yourself:\n\n```text\nWhere should routes go?\nHow should authentication work?\nHow should database queries work?\nHow should validation work?\nHow should errors work?\nWhere should application code live?\n```\n\nEvery answer is defensible, and every project answers differently — which is why joining a new codebase is slow.\n\nLaravel already provides <b>conventions</b> (common, recommended ways of doing things):\n\n```text\nLaravel conventions\n        ↓\nConsistent project structure\n        ↓\nFaster development\n        ↓\nEasier maintenance\n```\n\nThe value is not that Laravel's answers are the only good ones. It is that everyone using Laravel gives the <b>same</b> answers, so you can open any Laravel project and know where to look.\n\n---\n\n### 3. Advanced — what sits under Laravel\n\nLaravel is written in PHP, and Composer manages the PHP packages it needs:\n\n```text\nYour Laravel Application\n          ↓\n       Laravel\n          ↓\n      Composer\n          ↓\n    PHP packages\n          ↓\n         PHP\n```\n\nSo before you can install Laravel you need four things:\n\n```text\nPHP 8.3+\nComposer\nTerminal\nCode Editor\n```\n\nCheck the first two now:\n\n```bash\nphp -v            # PHP 8.3.x or newer\ncomposer --version # Composer version 2.x\n```\n\n```text\nPHP\n │\n └── Runs Laravel\n\nComposer\n │\n └── Installs PHP dependencies\n```\n\n<b>Composer</b> (PHP's dependency manager) installs the packages your application needs. If you know JavaScript, the mapping is direct: `npm` is `composer`, `package.json` is `composer.json`, `node_modules` is `vendor/`.",
        np: "<b>Laravel</b> (web application बनाउने PHP framework) ले संरचना र उपकरण दिन्छ, ताकि तपाईंले सबै शून्यबाट नबनाउनुपरोस्।\n\nFramework बिना, हरेक project मा यी सबै आफैं सम्हाल्नुपर्छ:\n\n```text\nHTTP Request\n     ↓\nURL routing\n     ↓\nAuthentication\n     ↓\nValidation\n     ↓\nDatabase\n     ↓\nSessions\n     ↓\nErrors\n     ↓\nHTTP Response\n```\n\nLaravel ले यी हरेकका लागि उपकरण दिन्छ।\n\n```text\n                 Laravel\n                    │\n        ┌───────────┼───────────┐\n        ↓           ↓           ↓\n      Routing    Database    Validation\n        ↓           ↓           ↓\n Authentication   Queues     Testing\n        ↓           ↓           ↓\n     Sessions     Cache       APIs\n```\n\n---\n\n### 1. आधारभूत — framework किन चाहियो\n\nघर बनाउने कुरा सोच्नुहोस्। सबै आफैं बनाउन सक्नुहुन्छ:\n\n```text\nआफ्नै औजार बनाउने\n        ↓\nजग बनाउने\n        ↓\nभित्ता बनाउने\n        ↓\nबिजुली प्रणाली बनाउने\n        ↓\nबाँकी सबै बनाउने\n```\n\nवा पहिले नै उभिएको कुराबाट सुरु गर्न सक्नुहुन्छ:\n\n```text\nFramework\n    ↓\nजग पहिले नै तयार\n    ↓\nतपाईं आफ्नो application मा ध्यान दिनुहुन्छ\n```\n\nFramework ले तपाईंको application बनाइदिँदैन। यसले <b>बनाउने मानक तरिका</b> दिन्छ।\n\n---\n\n### 2. मध्यम — convention ले के दिन्छ\n\nLaravel बिना, तपाईं सबै आफैं तय गर्नुहुन्छ:\n\n```text\nRoute कहाँ राख्ने?\nAuthentication कसरी काम गर्ने?\nDatabase query कसरी गर्ने?\nValidation कसरी गर्ने?\nError कसरी सम्हाल्ने?\nApplication code कहाँ राख्ने?\n```\n\nहरेक जवाफ तर्कसंगत हुन सक्छ, र हरेक project ले फरक जवाफ दिन्छ — त्यसैले नयाँ codebase मा पस्न ढिलो हुन्छ।\n\nLaravel ले पहिले नै <b>convention</b> (सामान्य, सिफारिस गरिएका तरिका) दिन्छ:\n\n```text\nLaravel convention\n        ↓\nएकनास project संरचना\n        ↓\nछिटो विकास\n        ↓\nसजिलो मर्मत\n```\n\nमूल्य Laravel का जवाफ मात्रै राम्रा हुन् भन्नेमा होइन। Laravel प्रयोग गर्ने सबैले <b>उही</b> जवाफ दिन्छन्, त्यसैले जुनसुकै Laravel project खोल्दा कहाँ हेर्ने थाहा हुन्छ।\n\n---\n\n### 3. उन्नत — Laravel मुनि के छ\n\nLaravel PHP मा लेखिएको छ, र यसलाई चाहिने PHP package Composer ले सम्हाल्छ:\n\n```text\nतपाईंको Laravel Application\n          ↓\n       Laravel\n          ↓\n      Composer\n          ↓\n    PHP packages\n          ↓\n         PHP\n```\n\nत्यसैले Laravel install गर्नुअघि चार कुरा चाहिन्छ:\n\n```text\nPHP 8.3+\nComposer\nTerminal\nCode Editor\n```\n\nपहिलो दुई अहिले जाँच्नुहोस्:\n\n```bash\nphp -v            # PHP 8.3.x वा नयाँ\ncomposer --version # Composer version 2.x\n```\n\n```text\nPHP\n │\n └── Laravel चलाउँछ\n\nComposer\n │\n └── PHP dependency install गर्छ\n```\n\n<b>Composer</b> (PHP को dependency manager) ले application लाई चाहिने package install गर्छ। JavaScript थाहा छ भने तुलना सिधा छ: `npm` = `composer`, `package.json` = `composer.json`, `node_modules` = `vendor/`।",
        jp: "<b>Laravel</b>（Webアプリを作るためのPHPフレームワーク）は、すべてをゼロから作らずに済むよう、構造と道具を与えてくれる。\n\nフレームワークがなければ、どのプロジェクトでもこれらを自分で扱うことになる:\n\n```text\nHTTP Request\n     ↓\nURL routing\n     ↓\nAuthentication\n     ↓\nValidation\n     ↓\nDatabase\n     ↓\nSessions\n     ↓\nErrors\n     ↓\nHTTP Response\n```\n\nLaravelはそのそれぞれに道具を用意している。\n\n```text\n                 Laravel\n                    │\n        ┌───────────┼───────────┐\n        ↓           ↓           ↓\n      Routing    Database    Validation\n        ↓           ↓           ↓\n Authentication   Queues     Testing\n        ↓           ↓           ↓\n     Sessions     Cache       APIs\n```\n\n---\n\n### 1. 基本 — そもそもなぜフレームワークか\n\n家を建てることを考える。すべて自分で作ることもできる:\n\n```text\n道具を自作する\n        ↓\n基礎を作る\n        ↓\n壁を作る\n        ↓\n電気系統を作る\n        ↓\n残りすべてを作る\n```\n\nあるいは、すでに建っているものから始める:\n\n```text\nFramework\n    ↓\n基礎はすでにある\n    ↓\n自分のアプリに集中する\n```\n\nフレームワークがアプリを作ってくれるわけではない。<b>作り方の標準</b>を与えてくれるのだ。\n\n---\n\n### 2. 中級 — 規約が買ってくれるもの\n\nLaravelがなければ、すべてを自分で決める:\n\n```text\nルートはどこに置く?\n認証はどう作る?\nDBクエリはどう書く?\n検証はどうする?\nエラーはどう扱う?\nアプリのコードはどこに置く?\n```\n\nどの答えにも理屈はあり、プロジェクトごとに答えが違う。だから新しいコードベースに入るのは遅い。\n\nLaravelにはすでに<b>規約</b>（一般的で推奨されるやり方）がある:\n\n```text\nLaravelの規約\n        ↓\n一貫したプロジェクト構造\n        ↓\n開発が速くなる\n        ↓\n保守が楽になる\n```\n\n価値はLaravelの答えだけが正しいことではない。Laravelを使う全員が<b>同じ</b>答えを出すので、どのLaravelプロジェクトを開いてもどこを見ればよいか分かることだ。\n\n---\n\n### 3. 上級 — Laravelの下にあるもの\n\nLaravelはPHPで書かれ、必要なPHPパッケージはComposerが管理する:\n\n```text\nあなたのLaravelアプリ\n          ↓\n       Laravel\n          ↓\n      Composer\n          ↓\n    PHPパッケージ\n          ↓\n         PHP\n```\n\nだからLaravelを入れる前に4つが要る:\n\n```text\nPHP 8.3+\nComposer\nターミナル\nエディタ\n```\n\n最初の2つを今すぐ確認する:\n\n```bash\nphp -v            # PHP 8.3.x 以降\ncomposer --version # Composer version 2.x\n```\n\n```text\nPHP\n │\n └── Laravelを動かす\n\nComposer\n │\n └── PHPの依存を入れる\n```\n\n<b>Composer</b>（PHPの依存管理ツール）はアプリに必要なパッケージを入れる。JavaScriptを知っているなら対応はそのまま。`npm` が `composer`、`package.json` が `composer.json`、`node_modules` が `vendor/`。",
      },
      diagram: `What you would build yourself without a framework

HTTP Request → routing → auth → validation → database
             → sessions → errors → HTTP Response

Laravel ships a tool for each of those boxes


The stack, top to bottom

Your Laravel Application
          ↓
       Laravel
          ↓
      Composer          installs the packages
          ↓
    PHP packages
          ↓
         PHP            runs all of it


Four things you need before installing

PHP 8.3+          php -v
Composer          composer --version
Terminal
Code editor


Composer, if you already know npm

npm            →  composer
package.json   →  composer.json
node_modules   →  vendor/
npm install    →  composer install`,
      codeExample: {
        title: { en: "Checking your machine is ready", np: "आफ्नो machine तयार छ जाँच्नु", jp: "環境が整っているか確かめる" },
        code: `# ── Is PHP new enough for Laravel 13? ─────────────────────────────
php -v
# PHP 8.3.x (cli) ...        ← 8.3 or newer is what you want

# ── Is Composer installed? ────────────────────────────────────────
composer --version
# Composer version 2.x.x ...

# ── What each one is responsible for ──────────────────────────────
# PHP       runs Laravel itself
# Composer  installs the PHP packages Laravel depends on

# ── Composer, side by side with npm ───────────────────────────────
# npm install          →  composer install
# npm update           →  composer update
# package.json         →  composer.json
# node_modules/        →  vendor/

composer require some-package    # downloads it and its dependencies

# If either command above is "not found", install that tool first.
# Nothing else in this lesson will work until both report a version.`,
      },
      keyTakeaways: [
        { en: "<b>Laravel</b> is a PHP framework: structure and tools for the parts every web app needs.", np: "<b>Laravel</b> PHP framework हो: हरेक web app लाई चाहिने भागका लागि संरचना र उपकरण।", jp: "<b>Laravel</b> はPHPのフレームワークで、どのWebアプリにも必要な部分の構造と道具を与える。" },
        { en: "A framework does not write your application — it gives you a <b>standard way</b> to write it.", np: "Framework ले तपाईंको application लेख्दैन — यसले लेख्ने <b>मानक तरिका</b> दिन्छ।", jp: "フレームワークはアプリを書いてくれない。書き方の<b>標準</b>を与える。" },
        { en: "<b>Conventions</b> matter because everyone answers the same questions the same way.", np: "<b>Convention</b> महत्वपूर्ण छ किनकि सबैले उही प्रश्नको उही जवाफ दिन्छन्।", jp: "<b>規約</b>が効くのは、同じ問いに全員が同じ答えを出すから。" },
        { en: "The stack is <b>your app → Laravel → Composer → PHP</b>.", np: "Stack यस्तो छ: <b>तपाईंको app → Laravel → Composer → PHP</b>।", jp: "積み重ねは<b>アプリ → Laravel → Composer → PHP</b>。" },
        { en: "You need <b>PHP 8.3+, Composer, a terminal and an editor</b> before installing anything.", np: "केही install गर्नुअघि <b>PHP 8.3+, Composer, terminal र editor</b> चाहिन्छ।", jp: "何かを入れる前に<b>PHP 8.3+・Composer・ターミナル・エディタ</b>が要る。" },
        { en: "`php -v` and `composer --version` are the two commands that tell you if you are ready.", np: "`php -v` र `composer --version` ले तपाईं तयार हुनुहुन्छ कि भन्छन्।", jp: "`php -v` と `composer --version` が、準備できているかを教える2つのコマンド。" },
      ],
      commonMistakes: [
        { en: "<b>Expecting the framework to make design decisions for you</b> — Laravel gives you a place to put things, not an application. You still design the features.", np: "<b>Framework ले तपाईंका लागि design निर्णय गर्छ भन्ने आशा</b> — Laravel ले कुरा राख्ने ठाउँ दिन्छ, application होइन। Feature तपाईं आफैं design गर्नुहुन्छ।", jp: "<b>フレームワークが設計判断をしてくれると期待する</b> — Laravelが与えるのは物を置く場所であってアプリではない。機能を設計するのは自分。" },
        { en: "<b>Installing Laravel before checking PHP</b> — if `php -v` reports an older version, the install fails partway with a confusing dependency error.", np: "<b>PHP नजाँची Laravel install गर्नु</b> — `php -v` ले पुरानो version देखाए, install बीचैमा अलमल्याउने dependency error सँग असफल हुन्छ।", jp: "<b>PHPを確認せずにLaravelを入れる</b> — `php -v` が古い版なら、途中で紛らわしい依存エラーになって失敗する。" },
        { en: "<b>Confusing PHP with Laravel</b> — PHP is the language that runs; Laravel is a set of PHP packages written in it. Upgrading one is not upgrading the other.", np: "<b>PHP र Laravel अल्मल्याउनु</b> — PHP चल्ने भाषा हो; Laravel त्यसैमा लेखिएका PHP package को समूह। एउटा upgrade गर्नु अर्को upgrade गर्नु होइन।", jp: "<b>PHPとLaravelを混同する</b> — PHPは動かす言語、Laravelはそれで書かれたPHPパッケージ群。片方の更新は他方の更新ではない。" },
      ],
      quiz: [
        {
          question: { en: "What is Laravel?", np: "Laravel के हो?", jp: "Laravelとは何か?" },
          options: [
            { en: "A database", np: "एउटा database", jp: "データベース" },
            { en: "A code editor", np: "एउटा code editor", jp: "コードエディタ" },
            { en: "A PHP framework", np: "एउटा PHP framework", jp: "PHPのフレームワーク" },
            { en: "A JavaScript package", np: "एउटा JavaScript package", jp: "JavaScriptのパッケージ" },
          ],
          correctIndex: 2,
          explanation: { en: "It gives you structure and tools for the parts every web application needs.", np: "यसले हरेक web application लाई चाहिने भागका लागि संरचना र उपकरण दिन्छ।", jp: "どのWebアプリにも必要な部分に、構造と道具を与える。" },
        },
        {
          question: { en: "What does Composer do?", np: "Composer ले के गर्छ?", jp: "Composerは何をするか?" },
          options: [
            { en: "Runs SQL queries", np: "SQL query चलाउँछ", jp: "SQLクエリを実行する" },
            { en: "Creates Git branches", np: "Git branch बनाउँछ", jp: "Gitブランチを作る" },
            { en: "Manages PHP dependencies", np: "PHP dependency व्यवस्थापन गर्छ", jp: "PHPの依存を管理する" },
            { en: "Runs the browser", np: "Browser चलाउँछ", jp: "ブラウザを動かす" },
          ],
          correctIndex: 2,
          explanation: { en: "It is to PHP what npm is to JavaScript.", np: "JavaScript लाई npm जे हो, PHP लाई Composer त्यही हो।", jp: "JavaScriptにとってのnpmが、PHPにとってのComposer。" },
        },
        {
          question: { en: "What does a framework actually give you?", np: "Framework ले वास्तवमा के दिन्छ?", jp: "フレームワークが実際に与えるものは?" },
          options: [
            { en: "A standard way to build your application", np: "Application बनाउने मानक तरिका", jp: "アプリを作るための標準的なやり方" },
            { en: "A finished application", np: "बनिसकेको application", jp: "完成したアプリ" },
            { en: "A database server", np: "एउटा database server", jp: "データベースサーバー" },
          ],
          correctIndex: 0,
          explanation: { en: "You still design the features; Laravel decides where things go.", np: "Feature तपाईं आफैं design गर्नुहुन्छ; कुरा कहाँ जान्छ Laravel ले तय गर्छ।", jp: "機能を設計するのは自分。物の置き場所を決めるのがLaravel。" },
        },
        {
          question: { en: "Which command checks that PHP is new enough?", np: "PHP पर्याप्त नयाँ छ कुन command ले जाँच्छ?", jp: "PHPが十分新しいか確かめるコマンドは?" },
          options: [
            { en: "`laravel --check`", np: "`laravel --check`", jp: "`laravel --check`" },
            { en: "`composer --version`", np: "`composer --version`", jp: "`composer --version`" },
            { en: "`php -v`", np: "`php -v`", jp: "`php -v`" },
          ],
          correctIndex: 2,
          explanation: { en: "Laravel 13 wants PHP 8.3 or newer.", np: "Laravel 13 लाई PHP 8.3 वा नयाँ चाहिन्छ।", jp: "Laravel 13 はPHP 8.3以降を求める。" },
        },
        {
          question: { en: "In the stack, what sits directly under Laravel?", np: "Stack मा, Laravel भन्दा ठीक तल के छ?", jp: "積み重ねで、Laravelのすぐ下にあるのは?" },
          options: [
            { en: "Composer and the PHP packages it installs", np: "Composer र यसले install गर्ने PHP package", jp: "Composerとそれが入れるPHPパッケージ" },
            { en: "The browser", np: "Browser", jp: "ブラウザ" },
            { en: "The database", np: "Database", jp: "データベース" },
          ],
          correctIndex: 0,
          explanation: { en: "Your app → Laravel → Composer → PHP packages → PHP.", np: "तपाईंको app → Laravel → Composer → PHP package → PHP।", jp: "アプリ → Laravel → Composer → PHPパッケージ → PHP。" },
        },
      ],
    },
    {
      id: "create-your-first-app",
      title: { en: "Creating your first application", np: "पहिलो application बनाउनु", jp: "最初のアプリを作る" },
      durationMinutes: 9,
      explanation: {
        en: "Now you make something real.\n\n---\n\n### 1. Basic — Laravel Herd and `.test` domains\n\n<b>Laravel Herd</b> (a local development environment that makes running Laravel and PHP applications easy) removes most of the setup work.\n\nWithout it you would configure all of this yourself:\n\n```text\nInstall PHP\n    ↓\nConfigure PHP\n    ↓\nConfigure web server\n    ↓\nConfigure local domains\n    ↓\nConfigure certificates\n    ↓\nStart application\n```\n\nWith it:\n\n```text\nInstall Herd\n     ↓\nPHP + local environment\n     ↓\nCreate Laravel project\n     ↓\nOpen .test domain\n```\n\nHerd serves your projects at a <b>`.test` domain</b>, so `my-app.test` works instead of `localhost:8000`. That is a local convenience only:\n\n```text\nInternet\n   │\n   X          not publicly reachable\n   │\nYour computer\n   │\n   ↓\n Herd\n   │\n   ↓\nmy-app.test\n   │\n   ↓\nLaravel application\n```\n\n`.test` does <b>not</b> mean your app is on the internet.\n\n---\n\n### 2. Intermediate — `laravel new`\n\nThe Laravel installer gives you one command:\n\n```bash\nlaravel new blog\n```\n\nThat creates a complete application:\n\n```text\nblog/\n├── app/\n├── bootstrap/\n├── config/\n├── database/\n├── public/\n├── resources/\n├── routes/\n├── storage/\n├── tests/\n├── vendor/\n├── .env\n├── .env.example\n├── artisan\n└── composer.json\n```\n\nDo not try to understand every folder today. The high-level map is enough:\n\n```text\napp/          → your application code\nbootstrap/    → framework startup files\nconfig/       → configuration\ndatabase/     → migrations, factories, seeders\npublic/       → the public entry point\nresources/    → views and frontend assets\nroutes/       → your routes\nstorage/      → logs, cache, generated files\ntests/        → automated tests\n.env          → local environment configuration\nartisan       → Laravel's command-line tool\ncomposer.json → PHP dependencies\n```\n\n---\n\n### 3. Advanced — starter kits, and why to skip one\n\nWhile creating a project you may be offered a <b>starter kit</b> (a pre-built starting point containing common application functionality) — React, Vue, Svelte, Livewire, or None.\n\nChoosing <b>None</b> gives a clean application:\n\n```text\nLaravel\n   │\n   ↓\nClean foundation\n   │\n   ↓\nYou build your application\n```\n\nChoosing a kit gives you <b>scaffolding</b> (pre-generated code that provides a starting structure):\n\n```text\nLaravel\n   │\n   ↓\nStarter Kit\n   │\n   ├── Authentication\n   ├── Frontend setup\n   ├── Login\n   ├── Registration\n   └── Other scaffolding\n```\n\nFor learning Laravel itself, <b>None</b> is strongly recommended. A starter kit hides the very things you are here to understand:\n\n```text\nLaravel fundamentals\n        ↓\nUnderstand backend\n        ↓\nUnderstand routing\n        ↓\nUnderstand controllers\n        ↓\nUnderstand database\n        ↓\nUnderstand APIs\n        ↓\nThen add your preferred frontend\n```\n\n<b>Today's task is to create two applications</b>, so you can see exactly what a kit changes:\n\n```bash\nlaravel new laravel-basic     # starter kit → None\nlaravel new laravel-starter   # starter kit → React, say\n```\n\nThen open both and compare `app/`, `resources/`, `routes/`, `composer.json` and `package.json`. You will not understand every file yet. Seeing the difference is the point.",
        np: "अब तपाईं साँच्चैको केही बनाउनुहुन्छ।\n\n---\n\n### 1. आधारभूत — Laravel Herd र `.test` domain\n\n<b>Laravel Herd</b> (Laravel र PHP application चलाउन सजिलो बनाउने local development environment) ले धेरैजसो setup को काम हटाइदिन्छ।\n\nयसबिना तपाईंले यी सबै आफैं मिलाउनुपर्थ्यो:\n\n```text\nPHP install\n    ↓\nPHP configure\n    ↓\nWeb server configure\n    ↓\nLocal domain configure\n    ↓\nCertificate configure\n    ↓\nApplication सुरु\n```\n\nयससँग:\n\n```text\nHerd install\n     ↓\nPHP + local environment\n     ↓\nLaravel project बनाउने\n     ↓\n.test domain खोल्ने\n```\n\nHerd ले तपाईंका project <b>`.test` domain</b> मा दिन्छ, त्यसैले `localhost:8000` को सट्टा `my-app.test` चल्छ। यो local सुविधा मात्र हो:\n\n```text\nInternet\n   │\n   X          सार्वजनिक रूपमा पुग्न सकिँदैन\n   │\nतपाईंको computer\n   │\n   ↓\n Herd\n   │\n   ↓\nmy-app.test\n   │\n   ↓\nLaravel application\n```\n\n`.test` को अर्थ तपाईंको app internet मा छ भन्ने <b>होइन</b>।\n\n---\n\n### 2. मध्यम — `laravel new`\n\nLaravel installer ले एउटै command दिन्छ:\n\n```bash\nlaravel new blog\n```\n\nयसले पूरा application बनाउँछ:\n\n```text\nblog/\n├── app/\n├── bootstrap/\n├── config/\n├── database/\n├── public/\n├── resources/\n├── routes/\n├── storage/\n├── tests/\n├── vendor/\n├── .env\n├── .env.example\n├── artisan\n└── composer.json\n```\n\nआज हरेक folder बुझ्ने प्रयास नगर्नुहोस्। उच्च-स्तरको नक्सा पुग्छ:\n\n```text\napp/          → तपाईंको application code\nbootstrap/    → framework सुरु हुने file\nconfig/       → configuration\ndatabase/     → migration, factory, seeder\npublic/       → सार्वजनिक प्रवेश बिन्दु\nresources/    → view र frontend asset\nroutes/       → तपाईंका route\nstorage/      → log, cache, बनेका file\ntests/        → स्वचालित test\n.env          → local environment configuration\nartisan       → Laravel को command-line उपकरण\ncomposer.json → PHP dependency\n```\n\n---\n\n### 3. उन्नत — starter kit, र किन नछान्ने\n\nProject बनाउँदा तपाईंलाई <b>starter kit</b> (सामान्य application कार्यक्षमता भएको पूर्व-निर्मित सुरुवात बिन्दु) सोधिन सक्छ — React, Vue, Svelte, Livewire, वा None।\n\n<b>None</b> छान्दा सफा application आउँछ:\n\n```text\nLaravel\n   │\n   ↓\nसफा जग\n   │\n   ↓\nतपाईं आफ्नो application बनाउनुहुन्छ\n```\n\nKit छान्दा <b>scaffolding</b> (सुरुवाती संरचना दिने पूर्व-निर्मित code) आउँछ:\n\n```text\nLaravel\n   │\n   ↓\nStarter Kit\n   │\n   ├── Authentication\n   ├── Frontend setup\n   ├── Login\n   ├── Registration\n   └── अन्य scaffolding\n```\n\nLaravel आफैं सिक्न, <b>None</b> कडा सिफारिस गरिन्छ। Starter kit ले तपाईं बुझ्न आउनुभएकै कुरा लुकाउँछ:\n\n```text\nLaravel आधारभूत\n        ↓\nBackend बुझ्ने\n        ↓\nRouting बुझ्ने\n        ↓\nController बुझ्ने\n        ↓\nDatabase बुझ्ने\n        ↓\nAPI बुझ्ने\n        ↓\nअनि मनपर्ने frontend थप्ने\n```\n\n<b>आजको काम दुई application बनाउनु हो</b>, ताकि kit ले ठ्याक्कै के बदल्छ देख्न सकियोस्:\n\n```bash\nlaravel new laravel-basic     # starter kit → None\nlaravel new laravel-starter   # starter kit → React, मानौं\n```\n\nअनि दुबै खोलेर `app/`, `resources/`, `routes/`, `composer.json` र `package.json` तुलना गर्नुहोस्। अहिले हरेक file बुझ्नुहुन्न। फरक देख्नु नै उद्देश्य हो।",
        jp: "ここからは実際に作る。\n\n---\n\n### 1. 基本 — Laravel Herd と `.test` ドメイン\n\n<b>Laravel Herd</b>（LaravelやPHPアプリをローカルで動かしやすくする開発環境）は、準備の手間の大半を取り除く。\n\nこれがなければ、すべて自分で設定することになる:\n\n```text\nPHPを入れる\n    ↓\nPHPを設定する\n    ↓\nWebサーバーを設定する\n    ↓\nローカルドメインを設定する\n    ↓\n証明書を設定する\n    ↓\nアプリを起動する\n```\n\nHerdがあれば:\n\n```text\nHerdを入れる\n     ↓\nPHP + ローカル環境\n     ↓\nLaravelプロジェクトを作る\n     ↓\n.test ドメインを開く\n```\n\nHerdはプロジェクトを<b>`.test` ドメイン</b>で配信するので、`localhost:8000` の代わりに `my-app.test` が使える。ただしこれはローカルの利便性にすぎない:\n\n```text\nInternet\n   │\n   X          外からは届かない\n   │\n自分のPC\n   │\n   ↓\n Herd\n   │\n   ↓\nmy-app.test\n   │\n   ↓\nLaravelアプリ\n```\n\n`.test` はアプリがインターネット上にあるという意味では<b>ない</b>。\n\n---\n\n### 2. 中級 — `laravel new`\n\nLaravelのインストーラはコマンドを1つ与える:\n\n```bash\nlaravel new blog\n```\n\nこれで完成したアプリの骨格ができる:\n\n```text\nblog/\n├── app/\n├── bootstrap/\n├── config/\n├── database/\n├── public/\n├── resources/\n├── routes/\n├── storage/\n├── tests/\n├── vendor/\n├── .env\n├── .env.example\n├── artisan\n└── composer.json\n```\n\n今日すべてのフォルダを理解しようとしなくてよい。大づかみの地図で足りる:\n\n```text\napp/          → 自分のアプリのコード\nbootstrap/    → フレームワークの起動ファイル\nconfig/       → 設定\ndatabase/     → マイグレーション・ファクトリ・シーダ\npublic/       → 公開される入口\nresources/    → ビューとフロントの資材\nroutes/       → ルート\nstorage/      → ログ・キャッシュ・生成物\ntests/        → 自動テスト\n.env          → ローカルの環境設定\nartisan       → Laravelのコマンドラインツール\ncomposer.json → PHPの依存\n```\n\n---\n\n### 3. 上級 — スターターキットと、選ばない理由\n\nプロジェクト作成時に<b>スターターキット</b>（よくある機能をあらかじめ組み込んだ出発点）を尋ねられることがある。React・Vue・Svelte・Livewire・なし。\n\n<b>なし</b>を選べば、まっさらなアプリになる:\n\n```text\nLaravel\n   │\n   ↓\nきれいな土台\n   │\n   ↓\n自分でアプリを組み立てる\n```\n\nキットを選べば<b>スキャフォールディング</b>（出発点となる生成済みコード）が付く:\n\n```text\nLaravel\n   │\n   ↓\nStarter Kit\n   │\n   ├── 認証\n   ├── フロント構成\n   ├── ログイン\n   ├── 登録\n   └── その他の生成コード\n```\n\nLaravel自体を学ぶなら<b>なし</b>を強く勧める。スターターキットは、まさに理解しに来たものを覆い隠す:\n\n```text\nLaravelの基礎\n        ↓\nバックエンドを理解する\n        ↓\nルーティングを理解する\n        ↓\nコントローラを理解する\n        ↓\nデータベースを理解する\n        ↓\nAPIを理解する\n        ↓\nそのうえで好きなフロントを足す\n```\n\n<b>今日の課題はアプリを2つ作ること</b>。キットが何を変えるのかを自分の目で見るためだ:\n\n```bash\nlaravel new laravel-basic     # starter kit → なし\nlaravel new laravel-starter   # starter kit → 例えばReact\n```\n\n両方を開き、`app/`・`resources/`・`routes/`・`composer.json`・`package.json` を見比べる。今はすべてのファイルが分からなくてよい。差が見えることが目的だ。",
      },
      diagram: `Herd removes the setup, not the understanding

Without Herd                    With Herd

Install PHP                     Install Herd
    ↓                                ↓
Configure PHP                   PHP + local environment
    ↓                                ↓
Configure web server            Create Laravel project
    ↓                                ↓
Configure local domains         Open .test domain
    ↓
Configure certificates
    ↓
Start application


A .test domain is local only

Internet ── X ── not publicly reachable

Your computer → Herd → my-app.test → Laravel application


What laravel new leaves you with

blog/
├── app/           your application code
├── bootstrap/     framework startup
├── config/        configuration
├── database/      migrations, factories, seeders
├── public/        the public entry point
├── resources/     views and frontend assets
├── routes/        your routes
├── storage/       logs, cache, generated files
├── tests/         automated tests
├── .env           local environment configuration
├── artisan        Laravel's command-line tool
└── composer.json  PHP dependencies


Starter kit, or none

None                        A kit
  │                           │
  ↓                           ↓
clean foundation        auth, login, registration,
  │                     frontend scaffolding
  ↓                           │
you build it                  ↓
                        faster start, more to unlearn`,
      codeExample: {
        title: { en: "Creating both applications and comparing them", np: "दुबै application बनाएर तुलना गर्नु", jp: "2つのアプリを作って見比べる" },
        code: `# ── Application 1: no starter kit, the one you learn from ─────────
laravel new laravel-basic
# when prompted:  Starter kit → None

# ── Application 2: with a kit, so you can see the difference ──────
laravel new laravel-starter
# when prompted:  Starter kit → React (or any other)

# ── Compare them ──────────────────────────────────────────────────
# Open both projects and look at the same four places:
#
#   app/            did the kit add controllers or models?
#   resources/      did it add frontend files?
#   routes/         did it add auth routes you did not write?
#   composer.json   which PHP packages were added?
#   package.json    which JavaScript packages were added?
#
# Ask: what did the starter kit actually add?
# You will not understand every file yet. Seeing the difference is the point.

# ── The folders you will meet first ───────────────────────────────
# app/           your code
# routes/        where a URL is matched to code        (day 2)
# app/Http/      controllers live here                 (day 3)
# database/      migrations and seeders                (later)
# .env           configuration that differs per machine`,
      },
      keyTakeaways: [
        { en: "<b>Herd</b> gives you PHP, a web server and local domains without configuring each one.", np: "<b>Herd</b> ले हरेक कुरा configure नगरी PHP, web server र local domain दिन्छ।", jp: "<b>Herd</b> は個別の設定なしにPHP・Webサーバー・ローカルドメインを用意する。" },
        { en: "A <b>`.test` domain</b> is local only — it does not put your app on the internet.", np: "<b>`.test` domain</b> local मात्र हो — यसले तपाईंको app internet मा राख्दैन।", jp: "<b>`.test` ドメイン</b>はローカル専用。アプリがインターネットに出るわけではない。" },
        { en: "<b>`laravel new blog`</b> creates the whole application structure in one command.", np: "<b>`laravel new blog`</b> ले एउटै command मा पूरै application संरचना बनाउँछ।", jp: "<b>`laravel new blog`</b> はコマンド1つでアプリ構造をまるごと作る。" },
        { en: "A <b>starter kit</b> is optional pre-built scaffolding — authentication, login, frontend setup.", np: "<b>Starter kit</b> वैकल्पिक पूर्व-निर्मित scaffolding हो — authentication, login, frontend setup।", jp: "<b>スターターキット</b>は任意の生成済みコード。認証・ログイン・フロント構成など。" },
        { en: "Choose <b>None</b> while learning — a kit hides the parts you are trying to understand.", np: "सिक्दै गर्दा <b>None</b> छान्नुहोस् — kit ले बुझ्न खोजेकै भाग लुकाउँछ।", jp: "学習中は<b>なし</b>を選ぶ。キットは理解したい部分を覆い隠す。" },
        { en: "Build <b>both</b> today and compare `app/`, `resources/`, `routes/` and the two manifests.", np: "आज <b>दुबै</b> बनाउनुहोस् र `app/`, `resources/`, `routes/` तथा दुई manifest तुलना गर्नुहोस्।", jp: "今日は<b>両方</b>作り、`app/`・`resources/`・`routes/` と2つのマニフェストを見比べる。" },
      ],
      commonMistakes: [
        { en: "<b>Picking a starter kit on day 1 because it looks impressive</b> — the generated auth and frontend are exactly the parts this course teaches you to build.", np: "<b>प्रभावशाली देखिने भन्दैमा पहिलो दिनमै starter kit छान्नु</b> — बनेको auth र frontend नै यो course ले बनाउन सिकाउने भाग हुन्।", jp: "<b>見栄えがよいからと初日にキットを選ぶ</b> — 生成される認証とフロントこそ、この講座で作れるようになる部分。" },
        { en: "<b>Thinking a `.test` address is public</b> — it resolves only on your machine. Nobody else can reach it, and it is not a deployment.", np: "<b>`.test` ठेगाना सार्वजनिक हो भन्ने ठान्नु</b> — यो तपाईंकै machine मा मात्र चल्छ। अरू कसैले पुग्न सक्दैन, र यो deployment होइन।", jp: "<b>`.test` のアドレスが公開されていると思う</b> — 自分のマシンでしか解決しない。誰も到達できず、デプロイでもない。" },
        { en: "<b>Trying to learn every folder today</b> — `bootstrap/`, `storage/` and `vendor/` will make sense once you have a reason to open them.", np: "<b>आजै हरेक folder सिक्न खोज्नु</b> — `bootstrap/`, `storage/` र `vendor/` खोल्ने कारण भएपछि बुझिन्छ।", jp: "<b>今日すべてのフォルダを覚えようとする</b> — `bootstrap/`・`storage/`・`vendor/` は開く理由ができたとき腑に落ちる。" },
        { en: "<b>Editing files inside `vendor/`</b> — it is generated by Composer and will be wiped by the next `composer install`.", np: "<b>`vendor/` भित्रका file सम्पादन गर्नु</b> — यो Composer ले बनाउँछ र अर्को `composer install` ले मेटाउँछ।", jp: "<b>`vendor/` の中を編集する</b> — Composerが生成する場所で、次の `composer install` で消える。" },
      ],
      quiz: [
        {
          question: { en: "What does `laravel new blog` do?", np: "`laravel new blog` ले के गर्छ?", jp: "`laravel new blog` は何をするか?" },
          options: [
            { en: "Creates a new Laravel application", np: "नयाँ Laravel application बनाउँछ", jp: "新しいLaravelアプリを作る" },
            { en: "Deletes a project", np: "Project मेटाउँछ", jp: "プロジェクトを削除する" },
            { en: "Starts MySQL", np: "MySQL सुरु गर्छ", jp: "MySQLを起動する" },
            { en: "Creates a Git branch", np: "Git branch बनाउँछ", jp: "Gitブランチを作る" },
          ],
          correctIndex: 0,
          explanation: { en: "It scaffolds the whole directory structure in one command.", np: "यसले एउटै command मा पूरै directory संरचना बनाउँछ।", jp: "コマンド1つでディレクトリ構造をまるごと作る。" },
        },
        {
          question: { en: "What is a starter kit?", np: "Starter kit के हो?", jp: "スターターキットとは?" },
          options: [
            { en: "Optional pre-built scaffolding such as authentication and frontend setup", np: "Authentication र frontend setup जस्ता वैकल्पिक पूर्व-निर्मित scaffolding", jp: "認証やフロント構成などの、任意の生成済みコード" },
            { en: "A required part of every Laravel app", np: "हरेक Laravel app को अनिवार्य भाग", jp: "すべてのLaravelアプリに必須の部分" },
            { en: "A database seeder", np: "एउटा database seeder", jp: "データベースのシーダ" },
          ],
          correctIndex: 0,
          explanation: { en: "You can create a Laravel application without one, and while learning you should.", np: "यसबिना पनि Laravel application बनाउन सकिन्छ, र सिक्दै गर्दा त्यसै गर्नुपर्छ।", jp: "なしでも作れるし、学習中はそうすべき。" },
        },
        {
          question: { en: "What does a `.test` domain mean?", np: "`.test` domain को अर्थ के हो?", jp: "`.test` ドメインの意味は?" },
          options: [
            { en: "Your app is live on the internet", np: "तपाईंको app internet मा live छ", jp: "アプリがインターネット上で公開されている" },
            { en: "A local address served by Herd on your own machine", np: "तपाईंकै machine मा Herd ले दिने local ठेगाना", jp: "自分のマシンでHerdが配信するローカルのアドレス" },
            { en: "The app is in testing mode", np: "App testing mode मा छ", jp: "アプリがテストモードにある" },
          ],
          correctIndex: 1,
          explanation: { en: "Nobody outside your machine can reach it.", np: "तपाईंको machine बाहिरका कसैले पुग्न सक्दैनन्।", jp: "自分のマシンの外からは誰も到達できない。" },
        },
        {
          question: { en: "Which starter kit should you choose while learning Laravel fundamentals?", np: "Laravel आधारभूत सिक्दा कुन starter kit छान्ने?", jp: "Laravelの基礎を学ぶとき、どのスターターキットを選ぶべきか?" },
          options: [
            { en: "React, so you get a frontend", np: "React, ताकि frontend पाइयोस्", jp: "フロントが付くのでReact" },
            { en: "None, so nothing hides the parts you are learning", np: "None, ताकि सिकिरहेको भाग केहीले नलुकाओस्", jp: "なし。学んでいる部分が何にも覆われないように" },
            { en: "Livewire, because it is the newest", np: "Livewire, किनकि यो नयाँ हो", jp: "最新だからLivewire" },
          ],
          correctIndex: 1,
          explanation: { en: "The generated auth and frontend are exactly what the course teaches you to build.", np: "बनेको auth र frontend नै course ले बनाउन सिकाउने कुरा हुन्।", jp: "生成される認証とフロントこそ、講座で作れるようになるもの。" },
        },
        {
          question: { en: "Why create both `laravel-basic` and `laravel-starter` today?", np: "आज `laravel-basic` र `laravel-starter` दुबै किन बनाउने?", jp: "今日 `laravel-basic` と `laravel-starter` の両方を作る理由は?" },
          options: [
            { en: "To test the database connection", np: "Database connection जाँच्न", jp: "DB接続を試すため" },
            { en: "Because Laravel requires two projects", np: "किनकि Laravel लाई दुई project चाहिन्छ", jp: "Laravelが2つのプロジェクトを要求するから" },
            { en: "To see exactly what a starter kit adds", np: "Starter kit ले ठ्याक्कै के थप्छ देख्न", jp: "スターターキットが何を足すのかを実際に見るため" },
          ],
          correctIndex: 2,
          explanation: { en: "Compare `app/`, `resources/`, `routes/`, `composer.json` and `package.json`.", np: "`app/`, `resources/`, `routes/`, `composer.json` र `package.json` तुलना गर्नुहोस्।", jp: "`app/`・`resources/`・`routes/`・`composer.json`・`package.json` を見比べる。" },
        },
      ],
    },
    {
      id: "artisan-and-env",
      title: { en: "Artisan, .env and running the app", np: "Artisan, .env र app चलाउनु", jp: "Artisan・.env・アプリの起動" },
      durationMinutes: 9,
      explanation: {
        en: "You have a project. Now run it, and understand its configuration.\n\n---\n\n### 1. Basic — Artisan and `php artisan serve`\n\n<b>Artisan</b> (Laravel's command-line tool) performs common Laravel tasks from the terminal. The first one you need:\n\n```bash\nphp artisan serve\n```\n\n```text\nINFO  Server running on [http://127.0.0.1:8000].\n```\n\nOpen that address and you get the Laravel welcome page.\n\n```text\nBrowser\n   │\n   │ http://127.0.0.1:8000\n   ↓\nLaravel\n   │\n   ↓\nYour application\n```\n\nA <b>development server</b> (a server used while building and testing on your own machine) is not a production server:\n\n```text\nDevelopment                Production\n\nYour Mac/PC                Internet\n    ↓                          ↓\n Laravel                 Production server\n    ↓                          ↓\n Browser                    Laravel\n                               ↓\n                             Users\n```\n\nIf you use Herd, you now have two ways in — `php artisan serve` at `127.0.0.1:8000`, and Herd at `laravel-basic.test`. Both run the same application:\n\n```text\n                  Local Laravel App\n                         │\n              ┌──────────┴──────────┐\n              ↓                     ↓\n       artisan serve              Herd\n              │                     │\n              ↓                     ↓\n      localhost:8000          project.test\n```\n\n---\n\n### 2. Intermediate — `.env` and `.env.example`\n\n`.env` is the <b>environment file</b>. An <b>environment variable</b> (a value given to an application by its environment rather than hard-coded) holds configuration that changes between machines:\n\n```env\nAPP_NAME=Laravel\nAPP_ENV=local\nAPP_DEBUG=true\nAPP_URL=http://localhost\n\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_DATABASE=my_database\nDB_USERNAME=root\nDB_PASSWORD=\n```\n\nThe reason it exists: the same code runs in several places against different databases.\n\n```text\nApplication code\n       │\n       ↓\nEnvironment variables\n       │\n       ├── Development  → local database\n       ├── Staging      → staging database\n       └── Production   → production database\n```\n\nThe code never changes; only the values do.\n\nLaravel ships two files. `.env` holds your <b>real</b> local values. `.env.example` is a <b>template</b> listing the keys with the values blank:\n\n```text\n.env.example\n      │ template, committed to Git\n      ↓\n   Developer\n      │\n      ↓\n     .env\n      │ real values, never committed\n      ↓\nlocal configuration\n```\n\n`.env` stays out of version control because it holds database passwords, API keys and service credentials. Everyone clones the repository, copies `.env.example`, and fills in their own values.\n\n---\n\n### 3. Advanced — `APP_KEY` and writable directories\n\n`APP_KEY` is a secret Laravel generates for your application:\n\n```env\nAPP_KEY=base64:...\n```\n\nLaravel uses it for security work such as <b>encryption</b> (turning readable information into protected information that needs a key to read):\n\n```text\nSensitive data\n      │\n      ↓\n  Encryption\n      │\n      ↓\nProtected data\n```\n\nYou never invent this value:\n\n```bash\nphp artisan key:generate\n```\n\nDo not casually share a production `APP_KEY`.\n\nLaravel also needs to <b>write</b> to two directories:\n\n```text\nstorage/            logs, cache, compiled files\nbootstrap/cache/    cached configuration\n```\n\nWhen it cannot, you get failures that look unrelated:\n\n```text\nApplication error\n       ↓\n    Laravel\n       ↓\n storage/logs/\n       ↓\n Permission denied\n```\n\nA normal local setup usually gets this right. When you do hit a permissions error, resist the reflex:\n\n```bash\nchmod -R 777 .\n```\n\n`777` grants everyone full access to everything, which is almost never the actual fix. Find out which user the web server runs as first.\n\n---\n\n### Editor setup\n\nGive your editor PHP understanding. In VS Code, <b>Intelephense</b> (a PHP language server providing autocomplete, navigation and code analysis) is the common choice:\n\n```text\nYour PHP code\n      ↓\n Intelephense\n      ↓\nEditor understands your code\n      ↓\nAutocomplete + errors + navigation\n```\n\nWith it, typing `$user->` suggests the real properties on that model instead of nothing.",
        np: "Project भयो। अब यसलाई चलाउनुहोस्, र यसको configuration बुझ्नुहोस्।\n\n---\n\n### 1. आधारभूत — Artisan र `php artisan serve`\n\n<b>Artisan</b> (Laravel को command-line उपकरण) ले terminal बाट सामान्य Laravel काम गर्छ। पहिलो चाहिने:\n\n```bash\nphp artisan serve\n```\n\n```text\nINFO  Server running on [http://127.0.0.1:8000].\n```\n\nत्यो ठेगाना खोल्नुहोस्, Laravel को welcome page आउँछ।\n\n```text\nBrowser\n   │\n   │ http://127.0.0.1:8000\n   ↓\nLaravel\n   │\n   ↓\nतपाईंको application\n```\n\n<b>Development server</b> (आफ्नै machine मा बनाउँदा र परीक्षण गर्दा प्रयोग हुने server) production server होइन:\n\n```text\nDevelopment                Production\n\nतपाईंको Mac/PC             Internet\n    ↓                          ↓\n Laravel                 Production server\n    ↓                          ↓\n Browser                    Laravel\n                               ↓\n                             Users\n```\n\nHerd प्रयोग गर्नुहुन्छ भने अब दुई बाटो छन् — `127.0.0.1:8000` मा `php artisan serve`, र `laravel-basic.test` मा Herd। दुबैले उही application चलाउँछन्:\n\n```text\n                  Local Laravel App\n                         │\n              ┌──────────┴──────────┐\n              ↓                     ↓\n       artisan serve              Herd\n              │                     │\n              ↓                     ↓\n      localhost:8000          project.test\n```\n\n---\n\n### 2. मध्यम — `.env` र `.env.example`\n\n`.env` <b>environment file</b> हो। <b>Environment variable</b> (code मा नलेखी वातावरणले दिने मान) ले machine अनुसार बदलिने configuration राख्छ:\n\n```env\nAPP_NAME=Laravel\nAPP_ENV=local\nAPP_DEBUG=true\nAPP_URL=http://localhost\n\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_DATABASE=my_database\nDB_USERNAME=root\nDB_PASSWORD=\n```\n\nयो हुनुको कारण: उही code धेरै ठाउँमा फरक database सँग चल्छ।\n\n```text\nApplication code\n       │\n       ↓\nEnvironment variable\n       │\n       ├── Development  → local database\n       ├── Staging      → staging database\n       └── Production   → production database\n```\n\nCode कहिल्यै बदलिँदैन; मान मात्र बदलिन्छ।\n\nLaravel दुई file दिन्छ। `.env` ले तपाईंका <b>वास्तविक</b> local मान राख्छ। `.env.example` <b>template</b> हो, key सहित तर मान खाली:\n\n```text\n.env.example\n      │ template, Git मा commit हुन्छ\n      ↓\n   Developer\n      │\n      ↓\n     .env\n      │ वास्तविक मान, कहिल्यै commit हुँदैन\n      ↓\nlocal configuration\n```\n\n`.env` version control बाहिर रहन्छ किनकि यसमा database password, API key र service credential हुन्छन्। सबैले repository clone गर्छन्, `.env.example` copy गर्छन्, र आफ्ना मान भर्छन्।\n\n---\n\n### 3. उन्नत — `APP_KEY` र लेख्न मिल्ने directory\n\n`APP_KEY` Laravel ले तपाईंको application का लागि बनाउने गोप्य कुरा हो:\n\n```env\nAPP_KEY=base64:...\n```\n\nLaravel ले यो <b>encryption</b> (पढ्न मिल्ने जानकारीलाई key चाहिने संरक्षित जानकारीमा बदल्नु) जस्ता सुरक्षा कामका लागि प्रयोग गर्छ:\n\n```text\nसंवेदनशील data\n      │\n      ↓\n  Encryption\n      │\n      ↓\nसंरक्षित data\n```\n\nयो मान तपाईं कहिल्यै आफैं बनाउनुहुन्न:\n\n```bash\nphp artisan key:generate\n```\n\nProduction को `APP_KEY` लापरबाहीसँग नबाँड्नुहोस्।\n\nLaravel लाई दुई directory मा <b>लेख्न</b> पनि चाहिन्छ:\n\n```text\nstorage/            log, cache, compile भएका file\nbootstrap/cache/    cache गरिएको configuration\n```\n\nनसक्दा, असम्बन्धित देखिने असफलता आउँछ:\n\n```text\nApplication error\n       ↓\n    Laravel\n       ↓\n storage/logs/\n       ↓\n Permission denied\n```\n\nसामान्य local setup मा यो प्रायः ठीकै हुन्छ। Permission error आउँदा, यो झट्का रोक्नुहोस्:\n\n```bash\nchmod -R 777 .\n```\n\n`777` ले सबैलाई सबै कुरामा पूरा पहुँच दिन्छ, जुन झन्डै कहिल्यै वास्तविक समाधान होइन। पहिले web server कुन user का रूपमा चल्छ पत्ता लगाउनुहोस्।\n\n---\n\n### Editor setup\n\nआफ्नो editor लाई PHP बुझ्न दिनुहोस्। VS Code मा <b>Intelephense</b> (autocomplete, navigation र code विश्लेषण दिने PHP language server) सामान्य छनोट हो:\n\n```text\nतपाईंको PHP code\n      ↓\n Intelephense\n      ↓\nEditor ले तपाईंको code बुझ्छ\n      ↓\nAutocomplete + error + navigation\n```\n\nयससँग, `$user->` टाइप गर्दा त्यो model का वास्तविक property सुझाव आउँछ, केही नआउनुको सट्टा।",
        jp: "プロジェクトはできた。次は動かし、その設定を理解する。\n\n---\n\n### 1. 基本 — Artisan と `php artisan serve`\n\n<b>Artisan</b>（Laravelのコマンドラインツール）は、よくある作業をターミナルから行う。最初に必要なのはこれ:\n\n```bash\nphp artisan serve\n```\n\n```text\nINFO  Server running on [http://127.0.0.1:8000].\n```\n\nそのアドレスを開けば、Laravelのウェルカムページが出る。\n\n```text\nBrowser\n   │\n   │ http://127.0.0.1:8000\n   ↓\nLaravel\n   │\n   ↓\nあなたのアプリ\n```\n\n<b>開発サーバー</b>（自分のマシンで作りながら試すためのサーバー）は本番サーバーではない:\n\n```text\n開発                        本番\n\n自分のMac/PC                Internet\n    ↓                          ↓\n Laravel                 本番サーバー\n    ↓                          ↓\n Browser                    Laravel\n                               ↓\n                             利用者\n```\n\nHerdを使っているなら、入口が2つある。`127.0.0.1:8000` の `php artisan serve` と、`laravel-basic.test` のHerd。どちらも同じアプリを動かす:\n\n```text\n                  Local Laravel App\n                         │\n              ┌──────────┴──────────┐\n              ↓                     ↓\n       artisan serve              Herd\n              │                     │\n              ↓                     ↓\n      localhost:8000          project.test\n```\n\n---\n\n### 2. 中級 — `.env` と `.env.example`\n\n`.env` は<b>環境ファイル</b>。<b>環境変数</b>（コードに直書きせず環境から与える値）は、マシンごとに変わる設定を持つ:\n\n```env\nAPP_NAME=Laravel\nAPP_ENV=local\nAPP_DEBUG=true\nAPP_URL=http://localhost\n\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_DATABASE=my_database\nDB_USERNAME=root\nDB_PASSWORD=\n```\n\n存在する理由は、同じコードが複数の場所で別々のデータベースに向かって動くからだ。\n\n```text\nアプリのコード\n       │\n       ↓\n環境変数\n       │\n       ├── 開発    → ローカルDB\n       ├── ステージング → ステージングDB\n       └── 本番    → 本番DB\n```\n\nコードは変わらない。変わるのは値だけ。\n\nLaravelはファイルを2つ用意する。`.env` は<b>実際</b>のローカル値を持ち、`.env.example` はキーだけを並べ値は空の<b>ひな形</b>だ:\n\n```text\n.env.example\n      │ ひな形。Gitにコミットする\n      ↓\n   開発者\n      │\n      ↓\n     .env\n      │ 実際の値。コミットしない\n      ↓\nローカルの設定\n```\n\n`.env` をバージョン管理から外すのは、DBのパスワード・APIキー・各種の資格情報を持つからだ。各自がリポジトリをクローンし、`.env.example` を写して自分の値を入れる。\n\n---\n\n### 3. 上級 — `APP_KEY` と書き込み可能なディレクトリ\n\n`APP_KEY` は、Laravelがアプリのために生成する秘密の値:\n\n```env\nAPP_KEY=base64:...\n```\n\nLaravelはこれを<b>暗号化</b>（読める情報を、鍵がなければ読めない形に変えること）などの安全に関わる処理に使う:\n\n```text\n機微なデータ\n      │\n      ↓\n   暗号化\n      │\n      ↓\n保護されたデータ\n```\n\nこの値を自分で考えることはない:\n\n```bash\nphp artisan key:generate\n```\n\n本番の `APP_KEY` を軽々しく共有しないこと。\n\nLaravelは2つのディレクトリへ<b>書き込む</b>必要もある:\n\n```text\nstorage/            ログ・キャッシュ・コンパイル済みファイル\nbootstrap/cache/    キャッシュされた設定\n```\n\n書けないと、一見無関係な失敗が起きる:\n\n```text\nApplication error\n       ↓\n    Laravel\n       ↓\n storage/logs/\n       ↓\n Permission denied\n```\n\n普通のローカル環境ならたいてい問題ない。権限エラーに出会っても、この反射は抑える:\n\n```bash\nchmod -R 777 .\n```\n\n`777` は全員にすべての権限を与えるもので、本当の解決になることはまずない。まずWebサーバーがどのユーザーで動いているかを調べる。\n\n---\n\n### エディタの準備\n\nエディタにPHPを理解させる。VS Codeなら<b>Intelephense</b>（補完・定義移動・コード解析を提供するPHP言語サーバー）が定番:\n\n```text\n自分のPHPコード\n      ↓\n Intelephense\n      ↓\nエディタがコードを理解する\n      ↓\n補完 + エラー表示 + 定義移動\n```\n\nこれがあると、`$user->` と打った時点で、そのモデルの実際のプロパティが候補に出る。",
      },
      diagram: `Two doors into the same local application

                  Local Laravel App
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
       artisan serve              Herd
              │                     │
              ↓                     ↓
      localhost:8000          project.test


Development is not production

Development                Production

Your Mac/PC                Internet
    ↓                          ↓
 Laravel                 Production server
    ↓                          ↓
 Browser                    Laravel
                               ↓
                             Users


One codebase, three sets of values

Application code
       │
       ↓
Environment variables
       │
       ├── Development  → local database
       ├── Staging      → staging database
       └── Production   → production database


The two env files, and which one Git sees

.env.example  →  template, committed, values blank
     │
     ↓  copied by each developer
   .env       →  real values, never committed
                 database password, API keys, APP_KEY


Where Laravel must be able to write

storage/            logs, cache, compiled files
bootstrap/cache/    cached configuration

cannot write → "Permission denied" in places that look unrelated`,
      codeExample: {
        title: { en: "Running it, configuring it, keeping it secret", np: "चलाउनु, configure गर्नु, गोप्य राख्नु", jp: "動かす・設定する・秘密を守る" },
        code: `# ── Run the application ───────────────────────────────────────────
cd laravel-basic
php artisan serve
# INFO  Server running on [http://127.0.0.1:8000].

# With Herd you also get http://laravel-basic.test — same app, two doors.

# ── Generate the application key (once per project) ───────────────
php artisan key:generate
# writes APP_KEY=base64:... into .env

# ── .env holds what changes between machines ──────────────────────
# APP_NAME=Laravel
# APP_ENV=local
# APP_DEBUG=true
# APP_URL=http://localhost
#
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_DATABASE=my_database
# DB_USERNAME=root
# DB_PASSWORD=

# ── .env.example is the same keys with the values blank ───────────
# DB_DATABASE=
# DB_USERNAME=
# DB_PASSWORD=
#
# .env.example is committed.  .env is not: it holds passwords,
# API keys and APP_KEY. New developers copy the example and fill it in.

cp .env.example .env      # what you run after cloning someone's project
php artisan key:generate  # then give this copy its own key

# ── Laravel needs to write here ───────────────────────────────────
# storage/            logs, cache, compiled files
# bootstrap/cache/    cached configuration

# If you hit a permissions error, do NOT reach for this:
#   chmod -R 777 .
# 777 gives everyone full access to everything. Find out which user
# the web server runs as, and give that user access to those two paths.`,
      },
      keyTakeaways: [
        { en: "<b>Artisan</b> is Laravel's command-line tool; `php artisan serve` starts a local development server.", np: "<b>Artisan</b> Laravel को command-line उपकरण हो; `php artisan serve` ले local development server सुरु गर्छ।", jp: "<b>Artisan</b> はLaravelのコマンドラインツール。`php artisan serve` がローカル開発サーバーを起動する。" },
        { en: "A <b>development server</b> runs on your machine and is not the same thing as a production server.", np: "<b>Development server</b> तपाईंकै machine मा चल्छ र production server जस्तो होइन।", jp: "<b>開発サーバー</b>は自分のマシンで動くもので、本番サーバーとは別物。" },
        { en: "<b>`.env`</b> holds configuration that changes between machines, so the code itself never has to.", np: "<b>`.env`</b> ले machine अनुसार बदलिने configuration राख्छ, त्यसैले code आफैं बदल्नुपर्दैन।", jp: "<b>`.env`</b> はマシンごとに変わる設定を持つので、コード自体を変えずに済む。" },
        { en: "<b>`.env.example`</b> is the committed template; <b>`.env`</b> holds real secrets and is never committed.", np: "<b>`.env.example`</b> commit हुने template हो; <b>`.env`</b> ले वास्तविक गोप्य कुरा राख्छ र कहिल्यै commit हुँदैन।", jp: "<b>`.env.example`</b> はコミットするひな形。<b>`.env`</b> は実際の秘密を持ち、コミットしない。" },
        { en: "<b>`APP_KEY`</b> is a generated secret Laravel uses for encryption — run `php artisan key:generate`.", np: "<b>`APP_KEY`</b> Laravel ले encryption मा प्रयोग गर्ने बनाइएको गोप्य हो — `php artisan key:generate` चलाउनुहोस्।", jp: "<b>`APP_KEY`</b> はLaravelが暗号化に使う生成された秘密。`php artisan key:generate` を実行する。" },
        { en: "Laravel must be able to write to <b>`storage/`</b> and <b>`bootstrap/cache/`</b>.", np: "Laravel ले <b>`storage/`</b> र <b>`bootstrap/cache/`</b> मा लेख्न सक्नुपर्छ।", jp: "Laravelは<b>`storage/`</b> と<b>`bootstrap/cache/`</b> に書き込めなければならない。" },
        { en: "<b>`chmod -R 777`</b> is not the fix for a permissions error — find out which user the server runs as.", np: "Permission error को समाधान <b>`chmod -R 777`</b> होइन — server कुन user मा चल्छ पत्ता लगाउनुहोस्।", jp: "権限エラーの解決は<b>`chmod -R 777`</b> ではない。サーバーがどのユーザーで動くかを調べる。" },
      ],
      commonMistakes: [
        { en: "<b>Committing `.env`</b> — it carries database passwords, API keys and `APP_KEY`. Once pushed, those secrets are in the history even after you delete the file.", np: "<b>`.env` commit गर्नु</b> — यसले database password, API key र `APP_KEY` बोक्छ। Push भएपछि, file मेटाए पनि ती गोप्य कुरा history मै रहन्छन्।", jp: "<b>`.env` をコミットする</b> — DBのパスワード・APIキー・`APP_KEY` を含む。一度pushすれば、ファイルを消しても履歴に残る。" },
        { en: "<b>Forgetting `php artisan key:generate` after copying `.env.example`</b> — the app starts without an `APP_KEY` and fails on anything involving encryption.", np: "<b>`.env.example` copy गरेपछि `php artisan key:generate` बिर्सनु</b> — app `APP_KEY` बिना सुरु हुन्छ र encryption सम्बन्धी कुरामा असफल हुन्छ।", jp: "<b>`.env.example` を写した後 `php artisan key:generate` を忘れる</b> — `APP_KEY` なしで起動し、暗号化が絡むところで失敗する。" },
        { en: "<b>Running `chmod -R 777 .` to clear a permissions error</b> — it makes every file writable by everyone and hides the real cause, which is usually which user the web server runs as.", np: "<b>Permission error हटाउन `chmod -R 777 .` चलाउनु</b> — यसले हरेक file सबैलाई लेख्न मिल्ने बनाउँछ र वास्तविक कारण लुकाउँछ, जुन प्रायः web server कुन user मा चल्छ भन्ने हो।", jp: "<b>権限エラーを消すために `chmod -R 777 .` を走らせる</b> — 全ファイルを誰でも書ける状態にし、本当の原因（サーバーの実行ユーザー）を覆い隠す。" },
        { en: "<b>Treating `php artisan serve` as a way to deploy</b> — it is a development server for your own machine, not something to put in front of users.", np: "<b>`php artisan serve` लाई deploy गर्ने तरिका ठान्नु</b> — यो आफ्नै machine का लागि development server हो, user अगाडि राख्ने कुरा होइन।", jp: "<b>`php artisan serve` をデプロイ手段と考える</b> — 自分のマシン用の開発サーバーで、利用者の前に置くものではない。" },
      ],
      quiz: [
        {
          question: { en: "What is Artisan?", np: "Artisan के हो?", jp: "Artisanとは何か?" },
          options: [
            { en: "Laravel's database", np: "Laravel को database", jp: "Laravelのデータベース" },
            { en: "Laravel's command-line tool", np: "Laravel को command-line उपकरण", jp: "Laravelのコマンドラインツール" },
            { en: "Laravel's frontend framework", np: "Laravel को frontend framework", jp: "Laravelのフロントエンドフレームワーク" },
            { en: "A PHP editor", np: "एउटा PHP editor", jp: "PHPのエディタ" },
          ],
          correctIndex: 1,
          explanation: { en: "`php artisan serve` is the first of many Artisan commands you will use.", np: "`php artisan serve` तपाईंले प्रयोग गर्ने धेरै Artisan command मध्ये पहिलो हो।", jp: "`php artisan serve` は、これから使う多くのArtisanコマンドの最初の1つ。" },
        },
        {
          question: { en: "What does `php artisan serve` do?", np: "`php artisan serve` ले के गर्छ?", jp: "`php artisan serve` は何をするか?" },
          options: [
            { en: "Creates a database", np: "Database बनाउँछ", jp: "データベースを作る" },
            { en: "Starts a local development server", np: "Local development server सुरु गर्छ", jp: "ローカル開発サーバーを起動する" },
            { en: "Installs Composer", np: "Composer install गर्छ", jp: "Composerを入れる" },
            { en: "Creates a controller", np: "Controller बनाउँछ", jp: "コントローラを作る" },
          ],
          correctIndex: 1,
          explanation: { en: "It is for your own machine, not for putting an app in front of users.", np: "यो आफ्नै machine का लागि हो, app user अगाडि राख्न होइन।", jp: "自分のマシン用であって、利用者に公開するためではない。" },
        },
        {
          question: { en: "What is `.env`?", np: "`.env` के हो?", jp: "`.env` とは何か?" },
          options: [
            { en: "An environment configuration file", np: "Environment configuration file", jp: "環境設定のファイル" },
            { en: "A database", np: "एउटा database", jp: "データベース" },
            { en: "A PHP class", np: "एउटा PHP class", jp: "PHPのクラス" },
            { en: "A Git branch", np: "एउटा Git branch", jp: "Gitのブランチ" },
          ],
          correctIndex: 0,
          explanation: { en: "It holds the values that differ between your machine, staging and production.", np: "यसले तपाईंको machine, staging र production बीच फरक पर्ने मान राख्छ।", jp: "自分のマシン・ステージング・本番で異なる値を持つ。" },
        },
        {
          question: { en: "What is `.env.example` mainly for?", np: "`.env.example` मुख्यतः केका लागि हो?", jp: "`.env.example` の主な用途は?" },
          options: [
            { en: "Storing production passwords", np: "Production password राख्न", jp: "本番のパスワードを保存するため" },
            { en: "Storing database rows", np: "Database का row राख्न", jp: "DBの行を保存するため" },
            { en: "Running Laravel", np: "Laravel चलाउन", jp: "Laravelを動かすため" },
            { en: "Providing a committed template of the configuration a project expects", np: "Project ले अपेक्षा गर्ने configuration को commit हुने template दिन", jp: "プロジェクトが求める設定の、コミット可能なひな形を示すため" },
          ],
          correctIndex: 3,
          explanation: { en: "Each developer copies it to `.env` and fills in their own values.", np: "हरेक developer ले यसलाई `.env` मा copy गरी आफ्ना मान भर्छ।", jp: "各開発者がこれを `.env` に写し、自分の値を入れる。" },
        },
        {
          question: { en: "What is `APP_KEY` used for?", np: "`APP_KEY` केका लागि प्रयोग हुन्छ?", jp: "`APP_KEY` は何に使われるか?" },
          options: [
            { en: "Laravel's security work such as encryption", np: "Encryption जस्ता Laravel का सुरक्षा काम", jp: "暗号化などLaravelの安全に関わる処理" },
            { en: "Naming your application", np: "Application को नाम राख्न", jp: "アプリに名前を付けるため" },
            { en: "Starting the server", np: "Server सुरु गर्न", jp: "サーバーを起動するため" },
            { en: "Creating database tables", np: "Database table बनाउन", jp: "DBのテーブルを作るため" },
          ],
          correctIndex: 0,
          explanation: { en: "Generate it with `php artisan key:generate`; never invent it yourself.", np: "`php artisan key:generate` ले बनाउनुहोस्; आफैं कहिल्यै नबनाउनुहोस्।", jp: "`php artisan key:generate` で生成する。自分で作らない。" },
        },
        {
          question: { en: "Which directories must Laravel be able to write to?", np: "Laravel ले कुन directory मा लेख्न सक्नुपर्छ?", jp: "Laravelが書き込める必要があるディレクトリは?" },
          options: [
            { en: "`routes/` and `config/`", np: "`routes/` and `config/`", jp: "`routes/` and `config/`" },
            { en: "`.env` and `artisan`", np: "`.env` and `artisan`", jp: "`.env` and `artisan`" },
            { en: "`tests/` and `resources/`", np: "`tests/` and `resources/`", jp: "`tests/` and `resources/`" },
            { en: "`storage/` and `bootstrap/cache/`", np: "`storage/` and `bootstrap/cache/`", jp: "`storage/` and `bootstrap/cache/`" },
          ],
          correctIndex: 3,
          explanation: { en: "Logs, cache and compiled files are written there.", np: "Log, cache र compile भएका file त्यहीँ लेखिन्छन्।", jp: "ログ・キャッシュ・コンパイル済みファイルがそこに書かれる。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What is Laravel?", np: "Laravel के हो?", jp: "Laravelとは何か?" },
      options: [
        { en: "A database", np: "एउटा database", jp: "データベース" },
        { en: "A code editor", np: "एउटा code editor", jp: "コードエディタ" },
        { en: "A PHP framework", np: "एउटा PHP framework", jp: "PHPのフレームワーク" },
        { en: "A JavaScript package", np: "एउटा JavaScript package", jp: "JavaScriptのパッケージ" },
      ],
      correctIndex: 2,
      explanation: { en: "It gives structure and tools for the parts every web application needs.", np: "यसले हरेक web application लाई चाहिने भागका लागि संरचना र उपकरण दिन्छ।", jp: "どのWebアプリにも必要な部分に構造と道具を与える。" },
    },
    {
      question: { en: "What does Composer do?", np: "Composer ले के गर्छ?", jp: "Composerは何をするか?" },
      options: [
        { en: "Manages PHP dependencies", np: "PHP dependency व्यवस्थापन गर्छ", jp: "PHPの依存を管理する" },
        { en: "Runs SQL queries", np: "SQL query चलाउँछ", jp: "SQLクエリを実行する" },
        { en: "Creates Git branches", np: "Git branch बनाउँछ", jp: "Gitブランチを作る" },
        { en: "Runs the browser", np: "Browser चलाउँछ", jp: "ブラウザを動かす" },
      ],
      correctIndex: 0,
      explanation: { en: "It is to PHP what npm is to JavaScript.", np: "JavaScript लाई npm जे हो, PHP लाई Composer त्यही हो।", jp: "JavaScriptにとってのnpmが、PHPにとってのComposer。" },
    },
    {
      question: { en: "What does `laravel new blog` do?", np: "`laravel new blog` ले के गर्छ?", jp: "`laravel new blog` は何をするか?" },
      options: [
        { en: "Deletes a project", np: "Project मेटाउँछ", jp: "プロジェクトを削除する" },
        { en: "Creates a Git branch", np: "Git branch बनाउँछ", jp: "Gitブランチを作る" },
        { en: "Starts MySQL", np: "MySQL सुरु गर्छ", jp: "MySQLを起動する" },
        { en: "Creates a new Laravel application", np: "नयाँ Laravel application बनाउँछ", jp: "新しいLaravelアプリを作る" },
      ],
      correctIndex: 3,
      explanation: { en: "One command scaffolds the whole directory structure.", np: "एउटै command ले पूरै directory संरचना बनाउँछ।", jp: "コマンド1つでディレクトリ構造をまるごと作る。" },
    },
    {
      question: { en: "What is Artisan?", np: "Artisan के हो?", jp: "Artisanとは何か?" },
      options: [
        { en: "Laravel's database", np: "Laravel को database", jp: "Laravelのデータベース" },
        { en: "Laravel's command-line tool", np: "Laravel को command-line उपकरण", jp: "Laravelのコマンドラインツール" },
        { en: "Laravel's frontend framework", np: "Laravel को frontend framework", jp: "Laravelのフロントエンド" },
        { en: "A PHP editor", np: "एउटा PHP editor", jp: "PHPのエディタ" },
      ],
      correctIndex: 1,
      explanation: { en: "`php artisan serve` and `php artisan key:generate` are both Artisan commands.", np: "`php artisan serve` र `php artisan key:generate` दुबै Artisan command हुन्।", jp: "`php artisan serve` も `php artisan key:generate` もArtisanのコマンド。" },
    },
    {
      question: { en: "What does `php artisan serve` do?", np: "`php artisan serve` ले के गर्छ?", jp: "`php artisan serve` は何をするか?" },
      options: [
        { en: "Creates a database", np: "Database बनाउँछ", jp: "データベースを作る" },
        { en: "Installs Composer", np: "Composer install गर्छ", jp: "Composerを入れる" },
        { en: "Starts a local development server", np: "Local development server सुरु गर्छ", jp: "ローカル開発サーバーを起動する" },
        { en: "Creates a controller", np: "Controller बनाउँछ", jp: "コントローラを作る" },
      ],
      correctIndex: 2,
      explanation: { en: "It is a development server, not a way to deploy.", np: "यो development server हो, deploy गर्ने तरिका होइन।", jp: "開発サーバーであって、デプロイ手段ではない。" },
    },
    {
      question: { en: "What is `.env`?", np: "`.env` के हो?", jp: "`.env` とは何か?" },
      options: [
        { en: "An environment configuration file", np: "Environment configuration file", jp: "環境設定のファイル" },
        { en: "A database", np: "एउटा database", jp: "データベース" },
        { en: "A PHP class", np: "एउटा PHP class", jp: "PHPのクラス" },
        { en: "A Git branch", np: "एउटा Git branch", jp: "Gitのブランチ" },
      ],
      correctIndex: 0,
      explanation: { en: "It holds what changes between development, staging and production.", np: "यसले development, staging र production बीच बदलिने कुरा राख्छ।", jp: "開発・ステージング・本番で変わるものを持つ。" },
    },
    {
      question: { en: "What is `.env.example` mainly used for?", np: "`.env.example` मुख्यतः केका लागि प्रयोग हुन्छ?", jp: "`.env.example` は主に何に使うか?" },
      options: [
        { en: "Storing production passwords", np: "Production password राख्न", jp: "本番のパスワードを保存するため" },
        { en: "Providing a committed template of the expected configuration", np: "अपेक्षित configuration को commit हुने template दिन", jp: "想定される設定の、コミット可能なひな形を示すため" },
        { en: "Running Laravel", np: "Laravel चलाउन", jp: "Laravelを動かすため" },
        { en: "Storing database rows", np: "Database का row राख्न", jp: "DBの行を保存するため" },
      ],
      correctIndex: 1,
      explanation: { en: "`.env` itself stays out of Git because it holds real secrets.", np: "`.env` आफैं Git बाहिर रहन्छ किनकि यसमा वास्तविक गोप्य कुरा हुन्छन्।", jp: "`.env` 自体は実際の秘密を持つのでGitに入れない。" },
    },
    {
      question: { en: "What is `APP_KEY` used for?", np: "`APP_KEY` केका लागि प्रयोग हुन्छ?", jp: "`APP_KEY` は何に使われるか?" },
      options: [
        { en: "Laravel's security work such as encryption", np: "Encryption जस्ता सुरक्षा काम", jp: "暗号化などの安全に関わる処理" },
        { en: "Naming your application", np: "Application को नाम राख्न", jp: "アプリの名前を決めるため" },
        { en: "Starting the server", np: "Server सुरु गर्न", jp: "サーバーを起動するため" },
        { en: "Creating database tables", np: "Database table बनाउन", jp: "DBのテーブルを作るため" },
      ],
      correctIndex: 0,
      explanation: { en: "Generate it with `php artisan key:generate`.", np: "`php artisan key:generate` ले बनाउनुहोस्।", jp: "`php artisan key:generate` で生成する。" },
    },
    {
      question: { en: "Which directories need to be writable by Laravel?", np: "Laravel ले कुन directory मा लेख्न पाउनुपर्छ?", jp: "Laravelが書き込める必要があるのは?" },
      options: [
        { en: "`routes/` and `config/`", np: "`routes/` and `config/`", jp: "`routes/` and `config/`" },
        { en: "`.env` and `artisan`", np: "`.env` and `artisan`", jp: "`.env` and `artisan`" },
        { en: "`tests/` and `resources/`", np: "`tests/` and `resources/`", jp: "`tests/` and `resources/`" },
        { en: "`storage/` and `bootstrap/cache/`", np: "`storage/` and `bootstrap/cache/`", jp: "`storage/` and `bootstrap/cache/`" },
      ],
      correctIndex: 3,
      explanation: { en: "Logs, cache and compiled files are written there.", np: "Log, cache र compile भएका file त्यहीँ लेखिन्छन्।", jp: "ログ・キャッシュ・コンパイル済みファイルがそこに書かれる。" },
    },
    {
      question: { en: "Which starter kit should you pick while learning Laravel fundamentals?", np: "Laravel आधारभूत सिक्दा कुन starter kit छान्ने?", jp: "Laravelの基礎を学ぶとき、どのスターターキットを選ぶべきか?" },
      options: [
        { en: "None, so nothing hides the parts you are learning", np: "None, ताकि सिकिरहेको भाग केहीले नलुकाओस्", jp: "なし。学んでいる部分が覆い隠されないように" },
        { en: "Whichever looks most impressive", np: "जुन सबैभन्दा प्रभावशाली देखिन्छ", jp: "最も見栄えのするもの" },
        { en: "Always React", np: "सधैं React", jp: "常にReact" },
      ],
      correctIndex: 0,
      explanation: { en: "The generated auth and frontend are what the course teaches you to build.", np: "बनेको auth र frontend नै course ले बनाउन सिकाउने कुरा हुन्।", jp: "生成される認証とフロントこそ、講座で作れるようになるもの。" },
    },
  ],
};
