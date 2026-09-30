import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_25_LESSONS: LessonDay = {
  day: 25,
  title: "Architecture Project — Designing a Clean NestJS Application",
  totalMinutes: 150,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "architecture-project-overview",
      title: "From a Small NestJS App to a Real-World Application",
      durationMinutes: 25,
      explanation: `A small NestJS application can start with only a few files, but real applications quickly become more complicated.

Imagine that you are building an e-commerce platform called <b>ShopSphere</b>.

At the beginning, you might have only:

\`app.controller.ts\`
\`app.service.ts\`
\`app.module.ts\`

That is completely fine for a small learning project.

But after a few months, ShopSphere may need authentication, users, products, shopping carts, orders, payments, email notifications, background jobs, administration, inventory, and external services.

If all of this logic is placed inside a few large files, the application becomes difficult to understand and dangerous to change.

For example, imagine putting this into one giant service:

\`AuthService\`
\`UserService\`
\`ProductService\`
\`OrderService\`
\`PaymentService\`
\`NotificationService\`

The service could eventually contain thousands of lines of code.

A developer who wants to change payment processing would have to search through unrelated user, product, and notification logic.

Instead, we can divide the application according to <b>business responsibilities</b>.

For this project, our top-level architecture is:

\`src/\`
\`├── auth/\`
\`├── users/\`
\`├── products/\`
\`├── orders/\`
\`├── payments/\`
\`└── notifications/\`

Each folder represents a meaningful part of the business.

This is more than simply organizing files into folders.

The goal is to create <b>boundaries</b>.

The authentication area should contain authentication-related behavior.

The users area should contain user-related behavior.

The products area should contain product-related behavior.

The orders area should contain order-related behavior.

The payments area should contain payment-related behavior.

The notifications area should contain notification-related behavior.

This becomes especially useful when multiple developers work on the same application.

For example, one developer can work mainly on payments while another works on products without constantly editing the same files.

<b>Beginner real-world example:</b>

Imagine a restaurant.

You would not put the chef, cashier, delivery driver, and manager in one room and ask everyone to do every job.

You give each responsibility a place.

The kitchen handles food.

The cashier handles payments.

The delivery team handles delivery.

The manager coordinates the operation.

NestJS modules give your software a similar organizational structure.

<b>Intermediate real-world example:</b>

Suppose a customer places an order.

The order module knows that an order needs to be created.

The products module knows whether products exist and whether they are available.

The users module knows which customer owns the order.

The payments module handles payment processing.

The notifications module sends the customer a confirmation.

The order process therefore crosses multiple business areas without putting every piece of code into one module.

<b>Advanced real-world example:</b>

Imagine that ShopSphere initially uses Stripe for payments.

Later, the business wants to support another payment provider.

If payment-specific code is scattered throughout orders, controllers, and users, changing providers can become extremely difficult.

A better architecture keeps payment behavior behind the payments boundary.

The order system can say:

\`chargePayment(...)\`

without needing to understand every implementation detail of the payment provider.

This is the beginning of designing software around <b>responsibilities instead of individual files</b>.

The architecture for this project will progressively move from simple NestJS modules toward a structure that can support a real production application.`,
      diagram: `ShopSphere E-Commerce Application

src/
|
+-- auth/
|     |
|     +-- Authentication
|     +-- Login
|     +-- Registration
|     +-- Access control
|
+-- users/
|     |
|     +-- Customer profiles
|     +-- Addresses
|     +-- User management
|
+-- products/
|     |
|     +-- Product catalog
|     +-- Pricing
|     +-- Inventory information
|
+-- orders/
|     |
|     +-- Cart/order creation
|     +-- Order status
|     +-- Order history
|
+-- payments/
|     |
|     +-- Payment processing
|     +-- Refunds
|     +-- Payment status
|
+-- notifications/
      |
      +-- Email
      +-- SMS
      +-- Push notifications

Each module owns a business responsibility.`,
      codeExample: {
        title: "Basic NestJS architecture",
        code: `// src/
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── dto/
│
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── dto/
│
├── products/
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.module.ts
│   └── dto/
│
├── orders/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── orders.module.ts
│   └── dto/
│
├── payments/
│   ├── payments.controller.ts
│   ├── payments.service.ts
│   ├── payments.module.ts
│   └── dto/
│
├── notifications/
│   ├── notifications.controller.ts
│   ├── notifications.service.ts
│   ├── notifications.module.ts
│   └── dto/
│
├── app.module.ts
└── main.ts`,
      },
      keyTakeaways: [
        "A NestJS application should be divided around meaningful responsibilities as it grows.",
        "The goal of modules is not merely to create folders; modules establish boundaries between parts of the application.",
        "Auth, users, products, orders, payments, and notifications represent separate business responsibilities.",
        "A good architecture makes code easier to find, understand, test, and change.",
        "A real application often contains many modules, but each module should have a clear reason to exist.",
        "The architecture should make it obvious where new functionality belongs.",
      ],
      commonMistakes: [
        "<b>Creating one giant service.</b> A service that handles authentication, products, orders, payments, and notifications becomes difficult to maintain.",
        "<b>Organizing only by technical file type.</b> A giant controllers folder and giant services folder can make business boundaries difficult to see.",
        "<b>Creating modules with no responsibility.</b> A module should represent something meaningful rather than simply being another folder.",
        "<b>Making every module depend on every other module.</b> Excessive dependencies create a tightly coupled application.",
        "<b>Assuming architecture means creating hundreds of files immediately.</b> Start with meaningful boundaries and add complexity when the application actually needs it.",
      ],
      quiz: [
        {
          question: "Why would a growing NestJS application be divided into modules?",
          options: [
            "Only to make the project look larger",
            "To separate meaningful responsibilities and create boundaries",
            "Because NestJS cannot have more than one service",
            "Because controllers cannot call services",
          ],
          correctIndex: 1,
          explanation: "Modules help separate business responsibilities and make a growing application easier to understand and maintain.",
        },
        {
          question: "Where should payment-specific behavior normally live?",
          options: [
            "The payments module",
            "The products controller",
            "The main.ts file",
            "Every module that needs payment information",
          ],
          correctIndex: 0,
          explanation: "Payment behavior belongs inside the payments boundary so payment-related changes remain localized.",
        },
        {
          question: "What is the primary purpose of the proposed folder structure?",
          options: [
            "To create more imports",
            "To separate business responsibilities",
            "To eliminate services",
            "To avoid using modules",
          ],
          correctIndex: 1,
          explanation: "The structure organizes the application around business responsibilities.",
        },
      ],
    },
    {
      id: "module-responsibilities-and-boundaries",
      title: "Designing Module Responsibilities and Boundaries",
      durationMinutes: 30,
      explanation: `The most important architecture question is not "What files should I create?"

The more useful question is:

<b>"Which part of the application should own this behavior?"</b>

That question helps prevent a large number of architecture problems.

Let's examine each module in the ShopSphere application.

<b>1. Auth module</b>

The auth module is responsible for identifying users and controlling access.

Typical responsibilities include:

- Registration
- Login
- Password verification
- Access tokens
- Refresh tokens
- Authentication guards
- Role or permission checks
- Password reset flows

The auth module should not become the place where all user information is stored.

For example, authentication may need to find a user, but the user profile itself belongs to the users module.

<b>2. Users module</b>

The users module owns customer information.

It may contain:

- User profile
- Name
- Email
- Phone number
- Addresses
- Account status
- User preferences

Authentication may depend on users, but that does not mean auth should own the complete user domain.

<b>3. Products module</b>

The products module owns the catalog.

It can handle:

- Product creation
- Product updates
- Product deletion
- Product details
- Product categories
- Prices
- Inventory information
- Product availability

An order may ask the products area for information, but an order should not secretly modify product database tables everywhere in the application.

<b>4. Orders module</b>

The orders module owns the customer's purchase process.

It can handle:

- Creating orders
- Order items
- Order totals
- Order status
- Order history
- Cancellation
- Shipping-related order information

The order module may need product information and payment information, but it should not contain the implementation details of every external payment provider.

<b>5. Payments module</b>

The payments module owns money movement.

It can handle:

- Creating payment attempts
- Confirming payments
- Refunds
- Payment status
- Provider integration
- Webhook processing
- Payment failures

This boundary becomes extremely important because payment integrations often involve external APIs, signatures, retries, idempotency, and asynchronous events.

<b>6. Notifications module</b>

The notifications module owns communication with customers.

It may handle:

- Email
- SMS
- Push notifications
- Templates
- Notification preferences
- Delivery status

The order module can request that a notification be sent without needing to know exactly how an email provider works.

<b>Beginner real-world example:</b>

Think about a supermarket.

The product catalog knows what products exist.

The cashier knows about purchases.

The payment terminal handles payment.

The customer service desk handles customer issues.

You would not ask the payment terminal to maintain the product catalog.

The same principle applies to software.

<b>Intermediate example:</b>

Suppose a customer places an order.

The flow could look like:

Customer
→ Orders
→ Products
→ Payments
→ Notifications

The order is the central business process, but each module contributes its own responsibility.

<b>Advanced example:</b>

Suppose the payment provider sends a webhook:

\`payment.succeeded\`

The payments module receives the webhook.

It verifies the provider signature.

It finds the payment.

It marks the payment as successful.

Then it communicates that the payment succeeded.

The orders module can react to the successful payment and move the order from:

\`PENDING_PAYMENT\`

to:

\`PAID\`

The notifications module can then send:

\`Your order has been confirmed.\`

Notice what is happening.

The payment provider's API details do not need to spread across the entire application.

That is a major architectural benefit.

<b>Dependency direction</b>

You should also think about dependency direction.

For example:

Orders may need Users.

Orders may need Products.

Orders may need Payments.

Orders may trigger Notifications.

But this does not mean every module should import every other module.

A common architecture problem looks like this:

Auth → Users
Users → Orders
Orders → Payments
Payments → Notifications
Notifications → Auth
Auth → Notifications

Eventually the application becomes a dependency circle.

Circular dependencies are not automatically impossible in NestJS, but they are often a sign that responsibilities or communication patterns need to be reconsidered.

A cleaner design often uses shared abstractions, domain events, or carefully selected module dependencies instead of making every module directly dependent on every other module.`,
      diagram: `Business Boundaries

             +-------------+
             |    AUTH     |
             +------+------+
                    |
                    v
             +-------------+
             |    USERS    |
             +------+------+
                    |
                    v
             +-------------+
             |   ORDERS    |
             +------+------+
                    |
          +---------+---------+
          |                   |
          v                   v
   +-------------+     +-------------+
   |  PRODUCTS   |     |  PAYMENTS   |
   +-------------+     +------+------+
                             |
                             v
                      +-------------+
                      |NOTIFICATIONS|
                      +-------------+

The diagram is conceptual.

Real applications may use events,
interfaces, queues, and additional
modules to reduce direct coupling.`,
      codeExample: {
        title: "Defining clear module responsibilities",
        code: `// auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const valid = await this.comparePassword(
      password,
      user.passwordHash,
    );

    if (!valid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private async comparePassword(
    password: string,
    passwordHash: string,
  ) {
    // Password comparison implementation.
    return password === passwordHash;
  }
}

// users/users.service.ts
@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    // User lookup belongs to Users.
    return {
      id: "user_123",
      email,
      passwordHash: "hashed-password",
    };
  }
}

// orders/orders.service.ts
@Injectable()
export class OrdersService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async createOrder(userId: string, productId: string) {
    const product =
      await this.productsService.findAvailableProduct(productId);

    if (!product) {
      throw new BadRequestException(
        "Product is unavailable",
      );
    }

    const order = {
      id: "order_123",
      userId,
      productId: product.id,
      amount: product.price,
    };

    await this.paymentsService.createPayment({
      orderId: order.id,
      amount: order.amount,
    });

    return order;
  }
}`,
      },
      keyTakeaways: [
        "Every module should have a clear responsibility.",
        "Ask which module owns a behavior before adding code.",
        "Auth owns authentication behavior, while users own user information.",
        "Products own catalog behavior, while orders own purchase behavior.",
        "Payments should isolate payment-provider complexity.",
        "Notifications should isolate email, SMS, and push-provider details.",
        "Avoid creating unnecessary circular dependencies between modules.",
        "Good boundaries reduce the amount of code that must change when requirements change.",
      ],
      commonMistakes: [
        "<b>Putting user logic inside AuthService.</b> Authentication may use users, but the complete user domain belongs to the users module.",
        "<b>Putting payment-provider code inside OrdersService.</b> Orders should not become tightly coupled to Stripe, PayPal, or another provider.",
        "<b>Allowing every module to directly access every repository.</b> This bypasses business boundaries and makes future changes harder.",
        "<b>Creating circular module dependencies everywhere.</b> Consider whether an event or abstraction would create a cleaner relationship.",
        "<b>Using folders as boundaries but ignoring code ownership.</b> A clean folder tree does not help if every service can modify every other domain directly.",
      ],
      quiz: [
        {
          question: "Which module should own password verification?",
          options: [
            "Products",
            "Orders",
            "Auth",
            "Notifications",
          ],
          correctIndex: 2,
          explanation: "Password verification is part of authentication.",
        },
        {
          question: "Which module should own product catalog behavior?",
          options: [
            "Products",
            "Payments",
            "Notifications",
            "Auth",
          ],
          correctIndex: 0,
          explanation: "The products module owns product catalog responsibilities.",
        },
        {
          question: "Why should payment-provider details be isolated?",
          options: [
            "To make payment behavior easier to replace and maintain",
            "Because NestJS cannot call external APIs",
            "Because orders cannot contain amounts",
            "To prevent using services",
          ],
          correctIndex: 0,
          explanation: "Isolating provider-specific behavior reduces coupling and makes payment integrations easier to change.",
        },
      ],
    },
    {
      id: "module-internal-structure",
      title: "Designing the Inside of Each Module",
      durationMinutes: 30,
      explanation: `Once the top-level modules are clear, the next question is:

<b>"What should live inside each module?"</b>

A useful starting point is:

\`module.ts\`
\`controller.ts\`
\`service.ts\`
\`dto/\`
\`entities/\`
\`repositories/\`

You do not have to create every folder on day one.

The structure should grow with the complexity of the module.

For example, a simple products module could begin with:

\`products/\`
\`├── products.controller.ts\`
\`├── products.service.ts\`
\`└── products.module.ts\`

As the application grows, it might become:

\`products/\`
\`├── controllers/\`
\`│   └── products.controller.ts\`
\`├── services/\`
\`│   └── products.service.ts\`
\`├── dto/\`
\`│   ├── create-product.dto.ts\`
\`│   └── update-product.dto.ts\`
\`├── entities/\`
\`│   └── product.entity.ts\`
\`├── repositories/\`
\`│   └── products.repository.ts\`
\`├── products.module.ts\`
\`└── products.service.spec.ts\`

<b>Controllers</b>

Controllers receive requests.

For example:

\`POST /products\`

The controller should not contain the entire business process.

It should validate or receive the request and delegate business work to a service.

<b>Services</b>

Services contain application/business behavior.

For example:

- Check whether a product already exists.
- Validate business rules.
- Calculate prices.
- Coordinate repositories.
- Call other application services.

<b>DTOs</b>

DTOs describe data entering or leaving an API boundary.

For example:

\`CreateProductDto\`

might contain:

\`name\`
\`price\`
\`description\`
\`sku\`

A DTO can be validated using NestJS validation pipes.

<b>Entities</b>

Entities represent persistence/domain structures depending on the persistence approach being used.

For example, with an ORM, a Product entity might describe fields stored in a database.

<b>Repositories</b>

A repository can isolate database access from business logic.

This is particularly useful when the persistence layer becomes complicated.

<b>Beginner real-world example:</b>

Think of a restaurant waiter.

The customer tells the waiter:

"I want a chicken sandwich."

The waiter does not personally cook the sandwich.

The waiter takes the request to the kitchen.

In NestJS:

Controller = waiter

Service = kitchen/business logic

Repository = storage/database interaction

The controller receives the request and delegates work instead of doing everything itself.

<b>Intermediate example:</b>

A product creation request arrives:

\`POST /products\`

The controller receives:

\`name = "Wireless Headphones"\`

\`price = 99.99\`

The service checks:

- Is the SKU unique?
- Is the price valid?
- Does the category exist?
- Is the product allowed to be created?

The repository then stores the product.

The controller returns the result.

<b>Advanced example:</b>

Suppose product creation later needs:

- Inventory creation
- Search indexing
- Audit logging
- Cache invalidation
- Notification to administrators

The controller should still not become a 500-line function.

The service can coordinate the workflow while specialized components handle individual concerns.

The important idea is <b>separation of responsibilities inside the module</b>.

Another important principle is that not every module needs exactly the same internal structure.

A tiny notifications module may only need:

\`notifications.service.ts\`

A complex payments module may need:

\`controllers/\`
\`services/\`
\`providers/\`
\`repositories/\`
\`webhooks/\`
\`dto/\`

Architecture should respond to complexity rather than creating unnecessary complexity in advance.`,
      diagram: `Inside a typical module

products/
|
+-- products.module.ts
|
+-- products.controller.ts
|       |
|       +--> HTTP request
|
+-- products.service.ts
|       |
|       +--> Business rules
|
+-- dto/
|       |
|       +--> Input validation
|
+-- entities/
|       |
|       +--> Domain/database representation
|
+-- repositories/
        |
        +--> Database access

HTTP
 |
 v
Controller
 |
 v
Service
 |
 v
Repository
 |
 v
Database`,
      codeExample: {
        title: "A structured Products module",
        code: `// products/dto/create-product.dto.ts
import { IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  sku!: string;
}

// products/products.controller.ts
@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }
}

// products/products.service.ts
@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}

  async create(dto: CreateProductDto) {
    const existing =
      await this.productsRepository.findBySku(dto.sku);

    if (existing) {
      throw new ConflictException(
        "A product with this SKU already exists",
      );
    }

    if (dto.price < 0) {
      throw new BadRequestException(
        "Product price cannot be negative",
      );
    }

    return this.productsRepository.create({
      name: dto.name,
      price: dto.price,
      sku: dto.sku,
    });
  }

  async findOne(id: string) {
    return this.productsRepository.findById(id);
  }
}

// products/repositories/products.repository.ts
@Injectable()
export class ProductsRepository {
  async findBySku(sku: string) {
    // Database lookup.
    return null;
  }

  async findById(id: string) {
    // Database lookup.
    return {
      id,
      name: "Wireless Headphones",
      price: 99.99,
      sku: "HEADPHONE-001",
    };
  }

  async create(data: {
    name: string;
    price: number;
    sku: string;
  }) {
    // Database insert.
    return {
      id: "product_123",
      ...data,
    };
  }
}

// products/products.module.ts
@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
  ],
  exports: [
    ProductsService,
  ],
})
export class ProductsModule {}`,
      },
      keyTakeaways: [
        "Controllers should focus on receiving and responding to requests.",
        "Services should contain application and business behavior.",
        "DTOs define and validate request data.",
        "Repositories can isolate database operations.",
        "Entities can represent persistence or domain structures depending on the architecture.",
        "Not every module needs every possible folder.",
        "A module should become more detailed as its responsibilities become more complex.",
        "Avoid putting business rules directly inside controllers.",
      ],
      commonMistakes: [
        "<b>Putting database queries directly inside controllers.</b> This makes controllers difficult to test and maintain.",
        "<b>Putting all business rules in DTOs.</b> DTOs validate input shape; business behavior generally belongs in services or domain logic.",
        "<b>Creating repositories for every tiny operation without a reason.</b> Abstraction should solve a real problem rather than add ceremony.",
        "<b>Making services contain everything.</b> Complex services can be split into focused collaborators when their responsibilities become too large.",
        "<b>Creating identical internal structures for every module.</b> A simple module does not need the same complexity as payments.",
      ],
      quiz: [
        {
          question: "What should a controller primarily do?",
          options: [
            "Contain every business rule",
            "Receive requests and delegate work",
            "Manage database migrations",
            "Send every email directly",
          ],
          correctIndex: 1,
          explanation: "Controllers should handle the HTTP boundary and delegate application work to appropriate services.",
        },
        {
          question: "What is a DTO commonly used for?",
          options: [
            "Defining and validating incoming data",
            "Starting the NestJS application",
            "Creating database connections automatically",
            "Replacing all services",
          ],
          correctIndex: 0,
          explanation: "DTOs describe the expected shape of data crossing an application boundary and can be validated.",
        },
        {
          question: "Why might a repository be useful?",
          options: [
            "To isolate database access",
            "To replace controllers",
            "To handle HTTP routes",
            "To render HTML",
          ],
          correctIndex: 0,
          explanation: "Repositories can isolate persistence operations from business logic.",
        },
      ],
    },
    {
      id: "cross-module-communication-and-advanced-architecture",
      title: "Cross-Module Communication, Events, and Advanced Architecture",
      durationMinutes: 35,
      explanation: `The basic architecture becomes much more interesting when modules need to communicate.

Suppose a customer places an order.

Several things may need to happen:

1. The order must be created.
2. The payment must be processed.
3. Inventory may need to be reduced.
4. An email confirmation should be sent.
5. An analytics event may need to be recorded.
6. An audit record may need to be created.

A beginner implementation might call everything directly:

\`OrdersService\`
→ \`PaymentsService\`
→ \`InventoryService\`
→ \`NotificationsService\`
→ \`AnalyticsService\`
→ \`AuditService\`

This can work.

However, as the application grows, direct dependencies can become difficult to manage.

For example:

\`OrdersService\`

could eventually depend on ten different services.

That means a simple order operation becomes connected to a large part of the application.

One way to reduce this coupling is to use <b>events</b>.

For example:

\`order.created\`

The orders module publishes the event.

Other parts of the application can react to it.

Notifications might send an email.

Analytics might record the purchase.

Audit logging might create an audit record.

This allows the order module to communicate an important business fact without knowing every consumer.

<b>Beginner real-world example:</b>

Imagine a school bell.

When the bell rings, the teacher does not personally walk to every classroom and tell students that class has started.

The bell broadcasts a signal.

Different people react to the same event.

Software events work similarly.

<b>Intermediate real-world example:</b>

When an order is created:

\`order.created\`

Notifications listens and sends an email.

Analytics listens and records the event.

Inventory listens and updates stock.

The order module does not need to know all of these implementation details.

<b>Advanced real-world example:</b>

A production e-commerce platform may use a message broker such as RabbitMQ, Kafka, SQS, or another infrastructure system.

The flow could become:

Order Service
→ Event
→ Message Broker
→ Inventory Consumer
→ Notification Consumer
→ Analytics Consumer

Now individual operations can scale independently.

For example, if sending emails becomes slow, the email consumer can process messages separately instead of slowing down order creation.

This is where architecture moves beyond simple NestJS modules and into distributed-system design.

<b>Dependency Injection and module exports</b>

NestJS uses dependency injection to allow one class to use another class without manually constructing it.

For example:

\`OrdersService\`

may need:

\`PaymentsService\`

The payments module can export the service.

The orders module can import the payments module.

This creates an explicit dependency.

Example:

\`PaymentsModule\`

exports:

\`PaymentsService\`

\`OrdersModule\`

imports:

\`PaymentsModule\`

Now NestJS can inject the payment service.

<b>Why exports matter</b>

A provider is not automatically available to every module.

The module that owns the provider controls what it exposes.

This is useful because it creates an API-like boundary between modules.

For example:

The payments module may internally have:

\`StripeClient\`
\`PaymentRepository\`
\`PaymentWebhookVerifier\`
\`PaymentService\`

But it may export only:

\`PaymentService\`

The orders module does not need direct access to the internal Stripe client.

That is a powerful architectural concept.

<b>Advanced provider abstraction</b>

Suppose your application currently uses Stripe.

Instead of allowing OrdersService to depend directly on Stripe-specific code, define a payment abstraction.

Conceptually:

\`PaymentGateway\`

Then implement:

\`StripePaymentGateway\`

Later you could add:

\`PayPalPaymentGateway\`

or:

\`AdyenPaymentGateway\`

The order workflow can depend on the abstraction rather than a specific provider.

This makes provider replacement easier and improves testing.

<b>Testing becomes easier too</b>

Suppose OrdersService directly creates a Stripe SDK client.

Testing the order process may require complex payment setup.

Instead, if OrdersService depends on a payment interface, the test can provide a fake implementation.

For example:

\`FakePaymentGateway\`

can simply return:

\`paymentSucceeded = true\`

The order logic can then be tested without contacting a real payment provider.

<b>Architecture is about controlling change</b>

This is one of the most important ideas in the entire project.

Ask:

"If this requirement changes tomorrow, how much of my application will I have to modify?"

Suppose the business says:

"We are replacing our email provider."

A clean architecture should allow you to make the change primarily inside notifications.

Suppose the business says:

"We are adding another payment provider."

The payment integration should primarily change inside payments.

Suppose the business says:

"We are adding product reviews."

You should be able to add review functionality without turning OrdersService into a giant service.

Good architecture does not mean that changes never require multiple files.

It means the impact of change is <b>controlled and understandable</b>.

<b>Advanced project structure</b>

As ShopSphere grows, the structure might evolve into:

\`src/\`
\`├── auth/\`
\`│   ├── controllers/\`
\`│   ├── services/\`
\`│   ├── guards/\`
\`│   ├── strategies/\`
\`│   ├── dto/\`
\`│   └── auth.module.ts\`
\`│\`
\`├── users/\`
\`│   ├── controllers/\`
\`│   ├── services/\`
\`│   ├── repositories/\`
\`│   ├── entities/\`
\`│   ├── dto/\`
\`│   └── users.module.ts\`
\`│\`
\`├── products/\`
\`│   ├── controllers/\`
\`│   ├── services/\`
\`│   ├── repositories/\`
\`│   ├── entities/\`
\`│   ├── dto/\`
\`│   └── products.module.ts\`
\`│\`
\`├── orders/\`
\`│   ├── controllers/\`
\`│   ├── services/\`
\`│   ├── repositories/\`
\`│   ├── entities/\`
\`│   ├── dto/\`
\`│   ├── events/\`
\`│   └── orders.module.ts\`
\`│\`
\`├── payments/\`
\`│   ├── controllers/\`
\`│   ├── services/\`
\`│   ├── gateways/\`
\`│   ├── webhooks/\`
\`│   ├── repositories/\`
\`│   └── payments.module.ts\`
\`│\`
\`├── notifications/\`
\`│   ├── services/\`
\`│   ├── providers/\`
\`│   ├── templates/\`
\`│   └── notifications.module.ts\`
\`│\`
\`├── common/\`
\`│   ├── decorators/\`
\`│   ├── filters/\`
\`│   ├── guards/\`
\`│   ├── interceptors/\`
\`│   └── pipes/\`
\`│\`
\`├── config/\`
\`├── database/\`
\`└── main.ts\`

This is an example of how a project can evolve.

Do not copy this structure blindly.

A small application may need much less.

The important skill is knowing <b>why</b> a boundary exists and when additional structure solves a real problem.`,
      diagram: `Direct communication

OrdersService
     |
     +--> PaymentsService
     |
     +--> NotificationsService
     |
     +--> InventoryService
     |
     +--> AnalyticsService


Event-driven communication

OrdersService
     |
     | publishes
     v
 order.created
     |
     +-----------> Payments
     |
     +-----------> Notifications
     |
     +-----------> Inventory
     |
     +-----------> Analytics

The event-driven model can reduce
direct coupling between modules.`,
      codeExample: {
        title: "Module exports and event-driven communication",
        code: `// payments/payments.service.ts
@Injectable()
export class PaymentsService {
  async createPayment(data: {
    orderId: string;
    amount: number;
  }) {
    // Payment provider integration.
    return {
      id: "payment_123",
      orderId: data.orderId,
      amount: data.amount,
      status: "succeeded",
    };
  }
}

// payments/payments.module.ts
@Module({
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}


// orders/orders.module.ts
@Module({
  imports: [PaymentsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}


// orders/orders.service.ts
@Injectable()
export class OrdersService {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createOrder(userId: string, amount: number) {
    const order = {
      id: "order_123",
      userId,
      amount,
      status: "PENDING_PAYMENT",
    };

    const payment =
      await this.paymentsService.createPayment({
        orderId: order.id,
        amount,
      });

    if (payment.status === "succeeded") {
      order.status = "PAID";

      this.eventEmitter.emit("order.paid", {
        orderId: order.id,
        userId: order.userId,
        amount: order.amount,
      });
    }

    return order;
  }
}


// notifications/notifications.listener.ts
@Injectable()
export class NotificationsListener {
  @OnEvent("order.paid")
  async handleOrderPaid(event: {
    orderId: string;
    userId: string;
    amount: number;
  }) {
    await this.sendOrderConfirmationEmail(event);
  }

  private async sendOrderConfirmationEmail(event: {
    orderId: string;
    userId: string;
    amount: number;
  }) {
    // Send email through an email provider.
  }
}


// notifications/notifications.module.ts
@Module({
  providers: [
    NotificationsListener,
  ],
})
export class NotificationsModule {}`,
      },
      keyTakeaways: [
        "Modules communicate through explicit dependencies, exported providers, abstractions, or events.",
        "A module should expose only what other modules actually need.",
        "Module exports create an intentional public boundary.",
        "Events can reduce direct coupling between business areas.",
        "Payment integrations are good candidates for provider abstractions.",
        "Abstractions make external integrations easier to replace and mock during tests.",
        "A growing application may eventually use queues or message brokers for asynchronous work.",
        "Good architecture controls how far a change spreads through the application.",
        "Do not introduce advanced architecture merely because it sounds sophisticated; use it when the application's complexity justifies it.",
      ],
      commonMistakes: [
        "<b>Exporting every provider.</b> Export only providers that other modules genuinely need.",
        "<b>Making every module directly dependent on every other module.</b> This creates a tightly coupled application.",
        "<b>Using events for everything.</b> Events are useful, but unnecessary asynchronous communication can make simple workflows harder to understand.",
        "<b>Depending directly on third-party SDKs everywhere.</b> Isolate provider-specific code behind a focused service or abstraction.",
        "<b>Introducing Kafka, RabbitMQ, or microservices too early.</b> Distributed infrastructure adds operational complexity and should solve a real scaling or reliability problem.",
        "<b>Confusing folder structure with architecture.</b> A beautifully organized folder tree can still contain tightly coupled business logic.",
      ],
      quiz: [
        {
          question: "What does a module export allow?",
          options: [
            "It makes selected providers available to importing modules",
            "It automatically exports every file in the folder",
            "It disables dependency injection",
            "It creates a database table",
          ],
          correctIndex: 0,
          explanation: "A NestJS module can export providers that importing modules are allowed to use.",
        },
        {
          question: "Why can events reduce coupling?",
          options: [
            "The publisher does not need to know every consumer implementation",
            "Events remove all business logic",
            "Events prevent database access",
            "Events replace TypeScript",
          ],
          correctIndex: 0,
          explanation: "A publisher can announce a business event while multiple consumers independently react to it.",
        },
        {
          question: "Why might a payment abstraction be useful?",
          options: [
            "It can isolate the application from a specific payment provider",
            "It removes the need for payment processing",
            "It prevents testing",
            "It forces every provider to use the same SDK",
          ],
          correctIndex: 0,
          explanation: "An abstraction can allow the application to work with different payment implementations without spreading provider-specific details throughout the codebase.",
        },
      ],
    },
    {
      id: "complete-architecture-project",
      title: "Complete ShopSphere Architecture — Basic to Production-Oriented",
      durationMinutes: 30,
      explanation: `Now we can put the architecture together into one realistic NestJS application.

The project is <b>ShopSphere</b>, an e-commerce backend.

A customer can:

- Register an account.
- Log in.
- Browse products.
- Place an order.
- Pay for the order.
- Receive an email confirmation.

The first version should remain simple.

Do not start by building a distributed microservice system.

Start with a modular monolith.

<b>What is a modular monolith?</b>

It is one deployable NestJS application with clearly separated internal modules.

For ShopSphere:

\`src/\`
\`├── auth/\`
\`├── users/\`
\`├── products/\`
\`├── orders/\`
\`├── payments/\`
\`└── notifications/\`

Everything runs inside one NestJS application, but responsibilities are separated.

This is an excellent architecture for many applications because it provides clear boundaries without immediately introducing the operational complexity of multiple services.

<b>Beginner implementation</b>

Start with six modules.

Each module gets:

- A module file.
- A controller when HTTP endpoints are required.
- A service.
- DTOs when request validation is required.

For example:

\`products/products.module.ts\`

owns the products area.

\`orders/orders.module.ts\`

owns the orders area.

<b>Intermediate implementation</b>

Add:

- Repositories
- Database entities
- Authentication guards
- DTO validation
- Error handling
- Module exports
- Explicit module dependencies

Now the application has meaningful internal boundaries.

<b>Advanced implementation</b>

Add:

- Payment gateway abstraction
- Webhook processing
- Domain/application events
- Background notification jobs
- Idempotency for payments
- Transaction boundaries
- Audit logging
- Structured logging
- Caching
- Observability
- Retry handling

At this point, the application starts resembling a production system.

<b>Real-world order flow</b>

A customer sends:

\`POST /orders\`

The request contains product information.

The orders controller receives it.

The OrdersService begins the business workflow.

The products module confirms that the products exist and can be purchased.

The order is created with a pending payment status.

The payments module creates a payment.

The payment provider processes the payment.

The payment result is recorded.

If payment succeeds, the order becomes paid.

The application emits:

\`order.paid\`

The notifications module receives the event and sends an order confirmation.

The analytics system can independently record the purchase.

The audit system can independently record that the order became paid.

Notice how the architecture lets one business action involve multiple areas without requiring one giant service.

<b>Failure scenario</b>

Now imagine payment fails.

The payment module reports:

\`payment.failed\`

The order should not become paid.

The order may remain:

\`PENDING_PAYMENT\`

or become:

\`PAYMENT_FAILED\`

The notification system might send:

"Your payment could not be completed."

This is much easier to reason about when each responsibility has a clear owner.

<b>Another real-world scenario: refund</b>

A customer requests a refund.

The request enters the orders or payments workflow depending on the business design.

The payments module communicates with the payment provider.

If the provider confirms the refund, the payment status changes.

The order status can then be updated.

A notification can be sent.

Again, payment-provider details stay inside the payments boundary.

<b>Another real-world scenario: replacing the email provider</b>

Suppose ShopSphere initially uses one email provider.

Six months later, the company changes providers.

If email provider calls are spread throughout OrdersService, UsersService, PaymentsService, and AuthService, the migration becomes painful.

If those calls are isolated inside NotificationsService or a notification provider abstraction, the migration can be localized.

<b>Another real-world scenario: adding SMS</b>

The business now wants:

- Email confirmation
- SMS confirmation
- Push notification

The order system should not become responsible for all three.

It can emit:

\`order.paid\`

The notification system can determine which channels should be used.

This keeps the order process focused on orders.

<b>Another real-world scenario: traffic growth</b>

Suppose the application receives 100 orders per hour.

Later it receives 10,000 orders per hour.

You may discover that email sending is slowing down order processing.

Instead of turning the entire application into microservices immediately, you could move notification delivery to a queue.

The order process publishes a notification job.

A worker processes the job separately.

This is an architectural evolution rather than a complete rewrite.

<b>Another real-world scenario: payment retries</b>

Payment systems can fail because of:

- Network problems
- Provider downtime
- Timeouts
- Duplicate requests
- Temporary service errors

A production payment flow should think about idempotency.

If the customer clicks "Pay" twice, you should not accidentally charge the customer twice.

An idempotency key can help the payment system recognize that two requests represent the same operation.

This is an example of why architecture is not just about folders.

The folder structure creates boundaries, but production architecture also requires careful business rules and failure handling.

<b>The final principle</b>

Do not design architecture by asking:

"How many folders can I create?"

Design architecture by asking:

- Who owns this behavior?
- Who is allowed to modify this data?
- Which module needs this capability?
- What should this module expose?
- What should remain internal?
- What happens when the external provider fails?
- What happens when the same request arrives twice?
- What happens when a dependency becomes unavailable?
- Can this feature be tested without external infrastructure?
- If this requirement changes, how many unrelated parts of the system must change?

These questions lead to architecture that is useful in the real world.`,
      diagram: `                    ShopSphere
                        |
        +---------------+---------------+
        |               |               |
       Auth            Users          Products
        |               |               |
        +---------------+---------------+
                        |
                      Orders
                        |
              +---------+---------+
              |                   |
          Payments          Notifications
              |
        External Provider


Typical business flow:

Client
  |
  v
OrdersController
  |
  v
OrdersService
  |
  +----> ProductsService
  |
  +----> PaymentsService
  |
  +----> Order Repository
  |
  +----> "order.paid"
                 |
                 +----> Notifications
                 |
                 +----> Analytics
                 |
                 +----> Audit


The application remains one deployable
NestJS application while internal
responsibilities stay separated.`,
      codeExample: {
        title: "Complete application module composition",
        code: `// src/app.module.ts

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    NotificationsModule,
  ],
})
export class AppModule {}


// src/orders/orders.module.ts

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    PaymentsModule,
  ],
  controllers: [
    OrdersController,
  ],
  providers: [
    OrdersService,
    OrdersRepository,
  ],
  exports: [
    OrdersService,
  ],
})
export class OrdersModule {}


// src/payments/payments.module.ts

@Module({
  imports: [],
  controllers: [
    PaymentsController,
  ],
  providers: [
    PaymentsService,
    PaymentsRepository,
    StripePaymentGateway,
  ],
  exports: [
    PaymentsService,
  ],
})
export class PaymentsModule {}


// src/notifications/notifications.module.ts

@Module({
  imports: [],
  providers: [
    NotificationsService,
    EmailNotificationProvider,
    SmsNotificationProvider,
  ],
  exports: [
    NotificationsService,
  ],
})
export class NotificationsModule {}


// src/orders/orders.service.ts

@Injectable()
export class OrdersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentsService,
    private readonly ordersRepository: OrdersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createOrder(
    userId: string,
    productId: string,
    quantity: number,
  ) {
    const user =
      await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(
        "User not found",
      );
    }

    const product =
      await this.productsService.findAvailableProduct(
        productId,
      );

    if (!product) {
      throw new NotFoundException(
        "Product is unavailable",
      );
    }

    if (quantity <= 0) {
      throw new BadRequestException(
        "Quantity must be greater than zero",
      );
    }

    const total =
      product.price * quantity;

    const order =
      await this.ordersRepository.create({
        userId,
        productId,
        quantity,
        total,
        status: "PENDING_PAYMENT",
      });

    const payment =
      await this.paymentsService.createPayment({
        orderId: order.id,
        amount: total,
      });

    if (payment.status === "succeeded") {
      const paidOrder =
        await this.ordersRepository.updateStatus(
          order.id,
          "PAID",
        );

      this.eventEmitter.emit("order.paid", {
        orderId: order.id,
        userId,
        amount: total,
      });

      return paidOrder;
    }

    await this.ordersRepository.updateStatus(
      order.id,
      "PAYMENT_FAILED",
    );

    return this.ordersRepository.findById(
      order.id,
    );
  }
}


// Example final directory structure

src/
├── auth/
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   └── auth.module.ts
│
├── users/
│   ├── controllers/
│   │   └── users.controller.ts
│   ├── services/
│   │   └── users.service.ts
│   ├── repositories/
│   │   └── users.repository.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── users.module.ts
│
├── products/
│   ├── controllers/
│   │   └── products.controller.ts
│   ├── services/
│   │   └── products.service.ts
│   ├── repositories/
│   │   └── products.repository.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   └── products.module.ts
│
├── orders/
│   ├── controllers/
│   │   └── orders.controller.ts
│   ├── services/
│   │   └── orders.service.ts
│   ├── repositories/
│   │   └── orders.repository.ts
│   ├── entities/
│   │   └── order.entity.ts
│   ├── events/
│   │   └── order-paid.event.ts
│   ├── dto/
│   │   └── create-order.dto.ts
│   └── orders.module.ts
│
├── payments/
│   ├── controllers/
│   │   └── payments.controller.ts
│   ├── services/
│   │   └── payments.service.ts
│   ├── gateways/
│   │   ├── payment-gateway.interface.ts
│   │   └── stripe-payment.gateway.ts
│   ├── webhooks/
│   │   └── stripe-webhook.controller.ts
│   ├── repositories/
│   │   └── payments.repository.ts
│   └── payments.module.ts
│
├── notifications/
│   ├── services/
│   │   └── notifications.service.ts
│   ├── providers/
│   │   ├── email.provider.ts
│   │   └── sms.provider.ts
│   ├── templates/
│   │   ├── order-confirmation.template.ts
│   │   └── password-reset.template.ts
│   └── notifications.module.ts
│
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
│
├── config/
├── database/
├── app.module.ts
└── main.ts`,
      },
      keyTakeaways: [
        "A modular monolith is a strong starting architecture for a real NestJS application.",
        "The six business modules form clear boundaries around authentication, users, products, orders, payments, and notifications.",
        "Controllers should handle the HTTP boundary rather than becoming giant business-logic containers.",
        "Services coordinate application behavior and business rules.",
        "Repositories can isolate persistence concerns when the application benefits from that separation.",
        "Modules should expose only the providers that other modules genuinely need.",
        "External integrations should be isolated behind focused providers or abstractions.",
        "Events can allow multiple parts of the application to react to important business events without creating unnecessary direct dependencies.",
        "Production architecture must consider failures, retries, idempotency, external dependencies, testing, and observability.",
        "Architecture should evolve as the application grows instead of introducing maximum complexity on the first day.",
        "The most useful architecture question is which component should own a responsibility.",
      ],
      commonMistakes: [
        "<b>Building microservices before understanding the domain.</b> Start with a modular monolith unless there is a concrete reason for distributed services.",
        "<b>Putting business logic in controllers.</b> Controllers should remain focused on the transport layer.",
        "<b>Making OrdersService responsible for payments, email, inventory, and analytics implementation details.</b> Let each responsibility have an appropriate owner.",
        "<b>Exporting everything from every module.</b> Exports should represent the module's intentional public API.",
        "<b>Letting external SDKs leak everywhere.</b> Keep provider-specific implementation behind focused services or gateway abstractions.",
        "<b>Ignoring failure scenarios.</b> Production systems must handle timeouts, retries, duplicate requests, provider failures, and partial failures.",
        "<b>Ignoring idempotency in payment flows.</b> Retried requests must not accidentally perform the same financial operation multiple times.",
        "<b>Creating architecture only for appearance.</b> Every abstraction, module, event, or repository should solve a real maintainability, business, testing, or scaling problem.",
      ],
      quiz: [
        {
          question: "What is a modular monolith?",
          options: [
            "A single application with clearly separated internal modules",
            "A collection of unrelated databases",
            "A frontend-only application",
            "A system where every module runs on a different server",
          ],
          correctIndex: 0,
          explanation: "A modular monolith is typically one deployable application whose internal responsibilities are separated into clear modules.",
        },
        {
          question: "Where should provider-specific Stripe implementation normally live?",
          options: [
            "Every controller",
            "The payment integration/gateway area",
            "The users entity",
            "main.ts",
          ],
          correctIndex: 1,
          explanation: "Provider-specific payment implementation should be isolated inside the payments boundary.",
        },
        {
          question: "Why is idempotency important in payment systems?",
          options: [
            "It can prevent repeated requests from accidentally causing duplicate financial operations",
            "It makes passwords shorter",
            "It removes authentication",
            "It replaces database transactions in every situation",
          ],
          correctIndex: 0,
          explanation: "Payment requests can be retried because of network failures or user actions, so the system needs protection against duplicate operations.",
        },
        {
          question: "What should happen when an email provider changes?",
          options: [
            "Every order controller should be rewritten",
            "The notification boundary should isolate most of the provider-specific change",
            "The database should be deleted",
            "The payment module should own email delivery",
          ],
          correctIndex: 1,
          explanation: "A well-separated notification architecture localizes changes related to email providers.",
        },
        {
          question: "Why can events be useful for an order-paid operation?",
          options: [
            "Multiple parts of the system can react without the order service knowing every implementation",
            "Events eliminate the need for business rules",
            "Events make every operation synchronous",
            "Events prevent database access",
          ],
          correctIndex: 0,
          explanation: "An event such as order.paid allows notifications, analytics, auditing, or other consumers to react independently.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which module should primarily own authentication and login behavior?",
      options: [
        "Products",
        "Orders",
        "Auth",
        "Notifications",
      ],
      correctIndex: 2,
      explanation: "Authentication concerns such as login, credential verification, tokens, and access control belong in the auth boundary.",
    },
    {
      question: "Which module should own the product catalog?",
      options: [
        "Payments",
        "Products",
        "Notifications",
        "Auth",
      ],
      correctIndex: 1,
      explanation: "Product creation, updates, catalog information, pricing, and availability belong to the products module.",
    },
    {
      question: "Which module should own payment-provider integration?",
      options: [
        "Users",
        "Products",
        "Payments",
        "Notifications",
      ],
      correctIndex: 2,
      explanation: "Payment processing and external payment-provider integrations belong inside the payments boundary.",
    },
    {
      question: "What is the main responsibility of a NestJS controller?",
      options: [
        "Contain the entire business workflow",
        "Receive requests and delegate application work",
        "Manage every database query",
        "Replace all services",
      ],
      correctIndex: 1,
      explanation: "Controllers primarily handle the transport boundary and delegate business/application work to services.",
    },
    {
      question: "Why are DTOs useful?",
      options: [
        "They describe and validate data crossing an application boundary",
        "They automatically create servers",
        "They replace database tables",
        "They eliminate dependency injection",
      ],
      correctIndex: 0,
      explanation: "DTOs provide a clear shape for incoming data and can be validated using NestJS validation tools.",
    },
    {
      question: "What is one benefit of a repository?",
      options: [
        "It can isolate persistence operations from business logic",
        "It replaces the application module",
        "It prevents services from existing",
        "It automatically creates API documentation",
      ],
      correctIndex: 0,
      explanation: "Repositories can provide a focused boundary around database operations.",
    },
    {
      question: "What does exporting a provider from a NestJS module accomplish?",
      options: [
        "It makes the selected provider available to importing modules",
        "It makes every file globally available",
        "It disables dependency injection",
        "It creates a new controller automatically",
      ],
      correctIndex: 0,
      explanation: "A module can export providers that importing modules are allowed to inject.",
    },
    {
      question: "Why should modules avoid unnecessary direct dependencies on every other module?",
      options: [
        "To reduce coupling and keep responsibilities understandable",
        "Because NestJS only supports one module",
        "Because services cannot call other services",
        "To prevent TypeScript compilation",
      ],
      correctIndex: 0,
      explanation: "Excessive dependencies create tightly coupled systems that become harder to change and test.",
    },
    {
      question: "What is a useful reason to introduce application events?",
      options: [
        "To allow multiple consumers to react to an important business event",
        "To remove all business logic",
        "To avoid using modules",
        "To replace every database query",
      ],
      correctIndex: 0,
      explanation: "Events can allow other parts of the system to react without forcing the publisher to directly depend on every consumer.",
    },
    {
      question: "Why should payment-provider-specific code be isolated?",
      options: [
        "It reduces coupling to a specific external provider",
        "It prevents payments from being processed",
        "It makes authentication unnecessary",
        "It removes the need for testing",
      ],
      correctIndex: 0,
      explanation: "Isolation makes provider changes, testing, and payment-related maintenance easier.",
    },
    {
      question: "What is a modular monolith?",
      options: [
        "One deployable application with clear internal module boundaries",
        "Many unrelated applications with no shared architecture",
        "A frontend-only application",
        "A database without an API",
      ],
      correctIndex: 0,
      explanation: "A modular monolith keeps the application as one deployable system while maintaining clear internal business boundaries.",
    },
    {
      question: "Why is idempotency especially important for payment operations?",
      options: [
        "Payment requests can be retried and should not accidentally create duplicate charges",
        "It allows users to have multiple passwords",
        "It removes the need for authentication",
        "It replaces every database transaction",
      ],
      correctIndex: 0,
      explanation: "Network retries, timeouts, and repeated user actions can cause the same request to arrive more than once, so payment operations need duplicate-protection mechanisms.",
    },
  ],
  project: {
    name: "ShopSphere — Clean NestJS E-Commerce Architecture",
    goal: "Design and implement a modular NestJS e-commerce backend with clear boundaries between authentication, users, products, orders, payments, and notifications.",
    brief: "Build a realistic NestJS application as a modular monolith. The application should allow users to register and authenticate, browse products, create orders, process payments, and receive notifications. Organize the application so that each business responsibility has a clear owner and external integrations do not leak throughout the codebase.",
    steps: [
      "Create a new NestJS application.",
      "Create the auth module for registration, login, password verification, access tokens, and authentication guards.",
      "Create the users module for customer profiles and user-related data.",
      "Create the products module for product creation, product lookup, pricing, and availability.",
      "Create the orders module for creating orders, calculating order totals, tracking order status, and retrieving order history.",
      "Create the payments module for payment creation, payment status, refunds, and payment-provider integration.",
      "Create the notifications module for email and other customer notifications.",
      "Create controllers only for responsibilities that require HTTP endpoints.",
      "Create services for application and business behavior.",
      "Create DTOs for incoming request data.",
      "Add validation to the DTOs.",
      "Create repositories when database access needs to be isolated from business logic.",
      "Configure module imports and exports so that dependencies are explicit.",
      "Ensure that modules expose only the providers other modules genuinely need.",
      "Create a payment abstraction so that OrdersService does not depend directly on a payment-provider SDK.",
      "Implement an order creation workflow that validates the user and product before creating the order.",
      "Create a payment for the order through the payments boundary.",
      "Update the order status after a successful payment.",
      "Publish an order-paid event after payment succeeds.",
      "Create a notification listener that reacts to the order-paid event.",
      "Add handling for payment failures.",
      "Add appropriate exceptions for missing users, missing products, invalid quantities, duplicate product SKUs, and invalid order states.",
      "Think about what happens when the payment provider times out.",
      "Think about what happens when the same payment request is sent twice.",
      "Add idempotency protection to the payment workflow.",
      "Add logging around important business operations.",
      "Add unit tests for the main services.",
      "Mock external payment and notification providers during tests.",
      "Keep provider-specific implementation isolated inside the appropriate module.",
      "Review every module and identify what it owns and what it exposes.",
      "Review dependencies and identify unnecessary circular relationships.",
      "Keep the application as a modular monolith before considering distributed infrastructure.",
    ],
    acceptance: [
      "The project contains auth, users, products, orders, payments, and notifications modules.",
      "Each module has a clearly defined business responsibility.",
      "Controllers do not contain large business workflows.",
      "Business behavior is implemented in services or focused collaborators.",
      "Incoming request data is represented using DTOs.",
      "DTOs are validated.",
      "Database access is not unnecessarily scattered throughout controllers.",
      "The payments module isolates payment-provider-specific implementation.",
      "The notifications module owns notification-provider behavior.",
      "The orders module owns order lifecycle behavior.",
      "The products module owns product catalog behavior.",
      "The users module owns user-related data and behavior.",
      "The auth module owns authentication behavior.",
      "Modules use explicit imports and exports.",
      "Only intentionally shared providers are exported.",
      "The order workflow can communicate a successful payment without directly implementing notification delivery.",
      "Payment failure is handled without incorrectly marking an order as paid.",
      "The application considers duplicate payment requests.",
      "External providers can be mocked during testing.",
      "The architecture can be understood by a developer who did not originally write the project.",
    ],
    stretch: [
      "Add an InventoryModule and decide whether inventory should be called directly or updated through an event.",
      "Add an AdminModule for administrative product and order management.",
      "Add product categories and category-specific business rules.",
      "Add a shopping cart module and decide whether carts should remain separate from orders.",
      "Add an order cancellation workflow.",
      "Add a refund workflow with payment-provider abstraction.",
      "Add payment webhooks and verify webhook signatures.",
      "Implement an idempotency-key mechanism for payment requests.",
      "Move notification delivery to a background queue.",
      "Add retry handling for temporary notification-provider failures.",
      "Add an audit-log module that reacts to important business events.",
      "Add structured logging with correlation IDs.",
      "Add caching for frequently requested product information.",
      "Add database transactions where multiple related records must change atomically.",
      "Create integration tests for the order-to-payment workflow.",
      "Create fake payment and notification providers for unit tests.",
      "Add a second payment provider implementation and switch between providers using configuration.",
      "Draw the dependency graph of the application and identify potential circular dependencies.",
      "Document the public API of every module and identify which providers are intentionally exported.",
      "Evaluate which parts of the application could eventually become independent services if traffic or organizational requirements justify that change.",
    ],
  },
};
