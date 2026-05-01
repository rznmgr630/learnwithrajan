import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Three tools for deferring and scheduling work: **Queues** for offloading slow jobs (emails, webhooks, image processing) to a background worker; **Events & Listeners** for decoupled in-process communication; and **Task Scheduling** to replace cron jobs with an expressive PHP API.",
      np: "Queue (slow task), Event/Listener (decoupled), Scheduling (cron)। तीन tool एउटै day।",
      jp: "Queue は重い処理を非同期化、Event/Listener は疎結合な通知、Scheduling は cron の代替。3 つのツールを習得。",
    },
  ],
  sections: [
    {
      title: {
        en: "Jobs & queue dispatching",
        np: "Job र queue dispatch",
        jp: "Job とキューディスパッチ",
      },
      blocks: [
        {
          type: "diagram",
          id: "laravel-queue-job",
        },
        {
          type: "paragraph",
          text: {
            en: "A **Job** is a PHP class that implements `ShouldQueue`. When dispatched, Laravel serializes it and pushes it onto a queue backend. A separate `queue:work` process (the worker) picks jobs off the queue and calls `handle()`. This keeps HTTP responses fast — never block a web request on slow operations.",
            np: "`ShouldQueue` implement गर्नु। Worker ले `handle()` call। HTTP fast।",
            jp: "`ShouldQueue` を実装したクラスがジョブ。ワーカーが `handle()` を実行。HTTP を速く保つ。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Queue driver comparison",
            np: "Queue driver तुलना",
            jp: "Queue ドライバー比較",
          },
          headers: [
            { en: "Driver", np: "Driver", jp: "ドライバー" },
            { en: "Best for", np: "प्रयोग", jp: "用途" },
            { en: "Requires", np: "आवश्यक", jp: "必要なもの" },
            { en: "Production-ready?", np: "Production?", jp: "本番対応？" },
          ],
          rows: [
            [
              { en: "`sync`", np: "`sync`", jp: "`sync`" },
              { en: "Local development / testing", np: "Dev/test", jp: "開発・テスト用" },
              { en: "Nothing", np: "केही होइन", jp: "不要" },
              { en: "No (runs inline)", np: "होइन", jp: "No（同期実行）" },
            ],
            [
              { en: "`database`", np: "`database`", jp: "`database`" },
              { en: "Small apps, low volume", np: "Small app", jp: "小規模アプリ" },
              { en: "`jobs` table migration", np: "`jobs` table", jp: "`jobs` テーブル" },
              { en: "Yes (limited throughput)", np: "हो (सीमित)", jp: "Yes（低スループット）" },
            ],
            [
              { en: "`redis`", np: "`redis`", jp: "`redis`" },
              { en: "High-volume production", np: "High volume", jp: "高負荷本番" },
              { en: "Redis server + predis/phpredis", np: "Redis", jp: "Redis サーバー" },
              { en: "Yes (recommended)", np: "हो (सिफारिश)", jp: "Yes（推奨）" },
            ],
            [
              { en: "`sqs`", np: "`sqs`", jp: "`sqs`" },
              { en: "AWS-hosted workloads", np: "AWS", jp: "AWS 環境" },
              { en: "AWS credentials + `aws/aws-sdk-php`", np: "AWS credentials", jp: "AWS 認証情報" },
              { en: "Yes (fully managed)", np: "हो (managed)", jp: "Yes（フルマネージド）" },
            ],
          ],
        },
        {
          type: "code",
          title: { en: "Creating a Job", np: "Job बनाउने", jp: "Job の作成" },
          code: `php artisan make:job SendWelcomeEmail`,
        },
        {
          type: "code",
          title: { en: "Job class anatomy", np: "Job class", jp: "Job クラスの構造" },
          code: `// app/Jobs/SendWelcomeEmail.php
namespace App\\Jobs;

use App\\Models\\User;
use App\\Mail\\WelcomeMail;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Bus\\Dispatchable;
use Illuminate\\Queue\\InteractsWithQueue;
use Illuminate\\Queue\\SerializesModels;
use Illuminate\\Support\\Facades\\Mail;

class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** Number of times the job may be attempted. */
    public int $tries = 3;

    /** Timeout in seconds before the job is considered failed. */
    public int $timeout = 60;

    /** Number of seconds to wait before retrying. */
    public int $backoff = 30;

    public function __construct(
        public readonly User $user
    ) {}

    public function handle(): void
    {
        Mail::to($this->user->email)
            ->send(new WelcomeMail($this->user));
    }
}`,
        },
        {
          type: "code",
          title: { en: "Dispatching jobs", np: "Job dispatch", jp: "Job のディスパッチ" },
          code: `use App\\Jobs\\SendWelcomeEmail;
use App\\Jobs\\GenerateThumbnail;
use App\\Jobs\\SendInvoice;
use Illuminate\\Support\\Facades\\Bus;

// Immediate dispatch
SendWelcomeEmail::dispatch($user);

// Delayed dispatch — run 5 minutes from now
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));

// Specific queue channel
SendWelcomeEmail::dispatch($user)->onQueue('emails');

// Dispatch to a specific connection + queue
SendWelcomeEmail::dispatch($user)
    ->onConnection('redis')
    ->onQueue('high');

// Chained jobs — run sequentially, stop on failure
Bus::chain([
    new GenerateThumbnail($post),
    new SendInvoice($order),
    new SendWelcomeEmail($user),
])->onQueue('default')->dispatch();

// Run queue worker
// php artisan queue:work --queue=high,emails,default
// php artisan queue:work redis --tries=3 --timeout=90`,
        },
      ],
    },
    {
      title: {
        en: "Failed jobs & retry strategy",
        np: "Failed job र retry",
        jp: "失敗したジョブとリトライ戦略",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When a job exceeds `$tries` or throws an unhandled exception, Laravel marks it as **failed** in the `failed_jobs` table. The `failed()` method on the job is called before that happens — use it to clean up or notify. You can inspect, retry, and prune failed jobs with artisan commands.",
            np: "`$tries` पार भए `failed_jobs` table। `failed()` method clean up गर्न।",
            jp: "`$tries` を超えるか例外が起きると `failed_jobs` に記録。`failed()` でクリーンアップ。",
          },
        },
        {
          type: "code",
          title: { en: "failed() method + artisan commands", np: "failed() र artisan", jp: "failed() とコマンド" },
          code: `// Inside the job class
public function failed(\\Throwable $exception): void
{
    // Notify the user, clean up partial work, send alert
    $this->user->notify(new JobFailedNotification($exception->getMessage()));

    Log::error('SendWelcomeEmail failed', [
        'user_id' => $this->user->id,
        'error'   => $exception->getMessage(),
    ]);
}

// Manually fail from inside handle()
public function handle(): void
{
    if (! $this->user->isActive()) {
        $this->fail(new \\RuntimeException('User is not active'));
        return;
    }
    // ...
}

// Artisan commands for failed jobs
// php artisan queue:failed              — list all failed jobs
// php artisan queue:retry <id>          — retry one job by ID
// php artisan queue:retry all           — retry all failed jobs
// php artisan queue:forget <id>         — delete one failed job
// php artisan queue:flush               — delete ALL failed jobs
// php artisan queue:failed-table        — create failed_jobs migration`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Laravel Horizon** is a Redis-backed queue dashboard (`composer require laravel/horizon`). It provides real-time monitoring of throughput, job runtimes, failed jobs, and queue depths via a beautiful web UI at `/horizon`. Essential for production Redis queues.",
            np: "Horizon — Redis queue dashboard। `/horizon` UI। Production मा essential।",
            jp: "Horizon は Redis キューのダッシュボード。スループット・失敗・深さをリアルタイム表示。",
          },
        },
      ],
    },
    {
      title: {
        en: "Events & Listeners",
        np: "Event र Listener",
        jp: "イベントとリスナー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Events** decouple the parts of your application that 'something happened' from the parts that 'do something about it'. An `OrderShipped` event carries data; one or more **Listeners** respond. In Laravel 11, listeners are auto-discovered — no registration in `EventServiceProvider` needed.",
            np: "Event = something happened। Listener = respond। Laravel 11 मा auto-discover।",
            jp: "Event は「何かが起きた」の通知、Listener が「対応する」。Laravel 11 は自動検出。",
          },
        },
        {
          type: "code",
          title: { en: "Generate Event & Listener", np: "Generate", jp: "生成コマンド" },
          code: `php artisan make:event OrderShipped
php artisan make:listener SendShipmentNotification --event=OrderShipped
php artisan make:listener UpdateInventory --event=OrderShipped`,
        },
        {
          type: "code",
          title: { en: "Event class", np: "Event class", jp: "Event クラス" },
          code: `// app/Events/OrderShipped.php
namespace App\\Events;

use App\\Models\\Order;
use Illuminate\\Foundation\\Events\\Dispatchable;
use Illuminate\\Queue\\SerializesModels;

class OrderShipped
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Order $order
    ) {}
}`,
        },
        {
          type: "code",
          title: { en: "Queueable Listener", np: "Queueable Listener", jp: "キュー対応リスナー" },
          code: `// app/Listeners/SendShipmentNotification.php
namespace App\\Listeners;

use App\\Events\\OrderShipped;
use App\\Notifications\\OrderShippedNotification;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Queue\\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public string $queue = 'notifications';
    public int $delay = 10; // seconds

    public function handle(OrderShipped $event): void
    {
        $event->order->user->notify(
            new OrderShippedNotification($event->order)
        );
    }

    public function failed(OrderShipped $event, \\Throwable $exception): void
    {
        Log::error('Shipment notification failed', ['order' => $event->order->id]);
    }
}`,
        },
        {
          type: "code",
          title: { en: "Dispatching events", np: "Event dispatch", jp: "Event のディスパッチ" },
          code: `use App\\Events\\OrderShipped;

// Option 1: global helper
event(new OrderShipped($order));

// Option 2: static dispatch method (same result)
OrderShipped::dispatch($order);

// Option 3: fire-and-forget on Eloquent model event
// (define in boot() or as Model::observe())
Order::created(fn (Order $order) => OrderShipped::dispatch($order));

// Manual registration (Laravel 10 / if auto-discovery disabled)
// app/Providers/EventServiceProvider.php
protected $listen = [
    OrderShipped::class => [
        SendShipmentNotification::class,
        UpdateInventory::class,
    ],
];`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Broadcasting** events to the frontend (e.g. for live dashboards) uses Pusher, Ably, or a self-hosted Soketi server. The event implements `ShouldBroadcast`, and the frontend subscribes via `Echo`. This is a separate topic — see the Laravel Broadcasting docs for full setup.",
            np: "Broadcasting — Pusher/Soketi। Frontend subscribe गर्छ। Separate topic।",
            jp: "ブロードキャストは Pusher/Soketi でフロントエンドにリアルタイム通知。`ShouldBroadcast` を実装。",
          },
        },
      ],
    },
    {
      title: {
        en: "Task Scheduling",
        np: "Task Scheduling",
        jp: "タスクスケジューリング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel's scheduler replaces a tangle of cron jobs with a single cron entry that runs every minute, plus an expressive PHP API to define when each command/closure runs. In **Laravel 11**, scheduling lives in `routes/console.php`. In **Laravel 10**, it lives in `app/Console/Kernel.php`.",
            np: "One cron entry (every minute), baaki sab PHP maa। Laravel 11 मा `routes/console.php`।",
            jp: "1 分ごとの cron 1 エントリーで動く。Laravel 11 は `routes/console.php` にスケジュール定義。",
          },
        },
        {
          type: "code",
          title: { en: "Creating a scheduled command", np: "Command बनाउने", jp: "コマンドの作成" },
          code: `php artisan make:command SendWeeklyReport`,
        },
        {
          type: "code",
          title: { en: "Schedule definitions (Laravel 11 — routes/console.php)", np: "Schedule define", jp: "スケジュール定義" },
          code: `// routes/console.php (Laravel 11)
use Illuminate\\Support\\Facades\\Schedule;

// Artisan commands
Schedule::command('emails:send')->dailyAt('09:00');
Schedule::command('reports:weekly')->weekly()->mondays()->at('08:00');
Schedule::command('db:backup')->daily()->timezone('Asia/Kathmandu');
Schedule::command('queue:prune-failed', ['--hours=48'])->daily();

// Every N minutes
Schedule::command('app:sync-inventory')->everyFiveMinutes();
Schedule::command('app:poll-webhooks')->everyMinute();

// Closures (for quick one-off tasks)
Schedule::call(function () {
    DB::table('sessions')->where('last_activity', '<', now()->subHours(2))->delete();
})->hourly();

// Overlap prevention — skip if previous run still executing
Schedule::command('app:process-images')
    ->everyMinute()
    ->withoutOverlapping();

// Run in background (don't block the scheduler process)
Schedule::command('app:heavy-report')
    ->daily()
    ->runInBackground()
    ->onSuccess(function () { Log::info('Report done'); })
    ->onFailure(function () { Log::error('Report failed'); });

// Send output to a log file
Schedule::command('inspire')
    ->hourly()
    ->appendOutputTo(storage_path('logs/inspire.log'));`,
        },
        {
          type: "code",
          title: { en: "Single server cron entry (add to server crontab)", np: "Server cron", jp: "サーバーの cron エントリー" },
          code: `# Run this ONE entry on your server — Laravel handles the rest
* * * * * cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1

# For local development
php artisan schedule:work    # polls every minute in foreground

# Test a specific scheduled task immediately
php artisan schedule:run

# List all scheduled tasks
php artisan schedule:list`,
        },
        {
          type: "paragraph",
          text: {
            en: "For **single-server scheduling** (avoid running jobs on every node in a cluster), add `->onOneServer()` after defining the schedule. This requires a shared cache (Redis or Memcached) as the lock driver — configure `CACHE_STORE=redis` in `.env`.",
            np: "Cluster মा एक मात्र server मा run: `->onOneServer()`। Shared cache चाहिन्छ।",
            jp: "クラスター環境で 1 台だけ実行したい場合は `->onOneServer()`。共有キャッシュが必要。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use Queues vs Events?",
        np: "Queue र Event कहिले प्रयोग गर्ने?",
        jp: "Queue と Event はどう使い分けますか？",
      },
      answer: {
        en: "Use **Queues** when you have a slow, isolated task (send email, call external API, resize image) that can be deferred without affecting the web response. Use **Events** when multiple parts of your app need to react to something that happened (order shipped → notify user, update inventory, log analytics) and you want the listener logic decoupled from the emitter. Events can optionally be queued too — just add `implements ShouldQueue` to the listener.",
        np: "Queue = slow deferred task। Event = decoupled reaction। Listener लाई ShouldQueue थप्न सकिन्छ।",
        jp: "Queue は遅い単発タスクの非同期化、Event は複数の疎結合な反応。Listener に `ShouldQueue` を付ければ両立できます。",
      },
    },
    {
      question: {
        en: "How do I monitor queue workers in production?",
        np: "Production मा queue worker monitor?",
        jp: "本番でキューワーカーを監視する方法は？",
      },
      answer: {
        en: "Use **Laravel Horizon** for Redis queues — it provides a real-time web dashboard and integrates with Supervisor. For non-Redis queues, use **Supervisor** (a process manager) with a config like `[program:laravel-worker] command=php artisan queue:work --tries=3`. Horizon also handles automatic worker restarts when you deploy new code via `php artisan horizon:terminate`.",
        np: "Horizon — Redis dashboard। Supervisor — process manager। Deploy मा `horizon:terminate`।",
        jp: "Redis なら Horizon が最適。Supervisor でワーカープロセスを管理。デプロイ後は `horizon:terminate`。",
      },
    },
    {
      question: {
        en: "What happens if a job fails all retries?",
        np: "Job सबै retry fail भए के हुन्छ?",
        jp: "全リトライが失敗したらどうなりますか？",
      },
      answer: {
        en: "The job is moved to the `failed_jobs` table with the exception message and stack trace. Laravel calls the `failed(Throwable $exception)` method on the job class (if defined). You can inspect failed jobs with `php artisan queue:failed`, retry with `php artisan queue:retry <id>` or `queue:retry all`, and delete with `queue:flush`. Set up notifications (Slack, email) in `AppServiceProvider` using `Queue::failing()` for real-time alerting.",
        np: "`failed_jobs` table मा जान्छ। `failed()` call। `queue:retry` ले retry।",
        jp: "`failed_jobs` テーブルに移動し `failed()` が呼ばれる。`queue:retry` で再試行可能。",
      },
    },
    {
      question: {
        en: "How do I test queued jobs?",
        np: "Queued job test कसरी?",
        jp: "キュージョブをテストする方法は？",
      },
      answer: {
        en: "Use `Queue::fake()` in your test to prevent jobs from actually running. After the code under test executes, assert with `Queue::assertPushed(SendWelcomeEmail::class)`, `Queue::assertPushedOn('emails', SendWelcomeEmail::class)`, or `Queue::assertNotPushed(...)`. To test the job's `handle()` method in isolation, simply instantiate it and call `handle()` directly — no queue needed.",
        np: "`Queue::fake()` — job push assert। `handle()` direct call test।",
        jp: "`Queue::fake()` でキューを偽装し `assertPushed()` で確認。`handle()` の単体テストは直接呼び出す。",
      },
    },
    {
      question: {
        en: "Can I dispatch an event inside a job?",
        np: "Job भित्र event dispatch गर्न मिल्छ?",
        jp: "Job の中でイベントをディスパッチできますか？",
      },
      answer: {
        en: "Yes, completely fine. Inside `handle()`, call `event(new SomeEvent($data))` or `SomeEvent::dispatch($data)`. Be careful with queueable listeners chained from inside a job — if the listener fails, it fails independently and doesn't roll back the parent job. For ordered processing, use `Bus::chain()` instead of events.",
        np: "`handle()` भित्र `event()` call गर्न मिल्छ। Listener failure parent job rollback गर्दैन।",
        jp: "`handle()` 内で `event()` を呼べます。リスナー失敗は親ジョブをロールバックしません。順序が必要なら `Bus::chain()` を使用。",
      },
    },
    {
      question: {
        en: "How does `->withoutOverlapping()` work?",
        np: "`withoutOverlapping()` कसरी काम गर्छ?",
        jp: "`->withoutOverlapping()` の仕組みは？",
      },
      answer: {
        en: "`->withoutOverlapping()` acquires an **atomic cache lock** before running the scheduled task. If a previous execution is still running, the new invocation is skipped entirely. The lock expires after 24 hours by default (configurable). It requires a cache driver that supports atomic locks (Redis, Memcached, database). This is essential for long-running tasks that can overlap in high-frequency schedules.",
        np: "Cache lock acquire। Previous run चलिरहेको छ भने skip। Redis/DB cache चाहिन्छ।",
        jp: "アトミックキャッシュロックを取得。前の実行が残っていればスキップ。Redis か DB キャッシュが必要。",
      },
    },
    {
      question: {
        en: "How do I handle tasks that must run only on one server in a cluster?",
        np: "Cluster मा एक server मा मात्र run?",
        jp: "クラスターで 1 台だけ実行する方法は？",
      },
      answer: {
        en: "Chain `->onOneServer()` to any scheduled task. This uses an atomic cache lock (same as `withoutOverlapping()`) but keyed per task across all servers. All cluster nodes run the scheduler every minute, but only the first one to acquire the lock actually executes. Requires a shared cache store (Redis recommended). Example: `Schedule::command('reports:generate')->daily()->onOneServer()`.",
        np: "`->onOneServer()` — shared cache lock। पहिलो server मात्र run।",
        jp: "`->onOneServer()` で共有キャッシュロックを使い 1 台だけ実行。Redis の共有キャッシュが必要。",
      },
    },
  ],
};
