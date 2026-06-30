import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_22_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Getting your app to production is the final mile — and often the most confusing part for beginners. There is no single \"right\" way to deploy Laravel; the right choice depends on your budget, team size, and traffic.\n\nAnalogy: it is like choosing how to get across town:\n• <b>Driving yourself</b> — a VPS with Laravel Forge (full control, you manage the car)\n• <b>Taking a taxi</b> — a Platform-as-a-Service (someone else drives, you just say the destination)\n• <b>Teleporting</b> — serverless Vapor on AWS Lambda (instant, no roads, pay per trip)\n\nEach has trade-offs in cost, control, and effort. Today covers the three main paths and the tooling that makes every deploy repeatable and safe.",
      np: "Laravel deploy गर्ने तीन मुख्य तरिका: VPS + Forge, Docker, र serverless Vapor। CI/CD र env config पनि।",
      jp: "本番デプロイの3つの主要な方法：Forge（VPS）、Docker、Vapor（サーバーレス）。CI/CDと環境設定も解説。",
    },
    {
      en: "The four pillars of production deployment:\n\n• <b>Environment config</b> — `.env` files, config caching, secrets management\n  ↳ Never commit `.env` to git; cache config on every deploy for speed\n• <b>Docker / Sail</b> — containerising your app for consistent dev-to-prod environments\n  ↳ Sail is for development; write a production Dockerfile for real deploys\n• <b>Laravel Forge</b> — managed server provisioning and deployment for VPS\n  ↳ Click to create a server; Forge installs PHP, Nginx, MySQL, Redis, SSL automatically\n• <b>Laravel Vapor</b> — serverless deployment on AWS Lambda\n  ↳ Zero server management, auto-scaling, pay per request\n• <b>CI/CD with GitHub Actions</b> — automated test + deploy on every push\n  ↳ Tests pass → deploy fires automatically — no manual steps, no forgotten commands",
      np: "Environment config, Docker/Sail, Forge, Vapor, र GitHub Actions CI/CD — पाँच pillars।",
      jp: "環境設定・Docker/Sail・Forge・Vapor・GitHub Actions CI/CD — 5つの柱。",
    },
  ],
  sections: [
    {
      title: {
        en: "Environment config & production checklist",
        np: "Environment config र production checklist",
        jp: "環境設定と本番チェックリスト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The `.env` file holds secrets that should never be in version control. In production, set values through your server's environment variables or a secrets manager — never by copying `.env` files between servers.\n\nLaravel caches the parsed config to disk for performance — run `php artisan config:cache` after every deploy. This turns hundreds of config file reads into one disk read per request.\n\nKey `.env` values for production:\n• `APP_ENV=production` and `APP_DEBUG=false` — debug mode exposes file paths, credentials, and stack traces to the browser\n• `APP_KEY` — used to encrypt cookies and sessions; if it changes, all sessions are invalidated\n  ↳ Generate once with `php artisan key:generate` and back it up\n• `CACHE_DRIVER=redis`, `SESSION_DRIVER=redis`, `QUEUE_CONNECTION=redis` — use Redis for all three in production",
            np: "`.env` git मा राख्नु हुँदैन। `APP_DEBUG=false` र Redis drivers set गर्नुहोस्।",
            jp: "`.env` は git に含めない。`APP_DEBUG=false` と Redis ドライバ設定が必須。",
          },
        },
        {
          type: "code",
          title: { en: "Production .env values & deploy command sequence", np: "Production .env र deploy commands", jp: "本番 .env とデプロイコマンド" },
          code: `# .env (production — set these via server panel, not a committed file)
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_KEY_HERE

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=my_app
DB_USERNAME=forge
DB_PASSWORD=secret

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1

# ─── Deploy command sequence (run in this order every deploy) ───
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan queue:restart
npm run build`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Why the order matters:</b>\n1. Install dependencies first (migration classes need them)\n2. Migrate before caching (new config may reference new DB structure)\n3. Cache everything after migration (stale cache during migration = errors)\n4. Restart queue workers last (they pick up new code after restart)\n\n`php artisan optimize` is a shorthand for config + route + view cache in one command — use it in Laravel 11+.",
            np: "Deploy order: install → migrate → cache → queue:restart। `php artisan optimize` shorthand।",
            jp: "デプロイ順序：install→migrate→cache→queue:restart。`php artisan optimize` でまとめて実行可。",
          },
        },
      ],
    },
    {
      title: {
        en: "Docker & Laravel Sail",
        np: "Docker र Laravel Sail",
        jp: "DockerとLaravel Sail",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Docker packages your app and all its dependencies (PHP, Nginx, MySQL, Redis) into containers — isolated processes that run identically on any machine.\n\nAnalogy: instead of telling a new team member \"install PHP 8.3, enable these extensions, configure Nginx to point to `public/`...\" you say \"run `docker compose up`\" and they have the exact same environment in minutes.\n\n<b>Laravel Sail</b> is Laravel's pre-built Docker development environment. It wraps common commands (`artisan`, `composer`, `npm`, `pest`) so you never need to install PHP or Node locally.",
            np: "Docker = consistent environment। Sail = Laravel को dev Docker wrapper — PHP locally install गर्नु पर्दैन।",
            jp: "Docker = 一貫した環境。Sail = Laravel の開発用 Docker ラッパー — PHP をローカルにインストール不要。",
          },
        },
        {
          type: "code",
          title: { en: "Laravel Sail — setup & daily commands", np: "Sail setup र commands", jp: "Sail セットアップとコマンド" },
          code: `# Create a new Laravel project with Sail (MySQL + Redis)
curl -s "https://laravel.build/my-app?with=mysql,redis" | bash
cd my-app

# Add a shell alias so you type 'sail' instead of './vendor/bin/sail'
alias sail='./vendor/bin/sail'

# Start all containers in the background
sail up -d

# Common Sail commands (these run inside the container)
sail artisan migrate
sail artisan tinker
sail composer require laravel/horizon
sail npm install
sail npm run dev

# Stop all containers
sail down

# View running containers
sail ps`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Sail is for development only.</b> For production Docker you need:\n• A production `Dockerfile` — no Xdebug, no dev dependencies, optimised PHP-FPM config\n• A production `docker-compose.yml` — with proper volume mounts, restart policies, healthchecks\n• An Nginx or Caddy container as the web server\n\nThe `serversideup/php` Docker Hub image is a popular production-ready base for Laravel. In large deployments, use Kubernetes to orchestrate the containers across multiple servers.",
            np: "Sail = development मात्र। Production मा production Dockerfile चाहिन्छ।",
            jp: "Sail は開発専用。本番では本番用 Dockerfile が必要。",
          },
        },
      ],
    },
    {
      title: {
        en: "Laravel Forge — VPS deployment made easy",
        np: "Laravel Forge — VPS deployment",
        jp: "Laravel Forge — VPS デプロイを簡単に",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Forge</b> is a web UI that provisions and manages Linux servers on any cloud provider — DigitalOcean, AWS, Linode, Hetzner, Vultr.\n\nAnalogy: Forge is the experienced sysadmin you don't have on the team. You click \"create server\" and it:\n• Installs PHP (your chosen version), Nginx, MySQL, Redis\n• Configures Nginx as a reverse proxy pointing to `public/`\n• Sets up Let's Encrypt SSL (auto-renewing)\n• Creates a `forge` deploy user with correct filesystem permissions\n• Configures Supervisor to keep queue workers running\n\nCost: $15/month for unlimited servers — far cheaper than a sysadmin.",
            np: "Forge = server provision गर्ने web UI। PHP, Nginx, MySQL, Redis, SSL सबै automatically।",
            jp: "Forge = サーバーを自動構成する Web UI。PHP・Nginx・MySQL・Redis・SSL を自動設定。",
          },
        },
        {
          type: "code",
          title: { en: "Forge deploy script & queue worker config", np: "Forge deploy script", jp: "Forge デプロイスクリプト" },
          code: `# ─── Forge deploy script (runs on every git push) ───
cd /home/forge/my-app
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize
php artisan queue:restart
npm ci
npm run build

# ─── Forge daemon (queue worker — runs 24/7 via Supervisor) ───
# Command:
php artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
# Processes: 2  (run 2 workers in parallel)
# Stop waiting seconds: 10

# ─── Forge daemon for Laravel Reverb (WebSocket server) ───
# Command:
php artisan reverb:start --port=8080
# Processes: 1`,
        },
        {
          type: "paragraph",
          text: {
            en: "Forge <b>Quick Deploy</b> fires the deploy script automatically when you push to the connected branch. Disable it for staging environments where you want manual control.\n\nForge also manages:\n• <b>SSL certificates</b> — Let's Encrypt, auto-renewing every 90 days\n• <b>Scheduled tasks</b> — adds the Laravel cron entry automatically\n• <b>Firewall rules</b> — opens only ports 80, 443, and 22 by default\n• <b>PHP version</b> — upgrade PHP without touching your server manually\n• <b>Server monitoring</b> — CPU, disk, memory alerts",
            np: "Quick Deploy = push गर्दा automatically deploy। SSL, cron, firewall सबै Forge ले manage।",
            jp: "Quick Deploy = プッシュで自動デプロイ。SSL・cron・ファイアウォールも Forge が管理。",
          },
        },
      ],
    },
    {
      title: {
        en: "Laravel Vapor — serverless on AWS",
        np: "Laravel Vapor — serverless deployment",
        jp: "Laravel Vapor — AWS サーバーレス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Vapor</b> deploys Laravel to AWS Lambda — a \"serverless\" environment where you don't manage any servers.\n\nAnalogy: instead of owning a restaurant (a server that runs 24/7 with fixed costs), you rent a kitchen by the minute, only when customers arrive. No customers = no cost. 10,000 customers at once = 10,000 kitchens spin up automatically.\n\nLambda runs your PHP code in response to HTTP requests, scales to zero when idle, and scales to thousands of concurrent executions under load — all automatically.",
            np: "Vapor = AWS Lambda मा Laravel। Server manage गर्नु पर्दैन, traffic अनुसार automatically scale।",
            jp: "Vapor = AWS Lambda で Laravel を動かす。サーバー管理不要、自動スケーリング。",
          },
        },
        {
          type: "code",
          title: { en: "vapor.yml config & deploy commands", np: "vapor.yml र deploy", jp: "vapor.yml とデプロイ" },
          code: `# Install Vapor CLI
composer global require laravel/vapor-cli

# vapor.yml (in project root)
id: 12345
name: my-app
environments:
  production:
    runtime: php-8.3:al2
    memory: 1024
    cli-memory: 512
    timeout: 30
    build:
      - npm ci
      - npm run build
      - php artisan event:cache
    deploy:
      - php artisan migrate --force
    queues:
      - default
      - high

# Deploy to production
vapor deploy production

# Roll back the last deploy
vapor rollback production

# Open the Vapor dashboard
vapor open`,
        },
        {
          type: "table",
          caption: {
            en: "Forge vs Vapor — when to use each",
            np: "Forge vs Vapor comparison",
            jp: "Forge vs Vapor — 使い分け",
          },
          headers: [
            { en: "Factor", np: "Factor", jp: "要素" },
            { en: "Forge (VPS)", np: "Forge (VPS)", jp: "Forge（VPS）" },
            { en: "Vapor (Serverless)", np: "Vapor (Serverless)", jp: "Vapor（サーバーレス）" },
          ],
          rows: [
            [
              { en: "Server management", np: "Server management", jp: "サーバー管理" },
              { en: "You manage (Forge automates it)", np: "Forge ले automate", jp: "Forge が自動化" },
              { en: "None — AWS manages everything", np: "AWS ले manage", jp: "AWS がすべて管理" },
            ],
            [
              { en: "Scaling", np: "Scaling", jp: "スケーリング" },
              { en: "Manual — add more servers", np: "Manual scaling", jp: "手動でサーバー追加" },
              { en: "Automatic — zero to millions", np: "Auto scale", jp: "自動スケーリング" },
            ],
            [
              { en: "Long-running jobs", np: "Long-running jobs", jp: "長時間ジョブ" },
              { en: "Fine — no time limit", np: "Time limit छैन", jp: "時間制限なし" },
              { en: "15-minute Lambda limit", np: "15 min limit", jp: "15分制限あり" },
            ],
            [
              { en: "Cost model", np: "Cost model", jp: "コストモデル" },
              { en: "Fixed per server/month", np: "Fixed monthly", jp: "月額固定" },
              { en: "Pay per request", np: "Per request pay", jp: "リクエスト課金" },
            ],
            [
              { en: "Best for", np: "Best for", jp: "向いている用途" },
              { en: "Predictable traffic, full control", np: "Predictable traffic", jp: "トラフィックが予測可能な場合" },
              { en: "Unpredictable spikes, zero ops", np: "Traffic spikes", jp: "急激なスパイクや運用ゼロ希望" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "CI/CD with GitHub Actions",
        np: "CI/CD with GitHub Actions",
        jp: "GitHub Actions で CI/CD",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>CI/CD</b> automates the \"run tests → deploy\" pipeline.\n\n• <b>CI (Continuous Integration)</b> — run tests on every push to catch bugs before they merge\n• <b>CD (Continuous Deployment)</b> — deploy automatically after tests pass\n\nWithout CI/CD: every deploy is manual (and risky — you might forget to run migrations, cache config, or restart workers). With CI/CD: push to `main` → tests run → deploy fires automatically — a repeatable, auditable process.\n\nGitHub Actions is free for public repos and has 2,000 free minutes/month for private repos.",
            np: "CI = tests run automatically। CD = tests pass भएपछि auto deploy। GitHub Actions = free।",
            jp: "CI = 自動テスト、CD = テスト通過後の自動デプロイ。GitHub Actions は無料。",
          },
        },
        {
          type: "code",
          title: { en: ".github/workflows/deploy.yml — test & deploy pipeline", np: "GitHub Actions workflow", jp: "GitHub Actions ワークフロー" },
          code: `# .github/workflows/deploy.yml
name: Test & Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_DATABASE: testing
          MYSQL_ROOT_PASSWORD: password
        ports: ['3306:3306']
        options: --health-cmd="mysqladmin ping" --health-interval=10s

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: pdo_mysql

      - name: Install dependencies
        run: composer install --no-interaction --prefer-dist

      - name: Prepare environment
        run: |
          cp .env.example .env
          php artisan key:generate

      - name: Run migrations
        run: php artisan migrate --force
        env:
          DB_CONNECTION: mysql
          DB_HOST: 127.0.0.1
          DB_DATABASE: testing
          DB_USERNAME: root
          DB_PASSWORD: password

      - name: Run tests
        run: php artisan test

  deploy:
    needs: test          # only runs if 'test' job passes
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Forge deploy
        run: curl -s "\${{ secrets.FORGE_DEPLOY_URL }}"`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Setting up the Forge deploy webhook:</b>\n1. In Forge → Sites → Your Site → Deployments → copy the \"Deploy Webhook\" URL\n2. In GitHub → Settings → Secrets → Actions → New secret: `FORGE_DEPLOY_URL`\n3. Paste the webhook URL as the secret value\n\nNow every push to `main` that passes tests triggers an automatic Forge deploy.\n\n<b>For Vapor deployments</b> replace the deploy step with:\n`vapor deploy production` using `VAPOR_API_TOKEN` as a GitHub secret.",
            np: "Forge webhook URL GitHub secret मा राख्नुहोस्। Push → test → deploy automatically।",
            jp: "Forge の Webhook URL を GitHub シークレットに登録。プッシュ→テスト→自動デプロイ。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between Forge and Envoyer?",
        np: "Forge र Envoyer मा के फरक छ?",
        jp: "Forge と Envoyer の違いは？",
      },
      answer: {
        en: "Forge provisions and manages the server — installs PHP, Nginx, MySQL, SSL, manages Supervisor daemons. Envoyer handles zero-downtime deployments — it deploys to a new directory, runs migrations and cache commands, then atomically symlinks the web root to the new release so there is no downtime window.\n\nThey work together: Forge manages the server, Envoyer manages the release process. For most apps, Forge alone is sufficient. Add Envoyer when downtime during the 10-30 second deploy window becomes a real problem.",
        np: "Forge = server manage। Envoyer = zero-downtime deployment। दुवै सँगै काम गर्छन्।",
        jp: "Forge はサーバー管理、Envoyer はゼロダウンタイムデプロイ。一緒に使うことも可能。",
      },
    },
    {
      question: {
        en: "Should I use Sail in production?",
        np: "Sail production मा use गर्नुहुन्छ?",
        jp: "Sail を本番環境で使うべき？",
      },
      answer: {
        en: "No. Sail is a development tool. Running Docker in production requires a production-grade Dockerfile (no Xdebug, no dev dependencies, optimised PHP-FPM settings), orchestration (Docker Compose or Kubernetes), healthcheck configuration, and careful resource limits.\n\nUse Sail to eliminate \"works on my machine\" problems between developers — everyone uses the same PHP version, extensions, and database. Then deploy to Forge or Vapor for production.",
        np: "Sail = development only। Production मा production Dockerfile चाहिन्छ।",
        jp: "Sail は開発専用。本番環境には本番用 Dockerfile が必要。",
      },
    },
    {
      question: {
        en: "How do I handle database migrations in a zero-downtime deploy?",
        np: "Zero-downtime deploy मा migrations कसरी handle गर्ने?",
        jp: "ゼロダウンタイムデプロイで DB マイグレーションをどう扱う？",
      },
      answer: {
        en: "Write only backwards-compatible migrations — never drop a column or rename it in the same deploy as the code change. Use the <b>expand/contract pattern</b>:\n\n1. Deploy 1 — add the new column with a default value (old code still works)\n2. Deploy 2 — update the code to write to the new column\n3. Deploy 3 — remove the old column (new code no longer reads it)\n\nThis ensures old code and new code can run simultaneously during the brief overlap window of a zero-downtime deploy.",
        np: "Expand/contract pattern: add column → update code → remove old column। 3 deploys।",
        jp: "Expand/contract パターン：列追加→コード更新→旧列削除の3段階デプロイ。",
      },
    },
    {
      question: {
        en: "How do I store secrets in CI/CD?",
        np: "CI/CD मा secrets कसरी store गर्ने?",
        jp: "CI/CD でシークレットはどう管理する？",
      },
      answer: {
        en: "Never put real credentials in `.yml` files — they are committed to git and visible to anyone with repo access.\n\n• <b>GitHub Actions</b> — use GitHub Secrets (Settings → Secrets → Actions). Reference as `${{ secrets.MY_SECRET }}`. They are masked in logs automatically.\n• <b>Forge</b> — set environment variables in the Forge server panel (encrypted at rest). They are injected into the PHP process environment on every request.\n• <b>Vapor</b> — set environment variables in the Vapor dashboard (encrypted at rest). Never commit them to `vapor.yml`.",
        np: "GitHub Secrets, Forge env panel, र Vapor dashboard — yaml file मा secrets राख्नु हुँदैन।",
        jp: "GitHub Secrets・Forge 環境変数パネル・Vapor ダッシュボードを使う。yml ファイルに書かない。",
      },
    },
    {
      question: {
        en: "What is the difference between `config:cache` and `config:clear`?",
        np: "`config:cache` र `config:clear` मा के फरक?",
        jp: "`config:cache` と `config:clear` の違いは？",
      },
      answer: {
        en: "`config:cache` compiles all config files into a single cached file (`bootstrap/cache/config.php`) — every request reads one file instead of dozens. Config changes are NOT visible until you re-run `config:cache`.\n\n`config:clear` deletes the cache so Laravel reads fresh config files on every request — useful when debugging a config issue locally, but slower in production.\n\nRule: always run `php artisan optimize` (which includes `config:cache`) after every production deploy. Run `php artisan optimize:clear` when debugging locally.",
        np: "`config:cache` = speed (cached)। `config:clear` = fresh read (slower)। Deploy पछि cache गर्नुहोस्।",
        jp: "`config:cache` = 高速（キャッシュ済み）。`config:clear` = 毎回読み直し（デバッグ用）。",
      },
    },
    {
      question: {
        en: "How do I roll back a bad deployment?",
        np: "Bad deployment rollback कसरी गर्ने?",
        jp: "デプロイ失敗時のロールバック方法は？",
      },
      answer: {
        en: "The method depends on your deployment tool:\n• <b>Forge</b> — push the previous commit to your branch: `git revert HEAD && git push`, or in the Forge UI trigger a deploy of the last known-good commit hash\n• <b>Envoyer</b> — click \"Rollback\" in the UI — it symlinks back to the previous release directory instantly (< 1 second)\n• <b>Vapor</b> — run `vapor rollback production` — it redeploys the previous Lambda version\n\nThe safest practice: run database migrations in a separate step BEFORE deploying code. That way, a code rollback never requires a schema rollback (which is very risky on production data).",
        np: "Forge = previous commit push। Envoyer = Rollback button। Vapor = `vapor rollback production`।",
        jp: "Forge = 旧コミットをプッシュ。Envoyer = Rollback ボタン。Vapor = `vapor rollback production`。",
      },
    },
  ],
};
