import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_35_LESSONS: LessonDay = {
  day: 35,
  title: "Persistence Architecture",
  totalMinutes: 125,
  difficulty: "Advanced",
  lessons: [
    {
      id: "active-record-pattern",
      title: "Active Record pattern",
      durationMinutes: 22,
      explanation: `The <b>Active Record</b> pattern puts database-related behavior directly on the object that represents the database record.

A simple way to think about Active Record is:

<b>"The object knows how to save itself, find itself, update itself, and delete itself."</b>

Imagine that you have a \`User\` object representing a row in a \`users\` table.

With an Active Record style API, you might write something conceptually similar to:

\`\`\`ts
const user = new User();
user.email = "alice@example.com";
await user.save();
\`\`\`

The \`User\` object is not only carrying user data. It also knows how to communicate with the database.

For a beginner, this can feel very natural because the code resembles the real-world object:

"Here is a user. Save this user."

The problem becomes more interesting as the application grows.

A small application may have only a few database operations. A production application may contain business rules involving users, orders, payments, inventory, subscriptions, refunds, notifications, and auditing.

If all of those database operations and business rules are placed directly inside entities, the entities can become very large and difficult to maintain.

<b>Beginner real-world example:</b>

Imagine a small blogging application.

You have a \`Post\` model:

\`\`\`ts
const post = new Post();

post.title = "Learning NestJS";
post.content = "Today I learned about persistence architecture.";

await post.save();
\`\`\`

The model represents the post and also performs persistence.

Reading a post might look like:

\`\`\`ts
const post = await Post.findOneBy({
  id: postId,
});
\`\`\`

Updating it might look like:

\`\`\`post.title = "Learning NestJS Persistence";
await post.save();
\`\`\`

Deleting it might look like:

\`\`\`ts
await post.remove();
\`\`\`

This is convenient because there is very little separation between the object and the database.

<b>Intermediate real-world example:</b>

Suppose you are building an e-commerce application.

An \`Order\` object might have methods such as:

\`\`\`ts
order.addItem(product, quantity);
order.calculateTotal();
order.markAsPaid();
await order.save();
\`\`\`

This can work well for a small domain.

However, consider what happens when \`markAsPaid()\` must also:

- create a payment record,
- update inventory,
- create an invoice,
- send an event,
- record an audit entry,
- update customer statistics.

If the entity directly performs all of these operations, the entity can become tightly coupled to many infrastructure concerns.

<b>Advanced real-world example:</b>

Imagine a large marketplace where an order payment triggers several pieces of infrastructure.

A naive Active Record design could eventually result in an entity that knows about:

- PostgreSQL,
- payment providers,
- inventory repositories,
- notification services,
- event publishing,
- audit logging,
- shipping systems.

That makes the entity difficult to test and difficult to reuse.

This does not mean Active Record is bad.

It means the pattern has a natural boundary.

Active Record is often attractive when:

- the application is relatively simple,
- CRUD operations dominate,
- the domain model is not extremely complex,
- the team values development speed,
- the ORM already provides a good Active Record API.

It becomes less comfortable when the application has complicated domain rules and many external dependencies.

<b>NestJS perspective:</b>

NestJS itself does not force you to use Active Record.

You can use an ORM that supports an Active Record style, or you can implement a more separated architecture.

The important skill is understanding the tradeoff rather than memorizing that one pattern is always correct.

<b>Why beginners like Active Record:</b>

The code is easy to understand:

\`\`\`
Object
  |
  +--> save()
  +--> update()
  +--> delete()
  +--> find()
\`\`\`

The object feels like it owns its persistence.

<b>Why large systems may avoid putting everything there:</b>

\`\`\`
Order Entity
    |
    +--> Database
    +--> Payment API
    +--> Inventory
    +--> Email
    +--> Events
    +--> Audit logs
\`\`\`

Now one object knows too much.

A useful rule is:

<b>Active Record is convenient when persistence and the domain model can comfortably live together. As business complexity grows, consider stronger separation.</b>`,
      diagram: `ACTIVE RECORD

Application
    |
    v
User object
    |
    +--> properties
    |
    +--> save()
    +--> update()
    +--> delete()
    +--> find()
    |
    v
Database

The object carries both
data and persistence behavior.

Small application:

Controller
    |
    v
User
    |
    v
Database

Large application risk:

Order
  |
  +--> Database
  +--> Payment Provider
  +--> Inventory
  +--> Notifications
  +--> Audit
  +--> Events`,
      codeExample: {
        title: "Basic Active Record style model",
        code: `// Conceptual Active Record style API.
// The exact API depends on the ORM.

export class User {
  id!: string;
  email!: string;
  name!: string;

  async save() {
    // ORM persistence logic
  }

  async remove() {
    // ORM deletion logic
  }

  static async findById(id: string) {
    // ORM query
  }
}

// Creating a user
const user = new User();

user.email = "alice@example.com";
user.name = "Alice";

await user.save();

// Reading a user
const existingUser = await User.findById("user-123");

// Updating a user
if (existingUser) {
  existingUser.name = "Alice Smith";
  await existingUser.save();
}

// Deleting a user
if (existingUser) {
  await existingUser.remove();
}`,
      },
      keyTakeaways: [
        "Active Record combines domain data and persistence behavior in the same object.",
        "The object commonly exposes operations such as save, update, delete, and find.",
        "Active Record can be very productive for CRUD-heavy applications.",
        "Active Record becomes harder to manage when entities start depending on many external systems.",
        "The pattern is a tradeoff rather than automatically being good or bad.",
        "The larger and more business-heavy the domain becomes, the more important separation of responsibilities becomes.",
      ],
      commonMistakes: [
        "<b>Putting every business operation inside the entity.</b> An entity should not automatically become responsible for payments, emails, HTTP calls, and unrelated infrastructure.",
        "<b>Assuming Active Record is always simpler.</b> It is simple at first, but large entities can become difficult to maintain.",
        "<b>Confusing an ORM entity with the entire domain model.</b> A database representation does not necessarily need to contain every business rule.",
        "<b>Using the pattern without considering application complexity.</b> Choose the persistence style based on the actual needs of the system.",
      ],
      quiz: [
        {
          question: "What is the main idea behind Active Record?",
          options: [
            "Database logic is completely removed from objects",
            "Objects contain both record data and persistence behavior",
            "Only controllers can access the database",
            "Every query must be raw SQL",
          ],
          correctIndex: 1,
          explanation: "Active Record combines the representation of a database record with operations that persist or retrieve that record.",
        },
        {
          question: "Why can Active Record become difficult in a large application?",
          options: [
            "It cannot save records",
            "Entities can become tightly coupled to many responsibilities",
            "It cannot represent columns",
            "It cannot work with PostgreSQL",
          ],
          correctIndex: 1,
          explanation: "Large entities can accumulate persistence, business, and infrastructure responsibilities.",
        },
      ],
    },
    {
      id: "data-mapper-pattern",
      title: "Data Mapper pattern",
      durationMinutes: 24,
      explanation: `The <b>Data Mapper</b> pattern takes a different approach from Active Record.

Instead of making the entity responsible for saving itself, the entity mainly represents domain data and behavior while a separate component handles persistence.

The important idea is:

<b>"The domain object does not need to know how it is stored."</b>

For example, imagine an \`Order\` domain object.

The domain object may know:

\`\`\`ts
order.addItem(item);
order.cancel();
order.calculateTotal();
\`\`\`

But it does not need to know whether the order is stored in:

- PostgreSQL,
- MySQL,
- MongoDB,
- a test double,
- a remote service,
- or another persistence mechanism.

A separate mapper/repository layer handles communication with the database.

<b>Beginner real-world example:</b>

Think about a library.

A \`Book\` object represents a book:

\`\`\`ts
const book = new Book(
  "book-1",
  "Clean Architecture",
);
\`\`\`

The book does not need a method like:

\`\`\`ts
book.saveToPostgres();
\`\`\`

Instead, another component handles persistence:

\`\`\`ts
await bookRepository.save(book);
\`\`\`

Now the responsibilities are separated.

\`\`\`
Book
  |
  | domain information
  v
BookRepository
  |
  | database operations
  v
PostgreSQL
\`\`\`

<b>Intermediate real-world example:</b>

Consider an e-commerce order.

The domain model might contain rules:

\`\`\`ts
class Order {
  cancel() {
    if (this.status === "SHIPPED") {
      throw new Error("Shipped orders cannot be cancelled");
    }

    this.status = "CANCELLED";
  }
}
\`\`\`

The entity knows the business rule.

The repository knows persistence:

\`\`\`ts
await orderRepository.save(order);
\`\`\`

The database-specific code is outside the domain object.

This separation makes the business logic easier to test.

<b>Advanced real-world example:</b>

Imagine a company that stores current orders in PostgreSQL but sends historical orders to an analytical data platform.

With a strongly separated architecture, the domain model does not need to know where persistence happens.

You could have:

\`\`\`
Order Domain
     |
     v
Order Repository Interface
     |
     +-------------------+
     |                   |
     v                   v
Postgres Repository   Archive Repository
\`\`\`

The business logic depends on the abstraction rather than directly on PostgreSQL.

This is particularly useful when the application has complex business rules.

<b>Data Mapper does not mean "never use ORM entities."</b>

An ORM such as TypeORM can still map database rows to TypeScript objects.

The architectural question is about responsibility.

Ask:

"Does my domain object need to know how persistence works?"

With Data Mapper, the answer is generally no.

<b>NestJS real-world structure:</b>

A production NestJS application might use:

\`\`\`
orders/
├── domain/
│   ├── order.entity.ts
│   └── order.repository.ts
├── application/
│   └── create-order.use-case.ts
└── infrastructure/
    └── typeorm-order.repository.ts
\`\`\`

The domain repository interface might be:

\`\`\`ts
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}
\`\`\`

The infrastructure implementation can use TypeORM:

\`\`\`ts
@Injectable()
export class TypeOrmOrderRepository
  implements OrderRepository
{
  constructor(
    private readonly repository: Repository<OrderOrmEntity>,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const row = await this.repository.findOne({
      where: { id },
    });

    if (!row) {
      return null;
    }

    return OrderMapper.toDomain(row);
  }

  async save(order: Order): Promise<void> {
    const row = OrderMapper.toPersistence(order);

    await this.repository.save(row);
  }
}
\`\`\`

The domain does not need to import TypeORM.

That is one of the biggest architectural benefits of Data Mapper.

<b>When this pattern is useful:</b>

Data Mapper becomes especially useful when:

- business rules are complicated,
- the domain needs strong isolation,
- persistence may change,
- the application has multiple persistence mechanisms,
- testing business logic independently is important,
- the team wants explicit architectural boundaries.

<b>The cost:</b>

You write more code.

You may need:

- domain entities,
- ORM entities,
- repositories,
- mappers,
- DTOs,
- use cases.

That additional structure is useful when complexity justifies it, but unnecessary abstraction can also make a small CRUD application harder to understand.

The goal is not to create the maximum number of files.

The goal is to create boundaries that make change easier.`,
      diagram: `DATA MAPPER

Domain Entity
    |
    | business behavior
    v
Repository Interface
    |
    v
Infrastructure Repository
    |
    v
ORM / Query Builder
    |
    v
PostgreSQL

Important separation:

Domain
  does NOT need to know
  how PostgreSQL works.

Infrastructure
  knows how to store
  and retrieve the domain.`,
      codeExample: {
        title: "Data Mapper with a repository boundary",
        code: `// domain/order.entity.ts
export class Order {
  constructor(
    public readonly id: string,
    private status: "PENDING" | "PAID" | "CANCELLED",
    private total: number,
  ) {}

  cancel() {
    if (this.status === "PAID") {
      throw new Error(
        "Paid orders require a refund before cancellation.",
      );
    }

    this.status = "CANCELLED";
  }

  getStatus() {
    return this.status;
  }

  getTotal() {
    return this.total;
  }
}

// domain/order.repository.ts
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

// infrastructure/typeorm-order.repository.ts
@Injectable()
export class TypeOrmOrderRepository
  implements OrderRepository
{
  constructor(
    private readonly repository: Repository<OrderOrmEntity>,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const row = await this.repository.findOne({
      where: { id },
    });

    if (!row) {
      return null;
    }

    return new Order(
      row.id,
      row.status,
      Number(row.total),
    );
  }

  async save(order: Order): Promise<void> {
    await this.repository.save({
      id: order.id,
      status: order.getStatus(),
      total: order.getTotal(),
    });
  }
}`,
      },
      keyTakeaways: [
        "Data Mapper separates domain objects from persistence details.",
        "The domain model does not need to know how PostgreSQL works.",
        "Repositories or mappers translate between domain objects and database representations.",
        "This approach is useful for complex business domains.",
        "The main cost is additional architectural code.",
        "Data Mapper is especially useful when business rules need to be tested independently from the database.",
      ],
      commonMistakes: [
        "<b>Creating a repository interface that exposes every ORM method.</b> The domain boundary should expose meaningful application operations rather than blindly copying the ORM API.",
        "<b>Putting TypeORM decorators throughout a pure domain model without considering the boundary.</b> This can tightly couple the domain to infrastructure.",
        "<b>Creating abstractions without a reason.</b> A small CRUD application may not need a large Data Mapper architecture.",
        "<b>Thinking Data Mapper means there can be no database entities.</b> ORM persistence models can still exist; they are simply separated from the domain model.",
      ],
      quiz: [
        {
          question: "What is a major characteristic of Data Mapper?",
          options: [
            "The domain object saves itself",
            "Persistence is separated from the domain object",
            "Controllers directly execute SQL",
            "Every entity must be static",
          ],
          correctIndex: 1,
          explanation: "Data Mapper keeps persistence responsibilities outside the domain object.",
        },
        {
          question: "Why can Data Mapper be useful for complex applications?",
          options: [
            "It removes all code",
            "It isolates business rules from persistence details",
            "It eliminates databases",
            "It prevents transactions",
          ],
          correctIndex: 1,
          explanation: "Separating persistence from domain logic makes complex business behavior easier to reason about and test.",
        },
      ],
    },
    {
      id: "repository-pattern",
      title: "Repository pattern",
      durationMinutes: 22,
      explanation: `A <b>Repository</b> provides an application-friendly way to access persistent data.

Instead of allowing every service to know how SQL or ORM queries work, a repository can provide meaningful operations such as:

\`\`\`ts
findUserByEmail(email)
findActiveOrdersForCustomer(customerId)
saveOrder(order)
findProductBySku(sku)
\`\`\`

The repository becomes a boundary between application logic and persistence.

<b>Beginner real-world example:</b>

Imagine a school application.

Without a repository, a service might directly contain database code:

\`\`\`ts
const student = await this.repository.findOne({
  where: {
    email,
  },
});
\`\`\`

With a repository abstraction:

\`\`\`ts
const student =
  await this.studentRepository.findByEmail(email);
\`\`\`

The service now asks for what it needs instead of describing exactly how the database query should work.

<b>Intermediate real-world example:</b>

An e-commerce order service might need to find unpaid orders older than 30 minutes.

Instead of putting QueryBuilder code into the service:

\`\`\`ts
const orders = await this.orderRepository
  .createQueryBuilder("order")
  .where("order.status = :status", {
    status: "PENDING",
  })
  .andWhere("order.createdAt < :cutoff", {
    cutoff,
  })
  .getMany();
\`\`\`

The service can say:

\`\`\`ts
const orders =
  await this.orderRepository.findExpiredPendingOrders(
    cutoff,
  );
\`\`\`

The repository owns the database-specific implementation.

<b>Advanced real-world example:</b>

Suppose the business requirement is:

"Find all orders that have been paid but have not been shipped, including the customer's shipping address and the latest payment."

This may involve several joins.

The service should generally care about the business requirement:

\`\`\`ts
const orders =
  await orderRepository.findPaidOrdersAwaitingShipment();
\`\`\`

The repository can handle:

- joins,
- filtering,
- indexes,
- database-specific syntax,
- projections,
- pagination,
- query optimization.

This gives you a useful boundary.

<b>Important distinction:</b>

A repository should not automatically become a generic wrapper around the ORM.

For example, this is often weak:

\`\`\`ts
repository.findOne();
repository.findMany();
repository.save();
repository.delete();
repository.update();
repository.query();
repository.createQueryBuilder();
\`\`\`

If the repository simply exposes every ORM operation, the application is still tightly coupled to the ORM.

A more meaningful repository might expose:

\`\`\`ts
findByEmail(email)
findActiveCustomer(id)
save(customer)
\`\`\`

The methods describe business-relevant persistence operations.

<b>NestJS example:</b>

Your application service might depend on an abstraction:

\`\`\`ts
@Injectable()
export class CreateOrderService {
  constructor(
    private readonly orders: OrderRepository,
  ) {}

  async execute(input: CreateOrderInput) {
    const order = Order.create(input);

    await this.orders.save(order);

    return order;
  }
}
\`\`\`

The concrete implementation can be TypeORM-based:

\`\`\`ts
@Injectable()
export class TypeOrmOrderRepository
  implements OrderRepository
{
  // TypeORM implementation
}
\`\`\`

This allows the application layer to remain focused on business behavior.

<b>Testing benefit:</b>

A repository interface can be replaced with an in-memory implementation during unit tests.

\`\`\`ts
class InMemoryOrderRepository
  implements OrderRepository
{
  private readonly orders: Order[] = [];

  async save(order: Order) {
    this.orders.push(order);
  }

  async findById(id: string) {
    return (
      this.orders.find((order) => order.id === id) ??
      null
    );
  }
}
\`\`\`

Now the business service can be tested without starting PostgreSQL.

This does not mean every test should avoid the database.

You should still have integration tests that verify the real database implementation.

A strong architecture usually uses both:

\`\`\`
Unit tests
   |
   +--> In-memory repository

Integration tests
   |
   +--> Real PostgreSQL repository
\`\`\`

The repository pattern is therefore less about "making database calls cleaner" and more about creating a controlled persistence boundary.`,
      diagram: `SERVICE
   |
   | "Find unpaid orders"
   v
REPOSITORY
   |
   | SQL / ORM / QueryBuilder
   v
POSTGRESQL

Good boundary:

OrderService
    |
    v
OrderRepository
    |
    v
TypeORM
    |
    v
PostgreSQL

The service knows WHAT it needs.

The repository knows HOW
to retrieve it.`,
      codeExample: {
        title: "A meaningful repository boundary",
        code: `// order.repository.ts
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;

  findExpiredPendingOrders(
    cutoff: Date,
  ): Promise<Order[]>;

  save(order: Order): Promise<void>;
}

// order.service.ts
@Injectable()
export class OrderService {
  constructor(
    private readonly orders: OrderRepository,
  ) {}

  async cancelExpiredOrders(cutoff: Date) {
    const orders =
      await this.orders.findExpiredPendingOrders(cutoff);

    for (const order of orders) {
      order.cancel();
      await this.orders.save(order);
    }

    return orders.length;
  }
}

// infrastructure/typeorm-order.repository.ts
@Injectable()
export class TypeOrmOrderRepository
  implements OrderRepository
{
  constructor(
    private readonly repository: Repository<OrderOrmEntity>,
  ) {}

  async findById(id: string) {
    const row = await this.repository.findOne({
      where: { id },
    });

    return row ? OrderMapper.toDomain(row) : null;
  }

  async findExpiredPendingOrders(cutoff: Date) {
    const rows = await this.repository.find({
      where: {
        status: "PENDING",
        createdAt: LessThan(cutoff),
      },
    });

    return rows.map(OrderMapper.toDomain);
  }

  async save(order: Order) {
    const row = OrderMapper.toPersistence(order);

    await this.repository.save(row);
  }
}`,
      },
      keyTakeaways: [
        "A repository provides an application-facing persistence boundary.",
        "Repository methods should describe meaningful data operations.",
        "The repository can hide ORM-specific query details.",
        "Repositories can make unit testing easier through test implementations.",
        "Integration tests are still important for verifying real database behavior.",
        "Avoid turning repositories into meaningless wrappers around every ORM method.",
      ],
      commonMistakes: [
        "<b>Creating a repository that exposes the entire ORM API.</b> This weakens the abstraction.",
        "<b>Putting business decisions inside repositories.</b> Repositories should primarily handle persistence concerns.",
        "<b>Assuming repositories eliminate the need for integration tests.</b> Database behavior still needs to be tested against a real database.",
        "<b>Creating dozens of tiny methods without understanding the domain.</b> Repository APIs should be useful and intentional.",
      ],
      quiz: [
        {
          question: "What should a repository primarily hide?",
          options: [
            "Business requirements",
            "Database and persistence implementation details",
            "HTTP routes",
            "Authentication tokens",
          ],
          correctIndex: 1,
          explanation: "A repository creates a boundary around persistence details.",
        },
        {
          question: "Which repository method is more meaningful?",
          options: [
            "executeAnyQuery()",
            "runDatabaseOperation()",
            "findExpiredPendingOrders()",
            "doSomething()",
          ],
          correctIndex: 2,
          explanation: "The method describes a concrete application-relevant persistence operation.",
        },
      ],
    },
    {
      id: "unit-of-work-pattern",
      title: "Unit of Work",
      durationMinutes: 25,
      explanation: `The <b>Unit of Work</b> pattern manages a group of changes that should be treated as one logical operation.

This becomes especially important when one business operation changes several pieces of data.

Consider an e-commerce order.

When a customer places an order, the application might need to:

- create the order,
- create order items,
- decrease inventory,
- create a payment record,
- record an audit event.

You do not want this situation:

\`\`\`
Create order        -> success
Create order items  -> success
Decrease inventory  -> success
Create payment      -> FAILED
\`\`\`

Now the database contains a partially completed operation.

A Unit of Work helps coordinate these changes inside one transaction.

<b>Beginner real-world example:</b>

Imagine transferring money between two bank accounts.

You need to:

\`\`\`
Account A: -$100
Account B: +$100
\`\`\`

If the first update succeeds but the second fails, the money has disappeared from the system.

A transaction makes the two changes atomic:

\`\`\`
BEGIN

Account A -= 100
Account B += 100

COMMIT
\`\`\`

If something fails:

\`\`\`
ROLLBACK
\`\`\`

The database returns to the previous consistent state.

<b>Intermediate real-world example:</b>

Imagine creating an order.

The application performs:

\`\`\`
Order
  |
  +--> Order Items
  |
  +--> Inventory reservation
  |
  +--> Payment record
\`\`\`

These operations may involve several repositories.

The Unit of Work coordinates them:

\`\`\`
UnitOfWork
    |
    +--> OrderRepository
    +--> OrderItemRepository
    +--> InventoryRepository
    +--> PaymentRepository
    |
    v
One Database Transaction
\`\`\`

The important idea is that the repositories participate in the same transaction.

<b>Advanced real-world example:</b>

Consider a large marketplace.

A checkout operation might:

1. Lock or reserve inventory.
2. Create the order.
3. Create order items.
4. Record the payment attempt.
5. Apply a coupon usage record.
6. Create an accounting entry.
7. Write an audit record.

Some of these operations are business decisions.

Others are persistence operations.

The Unit of Work does not necessarily own all the business logic.

Instead, it provides the transactional boundary that allows several operations to succeed or fail together.

A simplified application flow could be:

\`\`\`
CheckoutService
      |
      v
UnitOfWork.execute()
      |
      +--> create order
      +--> reserve stock
      +--> create payment record
      +--> record audit
      |
      +--> COMMIT
\`\`\`

If any critical operation throws an error:

\`\`\`
      |
      +--> ROLLBACK
\`\`\`

<b>Important concept: transaction scope.</b>

A transaction should generally be kept as short as practical.

Do not start a database transaction and then make a slow external HTTP request unless you have a very specific reason.

For example, this is risky:

\`\`\`
BEGIN TRANSACTION

create order

await paymentProvider.chargeCard();

update payment

COMMIT
\`\`\`

The external payment provider might take several seconds or fail unexpectedly.

The database transaction is now being held open while waiting for a network operation.

A better architecture may use a payment state machine and carefully designed workflow:

\`\`\`
Create Order
     |
     v
Payment Pending
     |
     v
Payment Provider
     |
     +--> success --> mark paid
     |
     +--> failure --> mark failed
\`\`\`

The exact design depends on the business requirements.

<b>NestJS and TypeORM example:</b>

TypeORM provides transaction APIs that can be used to coordinate multiple repository operations.

The important rule is:

<b>All database operations that must belong to the transaction must use the transaction's EntityManager or transaction-scoped repositories.</b>

For example:

\`\`\`ts
await dataSource.transaction(async (manager) => {
  await manager.save(order);
  await manager.save(orderItem);
});
\`\`\`

Do not accidentally use an unrelated global repository inside the transaction.

A common mistake is:

\`\`\`ts
await dataSource.transaction(async (manager) => {
  await manager.save(order);

  await globalOrderRepository.save(orderItem);
});
\`\`\`

The second operation may not participate in the transaction in the way you expect.

<b>Unit of Work and business logic:</b>

The Unit of Work should not become a giant service containing every business rule.

A healthy separation can look like:

\`\`\`
Controller
    |
    v
Application Service
    |
    v
Unit of Work
    |
    +--> Repositories
    |
    v
Database Transaction
\`\`\`

The application service coordinates the business operation.

The Unit of Work coordinates the transactional boundary.

Repositories perform persistence operations.

Domain objects enforce domain rules.

This separation is extremely useful in large systems.`,
      diagram: `UNIT OF WORK

Checkout Service
       |
       v
   Unit of Work
       |
       +------------------+
       |                  |
       v                  v
Order Repository    Inventory Repository
       |                  |
       +--------+---------+
                |
                v
        ONE DB TRANSACTION

        BEGIN
          |
          +--> Order
          +--> Items
          +--> Inventory
          +--> Payment Record
          |
        COMMIT

If anything fails:

        ROLLBACK`,
      codeExample: {
        title: "Transaction as a Unit of Work with TypeORM",
        code: `import { DataSource } from "typeorm";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async checkout(input: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    return this.dataSource.transaction(
      async (manager) => {
        const product = await manager.findOne(ProductEntity, {
          where: {
            id: input.productId,
          },
        });

        if (!product) {
          throw new Error("Product not found");
        }

        if (product.stock < input.quantity) {
          throw new Error("Not enough inventory");
        }

        product.stock -= input.quantity;

        await manager.save(product);

        const order = manager.create(OrderEntity, {
          userId: input.userId,
          status: "PENDING",
        });

        await manager.save(order);

        const item = manager.create(OrderItemEntity, {
          orderId: order.id,
          productId: product.id,
          quantity: input.quantity,
        });

        await manager.save(item);

        return order;
      },
    );
  }
}

// If any operation throws:
// - the transaction is rolled back
// - the inventory update is undone
// - the order is not persisted
// - the order item is not persisted`,
      },
      keyTakeaways: [
        "Unit of Work coordinates multiple persistence changes as one logical transaction.",
        "Transactions protect operations that must succeed or fail together.",
        "All operations that belong to a transaction must use the transaction-scoped database manager or repository.",
        "Keep database transactions reasonably short.",
        "Avoid holding database transactions open while waiting on slow external services unless the architecture specifically requires it.",
        "Unit of Work coordinates persistence boundaries; it should not become a container for every business rule.",
      ],
      commonMistakes: [
        "<b>Updating several tables without a transaction.</b> A failure halfway through can leave inconsistent data.",
        "<b>Using a global repository inside a transaction.</b> Use the transaction-scoped manager or repositories.",
        "<b>Calling slow external APIs inside a long transaction.</b> This can hold database connections and locks unnecessarily.",
        "<b>Making Unit of Work responsible for all business logic.</b> Keep business rules in appropriate domain/application components.",
        "<b>Assuming every operation needs one huge transaction.</b> Transaction boundaries should reflect real consistency requirements.",
      ],
      quiz: [
        {
          question: "What problem does Unit of Work primarily help solve?",
          options: [
            "CSS styling",
            "Coordinating multiple persistence changes within a transaction",
            "HTTP routing",
            "JWT creation",
          ],
          correctIndex: 1,
          explanation: "Unit of Work coordinates multiple related database operations so they can commit or roll back together.",
        },
        {
          question: "What should happen if one critical database operation fails inside the transaction?",
          options: [
            "Only the failed query is ignored",
            "The transaction should normally roll back",
            "The application should always commit",
            "The database should be deleted",
          ],
          correctIndex: 1,
          explanation: "Rollback prevents a partially completed transactional operation from being committed.",
        },
      ],
    },
    {
      id: "orm-tradeoffs",
      title: "ORM tradeoffs",
      durationMinutes: 20,
      explanation: `An ORM can make database development much easier, but it is not magic.

An ORM such as TypeORM or Prisma gives you abstractions for:

- entities or models,
- relationships,
- queries,
- inserts,
- updates,
- transactions,
- migrations,
- validation of database structures,
- mapping database data into application objects.

That productivity is valuable.

However, every abstraction has a cost.

The most important skill at this stage is learning when the ORM helps you and when you need to understand what is happening underneath.

<b>Beginner real-world example:</b>

Suppose you need to find a user by email.

With an ORM:

\`\`\`ts
const user = await repository.findOne({
  where: {
    email,
  },
});
\`\`\`

Without an ORM, you might write SQL:

\`\`\`sql
SELECT *
FROM users
WHERE email = $1
LIMIT 1;
\`\`\`

The ORM saves you from writing SQL for every basic operation.

<b>Intermediate real-world example:</b>

Suppose you need to load orders with their items.

The ORM can express the relationship:

\`\`\`ts
const orders = await repository.find({
  relations: {
    items: true,
  },
});
\`\`\`

This can be convenient.

But you should still understand the SQL generated underneath.

The database does not understand TypeScript.

Eventually, the ORM translates your request into SQL.

So a developer who only knows the ORM but does not understand SQL can have difficulty diagnosing:

- slow queries,
- missing indexes,
- unexpected joins,
- duplicate rows,
- excessive data loading,
- N+1 queries,
- poor pagination,
- lock contention.

<b>Advanced real-world example:</b>

Imagine an analytics endpoint:

"Show daily revenue for the last 12 months, grouped by product category."

The query may require:

- joins,
- grouping,
- aggregation,
- date functions,
- indexes,
- filtering,
- sorting.

You might begin with QueryBuilder.

If the generated query is inefficient, you may need to inspect the actual SQL and execution plan.

At that point, understanding PostgreSQL becomes more important than knowing another ORM method.

<b>ORM tradeoff #1: Productivity</b>

ORMs are excellent for common CRUD operations.

Instead of manually writing:

\`\`\`
INSERT
SELECT
UPDATE
DELETE
\`\`\`

you can use higher-level APIs.

This can make development faster and reduce repetitive code.

<b>ORM tradeoff #2: Abstraction leakage</b>

The database still has rules that the ORM cannot magically remove.

PostgreSQL still cares about:

- indexes,
- query plans,
- locks,
- constraints,
- isolation levels,
- joins,
- connection limits,
- transactions.

If the ORM hides these concepts too much, developers can accidentally write inefficient applications.

<b>ORM tradeoff #3: Complex queries</b>

Simple query:

\`\`\`ts
repository.find({
  where: {
    status: "ACTIVE",
  },
});
\`\`\`

Easy.

Complex analytical query:

\`\`\`
customers
    |
orders
    |
order_items
    |
products
    |
categories
\`\`\`

You may need QueryBuilder or raw SQL.

There is nothing wrong with using raw SQL when it is appropriate.

The goal is not:

"Never write SQL."

The goal is:

"Use the highest-level abstraction that still gives you the required correctness, performance, and clarity."

<b>ORM tradeoff #4: N+1 queries</b>

Suppose you load 100 orders.

Then for each order you load its customer separately.

You might accidentally generate:

\`\`\`
1 query for orders
+
100 queries for customers
=
101 queries
\`\`\`

The code can look harmless while the database receives a large number of queries.

The solution might involve:

- joins,
- eager/lazy loading decisions,
- batch queries,
- DataLoader-style batching,
- carefully designed repository methods.

<b>ORM tradeoff #5: Object mapping</b>

Your TypeScript object and database row are not necessarily the same thing.

For example:

\`\`\`
Database:

snake_case
created_at
customer_id

Application:

camelCase
createdAt
customerId
\`\`\`

The ORM maps between these representations.

That is convenient, but complex mappings can become difficult to reason about.

<b>ORM tradeoff #6: Abstraction versus control</b>

Think about the spectrum:

\`\`\`
High abstraction
     |
     v
ORM repository methods
     |
QueryBuilder
     |
Raw SQL
     |
     v
Low abstraction / high control
\`\`\`

Higher abstraction usually means less repetitive database code.

Lower abstraction usually means more direct control.

A production developer should be comfortable moving between these levels.

<b>Practical rule:</b>

Use the ORM for normal application persistence.

Use QueryBuilder for complex queries where ORM methods become awkward.

Use parameterized raw SQL when direct database control is necessary.

Always understand the query that matters for performance.

<b>ORM does not replace database knowledge.</b>

This is one of the most important lessons of persistence architecture.

A developer who understands both the ORM and PostgreSQL can make better decisions than someone who knows only one layer.`,
      diagram: `PERSISTENCE ABSTRACTION LEVELS

Application
     |
     v
Repository API
     |
     v
ORM
     |
     +-------------------+
     |                   |
     v                   v
QueryBuilder         Raw SQL
     |                   |
     +---------+---------+
               |
               v
           PostgreSQL

As you move downward:

More control
More database knowledge required

As you move upward:

More abstraction
More convenience`,
      codeExample: {
        title: "Choosing between ORM, QueryBuilder, and raw SQL",
        code: `// 1. Simple ORM query
const user = await userRepository.findOne({
  where: {
    email: "alice@example.com",
  },
});

// 2. More complex QueryBuilder
const orders = await orderRepository
  .createQueryBuilder("order")
  .innerJoinAndSelect("order.items", "item")
  .where("order.status = :status", {
    status: "PAID",
  })
  .andWhere("order.createdAt >= :startDate", {
    startDate,
  })
  .orderBy("order.createdAt", "DESC")
  .getMany();

// 3. Raw SQL for a specialized report
const rows = await dataSource.query(
  \`
    SELECT
      DATE_TRUNC('day', created_at) AS day,
      SUM(total) AS revenue
    FROM orders
    WHERE status = $1
      AND created_at >= $2
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY day ASC
  \`,
  ["PAID", startDate],
);

// The important principle:
// Use the abstraction that makes the query
// correct, understandable, and performant.`,
      },
      keyTakeaways: [
        "ORMs improve productivity but do not eliminate database complexity.",
        "Developers should understand the SQL and database behavior behind important ORM operations.",
        "ORM methods are excellent for common CRUD operations.",
        "QueryBuilder is useful when normal ORM methods become insufficient.",
        "Raw SQL is appropriate for specialized or performance-sensitive queries when used safely.",
        "N+1 queries are a common ORM-related performance problem.",
        "Indexes, transactions, locks, and query plans remain database concepts even when using an ORM.",
      ],
      commonMistakes: [
        "<b>Assuming the ORM always generates optimal SQL.</b> Inspect important queries when performance matters.",
        "<b>Using raw SQL for everything.</b> This can remove useful ORM productivity and consistency without providing a real benefit.",
        "<b>Avoiding raw SQL at all costs.</b> Some complex reports and database-specific operations are clearer in SQL.",
        "<b>Ignoring N+1 queries.</b> ORM relationship loading can accidentally produce many database requests.",
        "<b>Thinking ORM knowledge replaces PostgreSQL knowledge.</b> Production performance still depends heavily on database fundamentals.",
      ],
      quiz: [
        {
          question: "Does an ORM eliminate the need to understand SQL and databases?",
          options: [
            "Yes",
            "Only in production",
            "No",
            "Only when using PostgreSQL",
          ],
          correctIndex: 2,
          explanation: "ORMs abstract database operations but cannot remove database behavior such as indexes, locks, joins, and query plans.",
        },
        {
          question: "When might raw SQL be appropriate?",
          options: [
            "For every query",
            "For specialized or database-specific operations where it provides useful control",
            "Only for authentication",
            "Never",
          ],
          correctIndex: 1,
          explanation: "Raw SQL can be appropriate when the ORM abstraction is not a good fit for a particular query.",
        },
      ],
    },
    {
      id: "choosing-persistence-architecture",
      title: "Choosing the right persistence architecture",
      durationMinutes: 12,
      explanation: `The hardest persistence decision is usually not "Which ORM should I use?"

The harder question is:

<b>"How much architectural separation does this application actually need?"</b>

A small application and a large financial platform should not necessarily have the same persistence architecture.

<b>Beginner example: small internal CRUD application</b>

Imagine an internal company tool for managing office equipment.

The application has:

- employees,
- laptops,
- monitors,
- equipment assignments.

The business rules are simple.

A straightforward NestJS module with TypeORM repositories may be completely reasonable.

You might have:

\`\`\`
Controller
   |
Service
   |
TypeORM Repository
   |
PostgreSQL
\`\`\`

There is no need to create dozens of abstractions simply because "clean architecture" exists.

<b>Intermediate example: e-commerce API</b>

Now imagine an online store.

You have:

- users,
- products,
- inventory,
- orders,
- payments,
- refunds,
- shipping.

Business rules are becoming more complicated.

A useful architecture may be:

\`\`\`
Controller
    |
Application Service
    |
Domain Model
    |
Repository Interface
    |
Infrastructure Repository
    |
PostgreSQL
\`\`\`

Transactions become important for operations such as inventory reservation and order creation.

<b>Advanced example: financial system</b>

Now imagine a payment or accounting system.

Correctness requirements may include:

- strict transaction boundaries,
- idempotency,
- audit records,
- concurrency control,
- precise monetary handling,
- optimistic or pessimistic locking,
- reliable event processing,
- strong testing,
- migration discipline.

Here, stronger architectural boundaries can be justified because the cost of incorrect persistence behavior is high.

<b>The important principle:</b>

Do not choose architecture based only on how impressive it looks.

Choose it based on:

- business complexity,
- consistency requirements,
- team size,
- expected growth,
- performance requirements,
- testing requirements,
- database complexity,
- operational requirements.

A good architecture makes change easier.

A bad architecture can make simple changes unnecessarily difficult.

<b>A useful progression:</b>

For a simple project:

\`\`\`
Controller
   |
Service
   |
ORM Repository
\`\`\`

For a more complex project:

\`\`\`
Controller
   |
Application Service
   |
Domain
   |
Repository Interface
   |
Infrastructure
   |
Database
\`\`\`

For a highly complex system, you may add:

\`\`\`
Controller
    |
Application Layer
    |
Domain Layer
    |
Unit of Work
    |
Repository Interfaces
    |
Infrastructure
    |
PostgreSQL
    |
Events / Messaging
\`\`\`

But do not add a layer unless it solves a real problem.

<b>Real-world decision example:</b>

Suppose you are building a startup MVP.

You have three developers.

The application needs:

- login,
- users,
- products,
- orders.

A very complicated architecture may slow the team down.

A clean but straightforward structure could be enough:

\`\`\`
src/
├── auth/
├── users/
├── products/
└── orders/
\`\`\`

Each module can contain:

\`\`\`
controller
service
entity
repository
dto
\`\`\`

As the business becomes more complex, you can introduce stronger domain boundaries.

<b>Another real-world example:</b>

Suppose your order service now contains 2,000 lines because it handles:

- pricing,
- discounts,
- inventory,
- payments,
- shipping,
- refunds,
- tax,
- notifications.

That is a signal that the persistence and application architecture needs restructuring.

The answer is not automatically "add repositories."

You need to identify the actual responsibilities.

For example:

\`\`\`
Order
Pricing
Inventory
Payment
Shipping
Tax
Notification
\`\`\`

Each domain concept can have a clearer boundary.

This is what architecture should accomplish:

<b>Make complexity visible and manageable.</b>`,
      diagram: `ARCHITECTURE SHOULD GROW WITH COMPLEXITY

Small application:

Controller
    |
Service
    |
ORM
    |
Database


Growing application:

Controller
    |
Application Service
    |
Repository Interface
    |
Infrastructure
    |
Database


Complex domain:

Controller
    |
Application Layer
    |
Domain Layer
    |
Unit of Work
    |
Repositories
    |
Infrastructure
    |
PostgreSQL
    |
External Systems`,
      codeExample: {
        title: "A practical NestJS persistence structure",
        code: `src/
├── orders/
│   ├── application/
│   │   └── create-order.service.ts
│   │
│   ├── domain/
│   │   ├── order.ts
│   │   └── order.repository.ts
│   │
│   ├── infrastructure/
│   │   ├── order.orm-entity.ts
│   │   ├── order.mapper.ts
│   │   └── typeorm-order.repository.ts
│   │
│   ├── presentation/
│   │   └── orders.controller.ts
│   │
│   └── orders.module.ts
│
├── users/
├── products/
├── payments/
└── notifications/

// Application layer
@Injectable()
export class CreateOrderService {
  constructor(
    private readonly orders: OrderRepository,
  ) {}

  async execute(input: CreateOrderInput) {
    const order = Order.create(input);

    await this.orders.save(order);

    return order;
  }
}

// Domain layer
export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}

// Infrastructure layer
@Injectable()
export class TypeOrmOrderRepository
  implements OrderRepository
{
  constructor(
    private readonly repository: Repository<OrderOrmEntity>,
  ) {}

  async save(order: Order) {
    const entity = OrderMapper.toPersistence(order);

    await this.repository.save(entity);
  }

  async findById(id: string) {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity
      ? OrderMapper.toDomain(entity)
      : null;
  }
}`,
      },
      keyTakeaways: [
        "Persistence architecture should match application complexity.",
        "Small applications can often use a simpler architecture.",
        "Complex domains benefit from stronger boundaries between domain logic and persistence.",
        "Do not introduce abstractions simply because they sound architecturally advanced.",
        "A good architecture makes business changes easier to implement and test.",
        "The architecture can evolve as the application grows.",
      ],
      commonMistakes: [
        "<b>Overengineering a small CRUD application.</b> Extra layers have a maintenance cost.",
        "<b>Underengineering a complex business system.</b> Large services and tightly coupled persistence become difficult to change.",
        "<b>Choosing architecture based on trends.</b> Start with the actual problems your application has.",
        "<b>Assuming architecture must never change.</b> Good systems can evolve their boundaries as requirements become clearer.",
      ],
      quiz: [
        {
          question: "What should primarily determine persistence architecture?",
          options: [
            "How many folders look impressive",
            "The actual complexity and requirements of the application",
            "The number of TypeScript files",
            "Whether the team likes interfaces",
          ],
          correctIndex: 1,
          explanation: "Architecture should solve real complexity, consistency, testing, performance, and maintainability requirements.",
        },
        {
          question: "Should every NestJS application use a highly layered architecture?",
          options: [
            "Yes",
            "No",
            "Only applications with PostgreSQL",
            "Only applications with TypeScript",
          ],
          correctIndex: 1,
          explanation: "A simple application may benefit from a simpler architecture, while complex domains may justify more separation.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the main characteristic of Active Record?",
      options: [
        "Persistence is completely separated from the object",
        "The object combines record data with persistence behavior",
        "Only raw SQL is allowed",
        "Repositories cannot be used",
      ],
      correctIndex: 1,
      explanation: "Active Record combines data representation and persistence behavior in the same object.",
    },
    {
      question: "What is the main idea behind Data Mapper?",
      options: [
        "Entities must save themselves",
        "Persistence is separated from domain objects",
        "Controllers must write SQL",
        "Transactions are prohibited",
      ],
      correctIndex: 1,
      explanation: "Data Mapper separates the domain model from persistence implementation.",
    },
    {
      question: "What is a major responsibility of a repository?",
      options: [
        "Rendering HTML",
        "Handling authentication tokens",
        "Providing an application-facing persistence boundary",
        "Managing CSS",
      ],
      correctIndex: 2,
      explanation: "Repositories hide persistence implementation details behind useful application-facing operations.",
    },
    {
      question: "Why is a meaningful repository API better than exposing every ORM method?",
      options: [
        "It creates stronger separation from the ORM",
        "It prevents database access",
        "It removes the need for PostgreSQL",
        "It makes transactions impossible",
      ],
      correctIndex: 0,
      explanation: "A meaningful repository API prevents application code from becoming directly dependent on the entire ORM API.",
    },
    {
      question: "What does Unit of Work help coordinate?",
      options: [
        "CSS files",
        "Multiple persistence changes within a transaction",
        "HTTP headers",
        "Frontend state",
      ],
      correctIndex: 1,
      explanation: "Unit of Work coordinates related persistence operations so they can commit or roll back together.",
    },
    {
      question: "What should normally happen when a critical operation inside a transaction fails?",
      options: [
        "The database should partially commit",
        "The transaction should roll back",
        "The failed query should be ignored",
        "All unrelated databases should be deleted",
      ],
      correctIndex: 1,
      explanation: "Rollback prevents a partially completed transaction from being committed.",
    },
    {
      question: "Why should database transactions generally be kept reasonably short?",
      options: [
        "Long transactions can hold locks and database resources",
        "PostgreSQL cannot execute long queries",
        "TypeScript requires short transactions",
        "NestJS automatically rejects long transactions",
      ],
      correctIndex: 0,
      explanation: "Long transactions can hold connections, locks, and other database resources for longer than necessary.",
    },
    {
      question: "Does using an ORM remove the need to understand PostgreSQL?",
      options: [
        "Yes",
        "Only during development",
        "No",
        "Only when using TypeORM",
      ],
      correctIndex: 2,
      explanation: "ORMs provide abstraction, but indexes, locks, joins, query plans, transactions, and database constraints still affect production behavior.",
    },
    {
      question: "When can QueryBuilder be useful?",
      options: [
        "When normal ORM methods are not expressive enough for a complex query",
        "Only for creating CSS",
        "Only for authentication",
        "Never",
      ],
      correctIndex: 0,
      explanation: "QueryBuilder can provide more control for joins, filtering, aggregation, sorting, and complex queries.",
    },
    {
      question: "When can raw SQL be appropriate?",
      options: [
        "Only when the application has no ORM",
        "For specialized or database-specific operations where direct SQL provides useful control",
        "For every query",
        "Never",
      ],
      correctIndex: 1,
      explanation: "Raw SQL is a valid tool when it improves control, clarity, or access to database-specific capabilities.",
    },
    {
      question: "What is an N+1 query problem?",
      options: [
        "One query is executed for every database server",
        "One initial query is followed by many additional queries for related data",
        "A transaction is always rolled back",
        "A table has N+1 columns",
      ],
      correctIndex: 1,
      explanation: "N+1 occurs when an initial query is followed by many individual queries, often while loading relationships.",
    },
    {
      question: "What is a good reason to introduce a stronger persistence boundary?",
      options: [
        "The folder structure looks too small",
        "The business domain has complex rules and persistence needs",
        "The application has one controller",
        "The developer wants more files",
      ],
      correctIndex: 1,
      explanation: "Complex business and persistence requirements can justify stronger separation between application, domain, and infrastructure.",
    },
    {
      question: "Which architecture is often reasonable for a small CRUD application?",
      options: [
        "Controller -> Service -> ORM Repository",
        "Ten layers for every database operation",
        "Controller -> raw SQL only",
        "Frontend -> PostgreSQL directly",
      ],
      correctIndex: 0,
      explanation: "A small CRUD application often benefits from a straightforward architecture without unnecessary abstraction.",
    },
    {
      question: "What is the most important goal of persistence architecture?",
      options: [
        "Creating the largest number of files",
        "Making complexity easier to manage while keeping persistence reliable and maintainable",
        "Avoiding all SQL",
        "Using as many design patterns as possible",
      ],
      correctIndex: 1,
      explanation: "Persistence architecture should make database behavior, business rules, testing, and future changes manageable.",
    },
  ],
  project: {
    name: "Production-ready PostgreSQL-backed NestJS API",
    goal: "Design and implement a production-ready NestJS API backed by PostgreSQL while applying practical persistence architecture decisions instead of adding abstractions without purpose.",
    brief: `Build a realistic e-commerce-style NestJS API that demonstrates how persistence architecture works from a simple CRUD implementation through a production-oriented design.

The project should contain users, products, orders, payments, and inventory-related behavior.

The goal is not simply to create database tables.

The goal is to understand where each responsibility belongs.

Your application should demonstrate:

\`\`\`
HTTP Request
    |
Controller
    |
Application Service
    |
Domain Rules
    |
Repository Boundary
    |
Infrastructure Repository
    |
TypeORM
    |
PostgreSQL
\`\`\`

For transactional operations, introduce a transaction or Unit of Work boundary.

The project should contain enough real-world behavior to make the architectural decisions meaningful.

For example, placing an order should involve more than inserting one row.

A realistic flow can include:

\`\`\`
Create Order
    |
Validate Products
    |
Check Inventory
    |
Create Order
    |
Create Order Items
    |
Reserve / Decrease Inventory
    |
Create Payment Record
    |
Commit
\`\`\`

If one critical database operation fails, the transaction should roll back the database changes.

External payment processing should not be treated as if it were magically part of the PostgreSQL transaction. Instead, model payment state explicitly and design the workflow so failures can be handled safely.

The project should also demonstrate the difference between simple ORM operations and complex queries.

Use normal repository methods for straightforward operations.

Use QueryBuilder when the query requires more control.

Use parameterized raw SQL only when there is a real reason to use it.`,
    steps: [
      "Create a NestJS application connected to PostgreSQL.",
      "Create separate modules for users, products, orders, payments, and inventory.",
      "Create database entities for users, products, orders, order items, payments, and inventory records.",
      "Add primary keys, foreign keys, unique constraints, indexes, and appropriate database column types.",
      "Create repositories for the persistence operations required by each module.",
      "Keep simple CRUD operations straightforward rather than creating unnecessary abstractions.",
      "Introduce a repository interface for the order domain.",
      "Create a TypeORM repository implementation for the order repository.",
      "Create a mapper if the domain model and persistence model need to be separated.",
      "Create an application service responsible for the checkout workflow.",
      "Implement a transaction that creates an order and order items while updating inventory.",
      "Make sure all database operations belonging to the transaction use the transaction-scoped EntityManager.",
      "Model payment state such as PENDING, PAID, FAILED, and REFUNDED instead of assuming every payment succeeds immediately.",
      "Add validation so an order cannot be created when requested inventory is unavailable.",
      "Add a repository method such as findByEmail for users.",
      "Add a repository method such as findExpiredPendingOrders for order processing.",
      "Create at least one complex QueryBuilder query involving joins, filtering, and sorting.",
      "Create an analytics/reporting query that calculates information such as daily revenue or sales by product.",
      "Use parameter binding for every dynamic value in QueryBuilder and raw SQL.",
      "Inspect generated SQL for at least one important query.",
      "Use PostgreSQL EXPLAIN or EXPLAIN ANALYZE to investigate the execution plan of a performance-sensitive query.",
      "Add indexes based on actual query patterns rather than creating indexes on every column.",
      "Create unit tests for domain behavior without requiring a real database.",
      "Create repository integration tests using a real PostgreSQL database.",
      "Test that failed transactional operations roll back the related database changes.",
      "Test that insufficient inventory prevents the checkout operation.",
      "Test that the repository can load and persist the required domain state.",
      "Add a migration workflow so the database schema can be created and changed predictably.",
      "Document which parts of the application use simple ORM methods, QueryBuilder, and raw SQL.",
      "Review every abstraction and remove any repository, mapper, or service that does not solve a real problem.",
      "Add logging around important persistence operations without logging sensitive payment information.",
      "Document the final persistence architecture and explain why each layer exists.",
    ],
    acceptance: [
      "The NestJS application connects successfully to PostgreSQL.",
      "The application has separate modules for the major business areas.",
      "Database entities contain appropriate primary keys and relationships.",
      "Important foreign keys and unique constraints are enforced by the database.",
      "Frequently used query paths have appropriate indexes.",
      "The order workflow uses a transaction when multiple database changes must succeed together.",
      "All database operations inside the transaction use the transaction-scoped EntityManager or repositories.",
      "A failed critical operation causes the transaction to roll back.",
      "The application does not place all persistence logic directly inside controllers.",
      "Repositories provide meaningful persistence operations.",
      "At least one repository interface is separated from its TypeORM implementation.",
      "At least one domain object can be tested without a database connection.",
      "At least one complex query uses QueryBuilder.",
      "At least one specialized report demonstrates parameterized raw SQL or an equivalent database-specific query.",
      "Dynamic SQL values are parameterized rather than concatenated into SQL strings.",
      "The application avoids obvious N+1 query behavior in important endpoints.",
      "The application has integration tests for the PostgreSQL persistence layer.",
      "Database migrations can reproduce the expected schema.",
      "The project demonstrates a deliberate choice between simple ORM access, QueryBuilder, and raw SQL.",
      "The final architecture is understandable to another developer joining the project.",
    ],
    stretch: [
      "Introduce a formal UnitOfWork abstraction that coordinates multiple repositories while sharing one transaction.",
      "Create separate domain and ORM entities for the order module.",
      "Create explicit mapper functions between domain entities and TypeORM persistence entities.",
      "Implement optimistic locking for an inventory or product record.",
      "Implement pessimistic locking for a checkout path where concurrent inventory updates require row-level locking.",
      "Add idempotency keys to the checkout endpoint so retrying the same request does not create duplicate orders.",
      "Create an outbox table and persist domain events in the same database transaction as the business operation.",
      "Build a background worker that processes outbox events.",
      "Create a repository method optimized specifically for cursor-based pagination.",
      "Add a reporting query that compares current-period revenue with a previous period.",
      "Use EXPLAIN ANALYZE to compare a query before and after adding an index.",
      "Simulate concurrent checkout requests and verify that inventory cannot become incorrectly negative.",
      "Add retry handling for safe transient database failures while avoiding unsafe automatic retries of non-idempotent operations.",
      "Create contract tests ensuring that an in-memory repository and PostgreSQL repository satisfy the same repository behavior.",
      "Measure the number of SQL queries executed by a frequently used endpoint and eliminate unnecessary queries.",
      "Create a production migration procedure that supports zero-downtime schema changes.",
      "Add database health checks and connection-pool monitoring.",
      "Create a technical architecture document explaining why the project uses Active Record-like ORM behavior in some simple areas and stronger Data Mapper/repository boundaries in complex areas.",
    ],
  },
};
