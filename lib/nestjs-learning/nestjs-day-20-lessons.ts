import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_20_LESSONS: LessonDay = {
  day: 20,
  title: "Execution Context",
  totalMinutes: 100,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "understanding-execution-context",
      title: "What is ExecutionContext?",
      durationMinutes: 20,
      explanation: `Execution context sounds complicated at first, but the basic idea is actually simple.

Imagine that NestJS is processing a request.

A request reaches your application, and Nest needs to figure out several things:

- What kind of application is handling this request?
- Is this an HTTP request?
- Is this a WebSocket message?
- Is this a microservice/RPC message?
- Is this a GraphQL resolver?
- Which controller or resolver is being executed?
- Which method is about to run?
- What arguments were passed to that method?

<b>ExecutionContext gives NestJS components access to information about what is currently being executed.</b>

You will commonly see ExecutionContext inside guards and interceptors. You can also encounter ArgumentsHost inside exception filters.

For example, suppose you have this controller:

<pre>
@Controller("orders")
export class OrdersController {
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }
}
</pre>

A guard running before <code>findOne()</code> may need to know:

"Which controller am I protecting?"

The answer is <code>OrdersController</code>.

It may also need to know:

"Which method is being called?"

The answer is <code>findOne</code>.

That is where methods such as <code>context.getClass()</code> and <code>context.getHandler()</code> become useful.

ExecutionContext also builds on top of ArgumentsHost.

You can think about the relationship like this:

ArgumentsHost
    |
    |-- gives access to handler arguments
    |
    +-- HTTP
    +-- RPC
    +-- WebSocket

ExecutionContext
    |
    |-- everything ArgumentsHost provides
    |
    +-- controller class
    +-- handler method

So, in simple words:

<b>ArgumentsHost helps you understand the arguments.</b>

<b>ExecutionContext helps you understand the arguments plus what Nest is currently executing.</b>

Here is a beginner-friendly real-world example.

Imagine a security guard at a building.

ArgumentsHost is like being told:

"Here are the people and objects currently standing at the entrance."

ExecutionContext is more like being told:

"Here are the people at the entrance, this is the building they are trying to enter, and this is the specific room they are trying to access."

That extra information is extremely useful for authentication and authorization.

For example, your application may have:

<pre>
UsersController
    |
    +-- profile()
    +-- updateProfile()

AdminController
    |
    +-- dashboard()
    +-- deleteUser()
</pre>

A guard could use the execution context to determine whether the current request is going to an admin-only handler.

At a more advanced level, you can combine ExecutionContext with metadata.

For example:

<pre>
@Roles("admin")
@Get("users")
getUsers() {
  return this.usersService.findAll();
}
</pre>

A guard can inspect the current handler using <code>getHandler()</code>, inspect the controller using <code>getClass()</code>, and then read metadata associated with those targets.

This is one of the reasons ExecutionContext becomes very important in larger NestJS applications.

You do not usually use ExecutionContext inside normal controller methods.

Instead, think of it as a tool for NestJS infrastructure code:

- guards
- interceptors
- filters
- reusable framework-level logic

The important mental model is:

<b>The controller handles the business request. ExecutionContext helps infrastructure code understand where that request is currently being handled.</b>`,
      diagram: `Incoming operation
       |
       v
+-----------------------+
|   NestJS Pipeline     |
+-----------------------+
       |
       v
+-----------------------+
| ExecutionContext      |
+-----------------------+
       |
       +------> What type?
       |          |
       |          +--> HTTP
       |          +--> RPC
       |          +--> WebSocket
       |          +--> GraphQL
       |
       +------> Which class?
       |          |
       |          +--> OrdersController
       |
       +------> Which handler?
                  |
                  +--> findOne()

ExecutionContext
       |
       +--> ArgumentsHost
       |
       +--> getClass()
       |
       +--> getHandler()`,
      codeExample: {
        title: "Inspecting the current controller and handler",
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class DebugGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const controller = context.getClass();
    const handler = context.getHandler();

    console.log("Controller:", controller.name);
    console.log("Handler:", handler.name);

    return true;
  }
}`,
      },
      keyTakeaways: [
        "ExecutionContext tells NestJS infrastructure code what is currently being executed.",
        "ExecutionContext extends ArgumentsHost.",
        "getClass() returns the controller class associated with the current handler.",
        "getHandler() returns the handler method that Nest is about to execute.",
        "ExecutionContext is commonly used by guards and interceptors.",
        "It becomes especially useful when writing reusable authentication, authorization, logging, and other infrastructure logic.",
      ],
      commonMistakes: [
        "<b>Thinking ExecutionContext is the request itself.</b> It is not simply an HTTP request object. It provides information about the current execution environment and handler.",
        "<b>Using ExecutionContext inside every controller method.</b> Most controller methods do not need it directly.",
        "<b>Confusing getClass() with an instance.</b> getClass() gives you the controller type/class, not a controller instance.",
        "<b>Thinking getHandler() executes the method.</b> It returns a reference to the handler; it does not call the handler for you.",
      ],
      quiz: [
        {
          question: "What does ExecutionContext primarily provide?",
          options: [
            "A database connection",
            "Information about the current execution environment and handler",
            "A replacement for DTOs",
            "A replacement for controllers",
          ],
          correctIndex: 1,
          explanation:
            "ExecutionContext gives NestJS infrastructure code information about the current execution, including the application type, controller, handler, and arguments.",
        },
        {
          question: "What does getHandler() return?",
          options: [
            "The database entity",
            "The current HTTP request",
            "A reference to the handler method",
            "The application module",
          ],
          correctIndex: 2,
          explanation:
            "getHandler() returns a reference to the handler method currently being processed.",
        },
      ],
    },

    {
      id: "http-execution-context",
      title: "HTTP Execution Context",
      durationMinutes: 20,
      explanation: `The HTTP context is the one you will probably use most often when building a normal REST API.

Suppose your API receives:

<pre>
GET /users/42
</pre>

Nest needs to process an HTTP request and eventually call something like:

<pre>
@Get(":id")
findOne(@Param("id") id: string) {
  return this.usersService.findOne(id);
}
</pre>

When a guard, interceptor, or filter receives an ExecutionContext, it can switch to the HTTP-specific context.

The important method is:

<pre>
context.switchToHttp()
</pre>

This gives you an HTTP-specific host.

From there you can access the request and response:

<pre>
const httpContext = context.switchToHttp();

const request = httpContext.getRequest();
const response = httpContext.getResponse();
</pre>

This is much clearer than manually reading values from an argument array.

For example, imagine an authentication guard.

The guard may need to inspect:

<pre>
Authorization: Bearer eyJ...
</pre>

The guard can access the HTTP request and read its headers.

A simple version looks like this:

<pre>
const request = context
  .switchToHttp()
  .getRequest();

const authorization = request.headers.authorization;
</pre>

Now the guard can determine whether a token was provided.

Here is a real-world example.

Imagine an online shopping application.

You have:

<pre>
GET /orders
GET /orders/123
POST /orders
</pre>

Before these handlers execute, an authentication guard runs.

The guard needs the current user's HTTP request.

The flow looks like this:

HTTP Request
     |
     v
Authentication Guard
     |
     | switchToHttp()
     v
Request object
     |
     +--> headers
     +--> cookies
     +--> user
     +--> IP
     |
     v
Controller
     |
     v
Service

At a beginner level, you can use this simply to read a header.

At a more advanced level, you might attach a user object to the request after validating a JWT.

For example:

<pre>
request.user = {
  id: "user_123",
  role: "admin"
};
</pre>

Then later infrastructure code can access:

<pre>
const user = request.user;
</pre>

Another important method is <code>getType()</code>.

You can ask the host what kind of execution is happening:

<pre>
const type = context.getType();

console.log(type);
</pre>

For an HTTP application, this will normally be:

<pre>
"http"
</pre>

This becomes very useful when writing reusable infrastructure.

For example, imagine you want one logging interceptor that works with HTTP, WebSockets, and microservices.

You could first determine the context:

<pre>
const type = context.getType();

if (type === "http") {
  // HTTP-specific logic
}

if (type === "rpc") {
  // Microservice-specific logic
}

if (type === "ws") {
  // WebSocket-specific logic
}
</pre>

The important idea is that your infrastructure code does not have to assume that every operation is an HTTP request.

This matters as applications grow.

A small REST API may only use HTTP.

A larger company application might eventually have:

<pre>
Web browser
    |
    +--> REST API
    |
    +--> GraphQL
    |
    +--> WebSocket notifications
    |
    +--> Microservices
</pre>

ExecutionContext gives Nest's reusable infrastructure a way to understand which environment it is operating in.

One practical rule is worth remembering:

<b>If you know you are dealing with HTTP, prefer switchToHttp() instead of manually accessing arguments by numeric indexes.</b>

For example, this is less descriptive:

<pre>
const request = context.getArgByIndex(0);
</pre>

This is much clearer:

<pre>
const request = context
  .switchToHttp()
  .getRequest();
</pre>

The second version communicates what you are trying to access.

It also makes the code easier to understand when somebody reads it six months later.`,
      diagram: `HTTP Request
     |
     v
+-----------------------+
| ExecutionContext      |
+-----------------------+
     |
     | switchToHttp()
     v
+-----------------------+
| HttpArgumentsHost     |
+-----------------------+
     |
     +--> getRequest()
     |       |
     |       +--> headers
     |       +--> cookies
     |       +--> params
     |       +--> query
     |       +--> body
     |
     +--> getResponse()
             |
             +--> status
             +--> headers
             +--> response body`,
      codeExample: {
        title: "Reading the HTTP request inside a guard",
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest();

    const apiKey = request.headers["x-api-key"];

    return apiKey === "my-secret-key";
  }
}`,
      },
      keyTakeaways: [
        "Use switchToHttp() when working with an HTTP request.",
        "getRequest() gives access to the HTTP request object.",
        "getResponse() gives access to the HTTP response object.",
        "HTTP context is commonly used in authentication guards and logging interceptors.",
        "getType() can tell reusable infrastructure which application context is active.",
        "Prefer context-specific helpers over manually accessing argument indexes.",
      ],
      commonMistakes: [
        "<b>Using getArgByIndex(0) everywhere.</b> This makes code dependent on a particular argument layout.",
        "<b>Assuming every NestJS operation is HTTP.</b> Nest also supports WebSockets, microservices, and GraphQL integrations.",
        "<b>Reading request properties without switching to HTTP.</b> Use switchToHttp() when your code specifically expects an HTTP request.",
      ],
      quiz: [
        {
          question: "How do you switch an ExecutionContext to HTTP?",
          options: [
            "context.toHttp()",
            "context.switchToHttp()",
            "context.http()",
            "context.getHttp()",
          ],
          correctIndex: 1,
          explanation:
            "switchToHttp() returns an HTTP-specific arguments host.",
        },
        {
          question: "Which method gives access to the HTTP request?",
          options: [
            "getRequest()",
            "getBodyOnly()",
            "getHttpRequestOnly()",
            "getIncomingRequest()",
          ],
          correctIndex: 0,
          explanation:
            "After switching to HTTP, getRequest() returns the request object.",
        },
      ],
    },

    {
      id: "rpc-and-microservice-context",
      title: "RPC and Microservice Context",
      durationMinutes: 18,
      explanation: `NestJS is not limited to REST APIs.

You can also build microservices where services communicate with each other using message-based or RPC-style communication.

This changes the shape of the data being processed.

Instead of thinking:

<pre>
HTTP request
    |
    +--> request
    +--> response
</pre>

you may have:

<pre>
Microservice message
    |
    +--> data/payload
    +--> context
</pre>

This is why Nest provides a separate RPC execution context.

When you receive an ExecutionContext in a guard, interceptor, or other infrastructure component, you can switch to RPC with:

<pre>
const rpcContext = context.switchToRpc();
</pre>

From there, you can use:

<pre>
rpcContext.getData()
</pre>

to retrieve the message data.

You can also use:

<pre>
rpcContext.getContext()
</pre>

to retrieve transport-specific context information.

Imagine an e-commerce company.

You may have separate services:

<pre>
API Gateway
     |
     +--> Users Service
     |
     +--> Orders Service
     |
     +--> Payments Service
     |
     +--> Inventory Service
</pre>

A customer creates an order.

The Orders Service might need to communicate with the Inventory Service:

<pre>
Orders Service
     |
     | "Reserve these products"
     v
Inventory Service
</pre>

The message could contain:

<pre>
{
  orderId: "order_123",
  products: [
    {
      productId: "prod_1",
      quantity: 2
    }
  ]
}
</pre>

A microservice handler can receive this data.

Infrastructure code can use:

<pre>
const data = context
  .switchToRpc()
  .getData();
</pre>

Now your guard or interceptor can inspect the message.

At a beginner level, think of RPC context as:

<b>"I am not handling a browser request. I am handling a message sent from another part of the system."</b>

That mental model is enough to get started.

At an intermediate level, you may use RPC context for logging.

For example:

<pre>
const data = context
  .switchToRpc()
  .getData();

console.log("Incoming message:", data);
</pre>

At an advanced level, you might build shared infrastructure that works across multiple microservices.

For example, imagine a correlation ID being passed between services.

<pre>
API Gateway
    |
    | correlationId = abc-123
    v
Orders Service
    |
    | correlationId = abc-123
    v
Payments Service
</pre>

Your interceptor could use the RPC context to access the message and transport-specific context, then include the correlation ID in logs.

This helps you trace one business operation across multiple services.

The key point is that RPC context does not behave exactly like HTTP context.

You should not assume:

<pre>
rpcContext.getData()
</pre>

is the same thing as:

<pre>
httpContext.getRequest()
</pre>

They represent different communication models.

A useful way to remember them is:

HTTP:
"Someone sent my API a request."

RPC:
"Another service or client sent my application a message."

That distinction becomes very important when building distributed systems.`,
      diagram: `Service A
    |
    | message
    v
+-----------------------+
| NestJS Microservice   |
+-----------------------+
    |
    v
ExecutionContext
    |
    | switchToRpc()
    v
RpcArgumentsHost
    |
    +--> getData()
    |       |
    |       +--> message payload
    |
    +--> getContext()
            |
            +--> transport context`,
      codeExample: {
        title: "Reading RPC message data",
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class MessageGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const data = context
      .switchToRpc()
      .getData();

    console.log("Incoming message:", data);

    return true;
  }
}`,
      },
      keyTakeaways: [
        "RPC context is used for NestJS microservice-style communication.",
        "Use switchToRpc() to move from the generic execution context to RPC context.",
        "getData() retrieves the message or payload being processed.",
        "getContext() provides access to transport-specific context.",
        "Do not assume RPC context has the same request/response objects as HTTP.",
      ],
      commonMistakes: [
        "<b>Calling getRequest() in an RPC context.</b> RPC operations do not have the same HTTP request object.",
        "<b>Thinking RPC always means HTTP.</b> RPC-style communication is a different execution model.",
        "<b>Ignoring message boundaries.</b> In microservices, payloads often represent commands, events, or requests between services.",
      ],
      quiz: [
        {
          question: "How do you switch an ExecutionContext to RPC?",
          options: [
            "switchToRpc()",
            "switchToMicroservice()",
            "rpc()",
            "getRpcRequest()",
          ],
          correctIndex: 0,
          explanation:
            "switchToRpc() returns the RPC-specific arguments host.",
        },
        {
          question: "Which method retrieves RPC message data?",
          options: [
            "getRequest()",
            "getData()",
            "getPayloadOnly()",
            "getMessageBodyOnly()",
          ],
          correctIndex: 1,
          explanation:
            "RpcArgumentsHost provides getData() for retrieving the data passed to the handler.",
        },
      ],
    },

    {
      id: "websocket-context",
      title: "WebSocket Execution Context",
      durationMinutes: 18,
      explanation: `WebSockets are different from normal HTTP requests because they are designed for ongoing communication.

With a normal REST request, the flow often looks like:

<pre>
Client
  |
  | GET /orders
  v
Server
  |
  | response
  v
Client
</pre>

The connection is used for a request and response.

With WebSockets, the connection can remain open:

<pre>
Client <====================> Server
          open connection
</pre>

Messages can move in either direction while the connection remains active.

This is useful for applications such as:

- chat applications
- live notifications
- multiplayer games
- delivery tracking
- live dashboards
- collaborative editors
- stock or market dashboards

Because the communication model is different, Nest provides WebSocket-specific execution context helpers.

You can switch to WebSocket context with:

<pre>
const wsContext = context.switchToWs();
</pre>

Then you can access:

<pre>
wsContext.getClient()
</pre>

and:

<pre>
wsContext.getData()
</pre>

The client is the connected WebSocket client.

The data is the message being processed.

Imagine a chat application.

A client sends:

<pre>
{
  roomId: "room-123",
  message: "Hello!"
}
</pre>

Your WebSocket handler receives the message.

A guard may need to identify the connected client.

You could use:

<pre>
const client = context
  .switchToWs()
  .getClient();
</pre>

You could then access the message:

<pre>
const data = context
  .switchToWs()
  .getData();
</pre>

Now you have two important pieces:

<pre>
client
   |
   +--> who is connected?

data
   |
   +--> what message did they send?
</pre>

This distinction becomes very useful in real applications.

For example, imagine an online multiplayer game.

A player sends:

<pre>
{
  roomId: "room-7",
  action: "move",
  x: 10,
  y: 20
}
</pre>

The WebSocket guard may determine whether the player is authenticated.

The handler then processes the movement.

The service checks whether the movement is valid.

Finally, the server broadcasts an update to other players.

The architecture might look like:

<pre>
Browser
   |
   | WebSocket message
   v
WebSocket Guard
   |
   v
WebSocket Handler
   |
   v
Game Service
   |
   v
Broadcast update
   |
   +------> Player A
   +------> Player B
   +------> Player C
</pre>

At a beginner level, remember:

<b>getClient() tells you about the connected client.</b>

<b>getData() tells you about the message.</b>

At an advanced level, you can build reusable guards and interceptors that work across multiple WebSocket gateways.

For example, an authentication guard can inspect the connected client and determine whether authentication information was provided during the connection or message flow.

Another important concept is that WebSocket code should not assume the existence of an HTTP response for every message.

A WebSocket operation is message-oriented.

That means code written specifically for WebSockets should use WebSocket context APIs instead of trying to force everything into an HTTP request/response model.`,
      diagram: `WebSocket Client
       |
       | persistent connection
       |
       | message
       v
+-----------------------+
| WebSocket Gateway     |
+-----------------------+
       |
       v
ExecutionContext
       |
       | switchToWs()
       v
WsArgumentsHost
       |
       +--> getClient()
       |       |
       |       +--> connected client
       |
       +--> getData()
               |
               +--> incoming message`,
      codeExample: {
        title: "Reading a WebSocket client and message",
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class ChatGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const wsContext = context.switchToWs();

    const client = wsContext.getClient();
    const data = wsContext.getData();

    console.log("Client:", client.id);
    console.log("Message:", data);

    return true;
  }
}`,
      },
      keyTakeaways: [
        "WebSockets provide persistent, message-oriented communication.",
        "Use switchToWs() to access WebSocket-specific arguments.",
        "getClient() returns the connected client.",
        "getData() returns the incoming message data.",
        "WebSocket code should not assume the same request/response model as HTTP.",
      ],
      commonMistakes: [
        "<b>Treating WebSocket messages like REST requests.</b> WebSockets are connection-oriented and message-based.",
        "<b>Using getRequest() for WebSocket data.</b> Use switchToWs() and then getClient() or getData().",
        "<b>Mixing client identity and message data.</b> getClient() and getData() have different purposes.",
      ],
      quiz: [
        {
          question: "Which method switches to WebSocket context?",
          options: [
            "switchToSocket()",
            "switchToWs()",
            "switchToWebSocketRequest()",
            "wsContext()",
          ],
          correctIndex: 1,
          explanation:
            "switchToWs() returns the WebSocket-specific arguments host.",
        },
        {
          question: "What does getData() provide in WebSocket context?",
          options: [
            "The incoming message data",
            "The database",
            "The controller class",
            "The HTTP response",
          ],
          correctIndex: 0,
          explanation:
            "WsArgumentsHost provides getData() for the data passed to the WebSocket handler.",
        },
      ],
    },

    {
      id: "graphql-execution-context",
      title: "GraphQL Execution Context",
      durationMinutes: 24,
      explanation: `GraphQL is another place where ExecutionContext becomes especially interesting.

With REST, you normally think about:

<pre>
request
response
params
query
body
</pre>

GraphQL has a different execution model.

A GraphQL resolver works with arguments such as:

<pre>
root
args
context
info
</pre>

For example, a GraphQL query might look like:

<pre>
query {
  user(id: "42") {
    id
    name
    email
  }
}
</pre>

The resolver may look like:

<pre>
@Query(() => User)
user(@Args("id") id: string) {
  return this.usersService.findOne(id);
}
</pre>

Now imagine that you have an authentication guard.

The guard receives Nest's generic ExecutionContext.

But GraphQL has its own argument structure.

This is why Nest's GraphQL integration provides:

<pre>
GqlExecutionContext.create(context)
</pre>

This converts the generic Nest execution context into a GraphQL-specific execution context.

You can then access GraphQL-specific information.

For example:

<pre>
const gqlContext = GqlExecutionContext.create(context);

const gqlArgs = gqlContext.getArgs();
const gqlContextValue = gqlContext.getContext();
</pre>

This is an important pattern.

Think of it as:

<pre>
Generic ExecutionContext
          |
          v
GqlExecutionContext.create()
          |
          v
GraphQL-specific context
          |
          +--> root
          +--> args
          +--> context
          +--> info
</pre>

Why does this matter?

Imagine a GraphQL application where authentication information is placed in the GraphQL context.

For example:

<pre>
context: ({ req }) => ({
  req,
})
</pre>

A guard can then access that context and inspect the request.

A simplified authentication guard could look like:

<pre>
const gqlContext = GqlExecutionContext.create(context);

const { req } = gqlContext.getContext();

const authorization = req.headers.authorization;
</pre>

Now the same general authentication idea can work with GraphQL.

This is a good example of why Nest's execution context abstraction exists.

Nest wants guards and interceptors to be reusable, but different application types do not expose their data in exactly the same way.

For REST:

<pre>
context.switchToHttp()
</pre>

For RPC:

<pre>
context.switchToRpc()
</pre>

For WebSockets:

<pre>
context.switchToWs()
</pre>

For GraphQL:

<pre>
GqlExecutionContext.create(context)
</pre>

That gives you the correct view of the current operation.

Here is a real-world example.

Imagine a company has a frontend application that uses GraphQL.

The frontend sends:

<pre>
query {
  orders {
    id
    total
  }
}
</pre>

The GraphQL resolver handles the query.

But before the resolver runs, the authentication guard needs to know who the current user is.

The flow can look like:

<pre>
GraphQL Request
       |
       v
Authentication Guard
       |
       v
GqlExecutionContext
       |
       +--> GraphQL context
       |       |
       |       +--> request
       |       +--> user
       |
       v
GraphQL Resolver
       |
       v
Orders Service
       |
       v
Database
</pre>

At an advanced level, you can create reusable guards that understand roles and permissions.

For example:

<pre>
@Roles("admin")
@Query(() => [User])
users() {
  return this.usersService.findAll();
}
</pre>

The guard can use:

<pre>
context.getHandler()
context.getClass()
</pre>

to identify the resolver and controller/resolver class, while GraphQL-specific helpers allow it to retrieve the actual GraphQL context.

This gives you a powerful combination:

<pre>
ExecutionContext
    |
    +--> Which handler?
    |
    +--> Which class?
    |
    +--> What application type?
    |
    +--> What arguments?
             |
             +--> GraphQL
             +--> HTTP
             +--> RPC
             +--> WebSocket
</pre>

One important point:

<b>GraphQL does not simply behave like REST with a different URL.</b>

GraphQL has its own execution model, so code that needs GraphQL-specific arguments should use the GraphQL execution context helpers.

This is particularly important when writing guards, interceptors, and filters that need access to GraphQL-specific values.`,
      diagram: `GraphQL Client
       |
       | Query / Mutation
       v
+-----------------------+
| GraphQL Resolver      |
+-----------------------+
       |
       v
ExecutionContext
       |
       | GqlExecutionContext.create()
       v
+-----------------------+
| GraphQL Context       |
+-----------------------+
       |
       +--> getRoot()
       +--> getArgs()
       +--> getContext()
       +--> getInfo()
       |
       v
Resolver
       |
       v
Service`,
      codeExample: {
        title: "Authentication guard for GraphQL",
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GraphqlAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);

    const graphqlContext = gqlContext.getContext();

    const request = graphqlContext.req;

    const authorization =
      request.headers.authorization;

    return Boolean(authorization);
  }
}`,
      },
      keyTakeaways: [
        "GraphQL has a different argument structure from REST.",
        "Use GqlExecutionContext.create(context) when working with GraphQL guards and interceptors.",
        "GraphQL exposes concepts such as root, args, context, and info.",
        "The GraphQL context can contain request-specific data such as the HTTP request or authenticated user.",
        "ExecutionContext still provides useful information such as the current handler and class.",
      ],
      commonMistakes: [
        "<b>Treating GraphQL exactly like REST.</b> GraphQL has its own resolver argument structure.",
        "<b>Reading HTTP request data directly from the generic context.</b> In GraphQL infrastructure code, first transform the context with GqlExecutionContext.create().",
        "<b>Forgetting to configure GraphQL context.</b> If your application needs req/res in GraphQL context, configure the GraphQL context appropriately.",
        "<b>Assuming GraphQL only works with GraphQL-specific guards.</b> Nest's guard and interceptor concepts can be reused, but GraphQL-specific context conversion may be required.",
      ],
      quiz: [
        {
          question: "How do you adapt a Nest ExecutionContext for GraphQL?",
          options: [
            "GraphQLExecutionContext.convert()",
            "GqlExecutionContext.create()",
            "context.switchToGraphql()",
            "context.toGraphQL()",
          ],
          correctIndex: 1,
          explanation:
            "Nest's GraphQL integration provides GqlExecutionContext.create() for converting the generic execution context.",
        },
        {
          question: "Which is a GraphQL resolver argument?",
          options: [
            "args",
            "socket",
            "responseStatus",
            "middleware",
          ],
          correctIndex: 0,
          explanation:
            "GraphQL execution works with root, args, context, and info.",
        },
      ],
    },

    {
      id: "arguments-host-and-building-generic-infrastructure",
      title: "ArgumentsHost and Building Context-Aware Infrastructure",
      durationMinutes: 20,
      explanation: `Now that you understand HTTP, RPC, WebSockets, and GraphQL, the bigger picture becomes much easier.

NestJS wants infrastructure such as guards, interceptors, and filters to work across different application types.

That is why ArgumentsHost exists.

ArgumentsHost gives you access to the arguments being passed to the current handler without forcing every piece of infrastructure to know exactly how every transport works.

You can think of ArgumentsHost as a wrapper around the current handler arguments.

For example, an HTTP handler might conceptually receive:

<pre>
request
response
next
</pre>

A WebSocket handler may receive:

<pre>
client
data
</pre>

An RPC handler may receive:

<pre>
data
context
</pre>

GraphQL has:

<pre>
root
args
context
info
</pre>

ArgumentsHost gives Nest a common abstraction over these different shapes.

You can ask:

<pre>
host.getType()
</pre>

to determine the current application type.

You can also use:

<pre>
host.getArgs()
</pre>

to retrieve the underlying arguments.

You can use:

<pre>
host.getArgByIndex(0)
</pre>

to retrieve an individual argument.

However, using numeric indexes can make code harder to reuse.

For example:

<pre>
const request = host.getArgByIndex(0);
</pre>

This only makes sense if you already know that argument 0 is a request.

A more explicit approach is:

<pre>
const http = host.switchToHttp();

const request = http.getRequest();
</pre>

Now the code clearly says:

"I am working with an HTTP request."

This is especially important when writing reusable infrastructure.

Imagine a logging system.

You want logs like:

<pre>
HTTP GET /users/42
WebSocket message chat.message
RPC inventory.reserve
GraphQL Query users
</pre>

Your logging interceptor could inspect the execution type:

<pre>
const type = context.getType();
</pre>

Then choose the correct strategy.

For HTTP:

<pre>
const request = context
  .switchToHttp()
  .getRequest();

console.log(request.method);
console.log(request.url);
</pre>

For WebSockets:

<pre>
const ws = context.switchToWs();

const client = ws.getClient();
const data = ws.getData();
</pre>

For RPC:

<pre>
const rpc = context.switchToRpc();

const data = rpc.getData();
</pre>

For GraphQL:

<pre>
const gql = GqlExecutionContext.create(context);

const args = gql.getArgs();
</pre>

This is the beginning of context-aware infrastructure.

Here is a real-world example.

Imagine an observability platform for a large company.

The company has:

<pre>
REST API
GraphQL API
WebSocket gateway
Microservices
</pre>

Every operation needs logging.

Instead of creating completely unrelated logging systems, you can create a common interceptor that understands the execution context.

Conceptually:

<pre>
Incoming operation
       |
       v
Logging Interceptor
       |
       v
What type?
       |
       +---- HTTP ------> HTTP logger
       |
       +---- GraphQL ----> GraphQL logger
       |
       +---- WebSocket --> WebSocket logger
       |
       +---- RPC --------> RPC logger
</pre>

This is where ExecutionContext becomes much more than a theoretical concept.

It allows you to write infrastructure that understands what is happening without tightly coupling every component to one communication mechanism.

At an advanced level, you can also combine ExecutionContext with metadata.

For example:

<pre>
@SetMetadata("audit", true)
@Post("refund")
refundOrder() {
  ...
}
</pre>

A guard or interceptor can inspect:

<pre>
context.getHandler()
context.getClass()
</pre>

and then use metadata reflection to determine whether the current operation requires special handling.

This can be used for things such as:

- roles
- permissions
- audit logging
- rate limits
- feature flags
- public/private routes
- tenant restrictions
- security policies

For example:

<pre>
@Roles("admin")
@Audit("financial-operation")
@Post("refund")
refundOrder() {
  ...
}
</pre>

The infrastructure layer can inspect the metadata and decide what rules should apply.

This creates a very powerful architecture:

<pre>
Controller / Resolver
       |
       | decorators + metadata
       v
ExecutionContext
       |
       +--> identify handler
       +--> identify class
       +--> identify transport
       +--> access arguments
       |
       v
Guard / Interceptor / Filter
       |
       v
Reusable application infrastructure
</pre>

One final concept is very important.

Do not write context-specific code unless you actually need context-specific information.

If a guard only needs to know whether a user has already been authenticated, keep it simple.

If an interceptor needs to measure HTTP response timing, switch to HTTP.

If a logger must support multiple transports, inspect the execution type.

The goal is not to use ExecutionContext everywhere.

The goal is to use it when infrastructure needs to understand the environment in which Nest is currently executing your code.`,
      diagram: `                    Incoming Operation
                           |
                           v
                 +--------------------+
                 | ExecutionContext   |
                 +--------------------+
                           |
              +------------+-------------+
              |            |             |
              v            v             v
           getType()   getClass()    getHandler()
              |
       +------+------+------+------+
       |      |      |      |
       v      v      v      v
     HTTP    RPC     WS   GraphQL
       |      |      |      |
       v      v      v      v
   switch  switch  switch  GqlExecution
   ToHttp  ToRpc   ToWs    Context
       |      |      |      |
       +------+------+------+
              |
              v
      Guard / Interceptor
              |
              v
       Reusable logic`,
      codeExample: {
        title: "A context-aware logging interceptor",
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class ContextLoggingInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const type = context.getType();

    const controller = context.getClass().name;
    const handler = context.getHandler().name;

    console.log({
      type,
      controller,
      handler,
    });

    if (type === "http") {
      const request = context
        .switchToHttp()
        .getRequest();

      console.log({
        method: request.method,
        url: request.url,
      });
    }

    if (type === "rpc") {
      const data = context
        .switchToRpc()
        .getData();

      console.log({
        rpcData: data,
      });
    }

    if (type === "ws") {
      const ws = context.switchToWs();

      console.log({
        client: ws.getClient(),
        data: ws.getData(),
      });
    }

    if (type === "graphql") {
      const gql = GqlExecutionContext.create(context);

      console.log({
        args: gql.getArgs(),
      });
    }

    return next.handle().pipe(
      tap(() => {
        console.log("Operation completed");
      }),
    );
  }
}`,
      },
      keyTakeaways: [
        "ArgumentsHost abstracts the arguments passed to the current handler.",
        "getType() helps determine the active application context.",
        "switchToHttp(), switchToRpc(), and switchToWs() provide transport-specific access.",
        "GraphQL uses GqlExecutionContext.create() for GraphQL-specific execution information.",
        "getClass() and getHandler() are useful when building reusable guards and interceptors.",
        "ExecutionContext becomes especially powerful when combined with metadata.",
        "Context-aware infrastructure is useful for logging, authentication, authorization, auditing, metrics, and other cross-cutting concerns.",
      ],
      commonMistakes: [
        "<b>Using getArgByIndex() everywhere.</b> Prefer context-specific helper methods when you know the transport.",
        "<b>Writing one giant conditional for every possible context.</b> Keep context-specific logic organized and only support contexts your application actually needs.",
        "<b>Using ExecutionContext just because it is available.</b> Use it when infrastructure actually needs execution information.",
        "<b>Forgetting GraphQL has its own context conversion.</b> Use GqlExecutionContext.create() for GraphQL-specific access.",
        "<b>Confusing handler metadata with request data.</b> getHandler() identifies the method; it does not contain the incoming request payload.",
      ],
      quiz: [
        {
          question: "What does ArgumentsHost represent?",
          options: [
            "Only an HTTP request",
            "An abstraction over the arguments passed to the current handler",
            "A database connection",
            "A Nest module",
          ],
          correctIndex: 1,
          explanation:
            "ArgumentsHost provides an abstraction over the arguments passed to a handler across different application contexts.",
        },
        {
          question: "Why is getArgByIndex() usually less preferable than switchToHttp()?",
          options: [
            "It is not TypeScript",
            "It couples code to a particular argument position",
            "It cannot read data",
            "It only works with databases",
          ],
          correctIndex: 1,
          explanation:
            "Using a numeric index assumes a particular argument layout. Context-specific helpers communicate the intended context more clearly.",
        },
        {
          question: "Which tool is used to adapt ExecutionContext for GraphQL?",
          options: [
            "GqlExecutionContext.create()",
            "switchToGraphql()",
            "GraphQLHost.create()",
            "GraphQLExecutionContext.switch()",
          ],
          correctIndex: 0,
          explanation:
            "Nest's GraphQL integration provides GqlExecutionContext.create() for this purpose.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the main purpose of ExecutionContext?",
      options: [
        "To connect NestJS directly to a database",
        "To provide information about the current execution and handler",
        "To replace services",
        "To create DTOs",
      ],
      correctIndex: 1,
      explanation:
        "ExecutionContext gives infrastructure components information about the current execution environment, handler, controller, and arguments.",
    },
    {
      question: "Which class does ExecutionContext extend?",
      options: [
        "Controller",
        "ArgumentsHost",
        "HttpException",
        "CallHandler",
      ],
      correctIndex: 1,
      explanation:
        "ExecutionContext extends ArgumentsHost and adds methods such as getClass() and getHandler().",
    },
    {
      question: "What does getClass() provide?",
      options: [
        "The database entity",
        "The current HTTP request",
        "The controller class associated with the handler",
        "The response body",
      ],
      correctIndex: 2,
      explanation:
        "getClass() returns the controller class type associated with the current handler.",
    },
    {
      question: "What does getHandler() provide?",
      options: [
        "A reference to the current handler method",
        "The request body",
        "The database service",
        "The current user",
      ],
      correctIndex: 0,
      explanation:
        "getHandler() returns a reference to the handler method that is being processed.",
    },
    {
      question: "How do you switch an ExecutionContext to HTTP?",
      options: [
        "context.http()",
        "context.switchToHttp()",
        "context.getHttp()",
        "context.toRequest()",
      ],
      correctIndex: 1,
      explanation:
        "switchToHttp() returns the HTTP-specific arguments host.",
    },
    {
      question: "How do you retrieve RPC message data?",
      options: [
        "switchToRpc().getData()",
        "switchToRpc().getRequest()",
        "switchToHttp().getData()",
        "getRpcBody()",
      ],
      correctIndex: 0,
      explanation:
        "RpcArgumentsHost provides getData() for retrieving the message data.",
    },
    {
      question: "Which methods are available from WebSocket context?",
      options: [
        "getRequest() and getResponse()",
        "getClient() and getData()",
        "getBody() and getHeaders()",
        "getQuery() and getParams()",
      ],
      correctIndex: 1,
      explanation:
        "WsArgumentsHost provides getClient() and getData().",
    },
    {
      question: "How should GraphQL infrastructure access GraphQL-specific execution information?",
      options: [
        "context.switchToGraphql()",
        "GqlExecutionContext.create(context)",
        "context.getGraphql()",
        "GraphQLHost.switch(context)",
      ],
      correctIndex: 1,
      explanation:
        "Nest's GraphQL integration provides GqlExecutionContext.create(context).",
    },
    {
      question: "What does getType() help you determine?",
      options: [
        "The database type",
        "The current Nest application context",
        "The TypeScript version",
        "The controller's return type",
      ],
      correctIndex: 1,
      explanation:
        "getType() can identify contexts such as HTTP, RPC, and WebSocket, with integrations such as GraphQL providing their own context type.",
    },
    {
      question: "Why should you avoid relying on getArgByIndex() when a context-specific helper exists?",
      options: [
        "It is always slower",
        "It couples the code to a particular argument position",
        "It cannot be used in TypeScript",
        "It only works in development",
      ],
      correctIndex: 1,
      explanation:
        "Using numeric indexes makes the code depend on the underlying argument layout. Context-specific helpers are clearer and more reusable.",
    },
  ],

  project: {
    name: "Multi-Context NestJS Monitoring System",
    goal: "Build a small NestJS monitoring and security layer that demonstrates how ExecutionContext changes across HTTP, WebSocket, RPC, and GraphQL operations.",
    brief: `Build a monitoring and security system for a fictional e-commerce company called ShopFlow.

The company has several ways clients and internal services communicate:

- REST API for the web application
- GraphQL API for an admin dashboard
- WebSocket gateway for live order notifications
- Microservice/RPC communication between Orders and Inventory services

Your goal is not simply to create four unrelated examples.

The goal is to understand how the same NestJS infrastructure concepts can work across different execution contexts.

You should build the project incrementally.

Start with HTTP because it is the easiest context to understand.

Then add WebSockets.

Then add RPC.

Finally add GraphQL.

At the end, create a monitoring interceptor that identifies the current execution context and logs useful information about the operation being processed.`,
    steps: [
      "Create a new NestJS project called shopflow-context-demo.",
      "Create a Users module with a UsersController and UsersService.",
      "Create an Orders module with an OrdersController and OrdersService.",
      "Create a basic REST endpoint such as GET /orders.",
      "Create an authentication guard that receives ExecutionContext.",
      "Inside the guard, use switchToHttp() to access the request.",
      "Read an Authorization header from the HTTP request.",
      "Use getClass() and getHandler() inside the guard to log which controller and method are being protected.",
      "Create a LoggingInterceptor that receives ExecutionContext and CallHandler.",
      "Use getType() to identify that the REST request is using the HTTP context.",
      "Use switchToHttp() inside the interceptor to read the request method and URL.",
      "Add a WebSocket gateway for live order updates.",
      "Create a WebSocket message handler such as order.status.",
      "Create a WebSocket guard that uses switchToWs().",
      "Use getClient() to identify the connected WebSocket client.",
      "Use getData() to inspect the incoming WebSocket message.",
      "Add a simple RPC/microservice example representing communication between Orders and Inventory.",
      "Create an RPC handler that receives inventory reservation messages.",
      "Use switchToRpc() to access the message data.",
      "Log the RPC payload and demonstrate how the same infrastructure idea differs from HTTP.",
      "Add GraphQL to the project.",
      "Create a basic GraphQL query such as orders.",
      "Create a GraphQL authentication guard.",
      "Use GqlExecutionContext.create(context) inside the guard.",
      "Access the GraphQL context and retrieve request-specific information.",
      "Create a context-aware logging interceptor.",
      "Use context.getType() to identify HTTP, RPC, WebSocket, or GraphQL operations.",
      "For HTTP operations, use switchToHttp().",
      "For RPC operations, use switchToRpc().",
      "For WebSocket operations, use switchToWs().",
      "For GraphQL operations, use GqlExecutionContext.create().",
      "Use getClass() and getHandler() to log the controller or resolver class and current handler.",
      "Create a standard log structure containing context type, class name, handler name, and a useful operation identifier.",
      "Test the monitoring system using at least one HTTP request, one WebSocket message, one RPC message, and one GraphQL query."
    ],
    acceptance: [
      "The project contains at least one working HTTP controller.",
      "At least one guard receives ExecutionContext.",
      "The HTTP guard uses switchToHttp() rather than relying on a numeric argument index.",
      "At least one interceptor uses ExecutionContext.",
      "The interceptor logs getClass() and getHandler().",
      "The interceptor can identify the active context type.",
      "A WebSocket gateway demonstrates switchToWs().",
      "The WebSocket example uses getClient() and getData().",
      "An RPC or microservice example demonstrates switchToRpc().",
      "The RPC example uses getData() to access the incoming message.",
      "A GraphQL example demonstrates GqlExecutionContext.create().",
      "The GraphQL example can access GraphQL-specific context information.",
      "The code does not assume that every NestJS execution is HTTP.",
      "The project demonstrates why context-specific helpers are clearer than getArgByIndex().",
      "The final logging layer can explain which transport, class, and handler are being executed."
    ],
    stretch: [
      "Create a reusable ContextInspectorService that formats information from ExecutionContext.",
      "Add correlation IDs to HTTP, WebSocket, RPC, and GraphQL operations where appropriate.",
      "Create a shared authentication strategy that supports both REST and GraphQL.",
      "Add role metadata such as @Roles('admin') and inspect getHandler() and getClass() from a guard.",
      "Create an audit decorator such as @Audit('order.refund') and read its metadata from an interceptor.",
      "Add execution duration measurement so the monitoring system reports how long each operation takes.",
      "Create different log formatting strategies for HTTP, GraphQL, WebSocket, and RPC operations.",
      "Add structured JSON logging suitable for a production log aggregation system.",
      "Create tests that verify the correct context-specific APIs are used.",
      "Create a dashboard endpoint showing the number of HTTP, GraphQL, WebSocket, and RPC operations processed."
    ],
  },
};
