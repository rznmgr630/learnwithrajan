import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_11_LESSONS: LessonDay = {
  day: 11,
  title: "Dependency Injection",
  totalMinutes: 102,
  difficulty: "Beginner",
  lessons: [
    {
      id: "inversion-of-control",
      title: "IoC — Inversion of Control",
      durationMinutes: 17,
      explanation: `Dependency Injection becomes much easier to understand when you first understand <b>Inversion of Control (IoC)</b>.

The phrase sounds complicated, but the basic idea is simple.

Normally, a class can create the objects it needs by itself.

For example, imagine an order service needs a payment service:

\`\`\`ts
class OrderService {
  private paymentService = new PaymentService();

  createOrder() {
    this.paymentService.charge();
  }
}
\`\`\`

At first, this looks perfectly reasonable.

But now \`OrderService\` is responsible for creating its own \`PaymentService\`. That means the order service is tightly connected to one specific implementation.

If you later want to replace \`PaymentService\` with \`StripePaymentService\`, a fake payment service for testing, or another payment provider, you have to change the \`OrderService\` code.

This is where <b>Inversion of Control</b> comes in.

Instead of saying:

"OrderService, create the payment service yourself."

we say:

"OrderService, someone else will provide the payment service you need."

The responsibility for creating and supplying dependencies is moved outside the class.

That is the basic meaning of Inversion of Control.

In NestJS, the framework takes an important part in controlling this process. Nest keeps track of providers and creates them when they are needed.

You describe what your class needs:

\`\`\`ts
@Injectable()
export class OrderService {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}
}
\`\`\`

You do not write:

\`\`\`ts
new PaymentService()
\`\`\`

inside \`OrderService\`.

Nest sees that \`OrderService\` needs \`PaymentService\`, finds the provider, creates or retrieves it according to its provider configuration, and gives it to the constructor.

This is IoC.

The class focuses on its job. The framework takes responsibility for wiring the objects together.

<b>Real-world beginner example</b>

Think about a restaurant.

A chef needs ingredients to prepare a meal.

The chef should not have to:

- grow vegetables,
- raise chickens,
- build a farm,
- drive a truck,
- manufacture cooking oil.

The chef simply says:

"I need these ingredients."

Another part of the system is responsible for supplying them.

Dependency Injection works in a similar way.

Your service says:

"I need a UsersRepository."

Nest's dependency injection system is responsible for finding the appropriate provider and giving it to the service.

<b>Real-world intermediate example</b>

Imagine an e-commerce application has an \`OrderService\`.

It needs:

- a payment gateway,
- an email service,
- an order repository,
- a logger.

Without DI, the service might create all of these objects itself.

With DI:

\`\`\`text
                    NestJS
                 DI Container
                      |
       +--------------+--------------+
       |              |              |
       v              v              v
 PaymentGateway   EmailService   OrderRepository
       |              |              |
       +--------------+--------------+
                      |
                      v
                 OrderService
\`\`\`

The \`OrderService\` does not need to know how those dependencies are constructed.

<b>Real-world advanced example</b>

Imagine your company supports multiple payment providers.

You could have:

\`\`\`text
PaymentGateway
      |
      +---- StripePaymentGateway
      |
      +---- PayPalPaymentGateway
      |
      +---- MockPaymentGateway
\`\`\`

Your business service should depend on the concept of a payment gateway rather than hard-coding one concrete implementation.

NestJS provider configuration allows you to decide which implementation should be injected.

This becomes particularly useful for:

- testing,
- feature flags,
- different environments,
- multiple third-party integrations,
- replacing infrastructure,
- gradual migrations,
- multi-tenant applications.

The important idea is that <b>IoC is the principle</b>, while <b>Dependency Injection is one practical way of implementing that principle</b>.`,
      diagram: `WITHOUT IoC

OrderService
    |
    +--> new PaymentService()
    |
    +--> new EmailService()
    |
    +--> new OrderRepository()

OrderService controls object creation.


WITH IoC + Dependency Injection

             NestJS
          DI Container
               |
      +--------+--------+
      |        |        |
      v        v        v
   Payment   Email    Repository
   Service   Service
      |        |        |
      +--------+--------+
               |
               v
          OrderService

Nest controls dependency creation
and supplies the dependencies.`,
      codeExample: {
        title: "From manual creation to Dependency Injection",
        code: `// Tightly coupled approach

export class OrderService {
  private readonly paymentService = new PaymentService();

  createOrder() {
    return this.paymentService.charge();
  }
}


// Dependency Injection approach

import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderService {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  createOrder() {
    return this.paymentService.charge();
  }
}`,
      },
      keyTakeaways: [
        "IoC means that a class does not have to control the creation of everything it depends on.",
        "NestJS provides an IoC container that manages providers and their dependencies.",
        "Dependency Injection is a practical way to achieve Inversion of Control.",
        "A service should usually describe what it needs rather than manually creating every dependency.",
        "IoC reduces tight coupling and makes implementations easier to replace.",
        "This pattern becomes especially useful as applications grow.",
      ],
      commonMistakes: [
        "<b>Thinking IoC and DI are exactly the same thing.</b> IoC is the broader principle; Dependency Injection is one way to implement it.",
        "<b>Creating dependencies with `new` everywhere.</b> This can tightly couple classes to concrete implementations.",
        "<b>Thinking Nest magically understands business requirements.</b> Nest resolves dependencies based on the providers and tokens you configure.",
        "<b>Assuming DI is only about avoiding `new`.</b> DI also gives you controlled provider configuration, scopes, replacement, testing, and composition.",
      ],
      quiz: [
        {
          question: "What does Inversion of Control mean?",
          options: [
            "A class must create all its dependencies itself",
            "Control over object creation can be moved outside the class",
            "Controllers must call databases directly",
            "Services cannot have dependencies",
          ],
          correctIndex: 1,
          explanation:
            "IoC means the responsibility for creating and supplying dependencies is moved away from the class that uses them.",
        },
        {
          question: "What does NestJS provide to implement dependency management?",
          options: [
            "A CSS engine",
            "An IoC container",
            "A database server",
            "A browser runtime",
          ],
          correctIndex: 1,
          explanation:
            "NestJS has an IoC container that manages providers and resolves their dependencies.",
        },
      ],
    },
    {
      id: "dependency-injection-container",
      title: "The NestJS DI Container",
      durationMinutes: 18,
      explanation: `The <b>DI container</b> is the part of NestJS that keeps track of your providers and figures out how to create and connect them.

Think of it as a very organized manager.

Suppose you have these classes:

\`\`\`text
UsersController
      |
      v
UsersService
      |
      v
UsersRepository
\`\`\`

When Nest starts the application, it builds the application's dependency graph.

It looks at the modules and their providers. It discovers that \`UsersController\` needs \`UsersService\`, and \`UsersService\` needs \`UsersRepository\`.

Nest then works out how these objects should be created and connected.

Conceptually:

\`\`\`text
UsersController
      |
      | needs
      v
UsersService
      |
      | needs
      v
UsersRepository
\`\`\`

Nest resolves this graph from the bottom toward the object that needs the dependencies.

The exact internal implementation is more complicated than this simplified picture, but this is a useful beginner mental model.

For example:

\`\`\`ts
@Injectable()
export class UsersRepository {
  findById(id: string) {
    return {
      id,
      name: "Alex",
    };
  }
}

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  findUser(id: string) {
    return this.usersRepository.findById(id);
  }
}

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}
}
\`\`\`

The module needs to register the providers:

\`\`\`ts
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
  ],
})
export class UsersModule {}
\`\`\`

Now Nest can construct the dependency chain.

<b>What happens conceptually?</b>

1. Nest sees \`UsersController\`.
2. Nest sees that the controller requires \`UsersService\`.
3. Nest looks for a provider for \`UsersService\`.
4. Nest creates \`UsersService\`.
5. While creating it, Nest sees that it requires \`UsersRepository\`.
6. Nest finds the repository provider.
7. Nest creates the repository.
8. Nest gives the repository to \`UsersService\`.
9. Nest gives the completed \`UsersService\` to \`UsersController\`.

The result is a connected object graph.

You normally do not manually perform these steps.

<b>Real-world example</b>

Imagine a banking application.

\`\`\`text
TransferController
       |
       v
TransferService
       |
       +---------> AccountRepository
       |
       +---------> FraudService
       |
       +---------> NotificationService
                         |
                         v
                    EmailProvider
\`\`\`

The DI container is responsible for understanding these relationships.

If \`TransferService\` needs \`FraudService\`, and \`FraudService\` itself needs another provider, Nest continues resolving the dependency graph.

This is one reason DI becomes so valuable in larger applications.

<b>What if Nest cannot resolve something?</b>

If you forget to register a provider, forget an export, forget an import, or use the wrong injection token, Nest cannot build the dependency graph.

You will usually see a dependency resolution error during application startup.

That error is actually useful. It usually means:

"Nest knows that something is required, but it cannot find a provider that satisfies that dependency."

When debugging DI, ask:

1. Is the provider registered?
2. Is the provider exported if another module needs it?
3. Is the module imported?
4. Is the injection token correct?
5. Is there a circular dependency?
6. Is the provider scope compatible with where it is being used?

Understanding the container makes these errors much easier to debug.`,
      diagram: `                     NestJS DI Container
                              |
                    Builds dependency graph
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
        UsersController   AuthController   OrderController
              |               |               |
              v               v               v
        UsersService      AuthService     OrderService
              |               |               |
              v               v               +------+
       UsersRepository  UsersService              |
                                                 v
                                          PaymentService

Nest finds providers,
creates dependencies,
and injects them into consumers.`,
      codeExample: {
        title: "A dependency chain",
        code: `import { Injectable, Controller, Module } from "@nestjs/common";

@Injectable()
export class UsersRepository {
  findById(id: string) {
    return {
      id,
      name: "Alex",
    };
  }
}

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  findUser(id: string) {
    return this.usersRepository.findById(id);
  }
}

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  findUser(id: string) {
    return this.usersService.findUser(id);
  }
}

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
  ],
})
export class UsersModule {}`,
      },
      keyTakeaways: [
        "The NestJS DI container manages providers and their dependencies.",
        "Nest builds a dependency graph from your modules and providers.",
        "Constructor parameters tell Nest which dependencies a class needs.",
        "Providers can themselves have dependencies.",
        "If Nest cannot find a provider or token, dependency resolution fails.",
        "Module imports and exports are part of how the DI container determines provider visibility.",
      ],
      commonMistakes: [
        "<b>Forgetting to register a custom provider.</b> Nest cannot inject a provider it does not know about.",
        "<b>Registering a provider in the wrong module.</b> Provider visibility follows module boundaries.",
        "<b>Forgetting to export a provider used by another module.</b> The consuming module may not be able to resolve it.",
        "<b>Ignoring the dependency error.</b> Read the dependency name and check the module's providers, imports, exports, and tokens.",
      ],
      quiz: [
        {
          question: "What does the NestJS DI container manage?",
          options: [
            "CSS files",
            "Providers and their dependencies",
            "Only database tables",
            "Only HTTP requests",
          ],
          correctIndex: 1,
          explanation:
            "The DI container creates and connects providers according to the dependency graph.",
        },
        {
          question: "What can cause a dependency resolution error?",
          options: [
            "A missing provider registration",
            "A missing HTML tag",
            "A slow browser",
            "A TypeScript comment",
          ],
          correctIndex: 0,
          explanation:
            "If Nest cannot find a provider or token required by a class, it cannot resolve the dependency.",
        },
      ],
    },
    {
      id: "injection-tokens",
      title: "Injection Tokens",
      durationMinutes: 17,
      explanation: `So far, you have mostly seen Nest inject classes directly:

\`\`\`ts
constructor(
  private readonly usersService: UsersService,
) {}
\`\`\`

This works because the class itself can be used as the provider token.

But sometimes you do not want to use a class as the identity of the dependency.

You might want to inject:

- a configuration object,
- a string value,
- a database connection,
- a third-party SDK,
- a factory-created object,
- an implementation selected at runtime,
- an interface-like abstraction.

This is where <b>injection tokens</b> become important.

An injection token is the identifier Nest uses to find a provider.

A class can be a token:

\`\`\`ts
UsersService
\`\`\`

But a string can also be a token:

\`\`\`ts
"PAYMENT_GATEWAY"
\`\`\`

A symbol can also be used:

\`\`\`ts
PAYMENT_GATEWAY
\`\`\`

For example:

\`\`\`ts
const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");
\`\`\`

Then you can register a provider:

\`\`\`ts
{
  provide: PAYMENT_GATEWAY,
  useClass: StripePaymentGateway,
}
\`\`\`

And inject it using \`@Inject()\`:

\`\`\`ts
@Injectable()
export class CheckoutService {
  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGateway,
  ) {}
}
\`\`\`

The important distinction is:

<b>Provider token</b> = the identifier Nest uses to find the provider.

<b>Provider implementation</b> = the actual value or class Nest gives you.

This separation is extremely useful.

Imagine your checkout service depends on a payment gateway.

You do not necessarily want:

\`\`\`ts
StripePaymentGateway
\`\`\`

hard-coded into your business logic.

Instead, you can define a token:

\`\`\`text
PAYMENT_GATEWAY
\`\`\`

and decide in the module which implementation should be used.

For example:

\`\`\`text
PAYMENT_GATEWAY
      |
      +---- development ----> MockPaymentGateway
      |
      +---- production ------> StripePaymentGateway
\`\`\`

The \`CheckoutService\` does not need to change.

<b>Real-world example: storage</b>

Suppose your application stores uploaded files.

Today you use local disk storage.

Later you move to Amazon S3.

Instead of making every service depend directly on \`S3StorageService\`, you can define:

\`\`\`text
STORAGE
  |
  +---- LocalStorage
  |
  +---- S3Storage
  |
  +---- AzureStorage
\`\`\`

Your application code can depend on the \`STORAGE\` token.

That makes infrastructure easier to replace.

<b>TypeScript interfaces and injection tokens</b>

A common beginner confusion is trying to inject an interface directly:

\`\`\`ts
interface PaymentGateway {
  charge(amount: number): Promise<void>;
}

constructor(
  private readonly paymentGateway: PaymentGateway,
) {}
\`\`\`

This does not work automatically because TypeScript interfaces disappear when the application runs. JavaScript does not have a runtime object representing that interface.

Nest therefore needs a runtime token.

For example:

\`\`\`ts
export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");
\`\`\`

Then:

\`\`\`ts
{
  provide: PAYMENT_GATEWAY,
  useClass: StripePaymentGateway,
}
\`\`\`

and:

\`\`\`ts
constructor(
  @Inject(PAYMENT_GATEWAY)
  private readonly paymentGateway: PaymentGateway,
) {}
\`\`\`

Now TypeScript can describe the shape while the token tells Nest what to inject.`,
      diagram: `                    Injection Token
                         |
                   "PAYMENT_GATEWAY"
                         |
              +----------+----------+
              |                     |
              v                     v
        StripeGateway         MockGateway
              |                     |
              +----------+----------+
                         |
                         v
                 CheckoutService
                         |
                  @Inject(token)
                         |
                         v
                  PaymentGateway

The token identifies what
Nest should provide.`,
      codeExample: {
        title: "Using a custom injection token",
        code: `import { Inject, Injectable, Module } from "@nestjs/common";

export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");

export interface PaymentGateway {
  charge(amount: number): Promise<void>;
}

@Injectable()
export class StripePaymentGateway implements PaymentGateway {
  async charge(amount: number) {
    console.log(\`Charging \${amount} with Stripe\`);
  }
}

@Injectable()
export class CheckoutService {
  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async checkout(amount: number) {
    await this.paymentGateway.charge(amount);
  }
}

@Module({
  providers: [
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentGateway,
    },
    CheckoutService,
  ],
  exports: [PAYMENT_GATEWAY],
})
export class PaymentsModule {}`,
      },
      keyTakeaways: [
        "An injection token identifies a provider in Nest's DI system.",
        "A class can be used as a provider token.",
        "Strings and symbols can also be used as custom tokens.",
        "`@Inject()` lets you explicitly tell Nest which token to use.",
        "Custom tokens are useful when the dependency is not naturally represented by one concrete class.",
        "Interfaces cannot be used as runtime DI tokens by themselves because they disappear from JavaScript at runtime.",
      ],
      commonMistakes: [
        "<b>Trying to inject a TypeScript interface directly.</b> Interfaces do not exist at runtime, so Nest needs a runtime token.",
        "<b>Using different token values accidentally.</b> The token used in `provide` must match the token used in `@Inject()`.",
        "<b>Using a random string in many files.</b> Prefer a shared constant or symbol so the token is consistent.",
        "<b>Thinking the token is the implementation.</b> The token identifies the dependency; the provider configuration determines what Nest actually supplies.",
      ],
      quiz: [
        {
          question: "What is an injection token?",
          options: [
            "A route URL",
            "An identifier Nest uses to find a provider",
            "A database password",
            "A TypeScript interface",
          ],
          correctIndex: 1,
          explanation:
            "Nest uses injection tokens to identify which provider should be injected.",
        },
        {
          question: "Why can't a TypeScript interface normally be used directly as a Nest injection token?",
          options: [
            "Interfaces are too large",
            "Interfaces disappear at runtime",
            "Interfaces cannot contain methods",
            "Interfaces only work in controllers",
          ],
          correctIndex: 1,
          explanation:
            "TypeScript interfaces are removed during compilation, so Nest needs a runtime token such as a class, string, or symbol.",
        },
      ],
    },
    {
      id: "custom-provider-useclass",
      title: "Custom Providers with useClass",
      durationMinutes: 16,
      explanation: `Nest's normal provider syntax is convenient:

\`\`\`ts
providers: [UsersService]
\`\`\`

But Nest also allows you to describe exactly how a provider should be created.

One important option is <b>\`useClass\`</b>.

With \`useClass\`, you tell Nest:

"When someone asks for this token, create an instance of this class."

For example:

\`\`\`ts
{
  provide: "PAYMENT_GATEWAY",
  useClass: StripePaymentGateway,
}
\`\`\`

This means:

\`\`\`text
"PAYMENT_GATEWAY"
       |
       v
StripePaymentGateway
       |
       v
instance supplied by Nest
\`\`\`

This is especially useful when your application depends on an abstraction or token but you want to choose a concrete implementation.

<b>Basic example</b>

\`\`\`ts
@Injectable()
export class EmailService {
  sendEmail() {
    console.log("Sending email");
  }
}

@Module({
  providers: [
    {
      provide: "EMAIL_SERVICE",
      useClass: EmailService,
    },
  ],
})
export class NotificationsModule {}
\`\`\`

Then:

\`\`\`ts
@Injectable()
export class NotificationService {
  constructor(
    @Inject("EMAIL_SERVICE")
    private readonly emailService: EmailService,
  ) {}
}
\`\`\`

Nest sees the token \`EMAIL_SERVICE\` and creates the \`EmailService\` class.

<b>Real-world example</b>

Imagine an application has different logging implementations:

\`\`\`text
Logger
  |
  +---- ConsoleLogger
  |
  +---- CloudLogger
  |
  +---- TestLogger
\`\`\`

Your application could use:

\`\`\`ts
{
  provide: LOGGER,
  useClass: CloudLogger,
}
\`\`\`

For tests, you could replace it with:

\`\`\`ts
{
  provide: LOGGER,
  useClass: TestLogger,
}
\`\`\`

The consuming service can continue asking for the same \`LOGGER\` token.

<b>Another real-world example: payment providers</b>

You might have:

\`\`\`ts
class StripePaymentGateway {}
class PayPalPaymentGateway {}
class MockPaymentGateway {}
\`\`\`

Production:

\`\`\`ts
{
  provide: PAYMENT_GATEWAY,
  useClass: StripePaymentGateway,
}
\`\`\`

Testing:

\`\`\`ts
{
  provide: PAYMENT_GATEWAY,
  useClass: MockPaymentGateway,
}
\`\`\`

The business logic does not need to know which implementation was selected.

This is one of the main reasons custom providers are powerful.`,
      diagram: `                         Token
                    PAYMENT_GATEWAY
                           |
                           |
                    +------+------+
                    |             |
              useClass         useClass
                    |             |
                    v             v
              StripeGateway   MockGateway
                    |             |
                    |             |
                Production      Tests
                    |
                    v
              CheckoutService

The consumer depends on the token,
not on the selected implementation.`,
      codeExample: {
        title: "Selecting an implementation with useClass",
        code: `import { Inject, Injectable, Module } from "@nestjs/common";

export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");

@Injectable()
export class StripePaymentGateway {
  charge(amount: number) {
    console.log(\`Stripe charged \${amount}\`);
  }
}

@Injectable()
export class MockPaymentGateway {
  charge(amount: number) {
    console.log(\`Mock payment: \${amount}\`);
  }
}

@Injectable()
export class CheckoutService {
  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: StripePaymentGateway,
  ) {}

  checkout(amount: number) {
    this.paymentGateway.charge(amount);
  }
}

@Module({
  providers: [
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentGateway,
    },
    CheckoutService,
  ],
})
export class PaymentsModule {}`,
      },
      keyTakeaways: [
        "`useClass` tells Nest which class should be instantiated for a provider token.",
        "It is useful when a token represents an abstraction with multiple implementations.",
        "The consuming service can depend on a token instead of a concrete implementation.",
        "The implementation can be changed without changing the consuming service.",
        "`useClass` is useful for production implementations, alternative implementations, and test doubles.",
      ],
      commonMistakes: [
        "<b>Confusing `provide` and `useClass`.</b> `provide` is the token; `useClass` is the class Nest should instantiate.",
        "<b>Forgetting `@Inject()` when using a custom token.</b> If the token is not a class Nest can infer, explicitly inject it.",
        "<b>Using `useClass` when you already have an existing object.</b> `useValue` is more appropriate when you want to provide an existing value or object.",
      ],
      quiz: [
        {
          question: "What does `useClass` tell Nest?",
          options: [
            "Which route to create",
            "Which class should be instantiated for a provider token",
            "Which database table to use",
            "Which environment variable to read",
          ],
          correctIndex: 1,
          explanation:
            "`useClass` tells Nest which class to create when resolving that provider.",
        },
      ],
    },
    {
      id: "custom-provider-usevalue",
      title: "Custom Providers with useValue",
      durationMinutes: 15,
      explanation: `Sometimes you do not need Nest to create a class at all.

You may already have an object, configuration value, constant, mock, or external object that you want to make available through dependency injection.

This is what <b>\`useValue\`</b> is for.

For example:

\`\`\`ts
{
  provide: "APP_CONFIG",
  useValue: {
    environment: "development",
    apiUrl: "https://api.example.com",
  },
}
\`\`\`

Now Nest can inject that object anywhere the token is available.

\`\`\`ts
@Injectable()
export class ApiService {
  constructor(
    @Inject("APP_CONFIG")
    private readonly config: {
      environment: string;
      apiUrl: string;
    },
  ) {}
}
\`\`\`

The important idea is:

\`\`\`text
Token
  |
  v
APP_CONFIG
  |
  v
Existing object/value
  |
  v
Injected into service
\`\`\`

Nest is not calling a constructor to create that object from \`useValue\`. You are giving Nest the value that should be associated with the token.

<b>Real-world example: configuration</b>

Imagine your application needs some fixed configuration:

\`\`\`ts
const appConfig = {
  environment: "production",
  maxUploadSize: 10,
  apiTimeout: 5000,
};
\`\`\`

You can provide it:

\`\`\`ts
{
  provide: "APP_CONFIG",
  useValue: appConfig,
}
\`\`\`

Then multiple services can inject the same value.

<b>Real-world example: testing</b>

Suppose \`OrdersService\` depends on a payment gateway.

During a unit test, you do not want to call a real payment provider.

You can provide a simple object:

\`\`\`ts
const mockPaymentGateway = {
  charge: jest.fn(),
};
\`\`\`

Then:

\`\`\`ts
{
  provide: PAYMENT_GATEWAY,
  useValue: mockPaymentGateway,
}
\`\`\`

Now the service receives the mock object.

This is extremely useful for testing because you can control the behavior of the dependency without creating the real implementation.

<b>Real-world advanced example: SDK clients</b>

Suppose a third-party library creates an already-configured client:

\`\`\`ts
const client = createExternalClient({
  apiKey: process.env.API_KEY,
});
\`\`\`

You can register the client:

\`\`\`ts
{
  provide: EXTERNAL_CLIENT,
  useValue: client,
}
\`\`\`

Then your services can inject \`EXTERNAL_CLIENT\`.

<b>Important detail</b>

\`useValue\` provides the exact value you give it.

If multiple consumers receive that provider, they receive the same registered value for the provider's scope.

This makes \`useValue\` especially useful for shared configuration objects, constants, mocks, and already-created objects.`,
      diagram: `                 useValue
                    |
                    v
             +-------------+
             | APP_CONFIG  |
             +-------------+
                    |
                    v
          Existing object/value
                    |
          +---------+---------+
          |                   |
          v                   v
      ApiService         UploadService

Nest provides the value you registered.
It does not need to instantiate a class.`,
      codeExample: {
        title: "Providing configuration with useValue",
        code: `import { Inject, Injectable, Module } from "@nestjs/common";

const appConfig = {
  environment: "development",
  apiUrl: "https://api.example.com",
  requestTimeout: 5000,
};

@Injectable()
export class ApiService {
  constructor(
    @Inject("APP_CONFIG")
    private readonly config: typeof appConfig,
  ) {}

  getApiUrl() {
    return this.config.apiUrl;
  }
}

@Module({
  providers: [
    {
      provide: "APP_CONFIG",
      useValue: appConfig,
    },
    ApiService,
  ],
})
export class AppModule {}`,
      },
      keyTakeaways: [
        "`useValue` provides an existing value or object.",
        "Nest does not need to instantiate a class for a `useValue` provider.",
        "It is useful for configuration, constants, mocks, and already-created objects.",
        "It is especially useful in unit tests.",
        "The injection token identifies the value that should be injected.",
      ],
      commonMistakes: [
        "<b>Using `useValue` when you need Nest to create a class with dependencies.</b> Use `useClass` or another provider strategy when appropriate.",
        "<b>Forgetting `@Inject()` for a string or symbol token.</b> Nest needs the token to know which value to provide.",
        "<b>Thinking `useValue` creates a new object for every injection.</b> It provides the registered value.",
      ],
      quiz: [
        {
          question: "When is `useValue` useful?",
          options: [
            "When providing an existing value or object",
            "Only when creating controllers",
            "Only when defining routes",
            "Only when using databases",
          ],
          correctIndex: 0,
          explanation:
            "`useValue` is designed for supplying an existing value, object, mock, constant, or other already-created value.",
        },
      ],
    },
    {
      id: "custom-provider-usefactory",
      title: "Custom Providers with useFactory",
      durationMinutes: 18,
      explanation: `Sometimes the value you need to provide cannot simply be written as a constant.

You may need to <b>create a value dynamically</b> based on configuration or other injected dependencies.

This is where <b>\`useFactory\`</b> becomes useful.

With \`useFactory\`, you give Nest a function that creates the provider value.

For example:

\`\`\`ts
{
  provide: "APP_CONFIG",
  useFactory: () => {
    return {
      environment: process.env.NODE_ENV ?? "development",
    };
  },
}
\`\`\`

Nest calls the factory when it needs to create the provider.

The factory can also receive dependencies.

For example:

\`\`\`ts
{
  provide: "DATABASE_CONNECTION",
  useFactory: (configService: ConfigService) => {
    return createDatabaseConnection(
      configService.get("DATABASE_URL"),
    );
  },
  inject: [ConfigService],
}
\`\`\`

The \`inject\` array tells Nest which providers should be passed to the factory.

The flow is:

\`\`\`text
ConfigService
     |
     | injected into factory
     v
useFactory()
     |
     | creates
     v
Database Connection
     |
     v
DATABASE_CONNECTION token
     |
     v
Repository / Service
\`\`\`

This is extremely useful when creating infrastructure that depends on configuration.

<b>Beginner example</b>

Suppose you want to create a configuration object:

\`\`\`ts
{
  provide: "APP_CONFIG",
  useFactory: () => {
    return {
      environment: process.env.NODE_ENV ?? "development",
    };
  },
}
\`\`\`

The factory returns the value that Nest should provide.

<b>Intermediate example</b>

Suppose you already have a \`ConfigService\`:

\`\`\`ts
@Injectable()
export class ConfigService {
  getDatabaseUrl() {
    return process.env.DATABASE_URL;
  }
}
\`\`\`

You can use it inside a factory:

\`\`\`ts
{
  provide: "DATABASE_CONNECTION",
  useFactory: (configService: ConfigService) => {
    return createDatabaseConnection(
      configService.getDatabaseUrl(),
    );
  },
  inject: [ConfigService],
}
\`\`\`

Notice something important.

The factory itself does not manually create \`ConfigService\`.

It asks Nest to inject it.

That means the DI system works inside the factory provider too.

<b>Advanced example</b>

Imagine an application can connect to different databases depending on the environment.

\`\`\`text
                   ConfigService
                         |
                         v
                    useFactory
                         |
              +----------+----------+
              |                     |
          development            production
              |                     |
              v                     v
        Local database          Cloud database
              |                     |
              +----------+----------+
                         |
                         v
                DATABASE_CONNECTION
                         |
                         v
                    Services
\`\`\`

The consuming services do not need to know how the connection was created.

They only depend on the \`DATABASE_CONNECTION\` token.

<b>Another real-world example: feature configuration</b>

Imagine your application has a feature flag service.

The factory can inspect configuration:

\`\`\`ts
{
  provide: "PAYMENT_GATEWAY",
  useFactory: (config: ConfigService) => {
    if (config.get("PAYMENT_PROVIDER") === "stripe") {
      return new StripePaymentGateway();
    }

    return new MockPaymentGateway();
  },
  inject: [ConfigService],
}
\`\`\`

Now the provider implementation can be selected based on configuration.

This is powerful, but remember that factories should remain understandable. If a factory becomes a giant piece of business logic, it is usually better to move that logic into a dedicated service.

<b>Async factories</b>

Factories can also be asynchronous.

This is useful when creating a provider requires asynchronous setup.

For example:

\`\`\`ts
{
  provide: "DATABASE_CONNECTION",
  useFactory: async (configService: ConfigService) => {
    return await createDatabaseConnection(
      configService.getDatabaseUrl(),
    );
  },
  inject: [ConfigService],
}
\`\`\`

Nest can wait for the promise when resolving the provider.

This pattern is commonly useful for database connections, SDK clients, external services, and other infrastructure that needs asynchronous initialization.`,
      diagram: `                    ConfigService
                         |
                         | inject
                         v
                   useFactory()
                         |
               +---------+---------+
               |                   |
        development          production
               |                   |
               v                   v
          LocalClient          CloudClient
               |                   |
               +---------+---------+
                         |
                         v
                  PROVIDER TOKEN
                         |
                         v
                  Application code


Factory providers can also have
their own injected dependencies.`,
      codeExample: {
        title: "A factory provider using another provider",
        code: `import { Injectable, Module } from "@nestjs/common";

@Injectable()
export class ConfigService {
  getDatabaseUrl() {
    return process.env.DATABASE_URL ?? "postgres://localhost/app";
  }
}

function createDatabaseConnection(url: string) {
  return {
    url,
    connected: true,
  };
}

@Module({
  providers: [
    ConfigService,

    {
      provide: "DATABASE_CONNECTION",

      useFactory: (configService: ConfigService) => {
        return createDatabaseConnection(
          configService.getDatabaseUrl(),
        );
      },

      inject: [ConfigService],
    },
  ],
  exports: ["DATABASE_CONNECTION"],
})
export class DatabaseModule {}`,
      },
      keyTakeaways: [
        "`useFactory` lets a function create the provider value.",
        "Factories can receive dependencies through the `inject` property.",
        "Factory providers are useful when creation depends on configuration or other services.",
        "Factories can be asynchronous.",
        "A factory can choose different implementations based on configuration.",
        "Keep complex business logic out of large factory functions.",
      ],
      commonMistakes: [
        "<b>Forgetting the `inject` array.</b> If the factory expects dependencies, Nest needs to know which providers to pass into it.",
        "<b>Trying to manually create dependencies inside the factory.</b> Use Nest's DI system when those dependencies are providers.",
        "<b>Making factories contain large amounts of business logic.</b> Keep factories focused on provider creation.",
        "<b>Forgetting that an async factory returns a promise.</b> Nest can handle asynchronous factories, but the provider's initialization becomes asynchronous.",
      ],
      quiz: [
        {
          question: "What is the main purpose of `useFactory`?",
          options: [
            "To create a provider value using a function",
            "To define a controller route",
            "To create a module",
            "To define a TypeScript interface",
          ],
          correctIndex: 0,
          explanation:
            "`useFactory` tells Nest to create the provider by calling a factory function.",
        },
        {
          question: "What does the `inject` property do in a factory provider?",
          options: [
            "It tells Nest which dependencies to pass to the factory",
            "It creates a new controller",
            "It exports the provider",
            "It changes the route",
          ],
          correctIndex: 0,
          explanation:
            "The `inject` array identifies providers whose values Nest should pass into the factory function.",
        },
      ],
    },
    {
      id: "custom-provider-useexisting",
      title: "Custom Providers with useExisting",
      durationMinutes: 14,
      explanation: `The fourth custom provider strategy is <b>\`useExisting\`</b>.

It is useful when you want two different tokens to point to the <b>same existing provider instance</b>.

For example, suppose you already have:

\`\`\`ts
@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(message);
  }
}
\`\`\`

You might have a standard token:

\`\`\`ts
LoggerService
\`\`\`

and also want another token:

\`\`\`"APP_LOGGER"
\`\`\`

to refer to that same provider.

You can write:

\`\`\`ts
{
  provide: "APP_LOGGER",
  useExisting: LoggerService,
}
\`\`\`

This means:

"Whenever someone asks for APP_LOGGER, use the existing LoggerService provider."

It does <b>not</b> mean:

"Create another LoggerService."

That distinction is the important part.

Compare:

\`\`\`ts
{
  provide: "APP_LOGGER",
  useClass: LoggerService,
}
\`\`\`

with:

\`\`\`ts
{
  provide: "APP_LOGGER",
  useExisting: LoggerService,
}
\`\`\`

With \`useClass\`, Nest is being told to use the class as the implementation for that token.

With \`useExisting\`, Nest is being told to create an alias to an already-registered provider.

Think of \`useExisting\` as giving an existing provider another name.

<b>Real-world example</b>

Imagine an application already has a \`MetricsService\`.

Several parts of the application use:

\`\`\`ts
MetricsService
\`\`\`

But an older part of the application expects:

\`\`\`ts
"METRICS"
\`\`\`

Instead of creating another metrics service, you can create an alias:

\`\`\`text
MetricsService
      |
      +------------------+
      |                  |
      v                  v
MetricsService       "METRICS"
                         |
                         |
                    same instance
\`\`\`

This can be useful when migrating older code, supporting multiple token names, or exposing a provider under a more abstract token.

<b>Why does the same instance matter?</b>

Imagine the provider stores state:

\`\`\`ts
@Injectable()
export class MetricsService {
  private count = 0;

  increment() {
    this.count++;
  }

  getCount() {
    return this.count;
  }
}
\`\`\`

If two tokens point to the same provider instance, both tokens see the same state.

That can be important for services that maintain internal state or resources.

<b>Important comparison</b>

\`\`\`text
useClass

TOKEN A ----> new LoggerService
TOKEN B ----> new LoggerService

Potentially separate instances.


useExisting

TOKEN A ----+
            |
            +----> existing LoggerService instance
            |
TOKEN B ----+
\`\`\`

The exact lifecycle also depends on the provider scope, but the important concept is that \`useExisting\` creates an alias to an existing provider rather than defining another implementation.`,
      diagram: `                    LoggerService
                         |
                  registered provider
                         |
               +---------+---------+
               |                   |
               v                   v
         LoggerService        "APP_LOGGER"
                                 |
                            useExisting
                                 |
                                 v
                       SAME provider instance


useExisting creates another
token/name for an existing provider.`,
      codeExample: {
        title: "Creating an alias with useExisting",
        code: `import { Injectable, Module } from "@nestjs/common";

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
  exports: [
    LoggerService,
    "APP_LOGGER",
  ],
})
export class LoggingModule {}`,
      },
      keyTakeaways: [
        "`useExisting` creates an alias for an already-registered provider.",
        "It points to the existing provider rather than defining another implementation.",
        "It is useful when the same provider needs multiple tokens.",
        "`useExisting` can help during migrations or when exposing a provider through an abstraction token.",
        "The important difference is that `useExisting` reuses an existing provider.",
      ],
      commonMistakes: [
        "<b>Confusing `useExisting` with `useClass`.</b> `useExisting` points to an existing provider; `useClass` configures a class implementation.",
        "<b>Using `useExisting` without registering the target provider.</b> The provider referenced by `useExisting` needs to exist.",
        "<b>Assuming two tokens always mean two instances.</b> With `useExisting`, both tokens can refer to the same provider instance according to its scope.",
      ],
      quiz: [
        {
          question: "What does `useExisting` do?",
          options: [
            "Creates an alias to an existing provider",
            "Creates a new database",
            "Creates a controller",
            "Creates a new module",
          ],
          correctIndex: 0,
          explanation:
            "`useExisting` tells Nest to use an already-registered provider for another token.",
        },
      ],
    },
    {
      id: "provider-scopes",
      title: "Provider Scopes",
      durationMinutes: 17,
      explanation: `By default, NestJS providers use the <b>singleton scope</b>.

That means Nest creates one instance of the provider within the application container and reuses that instance wherever that provider is injected, subject to the module/container context.

For many services, this is exactly what you want.

For example:

\`\`\`ts
@Injectable()
export class UsersService {
  findUser(id: string) {
    // ...
  }
}
\`\`\`

A UsersService usually does not need a new object for every HTTP request.

The default singleton behavior is efficient and makes sense for stateless services.

Nest also supports other provider scopes.

The main scopes you should know are:

- <b>DEFAULT</b> — singleton. The provider is shared.
- <b>REQUEST</b> — a new instance is created for each request.
- <b>TRANSIENT</b> — a new instance is created for each consumer that injects it.

You can define a scope with the \`scope\` option.

For example:

\`\`\`ts
@Injectable({
  scope: Scope.REQUEST,
})
export class RequestContextService {}
\`\`\`

Or:

\`\`\`ts
{
  provide: RequestContextService,
  useClass: RequestContextService,
  scope: Scope.REQUEST,
}
\`\`\`

<b>Singleton scope</b>

This is the default.

Think about a configuration service.

You probably do not need a separate configuration service object for every request.

\`\`\`text
Request 1 ----+
Request 2 ----+----> ConfigService instance
Request 3 ----+
Request 4 ----+
\`\`\`

<b>Request scope</b>

With request scope, Nest creates a provider instance for each incoming request.

Imagine a request context service that stores information about the current request:

\`\`\`text
Request A ---> RequestContext instance A
Request B ---> RequestContext instance B
Request C ---> RequestContext instance C
\`\`\`

This can be useful when you need request-specific state.

For example:

\`\`\`ts
@Injectable({
  scope: Scope.REQUEST,
})
export class RequestContextService {
  requestId?: string;
}
\`\`\`

Each request gets its own instance.

<b>Transient scope</b>

Transient providers behave differently.

A transient provider gets a new instance for each consumer that injects it.

Imagine:

\`\`\`text
OrdersService ------> AuditHelper instance A

PaymentsService ----> AuditHelper instance B
\`\`\`

Both services inject the same transient provider token, but each consumer receives its own instance.

This can be useful when the provider has small, consumer-specific state.

<b>Why not make everything request-scoped?</b>

Because provider scope affects the dependency graph.

If a singleton service depends on a request-scoped provider, Nest needs to account for the request-specific dependency. This can cause the consuming provider to become request-scoped as well.

For example:

\`\`\`text
RequestScopedService
        ^
        |
    OrderService
        ^
        |
    OrderController
\`\`\`

If \`OrderService\` needs request-specific state, it cannot behave like an ordinary application-wide singleton in the same way.

This is why request scope should be used intentionally.

<b>Real-world example: request ID</b>

Imagine every incoming request receives an ID:

\`\`\`text
Request
  |
  +--> requestId = abc-123
  |
  +--> RequestContextService
          |
          +--> OrderService
          |
          +--> PaymentService
          |
          +--> LoggerService
\`\`\`

Services can use the request context to include the request ID in logs.

This can be useful for tracing a request across several services.

<b>Real-world example: multi-tenant application</b>

Imagine a SaaS application where every request belongs to a different customer.

You might need request-specific information such as:

\`\`\`text
tenantId
userId
requestId
locale
permissions
\`\`\`

A request-scoped provider can hold that context.

Then services involved in processing that request can access the appropriate tenant information.

However, request scope is not automatically the best solution for every multi-tenant application. You should consider how the tenant information is passed through your application and whether request-scoped objects are actually necessary.

<b>Performance consideration</b>

Singleton providers are usually the simplest and most efficient choice when the service does not need request-specific state.

Request-scoped providers require Nest to create and manage additional instances as requests are processed.

Therefore, a good beginner rule is:

<b>Use the default singleton scope unless you have a real reason to use request or transient scope.</b>

Do not choose request scope just because the application handles HTTP requests. Most Nest services can remain singleton services while still safely handling many requests, as long as they do not store request-specific mutable state.`,
      diagram: `DEFAULT / SINGLETON

Request A ----+
Request B ----+----> One Service Instance
Request C ----+
Request D ----+


REQUEST SCOPE

Request A --------> Service Instance A
Request B --------> Service Instance B
Request C --------> Service Instance C


TRANSIENT

Consumer A -------> Service Instance A
Consumer B -------> Service Instance B
Consumer C -------> Service Instance C

Each consumer receives
its own transient instance.`,
      codeExample: {
        title: "Default, request, and transient scopes",
        code: `import {
  Injectable,
  Scope,
} from "@nestjs/common";

// Default: singleton
@Injectable()
export class ConfigService {
  getEnvironment() {
    return process.env.NODE_ENV ?? "development";
  }
}


// New instance for every request
@Injectable({
  scope: Scope.REQUEST,
})
export class RequestContextService {
  requestId?: string;
}


// New instance for each consumer
@Injectable({
  scope: Scope.TRANSIENT,
})
export class AuditHelper {
  record(message: string) {
    console.log(message);
  }
}`,
      },
      keyTakeaways: [
        "Nest providers are singleton-scoped by default.",
        "Singleton providers are usually the right choice for stateless services.",
        "Request-scoped providers receive a new instance for each request.",
        "Transient providers receive a new instance for each consumer.",
        "Request scope is useful for request-specific state such as request context.",
        "Provider scope can affect the scope of services that depend on request-scoped providers.",
        "Do not use request scope unless the application actually needs request-specific state.",
      ],
      commonMistakes: [
        "<b>Assuming singleton means one object for the entire universe.</b> It means one provider instance within the relevant Nest container/context.",
        "<b>Storing request-specific state in a singleton.</b> This can cause data from one request to leak into another request.",
        "<b>Making every provider request-scoped.</b> This adds unnecessary instance creation and complexity.",
        "<b>Forgetting scope propagation.</b> A provider depending on a request-scoped provider may also need request-scoped handling.",
      ],
      quiz: [
        {
          question: "What is the default provider scope in NestJS?",
          options: [
            "Request",
            "Transient",
            "Singleton",
            "Controller-only",
          ],
          correctIndex: 2,
          explanation:
            "Nest providers are singleton-scoped by default.",
        },
        {
          question: "When is request scope useful?",
          options: [
            "When a provider needs request-specific state",
            "For every service automatically",
            "Only for database tables",
            "Only for controllers",
          ],
          correctIndex: 0,
          explanation:
            "Request scope creates a provider instance for each request and is useful when the provider needs request-specific state.",
        },
        {
          question: "What does transient scope mean?",
          options: [
            "One instance for the entire application",
            "A new instance for each consumer",
            "A new instance every five minutes",
            "No instance is ever created",
          ],
          correctIndex: 1,
          explanation:
            "A transient provider gets a new instance for each consumer that injects it.",
        },
      ],
    },
    {
      id: "combining-provider-strategies",
      title: "Putting Provider Strategies Together",
      durationMinutes: 18,
      explanation: `The real power of NestJS Dependency Injection appears when you combine the different provider strategies.

In a real application, you may use all of these:

\`\`\`text
useClass
useValue
useFactory
useExisting
\`\`\`

They solve different problems.

<b>useClass</b>

Use it when you want Nest to instantiate a particular class.

\`\`\`ts
{
  provide: PAYMENT_GATEWAY,
  useClass: StripePaymentGateway,
}
\`\`\`

<b>useValue</b>

Use it when you already have the value or object you want to provide.

\`\`\`ts
{
  provide: APP_CONFIG,
  useValue: config,
}
\`\`\`

<b>useFactory</b>

Use it when the provider needs to be created dynamically.

\`\`\`ts
{
  provide: DATABASE,
  useFactory: (config: ConfigService) => {
    return createDatabase(config);
  },
  inject: [ConfigService],
}
\`\`\`

<b>useExisting</b>

Use it when another token should point to an already-existing provider.

\`\`\`ts
{
  provide: "APP_LOGGER",
  useExisting: LoggerService,
}
\`\`\`

Let's look at a more realistic application.

Imagine an e-commerce checkout system.

The checkout service needs a payment gateway:

\`\`\`text
CheckoutService
       |
       v
PAYMENT_GATEWAY
       |
       v
StripePaymentGateway
\`\`\`

In production, you may use Stripe.

In automated tests, you may use a mock.

\`\`\`text
Production:
PAYMENT_GATEWAY -> StripePaymentGateway

Tests:
PAYMENT_GATEWAY -> MockPaymentGateway
\`\`\`

The checkout service does not change.

Now imagine the Stripe client itself needs configuration.

You can create it with a factory:

\`\`\`text
ConfigService
     |
     v
useFactory
     |
     v
StripeClient
     |
     v
StripePaymentGateway
\`\`\`

You might also have a LoggerService that is already registered, but legacy code expects a different token.

You can use \`useExisting\`:

\`\`\`text
LoggerService
     |
     +----> LoggerService token
     |
     +----> "APP_LOGGER" token
\`\`\`

And perhaps you have a small static configuration object:

\`\`\`text
APP_CONFIG
    |
    v
useValue
    |
    v
configuration object
\`\`\`

This gives you a flexible dependency graph.

<b>Advanced real-world architecture</b>

Consider a SaaS application:

\`\`\`text
                         AppModule
                             |
                   +---------+---------+
                   |                   |
                   v                   v
             ConfigService       LoggerService
                   |                   |
                   |                   +---- useExisting
                   |                         |
                   v                         v
              useFactory              "APP_LOGGER"
                   |
                   v
             DatabaseClient
                   |
                   v
            DATABASE_CLIENT
                   |
        +----------+----------+
        |                     |
        v                     v
   UserRepository       OrderRepository
        |                     |
        +----------+----------+
                   |
                   v
              OrderService
                   |
                   v
          PAYMENT_GATEWAY
                   |
             +-----+-----+
             |           |
             v           v
           Stripe       Mock
          useClass     useClass
\`\`\`

This is the kind of dependency graph NestJS is designed to manage.

<b>Choosing the right provider strategy</b>

When you are building a provider, ask:

<b>Do I want Nest to instantiate a class?</b>

Use \`useClass\`.

<b>Do I already have the object/value?</b>

Use \`useValue\`.

<b>Do I need a function to create the provider?</b>

Use \`useFactory\`.

<b>Do I want another token to point to an existing provider?</b>

Use \`useExisting\`.

This simple decision process will help you choose the right provider type.

<b>One more important idea: abstraction</b>

Good dependency injection is not about making every class complicated.

The goal is to make important boundaries replaceable.

For example, your order service should not need to know whether payment happens through Stripe, PayPal, or a fake test gateway.

It needs a payment capability.

The DI configuration decides which implementation provides that capability.

That gives you a clean separation:

\`\`\`text
Business logic
      |
      | depends on
      v
Abstraction / Token
      |
      | configured by
      v
Infrastructure implementation
\`\`\`

This is one of the most useful architectural ideas to take away from Dependency Injection.`,
      diagram: `                         NestJS DI
                            |
       +--------------------+--------------------+
       |                    |                    |
    useClass             useValue            useFactory
       |                    |                    |
       v                    v                    v
 PaymentGateway         AppConfig          DatabaseClient
       |                                         ^
       |                                         |
       |                                    ConfigService
       |                                         |
       |                                      inject
       |
       +------------------------+
                                |
                             Checkout


                    useExisting
                         |
                         v
                  LoggerService
                         |
                   +-----+-----+
                   |           |
                   v           v
             LoggerService  "APP_LOGGER"

Four strategies,
four different purposes.`,
      codeExample: {
        title: "A realistic combination of provider strategies",
        code: `import {
  Inject,
  Injectable,
  Module,
} from "@nestjs/common";

export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");
export const APP_CONFIG = Symbol("APP_CONFIG");
export const STRIPE_CLIENT = Symbol("STRIPE_CLIENT");

interface PaymentGateway {
  charge(amount: number): Promise<void>;
}

@Injectable()
export class ConfigService {
  getStripeKey() {
    return process.env.STRIPE_KEY ?? "test-key";
  }
}

@Injectable()
export class StripePaymentGateway implements PaymentGateway {
  constructor(
    @Inject(STRIPE_CLIENT)
    private readonly stripeClient: {
      charge(amount: number): Promise<void>;
    },
  ) {}

  async charge(amount: number) {
    await this.stripeClient.charge(amount);
  }
}

@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(message);
  }
}

@Injectable()
export class CheckoutService {
  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGateway,

    @Inject(APP_CONFIG)
    private readonly config: {
      environment: string;
    },

    @Inject("APP_LOGGER")
    private readonly logger: LoggerService,
  ) {}

  async checkout(amount: number) {
    this.logger.log(
      \`Checkout started in \${this.config.environment}\`,
    );

    await this.paymentGateway.charge(amount);
  }
}

@Module({
  providers: [
    ConfigService,

    // useValue
    {
      provide: APP_CONFIG,
      useValue: {
        environment: process.env.NODE_ENV ?? "development",
      },
    },

    // useFactory
    {
      provide: STRIPE_CLIENT,
      useFactory: (configService: ConfigService) => {
        return {
          async charge(amount: number) {
            console.log(
              \`Stripe charge of \${amount} using \${configService.getStripeKey()}\`,
            );
          },
        };
      },
      inject: [ConfigService],
    },

    // useClass
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentGateway,
    },

    // Existing provider
    LoggerService,

    // useExisting
    {
      provide: "APP_LOGGER",
      useExisting: LoggerService,
    },

    CheckoutService,
  ],
})
export class PaymentsModule {}`,
      },
      keyTakeaways: [
        "The four main custom provider strategies solve different dependency problems.",
        "`useClass` selects a class implementation.",
        "`useValue` provides an existing value or object.",
        "`useFactory` creates a provider dynamically and can receive injected dependencies.",
        "`useExisting` creates another token for an existing provider.",
        "Custom tokens allow business logic to depend on an abstraction instead of a concrete infrastructure implementation.",
        "Provider scopes determine how provider instances are created and reused.",
      ],
      commonMistakes: [
        "<b>Choosing provider strategies randomly.</b> Decide whether you need a class, existing value, factory, or alias.",
        "<b>Putting business logic into provider factories.</b> Factories should mainly handle construction and configuration.",
        "<b>Using request scope to solve every state problem.</b> First determine whether the state really belongs to an individual request.",
        "<b>Hard-coding third-party implementations inside business services.</b> Use tokens and provider configuration when the implementation may change.",
      ],
      quiz: [
        {
          question: "Which provider strategy should you normally use when Nest should instantiate a specific class?",
          options: [
            "`useValue`",
            "`useClass`",
            "`useExisting`",
            "`useFactory`",
          ],
          correctIndex: 1,
          explanation:
            "`useClass` tells Nest which class to instantiate for a provider token.",
        },
        {
          question: "Which strategy is best when you already have an object you want to inject?",
          options: [
            "`useValue`",
            "`useClass`",
            "`useExisting`",
            "`useFactory`",
          ],
          correctIndex: 0,
          explanation:
            "`useValue` provides the existing object or value directly.",
        },
        {
          question: "Which strategy is useful when provider creation depends on another service?",
          options: [
            "`useValue`",
            "`useFactory`",
            "`useExisting`",
            "`useClass` only",
          ],
          correctIndex: 1,
          explanation:
            "A factory can receive dependencies through the `inject` array and create the provider dynamically.",
        },
        {
          question: "What is the main idea behind `useExisting`?",
          options: [
            "Create a completely new implementation",
            "Create an alias for an existing provider",
            "Create a database connection",
            "Make a provider request-scoped",
          ],
          correctIndex: 1,
          explanation:
            "`useExisting` allows another token to point to an already-registered provider.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is Inversion of Control?",
      options: [
        "A class must create every dependency itself",
        "Control over dependency creation can be moved outside the class",
        "A controller must directly access the database",
        "A provider cannot have dependencies",
      ],
      correctIndex: 1,
      explanation:
        "IoC moves control over object creation and dependency wiring away from the consuming class.",
    },
    {
      question: "What does the NestJS DI container do?",
      options: [
        "Only handles HTTP requests",
        "Manages providers and resolves their dependencies",
        "Only manages database tables",
        "Only creates controllers",
      ],
      correctIndex: 1,
      explanation:
        "Nest's DI container manages providers and builds the dependency graph needed to inject them.",
    },
    {
      question: "What is an injection token?",
      options: [
        "An identifier used by Nest to locate a provider",
        "A URL parameter",
        "A database column",
        "A TypeScript comment",
      ],
      correctIndex: 0,
      explanation:
        "An injection token identifies which provider should be supplied.",
    },
    {
      question: "Why can't a TypeScript interface normally be used directly as a Nest injection token?",
      options: [
        "Interfaces cannot have methods",
        "Interfaces disappear at runtime",
        "Interfaces only work in controllers",
        "Interfaces are always private",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript interfaces are removed during compilation, so Nest needs a runtime token.",
    },
    {
      question: "What does `useClass` do?",
      options: [
        "Provides an existing object",
        "Tells Nest which class to instantiate",
        "Creates an alias to an existing provider",
        "Runs an asynchronous factory",
      ],
      correctIndex: 1,
      explanation:
        "`useClass` specifies the class Nest should instantiate for the provider token.",
    },
    {
      question: "What does `useValue` do?",
      options: [
        "Provides an existing value or object",
        "Creates a new class automatically",
        "Creates a new module",
        "Creates a new controller",
      ],
      correctIndex: 0,
      explanation:
        "`useValue` associates a token with an existing value or object.",
    },
    {
      question: "What does `useFactory` allow you to do?",
      options: [
        "Create a provider using a function",
        "Create routes automatically",
        "Create controllers without decorators",
        "Make every provider global",
      ],
      correctIndex: 0,
      explanation:
        "`useFactory` creates a provider by calling a factory function.",
    },
    {
      question: "What does the `inject` property do in a factory provider?",
      options: [
        "Lists dependencies that Nest passes to the factory",
        "Exports the factory",
        "Makes the provider global",
        "Changes the provider scope",
      ],
      correctIndex: 0,
      explanation:
        "The `inject` array tells Nest which providers should be passed into the factory function.",
    },
    {
      question: "What does `useExisting` do?",
      options: [
        "Creates a new instance for every request",
        "Creates an alias for an existing provider",
        "Creates an object from JSON",
        "Creates a controller",
      ],
      correctIndex: 1,
      explanation:
        "`useExisting` points another token to an already-registered provider.",
    },
    {
      question: "What is the default provider scope in NestJS?",
      options: [
        "REQUEST",
        "TRANSIENT",
        "DEFAULT / singleton",
        "GLOBAL",
      ],
      correctIndex: 2,
      explanation:
        "Nest providers are singleton-scoped by default.",
    },
    {
      question: "When would request scope make sense?",
      options: [
        "When the provider needs request-specific state",
        "For every service automatically",
        "Only for static constants",
        "Only for database tables",
      ],
      correctIndex: 0,
      explanation:
        "Request scope creates a new provider instance for each request and is useful for request-specific state.",
    },
    {
      question: "What does transient scope mean?",
      options: [
        "One instance for the whole application",
        "A new instance for each consumer",
        "One instance for each database",
        "No instance is created",
      ],
      correctIndex: 1,
      explanation:
        "A transient provider gets a new instance for each consumer that injects it.",
    },
    {
      question: "Which strategy is appropriate when you want a provider to be created using another injected service?",
      options: [
        "`useValue`",
        "`useFactory`",
        "`useExisting`",
        "`useClass` without dependencies",
      ],
      correctIndex: 1,
      explanation:
        "Factory providers can receive dependencies through `inject` and use them to create the provider.",
    },
    {
      question: "Which approach best keeps a checkout service independent from Stripe?",
      options: [
        "Create `StripePaymentGateway` with `new` inside CheckoutService",
        "Inject a payment gateway token and configure the implementation in the module",
        "Import Stripe directly into every service",
        "Store Stripe credentials inside CheckoutService",
      ],
      correctIndex: 1,
      explanation:
        "A provider token allows the checkout service to depend on the payment capability while the module chooses the concrete implementation.",
    },
  ],
  project: {
    name: "Flexible payment and notification system",
    goal: "Build a NestJS dependency injection setup that uses custom tokens, multiple provider strategies, and provider scopes in a realistic application.",
    brief: "Create a small e-commerce backend where CheckoutService depends on an abstract payment gateway, configuration is injected through a value provider, a payment client is created through a factory, a logger is exposed through an alias, and request information is handled by a request-scoped provider.",
    steps: [
      "Create a `PaymentGateway` interface describing a `charge()` method.",
      "Create a `PAYMENT_GATEWAY` symbol to use as the injection token.",
      "Create a `StripePaymentGateway` implementation.",
      "Create a `MockPaymentGateway` implementation for development or tests.",
      "Register `StripePaymentGateway` with `useClass` for the normal application.",
      "Create an `APP_CONFIG` token and provide an application configuration object with `useValue`.",
      "Create a `ConfigService` that can read application configuration.",
      "Create a `PAYMENT_CLIENT` token.",
      "Use `useFactory` to create a payment client using `ConfigService`.",
      "Use the `inject` array to provide `ConfigService` to the factory.",
      "Create a `LoggerService` using the normal class provider syntax.",
      "Create an `APP_LOGGER` token using `useExisting` so it points to the existing LoggerService.",
      "Create a `RequestContextService` with `Scope.REQUEST`.",
      "Store a request ID and optional user ID in the request context.",
      "Create `CheckoutService` and inject the payment gateway, configuration, logger, and request context.",
      "Keep CheckoutService unaware of whether Stripe or the mock gateway is being used.",
      "Create a test configuration that replaces the payment gateway with `MockPaymentGateway`.",
      "Inspect the dependency graph and identify which dependencies are singleton, request-scoped, factory-created, value-based, and aliased.",
    ],
    acceptance: [
      "A custom `PAYMENT_GATEWAY` injection token is used.",
      "CheckoutService injects the payment gateway using `@Inject(PAYMENT_GATEWAY)`.",
      "The production payment implementation is registered using `useClass`.",
      "A configuration object is registered using `useValue`.",
      "A provider is created using `useFactory`.",
      "The factory receives at least one dependency through the `inject` array.",
      "A provider alias is created using `useExisting`.",
      "A request-scoped provider is implemented using `Scope.REQUEST`.",
      "CheckoutService does not directly instantiate its dependencies with `new`.",
      "The payment implementation can be replaced without changing CheckoutService.",
      "The application demonstrates the difference between provider tokens and provider implementations.",
      "The application uses singleton providers for normal stateless services.",
    ],
    stretch: [
      "Create a second payment implementation such as PayPalPaymentGateway.",
      "Select the payment implementation dynamically with a factory based on configuration.",
      "Create a transient AuditHelper and inject it into two different services.",
      "Add a request ID to every log message using RequestContextService.",
      "Create a mock payment provider using `useValue` instead of `useClass`.",
      "Create a separate token for the payment client and expose it from a PaymentsModule.",
      "Move payment infrastructure into its own feature module and export only the providers that other modules need.",
      "Write unit tests for CheckoutService where the real payment provider is replaced with a mock.",
      "Experiment with removing a provider registration and read the Nest dependency-resolution error.",
      "Experiment with changing `useExisting` to `useClass` and observe how provider instances and aliases differ.",
    ],
  },
};
