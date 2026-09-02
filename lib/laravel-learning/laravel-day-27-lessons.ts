import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_27_LESSONS: LessonDay = {
  day: 27,
  title: "Broadcasting & real time — Reverb, channels & Echo",
  totalMinutes: 92,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "what-is-broadcasting",
      title: "Broadcasting & WebSockets",
      durationMinutes: 11,
      explanation: "Every day so far has had the browser asking and the server answering. Today the server gets to speak first.\n\n> <b>From \"the browser asks for updates\" to \"the server pushes them when something happens\".</b>\n\n---\n\n### 1. Basic — why HTTP cannot do this\n\nHTTP is a question and an answer:\n\n```text\nBrowser  →  GET /notifications  →  Laravel\nBrowser  ←  the response        ←  Laravel\n```\n\nAnd then it is over. If something changes five seconds later, <b>the browser has no way to find out</b>, because nothing is connecting the two any more.\n\nThe workaround is asking repeatedly:\n\n```text\nGET /notifications\n   wait\nGET /notifications\n   wait\nGET /notifications\n```\n\nWhich works, and is wasteful in a specific way worth understanding: <b>almost every request returns nothing new.</b> Poll every five seconds and you have made 720 requests an hour per user to deliver perhaps three notifications, and the news is still up to five seconds late.\n\n---\n\n### 2. Intermediate — a connection that stays open\n\n<b>A <i>WebSocket</i></b> is a connection that stays open, and either side can send at any time:\n\n```text\nHTTP                    WebSocket\n────                    ─────────\nBrowser → Server        Browser ═══════ Server\nBrowser ← Server              persistent\n(closed)                 either side may send\n```\n\nSo the arrangement becomes:\n\n```text\nLaravel\n   ↓ event\nWebSocket server\n   ↓\npersistent connection\n   ↓\nbrowser\n```\n\nThe server sends the moment something happens, and the browser is not asking about anything.\n\n<b>Which changes the resource question rather than removing it.</b> Polling costs requests; WebSockets cost <i>connections</i>. Ten thousand idle users are ten thousand open sockets sitting in memory, doing nothing, and that is a different scaling problem with different answers.\n\nWhat it makes possible:\n\n```text\nlive notifications · chat · online users\nlive dashboards · typing indicators\nreal-time collaboration · order status\n```\n\n---\n\n### 3. Advanced — when it is worth it\n\nBroadcasting adds a server to run, a connection to maintain, a client library, an authorization layer and a reconnection story. So the honest question is whether the thing you are building genuinely needs it.\n\n```text\nreal time                        not real time\n─────────                        ─────────────\nchat, collaboration              a dashboard refreshed\n  — seconds matter                 every minute\nsomebody is watching             a status that changes\n  right now                        once a day\nseveral people see the           the user triggered it and\n  same thing                       can wait for the response\n```\n\n<b>Two cheaper options are worth knowing before reaching for WebSockets.</b>\n\nA slow poll is fine for a lot of things. A dashboard fetching every thirty seconds costs 120 requests an hour and no infrastructure, and nobody notices the delay.\n\nAnd for a one-way stream from server to browser, <b>server-sent events</b> do that over ordinary HTTP with no extra server. They are less capable than WebSockets and enough for a progress bar or a notification feed.\n\nThe test worth applying: <b>would a five-second delay make this feature wrong, or just slightly less nice?</b> Chat is wrong. A notification bell is slightly less nice.\n\nAnd the piece that connects to yesterday: <b>broadcasting is a delivery mechanism, not a source of truth.</b> The event still happened, the database still recorded it, and a user who reloads the page must see the same thing. A UI that only knows what arrived over the socket is broken for anybody who was disconnected, which is everybody, sometimes.",
      diagram: `Why HTTP cannot do this

    Browser  →  GET /notifications  →  Laravel
    Browser  ←  the response        ←  Laravel
    (closed)

  Something changes five seconds later and the browser
  has no way to find out. Nothing connects them any more.

  The workaround:

    GET /notifications
       wait
    GET /notifications
       wait
    GET /notifications

  Wasteful in a specific way: almost every request
  returns NOTHING NEW. Every five seconds is 720
  requests an hour per user to deliver perhaps three
  notifications — and the news is still up to five
  seconds late.


A connection that stays open

  HTTP                    WebSocket
  ────                    ─────────
  Browser → Server        Browser ═══════ Server
  Browser ← Server              persistent
  (closed)                 either side may send

    Laravel
       ↓ event
    WebSocket server
       ↓
    persistent connection
       ↓
    browser

  The server sends the moment something happens.

  ⚠️  This changes the resource question rather than
      removing it. Polling costs REQUESTS. WebSockets
      cost CONNECTIONS: ten thousand idle users are ten
      thousand open sockets in memory, doing nothing.

  What it makes possible:

    live notifications · chat · online users
    live dashboards · typing indicators
    real-time collaboration · order status


When it is worth it

  It adds a server to run, a connection to maintain, a
  client library, an authorization layer and a
  reconnection story.

  real time                     not real time
  ─────────                     ─────────────
  chat, collaboration           a dashboard refreshed
    — seconds matter              every minute
  somebody is watching          a status that changes
    right now                     once a day
  several people see the        the user triggered it
    same thing                    and can wait


  Two cheaper options first:

    A slow poll. A dashboard fetching every thirty
    seconds is 120 requests an hour and no
    infrastructure, and nobody notices.

    Server-sent events. One-way, server to browser, over
    ordinary HTTP with no extra server. Less capable,
    and enough for a progress bar or a feed.


  The test:

    would a five-second delay make this feature WRONG,
    or just slightly less nice?

      chat              wrong
      notification bell slightly less nice


  And: broadcasting is a DELIVERY MECHANISM, not a
  source of truth. The event happened, the database
  recorded it, and a reload must show the same thing.

  A UI that only knows what arrived over the socket is
  broken for anybody who was disconnected — which is
  everybody, sometimes.`,
      codeExample: {
        title: "Polling, and what replaces it",
        code: `// ---------- Polling: what most applications start with ----------

setInterval(async () => {
    const res = await fetch('/api/notifications/unread-count');
    const { count } = await res.json();

    setUnread(count);
}, 5000);

// 720 requests an hour, per user, to deliver perhaps
// three notifications. And the news is still up to five
// seconds old.


// ---------- Broadcasting: the server speaks first ----------

Echo.private('user.' + userId)
    .listen('NotificationCreated', (event) => {
        setUnread((n) => n + 1);
    });

// One connection. Zero requests. Delivered the moment it
// happens.


<?php
// ---------- The trade ----------

// Polling costs REQUESTS.
//   10,000 users × 720/hour = 7.2 million requests
//   almost all returning nothing new
//
// WebSockets cost CONNECTIONS.
//   10,000 users = 10,000 open sockets held in memory,
//   doing nothing most of the time
//
// A different scaling problem, not an absent one.


<?php
// ---------- Cheaper options, first ----------

// A slow poll: no infrastructure, and nobody notices.
// setInterval(fetchStats, 30000);   // 120 requests/hour

// Server-sent events: one-way, over ordinary HTTP.
Route::get('/progress/{job}', function (string $job) {
    return response()->eventStream(function () use ($job) {
        while (! Cache::get("job:{$job}:done")) {
            yield Cache::get("job:{$job}:progress", 0);

            sleep(1);
        }
    });
});

// Enough for a progress bar. No WebSocket server.


<?php
// ---------- Delivery, not truth ----------

// ❌ The UI only knows what arrived over the socket.
//    Anybody who was disconnected sees nothing, and a
//    reload shows an empty bell.

// ✓ The socket updates a UI that could have been built
//   from the database anyway.
public function index(Request $request)
{
    return [
        'notifications' => $request->user()
            ->unreadNotifications()
            ->latest()
            ->take(10)
            ->get(),
    ];
}

// The page loads its state over HTTP, and the socket
// keeps it current. A reload must show the same thing.`,
      },
      keyTakeaways: [
        "<b>HTTP is a question and an answer</b>, so a browser cannot learn about a change made after the response.",
        "<b>Polling asks repeatedly</b>, and almost every request returns nothing new.",
        "Five-second polling is 720 requests an hour per user, and the news is still up to five seconds late.",
        "<b>A WebSocket is a connection that stays open</b>, and either side can send at any time.",
        "<b>Polling costs requests; WebSockets cost connections</b>, so the scaling problem changes rather than disappearing.",
        "It enables chat, live notifications, presence, collaborative editing and live dashboards.",
        "<b>Broadcasting adds a server, a client library, an authorization layer and a reconnection story.</b>",
        "<b>A slow poll or server-sent events are cheaper</b>, and enough for a dashboard or a progress bar.",
        "<b>The test is whether a five-second delay would make the feature wrong</b>, or merely slightly less nice.",
        "<b>Broadcasting is delivery, not truth</b>: the page must still be correct after a reload for somebody who was disconnected.",
      ],
      commonMistakes: [
        "<b>Reaching for WebSockets for a dashboard refreshed once a minute.</b> A poll costs nothing to operate.",
        "<b>Assuming real time removes the load.</b> Ten thousand idle connections are held open in memory.",
        "<b>Building a UI only from socket messages.</b> A disconnected user sees an empty page and a reload shows nothing.",
        "<b>Forgetting the reconnection story.</b> Connections drop, and the UI must recover its state when they do.",
        "<b>Treating a broadcast as the record of what happened.</b> The database is still the source of truth.",
      ],
      quiz: [
        {
          question: "Why can't a normal HTTP page learn about a later change?",
          options: [
            "The browser caches it",
            "The request and response completed, so nothing connects the two any more",
            "Laravel closes the session",
            "It can",
          ],
          correctIndex: 1,
          explanation: "Which is why polling exists, and why it asks repeatedly.",
        },
        {
          question: "What is wasteful about polling?",
          options: [
            "It is slow to write",
            "Almost every request returns nothing new, and the news is still delayed",
            "It cannot be authenticated",
            "It breaks caching",
          ],
          correctIndex: 1,
          explanation: "720 requests an hour per user to deliver perhaps three notifications.",
        },
        {
          question: "What does broadcasting cost that polling does not?",
          options: [
            "More requests",
            "Open connections held in memory, one per connected user",
            "More database queries",
            "Nothing",
          ],
          correctIndex: 1,
          explanation: "A different scaling problem, not an absent one.",
        },
        {
          question: "Why must a real-time UI still load its state over HTTP?",
          options: [
            "For SEO",
            "Somebody who was disconnected has missed messages, and a reload must show the same thing",
            "WebSockets cannot send objects",
            "It does not",
          ],
          correctIndex: 1,
          explanation: "Broadcasting is delivery; the database is the source of truth.",
        },
      ],
    },
    {
      id: "reverb-and-services",
      title: "Reverb, Pusher & Ably",
      durationMinutes: 10,
      explanation: "Something has to hold those connections open, and it is not your web server.\n\n---\n\n### 1. Basic — the extra server\n\nPHP answers a request and exits. <b>It cannot hold ten thousand connections open</b>, because that is not what it does.\n\nSo real-time Laravel has a second server in the picture:\n\n```text\nLaravel\n   ↓ broadcast\nWebSocket server\n   ↓ persistent connections\nbrowsers\n```\n\n<b>Laravel Reverb is Laravel's own WebSocket server</b>, written for this and run by you:\n\n```text\nLaravel  →  Reverb  →  browser\n```\n\nIts job is exactly two things: <b>hold the connections, and deliver broadcasts to the right ones.</b> It does not run your application code, touch your database, or know anything about your models.\n\n---\n\n### 2. Intermediate — or somebody else's server\n\nPusher and Ably do the same job as a managed service:\n\n```text\nLaravel  →  Pusher / Ably  →  browser\n```\n\n```text\nReverb                    Pusher / Ably\n──────                    ─────────────\nyou run it                they run it\nno per-message cost       priced per connection\n                            and message\nyour infrastructure       their infrastructure\nyou handle scaling        scaling is included\nyou handle uptime         uptime is their problem\n```\n\n<b>Neither is the right answer.</b> The decision is made by:\n\n```text\ntraffic · infrastructure you already run\ncost at your volume · operational appetite\nscaling needs · how much downtime hurts\n```\n\nA team already running Redis and comfortable with a process manager will find Reverb straightforward. A team without an operations story will find a managed service worth its price on the first outage.\n\n<b>And the switch is a configuration change</b>, because the application code broadcasts through the same abstraction either way. Which means \"start managed, move to Reverb when the bill justifies it\" is a legitimate plan rather than a rewrite.\n\n---\n\n### 3. Advanced — what running it involves\n\nIf you do run Reverb, it is another long-running process, with everything that implies from Day 25:\n\n```text\nit must be started            a process manager\nit must be restarted          on deploy\nit must be watched            when it dies, real time\n                                silently stops\n```\n\n<b>The failure mode is quiet</b>, and worth naming: when the WebSocket server is down, the page still loads, the buttons still work, and nothing updates live. Nobody gets an error, and the bug report is \"it feels laggy sometimes\".\n\nTwo more operational facts.\n\n<b>It needs its own port, and that port has to be reachable</b> through whatever sits in front of your application. A reverse proxy that does not know about WebSocket upgrades will refuse the connection, and the browser reports something unhelpful.\n\n<b>And it needs TLS in production for the same reason your site does.</b> A page served over HTTPS cannot open an insecure WebSocket; browsers refuse it. So the certificate story applies to the socket as well as the site.\n\nThe practical shape most applications land on:\n\n```text\nlocal        Reverb, started alongside the app\nsmall app    a managed service, and no operations at all\nlarger app   Reverb, with a process manager and monitoring\n```\n\nAnd whichever you pick, <b>the thing to check first when real time stops working is whether the server is running at all.</b>",
      diagram: `The extra server

  PHP answers a request and exits. It cannot hold ten
  thousand connections open, because that is not what
  it does.

    Laravel
       ↓ broadcast
    WebSocket server
       ↓ persistent connections
    browsers

  Laravel Reverb is Laravel's own WebSocket server:

    Laravel  →  Reverb  →  browser

  Its job is exactly two things: hold the connections,
  and deliver broadcasts to the right ones. It does not
  run your application code, touch your database, or
  know anything about your models.


Or somebody else's server

    Laravel  →  Pusher / Ably  →  browser

  Reverb                   Pusher / Ably
  ──────                   ─────────────
  you run it               they run it
  no per-message cost      priced per connection
                             and message
  your infrastructure      their infrastructure
  you handle scaling       scaling included
  you handle uptime        uptime is their problem

  Neither is the right answer. The decision is:

    traffic · infrastructure you already run
    cost at your volume · operational appetite
    scaling needs · how much downtime hurts

  A team already running Redis will find Reverb
  straightforward. A team with no operations story will
  find a managed service worth its price on the first
  outage.

  And the switch is a CONFIGURATION change, because the
  application broadcasts through the same abstraction.
  "Start managed, move to Reverb when the bill justifies
  it" is a plan, not a rewrite.


Running it

  Another long-running process, with everything Day 25
  implies:

    it must be started      a process manager
    it must be restarted    on deploy
    it must be watched      when it dies, real time
                              silently stops

  ⚠️  The failure mode is QUIET. The page loads, the
      buttons work, and nothing updates live. Nobody
      gets an error, and the bug report is "it feels
      laggy sometimes".

  Two more:

    It needs its own PORT, reachable through whatever
    sits in front of your app. A reverse proxy that does
    not know about WebSocket upgrades refuses the
    connection, and the browser reports something
    unhelpful.

    It needs TLS in production. A page served over HTTPS
    cannot open an insecure WebSocket; browsers refuse.
    The certificate story applies to the socket too.


  local       Reverb, started alongside the app
  small app   a managed service, no operations at all
  larger app  Reverb, with a process manager and
              monitoring

  And whichever you pick: when real time stops working,
  check whether the server is running at all.`,
      codeExample: {
        title: "Configuring a broadcaster",
        code: `# ---------- Reverb: you run it ----------

composer require laravel/reverb
php artisan install:broadcasting

# .env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=123456
REVERB_APP_KEY=local-key
REVERB_APP_SECRET=local-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

# What the browser connects to. In production these are
# your public host and 443, over wss.
VITE_REVERB_APP_KEY="\${REVERB_APP_KEY}"
VITE_REVERB_HOST="\${REVERB_HOST}"
VITE_REVERB_PORT="\${REVERB_PORT}"
VITE_REVERB_SCHEME="\${REVERB_SCHEME}"


# Start it, and leave it running.
php artisan reverb:start

# Locally, alongside everything else:
#   php artisan serve
#   php artisan queue:work
#   php artisan reverb:start
#   npm run dev


# ---------- Or a managed service ----------

BROADCAST_CONNECTION=pusher

PUSHER_APP_ID=...
PUSHER_APP_KEY=...
PUSHER_APP_SECRET=...
PUSHER_APP_CLUSTER=eu

# The application code does not change. The switch is a
# configuration change, which makes "start managed, move
# to Reverb later" a plan rather than a rewrite.


<?php
// config/broadcasting.php

'default' => env('BROADCAST_CONNECTION', 'null'),

'connections' => [
    'reverb' => [
        'driver' => 'reverb',
        'key'    => env('REVERB_APP_KEY'),
        'secret' => env('REVERB_APP_SECRET'),
        'app_id' => env('REVERB_APP_ID'),
        'options' => [
            'host'   => env('REVERB_HOST'),
            'port'   => env('REVERB_PORT', 443),
            'scheme' => env('REVERB_SCHEME', 'https'),
        ],
    ],

    'pusher' => ['driver' => 'pusher', /* ... */],

    // Tests, and any environment with no real time.
    'null' => ['driver' => 'null'],
],


# ---------- In production: another process to keep alive ----------

# /etc/supervisor/conf.d/reverb.conf

[program:reverb]
command=php /var/www/artisan reverb:start
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/reverb.log

# When this dies, the page still loads, the buttons still
# work, and nothing updates live. Nobody gets an error.


# ---------- The proxy has to allow the upgrade ----------

# nginx
location /app {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
}

# Without the Upgrade headers the connection is refused,
# and the browser reports something unhelpful.

# And a page on HTTPS cannot open an insecure socket:
# browsers refuse it, so the socket needs TLS too.`,
      },
      keyTakeaways: [
        "<b>PHP answers a request and exits</b>, so it cannot hold thousands of connections open.",
        "<b>Real-time Laravel needs a second server</b> whose only job is holding connections and delivering broadcasts.",
        "<b>Reverb is Laravel's own WebSocket server</b>, run by you, and it never touches your application code or database.",
        "<b>Pusher and Ably do the same job as a managed service</b>, priced per connection and message.",
        "<b>Neither is right by default</b>: it depends on traffic, cost at your volume, and your appetite for operations.",
        "<b>Switching between them is a configuration change</b>, so starting managed and moving later is a real plan.",
        "<b>Reverb is another long-running process</b> needing a process manager, restarts on deploy, and monitoring.",
        "<b>Its failure mode is quiet</b>: the page works and nothing updates live, with no error anywhere.",
        "<b>It needs its own port, reachable through your proxy</b>, which must allow the WebSocket upgrade.",
        "<b>A page on HTTPS cannot open an insecure socket</b>, so TLS applies to the socket too.",
      ],
      commonMistakes: [
        "<b>Expecting the web server to hold WebSocket connections.</b> That is a separate long-running process.",
        "<b>Running Reverb by hand.</b> When it dies, real time stops silently and nothing reports it.",
        "<b>Forgetting the proxy's upgrade headers.</b> The connection is refused with an unhelpful browser error.",
        "<b>Serving the page over HTTPS and the socket over plain WebSocket.</b> Browsers refuse the mixed connection.",
        "<b>Debugging broadcast code when real time stops.</b> Check whether the WebSocket server is running first.",
      ],
      quiz: [
        {
          question: "Why does broadcasting need a separate server?",
          options: [
            "For security",
            "PHP answers a request and exits, so it cannot hold connections open",
            "To reduce database load",
            "Laravel requires it",
          ],
          correctIndex: 1,
          explanation: "The WebSocket server's job is holding connections and delivering broadcasts.",
        },
        {
          question: "What is the difference between Reverb and Pusher?",
          options: [
            "Reverb supports more channels",
            "You run Reverb yourself; Pusher is managed and priced per connection and message",
            "Pusher is faster",
            "Reverb only works locally",
          ],
          correctIndex: 1,
          explanation: "And switching between them is a configuration change.",
        },
        {
          question: "What happens when the WebSocket server dies?",
          options: [
            "The site returns a 500",
            "The page still works and nothing updates live, with no error anywhere",
            "Requests queue up",
            "Laravel restarts it",
          ],
          correctIndex: 1,
          explanation: "Which is why it needs a process manager and monitoring.",
        },
        {
          question: "Why must the WebSocket use TLS in production?",
          options: [
            "For performance",
            "A page served over HTTPS cannot open an insecure WebSocket; browsers refuse it",
            "Reverb requires it",
            "To allow authentication",
          ],
          correctIndex: 1,
          explanation: "The certificate story applies to the socket as well as the site.",
        },
      ],
    },
    {
      id: "broadcasting-events",
      title: "ShouldBroadcast & shaping the payload",
      durationMinutes: 12,
      explanation: "Yesterday's events, with one interface added.\n\n---\n\n### 1. Basic — an event that leaves the server\n\n```php\nclass OrderShipped implements ShouldBroadcast\n{\n}\n```\n\n```text\nsomething happens\n      ↓\nShouldBroadcast\n      ↓\nbroadcast\n      ↓\nWebSocket\n      ↓\nsubscribed clients\n```\n\n<b>That is genuinely the whole change.</b> Yesterday's `OrderShipped` had listeners inside your application; adding the interface means it also leaves the building.\n\nWhich is a nice piece of design: <b>the same event can have server-side listeners and browser subscribers</b>, and neither knows about the other. A `PaymentReceived` event can send a receipt, write an audit row, and update somebody's screen, from one dispatch.\n\n<b>`ShouldBroadcast` queues the broadcast</b>, so the request does not wait for the WebSocket server. Which means a queue worker must be running, and \"my events are not arriving\" is very often that.\n\n---\n\n### 2. Intermediate — `ShouldBroadcastNow`\n\n```php\nclass OrderShipped implements ShouldBroadcastNow\n{\n}\n```\n\n```text\nShouldBroadcast      → queue → broadcast\nShouldBroadcastNow   → broadcast, in the request\n```\n\n<b>Do not reach for this by default.</b> It sends during the request, so the user waits for the WebSocket server, and an unavailable one becomes a failed request for whatever they were actually doing.\n\nIt earns its place in two cases: a chat message, where a queue round trip is a visible delay in a conversation, and a local setup with no worker running, where it is a debugging convenience rather than a design choice.\n\n<b>For everything else, the queue is right</b>, and a hundred milliseconds later is real time enough.\n\n---\n\n### 3. Advanced — what actually goes over the wire\n\nBy default, <b>the event's public properties are serialised and sent.</b> Which is where this goes wrong:\n\n```php\nclass NotificationCreated implements ShouldBroadcast\n{\n    public function __construct(public User $user, public Notification $notification) {}\n}\n```\n\nThat sends the whole user model to the browser: the email, the internal flags, the columns added by a migration last week. <b>Anybody who can subscribe to that channel can read all of it</b>, and unlike an API response, nobody reviewed it.\n\n```php\npublic function broadcastWith(): array\n{\n    return [\n        'id'      => $this->notification->id,\n        'message' => $this->notification->message,\n    ];\n}\n```\n\n<b>This is Day 16's API Resource argument, in a place people forget to apply it.</b> A broadcast is a public interface: send what the client needs and nothing else.\n\n```text\n❌ the User model                ✓ { \"id\": 123,\n     id · email · internal        \"message\": \"...\" }\n     flags · everything else\n```\n\nThree more details worth knowing.\n\n<b>The event name on the wire is the class name</b>, which is what the client listens for. `broadcastAs()` renames it, and is worth using so that renaming a PHP class does not break a deployed frontend.\n\n<b>`broadcastWhen()` can cancel a broadcast</b>, which is useful when the same event is dispatched in cases that should not always reach the browser.\n\n<b>And the broadcaster does not include the sender by default.</b> `toOthers()` excludes the connection that caused the event, which is what stops the person who sent a chat message seeing it twice: once from their own optimistic update, once from the socket.\n\nAnd since `ShouldBroadcast` puts the broadcast on a queue, it can be given its own:\n\n```php\npublic function broadcastQueue(): string\n{\n    return 'broadcasts';\n}\n```\n\n<b>Worth doing, because real time behind a slow queue is not real time.</b> A broadcast waiting behind a batch of PDF generation arrives a minute late, which is indistinguishable from broken.",
      diagram: `An event that leaves the server

    class OrderShipped implements ShouldBroadcast

    something happens → ShouldBroadcast → broadcast
                      → WebSocket → subscribed clients

  That is the whole change. Yesterday's event had
  listeners inside the application; the interface means
  it also leaves the building.

  Which is nice design: the SAME event can have
  server-side listeners AND browser subscribers, and
  neither knows about the other.

    PaymentReceived → sends a receipt
                    → writes an audit row
                    → updates somebody's screen

  from one dispatch.

  ⚠️  ShouldBroadcast QUEUES the broadcast, so a worker
      must be running. "My events are not arriving" is
      very often that.


ShouldBroadcastNow

    ShouldBroadcast      → queue → broadcast
    ShouldBroadcastNow   → broadcast, in the request

  Do not reach for it by default. It sends during the
  request, so the user waits for the WebSocket server —
  and an unavailable one becomes a failed request for
  whatever they were actually doing.

  It earns its place twice:

    a chat message, where a queue round trip is a
      visible delay in a conversation
    a local setup with no worker, as a debugging
      convenience

  Otherwise the queue is right, and a hundred
  milliseconds later is real time enough.


What goes over the wire

  By default, the event's PUBLIC PROPERTIES are
  serialised and sent.

    public function __construct(
        public User \$user,
        public Notification \$notification,
    ) {}

  That sends the whole user model to the browser: the
  email, the internal flags, the columns added by a
  migration last week.

  ⚠️  Anybody who can subscribe to that channel reads all
      of it — and unlike an API response, nobody reviewed
      it.

    public function broadcastWith(): array
    {
        return [
            'id'      => \$this->notification->id,
            'message' => \$this->notification->message,
        ];
    }

  Day 16's API Resource argument, in a place people
  forget to apply it. A broadcast is a PUBLIC INTERFACE.

    ❌ the User model            ✓ { "id": 123,
       id · email · internal        "message": "..." }
       flags · everything else


Three details

  The event name on the wire is the CLASS NAME, which is
  what the client listens for. broadcastAs() renames it,
  so renaming a PHP class does not break a deployed
  frontend.

  broadcastWhen() can cancel a broadcast, for an event
  dispatched in cases that should not always reach the
  browser.

  toOthers() excludes the connection that caused the
  event — which stops the person who sent a chat message
  seeing it twice: once optimistically, once from the
  socket.`,
      codeExample: {
        title: "Broadcasting an event, carefully",
        code: `<?php

namespace App\\Events;

use App\\Models\\Notification;
use Illuminate\\Broadcasting\\PrivateChannel;
use Illuminate\\Contracts\\Broadcasting\\ShouldBroadcast;
use Illuminate\\Foundation\\Events\\Dispatchable;

class NotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Notification $notification) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->notification->user_id)];
    }

    // The name the client listens for. Without this it is
    // the fully qualified class name, so renaming the PHP
    // class breaks a deployed frontend.
    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    // What actually crosses the wire. Without this, every
    // public property is serialised and sent.
    public function broadcastWith(): array
    {
        return [
            'id'         => $this->notification->id,
            'message'    => $this->notification->message,
            'created_at' => $this->notification->created_at->toIso8601String(),
        ];
    }

    // Not every dispatch needs to reach the browser.
    public function broadcastWhen(): bool
    {
        return $this->notification->is_visible;
    }
}


<?php
// ---------- What happens without broadcastWith() ----------

// ❌ The whole user model goes to the browser: the email,
//    the internal flags, and the columns a migration
//    added last week.
class NotificationCreated implements ShouldBroadcast
{
    public function __construct(
        public User $user,
        public Notification $notification,
    ) {}
}

// Anybody who can subscribe to that channel reads all of
// it, and unlike an API response nobody reviewed it.
//
// This is Day 16's resource argument, in the place people
// forget to apply it.


<?php
// ---------- Queued, or now ----------

// ✓ The default. The request does not wait for the
//   WebSocket server.
class OrderShipped implements ShouldBroadcast {}

// A worker must be running. "My events are not arriving"
// is very often that.

// Occasionally right: a chat message, where a queue round
// trip is a visible delay in a conversation.
class MessageSent implements ShouldBroadcastNow {}

// ❌ Everything else. The user waits for the WebSocket
//    server, and an outage there fails a request about
//    something else.


<?php
// ---------- One dispatch, two audiences ----------

PaymentReceived::dispatch($payment);

// Server side, from yesterday:
//   SendReceipt (queued listener)
//   RecordAuditEntry (inline listener)
//
// Browser side, from today:
//   ShouldBroadcast → the customer's screen updates
//
// Neither knows about the other.


<?php
// ---------- toOthers ----------

// The sender already updated their own UI optimistically.
// Without this they see the message twice.
broadcast(new MessageSent($message))->toOthers();

// Requires the client to send its socket id with the
// request, which Echo does automatically.`,
      },
      keyTakeaways: [
        "<b>`ShouldBroadcast` on an event sends it out over the WebSocket</b>, and that is the whole change.",
        "<b>The same event can have server-side listeners and browser subscribers</b>, and neither knows about the other.",
        "<b>`ShouldBroadcast` queues the broadcast</b>, so a worker must be running for events to arrive.",
        "<b>`ShouldBroadcastNow` broadcasts during the request</b>, so an unavailable WebSocket server fails the request.",
        "It suits a chat message, and local debugging, and not much else.",
        "<b>By default every public property of the event is serialised and sent to the browser.</b>",
        "<b>`broadcastWith()` shapes the payload</b>, which is Day 16's resource argument applied to a public interface.",
        "<b>`broadcastAs()` names the event on the wire</b>, so renaming a PHP class does not break a deployed frontend.",
        "<b>`broadcastWhen()` cancels a broadcast</b> for dispatches that should not reach the browser.",
        "<b>`toOthers()` excludes the connection that caused the event</b>, which stops the sender seeing their own message twice.",
      ],
      commonMistakes: [
        "<b>Broadcasting an event with a model as a public property.</b> The entire record goes to the browser unreviewed.",
        "<b>Using `ShouldBroadcastNow` by default.</b> The user waits for the WebSocket server on every request.",
        "<b>Forgetting the queue worker.</b> `ShouldBroadcast` queues, so nothing arrives until something processes it.",
        "<b>Relying on the class name as the wire name.</b> A rename or a namespace move breaks the deployed frontend.",
        "<b>Omitting `toOthers()` on a chat message.</b> The sender sees their own message twice.",
      ],
      quiz: [
        {
          question: "What does adding `ShouldBroadcast` to an event do?",
          options: [
            "Replaces its listeners",
            "Sends it over the WebSocket as well as running its listeners",
            "Queues its listeners",
            "Makes it synchronous",
          ],
          correctIndex: 1,
          explanation: "The same event can have server-side listeners and browser subscribers.",
        },
        {
          question: "What is sent to the browser without `broadcastWith()`?",
          options: [
            "Nothing",
            "Every public property of the event, serialised in full",
            "Only the event name",
            "The model's id",
          ],
          correctIndex: 1,
          explanation: "Which sends a whole user model, including columns nobody reviewed.",
        },
        {
          question: "When is `ShouldBroadcastNow` appropriate?",
          options: [
            "Always, for lower latency",
            "For a chat message where a queue round trip is a visible delay, and for local debugging",
            "When no queue exists in production",
            "For large payloads",
          ],
          correctIndex: 1,
          explanation: "Otherwise the user waits for the WebSocket server during their request.",
        },
        {
          question: "What does `toOthers()` prevent?",
          options: [
            "Unauthorized subscribers",
            "The connection that caused the event receiving it back",
            "Duplicate broadcasts",
            "Queued delivery",
          ],
          correctIndex: 1,
          explanation: "The sender already updated their own UI optimistically.",
        },
      ],
    },
    {
      id: "channels",
      title: "Channels — public, private & presence",
      durationMinutes: 12,
      explanation: "A broadcast has to go somewhere. Channels are where.\n\n---\n\n### 1. Basic — three kinds\n\n```text\nPublic     anyone may subscribe\nPrivate    authorized users only\nPresence   authorized users, and everybody knows who is there\n```\n\n<b>The channel is the addressing</b>: an event broadcast on `user.42` reaches whoever is subscribed to `user.42`, and nobody else.\n\n<b>Public channels</b> require nothing:\n\n```text\nBrowser A ─┐\nBrowser B ─┼→  announcements\nBrowser C ─┘\n```\n\nWhich suits information anybody could see anyway: a public status page, a live scoreboard, a site-wide announcement.\n\n<b>And the rule that follows is absolute: nothing user-specific goes on a public channel.</b> Not \"unlikely to be guessed\", not \"they would need the id\". A public channel is readable by anybody who knows its name, and names are not secrets.\n\n---\n\n### 2. Intermediate — private channels\n\n```text\nprivate-user.123\n```\n\nSubscribing to one asks your application for permission:\n\n```text\nBrowser\n   ↓ subscribe to private-user.123\nLaravel authorization\n   ↓ allowed?\nthe connection joins the channel\n```\n\n<b>This is the one you will use most</b>, because most real-time updates belong to somebody: their notifications, their orders, their invoices.\n\nThe naming convention that follows from that:\n\n```text\nprivate-user.{id}       one person's own events\nprivate-team.{id}       everybody on a team\nprivate-order.{id}      everybody watching one order\npresence-chat.{id}      a room, and who is in it\n```\n\n<b>The channel name is a scope</b>, and choosing it is a design decision rather than a naming one. `private-user.42` and `private-team.7` deliver different things to different sets of people, and getting that wrong is how somebody sees an update they should not.\n\n---\n\n### 3. Advanced — presence channels\n\n<b>A presence channel is a private channel that also tracks who is connected:</b>\n\n```text\nchat.room.123\n\n🟢 Rajan\n🟢 Alice\n🟢 Bob\n```\n\nWhen you join, you learn who is already there. When somebody else joins or leaves, you are told.\n\n```text\nyou join      →  here:    the current members\nsomeone joins →  joining: that member\nsomeone leaves→  leaving: that member\n```\n\nWhich is what builds an online-users list, a collaborative cursor display, or a \"three people are viewing this\" indicator, without any of it being stored anywhere.\n\nThree things worth knowing before relying on it.\n\n<b>Presence data is whatever your authorization callback returns</b>, and it is visible to every other member. Returning the whole user model puts their email in front of everybody in the room. Return a name and an id.\n\n<b>Presence is connection state, not truth.</b> A closed laptop lid, a dropped connection or a tab in the background can all mean somebody appears present when they are not, and appears absent when they are. Treat it as a hint, not a fact, and never as authorization for anything.\n\n<b>And one person can be several members.</b> Two tabs is two connections, so a naive count shows Rajan twice. Deduplicating by user id is on you.\n\nSo the choice, in one place:\n\n```text\nis the information public anyway?     →  a public channel\nis it somebody's, or a group's?       →  a private channel\ndo the members need to know who\n  else is here?                        →  a presence channel\n```",
      diagram: `Three kinds

  Public     anyone may subscribe
  Private    authorized users only
  Presence   authorized users, and everybody knows
             who is there

  The channel is the ADDRESSING: an event broadcast on
  user.42 reaches whoever subscribed to user.42.


Public

    Browser A ─┐
    Browser B ─┼→  announcements
    Browser C ─┘

  Suits information anybody could see anyway: a public
  status page, a live scoreboard, a site-wide notice.

  ⚠️  And the rule is absolute: NOTHING user-specific on
      a public channel. Not "unlikely to be guessed",
      not "they would need the id".

      A public channel is readable by anybody who knows
      its name, and names are not secrets.


Private

    private-user.123

    Browser
       ↓ subscribe to private-user.123
    Laravel authorization
       ↓ allowed?
    the connection joins the channel

  The one you will use most, because most real-time
  updates belong to somebody.

    private-user.{id}     one person's own events
    private-team.{id}     everybody on a team
    private-order.{id}    everybody watching one order
    presence-chat.{id}    a room, and who is in it

  The channel name is a SCOPE, and choosing it is a
  design decision rather than a naming one.
  private-user.42 and private-team.7 deliver different
  things to different people, and getting it wrong is
  how somebody sees an update they should not.


Presence

    chat.room.123

    🟢 Rajan
    🟢 Alice
    🟢 Bob

    you join       →  here:    the current members
    someone joins  →  joining: that member
    someone leaves →  leaving: that member

  Builds an online list, collaborative cursors, or
  "three people are viewing this" — none of it stored.


  Three things before relying on it:

    Presence data is whatever your authorization
    callback RETURNS, and every other member sees it.
    Returning the user model puts their email in front
    of the room. Return a name and an id.

    Presence is CONNECTION STATE, not truth. A closed
    laptop, a dropped connection or a background tab can
    all make somebody appear present when they are not.
    A hint, never authorization.

    One person can be several members. Two tabs is two
    connections, so a naive count shows Rajan twice.
    Deduplicating by user id is on you.


The choice

  public anyway?                   →  public channel
  somebody's, or a group's?        →  private channel
  do members need to know who
    else is here?                   →  presence channel`,
      codeExample: {
        title: "Choosing a channel",
        code: `<?php

use Illuminate\\Broadcasting\\Channel;
use Illuminate\\Broadcasting\\PresenceChannel;
use Illuminate\\Broadcasting\\PrivateChannel;

// ---------- Public: information anybody could see ----------

class SiteStatusChanged implements ShouldBroadcast
{
    public function broadcastOn(): array
    {
        return [new Channel('status')];
    }

    public function broadcastWith(): array
    {
        return ['status' => $this->status];   // nothing personal
    }
}

// ❌ Never this. A public channel is readable by anybody
//    who knows its name, and names are not secrets.
class NotificationCreated implements ShouldBroadcast
{
    public function broadcastOn(): array
    {
        return [new Channel('user.' . $this->userId)];
    }
}


<?php
// ---------- Private: the one you will use most ----------

class NotificationCreated implements ShouldBroadcast
{
    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->notification->user_id)];
    }
}

// The channel name is a scope, and choosing it is a
// design decision:

class InvoicePaid implements ShouldBroadcast
{
    public function broadcastOn(): array
    {
        return [
            // The customer sees their own invoice.
            new PrivateChannel('user.' . $this->invoice->customer_id),

            // The finance team sees every invoice.
            new PrivateChannel('team.finance'),
        ];
    }
}


<?php
// ---------- Presence: private, plus who is here ----------

class MessageSent implements ShouldBroadcast
{
    public function broadcastOn(): array
    {
        return [new PresenceChannel('chat.room.' . $this->message->room_id)];
    }
}

// The client gets here / joining / leaving for free,
// which is what builds an online-users list without
// storing anything.


<?php
// ---------- What presence exposes ----------

// routes/channels.php

// ❌ Every member of the room now sees this user's email,
//    and whatever else the model carries.
Broadcast::channel('chat.room.{roomId}', function ($user, $roomId) {
    return $user->rooms->contains($roomId) ? $user : false;
});

// ✓ A name and an id.
Broadcast::channel('chat.room.{roomId}', function ($user, $roomId) {
    if (! $user->rooms->contains($roomId)) {
        return false;
    }

    return ['id' => $user->id, 'name' => $user->name];
});


// ---------- One person, several connections ----------

// Two tabs is two members. A naive count shows Rajan twice.

const online = members.filter(
    (m, i, all) => all.findIndex((x) => x.id === m.id) === i
);

// And presence is connection state, not truth: a closed
// laptop or a background tab makes somebody look absent
// when they are not. A hint, never authorization.`,
      },
      keyTakeaways: [
        "<b>A channel is the addressing</b>: a broadcast reaches whoever subscribed to that channel name.",
        "<b>Public channels require no authorization</b>, and suit information anybody could see anyway.",
        "<b>Nothing user-specific ever goes on a public channel</b>, because names are not secrets.",
        "<b>Private channels ask your application for permission before a connection joins.</b>",
        "They are what most real-time updates need, because most updates belong to somebody.",
        "<b>The channel name is a scope</b>, so `private-user.42` and `private-team.7` are a design decision.",
        "<b>A presence channel is a private channel that also tracks who is connected</b>, with here, joining and leaving.",
        "<b>Presence data is whatever the authorization callback returns</b>, and every member sees it: return a name and an id.",
        "<b>Presence is connection state, not truth</b>, so treat it as a hint and never as authorization.",
        "<b>One person with two tabs is two members</b>, so deduplicating by user id is your job.",
      ],
      commonMistakes: [
        "<b>Putting a user's notifications on a public channel.</b> Anybody who guesses the name reads them.",
        "<b>Returning the user model from a presence authorization callback.</b> Their email goes to everybody in the room.",
        "<b>Trusting presence as a fact.</b> A closed laptop or a background tab makes it wrong in both directions.",
        "<b>Counting presence members without deduplicating.</b> Two tabs shows the same person twice.",
        "<b>Choosing a channel name without thinking about scope.</b> A team channel delivers to more people than you meant.",
      ],
      quiz: [
        {
          question: "What may go on a public broadcast channel?",
          options: [
            "Anything, since the name is hard to guess",
            "Only information anybody could see anyway",
            "User notifications with an id in the name",
            "Anything encrypted",
          ],
          correctIndex: 1,
          explanation: "A public channel is readable by anybody who knows its name.",
        },
        {
          question: "What does a private channel add?",
          options: [
            "Encryption",
            "An authorization check before a connection may join",
            "A member list",
            "Queued delivery",
          ],
          correctIndex: 1,
          explanation: "Which is why most real-time updates use one.",
        },
        {
          question: "What does a presence channel add over a private one?",
          options: [
            "Encryption",
            "Knowledge of who is connected, with here, joining and leaving events",
            "Guaranteed delivery",
            "Message history",
          ],
          correctIndex: 1,
          explanation: "Which builds an online-users list without storing anything.",
        },
        {
          question: "Why should a presence authorization callback not return the user model?",
          options: [
            "It is slower",
            "Whatever it returns is visible to every other member of the channel",
            "It breaks serialisation",
            "Laravel rejects it",
          ],
          correctIndex: 1,
          explanation: "Return a name and an id, not an email and every other column.",
        },
      ],
    },
    {
      id: "channel-authorization",
      title: "Channel authorization",
      durationMinutes: 11,
      explanation: "The security boundary that only exists in real-time applications.\n\n---\n\n### 1. Basic — a third question\n\nDay 18 and Day 19 gave you two:\n\n```text\nAuthentication          who are you?\nAuthorization           may you do this?\n```\n\nBroadcasting adds a third:\n\n```text\nChannel authorization   may you LISTEN to this?\n```\n\nAnd it is genuinely separate. <b>Being logged in says nothing about which channels you may join</b>, exactly as being logged in said nothing about which invoices you may read.\n\nThe rules live in `routes/channels.php`:\n\n```php\nBroadcast::channel('user.{userId}', function ($user, $userId) {\n    return $user->id === (int) $userId;\n});\n```\n\n```text\nUser 123\n   ↓ subscribe to user.123\nis the authenticated user 123?\n   ↓\nyes → allow      no → deny\n```\n\n<b>Return `true` to allow and `false` to deny</b>, and the callback receives the authenticated user plus whatever the channel name captured.\n\n---\n\n### 2. Intermediate — the cast that matters\n\n```php\nreturn $user->id === (int) $userId;\n```\n\n<b>That cast is not decoration.</b> The channel segment arrives as a string, so `$user->id === $userId` compares an integer to a string and is always false, and every subscription silently fails.\n\nWhich produces the most confusing symptom in this topic: <b>everything is configured correctly and no events ever arrive.</b> No error, no log line, just nothing, because the subscription was refused and the browser did not tell you.\n\nUse `(int)` and a strict comparison, or `==` deliberately, and know which you chose.\n\nAnd the authorization itself should reuse what you already have:\n\n```php\nBroadcast::channel('order.{order}', function ($user, Order $order) {\n    return $user->can('view', $order);\n});\n```\n\n<b>Model binding works here</b>, and so do the policies from Day 19. A channel authorizing differently from the page showing the same data is a bug waiting to be found by somebody who should not have seen an update.\n\n---\n\n### 3. Advanced — what this actually protects\n\nIt is worth being concrete about the attack, because it is easy to treat channel names as obscure enough.\n\nA logged-in user opens the browser console and subscribes to:\n\n```text\nprivate-user.456\nprivate-team.99\nprivate-admin\n```\n\n<b>Nothing stops them trying.</b> The channel name is in the JavaScript, the pattern is obvious, and changing a number is not a skill. Without an authorization callback, they now receive every event you broadcast to those channels, live, and nothing in your logs looks unusual.\n\nSo three rules.\n\n<b>Every private and presence channel needs a callback.</b> A channel with no matching rule is denied by default, which is the right default and also means a typo in the pattern silently blocks a legitimate channel. Check both directions.\n\n<b>Authorize the thing, not the shape.</b> `user.{id}` matching the current user is easy; `team.{id}` needs \"is this user in that team\", and `order.{id}` needs the policy. The pattern matching is not the check.\n\n<b>And remember the payload is the other half.</b> A correctly authorized channel carrying an over-broad payload leaks anyway, which is the previous lesson's point arriving from a different direction. <b>Authorization decides who listens; `broadcastWith()` decides what they hear.</b> Both have to be right.",
      diagram: `A third question

    Authentication          who are you?           Day 18
    Authorization           may you do this?       Day 19
    Channel authorization   may you LISTEN?        today

  Genuinely separate. Being logged in says nothing about
  which channels you may join — exactly as it said
  nothing about which invoices you may read.

    // routes/channels.php
    Broadcast::channel('user.{userId}', function (\$user, \$userId) {
        return \$user->id === (int) \$userId;
    });

    User 123 → subscribe to user.123
             → is the authenticated user 123?
             → yes: allow    no: deny


The cast that matters

    return \$user->id === (int) \$userId;

  ⚠️  Not decoration. The segment arrives as a STRING, so

        \$user->id === \$userId

      compares an integer to a string, is always false,
      and every subscription silently fails.

  Which is the most confusing symptom in this topic:
  everything is configured correctly and no events ever
  arrive. No error, no log line, just nothing.


Reuse what you have

    Broadcast::channel('order.{order}', function (\$user, Order \$order) {
        return \$user->can('view', \$order);
    });

  Model binding works here, and so do Day 19's policies.

  A channel authorizing differently from the page showing
  the same data is a bug waiting to be found by somebody
  who should not have seen an update.


What this actually protects

  A logged-in user opens the console and subscribes to:

    private-user.456
    private-team.99
    private-admin

  Nothing stops them trying. The channel name is in the
  JavaScript, the pattern is obvious, and changing a
  number is not a skill.

  Without a callback they receive every event you
  broadcast there, live, and nothing in your logs looks
  unusual.


Three rules

  Every private and presence channel needs a callback.
  A channel with no matching rule is denied — the right
  default, and also why a typo in the pattern silently
  blocks a legitimate channel. Check both directions.

  Authorize the THING, not the shape. user.{id} matching
  the current user is easy; team.{id} needs "is this user
  in that team"; order.{id} needs the policy. Pattern
  matching is not the check.

  The payload is the other half. A correctly authorized
  channel carrying an over-broad payload leaks anyway.

    authorization  →  WHO listens
    broadcastWith  →  WHAT they hear

  Both have to be right.`,
      codeExample: {
        title: "routes/channels.php, done properly",
        code: `<?php
// routes/channels.php

use App\\Models\\Order;
use App\\Models\\Team;
use Illuminate\\Support\\Facades\\Broadcast;

// ---------- The simplest one, and its trap ----------

Broadcast::channel('user.{userId}', function ($user, $userId) {
    // ⚠️ The cast is essential. The segment is a STRING,
    //    so without it this is always false and every
    //    subscription silently fails.
    return $user->id === (int) $userId;
});


// ---------- Reuse the policies ----------

Broadcast::channel('order.{order}', function ($user, Order $order) {
    // Model binding works here. So does Day 19.
    return $user->can('view', $order);
});

// A channel authorizing differently from the page showing
// the same data is how somebody sees an update they
// should not have.


// ---------- Authorize the thing, not the shape ----------

// ❌ Any logged-in user can join any team's channel.
Broadcast::channel('team.{teamId}', function ($user, $teamId) {
    return true;
});

// ✓
Broadcast::channel('team.{teamId}', function ($user, $teamId) {
    return $user->teams()->whereKey($teamId)->exists();
});


// ---------- Presence: return only what the room should see ----------

Broadcast::channel('chat.room.{roomId}', function ($user, $roomId) {
    if (! $user->rooms()->whereKey($roomId)->exists()) {
        return false;
    }

    // Every other member sees this.
    return ['id' => $user->id, 'name' => $user->name];
});


<?php
// ---------- What it prevents ----------

// A logged-in user, in the browser console:
//
//   Echo.private('user.456').listen(...)
//   Echo.private('team.99').listen(...)
//   Echo.private('admin').listen(...)
//
// The channel names are in the JavaScript and the
// pattern is obvious. Changing a number is not a skill.
//
// Without a callback they receive every event broadcast
// there, live, and nothing in your logs looks unusual.


<?php
// ---------- Both halves ----------

// Authorization decides WHO listens:
Broadcast::channel('order.{order}', fn ($user, Order $order) =>
    $user->can('view', $order));

// broadcastWith() decides WHAT they hear:
public function broadcastWith(): array
{
    return [
        'id'     => $this->order->id,
        'status' => $this->order->status,
        // not the customer's address, not the internal notes
    ];
}

// A correctly authorized channel with an over-broad
// payload still leaks.


# ---------- When nothing arrives ----------

# 1. Is the WebSocket server running?
# 2. Is a queue worker running?      (ShouldBroadcast queues)
# 3. Does the channel have a callback in routes/channels.php?
# 4. Does that callback return true?  (check the cast)
# 5. Does the channel name in Echo match broadcastOn()?
#
# Four and five are silent failures. Nothing logs them.`,
      },
      keyTakeaways: [
        "<b>Channel authorization is a third question</b>, after authentication and authorization: may you listen to this?",
        "<b>Being logged in says nothing about which channels you may join.</b>",
        "Rules live in `routes/channels.php`, returning `true` to allow and `false` to deny.",
        "<b>The channel segment arrives as a string</b>, so a strict comparison without a cast is always false.",
        "<b>That produces the topic's most confusing symptom</b>: everything looks right and no events ever arrive.",
        "<b>Model binding and Day 19's policies work in channel callbacks</b>, and should be reused.",
        "A channel authorizing differently from the page showing the same data is a leak waiting to happen.",
        "<b>A logged-in user can try any channel name from the console</b>, and the names are in your JavaScript.",
        "<b>A channel with no callback is denied</b>, which is right, and means a typo silently blocks a real channel.",
        "<b>Authorization decides who listens; `broadcastWith()` decides what they hear.</b> Both have to be right.",
      ],
      commonMistakes: [
        "<b>Comparing `$user->id === $userId` without a cast.</b> Every subscription fails silently.",
        "<b>Returning `true` from a channel callback to make it work.</b> Any logged-in user now joins any channel.",
        "<b>Authorizing the pattern rather than the thing.</b> Matching `team.{id}` is not checking membership.",
        "<b>Authorizing the channel differently from the page.</b> Somebody sees live what they cannot see on load.",
        "<b>Getting authorization right and the payload wrong.</b> The channel is correct and it still leaks.",
      ],
      quiz: [
        {
          question: "What does channel authorization answer?",
          options: [
            "Who are you?",
            "May you listen to this channel?",
            "May you edit this record?",
            "Is the connection secure?",
          ],
          correctIndex: 1,
          explanation: "A separate question from both authentication and authorization.",
        },
        {
          question: "Why does `$user->id === $userId` fail in a channel callback?",
          options: [
            "The user is not loaded",
            "The channel segment is a string, so a strict comparison with an integer is always false",
            "The callback runs too early",
            "It does not fail",
          ],
          correctIndex: 1,
          explanation: "And the symptom is silent: no events ever arrive, with no error.",
        },
        {
          question: "What happens to a private channel with no callback?",
          options: [
            "Anybody may join",
            "The subscription is denied",
            "Only admins may join",
            "It falls back to public",
          ],
          correctIndex: 1,
          explanation: "The right default, and also why a typo in the pattern silently blocks a real channel.",
        },
        {
          question: "Is correct channel authorization enough?",
          options: [
            "Yes",
            "No; the payload still has to be shaped, or an authorized listener hears too much",
            "Yes, if the channel is private",
            "Only with presence channels",
          ],
          correctIndex: 1,
          explanation: "Authorization decides who listens; `broadcastWith()` decides what they hear.",
        },
      ],
    },
    {
      id: "echo",
      title: "Laravel Echo & the complete flow",
      durationMinutes: 12,
      explanation: "The server can broadcast. Something in the browser has to listen.\n\n---\n\n### 1. Basic — the client half\n\n<b>Laravel Echo</b> is the JavaScript library that connects, subscribes and hands you events:\n\n```text\nLaravel → Reverb → WebSocket → Echo → React / Vue / Livewire\n```\n\n```js\nEcho.private('user.' + userId)\n    .listen('.notification.created', (event) => {\n        // update the UI\n    });\n```\n\n<b>Echo handles the parts you would otherwise write badly:</b> opening the connection, authenticating private channels against your application, reconnecting when the network drops, and resubscribing afterwards.\n\nThat last one matters more than it sounds. Connections drop constantly: a phone changing network, a laptop waking up, a proxy timing out. <b>Reconnection is not an edge case, it is Tuesday</b>, and Echo doing it means you do not.\n\n---\n\n### 2. Intermediate — the whole flow\n\nWorth memorising, because debugging means finding which step failed:\n\n```text\n1. something happens\n        ↓\n2. a Laravel event is created\n        ↓\n3. it implements ShouldBroadcast\n        ↓\n4. Laravel queues the broadcast\n        ↓\n5. a worker sends it to Reverb\n        ↓\n6. Reverb delivers it over the WebSocket\n        ↓\n7. Echo receives it\n        ↓\n8. JavaScript updates the UI\n```\n\n<b>Eight steps, and any one of them can be the reason nothing happens.</b> Which is why the checklist matters: is the server running, is a worker running, is the channel authorized, does the event name match.\n\nThat last one catches everybody. <b>The dot prefix in `.notification.created` means \"this is the exact name\"</b>; without it, Echo prepends your application namespace and listens for something else. A `broadcastAs()` name needs the dot; a bare class name does not.\n\n---\n\n### 3. Advanced — the two frontends\n\n<b>Livewire can listen without you writing JavaScript:</b>\n\n```php\n#[On('echo-private:user.{userId},.notification.created')]\npublic function onNotification(array $event): void\n{\n    $this->unread++;\n}\n```\n\n```text\nbroadcast → Livewire component → state changes → the UI re-renders\n```\n\nWhich fits Day 23's model exactly: the state lives on the server, so a broadcast updating it re-renders the component. <b>For a notification bell in a Livewire application, that is the whole feature.</b>\n\n<b>In React or Vue, the listener updates your own state:</b>\n\n```text\nWebSocket event → Echo listener → setState → re-render\n```\n\nAnd there the details matter more, because you own the lifecycle:\n\n<b>Leave the channel when the component unmounts.</b> Otherwise you accumulate subscriptions, and a listener holding a stale closure updates state that no longer exists.\n\n<b>Update from the previous state, not a captured one.</b> `setUnread(n => n + 1)` is correct where `setUnread(unread + 1)` uses whatever `unread` was when the listener was created.\n\n<b>And reconcile after a reconnect.</b> Messages sent while disconnected never arrive, so the UI is quietly missing things until a reload. Refetching on reconnect is what stops that, and it is the practical form of \"broadcasting is delivery, not truth\".\n\nThe install line, since Echo is not bundled:\n\n```bash\nnpm install --save-dev laravel-echo pusher-js\n```\n\n<b>`pusher-js` is needed even for Reverb</b>, because Reverb speaks the Pusher protocol. That surprises people who assumed a self-hosted server needs no Pusher package.\n\nAnd one convention worth knowing before you wire up a bell. <b>Broadcast notifications go out on a channel Laravel names for you</b>, derived from the model class:\n\n```text\nApp.Models.User.{id}\n```\n\nSo listening on your own `user.{id}` receives nothing, and everything looks broken while both halves are individually correct. Notifications also have their own listener:\n\n```js\nEcho.private(`App.Models.User.${userId}`)\n    .notification((notification) => {\n        bell.increment(notification.type);\n    });\n```\n\n<b>`.notification()` fires for any notification broadcast to that user</b>, rather than for one named event, which is exactly what a notification bell wants.",
      diagram: `The client half

    Laravel → Reverb → WebSocket → Echo
            → React / Vue / Livewire

    Echo.private('user.' + userId)
        .listen('.notification.created', (event) => { ... });

  Echo handles what you would otherwise write badly:
  opening the connection, authenticating private channels
  against your application, reconnecting when the network
  drops, and resubscribing afterwards.

  ⚠️  That last one matters. Connections drop constantly:
      a phone changing network, a laptop waking, a proxy
      timing out.

      Reconnection is not an edge case. It is Tuesday.


The whole flow

    1. something happens
            ↓
    2. a Laravel event is created
            ↓
    3. it implements ShouldBroadcast
            ↓
    4. Laravel queues the broadcast
            ↓
    5. a worker sends it to Reverb
            ↓
    6. Reverb delivers it over the WebSocket
            ↓
    7. Echo receives it
            ↓
    8. JavaScript updates the UI

  Eight steps, and any one can be why nothing happens.

    is the server running?
    is a worker running?
    is the channel authorized?
    does the event NAME match?

  ⚠️  The dot prefix in '.notification.created' means
      "this is the exact name". Without it, Echo prepends
      your application namespace and listens for
      something else.

      A broadcastAs() name needs the dot.
      A bare class name does not.


Two frontends

  Livewire, with no JavaScript of yours:

    #[On('echo-private:user.{userId},.notification.created')]
    public function onNotification(array \$event): void
    {
        \$this->unread++;
    }

    broadcast → component → state changes → re-render

  Day 23's model exactly: the state lives on the server,
  so a broadcast updating it re-renders the component.
  For a notification bell, that is the whole feature.


  React or Vue, where you own the lifecycle:

    WebSocket event → Echo listener → setState → re-render

    Leave the channel on unmount. Otherwise subscriptions
    accumulate and a stale closure updates state that no
    longer exists.

    Update from the PREVIOUS state:
      setUnread(n => n + 1)      ✓
      setUnread(unread + 1)      ✗ captured at subscribe time

    Reconcile after a reconnect. Messages sent while
    disconnected never arrive, so the UI is quietly
    missing things until a reload.

    That is the practical form of "broadcasting is
    delivery, not truth".`,
      codeExample: {
        title: "Listening, in Livewire and in React",
        code: `// resources/js/echo.js

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
});


// ---------- Listening ----------

Echo.private('user.' + userId)
    .listen('.notification.created', (event) => {
        console.log(event.id, event.message);
    });

// The dot prefix says "this is the exact name". Without
// it, Echo prepends your application namespace and
// listens for something that never arrives.
//
//   broadcastAs('notification.created')  →  '.notification.created'
//   no broadcastAs()                     →  'NotificationCreated'


<?php
// ---------- Livewire: no JavaScript of yours ----------

namespace App\\Livewire;

use Livewire\\Attributes\\On;
use Livewire\\Component;

class NotificationBell extends Component
{
    public int $unread = 0;

    public function mount(): void
    {
        // The state is loaded over HTTP, and the socket
        // keeps it current.
        $this->unread = auth()->user()->unreadNotifications()->count();
    }

    #[On('echo-private:user.{userId},.notification.created')]
    public function onNotification(array $event): void
    {
        $this->unread++;
    }

    public function render()
    {
        return view('livewire.notification-bell');
    }
}
?>

{{-- 🔔 {{ $unread }} --}}


// ---------- React: you own the lifecycle ----------

import { useEffect, useState } from 'react';

export function NotificationBell({ userId, initialUnread }) {
    const [unread, setUnread] = useState(initialUnread);

    useEffect(() => {
        const channel = window.Echo.private('user.' + userId);

        channel.listen('.notification.created', () => {
            // ✓ From the previous state. Using unread + 1
            //   would use whatever it was when this
            //   listener was created.
            setUnread((n) => n + 1);
        });

        // Reconnecting means messages were missed, so
        // refetch rather than assuming the count is right.
        const refetch = async () => {
            const res = await fetch('/api/notifications/unread-count');
            const { count } = await res.json();
            setUnread(count);
        };

        window.Echo.connector.pusher.connection.bind('connected', refetch);

        // ✓ Leave on unmount, or subscriptions accumulate
        //   and stale closures update state that is gone.
        return () => {
            window.Echo.leave('user.' + userId);
        };
    }, [userId]);

    return <span>🔔 {unread}</span>;
}


// ---------- Presence ----------

window.Echo.join('chat.room.' + roomId)
    .here((members) => setOnline(members))
    .joining((member) => setOnline((m) => [...m, member]))
    .leaving((member) => setOnline((m) => m.filter((x) => x.id !== member.id)))
    .listen('.message.sent', (event) => appendMessage(event));


// ---------- When nothing arrives, in order ----------

// 1. Is Reverb running?
// 2. Is a queue worker running?
// 3. Does routes/channels.php authorize this channel?
// 4. Does the callback return true?  (the (int) cast)
// 5. Does the listened name match broadcastAs()?  (the dot)
//
// Steps 3, 4 and 5 fail silently.`,
      },
      keyTakeaways: [
        "<b>Laravel Echo is the client library</b> that connects, subscribes, authenticates and hands you events.",
        "<b>It handles reconnection and resubscription</b>, which matters because connections drop constantly.",
        "<b>The flow has eight steps</b>, and debugging means working out which one failed.",
        "The checklist is: server running, worker running, channel authorized, callback true, event name matching.",
        "<b>A leading dot means the exact event name</b>; without it Echo prepends your application namespace.",
        "<b>Livewire can listen with an `#[On]` attribute</b>, updating server-side state and re-rendering.",
        "That fits Day 23's model exactly, and is the whole feature for a notification bell.",
        "<b>In React you own the lifecycle</b>: leave the channel on unmount or subscriptions accumulate.",
        "<b>Update from the previous state</b>, because a listener captures whatever the value was when it was created.",
        "<b>Refetch after a reconnect</b>, because messages sent while disconnected never arrive.",
      ],
      commonMistakes: [
        "<b>Omitting the leading dot with `broadcastAs()`.</b> Echo listens for a namespaced name that never arrives.",
        "<b>Not leaving the channel on unmount.</b> Subscriptions accumulate and stale closures update dead state.",
        "<b>Using the captured value in a state update.</b> The count is wrong after the second event.",
        "<b>Ignoring reconnection.</b> The UI silently misses everything sent while the socket was down.",
        "<b>Debugging the JavaScript first.</b> Check the server, the worker and the channel callback before the client.",
      ],
      quiz: [
        {
          question: "What does Echo handle for you?",
          options: [
            "Broadcasting events",
            "Connecting, authenticating private channels, reconnecting and resubscribing",
            "Channel authorization rules",
            "Queueing broadcasts",
          ],
          correctIndex: 1,
          explanation: "Reconnection especially, because connections drop constantly.",
        },
        {
          question: "What does a leading dot in `.notification.created` mean?",
          options: [
            "A private channel",
            "The exact event name, with no application namespace prepended",
            "A presence channel",
            "A wildcard",
          ],
          correctIndex: 1,
          explanation: "A `broadcastAs()` name needs it; a bare class name does not.",
        },
        {
          question: "Why leave the channel when a React component unmounts?",
          options: [
            "To free the WebSocket",
            "Otherwise subscriptions accumulate and stale closures update state that no longer exists",
            "Echo requires it",
            "To trigger a reconnect",
          ],
          correctIndex: 1,
          explanation: "In Livewire the component's lifecycle handles it for you.",
        },
        {
          question: "Why refetch after a reconnect?",
          options: [
            "To re-authenticate",
            "Messages sent while disconnected never arrive, so the UI is quietly out of date",
            "Echo clears its state",
            "To reset the counter",
          ],
          correctIndex: 1,
          explanation: "The practical form of \"broadcasting is delivery, not truth\".",
        },
      ],
    },
    {
      id: "presence-whispers-and-models",
      title: "Presence in practice, whispers & model broadcasting",
      durationMinutes: 11,
      explanation: "Three features that look similar and answer different questions.\n\n---\n\n### 1. Basic — who is online\n\nA presence channel gives the client three things:\n\n```text\nyou join       →  here:     everybody currently connected\nsomeone joins  →  joining:  that member\nsomeone leaves →  leaving:  that member\n```\n\n```text\nChat Room #123\n\n🟢 Rajan\n🟢 Alice\n🟢 Bob\n```\n\n<b>Which is the entire online-users feature</b>, with nothing stored, nothing polled and no `last_seen_at` column that is always slightly wrong.\n\nAnd that comparison is worth making. The database version needs a heartbeat, a threshold, a cleanup job, and a decision about what \"online\" means. The presence version knows, because the connection either exists or it does not.\n\nThe cost is what the last lesson said: <b>connection state is not truth</b>, so treat presence as \"probably here\" rather than a fact.\n\n---\n\n### 2. Intermediate — whispers\n\n\"Alice is typing\" does not need your server:\n\n```text\n❌ Alice → Laravel → database → broadcast → Bob\n✓ Alice ──────── WebSocket ────────→ Bob\n```\n\n<b>A <i>client event</i>, or whisper, goes browser to browser through the WebSocket server</b>, without touching PHP at all:\n\n```js\nchannel.whisper('typing', { name: user.name });\nchannel.listenForWhisper('typing', (e) => showTyping(e.name));\n```\n\nWhich matters because a typing indicator fires on every keystroke. Routing that through Laravel is a request per character, and the information is worthless one second later.\n\n```text\nwhispers suit          whispers do not suit\n─────────────          ────────────────────\ntyping indicators      anything you store\ncursor positions       anything you authorize\nlive selections        anything that must be true\ntemporary UI state     anything another user acts on\n```\n\n<b>The rule: a whisper never becomes a fact.</b> It is unvalidated data from one browser to another, and your server never saw it. A chat message sent as a whisper is a message that does not exist anywhere, arrives only for people currently connected, and can say anything the sender's console types.\n\n---\n\n### 3. Advanced — model broadcasting\n\nLaravel can broadcast Eloquent changes automatically:\n\n```text\nPost updated → model broadcasting → WebSocket → clients\n```\n\nWhich is genuinely convenient for a real-time CRUD screen, and worth being careful with.\n\n<b>The problem is that it broadcasts changes, not meaning.</b> Yesterday's distinction again: `updated` fires for a title edit, a view-count increment, a nightly backfill and a migration script. All of them reach the browser, and the client has to work out which mattered.\n\n<b>And every column goes.</b> A model broadcast carries the model, so the internal fields, the flags and whatever a migration added last week are on the wire, exactly as the payload lesson warned.\n\nSo the judgement:\n\n```text\nmodel broadcasting suits        a domain event suits\n────────────────────────        ────────────────────\nan internal admin screen        anything user-facing\na prototype                     anything meaningful\na table that mirrors rows       anything you shape\n                                anything an import might touch\n```\n\n<b>The question to ask is the same one as yesterday: what does the client actually need to know?</b>\n\nA browser rarely needs \"a row changed\". It needs \"this order shipped\", which is a different sentence, fires in fewer cases, and carries three fields instead of thirty.",
      diagram: `Who is online

    you join       →  here:     everybody connected
    someone joins  →  joining:  that member
    someone leaves →  leaving:  that member

    Chat Room #123
    🟢 Rajan  🟢 Alice  🟢 Bob

  The entire online-users feature, with nothing stored,
  nothing polled, and no last_seen_at column that is
  always slightly wrong.

  The database version needs a heartbeat, a threshold, a
  cleanup job, and a decision about what "online" means.
  The presence version knows: the connection exists or
  it does not.

  ⚠️  And connection state is not truth. "Probably here",
      not a fact.


Whispers

  "Alice is typing" does not need your server.

    ❌ Alice → Laravel → database → broadcast → Bob
    ✓ Alice ──────── WebSocket ────────→ Bob

    channel.whisper('typing', { name: user.name })
    channel.listenForWhisper('typing', (e) => ...)

  Which matters because a typing indicator fires on every
  keystroke. Routing that through Laravel is a request
  per character, for information worthless one second
  later.

  suit                     do not suit
  ────                     ───────────
  typing indicators        anything you store
  cursor positions         anything you authorize
  live selections          anything that must be true
  temporary UI state       anything another user acts on

  ⚠️  A whisper never becomes a FACT. It is unvalidated
      data from one browser to another, and your server
      never saw it.

      A chat message sent as a whisper exists nowhere,
      arrives only for people currently connected, and
      can say whatever the sender's console types.


Model broadcasting

    Post updated → model broadcasting → WebSocket → clients

  Convenient for a real-time CRUD screen, and worth care.

  ⚠️  It broadcasts CHANGES, not MEANING.

      updated fires for a title edit, a view-count
      increment, a nightly backfill and a migration
      script. All of them reach the browser, and the
      client works out which mattered.

  ⚠️  And every column goes. The model is the payload, so
      internal fields and whatever a migration added last
      week are on the wire.


  model broadcasting suits    a domain event suits
  ────────────────────────    ────────────────────
  an internal admin screen    anything user-facing
  a prototype                 anything meaningful
  a table mirroring rows      anything you shape
                              anything an import touches


  The question is yesterday's:

    what does the client actually need to KNOW?

  A browser rarely needs "a row changed". It needs
  "this order shipped" — a different sentence, firing
  in fewer cases, carrying three fields instead of
  thirty.`,
      codeExample: {
        title: "Presence, whispers, and what not to automate",
        code: `// ---------- Presence: the whole online feature ----------

const channel = window.Echo.join('chat.room.' + roomId);

channel
    .here((members) => setOnline(members))
    .joining((member) => setOnline((m) => [...m, member]))
    .leaving((member) => setOnline((m) => m.filter((x) => x.id !== member.id)));

// Nothing stored. No heartbeat. No last_seen_at column
// that is always slightly wrong, and no cleanup job.
//
// The database version needs all four, plus a decision
// about what "online" means.


// ---------- Whispers: browser to browser ----------

// ❌ A request per keystroke, for information that is
//    worthless one second later.
input.addEventListener('input', () => {
    fetch('/api/typing', { method: 'POST' });
});

// ✓ Straight through the WebSocket. PHP never sees it.
input.addEventListener('input', () => {
    channel.whisper('typing', { id: user.id, name: user.name });
});

channel.listenForWhisper('typing', (e) => {
    showTypingIndicator(e.name);
    clearAfter(2000);
});


// ---------- What a whisper must never be ----------

// ❌ This message exists nowhere. It arrives only for
//    people currently connected, and it can say whatever
//    the sender's console types.
channel.whisper('message', { body: text });

// ✓ A message is a fact. It goes through the server,
//   which validates it, stores it, and broadcasts it.
await fetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ room_id: roomId, body: text }),
});


<?php
// ---------- Model broadcasting ----------

use Illuminate\\Database\\Eloquent\\BroadcastsEvents;

class Post extends Model
{
    use BroadcastsEvents;

    public function broadcastOn(string $event): array
    {
        return [new PrivateChannel('team.' . $this->team_id)];
    }
}

// Convenient. And it broadcasts CHANGES, not meaning:
//
//   a title edit                   → broadcast
//   a view-count increment         → broadcast
//   a nightly backfill of 50,000   → 50,000 broadcasts
//   a migration script             → broadcast
//
// All of them reach the browser, carrying every column.


<?php
// ---------- The alternative ----------

// A sentence rather than a row change.
class OrderShipped implements ShouldBroadcast
{
    public function __construct(public Order $order) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->order->user_id)];
    }

    public function broadcastAs(): string
    {
        return 'order.shipped';
    }

    // Three fields, not thirty.
    public function broadcastWith(): array
    {
        return [
            'id'          => $this->order->id,
            'status'      => $this->order->status,
            'shipped_at'  => $this->order->shipped_at->toIso8601String(),
        ];
    }
}

// Fires when an order actually ships, and not when a
// backfill touches the row.


<?php
// ---------- Deduplicating presence ----------

// Two tabs is two members. A naive count shows Rajan twice.
// And presence is connection state: a closed laptop makes
// somebody look absent when they are not.
//
// A hint. Never authorization.`,
      },
      keyTakeaways: [
        "<b>A presence channel gives you here, joining and leaving</b>, which is the whole online-users feature.",
        "<b>Nothing is stored</b>: no heartbeat, no threshold, no cleanup job, no `last_seen_at` that is always slightly wrong.",
        "<b>A whisper goes browser to browser through the WebSocket server</b>, without touching PHP at all.",
        "It suits typing indicators, cursors and live selections, where a request per keystroke would be absurd.",
        "<b>A whisper never becomes a fact</b>: it is unvalidated, unstored, and only reaches people currently connected.",
        "<b>A chat message sent as a whisper exists nowhere</b> and can say whatever the sender's console types.",
        "<b>Model broadcasting sends Eloquent changes automatically</b>, which suits an internal screen or a prototype.",
        "<b>It broadcasts changes, not meaning</b>: a backfill of fifty thousand rows is fifty thousand broadcasts.",
        "<b>And it carries every column</b>, so internal fields go over the wire.",
        "<b>Ask what the client needs to know</b>: \"this order shipped\" beats \"a row changed\" in every dimension.",
      ],
      commonMistakes: [
        "<b>Building online status with a `last_seen_at` column and a cleanup job.</b> A presence channel already knows.",
        "<b>Sending a typing indicator through the server.</b> That is a request per keystroke for disposable information.",
        "<b>Sending a chat message as a whisper.</b> It is unvalidated, unstored, and invisible to anybody who reconnects.",
        "<b>Enabling model broadcasting on a table an import touches.</b> A backfill becomes tens of thousands of broadcasts.",
        "<b>Broadcasting the model instead of a shaped payload.</b> Every column reaches the browser.",
      ],
      quiz: [
        {
          question: "What does a presence channel replace?",
          options: [
            "A queue",
            "A `last_seen_at` column with a heartbeat, a threshold and a cleanup job",
            "Channel authorization",
            "Polling for messages",
          ],
          correctIndex: 1,
          explanation: "The connection either exists or it does not.",
        },
        {
          question: "What is a whisper?",
          options: [
            "A queued broadcast",
            "A client event sent browser to browser through the WebSocket, never reaching PHP",
            "A private channel message",
            "A presence update",
          ],
          correctIndex: 1,
          explanation: "Which is why a typing indicator does not cost a request per keystroke.",
        },
        {
          question: "Why must a chat message not be sent as a whisper?",
          options: [
            "Whispers are slower",
            "It is unvalidated, unstored, and only reaches people currently connected",
            "Whispers cannot carry text",
            "It would be duplicated",
          ],
          correctIndex: 1,
          explanation: "A whisper never becomes a fact.",
        },
        {
          question: "What is the risk of model broadcasting?",
          options: [
            "It is slow",
            "It broadcasts every change and every column, including backfills and internal fields",
            "It cannot use private channels",
            "It bypasses authorization",
          ],
          correctIndex: 1,
          explanation: "A domain event says what happened, in fewer cases, with fewer fields.",
        },
      ],
    },
    {
      id: "scaling-security-and-choosing",
      title: "Scaling, security & what belongs in real time",
      durationMinutes: 13,
      explanation: "The operational and architectural half, and the question the day exists to answer.\n\n---\n\n### 1. Basic — broadcasting is not queueing\n\nTwo things that both involve \"later\" and answer different questions:\n\n```text\nQueue           when should the SERVER do this work?\n                  Job → Queue → Worker\n\nBroadcasting    how should the server tell a CLIENT?\n                  Event → WebSocket → Browser\n```\n\n<b>A queue moves work off the request. Broadcasting moves information to a browser.</b> Neither substitutes for the other, and they usually appear together:\n\n```text\nbusiness event → queued broadcast → Reverb → browser\n```\n\nAnd the comparison with polling, stated once:\n\n```text\npolling                    broadcasting\n───────                    ────────────\nmany requests, mostly      one connection, held open\n  returning nothing\nup to N seconds late       immediate\nno extra infrastructure    a WebSocket server to run\ncosts requests             costs connections\n```\n\n---\n\n### 2. Intermediate — scaling\n\nOne server is simple:\n\n```text\n         Reverb\n        /  |  \\\n   Browser Browser Browser\n```\n\nA hundred thousand connections is not:\n\n```text\n            Load Balancer\n           /      |      \\\n     Reverb 1  Reverb 2  Reverb 3\n           \\      |      /\n           shared infrastructure\n```\n\nAnd that last line is the whole problem. <b>A user connected to Reverb 2 must receive an event broadcast to Reverb 1</b>, which means the instances need something between them. Without it, half your users silently miss half the events, and which half depends on load balancing.\n\nThe things to think about are different from scaling PHP:\n\n```text\nconnection count      each one costs memory, permanently\nnetwork bandwidth     not requests per second\nevent throughput      fan-out multiplies: one event to\n                        10,000 subscribers is 10,000 sends\nsticky sessions       a reconnect must be able to land\n                        anywhere\nfailure recovery      when an instance dies, its\n                        connections reconnect at once\n```\n\n<b>WebSocket systems are not \"add another PHP server\".</b> A web server is stateless and interchangeable; a WebSocket server holds state that matters, and losing it is visible to users.\n\n---\n\n### 3. Advanced — security, and the question\n\nThe security point, restated because it is the one that goes wrong:\n\n```text\nauthenticated  ≠  authorized for every channel\n```\n\nUser 123 must not be able to subscribe to `private-user.456`, `private-admin` or `private-company.999`, and the only thing stopping them is your callback.\n\nFour things to control:\n\n```text\nchannel authorization   who may listen\nbroadcast payloads      what they hear\npresence data           what members see about each other\nclient events           what browsers may send each other\n```\n\n<b>All four, because getting three right still leaks.</b>\n\n---\n\n### The question this day exists for\n\nNot \"how do I use Echo\". It is:\n\n> <b>What should be an HTTP response, what should be a queued job, what should be a domain event, and what genuinely needs pushing to a browser?</b>\n\n```text\nthe user asked for it and can wait\n                                    →  an HTTP response\n\nthe user should not wait for it     →  a queued job\n\nsomething happened, and several\n  things should follow               →  a domain event\n\nsomebody else's screen must change\n  without them asking                →  broadcasting\n\nit is transient and nobody stores it →  a whisper\n\na five-second delay is acceptable    →  a poll, and no\n                                          infrastructure\n```\n\nAnd the shape they combine into:\n\n```text\nuser creates a notification\n        ↓\ndomain event\n        ↓\nqueue\n        ↓\nbroadcast\n        ↓\nReverb\n        ↓\nEcho\n        ↓\nthe bell updates\n```\n\n<b>Six steps, five of which are days you have already done.</b> Broadcasting is the last one, and it only earns its place when somebody else's screen has to change without them asking for it.\n\nOne concrete detail on that shared infrastructure, because it is the actionable part: <b>the layer between Reverb nodes is Redis pub/sub.</b> Each node subscribes, so an event published on node A reaches the connections held by node B. Without it, two Reverb processes are two separate applications, and which one a user reaches decides what they see.",
      diagram: `Broadcasting is not queueing

  Queue         when should the SERVER do this work?
                  Job → Queue → Worker

  Broadcasting  how should the server tell a CLIENT?
                  Event → WebSocket → Browser

  Neither substitutes for the other, and they usually
  appear together:

    business event → queued broadcast → Reverb → browser


  polling                   broadcasting
  ───────                   ────────────
  many requests, mostly     one connection, held open
    returning nothing
  up to N seconds late      immediate
  no extra infrastructure   a WebSocket server to run
  costs requests            costs connections


Scaling

  One server:

             Reverb
            /  |  \\
       Browser Browser Browser

  A hundred thousand connections:

              Load Balancer
             /      |      \\
       Reverb 1  Reverb 2  Reverb 3
             \\      |      /
             shared infrastructure

  ⚠️  That last line is the whole problem. A user on
      Reverb 2 must receive an event broadcast to
      Reverb 1.

      Without something between the instances, half your
      users silently miss half the events — and which
      half depends on load balancing.

  Different from scaling PHP:

    connection count    each costs memory, permanently
    bandwidth           not requests per second
    event throughput    fan-out multiplies: one event to
                          10,000 subscribers is 10,000 sends
    sticky sessions     a reconnect must land somewhere valid
    failure recovery    when an instance dies, its
                          connections all reconnect at once

  A web server is stateless and interchangeable. A
  WebSocket server holds state that matters, and losing
  it is visible to users.


Security

    authenticated  ≠  authorized for every channel

  User 123 must not reach private-user.456,
  private-admin, or private-company.999 — and the only
  thing stopping them is your callback.

  Four things to control:

    channel authorization   who may listen
    broadcast payloads      what they hear
    presence data           what members see about each other
    client events           what browsers may send each other

  All four. Getting three right still leaks.


The question this day exists for

  Not "how do I use Echo", but:

    the user asked and can wait        →  an HTTP response
    the user should not wait           →  a queued job
    something happened, and several
      things should follow              →  a domain event
    somebody ELSE's screen must
      change without them asking        →  broadcasting
    transient, nobody stores it        →  a whisper
    a five-second delay is fine        →  a poll, and no
                                            infrastructure


  And the shape they combine into:

    user creates a notification
            ↓
    domain event          Day 26
            ↓
    queue                 Day 25
            ↓
    broadcast             today
            ↓
    Reverb
            ↓
    Echo
            ↓
    the bell updates

  Six steps, five of which are days you have done.

  Broadcasting is the last one, and it earns its place
  only when somebody else's screen must change without
  them asking.`,
      codeExample: {
        title: "The whole flow, and where each piece belongs",
        code: `<?php
// ---------- The combination, in order ----------

// 1. The business action.
public function store(Request $request)
{
    $notification = Notification::create($request->validated());

    // 2. A domain event: Day 26.
    NotificationCreated::dispatch($notification);

    return response()->noContent();
}


// 3. The event broadcasts, on a queue: Day 25 and today.
class NotificationCreated implements ShouldBroadcast
{
    public function __construct(public Notification $notification) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->notification->user_id)];
    }

    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id'      => $this->notification->id,
            'message' => $this->notification->message,
        ];
    }
}

// 4. routes/channels.php decides who may listen.
Broadcast::channel('user.{userId}', fn ($user, $userId) =>
    $user->id === (int) $userId);

// 5, 6, 7, 8. Reverb, the socket, Echo, the bell.


<?php
// ---------- Queue or broadcast? ----------

// A queue answers: when should the SERVER do this work?
SendWelcomeEmail::dispatch($user);

// Broadcasting answers: how should the server tell a CLIENT?
NotificationCreated::dispatch($notification);   // ShouldBroadcast

// Neither replaces the other. Most real features use both.


<?php
// ---------- Choosing, per feature ----------

// The user asked, and can wait: an HTTP response.
return response()->json($invoice);

// The user should not wait: a queued job.
GenerateInvoicePdf::dispatch($invoice);

// Several things should follow: a domain event.
InvoicePaid::dispatch($invoice);

// Somebody ELSE's screen must change: broadcasting.
class InvoicePaid implements ShouldBroadcast {}

// Transient, and nobody stores it: a whisper.
// channel.whisper('typing', { name });

// A five-second delay is acceptable: a poll, and no
// infrastructure at all.
// setInterval(fetchStats, 30000);


<?php
// ---------- Security: all four, not three ----------

// 1. Who may listen.
Broadcast::channel('team.{teamId}', fn ($user, $teamId) =>
    $user->teams()->whereKey($teamId)->exists());

// 2. What they hear.
public function broadcastWith(): array
{
    return ['id' => $this->order->id, 'status' => $this->order->status];
}

// 3. What presence members see about each other.
Broadcast::channel('chat.{room}', fn ($user, $room) =>
    ['id' => $user->id, 'name' => $user->name]);

// 4. What browsers may whisper to each other: nothing
//    that another user acts on as if it were true.


# ---------- Scaling: the line that matters ----------

#             Load Balancer
#            /      |      \\
#      Reverb 1  Reverb 2  Reverb 3
#            \\      |      /
#            shared infrastructure
#
# A user on Reverb 2 must receive an event broadcast to
# Reverb 1. Without something between them, half your
# users miss half the events, silently.
#
# And the numbers to watch are not requests per second:
#   connections held · bandwidth · fan-out
#   reconnection storms when an instance dies`,
      },
      keyTakeaways: [
        "<b>A queue decides when the server does work; broadcasting decides how the server tells a client.</b>",
        "Neither replaces the other, and a real feature usually uses both.",
        "<b>Polling costs requests and is late; broadcasting costs connections and infrastructure.</b>",
        "<b>Several WebSocket servers need shared infrastructure between them</b>, or users miss events depending on which they hit.",
        "<b>The numbers to watch are connections, bandwidth and fan-out</b>, not requests per second.",
        "<b>One event to ten thousand subscribers is ten thousand sends</b>, which is a different shape of load.",
        "<b>A WebSocket server holds state that matters</b>, so it is not interchangeable the way a web server is.",
        "<b>Authenticated does not mean authorized for every channel</b>, and only your callback stops a user trying.",
        "<b>Control all four: authorization, payloads, presence data and client events.</b> Three out of four still leaks.",
        "<b>Ask what should be a response, a job, an event, or a push</b>, rather than how to use Echo.",
        "<b>Broadcasting earns its place when somebody else's screen must change without them asking.</b>",
      ],
      commonMistakes: [
        "<b>Treating broadcasting as an alternative to queues.</b> They answer different questions and usually appear together.",
        "<b>Running several WebSocket servers with nothing between them.</b> Events reach only the instance that received them.",
        "<b>Planning capacity in requests per second.</b> Connections and fan-out are what actually limit you.",
        "<b>Securing the channel and not the payload.</b> An authorized listener still hears too much.",
        "<b>Reaching for real time when a thirty-second poll would do.</b> That is a server to run for a delay nobody notices.",
      ],
      quiz: [
        {
          question: "What is the difference between a queue and broadcasting?",
          options: [
            "None",
            "A queue decides when the server does work; broadcasting decides how it tells a client",
            "Broadcasting is faster",
            "Queues are for background work only",
          ],
          correctIndex: 1,
          explanation: "Most real features use both, in sequence.",
        },
        {
          question: "Why do several WebSocket servers need shared infrastructure?",
          options: [
            "For authentication",
            "A user connected to one must receive events broadcast to another",
            "To balance load",
            "For TLS termination",
          ],
          correctIndex: 1,
          explanation: "Without it, users silently miss events depending on where they landed.",
        },
        {
          question: "What limits a WebSocket system?",
          options: [
            "Requests per second",
            "Connections held, bandwidth, and fan-out per event",
            "Database queries",
            "PHP workers",
          ],
          correctIndex: 1,
          explanation: "One event to ten thousand subscribers is ten thousand sends.",
        },
        {
          question: "When does broadcasting earn its place?",
          options: [
            "Whenever data changes",
            "When somebody else's screen must change without them asking",
            "For any slow work",
            "For anything a user waits on",
          ],
          correctIndex: 1,
          explanation: "Otherwise a response, a job, or a poll is the right answer.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why can a normal HTTP page not learn about a later change?",
      options: [
        "The browser caches it",
        "The request and response completed, so nothing connects the two any more",
        "Sessions expire",
        "It can",
      ],
      correctIndex: 1,
      explanation: "Which is why polling exists, and why it asks repeatedly.",
    },
    {
      question: "What does broadcasting cost that polling does not?",
      options: [
        "More requests",
        "Open connections held in memory, one per connected user",
        "More database queries",
        "Nothing",
      ],
      correctIndex: 1,
      explanation: "A different scaling problem, not an absent one.",
    },
    {
      question: "Why does broadcasting need a separate server?",
      options: [
        "For security",
        "PHP answers a request and exits, so it cannot hold connections open",
        "To reduce load",
        "Laravel requires it",
      ],
      correctIndex: 1,
      explanation: "Reverb, Pusher or Ably do that job.",
    },
    {
      question: "What is sent to the browser without `broadcastWith()`?",
      options: [
        "Nothing",
        "Every public property of the event, serialised in full",
        "Only the event name",
        "The model id",
      ],
      correctIndex: 1,
      explanation: "Which sends a whole user model, including columns nobody reviewed.",
    },
    {
      question: "When is `ShouldBroadcastNow` appropriate?",
      options: [
        "Always",
        "A chat message where a queue round trip is a visible delay, and local debugging",
        "Whenever the payload is small",
        "In production only",
      ],
      correctIndex: 1,
      explanation: "Otherwise the user waits for the WebSocket server during their request.",
    },
    {
      question: "What may go on a public channel?",
      options: [
        "Anything with an unguessable name",
        "Only information anybody could see anyway",
        "User notifications",
        "Anything, if the payload is small",
      ],
      correctIndex: 1,
      explanation: "A public channel is readable by anybody who knows its name.",
    },
    {
      question: "Why does `$user->id === $userId` fail in a channel callback?",
      options: [
        "The user is not loaded",
        "The channel segment is a string, so the strict comparison is always false",
        "The callback runs too early",
        "It does not fail",
      ],
      correctIndex: 1,
      explanation: "And it fails silently: no events arrive, with no error anywhere.",
    },
    {
      question: "What does a presence channel add over a private one?",
      options: [
        "Encryption",
        "Knowledge of who is connected, with here, joining and leaving",
        "Guaranteed delivery",
        "Message history",
      ],
      correctIndex: 1,
      explanation: "Which builds an online-users list without storing anything.",
    },
    {
      question: "Why should a presence callback not return the user model?",
      options: [
        "It is slow",
        "Whatever it returns is visible to every other member of the channel",
        "It cannot be serialised",
        "Laravel rejects it",
      ],
      correctIndex: 1,
      explanation: "Return a name and an id.",
    },
    {
      question: "What does a leading dot mean in `.order.shipped`?",
      options: [
        "A private channel",
        "The exact event name, with no application namespace prepended",
        "A presence channel",
        "A wildcard",
      ],
      correctIndex: 1,
      explanation: "A `broadcastAs()` name needs it; a bare class name does not.",
    },
    {
      question: "Why must a real-time UI refetch after reconnecting?",
      options: [
        "To re-authenticate",
        "Messages sent while disconnected never arrive, so the UI is quietly out of date",
        "Echo clears its state",
        "It does not need to",
      ],
      correctIndex: 1,
      explanation: "Broadcasting is delivery, not truth.",
    },
    {
      question: "Why must a chat message not be sent as a whisper?",
      options: [
        "Whispers are slower",
        "It is unvalidated, unstored, and reaches only people currently connected",
        "Whispers cannot carry text",
        "It would arrive twice",
      ],
      correctIndex: 1,
      explanation: "A whisper never becomes a fact.",
    },
    {
      question: "What is the risk of model broadcasting?",
      options: [
        "It is slow",
        "It broadcasts every change and every column, including backfills and internal fields",
        "It bypasses authorization",
        "It cannot use private channels",
      ],
      correctIndex: 1,
      explanation: "A domain event says what happened, in fewer cases, with fewer fields.",
    },
    {
      question: "Why do several WebSocket servers need shared infrastructure?",
      options: [
        "For TLS",
        "A user connected to one must receive events broadcast to another",
        "To authenticate channels",
        "For load balancing only",
      ],
      correctIndex: 1,
      explanation: "Without it, users miss events depending on which instance they hit.",
    },
    {
      question: "When does broadcasting earn its place?",
      options: [
        "Whenever data changes",
        "When somebody else's screen must change without them asking",
        "For any slow work",
        "For anything a user is waiting on",
      ],
      correctIndex: 1,
      explanation: "Otherwise a response, a job, or a poll is the right answer.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Make InvoiceHub's notification bell update without a refresh, then break it in the five ways it breaks in production and be able to name each one.",
    brief: "Yesterday's notification bell needs a page reload to change. Today it updates the moment something happens, and the interesting part is not getting that working.\n\n<b>It is knowing why it stops.</b> Real time fails quietly: no error, no log line, no broken page, just nothing arriving. So this day is built around deliberately causing each of the five failures and recognising the symptom, because in production you will only ever see the symptom.\n\nYou will need four things running at once: the application, a queue worker, Reverb, and Vite. Anything that stops working, check those four first.\n\nAnd one rule for the whole day: <b>the page must still be correct after a reload for somebody who was disconnected.</b> If the bell is only right because the socket was connected the whole time, it is not finished.",
    steps: [
      "Install broadcasting and Reverb, start it, and confirm from the browser's network tab that a WebSocket connection is open before writing any application code.",
      "Make `NotificationCreated` implement `ShouldBroadcast`, broadcasting on a private channel scoped to the recipient. Add `broadcastAs()` and explain in a comment why the class name is a bad wire name.",
      "Look at what the browser receives with no `broadcastWith()`. Write down every field that arrived, then add `broadcastWith()` and compare.",
      "Add the channel authorization callback. Deliberately omit the `(int)` cast first, watch nothing arrive, and write down what the browser and the logs told you. Which was nothing.",
      "Wire up Echo and update the bell. Get it incrementing without a refresh, in whichever of Livewire or React your application uses.",
      "From the browser console, subscribe to another user's private channel. Confirm you are refused, then temporarily make the callback return `true` and confirm you now receive their notifications. Put it back.",
      "Now break it five ways, one at a time, and record the symptom for each: stop Reverb; stop the queue worker; remove the channel callback; misspell the event name in Echo; drop the `(int)` cast.",
      "For each of those five, write the one-line diagnostic you would use to identify it in production. That list is the deliverable.",
      "Reload the page with the socket disconnected and confirm the bell still shows the right count, because the page loads its state over HTTP.",
      "Now disconnect, create three notifications from another session, reconnect, and see what the bell shows. Then add a refetch on reconnect and try again.",
      "Add a presence channel to an invoice detail page so viewers can see who else is looking at it. Return only a name and an id from the callback, and check what a second browser sees.",
      "Open the same invoice in two tabs as the same user and count the presence members. Fix the duplicate.",
      "Add a whisper for \"someone is editing this invoice\", firing on input. Confirm in the network tab that no HTTP request is made per keystroke.",
      "Try sending something through a whisper that should be a fact, such as a comment, then write down three reasons it is wrong.",
      "Finally, list every real-time feature you built and answer for each: could this have been a poll, and what would that have cost? Anything where the honest answer is yes, say so.",
    ],
    acceptance: [
      "The notification bell increments without a page refresh.",
      "The broadcast payload contains only the fields the UI uses, and you recorded what it contained before you shaped it.",
      "A second user cannot subscribe to another user's channel, and you demonstrated both the refusal and what happens without it.",
      "You have five recorded symptoms and five one-line diagnostics for the five ways real time breaks.",
      "Reloading with the socket disconnected shows the correct count, because the page loads its state over HTTP.",
      "Reconnecting after missing three notifications produces the correct count, not a stale one.",
      "The presence list shows other viewers, exposes only a name and an id, and counts one person once across two tabs.",
      "The editing indicator makes no HTTP request per keystroke, confirmed in the network tab.",
      "You can state three reasons a whisper must not carry something that needs to be true.",
      "Every real-time feature is listed with an honest answer about whether a poll would have done.",
    ],
    stretch: [
      "Add a live invoice status that updates for everybody watching, and decide between a domain event and model broadcasting with a written reason.",
      "Simulate a Reverb restart while three browsers are connected, and observe the reconnect. Note what a thousand simultaneous reconnects would mean.",
      "Add a Slack notification alongside the broadcast on the same event, so one dispatch reaches a screen, an inbox and a channel.",
    ],
  },
};
