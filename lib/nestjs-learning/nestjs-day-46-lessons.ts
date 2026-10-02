import type { LessonDay } from "@/lib/learn/lesson-types";

export const API_ARCHITECTURE_DAY_46_LESSONS: LessonDay = {
  day: 46,
  title: "API Architecture",
  totalMinutes: 180,
  difficulty: "Advanced",
  overview: "Master enterprise-grade API architecture in NestJS, focusing on strict API contracts, robust resource boundaries, seamless backward compatibility, and safely managing breaking changes in production applications.",
  lessons: [
    {
      id: "api-contracts",
      title: "Designing Robust API Contracts",
      durationMinutes: 25,
      explanation: `
<b>Imagine you are building a delivery tracking app</b> where multiple client applications—such as a customer mobile app, a restaurant tablet dashboard, and a courier GPS tracker—all talk to your NestJS backend.

If your backend arbitrarily changes the shape of a response object from <code>{ orderId: "123" }</code> to <code>{ id: "123" }</code> without warning, every single client application crashes or breaks.

An <b>API contract</b> is the agreed-upon agreement between your server and your clients regarding how requests should be structured and what responses will look like. In NestJS, we enforce these contracts explicitly using <b>DTOs (Data Transfer Objects)</b>, validation pipes, and serialization interceptors.

<h3>Why API Contracts Exist</h3>
Without contracts, APIs become fragile. Developers change database schemas or internal property names, and suddenly client applications break because they relied on undocumented behaviors. Contracts act as a strict firewall and a single source of truth for communication.

<h3>Basic Contract Example in NestJS</h3>
Let's look at how we define a basic contract using class-validator and class-transformer in NestJS:

<pre><code class="language-typescript">
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
</code></pre>

When a client sends a request, NestJS's ValidationPipe automatically checks that the incoming payload matches this contract. If it doesn't, the request is rejected immediately with a clean 400 Bad Request error before your service layer ever touches the data.
      `,
      diagram: `
Client App (iOS/Android/Web)
        |
        |--- (Sends JSON Payload) --->
        v
[ValidationPipe & DTO Contract]
        |
        v (If valid)
NestJS Controller / Service
      `,
      codeExample: {
        title: "Example",
        code: `
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IsString, IsEmail, MinLength } from 'class-validator';

// 1. Define the strict incoming contract
export class RegisterCustomerDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;
}

// 2. Define the strict outgoing contract (Response DTO)
export class CustomerResponseDto {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date;
}

@Controller('customers')
export class CustomersController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterCustomerDto): CustomerResponseDto {
    // In a real app, this would save to database via service
    return {
      id: 'cust_98765',
      fullName: dto.fullName,
      email: dto.email,
      createdAt: new Date(),
    };
  }
}
        `
      },
      keyTakeaways: [
        "API contracts protect both the server and client from unexpected data payloads.",
        "Use `class-validator` and `class-transformer` in NestJS to enforce structural and type guarantees.",
        "A strict contract acts as living documentation for your frontend and external consumers.",
        "Never return raw database entities directly to clients; always map them through response DTOs."
      ],
      commonMistakes: [
        "<b>Returning raw database entities directly.</b> Exposing database internal columns (like password hashes or internal foreign keys) creates massive security risks.",
        "<b>Skipping request validation.</b> Assuming clients will always send the correct fields leads to runtime errors deep inside business logic."
      ],
      quiz: [
        {
          question: "What is the primary purpose of an API contract in a NestJS application?",
          options: [
            "To speed up database query execution times",
            "To establish a clear, predictable agreement on request and response structures between server and client",
            "To automatically generate frontend mobile applications in Swift and Kotlin",
            "To replace unit testing frameworks"
          ],
          correctIndex: 1,
          explanation: "API contracts ensure that both clients and servers agree on data structures, preventing unexpected breakages when data is exchanged."
        },
        {
          question: "Why should you avoid returning raw database entities directly from a controller?",
          options: [
            "It is too slow to execute in production",
            "It can accidentally expose sensitive internal fields like password hashes or internal IDs",
            "NestJS compiler will throw a compilation error",
            "It prevents pagination from working"
          ],
          correctIndex: 1,
          explanation: "Returning raw entities leaks database internals and security-sensitive attributes. Response DTOs allow you to explicitly select what data is exposed."
        }
      ]
    },
    {
      id: "resource-boundaries",
      title: "Establishing Clear Resource Boundaries",
      durationMinutes: 30,
      explanation: `
<b>Imagine you are building a massive e-commerce platform</b> like Amazon. You have separate teams working on the Catalog, Orders, Inventory, and Billing.

If your Order module directly reaches into the database tables of the Inventory module and modifies stock levels using raw SQL queries, your code becomes tightly coupled. When the Inventory team changes their database schema, the Order module breaks.

<b>Resource boundaries</b> define clear ownership lines for data and logic within your application. In NestJS, these boundaries are enforced using <b>Modules</b> and controlled dependency injection.

<h3>The Problem of Tight Coupling</h3>
Beginners often put all services inside a single global module or import every repository everywhere. While convenient at first, this creates a 'big ball of mud' architecture where you can't refactor one feature without breaking three others.

<h3>Enforcing Boundaries with NestJS Modules</h3>
Each domain (e.g., \`OrdersModule\`, \`InventoryModule\`) should encapsulate its own controllers, services, and entities. If \`OrdersModule\` needs to check stock, it should call a public method on \`InventoryService\` exported by \`InventoryModule\`, rather than accessing inventory database tables directly.
      `,
      diagram: `
[OrdersModule] --(Calls public method)--> [InventoryModule]
      |                                           |
      v                                           v
Orders Database Table                     Inventory Database Table
      `,
      codeExample: {
        title: "Example",
        code: `
// inventory.service.ts (Inside Inventory Module)
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class InventoryService {
  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    // Encapsulated inventory check and reservation logic
    const stockAvailable = true; // simulated check
    if (!stockAvailable) {
      throw new BadRequestException('Insufficient stock for product');
    }
    return true;
  }
}

// inventory.module.ts
import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Module({
  providers: [InventoryService],
  exports: [InventoryService], // Exported so other modules can consume it safely
})
export class InventoryModule {}

// orders.service.ts (Inside Orders Module)
import { Injectable } from '@nestjs/common';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrdersService {
  constructor(private readonly inventoryService: InventoryService) {}

  async createOrder(productId: string, qty: number) {
    // Respects resource boundary by calling InventoryService instead of direct DB access
    await this.inventoryService.reserveStock(productId, qty);
    // Continue order creation...
    return { status: 'Order Created Successfully' };
  }
}
        `
      },
      keyTakeaways: [
        "Resource boundaries prevent tightly coupled code and maintain clear domain separation.",
        "NestJS modules act as natural encapsulation boundaries using `providers` and `exports`.",
        "Cross-domain communication should go through well-defined service contracts rather than direct database sharing.",
        "Clear boundaries allow different teams or developers to work on separate features independently."
      ],
      commonMistakes: [
        "<b>Importing repositories across domain boundaries.</b> Letting the Order module directly query the Inventory database table creates fragile database-level coupling.",
        "<b>Making every provider global.</b> Using `@Global()` everywhere defeats the purpose of module encapsulation."
      ],
      quiz: [
        {
          question: "How do NestJS modules help maintain strict resource boundaries?",
          options: [
            "By automatically compiling TypeScript faster",
            "By encapsulating providers and requiring explicit exports to share services between domains",
            "By encrypting database connections",
            "By disabling HTTP requests automatically"
          ],
          correctIndex: 1,
          explanation: "NestJS modules isolate code. Providers are private to their module unless explicitly exported and imported by another module."
        },
        {
          question: "What is a negative consequence of bypassing resource boundaries and querying another domain's database table directly?",
          options: [
            "Increased TypeScript compilation time",
            "Tight coupling that causes schema changes in one domain to unexpectedly break another domain",
            "HTTP status codes will default to 500",
            "Dependency injection will stop working entirely"
          ],
          correctIndex: 1,
          explanation: "Direct cross-domain database queries create rigid coupling, making future refactoring and schema evolution dangerous and difficult."
        }
      ]
    },
    {
      id: "backward-compatibility",
      title: "Maintaining Backward Compatibility",
      durationMinutes: 35,
      explanation: `
<b>Imagine you run a ride-sharing platform</b> like Uber. You release an updated backend API, but thousands of riders are still using version 2.1 of your mobile app, which hasn't updated yet.

If your backend immediately drops support for old request fields, all those active app users will instantly experience crashes.

<b>Backward compatibility</b> is the engineering discipline of ensuring that newer versions of your API continue to support older clients without breaking their expected workflows.

<h3>Why Compatibility Matters at Scale</h3>
In web development, you can deploy backend code instantly. But in mobile apps, desktop apps, and third-party webhook integrations, clients upgrade at their own pace. You cannot force millions of users to update their apps the second you deploy your code.

<h3>Techniques for Compatibility in NestJS</h3>
When evolving APIs, experienced developers use several strategies:
1. <b>Additive changes only:</b> Adding new optional fields to responses never breaks old clients.
2. <b>Request property aliasing:</b> Accepting both old and new field names during a transition period.
3. <b>Explicit API versioning:</b> Managing multiple active API versions cleanly.
      `,
      diagram: `
Old Client App (v1) ----> [NestJS v1 Route Handler]
                                    |
New Client App (v2) ----> [NestJS v2 Route Handler] ---> Shared Domain Service
      `,
      codeExample: {
        title: "Example",
        code: `
import { Controller, Get, Query, Version } from '@nestjs/common';

@Controller('reports')
export class ReportsController {

  // Legacy v1 endpoint supporting older clients
  @Version('1')
  @Get('summary')
  getReportV1(@Query('period') period: string) {
    return {
      timeframe: period,
      totalRevenue: 50000, // Legacy property name
    };
  }

  // Modern v2 endpoint with refined structure for newer clients
  @Version('2')
  @Get('summary')
  getReportV2(@Query('range') range: string) {
    return {
      selectedRange: range,
      grossRevenue: 50000, // Updated property name
      currency: 'USD',    // New property added in v2
    };
  }
}
        `
      },
      keyTakeaways: [
        "Never assume all clients upgrade simultaneously when modifying APIs.",
        "NestJS built-in URI, header, or media-type versioning helps manage multiple API versions gracefully.",
        "Prefer additive changes (adding optional fields) over modifying or deleting existing properties.",
        "Maintain a deprecation lifecycle policy before permanently removing legacy endpoints."
      ],
      commonMistakes: [
        "<b>Renaming existing JSON response keys without a version bump.</b> This silently corrupts client applications that depend on the old key name.",
        "<b>Deleting old endpoints prematurely.</b> Always monitor server logs for traffic on legacy routes before sunsetting them."
      ],
      quiz: [
        {
          question: "Why is backward compatibility critical for mobile and third-party API integrations?",
          options: [
            "Because database queries run faster with old structures",
            "Because clients (like mobile apps) upgrade at their own pace and cannot be forced to update instantly",
            "Because TypeScript requires multiple versions to compile",
            "It is only necessary for financial applications"
          ],
          correctIndex: 1,
          explanation: "Mobile app users control when they update their apps. Backend changes must accommodate older clients to prevent widespread failures."
        },
        {
          question: "Which approach is safest when modifying an existing response object for an active API?",
          options: [
            "Delete old fields immediately and rename remaining keys",
            "Make additive changes by appending new optional fields while leaving existing fields intact",
            "Turn off error handling",
            "Change the HTTP method from GET to POST"
          ],
          correctIndex: 1,
          explanation: "Additive changes (adding optional new fields without touching old ones) ensure existing clients continue to parse responses successfully."
        }
      ]
    },
    {
      id: "breaking-changes",
      title: "Safely Managing Breaking Changes",
      durationMinutes: 35,
      explanation: `
<b>Imagine you are a lead backend architect</b> at a payment gateway. You discover a critical security flaw in your API authentication payload structure that requires renaming a core field, which will break all existing merchant integrations.

How do you roll out this breaking change without causing chaos?

Managing breaking changes requires a deliberate engineering process: deprecation notices, versioning, monitoring, clear documentation, and a graceful sunset period.

<h3>The Life Cycle of a Breaking Change</h3>
1. <b>Notification & Deprecation:</b> Mark the feature as deprecated using documentation headers (e.g., \`Deprecation: true\`) well in advance.
2. <b>Parallel Support:</b> Support both the legacy and new behavior side-by-side using versioning or conditional request handling.
3. <b>Monitoring:</b> Track metric alerts on usage of the legacy route to identify laggard clients.
4. <b>Sunsetting:</b> Return explicit HTTP 410 Gone status codes once the deprecation window closes.
      `,
      diagram: `
[Client Request]
      |
      v
[NestJS Deprecation Interceptor / Guard]
      |
      +---> Log warning / Add 'Sunset' Response Header
      |
      v
[Route Handler Execution]
      `,
      codeExample: {
        title: "Example",
        code: `
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiDeprecationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    // Attach standard deprecation headers to warn API consumers
    response.setHeader('Deprecation', 'true');
    response.setHeader('Sunset', 'Wed, 31 Dec 2026 23:59:59 GMT');
    response.setHeader('Warning', '299 - "This endpoint is deprecated. Migrate to v2."');

    return next.handle().pipe(
      tap(() => {
        // Optional: Increment metric counter to track legacy endpoint usage
      }),
    );
  }
}
        `
      },
      keyTakeaways: [
        "Breaking changes should never be deployed silently without prior deprecation warnings.",
        "Use HTTP headers like `Deprecation` and `Sunset` to communicate end-of-life timelines to API consumers.",
        "Monitor legacy endpoint traffic metrics to gauge client migration progress before final removal.",
        "Use HTTP 410 Gone to signal permanently retired endpoints."
      ],
      commonMistakes: [
        "<b>Deploying breaking changes on Friday evening without notice.</b> This guarantees a ruined weekend for the engineering on-call rotation.",
        "<b>Failing to document migration paths.</b> Clients will not migrate if they do not have clear code examples showing how to adopt the new contract."
      ],
      quiz: [
        {
          question: "What HTTP response status code is best used when an API endpoint has been permanently retired and sunsetted?",
          options: [
            "200 OK",
            "400 Bad Request",
            "410 Gone",
            "503 Service Unavailable"
          ],
          correctIndex: 2,
          explanation: "HTTP 410 Gone explicitly tells the client that the resource is permanently unavailable and will not return."
        },
        {
          question: "What is the primary role of standard response headers like `Deprecation` and `Sunset`?",
          options: [
            "To encrypt the request body",
            "To automatically rewrite old payloads into new ones",
            "To communicate sunset timelines and warning notices to API consumers programmatically",
            "To increase database connection pooling limits"
          ],
          correctIndex: 2,
          explanation: "These standard headers allow API clients and monitoring tools to programmatically detect when an endpoint is scheduled for retirement."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What is an API contract in NestJS?",
      options: [
        "A legally binding employment agreement for backend developers",
        "An explicit agreement defining request and response structures enforced using DTOs and validation pipes",
        "A database migration file",
        "A configuration file for Docker containers"
      ],
      correctIndex: 1,
      explanation: "API contracts ensure strict, predictable data exchange between clients and servers."
    },
    {
      question: "Why should domain modules encapsulate their services and repositories?",
      options: [
        "To prevent tight coupling and fragile database-level dependencies across different application features",
        "To make every class accessible globally",
        "To comply with TypeScript syntax requirements",
        "To eliminate the need for controllers"
      ],
      correctIndex: 0,
      explanation: "Encapsulation prevents tangled codebases and keeps domain boundaries clean and maintainable."
    },
    {
      question: "What is the safest way to modify an existing JSON response property in a public production API?",
      options: [
        "Rename the property immediately",
        "Introduce API versioning and support both legacy and new properties during a migration window",
        "Delete the controller entirely",
        "Turn off validation"
      ],
      correctIndex: 1,
      explanation: "Versioning allows you to introduce breaking or changing structures safely while giving clients time to migrate."
    },
    {
      question: "What purpose do HTTP deprecation headers serve?",
      options: [
        "They speed up server response time",
        "They inform API consumers and automated tools that an endpoint is scheduled for future retirement",
        "They automatically patch security vulnerabilities",
        "They format database queries"
      ],
      correctIndex: 1,
      explanation: "Standard headers communicate lifecycle status clearly to external clients."
    },
    {
      question: "Which NestJS feature is primarily used to enforce request payload contracts?",
      options: [
        "ValidationPipe with class-validator DTOs",
        "Database transactions",
        "Cluster mode",
        "WebSockets"
      ],
      correctIndex: 0,
      explanation: "ValidationPipe inspects incoming payloads against DTO decorator rules before reaching controllers."
    },
    {
      question: "What happens if you return raw database entities directly from your controller endpoints?",
      options: [
        "Performance improves significantly",
        "Internal database attributes like password hashes may be accidentally leaked to clients",
        "TypeScript throws a syntax error",
        "Pagination stops working"
      ],
      correctIndex: 1,
      explanation: "Exposing raw entities risks security leakage; response DTOs must be used to filter exposed attributes."
    },
    {
      question: "When should you return an HTTP 410 Gone status code?",
      options: [
        "When a request body fails validation",
        "When an API endpoint has been permanently removed or retired",
        "When the database is temporarily offline",
        "When a user enters an incorrect password"
      ],
      correctIndex: 1,
      explanation: "HTTP 410 specifically indicates that a requested resource is permanently gone."
    },
    {
      question: "How do NestJS modules control access to providers across boundaries?",
      options: [
        "By making everything global by default",
        "Through explicit module `exports` and `imports`",
        "By using environment variables",
        "By disabling dependency injection"
      ],
      correctIndex: 1,
      explanation: "Providers are encapsulated within their module unless explicitly exported for other modules to import."
    }
  ],
  project: {
    name: "Enterprise E-Commerce API Versioning & Contract Guard",
    goal: "Build a robust NestJS product catalog API module featuring strict DTO contracts, resource boundary encapsulation, and a v1-to-v2 versioned backward compatibility layer.",
    brief: "In a growing e-commerce application, the product catalog needs to evolve. You will build a NestJS application that separates the Products domain from the Inventory domain, enforces strict input/output DTO validation contracts, and maintains a versioned API supporting both legacy product structures and new enriched product payloads.",
    steps: [
      "Step 1: Set up a NestJS project and create distinct `ProductsModule` and `InventoryModule` with proper encapsulation and service exports.",
      "Step 2: Implement strict request and response DTO contracts using `class-validator` and `class-transformer` for product creation and retrieval.",
      "Step 3: Enable NestJS API versioning (URI or header-based) in `main.ts`.",
      "Step 4: Implement a Version 1 endpoint (`/v1/products`) returning legacy product property structures.",
      "Step 5: Implement a Version 2 endpoint (`/v2/products`) returning updated, enriched product contracts along with deprecation headers on v1 routes."
    ],
    acceptance: ["The application successfully validates incoming product payloads via DTOs, keeps Inventory and Product domains decoupled via module exports, and serves both v1 and v2 product endpoints cleanly without breaking legacy client structures."],
    stretch: ["Add an interceptor that automatically logs metric warnings whenever a client calls a deprecated v1 endpoint, tracking migration progress in your server logs."]
  }
};
