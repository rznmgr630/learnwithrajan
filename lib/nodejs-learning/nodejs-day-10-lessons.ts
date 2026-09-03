import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_10_LESSONS: LessonDay = {
  day: 10,
  title: "HTTP without a framework",
  totalMinutes: 96,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "http-and-createserver",
      title: "node:http and createServer",
      durationMinutes: 10,
      explanation:
        "Before Express, Fastify or NestJS, it is worth knowing what Node's built-in HTTP server actually does. A framework mostly saves you from writing this plumbing yourself.\n\n```text\nClient\n   │\n   │ HTTP Request\n   ↓\nnode:http\n   │\n   ├── method\n   ├── URL\n   ├── headers\n   └── body\n   │\n   ↓\nYour code\n   │\n   ↓\nHTTP Response\n   │\n   ├── status\n   ├── headers\n   └── body\n   ↓\nClient\n```\n\n---\n\n## What is HTTP?\n\n<b>HTTP</b> (the protocol clients and servers use to communicate over the web).\n\nA client sends:\n\n```text\nGET /users\n```\n\nThe server sends:\n\n```text\n200 OK\n\n[\n  {\n    \"id\": 1,\n    \"name\": \"Rajan\"\n  }\n]\n```\n\n```text\nRequest\n   ↓\nServer processes request\n   ↓\nResponse\n```\n\nThat is Phase 0's request cycle, now from the server's side.\n\n---\n\n## `node:http`\n\n```javascript\nimport http from \"node:http\";\n```\n\nYou do not need Express to create an HTTP server.\n\n---\n\n## Your first server\n\n```javascript\nimport http from \"node:http\";\n\nconst server = http.createServer(\n  (req, res) => {\n    res.end(\"Hello World\");\n  }\n);\n\nserver.listen(3000);\n```\n\n```bash\nnode server.js\n```\n\nVisit `http://localhost:3000` and you get:\n\n```text\nHello World\n```\n\n---\n\n## What `createServer()` does\n\n<b>`createServer()`</b> (creates an HTTP server that receives requests and gives your callback the request and response objects).\n\n```javascript\n(req, res) => {}\n```\n\n```text\nreq\n ↓\nIncomingMessage\n ↓\ninformation about the request\n\nres\n ↓\nServerResponse\n ↓\ncontrols what you send back\n```\n\nTwo things about those names, because they connect to the last two days.\n\n<b>The server is an `EventEmitter`.</b> Day 9's mechanism: `createServer(handler)` is shorthand for attaching a `'request'` listener. So these are identical:\n\n```javascript\nhttp.createServer((req, res) => { ... });\n\nconst server = http.createServer();\nserver.on(\"request\", (req, res) => { ... });\n```\n\nWhich means you also get `'connection'`, `'close'`, `'error'` and `'clientError'` on the same object.\n\n<b>`req` and `res` are streams.</b> `IncomingMessage` is a Readable and `ServerResponse` is a Writable, which is Day 8. So `req.pipe(fileStream)` and `fileStream.pipe(res)` both work, and Day 8's `pipeline` applies here directly.\n\nThose two facts are most of what this day is. HTTP in Node is <b>events plus streams</b>, and you already have both.\n\n---\n\n## `listen()` is asynchronous\n\nOne practical detail. `server.listen(3000)` does not block until the port is open, so a log line straight after it can be wrong. Pass a callback, or use Day 9's helper:\n\n```javascript\nawait once(server, \"listening\");\nconsole.log(\"ready on\", server.address().port);\n```\n\nAnd `server.listen(0)` binds a random free port, which is exactly what you want in tests.",
      diagram: `HTTP in Node is events plus streams

    THE SERVER IS AN EVENTEMITTER          (Day 9)

      http.createServer(handler)
        └─ shorthand for:
           server.on("request", handler)

      so you also get:
        "connection"   "close"
        "error"        "clientError"


    REQ AND RES ARE STREAMS                (Day 8)

      req   IncomingMessage   Readable
      res   ServerResponse    Writable

      so these work directly:
        req.pipe(fileStream)
        fileStream.pipe(res)
        await pipeline(req, transform, res)


    that is most of this day. you already have both.


The cycle, from the server side

    Client
       │  GET /users
       ↓
    node:http
       ├── req.method    "GET"
       ├── req.url       "/users"
       ├── req.headers   { host, accept, ... }
       └── req (body)    a Readable stream
       │
       ↓  your code
       │
       ├── res.writeHead(200, {...})
       ├── res.write(...)
       └── res.end()
       ↓
    Client


listen() does not block

    server.listen(3000)
    console.log("ready")        ← may print before it is

    server.listen(3000, () => console.log("ready"))   ✓
    await once(server, "listening")                   ✓  (Day 9)

    and listen(0) binds a random free port,
    which is what you want in tests`,
      codeExample: {
        title: "A server, two ways, and what req and res really are",
        code: `import http from "node:http";
import { once } from "node:events";
import { EventEmitter } from "node:events";
import { Readable, Writable } from "node:stream";

// ── The short form ──────────────────────────────────────────
const server = http.createServer((req, res) => {
  res.end("Hello World");
});

// ── Which is exactly this ───────────────────────────────────
const same = http.createServer();
same.on("request", (req, res) => {
  res.end("Hello World");
});
//
// Day 9: the server is an EventEmitter.
console.log("server is an emitter:", server instanceof EventEmitter);   // true


// ── And you get the other events too ────────────────────────
server.on("error", (error) => console.error("server error:", error.code));
server.on("clientError", (error, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
});
server.on("close", () => console.log("server closed"));


// ── listen() is asynchronous ────────────────────────────────
server.listen(0);                       // 0 = a random free port
await once(server, "listening");         // Day 9's helper

const { port } = server.address();
console.log("listening on", port);
//
// server.listen(3000); console.log("ready")  can print before
// the port is actually open.


// ── req and res are streams ─────────────────────────────────
server.removeAllListeners("request");
server.on("request", async (req, res) => {
  console.log("req is Readable:", req instanceof Readable);   // true
  console.log("res is Writable:", res instanceof Writable);   // true

  console.log("method:", req.method, "| url:", req.url);
  console.log("host header:", req.headers.host);

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World");
});

const response = await fetch(\`http://localhost:\${port}/users?page=2\`);
console.log("status:", response.status, "| body:", await response.text());
// req is Readable: true
// res is Writable: true
// method: GET | url: /users?page=2
// status: 200 | body: Hello World


// ── Which means Day 8 applies unchanged ─────────────────────
// server.on("request", async (req, res) => {
//   // upload: request body → file
//   await pipeline(req, fs.createWriteStream("upload.bin"));
//
//   // download: file → response
//   await pipeline(fs.createReadStream("big.zip"), res);
//
//   // and gzip in the middle, since it is a Transform
//   await pipeline(fs.createReadStream("big.log"), createGzip(), res);
// });

server.close();
same.close();`,
      },
      keyTakeaways: [
        "`node:http` gives you a real HTTP server with no framework.",
        "`createServer(handler)` is shorthand for `server.on(\"request\", handler)`.",
        "<b>The server is an `EventEmitter`</b>, which is Day 9. You also get `'connection'`, `'close'`, `'error'` and `'clientError'`.",
        "<b>`req` is a Readable and `res` is a Writable</b>, which is Day 8.",
        "So `pipeline(req, fileStream)` and `pipeline(fileStream, res)` work directly.",
        "HTTP in Node is <b>events plus streams</b>. You already have both.",
        "`req` is an `IncomingMessage`, `res` is a `ServerResponse`.",
        "`server.listen()` is asynchronous, so a log line right after it can be wrong.",
        "Pass a callback or `await once(server, \"listening\")`.",
        "`server.listen(0)` binds a random free port, which is what you want in tests.",
      ],
      commonMistakes: [
        "<b>Logging \"ready\" straight after `listen()`</b> — the port may not be open yet.",
        "<b>Not realising `req` is a stream</b> — you end up buffering a body you could have piped.",
        "<b>Missing the server's `'error'` listener</b> — an `EADDRINUSE` becomes an uncaught exception.",
        "<b>Hardcoding a port in tests</b> — `listen(0)` avoids collisions entirely.",
        "<b>Treating `createServer` as magic</b> — it attaches one `'request'` listener, nothing more.",
      ],
      quiz: [
        {
          question: "What is `http.createServer(handler)` equivalent to?",
          options: [
            "A framework abstraction with no equivalent",
            "`const s = http.createServer(); s.on(\"request\", handler)`",
            "`server.listen(handler)`",
            "A stream pipeline",
          ],
          correctIndex: 1,
          explanation:
            "The server is an EventEmitter, so the handler is just a `'request'` listener. That also means `'connection'`, `'close'`, `'error'` and `'clientError'` are available on the same object.",
        },
        {
          question: "What are `req` and `res`, in stream terms?",
          options: [
            "Plain objects",
            "`req` is a Readable and `res` is a Writable",
            "Both are Duplex streams",
            "`req` is a Buffer and `res` is a function",
          ],
          correctIndex: 1,
          explanation:
            "Which is why Day 8 applies directly: you can pipe a request body to a file, or a file to a response, without buffering either.",
        },
        {
          question: "Why is `console.log(\"ready\")` immediately after `server.listen(3000)` unreliable?",
          options: [
            "The log is buffered",
            "`listen()` is asynchronous, so the port may not be open yet",
            "`listen` throws if the port is busy",
            "It is reliable",
          ],
          correctIndex: 1,
          explanation:
            "Pass a callback to `listen`, or `await once(server, \"listening\")`. In tests, `listen(0)` also gives you a free port with no collisions.",
        },
      ],
    },
    {
      id: "request-object",
      title: "The request object",
      durationMinutes: 10,
      explanation:
        "<b>Request object</b> (the object containing information sent by the client).\n\nYou commonly use:\n\n```javascript\nreq.method\nreq.url\nreq.headers\n```\n\n---\n\n## `req.method`\n\n<b>`req.method`</b> (the HTTP method).\n\n```text\nGET\nPOST\nPUT\nPATCH\nDELETE\n```\n\n```javascript\nconsole.log(req.method);\n```\n\nFor `GET /users` you get `GET`. Always uppercase, so no need to normalise it.\n\n---\n\n## `req.url`\n\n<b>`req.url`</b> (the URL path and query string).\n\nFor:\n\n```text\nGET /users?page=2\n```\n\nyou get:\n\n```text\n/users?page=2\n```\n\n> `req.url` is not a parsed URL object. Parse it with the `URL` API.\n\nWorth knowing exactly what it is not, because the name misleads. It has <b>no protocol, no host and no port</b>, only the path and query. That is because HTTP/1.1 sends only the path on the request line, and the host arrives separately in the `Host` header. Which is why building a `URL` from it needs both pieces:\n\n```javascript\nnew URL(req.url, `http://${req.headers.host}`);\n```\n\n---\n\n## `req.headers`\n\n<b>`req.headers`</b> (an object of request headers).\n\n```javascript\nconsole.log(req.headers);\n```\n\n```text\n{\n  host: \"localhost:3000\",\n  connection: \"keep-alive\",\n  accept: \"*/*\",\n  user-agent: \"...\"\n}\n```\n\nTwo details that catch people.\n\n<b>Keys are lowercased.</b> Node normalises them, so `req.headers[\"Content-Type\"]` is `undefined` and `req.headers[\"content-type\"]` works. HTTP header names are case-insensitive, and Node picks one case so you do not have to guess.\n\n<b>A repeated header may be an array.</b> Most are joined with a comma, but `set-cookie` is always an array because commas are legal inside a cookie value. So code assuming a string breaks on the one header most likely to repeat.\n\n---\n\n## Common request headers\n\n```text\nContent-Type\nContent-Length\nAuthorization\nAccept\nCookie\nUser-Agent\nHost\n```\n\n```javascript\nconst contentType =\n  req.headers[\"content-type\"];\n```\n\nOne more trap on that one: `Content-Type` often carries parameters, so it can be `application/json; charset=utf-8`. An exact `=== \"application/json\"` comparison fails on a perfectly valid request. Check with `startsWith`, or parse it.\n\n---\n\n## Everything here is client-controlled\n\nThe point to carry forward. `req.method`, `req.url` and every header are <b>strings a client chose to send</b>. Nothing is validated for you.\n\nSo `req.headers.host` is user input, which matters because you are about to build a `URL` from it. And `Content-Length` is a claim, not a measurement: a client can send a different number from the bytes it actually sends, which is why the body-size lesson counts bytes as they arrive rather than trusting the header.\n\nSame lesson as Day 6's path traversal, in a new place: the framework is not validating this, and neither is Node.",
      diagram: `req.url is not a URL

    GET /users?page=2 HTTP/1.1
        └────────┬────────┘
              req.url

    no protocol. no host. no port.

    because HTTP/1.1 sends only the path on the
    request line, and the host comes separately:

      Host: localhost:3000
        └─ req.headers.host

    which is why parsing needs both:

      new URL(req.url, \`http://\${req.headers.host}\`)


Two header traps

    KEYS ARE LOWERCASED
      req.headers["Content-Type"]   undefined  ✗
      req.headers["content-type"]   works      ✓

      HTTP names are case-insensitive, so Node
      picks one case for you


    A REPEATED HEADER MAY BE AN ARRAY
      most            joined with a comma
      set-cookie      ALWAYS an array
                        └─ commas are legal inside
                           a cookie value

      code assuming a string breaks on the one
      header most likely to repeat


    and content-type carries parameters:
      "application/json; charset=utf-8"
        └─ === "application/json"   fails
           startsWith("application/json")   ✓


Everything here is client-controlled

    req.method     a string the client sent
    req.url        a string the client sent
    req.headers    strings the client sent

    nothing is validated. by anything.

    req.headers.host is USER INPUT
      └─ and you are about to build a URL from it

    Content-Length is a CLAIM, not a measurement
      └─ a client can send a different number from
         the bytes it actually sends
         which is why the size lesson counts bytes
         as they arrive

    Day 6's path traversal, in a new place.`,
      codeExample: {
        title: "Reading a request, and the traps in it",
        code: `import http from "node:http";
import { once } from "node:events";

const server = http.createServer((req, res) => {
  // ── method: always uppercase ──────────────────────────────
  console.log("method:", req.method);

  // ── url: path and query only ──────────────────────────────
  console.log("url:   ", req.url);          // /users?page=2
  //   no protocol, no host, no port

  // ── headers: keys are lowercased ──────────────────────────
  console.log("Content-Type:", req.headers["Content-Type"]);   // undefined
  console.log("content-type:", req.headers["content-type"]);   // works

  // ── content-type carries parameters ───────────────────────
  const type = req.headers["content-type"] ?? "";
  console.log("exact match:  ", type === "application/json");        // false
  console.log("startsWith:   ", type.startsWith("application/json")); // true
  //   "application/json; charset=utf-8" is perfectly valid

  // ── set-cookie is an array, others are joined ─────────────
  console.log("accept-language:", req.headers["accept-language"]);
  //   repeated headers are comma-joined...
  //   ...except set-cookie, which is always an array

  // ── Content-Length is a claim, not a measurement ──────────
  console.log("claimed length:", req.headers["content-length"]);
  //   a client can send a different number from the bytes it
  //   actually sends. Never trust it as a size limit.

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
});

server.listen(0);
await once(server, "listening");
const { port } = server.address();

await fetch(\`http://localhost:\${port}/users?page=2\`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Accept-Language": "en-GB, ne",
  },
  body: JSON.stringify({ name: "Rajan" }),
});
// method: POST
// url:    /users?page=2
// Content-Type: undefined
// content-type: application/json; charset=utf-8
// exact match:   false
// startsWith:    true
// accept-language: en-GB, ne
// claimed length: 17


// ── req.headers.host is user input ──────────────────────────
// const url = new URL(req.url, \`http://\${req.headers.host}\`);
//
// A client can send any Host it likes. If you use that URL to
// build a link, a redirect or a password-reset email, you have
// let the client choose the domain. Validate it against an
// allowlist when it leaves your process.
//
// Day 6's lesson in a new place: nothing here is validated.

server.close();`,
      },
      keyTakeaways: [
        "`req.method` is always uppercase, so no normalising needed.",
        "<b>`req.url` is not a URL.</b> It has no protocol, host or port, only the path and query.",
        "That is because HTTP/1.1 sends the path on the request line and the host in a separate header.",
        "So parsing needs both: `new URL(req.url, \\`http://${req.headers.host}\\`)`.",
        "<b>Header keys are lowercased.</b> `req.headers[\"Content-Type\"]` is `undefined`.",
        "A repeated header is comma-joined, except <b>`set-cookie`, which is always an array</b>.",
        "`content-type` carries parameters, so `=== \"application/json\"` fails on `application/json; charset=utf-8`.",
        "Use `startsWith`, or parse the header properly.",
        "<b>Everything on `req` is client-controlled.</b> Nothing validates it, including Node.",
        "`req.headers.host` is user input, which matters when you build a URL from it.",
        "`Content-Length` is a <b>claim</b>, not a measurement. Count bytes as they arrive instead.",
      ],
      commonMistakes: [
        "<b>Reading `req.headers[\"Content-Type\"]`</b> — keys are lowercased, so you get `undefined`.",
        "<b>`req.headers[\"content-type\"] === \"application/json\"`</b> — fails on a valid request with a charset parameter.",
        "<b>Assuming every header is a string</b> — `set-cookie` is an array.",
        "<b>Treating `req.url` as a full URL</b> — it has no host, so `new URL(req.url)` throws.",
        "<b>Trusting `Content-Length` as a size limit</b> — it is a number the client chose.",
        "<b>Using `req.headers.host` in a link or redirect without validating it</b> — the client picks your domain.",
      ],
      quiz: [
        {
          question: "Why does `new URL(req.url)` throw?",
          options: [
            "`req.url` is not a string",
            "`req.url` has no protocol or host, only the path and query, so it is not absolute",
            "The URL API needs a port",
            "It only works with HTTPS",
          ],
          correctIndex: 1,
          explanation:
            "HTTP/1.1 sends only the path on the request line. The host arrives separately in the `Host` header, so you supply a base: `new URL(req.url, \\`http://${req.headers.host}\\`)`.",
        },
        {
          question: "`req.headers[\"content-type\"] === \"application/json\"` returns `false` on a valid JSON request. Why?",
          options: [
            "The header key is wrong",
            "`Content-Type` carries parameters, so the value can be `application/json; charset=utf-8`",
            "Node lowercases the value",
            "The client sent the wrong type",
          ],
          correctIndex: 1,
          explanation:
            "The parameter is legal and common. Use `startsWith(\"application/json\")` or parse the header rather than comparing exactly.",
        },
        {
          question: "Which request header is always an array rather than a string?",
          options: ["`accept`", "`set-cookie`", "`content-type`", "`host`"],
          correctIndex: 1,
          explanation:
            "Commas are legal inside a cookie value, so it cannot be comma-joined like the others. Code assuming a string breaks on the header most likely to repeat.",
        },
      ],
    },
    {
      id: "response-object",
      title: "The response object",
      durationMinutes: 10,
      explanation:
        "<b>Response object</b> (the object your server uses to construct the HTTP response).\n\n```javascript\nres.writeHead()\nres.write()\nres.end()\n```\n\n---\n\n## `res.writeHead()`\n\n<b>`writeHead()`</b> (sets the status code and headers).\n\n```javascript\nres.writeHead(200, {\n  \"Content-Type\": \"text/plain\"\n});\n```\n\n```text\nStatus: 200\nContent-Type: text/plain\n```\n\n---\n\n## About `writeHeader()`\n\nOlder code shows:\n\n```javascript\nres.writeHeader(...)\n```\n\nIt still exists on current Node as a deprecated alias, so it works and you should not use it. Prefer `res.writeHead()`, and do not copy old tutorials blindly.\n\n---\n\n## `res.write()`\n\n<b>`write()`</b> (writes part of the body).\n\n```javascript\nres.write(\"Hello \");\nres.write(\"Rajan\");\n```\n\nThe client receives:\n\n```text\nHello Rajan\n```\n\nYou can call it many times.\n\n---\n\n## `res.end()`\n\n<b>`end()`</b> (finishes the response).\n\n```javascript\nres.end(\"Hello World\");\n```\n\nor:\n\n```javascript\nres.write(\"Hello \");\nres.end(\"Rajan\");\n```\n\n```text\nwrite()\nwrite()\nwrite()\n  ↓\nend()\n  ↓\nResponse finished\n```\n\n---\n\n## `write()` vs `end()`\n\n```text\nres.write()\n    ↓\nsend more data\n\nres.end()\n    ↓\nwe are finished\n```\n\nThis matters most when streaming, and it is exactly Day 8's `Writable`: `res.write()` returns a boolean and `res.end()` is the same `end()` any Writable has. Which is why `pipeline(fileStream, res)` works, and why it calls `end()` for you.\n\n---\n\n## Headers must come first\n\nThe rule that produces the most confusing error here. Once any body byte has gone out, the headers are already on the wire and cannot change:\n\n```javascript\nres.write(\"hello\");\nres.writeHead(500);\n// ERR_HTTP_HEADERS_SENT\n```\n\nSo a handler that writes a partial response and <b>then</b> hits an error cannot turn it into a 500. It has already told the client 200.\n\nThat is worth knowing before the error-handling lesson: with a framework this shows up as \"Cannot set headers after they are sent to the client\", and the cause is always the same. Something wrote twice, or an async path continued after the response finished.\n\nA useful guard is `res.headersSent`, and a stricter habit: <b>one `end()` per request, on every path</b>. A missing `return` after an early `res.end()` is the usual cause.\n\n---\n\n## Forgetting `end()` hangs the request\n\nThe other failure. Without `end()`, Node keeps the connection open and the client waits until something times out. No error on your side, nothing in the logs, just a request that never finishes.\n\nSo every branch needs to end the response. That is one of the things a framework quietly does for you, and one reason the day's project is a useful exercise.",
      diagram: `Headers first, then body, then done

    res.writeHead(200, { ... })     headers
        ↓
    res.write(chunk)                body, any number of times
    res.write(chunk)
        ↓
    res.end()                       finished


Once a body byte goes out, headers are frozen

    res.write("hello")              headers already on the wire
    res.writeHead(500)              ✗ ERR_HTTP_HEADERS_SENT

    so a handler that writes a partial response and THEN
    fails cannot turn it into a 500. it already said 200.

    with a framework this reads:
      "Cannot set headers after they are sent to the client"

    cause is always the same: something wrote twice, or an
    async path continued after the response finished.

    guard with res.headersSent
    habit: ONE end() per request, on EVERY path
      └─ a missing return after an early res.end()
         is the usual cause


Forgetting end() hangs the request

    no end()
        ↓
    connection stays open
        ↓
    the client waits until something times out
        ↓
    no error on your side. nothing in the logs.
    just a request that never finishes.

    every branch must end the response.
    a framework quietly does this for you.


res is a Writable (Day 8)

    res.write(chunk)   → boolean, like any Writable
    res.end()          → the same end()

    which is why this works, and calls end() for you:
      await pipeline(fs.createReadStream(f), res)`,
      codeExample: {
        title: "Writing a response, and the two ways to break it",
        code: `import http from "node:http";
import { once } from "node:events";

const server = http.createServer((req, res) => {
  // ── The normal shape ──────────────────────────────────────
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Hello ");
    res.write("Rajan");
    res.end();
    return;                          // ← the return matters
  }

  // ── Headers are frozen once a body byte goes out ──────────
  if (req.url === "/too-late") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("partial response");

    try {
      res.writeHead(500);            // ✗
    } catch (error) {
      console.log("  writeHead after write:", error.code);
      // ERR_HTTP_HEADERS_SENT
    }
    res.end();
    return;
  }

  // ── The guard for an error mid-response ───────────────────
  if (req.url === "/failing") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write('{"partial":');

    // something goes wrong here
    if (res.headersSent) {
      console.log("  headers already sent, cannot send a 500");
      res.end('"truncated"}');       // best you can do
      return;
    }
  }

  // ── The missing return, which is the usual cause ──────────
  if (req.url === "/double") {
    res.writeHead(404);
    res.end("not found");
    // no return, so execution continues...
  }

  if (!res.writableEnded) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("fallthrough");
  } else {
    console.log("  already ended: the missing return was caught");
  }
});

server.listen(0);
await once(server, "listening");
const { port } = server.address();
const base = \`http://localhost:\${port}\`;

console.log("/        ", await (await fetch(\`\${base}/\`)).text());
console.log("/too-late", (await fetch(\`\${base}/too-late\`)).status);
console.log("/double  ", (await fetch(\`\${base}/double\`)).status);


// ── Forgetting end() hangs the request ──────────────────────
const hanging = http.createServer((req, res) => {
  res.writeHead(200);
  // no end(). the client waits until it times out.
});
hanging.listen(0);
await once(hanging, "listening");

try {
  await fetch(\`http://localhost:\${hanging.address().port}/\`, {
    signal: AbortSignal.timeout(200),
  });
} catch (error) {
  console.log("hanging request:", error.name);   // TimeoutError
}
//
// No error on the server. Nothing in the logs. Just a request
// that never finishes. Every branch must end the response.

server.close();
hanging.close();`,
      },
      keyTakeaways: [
        "`res.writeHead(status, headers)` sets the status and headers. `res.write()` sends body. `res.end()` finishes.",
        "`res.writeHeader()` still exists as a <b>deprecated alias</b>. It works, and you should not use it.",
        "<b>`res` is a Writable</b>, so `res.write()` returns a boolean and `pipeline(fileStream, res)` works.",
        "`pipeline` also calls `end()` for you.",
        "<b>Once a body byte goes out, the headers are frozen.</b> `writeHead` then throws `ERR_HTTP_HEADERS_SENT`.",
        "So a handler that writes a partial response and then fails cannot turn it into a 500.",
        "In a framework this reads \"Cannot set headers after they are sent\", and the cause is always the same.",
        "Guard with `res.headersSent`, and keep to <b>one `end()` per request on every path</b>.",
        "A missing `return` after an early `res.end()` is the usual cause of a double write.",
        "<b>Forgetting `end()` hangs the request</b>: no error, no log, the client just waits for a timeout.",
      ],
      commonMistakes: [
        "<b>Calling `writeHead` after `write`</b> — the headers are already on the wire.",
        "<b>Forgetting `return` after an early `res.end()`</b> — execution continues and writes again.",
        "<b>Forgetting `end()` on a branch</b> — the request hangs with nothing to show you why.",
        "<b>Trying to send a 500 after a partial body</b> — you already told the client 200.",
        "<b>Using `res.writeHeader()`</b> — a deprecated alias. Use `writeHead`.",
        "<b>Ignoring the boolean from `res.write()`</b> — it is a Writable, so Day 8's backpressure applies.",
      ],
      quiz: [
        {
          question: "You call `res.write(\"hello\")` then `res.writeHead(500)`. What happens?",
          options: [
            "The status is updated to 500",
            "`ERR_HTTP_HEADERS_SENT`, because the headers went out with the first body byte",
            "The body is discarded and 500 is sent",
            "Nothing, the second call is ignored",
          ],
          correctIndex: 1,
          explanation:
            "Headers are frozen once any body has been written. That is why a handler which fails mid-response cannot turn it into a 500: it already told the client 200.",
        },
        {
          question: "What happens if a branch of your handler never calls `res.end()`?",
          options: [
            "Node sends an empty 200 automatically",
            "The connection stays open and the client waits until something times out, with no server-side error",
            "A 500 is returned",
            "The request is retried",
          ],
          correctIndex: 1,
          explanation:
            "There is nothing in your logs to point at it. Ending the response on every path is one of the things a framework quietly does for you.",
        },
        {
          question: "What is the usual cause of \"Cannot set headers after they are sent\"?",
          options: [
            "A slow client",
            "A missing `return` after an early `res.end()`, so execution continues and writes again",
            "An invalid status code",
            "A malformed header name",
          ],
          correctIndex: 1,
          explanation:
            "Either that, or an async path continuing after the response finished. `res.headersSent` and `res.writableEnded` are the guards.",
        },
      ],
    },
    {
      id: "status-codes-and-json",
      title: "Status codes and sending JSON",
      durationMinutes: 10,
      explanation:
        "You do not need every status code. Know these.\n\n### `200 OK`\n\n```text\nGET /users\n→ 200\n```\n\n### `201 Created`\n\n```text\nPOST /users\n→ 201\n```\n\n### `204 No Content`\n\n```text\nDELETE /users/1\n→ 204\n```\n\n### `400 Bad Request`\n\n```text\nPOST /users\ninvalid JSON\n→ 400\n```\n\n### `401 Unauthorized`\n\n```text\nNo valid token\n→ 401\n```\n\n### `403 Forbidden`\n\n```text\nNormal user trying admin action\n→ 403\n```\n\n### `404 Not Found`\n\n```text\nGET /users/999\n→ 404\n```\n\n### `409 Conflict`\n\n```text\nCreating an email that already exists\n→ 409\n```\n\n### `422 Unprocessable Content`\n\nThe structure is valid but the data fails validation.\n\n### `500 Internal Server Error`\n\nSomething went wrong on the server.\n\n---\n\n## The distinctions that matter\n\nPhase 0 covered the categories. Three pairs are worth being precise about, because they are the ones people get wrong.\n\n<b>400 vs 422.</b> 400 means you could not understand the request at all: malformed JSON, a broken body. 422 means you understood it perfectly and the values are wrong: an empty name, an age of -5. Different fixes for the client, which is the whole point of distinguishing them.\n\n<b>401 vs 403.</b> 401 is \"I do not know who you are\", 403 is \"I know, and no\". Sending 403 to someone who never logged in leaves them with no idea they should sign in.\n\n<b>204 means no body.</b> Writing one is a protocol violation, and some clients will hang waiting for content the status said would not come. So `res.writeHead(204); res.end();` with nothing in it.\n\nAnd one rule that ties into Day 4: <b>a 500 should never carry your error message</b>. An unexpected failure means you do not know what leaked into that string. Log the detail, return something generic.\n\n---\n\n## Sending JSON\n\nFor:\n\n```json\n{\n  \"message\": \"Hello\"\n}\n```\n\ndo:\n\n```javascript\nconst body = JSON.stringify({\n  message: \"Hello\"\n});\n\nres.writeHead(200, {\n  \"Content-Type\": \"application/json\"\n});\n\nres.end(body);\n```\n\nThe important step:\n\n```javascript\nJSON.stringify()\n```\n\nA JavaScript object:\n\n```javascript\n{\n  message: \"Hello\"\n}\n```\n\nbecomes JSON text:\n\n```json\n{\"message\":\"Hello\"}\n```\n\nThat is Phase 0's JSON lesson, and its limits apply: a `Date` becomes a string, a `Map` becomes `{}`, and `undefined` fields disappear. So the shape you send is not always the shape you had.\n\n<b>The `Content-Type` is not optional.</b> Without it, a client guesses. `fetch`'s `response.json()` happens to work anyway, but browsers may render your JSON as plain text and some clients refuse to parse it. Set it every time.\n\nAnd since you will write those three lines for every response, the project's real lesson is to write the helper once:\n\n```javascript\nfunction json(res, status, body) {\n  const payload = JSON.stringify(body);\n  res.writeHead(status, {\n    \"Content-Type\": \"application/json\",\n    \"Content-Length\": Buffer.byteLength(payload),\n  });\n  res.end(payload);\n}\n```\n\nNote `Buffer.byteLength`, not `payload.length`. Day 7: the header is a <b>byte</b> count, and any non-ASCII character makes those two numbers differ. Getting it wrong truncates the response.",
      diagram: `The three pairs people get wrong

    400 vs 422
      400   I could not understand the request
              malformed JSON, a broken body
      422   I understood it, the VALUES are wrong
              empty name, age of -5
            └─ different fixes for the client, which
               is why they are separate codes

    401 vs 403
      401   I do not know who you are
      403   I know, and no
            └─ sending 403 to someone who never logged
               in leaves them no idea to sign in

    204 means NO BODY
      res.writeHead(204); res.end();
            └─ writing a body is a protocol violation,
               and some clients hang waiting for
               content the status said would not come


    and from Day 4:
      a 500 must NEVER carry your error message.
      you do not know what leaked into that string.
      log the detail, return something generic.


Sending JSON: three lines, every time

    const payload = JSON.stringify(body)

    res.writeHead(status, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    })                    └────────┬────────┘
                                   │
                        NOT payload.length

    Day 7: the header is a BYTE count. any non-ASCII
    character makes those two numbers differ, and
    getting it wrong truncates the response.


Content-Type is not optional

    without it, the client guesses.
      fetch's .json() happens to work
      browsers may render it as plain text
      some clients refuse to parse it

    set it every time.


    and JSON.stringify's limits apply (Phase 0):
      Date       → a string
      Map        → {}
      undefined  → the field disappears

    the shape you send is not always the shape you had.`,
      codeExample: {
        title: "A json helper, and the codes that matter",
        code: `import http from "node:http";
import { once } from "node:events";

// ── Write this helper once, not per route ───────────────────
function json(res, status, body) {
  const payload = JSON.stringify(body);

  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
    //                └─ BYTES, not payload.length. Day 7.
  });
  res.end(payload);
}

// the length difference, demonstrated
const ascii = JSON.stringify({ name: "Rajan" });
const utf8 = JSON.stringify({ name: "नमस्ते" });
console.log("ascii:", ascii.length, "chars /", Buffer.byteLength(ascii), "bytes");
console.log("utf8: ", utf8.length, "chars /", Buffer.byteLength(utf8), "bytes");
// ascii: 17 chars / 17 bytes
// utf8:  20 chars / 38 bytes      ← a wrong header truncates it


const users = [{ id: 1, name: "Rajan" }];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // 200: here it is
  if (method === "GET" && url === "/users") return json(res, 200, users);

  // 404: no such thing
  if (method === "GET" && url === "/users/999") {
    return json(res, 404, { error: "User not found" });
  }

  // 201: created, and where to find it
  if (method === "POST" && url === "/users") {
    const created = { id: 2, name: "Sita" };
    res.writeHead(201, {
      "Content-Type": "application/json",
      Location: \`/users/\${created.id}\`,
    });
    return res.end(JSON.stringify(created));
  }

  // 204: no body at all
  if (method === "DELETE" && url === "/users/1") {
    res.writeHead(204);
    return res.end();                    // ← nothing here
  }

  // 400: could not understand the request
  if (url === "/bad-json") {
    return json(res, 400, { error: "Invalid JSON" });
  }

  // 422: understood it, the values are wrong
  if (url === "/bad-values") {
    return json(res, 422, {
      error: "Validation failed",
      fields: { name: "must not be empty" },
    });
  }

  // 401 vs 403
  if (url === "/no-token") return json(res, 401, { error: "Not authenticated" });
  if (url === "/wrong-role") return json(res, 403, { error: "Not allowed" });

  // 500: generic, never your error message
  if (url === "/boom") {
    const error = new Error("connection string: postgres://user:pass@...");
    console.error("UNEXPECTED", error);              // ← the detail, logged
    return json(res, 500, { error: "Internal error" });  // ← generic, sent
  }

  json(res, 404, { error: "Not found" });
});

server.listen(0);
await once(server, "listening");
const base = \`http://localhost:\${server.address().port}\`;

for (const path of ["/users", "/users/999", "/bad-values", "/no-token", "/boom"]) {
  const response = await fetch(base + path);
  console.log(response.status, path, await response.text());
}
// 200 /users [{"id":1,"name":"Rajan"}]
// 404 /users/999 {"error":"User not found"}
// 422 /bad-values {"error":"Validation failed","fields":{...}}
// 401 /no-token {"error":"Not authenticated"}
// 500 /boom {"error":"Internal error"}
//   the connection string stayed in the log

server.close();`,
      },
      keyTakeaways: [
        "<b>400 vs 422</b>: 400 means the request was unintelligible, 422 means it was understood and the values are wrong.",
        "<b>401 vs 403</b>: 401 is \"I do not know you\", 403 is \"I know you and no\".",
        "<b>204 means no body.</b> Writing one is a protocol violation and some clients hang.",
        "A <b>500 must never carry your error message</b>. Log the detail, return something generic.",
        "Sending JSON is `JSON.stringify`, a `Content-Type` header, and `res.end`.",
        "<b>`Content-Type` is not optional.</b> Without it clients guess, and some refuse to parse.",
        "`JSON.stringify`'s limits from Phase 0 apply: `Date` becomes a string, `Map` becomes `{}`, `undefined` disappears.",
        "Use <b>`Buffer.byteLength(payload)`</b> for `Content-Length`, never `payload.length`.",
        "Day 7: the header is a byte count, and non-ASCII makes those numbers differ. Getting it wrong truncates.",
        "Write the `json(res, status, body)` helper once. You will need it on every route.",
      ],
      commonMistakes: [
        "<b>Using 400 for a validation failure</b> — 422 says you understood the request and the values were wrong.",
        "<b>Sending 403 to an unauthenticated user</b> — they have no idea they should sign in.",
        "<b>Writing a body with a 204</b> — a protocol violation, and some clients wait for content that never comes.",
        "<b>Returning `error.message` with a 500</b> — you do not know what is in that string.",
        "<b>Omitting `Content-Type`</b> — the client guesses, and browsers may render your JSON as text.",
        "<b>`Content-Length: payload.length`</b> — a character count, not a byte count. Non-ASCII truncates the response.",
        "<b>Repeating `writeHead` plus `stringify` in every route</b> — write the helper once.",
      ],
      quiz: [
        {
          question: "A request has valid JSON but an empty `name` field. Which status?",
          options: ["400", "422", "409", "500"],
          correctIndex: 1,
          explanation:
            "You understood the request perfectly and the values are wrong, which is 422. 400 is for a request you could not parse at all. The distinction tells the client which thing to fix.",
        },
        {
          question: "Why use `Buffer.byteLength(payload)` for `Content-Length` rather than `payload.length`?",
          options: [
            "It is faster",
            "The header is a byte count, and any non-ASCII character makes the two numbers differ, which truncates the response",
            "`payload.length` is undefined for strings",
            "It handles compression",
          ],
          correctIndex: 1,
          explanation:
            "Day 7's lesson: characters are not bytes. A response containing an accent or any non-Latin script gets cut short if you send the character count.",
        },
        {
          question: "What should a 500 response body contain?",
          options: [
            "`error.message`, so the client can debug",
            "Something generic, with the detail logged server-side",
            "The full stack trace",
            "Nothing at all",
          ],
          correctIndex: 1,
          explanation:
            "An unexpected failure means you do not know what leaked into that message: a connection string, a file path, part of a query. Day 4's rule applied to HTTP.",
        },
      ],
    },
    {
      id: "reading-the-body",
      title: "Reading the request body",
      durationMinutes: 12,
      explanation:
        "Here it gets interesting. The request body is a <b>stream</b>.\n\nRemember Day 8:\n\n```text\nHTTP Request\n     ↓\nReadable Stream\n```\n\nSo you cannot do:\n\n```javascript\nconst body = req.body;\n```\n\nwith raw `node:http`. You collect chunks.\n\n---\n\n## Reading JSON manually\n\n```javascript\nlet body = \"\";\n\nfor await (const chunk of req) {\n  body += chunk;\n}\n\nconst data = JSON.parse(body);\n```\n\n```text\nHTTP request\n    ↓\nchunks\n    ↓\nstring\n    ↓\nJSON.parse()\n    ↓\nJavaScript object\n```\n\nThat works, and it has a bug you have already met. `body += chunk` calls `toString()` on each chunk independently, so a multi-byte character split across a chunk boundary is corrupted. Day 7's exact problem.\n\nCollect Buffers and decode once instead:\n\n```javascript\nconst chunks = [];\nfor await (const chunk of req) chunks.push(chunk);\nconst body = Buffer.concat(chunks).toString(\"utf8\");\n```\n\nNo boundaries left by the time you decode. Or use Day 8's `text(req)` from `node:stream/consumers`, which handles it for you.\n\n---\n\n## Why this gets annoying\n\nYou also have to think about:\n\n```text\nInvalid JSON\nEmpty body\nHuge body\nWrong Content-Type\nRequest timeout\nClient disconnects\nMalformed data\n```\n\n```javascript\ntry {\n  const data = JSON.parse(body);\n} catch {\n  res.writeHead(400);\n  res.end(\"Invalid JSON\");\n}\n```\n\nAnd what if someone sends:\n\n```text\n10 GB JSON\n```\n\nYou do not want to concatenate all of that into memory.\n\n---\n\n## Body size limits\n\nA production server should limit body size:\n\n```text\nRequest\n   ↓\nHow large?\n   ↓\nToo large?\n   ├── Yes → 413 Payload Too Large\n   └── No  → Continue\n```\n\nThe critical detail: <b>count bytes as they arrive</b>, do not read `Content-Length`. That header is a claim, and a client can send a small number followed by gigabytes. Checking it and then reading anyway is the check-then-use race from Day 6 in a new form.\n\n```javascript\nlet size = 0;\nfor await (const chunk of req) {\n  size += chunk.length;\n  if (size > MAX) {\n    res.writeHead(413);\n    res.end();\n    req.destroy();\n    return;\n  }\n  chunks.push(chunk);\n}\n```\n\nAnd `req.destroy()` matters. Without it you have responded but the client keeps sending, so you are still reading a body you have already rejected.\n\nOne more: an empty body is `\"\"`, and `JSON.parse(\"\")` throws. A `POST` with no body is common enough that this is a real 500 if you skip the check.\n\n---\n\n## Why frameworks exist\n\nWriting this yourself teaches you a lot. But imagine it per endpoint:\n\n```text\nParse URL\nParse query\nParse headers\nParse cookies\nParse body\nValidate body\nHandle errors\nMatch route\nSet status\nSet headers\nSerialize JSON\nHandle authentication\nHandle CORS\nHandle body limits\nHandle middleware\n```\n\nThat is a lot of plumbing.\n\n> <b>Learning raw `node:http` shows you what frameworks are actually doing for you.</b>\n\nAnd the useful realisation is which of those are <b>correctness</b> rather than convenience. Routing and JSON serialising are convenience: tedious, hard to get wrong. The body reading is where the real bugs are, and this lesson has four of them: the multi-byte split, the trusted `Content-Length`, the missing `destroy()` and the empty body. That is why `express.json({ limit })` is one line and worth using.",
      diagram: `The body is a stream, so Day 7 and 8 both apply

    ✗ let body = ""
      for await (const chunk of req) body += chunk

      toString() per chunk
        └─ a multi-byte character split across a
           boundary is CORRUPTED
           Day 7's exact problem

    ✓ const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      Buffer.concat(chunks).toString("utf8")

      no boundaries left by the time you decode

    ✓ await text(req)        node:stream/consumers
                             handles it for you


Never trust Content-Length

    Content-Length: 50
        └─ a CLAIM. the client can then send 10 GB.

    checking the header and reading anyway is Day 6's
    check-then-use race in a new form.

    count bytes AS THEY ARRIVE:

      let size = 0
      for await (const chunk of req) {
        size += chunk.length
        if (size > MAX) {
          res.writeHead(413); res.end()
          req.destroy()        ← or the client keeps
          return                 sending to a body you
        }                        already rejected
        chunks.push(chunk)
      }


Four real bugs live in this one function

    1  multi-byte split across chunks
    2  trusting Content-Length
    3  missing req.destroy() after a 413
    4  JSON.parse("") on an empty body  →  throws

    which is why express.json({ limit }) is one line
    and worth using.


Convenience vs correctness

    routing            tedious, hard to get wrong
    JSON serialising   tedious, hard to get wrong
    body reading       where the actual bugs are

    a framework saves you typing on the first two and
    saves you BUGS on the third.`,
      codeExample: {
        title: "Reading a body safely, with all four traps handled",
        code: `import http from "node:http";
import { once } from "node:events";
import { text } from "node:stream/consumers";

const MAX_BODY = 1024 * 100;          // 100KB

// ── The version with all four traps handled ─────────────────
async function readJson(req, res) {
  // trap 4: wrong content type
  const type = req.headers["content-type"] ?? "";
  if (!type.startsWith("application/json")) {
    res.writeHead(415, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Expected application/json" }));
    return { ok: false };
  }

  const chunks = [];
  let size = 0;

  // trap 2: count bytes as they arrive, ignore Content-Length
  for await (const chunk of req) {
    size += chunk.length;

    if (size > MAX_BODY) {
      res.writeHead(413, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Payload too large" }));
      req.destroy();                  // trap 3: stop the client sending
      return { ok: false };
    }
    chunks.push(chunk);
  }

  // trap 1: decode once, not per chunk
  const body = Buffer.concat(chunks).toString("utf8");

  // trap 4: an empty body is "" and JSON.parse("") throws
  if (body.length === 0) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Empty body" }));
    return { ok: false };
  }

  try {
    return { ok: true, data: JSON.parse(body) };
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid JSON" }));
    return { ok: false };
  }
}


const server = http.createServer(async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405).end();
    return;
  }

  const result = await readJson(req, res);
  if (!result.ok) return;             // the helper already responded

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ id: 2, ...result.data }));
});

server.listen(0);
await once(server, "listening");
const base = \`http://localhost:\${server.address().port}\`;

const post = (body, headers = { "Content-Type": "application/json" }) =>
  fetch(base, { method: "POST", headers, body });

for (const [label, response] of [
  ["valid     ", await post('{"name":"Rajan"}')],
  ["invalid   ", await post("{not json")],
  ["empty     ", await post("")],
  ["wrong type", await post("hi", { "Content-Type": "text/plain" })],
  ["too large ", await post("x".repeat(200_000))],
]) {
  console.log(label, response.status, await response.text());
}
// valid      201 {"id":2,"name":"Rajan"}
// invalid    400 {"error":"Invalid JSON"}
// empty      400 {"error":"Empty body"}
// wrong type 415 {"error":"Expected application/json"}
// too large  413 {"error":"Payload too large"}


// ── The naive version, and its bug ──────────────────────────
// let body = "";
// for await (const chunk of req) body += chunk;
//
// Each += calls toString() on that chunk alone, so a
// multi-byte character split across a boundary becomes
// replacement characters. Day 7, exactly.


// ── Or let stream/consumers do it ───────────────────────────
// const body = await text(req);
//   decodes correctly, but reads the WHOLE body with no
//   size limit. Day 8: fine when bounded, not for uploads.

server.close();`,
      },
      keyTakeaways: [
        "The request body is a <b>Readable stream</b>. There is no `req.body` in raw `node:http`.",
        "`body += chunk` corrupts multi-byte characters split across a chunk boundary. Day 7's bug.",
        "Collect Buffers and `Buffer.concat(chunks).toString(\"utf8\")` instead, or use `text(req)`.",
        "<b>Never trust `Content-Length`.</b> It is a claim, and the client can send far more.",
        "Count bytes <b>as they arrive</b> and reject past your limit with 413.",
        "Checking the header then reading anyway is Day 6's check-then-use race in a new form.",
        "<b>Call `req.destroy()`</b> after a 413, or the client keeps sending to a body you rejected.",
        "An empty body is `\"\"`, and `JSON.parse(\"\")` throws. A `POST` with no body is common.",
        "`Content-Type` may carry parameters, so check it with `startsWith`, and return 415 when it is wrong.",
        "Frameworks save you <b>typing</b> on routing and serialising, and save you <b>bugs</b> on body reading.",
        "That is why `express.json({ limit })` is one line and worth using.",
      ],
      commonMistakes: [
        "<b>`body += chunk` in a loop</b> — decodes each chunk separately and corrupts split characters.",
        "<b>Trusting `Content-Length` for a size check</b> — the client chose that number.",
        "<b>Responding 413 without `req.destroy()`</b> — you keep receiving a body you already rejected.",
        "<b>`JSON.parse(body)` with no try/catch</b> — malformed input becomes a 500 instead of a 400.",
        "<b>Not handling an empty body</b> — `JSON.parse(\"\")` throws, and a bodyless POST is common.",
        "<b>Comparing `content-type` exactly</b> — a charset parameter makes a valid request fail.",
        "<b>`await text(req)` on an upload endpoint</b> — correct decoding, no size limit.",
      ],
      quiz: [
        {
          question: "Why is `let body = \"\"; for await (const chunk of req) body += chunk;` buggy?",
          options: [
            "It is too slow",
            "Each `+=` decodes that chunk alone, so a multi-byte character split across a boundary is corrupted",
            "`req` is not iterable",
            "It misses the last chunk",
          ],
          correctIndex: 1,
          explanation:
            "Day 7's chunk-boundary problem, arriving in a request handler. Collect Buffers and decode once, or use `text(req)` from `node:stream/consumers`.",
        },
        {
          question: "Why should a body size limit count bytes rather than read `Content-Length`?",
          options: [
            "`Content-Length` is often missing",
            "It is a claim the client chose, so a small value can be followed by gigabytes",
            "It is measured in characters",
            "Node does not expose it",
          ],
          correctIndex: 1,
          explanation:
            "Checking the header and then reading anyway is Day 6's check-then-use race in a new form. Count as the bytes arrive and reject with 413.",
        },
        {
          question: "You respond 413 but the request keeps arriving. What is missing?",
          options: [
            "A `Connection: close` header",
            "`req.destroy()`, to stop the client sending a body you already rejected",
            "`res.end()`",
            "A shorter timeout",
          ],
          correctIndex: 1,
          explanation:
            "Responding does not stop the upload. Without destroying the request you continue receiving data you have no intention of using.",
        },
      ],
    },
    {
      id: "routing-and-url",
      title: "Routing, URL and URLSearchParams",
      durationMinutes: 12,
      explanation:
        "## Routing by hand\n\n```javascript\nif (\n  req.method === \"GET\" &&\n  req.url === \"/users\"\n) {\n  // users\n}\n```\n\n```javascript\nif (\n  req.method === \"GET\" &&\n  req.url === \"/products\"\n) {\n  // products\n}\n```\n\nThis works, and gets ugly fast.\n\nIt is also <b>wrong in a way that is easy to miss</b>: `req.url === \"/users\"` fails for `/users?page=2`, because `req.url` includes the query string. Which is the first reason to parse rather than compare.\n\n---\n\n## Use `URL`\n\n```javascript\nconst url = new URL(\n  req.url,\n  `http://${req.headers.host}`\n);\n```\n\nNow you have:\n\n```javascript\nurl.pathname\nurl.searchParams\nurl.hostname\nurl.port\n```\n\nFor:\n\n```text\n/users?page=2&limit=10\n```\n\n```text\npathname\n/users\n\nsearchParams\npage=2\nlimit=10\n```\n\nThe second argument is required because `req.url` is not absolute, as the request lesson covered. And `req.headers.host` is client-controlled, so if that URL ever leaves your process, in a redirect or an email link, validate the host against an allowlist.\n\n`URL` also <b>decodes percent-encoding</b> for you, which hand-splitting does not. `/users/John%20Doe` gives you `John Doe` in `pathname`.\n\n---\n\n## `URLSearchParams`\n\n<b>`URLSearchParams`</b> (an API for reading and building query parameters).\n\n```javascript\nconst url = new URL(\n  req.url,\n  `http://${req.headers.host}`\n);\n\nconst page =\n  url.searchParams.get(\"page\");\n\nconst limit =\n  url.searchParams.get(\"limit\");\n```\n\nFor `/users?page=2&limit=10`:\n\n```text\npage  → \"2\"\nlimit → \"10\"\n```\n\n> Query parameters are strings.\n\n```javascript\nconst page = Number(\n  url.searchParams.get(\"page\")\n);\n```\n\nThree details worth knowing. A missing parameter is <b>`null`</b>, not `undefined`, and `Number(null)` is `0` rather than `NaN`, so a missing `page` silently becomes page zero. Use `??` with a default before converting.\n\nA repeated parameter needs `getAll()`. `?tag=a&tag=b` gives you only `\"a\"` from `get()`.\n\nAnd a present-but-empty parameter, `?page=`, is `\"\"`, which `Number` turns into `0` as well. Day 3's `??` versus `||` distinction lands here exactly.\n\n---\n\n## `URLPattern`\n\n<b>`URLPattern`</b> (an API for matching URLs against patterns).\n\n```text\n/users/:id\n```\n\nmatched against:\n\n```text\n/users/123\n```\n\nIt is available as a global on current Node, and it removes the string-slicing that dynamic routes otherwise need:\n\n```javascript\nconst pattern = new URLPattern({ pathname: \"/users/:id\" });\nconst match = pattern.exec(url);\n\nmatch.pathname.groups.id;   // \"123\"\n```\n\n---\n\n## A manual router\n\n```javascript\nconst url = new URL(\n  req.url,\n  `http://${req.headers.host}`\n);\n\nif (\n  req.method === \"GET\" &&\n  url.pathname === \"/users\"\n) {\n  // GET /users\n} else if (\n  req.method === \"POST\" &&\n  url.pathname === \"/users\"\n) {\n  // POST /users\n} else {\n  res.writeHead(404);\n  res.end(\"Not Found\");\n}\n```\n\nFine for learning. Imagine a hundred routes.\n\nAnd notice the two things this shape gets wrong, because they are exactly what a router gives you.\n\nA path that exists with a <b>different method</b> should be <b>405 Method Not Allowed</b>, not 404. `DELETE /users` is not \"no such thing\", it is \"not that way\", and the difference tells the client whether to fix the path or the verb.\n\nAnd the `else if` chain has no notion of <b>specificity</b>. Add `/users/:id` and `/users/me` and the order you wrote them in decides which wins, silently.\n\nA router handles both by construction. That is the honest answer to \"what does a framework give me\": not the `if` statements, but the correctness rules you would not have thought to write.",
      diagram: `The first bug in hand-rolled routing

    req.url === "/users"

    GET /users            ✓ matches
    GET /users?page=2     ✗ does NOT match
                            req.url includes the query

    which is the first reason to parse rather than compare


new URL needs a base, and gives you more

    new URL(req.url, \`http://\${req.headers.host}\`)
                      └────────┬────────┘
                    required: req.url is not absolute
                    and this is CLIENT-CONTROLLED
                      └─ validate the host if the URL
                         ever leaves your process

    url.pathname        "/users"
    url.searchParams    page=2, limit=10

    and it DECODES percent-encoding:
      /users/John%20Doe  →  pathname has "John Doe"
      hand-splitting does not


Query params: three traps

    MISSING is null, not undefined
      Number(null)  →  0      not NaN
        └─ a missing ?page silently becomes page zero
           use ?? with a default BEFORE converting

    REPEATED needs getAll()
      ?tag=a&tag=b
        get("tag")     →  "a"        only the first
        getAll("tag")  →  ["a","b"]

    PRESENT BUT EMPTY is ""
      ?page=   →  ""   →  Number("")  →  0
        └─ Day 3's ?? versus || lands here exactly


What the else-if chain gets WRONG

    405, not 404
      DELETE /users
        └─ the path exists, the method does not.
           404 says "no such thing".
           405 says "not that way".
           the client needs to know which to fix.

    no notion of SPECIFICITY
      /users/:id  and  /users/me
        └─ the order you wrote them decides which
           wins. silently.

    a router handles both BY CONSTRUCTION.

    which is the honest answer to "what does a
    framework give me": not the if statements, but
    the correctness rules you would not have
    thought to write.`,
      codeExample: {
        title: "A router, and the rules it gets right for you",
        code: `import http from "node:http";
import { once } from "node:events";

const users = [{ id: 1, name: "Rajan" }, { id: 2, name: "Sita" }];

const json = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, \`http://\${req.headers.host}\`);

  // ── Query params, with the traps handled ──────────────────
  if (url.pathname === "/users") {
    if (req.method === "GET") {
      const raw = url.searchParams.get("page");
      console.log("raw page:", JSON.stringify(raw), "| Number:", Number(raw));
      //   missing → null → Number(null) is 0, not NaN
      //   empty   → ""   → Number("")   is 0 too

      const page = Number(raw ?? "1") || 1;      // ?? then a guard
      const tags = url.searchParams.getAll("tag");   // repeated params

      return json(res, 200, { page, tags, users });
    }

    if (req.method === "POST") return json(res, 201, { id: 3 });

    // ── 405, not 404: the path exists, the method does not ──
    res.writeHead(405, { Allow: "GET, POST" });
    return res.end();
  }

  // ── Dynamic routes with URLPattern ────────────────────────
  const userPattern = new URLPattern({ pathname: "/users/:id" });
  const match = userPattern.exec(url);

  if (match) {
    const { id } = match.pathname.groups;
    console.log("matched id:", id);

    const user = users.find((u) => u.id === Number(id));
    return user
      ? json(res, 200, user)
      : json(res, 404, { error: "User not found" });
  }

  json(res, 404, { error: "Not found" });
});

server.listen(0);
await once(server, "listening");
const base = \`http://localhost:\${server.address().port}\`;

for (const [method, path] of [
  ["GET", "/users"],
  ["GET", "/users?page=2&tag=a&tag=b"],
  ["GET", "/users?page="],
  ["GET", "/users/1"],
  ["GET", "/users/99"],
  ["DELETE", "/users"],
]) {
  const response = await fetch(base + path, { method });
  console.log(method.padEnd(6), path.padEnd(28), response.status);
}
// GET    /users                       200
// GET    /users?page=2&tag=a&tag=b    200
// GET    /users?page=                 200
// GET    /users/1                     200
// GET    /users/99                    404
// DELETE /users                       405      ← not 404


// ── The bug the naive version has ───────────────────────────
// if (req.url === "/users") { ... }
//
// GET /users          ✓
// GET /users?page=2   ✗   req.url includes the query
//
// url.pathname is what you meant.


// ── And the specificity problem ─────────────────────────────
// /users/:id   and   /users/me
//
// In an else-if chain, whichever you wrote first wins. A
// router sorts by specificity so /users/me matches before
// /users/:id, which is a correctness rule you would not
// have thought to write.

server.close();`,
      },
      keyTakeaways: [
        "`req.url === \"/users\"` <b>fails for `/users?page=2`</b>, because `req.url` includes the query.",
        "`new URL(req.url, base)` gives you `pathname` and `searchParams`. The base is required.",
        "`req.headers.host` is client-controlled. Validate it if the URL leaves your process.",
        "`URL` also <b>decodes percent-encoding</b>, which hand-splitting does not.",
        "Query parameters are strings, and a missing one is <b>`null`</b>, not `undefined`.",
        "`Number(null)` is <b>0</b>, not `NaN`, so a missing `page` silently becomes page zero.",
        "`?page=` is `\"\"`, which `Number` also turns into 0. Day 3's `??` versus `||` applies exactly.",
        "A repeated parameter needs `getAll()`. `get()` returns only the first.",
        "`URLPattern` is a global on current Node and handles `/users/:id` without string slicing.",
        "A path that exists with a different method should be <b>405, not 404</b>.",
        "An `else if` chain has no notion of <b>specificity</b>, so `/users/:id` and `/users/me` depend on write order.",
        "That is the honest answer to what a framework gives you: not the `if` statements, but the correctness rules.",
      ],
      commonMistakes: [
        "<b>Comparing `req.url` to a path</b> — any query string makes it fail.",
        "<b>`new URL(req.url)` with no base</b> — `req.url` is not absolute, so it throws.",
        "<b>`Number(url.searchParams.get(\"page\"))`</b> — a missing param is `null`, which becomes 0.",
        "<b>`get()` on a repeated parameter</b> — you silently lose every value but the first.",
        "<b>Returning 404 for a wrong method</b> — 405 tells the client to fix the verb, not the path.",
        "<b>Relying on `else if` order for overlapping routes</b> — specificity is not something a chain understands.",
        "<b>Hand-splitting a path with `split(\"/\")`</b> — you lose percent-decoding that `URL` does for free.",
      ],
      quiz: [
        {
          question: "Why does `if (req.url === \"/users\")` fail for `GET /users?page=2`?",
          options: [
            "`req.url` is lowercased",
            "`req.url` includes the query string, so it is `/users?page=2`",
            "The comparison needs `startsWith`",
            "It does not fail",
          ],
          correctIndex: 1,
          explanation:
            "`url.pathname` is what you meant. That is the first reason to parse rather than compare, before you get to dynamic routes.",
        },
        {
          question: "`Number(url.searchParams.get(\"page\"))` where `page` is absent. What do you get?",
          options: ["`NaN`", "`0`", "`undefined`", "`null`"],
          correctIndex: 1,
          explanation:
            "A missing parameter is `null`, and `Number(null)` is 0 rather than `NaN`. So a missing page silently becomes page zero. Apply `?? \"1\"` before converting.",
        },
        {
          question: "A client sends `DELETE /users` and you only handle GET and POST. What should you return?",
          options: ["404", "405 with an `Allow` header", "400", "501"],
          correctIndex: 1,
          explanation:
            "The path exists, the method does not. 404 says \"no such thing\" and sends the client looking for a typo in the path instead of the verb.",
        },
      ],
    },
    {
      id: "fetch-and-clients",
      title: "Making requests with fetch",
      durationMinutes: 12,
      explanation:
        "## `fetch()`\n\nNode includes it. You do not need `node-fetch`.\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users\"\n);\n```\n\n```javascript\nconst data = await response.json();\n```\n\n---\n\n## What powers it\n\n> <b>Undici</b> (Node's modern HTTP client implementation).\n\nYou rarely touch Undici directly. Use `fetch()`.\n\n---\n\n## Checking HTTP errors\n\nA common mistake:\n\n```javascript\nconst response = await fetch(url);\n\nconst data = await response.json();\n```\n\n`fetch()` does <b>not</b> throw for:\n\n```text\n404\n500\n```\n\nCheck:\n\n```javascript\nif (!response.ok) {\n  throw new Error(\n    `HTTP ${response.status}`\n  );\n}\n```\n\nthen:\n\n```javascript\nconst data = await response.json();\n```\n\nThis is worth being blunt about because of what happens without the check. A 500 usually returns an <b>HTML error page</b>, and `response.json()` on HTML throws a parse error. So your logs fill with `Unexpected token '<'`, which tells you nothing about the actual failure. You debug a JSON problem for an hour before realising the upstream was down.\n\n`fetch` only rejects for <b>network-level</b> failures: DNS, connection refused, a timeout. Any response, however bad, is a resolved promise. That is deliberate: the request succeeded, the answer was just unwelcome.\n\nAnd `response.ok` is exactly `status >= 200 && status < 300`. A redirect that was not followed is not `ok`.\n\n---\n\n## Fetch timeout\n\n```javascript\nconst response = await fetch(\n  url,\n  {\n    signal: AbortSignal.timeout(5000)\n  }\n);\n```\n\n<b>`AbortSignal.timeout()`</b> (a signal that aborts after a given number of milliseconds).\n\n```text\n5000 ms\n   ↓\n5 seconds\n```\n\nIf it has not completed:\n\n```text\nAbort\n ↓\nfetch rejects\n```\n\nThis matters more than it looks. <b>`fetch` has no default timeout.</b> A hung upstream means your request hangs too, holding a socket and a handler indefinitely, and enough of those exhausts your capacity while nothing looks broken. A timeout on every outbound call is not optional in a server.\n\nThe rejection is a `TimeoutError`, distinct from the `AbortError` you get from a manual `controller.abort()`. Check `error.name` to tell a timeout from a cancellation, and remember Day 3's point that neither is a real failure.\n\n---\n\n## Handling it all\n\n```javascript\ntry {\n  const response = await fetch(\n    url,\n    {\n      signal: AbortSignal.timeout(5000)\n    }\n  );\n\n  if (!response.ok) {\n    throw new Error(\n      `HTTP ${response.status}`\n    );\n  }\n\n  const data = await response.json();\n\n} catch (error) {\n  console.error(error);\n}\n```\n\nNow you handle:\n\n```text\nNetwork error\nTimeout\nHTTP error\nInvalid response\n```\n\n---\n\n## Retries\n\nSometimes requests fail temporarily.\n\n```text\nYour server\n    ↓\nExternal API\n    ↓\ntemporary network failure\n```\n\nDo not blindly retry everything.\n\n```text\nGET\n```\n\nis easier to retry safely than:\n\n```text\nPOST /charge-card\n```\n\nbecause repeating a POST can perform the operation twice.\n\n```javascript\nfor (let attempt = 1; attempt <= 3; attempt++) {\n  try {\n    const response = await fetch(url);\n\n    if (response.ok) {\n      return response;\n    }\n  } catch (error) {\n    if (attempt === 3) {\n      throw error;\n    }\n  }\n}\n```\n\nReal systems also consider:\n\n```text\nExponential backoff\nJitter\nRetryable status codes\nIdempotency\nMaximum attempts\nTimeouts\n```\n\nThe word behind all of that is <b>idempotent</b>: safe to repeat. `GET` and `DELETE` are, `POST` usually is not, which is why payment APIs take an idempotency key.\n\nTwo things about the loop above. It retries a <b>500</b>, which is right, and also a <b>400</b>, which is pointless: a malformed request will be malformed next time too. Retry 429, 502, 503, 504 and network errors, and nothing else.\n\nAnd it retries <b>immediately</b>. Three instant attempts against a struggling service make things worse, and if every client does it you have built a thundering herd. <b>Exponential backoff with jitter</b> is what stops that: wait 100ms, then 200ms, then 400ms, each with a small random offset so clients do not retry in lockstep.\n\n---\n\n## Why you usually do not need axios\n\nOlder projects used:\n\n```text\naxios\nnode-fetch\nrequest\n```\n\nToday `fetch()` covers ordinary calls, so you can skip a dependency. Honestly though: axios gives you interceptors, automatic JSON, and throwing on non-2xx out of the box. If you find yourself writing all three of those wrappers by hand, the dependency was not the enemy.",
      diagram: `fetch does not throw on 404 or 500

    fetch REJECTS only for network-level failures
      DNS failure, connection refused, timeout

    any RESPONSE resolves, however bad
      └─ deliberate: the request succeeded,
         the answer was just unwelcome

    response.ok  ===  status >= 200 && status < 300


Why the missing check hurts so specifically

    upstream returns 500
        ↓
    the body is an HTML error page
        ↓
    await response.json()
        ↓
    "Unexpected token '<'"
        ↓
    you debug a JSON problem for an hour before
    realising the upstream was down


fetch has NO default timeout

    hung upstream
        ↓
    your request hangs too
        ↓
    a socket and a handler held indefinitely
        ↓
    enough of those exhausts your capacity while
    nothing looks broken

    a timeout on every outbound call is not optional.

      signal: AbortSignal.timeout(5000)

    and tell the two apart:
      TimeoutError   AbortSignal.timeout fired
      AbortError     you called controller.abort()
        └─ Day 3: neither is a real failure


Retries: two things the obvious loop gets wrong

    RETRIES THE WRONG CODES
      500  retry     ✓  might be transient
      400  retry     ✗  malformed now, malformed later

      retry: 429, 502, 503, 504, network errors
      nothing else

    RETRIES IMMEDIATELY
      three instant attempts at a struggling service
      make it worse

      and if EVERY client does it, that is a
      thundering herd

      exponential backoff + jitter:
        100ms → 200ms → 400ms, each with a small
        random offset so clients do not retry
        in lockstep


    the word behind all of it: IDEMPOTENT, safe to
    repeat. GET and DELETE are. POST usually is not,
    which is why payment APIs take an idempotency key.`,
      codeExample: {
        title: "A fetch wrapper worth having",
        code: `import http from "node:http";
import { once } from "node:events";

// ── A test server that misbehaves on demand ─────────────────
let attempts = 0;
const server = http.createServer((req, res) => {
  if (req.url === "/html-500") {
    res.writeHead(500, { "Content-Type": "text/html" });
    return res.end("<html><body>Internal Server Error</body></html>");
  }
  if (req.url === "/slow") return;                 // never responds
  if (req.url === "/flaky") {
    attempts += 1;
    if (attempts < 3) {
      res.writeHead(503).end();
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end('{"ok":true}');
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end('{"ok":true}');
});

server.listen(0);
await once(server, "listening");
const base = \`http://localhost:\${server.address().port}\`;


// ── fetch does not throw on 500 ─────────────────────────────
const bad = await fetch(\`\${base}/html-500\`);
console.log("status:", bad.status, "| ok:", bad.ok);        // 500 | false
//   the promise RESOLVED. no error.

try {
  await bad.json();
} catch (error) {
  console.log("json() on HTML:", error.message.slice(0, 40));
  // Unexpected token '<' ...
}
//
// This is why the missing !response.ok check hurts: your logs
// fill with a JSON parse error that says nothing about the
// upstream being down.


// ── No default timeout ──────────────────────────────────────
try {
  await fetch(\`\${base}/slow\`);                    // would hang forever
} catch { /* unreachable without a signal */ }
//   ↑ commented out in spirit: that call never returns.

try {
  await fetch(\`\${base}/slow\`, { signal: AbortSignal.timeout(200) });
} catch (error) {
  console.log("with a timeout:", error.name);      // TimeoutError
}

const manual = new AbortController();
setTimeout(() => manual.abort(), 50);
try {
  await fetch(\`\${base}/slow\`, { signal: manual.signal });
} catch (error) {
  console.log("manual abort:  ", error.name);      // AbortError
}
//   different names, so you can tell a timeout from a
//   cancellation. Day 3: neither is a real failure.


// ── The wrapper ─────────────────────────────────────────────
const RETRYABLE = new Set([429, 502, 503, 504]);

async function request(url, { retries = 3, timeoutMs = 5000, ...init } = {}) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (response.ok) return await response.json();

      // retry only what might succeed next time
      if (!RETRYABLE.has(response.status) || attempt === retries) {
        throw new Error(\`HTTP \${response.status} from \${url}\`);
      }
    } catch (error) {
      if (error.name === "AbortError") throw error;   // deliberate
      if (attempt === retries) throw error;
    }

    // backoff with jitter, so clients do not retry in lockstep
    const delay = 100 * 2 ** (attempt - 1) + Math.random() * 50;
    await new Promise((r) => setTimeout(r, delay));
    console.log(\`  retry \${attempt + 1} after \${Math.round(delay)}ms\`);
  }
}

console.log("flaky result:", await request(\`\${base}/flaky\`));
//   retry 2 after 118ms
//   retry 3 after 231ms
// flaky result: { ok: true }

try {
  await request(\`\${base}/html-500\`, { retries: 3 });
} catch (error) {
  console.log("500 not retried:", error.message.slice(0, 20));
}
//   a 500 is not in RETRYABLE here, so it fails immediately
//   rather than hammering a broken upstream three times

server.close();`,
      },
      keyTakeaways: [
        "`fetch` is built in. You do not need `node-fetch`, and it is powered by <b>Undici</b>.",
        "<b>`fetch` does not throw on 404 or 500.</b> Any response resolves, however bad.",
        "It rejects only for network-level failures: DNS, connection refused, timeout.",
        "Without the `!response.ok` check, a 500's HTML body makes `response.json()` throw `Unexpected token '<'`.",
        "So you debug a JSON problem instead of noticing the upstream was down.",
        "`response.ok` is exactly `status >= 200 && status < 300`.",
        "<b>`fetch` has no default timeout.</b> A hung upstream holds a socket and a handler indefinitely.",
        "`AbortSignal.timeout(ms)` is not optional on an outbound call in a server.",
        "A timeout gives `TimeoutError`, a manual abort gives `AbortError`. Check `error.name`.",
        "Retry only what might succeed: <b>429, 502, 503, 504</b> and network errors. Retrying a 400 is pointless.",
        "Retry with <b>exponential backoff and jitter</b>, or every client retrying in lockstep is a thundering herd.",
        "<b>Idempotent</b> means safe to repeat. `GET` and `DELETE` are, `POST` usually is not.",
        "Honestly: if you write interceptors, auto-JSON and throw-on-error by hand, axios was not the enemy.",
      ],
      commonMistakes: [
        "<b>`await response.json()` with no `!response.ok` check</b> — a 500's HTML body gives you a useless parse error.",
        "<b>Assuming `fetch` throws on a 404</b> — only network failures reject.",
        "<b>No timeout on an outbound call</b> — a hung upstream holds your resources indefinitely.",
        "<b>Retrying a 400 or 404</b> — the request will be just as wrong next time.",
        "<b>Retrying immediately</b> — three instant attempts make a struggling service worse.",
        "<b>Retrying without jitter</b> — every client retries in lockstep, which is a thundering herd.",
        "<b>Retrying a `POST` blindly</b> — you may charge the card twice. Use an idempotency key.",
        "<b>Treating an `AbortError` as a failure to retry</b> — that was your own cancellation.",
      ],
      quiz: [
        {
          question: "An upstream returns a 500 with an HTML error page and you skip the `!response.ok` check. What do you see in your logs?",
          options: [
            "`HTTP 500`",
            "A JSON parse error like `Unexpected token '<'`, which says nothing about the upstream being down",
            "A network error",
            "Nothing",
          ],
          correctIndex: 1,
          explanation:
            "`fetch` resolved, so the only failure comes from parsing HTML as JSON. That is why the missing check costs you real debugging time.",
        },
        {
          question: "Which status codes are worth retrying?",
          options: [
            "All 4xx and 5xx",
            "429, 502, 503, 504 and network errors",
            "Only 500",
            "Any code, with enough attempts",
          ],
          correctIndex: 1,
          explanation:
            "Those signal a transient condition. A 400 or 404 will be exactly as wrong on the next attempt, so retrying it just adds load.",
        },
        {
          question: "Why add jitter to exponential backoff?",
          options: [
            "It reduces total wait time",
            "Without it, every client retries in lockstep and hits the recovering service simultaneously",
            "It avoids DNS caching",
            "It is required by HTTP",
          ],
          correctIndex: 1,
          explanation:
            "Synchronised retries are a thundering herd: the service comes back up and is immediately knocked over again. A small random offset spreads them out.",
        },
      ],
    },
    {
      id: "https-http2-connections",
      title: "HTTPS, HTTP/2 and connection reuse",
      durationMinutes: 10,
      explanation:
        "## `node:https`\n\n```javascript\nimport https from \"node:https\";\n```\n\nHTTPS is:\n\n```text\nHTTP\n +\nTLS\n```\n\n---\n\n## What is TLS?\n\n<b>TLS</b> (Transport Layer Security, the protocol that encrypts and authenticates network communication).\n\n```text\nHTTP\n ↓\nTLS\n ↓\nHTTPS\n```\n\nWithout it:\n\n```text\nClient ← plain network data → Server\n```\n\nWith it:\n\n```text\nClient\n   ↕\nEncrypted connection\n   ↕\nServer\n```\n\nTLS provides:\n\n```text\nEncryption\nAuthentication\nIntegrity\n```\n\nThose three are worth separating. <b>Encryption</b> stops someone reading it. <b>Authentication</b> proves the server is who it claims, which is what a certificate is for. <b>Integrity</b> proves nobody altered it in transit. Encryption alone would let an attacker impersonate the server perfectly, which is why the certificate matters as much as the cipher.\n\n---\n\n## HTTP vs HTTPS\n\n```text\nHTTP\n ↓\nPort 80 commonly\n\nHTTPS\n ↓\nPort 443 commonly\n ↓\nTLS encryption\n```\n\nYou do not normally implement TLS yourself. A reverse proxy handles it:\n\n```text\nInternet\n   ↓\nHTTPS\n   ↓\nLoad Balancer / Reverse Proxy\n   ↓\nHTTP\n   ↓\nNode\n```\n\nWhich has a practical consequence worth knowing. Behind a proxy, your Node process sees <b>plain HTTP from a local address</b>. So `req.socket.remoteAddress` is the proxy, not the user, and `req.headers.host` may not be the public domain. The real values arrive in `X-Forwarded-For` and `X-Forwarded-Proto`.\n\nAnd those are just headers, so a client can send them. Trust them only when you know a proxy you control set them, which is what Express's `trust proxy` setting is about.\n\n---\n\n## HTTP/2\n\n```javascript\nimport http2 from \"node:http2\";\n```\n\n<b>HTTP/2</b> (a newer version supporting features such as multiplexing multiple streams over one connection).\n\nHTTP/1.1:\n\n```text\nConnection\n ├── Request\n ├── Response\n ├── Request\n └── Response\n```\n\nHTTP/2:\n\n```text\n             Connection\n          ┌─────┼─────┐\n          ↓     ↓     ↓\n       Stream Stream Stream\n          1     2     3\n```\n\n---\n\n## Why it matters\n\n<b>Multiplexing</b> (sending multiple independent request/response streams over one connection).\n\n```text\nConnection\n   ├── Request A\n   ├── Request B\n   └── Request C\n```\n\nThey share the connection, which improves network efficiency.\n\nThe problem it solves has a name: <b>head-of-line blocking</b>. On HTTP/1.1 a connection handles one request at a time, so a slow response holds up everything queued behind it. Browsers worked around this by opening six connections per host, which is why HTTP/2 mattered so much for page loads.\n\nFor a backend, though, be honest about the priority. If your Node service sits behind a proxy that terminates HTTP/2 and speaks HTTP/1.1 to you, `node:http2` is not something you need. It matters when you are the edge, or for gRPC, which is built on it.\n\n---\n\n## Keep-alive\n\nFour requests, each opening a new TCP connection:\n\n```text\nconnect\nrequest\nresponse\nclose\n\nconnect\nrequest\nresponse\nclose\n```\n\nExpensive.\n\n<b>Keep-alive</b> (keeping a connection open so it can be reused).\n\n```text\nTCP connection\n      │\n      ├── Request 1\n      ├── Request 2\n      ├── Request 3\n      └── Request 4\n```\n\nLess setup overhead.\n\nHow much less is the point. A new connection costs a TCP handshake, one round trip, and for HTTPS a TLS handshake on top, one or two more. Across a datacentre that is a few milliseconds; across the internet it can be a hundred. On a reused connection it is <b>zero</b>.\n\nSo for a service making many calls to the same upstream, keep-alive is often the largest easy win available, and it costs nothing but configuration.\n\nAlso: this is exactly why Day 4's graceful shutdown needed `closeIdleConnections()`. Keep-alive connections sit open by design, and `server.close()` waits for them.\n\n---\n\n## Connection pooling\n\n<b>Connection pooling</b> (maintaining reusable connections so requests share them instead of creating one each time).\n\n```text\nHTTP Client\n     ↓\nConnection Pool\n ┌────┬────┬────┐\n ↓    ↓    ↓\n C1   C2   C3\n```\n\nNode's modern client stack, including `fetch` and Undici, manages this for you.\n\nWorth knowing that the pool has a <b>size</b>, and that it is a limit on concurrency you did not choose. Fire a thousand `fetch` calls at one host and they queue behind the available connections. So a slow upstream can make your own requests queue even though nothing in your code says so, which is a genuinely confusing performance problem the first time you meet it.",
      diagram: `TLS gives you three separate things

    encryption       nobody can read it
    authentication   the server is who it claims
                       └─ this is what the CERTIFICATE is for
    integrity        nobody altered it in transit

    encryption alone would let an attacker impersonate
    the server perfectly. the certificate matters as
    much as the cipher.


Behind a proxy, your process sees a lie

    Internet ──HTTPS──► Proxy ──HTTP──► Node

    req.socket.remoteAddress   the PROXY, not the user
    req.headers.host           maybe not the public domain

    the real values arrive as headers:
      X-Forwarded-For
      X-Forwarded-Proto

    and those are just headers, so a CLIENT can send
    them. trust them only when a proxy you control set
    them. (Express's "trust proxy" setting.)


HTTP/2 solves head-of-line blocking

    HTTP/1.1: one request at a time per connection
      ██slow request██──────► then B ──► then C
                              │
                        B and C wait on A

      browsers worked around it by opening SIX
      connections per host

    HTTP/2: streams share one connection
      ├── stream 1
      ├── stream 2
      └── stream 3

    but be honest for a backend:
      proxy terminates HTTP/2, speaks 1.1 to you
        └─ node:http2 is not something you need

      it matters when YOU are the edge, or for gRPC


Keep-alive: the largest easy win, usually

    NEW connection
      TCP handshake        1 round trip
      TLS handshake        1-2 more   (HTTPS)
                             └─ a few ms in a datacentre
                                up to 100ms over the internet

    REUSED connection
      zero

    for a service making many calls to one upstream,
    that is enormous, and it costs only configuration.

    also why Day 4's shutdown needed
    closeIdleConnections(): keep-alive connections sit
    open by design and server.close() waits for them.


The pool is a concurrency limit you did not choose

    1000 fetch calls to one host
        ↓
    they queue behind the available connections
        ↓
    a slow upstream makes YOUR requests queue,
    though nothing in your code says so

    a genuinely confusing performance problem the
    first time you meet it.`,
      codeExample: {
        title: "Connection reuse, measured",
        code: `import http from "node:http";
import { once } from "node:events";
import { Agent } from "undici";

// ── A server that reports whether the socket was reused ─────
const seen = new Set();
const server = http.createServer((req, res) => {
  const id = \`\${req.socket.remoteAddress}:\${req.socket.remotePort}\`;
  const reused = seen.has(id);
  seen.add(id);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ reused, sockets: seen.size }));
});

server.listen(0);
await once(server, "listening");
const base = \`http://localhost:\${server.address().port}\`;


// ── fetch reuses connections by default ─────────────────────
for (let i = 1; i <= 4; i += 1) {
  const response = await fetch(base);
  console.log(\`request \${i}:\`, await response.json());
}
// request 1: { reused: false, sockets: 1 }
// request 2: { reused: true,  sockets: 1 }
// request 3: { reused: true,  sockets: 1 }
// request 4: { reused: true,  sockets: 1 }
//
// One socket for four requests. Undici pools them for you.
//
// A new connection costs a TCP handshake, plus a TLS
// handshake for HTTPS. A reused one costs nothing.


// ── The pool size is a concurrency limit ────────────────────
const limited = new Agent({ connections: 2 });

const results = await Promise.all(
  Array.from({ length: 6 }, () =>
    fetch(base, { dispatcher: limited }).then((r) => r.json()),
  ),
);
console.log("with connections: 2 →", results.at(-1));
//   six concurrent requests, at most two sockets. The rest
//   queued, though nothing in the code said so.
//
// Which is why a slow upstream can make your own requests
// queue: a confusing performance problem the first time.


// ── Behind a proxy, the socket lies ─────────────────────────
server.removeAllListeners("request");
server.on("request", (req, res) => {
  const direct = req.socket.remoteAddress;
  const forwarded = req.headers["x-forwarded-for"];
  const proto = req.headers["x-forwarded-proto"] ?? "http";

  console.log("socket says: ", direct);        // the proxy
  console.log("header says: ", forwarded);     // the user, allegedly
  console.log("protocol:    ", proto);

  res.writeHead(200).end();
});

await fetch(base, {
  headers: {
    "X-Forwarded-For": "203.0.113.9",
    "X-Forwarded-Proto": "https",
  },
});
// socket says:  ::1
// header says:  203.0.113.9
// protocol:     https
//
// I sent those headers myself. A client can too. Trust them
// only when a proxy you control set them, which is what
// Express's "trust proxy" is about.


// ── And Day 4's connection reason ───────────────────────────
// Keep-alive means idle connections sit open, so
// server.close() waits for them. That is why graceful
// shutdown needed server.closeIdleConnections().

server.closeIdleConnections?.();
server.close();`,
      },
      keyTakeaways: [
        "HTTPS is HTTP plus <b>TLS</b>, which gives encryption, authentication and integrity.",
        "Those are separate: encryption hides it, the <b>certificate</b> proves who the server is, integrity proves nothing changed.",
        "Encryption without authentication would let an attacker impersonate the server perfectly.",
        "You rarely implement TLS. A reverse proxy terminates it and speaks plain HTTP to Node.",
        "So <b>`req.socket.remoteAddress` is the proxy</b>, not the user, and the host header may not be public.",
        "The real values come in `X-Forwarded-For` and `X-Forwarded-Proto`, which are <b>just headers a client can send</b>.",
        "Trust them only when a proxy you control set them. That is what Express's `trust proxy` is for.",
        "<b>HTTP/2 multiplexing</b> solves head-of-line blocking, where a slow response holds up everything behind it.",
        "For a backend behind an HTTP/2-terminating proxy, `node:http2` is usually not something you need.",
        "<b>Keep-alive</b> removes a TCP handshake and, for HTTPS, a TLS handshake per request.",
        "That is a few milliseconds in a datacentre and up to a hundred over the internet, for only configuration.",
        "It is also why Day 4's graceful shutdown needed `closeIdleConnections()`.",
        "The <b>connection pool has a size</b>, which is a concurrency limit you did not choose.",
      ],
      commonMistakes: [
        "<b>Trusting `req.socket.remoteAddress` behind a proxy</b> — you log the load balancer for every request.",
        "<b>Trusting `X-Forwarded-For` unconditionally</b> — any client can send it. Configure which proxies you trust.",
        "<b>Assuming encryption alone makes a connection safe</b> — without the certificate check, anyone can be the server.",
        "<b>Reaching for `node:http2` behind a proxy that already terminates it</b> — you gain nothing.",
        "<b>Disabling keep-alive to \"free connections\"</b> — you pay a handshake per request instead.",
        "<b>Firing a thousand concurrent `fetch` calls at one host</b> — they queue behind the pool size.",
        "<b>Forgetting `closeIdleConnections()` on shutdown</b> — keep-alive holds the server open, as in Day 4.",
      ],
      quiz: [
        {
          question: "Behind a reverse proxy, what does `req.socket.remoteAddress` give you?",
          options: [
            "The client's IP address",
            "The proxy's address, since that is who actually connected to Node",
            "`undefined`",
            "The load balancer's public hostname",
          ],
          correctIndex: 1,
          explanation:
            "The user's address arrives in `X-Forwarded-For`, which is a header any client can send. Trust it only when a proxy you control is the one setting it.",
        },
        {
          question: "What does keep-alive actually save per request?",
          options: [
            "Bandwidth on the response body",
            "A TCP handshake, plus a TLS handshake for HTTPS, which is a few milliseconds locally and up to a hundred over the internet",
            "JSON parsing time",
            "Nothing measurable",
          ],
          correctIndex: 1,
          explanation:
            "For a service making many calls to the same upstream that is often the largest easy win available, and it costs only configuration.",
        },
        {
          question: "Why can a slow upstream make your own concurrent requests queue?",
          options: [
            "Node limits outbound requests",
            "The connection pool has a fixed size, so requests wait for an available connection",
            "The event loop blocks",
            "DNS lookups serialise",
          ],
          correctIndex: 1,
          explanation:
            "The pool is a concurrency limit you did not choose. It is a genuinely confusing performance problem the first time you hit it, because nothing in your code mentions a limit.",
        },
      ],
    },
    {
      id: "http-and-streams",
      title: "HTTP and streams together",
      durationMinutes: 10,
      explanation:
        "## Streaming a response\n\n```text\nHTTP request\n     ↓\nReadable stream\n```\n\nThe response can be streamed too. With `fetch()`:\n\n```javascript\nconst response = await fetch(url);\n\nfor await (const chunk of response.body) {\n  console.log(chunk);\n}\n```\n\nProcess data incrementally, instead of:\n\n```javascript\nconst data = await response.text();\n```\n\nwhich consumes the whole body.\n\nOne detail from Day 8: `response.body` is a <b>Web</b> `ReadableStream`, not a Node one. `for await` works on both, but to put it in a Node `pipeline` you need `Readable.fromWeb(response.body)`. That is the single most common reason those adapters exist.\n\n---\n\n## HTTP plus streams\n\nAn important connection between Day 8 and today.\n\nA client uploads:\n\n```text\nLarge file\n    ↓\nHTTP request\n    ↓\nReadable stream\n```\n\nYour server sends:\n\n```text\nLarge file\n    ↓\nHTTP response\n    ↓\nClient\n```\n\nBoth directions can stream:\n\n```text\nClient\n  ↓\nHTTP Request\n  ↓\nReadable\n  ↓\nTransform\n  ↓\nWritable / Storage\n```\n\nThat is how you handle large files without loading everything into memory.\n\n---\n\n## What this actually buys you\n\nDay 8's measurement applies directly. A buffered upload handler holds the whole file, so ten concurrent 500MB uploads is 5GB of memory and a dead process. A streamed one holds a chunk each, and the same ten uploads cost you almost nothing.\n\nWhich means <b>streaming is what decides how many concurrent uploads you can serve</b>, not your bandwidth. That is the concrete version of Day 8's argument.\n\nAnd the latency half applies too. `pipeline(fileStream, res)` sends the first bytes immediately, so a download starts playing or displaying before it has finished. `readFile` then `res.end` makes the user wait for all of it first, for identical total work.\n\n---\n\n## Three things to get right\n\n<b>Use `pipeline`, not `pipe`.</b> Day 8's reason unchanged: an error mid-stream with `pipe` is an unhandled `'error'` event that kills the process. With `res` as the destination that is a very reachable failure, because the client controls when the connection drops.\n\n<b>Expect the client to disconnect.</b> A cancelled download gives you `EPIPE` or `ERR_STREAM_PREMATURE_CLOSE`. It is normal traffic, not a bug, and `pipeline` also tears down the file read so you are not reading to nobody. Log it at debug.\n\n<b>Set the headers before you start.</b> Once the first chunk goes out you cannot change the status, as the response lesson covered. So a file that turns out to be missing must be checked before the pipeline begins, or you will be trying to send a 404 after already promising 200.\n\n---\n\n## The shape worth remembering\n\n```javascript\n// download\nawait pipeline(createReadStream(path), res);\n\n// upload\nawait pipeline(req, createWriteStream(path));\n\n// and a transform in the middle, since gzip is one\nawait pipeline(createReadStream(path), createGzip(), res);\n```\n\nThree lines that cover most of what a file-handling endpoint needs, and all three are Day 8 with `req` or `res` on one end.",
      diagram: `Streaming decides your concurrency, not bandwidth

    BUFFERED upload handler
      10 concurrent 500MB uploads
          ↓
      5 GB of memory
          ↓
      dead process

    STREAMED upload handler
      10 concurrent 500MB uploads
          ↓
      a chunk each
          ↓
      almost nothing

    that is the concrete version of Day 8's argument.


And the latency half applies too

    readFile then res.end
      ████████████ read ──► respond
                            │
                    the user waits for ALL of it

    pipeline(fileStream, res)
      ██─►██─►██─►
       │
       └─ first bytes go out immediately.
          the download starts displaying.

    identical total work.


Three things to get right

    USE pipeline, NOT pipe
      an error mid-stream with pipe is an unhandled
      "error" event → the process dies
        └─ very reachable here: the CLIENT controls
           when the connection drops

    EXPECT DISCONNECTS
      EPIPE / ERR_STREAM_PREMATURE_CLOSE
        └─ normal traffic, not a bug. log at debug.
           pipeline also tears down the file read.

    HEADERS BEFORE THE FIRST CHUNK
      once a byte goes out the status is frozen
        └─ so check the file exists BEFORE the
           pipeline starts, or you will try to send
           a 404 having already promised 200


The three lines worth remembering

    download   await pipeline(createReadStream(p), res)
    upload     await pipeline(req, createWriteStream(p))
    gzipped    await pipeline(createReadStream(p),
                              createGzip(), res)

    all three are Day 8 with req or res on one end.


One Day 8 detail

    response.body from fetch is a WEB ReadableStream

    for await          works on both
    Node pipeline      needs Readable.fromWeb(body)`,
      codeExample: {
        title: "Upload and download, streamed",
        code: `import http from "node:http";
import fs from "node:fs";
import { once } from "node:events";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { createGzip } from "node:zlib";
import { stat } from "node:fs/promises";

const server = http.createServer(async (req, res) => {
  // ══ UPLOAD: request → file ═══════════════════════════════
  if (req.method === "POST" && req.url === "/upload") {
    try {
      await pipeline(req, fs.createWriteStream("uploaded.bin"));
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end('{"ok":true}');
    } catch (error) {
      if (error.code === "ERR_STREAM_PREMATURE_CLOSE") {
        console.log("  client aborted the upload");   // normal
        return;
      }
      throw error;
    }
    return;
  }

  // ══ DOWNLOAD: file → response ════════════════════════════
  if (req.method === "GET" && req.url === "/download") {
    // check BEFORE the pipeline: once a byte goes out the
    // status is frozen, so a 404 is no longer possible
    let size;
    try {
      ({ size } = await stat("uploaded.bin"));
    } catch {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end('{"error":"Not found"}');
    }

    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Length": size,
    });

    try {
      await pipeline(fs.createReadStream("uploaded.bin"), res);
    } catch (error) {
      // the client closing a tab mid-download is normal traffic
      if (["EPIPE", "ERR_STREAM_PREMATURE_CLOSE"].includes(error.code)) {
        console.log("  client disconnected mid-download");
        return;
      }
      throw error;
    }
    return;
  }

  // ══ GZIPPED: a Transform in the middle ═══════════════════
  if (req.url === "/download.gz") {
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "gzip",
    });
    await pipeline(fs.createReadStream("uploaded.bin"), createGzip(), res);
    return;
  }

  res.writeHead(404).end();
});

server.listen(0);
await once(server, "listening");
const base = \`http://localhost:\${server.address().port}\`;


// ── Upload something ────────────────────────────────────────
const payload = Buffer.alloc(1024 * 512, "x");        // 512KB
const up = await fetch(\`\${base}/upload\`, { method: "POST", body: payload });
console.log("upload:", up.status, await up.text());


// ── Download it, streamed ───────────────────────────────────
const down = await fetch(\`\${base}/download\`);
console.log("download status:", down.status);

let received = 0;
for await (const chunk of down.body) received += chunk.length;
console.log("received:", received, "bytes");
//
// down.body is a WEB ReadableStream. for await works, but a
// Node pipeline needs Readable.fromWeb(down.body).


// ── Streaming a download straight to disk ───────────────────
const gz = await fetch(\`\${base}/download.gz\`);
await pipeline(
  Readable.fromWeb(gz.body),                    // ← the adapter
  fs.createWriteStream("downloaded.gz"),
);
console.log("gz on disk:", fs.statSync("downloaded.gz").size, "bytes");
//
// The alternative, await gz.arrayBuffer(), would hold the
// whole download in memory.


// ── The buffered version, and why it does not scale ─────────
// app.post("/upload", async (req, res) => {
//   const data = await buffer(req);        // the WHOLE file
//   await writeFile("out.bin", data);
// });
//
// 10 concurrent 500MB uploads = 5GB of memory. The streamed
// version holds a chunk each. Streaming is what decides how
// many concurrent uploads you can serve.

server.close();
fs.rmSync("uploaded.bin", { force: true });
fs.rmSync("downloaded.gz", { force: true });`,
      },
      keyTakeaways: [
        "Both directions of HTTP are streams, so Day 8 applies to uploads and downloads alike.",
        "A buffered upload handler holds the whole file. Ten concurrent 500MB uploads is 5GB and a dead process.",
        "<b>Streaming is what decides your concurrent upload capacity</b>, not bandwidth.",
        "`pipeline(fileStream, res)` sends the first bytes immediately, so a download starts displaying sooner.",
        "<b>Use `pipeline`, not `pipe`.</b> With `res` as the destination, a mid-stream error is very reachable.",
        "The client controls when the connection drops, so that failure path is normal traffic.",
        "A disconnect gives `EPIPE` or `ERR_STREAM_PREMATURE_CLOSE`. Log it at debug, not error.",
        "`pipeline` also tears down the file read, so you are not reading to nobody.",
        "<b>Set headers before the first chunk.</b> Check the file exists before the pipeline starts.",
        "Otherwise you are trying to send a 404 having already promised 200.",
        "`response.body` from `fetch` is a <b>Web</b> stream. A Node `pipeline` needs `Readable.fromWeb`.",
        "Three lines cover most file endpoints: file to `res`, `req` to file, and a gzip Transform in the middle.",
      ],
      commonMistakes: [
        "<b>Buffering an upload with `await buffer(req)`</b> — memory scales with concurrent uploads times file size.",
        "<b>Using `pipe` with `res`</b> — a client disconnect becomes an unhandled `'error'` event.",
        "<b>Logging a client disconnect as an error</b> — aborted downloads are ordinary traffic.",
        "<b>Starting the pipeline before checking the file exists</b> — you can no longer send a 404.",
        "<b>Piping `fetch`'s `response.body` into a Node stream directly</b> — it is a Web stream. Convert it.",
        "<b>`await response.arrayBuffer()` for a large download</b> — the whole thing goes into memory.",
        "<b>Setting `Content-Length` from a stale `stat`</b> — a mismatch truncates or hangs the response.",
      ],
      quiz: [
        {
          question: "Why does streaming decide how many concurrent uploads you can serve?",
          options: [
            "It uses less bandwidth",
            "A buffered handler holds each whole file, so memory scales with concurrency times file size",
            "It is faster per request",
            "It avoids the event loop",
          ],
          correctIndex: 1,
          explanation:
            "Ten concurrent 500MB uploads is 5GB buffered and roughly nothing streamed. That is Day 8's memory argument in its most concrete form.",
        },
        {
          question: "Why must you check whether a file exists before starting `pipeline(fileStream, res)`?",
          options: [
            "`pipeline` requires it",
            "Once the first chunk goes out the status is frozen, so you can no longer send a 404",
            "The file could change size",
            "It avoids a race condition",
          ],
          correctIndex: 1,
          explanation:
            "You would already have promised 200. Checking first is the only way to send a proper 404, and it is the response lesson's rule arriving in a real handler.",
        },
        {
          question: "You want to stream a `fetch` download straight to disk. What do you need?",
          options: [
            "Nothing, pipe `response.body` directly",
            "`Readable.fromWeb(response.body)`, since a fetch body is a Web ReadableStream",
            "`response.arrayBuffer()` first",
            "A Transform stream",
          ],
          correctIndex: 1,
          explanation:
            "The two stream APIs differ. Without the adapter the obvious move is `arrayBuffer()`, which holds the whole download in memory and defeats the point.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is `http.createServer(handler)` actually doing?",
      options: [
        "Something with no plain equivalent",
        "Attaching a `'request'` listener, because the server is an EventEmitter",
        "Creating a stream pipeline",
        "Binding a port",
      ],
      correctIndex: 1,
      explanation:
        "Day 9's mechanism. Which also means `'connection'`, `'close'`, `'error'` and `'clientError'` are all available on the same object.",
    },
    {
      question: "Why does `new URL(req.url)` throw?",
      options: [
        "`req.url` is not a string",
        "It has no protocol or host, only the path and query, so it is not absolute",
        "It needs a port",
        "URL requires HTTPS",
      ],
      correctIndex: 1,
      explanation:
        "HTTP/1.1 sends only the path on the request line, with the host in a separate header. Hence `new URL(req.url, \\`http://${req.headers.host}\\`)`.",
    },
    {
      question: "You call `res.write(\"hello\")` then `res.writeHead(500)`. What happens?",
      options: [
        "The status becomes 500",
        "`ERR_HTTP_HEADERS_SENT`, because the headers went out with the first body byte",
        "The body is discarded",
        "Nothing",
      ],
      correctIndex: 1,
      explanation:
        "Which is why a handler that fails after writing a partial response cannot turn it into a 500. It already told the client 200.",
    },
    {
      question: "Why is `let body = \"\"; for await (const c of req) body += c;` buggy?",
      options: [
        "It is slow",
        "Each `+=` decodes that chunk alone, corrupting a multi-byte character split across a boundary",
        "`req` is not iterable",
        "It misses the last chunk",
      ],
      correctIndex: 1,
      explanation:
        "Day 7's chunk-boundary bug in a request handler. Collect Buffers and decode once, or use `text(req)`.",
    },
    {
      question: "Why should a body size limit count bytes rather than read `Content-Length`?",
      options: [
        "The header is often missing",
        "It is a claim the client chose, so a small value can be followed by gigabytes",
        "It counts characters",
        "Node hides it",
      ],
      correctIndex: 1,
      explanation:
        "Day 6's check-then-use race in a new form. Count as bytes arrive, reject with 413, and call `req.destroy()`.",
    },
    {
      question: "A request has valid JSON but an empty `name`. Which status?",
      options: ["400", "422", "409", "500"],
      correctIndex: 1,
      explanation:
        "You understood the request and the values are wrong. 400 is for a body you could not parse at all, and the difference tells the client what to fix.",
    },
    {
      question: "An upstream returns a 500 with an HTML body and you skip `!response.ok`. What do your logs show?",
      options: [
        "`HTTP 500`",
        "A JSON parse error like `Unexpected token '<'`, which says nothing about the upstream",
        "A network error",
        "Nothing",
      ],
      correctIndex: 1,
      explanation:
        "`fetch` resolved, so the only failure is parsing HTML as JSON. That is the concrete cost of the missing check.",
    },
    {
      question: "Behind a reverse proxy, what does `req.socket.remoteAddress` give you?",
      options: [
        "The client's IP",
        "The proxy's address, since that is who connected to Node",
        "`undefined`",
        "The public hostname",
      ],
      correctIndex: 1,
      explanation:
        "The user's address is in `X-Forwarded-For`, which any client can send. Trust it only when a proxy you control set it.",
    },
    {
      question: "Why does streaming decide your concurrent upload capacity?",
      options: [
        "It uses less bandwidth",
        "A buffered handler holds each whole file, so memory scales with concurrency times file size",
        "Streams are faster",
        "It avoids the event loop",
      ],
      correctIndex: 1,
      explanation:
        "Ten concurrent 500MB uploads is 5GB buffered and roughly nothing streamed. Day 8's argument, in the place it matters most.",
    },
  ],
  project: {
    name: "day-10",
    goal: "Build a small JSON API with only node:http, then write down every piece of plumbing a framework would have given you.",
    brief:
      "Three routes, no framework. The routing and the JSON serialising are tedious and hard to get wrong. The body reading is where the real bugs are, and there are four of them: decoding each chunk separately corrupts split characters, Content-Length is a claim you cannot trust, a 413 without req.destroy() keeps receiving the body you rejected, and JSON.parse(\"\") throws on an empty POST. Handle all four and you will understand exactly what express.json({ limit }) is doing in one line.",
    steps: [
      "Create `day-10/` with `package.json` containing `\"type\": \"module\"`, and a `server.js`.",
      "Write a `json(res, status, body)` helper that sets `Content-Type` and a `Content-Length` from `Buffer.byteLength`.",
      "Parse the request with `new URL(req.url, \\`http://${req.headers.host}\\`)` and route on `url.pathname`, not `req.url`.",
      "Implement `GET /users` returning the array with 200.",
      "Implement `GET /users/:id` using `URLPattern`, returning the user or a 404.",
      "Implement `POST /users`: read the body from the stream, parse it, and return the created user with 201.",
      "In the body reader, collect Buffers and decode once, cap the size by counting bytes, call `req.destroy()` on a 413, and handle an empty body.",
      "Return 405 with an `Allow` header when the path exists but the method does not.",
      "Test each path with `fetch`, including invalid JSON, an empty body, a wrong content type and an oversized body.",
    ],
    acceptance: [
      "`GET /users` returns 200 with a JSON array and a correct `Content-Type`.",
      "`GET /users/1` returns the user and `GET /users/999` returns 404, both as JSON.",
      "`POST /users` with a valid body returns 201 and the created object.",
      "`GET /users?page=2` still routes correctly, which proves you matched on `pathname` rather than `req.url`.",
      "Invalid JSON returns 400, not a 500 or a crash.",
      "An empty `POST` body returns 400 rather than throwing from `JSON.parse(\"\")`.",
      "A body over your limit returns 413, and `req.destroy()` stops the client sending more.",
      "The size limit works by counting bytes as they arrive, not by reading `Content-Length`.",
      "`DELETE /users` returns 405 with an `Allow` header, not 404.",
      "`Content-Length` uses `Buffer.byteLength`, and a response containing non-ASCII text is not truncated.",
      "A written list of every manual step, with the framework feature that replaces each one.",
    ],
    stretch: [
      "Add `GET /users/:id/avatar` that streams a file with `pipeline`, and handle the client disconnecting mid-download.",
      "Add `POST /users/:id/avatar` that streams the request body to disk, with a size cap.",
      "Add a request logger that prints method, path, status and duration, and notice you have just written middleware.",
      "Add an outbound `fetch` to another service with `AbortSignal.timeout` and a retry that only retries 429, 502, 503 and 504.",
      "Send a response with a Nepali or Japanese name and confirm it truncates if you use `payload.length` for `Content-Length`.",
      "Count how many lines of your server are plumbing rather than business logic, then write the same API in Express and compare.",
    ],
  },
};
