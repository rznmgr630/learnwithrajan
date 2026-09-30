import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_32_LESSONS: LessonDay = {
  day: 32,
  title: "Transactions",
  totalMinutes: 125,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "acid-transactions",
      title: "ACID: the four rules that make transactions reliable",
      durationMinutes: 18,
      explanation: `A database transaction is a group of database operations that should behave like <b>one logical unit of work</b>.

Imagine an online store where a customer buys the last available iPhone.

The application may need to perform several operations:

1. Create the order.
2. Create the order item.
3. Decrease the product stock from 1 to 0.
4. Create a payment record.
5. Mark the order as paid.

If step 1 succeeds but step 3 fails, you do not want an order to exist without the stock being updated. If the payment record is created but the order is never created, your database becomes inconsistent.

A transaction gives you a way to say:

<b>"Either all of these database changes happen, or none of them happen."</b>

Transactions are commonly explained using the word <b>ACID</b>:

<b>Atomicity</b> means the transaction is treated as one unit. If something fails, the database can roll the transaction back.

<b>Consistency</b> means the transaction should move the database from one valid state to another valid state while respecting constraints and business rules.

<b>Isolation</b> controls how one transaction interacts with other transactions that are running at the same time.

<b>Durability</b> means that once a transaction is successfully committed, the database should preserve those changes even if the application later crashes.

### Beginner real-world example: transferring money

Suppose Alice has $100 and Bob has $50.

Alice sends Bob $20.

The application needs to:

- subtract $20 from Alice;
- add $20 to Bob.

Without a transaction, the first operation could succeed and the second could fail.

You would then have:

Alice: $80
Bob: $50

The $20 appears to have disappeared.

With a transaction:

- subtract $20;
- add $20;
- commit.

If either operation fails, the transaction rolls back.

The result is either:

Alice: $80
Bob: $70

or, if the transaction fails:

Alice: $100
Bob: $50

### Intermediate real-world example: creating an order

An ecommerce checkout may modify several tables:

\`orders\`
\`order_items\`
\`products\`
\`payments\`

The application can wrap these changes in one transaction so that a failed inventory update does not leave behind an incomplete checkout.

### Advanced real-world example: inventory reservation

Imagine only 2 concert tickets remain.

Two customers attempt to purchase them at almost exactly the same time.

Both requests may read:

\`availableTickets = 2\`

If both requests independently decide that two tickets are available, they may both attempt to reserve tickets.

Transactions combined with appropriate locking/isolation strategies can prevent the database from ending up with an impossible inventory state.

The important lesson is that a transaction is not simply a TypeORM feature. It is a <b>database consistency mechanism</b>. TypeORM provides APIs for controlling transactions, but PostgreSQL ultimately performs the transaction work.`,
      diagram: `Application
    |
    | BEGIN
    v
+-----------------------------+
|        Transaction          |
|                             |
|  INSERT order               |
|  INSERT order_item          |
|  UPDATE product stock       |
|  INSERT payment             |
|                             |
+-----------------------------+
    |
    +---- success ----> COMMIT
    |
    +---- failure ----> ROLLBACK

COMMIT:
All changes become permanent.

ROLLBACK:
Changes made inside the transaction are undone.`,
      codeExample: {
        title: "Basic TypeORM transaction",
        code: `import { DataSource } from "typeorm";

async function transferMoney(
  dataSource: DataSource,
  fromUserId: string,
  toUserId: string,
  amount: number,
) {
  await dataSource.transaction(async (manager) => {
    const sender = await manager.findOneByOrFail(User, {
      id: fromUserId,
    });

    const receiver = await manager.findOneByOrFail(User, {
      id: toUserId,
    });

    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await manager.save(sender);
    await manager.save(receiver);
  });
}`,
      },
      keyTakeaways: [
        "A transaction groups multiple database operations into one logical unit.",
        "ACID stands for Atomicity, Consistency, Isolation, and Durability.",
        "Atomicity means the transaction can succeed as a whole or be rolled back.",
        "Transactions are especially important when multiple related tables must change together.",
        "A transaction does not automatically solve every concurrency problem; isolation and locking may also be required.",
      ],
      commonMistakes: [
        "<b>Thinking a transaction means every query is automatically safe.</b> Isolation levels and locks still matter when concurrent requests interact.",
        "<b>Doing unrelated slow work inside a transaction.</b> Long transactions can hold locks and increase contention.",
        "<b>Calling an external API inside a database transaction and assuming the API call can roll back.</b> Database rollback cannot undo an email, HTTP request, payment gateway operation, or message already sent.",
        "<b>Using transactions for every single SELECT.</b> Transactions are useful when operations need coordinated consistency; they are not automatically required for every query.",
      ],
      quiz: [
        {
          question: "What does atomicity mean?",
          options: [
            "Queries always run faster",
            "A transaction behaves as one unit and can be rolled back",
            "Only SELECT queries are allowed",
            "Transactions never use locks",
          ],
          correctIndex: 1,
          explanation: "Atomicity means the transaction's operations are treated as one logical unit.",
        },
        {
          question: "What does the D in ACID represent?",
          options: [
            "Dependency",
            "Distribution",
            "Durability",
            "Delegation",
          ],
          correctIndex: 2,
          explanation: "Durability means committed changes are intended to survive later failures.",
        },
      ],
    },
    {
      id: "isolation-levels",
      title: "Isolation levels and concurrent transactions",
      durationMinutes: 20,
      explanation: `Isolation answers a difficult question:

<b>"What should one transaction be allowed to see while another transaction is changing the database?"</b>

This matters because real applications have many requests running simultaneously.

Imagine two customers try to purchase the same product at the same time.

Request A:
"How many units are available?"

Request B:
"How many units are available?"

If both requests see the same old value and both make decisions based on it, the application may oversell inventory.

PostgreSQL provides transaction isolation levels that control how concurrent transactions interact.

The commonly discussed levels are:

- Read Uncommitted
- Read Committed
- Repeatable Read
- Serializable

PostgreSQL treats Read Uncommitted effectively as Read Committed.

### Beginner real-world example: reading account balance

Suppose an account currently has $1,000.

Transaction A starts and reads the balance.

Meanwhile Transaction B changes the balance to $800 and commits.

Depending on the isolation behavior, a later query from Transaction A may see the newly committed value.

Understanding this behavior becomes important when one business operation performs multiple reads and expects those reads to represent a consistent view.

### Intermediate example: checkout inventory

Suppose a product has 5 units.

Transaction A reads 5.
Transaction B also reads 5.

Both decide they can purchase 4.

Without appropriate concurrency control, the system may attempt to sell 8 units.

The solution is not simply "always use Serializable."

Instead, you choose an appropriate combination of:

- transaction boundaries;
- isolation level;
- row locks;
- database constraints;
- application-level validation.

### Advanced example: financial reporting

Imagine a report calculates:

- total account balance;
- total number of accounts;
- total transactions.

If other transactions are changing those records while the report executes, the report may need a consistent snapshot depending on the requirements.

Higher isolation can provide stronger guarantees, but stronger guarantees can also increase contention and retry requirements.

This is why isolation is an architectural decision rather than just a configuration option.

### Read Committed

Read Committed is PostgreSQL's default isolation level.

A statement generally sees data committed before that statement begins.

This is often appropriate for normal web applications.

### Repeatable Read

Repeatable Read provides a stronger consistent view for a transaction.

A transaction can work from a stable snapshot rather than seeing arbitrary changes from concurrent transactions.

### Serializable

Serializable provides the strongest standard isolation level.

The goal is for concurrent transactions to behave as though they had executed one after another.

However, this does not mean your application never needs to handle failures. PostgreSQL can detect serialization conflicts and require the application to retry the transaction.

This is an important advanced concept:

<b>Stronger isolation can move some concurrency problems from silent incorrect results into explicit transaction failures that your application must handle.</b>`,
      diagram: `Transaction A                 Transaction B
     |                            |
     | BEGIN                      | BEGIN
     |                            |
     | READ product               |
     |                            | READ product
     |                            |
     | UPDATE product             |
     |                            |
     | COMMIT                     |
     |                            |
     |                            | COMMIT

Isolation determines what
each transaction can observe
during concurrent execution.`,
      codeExample: {
        title: "Setting an isolation level with TypeORM",
        code: `await dataSource.manager.transaction(
  "SERIALIZABLE",
  async (manager) => {
    const product = await manager.findOneByOrFail(Product, {
      id: productId,
    });

    if (product.stock <= 0) {
      throw new Error("Product is out of stock");
    }

    product.stock -= 1;

    await manager.save(product);
  },
);`,
      },
      keyTakeaways: [
        "Isolation controls how concurrent transactions interact.",
        "PostgreSQL's default isolation level is Read Committed.",
        "Higher isolation provides stronger consistency guarantees but can increase contention and transaction failures.",
        "Serializable transactions may need retry logic when serialization conflicts occur.",
        "Isolation should be selected according to the actual business consistency requirement.",
      ],
      commonMistakes: [
        "<b>Assuming Serializable is always the best answer.</b> It provides strong guarantees but can increase conflicts and retries.",
        "<b>Thinking isolation removes the need for application design.</b> You still need correct transaction boundaries and business rules.",
        "<b>Ignoring retry behavior.</b> Some concurrency failures are expected at stronger isolation levels.",
      ],
      quiz: [
        {
          question: "What does isolation primarily control?",
          options: [
            "How database tables are named",
            "How concurrent transactions interact",
            "How TypeScript is compiled",
            "How passwords are hashed",
          ],
          correctIndex: 1,
          explanation: "Isolation controls the visibility and interaction of concurrent transactions.",
        },
        {
          question: "What is PostgreSQL's default isolation level?",
          options: [
            "Serializable",
            "Repeatable Read",
            "Read Committed",
            "Read Uncommitted",
          ],
          correctIndex: 2,
          explanation: "PostgreSQL uses Read Committed by default.",
        },
      ],
    },
    {
      id: "commit-and-rollback",
      title: "Commit and rollback",
      durationMinutes: 15,
      explanation: `A transaction normally has two important outcomes:

<b>COMMIT</b> means the transaction succeeded and its changes become permanent.

<b>ROLLBACK</b> means the transaction failed or was intentionally cancelled and its database changes are undone.

Think about checkout.

You might perform:

1. Create order.
2. Create order items.
3. Decrease inventory.
4. Create payment record.

If everything succeeds:

\`COMMIT\`

If inventory validation fails:

\`ROLLBACK\`

The database returns to the state it had before the transaction began.

### Beginner real-world example: creating a user and profile

Suppose registration creates:

\`users\`
\`user_profiles\`

If the user is inserted but the profile insert fails, you probably do not want an incomplete registration.

A transaction can make both operations succeed or neither operation remain.

### Intermediate real-world example: checkout

A checkout may update five or more records.

If the payment record cannot be created, you may want to roll back the order and inventory changes.

However, there is an important boundary:

<b>Rollback only controls work performed inside the database transaction.</b>

If your application already sent an email, called Stripe, published a message to another system, or made an HTTP request, rolling back PostgreSQL does not magically undo those external actions.

### Advanced real-world example: payment processing

Suppose you:

1. Create an order in PostgreSQL.
2. Call a payment provider.
3. Payment succeeds.
4. PostgreSQL transaction fails.

You now have a payment that succeeded but an order transaction that rolled back.

This is why mature payment systems often use patterns such as:

- idempotency keys;
- payment state machines;
- outbox patterns;
- webhooks;
- retry processing;
- reconciliation jobs.

A database transaction is powerful, but it is not a distributed transaction across every service your application talks to.

### Manual transaction control

TypeORM allows you to explicitly create a QueryRunner when you need detailed control.

This is useful when you need to decide exactly when the transaction begins, commits, or rolls back.`,
      diagram: `BEGIN
  |
  +--> Operation 1
  |
  +--> Operation 2
  |
  +--> Operation 3
  |
  +---- success ----> COMMIT
  |
  +---- failure ----> ROLLBACK

Before transaction:
Database = State A

After COMMIT:
Database = State B

After ROLLBACK:
Database = State A`,
      codeExample: {
        title: "Explicit commit and rollback with QueryRunner",
        code: `const queryRunner = dataSource.createQueryRunner();

await queryRunner.connect();
await queryRunner.startTransaction();

try {
  await queryRunner.manager.save(order);

  await queryRunner.manager.save(orderItem);

  await queryRunner.manager.decrement(
    Product,
    { id: productId },
    "stock",
    1,
  );

  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction();
  throw error;
} finally {
  await queryRunner.release();
}`,
      },
      keyTakeaways: [
        "COMMIT makes the transaction's database changes permanent.",
        "ROLLBACK undoes database changes made by the transaction.",
        "TypeORM's transaction callback automatically handles commit and rollback when an error is thrown.",
        "QueryRunner gives you explicit transaction lifecycle control.",
        "Database rollback cannot automatically undo external side effects.",
      ],
      commonMistakes: [
        "<b>Forgetting to rollback in manual transaction code.</b> Use try/catch/finally carefully.",
        "<b>Forgetting to release QueryRunner.</b> Always release it in finally.",
        "<b>Catching an error and not rethrowing it when using a transaction callback.</b> Swallowing errors can accidentally allow a transaction to complete.",
        "<b>Assuming rollback reverses an external API call.</b> Database transactions do not control external systems.",
      ],
      quiz: [
        {
          question: "What does COMMIT do?",
          options: [
            "Deletes the database",
            "Makes successful transaction changes permanent",
            "Starts a server",
            "Creates a migration",
          ],
          correctIndex: 1,
          explanation: "COMMIT confirms the transaction's changes.",
        },
        {
          question: "What should happen after an error in a manually controlled transaction?",
          options: [
            "Ignore the error",
            "Commit anyway",
            "Rollback and release the QueryRunner",
            "Restart PostgreSQL",
          ],
          correctIndex: 2,
          explanation: "Manual transactions should rollback on failure and release resources.",
        },
      ],
    },
    {
      id: "deadlocks",
      title: "Deadlocks: when transactions wait for each other",
      durationMinutes: 17,
      explanation: `A deadlock happens when two or more transactions are waiting for each other in a way that prevents them from continuing.

Consider two bank accounts:

Account A
Account B

Transaction 1 locks A and then tries to lock B.

Transaction 2 locks B and then tries to lock A.

Now:

Transaction 1 is waiting for B.
Transaction 2 is waiting for A.

Neither can continue.

That is a deadlock.

PostgreSQL can detect deadlocks and abort one of the transactions so the other can continue.

### Beginner real-world example

Imagine two people entering two narrow rooms.

Person 1 enters Room A and waits for Room B.

Person 2 enters Room B and waits for Room A.

Nobody can proceed.

Database locks can create a similar situation.

### Intermediate example: transferring money

Suppose transaction A transfers money from Account 1 to Account 2.

Transaction B transfers money from Account 2 to Account 1.

If each transaction locks its source account first, they can potentially acquire locks in opposite orders.

A safer pattern is to establish a consistent ordering.

For example:

Always lock the account with the smaller ID first.

Then both transactions follow:

1. Lock smaller account ID.
2. Lock larger account ID.
3. Perform transfer.
4. Commit.

This greatly reduces the chance of this particular deadlock pattern.

### Advanced example: large business workflow

Imagine an order transaction modifies:

- customer;
- inventory;
- order;
- payment;
- shipment.

Another transaction modifies the same resources but in a different order.

The more resources a transaction locks and the longer it holds those locks, the more complicated concurrency becomes.

Good transaction design therefore tries to:

- keep transactions short;
- acquire resources in a consistent order;
- avoid unnecessary database work inside transactions;
- avoid network calls while holding database locks;
- retry transactions when appropriate.

### Important point

Deadlocks are not necessarily evidence that PostgreSQL is broken.

They are a normal possibility in concurrent systems.

A robust application anticipates them and handles retryable transaction failures appropriately.`,
      diagram: `Transaction A                 Transaction B
     |                            |
 Lock Account 1               Lock Account 2
     |                            |
     |---- wants Account 2        |
     |                            |
     |                    wants Account 1
     |                            |
     +--------- WAIT <------------+
     
Deadlock detected.

Database aborts one transaction
so the other can continue.`,
      codeExample: {
        title: "Consistent locking order",
        code: `async function transfer(
  dataSource: DataSource,
  accountIdA: string,
  accountIdB: string,
  amount: number,
) {
  await dataSource.manager.transaction(
    async (manager) => {
      const ids = [accountIdA, accountIdB].sort();

      const first = await manager.findOne(Account, {
        where: { id: ids[0] },
        lock: { mode: "pessimistic_write" },
      });

      const second = await manager.findOne(Account, {
        where: { id: ids[1] },
        lock: { mode: "pessimistic_write" },
      });

      if (!first || !second) {
        throw new Error("Account not found");
      }

      const sender =
        first.id === accountIdA ? first : second;

      const receiver =
        first.id === accountIdA ? second : first;

      if (sender.balance < amount) {
        throw new Error("Insufficient balance");
      }

      sender.balance -= amount;
      receiver.balance += amount;

      await manager.save([sender, receiver]);
    },
  );
}`,
      },
      keyTakeaways: [
        "A deadlock occurs when transactions wait for each other in a cycle.",
        "PostgreSQL can detect deadlocks and abort one transaction.",
        "Consistent resource-locking order can reduce deadlock risk.",
        "Short transactions generally reduce lock contention.",
        "Applications should consider retrying safe, retryable transactions.",
      ],
      commonMistakes: [
        "<b>Locking records in different orders in different services.</b> Establish consistent ordering for shared resources.",
        "<b>Keeping a transaction open while calling an external API.</b> Network delays can cause locks to remain held unnecessarily.",
        "<b>Assuming deadlocks can never happen.</b> Concurrent systems need defensive handling.",
        "<b>Retrying every error blindly.</b> Only retry errors that are safe and appropriate to retry.",
      ],
      quiz: [
        {
          question: "What is a deadlock?",
          options: [
            "A successful transaction",
            "A situation where transactions wait on each other indefinitely until the database resolves the conflict",
            "A missing database table",
            "A TypeScript compiler error",
          ],
          correctIndex: 1,
          explanation: "A deadlock occurs when transactions form a cycle of resource waits.",
        },
        {
          question: "Which technique can reduce deadlock risk?",
          options: [
            "Acquire shared resources in a consistent order",
            "Never commit transactions",
            "Use random lock ordering",
            "Add more API requests",
          ],
          correctIndex: 0,
          explanation: "Consistent lock ordering helps prevent circular wait patterns.",
        },
      ],
    },
    {
      id: "locks",
      title: "Database locks: controlling concurrent changes",
      durationMinutes: 17,
      explanation: `A database lock is a mechanism used to coordinate access to data when multiple transactions are working at the same time.

Locks become important when two requests might modify or depend on the same database row.

Imagine a product with:

\`stock = 1\`

Two customers click "Buy" at the same time.

Both requests need to inspect and modify that product.

A lock can make one transaction wait while another transaction works with the row.

### Beginner real-world example: last item in stock

Customer A starts checkout.

The transaction locks the product row.

Customer B starts checkout.

Customer B attempts to acquire the same lock and must wait.

Customer A decreases stock and commits.

Customer B can then continue and see the updated state.

This can help prevent both customers from independently modifying the same inventory row.

### Intermediate example: order processing

Suppose an order has status:

\`PENDING\`

A worker starts processing it.

Another worker accidentally picks up the same order.

Without concurrency control, both workers may perform the same work.

A row lock can help coordinate access.

### Advanced example: job queue workers

Imagine 10 workers process pending jobs.

Each worker needs to claim one job.

A common database approach is to lock selected rows and use behavior such as \`SKIP LOCKED\`.

Worker A locks Job 101.

Worker B looks for pending jobs and skips Job 101 instead of waiting for it.

Worker B can process Job 102.

This can be very useful for database-backed job queues.

### Pessimistic locking

Pessimistic locking assumes:

<b>"A conflict might happen, so lock the row before I work with it."</b>

This is useful when the protected operation must not overlap with another transaction.

### Important distinction

A lock is not the same thing as a transaction.

A transaction defines the unit of work.

A lock controls concurrent access to resources during that work.

They often work together.`,
      diagram: `Worker A                     Worker B
   |                              |
BEGIN                          BEGIN
   |                              |
LOCK row 101                       |
   |                              |
UPDATE row 101                     |
   |                              |
COMMIT                             |
                                  |
                              LOCK row 101
                                  |
                              Continue

Worker B waits until the
conflicting lock is released.`,
      codeExample: {
        title: "Pessimistic write lock with TypeORM",
        code: `await dataSource.manager.transaction(
  async (manager) => {
    const product = await manager.findOne(Product, {
      where: { id: productId },
      lock: {
        mode: "pessimistic_write",
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock <= 0) {
      throw new Error("Out of stock");
    }

    product.stock -= 1;

    await manager.save(product);
  },
);`,
      },
      keyTakeaways: [
        "Locks coordinate concurrent access to database resources.",
        "Pessimistic locking acquires a lock before performing protected work.",
        "Locks normally make sense inside transactions.",
        "Locks can prevent race conditions but can also increase waiting and contention.",
        "Keep lock-holding transactions as short as practical.",
      ],
      commonMistakes: [
        "<b>Holding locks while making network requests.</b> External calls can take unpredictable amounts of time.",
        "<b>Using locks without understanding transaction boundaries.</b> The lock's lifetime is connected to the database transaction.",
        "<b>Assuming locking automatically solves every race condition.</b> The application still needs correct transaction design.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a database lock?",
          options: [
            "To format SQL",
            "To coordinate concurrent access to database resources",
            "To generate TypeScript",
            "To create REST routes",
          ],
          correctIndex: 1,
          explanation: "Locks coordinate access when concurrent transactions interact with the same resources.",
        },
        {
          question: "What does pessimistic locking generally mean?",
          options: [
            "Assume conflicts are possible and acquire a lock before protected work",
            "Never use transactions",
            "Only read data",
            "Delete conflicting rows",
          ],
          correctIndex: 0,
          explanation: "Pessimistic locking protects a resource by locking it before performing the critical operation.",
        },
      ],
    },
    {
      id: "optimistic-locking",
      title: "Optimistic locking: detect conflicts instead of waiting",
      durationMinutes: 18,
      explanation: `Optimistic locking takes a different approach from pessimistic locking.

Instead of immediately locking the row, optimistic locking assumes that conflicts are relatively uncommon.

The application reads a record together with a version number.

For example:

\`id = 42\`
\`name = "Laptop"\`
\`version = 7\`

A user edits the laptop.

Another user also edits the laptop.

Both initially see version 7.

User A saves first.

The record becomes version 8.

User B then attempts to save changes based on version 7.

The application detects that the version has changed and rejects or asks the user to reload.

This prevents User B from silently overwriting User A's newer changes.

### Beginner real-world example: editing a profile

Two browser tabs are editing the same customer profile.

Tab A changes the phone number.

Tab B changes the address.

Both tabs loaded version 5.

Tab A saves and creates version 6.

Tab B tries to save version 5.

The application can detect the conflict.

Without optimistic locking, Tab B might overwrite the entire record using stale information.

### Intermediate example: product administration

An administrator changes a product price.

Another administrator changes the same product at almost the same time.

The version field can identify that the second administrator is working with stale data.

Instead of silently overwriting the first administrator's changes, the application can return a conflict.

### Advanced example: document editing

Optimistic concurrency is useful in systems where users read records for a while before saving them.

Examples include:

- CRM records;
- support tickets;
- product configuration;
- content management systems;
- administrative dashboards.

In these situations, holding a database lock for the entire time the user is editing would be a terrible design.

The user might leave the page open for 30 minutes.

You do not want a database row locked for 30 minutes.

Optimistic locking allows the application to keep the database free while still detecting stale updates.

### Version-based thinking

The basic idea is:

Read:

\`version = 10\`

Later update only if:

\`version = 10\`

If the update succeeds:

\`version = 11\`

If zero rows are updated:

another transaction already changed the record.

The application can then return something such as:

\`409 Conflict\`

and ask the client to refresh or merge the changes.

### Important distinction

Optimistic locking is about <b>detecting conflicting updates</b>.

Pessimistic locking is about <b>preventing conflicting work by locking first</b>.

Neither strategy is universally better.

The correct choice depends on the workload and business rules.`,
      diagram: `Initial record
version = 5
     |
     +----------+
     |          |
   User A     User B
     |          |
   Edit       Edit
     |          |
 Save v5       |
     |          |
version = 6    |
     |          |
     |        Save v5
     |          |
     |      CONFLICT
     |          |
     +----------+

User B was editing stale data.`,
      codeExample: {
        title: "Optimistic version check with a version column",
        code: `const result = await dataSource
  .createQueryBuilder()
  .update(Product)
  .set({
    price: newPrice,
    version: currentVersion + 1,
  })
  .where("id = :id", { id: productId })
  .andWhere("version = :version", {
    version: currentVersion,
  })
  .execute();

if (result.affected !== 1) {
  throw new Error(
    "Product was changed by another user. Please reload and try again.",
  );
}`,
      },
      keyTakeaways: [
        "Optimistic locking detects stale updates rather than blocking them upfront.",
        "A version number is a common way to detect whether a record changed.",
        "Optimistic locking is useful for records that users may edit for a long time.",
        "A failed version check can be represented as a conflict that the client must handle.",
        "Optimistic and pessimistic locking solve concurrency problems in different ways.",
      ],
      commonMistakes: [
        "<b>Checking the version separately from the UPDATE.</b> The version check should be part of the atomic database operation.",
        "<b>Ignoring the affected-row count.</b> Affected rows tell you whether the expected version still matched.",
        "<b>Using optimistic locking for every workload.</b> Some high-contention operations may be better protected with database locks.",
      ],
      quiz: [
        {
          question: "What does optimistic locking primarily detect?",
          options: [
            "Stale concurrent updates",
            "Missing TypeScript imports",
            "Network latency",
            "Invalid JSON syntax",
          ],
          correctIndex: 0,
          explanation: "Optimistic locking detects that another operation changed the record since it was read.",
        },
        {
          question: "Why is optimistic locking useful for long user edits?",
          options: [
            "It keeps a database row locked while the user thinks",
            "It allows editing without holding a database lock for the entire editing period",
            "It removes the database",
            "It disables transactions",
          ],
          correctIndex: 1,
          explanation: "Optimistic locking lets users edit without holding database locks and checks for conflicts when saving.",
        },
      ],
    },
    {
      id: "advanced-transaction-service",
      title: "Putting transactions, locks, and concurrency together",
      durationMinutes: 20,
      explanation: `Now combine the concepts into one realistic NestJS service.

Imagine an ecommerce application where a customer purchases one unit of a product.

The operation has several requirements:

1. The product must exist.
2. The product must have stock.
3. Stock must decrease.
4. An order must be created.
5. An order item must be created.
6. The operation must be atomic.
7. Two customers must not both purchase the last unit.
8. The transaction should not remain open longer than necessary.

This is where transaction design becomes more important than simply knowing the API syntax.

### Beginner approach

Start with a transaction:

\`BEGIN\`

Read product.

Check stock.

Decrease stock.

Create order.

Create order item.

\`COMMIT\`

If something fails:

\`ROLLBACK\`

### Intermediate approach

Now think about concurrency.

What happens if two customers purchase the last item simultaneously?

A simple read followed by an update may have a race condition.

Use a pessimistic write lock when reading the product row.

Now only one transaction can modify the protected product row at a time.

### Advanced approach

Now consider production behavior.

You should also think about:

- deadlocks;
- transaction retries;
- idempotency;
- database constraints;
- external payment calls;
- event publishing;
- transaction duration;
- observability;
- failure recovery.

For example, you should not normally do this:

\`BEGIN\`

Lock product.

Call payment provider.

Wait 3 seconds.

Wait for payment provider.

Create order.

\`COMMIT\`

The database lock is being held while waiting for an external system.

A better architecture may separate payment authorization from the database transaction and use explicit order/payment states.

For example:

\`PENDING_PAYMENT\`
\`PAYMENT_AUTHORIZED\`
\`CONFIRMED\`
\`PAYMENT_FAILED\`

This allows the system to model a distributed workflow instead of pretending that one PostgreSQL transaction controls the entire world.

### Idempotency

Imagine the customer clicks "Pay" twice.

Or the browser retries because the network response was lost.

Your API should not accidentally create two orders.

An idempotency key can help.

The application can store the key and associate it with the resulting operation.

A repeated request with the same key can return the existing result instead of performing the purchase again.

### Database constraints

Application checks are useful, but database constraints are another line of defense.

For example:

- foreign keys protect relationships;
- unique constraints prevent duplicate values;
- check constraints can enforce valid numeric values.

A robust system usually uses both application logic and database constraints.

### Transaction retry

Some transaction failures are transient.

Examples include:

- deadlocks;
- serialization failures;
- temporary connection problems.

A retry mechanism can rerun the transaction when the failure is known to be safe to retry.

However, the transaction callback must be designed so repeating it does not create duplicate external side effects.

### Observability

Production transaction problems are much easier to diagnose if you record useful information such as:

- transaction duration;
- query duration;
- affected entity;
- retry count;
- deadlock errors;
- serialization failures;
- request ID;
- order ID.

This turns "checkout sometimes fails" into something engineers can investigate.`,
      diagram: `HTTP Request
     |
     v
OrderService
     |
     | transaction
     v
+----------------------+
| BEGIN                |
|                      |
| lock product         |
| validate stock       |
| create order         |
| create order item    |
| decrease inventory   |
|                      |
+----------------------+
     |
     +---- success ---> COMMIT
     |
     +---- conflict --> retry/fail
     |
     +---- error -----> ROLLBACK

External payment system
should not be assumed to
participate in the PostgreSQL
transaction.`,
      codeExample: {
        title: "Production-style order transaction",
        code: `async createOrder(
  userId: string,
  productId: string,
  quantity: number,
) {
  if (quantity <= 0) {
    throw new BadRequestException(
      "Quantity must be greater than zero",
    );
  }

  return this.dataSource.transaction(
    async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id: productId },
        lock: {
          mode: "pessimistic_write",
        },
      });

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      if (product.stock < quantity) {
        throw new BadRequestException(
          "Not enough inventory",
        );
      }

      const order = manager.create(Order, {
        userId,
        status: "PENDING_PAYMENT",
        total: product.price * quantity,
      });

      await manager.save(order);

      const item = manager.create(OrderItem, {
        orderId: order.id,
        productId: product.id,
        quantity,
        unitPrice: product.price,
      });

      await manager.save(item);

      product.stock -= quantity;

      await manager.save(product);

      return order;
    },
  );
}`,
      },
      keyTakeaways: [
        "Real transaction design combines atomicity, isolation, locking, constraints, and application logic.",
        "A transaction should contain the smallest set of database operations that must succeed together.",
        "External services should not normally be treated as if they participate in the PostgreSQL transaction.",
        "Idempotency is important for operations such as payments and order creation.",
        "Production systems should consider deadlocks, serialization failures, retries, and observability.",
      ],
      commonMistakes: [
        "<b>Calling a payment provider while holding a database lock.</b> Keep database transactions short.",
        "<b>Creating duplicate orders after a client retry.</b> Use idempotency where the operation can be retried.",
        "<b>Relying only on application checks.</b> Use appropriate database constraints as additional protection.",
        "<b>Retrying transactions containing non-idempotent external side effects.</b> A database retry can accidentally repeat an external operation.",
        "<b>Making one huge transaction for an entire business workflow.</b> Separate database atomicity from long-running distributed workflows.",
      ],
      quiz: [
        {
          question: "Why should an external payment call usually not be performed while holding a database lock?",
          options: [
            "Because TypeScript cannot call APIs",
            "Because the external call can take time and unnecessarily keep database locks open",
            "Because transactions cannot contain INSERT statements",
            "Because PostgreSQL does not support services",
          ],
          correctIndex: 1,
          explanation: "External calls can be slow or unpredictable, increasing lock duration and contention.",
        },
        {
          question: "What helps prevent duplicate processing when a client retries an order request?",
          options: [
            "Idempotency",
            "Random SQL",
            "Removing primary keys",
            "Disabling transactions",
          ],
          correctIndex: 0,
          explanation: "Idempotency allows repeated requests to be recognized as the same logical operation.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What does ACID stand for?",
      options: [
        "Atomicity, Consistency, Isolation, Durability",
        "Authentication, Caching, Indexing, Distribution",
        "Application, Controller, Interface, Database",
        "Async, Cache, Integration, Deployment",
      ],
      correctIndex: 0,
      explanation: "ACID describes four important transaction properties: Atomicity, Consistency, Isolation, and Durability.",
    },
    {
      question: "What does atomicity mean?",
      options: [
        "A transaction's operations are treated as one logical unit",
        "Every query runs concurrently",
        "Every table must have an index",
        "Only SELECT statements can run",
      ],
      correctIndex: 0,
      explanation: "Atomicity means the transaction succeeds as a unit or can be rolled back as a unit.",
    },
    {
      question: "What is PostgreSQL's default transaction isolation level?",
      options: [
        "Serializable",
        "Repeatable Read",
        "Read Committed",
        "Read Uncommitted",
      ],
      correctIndex: 2,
      explanation: "PostgreSQL uses Read Committed as its default isolation level.",
    },
    {
      question: "What does COMMIT do?",
      options: [
        "Makes the transaction's successful changes permanent",
        "Deletes all changes",
        "Starts another server",
        "Creates an entity",
      ],
      correctIndex: 0,
      explanation: "COMMIT successfully completes the transaction and makes its database changes durable.",
    },
    {
      question: "What does ROLLBACK do?",
      options: [
        "Undoes database changes made by the transaction",
        "Creates a new table",
        "Locks every table",
        "Changes the isolation level",
      ],
      correctIndex: 0,
      explanation: "ROLLBACK cancels the transaction and reverses its database changes.",
    },
    {
      question: "What is a deadlock?",
      options: [
        "A TypeScript syntax error",
        "A cycle where transactions wait for resources held by each other",
        "A successful transaction",
        "A missing primary key",
      ],
      correctIndex: 1,
      explanation: "A deadlock occurs when transactions form a circular dependency while waiting for resources.",
    },
    {
      question: "Which technique can reduce deadlock risk?",
      options: [
        "Acquire shared resources in a consistent order",
        "Hold transactions open indefinitely",
        "Use random locking order",
        "Disable database constraints",
      ],
      correctIndex: 0,
      explanation: "Consistent resource ordering reduces circular wait patterns.",
    },
    {
      question: "What does pessimistic locking do?",
      options: [
        "Acquires a lock before protected concurrent work",
        "Never uses database locks",
        "Only checks TypeScript types",
        "Always retries failed HTTP requests",
      ],
      correctIndex: 0,
      explanation: "Pessimistic locking assumes conflicts are possible and protects the resource by locking it.",
    },
    {
      question: "What does optimistic locking generally use to detect stale updates?",
      options: [
        "A version or equivalent concurrency value",
        "A random password",
        "A controller decorator",
        "A database restart",
      ],
      correctIndex: 0,
      explanation: "Optimistic locking commonly compares a version value so stale updates can be detected.",
    },
    {
      question: "Why is optimistic locking useful for long-running user edits?",
      options: [
        "It avoids holding a database lock while the user is editing",
        "It permanently locks the record",
        "It disables concurrency",
        "It removes the need for a database",
      ],
      correctIndex: 0,
      explanation: "Optimistic locking allows editing without keeping a database lock open for the entire editing period.",
    },
    {
      question: "What should usually happen to a QueryRunner after a manual transaction finishes?",
      options: [
        "It should be released",
        "It should remain open forever",
        "It should be converted into an entity",
        "It should be stored in localStorage",
      ],
      correctIndex: 0,
      explanation: "QueryRunner resources should be released, normally in a finally block.",
    },
    {
      question: "Can a PostgreSQL rollback automatically undo an email that was already sent?",
      options: [
        "Yes",
        "No",
        "Only with TypeScript",
        "Only with NestJS guards",
      ],
      correctIndex: 1,
      explanation: "Database rollback controls database work, not external side effects such as emails.",
    },
    {
      question: "Why should long external API calls generally not happen while holding database locks?",
      options: [
        "They can keep locks open longer and increase contention",
        "PostgreSQL cannot store strings",
        "Transactions cannot use UPDATE",
        "TypeORM cannot make HTTP requests",
      ],
      correctIndex: 0,
      explanation: "Slow external operations can unnecessarily extend transaction and lock duration.",
    },
    {
      question: "What is idempotency useful for in an order or payment API?",
      options: [
        "Preventing repeated requests from creating duplicate logical operations",
        "Making SQL invalid",
        "Removing transactions",
        "Disabling database constraints",
      ],
      correctIndex: 0,
      explanation: "Idempotency allows retries to be handled without accidentally performing the same logical operation multiple times.",
    },
    {
      question: "Which statement best describes isolation?",
      options: [
        "It controls how concurrent transactions interact and observe changes",
        "It controls TypeScript compilation",
        "It defines entity names",
        "It creates database indexes",
      ],
      correctIndex: 0,
      explanation: "Isolation defines important rules for concurrent transaction visibility and interaction.",
    },
  ],
  project: {
    name: "Concurrent ecommerce checkout",
    goal: "Build a transaction-safe NestJS checkout flow that handles inventory concurrency, rollback, locking, and realistic transaction failures.",
    brief: "Create an ecommerce checkout service where customers can purchase products without overselling inventory. Use TypeORM transactions, pessimistic locking for inventory, database constraints, explicit transaction boundaries, and application-level error handling. Then add an optimistic-locking example for an administrator editing product information.",
    steps: [
      "Create Product, Order, and OrderItem entities.",
      "Give Product a stock field and enforce that stock cannot become negative.",
      "Create an Order status such as PENDING_PAYMENT, CONFIRMED, and CANCELLED.",
      "Create an OrderItem relationship to the Order and Product.",
      "Implement checkout using a TypeORM transaction.",
      "Lock the product row with pessimistic_write before checking and decreasing inventory.",
      "Validate that the requested quantity is greater than zero.",
      "Validate that enough inventory exists.",
      "Create the order and order item inside the same database transaction.",
      "Decrease inventory inside the same transaction.",
      "Allow an exception to trigger rollback.",
      "Verify that a failed order does not leave an order item or inventory update behind.",
      "Create a manual QueryRunner example that explicitly demonstrates BEGIN, COMMIT, ROLLBACK, and release.",
      "Create a product version field for optimistic concurrency control.",
      "Implement an update operation that changes the product only when the expected version still matches.",
      "Return a conflict when an administrator tries to update stale product data.",
      "Create a simulated deadlock scenario using two transactions that lock resources in opposite orders.",
      "Refactor the locking order so shared resources are acquired consistently.",
      "Add retry handling for errors that your application determines are safe to retry.",
      "Add an idempotency key to the checkout request so a repeated request does not create duplicate orders.",
      "Measure and log transaction duration during development.",
      "Keep external payment API calls outside the critical database lock whenever the business workflow allows it.",
    ],
    acceptance: [
      "The checkout operation uses a database transaction.",
      "Product inventory and order creation are committed or rolled back together.",
      "The product row is protected against concurrent purchases.",
      "The application cannot intentionally create negative inventory.",
      "A failed checkout does not leave behind a partial order.",
      "A QueryRunner example correctly handles commit, rollback, and release.",
      "An optimistic version check detects stale product updates.",
      "The application distinguishes transaction conflicts from ordinary validation errors.",
      "The implementation does not hold database locks while waiting unnecessarily for external services.",
      "Repeated checkout requests can be handled safely using an idempotency strategy.",
      "The code demonstrates awareness of deadlocks and retryable transaction failures.",
    ],
    stretch: [
      "Implement a reusable transaction retry helper for selected PostgreSQL deadlock or serialization errors.",
      "Add a database-backed idempotency table with a unique idempotency key.",
      "Implement an outbox table so domain events can be stored in the same transaction as the order.",
      "Create a worker that publishes outbox events after the transaction commits.",
      "Add a checkout state machine for PENDING_PAYMENT, PAYMENT_AUTHORIZED, CONFIRMED, and PAYMENT_FAILED.",
      "Implement a job queue using PostgreSQL row locks and SKIP LOCKED.",
      "Compare the behavior of Read Committed and Serializable transactions with a concurrency test.",
      "Write integration tests that execute two concurrent checkout requests against the last unit of inventory.",
      "Write tests proving that only one concurrent purchase can successfully reserve the final inventory unit.",
      "Write a test that demonstrates optimistic locking rejecting a stale administrator update.",
      "Add structured logging for transaction duration, retries, deadlocks, and serialization failures.",
    ],
  },
};
