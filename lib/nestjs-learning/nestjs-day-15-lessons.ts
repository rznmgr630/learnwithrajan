import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_15_LESSONS: LessonDay = {
  day: 15,
  title: "NestJS Fundamentals Project",
  totalMinutes: 150,
  difficulty: "Beginner",
  lessons: [
    {
      id: "project-overview-and-architecture",
      title: "Project Overview and Architecture",
      durationMinutes: 20,
      explanation: `Today we are going to build a complete NestJS API from scratch.

The goal is not to build a huge production application. The goal is to take everything you have learned so far and use those concepts together in one realistic project.

We are going to build a small <b>Shop API</b>.

The application will have three main features:

- <b>Users</b> — customers who can use the shop.
- <b>Products</b> — products that are available in the shop.
- <b>Orders</b> — orders created by users for products.

At first, this application can use in-memory arrays instead of a real database. That is intentional. We are focusing on NestJS fundamentals rather than database setup.

Later, the same architecture can be connected to PostgreSQL, MySQL, MongoDB, or another database.

The important thing is that we are going to organize the application using feature modules.

Instead of putting everything into AppController and AppService, each feature will have its own module, controller, service, and DTOs.

For example, the Users feature will look like this:

\`users/
  users.module.ts
  users.controller.ts
  users.service.ts
  dto/
    create-user.dto.ts
    update-user.dto.ts
    user-response.dto.ts\`

The Products feature will have a similar structure.

The Orders feature will also have its own module.

This gives us a clean separation between different parts of the application.

Think about a real online store.

The code responsible for creating users should not be mixed into the code responsible for creating products.

The code responsible for creating an order should be able to use the Users and Products features without knowing how those features are implemented internally.

This is where NestJS modules and dependency injection become useful.

<b>The project architecture</b>

Our application will start with this structure:

\`src/
  main.ts

  app.module.ts

  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    dto/
      create-user.dto.ts
      update-user.dto.ts
      user-response.dto.ts

  products/
    products.module.ts
    products.controller.ts
    products.service.ts
    dto/
      create-product.dto.ts
      update-product.dto.ts
      product-response.dto.ts

  orders/
    orders.module.ts
    orders.controller.ts
    orders.service.ts
    dto/
      create-order.dto.ts
      update-order-status.dto.ts
      order-response.dto.ts

  common/
    pipes/
    validators/
    providers/\`

You do not have to create every file immediately.

We will create them step by step.

<b>What will happen when a request arrives?</b>

Suppose a client sends:

\`POST /products\`

with:

\`{
  "name": "Mechanical Keyboard",
  "price": 120,
  "stock": 25
}\`

The request will travel through the NestJS application.

The global ValidationPipe can validate and transform the request.

Then the ProductsController receives the request.

The controller passes the work to ProductsService.

The service performs the business operation.

The service returns the result.

The controller sends the response back to the client.

The flow looks like this:

\`Client
   |
   | POST /products
   v
Middleware
   |
   v
Guards
   |
   v
Interceptors
   |
   v
ValidationPipe
   |
   v
ProductsController
   |
   v
ProductsService
   |
   v
Product data
   |
   v
Response
   |
   v
Client\`

You may not implement every middleware, guard, or interceptor today. The purpose of the diagram is to connect this project with the request lifecycle you learned earlier.

<b>What we are going to build</b>

The Users API will support:

\`POST   /users
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id\`

The Products API will support:

\`POST   /products
GET    /products
GET    /products/:id
PATCH  /products/:id
DELETE /products/:id\`

The Orders API will support:

\`POST   /orders
GET    /orders
GET    /orders/:id
PATCH  /orders/:id/status
DELETE /orders/:id\`

The order creation operation will be more interesting because an order belongs to a user and contains products.

For example:

\`{
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}\`

The OrdersService will need to check that the user exists and that every requested product exists.

It will also calculate the order total.

This gives us a simple but realistic example of one feature using other features through dependency injection.

<b>Why this project is useful</b>

You have already learned individual NestJS concepts.

Now you need to understand how those concepts work together.

A controller by itself is not an application.

A service by itself is not an application.

A DTO by itself is not an application.

The real skill is knowing where each piece belongs and how the pieces communicate.

For example:

- Controllers handle HTTP requests.
- DTOs describe and validate incoming data.
- Services contain business logic.
- Modules organize related functionality.
- Providers allow dependencies to be injected.
- Pipes validate and transform values.
- Mapped types help create related DTOs.
- Exports allow providers to be used by other modules.
- Custom providers allow you to control how dependencies are created.
- The application bootstrap connects everything together.

By the end of this project, you should be able to look at a NestJS API and understand how its major pieces fit together.`,

      diagram: `                         NestJS Shop API

                              AppModule
                                 |
              +------------------+------------------+
              |                  |                  |
              v                  v                  v
          UsersModule       ProductsModule      OrdersModule
              |                  |                  |
              v                  v                  v
          Controller         Controller         Controller
              |                  |                  |
              v                  v                  v
           Service            Service            Service
              |                  |                  |
              v                  v                  v
           User Data        Product Data        Order Data

                              OrdersService
                                  |
                     +------------+------------+
                     |                         |
                     v                         v
                UsersService             ProductsService
                     |                         |
                     v                         v
                  Users                    Products`,

      codeExample: {
        title: "Initial application module",
        code: `import { Module } from "@nestjs/common";

import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { OrdersModule } from "./orders/orders.module";

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}`,
      },

      keyTakeaways: [
        "The project is a small Shop API containing Users, Products, and Orders.",
        "Each major feature gets its own NestJS module.",
        "Controllers handle HTTP requests.",
        "Services contain business logic.",
        "DTOs describe and validate request data.",
        "Modules connect the different parts of the application.",
        "Orders will use both users and products, giving us a realistic dependency-injection example.",
        "The project starts with in-memory data so the focus stays on NestJS fundamentals.",
      ],

      commonMistakes: [
        "<b>Putting everything in AppController.</b> AppController should not become a dumping ground for every feature in the application.",
        "<b>Putting business logic inside controllers.</b> Controllers should coordinate requests and delegate actual work to services.",
        "<b>Skipping DTOs.</b> DTOs give the application a clear contract for incoming data.",
        "<b>Making one giant service for the whole application.</b> Keep user, product, and order responsibilities separated.",
        "<b>Adding a database immediately.</b> A database is useful later, but it can hide the NestJS concepts you are currently learning.",
      ],

      quiz: [
        {
          question: "What is the main purpose of this project?",
          options: [
            "To learn SQL only",
            "To practice how NestJS concepts work together",
            "To build a frontend application",
            "To replace TypeScript",
          ],
          correctIndex: 1,
          explanation: "The project combines modules, controllers, services, dependency injection, DTOs, validation, pipes, and related NestJS concepts.",
        },
        {
          question: "Which feature should contain order business logic?",
          options: [
            "OrdersService",
            "main.ts",
            "AppModule",
            "package.json",
          ],
          correctIndex: 0,
          explanation: "Business logic for orders belongs in the OrdersService.",
        },
      ],
    },

    {
      id: "bootstrap-and-project-setup",
      title: "Step 1 — Create and Configure the NestJS Project",
      durationMinutes: 20,
      explanation: `Before building the features, create a clean NestJS project.

If you already have a NestJS project from previous lessons, you can use that project. Otherwise, create a new one with the Nest CLI.

The CLI is useful because it creates the standard NestJS project structure for you.

After creating the project, you should understand the important files instead of treating them as magic.

<b>main.ts</b>

This is where the NestJS application starts.

The application is created from the root AppModule.

This is also a good place to configure application-wide behavior.

For this project, we will configure a global ValidationPipe.

That means our DTO validation can work across the entire API.

We will use:

\`whitelist: true\`

This tells NestJS to remove properties that are not allowed by the DTO.

We will also use:

\`transform: true\`

This allows incoming values to be transformed into the expected DTO types when possible.

For example, a route parameter normally arrives from the URL as a string.

With transformation enabled and the appropriate type information, NestJS can transform values when a pipe or DTO requires it.

<b>Why global validation?</b>

Imagine we have 20 endpoints.

Without a global ValidationPipe, we would need to remember to configure validation behavior for every controller or route.

A global pipe gives us one consistent starting point.

<b>AppModule</b>

AppModule is the root module.

It connects our feature modules.

It does not need to contain all application logic.

Think of AppModule as the place where the major parts of the application are assembled.

<b>Removing unnecessary starter code</b>

The Nest CLI normally creates an example AppController and AppService.

For this project, you can remove the starter example after understanding it.

We want the application to represent our Shop API instead of the default Nest example.

<b>Project setup flow</b>

First create the project.

Then create the feature modules.

Then create controllers and services.

Then create DTOs.

Then configure validation.

Then implement each endpoint.

Do not try to build everything at once.

A good project is built in small steps where each step can be tested before moving forward.`,

      diagram: `Developer
    |
    | nest new shop-api
    v
Nest CLI
    |
    v
Project structure
    |
    +--> src/main.ts
    |
    +--> src/app.module.ts
    |
    +--> package.json
    |
    +--> tsconfig.json
    |
    v
Bootstrap application
    |
    v
AppModule
    |
    +--> UsersModule
    +--> ProductsModule
    +--> OrdersModule`,

      codeExample: {
        title: "main.ts with global validation",
        code: `import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

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

bootstrap();`,
      },

      keyTakeaways: [
        "main.ts is the bootstrap file of the NestJS application.",
        "AppModule is the root module.",
        "Global pipes can apply behavior consistently across the application.",
        "ValidationPipe connects DTO validation to incoming HTTP requests.",
        "whitelist removes properties that are not allowed by the DTO.",
        "transform enables transformation of incoming values when appropriate.",
        "Build the project incrementally instead of creating everything at once.",
      ],

      commonMistakes: [
        "<b>Putting business logic in main.ts.</b> main.ts should mainly bootstrap and configure the application.",
        "<b>Forgetting to register ValidationPipe.</b> DTO decorators do not magically validate requests without the validation system being connected.",
        "<b>Assuming whitelist means validation itself.</b> whitelist controls unknown properties; validation decorators still define what is valid.",
        "<b>Keeping unused starter code everywhere.</b> Remove the default example code once you understand what it does.",
      ],

      quiz: [
        {
          question: "What is the main purpose of main.ts?",
          options: [
            "Store database records",
            "Bootstrap and configure the NestJS application",
            "Define every controller",
            "Store DTOs",
          ],
          correctIndex: 1,
          explanation: "main.ts creates the Nest application and is commonly used for global configuration.",
        },
        {
          question: "What does whitelist do in ValidationPipe?",
          options: [
            "Creates database tables",
            "Removes properties that are not allowed by the DTO",
            "Creates controllers",
            "Starts the development server",
          ],
          correctIndex: 1,
          explanation: "whitelist strips properties that do not have validation decorators or otherwise belong to the DTO.",
        },
      ],
    },

    {
      id: "build-users-feature",
      title: "Step 2 — Build the Users Feature",
      durationMinutes: 25,
      explanation: `Start with the Users feature because it is the simplest of the three features.

A user will have:

- id
- name
- email
- age

For this fundamentals project, store users in an array inside UsersService.

This is not how you would normally persist important production data, but it makes the example easy to understand.

The important part is the architecture.

<b>UsersModule</b>

The module groups everything related to users.

It registers:

- UsersController
- UsersService

The UsersService is a provider.

The UsersController receives HTTP requests.

<b>UsersService</b>

The service owns the user data and operations.

For example:

\`create()
findAll()
findOne()
update()
remove()\`

The controller should not directly manipulate the users array.

Instead:

\`HTTP request
    |
    v
UsersController
    |
    v
UsersService
    |
    v
users array\`

This separation becomes very useful later.

If you replace the array with a database, the controller does not need to know about that change.

<b>CreateUserDto</b>

The DTO defines what the client is allowed to send.

For example:

\`name\` must be a string.

\`email\` must be a valid email.

\`age\` must be an integer greater than or equal to a chosen minimum.

The DTO becomes the boundary between untrusted HTTP input and your application logic.

<b>UpdateUserDto</b>

An update usually does not require every property.

A user might want to change only their name.

That means:

\`{
  "name": "John"
}\`

should be valid.

This is a good opportunity to use PartialType.

Instead of repeating all validation decorators manually, UpdateUserDto can be created from CreateUserDto using PartialType.

<b>Response DTO</b>

We will also create a response DTO.

This teaches an important idea:

The object received from the client and the object returned to the client do not necessarily have to be the same shape.

Later, imagine a User entity contains:

\`passwordHash\`
\`internalNotes\`
\`createdByAdminId\`

You probably would not want to return all of those fields to the client.

Separating request and response shapes becomes important as applications grow.

<b>Real-world example</b>

Imagine a registration endpoint.

The client sends:

\`{
  "name": "Sarah",
  "email": "sarah@example.com",
  "password": "secret-password"
}\`

The server may store a password hash.

The response should not return that password hash.

That is why request DTOs and response DTOs have different jobs.

Even though our simple project does not implement authentication yet, the architecture should prepare you for that kind of situation.`,

      diagram: `POST /users
     |
     v
UsersController
     |
     | createUserDto
     v
UsersService
     |
     | validate business rules
     | create user
     v
User data
     |
     v
Response DTO
     |
     v
HTTP Response`,

      codeExample: {
        title: "Users DTOs, service, controller, and module",
        code: `// users/dto/create-user.dto.ts
import {
  IsEmail,
  IsInt,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(13)
  age: number;
}


// users/dto/update-user.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}


// users/dto/user-response.dto.ts
export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  age: number;
}


// users/users.service.ts
import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

@Injectable()
export class UsersService {
  private users: User[] = [];

  private nextId = 1;

  create(createUserDto: CreateUserDto) {
    const user: User = {
      id: this.nextId++,
      ...createUserDto,
    };

    this.users.push(user);

    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);

    Object.assign(user, updateUserDto);

    return user;
  }

  remove(id: number) {
    const user = this.findOne(id);

    this.users = this.users.filter((item) => item.id !== id);

    return user;
  }
}


// users/users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(
      id,
      updateUserDto,
    );
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.usersService.remove(id);
  }
}


// users/users.module.ts
import { Module } from "@nestjs/common";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}`,
      },

      keyTakeaways: [
        "The UsersModule owns the users feature.",
        "The UsersController handles HTTP routes.",
        "The UsersService contains user business logic.",
        "CreateUserDto defines and validates incoming user data.",
        "PartialType is useful for update DTOs.",
        "ParseIntPipe converts and validates the id route parameter.",
        "The service can throw NestJS HTTP exceptions such as NotFoundException.",
        "Exporting UsersService allows another module to inject it.",
      ],

      commonMistakes: [
        "<b>Using req.body directly everywhere.</b> Use DTOs and @Body() so the request has a clear structure.",
        "<b>Keeping id as an unvalidated string.</b> Use ParseIntPipe when the application expects a numeric ID.",
        "<b>Returning sensitive fields.</b> In a real application, response DTOs should prevent accidental exposure of internal fields.",
        "<b>Forgetting to export UsersService.</b> Another module cannot inject a provider from UsersModule unless it is available through the module's exports.",
        "<b>Putting the users array inside the controller.</b> Keep data operations in the service.",
      ],

      quiz: [
        {
          question: "Where should the user business logic live?",
          options: [
            "UsersController",
            "UsersService",
            "main.ts",
            "AppModule",
          ],
          correctIndex: 1,
          explanation: "The service is responsible for the business operations of the Users feature.",
        },
        {
          question: "Why is PartialType useful for UpdateUserDto?",
          options: [
            "It makes every property required",
            "It makes the properties optional while preserving the DTO structure",
            "It creates a database table",
            "It starts the server",
          ],
          correctIndex: 1,
          explanation: "Updates often allow changing only some properties, so PartialType is useful for creating partial DTOs.",
        },
      ],
    },

    {
      id: "build-products-feature",
      title: "Step 3 — Build the Products Feature",
      durationMinutes: 25,
      explanation: `Now build the Products feature.

Products are slightly more interesting because we need fields that represent typical store information.

A product will have:

\`id
name
description
price
stock
category\`

The client should not be allowed to send an arbitrary product object.

For example, this should be rejected:

\`{
  "name": "Keyboard",
  "price": "cheap",
  "stock": "a lot"
}\`

The DTO and ValidationPipe should catch invalid values before they reach the service.

<b>Product creation</b>

The CreateProductDto should validate:

- name is a string
- name has a reasonable minimum length
- description is a string
- price is a number
- price is positive
- stock is an integer
- stock is not negative
- category is a string

This is a good example of how DTO validation protects the service from obviously invalid input.

<b>Query parameters</b>

We will also make the Products API support a simple search.

For example:

\`GET /products?search=keyboard\`

The controller can read the query parameter with @Query().

We can also support:

\`GET /products?category=electronics\`

The service can then filter the in-memory products.

This gives you practice with query parameters in a realistic API.

<b>Route parameters vs query parameters</b>

A route parameter identifies a specific resource:

\`GET /products/10\`

Here, 10 is the product ID.

A query parameter changes or filters a request:

\`GET /products?category=electronics\`

These are different concepts.

<b>Price validation</b>

For this learning project, you can represent price as a number.

In a real financial system, you should think carefully about money representation.

Floating-point numbers can produce precision problems.

Production applications commonly use integer minor units, such as cents, or a database decimal type.

For example:

\`1999\`

could represent $19.99.

You do not need to implement that more advanced money model today, but understanding the issue is valuable.

<b>Business logic</b>

The ProductsService should contain product operations.

For example:

- create a product
- find all products
- find one product
- search products
- update a product
- remove a product

The controller should mainly connect HTTP input to those service methods.

This is an important pattern you should repeat throughout the project.`,

      diagram: `GET /products?category=electronics
                |
                v
        ProductsController
                |
          @Query()
                |
                v
         ProductsService
                |
       +--------+--------+
       |                 |
       v                 v
    Search            Filter
       |                 |
       +--------+--------+
                |
                v
         Product results
                |
                v
             Client`,

      codeExample: {
        title: "Products feature",
        code: `// products/dto/create-product.dto.ts
import {
  IsInt,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  category: string;
}


// products/dto/update-product.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";

export class UpdateProductDto extends PartialType(CreateProductDto) {}


// products/products.service.ts
import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
};

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  private nextId = 1;

  create(createProductDto: CreateProductDto) {
    const product: Product = {
      id: this.nextId++,
      ...createProductDto,
    };

    this.products.push(product);

    return product;
  }

  findAll(search?: string, category?: string) {
    let results = this.products;

    if (search) {
      const normalizedSearch = search.toLowerCase();

      results = results.filter((product) =>
        product.name
          .toLowerCase()
          .includes(normalizedSearch),
      );
    }

    if (category) {
      results = results.filter(
        (product) =>
          product.category.toLowerCase() ===
          category.toLowerCase(),
      );
    }

    return results;
  }

  findOne(id: number) {
    const product = this.products.find(
      (item) => item.id === id,
    );

    if (!product) {
      throw new NotFoundException(
        "Product not found",
      );
    }

    return product;
  }

  update(
    id: number,
    updateProductDto: UpdateProductDto,
  ) {
    const product = this.findOne(id);

    Object.assign(product, updateProductDto);

    return product;
  }

  remove(id: number) {
    const product = this.findOne(id);

    this.products = this.products.filter(
      (item) => item.id !== id,
    );

    return product;
  }
}


// products/products.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("category") category?: string,
  ) {
    return this.productsService.findAll(
      search,
      category,
    );
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.productsService.remove(id);
  }
}


// products/products.module.ts
import { Module } from "@nestjs/common";

import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}`,
      },

      keyTakeaways: [
        "Products use DTO validation to protect the service from invalid input.",
        "Query parameters are useful for filtering and searching collections.",
        "Route parameters identify a specific resource.",
        "ParseIntPipe is useful when route IDs should be numbers.",
        "Product business logic belongs in ProductsService.",
        "ProductsModule exports ProductsService because OrdersModule will need product information.",
        "Money handling requires additional care in production applications.",
      ],

      commonMistakes: [
        "<b>Confusing /products/:id with /products?search=.</b> The first uses a route parameter; the second uses a query parameter.",
        "<b>Trusting price and stock from the client.</b> DTO validation should establish basic input rules, while the service should enforce business rules.",
        "<b>Allowing negative stock.</b> Business data should have meaningful constraints.",
        "<b>Putting filtering logic in the controller.</b> The controller should read the query and delegate the operation to the service.",
      ],

      quiz: [
        {
          question: "Which URL uses a query parameter?",
          options: [
            "/products/10",
            "/products?category=electronics",
            "/products/create",
            "/products/:id",
          ],
          correctIndex: 1,
          explanation: "category=electronics is a query parameter.",
        },
        {
          question: "Which layer should contain product search logic?",
          options: [
            "ProductsService",
            "main.ts",
            "DTO",
            "AppModule",
          ],
          correctIndex: 0,
          explanation: "The service contains the business operation that performs the search.",
        },
      ],
    },

    {
      id: "build-orders-feature-and-module-communication",
      title: "Step 4 — Build Orders and Connect Modules",
      durationMinutes: 35,
      explanation: `Now we reach the most important part of the project.

The Orders feature needs information from both Users and Products.

An order belongs to a user.

An order contains one or more products.

That means OrdersService needs access to:

\`UsersService
ProductsService\`

This is where the module system and dependency injection become much more meaningful.

<b>Order structure</b>

A simple order can look like this:

\`{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "total": 240,
  "status": "pending"
}\`

The client should provide:

- userId
- items
- productId for each item
- quantity for each item

The server should calculate:

- order ID
- total
- initial status

The client should not be trusted to calculate the final order total.

For example, imagine a product costs $100.

A malicious client could send:

\`{
  "productId": 1,
  "quantity": 2,
  "total": 1
}\`

The server should ignore the client-provided total.

The server should load the real product price and calculate:

\`100 × 2 = 200\`

This is an important business rule.

<b>Checking the user</b>

When an order is created, OrdersService should ask UsersService to find the user.

If the user does not exist, the order should not be created.

<b>Checking products</b>

For every order item, OrdersService should ask ProductsService to find the product.

If a product does not exist, the order should not be created.

<b>Calculating the total</b>

Suppose the order contains:

\`Keyboard
price = 100
quantity = 2

Mouse
price = 50
quantity = 1\`

The total is:

\`(100 × 2) + (50 × 1) = 250\`

This calculation belongs in the service because it is business logic.

<b>Module communication</b>

For OrdersModule to inject UsersService and ProductsService, OrdersModule must import UsersModule and ProductsModule.

Those modules must export their services.

The relationship looks like this:

\`UsersModule
    |
    | exports UsersService
    v
OrdersModule
    ^
    | exports ProductsService
    |
ProductsModule\`

Then OrdersService can use constructor injection:

\`constructor(
  private readonly usersService: UsersService,
  private readonly productsService: ProductsService,
) {}\`

NestJS sees those dependencies and resolves them through its dependency injection system.

This is much better than manually creating services inside the OrdersService.

Do not write:

\`new UsersService()
new ProductsService()\`

NestJS should manage those dependencies.

<b>Why?</b>

Because dependency injection gives the application a clear structure.

It also makes testing easier.

Later, you could replace the real UsersService with a fake provider during a unit test.

<b>Order status</b>

We can define simple statuses:

\`pending
confirmed
shipped
delivered
cancelled\`

The order starts as pending.

Then we can provide a route:

\`PATCH /orders/:id/status\`

with:

\`{
  "status": "confirmed"
}\`

The DTO validates that the incoming status is one of the allowed values.

<b>Real-world example</b>

This pattern is similar to what happens in a real e-commerce backend.

An order service might depend on:

- customer service
- product catalog service
- inventory service
- payment service
- shipping service

Our project uses only UsersService and ProductsService so the architecture stays understandable.

The important lesson is that a service can coordinate other services while each service keeps responsibility for its own feature.`,

      diagram: `                    POST /orders
                         |
                         v
                 OrdersController
                         |
                         v
                  OrdersService
                    /       \\
                   /         \\
                  v           v
           UsersService   ProductsService
                |               |
                v               v
             User data      Product data
                                |
                                v
                         Calculate prices
                                |
                                v
                           Create Order
                                |
                                v
                            Response


Module dependency:

       UsersModule
           |
           | exports UsersService
           v
       OrdersModule
           ^
           | exports ProductsService
           |
      ProductsModule`,

      codeExample: {
        title: "Orders DTOs, service, controller, and module",
        code: `// orders/dto/create-order-item.dto.ts
import {
  IsInt,
  Min,
} from "class-validator";

export class CreateOrderItemDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}


// orders/dto/create-order.dto.ts
import {
  IsInt,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import { CreateOrderItemDto } from "./create-order-item.dto";

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  userId: number;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}


// orders/dto/update-order-status.dto.ts
import {
  IsEnum,
} from "class-validator";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}


// orders/orders.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { UsersService } from "../users/users.service";
import { ProductsService } from "../products/products.service";

import { CreateOrderDto } from "./dto/create-order.dto";
import {
  OrderStatus,
} from "./dto/update-order-status.dto";

type OrderItem = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
};

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  private nextId = 1;

  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const user = this.usersService.findOne(
      createOrderDto.userId,
    );

    if (!createOrderDto.items.length) {
      throw new BadRequestException(
        "An order must contain at least one item",
      );
    }

    const items: OrderItem[] =
      createOrderDto.items.map((item) => {
        const product =
          this.productsService.findOne(
            item.productId,
          );

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            \`Not enough stock for product \${product.id}\`,
          );
        }

        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        };
      });

    const total = items.reduce(
      (sum, item) =>
        sum + item.unitPrice * item.quantity,
      0,
    );

    const order: Order = {
      id: this.nextId++,
      userId: user.id,
      items,
      total,
      status: OrderStatus.PENDING,
    };

    this.orders.push(order);

    return order;
  }

  findAll() {
    return this.orders;
  }

  findOne(id: number) {
    const order = this.orders.find(
      (item) => item.id === id,
    );

    if (!order) {
      throw new NotFoundException(
        "Order not found",
      );
    }

    return order;
  }

  updateStatus(
    id: number,
    status: OrderStatus,
  ) {
    const order = this.findOne(id);

    order.status = status;

    return order;
  }

  remove(id: number) {
    const order = this.findOne(id);

    this.orders = this.orders.filter(
      (item) => item.id !== id,
    );

    return order;
  }
}


// orders/orders.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.ordersService.findOne(id);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      id,
      dto.status,
    );
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.ordersService.remove(id);
  }
}


// orders/orders.module.ts
import { Module } from "@nestjs/common";

import { UsersModule } from "../users/users.module";
import { ProductsModule } from "../products/products.module";

import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    UsersModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}`,
      },

      keyTakeaways: [
        "OrdersService demonstrates real dependency injection between feature modules.",
        "OrdersModule imports UsersModule and ProductsModule.",
        "UsersModule and ProductsModule export their services so OrdersService can use them.",
        "OrdersService should calculate the order total from trusted product prices.",
        "The client should not control the final order total.",
        "Nested DTOs can validate complex request bodies.",
        "Business rules such as stock checks belong in the service layer.",
        "Constructor injection lets NestJS resolve dependencies automatically.",
      ],

      commonMistakes: [
        "<b>Creating services with new.</b> Let NestJS resolve injected services through the DI container.",
        "<b>Forgetting module exports.</b> A provider must be available outside its module through exports.",
        "<b>Putting order calculation in the controller.</b> Price calculation is business logic and belongs in OrdersService.",
        "<b>Trusting the client-provided total.</b> Calculate important financial values on the server.",
        "<b>Checking only that productId exists.</b> A real order operation should also apply business rules such as stock availability.",
        "<b>Making OrdersModule directly access another module's private data.</b> Use the public service interface exposed by that module.",
      ],

      quiz: [
        {
          question: "Why does OrdersModule import UsersModule?",
          options: [
            "To access UsersService",
            "To access main.ts",
            "To create another server",
            "To replace the controller",
          ],
          correctIndex: 0,
          explanation: "OrdersService needs UsersService to verify users and obtain user information.",
        },
        {
          question: "Where should the order total be calculated?",
          options: [
            "The client",
            "OrdersController",
            "OrdersService",
            "main.ts",
          ],
          correctIndex: 2,
          explanation: "The server-side service should calculate business values such as the order total.",
        },
      ],
    },

    {
      id: "validation-pipes-and-final-project-testing",
      title: "Step 5 — Validation, Pipes, Testing, and Final Integration",
      durationMinutes: 25,
      explanation: `At this point, the three features exist.

Now we need to make the API behave like one coherent application.

This step is about testing the boundaries between our concepts.

<b>Test invalid input</b>

Do not only test successful requests.

A beginner mistake is to send one valid request, see a 201 response, and assume the API works.

A real API needs to handle invalid input.

For example:

\`POST /users

{
  "name": "",
  "email": "not-an-email",
  "age": -5
}\`

The request should fail validation.

Try another example:

\`POST /products

{
  "name": "Keyboard",
  "price": -100,
  "stock": -20,
  "category": "electronics"
}\`

The DTO validation should reject the invalid values.

Try an order with a missing user:

\`POST /orders

{
  "userId": 99999,
  "items": [
    {
      "productId": 1,
      "quantity": 1
    }
  ]
}\`

The service should reject the request because the user does not exist.

<b>Why test the layers separately?</b>

Suppose an invalid request gets through.

There are several possible places where the problem could be:

- The DTO may not contain the right validation decorator.
- ValidationPipe may not be configured.
- The controller may be reading the request incorrectly.
- The service may not enforce a business rule.
- A dependency may not be registered correctly.

Thinking in layers makes debugging much easier.

<b>Built-in pipes</b>

We already used ParseIntPipe.

For example:

\`@Param("id", ParseIntPipe) id: number\`

This means:

1. Read id from the route.
2. Pass it through ParseIntPipe.
3. Convert the value to a number.
4. Reject invalid values.
5. Give the controller a number.

This is a small example of how pipes fit into the request lifecycle.

<b>Request lifecycle in our project</b>

When someone sends:

\`POST /orders\`

the conceptual flow is:

\`HTTP Request
     |
     v
ValidationPipe
     |
     v
OrdersController
     |
     v
CreateOrderDto
     |
     v
OrdersService
     |
     +----> UsersService
     |
     +----> ProductsService
     |
     v
Order created
     |
     v
HTTP Response\`

This is the architecture you should be able to explain after completing the project.

<b>Test the complete flow</b>

A useful test sequence is:

1. Create a user.
2. Create two products.
3. Get all users.
4. Get all products.
5. Search for a product.
6. Create an order using the user and products.
7. Get the created order.
8. Change the order status.
9. Get the order again.
10. Try invalid requests.
11. Try an order with an unknown user.
12. Try an order with an unknown product.
13. Try ordering more stock than exists.

This sequence tests much more than simple CRUD.

<b>What you should notice</b>

When creating an order, the OrdersController does not know how users are stored.

It does not know how products are stored.

It simply receives the HTTP request and calls OrdersService.

OrdersService asks UsersService and ProductsService for the information it needs.

That is the benefit of separating responsibilities.

<b>Beginner-level understanding</b>

At the beginner level, think of the architecture like a restaurant.

The controller is the waiter.

The waiter receives your order.

The service is the kitchen.

The kitchen actually performs the work.

The module is the section of the restaurant that groups related staff and responsibilities.

Dependency injection is like the restaurant providing the kitchen with the ingredients or equipment it needs instead of the kitchen having to create everything itself.

DTO validation is like checking the order ticket before sending it to the kitchen.

If the customer says:

\`quantity = "ten million"\`

when the system expects a positive integer, the request can be rejected before it reaches the business logic.

<b>Intermediate understanding</b>

At the intermediate level, start thinking about boundaries.

The controller is an HTTP boundary.

The DTO is an input contract.

The service is a business-logic boundary.

The module is a dependency boundary.

The provider system is a construction and dependency boundary.

This separation means that changing one layer does not necessarily require rewriting the others.

<b>Advanced understanding</b>

At the advanced level, notice that the project is intentionally designed so that the in-memory arrays can later be replaced.

For example, today:

\`UsersService
    |
    v
In-memory array\`

Later:

\`UsersService
    |
    v
Repository
    |
    v
PostgreSQL\`

The controller does not need to know whether the data comes from an array, PostgreSQL, Redis, or another system.

That is one of the major benefits of dependency inversion and provider-based architecture.

The project is small, but the architecture points toward the same ideas used in larger applications.

<b>Final integration goal</b>

By the end of this lesson, you should not simply have three working controllers.

You should understand why the application is divided into modules, why services are providers, why DTOs exist, why validation belongs at the boundary, why dependencies are injected, and why business logic should not be placed directly inside controllers.

That understanding is more important than the number of endpoints you create.`,

      diagram: `                         CLIENT
                            |
                            v
                     HTTP Request
                            |
                            v
                  Global ValidationPipe
                            |
                            v
                     Feature Module
                            |
                            v
                       Controller
                            |
                            v
                         Service
                       /    |    \\
                      /     |     \\
                     v      v      v
                 Provider  Other   Business
                           Service   Logic
                            |
                            v
                          Data
                            |
                            v
                       HTTP Response


Example:

POST /orders
      |
      v
ValidationPipe
      |
      v
OrdersController
      |
      v
OrdersService
      |
      +--------------------+
      |                    |
      v                    v
UsersService        ProductsService
      |                    |
      v                    v
 User exists?        Product exists?
                         |
                         v
                    Check stock
                         |
                         v
                   Calculate total
                         |
                         v
                    Create order`,

      codeExample: {
        title: "Final AppModule and application structure",
        code: `// src/app.module.ts
import { Module } from "@nestjs/common";

import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { OrdersModule } from "./orders/orders.module";

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}


// src/main.ts
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

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

bootstrap();`,
      },

      keyTakeaways: [
        "Always test both valid and invalid requests.",
        "DTO validation protects the application boundary.",
        "Business rules still belong in services even when DTO validation exists.",
        "ParseIntPipe is useful for numeric route parameters.",
        "OrdersService demonstrates coordination between multiple feature services.",
        "The final AppModule should assemble the Users, Products, and Orders modules.",
        "The architecture is intentionally ready to replace in-memory storage with a database later.",
        "Understanding how the layers communicate is more important than memorizing individual decorators.",
      ],

      commonMistakes: [
        "<b>Testing only successful requests.</b> Invalid requests reveal whether validation and business rules actually work.",
        "<b>Thinking DTO validation replaces business validation.</b> DTOs validate input shape and basic constraints; services enforce application-specific business rules.",
        "<b>Putting every check in the controller.</b> Controllers should stay focused on HTTP concerns.",
        "<b>Ignoring module boundaries.</b> If a service needs another feature, use module imports, exports, and dependency injection.",
        "<b>Assuming an in-memory array is production storage.</b> It is being used here only to focus on NestJS fundamentals.",
      ],

      quiz: [
        {
          question: "What should happen before invalid request data reaches business logic?",
          options: [
            "It should be validated",
            "It should be stored",
            "It should be logged as a success",
            "It should bypass the DTO",
          ],
          correctIndex: 0,
          explanation: "Validation should reject invalid input at the application boundary before business logic processes it.",
        },
        {
          question: "Which layer should enforce a rule such as 'there is not enough stock'?",
          options: [
            "OrdersService",
            "main.ts",
            "AppModule",
            "The URL",
          ],
          correctIndex: 0,
          explanation: "Stock availability is a business rule and belongs in the service layer.",
        },
        {
          question: "Why does OrdersService inject UsersService and ProductsService?",
          options: [
            "To reuse their feature logic through dependency injection",
            "To make the controllers unnecessary",
            "To create two HTTP servers",
            "To bypass DTO validation",
          ],
          correctIndex: 0,
          explanation: "Dependency injection allows OrdersService to use the public functionality provided by the other feature services.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the main responsibility of a NestJS controller?",
      options: [
        "Handle HTTP requests and delegate work",
        "Store all database records",
        "Define every business rule",
        "Bootstrap the Node.js process",
      ],
      correctIndex: 0,
      explanation: "Controllers handle the HTTP layer and normally delegate business operations to providers or services.",
    },
    {
      question: "Where should most business logic for creating an order live?",
      options: [
        "OrdersService",
        "main.ts",
        "OrdersModule metadata",
        "CreateOrderDto",
      ],
      correctIndex: 0,
      explanation: "The service layer is responsible for business operations such as checking products, checking stock, and calculating totals.",
    },
    {
      question: "Why does OrdersModule import UsersModule?",
      options: [
        "So OrdersService can use UsersService",
        "So UsersController becomes an OrdersController",
        "So the application can listen on another port",
        "So DTO validation stops working",
      ],
      correctIndex: 0,
      explanation: "Module imports make exported providers from another module available for dependency injection.",
    },
    {
      question: "What must UsersModule do if UsersService needs to be used by OrdersModule?",
      options: [
        "Export UsersService",
        "Delete UsersService",
        "Put UsersService in main.ts",
        "Make UsersService a controller",
      ],
      correctIndex: 0,
      explanation: "A provider that needs to be consumed by another module must be exported from its module.",
    },
    {
      question: "Which value should the server calculate instead of trusting the client?",
      options: [
        "The final order total",
        "The HTTP method",
        "The route path",
        "The controller name",
      ],
      correctIndex: 0,
      explanation: "Financial calculations such as order totals should be calculated from trusted server-side product data.",
    },
    {
      question: "What is the purpose of CreateOrderDto?",
      options: [
        "Define and validate the expected order input",
        "Start the application",
        "Connect directly to PostgreSQL",
        "Replace OrdersService",
      ],
      correctIndex: 0,
      explanation: "The DTO defines the structure and validation rules for incoming order data.",
    },
    {
      question: "What does ParseIntPipe help with?",
      options: [
        "Validating and transforming a route parameter into an integer",
        "Creating a module",
        "Starting the server",
        "Creating a database",
      ],
      correctIndex: 0,
      explanation: "ParseIntPipe parses a value as an integer and rejects invalid values.",
    },
    {
      question: "Which URL contains a route parameter?",
      options: [
        "/products/25",
        "/products?category=books",
        "/products?search=keyboard",
        "/products",
      ],
      correctIndex: 0,
      explanation: "The 25 in /products/25 is a route parameter.",
    },
    {
      question: "Which URL contains a query parameter?",
      options: [
        "/products?category=electronics",
        "/products/10",
        "/products/create",
        "/products/:id",
      ],
      correctIndex: 0,
      explanation: "category=electronics is a query parameter.",
    },
    {
      question: "Why are DTOs useful?",
      options: [
        "They provide a clear contract for incoming data and validation",
        "They replace every service",
        "They automatically create database tables",
        "They make controllers unnecessary",
      ],
      correctIndex: 0,
      explanation: "DTOs define the expected shape of incoming data and work with validation tools to protect the application boundary.",
    },
    {
      question: "What is the purpose of PartialType in an update DTO?",
      options: [
        "Make the properties optional while deriving them from another DTO",
        "Make every property required",
        "Create a new HTTP server",
        "Delete all validation rules",
      ],
      correctIndex: 0,
      explanation: "PartialType is useful when an update can contain only some of the properties from the create DTO.",
    },
    {
      question: "Why should the project use separate UsersModule, ProductsModule, and OrdersModule?",
      options: [
        "To organize features and their dependencies",
        "Because NestJS only supports three modules",
        "To avoid using services",
        "To prevent controllers from working",
      ],
      correctIndex: 0,
      explanation: "Feature modules create clear boundaries around related functionality.",
    },
    {
      question: "What does whitelist: true do in ValidationPipe?",
      options: [
        "Removes properties that are not allowed by the DTO",
        "Makes all properties optional",
        "Creates a database",
        "Converts every string into a number",
      ],
      correctIndex: 0,
      explanation: "whitelist removes properties that do not belong to the validated DTO.",
    },
    {
      question: "Which component should normally contain business rules such as checking stock?",
      options: [
        "Service",
        "Controller",
        "DTO",
        "main.ts",
      ],
      correctIndex: 0,
      explanation: "Business rules belong in the service layer.",
    },
    {
      question: "What is dependency injection helping us avoid in OrdersService?",
      options: [
        "Manually creating dependencies with new",
        "Using TypeScript",
        "Using controllers",
        "Using DTOs",
      ],
      correctIndex: 0,
      explanation: "NestJS's DI container creates and supplies dependencies such as UsersService and ProductsService.",
    },
  ],

  project: {
    name: "Shop API — Users, Products, and Orders",
    goal: "Build a modular NestJS REST API that combines controllers, services, dependency injection, modules, DTOs, validation, pipes, mapped types, and feature-to-feature communication.",
    brief: `Build a complete beginner-friendly Shop API from scratch.

The API should contain three independent feature modules:

1. Users
2. Products
3. Orders

Do not start with a database. Use in-memory arrays so that the focus remains on NestJS architecture.

The final application should demonstrate the concepts learned throughout Days 6–14.

The project should have:

src/
  main.ts
  app.module.ts

  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    dto/
      create-user.dto.ts
      update-user.dto.ts
      user-response.dto.ts

  products/
    products.module.ts
    products.controller.ts
    products.service.ts
    dto/
      create-product.dto.ts
      update-product.dto.ts
      product-response.dto.ts

  orders/
    orders.module.ts
    orders.controller.ts
    orders.service.ts
    dto/
      create-order.dto.ts
      create-order-item.dto.ts
      update-order-status.dto.ts
      order-response.dto.ts

Your job is not simply to make the endpoints work.

You should be able to explain why each file exists, why each class belongs in its module, why the controller calls the service, why the service receives dependencies through constructor injection, and why DTOs are used at the HTTP boundary.`,

    steps: [
      "Create a new NestJS project using the Nest CLI.",
      "Run the development server and verify that the application starts successfully.",
      "Open main.ts and understand how NestFactory creates the application.",
      "Configure a global ValidationPipe in main.ts.",
      "Enable whitelist so unknown DTO properties are removed.",
      "Enable transform so incoming values can be transformed where appropriate.",
      "Create the UsersModule using the Nest CLI.",
      "Create UsersController and UsersService.",
      "Register UsersController and UsersService in UsersModule.",
      "Create CreateUserDto with validation decorators.",
      "Add name validation to CreateUserDto.",
      "Add email validation to CreateUserDto.",
      "Add age validation to CreateUserDto.",
      "Create UpdateUserDto using PartialType(CreateUserDto).",
      "Create a UserResponseDto and decide which user fields should be returned.",
      "Create an in-memory users array inside UsersService.",
      "Implement UsersService.create().",
      "Implement UsersService.findAll().",
      "Implement UsersService.findOne().",
      "Throw NotFoundException when a requested user does not exist.",
      "Implement UsersService.update().",
      "Implement UsersService.remove().",
      "Create POST /users.",
      "Create GET /users.",
      "Create GET /users/:id.",
      "Use ParseIntPipe for the user ID.",
      "Create PATCH /users/:id.",
      "Create DELETE /users/:id.",
      "Export UsersService from UsersModule because another feature will need it.",
      "Create the ProductsModule.",
      "Create ProductsController and ProductsService.",
      "Create CreateProductDto.",
      "Validate product name, description, price, stock, and category.",
      "Create UpdateProductDto using PartialType(CreateProductDto).",
      "Create ProductResponseDto.",
      "Create an in-memory products array.",
      "Implement product creation.",
      "Implement product listing.",
      "Implement product lookup by ID.",
      "Implement product updates.",
      "Implement product deletion.",
      "Create GET /products?search=... for product searching.",
      "Create GET /products?category=... for category filtering.",
      "Use ParseIntPipe for product IDs.",
      "Export ProductsService from ProductsModule.",
      "Create the OrdersModule.",
      "Create OrdersController and OrdersService.",
      "Create CreateOrderItemDto.",
      "Validate productId as a positive integer.",
      "Validate quantity as a positive integer.",
      "Create CreateOrderDto.",
      "Validate userId.",
      "Use ValidateNested for order items.",
      "Use class-transformer's Type decorator so nested DTO validation works correctly.",
      "Create an OrderStatus enum.",
      "Create UpdateOrderStatusDto using IsEnum.",
      "Create an in-memory orders array.",
      "Inject UsersService into OrdersService using constructor injection.",
      "Inject ProductsService into OrdersService using constructor injection.",
      "Import UsersModule into OrdersModule.",
      "Import ProductsModule into OrdersModule.",
      "Verify that UsersModule exports UsersService.",
      "Verify that ProductsModule exports ProductsService.",
      "Implement OrdersService.create().",
      "Check that the requested user exists.",
      "Check that at least one order item was supplied.",
      "Check that every requested product exists.",
      "Check that enough stock is available.",
      "Calculate the order total using server-side product prices.",
      "Do not accept a client-provided total.",
      "Set the initial order status to pending.",
      "Implement GET /orders.",
      "Implement GET /orders/:id.",
      "Implement PATCH /orders/:id/status.",
      "Implement DELETE /orders/:id.",
      "Add appropriate NotFoundException responses.",
      "Add appropriate BadRequestException responses for invalid business operations.",
      "Register UsersModule, ProductsModule, and OrdersModule inside AppModule.",
      "Start the application in development mode.",
      "Create at least one user through POST /users.",
      "Create at least two products through POST /products.",
      "Retrieve the users and products with GET requests.",
      "Search for products using a query parameter.",
      "Filter products by category.",
      "Create an order using the created user and products.",
      "Verify that the server calculates the order total.",
      "Retrieve the order by ID.",
      "Change the order status to confirmed.",
      "Change the order status to shipped.",
      "Try creating a user with an invalid email and confirm that validation rejects it.",
      "Try creating a product with a negative price and confirm that validation rejects it.",
      "Try creating a product with negative stock and confirm that validation rejects it.",
      "Try creating an order with a non-existent user.",
      "Try creating an order with a non-existent product.",
      "Try creating an order with quantity 0.",
      "Try creating an order with more quantity than available stock.",
      "Try sending unknown properties in a DTO and observe whitelist behavior.",
      "Try sending a string where a numeric value is expected and observe transformation and validation behavior.",
      "Inspect every module and identify which providers it owns and which providers it exports.",
      "Trace a POST /orders request from the HTTP request through ValidationPipe, OrdersController, OrdersService, UsersService, ProductsService, and finally the response.",
      "Explain why OrdersService does not create UsersService or ProductsService with new.",
      "Explain why UsersService and ProductsService are exported from their feature modules.",
      "Explain the difference between a DTO validation error and a business-rule error.",
      "Explain why the controller should not calculate the order total.",
      "Explain why the client should not be trusted to send the final order total.",
      "Run the application build and verify that TypeScript compilation succeeds.",
      "Review the entire project and identify every place where dependency injection is being used.",
    ],

    acceptance: [
      "The application starts successfully through main.ts.",
      "AppModule imports UsersModule, ProductsModule, and OrdersModule.",
      "A global ValidationPipe is configured.",
      "ValidationPipe uses whitelist.",
      "ValidationPipe uses transform.",
      "UsersModule contains UsersController and UsersService.",
      "ProductsModule contains ProductsController and ProductsService.",
      "OrdersModule contains OrdersController and OrdersService.",
      "UsersService is exported from UsersModule.",
      "ProductsService is exported from ProductsModule.",
      "OrdersModule imports UsersModule and ProductsModule.",
      "OrdersService receives UsersService through constructor injection.",
      "OrdersService receives ProductsService through constructor injection.",
      "Users have validated create and update DTOs.",
      "Products have validated create and update DTOs.",
      "Orders have validated nested DTOs.",
      "PartialType is used for at least the user and product update DTOs.",
      "ParseIntPipe is used for numeric route IDs.",
      "The Users API supports create, list, retrieve, update, and delete operations.",
      "The Products API supports create, list, retrieve, update, and delete operations.",
      "The Products API supports search or filtering through query parameters.",
      "The Orders API supports create, list, retrieve, status update, and delete operations.",
      "Orders verify that the user exists.",
      "Orders verify that every product exists.",
      "Orders verify that sufficient stock exists.",
      "Orders calculate the total on the server.",
      "Orders do not trust a client-provided total.",
      "Invalid DTO data is rejected.",
      "Invalid route IDs are rejected.",
      "Missing users and products produce appropriate HTTP errors.",
      "Business rules are implemented in services rather than controllers.",
      "The project is organized into feature modules rather than one giant module.",
      "The application builds successfully without TypeScript errors.",
    ],

    stretch: [
      "Create a custom validation decorator that checks whether a product category is allowed.",
      "Add a custom provider token for an application configuration value.",
      "Create a provider that generates order numbers such as ORD-000001 instead of using only numeric IDs.",
      "Add a SharedModule containing a reusable provider and decide whether it should be global or explicitly imported.",
      "Create a response mapper that converts internal objects into response DTOs.",
      "Add PickType or OmitType to create specialized DTOs.",
      "Add an order response DTO that includes the user's name and product information.",
      "Add a GET /users/:id/orders endpoint.",
      "Add a GET /products/:id/orders endpoint that returns orders containing a product.",
      "Add pagination to GET /products.",
      "Add sorting by price from a query parameter.",
      "Add a stock reduction operation when an order is created.",
      "Prevent stock from becoming negative.",
      "Add an order cancellation rule that prevents cancellation after shipping.",
      "Create a custom pipe that validates a product category from a route parameter.",
      "Add an interceptor that records how long each request takes.",
      "Add a middleware that assigns a request ID.",
      "Add a guard that protects the order-management endpoint.",
      "Replace the in-memory users array with a repository provider while keeping UsersController unchanged.",
      "Replace the in-memory products array with a repository provider while keeping ProductsController unchanged.",
      "Create unit tests for UsersService.",
      "Create unit tests for ProductsService.",
      "Create unit tests for OrdersService.",
      "Write an integration test that creates a user, creates products, creates an order, and verifies the calculated total.",
      "Add a real database only after the NestJS architecture is working correctly with in-memory data.",
    ],
  },
};
