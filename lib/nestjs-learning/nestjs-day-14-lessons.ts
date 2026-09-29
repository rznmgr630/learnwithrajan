import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_14_LESSONS: LessonDay = {
  day: 14,
  title: "Validation & Pipes",
  totalMinutes: 96,
  difficulty: "Beginner",
  lessons: [
    {
      id: "validation-pipe-basics",
      title: "ValidationPipe: Protecting your application from bad input",
      durationMinutes: 18,
      explanation: `Whenever a client sends data to your NestJS application, you should not automatically trust that data.

For example, imagine that your API has an endpoint for creating a user. You might expect a request like this:

\`\`\`json
{
  "name": "John",
  "email": "john@example.com",
  "age": 25
}
\`\`\`

But a client can send anything it wants. It could send an empty name, an invalid email, a negative age, extra properties, or even completely unexpected data.

This is where <b>validation</b> becomes important.

Validation means checking whether incoming data follows the rules your application expects before your controller and service start working with it.

NestJS provides a built-in <b>ValidationPipe</b> that works together with <b>class-validator</b> and <b>class-transformer</b>. You define validation rules on DTO classes, and the ValidationPipe checks incoming request data against those rules.


Think of the ValidationPipe as a security checkpoint at the entrance of your application.

A request arrives:

\`\`\`
Client
  |
  | POST /users
  | { name, email, age }
  v
ValidationPipe
  |
  | Is the data valid?
  |
  +---- No ----> 400 Bad Request
  |
  +---- Yes ---> Controller
                    |
                    v
                 Service
\`\`\`

The important idea is that invalid data should be rejected <b>before your business logic runs</b>.

For example, if your API expects an email address, your controller should not have to manually write code like:

\`\`\`ts
if (!email) {
  throw new BadRequestException("Email is required");
}

if (!email.includes("@")) {
  throw new BadRequestException("Invalid email");
}
\`\`\`

You can put these rules in a DTO instead.

A DTO describes what valid input should look like.

For example:

\`\`\`ts
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
\`\`\`

Then your controller can simply use the DTO:

\`\`\`ts
@Post()
createUser(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
\`\`\`

The ValidationPipe looks at the decorators on the DTO and validates the incoming request.

At a beginner level, think about the relationship like this:

\`\`\`
DTO
 |
 | contains validation rules
 v
ValidationPipe
 |
 | checks incoming data
 v
Controller
 |
 | only receives acceptable data
 v
Service
\`\`\`

There are several places where you can apply a pipe. You can apply it to a single parameter, a route handler, an entire controller, or globally across the application.

For example, a parameter-level pipe looks like this:

\`\`\`ts
@Get(":id")
findUser(
  @Param("id", ParseIntPipe) id: number,
) {
  return this.usersService.findOne(id);
}
\`\`\`

A method-level pipe can be applied with \`@UsePipes()\`:

\`\`\`ts
@Post()
@UsePipes(new ValidationPipe())
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
\`\`\`

But in a real application, validation is commonly configured globally so that every relevant endpoint gets the same validation behavior.

For example:

\`\`\`ts
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe(),
  );

  await app.listen(3000);
}

bootstrap();
\`\`\`

Now the ValidationPipe is part of the application's general request processing.

<b>Real-world beginner example:</b>

Imagine a signup form.

The frontend sends:

\`\`\`json
{
  "name": "A",
  "email": "not-an-email",
  "password": "123"
}
\`\`\`

Your DTO might require:

- name to contain at least two characters
- email to be a valid email
- password to contain at least eight characters

The ValidationPipe can reject the request before the user is created.

<b>Real-world intermediate example:</b>

An e-commerce application might have DTOs for:

- creating products
- updating products
- creating orders
- adding addresses
- applying discount codes
- creating payment requests

Each DTO can contain different validation rules.

<b>Real-world advanced example:</b>

A large API might use a global ValidationPipe with transformation and whitelisting:

\`\`\`ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
\`\`\`

This creates a consistent boundary between external request data and your internal application code.

The main lesson is simple: <b>do not make every controller responsible for manually checking every input.</b> Put reusable input rules into DTOs and let Nest's validation system handle them.`,
      diagram: `External Request
      |
      v
+----------------------+
|   ValidationPipe     |
|                      |
| - Required fields    |
| - String checks      |
| - Email checks       |
| - Number checks      |
| - Custom rules       |
+----------+-----------+
           |
     Is data valid?
       /        \\
     No          Yes
     |             |
     v             v
  400 Error    Controller
                  |
                  v
                Service
                  |
                  v
               Database

The ValidationPipe protects the application
boundary before business logic executes.`,
      codeExample: {
        title: "Basic global ValidationPipe",
        code: `import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe(),
  );

  await app.listen(3000);
}

bootstrap();`,
      },
      keyTakeaways: [
        "Validation checks incoming data before your application uses it.",
        "NestJS provides a built-in ValidationPipe.",
        "ValidationPipe works with class-validator and class-transformer.",
        "DTOs are commonly used to describe validation rules.",
        "A pipe can reject invalid input before the controller method executes.",
        "ValidationPipe can be applied to parameters, methods, controllers, or globally.",
      ],
      commonMistakes: [
        "<b>Trusting client input.</b> The frontend can send invalid or unexpected data.",
        "<b>Writing all validation manually inside controllers.</b> DTO validation keeps this logic cleaner and reusable.",
        "<b>Thinking TypeScript types validate HTTP requests.</b> TypeScript types disappear at runtime, so runtime validation is still necessary.",
        "<b>Validating only on the frontend.</b> Frontend validation improves user experience, but the backend must still validate incoming data.",
      ],
      quiz: [
        {
          question: "What is the main purpose of ValidationPipe?",
          options: [
            "Connect to the database",
            "Validate and optionally transform incoming data",
            "Create HTTP routes",
            "Start the NestJS server",
          ],
          correctIndex: 1,
          explanation: "ValidationPipe checks incoming values against validation rules and can also transform them.",
        },
        {
          question: "Where are validation rules commonly defined?",
          options: [
            "Inside package.json",
            "Inside DTO classes using validation decorators",
            "Inside the database server",
            "Inside main.ts only",
          ],
          correctIndex: 1,
          explanation: "DTO classes commonly contain class-validator decorators that describe the expected input.",
        },
      ],
    },

    {
      id: "class-validator",
      title: "class-validator: Writing validation rules",
      durationMinutes: 17,
      explanation: `The ValidationPipe does the validation work, but it needs to know <b>what rules to apply</b>.

This is where <b>class-validator</b> comes in.

\`class-validator\` provides decorators that you place on DTO properties.

For example:

\`\`\`ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
\`\`\`

Each decorator represents a rule.

You can read the DTO almost like a sentence:

\`\`\`
name
  -> must be a string
  -> must not be empty

email
  -> must be an email

password
  -> must be a string
  -> must contain at least 8 characters
\`\`\`

This is one of the reasons DTO validation is beginner-friendly. The validation rules are close to the fields they describe.

There are many validation decorators available. Some commonly used ones include:

\`\`\`ts
@IsString()
@IsNumber()
@IsInt()
@IsBoolean()
@IsEmail()
@IsUrl()
@IsUUID()
@IsDate()
@IsArray()
@IsEnum()
@IsNotEmpty()
@IsOptional()
@Min()
@Max()
@MinLength()
@MaxLength()
@Matches()
\`\`\`

For example, a product DTO might look like:

\`\`\`ts
import {
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @MaxLength(1000)
  description: string;
}
\`\`\`

Now imagine this request:

\`\`\`json
{
  "name": "",
  "price": -50,
  "description": "A product"
}
\`\`\`

The validation system can detect that:

- the name is too short
- the price is below the minimum

The controller does not need to manually check each field.

<b>Optional values</b>

Sometimes a field is allowed to be missing.

For example, when creating a user, maybe \`phoneNumber\` is optional.

You can write:

\`\`\`ts
import {
  IsOptional,
  IsPhoneNumber,
} from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
\`\`\`

This means:

"If phoneNumber is provided, validate it. If it is not provided, that is okay."

This is particularly useful for update DTOs.

<b>Combining multiple rules</b>

A property can have multiple validation decorators.

For example:

\`\`\`ts
@IsString()
@MinLength(8)
@MaxLength(50)
password: string;
\`\`\`

The value must satisfy all of these rules.

Think of it as several checkpoints:

\`\`\`
password
   |
   v
Is it a string?
   |
   v
At least 8 characters?
   |
   v
No more than 50 characters?
   |
   v
Valid
\`\`\`

<b>Nested objects</b>

Real applications often receive nested data.

For example:

\`\`\`json
{
  "name": "John",
  "address": {
    "street": "Main Street",
    "city": "Tokyo"
  }
}
\`\`\`

You can create a DTO for the address and validate the nested object.

\`\`\`ts
import {
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
\`\`\`

The \`@ValidateNested()\` decorator tells class-validator that the nested object should also be validated.

The \`@Type(() => AddressDto)\` decorator helps class-transformer know what class should be used for the nested value.

<b>Real-world beginner example:</b>

A registration API validates:

\`\`\`
name
email
password
\`\`\`

<b>Real-world intermediate example:</b>

A checkout API validates:

\`\`\`
customer
shippingAddress
billingAddress
items[]
paymentMethod
\`\`\`

Each nested object can have its own DTO and validation rules.

<b>Real-world advanced example:</b>

A large application might use validation groups, conditional validation, nested DTOs, arrays of DTOs, custom decorators, and business-specific validators.

The important principle remains the same:

<b>DTOs describe the shape of external data, and validation decorators describe which values are acceptable.</b>`,
      diagram: `Incoming JSON
     |
     v
CreateUserDto
     |
     +--> name
     |      |
     |      +--> @IsString()
     |      +--> @IsNotEmpty()
     |
     +--> email
     |      |
     |      +--> @IsEmail()
     |
     +--> password
            |
            +--> @IsString()
            +--> @MinLength(8)

             |
             v
       class-validator
             |
       +-----+-----+
       |           |
     Invalid      Valid
       |           |
       v           v
   400 Error   Controller`,
      codeExample: {
        title: "A DTO with several validation rules",
        code: `import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}`,
      },
      keyTakeaways: [
        "class-validator provides decorators for runtime validation.",
        "Multiple validation decorators can be placed on the same property.",
        "Use IsOptional when a field may be omitted.",
        "Nested DTOs can be validated with ValidateNested.",
        "Validation rules should describe what your API accepts.",
        "Validation is runtime behavior; TypeScript types alone are not enough.",
      ],
      commonMistakes: [
        "<b>Using only TypeScript types.</b> `email: string` does not prove that a runtime value is actually a valid email.",
        "<b>Forgetting nested validation.</b> Nested objects need the appropriate nested validation decorators.",
        "<b>Making every field optional.</b> Optional fields should reflect the actual API contract.",
        "<b>Putting database/business rules into simple DTO validation.</b> Some rules belong in services or domain logic rather than basic input validation.",
      ],
      quiz: [
        {
          question: "What does @IsEmail() do?",
          options: [
            "Sends an email",
            "Checks that a value follows an email format",
            "Creates an email account",
            "Encrypts an email",
          ],
          correctIndex: 1,
          explanation: "@IsEmail() validates that the supplied value has an email-like format.",
        },
        {
          question: "What does @IsOptional() mean?",
          options: [
            "The value must always be present",
            "The property is ignored completely",
            "The property may be missing, but is validated when provided",
            "The property becomes a database column",
          ],
          correctIndex: 2,
          explanation: "IsOptional allows the property to be absent while still allowing other validators to run when a value exists.",
        },
      ],
    },

    {
      id: "class-transformer-and-transformation",
      title: "class-transformer and input transformation",
      durationMinutes: 17,
      explanation: `Validation answers the question:

<b>"Is this value acceptable?"</b>

Transformation answers a slightly different question:

<b>"Can we convert this incoming value into the type or shape our application expects?"</b>

This distinction is important because HTTP requests contain text-based data.

For example, consider this route:

\`\`\`http
GET /products?page=2
\`\`\`

The value from the URL is received as a string.

So even though you might write:

\`\`\`ts
@Get()
findProducts(@Query("page") page: number) {
  // ...
}
\`\`\`

the incoming HTTP value is not automatically guaranteed to be a JavaScript number simply because TypeScript says \`number\`.

This is where transformation becomes useful.

Nest's ValidationPipe can enable transformation with:

\`\`\`ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  }),
);
\`\`\`

When transformation is enabled, the ValidationPipe can transform payloads into DTO class instances and perform useful conversions supported by class-transformer.


For example, suppose your DTO says:

\`\`\`ts
export class SearchDto {
  page: number;
}
\`\`\`

and you configure:

\`\`\`ts
new ValidationPipe({
  transform: true,
});
\`\`\`

Then Nest can transform compatible incoming values according to the DTO metadata.

You can also use class-transformer decorators when you need more explicit control.

For example:

\`\`\`ts
import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
\`\`\`

Now the DTO is saying:

"Convert this value to a Number, then validate that it is an integer and at least 1."

This is particularly useful for query parameters because query parameters normally arrive as strings.

For example:

\`\`\`
GET /products?page=2
\`\`\`

Conceptually:

\`\`\`
"2"
 |
 | @Type(() => Number)
 v
2
 |
 | @IsInt()
 v
Valid
\`\`\`

Another common example is a boolean query parameter.

Suppose the client sends:

\`\`\`
GET /products?includeOutOfStock=true
\`\`\`

You may want your application to work with:

\`\`\`ts
true
\`\`\`

instead of:

\`\`\`ts
"true"
\`\`\`

Transformation can help create the correct runtime value.

<b>Transformation is not the same as validation.</b>

For example:

\`\`\`ts
@Type(() => Number)
page: number;
\`\`\`

is about converting the value.

While:

\`\`\`ts
@IsInt()
@Min(1)
page: number;
\`\`\`

is about checking whether the value is acceptable.

You often use both together.

<b>Real-world beginner example:</b>

A product listing has:

\`\`\`
?page=2
&limit=20
\`\`\`

The application wants numbers rather than strings.

<b>Real-world intermediate example:</b>

A search API might accept:

\`\`\`
?page=2
&limit=20
&minPrice=100
&maxPrice=500
&includeOutOfStock=false
\`\`\`

Transformation converts values into useful runtime types, while validation makes sure they are sensible.

<b>Real-world advanced example:</b>

A large API can use transformation for nested DTOs, arrays, dates, numeric values, and other structured request data. The goal is to establish a predictable runtime representation at the application boundary.

The important mental model is:

\`\`\`
HTTP request
     |
     v
Raw values
     |
     v
Transformation
     |
     v
Expected runtime types
     |
     v
Validation
     |
     v
Controller
\`\`\`

The exact order and behavior depend on how the pipe and DTO are configured, but conceptually you should think of transformation and validation as two different responsibilities that often work together.`,
      diagram: `HTTP Request
     |
     | page="2"
     | active="true"
     v
+-----------------------+
|      Transformation   |
|                       |
| "2"   -> 2            |
| "true" -> true        |
+-----------+-----------+
            |
            v
+-----------------------+
|       Validation      |
|                       |
| IsInt?                |
| IsBoolean?            |
| Min(1)?               |
+-----------+-----------+
            |
      +-----+-----+
      |           |
   Invalid       Valid
      |           |
      v           v
   400 Error   Controller`,
      codeExample: {
        title: "Transforming pagination query parameters",
        code: `import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;
}

// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  }),
);

// controller
@Get()
findProducts(@Query() query: PaginationDto) {
  console.log(query.page);  // number
  console.log(query.limit); // number

  return this.productsService.findAll(query);
}`,
      },
      keyTakeaways: [
        "Validation checks whether input is acceptable.",
        "Transformation changes input into a useful runtime representation.",
        "HTTP query and route values commonly arrive as strings.",
        "ValidationPipe can enable transformation with transform: true.",
        "class-transformer provides decorators such as @Type for explicit transformation.",
        "Transformation and validation are often used together.",
      ],
      commonMistakes: [
        "<b>Assuming TypeScript changes runtime values.</b> A TypeScript annotation does not automatically convert a string into a number.",
        "<b>Confusing transformation with validation.</b> Converting `\"20\"` to `20` does not automatically prove that 20 is acceptable.",
        "<b>Turning on transform without understanding the incoming data.</b> Always test how your actual request values are represented.",
        "<b>Using transformation to implement business rules.</b> Transformation should prepare input; business rules usually belong elsewhere.",
      ],
      quiz: [
        {
          question: "What is transformation responsible for?",
          options: [
            "Changing input into the desired runtime form",
            "Creating database tables",
            "Starting the server",
            "Creating controllers",
          ],
          correctIndex: 0,
          explanation: "Transformation prepares incoming values for use by converting them into the expected runtime representation.",
        },
        {
          question: "Why are query parameters often transformed?",
          options: [
            "They are commonly received as strings",
            "They always come from a database",
            "They cannot contain numbers",
            "NestJS does not support query parameters",
          ],
          correctIndex: 0,
          explanation: "Values coming from URLs are commonly represented as strings, even when the application expects numbers or booleans.",
        },
      ],
    },

    {
      id: "whitelist-and-secure-input",
      title: "Whitelist: Controlling which properties enter your application",
      durationMinutes: 15,
      explanation: `Imagine your API expects this request:

\`\`\`json
{
  "name": "John",
  "email": "john@example.com",
  "password": "secret123"
}
\`\`\`

But a malicious or buggy client sends:

\`\`\`json
{
  "name": "John",
  "email": "john@example.com",
  "password": "secret123",
  "isAdmin": true
}
\`\`\`

If \`isAdmin\` is not part of the DTO, you usually do not want that property silently travelling through your application.

Nest's ValidationPipe supports a <b>whitelist</b> option.

When \`whitelist: true\` is enabled, properties that do not have validation decorators in the DTO can be stripped from the validated object.


For example:

\`\`\`ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  }),
);
\`\`\`

Suppose the DTO is:

\`\`\`ts
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
\`\`\`

And the client sends:

\`\`\`json
{
  "name": "John",
  "email": "john@example.com",
  "isAdmin": true
}
\`\`\`

With whitelisting enabled, \`isAdmin\` can be removed because it is not a validated DTO property.

Conceptually:

\`\`\`
Incoming object
      |
      v
{
  name,
  email,
  isAdmin
}
      |
      v
ValidationPipe
      |
      | whitelist: true
      v
{
  name,
  email
}
\`\`\`

This helps keep the data entering your application aligned with the DTO contract.

<b>Whitelist vs forbidNonWhitelisted</b>

There are two related options that beginners often confuse.

With:

\`\`\`ts
whitelist: true
\`\`\`

unknown properties are removed.

With:

\`\`\`ts
whitelist: true,
forbidNonWhitelisted: true,
\`\`\`

unknown properties cause validation to fail instead of simply being removed. Nest's documentation describes \`forbidNonWhitelisted\` as the option to reject requests containing properties that are not allowed by the whitelist.


For example:

\`\`\`ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
\`\`\`

Now this:

\`\`\`json
{
  "name": "John",
  "email": "john@example.com",
  "isAdmin": true
}
\`\`\`

can result in a validation error because \`isAdmin\` is not part of the allowed DTO properties.

Which approach should you use?

That depends on your API design.

<b>Whitelist only</b> is useful when you want to quietly remove unexpected fields.

<b>Whitelist + forbidNonWhitelisted</b> is useful when unexpected fields should immediately tell the client that its request does not match the API contract.

The important thing is to make the behavior intentional.

<b>Real-world beginner example:</b>

A signup endpoint expects:

\`\`\`
name
email
password
\`\`\`

A client accidentally sends:

\`\`\`
name
email
password
phone
\`\`\`

Whitelisting can remove the unexpected \`phone\` field.

<b>Real-world intermediate example:</b>

An admin API might reject unknown fields completely:

\`\`\`ts
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
});
\`\`\`

This makes the API contract stricter.

<b>Real-world advanced example:</b>

Imagine an API accepting payment information. You want to be very deliberate about what fields are accepted. Unexpected properties should not accidentally flow into services, logs, database operations, or third-party integrations.

Whitelist behavior provides one layer of protection at the application's input boundary.

Remember that whitelisting is not a replacement for authorization.

For example, if a DTO contains:

\`\`\`ts
isAdmin: boolean;
\`\`\`

the fact that the field is valid does <b>not</b> mean every user should be allowed to set it.

Validation asks:

"Is this field valid?"

Authorization asks:

"Is this user allowed to do this?"

Those are different responsibilities.`,
      diagram: `Client Request
      |
      v
{
  name,
  email,
  password,
  isAdmin,
  unknownField
}
      |
      v
ValidationPipe
      |
      | whitelist: true
      v
{
  name,
  email,
  password
}
      |
      v
Controller

With forbidNonWhitelisted: true

Client Request
      |
      v
Unexpected property
      |
      v
Validation Error
      |
      v
Controller is NOT executed`,
      codeExample: {
        title: "Whitelist and reject unknown properties",
        code: `import { ValidationPipe } from "@nestjs/common";

app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);`,
      },
      keyTakeaways: [
        "whitelist removes properties that are not part of the validated DTO.",
        "forbidNonWhitelisted can reject a request instead of silently removing unexpected properties.",
        "Whitelisting helps keep external input aligned with your DTO contract.",
        "Validation and authorization are different responsibilities.",
        "A valid property is not automatically a property every user is allowed to modify.",
      ],
      commonMistakes: [
        "<b>Thinking whitelist is authorization.</b> It controls input shape, not user permissions.",
        "<b>Assuming TypeScript automatically removes extra properties.</b> Runtime JavaScript objects can contain additional fields.",
        "<b>Forgetting that validation decorators help define the whitelist.</b> Properties generally need validation metadata to be recognized as allowed.",
        "<b>Using strict rejection without considering your API clients.</b> Adding unexpected-field rejection can affect clients that send extra data.",
      ],
      quiz: [
        {
          question: "What does whitelist: true do?",
          options: [
            "Deletes the database",
            "Removes properties that are not validated by the DTO",
            "Creates an authentication token",
            "Encrypts the request",
          ],
          correctIndex: 1,
          explanation: "Whitelist removes properties that are not included as validated properties in the DTO.",
        },
        {
          question: "What does forbidNonWhitelisted do when used with whitelist?",
          options: [
            "Allows every property",
            "Rejects requests containing non-whitelisted properties",
            "Turns off validation",
            "Creates a new DTO",
          ],
          correctIndex: 1,
          explanation: "It causes validation to fail when non-whitelisted properties are present.",
        },
      ],
    },

    {
      id: "custom-validators",
      title: "Custom validators: When built-in rules are not enough",
      durationMinutes: 15,
      explanation: `The built-in class-validator decorators cover many common cases.

You can validate things such as:

\`\`\`ts
@IsEmail()
@IsString()
@IsInt()
@Min()
@Max()
@IsUUID()
@IsEnum()
\`\`\`

But real applications eventually have rules that are specific to the application.

For example:

- a username cannot contain reserved words
- a product SKU must follow your company's format
- a booking date cannot fall on a company holiday
- two fields must follow a special relationship
- a code must match a particular business format

These are situations where a <b>custom validator</b> can be useful.

A custom validator allows you to create reusable validation logic that can then be used like a normal validation decorator.

At a high level, the process looks like this:

\`\`\`
DTO
 |
 | @IsCompanyUsername()
 v
class-validator
 |
 v
Custom validation logic
 |
 +---- valid ----> continue
 |
 +---- invalid --> validation error
\`\`\`

A custom validator can be implemented using class-validator's constraint system.

For example, suppose your application does not allow usernames such as:

\`\`\`
admin
administrator
root
support
\`\`\`

You could create a custom validator.

A simplified example:

\`\`\`ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "reservedUsername", async: false })
export class ReservedUsernameValidator
  implements ValidatorConstraintInterface
{
  validate(value: string) {
    const reserved = [
      "admin",
      "administrator",
      "root",
      "support",
    ];

    return !reserved.includes(value.toLowerCase());
  }

  defaultMessage(args: ValidationArguments) {
    return \`The username "\${args.value}" is reserved.\`;
  }
}
\`\`\`

You can then connect the constraint to a decorator.

\`\`\`ts
import {
  registerDecorator,
  ValidationOptions,
} from "class-validator";

export function IsNotReservedUsername(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isNotReservedUsername",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ReservedUsernameValidator,
    });
  };
}
\`\`\`

Then your DTO becomes easier to understand:

\`\`\`ts
export class CreateUserDto {
  @IsString()
  @IsNotReservedUsername()
  username: string;
}
\`\`\`

The DTO now reads almost like a specification.

<b>There is an important distinction between validation and business logic.</b>

A custom validator is useful when the rule is fundamentally about whether an input value is acceptable.

But you should be careful about putting complicated business workflows inside validators.

For example, suppose you need to determine whether a customer has enough account credit to place an order.

That is usually better handled by your service or domain logic:

\`\`\`
Controller
   |
ValidationPipe
   |
Service
   |
Check customer balance
   |
Create order
\`\`\`

Rather than hiding a complicated database operation inside a validation decorator.

<b>Async validators</b>

Some validation rules may need asynchronous work.

For example:

"Does this username already exist?"

That may require a database query.

A custom validator can be asynchronous, but this should be used thoughtfully. Database-backed checks inside validation can create additional database calls and may blur the boundary between simple input validation and business logic.

A common architecture is:

\`\`\`
Simple shape/rule validation
        |
        v
ValidationPipe
        |
        v
Business/domain validation
        |
        v
Service
        |
        v
Database
\`\`\`

<b>Real-world beginner example:</b>

A username cannot contain certain reserved words.

<b>Real-world intermediate example:</b>

A product SKU must follow a company-specific pattern such as:

\`\`\`
PROD-2026-ABC123
\`\`\`

A custom validator can make that rule reusable.

<b>Real-world advanced example:</b>

An enterprise application might have reusable validators for domain-specific formats such as tax identifiers, organization codes, invoice numbers, or specialized identifiers.

The key is to keep validators focused.

A validator should answer a reasonably clear question:

<b>"Is this value acceptable according to this validation rule?"</b>

If the code starts performing a large business workflow, it probably belongs somewhere else.`,
      diagram: `DTO
 |
 | @IsNotReservedUsername()
 v
Custom Decorator
 |
 v
ValidatorConstraint
 |
 v
validate(value)
 |
 +----------+
 |          |
 v          v
true       false
 |          |
 v          v
Continue   Validation Error

Keep complex business workflows
outside simple validators.`,
      codeExample: {
        title: "A simple custom validator",
        code: `import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({
  name: "reservedUsername",
  async: false,
})
export class ReservedUsernameValidator
  implements ValidatorConstraintInterface
{
  validate(value: string) {
    const reserved = [
      "admin",
      "root",
      "support",
    ];

    return !reserved.includes(value.toLowerCase());
  }

  defaultMessage() {
    return "This username is reserved.";
  }
}`,
      },
      keyTakeaways: [
        "Built-in validators handle many common validation rules.",
        "Custom validators are useful for application-specific input rules.",
        "Custom validators can be exposed through reusable decorators.",
        "Keep validators focused on validation rather than large business workflows.",
        "Database-heavy business checks often belong in services or domain logic.",
      ],
      commonMistakes: [
        "<b>Creating custom validators for everything.</b> Use built-in decorators when they already express the rule.",
        "<b>Putting an entire business workflow inside a validator.</b> Complex business logic usually belongs in services or domain logic.",
        "<b>Ignoring async costs.</b> Database-backed validators can add extra database queries.",
        "<b>Making validators difficult to reuse.</b> A good custom validator should have a clear and focused responsibility.",
      ],
      quiz: [
        {
          question: "When should you create a custom validator?",
          options: [
            "Whenever @IsString exists",
            "When the application needs a reusable rule that built-in validators do not cover",
            "For every controller",
            "Only for database migrations",
          ],
          correctIndex: 1,
          explanation: "Custom validators are useful for application-specific validation rules that are not adequately covered by built-in decorators.",
        },
        {
          question: "Where should a large business workflow usually live?",
          options: [
            "Inside a simple validation decorator",
            "Inside package.json",
            "Inside a service or domain layer",
            "Inside a TypeScript interface",
          ],
          correctIndex: 2,
          explanation: "Complex business workflows are usually better handled by services or domain logic.",
        },
      ],
    },

    {
      id: "built-in-and-custom-pipes",
      title: "Built-in pipes and creating your own pipes",
      durationMinutes: 14,
      explanation: `A <b>pipe</b> is a class that NestJS runs when it is processing arguments for a controller route handler.

Pipes have two main jobs:

<b>1. Validation</b>

They can check whether incoming data is acceptable.

<b>2. Transformation</b>

They can convert incoming data into the form your controller expects.

Nest provides several built-in pipes. The current documentation lists pipes including:

\`\`\`
ValidationPipe
StandardSchemaValidationPipe
ParseIntPipe
ParseFloatPipe
ParseBoolPipe
ParseArrayPipe
ParseUUIDPipe
ParseEnumPipe
DefaultValuePipe
ParseFilePipe
ParseDatePipe
\`\`\`

These are exported from \`@nestjs/common\`.


You do not need to create your own pipe every time you want to parse a value.

For example, route parameters arrive as strings.

Suppose the request is:

\`\`\`
GET /users/42
\`\`\`

Without transformation, the route parameter is essentially:

\`\`\`ts
"42"
\`\`\`

You can use \`ParseIntPipe\`:

\`\`\`ts
@Get(":id")
findUser(
  @Param("id", ParseIntPipe) id: number,
) {
  return this.usersService.findOne(id);
}
\`\`\`

Now Nest parses the parameter and passes a number to the controller when the value is valid.

If the client sends:

\`\`\`
GET /users/hello
\`\`\`

the pipe can reject the request instead of allowing an invalid integer to reach your service.

Another useful example is UUID validation:

\`\`\`ts
@Get(":id")
findUser(
  @Param("id", ParseUUIDPipe) id: string,
) {
  return this.usersService.findOne(id);
}
\`\`\`

You can also use pipes with query parameters.

For example:

\`\`\`ts
@Get()
findProducts(
  @Query("page", ParseIntPipe) page: number,
) {
  return this.productsService.findAll(page);
}
\`\`\`

<b>DefaultValuePipe</b>

Sometimes you want to provide a default value.

For example:

\`\`\`ts
@Get()
findProducts(
  @Query("page", new DefaultValuePipe(1), ParseIntPipe)
  page: number,
) {
  return this.productsService.findAll(page);
}
\`\`\`

Now:

\`\`\`
GET /products
\`\`\`

can use page 1.

While:

\`\`\`
GET /products?page=3
\`\`\`

uses page 3.

<b>Creating a custom pipe</b>

When Nest's built-in pipes do not express what you need, you can create your own.

A pipe implements the \`PipeTransform\` interface and provides a \`transform()\` method. Nest passes the value being processed into that method.


For example:

\`\`\`ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";

@Injectable()
export class PositiveIntPipe
  implements PipeTransform
{
  transform(value: string, metadata: ArgumentMetadata) {
    const numberValue = Number(value);

    if (
      !Number.isInteger(numberValue) ||
      numberValue <= 0
    ) {
      throw new BadRequestException(
        "Value must be a positive integer",
      );
    }

    return numberValue;
  }
}
\`\`\`

Then use it:

\`\`\`ts
@Get(":id")
findUser(
  @Param("id", PositiveIntPipe) id: number,
) {
  return this.usersService.findOne(id);
}
\`\`\`

The flow becomes:

\`\`\`
"id" from URL
     |
     v
PositiveIntPipe
     |
     +--> invalid ---> BadRequestException
     |
     +--> valid
            |
            v
       number value
            |
            v
        Controller
\`\`\`

Notice something important: the pipe returns the transformed value.

This means a pipe does not only say "yes" or "no."

It can also change what the controller receives.

For example:

\`\`\`
"42"
 |
 v
ParseIntPipe
 |
 v
42
\`\`\`

That is the transformation part of pipes.

<b>Pipe scope</b>

Pipes can be used at different levels.

Parameter level:

\`\`\`ts
@Get(":id")
find(@Param("id", ParseIntPipe) id: number) {}
\`\`\`

Method level:

\`\`\`ts
@Post()
@UsePipes(MyCustomPipe)
create(@Body() dto: CreateDto) {}
\`\`\`

Controller level:

\`\`\`ts
@UsePipes(MyCustomPipe)
@Controller("users")
export class UsersController {}
\`\`\`

Global level:

\`\`\`ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  }),
);
\`\`\`

This gives you flexibility.

A very specific parsing requirement can stay at the parameter level, while application-wide request validation can be global.

<b>Real-world beginner example:</b>

Use \`ParseIntPipe\` for:

\`\`\`
GET /products/25
\`\`\`

so the controller receives:

\`\`\`
25
\`\`\`

instead of:

\`\`\`
"25"
\`\`\`

<b>Real-world intermediate example:</b>

Create a pipe that converts a comma-separated query parameter:

\`\`\`
GET /products?tags=phone,laptop,tablet
\`\`\`

into:

\`\`\`ts
["phone", "laptop", "tablet"]
\`\`\`

<b>Real-world advanced example:</b>

An application may have a custom pipe that normalizes a domain-specific identifier before it reaches the service.

For example:

\`\`\`
" user_ ABC-123 "
        |
        v
NormalizeUserIdPipe
        |
        v
"user_ABC-123"
        |
        v
Controller
        |
        v
Service
\`\`\`

The important rule is to use pipes for work that belongs at the input boundary.

If the operation is about authorization, database workflows, or complex business decisions, it usually belongs somewhere else.`,
      diagram: `HTTP Request
     |
     v
Controller Parameter
     |
     v
+----------------------+
|        Pipe          |
|                      |
| transform(value)     |
+----------+-----------+
           |
       +---+---+
       |       |
    Invalid   Valid
       |       |
       v       v
    Exception  transformed value
                   |
                   v
               Controller
                   |
                   v
                Service

Built-in pipes handle common
validation and transformation tasks.
Custom pipes handle application-specific
input processing.`,
      codeExample: {
        title: "A custom positive integer pipe",
        code: `import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";

@Injectable()
export class PositiveIntPipe
  implements PipeTransform
{
  transform(
    value: string,
    metadata: ArgumentMetadata,
  ) {
    const parsed = Number(value);

    if (
      !Number.isInteger(parsed) ||
      parsed <= 0
    ) {
      throw new BadRequestException(
        "Value must be a positive integer",
      );
    }

    return parsed;
  }
}

// controller

@Get(":id")
findUser(
  @Param("id", PositiveIntPipe) id: number,
) {
  return this.usersService.findOne(id);
}`,
      },
      keyTakeaways: [
        "Pipes run around controller arguments and can validate or transform them.",
        "Nest provides many built-in pipes for common cases.",
        "ParseIntPipe converts and validates integer route or query parameters.",
        "ParseUUIDPipe validates UUID parameters.",
        "DefaultValuePipe can provide a value when input is missing.",
        "Custom pipes implement PipeTransform and provide a transform() method.",
        "A pipe can return a transformed value to the controller.",
      ],
      commonMistakes: [
        "<b>Creating a custom pipe when a built-in pipe already solves the problem.</b> Check Nest's built-in pipes first.",
        "<b>Forgetting to return the transformed value.</b> The controller receives the value returned by the pipe.",
        "<b>Putting database business logic into a simple parsing pipe.</b> Keep pipes focused on input processing.",
        "<b>Using a pipe for authorization.</b> Authentication and authorization have their own NestJS mechanisms.",
      ],
      quiz: [
        {
          question: "What method does a custom PipeTransform implement?",
          options: [
            "execute()",
            "handle()",
            "transform()",
            "processRequest()",
          ],
          correctIndex: 2,
          explanation: "A pipe implements PipeTransform and provides a transform() method.",
        },
        {
          question: "What does ParseIntPipe do?",
          options: [
            "Creates an integer database column",
            "Parses and validates an integer value",
            "Encrypts an integer",
            "Creates a new controller",
          ],
          correctIndex: 1,
          explanation: "ParseIntPipe converts an incoming value to an integer and rejects it when it cannot be parsed as a valid integer.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the main purpose of ValidationPipe?",
      options: [
        "To create database tables",
        "To validate incoming request data",
        "To define routes",
        "To start the NestJS server",
      ],
      correctIndex: 1,
      explanation: "ValidationPipe validates incoming data against validation rules before the controller handles it.",
    },
    {
      question: "Which package provides decorators such as @IsEmail() and @IsString()?",
      options: [
        "class-validator",
        "class-transformer",
        "@nestjs/core",
        "express",
      ],
      correctIndex: 0,
      explanation: "class-validator provides the validation decorators used by ValidationPipe.",
    },
    {
      question: "What does transform: true enable in ValidationPipe?",
      options: [
        "It starts the development server",
        "It enables transformation of incoming values and DTO payloads",
        "It disables validation",
        "It creates database entities",
      ],
      correctIndex: 1,
      explanation: "The transform option enables ValidationPipe to transform incoming payloads into the expected runtime representation.",
    },
    {
      question: "What does whitelist: true do?",
      options: [
        "Allows every property",
        "Removes properties that are not validated by the DTO",
        "Disables DTO validation",
        "Encrypts unknown properties",
      ],
      correctIndex: 1,
      explanation: "Whitelist removes properties that are not included as validated properties in the DTO.",
    },
    {
      question: "What happens when whitelist and forbidNonWhitelisted are both enabled?",
      options: [
        "Unknown properties are silently accepted",
        "Unknown properties can cause the request to fail validation",
        "All validation is disabled",
        "Only database errors are returned",
      ],
      correctIndex: 1,
      explanation: "With both options enabled, non-whitelisted properties cause validation to reject the request.",
    },
    {
      question: "Why might you use @Type(() => Number) in a DTO?",
      options: [
        "To create a database number column",
        "To help transform an incoming value into a number",
        "To validate an email",
        "To create a controller",
      ],
      correctIndex: 1,
      explanation: "class-transformer can use @Type(() => Number) to transform compatible incoming values into numbers.",
    },
    {
      question: "Which decorator can be used when a property is allowed to be missing?",
      options: [
        "@Required()",
        "@IgnoreMissing()",
        "@IsOptional()",
        "@AllowMissing()",
      ],
      correctIndex: 2,
      explanation: "@IsOptional() allows a property to be absent while allowing other validators to run when a value is provided.",
    },
    {
      question: "What should usually handle complex business rules such as checking whether a customer has enough account credit?",
      options: [
        "A simple @IsString() decorator",
        "A pipe only",
        "A service or domain/business layer",
        "package.json",
      ],
      correctIndex: 2,
      explanation: "Complex business rules generally belong in services or domain logic rather than basic input validation.",
    },
    {
      question: "What does ParseIntPipe do?",
      options: [
        "Parses and validates an integer value",
        "Validates an email",
        "Creates a DTO",
        "Starts the application",
      ],
      correctIndex: 0,
      explanation: "ParseIntPipe converts an incoming value into an integer and throws an exception if it is invalid.",
    },
    {
      question: "What interface should a custom NestJS pipe implement?",
      options: [
        "PipeInterface",
        "PipeTransform",
        "TransformController",
        "RequestPipe",
      ],
      correctIndex: 1,
      explanation: "Custom NestJS pipes implement the PipeTransform interface and provide a transform() method.",
    },
  ],

  project: {
    name: "Validated products API",
    goal: "Build a products API that validates, transforms, filters, and safely processes incoming request data using DTOs and NestJS pipes.",
    brief: `Build a small products API where every incoming request passes through a clear validation and transformation boundary.

The API should demonstrate the difference between validation and transformation instead of putting all input checking directly inside controller methods.

You will create DTOs for creating and updating products, configure a global ValidationPipe, validate query parameters, use built-in parsing pipes, create at least one custom pipe, and handle unexpected request properties.

The goal is not simply to make the endpoints work. The goal is to understand what happens to incoming data between the HTTP request and your controller.`,
    steps: [
      "Create a ProductsModule with a ProductsController and ProductsService.",
      "Create a CreateProductDto containing name, price, description, category, and stock fields.",
      "Use class-validator decorators to validate the product fields.",
      "Configure a global ValidationPipe in main.ts.",
      "Enable transform: true so compatible incoming values can be transformed.",
      "Enable whitelist: true so properties outside the validated DTO are removed.",
      "Experiment with forbidNonWhitelisted: true and observe how the API response changes.",
      "Create an UpdateProductDto where fields can be optional.",
      "Create a PaginationDto containing page and limit query parameters.",
      "Use class-transformer to transform pagination values into numbers.",
      "Use class-validator to ensure page and limit are valid positive integers.",
      "Use ParseIntPipe for a route parameter such as /products/:id.",
      "Use ParseUUIDPipe if your product IDs are UUIDs.",
      "Use DefaultValuePipe to provide a default pagination value.",
      "Create a custom PositiveIntPipe and use it on a route parameter.",
      "Create one application-specific custom validator.",
      "Test requests with valid data.",
      "Test requests with missing required fields.",
      "Test requests with incorrect data types.",
      "Test requests with invalid numbers.",
      "Test requests with unexpected properties.",
      "Test requests with invalid route parameters.",
      "Inspect which requests reach the controller and which requests are rejected before the controller executes.",
    ],
    acceptance: [
      "The application uses a global ValidationPipe.",
      "The project uses class-validator decorators on request DTOs.",
      "The project uses class-transformer for at least one transformation.",
      "The ValidationPipe has transform enabled.",
      "The ValidationPipe has whitelist enabled.",
      "The API demonstrates the behavior of forbidNonWhitelisted.",
      "Invalid request bodies are rejected before the service processes them.",
      "Pagination values are transformed and validated.",
      "At least one built-in parsing pipe is used.",
      "At least one custom pipe is created.",
      "At least one custom validator is created.",
      "Update requests correctly allow fields to be omitted.",
      "The controller does not contain large blocks of manual input validation.",
      "The service receives predictable and validated input.",
    ],
    stretch: [
      "Create a custom pipe that converts a comma-separated query parameter into an array.",
      "Create a custom validator for a product SKU format such as PROD-2026-ABC123.",
      "Add nested validation for a product supplier or shipping object.",
      "Add validation for an array of product tags.",
      "Create a custom validator that checks a domain-specific format.",
      "Experiment with a custom exceptionFactory for validation errors.",
      "Create different DTOs for admin product creation and public product creation.",
      "Add validation groups for different validation scenarios.",
      "Compare whitelist-only behavior with whitelist plus forbidNonWhitelisted.",
      "Add tests that verify invalid requests never reach the service.",
    ],
  },
};
