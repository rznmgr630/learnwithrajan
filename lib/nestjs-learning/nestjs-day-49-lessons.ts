import type { LessonDay } from "@/lib/learn/lesson-types";

export const API_VERSIONING_DAY_49_LESSONS: LessonDay = {
  day: 49,
  title: "API Versioning",
  totalMinutes: 100,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-49-lesson-1",
      title: "URI Versioning",
      durationMinutes: 22,
      explanation: `
<b>Imagine you have built a successful mobile app.</b> The backend serves a REST API that the app calls. Life is good. Then one day, product asks for a change: the \`/users/me\` endpoint should return the user's full name split into \`firstName\` and \`lastName\` instead of a single \`name\` field. You make the change, deploy, and go home.

The next morning, support is flooded with tickets. The old version of the mobile app — still installed on millions of phones — is crashing. It expects \`name\`, and it now gets \`firstName\` and \`lastName\`. You cannot force users to update the app. You cannot roll back the API change for new clients. You are stuck.

This is the problem <b>API versioning</b> solves. It lets you evolve your API without breaking clients that depend on the old behavior. You publish a new version of the endpoint with the new shape, and old clients keep calling the old version until they upgrade.

<b>Versioning is not just for mobile apps.</b> It applies to any situation where multiple clients evolve at different rates:
- Third-party integrations that you do not control.
- Microservices that are deployed independently.
- Public APIs consumed by unknown developers.
- Internal services where one team updates faster than another.
- Webhooks sent to customer endpoints that they built years ago.

<b>URI versioning is the most common and most visible strategy.</b> It puts the version number right in the URL path:

\`\`\`
GET /v1/users/me
GET /v2/users/me
\`\`\`

The version becomes part of the resource identifier. It is impossible to miss, easy to document, and trivial to test with curl.

<b>Why does URI versioning exist?</b> Because it is the simplest versioning strategy to implement, understand, and route. The version is a path segment, so an HTTP router can dispatch on it directly. No headers, no content negotiation, no surprises. Every developer who sees \`/v2/\` in a URL immediately knows what it means.

<b>How does it work internally?</b> At the HTTP level, \`/v1/users\` and \`/v2/users\` are different paths. The server routes them to different controllers or different handlers. The two versions can live side by side, sharing code where they overlap and diverging where they must. A reverse proxy (nginx, an API gateway, a cloud load balancer) can also route them — sometimes \`/v1/*\` goes to an old service and \`/v2/*\` to a new one. This is powerful because it lets you migrate entire services without a flag day.

<b>When should you use URI versioning?</b>
- When your API is public or consumed by clients you do not fully control.
- When the versioning boundary is significant (breaking changes, not just adding fields).
- When you want the version to be visible and obvious in logs, metrics, and dashboards.
- When you need to route versions to different backend services.
- When you want the simplest possible thing that works.

<b>When should you NOT use URI versioning?</b>
- <b>For purely additive changes.</b> Adding a new optional field does not require a new version. Old clients ignore fields they do not know about. Versioning every minor change creates version sprawl.
- <b>When you have a strict HATEOAS / REST-purist design.</b> Some architects argue that the URL identifies a resource, and adding a version number to the URL breaks the "one URL, one resource" principle. In practice, most teams accept this trade-off.
- <b>When the version changes are cosmetic.</b> If only the documentation changed, do not ship a new version.
- <b>When clients can be forced to upgrade.</b> If you fully control every client (e.g. a single internal web frontend deployed together with the API), versioning often adds cost without benefit.

<b>How beginners usually encounter this:</b> they copy a URL like \`https://api.stripe.com/v1/charges\` from Stripe's docs and wonder what the \`v1\` means. Later they build their own API, change a response shape, and break their own frontend. Then they learn versioning the hard way.

<b>The easiest mistake to make with URI versioning:</b> putting the version in the middle of the path or using a query parameter.

\`\`\`
GET /users/v1/me        -- WRONG: version in the middle is confusing
GET /users/me?version=1 -- WRONG: query params are for filters, not for routing
\`\`\`

The version should always be the first path segment after the host (or after a global prefix like \`/api\`):

\`\`\`
GET /v1/users/me        -- RIGHT
GET /api/v1/users/me    -- RIGHT (with a global prefix)
\`\`\`

<b>What about the version number itself?</b> There are three common styles:
- <b>Major only:</b> \`/v1/\`, \`/v2/\`. Simple and unambiguous. This is what most public APIs use.
- <b>Major.minor:</b> \`/v1.2/\`. Rarely used for public APIs. Usually overkill.
- <b>Date-based:</b> \`/2024-01-01/\`. Some APIs (Stripe, Twilio in some products) use dated versions so clients pin to a specific schema snapshot. Powerful but complex.

For most teams, <b>major-only is the right choice</b>. It signals "this is a breaking change" and nothing more.

<b>What can go wrong with URI versioning?</b>
- <b>Version proliferation.</b> Teams create \`/v1\`, \`/v2\`, \`/v3\`, \`/v4\` in a single year because they version every small change. This is version sprawl — every version multiplies maintenance cost.
- <b>Copy-paste code duplication.</b> Version 2 is copied from version 1, which was copied from version 0. Bugs get fixed in one place and left in others.
- <b>Shared libraries ignored.</b> Teams forget that shared business logic should live in a service layer, not in the versioned controller.
- <b>No deprecation plan.</b> Old versions stay alive forever because no one wants to be the one to turn them off. This is the number one cause of API bloat.
- <b>Inconsistent versioning across services.</b> One microservice uses \`/v1/\`, another uses \`/api/1/\`, another uses headers. The result is a mess for clients.
- <b>Version in the wrong place.</b> \`/api/users/v1\` is not idiomatic. Always \`/api/v1/users\`.
- <b>Unversioned endpoints leaking through.</b> A new endpoint ships without \`/v1\` and clients get confused. Enforce the prefix globally.

<b>How this appears in a real application:</b> a SaaS company launches a public API at \`https://api.example.com/v1/\`. Over three years, they add fields, endpoints, and query parameters — all backward compatible, all still under \`/v1\`. Then they need to redesign pagination and change the response envelope. That is a breaking change. They ship \`/v2/\`. Clients on \`/v1/\` keep working. New clients use \`/v2/\`. A deprecation timeline gives v1 users 12 months to migrate. After 12 months, v1 returns \`410 Gone\` with a link to the migration guide. This is the well-managed versioning lifecycle.

<b>How URI versioning interacts with NestJS:</b> NestJS has built-in support via \`app.enableVersioning({ type: VersioningType.URI })\` and the \`@Version('1')\` decorator on controllers or routes. You will see this in detail in lesson 4.

The rest of today's lessons cover the other versioning strategies, how to plan deprecation and migration, and how to wire it all up in NestJS. URI versioning is your default — reach for the other strategies only when they solve a specific problem.
      `,
      diagram: `
URI Versioning

  Client A (old mobile app)
      |
      |  GET https://api.example.com/v1/users/me
      v
  +-------------------------------+
  |    API Gateway / Load Balancer |
  |    routes /v1/* -> Service A   |
  +-------------------------------+
                                    \\
                                     \\
                                      v
                              +------------------+
                              |  v1 controller   |
                              |  returns {name}  |
                              +------------------+

  Client B (new web app)
      |
      |  GET https://api.example.com/v2/users/me
      v
  +-------------------------------+
  |    API Gateway / Load Balancer |
  |    routes /v2/* -> Service B   |
  +-------------------------------+
                                    \\
                                     \\
                                      v
                              +------------------------+
                              |  v2 controller         |
                              |  returns {firstName,   |
                              |           lastName}    |
                              +------------------------+

Key properties:
  - Version is visible in the URL
  - Easy to log, monitor, cache per version
  - Can route different versions to different backends
  - Best for public APIs and long-lived clients
      `,
      codeExample: { title: "Example", code: `
// ============================================
// URI VERSIONING — BASIC NESTJS EXAMPLE
// ============================================

// main.ts — enable URI versioning globally
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Every route now supports a version segment: /v1/..., /v2/...
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // requests without /vX/ use v1
    prefix: 'v',         // result: /v1/users, /v2/users
  });

  app.setGlobalPrefix('api'); // optional: /api/v1/users

  await app.listen(3000);
}
bootstrap();

// ============================================
// VERSIONED CONTROLLERS
// ============================================

// users.v1.controller.ts
import { Controller, Get, Version } from '@nestjs/common';

@Controller('users')
@Version('1')
export class UsersV1Controller {
  @Get('me')
  getMe() {
    // v1 response shape: single \`name\` string
    return { id: "day-49-lesson-1", name: 'Ada Lovelace', email: 'ada@example.com' };
  }
}

// users.v2.controller.ts
@Controller('users')
@Version('2')
export class UsersV2Controller {
  @Get('me')
  getMe() {
    // v2 response shape: firstName / lastName, plus a version field
    return {
      id: "day-49-lesson-1",
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    };
  }
}

// ============================================
// SHARING BUSINESS LOGIC BETWEEN VERSIONS
// ============================================
// Do NOT copy-paste the whole controller. Share the service.

// users.service.ts
@Injectable()
export class UsersService {
  async findById(id: number): Promise<UserEntity> {
    // real business logic lives here, unchanged across versions
    return this.userRepo.findOneBy({ id });
  }
}

// users.v1.controller.ts (uses the same service)
@Controller('users')
@Version('1')
export class UsersV1Controller {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe() {
    const user = await this.usersService.findById(1);
    // v1 adapter: collapse to a single \`name\`
    return { id: user.id, name: \`\${user.firstName} \${user.lastName}\`, email: user.email };
  }
}

// users.v2.controller.ts
@Controller('users')
@Version('2')
export class UsersV2Controller {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe() {
    const user = await this.usersService.findById(1);
    // v2 returns the entity fields directly
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}

// ============================================
// REQUEST FLOW
// ============================================
// GET /api/v1/users/me  -> UsersV1Controller.getMe() -> {name}
// GET /api/v2/users/me  -> UsersV2Controller.getMe() -> {firstName, lastName}
// GET /api/users/me     -> defaultVersion '1' -> UsersV1Controller.getMe()
      ` },
      keyTakeaways: [
        "URI versioning puts the version in the URL path: `/v1/users`, `/v2/users`.",
        "It is the simplest, most visible, and most widely used versioning strategy for public APIs.",
        "Version is always the first path segment after the host or global prefix — never in the middle.",
        "Version only for breaking changes; additive fields do not need a new version.",
        "Share business logic in the service layer; version the controllers, not the domain.",
        "Have a deprecation plan from day one — otherwise versions accumulate forever.",
        "NestJS supports URI versioning via `app.enableVersioning({ type: VersioningType.URI })` and `@Version('1')`.",
      ],
      commonMistakes: [
        "<b>Versioning every small change.</b> Teams ship `/v3/`, `/v4/`, `/v5/` in a single year for additive changes. This multiplies maintenance cost without benefit. Only break the version for breaking changes.",
        "<b>Putting the version in the middle of the path.</b> `/users/v1/me` is confusing and non-idiomatic. Use `/v1/users/me`.",
        "<b>Duplicating business logic across versions.</b> Copy-pasting the service into each version means bugs get fixed in one and left in others. Share the service; version only the outer shape.",
        "<b>No deprecation policy.</b> Without a plan to retire old versions, you accumulate `/v1` through `/v9` and burn engineering time maintaining all of them.",
        "<b>Inconsistent versioning across services.</b> Some services use `/v1/`, others use `?version=1`, others use headers. Clients pay the price.",
        "<b>Forgetting unversioned routes.</b> A new endpoint ships without a version prefix and bypasses versioning entirely. Enforce a global prefix or a linter rule.",
        "<b>Using `defaultVersion` carelessly.</b> A request without a version silently hits a default. That default must be explicitly chosen and documented — clients should not rely on it.",
      ],
      quiz: [
        {
          question:
            "Which of these is the idiomatic place for the version in a URI-versioned API?",
          options: [
            "`/users/v1/me`",
            "`/v1/users/me`",
            "`/users/me?v=1`",
            "`/users/me/v1`",
          ],
          correctIndex: 1,
          explanation:
            "The version belongs as the first path segment after the host or global prefix. `/v1/users/me` is idiomatic. Middle-of-path and query-parameter versions are non-standard and confuse clients and tooling.",
        },
        {
          question:
            "You add a new optional field to the user response. Old clients ignore it. Do you need a new API version?",
          options: [
            "Yes, always.",
            "No. Additive, backward-compatible changes do not require a new version.",
            "Only if the client is mobile.",
            "Only if the field is nullable.",
          ],
          correctIndex: 1,
          explanation:
            "Adding an optional field is backward compatible — old clients continue to work because they ignore unknown fields. Version bumps are for breaking changes (removed fields, renamed fields, changed types, changed behavior).",
        },
        {
          question:
            "You have `/v1/users` and `/v2/users`. Both controllers need the same user-lookup logic. What is the correct approach?",
          options: [
            "Copy the service code into both controllers to keep them independent.",
            "Put the shared logic in a single service and let each versioned controller call it, adapting only the response shape.",
            "Duplicate the database schema for each version.",
            "Use a different database per version.",
          ],
          correctIndex: 1,
          explanation:
            "Versioning is about the API surface, not about duplicating business logic. Keep the service layer shared and version only the request/response adapters (controllers, DTOs). This ensures bug fixes apply to every version.",
        },
        {
          question:
            "Why is version proliferation a real problem?",
          options: [
            "Because URLs get longer.",
            "Because every version multiplies maintenance cost — bug fixes, security patches, tests, and documentation all scale with the number of live versions.",
            "Because HTTP cannot handle more than two versions.",
            "Because clients cannot detect the version.",
          ],
          correctIndex: 1,
          explanation:
            "Each live version is a code path you must maintain, secure, and test. Ten versions mean ten times the surface area. Only create new versions for real breaking changes and retire old ones on a schedule.",
        },
      ],
    },
    {
      id: "day-49-lesson-2",
      title: "Header and Media Type Versioning",
      durationMinutes: 22,
      explanation: `
<b>Imagine you are designing an API for a payments company.</b> Your URLs need to be clean and stable — merchants integrate with \`https://api.payments.example.com/charges\`, and you do not want that URL changing every time you ship a breaking change. But you still need to evolve the response format.

This is the situation where <b>header versioning</b> (and its close cousin, <b>media type versioning</b>) shines. Instead of putting the version in the URL, you put it in an HTTP header. The resource URL stays the same; the client announces which version it wants via a header.

There are two families of header versioning:

<b>1. Custom header versioning.</b> The client sends a custom header such as:

\`\`\`
GET /charges
X-API-Version: 2
\`\`\`

The URL is \`/charges\`. The version lives entirely in the header. Servers can route on this header, and clients can bump the version by changing one line of code.

<b>2. Media type (content negotiation) versioning.</b> The client declares a versioned media type in \`Accept\` (for responses) and/or \`Content-Type\` (for requests):

\`\`\`
GET /charges
Accept: application/vnd.payments.v2+json
\`\`\`

The media type \`application/vnd.payments.v2+json\` means "I want the payment resource in v2 JSON format." This is the strategy GitHub famously used for years and that several large APIs still use today.

<b>Why do these strategies exist?</b> Because URLs are supposed to identify resources, not versions of resources. A purist REST argument says \`/charges/123\` should always mean the same thing — the same charge — regardless of the API version. Changing the URL to \`/v2/charges/123\` would imply it is a different resource, which is philosophically odd.

The pragmatic argument: keeping URLs clean means:
- Bookmarking and sharing links works across versions.
- Caching layers can key on the URL and the version header separately.
- Clients integrate once and evolve the header over time.
- You can route versions inside your application without touching the URL structure.

<b>When to use header versioning:</b>
- When you want clean, stable resource URLs.
- When you have sophisticated clients that already do content negotiation.
- When the version is a fine-grained concern (per request, not per path).
- When you own both ends and can enforce the header in SDKs.
- When you need to keep the URL surface minimal for security or aesthetics.

<b>When to NOT use header versioning:</b>
- <b>When clients are simple or diverse.</b> A browser developer debugging an endpoint cannot easily set a custom header. A third-party integrator may forget to send it. Header versioning adds friction.
- <b>When you need to route at the edge.</b> Some load balancers and CDNs cannot easily route on custom headers or vendor media types without extra configuration.
- <b>When you want the version to be obvious.</b> URIs are visible in logs, browsers, docs, and error messages. Headers are invisible unless you look for them.
- <b>When tools do not support it.</b> Some testing tools, API gateways, and monitoring systems struggle with content negotiation. Confirm your stack supports it before committing.
- <b>When your team is small and wants the simplest thing.</b> Header versioning is powerful but adds cognitive overhead.

<b>How beginners usually encounter this:</b> they use the GitHub API and see \`Accept: application/vnd.github+json\`. Or they work with Stripe, which uses a dated version sent in a custom header (\`Stripe-Version: 2024-01-01\`). Both patterns are common in the wild, and both are legitimate.

<b>Custom header vs media type: which is better?</b>

<b>Custom header (\`X-API-Version\`)</b>
- Simple to implement and understand.
- Easy to test — one header field.
- Not standardized.
- Some proxies strip unknown headers.

<b>Media type versioning (\`Accept: application/vnd.foo.v2+json\`)</b>
- Aligned with HTTP content negotiation.
- Uses the standardized \`Accept\` header.
- No custom headers required.
- Requires \`Vary: Accept\` on caches.
- Trickier to express in some frameworks and tools.
- Verbose.

In practice, both work. The custom header is slightly easier to operate; the vendor media type is slightly more REST-faithful. Pick one and document it clearly.

<b>Important caching detail: \`Vary: Accept\`.</b> If you version via \`Accept\`, any shared cache (CDN, reverse proxy, browser) must include the \`Accept\` header in its cache key. Otherwise a v1 response can be served to a v2 client. Always set:

\`\`\`
Vary: Accept, X-API-Version
\`\`\`

This is a subtle bug that only shows up under load and is very hard to diagnose.

<b>What if a client omits the version header?</b> Choose a policy and stick to it:
- Reject with \`400 Bad Request\` — explicit, no surprises.
- Fall back to a default version — convenient but hides bugs.
- Return \`406 Not Acceptable\` if the client's \`Accept\` media type is unknown.

Most APIs fall back to a default version (usually the oldest supported version) for pragmatic compatibility. But you should still document this clearly.

<b>Mixing with URI versioning.</b> Some APIs use both: URI for major versions (\`/v2/...\`) and headers for minor variations. This is rarely a good idea. Pick one strategy per API and stick to it. Mixed strategies confuse clients and complicate routing.

<b>What can go wrong?</b>
- <b>Header stripped by a proxy.</b> Some corporate firewalls and CDNs strip unknown headers. Your versioning silently falls back to the default. Test with production-style infrastructure.
- <b>Cache poisoning.</b> Without \`Vary: Accept\`, a v1 response can be served to v2 clients. This is a serious correctness bug.
- <b>Client forgets the header.</b> They get the default version and never realize it. Errors become mysterious. Document the requirement loudly.
- <b>Version mismatch between request and response.</b> A client sends \`Accept: v2\` but the server returns v1 by accident. Clients parse the wrong shape and crash.
- <b>No observability.</b> Headers are not visible in access logs by default. Add them to your log pipeline so you can see which versions are actually in use.
- <b>Undocumented defaults.</b> The default version changes silently during a refactor. Clients break. Always make the default explicit and enforce it in code.

<b>How this appears in a real application:</b> a fintech company uses \`Stripe-Version: 2024-01-01\` style dated versions. Each merchant's account stores the version they last used. When they log in, they see a "new API version available" banner with a migration guide. They can pin their version, test against a new one, and flip when ready. The URL is always \`/v1/charges\` — the version is a header. This is a hybrid where URI v1 is the "path prefix" and the header distinguishes fine-grained schema snapshots.

<b>How this fits with NestJS:</b> NestJS supports header versioning via \`app.enableVersioning({ type: VersioningType.HEADER, header: 'X-API-Version' })\` and media type versioning via \`VersioningType.MEDIA_TYPE\` with a vendor string. Lesson 4 shows the configuration in detail.

Both strategies are legitimate. Choose based on your clients, your infrastructure, and your team's comfort. URI versioning is the pragmatic default; header versioning is the choice when clean URLs and standards-aligned content negotiation matter more.
      `,
      diagram: `
Header Versioning

  Client (SDK sends version header)
      |
      |  GET /charges
      |  X-API-Version: 2
      v
  +-------------------------------+
  |  API Gateway / NestJS router   |
  |  reads X-API-Version header    |
  +-------------------------------+
                |
                +-- v1 handler -> legacy response shape
                |
                +-- v2 handler -> new response shape
                |
                +-- no header  -> default version (documented!)

Media Type Versioning

  Client
      |
      |  GET /charges
      |  Accept: application/vnd.payments.v2+json
      v
  +-------------------------------+
  |  Content negotiation layer     |
  |  parses Accept header          |
  +-------------------------------+
                |
                +-- v1 media type -> v1 response
                |
                +-- v2 media type -> v2 response
                |
                +-- unknown       -> 406 Not Acceptable

Cache rule:
  Vary: Accept, X-API-Version
  (Otherwise a v1 response can be served to a v2 client.)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// HEADER VERSIONING IN NESTJS
// ============================================

// main.ts
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Route based on the X-API-Version header.
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'X-API-Version',
    defaultVersion: '1', // used when the header is missing
  });

  await app.listen(3000);
}
bootstrap();

// Same URL, different version:
// GET /charges  X-API-Version: 1  -> charges.v1.controller
// GET /charges  X-API-Version: 2  -> charges.v2.controller
// GET /charges                     -> default v1

// charges.v1.controller.ts
@Controller('charges')
@Version('1')
export class ChargesV1Controller {
  @Get(':id')
  findOne(@Param('id') id: string) {
    // v1 response: { id, amount, currency }
    return { id, amount: 1000, currency: 'usd' };
  }
}

// charges.v2.controller.ts
@Controller('charges')
@Version('2')
export class ChargesV2Controller {
  @Get(':id')
  findOne(@Param('id') id: string) {
    // v2 adds fields, no breakage.
    return {
      id,
      amount: 1000,
      currency: 'usd',
      createdAt: new Date().toISOString(),
      status: 'succeeded',
    };
  }
}

// ============================================
// MEDIA TYPE VERSIONING IN NESTJS
// ============================================

// main.ts
app.enableVersioning({
  type: VersioningType.MEDIA_TYPE,
  key: 'v=', // parses ";v=" from the Accept header
  // client sends: Accept: application/json;v=2
});

// charges.v2.controller.ts
@Controller('charges')
@Version('2')
export class ChargesV2Controller {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, amount: 1000, currency: 'usd', status: 'succeeded' };
  }
}

// ============================================
// SETTING Vary: HEADERS FOR CACHING SAFETY
// ============================================
// Add a small interceptor or middleware to set Vary on every response.

// vary.interceptor.ts
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class VaryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    // Ensure shared caches keep v1 and v2 responses separate.
    res.setHeader('Vary', 'Accept, X-API-Version');
    return next.handle();
  }
}

// Wire it globally in main.ts:
// app.useGlobalInterceptors(new VaryInterceptor());

// ============================================
// WHAT HAPPENS IF THE HEADER IS MISSING?
// ============================================
// With defaultVersion: '1', the request silently falls back to v1.
// Document this clearly. Some teams prefer to reject the request:

// main.ts (strict mode — no default version)
// app.enableVersioning({ type: VersioningType.HEADER, header: 'X-API-Version' });
// Then missing header -> 404 / 400. Pick your policy and be consistent.

// ============================================
// OBSERVABILITY: LOG THE REQUESTED VERSION
// ============================================
// version.logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class VersionLoggingMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const version = req.headers['x-api-version'] ?? 'default';
    // In production, add this to a structured logger field.
    console.log(\`[api-version] \${req.method} \${req.originalUrl} v=\${version}\`);
    next();
  }
}
      ` },
      keyTakeaways: [
        "Header versioning keeps URLs stable and identifies the version via `X-API-Version` or a similar custom header.",
        "Media type versioning uses the standardized `Accept` header with a vendor media type like `application/vnd.foo.v2+json`.",
        "Always set `Vary: Accept, X-API-Version` so shared caches do not mix versions.",
        "Decide and document what happens when the version header is missing — fall back to a default or reject the request.",
        "Header versioning is best when URLs must stay clean and clients are sophisticated.",
        "URI versioning is generally simpler and more visible; choose header versioning only when it solves a specific problem.",
        "Log the requested version so you can see which versions clients actually use.",
      ],
      commonMistakes: [
        "<b>Forgetting `Vary: Accept`.</b> A CDN or reverse proxy can cache the v1 response and serve it to a v2 client. Always add `Vary` when versioning via headers.",
        "<b>Silent default fallback with no documentation.</b> A client forgets the header, gets v1, and never realizes the mistake. Document defaults loudly, and log when the fallback is used.",
        "<b>Custom header stripped by infrastructure.</b> Some proxies strip unknown headers. Test on production-like infrastructure before committing to the strategy.",
        "<b>Mixing header and URI versioning carelessly.</b> `/v2/charges` plus `X-API-Version: 3` is confusing. Pick one strategy per API surface.",
        "<b>Using non-standard media types without vendor prefix.</b> `application/json;v=2` can collide with other systems. Prefer `application/vnd.yourcompany.v2+json` or a documented custom header.",
        "<b>No observability on version usage.</b> If versions are only in headers, you cannot see them in default access logs. Add them explicitly to your logging pipeline.",
        "<b>Rejecting missing headers with a 500.</b> A missing version header is a client error (400) or a documented default — never an internal server error.",
      ],
      quiz: [
        {
          question:
            "Which header is used for media type versioning?",
          options: [
            "`X-API-Version`",
            "`Accept` with a vendor media type",
            "`Content-Length`",
            "`Authorization`",
          ],
          correctIndex: 1,
          explanation:
            "Media type versioning uses the standardized `Accept` header (for responses) and/or `Content-Type` (for requests) with a vendor media type like `application/vnd.example.v2+json`.",
        },
        {
          question:
            "Why must you set `Vary: Accept, X-API-Version` when using header or media type versioning?",
          options: [
            "Because HTTP requires it.",
            "Because otherwise a shared cache (CDN, proxy, browser) can serve a v1 response to a v2 client, causing incorrect data.",
            "Because it makes responses faster.",
            "Because it enables CORS.",
          ],
          correctIndex: 1,
          explanation:
            "`Vary` tells caches which request headers affect the response. Without it, all clients see the same cached response regardless of version header, breaking versioning under caching.",
        },
        {
          question:
            "A client sends `GET /charges` without any version header. What are the acceptable server behaviors?",
          options: [
            "Return 500 Internal Server Error.",
            "Return 400 Bad Request, or fall back to a documented default version — but never silently error.",
            "Return a random version.",
            "Hang the request indefinitely.",
          ],
          correctIndex: 1,
          explanation:
            "Missing header is either a client error (400) or an intentional fallback to a documented default. The key is to decide the policy, document it, and enforce it consistently. A 500 is never appropriate.",
        },
        {
          question:
            "Which situation is a poor fit for header versioning?",
          options: [
            "Sophisticated SDK clients that can set headers easily.",
            "A public API consumed by developers who debug in the browser and often forget custom headers.",
            "An internal microservice mesh where each service is configured centrally.",
            "A payments API where the URL must stay stable.",
          ],
          correctIndex: 1,
          explanation:
            "Header versioning adds friction for public APIs consumed by developers using browsers or simple tools. URI versioning is more visible and forgiving. Header versioning shines when clients are controlled or sophisticated.",
        },
      ],
    },
    {
      id: "day-49-lesson-3",
      title: "Deprecation and Migration",
      durationMinutes: 28,
      explanation: `
<b>Imagine you have shipped a public API and it has grown to 200 paying customers.</b> You have \`/v1/\`, \`/v2/\`, and a small team that is tired of maintaining three code paths for the same domain logic. Now product wants to ship \`/v3/\` because of a new feature. You can feel the version sprawl coming. And you have no idea how many customers still call \`/v1/\`.

This is where <b>deprecation and migration</b> matter. Versioning creates new versions. Deprecation is how you retire old ones. Migration is how you help clients move. Without a clear plan, every version lives forever, and your maintenance burden grows without bound.

<b>Deprecation is not deletion.</b> Deprecating an endpoint means: "This version is supported, but we will retire it on a specific date. Please migrate." During deprecation, the endpoint keeps working — you just signal the intent. Deletion is when you finally turn it off. The two are separate phases, often years apart.

<b>A well-run deprecation has four phases:</b>

<b>Phase 1: Announcement.</b> You publish a deprecation notice. It goes in:
- The API documentation (a banner at the top of every v1 page).
- The changelog.
- The developer portal.
- Direct emails to every customer who has called the endpoint in the last 90 days.
- A response header on the endpoint itself: \`Deprecation: true\` and \`Sunset: <date>\`.

The last two are the most important. A customer who never reads your changelog will still see the header. A customer whose traffic you can measure can be emailed directly.

<b>Phase 2: Soft deprecation.</b> The endpoint works, but every response includes headers telling clients that a sunset is coming:

\`\`\`
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Mar 2025 00:00:00 GMT
Link: <https://docs.example.com/migrate-v1-to-v2>; rel="deprecation"
\`\`\`

Some teams also add a custom header with the remaining days: \`X-Days-Until-Sunset: 180\`. This is optional but helpful.

<b>Phase 3: Hard deprecation.</b> As the sunset date approaches, you escalate:
- Increase the frequency of reminder emails (30 days, 14 days, 7 days, 1 day before sunset).
- Add warnings to the response body.
- Contact remaining high-traffic clients individually.
- Consider rate-limiting old versions to discourage continued use.
- Add a "countdown" header to the response.

<b>Phase 4: Sunset (deletion).</b> On the sunset date, you stop serving the endpoint. Common ways to do this:
- Return \`410 Gone\` with a body pointing to the migration guide.
- Return \`301 Moved Permanently\` to the equivalent v2 endpoint (if the mapping is 1:1).
- Route to a "this version has been retired" page.

\`410 Gone\` is usually the correct choice for an API. \`301\` implies the resource has moved, which is misleading — the old version is gone, not relocated.

<b>How to actually know who is still using the old version.</b> Instrument the endpoint. Log:
- The API version.
- The authenticated client (API key, customer ID, or user ID).
- The endpoint and method.
- The timestamp.

Aggregate this into a dashboard. Show "active clients per version, by day." When you are ready to sunset v1, you need to answer: "How many clients, and which ones?" Without this data, you are flying blind, and sunset becomes politically impossible.

<b>Backward compatibility: the alternative to versioning.</b>

Not every change requires a new version. Before you create \`/v3/\`, ask: "Can I make this change in a backward-compatible way?"

Backward-compatible changes include:
- Adding a new optional request field.
- Adding a new response field (clients ignore unknown fields).
- Adding a new endpoint.
- Loosening validation rules (accept more values).
- Making a previously required field optional.
- Changing internal implementation without changing the response.

Breaking changes include:
- Removing or renaming a field.
- Changing a field's type or meaning.
- Making an optional request field required.
- Tightening validation rules (rejecting values that used to work).
- Changing status codes or error shapes.
- Changing default behavior.

Whenever possible, prefer a backward-compatible change over a new version. This is called <b>Postel's principle</b> or the robustness principle: "Be conservative in what you send, liberal in what you accept." Each backward-compatible change avoids a version bump entirely.

<b>The expand-and-contract pattern.</b> When you need to make a breaking change that can be staged, use expand-and-contract:

1. <b>Expand:</b> Add the new field alongside the old one. Both are returned. Old clients keep working; new clients use the new field.
2. <b>Deprecate:</b> Announce that the old field will be removed on a specific date. Include a \`Deprecation\` header.
3. <b>Monitor:</b> Track who is still using the old field. If your API is JSON, you may not be able to measure usage directly — instead, email clients and give them time.
4. <b>Contract:</b> Remove the old field on the sunset date. If you did the previous steps well, this is a non-event.

Expand-and-contract turns a breaking change into a series of compatible ones, avoiding a new version altogether. This is the gold standard for evolving APIs.

<b>Migration guides.</b> Deprecation without a migration guide is punishment. Every deprecated version needs a clear, testable migration path:
- Side-by-side examples of the old and new request/response.
- A mapping table for fields ("\`name\` is split into \`firstName\` and \`lastName\`").
- Any behavioral differences called out explicitly.
- A sample code snippet in the client's language.
- Contact information for questions.

The best migration guides come with a "compatibility mode." In v2, accept the v1 request shape and translate it. Then v1 clients can point at \`/v2/\` without changing their request body. This dramatically reduces migration friction.

<b>How long should deprecation last?</b> There is no universal answer, but some common patterns:
- <b>Internal microservices:</b> days to weeks. You control every caller; you can update them in lockstep.
- <b>Enterprise B2B APIs:</b> 6–18 months. Customers integrate slowly and have change-control processes.
- <b>Public developer APIs:</b> 12–24 months. You have thousands of clients, many of whom you cannot contact.
- <b>Mobile SDKs:</b> 24+ months. Old app versions live on users' phones for years.

The correct answer depends on how long it takes your least-updated client to migrate. If you do not know, assume longer.

<b>What can go wrong?</b>
- <b>No sunset date.</b> "We will deprecate it soon." Without a date, nothing happens. Publish a specific date and stick to it.
- <b>No usage telemetry.</b> You cannot sunset what you cannot measure. If you do not know who calls v1, you cannot turn it off safely.
- <b>Broken promise.</b> You announce a sunset, then silently extend it. Clients learn that your sunset dates are not real, and they stop trusting them. Extend a sunset only in extreme situations, and always with clear communication.
- <b>Silent removal.</b> You stop serving v1 with no notice. Clients break. Trust is lost. Never do this to external clients.
- <b>No migration guide.</b> Clients are stuck and angry. They delay migration, and you delay sunset. Both sides lose.
- <b>Broken compatibility mode.</b> The v2 endpoint claims to accept v1 requests but subtly differs. Clients migrate, hit a bug, and roll back. Test compatibility mode rigorously.
- <b>Versioning without deprecation culture.</b> You ship v1, v2, v3 but never retire any of them. Maintenance cost grows forever. Versioning is only healthy when paired with regular deprecation.
- <b>Aggressive sunset with no telemetry.</b> You sunset on schedule, and your largest customer (who never read the email) breaks in production. Legal gets involved. Always verify by telemetry before pulling the trigger.

<b>How this appears in a real application:</b> a payments platform ships API v1 in 2018, v2 in 2020, v3 in 2022. Every release announces the previous version's sunset 18 months out. Every version has a migration guide and a compatibility mode. A deprecation dashboard shows per-version traffic. Every quarter, the team reviews: "Can we sunset v1 yet? Who is still on it?" When v1 traffic drops below 1%, they email the remaining clients individually and set a final sunset date. Six months later, v1 returns \`410 Gone\` with a link to the migration guide. The cycle repeats for v2. This is what a mature API lifecycle looks like.

<b>How this fits with NestJS:</b> you can implement deprecation headers with a simple interceptor on versioned controllers. You can log the version with middleware. And you can sunset versions by removing the controller entirely and adding a catch-all route that returns \`410 Gone\`. Lesson 4 will show a working setup.
      `,
      diagram: `
API Version Lifecycle

  v1 created
      |
      v
  v1 in production, v2 planned
      |
      v
  v2 shipped  +  v1 soft deprecation starts
      |               |
      |               +--> Deprecation: true
      |               +--> Sunset: <date>
      |               +--> Link: <migration guide>
      |               +--> Emails to known clients
      |
      v
  T-30 days: reminder emails, in-app warnings
  T-7 days:  final warnings, countdown header
  T-0 days:  sunset
      |
      v
  v1 endpoints return 410 Gone
      |
      v
  v1 controllers deleted, v1 docs archived

Telemetry dashboard (during deprecation):
  +-----------------------------+
  |  v1 traffic:  5,120 req/day |
  |  v1 clients:  3 orgs        |
  |  v2 traffic: 88,400 req/day |
  |  v3 traffic: 12,100 req/day |
  +-----------------------------+

Sunset readiness checklist:
  [x] Telemetry shows < 1% traffic on v1
  [x] All remaining clients contacted
  [x] Migration guide published
  [x] Compatibility mode available in v2
  [x] Legal + support informed
  [x] Rollback plan documented
      `,
      codeExample: { title: "Example", code: `
// ============================================
// DEPRECATION & MIGRATION IN NESTJS
// ============================================

// ---------- 1. Deprecation headers interceptor ----------
// Adds Deprecation + Sunset + Link headers to every response
// from a controller (or a specific route).

// deprecation.interceptor.ts
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export const DEPRECATED_METADATA = 'deprecated';

export interface DeprecationOptions {
  sunset: string;          // RFC 1123 date, e.g. 'Sat, 01 Mar 2025 00:00:00 GMT'
  migrationUrl: string;    // link to the migration guide
}

@Injectable()
export class DeprecationInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.getAllAndOverride<DeprecationOptions>(
      DEPRECATED_METADATA,
      [context.getHandler(), context.getClass()],
    );

    const res = context.switchToHttp().getResponse();

    if (options) {
      res.setHeader('Deprecation', 'true');
      res.setHeader('Sunset', options.sunset);
      res.setHeader(
        'Link',
        \`<\${options.migrationUrl}>; rel="deprecation"\`,
      );

      // Optional: countdown in days
      const sunsetDate = new Date(options.sunset).getTime();
      const daysLeft = Math.max(
        0,
        Math.ceil((sunsetDate - Date.now()) / (1000 * 60 * 60 * 24)),
      );
      res.setHeader('X-Days-Until-Sunset', String(daysLeft));
    }

    return next.handle();
  }
}

// ---------- 2. Decorator to mark a versioned controller ----------
// deprecated.decorator.ts
import { SetMetadata } from '@nestjs/common';
import {
  DEPRECATED_METADATA,
  DeprecationOptions,
} from './deprecation.interceptor';

export const Deprecated = (options: DeprecationOptions) =>
  SetMetadata(DEPRECATED_METADATA, options);

// ---------- 3. Versioned controller with deprecation ----------
// users.v1.controller.ts
@Controller('users')
@Version('1')
@Deprecated({
  sunset: 'Sat, 01 Mar 2025 00:00:00 GMT',
  migrationUrl: 'https://docs.example.com/migrate-v1-to-v2',
})
export class UsersV1Controller {
  @Get('me')
  getMe() {
    return { id: "day-49-lesson-1", name: 'Ada Lovelace' };
  }
}

// Wire it up globally in main.ts (or in a module):
// app.useGlobalInterceptors(new DeprecationInterceptor(app.get(Reflector)));

// Every response from /v1/users/me now includes:
//   Deprecation: true
//   Sunset: Sat, 01 Mar 2025 00:00:00 GMT
//   Link: <https://docs.example.com/migrate-v1-to-v2>; rel="deprecation"
//   X-Days-Until-Sunset: 180

// ---------- 4. Version-usage logging middleware ----------
// version-usage.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class VersionUsageMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    // Extract version from URL (/v1/...), header, or query.
    const match = req.originalUrl.match(/\\/v(\\d+)\\//);
    const version = match ? match[1] : 'unknown';

    // In production, ship this to your analytics pipeline
    // so you can measure per-version traffic by customer.
    const clientId = (req as any).user?.orgId ?? 'anonymous';
    console.log(
      JSON.stringify({
        event: 'api_request',
        version,
        clientId,
        method: req.method,
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      }),
    );

    next();
  }
}

// app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VersionUsageMiddleware).forRoutes('*');
  }
}

// ---------- 5. Sunsetting a version: 410 Gone ----------
// After sunset, remove the v1 controller entirely and add a catch-all
// that returns 410 Gone for any request under /v1/*.

// sunset.controller.ts
@Controller('v1')
export class V1SunsetController {
  @All('*')
  gone() {
    throw new GoneException({
      error: 'v1_retired',
      message:
        'API v1 was retired on 2025-03-01. Please migrate to v2: https://docs.example.com/migrate-v1-to-v2',
      documentation: 'https://docs.example.com/migrate-v1-to-v2',
    });
  }
}

// ---------- 6. Expand-and-contract example ----------
// Goal: rename \`name\` to \`firstName\` + \`lastName\` without a new major version.

// Step 1 — EXPAND: return BOTH the old and the new fields.
@Get('me')
async getMeExpanded() {
  const user = await this.usersService.findById(1);
  return {
    id: user.id,
    name: \`\${user.firstName} \${user.lastName}\`, // legacy field
    firstName: user.firstName,                    // new fields
    lastName: user.lastName,
  };
}

// Step 2 — DEPRECATE: add the Deprecation headers on this route.
// Step 3 — MONITOR: watch for clients still reading \`name\`.
// Step 4 — CONTRACT: after the sunset date, remove \`name\`.

// ---------- 7. Migration guide snippet (documentation example) ----------
// Old (v1):
//   GET /v1/users/me
//   { "id": 1, "name": "Ada Lovelace", "email": "..." }
//
// New (v2):
//   GET /v2/users/me
//   { "id": 1, "firstName": "Ada", "lastName": "Lovelace", "email": "..." }
//
// Mapping:
//   name -> firstName + lastName (split on the first space)
//
// Behavioral changes:
//   - \`email\` is now always lowercased.
//   - \`id\` is unchanged.
      ` },
      keyTakeaways: [
        "Deprecation and deletion are separate phases — deprecation announces intent, deletion executes the sunset.",
        "Use the `Deprecation`, `Sunset`, and `Link` headers to signal status on the endpoint itself.",
        "Publish a specific sunset date; vague promises never lead to actual retirement.",
        "Instrument per-version usage by client so you know exactly who still calls the old version.",
        "Prefer backward-compatible changes and expand-and-contract over new versions.",
        "Every deprecation needs a migration guide with side-by-side examples and, ideally, a compatibility mode.",
        "On sunset, return `410 Gone` — not `301` — with a link to the migration guide.",
      ],
      commonMistakes: [
        "<b>Announcing deprecation without a sunset date.</b> 'We will deprecate it soon' is meaningless. Without a specific date, the version stays alive forever.",
        "<b>No usage telemetry.</b> You cannot safely sunset what you cannot measure. If you do not know who calls v1, you will not pull the trigger.",
        "<b>Silent removal.</b> Turning off an endpoint with no notice destroys trust and often breaks production clients. Always deprecate before deletion.",
        "<b>Removing fields without expand-and-contract.</b> A hard removal in a minor release breaks clients. Return both fields for a deprecation window, then contract.",
        "<b>Extending the sunset date without communication.</b> Clients learn that your sunset dates are not real and stop preparing. Only extend with clear announcements.",
        "<b>No migration guide.</b> Clients are left to guess the differences. They delay migration. You delay sunset. Both sides lose.",
        "<b>Broken compatibility mode.</b> The 'v2 accepts v1 requests' claim quietly fails for some inputs. Test rigorously or do not offer compatibility mode at all.",
        "<b>Sunset without warning individual clients.</b> Aggregate announcements are ignored. Email every client above a traffic threshold directly, repeatedly.",
      ],
      quiz: [
        {
          question:
            "Which HTTP header tells clients that an endpoint is being retired?",
          options: [
            "`Retry-After`",
            "`Deprecation` and `Sunset`",
            "`Cache-Control`",
            "`Content-Disposition`",
          ],
          correctIndex: 1,
          explanation:
            "`Deprecation: true` signals the endpoint is deprecated. `Sunset: <date>` announces the specific retirement date. Together they let clients (and tooling) plan migrations.",
        },
        {
          question:
            "You want to rename a response field from `name` to `firstName` + `lastName` without creating a new API version. What is the recommended approach?",
          options: [
            "Remove `name` immediately.",
            "Use expand-and-contract: return both the old and new fields for a deprecation period, then remove the old field on the sunset date.",
            "Rename the endpoint.",
            "Keep the field name but change its meaning.",
          ],
          correctIndex: 1,
          explanation:
            "Expand-and-contract turns a breaking change into a series of compatible ones: add the new field alongside the old one, announce the deprecation, monitor, then remove the old field. No new version required.",
        },
        {
          question:
            "What status code should a retired endpoint return?",
          options: [
            "`200 OK` with an empty body",
            "`301 Moved Permanently`",
            "`410 Gone` with a link to the migration guide",
            "`500 Internal Server Error`",
          ],
          correctIndex: 2,
          explanation:
            "`410 Gone` correctly indicates that the resource existed but is no longer available. `301` implies the resource merely moved, which is misleading for a retired version. Include a migration URL in the response body.",
        },
        {
          question:
            "You want to sunset API v1, but you do not know which clients still use it. What is the first thing you should do?",
          options: [
            "Sunset immediately — the endpoint is deprecated, so clients should have migrated.",
            "Add instrumentation to log per-version usage by client, then use that data to decide when and how to sunset.",
            "Send one blanket email to all customers.",
            "Turn off v1 and see what breaks.",
          ],
          correctIndex: 1,
          explanation:
            "Without telemetry you cannot know the impact of a sunset. Instrument first, gather data, then contact remaining clients individually and set a realistic sunset date.",
        },
        {
          question:
            "Why is 'internal microservices can have shorter deprecation windows' a valid statement?",
          options: [
            "Because internal services use less data.",
            "Because you control every caller and can deploy updates in lockstep, so migrating is fast and coordinated.",
            "Because headers do not apply to internal services.",
            "Because security policies are different internally.",
          ],
          correctIndex: 1,
          explanation:
            "Deprecation windows depend on how quickly clients can migrate. When you control every caller, you can coordinate upgrades in the same release cycle, so short windows are safe. External clients need longer.",
        },
      ],
    },
    {
      id: "day-49-lesson-4",
      title: "Versioning in NestJS",
      durationMinutes: 20,
      explanation: `
<b>You have seen the three versioning strategies — URI, header, and media type.</b> You understand deprecation and migration. Now let's put it all together in NestJS, with a specific focus on how the framework's built-in versioning support works, where it shines, and where you have to add your own glue.

NestJS has <b>first-class versioning support</b> built into the framework. You enable it once in \`main.ts\` and the framework takes care of routing versioned requests to the right controller or route handler. This is a big win over rolling your own versioning — the machinery is consistent, tested, and integrates with guards, interceptors, pipes, and Swagger.

<b>Three versioning types in NestJS</b>:
1. <b>\`VersioningType.URI\`</b> — version appears in the path (\`/v1/users\`). This is the default recommendation for most APIs.
2. <b>\`VersioningType.HEADER\`</b> — version comes from a custom header (\`X-API-Version: 1\`).
3. <b>\`VersioningType.MEDIA_TYPE\`</b> — version comes from a media type parameter (\`Accept: application/json;v=1\`).

You choose one per application. NestJS handles the routing for you.

<b>How it works internally.</b> When you enable versioning, NestJS registers each route with its version metadata. On an incoming request, the router extracts the version (from path, header, or media type), then matches it against the registered routes. Controllers and routes declare their version via \`@Version('1')\`. If no version is provided and \`defaultVersion\` is set, the framework uses the default.

A route can also be version-neutral by declaring \`@Version(VERSION_NEUTRAL)\`. This is useful for endpoints like \`/health\` or \`/metrics\` that should not be versioned — they are the same regardless of API version.

A single handler can support multiple versions:

\`\`\`typescript
@Version(['1', '2'])
@Get('status')
getStatus() { ... }
\`\`\`

This is handy for endpoints whose behavior does not change between versions.

<b>Versioning at the controller level vs the route level.</b> You can set \`@Version('1')\` on the whole controller (all routes inherit it) or on individual route handlers (that specific route uses this version). Mixing both is possible but confusing — pick one style per controller.

<b>NestJS does not do version adaptation for you.</b> The framework routes the request to the right handler. It does not transform v1 responses into v2 shape or vice versa. That is your job. In practice, this means:
- Each version has its own controller (usually) with its own DTOs.
- Each version's controller calls a shared service.
- Each controller adapts the response to that version's contract.

This separation is important. If you try to share one controller across versions and branch inside handlers, the code becomes a maze. Separate controllers per version plus a shared service is the clean pattern.

<b>Versioned DTOs.</b> Response and request shapes differ between versions. This means you usually have:
- \`CreateUserV1Dto\` and \`CreateUserV2Dto\`
- \`UserResponseV1\` and \`UserResponseV2\`

Some teams put these in \`/v1/dto/\` and \`/v2/dto/\` folders. Others keep a single folder and name them by version. Either is fine — consistency is what matters.

<b>Validation pipelines work per version.</b> The \`ValidationPipe\` runs against the DTO bound to the current handler. Since each version has its own DTO, validation rules can differ per version naturally.

<b>Guards and interceptors run per version too.</b> Auth guards, logging interceptors, and rate limiters see the request at the version that routed to them. If you want per-version analytics, add a logging interceptor that records the version along with the request.

<b>Swagger: document each version separately.</b> NestJS Swagger can generate multiple documents — one per version — or a single doc with version tags. The cleanest approach for public APIs is to generate one Swagger document per version:

\`\`\`typescript
const config = new DocumentBuilder()
  .setTitle('Users API')
  .setVersion('1')
  .build();
const document = SwaggerModule.createDocument(app, config, {
  include: [UsersV1Module],
});
SwaggerModule.setup('docs/v1', app, document);

const configV2 = new DocumentBuilder().setTitle('Users API').setVersion('2').build();
const documentV2 = SwaggerModule.createDocument(app, configV2, {
  include: [UsersV2Module],
});
SwaggerModule.setup('docs/v2', app, documentV2);
\`\`\`

This gives clients an honest picture of what each version returns. A single messy doc across versions confuses everyone.

<b>Testing versioned endpoints.</b> Your e2e tests should cover:
- Each version returns the correct response shape.
- Unknown versions return the expected error (usually \`404\` or \`400\`).
- Missing version falls back to \`defaultVersion\` (if you set one).
- \`VERSION_NEUTRAL\` routes work without a version.
- Deprecation headers appear on deprecated versions.
- Sunset routes return \`410 Gone\`.

\`\`\`typescript
it('returns v1 shape', async () => {
  const res = await request(app.getHttpServer()).get('/v1/users/me').expect(200);
  expect(res.body).toEqual({ id: "day-49-lesson-1", name: 'Ada Lovelace' });
});

it('returns v2 shape', async () => {
  const res = await request(app.getHttpServer()).get('/v2/users/me').expect(200);
  expect(res.body).toEqual({
    id: "day-49-lesson-1",
    firstName: 'Ada',
    lastName: 'Lovelace',
  });
});

it('returns 410 for a retired version', async () => {
  await request(app.getHttpServer()).get('/v0/users/me').expect(410);
});
\`\`\`

<b>What about versioning in microservices?</b> NestJS versioning works for HTTP transport, not for message-based transports like Kafka, RabbitMQ, or gRPC (which has its own versioning patterns). For microservices, the common approach is to version the message schema itself — include a \`version\` field in the payload or use a schema registry. The lesson here is HTTP-specific, but the mindset (explicit versions, backward-compatible evolution, deprecation) applies everywhere.

<b>Common versioning patterns in NestJS projects</b>:

<b>Pattern 1: One module per version.</b> Keep v1 and v2 fully separated.
\`\`\`
src/
  users/
    v1/
      users.v1.controller.ts
      users.v1.module.ts
      dto/
    v2/
      users.v2.controller.ts
      users.v2.module.ts
      dto/
    users.service.ts   // shared
\`\`\`

Pros: clean separation, easy to delete a version later. Cons: some duplication of module wiring.

<b>Pattern 2: Same module, versioned controllers.</b>
\`\`\`
src/users/
  users.controller.ts        // @Version('1')
  users.v2.controller.ts     // @Version('2')
  users.service.ts
  users.module.ts            // declares both controllers
\`\`\`

Pros: less boilerplate. Cons: the module must be carefully pruned when a version is retired.

<b>Pattern 3: Shared service, versioned adapters.</b> This is what we have been hinting at. The service is version-agnostic; each version's controller adapts the request and response. This is the pattern most teams land on because it keeps the business logic single-sourced and the version differences isolated to the edge.

<b>What can go wrong in NestJS specifically?</b>
- <b>Forgetting \`defaultVersion\`.</b> If you omit it, requests without a version return 404, which surprises clients. Decide your default deliberately.
- <b>Setting \`VERSION_NEUTRAL\` on too many routes.</b> Neutral routes bypass versioning. Great for \`/health\`, dangerous for \`/users\` — a neutral \`/users\` means every version shares the same handler, defeating the point.
- <b>Mixed route and controller versions.</b> Some handlers declare \`@Version('1')\`, others inherit from the controller. Understandable, but easy to get wrong. Prefer one style.
- <b>Type mismatch across versions.</b> The v2 controller returns \`firstName\`, but the frontend is still on v1 and sees only \`name\`. Tests catch this if written; nothing else does.
- <b>Forgotten Swagger for a version.</b> A version exists but has no docs. Clients guess. Setup a Swagger document per version.
- <b>Version sprawl in the file system.</b> Multiple parallel \`v1/\`, \`v2/\`, \`v3/\`, \`v4/\` folders where only one is current and the rest are stale. Retire versions aggressively.
- <b>Interceptors not version-aware.</b> A global interceptor that logs "user created" does not record which version handled the request. Add version to the log context.
- <b>Tests copy-pasted per version.</b> Tests should assert the specific shape of each version, not duplicate the whole suite. Cover the differences.

<b>How this comes together in a real application:</b> a mid-sized SaaS platform organizes its API like this:
- One NestJS application.
- URI versioning enabled globally with \`defaultVersion: '1'\`.
- \`/v1/\` and \`/v2/\` controllers with shared services.
- \`VERSION_NEUTRAL\` on \`/health\`, \`/metrics\`, and \`/auth/refresh\`.
- A \`DeprecationInterceptor\` on all v1 controllers with a sunset date and migration link.
- A \`VersionUsageMiddleware\` logging per-request version, client, and path to the analytics pipeline.
- A per-version Swagger doc.
- A quarterly review of the version dashboard. When v1 traffic drops below 1%, they plan a sunset.
- On sunset, v1 controllers are deleted, a catch-all \`410 Gone\` controller replaces them, and the docs are archived.

This is the full lifecycle. Versioning is not just a routing trick — it is an operational discipline. NestJS gives you the tools; the discipline is yours to build.
      `,
      diagram: `
NestJS Versioning Architecture

  main.ts
     |
     v
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
     |
     v
  +-------------------------------------------+
  |  NestJS router                            |
  |  matches version -> correct controller    |
  +-------------------------------------------+
       |                     |                     |
       v                     v                     v
   /v1/users             /v2/users             /health
       |                     |                     |
       v                     v                     v
  UsersV1Controller     UsersV2Controller     HealthController
  @Version('1')         @Version('2')         @Version(VERSION_NEUTRAL)
       |                     |                     |
       +----------+----------+---------------------+
                  |
                  v
          +----------------+
          |  UsersService  |   <- business logic shared
          |  (no version)  |      across versions
          +----------------+
                  |
                  v
          +----------------+
          |  UserRepository|
          +----------------+

Response adaptation happens in each controller:
  UsersV1Controller -> { name }
  UsersV2Controller -> { firstName, lastName }

Deprecation on v1:
  Deprecation: true
  Sunset: <date>
  Link: <migration-guide>

Sunset on v1 (after date):
  catch-all /v1/* -> 410 Gone
      `,
      codeExample: { title: "Example", code: `
// ============================================
// VERSIONING IN NESTJS — FULL SETUP
// ============================================

// ---------- 1. main.ts — enable versioning ----------
import { NestFactory } from '@nestjs/core';
import { Reflector, VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DeprecationInterceptor } from './common/deprecation.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable URI versioning. /v1/... and /v2/...
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // Global validation for all versions.
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
  );

  // Global deprecation headers (only applies to routes marked @Deprecated).
  app.useGlobalInterceptors(new DeprecationInterceptor(app.get(Reflector)));

  // Per-version Swagger documents.
  const v1Config = new DocumentBuilder().setTitle('API v1').setVersion('1').build();
  const v1Doc = SwaggerModule.createDocument(app, v1Config, {
    include: [UsersV1Module],
  });
  SwaggerModule.setup('docs/v1', app, v1Doc);

  const v2Config = new DocumentBuilder().setTitle('API v2').setVersion('2').build();
  const v2Doc = SwaggerModule.createDocument(app, v2Config, {
    include: [UsersV2Module],
  });
  SwaggerModule.setup('docs/v2', app, v2Doc);

  await app.listen(3000);
}
bootstrap();

// ---------- 2. Shared service ----------
// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  findById(id: number): Promise<User> {
    return this.userRepo.findOneByOrFail({ id });
  }
}

// ---------- 3. Version 1 controller (deprecated) ----------
// users/v1/users.v1.controller.ts
@ApiTags('users-v1')
@Controller('users')
@Version('1')
@Deprecated({
  sunset: 'Sat, 01 Mar 2025 00:00:00 GMT',
  migrationUrl: 'https://docs.example.com/migrate-v1-to-v2',
})
export class UsersV1Controller {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe() {
    const user = await this.usersService.findById(1);
    // v1 shape: single \`name\`
    return { id: user.id, name: \`\${user.firstName} \${user.lastName}\` };
  }
}

// ---------- 4. Version 2 controller (current) ----------
// users/v2/users.v2.controller.ts
@ApiTags('users-v2')
@Controller('users')
@Version('2')
export class UsersV2Controller {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe() {
    const user = await this.usersService.findById(1);
    // v2 shape: firstName + lastName
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}

// ---------- 5. Version-neutral endpoints ----------
// health.controller.ts
@Controller('health')
@Version(VERSION_NEUTRAL)
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
// GET /health works without a version prefix.

// ---------- 6. Multi-version handler ----------
// A route that behaves the same across versions.
@Controller('config')
export class ConfigController {
  @Version(['1', '2'])
  @Get('features')
  features() {
    return { features: ['a', 'b', 'c'] };
  }
}
// GET /v1/config/features and /v2/config/features both work.

// ---------- 7. Sunsetting v1 ----------
// sunset.controller.ts
@Controller('v1')
export class V1SunsetController {
  @All('*')
  gone() {
    throw new GoneException({
      error: 'v1_retired',
      message:
        'API v1 was retired on 2025-03-01. Please migrate to v2.',
      documentation: 'https://docs.example.com/migrate-v1-to-v2',
    });
  }
}

// ---------- 8. Module wiring ----------
// users/users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersV1Controller, UsersV2Controller],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// ---------- 9. E2E tests ----------
// test/users.e2e-spec.ts
import * as request from 'supertest';

describe('Users API versioning', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'v',
    });
    await app.init();
  });

  it('returns v1 shape', async () => {
    const res = await request(app.getHttpServer()).get('/v1/users/me').expect(200);
    expect(res.body).toEqual({ id: "day-49-lesson-1", name: 'Ada Lovelace' });
  });

  it('returns v2 shape', async () => {
    const res = await request(app.getHttpServer()).get('/v2/users/me').expect(200);
    expect(res.body).toEqual({ id: "day-49-lesson-1", firstName: 'Ada', lastName: 'Lovelace' });
  });

  it('v1 responses carry deprecation headers', async () => {
    const res = await request(app.getHttpServer()).get('/v1/users/me').expect(200);
    expect(res.headers['deprecation']).toBe('true');
    expect(res.headers['sunset']).toBeDefined();
    expect(res.headers['link']).toContain('rel="deprecation"');
  });

  it('retired v0 returns 410 Gone', async () => {
    await request(app.getHttpServer()).get('/v0/users/me').expect(410);
  });

  it('version-neutral /health works without version', async () => {
    await request(app.getHttpServer()).get('/health').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

// ---------- 10. Recommended file layout ----------
// src/
//   users/
//     v1/
//       users.v1.controller.ts
//       dto/
//         user.v1.response.ts
//     v2/
//       users.v2.controller.ts
//       dto/
//         user.v2.response.ts
//     users.service.ts       <- shared
//     users.module.ts        <- declares v1 + v2 controllers
//   common/
//     deprecation.interceptor.ts
//     version-usage.middleware.ts
//   health/
//     health.controller.ts   <- @Version(VERSION_NEUTRAL)
//   v1-sunset/
//     sunset.controller.ts   <- 410 Gone for retired v1
      ` },
      keyTakeaways: [
        "NestJS supports versioning natively via `app.enableVersioning()` with `URI`, `HEADER`, or `MEDIA_TYPE` types.",
        "Use `@Version('1')` on controllers or routes to declare the version; use `VERSION_NEUTRAL` for endpoints like `/health`.",
        "Keep one versioned controller per version and share a single version-agnostic service for business logic.",
        "NestJS routes the request but does not adapt the response — that is your responsibility per version.",
        "Set `defaultVersion` deliberately; requests without a version will fall back to it (or 404 if omitted).",
        "Generate a separate Swagger document per version so clients see an honest picture of each version's contract.",
        "Add deprecation headers via an interceptor and 410 Gone via a catch-all controller when a version is retired.",
      ],
      commonMistakes: [
        "<b>Forgetting `defaultVersion`.</b> Requests without a version return 404, surprising clients. Choose a default explicitly or document the strict behavior.",
        "<b>Marking `/users` as `VERSION_NEUTRAL`.</b> Neutral routes bypass versioning. Great for `/health`, dangerous for business endpoints — every version shares the same handler.",
        "<b>Mixing route-level and controller-level versions.</b> Some routes declare `@Version('1')` and others inherit differently. Confusing and easy to break. Pick one style per controller.",
        "<b>Duplicating business logic in every version.</b> The service should be single and version-agnostic. Only the outer layer (controllers, DTOs) differs.",
        "<b>Forgetting Swagger for a version.</b> A version exists but has no documentation, so clients guess. Set up per-version Swagger documents.",
        "<b>No tests for version-specific shapes.</b> A shared test suite that does not assert each version's response shape misses the whole point. Add version-specific assertions.",
        "<b>Never retiring old versions.</b> Versions accumulate until every change multiplies maintenance. Pair versioning with a real deprecation policy.",
        "<b>Sunsetting without telemetry.</b> Turning off a version without data on who uses it is reckless. Instrument per-version usage first.",
      ],
      quiz: [
        {
          question:
            "Which NestJS API enables versioning at the application level?",
          options: [
            "`app.useVersioning()`",
            "`app.enableVersioning({ type: VersioningType.URI })`",
            "`app.setVersion()`",
            "`app.version('v1')`",
          ],
          correctIndex: 1,
          explanation:
            "`app.enableVersioning()` is the correct entry point. You pass a configuration object with `type` set to `VersioningType.URI`, `HEADER`, or `MEDIA_TYPE`, plus optional `defaultVersion` and `prefix`.",
        },
        {
          question:
            "You want a route to work identically in every version. What decorator should you use?",
          options: [
            "`@Version('*')`",
            "`@Version(VERSION_NEUTRAL)`",
            "`@Version(['1','2','3'])`",
            "No decorator — it defaults to neutral.",
          ],
          correctIndex: 1,
          explanation:
            "`VERSION_NEUTRAL` marks a route as version-independent, so it is reachable regardless of the client's version. Use it for endpoints like `/health`, `/metrics`, or `/auth/refresh`.",
        },
        {
          question:
            "You have `@Version('1')` on the controller and `@Version('2')` on one of its route handlers. What happens?",
          options: [
            "The route-level version overrides the controller for that handler, causing inconsistent routing. Avoid mixing.",
            "NestJS throws a compile error.",
            "Both versions handle the route simultaneously.",
            "The route is ignored.",
          ],
          correctIndex: 0,
          explanation:
            "Route-level decorators override controller-level ones for that specific handler. NestJS allows mixing, but it creates confusing, hard-to-reason routing. Pick one style — usually controller-level — and be consistent.",
        },
        {
          question:
            "Where should shared business logic live in a versioned NestJS application?",
          options: [
            "Inside each version's controller.",
            "In a version-agnostic service that both versioned controllers call.",
            "Duplicated in each version's service.",
            "In the DTO.",
          ],
          correctIndex: 1,
          explanation:
            "The service layer should be version-agnostic and shared. Only the outer layer (controllers, DTOs, response shapes) should differ per version. This keeps bug fixes applying to every version.",
        },
        {
          question:
            "A client requests `/v3/users` but you only have v1 and v2. What should happen?",
          options: [
            "Return the v2 response silently.",
            "Return a 404 (or 400) with a clear error explaining the version does not exist.",
            "Return the default version's response.",
            "Return a 500 error.",
          ],
          correctIndex: 1,
          explanation:
            "Unknown versions should be an explicit client error. Returning a different version silently hides mistakes and can cause data issues on the client. A clear 404/400 tells the client something is wrong.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question:
        "Which of these is NOT a common API versioning strategy?",
      options: [
        "URI versioning (`/v1/users`)",
        "Header versioning (`X-API-Version: 1`)",
        "Media type versioning (`Accept: application/vnd.foo.v2+json`)",
        "Database versioning (`?db=users_v1`)",
      ],
      correctIndex: 3,
      explanation:
        "Versioning applies to the API contract (URL, headers, media type). It is not a database concept. The three legitimate strategies are URI, header, and media type versioning.",
    },
    {
      question:
        "Which versioning strategy is the most visible and easiest to reason about for public APIs?",
      options: [
        "URI versioning",
        "Header versioning",
        "Media type versioning",
        "Query parameter versioning",
      ],
      correctIndex: 0,
      explanation:
        "URI versioning puts the version in the path, where it is visible in logs, browsers, docs, and error messages. It requires no special headers and works with virtually every client and tool.",
    },
    {
      question:
        "You add a new optional response field to your API. Do you need to publish a new version?",
      options: [
        "Yes — any change requires a new version.",
        "No — additive, backward-compatible changes do not require a new version.",
        "Only if the field is numeric.",
        "Only if the client is a browser.",
      ],
      correctIndex: 1,
      explanation:
        "Adding a field is backward compatible. Old clients ignore unknown fields. Only breaking changes (removals, renames, type changes, behavior changes) require a version bump.",
    },
    {
      question:
        "What does the `Sunset` HTTP header tell a client?",
      options: [
        "That the server will shut down at this time.",
        "The date on which a deprecated endpoint or version will be retired.",
        "How long the response is cached.",
        "The timezone of the server.",
      ],
      correctIndex: 1,
      explanation:
        "`Sunset` is a standardized header that announces the retirement date of a resource. It lets clients plan and complete migrations before the endpoint stops responding.",
    },
    {
      question:
        "Which pattern avoids a breaking change without creating a new API version?",
      options: [
        "Delete the old field immediately.",
        "Expand-and-contract: return the new field alongside the old one, deprecate the old, then remove it later.",
        "Rename the endpoint.",
        "Change the response type without notice.",
      ],
      correctIndex: 1,
      explanation:
        "Expand-and-contract turns one breaking change into a series of compatible ones: add the new field, deprecate the old one, monitor usage, then remove the old field on a sunset date.",
    },
    {
      question:
        "Which HTTP status code should a retired API version return?",
      options: [
        "`200 OK`",
        "`301 Moved Permanently`",
        "`410 Gone`",
        "`500 Internal Server Error`",
      ],
      correctIndex: 2,
      explanation:
        "`410 Gone` correctly indicates that the resource existed but is no longer available. `301` implies the resource merely moved. Include a migration link in the response body.",
    },
    {
      question:
        "Why is per-version usage telemetry critical before sunsetting a version?",
      options: [
        "Because HTTP requires it.",
        "Because you cannot safely retire a version without knowing who still uses it — turning it off blindly risks breaking production clients.",
        "Because it reduces server load.",
        "Because it improves SEO.",
      ],
      correctIndex: 1,
      explanation:
        "Telemetry tells you which clients still call the old version, how much traffic it receives, and whether sunset is safe. Without it, you are flying blind and may break important integrations.",
    },
    {
      question:
        "You enable versioning in NestJS with `defaultVersion: '1'`. A client sends `GET /users/me` without any version. What happens?",
      options: [
        "404 Not Found",
        "The request is routed to the v1 handler because v1 is the default version.",
        "500 Internal Server Error",
        "The request is rejected with 400.",
      ],
      correctIndex: 1,
      explanation:
        "`defaultVersion` designates which version handles requests that do not specify one. Choosing a default is a deliberate policy decision — make sure it is documented.",
    },
    {
      question:
        "What decorator marks a NestJS route as reachable in any version?",
      options: [
        "`@AnyVersion()`",
        "`@Version(VERSION_NEUTRAL)`",
        "`@NoVersion()`",
        "`@Unversioned()`",
      ],
      correctIndex: 1,
      explanation:
        "`@Version(VERSION_NEUTRAL)` marks the route as version-independent. Use it for endpoints like `/health` or `/metrics` that do not change across API versions.",
    },
    {
      question:
        "Where should shared business logic live in a versioned NestJS app?",
      options: [
        "In each version's controller.",
        "In a single version-agnostic service called by every versioned controller.",
        "In the DTOs.",
        "In the module metadata.",
      ],
      correctIndex: 1,
      explanation:
        "The service is version-agnostic. Controllers adapt request/response shapes per version, and the shared service provides the domain logic. This keeps bug fixes applying to all versions.",
    },
    {
      question:
        "Why is `Vary: Accept, X-API-Version` important for header and media type versioning?",
      options: [
        "Because HTTP requires it for all responses.",
        "Because shared caches must know which request headers affect the response; otherwise they can serve a v1 response to a v2 client.",
        "Because it improves security.",
        "Because it enables compression.",
      ],
      correctIndex: 1,
      explanation:
        "`Vary` tells caches which request headers influence the response. Without it, caches may serve a response generated for one version to clients requesting another, which is a serious correctness bug.",
    },
    {
      question:
        "Which is a valid reason NOT to version a change?",
      options: [
        "The change removes a required field.",
        "The change renames a response field.",
        "The change only adds an optional field.",
        "The change alters a status code.",
      ],
      correctIndex: 2,
      explanation:
        "Adding an optional field is backward compatible. The other options are breaking changes that require either a new version or an expand-and-contract strategy.",
    },
    {
      question:
        "You control every client (single internal web frontend deployed together with the API). Is strict versioning necessary?",
      options: [
        "Yes — always version every API.",
        "Not always. When you can deploy the API and every client together, strict versioning often adds cost without benefit.",
        "Only if the API is REST.",
        "Only if the API is public.",
      ],
      correctIndex: 1,
      explanation:
        "Versioning exists to support clients that evolve on different schedules. When you deploy all clients together, you can change the API freely and skip versioning for internal-only endpoints — as long as you accept the coordination cost.",
    },
    {
      question:
        "Which of these is the best approach for organizing versioned NestJS code?",
      options: [
        "One controller with `if (version === '1')` branches inside each handler.",
        "Separate controllers per version, each calling a shared version-agnostic service.",
        "Duplicate the entire service per version.",
        "One controller per version but with a copy of the DTOs renamed each time without a strategy.",
      ],
      correctIndex: 1,
      explanation:
        "Separate controllers per version with a shared service keeps version differences at the edge and business logic single-sourced. Branching inside a single controller makes the code a maze and duplicates logic in practice.",
    },
    {
      question:
        "What is the key benefit of deprecation headers (`Deprecation`, `Sunset`) over only announcing deprecation in documentation?",
      options: [
        "They make responses faster.",
        "They surface the deprecation in every response, so clients see it even if they never read the docs or changelog.",
        "They reduce the number of API calls.",
        "They compress responses.",
      ],
      correctIndex: 1,
      explanation:
        "Documentation is easy to miss. Headers travel with every response, so any client (and any tooling that inspects responses) sees the deprecation and the sunset date. This dramatically improves migration compliance.",
    },
  ],
  project: {
    name: "Version a NestJS Users API with URI Versioning, Deprecation Headers, and a Migration Path",
    goal:
      "Build a real versioned NestJS API with two live versions, per-version Swagger documentation, deprecation headers on the older version, usage telemetry, a migration guide, and a plan to sunset v1 safely. Tie together URI versioning, deprecation strategy, and NestJS versioning features into a coherent production setup.",
    brief:
      "You are the backend engineer for a SaaS product. Your customers integrate with the Users API. You need to change the way user names are returned (splitting `name` into `firstName` and `lastName`) and add a `status` field, without breaking existing integrations. Ship v2, keep v1 alive with deprecation headers, instrument usage, and prepare the migration guide and sunset plan. The project covers everything from today: URI versioning, header considerations, deprecation, migration, and NestJS's built-in versioning support.",
    steps: [
      "Create a new NestJS project. Add TypeORM, PostgreSQL, `class-validator`, `class-transformer`, and `@nestjs/swagger`.",
      "Define a `User` entity with `id`, `email`, `firstName`, `lastName`, and `status` ('active' | 'invited' | 'disabled'). Seed the database with a few users.",
      "Enable URI versioning in `main.ts`: `app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1', prefix: 'v' })`. Add a global `ValidationPipe`.",
      "Create a `UsersService` with `findById(id)` that returns the raw `User` entity. This service is version-agnostic — it should not know about API versions.",
      "Implement `UsersV1Controller` with `@Controller('users') @Version('1')`. It exposes `GET /v1/users/:id` and returns the v1 shape: `{ id, name, email }` where `name = firstName + ' ' + lastName`.",
      "Implement `UsersV2Controller` with `@Controller('users') @Version('2')`. It exposes `GET /v2/users/:id` and returns the v2 shape: `{ id, firstName, lastName, email, status }`.",
      "Create a `Deprecated` decorator and a `DeprecationInterceptor` that reads metadata and adds `Deprecation: true`, `Sunset: <date>`, and `Link: <migration-url>; rel=\"deprecation\"` headers to every response from a deprecated controller. Apply the decorator to `UsersV1Controller` with a sunset date 6 months in the future.",
      "Add a `VersionUsageMiddleware` that logs the requested version, the client ID (from a mock auth or header), and the path to a JSON log stream. Confirm it records both v1 and v2 traffic separately.",
      "Add a `@Version(VERSION_NEUTRAL)` health controller with `GET /health` that works without any version prefix. Confirm it responds to requests at `/health`.",
      "Set up two Swagger documents, one for `/docs/v1` including only the v1 module, and one for `/docs/v2` including only the v2 module. Verify each doc only lists its own endpoints and shapes.",
      "Write a migration guide in `docs/migrate-v1-to-v2.md` with a table mapping v1 fields to v2 fields, side-by-side JSON examples, and any behavioral differences (e.g. `name` split into `firstName` + `lastName`).",
      "Write e2e tests with `supertest`: `GET /v1/users/:id` returns v1 shape and deprecation headers; `GET /v2/users/:id` returns v2 shape without deprecation headers; `GET /users/:id` falls back to v1 (default version); `GET /v3/users/:id` returns 404; `GET /health` returns 200 without version.",
    ],
    acceptance: [
      "`GET /v1/users/1` returns `{ id, name, email }` and includes `Deprecation: true` and `Sunset: <date>` response headers.",
      "`GET /v2/users/1` returns `{ id, firstName, lastName, email, status }` with no deprecation headers.",
      "`GET /users/1` (no version) is routed to v1 because `defaultVersion: '1'` is set, and the response includes deprecation headers.",
      "`GET /v3/users/1` returns 404 with a clear error — the version does not exist.",
      "`GET /health` returns 200 with no version prefix.",
      "`/docs/v1` shows only the v1 endpoint and its shape; `/docs/v2` shows only the v2 endpoint and its shape.",
      "The middleware log shows separate entries for v1 and v2 requests with client identifiers.",
      "All e2e tests pass.",
    ],
    stretch: [
      "Add a v3 controller that introduces cursor-based pagination (from Day 47) for `GET /v3/users` and keep offset pagination on v2. Document why v3 was needed.",
      "Implement expand-and-contract in v2: temporarily include the legacy `name` field alongside `firstName`/`lastName`, and mark it deprecated in the response headers. Track how many clients still read `name` (via a logging interceptor on the client side is out of scope, but you can document how a client would report this).",
      "Replace the v1 controller with a catch-all `410 Gone` controller on a simulated sunset date, and update tests to assert the change. Use an environment variable (`SUNSET_DATE`) to control the behavior in tests.",
      "Add a per-version rate limiter using `@nestjs/throttler` with a stricter limit on v1 to nudge clients toward migration.",
      "Extend the `VersionUsageMiddleware` to emit Prometheus metrics (`api_requests_total{version=\"1\"}`) and expose a `/metrics` endpoint.",
      "Add a compatibility mode to v2 where the request body can be sent in v1 shape (`{ name }`) and the server splits it into `firstName`/`lastName` automatically. Document this as an option to reduce migration friction.",
      "Add integration tests using `nock` to simulate an external client that only calls v1 and one that calls v2, verifying each receives the correct shape and headers over time.",
    ],
  },
};
