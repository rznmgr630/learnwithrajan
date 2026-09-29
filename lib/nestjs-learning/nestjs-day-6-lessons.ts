import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_6_LESSONS: LessonDay = {
  day: 6,
  title: "What NestJS Is",
  totalMinutes: 100,
  difficulty: "Beginner",
  lessons: [
    {
      id: "nestjs-architecture",
      title: "NestJS architecture",
      durationMinutes: 18,
      explanation: `NestJS is a framework for building <b>server-side applications with Node.js and TypeScript</b>.

If you have worked with Express before, you may have noticed that Express gives you a lot of freedom. You can create your folders however you want, put your database logic wherever you want, create routes in many different ways, and decide how different parts of your application communicate with each other.

That freedom is useful, but it can also become difficult when an application becomes large.

Imagine that you have an application with users, authentication, products, orders, payments, notifications, and reports. If everything is placed into a few large files, it becomes difficult to understand where a piece of code belongs.

NestJS tries to solve this problem by giving your application a clear structure.

The main building blocks you will see in NestJS are <b>modules, controllers, and providers</b>.

A module usually represents a feature or a group of related functionality. For example, you might have a \`UsersModule\`, an \`AuthModule\`, and an \`OrdersModule\`.

A controller is responsible for handling incoming requests. If a client sends a request to \`GET /users\`, the users controller can receive that request and decide what should happen.

A provider contains reusable logic that the application needs. A service is the most common example of a provider. For example, \`UsersService\` might contain the logic for finding users.

NestJS also has a Dependency Injection system. This allows one class to ask for another class instead of creating that class manually.

For example, a \`UsersController\` can say, "I need a \`UsersService\`." NestJS can create the service and give it to the controller.

This gives us a simple flow:

<b>Request → Controller → Service/Provider → Data source</b>

The controller deals with the HTTP request. The service deals with application logic. A repository or database layer can deal with storing and retrieving data.

NestJS does not force every application to use exactly the same internal architecture, but it gives you a strong set of conventions. These conventions become especially useful when working on larger applications or when multiple developers are working on the same codebase.

Another important thing to understand is that NestJS itself does not replace Node.js.

Node.js is the runtime.

NestJS is a framework that runs on Node.js and gives you tools and conventions for building backend applications.

NestJS also does not mean that you no longer need to understand HTTP. You still need to understand requests, responses, routes, headers, status codes, authentication, and other backend concepts.

Think of NestJS as a structured way of building a Node.js backend rather than as a completely different technology.`,
      diagram: `Client
   |
   | HTTP request
   v
NestJS Application
   |
   v
AppModule
   |
   +-------------------+
   |                   |
   v                   v
UsersModule        OrdersModule
   |                   |
   |                   |
   v                   v
UsersController    OrdersController
   |                   |
   v                   v
UsersService       OrdersService
   |                   |
   v                   v
Repository / DB    Repository / DB

The general idea is:

HTTP request
     ↓
Controller
     ↓
Provider / Service
     ↓
Data source`,
      codeExample: {
        title: "A simple NestJS application structure",
        code: `// app.module.ts

import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [UsersModule],
})
export class AppModule {}


// users/users.module.ts

import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}


// users/users.controller.ts

import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}


// users/users.service.ts

import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  findAll() {
    return [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
  }
}`,
      },
      keyTakeaways: [
        "NestJS is a backend framework that runs on Node.js.",
        "NestJS is designed to help you build structured and maintainable server-side applications.",
        "Modules organize related features.",
        "Controllers handle incoming HTTP requests.",
        "Providers contain reusable application logic.",
        "Services are a very common type of provider.",
        "Dependency Injection allows NestJS to provide required dependencies to classes.",
        "NestJS gives you conventions instead of making you design the entire backend structure yourself.",
        "You still need to understand normal HTTP and Node.js concepts when using NestJS.",
      ],
      commonMistakes: [
        "<b>Thinking NestJS is a replacement for Node.js.</b> Node.js is the runtime. NestJS is a framework that runs on top of Node.js.",
        "<b>Thinking NestJS automatically creates the entire application for you.</b> NestJS gives you structure and tools, but you still have to design your application's business logic.",
        "<b>Putting all logic inside controllers.</b> Controllers should not become huge files containing database queries, business rules, validation logic, and everything else.",
        "<b>Thinking modules are just folders.</b> A folder is only a filesystem concept. A NestJS module is a class using the `@Module()` decorator that tells NestJS how different parts of a feature are connected.",
        "<b>Thinking NestJS means you no longer need to understand HTTP.</b> NestJS makes HTTP development easier, but you still need to understand what requests, responses, methods, headers, and status codes are.",
      ],
      quiz: [
        {
          question: "What is NestJS?",
          options: [
            "A database system",
            "A Node.js framework for building server-side applications",
            "A frontend CSS framework",
            "A replacement for JavaScript",
          ],
          correctIndex: 1,
          explanation: "NestJS is a framework that runs on Node.js and helps developers build structured server-side applications.",
        },
        {
          question: "What is a common responsibility of a controller?",
          options: [
            "Handling incoming HTTP requests",
            "Compiling TypeScript",
            "Creating database servers",
            "Installing npm packages",
          ],
          correctIndex: 0,
          explanation: "Controllers form the HTTP boundary of a NestJS application and handle incoming requests.",
        },
        {
          question: "Which sequence best describes a common NestJS request flow?",
          options: [
            "Database → Browser → Controller",
            "Controller → Request → Database",
            "Request → Controller → Provider → Data source",
            "Provider → Browser → Request",
          ],
          correctIndex: 2,
          explanation: "A common NestJS architecture sends the request to a controller, which uses a provider or service to perform application logic and access data.",
        },
      ],
    },

    {
      id: "nestjs-vs-express",
      title: "NestJS vs Express",
      durationMinutes: 16,
      explanation: `Before learning NestJS, it is useful to understand how it compares with Express.

<button aria-controls="entity-content-dialog" aria-haspopup="dialog" class="x23pbtg xjyslct xjbqb8w xu82sp8 x9f619 x1heor9g x1ahelbq x1ypdohk x1rg5ohu xln7xf2 xg2cl3o xew9s4i xrxpjvj x193iq5w xtc8aji xj0wd6c xs005hw x7s97pk xj0a0fe xfu5u6t xm73x1d xnjsko4 x1n2onr6 x16tdsg8 x1aqa83g x9ojkr9 xujl8zx x130ws4e x15t23oz xi2nhp4 xyi4chj xrys4gj x1479xdx x11njtxf xeaf4i8" data-assistant-content-reference="" data-assistant-entity-reference="" data-assistant-entity-trigger="" data-assistant-entity-payload="{&quot;query&quot;:&quot;Express&quot;,&quot;category&quot;:&quot;software&quot;,&quot;extra_params&quot;:{&quot;disambiguation&quot;:&quot;Node.js web framework&quot;}}" data-content-reference-type="entity" type="button"><span class="x1ihqd33 x1q1fyn3 x187xuwc x7e1b1x x1w6yo06 xf5e0qk x1dcsqj5" data-assistant-entity-name="">Express</span></button> is a popular Node.js web framework. It gives you basic tools for building HTTP applications, such as routes, middleware, requests, and responses.

Express is intentionally fairly minimal.

That means Express does not tell you exactly how your application folders should be organized. It does not require you to create a controller class, service class, or module for every feature.

For example, with Express, you can write a route like this:

\`app.get("/users", handler)\`

You decide what the handler does and where the code lives.

This is one of Express's strengths. You can build a very small API quickly, and you have a lot of freedom.

But freedom can also create problems as the project becomes larger.

Imagine that five developers are working on a large Express application. One developer puts business logic inside route handlers. Another creates a services folder. Another puts database queries directly inside controllers. Another creates a completely different pattern.

The application may still work, but the structure can become inconsistent.

NestJS takes a different approach.

NestJS gives you a more opinionated architecture. It encourages you to separate your application into modules, controllers, and providers.

For example:

\`UsersModule\`

can contain:

\`UsersController\`

and

\`UsersService\`.

This makes it easier for another developer to look at the project and understand where user-related code belongs.

This does not mean that NestJS is "better" than Express in every situation.

They solve related problems at different levels.

Express gives you a smaller set of HTTP building blocks and leaves many architectural decisions to you.

NestJS gives you a larger application architecture on top of Node.js HTTP functionality.

There is another important detail: NestJS can use Express underneath it.

So learning Express is not wasted knowledge when you learn NestJS.

When a request reaches a NestJS application, there is still an underlying HTTP server handling the low-level HTTP work.

NestJS gives you a higher-level programming model for working with that server.

A simple way to think about it is:

<b>Express gives you building blocks.</b>

<b>NestJS gives you building blocks plus a recommended way to organize them.</b>

If you are building a tiny API with only a few routes, Express may feel very simple.

If you are building a larger application with many features and want consistent architecture, NestJS's structure can be useful.

The important thing for a beginner is not to memorize which one is "better."

Instead, understand the difference in philosophy: <b>Express is minimal and flexible, while NestJS is structured and opinionated.</b>`,
      diagram: `Express

HTTP Request
     |
     v
   Router
     |
     v
Middleware
     |
     v
Route Handler
     |
     v
 Response


NestJS

HTTP Request
     |
     v
 NestJS
     |
     v
 Module
     |
     v
 Controller
     |
     v
 Provider
     |
     v
 Response

NestJS can use Express underneath:

NestJS
   |
   v
Express Adapter
   |
   v
HTTP Server`,
      codeExample: {
        title: "The same endpoint with Express and NestJS",
        code: `// Express

import express from "express";

const app = express();

app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
});

app.listen(3000);


// NestJS

import { Controller, Get } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    return [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
  }
}`,
      },
      keyTakeaways: [
        "Express is a relatively minimal Node.js web framework.",
        "Express gives you flexibility and leaves many architectural decisions to you.",
        "NestJS provides more structure around how a backend application is organized.",
        "NestJS commonly uses controllers, modules, and providers to organize application code.",
        "NestJS can use Express as its underlying HTTP platform.",
        "Knowing Express concepts is still useful when learning NestJS.",
        "The important difference is the amount of structure and conventions each framework provides.",
      ],
      commonMistakes: [
        "<b>Thinking NestJS and Express are completely unrelated.</b> NestJS can use Express as its underlying HTTP platform.",
        "<b>Thinking Express is only for small projects.</b> Express can be used for large applications too. It simply gives you fewer architectural rules by default.",
        "<b>Thinking NestJS removes the need to understand HTTP.</b> NestJS makes HTTP development more organized, but HTTP concepts still matter.",
        "<b>Comparing them only by the number of lines of code.</b> NestJS may require more structure because that structure is part of what the framework provides.",
      ],
      quiz: [
        {
          question: "What is Express known for?",
          options: [
            "Being a minimal and flexible Node.js web framework",
            "Being a database",
            "Being a TypeScript compiler",
            "Being a frontend framework",
          ],
          correctIndex: 0,
          explanation: "Express provides a relatively small set of HTTP-related tools and leaves many architectural choices to the developer.",
        },
        {
          question: "Why might NestJS feel more structured than Express?",
          options: [
            "NestJS does not use HTTP",
            "NestJS provides concepts such as modules, controllers, providers, and Dependency Injection",
            "NestJS does not allow JavaScript",
            "NestJS only works with databases",
          ],
          correctIndex: 1,
          explanation: "NestJS provides a more complete application architecture and conventions around these concepts.",
        },
        {
          question: "Can NestJS use Express underneath?",
          options: [
            "No",
            "Yes",
            "Only when using JavaScript",
            "Only in production",
          ],
          correctIndex: 1,
          explanation: "NestJS supports Express through its HTTP adapter system.",
        },
      ],
    },

    {
      id: "nestjs-vs-fastify",
      title: "NestJS vs Fastify",
      durationMinutes: 14,
      explanation: `<button aria-controls="entity-content-dialog" aria-haspopup="dialog" class="x23pbtg xjyslct xjbqb8w xu82sp8 x9f619 x1heor9g x1ahelbq x1ypdohk x1rg5ohu xln7xf2 xg2cl3o xew9s4i xrxpjvj x193iq5w xtc8aji xj0wd6c xs005hw x7s97pk xj0a0fe xfu5u6t xm73x1d xnjsko4 x1n2onr6 x16tdsg8 x1aqa83g x9ojkr9 xujl8zx x130ws4e x15t23oz xi2nhp4 xyi4chj xrys4gj x1479xdx x11njtxf xeaf4i8" data-assistant-content-reference="" data-assistant-entity-reference="" data-assistant-entity-trigger="" data-assistant-entity-payload="{&quot;query&quot;:&quot;Fastify&quot;,&quot;category&quot;:&quot;software&quot;,&quot;extra_params&quot;:{&quot;disambiguation&quot;:&quot;Node.js web framework&quot;}}" data-content-reference-type="entity" type="button"><span class="x1ihqd33 x1q1fyn3 x187xuwc x7e1b1x x1w6yo06 xf5e0qk x1dcsqj5" data-assistant-entity-name="">Fastify</span></button> is another Node.js framework for handling HTTP requests.

At first, comparing NestJS and Fastify can be confusing because both are sometimes described as backend frameworks.

The important thing to understand is that they can exist at different levels in the same application.

NestJS provides your application's overall architecture.

Fastify can provide the underlying HTTP server.

NestJS supports different HTTP adapters, including an adapter for Fastify.

That means you can have a NestJS application whose HTTP layer is powered by Fastify.

You do not need to rewrite your entire application just because you choose a different adapter.

For example, your \`UsersController\` can still look like this:

\`@Controller("users")\`

and your service can still be injected in the same way.

The adapter handles the lower-level HTTP work.

Fastify itself is designed with performance and efficient request handling in mind. It also has features around schemas, serialization, and request processing.

Express is another HTTP platform that NestJS can use.

So a simplified picture looks like this:

<b>NestJS application → HTTP adapter → HTTP platform</b>

The HTTP platform might be Express or Fastify.

As a beginner, you do not need to memorize performance benchmark numbers.

Those numbers can also change depending on the version, configuration, workload, plugins, database calls, and many other factors.

The more important idea is understanding the separation of responsibilities.

NestJS gives you things like modules, controllers, providers, Dependency Injection, guards, pipes, and interceptors.

The underlying adapter deals more directly with HTTP processing.

This separation is one reason NestJS can provide a consistent programming model while allowing different HTTP platforms underneath.`,
      diagram: `                 NestJS Application
                         |
                         v
                HTTP Adapter Layer
                    /         \\
                   /           \\
                  v             v
             Express         Fastify
                |               |
                v               v
           HTTP Server      HTTP Server
                |               |
                +-------+-------+
                        |
                        v
                    Network

Your controller and
service architecture
mostly stays at the
NestJS level.`,
      codeExample: {
        title: "Using Fastify with NestJS",
        code: `import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app =
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

  await app.listen(3000);
}

bootstrap();`,
      },
      keyTakeaways: [
        "Fastify is a Node.js HTTP framework.",
        "NestJS can use Fastify as its underlying HTTP platform.",
        "NestJS and Fastify can work together rather than being mutually exclusive choices.",
        "NestJS provides the application architecture while the adapter connects it to the HTTP platform.",
        "Controllers and providers can usually remain largely independent of the chosen HTTP adapter.",
        "Do not focus only on benchmark numbers when learning the difference.",
      ],
      commonMistakes: [
        "<b>Thinking you must choose between NestJS and Fastify.</b> NestJS can use Fastify underneath the application.",
        "<b>Thinking Fastify is a database or ORM.</b> Fastify is an HTTP web framework.",
        "<b>Thinking changing the adapter means rewriting every controller.</b> NestJS provides an abstraction layer so most application code can remain the same.",
        "<b>Choosing a framework only from a benchmark.</b> Real applications also depend on database performance, network calls, application design, plugins, and workload.",
      ],
      quiz: [
        {
          question: "What is Fastify?",
          options: [
            "A Node.js HTTP framework",
            "A database",
            "A frontend framework",
            "A TypeScript language feature",
          ],
          correctIndex: 0,
          explanation: "Fastify is a Node.js web framework designed for handling HTTP requests efficiently.",
        },
        {
          question: "Can NestJS use Fastify underneath the application?",
          options: [
            "No",
            "Yes",
            "Only for testing",
            "Only with React",
          ],
          correctIndex: 1,
          explanation: "NestJS provides a Fastify adapter that allows Fastify to act as the underlying HTTP platform.",
        },
      ],
    },

    {
      id: "dependency-injection",
      title: "Dependency Injection",
      durationMinutes: 18,
      explanation: `Dependency Injection is one of the most important ideas in NestJS, and it is worth taking time to understand it properly.

The name sounds complicated, but the basic idea is simple.

Imagine that you have a \`UsersController\`.

The controller needs a \`UsersService\` because the service contains the logic for working with users.

One approach would be to create the service manually:

\`const usersService = new UsersService();\`

Then the controller would be responsible for creating the service.

That might work for a small example, but as your application grows, classes can depend on many other classes.

For example:

\`UsersController\` needs \`UsersService\`.

\`UsersService\` needs \`UsersRepository\`.

\`UsersRepository\` needs \`DatabaseClient\`.

Now imagine creating all of these manually.

The controller would need to know how the service is constructed. The service would need to know how the repository is constructed. The repository would need to know how the database client is constructed.

This creates a lot of coupling.

Dependency Injection changes the responsibility.

Instead of saying:

"I will create my dependencies."

the class says:

"I need these dependencies."

NestJS then uses its Dependency Injection container to create and provide those dependencies.

For example:

\`constructor(private readonly usersService: UsersService) {}\`

This tells NestJS that the controller needs a \`UsersService\`.

NestJS can look at the application's registered providers, create the service, and pass it into the controller.

This is called <b>injection</b> because the dependency is provided to the class from the outside.

A simple real-world analogy is ordering food at a restaurant.

You do not walk into the kitchen and build your own oven, hire the chef, buy ingredients, and create the kitchen.

You simply say what you want.

The restaurant handles the work required to provide it.

Dependency Injection is somewhat similar.

The class declares what it needs, and the framework manages how those dependencies are created and connected.

This also makes testing easier.

Suppose your \`UsersController\` normally uses a real \`UsersService\`.

During a test, you might want to give it a fake service instead.

Because the controller depends on the service rather than creating the service itself, NestJS can provide a different implementation during testing.

That is one of the practical benefits of Dependency Injection.

You will see Dependency Injection everywhere in NestJS, so understanding this idea now will make many later NestJS topics much easier.`,
      diagram: `Without Dependency Injection:

UsersController
      |
      | creates
      v
UsersService
      |
      | creates
      v
UsersRepository
      |
      | creates
      v
DatabaseClient


With Dependency Injection:

              NestJS DI Container
               /       |       \\
              /        |        \\
             v         v         v
     DatabaseClient  Repository  Service
                            \\      /
                             \\    /
                              v  v
                         Controller

The controller says:

"I need UsersService."

NestJS provides it.`,
      codeExample: {
        title: "Constructor Dependency Injection",
        code: `import {
  Controller,
  Get,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class UsersService {
  findAll() {
    return [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
  }
}

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}`,
      },
      keyTakeaways: [
        "Dependency Injection means a class receives the dependencies it needs instead of creating them itself.",
        "NestJS has a Dependency Injection container that manages registered providers.",
        "Constructor injection is the most common form of Dependency Injection in NestJS.",
        "The controller can depend on a service without knowing how the service is created.",
        "Dependency Injection reduces coupling between classes.",
        "Dependency Injection makes it easier to replace real dependencies with fake ones during testing.",
      ],
      commonMistakes: [
        "<b>Creating services manually everywhere with `new`.</b> In a NestJS application, let the Dependency Injection system manage providers whenever appropriate.",
        "<b>Forgetting to register the provider.</b> NestJS needs to know that a class is available as a provider.",
        "<b>Thinking Dependency Injection is only for services.</b> Many different types of providers can be injected.",
        "<b>Thinking the constructor is creating the dependency.</b> The constructor declares the dependency; NestJS supplies the instance.",
      ],
      quiz: [
        {
          question: "What does Dependency Injection mean in simple terms?",
          options: [
            "A class creates every dependency itself",
            "A class receives the dependencies it needs from another system",
            "A database injects SQL into JavaScript",
            "A controller creates HTTP requests",
          ],
          correctIndex: 1,
          explanation: "Dependency Injection means the required dependency is provided to the class rather than being created directly by the class.",
        },
        {
          question: "Where is a dependency commonly declared in NestJS?",
          options: [
            "The constructor",
            "The CSS file",
            "The database",
            "The package.json scripts",
          ],
          correctIndex: 0,
          explanation: "NestJS commonly uses constructor injection.",
        },
        {
          question: "Why is Dependency Injection useful for testing?",
          options: [
            "It removes the need for tests",
            "It allows dependencies to be replaced with test or mock implementations",
            "It automatically writes test cases",
            "It prevents code from running",
          ],
          correctIndex: 1,
          explanation: "Because dependencies are supplied from outside the class, tests can provide alternative implementations.",
        },
      ],
    },

    {
      id: "nestjs-modules",
      title: "Modules",
      durationMinutes: 12,
      explanation: `A module is the part of NestJS that helps you <b>organize related pieces of your application</b>.

If your application is very small, you might be able to keep everything together without thinking much about modules.

But imagine an application with:

- users
- authentication
- products
- orders
- payments
- notifications

You probably do not want every controller and service in one giant collection.

Instead, you can group related code into feature modules.

For example:

\`UsersModule\`

can contain:

\`UsersController\`

and

\`UsersService\`.

Then:

\`OrdersModule\`

can contain:

\`OrdersController\`

and

\`OrdersService\`.

This gives your application clear boundaries.

A NestJS module is a class decorated with \`@Module()\`.

Inside the decorator, you can describe things such as:

<b>imports</b> — other modules this module needs.

<b>controllers</b> — controllers that belong to this module.

<b>providers</b> — providers managed by this module.

<b>exports</b> — providers that this module makes available to modules that import it.

The root module is usually called \`AppModule\`.

Think of \`AppModule\` as the starting point of your application's module graph.

It can import feature modules.

For example:

\`AppModule\`

imports:

\`UsersModule\`

\`AuthModule\`

\`OrdersModule\`

Each feature module can then contain the controllers and providers needed for that feature.

Modules are not just about making folders look clean.

They also affect how NestJS manages providers and dependencies.

For example, if \`UsersService\` belongs to \`UsersModule\` and another module needs to use it, the users module can export the service.

The other module can then import \`UsersModule\`.

This creates a clear relationship between features instead of making every provider globally available.`,
      diagram: `AppModule
   |
   +-------------------+
   |                   |
   v                   v
UsersModule        OrdersModule
   |                   |
   +--> Controller     +--> Controller
   |
   +--> Service        +--> Service
   |
   +--> Repository     +--> Repository

Another example:

AuthModule
   |
   +--> AuthController
   +--> AuthService
   |
   +--> imports UsersModule
                 |
                 +--> UsersService`,
      codeExample: {
        title: "Creating a feature module",
        code: `// users.module.ts

import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}


// app.module.ts

import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [UsersModule],
})
export class AppModule {}`,
      },
      keyTakeaways: [
        "Modules organize related parts of an application.",
        "A NestJS module is created with the `@Module()` decorator.",
        "The `controllers` array registers controllers belonging to the module.",
        "The `providers` array registers providers managed by the module.",
        "The `imports` array allows a module to use another module's exported providers.",
        "The `exports` array makes selected providers available to modules that import the module.",
        "Feature modules help keep large applications organized.",
      ],
      commonMistakes: [
        "<b>Thinking a module is only a folder.</b> A NestJS module controls how parts of the application are registered and connected.",
        "<b>Putting every feature into `AppModule`.</b> The root module should usually compose feature modules rather than becoming a giant feature module itself.",
        "<b>Forgetting to export a provider.</b> If another module needs to use a provider from your module, that provider generally needs to be exported.",
        "<b>Importing a provider instead of its module.</b> NestJS's module system is designed around module boundaries.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a NestJS module?",
          options: [
            "Organizing related application functionality",
            "Replacing TypeScript",
            "Creating HTML",
            "Managing browser storage",
          ],
          correctIndex: 0,
          explanation: "Modules organize related controllers, providers, imports, and exports into application features.",
        },
        {
          question: "Which decorator defines a NestJS module?",
          options: [
            "`@Controller()`",
            "`@Injectable()`",
            "`@Module()`",
            "`@Get()`",
          ],
          correctIndex: 2,
          explanation: "The `@Module()` decorator defines a NestJS module.",
        },
        {
          question: "What does the `exports` array do?",
          options: [
            "Exports the application as a ZIP file",
            "Makes selected providers available to modules that import this module",
            "Creates HTTP routes",
            "Starts the server",
          ],
          correctIndex: 1,
          explanation: "The `exports` array controls which providers are made available outside the module.",
        },
      ],
    },

    {
      id: "controllers",
      title: "Controllers",
      durationMinutes: 10,
      explanation: `A controller is where your NestJS application <b>receives and responds to HTTP requests</b>.

When a browser, frontend application, mobile application, or another server sends a request to your API, NestJS needs to know which piece of code should handle that request.

Controllers provide that entry point.

A controller is usually a class decorated with \`@Controller()\`.

For example:

\`@Controller("users")\`

means that the routes inside the controller begin with \`/users\`.

Inside the controller, you can use decorators such as:

\`@Get()\`

\`@Post()\`

\`@Patch()\`

\`@Put()\`

\`@Delete()\`

These decorators tell NestJS which HTTP method should call a particular method.

For example:

\`@Get()\`

inside \`@Controller("users")\` represents:

\`GET /users\`

Similarly:

\`@Get(":id")\`

represents something like:

\`GET /users/123\`

The controller can also receive information from the request.

For example, \`@Param("id")\` reads a route parameter.

\`@Body()\` reads the request body.

\`@Query()\` reads query parameters.

The controller should generally focus on the HTTP part of the application.

If the request needs complicated business logic, the controller can call a provider or service.

This keeps the controller relatively simple.

For example:

The controller receives:

\`GET /users/123\`

It extracts the ID:

\`123\`

Then it calls:

\`usersService.findOne(123)\`

The service handles the application logic and returns the result.

The controller then returns that result to the client.

This separation becomes very useful as applications grow.`,
      diagram: `HTTP Request
     |
     | GET /users/123
     v
@Controller("users")
     |
     v
@Get(":id")
     |
     | id = 123
     v
UsersService
     |
     v
Database / Repository
     |
     v
User data
     |
     v
HTTP Response`,
      codeExample: {
        title: "A controller with multiple routes",
        code: `import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    return [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return {
      id,
      name: "Alice",
    };
  }

  @Post()
  create(@Body() body: { name: string }) {
    return {
      id: 3,
      name: body.name,
    };
  }
}`,
      },
      keyTakeaways: [
        "Controllers handle incoming HTTP requests.",
        "`@Controller()` defines a controller and an optional route prefix.",
        "`@Get()`, `@Post()`, `@Patch()`, `@Put()`, and `@Delete()` define routes.",
        "`@Param()` reads route parameters.",
        "`@Query()` reads query parameters.",
        "`@Body()` reads request body data.",
        "Controllers should usually delegate complex application logic to providers or services.",
      ],
      commonMistakes: [
        "<b>Putting all business logic inside the controller.</b> Controllers should mainly translate HTTP requests into application operations.",
        "<b>Forgetting that route prefixes combine with route decorators.</b> `@Controller(\"users\")` plus `@Get(\":id\")` produces a route such as `GET /users/:id`.",
        "<b>Confusing `@Param()` and `@Query()`.</b> `/users/123` uses a route parameter, while `/users?id=123` uses a query parameter.",
      ],
      quiz: [
        {
          question: "What does `@Controller(\"users\")` do?",
          options: [
            "Creates a database table",
            "Sets the controller's route prefix to `/users`",
            "Creates a provider",
            "Starts the server",
          ],
          correctIndex: 1,
          explanation: "The decorator tells NestJS that the controller handles routes beginning with `/users`.",
        },
        {
          question: "Which decorator is commonly used to read `/users/123`'s `123` value?",
          options: [
            "`@Body()`",
            "`@Query()`",
            "`@Param()`",
            "`@Module()`",
          ],
          correctIndex: 2,
          explanation: "The `123` value is a route parameter, so `@Param()` is used.",
        },
      ],
    },

    {
      id: "providers",
      title: "Providers",
      durationMinutes: 10,
      explanation: `A provider is a class or value that NestJS can manage and make available through its Dependency Injection system.

The most common provider you will see is a <b>service</b>.

For example, a \`UsersService\` can contain operations related to users:

- finding users
- finding one user
- creating a user
- updating a user
- deleting a user

The controller does not need to contain all of that logic.

Instead, the controller can ask the service to perform the operation.

This gives us a clean separation.

The controller is concerned with HTTP.

The service is concerned with application logic.

For example:

\`GET /users\`

arrives at the controller.

The controller calls:

\`usersService.findAll()\`

The service performs the required work.

The result goes back to the controller.

The controller returns the result as the HTTP response.

A provider does not have to be a service. NestJS's Dependency Injection system can manage different types of providers.

But when you are beginning with NestJS, services are the provider type you will encounter most often.

Providers are registered inside a module.

For example:

\`providers: [UsersService]\`

tells NestJS that the module has a \`UsersService\` provider.

If a controller in that module asks for \`UsersService\` in its constructor, NestJS can provide it.

This is where modules and Dependency Injection start working together.`,
      diagram: `UsersModule
     |
     +---------------------+
     |                     |
     v                     v
UsersController       UsersService
     |                     |
     | injects              |
     +--------------------> |
                           |
                           v
                    Application Logic
                           |
                           v
                    Repository / DB`,
      codeExample: {
        title: "A service used by a controller",
        code: `import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  private readonly users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(
      (user) => user.id === id,
    );
  }
}


// users.controller.ts

import {
  Controller,
  Get,
  Param,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(Number(id));
  }
}`,
      },
      keyTakeaways: [
        "Providers are dependencies managed by NestJS.",
        "Services are the most common type of provider.",
        "Providers usually contain reusable application logic.",
        "Providers are registered in a module.",
        "Controllers can receive providers through Dependency Injection.",
        "Separating controller and service responsibilities keeps code easier to maintain.",
      ],
      commonMistakes: [
        "<b>Thinking provider and service mean exactly the same thing.</b> A service is a common kind of provider, but not every provider has to be a service.",
        "<b>Forgetting `@Injectable()` on a class that should participate in Dependency Injection.</b> Use the appropriate NestJS provider configuration.",
        "<b>Putting every piece of application logic into the controller.</b> Move reusable business logic into providers.",
      ],
      quiz: [
        {
          question: "What is a provider in NestJS?",
          options: [
            "A dependency managed by NestJS",
            "A browser component",
            "A database table",
            "An HTML element",
          ],
          correctIndex: 0,
          explanation: "Providers are dependencies that NestJS can manage through its Dependency Injection system.",
        },
        {
          question: "What is the most common type of provider?",
          options: [
            "Service",
            "HTML file",
            "CSS file",
            "Database server",
          ],
          correctIndex: 0,
          explanation: "Services are the most common provider type in typical NestJS applications.",
        },
      ],
    },

    {
      id: "decorators",
      title: "Decorators",
      durationMinutes: 7,
      explanation: `If you look at NestJS code for the first time, you will probably notice a lot of symbols beginning with \`@\`.

These are <b>decorators</b>.

Decorators are used throughout NestJS to describe how different parts of your application should behave.

For example:

\`@Controller("users")\`

tells NestJS that a class is a controller and that its routes use the \`users\` prefix.

\`@Injectable()\`

tells NestJS that a class can be used as an injectable provider.

\`@Get()\`

tells NestJS that a method should handle GET requests.

You can also use decorators to read parts of an incoming request.

For example:

\`@Param("id")\`

reads a route parameter.

\`@Body()\`

reads the request body.

\`@Query()\`

reads query parameters.

The important thing to understand is that decorators are not a replacement for normal code.

The method still contains the actual application logic.

The decorator gives NestJS additional information about the class or method.

You can think of a decorator as a label or instruction attached to something.

For example:

\`@Controller("users")\`

is essentially telling NestJS:

"This class should be treated as a controller, and its route prefix is users."

Then NestJS uses that information when it builds the application.

This is one reason NestJS code can feel very declarative.

Instead of manually registering every route in a central file, you describe the route next to the method that handles it.

That makes the code easier to read once you become familiar with the decorators.`,
      diagram: `@Controller("users")
        |
        v
  UsersController
        |
        +---- @Get()
        |        |
        |        v
        |    GET /users
        |
        +---- @Get(":id")
                 |
                 v
             GET /users/:id

Decorators give NestJS
information about the code.`,
      codeExample: {
        title: "Common NestJS decorators",
        code: `import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    return [];
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return { id };
  }

  @Post()
  create(@Body() body: { name: string }) {
    return {
      id: 1,
      name: body.name,
    };
  }
}`,
      },
      keyTakeaways: [
        "Decorators begin with the `@` symbol.",
        "NestJS uses decorators to describe classes, methods, parameters, and other application components.",
        "`@Controller()` defines a controller.",
        "`@Get()` and `@Post()` define HTTP routes.",
        "`@Injectable()` marks a class for Dependency Injection.",
        "`@Param()`, `@Body()`, and `@Query()` read data from HTTP requests.",
        "Decorators provide information to NestJS; the decorated methods still contain the actual application logic.",
      ],
      commonMistakes: [
        "<b>Thinking decorators are the actual business logic.</b> Decorators provide information that NestJS uses to configure the application.",
        "<b>Trying to memorize every decorator immediately.</b> Learn the common ones first and understand what problem each one solves.",
        "<b>Thinking `@Get()` makes the method execute by itself.</b> It tells NestJS when the method should be used as an HTTP handler.",
      ],
      quiz: [
        {
          question: "What does `@Get()` describe?",
          options: [
            "A database query",
            "A method that handles a GET HTTP request",
            "A provider",
            "A module",
          ],
          correctIndex: 1,
          explanation: "`@Get()` tells NestJS to register the decorated method as a GET route handler.",
        },
        {
          question: "What does `@Param(\"id\")` do?",
          options: [
            "Creates a database column",
            "Reads the `id` route parameter",
            "Creates a new module",
            "Registers a provider",
          ],
          correctIndex: 1,
          explanation: "`@Param(\"id\")` reads the `id` value from the route parameters.",
        },
      ],
    },

    {
      id: "metadata",
      title: "Metadata",
      durationMinutes: 7,
      explanation: `Metadata is one of those words that can sound much more complicated than it really is.

In simple terms, <b>metadata is information about something</b>.

For example, imagine you have a book.

The actual content of the book is the story.

Information such as the author, title, publication date, and genre is metadata about the book.

NestJS uses a similar idea.

Your class contains normal TypeScript code.

Decorators can attach additional information that tells NestJS how that code should be treated.

For example:

\`@Controller("users")\`

provides information that NestJS can use to understand that the class is a controller and that it has a \`users\` route prefix.

Similarly:

\`@Get()\`

provides information about how a method should be registered as an HTTP route.

\`@Injectable()\`

provides information that allows NestJS to treat a class as an injectable provider.

NestJS reads this information while building the application.

You can think of the process like this:

First, you write your classes and methods.

Then, decorators describe those classes and methods.

NestJS reads that information.

NestJS builds the application's internal structure.

When a request arrives, NestJS knows which controller and method should handle it.

This is why NestJS can automatically connect many parts of an application without you manually registering every relationship.

Metadata is also important for other NestJS features that you will learn later, including things such as guards, pipes, interceptors, validation, and Dependency Injection.

As a beginner, you do not need to understand the internal implementation of metadata yet.

The important idea is simply:

<b>Decorators provide information, and NestJS uses that information to understand how your application is structured.</b>`,
      diagram: `Your TypeScript code

@Controller("users")
class UsersController {
  @Get()
  findAll() {}
}

        |
        | decorators provide information
        v

NestJS reads metadata

        |
        +--> This is a controller
        |
        +--> Route prefix = /users
        |
        +--> findAll handles GET /
        |
        v

NestJS builds the application
routing and dependency structure.`,
      codeExample: {
        title: "Decorators provide metadata to NestJS",
        code: `import {
  Controller,
  Get,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class UsersService {
  findAll() {
    return [];
  }
}

@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    return [];
  }
}

/*
NestJS can use the decorator
information to understand:

- UsersService is injectable.
- UsersController is a controller.
- The controller prefix is /users.
- findAll handles GET /users.
*/`,
      },
      keyTakeaways: [
        "Metadata is information about code or an object.",
        "NestJS uses decorators to provide metadata about application components.",
        "NestJS reads this information when building the application.",
        "Metadata helps NestJS discover controllers, routes, providers, and dependencies.",
        "You do not need to understand the internal implementation of metadata to start using NestJS.",
        "The important beginner idea is that decorators describe code and NestJS uses that information.",
      ],
      commonMistakes: [
        "<b>Thinking metadata is the response returned to the client.</b> Metadata is information about the code or component, not the HTTP response.",
        "<b>Thinking decorators contain all the application logic.</b> They mainly provide information that NestJS uses to configure the application.",
        "<b>Trying to understand every internal metadata API immediately.</b> Start by understanding what information the common NestJS decorators communicate.",
      ],
      quiz: [
        {
          question: "What does metadata mean in simple terms?",
          options: [
            "Information about something",
            "A database password",
            "A frontend component",
            "An HTTP status code",
          ],
          correctIndex: 0,
          explanation: "Metadata is information that describes or provides additional details about something.",
        },
        {
          question: "How does NestJS commonly provide metadata?",
          options: [
            "Through decorators",
            "Through CSS",
            "Through SQL",
            "Through browser cookies",
          ],
          correctIndex: 0,
          explanation: "NestJS uses decorators to provide information that the framework can inspect and use.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is NestJS?",
      options: [
        "A frontend-only framework",
        "A Node.js framework for building structured server-side applications",
        "A database engine",
        "A CSS library",
      ],
      correctIndex: 1,
      explanation: "NestJS is a Node.js framework designed to help developers build structured and maintainable server-side applications.",
    },
    {
      question: "What is one major difference between Express and NestJS?",
      options: [
        "Express cannot handle HTTP requests",
        "NestJS provides more built-in application architecture and conventions",
        "NestJS cannot use TypeScript",
        "Express is a database system",
      ],
      correctIndex: 1,
      explanation: "Express is relatively minimal and flexible, while NestJS provides conventions around modules, controllers, providers, and Dependency Injection.",
    },
    {
      question: "Can NestJS use Express as its underlying HTTP platform?",
      options: [
        "No",
        "Yes",
        "Only during testing",
        "Only with JavaScript",
      ],
      correctIndex: 1,
      explanation: "NestJS supports Express through an HTTP adapter.",
    },
    {
      question: "Can NestJS use Fastify as its underlying HTTP platform?",
      options: [
        "No",
        "Yes",
        "Only for frontend applications",
        "Only with PostgreSQL",
      ],
      correctIndex: 1,
      explanation: "NestJS provides a Fastify adapter, allowing Fastify to handle the underlying HTTP layer.",
    },
    {
      question: "What is Dependency Injection?",
      options: [
        "A way for a class to receive dependencies instead of creating them itself",
        "A database migration technique",
        "A way to create CSS files",
        "A frontend routing system",
      ],
      correctIndex: 0,
      explanation: "Dependency Injection allows NestJS to provide required dependencies to classes.",
    },
    {
      question: "Where are dependencies commonly declared in NestJS?",
      options: [
        "The constructor",
        "The CSS file",
        "The database",
        "The HTML document",
      ],
      correctIndex: 0,
      explanation: "Constructor injection is the most common Dependency Injection pattern in NestJS.",
    },
    {
      question: "What is the main purpose of a module?",
      options: [
        "Organize related application functionality",
        "Replace Node.js",
        "Create browser storage",
        "Compile TypeScript",
      ],
      correctIndex: 0,
      explanation: "Modules organize related controllers, providers, imports, and exports into application features.",
    },
    {
      question: "Which decorator defines a NestJS module?",
      options: [
        "`@Controller()`",
        "`@Module()`",
        "`@Injectable()`",
        "`@Get()`",
      ],
      correctIndex: 1,
      explanation: "`@Module()` defines a NestJS module.",
    },
    {
      question: "What is a controller primarily responsible for?",
      options: [
        "Handling incoming HTTP requests",
        "Managing npm packages",
        "Creating database tables",
        "Compiling JavaScript",
      ],
      correctIndex: 0,
      explanation: "Controllers form the HTTP boundary and handle incoming requests.",
    },
    {
      question: "What is a provider commonly used for?",
      options: [
        "Reusable application logic and dependencies",
        "CSS styling",
        "HTML rendering in the browser",
        "Managing Git branches",
      ],
      correctIndex: 0,
      explanation: "Providers are dependencies managed by NestJS, and services are commonly used for reusable application logic.",
    },
    {
      question: "What does `@Injectable()` indicate?",
      options: [
        "A class can participate in NestJS Dependency Injection",
        "A class is an HTTP route",
        "A class is a database table",
        "A class is a React component",
      ],
      correctIndex: 0,
      explanation: "`@Injectable()` marks a class as available for NestJS's Dependency Injection system.",
    },
    {
      question: "What does `@Controller(\"users\")` describe?",
      options: [
        "A database table named users",
        "A controller with `/users` as its route prefix",
        "A provider named users",
        "A TypeScript interface",
      ],
      correctIndex: 1,
      explanation: "The decorator tells NestJS that the class is a controller and that its routes begin with `/users`.",
    },
    {
      question: "What does `@Get()` tell NestJS?",
      options: [
        "The method handles a GET HTTP request",
        "The method creates a database",
        "The method creates a module",
        "The method becomes a provider",
      ],
      correctIndex: 0,
      explanation: "`@Get()` registers the decorated method as a GET route handler.",
    },
    {
      question: "What is metadata in simple terms?",
      options: [
        "Information about something",
        "A database",
        "A frontend framework",
        "An HTTP method",
      ],
      correctIndex: 0,
      explanation: "Metadata is information that describes or provides additional information about something.",
    },
    {
      question: "Why does NestJS use decorators and metadata?",
      options: [
        "To help the framework understand how application components should be configured",
        "To replace Node.js",
        "To store passwords",
        "To create CSS",
      ],
      correctIndex: 0,
      explanation: "NestJS uses decorator metadata to discover and configure controllers, routes, providers, dependencies, and other framework features.",
    },
  ],

  project: {
    name: "Build a basic NestJS users API",
    goal: "Build a small NestJS API that uses the core concepts from this lesson: modules, controllers, providers, Dependency Injection, decorators, and metadata.",
    brief: "Create a Users feature from scratch. The feature should have its own module, controller, and service. The controller should expose HTTP endpoints, while the service should contain the user-related application logic. The goal is to understand how the different NestJS pieces connect rather than building a production-ready API.",
    steps: [
      "Create a new NestJS application.",
      "Run the application and confirm that the starter application works.",
      "Create a `users` feature folder.",
      "Create a `UsersModule` using the `@Module()` decorator.",
      "Create a `UsersController` using the `@Controller(\"users\")` decorator.",
      "Create a `UsersService` using the `@Injectable()` decorator.",
      "Register `UsersController` in the `controllers` array of `UsersModule`.",
      "Register `UsersService` in the `providers` array of `UsersModule`.",
      "Import `UsersModule` into the root `AppModule`.",
      "Inject `UsersService` into `UsersController` through the constructor.",
      "Add a `GET /users` endpoint.",
      "Create an in-memory array containing at least three users inside the service.",
      "Return the users from `UsersService.findAll()`.",
      "Call `usersService.findAll()` from the controller instead of keeping the user data inside the controller.",
      "Add a `GET /users/:id` endpoint.",
      "Use `@Param(\"id\")` to read the user ID.",
      "Create a `findOne()` method inside `UsersService`.",
      "Return the matching user from the service.",
      "Test `GET /users` using a browser, REST client, or API client.",
      "Test `GET /users/1` and another user ID.",
      "Look at your code and identify where NestJS uses modules, controllers, providers, Dependency Injection, decorators, and metadata.",
      "Write down the request flow in your own words: HTTP request → controller → service → response.",
    ],
    acceptance: [
      "The NestJS application starts successfully.",
      "A dedicated `UsersModule` exists.",
      "The root `AppModule` imports `UsersModule`.",
      "A `UsersController` exists and uses `@Controller(\"users\")`.",
      "A `UsersService` exists and uses `@Injectable()`.",
      "The controller is registered in the module.",
      "The service is registered as a provider in the module.",
      "The service is injected into the controller through the constructor.",
      "`GET /users` returns a list of users.",
      "`GET /users/:id` returns a user based on the route parameter.",
      "User-related application logic is kept in the service rather than being duplicated in the controller.",
      "The application demonstrates the relationship between modules, controllers, providers, and Dependency Injection.",
    ],
    stretch: [
      "Add a `POST /users` endpoint.",
      "Use `@Body()` to receive a user's name and email.",
      "Add a `create()` method to `UsersService`.",
      "Add a `DELETE /users/:id` endpoint.",
      "Create a separate `UsersRepository` provider and let `UsersService` depend on it.",
      "Create an `OrdersModule` and add an `OrdersController` and `OrdersService`.",
      "Create a shared provider and experiment with importing and exporting it between modules.",
      "Switch the NestJS HTTP adapter from Express to Fastify and confirm that your controller routes still work.",
      "Explain in your own words why Dependency Injection is useful instead of creating `UsersService` manually with `new` inside the controller.",
    ],
  },
};
