import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_28_LESSONS: LessonDay = {
  day: 28,
  title: "Entity Relationships",
  totalMinutes: 120,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "relationship-fundamentals",
      title: "Understanding Entity Relationships",
      durationMinutes: 16,
      explanation: `Entity relationships describe how records in one database table are connected to records in another table.

If you are building a real application, you almost never have only one table. An e-commerce application might have users, products, orders, order items, addresses, payments, and reviews. These tables are useful individually, but the real power comes from connecting them.

For example, imagine a customer named Sarah.

Sarah can have multiple orders. Each order belongs to Sarah. That is a <b>one-to-many</b> relationship from User to Order.

An order can contain multiple products, and a product can appear in many different orders. That is a <b>many-to-many</b> relationship between Order and Product. In practice, you usually do not connect those tables directly. You introduce an intermediate table such as OrderItem.

A relationship therefore answers a very practical question:

<b>"Which records are connected to this record, and how many records can be connected?"</b>

There are four relationship types you will use repeatedly:

- <b>One-to-one:</b> one record is connected to one record.
- <b>One-to-many:</b> one record can be connected to many records.
- <b>Many-to-one:</b> many records can belong to one record.
- <b>Many-to-many:</b> many records can be connected to many records.

The direction is important.

If one User has many Orders, then from the User's point of view the relationship is one-to-many. From the Order's point of view, it is many-to-one because many orders belong to one user.

This sounds simple, but understanding this direction becomes extremely important when you start writing TypeORM decorators.

<b>Beginner real-world example:</b>

Imagine a school.

One student has one locker. If every student receives exactly one locker and every locker belongs to exactly one student, you have one-to-one.

One teacher can teach many students. Each student may belong to one teacher for a particular class. That is one-to-many from Teacher to Student.

<b>Intermediate real-world example:</b>

Consider an online store.

One customer can place many orders:

User
  |
  +-- Order #1001
  +-- Order #1002
  +-- Order #1003

Each order belongs to one customer.

<b>Advanced real-world example:</b>

Consider a social media application.

A user can follow many users, and a user can be followed by many users. This is many-to-many, but it is also a self-referencing relationship because the User entity relates back to itself.

The database might represent this using:

\`\`\`
user            user_followers
----            --------------
id              follower_id
name            following_id
\`\`\`

Understanding relationships at this level helps you design database structures instead of simply adding decorators until TypeORM stops showing errors.`,
      diagram: `USER
  |
  | one user
  |
  +--------------------+
  |                    |
  v                    v
ORDER #1             ORDER #2
  |                    |
  | many               | many
  v                    v
ORDER ITEMS          ORDER ITEMS

Common relationship types:

One-to-one:
A ---------------- B

One-to-many:
A ---------------- B
|                    |
+---- B              +---- B
+---- B
+---- B

Many-to-one:
B ----+
B ----+----> A
B ----+

Many-to-many:

A ----+        +---- B
A ----+--------+---- B
A ----+        +---- B

Usually represented internally
using a join table.`,
      codeExample: {
        title: "Basic relationship model",
        code: `import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}`,
      },
      keyTakeaways: [
        "Entity relationships describe how database records connect to each other.",
        "One-to-one means one record connects to one record.",
        "One-to-many means one record can connect to multiple records.",
        "Many-to-one means multiple records can belong to one record.",
        "Many-to-many means multiple records can connect to multiple records.",
        "The same relationship can be described differently depending on which side you are looking from.",
        "TypeORM uses decorators to describe relationships in entity classes.",
      ],
      commonMistakes: [
        "<b>Thinking one-to-many and many-to-one are two completely different database relationships.</b> They are two perspectives of the same relationship.",
        "<b>Creating many-to-many relationships everywhere.</b> Many-to-many is powerful, but an intermediate entity is often better when the relationship itself contains information.",
        "<b>Ignoring the database structure.</b> TypeORM decorators do not remove the need to understand tables, foreign keys, and constraints.",
        "<b>Assuming an array automatically creates a relationship.</b> The relationship decorator and database metadata are what tell TypeORM how entities are connected.",
      ],
      quiz: [
        {
          question: "What does a relationship describe?",
          options: [
            "Only the appearance of a table",
            "How records in entities are connected",
            "How JavaScript arrays work",
            "How HTTP requests are cached",
          ],
          correctIndex: 1,
          explanation: "Relationships describe connections between records in database tables.",
        },
        {
          question: "If one customer can have many orders, what is the relationship from Customer to Order?",
          options: [
            "One-to-one",
            "One-to-many",
            "Many-to-one",
            "Many-to-many",
          ],
          correctIndex: 1,
          explanation: "One customer can be associated with multiple orders.",
        },
      ],
    },
    {
      id: "one-to-one",
      title: "One-to-One Relationships",
      durationMinutes: 17,
      explanation: `A one-to-one relationship means that one record in one entity is associated with exactly one record in another entity.

A simple example is a User and UserProfile.

The User table might contain authentication and account information:

\`\`\`
User
----
id
email
passwordHash
\`\`\`

The UserProfile table might contain information that is not required for authentication:

\`\`\`
UserProfile
-----------
id
firstName
lastName
avatarUrl
bio
\`\`\`

One user has one profile, and one profile belongs to one user.

In TypeORM, one side is usually marked with \`@OneToOne()\`. The side that owns the relationship normally uses \`@JoinColumn()\`.

This is important because a relationship needs to eventually be represented in the database.

For example, the database might contain:

\`\`\`
user            user_profile
----            ------------
id              id
email           firstName
                lastName
                userId
\`\`\`

Here, \`userId\` is the foreign key.

<b>Beginner real-world example:</b>

A company has employees and employee profiles.

Each employee has one profile containing their biography, profile picture, and department information.

<b>Intermediate real-world example:</b>

An e-commerce system may separate User and CustomerSettings.

User contains:

- email
- password hash
- account status

CustomerSettings contains:

- preferred currency
- language
- marketing preferences
- notification preferences

The separation prevents the main User entity from becoming a giant table containing unrelated settings.

<b>Advanced real-world example:</b>

A payment platform might have:

User
PaymentCustomer

A user can have one PaymentCustomer record representing the external payment-provider customer identity.

The PaymentCustomer entity might contain:

- providerCustomerId
- billingEmail
- defaultCurrency
- createdAt

This separation can make integrations easier because authentication data and external billing data have different responsibilities.

One important warning: one-to-one does not automatically mean that both records must always exist.

You might have a User before a UserProfile is created. Therefore, your application must decide whether the profile is mandatory or optional.

Another important consideration is database uniqueness. If \`userId\` in the profile table is not unique, the database could technically contain multiple profiles pointing to the same user. That would no longer enforce the intended one-to-one rule.

Therefore, a true one-to-one relationship usually requires a unique constraint on the foreign key.`,
      diagram: `USER
+-----------+
| id        |
| email     |
+-----------+
      |
      | one
      |
      v
USER_PROFILE
+----------------+
| id             |
| userId         |
| firstName      |
| avatarUrl      |
+----------------+

userId -> users.id

The userId should be unique
when the relationship is truly one-to-one.`,
      codeExample: {
        title: "Basic to advanced one-to-one relationship",
        code: `import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;
}

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  avatarUrl: string | null;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;
}

// Database idea:
//
// users
// -----
// id | email
//
// user_profile
// -----------
// id | firstName | avatarUrl | userId
//
// userId is the foreign key pointing to users.id.`,
      },
      keyTakeaways: [
        "One-to-one connects one record to one record.",
        "The owning side commonly uses `@JoinColumn()`.",
        "The foreign key must be uniquely constrained when the relationship must truly be one-to-one.",
        "User and UserProfile are a common real-world one-to-one design.",
        "Separating profile or settings data can keep an entity focused.",
        "One-to-one does not automatically mean both records must always exist.",
      ],
      commonMistakes: [
        "<b>Forgetting `@JoinColumn()` on the owning side.</b> TypeORM needs to know which side stores the relationship column.",
        "<b>Calling a relationship one-to-one without enforcing uniqueness.</b> A foreign key without uniqueness can allow multiple related records.",
        "<b>Putting every User field into UserProfile.</b> Separate entities should have clear responsibilities.",
        "<b>Assuming the profile always exists.</b> Decide explicitly whether the relationship is required or optional.",
      ],
      quiz: [
        {
          question: "Which decorator is commonly used on the owning side of a one-to-one relationship?",
          options: [
            "@JoinColumn",
            "@IndexOnly",
            "@Database",
            "@ForeignTable",
          ],
          correctIndex: 0,
          explanation: "@JoinColumn identifies the side that stores the relationship column.",
        },
        {
          question: "Why should the foreign key be unique for a true one-to-one relationship?",
          options: [
            "To make JavaScript faster",
            "To prevent multiple records from pointing to the same related record",
            "To disable foreign keys",
            "To create an HTTP route",
          ],
          correctIndex: 1,
          explanation: "Uniqueness prevents multiple profiles from belonging to the same user.",
        },
      ],
    },
    {
      id: "one-to-many-many-to-one",
      title: "One-to-Many and Many-to-One Relationships",
      durationMinutes: 19,
      explanation: `One-to-many is one of the most common relationships in real applications.

Consider an online store.

One User can create many Orders.

The relationship from User to Order is:

<b>User -> One-to-Many -> Orders</b>

But each Order belongs to one User.

The relationship from Order to User is:

<b>Order -> Many-to-One -> User</b>

These are two sides of the same relationship.

In TypeORM, you commonly write:

\`@OneToMany()\` on the parent entity.

\`@ManyToOne()\` on the child entity.

The important database detail is that the foreign key normally lives on the many side.

For example:

\`\`\`
users          orders
-----          ------
id             id
name           total
               userId
\`\`\`

There is no need to store an array of order IDs inside the User row.

Instead, every order stores its owner's user ID.

This is how relational databases are designed to represent this relationship.

<b>Beginner real-world example:</b>

A teacher has many students.

Teacher:

id = 1

Students:

teacherId = 1
teacherId = 1
teacherId = 1

The teacher is the "one" side, while students are the "many" side.

<b>Intermediate real-world example:</b>

An e-commerce application:

User
  |
  +-- Order #1001
  +-- Order #1002
  +-- Order #1003

The User entity can expose an \`orders\` collection, while each Order contains the relationship back to its User.

<b>Advanced real-world example:</b>

A logistics application might have:

Company
Warehouse
Shipment

One company can have many warehouses.

One warehouse can have many shipments.

One shipment belongs to one warehouse.

This gives you a relationship chain:

Company
  |
  +-- Warehouse A
  |      |
  |      +-- Shipment 1
  |      +-- Shipment 2
  |
  +-- Warehouse B
         |
         +-- Shipment 3

These relationships let you query business data such as:

"Show me all shipments from warehouses belonging to this company."

However, there is an important performance consideration. Loading a large relationship collection can become expensive.

Imagine a marketplace seller has 2 million orders. You should not automatically load every order whenever you load the seller.

Instead, use pagination and targeted queries.

The relationship describes the connection. It does not mean you should always retrieve the entire connected dataset.`,
      diagram: `USER
+--------+
| id     |
| name   |
+--------+
    |
    | 1
    |
    |-------------------+
    |                   |
    v                   v
ORDER               ORDER
+--------+          +--------+
| id     |          | id     |
| userId |          | userId |
| total  |          | total  |
+--------+          +--------+

Database rule:

orders.userId -> users.id

The foreign key lives on the
MANY side.`,
      codeExample: {
        title: "One-to-many with orders",
        code: `import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal")
  total: number;

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}

// Conceptual database:
//
// users
// -----
// id | name
//
// orders
// ------
// id | total | user_id
//
// user_id references users.id.`,
      },
      keyTakeaways: [
        "One-to-many and many-to-one describe opposite sides of the same relationship.",
        "The foreign key normally belongs on the many side.",
        "A User can have many Orders while each Order belongs to one User.",
        "Use `@OneToMany()` for the collection side.",
        "Use `@ManyToOne()` for the foreign-key side.",
        "Do not assume relationships should always be eagerly loaded.",
        "Large relationship collections should normally be paginated or queried selectively.",
      ],
      commonMistakes: [
        "<b>Putting the foreign key on the one side.</b> In a normal one-to-many design, the many-side table stores the foreign key.",
        "<b>Thinking `@OneToMany()` alone creates the complete database relationship.</b> The many-to-one side is normally the owning side.",
        "<b>Loading thousands or millions of related records automatically.</b> Use pagination and targeted queries.",
        "<b>Confusing the direction.</b> User-to-Order is one-to-many, while Order-to-User is many-to-one.",
      ],
      quiz: [
        {
          question: "Where does the foreign key normally live in a one-to-many relationship?",
          options: [
            "On the one side",
            "On the many side",
            "In a completely unrelated table",
            "Only in application memory",
          ],
          correctIndex: 1,
          explanation: "The many-side records usually store the foreign key pointing to the one-side record.",
        },
        {
          question: "What relationship does Order have toward User when many orders belong to one user?",
          options: [
            "One-to-one",
            "One-to-many",
            "Many-to-one",
            "Many-to-many",
          ],
          correctIndex: 2,
          explanation: "Each order belongs to one user, while many orders can belong to that user.",
        },
      ],
    },
    {
      id: "many-to-many",
      title: "Many-to-Many Relationships",
      durationMinutes: 18,
      explanation: `A many-to-many relationship exists when multiple records on both sides can be connected to multiple records on the other side.

A classic example is students and courses.

One student can enroll in many courses.

One course can have many students.

Therefore:

Student <-> Course

is many-to-many.

A relational database normally does not store this relationship by placing a list inside a column.

Instead, it creates an intermediate table called a <b>join table</b>.

For example:

\`\`\`
students        courses         student_courses
--------        -------         ---------------
id              id              student_id
name            title           course_id
\`\`\`

The join table contains one row for each connection.

If Alice takes Mathematics and Physics:

\`\`\`
student_courses
---------------
student_id | course_id
-----------|----------
1          | 10
1          | 20
\`\`\`

If Bob also takes Mathematics:

\`\`\`
student_courses
---------------
student_id | course_id
-----------|----------
1          | 10
1          | 20
2          | 10
\`\`\`

This is extremely useful because the relationship itself can be represented independently.

<b>Beginner real-world example:</b>

Students and courses.

A student can take multiple courses, and a course can have multiple students.

<b>Intermediate real-world example:</b>

Products and Categories.

A product might belong to:

- Electronics
- Computers
- Gaming

And the Gaming category might contain hundreds of products.

Therefore Product and Category can be many-to-many.

<b>Advanced real-world example:</b>

Consider an e-commerce Order and Product relationship.

At first glance:

Order <-> Product

looks like many-to-many.

But real systems usually need additional information about the relationship:

- quantity
- unit price
- discount
- tax
- product name snapshot
- SKU snapshot

That means a direct many-to-many relation is often not enough.

Instead, create an OrderItem entity:

Order
  |
  +-- OrderItem
  |      |
  |      +-- Product
  |
  +-- OrderItem
         |
         +-- Product

Now OrderItem represents the relationship itself.

This is an important architectural lesson:

<b>If the relationship has its own data, model the relationship as an entity.</b>

For example, "Alice is enrolled in JavaScript" may later need:

- enrollment date
- completion date
- grade
- status

At that point, StudentCourse should probably become an entity rather than a simple anonymous join table.`,
      diagram: `STUDENT
+---------+
| id      |
| name    |
+---------+
    |
    |
    v
STUDENT_COURSE
+----------------+
| student_id     |
| course_id      |
+----------------+
    ^
    |
    |
COURSE
+---------+
| id      |
| title   |
+---------+

One student -> many join rows
One course -> many join rows

Therefore:

STUDENT <----> COURSE

is many-to-many.`,
      codeExample: {
        title: "Basic many-to-many relationship",
        code: `import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Course, (course) => course.students)
  @JoinTable()
  courses: Course[];
}

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Student, (student) => student.courses)
  students: Student[];
}

// TypeORM can create a join table similar to:
//
// student_courses
// --------------
// student_id
// course_id`,
      },
      keyTakeaways: [
        "Many-to-many means many records can connect to many records.",
        "Relational databases normally represent many-to-many relationships with a join table.",
        "`@JoinTable()` is used on the owning side of a TypeORM many-to-many relationship.",
        "The join table contains foreign keys connecting both entities.",
        "If the relationship needs additional business data, consider creating a dedicated entity.",
        "Order and Product is often better represented through OrderItem than a simple many-to-many decorator.",
      ],
      commonMistakes: [
        "<b>Trying to store an array of IDs in one database column.</b> Relational databases normally use a join table for many-to-many relationships.",
        "<b>Putting `@JoinTable()` on both sides.</b> Usually one side owns the relationship and defines the join table.",
        "<b>Using a simple many-to-many relation when the relationship has important data.</b> Use an intermediate entity such as OrderItem.",
        "<b>Ignoring duplicate connections.</b> The join table should have appropriate keys or constraints to prevent accidental duplicate relationships.",
      ],
      quiz: [
        {
          question: "How is a many-to-many relationship normally represented in a relational database?",
          options: [
            "By storing arrays in one column",
            "By using a join table",
            "By removing foreign keys",
            "By using JSON only",
          ],
          correctIndex: 1,
          explanation: "A join table stores the connections between the two entities.",
        },
        {
          question: "When should a many-to-many relationship often become its own entity?",
          options: [
            "When the relationship has additional business data",
            "When both tables have IDs",
            "When using TypeScript",
            "When the application has a frontend",
          ],
          correctIndex: 0,
          explanation: "Relationship-specific fields such as quantity, status, or enrollment date belong naturally on an intermediate entity.",
        },
      ],
    },
    {
      id: "join-tables",
      title: "Join Tables and Relationship Entities",
      durationMinutes: 17,
      explanation: `A join table is the database structure that connects two entities in a many-to-many relationship.

There are two important ways to work with join tables.

The first is a simple automatic join table.

This is appropriate when the relationship only needs to say:

"These two records are connected."

For example:

Product <-> Category

You may only need:

product_id
category_id

There is no additional information about the connection.

The second approach is to create an explicit entity.

This is appropriate when the connection itself contains information.

Consider an online store.

An Order contains Products.

But the relationship contains important data:

OrderItem
- id
- orderId
- productId
- quantity
- unitPrice
- discount

Now the relationship is no longer just:

Order <-> Product

It becomes:

Order -> OrderItem -> Product

This is often a much better model for business applications.

<b>Beginner real-world example:</b>

Movie and Genre.

A movie can belong to multiple genres, and a genre can contain multiple movies.

A simple join table is enough:

movie_genres
------------
movie_id
genre_id

<b>Intermediate real-world example:</b>

Team and User.

A user can belong to many teams, and a team can contain many users.

But suppose you need to store the user's role:

team_members
------------
team_id
user_id
role

Now the relationship has data.

<b>Advanced real-world example:</b>

Order and Product.

OrderItem can contain:

- quantity
- unit price
- discount
- tax
- product SKU
- product name snapshot

The product's current price may change tomorrow, but an old order must continue showing the price that the customer actually paid.

Therefore storing the historical unit price on OrderItem is important.

This is a major real-world database design concept: <b>current entity data and historical transaction data are not always the same thing.</b>

For example, suppose a product currently costs $100.

Customer buys it for $80 during a promotion.

Later, the product price becomes $120.

The old OrderItem should still say:

unitPrice = 80

It should not calculate the historical order total from the Product's current price.

That is why transaction relationships often become explicit entities.`,
      diagram: `Simple many-to-many:

PRODUCT
   |
   v
PRODUCT_CATEGORY
   ^
   |
CATEGORY


Relationship with business data:

ORDER
   |
   v
ORDER_ITEM
   |
   v
PRODUCT

ORDER_ITEM
+----------------+
| id             |
| order_id       |
| product_id     |
| quantity       |
| unit_price     |
| discount       |
+----------------+

The relationship itself now
contains important business data.`,
      codeExample: {
        title: "Advanced relationship entity with OrderItem",
        code: `import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column("decimal")
  unitPrice: number;

  @Column("decimal", {
    default: 0,
  })
  discount: number;

  @ManyToOne(() => Order, (order) => order.items, {
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

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("decimal")
  currentPrice: number;
}

// OrderItem preserves the price that was actually
// used when the order was created.`,
      },
      keyTakeaways: [
        "A simple join table is useful when the relationship only represents a connection.",
        "An explicit relationship entity is better when the relationship contains business data.",
        "OrderItem is a classic example of an explicit relationship entity.",
        "Historical transaction values should often be stored on the transaction entity instead of recalculated from current product data.",
        "Relationship entities can contain their own primary key, foreign keys, timestamps, statuses, and business fields.",
      ],
      commonMistakes: [
        "<b>Using current Product.price to calculate old orders.</b> Historical transactions should preserve the values relevant at transaction time.",
        "<b>Adding dozens of fields to an automatic join table.</b> If the relationship becomes important, make it an explicit entity.",
        "<b>Assuming every many-to-many relationship needs a custom entity.</b> Simple connections can still use a normal join table.",
        "<b>Ignoring the lifecycle of relationship records.</b> Decide whether relationship records should be deleted, retained, or archived.",
      ],
      quiz: [
        {
          question: "Why might OrderItem be better than a direct Order-Product many-to-many relationship?",
          options: [
            "OrderItem can store quantity and historical price",
            "Products cannot have IDs",
            "TypeORM cannot use foreign keys",
            "Orders cannot contain products",
          ],
          correctIndex: 0,
          explanation: "OrderItem represents the relationship and stores important transaction-specific information.",
        },
        {
          question: "Why should an old order not simply use the product's current price?",
          options: [
            "The product might have changed price after the order",
            "PostgreSQL cannot store prices",
            "TypeORM deletes prices automatically",
            "Foreign keys prevent price changes",
          ],
          correctIndex: 0,
          explanation: "Historical transactions need to preserve the values that applied when the transaction occurred.",
        },
      ],
    },
    {
      id: "cascades",
      title: "Cascades and Relationship Lifecycle",
      durationMinutes: 18,
      explanation: `Cascades control what TypeORM does with related entities when an entity is inserted, updated, or removed.

The word "cascade" sounds simple, but it can become dangerous if used without understanding the consequences.

Imagine:

User
  |
  +-- Profile

If you configure cascading insert operations, saving a User with a new Profile can also save the Profile.

That can be convenient.

But deletion is much more sensitive.

Imagine:

Order
  |
  +-- OrderItem
  +-- OrderItem
  +-- OrderItem

If an Order is deleted, you may want its OrderItems to disappear because they have no meaning without the order.

That is a reasonable place for cascade deletion.

But consider:

OrderItem
   |
   v
Product

You generally do not want deleting an OrderItem to delete the Product.

The product exists independently and may be referenced by thousands of other orders.

Therefore, cascade behavior must reflect business ownership.

<b>Beginner real-world example:</b>

A blog post has comments.

If a post is permanently deleted, you may want its comments deleted too.

Post
  |
  +-- Comment
  +-- Comment
  +-- Comment

The comments belong to the post.

<b>Intermediate real-world example:</b>

An order has order items.

Deleting an order may delete its order items.

But deleting an order item must not delete the product.

Order
  |
  +-- OrderItem ---> Product
  +-- OrderItem ---> Product

The Order owns the OrderItems conceptually, while Product exists independently.

<b>Advanced real-world example:</b>

A financial system should be extremely careful with cascade deletion.

Suppose:

Customer
  |
  +-- Invoice
         |
         +-- InvoiceItem

Deleting a customer should not necessarily physically delete financial records. Regulations, accounting requirements, audits, and business rules may require historical records to remain.

In such systems, you might use:

- soft deletes
- status fields
- archival
- restricted deletion
- explicit administrative workflows

instead of blindly cascading deletes.

There is also an important difference between TypeORM's application-level cascade behavior and database-level foreign-key actions such as \`ON DELETE CASCADE\`.

TypeORM's \`cascade\` option controls ORM operations.

Database \`onDelete\` controls what the database does when a referenced row is deleted.

They solve related but different problems.

For example:

\`cascade: true\`

can allow related entities to be persisted automatically.

While:

\`onDelete: "CASCADE"\`

defines database behavior when the referenced row is deleted.

You should choose these settings deliberately instead of enabling every cascade option globally.`,
      diagram: `SAFE OWNERSHIP EXAMPLE

ORDER
  |
  | owns
  v
ORDER_ITEM
  |
  | references
  v
PRODUCT

Delete Order
     |
     v
Delete OrderItems
     |
     X
Do NOT delete Product

Because Product may be used
by many other orders.

Financial example:

CUSTOMER
   |
   v
INVOICE
   |
   v
INVOICE_ITEM

Deleting Customer may need to be
restricted or replaced with
soft deletion rather than physical
cascade deletion.`,
      codeExample: {
        title: "Controlled cascade behavior",
        code: `import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ["insert", "update"],
  })
  items: OrderItem[];
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.items, {
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

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

// Important idea:
//
// Deleting Order
// -> database can delete OrderItems
//
// Deleting OrderItem
// -> Product remains
//
// Saving an Order can cascade insert/update
// operations to its items.`,
      },
      keyTakeaways: [
        "Cascades define how related entity operations can propagate.",
        "Cascade behavior should be based on business ownership.",
        "Order -> OrderItem is a common candidate for controlled cascading.",
        "OrderItem -> Product usually should not cascade deletion to Product.",
        "`cascade` and `onDelete` are related concepts but operate at different levels.",
        "Financial and audit records often require restricted deletion, soft deletion, or archival instead of physical cascade deletion.",
        "Avoid blindly using `cascade: true` everywhere.",
      ],
      commonMistakes: [
        "<b>Using `cascade: true` everywhere.</b> This can cause unexpected inserts, updates, or deletes.",
        "<b>Confusing `cascade` with `onDelete`.</b> They control different parts of relationship behavior.",
        "<b>Cascading from OrderItem to Product.</b> A product is usually shared by many orders and should survive an order-item deletion.",
        "<b>Physically deleting financial records.</b> Real financial systems often need historical records for auditing and compliance.",
        "<b>Testing only the happy path.</b> Test deletion, partial failures, orphan records, and rollback behavior too.",
      ],
      quiz: [
        {
          question: "Why is cascading deletion from OrderItem to Product usually dangerous?",
          options: [
            "A product may be referenced by many other orders",
            "Products cannot have names",
            "TypeORM does not support products",
            "OrderItem cannot have a foreign key",
          ],
          correctIndex: 0,
          explanation: "Products are shared records and normally should not be deleted because one order item was removed.",
        },
        {
          question: "What does `onDelete: \"CASCADE\"` describe?",
          options: [
            "Database foreign-key deletion behavior",
            "React component rendering",
            "HTTP middleware behavior",
            "TypeScript compilation",
          ],
          correctIndex: 0,
          explanation: "It tells the database what should happen to related rows when the referenced row is deleted.",
        },
      ],
    },
    {
      id: "advanced-relationship-design",
      title: "Advanced Relationship Design in a Real Application",
      durationMinutes: 15,
      explanation: `Once you understand individual relationship types, the next step is learning how they work together inside a real application.

Consider an e-commerce system with these entities:

User
Product
Category
Order
OrderItem
Payment
Address

Now map the relationships.

A User can have many Orders.

A User can have one Profile.

A Product can belong to many Categories.

A Category can contain many Products.

An Order has many OrderItems.

Each OrderItem belongs to one Order.

Each OrderItem references one Product.

A User can have many Addresses.

An Order can reference one shipping Address.

A Payment belongs to one Order.

This creates a connected graph rather than a collection of isolated entities.

The important design skill is deciding which relationships represent ownership, which represent references, and which represent historical snapshots.

<b>Beginner real-world flow:</b>

A customer creates an account.

User
  |
  v
Profile

The customer then purchases products.

User
  |
  v
Order
  |
  v
OrderItem
  |
  v
Product

<b>Intermediate flow:</b>

Products belong to categories.

Product <-> Category

Orders contain multiple items.

Order -> OrderItem -> Product

A product's current information remains in Product, while purchase-time information remains in OrderItem.

<b>Advanced flow:</b>

Suppose a customer checks out using a saved address.

The application may have:

User
  |
  +-- Address
  |
  +-- Order
         |
         +-- OrderItem
         |
         +-- Payment

But there is a subtle issue.

What happens if the user changes their address tomorrow?

Should yesterday's order suddenly display tomorrow's address?

Usually, no.

Therefore, an order may need to store a shipping-address snapshot.

For example:

Order
- id
- shippingName
- shippingStreet
- shippingCity
- shippingPostalCode

This is not necessarily a normal relationship to the user's current Address. It is historical transaction data.

This illustrates a very important rule:

<b>Relationships should represent business meaning, not just technical convenience.</b>

Just because two records can be connected does not mean they should always be connected dynamically.

Another advanced consideration is query performance.

If a dashboard needs:

User
-> Orders
-> OrderItems
-> Products

you should not automatically load every nested relationship.

Instead, request exactly the data required by the use case.

For large applications, relationship design and query design must be considered together.

A technically correct relationship can still produce poor application performance if it causes huge joins, excessive queries, or unnecessary data loading.`,
      diagram: `REAL E-COMMERCE MODEL

USER
 |
 +---- PROFILE                 (1:1)
 |
 +---- ORDERS                  (1:N)
 |       |
 |       +---- ORDER_ITEMS     (1:N)
 |               |
 |               +---- PRODUCT (N:1)
 |
 +---- ADDRESSES               (1:N)

PRODUCT <--------------> CATEGORY
           (N:M)

ORDER ---- PAYMENT
   (N:1 or 1:1 depending on business rules)

Important distinction:

Current Product data
        vs
Historical OrderItem data

Current Address
        vs
Historical shipping address

Relationships should represent
business meaning, not just
technical connections.`,
      codeExample: {
        title: "Putting several relationship types together",
        code: `@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ["insert", "update"],
  })
  items: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @Column()
  shippingName: string;

  @Column()
  shippingStreet: string;

  @Column()
  shippingCity: string;
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: "CASCADE",
  })
  order: Order;

  @ManyToOne(() => Product, {
    onDelete: "RESTRICT",
  })
  product: Product;

  @Column()
  quantity: number;

  @Column("decimal")
  unitPrice: number;
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}`,
      },
      keyTakeaways: [
        "Real applications usually contain several relationship types at the same time.",
        "One-to-one, one-to-many, many-to-one, and many-to-many relationships can form a connected domain model.",
        "Transaction entities often need historical snapshots instead of relying entirely on current related records.",
        "Relationship design should reflect business meaning.",
        "Correct relationships still require thoughtful query design for performance.",
        "Ownership, references, historical data, and lifecycle behavior should all be considered together.",
      ],
      commonMistakes: [
        "<b>Connecting everything directly.</b> Some relationships should be represented through explicit entities or snapshots.",
        "<b>Using current mutable data for historical records.</b> Orders, invoices, and payments often need their own historical values.",
        "<b>Loading the entire relationship graph.</b> Fetch only the data needed for the operation.",
        "<b>Designing entities without considering deletion rules.</b> Relationship ownership and lifecycle should be decided together.",
      ],
      quiz: [
        {
          question: "Why might an Order store a shipping address snapshot?",
          options: [
            "Because a user's current address may change later",
            "Because PostgreSQL cannot store addresses",
            "Because TypeORM cannot create relationships",
            "Because foreign keys cannot exist",
          ],
          correctIndex: 0,
          explanation: "Historical orders often need to preserve the address used when the order was placed.",
        },
        {
          question: "What should relationship design primarily represent?",
          options: [
            "Only TypeScript syntax",
            "Business meaning and data ownership",
            "Only frontend requirements",
            "Only table names",
          ],
          correctIndex: 1,
          explanation: "A useful relationship model reflects how the business actually connects and owns data.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which relationship means one record can have many related records?",
      options: [
        "One-to-one",
        "One-to-many",
        "Many-to-many only",
        "No relationship",
      ],
      correctIndex: 1,
      explanation: "One-to-many means one record can be associated with multiple records.",
    },
    {
      question: "Where does the foreign key normally live in a one-to-many relationship?",
      options: [
        "On the one side",
        "On the many side",
        "Only in application memory",
        "In a React component",
      ],
      correctIndex: 1,
      explanation: "The many-side table normally stores the foreign key pointing to the one-side table.",
    },
    {
      question: "What decorator commonly marks the owning side of a one-to-one relationship?",
      options: [
        "@JoinColumn",
        "@JoinTable",
        "@ForeignKeyOnly",
        "@RelationOwner",
      ],
      correctIndex: 0,
      explanation: "@JoinColumn identifies the side that stores the relationship column.",
    },
    {
      question: "How is a many-to-many relationship commonly represented in a relational database?",
      options: [
        "An array stored in one normal column",
        "A join table",
        "A JavaScript Map",
        "A database view only",
      ],
      correctIndex: 1,
      explanation: "A join table stores the connections between records from both entities.",
    },
    {
      question: "When should a many-to-many relationship often become an explicit entity?",
      options: [
        "When the relationship contains business information",
        "When both entities have IDs",
        "When TypeScript is enabled",
        "When the application has CSS",
      ],
      correctIndex: 0,
      explanation: "Fields such as quantity, role, status, or enrollment date belong naturally on a relationship entity.",
    },
    {
      question: "Why is OrderItem useful in an e-commerce application?",
      options: [
        "It can store relationship-specific information such as quantity and purchase price",
        "It removes all foreign keys",
        "It prevents products from having prices",
        "It replaces the database",
      ],
      correctIndex: 0,
      explanation: "OrderItem represents the relationship between an order and product while storing transaction-specific values.",
    },
    {
      question: "What is a common reason to use `onDelete: \"CASCADE\"` for OrderItems?",
      options: [
        "OrderItems have no meaning after their owning order is deleted",
        "Products should always be deleted",
        "Users should always be deleted",
        "It creates a many-to-many relationship",
      ],
      correctIndex: 0,
      explanation: "OrderItems are commonly dependent on their order and can be removed when the order is removed.",
    },
    {
      question: "Why should deleting an OrderItem normally not delete its Product?",
      options: [
        "The Product may be referenced by many other orders",
        "Products cannot be deleted",
        "TypeORM does not support Product entities",
        "OrderItem cannot reference Product",
      ],
      correctIndex: 0,
      explanation: "Products usually exist independently of individual order items.",
    },
    {
      question: "What is the difference between `cascade` and `onDelete`?",
      options: [
        "They are exactly the same setting",
        "Cascade controls ORM-related propagation while onDelete defines database foreign-key deletion behavior",
        "Cascade is for PostgreSQL only and onDelete is for React",
        "Both only control indexes",
      ],
      correctIndex: 1,
      explanation: "They operate at related but different levels of the persistence system.",
    },
    {
      question: "Why might an Order store shipping address values instead of always reading the current User address?",
      options: [
        "The user's address may change after the order is placed",
        "Orders cannot have relationships",
        "PostgreSQL cannot store addresses",
        "TypeORM deletes addresses automatically",
      ],
      correctIndex: 0,
      explanation: "Historical transaction data often needs to preserve the values that existed when the transaction occurred.",
    },
  ],
  project: {
    name: "E-commerce Entity Relationship System",
    goal: "Design and implement a realistic NestJS and TypeORM relationship model using one-to-one, one-to-many, many-to-one, many-to-many, join tables, and controlled cascade behavior.",
    brief: "Build the database entity layer for a small e-commerce application. The system should contain users, profiles, addresses, products, categories, orders, order items, and payments. The goal is not just to add TypeORM decorators, but to model how the business data is actually connected and how those records should behave throughout their lifecycle.",
    steps: [
      "Create a User entity with a unique email and generated primary key.",
      "Create a UserProfile entity and model User-to-UserProfile as one-to-one.",
      "Decide which side owns the one-to-one relationship and configure `@JoinColumn()` correctly.",
      "Create an Address entity and model User-to-Address as one-to-many and Address-to-User as many-to-one.",
      "Create Product and Category entities.",
      "Model Product-to-Category as many-to-many using a join table.",
      "Create an Order entity belonging to a User.",
      "Create an OrderItem entity instead of using a direct Order-to-Product many-to-many relationship.",
      "Connect OrderItem to Order with many-to-one and Order to OrderItem with one-to-many.",
      "Connect OrderItem to Product with many-to-one.",
      "Store quantity and purchase-time unit price on OrderItem.",
      "Add a Payment entity and decide whether the business rule should be one-to-one or one-to-many with Order.",
      "Add appropriate `nullable` settings to required relationships.",
      "Configure controlled cascade behavior for Order and OrderItem.",
      "Prevent deletion of a Product when existing OrderItems reference it.",
      "Decide how historical shipping address data should be represented.",
      "Add timestamps where they make sense for orders, payments, and relationship entities.",
      "Test creating a user with a profile.",
      "Test creating a user with multiple addresses.",
      "Test creating an order with multiple order items.",
      "Test assigning products to categories.",
      "Test deleting an order and verify the intended OrderItem behavior.",
      "Test deleting an OrderItem and verify that the Product remains.",
      "Test changing a Product's current price and verify that old OrderItems retain their historical purchase price.",
      "Write queries that load only the relationships needed for specific application use cases instead of loading the entire entity graph.",
    ],
    acceptance: [
      "The application contains User, UserProfile, Address, Product, Category, Order, OrderItem, and Payment entities.",
      "At least one one-to-one relationship is implemented correctly.",
      "At least one one-to-many and many-to-one relationship pair is implemented correctly.",
      "A many-to-many relationship is implemented using a join table.",
      "OrderItem is modeled as an explicit relationship entity between Order and Product.",
      "OrderItem stores transaction-specific quantity and unit price.",
      "The relationship foreign keys are created in the correct tables.",
      "The owning sides of relationships are configured correctly.",
      "Cascade behavior is limited to relationships where it makes business sense.",
      "Deleting an Order does not accidentally delete Products.",
      "Deleting an OrderItem does not accidentally delete Products.",
      "Historical order information does not depend on mutable current Product information.",
      "Required relationships are protected using appropriate nullability and database constraints.",
      "The developer can explain why each relationship is one-to-one, one-to-many, many-to-one, or many-to-many.",
    ],
    stretch: [
      "Create an explicit OrderStatusHistory entity that records every order status change.",
      "Create a ProductCategory entity instead of an automatic join table and add fields such as `displayOrder`.",
      "Add a Team-style relationship where Users can have multiple roles across different organizations.",
      "Implement a self-referencing User relationship for followers or referrals.",
      "Add soft deletion to users and products and explain why physical cascade deletion would be dangerous.",
      "Create database indexes for frequently queried foreign keys and relationship columns.",
      "Use TypeORM QueryBuilder to retrieve an order with only the product fields needed by an API response.",
      "Add transaction handling for checkout so the Order, OrderItems, and Payment-related records are created consistently.",
      "Write integration tests that verify relationship creation, deletion behavior, and constraint violations.",
      "Analyze a query plan for a large Order-to-OrderItem-to-Product query and identify where indexing could improve performance.",
    ],
  },
};
