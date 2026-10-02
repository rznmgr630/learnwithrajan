import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_74_LESSONS: LessonDay = {
  day: 74,
  title: "Scaling WebSockets",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-74-lesson-1",
      title: "Multiple Instances",
      durationMinutes: 22,
      explanation: `
<b>Your WebSocket application works perfectly on a single server.</b> Users connect, join rooms, and exchange messages in real time. Then your app goes viral. A thousand users connect simultaneously. The single server starts to struggle — CPU spikes, memory grows, and connections start dropping. You add a second server. Now, half the users connect to server A and half to server B. A user on server A sends a message to a room. The users on server B never receive it. The room is split.

This is the fundamental problem of scaling WebSockets: <b>a WebSocket connection is pinned to the specific server process that accepted it.</b> Unlike HTTP, where any server can handle any request, a WebSocket connection lives on one server for its entire lifetime. When you add more servers, you fragment your user base across them, and events do not automatically cross server boundaries.

<b>Why this problem exists.</b> A WebSocket connection is a stateful, long-lived TCP connection. The server that accepted the connection holds all the state: which rooms the client has joined, the client's identity, and any pending messages. Other servers have no knowledge of this connection. If server A wants to send a message to a client connected to server B, it has no direct way to do so — the TCP socket exists only between the client and server B .

<b>Why you cannot just "scale vertically" forever.</b> Adding more CPU and memory to a single server has hard limits. A Node.js process is single-threaded (for JavaScript execution), so it cannot use more than one CPU core for application logic without clustering. And even with clustering, a single machine has a maximum number of file descriptors and memory. At some point — tens of thousands or hundreds of thousands of concurrent connections — you must distribute across multiple machines [citation:18].

<b>The multi-instance problem, concretely.</b> Imagine a chat application with two server instances:

- Server A: Alice connects and joins room "general".
- Server B: Bob connects and joins room "general".
- Alice sends a message to room "general".
- Server A receives the message. It broadcasts to its local room members — Alice only.
- Bob, on Server B, never sees the message.

The two users are in the same logical room, but because they are on different physical servers, they cannot see each other. This is called the <b>split-brain problem</b> of WebSocket scaling.

<b>What you need to solve it.</b> Three things must be true for a multi-instance WebSocket system to work correctly:

1. **Cross-server message routing:** When Server A broadcasts to a room, the message must reach Server B so it can deliver to its local room members.
2. **Shared state:** When Server A needs to know who is in a room (or which server a specific user is on), that information must be accessible to all servers.
3. **Sticky sessions (in some cases):** If the client uses HTTP long-polling as a fallback transport, subsequent HTTP requests from the same client must reach the same server that handled the initial handshake [citation:3].

<b>Why HTTP polling makes this harder.</b> Socket.IO supports two transports: WebSocket (a single persistent TCP connection) and HTTP long-polling (a series of separate HTTP requests). With long-polling, the client sends multiple HTTP requests during a single logical Socket.IO session. If these requests hit different servers, the session breaks with a "Session ID unknown" error. This is why <b>sticky sessions are required when polling is enabled</b>. If you disable polling and use WebSocket-only transport, sticky sessions are no longer required — but you lose the fallback for environments that block WebSockets [citation:3][citation:12].

<b>What can go wrong?</b>
- <b>Adding servers without a shared adapter.</b> Messages sent on one server do not reach clients on another. The system appears to work for users on the same server and fails silently for users on different servers.
- <b>Enabling multiple instances without sticky sessions and with polling enabled.</b> Clients receive HTTP 400 "Session ID unknown" errors during the handshake [citation:3].
- <b>Storing per-user state in local memory.</b> If Server A tracks online users in a local Map, Server B has no idea who is online. The state must be shared (Redis, a database).
- <b>Assuming WebSocket-only transport is always available.</b> Some corporate networks and proxies block WebSocket. Disabling polling removes the fallback, and those clients cannot connect at all.
- <b>Not testing with multiple instances.</b> The application works in development (single instance) and fails in production (multiple instances). Test with at least two instances from the start.

<b>How this appears in a real application.</b> A chat platform with 10,000 concurrent users runs three WebSocket server instances. A user on server 1 sends a message to a room. The message is published to a shared message bus (Redis). All three servers subscribe to the room's channel. Servers 1, 2, and 3 each receive the message and deliver it to their local clients in that room. The user on server 3 receives the message as if the sender were on the same server. This is the standard architecture for horizontally scaled WebSockets [citation:1][citation:6].

<b>How experienced engineers think.</b> A single WebSocket server is a single point of failure. Scaling horizontally is not optional for any serious real-time application. The moment you add a second server, you enter the world of distributed systems: message buses, shared state, and coordination. Plan for it from day one, even if you start with one server. The architecture you choose (Redis pub/sub, RabbitMQ, Kafka) will shape everything else.
      `,
      diagram: `
The Multi-Instance Problem

  Single instance (works):
    Client A ---+
    Client B ---+---> Server 1
    Client C ---+       |
                        v
                  All clients in one place
                  Room broadcast reaches everyone

  Multiple instances (broken without a bus):
    Client A ---+---> Server 1     Room "general": {A, B}
    Client B ---+

    Client C ---+---> Server 2     Room "general": {C}

    A sends a message to "general"
        |
        v
    Server 1 broadcasts to A only
        |
        v
    C (on Server 2) never receives it

  With a shared message bus (fixed):
    Client A ---+---> Server 1
    Client B ---+       |
                        | publish to bus
                        v
                  +-----------------+
                  |  Message Bus    |
                  |  (Redis, etc.)  |
                  +-----------------+
                        |
        +---------------+---------------+
        |                               |
        v                               v
    Server 1                        Server 2
    (receives, delivers to A, B)    (receives, delivers to C)

  Requirements for correct scaling:
    1. Cross-server message routing (message bus)
    2. Shared state (who is online, which server)
    3. Sticky sessions IF polling is enabled
      `,
      codeExample: { title: "Example", code: `
// ============================================
// MULTIPLE INSTANCES — THE PROBLEM
// ============================================

// This code works on a single server but breaks
// when you run multiple instances.

// ---------- BROKEN: local-only rooms ----------
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    // This only reaches clients connected to THIS server.
    // Clients on other server instances never receive it.
    this.server.to(data.roomId).emit('message', {
      userId: client.data.userId,
      text: data.text,
    });
  }
}

// ---------- Why it breaks ----------
// Server 1: Alice joins "general", sends a message.
// Server 2: Bob joins "general".
//
// Server 1's \`this.server.to("general").emit(...)\` broadcasts
// to its LOCAL room members (Alice only).
// Server 2's \`this.server\` has no idea a message was sent.
// Bob never receives it.

// ============================================
// THE FIX: REDIS ADAPTER
// ============================================

// Install:
// npm i --save @socket.io/redis-adapter redis

// main.ts
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { AppModule } from './app.module';

// Custom adapter that attaches the Redis adapter.
export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(3000);
}
bootstrap();

// Now, when Server 1 calls \`this.server.to("general").emit(...)\`:
// 1. Server 1 publishes the message to a Redis channel.
// 2. All server instances subscribed to that channel receive it.
// 3. Each server delivers the message to its local room members.
//
// Server 1 delivers to Alice.
// Server 2 delivers to Bob.
// Both see the message.

// ============================================
// WITH STICKY SESSIONS (if polling is enabled)
// ============================================

// If your client uses HTTP long-polling as a fallback,
// you MUST also enable sticky sessions on the load balancer.

// Nginx configuration:
// upstream nodes {
//     hash $remote_addr consistent;  // Sticky by IP
//     server app01:3000;
//     server app02:3000;
//     server app03:3000;
// }
//
// Note: The Redis adapter does NOT replace sticky sessions.
// Redis handles cross-server broadcasting.
// Sticky sessions handle routing a single client's HTTP requests
// to the same server. They solve different problems [citation:12].

// ============================================
// DISABLING POLLING (no sticky sessions needed)
// ============================================

// If you do not need the polling fallback, disable it:
// const socket = io('http://localhost:3000', {
//   transports: ['websocket'], // No polling fallback
// });
//
// With WebSocket-only transport, the connection is a single
// TCP connection. Sticky sessions are not required [citation:3].

// ============================================
// WHAT NOT TO DO
// ============================================

// BAD: Running multiple instances with local-only rooms.
// Messages never cross server boundaries.

// BAD: Using Redis adapter but forgetting sticky sessions
// when polling is enabled.
// Clients receive "Session ID unknown" errors.

// BAD: Storing online users in a local Map.
// Server B does not know who is online on Server A.
// Use Redis to share this state [citation:10].
      ` },
      keyTakeaways: [
        "A WebSocket connection is pinned to the server that accepted it — events do not automatically cross server boundaries.",
        "Multiple instances fragment users across servers. Without a shared message bus, rooms are split and messages are lost.",
        "A message bus (Redis, RabbitMQ) is required for cross-server message routing.",
        "Sticky sessions are required when HTTP long-polling is enabled. They are not required for WebSocket-only transport.",
        "The Redis adapter does not replace sticky sessions — they solve different problems.",
        "Shared state (online users, room membership) must live in Redis or a database, not in local memory.",
        "Plan for horizontal scaling from day one — even if you start with one server.",
      ],
      commonMistakes: [
        "<b>Adding servers without a shared adapter.</b> Messages sent on one server never reach clients on another. The system appears to work for same-server users and fails silently for cross-server users.",
        "<b>Enabling multiple instances without sticky sessions and with polling enabled.</b> Clients receive HTTP 400 'Session ID unknown' errors during the handshake [citation:3].",
        "<b>Storing per-user state in local memory.</b> Server B has no knowledge of users on Server A. Use Redis to share state [citation:10].",
        "<b>Assuming WebSocket-only transport is always available.</b> Some corporate networks block WebSocket. Disabling polling removes the fallback.",
        "<b>Not testing with multiple instances.</b> The application works in development and fails in production. Test with at least two instances.",
      ],
      quiz: [
        {
          question:
            "Why does a WebSocket room break when you add a second server instance without a shared adapter?",
          options: [
            "Because rooms are local to the server that created them; a client on one server cannot receive messages sent to a room on another server.",
            "Because WebSocket connections are limited to one server per user.",
            "Because rooms have a maximum size.",
            "Because the second server cannot accept WebSocket connections.",
          ],
          correctIndex: 0,
          explanation:
            "Rooms are managed per server instance. Server A's room contains only its local clients. Server B's room contains only its local clients. Without a shared bus, messages do not cross servers [citation:1].",
        },
        {
          question:
            "What does the Redis adapter do in a multi-instance Socket.IO setup?",
          options: [
            "It replaces the need for sticky sessions.",
            "It forwards messages between Socket.IO servers so broadcasts reach clients on all instances.",
            "It stores user sessions in Redis.",
            "It load-balances incoming connections.",
          ],
          correctIndex: 1,
          explanation:
            "The Redis adapter uses Redis pub/sub to forward messages between server instances. When one server broadcasts, all servers receive the message and deliver it to their local clients [citation:3][citation:10].",
        },
        {
          question:
            "When are sticky sessions required for Socket.IO?",
          options: [
            "Always, regardless of transport.",
            "When HTTP long-polling is enabled, because the client's polling requests must hit the same server that handled the handshake.",
            "Only when using WebSocket-only transport.",
            "Never — Redis adapter handles it.",
          ],
          correctIndex: 1,
          explanation:
            "HTTP long-polling sends multiple HTTP requests during a session. These must reach the same server. WebSocket-only transport uses a single TCP connection and does not require sticky sessions [citation:3][citation:12].",
        },
        {
          question:
            "What is the correct way to track online users across multiple instances?",
          options: [
            "Store them in a local Map on each server.",
            "Store them in a shared store (Redis) so all servers can see who is online.",
            "Use a cookie.",
            "Query the database on every request.",
          ],
          correctIndex: 1,
          explanation:
            "Local Maps are per-server. Server B cannot see users on Server A. A shared store like Redis is required to track presence across instances [citation:10].",
        },
      ],
    },
    {
      id: "day-74-lesson-2",
      title: "Redis Adapter",
      durationMinutes: 24,
      explanation: `
<b>The Redis adapter is the standard solution for scaling Socket.IO across multiple server instances.</b> It uses Redis pub/sub to forward events between servers. When one server broadcasts to a room, the message is published to Redis, all servers receive it, and each server delivers it to its local clients in that room [citation:3][citation:10].

<b>How the Redis adapter works internally.</b> The adapter creates two Redis connections: a publisher and a subscriber. When the server calls \`io.to('room').emit('event', data)\`, the adapter serializes the message and publishes it to a Redis channel. All server instances subscribe to that channel. When a message arrives, each server's adapter receives it and delivers it to the appropriate local sockets [citation:7].

This is a publish-subscribe pattern. The server that originates the message publishes once. All other servers receive it and fan out to their local clients. The originating server also receives its own message (unless it is configured to ignore it) and delivers to its own local clients.

<b>Setting up the Redis adapter in NestJS.</b> The pattern is to create a custom \`IoAdapter\` that attaches the Redis adapter:

\`\`\`typescript
export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
\`\`\`

Then in \`main.ts\`:

\`\`\`typescript
const app = await NestFactory.create(AppModule);
const redisIoAdapter = new RedisIoAdapter(app);
await redisIoAdapter.connectToRedis();
app.useWebSocketAdapter(redisIoAdapter);
await app.listen(3000);
\`\`\`

<b>Why two Redis clients?</b> Redis pub/sub requires a dedicated connection for subscriptions. Once a client enters subscribe mode, it cannot issue other commands. So the adapter uses one client for publishing (\`pubClient\`) and a duplicate for subscribing (\`subClient\`) [citation:3][citation:10].

<b>What about Redis Streams?</b> Redis pub/sub is fire-and-forget: if a server is not connected when a message is published, it misses the message. For higher reliability, there is a Redis Streams adapter that persists messages in a stream and supports reading missed messages on reconnect [citation:7]. The trade-off is complexity and overhead. For most real-time chat and notification use cases, pub/sub is sufficient.

<b>Performance considerations.</b> The Redis adapter adds a network round-trip for every broadcast. On a local network, this is typically under 1ms. Under heavy load, the Redis connection can become a bottleneck. To reduce load:
- Batch messages where possible.
- Use rooms effectively — only servers with clients in a room receive its messages (with some adapter configurations).
- Consider Redis Cluster for very high throughput [citation:6].

<b>Sticky sessions: still required for polling.</b> A common misconception is that the Redis adapter eliminates the need for sticky sessions. It does not. The Redis adapter handles cross-server message routing. Sticky sessions handle routing a single client's HTTP long-polling requests to the same server. These are different problems. If polling is enabled, you still need sticky sessions on the load balancer [citation:12].

<b>What can go wrong?</b>
- <b>Not awaiting Redis connections.</b> If \`connectToRedis()\` is not awaited before the server starts, broadcasts fail silently.
- <b>Using one Redis client for both publish and subscribe.</b> Redis clients in subscribe mode cannot publish. Use two clients [citation:3].
- <b>Forgetting to duplicate the client.</b> \`pubClient.duplicate()\` creates a new connection. Reusing the same client breaks.
- <b>Assuming Redis adapter replaces sticky sessions.</b> It does not, if polling is enabled [citation:12].
- <b>Not handling Redis connection failures.</b> If Redis goes down, the adapter cannot forward messages. Implement reconnection logic and monitoring.
- <b>Scaling Redis itself.</b> A single Redis instance can become a bottleneck. Use Redis Cluster or a managed service with replication.

<b>How this appears in a real application.</b> A NestJS chat application runs three instances behind an Nginx load balancer. The load balancer uses \`ip_hash\` for sticky sessions (because polling is enabled). All three instances connect to the same Redis. When a user on instance 1 sends a message to room "general", the message is published to Redis. All three instances receive it and deliver to their local room members. Users on all instances see the message in real time. Presence is tracked in Redis sets, so the online count is shared across instances [citation:1].

<b>How experienced engineers think.</b> The Redis adapter is the default choice for scaling Socket.IO. It is simple, well-supported, and works for the vast majority of applications. The main concerns are Redis availability and throughput. For extreme scale, consider Redis Cluster or a different pub/sub system. But for most applications, a single well-provisioned Redis instance handles hundreds of thousands of messages per second.
      `,
      diagram: `
Redis Adapter Architecture

  Server 1                Server 2                Server 3
    |                       |                       |
    |  pubClient            |  pubClient            |  pubClient
    |  subClient            |  subClient            |  subClient
    |                       |                       |
    +-----------+-----------+-----------+-----------+
                |                       |
                v                       v
          +-------------------+   +-------------------+
          |  Redis Pub/Sub    |   |  Redis Pub/Sub    |
          |  Channel: room:*  |   |  Channel: room:*  |
          +-------------------+   +-------------------+

  Flow:
    1. Server 1: io.to('room:42').emit('message', data)
    2. Adapter publishes to Redis channel 'room:42'
    3. Redis delivers to all subscribed servers
    4. Server 1, 2, 3 each receive the message
    5. Each server delivers to its LOCAL clients in room:42

  Key details:
    - Two Redis connections: pubClient + subClient
    - pubClient publishes; subClient subscribes
    - Sticky sessions still required if polling is enabled
    - Fire-and-forget: messages missed during Redis downtime are lost
      `,
      codeExample: { title: "Example", code: `
// ============================================
// REDIS ADAPTER FOR SCALING WEBSOCKETS
// ============================================

// Install:
// npm i --save @socket.io/redis-adapter redis

// ---------- 1. Custom IoAdapter with Redis ----------
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private pubClient: RedisClientType;
  private subClient: RedisClientType;

  async connectToRedis(): Promise<void> {
    this.pubClient = createClient({
      url: process.env.REDIS_URL ?? 'redis://localhost:6379',
      // Retry strategy for resilience.
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
      },
    });

    this.subClient = this.pubClient.duplicate();

    await Promise.all([
      this.pubClient.connect(),
      this.subClient.connect(),
    ]);

    this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }

  async close(): Promise<void> {
    await this.pubClient?.quit();
    await this.subClient?.quit();
  }
}

// ---------- 2. Wire it up in main.ts ----------
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  // Graceful shutdown.
  process.on('SIGTERM', async () => {
    await redisIoAdapter.close();
    await app.close();
    process.exit(0);
  });

  await app.listen(3000);
}
bootstrap();

// ---------- 3. Using the adapter (gateway code unchanged) ----------
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    // This emit now reaches ALL servers via Redis.
    // Each server delivers to its local room members.
    this.server.to(data.roomId).emit('message', {
      userId: client.data.userId,
      text: data.text,
      timestamp: new Date().toISOString(),
    });
  }
}

// ---------- 4. Shared presence tracking in Redis ----------
@Injectable()
export class PresenceService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async userConnected(userId: string, socketId: string, serverId: string) {
    // Track which server has this user.
    await this.redis.hset('user:servers', userId, serverId);
    // Track online users in a set.
    await this.redis.sadd('online:users', userId);
    // Track sockets per user.
    await this.redis.sadd(\`user:sockets:\${userId}\`, socketId);
  }

  async userDisconnected(userId: string, socketId: string) {
    await this.redis.srem(\`user:sockets:\${userId}\`, socketId);
    const remaining = await this.redis.scard(\`user:sockets:\${userId}\`);
    if (remaining === 0) {
      await this.redis.srem('online:users', userId);
      await this.redis.hdel('user:servers', userId);
    }
  }

  async getOnlineCount(): Promise<number> {
    return this.redis.scard('online:users');
  }

  async getServerForUser(userId: string): Promise<string | null> {
    return this.redis.hget('user:servers', userId);
  }
}

// ---------- 5. Nginx configuration (sticky sessions for polling) ----------
// upstream nodes {
//     hash $remote_addr consistent;  // Sticky by IP
//     server app01:3000;
//     server app02:3000;
//     server app03:3000;
// }
//
// server {
//     listen 80;
//     location / {
//         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//         proxy_set_header Host $host;
//         proxy_pass http://nodes;
//         proxy_http_version 1.1;
//         proxy_set_header Upgrade $http_upgrade;
//         proxy_set_header Connection "upgrade";
//     }
// }

// ---------- 6. Docker Compose (multi-instance local testing) ----------
// version: '3'
// services:
//   redis:
//     image: redis:7-alpine
//     ports: ['6379:6379']
//
//   app1:
//     build: .
//     environment:
//       - REDIS_URL=redis://redis:6379
//       - SERVER_ID=app1
//     ports: ['3001:3000']
//
//   app2:
//     build: .
//     environment:
//       - REDIS_URL=redis://redis:6379
//       - SERVER_ID=app2
//     ports: ['3002:3000']
//
//   nginx:
//     image: nginx:alpine
//     volumes:
//       - ./nginx.conf:/etc/nginx/nginx.conf
//     ports: ['8080:80']
//     depends_on: [app1, app2]

// ---------- 7. What NOT to do ----------
// BAD: Using the same Redis client for pub and sub.
// const client = createClient(...);
// await client.connect();
// const adapter = createAdapter(client, client); // Breaks!

// BAD: Not awaiting connectToRedis().
// redisIoAdapter.connectToRedis(); // Missing await!
// app.useWebSocketAdapter(redisIoAdapter); // Adapter not ready.

// BAD: Assuming Redis adapter replaces sticky sessions.
// If polling is enabled, you still need sticky sessions [citation:12].
      ` },
      keyTakeaways: [
        "The Redis adapter uses pub/sub to forward Socket.IO messages between server instances.",
        "It requires two Redis connections: one for publishing, one for subscribing.",
        "The adapter is attached via a custom `IoAdapter` in `main.ts`.",
        "Gateway code does not change — `io.to(room).emit()` works across all instances.",
        "Redis pub/sub is fire-and-forget: messages missed during Redis downtime are lost.",
        "Sticky sessions are still required if HTTP long-polling is enabled.",
        "Shared state (presence, room membership) must be stored in Redis, not local memory.",
      ],
      commonMistakes: [
        "<b>Not awaiting Redis connections.</b> If `connectToRedis()` is not awaited, broadcasts fail silently.",
        "<b>Using one Redis client for both publish and subscribe.</b> Redis clients in subscribe mode cannot publish. Use two clients.",
        "<b>Forgetting `pubClient.duplicate()`.</b> Reusing the same client breaks subscription.",
        "<b>Assuming Redis adapter replaces sticky sessions.</b> It does not, if polling is enabled [citation:12].",
        "<b>Not handling Redis connection failures.</b> If Redis goes down, the adapter cannot forward messages. Implement reconnection and monitoring.",
        "<b>Storing presence in local memory.</b> Server B cannot see users on Server A. Use Redis [citation:10].",
      ],
      quiz: [
        {
          question:
            "Why does the Redis adapter need two Redis connections?",
          options: [
            "One for reads, one for writes.",
            "One for publishing messages and one for subscribing to channels, because Redis clients in subscribe mode cannot publish.",
            "One for caching, one for pub/sub.",
            "It does not — one connection is sufficient.",
          ],
          correctIndex: 1,
          explanation:
            "Redis pub/sub requires a dedicated connection for subscriptions. Once a client subscribes, it cannot issue other commands. The adapter uses one client to publish and a duplicate to subscribe [citation:3][citation:10].",
        },
        {
          question:
            "What happens to messages published while a server is disconnected from Redis?",
          options: [
            "They are queued and delivered when the server reconnects.",
            "They are lost — Redis pub/sub is fire-and-forget.",
            "They are stored in the database.",
            "The publisher retries indefinitely.",
          ],
          correctIndex: 1,
          explanation:
            "Redis pub/sub does not persist messages. If a server is not subscribed when a message is published, it misses the message. For reliability, use Redis Streams or a message queue [citation:7].",
        },
        {
          question:
            "Does the Redis adapter eliminate the need for sticky sessions?",
          options: [
            "Yes, always.",
            "No — sticky sessions are still required if HTTP long-polling is enabled.",
            "Only for WebSocket-only transport.",
            "Only for private messages.",
          ],
          correctIndex: 1,
          explanation:
            "The Redis adapter handles cross-server message routing. Sticky sessions handle routing a single client's polling requests to the same server. They solve different problems. If polling is enabled, sticky sessions are still required [citation:12].",
        },
        {
          question:
            "Where should online user presence be stored in a multi-instance setup?",
          options: [
            "In a local Map on each server.",
            "In a shared store like Redis, so all servers can see the same presence data.",
            "In a cookie.",
            "In the JWT.",
          ],
          correctIndex: 1,
          explanation:
            "Local Maps are per-server. To track presence across instances, use a shared store like Redis. Each server updates the same set of online users [citation:10].",
        },
      ],
    },
    {
      id: "day-74-lesson-3",
      title: "Pub/Sub",
      durationMinutes: 22,
      explanation: `
<b>Publish/Subscribe (pub/sub) is the messaging pattern at the heart of WebSocket scaling.</b> It is the mechanism that allows multiple server instances to communicate with each other without knowing about each other directly. One server publishes a message to a channel. Any number of servers subscribe to that channel and receive the message. The publisher does not know or care who receives it [citation:1][citation:6].

<b>Why pub/sub exists.</b> In a distributed system, servers need to communicate, but direct server-to-server connections are fragile and hard to manage. With three servers, you have three connections. With ten servers, you have forty-five. With a hundred, it is unmanageable. Pub/sub solves this with a broker: servers connect only to the broker, not to each other. The broker handles fan-out.

<b>How it works in WebSocket scaling.</b> When server A broadcasts to a room, the Redis adapter publishes a message to a Redis channel dedicated to that room. All servers subscribe to the channel. Redis delivers the message to every subscriber. Each server then delivers the message to its local clients in that room [citation:3].

The channels are typically named after rooms or events:
- \`socket.io#/chat#room:42\` — a message for room 42 in the chat namespace.
- \`socket.io-request#\` — internal request/response messages between adapters.

You do not usually see these channel names in your application code — the adapter handles them. But understanding them helps when debugging.

<b>Redis pub/sub vs other pub/sub systems.</b> Redis is the default for Socket.IO, but it is not the only option:

| System | Strengths | Weaknesses |
|--------|-----------|------------|
| Redis Pub/Sub | Simple, fast, ubiquitous | Fire-and-forget, no persistence |
| Redis Streams | Persistent, replayable, consumer groups | More complex, higher overhead |
| RabbitMQ | Persistent, routing, acknowledgments | Heavier, more operational complexity |
| Kafka | Persistent, high throughput, replay | Very heavy, complex |
| NATS | Simple, fast, lightweight | Less ecosystem support |

For most Socket.IO applications, Redis pub/sub is the right choice. It is simple, fast, and handles the common case. If you need guaranteed delivery, use Redis Streams or RabbitMQ [citation:1][citation:7].

<b>What pub/sub does not solve.</b> Pub/sub moves messages between servers. It does not:
- **Track presence:** You need a separate shared store (Redis sets) for "who is online."
- **Persist messages:** Pub/sub is fire-and-forget. If a server is down, it misses messages.
- **Guarantee delivery:** There is no acknowledgment. The publisher does not know if any subscriber received the message.
- **Provide ordering:** Messages from different publishers may arrive in any order.

These are separate concerns that require separate solutions (Redis sets for presence, a database for persistence, a message queue for guaranteed delivery).

<b>Fan-out efficiency.</b> A naive implementation of pub/sub for WebSockets subscribes each client's connection to a Redis channel. This does not scale: 10,000 clients means 10,000 Redis subscriptions, consuming file descriptors and Redis resources. The correct approach is to subscribe once per server per room. When a server has at least one client in a room, it subscribes to that room's channel. When the last client leaves, it unsubscribes. Redis sees the number of rooms the server cares about, not the number of clients [citation:5].

The Socket.IO Redis adapter handles this automatically. When a server joins a room, the adapter subscribes to the corresponding Redis channel. When all local sockets leave the room, it unsubscribes. This is one of the reasons the adapter is preferred over a hand-rolled pub/sub implementation.

<b>Message format.</b> The Redis adapter serializes messages as JSON or a binary format. The message contains:
- The event name.
- The payload.
- The target rooms.
- The originating server id (to avoid echo loops).
- An optional acknowledgment id.

You do not need to know the exact format unless you are debugging or building a custom adapter.

<b>What can go wrong?</b>
- <b>Hand-rolling pub/sub without subscription management.</b> Subscribing per client instead of per room exhausts Redis connections [citation:5].
- <b>Assuming pub/sub guarantees delivery.</b> It does not. Messages missed during downtime are lost.
- <b>Using pub/sub for state.</b> Pub/sub is for events. Presence and room membership belong in Redis sets or a database.
- <b>Not handling Redis reconnection.</b> If the Redis connection drops, the adapter must resubscribe to all rooms. Socket.IO handles this, but a custom implementation must too.
- <b>Overloading a single Redis instance.</b> At very high throughput, Redis becomes the bottleneck. Use Redis Cluster or shard by room.

<b>How this appears in a real application.</b> A real-time collaboration platform uses Redis pub/sub for all WebSocket broadcasts. Each document is a room. When a user edits a document, the edit is published to the document's Redis channel. All servers with clients in that document receive the edit and apply it locally. Presence is tracked separately in Redis sets. The pub/sub layer handles thousands of edits per second across a cluster of Redis nodes [citation:6].

<b>How experienced engineers think.</b> Pub/sub is a broadcast primitive. It is fast, simple, and works for the common case. But it is not a reliable message queue. If you need guarantees, use a system designed for guarantees. If you need presence, use a store designed for presence. Use the right tool for the right job, and do not ask pub/sub to do more than it can.
      `,
      diagram: `
Pub/Sub for WebSocket Scaling

  Server 1                Server 2                Server 3
    |                       |                       |
    |  subscribe            |  subscribe            |  subscribe
    |  "room:42"            |  "room:42"            |  "room:99"
    |                       |                       |
    +-----------+-----------+-----------+-----------+
                |                       |
                v                       v
          +-----------------------------------+
          |  Redis Pub/Sub                    |
          |  Channel: room:42                 |
          |  Channel: room:99                 |
          +-----------------------------------+

  Flow (Server 1 sends to room 42):
    1. Server 1 publishes to "room:42"
    2. Redis delivers to all subscribers of "room:42"
    3. Server 1 receives (delivers to local room 42 clients)
    4. Server 2 receives (delivers to local room 42 clients)
    5. Server 3 does NOT receive (not subscribed to room 42)

  Subscription management:
    - Subscribe per ROOM, not per client.
    - Server subscribes when first local client joins a room.
    - Server unsubscribes when last local client leaves.
    - This keeps Redis connections at "number of active rooms",
      not "number of connected clients."

  What pub/sub does NOT do:
    - Track presence (use Redis sets)
    - Persist messages (use Redis Streams or a queue)
    - Guarantee delivery (use acknowledgments or a queue)
    - Provide ordering (use timestamps or sequence numbers)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// PUB/SUB FOR WEBSOCKET SCALING
// ============================================

// The Socket.IO Redis adapter handles pub/sub for you.
// This example shows the underlying mechanism and how
// to build a custom pub/sub layer if needed.

// ---------- 1. The adapter abstracts pub/sub ----------
// When you write:
this.server.to('room:42').emit('message', data);

// The adapter does approximately this:
// 1. Serialize the message.
// 2. Publish to Redis channel "socket.io#/chat#room:42#".
// 3. All subscribed servers receive it.
// 4. Each server delivers to local sockets in room:42.

// You do not write this code. The adapter does.

// ---------- 2. Building a custom pub/sub layer (conceptual) ----------
import { Redis } from 'ioredis';

@Injectable()
export class PubSubService {
  private pub: Redis;
  private sub: Redis;
  private readonly subscriptions = new Map<string, Set<string>>();

  constructor() {
    this.pub = new Redis(process.env.REDIS_URL);
    this.sub = new Redis(process.env.REDIS_URL);

    // Handle incoming messages.
    this.sub.on('message', (channel: string, message: string) => {
      this.handleMessage(channel, message);
    });
  }

  // Subscribe to a room (once per room, not per client).
  async subscribeToRoom(roomId: string): Promise<void> {
    const channel = \`room:\${roomId}\`;

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
      await this.sub.subscribe(channel);
      console.log(\`Subscribed to Redis channel: \${channel}\`);
    }
  }

  // Unsubscribe when no local clients remain in the room.
  async unsubscribeFromRoom(roomId: string): Promise<void> {
    const channel = \`room:\${roomId}\`;
    this.subscriptions.delete(channel);
    await this.sub.unsubscribe(channel);
    console.log(\`Unsubscribed from Redis channel: \${channel}\`);
  }

  // Publish a message to a room.
  async publishToRoom(roomId: string, event: string, data: any): Promise<void> {
    const channel = \`room:\${roomId}\`;
    const message = JSON.stringify({ event, data, serverId: process.env.SERVER_ID });
    await this.pub.publish(channel, message);
  }

  // Handle incoming message from Redis.
  private handleMessage(channel: string, message: string): void {
    const roomId = channel.replace('room:', '');
    const { event, data } = JSON.parse(message);

    // Deliver to local clients in this room.
    // In a real implementation, this would call the gateway's local emit.
    this.localDelivery(roomId, event, data);
  }

  private localDelivery(roomId: string, event: string, data: any): void {
    // Find local sockets in this room and emit.
    // This is what the Socket.IO adapter does internally.
  }
}

// ---------- 3. Room subscription management in the gateway ----------
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private readonly localRoomCounts = new Map<string, number>();

  constructor(private readonly pubSub: PubSubService) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);

    // Increment local room count.
    const count = (this.localRoomCounts.get(roomId) ?? 0) + 1;
    this.localRoomCounts.set(roomId, count);

    // Subscribe to the room's Redis channel if this is the first local client.
    if (count === 1) {
      await this.pubSub.subscribeToRoom(roomId);
    }

    return { joined: roomId };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);

    const count = (this.localRoomCounts.get(roomId) ?? 1) - 1;
    if (count <= 0) {
      this.localRoomCounts.delete(roomId);
      await this.pubSub.unsubscribeFromRoom(roomId);
    } else {
      this.localRoomCounts.set(roomId, count);
    }

    return { left: roomId };
  }
}

// ---------- 4. Presence tracking in Redis (separate from pub/sub) ----------
@Injectable()
export class PresenceService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async userConnected(userId: string, socketId: string) {
    await this.redis.sadd('online:users', userId);
    await this.redis.sadd(\`user:sockets:\${userId}\`, socketId);
  }

  async userDisconnected(userId: string, socketId: string) {
    await this.redis.srem(\`user:sockets:\${userId}\`, socketId);
    const remaining = await this.redis.scard(\`user:sockets:\${userId}\`);
    if (remaining === 0) {
      await this.redis.srem('online:users', userId);
    }
  }

  async getOnlineCount(): Promise<number> {
    return this.redis.scard('online:users');
  }
}

// ---------- 5. What NOT to do ----------
// BAD: Subscribing per client instead of per room.
// for (const client of clients) {
//   await this.sub.subscribe(\`client:\${client.id}\`); // 10,000 connections!
// }
//
// GOOD: Subscribe per room.
// await this.sub.subscribe(\`room:\${roomId}\`); // One per room.

// BAD: Using pub/sub to store presence.
// Pub/sub is for events. Use Redis sets for state.

// BAD: Assuming pub/sub guarantees delivery.
// If a server is down, it misses messages.
      ` },
      keyTakeaways: [
        "Pub/sub is the messaging pattern that allows multiple WebSocket servers to communicate without direct connections.",
        "Redis pub/sub is the default for Socket.IO scaling — simple, fast, and well-supported.",
        "Subscribe per ROOM, not per client. This keeps Redis connections manageable.",
        "Pub/sub moves events between servers. It does not track presence, persist messages, or guarantee delivery.",
        "For guaranteed delivery, use Redis Streams, RabbitMQ, or another persistent message queue.",
        "Presence and room membership belong in shared state (Redis sets), not in pub/sub channels.",
        "The Socket.IO Redis adapter handles subscription management automatically.",
      ],
      commonMistakes: [
        "<b>Hand-rolling pub/sub without subscription management.</b> Subscribing per client exhausts Redis connections. Subscribe per room [citation:5].",
        "<b>Assuming pub/sub guarantees delivery.</b> It does not. Messages missed during downtime are lost.",
        "<b>Using pub/sub for state.</b> Pub/sub is for events. Presence and room membership belong in Redis sets or a database.",
        "<b>Not handling Redis reconnection.</b> If the Redis connection drops, the adapter must resubscribe to all rooms.",
        "<b>Overloading a single Redis instance.</b> At very high throughput, Redis becomes the bottleneck. Use Redis Cluster or shard by room.",
        "<b>Confusing pub/sub with a message queue.</b> Pub/sub is fire-and-forget. A queue persists messages and guarantees delivery.",
      ],
      quiz: [
        {
          question:
            "What is the correct subscription strategy for pub/sub in a WebSocket cluster?",
          options: [
            "Subscribe once per client connection.",
            "Subscribe once per room, and unsubscribe when the last local client leaves the room.",
            "Subscribe to all channels on every server.",
            "Subscribe only when sending messages.",
          ],
          correctIndex: 1,
          explanation:
            "Subscribing per client does not scale — 10,000 clients means 10,000 Redis subscriptions. Subscribing per room keeps Redis connections at the number of active rooms [citation:5].",
        },
        {
          question:
            "What does Redis pub/sub NOT provide?",
          options: [
            "Message delivery between servers.",
            "Persistence and guaranteed delivery — messages missed during downtime are lost.",
            "Broadcasting to multiple subscribers.",
            "Low-latency message forwarding.",
          ],
          correctIndex: 1,
          explanation:
            "Redis pub/sub is fire-and-forget. It does not persist messages or guarantee delivery. For reliability, use Redis Streams or a message queue [citation:7].",
        },
        {
          question:
            "Where should presence (who is online) be stored in a pub/sub-based WebSocket cluster?",
          options: [
            "In the pub/sub channel.",
            "In a shared state store like Redis sets.",
            "In a local Map on each server.",
            "In the JWT.",
          ],
          correctIndex: 1,
          explanation:
            "Pub/sub is for events, not state. Presence must be stored in a shared store like Redis sets so all servers can read the same data [citation:10].",
        },
        {
          question:
            "What is the main advantage of Redis pub/sub over a direct server-to-server connection?",
          options: [
            "It is faster.",
            "It decouples servers — they connect only to Redis, not to each other, so adding servers does not multiply connections.",
            "It uses less memory.",
            "It provides guaranteed delivery.",
          ],
          correctIndex: 1,
          explanation:
            "With direct connections, N servers require N(N-1)/2 connections. With pub/sub, each server connects only to the broker. Adding a server adds one connection, not N [citation:1][citation:6].",
        },
      ],
    },
    {
      id: "day-74-lesson-4",
      title: "Sticky Sessions",
      durationMinutes: 22,
      explanation: `
<b>Sticky sessions (also called session affinity) are a load-balancing technique that routes all requests from a given client to the same backend server.</b> For WebSockets, they are sometimes required and sometimes not, depending on the transport the client uses [citation:3].

<b>Why sticky sessions exist.</b> Socket.IO supports two transports: WebSocket and HTTP long-polling. With WebSocket, the connection is a single TCP connection — once established, it stays on the same server. No sticky sessions are needed. But with HTTP long-polling, the client sends a series of separate HTTP requests during a single logical session. If these requests hit different servers, the session breaks. This is why sticky sessions are required when polling is enabled [citation:3][citation:12].

<b>The "Session ID unknown" error.</b> Without sticky sessions and with polling enabled, you will see HTTP 400 errors with "Session ID unknown" in the response. This happens because the second polling request hits a different server that has no record of the session created by the first request [citation:3].

<b>Two approaches to sticky sessions.</b>

<b>1. IP-based hashing (ip_hash or hash $remote_addr).</b> The load balancer hashes the client's IP address and routes to a server based on the hash. This is simple and works without cookies. The downside: clients behind a NAT (corporate network, mobile carrier) share an IP, so they all land on the same server. This can cause uneven load distribution [citation:3][citation:15].

<b>2. Cookie-based affinity.</b> The load balancer sets a cookie on the first request and uses that cookie to route subsequent requests. This is more accurate because it identifies the individual client, not the IP. It requires the load balancer to support cookie-based session affinity (Nginx Plus, HAProxy, Traefik) [citation:3].

<b>Nginx configuration.</b> For IP-based sticky sessions:

\`\`\`nginx
upstream nodes {
    hash $remote_addr consistent;  // Sticky by full IP
    server app01:3000;
    server app02:3000;
    server app03:3000;
}
\`\`\`

Or with \`ip_hash\` (uses the first three octets of IPv4):

\`\`\`nginx
upstream nodes {
    ip_hash;
    server app01:3000;
    server app02:3000;
    server app03:3000;
}
\`\`\`

The \`hash $remote_addr consistent\` approach is generally preferred because it uses the full IP address and "consistent" hashing, which minimizes reshuffling when servers are added or removed [citation:3].

<b>Do you need sticky sessions?</b> It depends on your transport:

| Transport | Sticky sessions required? |
|-----------|--------------------------|
| WebSocket only | No |
| Polling only | Yes |
| WebSocket + polling (default) | Yes |

If you disable polling and use WebSocket-only transport, you do not need sticky sessions. You can configure the client:

\`\`\`typescript
const socket = io('https://api.example.com', {
  transports: ['websocket'], // No polling fallback
});
\`\`\`

But there is a trade-off: if the client is behind a proxy that blocks WebSocket, the connection will fail entirely. With polling enabled, Socket.IO falls back to long-polling, which works in more environments [citation:3].

<b>The Redis adapter does not replace sticky sessions.</b> This is a common misconception. The Redis adapter handles cross-server message routing. Sticky sessions handle routing a single client's polling requests to the same server. They solve different problems. If polling is enabled, you need both [citation:12].

<b>CORS and cookies.</b> If you use cookie-based sticky sessions and your frontend and backend are on different domains (a CORS situation), you must enable credentials on both sides:

Server:
\`\`\`typescript
const io = new Server(httpServer, {
  cors: {
    origin: 'https://frontend.example.com',
    credentials: true,
  },
});
\`\`\`

Client:
\`\`\`typescript
const socket = io('https://api.example.com', {
  withCredentials: true,
});
\`\`\`

Without this, the browser will not send the cookie, and you will get "Session ID unknown" errors [citation:3][citation:8].

<b>What can go wrong?</b>
- <b>Forgetting sticky sessions when polling is enabled.</b> Clients receive HTTP 400 "Session ID unknown" errors [citation:3].
- <b>Using IP-based hashing behind a NAT.</b> Many clients share the same IP and land on the same server, causing hotspots [citation:18].
- <b>Not configuring \`proxy_read_timeout\` in Nginx.</b> The default is 60 seconds. Socket.IO's ping interval plus timeout is 45 seconds. If the proxy timeout is shorter than the Socket.IO heartbeat, Nginx closes the connection. Set \`proxy_read_timeout\` to a value larger than \`pingInterval + pingTimeout\` [citation:8].
- <b>Assuming Redis adapter replaces sticky sessions.</b> It does not, if polling is enabled [citation:12].
- <b>Not enabling credentials for CORS with cookie-based affinity.</b> The cookie is not sent, and the session breaks [citation:3][citation:8].
- <b>Testing with a single instance and missing the problem.</b> Sticky sessions only matter with multiple instances. Test with at least two.

<b>How this appears in a real application.</b> A NestJS application runs three instances behind Nginx. The client uses the default transports (WebSocket with polling fallback). Nginx is configured with \`hash $remote_addr consistent\`. The Redis adapter handles cross-server broadcasts. When a client connects, Nginx routes its polling requests to the same instance. If the client upgrades to WebSocket, the connection stays on that instance for its lifetime. When a broadcast happens, all instances receive it via Redis and deliver to their local clients [citation:1][citation:3].

<b>How experienced engineers think.</b> Sticky sessions are an operational concern, not an application concern. The application code does not change. But the deployment must be configured correctly. The decision to enable or disable polling determines whether sticky sessions are needed. If your users are behind corporate proxies that might block WebSocket, keep polling and use sticky sessions. If you control the client environment and know WebSocket works, disable polling for a simpler deployment.
      `,
      diagram: `
Sticky Sessions for WebSocket Scaling

  Without sticky sessions (polling enabled):
    Client (polling request 1) ---> Server 1 (creates session)
    Client (polling request 2) ---> Server 2 (no session!)
                                       |
                                       v
                                  HTTP 400
                                  "Session ID unknown"

  With sticky sessions:
    Client (polling request 1) ---> Server 1 (creates session)
    Client (polling request 2) ---> Server 1 (same server)
    Client (WebSocket upgrade) ---> Server 1 (same server)

  Load balancer configuration (Nginx):
    upstream nodes {
        hash $remote_addr consistent;  // Sticky by IP
        server app01:3000;
        server app02:3000;
        server app03:3000;
    }

  Do you need sticky sessions?
    Transport                  | Sticky required?
    ---------------------------|------------------
    WebSocket only             | No
    Polling only               | Yes
    WebSocket + polling (default) | Yes

  Key rule:
    Redis adapter handles cross-server messages.
    Sticky sessions handle routing one client's requests
    to the same server. They solve different problems.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// STICKY SESSIONS FOR WEBSOCKETS
// ============================================

// ---------- 1. Client configuration (WebSocket-only, no sticky) ----------
// If you disable polling, sticky sessions are not required.
const socket = io('https://api.example.com', {
  transports: ['websocket'], // No polling fallback
});

// Trade-off: if WebSocket is blocked (corporate proxy),
// the connection fails entirely. Polling provides a fallback.

// ---------- 2. Client configuration (with polling, sticky required) ----------
// Default transports include polling and WebSocket.
// The client starts with polling, then upgrades to WebSocket.
const socketWithPolling = io('https://api.example.com', {
  // Default transports: ['polling', 'websocket']
  // Sticky sessions are required.
});

// ---------- 3. Nginx configuration (IP-based sticky) ----------
// upstream nodes {
//     hash $remote_addr consistent;
//     server app01:3000;
//     server app02:3000;
//     server app03:3000;
// }
//
// server {
//     listen 80;
//     location / {
//         proxy_pass http://nodes;
//         proxy_http_version 1.1;
//         proxy_set_header Upgrade $http_upgrade;
//         proxy_set_header Connection "upgrade";
//         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//         proxy_set_header Host $host;
//
//         // Must be greater than pingInterval + pingTimeout.
//         proxy_read_timeout 90s;
//     }
// }

// ---------- 4. Nginx configuration (cookie-based sticky) ----------
// Requires Nginx Plus or a module that supports sticky cookies.
// upstream nodes {
//     sticky cookie srv_id expires=1h domain=.example.com path=/;
//     server app01:3000;
//     server app02:3000;
//     server app03:3000;
// }

// ---------- 5. CORS with credentials (cookie-based sticky) ----------
// Server:
const io = new Server(httpServer, {
  cors: {
    origin: 'https://frontend.example.com',
    credentials: true,
  },
});

// Client:
const socketWithCredentials = io('https://api.example.com', {
  withCredentials: true,
});

// Without both, the cookie is not sent, and you get
// "Session ID unknown" errors [citation:3][citation:8].

// ---------- 6. Kubernetes Ingress (IP-based sticky) ----------
// apiVersion: networking.k8s.io/v1
// kind: Ingress
// metadata:
//   annotations:
//     nginx.ingress.kubernetes.io/affinity: "cookie"
//     nginx.ingress.kubernetes.io/session-cookie-name: "route"
//     nginx.ingress.kubernetes.io/session-cookie-expires: "172800"
//     nginx.ingress.kubernetes.io/session-cookie-max-age: "172800"
// spec:
//   rules:
//     - host: io.yourhost.com
//       http:
//         paths:
//           - path: /
//             pathType: Prefix
//             backend:
//               service:
//                 name: websocket-service
//                 port:
//                   number: 3000

// ---------- 7. Testing sticky sessions locally with Docker Compose ----------
// version: '3'
// services:
//   nginx:
//     image: nginx:alpine
//     volumes:
//       - ./nginx.conf:/etc/nginx/nginx.conf
//     ports:
//       - "8080:80"
//     depends_on:
//       - app1
//       - app2
//
//   app1:
//     build: .
//     environment:
//       - SERVER_ID=app1
//     expose:
//       - "3000"
//
//   app2:
//     build: .
//     environment:
//       - SERVER_ID=app2
//     expose:
//       - "3000"

// ---------- 8. What NOT to do ----------
// BAD: Enabling polling without sticky sessions.
// Clients receive "Session ID unknown" errors.

// BAD: Using IP-based hashing behind a NAT.
// Many clients share an IP and land on the same server.

// BAD: Setting proxy_read_timeout shorter than Socket.IO heartbeat.
// Nginx closes the connection. Set it to 90s or more.

// BAD: Assuming Redis adapter replaces sticky sessions.
// It does not, if polling is enabled [citation:12].
      ` },
      keyTakeaways: [
        "Sticky sessions route all of a client's requests to the same backend server.",
        "They are required when HTTP long-polling is enabled, but not for WebSocket-only transport.",
        "Without sticky sessions and with polling enabled, clients receive HTTP 400 'Session ID unknown' errors.",
        "IP-based hashing is simple but can cause hotspots behind NAT.",
        "Cookie-based affinity is more accurate but requires load balancer support and CORS credentials.",
        "The Redis adapter does not replace sticky sessions — they solve different problems.",
        "Set Nginx `proxy_read_timeout` greater than Socket.IO's `pingInterval + pingTimeout` (90s is safe).",
      ],
      commonMistakes: [
        "<b>Forgetting sticky sessions when polling is enabled.</b> Clients receive HTTP 400 'Session ID unknown' errors [citation:3].",
        "<b>Using IP-based hashing behind a NAT.</b> Many clients share the same IP and land on the same server, causing hotspots [citation:18].",
        "<b>Not configuring `proxy_read_timeout` in Nginx.</b> If it is shorter than the Socket.IO heartbeat, Nginx closes the connection [citation:8].",
        "<b>Assuming Redis adapter replaces sticky sessions.</b> It does not, if polling is enabled [citation:12].",
        "<b>Not enabling credentials for CORS with cookie-based affinity.</b> The cookie is not sent, and the session breaks [citation:3][citation:8].",
        "<b>Testing with a single instance and missing the problem.</b> Sticky sessions only matter with multiple instances.",
      ],
      quiz: [
        {
          question:
            "When are sticky sessions required for Socket.IO?",
          options: [
            "Always, regardless of transport.",
            "When HTTP long-polling is enabled, because polling sends multiple HTTP requests that must reach the same server.",
            "Only when using WebSocket-only transport.",
            "Never — Redis adapter handles it.",
          ],
          correctIndex: 1,
          explanation:
            "HTTP long-polling sends multiple HTTP requests during a session. These must reach the same server. WebSocket-only transport uses a single TCP connection and does not require sticky sessions [citation:3][citation:12].",
        },
        {
          question:
            "What error do clients see without sticky sessions and with polling enabled?",
          options: [
            "500 Internal Server Error",
            "HTTP 400 'Session ID unknown'",
            "404 Not Found",
            "Connection refused",
          ],
          correctIndex: 1,
          explanation:
            "Without sticky sessions, the second polling request hits a different server that has no record of the session, resulting in HTTP 400 'Session ID unknown' [citation:3].",
        },
        {
          question:
            "Does the Redis adapter eliminate the need for sticky sessions?",
          options: [
            "Yes, always.",
            "No — sticky sessions are still required if HTTP long-polling is enabled.",
            "Only for WebSocket-only transport.",
            "Only for private messages.",
          ],
          correctIndex: 1,
          explanation:
            "The Redis adapter handles cross-server message routing. Sticky sessions handle routing a single client's polling requests to the same server. They solve different problems [citation:12].",
        },
        {
          question:
            "What is a disadvantage of IP-based sticky sessions?",
          options: [
            "They are slower than cookie-based.",
            "Clients behind a NAT share an IP and land on the same server, causing uneven load distribution.",
            "They do not work with WebSocket.",
            "They require commercial load balancer licenses.",
          ],
          correctIndex: 1,
          explanation:
            "IP-based hashing groups all clients behind a single NAT IP onto the same server. This can create hotspots. Cookie-based affinity identifies individual clients more accurately [citation:18].",
        },
      ],
    },
    {
      id: "day-74-lesson-5",
      title: "Connection State",
      durationMinutes: 20,
      explanation: `
<b>When you scale WebSockets across multiple instances, connection state becomes a distributed systems problem.</b> In a single-instance application, you can track everything in local memory: which users are online, which rooms they are in, their socket ids. In a multi-instance deployment, that state is fragmented across servers. Server A knows about its local users; Server B knows about its own. Neither knows the full picture [citation:10].

<b>What is connection state?</b> Connection state is any data associated with a WebSocket connection that persists for the life of the connection. It includes:
- The user's identity (\`userId\`, \`role\`, \`tenantId\`).
- The rooms the connection has joined.
- The connection's socket id and the server it is connected to.
- Presence information (online/offline).
- Any per-connection data (subscriptions, preferences, temporary state).

<b>Why local state breaks at scale.</b> In a single-instance deployment, a local \`Map<userId, socketId>\` is sufficient. But in a multi-instance deployment, if Server A tracks a user in a local map, Server B has no knowledge of that user. When Server B needs to send a message to that user, it cannot find them [citation:10].

The naive fix is to broadcast to all servers and hope one of them has the user. But this wastes resources and does not work for targeted messages. The correct fix is to store connection state in a shared store.

<b>Storing connection state in Redis.</b> Redis is the standard store for WebSocket connection state. Common data structures:

| Data | Redis Structure | Example |
|------|----------------|---------|
| Online users | Set | \`SADD online:users userId\` |
| User's sockets | Set | \`SADD user:sockets:{userId} socketId\` |
| User's server | Hash | \`HSET user:servers userId serverId\` |
| User's rooms | Set | \`SADD user:rooms:{userId} roomId\` |
| Room members | Set | \`SADD room:members:{roomId} userId\` |

Each server updates these sets on connection, disconnection, and room join/leave. Because they are shared, all servers see the same state [citation:10].

<b>Presence tracking.</b> Presence is the most common use case for shared connection state. "Who is online?" is a question that every server must answer identically. With Redis sets:

\`\`\`typescript
// On connection:
await redis.sadd('online:users', userId);
await redis.hset('user:servers', userId, serverId);

// On disconnect:
const remaining = await redis.scard(\`user:sockets:\${userId}\`);
if (remaining === 0) {
  await redis.srem('online:users', userId);
  await redis.hdel('user:servers', userId);
}
\`\`\`

The \`user:sockets\` set tracks all sockets for a user (multiple tabs, devices). The user is offline only when the set is empty [citation:10].

<b>Finding a user across servers.</b> When Server A needs to send a targeted message to a user connected to Server B, it can:
1. Look up the user's server in Redis: \`HGET user:servers userId\`.
2. If the user is on another server, publish a message to a Redis channel that the other server subscribes to.
3. The other server receives the message and delivers it to its local socket.

The Socket.IO Redis adapter handles this transparently with rooms. When a user connects, they join a room named \`user:{userId}\`. Server A emits to \`user:{userId}\`, and the adapter routes the message to whichever server has a socket in that room [citation:3].

<b>Connection state and reconnection.</b> When a client reconnects, it gets a new socket id and possibly a different server. The old socket id is removed from Redis on disconnect. The new socket id is added on connect. If the client was in rooms, it must rejoin them (the client sends \`joinRoom\` events again, or the server re-joins the user automatically based on the user's persistent room membership) [citation:13].

<b>Cleanup and stale state.</b> If a server crashes, its connections are lost, but the Redis state may not be cleaned up. Other servers still think those users are online. To prevent stale state:
- Use Redis TTLs on connection state.
- Have a periodic cleanup job that removes sockets that have not sent a heartbeat recently.
- When a server starts, clear any state associated with its server id.

<b>What can go wrong?</b>
- <b>Storing connection state in local memory.</b> Other servers cannot see it. Use Redis [citation:10].
- <b>Not cleaning up on disconnect.</b> Stale state accumulates. Users appear online forever.
- <b>Forgetting the server id.</b> Without it, you cannot clean up state for a crashed server.
- <b>Using a single key for all users.</b> Redis operations on large sets are slow. Shard by user or room.
- <b>Not handling reconnection.</b> When a client reconnects, its old state must be cleaned up and new state created.
- <b>Assuming Redis is always available.</b> If Redis goes down, connection state is lost. Implement fallbacks or accept degraded behavior.

<b>How this appears in a real application.</b> A multi-tenant chat platform stores all connection state in Redis:
- \`online:users\` — a set of all online user ids.
- \`user:sockets:{userId}\` — a set of socket ids for each user.
- \`user:servers\` — a hash mapping userId to the server id.
- \`room:members:{roomId}\` — a set of user ids in each room.

When a user connects, the server adds them to these structures. When they disconnect, it removes them. When a message is sent to a user, the server emits to \`user:{userId}\`, and Redis routes it to the correct server. Presence is always accurate because it is read from Redis, not from local memory [citation:10].

<b>How experienced engineers think.</b> Connection state is distributed state. Treat it with the same care as database state: consistency, cleanup, and failure handling. Local memory is fast but wrong in a distributed system. Redis is the standard store because it is fast, supports TTLs, and provides the data structures (sets, hashes) that map naturally to connection tracking. Design your state model carefully — it is the foundation of your scaling architecture.
      `,
      diagram: `
Connection State in Redis

  Server 1                Server 2                Server 3
    |                       |                       |
    |  update               |  update               |  update
    |  on connect/disconnect|                       |
    +-----------+-----------+-----------+-----------+
                |                       |
                v                       v
          +-----------------------------------+
          |  Redis (shared connection state)  |
          |                                   |
          |  online:users       -> {u1, u2}   |
          |  user:sockets:u1    -> {sock1}    |
          |  user:sockets:u2    -> {sock2}    |
          |  user:servers       -> {u1: srv1, u2: srv2} |
          |  room:members:42    -> {u1, u2}   |
          +-----------------------------------+

  Operations:
    Connect:
      SADD online:users u1
      SADD user:sockets:u1 sock1
      HSET user:servers u1 srv1

    Disconnect:
      SREM user:sockets:u1 sock1
      if SCARD(user:sockets:u1) == 0:
        SREM online:users u1
        HDEL user:servers u1

    Join room:
      SADD room:members:42 u1

    Send to user (from any server):
      io.to("user:u1").emit(...)  -> Redis routes to srv1

  Why Redis:
    - Shared across all servers
    - Fast (sub-millisecond)
    - TTL support for stale state cleanup
    - Data structures (sets, hashes) map to connection tracking
      `,
      codeExample: { title: "Example", code: `
// ============================================
// CONNECTION STATE IN REDIS
// ============================================

// Install:
// npm i --save ioredis

// ---------- 1. Connection state service ----------
@Injectable()
export class ConnectionStateService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  private get serverId(): string {
    return process.env.SERVER_ID ?? 'unknown';
  }

  // ---------- Connect ----------
  async onConnect(userId: string, socketId: string): Promise<void> {
    await this.redis
      .multi()
      .sadd('online:users', userId)
      .sadd(\`user:sockets:\${userId}\`, socketId)
      .hset('user:servers', userId, this.serverId)
      .exec();
  }

  // ---------- Disconnect ----------
  async onDisconnect(userId: string, socketId: string): Promise<void> {
    await this.redis.srem(\`user:sockets:\${userId}\`, socketId);

    const remaining = await this.redis.scard(\`user:sockets:\${userId}\`);
    if (remaining === 0) {
      await this.redis
        .multi()
        .srem('online:users', userId)
        .hdel('user:servers', userId)
        .del(\`user:sockets:\${userId}\`)
        .exec();
    }
  }

  // ---------- Join room ----------
  async onJoinRoom(userId: string, roomId: string): Promise<void> {
    await this.redis.sadd(\`room:members:\${roomId}\`, userId);
  }

  // ---------- Leave room ----------
  async onLeaveRoom(userId: string, roomId: string): Promise<void> {
    await this.redis.srem(\`room:members:\${roomId}\`, userId);
  }

  // ---------- Queries ----------
  async isUserOnline(userId: string): Promise<boolean> {
    return (await this.redis.sismember('online:users', userId)) === 1;
  }

  async getOnlineCount(): Promise<number> {
    return this.redis.scard('online:users');
  }

  async getServerForUser(userId: string): Promise<string | null> {
    return this.redis.hget('user:servers', userId);
  }

  async getSocketsForUser(userId: string): Promise<string[]> {
    return this.redis.smembers(\`user:sockets:\${userId}\`);
  }

  async getRoomMembers(roomId: string): Promise<string[]> {
    return this.redis.smembers(\`room:members:\${roomId}\`);
  }

  // ---------- Cleanup on server startup ----------
  async cleanupStaleServerState(): Promise<void> {
    // When a server restarts, its old state may still be in Redis.
    // Find all users assigned to this server and clean them up.
    const users = await this.redis.hgetall('user:servers');
    const stale = Object.entries(users)
      .filter(([, server]) => server === this.serverId)
      .map(([userId]) => userId);

    for (const userId of stale) {
      await this.redis
        .multi()
        .srem('online:users', userId)
        .hdel('user:servers', userId)
        .del(\`user:sockets:\${userId}\`)
        .exec();
    }

    console.log(\`Cleaned up \${stale.length} stale users for \${this.serverId}\`);
  }
}

// ---------- 2. Gateway integration ----------
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly state: ConnectionStateService) {}

  async handleConnection(client: Socket) {
    const userId = client.data.userId;
    await this.state.onConnect(userId, client.id);
    client.join(\`user:\${userId}\`);

    // Broadcast updated online count.
    const count = await this.state.getOnlineCount();
    this.server.emit('onlineCount', count);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    await this.state.onDisconnect(userId, client.id);

    const count = await this.state.getOnlineCount();
    this.server.emit('onlineCount', count);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    await this.state.onJoinRoom(client.data.userId, roomId);
    return { joined: roomId };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
    await this.state.onLeaveRoom(client.data.userId, roomId);
    return { left: roomId };
  }

  @SubscribeMessage('sendToUser')
  async handleSendToUser(
    @MessageBody() data: { targetUserId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Emit to the user's personal room. Redis routes to the correct server.
    this.server.to(\`user:\${data.targetUserId}\`).emit('privateMessage', {
      from: client.data.userId,
      text: data.text,
    });
    return { sent: true };
  }
}

// ---------- 3. Startup cleanup ----------
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Clean up stale state from previous runs of this server.
  const state = app.get(ConnectionStateService);
  await state.cleanupStaleServerState();

  await app.listen(3000);
}
bootstrap();

// ---------- 4. Redis client setup ----------
import { Redis } from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST ?? 'localhost',
          port: Number(process.env.REDIS_PORT ?? 6379),
          retryStrategy: (times) => Math.min(times * 50, 2000),
        });
      },
    },
    ConnectionStateService,
  ],
  exports: ['REDIS', ConnectionStateService],
})
export class RedisModule {}

// ---------- 5. What NOT to do ----------
// BAD: Storing connection state in local memory.
// private onlineUsers = new Map<string, string>();
// Server B cannot see users on Server A.

// BAD: Not cleaning up on disconnect.
// Users appear online forever. Memory grows.

// BAD: Not cleaning up stale state on server restart.
// Old socket ids remain in Redis and cause routing errors.

// BAD: Using a single key for all users.
// A Redis set with 100,000 members is slow to operate on.
// Shard by user or room.
      ` },
      keyTakeaways: [
        "Connection state (presence, rooms, sockets) must be stored in a shared store in a multi-instance deployment.",
        "Redis is the standard store, using sets, hashes, and TTLs to track connection state.",
        "Use `user:sockets:{userId}` sets to track multiple connections per user.",
        "A user is offline only when all their sockets have been removed from the set.",
        "Emit to `user:{userId}` rooms to route messages to whichever server has the user.",
        "Clean up stale state on server startup — crashed servers leave orphaned state in Redis.",
        "Local memory is fast but wrong in a distributed system. Redis is the correct store for shared state.",
      ],
      commonMistakes: [
        "<b>Storing connection state in local memory.</b> Other servers cannot see it. Use Redis [citation:10].",
        "<b>Not cleaning up on disconnect.</b> Stale state accumulates. Users appear online forever.",
        "<b>Forgetting the server id.</b> Without it, you cannot clean up state for a crashed server.",
        "<b>Using a single key for all users.</b> Redis operations on large sets are slow. Shard by user or room.",
        "<b>Not handling reconnection.</b> When a client reconnects, its old state must be cleaned up and new state created.",
        "<b>Assuming Redis is always available.</b> If Redis goes down, connection state is lost. Implement fallbacks or accept degraded behavior.",
      ],
      quiz: [
        {
          question:
            "Why is local memory insufficient for connection state in a multi-instance deployment?",
          options: [
            "Because local memory is too slow.",
            "Because each server only knows about its own connections; other servers cannot see the state.",
            "Because local memory is not persistent.",
            "Because local memory cannot store sets.",
          ],
          correctIndex: 1,
          explanation:
            "Server A's local map contains only Server A's connections. Server B has no visibility into them. Shared state must be stored in a common store like Redis [citation:10].",
        },
        {
          question:
            "What Redis data structure is best for tracking all sockets for a user?",
          options: [
            "A string.",
            "A set — \`SADD user:sockets:{userId} socketId\`.",
            "A list.",
            "A hash.",
          ],
          correctIndex: 1,
          explanation:
            "A Redis set is ideal for tracking multiple socket ids per user. Sets support efficient add, remove, and membership checks.",
        },
        {
          question:
            "When is a user considered offline?",
          options: [
            "When any one of their sockets disconnects.",
            "When all of their socket ids have been removed from the set.",
            "When the server restarts.",
            "When their token expires.",
          ],
          correctIndex: 1,
          explanation:
            "A user is offline only when they have no active connections. If they have two tabs open and one closes, they are still online.",
        },
        {
          question:
            "Why is it important to clean up stale state on server startup?",
          options: [
            "To free up disk space.",
            "Because a crashed server leaves orphaned socket ids in Redis that cause routing errors.",
            "Because Redis has a maximum key count.",
            "To reset the online count.",
          ],
          correctIndex: 1,
          explanation:
            "When a server crashes, its connections are lost, but Redis still has their state. On restart, the server must clean up its old state to prevent routing errors and stale presence.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why does a WebSocket room break when you add a second server instance without a shared adapter?",
      options: [
        "Because rooms are local to the server that created them; a client on one server cannot receive messages sent to a room on another server.",
        "Because WebSocket connections are limited to one server per user.",
        "Because rooms have a maximum size.",
        "Because the second server cannot accept WebSocket connections.",
      ],
      correctIndex: 0,
      explanation: "Rooms are managed per server instance. Server A's room contains only its local clients. Without a shared bus, messages do not cross servers [citation:1].",
    },
    {
      question: "What does the Redis adapter do in a multi-instance Socket.IO setup?",
      options: [
        "It replaces the need for sticky sessions.",
        "It forwards messages between Socket.IO servers so broadcasts reach clients on all instances.",
        "It stores user sessions in Redis.",
        "It load-balances incoming connections.",
      ],
      correctIndex: 1,
      explanation: "The Redis adapter uses Redis pub/sub to forward messages between server instances. When one server broadcasts, all servers receive the message [citation:3][citation:10].",
    },
    {
      question: "When are sticky sessions required for Socket.IO?",
      options: [
        "Always, regardless of transport.",
        "When HTTP long-polling is enabled, because the client's polling requests must hit the same server.",
        "Only when using WebSocket-only transport.",
        "Never — Redis adapter handles it.",
      ],
      correctIndex: 1,
      explanation: "HTTP long-polling sends multiple HTTP requests during a session. These must reach the same server. WebSocket-only transport does not require sticky sessions [citation:3][citation:12].",
    },
    {
      question: "Why does the Redis adapter need two Redis connections?",
      options: [
        "One for reads, one for writes.",
        "One for publishing messages and one for subscribing to channels, because Redis clients in subscribe mode cannot publish.",
        "One for caching, one for pub/sub.",
        "It does not — one connection is sufficient.",
      ],
      correctIndex: 1,
      explanation: "Redis pub/sub requires a dedicated connection for subscriptions. The adapter uses one client to publish and a duplicate to subscribe [citation:3][citation:10].",
    },
    {
      question: "What is the correct subscription strategy for pub/sub in a WebSocket cluster?",
      options: [
        "Subscribe once per client connection.",
        "Subscribe once per room, and unsubscribe when the last local client leaves the room.",
        "Subscribe to all channels on every server.",
        "Subscribe only when sending messages.",
      ],
      correctIndex: 1,
      explanation: "Subscribing per client does not scale. Subscribing per room keeps Redis connections at the number of active rooms [citation:5].",
    },
    {
      question: "What does Redis pub/sub NOT provide?",
      options: [
        "Message delivery between servers.",
        "Persistence and guaranteed delivery — messages missed during downtime are lost.",
        "Broadcasting to multiple subscribers.",
        "Low-latency message forwarding.",
      ],
      correctIndex: 1,
      explanation: "Redis pub/sub is fire-and-forget. It does not persist messages or guarantee delivery [citation:7].",
    },
    {
      question: "What error do clients see without sticky sessions and with polling enabled?",
      options: [
        "500 Internal Server Error",
        "HTTP 400 'Session ID unknown'",
        "404 Not Found",
        "Connection refused",
      ],
      correctIndex: 1,
      explanation: "Without sticky sessions, the second polling request hits a different server that has no record of the session, resulting in HTTP 400 'Session ID unknown' [citation:3].",
    },
    {
      question: "Does the Redis adapter eliminate the need for sticky sessions?",
      options: [
        "Yes, always.",
        "No — sticky sessions are still required if HTTP long-polling is enabled.",
        "Only for WebSocket-only transport.",
        "Only for private messages.",
      ],
      correctIndex: 1,
      explanation: "The Redis adapter handles cross-server message routing. Sticky sessions handle routing a single client's polling requests to the same server [citation:12].",
    },
    {
      question: "What is a disadvantage of IP-based sticky sessions?",
      options: [
        "They are slower than cookie-based.",
        "Clients behind a NAT share an IP and land on the same server, causing uneven load distribution.",
        "They do not work with WebSocket.",
        "They require commercial load balancer licenses.",
      ],
      correctIndex: 1,
      explanation: "IP-based hashing groups all clients behind a single NAT IP onto the same server. Cookie-based affinity identifies individual clients more accurately [citation:18].",
    },
    {
      question: "Why is local memory insufficient for connection state in a multi-instance deployment?",
      options: [
        "Because local memory is too slow.",
        "Because each server only knows about its own connections; other servers cannot see the state.",
        "Because local memory is not persistent.",
        "Because local memory cannot store sets.",
      ],
      correctIndex: 1,
      explanation: "Server A's local map contains only Server A's connections. Server B has no visibility into them. Shared state must be stored in a common store like Redis [citation:10].",
    },
    {
      question: "What Redis data structure is best for tracking all sockets for a user?",
      options: [
        "A string.",
        "A set — \`SADD user:sockets:{userId} socketId\`.",
        "A list.",
        "A hash.",
      ],
      correctIndex: 1,
      explanation: "A Redis set is ideal for tracking multiple socket ids per user. Sets support efficient add, remove, and membership checks.",
    },
    {
      question: "When is a user considered offline?",
      options: [
        "When any one of their sockets disconnects.",
        "When all of their socket ids have been removed from the set.",
        "When the server restarts.",
        "When their token expires.",
      ],
      correctIndex: 1,
      explanation: "A user is offline only when they have no active connections. If they have two tabs open and one closes, they are still online.",
    },
    {
      question: "Why is it important to clean up stale state on server startup?",
      options: [
        "To free up disk space.",
        "Because a crashed server leaves orphaned socket ids in Redis that cause routing errors.",
        "Because Redis has a maximum key count.",
        "To reset the online count.",
      ],
      correctIndex: 1,
      explanation: "When a server crashes, its connections are lost, but Redis still has their state. On restart, the server must clean up its old state to prevent routing errors and stale presence.",
    },
    {
      question: "What is the main advantage of Redis pub/sub over a direct server-to-server connection?",
      options: [
        "It is faster.",
        "It decouples servers — they connect only to Redis, not to each other, so adding servers does not multiply connections.",
        "It uses less memory.",
        "It provides guaranteed delivery.",
      ],
      correctIndex: 1,
      explanation: "With direct connections, N servers require N(N-1)/2 connections. With pub/sub, each server connects only to the broker [citation:1][citation:6].",
    },
    {
      question: "How should a server find which server a user is connected to?",
      options: [
        "Query the database.",
        "Store a mapping in Redis (e.g. \`HSET user:servers userId serverId\`) and read it from any server.",
        "Broadcast to all servers and wait for a response.",
        "Use the user's IP address.",
      ],
      correctIndex: 1,
      explanation: "A Redis hash mapping userId to serverId is the standard way to find a user's server. All servers can read the same mapping [citation:10].",
    },
  ],
  project: {
    name: "Scale a NestJS Chat Application Across Multiple Instances with Redis, Pub/Sub, and Sticky Sessions",
    goal:
      "Take a single-instance NestJS chat application and scale it across multiple server instances using the Redis adapter, shared connection state, sticky sessions, and presence tracking. Verify that messages and presence work correctly across instances.",
    brief:
      "You are the backend engineer for a growing chat platform. The current single-instance deployment cannot handle the load. Your job is to run three server instances behind a load balancer, use Redis for cross-server message routing, store connection state in Redis, configure sticky sessions, and write tests that verify the system works end-to-end across instances.",
    steps: [
      "Create a NestJS project with `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`, `@nestjs/typeorm`, `pg`, `ioredis`, and `@socket.io/redis-adapter`.",
      "Implement a basic `ChatGateway` with `joinRoom`, `leaveRoom`, and `sendMessage` handlers. Run it as a single instance and verify it works locally.",
      "Create a `RedisIoAdapter` that extends `IoAdapter` and attaches the `@socket.io/redis-adapter`. Configure it with `pubClient` and `subClient`.",
      "Update `main.ts` to use the `RedisIoAdapter`, awaiting `connectToRedis()` before `app.listen()`.",
      "Create a `ConnectionStateService` with methods to track online users (`online:users` set), user sockets (`user:sockets:{userId}` set), user server (`user:servers` hash), and room members (`room:members:{roomId}` set).",
      "Integrate the state service into the gateway: on connect, add the user; on disconnect, remove the user (only when all sockets are gone); on join/leave room, update room membership.",
      "Add a `cleanupStaleServerState()` method that runs on startup and removes any state assigned to this server's id.",
      "Add a `PresenceService` that emits `onlineCount` to all clients when a user connects or disconnects.",
      "Configure Nginx with sticky sessions (`hash $remote_addr consistent`) and `proxy_read_timeout 90s`.",
      "Create a `docker-compose.yml` with Redis, three app instances (using the same image but different `SERVER_ID`), and Nginx.",
      "Run `docker-compose up --build` and verify that all three instances connect to Redis.",
      "Write an e2e test using `socket.io-client` that connects two clients, sends messages to a room, and verifies both clients receive them regardless of which instance they connect to.",
      "Write an e2e test that verifies presence: connect a client, check `onlineCount`, disconnect, verify the count decreases.",
      "Write an e2e test that opens multiple connections for the same user (simulating two tabs) and verifies the user is only offline when both disconnect.",
    ],
    acceptance: [
      "Three server instances run behind Nginx with sticky sessions.",
      "A message sent from a client on instance 1 is received by a client on instance 3.",
      "Presence (`onlineCount`) is accurate across all instances.",
      "A user with two tabs is online when one tab disconnects and offline only when both disconnect.",
      "Stale state is cleaned up on server startup.",
      "The Redis adapter is connected and forwarding messages.",
      "All e2e tests pass.",
    ],
    stretch: [
      "Add a `sendToUser` event that routes a private message to a specific user, using `user:{userId}` rooms and Redis routing.",
      "Replace the Redis pub/sub adapter with the Redis Streams adapter and verify messages are persisted and replayable after a server restart.",
      "Add Prometheus metrics: `ws_active_connections`, `ws_messages_broadcast_total`, `ws_presence_count`.",
      "Write a load test with `artillery` that connects 1,000 concurrent WebSocket clients across three instances and sends messages to rooms, measuring delivery latency and cross-instance delivery success rate.",
      "Implement graceful shutdown: on SIGTERM, stop accepting new connections, notify clients to reconnect, and wait for in-flight messages to complete before closing.",
      "Add a `resyncRooms` feature that rejoins a user to all their rooms when they reconnect, based on persistent room membership stored in Redis.",
      "Configure Redis Cluster for the adapter and verify that messages are routed correctly across Redis shards.",
    ],
  },
};