import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_19_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Traditional web apps work on a request-response cycle — the browser asks, the server answers. Real-time apps <b>push updates from the server to the browser</b> without the browser asking first.\n\nThink of the difference between:\n• Checking your phone for messages every minute (polling — wasteful, slow)\n• Getting a push notification the instant someone messages you (WebSockets — instant, efficient)\n\n<b>Common use cases:</b>\n• Live notifications (\"You have a new order\")\n• Chat and messaging\n• Collaborative editing (Google Docs-style)\n• Live dashboards (sports scores, stock prices)\n• Delivery and order tracking",
      np: "Real-time = server बाट browser मा push। WebSocket = instant notification। Chat, notification, dashboard मा use हुन्छ।",
      jp: "リアルタイムとはサーバーからブラウザへの Push。チャット・通知・ライブダッシュボードに使う。",
    },
    {
      en: "Laravel's real-time stack has four pieces:\n• <b>Events</b> — PHP classes that implement `ShouldBroadcast`; they carry the data to push\n  ↳ You already know Laravel events from Day 13; broadcasting is just events that go to the browser\n• <b>Channels</b> — named \"rooms\" the browser subscribes to (public, private, or presence)\n• <b>Broadcasting driver</b> — the WebSocket transport layer\n  ↳ <b>Reverb</b>: self-hosted, free, built by Laravel team (recommended for new projects)\n  ↳ <b>Pusher</b>: managed cloud service, generous free tier, no server management\n• <b>Laravel Echo</b> — the JavaScript library that subscribes to channels and triggers callbacks",
      np: "4 pieces: Events (ShouldBroadcast), Channels, Driver (Reverb/Pusher), Echo (JS library)।",
      jp: "4 要素: Events (ShouldBroadcast)、Channels、ドライバ (Reverb/Pusher)、Echo (JS)。",
    },
  ],
  sections: [
    {
      title: {
        en: "How broadcasting works — the full picture",
        np: "Broadcasting कसरी काम गर्छ",
        jp: "ブロードキャストの仕組み",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The full flow, step by step:\n\n1. User submits a form → controller saves data to the database\n2. Controller fires `event(new PostCreated($post))`\n3. The `PostCreated` event implements `ShouldBroadcast`\n4. Laravel serialises the event and sends it to the WebSocket server (Reverb or Pusher)\n5. All browsers currently subscribed to the `posts` channel instantly receive the payload\n6. Echo triggers your JavaScript callback — you update the UI\n\nNo page refresh. No polling. The browser reacts in under 100ms.",
            np: "Controller → event fire → ShouldBroadcast → WebSocket server → Echo → UI update। Page refresh नचाहिने।",
            jp: "コントローラ → イベント → ShouldBroadcast → WebSocket サーバ → Echo → UI 更新。リロード不要。",
          },
        },
        {
          type: "code",
          title: { en: "PostCreated event + controller dispatch", np: "Event class र dispatch", jp: "イベントクラスとディスパッチ" },
          code: `// app/Events/PostCreated.php
namespace App\\Events;

use App\\Models\\Post;
use Illuminate\\Broadcasting\\Channel;
use Illuminate\\Broadcasting\\InteractsWithSockets;
use Illuminate\\Contracts\\Broadcasting\\ShouldBroadcast;
use Illuminate\\Foundation\\Events\\Dispatchable;
use Illuminate\\Queue\\SerializesModels;

class PostCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Post $post) {}

    // Which channel to broadcast on
    public function broadcastOn(): array
    {
        return [new Channel('posts')]; // public channel
    }

    // What data to send (keep this lean — only what the frontend needs)
    public function broadcastWith(): array
    {
        return [
            'id'         => $this->post->id,
            'title'      => $this->post->title,
            'author'     => $this->post->user->name,
            'created_at' => $this->post->created_at->toISOString(),
        ];
    }
}

// app/Http/Controllers/PostController.php — fire the event
public function store(Request $request): JsonResponse
{
    $post = Post::create($request->validated());
    event(new PostCreated($post)); // broadcast to all subscribers
    return response()->json($post, 201);
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "`broadcastWith()` controls exactly what data is sent to the browser. Return only what the frontend needs — never broadcast passwords, tokens, or sensitive internal fields. If you omit `broadcastWith()`, Laravel serialises all public properties of the event class automatically.",
            np: "`broadcastWith()` = browser मा जाने data control गर्छ। Sensitive data never broadcast गर्ने।",
            jp: "`broadcastWith()` で送信データを制御。パスワード等の機密情報は絶対に送らない。",
          },
        },
      ],
    },
    {
      title: {
        en: "Channels — public, private & presence",
        np: "Channels — public, private र presence",
        jp: "チャンネル — public・private・presence",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Channels are like TV channels — you tune in to receive a specific broadcast.\n\n• <b>Public channels</b> — open to everyone, no auth check required\n  ↳ Use for: news feeds, live sports scores, public dashboards\n• <b>Private channels</b> — require authentication; the server verifies the user can access this channel\n  ↳ Use for: order status updates, user-specific notifications\n• <b>Presence channels</b> — like a private channel but the server also tells you who else is subscribed\n  ↳ Use for: chat rooms, collaborative editing (\"Alice and Bob are viewing this document\")",
            np: "Public = सबैका लागि। Private = auth required। Presence = members को list पनि थाहा हुन्छ।",
            jp: "Public は誰でも受信可能。Private は認証必須。Presence は誰が参加しているかも分かる。",
          },
        },
        {
          type: "code",
          title: { en: "Channel authorisation in routes/channels.php", np: "Channel auth define गर्ने", jp: "チャンネルの認可設定" },
          code: `// routes/channels.php

use App\\Models\\Order;
use Illuminate\\Support\\Facades\\Broadcast;

// PUBLIC channel — no auth needed, anyone can subscribe
Broadcast::channel('posts', function () {
    return true; // always allow
});

// PRIVATE channel — user must own the order
Broadcast::channel('orders.{orderId}', function ($user, $orderId) {
    $order = Order::find($orderId);
    return $order && $user->id === $order->user_id;
    // return false or null = denied (Echo gets a 403)
});

// PRESENCE channel — must return an array of member data (not just true/false)
Broadcast::channel('chat.{roomId}', function ($user, $roomId) {
    if ($user->canJoinRoom($roomId)) {
        return [
            'id'     => $user->id,
            'name'   => $user->name,
            'avatar' => $user->avatar_url,
        ];
    }
    return false; // deny access
});`,
        },
        {
          type: "table",
          caption: {
            en: "Channel type comparison",
            np: "Channel types को तुलना",
            jp: "チャンネルタイプの比較",
          },
          headers: [
            { en: "Type", np: "प्रकार", jp: "タイプ" },
            { en: "Class", np: "Class", jp: "クラス" },
            { en: "Auth required?", np: "Auth चाहिन्छ?", jp: "認証必須?" },
            { en: "Best for", np: "उपयुक्त", jp: "用途" },
          ],
          rows: [
            [
              { en: "Public", np: "Public", jp: "Public" },
              { en: "`Channel`", np: "`Channel`", jp: "`Channel`" },
              { en: "No", np: "छैन", jp: "不要" },
              { en: "News feeds, live scores, public dashboards", np: "News, scores, dashboard", jp: "ニュース・スコア・ダッシュボード" },
            ],
            [
              { en: "Private", np: "Private", jp: "Private" },
              { en: "`PrivateChannel`", np: "`PrivateChannel`", jp: "`PrivateChannel`" },
              { en: "Yes — user must be authorised", np: "छ — user authorize हुनुपर्छ", jp: "必須 — ユーザー認可が必要" },
              { en: "Order status, user notifications", np: "Order status, notifications", jp: "注文状況・ユーザー通知" },
            ],
            [
              { en: "Presence", np: "Presence", jp: "Presence" },
              { en: "`PresenceChannel`", np: "`PresenceChannel`", jp: "`PresenceChannel`" },
              { en: "Yes — must return member data", np: "छ — member data return गर्नुपर्छ", jp: "必須 — メンバーデータを返す" },
              { en: "Chat rooms, collaborative editing", np: "Chat, collaborative editing", jp: "チャット・共同編集" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Setting up Laravel Reverb (self-hosted WebSocket server)",
        np: "Laravel Reverb setup गर्ने",
        jp: "Laravel Reverb のセットアップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Reverb</b> is Laravel's own WebSocket server — introduced in Laravel 11, free, and runs on your own server alongside PHP-FPM and Nginx. It's the recommended default for new projects.\n\n<b>Pusher</b> is the cloud alternative:\n• <b>Pros:</b> zero server management, instant setup, generous free tier (200 concurrent connections, 800k messages/day)\n• <b>Cons:</b> costs money beyond the free tier, third-party dependency\n\nFor most new projects: start with Pusher free tier, migrate to Reverb if you hit limits or need more control.",
            np: "Reverb = self-hosted, free। Pusher = managed cloud। Start मा Pusher free tier, later Reverb।",
            jp: "Reverb は自己ホスト型で無料。Pusher はクラウドで簡単。まず Pusher 無料プランで始めてもよい。",
          },
        },
        {
          type: "code",
          title: { en: "Installing and running Reverb", np: "Reverb install र run गर्ने", jp: "Reverb のインストールと起動" },
          code: `# Install Reverb and scaffold the broadcasting config
php artisan install:broadcasting
# (chooses Reverb by default in Laravel 11, installs the package and publishes config)

# .env settings for Reverb
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=my-app
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http  # use https in production

# Start Reverb in development
php artisan reverb:start
# Reverb runs on ws://localhost:8080

# In production — run Reverb via Supervisor so it restarts on crash
# /etc/supervisor/conf.d/reverb.conf
# [program:reverb]
# command=php /var/www/myapp/artisan reverb:start --host=0.0.0.0 --port=8080
# autostart=true
# autorestart=true
# redirect_stderr=true
# stdout_logfile=/var/log/reverb.log`,
        },
        {
          type: "paragraph",
          text: {
            en: "In production, run Reverb behind <b>Nginx as a reverse proxy</b> so WebSocket connections get HTTPS (WSS). Add an Nginx `location /app/` block that proxies to `http://localhost:8080`. The Laravel Reverb docs include the exact Nginx config.\n\n↳ Reverb also supports <b>horizontal scaling</b> via Redis — multiple Reverb nodes share state through Redis pub/sub, so you can run Reverb on multiple servers behind a load balancer",
            np: "Production मा Nginx reverse proxy पछाडि run गर्ने। Redis ले horizontal scaling support गर्छ।",
            jp: "本番は Nginx リバースプロキシの後ろで動かす。Redis で水平スケーリングも可能。",
          },
        },
      ],
    },
    {
      title: {
        en: "Laravel Echo — the frontend WebSocket listener",
        np: "Laravel Echo — frontend listener",
        jp: "Laravel Echo — フロントエンドの WebSocket リスナー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Echo is the JavaScript companion to Laravel broadcasting. It wraps the raw WebSocket API into a clean, readable interface. Install it once, configure it once, then use it anywhere in your JavaScript (vanilla, React, Vue, etc.).",
            np: "Echo = Laravel broadcasting को JS companion। Install र configure एकपटक, जहाँ पनि use गर्न सकिन्छ।",
            jp: "Echo は Laravel ブロードキャストの JS ライブラリ。一度設定すれば React・Vue どこでも使える。",
          },
        },
        {
          type: "code",
          title: { en: "Installing Echo + Reverb configuration", np: "Echo install र configure", jp: "Echo のインストールと設定" },
          code: `# Install Echo and the Pusher JS driver (used by both Pusher and Reverb)
npm install --save-dev laravel-echo pusher-js

// resources/js/bootstrap.js — configure Echo for Reverb
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

// --- Three channel patterns ---

// 1. PUBLIC channel
Echo.channel('posts')
    .listen('PostCreated', (e) => {
        console.log('New post:', e.title);
        addPostToFeed(e); // update your UI
    });

// 2. PRIVATE channel (user must be authenticated)
Echo.private('orders.' + orderId)
    .listen('OrderShipped', (e) => {
        showNotification('Your order has shipped!');
    });

// 3. PRESENCE channel (also tracks who's online)
Echo.join('chat.' + roomId)
    .here((members) => { setOnlineUsers(members); })     // initial member list
    .joining((member) => { addUser(member); })            // someone joined
    .leaving((member) => { removeUser(member); })         // someone left
    .listen('MessageSent', (e) => { addMessage(e); });`,
        },
        {
          type: "paragraph",
          text: {
            en: "Echo re-connects automatically with exponential backoff if the WebSocket drops. In React/Vue, call `Echo.leaveChannel('posts')` or `Echo.disconnect()` in your component's cleanup function to avoid memory leaks.\n\n↳ Echo works with both Reverb and Pusher — just change `broadcaster: 'reverb'` to `broadcaster: 'pusher'` and update the key/cluster env vars",
            np: "Echo auto-reconnect गर्छ। Component cleanup मा `leaveChannel()` call गर्नुपर्छ।",
            jp: "Echo は自動再接続する。コンポーネントのクリーンアップで `leaveChannel()` を必ず呼ぶ。",
          },
        },
      ],
    },
    {
      title: {
        en: "Practical example — live notification badge",
        np: "Practical example — live notification",
        jp: "実践例 — リアルタイム通知バッジ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A complete end-to-end walkthrough: when any user creates a post, all other users see their notification badge increment in real-time — without refreshing the page. This covers the entire stack.",
            np: "User ले post create गर्दा अरू users को notification badge instant update हुन्छ।",
            jp: "投稿作成時に他ユーザーの通知バッジがリアルタイムで増える実装例。",
          },
        },
        {
          type: "code",
          title: { en: "ShouldBroadcast event → Echo listener", np: "Event र Echo listener", jp: "ShouldBroadcast イベントと Echo リスナー" },
          code: `// app/Events/NewPostPublished.php
use Illuminate\\Broadcasting\\PrivateChannel;
use Illuminate\\Contracts\\Broadcasting\\ShouldBroadcast;

class NewPostPublished implements ShouldBroadcast
{
    public function __construct(
        public Post $post,
        public int $targetUserId  // the user to notify
    ) {}

    public function broadcastOn(): array
    {
        // Every user has their own private channel: App.Models.User.{id}
        return [new PrivateChannel('App.Models.User.' . $this->targetUserId)];
    }

    public function broadcastWith(): array
    {
        return [
            'type'    => 'NewPostPublished',
            'message' => "{$this->post->user->name} published a new post",
            'postId'  => $this->post->id,
        ];
    }
}

// Controller — notify all followers when a post is published
public function store(Request $request): JsonResponse
{
    $post = Post::create([...$request->validated(), 'user_id' => auth()->id()]);

    // Notify each follower (in a real app, dispatch a job for large follower lists)
    auth()->user()->followers->each(function ($follower) use ($post) {
        event(new NewPostPublished($post, $follower->id));
    });

    return response()->json($post, 201);
}

// Frontend — React component
useEffect(() => {
    const channel = Echo.private('App.Models.User.' + userId);

    channel.notification((notification) => {
        if (notification.type === 'NewPostPublished') {
            setUnreadCount(c => c + 1);  // bump the badge
            toast(notification.message);
        }
    });

    return () => Echo.leaveChannel('App.Models.User.' + userId); // cleanup
}, [userId]);`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>`ShouldBroadcast` vs `ShouldBroadcastNow`:</b>\n\n• `ShouldBroadcast` (recommended) — event is pushed to the queue; the HTTP response returns immediately; the broadcast happens in the background\n• `ShouldBroadcastNow` — event broadcasts synchronously inline, before the HTTP response returns\n  ↳ Useful in development for testing without running a queue worker\n  ↳ Avoid in production — it slows down every HTTP request that fires the event",
            np: "ShouldBroadcast = queued (production मा use गर्ने)। ShouldBroadcastNow = synchronous (dev मा only)।",
            jp: "ShouldBroadcast はキュー経由で非同期。ShouldBroadcastNow は同期で遅くなる。本番は前者を使う。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use Reverb vs Pusher?",
        np: "Reverb vs Pusher — कहिले कुन use गर्ने?",
        jp: "Reverb と Pusher はどちらを選ぶ？",
      },
      answer: {
        en: "Use <b>Pusher free tier</b> to start: zero config, no server to manage, 200 concurrent connections and 800k messages/day is enough for most small-to-medium apps.\n\nSwitch to <b>Reverb</b> when:\n• You hit Pusher's limits or pricing becomes significant\n• Your data is privacy-sensitive (healthcare, finance) and you need on-premise hosting\n• You want full control over horizontal scaling\n\nReverb is drop-in compatible — switching is a `.env` change and an `npm install`.",
        np: "Start मा Pusher free tier। Privacy-sensitive वा large-scale भएमा Reverb।",
        jp: "最初は Pusher 無料プランで。規模が大きくなったり、データをオンプレに置きたい時は Reverb へ。",
      },
    },
    {
      question: {
        en: "What is the difference between Broadcasting and Notifications?",
        np: "Broadcasting र Notifications को फरक के हो?",
        jp: "ブロードキャストと通知の違いは？",
      },
      answer: {
        en: "Laravel <b>Notifications</b> (Day 10) send messages via channels like email, SMS, and Slack — they are fire-and-forget messages to external services.\n\nLaravel <b>Broadcasting</b> pushes real-time data directly to browsers via WebSockets — it's for updating UI instantly.\n\nThey overlap via the `broadcast` notification channel: a Notification can implement `toBroadcast()` to push a notification payload over a WebSocket AND send an email at the same time.",
        np: "Notification = email/SMS/Slack। Broadcasting = browser मा real-time push। toBroadcast() ले combine गर्न सकिन्छ।",
        jp: "Notification はメール・SMS・Slack 送信。Broadcasting はブラウザへのリアルタイム Push。",
      },
    },
    {
      question: {
        en: "Does every event need to implement ShouldBroadcast?",
        np: "हरेक event ले ShouldBroadcast implement गर्नु पर्छ?",
        jp: "すべてのイベントに ShouldBroadcast が必要？",
      },
      answer: {
        en: "No — only events that the browser needs to know about immediately require `ShouldBroadcast`. Regular Laravel events (used with Listeners, Day 13) run server-side only.\n\nAdd `ShouldBroadcast` only when:\n• A browser needs to react within seconds of the event occurring\n• The data payload is appropriate for public/private transmission\n\nOver-broadcasting creates unnecessary WebSocket traffic. Not every model update needs to reach the browser.",
        np: "No। Browser ले instant थाहा पाउनु पर्ने events मात्र ShouldBroadcast implement गर्ने।",
        jp: "いいえ。ブラウザがすぐ知る必要があるイベントだけに ShouldBroadcast を実装する。",
      },
    },
    {
      question: {
        en: "How do I broadcast from inside a queued job?",
        np: "Queued job बाट broadcast कसरी गर्ने?",
        jp: "キュージョブの中からブロードキャストするには？",
      },
      answer: {
        en: "If your event implements `ShouldBroadcast`, Laravel automatically dispatches it to the queue (the `default` queue by default). The queue worker processes it and sends the WebSocket message.\n\nTo use a specific queue for broadcasting: implement `ShouldBroadcastNow` won't queue it; instead override `broadcastQueue()` on your event:\n\n`public function broadcastQueue(): string { return 'broadcasts'; }`\n\nEnsure `QUEUE_CONNECTION` is not `sync` in production — otherwise broadcasts happen inline and defeat the purpose.",
        np: "ShouldBroadcast ले automatically queue मा dispatch गर्छ। broadcastQueue() override गरेर queue छान्न सकिन्छ।",
        jp: "ShouldBroadcast は自動でキューに投入。`broadcastQueue()` でキュー名を指定できる。",
      },
    },
    {
      question: {
        en: "How do I handle events missed while the client was disconnected?",
        np: "Client disconnect हुँदा miss भएका events कसरी handle गर्ने?",
        jp: "切断中に見逃したイベントはどう処理する？",
      },
      answer: {
        en: "Echo auto-reconnects after disconnection, but it cannot replay events that were sent while it was offline.\n\nThe standard pattern:\n1. On reconnect, make a normal REST API call to fetch the latest state (`GET /api/posts?after=lastSeenId`)\n2. Re-sync the UI from the API response\n3. Resume listening via Echo\n\nFor critical state (unread counts, order status), never rely solely on WebSocket events — always have a REST fallback that the client can call to reconcile state.",
        np: "Reconnect मा REST API call गरेर latest state fetch गर्ने। WebSocket मात्रमा depend नगर्ने।",
        jp: "再接続時は REST API で最新状態を取得して同期。WebSocket だけに頼らない設計が重要。",
      },
    },
  ],
};
