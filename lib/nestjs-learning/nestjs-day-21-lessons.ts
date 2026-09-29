import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_21_LESSONS: LessonDay = {
  day: 21,
  title: "Custom Decorators",
  totalMinutes: 105,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "custom-decorators",
      title: "Custom decorators: making NestJS code easier to read",
      durationMinutes: 18,
      explanation: `If you have used NestJS for a while, you have probably seen decorators such as \`@Controller()\`, \`@Get()\`, \`@Post()\`, \`@Injectable()\`, and \`@Body()\`.

A decorator is a special piece of TypeScript syntax that lets you <b>attach information or behavior to a class, method, property, or parameter</b>.

NestJS uses decorators heavily because they make the structure of your application easy to see directly in the code.

For example, when you write:

\`\`\`ts
@Controller("users")
export class UsersController {}
\`\`\`

you are telling NestJS that this class should be treated as a controller and that its routes start with \`/users\`.

When you write:

\`\`\`ts
@Get(":id")
findUser(@Param(\"id\") id: string) {}
\`\`\`

you are describing the HTTP route and telling NestJS where a value should come from.

The important thing is that decorators are not magic. They are a way of attaching information to your code so that NestJS can inspect that information and build the application around it.

Now imagine your application has this rule:

"Some endpoints require an admin."

You could repeat the string \`"admin"\` in several places, but that quickly becomes difficult to understand.

A custom decorator lets you create something much more expressive:

\`\`\`ts
@Roles("admin")
@Get("reports")
getReports() {}
\`\`\`

Now another developer can look at the controller and immediately understand that the endpoint requires the admin role.

This is one of the biggest reasons custom decorators are useful: <b>they allow you to turn repeated technical details into readable application concepts</b>.

A beginner-friendly way to think about a decorator is:

<b>"Put a label or instruction on this piece of code so NestJS can understand what I want."</b>

For example:

\`\`\`ts
@Roles("admin")
\`\`\`

can be thought of as:

"Attach the information that this route requires the admin role."

The decorator itself does not automatically perform the authorization check. A guard can later read that metadata and make the decision.

That distinction is very important.

The decorator says:

"Here is information about this route."

The guard says:

"Based on that information and the current user, should this request be allowed?"

This separation is a common NestJS pattern.

<b>Beginner real-world example:</b>

Imagine a small online store.

You have:

- \`GET /products\` for everyone
- \`POST /products\` for managers
- \`DELETE /products/:id\` for administrators

Instead of hiding these rules inside complicated guard code, you can make the controller readable:

\`\`\`ts
@Roles("manager")
@Post()
createProduct() {}

@Roles("admin")
@Delete(":id")
deleteProduct() {}
\`\`\`

The authorization system can then read the role information.

<b>Intermediate real-world example:</b>

Imagine a SaaS application with roles such as:

- owner
- admin
- manager
- support
- customer

You might create decorators such as:

\`\`\`ts
@Roles("owner", "admin")

 or:

 \`\`\`ts
 @Permissions("users.read", "users.write")
 \`\`\`

 The decorators describe what an endpoint requires, while guards and services decide whether the current user actually has that permission.

 <b>Advanced real-world example:</b>

 In a larger application, you might need metadata for more than authorization.

 You could attach information describing:

 - required permissions
- audit events
- rate-limit rules
- feature flags
- API visibility
- tenant requirements
- required subscription plans

 For example:

 \`\`\`ts
 @Audit("user.deleted")
 @Roles("admin")
 @RequiresPlan("enterprise")
 @Delete(":id")
 deleteUser() {}
 \`\`\`

 This can make a large application much easier to understand because important rules are visible directly next to the route.

 However, decorators should not become a dumping ground for business logic. A decorator should usually describe or attach information. Guards, interceptors, pipes, and services should perform the actual work.`,       diagram: ` Custom Decorator
 |
 v
 Attach metadata
 |
 v
 +-----------------------------+
 | Controller / Route |
 | |
 | @Roles("admin") |
 | @Delete(":id") |
 +-----------------------------+
 |
 v
 NestJS reads
 metadata
 |
 v
 Guard
 |
 +---------+---------+
 | |
 Allowed Denied
 | |
 v v
 Service 403
 |
 v
 Response

 Important:
 Decorator = describes the rule
 Guard = enforces the rule`,       codeExample: {         title: "Creating a simple @Roles() decorator",         code: `import { SetMetadata } from "@nestjs/common";

 export const Roles = (...roles: string[]) =>
 SetMetadata("roles", roles);`,       },       keyTakeaways: [         "Decorators let you attach information or behavior to classes, methods, properties, or parameters.",         "NestJS uses decorators heavily to describe application structure.",         "Custom decorators let you create application-specific syntax such as `@Roles()`.",         "A decorator can describe a requirement without actually enforcing it.",         "Guards are commonly used to read authorization metadata and enforce it.",         "Custom decorators are especially useful when they make repeated application rules easier to understand.",       ],       commonMistakes: [         "<b>Thinking a custom decorator automatically performs authorization.</b> `@Roles()`can attach role metadata, but a guard still needs to read that metadata and enforce the rule.",         "<b>Putting business logic inside decorators.</b> Keep decorators small and focused on describing or attaching information.",         "<b>Creating decorators for everything.</b> A decorator should make the code clearer, not introduce another abstraction without a reason.",         "<b>Using string metadata keys everywhere.</b> Centralize metadata keys or use a consistent convention so different parts of the application do not accidentally use different keys.",       ],       quiz: [         {           question: "What is one common purpose of a custom decorator?",           options: [             "Create a database table automatically",             "Attach application-specific information to code",             "Replace every service",             "Start the NestJS server",           ],           correctIndex: 1,           explanation:             "Custom decorators are commonly used to attach information such as roles or permissions to classes and methods.",         },         {           question: "What should a`@Roles()\` decorator usually do?",
 options: [
 "Query the database for the user",
 "Automatically return a 403 response",
 "Attach role metadata to the route",
 "Hash the user's password",
 ],
 correctIndex: 2,
 explanation:
 "The decorator describes the required roles. A guard can later read that metadata and enforce the rule.",
 },
 ],
 },

{
  id: "parameter-decorators",
  title: "Parameter decorators: getting exactly what your handler needs",
  durationMinutes: 18,
  explanation: `You have already used NestJS parameter decorators even if you did not realize how powerful they are.

 For example:

 \`\`\`ts
 @Get(":id")
 findUser(@Param(\"id\") id: string) {
 return this.usersService.findOne(id);
 }
 \`\`\`

 Here, \`@Param(\"id\")\` is a parameter decorator.

 It tells NestJS:

 "Take the \`id\` route parameter and give it to this method argument."

 NestJS provides several built-in parameter decorators:

 - \`@Param()\` for route parameters
- \`@Query()\` for query parameters
- \`@Body()\` for the request body
- \`@Headers()\` for request headers
- \`@Req()\` for the request object
- \`@Res()\` for the response object
- \`@Ip()\` for the client's IP address
- \`@Session()\` when sessions are configured

 You can also create your own parameter decorators.

 This becomes useful when the same information is needed by many controllers.

 For example, suppose authentication adds a user object to the request:

 \`\`\`ts
 request.user = {
 id: "user_123",
 email: "alice@example.com",
 role: "admin",
 };
 \`\`\`

 Without a custom decorator, controllers might repeatedly contain:

 \`\`\`ts
 @Req() request: Request
 \`\`\`

 and then:

 \`\`\`ts
 request.user
 \`\`\`

 That works, but it makes every controller know about the structure of the raw HTTP request.

 A custom parameter decorator can give you a cleaner API:

 \`\`\`ts
 @Get("profile")
 getProfile(@CurrentUser() user: User) {
 return this.usersService.getProfile(user.id);
 }
 \`\`\`

 Now the controller does not need to know where the user came from.

 It only says:

 "I need the current user."

 This is an important design idea.

 The controller should ideally work with <b>application concepts</b>, not low-level framework details.

 <b>Beginner real-world example:</b>

 A food delivery API might have:

 \`\`\`ts
 @Get("orders")
 getMyOrders(@CurrentUser() user: User) {
 return this.ordersService.findByUser(user.id);
 }
 \`\`\`

 The controller does not need to manually inspect \`request.user\`.

 <b>Intermediate real-world example:</b>

 A multi-tenant SaaS application might attach a tenant to the request:

 \`\`\`ts
 request.tenant = {
 id: "tenant_123",
 name: "Acme",
 };
 \`\`\`

 You could create:

 \`\`\`ts
 @CurrentTenant()
 \`\`\`

 and use:

 \`\`\`ts
 @Get("invoices")
 findInvoices(@CurrentTenant() tenant: Tenant) {
 return this.invoiceService.findForTenant(tenant.id);
 }
 \`\`\`

 Now tenant-aware controllers become easier to read.

 <b>Advanced real-world example:</b>

 A large application may have several request-scoped concepts:

 \`\`\`ts
 @CurrentUser()
 @CurrentTenant()
 @RequestId()
 @ClientIp()
 \`\`\`

 The controller can then work with meaningful values instead of repeatedly navigating through \`Request\` objects.

 This is especially helpful when your authentication mechanism changes.

 For example, today your application may put the user on \`request.user\`.

 Later you might change your authentication layer.

 If every controller directly accesses \`request.user\`, many files may need to change.

 If every controller uses \`@CurrentUser()\`, you can often change the implementation of the decorator or authentication layer while keeping the controller API the same.

 That is one of the practical benefits of custom parameter decorators.`,       diagram: `HTTP Request
 |
 v
 +----------------------+
 | Authentication |
 | Guard |
 +----------------------+
 |
 | request.user
 v
 +----------------------+
 | Request object |
 | |
 | user: {...} |
 | tenant: {...} |
 +----------------------+
 |
 v
 @CurrentUser()
 |
 v
 Controller method
 |
 v
 Service

 Instead of:

 @Req() request
 request.user

 You can write:

 @CurrentUser() user`,       codeExample: {         title: "Creating a @CurrentUser() parameter decorator",         code: `import {
 createParamDecorator,
 ExecutionContext,
 } from "@nestjs/common";

 export const CurrentUser = createParamDecorator(
 (_data: unknown, ctx: ExecutionContext) => {
 const request = ctx.switchToHttp().getRequest();

return request.user;

 },
 );`,       },       keyTakeaways: [         "Parameter decorators can provide a specific value directly to a controller method.",         "Built-in decorators include `@Param()`, `@Query()`, `@Body()`, and `@Headers()`.",         "Custom parameter decorators can hide repetitive request-object access.",         "`@CurrentUser()`is a common real-world custom parameter decorator.",         "Custom parameter decorators can make controllers easier to read and less coupled to the raw HTTP request.",       ],       commonMistakes: [         "<b>Assuming`@CurrentUser()`creates the user.</b> It normally reads information that authentication middleware or a guard has already placed somewhere accessible.",         "<b>Forgetting that the decorator needs the correct execution context.</b> HTTP, WebSocket, RPC, and other transports expose different request-like objects.",         "<b>Returning the entire request when only one value is needed.</b> Return the smallest useful value when possible.",         "<b>Using a custom decorator to hide complicated business logic.</b> Keep the decorator focused on extracting information.",       ],       quiz: [         {           question: "What does`@Param(\"id\")`normally provide?",           options: [             "The request body",             "The`id` route parameter",             "The database connection",             "The response status",           ],           correctIndex: 1,           explanation:             "`@Param(\"id\")`extracts the`id`parameter from the route.",         },         {           question: "Why might`@CurrentUser()\` be useful?",
 options: [
 "It starts authentication automatically",
 "It hides repeated access to the raw request object",
 "It creates a database user",
 "It replaces all guards",
 ],
 correctIndex: 1,
 explanation:
 "A custom parameter decorator can provide the current user directly to a controller method.",
 },
 ],
 },

{
  id: "metadata-and-setmetadata",
  title: "Metadata and SetMetadata",
  durationMinutes: 20,
  explanation: `Now we need to understand one of the most important ideas behind many NestJS decorators: <b>metadata</b>.

 Metadata is simply <b>information attached to something</b>.

 Think about a shipping label.

 A package might contain a laptop, but the outside of the package can contain information such as:

 - destination
- tracking number
- delivery priority
- handling instructions

 That information describes the package without being the package itself.

 Metadata works in a similar way.

 A controller method might be:

 \`\`\`ts
 @Roles("admin")
 @Delete(":id")
 deleteUser() {}
 \`\`\`

 The method is the actual code.

 The role information is metadata attached to that method.

 NestJS provides \`SetMetadata()\` as a convenient way to attach metadata.

 For example:

 \`\`\`ts
 export const Roles = (...roles: string[]) =>
 SetMetadata("roles", roles);
 \`\`\`

 Then:

 \`\`\`ts
 @Roles("admin")
 @Get("reports")
 getReports() {}
 \`\`\`

 can attach something conceptually similar to:

 \`\`\`ts
 roles: ["admin"]
 \`\`\`

 The important part is that another part of the NestJS application can later read that metadata.

 This is where decorators and guards work together.

 The decorator says:

 "This route requires the admin role."

 The guard asks:

 "What roles does this route require?"

 Then the guard compares that information with the current user.

 <b>Beginner real-world example:</b>

 Imagine a library application.

 You have an endpoint:

 \`\`\`ts
 @Roles("librarian")
 @Post("books")
 createBook() {}
 \`\`\`

 The decorator attaches the requirement.

 The guard reads it.

 If the current user is a librarian, the request continues.

 If the current user is a regular member, the guard rejects it.

 <b>Intermediate real-world example:</b>

 Imagine an ecommerce application where different actions have different permissions:

 \`\`\`ts
 @Permissions("products.read")
 @Get()
 findProducts() {}

 @Permissions("products.write")
 @Post()
 createProduct() {}

 @Permissions("products.delete")
 @Delete(":id")
 deleteProduct() {}
 \`\`\`

 A permission guard can read the metadata and compare it against the permissions associated with the authenticated user.

 <b>Advanced real-world example:</b>

 Imagine a large enterprise system where routes contain multiple pieces of metadata:

 \`\`\`ts
 @Roles("admin")
 @AuditEvent("customer.deleted")
 @RequiresSubscription("enterprise")
 @Delete(":id")
 deleteCustomer() {}
 \`\`\`

 Different infrastructure components can read different metadata.

 For example:

 - a guard reads \`roles\`
- an audit interceptor reads \`audit:event\`
- another guard reads \`subscription\`

 The controller remains focused on the actual operation.

 This is one of the reasons metadata is powerful in NestJS: <b>one piece of code can describe itself to infrastructure around it.</b>

 You should also understand that metadata is not automatically authorization.

 This:

 \`\`\`ts
 @Roles("admin")
 \`\`\`

 does not magically prevent a normal user from calling the endpoint.

 Something must read the metadata and enforce the rule.

 That "something" is commonly a guard.

 This distinction will save you from many confusing bugs.`,       diagram: `@Roles("admin")
 |
 v
 SetMetadata("roles", ["admin"])
 |
 v
 Route metadata
 |
 v
 +----------------------+
 | RolesGuard |
 | |
 | Read metadata |
 | | |
 | v |
 | ["admin"] |
 +----------------------+
 |
 v
 Current user
 |
 +------ admin ------> Allow
 |
 +------ customer ---> Deny

 Metadata describes the rule.
 The guard enforces the rule.`,       codeExample: {         title: "Roles decorator + guard reading metadata",         code: `// roles.decorator.ts
 import { SetMetadata } from "@nestjs/common";

 export const Roles = (...roles: string[]) =>
 SetMetadata("roles", roles);

 // roles.guard.ts
 import {
 CanActivate,
 ExecutionContext,
 Injectable,
 } from "@nestjs/common";
 import { Reflector } from "@nestjs/core";

 @Injectable()
 export class RolesGuard implements CanActivate {
 constructor(private readonly reflector: Reflector) {}

 canActivate(context: ExecutionContext): boolean {
 const requiredRoles = this.reflector.get<string[]>(
 "roles",
 context.getHandler(),
 );

if (!requiredRoles) {
  return true;
}

const request = context.switchToHttp().getRequest();
const user = request.user;

return requiredRoles.includes(user.role);

 }
 }

 // users.controller.ts
 import { Controller, Delete, Get, Param } from "@nestjs/common";

 @Controller("users")
 export class UsersController {
 @Roles("admin")
 @Delete(":id")
 deleteUser(@Param(\"id\") id: string) {
 return {
 message: \`Delete user \${id}\`,
 };
 }
 }`,       },       keyTakeaways: [         "Metadata is information attached to classes, methods, or other code elements.",         "`SetMetadata()`is a NestJS helper for attaching metadata.",         "Custom decorators often use`SetMetadata()`internally.",         "Metadata becomes useful when another part of the application reads it.",         "A guard can read role metadata and enforce authorization.",         "Metadata itself does not automatically enforce a rule.",       ],       commonMistakes: [         "<b>Thinking metadata is executable authorization.</b> Metadata only describes something; another component must act on it.",         "<b>Using different metadata keys accidentally.</b> If the decorator writes`roles`but the guard reads`role`, the guard will not find the expected value.",         "<b>Assuming metadata is private application state.</b> Metadata is descriptive information and should not be treated as a secure storage mechanism.",         "<b>Putting sensitive information into metadata.</b> Do not use route metadata as a place to store secrets, passwords, or authentication credentials.",       ],       quiz: [         {           question: "What does `SetMetadata()` do?",           options: [             "Starts a server",             "Attaches metadata to a target",             "Creates a database",             "Validates a DTO",           ],           correctIndex: 1,           explanation:             "`SetMetadata()\` attaches metadata that other parts of the NestJS application can later read.",
 },
 {
 question: "What commonly reads role metadata?",
 options: [
 "A database migration",
 "A guard",
 "A DTO",
 "A controller constructor",
 ],
 correctIndex: 1,
 explanation:
 "Authorization guards commonly use Reflector to read role metadata and enforce access rules.",
 },
 ],
 },

{
  id: "reflector",
  title: "Reflector: reading metadata inside guards and infrastructure",
  durationMinutes: 18,
  explanation: `Attaching metadata is only half of the story.

 If you write:

 \`\`\`ts
 @Roles("admin")


you eventually need to ask:

"How do I read those roles?"

NestJS provides the \`Reflector\` service for working with metadata.

You will often see it inside guards:

\`\`\`ts
constructor(private readonly reflector: Reflector) {}
\`\`\`

Then:

\`\`\`ts
const roles = this.reflector.get<string[]>(
  "roles",
  context.getHandler(),
);
\`\`\`

The second argument, \`context.getHandler()\`, tells the Reflector that you want metadata attached to the current route handler.

This is extremely useful because a guard does not need to know which controller method is currently executing.

The \`ExecutionContext\` gives the guard information about the current request and handler.

The guard can then say:

"Give me the metadata attached to this handler."

<b>Beginner real-world example:</b>

Suppose you have:

\`\`\`ts
@Roles("admin")
@Get("reports")
getReports() {}
\`\`\`

The guard can retrieve:

\`\`\`ts
["admin"]
\`\`\`

Then it compares that with:

\`\`\`ts
request.user.role
\`\`\`

<b>Intermediate real-world example:</b>

Sometimes you want metadata at the controller level:

\`\`\`ts
@Roles("admin")
@Controller("admin")
export class AdminController {
  // routes
}
\`\`\`

Now the role applies to the controller.

But perhaps one specific method needs a different rule:

\`\`\`ts
@Roles("support")
@Get("support")
getSupportData() {}
\`\`\`

This creates an important question:

"What happens when metadata exists both on the controller and on the method?"

NestJS's Reflector provides methods such as \`getAllAndOverride()\` and \`getAllAndMerge()\` that are useful for these situations.

\`getAllAndOverride()\` is useful when a more specific value should replace a broader value.

For example:

\`\`\`ts
@Roles("admin")
@Controller("users")
export class UsersController {
  @Roles("support")
  @Get("support")
  support() {}
}
\`\`\`

You may want the method-level \`support\` role to override the controller-level \`admin\` role.

\`getAllAndMerge()\` is useful when you want metadata from multiple levels combined.

For example, a controller might require:

\`\`\`ts
["admin"]
\`\`\`

and a method might add:

\`\`\`ts
["billing"]
\`\`\`

The resulting metadata can be:

\`\`\`ts
["admin", "billing"]
\`\`\`

This distinction becomes important in larger applications.

<b>Advanced real-world example:</b>

Imagine an enterprise API:

\`\`\`ts
@Permissions("reports.read")
@Controller("reports")
export class ReportsController {
  @Permissions("reports.export")
  @Get("export")
  exportReport() {}
}
\`\`\`

A permission guard could use \`getAllAndMerge()\` if the route needs both permissions.

Or it could use \`getAllAndOverride()\` if the route-specific declaration should completely replace the controller-level declaration.

The correct choice depends on the meaning of your application's metadata.

This is an important lesson:

<b>Reflector does not decide your authorization model for you.</b>

It simply gives your infrastructure a convenient way to read metadata.

You decide whether metadata should be inherited, overridden, merged, or ignored.`,
      diagram: `@Controller("users")
@Roles("admin")
        |
        v
Controller metadata
        |
        |
        +------------------+
                           |
                           v
                    ExecutionContext
                           |
                    getClass()
                           |
                           v
                       Reflector
                           |
                           +---- getAllAndOverride()
                           |
                           +---- getAllAndMerge()
                           |
                           v
                     Guard decision

Route-specific metadata
can override or merge with
controller-level metadata.`,
      codeExample: {
        title: "Using Reflector in a roles guard",
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      "roles",
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return requiredRoles.includes(request.user.role);
  }
}`,
      },
      keyTakeaways: [
        "`Reflector` is commonly used to read metadata.",
        "`context.getHandler()` identifies the current route handler.",
        "`context.getClass()` identifies the current controller class.",
        "`getAllAndOverride()` is useful when more specific metadata should replace broader metadata.",
        "`getAllAndMerge()` is useful when metadata from multiple levels should be combined.",
        "The Reflector reads metadata; your guard or infrastructure code decides what that metadata means.",
      ],
      commonMistakes: [
        "<b>Reading only method metadata when controller metadata matters.</b> Consider both `getHandler()` and `getClass()` when your application supports controller-level configuration.",
        "<b>Using merge when you really need override.</b> Merging and overriding produce different authorization behavior.",
        "<b>Assuming Reflector automatically authenticates users.</b> Reflector only helps you access metadata.",
        "<b>Forgetting that metadata keys must match.</b> A typo in the metadata key can make your guard behave as if no metadata exists.",
      ],
      quiz: [
        {
          question: "What is `Reflector` commonly used for?",
          options: [
            "Reading NestJS metadata",
            "Opening database connections",
            "Parsing JSON bodies",
            "Starting WebSockets",
          ],
          correctIndex: 0,
          explanation:
            "Reflector provides convenient methods for reading metadata attached to classes and handlers.",
        },
        {
          question: "What does `getAllAndOverride()` help with?",
          options: [
            "Replacing a database row",
            "Allowing specific metadata to override broader metadata",
            "Creating a new controller",
            "Encrypting metadata",
          ],
          correctIndex: 1,
          explanation:
            "It is useful when metadata can exist at multiple levels and a more specific value should take precedence.",
        },
      ],
    },

    {
      id: "decorator-composition",
      title: "Decorator composition: creating one useful decorator from many",
      durationMinutes: 18,
      explanation: `As your application grows, you may notice that the same decorators are repeated over and over.

For example:

\`\`\`ts
@SetMetadata("roles", ["admin"])
@UseGuards(AuthGuard, RolesGuard)
@Get("reports")
getReports() {}
\`\`\`

Maybe every admin-only endpoint needs the same authentication and authorization setup.

Repeating that code everywhere makes the application noisy.

NestJS provides \`applyDecorators()\` so you can combine several decorators into one custom decorator.

Instead of:

\`\`\`ts
@UseGuards(AuthGuard, RolesGuard)
@Roles("admin")
@Get("reports")
getReports() {}
\`\`\`

you can create:

\`\`\`ts
export const AdminOnly = () =>
  applyDecorators(
    UseGuards(AuthGuard, RolesGuard),
    Roles("admin"),
  );
\`\`\`

Then your controller becomes:

\`\`\`ts
@AdminOnly()
@Get("reports")
getReports() {}
\`\`\`

This can make code much easier to read.

However, composition should be used carefully.

A decorator such as:

\`\`\`ts
@AdminOnly()
\`\`\`

is useful because it represents a meaningful application concept.

A decorator such as:

\`\`\`ts
@DoEverything()
\`\`\`

that secretly applies fifteen unrelated behaviors would make the code harder to understand.

<b>Beginner real-world example:</b>

Imagine a small admin dashboard.

Every admin endpoint needs:

- authentication
- admin role authorization

You can create:

\`\`\`ts
@AdminOnly()
\`\`\`

and use it on the relevant endpoints.

<b>Intermediate real-world example:</b>

Imagine a customer support system.

Support agents need authentication and a specific permission:

\`\`\`ts
@SupportOnly()

 could combine:

 \`\`\`ts
 UseGuards(AuthGuard, PermissionsGuard)
 Permissions("tickets.manage")
 \`\`\`

 The controller now reads like the business rule.

 <b>Advanced real-world example:</b>

 In an enterprise application, you might have a reusable decorator for an operation that needs several cross-cutting rules:

 \`\`\`ts
 @SensitiveOperation()
 \`\`\`

 which could combine:

 - authentication
- authorization metadata
- audit metadata
- rate limiting metadata

 The actual implementation can remain distributed across guards and interceptors.

 The decorator simply declares that the endpoint belongs to that category.

 This is a useful architectural pattern because the controller describes <b>what the endpoint is</b>, while infrastructure handles <b>how the cross-cutting concerns are enforced</b>.

 There is one important limitation to understand.

 Not every decorator can be safely composed with \`applyDecorators()\`. NestJS's documentation specifically notes limitations around decorators that depend on certain OpenAPI/Swagger behavior.

 So before creating a large composed decorator, make sure the decorators you are combining are compatible with the way NestJS processes them.

 Another important point is that decorator composition is not the same as creating a new runtime system.

 It is primarily a convenient way to package multiple decorators together.

 If you compose:

 \`\`\`ts
 UseGuards(AuthGuard)
 Roles("admin")
 \`\`\`

 you are not replacing guards.

 You are creating a convenient decorator that applies those existing pieces together.`,       diagram: `Without composition:

 @UseGuards(AuthGuard, RolesGuard)
 @Roles("admin")
 @Get("reports")
 getReports() {}

 With composition:

      @AdminOnly()
           |
   +-------+--------+
   |                |
   v                v

 @UseGuards(...) @Roles("admin")
 | |
 +-------+--------+
 |
 v
 Controller
 |
 v
 Route handler

 Composition packages related decorators
 into a readable application concept.`,       codeExample: {         title: "Creating an @AdminOnly() composed decorator",         code: `import {
 applyDecorators,
 UseGuards,
 } from "@nestjs/common";

 import { Roles } from "./roles.decorator";
 import { AuthGuard } from "./auth.guard";
 import { RolesGuard } from "./roles.guard";

 export function AdminOnly() {
 return applyDecorators(
 UseGuards(AuthGuard, RolesGuard),
 Roles("admin"),
 );
 }

 // users.controller.ts

 @Controller("users")
 export class UsersController {
 @AdminOnly()
 @Delete(":id")
 deleteUser(@Param(\"id\") id: string) {
 return this.usersService.delete(id);
 }
 }`,       },       keyTakeaways: [         "`applyDecorators()`lets you combine multiple decorators into one.",         "Composed decorators can make controllers much easier to read.",         "A good composed decorator should represent a meaningful application concept.",         "Keep the actual authentication, authorization, logging, and other behavior inside the appropriate NestJS components.",         "Do not create giant decorators that hide unrelated behavior.",         "Check compatibility when composing decorators from libraries such as Swagger/OpenAPI.",       ],       commonMistakes: [         "<b>Creating a decorator that hides too much.</b> If developers cannot understand what an endpoint does by reading the decorator name, the abstraction may be too large.",         "<b>Putting business logic inside a composed decorator.</b> Composition should normally combine existing decorators rather than become a replacement for services.",         "<b>Assuming every decorator can always be composed.</b> Some decorators have special behavior or limitations.",         "<b>Creating dozens of nearly identical composed decorators.</b> Extract them when they represent a real repeated application concept.",       ],       quiz: [         {           question: "What does`applyDecorators()` help you do?",           options: [             "Combine multiple decorators into one decorator",             "Create database tables",             "Compile TypeScript",             "Create HTTP requests",           ],           correctIndex: 0,           explanation:             "`applyDecorators()` lets you package multiple decorators into a single reusable decorator.",         },         {           question: "Which is a reasonable composed decorator?",           options: [             "`@DoEverything()` that hides the entire application",             "`@AdminOnly()` that combines authentication and admin-role metadata",             "`@Database()` that starts PostgreSQL",             "`@Compile()` that runs TypeScript",           ],           correctIndex: 1,           explanation:             "`@AdminOnly()\` represents a clear application concept and can combine related authentication and authorization decorators.",
 },
 ],
 },

{
  id: "complete-custom-decorator-system",
  title: "Putting everything together: user, roles, permissions, and metadata",
  durationMinutes: 13,
  explanation: `Now let's put the pieces together into something that looks much closer to a real application.

 Imagine you are building an admin dashboard for an ecommerce company.

 You need these rules:

 - Every protected endpoint requires an authenticated user.
- Some endpoints require a role.
- Some endpoints require a permission.
- Controllers should not repeatedly access \`request.user\`.
- Authorization rules should be visible next to the route.
- The actual authorization logic should remain inside guards.

 This is a perfect situation for custom decorators.

 First, create a \`@CurrentUser()\` parameter decorator.

 Now controllers can write:

 \`\`\`ts
 @Get("profile")
 getProfile(@CurrentUser() user: User) {}
 \`\`\`

 Next, create a \`@Roles()\` decorator.

 Now routes can declare:

 \`\`\`ts
 @Roles("admin")
 \`\`\`

 Then create a \`@Permissions()\` decorator:

 \`\`\`ts
 @Permissions("products.delete")
 \`\`\`

 Finally, use \`Reflector\` inside your guards to read the metadata.

 The overall request flow becomes:

 1. Authentication determines who the user is.
2. The authentication layer makes the user available to the request.
3. A guard reads the route metadata.
4. The guard compares the metadata with the authenticated user's roles or permissions.
5. The controller receives the current user through \`@CurrentUser()\`.
6. The service performs the business operation.

 Notice what happened.

 The controller became very readable.

 Instead of this:

 \`\`\`ts
 @UseGuards(AuthGuard, RolesGuard)
 @SetMetadata("roles", ["admin"])
 @Delete(":id")
 deleteUser(@Req() request, @Param(\"id\") id: string) {
 if (request.user.role !== "admin") {
 throw new ForbiddenException();
 }

 // ...
 }
 \`\`\`

 you can have:

 \`\`\`ts
 @AdminOnly()
 @Delete(":id")
 deleteUser(
 @CurrentUser() user: User,
 @Param(\"id\") id: string,
 ) {
 return this.usersService.delete(id, user.id);
 }
 \`\`\`

 The second version is not shorter just for the sake of being shorter.

 It is easier to understand because each concern has a clear home.

 Authentication belongs to the authentication guard.

 Authorization belongs to the authorization guard.

 Metadata describes what the route requires.

 User extraction belongs to the parameter decorator.

 Business logic belongs to the service.

 This separation becomes increasingly valuable as an application grows.

 <b>Advanced real-world scenario:</b>

 Suppose your ecommerce application eventually has:

 - customer support agents
- store managers
- finance managers
- administrators
- super administrators

 Instead of filling controllers with role checks, your application can use metadata:

 \`\`\`ts
 @Permissions("orders.refund")
 @Post(":id/refund")
 refundOrder() {}
 \`\`\`

 The permission guard can read the required permission.

 The controller does not need to know whether that permission comes from:

 - a role
- a database permission table
- an organization policy
- a subscription plan
- a feature flag

 That complexity belongs in the authorization layer.

 This is the deeper lesson behind custom decorators:

 <b>Decorators can make application intent visible while keeping implementation details in the infrastructure layer.</b>

 You should still avoid overengineering.

 If a custom decorator is used once and makes the code harder to understand, you probably do not need it.

 If the same concept appears throughout dozens of controllers, a custom decorator can provide significant value.`,       diagram: ` HTTP Request
 |
 v
 Authentication
 Guard
 |
 v
 request.user
 |
 v
 Authorization Guard
 |
 Reflector reads
 metadata
 |
 +----------+----------+
 | |
 @Roles(...) @Permissions(...)
 | |
 +----------+----------+
 |
 v
 Controller
 |
 +----------+----------+
 | |
 @CurrentUser() @Param(\"id\")
 | |
 +----------+----------+
 |
 v
 Service
 |
 v
 Database
 |
 v
 Response`,       codeExample: {         title: "A complete custom decorator setup",         code: `// current-user.decorator.ts
 import {
 createParamDecorator,
 ExecutionContext,
 } from "@nestjs/common";

 export const CurrentUser = createParamDecorator(
 (_data: unknown, context: ExecutionContext) => {
 const request = context.switchToHttp().getRequest();

return request.user;

 },
 );

 // roles.decorator.ts
 import { SetMetadata } from "@nestjs/common";

 export const Roles = (...roles: string[]) =>
 SetMetadata("roles", roles);

 // permissions.decorator.ts
 import { SetMetadata } from "@nestjs/common";

 export const Permissions = (...permissions: string[]) =>
 SetMetadata("permissions", permissions);

 // admin-only.decorator.ts
 import {
 applyDecorators,
 UseGuards,
 } from "@nestjs/common";

 export function AdminOnly() {
 return applyDecorators(
 Roles("admin"),
 UseGuards(AuthGuard, RolesGuard),
 );
 }

 // users.controller.ts
 @Controller("users")
 export class UsersController {
 @AdminOnly()
 @Delete(":id")
 deleteUser(
 @CurrentUser() user: User,
 @Param(\"id\") id: string,
 ) {
 return this.usersService.delete(id, user.id);
 }

 @UseGuards(AuthGuard, PermissionsGuard)
 @Permissions("users.read")
 @Get("profile")
 getProfile(@CurrentUser() user: User) {
 return this.usersService.getProfile(user.id);
 }
 }`,       },       keyTakeaways: [         "Custom decorators become especially powerful when combined with guards and Reflector.",         "Parameter decorators can expose application concepts such as the current user.",         "Metadata decorators can describe roles and permissions.",         "Reflector lets guards read that metadata.",         "Composed decorators can package common authorization setup.",         "Keep authentication, authorization, extraction, and business logic in separate responsibilities.",         "The goal is readable application code, not the maximum number of decorators.",       ],       commonMistakes: [         "<b>Putting authorization checks directly inside every controller method.</b> Use guards for cross-cutting authorization rules.",         "<b>Making decorators responsible for database operations.</b> Decorators should normally describe or extract information rather than perform business operations.",         "<b>Returning sensitive information through a custom parameter decorator.</b> Only expose the information the controller actually needs.",         "<b>Overusing abstractions.</b> If a normal method parameter or service call is clearer, use it.",       ],       quiz: [         {           question: "Which component should normally enforce role metadata?",           options: [             "A guard",             "A DTO",             "A database entity",             "A controller decorator alone",           ],           correctIndex: 0,           explanation:             "A guard can read role metadata using Reflector and decide whether the request should continue.",         },         {           question: "What is the main benefit of `@CurrentUser()\`?",
 options: [
 "It automatically authenticates the request",
 "It gives a controller the current user without repeatedly accessing the raw request",
 "It creates a new user",
 "It replaces the database",
 ],
 correctIndex: 1,
 explanation:
 "A custom parameter decorator can extract the authenticated user and provide it directly to the controller.",
 },
 ],
 },
 ],

 finalQuiz: [
 {
 question: "What is a custom decorator commonly used for in NestJS?",
 options: [
 "Attaching application-specific information or behavior",
 "Replacing the database",
 "Starting the development server",
 "Creating SQL tables",
 ],
 correctIndex: 0,
 explanation:
 "Custom decorators allow you to attach application-specific information or compose existing decorators into reusable concepts.",
 },
 {
 question: "What does `SetMetadata()` do?",
 options: [
 "Creates a service",
 "Attaches metadata to a target",
 "Creates an HTTP request",
 "Validates a DTO",
 ],
 correctIndex: 1,
 explanation:
 "`SetMetadata()` attaches metadata that can later be read by infrastructure such as guards.",
 },
 {
 question: "What is `Reflector` commonly used for?",
 options: [
 "Reading metadata",
 "Connecting to PostgreSQL",
 "Parsing request bodies",
 "Creating controllers",
 ],
 correctIndex: 0,
 explanation:
 "NestJS's Reflector service provides methods for retrieving metadata from classes and handlers.",
 },
 {
 question: "Which decorator would be a good choice for extracting the authenticated user?",
 options: [
 "@DatabaseUser()",
 "@CurrentUser()",
 "@GetUserFromSQL()",
 "@AuthenticationQuery()",
 ],
 correctIndex: 1,
 explanation:
 "A custom parameter decorator such as `@CurrentUser()` can extract the authenticated user from the request context.",
 },
 {
 question: "What does `context.getHandler()` identify?",
 options: [
 "The current route handler method",
 "The database connection",
 "The current DTO",
 "The application root module",
 ],
 correctIndex: 0,
 explanation:
 "`getHandler()` provides the current controller method, which can be used when reading handler-level metadata.",
 },
 {
 question: "Why might you use `context.getClass()` with Reflector?",
 options: [
 "To access the current controller class",
 "To access the database entity",
 "To create a new class",
 "To compile TypeScript",
 ],
 correctIndex: 0,
 explanation:
 "`getClass()` identifies the controller class associated with the current execution context.",
 },
 {
 question: "What is `getAllAndOverride()` useful for?",
 options: [
 "Combining database records",
 "Allowing specific metadata to override broader metadata",
 "Creating multiple controllers",
 "Overriding TypeScript configuration",
 ],
 correctIndex: 1,
 explanation:
 "It is useful when metadata can exist on both a controller and handler and the more specific value should take precedence.",
 },
 {
 question: "What is `getAllAndMerge()` useful for?",
 options: [
 "Combining metadata from multiple levels",
 "Merging database tables",
 "Combining HTTP responses",
 "Merging DTO classes automatically",
 ],
 correctIndex: 0,
 explanation:
 "`getAllAndMerge()` can combine metadata from the handler and class levels.",
 },
 {
 question: "Does `@Roles('admin')` automatically prevent non-admin users from accessing a route?",
 options: [
 "Yes, always",
 "No, something such as a guard must read and enforce the metadata",
 "Only when using PostgreSQL",
 "Only in production",
 ],
 correctIndex: 1,
 explanation:
 "The decorator normally attaches metadata. A guard can read that metadata and enforce the authorization rule.",
 },
 {
 question: "What does `applyDecorators()` allow you to do?",
 options: [
 "Combine multiple decorators into one reusable decorator",
 "Create a database",
 "Create a controller automatically",
 "Replace TypeScript",
 ],
 correctIndex: 0,
 explanation:
 "`applyDecorators()` lets you compose multiple decorators into a single custom decorator.",
 },
 {
 question: "Which is the better responsibility for a custom decorator?",
 options: [
 "Running complicated business workflows",
 "Attaching metadata or extracting request information",
 "Replacing all services",
 "Managing database transactions",
 ],
 correctIndex: 1,
 explanation:
 "Custom decorators are best used for describing code with metadata, composing decorators, or extracting contextual values.",
 },
 {
 question: "Why can `@CurrentUser()` make a controller cleaner?",
 options: [
 "It removes the need for authentication",
 "It hides repetitive raw request-object access",
 "It automatically creates a database user",
 "It replaces the service layer",
 ],
 correctIndex: 1,
 explanation:
 "The decorator can extract the current user so the controller can work directly with the user object.",
 },
 ],

 project: {
 name: "Build a Role & Permission Decorator System",
 goal:
 "Build a reusable authorization metadata system for a modular NestJS ecommerce API using custom decorators, parameter decorators, SetMetadata, Reflector, and decorator composition.",

brief: `Extend the Users, Products, and Orders API you have been building throughout the previous NestJS lessons.

 Your application should now support a clean authorization system where controllers describe access requirements using custom decorators rather than manually checking roles and permissions inside every method.

 The goal is not simply to create a \`@Roles()\` decorator.

 You should build the complete flow:

 \`\`\`
 Request
 |
 v
 Authentication
 |
 v
 request.user
 |
 v
 Authorization Guard
 |
 |---- Reflector reads @Roles()
 |
 |---- Reflector reads @Permissions()
 |
 v
 Controller
 |
 |---- @CurrentUser()
 |
 v
 Service
 |
 v
 Database
 \`\`\`

 Your implementation should make the controllers readable enough that another developer can understand the security requirements just by looking at the route.

 For example:

 \`\`\`ts
 @AdminOnly()
 @Delete(":id")
 deleteUser(
 @CurrentUser() user: User,
 @Param(\"id\") id: string,
 ) {
 return this.usersService.delete(id, user.id);
 }
 \`\`\`

 Instead of putting authorization logic directly inside the controller.

 This project should grow from a simple role-based system into a more realistic permission-based system.`,

steps: [
  "Create a `decorators` folder for reusable application decorators.",
  "Create a `CurrentUser` parameter decorator using `createParamDecorator()`.",
  "Make the `CurrentUser` decorator extract the authenticated user from the HTTP request.",
  "Create a `Roles` decorator using `SetMetadata()`.",
  "Create a `Permissions` decorator using `SetMetadata()`.",
  "Create a `RolesGuard` that uses `Reflector` to read the required roles.",
  "Use `ExecutionContext` inside the guard to access both the current handler and controller class.",
  "Test handler-level role metadata using `context.getHandler()`.",
  "Add controller-level role metadata using `context.getClass()`.",
  "Use `getAllAndOverride()` when route-level metadata should override controller-level metadata.",
  "Create a `PermissionsGuard` that reads permission metadata.",
  "Add a permissions array to your authenticated user model or mock authentication object.",
  "Create protected product routes such as `products.read`, `products.create`, and `products.delete`.",
  "Create protected order routes such as `orders.read`, `orders.refund`, and `orders.cancel`.",
  "Replace direct `request.user` access in controllers with `@CurrentUser()`.",
  "Create an `AdminOnly()` composed decorator using `applyDecorators()`.",
  "Make `AdminOnly()` combine the authentication guard, roles metadata, and roles guard.",
  "Create another composed decorator such as `ProductManagerOnly()` if your application has a product-management role.",
  "Test what happens when a route has no authorization metadata.",
  "Test what happens when a user has the required role.",
  "Test what happens when a user does not have the required role.",
  "Test a route with controller-level metadata and a more specific handler-level metadata rule.",
  "Test the difference between metadata override and metadata merge.",
  "Add clear error responses such as `401 Unauthorized` for missing authentication and `403 Forbidden` for insufficient permissions.",
  "Keep the actual business operations inside services rather than decorators.",
  "Review every custom decorator and make sure it has one clear responsibility."
],

acceptance: [
  "A reusable `@CurrentUser()` parameter decorator exists.",
  "Controllers can receive the authenticated user directly through `@CurrentUser()`.",
  "A reusable `@Roles()` decorator stores role metadata with `SetMetadata()`.",
  "A reusable `@Permissions()` decorator stores permission metadata with `SetMetadata()`.",
  "A `RolesGuard` reads role metadata using `Reflector`.",
  "The guard checks both handler-level and controller-level metadata.",
  "The application demonstrates `getAllAndOverride()` or another deliberate metadata-resolution strategy.",
  "A permissions guard can read permission metadata and compare it with the current user.",
  "At least one controller-level authorization rule is implemented.",
  "At least one route-level authorization rule is implemented.",
  "At least one composed decorator uses `applyDecorators()`.",
  "Unauthorized users receive an appropriate authentication error.",
  "Authenticated users without the required role or permission receive an appropriate authorization error.",
  "Business logic remains inside services rather than custom decorators.",
  "The controllers are easier to understand because authorization requirements are visible through decorators.",
],

stretch: [
  "Create a `@Permissions()` system where users can have multiple permissions rather than only one role.",
  "Support both controller-level and route-level permissions.",
  "Implement `getAllAndMerge()` and compare its behavior with `getAllAndOverride()`.",
  "Create an `@OwnerOrAdmin()` decorator and guard that allows either resource ownership or administrator access.",
  "Create an `@Audit()` decorator using metadata to describe important actions such as `order.refunded` or `user.deleted`.",
  "Create an audit interceptor that reads the audit metadata using `Reflector`.",
  "Create a `@RequiresPlan()` decorator for subscription-based access such as `free`, `pro`, and `enterprise`.",
  "Create a composed decorator such as `@EnterpriseAdminOnly()` that combines authentication, role metadata, permission metadata, and subscription metadata.",
  "Write unit tests for `CurrentUser`, `Roles`, and `Permissions` decorators.",
  "Write guard tests for users with matching and non-matching roles.",
  "Write tests that verify controller-level metadata can be overridden by route-level metadata.",
  "Add support for multiple roles and decide whether your authorization system uses AND or OR semantics.",
  "Document your authorization conventions so future developers know when to use roles, permissions, or composed decorators.",
],

 },
 };
