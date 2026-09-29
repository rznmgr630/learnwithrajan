import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_13_LESSONS: LessonDay = {
  day: 13,
  title: "DTOs",
  totalMinutes: 110,
  difficulty: "Beginner",
  lessons: [
    {
      id: "dto-basics",
      title: "What is a DTO?",
      durationMinutes: 16,
      explanation: `DTO stands for <b>Data Transfer Object</b>.

The name sounds more complicated than the idea actually is.

A DTO is simply a class that describes <b>what data should move into or out of part of your application</b>.

In NestJS, DTOs are especially useful for HTTP requests.

Imagine that your API has this endpoint:

\`POST /users\`

A client sends:

\`{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}\`

Your controller needs to know what the request body is supposed to contain.

Instead of accepting an arbitrary object, you can create a DTO:

\`CreateUserDto\`

The DTO can describe the expected fields and can also contain validation decorators.

For example:

\`name\` should be a string.

\`email\` should be an email address.

\`password\` should meet a minimum length.

This gives your application a clear contract for incoming data.

A DTO is not the same thing as a database table.

That distinction is extremely important.

Suppose your database user record contains:

- id
- name
- email
- passwordHash
- createdAt
- updatedAt
- deletedAt
- internalStatus

You probably do not want clients to send all of those fields when creating a user.

The client might only be allowed to send:

- name
- email
- password

That is where the DTO becomes useful.

The DTO represents the <b>data your API accepts</b>, while your database entity represents the <b>data your database stores</b>.

Think of a DTO as a boundary.

Data enters your application through the API boundary.

The DTO tells your application what shape that incoming data should have.

For beginners, a good mental model is:

<b>DTO = "What data are we allowing to cross this boundary?"</b>

A DTO can also be used for response data.

For example, your database might contain a user's password hash, but your API response should never expose it.

A response DTO can describe the safe shape that leaves your application.

At a more advanced level, DTOs become part of your application's API contract.

Different operations can have different DTOs:

\`CreateUserDto\`

\`UpdateUserDto\`

\`LoginDto\`

\`UserResponseDto\`

\`AdminUserResponseDto\`

Each one describes a different data contract.

This is much safer than having one giant object that is reused everywhere.`,

      diagram: `Client
   |
   | HTTP JSON
   v
+----------------------+
|      Request DTO     |
|                      |
| name                 |
| email                |
| password             |
+----------+-----------+
           |
           | validated data
           v
+----------------------+
|      Controller      |
+----------+-----------+
           |
           v
+----------------------+
|       Service        |
+----------+-----------+
           |
           v
+----------------------+
|       Entity         |
|                      |
| id                   |
| name                 |
| email                |
| passwordHash         |
| createdAt            |
+----------+-----------+
           |
           v
        Database

DTO = API data contract
Entity = persistence/database model`,

      codeExample: {
        title: "A basic CreateUserDto",
        code: `import {
  IsEmail,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}`,

      },

      keyTakeaways: [
        "DTO means Data Transfer Object.",
        "A DTO describes data that should cross an application boundary.",
        "Request DTOs describe data accepted by an endpoint.",
        "DTOs can contain validation rules.",
        "A DTO is not the same thing as a database entity.",
        "Different operations can have different DTOs.",
        "DTOs help make API contracts explicit.",
      ],

      commonMistakes: [
        "<b>Thinking a DTO is a database table.</b> A DTO describes transferred data; an entity describes persisted data.",
        "<b>Using one DTO for everything.</b> Creating, updating, logging in, and responding can require different data shapes.",
        "<b>Thinking TypeScript types automatically validate HTTP requests.</b> Runtime validation requires actual validation mechanisms such as class-validator with ValidationPipe.",
        "<b>Putting sensitive database fields into response DTOs.</b> A response contract should expose only what the client is allowed to receive.",
      ],

      quiz: [
        {
          question: "What does DTO stand for?",
          options: [
            "Database Transfer Operation",
            "Data Transfer Object",
            "Dynamic Type Object",
            "Data Table Operation",
          ],
          correctIndex: 1,
          explanation:
            "DTO stands for Data Transfer Object.",
        },
        {
          question: "What is a common purpose of a request DTO?",
          options: [
            "Define the data an endpoint accepts",
            "Create a database server",
            "Start NestJS",
            "Replace a controller",
          ],
          correctIndex: 0,
          explanation:
            "A request DTO describes the expected input for an operation.",
        },
      ],
    },

    {
      id: "request-dtos",
      title: "Request DTOs and validating incoming data",
      durationMinutes: 15,
      explanation: `A <b>request DTO</b> describes data that the client is allowed to send to your API.

Let's use a registration endpoint.

The endpoint is:

\`POST /users/register\`

The client sends:

\`{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}\`

A request DTO can describe this contract.

You can then add validation rules.

For example:

\`@IsString()\`

means the value should be a string.

\`@IsEmail()\`

means the value should have a valid email format.

\`@MinLength(8)\`

means the password must contain at least eight characters.

The important thing to understand is that TypeScript alone does not protect your application from bad HTTP input.

A TypeScript declaration such as:

\`name: string\`

helps during development, but HTTP clients can send anything.

A malicious or buggy client can send:

\`{
  "name": 123,
  "email": "not-an-email",
  "password": false
}\`

Your application needs runtime validation.

NestJS's \`ValidationPipe\` is commonly used together with DTO classes and validation decorators.

For example, you can enable it globally:

\`app.useGlobalPipes(new ValidationPipe())\`

Now NestJS can validate incoming DTO data before your controller handler receives it.

In a real application, you will often configure the validation pipe with options such as:

\`whitelist: true\`

This can remove properties that are not part of the DTO.

You may also use:

\`forbidNonWhitelisted: true\`

when you want unexpected properties to cause a validation error instead of silently being removed.

Another useful option is:

\`transform: true\`

which enables transformation behavior supported by Nest's validation pipeline.

The exact validation configuration should match your application's requirements.

The important architectural idea is that the DTO creates a controlled boundary between external input and your internal application logic.

Imagine an admin endpoint:

\`POST /admin/users\`

The client should not be able to send:

\`{
  "role": "super-admin"
}\`

unless the API intentionally allows that field.

A carefully designed DTO helps make the accepted input explicit.

This becomes increasingly important as APIs become larger.

Instead of asking:

"Can the client send this property?"

you can look at the DTO and see the API contract.`,

      diagram: `Client
   |
   | JSON
   | name
   | email
   | password
   v
+-------------------------+
|      Request DTO        |
|                         |
| IsString                |
| IsEmail                 |
| MinLength               |
+------------+------------+
             |
       +-----+-----+
       |           |
    Valid        Invalid
       |           |
       v           v
 Controller     400 Error
       |
       v
    Service`,

      codeExample: {
        title: "Request DTO with ValidationPipe",
        code: `import {
  IsEmail,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// main.ts
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();

// controller
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}`,

      },

      keyTakeaways: [
        "Request DTOs define the input contract of an endpoint.",
        "Validation decorators provide runtime validation when used with the validation pipeline.",
        "TypeScript types alone do not validate external HTTP input.",
        "ValidationPipe is commonly used with request DTOs.",
        "whitelist can help control unexpected properties.",
        "transform can enable transformation of incoming values.",
      ],

      commonMistakes: [
        "<b>Trusting the client.</b> Anything sent by a client should be treated as untrusted input.",
        "<b>Assuming TypeScript validates JSON.</b> TypeScript does not run in the same way at runtime to protect HTTP requests.",
        "<b>Accepting an entire database entity as the request body.</b> This can expose fields that clients should never control.",
        "<b>Using whitelist without understanding its behavior.</b> Decide whether unexpected fields should be stripped or rejected based on your API requirements.",
      ],

      quiz: [
        {
          question: "Why do request DTOs often use class-validator decorators?",
          options: [
            "To validate incoming data at runtime",
            "To create SQL tables",
            "To start NestJS",
            "To replace HTTP",
          ],
          correctIndex: 0,
          explanation:
            "Validation decorators provide runtime validation when used with the appropriate validation pipeline.",
        },
        {
          question: "Why is TypeScript alone not enough to validate request bodies?",
          options: [
            "HTTP clients can send arbitrary runtime data",
            "TypeScript cannot define strings",
            "Controllers cannot receive JSON",
            "NestJS does not support classes",
          ],
          correctIndex: 0,
          explanation:
            "External HTTP data exists at runtime and must be validated at runtime.",
        },
      ],
    },

    {
      id: "response-dtos",
      title: "Response DTOs and controlling what leaves your API",
      durationMinutes: 15,
      explanation: `A request DTO controls what enters your application.

A <b>response DTO</b> controls what your API exposes to the client.

This distinction becomes very important in real applications.

Imagine your database contains this user record:

\`{
  "id": 10,
  "name": "Alice",
  "email": "alice@example.com",
  "passwordHash": "$2b$12$...",
  "resetToken": "abc123",
  "createdAt": "...",
  "updatedAt": "..."
}\`

You should not simply return the entire object from an API endpoint.

The database model may contain internal information that clients do not need and should never see.

Instead, you can define:

\`UserResponseDto\`

with only the fields that the API is supposed to expose.

For example:

\`id\`

\`name\`

\`email\`

\`createdAt\`

The password hash stays inside your application.

The reset token stays inside your application.

This is not just about security.

Response DTOs also give you a stable public API.

Your database may change.

Maybe tomorrow you rename:

\`passwordHash\`

to:

\`credentialHash\`

The client does not need to know about that database change because the response DTO can continue exposing the same public response.

This gives you an important separation:

<b>Internal data model ≠ public API contract.</b>

In a beginner application, you may create a response DTO and manually map a service result into it.

For example:

\`return {
  id: user.id,
  name: user.name,
  email: user.email,
};\`

At a larger scale, you may use serialization features such as NestJS's \`ClassSerializerInterceptor\` and class-transformer decorators.

You can also create dedicated response models for different situations.

For example:

\`UserSummaryDto\`

might contain:

- id
- name
- avatarUrl

while:

\`UserDetailsDto\`

might additionally contain:

- email
- createdAt
- preferences

An admin response might contain additional administrative information.

The important point is that the response should be intentionally designed.

Do not think:

"I already have a database object, so I'll just return it."

Instead ask:

<b>"What information does this API promise to expose?"</b>

That mindset becomes especially important when your application handles passwords, payment information, internal IDs, tokens, permissions, audit information, or private customer data.`,

      diagram: `Database Entity
       |
       | internal fields
       v
+-------------------------+
| User Entity             |
|                         |
| id                      |
| name                    |
| email                   |
| passwordHash            |
| resetToken              |
| internalStatus          |
| createdAt               |
+------------+------------+
             |
             | map / serialize
             v
+-------------------------+
| UserResponseDto         |
|                         |
| id                      |
| name                    |
| email                   |
| createdAt               |
+------------+------------+
             |
             v
           Client

Only intended fields leave the API.`,

      codeExample: {
        title: "A safe response DTO",
        code: `export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  async findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }
}

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}`,

      },

      keyTakeaways: [
        "Response DTOs describe data that your API exposes.",
        "Do not automatically return complete database records.",
        "Response DTOs help prevent sensitive fields from leaking.",
        "They also create a stable public API contract.",
        "Different endpoints can have different response DTOs.",
        "Response DTOs separate public API design from internal database design.",
      ],

      commonMistakes: [
        "<b>Returning passwordHash.</b> Password hashes are internal security data and should not be exposed.",
        "<b>Returning database entities directly everywhere.</b> This couples your API response to your persistence model.",
        "<b>Assuming @Exclude alone solves every data exposure problem.</b> Explicit response shaping can be easier to reason about for sensitive APIs.",
        "<b>Using the same response for normal users and administrators.</b> Different audiences may require different contracts.",
      ],

      quiz: [
        {
          question: "What is a major reason to use a response DTO?",
          options: [
            "Control which data leaves the API",
            "Start the NestJS server",
            "Create a database",
            "Replace guards",
          ],
          correctIndex: 0,
          explanation:
            "Response DTOs help define and control the public data returned by an endpoint.",
        },
        {
          question: "Should a normal user response usually include passwordHash?",
          options: [
            "Yes",
            "Only on GET requests",
            "No",
            "Only in production",
          ],
          correctIndex: 2,
          explanation:
            "Password hashes are sensitive internal data and should not be exposed through normal API responses.",
        },
      ],
    },

    {
      id: "dto-vs-entity",
      title: "DTO vs Entity: two different jobs",
      durationMinutes: 15,
      explanation: `One of the most common beginner mistakes in backend development is treating a DTO and an entity as the same thing.

They are related, but they solve different problems.

A <b>DTO</b> describes data being transferred.

An <b>Entity</b> normally describes data that is persisted in a database when using an ORM that uses the entity concept.

Think about a user registration flow.

The client sends:

\`{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}\`

That is request data.

You might represent it with:

\`CreateUserDto\`

But your database might store:

\`User\`

with:

- id
- name
- email
- passwordHash
- createdAt
- updatedAt

Notice something important:

The DTO contains a plain password because that is what the registration endpoint accepts.

The entity should not store that plain password.

The service should hash the password before persistence.

So the flow becomes:

\`CreateUserDto → Service → User Entity → Database\`

The DTO and entity have different responsibilities.

The DTO answers:

<b>"What can the client send?"</b>

The entity answers:

<b>"What does our persistence model store?"</b>

The response DTO answers:

<b>"What are we willing to send back?"</b>

That gives us three different shapes:

\`Request DTO → Entity → Response DTO\`

These shapes can look similar in a tiny application, but they often become very different as the application grows.

Imagine an e-commerce product.

The API might allow the client to send:

\`CreateProductDto\`

with:

- name
- description
- price
- categoryId

The database entity might contain:

- id
- name
- description
- priceInCents
- categoryId
- inventoryCount
- internalCost
- createdAt
- updatedAt

The response DTO might contain:

- id
- name
- description
- price
- category
- availability

The internal cost should not be returned to customers.

The database inventory count may not be exposed directly either.

At an advanced level, separating DTOs from entities also makes it easier to change your persistence technology.

For example, your application might move from one ORM to another.

If your public API is tightly coupled to ORM entities, that migration can affect many parts of the application.

If DTOs define your API boundary, the persistence implementation can change behind that boundary.

This is one of the reasons DTOs are more than just validation classes.

They are part of good application architecture.`,

      diagram: `                 API Boundary

Client
  |
  v
CreateUserDto
  |
  | validate
  v
Controller
  |
  v
Service
  |
  | hash password
  | apply business rules
  v
User Entity
  |
  v
Database


Database
  |
  v
User Entity
  |
  | map safe fields
  v
UserResponseDto
  |
  v
Client

Three different responsibilities:
Request DTO = input contract
Entity      = persistence model
Response DTO = output contract`,

      codeExample: {
        title: "DTO, service, and entity working together",
        code: `// Request DTO
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// Entity
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;
}

// Service
@Injectable()
export class UsersService {
  async create(dto: CreateUserDto) {
    const passwordHash = await hashPassword(
      dto.password,
    );

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    return this.userRepository.save(user);
  }
}

// Response DTO
export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}`,

      },

      keyTakeaways: [
        "DTOs and entities solve different problems.",
        "Request DTOs describe client input.",
        "Entities describe persisted application data.",
        "Response DTOs describe public output.",
        "The service often maps request data into the persistence model.",
        "Separating these models reduces coupling.",
      ],

      commonMistakes: [
        "<b>Using an entity as a request DTO.</b> This can allow clients to control fields they should not control.",
        "<b>Saving the password directly from the DTO.</b> Passwords should be handled securely and stored using an appropriate password hashing strategy.",
        "<b>Returning an entity directly.</b> This can accidentally expose internal fields.",
        "<b>Assuming DTO and entity must have identical fields.</b> They often should not.",
      ],

      quiz: [
        {
          question: "What does a DTO primarily describe?",
          options: [
            "Data being transferred across a boundary",
            "A database index",
            "A SQL connection",
            "A NestJS module",
          ],
          correctIndex: 0,
          explanation:
            "DTOs describe data being transferred into or out of application boundaries.",
        },
        {
          question: "What does an entity commonly represent?",
          options: [
            "A persistence/database model",
            "An HTTP header",
            "A route parameter",
            "A browser event",
          ],
          correctIndex: 0,
          explanation:
            "In ORM-based applications, entities commonly describe persisted data.",
        },
      ],
    },

    {
      id: "mapped-types-overview",
      title: "Mapped types: reusing DTO definitions",
      durationMinutes: 16,
      explanation: `As your application grows, you will notice that DTOs often share many fields.

Suppose you have:

\`CreateProductDto\`

with:

- name
- description
- price
- categoryId

Now you need:

\`UpdateProductDto\`

An update request may allow all of those fields, but each one should be optional because the client may update only one field.

You could manually write another class:

\`UpdateProductDto\`

with the same four properties marked optional.

But now you have duplicated the DTO definition.

If the product gets another field later, you have to remember to update multiple classes.

NestJS provides <b>mapped types</b> to help solve this problem.

The NestJS mapped-types package provides helpers such as:

- \`PartialType\`
- \`PickType\`
- \`OmitType\`
- \`IntersectionType\`

These helpers create new DTO types based on existing DTO classes.

The idea is simple:

<b>Define a base DTO once, then derive related DTOs from it.</b>

This makes DTO design easier to maintain.

For example:

\`PartialType(CreateProductDto)\`

means:

"Create another DTO based on CreateProductDto, but make its properties optional."

This is perfect for many update operations.

\`PickType(CreateProductDto, ["name", "price"])\`

means:

"Create a DTO containing only name and price."

\`OmitType(CreateProductDto, ["price"])\`

means:

"Create a DTO containing everything except price."

\`IntersectionType(A, B)\`

means:

"Create a DTO containing properties from both DTOs."

These helpers are especially useful when DTOs have many fields.

There is an important practical detail: use the mapped types from the NestJS package designed for your application's validation/API setup, rather than treating TypeScript's utility types such as \`Partial<T>\` as a complete replacement.

A TypeScript utility type changes compile-time typing.

NestJS mapped types are designed to work with Nest's DTO metadata and validation/decorator system.

That distinction becomes important when you rely on runtime validation and API documentation.

Think of mapped types as a way to reuse your DTO architecture without copying the same property definitions repeatedly.`,

      diagram: `CreateProductDto
       |
       +--------------------+
       |                    |
       v                    v
 PartialType            PickType
       |                    |
       v                    v
UpdateProductDto       ProductNamePriceDto

       |
       +--------------------+
       |                    |
       v                    v
 OmitType             IntersectionType
       |                    |
       v                    v
PublicProductDto      ProductWithAuditDto

Mapped types reuse
existing DTO definitions.`,

      codeExample: {
        title: "Mapped types from a base DTO",
        code: `import {
  PartialType,
  PickType,
  OmitType,
  IntersectionType,
} from "@nestjs/mapped-types";

export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

// Every property becomes optional.
export class UpdateProductDto extends PartialType(
  CreateProductDto,
) {}

// Only selected properties remain.
export class ProductPriceDto extends PickType(
  CreateProductDto,
  ["name", "price"] as const,
) {}

// Everything except price.
export class ProductWithoutPriceDto extends OmitType(
  CreateProductDto,
  ["price"] as const,
) {}

// Combine two DTO classes.
export class ProductAuditDto {
  createdBy: string;
  updatedBy: string;
}

export class ProductWithAuditDto extends IntersectionType(
  CreateProductDto,
  ProductAuditDto,
) {}`,
      },

      keyTakeaways: [
        "Mapped types let you derive DTOs from existing DTO classes.",
        "PartialType makes inherited properties optional.",
        "PickType keeps only selected properties.",
        "OmitType removes selected properties.",
        "IntersectionType combines properties from multiple DTO classes.",
        "Mapped types reduce duplicated DTO definitions.",
      ],

      commonMistakes: [
        "<b>Copying large DTOs manually.</b> Mapped types can reduce repeated property declarations.",
        "<b>Confusing PartialType with TypeScript Partial.</b> NestJS mapped types are designed to preserve relevant NestJS decorator metadata.",
        "<b>Using the wrong mapped-types package for the project.</b> Follow the package and integration recommended for the NestJS setup you are using.",
      ],

      quiz: [
        {
          question: "What does PartialType generally do?",
          options: [
            "Makes inherited DTO properties optional",
            "Deletes the DTO",
            "Makes every property private",
            "Creates a database table",
          ],
          correctIndex: 0,
          explanation:
            "PartialType creates a DTO where the properties from the source DTO become optional.",
        },
        {
          question: "Why are mapped types useful?",
          options: [
            "They reduce repeated DTO definitions",
            "They replace controllers",
            "They remove validation",
            "They replace databases",
          ],
          correctIndex: 0,
          explanation:
            "Mapped types let you derive related DTOs without manually duplicating all properties.",
        },
      ],
    },

    {
      id: "partial-type",
      title: "PartialType: building update DTOs",
      durationMinutes: 12,
      explanation: `\`PartialType\` is probably the mapped type you will use most often as a beginner.

It is especially useful for update endpoints.

Imagine:

\`CreateUserDto\`

contains:

- name
- email
- phone
- avatarUrl

When creating a user, the API might require all of these fields.

But when updating a user, the client might want to change only the phone number.

The request could be:

\`{
  "phone": "+123456789"
}\`

You do not want to require:

\`name\`

\`email\`

\`avatarUrl\`

again.

This is exactly what \`PartialType\` is useful for.

You can create:

\`UpdateUserDto extends PartialType(CreateUserDto)\`

Now the properties inherited from the create DTO are optional in the update DTO.

This is a natural fit for HTTP PATCH-style partial updates.

For example:

\`PATCH /users/42\`

might contain only:

\`{
  "name": "Alice Smith"
}\`

The service can then update only the fields that were actually provided.

There is an important distinction between PATCH-style partial updates and PUT-style replacement semantics.

A PATCH request is commonly used when you want to change part of a resource.

A PUT request is often modeled as replacing the resource representation, although the exact semantics depend on the API design.

So do not blindly use PartialType for every update endpoint.

First decide what your endpoint means.

In a real application, you might also have fields that should never be updateable by normal users.

For example, CreateUserDto might contain:

- name
- email
- password
- role

But normal users should not be able to update role.

In that case, simply using PartialType(CreateUserDto) may be too permissive.

You might create a safer update DTO that starts from a DTO containing only user-editable fields, or use OmitType/PickType to construct the allowed shape.

The important lesson is:

<b>PartialType makes properties optional; it does not decide which properties your user is authorized to modify.</b>

Authorization is still a separate concern.`,

      diagram: `CreateUserDto

name       required
email      required
phone      required
avatarUrl  required
   |
   | PartialType
   v
UpdateUserDto

name       optional
email      optional
phone      optional
avatarUrl  optional

PATCH /users/42
{
  "phone": "+123456789"
}

Only phone needs to be supplied.`,

      codeExample: {
        title: "Using PartialType for an update DTO",
        code: `import {
  PartialType,
} from "@nestjs/mapped-types";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsUrl()
  avatarUrl: string;
}

export class UpdateUserDto extends PartialType(
  CreateUserDto,
) {}

@Controller("users")
export class UsersController {
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }
}`,

      },

      keyTakeaways: [
        "PartialType makes inherited DTO properties optional.",
        "It is especially useful for partial update DTOs.",
        "PATCH endpoints are a common use case.",
        "PartialType does not perform authorization.",
        "Do not include fields in the source DTO that users should never be allowed to modify.",
      ],

      commonMistakes: [
        "<b>Using PartialType on an overly powerful DTO.</b> If CreateUserDto contains admin-only fields, they can become part of the update contract too.",
        "<b>Thinking optional means unrestricted.</b> An optional field can still have validation rules when provided.",
        "<b>Using PartialType without considering the endpoint semantics.</b> Decide whether the operation is partial update or full replacement.",
      ],

      quiz: [
        {
          question: "What is a common use case for PartialType?",
          options: [
            "Creating update DTOs",
            "Creating database connections",
            "Starting middleware",
            "Creating controllers",
          ],
          correctIndex: 0,
          explanation:
            "PartialType is commonly used when update operations allow only some fields to be provided.",
        },
        {
          question: "Does PartialType decide whether a user is authorized to update a field?",
          options: [
            "Yes",
            "No",
            "Only for admins",
            "Only with PostgreSQL",
          ],
          correctIndex: 1,
          explanation:
            "PartialType controls optionality, not authorization.",
        },
      ],
    },

    {
      id: "pick-type",
      title: "PickType: selecting specific DTO fields",
      durationMinutes: 12,
      explanation: `\`PickType\` is useful when you want to create a new DTO containing only a selected set of properties from another DTO.

Imagine your CreateProductDto contains:

- name
- description
- price
- categoryId
- sku
- internalCost

Now imagine you have an endpoint that only needs:

- name
- price

Instead of creating a completely separate class and repeating those property definitions, you can use \`PickType\`.

The idea is:

<b>"Start with this DTO, but keep only these properties."</b>

For example:

\`PickType(CreateProductDto, ["name", "price"])\`

creates a DTO containing those selected properties.

This is useful when several operations share a small subset of fields.

Imagine a product search endpoint.

You might want a DTO containing only:

- name
- categoryId

Or an internal pricing operation might need:

- productId
- price

You can derive those shapes from an existing DTO when the relationship makes architectural sense.

However, do not use PickType simply to avoid creating a class when the resulting DTO has a completely different business meaning.

A named DTO can sometimes be clearer than a clever composition.

For example:

\`UpdateProductPriceDto\`

may communicate more clearly than:

\`PickType(CreateProductDto, ["price"])\`

if the class represents an important business operation.

Mapped types are tools, not rules.

Use them when they make your code easier to understand and maintain.`,

      diagram: `CreateProductDto

name
description
price
categoryId
sku
internalCost

        |
        | PickType
        | ["name", "price"]
        v

ProductNamePriceDto

name
price

Only selected fields remain.`,

      codeExample: {
        title: "Selecting fields with PickType",
        code: `import {
  PickType,
} from "@nestjs/mapped-types";

export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  sku: string;
  internalCost: number;
}

export class ProductPriceDto extends PickType(
  CreateProductDto,
  ["name", "price"] as const,
) {}

// Resulting shape:
//
// {
//   name: string;
//   price: number;
// }`,
      },

      keyTakeaways: [
        "PickType creates a DTO containing only selected properties.",
        "It is useful when several DTOs share a small subset of fields.",
        "It can reduce duplicate property definitions.",
        "A clearly named custom DTO may still be better when the operation has important business meaning.",
      ],

      commonMistakes: [
        "<b>Picking sensitive fields for a public response.</b> PickType does not make a field safe; it only selects it.",
        "<b>Creating unreadable chains of mapped types.</b> DTO composition should improve clarity, not reduce it.",
        "<b>Thinking PickType performs authorization.</b> It controls the shape, not who can perform an operation.",
      ],

      quiz: [
        {
          question: "What does PickType do?",
          options: [
            "Selects specific properties from a DTO",
            "Makes every property optional",
            "Deletes a database record",
            "Creates a service",
          ],
          correctIndex: 0,
          explanation:
            "PickType creates a DTO containing only the properties you select.",
        },
        {
          question: "Does PickType make a selected property safe to expose?",
          options: [
            "Yes, automatically",
            "No, it only selects the property",
            "Only in production",
            "Only with JWT",
          ],
          correctIndex: 1,
          explanation:
            "Selecting a field does not automatically make that field appropriate for a public API.",
        },
      ],
    },

    {
      id: "omit-type",
      title: "OmitType: removing fields from a DTO",
      durationMinutes: 12,
      explanation: `\`OmitType\` does almost the opposite of \`PickType\`.

Instead of saying:

<b>"Keep these fields."</b>

you say:

<b>"Keep everything except these fields."</b>

Suppose your DTO contains:

- name
- email
- password
- role

You might want a DTO for an operation where all fields except password are relevant.

You can use:

\`OmitType(CreateUserDto, ["password"])\`

The resulting DTO contains:

- name
- email
- role

but not password.

This can be useful when one DTO has a field that should not be included in a particular operation.

A real-world example is an API response.

Suppose your internal user input model contains a password field.

You could derive a safe shape without that field.

However, when dealing with security-sensitive data, be careful about relying on composition alone.

For highly sensitive responses, explicitly defining a response DTO can sometimes make the public contract much easier to review.

For example:

\`UserResponseDto\`

with exactly:

- id
- name
- email

is extremely clear.

That is often easier for another developer or security reviewer to understand than a long chain of mapped types.

OmitType becomes especially useful when the source DTO has many fields and you want to remove only one or two.

For example:

\`CreateProductDto\`

might contain ten fields.

If an internal operation needs nine of them, OmitType may be cleaner than listing all nine using PickType.

The choice between PickType and OmitType is often about readability.

If you need only two fields out of ten, PickType can make the intention clearer.

If you need nine fields and want to remove one, OmitType can be clearer.`,

      diagram: `CreateUserDto

name
email
password
role
avatarUrl

        |
        | OmitType
        | ["password"]
        v

UserWithoutPasswordDto

name
email
role
avatarUrl

Everything remains
except the selected field.`,

      codeExample: {
        title: "Removing fields with OmitType",
        code: `import {
  OmitType,
} from "@nestjs/mapped-types";

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  avatarUrl: string;
}

export class UserWithoutPasswordDto extends OmitType(
  CreateUserDto,
  ["password"] as const,
) {}

// Resulting shape:
//
// {
//   name: string;
//   email: string;
//   role: string;
//   avatarUrl: string;
// }`,
      },

      keyTakeaways: [
        "OmitType creates a DTO without selected properties.",
        "It is useful when most fields are shared but one or two need to be excluded.",
        "PickType and OmitType solve opposite selection problems.",
        "For sensitive public responses, explicit DTOs can sometimes be easier to audit.",
        "OmitType does not perform authorization or security checks by itself.",
      ],

      commonMistakes: [
        "<b>Assuming OmitType is a complete security mechanism.</b> It shapes a DTO; it does not replace proper security design.",
        "<b>Omitting one sensitive field but leaving another.</b> Review the complete response contract.",
        "<b>Using OmitType when only a few fields are actually needed.</b> PickType may communicate the intended shape more clearly.",
      ],

      quiz: [
        {
          question: "What does OmitType do?",
          options: [
            "Removes selected properties from a DTO-derived type",
            "Makes all properties required",
            "Creates a database",
            "Starts the application",
          ],
          correctIndex: 0,
          explanation:
            "OmitType creates a new DTO based on another one while removing the selected properties.",
        },
        {
          question: "When might OmitType be clearer than PickType?",
          options: [
            "When you need almost all fields except one or two",
            "When you need only one field",
            "When you need no fields",
            "When creating a database connection",
          ],
          correctIndex: 0,
          explanation:
            "If most properties are needed and only a few should be excluded, OmitType can express that intention clearly.",
        },
      ],
    },

    {
      id: "intersection-type",
      title: "IntersectionType: combining DTOs",
      durationMinutes: 12,
      explanation: `\`IntersectionType\` is useful when you have two DTOs representing separate pieces of data and you need a new DTO containing both.

Imagine you have:

\`CreateProductDto\`

with:

- name
- description
- price

And:

\`AuditDto\`

with:

- createdBy
- source

You might need a DTO that represents:

<b>Product data + audit information</b>.

Instead of copying all the properties into a new class, you can use:

\`IntersectionType(CreateProductDto, AuditDto)\`

The resulting DTO contains the properties from both classes.

This can be useful when DTOs represent genuinely reusable concepts.

For example, a system might have:

\`PaginationDto\`

with:

- page
- limit

and a resource filter DTO with:

- status
- search

A combined DTO can represent:

- pagination
- filtering

This is useful for advanced search endpoints.

For example:

\`GET /orders?page=2&limit=20&status=paid&search=keyboard\`

The application might model the query using composed DTOs.

Another real-world example is reporting.

You might have:

\`DateRangeDto\`

with:

- from
- to

and:

\`PaginationDto\`

with:

- page
- limit

A report request could combine both.

The important thing with IntersectionType is to keep the source DTOs conceptually meaningful.

If you start combining five or six unrelated DTOs into one enormous type, the code can become difficult to understand.

Composition works best when each smaller DTO represents a clear reusable concept.

At an advanced level, you can combine mapped types with one another.

For example, you might first create a partial DTO and then combine it with another DTO.

This can be powerful, but readability becomes increasingly important.

A good rule is:

<b>Use DTO composition when it expresses a real relationship between pieces of data.</b>

Do not compose DTOs simply because you can.`,

      diagram: `CreateProductDto       AuditDto
       |                    |
       |                    |
       | name               | createdBy
       | description        | source
       | price              |
       +----------+---------+
                  |
                  | IntersectionType
                  v
          ProductWithAuditDto

          name
          description
          price
          createdBy
          source`,

      codeExample: {
        title: "Combining DTOs with IntersectionType",
        code: `import {
  IntersectionType,
} from "@nestjs/mapped-types";

export class CreateProductDto {
  name: string;
  description: string;
  price: number;
}

export class AuditDto {
  createdBy: string;
  source: string;
}

export class CreateProductWithAuditDto extends IntersectionType(
  CreateProductDto,
  AuditDto,
) {}

// Resulting shape:
//
// {
//   name: string;
//   description: string;
//   price: number;
//   createdBy: string;
//   source: string;
// }`,
      },

      keyTakeaways: [
        "IntersectionType combines properties from two DTO classes.",
        "It is useful when two DTOs represent separate reusable concepts.",
        "Pagination, filtering, auditing, and resource data can sometimes be composed this way.",
        "Keep each source DTO focused and meaningful.",
        "Avoid creating overly complicated chains of DTO composition.",
      ],

      commonMistakes: [
        "<b>Combining unrelated DTOs.</b> Composition should represent a real relationship.",
        "<b>Creating huge nested mapped-type expressions.</b> A named class may be easier to understand.",
        "<b>Forgetting duplicate property names.</b> When combining DTOs, think carefully about overlapping fields and their meaning.",
      ],

      quiz: [
        {
          question: "What does IntersectionType generally do?",
          options: [
            "Combines properties from DTO classes",
            "Removes every property",
            "Makes every field optional",
            "Creates a database table",
          ],
          correctIndex: 0,
          explanation:
            "IntersectionType creates a DTO containing the properties from the provided DTO classes.",
        },
        {
          question: "When is IntersectionType most useful?",
          options: [
            "When separate DTO concepts need to be combined into one meaningful contract",
            "Whenever any two classes exist",
            "Only for database entities",
            "Only for authentication",
          ],
          correctIndex: 0,
          explanation:
            "IntersectionType works best when the combined concepts represent a meaningful data contract.",
        },
      ],
    },

    {
      id: "advanced-dto-design",
      title: "Basic to advanced DTO design in a real application",
      durationMinutes: 12,
      explanation: `Now let's put the DTO concepts together using a realistic e-commerce API.

Imagine you are building a product management system.

A beginner implementation might start with one class:

\`ProductDto\`

But that quickly becomes a problem.

Creating a product and updating a product do not have exactly the same requirements.

A create request might require:

- name
- description
- price
- categoryId
- sku

An update request may allow any subset of those fields.

A public response should not expose internal fields such as:

- internalCost
- supplierId
- internalNotes

An admin response might expose some additional information.

This naturally leads to multiple DTOs.

<b>CreateProductDto</b>

This represents what clients can send when creating a product.

<b>UpdateProductDto</b>

This can use PartialType because the client may update only some properties.

<b>ProductSummaryDto</b>

This might use PickType to expose only fields needed for product cards.

<b>ProductWithoutInternalFieldsDto</b>

This might use OmitType when that composition remains clear.

<b>ProductWithAuditDto</b>

This could use IntersectionType to combine product information with audit information for an internal operation.

Now consider a real request:

\`PATCH /products/42\`

The client sends:

\`{
  "price": 49.99
}\`

The request body enters the application.

The UpdateProductDto tells NestJS what shape is allowed.

Validation checks the supplied value.

The controller receives the DTO.

The service checks whether the current user is allowed to change the price.

The service loads the product entity.

The entity represents the database record.

The service updates the entity.

The database saves the entity.

Then the application creates the response shape.

The response DTO decides what the client receives.

This gives us a clean flow:

<b>Request DTO → Controller → Service → Entity → Database → Response DTO</b>

Now consider an advanced admin operation.

An administrator might update:

- price
- inventory
- category

while a normal product manager might only update:

- name
- description

The DTO defines the shape of the request, but the DTO does not decide who is authorized to perform the operation.

That still belongs to authorization logic such as guards and service-level business rules.

This distinction is extremely important.

<b>DTO = What data has this shape?</b>

<b>Authorization = Who is allowed to perform this operation?</b>

<b>Service = What business rules should happen?</b>

<b>Entity = How is the data represented for persistence?</b>

Keeping these responsibilities separate makes the application easier to understand.

At an advanced level, you can compose DTOs using mapped types.

For example:

\`PartialType(PickType(CreateProductDto, ["name", "description"]))\`

could describe an update operation that only allows name and description, with both fields optional.

However, if that expression becomes difficult to read, create a named class instead.

For example:

\`UpdateProductDescriptionDto\`

may be much clearer.

The goal is not to use the most advanced mapped-type expression possible.

The goal is to create DTOs that communicate the API contract clearly.`,

      diagram: `                         HTTP API
                            |
             +--------------+--------------+
             |                             |
             v                             v
      Request DTO                    Response DTO
             |                             ^
             v                             |
         Controller                        |
             |                             |
             v                             |
          Service --------------------------+
             |
             | business rules
             v
          Entity
             |
             v
         Database


Example DTO family:

CreateProductDto
        |
        +---- PartialType ----> UpdateProductDto
        |
        +---- PickType -------> ProductSummaryDto
        |
        +---- OmitType -------> ProductPublicDto
        |
        +---- IntersectionType -> ProductWithAuditDto

Each derived DTO represents a different contract.`,

      codeExample: {
        title: "A realistic DTO family",
        code: `import {
  IsInt,
  IsNumber,
  IsString,
  Min,
} from "class-validator";

import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from "@nestjs/mapped-types";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  categoryId: number;

  @IsString()
  sku: string;

  @IsNumber()
  @Min(0)
  internalCost: number;
}

// All fields are optional.
// Useful for partial updates.
export class UpdateProductDto extends PartialType(
  CreateProductDto,
) {}

// Only fields needed by a product card.
export class ProductSummaryDto extends PickType(
  CreateProductDto,
  ["name", "description", "price"] as const,
) {}

// Remove internalCost from this derived shape.
export class ProductPublicDto extends OmitType(
  CreateProductDto,
  ["internalCost"] as const,
) {}

export class AuditDto {
  createdBy: string;
  updatedBy: string;
}

// Combines product data with audit data.
export class ProductWithAuditDto extends IntersectionType(
  ProductPublicDto,
  AuditDto,
) {}

// Example of a deliberately narrower update contract.
// Instead of allowing every CreateProductDto field,
// only name and description can be changed here.
export class UpdateProductContentDto extends PartialType(
  PickType(CreateProductDto, [
    "name",
    "description",
  ] as const),
) {}`,
      },

      keyTakeaways: [
        "A real application often needs several DTOs for one resource.",
        "Create, update, public response, admin response, and summary operations can have different contracts.",
        "PartialType is useful for optional update fields.",
        "PickType is useful for selecting a small set of properties.",
        "OmitType is useful when most fields are shared but specific fields should be excluded.",
        "IntersectionType is useful for combining meaningful DTO concepts.",
        "DTOs define data shape, not authorization.",
        "Readable named DTO classes are often better than extremely complicated mapped-type expressions.",
      ],

      commonMistakes: [
        "<b>Creating one universal ProductDto.</b> Different API operations usually have different data requirements.",
        "<b>Assuming DTO validation replaces authorization.</b> A valid request can still be forbidden for a particular user.",
        "<b>Exposing internal fields because they already exist on the entity.</b> Design the response contract intentionally.",
        "<b>Overusing mapped types.</b> If a composed DTO becomes difficult to understand, create a named DTO.",
        "<b>Using PartialType on sensitive or privileged fields.</b> Only include fields that the operation should actually allow.",
      ],

      quiz: [
        {
          question: "Which DTO would commonly be used for a PATCH update?",
          options: [
            "A DTO created with PartialType",
            "Only the database entity",
            "A module",
            "A guard",
          ],
          correctIndex: 0,
          explanation:
            "PartialType is commonly used to make update DTO properties optional.",
        },
        {
          question: "You need only name and price from a large product DTO. Which mapped type is a natural fit?",
          options: [
            "PickType",
            "PartialType",
            "IntersectionType",
            "GuardType",
          ],
          correctIndex: 0,
          explanation:
            "PickType selects specific properties from an existing DTO.",
        },
        {
          question: "You need nearly every property except internalCost. Which mapped type can express that?",
          options: [
            "OmitType",
            "PickType",
            "PartialType",
            "ControllerType",
          ],
          correctIndex: 0,
          explanation:
            "OmitType creates a DTO while excluding selected properties.",
        },
        {
          question: "You have ProductDto and AuditDto and need one DTO containing both sets of properties. What can you use?",
          options: [
            "IntersectionType",
            "PartialType",
            "OmitType",
            "ParseIntPipe",
          ],
          correctIndex: 0,
          explanation:
            "IntersectionType combines properties from multiple DTO classes.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What does DTO stand for?",
      options: [
        "Data Transfer Object",
        "Database Type Operation",
        "Dynamic Transfer Option",
        "Data Table Object",
      ],
      correctIndex: 0,
      explanation:
        "DTO stands for Data Transfer Object.",
    },
    {
      question: "What is a request DTO primarily used for?",
      options: [
        "Describing and validating data accepted by an endpoint",
        "Creating database indexes",
        "Starting the NestJS application",
        "Replacing services",
      ],
      correctIndex: 0,
      explanation:
        "Request DTOs define the expected input contract for an endpoint.",
    },
    {
      question: "What is a response DTO primarily used for?",
      options: [
        "Controlling the public shape of returned data",
        "Creating a database connection",
        "Running middleware",
        "Registering controllers",
      ],
      correctIndex: 0,
      explanation:
        "Response DTOs describe what data the API intends to expose.",
    },
    {
      question: "What is the main difference between a DTO and an entity?",
      options: [
        "A DTO describes transferred data while an entity commonly represents persisted data",
        "They are always exactly the same",
        "A DTO is always a database table",
        "An entity is always an HTTP request",
      ],
      correctIndex: 0,
      explanation:
        "DTOs and entities have different responsibilities even when their fields overlap.",
    },
    {
      question: "What does PartialType do?",
      options: [
        "Makes inherited DTO properties optional",
        "Removes every property",
        "Combines two DTOs",
        "Creates a controller",
      ],
      correctIndex: 0,
      explanation:
        "PartialType creates a DTO where the source properties are optional.",
    },
    {
      question: "Which mapped type selects only specified properties?",
      options: [
        "PickType",
        "OmitType",
        "PartialType",
        "IntersectionType",
      ],
      correctIndex: 0,
      explanation:
        "PickType selects the properties you specify.",
    },
    {
      question: "Which mapped type removes specified properties?",
      options: [
        "OmitType",
        "PickType",
        "PartialType",
        "IntersectionType",
      ],
      correctIndex: 0,
      explanation:
        "OmitType creates a DTO without the selected properties.",
    },
    {
      question: "Which mapped type combines properties from multiple DTO classes?",
      options: [
        "IntersectionType",
        "PickType",
        "OmitType",
        "PartialType",
      ],
      correctIndex: 0,
      explanation:
        "IntersectionType combines the properties from the provided DTO classes.",
    },
    {
      question: "Does PartialType decide whether a user is authorized to update a field?",
      options: [
        "Yes",
        "No",
        "Only for PATCH",
        "Only for administrators",
      ],
      correctIndex: 1,
      explanation:
        "PartialType controls the DTO shape and optionality. Authorization is a separate concern.",
    },
    {
      question: "Why might you avoid returning a database entity directly from a controller?",
      options: [
        "It can expose internal or sensitive fields and couples the API to the persistence model",
        "Entities cannot contain data",
        "Controllers cannot return objects",
        "NestJS does not support entities",
      ],
      correctIndex: 0,
      explanation:
        "A response DTO provides a controlled public contract instead of exposing the entire persistence model.",
    },
    {
      question: "A product DTO has ten fields but an endpoint needs only name and price. Which mapped type is usually the clearest starting point?",
      options: [
        "PickType",
        "OmitType",
        "PartialType",
        "IntersectionType",
      ],
      correctIndex: 0,
      explanation:
        "PickType is appropriate when only a small selected set of properties is needed.",
    },
    {
      question: "A DTO has ten fields and you need nine except internalCost. Which mapped type may be more readable?",
      options: [
        "OmitType",
        "PickType",
        "PartialType",
        "IntersectionType",
      ],
      correctIndex: 0,
      explanation:
        "OmitType clearly expresses that most fields remain while a specific field is excluded.",
    },
  ],

  project: {
    name: "Build a Product DTO architecture",
    goal: "Build a product API that uses separate request and response DTOs and demonstrates PartialType, PickType, OmitType, and IntersectionType.",
    brief: "Create a NestJS Products module where incoming product data is validated through request DTOs, updates use PartialType, public responses do not expose internal fields, summary responses use PickType, and an internal audit representation demonstrates IntersectionType.",
    steps: [
      "Create a Products module with ProductsController and ProductsService.",
      "Create a CreateProductDto with name, description, price, categoryId, sku, and internalCost.",
      "Add appropriate class-validator decorators to the request DTO.",
      "Enable ValidationPipe with whitelist enabled.",
      "Create UpdateProductDto using PartialType(CreateProductDto).",
      "Create ProductSummaryDto using PickType with the fields needed for a product card.",
      "Create ProductPublicDto using OmitType to exclude internalCost.",
      "Create an AuditDto containing createdBy and updatedBy.",
      "Create ProductWithAuditDto using IntersectionType.",
      "Create a product entity or persistence model containing internal database fields such as id, timestamps, and internalCost.",
      "Make sure the request DTO and entity are not treated as the same object.",
      "Create POST /products using CreateProductDto.",
      "Create PATCH /products/:id using UpdateProductDto.",
      "Use ParseIntPipe for the product ID.",
      "Create GET /products/:id that returns a controlled public response.",
      "Create a product-summary endpoint that returns only the fields needed by a product card.",
      "Test sending invalid product data and confirm that validation rejects it.",
      "Test sending an update with only one field and confirm that PartialType allows the partial update.",
      "Test that internalCost is not returned by the public response.",
      "Inspect the DTOs and identify which ones are request contracts and which ones are response contracts.",
      "Document why each mapped type was used instead of manually duplicating the DTO fields.",
    ],
    acceptance: [
      "The Products feature has separate controller and service layers.",
      "CreateProductDto validates incoming product data.",
      "UpdateProductDto is created using PartialType.",
      "At least one DTO uses PickType.",
      "At least one DTO uses OmitType.",
      "At least one DTO uses IntersectionType.",
      "The API does not expose internalCost in its public response.",
      "The request DTO is not treated as the database entity.",
      "Invalid request data is rejected by runtime validation.",
      "A partial update can update only the fields supplied by the client.",
      "The controller delegates product operations to the service.",
      "The API has intentionally designed request and response contracts.",
    ],
    stretch: [
      "Create separate AdminProductResponseDto and PublicProductResponseDto contracts.",
      "Create a ProductSearchQueryDto containing pagination and filtering fields.",
      "Create reusable PaginationDto and combine it with a product filter DTO using IntersectionType.",
      "Create a restricted UpdateProductContentDto using PartialType and PickType together.",
      "Add nested DTO validation for product options or variants.",
      "Add an explicit response-mapping function that converts the entity into a response DTO.",
      "Create an endpoint that returns ProductSummaryDto objects for a product listing page.",
      "Create a separate DTO for changing only the product price rather than reusing the full update DTO.",
      "Add role-based authorization and demonstrate that a valid DTO does not automatically mean the user is authorized to perform the operation.",
      "Compare a response built with explicit field mapping against one built using serialization decorators and document the trade-offs.",
    ],
  },
};
