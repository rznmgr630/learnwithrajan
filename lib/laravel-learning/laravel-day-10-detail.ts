import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "A web application needs a way to remember things between requests.\n\nA user logs in on one request, then asks for the dashboard on the next. Something has to carry \"this is Rajan\" from the first request to the second, because HTTP itself will not.\n\nLaravel gives you two tools for this:\n• <b>Session</b> — data kept on the server and remembered between requests\n  ↳ Login state, flash messages, shopping carts, half-filled forms\n• <b>Cookie</b> — a small piece of data stored in the user's browser\n  ↳ Theme preference, \"remember me\" tokens, the session ID itself",
      np: "Session = server मा राखिने data, request बीच रहन्छ। Cookie = browser मा राखिने सानो data।",
      jp: "セッションはサーバー側に保持される状態、クッキーはブラウザに保存される小さなデータです。",
    },
    {
      en: "<b>The mental model to keep</b>\n\n• `session()->put()` — remember this value\n• `session()->get()` — give me back the remembered value\n• `session()->flash()` — remember this only for the next request\n• `session()->forget()` — remove this one value\n• `session()->flush()` — remove everything\n• `$request->cookie()` — read something the browser sent us\n\nOne sentence: sessions let Laravel remember users between requests, and cookies let the browser hold small pieces of data.",
      np: "put/get सम्झ्ने, flash अर्को request मात्र, forget एउटा हटाउने, flush सबै हटाउने।",
      jp: "put/get で保存と取得、flash は次のリクエストだけ、forget は 1 件削除、flush は全削除です。",
    },
  ],
  sections: [
    {
      title: {
        en: "Why sessions exist — HTTP is stateless",
        np: "Session किन चाहिन्छ — HTTP stateless छ",
        jp: "なぜセッションが必要か — HTTP はステートレス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "HTTP is <b>stateless</b>, meaning every request is independent and does not automatically remember anything about the requests before it.\n\nThat sounds harmless until you try to build a login. The request that logs the user in and the request that loads the dashboard are two separate conversations, and the second one has no memory of the first.\n\nSessions are how you bridge that gap: write on one request, read on the next.",
            np: "HTTP stateless छ — हरेक request स्वतन्त्र। Session ले एक request मा लेखेको अर्को मा पढ्न दिन्छ।",
            jp: "HTTP はステートレスで各リクエストは独立しています。セッションが前後のリクエストをつなぎます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Three requests, no memory",
            np: "तीन request, कुनै memory छैन",
            jp: "3 つのリクエストと記憶の不在",
          },
          code: `Browser  →  GET  /login       →  Server: here is the login page
Browser  →  POST /login       →  Server: login successful
Browser  →  GET  /dashboard   →  Server: ...who is this user?

The third request has no idea what happened in the second one.

With a session in the middle:

Request 1  →  Laravel  →  save information
                            │
                            ↓
                       session storage
                            │
                            ↓
Request 2  →  Laravel  →  read information`,
        },
        {
          type: "list",
          items: [
            { en: "Login information (which user is signed in)", np: "Login जानकारी", jp: "ログイン情報" },
            { en: "Flash messages (\"Saved successfully\")", np: "Flash message", jp: "フラッシュメッセージ" },
            { en: "Shopping carts", np: "Shopping cart", jp: "カート" },
            { en: "Temporary form data across a multi-step form", np: "अस्थायी form data", jp: "一時的なフォームデータ" },
            { en: "User preferences and short-lived application state", np: "User preference र छोटो अवधिको state", jp: "ユーザー設定や短命な状態" },
          ],
        },
      ],
    },
    {
      title: {
        en: "Session vs cookie",
        np: "Session बनाम Cookie",
        jp: "セッションとクッキーの違い",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "These two get mixed up constantly, so it is worth being precise about where the data actually sits.\n\n• <b>Session</b> — the browser carries only a session ID. The real data lives on the server, in whatever session driver you configured.\n• <b>Cookie</b> — the real data lives in the browser and is sent back with every request to your domain.\n\nSo a session <i>uses</i> a cookie to carry its ID, but a session is not a cookie. Session is application state across requests; a cookie is a small piece of data parked in the browser.",
            np: "Session को असली data server मा, browser मा session ID मात्र। Cookie को data browser मा।",
            jp: "セッションの実データはサーバー側にあり、ブラウザは ID のみを運びます。クッキーは実データがブラウザ側です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Where the data lives",
            np: "Data कहाँ बस्छ",
            jp: "データの置き場所",
          },
          code: `SESSION
  Browser  ──[ session ID cookie ]──→  Laravel  ──→  session storage
                                                     (file / database / redis)

  The real data stays on the server. The browser only carries the ID.

COOKIE
  Laravel  ──[ Set-Cookie: theme=dark ]──→  Browser  ──→  stored locally

  The real data lives in the browser and rides along on every request.`,
        },
      ],
    },
    {
      title: {
        en: "Session drivers & configuration",
        np: "Session driver र configuration",
        jp: "セッションドライバと設定",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>session driver</b> is simply the place Laravel stores session data. Same code in your controllers, different storage behind it.\n\n<i>A note on timing: the `database` driver needs a `sessions` table, and tables come from migrations, which is tomorrow on Day 12. Stay on `file` today and switch the driver once migrations feel familiar.</i>",
            np: "Session driver = Laravel session data कहाँ राख्छ। `database` driver लाई migration चाहिन्छ (Day 12)।",
            jp: "セッションドライバは保存先の選択です。`database` ドライバには `sessions` テーブル（Day 12 のマイグレーション）が必要です。",
          },
        },
        {
          type: "table",
          caption: {
            en: "The four common session drivers",
            np: "चार सामान्य session driver",
            jp: "代表的な 4 つのドライバ",
          },
          headers: [
            { en: "Driver", np: "Driver", jp: "ドライバ" },
            { en: "Where the data lives", np: "Data कहाँ", jp: "保存先" },
            { en: "When to use it", np: "कहिले", jp: "用途" },
          ],
          rows: [
            [
              { en: "`file`", np: "`file`", jp: "`file`" },
              { en: "`storage/framework/sessions/`", np: "`storage/framework/sessions/`", jp: "`storage/framework/sessions/`" },
              { en: "The default. Simple and convenient for local development", np: "Default — development मा सजिलो", jp: "既定。ローカル開発に手軽" },
            ],
            [
              { en: "`database`", np: "`database`", jp: "`database`" },
              { en: "A `sessions` table", np: "`sessions` table", jp: "`sessions` テーブル" },
              { en: "When you want sessions in your database. Needs a migration first", np: "Database मा राख्न — migration चाहिन्छ", jp: "DB に持たせたい場合。マイグレーションが必要" },
            ],
            [
              { en: "`redis`", np: "`redis`", jp: "`redis`" },
              { en: "Redis, an in-memory data store", np: "Redis (in-memory store)", jp: "Redis（インメモリストア）" },
              { en: "Very fast, and shared cleanly across several servers", np: "धेरै छिटो, बहु-server मा उपयुक्त", jp: "高速で複数サーバー間の共有に向く" },
            ],
            [
              { en: "`cookie`", np: "`cookie`", jp: "`cookie`" },
              { en: "The browser, in an encrypted cookie", np: "Browser मा encrypted cookie", jp: "ブラウザ（暗号化クッキー）" },
              { en: "No server-side storage at all, but limited by cookie size", np: "Server storage चाहिन्न, तर size सीमित", jp: "サーバー保存不要だがサイズ制限あり" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Choosing a driver",
            np: "Driver छान्नु",
            jp: "ドライバの選択",
          },
          code: `# .env: pick one
SESSION_DRIVER=file        # default, fine for local development
SESSION_DRIVER=database
SESSION_DRIVER=redis
SESSION_DRIVER=cookie

// config/session.php holds the rest
'driver'   => env('SESSION_DRIVER', 'file'),
'lifetime' => env('SESSION_LIFETIME', 120),   // minutes
'encrypt'  => false,
'cookie'   => env('SESSION_COOKIE', 'laravel_session'),

# The exact set of options varies with the Laravel version, so read
# config/session.php in your own project rather than trusting memory.`,
        },
      ],
    },
    {
      title: {
        en: "Reading & writing session data",
        np: "Session data पढ्नु र लेख्नु",
        jp: "セッションデータの読み書き",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You reach the session through the request object: `$request->session()`. There is also a global `session()` helper, which is what Blade views normally use.\n\nAll of these methods work the same way no matter which driver you picked, which is the whole point of having drivers.",
            np: "`$request->session()` वा global `session()` helper प्रयोग गर्ने। कुनै पनि driver मा एउटै API।",
            jp: "`$request->session()` または `session()` ヘルパーで操作します。ドライバが変わっても API は同じです。",
          },
        },
        {
          type: "table",
          caption: {
            en: "The session methods you will use daily",
            np: "दिनहुँ चलाउने session method",
            jp: "日常的に使うセッションメソッド",
          },
          headers: [
            { en: "Method", np: "Method", jp: "メソッド" },
            { en: "What it does", np: "के गर्छ", jp: "動作" },
            { en: "Example", np: "उदाहरण", jp: "例" },
          ],
          rows: [
            [
              { en: "`get()`", np: "`get()`", jp: "`get()`" },
              { en: "Reads a value, with an optional fallback when the key is missing", np: "Value पढ्छ, default सहित", jp: "値を取得（既定値も指定可）" },
              { en: "`get('name', 'Guest')`", np: "`get('name', 'Guest')`", jp: "`get('name', 'Guest')`" },
            ],
            [
              { en: "`put()`", np: "`put()`", jp: "`put()`" },
              { en: "Stores a value. Arrays are fine too", np: "Value राख्छ, array पनि हुन्छ", jp: "値を保存（配列も可）" },
              { en: "`put('user', ['id' => 10])`", np: "`put('user', ['id' => 10])`", jp: "`put('user', ['id' => 10])`" },
            ],
            [
              { en: "`has()`", np: "`has()`", jp: "`has()`" },
              { en: "True when the key exists and is not null", np: "Key छ र null छैन भने true", jp: "キーが存在し null でなければ true" },
              { en: "`has('cart')`", np: "`has('cart')`", jp: "`has('cart')`" },
            ],
            [
              { en: "`pull()`", np: "`pull()`", jp: "`pull()`" },
              { en: "Reads the value and removes it in the same step. Good for one-time data", np: "पढ्छ र तुरुन्त हटाउँछ", jp: "取得と同時に削除。一度だけのデータ向け" },
              { en: "`pull('redirect_to')`", np: "`pull('redirect_to')`", jp: "`pull('redirect_to')`" },
            ],
            [
              { en: "`forget()`", np: "`forget()`", jp: "`forget()`" },
              { en: "Removes one key, or several when given an array", np: "एक वा धेरै key हटाउँछ", jp: "1 件または配列で複数削除" },
              { en: "`forget(['name', 'email'])`", np: "`forget(['name', 'email'])`", jp: "`forget(['name', 'email'])`" },
            ],
            [
              { en: "`flush()`", np: "`flush()`", jp: "`flush()`" },
              { en: "Removes <b>everything</b> in the session. Handle with care", np: "सबै हटाउँछ — सावधान", jp: "すべて削除。取り扱い注意" },
              { en: "`flush()`", np: "`flush()`", jp: "`flush()`" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Session methods in practice",
            np: "Session method व्यवहारमा",
            jp: "セッションメソッドの実例",
          },
          code: `// Read, with a fallback when the key is not there
$name = $request->session()->get('name');
$name = $request->session()->get('name', 'Guest');

//   Does "name" exist?   YES → the stored value
//                        NO  → "Guest"

// Write
$request->session()->put('name', 'Rajan');
$request->session()->put('user', ['id' => 10, 'name' => 'Rajan']);

// Check
if ($request->session()->has('cart')) {
    // exists and is not null
}

// Read and remove in one step
$target = $request->session()->pull('redirect_to');

// Remove
$request->session()->forget('name');
$request->session()->forget(['name', 'email']);
$request->session()->flush();          // removes EVERYTHING

// The global helper, which is what Blade uses
{{ session('name') }}`,
        },
        {
          type: "code",
          title: {
            en: "The login flow, end to end",
            np: "Login flow, सुरुदेखि अन्त्यसम्म",
            jp: "ログインの流れ",
          },
          code: `public function login(Request $request)
{
    // Authentication would normally happen here (Day 16).

    $request->session()->put('user_id', 123);

    return redirect('/dashboard');
}

public function dashboard(Request $request)
{
    $userId = $request->session()->get('user_id');

    return view('dashboard', ['userId' => $userId]);
}

POST /login
    ↓
put('user_id', 123)  ──→  session storage
    ↓
redirect('/dashboard')
    ↓
GET /dashboard
    ↓
get('user_id')  ←──  session storage
    ↓
123`,
        },
      ],
    },
    {
      title: {
        en: "Flash data, and why it is not just put()",
        np: "Flash data, र यो `put()` भन्दा किन फरक",
        jp: "フラッシュデータと put() の違い",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Flash data</b> is session data meant to survive exactly one more request, then delete itself.\n\nYou already met the shape of this on Day 7: a controller finishes its work, flashes a message, and redirects. The next page reads the message and shows it. What Day 7 did not explain is why `flash()` and not `put()`.\n\nThe difference is cleanup. A value stored with `put()` stays until you remove it, so a \"Saved successfully!\" banner would follow the user around the site until something calls `forget()`. A value stored with `flash()` disappears on its own after the next request reads it, which is exactly the lifetime a one-off message needs.",
            np: "Flash data अर्को request सम्म मात्र रहन्छ, त्यसपछि आफै हट्छ। `put()` ले हटाउँदासम्म रहन्छ।",
            jp: "フラッシュデータは次のリクエストだけ有効で自動削除されます。`put()` は明示的に削除するまで残ります。",
          },
        },
        {
          type: "code",
          title: {
            en: "Two different lifetimes",
            np: "दुई फरक lifetime",
            jp: "2 つの寿命",
          },
          code: `put()    →  value stays until something removes it
            Request 1 ✓   Request 2 ✓   Request 3 ✓   Request 4 ✓ ...

flash()  →  value survives the next request, then vanishes
            Request 1 ✓   Request 2 ✓   Request 3 ✗ gone`,
        },
        {
          type: "code",
          title: {
            en: "Flash then redirect — the pattern to memorise",
            np: "Flash पछि redirect — सम्झ्नुपर्ने pattern",
            jp: "フラッシュしてリダイレクトする定番パターン",
          },
          code: `// Controller
public function store(Request $request)
{
    // ...save the user...

    $request->session()->flash('success', 'User created successfully.');

    return redirect()->route('users.index');
}

{{-- Blade view --}}
@if (session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
@endif

POST /users
    ↓
controller saves the user
    ↓
flash('success', 'User created successfully.')
    ↓
redirect()
    ↓
GET /users  →  Blade reads session('success')  →  "User created successfully."
    ↓
next request  →  the message is already gone`,
        },
        {
          type: "list",
          items: [
            { en: "Success messages after a create, update or delete", np: "Create/update/delete पछिको success message", jp: "作成・更新・削除後の成功メッセージ" },
            { en: "Error notifications that only make sense on the next page", np: "अर्को page मा मात्र अर्थ राख्ने error", jp: "次のページだけで意味を持つエラー通知" },
            { en: "\"Saved successfully\", \"Password changed\", \"Profile updated\"", np: "\"Saved\", \"Password changed\" जस्ता सन्देश", jp: "「保存しました」「更新しました」など" },
          ],
        },
      ],
    },
    {
      title: {
        en: "reflash() and keep()",
        np: "`reflash()` र `keep()`",
        jp: "reflash() と keep()",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Sometimes one request is not enough. If a request redirects again before the message ever reaches a view, the flash data expires unseen.\n\nTwo methods buy you one more request:\n• <b>`reflash()`</b> — keep <i>all</i> the current flash data alive for another request\n• <b>`keep()`</b> — keep only the keys you name\n\nPrefer `keep()` when you know which message matters. It keeps stale values from lingering.",
            np: "`reflash()` ले सबै flash data अर्को request सम्म राख्छ; `keep()` ले छानिएका key मात्र।",
            jp: "`reflash()` は全フラッシュデータを、`keep()` は指定したキーだけをもう 1 リクエスト保持します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Extending flash data by one request",
            np: "Flash data एक request थप्नु",
            jp: "フラッシュデータを 1 リクエスト延長する",
          },
          code: `// Keep everything currently flashed for one more request
$request->session()->reflash();

// Keep only what you care about
$request->session()->keep(['success', 'warning']);

reflash()  →  keep ALL flash data for one more request
keep()     →  keep only the listed keys

Request 1  flash('success', ...)
    ↓
Request 2  redirects again, and calls reflash()
    ↓
Request 3  session('success') is still readable here`,
        },
      ],
    },
    {
      title: {
        en: "Session blocking",
        np: "Session blocking",
        jp: "セッションブロッキング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Two requests from the same user can arrive at almost the same moment. A double-clicked submit button, or a page firing several AJAX calls at once.\n\nBoth requests read the session, both change it, and both write it back. Whichever finishes last overwrites the other, so one of the changes quietly disappears. With some drivers this also corrupts the stored session.\n\n<b>Session blocking</b> is Laravel making the second request wait until the first one is finished with the session. You apply it per route, on the routes that actually write session data, because making every route queue up would slow the application down for no reason.",
            np: "एकै समयमा आउने दुई request ले session बिगार्न सक्छन्। Blocking ले दोस्रोलाई कुर्न लगाउँछ।",
            jp: "同時に届く 2 つのリクエストがセッションを上書きし合う問題を、ブロッキングで直列化して防ぎます。",
          },
        },
        {
          type: "code",
          title: {
            en: "With and without blocking",
            np: "Blocking सहित र बिना",
            jp: "ブロッキングの有無",
          },
          code: `Without blocking
  Request A  ──→ read session ──→ change ──→ write
  Request B  ──→ read session ──→ change ──→ write
                 (B read the old copy, so A's change is lost)

With blocking
  Request A  ──→ [ session locked ] ──→ work ──→ [ unlocked ]
  Request B  ─────────────── waits ────────────────→ read ──→ write

// Route-level blocking: lock for up to 10s, wait up to 10s for the lock
Route::post('/cart/add', [CartController::class, 'add'])->block(10, 10);

// The idea to hold on to:
// session blocking stops competing requests from modifying
// the same session at the same time.`,
        },
      ],
    },
    {
      title: {
        en: "Cookies — reading, setting, queueing & encryption",
        np: "Cookie — पढ्नु, राख्नु, queue र encryption",
        jp: "クッキー — 取得・設定・キュー・暗号化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>cookie</b> is a small piece of information the browser stores on the user's machine. Your server says \"set this cookie: theme = dark\", the browser stores it, and sends it back with every future request to your domain.\n\nThree things to know in Laravel:\n• You <b>read</b> a cookie off the request\n• You <b>set</b> a cookie on the response\n• You can also <b>queue</b> a cookie, which tells Laravel to attach it to whatever response ends up going out\n\nQueueing exists because you do not always have the response object in hand. Deep inside a service class or an event listener, `Cookie::queue()` saves you from threading a response object through half your application.",
            np: "Cookie request बाट पढिन्छ, response मा राखिन्छ; `Cookie::queue()` ले outgoing response मा आफै जोड्छ।",
            jp: "クッキーはリクエストから読み、レスポンスに設定します。`Cookie::queue()` は送出レスポンスへ自動的に付与します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Reading, setting and queueing",
            np: "पढ्नु, राख्नु र queue गर्नु",
            jp: "取得・設定・キュー",
          },
          code: `use Illuminate\\Support\\Facades\\Cookie;

// Read from the request, with an optional default
$theme = $request->cookie('theme');
$theme = $request->cookie('theme', 'light');

// Set on the response  (name, value, minutes)
return response('Hello')->cookie('theme', 'dark', 60 * 24 * 30);

Laravel  →  Response  →  body + Set-Cookie: theme=dark  →  Browser
Browser  →  Cookie: theme=dark  →  $request->cookie('theme')

// Queue it instead, when you do not have the response object here
Cookie::queue('theme', 'dark', 60 * 24 * 30);
Cookie::queue(Cookie::forget('theme'));   // remove it`,
        },
        {
          type: "paragraph",
          text: {
            en: "Laravel <b>encrypts cookies by default</b>. Rather than sending `user_id=123` in plain text, it encrypts and signs the value using your application's `APP_KEY`, then decrypts it automatically on the way back in. If a user edits the cookie by hand, the signature no longer matches and Laravel treats the cookie as absent.\n\nThat protection is real, but do not stretch it into something it is not. <b>The browser is not a trusted environment.</b> The user owns that browser. They can inspect cookies, delete them, replay an old one, or hand them to someone else. Encryption stops them reading and tampering with the contents; it does not turn the browser into a safe place to keep secrets.\n\nSo the rule is: anything sensitive or authoritative belongs on the server, in the session or the database. Cookies hold preferences and identifiers, not secrets and not trust.",
            np: "Laravel ले cookie `APP_KEY` द्वारा encrypt गर्छ, तर browser भरपर्दो ठाउँ होइन — संवेदनशील data server मा राख्नुस्।",
            jp: "Laravel は `APP_KEY` でクッキーを暗号化しますが、ブラウザは信頼できる環境ではありません。機密情報はサーバー側に保持します。",
          },
        },
        {
          type: "code",
          title: {
            en: "How encryption travels",
            np: "Encryption कसरी जान्छ",
            jp: "暗号化の流れ",
          },
          code: `Outgoing
  'user_id=123'  →  encrypt with APP_KEY  →  eyJpdiI6Ik...  →  Browser

Incoming
  eyJpdiI6Ik...  →  Laravel  →  decrypt with APP_KEY  →  'user_id=123'

Tampered value
  eyJpdiI6Ik... (edited by the user)  →  signature does not match
                                      →  Laravel ignores the cookie

Change or lose APP_KEY and every existing encrypted cookie
becomes unreadable, which logs everybody out.`,
        },
      ],
    },
    {
      title: {
        en: "The Redis session prefix",
        np: "Redis session prefix",
        jp: "Redis のセッションプレフィックス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "One last practical detail if you run sessions on Redis.\n\nRedis stores everything as flat keys, and one Redis server is often shared by several applications, plus your own cache alongside your sessions. Without a prefix, two applications both writing `session:123` will overwrite each other, and you get logged-out users with no obvious cause.\n\nLaravel lets you set the Redis key prefix, so every key your application writes is stamped with its own name. It keeps keys readable when you inspect Redis by hand, and it stops collisions between applications.",
            np: "एउटै Redis धेरै app ले प्रयोग गर्दा key टकराउन सक्छ; prefix ले छुट्याउँछ।",
            jp: "1 台の Redis を複数アプリで共有するとキーが衝突します。プレフィックスで名前空間を分けます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Prefixed vs unprefixed keys",
            np: "Prefix सहित र बिना",
            jp: "プレフィックスの有無",
          },
          code: `One Redis server, two applications, no prefix:

  session:123        ←  which application owns this?
  cache:homepage     ←  and this?

With a prefix per application:

  app1_database_session:123
  app1_database_cache:homepage
  app2_database_session:123      ←  no longer collides

# .env
REDIS_PREFIX=myapp_database_

// config/database.php
'redis' => [
    'options' => [
        'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel')) . '_database_'),
    ],
],

Without a prefix  →  session:123
With a prefix     →  myapp_session:123`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the actual difference between a session and a cookie?",
        np: "Session र cookie बीच वास्तविक फरक के हो?",
        jp: "セッションとクッキーの本当の違いは何ですか？",
      },
      answer: {
        en: "It comes down to where the data physically sits.\n\n• <b>Session</b> — the data lives on the server, in the session driver you configured (file, database, redis). The browser only carries a session ID.\n  ↳ Can hold as much as you like, and the user cannot read or change it\n• <b>Cookie</b> — the data lives in the browser and is sent with every request to your domain.\n  ↳ Small, roughly 4KB, and the user can inspect and delete it\n\nThe confusing part: a session normally <i>uses</i> a cookie to carry its ID. So a session depends on a cookie, but it is not one. And Laravel's `cookie` session driver blurs the line further by putting the session data itself into an encrypted cookie.",
        np: "Session को data server मा, browser मा ID मात्र। Cookie को data browser मा, सानो र user ले देख्न सक्ने।",
        jp: "セッションはサーバー側にデータを保持し、ブラウザは ID のみを運びます。クッキーはブラウザ側に実データを持ち、小容量でユーザーから見えます。",
      },
    },
    {
      question: {
        en: "When should I use `flash()` instead of `put()`?",
        np: "`put()` को बदला `flash()` कहिले प्रयोग गर्ने?",
        jp: "`put()` ではなく `flash()` を使うのはいつですか？",
      },
      answer: {
        en: "Ask how long the value should live.\n\n• Use <b>`flash()`</b> when the value is meant to be shown once and then forgotten.\n  ↳ \"User created successfully.\", \"Password changed\", validation errors after a redirect\n  ↳ Laravel deletes it for you after the next request, so there is no cleanup code\n• Use <b>`put()`</b> when the value should persist across many requests.\n  ↳ The logged-in user's ID, a shopping cart, a chosen language\n  ↳ It stays until you call `forget()` or `flush()`\n\nA good tell: if you find yourself writing `forget()` right after reading a value, you wanted `flash()` in the first place. And if you only need it once within the same request cycle, `pull()` reads and removes in one step.",
        np: "एकपटक देखाउने सन्देशलाई `flash()`; धेरै request सम्म रहनुपर्ने value लाई `put()`।",
        jp: "一度だけ表示するメッセージは `flash()`、複数リクエストにわたって保持する値は `put()` を使います。",
      },
    },
    {
      question: {
        en: "My flash message disappeared before the user ever saw it. Why?",
        np: "Flash message देखिनु अगाडि हराइहाल्यो — किन?",
        jp: "フラッシュメッセージが表示前に消えるのはなぜですか？",
      },
      answer: {
        en: "Flash data survives exactly one request. If that request redirects again instead of rendering a view, the message is consumed by a page nobody looked at.\n\nA typical chain: you flash a message, redirect to `/dashboard`, and middleware on `/dashboard` redirects again to `/onboarding`. The flash was spent on `/dashboard`.\n\nThe fix is to extend it by one more request:\n• `$request->session()->reflash()` keeps everything currently flashed alive for another request\n• `$request->session()->keep(['success'])` keeps only the keys you name, which is usually the better choice\n\nIf you find yourself reflashing repeatedly, the redirect chain itself is probably the real problem.",
        np: "Flash एक request मात्र बाँच्छ; बीचमा फेरि redirect भयो भने सकिन्छ। `reflash()` वा `keep()` ले एक request थप्छ।",
        jp: "フラッシュは 1 リクエストのみ有効なので、途中で再リダイレクトすると消費されます。`reflash()` か `keep()` で 1 回分延長します。",
      },
    },
    {
      question: {
        en: "What exactly does session blocking protect against?",
        np: "Session blocking ले ठ्याक्कै केबाट बचाउँछ?",
        jp: "セッションブロッキングは何を防ぎますか？",
      },
      answer: {
        en: "It protects against two requests from the same user overwriting each other's session changes.\n\nHere is the sequence that goes wrong:\n• Request A reads the session and starts working\n• Request B reads the <b>same</b> old copy of the session\n• A writes its changes back\n• B writes its changes back, on top of A's\n\nA's change is gone, silently. No error, no log entry, just a cart item that never got added or a step of a wizard that reset.\n\nWhen this actually bites you: a double-clicked submit button, a page firing several AJAX calls at once, or an impatient user refreshing mid-request. Apply `->block()` to the routes that write session data, not to everything, because blocking makes requests queue up and that costs you response time where it is not needed.",
        np: "एकै user का दुई समानान्तर request ले एक-अर्काको session परिवर्तन मेटाउने समस्या रोक्छ।",
        jp: "同一ユーザーの並行リクエストがセッション変更を上書きし合う問題を防ぎます。書き込みを行うルートにのみ適用します。",
      },
    },
    {
      question: {
        en: "Laravel encrypts cookies, so can I store secrets in them?",
        np: "Laravel ले cookie encrypt गर्छ — त्यसैले secret राख्न मिल्छ?",
        jp: "クッキーは暗号化されるので秘密情報を入れてよいですか？",
      },
      answer: {
        en: "No. Encryption and trust are two different things.\n\nWhat encryption gives you: the user cannot read the value, and cannot change it either, because a tampered value fails its signature check and Laravel ignores the cookie.\n\nWhat it does not give you:\n• The cookie still sits on a machine you do not control. It can be copied, kept after logout, or handed to someone else.\n• An old cookie stays valid until it expires, so you cannot revoke it the way you can delete a server-side session.\n• Everything rests on `APP_KEY`. If that key leaks, every encrypted cookie is readable; if it changes, they all become garbage and every user is logged out.\n\nThe rule: API keys, prices, roles, permissions and anything else your code will trust belong on the server, in the session or the database. Cookies are for preferences and identifiers.",
        np: "मिल्दैन। Encryption ले पढ्न/बदल्न रोक्छ, तर browser भरपर्दो होइन — role, price, key server मा राख्नुस्।",
        jp: "いいえ。暗号化は読み取りと改ざんを防ぐだけで、ブラウザ自体は信頼できません。権限や価格、鍵はサーバー側に保持します。",
      },
    },
    {
      question: {
        en: "Which session driver should I start with?",
        np: "कुन session driver बाट सुरु गर्ने?",
        jp: "最初はどのセッションドライバを使うべきですか？",
      },
      answer: {
        en: "Start with `file` and change it only when something forces you to.\n\n• <b>`file`</b> is the default and needs zero setup. Sessions land in `storage/framework/sessions/`.\n  ↳ Perfectly fine for local development and small single-server sites\n• <b>`database`</b> when you want sessions queryable alongside your data, or when you run more than one application server.\n  ↳ Needs a `sessions` table, which means a migration. That is Day 12.\n• <b>`redis`</b> when session reads and writes become a bottleneck, or you have several servers behind a load balancer.\n  ↳ Fastest option, but now Redis is one more service you have to keep running\n• <b>`cookie`</b> when you want no server-side storage at all.\n  ↳ Practically limited by the roughly 4KB a cookie can hold\n\nThe useful part is that your controller code does not change. Swapping `SESSION_DRIVER` in `.env` is the whole migration path.",
        np: "`file` बाट सुरु गर्नुस्; बहु-server भएपछि `database` वा `redis` मा जानुस्। Controller code बदलिन्न।",
        jp: "まず `file` で始め、複数サーバーや性能要件が出てきたら `database`／`redis` に切り替えます。コントローラのコードは変わりません。",
      },
    },
  ],
};
