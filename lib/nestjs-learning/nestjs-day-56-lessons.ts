import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_56_LESSONS: LessonDay = {
  day: 56,
  title: "Advanced Redis: Pub/Sub, Streams, Lua Scripting & Redlock",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-56-lesson-1",
      title: "Redis Pub/Sub & Real-Time Messaging",
      durationMinutes: 24,
      explanation: `<b>Understanding Redis Pub/Sub</b>

Redis Pub/Sub (Publish/Subscribe) is a lightweight, high-performance messaging paradigm designed for fan-out event broadcasting. Publishers push messages to named channels without knowing who (if anyone) is listening, while Subscribers listen on channels without knowing who sent the message.

\`\`\`text
                      ┌──────────────────────┐
                      │   Publisher Client   │
                      └──────────┬───────────┘
                                 │
                     PUBLISH orders:created "{...}"
                                 │
                                 ▼
                      ┌──────────────────────┐
                      │    Redis Channel     │
                      │   "orders:created"   │
                      └──────────┬───────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ Subscriber Node 1│   │ Subscriber Node 2│   │ Subscriber Node 3│
└──────────────────┘   └──────────────────┘   └──────────────────┘
\`\`\`

<b>At-Most-Once Delivery Guarantee</b>

The defining architectural characteristic of Redis Pub/Sub is that it is **Fire-and-Forget (At-Most-Once Delivery)**. 
- Messages are pushed to connected sockets instantly in memory and are **never stored or persisted on disk**.
- If a subscriber node disconnects, crashes, or experiences a network partition, any messages published during that window are permanently lost.

<b>When to Use Pub/Sub in NestJS</b>
1. <b>Real-Time WebSockets Fan-Out</b>: Synchronizing state across multiple scaled NestJS backend instances running Socket.io or WebSockets.
2. <b>Cache Invalidation Signals</b>: Broadcasting an immediate signal across 10 API nodes to clear local memory caches when an administrative setting changes.
3. <b>System Notifications</b>: Broadcasting ephemeral UI events, live chat streams, or dashboard push alerts.

<b>Dedicated Connection Requirement</b>

When an \`ioredis\` connection enters Subscription mode via \`SUBSCRIBE\` or \`PSUBSCRIBE\`, that connection becomes dedicated solely to listening for channel messages. It **cannot** execute standard Redis data commands (like \`GET\`, \`SET\`, or \`HSET\`). Production NestJS apps must maintain two separate Redis connections: one for publishing/commands and one for subscribing.`,
      diagram: `                    NESTJS REDIS PUB/SUB PIPELINE
                                │
                                ▼
                   ┌──────────────────────────┐
                   │ Command Connection (Svc) │
                   └────────────┬─────────────┘
                                │
                   PUBLISH cache:clear "user:42"
                                │
                                ▼
                   ┌──────────────────────────┐
                   │   Redis Channel Engine   │
                   └────────────┬─────────────┘
                                │
           ┌────────────────────┴────────────────────┐
           ▼                                         ▼
┌──────────────────────────┐             ┌──────────────────────────┐
│ Dedicated Sub Client A   │             │ Dedicated Sub Client B   │
│ (NestJS Instance #1)     │             │ (NestJS Instance #2)     │
└──────────────────────────┘             └──────────────────────────┘`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/redis/redis-pubsub.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private publisherClient!: Redis;
  private subscriberClient!: Redis;
  private readonly logger = new Logger(RedisPubSubService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const redisOptions = {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
    };

    // Instantiate two independent connections
    this.publisherClient = new Redis(redisOptions);
    this.subscriberClient = new Redis(redisOptions);

    this.logger.log('Redis Publisher and Subscriber connections established.');
  }

  /**
   * Publishes a message payload to a specified channel.
   */
  async publish(channel: string, message: Record<string, any>): Promise<number> {
    const serialized = JSON.stringify(message);
    return await this.publisherClient.publish(channel, serialized);
  }

  /**
   * Subscribes to a channel and binds an execution callback for incoming messages.
   */
  async subscribe(channel: string, callback: (payload: any) => void): Promise<void> {
    await this.subscriberClient.subscribe(channel);
    
    this.subscriberClient.on('message', (incomingChannel, message) => {
      if (incomingChannel === channel) {
        try {
          const parsed = JSON.parse(message);
          callback(parsed);
        } catch (err) {
          this.logger.error(\`Failed to parse message on channel \${channel}:\`, err);
        }
      }
    });
  }

  async onModuleDestroy() {
    await this.publisherClient.quit();
    await this.subscriberClient.quit();
  }
}`,
      },
      keyTakeaways: [
        "Redis Pub/Sub provides low-latency, fire-and-forget message broadcasting.",
        "Pub/Sub uses at-most-once delivery: messages are not persisted and are lost if no subscribers are active.",
        "Subscribing locks a Redis client connection; use separate instances for publishing and subscribing in NestJS.",
        "Ideal for WebSocket gateway scaling, real-time notifications, and distributed cache invalidation signals.",
      ],
      commonMistakes: [
        "<b>Using Pub/Sub as an audit log or transaction queue.</b> Because messages are not stored on disk, missed messages cannot be replayed.",
        "<b>Reusing a single Redis client for both commands and subscriptions.</b> Calling \`GET\` or \`SET\` on a client in subscription mode triggers driver runtime errors.",
      ],
      quiz: [
        {
          question: "What happens if a Redis Pub/Sub subscriber goes offline for 5 seconds while messages are being published?",
          options: [
            "Redis holds the messages in RAM and delivers them when the subscriber reconnects",
            "The published messages are permanently lost for that subscriber",
            "The publisher node throws a hard exception",
            "Messages are written to disk and saved in the AOF journal"
          ],
          correctIndex: 1,
          explanation: "Redis Pub/Sub is strictly fire-and-forget. Offline subscribers lose any messages published during their downtime."
        }
      ]
    },
    {
      id: "day-56-lesson-2",
      title: "Redis Streams & Consumer Groups",
      durationMinutes: 25,
      explanation: `<b>Redis Streams: Persistent Event-Driven Architecture</b>

Introduced to solve the durability and history limitations of Pub/Sub, **Redis Streams** is an append-only log data structure. Think of Redis Streams as a lightweight, in-memory Apache Kafka built directly into Redis.

Unlike Pub/Sub, Redis Streams **persist messages to disk**, maintain an offset log history, and support consumer scaling using **Consumer Groups**.

\`\`\`text
                          REDIS STREAM ("orders-stream")
 ┌──────────────────────┐┌──────────────────────┐┌──────────────────────┐
 │ ID: 1710000000000-0  ││ ID: 1710000000001-0  ││ ID: 1710000000002-0  │
 │ Payload: { order: 1 }││ Payload: { order: 2 }││ Payload: { order: 3 }│
 └──────────────────────┘└──────────────────────┘└──────────────────────┘
                                    │
                         CONSUMER GROUP ("payment-workers")
                   ┌────────────────┴────────────────┐
                   ▼                                 ▼
           Consumer Node 1                   Consumer Node 2
          (Processes Order 1)               (Processes Order 2)
\`\`\`

<b>Key Concepts & Commands</b>

1. <b>Appending Events (\`XADD\`)</b>: Writes an entry to the stream log. Returns a unique timestamp-based ID (e.g., \`1710000000000-0\`).
   - \`XADD orders-stream * orderId 100 status PENDING\`
2. <b>Consumer Groups (\`XGROUP CREATE\`)</b>: Allows multiple server instances to divide work so each message in a stream is consumed by only one worker in the group.
3. <b>Reading Streams (\`XREADGROUP\`)</b>: Reads new unassigned messages for a specific consumer.
4. <b>Message Acknowledgments (\`XACK\`)</b>: Once a consumer processes an event, it sends an \`XACK\` to remove the message from the Pending Entries List (PEL).
5. <b>Handling Crashes (\`XPENDING\` & \`XCLAIM\`)</b>: If a consumer crashes midway through processing, another worker can inspect pending unacknowledged messages via \`XPENDING\` and claim ownership via \`XCLAIM\`.

<b>Comparing Pub/Sub vs. Streams</b>

| Feature | Redis Pub/Sub | Redis Streams |
| :--- | :--- | :--- |
| **Persistence** | None (In-Memory Only) | Append-Only Disk Log |
| **Message History** | Lost immediately | Retained indefinitely (or trimmed) |
| **Consumer Scaling** | Every subscriber gets every message | Consumer Groups distribute load |
| **Acknowledgments** | Not supported | Supported via \`XACK\` |
| **Delivery Guarantee**| At-most-once | At-least-once |`,
      diagram: `                   REDIS STREAMS CONSUMER GROUP
                               │
                XADD orders-stream * orderId 100
                               │
                               ▼
                   ┌──────────────────────────┐
                   │ Stream: "orders-stream"  │
                   └────────────┬─────────────┘
                                │
                    Consumer Group Assignment
                    ┌───────────┴───────────┐
                    ▼                       ▼
            ┌──────────────┐        ┌──────────────┐
            │ Worker Node 1│        │ Worker Node 2│
            └──────┬───────┘        └──────┬───────┘
                   │                       │
           Process Event #1        Process Event #2
                   │                       │
            XACK Stream #1          XACK Stream #2`,
      codeExample: {
        title: "Code Example",
        code: `// src/events/redis-stream-consumer.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '../common/redis/redis-client.provider';

@Injectable()
export class RedisStreamConsumerService implements OnModuleInit {
  private readonly logger = new Logger(RedisStreamConsumerService.name);
  private readonly STREAM_KEY = 'orders:stream';
  private readonly GROUP_NAME = 'order-processing-group';
  private readonly CONSUMER_NAME = \`worker-\${process.pid}\`;

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onModuleInit() {
    await this.initConsumerGroup();
    // Start asynchronous non-blocking event consumption loop
    this.consumeEvents();
  }

  private async initConsumerGroup() {
    try {
      // MKSTREAM option creates stream if it doesn't exist yet
      await this.redis.xgroup('CREATE', this.STREAM_KEY, this.GROUP_NAME, '$', 'MKSTREAM');
      this.logger.log(\`Consumer group \${this.GROUP_NAME} created.\`);
    } catch (err: any) {
      if (err.message.includes('BUSYGROUP')) {
        this.logger.log(\`Consumer group \${this.GROUP_NAME} already exists.\`);
      } else {
        throw err;
      }
    }
  }

  private async consumeEvents() {
    while (true) {
      try {
        // Read unconsumed messages designated for this consumer group
        const response = await this.redis.xreadgroup(
          'GROUP', this.GROUP_NAME, this.CONSUMER_NAME,
          'BLOCK', 2000, // Block for 2s waiting for new items
          'COUNT', 5,
          'STREAMS', this.STREAM_KEY, '>' // '>' indicates unread messages
        );

        if (response) {
          for (const [stream, messages] of response as any) {
            for (const [id, fields] of messages) {
              await this.processMessage(id, fields);
            }
          }
        }
      } catch (err) {
        this.logger.error('Error reading from Redis Stream:', err);
      }
    }
  }

  private async processMessage(id: string, fields: string[]) {
    this.logger.log(\`Processing event \${id} with fields: \${fields.join(', ')}\`);
    
    // Simulate domain logic processing
    // ...

    // Send acknowledgment once safely processed
    await this.redis.xack(this.STREAM_KEY, this.GROUP_NAME, id);
  }
}`,
      },
      keyTakeaways: [
        "Redis Streams provides a persistent, append-only event log with replay capability.",
        "Consumer Groups divide work across workers, ensuring at-least-once message processing.",
        "Always call \`XACK\` after processing a message to remove it from the Pending Entries List (PEL).",
        "Use \`XCLAIM\` to recover and process pending messages left behind by crashed worker nodes.",
      ],
      commonMistakes: [
        "<b>Forgetting to call XACK.</b> Unacknowledged messages accumulate indefinitely in the Pending Entries List, increasing RAM consumption.",
        "<b>Allowing streams to grow unbounded.</b> Always set a length cap (e.g., \`XADD stream MAXLEN ~ 100000 *\`) to limit stream memory overhead.",
      ],
      quiz: [
        {
          question: "What happens to a message in a Redis Stream Consumer Group if the worker processing it crashes before calling XACK?",
          options: [
            "The message is deleted automatically",
            "The message remains in the Pending Entries List (PEL) and can be claimed by another worker using XCLAIM",
            "The entire stream log is wiped",
            "Redis halts stream processing until the original worker restarts"
          ],
          correctIndex: 1,
          explanation: "Unacknowledged messages remain in the PEL. Other consumers can detect timed-out messages via \`XPENDING\` and reassign them using \`XCLAIM\`."
        }
      ]
    },
    {
      id: "day-56-lesson-3",
      title: "Atomic Operations with Lua Scripting",
      durationMinutes: 22,
      explanation: `<b>Why Use Lua Scripting in Redis?</b>

While Redis primitive commands are atomic individually, multi-step operations (e.g., "Read key A, compute value in Node.js, update key B based on result") are **not** atomic across network calls. Another client could modify key A or key B in the middle of your execution, introducing severe race conditions.

To execute complex, multi-step conditional logic atomically directly inside Redis, we write **Lua Scripts**.

\`\`\`text
Without Lua (Non-Atomic, Race Conditions):
Client ──► GET stock:item:1 ──► (Returns 1)
Client ──► Compute in Node.js (1 > 0)
[RACE CONDITION WINDOW - Another client decrements stock to 0!]
Client ──► DECR stock:item:1 ──► (Stock becomes -1, Over-sold!)

With Lua (Atomic Execution):
Client ──► EVAL "if redis.call('GET', KEYS[1]) > 0 then return redis.call('DECR', KEYS[1]) end"
(Executed fully in memory with zero race condition windows)
\`\`\`

<b>Key Guarantees of Lua Scripts</b>

1. <b>Atomicity</b>: Redis executes the entire Lua script sequentially on its single-threaded main engine. No other command or script runs while a script is executing.
2. <b>Reduced Network Round-Trips</b>: Instead of making multiple back-and-forth network calls between Node.js and Redis, logic is packaged and sent in a single \`EVAL\` or \`EVALSHA\` command.

<b>Optimizing Performance with EVALSHA</b>

Transmitting a raw Lua script string over the network on every request wastes bandwidth. 
- Use \`SCRIPT LOAD\` to register the script once with Redis. Redis returns a SHA-1 hash (e.g., \`6f89a2...\`).
- Execute the script using \`EVALSHA <sha1_hash> numkeys key1 key2 arg1 arg2\`.
- Most Node.js drivers (like \`ioredis\`) automate \`EVALSHA\` via \`defineCommand()\`.`,
      diagram: `                    ATOMIC LUA SCRIPT EXECUTION
                                │
                                ▼
                   EVALSHA <sha> 1 stock:item:100
                                │
                                ▼
               ┌─────────────────────────────────┐
               │  Redis Single-Threaded Engine   │
               └────────────────┬────────────────┘
                                │
             Executes entire Lua script atomically
             1. GET stock:item:100
             2. Check if > 0
             3. DECR stock:item:100
                                │
                                ▼
                  Returns result to client
              (Zero interference from other clients)`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/redis/lua-inventory.service.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis-client.provider';

// Extend ioredis type definition to include custom atomic Lua commands
declare module 'ioredis' {
  interface Redis {
    deductStock(key: string, amount: number): Promise<number>;
  }
}

@Injectable()
export class LuaInventoryService implements OnModuleInit {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  onModuleInit() {
    // Define custom atomic Lua script on the ioredis instance
    this.redis.defineCommand('deductStock', {
      numberOfKeys: 1,
      lua: \`
        local stockKey = KEYS[1]
        local amountToDeduct = tonumber(ARGV[1])

        local currentStock = tonumber(redis.call('GET', stockKey) or "0")

        if currentStock >= amountToDeduct then
            local newStock = currentStock - amountToDeduct
            redis.call('SET', stockKey, newStock)
            return newStock -- Success: returns remaining stock
        else
            return -1 -- Failure: insufficient stock
        end
      \`,
    });
  }

  /**
   * Atomically checks and deducts stock without race conditions.
   */
  async purchaseItem(productId: string, quantity: number): Promise<boolean> {
    const stockKey = \`inventory:\${productId}\`;
    const result = await this.redis.deductStock(stockKey, quantity);
    
    return result >= 0;
  }
}`,
      },
      keyTakeaways: [
        "Lua scripts execute atomically inside Redis memory, eliminating client-side race conditions.",
        "Multi-step conditional modifications should be encapsulated in Lua rather than multiple network calls.",
        "Use \`EVALSHA\` and \`SCRIPT LOAD\` to cache scripts on the server and minimize network traffic.",
        "Keep Lua scripts short and fast; long-running scripts block the single-threaded Redis engine.",
      ],
      commonMistakes: [
        "<b>Writing heavy, slow, or looping Lua scripts.</b> Because Redis is single-threaded, a slow Lua script halts all incoming operations for all clients until execution completes.",
        "<b>Hardcoding dynamic key names directly inside Lua scripts instead of using \`KEYS[i]\`.</b> Redis cluster routing requires explicit key declarations in \`KEYS[]\` to locate the correct hash slot.",
      ],
      quiz: [
        {
          question: "Why is executing stock deduction via a Lua script safer than doing a GET then SET in Node.js?",
          options: [
            "Lua scripts automatically encrypt the database connection",
            "The Lua script runs atomically inside Redis, preventing concurrent requests from causing race conditions or negative inventory",
            "Node.js cannot perform math on numbers read from Redis",
            "Lua scripts run asynchronously across multiple background CPU threads"
          ],
          correctIndex: 1,
          explanation: "Lua scripts run sequentially without interruption on the main thread, ensuring the inventory check and deduction happen in a single step."
        }
      ]
    },
    {
      id: "day-56-lesson-4",
      title: "Distributed Locking with Redlock Algorithm",
      durationMinutes: 24,
      explanation: `<b>The Need for Distributed Locks</b>

In a system deployed across multiple backend instances or Kubernetes pods, standard local process locks (like Node.js mutexes or in-memory flags) cannot prevent concurrent execution across different nodes.

If two independent API servers execute a scheduled background job or attempt to update a user's wallet simultaneously, you risk double-spending or corrupted state. You need a **Distributed Lock**.

\`\`\`text
Server Node 1 ──┐
                ├──► Distributed Lock Manager (Redis) ──► Only ONE Node gets Lock!
Server Node 2 ──┘
\`\`\`

<b>Single-Node Locking vs. The Redlock Algorithm</b>

1. <b>Single-Node Locking (\`SET NX EX\`)</b>:
   - \`SET lock:resource_id unique_token NX EX 30\`
   - Works well for basic setups, but if the single Redis master node crashes right after granting a lock, a failover replica might not have received the key yet, allowing a second node to acquire the lock concurrently.

2. <b>The Redlock Algorithm (Multi-Node Fault Tolerance)</b>:
   - Proposed by Redis creator Salvatore Sanfilippo for fault-tolerant locking across $N$ independent Redis master nodes (typically 5).
   - A client acquires the lock only if it successfully sets the lock with a matching random token on a **majority** of master nodes (e.g., at least 3 out of 5) within a strict time limit.

\`\`\`text
                          CLIENT ACQUIRING REDLOCK
 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 │Redis Master 1│ │Redis Master 2│ │Redis Master 3│ │Redis Master 4│ │Redis Master 5│
 └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
        │                │                │                │                │
     [OK 1]           [OK 2]           [OK 3]           [FAIL]           [FAIL]
        └────────────────┴────────────────┴────────────────┴────────────────┘
                       Majority Acquired (3/5) => Lock Granted!
\`\`\`

<b>Safe Lock Release with Lua</b>

Releasing a lock requires verifying that the lock still belongs to you before deleting it (to avoid releasing a lock that expired and was re-acquired by another process). This **check-and-delete** sequence must be performed using an atomic Lua script:

\`\`\`lua
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
\`\`\``,
      diagram: `                   SAFE DISTRIBUTED LOCK RELEASE
                               │
               Release Lock (Key, UniqueToken)
                               │
                               ▼
               ┌───────────────────────────────┐
               │     Atomic Lua Script         │
               └───────────────┬───────────────┘
                               │
                Does GET(Key) == UniqueToken?
                ┌──────────────┴──────────────┐
         [MATCHES]                      [MISMATCH]
            │                              │
       DEL Key                        Do Nothing
  (Safe Release)                (Lock expired / owned
                                  by another worker)`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/redis/redlock.service.ts
import { Injectable, Logger } from '@nestjs/common';
import Redlock, { Lock } from 'redlock';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedlockService {
  private redlock!: Redlock;
  private readonly logger = new Logger(RedlockService.name);

  constructor(private readonly configService: ConfigService) {
    // Instantiate connections to 3 independent Redis instances for Redlock consensus
    const client1 = new Redis({ host: configService.get('REDIS_HOST_1', 'localhost'), port: 6379 });
    const client2 = new Redis({ host: configService.get('REDIS_HOST_2', 'localhost'), port: 6380 });
    const client3 = new Redis({ host: configService.get('REDIS_HOST_3', 'localhost'), port: 6381 });

    this.redlock = new Redlock([client1, client2, client3], {
      driftFactor: 0.01,
      retryCount: 3,
      retryDelay: 200, // ms
      retryJitter: 200, // ms
    });

    this.redlock.on('error', (err) => this.logger.error('Redlock error encountered:', err));
  }

  /**
   * Executes a critical operation protected by a distributed Redlock.
   */
  async executeWithLock<T>(
    resourceKey: string,
    ttlMs: number,
    criticalTask: () => Promise<T>,
  ): Promise<T> {
    let lock: Lock;

    try {
      this.logger.debug(\`Attempting to acquire Redlock for resource: \${resourceKey}\`);
      lock = await this.redlock.acquire([\`locks:\${resourceKey}\`], ttlMs);
    } catch (err) {
      throw new Error(\`Failed to acquire distributed lock for resource: \${resourceKey}. Operation aborted.\`);
    }

    try {
      // Execute the critical distributed task safely
      return await criticalTask();
    } finally {
      // Safely release lock using atomic Lua token check
      await lock.release().catch((err) => {
        this.logger.error(\`Failed to release lock for \${resourceKey}:\`, err);
      });
    }
  }
}`,
      },
      keyTakeaways: [
        "Distributed locks protect shared resources across multiple independent backend instances.",
        "Single-instance locking using \`SET NX EX\` works for simple cases but lacks failover guarantees.",
        "The Redlock algorithm achieves fault tolerance by acquiring lock consensus across a majority of independent Redis masters.",
        "Lock release must always verify token ownership via an atomic Lua script to prevent accidental deletion of another worker's lock.",
      ],
      commonMistakes: [
        "<b>Releasing a lock using a plain DEL command.</b> If a task runs longer than the TTL, its lock expires and another worker acquires it. A plain \`DEL\` will mistakenly remove the new worker's lock.",
        "<b>Setting a lock TTL shorter than the worst-case execution time of the task.</b> The lock expires mid-task, breaking mutual exclusion.",
      ],
      quiz: [
        {
          question: "Why must a distributed lock be released using an atomic Lua script rather than a plain 'DEL' command?",
          options: [
            "Plain DEL commands cannot execute on Redis cluster nodes",
            "To verify that the lock's unique owner token matches before deleting, ensuring you don't release a lock acquired by another node after yours expired",
            "Lua scripts force Redis to restart its expiration timer",
            "DEL commands are not supported in ioredis"
          ],
          correctIndex: 1,
          explanation: "If your task exceeds the lock TTL, the lock expires and another node acquires it. An atomic Lua script ensures you only delete the key if your unique token is still present."
        }
      ]
    },
    {
      id: "day-56-lesson-5",
      title: "Production Architecture: Redis Sentinel, Clustering & Monitoring",
      durationMinutes: 25,
      explanation: `<b>Scaling Redis for Production</b>

As application traffic grows, a single standalone Redis node creates a single point of failure (SPOF) and faces RAM and CPU constraints. Production deployments rely on two main scaling architectures: **Redis Sentinel** and **Redis Cluster**.

\`\`\`text
                             REDIS SENTINEL
               ┌────────────────────────────────────────┐
               │          Sentinel Monitors             │
               └───────────────────┬────────────────────┘
                                   │
                     Promotes Replica on Failure
                                   │
                  ┌────────────────┴────────────────┐
                  ▼                                 ▼
         ┌────────────────┐                ┌────────────────┐
         │  Master Node   │ ── Replicates ─► Replica Node   │
         │  (Reads/Writes)│    Data        │  (Read-Only)   │
         └────────────────┘                └────────────────┘
\`\`\`

<b>1. Redis Sentinel (High Availability & Failover)</b>
Redis Sentinel provides high availability without sharding data.
- **Topology**: One Master node (handles reads and writes) paired with one or more Replica nodes (read-only copies).
- **Automated Failover**: Sentinel processes monitor the master. If the master fails, Sentinels elect a replica and promote it to master automatically.

<b>2. Redis Cluster (Horizontal Sharding & Throughput)</b>
Redis Cluster partitions your dataset across multiple master nodes to scale beyond the RAM and CPU limits of a single machine.
- **Data Sharding**: The key space is divided into **16,384 Hash Slots**.
- Every key is assigned to a hash slot computed via \`CRC16(key) mod 16384\`.
- **Multi-Node Routing**: Nodes route queries to the correct master hosting the target hash slot automatically.

\`\`\`text
                             REDIS CLUSTER
               ┌────────────────────────────────────────┐
               │ 16,384 Hash Slots Distributed Across   │
               │         Multiple Master Nodes          │
               └───────────────────┬────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
  ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
  │ Master Node 1 │        │ Master Node 2 │        │ Master Node 3 │
  │ Slots 0-5460  │        │Slots 5461-10922│       │Slots 10923-16383│
  └───────────────┘        └───────────────┘        └───────────────┘
\`\`\`

<b>Production Monitoring & Health Checks</b>

1. <b>Memory Health Checks</b>: Monitor \`used_memory\` vs \`maxmemory\` via \`INFO memory\`.
2. <b>Latency Checks</b>: Monitor \`slowlog get 10\` to flag slow commands blocking the event loop.
3. <b>Hit-Rate Metrics</b>: Track cache effectiveness using \`keyspace_hits\` vs \`keyspace_misses\`. Aim for a hit rate above 85-90%.`,
      diagram: `                   REDIS CLUSTER HASH SLOT ROUTING
                                │
                      GET user:profile:100
                                │
                                ▼
                     Calculate Hash Slot:
                 CRC16("user:profile:100") % 16384
                                │
                      Result = Slot 7,420
                                │
                                ▼
                     Route Query to Master 2
                      (Hosts Slots 5461-10922)`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/redis/redis-cluster-client.provider.ts
import { Provider, Logger } from '@nestjs/common';
import Redis, { Cluster } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLUSTER_CLIENT = 'REDIS_CLUSTER_CLIENT';

export const RedisClusterClientProvider: Provider = {
  provide: REDIS_CLUSTER_CLIENT,
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('RedisCluster');

    const isClusterMode = configService.get<boolean>('REDIS_CLUSTER_ENABLED', false);

    if (isClusterMode) {
      // Connect to Redis Cluster topology
      const clusterNodes = [
        { host: configService.get('REDIS_NODE_1', '10.0.0.1'), port: 6379 },
        { host: configService.get('REDIS_NODE_2', '10.0.0.2'), port: 6379 },
        { host: configService.get('REDIS_NODE_3', '10.0.0.3'), port: 6379 },
      ];

      const cluster = new Redis.Cluster(clusterNodes, {
        dnsLookup: (address, callback) => callback(null, address, 4),
        redisOptions: {
          password: configService.get<string>('REDIS_PASSWORD'),
        },
        scaleReads: 'slave', // Direct read queries to read-only replicas
      });

      cluster.on('connect', () => logger.log('Successfully connected to Redis Cluster.'));
      cluster.on('error', (err) => logger.error('Redis Cluster error:', err));

      return cluster;
    } else {
      // Fallback to Sentinel configuration for HA non-sharded environments
      return new Redis({
        sentinels: [
          { host: 'sentinel-1', port: 26379 },
          { host: 'sentinel-2', port: 26379 },
        ],
        name: 'mymaster',
        password: configService.get<string>('REDIS_PASSWORD'),
      });
    }
  },
  inject: [ConfigService],
};`,
      },
      keyTakeaways: [
        "Redis Sentinel provides automated master failover and high availability for non-sharded setups.",
        "Redis Cluster scales reads and writes horizontally by partitioning keys across 16,384 hash slots.",
        "Calculate hit-rate performance regularly: \`keyspace_hits / (keyspace_hits + keyspace_misses)\`.",
        "Monitor the slow log (\`SLOWLOG GET\`) to identify and optimize commands that block the main event loop.",
      ],
      commonMistakes: [
        "<b>Executing multi-key operations across different hash slots in Redis Cluster without hash tags.</b> Multi-key commands require all targeted keys to reside on the same hash slot; group related keys using hash tags like \`{user:100}:profile\` and \`{user:100}:orders\`.",
        "<b>Ignoring memory fragment ratios.</b> High fragmentation ratios indicate allocated memory isn't being freed back to the OS; configure active defragmentation (\`activedefrag yes\`).",
      ],
      quiz: [
        {
          question: "How does Redis Cluster divide the dataset across multiple master nodes?",
          options: [
            "By placing even keys on Node 1 and odd keys on Node 2",
            "By mapping keys across 16,384 fixed hash slots computed via CRC16(key) mod 16384",
            "By keeping a duplicate full copy of RAM on every server",
            "Using round-robin client-side load balancing"
          ],
          correctIndex: 1,
          explanation: "Redis Cluster computes a CRC16 checksum of the key modulo 16,384 to assign the key to one of 16,384 hash slots distributed among master nodes."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Which messaging paradigm in Redis delivers messages fire-and-forget without storing history on disk?",
      options: [
        "Redis Streams",
        "Redis Pub/Sub",
        "Redis Hashes",
        "Redis Lists"
      ],
      correctIndex: 1,
      explanation: "Pub/Sub is an ephemeral fire-and-forget broadcasting mechanism. Messages are lost if subscribers are offline."
    },
    {
      question: "In Redis Streams, what command is sent by a consumer to confirm that a message was processed successfully?",
      options: [
        "XADD",
        "XDEL",
        "XACK",
        "XCLAIM"
      ],
      correctIndex: 2,
      explanation: "\`XACK\` acknowledges successful message processing, removing the entry from the consumer group's Pending Entries List (PEL)."
    },
    {
      question: "Why do developers write Lua scripts for Redis operations?",
      options: [
        "To allow Redis to write directly to PostgreSQL tables",
        "To execute multi-step operations atomically without race conditions",
        "To increase string storage capacity past 512MB",
        "To bypass Redis authentication rules"
      ],
      correctIndex: 1,
      explanation: "Lua scripts execute sequentially and atomically on the single-threaded main engine, avoiding concurrency race conditions."
    },
    {
      question: "How does the Redlock algorithm achieve fault-tolerant distributed locking?",
      options: [
        "By acquiring a lock on a majority of independent Redis master nodes",
        "By disabling disk persistence",
        "By running a background thread on a single node",
        "By forcing all operations through a single replica"
      ],
      correctIndex: 0,
      explanation: "Redlock requires acquiring locks on a majority (e.g., 3 out of 5) of independent Redis master nodes to ensure consensus and fault tolerance."
    },
    {
      question: "How many fixed hash slots are used by Redis Cluster to partition keys across nodes?",
      options: [
        "1,024",
        "8,192",
        "16,384",
        "65,536"
      ],
      correctIndex: 2,
      explanation: "Redis Cluster divides its keyspace into exactly 16,384 hash slots."
    },
    {
      question: "What is the function of the command 'XCLAIM' in Redis Streams?",
      options: [
        "It deletes a stream permanently",
        "It reassigns pending unacknowledged messages from a failed/crashed consumer to a healthy consumer",
        "It converts a stream into a Pub/Sub channel",
        "It flushes all keys from system memory"
      ],
      correctIndex: 1,
      explanation: "\`XCLAIM\` allows active workers to claim ownership of pending messages that were left unacknowledged by crashed workers."
    },
    {
      question: "How can you ensure multi-key operations (like Lua scripts) execute on the same node in a Redis Cluster?",
      options: [
        "By wrapping key names in hash tags, such as {user:100}:profile and {user:100}:settings",
        "By setting TTL to zero",
        "By using AOF logging",
        "By setting cluster-enabled to false"
      ],
      correctIndex: 0,
      explanation: "Curly brace hash tags (e.g., \`{user:100}\`) force Redis Cluster to compute the hash slot using only the text inside the braces, placing both keys on the exact same node."
    }
  ],
  project: {
    name: "Distributed Real-Time Event & Locking Engine",
    goal: "Build an advanced NestJS event processing engine utilizing Redis Streams with Consumer Groups, atomic Lua inventory deduction, Redlock distributed task execution, and automated Pub/Sub cluster invalidations.",
    brief: "Construct a high-throughput microservice architecture in NestJS powered by advanced Redis primitives. Implement an order checkout process using atomic Lua inventory deduction, distribute order events asynchronously via Redis Streams with consumer group workers, enforce mutual exclusion on background payouts using Redlock, and propagate real-time cache invalidations via Pub/Sub.",
    steps: [
      "Set up a NestJS project with multi-connection ioredis configurations supporting Sentinel or Cluster modes.",
      "Implement an atomic inventory purchase flow using Lua scripts defined with \`defineCommand()\`.",
      "Build an event publisher using \`XADD\` to append order events to a Redis Stream log.",
      "Develop worker nodes that consume stream events in parallel using Redis Consumer Groups (\`XREADGROUP\`), acknowledging entries with \`XACK\`.",
      "Implement a crash-recovery background loop that inspects unacknowledged events (\`XPENDING\`) and claims them via \`XCLAIM\`.",
      "Protect critical financial tasks across backend instances using the Redlock algorithm and atomic Lua lock releases.",
      "Build a real-time invalidation gateway using dedicated Redis Pub/Sub channels."
    ],
    acceptance: [
      "Lua inventory script guarantees zero negative stock under high concurrency.",
      "Stream Consumer Group processes events in parallel across multiple worker processes without duplicate handling.",
      "Unacknowledged worker crashes are automatically recovered via \`XCLAIM\`.",
      "Redlock successfully grants lock consensus across majority nodes while preventing concurrent double execution.",
      "Pub/Sub invalidations propagate across subscriber instances instantly."
    ],
    stretch: [
      "Implement hash tags (\`{tenant_id}:key\`) across keys to support Redis Cluster multi-key routing.",
      "Expose Prometheus metrics for Redis hit-rate, memory fragmentation, and stream pending entries list (PEL) size."
    ]
  }
};