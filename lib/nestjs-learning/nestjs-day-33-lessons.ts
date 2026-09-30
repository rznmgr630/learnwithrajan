import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_33_LESSONS: LessonDay = {
  day: 33,
  title: "Database Performance",
  totalMinutes: 135,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "database-indexes",
      title: "Indexes: making database lookups faster",
      durationMinutes: 20,
      explanation: `A database index is a data structure that helps the database find rows without scanning every row in a table.

Think about a library.

Imagine a library has 500,000 books.

If you ask:

<b>"Find every book written by Martin Fowler."</b>

A very simple approach would be to look at every book one by one.

That means:

Book 1 → check author.
Book 2 → check author.
Book 3 → check author.
...
Book 500,000 → check author.

This is similar to a database performing a sequential scan.

An index is more like the index at the back of a textbook.

Instead of reading the entire book to find a topic, you use the index to jump closer to the information you need.

### Beginner real-world example: finding a user by email

Imagine your users table contains 5 million users.

Your application frequently executes:

\`SELECT * FROM users WHERE email = 'john@example.com';\`

Without an appropriate index, PostgreSQL may need to inspect a large number of rows.

With an index on \`email\`, PostgreSQL can use the index to locate the matching row much more efficiently.

### Intermediate real-world example: order lookup

An ecommerce application frequently needs:

"Show all orders belonging to customer 123."

You may have:

\`orders.user_id\`

If this query happens frequently, an index on \`user_id\` can make the lookup much faster.

### Advanced real-world example: status-based background workers

Imagine your application has millions of jobs.

Workers frequently ask:

\`WHERE status = 'PENDING'\`

An index can help the database locate candidate rows without scanning the entire table.

However, indexes are not free.

Every index consumes storage.

When you INSERT, UPDATE, or DELETE rows, PostgreSQL may also need to update the indexes.

So the goal is not:

<b>"Create an index on every column."</b>

The goal is:

<b>"Create indexes that support the queries the application actually performs."</b>

### Index selectivity

Suppose you have a table with 10 million users and a \`country\` column.

If 30% of users are from the United States, an index on country may or may not be useful for every query.

Now imagine a unique \`email\` column.

Almost every email points to one row.

That is highly selective and often a very useful index candidate.

### Indexes and ORDER BY

Indexes can also help sorting.

For example:

\`ORDER BY created_at DESC\`

An appropriate index may allow PostgreSQL to retrieve rows in an order that is useful for the query.

This becomes particularly important for pagination.

### Indexes and foreign keys

Foreign-key columns are often good index candidates because applications frequently query related records.

For example:

\`orders.user_id\`

If the application frequently asks:

"Give me all orders for this user."

An index on \`user_id\` can be valuable.

### The important performance lesson

Do not guess that an index is helping.

Use the database's query plan tools to inspect what PostgreSQL is actually doing.`,
      diagram: `Without index:

Query
  |
  v
+-----+-----+-----+-----+-----+
| row | row | row | row | ... |
+-----+-----+-----+-----+-----+
  |     |     |     |
 check check check
 every row

With index:

Query
  |
  v
Index
  |
  +----> matching row(s)

The index helps the database
find relevant rows faster.`,
      codeExample: {
        title: "Creating indexes with TypeORM",
        code: `import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
@Index(["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;
}`,
      },
      keyTakeaways: [
        "Indexes help databases find and sometimes order rows more efficiently.",
        "Indexes can significantly improve frequently executed lookup queries.",
        "Indexes consume storage and add work to INSERT, UPDATE, and DELETE operations.",
        "Foreign-key columns are often useful index candidates when they are frequently queried.",
        "You should validate index usefulness with query plans instead of guessing.",
      ],
      commonMistakes: [
        "<b>Adding an index to every column.</b> Indexes have storage and write-maintenance costs.",
        "<b>Assuming every query automatically becomes fast.</b> The optimizer decides whether an index is useful.",
        "<b>Ignoring actual query patterns.</b> Index design should be based on how the application reads data.",
        "<b>Creating an index but never checking the query plan.</b> Verify that PostgreSQL actually uses an appropriate access strategy.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a database index?",
          options: [
            "To make every INSERT slower",
            "To help the database find rows efficiently",
            "To replace transactions",
            "To remove foreign keys",
          ],
          correctIndex: 1,
          explanation: "Indexes provide data structures that can help the database locate rows more efficiently.",
        },
        {
          question: "Why should you avoid indexing every column?",
          options: [
            "Indexes are illegal on most columns",
            "Indexes consume storage and add write-maintenance work",
            "Indexes prevent SELECT queries",
            "Indexes disable PostgreSQL",
          ],
          correctIndex: 1,
          explanation: "Indexes improve some reads but have storage and write costs.",
        },
      ],
    },
    {
      id: "composite-indexes",
      title: "Composite indexes: indexing multiple columns together",
      durationMinutes: 18,
      explanation: `A composite index is an index that contains more than one column.

For example:

\`(user_id, created_at)\`

This can be extremely useful when your application frequently filters by one column and sorts or filters by another.

Imagine an ecommerce application.

A common query is:

"Show the newest orders for this customer."

The query might look like:

\`WHERE user_id = ? ORDER BY created_at DESC\`

An index on:

\`(user_id, created_at)\`

can be designed specifically around that access pattern.

### Beginner real-world example

Suppose you have:

\`orders(user_id, created_at)\`

Your application frequently asks:

\`WHERE user_id = '123' ORDER BY created_at DESC\`

A composite index can help PostgreSQL locate the user's orders and access them in the required order.

### Intermediate real-world example: multi-tenant SaaS

Imagine a SaaS application where every table contains:

\`tenant_id\`

and:

\`created_at\`

Most queries look like:

\`WHERE tenant_id = ? ORDER BY created_at DESC\`

A composite index such as:

\`(tenant_id, created_at)\`

can match that access pattern.

This is especially important in multi-tenant systems because every query must first narrow down to the correct tenant.

### Advanced concept: column order matters

Consider:

\`INDEX(tenant_id, created_at)\`

This is not exactly equivalent to:

\`INDEX(created_at, tenant_id)\`

The order affects which queries can efficiently use the index.

A useful way to think about a composite index is a sorted structure.

If the index starts with \`tenant_id\`, all records for the same tenant are grouped together in the index.

Then \`created_at\` can help organize rows within that tenant.

This makes:

\`WHERE tenant_id = ? ORDER BY created_at DESC\`

a natural query for that index.

### Another real-world example: support tickets

Suppose a support dashboard frequently asks:

"Show open tickets for this company, newest first."

The query may contain:

\`WHERE company_id = ? AND status = 'OPEN' ORDER BY created_at DESC\`

A possible composite index could include the columns that match this access pattern.

However, index design should be tested against real data and query plans rather than blindly creating every possible combination.

### Composite indexes are not automatically better

If you create:

\`(a, b, c, d, e, f)\`

just because a query contains six columns, you may create a large index that is expensive to maintain.

The index should reflect actual access patterns.

### Leftmost-prefix idea

For an index:

\`(tenant_id, status, created_at)\`

queries that begin by constraining \`tenant_id\` can often make good use of the index.

The exact optimizer behavior depends on the query, statistics, data distribution, and PostgreSQL version.

That is why query plans remain important.`,
      diagram: `Composite index:

(tenant_id, created_at)

Index structure:

Tenant A
  |
  +-- newest
  +-- older
  +-- older

Tenant B
  |
  +-- newest
  +-- older
  +-- older

Useful for queries such as:

WHERE tenant_id = ?
ORDER BY created_at DESC`,
      codeExample: {
        title: "Composite index with TypeORM",
        code: `import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("orders")
@Index(["userId", "createdAt"])
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column()
  status: string;
}`,
      },
      keyTakeaways: [
        "A composite index contains multiple columns.",
        "Column order matters in a composite index.",
        "Composite indexes are useful when they match common filtering and sorting patterns.",
        "Multi-tenant applications often benefit from carefully designed tenant-aware indexes.",
        "Do not create large composite indexes without checking actual query patterns and query plans.",
      ],
      commonMistakes: [
        "<b>Ignoring column order.</b> `(userId, createdAt)` and `(createdAt, userId)` support different access patterns.",
        "<b>Creating an index containing every WHERE column.</b> More columns do not automatically mean better performance.",
        "<b>Duplicating indexes.</b> Check whether an existing index already supports the query.",
        "<b>Forgetting write cost.</b> Every additional index can increase INSERT and UPDATE work.",
      ],
      quiz: [
        {
          question: "What is a composite index?",
          options: [
            "An index containing multiple columns",
            "An index that only works for DELETE",
            "A database backup",
            "A transaction",
          ],
          correctIndex: 0,
          explanation: "A composite index is built from multiple columns.",
        },
        {
          question: "Does column order matter in a composite index?",
          options: [
            "No",
            "Only in MySQL",
            "Yes",
            "Only for INSERT",
          ],
          correctIndex: 2,
          explanation: "The order of columns affects which query patterns the index can efficiently support.",
        },
      ],
    },
    {
      id: "query-plans",
      title: "Query plans: seeing what PostgreSQL is actually doing",
      durationMinutes: 20,
      explanation: `One of the most important database performance skills is learning to stop guessing.

Suppose someone says:

<b>"This query is slow. Add an index."</b>

Maybe the index will help.

Maybe it will not.

Maybe the real problem is a bad join.

Maybe PostgreSQL is scanning millions of rows.

Maybe the application is requesting far more data than necessary.

Maybe the query is fast in development but slow in production because production has 50 million rows.

The query plan helps you understand what PostgreSQL is actually doing.

PostgreSQL provides:

\`EXPLAIN\`

and:

\`EXPLAIN ANALYZE\`

### EXPLAIN

EXPLAIN shows the execution plan PostgreSQL expects to use.

For example:

\`EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';\`

You may see a plan involving:

- sequential scan;
- index scan;
- bitmap scan;
- nested loop;
- hash join;
- merge join;
- sort;
- aggregate.

### EXPLAIN ANALYZE

EXPLAIN ANALYZE actually executes the query and reports runtime information.

This makes it extremely useful for diagnosing real performance problems.

However, be careful with write queries.

Running EXPLAIN ANALYZE on an INSERT, UPDATE, or DELETE actually performs the operation unless you use appropriate transaction/rollback techniques.

### Beginner real-world example

Your user lookup suddenly takes 2 seconds.

You inspect:

\`EXPLAIN ANALYZE SELECT * FROM users WHERE email = ...\`

You discover PostgreSQL is scanning a huge table.

That gives you a concrete reason to investigate an index.

### Intermediate example: expensive join

Suppose a dashboard joins:

\`orders\`
\`users\`
\`order_items\`
\`products\`

The query is slow.

The query plan may show that a join is processing millions of rows before filtering them.

Now you have a much better starting point than simply saying:

"PostgreSQL is slow."

### Advanced example: estimated rows versus actual rows

A query plan contains estimated row counts.

EXPLAIN ANALYZE can show actual row counts.

If PostgreSQL expects 10 rows but actually processes 2 million rows, the optimizer may make poor decisions.

This can point toward:

- stale statistics;
- unusual data distribution;
- insufficient statistics;
- query structure problems.

### Common plan concepts

<b>Sequential Scan</b>

PostgreSQL reads table pages and checks rows.

This is not automatically bad.

For a small table, a sequential scan can be faster than using an index.

<b>Index Scan</b>

PostgreSQL uses an index to locate rows and then retrieves the corresponding table data.

<b>Bitmap Index Scan / Bitmap Heap Scan</b>

PostgreSQL can collect matching row locations efficiently and then fetch table pages.

<b>Nested Loop</b>

One input is repeatedly used to find matching rows in another input.

This can be excellent for small outer result sets and appropriate indexes.

<b>Hash Join</b>

PostgreSQL builds a hash structure for one input and uses it to match rows from another.

<b>Sort</b>

PostgreSQL explicitly sorts data.

Sorting can become expensive when large datasets are involved.

The goal is not to memorize every node.

The goal is to ask:

<b>"What is the database spending time doing?"</b>`,
      diagram: `SQL Query
    |
    v
PostgreSQL Planner
    |
    v
Execution Plan
    |
    +--> Scan
    +--> Join
    +--> Filter
    +--> Sort
    +--> Aggregate
    |
    v
Actual execution

EXPLAIN ANALYZE
lets you compare
estimated work with
actual execution.`,
      codeExample: {
        title: "Inspecting a query plan",
        code: `const plan = await dataSource.query(\`
  EXPLAIN (ANALYZE, BUFFERS)
  SELECT *
  FROM orders
  WHERE user_id = $1
  ORDER BY created_at DESC
  LIMIT 20
\`, [userId]);

console.log(plan);`,
      },
      keyTakeaways: [
        "EXPLAIN shows the query execution plan PostgreSQL expects to use.",
        "EXPLAIN ANALYZE executes the query and reports actual execution information.",
        "A sequential scan is not automatically bad.",
        "Estimated versus actual row counts can reveal optimizer estimation problems.",
        "Use query plans to diagnose performance instead of blindly adding indexes.",
      ],
      commonMistakes: [
        "<b>Assuming sequential scan always means something is wrong.</b> Sequential scans can be optimal for small tables or queries returning many rows.",
        "<b>Looking only at total execution time.</b> Examine the plan nodes and row counts to understand why.",
        "<b>Running EXPLAIN ANALYZE on destructive queries without caution.</b> It actually executes the statement.",
        "<b>Testing only with tiny development data.</b> Query behavior can change dramatically at production scale.",
      ],
      quiz: [
        {
          question: "What does EXPLAIN help you understand?",
          options: [
            "The database execution plan",
            "The TypeScript type system",
            "The HTTP protocol",
            "The NestJS module graph",
          ],
          correctIndex: 0,
          explanation: "EXPLAIN shows how PostgreSQL plans to execute a query.",
        },
        {
          question: "What is important about EXPLAIN ANALYZE?",
          options: [
            "It only checks SQL syntax",
            "It actually executes the query and reports runtime information",
            "It deletes indexes",
            "It disables transactions",
          ],
          correctIndex: 1,
          explanation: "EXPLAIN ANALYZE executes the query and reports actual execution statistics.",
        },
      ],
    },
    {
      id: "n-plus-one-queries",
      title: "N+1 queries: when one request becomes hundreds of queries",
      durationMinutes: 20,
      explanation: `The N+1 query problem happens when an application performs one query to retrieve a list and then performs another query for each item in that list.

Suppose your API loads 100 orders.

First query:

\`SELECT * FROM orders LIMIT 100\`

Then the application loops:

Order 1 → query customer.
Order 2 → query customer.
Order 3 → query customer.
...
Order 100 → query customer.

That produces:

1 query for orders
+
100 queries for customers

Total:

<b>101 database queries</b>.

This is the N+1 problem.

### Beginner real-world example: blog posts

Suppose a page displays 50 blog posts.

For each post, the application loads the author separately.

You might think:

"50 posts is not much."

But the database sees 51 queries.

If 20 users open the page simultaneously, the application may produce more than 1,000 queries very quickly.

### Intermediate real-world example: ecommerce orders

A customer opens:

"My Orders"

The API loads 30 orders.

Then for every order:

- load shipping address;
- load order items;
- load product information.

Now one API request can trigger dozens or hundreds of database queries.

The page might appear simple, but the backend is doing much more work than expected.

### Advanced real-world example: GraphQL

GraphQL can make N+1 problems especially easy to introduce.

A client may request:

orders {
  id
  customer {
    name
  }
  items {
    product {
      name
    }
  }
}

If every nested resolver independently queries the database, the server can produce a huge number of queries.

A common solution is batching and caching tools such as DataLoader-style patterns.

### TypeORM solutions

Depending on the use case, you can:

- use relations carefully;
- use QueryBuilder joins;
- fetch required data in fewer queries;
- use relation loading deliberately;
- batch IDs and perform one query;
- use caching where appropriate;
- use DataLoader-like batching for request-scoped access patterns.

### Important nuance

"One SQL query is always better than multiple queries" is too simplistic.

A giant query can become difficult to maintain and may return enormous amounts of duplicated data because of joins.

Sometimes two well-designed queries are faster and easier to understand than one enormous join.

The real goal is:

<b>Minimize unnecessary database work while keeping the query shape appropriate for the data being returned.</b>

### How to find N+1 problems

Use:

- query logging;
- APM tools;
- database monitoring;
- integration tests;
- request tracing.

If one HTTP request unexpectedly produces 301 SQL statements, you have a strong signal that something deserves investigation.`,
      diagram: `HTTP Request
    |
    +--> Query orders
    |
    +--> Query customer 1
    +--> Query customer 2
    +--> Query customer 3
    +--> ...
    +--> Query customer N

Total:
1 + N queries

Better:

HTTP Request
    |
    +--> Query orders
    +--> JOIN / batch related data

Total:
far fewer queries`,
      codeExample: {
        title: "Avoiding N+1 with a QueryBuilder join",
        code: `const orders = await dataSource
  .getRepository(Order)
  .createQueryBuilder("order")
  .leftJoinAndSelect("order.user", "user")
  .leftJoinAndSelect("order.items", "item")
  .where("order.userId = :userId", { userId })
  .orderBy("order.createdAt", "DESC")
  .getMany();`,
      },
      keyTakeaways: [
        "N+1 happens when one query loads a collection and additional queries are executed for individual items.",
        "N+1 can become very expensive as the collection grows.",
        "Joins, batching, and carefully designed queries can reduce unnecessary database calls.",
        "GraphQL nested resolvers are a common place for N+1 problems.",
        "Do not blindly force everything into one query; choose an efficient query shape for the data.",
      ],
      commonMistakes: [
        "<b>Loading relations inside a loop.</b> This is a common way to accidentally create N+1 queries.",
        "<b>Assuming ORM code hides all database performance concerns.</b> ORMs still generate SQL and database calls.",
        "<b>Fixing N+1 by creating one enormous query without measuring it.</b> The resulting query can also become inefficient.",
        "<b>Ignoring query counts.</b> A request that looks simple in application code may execute hundreds of SQL statements.",
      ],
      quiz: [
        {
          question: "What does N+1 mean?",
          options: [
            "One query plus one additional query for every item",
            "A database version",
            "A type of SQL transaction",
            "A PostgreSQL index type",
          ],
          correctIndex: 0,
          explanation: "N+1 commonly means one query loads a collection and N additional queries load related data individually.",
        },
        {
          question: "Which is a common way to reduce N+1 queries?",
          options: [
            "Query related data individually inside a loop",
            "Use appropriate joins or batching",
            "Disable all indexes",
            "Increase the number of loops",
          ],
          correctIndex: 1,
          explanation: "Joins and batching can reduce unnecessary database round trips.",
        },
      ],
    },
    {
      id: "connection-pools",
      title: "Connection pools: managing database connections",
      durationMinutes: 17,
      explanation: `A database connection is a communication channel between your application and PostgreSQL.

Creating a new database connection for every query would be expensive.

Instead, applications commonly use a <b>connection pool</b>.

A pool maintains a group of reusable database connections.

When a request needs a connection:

1. The application gets an available connection.
2. It performs database work.
3. The connection is returned to the pool.
4. Another request can reuse it.

### Beginner real-world example

Imagine a restaurant.

You could hire a new waiter every time a customer enters.

That would be wasteful.

Instead, you have a team of waiters who serve many customers.

A connection pool works similarly.

### Intermediate real-world example: API traffic

Suppose your NestJS API receives 500 simultaneous HTTP requests.

You probably do not want 500 independent PostgreSQL connections automatically created.

The pool controls how many database connections are active.

Some requests may wait briefly for an available connection.

### Advanced real-world example: Kubernetes

Imagine your application has:

- 10 Kubernetes pods;
- each pod has a pool size of 20.

Potentially:

10 × 20 = 200 database connections.

If PostgreSQL can comfortably support only a much smaller number of connections, your application architecture can create serious database pressure.

This is why connection pool sizing must be considered across the entire deployment, not only inside one NestJS process.

### Connection exhaustion

Suppose the pool allows 20 connections.

If 20 requests are holding connections and a 21st request needs one, it may wait.

If connections are held for too long, request latency increases.

This is another reason transaction duration matters.

### Transactions and pools

A transaction needs a consistent database connection while it is running.

TypeORM manages this for transaction callbacks and QueryRunner-based transactions.

With QueryRunner, you explicitly acquire and release the connection.

Forgetting to release resources can eventually exhaust the pool.

### Pool size is not a "bigger is always better" setting

Increasing the pool size does not magically make PostgreSQL faster.

Too many concurrent database operations can cause:

- CPU contention;
- memory pressure;
- lock contention;
- disk contention;
- context switching;
- queueing inside the database.

The goal is to find a reasonable concurrency level for the workload and database capacity.

### Real-world production thinking

Connection pool sizing should consider:

- number of application instances;
- expected concurrency;
- database CPU;
- database memory;
- query duration;
- transaction duration;
- background workers;
- admin connections;
- other services using the same database.

A pool configuration that works on a laptop may be completely inappropriate for a production cluster.`,
      diagram: `NestJS Application
        |
        v
+-------------------+
| Connection Pool   |
|                   |
| [C1] [C2] [C3]    |
| [C4] [C5] ...     |
+-------------------+
        |
        v
   PostgreSQL

Request
  |
  +--> borrow connection
  |
  +--> execute query
  |
  +--> return connection`,
      codeExample: {
        title: "Configuring a TypeORM connection pool",
        code: `import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  extra: {
    max: 20,
    idleTimeoutMillis: 30_000,
  },
};`,
      },
      keyTakeaways: [
        "Connection pools reuse database connections instead of creating one for every query.",
        "Pool size controls database concurrency from an application instance.",
        "Total connection pressure includes every application instance and worker.",
        "Long-running transactions can hold connections and reduce pool availability.",
        "Increasing pool size does not automatically improve database performance.",
      ],
      commonMistakes: [
        "<b>Choosing pool size without considering multiple application instances.</b> Ten pods with 20 connections each can potentially create 200 connections.",
        "<b>Making the pool extremely large.</b> More connections can increase database contention rather than improve performance.",
        "<b>Forgetting to release QueryRunner resources.</b> This can contribute to connection exhaustion.",
        "<b>Ignoring long transactions.</b> Long-held connections can cause requests to wait for pool availability.",
      ],
      quiz: [
        {
          question: "What is the purpose of a connection pool?",
          options: [
            "To reuse a controlled number of database connections",
            "To replace SQL",
            "To create a new connection for every row",
            "To disable PostgreSQL",
          ],
          correctIndex: 0,
          explanation: "A connection pool manages reusable database connections.",
        },
        {
          question: "Why can increasing the pool size too much be harmful?",
          options: [
            "More concurrent database work can create resource and contention problems",
            "PostgreSQL only supports one connection",
            "TypeORM cannot use pools",
            "Indexes stop working",
          ],
          correctIndex: 0,
          explanation: "Too much concurrency can overwhelm database resources instead of improving performance.",
        },
      ],
    },
    {
      id: "slow-queries",
      title: "Slow queries: finding the real bottleneck",
      durationMinutes: 20,
      explanation: `A slow query is not simply a query that "looks complicated."

A query is slow relative to the requirements of the application and the environment in which it runs.

A query that takes 300 milliseconds might be acceptable for an administrative report.

The same 300 milliseconds may be problematic if it happens 100 times during one API request.

The first performance skill is therefore:

<b>Measure before changing things.</b>

### Beginner real-world example

Your product page takes 2 seconds.

You inspect the API.

The API spends:

- 100 ms in application logic;
- 1.7 seconds in PostgreSQL;
- 200 ms formatting the response.

The database is the obvious place to investigate.

But then you discover the API is executing 80 queries.

The problem is not necessarily one terrible SQL statement.

It could be excessive query count.

### Intermediate real-world example

An admin report takes 8 seconds.

You inspect the query plan and discover:

- a large sequential scan;
- an expensive sort;
- millions of rows processed;
- only 50 rows returned.

Now you can investigate indexes, filtering, query shape, and pagination.

### Advanced real-world example: production-only slowdown

The query takes 20 ms locally.

Production takes 2 seconds.

Why?

Production might have:

- 50 million rows instead of 10,000;
- different data distribution;
- different indexes;
- different PostgreSQL configuration;
- concurrent traffic;
- disk pressure;
- cache differences;
- lock contention.

This is why realistic test data and production monitoring matter.

### Common sources of slow queries

A query may be slow because of:

- missing indexes;
- inappropriate indexes;
- poor joins;
- large sorts;
- huge result sets;
- N+1 behavior;
- inefficient filtering;
- expensive aggregation;
- lock waiting;
- stale statistics;
- excessive network transfer;
- database resource contention.

### Query count matters

Suppose:

One query takes 100 ms.

A request executes 100 queries that each take 10 ms.

That is roughly 1 second of database work before considering concurrency and network overhead.

Reducing query count can therefore be as important as optimizing individual queries.

### Slow query logs

PostgreSQL can be configured to log queries that exceed a configured duration.

This can help identify production queries that deserve investigation.

### Application monitoring

An APM system can help connect:

HTTP request
→ service method
→ SQL query
→ database duration

This is much more useful than looking at SQL logs without knowing which user request triggered them.

### Important performance habit

Do not optimize based on appearance.

A short query can be slow.

A long query can be fast.

The database optimizer, indexes, data volume, hardware, cache state, concurrency, and execution plan all matter.`,
      diagram: `HTTP Request
     |
     +--> Controller
     |
     +--> Service
             |
             +--> Query 1 ---- 20 ms
             +--> Query 2 ---- 30 ms
             +--> Query 3 ---- 900 ms  <-- investigate
             +--> Query 4 ---- 10 ms
             |
             v
        Response

Performance investigation:
1. Measure
2. Identify bottleneck
3. Inspect query
4. Inspect plan
5. Change
6. Measure again`,
      codeExample: {
        title: "Logging slow database queries in TypeORM",
        code: `export const databaseConfig = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  logging: ["error", "warn"],
  maxQueryExecutionTime: 500,
};`,
      },
      keyTakeaways: [
        "Measure database performance before changing code.",
        "Slow APIs can be caused by query count, individual query duration, or both.",
        "EXPLAIN ANALYZE helps identify what PostgreSQL is actually doing.",
        "Production behavior can differ greatly from development behavior.",
        "Application monitoring should connect database work to the HTTP request or business operation that triggered it.",
      ],
      commonMistakes: [
        "<b>Optimizing without measurements.</b> You may improve something that was not actually the bottleneck.",
        "<b>Testing only with small datasets.</b> Performance problems often appear when data volume grows.",
        "<b>Assuming the slowest-looking SQL text is necessarily the biggest problem.</b> Query frequency matters too.",
        "<b>Ignoring network and serialization costs.</b> Returning thousands of rows can be expensive even when SQL execution is fast.",
      ],
      quiz: [
        {
          question: "What should you generally do before optimizing a slow query?",
          options: [
            "Measure and inspect the actual behavior",
            "Delete the table",
            "Add indexes to every column",
            "Increase the connection pool indefinitely",
          ],
          correctIndex: 0,
          explanation: "Measurement helps identify the actual bottleneck instead of relying on guesses.",
        },
        {
          question: "Why can a query be fast locally but slow in production?",
          options: [
            "Production may have much more data and different workload characteristics",
            "PostgreSQL becomes a different programming language",
            "Indexes never work in production",
            "TypeScript changes SQL syntax",
          ],
          correctIndex: 0,
          explanation: "Data volume, concurrency, indexes, hardware, statistics, and cache behavior can differ substantially.",
        },
      ],
    },
    {
      id: "cursor-pagination",
      title: "Cursor pagination: efficient pagination for large datasets",
      durationMinutes: 20,
      explanation: `Pagination means returning a large dataset in smaller pieces.

Imagine your API has 20 million orders.

You do not want to return all 20 million orders in one HTTP response.

A common approach is pagination.

There are two major approaches you should understand:

<b>Offset pagination</b>

and

<b>Cursor pagination</b>.

### Beginner: offset pagination

A simple API might provide:

\`?page=1&limit=20\`

Then:

\`?page=2&limit=20\`

The SQL might use:

\`LIMIT 20 OFFSET 20\`

This is easy to understand.

For small datasets, it can be perfectly acceptable.

### The problem with large offsets

Imagine:

\`LIMIT 20 OFFSET 5,000,000\`

The database may need to process or skip a very large number of rows before returning the requested page.

As the offset grows, deep pagination can become expensive.

### Real-world example: social media feed

Imagine a social platform with millions of posts.

A user scrolls down.

Instead of saying:

"Give me page 5,000,000."

The client can say:

"Give me 20 posts after this cursor."

The cursor represents a position in the ordered dataset.

### Cursor example

Suppose posts are ordered by:

\`created_at DESC\`

and the last item on the current page has:

\`created_at = 2026-01-10T10:00:00Z\`

The next query can ask for posts older than that position.

Conceptually:

\`WHERE created_at < cursorCreatedAt\`

Then:

\`ORDER BY created_at DESC\`

\`LIMIT 20\`

### Advanced problem: duplicate timestamps

What if two posts have the exact same \`created_at\` value?

Then \`created_at\` alone may not uniquely identify a position.

A common solution is a compound ordering key:

\`(created_at, id)\`

For example:

Order:

\`created_at DESC, id DESC\`

The cursor contains both:

\`created_at\`
and
\`id\`.

The next-page condition can then correctly identify rows after that exact position.

### Why cursor pagination is useful

Cursor pagination works particularly well for:

- feeds;
- activity logs;
- chat history;
- large order histories;
- audit logs;
- notifications;
- continuously growing datasets.

### Cursor design

A cursor is often an encoded representation of the last row's ordering values.

For example:

\`created_at + id\`

The client does not need to understand the internal values.

The server can encode them into an opaque cursor.

For example:

\`eyJjcmVhdGVkQXQiOi...\`

The exact encoding is an implementation detail.

### Important rule: stable ordering

Cursor pagination requires a deterministic order.

If you order only by a non-unique column, pagination can become unstable.

Use a unique tie-breaker such as an ID when necessary.

### Real-world example: customer orders

Suppose a customer has 2 million historical orders.

The API can return:

20 orders.

The response includes:

\`nextCursor\`

The client requests:

\`GET /orders?limit=20&cursor=...\`

The database uses the cursor to find the next records instead of skipping millions of rows.

### Advanced issue: records changing while the user paginates

Suppose new records are continuously inserted.

Cursor pagination can provide a more stable experience because the next page is based on the last known position rather than an absolute row offset.

This is especially useful for feeds and activity streams.`,
      diagram: `Offset pagination:

Page 1
  |
OFFSET 0

Page 2
  |
OFFSET 20

Page 100000
  |
OFFSET 1,999,980
  |
Large amount of skipping

Cursor pagination:

Page 1
  |
last item
  |
cursor
  v
Page 2
  |
last item
  |
cursor
  v
Page 3

The cursor points to
the next position.`,
      codeExample: {
        title: "Cursor pagination with TypeORM",
        code: `async findOrders(
  userId: string,
  limit = 20,
  cursor?: {
    createdAt: string;
    id: string;
  },
) {
  const query = this.orderRepository
    .createQueryBuilder("order")
    .where("order.userId = :userId", { userId })
    .orderBy("order.createdAt", "DESC")
    .addOrderBy("order.id", "DESC")
    .take(limit + 1);

  if (cursor) {
    query.andWhere(
      \`(
        order.createdAt < :createdAt
        OR (
          order.createdAt = :createdAt
          AND order.id < :id
        )
      )\`,
      {
        createdAt: cursor.createdAt,
        id: cursor.id,
      },
    );
  }

  const rows = await query.getMany();

  const hasNextPage = rows.length > limit;
  const items = hasNextPage
    ? rows.slice(0, limit)
    : rows;

  const last = items[items.length - 1];

  return {
    items,
    hasNextPage,
    nextCursor: hasNextPage && last
      ? {
          createdAt: last.createdAt.toISOString(),
          id: last.id,
        }
      : null,
  };
}`,
      },
      keyTakeaways: [
        "Pagination prevents APIs from returning enormous datasets at once.",
        "Offset pagination is simple and can work well for small or moderate datasets.",
        "Deep offsets can become expensive for very large datasets.",
        "Cursor pagination uses a position in the ordered dataset rather than a large numeric offset.",
        "A cursor should use deterministic ordering, often with a unique tie-breaker such as an ID.",
      ],
      commonMistakes: [
        "<b>Using cursor pagination with an unstable sort.</b> The ordering must be deterministic.",
        "<b>Using only createdAt when timestamps can be identical.</b> Add a unique tie-breaker such as ID.",
        "<b>Returning database IDs directly as a cursor without considering API design.</b> Cursors are often better represented as opaque values.",
        "<b>Fetching 100,000 records and slicing them in JavaScript.</b> Let the database apply the limit and cursor condition.",
      ],
      quiz: [
        {
          question: "Why can deep OFFSET pagination become expensive?",
          options: [
            "The database may need to process or skip many rows before returning the requested page",
            "OFFSET disables SQL",
            "OFFSET deletes rows",
            "OFFSET prevents indexes from existing",
          ],
          correctIndex: 0,
          explanation: "Large offsets can require PostgreSQL to process many rows before reaching the requested position.",
        },
        {
          question: "Why is a unique tie-breaker useful for cursor pagination?",
          options: [
            "It creates deterministic ordering when the primary sort value is duplicated",
            "It disables transactions",
            "It removes the need for indexes",
            "It makes SQL invalid",
          ],
          correctIndex: 0,
          explanation: "A unique tie-breaker makes the cursor position deterministic.",
        },
      ],
    },
    {
      id: "advanced-database-performance",
      title: "Putting database performance together",
      durationMinutes: 20,
      explanation: `Database performance is rarely about one magic optimization.

In a real NestJS application, performance usually comes from several decisions working together.

Imagine an ecommerce API:

\`GET /users/:userId/orders\`

The endpoint needs to return:

- recent orders;
- order items;
- product names;
- pagination;
- total or next-page information.

A beginner implementation might:

1. Load all orders.
2. Loop through orders.
3. Load items for each order.
4. Load products for each item.
5. Sort everything in JavaScript.
6. Return all rows.

This can become extremely expensive.

### Step 1: limit the result

Do not load millions of orders if the user only needs 20.

Use pagination.

### Step 2: choose the right pagination strategy

For deep and continuously growing datasets, cursor pagination may be more appropriate than huge offsets.

### Step 3: design indexes around the query

If the query is:

\`WHERE user_id = ? ORDER BY created_at DESC, id DESC\`

consider an index that supports that access pattern.

### Step 4: avoid N+1

Do not load every relationship individually inside loops.

Use joins, batching, or carefully selected separate queries.

### Step 5: inspect the query plan

Use:

\`EXPLAIN ANALYZE\`

to see whether PostgreSQL is scanning too much data, sorting too much data, or choosing an unexpected join strategy.

### Step 6: control connection usage

Make sure your connection pool is large enough for expected concurrency but not so large that it overwhelms PostgreSQL.

### Step 7: keep transactions short

Do not hold database locks or connections while performing slow external work.

### Step 8: measure again

After changing the system, measure:

- query duration;
- request duration;
- number of queries;
- rows returned;
- database CPU;
- connection pool wait time;
- lock wait time.

### Advanced production example

Suppose an API becomes slow after your company grows from 100,000 orders to 50 million.

The code did not change.

The data did.

A query that was previously fast may now:

- scan millions of rows;
- sort millions of rows;
- return too many records;
- consume more memory;
- wait for locks;
- compete for connections.

This is why database performance must be treated as an ongoing engineering concern.

### Performance optimization loop

Use this cycle:

<b>Measure → Understand → Change → Measure again.</b>

Do not start with:

<b>"Add an index."</b>

Start with:

<b>"Where is the time actually going?"</b>

That question leads to much better database engineering decisions.`,
      diagram: `                HTTP Request
                      |
                      v
              NestJS Controller
                      |
                      v
               Service Layer
                      |
          +-----------+-----------+
          |                       |
      Query count            Transaction
          |                       |
          v                       v
       TypeORM                PostgreSQL
          |                       |
          +-----------+-----------+
                      |
              Query execution
                      |
          +-----------+-----------+
          |           |           |
        Index       Join        Sort
          |           |           |
          +-----------+-----------+
                      |
                Query Plan
                      |
                Performance`,
      codeExample: {
        title: "A performance-aware order query",
        code: `async findRecentOrders(
  userId: string,
  limit = 20,
  cursor?: {
    createdAt: string;
    id: string;
  },
) {
  const query = this.orderRepository
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.items", "item")
    .leftJoinAndSelect("item.product", "product")
    .where("order.userId = :userId", { userId })
    .orderBy("order.createdAt", "DESC")
    .addOrderBy("order.id", "DESC")
    .take(limit + 1);

  if (cursor) {
    query.andWhere(
      \`(
        order.createdAt < :createdAt
        OR (
          order.createdAt = :createdAt
          AND order.id < :id
        )
      )\`,
      {
        createdAt: cursor.createdAt,
        id: cursor.id,
      },
    );
  }

  const rows = await query.getMany();

  const hasNextPage = rows.length > limit;

  return {
    items: hasNextPage
      ? rows.slice(0, limit)
      : rows,
    hasNextPage,
  };
}`,
      },
      keyTakeaways: [
        "Database performance is a combination of query design, indexes, connection management, pagination, and concurrency control.",
        "The number of queries can matter as much as the duration of an individual query.",
        "Indexes should be designed around real access patterns.",
        "Query plans reveal what PostgreSQL is actually doing.",
        "Cursor pagination can be valuable for large, continuously growing datasets.",
        "Performance work should follow a measure, understand, change, and measure-again cycle.",
      ],
      commonMistakes: [
        "<b>Optimizing only the SQL statement.</b> The application may have an N+1 problem or excessive result processing.",
        "<b>Returning huge datasets.</b> Database execution, network transfer, serialization, and memory all become more expensive.",
        "<b>Ignoring connection pool pressure.</b> A fast query can still create problems when too many queries run concurrently.",
        "<b>Adding indexes without measuring.</b> Indexes can improve reads while increasing storage and write costs.",
        "<b>Using offset pagination for every large dataset.</b> Deep offsets can become expensive.",
      ],
      quiz: [
        {
          question: "What is a good database performance workflow?",
          options: [
            "Guess, add indexes, and never measure",
            "Measure, understand, change, and measure again",
            "Delete all indexes",
            "Increase the connection pool indefinitely",
          ],
          correctIndex: 1,
          explanation: "Performance work should be evidence-driven and measured before and after changes.",
        },
        {
          question: "Which combination can improve a large order-list endpoint?",
          options: [
            "Unlimited results and N+1 queries",
            "Appropriate indexes, efficient query shape, pagination, and query-plan analysis",
            "Removing all constraints",
            "Opening a new database connection for every row",
          ],
          correctIndex: 1,
          explanation: "Large endpoints usually need several coordinated performance techniques.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the primary purpose of a database index?",
      options: [
        "To help the database find data efficiently",
        "To replace transactions",
        "To increase table size",
        "To disable constraints",
      ],
      correctIndex: 0,
      explanation: "Indexes provide structures that can make suitable queries much faster.",
    },
    {
      question: "What is a composite index?",
      options: [
        "An index containing multiple columns",
        "A database backup",
        "A transaction log",
        "A connection pool",
      ],
      correctIndex: 0,
      explanation: "A composite index contains two or more indexed columns.",
    },
    {
      question: "Does the order of columns in a composite index matter?",
      options: [
        "No",
        "Yes",
        "Only for DELETE",
        "Only in TypeScript",
      ],
      correctIndex: 1,
      explanation: "Column order affects which query patterns can efficiently use the index.",
    },
    {
      question: "What does EXPLAIN provide?",
      options: [
        "The database query execution plan",
        "A NestJS controller",
        "A TypeScript interface",
        "A database password",
      ],
      correctIndex: 0,
      explanation: "EXPLAIN shows the plan PostgreSQL intends to use for a query.",
    },
    {
      question: "What is special about EXPLAIN ANALYZE?",
      options: [
        "It actually executes the query and reports runtime information",
        "It only checks syntax",
        "It deletes the query",
        "It creates an index automatically",
      ],
      correctIndex: 0,
      explanation: "EXPLAIN ANALYZE executes the query and provides actual execution statistics.",
    },
    {
      question: "What is an N+1 query problem?",
      options: [
        "One query followed by one query for each item in a collection",
        "A database with N+1 tables",
        "A failed transaction",
        "A composite index",
      ],
      correctIndex: 0,
      explanation: "N+1 happens when related data is fetched with a separate query for each item.",
    },
    {
      question: "Which is a common way to reduce N+1 queries?",
      options: [
        "Use appropriate joins or batching",
        "Add a loop around every query",
        "Remove all indexes",
        "Create a connection for every row",
      ],
      correctIndex: 0,
      explanation: "Joins and batching can reduce unnecessary database round trips.",
    },
    {
      question: "What does a connection pool provide?",
      options: [
        "A controlled collection of reusable database connections",
        "A replacement for PostgreSQL",
        "An alternative to SQL",
        "A TypeScript compiler",
      ],
      correctIndex: 0,
      explanation: "Connection pools reuse database connections and control concurrent database access.",
    },
    {
      question: "Why can a very large connection pool be harmful?",
      options: [
        "It can create too much concurrent database work and resource contention",
        "It prevents SQL queries",
        "It removes indexes",
        "It makes PostgreSQL single-threaded",
      ],
      correctIndex: 0,
      explanation: "Too many connections can increase CPU, memory, lock, and I/O contention.",
    },
    {
      question: "Why can deep OFFSET pagination become expensive?",
      options: [
        "The database may need to process or skip many rows before reaching the requested page",
        "OFFSET removes the database",
        "OFFSET automatically deletes records",
        "OFFSET disables SELECT",
      ],
      correctIndex: 0,
      explanation: "Large offsets can require significant work before PostgreSQL can return the requested rows.",
    },
    {
      question: "What does cursor pagination use?",
      options: [
        "A position in the ordered dataset",
        "A database restart",
        "A random row",
        "A connection pool",
      ],
      correctIndex: 0,
      explanation: "Cursor pagination uses a cursor representing the position from which the next page should be read.",
    },
    {
      question: "Why should cursor pagination usually use deterministic ordering?",
      options: [
        "To prevent rows from being skipped or repeated between pages",
        "To disable indexes",
        "To increase database connections",
        "To avoid transactions",
      ],
      correctIndex: 0,
      explanation: "Stable ordering is necessary for predictable pagination.",
    },
    {
      question: "Why is a unique ID useful as a cursor tie-breaker?",
      options: [
        "It makes rows with identical primary sort values distinguishable",
        "It disables sorting",
        "It removes foreign keys",
        "It creates a connection pool",
      ],
      correctIndex: 0,
      explanation: "A unique tie-breaker makes the cursor position deterministic even when timestamps or other sort values are equal.",
    },
    {
      question: "Which statement about sequential scans is correct?",
      options: [
        "They are always bad",
        "They can be appropriate, especially for small tables or queries returning many rows",
        "They mean PostgreSQL is broken",
        "They cannot happen in PostgreSQL",
      ],
      correctIndex: 1,
      explanation: "A sequential scan can be the most efficient plan in some situations.",
    },
    {
      question: "What is an important first step when investigating a slow query?",
      options: [
        "Measure and inspect its execution",
        "Add indexes to every column",
        "Increase the pool indefinitely",
        "Delete old rows immediately",
      ],
      correctIndex: 0,
      explanation: "Measurement helps identify the actual bottleneck.",
    },
    {
      question: "Why can production queries behave differently from development queries?",
      options: [
        "Production may have much more data, different statistics, and higher concurrency",
        "Production does not use SQL",
        "Development databases cannot have indexes",
        "TypeORM generates different TypeScript",
      ],
      correctIndex: 0,
      explanation: "Data size, distribution, concurrency, indexes, hardware, and cache state can differ substantially.",
    },
  ],
  project: {
    name: "High-performance ecommerce order API",
    goal: "Build and optimize a production-style NestJS order API using indexes, query plans, efficient relationship loading, connection pooling, slow-query analysis, and cursor pagination.",
    brief: "Create an order-history API for a large ecommerce application. Assume the database contains millions of users, tens of millions of orders, and many millions of order items. Start with a straightforward implementation, measure its performance, identify problems, and progressively improve it using appropriate indexes, QueryBuilder joins, cursor pagination, and connection-pool configuration.",
    steps: [
      "Create User, Order, OrderItem, and Product entities.",
      "Create enough seed data to simulate a large dataset rather than testing only with a few rows.",
      "Implement GET /users/:userId/orders using a simple repository query.",
      "Measure the number of SQL queries generated by the endpoint.",
      "Inspect the endpoint for N+1 relationship loading.",
      "Replace unnecessary per-record queries with joins or batching.",
      "Add an index for the foreign key used to find a user's orders.",
      "Add a composite index matching the order-history filtering and sorting pattern.",
      "Inspect the SQL generated by TypeORM.",
      "Run EXPLAIN on the important order-history query.",
      "Run EXPLAIN ANALYZE against a safe SELECT query and inspect actual row counts.",
      "Compare the execution plan before and after adding indexes.",
      "Test whether PostgreSQL actually uses the new indexes.",
      "Implement offset pagination as the initial version.",
      "Test deep pagination with a large offset.",
      "Measure the performance of page 1, page 100, page 10,000, and another deep page.",
      "Replace deep offset pagination with cursor pagination.",
      "Use createdAt plus a unique ID as a deterministic cursor ordering.",
      "Return an opaque nextCursor value from the API.",
      "Ensure the database performs the pagination rather than loading a huge result set into JavaScript.",
      "Configure a reasonable TypeORM connection pool.",
      "Test the API under concurrent requests.",
      "Observe what happens when the connection pool becomes saturated.",
      "Configure slow-query logging or TypeORM query-duration monitoring.",
      "Identify at least one intentionally slow query and investigate it with EXPLAIN ANALYZE.",
      "Measure request duration before and after each optimization.",
      "Record query count, database time, response time, and rows returned for the endpoint.",
      "Document why each index exists and which query pattern it supports.",
    ],
    acceptance: [
      "The order-history endpoint supports pagination.",
      "The endpoint does not create an N+1 query pattern when loading required order relationships.",
      "Appropriate indexes exist for the main filtering and sorting patterns.",
      "At least one composite index is used for a real query pattern.",
      "The project includes an EXPLAIN or EXPLAIN ANALYZE investigation of an important query.",
      "The application demonstrates an understanding that sequential scans are not automatically bad.",
      "Cursor pagination works correctly for large order histories.",
      "Cursor ordering is deterministic and uses a unique tie-breaker.",
      "The API does not load the entire order history into application memory.",
      "The TypeORM connection pool is explicitly configured.",
      "The project measures query duration or identifies slow queries.",
      "Performance comparisons are based on measurements rather than assumptions.",
    ],
    stretch: [
      "Create a benchmark that compares offset pagination and cursor pagination at increasingly deep pages.",
      "Generate millions of test rows and compare query plans at different data volumes.",
      "Add a covering index where appropriate and measure whether it improves the target query.",
      "Use EXPLAIN (ANALYZE, BUFFERS) to investigate buffer usage.",
      "Create a deliberately bad N+1 implementation and write a test that detects excessive query counts.",
      "Add request-level tracing that records the number and duration of SQL queries.",
      "Simulate connection-pool exhaustion and observe request latency.",
      "Compare several connection-pool sizes under concurrent load.",
      "Create an admin endpoint that displays slow-query statistics.",
      "Add an index only after identifying a real query that benefits from it and document the reason.",
      "Test what happens when records are inserted between two cursor-pagination requests.",
      "Implement opaque base64-encoded cursors instead of exposing raw pagination fields.",
      "Add integration tests proving that cursor pagination does not duplicate or skip records under the expected ordering rules.",
      "Investigate a production-like slow join using EXPLAIN ANALYZE and document the optimization process.",
    ],
  },
};
