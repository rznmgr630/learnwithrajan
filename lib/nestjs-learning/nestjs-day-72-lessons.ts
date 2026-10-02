import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_72_LESSONS: LessonDay = {
  day: 72,
  title: "NestJS Gateways",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-72-lesson-1",
      title: "Gateways",
      durationMinutes: 22,
      explanation: `
<b>Imagine you are building a chat application.</b> Users expect messages to appear instantly, without refreshing the page. You could implement polling — the client asks the server "any new messages?" every second — but that is wasteful, slow, and does not scale. What you need is a persistent, bi-directional connection between client and server: WebSockets.

NestJS provides first-class WebSocket support through <b>gateways</b>. A gateway is a class annotated with \`@WebSocketGateway()\` that handles WebSocket connections and messages. If you have written controllers for HTTP, gateways will feel familiar — they use the same dependency injection, decorators, guards, pipes, and interceptors [citation:1][citation:15].

<b>Why do gateways exist?</b> Because real-time communication is a different problem from request-response. In HTTP, the client initiates every exchange. In WebSockets, the server can push messages to clients at any time. Gateways abstract the WebSocket library (Socket.IO or ws) so you can focus on your application logic [citation:1].

<b>How gateways work.</b> A gateway is a provider — it can inject dependencies through its constructor, and other classes can inject it [citation:1]. When the application starts, NestJS discovers all gateways, instantiates their WebSocket servers, and binds event handlers.

The basic structure:

\`\`\`typescript
@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
\`\`\`

The \`@SubscribeMessage('events')\` decorator tells NestJS: when a client emits an event named \`events\`, call this method with the payload. The return value is sent back as an acknowledgment [citation:1][citation:15].

<b>Gateways are platform-agnostic.</b> NestJS supports two WebSocket platforms out of the box: Socket.IO and native ws. Socket.IO provides rooms, namespaces, automatic reconnection, and fallback to HTTP long-polling. Native ws is lighter and faster but lacks those higher-level features [citation:1][citation:8][citation:16].

<b>Port and namespace configuration.</b> By default, each gateway listens on the same port as the HTTP server. You can change this by passing a port number to the decorator:

\`\`\`typescript
@WebSocketGateway(80, { namespace: 'events' })
\`\`\`

The first argument is the port (optional). The second argument is an options object passed to the underlying socket server. If you do not need a custom port, pass the options object as the only argument [citation:1][citation:15].

<b>Namespaces</b> let you separate concerns on a single connection. Think of them as different channels — \`/chat\` for messaging, \`/notifications\` for alerts. Clients connect to a specific namespace [citation:5].

<b>Important warning:</b> Gateways are not instantiated until they are referenced in the \`providers\` array of a module. If you create a gateway class but forget to register it, nothing happens [citation:1][citation:15].

<b>Gateways vs. controllers.</b> Both are entry points for external communication, but they differ in fundamental ways:

| Aspect | Controller | Gateway |
|--------|-----------|---------|
| Protocol | HTTP | WebSocket |
| Direction | Client-initiated | Bi-directional |
| Connection | Stateless (per request) | Persistent |
| Exception | \`HttpException\` | \`WsException\` [citation:6] |
| Filters | Global filters apply | Global filters **do not** apply [citation:19] |

<b>What can go wrong?</b>
- <b>Forgetting to register the gateway.</b> A gateway not listed in a module's \`providers\` array is never instantiated. No error, no warning — just silence [citation:1].
- <b>Using \`HttpException\` in a gateway.</b> HTTP exceptions do not work in WebSockets. Use \`WsException\` instead. Any other exception reaches the client as a generic "Internal server error" [citation:6].
- <b>Assuming global filters apply.</b> Global exception filters registered with \`app.useGlobalFilters()\` do not apply to gateways. You must bind filters at the gateway or method level [citation:19].
- <b>Injecting request-scoped providers.</b> Gateways are singletons. They cannot use request-scoped or transient-scoped providers [citation:12].
- <b>Creating multiple gateways for the same namespace.</b> A gateway should be a singleton per namespace. Multiple instances cause connection issues [citation:12].

<b>How this appears in a real application.</b> A collaboration tool like a document editor uses a gateway to sync cursor positions, text changes, and presence indicators. Each document is a namespace or room. Users connect once, and the gateway pushes updates to everyone in the room. The gateway delegates business logic (persisting changes, validating permissions) to services, keeping the gateway focused on communication [citation:16].

<b>How experienced engineers think.</b> A gateway is a communication adapter, not a business logic container. Keep it thin: handle connection lifecycle, route messages to services, emit responses. The heavy lifting belongs in services. This separation makes the gateway testable and the business logic reusable [citation:16].
      `,
      diagram: `
NestJS Gateway Architecture

  Client (Socket.IO / WS)
        |
        |  WebSocket connection
        v
  +-------------------------------+
  |  WebSocket Adapter            |
  |  (IoAdapter / WsAdapter)      |
  +-------------------------------+
        |
        v
  +-------------------------------+
  |  Gateway (singleton)          |
  |  @WebSocketGateway()          |
  |  - @SubscribeMessage('event') |
  |  - @MessageBody()             |
  |  - @ConnectedSocket()         |
  +-------------------------------+
        |
        |  Delegates business logic
        v
  +-------------------------------+
  |  Service (business logic)     |
  +-------------------------------+

  Gateway vs Controller:
    Controller: HTTP, stateless, client-initiated
    Gateway:    WS, persistent, bi-directional

  Exception handling:
    Controller: HttpException
    Gateway:    WsException (HttpException does NOT work)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// NESTJS GATEWAYS — BASIC SETUP
// ============================================

// Install:
// npm i --save @nestjs/websockets @nestjs/platform-socket.io

// ---------- 1. Basic gateway ----------
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {
  // Listen for 'events' messages.
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    // Return value is sent as an acknowledgment.
    return data;
  }
}

// ---------- 2. Gateway with port and namespace ----------
@WebSocketGateway(80, { namespace: 'events' })
export class EventsGateway {
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}

// ---------- 3. Extract a property from the message body ----------
@WebSocketGateway()
export class UsersGateway {
  @SubscribeMessage('getUser')
  handleGetUser(@MessageBody('id') id: number): number {
    // id === messageBody.id
    return id;
  }
}

// ---------- 4. Using @ConnectedSocket ----------
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ): string {
    client.join(roomId);
    return \`joined \${roomId}\`;
  }
}

// ---------- 5. Returning a WsResponse (multiple response events) ----------
import { WsResponse } from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    const event = 'events';
    return { event, data };
  }
}

// ---------- 6. Register the gateway in a module ----------
import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  // CRITICAL: Gateways must be in the providers array.
  providers: [EventsGateway],
})
export class EventsModule {}

// ---------- 7. Gateway as a provider (injectable) ----------
@WebSocketGateway()
export class NotificationsGateway {
  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage('subscribe')
  handleSubscribe(@MessageBody() userId: string) {
    this.notificationsService.register(userId);
    return { subscribed: true };
  }
}

// Other classes can inject the gateway:
@Injectable()
export class OrdersService {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  async createOrder(order: Order) {
    // ... create order ...
    this.notificationsGateway.notifyUser(order.userId, order);
  }
}

// ---------- 8. Using WsException ----------
import { WsException } from '@nestjs/websockets';

@WebSocketGateway()
export class SafeGateway {
  @SubscribeMessage('getUser')
  handleGetUser(@MessageBody('id') id: number) {
    if (id <= 0) {
      // Use WsException, NOT HttpException.
      throw new WsException('Invalid user id');
    }
    return { id, name: 'Ada' };
  }
}

// ---------- 9. What NOT to do ----------
// BAD: Gateway not registered in a module.
// @WebSocketGateway()
// export class UnregisteredGateway {}
// Nothing happens — the gateway is never instantiated.

// BAD: Using HttpException in a gateway.
// throw new BadRequestException('Invalid');
// The client sees "Internal server error", not "Invalid".

// BAD: Multiple gateways for the same namespace.
// @WebSocketGateway({ namespace: 'chat' }) export class ChatGatewayA {}
// @WebSocketGateway({ namespace: 'chat' }) export class ChatGatewayB {}
// Two singletons fighting for the same namespace causes issues.
      ` },
      keyTakeaways: [
        "A gateway is a class annotated with `@WebSocketGateway()` that handles WebSocket communication.",
        "Gateways are providers — they support dependency injection and can be injected into other classes.",
        "`@SubscribeMessage('event')` binds a method to an incoming WebSocket event.",
        "The return value of a handler is sent as an acknowledgment; use `WsResponse` for multiple events.",
        "Use `WsException`, not `HttpException`, in gateways — global HTTP filters do not apply.",
        "Gateways must be registered in a module's `providers` array or they are never instantiated.",
        "Gateways are singletons — do not use request-scoped providers, and avoid multiple gateways for the same namespace.",
      ],
      commonMistakes: [
        "<b>Forgetting to register the gateway.</b> A gateway not listed in `providers` is never instantiated. No error, no warning [citation:1].",
        "<b>Using `HttpException` in a gateway.</b> HTTP exceptions do not work in WebSockets. Use `WsException` instead [citation:6].",
        "<b>Assuming global filters apply.</b> Global exception filters do not apply to gateways. Bind filters at the gateway or method level [citation:19].",
        "<b>Injecting request-scoped providers.</b> Gateways are singletons and cannot use request-scoped or transient-scoped providers [citation:12].",
        "<b>Creating multiple gateways for the same namespace.</b> A gateway should be a singleton per namespace [citation:12].",
      ],
      quiz: [
        {
          question:
            "What is a NestJS gateway?",
          options: [
            "A controller for HTTP requests.",
            "A class annotated with `@WebSocketGateway()` that handles WebSocket communication.",
            "A database connection.",
            "A middleware function.",
          ],
          correctIndex: 1,
          explanation:
            "A gateway is a class decorated with `@WebSocketGateway()` that handles WebSocket connections and messages. It is the WebSocket equivalent of a controller [citation:1].",
        },
        {
          question:
            "What exception class should you use in a gateway?",
          options: [
            "`HttpException`",
            "`BadRequestException`",
            "`WsException`",
            "`NotFoundException`",
          ],
          correctIndex: 2,
          explanation:
            "`WsException` is the correct exception for WebSocket gateways. `HttpException` and its subclasses do not work — the client sees a generic 'Internal server error' [citation:6].",
        },
        {
          question:
            "How do you register a gateway so it is instantiated?",
          options: [
            "Add it to the `controllers` array of a module.",
            "Add it to the `providers` array of a module.",
            "Import it in `main.ts`.",
            "It is instantiated automatically.",
          ],
          correctIndex: 1,
          explanation:
            "Gateways must be referenced in the `providers` array of an existing module. Otherwise, they are never instantiated [citation:1].",
        },
        {
          question:
            "Which statement about global exception filters is true for gateways?",
          options: [
            "Global filters apply to gateways automatically.",
            "Global filters do not apply to gateways; bind filters at the gateway or method level.",
            "Global filters only apply to Socket.IO gateways.",
            "Global filters must be registered twice.",
          ],
          correctIndex: 1,
          explanation:
            "Global exception filters registered with `app.useGlobalFilters()` do not apply to gateways. Use `@UseFilters()` at the gateway or method level [citation:19].",
        },
      ],
    },
    {
      id: "day-72-lesson-2",
      title: "Socket.IO",
      durationMinutes: 24,
      explanation: `
<b>Socket.IO is the default WebSocket library in NestJS.</b> It provides a rich set of features that make real-time applications easier to build: automatic reconnection, fallback to HTTP long-polling, rooms, namespaces, and a clean event-based API. For most NestJS applications, Socket.IO is the right choice [citation:1][citation:16].

<b>Why Socket.IO instead of raw WebSockets?</b> Raw WebSockets (RFC 6455) are a low-level protocol. They give you a persistent connection but nothing else. Socket.IO builds on top of WebSockets and adds:
- <b>Automatic reconnection</b> with exponential backoff.
- <b>Fallback to HTTP long-polling</b> when WebSockets are blocked.
- <b>Rooms</b> — group clients and broadcast to subsets.
- <b>Namespaces</b> — separate communication channels on one connection.
- <b>Event-based API</b> — emit and listen for named events.
- <b>Acknowledgments</b> — built-in request-response patterns [citation:10][citation:16].

For a chat application, a collaborative editor, or a notification system, these features save significant development time.

<b>Rooms.</b> A room is a logical grouping of sockets. When you broadcast to a room, only sockets that have joined that room receive the message. Rooms are created on the server side — no configuration needed. Clients join rooms by emitting a message that triggers \`client.join(roomName)\` [citation:5][citation:10].

\`\`\`typescript
@SubscribeMessage('joinRoom')
handleJoinRoom(
  @MessageBody() roomId: string,
  @ConnectedSocket() client: Socket,
) {
  client.join(roomId);
  // Notify others in the room.
  client.to(roomId).emit('userJoined', { userId: client.id });
  return { joined: roomId };
}
\`\`\`

<b>Broadcasting to rooms.</b> The server instance (injected with \`@WebSocketServer()\`) can emit to all clients in a room:

\`\`\`typescript
@WebSocketServer()
server: Server;

broadcastToRoom(roomId: string, event: string, data: any) {
  this.server.to(roomId).emit(event, data);
}
\`\`\`

<b>Namespaces.</b> Namespaces are like separate Socket.IO instances on the same connection. Each namespace has its own event handlers, rooms, and middleware. They are useful for separating different parts of an application: \`/chat\` for messaging, \`/notifications\` for alerts, \`/admin\` for admin features [citation:5].

\`\`\`typescript
@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  notifyUser(userId: string, notification: any) {
    // Emit to a user-specific room within the notifications namespace.
    this.server.to(\`user:\${userId}\`).emit('notification', notification);
  }
}
\`\`\`

<b>Authentication in Socket.IO.</b> WebSocket connections are authenticated at the handshake, not per message. The client sends a JWT token in the connection handshake:

\`\`\`typescript
const socket = io(WS_URL, { auth: { token } });
\`\`\`

On the server, you validate the token in \`handleConnection\` or in middleware registered in \`afterInit\` [citation:5][citation:10]:

\`\`\`typescript
afterInit(server: Server) {
  server.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const payload = this.jwtService.verify(token);
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });
}
\`\`\`

This is the standard pattern for Socket.IO authentication. If the token is invalid, the connection is rejected before any messages are processed [citation:16].

<b>Scaling with Redis.</b> In a multi-instance deployment, a client connects to one pod. If another pod emits an event, the client does not receive it. Socket.IO solves this with the <b>Redis adapter</b>. Every pod publishes events to Redis, and Redis distributes them to all pods [citation:7][citation:16].

\`\`\`typescript
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor;

  async connectToRedis() {
    const pubClient = createClient({ url: 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port, options) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
\`\`\`

<b>Critical warning:</b> When using Socket.IO with multiple load-balanced instances, you must either disable polling (\`transports: ['websocket']\`) or enable sticky sessions on the load balancer. Redis alone is not enough — without sticky sessions, a client's polling requests can hit different pods, breaking the connection [citation:7].

<b>What can go wrong?</b>
- <b>Not using sticky sessions.</b> In a multi-pod deployment with polling enabled, requests hit different pods and the connection breaks. Use sticky sessions or disable polling [citation:7].
- <b>Not scaling with Redis.</b> Without the Redis adapter, events emitted from one pod do not reach clients connected to another [citation:7].
- <b>Authenticating per message instead of per connection.</b> WebSocket connections should be authenticated at the handshake. Validating on every message is wasteful and error-prone [citation:16].
- <b>Not handling disconnections.</b> If a user disconnects, remove them from online maps and rooms. Otherwise, memory leaks and stale state accumulate [citation:10].
- <b>Emitting to a room before the client joins.</b> If you emit to a room the client has not joined, the message is lost. Ensure the join happens before the emit.
- <b>Using rooms for authorization.</b> Rooms are not a security mechanism. A client can join any room unless you validate permissions before allowing the join.

<b>How this appears in a real application.</b> A real-time chat application uses:
- A \`ChatGateway\` with namespace \`/chat\`.
- Each conversation is a room.
- On connection, the gateway validates the JWT and joins the user to all their conversation rooms.
- When a message is sent, the gateway saves it via a service and broadcasts to the room.
- When a user is added to a conversation, \`resyncUserRooms\` joins them to the new room without reconnecting [citation:10].

<b>How experienced engineers think.</b> Socket.IO is the pragmatic choice for most NestJS real-time features. It handles the hard parts — reconnection, fallback, scaling — so you can focus on your application. The main production concerns are authentication at the handshake, sticky sessions for scaling, and keeping the gateway thin [citation:16].
      `,
      diagram: `
Socket.IO Gateway Architecture

  Client A (user:1)     Client B (user:2)     Client C (user:3)
        |                     |                     |
        |  socket.io          |                     |
        v                     v                     v
  +-------------------------------------------------------+
  |  Socket.IO Server (NestJS Gateway)                     |
  |                                                       |
  |  Namespace: /chat                                     |
  |    Room: conversation:1  <- Client A, Client B        |
  |    Room: conversation:2  <- Client B, Client C        |
  |                                                       |
  |  Namespace: /notifications                            |
  |    Room: user:1  <- Client A                          |
  |    Room: user:2  <- Client B                          |
  +-------------------------------------------------------+
        |
        |  Redis Adapter (multi-pod scaling)
        v
  +-------------------+
  |  Redis Pub/Sub    |
  |  (distributes events across pods) |
  +-------------------+

  Authentication:
    Client connects with: io(url, { auth: { token: JWT } })
    Server validates in afterInit middleware
    Invalid token -> connection rejected

  Scaling requirements:
    - Redis adapter for cross-pod events
    - Sticky sessions OR transports: ['websocket']
      `,
      codeExample: { title: "Example", code: `
// ============================================
// SOCKET.IO IN NESTJS
// ============================================

// Install:
// npm i --save @nestjs/websockets @nestjs/platform-socket.io socket.io

// ---------- 1. Basic chat gateway ----------
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger(ChatGateway.name);

  afterInit(server: Server) {
    this.logger.log('Chat gateway initialized');

    // Authentication middleware at handshake.
    server.use((socket, next) => {
      const token = socket.handshake.auth.token;
      try {
        // Verify JWT here (use JwtService).
        // socket.data.userId = payload.sub;
        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });
  }

  handleConnection(client: Socket) {
    this.logger.log(\`Client connected: \${client.id}\`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(\`Client disconnected: \${client.id}\`);
  }

  // Join a conversation room.
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    client.to(roomId).emit('userJoined', { userId: client.id });
    return { joined: roomId };
  }

  // Leave a room.
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
    client.to(roomId).emit('userLeft', { userId: client.id });
    return { left: roomId };
  }

  // Send a message to a room.
  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    // In production, save the message via a service first.
    this.server.to(data.roomId).emit('message', {
      userId: client.id,
      text: data.text,
      timestamp: new Date().toISOString(),
    });
    return { sent: true };
  }
}

// ---------- 2. Notifications gateway with user-specific rooms ----------
@WebSocketGateway({ namespace: 'notifications', cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(\`user:\${userId}\`);
    return { subscribed: true };
  }

  // Called from a service to push a notification to a specific user.
  notifyUser(userId: string, notification: any) {
    this.server.to(\`user:\${userId}\`).emit('notification', notification);
  }
}

// ---------- 3. Redis adapter for multi-pod scaling ----------
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

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

// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(3000);
}
bootstrap();

// ---------- 4. Client-side connection ----------
// const socket = io('http://localhost:3000/chat', {
//   auth: { token: 'jwt-token-here' },
//   transports: ['websocket'], // Disable polling for scaling
// });
//
// socket.on('connect', () => {
//   socket.emit('joinRoom', 'conversation:1');
// });
//
// socket.on('message', (data) => {
//   console.log('New message:', data);
// });

// ---------- 5. Rooms and namespaces summary ----------
// Rooms:
//   - Logical grouping of sockets within a namespace.
//   - client.join(roomId) / client.leave(roomId).
//   - server.to(roomId).emit(event, data).
//
// Namespaces:
//   - Separate communication channels on one connection.
//   - @WebSocketGateway({ namespace: '/chat' }).
//   - Client connects to a specific namespace.
      ` },
      keyTakeaways: [
        "Socket.IO is the default WebSocket library in NestJS, offering reconnection, fallback, rooms, and namespaces.",
        "Rooms group sockets for targeted broadcasts: `client.join()`, `server.to(room).emit()`.",
        "Namespaces separate concerns on one connection: `/chat`, `/notifications`, `/admin`.",
        "Authenticate WebSocket connections at the handshake using JWT in `socket.handshake.auth`.",
        "Use the Redis adapter for multi-pod scaling — every pod publishes to Redis, which distributes events.",
        "Sticky sessions or `transports: ['websocket']` are required for Socket.IO with load balancing.",
        "Keep gateways thin — delegate business logic to services.",
      ],
      commonMistakes: [
        "<b>Not using sticky sessions with load balancing.</b> Polling requests can hit different pods, breaking the connection. Use sticky sessions or disable polling [citation:7].",
        "<b>Not scaling with Redis.</b> Without the Redis adapter, events from one pod do not reach clients on another [citation:7].",
        "<b>Authenticating per message instead of per connection.</b> WebSocket connections should be authenticated at the handshake [citation:16].",
        "<b>Not cleaning up on disconnect.</b> Remove users from online maps and rooms to prevent memory leaks [citation:10].",
        "<b>Emitting to a room before the client joins.</b> The message is lost if the client has not joined the room yet.",
        "<b>Using rooms for authorization.</b> Rooms are not a security mechanism. Validate permissions before allowing a join.",
      ],
      quiz: [
        {
          question:
            "What is a Socket.IO room?",
          options: [
            "A separate WebSocket server.",
            "A logical grouping of sockets within a namespace for targeted broadcasts.",
            "A database table.",
            "A type of namespace.",
          ],
          correctIndex: 1,
          explanation:
            "A room is a logical grouping of sockets. When you emit to a room, only sockets that have joined receive the message [citation:5][citation:10].",
        },
        {
          question:
            "How should you authenticate a Socket.IO connection?",
          options: [
            "On every message.",
            "At the handshake using JWT in `socket.handshake.auth`.",
            "By IP address only.",
            "By using HTTP Basic Auth.",
          ],
          correctIndex: 1,
          explanation:
            "WebSocket connections should be authenticated at the handshake. The client sends a JWT, and the server validates it before the connection is established [citation:5][citation:16].",
        },
        {
          question:
            "What is required to scale Socket.IO across multiple pods?",
          options: [
            "Nothing — it scales automatically.",
            "A Redis adapter and sticky sessions (or disable polling).",
            "A separate database.",
            "A load balancer only.",
          ],
          correctIndex: 1,
          explanation:
            "Multi-pod Socket.IO requires the Redis adapter to distribute events across pods, and sticky sessions (or disabled polling) so a client's requests consistently hit the same pod [citation:7].",
        },
        {
          question:
            "What is the difference between a room and a namespace?",
          options: [
            "They are the same thing.",
            "A namespace is a separate communication channel; a room is a grouping within a namespace.",
            "A room is a separate server; a namespace is a grouping.",
            "Namespaces are only for Socket.IO; rooms are for raw WebSockets.",
          ],
          correctIndex: 1,
          explanation:
            "Namespaces are separate channels on one connection (e.g. `/chat`, `/notifications`). Rooms are groupings within a namespace (e.g. `conversation:1`, `user:42`) [citation:5].",
        },
      ],
    },
    {
      id: "day-72-lesson-3",
      title: "WebSocket Adapter",
      durationMinutes: 22,
      explanation: `
<b>NestJS abstracts WebSocket libraries behind an adapter interface.</b> This means you can swap Socket.IO for native ws (or a custom implementation) without changing your gateway code. The adapter is the bridge between the framework's platform-agnostic API and the specific WebSocket library [citation:3][citation:7].

<b>Why do adapters exist?</b> Because different applications have different needs. Socket.IO is feature-rich but heavy. Native ws is lightweight and fast but lacks rooms and namespaces. Some applications need to support both, or need custom protocols. The adapter pattern lets you choose the right transport for the job [citation:8][citation:16].

<b>The WebSocketAdapter interface.</b> Any adapter must implement these methods [citation:3][citation:7]:

| Method | Purpose |
|--------|---------|
| \`create(port, options)\` | Create a socket server instance |
| \`bindClientConnect(server, callback)\` | Bind the client connection event |
| \`bindClientDisconnect(client, callback)\` | Bind the client disconnection event (optional) |
| \`bindMessageHandlers(client, handlers, transform)\` | Bind incoming messages to handlers |
| \`close(server)\` | Terminate the server instance |

NestJS provides two built-in adapters: \`IoAdapter\` for Socket.IO and \`WsAdapter\` for native ws. Both extend \`AbstractWsAdapter\` [citation:8][citation:11].

<b>Extending IoAdapter.</b> The most common reason to extend the adapter is to add Redis for multi-pod scaling. The \`RedisIoAdapter\` example extends \`IoAdapter\` and overrides the \`createIOServer\` method to attach the Redis adapter [citation:7]:

\`\`\`typescript
export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor;

  async connectToRedis() {
    const pubClient = createClient({ url: 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port, options) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
\`\`\`

<b>WsAdapter (native ws).</b> The \`WsAdapter\` from \`@nestjs/platform-ws\` is a lightweight alternative. It uses the \`ws\` library directly, with no Socket.IO abstraction. It supports the WebSocket protocol natively and is faster, but it does not support rooms or namespaces [citation:8][citation:16].

Key differences [citation:8]:

| Feature | WsAdapter | IoAdapter |
|---------|-----------|-----------|
| Namespaces | Not supported | Supported |
| Rooms | Not supported | Supported |
| Protocol | Pure WebSocket (RFC 6455) | Socket.IO (polling + WS) |
| Dependency | \`ws\` | \`socket.io\` |
| Performance | Higher | Lower |

The \`WsAdapter\` handles port management intelligently: if the port is \`0\` and an HTTP server exists, it attaches to that server; if a specific port is provided, it creates a standalone server [citation:8].

<b>Message parsing in WsAdapter.</b> By default, \`WsAdapter\` expects JSON data. It uses a \`WsMessageParser\` to convert raw data into \`{ event, data }\`. You can override this via \`options.messageParser\` or by calling the adapter's parser assignment methods [citation:8].

<b>Switching adapters.</b> To use a different adapter, call \`app.useWebSocketAdapter()\` in \`main.ts\`:

\`\`\`typescript
const app = await NestFactory.create(AppModule);

// Use native ws instead of Socket.IO.
app.useWebSocketAdapter(new WsAdapter(app));

await app.listen(3000);
\`\`\`

<b>Hybrid adapters.</b> Some applications need to support multiple protocols simultaneously. The \`nestjs-hybrid-websocket-adapter\` library composes multiple adapters and routes based on runtime checks. This is advanced usage but demonstrates the flexibility of the adapter pattern [citation:2].

<b>What can go wrong?</b>
- <b>Using WsAdapter with namespaces.</b> Native ws does not support namespaces. \`WsAdapter\` throws an error if a namespace option is passed [citation:8].
- <b>Forgetting to connect the Redis adapter.</b> Creating a \`RedisIoAdapter\` without calling \`connectToRedis()\` means the adapter is never attached [citation:7].
- <b>Not disabling polling with load balancing.</b> Socket.IO with polling and multiple pods requires sticky sessions. Without it, connections break [citation:7].
- <b>Assuming WsAdapter has the same features as Socket.IO.</b> No rooms, no namespaces, no automatic reconnection. Check that your application does not rely on those features [citation:8].
- <b>Using an adapter that does not match the client.</b> The client must use the same protocol. Socket.IO clients cannot connect to a WsAdapter server, and vice versa.

<b>How this appears in a real application.</b> A high-frequency trading dashboard uses \`WsAdapter\` for the order book updates because it needs maximum performance and does not need rooms or namespaces. A chat application uses \`IoAdapter\` with the Redis adapter because it needs rooms, namespaces, and multi-pod scaling. The gateway code is identical — only the adapter changes [citation:8][citation:16].

<b>How experienced engineers think.</b> The adapter is an infrastructure choice, not an application choice. Start with Socket.IO (the default) unless you have a specific reason to use native ws. If you need multi-pod scaling, extend \`IoAdapter\` with Redis. The adapter pattern means you can change your mind later without rewriting gateways.
      `,
      diagram: `
WebSocket Adapters in NestJS

  Gateway (platform-agnostic)
        |
        v
  +-------------------------------+
  |  WebSocketAdapter interface   |
  |  - create()                   |
  |  - bindClientConnect()        |
  |  - bindClientDisconnect()     |
  |  - bindMessageHandlers()      |
  |  - close()                    |
  +-------------------------------+
        |
        +-- IoAdapter (Socket.IO)     <- Default
        |     - Rooms, Namespaces
        |     - Auto-reconnection
        |     - Fallback to polling
        |     - Redis adapter for scaling
        |
        +-- WsAdapter (native ws)    <- Lightweight
              - Pure WebSocket (RFC 6455)
              - No rooms, no namespaces
              - Higher performance
              - JSON message parser

  Switching:
    app.useWebSocketAdapter(new WsAdapter(app));
    or
    app.useWebSocketAdapter(new RedisIoAdapter(app));

  Feature comparison:
    WsAdapter:   Fast, minimal, no rooms/namespaces
    IoAdapter:   Feature-rich, rooms/namespaces, heavier
      `,
      codeExample: { title: "Example", code: `
// ============================================
// WEBSOCKET ADAPTERS IN NESTJS
// ============================================

// ---------- 1. Default: Socket.IO adapter (IoAdapter) ----------
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // IoAdapter is used by default when @nestjs/platform-socket.io is installed.
  await app.listen(3000);
}
bootstrap();

// ---------- 2. Switching to native ws adapter ----------
// npm i --save @nestjs/platform-ws ws
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use native ws instead of Socket.IO.
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(3000);
}
bootstrap();

// With WsAdapter, gateways still work:
@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}

// Client side uses native WebSocket:
// const ws = new WebSocket('ws://localhost:3000');
// ws.send(JSON.stringify({ event: 'events', data: 'hello' }));

// ---------- 3. RedisIoAdapter for multi-pod scaling ----------
// npm i --save redis socket.io @socket.io/redis-adapter
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

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

// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(3000);
}
bootstrap();

// WARNING: With Socket.IO and multiple load-balanced instances:
// - Either disable polling: transports: ['websocket'] on the client
// - Or enable cookie-based sticky sessions on the load balancer.
// Redis alone is not enough.

// ---------- 4. Custom adapter example (simplified) ----------
import { WebSocketAdapter, INestApplicationContext } from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import * as WebSocket from 'ws';

export class MyWsAdapter implements WebSocketAdapter {
  constructor(private readonly app: INestApplicationContext) {}

  create(port: number, options?: any): any {
    return new WebSocket.Server({ port, ...options });
  }

  bindClientConnect(server: any, callback: Function): void {
    server.on('connection', callback);
  }

  bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ): void {
    fromEvent(client, 'message')
      .pipe(
        mergeMap((data) => this.bindMessageHandler(data, handlers, transform)),
        filter((result) => result),
      )
      .subscribe((response) => client.send(JSON.stringify(response)));
  }

  bindMessageHandler(
    buffer: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ): Observable<any> {
    const message = JSON.parse(buffer.data);
    const messageHandler = handlers.find(
      (handler) => handler.message === message.event,
    );
    if (!messageHandler) {
      return EMPTY;
    }
    return transform(messageHandler.callback(message.data));
  }

  close(server: any): void {
    server.close();
  }
}

// Register it:
// app.useWebSocketAdapter(new MyWsAdapter(app));

// ---------- 5. Platform comparison ----------
// Socket.IO (IoAdapter):
//   - Rooms and namespaces
//   - Automatic reconnection
//   - Fallback to HTTP long-polling
//   - Heavier protocol
//   - Requires Redis adapter + sticky sessions for scaling
//
// Native ws (WsAdapter):
//   - Pure WebSocket (RFC 6455)
//   - No rooms or namespaces
//   - Higher performance, lower overhead
//   - JSON message parser by default
//   - Ideal for high-frequency, simple message flows
      ` },
      keyTakeaways: [
        "The WebSocketAdapter interface abstracts the underlying WebSocket library (Socket.IO, ws, or custom).",
        "IoAdapter (Socket.IO) is the default. It supports rooms, namespaces, and reconnection.",
        "WsAdapter (native ws) is lighter and faster but lacks rooms and namespaces.",
        "Extend `IoAdapter` to add the Redis adapter for multi-pod scaling.",
        "Switch adapters with `app.useWebSocketAdapter()` in `main.ts`.",
        "With Socket.IO and load balancing, use sticky sessions or disable polling.",
        "The adapter is an infrastructure choice — gateway code remains the same.",
      ],
      commonMistakes: [
        "<b>Using WsAdapter with namespaces.</b> Native ws does not support namespaces. `WsAdapter` throws an error if a namespace option is passed [citation:8].",
        "<b>Forgetting to connect the Redis adapter.</b> Creating a `RedisIoAdapter` without calling `connectToRedis()` means the adapter is never attached [citation:7].",
        "<b>Not disabling polling with load balancing.</b> Socket.IO with polling and multiple pods requires sticky sessions [citation:7].",
        "<b>Assuming WsAdapter has the same features as Socket.IO.</b> No rooms, no namespaces, no automatic reconnection [citation:8].",
        "<b>Using an adapter that does not match the client.</b> Socket.IO clients cannot connect to a WsAdapter server, and vice versa.",
      ],
      quiz: [
        {
          question:
            "What is the default WebSocket adapter in NestJS?",
          options: [
            "WsAdapter",
            "IoAdapter (Socket.IO)",
            "Custom adapter",
            "No adapter",
          ],
          correctIndex: 1,
          explanation:
            "IoAdapter (Socket.IO) is the default when `@nestjs/platform-socket.io` is installed [citation:1].",
        },
        {
          question:
            "Why would you use WsAdapter instead of IoAdapter?",
          options: [
            "You need rooms and namespaces.",
            "You need maximum performance and do not need rooms or namespaces.",
            "You need automatic reconnection.",
            "You need Redis scaling.",
          ],
          correctIndex: 1,
          explanation:
            "WsAdapter uses native ws, which is lighter and faster than Socket.IO. It is ideal when you do not need rooms or namespaces [citation:8][citation:16].",
        },
        {
          question:
            "What is the main reason to extend IoAdapter?",
          options: [
            "To change the port.",
            "To add Redis for multi-pod scaling.",
            "To disable authentication.",
            "To use JSON parsing.",
          ],
          correctIndex: 1,
          explanation:
            "Extending IoAdapter is most commonly done to attach the Redis adapter, which distributes events across multiple pods [citation:7].",
        },
        {
          question:
            "What is required for Socket.IO scaling with multiple pods?",
          options: [
            "Nothing — it scales automatically.",
            "A Redis adapter and sticky sessions (or disabled polling).",
            "A separate database.",
            "A load balancer only.",
          ],
          correctIndex: 1,
          explanation:
            "Multi-pod Socket.IO requires the Redis adapter to distribute events, and sticky sessions (or disabled polling) so a client's requests consistently hit the same pod [citation:7].",
        },
      ],
    },
    {
      id: "day-72-lesson-4",
      title: "Gateway Lifecycle",
      durationMinutes: 22,
      explanation: `
<b>A gateway is not just a collection of message handlers.</b> It has a lifecycle: it initializes, clients connect and disconnect, and it shuts down. Understanding these phases is essential for building robust real-time features — authentication, resource cleanup, and state management all happen at specific points in the lifecycle [citation:4][citation:5].

<b>The three lifecycle interfaces.</b> NestJS provides three interfaces you can implement on a gateway [citation:4][citation:15]:

| Interface | Method | When it runs |
|-----------|--------|--------------|
| \`OnGatewayInit\` | \`afterInit(server)\` | Once, when the gateway is initialized |
| \`OnGatewayConnection\` | \`handleConnection(client, ...args)\` | Each time a client connects |
| \`OnGatewayDisconnect\` | \`handleDisconnect(client)\` | Each time a client disconnects |

<b>\`afterInit(server)\`.</b> This runs once after the gateway's WebSocket server is created. It receives the server instance. This is the place to:
- Register middleware (e.g. authentication).
- Set up external connections.
- Log that the gateway is ready [citation:4][citation:10].

\`\`\`typescript
afterInit(server: Server) {
  this.logger.log('Gateway initialized');

  // Authentication middleware at handshake.
  server.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const payload = this.jwtService.verify(token);
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });
}
\`\`\`

<b>Why authentication belongs in \`afterInit\`.</b> The handshake is the only moment when you can reject a connection before it is fully established. Authenticating per message is wasteful and error-prone. By using middleware in \`afterInit\`, you validate the token once and attach the user identity to the socket [citation:10][citation:16].

<b>\`handleConnection(client)\`.</b> This runs for each new client connection. It receives the socket instance. This is the place to:
- Log the connection.
- Track online users.
- Join the user to their default rooms.
- Send initial state to the client [citation:4][citation:10].

\`\`\`typescript
handleConnection(client: Socket) {
  const userId = client.data.userId;
  this.logger.log(\`User \${userId} connected (socket: \${client.id})\`);

  // Track online users.
  this.onlineUsers.set(userId, client.id);

  // Join the user to their conversation rooms.
  this.syncUserRooms(userId);

  // Send initial state.
  client.emit('connected', { userId, socketId: client.id });
}
\`\`\`

<b>Why cleanup matters in \`handleDisconnect\`.</b> When a client disconnects, you must remove them from any in-memory maps and leave their rooms. Otherwise, memory leaks and stale state accumulate. A user who disconnected five hours ago should not appear as "online" [citation:10].

\`\`\`typescript
handleDisconnect(client: Socket) {
  const userId = client.data.userId;
  this.logger.log(\`User \${userId} disconnected\`);

  // Remove from online tracking.
  this.onlineUsers.delete(userId);

  // Rooms are automatically left on disconnect,
  // but you may want to notify others.
  this.server.emit('userOffline', { userId });
}
\`\`\`

<b>Connection lifecycle in practice.</b> A typical sequence:

1. Server starts → \`afterInit\` runs → middleware registered.
2. Client connects with JWT → middleware validates → \`handleConnection\` runs.
3. Client joins rooms, receives initial state.
4. Client sends and receives messages via \`@SubscribeMessage\` handlers.
5. Client disconnects → \`handleDisconnect\` runs → cleanup.
6. Server shuts down → connections closed.

<b>What can go wrong?</b>
- <b>Authenticating per message instead of at handshake.</b> Wasteful and error-prone. Validate in \`afterInit\` middleware [citation:16].
- <b>Not cleaning up in \`handleDisconnect\`.</b> Memory leaks, stale online status, and broken room state [citation:10].
- <b>Assuming \`handleConnection\` runs before the client sends messages.</b> It does, but only if the connection is established. If the handshake fails, \`handleConnection\` never runs.
- <b>Not tracking the socket-to-user mapping.</b> Without it, you cannot target a specific user or know who is online.
- <b>Joining rooms in \`handleConnection\` without checking permissions.</b> A user might join rooms they should not have access to. Validate permissions before joining.
- <b>Forgetting that gateways are singletons.</b> State stored in the gateway instance is shared across all connections. Use maps keyed by user id or socket id [citation:12].

<b>How this appears in a real application.</b> A collaboration app:
- \`afterInit\`: registers JWT middleware; on connection, attaches \`userId\` to socket.
- \`handleConnection\`: adds user to the online map, joins them to all documents they have access to, sends the current document state.
- \`handleDisconnect\`: removes from online map, notifies collaborators that the user left, saves any pending changes.
- \`@SubscribeMessage('cursorMove')\`: broadcasts cursor position to other users in the document room [citation:10].

<b>How experienced engineers think.</b> The lifecycle is where you handle the concerns that do not fit into message handlers: authentication, resource tracking, and cleanup. Keep the lifecycle methods focused and delegate business logic to services. The lifecycle is the gateway's "maintenance" — connections come and go, but the gateway must stay clean [citation:16].
      `,
      diagram: `
Gateway Lifecycle

  Server starts
        |
        v
  +-------------------------------+
  |  afterInit(server)            |  <- Once
  |  - Register middleware        |
  |  - Set up external connections|
  |  - Log initialization         |
  +-------------------------------+
        |
        v
  Client connects
        |
        v
  +-------------------------------+
  |  Handshake middleware         |
  |  - Validate JWT               |
  |  - Attach userId to socket    |
  |  - Reject if invalid          |
  +-------------------------------+
        |
        v
  +-------------------------------+
  |  handleConnection(client)     |  <- Per connection
  |  - Log connection             |
  |  - Track online user          |
  |  - Join default rooms         |
  |  - Send initial state         |
  +-------------------------------+
        |
        v
  +-------------------------------+
  |  Message handlers             |  <- Per message
  |  @SubscribeMessage('event')   |
  +-------------------------------+
        |
        v
  Client disconnects
        |
        v
  +-------------------------------+
  |  handleDisconnect(client)     |  <- Per disconnection
  |  - Remove from online map     |
  |  - Notify others              |
  |  - Clean up resources         |
  +-------------------------------+

  Server shuts down
        |
        v
  Connections closed, resources released
      `,
      codeExample: { title: "Example", code: `
// ============================================
// GATEWAY LIFECYCLE IN NESTJS
// ============================================

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly onlineUsers = new Map<string, string>(); // userId -> socketId

  constructor(private readonly jwtService: JwtService) {}

  // ============================================
  // LIFECYCLE: afterInit (once)
  // ============================================
  afterInit(server: Server) {
    this.logger.log('Chat gateway initialized');

    // Authentication middleware at the handshake.
    // This runs BEFORE any connection is accepted.
    server.use((socket, next) => {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Missing authentication token'));
      }

      try {
        const payload = this.jwtService.verify(token);
        // Attach the user identity to the socket.
        socket.data.userId = payload.sub;
        socket.data.email = payload.email;
        next();
      } catch {
        next(new Error('Invalid authentication token'));
      }
    });
  }

  // ============================================
  // LIFECYCLE: handleConnection (per connection)
  // ============================================
  handleConnection(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(\`User \${userId} connected (socket: \${client.id})\`);

    // Track online users.
    this.onlineUsers.set(userId, client.id);

    // Join the user to their conversation rooms.
    this.syncUserRooms(userId, client);

    // Notify others that the user is online.
    this.server.emit('userOnline', { userId });

    // Send initial state to the connected client.
    client.emit('connected', {
      userId,
      socketId: client.id,
      onlineCount: this.onlineUsers.size,
    });
  }

  // ============================================
  // LIFECYCLE: handleDisconnect (per disconnection)
  // ============================================
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(\`User \${userId} disconnected (socket: \${client.id})\`);

    // Remove from online tracking.
    this.onlineUsers.delete(userId);

    // Rooms are automatically left on disconnect,
    // but we may want to notify others.
    this.server.emit('userOffline', { userId });

    // In production: save any pending changes, clear timers, etc.
  }

  // ============================================
  // MESSAGE HANDLERS (per message)
  // ============================================
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // In production: validate that the user has access to this room.
    client.join(roomId);
    client.to(roomId).emit('userJoined', { userId: client.data.userId });
    return { joined: roomId };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    // In production: save the message via a service.
    this.server.to(data.roomId).emit('message', {
      userId: client.data.userId,
      text: data.text,
      timestamp: new Date().toISOString(),
    });
    return { sent: true };
  }

  // ============================================
  // HELPER METHODS
  // ============================================
  private syncUserRooms(userId: string, client: Socket) {
    // In production: fetch the user's conversations from the database.
    const conversationIds = ['conversation:1', 'conversation:2'];
    conversationIds.forEach((roomId) => client.join(roomId));
  }

  // Utility: check if a user is online.
  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  // Utility: get all online user ids.
  getOnlineUsers(): string[] {
    return Array.from(this.onlineUsers.keys());
  }
}

// ============================================
// REGISTERING THE GATEWAY
// ============================================
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: 'secret' })],
  providers: [ChatGateway],
})
export class ChatModule {}

// ============================================
// WHAT NOT TO DO
// ============================================

// BAD: Authenticating in a message handler instead of the handshake.
// @SubscribeMessage('sendMessage')
// handleMessage(@MessageBody() data, @ConnectedSocket() client) {
//   const token = data.token; // Wasteful and error-prone.
// }

// BAD: Not cleaning up in handleDisconnect.
// The onlineUsers map grows forever, showing disconnected users as online.

// BAD: Storing per-user state on the gateway instance without a key.
// private currentUser: string; // Shared across all connections!
// Use: private onlineUsers = new Map<string, string>();

// BAD: Joining rooms in handleConnection without checking permissions.
// A user could join any room by guessing the room id.
      ` },
      keyTakeaways: [
        "Gateways implement three lifecycle interfaces: `OnGatewayInit`, `OnGatewayConnection`, and `OnGatewayDisconnect`.",
        "`afterInit` runs once — use it to register authentication middleware at the handshake.",
        "`handleConnection` runs per client — use it to track online users and join default rooms.",
        "`handleDisconnect` runs per disconnection — use it to clean up maps and notify others.",
        "Authenticate at the handshake in `afterInit`, not per message.",
        "Always clean up in `handleDisconnect` to prevent memory leaks and stale state.",
        "Gateways are singletons — use maps keyed by user/socket id, not instance variables.",
      ],
      commonMistakes: [
        "<b>Authenticating per message instead of at handshake.</b> Validate in `afterInit` middleware [citation:16].",
        "<b>Not cleaning up in `handleDisconnect`.</b> Memory leaks, stale online status, and broken room state [citation:10].",
        "<b>Joining rooms in `handleConnection` without checking permissions.</b> A user could join rooms they should not access.",
        "<b>Storing per-user state in instance variables.</b> Gateways are singletons — state is shared across all connections [citation:12].",
        "<b>Assuming `handleConnection` runs before the handshake completes.</b> If authentication fails, `handleConnection` never runs.",
      ],
      quiz: [
        {
          question:
            "When does `afterInit` run?",
          options: [
            "On every client connection.",
            "Once, after the gateway's server is initialized.",
            "On every message.",
            "On client disconnection.",
          ],
          correctIndex: 1,
          explanation:
            "`afterInit` runs once after the WebSocket server is created. It is the place to register middleware and set up external connections [citation:4].",
        },
        {
          question:
            "Where should WebSocket authentication happen?",
          options: [
            "In every message handler.",
            "At the handshake, using middleware registered in `afterInit`.",
            "In `handleDisconnect`.",
            "In the controller.",
          ],
          correctIndex: 1,
          explanation:
            "Authentication should happen at the handshake. The client sends a token, and middleware validates it before the connection is fully established [citation:10][citation:16].",
        },
        {
          question:
            "Why is cleanup important in `handleDisconnect`?",
          options: [
            "Because it makes the code shorter.",
            "Because without cleanup, memory leaks and stale state accumulate (e.g. disconnected users appear online).",
            "Because NestJS requires it.",
            "Because it speeds up reconnection.",
          ],
          correctIndex: 1,
          explanation:
            "Disconnected users must be removed from online maps and room state. Without cleanup, memory grows and the application shows incorrect online status [citation:10].",
        },
        {
          question:
            "Why should you use a `Map` instead of an instance variable for per-user state in a gateway?",
          options: [
            "Because Maps are faster.",
            "Because gateways are singletons — instance variables are shared across all connections.",
            "Because TypeScript requires it.",
            "Because Maps are more secure.",
          ],
          correctIndex: 1,
          explanation:
            "Gateways are singletons. An instance variable would be shared across all connected clients. Use a `Map` keyed by user or socket id to track per-connection state [citation:12].",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is a NestJS gateway?",
      options: [
        "A controller for HTTP requests.",
        "A class annotated with `@WebSocketGateway()` that handles WebSocket communication.",
        "A database connection.",
        "A middleware function.",
      ],
      correctIndex: 1,
      explanation: "A gateway is a class decorated with `@WebSocketGateway()` that handles WebSocket connections and messages [citation:1].",
    },
    {
      question: "What exception class should you use in a gateway?",
      options: ["`HttpException`", "`BadRequestException`", "`WsException`", "`NotFoundException`"],
      correctIndex: 2,
      explanation: "`WsException` is the correct exception for WebSocket gateways. HTTP exceptions do not work [citation:6].",
    },
    {
      question: "How do you register a gateway so it is instantiated?",
      options: [
        "Add it to the `controllers` array of a module.",
        "Add it to the `providers` array of a module.",
        "Import it in `main.ts`.",
        "It is instantiated automatically.",
      ],
      correctIndex: 1,
      explanation: "Gateways must be referenced in the `providers` array of a module. Otherwise, they are never instantiated [citation:1].",
    },
    {
      question: "What is a Socket.IO room?",
      options: [
        "A separate WebSocket server.",
        "A logical grouping of sockets within a namespace for targeted broadcasts.",
        "A database table.",
        "A type of namespace.",
      ],
      correctIndex: 1,
      explanation: "A room is a logical grouping of sockets. When you emit to a room, only sockets that have joined receive the message [citation:5][citation:10].",
    },
    {
      question: "How should you authenticate a Socket.IO connection?",
      options: [
        "On every message.",
        "At the handshake using JWT in `socket.handshake.auth`.",
        "By IP address only.",
        "By using HTTP Basic Auth.",
      ],
      correctIndex: 1,
      explanation: "WebSocket connections should be authenticated at the handshake. The client sends a JWT, and the server validates it before the connection is established [citation:5][citation:16].",
    },
    {
      question: "What is the default WebSocket adapter in NestJS?",
      options: ["WsAdapter", "IoAdapter (Socket.IO)", "Custom adapter", "No adapter"],
      correctIndex: 1,
      explanation: "IoAdapter (Socket.IO) is the default when `@nestjs/platform-socket.io` is installed [citation:1].",
    },
    {
      question: "Why would you use WsAdapter instead of IoAdapter?",
      options: [
        "You need rooms and namespaces.",
        "You need maximum performance and do not need rooms or namespaces.",
        "You need automatic reconnection.",
        "You need Redis scaling.",
      ],
      correctIndex: 1,
      explanation: "WsAdapter uses native ws, which is lighter and faster. It is ideal when you do not need rooms or namespaces [citation:8][citation:16].",
    },
    {
      question: "What is the main reason to extend IoAdapter?",
      options: [
        "To change the port.",
        "To add Redis for multi-pod scaling.",
        "To disable authentication.",
        "To use JSON parsing.",
      ],
      correctIndex: 1,
      explanation: "Extending IoAdapter is most commonly done to attach the Redis adapter, which distributes events across multiple pods [citation:7].",
    },
    {
      question: "When does `afterInit` run?",
      options: [
        "On every client connection.",
        "Once, after the gateway's server is initialized.",
        "On every message.",
        "On client disconnection.",
      ],
      correctIndex: 1,
      explanation: "`afterInit` runs once after the WebSocket server is created. It is the place to register middleware [citation:4].",
    },
    {
      question: "Where should WebSocket authentication happen?",
      options: [
        "In every message handler.",
        "At the handshake, using middleware registered in `afterInit`.",
        "In `handleDisconnect`.",
        "In the controller.",
      ],
      correctIndex: 1,
      explanation: "Authentication should happen at the handshake, before the connection is fully established [citation:10][citation:16].",
    },
    {
      question: "Why is cleanup important in `handleDisconnect`?",
      options: [
        "Because it makes the code shorter.",
        "Because without cleanup, memory leaks and stale state accumulate.",
        "Because NestJS requires it.",
        "Because it speeds up reconnection.",
      ],
      correctIndex: 1,
      explanation: "Disconnected users must be removed from online maps and room state. Without cleanup, memory grows and online status is wrong [citation:10].",
    },
    {
      question: "What is required for Socket.IO scaling with multiple pods?",
      options: [
        "Nothing — it scales automatically.",
        "A Redis adapter and sticky sessions (or disabled polling).",
        "A separate database.",
        "A load balancer only.",
      ],
      correctIndex: 1,
      explanation: "Multi-pod Socket.IO requires the Redis adapter to distribute events, and sticky sessions (or disabled polling) so requests hit the same pod [citation:7].",
    },
    {
      question: "What is the difference between a room and a namespace?",
      options: [
        "They are the same thing.",
        "A namespace is a separate communication channel; a room is a grouping within a namespace.",
        "A room is a separate server; a namespace is a grouping.",
        "Namespaces are only for Socket.IO; rooms are for raw WebSockets.",
      ],
      correctIndex: 1,
      explanation: "Namespaces are separate channels on one connection. Rooms are groupings within a namespace [citation:5].",
    },
    {
      question: "What should a gateway delegate to a service?",
      options: [
        "WebSocket connection handling.",
        "Authentication.",
        "Business logic.",
        "Room management.",
      ],
      correctIndex: 2,
      explanation: "Gateways should be thin. Business logic belongs in services. The gateway handles communication, the service handles the domain logic [citation:16].",
    },
    {
      question: "Why should you use a `Map` instead of an instance variable for per-user state in a gateway?",
      options: [
        "Because Maps are faster.",
        "Because gateways are singletons — instance variables are shared across all connections.",
        "Because TypeScript requires it.",
        "Because Maps are more secure.",
      ],
      correctIndex: 1,
      explanation: "Gateways are singletons. An instance variable is shared across all clients. Use a `Map` keyed by user or socket id [citation:12].",
    },
  ],
  project: {
    name: "Build a Real-Time Chat Backend with NestJS Gateways, Socket.IO, and Redis Scaling",
    goal:
      "Implement a production-grade WebSocket backend for a chat application using NestJS gateways. Cover authentication at the handshake, room-based messaging, lifecycle management, and Redis-based multi-pod scaling.",
    brief:
      "You are building the backend for a real-time chat application. Users connect, join conversation rooms, and exchange messages instantly. You must authenticate connections via JWT, manage online presence, handle rooms, and ensure the system scales across multiple pods. This project combines every concept from today's lessons.",
    steps: [
      "Create a NestJS project. Add `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`, `@nestjs/jwt`, and `ioredis`.",
      "Create a `ChatGateway` with namespace `chat`. Implement `OnGatewayInit`, `OnGatewayConnection`, and `OnGatewayDisconnect`.",
      "In `afterInit`, register middleware that validates a JWT from `socket.handshake.auth.token`. On success, attach `userId` to `socket.data`. On failure, reject with an error.",
      "In `handleConnection`, log the connection, add the user to an in-memory `onlineUsers` map (userId → socketId), and emit a `userOnline` event to all clients.",
      "In `handleDisconnect`, remove the user from the `onlineUsers` map and emit a `userOffline` event.",
      "Implement a `@SubscribeMessage('joinRoom')` handler that joins the client to a room. In production, validate that the user has access to the room.",
      "Implement a `@SubscribeMessage('leaveRoom')` handler that removes the client from the room.",
      "Implement a `@SubscribeMessage('sendMessage')` handler that broadcasts the message to the room using `this.server.to(roomId).emit('message', ...)`.",
      "Add a `RedisIoAdapter` that extends `IoAdapter` and attaches the `@socket.io/redis-adapter`. Call `connectToRedis()` in `main.ts` before `app.listen()`.",
      "Create a `ChatService` with methods like `saveMessage`, `getUserConversations`, and `validateRoomAccess`. Inject it into the gateway and use it in the message handlers.",
      "Write an e2e test using `socket.io-client` that connects with a valid JWT, joins a room, sends a message, and verifies the message is received by another client in the same room.",
      "Write an e2e test that attempts to connect without a token and verifies the connection is rejected.",
      "Write an e2e test that connects two clients, sends a message from one, and verifies the other receives it.",
    ],
    acceptance: [
      "A client with a valid JWT can connect, join a room, and send/receive messages.",
      "A client without a token is rejected at the handshake.",
      "Online presence is tracked correctly: users appear online on connect and offline on disconnect.",
      "Messages are broadcast only to clients in the same room.",
      "The Redis adapter is connected and ready for multi-pod scaling.",
      "The gateway delegates business logic to `ChatService`.",
      "All e2e tests pass.",
    ],
    stretch: [
      "Add a `typing` event that broadcasts when a user starts/stops typing in a room.",
      "Add a `markRead` event that updates the user's last-read timestamp and emits an unread count to the client.",
      "Implement `resyncUserRooms(userId)` that joins a user to all their conversation rooms without reconnecting. Call it when a user is added to a new conversation via HTTP.",
      "Add rate limiting to the `sendMessage` event using a simple in-memory counter per user.",
      "Add a `WsExceptionFilter` that catches `WsException` and sends a structured error to the client.",
      "Write a load test with `artillery` that connects 100 concurrent WebSocket clients and sends messages for 60 seconds. Measure message latency.",
    ],
  },
};
