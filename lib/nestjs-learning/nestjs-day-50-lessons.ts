import type { LessonDay } from "@/lib/learn/lesson-types";

export const OPENAPI_SWAGGER_DAY_50_LESSONS: LessonDay = {
  day: 50,
  title: "OpenAPI / Swagger",
  totalMinutes: 115,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-50-lesson-1",
      title: "OpenAPI Fundamentals",
      durationMinutes: 24,
      explanation: `
<b>Imagine you have just joined a team that has built a large REST API.</b> You open the codebase and see dozens of controllers, hundreds of endpoints, and you have no idea how any of it works from a client's perspective. What fields does \`POST /orders\` expect? What does \`GET /users/me\` return? What HTTP status codes can come back? What authentication header must be sent?

You could read the source code for hours. Or — if the team has done their job — you could open a URL like \`https://api.example.com/docs\`, see every endpoint listed, click on one, see the exact request and response shapes, and even try the endpoint live from the browser. That URL is powered by <b>OpenAPI</b>.

<b>OpenAPI is a specification — a standard format for describing HTTP APIs.</b> It is a JSON or YAML document that says: "Here are all the endpoints, here are the request bodies they accept, here are the responses they return, here is how you authenticate." The spec itself is just data. Tools read the spec and generate documentation, client SDKs, mock servers, tests, and more.

<b>Swagger is the historical name.</b> The specification was originally called Swagger. In 2016 it was donated to the OpenAPI Initiative and renamed OpenAPI. The tooling kept the name Swagger (Swagger UI, Swagger Editor, Swagger Codegen). So when people say "Swagger," they usually mean either the OpenAPI specification itself or the Swagger UI tool that renders it. Both names are used interchangeably in practice.

<b>Why does OpenAPI exist?</b> Because APIs need a contract. Without a spec:
- Frontend developers guess at the shape of responses and get it wrong.
- Client SDKs must be written by hand for every language.
- Tests have to be manually constructed from reading source code.
- API documentation drifts from reality within weeks.
- Mock servers for the frontend must be hand-built.

With an OpenAPI spec:
- Documentation is generated from a single source of truth.
- Client SDKs for TypeScript, Python, Go, Java, and others are generated automatically.
- Mock servers can be spun up in seconds.
- Contract tests verify that the server matches the spec.
- API gateways and monitoring tools can validate requests against the schema.

<b>What does an OpenAPI document look like?</b> A minimal spec has a version, some metadata, and a set of paths:

\`\`\`yaml
openapi: 3.1.0
info:
  title: Shop API
  version: 1.0.0
  description: The API for our e-commerce store.
servers:
  - url: https://api.example.com/v1
paths:
  /products:
    get:
      summary: List products
      responses:
        '200':
          description: A list of products
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
components:
  schemas:
    Product:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        price:
          type: number
\`\`\`

That is it. A small YAML file describes the entire \`GET /products\` endpoint: what it does, what it returns, and what a Product looks like. Multiply this by every endpoint and you have a complete API contract.

<b>The building blocks of an OpenAPI document:</b>

- <b>\`openapi\`</b>: the spec version (3.0.x or 3.1.x today).
- <b>\`info\`</b>: title, version, description, contact, license.
- <b>\`servers\`</b>: base URLs where the API is available (production, staging, sandbox).
- <b>\`paths\`</b>: every URL path and the HTTP methods it supports.
- <b>\`components\`</b>: reusable pieces — schemas, parameters, responses, security schemes.
- <b>\`security\`</b>: authentication requirements (API key, bearer token, OAuth2).
- <b>\`tags\`</b>: groupings of related endpoints for documentation.

<b>Two ways to produce an OpenAPI document:</b>

<b>Design-first (spec-first).</b> You write the OpenAPI spec by hand, then implement the server to match it. This is popular for large teams and public APIs where the contract must be carefully designed before code is written.

<b>Code-first.</b> You write the server code with decorators that describe the endpoints, and the framework generates the spec. This is what NestJS does with \`@nestjs/swagger\`. Code-first keeps the spec in sync with the implementation automatically. It is the right choice for most NestJS projects.

<b>How beginners usually encounter OpenAPI:</b> they integrate with a third-party service like Stripe or GitHub, and the docs let them "try it out" in the browser. That interactivity comes from Swagger UI rendering an OpenAPI spec. Later they build their own API and want the same experience for their consumers.

<b>The Swagger UI experience.</b> Swagger UI is a web application that reads an OpenAPI document and renders interactive documentation. Each endpoint appears in a list, and clicking it expands into:
- A description of what it does.
- Request parameters and their types.
- A request body schema.
- Example request and response JSON.
- A "Try it out" button that sends a real HTTP request to the server.

This is the single most valuable artifact of OpenAPI for most teams. A well-written spec plus Swagger UI gives you documentation that stays accurate, is pleasant to use, and doubles as a testing tool.

<b>What OpenAPI is not.</b>
- It is not a runtime framework. It describes the API; it does not serve it. Your NestJS controllers serve the API, and \`@nestjs/swagger\` produces a spec that describes them.
- It is not a substitute for business logic. Great documentation of a broken endpoint is still broken.
- It is not a monitoring tool. Yes, it can help API gateways validate requests, but monitoring is a separate concern.
- It is not always worth 100% coverage. A small internal API might not need a detailed spec. A public API almost always does.

<b>When to invest in OpenAPI:</b>
- Public APIs consumed by external developers.
- APIs consumed by multiple internal teams.
- APIs that need generated client SDKs (web, mobile, third-party integrations).
- APIs with complex request/response shapes where documentation drift hurts.
- APIs that must be governed (versioning, deprecation, security policy).

<b>When NOT to invest heavily:</b>
- A one-off internal script that calls a single endpoint.
- A prototype that will be thrown away in a week.
- Simple CRUD apps where the frontend and backend are deployed together and one team owns both — though even here, a lightweight spec helps.

<b>What can go wrong?</b>
- <b>Spec drift.</b> The documentation says one thing, the code does another. With code-first (NestJS), this is largely avoided — but only if you annotate thoroughly and regenerate the spec on every deploy.
- <b>Incomplete annotations.</b> Every field with no \`@ApiProperty\` shows up in the docs as \`{}\` or is missing entirely. Clients cannot integrate.
- <b>Over-specification.</b> Spending weeks fine-tuning example values while the API itself is unstable. Ship the API, then polish the docs.
- <b>Publishing internal endpoints.</b> If your Swagger UI is public and includes admin endpoints, you have leaked your attack surface. Restrict or exclude internal routes.
- <b>Stale hosted docs.</b> Serving a spec that was generated months ago misleads clients. Regenerate on every deploy.
- <b>Wrong base URL.</b> The \`servers\` field points to localhost, and clients copy broken examples. Configure per environment.
- <b>No security definitions.</b> Clients cannot tell what auth they need and try unauthenticated requests. Always declare security schemes.

<b>How this appears in a real NestJS application:</b> you add \`@nestjs/swagger\`, decorate your DTOs and controllers, and set up \`SwaggerModule\` in \`main.ts\`. The framework walks your routes, generates an OpenAPI document, and serves it at \`/docs\` with a Swagger UI. Every deploy regenerates the spec from the code. There is no separate YAML to maintain — the code is the source of truth.

The rest of today's lessons build on this foundation. You will learn to shape schemas and DTOs (lesson 2), describe responses and errors (lesson 3), declare security (lesson 4), and treat the spec as a production artifact that feeds SDKs, mocks, tests, and monitoring (lesson 5).
      `,
      diagram: `
OpenAPI Lifecycle (Code-First in NestJS)

  Controllers + DTOs with decorators
        |
        |  @ApiTags, @ApiOperation
        |  @ApiProperty, @ApiResponse
        |  @ApiBearerAuth, @ApiQuery
        v
  +-------------------------------+
  |  @nestjs/swagger              |
  |  scans metadata + generates   |
  |  OpenAPI JSON document        |
  +-------------------------------+
        |
        v
  openapi.json (single source of truth)
        |
        +---> Swagger UI (/docs)
        |       interactive documentation
        |
        +---> Generated client SDKs
        |       (openapi-generator, orval)
        |
        +---> Mock server
        |       (Prism, MSW)
        |
        +---> Contract tests
        |       (schemathesis, dredd)
        |
        +---> API gateway validation
        |
        +---> Docs site (Redoc, Stoplight)

Key concept:
  OpenAPI is a JSON/YAML spec.
  Swagger UI is the tool that renders it.
  NestJS generates the spec from code.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// OPENAPI FUNDAMENTALS — MINIMAL NESTJS SETUP
// ============================================

// 1. Install:
//    npm install @nestjs/swagger swagger-ui-express

// 2. main.ts — generate and serve the OpenAPI document
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Describe the API at a high level.
  const config = new DocumentBuilder()
    .setTitle('Shop API')
    .setDescription('The API for our e-commerce store.')
    .setVersion('1.0.0')
    .addServer('https://api.example.com/v1', 'Production')
    .addServer('https://staging-api.example.com/v1', 'Staging')
    .addServer('http://localhost:3000/v1', 'Local')
    .addTag('products', 'Product catalog endpoints')
    .addTag('orders', 'Order management endpoints')
    .build();

  // The framework walks your controllers and DTOs,
  // reads their decorators, and produces an OpenAPI 3.0 document.
  const document = SwaggerModule.createDocument(app, config);

  // Serve the interactive Swagger UI at /docs.
  SwaggerModule.setup('docs', app, document);

  // The raw spec is available at /docs-json and /docs-yaml.
  // You can feed it to client generators, tests, and other tools.

  await app.listen(3000);
}
bootstrap();

// 3. A minimal decorated controller

// products.controller.ts
import {
  Controller, Get, Param, Post, Body, Query,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse,
  ApiParam, ApiQuery, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List products', description: 'Returns a paginated list of products.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiOkResponse({ description: 'Paginated list', type: [ProductDto] })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.productsService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', type: Number, example: 42 })
  @ApiOkResponse({ description: 'The product', type: ProductDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ description: 'Product created', type: ProductDto })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }
}

// 4. A minimal decorated DTO

// dto/product.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 42, description: 'Unique product id' })
  id: number;

  @ApiProperty({ example: 'Wireless Headphones', description: 'Product name' })
  name: string;

  @ApiProperty({ example: 99.99, description: 'Price in USD' })
  price: number;

  @ApiProperty({ example: 'https://cdn.example.com/p/42.jpg', required: false })
  thumbnail?: string;
}

// dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Headphones' })
  @IsString()
  name: string;

  @ApiProperty({ example: 99.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'https://cdn.example.com/p/42.jpg', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}

// 5. What the client sees
// - https://api.example.com/docs        -> Swagger UI
// - https://api.example.com/docs-json   -> OpenAPI JSON
// - https://api.example.com/docs-yaml   -> OpenAPI YAML
//
// Try it out: click any endpoint in Swagger UI, fill the params,
// click "Execute", and the browser sends a real request.
      ` },
      keyTakeaways: [
        "OpenAPI is a specification (JSON or YAML) that describes HTTP APIs — endpoints, schemas, security, and examples.",
        "Swagger was the original name; today 'Swagger' usually refers to the tooling (Swagger UI, Swagger Editor) around OpenAPI.",
        "A spec gives you a single source of truth for documentation, SDK generation, mock servers, and contract tests.",
        "Code-first approach (NestJS with `@nestjs/swagger`) generates the spec from decorated controllers and DTOs, avoiding drift.",
        "Swagger UI renders the spec as interactive documentation with a 'Try it out' button.",
        "Specs describe the API but do not serve it — your NestJS controllers do that.",
        "Only invest deeply in a spec when the API is consumed by external developers or multiple teams.",
      ],
      commonMistakes: [
        "<b>Spec drift.</b> Maintaining a hand-written YAML that does not match the actual code. Code-first frameworks like NestJS avoid this by generating the spec from the code.",
        "<b>Incomplete annotations.</b> DTO fields without `@ApiProperty` do not appear in the docs. Clients cannot see the schema and guess wrong.",
        "<b>Publishing internal endpoints.</b> Admin or debug routes leaking into the public Swagger UI expands the attack surface. Exclude or protect them.",
        "<b>Wrong `servers` configuration.</b> The `servers` array points to `localhost`, so client examples copy broken URLs. Configure per environment.",
        "<b>Serving stale docs.</b> A spec generated months ago shows old endpoints. Regenerate and redeploy on every release.",
        "<b>Skipping security definitions.</b> Without `addBearerAuth()` and `@ApiBearerAuth()`, clients do not know they must send a token.",
        "<b>Over-specification before the API is stable.</b> Weeks spent polishing examples while the API keeps changing. Ship first, then document.",
      ],
      quiz: [
        {
          question:
            "What is OpenAPI?",
          options: [
            "A JavaScript framework for building APIs.",
            "A specification (JSON/YAML format) for describing HTTP APIs.",
            "A database used for API documentation.",
            "An authentication protocol.",
          ],
          correctIndex: 1,
          explanation:
            "OpenAPI is a language-agnostic specification for describing APIs. Tools read the spec to generate documentation, client SDKs, mock servers, and tests.",
        },
        {
          question:
            "What is the relationship between Swagger and OpenAPI?",
          options: [
            "They are two different specifications for the same thing.",
            "Swagger was the original name; it was donated to the OpenAPI Initiative and renamed OpenAPI. 'Swagger' now usually refers to the tooling (Swagger UI, Swagger Editor).",
            "Swagger is the enterprise version of OpenAPI.",
            "Swagger is a protocol; OpenAPI is a framework.",
          ],
          correctIndex: 1,
          explanation:
            "The specification was renamed OpenAPI in 2016. The tooling kept the 'Swagger' name — Swagger UI is the most popular renderer for OpenAPI documents.",
        },
        {
          question:
            "Which of these is NOT a benefit of maintaining an OpenAPI spec?",
          options: [
            "Generated client SDKs.",
            "Interactive documentation with a 'Try it out' button.",
            "Automatic mocking for frontend development.",
            "Automatic implementation of business logic.",
          ],
          correctIndex: 3,
          explanation:
            "OpenAPI describes the API but does not implement it. Business logic lives in your application code. The spec drives tooling (SDKs, mocks, docs) but not the runtime behavior itself.",
        },
        {
          question:
            "Why is the code-first approach (like `@nestjs/swagger`) generally preferred in NestJS projects?",
          options: [
            "Because NestJS cannot read hand-written YAML.",
            "Because the spec is generated from the code, so it cannot drift out of sync with the implementation.",
            "Because code-first is faster to run.",
            "Because NestJS requires it.",
          ],
          correctIndex: 1,
          explanation:
            "In code-first, decorators on controllers and DTOs are the source of truth. The framework generates the OpenAPI document from them, so the docs and the code cannot drift apart.",
        },
      ],
    },
    {
      id: "day-50-lesson-2",
      title: "OpenAPI Schemas and DTOs",
      durationMinutes: 25,
      explanation: `
<b>Picture a client developer integrating with your API.</b> They open the docs, click \`POST /orders\`, and see a request body. If the docs are good, they see something like:

\`\`\`json
{
  "customerId": 42,
  "items": [
    { "productId": 101, "quantity": 2 },
    { "productId": 205, "quantity": 1 }
  ],
  "payment": {
    "method": "card",
    "cardToken": "tok_visa"
  },
  "couponCode": "SPRING10"
}
\`\`\`

Every field, its type, whether it is required, the constraints, an example. If the docs are bad, they see \`{}\` and have to guess. The difference between good and bad OpenAPI documentation almost always comes down to how well the <b>schemas</b> are described.

<b>A schema in OpenAPI describes the shape of data.</b> It is the JSON Schema subset used by OpenAPI: objects, arrays, strings, numbers, booleans, enums, and their constraints. Every request body, response body, and parameter has a schema. The more precise the schema, the better the generated documentation, SDK, and mocks.

<b>In NestJS, schemas come from DTO classes.</b> You write a DTO with \`class-validator\` decorators for runtime validation, and \`@nestjs/swagger\` decorators for documentation. The framework reads both and produces the schema.

Here is the pattern:

\`\`\`typescript
export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Headphones' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 99.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;
}
\`\`\`

The two decorator families have different jobs:
- <b>\`class-validator\` (\`@IsString\`, \`@Min\`, \`@MaxLength\`)</b>: enforces the rule at runtime. If a client sends a wrong value, the request is rejected with a 400.
- <b>\`@nestjs/swagger\` (\`@ApiProperty\`)</b>: documents the rule in the OpenAPI spec. Clients see the constraint in the docs and generated SDK.

Both are important. Validation without documentation means clients do not know the rules until they hit an error. Documentation without validation means the docs say one thing but the server accepts anything.

<b>The \`@ApiProperty\` decorator.</b> At its simplest, \`@ApiProperty()\` marks a field for inclusion. With options, it describes the field precisely:

\`\`\`typescript
@ApiProperty({
  description: 'Product price in USD, before tax',
  example: 99.99,
  minimum: 0,
  maximum: 1_000_000,
  type: Number,
  required: true,
})
price: number;
\`\`\`

All the options:
- \`description\`: human-readable explanation.
- \`example\`: a sample value shown in Swagger UI.
- \`default\`: a default value.
- \`enum\`: for enumerated types, the set of allowed values.
- \`type\`: explicit type when TypeScript reflection is not enough (e.g. arrays, unions).
- \`required\`: whether the field is required (defaults to true).
- \`nullable\`: whether the value can be \`null\`.
- \`minimum\` / \`maximum\`: numeric bounds.
- \`minLength\` / \`maxLength\`: string length bounds.
- \`pattern\`: a regex the string must match.
- \`format\`: semantic hint like \`'email'\`, \`'date-time'\`, \`'uuid'\`, \`'uri'\`.
- \`isArray\`: whether the property is an array (usually inferred from the type).
- \`deprecated\`: mark the field as deprecated in the docs.

<b>For optional fields, use \`required: false\`.</b> TypeScript's optional marker (\`?\`) does not always propagate to OpenAPI correctly when using strict reflection. Set it explicitly:

\`\`\`typescript
@ApiProperty({ required: false, example: 'SPRING10' })
@IsOptional()
couponCode?: string;
\`\`\`

<b>Enums.</b> OpenAPI supports enums natively. In NestJS:

\`\`\`typescript
export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Shipped = 'shipped',
  Cancelled = 'cancelled',
}

export class OrderDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.Pending })
  status: OrderStatus;
}
\`\`\`

Swagger UI renders this as a dropdown with the allowed values — one of the most valuable features for client developers.

<b>Nested objects.</b> When a field is another DTO, use \`type\`:

\`\`\`typescript
export class OrderDto {
  @ApiProperty({ type: () => CustomerDto })
  customer: CustomerDto;

  @ApiProperty({ type: () => [OrderItemDto] })
  items: OrderItemDto[];
}
\`\`\`

The arrow function is required to avoid circular reference problems in TypeScript.

<b>Arrays of primitives.</b> Explicitly declare them:

\`\`\`typescript
@ApiProperty({ type: [String], example: ['red', 'blue'] })
tags: string[];
\`\`\`

<b>Additional properties and free-form objects.</b> For metadata-style fields with arbitrary keys:

\`\`\`typescript
@ApiProperty({
  type: 'object',
  additionalProperties: { type: 'string' },
  example: { color: 'red', size: 'M' },
})
attributes: Record<string, string>;
\`\`\`

<b>Reusing schemas across DTOs.</b> If several DTOs share fields, use composition. OpenAPI supports \`allOf\` for inheritance-like structures. In NestJS:

\`\`\`typescript
export class BaseEntityDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', format: 'date-time' })
  createdAt: Date;
}

export class ProductDto extends BaseEntityDto {
  @ApiProperty({ example: 'Wireless Headphones' })
  name: string;

  @ApiProperty({ example: 99.99 })
  price: number;
}
\`\`\`

The generated spec includes \`ProductDto\` as \`allOf\` of \`BaseEntityDto\` and the new fields. Clients see inherited fields too.

<b>The \`PartialType\` and other mapped types.</b> NestJS Swagger provides helpers that mirror the \`@nestjs/mapped-types\` package:

\`\`\`typescript
import { PartialType, OmitType, PickType } from '@nestjs/swagger';

// UpdateProductDto = CreateProductDto with all fields optional.
export class UpdateProductDto extends PartialType(CreateProductDto) {}

// ProductSummaryDto = ProductDto without \`description\`.
export class ProductSummaryDto extends OmitType(ProductDto, ['description'] as const) {}

// ProductNameDto = ProductDto with only \`name\` and \`id\`.
export class ProductNameDto extends PickType(ProductDto, ['id', 'name'] as const) {}
\`\`\`

These helpers keep DTOs DRY and ensure that partial/pick/omit variants inherit validation and documentation rules. This is one of the most powerful features of the NestJS + Swagger combination.

<b>Runtime validation in production.</b> Even with a thorough schema, never rely on the spec for enforcement. The spec describes the shape; the \`ValidationPipe\` enforces it. In NestJS:

\`\`\`typescript
app.useGlobalPipes(new ValidationPipe({
  transform: true,       // convert payloads to DTO instances
  whitelist: true,        // strip properties not in the DTO
  forbidNonWhitelisted: true, // reject extra properties with 400
}));
\`\`\`

With \`forbidNonWhitelisted: true\`, clients cannot send unexpected fields — the request is rejected. This pairs perfectly with the schema: the schema tells clients what to send, and the pipe enforces it strictly.

<b>When to shape DTOs for documentation vs. for validation only.</b> Most DTOs serve both. But there are cases where the response DTO differs from the entity DTO. For example:
- <b>Response DTOs</b> (sometimes called "view models" or "presenters") shape what the API returns. They should not include internal fields.
- <b>Create/Update DTOs</b> shape what the client sends. They can include validation rules that response DTOs do not need.

Splitting these DTOs is good practice — it prevents accidentally exposing database fields and keeps the contract explicit.

<b>What can go wrong?</b>
- <b>No \`@ApiProperty\`.</b> The field appears as an untyped blob in the docs. Clients cannot rely on it.
- <b>Missing \`type: () => [X]\` on arrays.</b> Arrays of objects render as generic \`array\`, hiding the item shape. Always specify.
- <b>Forgetting \`required: false\` on optional fields.</b> Docs mark optional fields as required, clients always send them, and validation fails when they skip. Be explicit.
- <b>Circular references.</b> Two DTOs referencing each other cause infinite loops in code generation. Use forward references via \`type: () => X\`.
- <b>Entity leakage.</b> Returning TypeORM entities directly exposes every column, including internal ones (\`passwordHash\`, \`tenantId\`). Always return response DTOs.
- <b>No examples.</b> Docs without examples force clients to guess values. Add a realistic \`example\` to every field.
- <b>Validation drift.</b> The \`@ApiProperty\` says \`maxLength: 100\` but the \`@MaxLength\` says 200. The doc lies. Keep them in sync — or use a script to verify.
- <b>Overloaded DTOs.</b> One \`OrderDto\` used for create, update, list, and detail responses becomes a giant union of optional fields. Split into focused DTOs.

<b>How this appears in production.</b> A mature NestJS API has:
- A folder of DTOs per resource, split into \`create\`, \`update\`, \`query\`, and \`response\` variants.
- Every DTO decorated with \`@ApiProperty\` including descriptions and realistic examples.
- Validation decorators on every input DTO.
- \`ValidationPipe\` with \`whitelist\` and \`forbidNonWhitelisted\`.
- Response DTOs that intentionally hide internal fields.
- Mapped types (\`PartialType\`, \`OmitType\`) to keep DTOs DRY.

The result is a spec that is accurate, complete, and useful — plus runtime enforcement that matches it exactly.
      `,
      diagram: `
DTO -> OpenAPI Schema

  TypeScript DTO class
    |
    |  @ApiProperty(...)      <- documentation
    |  @IsString() @Max(10)   <- runtime validation
    |
    v
  +-------------------------------+
  |  @nestjs/swagger              |
  |  reads reflection + metadata  |
  +-------------------------------+
    |
    v
  OpenAPI schema (in components.schemas)
  {
    "CreateProductDto": {
      "type": "object",
      "required": ["name", "price"],
      "properties": {
        "name":  { "type": "string", "example": "..." },
        "price": { "type": "number", "minimum": 0 },
        "thumbnail": { "type": "string", "nullable": true }
      }
    }
  }
    |
    v
  Swagger UI shows it
  Client generator creates TS/Python/Go types
  Mock server returns fake data

Mapped types:
  PartialType(CreateProductDto)         -> all optional
  OmitType(ProductDto, ['secret'])      -> drop field
  PickType(ProductDto, ['id', 'name'])  -> keep only these
      `,
      codeExample: { title: "Example", code: `
// ============================================
// SCHEMAS & DTOs IN @nestjs/swagger
// ============================================

// ---------- 1. Basic DTO with validation + docs ----------
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, IsNumber, IsOptional, Min, Max, MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name as it appears in the catalog',
    example: 'Wireless Headphones',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Price in USD, before tax',
    example: 99.99,
    minimum: 0,
    maximum: 1_000_000,
  })
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  price: number;

  @ApiProperty({
    description: 'Optional thumbnail URL',
    example: 'https://cdn.example.com/p/42.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}

// ---------- 2. Enum ----------
export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Shipped = 'shipped',
  Cancelled = 'cancelled',
}

export class OrderDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.Paid })
  status: OrderStatus;
}

// ---------- 3. Nested objects + arrays ----------
export class OrderItemDto {
  @ApiProperty({ example: 101 })
  productId: number;

  @ApiProperty({ example: 2, minimum: 1 })
  quantity: number;
}

export class CustomerDto {
  @ApiProperty({ example: 42 })
  id: number;

  @ApiProperty({ example: 'ada@example.com', format: 'email' })
  email: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: () => CustomerDto })
  customer: CustomerDto;

  @ApiProperty({ type: () => [OrderItemDto] })
  items: OrderItemDto[];

  @ApiProperty({ required: false, example: 'SPRING10' })
  @IsOptional()
  couponCode?: string;
}

// ---------- 4. Arrays of primitives ----------
export class TaggedProductDto {
  @ApiProperty({ type: [String], example: ['red', 'wireless'] })
  tags: string[];
}

// ---------- 5. Free-form map ----------
export class AttributeHolderDto {
  @ApiProperty({
    description: 'Arbitrary key/value attributes',
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { color: 'red', size: 'M' },
  })
  attributes: Record<string, string>;
}

// ---------- 6. Inheritance ----------
export class BaseEntityDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ format: 'date-time', example: '2024-01-01T00:00:00Z' })
  createdAt: string;
}

export class ProductDto extends BaseEntityDto {
  @ApiProperty({ example: 'Wireless Headphones' })
  name: string;

  @ApiProperty({ example: 99.99 })
  price: number;

  @ApiProperty({ required: false })
  thumbnail?: string;
}
// Generated schema: ProductDto = allOf(BaseEntityDto, { name, price, thumbnail })

// ---------- 7. Mapped types (PartialType, OmitType, PickType) ----------
import { PartialType, OmitType, PickType } from '@nestjs/swagger';

// All fields optional — perfect for PATCH endpoints.
export class UpdateProductDto extends PartialType(CreateProductDto) {}

// Hide internal fields from a list view.
export class ProductSummaryDto extends OmitType(ProductDto, [
  'thumbnail',
] as const) {}

// Keep only a couple of fields for autocomplete endpoints.
export class ProductNameDto extends PickType(ProductDto, ['id', 'name'] as const) {}

// ---------- 8. Response DTO hides internals ----------
// Notice this is separate from the entity. Internal fields like
// \`passwordHash\` are never declared, so they cannot leak.
export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ada', description: 'First name' })
  firstName: string;

  @ApiProperty({ example: 'Lovelace' })
  lastName: string;

  @ApiProperty({ example: 'ada@example.com', format: 'email' })
  email: string;
}

// ---------- 9. Controller using the DTOs ----------
import {
  Body, Controller, Get, Param, Patch, Post,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiCreatedResponse({ type: ProductDto })
  create(@Body() dto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a product' })
  @ApiOkResponse({ type: ProductDto })
  findOne(@Param('id') id: string): Promise<ProductDto> {
    return this.productsService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({ type: ProductDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productsService.update(Number(id), dto);
  }
}

// ---------- 10. Runtime enforcement in main.ts ----------
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,             // strip unknown properties silently
    forbidNonWhitelisted: true,  // reject unknown properties with 400
  }),
);

// What the OpenAPI spec promises, the ValidationPipe enforces.
// Both live together on the same DTO.
      ` },
      keyTakeaways: [
        "OpenAPI schemas describe the shape of request and response data; in NestJS they come from DTO classes with `@ApiProperty`.",
        "`class-validator` enforces rules at runtime; `@ApiProperty` documents them in the spec. Use both together.",
        "Use `type: () => X` and `type: () => [X]` for nested objects and arrays of objects to avoid circular reference issues.",
        "Enums and free-form objects (`additionalProperties`) are first-class in OpenAPI and render richly in Swagger UI.",
        "Mapped types (`PartialType`, `OmitType`, `PickType` from `@nestjs/swagger`) keep DTO variants DRY.",
        "Split DTOs by purpose: create, update, query, response. Never return entities directly.",
        "Enforce schemas at runtime with `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`.",
      ],
      commonMistakes: [
        "<b>Missing `@ApiProperty`.</b> The field renders as an untyped blob. Clients cannot know its type or constraints. Decorate every public field.",
        "<b>Forgetting `type: () => [X]` on arrays of objects.</b> The docs show a generic array with no item schema. Always specify the item type.",
        "<b>Optional fields not marked `required: false`.</b> The generated docs treat them as required. Clients always send them, or fail when they do not.",
        "<b>Circular DTO references without forward references.</b> Two DTOs referencing each other cause infinite loops or missing schemas. Use `type: () => X`.",
        "<b>Returning entities instead of response DTOs.</b> Internal fields like `passwordHash` and `tenantId` leak into the docs and the API. Always return a response DTO.",
        "<b>Validation and documentation drift.</b> The `@MaxLength(200)` and the `@ApiProperty({ maxLength: 100 })` disagree. The spec lies. Keep them in sync.",
        "<b>One mega DTO for everything.</b> A single `OrderDto` used for create, update, list, and detail becomes a union of optionals that confuses clients. Split into focused DTOs.",
        "<b>No examples.</b> Fields without `example` render as placeholders in Swagger UI. Clients guess. Add realistic examples.",
      ],
      quiz: [
        {
          question:
            "What is the difference between `@ApiProperty()` and `@IsString()` on a DTO field?",
          options: [
            "They are equivalent.",
            "`@ApiProperty()` documents the field in the OpenAPI spec; `@IsString()` enforces the type at runtime via ValidationPipe.",
            "`@ApiProperty()` enforces validation; `@IsString()` documents the field.",
            "Neither affects the schema.",
          ],
          correctIndex: 1,
          explanation:
            "`@ApiProperty()` contributes to the OpenAPI spec shown to clients. `@IsString()` is a class-validator decorator that the ValidationPipe enforces at runtime. You want both on every field: documentation plus enforcement.",
        },
        {
          question:
            "How do you document an array of nested objects in NestJS Swagger?",
          options: [
            "`@ApiProperty({ type: OrderItemDto })`",
            "`@ApiProperty({ type: () => [OrderItemDto] })`",
            "`@ApiProperty({ isArray: true })`",
            "Leave it undeclared — TypeScript handles it.",
          ],
          correctIndex: 1,
          explanation:
            "Use `type: () => [OrderItemDto]` to express an array of nested DTOs. The arrow function delays the reference and avoids circular dependency issues in TypeScript.",
        },
        {
          question:
            "Which NestJS Swagger helper creates a DTO with all fields optional, ideal for PATCH endpoints?",
          options: [
            "`PartialType(CreateProductDto)`",
            "`OptionalType(CreateProductDto)`",
            "`RequiredType(CreateProductDto)`",
            "`PickType(CreateProductDto, ['name'])`",
          ],
          correctIndex: 0,
          explanation:
            "`PartialType` mirrors `@nestjs/mapped-types` and generates a DTO with every field optional and every validator relaxed to optional. Perfect for update/PATCH endpoints.",
        },
        {
          question:
            "You set `forbidNonWhitelisted: true` on the ValidationPipe. What happens if a client sends an unexpected field?",
          options: [
            "The field is silently dropped.",
            "The request is rejected with 400 because the property is not declared in the DTO.",
            "The field is passed to the service.",
            "The server crashes.",
          ],
          correctIndex: 1,
          explanation:
            "`forbidNonWhitelisted` makes the ValidationPipe reject requests that include properties not declared in the DTO. Combined with `@ApiProperty`, this aligns the runtime contract with the documented schema.",
        },
        {
          question:
            "Why should you use a response DTO instead of returning a database entity directly?",
          options: [
            "Because TypeORM forbids it.",
            "Because response DTOs intentionally expose only the fields meant to be public, preventing leaks of internal fields like `passwordHash`.",
            "Because entities cannot be serialized.",
            "Because it is faster.",
          ],
          correctIndex: 1,
          explanation:
            "Returning entities exposes every database column. A response DTO is a deliberate surface area — clients see exactly the fields you chose. This is both a security and a clarity win.",
        },
      ],
    },
    {
      id: "day-50-lesson-3",
      title: "Responses, Examples, and Errors",
      durationMinutes: 24,
      explanation: `
<b>A client developer integrates with your API and hits a wall.</b> They send \`POST /orders\` and get back a \`400 Bad Request\`. The response body is \`{"message":"Validation failed"}\`. They have no idea which field failed or why. They open the docs, click on \`POST /orders\`, and see only a \`201 Created\` response documented. Nothing about \`400\`, nothing about \`401\`, nothing about what the error looks like.

This is the difference between an API that documents success and one that documents <i>reality</i>. A real API returns many kinds of responses: success cases, validation errors, auth failures, not-found, conflicts, rate limits, and server errors. Good OpenAPI documentation shows all of them — with examples, structured error schemas, and clear descriptions.

<b>Why document responses thoroughly?</b> Because clients must handle them. Every unhandled error case is a bug waiting to happen. Every well-documented error case is a line of defensive code the client knows to write. Good error documentation is a gift to every future integrator — including future you.

<b>The \`@ApiResponse\` decorator.</b> NestJS Swagger offers several shortcuts:

\`\`\`typescript
@ApiOkResponse({ description: 'Found', type: ProductDto })
@ApiCreatedResponse({ description: 'Created', type: ProductDto })
@ApiNoContentResponse({ description: 'Deleted' })
@ApiBadRequestResponse({ description: 'Invalid input' })
@ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
@ApiForbiddenResponse({ description: 'Insufficient permissions' })
@ApiNotFoundResponse({ description: 'Resource not found' })
@ApiConflictResponse({ description: 'Resource already exists' })
@ApiUnprocessableEntityResponse({ description: 'Business rule violation' })
@ApiTooManyRequestsResponse({ description: 'Rate limit exceeded' })
@ApiInternalServerErrorResponse({ description: 'Unexpected error' })
\`\`\`

The generic form \`@ApiResponse({ status, description, type, schema, content })\` works for anything else (like \`410 Gone\` or custom status codes).

<b>A realistic controller with full responses:</b>

\`\`\`typescript
@Post()
@ApiOperation({ summary: 'Create a new product' })
@ApiCreatedResponse({ description: 'Product created', type: ProductDto })
@ApiBadRequestResponse({ description: 'Invalid input', type: ErrorDto })
@ApiUnauthorizedResponse({ description: 'Missing or invalid token', type: ErrorDto })
@ApiConflictResponse({ description: 'SKU already exists', type: ErrorDto })
@ApiInternalServerErrorResponse({ description: 'Unexpected error', type: ErrorDto })
create(@Body() dto: CreateProductDto) { ... }
\`\`\`

Now the docs show every likely outcome, each with a typed error response.

<b>Structured error schemas.</b> Consistent error shapes across the API are invaluable. Define an \`ErrorDto\`:

\`\`\`typescript
export class ErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 'Validation failed' })
  message: string | string[];

  @ApiProperty({ example: '2024-01-01T00:00:00Z', required: false })
  timestamp?: string;

  @ApiProperty({ example: '/orders', required: false })
  path?: string;
}
\`\`\`

Every error response across the API uses this shape. Clients can write one error handler instead of twenty. This is one of the most impactful patterns in API design.

<b>Multiple response variants for one status.</b> Sometimes the same status code returns different shapes. For example, \`200 OK\` might return either a plain array or an array wrapped in an envelope. Use \`oneOf\` or separate \`content\` entries:

\`\`\`typescript
@ApiResponse({
  status: 200,
  description: 'List or envelope',
  schema: {
    oneOf: [
      { type: 'array', items: { $ref: '#/components/schemas/ProductDto' } },
      { $ref: '#/components/schemas/PaginatedProductsDto' },
    ],
  },
})
\`\`\`

In practice this is rare — usually one status returns one shape.

<b>Examples: the single biggest quality lever.</b> A schema without examples is like a menu without prices. Clients can see the shape but have no idea what real values look like. Add an \`example\` to every field and, when useful, a full \`example\` object on the response:

\`\`\`typescript
@ApiOkResponse({
  description: 'Product details',
  type: ProductDto,
  content: {
    'application/json': {
      example: {
        id: 42,
        name: 'Wireless Headphones',
        price: 99.99,
        thumbnail: 'https://cdn.example.com/p/42.jpg',
      },
    },
  },
})
\`\`\`

Swagger UI renders this as a clickable sample the client can copy or execute directly. Multiple named examples are also possible via \`examples\`:

\`\`\`typescript
content: {
  'application/json': {
    examples: {
      'in-stock':  { value: { id: 42, status: 'in_stock', quantity: 12 } },
      'out-of-stock': { value: { id: 42, status: 'out_of_stock', quantity: 0 } },
    },
  },
}
\`\`\`

Named examples let the client see both happy and edge-case shapes side by side.

<b>Documenting pagination.</b> Paginated responses have a distinctive shape. Document the envelope precisely:

\`\`\`typescript
export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 483 })
  total: number;

  @ApiProperty({ example: 25 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;
}

export class PaginatedProductsDto {
  @ApiProperty({ type: [ProductDto] })
  items: ProductDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
\`\`\`

The response DTO declares both the items and the meta. Swagger UI shows both. Generated SDKs know exactly what to deserialize.

<b>Documenting headers.</b> If your endpoint returns custom headers (rate limit info, deprecation warnings, cursor links), document them with \`@ApiHeader\` on the response:

\`\`\`typescript
@ApiResponse({
  status: 200,
  description: 'OK',
  type: ProductDto,
  headers: {
    'X-RateLimit-Remaining': { schema: { type: 'integer' }, description: 'Requests remaining in this window' },
    'Deprecation': { schema: { type: 'string' }, description: 'Set to "true" on deprecated endpoints' },
    'Sunset': { schema: { type: 'string', format: 'date-time' }, description: 'Retirement date for deprecated endpoints' },
  },
})
\`\`\`

<b>Grouping errors globally.</b> If every endpoint can return \`401 Unauthorized\` and \`500 Internal Server Error\`, re-declaring them on every method is repetitive. Use a class-level \`@ApiResponse\` or a custom decorator that applies the common set:

\`\`\`typescript
export function ApiCommonErrors() {
  return applyDecorators(
    ApiUnauthorizedResponse({ description: 'Missing or invalid token', type: ErrorDto }),
    ApiForbiddenResponse({ description: 'Insufficient permissions', type: ErrorDto }),
    ApiInternalServerErrorResponse({ description: 'Unexpected error', type: ErrorDto }),
  );
}

@ApiCommonErrors()
@Controller('orders')
export class OrdersController {}
\`\`\`

Every method in the controller now inherits those responses in the docs.

<b>Best practices for response documentation:</b>
- <b>Document every response the endpoint can return.</b> If your global filter can return \`500\`, document it. If auth can fail, document \`401\`. If the resource can be missing, document \`404\`.
- <b>Use structured error DTOs.</b> One consistent shape for all errors is worth a lot.
- <b>Include examples for each response.</b> Especially for errors — they are the hardest for clients to get right.
- <b>Set \`type\` to the exact DTO.</b> This drives SDK generation and validation.
- <b>Use \`description\` that explains business rules.</b> "Product not found" is better than "Not found". "Cannot modify a paid order" is better than "Conflict".
- <b>Document rate limits and pagination in headers and meta.</b> Clients need to know the mechanics, not just the data.
- <b>Keep it consistent across endpoints.</b> A consistent style is more valuable than a clever one-off.

<b>What can go wrong?</b>
- <b>Only documenting the happy path.</b> Clients are surprised by errors and cannot handle them gracefully.
- <b>Inconsistent error shapes.</b> Some endpoints return \`{ message }\`, others \`{ error: { code, message } }\`. Clients write more handlers than necessary.
- <b>No examples.</b> Clients see the shape but not realistic values. They call the API with junk and get 400s.
- <b>Wrong status codes documented.</b> The docs say \`200\` but the handler returns \`201\`. Clients break because they check for the wrong code.
- <b>Missing headers.</b> Clients miss rate-limit, pagination, or deprecation signals because they are not documented.
- <b>Over-documented errors.</b> Listing every conceivable status for every endpoint bloats the docs. Document what actually happens.
- <b>Error DTO drifting from the global filter.</b> The actual error shape changes but the DTO is not updated. The docs lie. Sync them via tests.

<b>How this appears in production.</b> A well-documented API:
- Returns a consistent error envelope everywhere, defined once as \`ErrorDto\`.
- Documents \`400\`, \`401\`, \`403\`, \`404\`, \`409\`, \`422\`, \`429\`, and \`500\` where relevant.
- Provides realistic examples for every response.
- Uses \`ApiCommonErrors()\` to apply auth/500 responses globally.
- Includes header documentation for rate limits and pagination.
- Integrates the error DTO with the actual global exception filter so the documented shape matches reality.

This is what turns a spec from "describes the API" into "clients can build against it without asking questions."
      `,
      diagram: `
Response Documentation Structure

  POST /orders
  |
  +-- 201 Created
  |     body: OrderDto
  |     example: { id: 1001, status: "pending", total: 149.98 }
  |
  +-- 400 Bad Request
  |     body: ErrorDto
  |     example: { statusCode: 400, error: "Bad Request",
  |                message: ["items must not be empty"] }
  |
  +-- 401 Unauthorized
  |     body: ErrorDto
  |
  +-- 409 Conflict
  |     body: ErrorDto
  |     description: "Order already exists for idempotency key"
  |
  +-- 500 Internal Server Error
        body: ErrorDto

Common across the API:
  - Same ErrorDto shape everywhere
  - Same status codes documented consistently
  - Examples on every response

Controller-level reuse:
  @ApiCommonErrors()   -> adds 401, 403, 500 to every route

Header documentation:
  X-RateLimit-Remaining
  Deprecation / Sunset
  Link (for cursor pagination)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// RESPONSES, EXAMPLES, AND ERRORS
// ============================================

// ---------- 1. Central ErrorDto ----------
import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['name should not be empty', 'price must be positive'],
  })
  message: string | string[];

  @ApiProperty({ example: '2024-01-01T00:00:00Z', required: false })
  timestamp?: string;

  @ApiProperty({ example: '/v1/orders', required: false })
  path?: string;
}

// ---------- 2. Documenting a full set of responses ----------
import {
  Body, Controller, Post, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse,
  ApiUnauthorizedResponse, ApiConflictResponse, ApiInternalServerErrorResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';
import { ErrorDto } from './common/dto/error.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Creates an order for the authenticated customer. Validates inventory, ' +
      'processes the payment intent, and reserves stock in a single transaction.',
  })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      simple: {
        summary: 'Single item order',
        value: {
          items: [{ productId: 101, quantity: 1 }],
          payment: { method: 'card', cardToken: 'tok_visa' },
        },
      },
      withCoupon: {
        summary: 'Order with coupon code',
        value: {
          items: [{ productId: 101, quantity: 2 }],
          payment: { method: 'card', cardToken: 'tok_visa' },
          couponCode: 'SPRING10',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Order created successfully',
    type: OrderDto,
    content: {
      'application/json': {
        example: {
          id: 1001,
          status: 'pending',
          total: 149.98,
          items: [{ productId: 101, quantity: 2 }],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input (missing fields, wrong types, empty items)',
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid bearer token',
    type: ErrorDto,
  })
  @ApiConflictResponse({
    description: 'Idempotency key already used, or stock unavailable',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error',
    type: ErrorDto,
  })
  create(@Body() dto: CreateOrderDto): Promise<OrderDto> {
    return this.ordersService.create(dto);
  }
}

// ---------- 3. Paginated response DTO ----------
export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 483 })
  total: number;

  @ApiProperty({ example: 25 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;
}

export class PaginatedOrdersDto {
  @ApiProperty({ type: [OrderDto] })
  items: OrderDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

// Response with example for a paginated endpoint.
@ApiOkResponse({
  description: 'Paginated list of orders',
  type: PaginatedOrdersDto,
  content: {
    'application/json': {
      example: {
        items: [
          { id: 1001, status: 'paid', total: 149.98 },
          { id: 1002, status: 'shipped', total: 42.5 },
        ],
        meta: {
          page: 1,
          limit: 20,
          total: 483,
          totalPages: 25,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      },
    },
  },
})

// ---------- 4. Documenting response headers ----------
@ApiResponse({
  status: 200,
  description: 'OK',
  type: ProductDto,
  headers: {
    'X-RateLimit-Limit': {
      description: 'Maximum requests allowed in the current window',
      schema: { type: 'integer', example: 1000 },
    },
    'X-RateLimit-Remaining': {
      description: 'Requests remaining in the current window',
      schema: { type: 'integer', example: 987 },
    },
    Deprecation: {
      description: 'Set to "true" on deprecated endpoints',
      schema: { type: 'string', example: 'true' },
    },
    Sunset: {
      description: 'RFC 1123 date when the endpoint is retired',
      schema: { type: 'string', example: 'Sat, 01 Mar 2025 00:00:00 GMT' },
    },
  },
})
findAll() {}

// ---------- 5. Reusable decorator for common errors ----------
import { applyDecorators } from '@nestjs/common';
import {
  ApiUnauthorizedResponse, ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ApiCommonErrors() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Missing or invalid token',
      type: ErrorDto,
    }),
    ApiForbiddenResponse({
      description: 'Insufficient permissions',
      type: ErrorDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Unexpected error',
      type: ErrorDto,
    }),
  );
}

// Apply to every method in a controller.
@ApiTags('orders')
@ApiCommonErrors()
@Controller('orders')
export class OrdersController {
  // ...
}

// ---------- 6. Custom status codes ----------
import { ApiResponse } from '@nestjs/swagger';

@ApiResponse({
  status: 410,
  description: 'Endpoint retired. See migration guide.',
  type: ErrorDto,
  content: {
    'application/json': {
      example: {
        statusCode: 410,
        error: 'Gone',
        message: 'API v1 was retired on 2025-03-01. Migrate to v2.',
      },
    },
  },
})

// ---------- 7. Globally consistent error shape via filter ----------
// Make the actual error responses match the ErrorDto exactly.
import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message ?? exception.message
        : 'Internal server error';

    res.status(status).json({
      statusCode: status,
      error: res.statusMessage,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}

// Register in main.ts:
// app.useGlobalFilters(new AllExceptionsFilter());
// Now every error response matches the documented ErrorDto.
      ` },
      keyTakeaways: [
        "Document every response the endpoint can return, not just the success case.",
        "Use a single `ErrorDto` shape for all errors so clients write one error handler.",
        "Add realistic `example` values to every response, especially errors — examples are the highest-value documentation.",
        "Use specific `@ApiXxxResponse` decorators for common statuses and `@ApiResponse` for custom ones.",
        "Document pagination envelopes (items + meta) and any response headers (rate limits, deprecation, links).",
        "Use `applyDecorators` to reuse common error documentation across controllers.",
        "Make the actual error responses (via a global filter) match the documented `ErrorDto` exactly.",
      ],
      commonMistakes: [
        "<b>Only documenting 200/201.</b> Clients have no guidance for failures. Always document 400, 401, 403, 404, 409, 422, 429, and 500 as appropriate.",
        "<b>Inconsistent error shapes.</b> Some endpoints return `{ message }`, others return `{ error: { code, message } }`. Clients have to write a different handler for every endpoint. Standardize on one shape.",
        "<b>No examples.</b> Schemas without examples force clients to guess values and trigger avoidable 400s.",
        "<b>Wrong status codes in docs.</b> Docs say 200 but the handler returns 201. Clients break. Keep them in sync and test it.",
        "<b>Missing header documentation.</b> Clients miss rate limits, pagination cursors, and deprecation signals because the headers are not in the spec.",
        "<b>Under-documented pagination.</b> Only the `items` array is documented, and the `meta` object is invisible. Clients cannot implement pagination from the docs alone.",
        "<b>Error DTO drift.</b> The global exception filter changes shape but the `ErrorDto` and `@ApiResponse` decorators are not updated. Add a test that asserts the real error shape matches the DTO.",
        "<b>Over-documenting errors.</b> Listing every conceivable HTTP status on every endpoint bloats the docs. Document what actually happens in practice.",
      ],
      quiz: [
        {
          question:
            "Why should every paginated endpoint's response DTO include a `meta` object in the OpenAPI schema?",
          options: [
            "Because OpenAPI requires a meta field.",
            "Because clients need to know the total, page, limit, and has-more flags to implement pagination correctly.",
            "Because it makes responses smaller.",
            "Because it prevents caching.",
          ],
          correctIndex: 1,
          explanation:
            "Pagination metadata (total, page, limit, totalPages, hasNextPage) is what clients use to render pagination controls and fetch subsequent pages. Documenting it in the response DTO makes the contract complete.",
        },
        {
          question:
            "Why is a single `ErrorDto` shape valuable across an entire API?",
          options: [
            "Because OpenAPI requires it.",
            "Because clients can write one error handler instead of one per endpoint, and error messages become predictable.",
            "Because it makes errors smaller.",
            "Because it hides errors from clients.",
          ],
          correctIndex: 1,
          explanation:
            "A consistent error envelope lets clients write a single parser and error handler. Inconsistency across endpoints multiplies client complexity and bugs.",
        },
        {
          question:
            "What is the primary value of adding `example` values to response schemas?",
          options: [
            "They make the response faster.",
            "They show clients realistic values, so integration is faster and fewer mistakes happen during development.",
            "They compress the response.",
            "They enforce validation.",
          ],
          correctIndex: 1,
          explanation:
            "Examples are the highest-value documentation. They let clients see realistic request and response shapes, test against them, and avoid guessing. Swagger UI even uses them as pre-filled samples for 'Try it out'.",
        },
        {
          question:
            "You want to document that an endpoint returns `410 Gone` with a custom error body. Which decorator should you use?",
          options: [
            "`@ApiGoneResponse()` — NestJS has a built-in for every status.",
            "`@ApiResponse({ status: 410, description, type, content })` — the generic form covers any status code.",
            "`@ApiErrorResponse()`",
            "`@HttpCode(410)`",
          ],
          correctIndex: 1,
          explanation:
            "NestJS Swagger provides helpers for common statuses (`@ApiNotFoundResponse`, `@ApiConflictResponse`, etc.), but for less common codes like 410, 422, or custom ones, use the generic `@ApiResponse({ status, description, ... })`.",
        },
      ],
    },
    {
      id: "day-50-lesson-4",
      title: "Authentication and Security in OpenAPI",
      durationMinutes: 20,
      explanation: `
<b>Imagine you publish a beautiful API on Swagger UI.</b> A developer opens your docs, clicks an endpoint, and clicks "Try it out." They get a \`401 Unauthorized\`. They look around the docs for how to authenticate but see nothing — no API key field, no bearer token input, no explanation. They close the tab.

This is one of the most common documentation failures. An API's authentication is often the very first thing a client needs to understand, and if it is not in the OpenAPI spec, developers cannot even try the endpoints from the browser. Swagger UI can show a "Authorize" button that accepts a token and adds it to every request — but only if you declare the security scheme.

<b>OpenAPI security schemes</b> describe how the API is authenticated. The most common types:
- <b>\`http\` with scheme \`bearer\`</b>: JWT tokens, OAuth2 access tokens, and other bearer tokens.
- <b>\`http\` with scheme \`basic\`</b>: HTTP Basic auth (username + password). Rarely used for modern APIs.
- <b>\`apiKey\`</b>: an API key sent in a header, query, or cookie.
- <b>\`oauth2\`</b>: a full OAuth2 flow (authorization code, client credentials, implicit, password).
- <b>\`openIdConnect\`</b>: OpenID Connect, built on top of OAuth2.

Each scheme has a name (like \`bearer\` or \`apiKey\`) that you reference in \`security\` declarations on paths or globally.

<b>Declaring a bearer scheme in NestJS.</b>

\`\`\`typescript
const config = new DocumentBuilder()
  .setTitle('Shop API')
  .setVersion('1.0.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your JWT access token',
    },
    'access-token', // name of the scheme
  )
  .build();
\`\`\`

Then on your controllers or routes:

\`\`\`typescript
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {}
\`\`\`

Swagger UI now shows an "Authorize" button at the top. Once the developer enters a token, it is automatically attached to every "Try it out" request.

<b>Declaring an API key.</b>

\`\`\`typescript
.addApiKey(
  {
    type: 'apiKey',
    in: 'header',
    name: 'X-API-Key',
    description: 'API key issued in the developer dashboard',
  },
  'api-key',
)
\`\`\`

On a controller:

\`\`\`typescript
@ApiSecurity('api-key')
@Controller('integrations')
export class IntegrationsController {}
\`\`\`

<b>Declaring OAuth2.</b> This is richer because it can include scopes:

\`\`\`typescript
.addOAuth2(
  {
    type: 'oauth2',
    flows: {
      authorizationCode: {
        authorizationUrl: 'https://auth.example.com/oauth/authorize',
        tokenUrl: 'https://auth.example.com/oauth/token',
        scopes: {
          'read:orders': 'Read orders',
          'write:orders': 'Create and modify orders',
        },
      },
    },
  },
  'oauth2',
)
\`\`\`

On a route with a required scope:

\`\`\`typescript
@ApiOAuth2(['read:orders'])
@Get('orders')
findAll() {}
\`\`\`

Swagger UI presents an OAuth2 flow, and the documented scope requirements appear for each endpoint. This is powerful for public APIs where scopes define fine-grained permissions.

<b>Documenting that an endpoint is public.</b> Not every endpoint requires auth. Some are intentionally public: \`/health\`, \`/auth/login\`, \`/auth/register\`, \`/products\` (browsing), etc. Two ways to signal this:

- <b>Do nothing.</b> In OpenAPI, if no \`security\` is declared, the endpoint is treated as public. This works if the global default is "no security."
- <b>Explicitly override.</b> If you set a global security requirement, you can override it per route with \`@ApiSecurity({})\` or by setting \`security: []\` on the operation.

\`\`\`typescript
@ApiSecurity([]) // explicit: no security required
@Get('health')
health() { return { status: 'ok' }; }
\`\`\`

Being explicit is a good idea for public-facing APIs, because it documents the intent in the spec itself.

<b>Where to put the security declaration: global vs. per-route.</b>
- <b>Global (in DocumentBuilder \`.addSecurityRequirements('access-token')\`)</b>: applies to every endpoint. Convenient when nearly every endpoint is authenticated, but every public endpoint must then override with \`@ApiSecurity([])\`.
- <b>Per-controller or per-route (\`@ApiBearerAuth()\`, \`@ApiSecurity(...)\`)</b>: explicit and unambiguous, but more decorators.

In practice, teams often go global because most endpoints require auth and the public ones are few. Either way, be consistent.

<b>Authentication vs. authorization in OpenAPI.</b> OpenAPI documents <i>authentication</i> (who is the caller). It does not strongly model <i>authorization</i> (what they are allowed to do), though scopes in OAuth2 hint at it. To document authorization, use the \`description\` fields:

\`\`\`typescript
@ApiOperation({
  summary: 'Cancel an order',
  description:
    'Requires the "admin" role, or the order must belong to the calling customer.',
})
\`\`\`

Documented roles and rules are gold for client developers. If they cannot tell whether they can call an endpoint, they will ask you.

<b>Documenting token formats and lifetimes.</b> The spec can hint at these:

\`\`\`typescript
.addBearerAuth(
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description:
      'JWT access token. Lifetime 15 minutes. Use the refresh token endpoint to obtain a new one.',
  },
  'access-token',
)
\`\`\`

This is documentation, not enforcement, but it answers the common client questions: "What do I put here? How long does it last? What do I do when it expires?"

<b>Handling multiple auth methods.</b> Some APIs accept either an API key (for server-to-server) or a bearer token (for user-scoped calls). You can declare multiple schemes and combine them:

\`\`\`typescript
const config = new DocumentBuilder()
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearer')
  .addApiKey({ type: 'apiKey', in: 'header', name: 'X-API-Key' }, 'api-key')
  .build();
\`\`\`

Then on a controller that accepts either:

\`\`\`typescript
@ApiSecurity('bearer')
@ApiSecurity('api-key')
@Controller('events')
export class EventsController {}
\`\`\`

This reads as "either bearer or api-key", which is what the actual guard should enforce. Keep documentation and enforcement aligned.

<b>Security and the documentation itself.</b> Documentation is a public attack surface. Consider:
- <b>Do not publish admin or internal endpoints in a public Swagger UI.</b> Use \`@ApiExcludeController()\` or \`@ApiExcludeEndpoint()\`, or host internal docs behind auth.
- <b>Do not include real tokens in examples.</b> Use \`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\` style placeholders, never a valid token.
- <b>Do not leak internal URLs.</b> Server URLs should be the public ones, not internal service hostnames.
- <b>Protect the Swagger UI itself</b> in production if the API is not public. Even though it does not leak code, it does expose your attack surface.
- <b>Be careful with test data in examples.</b> Example emails, credit card numbers, or IDs should be obviously fake (e.g. \`user@example.com\`, \`4242 4242 4242 4242\`), never real customer data.

<b>What can go wrong?</b>
- <b>No security scheme in the spec.</b> Clients cannot figure out how to authenticate. "Try it out" always returns 401.
- <b>Wrong scheme type.</b> Declaring \`apiKey\` when the API actually expects \`Bearer <token>\` in the \`Authorization\` header. Clients are misled.
- <b>Public endpoints incorrectly marked as authenticated.</b> The "Try it out" button fails because Swagger UI sends an unwanted header. Or clients assume they need auth for something public.
- <b>Authenticated endpoints not marked.</b> Clients send unauthenticated requests and get 401s. Frustration follows.
- <b>Scopes not documented.</b> OAuth2 clients do not know which scopes to request and cannot plan their consent screen.
- <b>Publishing admin endpoints.</b> Swagger UI exposes the full attack surface to anyone who finds the docs URL.
- <b>Using a real token in an example.</b> A leaked credential in a public doc is a security incident.
- <b>Publishing internal service URLs in \`servers\`.</b> Leaks internal architecture and lets attackers probe.
- <b>Inconsistent security declarations.</b> Some routes declare auth, others do not, and the guard behavior does not match. Clients are confused, and some are blocked erroneously.

<b>How this appears in production.</b> A mature API:
- Declares bearer auth in the DocumentBuilder and applies it globally.
- Overrides \`@ApiSecurity([])\` on the handful of public endpoints.
- Uses role/scope descriptions in \`@ApiOperation\` to document authorization rules.
- Hides internal and admin routes from the public Swagger UI.
- Hosts a separate internal Swagger UI behind authentication.
- Uses fake tokens and fake data in every example.
- Publishes only public server URLs in the \`servers\` array.

This is the difference between an API that looks polished and one that actually helps clients integrate safely.
      `,
      diagram: `
OpenAPI Security Scheme

  Client (Swagger UI "Authorize" button)
      |
      |  enters token (e.g. JWT)
      v
  +---------------------------------+
  |  Security scheme declared:      |
  |  type: http, scheme: bearer     |
  |  bearerFormat: JWT              |
  +---------------------------------+
      |
      v
  Every "Try it out" request includes:
    Authorization: Bearer <token>

Per-endpoint security:
  @ApiBearerAuth('access-token')     -> requires bearer
  @ApiSecurity('api-key')            -> requires API key
  @ApiSecurity([])                   -> public, no auth
  @ApiOAuth2(['read:orders'])        -> requires OAuth2 scope

Security in the docs is a declaration, not enforcement.
Enforcement is done by guards:
  @UseGuards(JwtAuthGuard)

Rule: the OpenAPI security declaration must match the guard.
Otherwise clients see different behavior than the docs promise.

Public vs internal:
  Public Swagger UI   -> only public + client-facing endpoints
  Internal Swagger UI -> admin, debug, and internal endpoints,
                         behind authentication and IP allow-list
      `,
      codeExample: { title: "Example", code: `
// ============================================
// AUTHENTICATION & SECURITY IN OPENAPI
// ============================================

// ---------- 1. Declare security schemes in DocumentBuilder ----------
import { DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Shop API')
  .setVersion('1.0.0')

  // Bearer (JWT) — the main scheme for user-scoped endpoints
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'JWT access token (15 minute lifetime). Refresh via /auth/refresh.',
    },
    'access-token',
  )

  // API key — for server-to-server integrations
  .addApiKey(
    {
      type: 'apiKey',
      in: 'header',
      name: 'X-API-Key',
      description: 'API key issued in the developer dashboard',
    },
    'api-key',
  )

  // OAuth2 with scopes — for third-party apps
  .addOAuth2(
    {
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'https://auth.example.com/oauth/authorize',
          tokenUrl: 'https://auth.example.com/oauth/token',
          scopes: {
            'read:orders': 'Read orders',
            'write:orders': 'Create and modify orders',
            'read:profile': 'Read profile info',
          },
        },
      },
    },
    'oauth2',
  )

  // Apply bearer globally. Every endpoint requires it unless overridden.
  .addSecurityRequirements('access-token')

  .build();

// ---------- 2. Apply security per controller / route ----------
import {
  Controller, Get, Post, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiSecurity, ApiOperation, ApiOkResponse,
} from '@nestjs/swagger';

// All endpoints require a bearer token.
@ApiTags('orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  @Get()
  @ApiOperation({ summary: 'List orders for the current user' })
  @ApiOkResponse({ type: [OrderDto] })
  findAll() {}

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Cancel an order',
    description:
      'Requires the "admin" role, or the order must belong to the calling user.',
  })
  cancel() {}
}

// Endpoint that accepts either bearer OR api-key.
@ApiTags('events')
@ApiBearerAuth('access-token')
@ApiSecurity('api-key')
@Controller('events')
export class EventsController {
  @Get()
  list() {}
}

// OAuth2 endpoint with a required scope.
@ApiTags('orders')
@ApiOAuth2(['read:orders'])
@Controller('public/orders')
export class PublicOrdersController {
  @Get()
  list() {}
}

// Public endpoint — explicitly no auth required.
@ApiTags('health')
@ApiSecurity([])
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}

// ---------- 3. Documenting token format / behavior in descriptions ----------
// This is documentation only — enforcement lives in the guards.
//
//   'access-token':
//     description: 'JWT access token. Lifetime 15 minutes.
//                   Refresh via POST /auth/refresh.'
//
// Attach similar descriptions to schemes for API keys and OAuth2.

// ---------- 4. Hiding internal endpoints from public docs ----------
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';

// Exclude the whole controller (e.g. an admin-only controller).
@ApiExcludeController()
@Controller('admin/users')
export class AdminUsersController {}

// Exclude one endpoint (e.g. a debug endpoint).
@Controller('products')
export class ProductsController {
  @ApiExcludeEndpoint()
  @Get('_debug/cache-stats')
  debugCache() {}
}

// ---------- 5. Two Swagger UIs: public and internal ----------
// main.ts
import { SwaggerModule } from '@nestjs/swagger';

// Public docs: only client-facing controllers.
const publicDoc = SwaggerModule.createDocument(app, config, {
  include: [ProductsModule, OrdersModule, AuthModule, HealthModule],
});
SwaggerModule.setup('docs', app, publicDoc);

// Internal docs: everything, served behind auth at a different path.
const internalDoc = SwaggerModule.createDocument(app, config);
// Serve behind an auth guard. In practice this is often a
// separate deployment or a route protected by an internal gateway.
// SwaggerModule.setup('internal/docs', app, internalDoc);

// ---------- 6. Match documentation to guards ----------
// Rule of thumb: every endpoint that has a guard should have a
// matching @ApiBearerAuth / @ApiSecurity decorator.
// Every endpoint that has @ApiBearerAuth should have a guard.
// Otherwise the docs and the runtime disagree.

// A small test to enforce consistency:
//
// it('every guarded route is documented with security', async () => {
//   const document = SwaggerModule.createDocument(app, config);
//   for (const [path, methods] of Object.entries(document.paths)) {
//     for (const [method, op] of Object.entries(methods)) {
//       const hasSecurity = !!op.security && op.security.length > 0;
//       const hasGuard = guardedRouteList.has(\`\${method.toUpperCase()} \${path}\`);
//       expect(hasGuard === hasSecurity).toBe(true);
//     }
//   }
// });

// ---------- 7. Example: fake tokens and fake data ----------
// NEVER put real tokens or real PII in examples.
//
// Good:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.EXAMPLE...
//   customer: { email: 'user@example.com' }
//
// Bad:
//   Authorization: Bearer eyJhbGciOi...(a real, valid token)...
//   customer: { email: 'ada.lovelace@realamazoncustomer.com' }
      ` },
      keyTakeaways: [
        "OpenAPI security schemes describe how the API is authenticated: bearer, API key, OAuth2, or OpenID Connect.",
        "Declare schemes in `DocumentBuilder` and reference them with `@ApiBearerAuth`, `@ApiSecurity`, or `@ApiOAuth2`.",
        "Swagger UI shows an 'Authorize' button once a security scheme is declared, letting clients try endpoints.",
        "Explicitly mark public endpoints with `@ApiSecurity([])` if a global security requirement is set.",
        "Document authorization rules (roles, ownership, scopes) in `@ApiOperation` descriptions.",
        "Hide internal and admin endpoints from public Swagger UIs with `@ApiExcludeController` and `@ApiExcludeEndpoint`.",
        "Never put real tokens, credentials, or PII in examples — always use obvious placeholders.",
      ],
      commonMistakes: [
        "<b>No security scheme declared.</b> Clients cannot authenticate via Swagger UI. Every 'Try it out' returns 401 with no guidance.",
        "<b>Wrong scheme type.</b> Declaring `apiKey` when the API expects a bearer token. Clients send the wrong header and fail.",
        "<b>Public endpoints not marked.</b> If you set a global security requirement, public endpoints are wrongly documented as requiring auth.",
        "<b>Guards and docs out of sync.</b> An endpoint has a guard but no security decorator, or vice versa. Clients see different behavior than the docs promise. Test for consistency.",
        "<b>Publishing internal endpoints.</b> Admin and debug routes appear in public Swagger UI, expanding the attack surface. Exclude or protect them.",
        "<b>Real tokens in examples.</b> A leaked credential in a public doc is a serious security incident. Always use obvious placeholder tokens.",
        "<b>Missing scope documentation.</b> OAuth2 clients cannot know which scopes to request. Document scopes in the scheme.",
        "<b>Publishing internal server URLs.</b> The `servers` array exposes internal hostnames. Only publish public URLs.",
      ],
      quiz: [
        {
          question:
            "Which decorator marks a controller as requiring a bearer token in Swagger?",
          options: [
            "`@ApiAuth()`",
            "`@ApiBearerAuth('access-token')` — the name matching the scheme declared in DocumentBuilder.",
            "`@UseGuards(JwtAuthGuard)`",
            "`@ApiSecurityHeader()`",
          ],
          correctIndex: 1,
          explanation:
            "`@ApiBearerAuth('access-token')` associates the route with the bearer security scheme declared in the DocumentBuilder. Guards enforce the auth at runtime; the decorator documents it.",
        },
        {
          question:
            "You set a global `addSecurityRequirements('access-token')`. How do you mark an endpoint as public?",
          options: [
            "Remove the guard.",
            "Add `@ApiSecurity([])` to the endpoint to override the global requirement.",
            "Use `@ApiExcludeEndpoint()`.",
            "Set `security: false` in the controller.",
          ],
          correctIndex: 1,
          explanation:
            "`@ApiSecurity([])` on the operation overrides the global security requirement, documenting that no auth is needed. Removing the guard is not enough — the docs would still claim auth is required.",
        },
        {
          question:
            "Why is it dangerous to publish a Swagger UI that includes admin endpoints?",
          options: [
            "Because it slows down the server.",
            "Because it exposes your full attack surface and internal capabilities to anyone who finds the docs URL.",
            "Because Swagger UI cannot render admin endpoints.",
            "Because it breaks caching.",
          ],
          correctIndex: 1,
          explanation:
            "Swagger UI lists every endpoint with its shape, request parameters, and responses. Publishing admin/debug endpoints reveals internal capabilities to potential attackers. Exclude or host behind auth.",
        },
        {
          question:
            "Which OpenAPI security scheme type should you declare for a JWT-based API?",
          options: [
            "`type: 'apiKey'`",
            "`type: 'http', scheme: 'bearer', bearerFormat: 'JWT'`",
            "`type: 'oauth2'`",
            "`type: 'openIdConnect'`",
          ],
          correctIndex: 1,
          explanation:
            "JWT is typically sent in the `Authorization: Bearer <token>` header. The correct OpenAPI representation is `type: 'http'`, `scheme: 'bearer'`, with `bearerFormat: 'JWT'` for documentation clarity.",
        },
      ],
    },
    {
      id: "day-50-lesson-5",
      title: "API Documentation as a Production Artifact",
      durationMinutes: 22,
      explanation: `
<b>By now you have a NestJS API with beautifully decorated controllers and DTOs.</b> Swagger UI renders it. Client developers love it. But if the spec only ever powers a "Try it out" page, you are leaving most of its value on the table.

In production, the OpenAPI document is not just documentation — it is a <b>machine-readable contract</b> that other tools consume. A well-generated spec is the seed for client SDKs, mock servers, contract tests, gateway configuration, and even parts of your CI pipeline. This lesson is about treating the spec as a production artifact, not a nice-to-have.

<b>Value 1: Generated client SDKs.</b> Every consumer of your API benefits from a typed SDK generated from the spec. Tools like <b>openapi-generator</b>, <b>orval</b>, and <b>openapi-typescript</b> take an OpenAPI document and produce client code for TypeScript, Python, Go, Java, and more.

For a TypeScript frontend:

\`\`\`bash
npx openapi-typescript http://localhost:3000/docs-json -o src/api/types.ts
# or
npx orval --input http://localhost:3000/docs-json --output src/api/client.ts
\`\`\`

The result is a typed client with methods like \`client.products.findAll({ page, limit })\` — with full type-safety based on the spec. If the server changes shape, regenerating the SDK makes the frontend compile-error wherever the old shape was used. This is enormous for coordination.

<b>Value 2: Mock servers for the frontend.</b> Frontend and backend teams often move at different speeds. With an OpenAPI spec, you can spin up a mock server that responds to every endpoint with example data derived from the spec. Tools like <b>Prism</b> do this in one command:

\`\`\`bash
npx @stoplight/prism-cli mock openapi.json --port 4010
\`\`\`

The frontend team codes against the mock while the backend is still being built. When the real API is ready, they swap the base URL and everything continues to work because the shapes match.

<b>Value 3: Contract testing.</b> Contract tests verify that the running server actually matches the published spec. This catches drift instantly. <b>Schemathesis</b> and <b>Dredd</b> do this by sending requests based on the spec and checking that responses match.

For a CI pipeline, a lightweight approach is a custom script that fetches \`/docs-json\` from a running instance and compares it against a baseline committed to the repository. If the spec changed, the developer must update the baseline — a deliberate review step. This makes every API change visible in code review.

<b>Value 4: API gateway configuration.</b> API gateways (Kong, AWS API Gateway, Apigee, Envoy) can consume OpenAPI specs to auto-generate routes, validate requests, apply rate limits, and enforce request shapes. The spec becomes the source of truth for gateway configuration, avoiding separate hand-maintained configs.

<b>Value 5: Documentation sites.</b> Swagger UI is not the only renderer. <b>Redoc</b> produces a beautiful, three-panel layout that many teams prefer for public APIs. <b>Stoplight</b>, <b>Scalar</b>, and <b>RapiDoc</b> are other renderers. Since they all consume the same OpenAPI document, you can offer multiple docs views without duplicating content.

\`\`\`html
<!-- Render the same OpenAPI doc with Redoc -->
<redoc spec-url="https://api.example.com/docs-json"></redoc>
<script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
\`\`\`

<b>Value 6: Change detection and versioning.</b> Diff two OpenAPI documents and you get a precise, machine-readable changelog. Tools like <b>openapi-diff</b> classify changes as breaking or non-breaking:

\`\`\`bash
npx openapi-diff v1.json v2.json
\`\`\`

This is invaluable for versioning decisions. Instead of debating whether a change is breaking, you run the diff and know. If a field's type changed from string to integer, it is breaking. If a new optional field was added, it is not. This is exactly the kind of analysis that powers deprecation planning (Day 49).

<b>Value 7: Documentation CI checks.</b> A handful of automated checks keep the spec healthy:
- <b>No empty schemas.</b> Every response type is annotated.
- <b>Every operation has a summary and description.</b> Otherwise the docs read as incomplete.
- <b>Every response has at least one example.</b>
- <b>No deprecated endpoints without a sunset date.</b>
- <b>Spec passes OpenAPI validator.</b> Catches syntax errors and broken references.
- <b>Spec diff is intentional.</b> Any change to the spec must be reflected in a committed baseline file (a "golden spec"). If a developer changes an endpoint without updating the golden spec, the CI fails.

These checks stop API drift before it reaches production.

<b>Value 8: Runtime request validation.</b> Some teams wire the OpenAPI spec into the request pipeline, rejecting requests that do not match the schema before they reach the controller. NestJS already does this with \`ValidationPipe\`, but the spec becomes a second layer of defense and can be consumed by external gateways.

<b>Value 9: Analytics and governance.</b> With a stable spec, you can:
- Track which endpoints are called and which versions are used (Day 49).
- Enforce naming conventions in CI (e.g. all operations must have tags and operationIds).
- Publish a public API catalog for your organization.
- Feed the spec into a developer portal (Backstage, ReadMe, Redocly).

<b>Where the spec lives in a production repo.</b> Two common patterns:

<b>Pattern 1: Generated on-the-fly.</b> The spec is regenerated on every request from \`/docs-json\`. Simple, always accurate, no files to maintain. Slight overhead per request, usually negligible.

<b>Pattern 2: Committed golden spec.</b> The spec is generated during CI and committed to the repository (\`openapi.json\`). This gives you:
- A stable file for review and diffing.
- A source of truth for client generators (which run at build time, not at runtime).
- A place to see exactly what changed between versions.

Most mature teams do a hybrid: generate at runtime for Swagger UI, and also commit a golden spec for CI diffing and SDK generation.

<b>Versioning the spec.</b> The OpenAPI document includes an \`info.version\` field. This should match your API's version (e.g. \`1.0.0\`). For URI-versioned APIs (Day 49), you usually have one spec per version:

\`\`\`
/docs/v1/docs-json
/docs/v2/docs-json
\`\`\`

Each spec contains only the endpoints for that version. Client generators for v1 and v2 produce separate SDKs. Deprecation headers appear in v1's spec but not v2's. This is what a versioned API's docs look like in production.

<b>What can go wrong?</b>
- <b>Spec drift from code.</b> Hand-maintained YAML falls out of sync. Code-first generation prevents this — but only if you regenerate on every deploy.
- <b>Missing annotations slip through CI.</b> A new endpoint without \`@ApiOperation\` produces an empty summary. Add CI checks for minimum quality.
- <b>Broken references.</b> A DTO referenced in a response no longer exists. The spec fails to generate or contains dangling \`$ref\`s. Add an OpenAPI validator to CI.
- <b>SDK generator crashes on union types.</b> Some generators struggle with \`oneOf\`/\`anyOf\`. Test your generator against the spec and choose one that handles your types.
- <b>Golden spec never updated.</b> Developers commit code without regenerating the golden spec. The CI diff misses the change. Force regeneration as a required step.
- <b>Public docs leak internal endpoints.</b> Use \`@ApiExcludeController\` and separate public/internal Swagger UIs (lesson 4).
- <b>Committing real tokens in examples.</b> Same rule as lesson 4: always use placeholders, never real credentials, never real PII.
- <b>Publishing docs with a wrong server URL.</b> The \`servers\` array points to localhost in production. Configure per environment.
- <b>No CI enforcement.</b> Without automated checks, quality degrades over time. What gets measured gets maintained.

<b>How this appears in production.</b> A mature API team typically has:
- A NestJS backend generating an OpenAPI document.
- A committed \`openapi.json\` in the repo, regenerated in CI.
- A CI check that diffs the new spec against the golden spec and flags breaking changes for review.
- A nightly job that generates client SDKs for TypeScript, Python, and Go and publishes them to their respective registries.
- A Prism-based mock server in the frontend repository, driven by the committed spec.
- A public docs site (Redoc or similar) served from a CDN, backed by the spec.
- Schemathesis contract tests running against staging on every deploy.
- A developer portal listing all APIs and their specs.

This is what it means to treat the spec as a production artifact. It is not a nice README — it is a piece of infrastructure that other parts of your engineering organization build on. Every improvement to it multiplies across tools.
      `,
      diagram: `
OpenAPI as a Production Artifact

   NestJS code (decorators + DTOs)
          |
          |  CI: generate spec
          v
   openapi.json (committed golden spec)
          |
          +--> CI: diff vs baseline       -> flag breaking changes
          |
          +--> CI: generate client SDKs   -> publish to registries
          |     (TypeScript, Python, Go)
          |
          +--> Mock server (Prism)        -> used by frontend team
          |
          +--> Contract tests             -> run vs staging
          |     (Schemathesis, Dredd)
          |
          +--> Public docs site           -> CDN, Redoc/Stoplight
          |
          +--> API gateway config         -> routes, validation, limits
          |
          +--> Developer portal           -> catalog of all APIs
          |
          +--> Change analytics           -> breaking vs non-breaking

Golden spec + CI check:
  1. Developer edits code, runs \`npm run openapi:generate\`
  2. Commits updated \`openapi.json\`
  3. CI regenerates, diffs against committed file
  4. If diff is intentional -> review and merge
  5. If diff is accidental -> CI fails

Per version:
  docs/v1/docs-json  ->  spec for v1 only
  docs/v2/docs-json  ->  spec for v2 only
      `,
      codeExample: { title: "Example", code: `
// ============================================
// OPENAPI AS A PRODUCTION ARTIFACT
// ============================================

// ---------- 1. Generate the spec during build (not just at runtime) ----------
// scripts/generate-openapi.ts
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from '../src/app.module';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Shop API')
    .setVersion(process.env.API_VERSION ?? '1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addServer('https://api.example.com/v1', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Commit this file. CI uses it as the golden spec for diffs and SDK generation.
  writeFileSync('openapi.json', JSON.stringify(document, null, 2));

  await app.close();
  process.exit(0);
}
generate();

// package.json
// {
//   "scripts": {
//     "openapi:generate": "ts-node scripts/generate-openapi.ts",
//     "openapi:check": "npm run openapi:generate && git diff --exit-code openapi.json"
//   }
// }
//
// \`npm run openapi:check\` fails if the generated spec differs from
// the committed one. This forces developers to commit spec changes
// alongside code changes.

// ---------- 2. CI pipeline (GitHub Actions sketch) ----------
// .github/workflows/api.yml
//
// name: API
// on: [push, pull_request]
// jobs:
//   spec:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - uses: actions/setup-node@v4
//         with: { node-version: 20 }
//       - run: npm ci
//       - run: npm run openapi:generate
//       - name: Check golden spec
//         run: git diff --exit-code openapi.json
//       - name: Validate OpenAPI
//         run: npx @redocly/cli lint openapi.json
//       - name: Diff vs main
//         if: github.event_name == 'pull_request'
//         run: |
//           git fetch origin main
//           git show origin/main:openapi.json > /tmp/old.json
//           npx openapi-diff /tmp/old.json openapi.json || true

// ---------- 3. Generate a typed frontend client ----------
// Using openapi-typescript (light, generates .d.ts types)
//   npx openapi-typescript ./openapi.json -o src/api/schema.d.ts
//
// Using orval (fetches + generates a client with hooks)
//   npx orval --input ./openapi.json --output src/api/client.ts
//
// Example generated client usage:
//   import { getProducts } from './api/client';
//   const res = await getProducts({ page: 1, limit: 20 });
//   res.items.forEach(p => console.log(p.name));
//
// If the backend changes a field name, \`npm run api:generate\` in the
// frontend repo surfaces a TypeScript compile error at every call site.

// ---------- 4. Mock server for the frontend ----------
// Run Prism against the committed spec:
//   npx @stoplight/prism-cli mock openapi.json --port 4010
//
// The frontend can point VITE_API_URL at http://localhost:4010 and
// develop against examples from the spec, before the backend is ready.

// ---------- 5. Contract testing against a running instance ----------
// Simple fetch of the live spec and diff against the committed baseline.
// test/contract.spec.ts
import axios from 'axios';
import { readFileSync } from 'fs';

describe('OpenAPI contract', () => {
  it('running server matches the committed spec', async () => {
    const live = (await axios.get('http://localhost:3000/docs-json')).data;
    const golden = JSON.parse(readFileSync('openapi.json', 'utf-8'));

    // A shallow equality is often enough; for real projects use openapi-diff
    // to classify breaking vs non-breaking changes.
    expect(live.info.version).toEqual(golden.info.version);
    expect(Object.keys(live.paths).sort()).toEqual(Object.keys(golden.paths).sort());
  });
});

// ---------- 6. Render with Redoc instead of / in addition to Swagger UI ----------
// You can serve the same openapi.json with different renderers.
// public/docs.html
//
// <!doctype html>
// <html>
//   <head><title>Shop API</title></head>
//   <body>
//     <redoc spec-url="/docs-json"></redoc>
//     <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
//   </body>
// </html>
//
// Now:
//   /docs        -> Swagger UI (interactive "Try it out")
//   /docs.html   -> Redoc (beautiful 3-column reference)

// ---------- 7. Detect breaking changes with openapi-diff ----------
// npx openapi-diff old.json new.json
//
// Example output:
//   Breaking changes:
//     - GET /products/{id}: removed response 200
//     - GET /products: changed response type from array to object
//   Non-breaking changes:
//     - POST /products: added optional property 'thumbnail'
//
// Use this in CI to gate merges. If a breaking change is present
// without a version bump, fail the pull request.

// ---------- 8. Docs CI checks (lint + quality) ----------
// Add custom rules using a small script or a tool like redocly lint.
//
// .redocly.yaml
// rules:
//   operation-operationId: error
//   operation-summary: error
//   operation-description: warn
//   no-empty-servers: error
//   no-invalid-media-type-examples: error
//
// Then in CI:
//   npx @redocly/cli lint openapi.json

// ---------- 9. Per-version specs ----------
// For URI-versioned APIs (Day 49), generate one spec per version.
// Each spec contains only the endpoints for that version.
//
// const v1Doc = SwaggerModule.createDocument(app, v1Config, {
//   include: [UsersV1Module, ProductsV1Module],
// });
// writeFileSync('openapi.v1.json', JSON.stringify(v1Doc, null, 2));
//
// const v2Doc = SwaggerModule.createDocument(app, v2Config, {
//   include: [UsersV2Module, ProductsV2Module],
// });
// writeFileSync('openapi.v2.json', JSON.stringify(v2Doc, null, 2));
//
// CI diffs each spec separately. Client generators produce one SDK
// per version. Deprecation headers show up in v1's spec, not v2's.

// ---------- 10. Automate SDK publishing ----------
// On every merge to main:
//   1. Regenerate spec
//   2. Diff against main's spec
//   3. If changed: regenerate SDKs
//        openapi-generator-cli generate -i openapi.json -g typescript-fetch -o sdk-ts
//        openapi-generator-cli generate -i openapi.json -g python -o sdk-py
//   4. Publish new SDK versions to npm / PyPI
//   5. Notify client teams via changelog
      ` },
      keyTakeaways: [
        "Treat the OpenAPI document as a machine-readable contract, not just documentation.",
        "Generate the spec in CI and commit a golden `openapi.json` so changes are visible in code review.",
        "Use the spec to generate typed client SDKs (openapi-typescript, orval, openapi-generator).",
        "Spin up a Prism mock server so frontend teams can code against the spec before the backend is ready.",
        "Run contract tests (Schemathesis, Dredd) against staging to catch drift between code and docs.",
        "Diff specs with openapi-diff to classify breaking vs non-breaking changes — feed this into versioning decisions.",
        "Publish per-version specs (`openapi.v1.json`, `openapi.v2.json`) for URI-versioned APIs.",
        "Enforce spec quality in CI with a linter (redocly lint) and required annotations.",
      ],
      commonMistakes: [
        "<b>Only running Swagger UI in development.</b> The spec has value in CI, SDK generation, mocking, and contract testing. Wire it into the pipeline.",
        "<b>Not committing the generated spec.</b> Without a golden `openapi.json`, you cannot diff changes, you cannot review API changes in PRs, and CI cannot detect drift.",
        "<b>Ignoring breaking-change detection.</b> A spec diff is a precise tool for classifying breaking changes. Without it, teams guess and argue.",
        "<b>Missing quality checks.</b> Endpoints ship without summaries, descriptions, or examples. Add CI rules to enforce minimum quality.",
        "<b>Committing only one version's spec.</b> Multi-version APIs need one spec per version so client generators and docs do not confuse them.",
        "<b>Not regenerating client SDKs on spec changes.</b> Stale SDKs drift from the server and cause subtle bugs. Automate regeneration on merge to main.",
        "<b>Publishing docs with sensitive URLs.</b> Internal service hostnames in the `servers` array leak architecture. Use public URLs only.",
        "<b>No contract tests.</b> Without them, the code can change and the spec can drift silently. A single nightly contract test catches this class of bug early.",
        "<b>Skipping the OpenAPI validator.</b> Broken `$ref`s and syntax errors can silently corrupt your docs. Add `npx @redocly/cli lint` to CI.",
      ],
      quiz: [
        {
          question:
            "Why is it valuable to commit a generated `openapi.json` to the repository?",
          options: [
            "Because Git requires it.",
            "Because it gives you a golden spec for CI diffing, client SDK generation, and reviewing API changes in code review.",
            "Because the server needs it to run.",
            "Because it reduces database size.",
          ],
          correctIndex: 1,
          explanation:
            "A committed golden spec is the source of truth for CI. It lets you diff API changes, flag breaking changes, generate client SDKs at build time, and review every endpoint change as part of a pull request.",
        },
        {
          question:
            "You want your frontend team to start work before the backend is finished. Which OpenAPI-powered tool helps most?",
          options: [
            "A production Swagger UI.",
            "A Prism mock server that serves example responses derived from the spec.",
            "A contract test suite.",
            "An SDK generator.",
          ],
          correctIndex: 1,
          explanation:
            "Prism (and similar tools) reads the OpenAPI document and serves mock responses for every endpoint, using the examples and schemas in the spec. The frontend can develop against it while the real backend is being built.",
        },
        {
          question:
            "What does a tool like `openapi-diff` provide that a plain text diff of two specs does not?",
          options: [
            "It runs faster.",
            "It classifies changes as breaking or non-breaking, which helps you decide whether a version bump is needed.",
            "It renders a UI.",
            "It validates syntax.",
          ],
          correctIndex: 1,
          explanation:
            "`openapi-diff` understands the semantic meaning of changes. Removing a field is breaking; adding an optional field is not. This classification feeds directly into versioning and deprecation decisions (Day 49).",
        },
        {
          question:
            "Which of these is a good CI check for an OpenAPI-based project?",
          options: [
            "Only run the tests once per week.",
            "Regenerate the spec, diff against the committed golden spec, and fail if the diff is not intentionally committed.",
            "Publish the spec only in production.",
            "Skip the spec when there is no documentation change.",
          ],
          correctIndex: 1,
          explanation:
            "Enforcing that the committed spec matches the generated one guarantees that API changes are always reviewed and intentional. Accidental drift becomes impossible.",
        },
        {
          question:
            "You have a URI-versioned API with /v1 and /v2. How many OpenAPI documents should you typically expose?",
          options: [
            "Exactly one, and it includes every version.",
            "One per version (e.g. `/docs/v1/docs-json` and `/docs/v2/docs-json`), each containing only that version's endpoints.",
            "One per endpoint.",
            "Zero — versioned APIs do not use OpenAPI.",
          ],
          correctIndex: 1,
          explanation:
            "One spec per version keeps documentation and generated SDKs aligned with each version's contract. Clients generating an SDK for v1 should not see v2 endpoints, and vice versa.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question:
        "What is OpenAPI?",
      options: [
        "A NestJS module for building APIs.",
        "A specification (JSON/YAML) for describing HTTP APIs.",
        "A database engine.",
        "A protocol for authentication.",
      ],
      correctIndex: 1,
      explanation:
        "OpenAPI is a language-agnostic specification for describing APIs — endpoints, schemas, security, and examples. Tools consume the spec to generate docs, SDKs, mocks, and tests.",
    },
    {
      question:
        "What is the relationship between Swagger and OpenAPI?",
      options: [
        "They are different specifications.",
        "Swagger was the original name; it was renamed OpenAPI in 2016. 'Swagger' now refers to the tooling (Swagger UI, Swagger Editor).",
        "Swagger is the enterprise version.",
        "Swagger is a language binding for OpenAPI.",
      ],
      correctIndex: 1,
      explanation:
        "The spec is OpenAPI. The most popular renderer is Swagger UI. People often use 'Swagger' to refer to either, but the distinction is worth knowing.",
    },
    {
      question:
        "How does NestJS generate an OpenAPI document?",
      options: [
        "By reading a hand-written YAML file.",
        "By scanning decorated controllers and DTOs, then producing the spec at runtime or during CI.",
        "By importing an API gateway configuration.",
        "By running a separate Node process.",
      ],
      correctIndex: 1,
      explanation:
        "`@nestjs/swagger` reads decorators (`@ApiTags`, `@ApiOperation`, `@ApiProperty`, `@ApiResponse`) on controllers and DTOs and generates an OpenAPI document from the code. This code-first approach avoids spec drift.",
    },
    {
      question:
        "Which decorator documents a DTO field in the OpenAPI schema?",
      options: [
        "`@IsString()`",
        "`@ApiProperty()`",
        "`@Column()`",
        "`@Expose()`",
      ],
      correctIndex: 1,
      explanation:
        "`@ApiProperty()` contributes the field to the OpenAPI schema. `@IsString()` is a class-validator decorator that enforces validation at runtime. Use both together: one documents, one enforces.",
    },
    {
      question:
        "What is the primary purpose of `@ApiResponse({ status, description, type })`?",
      options: [
        "To send the response.",
        "To document a specific HTTP status and its response shape in the spec.",
        "To validate the response body.",
        "To set the HTTP status code at runtime.",
      ],
      correctIndex: 1,
      explanation:
        "`@ApiResponse` (and its shortcuts like `@ApiOkResponse`, `@ApiNotFoundResponse`) documents a response for the OpenAPI spec. The actual runtime status is set by the controller or an exception.",
    },
    {
      question:
        "Why is a consistent `ErrorDto` shape across an entire API valuable?",
      options: [
        "Because OpenAPI requires it.",
        "Because clients can implement one error handler instead of a different one per endpoint.",
        "Because it makes errors smaller.",
        "Because it hides errors from clients.",
      ],
      correctIndex: 1,
      explanation:
        "A single error envelope makes clients simpler and more robust. Consistency across endpoints is one of the biggest quality signals of a mature API.",
    },
    {
      question:
        "Which OpenAPI security scheme should you use for a JWT-based API?",
      options: [
        "`type: 'apiKey'`",
        "`type: 'http', scheme: 'bearer', bearerFormat: 'JWT'`",
        "`type: 'oauth2'`",
        "`type: 'cookie'`",
      ],
      correctIndex: 1,
      explanation:
        "JWT bearer tokens are sent in the `Authorization: Bearer <token>` header. The correct OpenAPI representation is `http` with `scheme: 'bearer'` and `bearerFormat: 'JWT'`.",
    },
    {
      question:
        "You set a global security requirement in `DocumentBuilder`. How do you mark one endpoint as public?",
      options: [
        "Remove the auth guard.",
        "Add `@ApiSecurity([])` on that endpoint to override the global requirement.",
        "Use `@ApiExcludeEndpoint()`.",
        "Set `info.public: true` in the config.",
      ],
      correctIndex: 1,
      explanation:
        "`@ApiSecurity([])` overrides the global security requirement for that operation, telling the spec that no auth is required. Do not rely on removing the guard — the docs would still claim auth is needed.",
    },
    {
      question:
        "Why should you not put a real API token in a Swagger example?",
      options: [
        "Because Swagger UI cannot display tokens.",
        "Because Swagger UI is often public, and a real token in the docs is a leaked credential.",
        "Because the spec cannot store long strings.",
        "Because it slows down the docs.",
      ],
      correctIndex: 1,
      explanation:
        "Example tokens in a public spec are visible to anyone. Always use obvious placeholders like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.EXAMPLE...`. The same rule applies to real customer data.",
    },
    {
      question:
        "You want to detect breaking changes between two API versions. Which tool helps?",
      options: [
        "Swagger UI.",
        "`openapi-diff`, which classifies changes as breaking or non-breaking.",
        "A unit test.",
        "The Prisma CLI.",
      ],
      correctIndex: 1,
      explanation:
        "`openapi-diff` compares two OpenAPI documents and reports the differences semantically — removed fields are breaking, added optional fields are not. This informs whether a new API version is needed (Day 49).",
    },
    {
      question:
        "What does committing a golden `openapi.json` to the repository enable?",
      options: [
        "Faster requests.",
        "CI diffing, client SDK generation at build time, and reviewing API changes in pull requests.",
        "Smaller database size.",
        "Automatic authentication.",
      ],
      correctIndex: 1,
      explanation:
        "A committed spec is a stable, reviewable artifact. CI can diff it, SDK generators can consume it at build time, and reviewers can see every API change as part of a pull request.",
    },
    {
      question:
        "What is a Prism mock server used for in an OpenAPI workflow?",
      options: [
        "Serving production traffic.",
        "Serving fake responses based on the spec so frontend teams can develop before the backend is ready.",
        "Validating JWT tokens.",
        "Storing user sessions.",
      ],
      correctIndex: 1,
      explanation:
        "Prism reads the OpenAPI spec and responds to requests with example data. It is a way for frontend teams to code against the contract while the backend is being built.",
    },
    {
      question:
        "Which of these is a good CI check for an OpenAPI project?",
      options: [
        "Run the tests once per week.",
        "Regenerate the spec, diff against the committed golden spec, and run an OpenAPI linter.",
        "Publish the docs only in production.",
        "Skip generating the spec on releases.",
      ],
      correctIndex: 1,
      explanation:
        "Regenerating + diffing + linting catches accidental drift, broken `$ref`s, and missing required annotations. It makes API changes visible and intentional.",
    },
    {
      question:
        "Which renderer is commonly used as an alternative to Swagger UI for public documentation?",
      options: [
        "Prism",
        "Redoc",
        "Schemathesis",
        "openapi-generator",
      ],
      correctIndex: 1,
      explanation:
        "Redoc renders the same OpenAPI document with a clean, three-column layout many teams prefer for public docs. Other alternatives include Stoplight, Scalar, and RapiDoc.",
    },
    {
      question:
        "You have a URI-versioned API with /v1 and /v2. How should OpenAPI documents be organized?",
      options: [
        "One spec containing both versions.",
        "One spec per version (`openapi.v1.json`, `openapi.v2.json`), each containing only that version's endpoints.",
        "One spec per endpoint.",
        "No spec — versioned APIs do not use OpenAPI.",
      ],
      correctIndex: 1,
      explanation:
        "Per-version specs keep documentation and generated SDKs aligned. A v1 client should not see v2 endpoints in its generated SDK, and vice versa.",
    },
  ],
  project: {
    name: "Document a Versioned NestJS E-Commerce API with OpenAPI and Wire It Into CI",
    goal:
      "Build a fully documented, versioned NestJS API where the OpenAPI spec is generated from code, serves interactive docs, feeds client SDK generation, drives a mock server, and is diffed in CI to catch breaking changes. Combine everything from Day 50 with the versioning patterns from Day 49.",
    brief:
      "You are the API lead for an e-commerce platform. You need to ship a public API with two versions (v1 and v2), complete and accurate OpenAPI documentation, security schemes for both bearer tokens and API keys, examples on every response, a committed golden spec, CI checks that detect breaking changes, and generated TypeScript types for an internal frontend. This is the kind of setup a serious platform team relies on every day.",
    steps: [
      "Create a NestJS project. Add `@nestjs/swagger`, `@nestjs/typeorm`, `pg`, `class-validator`, `class-transformer`, and `@nestjs/config`. Add dev dependencies for CI: `@redocly/cli`, `openapi-diff`, `openapi-typescript`.",
      "Define a `Product` entity and a `User` entity. Implement `ProductsService` with `findAll`, `findOne`, `create`, and `update`, and `UsersService` with `findById`. These services are version-agnostic.",
      "Enable URI versioning in `main.ts` with `app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1', prefix: 'v' })`.",
      "Create v1 controllers for products and users. Product v1 returns `{ id, name, price, thumbnail }`. User v1 returns `{ id, name, email }`.",
      "Create v2 controllers. Product v2 adds a `status` field and renames `thumbnail` to `imageUrl`. User v2 splits `name` into `firstName` and `lastName` and adds `status`. Both v2 controllers use the same services as v1.",
      "Create DTOs for every request and response. Every field must have `@ApiProperty` with a `description`, `example`, and appropriate constraints. Use `PartialType`, `OmitType`, and `PickType` where useful. Every input DTO must also have `class-validator` decorators.",
      "Create a central `ErrorDto` and a global `AllExceptionsFilter` that ensures real error responses match the documented shape.",
      "Decorate every endpoint with `@ApiOperation({ summary, description })` and document all common responses with `@ApiXxxResponse` decorators plus examples. Use `applyDecorators` to build a reusable `ApiCommonErrors()` for 401/403/500.",
      "Configure security in `DocumentBuilder`: add `addBearerAuth()` for JWT, `addApiKey()` for an `X-API-Key`, and apply bearer globally. Mark public endpoints with `@ApiSecurity([])`. Mark authenticated controllers with `@ApiBearerAuth('access-token')`.",
      "Add a `DeprecationInterceptor` and a `@Deprecated` decorator (from Day 49) and apply it to v1 controllers. Ensure `Deprecation`, `Sunset`, and `Link` headers appear in the v1 responses and in the v1 OpenAPI spec via `@ApiResponse({ headers: ... })`.",
      "Add a `VERSION_NEUTRAL` health controller and hide any admin endpoints with `@ApiExcludeController()` or `@ApiExcludeEndpoint()`.",
      "Write a `scripts/generate-openapi.ts` that boots the app, generates the spec, and writes `openapi.json`. Add `npm run openapi:generate` and `npm run openapi:check` scripts. Commit `openapi.json`.",
      "Set up two Swagger documents in `main.ts` — `/docs/v1` and `/docs/v2` — each including only the controllers of that version. Set `servers` per environment using env vars.",
      "Add a `redocly.yaml` with lint rules (`operation-summary: error`, `operation-operationId: error`, `no-invalid-media-type-examples: error`) and a CI step that runs `npx @redocly/cli lint openapi.json`.",
      "Add a CI step that runs `npm run openapi:check` and fails if the regenerated spec differs from the committed one.",
      "Add a CI step that diffs the new spec against `origin/main`'s spec using `openapi-diff`, and fails the PR if a breaking change is detected without a version bump.",
      "In a sibling folder (or a frontend repo), run `npx openapi-typescript ./openapi.json -o src/api/types.ts` to generate a TypeScript type module for the frontend. Add `npm run api:generate` to the frontend.",
      "Run a Prism mock server from `openapi.json` and verify that fetching `GET /v1/products` returns example data based on the spec.",
      "Write e2e tests with `supertest`: `GET /v1/products` returns v1 shape with deprecation headers; `GET /v2/products` returns v2 shape with `status` and `imageUrl`; unauthenticated requests to protected endpoints return 401 with the documented `ErrorDto` shape; `/docs-json` includes the bearer security scheme; `/docs/v1` and `/docs/v2` show only the correct endpoints.",
    ],
    acceptance: [
      "`/docs/v1` and `/docs/v2` render Swagger UIs showing only their respective endpoints.",
      "`/docs-json` contains a valid OpenAPI 3.0 document with `securitySchemes` for `access-token` and `api-key`.",
      "Every operation in the spec has a `summary`; every response has an `example`.",
      "The committed `openapi.json` matches `npm run openapi:generate` output (CI `openapi:check` passes).",
      "`npx @redocly/cli lint openapi.json` returns no errors.",
      "`openapi-diff` between `origin/main` and the branch reports no breaking changes if only additive changes were made.",
      "`npx openapi-typescript ./openapi.json` produces a `.d.ts` file that the frontend can import.",
      "Prism serves mock responses for `GET /v1/products` and `GET /v2/products`.",
      "Error responses in the running app match the documented `ErrorDto` shape.",
      "v1 responses carry `Deprecation: true` and `Sunset: <date>` headers; v2 does not.",
      "All e2e tests pass.",
    ],
    stretch: [
      "Add a third version (v3) that introduces cursor-based pagination (from Day 47) and document it separately. Add a per-version golden spec (`openapi.v1.json`, `openapi.v2.json`, `openapi.v3.json`).",
      "Add a nightly CI job that runs `npx openapi-generator-cli generate -i openapi.json -g typescript-fetch -o sdk-ts` and `-g python -o sdk-py`, then publishes each SDK to a registry (npm and PyPI).",
      "Add Schemathesis as a contract test job that runs against staging on every deploy, using the committed `openapi.json`.",
      "Add a public docs page using Redoc (or Scalar) served alongside Swagger UI, and compare the two experiences.",
      "Add an internal-only Swagger UI served behind a bearer-auth guard at `/internal/docs`, containing admin and debug endpoints excluded from the public spec.",
      "Add a rule to the CI pipeline that fails if any endpoint has no `description` on `@ApiOperation`, enforcing high-quality documentation across the team.",
      "Add a `CHANGELOG` job that runs `openapi-diff` between the current and previous release spec and posts the classified changes as a comment on the release PR.",
      "Publish the spec to a developer portal (Backstage, Redocly portal, or ReadMe) and verify it renders correctly alongside other company APIs.",
    ],
  },
};
