import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_31_LESSONS: LessonDay = {
  day: 31,
  title: "Database Migrations",
  totalMinutes: 100,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "what-is-a-migration",
      title: "What is a Database Migration?",
      durationMinutes: 16,
      explanation: `A database migration is a <b>version-controlled description of a database change</b>.

Think about a real application that starts with a simple \`users\` table:

<pre>
users
--------------------------------
id
name
email
</pre>

Six months later, the application needs to store the user's phone number. You could manually open PostgreSQL and execute:

<pre>
ALTER TABLE users ADD COLUMN phone VARCHAR(30);
</pre>

That works on your computer, but there is a serious problem.

What happens when another developer joins the project?

What happens when the application is deployed to staging?

What happens when production has 10,000 users?

What happens when a second developer needs to reproduce the exact same database structure?

A migration solves this by turning the database change into a piece of source code.

For example:

<pre>
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneToUsers1710000000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "users"
       ADD COLUMN "phone" varchar(30)\`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "users"
       DROP COLUMN "phone"\`
    );
  }
}
</pre>

The important idea is that a migration normally has two directions.

<b>\`up()\`</b> describes how to apply the change.

<b>\`down()\`</b> describes how to reverse the change.

You can think of migrations as a history book for your database.

For example:

<pre>
Migration 1
Create users table

        ↓

Migration 2
Create products table

        ↓

Migration 3
Create orders table

        ↓

Migration 4
Add phone to users

        ↓

Migration 5
Add status to orders
</pre>

The application code and database structure now have a shared history.

<b>Beginner real-world example:</b>

Imagine a small online bookstore.

Initially, you only store:

<pre>
books
- id
- title
- price
</pre>

Later, you realize every book needs an ISBN.

Instead of asking every developer to manually execute SQL, you create a migration:

<pre>
ALTER TABLE books
ADD COLUMN isbn VARCHAR(20);
</pre>

Everyone can run the migration and reach the same database structure.

<b>Intermediate real-world example:</b>

An e-commerce company already has a \`users\` table in production.

The business now wants customers to have a loyalty point balance.

You create:

<pre>
AddLoyaltyPointsToUsers
</pre>

The migration adds:

<pre>
loyalty_points INTEGER NOT NULL DEFAULT 0
</pre>

The default is important because existing users already exist. Without thinking about existing rows, the migration could fail or create invalid data.

<b>Advanced real-world example:</b>

A payment platform needs to replace a single \`name\` column with \`first_name\` and \`last_name\`.

Instead of immediately deleting \`name\`, a safer migration strategy might be:

<pre>
Step 1:
Add first_name and last_name

Step 2:
Copy existing name data

Step 3:
Deploy application code that reads the new columns

Step 4:
Verify production data

Step 5:
Remove the old name column in a later migration
</pre>

This is an example of treating migrations as part of a production deployment strategy rather than simply as SQL files.

A migration should be treated as permanent application history. Once a migration has already been executed in production, changing its contents can create serious problems because different environments may already have different versions of that migration.`,
      diagram: `Application source code
        |
        v
Migration files
        |
        v
Migration runner
        |
        v
PostgreSQL
        |
        +--> users
        +--> products
        +--> orders
        +--> payments

Migration history:

001 -> users
002 -> products
003 -> orders
004 -> payments`,
      codeExample: {
        title: "Basic TypeORM migration",
        code: `import {
  MigrationInterface,
  QueryRunner,
} from "typeorm";

export class AddPhoneToUsers1710000000000
  implements MigrationInterface
{
  name = "AddPhoneToUsers1710000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "users"
       ADD COLUMN "phone" varchar(30)\`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "users"
       DROP COLUMN "phone"\`
    );
  }
}`,
      },
      keyTakeaways: [
        "A migration is a version-controlled database change.",
        "The `up()` method normally applies the change.",
        "The `down()` method normally reverses the change.",
        "Migrations make database structure reproducible across environments.",
        "Migration files become part of the application's database history.",
        "Do not casually edit a migration that has already been executed in shared or production environments.",
      ],
      commonMistakes: [
        "<b>Changing the production database manually without recording the change.</b> Other environments will not know about the change.",
        "<b>Editing an old migration after it has already run in production.</b> The migration history may no longer describe what actually happened.",
        "<b>Deleting old migrations because they look unnecessary.</b> They may be required to build a fresh database from scratch.",
        "<b>Forgetting existing data.</b> A new NOT NULL column or constraint can fail when old rows do not satisfy it.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a migration?",
          options: [
            "To store user passwords",
            "To version and reproduce database structure changes",
            "To replace controllers",
            "To create HTTP requests",
          ],
          correctIndex: 1,
          explanation:
            "Migrations allow database changes to be tracked and applied consistently across environments.",
        },
        {
          question: "What does the `up()` method normally do?",
          options: [
            "Deletes the database",
            "Applies the migration change",
            "Starts NestJS",
            "Creates an HTTP server",
          ],
          correctIndex: 1,
          explanation:
            "The `up()` method contains the operations needed to apply the migration.",
        },
      ],
    },
    {
      id: "typeorm-migration-generation",
      title: "Generating Migrations",
      durationMinutes: 16,
      explanation: `Generating a migration means creating a migration file that represents a database schema change.

With TypeORM, migrations can be written manually or generated from differences between your entities and database schema, depending on your project configuration and workflow.

A typical TypeORM project may have a DataSource configuration similar to:

<pre>
src/database/data-source.ts
</pre>

For example:

<pre>
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/database/migrations/*.ts"],
});
</pre>

Suppose your entity changes from:

<pre>
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("decimal")
  price: number;
}
</pre>

to:

<pre>
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("decimal")
  price: number;

  @Column({ default: true })
  isActive: boolean;
}
</pre>

You have changed the application's expected database structure.

The database needs to catch up.

A migration can represent:

<pre>
ALTER TABLE products
ADD COLUMN is_active boolean
DEFAULT true;
</pre>

A generated migration might contain equivalent TypeORM operations.

The exact CLI command depends on how your project scripts and TypeORM CLI are configured. A common workflow is to expose a DataSource file to the TypeORM CLI and then run a migration generation command against it.

For example:

<pre>
npx typeorm migration:generate
src/database/migrations/AddProductActiveFlag
-d src/database/data-source.ts
</pre>

The generated file should always be reviewed by a developer.

Do not blindly assume generated SQL is perfect.

<b>Beginner real-world example:</b>

You add an \`isActive\` field to products.

The migration should make old products active by default because existing products should not suddenly disappear from the storefront.

<b>Intermediate real-world example:</b>

You rename a customer's field.

A schema tool may interpret a rename as:

<pre>
DROP old_column
ADD new_column
</pre>

That can destroy existing data.

A carefully written migration may instead use:

<pre>
ALTER TABLE users
RENAME COLUMN old_column TO new_column;
</pre>

The lesson is important:

<b>Schema generation tells you what changed structurally; you are still responsible for checking whether the proposed database operation is safe for real data.</b>

<b>Advanced real-world example:</b>

A company has millions of orders.

You add a new indexed column.

A migration generator may correctly produce the SQL to add the column, but the database operation itself may have operational consequences depending on the database version, table size, index type, locking behavior, and deployment strategy.

At scale, migration review becomes part of database engineering, not just application development.`,
      diagram: `Entity change
     |
     v
Compare desired schema
with current database schema
     |
     v
Migration generation
     |
     v
Review generated migration
     |
     +------> Safe? ------> Run
     |
     +------> Unsafe? ----> Edit migration
                              |
                              v
                         Test with real-like data`,
      codeExample: {
        title: "Entity change and generated migration idea",
        code: `// product.entity.ts

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("decimal")
  price: number;

  @Column({ default: true })
  isActive: boolean;
}

// A migration may represent the schema change as:

import {
  MigrationInterface,
  QueryRunner,
} from "typeorm";

export class AddProductActiveFlag1710000000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "products"
       ADD COLUMN "is_active"
       boolean NOT NULL DEFAULT true\`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "products"
       DROP COLUMN "is_active"\`
    );
  }
}`,
      },
      keyTakeaways: [
        "Migration generation can help convert entity/schema differences into migration files.",
        "Always inspect generated migrations before applying them.",
        "A rename can be dangerous if interpreted as drop-and-add.",
        "Existing production data must be considered before applying schema changes.",
        "Large database changes require operational thinking in addition to TypeScript correctness.",
      ],
      commonMistakes: [
        "<b>Running generated migrations without reviewing them.</b> Generated SQL can be structurally correct but operationally dangerous.",
        "<b>Assuming a rename will always preserve data.</b> Verify what SQL the migration actually generates.",
        "<b>Testing only with an empty database.</b> Existing production data can expose problems that an empty database cannot.",
        "<b>Generating migrations while automatic schema synchronization is enabled in production.</b> Production schema changes should normally be controlled explicitly through migrations.",
      ],
      quiz: [
        {
          question: "Should a generated migration always be reviewed?",
          options: [
            "No",
            "Only when using SQLite",
            "Yes",
            "Only after production deployment",
          ],
          correctIndex: 2,
          explanation:
            "Generated migrations should be inspected to ensure they preserve data and behave safely.",
        },
        {
          question: "Why can a column rename be dangerous?",
          options: [
            "It changes TypeScript syntax",
            "A tool might interpret it as dropping and recreating the column",
            "It always deletes the database",
            "PostgreSQL cannot rename columns",
          ],
          correctIndex: 1,
          explanation:
            "An incorrect migration can turn a rename into a destructive drop-and-add operation.",
        },
      ],
    },
    {
      id: "migration-execution",
      title: "Executing Migrations",
      durationMinutes: 14,
      explanation: `Creating a migration file does not automatically change the database.

The migration must be executed.

A typical TypeORM workflow contains commands conceptually similar to:

<pre>
migration:run
migration:revert
migration:show
</pre>

The exact command syntax depends on your TypeORM version and project setup.

When migrations run, TypeORM keeps track of which migrations have already been executed. This prevents the same migration from being applied repeatedly.

Imagine you have:

<pre>
001 CreateUsers
002 CreateProducts
003 CreateOrders
</pre>

The database has already executed:

<pre>
001
002
</pre>

When you run migrations, TypeORM can identify that \`003\` has not yet been executed and apply it.

A migration history table is used to track this state.

Conceptually:

<pre>
Migration history
-----------------------------
CreateUsers        executed
CreateProducts     executed
CreateOrders       pending
</pre>

After execution:

<pre>
Migration history
-----------------------------
CreateUsers        executed
CreateProducts     executed
CreateOrders       executed
</pre>

<b>Beginner real-world example:</b>

You clone an e-commerce project and create a fresh database.

Running the migrations creates the database structure in the correct order.

You do not need to manually create every table.

<b>Intermediate real-world example:</b>

Your development database is missing the latest \`orders.status\` column.

You run the migration command.

The migration runner finds the pending migration and applies it.

<b>Advanced real-world example:</b>

Your CI pipeline creates a temporary PostgreSQL database for integration tests.

The pipeline can run all migrations against the empty database before executing tests.

This is valuable because it checks whether the migration history can actually build a working database from scratch.

A common production pattern is also:

<pre>
Build application
      |
      v
Deploy application artifact
      |
      v
Run pending migrations
      |
      v
Start/restart application
</pre>

The exact ordering depends on whether the migration is backward-compatible with the currently running application version.

That detail becomes extremely important in zero-downtime deployments.`,
      diagram: `Migration files

001_users
002_products
003_orders
004_payments
       |
       v
Migration runner
       |
       v
Migration history table
       |
       +--> 001 executed
       +--> 002 executed
       +--> 003 pending
       +--> 004 pending
       |
       v
Run pending migrations
       |
       v
003 executed
004 executed`,
      codeExample: {
        title: "Migration execution workflow",
        code: `// package.json

{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:run":
      "npm run typeorm -- migration:run -d src/database/data-source.ts",
    "migration:revert":
      "npm run typeorm -- migration:revert -d src/database/data-source.ts",
    "migration:show":
      "npm run typeorm -- migration:show -d src/database/data-source.ts"
  }
}

// Example usage:
//
// npm run migration:show
// npm run migration:run
// npm run migration:revert`,
      },
      keyTakeaways: [
        "Creating a migration file does not execute it.",
        "The migration runner applies pending migrations.",
        "TypeORM records migration history so executed migrations are not normally run again.",
        "Migration execution order matters.",
        "Running all migrations against a fresh database is a useful integration test.",
      ],
      commonMistakes: [
        "<b>Creating a migration but never running it.</b> The application entity and database can become inconsistent.",
        "<b>Deleting the migration history table.</b> The migration runner may no longer know what has already been executed.",
        "<b>Running migrations against the wrong database.</b> Always verify the database configuration and environment.",
        "<b>Assuming a successful command means the application is safe.</b> Test the application behavior after schema changes.",
      ],
      quiz: [
        {
          question: "What happens when a migration is created but not executed?",
          options: [
            "The database automatically changes",
            "The migration remains pending",
            "NestJS deletes the migration",
            "The entity stops compiling",
          ],
          correctIndex: 1,
          explanation:
            "A migration file describes a change; the migration runner must execute it.",
        },
        {
          question: "Why does TypeORM track executed migrations?",
          options: [
            "To authenticate users",
            "To know which migrations have already been applied",
            "To store product images",
            "To compile TypeScript",
          ],
          correctIndex: 1,
          explanation:
            "Migration history allows TypeORM to distinguish executed migrations from pending ones.",
        },
      ],
    },
    {
      id: "migration-rollback",
      title: "Rolling Back Migrations",
      durationMinutes: 14,
      explanation: `A rollback reverses a previously executed migration.

In TypeORM, the \`down()\` method normally defines how to undo the change made by \`up()\`.

For example:

<pre>
up():
ADD COLUMN phone

down():
DROP COLUMN phone
</pre>

If the migration was:

<pre>
export class AddPhoneToUsers1710000000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      \`ALTER TABLE "users"
       ADD COLUMN "phone" varchar(30)\`
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(
      \`ALTER TABLE "users"
       DROP COLUMN "phone"\`
    );
  }
}
</pre>

A rollback can remove the column.

But there is a critical real-world warning.

<b>Rollback does not magically restore deleted data.</b>

Suppose a migration removes a column:

<pre>
DROP COLUMN phone;
</pre>

The \`down()\` method could recreate the column:

<pre>
ADD COLUMN phone varchar(30);
</pre>

But the old phone numbers may already be gone.

The schema can be restored while the data cannot.

This is why rollback design requires more than writing a syntactically correct \`down()\` method.

<b>Beginner real-world example:</b>

You add a nullable \`nickname\` column.

Rolling it back removes the column. Because the new column was not critical and you understand the data implications, this may be straightforward.

<b>Intermediate real-world example:</b>

You rename:

<pre>
customer_name
</pre>

to:

<pre>
name
</pre>

A good rollback can rename it back.

This is safer than dropping the original column and creating a new one because the data remains in the same column.

<b>Advanced real-world example:</b>

You migrate payment data from one structure to another.

A rollback may be technically possible but unsafe because transactions may already have been processed using the new structure.

In production, the better recovery strategy might be a forward-fix migration rather than a rollback.

For example:

<pre>
Migration 20:
Create new payment structure

Migration 21:
Copy payment data

Migration 22:
Application starts using new structure

Problem discovered

Instead of reverting everything:

Migration 23:
Fix incorrect payment mapping
</pre>

This is an important production concept:

<b>A rollback mechanism should exist, but rollback is not always the correct production recovery strategy.</b>`,
      diagram: `Migration

up()
 |
 v
Database change
 |
 v
Application uses new schema
 |
 +------ Problem?
 |
 +-----> rollback
           |
           v
        down()
           |
           v
     Previous schema

BUT:

Schema rollback
      !=
Data recovery`,
      codeExample: {
        title: "A reversible migration",
        code: `import {
  MigrationInterface,
  QueryRunner,
} from "typeorm";

export class RenameCustomerName1710000000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "customers"
       RENAME COLUMN "customer_name" TO "name"\`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "customers"
       RENAME COLUMN "name" TO "customer_name"\`
    );
  }
}`,
      },
      keyTakeaways: [
        "The `down()` method normally describes how to reverse `up()`.",
        "A schema rollback does not guarantee data recovery.",
        "Renames are often safer than drop-and-recreate operations when preserving data.",
        "Production incidents may be better handled with a forward-fix migration.",
        "Rollback logic should be tested before relying on it.",
      ],
      commonMistakes: [
        "<b>Assuming every migration is perfectly reversible.</b> Some data transformations permanently lose information.",
        "<b>Testing rollback only by checking whether the SQL succeeds.</b> Also verify the resulting data.",
        "<b>Automatically rolling back production after every failure.</b> A forward fix can sometimes be safer.",
        "<b>Writing an empty `down()` method without understanding the consequences.</b> This makes rollback unavailable for that migration.",
      ],
      quiz: [
        {
          question: "What method normally defines migration rollback behavior?",
          options: [
            "`start()`",
            "`down()`",
            "`reverseApp()`",
            "`undoDatabase()`",
          ],
          correctIndex: 1,
          explanation:
            "TypeORM migration classes normally use `down()` to reverse the `up()` operation.",
        },
        {
          question: "Does restoring a dropped column automatically restore its old data?",
          options: [
            "Yes, always",
            "Only in PostgreSQL",
            "No",
            "Only in NestJS",
          ],
          correctIndex: 2,
          explanation:
            "Recreating a column does not automatically restore data that was deleted.",
        },
      ],
    },
    {
      id: "production-migrations",
      title: "Production Migrations and Safe Deployment",
      durationMinutes: 18,
      explanation: `Production migrations are different from development migrations because real users and real data are involved.

A migration that takes one second on your laptop may behave very differently on a production table containing millions of rows.

Imagine this table:

<pre>
orders
--------------------------
10 million rows
</pre>

Now imagine adding an index:

<pre>
CREATE INDEX idx_orders_customer_id
ON orders(customer_id);
</pre>

The database has to build the index from existing data. Depending on the database version, operation, table size, available resources, locking behavior, and deployment strategy, this may have operational consequences.

This is why production migrations should be treated as deployment operations.

<b>Beginner real-world example:</b>

You add a nullable column:

<pre>
ALTER TABLE users
ADD COLUMN preferred_language varchar(10);
</pre>

This is usually conceptually simple because existing users can have NULL.

<b>Intermediate real-world example:</b>

You need to make an existing column NOT NULL.

Suppose:

<pre>
users.email
</pre>

currently contains NULL values.

You cannot safely jump directly to:

<pre>
ALTER TABLE users
ALTER COLUMN email SET NOT NULL;
</pre>

You first need to understand and clean the existing data.

A safer process might be:

<pre>
1. Find NULL emails
2. Decide how to handle them
3. Backfill valid values
4. Verify no NULL values remain
5. Add NOT NULL constraint
</pre>

<b>Advanced real-world example: zero-downtime deployment</b>

Imagine version 1 of your application uses:

<pre>
users.full_name
</pre>

You want version 2 to use:

<pre>
users.first_name
users.last_name
</pre>

A dangerous deployment would be:

<pre>
Drop full_name
Add first_name
Add last_name
Deploy new application
</pre>

During deployment, old application instances may still expect \`full_name\`.

A safer expand-and-contract approach is:

<pre>
Phase 1:
Add first_name and last_name

Phase 2:
Deploy code that can work with both old and new fields

Phase 3:
Backfill first_name and last_name

Phase 4:
Verify the new data

Phase 5:
Deploy code that uses only the new fields

Phase 6:
Remove full_name later
</pre>

This pattern is often called <b>expand and contract</b>.

The key idea is that database changes should not assume the entire application switches versions at exactly the same instant.

During rolling deployments, there may temporarily be:

<pre>
Old application instance
        +
New application instance
        +
New database schema
</pre>

The database schema therefore needs to be compatible with both application versions during the transition.

<b>Another real-world example: adding a required field</b>

Suppose every order must now have a \`currency\`.

Instead of immediately doing:

<pre>
currency VARCHAR(3) NOT NULL
</pre>

you might:

<pre>
1. Add nullable currency
2. Deploy code that writes currency
3. Backfill existing orders
4. Verify all orders have currency
5. Add NOT NULL constraint
</pre>

This separates structural change from data migration and application behavior.

<b>Large data migrations</b>

Imagine you need to calculate a new field for 50 million customers.

Doing everything inside one enormous transaction may create long locks, large transaction logs, high memory usage, or operational pressure.

A safer approach may involve controlled batches:

<pre>
Batch 1:
rows 1 - 10,000

Batch 2:
rows 10,001 - 20,000

...

Batch N
</pre>

The exact strategy depends on the database, data size, indexes, transaction requirements, and application availability requirements.

The most important mindset is:

<b>Production migrations are code plus data plus operational risk.</b>`,
      diagram: `Safe production schema evolution

Current schema
      |
      v
EXPAND
Add new structures
      |
      v
Compatible application
      |
      v
BACKFILL
Move/prepare existing data
      |
      v
VERIFY
Check production data
      |
      v
CONTRACT
Remove old structures later`,
      codeExample: {
        title: "Expand-and-contract migration example",
        code: `// Migration 1: expand

export class AddNamesToUsers1710000000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "users"
       ADD COLUMN "first_name" varchar(100)\`
    );

    await queryRunner.query(
      \`ALTER TABLE "users"
       ADD COLUMN "last_name" varchar(100)\`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "users"
       DROP COLUMN "first_name"\`
    );

    await queryRunner.query(
      \`ALTER TABLE "users"
       DROP COLUMN "last_name"\`
    );
  }
}

// Later:
// 1. Backfill existing data.
// 2. Deploy application code using the new fields.
// 3. Verify production.
// 4. Remove full_name in a separate migration.`,
      },
      keyTakeaways: [
        "Production migrations must account for real data and real traffic.",
        "Large tables can make simple schema operations expensive.",
        "Avoid destructive schema changes when old application instances may still be running.",
        "Expand-and-contract is useful for safely changing schemas during rolling deployments.",
        "Separate schema changes, data backfills, application deployment, and cleanup when necessary.",
        "Always consider what happens to existing rows, not just future rows.",
      ],
      commonMistakes: [
        "<b>Adding a NOT NULL column to a large populated table without a backfill strategy.</b> Existing rows need valid values.",
        "<b>Dropping a column immediately during a rolling deployment.</b> Older application instances may still use it.",
        "<b>Running huge data updates without considering transaction size.</b> Large operations can put pressure on production systems.",
        "<b>Assuming development database performance predicts production performance.</b> Production data volume can be dramatically different.",
      ],
      quiz: [
        {
          question: "Why is production migration planning important?",
          options: [
            "Production databases have no data",
            "Production contains real data and traffic",
            "Migrations cannot run on PostgreSQL",
            "NestJS requires it",
          ],
          correctIndex: 1,
          explanation:
            "Real production data size, traffic, locks, and application versions can affect migration safety.",
        },
        {
          question: "What is expand-and-contract?",
          options: [
            "A database backup format",
            "A pattern for safely evolving schemas across application versions",
            "A TypeScript decorator",
            "A PostgreSQL data type",
          ],
          correctIndex: 1,
          explanation:
            "The pattern expands the schema in a backward-compatible way, transitions the application, and contracts old structures later.",
        },
      ],
    },
    {
      id: "migration-versioning",
      title: "Migration Versioning and Team Workflows",
      durationMinutes: 14,
      explanation: `Migration versioning means treating database changes as an ordered history.

A project might contain:

<pre>
src/database/migrations/

1710000000000-CreateUsers.ts
1710100000000-CreateProducts.ts
1710200000000-CreateOrders.ts
1710300000000-AddOrderStatus.ts
1710400000000-AddProductIndex.ts
</pre>

Each migration represents a point in database evolution.

The timestamp or migration name helps establish ordering.

For example:

<pre>
CreateUsers
    |
    v
CreateProducts
    |
    v
CreateOrders
    |
    v
AddOrderStatus
</pre>

This ordering matters when migrations depend on previous structures.

You cannot create a foreign key referencing a table that does not exist yet.

For example:

<pre>
CreateUsers
      |
      v
CreateOrders
</pre>

The orders migration can then reference users.

<b>Beginner real-world example:</b>

A solo developer adds a \`users\` table, then a \`products\` table.

Each change gets its own migration.

If the developer deletes the local database, the full migration history can rebuild the schema.

<b>Intermediate team example:</b>

Three developers work on the same application.

Developer A creates:

<pre>
AddUserAvatar
</pre>

Developer B creates:

<pre>
AddOrderStatus
</pre>

Both migration files eventually become part of the shared project.

The team needs to coordinate migration ordering and make sure migrations do not conflict.

<b>Advanced real-world example:</b>

Two branches both modify the same table.

Branch A adds:

<pre>
phone
</pre>

Branch B adds:

<pre>
country_code
</pre>

After merging, both migrations need to work correctly in sequence.

The team should not simply delete one migration and manually combine database changes. The final migration history should accurately represent the changes that are expected in the target environment.

<b>Important rule:</b>

Once a migration has been executed in a shared environment, treat it as historical record.

If you discover a mistake, normally create a new migration that corrects the problem rather than silently changing the old migration.

For example:

<pre>
Migration 10:
Add customer status

Migration 11:
Fix customer status default
</pre>

instead of rewriting Migration 10 after it has already been deployed.

This is similar to source-code version history.

You do not normally rewrite old commits that other developers have already based their work on.

<b>Migration files should be committed to source control.</b>

A deployment should contain the migration files needed to move the target database from its current version to the application's expected version.

A good project can therefore answer:

<pre>
What database structure did we have?
What changed?
When did it change?
Which migration introduced it?
Can a fresh database reproduce the structure?
Can we understand how production reached its current state?
</pre>

That history becomes extremely valuable when debugging production issues months later.`,
      diagram: `Git repository

src/database/migrations/
        |
        +--> 001 CreateUsers
        |
        +--> 002 CreateProducts
        |
        +--> 003 CreateOrders
        |
        +--> 004 AddOrderStatus
        |
        +--> 005 AddProductIndex
        |
        v
Migration history

Fresh database
        |
        v
Run 001
        |
        v
Run 002
        |
        v
Run 003
        |
        v
Run 004
        |
        v
Run 005
        |
        v
Current schema`,
      codeExample: {
        title: "Versioned migration history",
        code: `// Migration 1

export class CreateUsers1710000000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "email" varchar(255) NOT NULL
      )
    \`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`DROP TABLE "users"\`
    );
  }
}

// Migration 2

export class AddUserStatus1710100000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "users"
       ADD COLUMN "status"
       varchar(30) NOT NULL DEFAULT 'active'\`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "users"
       DROP COLUMN "status"\`
    );
  }
}

// Migration 3 can now safely use users.status.`,
      },
      keyTakeaways: [
        "Migration files form an ordered history of database changes.",
        "Migration ordering matters when one change depends on another.",
        "Migration files should be committed to source control.",
        "Do not normally rewrite migrations that have already been executed in shared environments.",
        "Create a new corrective migration when an old deployed migration needs to be changed.",
        "A fresh database should be able to reach the current schema by running the migration history.",
      ],
      commonMistakes: [
        "<b>Deleting old migrations.</b> Fresh environments may no longer be able to reconstruct the database.",
        "<b>Changing an already-deployed migration.</b> Different environments may already contain the old version.",
        "<b>Creating migrations with unclear dependencies.</b> A migration may execute before the table or column it needs exists.",
        "<b>Forgetting to commit migration files.</b> Other environments will not receive the database changes.",
      ],
      quiz: [
        {
          question: "Where should migration files normally be stored?",
          options: [
            "Only inside node_modules",
            "Inside the project source tree and source control",
            "Only inside PostgreSQL",
            "Inside the browser cache",
          ],
          correctIndex: 1,
          explanation:
            "Migrations are application infrastructure and should be version-controlled with the project.",
        },
        {
          question: "What should you normally do if a deployed migration contains a mistake?",
          options: [
            "Silently edit the old migration",
            "Delete the database",
            "Create a new corrective migration",
            "Delete TypeORM",
          ],
          correctIndex: 2,
          explanation:
            "A new migration preserves the historical record and applies the correction explicitly.",
        },
      ],
    },
    {
      id: "advanced-migration-strategy",
      title: "Advanced Migration Strategy: Schema, Data, and Deployment",
      durationMinutes: 18,
      explanation: `At an advanced level, migrations are not just about changing tables.

There are three related but different types of work:

<pre>
1. Schema migration
2. Data migration
3. Application deployment
</pre>

A <b>schema migration</b> changes database structure.

Examples:

<pre>
ADD COLUMN
CREATE TABLE
CREATE INDEX
ADD CONSTRAINT
ALTER COLUMN
</pre>

A <b>data migration</b> changes existing records.

Examples:

<pre>
Copy old_name into first_name
Convert old status values
Populate missing currency values
Move data from one table to another
</pre>

An <b>application deployment</b> changes the code that uses the database.

These three operations need to work together.

<b>Real-world example: changing order status</b>

Suppose the old application stores:

<pre>
pending
paid
shipped
</pre>

The new business requirement needs:

<pre>
pending
payment_processing
paid
packing
shipped
delivered
cancelled
</pre>

A naive approach might immediately change the database constraint and deploy the new code.

But old application instances may still write:

<pre>
pending
paid
shipped
</pre>

A safer strategy could be:

<pre>
Phase 1:
Make database accept both old and new values.

Phase 2:
Deploy code that understands the new values.

Phase 3:
Backfill or transform existing records if necessary.

Phase 4:
Monitor the application.

Phase 5:
Remove old values/constraints later.
</pre>

<b>Another real-world example: splitting a table</b>

Suppose you have:

<pre>
users
------------------------
id
email
address
city
country
</pre>

You want:

<pre>
users
------------------------
id
email

addresses
------------------------
id
user_id
address
city
country
</pre>

Do not simply create the new table and delete the old columns.

A safer sequence might be:

<pre>
Migration 1:
Create addresses table

Migration 2:
Add user_id relationship

Migration 3:
Copy existing address data

Deployment:
Application can read new addresses

Verification:
Compare old and new data

Later migration:
Remove old address columns
</pre>

This gives you opportunities to verify the transformation before destroying the old structure.

<b>Transaction thinking</b>

Some migrations can safely run inside a database transaction. Others may involve operations where transaction behavior, locking, or database-specific limitations need careful consideration.

Do not assume that every large production migration should simply be wrapped in one enormous transaction.

For example:

<pre>
BEGIN

Update 50 million rows

COMMIT
</pre>

may have very different operational consequences from controlled batches.

The correct strategy depends on the database operation and business requirements.

<b>Migration safety checklist</b>

Before a serious production migration, ask:

<pre>
Does this change existing data?

Can old application versions still work?

Can new application versions work before the migration finishes?

What happens if the migration stops halfway?

Can the migration be retried safely?

How large is the affected table?

Will an index or constraint require significant work?

Could the operation lock important tables?

Do we need a backfill?

Can the backfill run separately?

Is rollback actually safe?

Would a forward-fix be better?

How will we verify the result?
</pre>

These questions turn migrations from "SQL that changes a table" into a controlled engineering process.

<b>Idempotency and retries</b>

A migration should generally be designed so that its intended execution happens once through the migration system.

But production systems can fail for reasons unrelated to the SQL itself.

For example:

<pre>
Migration starts
      |
      v
Database operation
      |
      v
Network connection fails
      |
      v
Did the database finish?
</pre>

You cannot blindly assume the answer.

Operational recovery may require inspecting the actual database state before retrying.

<b>Migration observability</b>

For important production migrations, teams often record:

<pre>
Start time
End time
Migration name
Rows affected
Errors
Database performance
Application errors
Lock behavior
</pre>

This is especially useful when migrations affect large datasets.

At advanced levels, database migrations become part of release engineering, incident response, and database reliability.`,
      diagram: `Application release
       |
       +----------------+
       |                |
       v                v
Schema migration     Data migration
       |                |
       +-------+--------+
               |
               v
          Verification
               |
               v
        Application rollout
               |
               v
          Old schema cleanup

Safe evolution usually separates
"add", "move", "verify", and "remove".`,
      codeExample: {
        title: "Advanced staged migration example",
        code: `// Phase 1: Add the new column.
// Keep the old column temporarily.

export class AddNewOrderReference1710000000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "orders"
       ADD COLUMN "new_reference" varchar(100)\`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`ALTER TABLE "orders"
       DROP COLUMN "new_reference"\`
    );
  }
}

// Phase 2:
// Deploy application code that writes both fields.
//
// Phase 3:
// Backfill existing rows in controlled batches.
//
// Phase 4:
// Verify old_reference and new_reference match.
//
// Phase 5:
// Deploy application code that reads new_reference.
//
// Phase 6:
// Remove old_reference in a later migration.
//
// The important idea is that schema change,
// data movement, application rollout,
// verification, and cleanup can be separate steps.`,
      },
      keyTakeaways: [
        "Advanced migrations involve schema changes, data changes, and application deployment together.",
        "Separate expansion, data movement, verification, and cleanup when a direct change is risky.",
        "Old and new application versions may temporarily run at the same time.",
        "Large data migrations should consider batching, transactions, locks, and operational load.",
        "A failed migration requires checking the actual database state before blindly retrying.",
        "Production migration planning should include verification and recovery strategies.",
      ],
      commonMistakes: [
        "<b>Combining a destructive schema change and massive data transformation into one deployment step.</b> Separate them when possible.",
        "<b>Assuming rollback is always safer than forward-fix.</b> The correct recovery strategy depends on the actual database state and business impact.",
        "<b>Ignoring old application instances.</b> Rolling deployments can leave multiple application versions running simultaneously.",
        "<b>Running huge backfills without measuring database load.</b> Data migrations can compete with normal application traffic.",
      ],
      quiz: [
        {
          question: "Why separate schema changes from large data backfills?",
          options: [
            "To make TypeScript compile",
            "To make every migration longer",
            "To reduce deployment risk and allow verification",
            "Because PostgreSQL cannot update data",
          ],
          correctIndex: 2,
          explanation:
            "Separating structural changes, data movement, and verification gives teams more control and safer recovery options.",
        },
        {
          question: "Why must old application versions be considered during rolling deployments?",
          options: [
            "They may still access the old database structure",
            "They cannot use HTTP",
            "They delete migrations automatically",
            "They prevent PostgreSQL from starting",
          ],
          correctIndex: 0,
          explanation:
            "Old and new application instances can temporarily coexist, so the database needs compatible transitions.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is a database migration?",
      options: [
        "A NestJS controller",
        "A version-controlled database change",
        "A PostgreSQL password",
        "A TypeScript interface",
      ],
      correctIndex: 1,
      explanation:
        "A migration describes a database structure or data change in a version-controlled way.",
    },
    {
      question: "Which migration method normally applies a change?",
      options: [
        "`up()`",
        "`down()`",
        "`executeLater()`",
        "`start()`",
      ],
      correctIndex: 0,
      explanation:
        "TypeORM migrations normally use `up()` to apply a migration.",
    },
    {
      question: "Which migration method normally reverses a change?",
      options: [
        "`reverse()`",
        "`down()`",
        "`undo()`",
        "`rollbackDatabase()`",
      ],
      correctIndex: 1,
      explanation:
        "The `down()` method normally defines the reverse operation.",
    },
    {
      question: "Why should generated migrations be reviewed?",
      options: [
        "Generated SQL can potentially destroy or mishandle existing data",
        "TypeScript cannot read SQL",
        "PostgreSQL does not support migrations",
        "Migrations cannot contain SQL",
      ],
      correctIndex: 0,
      explanation:
        "Generated migrations should be inspected to ensure the resulting database operation is safe for existing data.",
    },
    {
      question: "What happens when a migration file exists but has not been executed?",
      options: [
        "The database automatically changes",
        "The migration remains pending",
        "The migration is deleted",
        "NestJS ignores the database",
      ],
      correctIndex: 1,
      explanation:
        "A migration file describes a change; the migration runner must execute it.",
    },
    {
      question: "Does recreating a dropped column automatically restore its old data?",
      options: [
        "Yes",
        "Only in production",
        "No",
        "Only when using TypeORM",
      ],
      correctIndex: 2,
      explanation:
        "Schema restoration and data restoration are different problems.",
    },
    {
      question: "Why can production migrations be more difficult than development migrations?",
      options: [
        "Production has no data",
        "Production has real data, traffic, locks, and application versions",
        "Development databases cannot use SQL",
        "NestJS blocks migrations in production",
      ],
      correctIndex: 1,
      explanation:
        "Production database size, traffic, locking, and deployment behavior can significantly affect migration safety.",
    },
    {
      question: "What is expand-and-contract used for?",
      options: [
        "Password hashing",
        "Safely evolving database schemas across application versions",
        "Creating NestJS modules",
        "Generating JWT tokens",
      ],
      correctIndex: 1,
      explanation:
        "Expand-and-contract introduces new structures first, transitions application usage, and removes old structures later.",
    },
    {
      question: "What should normally happen if a deployed migration needs correction?",
      options: [
        "Edit the old migration silently",
        "Delete the migration history",
        "Create a new corrective migration",
        "Delete the database",
      ],
      correctIndex: 2,
      explanation:
        "A corrective migration preserves the historical migration record and explicitly applies the fix.",
    },
    {
      question: "Why should migration files be committed to source control?",
      options: [
        "So environments can reproduce database changes",
        "So PostgreSQL can compile TypeScript",
        "So browsers can execute SQL",
        "So controllers can access entities",
      ],
      correctIndex: 0,
      explanation:
        "Version-controlled migration files allow developers, CI, staging, and production to share the same database change history.",
    },
    {
      question: "Which situation may require a data backfill before adding a NOT NULL constraint?",
      options: [
        "Existing rows contain NULL values",
        "The table has a primary key",
        "The database uses PostgreSQL",
        "The application uses NestJS",
      ],
      correctIndex: 0,
      explanation:
        "Existing NULL values must be handled before the database can safely require a value for every row.",
    },
    {
      question: "What is a forward-fix?",
      options: [
        "A new migration that corrects a production problem",
        "Deleting every migration",
        "Restarting PostgreSQL",
        "Changing a TypeScript compiler option",
      ],
      correctIndex: 0,
      explanation:
        "A forward-fix uses a new controlled change to correct the database instead of necessarily reverting previous production migrations.",
    },
  ],
  project: {
    name: "Production-ready database migration workflow",
    goal: "Build and manage a realistic TypeORM migration history for an e-commerce application, including schema changes, data backfills, rollback planning, and production-safe deployment.",
    brief: "Create a small NestJS and TypeORM application with users, products, and orders. Start with a simple schema and evolve it through multiple version-controlled migrations. The project should demonstrate migration generation, execution, rollback, data transformation, migration ordering, and an expand-and-contract style production change.",
    steps: [
      "Create a PostgreSQL database for the project.",
      "Configure a TypeORM DataSource with entities and a migrations directory.",
      "Create an initial migration for the users table.",
      "Create a migration for the products table.",
      "Create a migration for the orders table.",
      "Add a status column to orders through a new migration.",
      "Add an isActive column to products with a safe default for existing products.",
      "Create a migration that adds a new user profile field without immediately removing the old field.",
      "Insert realistic development data before testing the migration.",
      "Generate or manually create a migration and inspect the generated SQL.",
      "Run all pending migrations against the development database.",
      "Check the migration history and identify which migrations have been executed.",
      "Test a migration rollback in a safe development environment.",
      "Verify that rollback changes both schema and expected data behavior.",
      "Create a data backfill for an existing field using controlled batches where appropriate.",
      "Design an expand-and-contract migration for a schema change.",
      "Deploy a compatible application version before removing the old database structure.",
      "Verify that existing rows contain valid values before adding strict constraints.",
      "Test the complete migration history against a fresh PostgreSQL database.",
      "Document which migrations are safe to roll back and which require a forward-fix strategy.",
    ],
    acceptance: [
      "The project uses TypeORM migrations instead of relying on automatic production schema synchronization.",
      "The database schema can be recreated from an empty database by running the migration history.",
      "At least three separate migrations exist and execute in the correct order.",
      "The project contains both `up()` and `down()` implementations for reversible migrations.",
      "At least one migration safely handles existing rows.",
      "At least one migration demonstrates a data backfill or data transformation.",
      "The migration history can be inspected to determine which migrations have executed.",
      "A rollback is tested in a non-production environment.",
      "The project demonstrates why schema rollback does not necessarily restore deleted data.",
      "The project includes an expand-and-contract style schema change.",
      "Migration files are committed to source control.",
      "The project does not rely on destructive automatic schema synchronization in production.",
      "A fresh database can be created successfully using only the committed migrations.",
      "The migration workflow includes a strategy for handling production migration failures.",
    ],
    stretch: [
      "Create a migration that adds an index to a large table and document the operational considerations.",
      "Implement a reusable batch-processing function for a large data backfill.",
      "Create a migration that transforms old order statuses into a new status model.",
      "Build an integration-test setup that creates a fresh PostgreSQL database and runs every migration before testing repositories.",
      "Add migration verification checks that compare expected row counts before and after a data transformation.",
      "Design a zero-downtime deployment sequence for splitting one database column into two columns.",
      "Document which production migrations can be safely rolled back and which should use a forward-fix strategy.",
      "Simulate a migration failure and write a recovery procedure based on inspecting the actual database state.",
      "Add CI validation that fails when the migration history cannot build a fresh database.",
      "Create a complete release document showing the relationship between migration order, application deployment order, backfills, verification, and cleanup.",
    ],
  },
};
