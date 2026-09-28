import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_14_LESSONS: LessonDay = {
  day: 14,
  title: "Database Integration",
  totalMinutes: 90,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "postgresql-and-orms",
      title: "PostgreSQL and ORM fundamentals",
      durationMinutes: 18,
      explanation: `
A database is the application's durable source of structured data. For many web applications, PostgreSQL is a strong relational database choice because it supports transactions, relationships, constraints, indexes, and mature SQL capabilities.

### PostgreSQL

PostgreSQL stores data in tables made of rows and columns. A table normally represents a type of entity such as users, posts, products, or orders.

A relational database also allows tables to be related. For example, a blog can have a \`users\` table and a \`posts\` table where each post references its author.

### ORM concepts

An ORM (Object-Relational Mapper) provides application-level abstractions for interacting with relational data. Instead of writing every SQL statement manually, you can define schemas and use typed APIs to query and mutate records.

ORMs can improve developer productivity and type safety, but they do not eliminate the need to understand SQL and database behavior.

You still need to understand:
- primary keys;
- foreign keys;
- indexes;
- joins;
- constraints;
- transactions;
- query performance.

### Prisma and Drizzle

Prisma and Drizzle are two popular approaches in the TypeScript ecosystem.

Prisma provides a higher-level schema/client model. Drizzle stays closer to SQL concepts while providing TypeScript-friendly query building.

The important skill is not memorizing one library. Learn the database concepts underneath the library.
      `,
      diagram: `
Next.js Server Component
        |
        v
   Service / data code
        |
        v
       ORM
        |
        v
   PostgreSQL
        |
   +----+----+
   |         |
 Users      Posts
   |         |
   +---relation---+
      `,
      codeExample: {
        title: "A simple relational model with Drizzle-style schema",
        code: `import {
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
});

export const posts = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});`,
      },
      keyTakeaways: [
        "PostgreSQL is a relational database with strong support for relationships and transactions.",
        "An ORM provides application-level abstractions over database operations.",
        "Prisma and Drizzle solve similar problems with different design philosophies.",
        "You still need SQL and database fundamentals when using an ORM.",
      ],
      commonMistakes: [
        "Treating an ORM as a replacement for understanding SQL.",
        "Creating relationships only in application code without database constraints.",
        "Assuming ORM queries are automatically efficient.",
      ],
      quiz: [
        {
          question: "What is an ORM?",
          options: [
            "A browser API.",
            "A layer that maps application code to relational database operations.",
            "A CSS framework.",
            "A deployment platform.",
          ],
          correctIndex: 1,
          explanation:
            "An ORM provides abstractions for interacting with relational database data from application code.",
        },
      ],
    },

    {
      id: "database-connection-server-only",
      title: "Database connections and server-only access",
      durationMinutes: 17,
      explanation: `
A database connection is a resource that allows application code to communicate with PostgreSQL.

In a Next.js application, database access should remain on the server. A browser should never receive your database credentials or a direct database connection.

### Environment variables

Database URLs and credentials belong in server-side environment configuration. They should not be exposed through client-public environment variables.

### Connection reuse

Creating a completely new database connection for every function call can be expensive. Production applications commonly use a connection pool so multiple queries can reuse a managed set of database connections.

During local development, hot reload can create multiple module instances. A common pattern is to reuse a global development client so repeated reloads do not create an uncontrolled number of connections.

### Server-only modules

A useful defensive technique is marking database-access modules as server-only. This helps prevent accidental imports into Client Components.

The architectural rule is simple:

**Browser -> Next.js server -> database**

not:

**Browser -> PostgreSQL**
      `,
      diagram: `
Browser
  |
  X  no direct DB connection
  |
  v
Next.js Server
  |
  +--> server-only data module
          |
          v
     connection pool
          |
          v
      PostgreSQL
      `,
      codeExample: {
        title: "A server-only database module",
        code: `// lib/db.ts
import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

// Never import this module from a Client Component.`,
      },
      keyTakeaways: [
        "Database access belongs on the server.",
        "Database credentials should remain server-side.",
        "Connection pooling helps applications manage database connections efficiently.",
        "server-only can help prevent accidental client imports.",
      ],
      commonMistakes: [
        "Exposing DATABASE_URL to browser code.",
        "Creating a new database client on every request without understanding pooling.",
        "Importing database modules into a Client Component.",
      ],
      quiz: [
        {
          question: "Where should PostgreSQL credentials live?",
          options: [
            "Inside a public React component.",
            "In server-side environment configuration.",
            "Inside the browser URL.",
            "Inside CSS.",
          ],
          correctIndex: 1,
          explanation:
            "Database credentials are secrets and should remain on the server.",
        },
      ],
    },

    {
      id: "queries-and-relationships",
      title: "Queries, relationships, joins, and constraints",
      durationMinutes: 19,
      explanation: `
Database queries retrieve or modify records. Even when an ORM generates SQL for you, understanding the shape of the query is essential.

### Basic queries

A typical application needs:
- select a list;
- select one record by ID;
- insert a record;
- update a record;
- delete a record.

Each operation should have a clear data-access function rather than spreading raw query details throughout UI components.

### Relationships

A relational database represents relationships with keys.

A one-to-many example:
- one user can have many posts;
- each post belongs to one user.

The posts table can store \`authorId\` as a foreign key.

### Joins

A join combines related rows. For example, a post list may need the post title and the author's name.

The ORM can make joins easier to express, but the underlying operation is still a relational join.

### Constraints

Constraints protect data integrity. Examples include:
- primary keys;
- unique constraints;
- foreign keys;
- not-null constraints.

Database constraints are valuable because application validation alone cannot protect data from every code path.
      `,
      diagram: `
users
+----+--------+
| id | name   |
+----+--------+
  1     Rajan
  2     Mina
       |
       | one-to-many
       v
posts
+----+--------+----------+
| id | title  | authorId |
+----+--------+----------+
| 10 | NextJS | 1        |
| 11 | SQL    | 1        |
| 12 | React  | 2        |
+----+--------+----------+
      `,
      codeExample: {
        title: "Querying related records",
        code: `// Conceptual Drizzle-style query

const rows = await db
  .select({
    postId: posts.id,
    title: posts.title,
    authorName: users.name,
  })
  .from(posts)
  .innerJoin(users, eq(posts.authorId, users.id))
  .where(eq(users.id, 1));`,
      },
      keyTakeaways: [
        "Application data access should be organized into clear queries.",
        "Foreign keys represent relationships between tables.",
        "Joins retrieve related data in relational systems.",
        "Database constraints protect integrity across all application code paths.",
      ],
      commonMistakes: [
        "Fetching all columns when only a few are needed.",
        "Loading relationships with many separate queries and creating N+1 problems.",
        "Relying only on application validation instead of database constraints.",
      ],
      quiz: [
        {
          question: "What does a foreign key provide?",
          options: [
            "A relationship between records in related tables.",
            "A CSS variable.",
            "A React prop.",
            "An environment variable.",
          ],
          correctIndex: 0,
          explanation:
            "A foreign key links a record to a related record, often in another table.",
        },
      ],
    },

    {
      id: "database-transactions",
      title: "Transactions and atomic database operations",
      durationMinutes: 18,
      explanation: `
A transaction groups database operations into one logical unit.

The key property is **atomicity**: either all required operations succeed together, or the database rolls back the transaction so partial changes are not committed.

Imagine creating an order:
1. create the order;
2. create order items;
3. reduce inventory;
4. record payment state.

If step 3 fails after steps 1 and 2 have already committed, the database can become inconsistent. A transaction can keep the related changes together.

### When to use a transaction

Use a transaction when multiple database mutations must succeed or fail as one business operation.

Do not automatically wrap every read in a transaction. Transactions have a cost and should represent a real consistency requirement.

### Transaction boundaries

The transaction should include the operations that need atomicity. External network calls should generally not be treated as if they were part of the database transaction because the external service cannot automatically roll back when PostgreSQL rolls back.

For complex workflows, use an explicit design for external side effects, such as an outbox or retryable job pattern.
      `,
      diagram: `
BEGIN TRANSACTION
       |
       +--> create order
       |
       +--> create items
       |
       +--> update inventory
       |
       +--> record state
       |
       v
   All succeed?
     /       \
   Yes       No
    |         |
 COMMIT    ROLLBACK
      `,
      codeExample: {
        title: "A transaction for an order",
        code: `await db.transaction(async (tx) => {
  const order = await createOrder(tx, userId);

  await createOrderItems(tx, order.id, items);

  await decreaseInventory(tx, items);

  await markOrderCreated(tx, order.id);
});`,
      },
      keyTakeaways: [
        "Transactions group related database operations into one atomic unit.",
        "Rollback prevents partial database mutations when a transaction fails.",
        "Use transactions for real consistency requirements, not automatically for every query.",
        "External side effects need separate reliability strategies.",
      ],
      commonMistakes: [
        "Updating related tables separately when they must be atomic.",
        "Holding a transaction open while waiting on slow external HTTP requests.",
        "Assuming a database transaction can roll back an external API call.",
      ],
      quiz: [
        {
          question: "What is the main reason to use a transaction?",
          options: [
            "To make CSS faster.",
            "To ensure related database mutations succeed or fail together.",
            "To expose database credentials.",
            "To replace indexes.",
          ],
          correctIndex: 1,
          explanation:
            "Transactions provide atomicity for related database operations.",
        },
      ],
    },

    {
      id: "blog-database-design",
      title: "Putting the database layer together",
      durationMinutes: 18,
      explanation: `
A useful way to learn database integration is to build a small domain with real relationships.

For a blog, you might have:
- users;
- posts;
- comments;
- categories.

A post belongs to an author. A post can have many comments. A post can also belong to one or more categories.

Start by modeling the relationships before writing UI code.

### Database-first thinking

For each entity, ask:
- What uniquely identifies it?
- Which fields are required?
- Which fields must be unique?
- Which records depend on another record?
- Which operations must be atomic?
- Which queries will be frequent enough to need indexes?

### Data access

The UI should not know how PostgreSQL works. A Server Component can call a service/data function, which calls the ORM.

This creates a boundary that makes future changes easier.

### Project progression

Start with simple CRUD. Then add relationships. Then add a transaction such as creating a post and its initial metadata together.

This sequence teaches both database fundamentals and how the database fits into a Next.js architecture.
      `,
      diagram: `
Blog UI
  |
  v
Server Component
  |
  v
Blog service
  |
  v
ORM / query layer
  |
  v
PostgreSQL
  |
  +--> users
  +--> posts
  +--> comments
  +--> categories
      `,
      codeExample: {
        title: "A simple blog data-access function",
        code: `// lib/blog/posts.ts
import "server-only";

export async function getPostById(id: number) {
  return db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, id),
    with: {
      author: true,
      comments: true,
    },
  });
}

// A Server Component can consume this function
// without knowing the database query details.`,
      },
      keyTakeaways: [
        "Model the domain and relationships before building complicated UI.",
        "Keep database details behind a server-side data-access boundary.",
        "Use constraints and transactions to protect data integrity.",
        "Indexes and query shape matter as the application grows.",
      ],
      commonMistakes: [
        "Putting ORM queries directly into every UI component.",
        "Skipping relationship design until after the application is built.",
        "Creating transactions without understanding the business operation they protect.",
      ],
      quiz: [
        {
          question: "Why create a data-access boundary around ORM queries?",
          options: [
            "So UI components do not need to know database implementation details.",
            "So PostgreSQL can run in the browser.",
            "So transactions are unnecessary.",
            "So every query becomes static.",
          ],
          correctIndex: 0,
          explanation:
            "A data-access boundary keeps persistence concerns separate from UI concerns.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "Why should database access remain server-side?",
      options: [
        "Browsers cannot display HTML.",
        "Database credentials and direct database access must not be exposed to users.",
        "PostgreSQL only supports CSS.",
        "Client Components cannot render.",
      ],
      correctIndex: 1,
      explanation:
        "The server should protect database credentials and control access to the database.",
    },
    {
      question: "What does a foreign key represent?",
      options: [
        "A relationship between records.",
        "A React state variable.",
        "A URL query parameter.",
        "A CSS class.",
      ],
      correctIndex: 0,
      explanation:
        "Foreign keys connect related records in relational databases.",
    },
    {
      question: "Why use a transaction?",
      options: [
        "To group related mutations into one atomic operation.",
        "To make every request static.",
        "To replace PostgreSQL.",
        "To send secrets to the browser.",
      ],
      correctIndex: 0,
      explanation:
        "Transactions protect consistency when several database operations belong to one business operation.",
    },
    {
      question: "What should you understand even when using an ORM?",
      options: [
        "Only React hooks.",
        "SQL, relationships, indexes, constraints, and transaction behavior.",
        "Only CSS.",
        "Nothing about databases.",
      ],
      correctIndex: 1,
      explanation:
        "ORMs abstract database operations but do not remove the need for database knowledge.",
    },
    {
      question: "What is connection pooling?",
      options: [
        "Managing reusable database connections instead of opening an uncontrolled new connection for every operation.",
        "A React rendering technique.",
        "A URL parser.",
        "A caching tag.",
      ],
      correctIndex: 0,
      explanation:
        "A pool manages reusable database connections efficiently.",
    },
  ],

  project: {
    name: "Blog database",
    goal: "Build a PostgreSQL-backed blog with users, posts, comments, relationships, queries, and a transaction.",
    brief:
      "Create a small blog data layer and UI. Keep database access server-only, use an ORM, model relationships, implement common queries, and use a transaction for a multi-step write.",
    steps: [
      "Set up PostgreSQL and the ORM.",
      "Create users, posts, and comments tables.",
      "Add primary keys, foreign keys, required fields, and useful unique constraints.",
      "Create server-only database access.",
      "Build queries for listing posts and loading one post with its author and comments.",
      "Create a post mutation.",
      "Use a transaction for creating a post together with required related records.",
      "Add appropriate indexes after considering common query patterns.",
    ],
    acceptance: [
      "PostgreSQL is the persistent data store.",
      "Database access is server-only.",
      "The schema contains meaningful relationships.",
      "The project has read and write queries.",
      "At least one business operation uses a transaction.",
    ],
    stretch: [
      "Add categories and a many-to-many relationship.",
      "Add pagination to the post list.",
      "Inspect generated SQL and analyze an important query.",
    ],
  },
};
