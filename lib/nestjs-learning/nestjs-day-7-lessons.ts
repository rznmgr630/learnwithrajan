import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_7_LESSONS: LessonDay = {
  day: 7,
  title: "NestJS Project Structure",
  totalMinutes: 105,
  difficulty: "Beginner",
  lessons: [
    {
      id: "nestjs-cli",
      title: "Nest CLI",
      durationMinutes: 17,
      explanation: `When you create a NestJS application, you could technically create every file yourself.

You could create a \`main.ts\` file, create an \`AppModule\`, create controllers, create services, configure TypeScript, and set up the build process manually.

But that would be a lot of repetitive work.

NestJS provides a command-line tool called the <b>Nest CLI</b> to make these tasks easier.

CLI stands for <b>Command Line Interface</b>.

A command-line interface allows you to interact with a tool by typing commands into your terminal.

The Nest CLI is used to create projects, generate files, start the development server, build applications, and perform other common development tasks.

For example, you can create a new NestJS project with:

\`nest new my-api\`

The CLI will create the basic project structure for you.

You will normally see files such as:

\`src/main.ts\`

\`src/app.module.ts\`

\`src/app.controller.ts\`

\`src/app.service.ts\`

You will also get configuration files such as:

\`package.json\`

\`tsconfig.json\`

\`nest-cli.json\`

and other files needed by the project.

The CLI is useful because it gives your project a consistent starting point.

Instead of every developer creating NestJS projects differently, the CLI provides a standard structure.

The CLI is also useful after the project has been created.

For example, you can generate a controller:

\`nest generate controller users\`

or use the shorter version:

\`nest g controller users\`

You can generate a service:

\`nest generate service users\`

or:

\`nest g service users\`

You can also generate other NestJS building blocks, such as modules, guards, pipes, interceptors, middleware, and more.

One important thing to understand is that the CLI is a <b>development tool</b>.

Your application does not need the CLI to handle every incoming request.

The CLI helps you create and manage the project. Once your application is running, your compiled application code is what actually runs.

You should also understand the difference between installing the CLI globally and using project-local commands.

Many developers use the Nest CLI command directly during development, but the exact installation and command setup can vary between projects and environments.

The important beginner idea is this:

<b>The Nest CLI is a tool that helps you create and manage a NestJS application from the terminal.</b>

It does not replace the NestJS framework itself.

It simply makes common development tasks much easier.`,
      diagram: `Your Terminal
     |
     | nest new my-api
     v
Nest CLI
     |
     +-------------------------+
     |                         |
     v                         v
Project files             Configuration
     |                         |
     +------------+------------+
                  |
                  v
            NestJS Project

Later:

nest g controller users
        |
        v
Creates controller files

nest g service users
        |
        v
Creates service files`,
      codeExample: {
        title: "Common Nest CLI commands",
        code: `# Create a new NestJS project
nest new my-api

# Move into the project
cd my-api

# Start the development server
npm run start:dev

# Generate a controller
nest generate controller users

# Generate a service
nest generate service users

# Generate a module
nest generate module users

# Short forms
nest g controller users
nest g service users
nest g module users`,
      },
      keyTakeaways: [
        "The Nest CLI is a command-line tool for working with NestJS projects.",
        "The CLI can create a new NestJS application.",
        "The CLI can generate controllers, services, modules, and other building blocks.",
        "`nest generate` and `nest g` are commonly used to generate files.",
        "The CLI is mainly a development tool; it does not handle HTTP requests for your running application.",
        "Using the CLI helps keep NestJS project structures consistent.",
      ],
      commonMistakes: [
        "<b>Thinking the CLI is the NestJS framework.</b> The CLI is a tool used to create and manage NestJS projects. The framework is what your application uses at runtime.",
        "<b>Creating every file manually without understanding generated structure.</b> You can create files manually, but learning the CLI helps you work faster and follow common NestJS conventions.",
        "<b>Thinking generated files contain all of your application's logic.</b> Generators create a starting point. You still need to implement the actual application behavior.",
        "<b>Running CLI commands from the wrong directory.</b> When working with an existing project, make sure you are working in the project directory.",
      ],
      quiz: [
        {
          question: "What does CLI stand for?",
          options: [
            "Code Logic Interface",
            "Command Line Interface",
            "Component Loading Interface",
            "Controller Logic Integration",
          ],
          correctIndex: 1,
          explanation: "CLI stands for Command Line Interface. It allows you to interact with tools using terminal commands.",
        },
        {
          question: "What can the Nest CLI do?",
          options: [
            "Only start databases",
            "Generate NestJS building blocks and create projects",
            "Only write HTML",
            "Only compile CSS",
          ],
          correctIndex: 1,
          explanation: "The Nest CLI can create projects, generate files, start development tasks, and perform other common NestJS development operations.",
        },
        {
          question: "What is a shorter version of `nest generate controller users`?",
          options: [
            "`nest c users`",
            "`nest g controller users`",
            "`nest make users`",
            "`nest create controller users`",
          ],
          correctIndex: 1,
          explanation: "`nest g` is the commonly used shorthand for `nest generate`.",
        },
      ],
    },

    {
      id: "main-ts",
      title: "main.ts",
      durationMinutes: 15,
      explanation: `The \`main.ts\` file is one of the most important files in a NestJS application.

It is usually the <b>entry point</b> of the application.

The entry point is the place where the application starts running.

When you start a NestJS application, NestJS needs to create the application instance and tell it which root module to use.

That work normally happens in \`main.ts\`.

A basic \`main.ts\` looks like this:

\`NestFactory.create(AppModule)\`

followed by:

\`app.listen(3000)\`

Let's break that down.

First, \`NestFactory\` is used to create the NestJS application.

Then:

\`NestFactory.create(AppModule)\`

tells NestJS:

"Create an application using \`AppModule\` as the root module."

Remember from the previous lesson that modules are used to organize your application.

\`AppModule\` is normally the root of that module structure.

After the application has been created, you need to tell it to listen for HTTP requests.

That is what this line does:

\`await app.listen(3000)\`

It tells the application to start listening on port \`3000\`.

Once the server is running, you can usually visit:

\`http://localhost:3000\`

in your browser or send requests to that address.

You will often see \`main.ts\` written using an asynchronous \`bootstrap()\` function.

For example:

\`async function bootstrap() {}\`

The word "bootstrap" is commonly used to describe the process of starting the application.

Inside the function, NestJS creates the application and starts listening.

You can think of \`main.ts\` as the application's startup file.

It answers an important question:

<b>"How does this NestJS application start?"</b>

It is also a common place for global application configuration.

For example, later you may add:

- global validation pipes
- CORS configuration
- global prefixes
- middleware
- other application-wide settings

That means \`main.ts\` is not just about calling \`listen()\`.

It is also a place where you configure behavior that should apply to the entire application.

However, you should avoid putting normal business logic into \`main.ts\`.

For example, your user creation logic should not live inside \`main.ts\`.

Business logic belongs in appropriate providers and services.

A useful mental model is:

<b>\`main.ts\` starts and configures the application.</b>

<b>Modules organize the application.</b>

<b>Controllers handle requests.</b>

<b>Providers handle reusable application logic.</b>`,
      diagram: `Node.js starts
      |
      v
main.ts
      |
      | NestFactory.create()
      v
AppModule
      |
      +--> UsersModule
      |
      +--> AuthModule
      |
      +--> OrdersModule
      |
      v
NestJS Application
      |
      | app.listen(3000)
      v
HTTP Server
      |
      v
Requests can arrive`,
      codeExample: {
        title: "The NestJS application entry point",
        code: `import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}

bootstrap();`,
      },
      keyTakeaways: [
        "`main.ts` is normally the entry point of a NestJS application.",
        "`NestFactory.create()` creates the NestJS application.",
        "`AppModule` is normally passed to `NestFactory.create()` as the root module.",
        "`app.listen(3000)` starts the HTTP server on port 3000.",
        "The `bootstrap()` function is commonly used to start the application.",
        "`main.ts` is also a common place for global application configuration.",
        "Business logic should not normally be placed inside `main.ts`.",
      ],
      commonMistakes: [
        "<b>Thinking `main.ts` contains all application code.</b> It is the startup and configuration entry point, not the place for all business logic.",
        "<b>Forgetting to call `bootstrap()`.</b> Defining the function is not enough; the function must actually be executed.",
        "<b>Confusing the port with the route.</b> Port `3000` identifies where the server listens, while routes such as `/users` identify specific API endpoints.",
        "<b>Putting database and business logic directly into `main.ts`.</b> Keep the startup file focused on application bootstrapping and global configuration.",
      ],
      quiz: [
        {
          question: "What is `main.ts` usually responsible for?",
          options: [
            "Starting the NestJS application",
            "Storing all database records",
            "Defining every user",
            "Creating frontend components",
          ],
          correctIndex: 0,
          explanation: "`main.ts` is normally the application's entry point and is responsible for creating and starting the NestJS application.",
        },
        {
          question: "What does `NestFactory.create(AppModule)` do?",
          options: [
            "Creates a database table",
            "Creates the NestJS application using AppModule",
            "Creates a controller automatically",
            "Starts a React application",
          ],
          correctIndex: 1,
          explanation: "It creates the NestJS application and uses `AppModule` as the root module.",
        },
        {
          question: "What does `app.listen(3000)` do?",
          options: [
            "Creates a module",
            "Starts listening for HTTP requests on port 3000",
            "Creates a database",
            "Generates a controller",
          ],
          correctIndex: 1,
          explanation: "It starts the application so it can receive network requests on port 3000.",
        },
      ],
    },

    {
      id: "app-module",
      title: "app.module.ts",
      durationMinutes: 15,
      explanation: `If \`main.ts\` is the file that starts the application, \`app.module.ts\` is the file that describes the <b>root structure of the application</b>.

The main class in this file is usually called \`AppModule\`.

It uses the \`@Module()\` decorator.

A basic module looks like this:

\`@Module({})\`

followed by:

\`export class AppModule {}\`

The \`@Module()\` decorator accepts an object that tells NestJS about the components that belong to the module.

You will commonly see four properties:

<b>imports</b>

<b>controllers</b>

<b>providers</b>

<b>exports</b>

You already saw these concepts in the previous lesson, but now it is important to understand how they appear in the actual project structure.

The \`imports\` property is used when the module needs another module.

For example:

\`imports: [UsersModule]\`

means that \`AppModule\` imports the users feature module.

The \`controllers\` property lists controllers that belong directly to the module.

The \`providers\` property lists providers managed by the module.

The \`exports\` property specifies providers that this module makes available to other modules.

In a typical application, \`AppModule\` often becomes the root module that connects feature modules together.

For example:

\`AppModule\`

might import:

\`UsersModule\`

\`AuthModule\`

\`ProductsModule\`

\`OrdersModule\`

This creates a module graph.

The application starts at \`AppModule\`, and NestJS follows the imported modules to discover the rest of the application's structure.

This is why \`AppModule\` is important.

It is not necessarily where all your application logic belongs.

Instead, think of it as the <b>root composition point</b> of your application.

As your application grows, you generally want \`AppModule\` to remain relatively easy to understand.

For example, if you have 20 features, you do not want 100 providers and controllers directly inside \`AppModule\`.

Instead, group them into feature modules.

Then \`AppModule\` can simply connect those modules together.

This keeps the root of the application clean.`,
      diagram: `main.ts
   |
   v
AppModule
   |
   +---------------------+
   |          |          |
   v          v          v
UsersModule  AuthModule  OrdersModule
   |          |          |
   v          v          v
Users        Auth        Orders
Controller   Controller  Controller
Service      Service     Service

AppModule is the
root of the module graph.`,
      codeExample: {
        title: "A root AppModule",
        code: `import { Module } from "@nestjs/common";

import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { OrdersModule } from "./orders/orders.module";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    OrdersModule,
  ],
})
export class AppModule {}`,
      },
      keyTakeaways: [
        "`app.module.ts` usually contains the root `AppModule`.",
        "`AppModule` is commonly the root of the application's module graph.",
        "The `@Module()` decorator describes the module's structure.",
        "`imports` connects other modules to the current module.",
        "`controllers` registers controllers belonging to the module.",
        "`providers` registers dependencies managed by the module.",
        "`exports` makes selected providers available outside the module.",
        "A large application should usually be divided into feature modules rather than placing everything inside `AppModule`.",
      ],
      commonMistakes: [
        "<b>Putting every controller and service directly into `AppModule`.</b> Use feature modules to keep large applications organized.",
        "<b>Confusing `imports` and `providers`.</b> `imports` is for modules, while `providers` is for injectable dependencies managed by the module.",
        "<b>Thinking `AppModule` contains all application logic.</b> It is mainly the root composition point.",
        "<b>Forgetting to import a feature module.</b> If a feature module is not connected to the application's module graph, NestJS cannot use its components as expected.",
      ],
      quiz: [
        {
          question: "What is usually exported from `app.module.ts`?",
          options: [
            "AppModule",
            "AppController only",
            "The database",
            "The Node.js runtime",
          ],
          correctIndex: 0,
          explanation: "The root module is usually defined as `AppModule` and exported from `app.module.ts`.",
        },
        {
          question: "What does the `imports` property of a module contain?",
          options: [
            "Other modules",
            "Only strings",
            "Database rows",
            "HTTP responses",
          ],
          correctIndex: 0,
          explanation: "The `imports` array is used to connect other NestJS modules to the current module.",
        },
        {
          question: "Why should a large application use feature modules?",
          options: [
            "To organize related functionality",
            "To remove HTTP",
            "To avoid TypeScript",
            "To prevent controllers from working",
          ],
          correctIndex: 0,
          explanation: "Feature modules create clear boundaries and prevent the root module from becoming unnecessarily large.",
        },
      ],
    },

    {
      id: "controllers-project-structure",
      title: "Controllers in the project structure",
      durationMinutes: 12,
      explanation: `You already learned what a controller does conceptually. Now let's look at where controllers fit inside a real NestJS project.

A common project might look like this:

\`src/users/users.controller.ts\`

The file name tells you that this is the controller for the users feature.

The controller itself might look like:

\`@Controller("users")\`

This means that the controller handles routes under the \`/users\` path.

For example:

\`GET /users\`

\`GET /users/123\`

\`POST /users\`

could all belong to the same controller.

The controller is the part of the feature that talks directly to HTTP.

That means controllers commonly deal with:

- route paths
- HTTP methods
- route parameters
- query parameters
- request bodies
- HTTP responses

However, that does not mean the controller should contain all of the feature's logic.

For example, imagine you need to create a user.

The controller receives:

\`POST /users\`

with a request body such as:

\`{ "name": "Alice" }\`

The controller can receive that body and pass the relevant information to \`UsersService\`.

The service can then perform the actual application logic.

This distinction becomes very important when your project gets larger.

A controller should be relatively easy to read.

If a controller method contains 100 lines of business rules, database operations, email sending, payment calculations, and other unrelated logic, that is usually a sign that responsibilities should be moved into providers or other appropriate parts of the application.

The controller is the <b>HTTP entry point</b>.

It is not the entire application.`,
      diagram: `src/
 |
 +-- users/
 |    |
 |    +-- users.controller.ts
 |    +-- users.service.ts
 |    +-- users.module.ts
 |
 +-- app.module.ts
 +-- main.ts


Request
   |
   v
UsersController
   |
   | extracts HTTP data
   v
UsersService
   |
   | application logic
   v
Data source`,
      codeExample: {
        title: "A controller inside a feature folder",
        code: `// src/users/users.controller.ts

import {
  Controller,
  Get,
  Param,
} from "@nestjs/common";

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

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(
      Number(id),
    );
  }
}`,
      },
      keyTakeaways: [
        "Controllers commonly live inside the feature folder they belong to.",
        "A controller is the HTTP entry point for a feature.",
        "Controllers define routes using HTTP method decorators.",
        "Controllers can read route parameters, query parameters, and request bodies.",
        "Controllers commonly call providers or services to perform application logic.",
        "Keeping controllers focused makes them easier to understand and maintain.",
      ],
      commonMistakes: [
        "<b>Putting database queries directly into every controller method.</b> Move reusable data and business operations into appropriate providers.",
        "<b>Making a controller responsible for unrelated features.</b> Keep controllers focused on their feature.",
        "<b>Creating a giant controller.</b> Split features into separate modules and controllers when appropriate.",
      ],
      quiz: [
        {
          question: "What is a controller's main role?",
          options: [
            "Act as an HTTP entry point",
            "Compile TypeScript",
            "Store database data",
            "Manage Git",
          ],
          correctIndex: 0,
          explanation: "Controllers receive HTTP requests and connect those requests to application logic.",
        },
        {
          question: "Where is a controller commonly placed?",
          options: [
            "Inside the feature folder it belongs to",
            "Only inside `node_modules`",
            "Inside the database",
            "Inside `package.json`",
          ],
          correctIndex: 0,
          explanation: "A common NestJS structure places related controllers, services, and modules together in a feature folder.",
        },
      ],
    },

    {
      id: "services-project-structure",
      title: "Services in the project structure",
      durationMinutes: 12,
      explanation: `A service is one of the most common things you will create in a NestJS application.

A service usually contains <b>application logic that can be reused by controllers or other providers</b>.

For example, a \`UsersService\` might contain methods such as:

\`findAll()\`

\`findOne()\`

\`create()\`

\`update()\`

\`remove()\`

The controller does not need to know every detail about how these operations work.

It can simply call the appropriate service method.

For example:

\`usersService.findAll()\`

The service could then retrieve information from a repository or database.

A service is normally marked with:

\`@Injectable()\`

This tells NestJS that the class can participate in the Dependency Injection system.

The service is then registered in the module's \`providers\` array.

For example:

\`providers: [UsersService]\`

Once the service is registered, NestJS can inject it into a controller.

This creates a very common structure:

\`UsersController\`

depends on:

\`UsersService\`

which might depend on:

\`UsersRepository\`

which might depend on:

\`DatabaseClient\`.

This chain is managed by NestJS's Dependency Injection system.

One important beginner concept is that "service" does not mean "database."

A service can work with a database, but a service can also do many other things.

For example, you might have:

\`EmailService\`

\`PaymentService\`

\`FileService\`

\`NotificationService\`

\`AuthService\`

Each service can contain logic for a particular responsibility.

The goal is not to create a service for every single function.

The goal is to organize related application behavior into understandable components.`,
      diagram: `UsersController
       |
       | injects
       v
UsersService
       |
       +--> UsersRepository
       |
       +--> EmailService
       |
       +--> Other providers
       |
       v
Application behavior`,
      codeExample: {
        title: "A simple UsersService",
        code: `import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
    },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(
      (user) => user.id === id,
    );
  }
}`,
      },
      keyTakeaways: [
        "Services commonly contain reusable application logic.",
        "A service is usually marked with `@Injectable()`.",
        "Services are registered in a module's `providers` array.",
        "Controllers commonly use services through Dependency Injection.",
        "A service does not have to be a database wrapper.",
        "Different services can handle different application responsibilities.",
      ],
      commonMistakes: [
        "<b>Thinking every service must directly access the database.</b> Services can contain many types of application logic.",
        "<b>Putting HTTP-specific logic everywhere inside a service.</b> Keep HTTP concerns primarily in controllers when possible.",
        "<b>Creating one enormous service for the entire application.</b> Organize services around meaningful responsibilities and features.",
      ],
      quiz: [
        {
          question: "What is a common responsibility of a service?",
          options: [
            "Reusable application logic",
            "Writing CSS",
            "Creating HTML pages",
            "Starting the operating system",
          ],
          correctIndex: 0,
          explanation: "Services commonly contain reusable application logic.",
        },
        {
          question: "What decorator is commonly used on NestJS services?",
          options: [
            "`@Module()`",
            "`@Controller()`",
            "`@Injectable()`",
            "`@Get()`",
          ],
          correctIndex: 2,
          explanation: "`@Injectable()` marks a class so it can participate in NestJS Dependency Injection.",
        },
      ],
    },

    {
      id: "nestjs-generators",
      title: "Generators",
      durationMinutes: 12,
      explanation: `NestJS generators are one of the most useful parts of the Nest CLI.

A generator creates the files needed for a particular NestJS building block.

Instead of manually creating a file, writing the class, importing the correct decorator, and remembering the standard naming convention, you can ask the CLI to generate the component.

For example:

\`nest generate controller users\`

will generate a users controller.

You can also use:

\`nest generate service users\`

to generate a service.

And:

\`nest generate module users\`

to generate a module.

The shorter command is:

\`nest g controller users\`

The generator can also update related module files depending on how the command is used and how the project is structured.

This is useful because NestJS applications follow many naming and structural conventions.

For example, a users feature commonly has:

\`users.controller.ts\`

\`users.service.ts\`

\`users.module.ts\`

The CLI can create these files using the expected naming style.

Generators are not magic code generators that understand your entire business requirement.

They do not know how your application should behave.

For example, if you generate a UsersService, NestJS cannot know whether your application should store users in PostgreSQL, MongoDB, Redis, or an external API.

The generator gives you a starting point.

You then write the actual application logic.

This distinction is important.

<b>Generators create structure.</b>

<b>You create the behavior.</b>

You should also learn to inspect generated files instead of blindly accepting them.

When you run a generator, open the files and read what was created.

This is actually a great way to learn NestJS because you can see the relationship between:

- decorators
- classes
- imports
- modules
- controllers
- providers

After using generators several times, the generated code will become familiar and you will understand what each piece is doing.`,
      diagram: `Terminal
   |
   | nest g service users
   v
Nest Generator
   |
   +--------------------------+
   |                          |
   v                          v
users.service.ts        Related module
   |
   v
@Injectable()
export class UsersService {}

Then you add:

Your application logic
        |
        v
UsersService`,
      codeExample: {
        title: "Generating a users feature",
        code: `# Generate a module
nest g module users

# Generate a controller
nest g controller users

# Generate a service
nest g service users

# Short versions
nest g mo users
nest g co users
nest g s users`,
      },
      keyTakeaways: [
        "Generators create common NestJS project files for you.",
        "The CLI can generate modules, controllers, services, and many other components.",
        "`nest g` is a shorthand for `nest generate`.",
        "Generators help maintain common NestJS naming and structural conventions.",
        "Generated code is only a starting point; you still need to implement application behavior.",
        "Reading generated files is a useful way to learn NestJS.",
      ],
      commonMistakes: [
        "<b>Thinking generated code is finished application code.</b> Generators create a starting structure, not your business requirements.",
        "<b>Never reading generated files.</b> Open them and understand what the CLI created.",
        "<b>Generating everything without thinking about architecture.</b> Use generators to support a good structure, not to avoid thinking about where responsibilities belong.",
      ],
      quiz: [
        {
          question: "What is the purpose of a Nest generator?",
          options: [
            "Create common NestJS application building blocks",
            "Automatically design your entire business logic",
            "Create database records",
            "Deploy your application automatically",
          ],
          correctIndex: 0,
          explanation: "Generators create common files and structures such as controllers, services, and modules.",
        },
        {
          question: "What does `nest g` mean?",
          options: [
            "A shortcut for `nest generate`",
            "A database command",
            "A Git command",
            "A TypeScript command",
          ],
          correctIndex: 0,
          explanation: "`nest g` is a commonly used shorthand for `nest generate`.",
        },
      ],
    },

    {
      id: "nestjs-build-process",
      title: "Build process",
      durationMinutes: 13,
      explanation: `When you write a NestJS application, you normally write TypeScript.

But Node.js does not simply take your TypeScript source files and run them exactly as you wrote them in every setup.

Your project normally has a <b>build process</b> that transforms your source code into the JavaScript output that will be run by Node.js.

This is especially important because TypeScript gives you features such as:

- type checking
- interfaces
- type annotations
- enums
- modern language features
- better developer tooling

The build process takes your source code and produces an output directory, commonly called \`dist\`.

For example, you might have:

\`src/main.ts\`

and after building, you may get something like:

\`dist/main.js\`

The exact output structure can depend on the project's TypeScript and Nest configuration.

A typical command is:

\`npm run build\`

This runs the build script defined in \`package.json\`.

The Nest CLI can also perform the build using the project's configuration.

The important distinction is between <b>source code</b> and <b>build output</b>.

Your source code is what you edit.

Your build output is what the build process produces for execution.

You generally do not manually edit the generated files in \`dist\`.

Instead, you change the files in \`src\`, then build the application again.

During development, you often do not want to manually run a build after every tiny change.

That is why the development server provides watch mode.

The development server can detect changes to your source files and rebuild or restart the application automatically.

This gives you a much faster development workflow.

The overall idea is:

<b>Write TypeScript → build → produce JavaScript → run the application</b>

In development, tooling can automate the build and restart steps for you.

In production, you typically build the application and then run the generated output.

The exact production setup depends on how the application is deployed, but understanding this basic source-to-build relationship is important.`,
      diagram: `Source code
   |
   | TypeScript
   v
src/
   |
   | npm run build
   v
Build process
   |
   v
dist/
   |
   | JavaScript output
   v
Node.js
   |
   v
Running application


Development:

src/
 |
 | file changes
 v
Watch mode
 |
 +--> rebuild
 |
 +--> restart
 |
 v
Running application`,
      codeExample: {
        title: "Build and run a NestJS application",
        code: `# Build the application
npm run build

# The build creates compiled output,
# commonly inside the dist directory.

# Start the built application
npm run start:prod

# During development, use watch mode
npm run start:dev`,
      },
      keyTakeaways: [
        "NestJS applications are commonly written in TypeScript.",
        "The build process produces JavaScript output that can be executed by Node.js.",
        "Source files commonly live inside `src`.",
        "Build output commonly goes into `dist`.",
        "`npm run build` runs the project's build process.",
        "You normally edit source files rather than generated files inside `dist`.",
        "Development tooling can automatically rebuild the application when source files change.",
      ],
      commonMistakes: [
        "<b>Editing files inside `dist`.</b> `dist` is generated output. Make changes in `src` and build again.",
        "<b>Thinking TypeScript source and build output are the same thing.</b> The build process transforms your source into executable output.",
        "<b>Manually rebuilding after every change during development.</b> Use the development watch mode to automate this workflow.",
        "<b>Deleting the source code because the build folder contains JavaScript.</b> The source code is the code you maintain; the build output is generated from it.",
      ],
      quiz: [
        {
          question: "What is the purpose of the build process?",
          options: [
            "Transform source code into runnable output",
            "Create a database",
            "Generate HTTP requests",
            "Create Git commits",
          ],
          correctIndex: 0,
          explanation: "The build process transforms the application's source code into output that can be executed by the runtime.",
        },
        {
          question: "Where is NestJS build output commonly placed?",
          options: [
            "`dist`",
            "`node_modules`",
            "`public`",
            "`database`",
          ],
          correctIndex: 0,
          explanation: "NestJS projects commonly use `dist` for compiled build output.",
        },
      ],
    },

    {
      id: "development-server",
      title: "Development server",
      durationMinutes: 14,
      explanation: `During development, you want a fast feedback loop.

You write some code, save the file, test the endpoint, make a change, and test it again.

You do not want to manually stop the application, build the project, start Node.js, and repeat that process every time you change one line.

NestJS provides a development workflow that can watch your source files for changes.

A common command is:

\`npm run start:dev\`

The exact script is defined in your project's \`package.json\`.

When you run it, the development tooling watches your source files.

When you change a file, the application can rebuild or restart so that your changes become available.

For example, suppose you have:

\`src/users/users.controller.ts\`

and you change the response from:

\`"Hello users"\`

to:

\`"Hello everyone"\`.

With a development watch command running, the application can detect the change and restart or rebuild automatically.

Then you can make another request without manually restarting the server.

This is called a <b>watch mode</b> workflow.

You will often see output in your terminal showing that the application has started and which routes have been mapped.

For example, NestJS may show information about routes such as:

\`GET /users\`

or:

\`GET /users/:id\`.

That output is useful because it gives you immediate feedback that your application has loaded those controllers and routes.

You should also understand that the development server is not the same thing as the production application.

Development mode is designed to make coding easier.

It may watch files, rebuild code, provide detailed logs, and restart the application when files change.

Production is normally run from built output and is configured differently depending on the deployment environment.

A simple development workflow looks like this:

<b>Open terminal → start development server → edit source code → save → application rebuilds/restarts → test request.</b>

This loop is something you will use constantly when building NestJS applications.

Learning how this workflow works will save you a lot of confusion later.

If you change a file and your browser or API client does not show the change, first check whether the development server is running and whether the terminal reports a compilation error.`,
      diagram: `Developer
   |
   | edits
   v
src/*.ts
   |
   | save
   v
Watch mode
   |
   +--> detect change
   |
   +--> rebuild
   |
   +--> restart
   |
   v
NestJS server
   |
   v
Test API request
   |
   +------------------+
                      |
                      | change code again
                      v
                  Repeat loop`,
      codeExample: {
        title: "Start the NestJS development server",
        code: `# Start in normal development mode
npm run start

# Start with watch mode
npm run start:dev

# Build the application
npm run build

# Start the built application
npm run start:prod`,
      },
      keyTakeaways: [
        "The development server gives you a fast feedback loop while building your application.",
        "`npm run start:dev` commonly starts NestJS in watch mode.",
        "Watch mode detects source changes and rebuilds or restarts the application.",
        "The terminal output can help you identify compilation errors and mapped routes.",
        "Development mode is designed for coding convenience.",
        "Production mode normally runs the built application rather than the development watcher.",
      ],
      commonMistakes: [
        "<b>Thinking the development server permanently changes your source files.</b> It watches and rebuilds your project; your source files remain the files you edit.",
        "<b>Ignoring terminal errors.</b> If TypeScript compilation fails, the development server may not be able to run your latest code.",
        "<b>Confusing development mode with production mode.</b> Development mode prioritizes fast feedback, while production execution is normally based on built output.",
        "<b>Assuming every change is automatically saved.</b> The watcher reacts after your editor writes the file to disk.",
      ],
      quiz: [
        {
          question: "What is `npm run start:dev` commonly used for?",
          options: [
            "Starting the NestJS development server with watch behavior",
            "Deleting the project",
            "Creating a database",
            "Deploying to production",
          ],
          correctIndex: 0,
          explanation: "The `start:dev` script commonly runs NestJS in development watch mode.",
        },
        {
          question: "What happens when watch mode detects a source change?",
          options: [
            "The project is permanently deleted",
            "The application can rebuild or restart so the change is available",
            "The database is automatically replaced",
            "The computer shuts down",
          ],
          correctIndex: 1,
          explanation: "Watch mode detects source changes and rebuilds or restarts the development application.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the Nest CLI?",
      options: [
        "A database",
        "A command-line tool for creating and managing NestJS projects",
        "A browser",
        "A frontend framework",
      ],
      correctIndex: 1,
      explanation: "The Nest CLI is a command-line tool that helps developers create projects, generate files, and perform common NestJS development tasks.",
    },
    {
      question: "Which file is normally the entry point of a NestJS application?",
      options: [
        "`main.ts`",
        "`package.json`",
        "`README.md`",
        "`users.service.ts`",
      ],
      correctIndex: 0,
      explanation: "`main.ts` normally starts the NestJS application by creating the application and calling `listen()`.",
    },
    {
      question: "What does `NestFactory.create(AppModule)` do?",
      options: [
        "Creates the NestJS application using AppModule",
        "Creates a database table",
        "Generates a controller",
        "Starts the frontend",
      ],
      correctIndex: 0,
      explanation: "NestFactory creates the NestJS application and uses AppModule as its root module.",
    },
    {
      question: "What does `app.listen(3000)` do?",
      options: [
        "Creates a service",
        "Starts listening for HTTP requests on port 3000",
        "Generates a module",
        "Compiles TypeScript",
      ],
      correctIndex: 1,
      explanation: "It starts the HTTP server and makes it listen on port 3000.",
    },
    {
      question: "What is `AppModule` usually responsible for?",
      options: [
        "Acting as the root of the application's module structure",
        "Storing every database record",
        "Handling every HTTP request itself",
        "Replacing Node.js",
      ],
      correctIndex: 0,
      explanation: "AppModule is normally the root module that connects the application's feature modules.",
    },
    {
      question: "What belongs in the `imports` array of a NestJS module?",
      options: [
        "Other NestJS modules",
        "HTTP responses",
        "Database rows",
        "Only strings",
      ],
      correctIndex: 0,
      explanation: "The `imports` array connects other NestJS modules to the current module.",
    },
    {
      question: "What is a controller mainly responsible for?",
      options: [
        "Handling HTTP requests",
        "Compiling TypeScript",
        "Installing packages",
        "Managing Git branches",
      ],
      correctIndex: 0,
      explanation: "Controllers are the HTTP entry points of NestJS features.",
    },
    {
      question: "What is a service commonly responsible for?",
      options: [
        "Reusable application logic",
        "Creating CSS files",
        "Starting the operating system",
        "Managing browser tabs",
      ],
      correctIndex: 0,
      explanation: "Services commonly contain reusable application logic and are managed as providers.",
    },
    {
      question: "What does a NestJS generator do?",
      options: [
        "Creates common application building blocks",
        "Automatically writes all business logic",
        "Creates production users",
        "Deploys the application automatically",
      ],
      correctIndex: 0,
      explanation: "Generators create common NestJS files and structures such as controllers, services, and modules.",
    },
    {
      question: "What is the shorter version of `nest generate service users`?",
      options: [
        "`nest s users`",
        "`nest g service users`",
        "`nest make users`",
        "`nest service users`",
      ],
      correctIndex: 1,
      explanation: "`nest g` is a common shorthand for `nest generate`.",
    },
    {
      question: "Where does NestJS build output commonly go?",
      options: [
        "`dist`",
        "`src`",
        "`node_modules`",
        "`public`",
      ],
      correctIndex: 0,
      explanation: "NestJS projects commonly place generated build output in the `dist` directory.",
    },
    {
      question: "Which directory normally contains the source TypeScript files?",
      options: [
        "`src`",
        "`dist`",
        "`node_modules`",
        "`build-cache`",
      ],
      correctIndex: 0,
      explanation: "The `src` directory commonly contains the application's TypeScript source code.",
    },
    {
      question: "Why should you normally avoid editing files inside `dist`?",
      options: [
        "They are generated build output",
        "They are database files",
        "They cannot contain JavaScript",
        "They are frontend files",
      ],
      correctIndex: 0,
      explanation: "The `dist` directory contains generated output. Changes should normally be made in the source files and then rebuilt.",
    },
    {
      question: "What is `npm run start:dev` commonly used for?",
      options: [
        "Starting the development server with watch behavior",
        "Deleting the application",
        "Creating database tables",
        "Deploying to production",
      ],
      correctIndex: 0,
      explanation: "`start:dev` commonly runs the NestJS application in development watch mode.",
    },
    {
      question: "What is the typical development workflow?",
      options: [
        "Edit source → save → rebuild/restart → test",
        "Edit database → delete source → deploy",
        "Build → uninstall Node.js → test",
        "Create frontend → remove backend → run",
      ],
      correctIndex: 0,
      explanation: "Development watch mode provides a loop where source changes are detected, the application is rebuilt or restarted, and you can test the result.",
    },
  ],

  project: {
    name: "Explore and build a NestJS project structure",
    goal: "Create a small NestJS users API while understanding exactly what each important project file does and how the development workflow works.",
    brief: "Start with a NestJS project, inspect the files created by the Nest CLI, understand how `main.ts` starts the application, understand how `AppModule` connects feature modules, generate a Users feature using the CLI, and run the project in development and production-style build modes.",
    steps: [
      "Create a new NestJS project using the Nest CLI.",
      "Open the generated project and inspect the `src` directory.",
      "Open `src/main.ts` and identify `NestFactory.create()`.",
      "Identify the `bootstrap()` function in `main.ts`.",
      "Identify the `app.listen()` call and understand what port the application uses.",
      "Open `src/app.module.ts` and identify the `AppModule` class.",
      "Read the `@Module()` decorator and identify its `imports`, `controllers`, and `providers` properties.",
      "Open the generated `app.controller.ts` and identify the controller decorator.",
      "Open the generated `app.service.ts` and identify the `@Injectable()` decorator.",
      "Start the application with the normal development command.",
      "Open the application's default route and confirm that the application responds.",
      "Stop the application.",
      "Start the application using `npm run start:dev`.",
      "Change the response returned by the default controller.",
      "Save the file and observe the development server detect the change.",
      "Generate a `UsersModule` using the Nest CLI.",
      "Generate a `UsersController` using the Nest CLI.",
      "Generate a `UsersService` using the Nest CLI.",
      "Inspect every generated file before changing it.",
      "Add a `GET /users` endpoint to the users controller.",
      "Add a `findAll()` method to the users service.",
      "Return an in-memory list of at least three users from the service.",
      "Inject `UsersService` into `UsersController` through the constructor.",
      "Make the controller call `usersService.findAll()`.",
      "Confirm that `UsersModule` is connected to `AppModule`.",
      "Test `GET /users` while the development server is running.",
      "Run `npm run build` and inspect the generated `dist` directory.",
      "Find the compiled version of `main.ts` inside the build output.",
      "Do not edit the generated `dist` files.",
      "Start the built application using the production start command.",
      "Confirm that the `/users` endpoint still works.",
      "Stop the server.",
      "Write down the complete application startup flow in your own words.",
    ],
    acceptance: [
      "A NestJS project was created using the Nest CLI.",
      "The project contains a `src` directory with the application's source code.",
      "`main.ts` is used as the application entry point.",
      "`main.ts` creates the application using `NestFactory.create()`.",
      "`main.ts` starts the server using `app.listen()`.",
      "`AppModule` exists as the root module.",
      "A `UsersModule` exists.",
      "A `UsersController` exists.",
      "A `UsersService` exists.",
      "`UsersService` uses `@Injectable()`.",
      "`UsersController` uses `@Controller()`.",
      "`UsersService` is injected into `UsersController`.",
      "`GET /users` returns a list of users.",
      "The application can run in development watch mode.",
      "The application can be built successfully.",
      "The `dist` directory contains generated build output.",
      "The built application can be started successfully.",
      "The learner can explain the difference between `src` and `dist`.",
      "The learner can explain the difference between `main.ts` and `app.module.ts`.",
      "The learner can explain the difference between a controller and a service.",
      "The learner can explain what the Nest CLI and generators are used for.",
    ],
    stretch: [
      "Generate a second `OrdersModule`, `OrdersController`, and `OrdersService` using the CLI.",
      "Add a `GET /orders` endpoint.",
      "Create a separate feature folder for orders and keep its files together.",
      "Add a route parameter such as `GET /users/:id`.",
      "Add a `POST /users` endpoint using `@Body()`.",
      "Build the application and inspect how TypeScript source files map to generated JavaScript files.",
      "Change the application's global port in `main.ts` and test the new port.",
      "Add a global prefix such as `/api` in `main.ts` and observe how the URL changes.",
      "Experiment with the development server by intentionally introducing a TypeScript error and reading the terminal output.",
      "Fix the error and observe the development server recover.",
      "Explain why editing `src` is different from editing `dist`.",
      "Explain the complete startup process from running `npm run start:dev` to receiving a request at `GET /users`.",
    ],
  },
};
