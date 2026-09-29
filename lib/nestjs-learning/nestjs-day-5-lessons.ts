import type { LessonDay } from "@/lib/learn/lesson-types";

 export const REST_DAY_5_LESSONS: LessonDay = {
 day: 5,
 title: "REST API Fundamentals",
 totalMinutes: 130,
 difficulty: "Beginner",
 lessons: [
 {
 id: "rest-resources-crud-uri",
 title: "REST, resources, CRUD, and URI design",
 durationMinutes: 27,
 explanation: `REST, or <b>Representational State Transfer</b>, is an architectural style for designing networked applications around resources and representations.

 The central idea is to model the things your application manages as <b>resources</b>. A resource might be a user, product, order, invoice, course, lesson, comment, or payment. The API exposes representations of these resources so that clients can retrieve or modify them through HTTP.

 For example, \`/users\` can represent a collection of users, while \`/users/42\` can identify one particular user. The URI answers the question "which resource are we talking about?" The HTTP method then communicates what the client wants to do with that resource.

 This creates a clean separation between <b>resource identification</b> and <b>operation semantics</b>. \`GET /users/42\` requests the representation of user 42. \`PATCH /users/42\` requests a partial modification of that same resource. \`DELETE /users/42\` requests its removal.

 CRUD is a useful way to describe the common operations applications perform on resources: <b>Create, Read, Update, and Delete</b>. REST does not require every resource to expose all four operations, but CRUD maps naturally to many resource-oriented APIs.

 A common REST mapping is \`POST\` for creation, \`GET\` for reading, \`PUT\` or \`PATCH\` for updating, and \`DELETE\` for deletion.

 URI design should generally focus on <b>nouns rather than verbs</b>. An endpoint such as \`GET /getUsers\` mixes the resource and action into the URI even though GET already communicates the retrieval operation. A resource-oriented design instead uses \`GET /users\`.

 Collection and item routes should be predictable. A collection might use \`/users\`, while a specific item uses \`/users/:id\`. The same pattern can be applied to products, orders, courses, and other resources.

 Relationships can also be represented. For example, \`/users/42/orders\` could represent orders belonging to user 42. However, deeply nested resources can become difficult to read and maintain. Sometimes a separate route such as \`/orders/91\` is easier for accessing a specific order.

 The goal is not to follow a magical URL formula. The goal is to create an API whose resource model and URI conventions are <b>predictable, consistent, and understandable</b>.`,       diagram: `REST API
 |
 +--> Resources
 | |
 | +--> users
 | +--> products
 | +--> orders
 |
 +--> Resource URIs
 | |
 | +--> /users
 | +--> /users/42
 |
 +--> HTTP methods
 |
 +--> GET -> read
 +--> POST -> create
 +--> PUT -> replace
 +--> PATCH -> partial update
 +--> DELETE -> remove

 Collection:
 /users

 Individual resource:
 /users/42`,       codeExample: {         title: "A resource-oriented NestJS controller",         code: `@Controller("users")
 export class UsersController {
 @Get()
 findAll() {}

 @Get(":id")
 findOne(@Param("id") id: string) {}

 @Post()
 create(@Body() input: CreateUserDto) {}

 @Patch(":id")
 update(
 @Param("id") id: string,
 @Body() input: UpdateUserDto,
 ) {}

 @Delete(":id")
 remove(@Param("id") id: string) {}
 }

 // Resource-oriented API:
 //
 // GET /users
 // GET /users/42
 // POST /users
 // PATCH /users/42
 // DELETE /users/42`,       },       keyTakeaways: [         "REST is an architectural style centered around resources and their representations.",         "A resource represents something meaningful in the application's domain.",         "A URI identifies a resource while the HTTP method communicates the intended operation.",         "CRUD stands for Create, Read, Update, and Delete.",         "Resource-oriented URIs generally use nouns rather than action verbs.",         "Collection and item routes should follow predictable patterns.",         "Relationships can be represented with nested resources, but excessive nesting should be avoided.",       ],       commonMistakes: [         "<b>Putting verbs into every URI.</b> HTTP methods already communicate common operations.",         "<b>Thinking REST means every endpoint must implement CRUD.</b> Resources may support only the operations that make sense for the domain.",         "<b>Mixing singular and plural naming randomly.</b> Pick a collection naming convention and use it consistently.",         "<b>Nesting every relationship.</b> Deeply nested URIs can become difficult for clients to understand.",         "<b>Confusing REST with a framework.</b> REST is an architectural style, while NestJS, Express, and Fastify are implementation technologies.",       ],       quiz: [         {           question: "What does `/users/42`identify?",           options: [             "The users collection",             "A specific user resource",             "A database schema",             "An HTTP header",           ],           correctIndex: 1,           explanation: "The URI identifies one particular user resource using the identifier 42.",         },         {           question: "Which style is more resource-oriented?",           options: [             "POST /createUser",             "GET /getUsers",             "GET /users",             "POST /deleteUser",           ],           correctIndex: 2,           explanation: "The /users URI identifies the resource collection and GET communicates the retrieval operation.",         },         {           question: "What does CRUD stand for?",           options: [             "Create, Read, Update, Delete",             "Cache, Route, Upload, Deploy",             "Connect, Read, Undo, Deploy",             "Create, Render, Use, Download",           ],           correctIndex: 0,           explanation: "CRUD stands for Create, Read, Update, and Delete.",         },       ],     },     {       id: "rest-method-semantics",       title: "REST and HTTP method semantics",       durationMinutes: 25,       explanation:`REST-style APIs depend heavily on HTTP method semantics. Choosing between \`GET\`, \`POST\`, \`PUT\`, \`PATCH\`, and \`DELETE\` is not merely a naming preference. The methods communicate expectations about the operation.

 \`GET\` is commonly used to retrieve a resource representation. A GET request should have <b>safe</b> semantics, meaning the client is not asking the server to intentionally change resource state.

 \`POST\` is commonly used to submit data for processing or create a new resource within a collection. For example, \`POST /users\` can ask the server to create a new user and choose the identifier.

 \`PUT\` generally represents replacement of the target resource representation. If the client sends \`PUT /users/42\`, the request can represent the complete desired representation of user 42.

 \`PATCH\` is designed for partial modification. A PATCH request can contain only the fields that should change. For example, \`PATCH /users/42\` with \`{"name":"Alice Smith"}\` can modify only the user's name.

 \`DELETE\` requests removal of a resource. The application may implement that removal physically or use a domain-specific soft-delete strategy, but the HTTP operation communicates the client's request to delete the resource.

 HTTP also defines the concept of <b>idempotency</b>. An idempotent operation has the same intended effect on resource state when repeated as it would have if performed once. GET, PUT, and DELETE are idempotent according to HTTP semantics, while POST is not generally idempotent.

 Understanding these semantics becomes especially important when clients retry requests. A retry of GET is normally straightforward. A retry of a POST that creates an order could potentially create two orders unless the application has an explicit strategy for handling duplicate submissions.

 REST API design therefore involves more than choosing URLs. The URI, method, request representation, response representation, and expected semantics should work together as a coherent contract.`,       diagram: `Resource: /users/42

 GET
 |
 +--> retrieve representation

 PUT
 |
 +--> replace representation

 PATCH
 |
 +--> partially modify

 DELETE
 |
 +--> remove

 Collection: /users

 POST
 |
 +--> create / submit

 Method semantics
 |
 v
 Predictable client behavior`,       codeExample: {         title: "Using HTTP methods according to their semantics",         code: `// Read
 GET /users/42

 // Create
 POST /users
 {
 "name": "Alice",
 "email": "alice@example.com"
 }

 // Replace
 PUT /users/42
 {
 "name": "Alice",
 "email": "alice@example.com"
 }

 // Partial update
 PATCH /users/42
 {
 "name": "Alice Smith"
 }

 // Delete
 DELETE /users/42`,       },       keyTakeaways: [         "HTTP methods have defined semantics that help clients understand API behavior.",         "GET is commonly used for retrieval and has safe semantics.",         "POST is commonly used for creation or submission.",         "PUT generally represents replacement of a target resource.",         "PATCH is commonly used for partial modification.",         "DELETE represents a request to remove a resource.",         "Idempotency matters when operations may be retried.",       ],       commonMistakes: [         "<b>Using GET to change application state.</b> GET should have safe semantics.",         "<b>Using POST for every operation.</b> Method semantics provide useful information to API clients.",         "<b>Confusing PUT with PATCH.</b> PUT generally represents replacement while PATCH represents partial modification.",         "<b>Assuming idempotent means successful.</b> An idempotent request can still fail; idempotency describes repeated effects.",       ],       quiz: [         {           question: "Which method is commonly used for partial updates?",           options: [             "GET",             "POST",             "PATCH",             "DELETE",           ],           correctIndex: 2,           explanation: "PATCH is commonly used when only part of a resource needs to be changed.",         },         {           question: "Which method is commonly used to create a resource in a collection?",           options: [             "GET",             "POST",             "DELETE",             "HEAD",           ],           correctIndex: 1,           explanation: "POST is commonly used to submit a new resource to a collection.",         },         {           question: "Which statement about GET is correct?",           options: [             "It should have safe semantics",             "It must create a database record",             "It always deletes a resource",             "It requires a request body",           ],           correctIndex: 0,           explanation: "GET is defined as a safe method and is intended for retrieval.",         },       ],     },     {       id: "pagination-filtering-sorting-searching",       title: "Pagination, filtering, sorting, and searching",       durationMinutes: 27,       explanation: `Collection endpoints introduce a different design problem from individual resource endpoints. If an API contains ten users, returning all users might be fine. If it contains ten million users, returning every record from \`GET /users\` would be inefficient and potentially dangerous.

 <b>Pagination</b> limits how many records a collection request returns. One common approach is offset-based pagination, where clients provide values such as \`page=2&limit=20\`. Another approach is cursor-based pagination, where the server returns a cursor that identifies where the client should continue reading.

 Offset pagination is simple and often easy to understand. However, offsets can become less stable when records are inserted or deleted while a client is moving through multiple pages. Cursor-based pagination can provide more predictable traversal for certain large or frequently changing collections.

 <b>Filtering</b> narrows a collection according to structured resource attributes. For example, \`status=active\` might return only active users.

 <b>Sorting</b> determines the order in which records are returned. A request such as \`sort=createdAt&order=desc\` could request the newest records first.

 Sorting should generally use an <b>allowlist</b> of supported fields. The API should not blindly accept arbitrary database column names from a client.

 <b>Searching</b> is commonly used for text-oriented matching. A query such as \`q=alice\` might search a user's name and email. The exact fields and matching rules should be documented.

 A well-designed collection endpoint should define defaults and limits. For example, the server might default to 20 records per page and reject or cap requests above 100 records.

 The API should also define how invalid query parameters behave. If a client requests \`sort=unknownField\`, the server should have predictable behavior rather than silently doing something unexpected.

 Pagination, filtering, sorting, and searching are therefore not merely optional conveniences. They are important parts of a collection API's public contract.`,       diagram: `GET /users
 |
 +--> Pagination
 | |
 | +--> page
 | +--> limit
 | +--> cursor
 |
 +--> Filtering
 | |
 | +--> status=active
 |
 +--> Sorting
 | |
 | +--> sort=createdAt
 | +--> order=desc
 |
 +--> Searching
 |
 +--> q=alice

         |
         v
   bounded result set`,
  codeExample: {
    title: "A collection endpoint with query parameters",
    code: `GET /users?

 page=2&
 limit=20&
 status=active&
 sort=createdAt&
 order=desc&
 q=alice

 // Example response
 {
 "data": [
 {
 "id": "u21",
 "name": "Alice"
 },
 {
 "id": "u22",
 "name": "Alice Smith"
 }
 ],
 "meta": {
 "page": 2,
 "limit": 20,
 "total": 84,
 "hasNextPage": true
 }
 }

 // Cursor example
 GET /users?limit=20&cursor=eyJpZCI6MjB9`,       },       keyTakeaways: [         "Pagination keeps collection responses bounded and manageable.",         "Offset pagination is simple, while cursor pagination can be useful for large or frequently changing collections.",         "Filtering narrows results using structured criteria.",         "Sorting controls result order and should normally use an allowlist of supported fields.",         "Searching usually performs text-oriented matching.",         "Collection APIs should document default values and maximum limits.",         "Invalid query parameters should have predictable behavior.",       ],       commonMistakes: [         "<b>Allowing unlimited page sizes.</b> Always define a reasonable server-side maximum.",         "<b>Returning every record by default.</b> Large collections should use bounded responses.",         "<b>Allowing arbitrary sort fields.</b> Explicitly define which fields clients may sort by.",         "<b>Using inconsistent query parameter names.</b> Similar collection operations should follow shared conventions.",         "<b>Failing to document search behavior.</b> Clients should know which fields are searched and how matching works.",       ],       quiz: [         {           question: "Why use pagination?",           options: [             "To return every record at once",             "To bound the size of collection responses",             "To disable filtering",             "To replace HTTP methods",           ],           correctIndex: 1,           explanation: "Pagination limits the number of records returned in a collection response.",         },         {           question: "Which parameter is an example of filtering?",           options: [             "status=active",             "Content-Type=JSON",             "Authorization=Bearer",             "HTTP=1.1",           ],           correctIndex: 0,           explanation: "status=active filters the collection based on a resource attribute.",         },         {           question: "Why should sort fields usually be allowlisted?",           options: [             "To define supported and controlled sorting behavior",             "To disable all sorting",             "To expose every database column",             "To replace authentication",           ],           correctIndex: 0,           explanation: "An allowlist keeps the sorting contract explicit and prevents arbitrary fields from becoming query inputs.",         },       ],     },     {       id: "api-versioning-error-design",       title: "API versioning and error design",       durationMinutes: 26,       explanation: `An API becomes a <b>public contract</b> as soon as clients depend on it. Changing that contract carelessly can break applications even when the server itself continues to work.

 API versioning provides a way to manage changes that cannot safely be introduced into an existing contract.

 A breaking change might involve removing a response field, changing the type or meaning of a field, making a previously optional request property required, changing the structure of an error response, or changing endpoint behavior in a way existing clients cannot handle.

 Common versioning strategies include putting the version in the URI, such as \`/api/v1/users\`, using a custom request header, or using media-type negotiation.

 For beginner projects, URI versioning is easy to understand because the version is visible in the request. For example, \`/api/v1/users\` and \`/api/v2/users\` can represent two separately documented contracts.

 Not every API change requires a new version. Adding a backward-compatible optional field may be possible without creating a new version. The important skill is understanding which changes preserve the existing contract and which changes break it.

 <b>Error design</b> is another important part of the API contract.

 An API should provide enough information for a client to understand what happened without exposing internal implementation details. A structured error response can include a machine-readable error code, a safe human-readable message, validation details, and a request identifier.

 For example, \`USER_NOT_FOUND\` is useful because application code can recognize the condition programmatically. A message such as "User 42 was not found" is useful for debugging or displaying an appropriate user-facing message.

 Different failures should also remain distinguishable. A validation error is different from missing authentication credentials. Missing authentication is different from insufficient permissions. A missing resource is different from a resource conflict.

 Internal information such as stack traces, SQL queries, database credentials, environment variables, or internal service addresses should not be exposed through public production error responses.

 A consistent error contract means clients do not need a completely different error parser for every endpoint.`,       diagram: `API contract
 |
 +--> URIs
 +--> methods
 +--> request shapes
 +--> response shapes
 +--> status codes
 +--> errors
 |
 v
 Breaking change?
 |
 +---+---+
 | |
 yes no
 | |
 v v
 new existing
 version version

 Error
 |
 +--> HTTP status
 +--> error code
 +--> message
 +--> details
 +--> requestId`,       codeExample: {         title: "Versioned API and consistent error response",         code: `GET /api/v1/users/42

 // Success
 HTTP/1.1 200 OK

 {
 "data": {
 "id": "42",
 "name": "Alice"
 }
 }

 // Error
 HTTP/1.1 404 Not Found

 {
 "error": {
 "code": "USER_NOT_FOUND",
 "message": "User 42 was not found",
 "requestId": "req-123"
 }
 }

 // Validation error
 HTTP/1.1 400 Bad Request

 {
 "error": {
 "code": "VALIDATION_ERROR",
 "message": "Request validation failed",
 "details": {
 "email": "Email must be valid"
 },
 "requestId": "req-124"
 }
 }`,       },       keyTakeaways: [         "An API contract includes routes, methods, request shapes, response shapes, status codes, and errors.",         "Versioning helps manage breaking changes while maintaining an existing contract.",         "URI versioning such as /api/v1/users is easy to understand and test.",         "Not every API change requires a new version.",         "Error responses should be structured and predictable.",         "Machine-readable error codes help clients handle specific conditions programmatically.",         "Internal implementation details should remain on the server side.",       ],       commonMistakes: [         "<b>Creating a new version for every change.</b> Versioning is primarily useful when changes cannot remain backward-compatible.",         "<b>Changing response shapes without considering clients.</b> Treat public response structures as contracts.",         "<b>Returning a different error format from every endpoint.</b> Shared error conventions simplify client development.",         "<b>Exposing stack traces or SQL statements.</b> Detailed diagnostics should generally be kept in server-side logs.",         "<b>Using only the HTTP status without useful error information.</b> Clients often need a stable code and safe message as well.",       ],       quiz: [         {           question: "Why might an API need a new version?",           options: [             "To manage a breaking contract change",             "To prevent all future changes",             "To remove HTTP",             "To eliminate errors",           ],           correctIndex: 0,           explanation: "A new version can provide a separate contract when an incompatible change is required.",         },         {           question: "What should generally not be exposed in a production API error?",           options: [             "A stable error code",             "A safe client-facing message",             "An internal stack trace and SQL details",             "A request identifier",           ],           correctIndex: 2,           explanation: "Internal implementation details can expose sensitive information and should remain server-side.",         },         {           question: "Why use a machine-readable error code?",           options: [             "Clients can identify the error programmatically",             "It replaces HTTP",             "It exposes the database",             "It starts the server",           ],           correctIndex: 0,           explanation: "Stable error codes let client applications respond differently to different known error conditions.",         },       ],     },     {       id: "rest-api-contract-thinking",       title: "Designing a predictable REST API contract",       durationMinutes: 25,       explanation: `A good REST API is more than a set of working controller methods. It is a <b>predictable contract between clients and servers</b>.

 Before implementation, identify the resources that belong to the domain. Then define how those resources are identified, which HTTP methods they support, what request data clients must provide, what responses look like, which status codes can occur, and how failures are represented.

 For collection resources, define pagination, filtering, sorting, and searching behavior. These query parameters are part of the API contract just like routes and request bodies.

 For example, if every collection endpoint uses \`data\` and \`meta\`, a client can build reusable collection handling logic. If every error contains \`code\`, \`message\`, and \`requestId\`, the client can use one common error-handling strategy.

 A useful API design process is:

 <b>identify resources → define URIs → choose HTTP methods → define request shapes → define response shapes → define collection queries → define status codes → define errors → define versioning → document examples.</b>

 The specification should also describe failure behavior. A client needs to know what happens when input is invalid, authentication is missing, authorization fails, a resource does not exist, or a request conflicts with existing state.

 Consistency matters because API consumers learn patterns. If one collection uses \`page\` and \`limit\` while another uses \`offset\` and \`size\` without a good reason, clients need additional special-case logic.

 The same applies to errors. If one endpoint returns \`{"error":"Not found"}\`, another returns \`{"message":"Missing"}\`, and another returns a completely different object, the client must understand each endpoint separately.

 A predictable REST API reduces this unnecessary complexity.

 The goal of API design is therefore not to create the smallest possible number of endpoints. It is to create a contract that another developer can understand, implement, test, and consume without having to guess what the server means.`,       diagram: `Domain
 |
 v
 Resources
 |
 v
 URI design
 |
 v
 HTTP methods
 |
 v
 Request shapes
 |
 v
 Response shapes
 |
 +--> pagination
 +--> filtering
 +--> sorting
 +--> searching
 |
 v
 Status codes
 |
 v
 Error contract
 |
 v
 Versioning
 |
 v
 API specification`,       codeExample: {         title: "A small REST API contract",         code: `Resource: users

 GET /api/v1/users
 Query:
 page
 limit
 status
 sort
 order
 q

 200:
 {
 "data": [...],
 "meta": {
 "page": 1,
 "limit": 20,
 "total": 84
 }
 }

 GET /api/v1/users/:id
 200 -> User
 404 -> USER_NOT_FOUND

 POST /api/v1/users
 201 -> Created user
 400 -> VALIDATION_ERROR
 409 -> EMAIL_ALREADY_EXISTS

 PATCH /api/v1/users/:id
 200 -> Updated user
 400 -> VALIDATION_ERROR
 404 -> USER_NOT_FOUND

 DELETE /api/v1/users/:id
 204 -> Deleted
 404 -> USER_NOT_FOUND`,
 },
 keyTakeaways: [
 "A REST API is a contract between clients and servers.",
 "A complete contract defines resources, URIs, methods, inputs, outputs, statuses, errors, and related behavior.",
 "Collection behavior such as pagination and filtering should be designed intentionally.",
 "Consistent response shapes allow clients to reuse parsing and UI logic.",
 "Consistent errors allow clients to build shared error-handling behavior.",
 "Failure behavior is part of the API contract, not an afterthought.",
 "Writing the contract before implementation reduces ambiguity and accidental API design.",
 ],
 commonMistakes: [
 "<b>Designing endpoints independently.</b> Establish shared URI, query, response, and error conventions first.",
 "<b>Documenting only the happy path.</b> Clients also need predictable behavior for failures.",
 "<b>Changing parameter names between similar endpoints.</b> Shared concepts should generally use shared names.",
 "<b>Allowing every endpoint to invent its own response shape.</b> Consistency makes APIs easier to consume.",
 "<b>Starting implementation without deciding the contract.</b> Coding first can cause inconsistent API behavior that becomes difficult to change later.",
 ],
 quiz: [
 {
 question: "What is the main purpose of an API contract?",
 options: [
 "Define predictable communication between clients and servers",
 "Replace the database",
 "Choose frontend colors",
 "Remove HTTP status codes",
 ],
 correctIndex: 0,
 explanation: "The API contract defines how clients interact with the server and what behavior they can expect.",
 },
 {
 question: "Why are consistent response shapes useful?",
 options: [
 "They allow clients to reuse parsing and handling logic",
 "They eliminate all bugs",
 "They make databases unnecessary",
 "They prevent every network failure",
 ],
 correctIndex: 0,
 explanation: "Consistent structures allow clients to reuse logic for similar API operations.",
 },
 {
 question: "What should be defined before implementing a complete API?",
 options: [
 "Resources, routes, methods, inputs, outputs, statuses, and errors",
 "Only database indexes",
 "Only frontend CSS",
 "Only authentication tokens",
 ],
 correctIndex: 0,
 explanation: "Defining the contract first gives the implementation a clear and consistent target.",
 },
 ],
 },
 ],
 finalQuiz: [
 {
 question: "What is a REST resource?",
 options: [
 "A domain thing represented and accessed through an API",
 "Only a database table",
 "A TypeScript interface",
 "An HTTP header",
 ],
 correctIndex: 0,
 explanation: "A REST-style API models domain resources and exposes representations of those resources.",
 },
 {
 question: "Which URI best follows resource-oriented design for listing users?",
 options: [
 "GET /getUsers",
 "GET /users",
 "POST /fetchUsers",
 "GET /doUsers",
 ],
 correctIndex: 1,
 explanation: "GET /users identifies the users collection while GET communicates the retrieval operation.",
 },
 {
 question: "What does CRUD stand for?",
 options: [
 "Create, Read, Update, Delete",
 "Cache, Route, Upload, Deploy",
 "Connect, Read, Undo, Deploy",
 "Create, Render, Use, Download",
 ],
 correctIndex: 0,
 explanation: "CRUD stands for Create, Read, Update, and Delete.",
 },
 {
 question: "Which method is commonly used for partial updates?",
 options: [
 "GET",
 "POST",
 "PATCH",
 "DELETE",
 ],
 correctIndex: 2,
 explanation: "PATCH is commonly used to modify only part of an existing resource.",
 },
 {
 question: "Why use pagination?",
 options: [
 "To prevent unbounded collection responses",
 "To disable filtering",
 "To replace authentication",
 "To remove query parameters",
 ],
 correctIndex: 0,
 explanation: "Pagination limits the amount of data returned by a collection endpoint.",
 },
 {
 question: "Which parameter is an example of filtering?",
 options: [
 "status=active",
 "Content-Type=json",
 "Authorization=Bearer",
 "HTTP=1.1",
 ],
 correctIndex: 0,
 explanation: "status=active narrows the collection based on a resource attribute.",
 },
 {
 question: "Why can API versioning be useful?",
 options: [
 "To manage breaking changes while supporting existing clients",
 "To stop all future changes",
 "To replace HTTP methods",
 "To avoid documentation",
 ],
 correctIndex: 0,
 explanation: "Versioning provides a mechanism for managing incompatible contract changes.",
 },
 {
 question: "What belongs in a useful API error response?",
 options: [
 "A stable code and safe client-facing message",
 "Database credentials",
 "A production stack trace",
 "Private environment variables",
 ],
 correctIndex: 0,
 explanation: "Clients need predictable and safe error information without internal secrets.",
 },
 {
 question: "What is the main goal of a REST API specification?",
 options: [
 "Create a predictable contract between clients and servers",
 "Replace the database",
 "Remove all status codes",
 "Choose a programming language",
 ],
 correctIndex: 0,
 explanation: "The specification defines how clients and servers communicate and what behavior clients can expect.",
 },
 {
 question: "Why should collection APIs define maximum page sizes?",
 options: [
 "To prevent unexpectedly large responses",
 "To disable pagination",
 "To force every request to return one record",
 "To replace filtering",
 ],
 correctIndex: 0,
 explanation: "Maximum page sizes prevent clients from requesting unnecessarily large collections.",
 },
 ],
 project: {
 name: "Phase Project: REST API specification",
 goal: "Design a complete REST API specification for a realistic backend before writing the implementation.",
 brief: "Choose a realistic domain such as an e-commerce store, task manager, booking system, learning platform, expense tracker, inventory system, or project management application. Design the API as a client-facing contract. Your specification should explain the resources, URI structure, HTTP methods, CRUD operations, request and response shapes, collection queries, relationships, versioning, status codes, and consistent error behavior.",
 steps: [
 "Choose a realistic application domain.",
 "Describe the main problem the API is solving.",
 "Identify the main resources in the domain.",
 "Define a collection URI for each resource.",
 "Define an individual resource URI for each resource.",
 "Document the fields returned by each resource.",
 "Identify server-generated fields and client-provided fields.",
 "Map Create, Read, Update, and Delete operations to HTTP methods.",
 "Document why each HTTP method is appropriate.",
 "Define request bodies for create operations.",
 "Define request bodies for update operations.",
 "Define successful response structures.",
 "Define pagination for at least one collection.",
 "Choose offset-based or cursor-based pagination.",
 "Document the default and maximum page size.",
 "Define filtering parameters for at least two useful fields.",
 "Define sorting using an explicit list of allowed fields.",
 "Define ascending and descending sort behavior.",
 "Define searching and document which fields are searched.",
 "Document at least one relationship between resources.",
 "Decide whether the relationship should use a nested route or separate resource route.",
 "Choose an API versioning strategy.",
 "Define the versioned base path or versioning mechanism.",
 "Design one consistent error envelope.",
 "Add machine-readable error codes.",
 "Define safe client-facing error messages.",
 "Document validation errors.",
 "Document authentication errors.",
 "Document authorization errors.",
 "Document not-found errors.",
 "Document conflict errors.",
 "Document unexpected server errors.",
 "Assign appropriate status codes to every endpoint.",
 "Write complete HTTP request examples.",
 "Write complete HTTP response examples.",
 "Review every endpoint for consistent naming.",
 "Review every collection endpoint for consistent query behavior.",
 "Review every error for consistent structure.",
 "Write the final specification so another developer can implement the API without guessing missing behavior.",
 ],
 acceptance: [
 "The API has a clearly defined domain and resource model.",
 "Collection and item URIs follow a consistent naming convention.",
 "CRUD operations use appropriate HTTP methods.",
 "The specification explains the intended semantics of the methods.",
 "At least one collection endpoint supports pagination.",
 "Pagination has a documented default and maximum size.",
 "Filtering is documented for multiple useful fields.",
 "Sorting uses an explicit allowlist of supported fields.",
 "Searching has documented behavior.",
 "At least one resource relationship is documented.",
 "An API versioning strategy is clearly documented.",
 "Request body structures are documented.",
 "Response structures are documented.",
 "Success status codes are documented.",
 "Failure status codes are documented.",
 "Errors use one consistent response structure.",
 "Errors contain stable machine-readable codes.",
 "Internal implementation details are not exposed in public error examples.",
 "Complete request and response examples are included.",
 "The specification is detailed enough that another developer could implement the API without inventing missing contract behavior.",
 ],
 stretch: [
 "Add cursor-based pagination for a high-volume collection.",
 "Explain why cursor pagination is appropriate for that collection.",
 "Define idempotency behavior for a retry-sensitive create operation.",
 "Document caching behavior for safe GET endpoints.",
 "Add ETag and conditional-request behavior to one resource.",
 "Create an OpenAPI-style draft from the REST specification.",
 "Add rate-limit response headers and document their meaning.",
 "Create a deprecation policy for an older API version.",
 "Document the difference between backward-compatible and breaking changes.",
 "Create example client code that consumes the API according to the specification.",
 "Write an API style guide covering URI naming, methods, pagination, filtering, sorting, errors, and versioning.",
 ],
 },
 };
