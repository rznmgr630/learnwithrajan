import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_27_LESSONS: LessonDay = {
  day: 27,
  title: "TypeORM Fundamentals",
  totalMinutes: 120,
  difficulty: "Beginner",
  lessons: [
    {
      id: "typeorm-datasource",
      title: "DataSource: connecting NestJS to PostgreSQL",
      durationMinutes: 22,
      explanation: `TypeORM is an Object-Relational Mapper, commonly called an <b>ORM</b>. It allows a TypeScript application to work with database tables using TypeScript classes, objects, repositories, and queries.

Instead of writing every SQL statement manually, you can describe your database structure using TypeScript classes called <b>entities</b> and let TypeORM map those entities to database tables.

The first important TypeORM concept is the <b>DataSource</b>.

A DataSource represents the configuration and connection information TypeORM uses to communicate with a database.

Think of it as the application's database doorway.

Your NestJS application needs to know things such as:

- Which database engine are we using?
- Where is the PostgreSQL server?
- Which database should we connect to?
- What username should be used?
- What password should be used?
- Which entities belong to this application?
- Should TypeORM synchronize the schema?
- Should migrations be enabled?

A typical NestJS application configures TypeORM through \`TypeOrmModule.forRoot()\`.

<b>Beginner real-world example:</b>

Imagine you are building a small bookstore.

Your NestJS application needs to connect to PostgreSQL before it can save books.

The architecture looks like:

\`\`\`
NestJS Application
       |
       v
TypeORM DataSource
       |
       v
PostgreSQL
       |
       +--- books
       +--- authors
       +--- customers
\`\`\`

The DataSource is responsible for establishing and managing the database connection.

<b>Intermediate real-world example:</b>

A production application usually does not hard-code passwords directly into the source code.

Instead, configuration comes from environment variables:

\`\`\`
DATABASE_HOST
DATABASE_PORT
DATABASE_USERNAME
DATABASE_PASSWORD
DATABASE_NAME
\`\`\`

This allows development, staging, and production environments to use different databases without changing the application source code.

<b>Advanced real-world example:</b>

A production TypeORM setup should normally use migrations rather than relying on automatic schema synchronization.

For example, imagine version 1 of your application has:

\`\`\`
users
- id
- name
- email
\`\`\`

Later, version 2 requires:

\`\`\`
users
- id
- name
- email
- phone
\`\`\`

Instead of allowing the application to guess how the production schema should change, you can create a migration that explicitly says:

\`\`\`
ALTER TABLE users
ADD COLUMN phone TEXT;
\`\`\`

This gives your team a controlled history of database changes.

Another important concept is connection lifecycle.

Your application may create a database connection when it starts and release resources when the application shuts down.

In a simple application you may not manually interact with the DataSource very often. NestJS and TypeORM manage much of this for you.

But advanced developers should still understand what is happening underneath because debugging database connection failures, migrations, transactions, connection pools, and testing environments requires knowledge of the DataSource.

<b>Important development warning:</b>

You may see:

\`\`\`ts
synchronize: true
\`\`\`

in tutorials.

This can be convenient while learning because TypeORM can attempt to synchronize entities with the database.

However, automatically changing a production database schema can be dangerous. Production applications commonly use migrations instead.

The important mental model is:

\`\`\`
NestJS
   |
   v
TypeORM
   |
   v
DataSource
   |
   v
PostgreSQL connection/pool
   |
   v
Database
\`\`\`

The DataSource is the foundation on which TypeORM database operations are built.`,
      diagram: `NestJS Application
       |
       v
TypeOrmModule.forRoot(...)
       |
       v
TypeORM DataSource
       |
       +--> Configuration
       |      |
       |      +--> host
       |      +--> port
       |      +--> username
       |      +--> password
       |      +--> database
       |
       +--> Entities
       |
       +--> Connection Pool
       |
       v
PostgreSQL`,
      codeExample: {
        title: "Basic to production-style TypeORM DataSource setup",
        code: `// app.module.ts

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "./users/user.entity";
import { Product } from "./products/product.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "shop",
      entities: [User, Product],
      synchronize: true,
    }),
  ],
})
export class AppModule {}

// A more realistic configuration:
//
// TypeOrmModule.forRoot({
//   type: "postgres",
//   host: process.env.DATABASE_HOST,
//   port: Number(process.env.DATABASE_PORT),
//   username: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   autoLoadEntities: true,
//   synchronize: false,
//   migrationsRun: false,
//   logging: ["error"],
// });

/*
Production applications commonly use:

synchronize: false

and manage schema changes using migrations.

The exact configuration should be adapted to the
environment and deployment strategy.
*/`,
      },
      keyTakeaways: [
        "The TypeORM DataSource represents the application's database connection configuration and infrastructure.",
        "NestJS can configure TypeORM through TypeOrmModule.forRoot().",
        "Database credentials should normally come from environment or secret configuration rather than being hard-coded.",
        "Entities tell TypeORM which TypeScript classes represent database tables.",
        "Development projects may use synchronize for learning, but production applications commonly use migrations instead.",
        "The DataSource is important when working with transactions, migrations, connection management, and advanced TypeORM features.",
        "Understanding the DataSource helps you debug connection and database startup problems.",
      ],
      commonMistakes: [
        "<b>Hard-coding production database passwords.</b> Keep secrets outside source code and use appropriate environment or secret-management systems.",
        "<b>Using synchronize: true in production without understanding the risks.</b> Schema changes should normally be controlled with migrations.",
        "<b>Forgetting to register entities.</b> TypeORM needs to know which entity classes belong to the DataSource.",
        "<b>Thinking DataSource means one physical database connection.</b> TypeORM commonly works with a connection pool and manages database connections for operations.",
        "<b>Ignoring database configuration differences between environments.</b> Local development, testing, staging, and production often use different databases and credentials.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a TypeORM DataSource?",
          options: [
            "To create HTTP controllers",
            "To configure and manage database access",
            "To validate DTOs",
            "To render HTML",
          ],
          correctIndex: 1,
          explanation: "The DataSource provides TypeORM with the database configuration and infrastructure needed to communicate with the database.",
        },
        {
          question: "Where should production database credentials normally come from?",
          options: [
            "A public Git repository",
            "Environment or secret configuration",
            "A frontend component",
            "A controller parameter",
          ],
          correctIndex: 1,
          explanation: "Database credentials are sensitive configuration and should normally be supplied through environment or secret-management mechanisms.",
        },
        {
          question: "Why should synchronize be used carefully in production?",
          options: [
            "It disables PostgreSQL",
            "It can automatically change database schema",
            "It prevents SELECT queries",
            "It deletes TypeScript files",
          ],
          correctIndex: 1,
          explanation: "Automatic schema synchronization can make unintended database changes. Production systems commonly use explicit migrations.",
        },
      ],
    },
    {
      id: "typeorm-entities",
      title: "Entities: turning TypeScript classes into database models",
      durationMinutes: 24,
      explanation: `An <b>entity</b> is a TypeScript class that TypeORM maps to a database table.

This is one of the most important TypeORM concepts.

Imagine that PostgreSQL has this table:

\`\`\`
users
--------------------------------
id | name | email
--------------------------------
1  | Alice | alice@example.com
2  | Bob   | bob@example.com
\`\`\`

With TypeORM, you can represent that table with a TypeScript class:

\`\`\`ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
\`\`\`

The class represents the table.

The properties represent columns.

The decorators tell TypeORM how the mapping should work.

Think of the relationship like this:

\`\`\`
TypeScript class
       |
       | TypeORM mapping
       v
PostgreSQL table
\`\`\`

<b>Beginner real-world example:</b>

A library application needs books.

You create:

\`\`\`ts
@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}
\`\`\`

TypeORM can map the class to a \`book\` table.

<b>Intermediate real-world example:</b>

An e-commerce Product entity may contain:

\`\`\`
id
name
sku
price
stockQuantity
active
createdAt
\`\`\`

Different properties may need different database types and constraints.

For example, price should not normally be represented as a JavaScript floating-point number in a database where exact decimal storage is required. PostgreSQL \`numeric\` is commonly used for money-like values.

<b>Advanced real-world example:</b>

A production entity can contain database constraints and indexes:

\`\`\`ts
@Entity("products")
@Index(["sku"], { unique: true })
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column({
    type: "numeric",
    precision: 12,
    scale: 2,
  })
  price: string;
}
\`\`\`

The entity is now doing more than simply describing TypeScript data. It describes part of the persistence model.

However, an important architectural distinction is that an entity is <b>not automatically your entire domain model</b>.

In a small application, using entities directly throughout your service may be acceptable.

In a larger application, you may want to separate:

\`\`\`
HTTP DTO
   |
   v
Domain model
   |
   v
Persistence entity
   |
   v
Database
\`\`\`

This prevents database-specific concerns from leaking into every part of the application.

Another important concept is that TypeScript types and database constraints are not the same thing.

If you write:

\`\`\`ts
email: string;
\`\`\`

that tells TypeScript that the property is expected to be a string.

It does not automatically mean:

\`\`\`
NOT NULL
UNIQUE
valid email
\`\`\`

Those rules must be intentionally configured and/or enforced elsewhere.

A mature application may have multiple validation layers:

\`\`\`
Client
  |
  v
DTO validation
  |
  v
Business rules
  |
  v
TypeORM
  |
  v
PostgreSQL constraints
\`\`\`

Each layer protects a different boundary.`,
      diagram: `TypeScript Entity

@Entity("users")
export class User {
  id
  name
  email
}

        |
        | TypeORM mapping
        v

PostgreSQL

users
+----+-------+------------------+
| id | name  | email            |
+----+-------+------------------+
| 1  | Alice | alice@example... |
| 2  | Bob   | bob@example...   |
+----+-------+------------------+`,
      codeExample: {
        title: "Basic to advanced entity examples",
        code: `import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

// BASIC

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;
}

// INTERMEDIATE

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column("numeric", {
    precision: 12,
    scale: 2,
  })
  price: string;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ default: true })
  active: boolean;
}

// ADVANCED

@Entity("users")
@Index(["email"], { unique: true })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  email: string;

  @Column({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}`,
      },
      keyTakeaways: [
        "An entity is a TypeScript class mapped to a database table.",
        "@Entity() tells TypeORM that a class is a database entity.",
        "Properties decorated with @Column() represent database columns.",
        "Primary keys are commonly declared with @PrimaryGeneratedColumn().",
        "Entities can describe database-specific information such as column types, defaults, indexes, and uniqueness.",
        "TypeScript types alone do not replace database constraints.",
        "Large applications may separate persistence entities from domain models.",
      ],
      commonMistakes: [
        "<b>Thinking an entity is the same thing as a DTO.</b> DTOs describe API input/output boundaries, while entities describe persistence.",
        "<b>Assuming a TypeScript string automatically validates input.</b> TypeScript types do not validate runtime HTTP requests.",
        "<b>Putting every business rule inside entity decorators.</b> Many business rules belong in application or domain services.",
        "<b>Using JavaScript number carelessly for exact monetary persistence.</b> Database numeric/decimal types often require deliberate mapping.",
        "<b>Making every entity property nullable.</b> Decide which fields are genuinely optional.",
      ],
      quiz: [
        {
          question: "What does @Entity() tell TypeORM?",
          options: [
            "This class represents a database entity",
            "This class is an HTTP controller",
            "This class is a DTO validator",
            "This class is a middleware",
          ],
          correctIndex: 0,
          explanation: "@Entity() marks a class as a TypeORM entity that can be mapped to a database table.",
        },
        {
          question: "What does @Column() usually represent?",
          options: [
            "A database column",
            "An HTTP route",
            "A database server",
            "A NestJS module",
          ],
          correctIndex: 0,
          explanation: "@Column() maps a class property to a database column.",
        },
      ],
    },
    {
      id: "typeorm-columns",
      title: "Columns: controlling how entity properties are stored",
      durationMinutes: 22,
      explanation: `TypeORM columns connect TypeScript properties to actual PostgreSQL columns.

A beginner might write:

\`\`\`ts
@Column()
name: string;
\`\`\`

and let TypeORM infer the database type.

That is convenient, but production applications often need more control.

You may need to specify:

- Database type
- Length
- Nullability
- Default value
- Uniqueness
- Precision
- Scale
- Generated values
- Update behavior
- Special PostgreSQL types

<b>Beginner real-world example:</b>

A task application has:

\`\`\`ts
@Column()
title: string;

@Column({ default: false })
completed: boolean;
\`\`\`

A new task automatically starts as incomplete.

<b>Intermediate real-world example:</b>

An e-commerce product might use:

\`\`\`ts
@Column({
  type: "numeric",
  precision: 12,
  scale: 2,
})
price: string;
\`\`\`

This tells PostgreSQL to store a decimal value with controlled precision.

<b>Advanced real-world example:</b>

A user may have a nullable phone number:

\`\`\`ts
@Column({
  type: "varchar",
  length: 30,
  nullable: true,
})
phone?: string | null;
\`\`\`

The important question is not simply "Can I make this nullable?"

The real question is:

<b>Does the business allow the value to be missing?</b>

If every employee must have a company email, then making it nullable may hide a data-quality problem.

Column defaults are also useful.

For example:

\`\`\`ts
@Column({ default: true })
active: boolean;
\`\`\`

means the database can provide \`true\` when a value is not supplied.

Timestamps are another common example:

\`\`\`ts
@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;
\`\`\`

These decorators allow TypeORM to manage common timestamp behavior.

<b>Advanced database type example:</b>

PostgreSQL supports types such as:

\`\`\`
uuid
jsonb
timestamptz
numeric
text
varchar
integer
boolean
\`\`\`

 TypeORM can map these to entity properties.

 You should understand the database type being used instead of blindly relying on inference.

 \<b\>Important example: money\</b\>

 Suppose a product costs $19.99.

 Using a binary floating-point number without understanding its behavior can produce surprising arithmetic.

 For financial values, it is common to store exact decimal values in PostgreSQL using \`numeric\` or \`decimal\`.

 The exact application representation should be chosen deliberately.

 \<b\>Important example: dates\</b\>

 PostgreSQL has several date/time types. For applications that operate across time zones, \`timestamptz\` is commonly considered a useful choice because it represents an instant in time with PostgreSQL's time-zone-aware timestamp semantics.

 A production developer should not simply choose a database type because the name looks familiar. Understand what information it preserves and how the application will use it.`,       diagram: `Entity Property
 |
 v
 @Column({
 type,
 nullable,
 default,
 unique,
 precision,
 scale
 })
 |
 v
 PostgreSQL Column
 |
 +--\> actual storage type
 +--\> constraints
 +--\> default
 +--\> nullability`,       codeExample: {         title: "Basic to advanced column configuration",         code: `import {
 Column,
 CreateDateColumn,
 Entity,
 PrimaryGeneratedColumn,
 UpdateDateColumn,
 } from "typeorm";

 @Entity("products")
 export class Product {
 @PrimaryGeneratedColumn()
 id: number;

 // Simple string column

 @Column()
 name: string;

 // String with database length

 @Column({
 type: "varchar",
 length: 100,
 })
 sku: string;

 // Exact decimal database value

 @Column({
 type: "numeric",
 precision: 12,
 scale: 2,
 })
 price: string;

 // Default value

 @Column({
 type: "integer",
 default: 0,
 })
 stockQuantity: number;

 // Boolean with a default

 @Column({
 type: "boolean",
 default: true,
 })
 active: boolean;

 // Optional field

 @Column({
 type: "text",
 nullable: true,
 })
 description: string | null;

 // Automatically managed timestamps

 @CreateDateColumn({
 type: "timestamptz",
 })
 createdAt: Date;

 @UpdateDateColumn({
 type: "timestamptz",
 })
 updatedAt: Date;
 }`,       },       keyTakeaways: [         "Columns map entity properties to database columns.",         "Column configuration controls type, nullability, defaults, length, precision, scale, and other behavior.",         "Use nullable only when the business genuinely allows missing values.",         "Numeric or decimal database types are commonly used when exact decimal storage is important.",         "Timestamps should be designed with time-zone behavior in mind.",         "CreateDateColumn and UpdateDateColumn are useful for common entity timestamps.",         "Understanding the underlying PostgreSQL type is important even when TypeORM hides much of the SQL.",       ],       commonMistakes: [         "<b>Making every field nullable.</b> Optionality should represent a real business requirement.",         "<b>Using a floating-point representation blindly for financial values.</b> Exact monetary storage needs deliberate database and application design.",         "<b>Ignoring database type differences.</b> text, varchar, numeric, timestamp, timestamptz, jsonb, and uuid have different behavior and use cases.",         "<b>Forgetting defaults are database behavior.</b> Application code should understand what happens when a property is omitted.",       ],       quiz: [         {           question: "Which option allows a database column to be missing?",           options: [             "nullable: true",             "unique: true",             "primary: true",             "index: false",           ],           correctIndex: 0,           explanation: "nullable: true allows the database column to contain NULL.",         },         {           question: "Which PostgreSQL type is commonly used for exact decimal values such as prices?",           options: [             "numeric",             "boolean",             "uuid",             "text",           ],           correctIndex: 0,           explanation: "PostgreSQL numeric/decimal types provide exact decimal arithmetic suitable for many monetary storage requirements.",         },       ],     },     {       id: "typeorm-repositories",       title: "Repositories: working with database records through TypeORM",       durationMinutes: 24,       explanation: `A \<b\>repository\</b\> is an object TypeORM provides for working with a particular entity.

 If you have a \`User\` entity, you can work with a \`Repository\<User\>\`.

 Instead of writing:

 \`\`\`sql
 SELECT \*
 FROM users
 WHERE id = 1;
 \`\`\`

 you can use repository methods such as:

 \`\`\`ts
 repository.findOneBy({
 id: 1,
 });
 \`\`\`

 This is one of the main reasons ORMs are useful.

 The repository gives your application a structured way to perform database operations.

 Common repository operations include:

 \`\`\`
 find
 findOne
 findOneBy
 save
 create
 update
 delete
 remove
 count
 exists

\`\`\`

<b>Beginner real-world example:</b>

A user service needs to find a user by ID.

\`\`\`ts
const user = await this.userRepository.findOneBy({
  id,
});
\`\`\`

<b>Intermediate real-world example:</b>

A product service needs to find all active products:

\`\`\`ts
const products = await this.productRepository.find({
  where: {
    active: true,
  },
  order: {
    createdAt: "DESC",
  },
});
\`\`\`

<b>Advanced real-world example:</b>

A complex order screen may require:

- The order
- The customer
- Order items
- Products
- Payment status

At that point, simple repository methods may not express the query clearly enough.

TypeORM provides the <b>QueryBuilder</b> for more complex SQL-like queries.

For example:

\`\`\`ts
this.orderRepository
  .createQueryBuilder("order")
  .leftJoinAndSelect("order.user", "user")
  .leftJoinAndSelect("order.items", "items")
  .leftJoinAndSelect("items.product", "product")
  .where("order.id = :id", { id })
  .getOne();
\`\`\`

The repository therefore gives you both simple operations and access to more advanced querying.

A useful architecture is:

\`\`\`
Controller
   |
   v
Service
   |
   v
Repository
   |
   v
PostgreSQL
\`\`\`

The controller should generally not contain database query logic.

The service decides what operation the application needs.

The repository handles persistence operations.

In NestJS, TypeORM repositories can be injected with:

\`\`\`ts
@InjectRepository(User)
private readonly userRepository: Repository<User>
\`\`\`

This makes the repository available to the service.

<b>Important distinction:</b>

\`create()\` does not normally mean "insert into the database."

It creates an entity object.

\`\`\`ts
const user = this.userRepository.create({
  name: "Alice",
});
\`\`\`

The object exists in memory.

Then:

\`\`\`ts
await this.userRepository.save(user);
\`\`\`

persists it.

This distinction becomes important when you start building more advanced application flows.

You can also use \`insert()\` and \`update()\` for direct database operations when you do not need the full entity lifecycle behavior.

For example:

\`\`\`ts
await repository.update(
  { id },
  { active: false },
);
\`\`\`

Choosing between \`save\`, \`insert\`, \`update\`, \`remove\`, and other operations depends on the use case.

As your application grows, understanding the SQL generated by your ORM becomes increasingly important.`,
      diagram: `NestJS Controller
       |
       v
UserService
       |
       v
Repository<User>
       |
       +--> findOne
       +--> find
       +--> save
       +--> update
       +--> delete
       +--> QueryBuilder
       |
       v
PostgreSQL
       |
       v
users table`,
      codeExample: {
        title: "Basic to advanced repository usage",
        code: `// users.service.ts

import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // BASIC: find one

  async findById(id: string) {
    return this.userRepository.findOneBy({
      id,
    });
  }

  // BASIC: create + save

  async create(name: string, email: string) {
    const user = this.userRepository.create({
      name,
      email,
    });

    return this.userRepository.save(user);
  }

  // INTERMEDIATE: find multiple

  async findActiveUsers() {
    return this.userRepository.find({
      where: {
        active: true,
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  // INTERMEDIATE: update

  async deactivate(id: string) {
    const result = await this.userRepository.update(
      { id },
      { active: false },
    );

    if (result.affected === 0) {
      throw new NotFoundException("User not found");
    }

    return this.findById(id);
  }

  // ADVANCED: QueryBuilder

  async findUserWithOrders(id: string) {
    return this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.orders", "order")
      .where("user.id = :id", { id })
      .orderBy("order.createdAt", "DESC")
      .getOne();
  }
}`,
      },
      keyTakeaways: [
        "A repository provides database operations for a particular entity.",
        "Repositories can be injected into NestJS services with @InjectRepository().",
        "create() creates an entity object in memory.",
        "save() persists an entity to the database.",
        "find and findOneBy are useful for straightforward queries.",
        "update and delete can perform direct database operations.",
        "QueryBuilder is useful when queries become more complex.",
        "Keeping repository/database operations out of controllers usually produces cleaner architecture.",
      ],
      commonMistakes: [
        "<b>Thinking repository.create() immediately inserts a record.</b> create() creates an object; save() persists it.",
        "<b>Putting every database query directly inside controllers.</b> Database access generally belongs in services or dedicated persistence layers.",
        "<b>Using QueryBuilder for every simple query.</b> Simple repository methods are often easier to read.",
        "<b>Using find() to load huge tables without pagination.</b> Large datasets require deliberate pagination and query design.",
        "<b>Ignoring generated SQL.</b> When performance becomes important, understand the SQL and query plan produced by the ORM.",
      ],
      quiz: [
        {
          question: "What does repository.create() normally do?",
          options: [
            "Creates an entity object in memory",
            "Drops the database",
            "Creates an HTTP route",
            "Always commits a transaction",
          ],
          correctIndex: 0,
          explanation: "create() creates an entity instance; save() is normally used to persist it.",
        },
        {
          question: "What is QueryBuilder useful for?",
          options: [
            "Complex database queries",
            "Rendering React components",
            "Creating DTO decorators",
            "Starting the NestJS server",
          ],
          correctIndex: 0,
          explanation: "QueryBuilder provides more control for complex queries and joins.",
        },
      ],
    },
    {
      id: "typeorm-relations",
      title: "Relations: connecting entities in TypeORM",
      durationMinutes: 28,
      explanation: `TypeORM relations allow entity classes to describe relationships between database tables.

If PostgreSQL has:

\`\`\`
users
orders
\`\`\`

and an order belongs to a user, TypeORM can represent that relationship with:

\`\`\`ts
@ManyToOne(() => User, (user) => user.orders)
user: User;
\`\`\`

The main relation types are:

\`\`\`
@OneToOne
@OneToMany
@ManyToOne
@ManyToMany
\`\`\`

The important thing is to understand the database relationship behind the decorators.

<b>One-to-one</b>

One user may have one profile.

\`\`\`
User 1 ---- 1 Profile
\`\`\`

<b>One-to-many / many-to-one</b>

One user can have many orders.

\`\`\`
User 1 ---- many Orders
\`\`\`

The many side normally contains the foreign key.

That means the \`orders\` table might contain:

\`\`\`
user_id
\`\`\`

This is why the TypeORM \`@ManyToOne\` side is especially important.

<b>Many-to-many</b>

Students can enroll in many courses, and courses can contain many students.

A junction table is required:

\`\`\`
students
courses
student_courses
\`\`\`

TypeORM can represent this with \`@ManyToMany\` and \`@JoinTable()\`.

<b>Beginner real-world example:</b>

A blog has authors and posts.

One author can write many posts.

\`\`\`
Author
 |
 +-- Post
 +-- Post
 +-- Post
\`\`\`

The Post entity can have a \`@ManyToOne\` relationship to Author.

<b>Intermediate real-world example:</b>

An online store has:

\`\`\`
User
  |
  +-- Orders
        |
        +-- OrderItems
                |
                +-- Product
\`\`\`

You can model each relationship using TypeORM.

<b>Advanced real-world example:</b>

An order's product relationship is not simply "order has products."

An order contains order items.

Each order item has:

\`\`\`
order
product
quantity
unitPrice
\`\`\`

This is an important real-world design because \`quantity\` and \`unitPrice\` belong to the relationship itself.

A simple many-to-many relation is therefore not enough when the relationship has business data.

Instead of:

\`\`\`
Order <----> Product
\`\`\`

you use:

\`\`\`
Order
  |
  +--> OrderItem
          |
          +--> Product
\`\`\`

This is a pattern you will use frequently in production systems.

<b>Loading relations</b>

A relation does not necessarily mean all related records are automatically loaded every time.

You can explicitly request relations:

\`\`\`ts
repository.find({
  relations: {
    orders: true,
  },
});
\`\`\`

Or use QueryBuilder.

This matters for performance.

Imagine a user has 50,000 orders.

If every request automatically loads all 50,000 orders just because the entity has a relation, the API can become extremely slow and memory-heavy.

<b>N+1 problem</b>

Suppose you load 100 users and then separately load orders for every user.

You may accidentally execute:

\`\`\`
1 query for users
+
100 queries for orders
=
101 queries
\`\`\`

This is the classic <b>N+1 query problem</b>.

A join, carefully designed query, batching strategy, or other approach may be better depending on the use case.

<b>Cascade behavior</b>

TypeORM supports cascade operations.

For example, you may configure:

\`\`\`
cascade: true
\`\`\`

This can cause related entities to be persisted automatically.

It is convenient, but it should be used intentionally.

Cascading saves or removes can become dangerous when a relationship graph is large or when developers do not realize that saving one object can persist related objects.

<b>Relation ownership</b>

In many TypeORM relationships, the side containing \`@JoinColumn()\` is the owning side from the ORM mapping perspective.

For a typical many-to-one relationship:

\`\`\`
@ManyToOne(() => User)
@JoinColumn({ name: "user_id" })
user: User;
\`\`\`

the \`orders\` table receives the \`user_id\` foreign key.

Understanding which side owns the foreign key helps prevent confusing relation behavior.

Relations are powerful, but they should not be treated as a reason to load your entire database graph into memory.

The best query is the one that retrieves exactly the data the use case requires.`,
      diagram: `User
  |
  | @OneToMany
  v
Orders
  |
  | @OneToMany
  v
OrderItems
  |
  | @ManyToOne
  v
Product

Database:

users
  |
  +---- orders.user_id
               |
               +---- order_items.order_id
               |
               +---- order_items.product_id
                                      |
                                      v
                                  products`,
      codeExample: {
        title: "Basic to advanced TypeORM relations",
        code: `// user.entity.ts

import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Order } from "./order.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

// order.entity.ts

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("numeric", {
    precision: 12,
    scale: 2,
  })
  total: string;

  @ManyToOne(
    () => User,
    (user) => user.orders,
    {
      nullable: false,
      onDelete: "RESTRICT",
    },
  )
  @JoinColumn({ name: "user_id" })
  user: User;
}

// order-item.entity.ts

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Order } from "./order.entity";
import { Product } from "./product.entity";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column("numeric", {
    precision: 12,
    scale: 2,
  })
  unitPrice: string;

  @ManyToOne(() => Order, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order: Order;

  @ManyToOne(() => Product, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "product_id" })
  product: Product;
}

// Loading a user's orders

const user = await userRepository.findOne({
  where: {
    id: 1,
  },
  relations: {
    orders: true,
  },
});

// Loading an order with its user and items

const order = await orderRepository.findOne({
  where: {
    id: 100,
  },
  relations: {
    user: true,
    items: {
      product: true,
    },
  },
});

// More advanced query using QueryBuilder

const result = await orderRepository
  .createQueryBuilder("order")
  .leftJoinAndSelect("order.user", "user")
  .leftJoinAndSelect("order.items", "item")
  .leftJoinAndSelect("item.product", "product")
  .where("order.id = :id", { id: 100 })
  .getOne();`,
      },
      keyTakeaways: [
        "TypeORM relation decorators map relationships between entities.",
        "@ManyToOne commonly represents the side containing the foreign key.",
        "@OneToMany represents the collection on the other side of a one-to-many relationship.",
        "@ManyToMany represents many-to-many relationships and commonly uses a junction table.",
        "@JoinColumn identifies the database column used for a relation on the owning side.",
        "Relations do not mean related records should always be loaded.",
        "Careless relation loading can create performance problems.",
        "The N+1 query problem can occur when related records are fetched individually in a loop.",
        "When a relationship contains business data such as quantity or historical price, an explicit entity such as OrderItem is often better than a simple many-to-many relation.",
        "Cascade operations should be enabled intentionally because they can persist or remove related records.",
      ],
      commonMistakes: [
        "<b>Thinking @OneToMany creates the foreign key.</b> In a typical one-to-many relationship, the many-to-one side owns the foreign key.",
        "<b>Loading every relation automatically.</b> Large relation graphs can create huge queries and memory usage.",
        "<b>Ignoring N+1 queries.</b> Loading relations one record at a time can generate hundreds of unnecessary database queries.",
        "<b>Using ManyToMany when the relationship has business fields.</b> Use an explicit junction entity when you need quantity, price, timestamps, status, or other relationship-specific data.",
        "<b>Using cascade everywhere.</b> Cascades should be intentional because saving or removing one entity can affect related entities.",
        "<b>Assuming TypeORM relation decorators remove the need to understand database foreign keys.</b> You still need to understand the PostgreSQL relationship underneath.",
      ],
      quiz: [
        {
          question: "Which TypeORM decorator commonly represents the side of a relationship containing the foreign key?",
          options: [
            "@ManyToOne",
            "@OneToMany",
            "@Controller",
            "@Injectable",
          ],
          correctIndex: 0,
          explanation: "In a typical one-to-many relationship, the many side contains the foreign key and is represented with @ManyToOne.",
        },
        {
          question: "What is commonly required for a many-to-many relationship?",
          options: [
            "A junction table",
            "A controller",
            "A DTO only",
            "A second database server",
          ],
          correctIndex: 0,
          explanation: "Many-to-many relationships are represented in relational databases through a junction table.",
        },
        {
          question: "Why can loading every relation be dangerous?",
          options: [
            "Relations cannot be queried",
            "It can load huge amounts of unnecessary data",
            "It deletes the database",
            "It disables TypeScript",
          ],
          correctIndex: 1,
          explanation: "Large relation graphs can create expensive queries, high memory usage, and slow API responses.",
        },
      ],
    },
    {
      id: "typeorm-nestjs-module-architecture",
      title: "Putting DataSource, entities, repositories, columns, and relations together",
      durationMinutes: 22,
      explanation: `Now connect the five major TypeORM concepts into one real NestJS application.

Imagine you are building an e-commerce backend.

The application has:

\`\`\`
users
products
orders
order_items
\`\`\`

The TypeORM architecture can look like:

\`\`\`
AppModule
   |
   v
TypeOrmModule
   |
   v
DataSource
   |
   +-----------------------------+
   |             |               |
   v             v               v
User Entity   Product Entity   Order Entity
   |                               |
   |                               v
   |                           OrderItem
   |
   v
Repositories
   |
   v
Services
   |
   v
Controllers
\`\`\`

The DataSource provides database connectivity.

Entities describe database tables.

Columns describe fields.

Relations describe connections between entities.

Repositories perform persistence operations.

<b>Beginner real-world example:</b>

A user registers.

The request reaches:

\`\`\`
POST /users
\`\`\`

The controller receives the DTO.

The service creates a User entity.

The repository saves it.

TypeORM sends the appropriate SQL to PostgreSQL.

<b>Intermediate real-world example:</b>

A customer requests:

\`\`\`
GET /users/42/orders
\`\`\`

The service uses the User or Order repository to find orders belonging to that user.

The foreign key in PostgreSQL protects the relationship.

<b>Advanced real-world example:</b>

A customer creates an order containing three products.

The service may need to:

\`\`\`
1. Verify the user exists.
2. Verify products exist.
3. Check stock.
4. Create the order.
5. Create order items.
6. Decrease stock.
7. Commit the transaction.
\`\`\`

The database operation should be carefully designed so that the system does not create an order without its required items or decrease stock incorrectly.

This is where TypeORM's repository APIs, relations, and transaction support work together.

<b>Important architecture lesson:</b>

Do not allow the ORM to become your architecture.

TypeORM is a persistence tool.

Your application still needs clear boundaries:

\`\`\`
Controller
   |
   v
Application Service
   |
   v
Persistence
   |
   v
TypeORM
   |
   v
PostgreSQL
\`\`\`

A service should answer:

<b>"What should the application do?"</b>

A repository should answer:

<b>"How do we read or write the persistent data?"</b>

PostgreSQL should enforce:

<b>"Is this data structurally valid and are these database relationships valid?"</b>

This separation becomes especially useful when the application grows.

You may eventually replace a query, introduce caching, move to another persistence strategy, or create a separate read model.

If your entire application is tightly coupled to ORM entities everywhere, such changes become harder.

<b>Production thinking:</b>

A beginner often thinks:

\`\`\`
Entity = database
Repository = service
Service = controller
\`\`\`

That is not the right mental model.

Instead:

\`\`\`
Entity
= persistence representation

Repository
= persistence access

Service
= application/business behavior

Controller
= HTTP boundary

PostgreSQL
= persistent data + database integrity
\`\`\`

Once you understand this separation, TypeORM becomes much easier to use without allowing it to dictate the entire architecture.`,
      diagram: `HTTP
 |
 v
UsersController
 |
 v
UsersService
 |
 v
UserRepository
 |
 v
TypeORM
 |
 v
DataSource
 |
 v
PostgreSQL
 |
 +--> users
 +--> orders
 +--> products
 +--> order_items

Entity relationships:

User
 |
 +---- Order
          |
          +---- OrderItem
                    |
                    +---- Product`,
      codeExample: {
        title: "Complete NestJS + TypeORM module example",
        code: `// users/user.entity.ts

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

// users/users.module.ts

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

// users/users.service.ts

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(name: string, email: string) {
    const user = this.userRepository.create({
      name,
      email,
    });

    return this.userRepository.save(user);
  }

  async findById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
  }
}

// app.module.ts

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,

      autoLoadEntities: true,

      // Prefer migrations for production.
      synchronize: false,
    }),

    UsersModule,
  ],
})
export class AppModule {}

/*
Architecture:

AppModule
   |
   +--> TypeORM DataSource
   |
   +--> UsersModule
           |
           +--> User Entity
           |
           +--> User Repository
           |
           +--> UsersService
           |
           +--> UsersController

The service does not need to know how PostgreSQL
connections are created.

The repository handles persistence.

The entity describes the database representation.
*/`,
      },
      keyTakeaways: [
        "DataSource, entities, columns, repositories, and relations work together as a persistence layer.",
        "NestJS modules use TypeOrmModule.forFeature() to make entity repositories available.",
        "Controllers should focus on HTTP concerns.",
        "Services should coordinate application and business behavior.",
        "Repositories provide persistence operations.",
        "Entities describe how application objects map to database tables.",
        "Relations describe how those tables connect.",
        "PostgreSQL remains responsible for database-level integrity.",
        "TypeORM simplifies database access but does not remove the need to understand SQL and relational database design.",
      ],
      commonMistakes: [
        "<b>Putting repository calls throughout controllers.</b> Keep persistence access behind appropriate application services.",
        "<b>Returning entities everywhere without considering API design.</b> Database entities can contain fields that should not be exposed directly.",
        "<b>Loading large relation graphs for every endpoint.</b> Fetch only the data required by the use case.",
        "<b>Using TypeORM decorators as a replacement for database design.</b> First understand the relational model, then map it to TypeORM.",
        "<b>Forgetting TypeOrmModule.forFeature().</b> The module needs access to the repositories it injects.",
        "<b>Assuming ORM-generated queries are always optimal.</b> Inspect queries and query plans when performance matters.",
      ],
      quiz: [
        {
          question: "What does TypeOrmModule.forFeature() commonly provide?",
          options: [
            "Repositories for specified entities inside a NestJS module",
            "A React application",
            "A PostgreSQL server",
            "HTTP authentication",
          ],
          correctIndex: 0,
          explanation: "forFeature() registers the specified entities so their repositories can be injected into the module's providers.",
        },
        {
          question: "What should a controller primarily focus on?",
          options: [
            "HTTP/API concerns",
            "Database indexes",
            "PostgreSQL storage internals",
            "Connection pooling",
          ],
          correctIndex: 0,
          explanation: "Controllers are the HTTP boundary of the application.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is a TypeORM DataSource?",
      options: [
        "A React component",
        "Database configuration and connection infrastructure",
        "A DTO",
        "An HTTP route",
      ],
      correctIndex: 1,
      explanation: "The DataSource provides TypeORM with the database configuration and infrastructure required to communicate with the database.",
    },
    {
      question: "What does an entity represent?",
      options: [
        "A database table mapping",
        "Only an HTTP request",
        "A CSS class",
        "A NestJS guard",
      ],
      correctIndex: 0,
      explanation: "A TypeORM entity is a TypeScript class mapped to a database table.",
    },
    {
      question: "What does @Column() normally represent?",
      options: [
        "A database column",
        "A controller",
        "A module",
        "A database connection",
      ],
      correctIndex: 0,
      explanation: "@Column() maps an entity property to a database column.",
    },
    {
      question: "What is a repository used for?",
      options: [
        "Working with persistent records for an entity",
        "Rendering HTML",
        "Creating CSS",
        "Handling browser clicks",
      ],
      correctIndex: 0,
      explanation: "Repositories provide methods for reading and writing entity data in the database.",
    },
    {
      question: "What does repository.create() usually do?",
      options: [
        "Creates an entity object in memory",
        "Always inserts into PostgreSQL",
        "Deletes the entity",
        "Drops the table",
      ],
      correctIndex: 0,
      explanation: "create() creates an entity instance in memory. save() is normally used to persist it.",
    },
    {
      question: "Which TypeORM relation commonly represents the side containing a foreign key?",
      options: [
        "@ManyToOne",
        "@OneToMany",
        "@ManyToMany",
        "@Module",
      ],
      correctIndex: 0,
      explanation: "The many side of a typical one-to-many relationship contains the foreign key and is represented with @ManyToOne.",
    },
    {
      question: "What is commonly used to represent a many-to-many relationship in a relational database?",
      options: [
        "A junction table",
        "A controller",
        "A single comma-separated string",
        "A DTO",
      ],
      correctIndex: 0,
      explanation: "Relational databases normally represent many-to-many relationships through a junction table.",
    },
    {
      question: "Why might OrderItem be better than a direct Order-to-Product many-to-many relation?",
      options: [
        "Because OrderItem can store quantity and historical unit price",
        "Because products cannot have IDs",
        "Because PostgreSQL does not support relationships",
        "Because entities cannot have relations",
      ],
      correctIndex: 0,
      explanation: "When the relationship itself contains business information such as quantity and price, an explicit entity is usually appropriate.",
    },
    {
      question: "Why should relation loading be controlled carefully?",
      options: [
        "Loading large relation graphs can be expensive",
        "Relations cannot be queried",
        "Relations delete records",
        "Relations disable TypeScript",
      ],
      correctIndex: 0,
      explanation: "Loading unnecessary related data can create expensive queries and high memory usage.",
    },
    {
      question: "What is the N+1 query problem?",
      options: [
        "One query accidentally causes many additional queries for related data",
        "A PostgreSQL syntax error",
        "A TypeScript compiler error",
        "A database password problem",
      ],
      correctIndex: 0,
      explanation: "N+1 occurs when one query loads a collection and additional queries are then executed separately for each item.",
    },
    {
      question: "Why should synchronize be used carefully in production?",
      options: [
        "It can automatically change the database schema",
        "It prevents database connections",
        "It disables repositories",
        "It makes entities private",
      ],
      correctIndex: 0,
      explanation: "Automatic schema synchronization can make unintended production schema changes, so migrations are commonly preferred.",
    },
    {
      question: "Where should production database credentials normally be stored?",
      options: [
        "Environment or secret configuration",
        "A public frontend file",
        "A Git commit",
        "A controller name",
      ],
      correctIndex: 0,
      explanation: "Sensitive database credentials should be supplied through secure configuration or secret-management mechanisms.",
    },
    {
      question: "What is TypeOrmModule.forFeature([User]) commonly used for?",
      options: [
        "Making the User repository available for injection in a NestJS module",
        "Creating an HTTP server",
        "Starting PostgreSQL",
        "Creating a React component",
      ],
      correctIndex: 0,
      explanation: "forFeature() registers entity repositories for use within the NestJS module.",
    },
    {
      question: "Which layer should normally focus on HTTP concerns?",
      options: [
        "Controller",
        "Repository",
        "DataSource",
        "PostgreSQL",
      ],
      correctIndex: 0,
      explanation: "Controllers form the HTTP/API boundary of a NestJS application.",
    },
    {
      question: "Why should developers still understand SQL when using TypeORM?",
      options: [
        "ORMs still generate database queries and performance depends on database behavior",
        "TypeORM does not use a database",
        "SQL is required for TypeScript syntax",
        "SQL replaces NestJS controllers",
      ],
      correctIndex: 0,
      explanation: "TypeORM abstracts many database operations, but understanding SQL, indexes, joins, constraints, and query plans remains important.",
    },
  ],
  project: {
    name: "NestJS TypeORM e-commerce persistence layer",
    goal: "Build a clean NestJS persistence layer using TypeORM with a PostgreSQL database. Practice DataSource configuration, entities, columns, repositories, and real-world relationships.",
    brief: "Create the database layer for a small e-commerce application. The application should contain users, products, orders, and order items. Use TypeORM entities to map the tables, repositories for persistence operations, and relations to represent the database relationships. The project should move from simple CRUD operations into realistic relation loading and query design.",
    steps: [
      "Install and configure TypeORM and the PostgreSQL driver for the NestJS application.",
      "Create a TypeORM DataSource through TypeOrmModule.forRoot().",
      "Move database credentials into environment variables.",
      "Create a User entity with an ID, name, email, active status, and timestamps.",
      "Create a Product entity with an ID, name, SKU, price, stock quantity, active status, and timestamps.",
      "Create an Order entity with an ID, user relationship, total, and created timestamp.",
      "Create an OrderItem entity with an ID, order relationship, product relationship, quantity, and unit price.",
      "Use appropriate TypeORM column types instead of relying blindly on TypeScript inference.",
      "Make user email unique.",
      "Make product SKU unique.",
      "Make required relationships non-nullable.",
      "Configure the User-to-Order relationship as one-to-many/many-to-one.",
      "Configure the Order-to-OrderItem relationship as one-to-many/many-to-one.",
      "Configure the Product-to-OrderItem relationship as one-to-many/many-to-one.",
      "Use JoinColumn intentionally on the owning sides of relationships.",
      "Create a UsersModule and register the User entity with TypeOrmModule.forFeature().",
      "Inject Repository<User> into UsersService.",
      "Implement createUser().",
      "Implement findUserById().",
      "Implement findUserByEmail().",
      "Implement updateUser().",
      "Implement deactivateUser().",
      "Create a ProductsModule and Product repository.",
      "Implement createProduct().",
      "Implement findProductBySku().",
      "Implement a product search method with filtering and ordering.",
      "Create an OrdersModule and Order repository.",
      "Implement a method that retrieves an order with its user and order items.",
      "Load the product associated with each order item.",
      "Create an endpoint that returns a user's recent orders.",
      "Avoid loading every possible relation for every endpoint.",
      "Use QueryBuilder for at least one query involving multiple joins.",
      "Inspect the SQL generated by a complex query.",
      "Create a migration-based workflow instead of relying on synchronize for production configuration.",
      "Test what happens when a duplicate email is inserted.",
      "Test what happens when a duplicate SKU is inserted.",
      "Test what happens when an order references a missing user.",
      "Test what happens when an order item references a missing product.",
      "Add pagination to a product or order listing endpoint.",
      "Document which queries require indexes based on the actual access patterns.",
    ],
    acceptance: [
      "The NestJS application successfully connects to PostgreSQL through TypeORM.",
      "Database configuration is not hard-coded into production source code.",
      "A User entity is correctly mapped to a users table.",
      "A Product entity is correctly mapped to a products table.",
      "An Order entity is correctly mapped to an orders table.",
      "An OrderItem entity is correctly mapped to an order_items table.",
      "Entity columns use deliberate database types.",
      "User email uniqueness is enforced.",
      "Product SKU uniqueness is enforced.",
      "User-to-order relationships work correctly.",
      "Order-to-order-item relationships work correctly.",
      "Product-to-order-item relationships work correctly.",
      "Repositories are injected through NestJS TypeORM integration.",
      "CRUD operations are implemented through repositories.",
      "At least one complex query uses QueryBuilder.",
      "Relation loading is intentional rather than loading every relation everywhere.",
      "The application does not create N+1 queries for its main order retrieval endpoint.",
      "The database schema is managed with migrations for the production-style setup.",
      "The application handles missing records with appropriate NestJS exceptions.",
      "The project separates controller, service, and persistence responsibilities clearly.",
    ],
    stretch: [
      "Add a Category entity and create a Product-to-Category relationship.",
      "Implement a many-to-many Product/Category relationship with an explicit junction entity.",
      "Add an Address entity with a one-to-one or one-to-many relationship to User based on the business requirement.",
      "Create an OrderStatus history entity so every order status transition is recorded.",
      "Add soft deletion to products and study how TypeORM handles soft-deleted entities.",
      "Create database indexes based on actual product and order query patterns.",
      "Use QueryBuilder to build an order search endpoint with filters for user, status, date range, and minimum total.",
      "Add pagination using cursor-based or keyset pagination for a large order history.",
      "Add a transaction around order creation, order item creation, and inventory updates.",
      "Implement pessimistic or appropriate row-level locking for a high-concurrency inventory scenario.",
      "Measure the difference between loading relations through find options and using a carefully designed QueryBuilder.",
      "Create integration tests that run against a real PostgreSQL test database.",
      "Introduce a separate response DTO so database entities are not returned directly from every API endpoint.",
      "Add an audit log entity and record important changes to orders and products.",
      "Create a repository abstraction around one part of the persistence layer and evaluate whether the abstraction improves the architecture rather than adding unnecessary complexity.",
    ],
  },
};
