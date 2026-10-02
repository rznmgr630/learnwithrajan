import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_71_LESSONS: LessonDay = {
  day: 71,
  title: "WebSockets",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-71-lesson-1",
      title: "WebSocket Protocol",
      durationMinutes: 22,
      explanation: `
<b>Imagine you are building a stock ticker application.</b> Prices change hundreds of times per second. You could have the client poll the server — "any new prices?" — every 100 milliseconds. But that is wasteful: most requests return "no change," and each one carries the overhead of a full HTTP request-response cycle. What you need is a protocol where the server can push updates to the client the moment they happen. That protocol is WebSocket.

<b>WebSocket is a communication protocol that provides full-duplex, bidirectional communication over a single TCP connection.</b> Unlike HTTP, where the client must initiate every exchange, WebSocket allows both the client and the server to send messages at any time. Once the connection is established, it stays open until either side closes it .

<b>Why does WebSocket exist?</b> Before WebSocket, real-time web applications relied on techniques like HTTP polling and long-polling. These approaches worked, but they had serious problems :

- <b>Polling:</b> The client repeatedly asks the server for updates. Most requests are wasted — the server has nothing new to say.
- <b>Long-polling:</b> The client keeps a request open until the server has something to send. Better than polling, but still requires a new HTTP request for every message, with all the overhead of HTTP headers.
- <b>Connection overhead:</b> Each HTTP request opens a new TCP connection (or reuses one inefficiently), and every message carries HTTP headers.

WebSocket solves all of these problems by establishing a single, persistent connection that both sides can use to send messages. The overhead per message is just a few bytes of framing, not hundreds of bytes of HTTP headers .

<b>How WebSocket works.</b> The protocol has two parts: the handshake and the data transfer .

<b>The handshake.</b> A WebSocket connection begins as an HTTP request. The client sends a special request with two important headers:

\`\`\`
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
\`\`\`

The \`Upgrade: websocket\` and \`Connection: Upgrade\` headers tell the server that the client wants to switch protocols. The \`Sec-WebSocket-Key\` is a random value used to prevent caching and to prove that the server actually understands WebSocket. The server responds with:

\`\`\`
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
\`\`\`

The \`101 Switching Protocols\` status code means the connection is being upgraded. From this point on, the connection is a WebSocket connection, not HTTP. The same TCP connection is used, but the framing changes .

<b>The data transfer.</b> After the handshake, both sides can send messages. Each message is wrapped in a frame. A frame has a small header (2-14 bytes) that indicates the message type (text, binary, ping, pong, close) and the payload length, followed by the payload itself. This is far more efficient than HTTP headers .

<b>Why this matters for NestJS.</b> NestJS abstracts the WebSocket protocol behind gateways. You do not write the handshake logic or parse frames yourself — the framework does it for you. But understanding what is happening under the hood helps you reason about connection lifecycle, authentication (which happens during the handshake), and performance.

<b>WebSocket vs HTTP.</b> The key differences:

| Aspect | HTTP | WebSocket |
|--------|------|-----------|
| Connection | Opens and closes per request | Persistent |
| Direction | Client-initiated | Bidirectional |
| Overhead | Headers on every request | Minimal framing |
| Real-time | Requires polling | Native push |
| State | Stateless | Stateful |

<b>When to use WebSocket.</b> WebSocket is the right choice when:
- The server needs to push data to clients without the client asking.
- The communication is frequent and small (chat messages, cursor positions, stock ticks).
- Low latency matters (gaming, live collaboration).
- You need bidirectional communication (the client and server both send messages regularly).

<b>When NOT to use WebSocket.</b> WebSocket adds complexity: connection management, reconnection logic, authentication at the handshake, and scaling across multiple servers. For simple, infrequent updates, HTTP is simpler and sufficient. For one-way server-to-client streaming, Server-Sent Events (SSE) can be a better fit.

<b>What can go wrong?</b>
- <b>Not handling reconnection.</b> WebSocket connections can drop (network issues, server restarts). The client must reconnect and re-establish state. Socket.IO handles this automatically; raw WebSocket does not.
- <b>Assuming WebSocket works everywhere.</b> Some corporate proxies and firewalls block WebSocket. Socket.IO falls back to HTTP long-polling; raw WebSocket does not.
- <b>Scaling across multiple servers.</b> A client connects to one server. If another server needs to send that client a message, it cannot. You need a pub/sub layer (Redis) to distribute messages across servers.
- <b>Forgetting authentication.</b> WebSocket connections are not automatically authenticated. You must validate credentials during the handshake.
- <b>Memory leaks from forgotten connections.</b> If you track connected clients in memory, you must clean up on disconnect.

<b>How this appears in a real application.</b> A trading dashboard uses WebSocket to stream price updates. The client connects once, subscribes to the symbols it cares about, and receives updates as they happen. The server does not wait for the client to ask — it pushes data the moment a price changes. Without WebSocket, the client would need to poll every 100ms, generating thousands of wasted requests per user.

<b>How experienced engineers think.</b> WebSocket is a tool for a specific problem: real-time, bidirectional communication. It is not a replacement for HTTP — it complements it. Most applications use both: HTTP for request-response operations (login, fetch data, create orders) and WebSocket for real-time updates (notifications, presence, live data). Understanding when to use which is the mark of an experienced engineer.
      `,
      diagram: `
WebSocket Protocol Lifecycle

  Client                          Server
    |                               |
    |-- HTTP GET /chat ------------>|
    |   Upgrade: websocket          |
    |   Connection: Upgrade         |
    |   Sec-WebSocket-Key: ...      |
    |                               |
    |<-- 101 Switching Protocols ---|
    |   Upgrade: websocket          |
    |   Sec-WebSocket-Accept: ...   |
    |                               |
    |   === WebSocket Connection ===|
    |                               |
    |-- frame: "hello" ------------>|
    |<-- frame: "world" ------------|
    |<-- frame: "update" -----------|  (server push)
    |-- frame: "ack" --------------->|
    |                               |
    |   === Connection stays open ===|
    |                               |
    |-- close frame --------------->|
    |<-- close frame ---------------|
    |                               |

  Key differences from HTTP:
    HTTP:    request -> response -> connection closes
    WebSocket: handshake -> persistent bidirectional channel

  Frame overhead:
    HTTP:      ~200-800 bytes of headers per request
    WebSocket: 2-14 bytes of framing per message
      `,
      codeExample: { title: "Example", code: `
// ============================================
// WEBSOCKET PROTOCOL — CONCEPTUAL OVERVIEW
// ============================================

// This is NOT NestJS code. It shows the raw protocol
// so you understand what NestJS abstracts for you.

// ---------- 1. The HTTP handshake (conceptual) ----------
// The client sends an HTTP request with upgrade headers.
// This is what your browser or socket.io client does automatically.
//
// GET /chat HTTP/1.1
// Host: server.example.com
// Upgrade: websocket
// Connection: Upgrade
// Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
// Sec-WebSocket-Version: 13

// The server responds with 101 Switching Protocols.
//
// HTTP/1.1 101 Switching Protocols
// Upgrade: websocket
// Connection: Upgrade
// Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

// ---------- 2. What happens after the handshake ----------
// The same TCP connection is now a WebSocket connection.
// Frames are exchanged in both directions.

// Client sends a text frame:
//   [FIN=1][opcode=1][mask=1][length=5][masking-key][payload="hello"]

// Server sends a text frame back:
//   [FIN=1][opcode=1][mask=0][length=5][payload="world"]

// Server can push without the client asking:
//   [FIN=1][opcode=1][mask=0][length=6][payload="update"]

// ---------- 3. Why NestJS exists ----------
// NestJS abstracts all of this. You write:

// @WebSocketGateway()
// export class ChatGateway {
//   @SubscribeMessage('message')
//   handleMessage(@MessageBody() data: string) {
//     return data;
//   }
// }

// The framework:
//   - Creates the WebSocket server
//   - Handles the HTTP upgrade handshake
//   - Parses incoming frames
//   - Routes messages to your @SubscribeMessage handlers
//   - Serializes your return value into a frame

// ---------- 4. When to use WebSocket vs HTTP ----------
//
// Use HTTP when:
//   - The client initiates every request (login, fetch, create).
//   - Updates are infrequent or can tolerate polling.
//   - You need request-response semantics (status codes, REST).
//
// Use WebSocket when:
//   - The server needs to push data to clients.
//   - Updates are frequent and small (chat, live data, presence).
//   - Low latency matters.
//   - You need bidirectional communication.

// ---------- 5. When NOT to use WebSocket ----------
//
// - For simple CRUD operations, HTTP is simpler.
// - For one-way server-to-client streaming, Server-Sent Events (SSE)
//   may be a better fit.
// - If your infrastructure blocks WebSocket (some corporate proxies),
//   HTTP polling or SSE is more reliable.
      ` },
      keyTakeaways: [
        "WebSocket is a protocol for full-duplex, bidirectional communication over a single persistent TCP connection.",
        "It solves the problems of HTTP polling: connection overhead, wasted requests, and lack of server push.",
        "The protocol starts with an HTTP handshake (`101 Switching Protocols`) and then switches to WebSocket framing.",
        "WebSocket frames are lightweight (2-14 bytes of header) compared to HTTP headers (hundreds of bytes).",
        "NestJS abstracts the protocol behind gateways, but understanding the handshake is essential for authentication.",
        "Use WebSocket for real-time, frequent, bidirectional communication. Use HTTP for request-response and infrequent updates.",
        "Raw WebSocket does not handle reconnection or fallback — libraries like Socket.IO add those features.",
      ],
      commonMistakes: [
        "<b>Assuming WebSocket works everywhere.</b> Some corporate proxies and firewalls block WebSocket. Socket.IO falls back to HTTP long-polling; raw WebSocket does not.",
        "<b>Not handling reconnection.</b> WebSocket connections can drop. The client must reconnect and re-establish state. Socket.IO handles this; raw WebSocket does not.",
        "<b>Scaling across multiple servers without pub/sub.</b> A client connects to one server. If another server needs to push to that client, it cannot. Use Redis or another pub/sub layer.",
        "<b>Forgetting authentication at the handshake.</b> WebSocket connections are not automatically authenticated. Validate credentials during the upgrade request.",
        "<b>Using WebSocket for everything.</b> Simple CRUD operations are better served by HTTP. WebSocket adds complexity without benefit for request-response patterns.",
      ],
      quiz: [
        {
          question:
            "What is the main advantage of WebSocket over HTTP polling?",
          options: [
            "WebSocket uses less bandwidth for large payloads.",
            "WebSocket provides full-duplex communication over a single persistent connection, eliminating the overhead of repeated HTTP requests.",
            "WebSocket is more secure than HTTP.",
            "WebSocket works on more devices than HTTP.",
          ],
          correctIndex: 1,
          explanation:
            "WebSocket keeps a single connection open and allows both sides to send messages at any time. HTTP polling requires a new request for every check, with full HTTP header overhead each time .",
        },
        {
          question:
            "What HTTP status code indicates a successful WebSocket upgrade?",
          options: [
            "200 OK",
            "201 Created",
            "101 Switching Protocols",
            "301 Moved Permanently",
          ],
          correctIndex: 2,
          explanation:
            "`101 Switching Protocols` is returned by the server when it agrees to upgrade the HTTP connection to WebSocket .",
        },
        {
          question:
            "Which header is sent by the client to initiate a WebSocket handshake?",
          options: [
            "Content-Type: application/websocket",
            "Upgrade: websocket",
            "Accept: websocket",
            "Connection: keep-alive",
          ],
          correctIndex: 1,
          explanation:
            "The `Upgrade: websocket` header (along with `Connection: Upgrade`) tells the server that the client wants to switch protocols .",
        },
        {
          question:
            "When should you NOT use WebSocket?",
          options: [
            "For a real-time chat application.",
            "For a live stock ticker.",
            "For simple CRUD operations that can be served by HTTP.",
            "For collaborative document editing.",
          ],
          correctIndex: 2,
          explanation:
            "Simple CRUD operations are better served by HTTP. WebSocket adds connection management complexity without benefit for request-response patterns.",
        },
      ],
    },
    {
      id: "day-71-lesson-2",
      title: "Handshake",
      durationMinutes: 22,
      explanation: `
<b>The WebSocket handshake is the most important moment in a WebSocket connection.</b> It is the only time you can authenticate the client before the connection is fully established. After the handshake completes, the client is connected — and if you did not validate them, they are in. Getting authentication right at the handshake is the difference between a secure real-time system and a gaping hole.

<b>What happens during the handshake.</b> The client sends an HTTP request with upgrade headers. The server can inspect this request — including any headers, cookies, query parameters, or the authentication payload — before deciding whether to accept the connection. This is where you validate the JWT, check the API key, or verify any other credentials .

<b>Why authentication belongs at the handshake.</b> WebSocket connections are long-lived. If you authenticate per message, you run the validation logic thousands of times per connection, wasting CPU. More importantly, an unauthenticated client can connect and then send messages — if your message handlers assume the client is authenticated, you have a security hole .

By authenticating at the handshake, you ensure that only valid clients ever reach your message handlers. If the token is invalid, the connection is rejected before any messages are processed .

<b>How authentication works in Socket.IO.</b> Socket.IO provides a clean mechanism: the client sends authentication data in the connection options, and the server accesses it via \`socket.handshake.auth\` .

Client side:
\`\`\`typescript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIs...',
  },
});
\`\`\`

Server side, in a middleware registered in \`afterInit\`:
\`\`\`typescript
afterInit(server: Server) {
  server.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const payload = this.jwtService.verify(token);
      socket.data.userId = payload.sub;
      next(); // Accept the connection
    } catch {
      next(new Error('Unauthorized')); // Reject
    }
  });
}
\`\`\`

<b>The \`socket.handshake\` object.</b> Socket.IO exposes a \`handshake\` object on the socket with all the details of the initial HTTP request :

| Property | Description |
|----------|-------------|
| \`headers\` | The HTTP headers sent during the handshake |
| \`time\` | When the connection was created |
| \`address\` | The client's IP address |
| \`secure\` | Whether the connection is over TLS |
| \`url\` | The request URL |
| \`query\` | Query parameters from the first request |
| \`auth\` | The authentication payload sent by the client |

This gives you multiple options for authentication:
- **Token in \`auth\` payload:** \`socket.handshake.auth.token\`
- **Token in Authorization header:** \`socket.handshake.headers.authorization\`
- **Token in query string:** \`socket.handshake.query.token\` (less secure — avoid)
- **Cookie:** \`socket.handshake.headers.cookie\`

<b>Using JWT in the handshake.</b> The standard pattern for NestJS applications is:

1. The client authenticates via HTTP (\`POST /auth/login\`) and receives a JWT.
2. The client connects to the WebSocket server, sending the JWT in the \`auth\` payload.
3. The server validates the JWT using the same \`JwtService\` used for HTTP authentication .
4. If valid, the server attaches the decoded user to \`socket.data.user\`.
5. If invalid, the connection is rejected.

This means the same JWT works for both HTTP and WebSocket, and the same user identity is available in both contexts.

<b>Guards at the message level.</b> In addition to handshake authentication, NestJS supports guards on WebSocket message handlers. A guard runs before the message handler and can reject individual messages . This is useful for authorization (does this user have permission to perform this action?) as opposed to authentication (is this user who they say they are?).

\`\`\`typescript
@UseGuards(WsJwtGuard)
@SubscribeMessage('sendMessage')
handleMessage(@MessageBody() data: string) {
  // Only runs if the guard allows it.
}
\`\`\`

<b>What can go wrong?</b>
- <b>Not authenticating at all.</b> An unauthenticated client can connect and send messages. If your handlers assume authentication, you have a security hole.
- <b>Authenticating per message instead of at handshake.</b> Wasteful and error-prone. The handshake is the right place .
- <b>Putting the token in the query string.</b> Query strings are logged, cached, and visible in browser history. Use the \`auth\` payload or a header instead.
- <b>Not validating token expiration.</b> \`jwtService.verify()\` checks expiration by default. Do not use \`decode()\` without verifying.
- <b>Forgetting to handle the rejection.</b> When you call \`next(new Error('Unauthorized'))\`, the client receives a \`connect_error\` event. The client should handle this and prompt for re-authentication.
- <b>Using a different secret for WebSocket.</b> Use the same JWT secret as HTTP. Otherwise, you have two authentication systems to maintain.

<b>How this appears in a real application.</b> A NestJS application has a \`ChatGateway\` and an \`AuthService\`. The client logs in via HTTP, receives a JWT, and connects to the WebSocket with that JWT. The gateway's \`afterInit\` middleware validates the token, attaches the user to \`socket.data.user\`, and only then does \`handleConnection\` run. If the token is expired, the connection is rejected with an error, and the client knows to refresh the token via the HTTP refresh endpoint .

<b>How experienced engineers think.</b> The handshake is a security boundary. Treat it like a login form. Validate everything, reject invalid connections, and attach the authenticated identity to the socket. Everything after the handshake can then trust that \`socket.data.user\` is populated. This single principle prevents an entire class of security bugs.
      `,
      diagram: `
WebSocket Handshake with Authentication

  Client                              Server
    |                                   |
    |-- POST /auth/login -------------->|
    |<-- { accessToken: "jwt..." } -----|
    |                                   |
    |-- WebSocket connect ------------->|
    |   auth: { token: "jwt..." }       |
    |                                   |
    |                         +---------------------+
    |                         | Handshake middleware |
    |                         | jwtService.verify()  |
    |                         +---------------------+
    |                                   |
    |         +-------------------------+-------------------------+
    |         |                                                   |
    |         v                                                   v
    |   Token valid                                         Token invalid
    |         |                                                   |
    |         v                                                   v
    |   socket.data.user = payload                          next(new Error())
    |   next()                                              connection rejected
    |         |                                                   |
    |         v                                                   |
    |   handleConnection() runs                             Client receives
    |   Client is connected                                 "connect_error"
    |                                                           |
    +-----------------------------------------------------------+

  Handshake data available:
    socket.handshake.auth.token
    socket.handshake.headers.authorization
    socket.handshake.headers.cookie
    socket.handshake.query.token

  Security rule:
    Authenticate at the HANDSHAKE, not per message.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// WEBSOCKET HANDSHAKE AND AUTHENTICATION
// ============================================

// ---------- 1. Client sends JWT in auth payload ----------
// const socket = io('http://localhost:3000', {
//   auth: { token: 'eyJhbGciOiJIUzI1NiIs...' },
// });

// ---------- 2. Server validates in afterInit middleware ----------
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' } })
export class AuthGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AuthGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  // ============================================
  // HANDSHAKE AUTHENTICATION
  // ============================================
  afterInit(server: Server) {
    server.use((socket, next) => {
      // Extract token from the auth payload.
      const token = socket.handshake.auth.token;

      if (!token) {
        this.logger.warn('Connection rejected: no token provided');
        return next(new Error('Authentication token required'));
      }

      try {
        // Verify the JWT. This also checks expiration.
        const payload = this.jwtService.verify(token);

        // Attach the authenticated user to the socket.
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
    });
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

// ---------- 4. Guard for message-level authorization ----------
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Switch to WebSocket context.
    const client = context.switchToWs().getClient<Socket>();
    const userId = client.data.userId;

    if (!userId) {
      throw new WsException('Unauthenticated');
    }

    // The user is authenticated at the handshake.
    // This guard can check authorization (roles, permissions).
    return true;
  }
}

// Usage on a message handler:
@UseGuards(WsAuthGuard)
@SubscribeMessage('adminAction')
handleAdminAction(@ConnectedSocket() client: Socket) {
  // Only authenticated users reach here.
  // client.data.userId is guaranteed to exist.
}

// ---------- 5. Client-side error handling ----------
// const socket = io('http://localhost:3000', {
//   auth: { token },
// });
//
// socket.on('connect_error', (err) => {
//   if (err.message === 'Invalid or expired token') {
//     // Refresh the token and reconnect.
//     refreshToken().then((newToken) => {
//       socket.auth.token = newToken;
//       socket.connect();
//     });
//   }
// });

// ---------- 6. What NOT to do ----------
// BAD: Token in query string (logged, cached, visible in history).
// const socket = io('http://localhost:3000?token=jwt...');

// BAD: No authentication at all.
// afterInit(server) { /* nothing */ }
// Any client can connect and send messages.

// BAD: Authenticating in every message handler.
// @SubscribeMessage('sendMessage')
// handleMessage(@MessageBody() data, @ConnectedSocket() client) {
//   const token = data.token; // Wasteful and error-prone.
// }
      ` },
      keyTakeaways: [
        "The handshake is the only moment to authenticate a WebSocket connection before it is fully established.",
        "Authenticate at the handshake, not per message — it is more efficient and more secure.",
        "Socket.IO exposes the handshake request via `socket.handshake`, including `auth`, `headers`, and `query`.",
        "Use the same `JwtService` for WebSocket authentication as for HTTP — one source of truth.",
        "Attach the authenticated user to `socket.data.user` so message handlers can access it.",
        "Reject invalid connections with `next(new Error(...))` — the client receives a `connect_error` event.",
        "Use guards on message handlers for authorization (roles, permissions) after authentication at the handshake.",
      ],
      commonMistakes: [
        "<b>Not authenticating at all.</b> An unauthenticated client can connect and send messages. If your handlers assume authentication, you have a security hole.",
        "<b>Authenticating per message instead of at handshake.</b> Wasteful and error-prone. The handshake is the right place .",
        "<b>Putting the token in the query string.</b> Query strings are logged, cached, and visible in browser history. Use the `auth` payload or a header instead.",
        "<b>Not validating token expiration.</b> `jwtService.verify()` checks expiration by default. Do not use `decode()` without verifying.",
        "<b>Using a different secret for WebSocket.</b> Use the same JWT secret as HTTP. Otherwise, you have two authentication systems to maintain.",
        "<b>Not handling the rejection on the client.</b> When the server rejects with `next(new Error())`, the client must handle the `connect_error` event and prompt for re-authentication.",
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
            "The handshake is the security boundary. Validating once at the handshake rejects invalid connections early and avoids running validation logic on every message .",
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
            "What happens when the handshake middleware calls `next(new Error('Unauthorized'))`?",
          options: [
            "The connection is silently dropped.",
            "The client receives a `connect_error` event with the error message.",
            "The server crashes.",
            "The client is automatically redirected to login.",
          ],
          correctIndex: 1,
          explanation:
            "Errors passed to the middleware callback are sent to the client as `connect_error` packets. The client can listen for this event and handle re-authentication .",
        },
        {
          question:
            "What is the purpose of a guard on a WebSocket message handler?",
          options: [
            "To authenticate the connection at the handshake.",
            "To authorize specific actions (roles, permissions) after authentication at the handshake.",
            "To validate message syntax.",
            "To encrypt messages.",
          ],
          correctIndex: 1,
          explanation:
            "Guards run before message handlers and can check authorization rules (does this user have permission to perform this action?). Authentication happens at the handshake; guards handle authorization .",
        },
      ],
    },
    {
      id: "day-71-lesson-3",
      title: "Connections",
      durationMinutes: 22,
      explanation: `
<b>A WebSocket connection is not just a pipe.</b> It has a lifecycle: it is established, it lives for minutes or hours, and it ends — sometimes cleanly, sometimes abruptly. Managing that lifecycle is what separates a toy WebSocket demo from a production real-time system.

<b>Connection lifecycle in NestJS.</b> Every WebSocket connection goes through three phases, each with a corresponding hook you can implement in your gateway :

1. **Initialization:** \`afterInit(server)\` runs once when the gateway is initialized. Use it to set up middleware, external connections, and logging.
2. **Connection:** \`handleConnection(client)\` runs for each new client. Use it to track online users, join default rooms, and send initial state.
3. **Disconnection:** \`handleDisconnect(client)\` runs when a client disconnects. Use it to clean up resources and notify others.

These hooks are optional — implement only what you need. But in a production system, you will implement at least \`handleConnection\` and \`handleDisconnect\` .

<b>Tracking connected clients.</b> The most common use of \`handleConnection\` and \`handleDisconnect\` is maintaining a map of online users. This lets you:
- Know who is online.
- Target a specific user (e.g. send a notification to user 42).
- Clean up state when a user disconnects.

\`\`\`typescript
private readonly onlineUsers = new Map<string, string>(); // userId -> socketId

handleConnection(client: Socket) {
  const userId = client.data.userId;
  this.onlineUsers.set(userId, client.id);
}

handleDisconnect(client: Socket) {
  const userId = client.data.userId;
  this.onlineUsers.delete(userId);
}
\`\`\`

<b>Why a Map instead of an object?</b> Both work, but a \`Map\` is cleaner for key-value storage, has a \`.size\` property, and avoids prototype pollution issues. Use \`Map\` for tracking online users.

<b>Critical: gateways are singletons.</b> A gateway instance is shared across all connections. This means:
- Instance variables are shared. Do not store per-user state in \`this.someVariable\` — it will be overwritten by the next user.
- Use a \`Map\` keyed by user id or socket id for per-user state.
- The \`onlineUsers\` map is the standard pattern .

<b>Handling disconnections gracefully.</b> A disconnection can happen for many reasons:
- The client closed the browser tab.
- The network dropped.
- The server restarted.
- The client was kicked (e.g. token expired).

In all cases, \`handleDisconnect\` runs. Use it to:
1. Remove the user from the online map.
2. Leave all rooms (Socket.IO does this automatically, but you may want to notify others).
3. Clear any timers or intervals associated with the connection.
4. Save any pending state.

\`\`\`typescript
handleDisconnect(client: Socket) {
  const userId = client.data.userId;
  this.onlineUsers.delete(userId);

  // Notify others that the user is offline.
  this.server.emit('userOffline', { userId });

  // Clear any pending timers.
  const timer = this.pendingTimers.get(client.id);
  if (timer) {
    clearTimeout(timer);
    this.pendingTimers.delete(client.id);
  }
}
\`\`\`

<b>Multiple connections per user.</b> A user can have multiple tabs open, or a phone and a laptop. Each connection is a separate socket with a different \`socket.id\`. If you track users by a single socket id, you will overwrite the previous one.

Solutions:
- **Track a set of socket ids per user:** \`Map<string, Set<string>>\`.
- **Track each socket independently and look up by user when needed:** iterate the sockets or use a reverse index.
- **Use rooms:** join each user to a room named \`user:{userId}\` on connect, and leave on disconnect. Then \`server.to(\`user:\${userId}\`).emit(...)\` reaches all their connections .

The room approach is the cleanest for most applications.

<b>Connection state and authentication.</b> After the handshake, \`socket.data\` contains the authenticated user. This data persists for the life of the connection. Use it in every message handler:

\`\`\`typescript
@SubscribeMessage('sendMessage')
handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
  const userId = client.data.userId; // Always available
  // ...
}
\`\`\`

<b>What can go wrong?</b>
- <b>Not cleaning up in \`handleDisconnect\`.</b> The online map grows forever. Disconnected users appear online. Timers keep running. Memory leaks .
- <b>Storing per-user state in instance variables.</b> Gateways are singletons. \`this.currentUser\` is overwritten by every new connection. Use a \`Map\`.
- <b>Overwriting socket ids for the same user.</b> If user 42 opens two tabs, the second \`socket.id\` overwrites the first in a simple map. Use a room or a set of socket ids.
- <b>Assuming \`handleDisconnect\` always runs immediately.</b> On a network drop, the server may not know for seconds or minutes. The client should detect the drop and reconnect; the server should clean up based on heartbeats.
- <b>Not handling reconnection.</b> When a client reconnects, it gets a new socket id and a new connection. The application must re-establish state (rejoin rooms, re-subscribe). Socket.IO handles the transport reconnection, but your application state is yours to manage.

<b>How this appears in a real application.</b> A chat application tracks online users in a \`Map<userId, Set<socketId>>\`. When a user connects, their socket id is added to the set. When they disconnect, it is removed. If the set becomes empty, the user is considered offline. When a user has multiple tabs open, all tabs receive messages addressed to that user. The \`handleDisconnect\` hook ensures that closing one tab does not mark the user as offline if another tab is still open.

<b>How experienced engineers think.</b> Connection lifecycle is about resource management. Every connection consumes memory and possibly timers. Every disconnect must release them. A gateway that does not clean up is a memory leak waiting to happen. Track state explicitly, clean up aggressively, and assume connections will drop without warning.
      `,
      diagram: `
Connection Lifecycle in NestJS Gateways

  Server starts
        |
        v
  afterInit(server)          <- Once
  - Register middleware
  - Set up external connections
        |
        v
  Client connects (handshake authenticated)
        |
        v
  handleConnection(client)   <- Per connection
  - Add to onlineUsers map
  - Join default rooms
  - Send initial state
        |
        v
  +-------------------------------+
  |  Message handlers             |
  |  @SubscribeMessage('event')   |
  |  - Use client.data.userId     |
  |  - Emit to rooms              |
  +-------------------------------+
        |
        v
  Client disconnects
        |
        v
  handleDisconnect(client)   <- Per disconnection
  - Remove from onlineUsers map
  - Leave rooms
  - Clear timers
  - Notify others
        |
        v
  Server shuts down

  State management:
    Gateways are singletons.
    Use Map<userId, socketId> or Map<userId, Set<socketId>>.
    Do NOT use instance variables for per-user state.

  Multiple connections per user:
    Use a room: client.join(\`user:\${userId}\`)
    Then: server.to(\`user:\${userId}\`).emit(...)
    Reaches all tabs/devices for that user.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// CONNECTION LIFECYCLE MANAGEMENT
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

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ConnectionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ConnectionGateway.name);

  // Track online users: userId -> Set of socketIds
  // A user can have multiple connections (tabs, devices).
  private readonly onlineUsers = new Map<string, Set<string>>();

  // Track pending timers to clean up on disconnect.
  private readonly pendingTimers = new Map<string, NodeJS.Timeout>();

  // ============================================
  // INITIALIZATION (once)
  // ============================================
  afterInit(server: Server) {
    this.logger.log('Connection gateway initialized');
  }

  // ============================================
  // CONNECTION (per client)
  // ============================================
  handleConnection(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(\`User \${userId} connected (socket: \${client.id})\`);

    // Add to online tracking.
    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, new Set());
    }
    this.onlineUsers.get(userId)!.add(client.id);

    // Join a user-specific room so we can target all
    // of this user's connections.
    client.join(\`user:\${userId}\`);

    // Set up a periodic task for this connection.
    const timer = setInterval(() => {
      client.emit('heartbeat', { timestamp: Date.now() });
    }, 30000);
    this.pendingTimers.set(client.id, timer);

    // Notify others that the user is online.
    this.server.emit('userOnline', {
      userId,
      onlineCount: this.getOnlineUserCount(),
    });

    // Send initial state to the connected client.
    client.emit('connected', {
      userId,
      socketId: client.id,
      onlineCount: this.getOnlineUserCount(),
    });
  }

  // ============================================
  // DISCONNECTION (per client)
  // ============================================
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(\`User \${userId} disconnected (socket: \${client.id})\`);

    // Remove this socket from the user's set.
    const sockets = this.onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(client.id);

      // If the user has no more connections, they are offline.
      if (sockets.size === 0) {
        this.onlineUsers.delete(userId);
        this.server.emit('userOffline', { userId });
      }
    }

    // Clear the heartbeat timer for this connection.
    const timer = this.pendingTimers.get(client.id);
    if (timer) {
      clearInterval(timer);
      this.pendingTimers.delete(client.id);
    }
  }

  // ============================================
  // MESSAGE HANDLERS
  // ============================================
  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId; // Always available after handshake.

    this.server.to(data.roomId).emit('message', {
      userId,
      text: data.text,
      timestamp: new Date().toISOString(),
    });

    return { sent: true };
  }

  // ============================================
  // UTILITY METHODS
  // ============================================
  getOnlineUserCount(): number {
    return this.onlineUsers.size;
  }

  isUserOnline(userId: string): boolean {
    const sockets = this.onlineUsers.get(userId);
    return !!sockets && sockets.size > 0;
  }

  getSocketIdsForUser(userId: string): string[] {
    return Array.from(this.onlineUsers.get(userId) ?? []);
  }
}

// ============================================
// REGISTERING THE GATEWAY
// ============================================
import { Module } from '@nestjs/common';

@Module({
  providers: [ConnectionGateway],
})
export class ChatModule {}

// ============================================
// WHAT NOT TO DO
// ============================================

// BAD: Storing per-user state in instance variables.
// private currentUserId: string;  // Overwritten by every connection!

// GOOD: Use a Map keyed by user id or socket id.
// private readonly onlineUsers = new Map<string, Set<string>>();

// BAD: Not cleaning up in handleDisconnect.
// The onlineUsers map and pendingTimers grow forever.

// GOOD: Remove from maps and clear timers.
// handleDisconnect(client) {
//   this.onlineUsers.delete(client.data.userId);
//   clearInterval(this.pendingTimers.get(client.id));
// }

// BAD: Assuming a user has only one connection.
// this.onlineUsers.set(userId, client.id); // Overwrites on second tab.

// GOOD: Track a set of socket ids per user.
// this.onlineUsers.get(userId)!.add(client.id);
      ` },
      keyTakeaways: [
        "WebSocket connections have a lifecycle: `afterInit` (once), `handleConnection` (per client), `handleDisconnect` (per disconnection).",
        "Track online users in a `Map<userId, Set<socketId>>` to handle multiple connections per user.",
        "Gateways are singletons — instance variables are shared. Use maps keyed by user/socket id for per-connection state.",
        "Always clean up in `handleDisconnect`: remove from maps, clear timers, leave rooms.",
        "Join each user to a room named `user:{userId}` so you can target all their connections with one emit.",
        "A user is offline only when all their socket ids have been removed from the set.",
        "Assume connections will drop without warning — the client reconnects with a new socket id, and your application must re-establish state.",
      ],
      commonMistakes: [
        "<b>Not cleaning up in `handleDisconnect`.</b> The online map grows forever, disconnected users appear online, and timers keep running .",
        "<b>Storing per-user state in instance variables.</b> Gateways are singletons. `this.currentUser` is overwritten by every new connection. Use a `Map`.",
        "<b>Overwriting socket ids for the same user.</b> If a user opens two tabs, the second `socket.id` overwrites the first in a simple map. Use a set of socket ids or a room.",
        "<b>Assuming `handleDisconnect` runs immediately.</b> On a network drop, the server may not know for seconds or minutes. The client should detect the drop and reconnect; the server cleans up based on heartbeats.",
        "<b>Not handling reconnection.</b> When a client reconnects, it gets a new socket id. Your application must re-establish state (rejoin rooms, re-subscribe).",
      ],
      quiz: [
        {
          question:
            "Why should you use a `Map<string, Set<string>>` instead of a `Map<string, string>` for tracking online users?",
          options: [
            "Because Maps are faster than objects.",
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
            "What happens if you store per-user state in an instance variable on a gateway?",
          options: [
            "It works correctly because gateways create a new instance per connection.",
            "It is overwritten by the next connection because gateways are singletons.",
            "It causes a TypeScript error.",
            "It is automatically scoped per connection.",
          ],
          correctIndex: 1,
          explanation:
            "Gateways are singletons — one instance is shared across all connections. An instance variable like `this.currentUser` is overwritten by every new connection. Use a `Map` keyed by user or socket id.",
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
            "A user is offline only when they have no active connections. If they have two tabs open and one closes, they are still online via the other tab .",
        },
        {
          question:
            "Why should you join a user to a room named `user:{userId}` on connection?",
          options: [
            "To isolate their messages from other users.",
            "So you can emit to all of their connections (tabs, devices) with a single `server.to()` call.",
            "To make the connection faster.",
            "Because Socket.IO requires it.",
          ],
          correctIndex: 1,
          explanation:
            "A user-specific room lets you target all of a user's active connections with one emit. This is cleaner than iterating over their socket ids manually .",
        },
      ],
    },
    {
      id: "day-71-lesson-4",
      title: "Events, Rooms, and Broadcasting",
      durationMinutes: 24,
      explanation: `
<b>Once a connection is established, the real work begins: sending and receiving messages.</b> In Socket.IO, messages are called <b>events</b>. An event has a name (like \`message\` or \`userJoined\`) and a payload (any serializable data). Events can be sent to a single client, to a room, or to everyone connected .

<b>Events in NestJS.</b> On the server, you handle events with \`@SubscribeMessage('eventName')\`. The return value of the handler is sent back to the client as an acknowledgment .

\`\`\`typescript
@SubscribeMessage('message')
handleMessage(@MessageBody() data: string): string {
  return data; // Sent back as acknowledgment.
}
\`\`\`

If you want to emit an event without acknowledging, use \`client.emit()\` on the connected socket. If you want to broadcast to multiple clients, use \`this.server.emit()\` or \`this.server.to(room).emit()\` .

<b>Rooms: the foundation of targeted broadcasts.</b> A room is a logical grouping of sockets. When you emit to a room, only sockets that have joined that room receive the event. Rooms are created on the server side — no configuration or initialization is needed. A socket can join multiple rooms, and a room can contain many sockets .

Common uses of rooms:
- **Chat conversations:** each conversation is a room.
- **Document collaboration:** each document is a room.
- **User notifications:** each user has a room named \`user:{userId}\`.
- **Presence tracking:** a room for "all online users."

\`\`\`typescript
// Join a room.
client.join('room-42');

// Emit to a room.
this.server.to('room-42').emit('message', { text: 'hello' });

// Leave a room.
client.leave('room-42');
\`\`\`

<b>Broadcasting patterns.</b> Socket.IO provides several ways to broadcast :

| Pattern | Code | Reaches |
|---------|------|---------|
| To all clients | \`io.emit('event', data)\` | Everyone |
| To a room | \`io.to('room').emit('event', data)\` | Room members |
| To multiple rooms | \`io.to('room1').to('room2').emit(...)\` | Members of either room |
| To all except a room | \`io.except('room').emit(...)\` | Everyone not in the room |
| From one client to others | \`client.broadcast.emit(...)\` | Everyone except the sender |
| From one client to a room | \`client.to('room').emit(...)\` | Room members except the sender |

<b>The sender exclusion pattern.</b> In a chat application, when a user sends a message, you usually want everyone <i>except</i> the sender to receive it, because the sender already sees their own message in the UI. Use \`client.broadcast.emit()\` or \`client.to(room).emit()\` .

\`\`\`typescript
@SubscribeMessage('message')
handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
  // Send to everyone in the room except the sender.
  client.to('room-42').emit('message', { text: data, from: client.data.userId });
}
\`\`\`

<b>Emitting from a service.</b> Sometimes you need to emit an event from outside a message handler — for example, when an HTTP request creates a resource and you want to notify WebSocket clients. Inject the gateway into the service and use \`@WebSocketServer()\` .

\`\`\`typescript
@Injectable()
export class OrdersService {
  constructor(private readonly ordersGateway: OrdersGateway) {}

  async createOrder(dto: CreateOrderDto) {
    const order = await this.orderRepo.save(dto);
    // Notify all admins via WebSocket.
    this.ordersGateway.notifyAdmins(order);
    return order;
  }
}

@WebSocketGateway()
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  notifyAdmins(order: Order) {
    this.server.to('room:admins').emit('orderCreated', order);
  }
}
\`\`\`

This is the standard pattern for pushing server-side events to connected clients.

<b>Acknowledgments.</b> In addition to fire-and-forget events, Socket.IO supports acknowledgments — a request-response pattern over WebSocket. The client sends an event with a callback, and the server calls the callback with a response .

\`\`\`typescript
// Client
socket.emit('getUser', { id: 42 }, (response) => {
  console.log(response); // { id: 42, name: 'Ada' }
});

// Server
@SubscribeMessage('getUser')
handleGetUser(@MessageBody('id') id: number) {
  return { id, name: 'Ada' }; // Sent as acknowledgment
}
\`\`\`

Returning a value from a \`@SubscribeMessage\` handler is the acknowledgment. If you do not want to acknowledge, omit the return (or return \`undefined\`) .

<b>What can go wrong?</b>
- <b>Emitting before the client joins a room.</b> The message is lost. Ensure the join happens before the emit.
- <b>Not checking room membership.</b> A client can join any room unless you validate permissions. Always check that the user has access to the room before joining .
- <b>Broadcasting to all clients unnecessarily.</b> \`io.emit()\` reaches everyone. Use rooms to target subsets.
- <b>Forgetting \`client.broadcast\` vs \`client.to\`.</b> \`client.broadcast.emit()\` reaches everyone except the sender. \`client.to(room).emit()\` reaches room members except the sender. \`this.server.to(room).emit()\` reaches room members including the sender.
- <b>Not handling serialization.</b> Socket.IO serializes data automatically. Do not call \`JSON.stringify()\` before emitting .
- <b>Assuming events are delivered reliably.</b> WebSocket events are not guaranteed to be delivered. If reliability matters, implement acknowledgments or a message queue.

<b>How this appears in a real application.</b> A chat application:
- Each conversation is a room.
- On connect, the user joins all their conversation rooms.
- When a message is sent, the server saves it and emits to the room (excluding the sender).
- When a user is added to a conversation, the server joins them to the room and notifies others.
- When a user leaves, the server removes them from the room.

A notification system:
- Each user has a room \`user:{userId}\`.
- On connect, the user joins their personal room.
- When a notification is created (via HTTP or a service), the server emits to \`user:{userId}\`.
- The user receives it on all their connected devices.

<b>How experienced engineers think.</b> Rooms are the primary mechanism for organizing WebSocket communication. Instead of tracking which sockets should receive which messages manually, you join sockets to rooms and emit to rooms. This scales cleanly, handles multiple connections per user, and makes the intent of your code clear. If you find yourself iterating over socket ids, you probably want a room instead.
      `,
      diagram: `
Events, Rooms, and Broadcasting

  Server
    |
    +-- Room: conversation:1
    |     +-- Client A (user:1)
    |     +-- Client B (user:2)
    |
    +-- Room: conversation:2
    |     +-- Client B (user:2)
    |     +-- Client C (user:3)
    |
    +-- Room: user:1
    |     +-- Client A (user:1)
    |
    +-- Room: user:2
          +-- Client B (user:2)

  Broadcasting patterns:

    io.emit('event', data)
      -> reaches ALL clients

    io.to('conversation:1').emit('event', data)
      -> reaches Client A and Client B

    io.to('conversation:1').to('conversation:2').emit(...)
      -> reaches A, B, C

    io.except('conversation:2').emit(...)
      -> reaches A only

    client.broadcast.emit('event', data)
      -> reaches everyone EXCEPT the sender

    client.to('conversation:1').emit('event', data)
      -> reaches room members EXCEPT the sender

  Acknowledgments:
    client emits 'getUser' with callback
    server returns value -> callback called with value
      `,
      codeExample: { title: "Example", code: `
// ============================================
// EVENTS, ROOMS, AND BROADCASTING
// ============================================

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  // ============================================
  // CONNECTION: Join default rooms
  // ============================================
  handleConnection(client: Socket) {
    const userId = client.data.userId;

    // Every user joins their own room.
    client.join(\`user:\${userId}\`);

    // In production: fetch the user's conversations
    // and join all of them.
    const conversationIds = ['conversation:1', 'conversation:2'];
    conversationIds.forEach((roomId) => client.join(roomId));
  }

  // ============================================
  // EVENTS: Handling messages
  // ============================================
  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    // Validate room membership before allowing the message.
    if (!client.rooms.has(data.roomId)) {
      return { error: 'Not a member of this room' };
    }

    // Broadcast to the room EXCEPT the sender.
    client.to(data.roomId).emit('message', {
      userId,
      text: data.text,
      timestamp: new Date().toISOString(),
    });

    // Return an acknowledgment to the sender.
    return { sent: true };
  }

  // ============================================
  // EVENTS: Join and leave rooms
  // ============================================
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // In production: validate that the user has access to this room.
    client.join(roomId);

    // Notify others in the room.
    client.to(roomId).emit('userJoined', {
      userId: client.data.userId,
      roomId,
    });

    return { joined: roomId };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
    client.to(roomId).emit('userLeft', {
      userId: client.data.userId,
      roomId,
    });
    return { left: roomId };
  }

  // ============================================
  // BROADCASTING: Patterns
  // ============================================

  // To ALL connected clients.
  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  // To a specific room (including sender if they are a member).
  broadcastToRoom(roomId: string, event: string, data: any) {
    this.server.to(roomId).emit(event, data);
  }

  // To multiple rooms.
  broadcastToMultipleRooms(roomIds: string[], event: string, data: any) {
    let operator = this.server.to(roomIds[0]);
    for (let i = 1; i < roomIds.length; i++) {
      operator = operator.to(roomIds[i]);
    }
    operator.emit(event, data);
  }

  // To a specific user (all their connections).
  broadcastToUser(userId: string, event: string, data: any) {
    this.server.to(\`user:\${userId}\`).emit(event, data);
  }

  // To everyone EXCEPT a room.
  broadcastToAllExceptRoom(roomId: string, event: string, data: any) {
    this.server.except(roomId).emit(event, data);
  }
}

// ============================================
// EMITTING FROM A SERVICE
// ============================================

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersGateway: OrdersGateway,
    private readonly orderRepo: Repository<Order>,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const order = await this.orderRepo.save(dto);

    // Notify the customer via their personal room.
    this.ordersGateway.emitToUser(
      order.userId,
      'orderCreated',
      order,
    );

    // Notify admins.
    this.ordersGateway.emitToRoom(
      'room:admins',
      'newOrder',
      order,
    );

    return order;
  }
}

@WebSocketGateway()
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(\`user:\${userId}\`).emit(event, data);
  }

  emitToRoom(roomId: string, event: string, data: any) {
    this.server.to(roomId).emit(event, data);
  }
}

// ============================================
// ACKNOWLEDGMENTS
// ============================================

@SubscribeMessage('getUser')
handleGetUser(
  @MessageBody('id') id: number,
  @ConnectedSocket() client: Socket,
) {
  // The return value is sent as an acknowledgment.
  return {
    id,
    name: 'Ada',
    requestedBy: client.data.userId,
  };
}

// Client side:
// socket.emit('getUser', { id: 42 }, (response) => {
//   console.log(response); // { id: 42, name: 'Ada', ... }
// });

// ============================================
// WHAT NOT TO DO
// ============================================

// BAD: Emitting before the client joins the room.
// this.server.to('room-42').emit('message', data);
// client.join('room-42'); // Too late!

// BAD: Not validating room membership.
// client.join(anyRoomIdFromTheClient); // Security hole!

// BAD: Broadcasting to all when only a subset needs it.
// this.server.emit('newMessage', data); // Reaches everyone.

// BAD: Calling JSON.stringify before emitting.
// this.server.emit('data', JSON.stringify(order)); // Double-encoded!
      ` },
      keyTakeaways: [
        "Events are the messages exchanged over WebSocket. They have a name and a payload.",
        "Handle events with `@SubscribeMessage('eventName')`; the return value is sent as an acknowledgment.",
        "Rooms are logical groupings of sockets for targeted broadcasts. Join with `client.join()`, emit with `server.to()`.",
        "Use `client.to(room).emit()` to broadcast to a room excluding the sender.",
        "Use `client.broadcast.emit()` to broadcast to all clients except the sender.",
        "Always validate room membership before allowing a client to join a room.",
        "Inject the gateway into services to emit events from outside message handlers (e.g. after an HTTP request).",
        "Return a value from a handler to acknowledge; omit the return to send no acknowledgment.",
      ],
      commonMistakes: [
        "<b>Emitting before the client joins a room.</b> The message is lost. Ensure the join happens before the emit.",
        "<b>Not checking room membership.</b> A client can join any room unless you validate permissions. Always check before joining .",
        "<b>Broadcasting to all clients unnecessarily.</b> `io.emit()` reaches everyone. Use rooms to target subsets.",
        "<b>Confusing `client.broadcast` vs `client.to`.</b> `client.broadcast.emit()` reaches everyone except the sender. `client.to(room).emit()` reaches room members except the sender.",
        "<b>Calling `JSON.stringify()` before emitting.</b> Socket.IO serializes data automatically. Calling `JSON.stringify()` double-encodes it .",
        "<b>Assuming events are delivered reliably.</b> WebSocket events are not guaranteed. If reliability matters, implement acknowledgments or a message queue.",
      ],
      quiz: [
        {
          question:
            "What does `client.broadcast.emit('message', data)` do?",
          options: [
            "Sends to all clients including the sender.",
            "Sends to all clients except the sender.",
            "Sends only to the sender.",
            "Sends to a specific room.",
          ],
          correctIndex: 1,
          explanation:
            "`client.broadcast.emit()` reaches every connected client except the sender. This is useful in chat applications where the sender already sees their own message .",
        },
        {
          question:
            "How do you emit an event to a specific room?",
          options: [
            "`client.emit('room', data)`",
            "`this.server.to('room').emit('event', data)`",
            "`this.server.emit('room', data)`",
            "`client.join('room').emit('event', data)`",
          ],
          correctIndex: 1,
          explanation:
            "`this.server.to(room).emit(event, data)` emits to all sockets in the room. The `to()` method can be chained to target multiple rooms .",
        },
        {
          question:
            "What happens if you emit to a room before the client has joined it?",
          options: [
            "The client receives the message anyway.",
            "The message is lost — the client is not in the room yet.",
            "The client is automatically joined to the room.",
            "The server throws an error.",
          ],
          correctIndex: 1,
          explanation:
            "Rooms only contain sockets that have explicitly joined. If the client has not joined, the emit does not reach them. Ensure joins happen before emits.",
        },
        {
          question:
            "How do you send an acknowledgment back to the client from a message handler?",
          options: [
            "Call `client.ack()`.",
            "Return a value from the `@SubscribeMessage` handler.",
            "Call `this.server.ack()`.",
            "Acknowledgment is automatic for all handlers.",
          ],
          correctIndex: 1,
          explanation:
            "The return value of a `@SubscribeMessage` handler is sent back to the client as an acknowledgment. If you do not want to acknowledge, omit the return .",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the main advantage of WebSocket over HTTP polling?",
      options: [
        "WebSocket uses less bandwidth for large payloads.",
        "WebSocket provides full-duplex communication over a single persistent connection, eliminating the overhead of repeated HTTP requests.",
        "WebSocket is more secure than HTTP.",
        "WebSocket works on more devices than HTTP.",
      ],
      correctIndex: 1,
      explanation: "WebSocket keeps a single connection open and allows both sides to send messages at any time. HTTP polling requires a new request for every check .",
    },
    {
      question: "What HTTP status code indicates a successful WebSocket upgrade?",
      options: ["200 OK", "201 Created", "101 Switching Protocols", "301 Moved Permanently"],
      correctIndex: 2,
      explanation: "`101 Switching Protocols` is returned by the server when it agrees to upgrade the HTTP connection to WebSocket .",
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
      explanation: "Authentication should happen at the handshake, before the connection is fully established. Per-message validation is wasteful and error-prone .",
    },
    {
      question: "How should the client send the JWT when connecting via Socket.IO?",
      options: [
        "In the URL query string.",
        "In the `auth` payload of the connection options.",
        "In the message body of the first message.",
        "In a cookie only.",
      ],
      correctIndex: 1,
      explanation: "Socket.IO provides the `auth` object in the connection options for authentication data. It is accessible via `socket.handshake.auth` .",
    },
    {
      question: "Why should you use a `Map<string, Set<string>>` for tracking online users?",
      options: [
        "Because Maps are faster than objects.",
        "Because a user can have multiple connections (tabs, devices), and a set tracks all of them without overwriting.",
        "Because TypeScript requires it.",
        "Because sets use less memory.",
      ],
      correctIndex: 1,
      explanation: "A user can open multiple tabs. A `Map<userId, Set<socketId>>` tracks all their connections. A `Map<userId, socketId>` would overwrite .",
    },
    {
      question: "What happens if you store per-user state in an instance variable on a gateway?",
      options: [
        "It works correctly because gateways create a new instance per connection.",
        "It is overwritten by the next connection because gateways are singletons.",
        "It causes a TypeScript error.",
        "It is automatically scoped per connection.",
      ],
      correctIndex: 1,
      explanation: "Gateways are singletons — one instance shared across all connections. Instance variables are overwritten by every new connection. Use a `Map`.",
    },
    {
      question: "What does `client.broadcast.emit('message', data)` do?",
      options: [
        "Sends to all clients including the sender.",
        "Sends to all clients except the sender.",
        "Sends only to the sender.",
        "Sends to a specific room.",
      ],
      correctIndex: 1,
      explanation: "`client.broadcast.emit()` reaches every connected client except the sender .",
    },
    {
      question: "How do you emit an event to a specific room?",
      options: [
        "`client.emit('room', data)`",
        "`this.server.to('room').emit('event', data)`",
        "`this.server.emit('room', data)`",
        "`client.join('room').emit('event', data)`",
      ],
      correctIndex: 1,
      explanation: "`this.server.to(room).emit(event, data)` emits to all sockets in the room .",
    },
    {
      question: "What happens if you emit to a room before the client has joined it?",
      options: [
        "The client receives the message anyway.",
        "The message is lost — the client is not in the room yet.",
        "The client is automatically joined to the room.",
        "The server throws an error.",
      ],
      correctIndex: 1,
      explanation: "Rooms only contain sockets that have explicitly joined. If the client has not joined, the emit does not reach them.",
    },
    {
      question: "How do you send an acknowledgment back to the client from a message handler?",
      options: [
        "Call `client.ack()`.",
        "Return a value from the `@SubscribeMessage` handler.",
        "Call `this.server.ack()`.",
        "Acknowledgment is automatic for all handlers.",
      ],
      correctIndex: 1,
      explanation: "The return value of a `@SubscribeMessage` handler is sent back to the client as an acknowledgment .",
    },
    {
      question: "What is the correct way to handle a client disconnect?",
      options: [
        "Do nothing — Socket.IO handles it automatically.",
        "Implement `handleDisconnect` to remove the user from maps and clear timers.",
        "Restart the server.",
        "Send an email notification.",
      ],
      correctIndex: 1,
      explanation: "`handleDisconnect` is where you clean up: remove from online maps, clear timers, notify others. Without it, memory leaks accumulate .",
    },
    {
      question: "What is the purpose of a namespace in Socket.IO?",
      options: [
        "To encrypt messages.",
        "To separate communication channels on a single connection (e.g. `/chat`, `/notifications`).",
        "To compress data.",
        "To authenticate users.",
      ],
      correctIndex: 1,
      explanation: "Namespaces are separate communication channels on one connection. They let you separate concerns like chat and notifications .",
    },
    {
      question: "What should you do if a client tries to join a room?",
      options: [
        "Allow it — rooms have no security implications.",
        "Validate that the user has permission to access the room before allowing the join.",
        "Log the attempt but allow it.",
        "Redirect them to a login page.",
      ],
      correctIndex: 1,
      explanation: "Rooms are not a security mechanism. Always validate that the user has access to the room before calling `client.join()` .",
    },
    {
      question: "What is the difference between `client.to(room).emit()` and `this.server.to(room).emit()`?",
      options: [
        "They are identical.",
        "`client.to(room)` excludes the sender; `this.server.to(room)` includes the sender.",
        "`client.to(room)` includes the sender; `this.server.to(room)` excludes the sender.",
        "`client.to(room)` is faster.",
      ],
      correctIndex: 1,
      explanation: "`client.to(room).emit()` reaches room members except the sender. `this.server.to(room).emit()` reaches all room members including the sender.",
    },
    {
      question: "Why should you inject a gateway into a service?",
      options: [
        "To make the service faster.",
        "To emit WebSocket events from outside message handlers (e.g. after an HTTP request creates a resource).",
        "Because NestJS requires it.",
        "To authenticate WebSocket connections.",
      ],
      correctIndex: 1,
      explanation: "Injecting the gateway into a service lets the service push events to connected clients when something happens (like an order being created via HTTP) .",
    },
  ],
  project: {
    name: "Build a Real-Time Collaboration Backend with NestJS WebSockets",
    goal:
      "Implement a WebSocket backend for a collaborative document editor using NestJS gateways. Cover the WebSocket protocol, JWT authentication at the handshake, connection lifecycle management, room-based document collaboration, and broadcasting.",
    brief:
      "You are building the backend for a collaborative document editor. Users connect, join document rooms, and see edits from other users in real time. You must authenticate connections via JWT, manage online presence, handle document rooms, and broadcast edits to all collaborators. This project combines every concept from today's lessons.",
    steps: [
      "Create a NestJS project. Add `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`, and `@nestjs/jwt`.",
      "Create a `DocumentsGateway` with namespace `documents`. Implement `OnGatewayInit`, `OnGatewayConnection`, and `OnGatewayDisconnect`.",
      "In `afterInit`, register middleware that validates a JWT from `socket.handshake.auth.token`. On success, attach `userId` and `email` to `socket.data`. On failure, reject with `next(new Error('Unauthorized'))`.",
      "In `handleConnection`, log the connection, join the user to a personal room `user:{userId}`, and emit a `connected` event with the socket id.",
      "In `handleDisconnect`, log the disconnection. Rooms are automatically left, but you may want to emit a `userLeft` event to rooms the user was in.",
      "Implement a `@SubscribeMessage('joinDocument')` handler that validates the user has access to the document, joins the client to the room `document:{documentId}`, and broadcasts `userJoined` to others in the room.",
      "Implement a `@SubscribeMessage('leaveDocument')` handler that leaves the room and broadcasts `userLeft`.",
      "Implement a `@SubscribeMessage('editDocument')` handler that receives `{ documentId, changes }`, validates room membership, and broadcasts the changes to the room excluding the sender using `client.to(room).emit('documentEdited', ...)`.",
      "Implement a `@SubscribeMessage('cursorMove')` handler that broadcasts cursor position to the room excluding the sender.",
      "Create a `DocumentService` with methods `canUserAccess(documentId, userId)` and `saveChanges(documentId, changes)`. Inject it into the gateway.",
      "Add a `DocumentsController` with an HTTP `POST /documents/:id/changes` endpoint that saves changes and emits a `documentEdited` event via the gateway.",
      "Write an e2e test using `socket.io-client` that connects two clients with valid JWTs, both join a document room, one sends an edit, and the other receives it.",
      "Write an e2e test that attempts to connect without a token and verifies the connection is rejected with a `connect_error`.",
    ],
    acceptance: [
      "A client with a valid JWT can connect, join a document, and receive edits from other clients.",
      "A client without a token is rejected at the handshake with `connect_error`.",
      "Edits are broadcast only to clients in the same document room, excluding the sender.",
      "A user's personal room (`user:{userId}`) receives notifications for all their connections.",
      "The gateway validates document access before allowing a join.",
      "The HTTP endpoint for saving changes also broadcasts via WebSocket.",
      "All e2e tests pass.",
    ],
    stretch: [
      "Add a `presence` feature: track which users are editing each document and broadcast the list to the room.",
      "Add rate limiting to the `editDocument` event using a simple in-memory counter per user.",
      "Implement `resyncUserDocuments(userId)` that rejoins a user to all their document rooms when they reconnect.",
      "Add a `WsExceptionFilter` that catches `WsException` and sends a structured error to the client.",
      "Add Redis adapter for multi-pod scaling. Test with two instances connected to the same Redis.",
      "Write a load test with `artillery` that connects 50 concurrent WebSocket clients, each joining a document and sending edits for 60 seconds. Measure message latency.",
    ],
  },
};
