import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_9_LESSONS: LessonDay = {
  day: 9,
  title: "Providers & Services",
  totalMinutes: 118,
  difficulty: "Beginner",
  lessons: [
    {
      id: "providers",
      title: "What are Providers?",
      durationMinutes: 16,
      explanation: `A <b>provider</b> is a class, value, factory, or other object that NestJS can create and make available to other parts of your application.

That sounds more complicated than it really is.

A simple way to think about a provider is:

<b>"This is something that another class can ask NestJS for."</b>

For example, suppose your application has a \`UsersController\`.

The controller needs to work with users.

Instead of putting all of the user-related logic directly inside the controller, you can create a \`UsersService\`.

The service becomes a provider.

Then the controller can ask NestJS for the \`UsersService\`.

This gives you a clean separation:

<b>Controller → Provider/Service → Data or other logic</b>

Providers are not limited to services.

NestJS can use providers for many different things.

For example:

- services
- repositories
- helper classes
- factories
- configuration values
- database connections
- external clients
- objects created by factory functions
- mock implementations for testing

So remember this important idea:

<b>A service is a common kind of provider, but not every provider has to be a service.</b>

When you create a normal service with the Nest CLI, you will usually see code like this:

\`@Injectable()\`

\`export class UsersService {}\`

The \`@Injectable()\` decorator tells Nest that this class can participate in Nest's dependency injection system.

However, the decorator by itself does not magically make the service available everywhere.

The provider also needs to be registered in a module.

For example:

\`@Module({ providers: [UsersService] })\`

The \`providers\` array tells Nest:

"Here are the providers that belong to this module."

Once the provider is registered, another class can request it as a dependency.

This is where dependency injection becomes useful.

Instead of a controller doing this:

\`const service = new UsersService();\`

the controller can say:

\`constructor(private readonly usersService: UsersService) {}\`

NestJS sees that the controller needs a \`UsersService\`.

Nest then creates or retrieves the appropriate provider and gives it to the controller.

This means your application code does not need to manually create every object it depends on.

As your application becomes larger, this becomes extremely useful because classes often depend on other classes.

For example:

\`UsersController\`

might depend on:

\`UsersService\`

which might depend on:

\`UsersRepository\`

which might depend on:

\`DatabaseConnection\`

NestJS can manage this dependency chain for you.

That is one of the main reasons providers are such an important part of NestJS architecture.`,
      diagram: `                 NestJS Application

                       |
                       v
                +-------------+
                |  Controller |
                +-------------+
                       |
                       | needs
                       v
                +-------------+
                |   Service   |
                |  Provider   |
                +-------------+
                       |
                       | needs
                       v
                +-------------+
                | Repository  |
                |  Provider   |
                +-------------+
                       |
                       | needs
                       v
                +-------------+
                |  Database   |
                |  Provider   |
                +-------------+


The important idea:

A class does not have to create
everything it needs itself.

NestJS can create and connect
the dependencies for the class.`,
      codeExample: {
        title: "A simple provider",
        code: `import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  findAll() {
    return [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
  }
}

// app.module.ts

import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";

@Module({
  providers: [UsersService],
})
export class AppModule {}`,
      },
      keyTakeaways: [
        "A provider is something NestJS can create and inject into other classes.",
        "Services are one of the most common types of providers.",
        "Providers can also be repositories, helpers, factories, configuration values, or other objects.",
        "`@Injectable()` allows a class to participate in Nest's dependency injection system.",
        "Providers are registered in a module's `providers` array.",
        "A provider does not have to be manually created with `new` when NestJS is managing it.",
      ],
      commonMistakes: [
        "<b>Thinking providers and services are exactly the same thing.</b> A service is a common type of provider, but NestJS providers can represent many other things.",
        "<b>Adding `@Injectable()` and forgetting module registration.</b> The provider still needs to be available through a module.",
        "<b>Creating services manually everywhere.</b> Let NestJS manage providers when they are part of the dependency injection system.",
        "<b>Putting every piece of application logic inside controllers.</b> Providers are designed to hold reusable application logic and dependencies.",
      ],
      quiz: [
        {
          question: "What is a provider in NestJS?",
          options: [
            "Something NestJS can make available as a dependency",
            "Only a database table",
            "Only an HTTP route",
            "A TypeScript compiler setting",
          ],
          correctIndex: 0,
          explanation: "Providers are objects or classes that NestJS can manage and inject into other classes.",
        },
        {
          question: "Which is a common type of provider?",
          options: [
            "Service",
            "URL",
            "HTTP status",
            "TypeScript interface only",
          ],
          correctIndex: 0,
          explanation: "Services are one of the most common provider types in NestJS.",
        },
        {
          question: "Where are providers normally registered?",
          options: [
            "Inside a module's `providers` array",
            "Inside `package.json`",
            "Inside `main.ts` only",
            "Inside the browser",
          ],
          correctIndex: 0,
          explanation: "Providers are registered through the module's `providers` metadata.",
        },
      ],
    },

    {
      id: "services",
      title: "Services and why controllers should use them",
      durationMinutes: 16,
      explanation: `A <b>service</b> is usually where you put application logic that should not live directly inside a controller.

For example, imagine your API has:

\`GET /users\`

The controller receives the HTTP request.

But the controller does not need to know how users are stored.

It can ask the service:

\`usersService.findAll()\`

The service can then handle the work.

This gives you a simple division of responsibilities.

The controller handles HTTP-related work.

The service handles application-related work.

For example:

<b>Controller</b>

- receives the request
- reads parameters
- reads the request body
- calls the service
- returns the result

<b>Service</b>

- performs application logic
- works with repositories
- communicates with other providers
- prepares or processes data
- performs operations required by the feature

This does not mean every service must follow exactly the same pattern.

The important idea is to avoid turning controllers into giant classes that know everything about the application.

Imagine a controller that contains:

- database queries
- password logic
- email sending
- payment processing
- validation rules
- file processing
- business rules

It becomes difficult to understand and difficult to test.

Instead, you can split those responsibilities into providers.

For example:

\`UsersController\`

uses:

\`UsersService\`

The \`UsersService\` might use:

\`UsersRepository\`

The \`UsersService\` might also use:

\`EmailService\`

Now each class has a clearer job.

Another important benefit is reuse.

Suppose two different controllers need the same user logic.

If the logic is inside \`UsersService\`, both controllers can depend on the same provider.

You do not need to copy and paste the logic into both controllers.

This is one of the reasons NestJS applications often have files such as:

\`users.controller.ts\`

\`users.service.ts\`

\`users.module.ts\`

The controller handles the HTTP side.

The service handles the application logic.

The module connects those pieces together.

As you continue learning NestJS, you will see this pattern repeatedly.

It is not a rule that every piece of code must be inside a service.

Instead, think of services as a natural place for reusable application logic that needs to be provided to other classes.`,
      diagram: `HTTP Request
     |
     v
+------------------+
| UsersController  |
+------------------+
     |
     | "I need to find users"
     v
+------------------+
|   UsersService   |
+------------------+
     |
     | "I need the data"
     v
+------------------+
| UsersRepository  |
+------------------+
     |
     v
+------------------+
|    Database      |
+------------------+


Controller = HTTP work
Service    = Application work
Repository = Data access`,
      codeExample: {
        title: "Controller using a service",
        code: `// users.service.ts

import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  findAll() {
    return [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
  }

  findOne(id: number) {
    return {
      id,
      name: "Alice",
    };
  }
}


// users.controller.ts

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
    return this.usersService.findOne(Number(id));
  }
}`,
      },
      keyTakeaways: [
        "Services are commonly used for application logic.",
        "Controllers should focus on HTTP-related work.",
        "A controller can call a service instead of containing all the application logic itself.",
        "Services can use other providers.",
        "Sharing logic through services helps avoid duplication.",
        "The service is injected into the controller instead of being manually created.",
      ],
      commonMistakes: [
        "<b>Putting database queries directly in every controller method.</b> A service or repository is usually a better place for that logic.",
        "<b>Making one giant service that does everything.</b> Services should still have focused responsibilities.",
        "<b>Copying the same business logic into multiple controllers.</b> Move reusable logic into an appropriate provider.",
        "<b>Using `new UsersService()` inside the controller.</b> If Nest manages the service, let dependency injection provide it.",
      ],
      quiz: [
        {
          question: "What is a common responsibility of a service?",
          options: [
            "Application logic",
            "Defining HTML",
            "Managing CSS",
            "Starting the operating system",
          ],
          correctIndex: 0,
          explanation: "Services commonly contain reusable application logic.",
        },
        {
          question: "Why should controllers delegate complex work to services?",
          options: [
            "To keep HTTP handling separate from application logic",
            "Because controllers cannot return values",
            "Because services are required by TypeScript",
            "To disable dependency injection",
          ],
          correctIndex: 0,
          explanation: "Separating responsibilities keeps controllers easier to understand and maintain.",
        },
        {
          question: "How can two controllers reuse the same user logic?",
          options: [
            "Both can depend on `UsersService`",
            "Copy the code into both controllers",
            "Put the logic in `package.json`",
            "Use a different HTTP method",
          ],
          correctIndex: 0,
          explanation: "A shared service can be injected into multiple classes that need it.",
        },
      ],
    },

    {
      id: "dependency-injection",
      title: "Dependency Injection",
      durationMinutes: 17,
      explanation: `Now we can talk about one of the most important NestJS ideas: <b>Dependency Injection</b>, usually called DI.

The name sounds complicated, but the basic idea is simple.

Suppose a class needs another class.

For example:

\`UsersController\`

needs:

\`UsersService\`

That means \`UsersService\` is a <b>dependency</b> of \`UsersController\`.

One way to create the dependency manually would be:

\`const usersService = new UsersService();\`

But NestJS encourages you to let the Nest container create and provide that dependency.

You tell Nest:

"My controller needs a UsersService."

Nest then finds the provider registered for \`UsersService\` and gives an instance to the controller.

That is dependency injection.

So instead of this:

\`class UsersController {\`

\`  private usersService = new UsersService();\`

\`}\`

you can write:

\`class UsersController {\`

\`  constructor(private readonly usersService: UsersService) {}\`

\`}\`

The controller says what it needs.

NestJS handles the creation and connection.

This is sometimes described as <b>Inversion of Control</b>.

Without dependency injection, your class is responsible for creating its dependencies.

With dependency injection, the framework manages those dependencies for you.

Imagine a restaurant.

A chef needs ingredients.

The chef could go outside every time and personally find and purchase every ingredient.

Or someone else can prepare the ingredients and give them to the chef.

Dependency injection is similar.

The class says:

"I need a UsersService."

Nest says:

"Here is the UsersService."

The class does not need to know how the service was created.

This becomes especially useful when dependencies themselves have dependencies.

Imagine this:

\`UsersController\`

needs:

\`UsersService\`

which needs:

\`UsersRepository\`

which needs:

\`DatabaseConnection\`

You could manually create all of those objects:

\`new DatabaseConnection()\`

then:

\`new UsersRepository(database)\`

then:

\`new UsersService(repository)\`

then:

\`new UsersController(service)\`

That becomes difficult to manage as the application grows.

NestJS can resolve this dependency graph for you.

The important word here is <b>dependency graph</b>.

Nest looks at which providers depend on which other providers and resolves them.

This is one of the reasons providers need to be registered correctly.

If Nest does not know how to provide a dependency, the application can fail during startup with a dependency-resolution error.

Dependency injection also makes testing easier.

For example, suppose \`UsersService\` normally uses a real database repository.

During a test, you may want to give it a fake repository instead.

Because the service depends on an abstraction/token rather than manually constructing everything itself, you can replace the dependency.

You will learn exactly how to do that with custom providers later in this lesson.`,
      diagram: `Without Dependency Injection

Controller
   |
   | creates
   v
new UsersService()
   |
   | creates
   v
new UsersRepository()
   |
   | creates
   v
new DatabaseConnection()


The controller becomes responsible
for creating the entire dependency tree.



With Dependency Injection

Controller
   |
   | says:
   | "I need UsersService"
   v
NestJS DI Container
   |
   +----> UsersService
   |          |
   |          +----> UsersRepository
   |                    |
   |                    +----> DatabaseConnection
   |
   v
Controller receives ready dependency`,
      codeExample: {
        title: "Dependency injection in a controller",
        code: `import { Controller, Get } from "@nestjs/common";
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

// You do NOT need:
//
// const usersService = new UsersService();
//
// NestJS creates/provides the dependency
// because UsersService is registered as a provider.`,
      },
      keyTakeaways: [
        "A dependency is something a class needs in order to do its job.",
        "Dependency Injection means NestJS provides those dependencies instead of the class creating them itself.",
        "NestJS has an IoC container that manages providers and their relationships.",
        "Constructor injection is the most common DI pattern in NestJS.",
        "Dependency injection becomes especially useful when dependencies have their own dependencies.",
        "DI makes replacing dependencies easier during testing.",
      ],
      commonMistakes: [
        "<b>Thinking DI means copying code into a class.</b> DI is about providing an object or value that the class depends on.",
        "<b>Manually using `new` for Nest-managed providers.</b> This bypasses Nest's dependency injection system.",
        "<b>Forgetting to register a provider.</b> Nest needs to know how to resolve the dependency.",
        "<b>Thinking the controller creates the service.</b> With DI, the controller declares what it needs and Nest provides it.",
      ],
      quiz: [
        {
          question: "What is a dependency?",
          options: [
            "Something a class needs to do its job",
            "A URL path",
            "An HTTP status code",
            "A TypeScript file extension",
          ],
          correctIndex: 0,
          explanation: "A dependency is something another class needs in order to perform its work.",
        },
        {
          question: "What does dependency injection do?",
          options: [
            "Provides dependencies to a class",
            "Creates HTTP routes automatically",
            "Compiles JavaScript",
            "Creates database tables",
          ],
          correctIndex: 0,
          explanation: "DI allows NestJS to provide the objects or values that a class depends on.",
        },
        {
          question: "What does the NestJS IoC container help manage?",
          options: [
            "Providers and their dependencies",
            "Git branches",
            "CSS styles",
            "Browser tabs",
          ],
          correctIndex: 0,
          explanation: "The Nest container manages provider registration and dependency resolution.",
        },
      ],
    },

    {
      id: "constructor-injection",
      title: "Constructor injection",
      durationMinutes: 15,
      explanation: `The most common way to use dependency injection in NestJS is <b>constructor injection</b>.

The idea is straightforward.

If a class needs another provider, you put that dependency in the class constructor.

For example:

\`constructor(private readonly usersService: UsersService) {}\`

When Nest creates the controller, it sees that the constructor needs \`UsersService\`.

Nest looks for the provider associated with that dependency.

If it finds it, Nest provides it to the controller.

The \`private readonly\` part is TypeScript syntax.

It means the constructor parameter is automatically stored as a private property on the class and cannot be reassigned.

So:

\`constructor(private readonly usersService: UsersService) {}\`

is a convenient way of doing something similar to:

\`private readonly usersService: UsersService;\`

and then:

\`constructor(usersService: UsersService) {\`

\`  this.usersService = usersService;\`

\`}\`

You will normally see the shorter version in NestJS projects.

Constructor injection also makes dependencies easy to see.

If you open a class and see:

\`constructor(\`

\`  private readonly usersService: UsersService,\`

\`  private readonly emailService: EmailService,\`

\`)\`

you immediately know:

"This class needs UsersService and EmailService."

That makes the class easier to understand.

A class can have multiple dependencies.

For example, a registration service might need:

\`UsersRepository\`

\`EmailService\`

\`PasswordHasher\`

The constructor can receive all three.

Nest will resolve them as long as the providers are available.

However, if a constructor starts receiving a very large number of dependencies, that can be a sign that the class has too many responsibilities.

You do not need to worry about that as a beginner, but it is a useful design signal to remember.

Another important detail is that the type used for automatic constructor injection needs to exist at runtime.

A normal class works because JavaScript has the class at runtime.

A TypeScript interface does not exist at runtime after compilation.

That means this will not work as a normal automatically inferred DI dependency:

\`constructor(private config: AppConfig) {}\`

if \`AppConfig\` is only an interface.

For interfaces or other non-class tokens, you use an explicit provider token and \`@Inject()\`.

You will see that in the provider-token lesson.`,
      diagram: `NestJS creates UsersController
             |
             v
       Read constructor
             |
             v
"UsersController needs
 UsersService"
             |
             v
     Find provider token
             |
             v
      UsersService
             |
             v
   Inject into constructor
             |
             v
     UsersController
             |
             v
       findAll()`,
      codeExample: {
        title: "Constructor injection",
        code: `import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  findAll() {
    return ["Alice", "Bob"];
  }
}


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
}`,
      },
      keyTakeaways: [
        "Constructor injection is the standard way to inject providers into a class.",
        "Put the required provider in the constructor.",
        "NestJS resolves the provider and passes it into the constructor.",
        "`private readonly` is a convenient TypeScript way to store the dependency as a class property.",
        "The constructor makes a class's dependencies easy to see.",
        "Automatically inferred DI dependencies need runtime-visible tokens such as classes.",
        "Interfaces are erased at runtime and need explicit tokens when used for DI.",
      ],
      commonMistakes: [
        "<b>Writing `new UsersService()` inside the controller.</b> Let NestJS inject the service instead.",
        "<b>Forgetting to import the provider.</b> The constructor needs the actual provider type or token.",
        "<b>Trying to inject a TypeScript interface directly.</b> Interfaces do not exist at runtime, so use an explicit token.",
        "<b>Creating a constructor with dozens of dependencies.</b> A very large dependency list can indicate that a class has too many responsibilities.",
      ],
      quiz: [
        {
          question: "Where is constructor injection declared?",
          options: [
            "In the class constructor",
            "Inside `package.json`",
            "Inside a controller route",
            "Inside a database query",
          ],
          correctIndex: 0,
          explanation: "Dependencies are commonly declared as constructor parameters.",
        },
        {
          question: "What does `private readonly usersService: UsersService` do?",
          options: [
            "Stores the injected service as a private readonly property",
            "Creates a database",
            "Creates an HTTP route",
            "Turns the service into a controller",
          ],
          correctIndex: 0,
          explanation: "TypeScript parameter properties allow the injected dependency to be stored directly on the class.",
        },
        {
          question: "Why can't an interface normally be used as an automatically inferred DI token?",
          options: [
            "Interfaces are erased at runtime",
            "Interfaces cannot contain methods",
            "Interfaces only work in controllers",
            "Interfaces are database objects",
          ],
          correctIndex: 0,
          explanation: "Nest resolves dependencies using runtime information, while TypeScript interfaces disappear after compilation.",
        },
      ],
    },

    {
      id: "provider-tokens",
      title: "Provider tokens",
      durationMinutes: 16,
      explanation: `To understand custom providers, you need to understand <b>provider tokens</b>.

A token is the identifier NestJS uses when it needs to find a provider.

With a normal class-based provider, the class itself is commonly used as the token.

For example:

\`providers: [UsersService]\`

is shorthand for registering the class as the provider associated with the \`UsersService\` token.

When a controller says:

\`constructor(private readonly usersService: UsersService) {}\`

Nest can use the \`UsersService\` class as the token it needs to resolve.

So you can think of it like this:

<b>Token → Provider</b>

For the normal case:

<b>UsersService → UsersService class</b>

This is convenient.

But sometimes you do not want the token to be a class.

Maybe you want to inject:

- a configuration object
- a database connection
- an external library instance
- a simple string
- an object created somewhere else
- an implementation selected at runtime

In these situations, NestJS supports custom tokens.

A token can be a string.

For example:

\`provide: "APP_CONFIG"\`

You can then inject that token with:

\`@Inject("APP_CONFIG")\`

You can also use a JavaScript \`Symbol\` as a token.

Symbols are useful because each symbol has a unique identity.

For example:

\`export const DATABASE_CONNECTION = Symbol("DATABASE_CONNECTION");\`

Then you can register:

\`provide: DATABASE_CONNECTION\`

and inject:

\`@Inject(DATABASE_CONNECTION)\`

This avoids relying on a string that could accidentally be reused somewhere else.

Another important case is TypeScript interfaces.

Suppose you have:

\`interface Logger {\`

\`  log(message: string): void;\`

\`}\`

The interface describes what the logger should look like.

But the interface disappears when TypeScript is compiled to JavaScript.

NestJS cannot use that interface itself as a runtime lookup token.

Instead, you can create a runtime token:

\`const LOGGER = Symbol("LOGGER");\`

Then register an implementation under that token.

The consuming class can use:

\`@Inject(LOGGER)\`

This gives you an important separation:

<b>TypeScript type</b>

describes what the dependency should look like.

<b>DI token</b>

tells NestJS which provider to give you at runtime.

These are related, but they are not the same thing.

NestJS also supports abstract classes as runtime tokens because an abstract class exists at runtime.

For beginner code, the most important tokens to understand are:

- class tokens
- string tokens
- symbol tokens

You will use class tokens most of the time in normal NestJS services.

Custom tokens become especially useful when you want to swap implementations or inject values that are not normal service classes.`,
      diagram: `Provider registration:

        TOKEN
          |
          v
     +----------+
     | Provider |
     +----------+


Normal class provider:

UsersService
     |
     v
UsersService class


Custom value:

"APP_CONFIG"
     |
     v
{ port: 3000 }


Symbol token:

DATABASE_CONNECTION
     |
     v
database connection object


Injection:

constructor(
  @Inject(TOKEN)
  dependency
)

        |
        v

Nest looks up TOKEN
and provides its registered value.`,
      codeExample: {
        title: "A custom provider token",
        code: `// tokens.ts

export const APP_CONFIG = Symbol("APP_CONFIG");


// app.module.ts

import { Module } from "@nestjs/common";
import { APP_CONFIG } from "./tokens";

@Module({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        port: 3000,
        environment: "development",
      },
    },
  ],
})
export class AppModule {}


// some.service.ts

import { Inject, Injectable } from "@nestjs/common";
import { APP_CONFIG } from "./tokens";

@Injectable()
export class SomeService {
  constructor(
    @Inject(APP_CONFIG)
    private readonly config: {
      port: number;
      environment: string;
    },
  ) {}

  getPort() {
    return this.config.port;
  }
}`,
      },
      keyTakeaways: [
        "A provider token is the identifier NestJS uses to find a provider.",
        "A class is commonly used as the token for standard class providers.",
        "Custom providers can use strings or symbols as tokens.",
        "Use `@Inject()` when injecting a provider by a custom token.",
        "Interfaces cannot be used directly as runtime DI tokens because they are erased by TypeScript.",
        "Symbols provide unique runtime identities and can help avoid token collisions.",
        "Abstract classes can also act as runtime tokens.",
      ],
      commonMistakes: [
        "<b>Thinking a TypeScript interface is available at runtime.</b> Interfaces disappear after compilation.",
        "<b>Registering one token and injecting a different token.</b> The token used for registration must match the token used for injection.",
        "<b>Creating the same Symbol separately in different files.</b> A Symbol is unique, so export and reuse the same symbol instance.",
        "<b>Using strings everywhere without organization.</b> Shared constants or symbols make tokens easier to manage.",
      ],
      quiz: [
        {
          question: "What is a provider token?",
          options: [
            "An identifier Nest uses to find a provider",
            "An HTTP authentication token only",
            "A database password",
            "A route parameter",
          ],
          correctIndex: 0,
          explanation: "Nest uses provider tokens to identify which provider should be injected.",
        },
        {
          question: "Which can be used as a custom DI token?",
          options: [
            "A string or Symbol",
            "Only an HTML element",
            "Only a URL",
            "Only a JSON file",
          ],
          correctIndex: 0,
          explanation: "Nest supports string, Symbol, and other runtime values as provider tokens.",
        },
        {
          question: "Which decorator is commonly used to inject a custom token?",
          options: [
            "`@Inject()`",
            "`@Provide()`",
            "`@Token()`",
            "`@Dependency()`",
          ],
          correctIndex: 0,
          explanation: "`@Inject()` explicitly tells Nest which token should be injected.",
        },
      ],
    },

    {
      id: "custom-providers-usevalue-useclass",
      title: "Custom providers: useValue and useClass",
      durationMinutes: 16,
      explanation: `Custom providers become useful when the normal:

\`providers: [SomeService]\`

pattern is not enough.

NestJS provides several ways to define custom providers.

The first one is <b>useValue</b>.

\`useValue\` tells Nest:

"When someone asks for this token, give them this exact value."

That value can be an object, string, number, external library instance, or another already-created value.

For example:

\`{\`

\`  provide: "APP_CONFIG",\`

\`  useValue: { port: 3000 },\`

\`}\`

Now any class that injects \`"APP_CONFIG"\` receives that object.

This is also useful in testing.

Suppose your real service talks to an external payment system.

During a unit test, you may not want to contact the real payment system.

You can provide a fake object:

\`useValue: mockPaymentService\`

The code under test receives the fake implementation instead.

The second pattern is <b>useClass</b>.

\`useClass\` tells Nest which class should be created when a particular token is requested.

For example, imagine you have:

\`DevelopmentConfigService\`

and:

\`ProductionConfigService\`

You could choose the implementation based on the environment.

For example:

\`provide: ConfigService\`

\`useClass: DevelopmentConfigService\`

In another environment, you could provide:

\`ProductionConfigService\`

The code consuming \`ConfigService\` does not need to know which concrete class Nest selected.

This is a useful example of dependency inversion.

The consumer asks for the token it understands.

The module decides which implementation should be supplied.

There is an important difference between \`useValue\` and \`useClass\`.

<b>useValue</b> gives Nest an already-created value.

<b>useClass</b> tells Nest which class to instantiate.

Think of it this way:

\`useValue\`

"Here is the thing."

\`useClass\`

"Here is the class you should use to create the thing."

Both patterns are useful, but they solve different problems.

You do not need custom providers for every service.

For ordinary NestJS services, this is still the normal pattern:

\`providers: [UsersService]\`

Custom providers are for situations where you need more control over what a token resolves to.`,
      diagram: `                 Custom Providers

                     Token
                       |
             +---------+---------+
             |                   |
             v                   v
        useValue              useClass
             |                   |
             v                   v
      Already-created        Class Nest
           value              should create
             |                   |
             +---------+---------+
                       |
                       v
                 Injected value


useValue:
"Give me this object."


useClass:
"Create/provide an instance
of this class."`,
      codeExample: {
        title: "useValue and useClass",
        code: `// useValue

const APP_CONFIG = Symbol("APP_CONFIG");

@Module({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        environment: "development",
        port: 3000,
      },
    },
  ],
})
export class AppModule {}


// useClass

abstract class ConfigService {
  abstract getEnvironment(): string;
}

class DevelopmentConfigService extends ConfigService {
  getEnvironment() {
    return "development";
  }
}

class ProductionConfigService extends ConfigService {
  getEnvironment() {
    return "production";
  }
}

@Module({
  providers: [
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === "production"
          ? ProductionConfigService
          : DevelopmentConfigService,
    },
  ],
})
export class AppModule {}`,
      },
      keyTakeaways: [
        "`useValue` provides an already-created value.",
        "`useValue` is useful for configuration objects, external instances, and test mocks.",
        "`useClass` tells Nest which class should be instantiated for a token.",
        "`useClass` is useful when the implementation should change based on configuration or environment.",
        "The consuming class can depend on the token without needing to know the concrete implementation.",
        "Normal services still use the simpler `providers: [Service]` pattern most of the time.",
      ],
      commonMistakes: [
        "<b>Confusing `useValue` and `useClass`.</b> `useValue` provides a value; `useClass` tells Nest which class to instantiate.",
        "<b>Using custom providers when a normal service provider is enough.</b> Start with the simple pattern.",
        "<b>Changing the implementation but changing the consumer too.</b> The point of a token is that the consumer can remain independent of the concrete implementation.",
        "<b>Using a real external service during every unit test.</b> `useValue` can provide a mock implementation instead.",
      ],
      quiz: [
        {
          question: "What does `useValue` provide?",
          options: [
            "An already-created value",
            "A route",
            "A TypeScript interface",
            "An HTTP method",
          ],
          correctIndex: 0,
          explanation: "`useValue` associates a token with an existing value.",
        },
        {
          question: "What does `useClass` tell Nest?",
          options: [
            "Which class should be used for a provider token",
            "Which HTTP method to use",
            "Which database table to create",
            "Which route parameter to read",
          ],
          correctIndex: 0,
          explanation: "`useClass` specifies the class Nest should instantiate for the token.",
        },
        {
          question: "Which is useful for replacing a real dependency with a fake object in a test?",
          options: [
            "`useValue`",
            "`@Get()`",
            "`@Body()`",
            "`@Param()`",
          ],
          correctIndex: 0,
          explanation: "`useValue` can provide a mock object or implementation.",
        },
      ],
    },

    {
      id: "custom-providers-usefactory-useexisting",
      title: "Custom providers: useFactory and useExisting",
      durationMinutes: 16,
      explanation: `There are two more custom-provider patterns that are important to understand: <b>useFactory</b> and <b>useExisting</b>.

Let's start with \`useFactory\`.

A factory is simply a function that creates or calculates something.

With \`useFactory\`, Nest calls your factory function and uses the value returned by that function as the provider.

For example:

\`{\`

\`  provide: "APP_CONFIG",\`

\`  useFactory: () => ({\`

\`    port: 3000,\`

\`  }),\`

\`}\`

The factory runs and returns the configuration object.

This becomes more useful when creating the value requires another provider.

For example, imagine an \`EnvironmentService\` that knows the current environment.

Your factory can ask Nest to inject that service:

\`inject: [EnvironmentService]\`

Then Nest passes the dependency into the factory function.

The flow becomes:

<b>Nest → EnvironmentService → Factory → Created value</b>

The order matters.

The providers listed in \`inject\` are passed to the factory function in the corresponding order.

This allows factory providers to build values using other providers.

For example, a database connection might need configuration before it can be created.

The factory can receive a configuration provider and create the connection.

The next pattern is \`useExisting\`.

\`useExisting\` creates an alias for an existing provider.

Suppose you already have:

\`LoggerService\`

You can create another token:

\`"APP_LOGGER"\`

and make it point to the existing \`LoggerService\` provider.

The important word is <b>existing</b>.

Nest does not create a separate implementation just because you created an alias.

Both tokens can resolve to the same provider instance when the provider scope is the default singleton scope.

So you can think of \`useExisting\` as:

"Give this provider another name."

This is different from \`useClass\`.

With \`useClass\`, you tell Nest which class should be used.

With \`useExisting\`, you point one token at a provider that already exists.

Here is a simple comparison:

<b>useValue</b>

"Use this value."

<b>useClass</b>

"Use this class."

<b>useFactory</b>

"Call this function to create the value."

<b>useExisting</b>

"Use the provider that already exists under another token."

You do not need to use these patterns every day as a beginner.

But understanding them now will make NestJS modules, configuration, database integrations, testing, and third-party libraries much easier to understand later.`,
      diagram: `                    Custom Provider
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
      useValue         useClass       useFactory
          |               |               |
          v               v               v
    Existing value     Class        Factory function
                                          |
                                          | inject
                                          v
                                      Other provider


                         +----------------+
                         |
                         v
                    useExisting
                         |
                         v
                  Existing provider


useValue    -> "Use this value"
useClass    -> "Use this class"
useFactory  -> "Create it with this function"
useExisting -> "Alias an existing provider"`,
      codeExample: {
        title: "useFactory and useExisting",
        code: `// useFactory

const APP_CONFIG = Symbol("APP_CONFIG");

@Injectable()
export class EnvironmentService {
  getEnvironment() {
    return process.env.NODE_ENV ?? "development";
  }
}

@Module({
  providers: [
    EnvironmentService,
    {
      provide: APP_CONFIG,
      useFactory: (
        environmentService: EnvironmentService,
      ) => {
        const environment =
          environmentService.getEnvironment();

        return {
          environment,
          port:
            environment === "production"
              ? 3000
              : 3001,
        };
      },
      inject: [EnvironmentService],
    },
  ],
})
export class AppModule {}


// useExisting

@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(message);
  }
}

@Module({
  providers: [
    LoggerService,
    {
      provide: "APP_LOGGER",
      useExisting: LoggerService,
    },
  ],
})
export class AppModule {}

// LoggerService and "APP_LOGGER"
// point to the existing LoggerService provider.`,
      },
      keyTakeaways: [
        "`useFactory` creates a provider value by calling a factory function.",
        "A factory can receive dependencies through the `inject` array.",
        "The order of `inject` entries matches the factory function parameters.",
        "`useExisting` creates an alias for an existing provider.",
        "`useExisting` can allow two tokens to resolve to the same provider instance.",
        "`useClass` chooses a class, while `useExisting` reuses an already registered provider.",
        "Custom providers give NestJS more flexibility than simple class registration.",
      ],
      commonMistakes: [
        "<b>Forgetting `inject` when a factory needs another provider.</b> Nest needs to know which dependencies should be passed into the factory.",
        "<b>Changing the order between `inject` and factory parameters.</b> Nest passes dependencies according to the order in the `inject` array.",
        "<b>Thinking `useExisting` creates a new provider.</b> It creates another token pointing to an existing provider.",
        "<b>Confusing `useExisting` with `useClass`.</b> `useExisting` reuses an existing provider; `useClass` tells Nest which class to instantiate.",
      ],
      quiz: [
        {
          question: "What does `useFactory` do?",
          options: [
            "Creates a provider value using a factory function",
            "Creates an HTTP route",
            "Creates a controller",
            "Creates a database table automatically",
          ],
          correctIndex: 0,
          explanation: "`useFactory` uses a function to create the provider value.",
        },
        {
          question: "What does the `inject` array do in a factory provider?",
          options: [
            "Tells Nest which dependencies to pass to the factory",
            "Defines HTTP routes",
            "Defines database columns",
            "Creates TypeScript interfaces",
          ],
          correctIndex: 0,
          explanation: "The `inject` array tells Nest which providers should be resolved and passed into the factory.",
        },
        {
          question: "What does `useExisting` do?",
          options: [
            "Creates an alias for an existing provider",
            "Creates a new HTTP request",
            "Creates a new class automatically",
            "Deletes a provider",
          ],
          correctIndex: 0,
          explanation: "`useExisting` creates another token that points to an existing provider.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is a provider in NestJS?",
      options: [
        "Something NestJS can manage and inject as a dependency",
        "Only an HTTP route",
        "Only a database table",
        "A package manager",
      ],
      correctIndex: 0,
      explanation: "Providers are objects or classes that NestJS manages and can inject into other classes.",
    },
    {
      question: "Which is a common type of provider?",
      options: [
        "Service",
        "URL",
        "HTTP method",
        "HTML element",
      ],
      correctIndex: 0,
      explanation: "Services are one of the most common types of providers.",
    },
    {
      question: "Where are providers normally registered?",
      options: [
        "In a module's `providers` array",
        "In `package.json`",
        "In the browser",
        "In an HTML file",
      ],
      correctIndex: 0,
      explanation: "Nest providers are registered through module metadata.",
    },
    {
      question: "What does `@Injectable()` allow a class to do?",
      options: [
        "Participate in Nest's dependency injection system",
        "Automatically create a route",
        "Automatically create a database",
        "Replace TypeScript",
      ],
      correctIndex: 0,
      explanation: "`@Injectable()` marks a class as available for Nest's dependency injection system.",
    },
    {
      question: "What is a dependency?",
      options: [
        "Something a class needs to perform its work",
        "A URL parameter",
        "An HTTP status",
        "A database table name",
      ],
      correctIndex: 0,
      explanation: "A dependency is something another class needs in order to do its job.",
    },
    {
      question: "What does dependency injection allow NestJS to do?",
      options: [
        "Provide dependencies to classes",
        "Compile CSS",
        "Create Git commits",
        "Render HTML in the browser",
      ],
      correctIndex: 0,
      explanation: "Dependency injection allows NestJS to provide the objects or values a class depends on.",
    },
    {
      question: "What is the most common NestJS DI pattern?",
      options: [
        "Constructor injection",
        "URL injection",
        "HTML injection",
        "Database injection",
      ],
      correctIndex: 0,
      explanation: "NestJS commonly uses constructor-based dependency injection.",
    },
    {
      question: "Which is a normal constructor injection pattern?",
      options: [
        "`constructor(private readonly usersService: UsersService) {}`",
        "`constructor = UsersService()`",
        "`inject UsersService into package.json`",
        "`@Get(UsersService)`",
      ],
      correctIndex: 0,
      explanation: "The provider is declared as a constructor dependency and Nest resolves it.",
    },
    {
      question: "Why can a TypeScript interface not normally be used as an automatically inferred DI token?",
      options: [
        "Interfaces are erased at runtime",
        "Interfaces cannot have names",
        "Interfaces only work in controllers",
        "Interfaces are database objects",
      ],
      correctIndex: 0,
      explanation: "Nest needs runtime information to resolve a dependency, but TypeScript interfaces disappear after compilation.",
    },
    {
      question: "Which decorator can inject a custom provider token?",
      options: [
        "`@Inject()`",
        "`@Provider()`",
        "`@Token()`",
        "`@Dependency()`",
      ],
      correctIndex: 0,
      explanation: "`@Inject()` explicitly tells Nest which provider token should be used.",
    },
    {
      question: "Which can be used as a custom provider token?",
      options: [
        "A string or Symbol",
        "Only an HTML element",
        "Only a URL",
        "Only a database table",
      ],
      correctIndex: 0,
      explanation: "Nest supports strings, Symbols, classes, abstract classes, and other runtime tokens.",
    },
    {
      question: "What does `useValue` mean?",
      options: [
        "Use this already-created value",
        "Create this class",
        "Call this HTTP method",
        "Create this route",
      ],
      correctIndex: 0,
      explanation: "`useValue` associates a token with an existing value.",
    },
    {
      question: "What does `useClass` mean?",
      options: [
        "Use this class for the provider token",
        "Use this HTTP class",
        "Create a TypeScript interface",
        "Create a database",
      ],
      correctIndex: 0,
      explanation: "`useClass` tells Nest which class should be used to resolve a provider token.",
    },
    {
      question: "What does `useFactory` do?",
      options: [
        "Creates a provider value using a factory function",
        "Creates a controller route",
        "Creates a database table",
        "Creates an HTTP request",
      ],
      correctIndex: 0,
      explanation: "`useFactory` uses a function to create the provider value.",
    },
    {
      question: "What does the `inject` array in a factory provider describe?",
      options: [
        "Providers that should be passed into the factory",
        "HTTP routes",
        "Database columns",
        "Response headers",
      ],
      correctIndex: 0,
      explanation: "The `inject` array tells Nest which dependencies to resolve and pass to the factory function.",
    },
    {
      question: "What does `useExisting` do?",
      options: [
        "Creates an alias for an existing provider",
        "Creates a new controller",
        "Deletes a provider",
        "Creates a new database",
      ],
      correctIndex: 0,
      explanation: "`useExisting` creates another token that points to an existing provider.",
    },
    {
      question: "Which statement correctly compares `useValue` and `useClass`?",
      options: [
        "`useValue` provides a value, while `useClass` specifies a class",
        "They are always exactly the same",
        "`useValue` creates a route, while `useClass` creates a query",
        "`useClass` only works with controllers",
      ],
      correctIndex: 0,
      explanation: "`useValue` gives Nest an existing value, while `useClass` tells Nest which class to instantiate.",
    },
    {
      question: "What is a common responsibility of a service?",
      options: [
        "Application logic",
        "CSS styling",
        "Git management",
        "Browser rendering",
      ],
      correctIndex: 0,
      explanation: "Services commonly contain reusable application logic.",
    },
    {
      question: "Why should controllers delegate complex work to services?",
      options: [
        "To separate HTTP handling from application logic",
        "Because controllers cannot return data",
        "Because services replace TypeScript",
        "Because controllers cannot have methods",
      ],
      correctIndex: 0,
      explanation: "Separating responsibilities keeps controllers focused and makes application logic easier to reuse.",
    },
    {
      question: "Which is a good reason to use dependency injection?",
      options: [
        "It lets Nest manage and replace dependencies",
        "It removes the need for modules",
        "It automatically creates every database table",
        "It prevents classes from having methods",
      ],
      correctIndex: 0,
      explanation: "DI allows Nest to manage dependencies and makes implementations easier to replace and test.",
    },
  ],

  project: {
    name: "Build a Provider-Based Users Feature",
    goal: "Build a NestJS users feature that uses services, constructor injection, custom provider tokens, and multiple custom-provider patterns.",
    brief: "Create a small users application where the controller depends on a UsersService, the UsersService depends on other providers, and configuration or external dependencies are supplied through NestJS dependency injection.",
    steps: [
      "Create a `UsersModule` using the Nest CLI.",
      "Create a `UsersController` using the Nest CLI.",
      "Create a `UsersService` using the Nest CLI.",
      "Register `UsersService` in the module's `providers` array.",
      "Inject `UsersService` into `UsersController` using constructor injection.",
      "Create an in-memory users collection inside `UsersService`.",
      "Add methods such as `findAll()`, `findOne()`, `create()`, and `remove()`.",
      "Keep the controller responsible for HTTP concerns.",
      "Keep the user application logic inside the service.",
      "Create a separate `UsersRepository` provider.",
      "Inject `UsersRepository` into `UsersService` using constructor injection.",
      "Move the in-memory data access into the repository.",
      "Observe the dependency chain: Controller → UsersService → UsersRepository.",
      "Create a custom Symbol token called `APP_CONFIG`.",
      "Register an application configuration object using `useValue`.",
      "Inject `APP_CONFIG` into a provider using `@Inject()`.",
      "Use the injected configuration inside the application.",
      "Create an abstract `Logger` class or another runtime contract.",
      "Create a concrete logger implementation.",
      "Register the implementation using `useClass`.",
      "Inject the logger into `UsersService`.",
      "Create a factory provider using `useFactory`.",
      "Make the factory depend on another provider using the `inject` array.",
      "Return a small configuration or helper object from the factory.",
      "Inject the factory-created value into another provider.",
      "Create an alias using `useExisting`.",
      "Point the alias at an existing logger provider.",
      "Inject the alias into another provider.",
      "Add a simple mock provider using `useValue`.",
      "Use the mock provider to replace a real dependency during a test or development experiment.",
      "Start the application and verify that Nest can resolve the complete dependency graph.",
      "Intentionally remove one provider from the module and observe the dependency-resolution error.",
      "Restore the provider and confirm that the application starts again.",
      "Write down the dependency chain for your feature.",
    ],
    acceptance: [
      "A `UsersModule` exists.",
      "A `UsersController` exists.",
      "A `UsersService` exists.",
      "The service is registered as a provider.",
      "The controller receives `UsersService` through constructor injection.",
      "The controller does not manually create `UsersService` with `new`.",
      "A second provider such as `UsersRepository` is injected into `UsersService`.",
      "The dependency chain works from controller to service to repository.",
      "A custom Symbol token is registered.",
      "The Symbol token is injected with `@Inject()`.",
      "A `useValue` provider is demonstrated.",
      "A `useClass` provider is demonstrated.",
      "A `useFactory` provider is demonstrated.",
      "The factory provider uses the `inject` array when it needs another provider.",
      "A `useExisting` alias is demonstrated.",
      "The learner can explain the difference between `useValue`, `useClass`, `useFactory`, and `useExisting`.",
      "The learner understands that a service is a common type of provider.",
      "The learner understands that provider tokens identify dependencies at runtime.",
      "The learner understands why interfaces cannot normally be used directly as runtime DI tokens.",
      "The application starts successfully with all dependencies registered.",
    ],
    stretch: [
      "Create a `Logger` abstraction and provide different logger implementations for development and production.",
      "Use `useClass` to select the logger implementation based on `NODE_ENV`.",
      "Create a Symbol token for the logger instead of using a string token.",
      "Create a factory provider that builds a database configuration object.",
      "Make the factory provider depend on another configuration provider.",
      "Create a mock `UsersRepository` using `useValue`.",
      "Use the mock repository in a unit test for `UsersService`.",
      "Create an alias token with `useExisting` and verify that it points to the same provider.",
      "Export a custom provider from `UsersModule` and consume it from another module.",
      "Experiment with removing the provider from the module and read the Nest dependency-resolution error.",
      "Create a small dependency graph diagram for your application.",
      "Add a second service that depends on `UsersService` and observe how Nest resolves the dependency chain.",
      "Explore provider scopes after completing the beginner lessons.",
    ],
  },
};
