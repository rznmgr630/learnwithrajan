import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_10_LESSONS: LessonDay = {
  day: 10,
  title: "Modules",
  totalMinutes: 82,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-are-modules",
      title: "What are Modules?",
      durationMinutes: 16,
      explanation: `A <b>Module</b> is one of the main building blocks of a NestJS application. You can think of a module as a container that groups related parts of your application together.

For example, imagine you are building an online store. Your application might have users, products, orders, and payments. Instead of putting every controller and provider into one large file, you can create a separate module for each feature.

You might have a \`UsersModule\`, \`ProductsModule\`, \`OrdersModule\`, and \`PaymentsModule\`.

A NestJS module is created with the \`@Module()\` decorator. Inside the decorator, you describe which controllers, providers, imported modules, and exported providers belong to that module.

Every NestJS application has a root module. In many projects, this is called \`AppModule\`. The root module is where Nest starts building the application's module graph.

The important thing to understand is that modules help NestJS organize your application and control which providers are available to which parts of the application.

A module is not just a folder. The folder is a project-organization choice. The actual NestJS module is the class decorated with \`@Module()\`.

For example, this is a simple module:

\`\`\`ts
import { Module } from "@nestjs/common";

@Module({
  controllers: [],
  providers: [],
})
export class UsersModule {}
\`\`\`

The \`@Module()\` decorator tells Nest that \`UsersModule\` is a NestJS module.

As your application grows, modules become especially useful because they give you a clear way to separate features and manage dependencies.`,
      diagram: `                    NestJS Application
                           |
                       AppModule
                           |
          +----------------+----------------+
          |                |                |
     UsersModule      ProductsModule    OrdersModule
          |                |                |
     +----+----+       +----+----+       +----+----+
     |         |       |         |       |         |
Controller  Service Controller  Service Controller Service

Each feature module groups
the code belonging to that feature.`,
      codeExample: {
        title: "A simple UsersModule",
        code: `import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}`,
      },
      keyTakeaways: [
        "A module groups related NestJS components together.",
        "Modules are created with the `@Module()` decorator.",
        "The root module is usually called `AppModule`.",
        "A feature such as users, products, or orders can have its own module.",
        "A module controls which providers and controllers belong to that feature.",
        "A module is a NestJS class decorated with `@Module()`, not simply a folder.",
      ],
      commonMistakes: [
        "<b>Thinking a module is just a folder.</b> A folder helps organize files, but a NestJS module is a class decorated with `@Module()`.",
        "<b>Putting every provider into AppModule.</b> This can make a growing application difficult to understand and maintain.",
        "<b>Thinking modules are only for large applications.</b> Learning to organize features with modules early makes NestJS applications easier to grow.",
      ],
      quiz: [
        {
          question: "What does a NestJS module mainly do?",
          options: [
            "It stores database records",
            "It groups related application components",
            "It replaces TypeScript",
            "It starts the HTTP server by itself",
          ],
          correctIndex: 1,
          explanation:
            "A module groups related controllers, providers, imports, and exports so Nest can organize the application.",
        },
        {
          question: "Which decorator creates a NestJS module?",
          options: [
            "`@Controller()`",
            "`@Injectable()`",
            "`@Module()`",
            "`@Provider()`",
          ],
          correctIndex: 2,
          explanation:
            "The `@Module()` decorator tells Nest that a class represents a module.",
        },
      ],
    },
    {
      id: "module-metadata",
      title: "Understanding imports, providers, controllers, and exports",
      durationMinutes: 17,
      explanation: `The \`@Module()\` decorator accepts an object containing several important properties. The four you will use most often are \`imports\`, \`providers\`, \`controllers\`, and \`exports\`.

These properties can look confusing at first, so it helps to think about what each one means.

<b>\`controllers\`</b> tells Nest which controllers belong to this module. Controllers handle incoming requests and routes.

<b>\`providers\`</b> tells Nest which providers belong to this module. Services are the most common type of provider.

<b>\`imports\`</b> tells Nest that this module needs to use another module. This is how one module can access providers that another module makes available.

<b>\`exports\`</b> tells Nest which providers from this module can be used by modules that import this module.

Here is a simple example:

\`\`\`ts
@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
\`\`\`

You can read this almost like a sentence:

"UsersModule imports DatabaseModule, contains UsersController and UsersService, and makes UsersService available to other modules."

One important detail is that putting a provider in \`providers\` does not automatically make it available to every module in the application.

The provider belongs to that module's dependency injection context. If another module needs to use that provider, the usual pattern is to export the provider from the first module and import that module into the second module.

For example:

\`\`\`text
UsersModule
  |
  +--> providers: UsersService
  |
  +--> exports: UsersService
                |
                v
           AuthModule
                |
                +--> imports: UsersModule
                |
                +--> can inject UsersService
\`\`\`

This is one of the most important ideas behind NestJS modules.

A module decides what it owns and what it makes available to other modules.`,
      diagram: `                  UsersModule
                       |
          +------------+------------+
          |            |            |
      controllers   providers     exports
          |            |            |
   UsersController UsersService  UsersService
                       |
                       |
                  dependency
                  injection
                       |
                       v
                 Other Modules
              can use exported
                    provider

imports = modules this module needs
controllers = request handlers in this module
providers = injectable classes/providers owned here
exports = providers made available to importing modules`,
      codeExample: {
        title: "Using all four module properties",
        code: `import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}`,
      },
      keyTakeaways: [
        "`controllers` lists the controllers that belong to the module.",
        "`providers` lists providers that Nest should manage for the module.",
        "`imports` lists modules whose exported providers this module needs.",
        "`exports` makes selected providers available to modules that import this module.",
        "A provider does not become globally available just because it appears in `providers`.",
        "Modules create boundaries around dependency injection.",
      ],
      commonMistakes: [
        "<b>Putting a service in `imports`.</b> `imports` is for modules, not individual services.",
        "<b>Putting a module in `providers`.</b> A module belongs in `imports`.",
        "<b>Forgetting `exports`.</b> If another module needs a provider from this module, the provider normally needs to be exported.",
        "<b>Assuming every provider is available everywhere.</b> Provider visibility follows Nest's module boundaries.",
      ],
      quiz: [
        {
          question: "Where do you list controllers belonging to a module?",
          options: [
            "`imports`",
            "`controllers`",
            "`exports`",
            "`providers`",
          ],
          correctIndex: 1,
          explanation:
            "The `controllers` property contains the controllers that belong to the module.",
        },
        {
          question: "What does `exports` do?",
          options: [
            "Starts the application",
            "Creates HTTP routes",
            "Makes selected providers available to importing modules",
            "Imports npm packages",
          ],
          correctIndex: 2,
          explanation:
            "A module can export providers so another module that imports it can use them.",
        },
        {
          question: "What belongs in `imports`?",
          options: [
            "Other NestJS modules",
            "Controller methods",
            "Environment variables",
            "HTTP requests",
          ],
          correctIndex: 0,
          explanation:
            "The `imports` array contains other modules that this module depends on.",
        },
      ],
    },
    {
      id: "module-imports-and-exports",
      title: "How imports and exports connect modules",
      durationMinutes: 17,
      explanation: `The relationship between \`imports\` and \`exports\` is easier to understand with a real example.

Imagine you have an \`UsersModule\` that owns \`UsersService\`.

\`UsersService\` knows how to find users:

\`\`\`ts
@Injectable()
export class UsersService {
  findById(id: string) {
    return {
      id,
      name: "Alex",
    };
  }
}
\`\`\`

The service belongs to \`UsersModule\`:

\`\`\`ts
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
\`\`\`

The important part is:

\`\`\`ts
exports: [UsersService]
\`\`\`

This says that \`UsersModule\` is willing to make \`UsersService\` available to another module that imports \`UsersModule\`.

Now imagine an \`AuthModule\` needs to find a user while checking authentication.

The AuthModule can import UsersModule:

\`\`\`ts
@Module({
  imports: [UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
\`\`\`

Now Nest can resolve \`UsersService\` for \`AuthService\` because:

1. \`UsersModule\` provides \`UsersService\`.
2. \`UsersModule\` exports \`UsersService\`.
3. \`AuthModule\` imports \`UsersModule\`.
4. \`AuthService\` asks Nest for \`UsersService\` through dependency injection.

This creates a clear dependency relationship.

The direction matters.

\`\`\`text
UsersModule
    |
    | exports UsersService
    v
AuthModule
    |
    | imports UsersModule
    v
AuthService
    |
    | injects UsersService
    v
UsersService
\`\`\`

You do not normally import \`UsersService\` into \`AuthModule\`'s \`providers\` array just to make it work. Instead, the module that owns the provider exports it, and the consuming module imports that module.

This keeps ownership clear.

A good mental model is:

<b>providers = what this module owns</b>

<b>exports = what this module shares</b>

<b>imports = what this module wants to use from other modules</b>`,
      diagram: `                         UsersModule
                              |
                    +---------+---------+
                    |                   |
             UsersService          exports
                                      |
                                      v
                                UsersService
                                      |
                                      v
                               +-------------+
                               | AuthModule  |
                               |             |
                               | imports:    |
                               | UsersModule |
                               +------+------+
                                      |
                                      v
                                 AuthService
                                      |
                                      v
                               UsersService

The consuming module imports the module,
not just the provider directly.`,
      codeExample: {
        title: "Sharing UsersService with AuthModule",
        code: `// users.module.ts

import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// auth.module.ts

import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [UsersModule],
  providers: [AuthService],
})
export class AuthModule {}

// auth.service.ts

import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}`,
      },
      keyTakeaways: [
        "The module that owns a provider can export it.",
        "Another module can import the first module to use that exported provider.",
        "Dependency injection then allows the consuming service to receive the provider.",
        "The normal relationship is provider -> export -> module import -> injection.",
        "This keeps dependencies between application features explicit.",
      ],
      commonMistakes: [
        "<b>Exporting a provider but forgetting to import its module.</b> The consuming module needs to import the module that exports the provider.",
        "<b>Importing a provider into `imports`.</b> `imports` accepts modules.",
        "<b>Adding the same service to every module's `providers`.</b> This can create separate provider instances and breaks the idea of having one module own the provider.",
      ],
      quiz: [
        {
          question: "If AuthModule needs UsersService from UsersModule, what should AuthModule normally import?",
          options: [
            "UsersService",
            "UsersModule",
            "UsersController",
            "main.ts",
          ],
          correctIndex: 1,
          explanation:
            "AuthModule should import UsersModule, assuming UsersModule exports UsersService.",
        },
        {
          question: "Which statement best describes `exports`?",
          options: [
            "It makes every provider globally available",
            "It makes selected providers available to modules that import the module",
            "It creates a new controller",
            "It starts dependency injection",
          ],
          correctIndex: 1,
          explanation:
            "Exports define which providers a module makes available to modules that import it.",
        },
      ],
    },
    {
      id: "feature-modules",
      title: "Feature Modules",
      durationMinutes: 15,
      explanation: `A <b>feature module</b> is a module that groups everything related to one business feature.

This is one of the most useful ways to structure a real NestJS application.

For an online store, you might have:

\`\`\`text
src/
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
│
├── products/
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
│
├── orders/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
│
└── app.module.ts
\`\`\`

Each feature has its own module.

For example, \`ProductsModule\` might contain the product controller and product service:

\`\`\`ts
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
\`\`\`

Then \`AppModule\` can import it:

\`\`\`ts
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
\`\`\`

This gives the application a clear structure.

The products code stays together. The users code stays together. The orders code stays together.

This is much easier to work with than having one giant \`AppController\` and one giant \`AppService\` containing everything.

Feature modules also make ownership clearer.

If you open \`ProductsModule\`, you should be able to understand which controllers and providers are responsible for products.

As your application grows, this becomes very valuable. A team member working on orders can mostly work inside the orders feature without having to understand the entire application first.

Feature modules can also communicate with each other through module imports and exports.

For example, an \`OrdersModule\` might need \`UsersService\` to check who placed an order. The UsersModule can export UsersService, and OrdersModule can import UsersModule.

This creates a controlled dependency instead of making everything available everywhere.`,
      diagram: `                         AppModule
                            |
          +-----------------+------------------+
          |                 |                  |
          v                 v                  v
     UsersModule      ProductsModule      OrdersModule
          |                 |                  |
      +---+---+         +---+---+         +---+---+
      |       |         |       |         |       |
   Controller Service Controller Service Controller Service

Feature modules keep related code together.

Users feature  -> users code
Products feature -> products code
Orders feature -> orders code`,
      codeExample: {
        title: "A feature-based application structure",
        code: `// products.module.ts

import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

// app.module.ts

import { Module } from "@nestjs/common";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";
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
        "A feature module groups code for one business feature.",
        "Users, products, orders, and payments are common examples of features.",
        "Feature modules make large applications easier to navigate.",
        "A feature module can contain its controllers and providers.",
        "Feature modules can communicate through imports and exports.",
        "AppModule commonly imports the application's main feature modules.",
      ],
      commonMistakes: [
        "<b>Putting all business logic into AppModule.</b> AppModule should normally compose the application rather than contain every feature.",
        "<b>Creating modules based only on file type.</b> A feature module usually groups code around a business capability.",
        "<b>Making every feature depend on every other feature.</b> Keep dependencies intentional and as simple as possible.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a feature module?",
          options: [
            "To store environment variables",
            "To group code related to a specific feature",
            "To replace the database",
            "To compile TypeScript",
          ],
          correctIndex: 1,
          explanation:
            "Feature modules organize controllers, providers, and related code around a business feature.",
        },
        {
          question: "Which could be a feature module in an online store?",
          options: [
            "OrdersModule",
            "StringModule",
            "ConsoleModule",
            "LoopModule",
          ],
          correctIndex: 0,
          explanation:
            "Orders are a business feature, so OrdersModule is a natural feature module.",
        },
      ],
    },
    {
      id: "shared-and-global-modules",
      title: "Shared Modules and Global Modules",
      durationMinutes: 17,
      explanation: `Sometimes a provider is useful in more than one feature. NestJS gives you module patterns for handling these situations.

A <b>shared module</b> is simply a module whose exported providers can be used by other modules that import it.

For example, suppose several parts of your application need a \`LoggerService\`.

You could create a \`CommonModule\`:

\`\`\`ts
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class CommonModule {}
\`\`\`

Then another module can import it:

\`\`\`ts
@Module({
  imports: [CommonModule],
  providers: [OrdersService],
})
export class OrdersModule {}
\`\`\`

If another feature also needs the logger, it can import \`CommonModule\`.

This is explicit and easy to understand because you can look at a module and see what it depends on.

NestJS also supports <b>global modules</b>.

A global module uses the \`@Global()\` decorator:

\`\`\`ts
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
\`\`\`

Once the global module is registered, its exported providers can be available across the application without every consuming module needing to explicitly import that module.

This can be convenient for truly application-wide infrastructure.

However, global modules should not be used for everything.

If every feature becomes dependent on a large global module, it becomes harder to see where dependencies come from. A module may use a provider without its \`imports\` array showing where that provider is coming from.

A useful beginner rule is:

<b>Use normal feature modules by default.</b>

Use a shared module when several modules need a common provider and you want those dependencies to remain explicit.

Use a global module when a provider is genuinely application-wide and importing it everywhere would be unnecessary repetition.

Configuration and certain infrastructure services are common examples of things that may be made global.

Also remember that global does not mean "every class in the application magically becomes available." A provider still needs to be provided and exported by the global module.

For example:

\`\`\`text
GlobalModule
     |
     +--> providers
     |
     +--> exports
             |
             v
      Available throughout
      the application
\`\`\`

The important difference is how the consuming modules access the exported provider.

With a normal shared module:

\`\`\`text
OrdersModule
    |
    +--> imports CommonModule
    |
    +--> uses LoggerService
\`\`\`

With a global module:

\`\`\`text
OrdersModule
    |
    +--> does not need to import GlobalModule
    |
    +--> can use exported provider
\`\`\`

Global modules are useful, but explicit imports often make dependencies easier to understand.`,
      diagram: `NORMAL SHARED MODULE

             CommonModule
                  |
          exports LoggerService
                  |
        +---------+---------+
        |                   |
        v                   v
   UsersModule         OrdersModule
   imports it          imports it
        |                   |
        +------ uses -------+
              LoggerService


GLOBAL MODULE

             @Global()
             ConfigModule
                  |
          exports ConfigService
                  |
        +---------+---------+
        |         |         |
        v         v         v
      Users     Orders    Products
        |         |         |
        +---------+---------+
              can use
         ConfigService

Global modules reduce the need
for repeated imports.`,
      codeExample: {
        title: "Shared module and global module",
        code: `// common.module.ts

import { Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class CommonModule {}

// orders.module.ts

import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { OrdersService } from "./orders.service";

@Module({
  imports: [CommonModule],
  providers: [OrdersService],
})
export class OrdersModule {}

// config.module.ts

import { Global, Module } from "@nestjs/common";
import { ConfigService } from "./config.service";

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

// The global ConfigModule must be registered
// in the application's module graph, commonly
// by importing it into AppModule.`,
      },
      keyTakeaways: [
        "A shared module exports providers that other modules can use when they import the shared module.",
        "A global module uses the `@Global()` decorator.",
        "Global module providers can be available without repeating the module import in every consumer.",
        "Global modules should be used carefully because they can hide dependencies.",
        "Normal module imports are often easier to understand because dependencies are explicit.",
        "Configuration and application-wide infrastructure are common candidates for global modules.",
      ],
      commonMistakes: [
        "<b>Making every module global.</b> Global modules are meant for providers that are genuinely application-wide.",
        "<b>Forgetting to export the provider.</b> A global module still needs to export the provider if other modules should use it.",
        "<b>Thinking `@Global()` makes every provider in the application global.</b> It affects the providers exported by that global module.",
        "<b>Using global modules to avoid understanding imports.</b> Explicit dependencies are often easier to maintain.",
      ],
      quiz: [
        {
          question: "What does a shared module normally provide?",
          options: [
            "A way to share exported providers with modules that import it",
            "A replacement for controllers",
            "A database table",
            "A replacement for TypeScript",
          ],
          correctIndex: 0,
          explanation:
            "A shared module can export providers so importing modules can use them.",
        },
        {
          question: "Which decorator marks a module as global?",
          options: [
            "`@Shared()`",
            "`@Global()`",
            "`@Public()`",
            "`@Export()`",
          ],
          correctIndex: 1,
          explanation:
            "NestJS uses the `@Global()` decorator to mark a module as global.",
        },
        {
          question: "Why should global modules be used carefully?",
          options: [
            "They cannot contain providers",
            "They can make dependencies less explicit",
            "They cannot export services",
            "They only work with controllers",
          ],
          correctIndex: 1,
          explanation:
            "Global modules can hide where a provider comes from because consuming modules do not need to list the global module in `imports`.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the main purpose of a NestJS module?",
      options: [
        "To store database rows",
        "To group and organize related application components",
        "To replace HTTP",
        "To compile JavaScript",
      ],
      correctIndex: 1,
      explanation:
        "Modules organize controllers, providers, imports, and exports and create boundaries for dependency injection.",
    },
    {
      question: "Which property contains controllers belonging to a module?",
      options: [
        "`imports`",
        "`providers`",
        "`controllers`",
        "`exports`",
      ],
      correctIndex: 2,
      explanation:
        "The `controllers` property lists controllers that belong to the module.",
    },
    {
      question: "Which property contains providers managed by a module?",
      options: [
        "`providers`",
        "`controllers`",
        "`imports`",
        "`routes`",
      ],
      correctIndex: 0,
      explanation:
        "The `providers` property tells Nest which providers belong to the module.",
    },
    {
      question: "What is the purpose of `imports` in a module?",
      options: [
        "To list controllers",
        "To list modules whose exported providers this module needs",
        "To make every provider global",
        "To create routes",
      ],
      correctIndex: 1,
      explanation:
        "The `imports` array contains other modules that the current module needs to use.",
    },
    {
      question: "What does `exports` do?",
      options: [
        "Makes selected providers available to modules that import this module",
        "Makes every provider global",
        "Creates a controller",
        "Starts the application",
      ],
      correctIndex: 0,
      explanation:
        "A module can export selected providers so other modules that import it can use them.",
    },
    {
      question: "If AuthModule needs UsersService from UsersModule, what is the normal module relationship?",
      options: [
        "AuthModule imports UsersModule, and UsersModule exports UsersService",
        "UsersModule imports AuthModule, and AuthModule exports UsersService",
        "AuthModule puts UsersService in its controllers",
        "UsersService must be placed in `main.ts`",
      ],
      correctIndex: 0,
      explanation:
        "The module owning UsersService exports it, and AuthModule imports that module.",
    },
    {
      question: "What is a feature module?",
      options: [
        "A module that groups code for a specific business feature",
        "A module that only contains configuration",
        "A module that can only contain controllers",
        "A module that replaces AppModule",
      ],
      correctIndex: 0,
      explanation:
        "Feature modules organize related controllers, providers, and other code around a business feature.",
    },
    {
      question: "Which decorator marks a module as global?",
      options: [
        "`@Global()`",
        "`@ModuleGlobal()`",
        "`@Shared()`",
        "`@Export()`",
      ],
      correctIndex: 0,
      explanation:
        "NestJS provides the `@Global()` decorator for global modules.",
    },
    {
      question: "Why should you avoid making every module global?",
      options: [
        "Global modules cannot have services",
        "Global modules can make application dependencies harder to see",
        "Global modules cannot be imported",
        "Global modules only work in development",
      ],
      correctIndex: 1,
      explanation:
        "Global modules can hide dependencies because consuming modules do not need to explicitly import them.",
    },
  ],
  project: {
    name: "Feature-based NestJS application",
    goal: "Build a small NestJS application organized into feature modules and practice connecting modules with imports and exports.",
    brief: "Create a small application with users, products, and orders. Keep each feature in its own module, share a UsersService with the OrdersModule, and create one application-wide provider using a global module.",
    steps: [
      "Create a UsersModule with UsersController and UsersService.",
      "Create a ProductsModule with ProductsController and ProductsService.",
      "Create an OrdersModule with OrdersController and OrdersService.",
      "Create an AppModule that imports the three feature modules.",
      "Export UsersService from UsersModule.",
      "Import UsersModule into OrdersModule.",
      "Inject UsersService into OrdersService and use it from a method.",
      "Create a small CommonModule containing a LoggerService.",
      "Export LoggerService from CommonModule and import CommonModule into at least two feature modules.",
      "Create a ConfigModule using `@Global()` and export a ConfigService.",
      "Register the global ConfigModule in the application's module graph.",
      "Use ConfigService from a feature service without repeatedly importing ConfigModule.",
      "Inspect the module files and identify what each module owns, imports, and exports.",
    ],
    acceptance: [
      "The application has separate UsersModule, ProductsModule, and OrdersModule feature modules.",
      "AppModule imports the main feature modules.",
      "Each feature module owns its related controllers and services.",
      "UsersModule exports UsersService.",
      "OrdersModule imports UsersModule and can inject UsersService.",
      "A shared module exports a provider that is used by multiple feature modules.",
      "A global module uses the `@Global()` decorator.",
      "The global module exports a provider that can be used by feature modules.",
      "The project uses `imports`, `providers`, `controllers`, and `exports` correctly.",
      "The module boundaries are clear enough that you can identify where each provider comes from.",
    ],
    stretch: [
      "Create a PaymentsModule that needs information from both UsersModule and OrdersModule.",
      "Create a shared AuditService and use it from UsersModule and OrdersModule.",
      "Add a global ConfigService with methods for reading application configuration.",
      "Try removing an `exports` entry and observe the dependency injection error.",
      "Try removing an `imports` entry and observe how Nest can no longer resolve the provider.",
      "Refactor the application so that each feature exposes only the providers other features actually need.",
    ],
  },
};
