import type { LessonDay } from "@/lib/learn/lesson-types";

 export const HTTP_DAY_4_LESSONS: LessonDay = {
 day: 4,
 title: "HTTP Fundamentals",
 totalMinutes: 125,
 difficulty: "Beginner",
 lessons: [
 {
 id: "http-methods-status-codes",
 title: "HTTP requests, responses, methods, and status codes",
 durationMinutes: 25,
 explanation: `HTTP is the protocol that allows clients and servers to communicate over a network using a structured <b>request and response</b> model.

 When a client wants something from a server, it sends an <b>HTTP request</b>. A request normally contains an HTTP method, a target URL, headers, and sometimes a request body. The server receives the request, processes it, and sends an <b>HTTP response</b> containing a status code, response headers, and sometimes a response body.

 The HTTP method describes the intended operation. \`GET\` is commonly used to retrieve a resource, \`POST\` is commonly used to create a resource or submit data for processing, \`PUT\` generally replaces a resource representation, \`PATCH\` partially modifies a resource, and \`DELETE\` requests removal of a resource.

 The URL identifies the target resource or endpoint. Headers provide metadata about the request or response, such as the expected content format, authentication credentials, caching instructions, or cookies. The body carries data when the operation needs additional content, such as a JSON object being submitted to an API.

 The server communicates the outcome using a <b>status code</b>. Status codes are grouped into categories: 2xx indicates successful processing, 3xx indicates redirection or related cache behavior, 4xx indicates a problem with the request or client-side conditions, and 5xx indicates that the server encountered a failure while processing the request.

 You do not need to memorize every HTTP status code. Start with commonly encountered codes such as 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, and 500 Internal Server Error.

 Understanding the complete request/response structure is more important than memorizing isolated numbers. When debugging an API, ask: <b>What method was used? What URL was requested? Which headers were sent? Was there a body? What status came back? Which response headers and body were returned?</b>`,       diagram: `Client
 |
 | HTTP request
 | method + URL + headers \+ body
 v
 Server
 |
 | process request
 |
 | HTTP response
 | status + headers + body
 v
 Client

 Common methods:
 GET -> retrieve
 POST -> create / submit
 PUT -> replace
 PATCH -> partially update
 DELETE -> remove

 Status groups:
 2xx -> success
 3xx -> redirection
 4xx -> client/request problem
 5xx -> server failure`,       codeExample: {         title: "Inspecting an HTTP request and response",         code: `const response = await fetch("https://api.example.com/users", {
 method: "GET",
 headers: {
 Accept: "application/json",
 },
 });

 console.log("status:", response.status);
 console.log("content type:", response.headers.get("content-type"));

 const data = await response.json();

 console.log(data);

 // A POST request can include a body.
 const createResponse = await fetch(
 "https://api.example.com/users",
 {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 name: "Alice",
 email: "alice@example.com",
 }),
 },
 );

 console.log(createResponse.status);`,       },       keyTakeaways: [         "HTTP uses a request/response communication model.",         "An HTTP request can contain a method, URL, headers, and body.",         "An HTTP response contains a status code, headers, and sometimes a body.",         "HTTP methods communicate the intended operation.",         "Status codes communicate the result or condition of the request.",         "2xx codes represent successful processing, 4xx codes generally represent request/client problems, and 5xx codes represent server-side failures.",         "Learning common status codes is more useful initially than memorizing the entire HTTP status registry.",       ],       commonMistakes: [         "<b>Returning 200 for every situation.</b> Status codes should communicate meaningful outcomes to clients.",         "<b>Confusing 401 and 403.</b> 401 concerns authentication credentials, while 403 indicates that the request is understood but access is not allowed.",         "<b>Thinking the HTTP method and URL are interchangeable.</b> The URL identifies the target while the method communicates the intended operation.",         "<b>Putting every piece of information into the request body.</b> Methods, URLs, headers, and bodies have different purposes.",         "<b>Assuming a successful network request always means a successful API operation.</b> A response can arrive successfully while containing a 4xx or 5xx status.",       ],       quiz: [         {           question: "What is the basic communication model used by HTTP?",           options: [             "Request and response",             "Database and table",             "Class and object",             "Compiler and runtime",           ],           correctIndex: 0,           explanation: "HTTP communication is based on clients sending requests and servers returning responses.",         },         {           question: "Which method is commonly used to retrieve a resource?",           options: [             "GET",             "POST",             "PATCH",             "DELETE",           ],           correctIndex: 0,           explanation: "GET is commonly used to retrieve a representation of a resource.",         },         {           question: "What does status code 404 mean?",           options: [             "Created",             "No Content",             "Not Found",             "Internal Server Error",           ],           correctIndex: 2,           explanation: "404 Not Found indicates that the requested resource could not be found.",         },       ],     },     {       id: "http-headers-cookies-sessions",       title: "Headers, cookies, and sessions",       durationMinutes: 25,       explanation: `HTTP headers carry <b>metadata</b> about a request or response. They do not normally represent the primary application data. Instead, they provide information that helps the client, server, proxy, or browser understand how the HTTP message should be interpreted or handled.

 Common request headers include \`Accept\`, \`Content-Type\`, \`Authorization\`, \`Cookie\`, \`User-Agent\`, and caching-related headers. Common response headers include \`Content-Type\`, \`Set-Cookie\`, \`Cache-Control\`, \`ETag\`, and security-related headers.

 The \`Content-Type\` header describes the format of the message body. For example, \`application/json\` tells the server or client that the body contains JSON. The \`Accept\` header communicates which response formats the client is prepared to receive.

 A <b>cookie</b> is a small piece of data that a server can ask a browser to store. The browser may later send that cookie back to the server in the \`Cookie\` request header according to the cookie's rules.

 Cookies are often used for preferences, identifiers, and authentication-related state. However, a cookie should not automatically be thought of as the entire session. A <b>session</b> is an application-level concept representing state that needs to persist across multiple requests.

 A common session architecture stores session data on the server. The browser receives a session identifier in a cookie, and the server uses that identifier to find the corresponding session data.

 For example, the browser might store \`sessionId=abc123\`. The server-side session store could contain information associated with \`abc123\`, such as the authenticated user ID and session expiration time.

 Security attributes are important for cookies that carry authentication state. \`HttpOnly\` prevents normal client-side JavaScript from reading the cookie, \`Secure\` restricts transmission to HTTPS connections, and \`SameSite\` controls when cookies are sent in cross-site situations.

 These mechanisms solve different problems: headers carry metadata, cookies provide client-managed storage and automatic request transmission, and sessions provide an application model for maintaining state across requests.`,       diagram: `Browser
 |
 | Request
 | Cookie: sessionId=abc123
 v
 Server
 |
 +--> read sessionId
 |
 +--> session store
 |
 +--> abc123
 |
 +--> userId
 +--> expiresAt
 +--> session data
 |
 v
 Response
 Set-Cookie:
 sessionId=abc123;
 HttpOnly;
 Secure;
 SameSite=Lax`,       codeExample: {         title: "Headers, cookies, and a session identifier",         code: `// Request headers
 GET /profile
 Host: api.example.com
 Accept: application/json
 Cookie: sessionId=abc123

 // Response headers
 HTTP/1.1 200 OK
 Content-Type: application/json
 Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax

 // Conceptual server-side session
 const session = {
 id: "abc123",
 userId: "user-42",
 expiresAt: "2026-10-01T12:00:00Z",
 };`,       },       keyTakeaways: [         "HTTP headers carry metadata about requests and responses.",         "`Content-Type` describes the format of a message body.",         "`Accept` communicates which response formats a client can handle.",         "Cookies are small pieces of client-stored data that can be sent with requests.",         "A session is an application-level concept for maintaining state across multiple requests.",         "A session cookie can contain only an identifier while the actual session data remains server-side.",         "`HttpOnly`, `Secure`, and `SameSite`are important cookie security attributes.",       ],       commonMistakes: [         "<b>Thinking cookies and sessions are the same thing.</b> A cookie is client-side storage/transport, while a session represents application state.",         "<b>Putting sensitive application data directly into cookies without considering security.</b> Client-stored values should be treated carefully.",         "<b>Ignoring HttpOnly and Secure for authentication cookies.</b> Security attributes should be chosen deliberately.",         "<b>Assuming headers contain only authentication information.</b> Headers serve many purposes including content negotiation, caching, cookies, and metadata.",       ],       quiz: [         {           question: "What is the primary purpose of HTTP headers?",           options: [             "Carry metadata about an HTTP message",             "Store an entire database",             "Replace HTTP methods",             "Compile JavaScript",           ],           correctIndex: 0,           explanation: "Headers provide metadata that describes or controls how an HTTP request or response should be handled.",         },         {           question: "What is a common purpose of a session cookie?",           options: [             "Carry a session identifier",             "Store the entire application database",             "Replace the HTTP status code",             "Disable browser requests",           ],           correctIndex: 0,           explanation: "A session cookie commonly contains an identifier that allows the server to locate session state.",         },         {           question: "What does HttpOnly help with?",           options: [             "Preventing normal client-side JavaScript from reading the cookie",             "Compressing the cookie",             "Making HTTP faster",             "Changing the HTTP method",           ],           correctIndex: 0,           explanation: "HttpOnly prevents JavaScript APIs such as document.cookie from reading the cookie.",         },       ],     },     {       id: "http-json-multipart-cors",       title: "JSON, multipart forms, and CORS",       durationMinutes: 25,       explanation:`<b>JSON</b> is one of the most common data formats used by modern HTTP APIs. It represents structured data using objects, arrays, strings, numbers, booleans, and null. When a client sends JSON, it commonly sets \`Content-Type: application/json\` so the server knows how to parse the request body.

 For example, a user creation request might send a JSON object containing \`name\` and \`email\`. The server parses the JSON, validates it, and then uses the resulting data in its application logic.

 <b>multipart/form-data</b> is another important body format. It is commonly used when a request contains multiple form fields or file uploads. Instead of treating the entire body as one JSON document, multipart encoding divides the body into separate parts identified by boundaries.

 File uploads are a common reason to use multipart requests. A form can contain text fields such as a username as well as a binary file such as an image.

 <b>CORS</b>, or Cross-Origin Resource Sharing, is a browser security mechanism related to requests between different origins.

 An origin is determined by the combination of scheme, host, and port. For example, \`https://frontend.example.com\` and \`https://api.example.com\` are different origins because their hosts differ.

 When browser JavaScript makes a cross-origin request, the browser applies its CORS rules. The server can respond with headers such as \`Access-Control-Allow-Origin\` to tell the browser which origins are allowed to access the response.

 Some cross-origin requests require a <b>preflight</b> request using the OPTIONS method. The browser sends the preflight to determine whether the actual request is permitted according to the server's CORS policy.

 CORS should not be confused with authentication. Authentication answers questions such as "Who is making this request?" CORS answers whether browser JavaScript from one origin is permitted to access a resource on another origin.

 CORS is also primarily a browser enforcement mechanism. A server-to-server HTTP client does not become blocked by a browser CORS policy because there is no browser enforcing that policy between the servers.`,       diagram: `Frontend
 https://app.example
 |
 | cross-origin request
 v
 API
 https://api.example
 |
 +--> CORS headers
 |
 v
 Browser
 |
 +--> allowed
 | |
 | v
 | JS can read response
 |
 +--> blocked
 |
 v
 JS cannot read response

 Request bodies:

 JSON
 |
 +--> one structured document

 multipart/form-data
 |
 +--> multiple parts
 |
 +--> text fields
 +--> files`,       codeExample: {         title: "JSON, FormData, and a CORS response",         code: `// JSON request
 await fetch("/users", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 name: "Alice",
 email: "alice@example.com",
 }),
 });

 // Multipart request
 const form = new FormData();

 form.append("name", "Alice");
 form.append("avatar", file);

 await fetch("/users/avatar", {
 method: "POST",
 body: form,
 });

 // The browser sets the multipart boundary.
 // Do not manually set Content-Type here.

 // Example CORS response headers
 Access-Control-Allow-Origin: https://app.example
 Access-Control-Allow-Methods: GET, POST, PATCH
 Access-Control-Allow-Headers: Content-Type, Authorization`,       },       keyTakeaways: [         "JSON is a common structured data format for API request and response bodies.",         "`Content-Type: application/json`tells the server that a body contains JSON.",         "multipart/form-data is commonly used for forms containing files or multiple parts.",         "Browsers automatically manage the multipart boundary when using FormData.",         "CORS controls whether browser JavaScript can access resources across origins.",         "A CORS preflight commonly uses the OPTIONS method.",         "CORS is not an authentication mechanism.",         "Server-to-server requests are not subject to browser CORS enforcement.",       ],       commonMistakes: [         "<b>Manually setting Content-Type when using FormData.</b> The browser needs to generate the multipart boundary automatically.",         "<b>Thinking CORS provides authentication.</b> CORS and authentication solve different problems.",         "<b>Allowing every origin without understanding the requirement.</b> CORS policies should reflect the application's intended browser clients.",         "<b>Parsing every request body as JSON.</b> The server should select parsing behavior based on Content-Type.",         "<b>Assuming a CORS error means the server rejected the request.</b> The browser may have received the response but prevented JavaScript from accessing it.",       ],       quiz: [         {           question: "Which Content-Type is commonly used for JSON?",           options: [             "application/json",             "text/css",             "image/png",             "application/zip",           ],           correctIndex: 0,           explanation: "application/json identifies a JSON request or response body.",         },         {           question: "Which format is commonly used for file uploads?",           options: [             "multipart/form-data",             "application/json only",             "text/css",             "application/javascript",           ],           correctIndex: 0,           explanation: "multipart/form-data supports multiple body parts and is commonly used for file uploads.",         },         {           question: "What does CORS primarily control?",           options: [             "Browser access to cross-origin resources",             "Password hashing",             "Database indexing",             "Node.js compilation",           ],           correctIndex: 0,           explanation: "CORS controls whether browser JavaScript can access resources across origins.",         },       ],     },     {       id: "http-caching-idempotency",       title: "HTTP caching and idempotency",       durationMinutes: 25,       explanation:`<b>HTTP caching</b> allows clients and intermediary caches to reuse previously obtained responses when the response's caching rules permit it.

 Caching can improve performance because the client may not need to contact the origin server for every request. It can reduce latency, bandwidth consumption, and server workload.

 The \`Cache-Control\` response header is one of the main mechanisms for controlling caching behavior. For example, \`max-age=60\` can indicate that a response may be considered fresh for 60 seconds. Other directives can control whether a response is public, private, or stored at all.

 An <b>ETag</b> is another important caching mechanism. It identifies a particular representation of a resource. A client can later send the ETag using \`If-None-Match\`. If the representation has not changed, the server can return \`304 Not Modified\` instead of sending the complete response again.

 Caching must consider whether data is shared or personalized. Public product catalog data may have different caching requirements from a response containing private user information.

 Another important concept is <b>idempotency</b>. An operation is idempotent when making the same request multiple times has the same intended effect on resource state as making it once.

 GET, PUT, and DELETE are defined as idempotent HTTP methods. POST is not generally idempotent because repeating a POST request can create multiple resources or trigger an operation multiple times.

 This matters when clients retry requests. A network failure can occur after the server has processed a request but before the client receives the response. The client may then retry, potentially causing duplicate work.

 For retry-sensitive operations such as payment creation or order submission, applications can implement an <b>idempotency key</b>. The client sends a unique key with the request, and the server records the result associated with that key. If the same key is received again, the server can recognize the previous operation rather than blindly performing it again.

 Idempotency therefore connects HTTP semantics with real application reliability. It is especially important when distributed systems, unreliable networks, and retries are involved.`,       diagram: `Client
 |
 | GET /users/42
 v
 Cache
 |
 +--> fresh?
 | |
 | +--> yes --> return cached response
 |
 +--> no
 |
 v
 Server
 |
 v
 Response
 ETag: "v3"

 Later:

 Client
 |
 | If-None-Match: "v3"
 v
 Server
 |
 +--> unchanged
 |
 v
 304 Not Modified

 Idempotency:

 Request x1
 |
 v
 State S

 Same request x2
 |
 v
 same intended state S`,       codeExample: {         title: "Caching and retry-safe requests",         code: `// Cacheable response
 HTTP/1.1 200 OK
 Cache-Control: public, max-age=60
 ETag: "user-42-v3"

 // Conditional request
 GET /users/42
 If-None-Match: "user-42-v3"

 // If unchanged:
 HTTP/1.1 304 Not Modified

 // Application-level idempotency
 POST /payments
 Idempotency-Key: payment-attempt-123

 {
 "amount": 5000,
 "currency": "USD"
 }`,       },       keyTakeaways: [         "HTTP caching can reduce latency, bandwidth usage, and repeated server work.",         "`Cache-Control`defines important caching behavior.",         "ETags can identify a representation and support conditional requests.",         "Personalized and sensitive responses require careful cache-control decisions.",         "Idempotency describes the intended effect of repeating an operation on resource state.",         "GET, PUT, and DELETE are idempotent according to HTTP semantics.",         "POST is not generally idempotent.",         "Application-level idempotency keys can protect retry-sensitive operations from duplicate processing.",       ],       commonMistakes: [         "<b>Publicly caching personalized responses.</b> Cache scope should match the sensitivity and ownership of the data.",         "<b>Thinking idempotent means the response is always identical.</b> The important property concerns the intended effect on resource state.",         "<b>Assuming POST is automatically safe to retry.</b> Retry-sensitive POST operations often require explicit application-level idempotency.",         "<b>Using caching without understanding freshness.</b> Cached data can become stale and should have deliberate freshness rules.",         "<b>Confusing ETag with a database ID.</b> An ETag identifies a particular representation for caching purposes.",       ],       quiz: [         {           question: "Which header commonly controls HTTP caching?",           options: [             "Cache-Control",             "User-Password",             "Server-Database",             "Route-Key",           ],           correctIndex: 0,           explanation: "Cache-Control provides directives that control caching behavior.",         },         {           question: "What is an ETag commonly used for?",           options: [             "Identifying a resource representation for caching",             "Authenticating a user",             "Encrypting a password",             "Creating a database table",           ],           correctIndex: 0,           explanation: "ETags identify representations and can be used with conditional requests.",         },         {           question: "What does idempotency mean?",           options: [             "Repeating an operation has the same intended effect on resource state",             "The request can never fail",             "The response is always identical",             "The server never changes",           ],           correctIndex: 0,           explanation: "Idempotency concerns the intended effect of repeating the same operation.",         },       ],     },     {       id: "http-request-lifecycle",       title: "Putting the HTTP lifecycle together",       durationMinutes: 25,       explanation:`The most useful HTTP knowledge comes from being able to reason about the <b>entire request lifecycle</b> rather than memorizing individual concepts.

 A client begins by deciding which resource it wants to interact with and which HTTP method represents the intended operation. It constructs a URL, adds the appropriate request headers, and includes a body when necessary.

 The request travels through the network and eventually reaches the server. The server may parse the body according to its Content-Type, validate the input, authenticate the caller, authorize the requested operation, execute application logic, interact with a database or another service, and construct an HTTP response.

 The response contains a status code that communicates the broad result. Response headers provide metadata such as content type, caching instructions, cookies, or security information. The response body contains the actual representation or error information when appropriate.

 The client then interprets the response. In a browser, additional mechanisms can affect what application JavaScript is allowed to do. CORS may control whether JavaScript can read a cross-origin response. Cache rules may cause the browser or an intermediary to reuse a previous response. Network failures may cause the client to retry a request.

 This gives you a practical debugging model:

 <b>method → URL → request headers → request body → network → server parsing → authentication → authorization → application logic → response status → response headers → response body → client behavior.</b>

 When an API request fails, do not immediately assume the controller or service is broken. The problem may be an incorrect URL, unsupported method, malformed JSON, missing authorization header, invalid cookie, CORS policy, stale cache, wrong status handling, or a retry-related issue.

 Learning to inspect each layer systematically is one of the most useful skills you can develop before building larger APIs.`,       diagram: `Client
 |
 +--> method
 +--> URL
 +--> headers
 +--> body
 |
 v
 Network
 |
 v
 Server
 |
 +--> parse request
 +--> validate
 +--> authenticate
 +--> authorize
 +--> application logic
 +--> database/services
 |
 v
 Response
 |
 +--> status
 +--> headers
 +--> body
 |
 v
 Client
 |
 +--> CORS
 +--> cache
 +--> parsing
 +--> retry
 +--> UI behavior`,       codeExample: {         title: "Inspecting a complete API exchange",         code: `// Request
 POST /api/users
 Content-Type: application/json
 Authorization: Bearer <token>

 {
 "name": "Alice",
 "email": "alice@example.com"
 }

 // Server processes:
 // 1. Parse JSON
 // 2. Validate input
 // 3. Authenticate token
 // 4. Authorize operation
 // 5. Create user
 // 6. Build response

 // Response
 HTTP/1.1 201 Created
 Content-Type: application/json
 Cache-Control: no-store

 {
 "data": {
 "id": "u1",
 "name": "Alice",
 "email": "alice@example.com"
 }
 }`,
 },
 keyTakeaways: [
 "HTTP debugging becomes easier when you inspect the entire request and response lifecycle.",
 "Method, URL, headers, body, status, and response body each have different responsibilities.",
 "The server typically parses, validates, authenticates, authorizes, and processes the request.",
 "Response headers can influence caching, cookies, content interpretation, and browser behavior.",
 "CORS, caching, and retries can affect what happens after the server processes a request.",
 "A systematic HTTP debugging checklist is more reliable than guessing which backend function failed.",
 ],
 commonMistakes: [
 "<b>Debugging only the response body.</b> The method, URL, headers, or request body may be the actual problem.",
 "<b>Assuming every 4xx response means the backend is broken.</b> Many 4xx responses correctly communicate invalid or unauthorized client requests.",
 "<b>Using CORS to solve authentication problems.</b> CORS and authentication are separate concerns.",
 "<b>Ignoring request headers.</b> Content-Type and Authorization headers can completely change how a request is processed.",
 "<b>Forgetting client-side caching.</b> The browser or intermediary may return a cached response rather than making a fresh request.",
 ],
 quiz: [
 {
 question: "Which sequence is useful when debugging an HTTP request?",
 options: [
 "Method → URL → headers → body → server → response",
 "Database → CSS → HTML only",
 "Promise → class → interface only",
 "Cookie → JSON → TypeScript only",
 ],
 correctIndex: 0,
 explanation: "Inspecting the complete request and response lifecycle helps identify where a problem occurs.",
 },
 {
 question: "What can happen after a server returns a response?",
 options: [
 "The browser may apply CORS and caching rules",
 "HTTP disappears",
 "TypeScript recompiles the server",
 "The database rewrites the request",
 ],
 correctIndex: 0,
 explanation: "Browser behavior such as CORS enforcement and caching can affect how the client handles a response.",
 },
 {
 question: "Why inspect Content-Type during debugging?",
 options: [
 "It helps determine how the request or response body should be interpreted",
 "It determines the database password",
 "It replaces authentication",
 "It changes the HTTP method",
 ],
 correctIndex: 0,
 explanation: "Content-Type tells the receiving side what media format the body uses.",
 },
 ],
 },
 ],
 finalQuiz: [
 {
 question: "What is the basic model used by HTTP?",
 options: [
 "Request and response",
 "Class and inheritance",
 "Database and table",
 "Compiler and bundle",
 ],
 correctIndex: 0,
 explanation: "HTTP communication is based on clients sending requests and servers returning responses.",
 },
 {
 question: "Which method is commonly used to retrieve data?",
 options: ["GET", "POST", "DELETE", "PATCH"],
 correctIndex: 0,
 explanation: "GET is commonly used to retrieve a resource representation.",
 },
 {
 question: "Which status code means 'Created'?",
 options: ["200", "201", "204", "404"],
 correctIndex: 1,
 explanation: "201 Created indicates successful creation of a resource.",
 },
 {
 question: "What do HTTP headers primarily contain?",
 options: [
 "Metadata about the request or response",
 "Only HTML",
 "Only database rows",
 "Only passwords",
 ],
 correctIndex: 0,
 explanation: "Headers carry metadata such as content type, authorization, caching, and cookies.",
 },
 {
 question: "What is a session?",
 options: [
 "Application state maintained across requests",
 "An HTTP method",
 "A MIME type",
 "A status code",
 ],
 correctIndex: 0,
 explanation: "A session is an application-level way to maintain state across multiple requests.",
 },
 {
 question: "Which Content-Type is commonly used for JSON?",
 options: [
 "application/json",
 "multipart/form-data",
 "text/css",
 "image/jpeg",
 ],
 correctIndex: 0,
 explanation: "application/json identifies a JSON request or response body.",
 },
 {
 question: "What does CORS primarily control?",
 options: [
 "Browser cross-origin access",
 "Database permissions",
 "Password expiration",
 "File compression",
 ],
 correctIndex: 0,
 explanation: "CORS controls whether browser JavaScript can access resources across origins.",
 },
 {
 question: "Which header is commonly used for caching?",
 options: [
 "Cache-Control",
 "Accept-Password",
 "Server-DB",
 "Route-Key",
 ],
 correctIndex: 0,
 explanation: "Cache-Control contains directives that control caching behavior.",
 },
 {
 question: "Which method is idempotent according to HTTP semantics?",
 options: [
 "GET",
 "POST",
 "CONNECT only",
 "None",
 ],
 correctIndex: 0,
 explanation: "GET is a safe and idempotent HTTP method.",
 },
 {
 question: "What is an idempotency key commonly used for?",
 options: [
 "Preventing duplicate processing of retry-sensitive operations",
 "Replacing authentication",
 "Changing a URL",
 "Compressing JSON",
 ],
 correctIndex: 0,
 explanation: "Application-level idempotency keys allow servers to recognize repeated attempts at the same logical operation.",
 },
 ],
 project: {
 name: "Phase Project: HTTP request lab",
 goal: "Build and inspect a small HTTP API so that every important part of an HTTP request and response can be observed and documented.",
 brief: "Create a small users API and test it using a browser client, curl, Postman, or another API tool. Your goal is not only to make endpoints work, but to understand the complete HTTP exchange: methods, URLs, headers, request bodies, status codes, response headers, cookies, CORS, caching, and retries.",
 steps: [
 "Create a GET /users endpoint that returns a collection.",
 "Create a GET /users/:id endpoint that returns one user.",
 "Create a POST /users endpoint accepting application/json.",
 "Return 201 Created when a user is successfully created.",
 "Return a meaningful 4xx status when the request body is invalid.",
 "Create a PATCH /users/:id endpoint for partial updates.",
 "Create a DELETE /users/:id endpoint.",
 "Add an authenticated endpoint using an Authorization header.",
 "Add a session-style endpoint that sets a cookie.",
 "Configure the session cookie with deliberate HttpOnly, Secure, and SameSite settings.",
 "Add a file upload endpoint using multipart/form-data.",
 "Configure CORS for one explicit frontend origin.",
 "Test a cross-origin request from a browser client.",
 "Inspect the OPTIONS preflight request when one occurs.",
 "Add Cache-Control headers to a safe read-only response.",
 "Add an ETag to one resource response.",
 "Test a conditional request using If-None-Match.",
 "Choose one retry-sensitive operation and design an Idempotency-Key strategy.",
 "Capture complete request examples for the important endpoints.",
 "Capture complete response examples including status, headers, and body.",
 "Create a troubleshooting document explaining how you would investigate 400, 401, 403, 404, 409, and 500 responses.",
 ],
 acceptance: [
 "HTTP methods are selected according to their intended semantics.",
 "Successful and failure responses use meaningful status codes.",
 "Request and response headers are documented.",
 "JSON request bodies are demonstrated.",
 "multipart/form-data is demonstrated.",
 "Cookies or sessions are demonstrated and documented.",
 "Authentication using an Authorization header is demonstrated.",
 "CORS is configured for a specific origin.",
 "A caching strategy is demonstrated using Cache-Control.",
 "ETag or conditional request behavior is demonstrated.",
 "At least one retry-sensitive operation has an idempotency strategy.",
 "Complete HTTP request and response examples are documented.",
 "The project includes a practical debugging checklist.",
 ],
 stretch: [
 "Implement conditional requests using ETag and If-None-Match.",
 "Test and document a CORS preflight request.",
 "Add secure cookie options for a session.",
 "Implement an idempotency-key store for a POST operation.",
 "Compare cached and uncached responses using browser developer tools.",
 "Document the difference between 401 and 403 using real API examples.",
 "Add request logging that records method, URL, status code, and request duration.",
 ],
 },
};
