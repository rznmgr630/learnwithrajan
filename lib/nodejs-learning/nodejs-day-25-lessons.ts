import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_25_LESSONS: LessonDay = {
  day: 25,
  title: "Real time",
  totalMinutes: 100,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "polling-and-choosing",
      title: "Polling, long polling and choosing",
      durationMinutes: 11,
      explanation:
        "HTTP is request and response. Real time means the server speaks when something happens.\n\n---\n\n## Polling\n\n<b>Polling</b> (the client asks repeatedly for new data).\n\n```text\nGET /messages → []   wait 5s\nGET /messages → []   wait 5s\nGET /messages → [\"Hello\"]\n```\n\n> Polling is dismissed too quickly. It is the only option here that needs <b>no persistent connection</b>, which means it works through every proxy, survives every network change, needs no reconnection logic, and scales the way your existing API scales.\n>\n> Its cost is arithmetic. A thousand clients polling every five seconds is 200 requests per second, forever, whether or not anything changed. And it has a <b>latency floor</b>: with a five-second interval, average latency is two and a half seconds, and shortening the interval multiplies the request count.\n\n---\n\n## Long polling\n\n<b>Long polling</b> (the server holds the request open until there is data or a timeout).\n\n```text\nrequest → server waits → data arrives → response → client requests again\n```\n\n> It gets you near-instant delivery over ordinary HTTP, which is why it existed before anything better. The cost that matters in Node: each waiting client holds an <b>open request</b>, and Day 17's arithmetic applies if that handler is holding a database connection while it waits.\n>\n> Mostly a historical option now. Reach for it if a proxy you do not control breaks streaming, which does still happen.\n\n---\n\n## The decision\n\n```text\nNo real-time need        → HTTP\nOccasional updates       → polling\nServer to client only    → SSE\nBoth directions          → WebSocket\n```\n\n> The useful reframing is that a persistent connection is a <b>resource you now own</b>. Every one is a socket, a heartbeat timer, some memory, and a reconnection story on the client. A thousand connections is a thousand of each, and they survive as long as the tab is open, which is much longer than a request.\n>\n> So the question is not \"which is most capable\". It is <b>whether you need the server to speak unprompted</b>. If a client can ask, let it ask.\n\n---\n\n## What people get wrong in both directions\n\n> <b>Reaching for WebSockets by default.</b> A notification bell, a progress bar and a live dashboard are all server-to-client only, so SSE does the job with plain HTTP semantics, automatic reconnection built into the browser, and no protocol upgrade for a proxy to mishandle.\n>\n> <b>Polling something expensive.</b> Polling is cheap when the endpoint is cheap. A thousand clients polling an endpoint that runs a five-table aggregate every five seconds is a self-inflicted load test, and Day 23's caching lesson is the fix before real time is.\n\n---\n\n## The honest first question\n\n> Before any of this: <b>how stale is acceptable?</b> Thirty seconds of staleness on a dashboard is usually fine, and it makes polling a cached endpoint the correct answer. One second on a chat message is not, and that is a genuine real-time requirement.\n>\n> That question decides the technology. Asking \"WebSockets or SSE\" first is how you end up maintaining connection infrastructure for a page that refreshes every minute.",
      diagram: `HTTP is request and response.
real time means THE SERVER SPEAKS when something
happens.


Polling is dismissed too quickly

    GET /messages → []      wait 5s
    GET /messages → []      wait 5s
    GET /messages → ["Hello"]

    it is the only option here needing NO
    PERSISTENT CONNECTION, which means:

      works through every proxy
      survives every network change
      no reconnection logic
      scales the way your existing API scales

    its cost is ARITHMETIC:

      1,000 clients × every 5s
        = 200 requests/second, forever,
          whether or not anything changed

    and a LATENCY FLOOR:

      a 5s interval = 2.5s average latency
      shortening it MULTIPLIES the request count


Long polling

    request → server waits → data → response
            → client requests again

    near-instant delivery over ordinary HTTP,
    which is why it existed before anything
    better.

    ⚠ the Node cost: each waiting client holds an
      OPEN REQUEST, and Day 17 applies if that
      handler holds a DATABASE CONNECTION while it
      waits.

    mostly historical. reach for it if a proxy you
    do not control breaks streaming, which still
    happens.


The decision

    no real-time need      → HTTP
    occasional updates     → polling
    server → client only   → SSE
    both directions        → WebSocket

⚠ the useful reframing:

    A PERSISTENT CONNECTION IS A RESOURCE YOU NOW
    OWN.

      each one: a socket, a heartbeat timer, some
      memory, a reconnection story on the client

      1,000 connections = 1,000 of each

      and they survive as long as THE TAB IS
      OPEN, which is much longer than a request

    so the question is not "which is most
    capable".

    it is WHETHER YOU NEED THE SERVER TO SPEAK
    UNPROMPTED.

    if a client can ask, LET IT ASK.


What people get wrong, both directions

    REACHING FOR WEBSOCKETS BY DEFAULT

      a notification bell, a progress bar, a live
      dashboard are all SERVER-TO-CLIENT ONLY

      → SSE does it with plain HTTP semantics,
        browser-built-in reconnection, and no
        protocol upgrade for a proxy to mishandle

    POLLING SOMETHING EXPENSIVE

      polling is cheap when the ENDPOINT is cheap

      1,000 clients polling a five-table aggregate
      every 5s is a self-inflicted load test

      → Day 23's caching is the fix before real
        time is


⚠ The honest first question

    before any of this:

      HOW STALE IS ACCEPTABLE?

    30 seconds on a dashboard
      → usually fine
      → polling a CACHED endpoint is the correct
        answer

    1 second on a chat message
      → not fine
      → a genuine real-time requirement

    that question decides the technology.

    asking "WebSockets or SSE" first is how you
    end up maintaining connection infrastructure
    for a page that refreshes every minute.`,
      codeExample: {
        title: "The arithmetic, and when polling wins",
        code: `// ── Polling, and the numbers that decide ────────────────────
//
//   clients   interval   requests/second
//   ─────────────────────────────────────
//      100        5s            20
//    1,000        5s           200
//   10,000        5s         2,000
//   10,000        1s        10,000
//
// Two things to notice.
//
// The load is CONSTANT. Those 200 requests per second happen
// at 3am with nothing changing, because polling has no idea
// whether there is news.
//
// And the latency floor: a 5-second interval means the average
// client learns about a change 2.5 seconds late. Halving the
// latency doubles the requests.


// ── ✓ Polling done properly, which is often enough ──────────
app.get("/notifications/unread-count", {
  preHandler: authenticate,
}, async (request, reply) => {
  // Day 23: a cheap endpoint is what makes polling cheap.
  const count = await cached(
    \`unread:v1:\${request.user.id}\`,
    10,
    () => countUnread(app.db, request.user.id),
  );

  // Day 23's HTTP layer: a 304 costs no bytes, and the browser
  // will send If-None-Match automatically.
  reply.header("cache-control", "private, max-age=10");

  return { count };
});
//
// Now 1,000 clients polling every 15 seconds is 67 requests
// per second against a 10-second cache, so roughly 7 database
// queries per second reach Postgres.
//
// Compare that with the engineering cost of a WebSocket layer
// for an unread badge, and polling is clearly right.

// ⚠ And the version that is not:
app.get("/dashboard", { preHandler: authenticate }, async (request) => {
  // Five joins, two aggregates, 250ms.
  return buildDashboard(app.db, request.user.id);
});
//
// 1,000 clients polling this every 5 seconds is 200 requests
// per second at 250ms each, which needs 50 concurrent
// database connections just for polling. Day 17's pool
// arithmetic says you do not have them.
//
// The fix is Day 23's cache, not real time. A 30-second cache
// on a shared aggregate turns 200 requests per second into
// two queries per minute, and the dashboard is still fresh
// enough for anybody looking at it.


// ── Long polling, and the connection it holds ───────────────
app.get("/messages/wait", { preHandler: authenticate }, async (request, reply) => {
  const since = Number(request.query.since ?? 0);

  // ⚠ Get the data OUT of the database before waiting, so the
  // wait does not hold a pool connection. Day 17.
  const existing = await getMessagesSince(app.db, request.user.id, since);
  if (existing.length) return { messages: existing };

  // Now wait with nothing held but the HTTP request itself.
  const message = await Promise.race([
    waitForMessage(request.user.id, { signal: request.raw.signal }),
    sleep(25_000).then(() => null),
    //     ^^^^^^ under any proxy's idle timeout, or the proxy
    //     closes it and the client sees an error rather than
    //     an empty result
  ]);

  return { messages: message ? [message] : [] };
});
//
// ✗ The version that takes your service down:
//
//   const client = await pool.connect();
//   const message = await waitForMessage(userId);   // 25 seconds
//   client.release();
//
// A hundred waiting clients is a hundred held connections, and
// Day 17's pool has ten. Every other request in the
// application now waits for a connection, and the cause is an
// endpoint that is doing nothing.


// ── The decision, written as the question that matters ──────
//   feature              staleness OK?   answer
//   ──────────────────────────────────────────────────────────
//   unread badge         15s             poll a cached endpoint
//   dashboard metrics    30s             poll a cached endpoint
//   deploy log tail      1s, one-way     SSE
//   AI token streaming   immediate,      SSE
//                        one-way
//   job progress bar     1s, one-way     SSE
//   chat message         1s, two-way     WebSocket
//   collaborative cursor 50ms, two-way   WebSocket
//   multiplayer position 50ms, two-way   WebSocket
//
// Note how many rows are one-way. A notification, a progress
// bar and a log tail all only need the server to speak, and
// SSE gives you that over ordinary HTTP with reconnection
// handled by the browser.
//
// The two-way rows have something in common too: the client
// sends frequently and unprompted. That is the actual
// signal for a WebSocket, not "this feature feels live".


// ── ⚠ What a persistent connection costs you ────────────────
// Per connection, for as long as the tab is open:
//
//   a file descriptor          → ulimit, and Day 10's socket
//                                lesson
//   a heartbeat timer          → next lessons
//   ~10-50KB of memory         → × 10,000 = 100-500MB
//   an entry in a room index   → memory again
//   a reconnection story       → client code you must write
//
// And one thing polling never has to think about: which
// instance the client is connected to. That is the last
// lesson of this day, and it is the part that turns real time
// from a feature into an architecture.
//
// None of that argues against real time. It argues for
// answering "how stale is acceptable?" first, because a
// feature that tolerates 30 seconds does not need any of it.`,
      },
      keyTakeaways: [
        "Polling needs no persistent connection, so it works through every proxy, needs no reconnection logic, and scales like your existing API.",
        "Its cost is arithmetic: 1,000 clients every five seconds is 200 requests per second whether or not anything changed.",
        "It also has a latency floor. A five-second interval means 2.5 seconds average latency, and halving that doubles the requests.",
        "Polling is cheap only when the endpoint is cheap. Day 23's caching is what makes it viable.",
        "Polling an expensive aggregate is a self-inflicted load test, and the fix is a cache rather than real time.",
        "Long polling holds an open request per waiting client, so never hold a database connection while waiting.",
        "Keep a long-poll timeout under any proxy's idle timeout, or the client sees an error instead of an empty result.",
        "A persistent connection is a resource you own: a socket, a timer, memory, and a reconnection story, for as long as the tab is open.",
        "So the question is whether the server needs to speak unprompted. If a client can ask, let it ask.",
        "A notification bell, a progress bar and a log tail are all one-way, so SSE fits with plain HTTP semantics and browser reconnection.",
        "The real signal for a WebSocket is a client that sends frequently and unprompted, not a feature that feels live.",
        "Ask \"how stale is acceptable?\" first. That question decides the technology, and asking about protocols first is how you maintain connection infrastructure for a page that refreshes every minute.",
      ],
      commonMistakes: [
        "Choosing WebSockets because they are the most capable option, then owning heartbeats, reconnection and per-instance state for a notification badge.",
        "Polling an endpoint that runs a five-table aggregate, which turns a thousand clients into a load test.",
        "Holding a database connection during a long poll, so a hundred idle waiters exhaust a pool of ten.",
        "A long-poll timeout longer than the proxy's idle timeout, so the client sees connection errors rather than empty results.",
        "Shortening a polling interval to reduce latency without noticing the request count multiplies.",
        "Using SSE or WebSockets for something that tolerates thirty seconds of staleness.",
        "Asking \"SSE or WebSocket\" before asking how stale the data may be.",
        "Ignoring that a connection lasts as long as the tab, so ten thousand of them is a standing resource commitment rather than a burst.",
      ],
      quiz: [
        {
          question: "What is polling's underrated advantage?",
          options: [
            "Lower latency",
            "No persistent connection, so it works through every proxy, needs no reconnection logic, and scales like your existing API",
            "Fewer bytes",
            "Server push",
          ],
          correctIndex: 1,
          explanation:
            "Its costs are the constant request rate and a latency floor of half the interval.",
        },
        {
          question: "What makes polling viable or not?",
          options: [
            "The number of clients",
            "Whether the endpoint is cheap. Polling a cached count is fine; polling a five-table aggregate is a self-inflicted load test.",
            "The interval",
            "HTTP version",
          ],
          correctIndex: 1,
          explanation:
            "Day 23's caching lesson is the fix for an expensive polled endpoint, before real time is.",
        },
        {
          question: "What must a long-polling handler avoid holding while it waits?",
          options: [
            "The request object",
            "A database connection. A hundred idle waiters would exhaust a pool of ten and stall every other request.",
            "A timer",
            "The response headers",
          ],
          correctIndex: 1,
          explanation:
            "Read the data first, release the connection, then wait with nothing held but the HTTP request.",
        },
        {
          question: "What is the actual signal that you need a WebSocket rather than SSE?",
          options: [
            "The feature feels live",
            "The client sends frequently and unprompted. A notification bell, a progress bar and a log tail are all one-way.",
            "Low latency",
            "Many clients",
          ],
          correctIndex: 1,
          explanation:
            "SSE gives you server-to-client over plain HTTP with reconnection built into the browser and no protocol upgrade.",
        },
        {
          question: "What question should you answer before choosing a real-time technology?",
          options: [
            "How many clients?",
            "How stale is acceptable? A feature that tolerates thirty seconds does not need connection infrastructure at all.",
            "Which library is popular?",
            "Do we have Redis?",
          ],
          correctIndex: 1,
          explanation:
            "Asking about protocols first is how you end up maintaining heartbeats and reconnection for a page that refreshes every minute.",
        },
      ],
    },
    {
      id: "sse",
      title: "Server-Sent Events",
      durationMinutes: 12,
      explanation:
        "## SSE\n\n<b>SSE (Server-Sent Events)</b> (a persistent HTTP response over which the server streams events to the client).\n\n```text\nServer ─────────→ Client\n```\n\nOne direction. The client sends nothing back over this connection; if it needs to speak, it makes a normal request.\n\n---\n\n## It is just an HTTP response that does not end\n\nVerified with `node:http` and nothing else:\n\n```text\nstatus 200, content-type: text/event-stream\n\nid: 1\nevent: tick\ndata: {\"n\":1}\n\nid: 2\nevent: tick\ndata: {\"n\":2}\n```\n\n> That is the entire protocol. Fields separated by newlines, and a <b>blank line</b> terminates an event. Verified on the wire as `\"id: 1\\nevent: tick\\ndata: {\\\"n\\\":1}\\n\\n\"`.\n>\n> The consequence people underuse: because it is a normal HTTP response, your existing authentication, cookies, middleware, logging and error handling all work unchanged. There is no upgrade handshake and nothing for a proxy to refuse.\n\n---\n\n## The three fields worth knowing\n\n```text\ndata:   the payload. multiple data lines are joined with newlines.\nevent:  a name, so the client can listen for specific types.\nid:     an identifier the browser remembers.\nretry:  how long the browser should wait before reconnecting.\n```\n\n> `id` is the one that matters, and it is what makes SSE genuinely better than a hand-rolled stream. The browser stores the last id it saw and sends it back as <b>`Last-Event-ID`</b> on reconnection, so your server can resume from there. That gives you gap-free delivery across a dropped connection <b>for free</b>, and it is the feature almost nobody uses.\n\n---\n\n## Reconnection is the browser's job\n\n> `EventSource` reconnects automatically. That is the single biggest practical advantage over WebSockets, where reconnection with backoff is code you write and get wrong.\n>\n> The catch is that automatic reconnection also means <b>you cannot easily stop it</b>. If the server returns a 401 because the session expired, the browser will reconnect and get another 401, in a loop. Close the connection deliberately from the client on an auth failure, or send an event telling it to stop.\n\n---\n\n## Two things that break SSE in production\n\n> <b>Buffering.</b> Any proxy or compression layer that buffers the response defeats streaming entirely: events accumulate and arrive in a batch, or never. Set `X-Accel-Buffering: no` for nginx, and disable compression on the route, because a gzip stream that flushes on a buffer boundary is exactly the wrong behaviour.\n>\n> <b>The browser's connection limit.</b> Over HTTP/1.1 a browser allows roughly <b>six connections per origin</b>, and an SSE stream holds one open indefinitely. Six tabs on your app and the seventh request of any kind hangs. This is the failure that gets diagnosed as \"the site randomly stops loading\", and it does not happen over HTTP/2, where connections are multiplexed. If you serve SSE over HTTP/1.1, that limit is a design constraint.\n\n---\n\n## Keep the connection alive\n\n> Send a comment line, `: ping`, every 20 to 30 seconds. It is ignored by the client and it stops proxies and load balancers from closing an idle connection. Without it a stream that has no events for a minute simply dies, and the reconnection hides the problem while doubling your connection churn.",
      diagram: `SSE: one direction

    Server ─────────→ Client

    the client sends nothing back over this
    connection. if it needs to speak, it makes a
    NORMAL REQUEST.


It is just an HTTP response that does not end

    verified with node:http and nothing else:

      200, content-type: text/event-stream

      id: 1
      event: tick
      data: {"n":1}

      id: 2
      event: tick
      data: {"n":2}

    that is the ENTIRE protocol. fields on lines,
    and A BLANK LINE TERMINATES AN EVENT.

    verified on the wire:
      "id: 1\\nevent: tick\\ndata: {\\"n\\":1}\\n\\n"

    ⚠ the consequence people underuse:

      because it is a normal HTTP response, your
      existing AUTH, COOKIES, MIDDLEWARE, LOGGING
      and ERROR HANDLING all work unchanged.

      no upgrade handshake, nothing for a proxy to
      refuse.


The four fields

    data:   the payload. multiple data lines join
            with newlines.
    event:  a name, so the client can listen for
            specific types
    id:     an identifier THE BROWSER REMEMBERS
    retry:  how long to wait before reconnecting

⚠ id is the one that matters:

    the browser stores the last id it saw and
    sends it back as LAST-EVENT-ID on
    reconnection.

    → your server can RESUME FROM THERE

    gap-free delivery across a dropped connection,
    FOR FREE, and almost nobody uses it.


Reconnection is the BROWSER'S job

    EventSource reconnects automatically.

    that is the biggest practical advantage over
    WebSockets, where reconnection with backoff is
    code you write and get wrong.

    ⚠ the catch: you cannot easily STOP it.

      the server returns 401 because the session
      expired

      → the browser reconnects
      → another 401
      → in a loop

      close deliberately from the client on an
      auth failure, or send an event telling it
      to stop.


⚠⚠ Two things that break SSE in production

    BUFFERING

      any proxy or compression layer that buffers
      the response DEFEATS STREAMING: events
      accumulate and arrive in a batch, or never.

      set X-Accel-Buffering: no for nginx
      disable compression on the route

        ↳ a gzip stream flushing on a buffer
          boundary is exactly the wrong behaviour

    THE BROWSER'S CONNECTION LIMIT

      over HTTP/1.1 a browser allows about SIX
      CONNECTIONS PER ORIGIN, and an SSE stream
      holds one open INDEFINITELY.

      six tabs on your app and the SEVENTH REQUEST
      OF ANY KIND HANGS.

      → diagnosed as "the site randomly stops
        loading"

      does not happen over HTTP/2, where
      connections are multiplexed.

      if you serve SSE over HTTP/1.1, that limit
      is a DESIGN CONSTRAINT.


Keep it alive

    send a comment line, ": ping", every 20-30s.

    ignored by the client, and it stops proxies
    and load balancers closing an idle connection.

    without it a stream with no events for a
    minute simply DIES, and the automatic
    reconnection HIDES the problem while doubling
    your connection churn.`,
      codeExample: {
        title: "SSE with node:http, and with resume",
        code: `// ── Verified with node:http and nothing else ────────────────
import { createServer } from "node:http";

createServer((req, res) => {
  if (req.url !== "/events") { res.writeHead(404).end(); return; }

  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
    "x-accel-buffering": "no",
    //                   ^^^^ ⚠ nginx buffers proxied responses
    //                   by default, which turns a stream into
    //                   a batch that arrives when the buffer
    //                   fills. This header disables it.
  });
  res.flushHeaders();
  //  ^^^^^^^^^^^^^ send the headers immediately, so the client
  //  knows the connection is open before the first event

  let n = 0;
  const iv = setInterval(() => {
    n++;
    res.write(\`id: \${n}\\nevent: tick\\ndata: \${JSON.stringify({ n })}\\n\\n\`);
    //                                                          ^^^^^^
    //                                          the blank line IS the
    //                                          event terminator
  }, 1000);

  // ⚠ Not optional. Without this the interval runs forever
  // for every client that ever connected, writing to a closed
  // socket. Ten thousand page loads is ten thousand live
  // timers.
  req.on("close", () => clearInterval(iv));
}).listen(3000);

// VERIFIED wire output:
//
//   status 200 | content-type: text/event-stream
//
//   "id: 1\\nevent: tick\\ndata: {\\"n\\":1}\\n\\nid: 2\\nevent: tick\\ndata: {\\"n\\":2}\\n\\n"
//
// Readable:
//   id: 1
//   event: tick
//   data: {"n":1}
//
//   id: 2
//   event: tick
//   data: {"n":2}
//
// That is the whole protocol. No library, no framing, no
// handshake.


// ── ✓ With Fastify, so auth and logging apply ───────────────
app.get("/jobs/:id/progress", {
  preHandler: authenticate,
  //          ^^^^^^^^^^^^ the advantage of SSE: this is an
  //          ordinary route, so Day 18's hook, Day 19's
  //          ownership check and Day 21's request logging all
  //          work with no special cases
  schema: { params: z.object({ id: z.coerce.number().int().positive() }) },
}, async (request, reply) => {
  // Day 19: ownership in the query before we start streaming.
  const [job] = await app.db.select().from(jobs).where(and(
    eq(jobs.id, request.params.id),
    eq(jobs.userId, request.user.id),
  ));
  if (!job) return reply.code(404).send({ error: "Not found" });

  reply.raw.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
    "x-accel-buffering": "no",
  });
  reply.raw.flushHeaders();

  const send = (event, data, id) => {
    if (id !== undefined) reply.raw.write(\`id: \${id}\\n\`);
    reply.raw.write(\`event: \${event}\\ndata: \${JSON.stringify(data)}\\n\\n\`);
  };

  // ⚠ The keepalive. A comment line, ignored by the client.
  const keepalive = setInterval(() => reply.raw.write(": ping\\n\\n"), 25_000);
  //                                                  ^^^^^^^^^ under
  //                                                  the 30-60s idle
  //                                                  timeout of most
  //                                                  proxies

  const unsubscribe = jobEvents.subscribe(job.id, (update) => {
    send("progress", update, update.seq);
    if (update.status === "complete" || update.status === "failed") {
      send("done", { status: update.status });
      cleanup();
      reply.raw.end();
    }
  });

  function cleanup() {
    clearInterval(keepalive);
    unsubscribe();
  }

  // Both, because either can fire first.
  request.raw.on("close", cleanup);
  reply.raw.on("close", cleanup);

  return reply;      // tell Fastify we are handling the response
});


// ── ✓ The feature almost nobody uses: resume ────────────────
app.get("/notifications/stream", { preHandler: authenticate }, async (request, reply) => {
  // The browser sends this automatically on reconnection. It
  // is the last id it received.
  const lastEventId = Number(request.headers["last-event-id"] ?? 0);

  reply.raw.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
    "x-accel-buffering": "no",
  });
  reply.raw.flushHeaders();

  // Replay whatever the client missed while disconnected.
  const missed = await app.db
    .select()
    .from(notifications)
    .where(and(
      eq(notifications.userId, request.user.id),
      gt(notifications.seq, lastEventId),
    ))
    .orderBy(notifications.seq)
    .limit(100);

  for (const n of missed) {
    reply.raw.write(\`id: \${n.seq}\\nevent: notification\\ndata: \${JSON.stringify(n)}\\n\\n\`);
  }

  // ... then subscribe to live events, also writing id: ...
  return reply;
});
//
// The client writes zero lines of code for this. Set \`id:\` on
// every event and the browser handles the rest, so a laptop
// closing its lid for ten minutes reconnects and receives
// exactly what it missed.
//
// With a WebSocket you would design and implement this
// yourself, including the sequence numbers and the resume
// protocol.


// ── The client, which is why SSE is easy ────────────────────
// const es = new EventSource("/notifications/stream");
//
// es.addEventListener("notification", (e) => {
//   render(JSON.parse(e.data));
// });
//
// Reconnection, backoff and Last-Event-ID are all handled by
// the browser. Compare with the WebSocket client in two
// lessons, which needs all three written by hand.
//
// ⚠ And the auth-loop problem:
//
// es.addEventListener("error", () => {
//   if (es.readyState === EventSource.CLOSED) return;
//   // A 401 from an expired session makes the browser
//   // reconnect, get another 401, and loop. Nothing stops it
//   // but you.
//   if (sessionLooksExpired()) es.close();
// });
//
// Or send it a message and let the client obey:
//   send("fatal", { reason: "unauthorized" });
// then close(), and have the client call es.close() on that
// event rather than trying to infer it from the error.


// ── ⚠⚠ The six-connection limit ─────────────────────────────
// Over HTTP/1.1, a browser allows about six concurrent
// connections per origin. An SSE stream holds one for the
// lifetime of the tab.
//
//   1 tab   → 1 SSE + 5 available for everything else
//   6 tabs  → 6 SSE + 0 available
//             the seventh fetch, image or navigation HANGS
//
// The bug report is "the site randomly stops loading", and it
// depends on how many tabs the user has open, which is why it
// is never reproducible.
//
// Three responses:
//   serve over HTTP/2, where streams are multiplexed and the
//     limit does not apply
//   share one connection across tabs with a SharedWorker
//   put the stream on a different subdomain, so it consumes a
//     different origin's budget
//
// The first is the real answer, and it is worth confirming
// your production setup actually terminates HTTP/2 before you
// rely on many SSE connections.`,
      },
      keyTakeaways: [
        "Verified: SSE is an HTTP response that does not end, with `text/event-stream` and events terminated by a blank line.",
        "The wire format is the whole protocol: `id:`, `event:`, `data:` on separate lines, then `\\n\\n`.",
        "Because it is ordinary HTTP, your existing authentication, ownership checks, logging and error handling apply with no special cases.",
        "`id:` is the underused feature: the browser returns it as `Last-Event-ID` on reconnection, so you can resume and deliver what was missed.",
        "That gives gap-free delivery across a dropped connection for free, which with a WebSocket you would design yourself.",
        "`EventSource` reconnects automatically, which is the biggest practical advantage over WebSockets.",
        "It also cannot easily be stopped: a 401 from an expired session becomes a reconnection loop unless the client closes deliberately.",
        "Buffering defeats SSE. Set `X-Accel-Buffering: no` and disable compression on the route.",
        "Send a `: ping` comment every 20 to 30 seconds, or an idle stream is closed by a proxy and the automatic reconnect hides it.",
        "Clear the interval and unsubscribe on `close`, or every page load leaks a live timer writing to a dead socket.",
        "Over HTTP/1.1 a browser allows about six connections per origin, and an SSE stream holds one for the tab's lifetime.",
        "So six tabs make the seventh request of any kind hang, which presents as \"the site randomly stops loading\".",
        "HTTP/2 multiplexes and removes that limit, so confirm your production edge actually terminates HTTP/2 before relying on many streams.",
      ],
      commonMistakes: [
        "Forgetting the blank line, so the client buffers an event that never completes.",
        "Not clearing the interval on `close`, leaking a timer per connection that writes to a closed socket.",
        "Leaving compression or proxy buffering enabled, so events arrive in batches or not at all.",
        "No keepalive, so an idle stream is closed by a proxy every minute and reconnects endlessly.",
        "Never setting `id:`, giving up free resume across reconnections.",
        "Returning a 401 on an expired session with no client-side close, producing a reconnection loop.",
        "Not knowing about the six-connection limit, so heavy tab users see unreproducible hangs.",
        "Using a WebSocket for a one-way stream and then hand-writing reconnection, backoff and resume that SSE gives you.",
        "Listening only on `reply.raw` close and not the request, so one of the two paths leaks.",
      ],
      quiz: [
        {
          question: "What terminates an SSE event on the wire?",
          options: [
            "A semicolon",
            "A blank line, so an event ends with `\\n\\n`",
            "The `id:` field",
            "A null byte",
          ],
          correctIndex: 1,
          explanation:
            "Verified as `\"id: 1\\nevent: tick\\ndata: {...}\\n\\n\"`. Forgetting it means the client buffers an event that never completes.",
        },
        {
          question: "What does the `id:` field buy you?",
          options: [
            "Deduplication only",
            "The browser sends it back as `Last-Event-ID` on reconnection, so you can replay what the client missed",
            "Ordering",
            "Compression",
          ],
          correctIndex: 1,
          explanation:
            "Gap-free delivery across a dropped connection for free, and it is the feature almost nobody uses.",
        },
        {
          question: "What is the downside of automatic reconnection in `EventSource`?",
          options: [
            "It is slow",
            "You cannot easily stop it, so a 401 from an expired session becomes a reconnection loop unless the client closes deliberately",
            "It ignores `retry:`",
            "It loses events",
          ],
          correctIndex: 1,
          explanation:
            "Send a fatal event and have the client call `close()`, rather than trying to infer the situation from an error.",
        },
        {
          question: "Why send a `: ping` comment line every 25 seconds?",
          options: [
            "The spec requires it",
            "It stops proxies and load balancers closing an idle connection, and without it a quiet stream dies and reconnects endlessly",
            "To measure latency",
            "To flush compression",
          ],
          correctIndex: 1,
          explanation:
            "The automatic reconnection hides the problem while doubling your connection churn, so you would not notice from the client side.",
        },
        {
          question: "What is the six-connection limit and when does it apply?",
          options: [
            "A server-side limit on SSE clients",
            "A browser allows about six connections per origin over HTTP/1.1, and an SSE stream holds one, so six tabs make the seventh request hang",
            "A Node limit",
            "A proxy limit",
          ],
          correctIndex: 1,
          explanation:
            "It does not apply over HTTP/2, where streams are multiplexed. Presenting as \"the site randomly stops loading\" is what makes it hard to diagnose.",
        },
      ],
    },
    {
      id: "websockets",
      title: "WebSockets, and what Node ships",
      durationMinutes: 12,
      explanation:
        "## WebSocket\n\n<b>WebSocket</b> (a persistent two-way connection between client and server).\n\n```text\nClient ←────────→ Server\n```\n\nBoth sides send whenever they want, over one connection that starts as an HTTP request and is upgraded.\n\n---\n\n## What Node actually ships\n\nVerified on Node 24.14.1:\n\n```text\ntypeof WebSocket        \"function\"\nCloseEvent, MessageEvent  present\ntypeof WebSocketServer  \"undefined\"\n```\n\n> Node has a built-in WebSocket <b>client</b>, and no server. That distinction matters more than it sounds, because \"Node has WebSocket now\" is usually read as both.\n>\n> So a Node service can connect out to a WebSocket API with no dependency, which is genuinely useful for consuming a market data feed or a provider's event stream. To <b>accept</b> connections you still need `ws` or `@fastify/websocket`.\n>\n> It also emitted no experimental warning, unlike Day 17's `node:sqlite`, so it is a stable global now.\n\n---\n\n## The upgrade is where problems start\n\n> A WebSocket begins as an HTTP request with `Upgrade: websocket`, and anything in the path that does not understand that will refuse or mishandle it. Old load balancers, some corporate proxies and a few CDN configurations all do.\n>\n> This is the concrete reason SSE is easier to deploy: there is no upgrade, so there is nothing to be refused. If you are choosing between them and your users sit behind networks you do not control, that is a real input.\n\n---\n\n## The lifecycle\n\n```text\nCONNECTING → OPEN → messages → CLOSING → CLOSED\n```\n\nVerified as the numeric constants 0 through 3 on the global.\n\n> Two things to handle that are easy to skip. Sending while the state is `CONNECTING` throws rather than queueing, so a client that sends immediately after construction needs to wait for `open`. And a <b>close code</b> tells you why: 1000 is normal, 1006 is abnormal with no close frame, which is what you see when a network drops. Distinguishing them is what lets a client decide whether to reconnect.\n\n---\n\n## Messages are strings or bytes, and that is all\n\n> There is no built-in request and response, no acknowledgement, no routing and no types. `socket.send(\"hello\")` delivers three bytes and tells you nothing about whether anybody handled them.\n>\n> So every WebSocket application invents a message envelope: a `type` field, a payload, and usually an id for correlating a reply. That is not a flaw, it is the layer you are expected to build, and it is most of what Socket.IO sells.\n\n---\n\n## Validate every message\n\n> Day 16's boundary lesson applies here and gets forgotten constantly, because a WebSocket does not look like a request. Every inbound message is <b>untrusted input from the client</b>, arriving without any of your route schemas, and `JSON.parse` on it can throw on the first malformed frame.\n>\n> So: parse in a `try`, validate with a schema, cap the message size at the server, and rate limit per connection. A connection that has authenticated once can then send ten thousand messages a second, and nothing in the protocol stops it.",
      diagram: `WebSocket: both directions, one connection

    Client ←────────→ Server

    starts as an HTTP request and is UPGRADED.


⚠ What Node actually ships. Verified on 24.14.1.

    typeof WebSocket         "function"
    CloseEvent, MessageEvent  present
    typeof WebSocketServer   "undefined"

    A BUILT-IN CLIENT, AND NO SERVER.

    that distinction matters more than it sounds,
    because "Node has WebSocket now" is usually
    read as both.

      a Node service can CONNECT OUT with no
      dependency
        ↳ genuinely useful for a market feed or a
          provider's event stream

      to ACCEPT connections you still need ws or
      @fastify/websocket

    and it emitted NO experimental warning, unlike
    Day 17's node:sqlite. it is a stable global.


⚠ The upgrade is where problems start

    a WebSocket begins as an HTTP request with
    Upgrade: websocket.

    anything in the path that does not understand
    that will refuse or mishandle it:

      old load balancers
      some corporate proxies
      a few CDN configurations

    → the concrete reason SSE is EASIER TO DEPLOY:
      no upgrade, so nothing to refuse.

    if your users sit behind networks you do not
    control, that is a real input to the choice.


The lifecycle

    CONNECTING → OPEN → messages
               → CLOSING → CLOSED

    verified as constants 0, 1, 2, 3.

    two things easy to skip:

      SENDING WHILE CONNECTING THROWS.
      it does not queue. wait for open.

      A CLOSE CODE TELLS YOU WHY.
        1000  normal
        1006  abnormal, no close frame
              ↳ what a dropped network looks like

      distinguishing them is what lets a client
      decide whether to reconnect.


Messages are strings or bytes. That is all.

    no request/response
    no acknowledgement
    no routing
    no types

    socket.send("hello") delivers three bytes and
    tells you NOTHING about whether anybody
    handled them.

    → so every WebSocket application invents a
      MESSAGE ENVELOPE: a type, a payload, usually
      an id for correlating a reply.

      not a flaw. the layer you are expected to
      build, and most of what Socket.IO sells.


⚠⚠ Validate every message

    Day 16's boundary lesson applies here and gets
    FORGOTTEN CONSTANTLY, because a WebSocket does
    not look like a request.

    every inbound message is UNTRUSTED INPUT FROM
    THE CLIENT, arriving with none of your route
    schemas.

    and JSON.parse on it throws on the first
    malformed frame.

    so:
      parse in a try
      validate with a schema
      CAP THE MESSAGE SIZE at the server
      RATE LIMIT PER CONNECTION

    a connection that authenticated once can send
    ten thousand messages a second, and nothing in
    the protocol stops it.`,
      codeExample: {
        title: "A server, a Node client, and a validated envelope",
        code: `// ── Verified: what Node has ─────────────────────────────────
typeof WebSocket;          // "function"          ← built-in CLIENT
typeof CloseEvent;         // "function"
typeof MessageEvent;       // "function"
typeof WebSocketServer;    // "undefined"         ← no server
WebSocket.CONNECTING;      // 0
WebSocket.OPEN;            // 1
WebSocket.CLOSING;         // 2
WebSocket.CLOSED;          // 3
//
// No experimental warning was emitted, unlike Day 17's
// node:sqlite. So the client is stable and you still install
// something to accept connections.


// ── ✓ Node as a client, with no dependency ──────────────────
// Consuming somebody else's real-time feed.
function connectToFeed() {
  const ws = new WebSocket("wss://feed.example.com/v1/stream");

  ws.addEventListener("open", () => {
    log().info("feed connected");
    // ⚠ Only send here. Sending during CONNECTING throws
    // rather than queueing.
    ws.send(JSON.stringify({ type: "subscribe", symbols: ["AAPL"] }));
  });

  ws.addEventListener("message", (event) => {
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch {
      log().warn("feed sent unparseable data");
      return;
    }
    handleFeedMessage(msg);
  });

  ws.addEventListener("close", (event) => {
    // ⚠ The code is the useful part.
    log().warn({ code: event.code, reason: event.reason, clean: event.wasClean },
      "feed closed");

    // 1000 is a deliberate close. 1006 is abnormal with no
    // close frame, which is what a dropped network looks like,
    // and the only case where reconnecting is clearly right.
    if (event.code !== 1000) scheduleReconnect();
  });

  ws.addEventListener("error", (err) => {
    // Note: 'error' does not tell you why. The close event
    // that follows carries the code.
    log().error({ err }, "feed error");
  });

  return ws;
}


// ── ✓ Accepting connections needs a library ─────────────────
import websocket from "@fastify/websocket";
import { z } from "zod";

await app.register(websocket, {
  options: {
    maxPayload: 64 * 1024,
    //          ^^^^^^^^^^ ⚠ Day 19's body limit, for
    //          WebSockets. Without it a client can send a
    //          100MB frame and you will buffer all of it
    //          before your handler sees anything.
    clientTracking: true,
  },
});


// ── ⚠ The envelope you have to invent ───────────────────────
// The protocol gives you strings. Everything else is yours.
const InboundMessage = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("subscribe"),
    id: z.string().max(64),
    channel: z.enum(["orders", "notifications", "presence"]),
  }),
  z.object({
    type: z.literal("chat"),
    id: z.string().max(64),
    roomId: z.string().max(64),
    body: z.string().min(1).max(4000),
  }),
  z.object({ type: z.literal("pong"), id: z.string().max(64) }),
]);
//
// Day 16's discriminated union, doing the routing a WebSocket
// does not have. The \`id\` is what lets you send an
// acknowledgement the client can correlate, which is the
// other thing the protocol does not provide.

app.get("/ws", { websocket: true, preHandler: authenticate }, (socket, request) => {
  const userId = request.user.id;

  // ⚠ Per-connection rate limiting. A connection that
  // authenticated once can otherwise send ten thousand
  // messages a second, and Day 19's HTTP rate limiter never
  // sees any of them.
  let tokens = 20;
  const refill = setInterval(() => { tokens = Math.min(20, tokens + 10); }, 1000);
  refill.unref();

  socket.on("message", async (raw) => {
    if (tokens-- <= 0) {
      socket.close(1008, "rate limit exceeded");
      //           ^^^^ 1008 is "policy violation", and using a
      //           meaningful code lets the client tell this
      //           apart from a network drop
      return;
    }

    // ⚠ Day 16 at a boundary that does not look like one.
    let parsed;
    try {
      parsed = InboundMessage.safeParse(JSON.parse(raw.toString()));
    } catch {
      // A malformed frame. JSON.parse throws, and without this
      // try it throws inside an event handler, which Day 4
      // established is an uncaught exception that takes the
      // process down.
      socket.send(JSON.stringify({ type: "error", error: "invalid_json" }));
      return;
    }

    if (!parsed.success) {
      socket.send(JSON.stringify({
        type: "error",
        error: "invalid_message",
        issues: parsed.error.issues.map((i) => i.path.join(".")),
      }));
      return;
    }

    const msg = parsed.data;

    // Day 19: authorization per message, not per connection.
    // "This socket is authenticated" says nothing about
    // whether this user may post to this room.
    if (msg.type === "chat") {
      const allowed = await canPostToRoom(app.db, userId, msg.roomId);
      if (!allowed) {
        socket.send(JSON.stringify({ type: "error", id: msg.id, error: "forbidden" }));
        return;
      }
      await postMessage(app.db, { userId, roomId: msg.roomId, body: msg.body });
      socket.send(JSON.stringify({ type: "ack", id: msg.id }));
      //                                        ^^^^^^^^^ the
      //                          acknowledgement the protocol
      //                          does not give you
    }
  });

  socket.on("close", () => {
    clearInterval(refill);
    // ... leave rooms, drop presence: next lessons
  });
});
//
// Count what the protocol did not provide: routing, types,
// acknowledgements, size limits, rate limiting, and per-action
// authorization. All six are yours, and forgetting the last
// three is how a WebSocket endpoint becomes the least
// protected surface in an otherwise careful application.


// ── ⚠ The upgrade, and why SSE deploys more easily ──────────
// A WebSocket starts as:
//
//   GET /ws HTTP/1.1
//   Upgrade: websocket
//   Connection: Upgrade
//   Sec-WebSocket-Key: ...
//   Sec-WebSocket-Version: 13
//
// Anything in the path that does not understand that will
// refuse or strip it: older load balancers, some corporate
// proxies, a few CDN configurations, and any layer that
// terminates HTTP without proxying upgrades.
//
// The symptom is a handshake that returns 200 or 400 instead
// of 101, from a specific network only, which is the least
// debuggable class of problem there is.
//
// SSE has no upgrade. It is a 200 with a content type, so
// there is nothing for an intermediary to refuse. If your
// users are on networks you do not control and the feature is
// one-way, that difference is worth more than the protocol
// comparison suggests.`,
      },
      keyTakeaways: [
        "Verified on Node 24.14.1: `WebSocket` is a built-in client and `WebSocketServer` is undefined, so there is no built-in server.",
        "\"Node has WebSocket now\" is usually read as both. It means a Node service can connect out with no dependency.",
        "No experimental warning was emitted, unlike Day 17's `node:sqlite`, so the client global is stable.",
        "A WebSocket begins as an HTTP upgrade, and anything in the path that does not understand it will refuse or strip it.",
        "That is the concrete reason SSE deploys more easily: no upgrade means nothing for an intermediary to refuse.",
        "Sending while the state is `CONNECTING` throws rather than queueing, so wait for `open`.",
        "The close code is the useful signal: 1000 is deliberate, 1006 is abnormal with no close frame, which is a dropped network.",
        "The protocol gives you strings and bytes. Routing, types and acknowledgements are all yours to invent.",
        "So every WebSocket application builds a message envelope with a type, a payload and an id for correlating replies.",
        "Every inbound message is untrusted input arriving with none of your route schemas, and `JSON.parse` throws on the first malformed frame.",
        "An uncaught throw inside a message handler is Day 4's uncaught exception, so parse in a `try`.",
        "Set `maxPayload`, or a client can send a 100MB frame that you buffer entirely before your handler runs.",
        "Rate limit per connection. A socket that authenticated once can send ten thousand messages a second, and Day 19's HTTP limiter never sees them.",
        "Authorize per message, not per connection. \"This socket is authenticated\" says nothing about whether this user may post to this room.",
      ],
      commonMistakes: [
        "Assuming Node's built-in `WebSocket` includes a server. It is a client only.",
        "Sending immediately after constructing a client, which throws because the state is `CONNECTING`.",
        "Reconnecting on every close, including deliberate ones, instead of checking the close code.",
        "No `maxPayload`, so a single frame can be arbitrarily large.",
        "`JSON.parse` on an inbound message without a `try`, so one malformed frame is an uncaught exception.",
        "No schema validation on messages, leaving the WebSocket the least validated surface in the application.",
        "No per-connection rate limit, so an authenticated socket can flood you past every HTTP-level protection.",
        "Authorizing at connection time only, so any message the socket sends is treated as permitted.",
        "Choosing WebSockets for a one-way feature and inheriting the upgrade's deployment problems for no benefit.",
      ],
      quiz: [
        {
          question: "What did Node 24 actually provide, verified?",
          options: [
            "A WebSocket client and server",
            "A built-in client, with `WebSocketServer` undefined, so accepting connections still needs a library",
            "Neither",
            "A server only",
          ],
          correctIndex: 1,
          explanation:
            "It is genuinely useful for consuming somebody else's feed with no dependency, and it emitted no experimental warning.",
        },
        {
          question: "Why does SSE deploy more easily than WebSockets?",
          options: [
            "Smaller payloads",
            "There is no protocol upgrade, so no load balancer, proxy or CDN in the path can refuse or strip it",
            "It uses less memory",
            "Browsers prefer it",
          ],
          correctIndex: 1,
          explanation:
            "A failed upgrade shows as a 200 or 400 instead of a 101, from one network only, which is the least debuggable class of problem.",
        },
        {
          question: "What happens if you call `send()` while the socket is `CONNECTING`?",
          options: [
            "It queues the message",
            "It throws. Wait for the `open` event.",
            "It silently drops it",
            "It upgrades first",
          ],
          correctIndex: 1,
          explanation:
            "Verified state constants 0 through 3 on the global. Only `OPEN` accepts a send.",
        },
        {
          question: "Why is a WebSocket message handler a boundary that needs Day 16's treatment?",
          options: [
            "It is not, the connection is authenticated",
            "Every message is untrusted client input arriving with none of your route schemas, and `JSON.parse` throws on the first malformed frame",
            "Because of the upgrade",
            "Only for binary frames",
          ],
          correctIndex: 1,
          explanation:
            "An uncaught throw inside the handler is Day 4's uncaught exception. Parse in a `try`, validate with a schema, and cap the size.",
        },
        {
          question: "Why rate limit per connection when the socket is already authenticated?",
          options: [
            "For fairness",
            "An authenticated socket can send ten thousand messages a second, and Day 19's HTTP rate limiter never sees any of them",
            "To reduce memory",
            "The protocol requires it",
          ],
          correctIndex: 1,
          explanation:
            "Authorization is also per message: \"this socket is authenticated\" says nothing about whether this user may post to this room.",
        },
      ],
    },
    {
      id: "lifecycle-heartbeats-reconnection",
      title: "Heartbeats and reconnection",
      durationMinutes: 11,
      explanation:
        "## The problem heartbeats solve\n\n> A TCP connection can be <b>dead without either side knowing</b>. A laptop lid closes, a phone changes network, a NAT table entry expires: no close frame is sent, and both ends still believe they are connected. The server holds a socket, a room membership and memory for a client that will never speak again.\n>\n> Nothing in TCP tells you promptly. A write eventually fails, but if you are only ever <b>reading</b> from that socket you may wait a very long time.\n\n---\n\n## Heartbeat\n\n<b>Heartbeat</b> (a periodic message used to confirm a connection is still alive).\n\nWebSocket has ping and pong frames built in for exactly this.\n\nVerified with `ws` and Node's built-in client:\n\n```text\nserver → ping\nclient → pong        automatically, with no client code\n```\n\n> That is worth knowing: the built-in `WebSocket` answers a ping without you writing a handler, because pong is handled at the protocol level. So a server-driven heartbeat needs code on the server only.\n\n---\n\n## The sweep\n\n> The pattern is a flag per socket, cleared when you ping and set when a pong arrives:\n>\n> ```text\n> every 30s:  for each socket\n>               if not alive  → terminate it\n>               else          → mark not alive, send ping\n> ```\n>\n> Verified: a client that handshook and then went silent received pings, sent no pong, and was terminated on the next sweep, while a live client stayed connected.\n\n---\n\n## `terminate`, not `close`\n\n> This is the detail that makes or breaks it. `close()` starts a <b>close handshake</b> and waits for the peer to respond, and a dead peer never will, so the socket lingers until a TCP timeout that may be minutes away.\n>\n> `terminate()` destroys the socket immediately. For a connection you have just decided is dead, that is the only correct call, and using `close()` there means your cleanup does not actually clean up.\n\n---\n\n## Reconnection is the client's job\n\n> With SSE the browser does this. With a WebSocket you write it, and there are four parts people miss.\n>\n> <b>Backoff with jitter.</b> Day 22 measured it: 1000 clients without jitter produced one distinct retry time. When your server restarts, every connected client reconnects at once, so this is the same thundering herd aimed at a process that has just started.\n>\n> <b>Do not reconnect on a deliberate close.</b> Code 1000 means somebody meant it. Reconnecting after a 1008 policy violation or an auth failure is a loop.\n>\n> <b>Resume, not restart.</b> A reconnected client has a gap. SSE's `Last-Event-ID` handles this for free; here you send your last sequence number on reconnect and the server replays.\n>\n> <b>Reset the backoff on a successful connection</b>, not on a successful <b>send</b>. A connection that opens and immediately fails should back off further, and resetting too eagerly turns backoff into a fast loop.",
      diagram: `⚠⚠ The problem: a connection can be DEAD WITHOUT
   EITHER SIDE KNOWING

    a laptop lid closes
    a phone changes network
    a NAT entry expires

    NO CLOSE FRAME IS SENT.

    both ends still believe they are connected.

    the server holds a socket, a room membership
    and memory for a client that will never speak
    again.

    and nothing in TCP tells you promptly: a WRITE
    eventually fails, but if you are only READING
    you may wait a very long time.


Heartbeat: ping and pong are built into the
           protocol

    verified with ws and Node's built-in client:

      server → ping
      client → pong    AUTOMATICALLY, with no
                       client code

    pong is handled at the PROTOCOL level, so a
    server-driven heartbeat needs code on the
    SERVER ONLY.


The sweep

    every 30s, for each socket:

      if not alive  → TERMINATE
      else          → mark not alive, send ping

    verified:

      a client that handshook and went silent
        received pings
        sent no pong
        was TERMINATED on the next sweep

      a live client stayed connected


⚠⚠ terminate(), NOT close()

    the detail that makes or breaks it.

    close() starts a CLOSE HANDSHAKE and waits for
    the peer to respond.

    A DEAD PEER NEVER WILL.

    → the socket lingers until a TCP timeout that
      may be MINUTES away

    terminate() destroys it immediately.

    for a connection you have just decided is
    dead, that is the only correct call, and
    close() means YOUR CLEANUP DOES NOT ACTUALLY
    CLEAN UP.


Reconnection is the CLIENT'S job

    with SSE the browser does it.
    with a WebSocket you write it, and four parts
    get missed:

    1. BACKOFF WITH JITTER

       Day 22 measured it: 1000 clients without
       jitter = ONE distinct retry time.

       when your server restarts, EVERY connected
       client reconnects at once.

       same thundering herd, aimed at a process
       that has just started.

    2. DO NOT RECONNECT ON A DELIBERATE CLOSE

       1000 means somebody meant it.

       reconnecting after a 1008 policy violation
       or an auth failure is a LOOP.

    3. RESUME, NOT RESTART

       a reconnected client has a GAP.

       SSE's Last-Event-ID handles this for free.
       here you send your last sequence number and
       the server replays.

    4. RESET THE BACKOFF ON A SUCCESSFUL
       CONNECTION, NOT A SUCCESSFUL SEND

       a connection that opens and immediately
       fails should back off FURTHER.

       resetting too eagerly turns backoff into a
       fast loop.`,
      codeExample: {
        title: "A sweep that actually removes dead sockets",
        code: `import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ server: httpServer, maxPayload: 64 * 1024 });

// ── The heartbeat, verified ─────────────────────────────────
wss.on("connection", (socket, request) => {
  socket.isAlive = true;
  socket.userId = request.user.id;

  // A pong arriving means the peer is there. Node's built-in
  // WebSocket client and every browser answer a ping
  // automatically, with no client code, because pong is a
  // protocol-level frame.
  socket.on("pong", () => { socket.isAlive = true; });
});

const sweep = setInterval(() => {
  for (const socket of wss.clients) {
    if (!socket.isAlive) {
      log().info({ userId: socket.userId }, "no pong, terminating dead socket");

      socket.terminate();
      //     ^^^^^^^^^^^ ⚠ NOT close().
      //
      // close() sends a close frame and waits for the peer to
      // send one back. A peer whose laptop lid is shut never
      // will, so the socket stays in wss.clients until a TCP
      // timeout minutes later, still holding its room
      // membership and its memory.
      //
      // terminate() destroys the socket now, which is the
      // whole point of having decided it is dead.
      continue;
    }

    socket.isAlive = false;
    socket.ping();
  }
}, 30_000);

sweep.unref();      // Day 11
wss.on("close", () => clearInterval(sweep));
//
// VERIFIED behaviour:
//
//   a live client        ping sent, pong received, stays
//   a silent client      ping sent, no pong, terminated on the
//                        next sweep
//
// The window is up to two sweeps, so 30 seconds gives you a
// worst case of about a minute. Shorten it for presence
// features where a stale "online" badge is visible, lengthen
// it if you have very many connections and the ping traffic
// matters.


// ── ⚠ Why not rely on TCP keepalive ─────────────────────────
// The OS has its own keepalive, and on Linux the default is
// commonly two hours before the first probe. So a dead socket
// occupies a file descriptor, a room entry and memory for
// two hours unless you do something.
//
// You can shorten it per socket:
//   socket._socket.setKeepAlive(true, 30_000);
//
// and it is still worth having the application-level
// heartbeat, because it tells you the WEBSOCKET is alive
// rather than just the TCP connection. A peer whose event
// loop is blocked has a healthy TCP connection and is not
// processing anything.


// ── ✓ The client, with all four parts ───────────────────────
class ReconnectingSocket {
  constructor(url, { onMessage }) {
    this.url = url;
    this.onMessage = onMessage;
    this.attempt = 0;
    this.lastSeq = 0;
    this.closedDeliberately = false;
    this.connect();
  }

  connect() {
    // 3. RESUME: tell the server where we got to, so it can
    //    replay the gap. This is what SSE gives you free via
    //    Last-Event-ID.
    const url = new URL(this.url);
    if (this.lastSeq) url.searchParams.set("since", String(this.lastSeq));

    this.ws = new WebSocket(url);

    this.ws.addEventListener("open", () => {
      // 4. Reset here, on a successful CONNECTION.
      //
      // ✗ Resetting after the first successful send instead
      //   means a server that accepts a connection and then
      //   immediately fails gets hammered, because the client
      //   thinks each attempt succeeded.
      this.attempt = 0;
      log().info("connected");
    });

    this.ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.seq) this.lastSeq = msg.seq;    // track for resume
      this.onMessage(msg);
    });

    this.ws.addEventListener("close", (event) => {
      // 2. Do not reconnect when somebody meant it.
      if (this.closedDeliberately) return;

      if (event.code === 1000) {
        log().info("closed normally, not reconnecting");
        return;
      }
      if (event.code === 1008 || event.code === 4401) {
        // Policy violation or our own auth-failure code.
        // Reconnecting is a loop that will get the same answer.
        log().error({ code: event.code }, "not reconnecting");
        this.onFatal?.(event);
        return;
      }

      // 1006 and friends: abnormal, so try again.
      this.scheduleReconnect();
    });
  }

  scheduleReconnect() {
    // 1. Backoff WITH JITTER.
    //
    // Day 22 measured 1000 clients without jitter producing
    // ONE distinct retry time. Restart your server and every
    // connected client reconnects in the same millisecond,
    // against a process that has just started and has cold
    // caches and an empty connection pool.
    const exponential = Math.min(30_000, 500 * 2 ** this.attempt);
    const delay = Math.random() * exponential;
    this.attempt++;

    log().info({ attempt: this.attempt, delay: Math.round(delay) }, "reconnecting");
    setTimeout(() => this.connect(), delay);
  }

  close() {
    this.closedDeliberately = true;
    this.ws.close(1000, "client closing");
  }
}


// ── ✓ The server side of resume ─────────────────────────────
app.get("/ws", { websocket: true, preHandler: authenticate }, async (socket, request) => {
  const since = Number(request.query.since ?? 0);

  if (since) {
    // Replay the gap before subscribing to live events, so
    // the client sees a continuous sequence.
    const missed = await app.db
      .select()
      .from(events)
      .where(and(eq(events.userId, request.user.id), gt(events.seq, since)))
      .orderBy(events.seq)
      .limit(500);

    for (const e of missed) socket.send(JSON.stringify(e));

    if (missed.length === 500) {
      // Too far behind to replay. Tell the client to reload
      // rather than silently giving it a partial history.
      socket.send(JSON.stringify({ type: "resync_required" }));
    }
  }

  subscribe(request.user.id, socket);
});
//
// That \`resync_required\` branch is the one people leave out.
// A client offline for an hour cannot be caught up from a
// bounded replay, and pretending otherwise gives it a
// history with a hole in it that nothing will ever correct.


// ── ⚠ And clean up everything on close ──────────────────────
socket.on("close", () => {
  clearInterval(socket.refillTimer);
  rooms.leaveAll(socket);
  presence.delete(socket.userId);
  // Anything you attached at connection time, removed here.
  // Day 14's memory lesson: a Map keyed by socket that is
  // never deleted from is a leak that grows with your traffic
  // and looks exactly like normal memory use.
});`,
      },
      keyTakeaways: [
        "A connection can be dead with both sides believing it is alive, because a closed lid or an expired NAT entry sends no close frame.",
        "TCP will not tell you promptly, especially if you are only reading, and OS keepalive commonly waits two hours.",
        "Ping and pong are protocol-level frames, so a server-driven heartbeat needs code on the server only.",
        "Verified: Node's built-in `WebSocket` client answers a ping with a pong automatically, with no client code.",
        "The sweep pattern is a flag per socket: terminate if no pong arrived, otherwise clear the flag and ping.",
        "Verified: a silent client was terminated on the next sweep while a live client stayed connected.",
        "Use `terminate()`, not `close()`. A close handshake waits for a peer that will never answer, so the socket lingers for minutes.",
        "Using `close()` there means your cleanup does not clean up, and the room membership and memory stay.",
        "An application heartbeat tells you the WebSocket is alive, not just the TCP connection. A blocked event loop has a healthy socket.",
        "Reconnection is the client's job with WebSockets, which is code SSE gets from the browser.",
        "Backoff needs jitter, because a server restart makes every connected client reconnect at the same instant.",
        "Do not reconnect on code 1000 or a policy violation, or you build a loop that gets the same answer.",
        "Send your last sequence number on reconnect so the server can replay the gap, and handle the case where the client is too far behind.",
        "Reset the backoff on a successful connection, not a successful send, or a server that accepts and immediately fails gets hammered.",
      ],
      commonMistakes: [
        "No heartbeat, so dead sockets accumulate for hours holding file descriptors, room entries and memory.",
        "Relying on TCP keepalive, whose default first probe is commonly two hours away.",
        "Calling `close()` on a socket you have decided is dead, which waits for a handshake the peer will never complete.",
        "Reconnecting on every close, including deliberate ones and policy violations, producing a loop.",
        "Reconnection with no jitter, so a server restart brings every client back in the same millisecond.",
        "Resetting the backoff counter after a successful send rather than a successful connection.",
        "Reconnecting without a resume marker, so the client silently misses everything sent while it was away.",
        "Replaying a bounded history without telling a far-behind client to resync, leaving a permanent gap.",
        "Not removing the socket from every index and timer on close, which leaks memory proportional to traffic.",
      ],
      quiz: [
        {
          question: "Why can a WebSocket be dead with both sides believing it is alive?",
          options: [
            "A protocol bug",
            "A closed lid, a network change or an expired NAT entry sends no close frame, and TCP will not tell you promptly if you are only reading",
            "Because of proxies",
            "Only with HTTP/1.1",
          ],
          correctIndex: 1,
          explanation:
            "OS keepalive commonly waits two hours for its first probe, so the socket holds resources until then unless you act.",
        },
        {
          question: "What was verified about Node's built-in WebSocket client and pings?",
          options: [
            "It ignores them",
            "It answers with a pong automatically, with no client code, because pong is handled at the protocol level",
            "It needs a handler",
            "It closes the connection",
          ],
          correctIndex: 1,
          explanation:
            "Which means a server-driven heartbeat is server-side code only.",
        },
        {
          question: "Why `terminate()` rather than `close()` for a socket you believe is dead?",
          options: [
            "It is faster to write",
            "`close()` waits for a close handshake the dead peer will never complete, so the socket lingers for minutes still holding its resources",
            "`close()` throws",
            "They are equivalent",
          ],
          correctIndex: 1,
          explanation:
            "Verified that a silent client was removed by `terminate()` on the next sweep. With `close()` your cleanup does not clean up.",
        },
        {
          question: "Why does reconnection backoff need jitter specifically here?",
          options: [
            "To reduce latency",
            "A server restart makes every connected client reconnect at the same instant, against a process that has just started with cold caches",
            "Browsers require it",
            "To avoid duplicate sessions",
          ],
          correctIndex: 1,
          explanation:
            "Day 22 measured 1000 clients without jitter producing one distinct retry time. This is the same herd, aimed at a fresh process.",
        },
        {
          question: "When should you reset the reconnection backoff counter?",
          options: [
            "After a successful send",
            "On a successful connection, or a server that accepts a connection and immediately fails gets hammered because each attempt looks successful",
            "Every minute",
            "Never",
          ],
          correctIndex: 1,
          explanation:
            "Also do not reconnect at all on code 1000 or a policy violation, since the answer will be the same.",
        },
      ],
    },
    {
      id: "backpressure",
      title: "Backpressure on socket writes",
      durationMinutes: 11,
      explanation:
        "## Backpressure\n\n<b>Backpressure</b> (the producer generating data faster than the receiver or the network can accept it).\n\nDay 8 taught this for streams. A WebSocket is a stream, and the failure is worse because it is invisible.\n\n---\n\n## `send()` tells you nothing\n\n> `socket.send(data)` does not block, does not return a signal, and does not fail when the peer is slow. It <b>queues</b>. If the socket cannot write, the data sits in a buffer and `send()` returns as if everything is fine.\n>\n> So a slow client is not an error you handle, it is memory you accumulate without being told.\n\n---\n\n## The number to watch\n\n<b>`bufferedAmount`</b> (bytes queued for sending but not yet written to the network).\n\nVerified against a client that completed the handshake and then stopped reading:\n\n```text\nsent  20 × 256KB   bufferedAmount   4.8 MB\nsent  60 × 256KB   bufferedAmount  14.5 MB\nsent 100 × 256KB   bufferedAmount  24.5 MB\nsent 200 × 256KB   bufferedAmount  49.5 MB\n\npeak: 49.5 MB for 50 MB sent\n```\n\n> Linear and unbounded. Every `send()` returned normally, nothing errored, and one stalled client held 49.5 MB.\n>\n> A thousand such clients is 49 GB, which your process does not have. And the thing that makes this hard to catch: <b>`heapUsed` stayed at 8 MB the entire time</b>. The buffered data lives outside the JS heap, so Day 14's heap snapshots and any heap-based memory alarm see nothing while the process grows toward an out-of-memory kill.\n\n---\n\n## What causes it\n\n> Not usually an attacker. A phone on a train, a laptop on hotel wifi, a browser tab that has been backgrounded and throttled. Any client whose network is slower than your event rate.\n>\n> And it is worse in exactly the situation you built real time for: a burst of activity means a burst of messages, and the slowest clients fall behind precisely when there is most to send.\n\n---\n\n## What to do\n\n> Check `bufferedAmount` <b>before every send</b> to a slow-capable client, and decide what happens when it is too high. There are only three honest options, and which one is right depends on the data.\n>\n> <b>Drop</b> for a live feed where only the latest value matters, such as a price or a cursor position. <b>Close the connection</b> for a client that cannot keep up with something it must receive in full, and let it reconnect and resync. <b>Never buffer indefinitely</b>, which is what doing nothing means.\n>\n> Set a threshold you can defend: a few hundred kilobytes is generous for text messages and far too small for a binary feed. And log when you drop or close, or a slow-client problem is invisible until it becomes an out-of-memory kill.\n\n---\n\n## Broadcasting makes it multiply\n\n> One slow client in a room of a thousand is a nuisance. A broadcast that ignores `bufferedAmount` sends every message to every socket regardless, so <b>one slow client accumulates the entire room's traffic</b>. Check per socket inside the loop, not once before it.",
      diagram: `Backpressure: Day 8, and worse because it is
INVISIBLE

    a WebSocket is a stream.


⚠⚠ send() TELLS YOU NOTHING

    socket.send(data)

      does not block
      does not return a signal
      does not fail when the peer is slow

    IT QUEUES.

    if the socket cannot write, the data sits in a
    buffer and send() returns as if everything is
    fine.

    → a slow client is not an ERROR YOU HANDLE.
      it is MEMORY YOU ACCUMULATE WITHOUT BEING
      TOLD.


The number to watch: bufferedAmount

    verified, against a client that handshook and
    then stopped reading:

      sent  20 × 256KB    4.8 MB buffered
      sent  60 × 256KB   14.5 MB
      sent 100 × 256KB   24.5 MB
      sent 200 × 256KB   49.5 MB

      peak: 49.5 MB for 50 MB sent

    LINEAR AND UNBOUNDED.

    every send() returned normally.
    nothing errored.
    ONE stalled client held 49.5 MB.

    a thousand of them is 49 GB.


⚠⚠ And the part that makes it hard to catch

    heapUsed STAYED AT 8 MB THE ENTIRE TIME.

    the buffered data lives OUTSIDE THE JS HEAP.

    → Day 14's heap snapshots see nothing
    → any heap-based memory alarm sees nothing

    while the process grows toward an OOM kill.


What causes it: not usually an attacker

    a phone on a train
    a laptop on hotel wifi
    a backgrounded, throttled tab

    any client whose network is slower than your
    event rate.

    ⚠ and it is worst in exactly the situation you
      built real time FOR:

        a burst of activity is a burst of
        messages, and the slowest clients fall
        behind precisely when there is most to
        send.


What to do: three honest options

    check bufferedAmount BEFORE EVERY SEND, then:

    DROP        for a live feed where only the
                latest value matters
                  ↳ a price, a cursor position

    CLOSE       for a client that cannot keep up
                with something it must receive in
                full
                  ↳ let it reconnect and resync

    BUFFER      forever. which is what DOING
                NOTHING means.

    set a threshold you can defend:
      a few hundred KB is generous for text
      and far too small for a binary feed

    and LOG when you drop or close, or the problem
    is invisible until it is an OOM kill.


⚠ Broadcasting MULTIPLIES it

    one slow client in a room of a thousand is a
    nuisance.

    a broadcast that ignores bufferedAmount sends
    every message to every socket regardless

    → ONE SLOW CLIENT ACCUMULATES THE ENTIRE
      ROOM'S TRAFFIC

    check PER SOCKET INSIDE the loop, not once
    before it.`,
      codeExample: {
        title: "The measurement, and the three responses",
        code: `// ── ⚠⚠ The measurement. Verified. ───────────────────────────
// A raw TCP client completes the WebSocket handshake and then
// calls socket.pause(), so it never reads.
//
// The server sends 256KB frames as fast as it can:
//
//   sent  20 × 256KB | bufferedAmount  4.8 MB | heapUsed 8 MB
//   sent  40 × 256KB | bufferedAmount  9.5 MB | heapUsed 8 MB
//   sent  60 × 256KB | bufferedAmount 14.5 MB | heapUsed 8 MB
//   sent  80 × 256KB | bufferedAmount 19.5 MB | heapUsed 8 MB
//   sent 100 × 256KB | bufferedAmount 24.5 MB | heapUsed 8 MB
//   sent 140 × 256KB | bufferedAmount 34.5 MB | heapUsed 8 MB
//   sent 200 × 256KB | bufferedAmount 49.5 MB | heapUsed 8 MB
//
//   peak bufferedAmount: 49.5 MB for 50 MB sent
//
// Three things to take from that table.
//
// 1. It is LINEAR AND UNBOUNDED. Nothing pushes back.
//
// 2. Every socket.send() returned normally. There was no
//    error, no exception and no false return value. The API
//    gave you no signal at all.
//
// 3. heapUsed NEVER MOVED. The buffer is outside the V8 heap,
//    so a heap snapshot from Day 14 shows a healthy process
//    and a heap-based alarm never fires, right up to the OOM
//    kill.
//
// That third point is why this is worth its own lesson:
// the standard tools for finding a memory problem cannot see
// this one.


// ── ✓ Check before every send ───────────────────────────────
const MAX_BUFFERED = 512 * 1024;        // 512KB of text is a lot

function safeSend(socket, payload, { kind }) {
  if (socket.readyState !== socket.OPEN) return false;

  if (socket.bufferedAmount > MAX_BUFFERED) {
    slowClientEvents.add(1, { kind });
    //                       ^^^^ Day 21: a bounded label, so
    //                       you can see this happening at all
    return false;
  }

  socket.send(payload);
  return true;
}


// ── The three responses, per data type ──────────────────────

// 1. ✓ DROP: a live feed where only the latest matters.
function sendPriceUpdate(socket, price) {
  if (socket.bufferedAmount > MAX_BUFFERED) {
    // Dropping is CORRECT here. A price from four seconds ago
    // is worse than no price, and the next tick supersedes it
    // anyway. Delivering a backlog of stale prices in order is
    // the wrong behaviour, not a feature.
    droppedMessages.add(1, { kind: "price" });
    return;
  }
  socket.send(JSON.stringify(price));
}
// Same for cursor positions, presence updates and anything
// where state replaces rather than accumulates.

// 2. ✓ CLOSE: a client that must receive everything.
function sendChatMessage(socket, message) {
  if (socket.bufferedAmount > MAX_BUFFERED) {
    // Dropping a chat message is not an option: the user would
    // have a conversation with a hole in it and no way to know.
    //
    // So close, and let the reconnection logic from the last
    // lesson resume from its last sequence number. A brief
    // reconnect is far better than silent data loss.
    log().warn({
      userId: socket.userId,
      buffered: socket.bufferedAmount,
    }, "client too slow for chat, closing to force resync");

    socket.close(1013, "too slow, please reconnect");
    //           ^^^^ 1013 is "try again later", which the
    //           client's close handler can treat as
    //           reconnectable, unlike a 1008
    return;
  }
  socket.send(JSON.stringify(message));
}

// 3. ✗ BUFFER FOREVER, which is what no check means.
socket.send(JSON.stringify(message));
// 49.5 MB per stalled client, invisible in the heap.


// ── ⚠⚠ Broadcasting: check INSIDE the loop ──────────────────
// ✗ One slow client absorbs the whole room's traffic.
function broadcastBad(room, payload) {
  const data = JSON.stringify(payload);
  for (const socket of room.sockets) {
    socket.send(data);
  }
}
//
// A room of 1,000 with one client on a train. Every message
// goes to that socket regardless, so its buffer grows at the
// room's full message rate, not its own. A busy room at 50
// messages a second is 50 messages a second accumulating in
// one buffer.

// ✓ Per socket, inside the loop.
function broadcast(room, payload, { kind = "event" } = {}) {
  const data = JSON.stringify(payload);
  let sent = 0, skipped = 0;

  for (const socket of room.sockets) {
    if (socket.readyState !== socket.OPEN) continue;

    if (socket.bufferedAmount > MAX_BUFFERED) {
      skipped++;
      // Escalate: a client that is repeatedly too slow is not
      // having a bad second, it cannot keep up. Close it.
      socket.slowStrikes = (socket.slowStrikes ?? 0) + 1;
      if (socket.slowStrikes > 10) {
        socket.close(1013, "too slow");
      }
      continue;
    }

    socket.slowStrikes = 0;
    socket.send(data);
    sent++;
  }

  if (skipped) {
    log().warn({ room: room.id, sent, skipped, kind }, "broadcast skipped slow clients");
  }
}
// The strike counter matters. A single check drops one message
// from a client that hiccupped, which is fine, and a client
// that is genuinely on a bad connection would otherwise be
// silently degraded forever while still holding a buffer.


// ── The metric and alert that make this visible ─────────────
const bufferedGauge = meter.createObservableGauge("ws_max_buffered_bytes");
const slowClients = meter.createObservableGauge("ws_slow_clients");

bufferedGauge.addCallback((result) => {
  let max = 0, slow = 0;
  for (const socket of wss.clients) {
    max = Math.max(max, socket.bufferedAmount);
    if (socket.bufferedAmount > MAX_BUFFERED) slow++;
  }
  result.observe(max);
});
//
// alert: ws_max_buffered_bytes > 5000000 for 2m
//
// Because Day 21's heap metrics will not fire for this. If you
// take one operational thing from this lesson, it is that
// process memory and heap memory diverge here, and only a
// socket-level metric sees it.


// ── ⚠ And the same problem on the read side ─────────────────
// A client can also send faster than you process.
const wss = new WebSocketServer({
  server: httpServer,
  maxPayload: 64 * 1024,
  //          ^^^^^^^^^^ Day 19's body limit. Without it one
  //          frame can be arbitrarily large and you buffer all
  //          of it before your handler runs.
});
//
// Plus the per-connection rate limit from the WebSockets
// lesson, which is the inbound half of the same idea: a
// connection that authenticated once can otherwise send as
// fast as its network allows, and your handler queues the
// work.`,
      },
      keyTakeaways: [
        "`socket.send()` does not block, signal or fail when the peer is slow. It queues, and returns as if everything is fine.",
        "So a slow client is not an error you handle, it is memory you accumulate without being told.",
        "Verified: one client that stopped reading accumulated 49.5 MB of `bufferedAmount` for 50 MB sent, linearly and unbounded.",
        "Verified and important: `heapUsed` stayed at 8 MB throughout, because the buffer is outside the V8 heap.",
        "So Day 14's heap snapshots and any heap-based memory alarm see a healthy process right up to the out-of-memory kill.",
        "The cause is usually not an attacker: a phone on a train, hotel wifi, or a throttled background tab.",
        "It is worst during exactly the bursts you built real time for, because the slowest clients fall behind when there is most to send.",
        "Check `bufferedAmount` before every send, and choose deliberately between dropping, closing, and buffering forever.",
        "Drop for data where the latest value supersedes the last, such as prices and cursor positions.",
        "Close with code 1013 for data the client must receive in full, and let the reconnection resume from its last sequence.",
        "Doing nothing is choosing to buffer forever, which is the 49.5 MB case.",
        "In a broadcast, check per socket inside the loop, or one slow client accumulates the entire room's message rate.",
        "Use a strike counter, so a single hiccup drops one message and a persistently slow client is closed rather than silently degraded.",
        "Expose a max-`bufferedAmount` metric and alert on it, because your heap metrics will not fire for this.",
        "The inbound half is the same idea: set `maxPayload` and rate limit per connection.",
      ],
      commonMistakes: [
        "Calling `send()` with no check on `bufferedAmount`, which is choosing to buffer indefinitely.",
        "Relying on heap metrics or heap snapshots to catch this, when the buffer is outside the heap and they show nothing.",
        "Assuming a slow client is an attack rather than the normal condition of mobile networks.",
        "Checking `bufferedAmount` once before a broadcast loop instead of per socket inside it.",
        "Dropping chat messages, so a user has a conversation with a hole they cannot detect.",
        "Closing on a single threshold breach, so a one-second hiccup disconnects a healthy client.",
        "Closing with 1008 rather than 1013, so a client that distinguishes fatal from retryable will not reconnect.",
        "No logging or metric when messages are dropped or clients closed, so the problem is invisible until an OOM kill.",
        "No `maxPayload`, leaving the inbound direction unbounded as well.",
      ],
      quiz: [
        {
          question: "What does `socket.send()` do when the peer is too slow to read?",
          options: [
            "Returns false",
            "Queues the data and returns as if everything is fine, with no error and no signal",
            "Throws",
            "Blocks",
          ],
          correctIndex: 1,
          explanation:
            "Verified: 200 sends of 256KB each returned normally while `bufferedAmount` grew linearly to 49.5 MB.",
        },
        {
          question: "What was verified about `heapUsed` during that 49.5 MB of buffering?",
          options: [
            "It grew with the buffer",
            "It stayed at 8 MB, because the buffer lives outside the V8 heap",
            "It spiked and recovered",
            "It was not measured",
          ],
          correctIndex: 1,
          explanation:
            "So Day 14's heap snapshots and heap-based alarms see a healthy process right up to the out-of-memory kill.",
        },
        {
          question: "When is dropping messages the correct response?",
          options: [
            "Never",
            "When the latest value supersedes the previous one, such as a price or a cursor position",
            "Always, for simplicity",
            "Only for binary data",
          ],
          correctIndex: 1,
          explanation:
            "Delivering a backlog of four-second-old prices in order is the wrong behaviour, not a feature. Chat messages need closing and resync instead.",
        },
        {
          question: "Why check `bufferedAmount` inside a broadcast loop rather than before it?",
          options: [
            "It is faster",
            "One slow client otherwise accumulates the entire room's message rate rather than just its own",
            "The value changes per message",
            "It avoids a JSON re-encode",
          ],
          correctIndex: 1,
          explanation:
            "A room of 1,000 at 50 messages a second means 50 messages a second piling into that one buffer.",
        },
        {
          question: "Why use close code 1013 for a too-slow client?",
          options: [
            "It is the only valid code",
            "It means \"try again later\", so a client that distinguishes fatal from retryable closes will reconnect and resync",
            "It skips the handshake",
            "It logs differently",
          ],
          correctIndex: 1,
          explanation:
            "A 1008 policy violation should not be reconnected. Getting the code right is what makes the previous lesson's client logic work.",
        },
      ],
    },
    {
      id: "rooms-auth-and-scaling",
      title: "Rooms, authentication and scaling",
      durationMinutes: 12,
      explanation:
        "## Rooms and broadcasting\n\n<b>Room</b> (a named group of connections).\n\n<b>Broadcasting</b> (sending one event to every connection in a group).\n\n> A room is just an index: a `Map` from a room name to a set of sockets, so a message goes to the right subset instead of everybody. Two things about that index cause real problems.\n>\n> It is <b>per instance</b>, which is the last part of this lesson. And it must be cleaned up on close, because a `Map` holding sockets that have gone is Day 14's leak growing with your traffic and looking exactly like normal memory use.\n\n---\n\n## Authenticating a connection\n\n> A WebSocket handshake is an HTTP request, so cookies are sent and your existing session check works. That is the easiest correct answer: authenticate in a `preHandler`, exactly like any other route.\n>\n> Do <b>not</b> put a token in the URL. Day 19 established that URLs are logged by your load balancer, your CDN and your access logs before your code runs, and a WebSocket URL is no different. A cookie or a short-lived ticket exchanged over a normal POST both avoid it.\n\n---\n\n## Authorize per message\n\n> The mistake that matters. A connection authenticated once is a connection that stays open for hours, and \"this socket belongs to user 8811\" says nothing about whether user 8811 may post to room `finance`.\n>\n> So check on <b>join</b> and on <b>send</b>, which is Day 19's per-resource rule at a boundary that does not look like one. And note the harder half: a permission revoked mid-connection does not reach an open socket, so you need to disconnect affected sockets when a role changes.\n\n---\n\n## The scaling problem\n\n```text\nInstance A holds user 1's socket\nInstance B holds user 2's socket\nUser 1 sends a message → only instance A knows\n```\n\n> This is the actual lesson of the day. Your room index lives in one process's memory, so a broadcast reaches only the clients that happen to be connected to that instance. With two instances, half your users miss every message.\n>\n> It is the same shape as Day 21's in-memory sessions, Day 19's in-process rate limiter and Day 24's per-process cron. <b>Anything held in a process is per process</b>, and real time is where it hurts most, because the state is the connections themselves and those cannot be moved.\n\n---\n\n## Redis pub/sub\n\n<b>Pub/sub</b> (publishers send to a channel and every subscriber receives it).\n\n```text\nA publishes → Redis channel → every instance receives → each fans out locally\n```\n\n> Every instance subscribes and delivers to its own local sockets, so a message published anywhere reaches everybody. That is the standard answer and it has two properties worth knowing.\n>\n> It is <b>fire and forget</b>: Redis pub/sub does not persist, so a message published while an instance is restarting is gone for that instance's clients. If gap-free delivery matters, the sequence-number resume from the reconnection lesson is what actually provides it, not pub/sub.\n>\n> And every instance receives <b>every</b> message, including for rooms it has nobody in. That is fine at moderate scale and becomes the bottleneck at large scale, which is when you start partitioning channels per room.\n\n---\n\n## Socket.IO\n\n> Socket.IO gives you rooms, reconnection, acknowledgements and a Redis adapter, which is most of this day in a package. The honest trade: it is its own protocol rather than plain WebSocket, so a non-browser client needs its client library, and you inherit its abstractions when debugging.\n>\n> Use `ws` or `@fastify/websocket` when your needs are simple, and Socket.IO when you would otherwise build rooms, acknowledgements and a pub/sub adapter yourself. Not because it is popular.",
      diagram: `A room is just an INDEX

    Map<roomName, Set<socket>>

    two things about that index cause real
    problems:

      it is PER INSTANCE
        → the last part of this lesson

      it must be CLEANED UP ON CLOSE
        → a Map holding gone sockets is Day 14's
          leak, growing with traffic and looking
          exactly like normal memory use


Authenticating a connection

    the handshake IS an HTTP request, so cookies
    are sent and your existing session check
    works.

    → authenticate in a preHandler, exactly like
      any other route. easiest correct answer.

    ⚠ do NOT put a token in the URL.

      Day 19: URLs are logged by your load
      balancer, your CDN and your access logs
      BEFORE YOUR CODE RUNS.

      a WebSocket URL is no different.

      use a cookie, or a short-lived ticket
      exchanged over a normal POST.


⚠⚠ Authorize PER MESSAGE

    the mistake that matters.

    a connection authenticated once stays open for
    HOURS.

    "this socket belongs to user 8811" says
    NOTHING about whether user 8811 may post to
    room finance.

    → check on JOIN and on SEND.

      Day 19's per-resource rule, at a boundary
      that does not look like one.

    ⚠ and the harder half:

      a permission REVOKED MID-CONNECTION does not
      reach an open socket.

      → you must disconnect affected sockets when
        a role changes.


⚠⚠ THE SCALING PROBLEM

    instance A holds user 1's socket
    instance B holds user 2's socket

    user 1 sends → ONLY INSTANCE A KNOWS

    your room index lives in ONE PROCESS'S MEMORY,
    so a broadcast reaches only the clients
    connected to THAT instance.

    two instances = half your users miss every
    message.

    the same shape as:
      Day 21's in-memory sessions
      Day 19's in-process rate limiter
      Day 24's per-process cron

    ANYTHING HELD IN A PROCESS IS PER PROCESS.

    and real time is where it hurts MOST, because
    the state IS the connections, and those cannot
    be moved.


Redis pub/sub

    A publishes → Redis channel
                → EVERY instance receives
                → each fans out to ITS OWN sockets

    two properties worth knowing:

    ⚠ IT IS FIRE AND FORGET.

      Redis pub/sub does not persist. a message
      published while an instance is restarting is
      GONE for that instance's clients.

      → if gap-free delivery matters, the
        SEQUENCE-NUMBER RESUME from the
        reconnection lesson is what provides it.
        not pub/sub.

    ⚠ EVERY INSTANCE RECEIVES EVERY MESSAGE,

      including for rooms it has nobody in.

      fine at moderate scale.
      the bottleneck at large scale, which is when
      you partition channels per room.


Socket.IO

    gives you rooms, reconnection,
    acknowledgements and a Redis adapter: most of
    this day in a package.

    the honest trade: it is ITS OWN PROTOCOL, not
    plain WebSocket.

      a non-browser client needs its client
      library
      you inherit its abstractions when debugging

    ws / @fastify/websocket   simple needs
    Socket.IO                 when you would
                              otherwise build
                              rooms, acks and a
                              pub/sub adapter
                              yourself

    not because it is popular.`,
      codeExample: {
        title: "One real-time system across many processes",
        code: `// ── The room index, and cleaning it up ──────────────────────
const rooms = new Map();          // roomId -> Set<socket>

function join(roomId, socket) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  rooms.get(roomId).add(socket);
  (socket.rooms ??= new Set()).add(roomId);
}

function leaveAll(socket) {
  for (const roomId of socket.rooms ?? []) {
    const set = rooms.get(roomId);
    set?.delete(socket);
    // ⚠ Delete the empty Set too, or \`rooms\` grows by one
    // entry per room ever used and never shrinks. Day 14's
    // leak, in the shape people actually write it.
    if (set && set.size === 0) rooms.delete(roomId);
  }
  socket.rooms?.clear();
}


// ── Authentication: the handshake is an HTTP request ────────
app.register(async (realtime) => {
  realtime.addHook("preHandler", authenticate);
  //               ^^^^^^^^^^^^^^^^^^^^^^^^^^^ Day 18's hook,
  //               unchanged. Cookies are sent with the
  //               upgrade request, so your session check works
  //               with no special case.

  realtime.get("/ws", { websocket: true }, (socket, request) => {
    socket.userId = request.user.id;
    setupSocket(socket, request);
  });
});

// ✗ And the thing not to do:
//   new WebSocket("wss://api.example.com/ws?token=eyJhbGci...")
//
// Day 19: that URL is in your load balancer's access log,
// your CDN's log and your own, before your handler runs. A
// long-lived token in a log is a credential you have
// published, and you cannot redact it after the fact.
//
// ✓ If a cookie is impossible (a native app, a cross-origin
//   case), issue a single-use ticket over a normal POST:
app.post("/ws/ticket", { preHandler: authenticate }, async (request) => {
  const ticket = randomBytes(32).toString("base64url");
  await redis.set(\`wsticket:\${ticket}\`, String(request.user.id), { EX: 30 });
  return { ticket };
});
// Then the client connects with ?ticket=..., and the server
// consumes it atomically:
const userId = await redis.getDel(\`wsticket:\${ticket}\`);
// Thirty seconds, single use. It still appears in a log, and
// it is worthless by the time anybody reads one.


// ── ⚠⚠ Authorize per message, not per connection ────────────
function setupSocket(socket, request) {
  socket.on("message", async (raw) => {
    const msg = parseAndValidate(raw);      // the WebSockets lesson
    if (!msg) return;

    if (msg.type === "join") {
      // Day 19: can THIS user see THIS room? Checked here,
      // because the connection being authenticated says
      // nothing about it.
      const allowed = await canViewRoom(app.db, socket.userId, msg.roomId);
      if (!allowed) {
        socket.send(JSON.stringify({ type: "error", id: msg.id, error: "forbidden" }));
        return;
      }
      join(msg.roomId, socket);
      socket.send(JSON.stringify({ type: "joined", id: msg.id, roomId: msg.roomId }));
      return;
    }

    if (msg.type === "chat") {
      // Checked again on send. A user removed from the room
      // after joining still holds a socket in the index.
      const allowed = await canPostToRoom(app.db, socket.userId, msg.roomId);
      if (!allowed) {
        socket.send(JSON.stringify({ type: "error", id: msg.id, error: "forbidden" }));
        return;
      }
      await publishChat(msg.roomId, { userId: socket.userId, body: msg.body });
    }
  });

  socket.on("close", () => {
    leaveAll(socket);
    presence.delete(socket.userId);
    clearInterval(socket.refillTimer);
  });
}

// ⚠ And the half that is easy to skip: a revoked permission
// does not reach an open socket.
export async function removeFromRoom(db, userId, roomId) {
  await db.delete(roomMembers).where(and(
    eq(roomMembers.userId, userId), eq(roomMembers.roomId, roomId),
  ));

  // Publish it, so every instance drops that user's sockets
  // from the room. Without this, a removed member keeps
  // receiving messages until they disconnect, which could be
  // days.
  await pub.publish("control", JSON.stringify({
    type: "room:remove", roomId, userId,
  }));
}


// ── ⚠⚠ The scaling problem ──────────────────────────────────
// ✗ Local broadcast only:
function broadcastLocal(roomId, payload) {
  const data = JSON.stringify(payload);
  for (const socket of rooms.get(roomId) ?? []) socket.send(data);
}
//
// Two instances behind a load balancer:
//
//   user 1 → instance A
//   user 2 → instance B
//
//   user 1 sends a chat message
//     → instance A broadcasts to its local room
//     → user 2 receives NOTHING
//
// The feature works perfectly in development, because
// development runs one process. It half-works in production,
// and which half depends on which instance each user landed
// on, so it looks intermittent.
//
// Day 21's in-memory sessions, Day 19's in-process rate
// limiter, Day 24's per-process cron, and now this. The
// difference is that you cannot move a connection, so this
// one cannot be fixed by making the state shared: it has to
// be fixed by making the MESSAGES shared.


// ── ✓ Redis pub/sub, and the resume that completes it ───────
import { createClient } from "redis";

const pub = createClient({ url: config.redis.url });
const sub = pub.duplicate();
//         ^^^^^^^^^^^^^^^ a subscribing connection cannot run
//         normal commands, so you need two
await Promise.all([pub.connect(), sub.connect()]);

// Every instance subscribes and fans out locally.
await sub.subscribe("chat", (raw) => {
  const { roomId, message } = JSON.parse(raw);
  for (const socket of rooms.get(roomId) ?? []) {
    // The backpressure lesson, applied per socket inside the
    // loop.
    if (socket.bufferedAmount > MAX_BUFFERED) continue;
    socket.send(JSON.stringify(message));
  }
});

await sub.subscribe("control", (raw) => {
  const msg = JSON.parse(raw);
  if (msg.type === "room:remove") {
    for (const socket of rooms.get(msg.roomId) ?? []) {
      if (socket.userId === msg.userId) {
        socket.send(JSON.stringify({ type: "removed", roomId: msg.roomId }));
        rooms.get(msg.roomId).delete(socket);
      }
    }
  }
});

export async function publishChat(roomId, message) {
  // ⚠ Persist FIRST, with a sequence number, then publish.
  //
  // Redis pub/sub is fire and forget: it does not store
  // anything, so a message published while an instance is
  // restarting is gone for that instance's clients with no
  // trace.
  //
  // The database row plus the sequence number is what the
  // reconnection lesson's resume reads. Pub/sub delivers to
  // the connected; the row delivers to everyone else.
  const [saved] = await db.insert(messages)
    .values({ roomId, userId: message.userId, body: message.body })
    .returning({ seq: messages.seq, id: messages.id, createdAt: messages.createdAt });

  await pub.publish("chat", JSON.stringify({
    roomId,
    message: { ...message, seq: saved.seq, id: saved.id },
  }));
}
//
// That ordering is the whole design. Pub/sub is a delivery
// optimisation for clients that happen to be connected right
// now; the durable sequence is what makes delivery correct.
// Treating pub/sub as the source of truth is how a chat
// application loses messages during a deploy and nobody can
// reproduce it.


// ── ⚠ And the scaling limit of the simple version ───────────
// Every instance receives EVERY message on the "chat" channel,
// including for rooms it has nobody in.
//
//   10 instances, 1,000 messages/second
//     → each instance processes 1,000/second
//     → 10,000 deliveries of which 9,000 are discarded
//
// Fine at moderate scale. When it stops being fine, partition:
//
//   await sub.subscribe(\`chat:\${roomId}\`, handler);
//
// subscribing only to rooms this instance actually has members
// in, and unsubscribing when the last member leaves. That is
// more bookkeeping, and it is the bookkeeping Socket.IO's
// Redis adapter does for you, which is a fair reason to use it.


// ── Socket.IO, and when it earns its place ──────────────────
// It gives you: rooms, automatic reconnection with backoff,
// acknowledgements, a Redis adapter, and fallbacks.
//
// That is genuinely most of this day.
//
// The trade: it is its own protocol on top of WebSocket, so
//   a non-browser client needs socket.io-client
//   curl and wscat cannot talk to it directly
//   debugging goes through its abstractions
//
// ✓ ws or @fastify/websocket   one-way or simple two-way, and
//                              you want plain WebSocket
// ✓ Socket.IO                  you would otherwise build
//                              rooms + acks + a pub/sub
//                              adapter
// ✗ Socket.IO                  because it is popular, or for
//                              a feature SSE would have done`,
      },
      keyTakeaways: [
        "A room is an index from a name to a set of sockets, and it must be cleaned up on close, including deleting empty sets.",
        "The WebSocket handshake is an HTTP request, so cookies are sent and your existing session hook works unchanged.",
        "Never put a token in the WebSocket URL. Day 19's point: URLs are logged by every intermediary before your code runs.",
        "Use a short-lived single-use ticket if a cookie is impossible, so the value in the log is worthless by the time anyone reads it.",
        "Authorize per message, not per connection. A socket authenticated once stays open for hours.",
        "Check on join and on send, because membership can change after the join succeeded.",
        "A permission revoked mid-connection does not reach an open socket, so publish a control message and disconnect affected sockets.",
        "The room index is per instance, so with two instances a broadcast reaches only half your users and it looks intermittent.",
        "That is the same shape as in-memory sessions, in-process rate limiting and per-process cron, and it is worst here because connections cannot be moved.",
        "Redis pub/sub fixes it by sharing the messages rather than the state: every instance subscribes and fans out locally.",
        "Pub/sub is fire and forget, so persist with a sequence number first and publish second.",
        "The durable sequence is what makes delivery correct; pub/sub is a delivery optimisation for clients connected right now.",
        "Treating pub/sub as the source of truth is how a chat application loses messages during a deploy with no way to reproduce it.",
        "Every instance receives every message on a shared channel, which becomes the bottleneck at scale and is when you partition per room.",
        "Socket.IO gives you rooms, reconnection, acknowledgements and a Redis adapter, at the cost of its own protocol and abstractions.",
      ],
      commonMistakes: [
        "Not deleting empty room sets, so the index grows by one entry per room ever used.",
        "Leaving a socket in the room index on close, which leaks memory proportional to traffic.",
        "Putting a token in the WebSocket URL, which publishes it to every access log in the path.",
        "Authenticating at connection time and treating every subsequent message as authorized.",
        "Never handling a revoked permission, so a removed member keeps receiving messages until they disconnect.",
        "A local-only broadcast, which works in development and reaches half your users in production.",
        "Treating Redis pub/sub as durable, so messages published during a restart vanish with no trace.",
        "Publishing before persisting, so the sequence a reconnecting client resumes from does not include the message.",
        "Subscribing every instance to one channel at large scale, where most deliveries are discarded.",
        "Choosing Socket.IO for popularity, or for a one-way feature SSE would have handled.",
      ],
      quiz: [
        {
          question: "Why should a token never go in a WebSocket URL?",
          options: [
            "URLs have a length limit",
            "Day 19's point: the URL is logged by your load balancer, CDN and access logs before your code runs, so the token is published",
            "Browsers strip query strings",
            "It breaks the upgrade",
          ],
          correctIndex: 1,
          explanation:
            "Cookies are sent with the handshake, so your session check works. If that is impossible, use a 30-second single-use ticket.",
        },
        {
          question: "Why authorize per message rather than per connection?",
          options: [
            "Performance",
            "A socket authenticated once stays open for hours, and \"this socket is user 8811\" says nothing about whether they may post to this room",
            "The protocol requires it",
            "To support rooms",
          ],
          correctIndex: 1,
          explanation:
            "Check on join and on send, and publish a control message to disconnect sockets when a role changes.",
        },
        {
          question: "What breaks when you run two instances with a local room index?",
          options: [
            "Nothing",
            "A broadcast reaches only the clients connected to that instance, so half your users miss every message and it looks intermittent",
            "Redis rejects the writes",
            "The handshake fails",
          ],
          correctIndex: 1,
          explanation:
            "The same per-process bug as in-memory sessions and per-process cron, and worse here because connections cannot be moved.",
        },
        {
          question: "What must you do before publishing to Redis pub/sub?",
          options: [
            "Nothing, publish is enough",
            "Persist the message with a sequence number, because pub/sub is fire and forget and a message published during a restart is gone",
            "Acquire a lock",
            "Check the room exists",
          ],
          correctIndex: 1,
          explanation:
            "The durable sequence is what makes delivery correct and what a reconnecting client resumes from. Pub/sub only serves the currently connected.",
        },
        {
          question: "When does the simple one-channel pub/sub design stop scaling?",
          options: [
            "Immediately",
            "When every instance receiving every message becomes the bottleneck, since most deliveries are for rooms it has nobody in",
            "At two instances",
            "Only with binary payloads",
          ],
          correctIndex: 1,
          explanation:
            "Then you partition channels per room and manage subscriptions, which is the bookkeeping Socket.IO's Redis adapter does for you.",
        },
        {
          question: "When is Socket.IO the right choice?",
          options: [
            "Always, it is more capable",
            "When you would otherwise build rooms, acknowledgements and a pub/sub adapter yourself, accepting that it is its own protocol",
            "For one-way streaming",
            "Because it is popular",
          ],
          correctIndex: 1,
          explanation:
            "Its cost is that a non-browser client needs its library and debugging goes through its abstractions.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What question should you answer before choosing a real-time technology?",
      options: [
        "How many clients?",
        "How stale is acceptable? A feature that tolerates thirty seconds needs no connection infrastructure at all.",
        "SSE or WebSocket?",
        "Do we have Redis?",
      ],
      correctIndex: 1,
      explanation:
        "Asking about protocols first is how you maintain heartbeats and reconnection for a page that refreshes every minute.",
    },
    {
      question: "What is polling's underrated advantage?",
      options: [
        "Low latency",
        "No persistent connection, so it works through every proxy, needs no reconnection logic, and scales like your existing API",
        "Fewer bytes",
        "Server push",
      ],
      correctIndex: 1,
      explanation:
        "Its costs are a constant request rate and a latency floor of half the interval, and a cached endpoint makes it viable.",
    },
    {
      question: "What must a long-polling handler not hold while waiting?",
      options: [
        "The request",
        "A database connection. A hundred idle waiters would exhaust a pool of ten and stall the whole application.",
        "A timer",
        "The socket",
      ],
      correctIndex: 1,
      explanation:
        "Read first, release the connection, then wait with nothing held but the HTTP request itself.",
    },
    {
      question: "What terminates an SSE event on the wire?",
      options: [
        "A semicolon",
        "A blank line, so an event ends with `\\n\\n`",
        "The `id:` field",
        "A null byte",
      ],
      correctIndex: 1,
      explanation:
        "Verified as `\"id: 1\\nevent: tick\\ndata: {...}\\n\\n\"`. That framing is the entire protocol.",
    },
    {
      question: "What does SSE's `id:` field give you?",
      options: [
        "Deduplication",
        "The browser returns it as `Last-Event-ID` on reconnection, so you can replay exactly what the client missed",
        "Ordering only",
        "Compression",
      ],
      correctIndex: 1,
      explanation:
        "Gap-free delivery across a dropped connection for free, which with a WebSocket you would design and implement yourself.",
    },
    {
      question: "Why send a `: ping` comment on an SSE stream every 25 seconds?",
      options: [
        "The spec requires it",
        "It stops proxies closing an idle connection, and without it a quiet stream dies while automatic reconnection hides the problem",
        "To measure latency",
        "To flush compression",
      ],
      correctIndex: 1,
      explanation:
        "You would not notice from the client, because `EventSource` reconnects silently while doubling your connection churn.",
    },
    {
      question: "What is the six-connection limit, and when does it apply?",
      options: [
        "A Node limit on SSE clients",
        "A browser allows about six connections per origin over HTTP/1.1, and an SSE stream holds one, so six tabs make the seventh request of any kind hang",
        "A proxy limit",
        "A limit on WebSockets only",
      ],
      correctIndex: 1,
      explanation:
        "It does not apply over HTTP/2. Presenting as \"the site randomly stops loading\" is what makes it hard to diagnose.",
    },
    {
      question: "What did Node 24 actually ship, verified?",
      options: [
        "A WebSocket client and server",
        "A built-in client, with `WebSocketServer` undefined, so accepting connections still needs a library",
        "Neither",
        "A server only",
      ],
      correctIndex: 1,
      explanation:
        "Useful for consuming somebody else's feed with no dependency, and it emitted no experimental warning.",
    },
    {
      question: "Why does SSE deploy more easily than WebSockets?",
      options: [
        "Smaller frames",
        "There is no protocol upgrade, so no load balancer, proxy or CDN in the path can refuse or strip it",
        "Less memory",
        "Browsers prefer it",
      ],
      correctIndex: 1,
      explanation:
        "A failed upgrade shows as a 200 or 400 instead of a 101, from one network only, which is barely debuggable.",
    },
    {
      question: "Why is a WebSocket message handler a boundary needing Day 16's treatment?",
      options: [
        "It is not, the connection is authenticated",
        "Every message is untrusted client input arriving with none of your route schemas, and `JSON.parse` throws on the first malformed frame",
        "Because of the upgrade",
        "Only for binary frames",
      ],
      correctIndex: 1,
      explanation:
        "An uncaught throw in the handler is Day 4's uncaught exception. Parse in a `try`, validate, cap the size and rate limit.",
    },
    {
      question: "Why can a WebSocket be dead with both sides believing it is alive?",
      options: [
        "A protocol bug",
        "A closed lid, a network change or an expired NAT entry sends no close frame, and TCP will not tell you promptly if you are only reading",
        "Proxies",
        "Only over HTTP/1.1",
      ],
      correctIndex: 1,
      explanation:
        "OS keepalive commonly waits two hours for a first probe, so the socket holds resources until then unless you act.",
    },
    {
      question: "Why `terminate()` rather than `close()` for a socket you believe is dead?",
      options: [
        "It is shorter",
        "`close()` waits for a close handshake the dead peer will never complete, so the socket lingers for minutes still holding its resources",
        "`close()` throws",
        "They are the same",
      ],
      correctIndex: 1,
      explanation:
        "Verified that a silent client was removed by `terminate()` on the next sweep. With `close()`, your cleanup does not clean up.",
    },
    {
      question: "Why does WebSocket reconnection need jitter?",
      options: [
        "Latency",
        "A server restart makes every connected client reconnect at the same instant, against a process that has just started",
        "Browsers require it",
        "To avoid duplicate sessions",
      ],
      correctIndex: 1,
      explanation:
        "Day 22 measured 1000 clients without jitter producing one distinct retry time. Same herd, aimed at a fresh process.",
    },
    {
      question: "What does `socket.send()` do when the peer is too slow to read?",
      options: [
        "Returns false",
        "Queues the data and returns as if everything is fine, with no error and no signal",
        "Throws",
        "Blocks",
      ],
      correctIndex: 1,
      explanation:
        "Verified: 200 sends of 256KB returned normally while `bufferedAmount` grew linearly to 49.5 MB.",
    },
    {
      question: "What was verified about `heapUsed` during 49.5 MB of socket buffering?",
      options: [
        "It grew with the buffer",
        "It stayed at 8 MB, because the buffer lives outside the V8 heap",
        "It spiked and recovered",
        "It was not measured",
      ],
      correctIndex: 1,
      explanation:
        "So Day 14's heap snapshots and any heap-based alarm show a healthy process right up to the out-of-memory kill.",
    },
    {
      question: "When is dropping messages the correct backpressure response?",
      options: [
        "Never",
        "When the latest value supersedes the previous one, such as a price or a cursor position",
        "Always",
        "Only for binary",
      ],
      correctIndex: 1,
      explanation:
        "Chat messages need closing with 1013 and a resume instead, because a conversation with a hole is worse than a brief reconnect.",
    },
    {
      question: "Why check `bufferedAmount` inside a broadcast loop rather than before it?",
      options: [
        "Speed",
        "One slow client otherwise accumulates the entire room's message rate rather than just its own",
        "The value changes per message",
        "To avoid re-encoding",
      ],
      correctIndex: 1,
      explanation:
        "A room of 1,000 at 50 messages a second means 50 messages a second piling into that one buffer.",
    },
    {
      question: "Why should a token never appear in a WebSocket URL?",
      options: [
        "Length limits",
        "The URL is logged by your load balancer, CDN and access logs before your code runs, so the token is published",
        "Browsers strip it",
        "It breaks the upgrade",
      ],
      correctIndex: 1,
      explanation:
        "Cookies are sent with the handshake. If that is impossible, use a 30-second single-use ticket that is worthless by the time it is read.",
    },
    {
      question: "What breaks when you run two instances with a local room index?",
      options: [
        "Nothing",
        "A broadcast reaches only that instance's clients, so half your users miss every message and it looks intermittent",
        "The handshake",
        "Authentication",
      ],
      correctIndex: 1,
      explanation:
        "The same per-process bug as in-memory sessions, in-process rate limiting and per-process cron, and worse because connections cannot be moved.",
    },
    {
      question: "What must happen before publishing a message to Redis pub/sub?",
      options: [
        "Nothing",
        "Persist it with a sequence number, because pub/sub is fire and forget and a message published during a restart is gone with no trace",
        "Acquire a lock",
        "Check the room exists",
      ],
      correctIndex: 1,
      explanation:
        "The durable sequence is what makes delivery correct and what a reconnecting client resumes from. Pub/sub serves only the currently connected.",
    },
  ],
  project: {
    name: "day-25",
    goal: "Build a live counter that survives two Node processes, then reproduce the four failures that make real time hard: a dead socket nobody notices, a slow client buffering 50MB invisibly, a broadcast that reaches half your users, and a reconnection that loses messages.",
    brief:
      "The counter is the easy part and it will work first time on one process. The lesson is what happens next. Run two instances and half your users stop seeing updates, which is the actual subject of this day. Then stall a client and watch bufferedAmount climb into the tens of megabytes while heapUsed does not move, because that is the failure your monitoring cannot see. Do the SSE version first: it is less code, it gives you reconnection and resume for free, and comparing the two is what teaches you when a WebSocket is worth it.",
    steps: [
      "Create `day-25/` with `\"type\": \"module\"` and install `fastify`, `@fastify/websocket`, `ws`, `redis` and `zod`. Start Redis with Docker.",
      "Write a plain `node:http` SSE endpoint that emits a counter every second, and record the exact bytes it writes.",
      "Open it with `curl -N` and confirm the `text/event-stream` content type and the blank-line framing.",
      "Remove the blank line from one event and confirm the client stops receiving anything.",
      "Add `id:` to every event, connect with a browser `EventSource`, kill the server, restart it, and log the `Last-Event-ID` header you receive.",
      "Implement replay from that header and confirm a reconnecting client receives exactly what it missed.",
      "Remove the `req.on(\"close\")` cleanup, load the page fifty times, and count the live intervals still writing.",
      "Add a `: ping` keepalive, then set a proxy or a short server timeout and confirm the stream survives an idle minute.",
      "Open seven tabs of your app over HTTP/1.1 and confirm the seventh request hangs.",
      "Serve over HTTP/2 and confirm it does not.",
      "Now build the WebSocket version: a counter with an increment message, using `@fastify/websocket` with `maxPayload` set.",
      "Confirm `typeof WebSocket` and `typeof WebSocketServer` in Node and write down which one you get.",
      "Write a Node client using the built-in `WebSocket`, send during `CONNECTING`, and record what happens.",
      "Add a Zod discriminated union for inbound messages, send malformed JSON with no `try`, and confirm the process exits.",
      "Add the `try` and the schema, then send garbage and confirm the connection survives with an error reply.",
      "Add per-connection rate limiting, flood from a client, and confirm the connection is closed with 1008.",
      "Implement the ping and pong sweep with `isAlive`, then connect a raw TCP client that handshakes and pauses.",
      "Confirm the silent client is terminated on the next sweep while a live client stays.",
      "Change `terminate()` to `close()`, repeat, and record how long the dead socket stays in `wss.clients`.",
      "Write the reconnecting client with jittered backoff, and confirm it does not reconnect after a 1000 or a 1008.",
      "Restart the server with fifty connected clients and record the spread of reconnection times with and without jitter.",
      "Add a sequence number to every message and a `since` parameter on connect, then confirm a reconnecting client receives the gap.",
      "Make a client stall: connect over raw TCP, handshake, pause, and flood it with 256KB frames.",
      "Log `bufferedAmount` and `process.memoryUsage().heapUsed` every twenty frames, and record both columns.",
      "Add a `bufferedAmount` check with a drop policy for the counter, and confirm the buffer stops growing.",
      "Add a broadcast to a room of 200 clients with one stalled, checking `bufferedAmount` once before the loop, and record the stalled client's buffer.",
      "Move the check inside the loop and record it again.",
      "Add rooms with join and leave, and confirm the room index and the empty sets are both cleaned up on close.",
      "Add authentication via a cookie in the handshake, then try a token in the query string and find it in your access log.",
      "Implement the single-use ticket endpoint and confirm the ticket cannot be reused.",
      "Add an authorization check on join, then remove a user from a room in the database and confirm their open socket still receives messages.",
      "Publish a control message on removal and confirm the socket is dropped from the room.",
      "Now run two server processes on different ports, connect one browser to each, and confirm an increment from one is not seen by the other.",
      "Add Redis pub/sub with separate publisher and subscriber clients, and confirm both browsers now update.",
      "Persist each message with a sequence number before publishing, then restart one instance mid-traffic and confirm its clients resume without a gap.",
      "Publish without persisting, repeat the restart, and confirm messages are lost with nothing in any log.",
      "Compare your SSE and WebSocket implementations: count the lines, and list what the browser gave you for free in the first one.",
    ],
    acceptance: [
      "You have the exact SSE bytes recorded, including the `\\n\\n` framing, and you saw a missing blank line stop delivery.",
      "A reconnecting `EventSource` sends `Last-Event-ID` and your server replays the gap.",
      "Removing the close cleanup produced a countable number of leaked intervals.",
      "The stream survives an idle minute with a keepalive and dies without one.",
      "Seven tabs over HTTP/1.1 hang the seventh request, and HTTP/2 does not.",
      "You recorded that `WebSocket` is a function and `WebSocketServer` is undefined.",
      "Sending during `CONNECTING` produced a recorded error.",
      "Malformed JSON with no `try` exited the process, and with the `try` and schema it did not.",
      "A flooding client is closed with 1008 by your per-connection limiter.",
      "A silent raw client is terminated on the next sweep, and with `close()` you recorded how long it lingered.",
      "Your client does not reconnect after 1000 or 1008, and reconnects after 1006.",
      "You have the reconnection time spread for fifty clients with and without jitter.",
      "A reconnecting client with a `since` parameter receives the messages it missed.",
      "You have the two-column table of `bufferedAmount` and `heapUsed` for a stalled client, and can state why the second one matters.",
      "The stalled client's buffer stops growing once the check is added.",
      "You have the stalled client's buffer size with the check before the loop and inside it.",
      "Room membership and empty room entries are both removed on close.",
      "You found a query-string token in your access log, and the ticket version cannot be reused.",
      "A user removed from a room keeps receiving messages until you publish the control message.",
      "Two processes without pub/sub deliver to only half your clients, and with pub/sub deliver to all.",
      "Restarting an instance loses messages when publishing without persisting, and does not when persisting first.",
      "You have a line count comparison of the SSE and WebSocket versions and a list of what the browser handled for you.",
      "`npx tsc --noEmit` passes if you used TypeScript, and `node --test` passes.",
    ],
    stretch: [
      "Add presence: show who is online in a room across both instances, and handle a client whose socket dies without a close frame.",
      "Partition pub/sub channels per room and measure the reduction in messages each instance processes.",
      "Add an acknowledgement protocol with message ids and a client-side timeout, then compare it with what Socket.IO gives you.",
      "Rebuild the same feature with Socket.IO and its Redis adapter, then count the lines and list what you gave up.",
      "Add a `SharedWorker` so many tabs share one SSE connection, and confirm the seven-tab limit no longer applies.",
      "Measure memory per connection at 100, 1,000 and 10,000 connections and extrapolate your per-instance ceiling.",
      "Add graceful shutdown: on `SIGTERM`, send a close frame with 1001 so clients reconnect elsewhere before you exit.",
      "Add Day 21's request id to every socket and every message, then trace one client's session across both instances.",
      "Stream AI-style tokens over SSE and compare the perceived latency with a WebSocket doing the same thing.",
      "Write a test that fails if any inbound WebSocket message path lacks schema validation.",
    ],
  },
};
