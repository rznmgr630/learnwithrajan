import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_17_LESSONS: LessonDay = {
  day: 17,
  title: "Guards",
  totalMinutes: 94,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-are-guards",
      title: "What are Guards?",
      durationMinutes: 18,
      explanation: `Imagine your API has this endpoint:

<code>GET /orders/123</code>

A request arrives from a user.

Before your controller starts doing its job, you may want to ask:

<b>"Is this request allowed to continue?"</b>

That is where a <b>Guard</b> comes in.

A NestJS guard is a class that decides whether a request should continue to the next stage of the request lifecycle.

A guard implements the <code>CanActivate</code> interface and provides a method called <code>canActivate()</code>.

The method returns a value that tells NestJS whether the request can continue.

Conceptually:

<code>true</code> means:

"Yes. Let this request continue."

<code>false</code> means:

"No. Stop this request."

This makes guards particularly useful for <b>authentication and authorization</b>.

Authentication asks:

<b>"Who are you?"</b>

Authorization asks:

<b>"Are you allowed to do this?"</b>

These are related but different questions.

For example, imagine an online store.

A customer logs into the application.

The customer sends:

<code>DELETE /products/123</code>

The API may first determine that the user is logged in.

That is authentication.

Then it may determine whether the logged-in user has permission to delete products.

That is authorization.

A guard can participate in both of these decisions.

The request flow might look like:

<code>Request
   ↓
Authentication Guard
   ↓
Authorization Guard
   ↓
Controller
   ↓
Service
   ↓
Database</code>

If the authentication guard determines that the user is not logged in, the request should not reach the controller.

This is important because you generally do not want every controller method to contain code like:

<code>if (!user) {
  throw new UnauthorizedException();
}</code>

over and over again.

Instead, you can put authentication logic into a reusable guard.

Then you can protect multiple endpoints with the same guard.

For example:

<code>GET /profile</code>

<code>GET /orders</code>

<code>POST /orders</code>

<code>DELETE /orders/123</code>

could all use the same authentication guard.

There is another important difference between guards and middleware.

Middleware runs earlier in the request lifecycle and is excellent for things such as logging, request IDs, and general request preparation.

Guards are specifically designed around the question:

<b>"Should this request be allowed to continue?"</b>

That makes guards a natural place for authentication and authorization decisions.

<b>Beginner real-world example:</b>

Imagine a school API.

Anyone can visit:

<code>GET /courses</code>

but only logged-in students can access:

<code>GET /my-courses</code>

An authentication guard can check whether the request belongs to a logged-in student.

<b>Intermediate real-world example:</b>

Imagine an online store.

Customers can view their orders:

<code>GET /orders</code>

but only administrators can delete products:

<code>DELETE /products/:id</code>

The first guard can verify that the user is authenticated.

A second authorization check can verify that the user has the required role.

<b>Advanced real-world example:</b>

Imagine a SaaS application where every user belongs to an organization.

A request might contain a valid access token, so authentication succeeds.

But the user may still not be allowed to access:

<code>GET /organizations/acme/billing</code>

The authorization layer needs to check more than "is this user logged in?"

It may need to check:

- the user's identity
- the organization they belong to
- their role
- the requested resource
- the action they are attempting
- whether their account is active

The guard can participate in this decision before the controller performs the business operation.

The most important beginner idea is:

<b>A guard is a gatekeeper.</b>

A request arrives.

The guard looks at the request and decides whether it should continue.

If the answer is yes, the request moves forward.

If the answer is no, the request is stopped.`,
      diagram: `Client
  |
  | HTTP Request
  v
Middleware
  |
  v
Guard
  |
  | canActivate()
  |
  +---- true ----> Continue
  |
  +---- false ---> Stop
  |
  v
Controller
  |
  v
Service
  |
  v
Response

Think of a Guard as a gatekeeper
standing before protected application logic.`,
      codeExample: {
        title: "A simple Guard",
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class SimpleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}`,
      },
      keyTakeaways: [
        "A Guard decides whether a request can continue.",
        "Guards implement the `CanActivate` interface.",
        "The main method is `canActivate()`.",
        "`true` allows the request to continue.",
        "`false` prevents the request from continuing.",
        "Guards are commonly used for authentication and authorization.",
        "Think of a Guard as a gatekeeper for protected application logic.",
      ],
      commonMistakes: [
        "<b>Thinking Guards are the same as Middleware.</b> Middleware is general request-processing logic, while Guards are designed around deciding whether a request can proceed.",
        "<b>Putting all business logic inside a Guard.</b> A Guard should decide access, not create orders, calculate invoices, or perform unrelated business operations.",
        "<b>Returning true without checking anything in a real authentication guard.</b> That would allow every request through.",
        "<b>Confusing authentication and authorization.</b> Authentication identifies the user; authorization determines what that user is allowed to do.",
      ],
      quiz: [
        {
          question: "What is the main job of a NestJS Guard?",
          options: [
            "Create database tables",
            "Decide whether a request can continue",
            "Render HTML",
            "Start the application",
          ],
          correctIndex: 1,
          explanation: "Guards decide whether a request should be allowed to continue through the NestJS request lifecycle.",
        },
        {
          question: "What does `true` from `canActivate()` normally mean?",
          options: [
            "Delete the request",
            "Restart the server",
            "Allow the request to continue",
            "Send a 500 response",
          ],
          correctIndex: 2,
          explanation: "Returning true allows the request to continue to the next stage.",
        },
      ],
    },

    {
      id: "canactivate-and-execution-context",
      title: "CanActivate and ExecutionContext",
      durationMinutes: 18,
      explanation: `Now that you understand the basic idea of a Guard, let's look at the part you will see in almost every real NestJS Guard:

<code>canActivate()</code>

The method receives an <code>ExecutionContext</code>.

At first, <code>ExecutionContext</code> can look intimidating.

You can think of it as NestJS giving your Guard information about <b>the request that is currently being processed and the handler that will process it</b>.

For an HTTP request, you can use:

<code>context.switchToHttp()</code>

to work with the HTTP context.

Then:

<code>context.switchToHttp().getRequest()</code>

gives you the request object.

That means a Guard can inspect things such as:

<code>request.headers</code>

<code>request.user</code>

<code>request.params</code>

<code>request.query</code>

and other request information.

For example, a very simple Guard could check for a custom header:

<code>x-api-key</code>

The client sends:

<code>x-api-key: my-secret-key</code>

The Guard checks it.

If it matches the expected value, the Guard returns true.

If it does not match, the Guard can return false or throw an appropriate exception.

This is a useful learning example because you can see exactly what a Guard does without introducing JWTs or a complete authentication system yet.

There is another useful feature of <code>ExecutionContext</code>.

A Guard can find out which controller and handler are about to execute.

This becomes extremely useful for authorization.

For example, you might have:

<code>@Roles("admin")</code>

on a controller method.

The Guard can read that metadata and determine that the endpoint requires an administrator role.

We will build toward that idea later.

For now, focus on the mental model:

<code>ExecutionContext
      |
      +--> Current request
      |
      +--> Current controller
      |
      +--> Current handler
      |
      +--> HTTP context</code>

This information allows Guards to make decisions based on where the request is going and who is making it.

<b>Beginner real-world example:</b>

You build an internal API where requests need a simple API key.

The Guard reads:

<code>request.headers["x-api-key"]</code>

and checks it.

<b>Intermediate real-world example:</b>

Your application puts the authenticated user on:

<code>request.user</code>

The Guard reads that user and checks whether they have an active account.

<b>Advanced real-world example:</b>

Your authorization system uses metadata such as:

<code>@Roles("admin")</code>

The Guard uses <code>Reflector</code> and <code>ExecutionContext</code> to determine which roles the current route requires and compares those requirements with the authenticated user's roles.

The important thing is not to memorize every method immediately.

Start with:

<code>context.switchToHttp().getRequest()</code>

When you need to understand the current request, that is one of the most important things to know.`,
      diagram: `Guard
  |
  | canActivate(context)
  v
ExecutionContext
  |
  +--> HTTP context
  |      |
  |      +--> Request
  |             |
  |             +--> headers
  |             +--> params
  |             +--> query
  |             +--> user
  |
  +--> Controller
  |
  +--> Handler
  |
  v
Guard makes access decision`,
      codeExample: {
        title: "Reading a request inside a Guard",
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

    return apiKey === "development-key";
  }
}`,
      },
      keyTakeaways: [
        "`canActivate()` receives an `ExecutionContext`.",
        "`ExecutionContext` gives a Guard information about the current execution.",
        "`switchToHttp().getRequest()` gives access to the HTTP request.",
        "A Guard can inspect headers, params, query values, and request data.",
        "ExecutionContext also lets advanced Guards work with controller and handler metadata.",
      ],
      commonMistakes: [
        "<b>Trying to use `req` without getting it from the context.</b> A Guard normally receives `ExecutionContext` and gets the request from it.",
        "<b>Thinking ExecutionContext only contains headers.</b> It provides information about the current execution context, including the handler and controller.",
        "<b>Putting secrets directly in source code.</b> Real API keys and secrets should normally come from configuration or a secret-management system.",
      ],
      quiz: [
        {
          question: "How do you normally get the HTTP request inside a Guard?",
          options: [
            "`context.switchToHttp().getRequest()`",
            "`context.getDatabase()`",
            "`context.getBody()`",
            "`context.request()`",
          ],
          correctIndex: 0,
          explanation: "For HTTP requests, `switchToHttp().getRequest()` provides access to the request object.",
        },
        {
          question: "What can ExecutionContext help a Guard understand?",
          options: [
            "Only the database",
            "The current request and execution information",
            "Only environment variables",
            "Only TypeScript types",
          ],
          correctIndex: 1,
          explanation: "ExecutionContext provides information about the current execution, including HTTP request context and the handler/controller.",
        },
      ],
    },

    {
      id: "authentication-guards",
      title: "Authentication Guards",
      durationMinutes: 20,
      explanation: `Let's move from the simple API-key example to something closer to what you will build in real applications.

Suppose a user logs into your application.

The server gives them an access token.

For example:

<code>Authorization: Bearer eyJ...</code>

Later, the user requests:

<code>GET /orders</code>

The server needs to answer:

<b>"Is this token valid, and who does it belong to?"</b>

That is authentication.

A common approach is to use an authentication Guard.

The Guard reads the Authorization header, extracts the token, verifies it, and then attaches the authenticated user to the request.

The controller can then access the user.

Conceptually:

<code>Authorization header
        |
        v
Authentication Guard
        |
        | verify token
        v
   Is token valid?
      /       \\
    yes       no
     |         |
     v         v
request.user  reject
     |
     v
Controller</code>

One important design pattern is that the Guard does not necessarily need to contain all the token verification code itself.

You can create an authentication service responsible for authentication-related operations.

For example:

<code>AuthService</code>

could contain:

<code>validateToken()</code>

The Guard calls the service.

This keeps responsibilities separated.

The Guard's job is:

<b>"Can this request continue?"</b>

The authentication service's job is:

<b>"How do I validate this credential?"</b>

This distinction becomes valuable as your application grows.

For example, your authentication system might eventually support:

- access tokens
- refresh tokens
- API keys
- session authentication
- multiple identity providers

You do not want a giant Guard containing every authentication rule.

<b>Beginner real-world example:</b>

Your first API has a hard-coded development token.

The Guard checks the Authorization header and allows the request only if the token matches.

This is useful for learning the mechanics.

<b>Intermediate real-world example:</b>

Your application uses JWT access tokens.

The Guard extracts the bearer token and uses an authentication service or authentication strategy to validate it.

After validation, it places the authenticated user on:

<code>request.user</code>

Then the controller can use that user.

<b>Advanced real-world example:</b>

A SaaS application supports multiple authentication methods.

A request may be authenticated through an access token, API key, or another identity provider.

The authentication layer validates the credential and produces a normalized user identity.

The Guard then ensures that the request is authenticated before protected controllers execute.

Notice something important here.

Authentication does not mean the user can do everything.

Imagine:

<code>request.user = {
  id: "u123",
  role: "customer"
}</code>

The user is authenticated.

But they may still not be allowed to:

<code>DELETE /products/123</code>

That is authorization.

Authentication answers:

<b>"Who are you?"</b>

Authorization answers:

<b>"What are you allowed to do?"</b>

Keeping those two concepts separate will save you a lot of confusion later.`,
      diagram: `Client
  |
  | Authorization: Bearer <token>
  v
Authentication Guard
  |
  +--> extract token
  |
  +--> validate token
  |
  +--> identify user
  |
  +--> request.user = user
  |
  v
Authorization Guard
  |
  +--> check role/permission
  |
  v
Controller
  |
  v
Service`,
      codeExample: {
        title: "Basic authentication Guard example",
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest();

    const authorization =
      request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        "Authorization header is required",
      );
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException(
        "Invalid authorization format",
      );
    }

    // Learning example only.
    // A real application should validate the token
    // using an authentication service.
    if (token !== "development-token") {
      throw new UnauthorizedException(
        "Invalid token",
      );
    }

    request.user = {
      id: "user-123",
      role: "customer",
    };

    return true;
  }
}`,
      },
      keyTakeaways: [
        "Authentication determines whether a request has a valid identity.",
        "Authentication Guards commonly inspect credentials from the request.",
        "A successful authentication process can attach the authenticated user to `request.user`.",
        "Keep token-validation details in an appropriate authentication service or strategy as the application grows.",
        "Authentication and authorization are different concerns.",
      ],
      commonMistakes: [
        "<b>Thinking a valid token means the user can perform every action.</b> Authentication proves identity; authorization decides permissions.",
        "<b>Hard-coding production secrets.</b> Learning examples may use simple values, but production credentials should come from secure configuration.",
        "<b>Putting the entire authentication system inside one Guard.</b> Move token validation and identity logic into appropriate services as the system grows.",
        "<b>Returning `false` for every authentication failure without understanding the API behavior.</b> In many APIs, throwing `UnauthorizedException` provides a clearer 401 response.",
      ],
      quiz: [
        {
          question: "What question does authentication answer?",
          options: [
            "What database should I use?",
            "Who is this user?",
            "Which DTO should I use?",
            "Which module should load first?",
          ],
          correctIndex: 1,
          explanation: "Authentication is about establishing the identity of the requester.",
        },
        {
          question: "Where is authenticated user information commonly attached?",
          options: [
            "`request.user`",
            "`request.database`",
            "`request.module`",
            "`request.controller`",
          ],
          correctIndex: 0,
          explanation: "Authentication guards commonly attach the authenticated user to `request.user` for later application code.",
        },
      ],
    },

    {
      id: "authorization-guards",
      title: "Authorization Guards and Roles",
      durationMinutes: 20,
      explanation: `Now suppose the user is already authenticated.

You know who they are.

But your API still needs to answer:

<b>"Are they allowed to perform this particular action?"</b>

This is authorization.

Imagine your application has three roles:

<code>customer</code>

<code>manager</code>

<code>admin</code>

You might have these rules:

<code>GET /products</code>

Everyone can access it.

<code>POST /products</code>

Managers and administrators can create products.

<code>DELETE /products/:id</code>

Only administrators can delete products.

The authentication Guard can establish:

<code>request.user = {
  id: "u123",
  role: "manager"
}</code>

Then an authorization Guard can ask:

<code>Does this route require admin?</code>

and:

<code>Does request.user.role equal admin?</code>

If the answer is no, the request is rejected.

This is where route metadata becomes very useful.

You can create a decorator such as:

<code>@Roles("admin")</code>

Then place it on a controller method:

<code>@Roles("admin")
@Delete(":id")
removeProduct() {
  ...
}</code>

The authorization Guard can read that metadata.

This gives you a very clean design:

<code>Controller
   |
   +--> @Roles("admin")
   |
   v
Authorization Guard
   |
   +--> read required roles
   |
   +--> read request.user
   |
   +--> compare roles
   |
   +--> allow or reject</code>

The controller does not need to contain the authorization logic.

That means you can keep your business method focused on the actual business operation.

There are many ways to design authorization.

A simple role-based system is called RBAC, or Role-Based Access Control.

For example:

<code>admin</code>

<code>manager</code>

<code>customer</code>

But real applications can become more complicated.

You may eventually need permissions:

<code>products:read</code>

<code>products:create</code>

<code>products:delete</code>

Then the user might have:

<code>[
  "products:read",
  "products:create"
]</code>

instead of one simple role.

You can also have resource-level authorization.

For example:

<code>GET /users/123/orders</code>

The user may be allowed to view their own orders but not another user's orders.

That decision may depend on the resource being requested.

This is where authorization can become more advanced than a simple role check.

<b>Beginner real-world example:</b>

Your API has:

<code>admin</code>

and:

<code>user</code>

Only admins can delete products.

The Guard checks the user's role.

<b>Intermediate real-world example:</b>

Your application uses roles and route metadata:

<code>@Roles("admin", "manager")</code>

The authorization Guard reads the required roles and checks the authenticated user's roles.

<b>Advanced real-world example:</b>

Your SaaS application uses permissions and organization membership.

A user may have:

<code>orders:read</code>

but not:

<code>orders:delete</code>

and those permissions may only apply inside the organization the user belongs to.

Now authorization may involve:

- user identity
- organization
- role
- permissions
- resource ownership
- action
- resource state

This is why authorization logic should be designed carefully rather than scattered across controllers.`,
      diagram: `                    Request
                       |
                       v
              Authentication Guard
                       |
                       | request.user
                       v
              Authorization Guard
                       |
              +--------+--------+
              |                 |
              | read metadata   |
              | @Roles("admin") |
              |                 |
              | compare         |
              |                 |
           allowed            denied
              |                 |
              v                 v
          Controller       403 Forbidden`,
      codeExample: {
        title: "Role-based authorization Guard",
        code: `import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const ROLES_KEY = "roles";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        "User information is missing",
      );
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        "You do not have permission to perform this action",
      );
    }

    return true;
  }
}`,
      },
      keyTakeaways: [
        "Authorization determines whether an authenticated user can perform an action.",
        "Roles are a common way to implement basic authorization.",
        "Route metadata can describe the roles required by an endpoint.",
        "The `Reflector` can read metadata inside a Guard.",
        "More advanced systems can use permissions instead of only roles.",
        "Resource ownership and organization membership can make authorization more complex.",
      ],
      commonMistakes: [
        "<b>Checking roles before authentication has established `request.user`.</b> Authorization needs an identity or other trusted context to make its decision.",
        "<b>Putting `if (user.role !== \"admin\")` in every controller.</b> A reusable authorization Guard can centralize this behavior.",
        "<b>Assuming roles solve every authorization problem.</b> Resource ownership and fine-grained permissions may require additional rules.",
        "<b>Using authorization to validate request data.</b> DTO validation and pipes have a different responsibility.",
      ],
      quiz: [
        {
          question: "What does authorization answer?",
          options: [
            "Who is the user?",
            "Is the server running?",
            "Is the user allowed to perform this action?",
            "Which database is installed?",
          ],
          correctIndex: 2,
          explanation: "Authorization determines whether an identity has permission to perform a particular action.",
        },
        {
          question: "What can `Reflector` help a role Guard read?",
          options: [
            "Database rows",
            "Route metadata such as required roles",
            "HTTP status codes only",
            "Environment variables only",
          ],
          correctIndex: 1,
          explanation: "Reflector can retrieve metadata defined through decorators such as a roles decorator.",
        },
      ],
    },

    {
      id: "global-and-route-guards",
      title: "Global Guards and Route Guards",
      durationMinutes: 18,
      explanation: `You now know how Guards work. The next question is:

<b>"Where do I apply a Guard?"</b>

NestJS gives you several choices.

You can apply a Guard to:

- one route
- an entire controller
- the whole application

These choices are useful because not every endpoint has the same security requirements.

Imagine your API has:

<code>GET /products</code>

<code>GET /products/:id</code>

<code>POST /products</code>

<code>DELETE /products/:id</code>

Maybe anyone can view products.

But only authenticated users can create products.

And only administrators can delete products.

You do not want to put one giant Guard on every route if every route has different requirements.

Instead, you can apply guards where they make sense.

A route-level Guard protects one handler.

A controller-level Guard protects every route in that controller.

A global Guard can apply across the application.

A common real-world pattern is to make authentication global and then mark specific routes as public.

For example:

<code>GET /products</code>

might be public.

But:

<code>GET /orders</code>

requires authentication.

A global authentication Guard can run for every request.

Then a custom decorator such as:

<code>@Public()</code>

can tell the Guard:

"This particular route does not require authentication."

Conceptually:

<code>Global Auth Guard
       |
       +---- @Public() ----> allow
       |
       +---- protected ----> authenticate
                              |
                              v
                         Authorization
                              |
                              v
                          Controller</code>

This can be a very clean architecture for APIs where most endpoints are protected.

However, global guards need to be designed carefully because they affect the entire application.

A mistake in a global Guard can make every endpoint inaccessible.

For example, if a global authentication Guard accidentally rejects every request, your entire API can return unauthorized responses.

That is why it is important to test public and protected routes separately.

<b>Beginner real-world example:</b>

You protect one endpoint:

<code>GET /profile</code>

with an authentication Guard.

<b>Intermediate real-world example:</b>

You protect an entire controller:

<code>OrdersController</code>

because every order operation requires an authenticated user.

<b>Advanced real-world example:</b>

Your application has a global authentication Guard.

Most endpoints require authentication, but:

<code>/health</code>

<code>/login</code>

<code>/register</code>

are public.

A <code>@Public()</code> decorator lets the global Guard skip authentication for those specific routes.

This is a common pattern because it keeps authentication policy centralized.

The important design question is:

<b>What is the smallest scope that makes sense?</b>

If only one endpoint needs the Guard, use route-level protection.

If an entire controller needs it, controller-level protection is convenient.

If the whole application follows the same security rule, a global Guard may be appropriate.`,
      diagram: `Application
   |
   +--> Global Guard
   |       |
   |       +--> @Public() ---> allow
   |       |
   |       +--> protected --> authenticate
   |
   +--> UsersController
   |
   +--> ProductsController
   |
   +--> OrdersController
   |
   +--> AdminController

Controller Guard:
  protects every route in one controller

Route Guard:
  protects one specific route`,
      codeExample: {
        title: "Applying a Guard to a route",
        code: `import {
  Controller,
  Get,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "./auth.guard";

@Controller("orders")
export class OrdersController {
  @Get()
  @UseGuards(AuthGuard)
  findMyOrders() {
    return {
      message: "Only authenticated users can see orders",
    };
  }
}`,
      },
      keyTakeaways: [
        "Guards can be applied at different scopes.",
        "A route Guard protects a specific handler.",
        "A controller Guard can protect all handlers in a controller.",
        "A global Guard can protect the application broadly.",
        "Global authentication with public-route metadata is a common architecture.",
        "Choose the scope based on where the security rule actually belongs.",
      ],
      commonMistakes: [
        "<b>Making every Guard global.</b> Some security rules only belong to specific routes.",
        "<b>Forgetting public routes when using a global authentication Guard.</b> Login and health endpoints may need to remain accessible without authentication.",
        "<b>Assuming global means the Guard should contain every authorization rule.</b> Keep route-specific authorization rules appropriately scoped.",
        "<b>Not testing the whole application after adding a global Guard.</b> A global Guard affects every request.",
      ],
      quiz: [
        {
          question: "When is a controller-level Guard useful?",
          options: [
            "When every route in that controller needs the same protection",
            "When no route needs protection",
            "Only for database queries",
            "Only for POST requests",
          ],
          correctIndex: 0,
          explanation: "A controller-level Guard is convenient when the same protection should apply to all handlers in a controller.",
        },
        {
          question: "Why might a global authentication Guard use a `@Public()` decorator?",
          options: [
            "To disable TypeScript",
            "To mark selected routes that do not require authentication",
            "To create database tables",
            "To validate DTOs",
          ],
          correctIndex: 1,
          explanation: "A public-route marker allows a global authentication Guard to skip authentication for intentionally public endpoints.",
        },
      ],
    },

    {
      id: "guards-real-world-security-design",
      title: "Putting Guards Together: A Real API",
      durationMinutes: 20,
      explanation: `Let's bring everything together using the project you have been building.

You already have:

<code>Users</code>

<code>Products</code>

<code>Orders</code>

Now imagine your API is used by real customers and administrators.

You might have these endpoints:

<code>GET /products</code>

Anyone can browse products.

<code>POST /products</code>

Only managers and administrators can create products.

<code>DELETE /products/:id</code>

Only administrators can delete products.

<code>GET /orders</code>

Only authenticated users can see their orders.

<code>POST /orders</code>

Only authenticated users can create orders.

<code>GET /users</code>

Only administrators can list all users.

Now look at the security layers.

First:

<b>Authentication</b>

The API determines who the user is.

For example:

<code>{
  id: "user-42",
  email: "alex@example.com",
  roles: ["customer"]
}</code>

Then:

<b>Authorization</b>

The API determines whether this user can perform the requested action.

For:

<code>POST /orders</code>

the customer role may be allowed.

For:

<code>DELETE /products/123</code>

the customer role is not allowed.

This gives us a layered design:

<code>Request
   |
   v
Middleware
   |
   | request ID
   | logging
   v
Authentication Guard
   |
   | Who is the user?
   |
   v
Authorization Guard
   |
   | Can this user perform this action?
   |
   v
Interceptors
   |
   v
Pipes
   |
   | Validate/transform input
   v
Controller
   |
   v
Service
   |
   v
Database
   |
   v
Response</code>

Notice how each part has a different job.

Middleware:

<b>"Prepare and observe the request."</b>

Authentication Guard:

<b>"Who is making this request?"</b>

Authorization Guard:

<b>"Is this user allowed to perform this action?"</b>

Pipes:

<b>"Is the input valid and in the right shape?"</b>

Controller:

<b>"Which application operation should run?"</b>

Service:

<b>"How does the business operation actually work?"</b>

This separation is one of the most useful things to learn in NestJS.

Without it, an application can quickly become a collection of controller methods containing authentication, authorization, validation, database queries, and business logic all mixed together.

With these layers, each piece has a clear responsibility.

<b>Beginner real-world example:</b>

Start with one protected endpoint:

<code>GET /profile</code>

Create an authentication Guard.

If the user has a valid token, attach:

<code>request.user</code>

Then let the controller return the user's profile.

<b>Intermediate real-world example:</b>

Protect the entire OrdersController with authentication.

Then add role or ownership checks where needed.

A customer can see their own orders.

An administrator can inspect orders across the system.

<b>Advanced real-world example:</b>

A production SaaS application may need:

- authentication
- organization membership
- roles
- permissions
- resource ownership
- account status
- subscription restrictions

For example:

<code>DELETE /organizations/acme/products/123</code>

The user may have a valid token.

But that is only the first check.

The authorization layer may need to determine:

1. Is the user authenticated?
2. Does the user belong to organization "acme"?
3. Is the user's account active?
4. Does the user have the <code>products:delete</code> permission?
5. Does product 123 belong to organization "acme"?
6. Is the product currently allowed to be deleted?
7. Is the user allowed to perform this action under the organization's policy?

At this point, authorization is no longer just:

<code>user.role === "admin"</code>

This is why real-world authorization systems should be designed as a deliberate part of the application architecture.

One final important point:

<b>Do not treat a Guard as a replacement for every security measure.</b>

Authentication and authorization are only parts of application security.

You still need appropriate input validation, secure credential handling, proper secret management, database authorization where appropriate, rate limiting, secure transport, and careful handling of sensitive data.

The Guard is one part of the security architecture.

The goal is not to put every security rule inside one giant Guard.

The goal is to have a clear pipeline where each layer does the job it is responsible for.`,
      diagram: `                    CLIENT
                       |
                       v
              +----------------+
              |   Middleware   |
              | logging / ID   |
              +----------------+
                       |
                       v
              +----------------+
              | Authentication |
              |     Guard      |
              +----------------+
                       |
                Who are you?
                       |
                       v
              +----------------+
              | Authorization  |
              |     Guard      |
              +----------------+
                       |
             Are you allowed?
                       |
                       v
              +----------------+
              |   Interceptor  |
              +----------------+
                       |
                       v
              +----------------+
              |      Pipe      |
              | validate input |
              +----------------+
                       |
                       v
              +----------------+
              |   Controller   |
              +----------------+
                       |
                       v
              +----------------+
              |    Service     |
              +----------------+
                       |
                       v
                  Database`,
      codeExample: {
        title: "Authentication + role authorization",
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest();

    const authorization =
      request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    // Simplified learning example.
    const user = {
      id: "user-42",
      roles: ["manager"],
    };

    request.user = user;

    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.roles.includes("admin")) {
      throw new ForbiddenException(
        "Admin access required",
      );
    }

    return true;
  }
}`,
      },
      keyTakeaways: [
        "Authentication and authorization work together but solve different problems.",
        "A real API can use multiple Guards for different security decisions.",
        "Middleware, Guards, Pipes, Controllers, and Services should have different responsibilities.",
        "Authentication can establish `request.user`.",
        "Authorization can use `request.user` to make permission decisions.",
        "Real-world authorization may involve roles, permissions, organizations, ownership, and resource state.",
        "A Guard is one part of a larger application security architecture.",
      ],
      commonMistakes: [
        "<b>Creating one giant security Guard.</b> Split authentication and authorization responsibilities when that improves clarity.",
        "<b>Checking authorization before establishing identity.</b> The authorization layer normally needs trusted user information.",
        "<b>Putting database business operations inside Guards.</b> Let services handle the actual business operation.",
        "<b>Assuming authentication alone protects an application.</b> Authentication answers who the user is; authorization answers what they can do.",
        "<b>Forgetting resource ownership.</b> A user may have permission to read orders but only their own orders.",
      ],
      quiz: [
        {
          question: "What is the main difference between authentication and authorization?",
          options: [
            "Authentication identifies the user; authorization checks permissions",
            "Authentication validates DTOs; authorization creates DTOs",
            "Authentication creates controllers; authorization creates modules",
            "There is no difference",
          ],
          correctIndex: 0,
          explanation: "Authentication establishes identity, while authorization determines whether that identity can perform an action.",
        },
        {
          question: "A customer is logged in but tries to delete a product. What kind of decision is this?",
          options: [
            "Authentication only",
            "Authorization",
            "DTO transformation",
            "Middleware ordering",
          ],
          correctIndex: 1,
          explanation: "The user is already authenticated. The question is whether they have permission to delete the product.",
        },
        {
          question: "Which layer should normally contain the business operation for deleting a product?",
          options: [
            "Guard",
            "Service",
            "Middleware",
            "Decorator",
          ],
          correctIndex: 1,
          explanation: "The Guard should decide access, while the service should perform the actual business operation.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the primary responsibility of a Guard?",
      options: [
        "Validate database schemas",
        "Decide whether a request can continue",
        "Create DTOs",
        "Render HTML",
      ],
      correctIndex: 1,
      explanation: "A Guard acts as a gatekeeper and determines whether the request should continue.",
    },
    {
      question: "Which interface does a NestJS Guard implement?",
      options: [
        "Middleware",
        "CanActivate",
        "PipeTransform",
        "NestModule",
      ],
      correctIndex: 1,
      explanation: "NestJS Guards implement the `CanActivate` interface.",
    },
    {
      question: "What method does a Guard implement?",
      options: [
        "execute()",
        "handle()",
        "canActivate()",
        "validate()",
      ],
      correctIndex: 2,
      explanation: "The main Guard method is `canActivate()`.",
    },
    {
      question: "What does authentication answer?",
      options: [
        "What can the user do?",
        "Who is the user?",
        "Which DTO should be used?",
        "Which service should run?",
      ],
      correctIndex: 1,
      explanation: "Authentication establishes the identity of the requester.",
    },
    {
      question: "What does authorization answer?",
      options: [
        "Who is the user?",
        "Is the user's password encrypted?",
        "Is the user allowed to perform this action?",
        "Which database is being used?",
      ],
      correctIndex: 2,
      explanation: "Authorization determines whether an authenticated identity has permission to perform an action.",
    },
    {
      question: "Where is authenticated user information commonly stored for later request processing?",
      options: [
        "request.user",
        "request.database",
        "request.module",
        "request.controller",
      ],
      correctIndex: 0,
      explanation: "Authentication logic commonly attaches the authenticated identity to `request.user`.",
    },
    {
      question: "What can ExecutionContext provide to an HTTP Guard?",
      options: [
        "Only database access",
        "The current HTTP request and execution information",
        "Only environment variables",
        "Only response JSON",
      ],
      correctIndex: 1,
      explanation: "ExecutionContext provides information about the current execution, including the HTTP request and handler/controller context.",
    },
    {
      question: "Which status is commonly associated with an unauthenticated request?",
      options: [
        "200",
        "201",
        "401",
        "404",
      ],
      correctIndex: 2,
      explanation: "HTTP 401 Unauthorized is commonly used when authentication is required or has failed.",
    },
    {
      question: "Which status is commonly associated with an authenticated user who lacks permission?",
      options: [
        "201",
        "204",
        "403",
        "301",
      ],
      correctIndex: 2,
      explanation: "HTTP 403 Forbidden is commonly used when the requester is authenticated but is not permitted to perform the operation.",
    },
    {
      question: "What is a useful reason to use a controller-level Guard?",
      options: [
        "Every route in that controller needs the same protection",
        "No routes need protection",
        "Only the database needs protection",
        "It disables middleware",
      ],
      correctIndex: 0,
      explanation: "A controller-level Guard is useful when the same access rule should apply to the controller's handlers.",
    },
    {
      question: "Why might an application use a global authentication Guard with a `@Public()` decorator?",
      options: [
        "To make every route public",
        "To let selected routes skip authentication",
        "To validate request DTOs",
        "To create database migrations",
      ],
      correctIndex: 1,
      explanation: "A public marker allows selected endpoints such as login or health checks to bypass a global authentication requirement.",
    },
    {
      question: "A logged-in customer tries to delete a product, but only admins can delete products. What is the main issue?",
      options: [
        "Authentication",
        "Authorization",
        "Routing",
        "DTO transformation",
      ],
      correctIndex: 1,
      explanation: "The user is authenticated, but the application must determine whether that user has permission to perform the action.",
    },
  ],

  project: {
    name: "Authentication and Authorization for the Store API",
    goal: "Add a realistic Guard-based authentication and authorization system to the Users, Products, and Orders API you built during the previous days.",
    brief: "Turn the existing Users, Products, and Orders API into a protected API. Build the security system incrementally: start with a simple authentication Guard, attach the authenticated user to the request, protect routes, introduce roles, create an authorization Guard, add public routes, and finally combine authentication and authorization into a realistic request flow.",
    steps: [
      "Review the existing Users, Products, and Orders modules from the previous project.",
      "Create a small development authentication model with users containing an ID, email, and roles.",
      "Create an AuthGuard implementing `CanActivate`.",
      "Read an Authorization header from incoming requests.",
      "For the learning version, use a simple development token to simulate authentication.",
      "When authentication succeeds, attach a user object to `request.user`.",
      "When authentication fails, throw an appropriate authentication exception.",
      "Protect `GET /orders` so only authenticated users can access it.",
      "Protect `POST /orders` so only authenticated users can create orders.",
      "Leave `GET /products` public.",
      "Create a roles decorator such as `@Roles('admin')`.",
      "Create a RolesGuard using `Reflector`.",
      "Read the roles required by the current route.",
      "Read the authenticated user from `request.user`.",
      "Compare the user's roles with the roles required by the route.",
      "Protect product deletion so only administrators can delete products.",
      "Protect product creation so only managers and administrators can create products.",
      "Protect the Users listing endpoint so only administrators can access it.",
      "Create a public login endpoint.",
      "Create a public health endpoint.",
      "Experiment with applying the authentication Guard to one route.",
      "Experiment with applying a Guard to an entire controller.",
      "Optionally experiment with a global authentication Guard.",
      "If using a global Guard, create a `@Public()` decorator so login and health endpoints can bypass authentication.",
      "Test an unauthenticated request to a protected endpoint.",
      "Test an authenticated customer request.",
      "Test an authenticated manager request.",
      "Test an authenticated administrator request.",
      "Verify that authentication and authorization produce different responses for different failures.",
      "Draw the final request flow from middleware through authentication, authorization, pipes, controller, and service.",
    ],
    acceptance: [
      "An AuthGuard implements `CanActivate`.",
      "The AuthGuard reads the incoming authentication information.",
      "A successfully authenticated user is available through `request.user`.",
      "Unauthenticated requests cannot access protected endpoints.",
      "Public endpoints can still be accessed without authentication.",
      "A roles decorator can describe the authorization requirements of an endpoint.",
      "A RolesGuard can read the required roles.",
      "Customers cannot access administrator-only operations.",
      "Managers can access operations explicitly allowed for managers.",
      "Administrators can access administrator-only operations.",
      "Authentication and authorization are implemented as separate concepts.",
      "The controller does not contain repeated authentication and role-checking code.",
      "Business operations remain inside services rather than Guards.",
      "The final application clearly demonstrates route-level and/or controller-level Guard usage.",
    ],
    stretch: [
      "Replace the development token with JWT authentication.",
      "Create an AuthService responsible for validating tokens.",
      "Create a reusable `@CurrentUser()` decorator for accessing `request.user`.",
      "Change the user model from one role to an array of roles.",
      "Replace role checks with fine-grained permissions such as `products:read`, `products:create`, and `products:delete`.",
      "Create a `@Permissions()` decorator and a PermissionsGuard.",
      "Implement resource ownership so customers can only access their own orders.",
      "Allow administrators to access orders across the system.",
      "Add organization membership and require the authenticated user to belong to the requested organization.",
      "Create a global authentication Guard with a `@Public()` decorator.",
      "Add tests for authenticated, unauthenticated, authorized, and unauthorized requests.",
      "Create a policy-based authorization layer for more complex business rules.",
      "Document the difference between authentication, authorization, validation, middleware, and business logic in your project.",
    ],
  },
};
