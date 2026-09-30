import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_26_LESSONS: LessonDay = {
  day: 26,
  title: "PostgreSQL Fundamentals",
  totalMinutes: 110,
  difficulty: "Beginner",
  lessons: [
    {
      id: "postgresql-tables",
      title: "Tables: storing real application data",
      durationMinutes: 18,
      explanation: `A PostgreSQL <b>table</b> is where your application stores a particular type of information. You can think of a table as a structured collection of records.

If you are building an online shopping application, you might have a \`users\` table for customers, a \`products\` table for products, and an \`orders\` table for purchases.

A table has <b>columns</b> and <b>rows</b>. A column describes what kind of information is stored, while a row represents one actual record.

For example, a \`users\` table might contain \`id\`, \`name\`, \`email\`, and \`created_at\`. One row could represent Alice, another row could represent Bob, and another row could represent Sarah.

PostgreSQL is strongly typed. This means a column has a data type, such as \`integer\`, \`text\`, \`boolean\`, \`timestamp\`, \`numeric\`, or \`uuid\`. Choosing the correct type matters because it affects validation, storage, comparisons, sorting, and application behavior.

<b>Beginner real-world example:</b>

Imagine a small restaurant application. You could create a \`customers\` table:

\`\`\`
customers
--------------------------------
id | name       | phone
1  | Alice      | 555-1000
2  | Bob        | 555-2000
3  | Sarah      | 555-3000
\`\`\`

Each row is one customer.

<b>Intermediate real-world example:</b>

An e-commerce application might separate products from users instead of putting everything into one huge table:

\`\`\`
users
products
orders
\`\`\`

This separation makes the database easier to understand and prevents unrelated information from being mixed together.

<b>Advanced real-world example:</b>

A production system may use UUIDs, timestamps, carefully chosen numeric types, default values, constraints, and indexes:

\`\`\`sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
\`\`\`

This table already contains several important database design decisions. The database itself is helping protect the application's data rather than depending entirely on NestJS validation.

A useful mindset is: <b>your application code should validate data, but your database should also protect the data.</b>

If a bug in your API accidentally tries to insert a negative stock quantity or a missing product name, database constraints can act as the final safety layer.`,
      diagram: `PostgreSQL Database
        |
        +--- users
        |      |
        |      +--- id
        |      +--- name
        |      +--- email
        |
        +--- products
        |      |
        |      +--- id
        |      +--- name
        |      +--- price
        |
        +--- orders
               |
               +--- id
               +--- user_id
               +--- total

Table = collection of related records
Column = property of a record
Row = one actual record`,
      codeExample: {
        title: "Basic to advanced product table",
        code: `-- Basic table

CREATE TABLE products (
  id INTEGER,
  name TEXT,
  price NUMERIC
);

-- A more realistic version

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert records

INSERT INTO products (name, description, price, stock_quantity)
VALUES
  ('Mechanical Keyboard', 'RGB mechanical keyboard', 129.99, 25),
  ('Wireless Mouse', 'Ergonomic wireless mouse', 49.99, 80);

-- Read records

SELECT *
FROM products;

-- Find products that are currently available

SELECT id, name, price
FROM products
WHERE active = true
  AND stock_quantity > 0
ORDER BY price ASC;`,
      },
      keyTakeaways: [
        "A PostgreSQL table stores records of a particular type.",
        "Columns describe the structure of each record.",
        "Rows represent individual records.",
        "Every column should have an appropriate data type.",
        "A well-designed table stores related information without mixing unrelated concepts together.",
        "Database structure is part of application architecture, not just storage.",
        "Production tables commonly use defaults, constraints, timestamps, and carefully selected data types.",
      ],
      commonMistakes: [
        "<b>Putting everything into one table.</b> A shopping application should not store users, products, payments, and notifications as unrelated columns in one giant table.",
        "<b>Using TEXT for every column.</b> Use appropriate types such as INTEGER, BOOLEAN, NUMERIC, UUID, DATE, and TIMESTAMPTZ when appropriate.",
        "<b>Storing money as floating-point values.</b> NUMERIC is commonly used when exact decimal representation is required.",
        "<b>Allowing important columns to be NULL without thinking about it.</b> Decide whether missing data is actually meaningful.",
        "<b>Relying only on TypeScript types.</b> TypeScript disappears at runtime and cannot protect the database from every source of invalid data.",
      ],
      quiz: [
        {
          question: "What does a row usually represent in a database table?",
          options: [
            "A database connection",
            "One record",
            "A database",
            "An index",
          ],
          correctIndex: 1,
          explanation: "A row represents one record stored in the table.",
        },
        {
          question: "What does a column describe?",
          options: [
            "The entire database",
            "A property or field of a record",
            "A network connection",
            "A PostgreSQL server",
          ],
          correctIndex: 1,
          explanation: "Columns define the fields that each record can contain.",
        },
      ],
    },
    {
      id: "postgresql-primary-keys",
      title: "Primary keys: giving every record a reliable identity",
      durationMinutes: 16,
      explanation: `A <b>primary key</b> uniquely identifies each row in a table.

Imagine an e-commerce system with 500,000 users. You need a reliable way to say exactly which user you mean. Names are not enough because two people can have the same name. Even email addresses may change.

An identifier such as \`id\` gives every record a stable identity.

For example:

\`\`\`
id | name
---+-------
1  | Alice
2  | Bob
3  | Alice
\`\`\`

There are two people named Alice, but their IDs are different.

A primary key has two important properties: it must be <b>unique</b>, and it cannot be <b>NULL</b>.

For beginner projects, an integer identity column is easy to understand:

\`\`\`sql
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
\`\`\`

For distributed systems or public APIs, UUIDs are also common:

\`\`\`sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
\`\`\`

<b>Beginner real-world example:</b>

A school system could use a student ID:

\`\`\`
students
--------------------------------
id | name
1  | John
2  | Mary
3  | David
\`\`\`

<b>Intermediate real-world example:</b>

An e-commerce order might have:

\`\`\`
id | customer_id | total
101 | 15         | 89.99
102 | 15         | 129.00
103 | 21         | 49.99
\`\`\`

The order ID identifies the order, while \`customer_id\` identifies the customer who owns it.

<b>Advanced real-world example:</b>

A large application may expose UUIDs publicly:

\`\`\`
8e7b8d4a-...
a9c123de-...
\`\`\`

This can make identifiers less predictable than simple sequential IDs and can make ID generation easier across multiple services.

However, UUIDs are not automatically "better" in every situation. They have storage, indexing, generation, and operational trade-offs. The correct choice depends on the system.

The important principle is that every important entity needs a stable identity.`,
      diagram: `users

+----+---------+------------------+
| id | name    | email            |
+----+---------+------------------+
| 1  | Alice   | alice@example... |
| 2  | Bob     | bob@example...   |
+----+---------+------------------+
   ^
   |
   Primary Key
   uniquely identifies a row`,
      codeExample: {
        title: "Identity columns and UUID primary keys",
        code: `-- Integer identity primary key

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);

-- UUID primary key

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL
);

-- Insert without manually providing the ID

INSERT INTO users (name, email)
VALUES ('Alice', 'alice@example.com');

INSERT INTO users (name, email)
VALUES ('Bob', 'bob@example.com');

-- PostgreSQL generates the IDs.

SELECT *
FROM users;`,
      },
      keyTakeaways: [
        "A primary key uniquely identifies a row.",
        "A primary key cannot contain NULL.",
        "A table normally has one primary key constraint.",
        "Identity columns are convenient for generated numeric IDs.",
        "UUIDs are another common identifier strategy.",
        "Primary keys are used by other tables when creating relationships.",
        "Choose identifiers based on the requirements of the application rather than following a universal rule.",
      ],
      commonMistakes: [
        "<b>Using a person's name as the primary key.</b> Names are not guaranteed to be unique.",
        "<b>Using email as the primary key without considering future changes.</b> Email addresses can change.",
        "<b>Manually generating numeric IDs in application code.</b> Let PostgreSQL safely generate them when using an identity strategy.",
        "<b>Assuming UUID is always superior.</b> UUIDs have trade-offs and should be selected intentionally.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a primary key?",
          options: [
            "To store passwords",
            "To uniquely identify a row",
            "To create an API route",
            "To encrypt data",
          ],
          correctIndex: 1,
          explanation: "A primary key gives every row a unique identity.",
        },
        {
          question: "Can a primary key contain NULL?",
          options: [
            "Yes",
            "Only for UUIDs",
            "No",
            "Only in development",
          ],
          correctIndex: 2,
          explanation: "Primary key values must identify a real row and therefore cannot be NULL.",
        },
      ],
    },
    {
      id: "postgresql-relationships",
      title: "Relationships: connecting tables instead of duplicating data",
      durationMinutes: 18,
      explanation: `Real applications rarely have only one table. Users have orders. Orders contain products. Products belong to categories. Payments belong to orders. Notifications may belong to users.

These connections are called <b>relationships</b>.

The three relationship patterns you will encounter most often are:

<b>One-to-one:</b> one record is associated with one record.

Example:

\`\`\`
users -> user_profiles
\`\`\`

One user may have one profile.

<b>One-to-many:</b> one record is associated with many records.

Example:

\`\`\`
users -> orders
\`\`\`

One customer can create many orders, but each order belongs to one customer.

<b>Many-to-many:</b> many records can be associated with many records.

Example:

\`\`\`
orders <-> products
\`\`\`

One order can contain many products, and one product can appear in many different orders.

Many-to-many relationships normally require a <b>junction table</b>, such as \`order_items\`.

<b>Beginner real-world example:</b>

A user can create multiple orders:

\`\`\`
Alice
 |
 +-- Order #101
 +-- Order #102
 +-- Order #103
\`\`\`

<b>Intermediate real-world example:</b>

An order can contain multiple products:

\`\`\`
Order #101
 |
 +-- Keyboard
 +-- Mouse
 +-- Monitor
\`\`\`

The database should not store something like:

\`\`\`
product1 = keyboard
product2 = mouse
product3 = monitor
\`\`\`

inside the orders table. Instead, use an \`order_items\` table.

<b>Advanced real-world example:</b>

The junction table usually contains more than just two IDs. It can contain quantity, price at the time of purchase, discount, and other order-specific information.

This is important because the current product price can change after an order has been completed.

For example:

\`\`\`
products
id | name      | price
10 | Keyboard  | 149.99

order_items
order_id | product_id | quantity | unit_price
5001     | 10         | 2        | 129.99
\`\`\`

The product currently costs 149.99, but the customer purchased it for 129.99.

That historical price belongs to the order item, not simply to the product table.

This is a very common real-world database design decision.`,
      diagram: `users
  |
  | one-to-many
  v
orders
  |
  | one-to-many
  v
order_items
  |
  | many-to-one
  v
products

One user
  |
  +---- many orders

One order
  |
  +---- many order_items

One product
  |
  +---- many order_items`,
      codeExample: {
        title: "One-to-many and many-to-many relationships",
        code: `CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL
);

CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  FOREIGN KEY (user_id)
    REFERENCES users(id)
);

-- Junction table for the many-to-many
-- relationship between orders and products.

CREATE TABLE order_items (
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,

  PRIMARY KEY (order_id, product_id),

  FOREIGN KEY (order_id)
    REFERENCES orders(id),

  FOREIGN KEY (product_id)
    REFERENCES products(id)
);

-- Example:

-- User 1 has order 100.
-- Order 100 contains product 10 twice.
-- The product cost $129.99 when purchased.

INSERT INTO order_items (
  order_id,
  product_id,
  quantity,
  unit_price
)
VALUES (100, 10, 2, 129.99);`,
      },
      keyTakeaways: [
        "Relationships connect data stored in different tables.",
        "One-to-many relationships are extremely common in business applications.",
        "Many-to-many relationships normally use a junction table.",
        "Junction tables can store additional business information.",
        "Order history often needs values such as unit_price because current product data can change.",
        "Good relationships reduce unnecessary duplication.",
      ],
      commonMistakes: [
        "<b>Putting multiple IDs in one text column.</b> Avoid values such as `product_ids = '10,20,30'`.",
        "<b>Duplicating customer information in every order.</b> Store the relationship using `user_id` and join the tables when needed.",
        "<b>Forgetting that order data is historical.</b> Current product price may not equal the price paid by the customer.",
        "<b>Trying to represent many-to-many relationships with only one foreign key.</b> Use a junction table.",
      ],
      quiz: [
        {
          question: "What type of relationship is users to orders in a typical e-commerce application?",
          options: [
            "One-to-many",
            "Many-to-zero",
            "One-to-one only",
            "No relationship",
          ],
          correctIndex: 0,
          explanation: "One user can have many orders, while each order normally belongs to one user.",
        },
        {
          question: "What is commonly used to represent many-to-many relationships?",
          options: [
            "A password",
            "A junction table",
            "A database name",
            "A JSON comment",
          ],
          correctIndex: 1,
          explanation: "A junction table connects records from both sides of a many-to-many relationship.",
        },
      ],
    },
    {
      id: "postgresql-foreign-keys",
      title: "Foreign keys: protecting relationships",
      durationMinutes: 16,
      explanation: `A <b>foreign key</b> is a database constraint that says a value in one table must refer to a valid record in another table.

Suppose your \`orders\` table contains:

\`\`\`
user_id = 25
\`\`\`

If \`user_id\` is a foreign key referencing \`users.id\`, PostgreSQL checks that user 25 actually exists.

This prevents a broken relationship such as an order belonging to a user that does not exist.

<b>Beginner real-world example:</b>

A library has:

\`\`\`
authors
books
\`\`\`

Each book has an \`author_id\`.

The database can ensure that a book cannot reference an author who does not exist.

<b>Intermediate real-world example:</b>

In an e-commerce system:

\`\`\`
orders.user_id -> users.id
order_items.order_id -> orders.id
order_items.product_id -> products.id
\`\`\`

These relationships form a chain that the database can protect.

<b>Advanced real-world example:</b>

Foreign keys can define what should happen when the referenced record is updated or deleted.

For example:

\`\`\`
ON DELETE CASCADE
\`\`\`

means dependent rows can be automatically deleted.

But this should be used carefully.

Deleting a user and automatically deleting thousands of orders may be completely inappropriate for a financial or audit-heavy system.

Another option is:

\`\`\`
ON DELETE RESTRICT
\`\`\`

which prevents deletion while dependent records exist.

Or:

\`\`\`
ON DELETE SET NULL
\`\`\`

which removes the relationship by setting the foreign key to NULL, assuming the column allows NULL.

The correct behavior depends on the business meaning of the relationship.

A payment record, for example, often should not disappear simply because a user account is deactivated.`,
      diagram: `users
+----+---------+
| id | name    |
+----+---------+
| 1  | Alice   |
| 2  | Bob     |
+----+---------+
      ^
      |
      | Foreign Key
      |
orders
+-----+----------+
| id  | user_id  |
+-----+----------+
| 100 | 1        |
| 101 | 2        |
+-----+----------+

orders.user_id
must reference
users.id`,
      codeExample: {
        title: "Foreign keys and delete behavior",
        code: `CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  user_id BIGINT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

-- This works if user 1 exists.

INSERT INTO orders (user_id)
VALUES (1);

-- This fails if user 999 does not exist.

INSERT INTO orders (user_id)
VALUES (999);

-- Example of SET NULL:
--
-- This is appropriate only when an order
-- is allowed to exist without the relationship.

CREATE TABLE support_tickets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  assigned_user_id BIGINT,

  CONSTRAINT fk_ticket_user
    FOREIGN KEY (assigned_user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);`,
      },
      keyTakeaways: [
        "Foreign keys enforce relationships between tables.",
        "A foreign key normally references a primary key or another suitable unique key.",
        "Foreign keys prevent orphaned records.",
        "ON DELETE behavior should be selected based on business meaning.",
        "CASCADE can be useful for dependent data but can also delete large amounts of data.",
        "RESTRICT is useful when related records must not be deleted accidentally.",
        "SET NULL can preserve the child record while removing its relationship.",
      ],
      commonMistakes: [
        "<b>Thinking TypeScript types create database relationships.</b> Only the database constraint actually protects the database.",
        "<b>Using CASCADE everywhere.</b> Cascading deletes can remove important historical information.",
        "<b>Allowing NULL accidentally.</b> If every order must belong to a user, `user_id` should normally be NOT NULL.",
        "<b>Deleting parent records without understanding dependencies.</b> Foreign keys intentionally make dangerous deletes fail.",
      ],
      quiz: [
        {
          question: "What does a foreign key primarily protect?",
          options: [
            "The frontend design",
            "Relationships between records",
            "The API documentation",
            "Password hashing",
          ],
          correctIndex: 1,
          explanation: "Foreign keys ensure that relationships point to valid referenced records.",
        },
        {
          question: "What can ON DELETE CASCADE do?",
          options: [
            "Automatically remove dependent records",
            "Encrypt the database",
            "Create an API endpoint",
            "Prevent every delete",
          ],
          correctIndex: 0,
          explanation: "CASCADE can automatically delete dependent records when the referenced record is deleted.",
        },
      ],
    },
    {
      id: "postgresql-constraints",
      title: "Constraints: making invalid data difficult to store",
      durationMinutes: 16,
      explanation: `Constraints are rules enforced by PostgreSQL.

They are one of the most important concepts in production database design because they prevent invalid data even when the application contains a bug.

Common constraints include:

<b>NOT NULL</b> means a value is required.

<b>UNIQUE</b> means values cannot be duplicated.

<b>PRIMARY KEY</b> identifies each row uniquely.

<b>FOREIGN KEY</b> protects relationships.

<b>CHECK</b> enforces a condition.

<b>DEFAULT</b> provides a value when one is not supplied.

Consider an online store.

The application may check that a product price is positive. But imagine another script, background worker, admin tool, or future service inserts a product.

If the database has:

\`\`\`sql
CHECK (price >= 0)
\`\`\`

then PostgreSQL itself refuses the invalid value.

<b>Beginner real-world example:</b>

A customer's email is required:

\`\`\`sql
email TEXT NOT NULL
\`\`\`

<b>Intermediate real-world example:</b>

An email should be unique:

\`\`\`sql
email TEXT NOT NULL UNIQUE
\`\`\`

<b>Advanced real-world example:</b>

A payment table might require:

\`\`\`
amount > 0
status belongs to an allowed set
currency is required
order_id must exist
created_at has a default
\`\`\`

The database can enforce many of these rules.

This creates multiple layers of protection:

\`\`\`
Client validation
       |
       v
NestJS DTO validation
       |
       v
Service/business rules
       |
       v
PostgreSQL constraints
\`\`\`

Each layer has a different purpose.

DTO validation improves API feedback. Business logic handles application rules. Database constraints protect the stored data itself.`,
      diagram: `Incoming Data
     |
     v
NestJS DTO validation
     |
     v
Service/business logic
     |
     v
PostgreSQL
     |
     +--> NOT NULL
     +--> UNIQUE
     +--> CHECK
     +--> FOREIGN KEY
     +--> PRIMARY KEY
     |
     v
Valid stored data`,
      codeExample: {
        title: "A production-style table with constraints",
        code: `CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY,

  name TEXT NOT NULL,

  sku TEXT NOT NULL,

  price NUMERIC(12, 2) NOT NULL,

  stock_quantity INTEGER NOT NULL DEFAULT 0,

  active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_products
    PRIMARY KEY (id),

  CONSTRAINT uq_products_sku
    UNIQUE (sku),

  CONSTRAINT chk_products_price
    CHECK (price >= 0),

  CONSTRAINT chk_products_stock
    CHECK (stock_quantity >= 0)
);

-- This works.

INSERT INTO products (
  name,
  sku,
  price,
  stock_quantity
)
VALUES (
  'Keyboard',
  'KB-001',
  129.99,
  20
);

-- This fails because price is negative.

INSERT INTO products (
  name,
  sku,
  price,
  stock_quantity
)
VALUES (
  'Broken Product',
  'BAD-001',
  -50,
  10
);

-- This fails because SKU must be unique.

INSERT INTO products (
  name,
  sku,
  price,
  stock_quantity
)
VALUES (
  'Another Keyboard',
  'KB-001',
  100,
  5
);`,
      },
      keyTakeaways: [
        "Constraints allow PostgreSQL to enforce data integrity.",
        "NOT NULL makes a value required.",
        "UNIQUE prevents duplicate values.",
        "CHECK enforces business-related data conditions.",
        "DEFAULT supplies a value when one is omitted.",
        "Constraints protect the database even when data comes from unexpected code paths.",
        "Application validation and database constraints complement each other rather than replacing one another.",
      ],
      commonMistakes: [
        "<b>Relying only on frontend validation.</b> Users and services can bypass the frontend.",
        "<b>Relying only on DTO validation.</b> Other code paths may write directly to the database.",
        "<b>Using CHECK constraints without understanding NULL behavior.</b> A CHECK expression that evaluates to NULL does not fail in the same way as FALSE.",
        "<b>Creating UNIQUE constraints without considering case sensitivity or normalization requirements.</b> Business rules sometimes need additional design.",
      ],
      quiz: [
        {
          question: "Which constraint prevents a column from being NULL?",
          options: [
            "CHECK",
            "NOT NULL",
            "DEFAULT",
            "FOREIGN KEY",
          ],
          correctIndex: 1,
          explanation: "NOT NULL requires a value to be present.",
        },
        {
          question: "Which constraint can enforce `price >= 0`?",
          options: [
            "CHECK",
            "PRIMARY KEY",
            "FOREIGN KEY",
            "DEFAULT",
          ],
          correctIndex: 0,
          explanation: "CHECK can enforce a condition such as price being non-negative.",
        },
      ],
    },
    {
      id: "postgresql-indexes",
      title: "Indexes: making searches faster without guessing",
      durationMinutes: 18,
      explanation: `An <b>index</b> is a database structure that helps PostgreSQL find rows more efficiently.

Imagine a library with one million books.

Without an index, finding every book by a particular ISBN could require checking a huge number of records.

An index creates an additional structure that helps PostgreSQL locate matching rows.

A common example is a user lookup by email:

\`\`\`sql
SELECT *
FROM users
WHERE email = 'alice@example.com';
\`\`\`

If the application performs this query constantly, an index on \`email\` can make the lookup much more efficient.

But indexes are not free.

An index takes storage space and must be maintained when rows are inserted, updated, or deleted.

This means <b>adding an index to every column is not good database design</b>.

<b>Beginner real-world example:</b>

A user logs in using email.

You frequently execute:

\`\`\`
WHERE email = ?
\`\`\`

An index on email makes sense.

<b>Intermediate real-world example:</b>

An admin dashboard displays recent orders:

\`\`\`sql
SELECT *
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC;
\`\`\`

An index involving \`user_id\` and \`created_at\` may be useful depending on the query workload.

<b>Advanced real-world example:</b>

Suppose a production system has 50 million orders.

You discover that this query is executed constantly:

\`\`\`sql
SELECT id, created_at, total
FROM orders
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

A composite index can be designed around the actual access pattern:

\`\`\`sql
CREATE INDEX idx_orders_user_created
ON orders (user_id, created_at DESC);
\`\`\`

Now PostgreSQL can potentially use the index to locate a user's orders and obtain them in the required order.

The key advanced lesson is:

<b>Indexes should be designed from real query patterns, not from column popularity.</b>

You should inspect query plans using \`EXPLAIN\` and \`EXPLAIN ANALYZE\` when investigating performance.

An index is not automatically used just because it exists. PostgreSQL's planner decides whether using it is cheaper than another execution strategy.`,
      diagram: `Query

SELECT *
FROM users
WHERE email = 'alice@example.com';

Without useful index:

users
 |
 +--> scan many rows
 |
 +--> find Alice

With index:

email index
 |
 +--> locate Alice
 |
 +--> fetch matching row

Faster lookup
but
extra storage + write maintenance`,
      codeExample: {
        title: "Basic to advanced index examples",
        code: `CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL
);

-- Useful when email must be unique.

CREATE UNIQUE INDEX idx_users_email
ON users (email);

-- Query that can benefit from the index

SELECT id, name
FROM users
WHERE email = 'alice@example.com';

-- Example order table

CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  total NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Query pattern:

SELECT id, total, created_at
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;

-- Composite index based on that query pattern.

CREATE INDEX idx_orders_user_created
ON orders (user_id, created_at DESC);

-- Inspect a query plan.

EXPLAIN
SELECT id, total, created_at
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;

-- For deeper investigation, use EXPLAIN ANALYZE
-- carefully because it actually executes the query.

EXPLAIN ANALYZE
SELECT id, total, created_at
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;`,
      },
      keyTakeaways: [
        "Indexes can make reads significantly faster.",
        "Indexes consume storage and add write overhead.",
        "Do not blindly index every column.",
        "Primary keys normally have an associated index.",
        "UNIQUE constraints are commonly backed by unique indexes.",
        "Composite indexes should reflect real query patterns.",
        "EXPLAIN helps you understand how PostgreSQL plans to execute a query.",
        "EXPLAIN ANALYZE executes the query and reports actual execution information.",
      ],
      commonMistakes: [
        "<b>Creating indexes on every column.</b> More indexes mean more storage and more write maintenance.",
        "<b>Indexing without looking at queries.</b> An index should solve a real access pattern.",
        "<b>Assuming an index guarantees a fast query.</b> PostgreSQL's planner decides whether to use it.",
        "<b>Ignoring composite index column order.</b> `(user_id, created_at)` and `(created_at, user_id)` are not equivalent for every query.",
        "<b>Running EXPLAIN ANALYZE on dangerous write queries.</b> Remember that ANALYZE executes the statement.",
      ],
      quiz: [
        {
          question: "What is the primary purpose of an index?",
          options: [
            "To encrypt data",
            "To help queries find data efficiently",
            "To replace primary keys",
            "To create API routes",
          ],
          correctIndex: 1,
          explanation: "Indexes provide data structures that can make query operations more efficient.",
        },
        {
          question: "Why should you avoid indexing every column?",
          options: [
            "Indexes are illegal on multiple columns",
            "Indexes use storage and add maintenance overhead",
            "PostgreSQL only supports one index",
            "Indexes delete old data",
          ],
          correctIndex: 1,
          explanation: "Indexes improve some reads but require additional storage and maintenance during writes.",
        },
      ],
    },
    {
      id: "postgresql-transactions",
      title: "Transactions: keeping multi-step operations safe",
      durationMinutes: 22,
      explanation: `A <b>transaction</b> allows multiple database operations to behave like one logical unit of work.

This becomes extremely important when one real-world action requires multiple database changes.

Imagine placing an order.

A simplified process could be:

\`\`\`
1. Create order
2. Add order items
3. Reduce product stock
4. Create payment record
\`\`\`

What happens if step 1 succeeds, step 2 succeeds, but step 3 fails?

Without a transaction, the database may contain a half-created order.

That is dangerous.

A transaction lets the application say:

<b>"Either all required database changes succeed, or none of them should be committed."</b>

The common SQL flow is:

\`\`\`
BEGIN;

... operations ...

COMMIT;
\`\`\`

If something fails:

\`\`\`
ROLLBACK;
\`\`\`

<b>Beginner real-world example:</b>

Imagine transferring $100 between two bank accounts.

You need to:

\`\`\`
subtract $100 from Alice
add $100 to Bob
\`\`\`

If only the subtraction succeeds, money has effectively disappeared.

Both operations belong in one transaction.

<b>Intermediate real-world example:</b>

An e-commerce order might need:

\`\`\`
create order
create order items
decrease stock
record payment attempt
\`\`\`

If stock cannot be reduced, you may not want the order transaction to commit.

<b>Advanced real-world example:</b>

Suppose two customers try to purchase the last available item at almost the same time.

Both requests may read:

\`\`\`
stock = 1
\`\`\`

If both then decrement it without proper concurrency control, the system can oversell the product.

Transactions can be combined with appropriate locking or atomic update patterns.

For example:

\`\`\`sql
UPDATE products
SET stock_quantity = stock_quantity - 1
WHERE id = $1
  AND stock_quantity > 0;
\`\`\`

The application can inspect the affected row count. If zero rows were updated, the product was unavailable.

For more complicated workflows, PostgreSQL transaction isolation and row-level locks can become important.

PostgreSQL provides transaction isolation levels such as READ COMMITTED, REPEATABLE READ, and SERIALIZABLE. The correct level depends on the consistency requirements and workload.

In NestJS applications, transactions are usually managed through the database library or ORM you use. The important architectural idea remains the same: the transaction should cover the complete set of database operations that must succeed or fail together.

A transaction should not automatically include external network calls.

For example, doing this inside a database transaction can be problematic:

\`\`\`
BEGIN
create order
call Stripe
wait 5 seconds
update payment
COMMIT
\`\`\`

The database transaction may remain open while waiting for an external service.

A more advanced architecture often separates database transactions from external payment workflows and uses states, idempotency, events, and retry mechanisms.

That distinction becomes very important as an application grows.`,
      diagram: `Place Order

BEGIN
  |
  +--> Create order
  |
  +--> Create order items
  |
  +--> Reduce stock
  |
  +--> Create payment record
  |
  +--> Everything successful?
          |
       +--+--+
       |     |
      YES    NO
       |     |
     COMMIT ROLLBACK
       |     |
       v     v
   Changes  No partial
   persist  transaction`,
      codeExample: {
        title: "Transaction for an order workflow",
        code: `BEGIN;

-- Create the order

INSERT INTO orders (user_id, total)
VALUES (42, 159.98)
RETURNING id;

-- Suppose PostgreSQL returned:
-- id = 1001

-- Add the order item

INSERT INTO order_items (
  order_id,
  product_id,
  quantity,
  unit_price
)
VALUES (
  1001,
  10,
  2,
  79.99
);

-- Reduce stock safely

UPDATE products
SET stock_quantity = stock_quantity - 2
WHERE id = 10
  AND stock_quantity >= 2;

-- If all required operations succeeded:

COMMIT;

-- If an operation failed instead:

-- ROLLBACK;`,
      },
      keyTakeaways: [
        "Transactions group multiple database operations into one logical unit.",
        "COMMIT permanently applies the transaction's changes.",
        "ROLLBACK discards uncommitted changes.",
        "Transactions are essential when multiple writes must succeed or fail together.",
        "Concurrency can require locking or atomic update techniques in addition to basic transactions.",
        "Isolation levels control how concurrent transactions interact.",
        "Long-running external network calls should generally not be casually placed inside database transactions.",
        "Growing systems often combine transactions with idempotency, state machines, events, and retry strategies.",
      ],
      commonMistakes: [
        "<b>Updating multiple tables without a transaction.</b> A failure halfway through can leave inconsistent data.",
        "<b>Keeping transactions open for too long.</b> Long transactions can hold locks and increase contention.",
        "<b>Assuming transactions automatically solve every concurrency problem.</b> Correct isolation and locking strategies may still be necessary.",
        "<b>Calling external payment APIs inside long database transactions.</b> Network delays can keep database resources locked unnecessarily.",
        "<b>Forgetting rollback handling in application code.</b> A failed operation must correctly terminate the transaction.",
      ],
      quiz: [
        {
          question: "What does COMMIT do?",
          options: [
            "Deletes the database",
            "Permanently applies the transaction changes",
            "Creates an index",
            "Starts a new server",
          ],
          correctIndex: 1,
          explanation: "COMMIT makes the transaction's changes permanent.",
        },
        {
          question: "What is the purpose of ROLLBACK?",
          options: [
            "Undo uncommitted transaction changes",
            "Create a primary key",
            "Speed up SELECT queries",
            "Create a table",
          ],
          correctIndex: 0,
          explanation: "ROLLBACK discards changes made during the current uncommitted transaction.",
        },
        {
          question: "Why is a bank transfer a good transaction example?",
          options: [
            "It only requires one operation",
            "The debit and credit should succeed or fail together",
            "It never changes data",
            "It requires no database",
          ],
          correctIndex: 1,
          explanation: "A transfer should not leave one account debited while the other account is not credited.",
        },
      ],
    },
    {
      id: "postgresql-nestjs-integration",
      title: "Connecting PostgreSQL concepts to NestJS",
      durationMinutes: 18,
      explanation: `PostgreSQL does the data integrity work, while NestJS provides the application layer that talks to the database.

A useful way to think about the architecture is:

\`\`\`
HTTP Request
     |
     v
Controller
     |
     v
Service
     |
     v
Repository / ORM
     |
     v
PostgreSQL
\`\`\`

The controller handles the HTTP boundary.

The service contains application and business logic.

The repository or ORM layer communicates with PostgreSQL.

PostgreSQL then enforces database-level rules such as primary keys, foreign keys, unique constraints, checks, and transactions.

<b>Beginner real-world example:</b>

A NestJS endpoint creates a product:

\`\`\`
POST /products
\`\`\`

The request goes through:

\`\`\`
ProductsController
      |
      v
ProductsService
      |
      v
ProductRepository
      |
      v
PostgreSQL
\`\`\`

The service should not blindly assume that the database will accept everything.

<b>Intermediate real-world example:</b>

Creating an order may require several operations.

The service starts a transaction, creates the order, creates its items, updates inventory, and commits only if the required operations succeed.

<b>Advanced real-world example:</b>

A mature architecture may separate:

\`\`\`
HTTP DTO validation
Business rules
Persistence models
Database constraints
Transaction boundaries
Domain events
External integrations
\`\`\`

For example, payment processing might involve PostgreSQL plus an external payment provider. The database transaction should protect the database state, while a separate workflow handles communication with the external provider.

The important lesson is that PostgreSQL is not simply a place where NestJS dumps objects.

The database is an active part of your application's correctness model.

If your application says:

\`\`\`
stock_quantity >= 0
\`\`\`

then PostgreSQL should ideally enforce that rule too.

If every order must belong to a user, the database should enforce the foreign key.

If product SKUs must be unique, the database should enforce uniqueness.

If multiple writes must happen together, the application should use a transaction.

This creates a much more reliable system.`,
      diagram: `                    NestJS
                       |
        +--------------+--------------+
        |                             |
   Controller                     Service
        |                             |
        |                      Business Rules
        |                             |
        +-----------------------------+
                      |
                Repository / ORM
                      |
                      v
                 PostgreSQL
                      |
        +-------------+-------------+
        |             |             |
   Constraints     Indexes     Transactions
        |             |             |
        +-------------+-------------+
                      |
                Reliable Data`,
      codeExample: {
        title: "NestJS-style service architecture",
        code: `// products.controller.ts

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }
}


// products.service.ts

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}

  async create(dto: CreateProductDto) {
    // Application-level business logic can live here.

    if (dto.price < 0) {
      throw new BadRequestException(
        "Price cannot be negative",
      );
    }

    return this.productsRepository.create({
      name: dto.name,
      sku: dto.sku,
      price: dto.price,
    });
  }
}


// PostgreSQL still protects the database:
//
// CHECK (price >= 0)
// UNIQUE (sku)
// NOT NULL
//
// The application validates for a better API experience,
// while PostgreSQL provides the final integrity boundary.`,
      },
      keyTakeaways: [
        "NestJS and PostgreSQL have different responsibilities.",
        "Controllers handle HTTP concerns.",
        "Services handle application and business logic.",
        "Repositories or ORMs communicate with PostgreSQL.",
        "PostgreSQL protects persistent data using constraints and transactions.",
        "Validation should exist at the API layer and important invariants should also be protected at the database layer.",
        "Transaction boundaries should match operations that need atomic database behavior.",
      ],
      commonMistakes: [
        "<b>Putting raw database logic directly into every controller.</b> This makes business logic difficult to maintain and test.",
        "<b>Assuming DTO validation replaces database constraints.</b> Database rules protect data from all write paths.",
        "<b>Putting every business operation inside one giant transaction.</b> Transactions should have intentional boundaries.",
        "<b>Treating the ORM as the database itself.</b> Understanding SQL and PostgreSQL behavior remains important even when using an ORM.",
      ],
      quiz: [
        {
          question: "Which layer normally contains business logic in a simple NestJS architecture?",
          options: [
            "Controller",
            "Service",
            "PostgreSQL index",
            "HTTP client",
          ],
          correctIndex: 1,
          explanation: "Services commonly contain application and business logic.",
        },
        {
          question: "Why should important invariants also be protected by PostgreSQL?",
          options: [
            "Because TypeScript cannot connect to PostgreSQL",
            "Because database constraints protect persistent data from multiple write paths",
            "Because controllers cannot return JSON",
            "Because indexes replace services",
          ],
          correctIndex: 1,
          explanation: "Database constraints provide protection even when data comes from different application paths.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What does a PostgreSQL table primarily contain?",
      options: [
        "Routes and controllers",
        "Rows and columns representing structured data",
        "Only indexes",
        "Only transactions",
      ],
      correctIndex: 1,
      explanation: "Tables organize structured data into rows and columns.",
    },
    {
      question: "What is the main purpose of a primary key?",
      options: [
        "To uniquely identify a row",
        "To encrypt a row",
        "To create an API endpoint",
        "To store multiple databases",
      ],
      correctIndex: 0,
      explanation: "A primary key provides a unique identity for each row.",
    },
    {
      question: "What does a foreign key protect?",
      options: [
        "The frontend",
        "Relationships between records",
        "HTTP headers",
        "Password formatting",
      ],
      correctIndex: 1,
      explanation: "Foreign keys ensure that referenced records exist and relationships remain valid.",
    },
    {
      question: "Which relationship describes one user having many orders?",
      options: [
        "One-to-one",
        "One-to-many",
        "Many-to-many only",
        "No relationship",
      ],
      correctIndex: 1,
      explanation: "One user can have many orders, while an order normally belongs to one user.",
    },
    {
      question: "What is commonly used for a many-to-many relationship?",
      options: [
        "A junction table",
        "A controller",
        "A password",
        "A single text field containing IDs",
      ],
      correctIndex: 0,
      explanation: "A junction table connects records from both sides of a many-to-many relationship.",
    },
    {
      question: "Which constraint prevents a required column from containing NULL?",
      options: [
        "CHECK",
        "NOT NULL",
        "INDEX",
        "FOREIGN KEY",
      ],
      correctIndex: 1,
      explanation: "NOT NULL requires the column to have a value.",
    },
    {
      question: "Which constraint is appropriate for ensuring a product price is not negative?",
      options: [
        "CHECK",
        "PRIMARY KEY",
        "FOREIGN KEY",
        "INDEX",
      ],
      correctIndex: 0,
      explanation: "A CHECK constraint can enforce conditions such as price >= 0.",
    },
    {
      question: "What is the primary purpose of an index?",
      options: [
        "To improve certain query access patterns",
        "To replace all constraints",
        "To encrypt records",
        "To create transactions",
      ],
      correctIndex: 0,
      explanation: "Indexes can make suitable queries more efficient.",
    },
    {
      question: "Why should you not create indexes on every column?",
      options: [
        "PostgreSQL allows only one index",
        "Indexes require storage and add maintenance overhead",
        "Indexes prevent SELECT queries",
        "Indexes remove primary keys",
      ],
      correctIndex: 1,
      explanation: "Indexes improve some reads but add storage and write-maintenance costs.",
    },
    {
      question: "What does COMMIT do in a transaction?",
      options: [
        "Makes the transaction changes permanent",
        "Deletes all rows",
        "Creates a foreign key",
        "Creates an index",
      ],
      correctIndex: 0,
      explanation: "COMMIT permanently applies the transaction's changes.",
    },
    {
      question: "What does ROLLBACK do?",
      options: [
        "Discards uncommitted transaction changes",
        "Creates a new table",
        "Adds an index",
        "Starts the PostgreSQL server",
      ],
      correctIndex: 0,
      explanation: "ROLLBACK cancels the changes made by the current uncommitted transaction.",
    },
    {
      question: "Why is an order workflow a good transaction example?",
      options: [
        "Because it never changes data",
        "Because several related database changes may need to succeed or fail together",
        "Because transactions are only for SELECT queries",
        "Because orders do not have relationships",
      ],
      correctIndex: 1,
      explanation: "Creating an order can involve several related writes that should remain consistent.",
    },
  ],
  project: {
    name: "E-commerce PostgreSQL foundation",
    goal: "Design and implement a PostgreSQL database for a small e-commerce application while practicing tables, relationships, keys, constraints, indexes, and transactions.",
    brief: "Build the database foundation for an online store. The system should contain users, products, orders, and order items. The design should protect relationships, prevent invalid product data, support common queries efficiently, and use a transaction when creating an order.",
    steps: [
      "Create a PostgreSQL database for the application.",
      "Create a users table with a generated primary key, name, email, and created_at fields.",
      "Make the user email required and unique.",
      "Create a products table with a generated primary key, name, SKU, price, stock quantity, active status, and created_at fields.",
      "Add NOT NULL constraints to fields that are required by the business.",
      "Add a UNIQUE constraint for the product SKU.",
      "Add CHECK constraints that prevent negative product prices and negative stock quantities.",
      "Create an orders table with its own primary key and a user_id foreign key.",
      "Create an order_items table that connects orders and products.",
      "Use a composite primary key or another intentional uniqueness strategy for order items.",
      "Store quantity and unit_price on order_items so the order retains historical purchase information.",
      "Insert several users and products.",
      "Create several orders belonging to different users.",
      "Add multiple products to the same order.",
      "Write a query that returns all orders belonging to one user.",
      "Write a query that returns all products inside a particular order.",
      "Write a query that calculates an order total from order_items.",
      "Create an index for a frequently used user order lookup.",
      "Create a composite index for a realistic order history query such as filtering by user_id and sorting by created_at.",
      "Use EXPLAIN to inspect at least one important query.",
      "Create a transaction that inserts an order and its order items while updating product stock.",
      "Make the transaction roll back when stock is insufficient.",
      "Test that the database prevents an invalid foreign key.",
      "Test that duplicate emails or SKUs are rejected.",
      "Test that negative prices and negative stock quantities are rejected.",
    ],
    acceptance: [
      "The database contains separate tables for users, products, orders, and order_items.",
      "Every major entity has a primary key.",
      "Orders reference users through a foreign key.",
      "Order items reference both orders and products.",
      "Required fields use NOT NULL appropriately.",
      "User emails cannot be duplicated.",
      "Product SKUs cannot be duplicated.",
      "Product prices cannot be negative.",
      "Product stock quantities cannot be negative.",
      "Common user/order queries have intentional indexes.",
      "At least one composite index is designed around a real query pattern.",
      "A transaction is used for a multi-step order operation.",
      "The transaction can roll back when an operation fails.",
      "The database rejects invalid foreign-key references.",
      "The database preserves the historical unit price of an order item.",
    ],
    stretch: [
      "Add a categories table and connect products to categories.",
      "Support products belonging to multiple categories using a product_categories junction table.",
      "Add a payments table connected to orders.",
      "Design payment status values and enforce valid states at the database level where appropriate.",
      "Add soft deletion to products using deleted_at and update queries so deleted products are not shown in normal catalog results.",
      "Create a partial index for active products if your query workload makes it useful.",
      "Use EXPLAIN ANALYZE to investigate a realistic query on a larger dataset.",
      "Create an inventory_movements table so stock changes can be audited instead of only storing the current stock quantity.",
      "Design an idempotency strategy for order creation so retrying the same request does not accidentally create duplicate orders.",
      "Integrate the schema with a NestJS service and implement a real transaction around order creation.",
    ],
  },
};
