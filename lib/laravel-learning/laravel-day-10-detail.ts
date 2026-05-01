import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**File storage** abstracts local disk, S3, and any cloud driver behind a single `Storage` facade. File uploads from forms follow a standard `$request->file('field')->store()` pattern. **Laravel's HTTP Client** wraps Guzzle with a fluent, test-friendly API for calling external APIs.",
      np: "Storage facade ले local/S3 abstract। HTTP Client ले Guzzle wrap — fluent API।",
      jp: "Storage ファサードでローカル・S3・クラウドを抽象化。HTTP クライアントは Guzzle を流暢な API でラップします。",
    },
    {
      en: "**Mail** in Laravel uses Mailable classes with `envelope()` / `content()` methods and ships with drivers for SMTP, Mailgun, SES, and Postmark. **Notifications** are higher-level than mail — they can be sent via mail, SMS, Slack, browser push, or stored in a database table, all from a single `Notification` class.",
      np: "Mail: Mailable class, SMTP/Mailgun/SES driver। Notification: mail, database, Slack एकैपटक।",
      jp: "Mail は Mailable クラスで SMTP・Mailgun・SES などに対応。Notification はメール・SMS・Slack・DB など複数チャネルを 1 クラスで管理します。",
    },
  ],
  sections: [
    {
      title: {
        en: "File storage & uploads",
        np: "File storage र uploads",
        jp: "ファイルストレージとアップロード",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Configure disks in `config/filesystems.php`. The `local` disk stores in `storage/app`; `public` stores in `storage/app/public` (accessible via symlink at `public/storage`). Run `php artisan storage:link` to create the symlink. For S3, add credentials to `.env` and set `FILESYSTEM_DISK=s3`.",
            np: "`config/filesystems.php` मा disk configure। `php artisan storage:link` ले symlink बनाउँछ। S3 को लागि `.env` मा credentials।",
            jp: "`config/filesystems.php` でディスクを設定。S3 は `.env` に認証情報を追加し `FILESYSTEM_DISK=s3` に設定。`php artisan storage:link` でシンボリックリンクを作成します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Storage facade — read, write, delete",
            np: "Storage facade उदाहरण",
            jp: "Storage ファサードの操作",
          },
          code: `use Illuminate\\Support\\Facades\\Storage;

// ---- Write ----
Storage::put('reports/report.txt', $content);
Storage::disk('s3')->put('exports/data.csv', $csvContent);
Storage::prepend('logs/app.log', 'New entry');   // add to top
Storage::append('logs/app.log', 'New entry');    // add to bottom

// ---- Read ----
$content = Storage::get('reports/report.txt');
$url     = Storage::url('images/photo.jpg');     // public URL
$tempUrl = Storage::temporaryUrl('private/doc.pdf', now()->addMinutes(10)); // S3 only

// ---- Existence / metadata ----
Storage::exists('images/photo.jpg');
Storage::missing('images/photo.jpg');
Storage::size('images/photo.jpg');               // bytes
Storage::lastModified('images/photo.jpg');       // Unix timestamp
Storage::mimeType('images/photo.jpg');

// ---- Delete / copy / move ----
Storage::delete('images/old.jpg');
Storage::delete(['old1.jpg', 'old2.jpg']);
Storage::copy('from.jpg', 'to.jpg');
Storage::move('old.jpg', 'new.jpg');

// ---- List files ----
$files = Storage::files('avatars');
$all   = Storage::allFiles('avatars');           // recursive`,
        },
        {
          type: "code",
          title: {
            en: "File upload in a controller",
            np: "Controller मा file upload",
            jp: "コントローラでのファイルアップロード",
          },
          code: `use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

public function store(Request $request)
{
    $request->validate([
        'avatar' => ['required', 'image', 'max:2048'], // 2 MB limit
    ]);

    if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
        $file = $request->file('avatar');

        // store() auto-generates a unique filename and returns the path
        $path = $file->store('avatars', 'public');

        // storeAs() lets you set the filename explicitly
        $path = $file->storeAs('avatars', 'user-' . auth()->id() . '.jpg', 'public');

        // storeAs() on S3
        $path = $file->storeAs('avatars', $file->hashName(), 's3');

        // File metadata
        $originalName = $file->getClientOriginalName();  // original filename
        $extension    = $file->getClientOriginalExtension();
        $size         = $file->getSize();                 // bytes
        $mime         = $file->getMimeType();             // e.g. image/jpeg

        // Save path to DB
        auth()->user()->update(['avatar' => $path]);

        // Public URL
        $url = Storage::disk('public')->url($path);
    }

    return back()->with('success', 'Avatar uploaded!');
}`,
        },
        {
          type: "code",
          title: {
            en: "S3 configuration (.env)",
            np: "S3 configuration",
            jp: "S3 の設定",
          },
          code: `# .env
FILESYSTEM_DISK=s3

AWS_ACCESS_KEY_ID=your-key-id
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=my-app-bucket
AWS_USE_PATH_STYLE_ENDPOINT=false

# composer
composer require league/flysystem-aws-s3-v3 "^3.0" --with-all-dependencies`,
        },
      ],
    },
    {
      title: {
        en: "HTTP Client",
        np: "HTTP Client",
        jp: "HTTP クライアント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel's HTTP Client (`Illuminate\\Support\\Facades\\Http`) wraps Guzzle with a clean fluent interface, built-in retry logic, and first-class testing support via `Http::fake()`. It returns `Illuminate\\Http\\Client\\Response` with helper methods like `->json()`, `->status()`, `->successful()`, and `->throw()`.",
            np: "`Http` facade ले Guzzle wrap। `->json()`, `->status()`, `->successful()`, `->throw()`। Test मा `Http::fake()`।",
            jp: "`Http` ファサードは Guzzle をラップ。`->json()`・`->status()`・`->successful()`・`->throw()` などで便利に操作。テストは `Http::fake()` で完結します。",
          },
        },
        {
          type: "code",
          title: {
            en: "GET, POST with headers, auth, retries",
            np: "HTTP Client — GET, POST, headers, auth",
            jp: "GET・POST・認証・リトライの使用例",
          },
          code: `use Illuminate\\Support\\Facades\\Http;

// ---- GET ----
$response = Http::get('https://api.example.com/users');
$users    = $response->json();             // decode JSON body as array
$status   = $response->status();          // 200, 404, etc.
$ok       = $response->successful();      // 2xx
$failed   = $response->failed();          // 4xx or 5xx
$body     = $response->body();            // raw string

// ---- POST with JSON body ----
$response = Http::post('https://api.example.com/users', [
    'name'  => 'Alice',
    'email' => 'alice@example.com',
]);

// ---- POST as form data (application/x-www-form-urlencoded) ----
$response = Http::asForm()->post('https://api.example.com/login', [
    'username' => 'alice',
    'password' => 'secret',
]);

// ---- Custom headers ----
$response = Http::withHeaders([
    'X-App-Key'  => config('services.example.key'),
    'Accept'     => 'application/json',
])->get('https://api.example.com/items');

// ---- Authentication ----
Http::withToken($apiToken)->get('https://api.example.com/me');          // Bearer
Http::withBasicAuth('user', 'pass')->get('https://api.example.com/');   // Basic

// ---- Timeout & retry ----
$response = Http::timeout(10)
    ->retry(3, 500)   // 3 attempts, 500ms delay between
    ->get('https://api.example.com/slow-endpoint');

// ---- Throw on HTTP error (4xx / 5xx) ----
$response = Http::throw()->get('https://api.example.com/users');
// throws Illuminate\\Http\\Client\\RequestException on error

// Throw conditionally
$response->throwIf($response->status() === 429, 'Rate limited.');
$response->throwUnlessStatus(200);

// ---- Query parameters ----
Http::get('https://api.example.com/search', ['q' => 'laravel', 'page' => 2]);

// ---- File upload ----
Http::attach('photo', file_get_contents($path), 'photo.jpg')
    ->post('https://api.example.com/upload');`,
        },
        {
          type: "code",
          title: {
            en: "Testing with Http::fake()",
            np: "Http::fake() — testing",
            jp: "Http::fake() でテスト",
          },
          code: `// In your test
Http::fake([
    'api.example.com/users' => Http::response(['id' => 1, 'name' => 'Alice'], 200),
    'api.example.com/error' => Http::response(['message' => 'Not Found'], 404),
    '*' => Http::response([], 200), // catch-all fallback
]);

// Assert requests were made
Http::assertSent(function ($request) {
    return $request->url() === 'https://api.example.com/users'
        && $request->method() === 'GET';
});

Http::assertNotSent(fn ($r) => str_contains($r->url(), 'payment'));`,
        },
      ],
    },
    {
      title: {
        en: "Mailable classes & mail config",
        np: "Mailable classes र mail config",
        jp: "Mailable クラスとメール設定",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A **Mailable** class encapsulates everything needed to send one type of email: `envelope()` sets subject/from/cc/bcc, `content()` selects the Blade view or Markdown template, and `attachments()` lists files to attach. Always use queued mail (`Mail::to()->queue()`) for any production SMTP that may be slow.",
            np: "Mailable: `envelope()` (subject/from), `content()` (view), `attachments()`। Production मा queue।",
            jp: "Mailable は `envelope()` で件名・差出人、`content()` でテンプレート、`attachments()` で添付ファイルを設定します。本番の遅い SMTP には必ずキュー送信を使います。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create and define a Mailable",
            np: "Mailable बनाउनु",
            jp: "Mailable の生成と定義",
          },
          code: `php artisan make:mail WelcomeEmail
php artisan make:mail InvoicePaid --markdown=emails.invoice  # Markdown template

// app/Mail/WelcomeEmail.php
<?php

namespace App\\Mail;

use App\\Models\\User;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Mail\\Mailable;
use Illuminate\\Mail\\Mailables\\Content;
use Illuminate\\Mail\\Mailables\\Envelope;
use Illuminate\\Queue\\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels; // SerializesModels for queueing

    public function __construct(
        public readonly User $user, // public = auto-available in the view
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('noreply@myapp.com', 'MyApp'),
            replyTo: [new Address('support@myapp.com', 'Support')],
            subject: 'Welcome to MyApp, ' . $this->user->name . '!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',          // resources/views/emails/welcome.blade.php
            // markdown: 'emails.welcome',   // or Markdown-based
        );
    }

    public function attachments(): array
    {
        return [
            // Attachment::fromPath('/path/to/file.pdf')->as('guide.pdf'),
        ];
    }
}`,
        },
        {
          type: "code",
          title: {
            en: "Sending mail & SMTP .env config",
            np: "Mail पठाउनु र .env config",
            jp: "メール送信と .env 設定",
          },
          code: `use App\\Mail\\WelcomeEmail;
use Illuminate\\Support\\Facades\\Mail;

// Send immediately
Mail::to($user->email)->send(new WelcomeEmail($user));

// Send to multiple
Mail::to($user)
    ->cc('manager@myapp.com')
    ->bcc('audit@myapp.com')
    ->send(new WelcomeEmail($user));

// Queue (async — much better for production SMTP)
Mail::to($user)->queue(new WelcomeEmail($user));

// Queue with delay
Mail::to($user)->later(now()->addMinutes(5), new WelcomeEmail($user));

// ---- .env SMTP config ----
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com          # or smtp.mailgun.org, email-smtp.us-east-1.amazonaws.com
MAIL_PORT=587
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD="your-app-password"  # Gmail: use App Password, NOT your account password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@myapp.com
MAIL_FROM_NAME="MyApp"

# Preview emails locally without sending (catches all mail to log file)
MAIL_MAILER=log

# Or use Mailpit (https://github.com/axllent/mailpit) — an SMTP trap with web UI
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025`,
        },
      ],
    },
    {
      title: {
        en: "Notifications",
        np: "Notifications",
        jp: "通知",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Notifications are higher-level than Mailables. A single `Notification` class defines delivery via multiple **channels** in its `via()` method. Laravel ships with `mail`, `database`, `broadcast`, `vonage` (SMS), and community channels for Slack, Telegram, and more.",
            np: "Notification ले `via()` method मा multiple channel define गर्छ — mail, database, Slack।",
            jp: "Notification は `via()` で複数チャネルを宣言します。組み込みは `mail`・`database`・`broadcast`。コミュニティ製の Slack・Telegram チャネルも豊富です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create and define a Notification",
            np: "Notification बनाउनु",
            jp: "Notification の生成と定義",
          },
          code: `php artisan make:notification InvoicePaid

// app/Notifications/InvoicePaid.php
<?php

namespace App\\Notifications;

use App\\Models\\Invoice;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Notifications\\Notification;
use Illuminate\\Notifications\\Messages\\MailMessage;

class InvoicePaid extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Invoice $invoice,
    ) {}

    // Which channels to use
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];  // send email AND store in DB
    }

    // Mail channel
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Invoice #' . $this->invoice->id . ' Paid')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your invoice has been paid.')
            ->action('View Invoice', route('invoices.show', $this->invoice))
            ->line('Thank you for your business!');
    }

    // Database channel — stored in notifications table
    public function toDatabase(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'amount'     => $this->invoice->amount,
            'message'    => 'Invoice #' . $this->invoice->id . ' was paid.',
        ];
    }

    // toArray() is used by the database channel if toDatabase() is absent
    public function toArray(object $notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}`,
        },
        {
          type: "code",
          title: {
            en: "Sending notifications & reading from DB",
            np: "Notification पठाउनु र DB बाट पढ्नु",
            jp: "通知の送信と DB からの読み取り",
          },
          code: `use App\\Notifications\\InvoicePaid;
use Illuminate\\Support\\Facades\\Notification;

// ---- Send to a single user (using Notifiable trait) ----
// The User model uses Illuminate\\Notifications\\Notifiable;
$user->notify(new InvoicePaid($invoice));

// ---- Send to multiple users at once ----
Notification::send($users, new InvoicePaid($invoice));

// ---- On-demand notification (no User model needed) ----
Notification::route('mail', 'client@example.com')
    ->notify(new InvoicePaid($invoice));

// ---- Database notifications table ----
// Run: php artisan notifications:table && php artisan migrate

// Read unread notifications
$unread = $user->unreadNotifications;   // Collection of DatabaseNotification
foreach ($unread as $notification) {
    $data = $notification->data;        // the array from toDatabase()
    echo $data['message'];
}

// Mark as read
$user->unreadNotifications->markAsRead();
$notification->markAsRead();

// All notifications (read + unread)
$all = $user->notifications;

// Delete old notifications
$user->notifications()->delete();

// ---- Notifiable trait on User model ----
// The User model must use Illuminate\\Notifications\\Notifiable;
// This adds: notifications(), unreadNotifications(), readNotifications()`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I configure S3 storage and make files publicly accessible?",
        np: "S3 storage configure गरेर files public कसरी गर्ने?",
        jp: "S3 ストレージの設定とファイルの公開方法は？",
      },
      answer: {
        en: "Add AWS credentials to `.env` (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `AWS_BUCKET`), set `FILESYSTEM_DISK=s3`, and run `composer require league/flysystem-aws-s3-v3`. For public files, set the S3 bucket ACL to `public-read` or use `Storage::disk('s3')->setVisibility('path', 'public')` after upload. For private files, generate temporary signed URLs with `Storage::temporaryUrl('path', now()->addMinutes(30))`.",
        np: "`.env` मा AWS credentials, `FILESYSTEM_DISK=s3`, flysystem package install। Public: visibility `public`; Private: `temporaryUrl()`।",
        jp: "`.env` に AWS 認証情報を設定し `FILESYSTEM_DISK=s3`、`league/flysystem-aws-s3-v3` をインストール。公開ファイルは `setVisibility('path', 'public')`、非公開は `temporaryUrl()` を使います。",
      },
    },
    {
      question: {
        en: "What is the difference between `store()` and `storeAs()`?",
        np: "`store()` र `storeAs()` मा के फरक?",
        jp: "`store()` と `storeAs()` の違いは？",
      },
      answer: {
        en: "`store('directory', 'disk')` generates a random unique filename using the file's SHA-1 hash — guaranteed unique, safe from collisions. `storeAs('directory', 'filename.ext', 'disk')` lets you specify the exact filename. Use `store()` when uniqueness matters most (uploaded files); use `storeAs()` when the filename must be predictable (e.g., `user-42-avatar.jpg`).",
        np: "`store()` ले random unique name। `storeAs()` ले exact name। Collision-free upload: `store()`।",
        jp: "`store()` はハッシュベースのランダムなファイル名を生成。`storeAs()` はファイル名を指定します。衝突を避けたいアップロードには `store()`、ファイル名が決まっている場合は `storeAs()` を使います。",
      },
    },
    {
      question: {
        en: "How do I preview emails locally without sending them?",
        np: "Local मा email send नगरी preview कसरी?",
        jp: "メールをローカルで送信せずにプレビューするには？",
      },
      answer: {
        en: "Three options: (1) Set `MAIL_MAILER=log` to write all emails to `storage/logs/laravel.log`. (2) Use **Mailpit** (a local SMTP trap with a web UI at `localhost:8025`) — set `MAIL_HOST=127.0.0.1` and `MAIL_PORT=1025`. (3) Use **Laravel Sail**'s built-in Mailpit container. In Blade, you can also return a Mailable from a route for browser preview: `Route::get('/preview', fn() => new WelcomeEmail(User::first()))`.",
        np: "`MAIL_MAILER=log` (log file मा लेख्छ); Mailpit (local SMTP trap); route मा Mailable return गरेर preview।",
        jp: "`MAIL_MAILER=log` でログファイルに書き出し、Mailpit でローカル SMTP トラップ、またはルートから Mailable を直接返してブラウザプレビューできます。",
      },
    },
    {
      question: {
        en: "What is the `Notifiable` trait and which models need it?",
        np: "`Notifiable` trait के हो र कुन model मा चाहिन्छ?",
        jp: "`Notifiable` トレイトとはどのモデルに必要ですか？",
      },
      answer: {
        en: "The `Notifiable` trait (from `Illuminate\\Notifications\\Notifiable`) adds the `notify()` method plus relationship helpers `notifications()`, `unreadNotifications()`, and `readNotifications()` to any model. The default `User` model already uses it. Add it to any other model that should receive notifications — for example, a `Team` model or a `Customer` model. The trait also lets you route notifications to different addresses per channel by defining `routeNotificationFor{Channel}()` methods.",
        np: "`Notifiable` trait ले `notify()` र notification relationships थप्छ। User model मा default छ। अरू model मा manually use।",
        jp: "`Notifiable` トレイトは `notify()` と関係ヘルパを追加します。デフォルトの `User` モデルに含まれています。他のモデルにも `use Notifiable;` で追加できます。",
      },
    },
    {
      question: {
        en: "How do database notifications differ from email notifications?",
        np: "Database notification र email notification मा के फरक?",
        jp: "データベース通知とメール通知の違いは？",
      },
      answer: {
        en: "Email notifications are **fire-and-forget** — they go to an external mail server and you cannot read them back from Laravel. **Database notifications** are stored in the `notifications` table (run `php artisan notifications:table && php artisan migrate`) and are readable/queryable in PHP: `$user->unreadNotifications`. They are ideal for in-app notification bells, audit trails, and anything where you need to show the user their notification history. Both channels can be used simultaneously by returning `['mail', 'database']` from `via()`.",
        np: "Email notification fire-and-forget; Database notification `notifications` table मा store — PHP बाट read गर्न सकिन्छ। In-app bell को लागि।",
        jp: "メール通知は送りっぱなし。データベース通知は `notifications` テーブルに保存され、`$user->unreadNotifications` で参照可能。アプリ内の通知ベルや履歴表示に最適です。`via()` で両チャネルを同時に指定できます。",
      },
    },
    {
      question: {
        en: "How does Laravel's HTTP Client handle retries and what happens on failure?",
        np: "HTTP Client retry कसरी काम गर्छ र failure मा के हुन्छ?",
        jp: "HTTP クライアントのリトライの仕組みと失敗時の動作は？",
      },
      answer: {
        en: "`->retry($times, $sleepMilliseconds)` retries the request on connection errors or 5xx responses. If all attempts fail, an `Illuminate\\Http\\Client\\RequestException` is thrown. Use `->throw()` to always throw on 4xx/5xx, or `->throwIf($condition)` for conditional throwing. Chain `->throwUnlessStatus(200)` to ensure an exact status. For circuit-breaker logic, catch the exception and implement your own backoff strategy.",
        np: "`->retry(3, 500)` ले 3 attempts। सबै fail भए `RequestException`। `->throw()` ले 4xx/5xx मा exception।",
        jp: "`->retry(3, 500)` で最大 3 回、500ms 間隔でリトライ。全て失敗すると `RequestException` がスロー。`->throw()` で 4xx/5xx を常に例外にします。",
      },
    },
  ],
};
