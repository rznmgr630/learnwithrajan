import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_75_LESSONS: LessonDay = {
  day: 75,
  title: "Real-Time Project",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-75-lesson-1",
      title: "Chat",
      durationMinutes: 24,
      explanation: `
<b>Today you build a real-time chat application.</b> Not a toy example — a production-grade NestJS WebSocket backend that handles multiple rooms, direct messaging, delivery state, and the kind of edge cases that break naive implementations. Chat is the classic real-time problem because it forces you to solve every hard part of WebSockets at once: authentication, rooms, message ordering, persistence, and scaling.

<b>Why chat is the perfect capstone.</b> Every feature you have learned over the past weeks shows up here. Gateways from Day 72. Authentication from Day 73. Scaling with Redis from Day 74. The persistence patterns from the database days. Chat is not just one feature — it is a system of features that must work together.

<b>The architecture: separate concerns into layers.</b> A common mistake is putting all chat logic in the gateway. The gateway should be thin: it receives messages, delegates to services, and emits responses. The services handle the real logic: persisting messages, validating room membership, checking user permissions .

\`\`\`
Client
  |
  v
Gateway (thin)          <- receives events, delegates, emits
  |
  v
ChatService (logic)     <- orchestrates persistence, permissions
  |
  +-- MessageService    <- CRUD for messages
  +-- RoomService       <- membership and access
  +-- UserService       <- identity and presence
  |
  v
Database (persistence)
\`\`\`

<b>Message flow, step by step.</b> When a client sends a message:

1. The gateway receives the \`sendMessage\` event with \`{ roomId, text }\`.
2. The gateway validates that the client is authenticated and in the room.
3. The gateway calls \`ChatService.sendMessage(userId, roomId, text)\`.
4. The service persists the message to the database.
5. The service returns the saved message (with an id and timestamp).
6. The gateway broadcasts the message to the room using \`this.server.to(roomId).emit()\`.
7. The gateway returns an acknowledgment to the sender.

Notice that the gateway does not touch the database. It does not know how messages are stored. It only knows how to receive an event and emit a result. This separation is what makes the code testable and maintainable .

<b>Why persist messages.</b> If you only broadcast in memory, messages disappear when the server restarts. Users expect their chat history to persist. The database is the source of truth. The gateway broadcasts, but the database remembers.

<b>A realistic message entity.</b>

\`\`\`typescript
@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column('text')
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
\`\`\`

The \`roomId\` is a string because it encodes both the type and the id (e.g. \`conversation:42\`, \`dm:17\`). The \`userId\` identifies the sender. The \`createdAt\` is set by the database, giving a consistent timestamp across all servers.

<b>Room naming conventions.</b> This matters for authorization. A consistent naming scheme lets you derive the room type from the name:

- \`conversation:{id}\` — a group conversation.
- \`dm:{id}\` — a direct message thread.
- \`channel:{id}\` — a public channel.

When a client asks to join a room, you parse the type and validate access accordingly. Without a naming convention, you have to store room metadata separately and query it on every join.

<b>What can go wrong with a naive chat implementation.</b>

<b>Messages lost on restart.</b> If you only broadcast in memory, history disappears. Persist every message.

<b>Duplicate messages.</b> A client retries after a timeout. Without idempotency (from Day 52), the same message is saved and broadcast twice. Use a client-generated message id and a unique constraint.

<b>Out-of-order messages.</b> Two clients send messages at nearly the same time. Without a stable ordering (like \`createdAt\` from the database), clients may see them in different orders. Always sort by \`createdAt\` and \`id\`.

<b>Unauthorized room joins.</b> A client sends \`joinRoom\` with a room id they do not belong to. Without validation, they receive messages from a private conversation. Always validate membership .

<b>Gateway state leaks.</b> Storing the current user in a gateway instance variable. Gateways are singletons. Use \`socket.data\` and shared services.

<b>A complete send-message handler.</b>

\`\`\`typescript
@SubscribeMessage('sendMessage')
async handleSendMessage(
  @MessageBody() data: { roomId: string; text: string },
  @ConnectedSocket() client: Socket,
) {
  const userId = client.data.userId;

  // 1. Validate room membership.
  if (!client.rooms.has(data.roomId)) {
    throw new WsException('Not a member of this room');
  }

  // 2. Delegate to the service.
  const message = await this.chatService.sendMessage({
    roomId: data.roomId,
    userId,
    text: data.text,
  });

  // 3. Broadcast to the room, including the sender.
  this.server.to(data.roomId).emit('message', message);

  // 4. Acknowledge the sender.
  return { sent: true, messageId: message.id };
}
\`\`\`

<b>How experienced engineers think.</b> Chat looks simple. It is not. Every edge case — duplicate sends, out-of-order delivery, unauthorized joins, message persistence — is a place where a naive implementation breaks. The discipline of keeping the gateway thin and the services smart is what makes the difference between a demo and a product.
      `,
      diagram: `
Chat Architecture

  Client A              Client B              Client C
    |                     |                     |
    |-- sendMessage ----->|                     |
    |                     |                     |
    v                     v                     v
  +--------------------------------------------------+
  |  ChatGateway (thin)                              |
  |  - receives event                                |
  |  - validates room membership                     |
  |  - delegates to ChatService                      |
  |  - broadcasts to room                            |
  +--------------------------------------------------+
                          |
                          v
  +--------------------------------------------------+
  |  ChatService (logic)                             |
  |  - orchestrates persistence                      |
  |  - checks permissions                            |
  |  - returns saved message                         |
  +--------------------------------------------------+
                          |
                          v
  +--------------------------------------------------+
  |  MessageRepository                               |
  |  - inserts message                               |
  |  - returns with id and createdAt                 |
  +--------------------------------------------------+
                          |
                          v
                    PostgreSQL

  Flow:
    1. Client A emits 'sendMessage'
    2. Gateway validates and delegates
    3. Service persists to database
    4. Gateway broadcasts to room
    5. All room members (A, B) receive 'message'
      `,
      codeExample: { title: "Example", code: `
// ============================================
// CHAT — CORE MESSAGING
// ============================================

// ---------- 1. Message entity ----------
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index,
} from 'typeorm';

@Entity('messages')
@Index(['roomId', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column('text')
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}

// ---------- 2. Chat service ----------
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly roomService: RoomService,
  ) {}

  async sendMessage(input: {
    roomId: string;
    userId: string;
    text: string;
  }): Promise<Message> {
    // Validate access (defense in depth).
    const hasAccess = await this.roomService.canAccess(
      input.roomId,
      input.userId,
    );
    if (!hasAccess) {
      throw new WsException('Access denied to this room');
    }

    // Persist the message.
    const message = this.messageRepo.create({
      roomId: input.roomId,
      userId: input.userId,
      text: input.text,
    });

    return this.messageRepo.save(message);
  }

  async getMessages(
    roomId: string,
    limit = 50,
    before?: Date,
  ): Promise<Message[]> {
    const query = this.messageRepo
      .createQueryBuilder('m')
      .where('m.roomId = :roomId', { roomId })
      .orderBy('m.createdAt', 'DESC')
      .addOrderBy('m.id', 'DESC')
      .take(limit);

    if (before) {
      query.andWhere('m.createdAt < :before', { before });
    }

    const messages = await query.getMany();
    return messages.reverse(); // Return in chronological order.
  }
}

// ---------- 3. Room service ----------
@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
  ) {}

  async canAccess(roomId: string, userId: string): Promise<boolean> {
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

// ---------- 4. Chat gateway ----------
@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    // Fast check: is the client in the room?
    if (!client.rooms.has(data.roomId)) {
      throw new WsException('You are not in this room');
    }

    // Persist and broadcast.
    const message = await this.chatService.sendMessage({
      roomId: data.roomId,
      userId,
      text: data.text,
    });

    // Broadcast to all room members (including sender).
    this.server.to(data.roomId).emit('message', message);

    return { sent: true, messageId: message.id };
  }

  @SubscribeMessage('getHistory')
  async handleGetHistory(
    @MessageBody() data: { roomId: string; limit?: number; before?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    if (!client.rooms.has(data.roomId)) {
      throw new WsException('You are not in this room');
    }

    const messages = await this.chatService.getMessages(
      data.roomId,
      data.limit ?? 50,
      data.before ? new Date(data.before) : undefined,
    );

    return { messages };
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const hasAccess = await this.roomService.canAccess(
      data.roomId,
      client.data.userId,
    );
    if (!hasAccess) {
      throw new WsException('Access denied');
    }

    client.join(data.roomId);
    return { joined: data.roomId };
  }
}
      ` },
      keyTakeaways: [
        "Keep the gateway thin — it receives events, delegates to services, and emits responses.",
        "Persist every message to the database — in-memory chat loses history on restart.",
        "Use consistent room naming (`conversation:42`, `dm:17`) so you can derive the type and validate access.",
        "Validate room membership both in the gateway (fast check) and the service (authoritative check).",
        "Always order messages by `createdAt` and `id` for consistent delivery across clients.",
        "Broadcast with `this.server.to(roomId).emit()` to reach all room members including the sender.",
        "Use a client-generated message id and a unique constraint to prevent duplicate sends.",
      ],
      commonMistakes: [
        "<b>Putting all logic in the gateway.</b> The gateway becomes unmaintainable. Move persistence, permissions, and orchestration to services.",
        "<b>Not persisting messages.</b> History disappears on restart. Users expect their messages to be saved.",
        "<b>Not validating room membership.</b> Any client can join any room and receive private messages .",
        "<b>Out-of-order messages.</b> Without sorting by `createdAt` and `id`, clients may see messages in different orders.",
        "<b>Duplicate messages on retry.</b> A client retries after a timeout and the same message is saved twice. Use idempotency.",
        "<b>Storing per-user state in the gateway instance.</b> Gateways are singletons. Use `socket.data` and shared services.",
      ],
      quiz: [
        {
          question: "Why should the gateway delegate to a service instead of handling chat logic directly?",
          options: [
            "Because the gateway cannot access the database.",
            "Because services keep the gateway thin and the logic testable, reusable, and maintainable.",
            "Because NestJS requires it.",
            "Because the gateway is slower than a service.",
          ],
          correctIndex: 1,
          explanation: "The gateway should only receive events and emit responses. Persistence, permissions, and orchestration belong in services, which can be tested and reused by HTTP endpoints .",
        },
        {
          question: "How should messages be ordered when broadcasting to a room?",
          options: [
            "By the order they arrive at the server.",
            "By `createdAt` and `id` for a consistent, deterministic order across all clients.",
            "Alphabetically by message text.",
            "By the sender's user id.",
          ],
          correctIndex: 1,
          explanation: "Without a deterministic order, clients may see messages in different orders. Sort by `createdAt` and `id` to ensure all clients see the same sequence.",
        },
        {
          question: "What is the purpose of a room naming convention like `conversation:42`?",
          options: [
            "To make room names shorter.",
            "To derive the room type and validate access without storing separate metadata.",
            "To encrypt room names.",
            "To sort rooms alphabetically.",
          ],
          correctIndex: 1,
          explanation: "A consistent naming scheme lets you parse the type (`conversation`, `dm`) and validate access accordingly. Without it, you need separate room metadata and lookups.",
        },
        {
          question: "What happens if you only broadcast messages without persisting them?",
          options: [
            "Messages are delivered faster.",
            "History is lost when the server restarts.",
            "Messages are duplicated.",
            "Clients cannot receive them.",
          ],
          correctIndex: 1,
          explanation: "In-memory messages disappear on restart. Users expect chat history to persist. Always save messages to the database.",
        },
      ],
    },
    {
      id: "day-75-lesson-2",
      title: "Notifications",
      durationMinutes: 22,
      explanation: `
<b>Chat messages are user-initiated.</b> A user types a message and clicks send. A notification is different: it is <b>server-initiated</b>. Something happens in the system — an order is placed, a payment succeeds, a user is mentioned — and the server pushes a notification to the user without the user asking.

This distinction matters because notifications have different requirements from chat. They are one-way (server to client). They are targeted (usually to a specific user). They are often triggered by HTTP endpoints or background jobs, not by WebSocket events.

<b>Why notifications exist.</b> Real-time notifications keep users engaged. A user is browsing a product page and someone sends them a message. A payment fails and the user needs to know immediately. An order ships and the tracking link appears in the app. Without notifications, users have to refresh or poll.

<b>The user-room pattern.</b> The cleanest way to send targeted notifications is to give each user their own room. On connection, the user joins \`user:{userId}\`. To notify a user, emit to that room .

\`\`\`typescript
// On connect:
client.join(\`user:\${client.data.userId}\`);

// To notify:
this.server.to(\`user:\${userId}\`).emit('notification', notification);
\`\`\`

This pattern handles multiple connections naturally. A user with two tabs gets the notification on both. A user on mobile and desktop gets it on both. The room is the delivery mechanism; the server does not need to know which socket ids belong to the user.

<b>Emitting from a service.</b> Notifications are often triggered by HTTP requests. When an order is created via \`POST /orders\`, the service should push a notification to the user. The gateway is not in the request flow — the service is. So the service must be able to emit.

The pattern: inject the gateway into the service and expose a method that emits to the user's room.

\`\`\`typescript
@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  notifyUser(userId: string, notification: any) {
    this.server.to(\`user:\${userId}\`).emit('notification', notification);
  }
}

@Injectable()
export class OrdersService {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  async createOrder(dto: CreateOrderDto) {
    const order = await this.orderRepo.save(dto);
    this.notificationsGateway.notifyUser(order.userId, {
      type: 'order.created',
      orderId: order.id,
    });
    return order;
  }
}
\`\`\`

<b>Namespaces vs. rooms.</b> Notifications can be a separate namespace (\`/notifications\`) or the same namespace as chat with a \`user:{userId}\` room. Both work. A separate namespace is cleaner if notifications have their own authentication rules or if you want to disconnect notification sockets without affecting chat. A shared namespace is simpler if the client already has one connection.

For most applications, a separate namespace is recommended because notifications often have different access patterns and can be rate-limited separately .

<b>Notification types and routing.</b> Not every notification goes to a single user. Some go to a group:

- \`user:{userId}\` — personal notifications (mentions, direct messages).
- \`room:{roomId}\` — notifications for everyone in a room.
- \`tenant:{tenantId}\` — notifications for an entire organization.

The pattern is the same: join the appropriate rooms on connect, emit to the room when something happens.

<b>What can go wrong?</b>

<b>Emitting before the user connects.</b> If you emit to \`user:42\` before user 42 connects and joins the room, the notification is lost. There is no queue. For notifications that must not be missed, persist them to the database and send them when the user connects.

<b>Not handling offline users.</b> The same problem: a user who is offline never receives the notification. Store notifications in a database with a \`read\` flag, and fetch unread notifications on connection.

<b>Circular dependencies.</b> If the notifications gateway depends on a service that depends on the gateway, you have a circular dependency. Use \`forwardRef\` or restructure: the service should not depend on the gateway directly. Instead, use an event emitter or a queue.

<b>Over-notifying.</b> Sending a notification for every event floods the user. Batch or throttle notifications where possible. Group related notifications ("3 new messages" instead of three separate notifications).

<b>Notification identity.</b> Without a unique id, the client cannot deduplicate. If the same notification is emitted twice (e.g. a retry), the user sees it twice. Include a notification id.

<b>How this appears in a real application.</b> A marketplace platform uses notifications for:
- \`order.created\` — sent to the seller when a buyer places an order.
- \`payment.succeeded\` — sent to the buyer and seller.
- \`message.received\` — sent to the recipient when a new chat message arrives and they are not in the chat.
- \`review.posted\` — sent to the seller when a buyer leaves a review.

Each notification is persisted to the \`notifications\` table and emitted to \`user:{userId}\`. The client shows a badge count and a list. Offline users see the notifications when they reconnect.

<b>How experienced engineers think.</b> Notifications are not just WebSocket messages. They are a system with persistence, delivery guarantees, and deduplication. The WebSocket is the delivery mechanism. The database is the source of truth. Design for the case where the user is offline, because that is the common case. The online case is the easy one.
      `,
      diagram: `
Notification Architecture

  HTTP Request          Background Job
  (POST /orders)        (payment webhook)
        |                      |
        v                      v
  +-----------------------------------------+
  |  NotificationsService                   |
  |  - persists notification to database    |
  |  - calls gateway to emit                |
  +-----------------------------------------+
        |
        v
  +-----------------------------------------+
  |  NotificationsGateway                   |
  |  - this.server.to(\`user:\${userId}\`)     |
  |      .emit('notification', data)        |
  +-----------------------------------------+
        |
        |  (via Redis adapter across instances)
        v
  +-----------------------------------------+
  |  User's connections                     |
  |  - Tab 1 (socket A)                     |
  |  - Tab 2 (socket B)                     |
  |  - Mobile (socket C)                    |
  +-----------------------------------------+

  Room pattern:
    On connect: client.join(\`user:\${userId}\`)
    To notify: server.to(\`user:\${userId}\`).emit(...)

  Offline handling:
    - Persist notification to database
    - On reconnect, fetch unread notifications
    - Mark as read when delivered
      `,
      codeExample: { title: "Example", code: `
// ============================================
// NOTIFICATIONS
// ============================================

// ---------- 1. Notification entity ----------
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  type: string; // 'order.created', 'payment.succeeded', etc.

  @Column('jsonb')
  payload: Record<string, unknown>;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

// ---------- 2. Notifications gateway ----------
@WebSocketGateway({ namespace: 'notifications', cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  // Emit to a specific user (all their connections).
  notifyUser(userId: string, notification: any): void {
    this.server.to(\`user:\${userId}\`).emit('notification', notification);
  }

  // Emit to a room.
  notifyRoom(roomId: string, notification: any): void {
    this.server.to(roomId).emit('notification', notification);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(\`user:\${data.userId}\`);
    return { subscribed: true };
  }
}

// ---------- 3. Notifications service (persists + emits) ----------
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly gateway: NotificationsGateway,
  ) {}

  async create(input: {
    userId: string;
    type: string;
    payload: Record<string, unknown>;
  }): Promise<Notification> {
    // 1. Persist the notification.
    const notification = this.notificationRepo.create(input);
    await this.notificationRepo.save(notification);

    // 2. Emit to the user's room.
    //    If the user is online, they receive it immediately.
    //    If not, they will fetch it on next connection.
    this.gateway.notifyUser(input.userId, {
      id: notification.id,
      type: notification.type,
      payload: notification.payload,
      createdAt: notification.createdAt,
    });

    return notification;
  }

  // Fetch unread notifications for a user (called on connect).
  async getUnread(userId: string): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { userId, read: false },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markRead(notificationId: number, userId: string): Promise<void> {
    await this.notificationRepo.update(
      { id: notificationId, userId },
      { read: true },
    );
  }
}

// ---------- 4. Orders service using notifications ----------
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly notifications: NotificationsService,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const order = await this.orderRepo.save(dto);

    // Notify the seller.
    await this.notifications.create({
      userId: order.sellerId,
      type: 'order.created',
      payload: { orderId: order.id, total: order.total },
    });

    return order;
  }
}

// ---------- 5. Fetch unread on connection ----------
@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway
  implements OnGatewayConnection
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly notifications: NotificationsService) {}

  async handleConnection(client: Socket) {
    const userId = client.data.userId;
    client.join(\`user:\${userId}\`);

    // Send unread notifications on connect.
    const unread = await this.notifications.getUnread(userId);
    client.emit('unreadNotifications', unread);
  }
}

// ---------- 6. Client-side ----------
// const socket = io('http://localhost:3000/notifications', {
//   auth: { token },
// });
//
// socket.on('notification', (notification) => {
//   showNotification(notification);
// });
//
// socket.on('unreadNotifications', (notifications) => {
//   setBadgeCount(notifications.length);
// });
      ` },
      keyTakeaways: [
        "Notifications are server-initiated — the server pushes without the user asking.",
        "Use the `user:{userId}` room pattern to target all of a user's connections.",
        "Persist notifications to the database so offline users receive them on reconnect.",
        "Inject the gateway into services to emit notifications from HTTP request flows.",
        "Use a separate namespace for notifications when access patterns or rate limits differ from chat.",
        "Always include a notification id so clients can deduplicate.",
        "Do not emit before the user connects — persist and deliver on connection instead.",
      ],
      commonMistakes: [
        "<b>Emitting before the user connects.</b> The notification is lost. Persist it to the database and send it on connection.",
        "<b>Not handling offline users.</b> The user never receives the notification. Store unread notifications and fetch them on reconnect.",
        "<b>Circular dependencies.</b> The gateway depends on a service that depends on the gateway. Restructure to break the cycle.",
        "<b>Over-notifying.</b> Sending a notification for every event floods the user. Batch or throttle where possible.",
        "<b>No notification id.</b> The client cannot deduplicate, and retries cause duplicate notifications.",
        "<b>Forgetting the namespace.</b> Mixing notification logic with chat logic makes both harder to reason about.",
      ],
      quiz: [
        {
          question: "How should you target a specific user for a notification?",
          options: [
            "By iterating over all connected sockets and filtering by user id.",
            "By emitting to the `user:{userId}` room, which contains all of the user's connections.",
            "By sending an HTTP request to the user's client.",
            "By storing the notification in a queue and waiting for the user to poll.",
          ],
          correctIndex: 1,
          explanation: "The `user:{userId}` room pattern targets all of a user's connections with a single emit. It handles multiple tabs and devices without tracking individual socket ids .",
        },
        {
          question: "Why should notifications be persisted to the database?",
          options: [
            "Because WebSocket connections are unreliable.",
            "Because offline users miss notifications that are only emitted over WebSocket.",
            "Because the database is faster than WebSocket.",
            "Because the client requires it.",
          ],
          correctIndex: 1,
          explanation: "If a user is offline when a notification is emitted, they never receive it. Persisting to the database lets them fetch unread notifications on next connection.",
        },
        {
          question: "How does a service emit a notification when it is not part of the WebSocket flow?",
          options: [
            "By creating a new WebSocket connection.",
            "By injecting the gateway into the service and calling an emit method.",
            "By sending an HTTP request to the WebSocket server.",
            "By writing to a file that the gateway polls.",
          ],
          correctIndex: 1,
          explanation: "The gateway is a provider and can be injected into services. The service calls a method on the gateway, which emits to the appropriate room .",
        },
        {
          question: "What is the purpose of a notification id?",
          options: [
            "To sort notifications alphabetically.",
            "To allow clients to deduplicate notifications when the same one is delivered twice.",
            "To encrypt the notification.",
            "To route the notification to the correct server.",
          ],
          correctIndex: 1,
          explanation: "Without a unique id, the client cannot tell if a notification is new or a duplicate. The id enables deduplication.",
        },
      ],
    },
    {
      id: "day-75-lesson-3",
      title: "Online Status",
      durationMinutes: 24,
      explanation: `
<b>Online status is the feature that makes a chat application feel alive.</b> You can see that your friend is online before you send them a message. You know if they are available or away. You see when they were last active.

But online status is also one of the trickiest real-time features to get right, especially when scaling across multiple instances. The state must be shared, the presence must be accurate, and the transitions must be handled cleanly.

<b>The core problem: presence is distributed state.</b> In a single-instance deployment, a local \`Map<userId, socketId>\` is sufficient. In a multi-instance deployment, Server A knows about its users, Server B knows about its own. Neither knows the full picture . A user connected to Server A must appear online to a user connected to Server B.

The solution is a shared store. Redis is the standard choice. Online users are stored in a Redis set. Each server adds its users on connection and removes them on disconnect. Because the set is shared, all servers see the same presence data.

<b>The data model.</b> A few Redis structures cover the common cases:

- \`online:users\` — a set of user ids currently online.
- \`user:sockets:{userId}\` — a set of socket ids for each user (multiple tabs, devices).
- \`user:lastseen:{userId}\` — a timestamp of when the user was last online.

The \`user:sockets\` set is critical. A user with two tabs is still one user. When one tab closes, the user is not offline. Only when all sockets are removed does the user become offline.

\`\`\`typescript
// On connect:
await redis.sadd('online:users', userId);
await redis.sadd(\`user:sockets:\${userId}\`, socketId);

// On disconnect:
await redis.srem(\`user:sockets:\${userId}\`, socketId);
const remaining = await redis.scard(\`user:sockets:\${userId}\`);
if (remaining === 0) {
  await redis.srem('online:users', userId);
  await redis.set(\`user:lastseen:\${userId}\`, Date.now());
}
\`\`\`

<b>Status beyond online/offline.</b> Real applications need more than binary presence. Users want to set their status to "away", "busy", or "do not disturb". They want a custom status like "In a meeting until 3pm". They want privacy controls — who can see their online status .

A more complete model:

\`\`\`typescript
interface Presence {
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: number;
  customStatus?: {
    text: string;
    emoji: string;
    expiresAt?: Date;
  };
}
\`\`\`

Store this in Redis as a hash per user: \`HSET presence:{userId} status online lastSeen 1712345678\`. The \`online:users\` set becomes a derived view — a user is online if their status is not offline.

<b>Broadcasting presence changes.</b> When a user comes online or goes offline, other users need to know. But broadcasting to everyone is wasteful. Only broadcast to users who care — the user's contacts, the users in their rooms, or the users who have subscribed to their presence.

Socket.IO rooms make this efficient. When a user comes online, emit to the rooms they are a member of:

\`\`\`typescript
async handleConnection(client: Socket) {
  const userId = client.data.userId;

  // Add to presence store.
  await this.presenceService.setOnline(userId);

  // Notify rooms the user is in.
  const rooms = await this.roomService.getUserRooms(userId);
  for (const room of rooms) {
    this.server.to(room).emit('presenceUpdate', {
      userId,
      status: 'online',
      lastSeen: Date.now(),
    });
  }
}
\`\`\`

<b>Typing indicators as ephemeral presence.</b> Typing indicators are a form of presence: "this user is currently typing in this room." They are ephemeral — they expire after a few seconds — and they are scoped to a specific room.

The pattern is simple. When a user types, the client emits \`typingStart\`. The server broadcasts to the room (excluding the sender). After a timeout, the server broadcasts \`typingStop\`. The client also emits \`typingStop\` when the user submits or clears the input .

\`\`\`typescript
@SubscribeMessage('typingStart')
handleTypingStart(
  @MessageBody() data: { roomId: string },
  @ConnectedSocket() client: Socket,
) {
  client.to(data.roomId).emit('typing', {
    userId: client.data.userId,
    isTyping: true,
  });
}

@SubscribeMessage('typingStop')
handleTypingStop(
  @MessageBody() data: { roomId: string },
  @ConnectedSocket() client: Socket,
) {
  client.to(data.roomId).emit('typing', {
    userId: client.data.userId,
    isTyping: false,
  });
}
\`\`\`

Typing indicators should be throttled. A user typing a long message generates many events. Debounce on the client (e.g. emit \`typingStart\` at most once every 2 seconds) and auto-timeout on the server (e.g. if no \`typingStop\` arrives within 5 seconds, broadcast stop) .

<b>What can go wrong.</b>

<b>Presence stuck online after a crash.</b> If a server crashes, its connections are lost, but Redis may still show those users as online. On server startup, clean up state associated with the server's id. Use TTLs on presence keys as a safety net.

<b>Not handling multiple connections.</b> A user with two tabs opens both. Closing one tab should not mark the user offline. Use a set of socket ids, not a single id.

<b>Broadcasting presence to everyone.</b> Emitting presence changes to all connected users is wasteful and can leak privacy. Only emit to relevant rooms.

<b>Rapid connect/disconnect flapping.</b> A user with unstable internet reconnects repeatedly. Each reconnection triggers a presence broadcast, flooding other users. Debounce presence updates or batch them.

<b>Typing indicators that never stop.</b> A user types, then closes the tab without sending. The \`typingStop\` event never arrives. Other users see "typing..." forever. Use a server-side timeout that clears typing state after a few seconds of inactivity.

<b>How this appears in a real application.</b> A team chat platform tracks presence in Redis:
- \`online:users\` — the set of online user ids.
- \`user:sockets:{userId}\` — socket ids per user.
- \`presence:{userId}\` — a hash with status, custom status, and last seen.

On connect, the user is added and presence is broadcast to their teams' rooms. On disconnect, the user is removed and presence is broadcast. Typing indicators are scoped to conversations and auto-expire. The client shows a green dot next to online users and "last seen 5 minutes ago" for offline users.

<b>How experienced engineers think.</b> Presence is a distributed state problem with a real-time delivery requirement. The state must be shared (Redis), the delivery must be targeted (rooms), and the edge cases must be handled (multiple connections, crashes, flapping). Get these right and presence feels magical. Get them wrong and users see stale dots and ghost typing indicators.
      `,
      diagram: `
Online Status Architecture

  Server 1                Server 2
    |                       |
    |  user A connects      |  user B connects
    |                       |
    v                       v
  +-------------------------------------------+
  |  Redis (shared presence state)            |
  |                                           |
  |  online:users      -> {A, B}              |
  |  user:sockets:A    -> {sockA1}            |
  |  user:sockets:B    -> {sockB1, sockB2}    |
  |  presence:A        -> {status: online}    |
  +-------------------------------------------+
              |
              |  broadcast presence changes
              v
  +-------------------------------------------+
  |  Rooms (only relevant users)              |
  |  - user A and B share a room              |
  |  - Server 1 emits to room                 |
  |  - Server 2 receives via Redis adapter    |
  |  - Server 2 delivers to user B            |
  +-------------------------------------------+

  Typing indicators:
    - Scoped to a room
    - Broadcast excluding sender
    - Auto-expire on server after 5s
    - Throttled on client (2s)

  Edge cases:
    - Multiple tabs -> set of socket ids
    - Server crash -> cleanup on startup
    - Flapping -> debounce broadcasts
      `,
      codeExample: { title: "Example", code: `
// ============================================
// ONLINE STATUS
// ============================================

// ---------- 1. Presence service (Redis-backed) ----------
@Injectable()
export class PresenceService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  // User connected.
  async setOnline(userId: string, socketId: string): Promise<void> {
    await this.redis
      .multi()
      .sadd('online:users', userId)
      .sadd(\`user:sockets:\${userId}\`, socketId)
      .hset(\`presence:\${userId}\`, 'status', 'online', 'lastSeen', Date.now())
      .exec();
  }

  // User disconnected.
  async setOffline(userId: string, socketId: string): Promise<void> {
    await this.redis.srem(\`user:sockets:\${userId}\`, socketId);

    const remaining = await this.redis.scard(\`user:sockets:\${userId}\`);
    if (remaining === 0) {
      await this.redis
        .multi()
        .srem('online:users', userId)
        .hset(\`presence:\${userId}\`, 'status', 'offline', 'lastSeen', Date.now())
        .del(\`user:sockets:\${userId}\`)
        .exec();
    }
  }

  async isOnline(userId: string): Promise<boolean> {
    return (await this.redis.sismember('online:users', userId)) === 1;
  }

  async getPresence(userId: string): Promise<{
    status: string;
    lastSeen: number;
  } | null> {
    const data = await this.redis.hgetall(\`presence:\${userId}\`);
    if (!data || !data.status) return null;
    return {
      status: data.status,
      lastSeen: Number(data.lastSeen),
    };
  }

  async getOnlineCount(): Promise<number> {
    return this.redis.scard('online:users');
  }

  // Cleanup on server startup (after a crash).
  async cleanupServerState(serverId: string): Promise<void> {
    const users = await this.redis.hgetall('user:servers');
    const stale = Object.entries(users)
      .filter(([, srv]) => srv === serverId)
      .map(([userId]) => userId);

    for (const userId of stale) {
      await this.redis
        .multi()
        .srem('online:users', userId)
        .hdel('user:servers', userId)
        .del(\`user:sockets:\${userId}\`)
        .exec();
    }
  }
}

// ---------- 2. Gateway with presence and typing ----------
@WebSocketGateway({ namespace: 'chat' })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly presence: PresenceService,
    private readonly roomService: RoomService,
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.data.userId;

    // 1. Mark online.
    await this.presence.setOnline(userId, client.id);

    // 2. Join rooms.
    const rooms = await this.roomService.getUserRooms(userId);
    for (const room of rooms) {
      client.join(room);
    }

    // 3. Broadcast presence to relevant rooms.
    for (const room of rooms) {
      this.server.to(room).emit('presenceUpdate', {
        userId,
        status: 'online',
        lastSeen: Date.now(),
      });
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;

    // Mark offline (only if no other sockets remain).
    await this.presence.setOffline(userId, client.id);

    const stillOnline = await this.presence.isOnline(userId);
    if (!stillOnline) {
      const rooms = await this.roomService.getUserRooms(userId);
      for (const room of rooms) {
        this.server.to(room).emit('presenceUpdate', {
          userId,
          status: 'offline',
          lastSeen: Date.now(),
        });
      }
    }
  }

  // ---------- Typing indicators ----------
  @SubscribeMessage('typingStart')
  handleTypingStart(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast to the room excluding the sender.
    client.to(data.roomId).emit('typing', {
      userId: client.data.userId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typingStop')
  handleTypingStop(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit('typing', {
      userId: client.data.userId,
      isTyping: false,
    });
  }
}

// ---------- 3. Client-side typing with throttle and timeout ----------
// let typingTimeout: NodeJS.Timeout;
//
// function onInputChange() {
//   socket.emit('typingStart', { roomId });
//
//   clearTimeout(typingTimeout);
//   typingTimeout = setTimeout(() => {
//     socket.emit('typingStop', { roomId });
//   }, 5000);
// }
//
// function onSubmit() {
//   clearTimeout(typingTimeout);
//   socket.emit('typingStop', { roomId });
//   socket.emit('sendMessage', { roomId, text });
// }

// ---------- 4. Startup cleanup ----------
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const presence = app.get(PresenceService);
  await presence.cleanupServerState(process.env.SERVER_ID ?? 'unknown');

  await app.listen(3000);
}

// ---------- 5. What NOT to do ----------
// BAD: Using a single socket id per user.
// private onlineUsers = new Map<string, string>();
// A second tab overwrites the first tab's socket id.

// BAD: Broadcasting presence to all users.
// this.server.emit('presenceUpdate', ...); // Leaks privacy and wastes resources.

// BAD: Not cleaning up on server startup.
// Stale presence from a crashed server remains forever.
      ` },
      keyTakeaways: [
        "Presence is distributed state — store it in Redis so all instances see the same data.",
        "Track a set of socket ids per user; a user is offline only when all sockets are gone.",
        "Broadcast presence changes only to relevant rooms, not to all users.",
        "Clean up stale presence on server startup to handle crashes.",
        "Typing indicators are scoped to a room, broadcast excluding the sender, and must auto-expire.",
        "Throttle typing indicators on the client and add a server-side timeout.",
        "Use `user:sockets:{userId}` sets and `presence:{userId}` hashes for a complete presence model.",
      ],
      commonMistakes: [
        "<b>Presence stuck online after a crash.</b> If a server crashes, Redis may still show its users as online. Clean up on startup.",
        "<b>Not handling multiple connections.</b> A user with two tabs opens both. Closing one tab should not mark the user offline.",
        "<b>Broadcasting presence to everyone.</b> Emitting to all connected users is wasteful and leaks privacy. Only emit to relevant rooms.",
        "<b>Rapid connect/disconnect flapping.</b> A user with unstable internet reconnects repeatedly. Debounce presence broadcasts.",
        "<b>Typing indicators that never stop.</b> A user types and closes the tab. Use a server-side timeout.",
        "<b>Using a single socket id per user.</b> Multiple tabs overwrite each other. Use a set.",
      ],
      quiz: [
        {
          question: "How should you determine if a user with multiple tabs is offline?",
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
          question: "Why should presence be stored in Redis instead of local memory?",
          options: [
            "Because Redis is faster.",
            "Because local memory is per-server; other servers cannot see the presence data.",
            "Because local memory cannot store sets.",
            "Because Redis has TTL support.",
          ],
          correctIndex: 1,
          explanation: "In a multi-instance deployment, each server has its own local memory. Presence must be shared so all servers see the same data.",
        },
        {
          question: "What is the correct way to broadcast a presence change?",
          options: [
            "To all connected users.",
            "To the rooms the user is a member of.",
            "To the user themselves only.",
            "To a random subset of users.",
          ],
          correctIndex: 1,
          explanation: "Broadcasting to all users is wasteful and leaks privacy. Only emit presence changes to the rooms where the user's presence is relevant.",
        },
        {
          question: "Why do typing indicators need a server-side timeout?",
          options: [
            "Because the client always sends a stop event.",
            "Because a user might type and then close the tab without sending a stop event.",
            "Because WebSocket connections are unreliable.",
            "Because the server needs to free memory.",
          ],
          correctIndex: 1,
          explanation: "If a user types and then disconnects, the `typingStop` event never arrives. Other users see 'typing...' forever. A server-side timeout clears the state after a few seconds.",
        },
      ],
    },
    {
      id: "day-75-lesson-4",
      title: "Rooms",
      durationMinutes: 24,
      explanation: `
<b>Rooms are the organizational backbone of a chat application.</b> A room is a logical grouping of sockets. When you emit to a room, only sockets that have joined receive the message. Rooms let you build group conversations, direct messages, channels, and any other subset of users you need .

<b>Why rooms exist.</b> Without rooms, every message is broadcast to every connected client. That does not scale and does not respect privacy. Rooms let you target messages to the right subset: the members of a conversation, the participants in a document, the users in an organization.

In Socket.IO, rooms are created on the server side — no configuration needed. A socket can join multiple rooms, and a room can contain many sockets. When a socket disconnects, it automatically leaves all its rooms .

<b>Room naming conventions.</b> A consistent naming scheme is essential for authorization and clarity:

- \`conversation:{id}\` — a group conversation.
- \`dm:{id}\` — a direct message thread.
- \`channel:{id}\` — a public channel.
- \`user:{userId}\` — a user's personal room for notifications.
- \`org:{orgId}\` — an organization-wide room.

The type prefix (\`conversation\`, \`dm\`) tells you how to validate access. A \`conversation\` requires membership. A \`dm\` requires being one of the two participants. A \`channel\` may be public. This lets you write one authorization function that handles all room types.

<b>Joining and leaving rooms.</b> The join handler must validate access before joining:

\`\`\`typescript
@SubscribeMessage('joinRoom')
async handleJoinRoom(
  @MessageBody() data: { roomId: string },
  @ConnectedSocket() client: Socket,
) {
  const hasAccess = await this.roomService.canAccess(
    data.roomId,
    client.data.userId,
  );
  if (!hasAccess) {
    throw new WsException('Access denied');
  }

  client.join(data.roomId);
  client.to(data.roomId).emit('userJoined', {
    userId: client.data.userId,
  });

  return { joined: data.roomId };
}
\`\`\`

<b>Broadcasting to rooms.</b> Socket.IO provides several broadcast patterns :

| Pattern | Code | Reaches |
|---------|------|---------|
| To a room | \`io.to('room').emit()\` | All room members |
| To multiple rooms | \`io.to('r1').to('r2').emit()\` | Members of either room |
| From one client to a room | \`client.to('room').emit()\` | Room members except sender |
| From one client to others | \`client.broadcast.emit()\` | Everyone except sender |

The \`client.to(room).emit()\` pattern is the most common in chat. When a user sends a message, broadcast to the room excluding the sender (the sender already sees their own message).

<b>Direct messages vs. group conversations.</b> A direct message (DM) is technically a room with two members. It is not a special case in Socket.IO — it is just a room named \`dm:{id}\`. The server validates that the user is one of the two participants. The broadcasting is identical to a group conversation.

This uniformity is powerful. You do not need separate code paths for DMs and groups. One room service handles both. One gateway handler broadcasts to both. The only difference is the access check.

<b>Room membership and persistence.</b> Rooms are ephemeral — they exist only while sockets are joined. But membership is persistent — a user is a member of a conversation even when they are offline. The database stores membership; the room is just the runtime representation.

When a user connects, the server joins them to all their conversations:

\`\`\`typescript
async handleConnection(client: Socket) {
  const userId = client.data.userId;
  const rooms = await this.roomService.getUserRooms(userId);
  for (const room of rooms) {
    client.join(room);
  }
}
\`\`\`

When a user is added to a new conversation, the server joins them to the new room and notifies the other members.

<b>What can go wrong.</b>

<b>Not validating room membership on join.</b> Any client can join any room by guessing the room id. This is the most common WebSocket security bug .

<b>Only validating on join, not on every message.</b> A user removed from a room can still send messages until they disconnect. Always re-check membership in the message handler.

<b>Emitting to a room before the client joins.</b> The message is lost. Ensure the join happens before the emit.

<b>Using rooms for authorization.</b> A room is a grouping, not a permission. A client can join any room unless you validate. Authorization must be explicit.

<b>Room name collisions.</b> If you use user ids as room names and also conversation ids, a user named "42" collides with conversation 42. Use prefixes.

<b>Forgetting to leave rooms on removal.</b> When a user is removed from a conversation, their sockets should leave the room. Passive checks work, but active removal is cleaner.

<b>How this appears in a real application.</b> A team chat platform uses rooms for everything:
- \`conversation:{id}\` — group conversations.
- \`dm:{id}\` — direct messages.
- \`channel:{id}\` — public channels.
- \`user:{userId}\` — personal notifications.

On connect, the server joins the user to all their conversations, DMs, and their personal room. When a message is sent, it is broadcast to the room. When a user is added to a conversation, they are joined to the new room. When removed, they are removed from the room.

<b>How experienced engineers think.</b> Rooms are a broadcast optimization, not a security boundary. Every room join is a permission decision. Every message is an authorization check. Use a consistent naming convention, validate access at join and at message time, and keep the room service as the single source of truth for membership.
      `,
      diagram: `
Rooms in a Chat Application

  Room: conversation:42
    +-- User A (socket A1)
    +-- User B (socket B1)
    +-- User C (socket C1)

  Room: dm:17
    +-- User A (socket A1)
    +-- User D (socket D1)

  Room: user:A
    +-- User A (socket A1, A2)

  Room: user:B
    +-- User B (socket B1)

  Broadcasting:
    io.to('conversation:42').emit('message', data)
      -> reaches A, B, C

    client.to('conversation:42').emit('message', data)
      -> reaches B, C (excluding sender A)

    io.to('user:A').emit('notification', data)
      -> reaches all of A's connections (A1, A2)

  Room naming:
    conversation:{id}  -> group
    dm:{id}            -> direct message
    channel:{id}       -> public channel
    user:{userId}      -> personal room
    org:{orgId}        -> organization-wide

  Authorization:
    conversation -> membership required
    dm          -> must be one of two participants
    channel     -> public, maybe no check
    user        -> always allowed (own room)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// ROOMS IN A CHAT APPLICATION
// ============================================

// ---------- 1. Room service (authorization) ----------
@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
    @InjectRepository(DirectMessage)
    private readonly dmRepo: Repository<DirectMessage>,
  ) {}

  async canAccess(roomId: string, userId: string): Promise<boolean> {
    const [type, id] = roomId.split(':');

    switch (type) {
      case 'conversation':
        const membership = await this.membershipRepo.findOne({
          where: { conversationId: Number(id), userId },
        });
        return !!membership;

      case 'dm':
        const dm = await this.dmRepo.findOne({
          where: { id: Number(id) },
        });
        return dm?.participantA === userId || dm?.participantB === userId;

      case 'channel':
        // Public channels — no membership required.
        return true;

      case 'user':
        // A user can only access their own room.
        return id === userId;

      default:
        return false;
    }
  }

  async getUserRooms(userId: string): Promise<string[]> {
    const memberships = await this.membershipRepo.find({ where: { userId } });
    const conversations = memberships.map(
      (m) => \`conversation:\${m.conversationId}\`,
    );

    const dms = await this.dmRepo.find({
      where: [{ participantA: userId }, { participantB: userId }],
    });
    const dmRooms = dms.map((d) => \`dm:\${d.id}\`);

    // Always include the user's personal room.
    return [...conversations, ...dmRooms, \`user:\${userId}\`];
  }
}

// ---------- 2. Gateway with room handling ----------
@WebSocketGateway({ namespace: 'chat' })
export class RoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomService: RoomService) {}

  async handleConnection(client: Socket) {
    const userId = client.data.userId;

    // Join all persistent rooms.
    const rooms = await this.roomService.getUserRooms(userId);
    for (const room of rooms) {
      client.join(room);
    }

    console.log(\`User \${userId} joined \${rooms.length} rooms\`);
  }

  handleDisconnect(client: Socket) {
    // Rooms are automatically left on disconnect.
    console.log(\`User \${client.data.userId} disconnected\`);
  }

  // ---------- Join a room (validate access) ----------
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const hasAccess = await this.roomService.canAccess(
      data.roomId,
      client.data.userId,
    );
    if (!hasAccess) {
      throw new WsException('Access denied to this room');
    }

    client.join(data.roomId);
    client.to(data.roomId).emit('userJoined', {
      userId: client.data.userId,
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
    });
    return { left: data.roomId };
  }

  // ---------- Send a message to a room ----------
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Fast check: is the client in the room?
    if (!client.rooms.has(data.roomId)) {
      throw new WsException('You are not in this room');
    }

    // Authoritative check.
    const hasAccess = await this.roomService.canAccess(
      data.roomId,
      client.data.userId,
    );
    if (!hasAccess) {
      client.leave(data.roomId);
      throw new WsException('Access revoked');
    }

    // Broadcast to the room excluding the sender.
    client.to(data.roomId).emit('message', {
      userId: client.data.userId,
      text: data.text,
      roomId: data.roomId,
      timestamp: new Date().toISOString(),
    });

    return { sent: true };
  }

  // ---------- Direct message ----------
  @SubscribeMessage('sendDM')
  async handleSendDM(
    @MessageBody() data: { dmId: number; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = \`dm:\${data.dmId}\`;

    const hasAccess = await this.roomService.canAccess(
      roomId,
      client.data.userId,
    );
    if (!hasAccess) {
      throw new WsException('Not a participant in this DM');
    }

    this.server.to(roomId).emit('message', {
      userId: client.data.userId,
      text: data.text,
      roomId,
      timestamp: new Date().toISOString(),
    });

    return { sent: true };
  }
}

// ---------- 3. Adding a user to a new conversation ----------
@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
    private readonly gateway: RoomGateway,
  ) {}

  async addMember(conversationId: number, userId: string): Promise<void> {
    await this.membershipRepo.save({ conversationId, userId });

    // Join the user's active sockets to the new room.
    const roomId = \`conversation:\${conversationId}\`;
    const sockets = await this.gateway.server.in(roomId).fetchSockets();
    // Alternatively, find sockets by user id and join them.
    this.gateway.server.socketsJoin(roomId);
  }
}

// ---------- 4. Client-side ----------
// // Join a conversation.
// socket.emit('joinRoom', { roomId: 'conversation:42' });
//
// // Send a message.
// socket.emit('sendMessage', { roomId: 'conversation:42', text: 'Hello!' });
//
// // Receive messages.
// socket.on('message', (data) => {
//   console.log(\`\${data.userId}: \${data.text}\`);
// });
//
// // Send a DM.
// socket.emit('sendDM', { dmId: 17, text: 'Hey!' });

// ---------- 5. What NOT to do ----------
// BAD: Not validating room access.
// client.join(anyRoomIdFromTheClient); // Security hole!

// BAD: Only validating on join, not on send.
// A removed user can still send messages.

// BAD: Using rooms for authorization.
// Rooms group sockets; they do not grant permissions.

// BAD: Emitting before the client joins.
// this.server.to('room').emit(...); // client has not joined yet.
      ` },
      keyTakeaways: [
        "Rooms are logical groupings of sockets for targeted broadcasts — the foundation of chat and notifications.",
        "Use a consistent naming convention (`conversation:{id}`, `dm:{id}`) so you can derive the type and validate access.",
        "Always validate room membership before `client.join()` — the client's request is untrusted.",
        "Re-validate membership on every message, not just on join.",
        "Direct messages are rooms with two members — the same code handles both DMs and groups.",
        "Join users to all their persistent rooms on connection.",
        "Use `client.to(room).emit()` to broadcast excluding the sender, and `io.to(room).emit()` to include everyone.",
      ],
      commonMistakes: [
        "<b>Not validating room membership on join.</b> Any client can join any room by guessing the id .",
        "<b>Only validating on join, not on every message.</b> A removed user can still send messages.",
        "<b>Emitting to a room before the client joins.</b> The message is lost.",
        "<b>Using rooms for authorization.</b> A room is a grouping, not a permission.",
        "<b>Room name collisions.</b> Use prefixes to avoid user id and conversation id collisions.",
        "<b>Forgetting to leave rooms on removal.</b> Passive checks work, but active removal is cleaner.",
      ],
      quiz: [
        {
          question: "What is a room in Socket.IO?",
          options: [
            "A separate WebSocket server.",
            "A logical grouping of sockets for targeted broadcasts.",
            "A database table.",
            "A type of namespace.",
          ],
          correctIndex: 1,
          explanation: "A room is a grouping of sockets. When you emit to a room, only sockets that have joined receive the message .",
        },
        {
          question: "Why should you validate room membership before `client.join()`?",
          options: [
            "Because join is slow.",
            "Because any client can join any room by guessing the id, gaining access to private messages.",
            "Because Socket.IO requires it.",
            "Because it saves memory.",
          ],
          correctIndex: 1,
          explanation: "Rooms are not a security mechanism. Without validation, any client can join any room. Always check permissions before joining .",
        },
        {
          question: "How does a direct message differ from a group conversation at the room level?",
          options: [
            "DMs use a different protocol.",
            "DMs are rooms with two members; the same room code handles both.",
            "DMs do not use rooms.",
            "DMs require a separate gateway.",
          ],
          correctIndex: 1,
          explanation: "A DM is just a room with two members. The same room join, access validation, and broadcast logic applies. Only the access check differs.",
        },
        {
          question: "What happens to a client's rooms when it disconnects?",
          options: [
            "The rooms remain until manually cleared.",
            "The client automatically leaves all rooms on disconnect.",
            "The server must call `leave()` for each room.",
            "The rooms are deleted from the server.",
          ],
          correctIndex: 1,
          explanation: "Socket.IO automatically removes a disconnected socket from all its rooms. No manual cleanup is needed .",
        },
      ],
    },
    {
      id: "day-75-lesson-5",
      title: "Unread Messages",
      durationMinutes: 26,
      explanation: `
<b>Unread message counters are deceptively simple.</b> A user opens an app and sees "3 unread messages" next to a conversation. Behind that number is a design decision that affects performance, consistency, and scalability.

The naive approach is to store an \`unread_messages_count\` column and increment it for every recipient when a message is sent. This works for small applications but breaks down quickly. Every message triggers N database updates (one per recipient). In a group chat with 100 members, that is 100 updates per message. The write amplification is enormous .

<b>Why counters are a bad idea.</b> The counter approach has three problems:

1. **Write amplification.** Every message multiplies into N writes. At scale, this saturates the database.
2. **Consistency risk.** If an update fails partway through (e.g. a crash between message insert and counter increment), the counter is wrong forever. There is no way to recover the correct value without recounting.
3. **No recovery path.** If the counter drifts from reality, there is no way to know the correct number without counting all messages .

<b>The better approach: a read bookmark.</b> Instead of counting unread messages, store the id of the last message the user has read for each room. To compute the unread count, count messages after that id.

\`\`\`sql
-- The bookmark.
CREATE TABLE room_read_state (
  user_id   BIGINT NOT NULL,
  room_id   TEXT NOT NULL,
  last_read_message_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, room_id)
);

-- The unread count.
SELECT COUNT(*) FROM messages
WHERE room_id = ? AND id > ?
\`\`\`

This approach has several advantages :

- **No write amplification.** Sending a message writes one row (the message). The read bookmark is only updated when the user reads, not when a message is sent.
- **Consistency.** The count is derived from the actual messages. There is no separate counter to drift.
- **Recovery.** If the bookmark is wrong, it can be corrected by looking at the user's actual read behavior.
- **First unread message.** The bookmark tells you exactly where to scroll when the user opens the room.

<b>The trade-off.</b> Counting unread messages is a \`COUNT(*)\` query. For a room with millions of messages, this can be slow. But it is a read operation that only happens when the user opens the app or the conversation list. It does not happen on every message send.

If the count is still too slow, cache it. Store the derived count in Redis and update it when the bookmark changes. The bookmark is the source of truth; the cached count is an optimization .

<b>Updating the bookmark.</b> When a user reads a conversation, the server updates the bookmark to the id of the latest message. This is a single write per user per room, not per message.

\`\`\`typescript
async markAsRead(userId: string, roomId: string): Promise<void> {
  const latest = await this.messageRepo.findOne({
    where: { roomId },
    order: { id: 'DESC' },
  });

  if (!latest) return;

  await this.readStateRepo.upsert(
    { userId, roomId, lastReadMessageId: latest.id },
    ['userId', 'roomId'],
  );
}
\`\`\`

<b>Where to compute unread counts.</b> The conversation list is the place where users see unread counts. When the user opens the app, the server fetches the list of conversations with their unread counts. This is a batch query:

\`\`\`sql
SELECT
  c.id,
  c.name,
  (SELECT COUNT(*) FROM messages m
   WHERE m.room_id = 'conversation:' || c.id
     AND m.id > COALESCE(rs.last_read_message_id, 0)) AS unread_count
FROM conversations c
JOIN memberships m ON m.conversation_id = c.id
LEFT JOIN room_read_state rs
  ON rs.room_id = 'conversation:' || c.id
 AND rs.user_id = m.user_id
WHERE m.user_id = ?
\`\`\`

This query returns the conversation list with unread counts in one round trip. It is efficient because the \`messages\` table is indexed on \`(room_id, id)\` and the read state is a small table.

<b>Real-time unread updates.</b> When a new message arrives in a room the user is not currently viewing, the unread count for that room should increment. But the server does not need to compute the count on every message. Instead, the client can increment its local count when it receives a message for a room it is not viewing.

The flow:
1. User is in room A. A message arrives in room B (which the user is a member of).
2. The server emits the message to room B. The user's socket is in room B (from the connection-time room join).
3. The client receives the message. If the user is not currently viewing room B, the client increments the local unread count for room B.
4. When the user opens room B, the client emits \`markAsRead\`. The server updates the bookmark. The client clears the local unread count.

This works because the client already receives messages for all rooms it is a member of. The unread count is a client-side state derived from the message stream. The server only stores the bookmark .

<b>Edge cases and what can go wrong.</b>

<b>The user is offline.</b> When the user reconnects, the server sends the current unread counts from the database. The client replaces its local counts with the authoritative ones.

<b>Multiple devices.</b> If the user reads a conversation on one device, the other devices should update. When the server updates the bookmark, it can emit a \`readReceipt\` event to \`user:{userId}\` so all devices sync.

<b>Race condition: reading while a message arrives.</b> The user marks as read, but a new message arrives at the same time. The bookmark is updated to the old latest message, and the new message is unread. This is correct behavior. The client should increment the count when it receives the new message.

<b>Deleting messages.</b> If messages are deleted, the unread count should decrease. The \`COUNT(*)\` query handles this automatically because it counts actual messages.

<b>Marking as read without reading.</b> A user marks a room as read without scrolling. The bookmark jumps to the latest message. The count is zero. This is fine — it is the user's choice.

<b>How this appears in a real application.</b> A chat platform stores a \`room_read_state\` table. When the user opens the app, the server returns the conversation list with unread counts computed from the bookmarks. When the user opens a conversation, the client emits \`markAsRead\`, and the server updates the bookmark. The client clears the local count. When a new message arrives in a background conversation, the client increments the local count. The count is always consistent because it is derived from the bookmark and the actual messages.

<b>How experienced engineers think.</b> Unread counters are a classic case of the wrong abstraction. The instinct is to count messages. The better design is to track position. A bookmark is a single value that is cheap to update and enables every derived view: unread count, first unread message, read receipts. The count is a computed property, not a stored one. Store the position, compute the count, and let the count be a query — not a mutable value that can drift.
      `,
      diagram: `
Unread Messages: Bookmark vs. Counter

  Bad approach (counter):
    Message sent to room with 100 members
      -> 100 UPDATE statements (one per member)
      -> slow, high write amplification
      -> counter can drift if an update fails

  Good approach (bookmark):
    Message sent to room
      -> 1 INSERT (the message)

    User reads room
      -> 1 UPDATE (the bookmark)

    Unread count = COUNT(messages WHERE id > bookmark)

  Data model:
    messages (id, room_id, user_id, text, created_at)
    room_read_state (user_id, room_id, last_read_message_id)

  Flow:
    1. User opens app -> server returns conversations + unread counts
    2. User opens room -> client emits markAsRead
    3. Server updates bookmark to latest message id
    4. Client clears local count
    5. New message arrives in background room
       -> client increments local count
    6. User opens that room
       -> markAsRead -> server updates bookmark -> client clears count

  Advantages:
    - No write amplification on message send
    - Count is always consistent with messages
    - Enables "first unread message" and read receipts
      `,
      codeExample: { title: "Example", code: `
// ============================================
// UNREAD MESSAGES
// ============================================

// ---------- 1. Read state entity ----------
@Entity('room_read_state')
@Unique(['userId', 'roomId'])
export class RoomReadState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  roomId: string;

  @Column('bigint')
  lastReadMessageId: number;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ---------- 2. Read state service ----------
@Injectable()
export class ReadStateService {
  constructor(
    @InjectRepository(RoomReadState)
    private readonly readStateRepo: Repository<RoomReadState>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  // Mark a room as read (updates the bookmark to the latest message).
  async markAsRead(userId: string, roomId: string): Promise<void> {
    const latest = await this.messageRepo.findOne({
      where: { roomId },
      order: { id: 'DESC' },
    });

    if (!latest) return;

    await this.readStateRepo.upsert(
      {
        userId,
        roomId,
        lastReadMessageId: latest.id,
      },
      ['userId', 'roomId'],
    );
  }

  // Get the bookmark for a room.
  async getBookmark(userId: string, roomId: string): Promise<number> {
    const state = await this.readStateRepo.findOne({
      where: { userId, roomId },
    });
    return state?.lastReadMessageId ?? 0;
  }
}

// ---------- 3. Unread count service ----------
@Injectable()
export class UnreadService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly readStateService: ReadStateService,
  ) {}

  // Count unread messages in a room.
  async getUnreadCount(userId: string, roomId: string): Promise<number> {
    const bookmark = await this.readStateService.getBookmark(userId, roomId);

    return this.messageRepo
      .createQueryBuilder('m')
      .where('m.roomId = :roomId', { roomId })
      .andWhere('m.id > :bookmark', { bookmark })
      .andWhere('m.userId != :userId', { userId }) // Exclude own messages.
      .getCount();
  }

  // Get unread counts for all of a user's rooms (batch).
  async getUnreadCountsForUser(
    userId: string,
  ): Promise<Record<string, number>> {
    const rooms = await this.getUserRooms(userId);

    const counts = await Promise.all(
      rooms.map(async (roomId) => ({
        roomId,
        count: await this.getUnreadCount(userId, roomId),
      })),
    );

    return Object.fromEntries(counts.map((c) => [c.roomId, c.count]));
  }

  private async getUserRooms(userId: string): Promise<string[]> {
    // Fetch from your membership tables.
    // Returns an array of room ids like ['conversation:1', 'dm:5'].
    return [];
  }
}

// ---------- 4. Gateway handlers ----------
@WebSocketGateway({ namespace: 'chat' })
export class UnreadGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly readStateService: ReadStateService,
    private readonly unreadService: UnreadService,
  ) {}

  // Called when the user opens a conversation.
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    await this.readStateService.markAsRead(userId, data.roomId);

    // Notify the user's other devices to sync.
    this.server.to(\`user:\${userId}\`).emit('readReceipt', {
      roomId: data.roomId,
      readAt: new Date().toISOString(),
    });

    return { read: true };
  }

  // Fetch unread counts (called on app open).
  @SubscribeMessage('getUnreadCounts')
  async handleGetUnreadCounts(@ConnectedSocket() client: Socket) {
    const counts = await this.unreadService.getUnreadCountsForUser(
      client.data.userId,
    );
    return { counts };
  }

  // Called when a message is sent to a room.
  // Broadcasts to the room; clients update local counts.
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Persist the message (via ChatService).
    const message = await this.chatService.sendMessage({
      roomId: data.roomId,
      userId: client.data.userId,
      text: data.text,
    });

    // Broadcast to the room.
    this.server.to(data.roomId).emit('message', message);

    return { sent: true, messageId: message.id };
  }
}

// ---------- 5. Client-side unread tracking ----------
// // Local unread counts (one per room).
// const unreadCounts = {};
//
// // When a message arrives:
// socket.on('message', (message) => {
//   const currentRoom = getCurrentRoom();
//   if (message.roomId !== currentRoom) {
//     // Increment local count for the background room.
//     unreadCounts[message.roomId] = (unreadCounts[message.roomId] ?? 0) + 1;
//     updateBadge(message.roomId, unreadCounts[message.roomId]);
//   }
// });
//
// // When the user opens a conversation:
// function openRoom(roomId) {
//   socket.emit('markAsRead', { roomId });
//   unreadCounts[roomId] = 0;
//   updateBadge(roomId, 0);
// }
//
// // When the user reconnects:
// socket.on('connect', async () => {
//   const { counts } = await socket.emitWithAck('getUnreadCounts');
//   unreadCounts = counts;
//   refreshAllBadges();
// });

// ---------- 6. What NOT to do ----------
// BAD: Incrementing a counter column for every recipient on every message.
// UPDATE memberships SET unread_count = unread_count + 1 WHERE room_id = ?;
// 100 members -> 100 updates per message.

// BAD: Storing the counter without a bookmark.
// If the counter drifts, there is no way to recover the correct value.

// GOOD: Store the bookmark. Compute the count. Let the count be a query.
      ` },
      keyTakeaways: [
        "Store a read bookmark (last read message id), not a counter. The count is a derived query.",
        "The bookmark approach eliminates write amplification on message send.",
        "The count is always consistent because it is derived from the actual messages.",
        "The bookmark enables 'first unread message' and read receipts.",
        "Compute unread counts on demand (app open, conversation list) and cache if needed.",
        "Clients increment local counts when messages arrive in background rooms; the server stores the bookmark.",
        "Sync read state across devices via the `user:{userId}` room.",
      ],
      commonMistakes: [
        "<b>Using a counter column and incrementing it per recipient.</b> Write amplification and consistency risk .",
        "<b>Not excluding the user's own messages.</b> The sender's messages should not count as unread for them.",
        "<b>Forgetting to sync read state across devices.</b> Reading on one device should update the others.",
        "<b>Not handling the offline case.</b> When the user reconnects, fetch authoritative counts from the server.",
        "<b>Counting on every message send.</b> The count should be computed on read, not on write.",
        "<b>Storing the count without a recovery path.</b> The bookmark is the source of truth; the count is derived.",
      ],
      quiz: [
        {
          question: "Why is storing a bookmark better than storing an unread counter?",
          options: [
            "Because bookmarks use less memory.",
            "Because a bookmark avoids write amplification and keeps the count consistent with the actual messages.",
            "Because counters are deprecated.",
            "Because bookmarks are faster to query.",
          ],
          correctIndex: 1,
          explanation: "A bookmark stores a single value per user per room, updated only when the user reads. A counter requires N updates per message and can drift. The bookmark is the source of truth; the count is derived .",
        },
        {
          question: "How do you compute the unread count using a bookmark?",
          options: [
            "Subtract the bookmark from the total messages.",
            "Count messages with id greater than the bookmark.",
            "Add the bookmark to the message count.",
            "Divide messages by the bookmark.",
          ],
          correctIndex: 1,
          explanation: "The unread count is the number of messages with an id greater than the last read message id. This is a simple `COUNT(*)` query .",
        },
        {
          question: "When should the bookmark be updated?",
          options: [
            "Every time a message is sent.",
            "When the user reads the conversation.",
            "When the server restarts.",
            "Every five minutes.",
          ],
          correctIndex: 1,
          explanation: "The bookmark is updated when the user reads the room, not when messages are sent. This is what avoids write amplification.",
        },
        {
          question: "How does the client know to increment the unread count for a background room?",
          options: [
            "The server sends a separate unread event for every room.",
            "The client receives the message (it is in the room) and increments the local count if the room is not currently open.",
            "The client polls the server every second.",
            "The server pushes a push notification.",
          ],
          correctIndex: 1,
          explanation: "The client is a member of all its rooms, so it receives messages for background rooms. If the user is not viewing that room, the client increments the local unread count.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why should the gateway be thin in a chat application?",
      options: [
        "Because gateways are slow.",
        "Because services keep the logic testable, reusable, and maintainable, while the gateway only handles communication.",
        "Because NestJS requires it.",
        "Because the gateway cannot access the database.",
      ],
      correctIndex: 1,
      explanation: "The gateway should only receive events and emit responses. Persistence, permissions, and orchestration belong in services .",
    },
    {
      question: "How should you target a specific user for a notification?",
      options: [
        "By iterating over all connected sockets.",
        "By emitting to the `user:{userId}` room, which contains all of the user's connections.",
        "By sending an HTTP request.",
        "By storing the notification in a queue.",
      ],
      correctIndex: 1,
      explanation: "The `user:{userId}` room pattern targets all of a user's connections with a single emit .",
    },
    {
      question: "Why should notifications be persisted to the database?",
      options: [
        "Because WebSocket is unreliable.",
        "Because offline users miss notifications that are only emitted over WebSocket.",
        "Because the database is faster.",
        "Because the client requires it.",
      ],
      correctIndex: 1,
      explanation: "Persisting to the database lets offline users fetch unread notifications on next connection.",
    },
    {
      question: "How should you determine if a user with multiple tabs is offline?",
      options: [
        "When any one of their sockets disconnects.",
        "When all of their socket ids have been removed from the set.",
        "When the server restarts.",
        "When their token expires.",
      ],
      correctIndex: 1,
      explanation: "A user is offline only when they have no active connections.",
    },
    {
      question: "Why should presence be stored in Redis instead of local memory?",
      options: [
        "Because Redis is faster.",
        "Because local memory is per-server; other servers cannot see the presence data.",
        "Because local memory cannot store sets.",
        "Because Redis has TTL support.",
      ],
      correctIndex: 1,
      explanation: "In a multi-instance deployment, presence must be shared so all servers see the same data.",
    },
    {
      question: "What is the correct way to broadcast a presence change?",
      options: [
        "To all connected users.",
        "To the rooms the user is a member of.",
        "To the user themselves only.",
        "To a random subset of users.",
      ],
      correctIndex: 1,
      explanation: "Broadcasting to all users is wasteful and leaks privacy. Only emit to relevant rooms.",
    },
    {
      question: "Why do typing indicators need a server-side timeout?",
      options: [
        "Because the client always sends a stop event.",
        "Because a user might type and then close the tab without sending a stop event.",
        "Because WebSocket connections are unreliable.",
        "Because the server needs to free memory.",
      ],
      correctIndex: 1,
      explanation: "If a user types and then disconnects, the `typingStop` event never arrives. A server-side timeout clears the state after a few seconds.",
    },
    {
      question: "What is a room in Socket.IO?",
      options: [
        "A separate WebSocket server.",
        "A logical grouping of sockets for targeted broadcasts.",
        "A database table.",
        "A type of namespace.",
      ],
      correctIndex: 1,
      explanation: "A room is a grouping of sockets. Only sockets that have joined receive the message .",
    },
    {
      question: "Why should you validate room membership before `client.join()`?",
      options: [
        "Because join is slow.",
        "Because any client can join any room by guessing the id, gaining access to private messages.",
        "Because Socket.IO requires it.",
        "Because it saves memory.",
      ],
      correctIndex: 1,
      explanation: "Rooms are not a security mechanism. Without validation, any client can join any room .",
    },
    {
      question: "How does a direct message differ from a group conversation at the room level?",
      options: [
        "DMs use a different protocol.",
        "DMs are rooms with two members; the same room code handles both.",
        "DMs do not use rooms.",
        "DMs require a separate gateway.",
      ],
      correctIndex: 1,
      explanation: "A DM is just a room with two members. The same logic applies.",
    },
    {
      question: "Why is storing a bookmark better than storing an unread counter?",
      options: [
        "Because bookmarks use less memory.",
        "Because a bookmark avoids write amplification and keeps the count consistent with the actual messages.",
        "Because counters are deprecated.",
        "Because bookmarks are faster to query.",
      ],
      correctIndex: 1,
      explanation: "A bookmark stores a single value per user per room, updated only when the user reads. A counter requires N updates per message and can drift .",
    },
    {
      question: "How do you compute the unread count using a bookmark?",
      options: [
        "Subtract the bookmark from the total messages.",
        "Count messages with id greater than the bookmark.",
        "Add the bookmark to the message count.",
        "Divide messages by the bookmark.",
      ],
      correctIndex: 1,
      explanation: "The unread count is the number of messages with an id greater than the last read message id .",
    },
    {
      question: "When should the bookmark be updated?",
      options: [
        "Every time a message is sent.",
        "When the user reads the conversation.",
        "When the server restarts.",
        "Every five minutes.",
      ],
      correctIndex: 1,
      explanation: "The bookmark is updated when the user reads the room, not when messages are sent.",
    },
    {
      question: "How does the client know to increment the unread count for a background room?",
      options: [
        "The server sends a separate unread event for every room.",
        "The client receives the message (it is in the room) and increments the local count if the room is not currently open.",
        "The client polls the server every second.",
        "The server pushes a push notification.",
      ],
      correctIndex: 1,
      explanation: "The client is a member of all its rooms, so it receives messages for background rooms. If the user is not viewing that room, the client increments the local unread count.",
    },
    {
      question: "What is the purpose of the `client.to(room).emit()` pattern in chat?",
      options: [
        "To send a message to all room members including the sender.",
        "To broadcast to room members excluding the sender, since the sender already sees their own message.",
        "To send a message to a single user.",
        "To leave a room.",
      ],
      correctIndex: 1,
      explanation: "`client.to(room).emit()` reaches room members except the sender. The sender's client already displays their own message, so they do not need to receive it.",
    },
  ],
  project: {
    name: "Build a Real-Time Chat Backend with Notifications, Presence, and Unread Messages",
    goal:
      "Implement a production-grade real-time chat application with multiple rooms, direct messages, online status, typing indicators, notifications, and unread message tracking. The system must support multiple server instances via Redis and handle edge cases like offline users, multiple tabs, and reconnection.",
    brief:
      "You are building the backend for a team chat platform. Users connect via WebSocket, join conversations, exchange messages in real time, see who is online, see when others are typing, receive notifications for mentions and direct messages, and see unread counts on their conversation list. The system must be testable, scalable, and correct.",
    steps: [
      "Create a NestJS project. Add `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`, `@nestjs/typeorm`, `pg`, `ioredis`, `@socket.io/redis-adapter`, and `@nestjs/jwt`.",
      "Define entities: `User`, `Conversation`, `Membership`, `DirectMessage`, `Message`, `RoomReadState`, and `Notification`.",
      "Create a `ChatService` with `sendMessage` (persists and returns the saved message) and `getMessages` (with pagination).",
      "Create a `RoomService` with `canAccess(roomId, userId)` that validates access based on the room type prefix (`conversation:`, `dm:`, `user:`).",
      "Create a `PresenceService` backed by Redis with `setOnline`, `setOffline`, `isOnline`, `getPresence`, and `cleanupServerState`.",
      "Create a `ReadStateService` with `markAsRead` and `getBookmark`, and an `UnreadService` with `getUnreadCount` and `getUnreadCountsForUser`.",
      "Create a `NotificationsService` with `create` (persists and emits via the gateway) and `getUnread`.",
      "Create a `ChatGateway` with namespace `chat`. Implement `OnGatewayInit` for JWT authentication middleware, `OnGatewayConnection` to join rooms and mark online, and `OnGatewayDisconnect` to mark offline.",
      "Implement `sendMessage` that persists via `ChatService` and broadcasts to the room.",
      "Implement `joinRoom` and `leaveRoom` with access validation via `RoomService`.",
      "Implement `typingStart` and `typingStop` that broadcast to the room excluding the sender.",
      "Implement `markAsRead` that updates the bookmark and syncs across the user's devices via `user:{userId}`.",
      "Implement `getUnreadCounts` that returns unread counts for all of the user's rooms.",
      "Create a `NotificationsGateway` with namespace `notifications` that joins `user:{userId}` on connection and emits unread notifications.",
      "Configure `RedisIoAdapter` in `main.ts` for multi-instance scaling.",
      "Write an e2e test that connects two clients to the same room, sends a message, and verifies both receive it.",
      "Write an e2e test that verifies presence: connect a client, check that another client receives the presence update.",
      "Write an e2e test that verifies typing indicators: one client types, the other receives the typing event.",
      "Write an e2e test that verifies unread counts: send messages to a background room, mark as read, verify the count is zero.",
      "Write an e2e test that verifies notifications: trigger an HTTP endpoint that creates a notification, verify the connected client receives it.",
    ],
    acceptance: [
      "Two clients in the same room receive each other's messages in real time.",
      "A client cannot join a room it does not have access to.",
      "Presence updates are broadcast to relevant rooms when a user connects or disconnects.",
      "Typing indicators are broadcast to the room excluding the sender.",
      "Unread counts are correctly computed from the read bookmark.",
      "Notifications are persisted and delivered to connected users; offline users receive them on reconnect.",
      "The Redis adapter is connected for multi-instance scaling.",
      "All e2e tests pass.",
    ],
    stretch: [
      "Add read receipts: when a user reads a room, emit a `readReceipt` event to the room so senders see 'Seen'.",
      "Add message reactions: `addReaction` and `removeReaction` that broadcast to the room.",
      "Add a `getConversationList` endpoint that returns conversations with the last message and unread count in one query.",
      "Add rate limiting to the `sendMessage` event per user.",
      "Add a `WsExceptionFilter` that catches `WsException` and emits a structured error with a code and message.",
      "Write a load test with `artillery` that connects 500 concurrent WebSocket clients, sends messages to rooms, and measures delivery latency.",
      "Implement message search using PostgreSQL full-text search and a `searchMessages` WebSocket event.",
    ],
  },
};
