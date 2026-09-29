import type { LessonDay } from "@/lib/learn/lesson-types";

const finalQuiz = [
  ["Why do we use multiple Next.js servers?", ["To make the code shorter", "To handle more traffic and provide better availability", "To remove the need for PostgreSQL", "To make CSS load faster"], 1, "Multiple servers distribute traffic and improve availability."],
  ["What does it mean for a server to be stateless?", ["The server cannot use a database", "The server cannot store any data", "The server does not depend on important state stored only in its own memory", "The server cannot handle authentication"], 2, "Important state must be shared instead of living only in one server’s memory."],
  ["What is the main job of a load balancer?", ["Store images", "Create database tables", "Distribute requests across application servers", "Generate thumbnails"], 2, "A load balancer sends requests to available application servers."],
  ["A user requests the same product information 1,000 times. What can reduce repeated database queries?", ["Redis caching", "Adding more CSS", "Removing the load balancer", "Increasing the browser font size"], 0, "A shared Redis cache can return repeated data without querying PostgreSQL every time."],
  ["What happens during a cache miss?", ["The server automatically shuts down", "The application gets the data from another source, such as PostgreSQL", "The request is always rejected", "The CDN deletes the database"], 1, "A cache miss falls back to the source of truth."],
  ["Why is PostgreSQL connection pooling useful?", ["It allows unlimited database connections", "It helps reuse and control database connections", "It replaces Redis", "It makes database queries unnecessary"], 1, "Pooling prevents uncontrolled connection growth while reusing connections."],
  ["A user requests a report that takes two minutes to generate. What is usually a better production design?", ["Keep the HTTP request open for two minutes", "Generate the report in the browser only", "Put the task into a queue and process it with a worker", "Restart the Next.js server"], 2, "A queue lets the request return quickly while a worker handles the report."],
  ["Why should rate limiting be used?", ["To protect application resources from excessive requests", "To make images larger", "To replace PostgreSQL", "To make all requests slower"], 0, "Rate limiting protects finite application resources."],
  ["Which architecture is most suitable for shared state in a multi-instance application?", ["Store everything in one Next.js server's memory", "Store shared data in systems such as Redis or PostgreSQL", "Store everything in `console.log()`", "Store everything in CSS files"], 1, "Redis and PostgreSQL are shared systems that every application instance can access."],
  ["Your application traffic increases significantly, but PostgreSQL is already using almost all available connections. What should you investigate?", ["Add unlimited Next.js servers immediately", "Database connection pooling and database capacity", "Change the application's font", "Remove all caching"], 1, "More application servers can increase database pressure, so connection budgets and capacity need review."],
] as const;

export const NEXTJS_DAY_35: LessonDay = {
  day: 35,
  title: "Production Scalability",
  overview: "By the end of this day, you’ll understand how a Next.js application can grow from <b>one server</b> into a system with multiple servers, a CDN, Redis, PostgreSQL connection pooling, background jobs, and rate limiting.\n\nA production application should not depend on one server doing everything.",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "nextjs-35-1",
      title: "Stateless Servers and Horizontal Scaling",
      durationMinutes: 18,
      explanation: "A small Next.js application can begin with one server that receives requests, runs Next.js, reads and writes data, stores temporary information, and sends responses. This is fine when the application is small.\n\nWhen 10,000 users arrive at once, one server may become overloaded. <b>Horizontal scaling</b> runs several servers instead of making one server extremely powerful. A load balancer distributes requests between them.\n\n<b>Stateless</b> means a server does not depend on local memory to remember important information between requests. The next request might reach another server, so shared information belongs in PostgreSQL, Redis, object storage, or an external session system.\n\nDo not treat module-level values as shared state. Each instance has a separate `usersOnline` counter and separate session memory. <b>Vertical scaling</b> makes one machine bigger; horizontal scaling adds machines.",
      diagram: "                    USERS\n                      │\n                      ▼\n              ┌───────────────┐\n              │ Load Balancer │\n              └───────┬───────┘\n                      │\n        ┌─────────────┼─────────────┐\n        ▼             ▼             ▼\n   ┌─────────┐   ┌─────────┐   ┌─────────┐\n   │ Next.js │   │ Next.js │   │ Next.js │\n   │ Server 1│   │ Server 2│   │ Server 3│\n   └────┬────┘   └────┬────┘   └────┬────┘\n        └─────────────┼─────────────┘\n                      │\n             ┌────────┴────────┐\n             ▼                 ▼\n       ┌───────────┐       ┌───────┐\n       │PostgreSQL │       │ Redis │\n       └───────────┘       └───────┘",
      codeExample: { title: "A stateless route backed by PostgreSQL", code: `// app/api/users/route.ts
import { db } from "@/lib/db";

export async function GET() {
  const users = await db.user.findMany();
  return Response.json(users);
}`, details: "The data lives in PostgreSQL, not a local variable, so any Next.js instance can execute this route." },
      keyTakeaways: ["<b>Horizontal scaling</b> means adding more servers.", "A <b>stateless server</b> does not rely on local memory for shared data.", "Shared data belongs in PostgreSQL, Redis, object storage, or an external session system.", "A load balancer distributes requests between instances."],
      commonMistakes: ["<b>Storing important state in memory:</b> it belongs to only one server process.", "<b>Assuming every request reaches the same server:</b> this is not guaranteed.", "<b>Keeping sessions only in server memory:</b> the next request may reach another instance.", "<b>Sharing files through local storage:</b> Server 2 may not have files written by Server 1."],
      quiz: [],
      rawMiniQuiz: "<b>1. What does horizontal scaling mean?</b>\nAdding more servers.\n\n<b>2. Why can server memory be a problem?</b>\nEach server has its own memory.\n\n<b>3. Where can shared application state be stored?</b>\nPostgreSQL or Redis.\n\n<b>4. What is the job of a load balancer?</b>\nIt distributes requests across available servers.",
    },
    {
      id: "nextjs-35-2",
      title: "CDN, Load Balancing, and Request Protection",
      durationMinutes: 18,
      explanation: "Users may be located around the world. If every request travels to one application server, distant users may experience slower responses. A <b>CDN</b>, or Content Delivery Network, has servers in many locations and can serve cacheable content closer to users.\n\nCDNs commonly cache images, JavaScript, CSS, fonts, videos, and other static assets. A cached response returns immediately and reduces work for application servers. A load balancer distributes the remaining requests across healthy instances. Health checks such as `GET /api/health` let it stop sending traffic to an unhealthy server.\n\nScaling does not mean accepting unlimited traffic. A <b>rate limit</b> controls how many requests a client can make in a period, such as `100 requests / minute / IP`. Over-limit requests commonly receive `429 Too Many Requests`. Protect expensive routes such as login, payments, search, and report generation.\n\nRate-limit counters must be shared. A local `let requests = 0` value differs on every server. Redis can provide shared counters.",
      diagram: "                         INTERNET\n                            │\n                            ▼\n                    ┌───────────────┐\n                    │      CDN      │\n                    └───────┬───────┘\n                            ▼\n                    ┌───────────────┐\n                    │ Rate Limiter  │\n                    └───────┬───────┘\n                            ▼\n                    ┌───────────────┐\n                    │Load Balancer  │\n                    └───────┬───────┘\n                       ╱     │     ╲\n                      ▼      ▼      ▼\n                  Server 1 Server 2 Server 3",
      codeExample: { title: "Health route and rate-limit boundary", code: `// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: "ok" });
}

const allowed = await rateLimiter.check(clientId);

if (!allowed) {
  return new Response("Too many requests", { status: 429 });
}`, details: "Keep rate-limit state in shared storage such as Redis, not a local counter." },
      keyTakeaways: ["A CDN can serve cacheable content closer to users.", "A load balancer distributes requests across instances.", "Health checks identify unhealthy servers.", "Rate limiting protects resources from excessive requests.", "Rate-limit state must be shared across servers."],
      commonMistakes: ["<b>Sending every request to the application:</b> static assets can often use a CDN.", "<b>Having a local rate limiter:</b> its counters are inconsistent across servers.", "<b>Protecting only the frontend:</b> APIs can be called directly.", "<b>Giving every endpoint the same limit:</b> endpoint costs differ."],
      quiz: [],
      rawMiniQuiz: "<b>1. What does CDN stand for?</b>\nContent Delivery Network.\n\n<b>2. What does a load balancer do?</b>\nIt distributes traffic across application servers.\n\n<b>3. What HTTP status represents rate limiting?</b>\n`429`.\n\n<b>4. Why should rate-limit counters be shared?</b>\nRequests can reach different application servers.",
    },
    {
      id: "nextjs-35-3",
      title: "Shared Cache and Redis",
      durationMinutes: 18,
      explanation: "Repeatedly querying PostgreSQL for `GET /api/products` can make the database perform the same work thousands of times. A cache stores data that the application expects to need again.\n\nRedis is commonly used for shared caching. It is an in-memory data store built for fast reads, writes, counters, expiration, queues, locks, and rate limiting. Every Next.js server can access the same cache.\n\nA <b>cache hit</b> means Redis already has the requested value. A <b>cache miss</b> means the application queries PostgreSQL, stores the result in Redis, and returns it.\n\nCached data can become stale. Give values a TTL, or <b>Time To Live</b>. When database data changes, use short TTLs, delete the cache after updates, update the cache, or use versioned keys.",
      diagram: "                         Request\n                            │\n                            ▼\n                     ┌─────────────┐\n                     │    Redis    │\n                     └──────┬──────┘\n                    ┌───────┴───────┐\n                   HIT             MISS\n                    │               │\n                    ▼               ▼\n                Response       PostgreSQL\n                                     │\n                                     ▼\n                                   Redis",
      codeExample: { title: "Cache featured products", code: `// app/api/products/route.ts
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";

export async function GET() {
  const key = "products:featured";
  const cached = await redis.get(key);

  if (cached) return Response.json(JSON.parse(cached));

  const products = await db.product.findMany({
    where: { featured: true },
  });

  await redis.set(key, JSON.stringify(products), { EX: 60 });
  return Response.json(products);
}`, details: "On a miss, query PostgreSQL, save the result to Redis, then return it." },
      keyTakeaways: ["A cache avoids repeated expensive work.", "Redis can be a shared cache for multiple Next.js servers.", "A cache hit returns a stored value; a miss queries another source.", "TTL stops cached data living forever.", "Cache invalidation needs a deliberate strategy."],
      commonMistakes: ["<b>Caching everything:</b> not every value should be cached.", "<b>Forgetting expiration:</b> data can become stale.", "<b>Putting sensitive data in an unsafe cache:</b> consider who can access it.", "<b>Ignoring invalidation:</b> database updates do not automatically update Redis.", "<b>Using local memory:</b> it creates separate caches on separate servers."],
      quiz: [],
      rawMiniQuiz: "<b>1. What is a cache hit?</b>\nThe requested data already exists in the cache.\n\n<b>2. What is a cache miss?</b>\nThe data is not cached, so another source must be queried.\n\n<b>3. What does TTL mean?</b>\nTime To Live.\n\n<b>4. Why is Redis useful with multiple servers?</b>\nIt provides shared data all application instances can access.",
    },
    {
      id: "nextjs-35-4",
      title: "PostgreSQL Pooling and Background Jobs",
      durationMinutes: 18,
      explanation: "Multiple application servers can create too many PostgreSQL connections. Four servers with 100 connections each means 400 connections, which the database may not support.\n\nA <b>connection pool</b> keeps reusable connections. Instead of creating and closing one for every request, the application reuses a controlled set. The exact configuration depends on the host, database provider, traffic, and number of instances.\n\nSome work is too slow for a user request: generating thumbnails, sending email, or creating reports. Put this work on a queue. Next.js can return `Your job has been queued`, then workers process it later.\n\nQueues let workers scale separately from web servers. Production queues also need retries and failure handling.",
      diagram: "                        USERS\n                          │\n                          ▼\n                    ┌───────────┐\n                    │  Next.js  │\n                    └─────┬─────┘\n              ┌───────────┴───────────┐\n              ▼                       ▼\n       Connection Pool             Job Queue\n              │                 ┌─────┼─────┐\n              ▼                 ▼     ▼     ▼\n         PostgreSQL          Worker Worker Worker",
      codeExample: { title: "Pool connections and queue reports", code: `// lib/db.ts
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

// app/api/reports/route.ts
export async function POST() {
  const job = await reportQueue.add("generate-report", {
    userId: 123,
  });

  return Response.json({
    jobId: job.id,
    status: "queued",
  });
}`, details: "A worker later processes the job. The web request creates work but does not wait for it." },
      keyTakeaways: ["Database connections are limited resources.", "Connection pooling reuses and limits connections.", "Multiple instances can create many connections, so budgets matter.", "Background jobs move slow work outside requests.", "Workers can be scaled separately from web servers."],
      commonMistakes: ["<b>Creating unlimited database connections:</b> this can overwhelm PostgreSQL.", "<b>Doing slow work inside HTTP requests:</b> it causes timeouts and poor user experience.", "<b>Running heavy jobs on web servers:</b> web servers should handle web requests.", "<b>Forgetting failed jobs:</b> queues need retry and failure handling.", "<b>Assuming one worker is enough:</b> workload can grow."],
      quiz: [],
      rawMiniQuiz: "<b>1. What does a connection pool do?</b>\nIt manages and reuses database connections.\n\n<b>2. Why use a background queue?</b>\nTo move slow work outside the user’s request.\n\n<b>3. Can workers be scaled separately from Next.js servers?</b>\nYes.\n\n<b>4. Give one example of a background job.</b>\nGenerating a report or sending an email.",
    },
    {
      id: "nextjs-35-5",
      title: "Production Scalability Architecture",
      durationMinutes: 18,
      explanation: "A production architecture brings together stateless Next.js servers, horizontal scaling, CDN delivery, load balancing, rate limiting, Redis caching, PostgreSQL pooling, background jobs, and workers.\n\n1. <b>User request</b>\n`GET /dashboard` enters the infrastructure.\n\n2. <b>CDN</b>\nA cached resource can return without reaching the application.\n\n3. <b>Rate limiting</b>\nThe request may be checked against a shared limit.\n\n4. <b>Load balancer</b>\nAn available `Next.js` instance is selected.\n\n5. <b>Next.js</b>\nThe application may read Redis first, then PostgreSQL on a cache miss.\n\n6. <b>Background work</b>\nExpensive work becomes a queue job that a worker handles later. The user does not wait for the worker to finish.\n\nDifferent companies use different services. The important thing is understanding <b>why each piece exists</b>: CDN for static/cacheable delivery, rate limiting for protection, load balancing for traffic distribution, Redis for shared fast-access data, PostgreSQL for durable data, queues for pending work, and workers for expensive operations.",
      diagram: "                         ┌─────────────┐\n                         │    USERS    │\n                         └──────┬──────┘\n                                ▼\n                         ┌─────────────┐\n                         │     CDN     │\n                         └──────┬──────┘\n                                ▼\n                         ┌─────────────┐\n                         │Rate Limiter │\n                         └──────┬──────┘\n                                ▼\n                         ┌─────────────┐\n                         │Load Balancer│\n                         └──────┬──────┘\n                  ┌─────────────┼─────────────┐\n                  ▼             ▼             ▼\n             ┌─────────┐   ┌─────────┐   ┌─────────┐\n             │Next.js 1│   │Next.js 2│   │Next.js 3│\n             └────┬────┘   └────┬────┘   └────┬────┘\n                  └─────────────┼─────────────┘\n                    ┌───────────┴───────────┐\n                    ▼                       ▼\n              ┌───────────┐             ┌───────┐\n              │ PostgreSQL│             │ Redis │\n              └───────────┘             └───┬───┘\n                                            ▼\n                                      ┌───────────┐\n                                      │ Job Queue │\n                                      └─────┬─────┘\n                              ┌─────────────┼─────────────┐\n                              ▼             ▼             ▼\n                         ┌─────────┐   ┌─────────┐   ┌─────────┐\n                         │ Worker 1│   │ Worker 2│   │ Worker 3│\n                         └─────────┘   └─────────┘   └─────────┘",
      codeExample: { title: "Cache reads and queue expensive work", code: `export async function GET() {
  const cached = await redis.get("products");
  if (cached) return Response.json(JSON.parse(cached));

  const products = await db.product.findMany();
  await redis.set("products", JSON.stringify(products), { EX: 60 });

  return Response.json(products);
}

export async function POST() {
  const job = await reportQueue.add("generate-report", {
    userId: 123,
  });

  return Response.json({ status: "queued", jobId: job.id });
}`, details: "Keep each responsibility separate: delivery, protection, traffic distribution, shared caching, durable storage, pending work, and background processing." },
      keyTakeaways: ["Production scalability separates responsibilities.", "Next.js servers should be stateless.", "CDN reduces work and load balancers distribute requests.", "Rate limiting protects resources and Redis provides shared fast data.", "PostgreSQL stores durable data; pooling protects it from connection pressure.", "Queues move expensive work away from web requests and workers process it."],
      commonMistakes: ["<b>Adding infrastructure without understanding the problem:</b> ask what it solves first.", "<b>Treating Redis as the primary database:</b> PostgreSQL can remain the durable source of truth.", "<b>Forgetting database limits:</b> more servers can mean more connections.", "<b>Making every operation synchronous:</b> slow work should often become a job.", "<b>Keeping application state in one server:</b> any instance can receive a request.", "<b>Ignoring failure:</b> expect server, database, Redis, queue, and network failures."],
      quiz: [],
      rawMiniQuiz: "<b>1. Why use a load balancer?</b>\nTo distribute requests across application instances.\n\n<b>2. What does Redis commonly provide?</b>\nFast shared storage such as caching, counters, and temporary data.\n\n<b>3. Why use connection pooling?</b>\nTo reuse database connections and control how many are opened.\n\n<b>4. Why use a queue?</b>\nTo move slow work into background processing.\n\n<b>5. What does stateless mean here?</b>\nAny application server can handle a request without private state from another server.",
    },
  ],
  finalQuiz: finalQuiz.map(([question, options, correctIndex, explanation]) => ({ question, options: [...options], correctIndex, explanation })),
  footer: "<b>Day 35 mental model</b>\n\nCDN → protect → distribute → process → cache → store → queue → work.\n\nA scalable Next.js production system does not make one server do everything. It sends each responsibility to the component designed for it.",
  project: {
    name: "MediaHub",
    goal: "Build a Next.js media management application with optimized images, validated uploads, and object-storage architecture.",
    brief: "Users can view a responsive image gallery, upload images, and see optimized previews. Use `next/image` for gallery images, `next/font` for typography, and `public/` for appropriate static assets.\n\nStore media metadata in PostgreSQL and the actual binary files in object storage. Large files should upload directly to object storage through presigned URLs, never with permanent storage credentials exposed to the browser.\n\nMediaHub flow:\n\nUser\n  │\n  ▼\nCDN / WAF\n  │\n  ▼\nLoad Balancer\n  │\n  ├──► Next.js Server 1\n  ├──► Next.js Server 2\n  └──► Next.js Server 3\n              │\n       ┌──────┴──────┐\n       ▼             ▼\n    Redis       PostgreSQL\n                    │\n                    ▼\n             Media metadata\n\nLarge upload → presigned URL → object storage → CDN → user.",
    steps: [
      "Create a responsive media gallery with `next/image`.",
      "Use `fill` and `sizes` for at least one responsive image.",
      "Configure an approved remote image host and add an optimized `next/font` font.",
      "Add suitable static assets, such as a logo, to `public/`.",
      "Create a `FormData` upload form and validate file size and allowed image types on the server.",
      "Check authentication and ownership so users cannot upload or modify another user’s media.",
      "Create a media model with `userId`, `objectKey`, file name, content type, size, dimensions, status, and creation time.",
      "Design a presigned upload flow: browser requests an upload URL, uploads directly to object storage, then saves metadata to PostgreSQL.",
      "Document how a CDN will deliver stored images.",
    ],
    acceptance: [
      "Images use `next/image`, including useful `sizes` and at least one `fill` image.",
      "Remote sources are explicitly controlled, `next/font` is used, and static assets live appropriately in `public/`.",
      "Uploads use `FormData` where appropriate and validate size, type, authentication, ownership, and destination on the server.",
      "PostgreSQL stores media metadata while actual image files live in object storage.",
      "Storage credentials never reach the browser; large uploads use a presigned URL design.",
      "The design supports multiple Next.js servers and includes a documented CDN strategy.",
    ],
    stretch: [
      "Implement an S3-compatible presigned upload flow.",
      "Generate thumbnails or multiple image sizes asynchronously.",
      "Serve private media through signed download URLs.",
      "Add upload status: `pending` → `processing` → `ready` or `failed`.",
      "Add a queue and worker for image processing, malware scanning, and upload rate limiting with Redis.",
    ],
  },
};
