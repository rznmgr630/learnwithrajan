import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_34_LESSONS: LessonDay = {
  day: 34,
  title: "Prisma",
  totalMinutes: 150,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "prisma-architecture",
      title: "Prisma architecture",
      durationMinutes: 24,
      explanation: `Prisma is a modern database toolkit commonly used in Node.js and TypeScript applications. It gives your application a strongly typed way to communicate with a database without requiring you to write every SQL statement manually.

A useful way to understand Prisma is to imagine that your application has three important layers.

The first layer is the <b>Prisma schema</b>. This is where you describe your database models, fields, relationships, and database connection configuration.

The second layer is the <b>Prisma Client</b>. Prisma reads your schema and generates a TypeScript client specifically for the models you defined. Instead of manually remembering table names and column names, your editor can provide autocomplete and TypeScript checking.

The third layer is the <b>database</b>. Prisma Client eventually communicates with PostgreSQL, MySQL, SQLite, SQL Server, CockroachDB, or another supported database depending on your setup.

Think about an online store.

A customer places an order from a React or mobile application. The request reaches a NestJS controller. The controller calls an application service. The service needs to create an order in the database. Instead of manually writing SQL for every operation, the service can use Prisma Client.

The flow looks like this:

HTTP Request
    |
    v
NestJS Controller
    |
    v
OrderService
    |
    v
PrismaService
    |
    v
Prisma Client
    |
    v
PostgreSQL
    |
    v
Orders table

Prisma does not replace your database. PostgreSQL is still responsible for storing the actual data, enforcing database constraints, executing queries, managing transactions, indexes, locks, and other database operations.

Prisma is the developer-facing layer that makes those database operations easier to work with from TypeScript.

<b>Beginner real-world example:</b>

Imagine a library application with a Book model.

Instead of manually writing something like:

SELECT * FROM books WHERE id = '123';

you can write a Prisma query that describes what you want from the Book model.

The important beginner idea is that Prisma Client is generated from your schema. If you add a new model or field to your Prisma schema and regenerate the client, TypeScript can understand the new structure.

<b>Intermediate real-world example:</b>

Imagine an e-commerce application containing User, Product, Order, and OrderItem models.

Your service might ask Prisma for an order together with its customer and products. Prisma can understand these relationships because they were described in the schema.

This means your application code can work with related records without manually constructing multiple SQL statements for every common operation.

<b>Advanced real-world example:</b>

Imagine a SaaS application with millions of users.

Prisma can still be used, but database design and performance become extremely important. You need to think about indexes, query shape, connection pooling, transaction boundaries, pagination, database constraints, and whether a particular query should use Prisma's normal query API or carefully controlled raw SQL.

Prisma makes database access easier. It does not remove the need to understand databases.

A developer who understands both Prisma and SQL can make much better decisions than someone who treats Prisma as a magic database layer.`,
      diagram: `Application
    |
    v
NestJS Controller
    |
    v
Service / Use Case
    |
    v
PrismaService
    |
    v
Prisma Client
    |
    +-------------------+
    |                   |
    v                   v
Generated Types     Query Engine
                        |
                        v
                    Database
                        |
                        v
                    PostgreSQL

Prisma schema
      |
      v
prisma generate
      |
      v
Generated Prisma Client`,
      codeExample: {
        title: "Basic Prisma architecture in NestJS",
        code: `// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(uuid())
  email String @unique
  name  String
}

// prisma/prisma.service.ts

import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// users/users.service.ts

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}`,
      },
      keyTakeaways: [
        "Prisma is a database toolkit for TypeScript and Node.js applications.",
        "The Prisma schema describes models, relationships, generators, and database configuration.",
        "Prisma Client is generated from the Prisma schema.",
        "Prisma Client provides typed database operations to your application.",
        "Prisma does not replace PostgreSQL or another database.",
        "Understanding SQL and database fundamentals is still important when using Prisma.",
        "A NestJS application commonly wraps PrismaClient inside a PrismaService.",
      ],
      commonMistakes: [
        "<b>Thinking Prisma is the database.</b> Prisma is a database access toolkit. PostgreSQL, MySQL, or another database still stores the data.",
        "<b>Creating a new PrismaClient inside every service.</b> This can create unnecessary database connections. A shared PrismaService is commonly used in NestJS applications.",
        "<b>Assuming Prisma makes every query fast.</b> Poor indexes, large result sets, inefficient joins, and bad pagination can still make a Prisma query slow.",
        "<b>Ignoring SQL knowledge.</b> Prisma abstracts many queries, but developers still need to understand what the database is doing.",
      ],
      quiz: [
        {
          question: "What is Prisma Client?",
          options: [
            "A PostgreSQL database",
            "A generated TypeScript database client",
            "A frontend framework",
            "A NestJS controller",
          ],
          correctIndex: 1,
          explanation:
            "Prisma Client is generated from the Prisma schema and provides typed database operations.",
        },
        {
          question: "What is the Prisma schema used for?",
          options: [
            "Defining database models and Prisma configuration",
            "Creating React components",
            "Handling HTTP authentication",
            "Rendering HTML",
          ],
          correctIndex: 0,
          explanation:
            "The Prisma schema describes models, relationships, datasource configuration, and the Prisma client generator.",
        },
        {
          question: "Does Prisma replace PostgreSQL?",
          options: [
            "Yes",
            "Only in production",
            "No",
            "Only when using NestJS",
          ],
          correctIndex: 2,
          explanation:
            "Prisma communicates with the database. PostgreSQL remains the database that stores and manages the data.",
        },
      ],
    },
    {
      id: "prisma-schema",
      title: "Prisma schema",
      durationMinutes: 25,
      explanation: `The Prisma schema is one of the most important files in a Prisma application.

It usually lives at:

prisma/schema.prisma

The schema tells Prisma what your application data looks like.

A model in Prisma normally represents a database table. A field normally represents a database column. Relations describe how models are connected.

For example, consider an e-commerce application.

A User can create many Orders.

An Order can contain many OrderItems.

Each OrderItem belongs to one Product.

That gives us a relationship like:

User
 |
 | 1
 |
 | many
 v
Order
 |
 | 1
 |
 | many
 v
OrderItem
 |
 | many
 |
 | 1
 v
Product

The Prisma schema can describe this structure.

<b>Beginner real-world example:</b>

Suppose you are building a task management application.

A User has:

- id
- email
- name

A Task has:

- id
- title
- completed
- userId

The userId field connects a task to its owner.

<b>Intermediate real-world example:</b>

Suppose you are building a food delivery application.

A Restaurant has many MenuItems.

Each MenuItem belongs to one Restaurant.

An Order belongs to a Customer.

An Order has many OrderItems.

Instead of storing everything inside one giant table, you create separate models and relationships.

This makes the data easier to maintain and query.

<b>Advanced real-world example:</b>

Imagine a marketplace such as a platform where thousands of sellers can list millions of products.

You may have models such as:

User
Seller
Product
Category
ProductImage
Inventory
Order
OrderItem
Payment

At this point, the schema is not just about making the application work. You need to think about uniqueness, optional fields, indexes, deletion behavior, relation direction, and how frequently certain queries will run.

For example, an email address might need to be unique:

email String @unique

A product SKU might also need to be unique:

sku String @unique

A frequently searched foreign key might receive an index.

The schema therefore becomes an important part of your application's data architecture.

<b>One important concept:</b>

Prisma schema syntax is not exactly the same thing as SQL syntax.

You describe the model using Prisma's schema language, and Prisma translates your model operations into database-specific operations.

This gives you a convenient developer experience while still using the underlying database's capabilities.`,
      diagram: `prisma/schema.prisma

generator
    |
    +--> Generates Prisma Client

datasource
    |
    +--> Connects Prisma to database

models
    |
    +--> User
    +--> Product
    +--> Order
    +--> OrderItem

relations
    |
    +--> User -> Orders
    +--> Order -> OrderItems
    +--> OrderItem -> Product`,
      codeExample: {
        title: "Beginner-to-advanced Prisma schema",
        code: `// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())

  orders Order[]
}

model Product {
  id          String      @id @default(uuid())
  name        String
  sku         String      @unique
  price       Decimal
  stock       Int         @default(0)
  createdAt   DateTime    @default(now())

  orderItems OrderItem[]

  @@index([name])
}

model Order {
  id        String      @id @default(uuid())
  userId    String
  status    OrderStatus @default(PENDING)
  total     Decimal
  createdAt DateTime    @default(now())

  user      User        @relation(fields: [userId], references: [id])
  items     OrderItem[]

  @@index([userId])
  @@index([status, createdAt])
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  unitPrice Decimal

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@index([orderId])
  @@index([productId])
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}`,
      },
      keyTakeaways: [
        "The Prisma schema is usually stored in prisma/schema.prisma.",
        "Models generally represent database tables.",
        "Fields generally represent database columns.",
        "Relations describe connections between models.",
        "The @id attribute identifies a primary key.",
        "The @unique attribute creates a uniqueness requirement.",
        "The @@index attribute defines a database index.",
        "Enums are useful when a field has a controlled set of values.",
        "Schema design becomes more important as the application grows.",
      ],
      commonMistakes: [
        "<b>Using strings for everything.</b> Proper types such as DateTime, Int, Boolean, Decimal, and enums can communicate your data requirements much more clearly.",
        "<b>Forgetting uniqueness.</b> Fields such as email or SKU may need database-level uniqueness rather than relying only on application checks.",
        "<b>Creating relationships without indexes.</b> Foreign keys and frequently filtered fields may need appropriate indexes depending on query patterns.",
        "<b>Putting every possible field into one model.</b> Related data should normally be modeled separately when it represents separate concepts.",
      ],
      quiz: [
        {
          question: "Where is the Prisma schema commonly stored?",
          options: [
            "src/main.ts",
            "prisma/schema.prisma",
            "package.json",
            "src/database.sql",
          ],
          correctIndex: 1,
          explanation:
            "The conventional Prisma schema location is prisma/schema.prisma.",
        },
        {
          question: "What does @id normally represent?",
          options: [
            "A primary key",
            "An HTTP route",
            "A password",
            "A database connection",
          ],
          correctIndex: 0,
          explanation:
            "@id marks a field or field combination as the model's identifier.",
        },
        {
          question: "What does @unique communicate?",
          options: [
            "The field must be unique",
            "The field is optional",
            "The field is encrypted",
            "The field is a relation",
          ],
          correctIndex: 0,
          explanation:
            "@unique tells Prisma and the database that duplicate values are not allowed for that field.",
        },
      ],
    },
    {
      id: "prisma-client",
      title: "Prisma Client",
      durationMinutes: 25,
      explanation: `Prisma Client is the API your application uses to communicate with the database.

After defining your Prisma schema, Prisma generates a client based on your models.

For example, if your schema contains:

model User {
  id    String @id @default(uuid())
  email String @unique
  name  String
}

Prisma Client gives you operations associated with the User model.

You can create users, find users, update users, delete users, count users, and query related records.

This is one of the biggest benefits of Prisma: your TypeScript editor understands your database models.

<b>Beginner real-world example:</b>

Imagine a registration endpoint.

The user submits:

email = "alex@example.com"
name = "Alex"

Your service can call Prisma to create the record.

Instead of manually writing SQL and manually mapping database rows into TypeScript objects, Prisma gives you a structured API.

<b>Intermediate real-world example:</b>

Imagine an admin dashboard.

The administrator wants:

- the newest users
- only active users
- 20 users per page
- selected fields only

Prisma can express these requirements through where, orderBy, take, skip, and select.

<b>Advanced real-world example:</b>

Imagine a reporting dashboard where you need several conditions, nested relations, aggregation, and pagination.

Prisma Client can build many of these queries while keeping your application code typed.

However, advanced developers also need to understand the SQL generated by the query.

For a complicated query, the important question is not simply:

"Does Prisma accept this code?"

The better question is:

"What SQL will the database execute, and can the database execute it efficiently?"

That mindset becomes extremely important in production systems.

<b>Select versus include:</b>

select is useful when you want to explicitly choose fields.

include is useful when you want to load relations in addition to the model's normal fields.

For example, a customer profile may need the user's name but not every database column.

Returning only required fields can reduce unnecessary data transfer and make your API response clearer.

<b>findUnique versus findFirst:</b>

findUnique is designed for unique fields or unique combinations.

findFirst searches for the first record matching a condition.

Understanding this distinction prevents confusing query behavior.`,
      diagram: `Prisma Client

prisma.user
   |
   +--> create()
   +--> findUnique()
   +--> findFirst()
   +--> findMany()
   +--> update()
   +--> updateMany()
   +--> delete()
   +--> deleteMany()
   +--> count()
   +--> aggregate()

Query options
   |
   +--> where
   +--> select
   +--> include
   +--> orderBy
   +--> skip
   +--> take`,
      codeExample: {
        title: "CRUD with Prisma Client",
        code: `import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string, name: string) {
    return this.prisma.user.create({
      data: {
        email,
        name,
      },
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findUsers() {
    return this.prisma.user.findMany({
      where: {
        name: {
          not: null,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  }

  async updateUser(id: string, name: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}`,
      },
      keyTakeaways: [
        "Prisma Client is the main database API used by your application.",
        "Prisma Client is generated from the schema.",
        "findUnique is intended for unique identifiers or unique constraints.",
        "findMany retrieves multiple records.",
        "select lets you control which fields are returned.",
        "include lets you load related records.",
        "where defines filtering conditions.",
        "orderBy controls sorting.",
        "take and skip can be used for offset pagination.",
      ],
      commonMistakes: [
        "<b>Returning every column automatically.</b> Use select when an endpoint only needs a small subset of fields.",
        "<b>Using findFirst when a unique lookup is intended.</b> Use findUnique when the lookup is based on a unique field or unique combination.",
        "<b>Fetching thousands of records without pagination.</b> Large result sets can consume memory and database resources.",
        "<b>Using skip for extremely deep pagination without understanding the database cost.</b> Cursor pagination can be more appropriate for large datasets.",
      ],
      quiz: [
        {
          question: "Which Prisma method is designed for a unique lookup?",
          options: [
            "findUnique",
            "findMany",
            "deleteMany",
            "aggregate",
          ],
          correctIndex: 0,
          explanation:
            "findUnique is designed to find a record using a unique field or unique combination.",
        },
        {
          question: "What does select control?",
          options: [
            "Which fields are returned",
            "Which database is used",
            "Which NestJS module starts first",
            "Which migration runs",
          ],
          correctIndex: 0,
          explanation:
            "select lets you explicitly choose fields returned by the query.",
        },
        {
          question: "What does orderBy do?",
          options: [
            "Creates a table",
            "Controls query sorting",
            "Starts a transaction",
            "Deletes relations",
          ],
          correctIndex: 1,
          explanation:
            "orderBy specifies how records should be sorted.",
        },
      ],
    },
    {
      id: "prisma-relations",
      title: "Relations with Prisma",
      durationMinutes: 25,
      explanation: `Real applications rarely contain isolated tables.

A customer has orders.

An order has order items.

An order item belongs to a product.

A blog post belongs to an author.

A user may belong to many teams.

Prisma lets you describe these relationships directly in your schema.

Consider a simple relationship:

User -> Order

One user can have many orders.

In Prisma, the User model can have:

orders Order[]

and the Order model can contain the foreign key:

userId String

along with the relation:

user User @relation(fields: [userId], references: [id])

The database stores the actual foreign key. Prisma gives your application a convenient way to navigate that relationship.

<b>Beginner real-world example:</b>

A school application has:

Student
Course

A student can enroll in multiple courses.

A course can contain multiple students.

That is a many-to-many relationship and normally requires a join table.

<b>Intermediate real-world example:</b>

An online shop has:

Customer
Order
OrderItem
Product

A customer can have many orders.

An order has many order items.

Each order item points to one product.

You can query an order and include the customer and order items.

<b>Advanced real-world example:</b>

Imagine a social platform.

A User can follow many other Users.

A User can also be followed by many Users.

This is a self-referencing many-to-many relationship.

Another example is an organization platform where users belong to teams and teams have permissions.

At this level, relationships become part of your business architecture.

You need to think about:

- whether relationships are optional
- whether related records should be deleted
- whether deletion should cascade
- whether a relation needs an index
- whether the relation represents ownership
- whether the relationship needs extra fields

<b>Relation loading:</b>

You can load relations using include.

You can also select specific nested fields.

For example, an order endpoint might return:

order id
customer name
product names
quantities

without returning private customer information.

This is useful because API responses should contain the information required by the client, not automatically expose every database field.`,
      diagram: `User
  |
  | 1
  |
  | many
  v
Order
  |
  | 1
  |
  | many
  v
OrderItem
  |
  | many
  |
  | 1
  v
Product

Prisma relation:

User.orders
Order.user
Order.items
OrderItem.order
OrderItem.product
Product.orderItems`,
      codeExample: {
        title: "Loading nested relations",
        code: `const order = await this.prisma.order.findUnique({
  where: {
    id: orderId,
  },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    items: {
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    },
  },
});

console.log(order?.user.name);

for (const item of order?.items ?? []) {
  console.log(item.product.name);
  console.log(item.quantity);
}`,
      },
      keyTakeaways: [
        "Prisma relations describe connections between models.",
        "A foreign key is stored in the database and connects related records.",
        "include can load related records.",
        "Nested select can control exactly which fields are returned.",
        "Many-to-many relationships often require a join table.",
        "Self-referencing relationships are possible.",
        "Relation design should consider deletion behavior and indexing.",
      ],
      commonMistakes: [
        "<b>Assuming relations are only a Prisma concept.</b> Relations usually correspond to actual database relationships and foreign keys.",
        "<b>Loading every relation automatically.</b> Large nested queries can return huge amounts of data.",
        "<b>Ignoring deletion behavior.</b> Deleting a parent record can have important consequences for related records.",
        "<b>Returning sensitive relation data.</b> Use select to control what your API exposes.",
      ],
      quiz: [
        {
          question: "What does a foreign key connect?",
          options: [
            "Two related database records or tables",
            "Two HTTP requests",
            "Two TypeScript files",
            "Two NestJS controllers",
          ],
          correctIndex: 0,
          explanation:
            "A foreign key establishes a relationship between records in related tables.",
        },
        {
          question: "Which Prisma option can load related records?",
          options: [
            "include",
            "sort",
            "connectDatabase",
            "render",
          ],
          correctIndex: 0,
          explanation:
            "include can request related records as part of a Prisma query.",
        },
        {
          question: "Why might you use nested select?",
          options: [
            "To control returned fields",
            "To create a NestJS controller",
            "To change the database password",
            "To generate React components",
          ],
          correctIndex: 0,
          explanation:
            "Nested select lets you control exactly which fields from related records are returned.",
        },
      ],
    },
    {
      id: "prisma-migrations",
      title: "Prisma migrations",
      durationMinutes: 26,
      explanation: `A Prisma schema describes how you want your data model to look, but your actual database also needs to be changed.

That is where migrations come in.

Imagine your application starts with:

\`\`\`
User
----
id
email
\`\`\`

Later, your product manager asks for:

\`\`\`
User
----
id
email
displayName
\`\`\`

You change the Prisma schema.

But changing schema.prisma alone does not automatically mean every production database now contains a displayName column.

A migration records the database change.

A typical development workflow is:

1. Change schema.prisma.
2. Create a migration.
3. Prisma generates SQL describing the database change.
4. Apply the migration to your development database.
5. Test the application.
6. Commit the migration files.
7. Deploy the application.
8. Run migrations against the production database.

<b>Beginner real-world example:</b>

You have a User model with email.

You add a name field.

The migration might effectively tell PostgreSQL:

ALTER TABLE users ADD COLUMN name TEXT;

You normally do not need to manually write that SQL when using the standard Prisma migration workflow.

<b>Intermediate real-world example:</b>

Your store needs product stock.

You add:

stock Int @default(0)

The migration creates the required database change.

Your application and database schema now evolve together.

<b>Advanced real-world example:</b>

Imagine a production database with millions of rows.

You want to change a column or add a required field.

A seemingly simple schema change can become a production performance problem.

For example, adding a required column to a huge table may require a careful migration strategy.

You might first add the column as nullable, deploy application code that can handle both old and new records, backfill existing data, and only later make the column required.

This is called an <b>expand-and-contract style</b> of database change.

The important lesson is that production migrations are not merely development commands. A migration can affect a live system with real users and real traffic.

<b>Migration history:</b>

Prisma migrations create a history of database changes.

That history should normally be committed to source control.

This means a team can understand how the database evolved over time.

You should not treat the production database as something that developers manually modify whenever they feel like it. Controlled migrations make changes repeatable and reviewable.`,
      diagram: `schema.prisma
     |
     | change model
     v
prisma migrate dev
     |
     v
Migration file
     |
     v
SQL changes
     |
     v
Development database

Git repository
     |
     v
Production deployment
     |
     v
prisma migrate deploy
     |
     v
Production database`,
      codeExample: {
        title: "A simple Prisma migration workflow",
        code: `// Before

model User {
  id    String @id @default(uuid())
  email String @unique
}

// After

model User {
  id          String @id @default(uuid())
  email       String @unique
  displayName String?
}

// Create a development migration:
//
// npx prisma migrate dev --name add_user_display_name
//
// Prisma creates a migration directory containing SQL.
//
// In production, apply committed migrations:
//
// npx prisma migrate deploy

// A safer production-style expansion might begin with:

model User {
  id          String @id @default(uuid())
  email       String @unique
  displayName String?
}

// After application code has populated existing records,
// a later migration could make the field required.`,
      },
      keyTakeaways: [
        "Changing schema.prisma and changing the actual database are separate concerns.",
        "Migrations record database schema changes.",
        "Migration files should normally be committed to source control.",
        "Development migrations and production migration workflows have different purposes.",
        "Production migrations should be treated as potentially risky database operations.",
        "Large tables may require staged or expand-and-contract migration strategies.",
        "A migration history makes database changes repeatable and reviewable.",
      ],
      commonMistakes: [
        "<b>Editing the production database manually and forgetting the migration history.</b> Future environments can become inconsistent.",
        "<b>Running development migration commands casually against production.</b> Production deployments should use an intentional migration workflow.",
        "<b>Assuming every schema change is instant.</b> Large tables and indexes can make migrations expensive.",
        "<b>Changing the application and database without considering deployment order.</b> During rolling deployments, old and new application versions may temporarily coexist.",
      ],
      quiz: [
        {
          question: "What is a migration?",
          options: [
            "A recorded database schema change",
            "A frontend component",
            "A NestJS guard",
            "A TypeScript interface",
          ],
          correctIndex: 0,
          explanation:
            "A migration records a controlled change to the database schema.",
        },
        {
          question: "Why commit migrations to source control?",
          options: [
            "To preserve database change history",
            "To make React faster",
            "To encrypt passwords",
            "To replace PostgreSQL",
          ],
          correctIndex: 0,
          explanation:
            "Migration files provide a repeatable and reviewable history of database changes.",
        },
        {
          question: "Why can production migrations be difficult?",
          options: [
            "Production contains real data and traffic",
            "Prisma cannot connect to PostgreSQL",
            "TypeScript stops working",
            "NestJS cannot use databases",
          ],
          correctIndex: 0,
          explanation:
            "Production schema changes can affect large tables, active queries, locks, and real users.",
        },
      ],
    },
    {
      id: "prisma-transactions",
      title: "Transactions with Prisma",
      durationMinutes: 25,
      explanation: `A transaction is useful when multiple database operations must behave as one logical unit.

Imagine an online store.

A customer buys a product.

The application may need to:

1. Create an order.
2. Create order items.
3. Reduce inventory.
4. Record a payment attempt.

What happens if step 1 succeeds but step 3 fails?

You may end up with an order that exists but inventory was never updated.

A transaction allows related database operations to succeed together or roll back together.

<b>Beginner real-world example:</b>

Imagine transferring money between two bank accounts.

You subtract $100 from Account A.

You add $100 to Account B.

If the subtraction succeeds but the addition fails, the system cannot simply leave the database in that state.

The two operations belong to one transaction.

<b>Intermediate real-world example:</b>

An e-commerce checkout creates:

Order
OrderItems
Inventory update

These operations should normally be coordinated carefully.

<b>Advanced real-world example:</b>

Imagine a payment system where an order, inventory reservation, and payment record are involved.

A transaction can protect database consistency, but it does not magically make external systems transactional.

For example:

Database transaction
    |
    +--> create order
    +--> reserve inventory
    +--> create payment record

External payment provider
    |
    +--> Stripe or another provider

Your PostgreSQL transaction cannot automatically roll back a payment provider's successful charge.

This is where concepts such as idempotency keys, outbox patterns, retries, and compensating actions become important.

Prisma supports interactive transactions and sequential transaction APIs.

The choice depends on what your operation needs.

<b>Important:</b>

Keep transactions as short as practical.

A transaction that stays open while waiting for slow network requests can hold database resources for too long.

Do not normally do this:

start transaction
    |
    +--> update database
    |
    +--> call external payment API
    |
    +--> wait 5 seconds
    |
    +--> update database
commit

Instead, carefully separate external communication from database transactions and design the workflow for retries and failure.`,
      diagram: `Transaction

BEGIN
  |
  +--> Create Order
  |
  +--> Create Order Items
  |
  +--> Update Inventory
  |
  +--> Record Payment State
  |
  +--> COMMIT
          |
          v
       Success

If something fails:

BEGIN
  |
  +--> Operation
  |
  +--> ERROR
        |
        v
      ROLLBACK`,
      codeExample: {
        title: "Checkout transaction with Prisma",
        code: `async checkout(
  userId: string,
  productId: string,
  quantity: number,
) {
  return this.prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Not enough stock");
    }

    const order = await tx.order.create({
      data: {
        userId,
        total: product.price.mul(quantity),
        items: {
          create: {
            productId: product.id,
            quantity,
            unitPrice: product.price,
          },
        },
      },
    });

    await tx.product.update({
      where: {
        id: product.id,
      },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return order;
  });
}`,
      },
      keyTakeaways: [
        "Transactions group related database operations into one logical unit.",
        "A successful transaction commits its changes.",
        "A failed transaction can roll back its database changes.",
        "Transactions are useful for operations that must maintain database consistency.",
        "Keep transactions as short as practical.",
        "Database transactions do not automatically include external services.",
        "External payment or messaging systems often require additional reliability patterns.",
      ],
      commonMistakes: [
        "<b>Opening a transaction and then making slow external API calls inside it.</b> This can keep database resources locked longer than necessary.",
        "<b>Assuming a database transaction can roll back an external payment.</b> External systems need their own failure and retry strategy.",
        "<b>Using transactions for every single read.</b> Transactions are useful when operations need transactional consistency, not simply because they are available.",
        "<b>Ignoring concurrency.</b> Transactions help with consistency, but concurrent updates may still require appropriate isolation or locking strategies.",
      ],
      quiz: [
        {
          question: "What happens when a transaction commits?",
          options: [
            "Its successful changes are made permanent",
            "All changes are deleted",
            "The database is restarted",
            "Prisma Client is regenerated",
          ],
          correctIndex: 0,
          explanation:
            "Commit makes the successful transaction changes permanent.",
        },
        {
          question: "What does rollback do?",
          options: [
            "Reverts the transaction's database changes",
            "Creates a new table",
            "Generates Prisma Client",
            "Changes TypeScript types",
          ],
          correctIndex: 0,
          explanation:
            "Rollback discards changes made by the transaction.",
        },
        {
          question: "Should a transaction normally wait several seconds for an external API?",
          options: [
            "Yes, always",
            "No, long external waits can keep database resources occupied",
            "Only in development",
            "Only when using PostgreSQL",
          ],
          correctIndex: 1,
          explanation:
            "Long-running transactions can hold locks and consume database resources, so external operations should be designed carefully.",
        },
      ],
    },
    {
      id: "prisma-vs-typeorm",
      title: "Prisma vs TypeORM",
      durationMinutes: 25,
      explanation: `Prisma and TypeORM are both popular ways to work with databases from TypeScript applications, but they approach the problem differently.

TypeORM is an ORM that maps classes and decorators to database entities.

Prisma uses a schema-first approach and generates a typed Prisma Client.

Neither approach means you no longer need to understand databases.

The important question is how each tool fits your team's architecture, existing codebase, database requirements, and development style.

<b>Beginner comparison:</b>

TypeORM commonly starts with an entity class:

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
}

Prisma commonly starts with:

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
}

TypeORM feels like working with decorated TypeScript classes.

Prisma feels like describing your database models in a dedicated schema language and then using a generated client.

<b>Intermediate real-world example:</b>

Imagine a NestJS team building an internal business application.

With TypeORM, the team may define entities, repositories, decorators, and relations directly in TypeScript.

With Prisma, the team may keep the database schema in schema.prisma and use generated client methods.

Both can support relationships, transactions, migrations, filtering, sorting, and complex database operations.

The day-to-day developer experience is different.

<b>Advanced real-world example:</b>

Imagine a large application with an existing PostgreSQL database.

The database already contains hundreds of tables and years of production history.

The decision is no longer simply:

"Which ORM is easier?"

The team needs to investigate:

- existing schema compatibility
- migration strategy
- raw SQL requirements
- relation complexity
- transaction requirements
- database-specific features
- team familiarity
- testing strategy
- performance requirements
- generated types
- repository architecture
- deployment workflow

The right tool depends heavily on the system.

<b>Prisma's strengths:</b>

Prisma provides a strongly typed generated client and a schema-driven development model. Developers often get excellent autocomplete and compile-time feedback when working with models.

<b>TypeORM's strengths:</b>

TypeORM provides an entity-oriented model and fits naturally with applications that prefer class-based entities, decorators, repositories, and traditional ORM patterns.

<b>One important architectural point:</b>

Do not allow your controllers to become tightly coupled to your database tool.

For example, avoid putting large Prisma queries directly into controllers.

A cleaner structure is:

Controller
    |
    v
Application Service
    |
    v
Repository / Data Access
    |
    v
Prisma

This makes your business logic easier to test and keeps database-specific details closer to the data-access layer.

You do not need to blindly create an abstraction over every Prisma method, but you should keep responsibilities clear.

If your service contains hundreds of lines of database query construction, your architecture may need another layer.

<b>Choosing between Prisma and TypeORM:</b>

Do not choose based only on popularity.

Look at the database, team, existing architecture, query requirements, migration requirements, and operational needs.

The most important skill is not memorizing which tool is "better."

The important skill is understanding what the application needs and knowing how your chosen database tool behaves underneath.`,
      diagram: `TypeORM

Entity classes
     |
Decorators
     |
TypeORM
     |
Database

Prisma

schema.prisma
     |
prisma generate
     |
Prisma Client
     |
Database

Both:

NestJS Controller
        |
        v
     Service
        |
        v
Data Access Layer
        |
        v
     Database`,
      codeExample: {
        title: "The same User concept with TypeORM and Prisma",
        code: `// TypeORM style

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;
}

// Prisma style

// prisma/schema.prisma

model User {
  id    String @id @default(uuid())
  email String @unique
  name  String
}

// Application query

const user = await prisma.user.findUnique({
  where: {
    email: "alex@example.com",
  },
});

// A clean NestJS architecture can keep this
// database-specific code inside a data-access layer:
//
// Controller
//     |
//     v
// UsersService
//     |
//     v
// UsersRepository
//     |
//     v
// PrismaService
//     |
//     v
// PostgreSQL`,
      },
      keyTakeaways: [
        "Prisma and TypeORM are different approaches to database access.",
        "Prisma uses a schema-first approach with generated Prisma Client.",
        "TypeORM commonly uses entity classes and decorators.",
        "Both tools can work with relationships, migrations, transactions, and complex queries.",
        "Neither tool removes the need to understand databases.",
        "Existing database architecture should influence tool selection.",
        "Keeping database-specific code in a data-access layer can improve application architecture.",
        "Avoid choosing a database tool purely because it is popular.",
      ],
      commonMistakes: [
        "<b>Thinking Prisma is always better than TypeORM.</b> Different projects have different requirements.",
        "<b>Choosing a tool without considering an existing database.</b> Legacy schemas can significantly affect the migration and integration strategy.",
        "<b>Putting Prisma queries directly into every controller.</b> This can tightly couple HTTP code to database implementation details.",
        "<b>Creating unnecessary abstractions.</b> An abstraction should solve a real architectural or testing problem rather than simply hide every Prisma method.",
      ],
      quiz: [
        {
          question: "What is a common TypeORM approach?",
          options: [
            "Entity classes with decorators",
            "Only raw SQL",
            "React components",
            "GraphQL schemas only",
          ],
          correctIndex: 0,
          explanation:
            "TypeORM commonly uses entity classes decorated with ORM metadata.",
        },
        {
          question: "What is Prisma Client generated from?",
          options: [
            "The Prisma schema",
            "A React component",
            "A NestJS controller",
            "An HTML file",
          ],
          correctIndex: 0,
          explanation:
            "Prisma generates Prisma Client based on the Prisma schema.",
        },
        {
          question: "What should influence the choice between Prisma and TypeORM?",
          options: [
            "Only which logo looks better",
            "Database requirements, team needs, architecture, and project constraints",
            "Only the number of TypeScript files",
            "Only frontend framework choice",
          ],
          correctIndex: 1,
          explanation:
            "Database requirements, existing architecture, team familiarity, migrations, query needs, and operational constraints should all be considered.",
        },
      ],
    },
    {
      id: "prisma-advanced-production-patterns",
      title: "Advanced Prisma production patterns",
      durationMinutes: 25,
      explanation: `Once you know the basic Prisma API, the next step is learning how Prisma behaves inside a real production application.

A production database is not just a place where you call create() and findMany().

Real systems have:

- thousands or millions of records
- concurrent requests
- connection limits
- background jobs
- transactions
- retries
- failures
- indexes
- reporting queries
- pagination
- external APIs
- multiple application instances

Prisma needs to be designed around these realities.

<b>Beginner real-world example:</b>

A small application might have one NestJS server and one PostgreSQL database.

A shared PrismaService can provide Prisma Client to application services.

<b>Intermediate real-world example:</b>

Your application grows to several API instances.

Suppose you have:

5 NestJS instances
+
PostgreSQL
+
Prisma Client

If every application instance creates too many database connections, PostgreSQL can hit its connection limit.

Connection management therefore becomes an operational concern.

<b>Advanced real-world example:</b>

Imagine your application runs in a container platform and scales from 3 instances to 50 instances during a traffic spike.

If every instance opens many database connections, the database may become overloaded even though each individual application instance appears healthy.

This is why production database architecture requires thinking about:

connection pooling
database limits
application concurrency
query performance
timeouts
retry behavior
transaction length

<b>Pagination:</b>

Offset pagination is simple:

skip: 1000
take: 20

But as the offset becomes very large, the database may need to process many earlier rows before returning the desired page.

Cursor pagination can be more efficient for large, ordered datasets.

For example, an activity feed can use the last item's ID as a cursor.

<b>N+1 queries:</b>

Suppose you load 100 orders and then run another query for each order's customer.

You might accidentally create:

1 query for orders
+
100 queries for customers
=
101 queries

This is the classic N+1 problem.

Prisma's relation loading capabilities can help, but you still need to inspect the resulting query behavior and response size.

<b>Raw SQL:</b>

Prisma provides a typed query API for many common operations.

Sometimes a database-specific feature or highly specialized query may require raw SQL.

Raw SQL should be used carefully and parameterized.

Never build SQL by concatenating untrusted user input.

<b>Production mindset:</b>

When a Prisma query is slow, do not immediately assume Prisma is the problem.

Investigate:

- generated SQL
- database indexes
- query plan
- number of rows
- joins
- sorting
- filtering
- connection pool pressure
- transaction duration

The database is still doing the real work.`,
      diagram: `Production NestJS

Instance 1 ----\
Instance 2 -----\
Instance 3 ------> Prisma Client ---> Connection Pool ---> PostgreSQL
Instance 4 -----/
Instance 5 ----/

PostgreSQL
   |
   +--> Tables
   +--> Indexes
   +--> Query planner
   +--> Locks
   +--> Transactions

Application concerns
   |
   +--> Pagination
   +--> N+1 prevention
   +--> Query selection
   +--> Transactions
   +--> Connection limits`,
      codeExample: {
        title: "Cursor pagination with Prisma",
        code: `async getProducts(cursor?: string) {
  const pageSize = 20;

  const products = await this.prisma.product.findMany({
    take: pageSize + 1,

    ...(cursor
      ? {
          skip: 1,
          cursor: {
            id: cursor,
          },
        }
      : {}),

    orderBy: {
      id: "asc",
    },

    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const hasNextPage = products.length > pageSize;

  const items = hasNextPage
    ? products.slice(0, pageSize)
    : products;

  const nextCursor =
    hasNextPage
      ? items[items.length - 1].id
      : null;

  return {
    items,
    nextCursor,
  };
}

// Example response:
//
// {
//   items: [...],
//   nextCursor: "01HXYZ..."
// }
//
// The client can send nextCursor when requesting
// the next page.`,
      },
      keyTakeaways: [
        "Production Prisma applications need to consider database connections and concurrency.",
        "A shared PrismaService is commonly used in NestJS applications.",
        "Large datasets require careful pagination strategies.",
        "Cursor pagination can be useful for large ordered datasets.",
        "N+1 queries can create a large number of unnecessary database queries.",
        "Raw SQL can be useful for specialized queries but must be parameterized.",
        "Slow Prisma queries should be investigated at the database level as well as the application level.",
        "Transaction duration, connection limits, indexes, and query plans matter in production.",
      ],
      commonMistakes: [
        "<b>Creating unlimited database connections.</b> Application scaling can multiply database connection usage.",
        "<b>Using huge skip values without considering performance.</b> Cursor pagination may be more appropriate for large datasets.",
        "<b>Loading huge relation trees.</b> A single query can still return an enormous amount of data.",
        "<b>Ignoring N+1 queries.</b> An application can appear simple while secretly executing hundreds of database queries for one request.",
        "<b>Concatenating user input into raw SQL.</b> Always use parameterized queries.",
      ],
      quiz: [
        {
          question: "What is the N+1 problem?",
          options: [
            "One query plus many unnecessary queries for related data",
            "A Prisma migration error",
            "A TypeScript compiler feature",
            "A database backup method",
          ],
          correctIndex: 0,
          explanation:
            "N+1 happens when one initial query is followed by many additional queries, often one per returned record.",
        },
        {
          question: "Why can cursor pagination help with large datasets?",
          options: [
            "It can avoid processing increasingly large offsets",
            "It removes the database",
            "It disables indexes",
            "It automatically deletes old records",
          ],
          correctIndex: 0,
          explanation:
            "Cursor pagination can allow the database to continue from a known position instead of processing a large offset.",
        },
        {
          question: "What should you do with user input in raw SQL?",
          options: [
            "Concatenate it directly",
            "Ignore it",
            "Use parameterized queries",
            "Convert it to HTML",
          ],
          correctIndex: 2,
          explanation:
            "Parameterized queries prevent user input from becoming executable SQL.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is Prisma Client?",
      options: [
        "A generated TypeScript database client",
        "A PostgreSQL server",
        "A NestJS controller",
        "A frontend router",
      ],
      correctIndex: 0,
      explanation:
        "Prisma Client is generated from the Prisma schema and provides typed database operations.",
    },
    {
      question: "Where are Prisma models normally defined?",
      options: [
        "prisma/schema.prisma",
        "src/main.ts",
        "package.json",
        "index.html",
      ],
      correctIndex: 0,
      explanation:
        "Prisma models are normally defined in prisma/schema.prisma.",
    },
    {
      question: "What does @id normally represent?",
      options: [
        "A primary key",
        "A foreign API",
        "A migration",
        "A transaction",
      ],
      correctIndex: 0,
      explanation:
        "@id identifies a model's primary identifier.",
    },
    {
      question: "What does @unique do?",
      options: [
        "Requires values to be unique",
        "Creates a relation",
        "Starts a transaction",
        "Deletes duplicates automatically",
      ],
      correctIndex: 0,
      explanation:
        "@unique creates a uniqueness constraint for the field.",
    },
    {
      question: "Which method is appropriate for a unique record lookup?",
      options: [
        "findUnique",
        "findMany",
        "aggregate",
        "groupBy",
      ],
      correctIndex: 0,
      explanation:
        "findUnique is intended for unique fields or unique combinations.",
    },
    {
      question: "What does include do in Prisma?",
      options: [
        "Loads related records",
        "Creates a migration",
        "Deletes a model",
        "Generates a NestJS module",
      ],
      correctIndex: 0,
      explanation:
        "include can load relations as part of a Prisma query.",
    },
    {
      question: "Why are migrations important?",
      options: [
        "They record controlled database schema changes",
        "They replace database backups",
        "They replace Prisma Client",
        "They render API responses",
      ],
      correctIndex: 0,
      explanation:
        "Migrations provide a repeatable history of database schema changes.",
    },
    {
      question: "What does a transaction provide?",
      options: [
        "A way to group related database operations into one logical unit",
        "A frontend component",
        "A database replacement",
        "An HTTP authentication token",
      ],
      correctIndex: 0,
      explanation:
        "Transactions allow related database operations to commit or roll back together.",
    },
    {
      question: "What is an important production concern when scaling Prisma applications?",
      options: [
        "Database connection usage",
        "HTML indentation",
        "CSS animations",
        "Browser cookies only",
      ],
      correctIndex: 0,
      explanation:
        "Scaling application instances can significantly increase database connection usage.",
    },
    {
      question: "What is the N+1 problem?",
      options: [
        "One query followed by many unnecessary related queries",
        "A migration naming convention",
        "A Prisma schema syntax",
        "A TypeScript error",
      ],
      correctIndex: 0,
      explanation:
        "N+1 occurs when an initial query is followed by many additional queries, commonly one for each returned record.",
    },
    {
      question: "What is a key difference between Prisma and TypeORM?",
      options: [
        "Prisma commonly uses a schema-first generated client, while TypeORM commonly uses entity classes and decorators",
        "Prisma is a database while TypeORM is PostgreSQL",
        "TypeORM cannot use TypeScript",
        "Prisma cannot use relations",
      ],
      correctIndex: 0,
      explanation:
        "Prisma and TypeORM provide different developer models for database access. Prisma commonly uses schema-driven generated client code, while TypeORM commonly uses entity classes and decorators.",
    },
    {
      question: "Should raw SQL concatenate untrusted user input directly?",
      options: [
        "Yes",
        "Only in production",
        "No, parameterized queries should be used",
        "Only when using PostgreSQL",
      ],
      correctIndex: 2,
      explanation:
        "Raw SQL should use parameterized queries so untrusted input cannot become executable SQL.",
    },
  ],
  project: {
    name: "Production-ready NestJS API with Prisma",
    goal: "Build a complete NestJS API using Prisma and PostgreSQL, starting with a clean schema and progressing to relationships, migrations, transactions, pagination, and production-oriented database access.",
    brief: "Build an e-commerce API containing users, products, orders, and order items. Use Prisma as the database access layer, create migrations as the schema evolves, load relations intentionally, perform checkout inside a transaction, and implement cursor-based product pagination.",
    steps: [
      "Create a PostgreSQL database for the project.",
      "Install Prisma and initialize the Prisma configuration.",
      "Create a Prisma schema containing User, Product, Order, and OrderItem models.",
      "Add primary keys and unique constraints.",
      "Add one-to-many and many-to-one relationships between the models.",
      "Add appropriate indexes for common lookup and filtering fields.",
      "Create the initial Prisma migration.",
      "Create a NestJS PrismaService that manages the Prisma Client lifecycle.",
      "Create a UsersService that performs typed Prisma CRUD operations.",
      "Create a ProductsService that supports filtering, sorting, and pagination.",
      "Create an OrdersService that loads an order together with its customer and order items.",
      "Use nested select statements so API responses do not expose unnecessary database fields.",
      "Implement checkout using a Prisma transaction.",
      "Verify that insufficient stock causes the transaction to fail without creating a partially completed order.",
      "Add cursor-based pagination to the products endpoint.",
      "Test the API with realistic data.",
      "Inspect queries and identify any possible N+1 behavior.",
      "Add indexes based on actual query patterns.",
      "Create a second migration that adds a new business requirement.",
      "Test the migration against a clean database.",
      "Test the migration against an existing database containing sample data.",
      "Review the application and identify which parts belong to controllers, services, and database access.",
    ],
    acceptance: [
      "The application uses Prisma Client instead of manually writing SQL for normal CRUD operations.",
      "The Prisma schema contains User, Product, Order, and OrderItem models.",
      "Primary keys and appropriate unique constraints are defined.",
      "Relations between users, orders, order items, and products work correctly.",
      "The application has a reusable PrismaService.",
      "Prisma migrations are committed and can recreate the database schema.",
      "The API can create, read, update, and delete appropriate records.",
      "The API uses select or carefully designed include operations instead of blindly returning every related field.",
      "Checkout uses a database transaction.",
      "A failed checkout does not leave a partially created database state.",
      "Products support pagination.",
      "The project demonstrates cursor pagination.",
      "The project contains indexes appropriate for important query patterns.",
      "No raw SQL concatenates untrusted user input.",
      "Database access is not unnecessarily scattered across controllers.",
      "The project demonstrates a clear understanding of the difference between Prisma and the underlying PostgreSQL database.",
    ],
    stretch: [
      "Add authentication and associate orders with the authenticated user.",
      "Add ProductCategory and implement a many-to-many product/category relationship.",
      "Add an Inventory model instead of storing stock directly on Product.",
      "Implement optimistic concurrency protection for inventory updates.",
      "Add an order status history model so every status change is recorded.",
      "Add a soft-delete strategy for products.",
      "Add a search endpoint that supports multiple filters and sorting options.",
      "Implement cursor pagination using a stable compound cursor such as createdAt plus id.",
      "Add an admin reporting endpoint using Prisma aggregation.",
      "Investigate a deliberately introduced N+1 query and rewrite it to reduce unnecessary database calls.",
      "Add a raw SQL query for a database-specific reporting requirement using parameterized values.",
      "Run EXPLAIN ANALYZE on an important query and document the index decisions.",
      "Design an expand-and-contract migration for adding a required field to a table containing existing production-style data.",
      "Add an outbox table and design an event publishing workflow for completed orders.",
      "Document the project's Prisma architecture and explain why database-specific code is separated from HTTP controllers.",
    ],
  },
};
