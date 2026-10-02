import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_73_LESSONS: LessonDay = {
  day: 73,
  title: "WebSocket Authentication",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-73-lesson-1",
      title: "JWT Authentication",
      durationMinutes: 22,
      explanation: `
<b>You have built a chat application with NestJS gateways.</b> Users connect, join rooms, and exchange messages. Everything works. Then a security researcher sends you a message: "I connected to your WebSocket server without any credentials, joined a private room, and read every message." You check the code. The gateway handles messages correctly. But it never validated who was connecting. Anyone can open a WebSocket connection and start sending events.

This is the WebSocket authentication problem. It is one of the most common security holes in real-time applications, and it exists because WebSockets are fundamentally different from HTTP in how authentication works.

<b>Why WebSocket authentication is different from HTTP.</b> In HTTP, every request carries its own authentication headers. The server validates the token on every request. If the token is expired or invalid, the request is rejected. There is no "session" to manage — the server is stateless.

WebSocket is the opposite. The connection is established once, and then it stays open. There is no per-message authentication by default. If you do not authenticate during the handshake, the client is connected — and it can send any message to any handler.

This is why <b>JWT authentication at the handshake</b> is the standard pattern for WebSocket authentication. The client sends its JWT during the connection upgrade, the server validates it before accepting the connection, and the authenticated identity is attached to the socket for the life of the connection .

<b>Why JWT specifically?</b> Because it is the same mechanism your HTTP API uses. One authentication system, two transports. The client logs in via HTTP, receives a JWT, and uses the same JWT for both HTTP requests and WebSocket connections. This is the cleanest approach: one source of truth for authentication, one set of tokens to manage.

<b>How JWT authentication works at the handshake.</b> The client connects to the WebSocket server with the JWT in the connection options. Socket.IO provides a clean way to pass this:

\`\`\`typescript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIs...',
  },
});
\`\`\`

On the server, the token is available in \`socket.handshake.auth.token\`. You validate it in middleware registered in \`afterInit\` :

\`\`\`typescript
afterInit(server: Server) {
  server.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const payload = this.jwtService.verify(token);
      socket.data.userId = payload.sub;
      socket.data.email = payload.email;
      socket.data.role = payload.role;
      next(); // Accept the connection.
    } catch (err) {
      next(new Error('Invalid or expired token')); // Reject.
    }
  });
}
\`\`\`

<b>Why \`server.use()\` and not a guard?</b> This is a critical detail that trips up many developers. In NestJS WebSockets, <b>\`@UseGuards\` decorators do not run during the initial connection</b>. They only run before \`@SubscribeMessage\` handlers. If you want to reject a connection before it is established, you must use Socket.IO middleware via \`server.use()\` .

Guards are still useful — but for <b>authorization</b> (does this authenticated user have permission to perform this action?), not for authentication (is this user who they say they are?). The handshake middleware handles authentication. Guards handle per-message authorization.

<b>Where to put the token.</b> Socket.IO supports multiple places to send credentials. Each has trade-offs:

| Location | Access | Security |
|----------|--------|----------|
| \`auth\` payload | \`socket.handshake.auth.token\` | Recommended — not logged, not cached |
| \`Authorization\` header | \`socket.handshake.headers.authorization\` | Good — standard HTTP convention |
| Query string | \`socket.handshake.query.token\` | **Avoid** — logged by proxies, cached, visible in browser history |
| Cookie | \`socket.handshake.headers.cookie\` | OK if HTTP-only cookies are used, but requires cookie parsing |

The \`auth\` payload is the Socket.IO-recommended approach. It is sent during the handshake, not in the URL, and is not accessible to intermediaries.

<b>Attaching the user to the socket.</b> After validation, attach the decoded identity to \`socket.data\`. This is the Socket.IO v4 way and persists for the life of the connection:

\`\`\`typescript
socket.data.userId = payload.sub;
socket.data.email = payload.email;
socket.data.role = payload.role;
\`\`\`

Every subsequent message handler can then access \`client.data.userId\` without re-validating the token. This is the key efficiency win of handshake authentication: you validate once, and every message handler trusts the identity.

<b>Client-side error handling.</b> When the server rejects a connection, the client receives a \`connect_error\` event. The client should listen for this and decide how to respond:

\`\`\`typescript
socket.on('connect_error', (err) => {
  if (err.message === 'Invalid or expired token') {
    // Refresh the token and retry.
    refreshToken().then((newToken) => {
      socket.auth.token = newToken;
      socket.connect();
    });
  } else {
    // Redirect to login.
    window.location.href = '/login';
  }
});
\`\`\`

Without this handling, the client would silently fail to connect and the user would see a broken experience. Always handle \`connect_error\`.

<b>What can go wrong?</b>
- <b>No authentication at all.</b> The most common and most dangerous mistake. Any client can connect and send messages. If your handlers assume authentication, you have a security hole.
- <b>Authenticating per message instead of at handshake.</b> Wasteful (validation runs thousands of times per connection) and error-prone (short-lived tokens expire mid-connection, forcing awkward re-authentication flows).
- <b>Using an HTTP guard instead of Socket.IO middleware.</b> \`@UseGuards\` runs before message handlers, not before connections. The connection is accepted before the guard runs.
- <b>Sending the token in the query string.</b> Query strings are logged by proxies, cached by CDNs, and visible in browser history. Anyone with access to those logs can steal the token.
- <b>Using \`jwtService.decode()\` instead of \`jwtService.verify()\`.</b> \`decode()\` does not check the signature or expiration. It is not validation — it is just parsing.
- <b>Forgetting to handle token expiration.</b> A JWT that expires in 15 minutes will be rejected on the next reconnect. The client must refresh and retry.
- <b>Not using the same JWT secret as HTTP.</b> Two secrets mean two authentication systems. Use the same secret and the same \`JwtService\`.

<b>How this appears in a real application.</b> A NestJS application with both HTTP and WebSocket endpoints shares a single \`JwtService\`. The HTTP endpoints validate the token on every request via a \`JwtAuthGuard\`. The WebSocket gateway validates the same token during the handshake via \`server.use()\`. The client stores one JWT and uses it for both. When the token expires, both transports reject it, and the client refreshes via the HTTP \`/auth/refresh\` endpoint before retrying.

<b>How experienced engineers think.</b> The handshake is a security boundary. Treat it like a login endpoint: validate everything, reject invalid connections, and attach the authenticated identity to the socket. Everything after the handshake trusts that identity. This single principle prevents an entire class of WebSocket vulnerabilities and keeps authentication logic in one place.
      `,
      diagram: `
WebSocket JWT Authentication Flow

  Client                                Server
    |                                     |
    |-- POST /auth/login ---------------->|
    |<-- { accessToken: "jwt..." } -------|
    |                                     |
    |-- WebSocket connect --------------->|
    |   auth: { token: "jwt..." }         |
    |                                     |
    |                       +-------------------------------+
    |                       |  server.use() middleware      |
    |                       |  jwtService.verify(token)     |
    |                       +-------------------------------+
    |                                     |
    |          +--------------------------+--------------------------+
    |          |                                                     |
    |          v                                                     v
    |    Token valid                                           Token invalid
    |          |                                                     |
    |          v                                                     v
    |    socket.data.userId = payload                        next(new Error())
    |    next()                                              connection rejected
    |          |                                                     |
    |          v                                                     v
    |    handleConnection() runs                             Client receives
    |    Client is connected                                 "connect_error"
    |          |                                                     |
    |          v                                                     v
    |    Message handlers run                                Client refreshes token
    |    with client.data.userId                             and reconnects
    |          |
    |          v
    |    Every message trusts the identity
    |    (no re-validation per message)

  Critical rule:
    @UseGuards does NOT run during the initial connection.
    Use server.use() middleware for handshake authentication.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// JWT AUTHENTICATION FOR WEBSOCKETS
// ============================================

// Install:
// npm i --save @nestjs/websockets @nestjs/platform-socket.io socket.io @nestjs/jwt

// ---------- 1. Client sends JWT in auth payload ----------
// const socket = io('http://localhost:3000', {
//   auth: { token: 'eyJhbGciOiJIUzI1NiIs...' },
// });
//
// socket.on('connect_error', (err) => {
//   if (err.message === 'Invalid or expired token') {
//     refreshToken().then((newToken) => {
//       socket.auth.token = newToken;
//       socket.connect();
//     });
//   }
// });

// ---------- 2. Server validates JWT in afterInit middleware ----------
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class AuthGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AuthGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  // ============================================
  // HANDSHAKE AUTHENTICATION
  // ============================================
  afterInit(server: Server) {
    server.use((socket, next) => {
      // Extract the token from the auth payload.
      const token = socket.handshake.auth?.token;

      if (!token) {
        this.logger.warn('Connection rejected: no token provided');
        return next(new Error('Authentication token required'));
      }

      try {
        // verify() checks signature AND expiration.
        const payload = this.jwtService.verify(token);

        // Attach the authenticated user to the socket.
        // socket.data persists for the life of the connection.
        socket.data.userId = payload.sub;
        socket.data.email = payload.email;
        socket.data.role = payload.role;

        this.logger.log(\`Authenticated user \${payload.sub}\`);
        next(); // Accept the connection.
      } catch (err) {
        this.logger.warn(\`Connection rejected: \${err.message}\`);
        next(new Error('Invalid or expired token'));
      }
    });
  }

  // ============================================
  // HANDLE CONNECTION (runs only if authenticated)
  // ============================================
  handleConnection(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(\`User \${userId} connected (socket: \${client.id})\`);

    // The user is authenticated — safe to use client.data.userId.
    client.emit('authenticated', {
      userId,
      socketId: client.id,
      role: client.data.role,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(\`User \${client.data.userId} disconnected\`);
  }
}

// ---------- 3. Alternative: token in Authorization header ----------
afterInit(server: Server) {
  server.use((socket, next) => {
    const authHeader = socket.handshake.headers.authorization;
    const token = authHeader?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      return next(new Error('Missing Authorization header'));
    }

    try {
      const payload = this.jwtService.verify(token);
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });
}

// ---------- 4. Module setup with shared JwtService ----------
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [AuthGateway],
})
export class ChatModule {}

// ---------- 5. Client-side error handling ----------
// const socket = io('http://localhost:3000', {
//   auth: { token: localStorage.getItem('accessToken') },
// });
//
// socket.on('connect_error', async (err) => {
//   if (err.message === 'Invalid or expired token') {
//     try {
//       const newToken = await refreshAccessToken();
//       socket.auth.token = newToken;
//       socket.connect();
//     } catch {
//       window.location.href = '/login';
//     }
//   } else if (err.message === 'Authentication token required') {
//     window.location.href = '/login';
//   }
// });

// ---------- 6. What NOT to do ----------
// BAD: No authentication at all.
// afterInit(server) { /* nothing */ }
// Any client can connect and send messages.

// BAD: Token in the query string.
// const socket = io('http://localhost:3000?token=jwt...');
// Query strings are logged, cached, and visible in browser history.

// BAD: Using @UseGuards for handshake authentication.
// @UseGuards(JwtAuthGuard)
// @WebSocketGateway()
// export class ChatGateway {}
// The guard does NOT run during the connection. It runs before message handlers.

// BAD: Using decode() instead of verify().
// const payload = this.jwtService.decode(token);
// decode() does not check the signature or expiration. Anyone can forge a token.
      ` },
      keyTakeaways: [
        "WebSocket connections are not authenticated by default — you must authenticate during the handshake.",
        "Use JWT in the handshake because it is the same mechanism your HTTP API already uses.",
        "Send the token via `socket.handshake.auth.token` — never in the query string.",
        "Register `server.use()` middleware in `afterInit` to validate the token before accepting the connection.",
        "`@UseGuards` does not run during the initial connection — use middleware for handshake authentication.",
        "Attach the decoded identity to `socket.data` so every message handler can access it without re-validation.",
        "Handle `connect_error` on the client to refresh expired tokens or redirect to login.",
      ],
      commonMistakes: [
        "<b>No authentication at all.</b> The most common and most dangerous mistake. Any client can connect and send messages.",
        "<b>Authenticating per message instead of at handshake.</b> Wasteful and error-prone. Short-lived tokens expire mid-connection.",
        "<b>Using `@UseGuards` for handshake authentication.</b> Guards run before message handlers, not before connections. The connection is accepted before the guard runs.",
        "<b>Sending the token in the query string.</b> Query strings are logged by proxies, cached by CDNs, and visible in browser history.",
        "<b>Using `jwtService.decode()` instead of `jwtService.verify()`.</b> `decode()` does not check the signature or expiration. It is not validation.",
        "<b>Not handling token expiration.</b> A JWT that expires will be rejected on the next reconnect. The client must refresh and retry.",
        "<b>Using a different JWT secret for WebSocket.</b> Two secrets mean two authentication systems. Use the same secret and the same `JwtService`.",
      ],
      quiz: [
        {
          question:
            "Why should WebSocket authentication happen at the handshake rather than per message?",
          options: [
            "Because WebSocket messages cannot carry tokens.",
            "Because the handshake is the only moment to reject a connection before it is established, and per-message validation is wasteful.",
            "Because NestJS requires it.",
            "Because tokens expire too quickly for messages.",
          ],
          correctIndex: 1,
          explanation:
            "The handshake is the security boundary. Validating once rejects invalid connections early and avoids running validation logic on every message .",
        },
        {
          question:
            "Where should the client send the JWT when connecting via Socket.IO?",
          options: [
            "In the URL query string.",
            "In the `auth` payload of the connection options.",
            "In the message body of the first message.",
            "In a cookie only.",
          ],
          correctIndex: 1,
          explanation:
            "Socket.IO provides the `auth` object in the connection options specifically for authentication data. It is accessible on the server via `socket.handshake.auth` .",
        },
        {
          question:
            "Why does `@UseGuards` not work for handshake authentication in WebSockets?",
          options: [
            "Because guards are deprecated.",
            "Because guards run before `@SubscribeMessage` handlers, not before the connection is established.",
            "Because guards only work with HTTP.",
            "Because guards cannot access `socket.data`.",
          ],
          correctIndex: 1,
          explanation:
            "NestJS guards run before message handlers, not during the connection handshake. By the time a guard runs, the connection has already been accepted. Use `server.use()` middleware instead.",
        },
        {
          question:
            "What is the difference between `jwtService.decode()` and `jwtService.verify()`?",
          options: [
            "They are aliases.",
            "`decode()` parses the token without checking the signature or expiration; `verify()` validates both.",
            "`decode()` is for WebSockets; `verify()` is for HTTP.",
            "`decode()` is faster and should be preferred.",
          ],
          correctIndex: 1,
          explanation:
            "`decode()` simply parses the JWT payload. It does not check the signature or expiration, so anyone can forge a token. Always use `verify()` for authentication.",
        },
      ],
    },
    {
      id: "day-73-lesson-2",
      title: "Connection Authorization",
      durationMinutes: 22,
      explanation: `
<b>JWT authentication proves who the user is.</b> But proving identity is only half the story. Connection authorization answers a different question: "Should this specific user be allowed to establish this connection at all?"

Consider a few scenarios:

- A user whose account has been disabled still has a valid JWT. Authentication succeeds, but the connection should be rejected.
- A user whose subscription expired should not be able to open a WebSocket connection to a premium feature.
- A user who was banned from a specific service should be blocked at the connection level, not just at the message level.
- A user with a valid token but a revoked session (logged out on another device) should be denied.

All of these are <b>connection authorization</b> concerns. They go beyond token validation and require checking the user's current state in your system.

<b>Where connection authorization happens.</b> In the same \`server.use()\` middleware where you validate the JWT. After verifying the token, before calling \`next()\`, you have the opportunity to run any additional checks :

\`\`\`typescript
server.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication token required'));
  }

  let payload;
  try {
    payload = this.jwtService.verify(token);
  } catch {
    return next(new Error('Invalid or expired token'));
  }

  // Authorization: check the user's current state.
  const user = await this.usersService.findById(payload.sub);
  if (!user) {
    return next(new Error('User not found'));
  }
  if (!user.enabled) {
    return next(new Error('User account is disabled'));
  }
  if (!user.hasActiveSubscription && this.isPremiumFeature) {
    return next(new Error('Subscription required'));
  }

  // Attach the fresh user data to the socket.
  socket.data.userId = user.id;
  socket.data.email = user.email;
  socket.data.role = user.role;
  next();
});
\`\`\`

The key insight: <b>the JWT is a snapshot of the user at login time</b>. Between login and connection, the user's state may have changed. Connection authorization re-reads the current state and decides whether the connection should be allowed.

<b>Why check the database at the handshake?</b> Because JWTs are stateless — they carry whatever claims were signed at login time. If a user's role changes from "user" to "banned" after they logged in, their existing JWT still says "user". Only a database lookup at connection time catches this .

There is a trade-off. A database query on every WebSocket connection adds latency and load. Under a connection storm (e.g. after a server restart, when thousands of clients reconnect simultaneously), the database becomes a bottleneck. Some options:

- <b>Only check the token, not the database.</b> Fastest, but does not catch state changes. Acceptable if the JWT lifetime is short (e.g. 15 minutes) and the blast radius of a stale token is small.
- <b>Check a fast cache (Redis) instead of the database.</b> The cache holds a "user status" record that is invalidated when the user's state changes.
- <b>Check the database only for sensitive namespaces.</b> A general chat namespace skips the DB check; an admin namespace requires it.
- <b>Check the database only on reconnection, not on every new connection.</b> Use the socket id to detect whether this is a first connection or a reconnect.

<b>Detecting revoked tokens.</b> A common authorization requirement is: "if the user logs out on another device, their WebSocket connections should be closed." JWT alone does not support this — a JWT is valid until it expires. To revoke tokens, you need a server-side token store (Redis or a database table) that tracks active sessions. At connection time, verify that the token's session id is still in the active sessions list :

\`\`\`typescript
const sessionId = payload.sid; // Session id embedded in the JWT.
const session = await this.sessionStore.get(sessionId);

if (!session || session.revoked) {
  return next(new Error('Session revoked'));
}
\`\`\`

For active connections, you need to close them when the session is revoked. Store a mapping of \`sessionId -> socketIds\`, and on revocation, call \`socket.disconnect(true)\` for each socket in that session.

<b>Handling the client experience.</b> When the server rejects a connection, the client receives a \`connect_error\` with the error message. Different error messages should trigger different client behaviors:

| Error message | Client action |
|---------------|---------------|
| "Authentication token required" | Redirect to login |
| "Invalid or expired token" | Refresh token and retry |
| "User account is disabled" | Show message, do not retry |
| "Subscription required" | Redirect to billing page |
| "Session revoked" | Redirect to login |

The client should distinguish these cases rather than treating every \`connect_error\` the same way. A generic "could not connect" message frustrates users when the real cause is fixable .

<b>What can go wrong?</b>
- <b>Only checking the token, not the current user state.</b> A banned or disabled user can still connect with a valid JWT until it expires.
- <b>Querying the database on every connection under high load.</b> A connection storm can overwhelm the database. Use a cache or skip the check for non-sensitive namespaces.
- <b>Not handling revoked sessions.</b> If you do not track sessions, you cannot close connections when a user logs out.
- <b>Using HTTP exceptions in the middleware.</b> \`throw new UnauthorizedException()\` inside \`server.use()\` does not work. Use \`next(new Error(...))\` to reject the connection.
- <b>Leaking detailed error messages to the client.</b> "User 42 was banned for TOS violation" is more information than the client needs. Use generic messages like "Account disabled" .
- <b>Assuming the client will always provide a valid token.</b> The client might send garbage, an old token, or a token from a different application. Handle every case.

<b>How this appears in a real application.</b> A SaaS chat application:
- JWT lifetime is 1 hour.
- On connection, the middleware validates the JWT and queries Redis for the user's current plan and status (Free, Pro, Banned).
- Banned users are rejected with "Account suspended."
- Free users can connect to public channels but not to premium channels.
- When a user is banned by support, their user id is added to a Redis blacklist, and all their active sockets are disconnected.
- When a user logs out, their session id is removed from Redis, and all sockets for that session are disconnected.

<b>How experienced engineers think.</b> Authentication is a moment in time; authorization is continuous. A JWT proves the user's identity at login. But the user's rights, status, and session state evolve. Connection authorization is the layer that reconciles the token's claims with the current reality. It runs at the handshake, but the state it checks is refreshed from a fast store. When the state changes, active connections are closed. This is what makes a real-time system secure, not just authenticated.
      `,
      diagram: `
Connection Authorization Flow

  Client connects with JWT
        |
        v
  +-------------------------------+
  |  server.use() middleware      |
  |                               |
  |  1. Extract token             |
  |  2. jwtService.verify()       |
  |  3. Check user state (Redis)  |
  |  4. Check session is active   |
  |  5. Check authorization rules |
  +-------------------------------+
        |
        +-- All checks pass ---> next() -> connection accepted
        |
        +-- Any check fails --> next(new Error(...)) -> rejected
                                    |
                                    v
                              Client receives
                              "connect_error"
                                    |
                                    v
                              Client decides:
                                - refresh token?
                                - redirect to login?
                                - show error?

  Checks performed:
    - Token valid and not expired
    - User exists in the system
    - User account is enabled
    - Session has not been revoked
    - User has required permissions (role, plan, etc.)

  Trade-offs:
    - DB query per connection: accurate but slow under load
    - Redis cache: fast, requires cache invalidation
    - No DB check: fastest, stale tokens possible until expiry
      `,
      codeExample: { title: "Example", code: `
// ============================================
// CONNECTION AUTHORIZATION FOR WEBSOCKETS
// ============================================

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';

@WebSocketGateway({ namespace: 'premium', cors: { origin: '*' } })
export class AuthorizedGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AuthorizedGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly sessionStore: SessionStoreService, // Redis-backed
    private readonly redis: Redis,
  ) {}

  // ============================================
  // HANDSHAKE: AUTHENTICATION + AUTHORIZATION
  // ============================================
  afterInit(server: Server) {
    server.use(async (socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      // 1. Verify the JWT (authentication).
      let payload: { sub: string; sid: string; email: string };
      try {
        payload = this.jwtService.verify(token);
      } catch {
        return next(new Error('Invalid or expired token'));
      }

      // 2. Check the user's current state (authorization).
      //    Use a Redis cache instead of the database for speed.
      const user = await this.usersService.getCachedUser(payload.sub);
      if (!user) {
        return next(new Error('User not found'));
      }
      if (user.status === 'banned') {
        this.logger.warn(\`Banned user \${user.id} attempted to connect\`);
        return next(new Error('Account suspended'));
      }
      if (user.status === 'disabled') {
        return next(new Error('Account disabled'));
      }

      // 3. Check the session is still active (revocation).
      const session = await this.sessionStore.get(payload.sid);
      if (!session || session.revoked) {
        return next(new Error('Session revoked. Please log in again.'));
      }

      // 4. Check authorization rules (plan, role, etc.).
      if (!user.hasPremiumAccess) {
        return next(new Error('Premium subscription required'));
      }

      // 5. Attach fresh user data to the socket.
      socket.data.userId = user.id;
      socket.data.email = user.email;
      socket.data.role = user.role;
      socket.data.plan = user.plan;
      socket.data.sessionId = payload.sid;

      // 6. Track this socket in the session store.
      await this.sessionStore.addSocket(payload.sid, socket.id);

      this.logger.log(\`User \${user.id} (plan: \${user.plan}) connected\`);
      next();
    });
  }

  handleConnection(client: Socket) {
    client.emit('authorized', {
      userId: client.data.userId,
      plan: client.data.plan,
    });
  }
}

// ============================================
// SESSION STORE (Redis-backed)
// ============================================
@Injectable()
export class SessionStoreService {
  constructor(private readonly redis: Redis) {}

  async get(sessionId: string): Promise<{ revoked: boolean } | null> {
    const data = await this.redis.get(\`session:\${sessionId}\`);
    return data ? JSON.parse(data) : null;
  }

  async revoke(sessionId: string): Promise<void> {
    await this.redis.set(
      \`session:\${sessionId}\`,
      JSON.stringify({ revoked: true }),
      'EX',
      86400,
    );
  }

  async addSocket(sessionId: string, socketId: string): Promise<void> {
    await this.redis.sadd(\`session_sockets:\${sessionId}\`, socketId);
  }

  async removeSocket(sessionId: string, socketId: string): Promise<void> {
    await this.redis.srem(\`session_sockets:\${sessionId}\`, socketId);
  }

  async getSockets(sessionId: string): Promise<string[]> {
    return this.redis.smembers(\`session_sockets:\${sessionId}\`);
  }
}

// ============================================
// REVOKING A SESSION (e.g. on logout or ban)
// ============================================
@Injectable()
export class SessionService {
  constructor(
    private readonly sessionStore: SessionStoreService,
    @Inject('WS_SERVER') private readonly wsServer: Server,
  ) {}

  async revokeSession(sessionId: string): Promise<void> {
    // 1. Mark the session as revoked in Redis.
    await this.sessionStore.revoke(sessionId);

    // 2. Force-disconnect all sockets belonging to this session.
    const socketIds = await this.sessionStore.getSockets(sessionId);
    for (const socketId of socketIds) {
      const socket = this.wsServer.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('sessionRevoked', { reason: 'Logged out elsewhere' });
        socket.disconnect(true);
      }
    }
  }
}

// ============================================
// CLIENT-SIDE ERROR HANDLING
// ============================================
// socket.on('connect_error', async (err) => {
//   switch (err.message) {
//     case 'Authentication token required':
//     case 'Session revoked. Please log in again.':
//       window.location.href = '/login';
//       break;
//
//     case 'Invalid or expired token':
//       const newToken = await refreshAccessToken();
//       socket.auth.token = newToken;
//       socket.connect();
//       break;
//
//     case 'Account suspended':
//     case 'Account disabled':
//       showMessage('Your account is not active. Contact support.');
//       break;
//
//     case 'Premium subscription required':
//       window.location.href = '/billing';
//       break;
//
//     default:
//       showMessage('Could not connect. Please try again later.');
//   }
// });

// ============================================
// WHAT NOT TO DO
// ============================================

// BAD: Only verifying the token, not the user's current state.
// const payload = this.jwtService.verify(token);
// socket.data.userId = payload.sub;
// next();
// A banned user with a valid token can still connect.

// BAD: Using HTTP exceptions in the middleware.
// throw new UnauthorizedException();
// This does not reject the WebSocket connection. Use next(new Error()).

// BAD: Leaking detailed error messages.
// next(new Error('User 42 was banned for TOS violation on 2024-01-15'));
// Use generic messages.

// BAD: Querying the database on every connection under load.
// Use a cache (Redis) or skip the check for non-sensitive namespaces.
      ` },
      keyTakeaways: [
        "Connection authorization goes beyond JWT validation — it checks the user's current state at connection time.",
        "JWTs are snapshots of the user at login. Re-read the current state from a fast store (Redis) at connection time.",
        "Session revocation requires server-side tracking (Redis) — JWTs cannot be revoked before they expire.",
        "Reject connections with `next(new Error(...))`, not by throwing HTTP exceptions.",
        "Use specific error messages so the client can decide whether to refresh, redirect, or show a message.",
        "Cache user state in Redis to avoid overwhelming the database during connection storms.",
        "When a session is revoked, disconnect all its sockets — do not wait for the tokens to expire.",
      ],
      commonMistakes: [
        "<b>Only checking the token, not the current user state.</b> A banned or disabled user can still connect with a valid JWT until it expires.",
        "<b>Querying the database on every connection under high load.</b> A connection storm can overwhelm the database. Use a cache.",
        "<b>Not handling revoked sessions.</b> If you do not track sessions, you cannot close connections when a user logs out.",
        "<b>Using HTTP exceptions in the middleware.</b> `throw new UnauthorizedException()` does not work inside `server.use()`. Use `next(new Error(...))`.",
        "<b>Leaking detailed error messages to the client.</b> Use generic messages that do not reveal internal details.",
        "<b>Assuming the client will always provide a valid token.</b> Handle garbage tokens, expired tokens, and tokens from other applications.",
      ],
      quiz: [
        {
          question:
            "Why is checking the user's state at connection time important if you already validate the JWT?",
          options: [
            "Because JWTs can be forged.",
            "Because a JWT is a snapshot from login time; the user's status may have changed since then (banned, disabled, subscription expired).",
            "Because JWTs expire too quickly.",
            "Because JWTs do not contain the user id.",
          ],
          correctIndex: 1,
          explanation:
            "JWTs carry claims signed at login. If the user's state changes (e.g. banned), the JWT still says the old state. Only a database or cache lookup at connection time catches this .",
        },
        {
          question:
            "How should the server reject a WebSocket connection in the middleware?",
          options: [
            "Throw an `UnauthorizedException`.",
            "Call `next(new Error('message'))`.",
            "Send an HTTP 401 response.",
            "Call `socket.disconnect()`.",
          ],
          correctIndex: 1,
          explanation:
            "Inside `server.use()` middleware, rejections are signaled by calling `next(new Error('message'))`. Throwing HTTP exceptions does not work in this context .",
        },
        {
          question:
            "What is required to revoke a WebSocket session before the JWT expires?",
          options: [
            "Nothing — JWTs expire automatically.",
            "A server-side session store (e.g. Redis) that tracks active sessions and can mark them as revoked.",
            "A new JWT with a shorter expiry.",
            "Restarting the WebSocket server.",
          ],
          correctIndex: 1,
          explanation:
            "JWTs cannot be revoked before their expiration without a server-side store. Use Redis to track session state and check it at connection time.",
        },
        {
          question:
            "Why is a database query on every WebSocket connection potentially problematic?",
          options: [
            "Because databases cannot handle WebSocket connections.",
            "Because a connection storm (e.g. after a server restart) can overwhelm the database with simultaneous queries.",
            "Because the database does not support async queries.",
            "Because the JWT already contains the user state.",
          ],
          correctIndex: 1,
          explanation:
            "During a connection storm, thousands of clients reconnect at once. If each connection triggers a database query, the database becomes a bottleneck. Use a cache or skip the check for non-sensitive namespaces.",
        },
      ],
    },
    {
      id: "day-73-lesson-3",
      title: "Room Authorization",
      durationMinutes: 22,
      explanation: `
<b>Rooms are the primary mechanism for organizing WebSocket communication.</b> A chat conversation is a room. A collaborative document is a room. A notification channel per user is a room. Rooms let you broadcast events to a subset of connected clients without tracking individual socket ids.

But rooms are also where the most common WebSocket authorization bug lives. <b>A room is not a security mechanism.</b> It is a grouping. Any client can call \`client.join(anyRoom)\` unless you explicitly validate the join. If you trust that a client only joins rooms they are allowed to join, you have a vulnerability .

<b>The problem, concretely.</b> Imagine a chat application where each conversation is a room named \`conversation:{id}\`. A user opens the app, connects, and sends \`{ event: 'joinRoom', data: 'conversation:999' }\`. If your handler is simply:

\`\`\`typescript
@SubscribeMessage('joinRoom')
handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
  client.join(roomId);
  return { joined: roomId };
}
\`\`\`

Then the user has just joined conversation 999 — a conversation they may not be a member of. From that moment, every message in that conversation is broadcast to them. They have read access to a private conversation. This is a serious data leak.

<b>The fix: validate room membership before joining.</b> The handler must check whether the authenticated user has permission to access the requested room :

\`\`\`typescript
@SubscribeMessage('joinRoom')
async handleJoinRoom(
  @MessageBody() roomId: string,
  @ConnectedSocket() client: Socket,
) {
  const userId = client.data.userId;

  // Validate access before joining.
  const hasAccess = await this.conversationsService.isMember(roomId, userId);
  if (!hasAccess) {
    throw new WsException('Access denied to this room');
  }

  client.join(roomId);
  client.to(roomId).emit('userJoined', { userId });
  return { joined: roomId };
}
\`\`\`

The key principle: <b>the client tells you what it wants; the server decides what it is allowed.</b> The client's request to join a room is a request, not a command.

<b>What to validate.</b> Depending on the application, room access may depend on:

- <b>Membership:</b> is the user a member of this conversation, project, or document?
- <b>Role:</b> does the user have the required role (admin, editor, viewer)?
- <b>Plan:</b> does the user's subscription include access to premium rooms?
- <b>Tenant:</b> is the room within the user's organization?
- <b>Time window:</b> is the room active (e.g. not archived or expired)?

The validation logic belongs in a service, not the gateway. The gateway calls the service, which queries the database (or a cache) and returns a boolean or the user's role :

\`\`\`typescript
// In the service:
async canUserAccessRoom(roomId: string, userId: string): Promise<boolean> {
  const room = await this.roomRepo.findOne({ where: { id: roomId } });
  if (!room) return false;
  if (room.isPrivate && !room.members.includes(userId)) return false;
  if (room.tenantId !== await this.getUserTenant(userId)) return false;
  return true;
}
\`\`\`

<b>Double-check on every message.</b> Even after a client has joined a room, you should not assume all its future messages are authorized. Two reasons:

1. <b>The client's permissions may have changed.</b> If the user was removed from the conversation after joining, they are still in the room until they leave. Messages they send should be rejected.
2. <b>The client may forge events.</b> A malicious client can send \`{ event: 'sendMessage', data: { roomId: 'conversation:999', text: '...' } }\` without ever calling \`joinRoom\`. If your handler only checks room membership indirectly (e.g. by broadcasting to the room), you may end up processing unauthorized messages.

The fix: <b>verify room membership inside every message handler</b> that operates on a room:

\`\`\`typescript
@SubscribeMessage('sendMessage')
async handleMessage(
  @MessageBody() data: { roomId: string; text: string },
  @ConnectedSocket() client: Socket,
) {
  // Check the client is actually in the room.
  if (!client.rooms.has(data.roomId)) {
    throw new WsException('You are not a member of this room');
  }

  // Optionally re-check authorization.
  const stillHasAccess = await this.conversationsService.isMember(
    data.roomId,
    client.data.userId,
  );
  if (!stillHasAccess) {
    client.leave(data.roomId); // Clean up the stale membership.
    throw new WsException('Access revoked');
  }

  // Proceed with the message.
  this.server.to(data.roomId).emit('message', {
    userId: client.data.userId,
    text: data.text,
  });
}
\`\`\`

The \`client.rooms.has()\` check is fast and catches the "client never joined" case. The service check catches the "membership was revoked" case. Together, they cover both attack vectors.

<b>Removing users from rooms.</b> When a user is removed from a conversation or loses access to a document, they should be removed from the room. There are two approaches:

- <b>Passive:</b> Check membership on every message. The user stays in the room but cannot send or receive meaningful content.
- <b>Active:</b> When the membership change happens, explicitly call \`client.leave(roomId)\` for all their sockets. This removes them immediately.

Active removal is cleaner for high-security scenarios. It requires a mapping from user id to socket ids, so you can find and disconnect all their connections:

\`\`\`typescript
async removeUserFromRoom(userId: string, roomId: string) {
  // Find all sockets for this user.
  const sockets = await this.getSocketsForUser(userId);
  for (const socketId of sockets) {
    const socket = this.server.sockets.sockets.get(socketId);
    if (socket) {
      socket.leave(roomId);
      socket.emit('removedFromRoom', { roomId });
    }
  }
}
\`\`\`

<b>Rooms with namespaced access.</b> Some applications have different access rules for different rooms:

- Public rooms: anyone can join.
- Private rooms: only members.
- Admin rooms: only users with the admin role.

The validation function should be aware of these differences:

\`\`\`typescript
async canUserJoinRoom(roomId: string, userId: string): Promise<boolean> {
  const room = await this.roomRepo.findOne({ where: { id: roomId } });
  if (!room) return false;

  switch (room.type) {
    case 'public':
      return true;

    case 'private':
      return this.membersService.isMember(roomId, userId);

    case 'admin':
      const user = await this.usersService.findById(userId);
      return user?.role === 'admin';

    default:
      return false;
  }
}
\`\`\`

<b>What can go wrong?</b>
- <b>Not validating room membership on join.</b> Any client can join any room by guessing the room id. This is the most common WebSocket security bug.
- <b>Only validating on join, not on every message.</b> A user removed from a room can still send messages until they disconnect.
- <b>Trusting a client-supplied room name.</b> If the room id comes from the client without validation, an attacker can craft room names to target other users' conversations.
- <b>Using a room name that leaks information.</b> \`user:{email}\` as a room name exposes emails in logs. Use \`user:{userId}\` instead.
- <b>Forgetting to remove users from rooms when their access is revoked.</b> Passive checks work, but active removal is cleaner for security-sensitive scenarios.
- <b>Validating in the gateway instead of a service.</b> Authorization logic belongs in a service so it can be reused for HTTP endpoints and tested independently.
- <b>Assuming rooms are private.</b> Rooms are shared by design. They are a grouping mechanism, not a security boundary.

<b>How this appears in a real application.</b> A Slack-like application:
- Each channel is a room \`channel:{channelId}\`.
- Each direct message is a room \`dm:{conversationId}\`.
- On connect, the client requests to join channels. The server validates that the user is a member of each.
- When a message is sent, the handler re-checks that the user is still a member.
- When a user is removed from a channel, all their sockets are removed from the room and they receive a \`removedFromChannel\` event.
- Admins can be in \`admin:{workspaceId}\` rooms, validated by role.

<b>How experienced engineers think.</b> Rooms are an optimization for broadcast, not a security boundary. Every room join is a permission decision, and every message is an authorization check. The client is untrusted — it tells you what it wants, and the server decides what is allowed. This dual validation (join + message) is the correct pattern for any real-time application that handles sensitive data.
      `,
      diagram: `
Room Authorization Flow

  Client                            Server
    |                                 |
    |-- emit 'joinRoom' ------------->|
    |   { roomId: 'conversation:999' }|
    |                                 |
    |                    +---------------------------+
    |                    | Validate access:          |
    |                    | canUserAccessRoom(        |
    |                    |   'conversation:999',     |
    |                    |   'user:42'               |
    |                    | )                          |
    |                    +---------------------------+
    |                                 |
    |         +-----------------------+-----------------------+
    |         |                                               |
    |         v                                               v
    |   Has access                                      No access
    |         |                                               |
    |         v                                               v
    |   client.join(roomId)                        throw WsException
    |   Broadcast 'userJoined'                     Client receives error
    |         |
    |         v
    |   Client is in room
    |         |
    |         v
    |   Later: client sends 'sendMessage' with roomId
    |         |
    |         v
    |   Server re-checks:
    |     - Is client still in the room? (client.rooms.has)
    |     - Is membership still valid? (service check)
    |         |
    |         v
    |   Only if both pass: broadcast message

  Security rules:
    1. Validate on join (prevent unauthorized joins)
    2. Validate on every message (catch revoked access)
    3. Validate in a service, not the gateway
    4. Use userId in room names, never email or username
    5. Actively remove users from rooms when access is revoked
      `,
      codeExample: { title: "Example", code: `
// ============================================
// ROOM AUTHORIZATION IN NESTJS
// ============================================

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { Injectable, Logger } from '@nestjs/common';

// ============================================
// CONVERSATIONS SERVICE (authorization logic)
// ============================================
@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
  ) {}

  async canUserAccessRoom(roomId: string, userId: string): Promise<boolean> {
    // Room ids look like "conversation:123" or "dm:456".
    const [type, id] = roomId.split(':');

    if (type === 'conversation') {
      const membership = await this.membershipRepo.findOne({
        where: { conversationId: Number(id), userId },
      });
      return !!membership;
    }

    if (type === 'dm') {
      const conversation = await this.conversationRepo.findOne({
        where: { id: Number(id) },
      });
      return (
        conversation?.participantA === userId ||
        conversation?.participantB === userId
      );
    }

    return false;
  }
}

// ============================================
// GATEWAY WITH ROOM AUTHORIZATION
// ============================================
@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(private readonly conversationsService: ConversationsService) {}

  handleConnection(client: Socket) {
    const userId = client.data.userId;

    // Track this socket for the user.
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(client.id);

    // Join the user's personal room.
    client.join(\`user:\${userId}\`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  // ============================================
  // JOIN ROOM: VALIDATE ACCESS FIRST
  // ============================================
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    // Validate access before joining.
    const hasAccess = await this.conversationsService.canUserAccessRoom(
      data.roomId,
      userId,
    );

    if (!hasAccess) {
      this.logger.warn(
        \`User \${userId} denied access to room \${data.roomId}\`,
      );
      throw new WsException('Access denied to this room');
    }

    client.join(data.roomId);

    // Notify others in the room.
    client.to(data.roomId).emit('userJoined', {
      userId,
      roomId: data.roomId,
    });

    return { joined: data.roomId };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomId);
    client.to(data.roomId).emit('userLeft', {
      userId: client.data.userId,
      roomId: data.roomId,
    });
    return { left: data.roomId };
  }

  // ============================================
  // SEND MESSAGE: RE-VALIDATE ACCESS
  // ============================================
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Check 1: Is the client actually in the room?
    if (!client.rooms.has(data.roomId)) {
      throw new WsException('You are not a member of this room');
    }

    // Check 2: Is the user still authorized?
    const stillHasAccess = await this.conversationsService.canUserAccessRoom(
      data.roomId,
      client.data.userId,
    );

    if (!stillHasAccess) {
      // Clean up the stale membership.
      client.leave(data.roomId);
      throw new WsException('Access to this room has been revoked');
    }

    // Broadcast to the room (excluding the sender).
    client.to(data.roomId).emit('message', {
      userId: client.data.userId,
      text: data.text,
      timestamp: new Date().toISOString(),
    });

    return { sent: true };
  }

  // ============================================
  // REMOVE A USER FROM A ROOM (called from a service)
  // ============================================
  async removeUserFromRoom(userId: string, roomId: string): Promise<void> {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;

    for (const socketId of sockets) {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        socket.leave(roomId);
        socket.emit('removedFromRoom', {
          roomId,
          reason: 'Access revoked',
        });
      }
    }

    this.logger.log(\`User \${userId} removed from room \${roomId}\`);
  }
}

// ============================================
// HTTP ENDPOINT: REMOVING A USER FROM A CONVERSATION
// ============================================
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Delete(':id/members/:userId')
  @UseGuards(JwtAuthGuard)
  async removeMember(
    @Param('id') conversationId: string,
    @Param('userId') userId: string,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    // Only admins or the conversation owner can remove members.
    const canRemove = await this.conversationsService.canRemoveMember(
      conversationId,
      currentUser.id,
      userId,
    );
    if (!canRemove) throw new ForbiddenException();

    // Remove the member from the database.
    await this.conversationsService.removeMember(conversationId, userId);

    // Actively remove their sockets from the room.
    await this.chatGateway.removeUserFromRoom(
      userId,
      \`conversation:\${conversationId}\`,
    );

    return { removed: true };
  }
}

// ============================================
// WHAT NOT TO DO
// ============================================

// BAD: Trust the client's room id without validation.
// @SubscribeMessage('joinRoom')
// handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
//   client.join(roomId); // Any client can join any room!
//   return { joined: roomId };
// }

// BAD: Only validate on join, not on send.
// A user removed from a room can still send messages.

// BAD: Room names that leak information.
// client.join(\`user:\${user.email}\`); // Email in room name -> in logs.
// client.join(\`user:\${userId}\`);     // Better.

// BAD: Doing authorization in the gateway.
// Move it to a service so HTTP endpoints can reuse it.
      ` },
      keyTakeaways: [
        "A room is a grouping mechanism, not a security boundary. Any client can join any room unless you validate.",
        "Always validate room membership before calling `client.join()` — the client's request is untrusted.",
        "Re-validate authorization on every message that operates on a room, not just on join.",
        "Use `client.rooms.has(roomId)` as a fast check, then a service call for the authoritative check.",
        "Put authorization logic in a service so it can be reused by HTTP endpoints and tested independently.",
        "Actively remove users from rooms when their access is revoked — do not wait for them to disconnect.",
        "Use `userId` in room names, never email or username, to avoid leaking information in logs.",
      ],
      commonMistakes: [
        "<b>Not validating room membership on join.</b> Any client can join any room by guessing the room id. This is the most common WebSocket security bug.",
        "<b>Only validating on join, not on every message.</b> A user removed from a room can still send messages until they disconnect.",
        "<b>Trusting a client-supplied room name.</b> An attacker can craft room names to target other users' conversations.",
        "<b>Using a room name that leaks information.</b> `user:{email}` exposes emails in logs. Use `user:{userId}`.",
        "<b>Validating in the gateway instead of a service.</b> Authorization logic belongs in a service for reuse and testability.",
        "<b>Assuming rooms are private.</b> Rooms are shared by design. They group sockets; they do not secure them.",
      ],
      quiz: [
        {
          question:
            "Why is it dangerous to call `client.join(roomId)` without validation?",
          options: [
            "Because it uses too much memory.",
            "Because any client can join any room by guessing the room id, gaining access to messages they should not see.",
            "Because it disconnects other clients.",
            "Because it slows down the server.",
          ],
          correctIndex: 1,
          explanation:
            "Rooms are not a security mechanism. Without validation, any client can join any room and receive its broadcasts. This is a serious data leak.",
        },
        {
          question:
            "Why should you re-validate room authorization on every message, not just on join?",
          options: [
            "Because join is unreliable.",
            "Because a user's access may be revoked after they join, and a malicious client can forge messages without ever calling join.",
            "Because rooms are deleted frequently.",
            "Because messages are asynchronous.",
          ],
          correctIndex: 1,
          explanation:
            "Access can be revoked after join, and a malicious client can send a `sendMessage` event without calling `joinRoom` first. Always validate room membership in the message handler.",
        },
        {
          question:
            "Where should room authorization logic live?",
          options: [
            "In the gateway handler.",
            "In a service that the gateway calls, so it can be reused by HTTP endpoints and tested independently.",
            "In the client.",
            "In the database trigger.",
          ],
          correctIndex: 1,
          explanation:
            "Authorization logic belongs in a service. The gateway calls the service, and the service can also be used by HTTP endpoints. This keeps the logic single-sourced and testable.",
        },
        {
          question:
            "Why should you use `userId` instead of `email` in room names?",
          options: [
            "Because userId is shorter.",
            "Because room names appear in logs, and emails would leak personally identifiable information.",
            "Because emails change frequently.",
            "Because userId is required by Socket.IO.",
          ],
          correctIndex: 1,
          explanation:
            "Room names are logged by the server and any monitoring tools. Using emails in room names leaks PII into logs. Use opaque identifiers like userId.",
        },
      ],
    },
    {
      id: "day-73-lesson-4",
      title: "User Identity",
      durationMinutes: 24,
      explanation: `
<b>In a WebSocket connection, "who is this client?" is not a trivial question.</b> Unlike HTTP, where every request carries the user's credentials, a WebSocket connection authenticates once and then lives for minutes or hours. The user's identity must be captured at the handshake and made available to every message handler for the entire connection.

<b>Where identity lives.</b> In NestJS WebSockets, the authenticated identity is attached to \`socket.data\` during the handshake. This object is server-side only — clients cannot read or modify it. Every message handler can access it via \`client.data\` :

\`\`\`typescript
// In the handshake middleware:
socket.data.userId = payload.sub;
socket.data.email = payload.email;
socket.data.role = payload.role;

// In any message handler:
@SubscribeMessage('sendMessage')
handleMessage(@ConnectedSocket() client: Socket) {
  const userId = client.data.userId;
  const role = client.data.role;
  // ...
}
\`\`\`

<b>Why \`socket.data\` and not \`socket.handshake\`.</b> The \`socket.handshake\` object contains the raw HTTP handshake request — headers, query parameters, auth payload. It is read-only and reflects the connection's initial state. \`socket.data\` is a mutable server-side store attached to the socket. It persists for the life of the connection and is the right place for the authenticated user's identity .

<b>What to store on \`socket.data\`.</b> The identity should include everything a message handler might need to make authorization decisions:

- <b>\`userId\`</b> — the unique identifier of the user.
- <b>\`email\`</b> — useful for logging and user-facing messages.
- <b>\`role\`</b> — the user's role (admin, user, moderator).
- <b>\`tenantId\`</b> — for multi-tenant applications.
- <b>\`plan\`</b> — for feature gating (free, pro, enterprise).
- <b>\`sessionId\`</b> — for session revocation.

Do not store the JWT itself on \`socket.data\`. It is not needed after the handshake and storing it is a security risk if \`socket.data\` ever leaks.

<b>Tracking identity across connections.</b> A single user may have multiple connections open — multiple tabs, multiple devices. Each connection is a separate socket with a different \`socket.id\`, but they all share the same \`socket.data.userId\`.

To track all connections for a user, maintain a map on the gateway:

\`\`\`typescript
private readonly userSockets = new Map<string, Set<string>>(); // userId -> socketIds

handleConnection(client: Socket) {
  const userId = client.data.userId;
  if (!this.userSockets.has(userId)) {
    this.userSockets.set(userId, new Set());
  }
  this.userSockets.get(userId)!.add(client.id);
  client.join(\`user:\${userId}\`);
}

handleDisconnect(client: Socket) {
  const userId = client.data.userId;
  const sockets = this.userSockets.get(userId);
  if (sockets) {
    sockets.delete(client.id);
    if (sockets.size === 0) {
      this.userSockets.delete(userId);
    }
  }
}
\`\`\`

The \`user:{userId}\` room provides a second way to reach all of a user's connections. Emitting to this room is simpler than iterating the socket set:

\`\`\`typescript
this.server.to(\`user:\${userId}\`).emit('notification', data);
\`\`\`

Both approaches are valid. The room approach is cleaner for emitting; the map approach is useful for administrative actions (e.g. disconnecting all of a user's sockets when they are banned).

<b>Why a user is offline only when all connections close.</b> This is where beginners get confused. If you use \`Map<userId, socketId>\` and a user opens a second tab, the second \`socket.id\` overwrites the first. Now you have lost track of the first connection, and when the user closes the second tab, you mark them offline — even though the first tab is still open.

The fix is \`Map<userId, Set<socketId>>\`. When a connection closes, remove it from the set. The user is offline only when the set is empty.

\`\`\`typescript
handleDisconnect(client: Socket) {
  const userId = client.data.userId;
  const sockets = this.userSockets.get(userId);
  if (sockets) {
    sockets.delete(client.id);
    if (sockets.size === 0) {
      // All connections closed — user is offline.
      this.userSockets.delete(userId);
      this.server.emit('userOffline', { userId });
    }
  }
}
\`\`\`

<b>Updating identity during a connection.</b> What if the user's role changes during a long-lived connection? For example, an admin promotes a user to moderator. The existing WebSocket connection still has \`socket.data.role = 'user'\`. Do you need to update it?

There are two approaches:

- <b>Refresh on reconnection:</b> The identity is set at the handshake and is valid until the connection closes. Role changes take effect on the next connection. Simple, but the change is delayed.
- <b>Refresh proactively:</b> When the role changes, the server looks up the user's sockets and updates \`socket.data.role\` on each. The change takes effect immediately.

The proactive approach requires a mapping from userId to socket ids, which the \`userSockets\` map provides:

\`\`\`typescript
async updateUserRole(userId: string, newRole: string) {
  // Update in the database.
  await this.usersService.updateRole(userId, newRole);

  // Update all active sockets for this user.
  const sockets = this.userSockets.get(userId);
  if (sockets) {
    for (const socketId of sockets) {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        socket.data.role = newRole;
        socket.emit('roleUpdated', { role: newRole });
      }
    }
  }
}
\`\`\`

For critical authorization decisions, always re-check from the source of truth (the database or a cache) rather than trusting the in-memory \`socket.data.role\`. The \`socket.data\` value is a convenience for common cases, not a guarantee.

<b>Accessing identity in different contexts.</b> In a message handler, use the \`@ConnectedSocket()\` decorator:

\`\`\`typescript
@SubscribeMessage('sendMessage')
handleMessage(@ConnectedSocket() client: Socket) {
  const userId = client.data.userId;
  // ...
}
\`\`\`

In a guard, use the execution context:

\`\`\`typescript
canActivate(context: ExecutionContext): boolean {
  const client = context.switchToWs().getClient<Socket>();
  return client.data.role === 'admin';
}
\`\`\`

In a service (called from the gateway), pass the userId explicitly. Do not try to access \`socket.data\` from a service — the service should not depend on the WebSocket context.

<b>What can go wrong?</b>
- <b>Storing per-user state in instance variables instead of \`socket.data\`.</b> Gateways are singletons. \`this.currentUser\` is overwritten by every new connection.
- <b>Using \`Map<userId, socketId>\` instead of \`Map<userId, Set<socketId>>\`.</b> Multiple tabs overwrite each other, and offline detection is wrong.
- <b>Trusting \`socket.data.role\` for critical authorization.</b> If the role was updated in the database but not on the socket, authorization decisions are wrong.
- <b>Forgetting to clean up on disconnect.</b> The userSockets map grows forever. Memory leaks and stale online status.
- <b>Storing the JWT on \`socket.data\`.</b> The token is not needed after the handshake and storing it is a security risk.
- <b>Assuming the user cannot have two connections.</b> Users open multiple tabs. Always use a set.

<b>How this appears in a real application.</b> A collaboration platform has:
- \`Map<userId, Set<socketId>>\` tracking all active connections.
- Each user joined to \`user:{userId}\` for notifications.
- When a user is mentioned in a comment, the server emits to \`user:{mentionedUserId}\` and the notification appears on all their devices.
- When a user is banned, the \`banUser\` service looks up their sockets and disconnects each with a clear reason.
- When a user's role changes, the \`updateRole\` service updates \`socket.data.role\` on all their sockets and emits a \`roleUpdated\` event.

<b>How experienced engineers think.</b> User identity is the thread that connects the handshake to every message. Capture it once, store it on \`socket.data\`, and make it available everywhere. Track connections per user with a set, not a single id. Treat \`socket.data\` as a cache of the user's identity — always re-check from the source of truth for critical decisions. And clean up aggressively on disconnect, because connections come and go but your memory should not.
      `,
      diagram: `
User Identity Management in WebSockets

  Handshake:
    Token verified
        |
        v
    socket.data.userId = payload.sub
    socket.data.email = payload.email
    socket.data.role = payload.role
    socket.data.tenantId = payload.tenantId
        |
        v
    socket.data persists for the life of the connection

  Tracking connections:
    userSockets = Map<userId, Set<socketId>>

    handleConnection:
      userSockets.get(userId).add(client.id)
      client.join(\`user:\${userId}\`)

    handleDisconnect:
      userSockets.get(userId).delete(client.id)
      if set is empty -> user offline

  Multiple connections per user:
    Tab 1: socketId A
    Tab 2: socketId B
    Phone: socketId C
    All have the same socket.data.userId
    All joined to \`user:{userId}\`
    Emitting to the room reaches all three

  Offline detection:
    A user is offline ONLY when their set is empty.
    Closing one tab does not mark them offline.

  Updating identity during a connection:
    Role changes -> look up userSockets
                -> update socket.data.role on each
                -> emit 'roleUpdated'

  Security note:
    socket.data is server-side only.
    Clients cannot read or modify it.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// USER IDENTITY MANAGEMENT IN WEBSOCKETS
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
import { Logger, Injectable, UseGuards, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

// ============================================
// GATEWAY WITH FULL IDENTITY MANAGEMENT
// ============================================
@WebSocketGateway({ namespace: 'app', cors: { origin: '*' } })
export class IdentityGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(IdentityGateway.name);

  // Track all connections per user.
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // ============================================
  // HANDSHAKE: authenticate and attach identity
  // ============================================
  afterInit(server: Server) {
    server.use(async (socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication token required'));

      let payload;
      try {
        payload = this.jwtService.verify(token);
      } catch {
        return next(new Error('Invalid or expired token'));
      }

      // Load fresh user data (authorization).
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.enabled) {
        return next(new Error('User not found or disabled'));
      }

      // Attach identity to the socket.
      socket.data.userId = user.id;
      socket.data.email = user.email;
      socket.data.role = user.role;
      socket.data.tenantId = user.tenantId;
      socket.data.plan = user.plan;

      next();
    });
  }

  // ============================================
  // CONNECTION: track and join personal room
  // ============================================
  handleConnection(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(\`User \${userId} connected (socket: \${client.id})\`);

    // Track this socket.
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(client.id);

    // Join a personal room for cross-device delivery.
    client.join(\`user:\${userId}\`);

    // Send confirmation with identity.
    client.emit('connected', {
      userId,
      socketId: client.id,
      role: client.data.role,
      tenantId: client.data.tenantId,
    });
  }

  // ============================================
  // DISCONNECTION: clean up tracking
  // ============================================
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(\`User \${userId} disconnected (socket: \${client.id})\`);

    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        // All connections closed — user is offline.
        this.userSockets.delete(userId);
        this.server.emit('userOffline', { userId });
      }
    }
  }

  // ============================================
  // MESSAGE HANDLERS: access identity via client.data
  // ============================================
  @SubscribeMessage('getProfile')
  handleGetProfile(@ConnectedSocket() client: Socket) {
    // client.data is guaranteed to have the identity.
    return {
      userId: client.data.userId,
      email: client.data.email,
      role: client.data.role,
      plan: client.data.plan,
    };
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    client.to(data.roomId).emit('message', {
      userId,
      text: data.text,
      timestamp: new Date().toISOString(),
    });

    return { sent: true };
  }

  // ============================================
  // ADMIN: update role on all active sockets
  // ============================================
  async updateUserRole(userId: string, newRole: string): Promise<void> {
    // 1. Update in the database.
    await this.usersService.updateRole(userId, newRole);

    // 2. Update all active sockets for this user.
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      for (const socketId of sockets) {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
          socket.data.role = newRole;
          socket.emit('roleUpdated', { role: newRole });
        }
      }
    }

    this.logger.log(\`User \${userId} role updated to \${newRole}\`);
  }

  // ============================================
  // ADMIN: disconnect all sockets for a user
  // ============================================
  async disconnectUser(userId: string, reason: string): Promise<void> {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;

    for (const socketId of sockets) {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('disconnected', { reason });
        socket.disconnect(true);
      }
    }

    this.logger.warn(\`User \${userId} disconnected: \${reason}\`);
  }

  // ============================================
  // UTILITY: get all sockets for a user
  // ============================================
  getSocketsForUser(userId: string): string[] {
    return Array.from(this.userSockets.get(userId) ?? []);
  }

  // ============================================
  // UTILITY: emit to all connections of a user
  // ============================================
  emitToUser(userId: string, event: string, data: any): void {
    this.server.to(\`user:\${userId}\`).emit(event, data);
  }
}

// ============================================
// GUARD FOR MESSAGE-LEVEL AUTHORIZATION
// ============================================
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    if (client.data.role !== 'admin') {
      throw new WsException('Admin access required');
    }
    return true;
  }
}

// Usage:
@UseGuards(AdminGuard)
@SubscribeMessage('adminAction')
handleAdminAction(@ConnectedSocket() client: Socket) {
  // Only reached if role === 'admin'.
}

// ============================================
// CLIENT-SIDE: identity and multi-tab
// ============================================
// const socket = io('http://localhost:3000/app', {
//   auth: { token: localStorage.getItem('accessToken') },
// });
//
// socket.on('connected', ({ userId, socketId, role }) => {
//   console.log(\`Connected as \${userId} (\${role}) on socket \${socketId}\`);
// });
//
// socket.on('roleUpdated', ({ role }) => {
//   console.log(\`Your role changed to \${role}\`);
//   // Update UI accordingly.
// });
//
// socket.on('disconnected', ({ reason }) => {
//   showMessage(\`Disconnected: \${reason}\`);
// });

// ============================================
// WHAT NOT TO DO
// ============================================

// BAD: Storing per-user state in instance variables.
// private currentUserId: string;
// handleConnection(client) { this.currentUserId = client.data.userId; }
// Overwritten by every new connection. Use socket.data.

// BAD: Using Map<userId, socketId>.
// private userSockets = new Map<string, string>();
// A second tab overwrites the first tab's socket id.

// GOOD: Use Map<userId, Set<socketId>>.
// private userSockets = new Map<string, Set<string>>();

// BAD: Trusting socket.data.role for critical authorization.
// if (client.data.role === 'admin') { /* ... */ }
// If the role was changed in the DB but not on the socket, this is wrong.

// GOOD: Re-check from the source of truth for critical decisions.
// const user = await this.usersService.findById(client.data.userId);
// if (user.role === 'admin') { /* ... */ }

// BAD: Storing the JWT on socket.data.
// socket.data.token = token; // Security risk if socket.data leaks.
      ` },
      keyTakeaways: [
        "Attach the authenticated identity to `socket.data` at the handshake — it persists for the life of the connection.",
        "`socket.data` is server-side only; clients cannot read or modify it.",
        "Store `userId`, `email`, `role`, `tenantId`, `plan`, and `sessionId` on `socket.data` — but never the JWT itself.",
        "Use `Map<userId, Set<socketId>>` to track multiple connections per user (tabs, devices).",
        "A user is offline only when their set of sockets is empty.",
        "Join each user to `user:{userId}` for cross-device delivery.",
        "For critical authorization, re-check from the database or cache — do not trust `socket.data.role` alone.",
        "Update `socket.data` on all active sockets when the user's role changes.",
      ],
      commonMistakes: [
        "<b>Storing per-user state in instance variables instead of `socket.data`.</b> Gateways are singletons. `this.currentUser` is overwritten by every connection.",
        "<b>Using `Map<userId, socketId>` instead of `Map<userId, Set<socketId>>`.</b> Multiple tabs overwrite each other, and offline detection is wrong.",
        "<b>Trusting `socket.data.role` for critical authorization.</b> If the role was updated in the database but not on the socket, authorization decisions are wrong.",
        "<b>Forgetting to clean up on disconnect.</b> The userSockets map grows forever. Memory leaks and stale online status.",
        "<b>Storing the JWT on `socket.data`.</b> The token is not needed after the handshake and storing it is a security risk.",
        "<b>Assuming a user has only one connection.</b> Users open multiple tabs. Always use a set.",
      ],
      quiz: [
        {
          question:
            "Where should the authenticated user identity be stored for the life of a WebSocket connection?",
          options: [
            "In a global variable.",
            "On `socket.data`, which persists for the connection and is accessible in every message handler.",
            "In a cookie.",
            "In the JWT itself.",
          ],
          correctIndex: 1,
          explanation:
            "`socket.data` is the Socket.IO v4 way to store per-connection server-side data. It persists for the life of the connection and is accessible via `client.data` in every handler .",
        },
        {
          question:
            "Why should you use `Map<userId, Set<socketId>>` instead of `Map<userId, socketId>`?",
          options: [
            "Because Maps are faster.",
            "Because a user can have multiple connections (tabs, devices), and a set tracks all of them without overwriting.",
            "Because TypeScript requires it.",
            "Because sets use less memory.",
          ],
          correctIndex: 1,
          explanation:
            "A user can open multiple tabs or use multiple devices. A `Map<userId, Set<socketId>>` tracks all their connections. A `Map<userId, socketId>` would overwrite the previous connection .",
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
            "A user is offline only when they have no active connections. If they have two tabs open and one closes, they are still online .",
        },
        {
          question:
            "Why should you re-check from the database for critical authorization decisions instead of trusting `socket.data.role`?",
          options: [
            "Because `socket.data` is unreliable.",
            "Because the role might have changed in the database since the handshake, and `socket.data` is a snapshot from connection time.",
            "Because `socket.data` is client-controlled.",
            "Because the database is faster.",
          ],
          correctIndex: 1,
          explanation:
            "`socket.data.role` is set at the handshake. If the role changes in the database during the connection, `socket.data` is stale. For critical decisions, re-check from the source of truth .",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why should WebSocket authentication happen at the handshake rather than per message?",
      options: [
        "Because WebSocket messages cannot carry tokens.",
        "Because the handshake is the only moment to reject a connection before it is established, and per-message validation is wasteful.",
        "Because NestJS requires it.",
        "Because tokens expire too quickly for messages.",
      ],
      correctIndex: 1,
      explanation: "The handshake is the security boundary. Validating once rejects invalid connections early and avoids running validation on every message .",
    },
    {
      question: "Where should the client send the JWT when connecting via Socket.IO?",
      options: [
        "In the URL query string.",
        "In the `auth` payload of the connection options.",
        "In the message body of the first message.",
        "In a cookie only.",
      ],
      correctIndex: 1,
      explanation: "Socket.IO provides the `auth` object in the connection options for authentication data, accessible via `socket.handshake.auth` .",
    },
    {
      question: "Why does `@UseGuards` not work for handshake authentication in WebSockets?",
      options: [
        "Because guards are deprecated.",
        "Because guards run before `@SubscribeMessage` handlers, not before the connection is established.",
        "Because guards only work with HTTP.",
        "Because guards cannot access `socket.data`.",
      ],
      correctIndex: 1,
      explanation: "NestJS guards run before message handlers, not during the connection handshake. By the time a guard runs, the connection has already been accepted. Use `server.use()` middleware instead.",
    },
    {
      question: "What is the difference between `jwtService.decode()` and `jwtService.verify()`?",
      options: [
        "They are aliases.",
        "`decode()` parses the token without checking the signature or expiration; `verify()` validates both.",
        "`decode()` is for WebSockets; `verify()` is for HTTP.",
        "`decode()` is faster and should be preferred.",
      ],
      correctIndex: 1,
      explanation: "`decode()` simply parses the JWT payload. It does not check the signature or expiration. Always use `verify()` for authentication.",
    },
    {
      question: "Why is checking the user's state at connection time important if you already validate the JWT?",
      options: [
        "Because JWTs can be forged.",
        "Because a JWT is a snapshot from login time; the user's status may have changed since then (banned, disabled, subscription expired).",
        "Because JWTs expire too quickly.",
        "Because JWTs do not contain the user id.",
      ],
      correctIndex: 1,
      explanation: "JWTs carry claims signed at login. If the user's state changes, the JWT still says the old state. Only a database or cache lookup at connection time catches this .",
    },
    {
      question: "How should the server reject a WebSocket connection in the middleware?",
      options: [
        "Throw an `UnauthorizedException`.",
        "Call `next(new Error('message'))`.",
        "Send an HTTP 401 response.",
        "Call `socket.disconnect()`.",
      ],
      correctIndex: 1,
      explanation: "Inside `server.use()` middleware, rejections are signaled by calling `next(new Error('message'))`. Throwing HTTP exceptions does not work in this context .",
    },
    {
      question: "Why is it dangerous to call `client.join(roomId)` without validation?",
      options: [
        "Because it uses too much memory.",
        "Because any client can join any room by guessing the room id, gaining access to messages they should not see.",
        "Because it disconnects other clients.",
        "Because it slows down the server.",
      ],
      correctIndex: 1,
      explanation: "Rooms are not a security mechanism. Without validation, any client can join any room and receive its broadcasts. This is a serious data leak.",
    },
    {
      question: "Why should you re-validate room authorization on every message, not just on join?",
      options: [
        "Because join is unreliable.",
        "Because a user's access may be revoked after they join, and a malicious client can forge messages without ever calling join.",
        "Because rooms are deleted frequently.",
        "Because messages are asynchronous.",
      ],
      correctIndex: 1,
      explanation: "Access can be revoked after join, and a malicious client can send a message without calling `joinRoom`. Always validate room membership in the message handler.",
    },
    {
      question: "Where should room authorization logic live?",
      options: [
        "In the gateway handler.",
        "In a service that the gateway calls, so it can be reused by HTTP endpoints and tested independently.",
        "In the client.",
        "In the database trigger.",
      ],
      correctIndex: 1,
      explanation: "Authorization logic belongs in a service. The gateway calls the service, and the service can also be used by HTTP endpoints. This keeps the logic single-sourced and testable.",
    },
    {
      question: "Why should you use `userId` instead of `email` in room names?",
      options: [
        "Because userId is shorter.",
        "Because room names appear in logs, and emails would leak personally identifiable information.",
        "Because emails change frequently.",
        "Because userId is required by Socket.IO.",
      ],
      correctIndex: 1,
      explanation: "Room names are logged by the server and monitoring tools. Using emails leaks PII into logs. Use opaque identifiers like userId.",
    },
    {
      question: "Where should the authenticated user identity be stored for the life of a WebSocket connection?",
      options: [
        "In a global variable.",
        "On `socket.data`, which persists for the connection and is accessible in every message handler.",
        "In a cookie.",
        "In the JWT itself.",
      ],
      correctIndex: 1,
      explanation: "`socket.data` is the Socket.IO v4 way to store per-connection server-side data. It persists for the life of the connection .",
    },
    {
      question: "Why should you use `Map<userId, Set<socketId>>` instead of `Map<userId, socketId>`?",
      options: [
        "Because Maps are faster.",
        "Because a user can have multiple connections (tabs, devices), and a set tracks all of them without overwriting.",
        "Because TypeScript requires it.",
        "Because sets use less memory.",
      ],
      correctIndex: 1,
      explanation: "A user can open multiple tabs. A `Map<userId, Set<socketId>>` tracks all connections. A `Map<userId, socketId>` would overwrite .",
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
      explanation: "A user is offline only when they have no active connections. If they have two tabs open and one closes, they are still online .",
    },
    {
      question: "Why should you re-check from the database for critical authorization decisions instead of trusting `socket.data.role`?",
      options: [
        "Because `socket.data` is unreliable.",
        "Because the role might have changed in the database since the handshake, and `socket.data` is a snapshot from connection time.",
        "Because `socket.data` is client-controlled.",
        "Because the database is faster.",
      ],
      correctIndex: 1,
      explanation: "`socket.data.role` is set at the handshake. If the role changes in the database during the connection, `socket.data` is stale. For critical decisions, re-check from the source of truth .",
    },
    {
      question: "What should the client do when it receives a `connect_error` with the message 'Invalid or expired token'?",
      options: [
        "Give up and show an error.",
        "Refresh the token via the HTTP refresh endpoint and reconnect with the new token.",
        "Disable WebSocket and use HTTP.",
        "Wait 10 minutes and retry with the same token.",
      ],
      correctIndex: 1,
      explanation: "An expired token can be refreshed via the HTTP endpoint. The client should update `socket.auth.token` and call `socket.connect()` to retry .",
    },
  ],
  project: {
    name: "Build a Secure Real-Time Chat Backend with JWT Authentication, Room Authorization, and Identity Management",
    goal:
      "Implement a production-grade WebSocket authentication and authorization system for a NestJS chat application. Cover JWT authentication at the handshake, connection authorization with session revocation, room-level authorization, and full user identity management across multiple connections.",
    brief:
      "You are building the backend for a secure chat application. Users authenticate via JWT, connect to a WebSocket namespace, join conversation rooms they have access to, and exchange messages. The system must prevent unauthorized joins, revoke sessions on logout, handle multiple connections per user, and provide clean identity management. This project combines every concept from today's lessons.",
    steps: [
      "Create a NestJS project. Add `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`, `@nestjs/jwt`, `@nestjs/typeorm`, `pg`, and `ioredis`.",
      "Create entities: `User` (id, email, passwordHash, role, enabled, tenantId), `Conversation` (id, name, tenantId, isPrivate), and `Membership` (userId, conversationId, role).",
      "Create an `AuthService` with `login` and `refresh` methods that issue JWTs with a `sid` (session id) claim.",
      "Create a `SessionStoreService` backed by Redis with `create`, `get`, `revoke`, `addSocket`, `removeSocket`, and `getSockets` methods.",
      "Create a `ChatGateway` with namespace `chat`. Implement `OnGatewayInit`, `OnGatewayConnection`, and `OnGatewayDisconnect`.",
      "In `afterInit`, register middleware that: (a) extracts the token from `socket.handshake.auth.token`; (b) verifies it with `jwtService.verify`; (c) checks the user's state in Redis (not banned, enabled); (d) checks that the session id is not revoked; (e) attaches `userId`, `email`, `role`, `tenantId`, and `sessionId` to `socket.data`; (f) registers the socket in the session store.",
      "In `handleConnection`, add the socket to a `Map<userId, Set<socketId>>`, join the user to `user:{userId}`, and emit a `connected` event.",
      "In `handleDisconnect`, remove the socket from the map and the session store. If the set becomes empty, emit `userOffline`.",
      "Create a `ConversationsService` with `canUserAccess(conversationId, userId)` that checks membership and tenant.",
      "Implement `@SubscribeMessage('joinConversation')` that validates access via `ConversationsService` before calling `client.join()`.",
      "Implement `@SubscribeMessage('sendMessage')` that re-checks `client.rooms.has()` and re-validates membership via the service before broadcasting.",
      "Implement an HTTP `POST /auth/logout` endpoint that revokes the session in Redis and disconnects all sockets for that session.",
      "Implement an HTTP `POST /admin/users/:id/ban` endpoint that marks the user as banned, revokes all their sessions, and disconnects all their sockets.",
      "Write an e2e test that connects with a valid JWT, joins a conversation they are a member of, sends a message, and verifies the message is received by another member.",
      "Write an e2e test that attempts to join a conversation they are NOT a member of, and verifies the join is rejected with a `WsException`.",
      "Write an e2e test that connects, then logs out via HTTP, and verifies the socket is disconnected with a `sessionRevoked` event.",
      "Write an e2e test that connects two clients with the same user account (simulating two tabs), verifies both receive notifications sent to `user:{userId}`, and verifies the user is only marked offline when both disconnect.",
    ],
    acceptance: [
      "A client with a valid JWT can connect and receive an `authenticated` event.",
      "A client without a token is rejected at the handshake with `connect_error`.",
      "A client with an expired token is rejected with `connect_error`.",
      "A client whose session has been revoked is rejected with a specific error message.",
      "`joinConversation` rejects the join if the user is not a member.",
      "`sendMessage` re-validates membership and rejects messages to rooms the user is not in.",
      "Logging out via HTTP disconnects all active WebSocket connections for that session.",
      "Banning a user via HTTP disconnects all their sockets and prevents new connections.",
      "Multiple tabs for the same user receive notifications sent to `user:{userId}`.",
      "The user is marked offline only when all their sockets disconnect.",
      "All e2e tests pass.",
    ],
    stretch: [
      "Add a rate limit to the `joinConversation` event using a simple in-memory counter per user. Reject if the user joins more than 20 rooms per minute.",
      "Implement `updateUserRole` that changes a user's role in the database and updates `socket.data.role` on all their active sockets.",
      "Add a `WsExceptionFilter` that catches `WsException` and emits a structured error to the client with an error code and message.",
      "Add the Redis adapter for multi-pod scaling. Test with two server instances connected to the same Redis, and verify that a session revoked on one instance disconnects sockets on the other.",
      "Add Prometheus metrics: `ws_connections_total`, `ws_active_connections`, `ws_auth_failures_total{reason}`, `ws_room_join_denied_total`.",
      "Write a load test with `artillery` that connects 500 concurrent WebSocket clients with valid JWTs and measures authentication latency and connection success rate.",
      "Add a 'session list' HTTP endpoint that returns all active sessions for the current user, with the ability to revoke individual sessions.",
    ],
  },
};
