import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Every application eventually breaks. Someone visits `/users/999999` for a user who does not exist, or the database connection drops mid-request. What happens next is not luck, it is something you configure.\n\nLaravel splits the problem in two, and the split is the whole day:\n• <b>Error handling</b> — what should the <i>user</i> receive?\n  ↳ A friendly 404 page, a JSON error body, a redirect back with a message\n• <b>Logging</b> — what should <i>developers</i> record?\n  ↳ A line in a file, a Slack alert, a message shipped to a log service\n\nThe same failure usually needs both, and they are answered by different code.",
      np: "Error handling = user लाई के पठाउने। Logging = developer लाई के record गर्ने। एउटै problem, दुई फरक जवाफ।",
      jp: "エラーハンドリングは「ユーザーに何を返すか」、ロギングは「開発者が何を記録するか」です。",
    },
    {
      en: "<b>The mental model to keep</b>\n\n• `$exceptions->report()` — what should happen when this exception is reported?\n• `$exceptions->render()` — what response should the user receive?\n• `$exceptions->dontReport()` — do not send this one through normal reporting\n• `Log::error()` — something failed, record useful information\n• `Log::withContext()` — attach common information to every log line after this\n• `Context::add()` — carry information through the work, including into queued jobs\n• `APP_DEBUG=false` — production must not expose your internals\n\nOne sentence: exception handling decides how Laravel responds when something goes wrong, and logging records enough for you to work out why.",
      np: "report = record के गर्ने, render = user लाई के पठाउने, Log = विवरण राख्ने, APP_DEBUG=false = production मा internals लुकाउने।",
      jp: "report は記録、render は応答、Log は詳細の保存、APP_DEBUG=false は本番で内部情報を隠すためのものです。",
    },
  ],
  sections: [
    {
      title: {
        en: "Two systems, and why they are separate",
        np: "दुई प्रणाली, र किन छुट्टै छन्",
        jp: "2 つの仕組みと、分かれている理由",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A payment fails. The user should see \"We could not complete your payment, please try again.\" You should see the payment ID, the user ID, the provider's response and a stack trace.\n\nThose are two completely different messages for two completely different audiences, which is why Laravel keeps them in two systems. Mix them up and you get the two classic failures: a user staring at a stack trace, or a developer staring at a log line that says nothing but `Payment failed`.",
            np: "User लाई सजिलो सन्देश, developer लाई विस्तृत विवरण — दुई फरक श्रोता, त्यसैले दुई प्रणाली।",
            jp: "ユーザー向けの分かりやすい文と開発者向けの詳細は別物なので、仕組みも分かれています。",
          },
        },
        {
          type: "code",
          title: {
            en: "One failure, two paths",
            np: "एउटै failure, दुई बाटो",
            jp: "1 つの障害と 2 つの経路",
          },
          code: `Request  →  Controller  →  Application  →  something fails
                                              │
                                        Exception
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ↓                                                 ↓
                  report()                                          render()
                     │                                                 │
                     ↓                                                 ↓
             log file / Slack                                 HTTP response
                     │                                                 │
                     ↓                                                 ↓
               developers                                     user / browser

Show developers the details. Do not show users your internals.`,
        },
      ],
    },
    {
      title: {
        en: "What an exception is, and where handling is configured",
        np: "Exception के हो, र handling कहाँ configure हुन्छ",
        jp: "例外とは何か、どこで設定するか",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "An <b>exception</b> is an object representing a problem that interrupts normal program execution. When your code cannot carry on, it throws one:\n\n`throw new Exception('Something went wrong.');`\n\nThrowing stops the current method immediately and hands control upwards, looking for something willing to catch it. If nothing does, the exception reaches Laravel, and Laravel's exception handling decides what happens instead of the application simply dying without explanation.",
            np: "Exception = normal execution रोक्ने समस्या बुझाउने object। कसैले catch नगरे Laravel सम्म पुग्छ।",
            jp: "例外は通常の処理を中断する問題を表すオブジェクトです。捕捉されなければ Laravel が処理します。",
          },
        },
        {
          type: "code",
          title: {
            en: "The path of a thrown exception",
            np: "Throw भएको exception को बाटो",
            jp: "投げられた例外の流れ",
          },
          code: `Application  →  something goes wrong  →  throw
                                                │
                                    caught by your code?
                                     │                │
                                    YES               NO
                                     │                │
                              you handle it     Laravel handles it
                                                      │
                                                      ↓
                                            report + render → response`,
        },
        {
          type: "paragraph",
          text: {
            en: "In modern Laravel, exception handling is configured in `bootstrap/app.php`. That one file holds routing, middleware, exceptions and the rest of the application's wiring. Older Laravel put this in a dedicated handler class, so tutorials pointing you at `app/Exceptions/Handler.php` are describing the previous arrangement.\n\nThe `$exceptions` object passed into the closure is where you say how Laravel should report, render and otherwise handle what goes wrong.",
            np: "आजको Laravel मा exception handling `bootstrap/app.php` मा। पुरानो Laravel मा छुट्टै handler class हुन्थ्यो।",
            jp: "現在の Laravel では例外設定は `bootstrap/app.php` にあります。旧版では専用の Handler クラスでした。",
          },
        },
        {
          type: "code",
          title: {
            en: "bootstrap/app.php",
            np: "bootstrap/app.php",
            jp: "bootstrap/app.php",
          },
          code: `use Illuminate\\Foundation\\Configuration\\Exceptions;

return Application::configure(basePath: dirname(__DIR__))
    ->withExceptions(function (Exceptions $exceptions) {
        // report(...)      what should we record?
        // render(...)      what should the user receive?
        // dontReport(...)  what should we stay quiet about?
    })
    ->create();`,
        },
      ],
    },
    {
      title: {
        en: "report() vs render() — the central distinction",
        np: "`report()` बनाम `render()` — मुख्य भिन्नता",
        jp: "report() と render() の違い",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Reporting</b> means deciding what happens to an exception for the sake of developers: log it, notify someone, ship it to an error tracker. <b>Rendering</b> means turning that same exception into an HTTP response for the user.\n\nThey are independent. One exception can be reported to Slack and rendered as a polite page, or reported and left to Laravel's default response, or rendered nicely and never reported at all.",
            np: "Report = developer लाई record/notify। Render = user लाई HTTP response। दुई स्वतन्त्र निर्णय।",
            jp: "report は開発者向けの記録や通知、render はユーザー向けの HTTP 応答で、互いに独立しています。",
          },
        },
        {
          type: "table",
          caption: {
            en: "The two questions you are answering",
            np: "तपाईं जवाफ दिने दुई प्रश्न",
            jp: "答えるべき 2 つの問い",
          },
          headers: [
            { en: "", np: "", jp: "" },
            { en: "`report()`", np: "`report()`", jp: "`report()`" },
            { en: "`render()`", np: "`render()`", jp: "`render()`" },
          ],
          rows: [
            [
              { en: "The question", np: "प्रश्न", jp: "問い" },
              { en: "What should we record?", np: "के record गर्ने?", jp: "何を記録するか" },
              { en: "What should we send back?", np: "के फिर्ता पठाउने?", jp: "何を返すか" },
            ],
            [
              { en: "Audience", np: "श्रोता", jp: "対象" },
              { en: "Developers and operations", np: "Developer र operations", jp: "開発・運用" },
              { en: "The user or the API client", np: "User वा API client", jp: "ユーザーや API クライアント" },
            ],
            [
              { en: "Typical output", np: "सामान्य output", jp: "主な出力" },
              { en: "A log line, a Slack alert, an error tracker entry", np: "Log line, Slack alert, error tracker", jp: "ログ行、Slack 通知、エラートラッカー" },
              { en: "An error page, a JSON body, a redirect", np: "Error page, JSON body, redirect", jp: "エラーページ、JSON、リダイレクト" },
            ],
            [
              { en: "Detail level", np: "विवरण", jp: "詳細度" },
              { en: "As much as you can gather", np: "जति सकिन्छ त्यति", jp: "できる限り詳しく" },
              { en: "Only what is safe to show", np: "देखाउन सुरक्षित भएको मात्र", jp: "見せて安全な範囲だけ" },
            ],
            [
              { en: "If you skip it", np: "छोड्दा", jp: "省略した場合" },
              { en: "The failure happens invisibly", np: "Failure देखिन्न", jp: "障害が見えなくなる" },
              { en: "Laravel falls back to its default error response", np: "Laravel को default error response आउँछ", jp: "既定のエラー応答が使われる" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Configuring both for one exception",
            np: "एउटै exception लाई दुवै configure गर्नु",
            jp: "1 つの例外に両方を設定する",
          },
          code: `->withExceptions(function (Exceptions $exceptions) {

    // Developers: record it with everything useful attached.
    $exceptions->report(function (PaymentFailed $e) {
        Log::error('Payment failed', ['payment_id' => $e->paymentId]);
    });

    // Users: send back something they can act on.
    $exceptions->render(function (PaymentFailed $e, Request $request) {
        return response()->view('errors.payment-failed', [], 500);
    });
})

PaymentFailed
   ├──→ report()  →  Log / Slack        →  developers
   └──→ render()  →  friendly page      →  user`,
        },
      ],
    },
    {
      title: {
        en: "Not reporting everything — dontReport()",
        np: "सबै report नगर्नु — `dontReport()`",
        jp: "すべてを報告しない — dontReport()",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Not every exception deserves a log entry. Some are ordinary, expected outcomes that happen to travel as exceptions, and letting them pile up buries the failures you actually need to see.\n\n`dontReport()` tells Laravel to skip the normal reporting process for those classes. Note what it does <i>not</i> do: the exception is still thrown, still caught, still rendered into a response. Only the recording step is skipped.",
            np: "`dontReport()` ले log मात्र रोक्छ — exception अझै handle र render हुन्छ।",
            jp: "`dontReport()` は記録だけを省きます。例外自体は引き続き処理され応答になります。",
          },
        },
        {
          type: "code",
          title: {
            en: "Silencing the expected",
            np: "अपेक्षित exception शान्त पार्नु",
            jp: "想定内の例外を黙らせる",
          },
          code: `$exceptions->dontReport([
    SomeExpectedException::class,
]);

Exception thrown
      │
should developers know about this?
      │                        │
     YES                      NO
      │                        │
   report()             dontReport()
      │                        │
   log / alert         nothing recorded
      │                        │
      └────────→ still rendered ←────────┘`,
        },
        {
          type: "list",
          items: [
            { en: "Invalid user input you already show a message for", np: "पहिले नै सन्देश देखाइएको invalid input", jp: "すでにメッセージを出している不正入力" },
            { en: "An expected business restriction, such as a plan limit being reached", np: "अपेक्षित business restriction, जस्तै plan limit", jp: "プラン上限など想定内の業務制約" },
            { en: "A known temporary condition your code already retries", np: "Code आफै retry गर्ने अस्थायी अवस्था", jp: "リトライ済みの一時的な状態" },
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "The rule that keeps this honest: <b>never use `dontReport()` to quieten a real bug.</b> Silencing an exception because the logs are noisy does not fix anything, it just removes the only evidence you had. If something is failing often enough to be annoying in the logs, that is information, not noise.",
            np: "साँचो bug लुकाउन `dontReport()` प्रयोग गर्नु हुँदैन — log नै एउटा प्रमाण हो।",
            jp: "本物のバグを隠すために `dontReport()` を使ってはいけません。ログは唯一の手がかりです。",
          },
        },
      ],
    },
    {
      title: {
        en: "Custom exception classes",
        np: "आफ्नै exception class",
        jp: "独自の例外クラス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>custom exception class</b> is your own exception type, named after the thing that went wrong. Artisan generates one:\n\n`php artisan make:exception PaymentFailed`  →  `app/Exceptions/PaymentFailed.php`\n\nThe gain is recognition. `throw new Exception('Payment failed')` gives you a string that nothing can reliably act on. `throw new PaymentFailed()` gives you a type, so a `catch` block, a `report()` closure or a `render()` closure can single out payment problems and treat them differently from everything else. In a small application this looks like ceremony; in a large one it is how error handling stays organised.",
            np: "आफ्नै exception class ले type दिन्छ, त्यसैले code ले \"यो payment problem हो\" भनी चिन्न सक्छ।",
            jp: "独自の例外クラスは型を与えるので、「これは決済の問題だ」とコードが判別できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "A named exception",
            np: "नाम भएको exception",
            jp: "名前のある例外",
          },
          code: `namespace App\\Exceptions;

use Exception;

class PaymentFailed extends Exception
{
}

// Throwing it
throw new PaymentFailed('Payment could not be completed.');

throw new Exception('Payment failed');   →  just a message
throw new PaymentFailed(...);            →  a type your code can recognise`,
        },
        {
          type: "paragraph",
          text: {
            en: "An exception can also carry its own `report()` and `render()` methods. Laravel looks for them and uses them, so you do not have to register anything in `bootstrap/app.php`.\n\nWhich to choose is a matter of where the behaviour belongs. Methods on the class keep everything about this failure in one file, which reads well when the handling is specific to that one exception. Closures in `bootstrap/app.php` keep handling in one central place, which reads better when several exceptions share the same treatment. Both are normal.",
            np: "Exception class भित्रै `report()` र `render()` राख्न सकिन्छ; register गर्नु पर्दैन।",
            jp: "例外クラス自身に `report()` と `render()` を持たせられ、登録は不要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "An exception that handles itself",
            np: "आफै handle गर्ने exception",
            jp: "自分で処理する例外",
          },
          code: `namespace App\\Exceptions;

use Exception;
use Illuminate\\Support\\Facades\\Log;

class PaymentFailed extends Exception
{
    public function report(): void
    {
        Log::error('Payment failed', ['message' => $this->getMessage()]);
    }

    public function render($request)
    {
        return response()->view('errors.payment-failed', [], 500);
    }
}

// Thrown from a service, several calls deep
if (! $paymentSuccessful) {
    throw new PaymentFailed('The payment provider rejected the payment.');
}

The developer gets the detail. The user gets a friendly message.
Nobody had to wire the two together at the call site.`,
        },
      ],
    },
    {
      title: {
        en: "Custom error pages & HTTP status codes",
        np: "आफ्नै error page र HTTP status code",
        jp: "カスタムエラーページと HTTP ステータス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel renders error pages from `resources/views/errors/`, and the filename is the status code. Create `404.blade.php` and every 404 in your application uses it. No registration, no configuration, just the file being there.\n\nThese are ordinary Blade views, so they can extend your layout and look like the rest of the site.",
            np: "`resources/views/errors/404.blade.php` जस्तो file नाम = status code। बनाए मात्र चल्छ।",
            jp: "`resources/views/errors/404.blade.php` のようにファイル名がステータスコードです。置くだけで使われます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Two pages worth writing first",
            np: "पहिले लेख्नुपर्ने दुई page",
            jp: "最初に書くべき 2 ページ",
          },
          code: `resources/views/errors/
  ├── 403.blade.php
  ├── 404.blade.php
  └── 500.blade.php

{{-- 404: the thing you asked for does not exist --}}
<h1>Page not found</h1>
<p>Sorry, we couldn't find the page you're looking for.</p>
<a href="{{ route('home') }}">Go home</a>

{{-- 500: we broke, and it is not your fault --}}
<h1>Something went wrong</h1>
<p>We're working on the problem.</p>

User requests a page  →  it does not exist  →  404  →  errors/404.blade.php

In production this beats a technical stack trace by a wide margin.`,
        },
        {
          type: "paragraph",
          text: {
            en: "An <b>HTTP exception</b> is an exception representing an HTTP error such as 404, 403 or 500, which is how you stop a request with a specific status. You already have the tools for this: `abort()`, `abort_if()` and `abort_unless()` came on Day 7, along with the 401 versus 403 and 301 versus 302 distinctions. Go back there if any of that feels hazy.\n\nWhat is new today is the reporting angle. The status code you send is also a claim about whose fault the failure was, and that decides whether it belongs in your logs at all.",
            np: "`abort()`, `abort_if()`, `abort_unless()` Day 7 मा छ। आज नयाँ कुरा: कुन status log गर्ने।",
            jp: "`abort()` 系は Day 7 で学びました。今日の新しい点は、どのステータスを記録すべきかです。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Status codes and whether they deserve a log entry",
            np: "Status code र log चाहिन्छ कि चाहिन्न",
            jp: "ステータスコードと記録すべきかどうか",
          },
          headers: [
            { en: "Status", np: "Status", jp: "ステータス" },
            { en: "Whose problem it is", np: "कसको समस्या", jp: "原因" },
            { en: "Report it?", np: "Report गर्ने?", jp: "記録する？" },
          ],
          rows: [
            [
              { en: "`403` Forbidden", np: "`403` Forbidden", jp: "`403` Forbidden" },
              { en: "The client, asking for something they are not allowed", np: "Client — अनुमति नभएको माग", jp: "権限のない要求をしたクライアント" },
              { en: "Usually not, though a spike is worth noticing", np: "सामान्यतया नचाहिने, तर धेरै भए हेर्नु", jp: "通常は不要。急増時は注視" },
            ],
            [
              { en: "`404` Not Found", np: "`404` Not Found", jp: "`404` Not Found" },
              { en: "Nobody's, most of the time. Old links and bots", np: "प्रायः कसैको होइन — पुरानो link, bot", jp: "多くは誰のせいでもない（古いリンクやボット）" },
              { en: "No. Reporting these floods your logs", np: "नगर्ने — log भरिन्छ", jp: "不要。ログがあふれる" },
            ],
            [
              { en: "`422` Unprocessable Content", np: "`422` Unprocessable Content", jp: "`422` Unprocessable Content" },
              { en: "The client. Well-formed but failed validation (Day 9)", np: "Client — validation असफल (Day 9)", jp: "クライアント。形式は正しいが検証失敗（Day 9）" },
              { en: "No. This is your validation working as designed", np: "नगर्ने — validation ठीकसँग चलेको हो", jp: "不要。検証が正しく働いた結果" },
            ],
            [
              { en: "`429` Too Many Requests", np: "`429` Too Many Requests", jp: "`429` Too Many Requests" },
              { en: "The client, hitting a rate limit (Day 22)", np: "Client — rate limit (Day 22)", jp: "レート制限に達したクライアント（Day 22）" },
              { en: "Worth logging the pattern, not each hit", np: "प्रत्येक होइन, pattern log गर्नु", jp: "個々ではなく傾向を記録" },
            ],
            [
              { en: "`500` Server Error", np: "`500` Server Error", jp: "`500` Server Error" },
              { en: "Yours. Something in your code or infrastructure broke", np: "तपाईंको — code वा infrastructure बिग्रेको", jp: "自分側。コードやインフラの障害" },
              { en: "Always, with as much context as you can attach", np: "सधैँ, सकेसम्म context सहित", jp: "常に。文脈を添えて記録" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Logging — the Log facade, levels & context",
        np: "Logging — `Log` facade, level र context",
        jp: "ロギング — Log ファサード、レベル、文脈",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Error handling asks what should happen when something goes wrong. <b>Logging</b> asks what information you should save so that a developer, possibly you at 2am, can work out what happened.\n\nOne facade covers it. A <b>log level</b> is a label saying how serious the message is, and every level is a method on `Log`.",
            np: "Logging = पछि बुझ्न सकिने जानकारी सुरक्षित राख्नु। `Log` facade मा हरेक level एउटा method।",
            jp: "ロギングは後から原因を追えるよう情報を残すことです。各レベルが `Log` のメソッドです。",
          },
        },
        {
          type: "code",
          title: {
            en: "The path a log message takes",
            np: "Log message को बाटो",
            jp: "ログメッセージの経路",
          },
          code: `use Illuminate\\Support\\Facades\\Log;

Log::info('User logged in.');

Application  →  something happens  →  log message
                                          │
                                          ↓
                                     log channel
                                          │
                                          ↓
                                  log destination
                                (file / Slack / stderr)

Levels, increasing severity:
debug → info → notice → warning → error → critical → alert → emergency`,
        },
        {
          type: "paragraph",
          text: {
            en: "There are eight levels, which is more than you need on day one. Learn four properly and the rest will be obvious when you meet them.",
            np: "आठ level छन्; सुरुमा चार राम्ररी सिक्नु — बाँकी पछि सजिलै बुझिन्छ।",
            jp: "レベルは 8 つありますが、まずは 4 つを覚えれば十分です。",
          },
        },
        {
          type: "table",
          caption: {
            en: "The four levels you will use most",
            np: "सबैभन्दा धेरै चलाउने चार level",
            jp: "最もよく使う 4 つのレベル",
          },
          headers: [
            { en: "Level", np: "Level", jp: "レベル" },
            { en: "What it means", np: "अर्थ", jp: "意味" },
            { en: "Example", np: "उदाहरण", jp: "例" },
          ],
          rows: [
            [
              { en: "`debug`", np: "`debug`", jp: "`debug`" },
              { en: "Detailed information useful while developing", np: "Development मा काम लाग्ने विस्तृत विवरण", jp: "開発中に役立つ詳細情報" },
              { en: "`Log::debug('Checking payment status')`", np: "`Log::debug('Checking payment status')`", jp: "`Log::debug('Checking payment status')`" },
            ],
            [
              { en: "`info`", np: "`info`", jp: "`info`" },
              { en: "Normal, useful application events", np: "सामान्य तर उपयोगी घटना", jp: "通常の有用なイベント" },
              { en: "`Log::info('User logged in')`", np: "`Log::info('User logged in')`", jp: "`Log::info('User logged in')`" },
            ],
            [
              { en: "`warning`", np: "`warning`", jp: "`warning`" },
              { en: "Something unusual, but the application can continue", np: "असामान्य, तर app चल्न सक्छ", jp: "異常だが処理は継続できる" },
              { en: "`Log::warning('Payment provider is slow')`", np: "`Log::warning('Payment provider is slow')`", jp: "`Log::warning('Payment provider is slow')`" },
            ],
            [
              { en: "`error`", np: "`error`", jp: "`error`" },
              { en: "Something failed and needs attention", np: "कुनै काम असफल भयो", jp: "処理が失敗し対応が必要" },
              { en: "`Log::error('Payment failed')`", np: "`Log::error('Payment failed')`", jp: "`Log::error('Payment failed')`" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "Now the part that decides whether your logs are worth having. Every log method takes a second argument: an array of <b>context</b>, meaning the surrounding facts that make the message useful.\n\n`Log::error('Payment failed')` tells you a payment failed. Which payment? Whose? You cannot answer either, so the line is close to useless. The same call with `['user_id' => $user->id, 'payment_id' => $payment->id]` turns a shrug into a starting point.\n\nThe habit to build: whenever you write a log line, ask what you would immediately want to know if you found this line in production at 2am, and pass that.",
            np: "बेयर message नलेख्नु। दोस्रो argument मा context array दिनु: `['user_id' => ..., 'payment_id' => ...]`।",
            jp: "素のメッセージだけでは不十分です。第 2 引数に文脈の配列を渡します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Context is what makes a log line usable",
            np: "Context ले log line काम लाग्ने बनाउँछ",
            jp: "文脈があってこそ使えるログになる",
          },
          code: `// Almost useless
Log::error('Payment failed');

// Actually actionable
Log::error('Payment failed', [
    'user_id'    => $user->id,
    'payment_id' => $payment->id,
    'amount'     => $payment->amount,
]);

// Catch, record, and let it keep travelling
try {
    $payment->charge();
} catch (PaymentFailed $e) {
    Log::error('Payment failed', ['payment_id' => $payment->id]);
    throw $e;      // rethrow, so the exception handler still renders a response
}

Payment fails  →  PaymentFailed
    ├──→ Log             →  developers get the detail
    └──→ exception handler  →  user gets a response`,
        },
      ],
    },
    {
      title: {
        en: "Log::withContext() and the Context facade",
        np: "`Log::withContext()` र `Context` facade",
        jp: "Log::withContext() と Context ファサード",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Passing the same `request_id` into fifteen separate log calls is tedious and easy to forget. `Log::withContext()` attaches information once, and every log message after it in that request carries the same fields.\n\nThat is what turns a log file into something readable. Instead of fifteen unrelated lines you have fifteen lines stamped with the same identifier, and you can follow one request from start to finish.",
            np: "`Log::withContext()` ले एकपटक जानकारी जोड्छ; त्यसपछिका सबै log line मा त्यही रहन्छ।",
            jp: "`Log::withContext()` は一度付けた情報を以降のすべてのログに載せます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Attach once, appear everywhere",
            np: "एकपटक जोड्नु, सबैतिर देखिन्छ",
            jp: "一度付けて全体に反映",
          },
          code: `Log::withContext([
    'request_id' => $request->header('X-Request-ID'),
]);

Log::info('Order validated');     // carries request_id
Log::info('Payment authorised');  // carries request_id
Log::info('Order confirmed');     // carries request_id

Without it            With it
──────────            ───────
three loose lines     three lines you can group by request_id`,
        },
        {
          type: "paragraph",
          text: {
            en: "The <b>`Context` facade</b> goes a step further. Context here means data attached to the current execution so that it can follow the work through different parts of the application, not just the logging calls.\n\nThe difference that matters: context can be carried into <b>queued jobs</b>. A queued job runs later, in a separate process, so it normally knows nothing about the request that created it. Context is how the request's identifiers travel with it. Queues are Day 18, so treat this as the reason to remember `Context` exists rather than something to set up today.",
            np: "`Context` ले जानकारी queued job सम्म पनि लैजान्छ — queue Day 18 मा।",
            jp: "`Context` は情報をキュージョブまで運びます。キューは Day 18 です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Context following the work",
            np: "Context काम पछ्याउँदै",
            jp: "文脈が処理を追いかける",
          },
          code: `use Illuminate\\Support\\Facades\\Context;

// request_id = abc123, order_id = 789

HTTP request  ──→  Context  ──→  request logs
                      │
                      ↓
                 queued job  ──→  job logs (same request_id, same order_id)

Without shared context:
  Log 1  "Order created"     ← which request?
  Log 2  "Email queued"      ← which order?
  Log 3  "Email sent"        ← which job? whose order?

With context:
  Log 1  "Order created"   request_id=abc123 order_id=789
  Log 2  "Email queued"    request_id=abc123 order_id=789
  Log 3  "Email sent"      request_id=abc123 order_id=789

One user's journey, readable end to end, across two processes.`,
        },
      ],
    },
    {
      title: {
        en: "Channels & APP_DEBUG",
        np: "Channel र `APP_DEBUG`",
        jp: "チャンネルと APP_DEBUG",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>logging channel</b> is a configured destination or method for storing and sending logs. It answers \"where does this message actually go?\", and the configuration lives in `config/logging.php`.\n\nYour code does not change when the channel does. `Log::error()` is the same call whether the message lands in a file, in Slack, or on standard output for a container platform to collect.",
            np: "Logging channel = log कहाँ जान्छ, `config/logging.php` मा। Code बदलिन्न, destination बदलिन्छ।",
            jp: "ログチャンネルは送り先の設定（`config/logging.php`）です。コードは変えずに送り先を変えられます。",
          },
        },
        {
          type: "table",
          caption: {
            en: "The channels you will meet",
            np: "भेट्ने channel",
            jp: "主なチャンネル",
          },
          headers: [
            { en: "Channel", np: "Channel", jp: "チャンネル" },
            { en: "Where it sends", np: "कहाँ पठाउँछ", jp: "送り先" },
            { en: "When to use it", np: "कहिले", jp: "用途" },
          ],
          rows: [
            [
              { en: "`single`", np: "`single`", jp: "`single`" },
              { en: "One file, `storage/logs/laravel.log`", np: "एउटै file, `storage/logs/laravel.log`", jp: "1 ファイル `storage/logs/laravel.log`" },
              { en: "Simple applications and local development", np: "सरल app र local development", jp: "小規模なアプリやローカル開発" },
            ],
            [
              { en: "`daily`", np: "`daily`", jp: "`daily`" },
              { en: "One file per day, `laravel-2026-08-31.log`", np: "दिनको एउटा file", jp: "日ごとに 1 ファイル" },
              { en: "Anything long-running. Far easier to search and rotate", np: "लामो समय चल्ने app — खोज्न सजिलो", jp: "長期運用向け。検索と保守が容易" },
            ],
            [
              { en: "`stack`", np: "`stack`", jp: "`stack`" },
              { en: "Several channels at once, such as `daily` plus `slack`", np: "एकैचोटि धेरै channel", jp: "複数チャンネルへ同時に" },
              { en: "When one `Log::error()` should reach more than one place", np: "एउटै log धेरै ठाउँ पुर्‍याउन", jp: "1 回のログを複数の宛先へ" },
            ],
            [
              { en: "`slack`", np: "`slack`", jp: "`slack`" },
              { en: "A Slack channel", np: "Slack channel", jp: "Slack チャンネル" },
              { en: "Critical failures only. Never routine `info` messages", np: "गम्भीर failure मात्र — `info` कदापि होइन", jp: "重大障害のみ。通常の `info` は送らない" },
            ],
            [
              { en: "`syslog`", np: "`syslog`", jp: "`syslog`" },
              { en: "The operating system's logging service", np: "Operating system को logging service", jp: "OS のログ機構" },
              { en: "Where your infrastructure already collects system logs", np: "Infrastructure ले पहिले नै system log जम्मा गर्ने ठाउँ", jp: "既にシステムログを収集している環境" },
            ],
            [
              { en: "`stderr`", np: "`stderr`", jp: "`stderr`" },
              { en: "Standard error", np: "Standard error", jp: "標準エラー出力" },
              { en: "Docker, containers and managed platforms that forward stderr", np: "Docker, container, managed platform", jp: "stderr を転送する Docker やマネージド環境" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "How channels differ in practice",
            np: "Channel व्यवहारमा कसरी फरक",
            jp: "実運用でのチャンネルの違い",
          },
          code: `single   Application  →  single  →  storage/logs/laravel.log

daily    Application  →  daily   →  storage/logs/laravel-2026-08-31.log
                                    storage/logs/laravel-2026-08-30.log

stack    Log::error()  →  stack  ─┬─→  daily  →  file
                                  └─→  slack  →  #engineering

slack    Log::critical()  →  Slack  →  the engineering team wakes up

stderr   Application  →  stderr  →  the platform's log collector

Reserve Slack for: payment system unavailable, database unavailable,
a major integration down. Not "user logged in".`,
        },
        {
          type: "paragraph",
          text: {
            en: "Laravel 13 adds support for a monthly log driver. It behaves like `daily` but groups by month, so you get `laravel-2026-07.log` and `laravel-2026-08.log` instead of one file per day. Useful on applications where daily rotation produces more files than anyone wants to sift through.",
            np: "Laravel 13 ले monthly log driver थप्छ — `daily` जस्तै, तर महिना अनुसार।",
            jp: "Laravel 13 は monthly ログドライバに対応します。`daily` と同様ですが月単位です。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "Last, and the one that is a security rule rather than a preference. `APP_DEBUG` controls how much Laravel puts in an error response.\n\n• <b>`APP_DEBUG=true`</b> locally, so you see the exception, the file, the line and the full stack trace. This is how you find problems quickly.\n• <b>`APP_DEBUG=false`</b> in production, always. Detailed error pages can expose file paths, source code, database details, environment configuration and internal structure to anybody who can trigger an error.\n\nWith debug off you lose nothing you needed, because the detail is still going to your logs. The user gets a friendly response, and you get the stack trace where it belongs.",
            np: "Local मा `APP_DEBUG=true`, production मा सधैँ `false` — विवरण log मा जान्छ, user लाई देखिँदैन।",
            jp: "ローカルは `APP_DEBUG=true`、本番は必ず `false`。詳細はログに残り、ユーザーには見せません。",
          },
        },
        {
          type: "code",
          title: {
            en: "The same failure, two environments",
            np: "एउटै failure, दुई environment",
            jp: "同じ障害、2 つの環境",
          },
          code: `Local        APP_DEBUG=true
             Exception  →  exception class, file, line, stack trace
                        →  on screen, for you

Production   APP_DEBUG=false
             Exception  →  friendly error page, for the user
                        →  full detail, in the log, for you

What a debug page can leak in production:
  file paths · source code · database credentials
  environment configuration · stack traces · internal structure`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `report()` and `render()`?",
        np: "`report()` र `render()` बीच फरक के हो?",
        jp: "`report()` と `render()` の違いは何ですか？",
      },
      answer: {
        en: "They answer two different questions about the same exception.\n\n• <b>`report()`</b> — \"what should we record?\"\n  ↳ Writes a log line, posts to Slack, sends the exception to an error tracker\n  ↳ Audience is you, so attach as much detail as you can gather\n• <b>`render()`</b> — \"what should we send back?\"\n  ↳ Returns an HTTP response: an error page, a JSON body, a redirect\n  ↳ Audience is the user, so include only what is safe to show\n\nThey are independent, and one exception often uses both. Skip `report()` and the failure happens invisibly. Skip `render()` and Laravel falls back to its default error response, which is frequently fine.\n\nThe quickest way to remember it: report is for the log, render is for the browser.",
        np: "`report()` = के record गर्ने (developer लाई)। `render()` = के फिर्ता पठाउने (user लाई)। दुई स्वतन्त्र।",
        jp: "`report()` は記録（開発者向け）、`render()` は応答（ユーザー向け）で、互いに独立しています。",
      },
    },
    {
      question: {
        en: "When is it right to use `dontReport()`?",
        np: "`dontReport()` कहिले प्रयोग गर्नु ठीक हुन्छ?",
        jp: "`dontReport()` を使ってよいのはどんなときですか？",
      },
      answer: {
        en: "When the exception represents expected behaviour rather than a failure.\n\nGood reasons:\n• Invalid user input you already handle by showing a message\n• A business restriction being hit, such as a plan limit or a closed booking window\n• A known temporary condition your code already retries\n\nBad reason, and it is the common one: the logs are noisy and you want quiet. That is hiding a bug, not fixing it. Frequent exceptions are telling you something, and `dontReport()` deletes the only evidence you had.\n\nBe clear about what it does. The exception is still thrown, still handled, still rendered into a response. Only the recording step is skipped, so the user's experience does not change at all.",
        np: "अपेक्षित व्यवहार भए ठीक। Log शान्त पार्न bug लुकाउने काममा कदापि प्रयोग नगर्नु।",
        jp: "想定内の挙動なら適切です。ログを静かにしたいだけでバグを隠す用途には使いません。",
      },
    },
    {
      question: {
        en: "Do I really need custom exception classes?",
        np: "आफ्नै exception class साँच्चै चाहिन्छ?",
        jp: "独自の例外クラスは本当に必要ですか？",
      },
      answer: {
        en: "Not on day one, but you will want them sooner than you expect.\n\nThe difference is recognition. `throw new Exception('Payment failed')` gives you a string, and nothing can act on a string reliably. A `catch (PaymentFailed $e)`, a `report()` closure or a `render()` closure can all single out `PaymentFailed` and treat it differently from every other failure.\n\nA useful signal that it is time: you find yourself matching on the message text, or writing a comment explaining which kind of failure a generic exception represents.\n\nOnce the class exists you have a choice about where the handling lives. Putting `report()` and `render()` methods on the class itself keeps everything about that failure in one file. Registering closures in `bootstrap/app.php` keeps handling central, which is better when several exceptions share the same treatment.",
        np: "सुरुमा अनिवार्य होइन, तर type ले code लाई failure चिन्न दिन्छ — message text मिलाउन थाल्नुभयो भने समय आयो।",
        jp: "最初は不要ですが、型があると失敗を判別できます。メッセージ文で分岐し始めたら導入時期です。",
      },
    },
    {
      question: {
        en: "Which log level should I use?",
        np: "कुन log level प्रयोग गर्ने?",
        jp: "どのログレベルを使えばよいですか？",
      },
      answer: {
        en: "There are eight, but four cover almost everything you will write.\n\n• <b>`debug`</b> — detail that helps while you are building. Noise in production.\n• <b>`info`</b> — normal events worth a record. \"User logged in\", \"Order created\".\n• <b>`warning`</b> — something unusual, but the application carried on. \"Payment provider is slow\".\n• <b>`error`</b> — something failed and someone should look. \"Payment failed\".\n\nThe remaining four, `notice`, `critical`, `alert` and `emergency`, sit above and around those and become useful once you route levels to different channels. `critical` going to Slack while `error` goes to a file is a common arrangement.\n\nThe honest advice: choosing between `error` and `critical` matters far less than attaching context. A `warning` with the right identifiers beats a perfectly graded `critical` that says nothing.",
        np: "सुरुमा `debug`, `info`, `warning`, `error` चार जान्नु। Level भन्दा context महत्त्वपूर्ण।",
        jp: "まず `debug`・`info`・`warning`・`error` の 4 つで十分です。レベル選びより文脈が重要です。",
      },
    },
    {
      question: {
        en: "`Log::withContext()` or the `Context` facade?",
        np: "`Log::withContext()` कि `Context` facade?",
        jp: "`Log::withContext()` と `Context` ファサードのどちらを使う？",
      },
      answer: {
        en: "It depends on how far the information needs to travel.\n\n• <b>`Log::withContext()`</b> attaches fields to every log message after it in the current request.\n  ↳ Reach for this when you want to group a request's log lines by something like a `request_id`\n• <b>`Context`</b> attaches data to the current execution so it can follow the work through the application, and it can be carried into queued jobs.\n  ↳ Reach for this when the work continues in another process\n\nThe queue part is the interesting half. A queued job runs later and separately, so by default it knows nothing about the request that created it. Without shared context you get \"Order created\", \"Email queued\" and \"Email sent\" as three unrelated lines. With it, all three carry the same `request_id` and `order_id`, and one user's journey reads end to end.\n\nQueues arrive on Day 18, so for now just remember that this is the tool for it.",
        np: "`Log::withContext()` = यही request का log। `Context` = queued job सम्म पनि जाने जानकारी (Day 18)।",
        jp: "`Log::withContext()` は同一リクエストのログ用、`Context` はキュージョブまで運ぶ用（Day 18）です。",
      },
    },
    {
      question: {
        en: "Why does `APP_DEBUG=false` matter so much in production?",
        np: "Production मा `APP_DEBUG=false` किन यति महत्त्वपूर्ण?",
        jp: "本番で `APP_DEBUG=false` が重要なのはなぜですか？",
      },
      answer: {
        en: "Because a debug error page is a detailed report on your application, shown to whoever managed to trigger it.\n\nWhat a stack trace page can hand a stranger:\n• Absolute file paths, which reveal your directory structure and often your server layout\n• Fragments of your source code, including the lines around the failure\n• Database details and connection information\n• Environment configuration and variable names\n• The internal shape of your application, class by class\n\nAn attacker does not need a clever exploit for this. They need one error, and errors are easy to cause.\n\nThe part people worry about needlessly: you are not losing the information. With `APP_DEBUG=false` the full detail still goes to your logs. The user gets a friendly page, you get the stack trace, and nobody outside gets a tour of your codebase.\n\nSo: `true` locally, `false` in production, no exceptions. If you need to debug a production problem, read the logs.",
        np: "Debug page ले file path, code, database विवरण देखाउँछ। Production मा `false` राख्नु; विवरण log मा हुन्छ।",
        jp: "デバッグ画面はパスやコード、DB 情報まで露出します。本番は `false`、詳細はログで確認します。",
      },
    },
  ],
};
