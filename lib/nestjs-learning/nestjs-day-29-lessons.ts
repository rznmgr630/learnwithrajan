import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_29_LESSONS: LessonDay = {
  day: 29,
  title: "Repository Pattern",
  totalMinutes: 125,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "repository-fundamentals",
      title: "What is a Repository?",
      durationMinutes: 18,
      explanation: `A repository is the part of your application that is responsible for communicating with the database for a particular entity or group of related database operations.

If you are new to backend development, think of a repository as a <b>database assistant</b>.

Suppose your application has a User entity.

Your service should be responsible for business decisions such as:

- Can this user register?
- Is this email already in use?
- Should this account be activated?
- Can this user place an order?

The service should not need to know every detail about how SQL is written.

Instead, the service can ask a UserRepository:

"Find the user with this email."

The repository handles the database operation.

This creates a useful separation:

Controller
   |
   v
Service
   |
   v
Repository
   |
   v
Database

Each layer has a different responsibility.

<b>Beginner real-world example:</b>

Imagine a library.

A customer asks the librarian:

"Find me all books written by this author."

The customer does not walk into the storage room and search shelves manually.

The librarian performs the lookup.

In the application:

Service = librarian
Repository = database lookup specialist
Database = storage room

The service asks the repository for the information it needs.

<b>Basic example:</b>

A UserService might do this:

\`userRepository.findOneBy({ email })\`

The service does not need to know the SQL statement.

<b>Intermediate real-world example:</b>

Imagine an e-commerce application.

The ProductService might need to find products that are:

- active
- in stock
- below a certain price
- belonging to a category

Instead of placing all database logic inside ProductService, a repository can provide methods specifically designed for those queries.

For example:

\`productRepository.findAvailableProducts(categoryId)\`

Now the service is focused on the business use case, while the repository is focused on retrieving the correct records.

<b>Advanced real-world example:</b>

Suppose an analytics dashboard needs:

- today's revenue
- number of completed orders
- top-selling products
- average order value

These are not simple CRUD lookups.

The repository can use QueryBuilder and database aggregation to retrieve the required data.

The service can then combine the results into the business response.

The repository pattern becomes especially useful as an application grows because database queries tend to become more complicated over time.

Without a repository boundary, you can end up with services containing hundreds of lines of database queries.

A healthy architecture tries to make the responsibilities obvious.

<b>Service:</b>

"Business process: create an order."

<b>Repository:</b>

"Database operation: find the product rows required by this order."

<b>Controller:</b>

"HTTP operation: receive the request and return the response."

This separation does not mean every single database call needs its own class. The goal is to keep responsibilities understandable and maintainable.`,
      diagram: `HTTP REQUEST
     |
     v
+------------+
| Controller |
+------------+
     |
     | calls
     v
+------------+
|  Service   |
+------------+
     |
     | asks for data
     v
+------------+
| Repository |
+------------+
     |
     | SQL / ORM
     v
+------------+
| PostgreSQL |
+------------+

Controller:
HTTP concerns

Service:
Business rules

Repository:
Database concerns`,
      codeExample: {
        title: "Basic repository usage in a service",
        code: `import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findAll() {
    return this.userRepository.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  async createUser(name: string, email: string) {
    const user = this.userRepository.create({
      name,
      email,
    });

    return this.userRepository.save(user);
  }
}`,
      },
      keyTakeaways: [
        "A repository provides a boundary between application logic and database operations.",
        "Repositories commonly work with one entity or a related group of database operations.",
        "Services should focus on business rules rather than raw database details.",
        "TypeORM provides a `Repository<Entity>` abstraction for common database operations.",
        "Repositories become especially useful when database queries become more complex.",
        "A repository is not just a naming convention; it is a way to organize database responsibilities.",
      ],
      commonMistakes: [
        "<b>Putting business rules inside the repository.</b> A repository should primarily handle persistence and querying, while business decisions usually belong in services.",
        "<b>Putting every SQL query directly in controllers.</b> Controllers should handle HTTP concerns, not database implementation details.",
        "<b>Creating a repository for every single function.</b> Group related persistence operations logically.",
        "<b>Thinking repositories eliminate SQL knowledge.</b> Complex applications still require understanding SQL, indexes, joins, transactions, and query performance.",
      ],
      quiz: [
        {
          question: "What is the main responsibility of a repository?",
          options: [
            "Handling HTTP authentication headers",
            "Communicating with the database",
            "Rendering frontend components",
            "Sending emails directly",
          ],
          correctIndex: 1,
          explanation: "Repositories provide an abstraction around database persistence and querying.",
        },
        {
          question: "Which layer should normally contain business rules?",
          options: [
            "Controller",
            "Service",
            "Database driver",
            "Repository only",
          ],
          correctIndex: 1,
          explanation: "Services commonly coordinate business rules and use repositories to access data.",
        },
      ],
    },
    {
      id: "typeorm-repository-methods",
      title: "Repository Methods: Basic CRUD to Practical Queries",
      durationMinutes: 18,
      explanation: `TypeORM's Repository class provides many methods for working with entities.

The most important beginner methods include:

- \`create()\`
- \`save()\`
- \`find()\`
- \`findOne()\`
- \`findOneBy()\`
- \`findBy()\`
- \`update()\`
- \`delete()\`
- \`remove()\`
- \`count()\`
- \`exists()\`

Understanding what each method does is more important than memorizing every method.

\`create()\` creates an entity object in memory. It does not necessarily insert anything into the database.

\`save()\` persists an entity.

\`find()\` retrieves multiple records.

\`findOneBy()\` retrieves one record matching the supplied conditions.

\`update()\` performs a direct update operation.

\`delete()\` performs a direct delete operation.

\`remove()\` removes an entity instance.

This distinction becomes important in real applications.

<b>Beginner real-world example:</b>

A registration form sends:

name = Sarah
email = sarah@example.com

The service might:

1. Check whether the email exists.
2. Create a User entity.
3. Save the entity.

<b>Intermediate real-world example:</b>

An admin dashboard needs all inactive users.

You might use:

\`findBy({ isActive: false })\`

Then sort or paginate the results.

<b>Advanced real-world example:</b>

A background job needs to disable accounts that have not logged in for 365 days.

A simple implementation might load every user and update them one by one.

That can be inefficient for a large database.

Instead, you may use a direct update query:

\`update({ lastLoginAt: LessThan(cutoff) }, { isActive: false })\`

This allows the database to perform the bulk operation without transferring every row into application memory.

The key lesson is that repository methods are not interchangeable.

Choose the method based on what you actually need.

If you need an entity and its lifecycle hooks, loading and saving the entity may be appropriate.

If you need a large bulk update and do not need entity instances, a direct update can be much more efficient.

<b>Real-world performance example:</b>

Imagine 5 million users.

This is potentially expensive:

1. Load 5 million users.
2. Loop through them in Node.js.
3. Change each object.
4. Save each object.

A database-side update can often be dramatically more appropriate.

This is why repository knowledge is not just about syntax. It is about understanding where the work should happen.`,
      diagram: `Repository methods

create()
   |
   v
Entity object in memory
   |
   | save()
   v
Database

find() / findBy()
   |
   v
Multiple entities

findOneBy()
   |
   v
One entity

update()
   |
   v
Database-side update

delete()
   |
   v
Database-side delete

remove()
   |
   v
Entity-based removal`,
      codeExample: {
        title: "Practical repository methods",
        code: `import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findActiveUsers() {
    return this.userRepository.findBy({
      isActive: true,
    });
  }

  async findUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async createUser(name: string, email: string) {
    const user = this.userRepository.create({
      name,
      email,
      isActive: true,
    });

    return this.userRepository.save(user);
  }

  async deactivateInactiveUsers(cutoff: Date) {
    return this.userRepository.update(
      {
        lastLoginAt: LessThan(cutoff),
      },
      {
        isActive: false,
      },
    );
  }

  async deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }
}`,
      },
      keyTakeaways: [
        "`create()` prepares an entity object in memory.",
        "`save()` persists an entity.",
        "`find()` and `findBy()` retrieve multiple records.",
        "`findOneBy()` retrieves one matching record.",
        "`update()` can perform efficient database-side updates.",
        "`delete()` performs a direct delete operation.",
        "Choosing between entity-based operations and direct database operations can affect performance and behavior.",
      ],
      commonMistakes: [
        "<b>Thinking `create()` inserts into the database.</b> It creates an entity instance; persistence normally happens with `save()`.",
        "<b>Loading millions of rows just to update them.</b> Consider a database-side update for large bulk operations.",
        "<b>Using `delete()` when business rules require entity lifecycle behavior.</b> Understand the difference between direct database operations and entity removal.",
        "<b>Ignoring indexes on frequently queried fields.</b> Repository syntax cannot compensate for poorly indexed database access patterns.",
      ],
      quiz: [
        {
          question: "What does `repository.create()` normally do?",
          options: [
            "Creates an entity object without automatically persisting it",
            "Always inserts a database row",
            "Deletes an entity",
            "Creates a PostgreSQL database",
          ],
          correctIndex: 0,
          explanation: "`create()` prepares an entity instance; `save()` is commonly used to persist it.",
        },
        {
          question: "Why might `update()` be preferable for a large bulk update?",
          options: [
            "It can perform the update without loading every entity into Node.js",
            "It disables the database",
            "It automatically creates an API",
            "It only works for one row",
          ],
          correctIndex: 0,
          explanation: "Direct update operations can let the database perform bulk changes efficiently.",
        },
      ],
    },
    {
      id: "custom-repositories",
      title: "Custom Repositories for Domain-Specific Queries",
      durationMinutes: 19,
      explanation: `A standard TypeORM Repository already gives you many useful operations. But real applications eventually need queries that are specific to your domain.

For example, a ProductService might need:

- find products currently available
- find products by category
- find products below a price
- find products with low inventory
- find products that should appear in search results

You could put all of these queries directly inside ProductService.

But as the application grows, the service becomes a mixture of business logic and database implementation.

A custom repository or repository-like data-access class can group these queries together.

The important idea is:

<b>Standard repository methods handle generic persistence. Custom repository methods express application-specific database queries.</b>

<b>Beginner example:</b>

Instead of writing this repeatedly:

\`productRepository.find({ where: { isActive: true } })\`

you can create a method such as:

\`findActiveProducts()\`

The method gives the operation a meaningful name.

<b>Intermediate real-world example:</b>

An e-commerce application might need:

\`findProductsForCategory(categoryId)\`

The repository knows which joins and filters are necessary.

The service simply asks:

"Give me the products for this category."

<b>Advanced real-world example:</b>

A marketplace may have a complex "available products" rule:

A product must:

- be active
- not be deleted
- have inventory greater than zero
- belong to an active seller
- have an approved status
- satisfy a visibility rule

The query might require multiple joins and conditions.

That complexity belongs much more naturally in the data-access layer than in a controller.

However, do not turn custom repositories into a second service layer.

A repository should answer questions about persistence and retrieval.

For example:

Good repository method:

\`findAvailableProductsForSeller(sellerId)\`

Potentially problematic repository method:

\`decideWhetherSellerCanReceivePayout(sellerId)\`

The second method sounds like a business decision rather than a database query.

A better architecture might be:

PayoutService
   |
   +--> SellerRepository
   |
   +--> OrderRepository
   |
   +--> PaymentRepository

The service makes the decision after obtaining the required information.

This keeps the database layer focused on data access.

<b>Advanced design consideration:</b>

A repository method should ideally have a clear contract.

Instead of exposing dozens of low-level query details, create methods that describe what the application actually needs.

For example:

\`findPendingOrdersForPaymentProcessing()\`

is often more meaningful than forcing every service to understand:

- status conditions
- joins
- payment relationships
- ordering
- database-specific filtering

The repository becomes a reusable data-access boundary.`,
      diagram: `ProductService
      |
      | asks
      v
ProductRepository
      |
      +--> findActiveProducts()
      |
      +--> findByCategory()
      |
      +--> findLowStockProducts()
      |
      +--> findProductsForSearch()
      |
      v
   Database

Service:
"Why do we need these products?"

Repository:
"How do I retrieve them?"`,
      codeExample: {
        title: "Custom repository-style data access class",
        code: `import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  LessThan,
  Repository,
} from "typeorm";
import { Product } from "./product.entity";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findActiveProducts() {
    return this.repository.find({
      where: {
        isActive: true,
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async findLowStockProducts(threshold: number) {
    return this.repository.find({
      where: {
        isActive: true,
        stock: LessThan(threshold),
      },
    });
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async save(product: Product) {
    return this.repository.save(product);
  }
}

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async getLowStockProducts() {
    return this.productRepository.findLowStockProducts(10);
  }
}`,
      },
      keyTakeaways: [
        "Custom repositories group domain-specific database operations.",
        "Generic CRUD operations can remain with TypeORM's standard Repository.",
        "Custom methods should describe useful data-access operations.",
        "Services should coordinate business decisions rather than contain every SQL detail.",
        "Repositories should not become a second business-service layer.",
        "A clear repository contract makes database operations easier to reuse and test.",
      ],
      commonMistakes: [
        "<b>Putting business decisions inside repositories.</b> Repositories should primarily answer data-access questions.",
        "<b>Creating custom methods for trivial built-in operations.</b> Do not wrap every `findOneBy()` just to rename it.",
        "<b>Making repositories enormous.</b> Split data access by domain or responsibility when complexity grows.",
        "<b>Returning database-specific implementation details everywhere.</b> Keep repository contracts understandable to the service layer.",
      ],
      quiz: [
        {
          question: "What is a good reason to create a custom repository method?",
          options: [
            "To group a reusable domain-specific database query",
            "To replace all services",
            "To handle HTTP status codes",
            "To render frontend HTML",
          ],
          correctIndex: 0,
          explanation: "Custom repository methods are useful for meaningful and reusable persistence queries.",
        },
        {
          question: "Which method better fits a repository?",
          options: [
            "findPendingOrdersForPaymentProcessing()",
            "decideWhetherTheBusinessShouldRefundCustomer()",
            "renderCheckoutPage()",
            "sendPasswordResetEmail()",
          ],
          correctIndex: 0,
          explanation: "Finding records is a data-access responsibility, while business decisions and side effects usually belong elsewhere.",
        },
      ],
    },
    {
      id: "querybuilder-basics",
      title: "QueryBuilder: When Repository Methods Are Not Enough",
      durationMinutes: 20,
      explanation: `TypeORM's standard repository methods are excellent for straightforward queries. But eventually you will need queries involving joins, grouping, aggregation, conditional expressions, subqueries, or more precise SQL behavior.

This is where QueryBuilder becomes useful.

QueryBuilder lets you construct SQL-like queries using TypeORM's API.

For example, suppose you need:

"Find all active orders belonging to a customer and include their order items and products."

A simple repository call may not express the query cleanly.

QueryBuilder lets you build the query step by step.

<b>Beginner example:</b>

Find active products:

\`where("product.isActive = :isActive", { isActive: true })\`

<b>Intermediate real-world example:</b>

Find orders for a user and join their items:

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

You can use \`leftJoinAndSelect()\` to retrieve the related data.

<b>Advanced real-world example:</b>

A dashboard wants:

- total revenue
- number of completed orders
- average order value

This requires SQL aggregation.

You might use:

\`SUM()\`
\`COUNT()\`
\`AVG()\`
\`GROUP BY\`

QueryBuilder becomes useful because the query is no longer a simple entity lookup.

Another major benefit is parameter binding.

Instead of building SQL like:

\`WHERE email = '\${email}'\`

you use:

\`WHERE user.email = :email\`

with:

\`{ email }\`

This lets TypeORM safely bind the parameter instead of manually concatenating values into SQL.

<b>Important real-world example:</b>

Never construct SQL by directly concatenating user input.

Bad idea:

\`where("user.email = '" + email + "'")\`

Better:

\`where("user.email = :email", { email })\`

The second approach uses parameters.

QueryBuilder is powerful, but power should not become an excuse to write every query with it.

If:

\`findOneBy({ id })\`

solves the problem, use the simpler method.

Use QueryBuilder when the query actually requires its capabilities.`,
      diagram: `Simple query:

Repository.findOneBy()
        |
        v
Simple database lookup


Complex query:

Repository
    |
    v
QueryBuilder
    |
    +--> JOIN
    +--> WHERE
    +--> GROUP BY
    +--> ORDER BY
    +--> COUNT
    +--> SUM
    +--> AVG
    +--> parameters
    |
    v
PostgreSQL`,
      codeExample: {
        title: "QueryBuilder from basic to advanced",
        code: `import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  async findOrdersForUser(userId: number) {
    return this.repository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.items", "item")
      .leftJoinAndSelect("item.product", "product")
      .where("order.user_id = :userId", { userId })
      .orderBy("order.created_at", "DESC")
      .getMany();
  }

  async getRevenueForUser(userId: number) {
    const result = await this.repository
      .createQueryBuilder("order")
      .select("SUM(order.total)", "revenue")
      .addSelect("COUNT(order.id)", "orderCount")
      .addSelect("AVG(order.total)", "averageOrderValue")
      .where("order.user_id = :userId", { userId })
      .andWhere("order.status = :status", {
        status: "completed",
      })
      .getRawOne();

    return {
      revenue: Number(result.revenue ?? 0),
      orderCount: Number(result.orderCount ?? 0),
      averageOrderValue: Number(
        result.averageOrderValue ?? 0,
      ),
    };
  }
}`,
      },
      keyTakeaways: [
        "QueryBuilder is useful for complex database queries.",
        "Use joins when related data must be retrieved together.",
        "Use aggregation functions such as `SUM`, `COUNT`, and `AVG` for reporting queries.",
        "Use named parameters instead of concatenating user input into SQL.",
        "Do not use QueryBuilder for every query; simpler repository methods are often easier to read.",
        "Complex queries should remain inside the data-access boundary rather than spreading SQL details throughout services.",
      ],
      commonMistakes: [
        "<b>Concatenating user input into SQL.</b> Use QueryBuilder parameters.",
        "<b>Using QueryBuilder for simple lookups.</b> A simple repository method is often clearer.",
        "<b>Loading huge joined datasets without thinking about cardinality.</b> Joins can multiply result sizes.",
        "<b>Forgetting that raw aggregation results may be strings.</b> Convert values to appropriate application types when necessary.",
        "<b>Assuming QueryBuilder automatically makes every query fast.</b> Query performance still depends on indexes, joins, data volume, and database execution plans.",
      ],
      quiz: [
        {
          question: "When is QueryBuilder particularly useful?",
          options: [
            "For complex joins and aggregations",
            "Only for creating TypeScript interfaces",
            "Only for HTTP requests",
            "Only for CSS styling",
          ],
          correctIndex: 0,
          explanation: "QueryBuilder is useful when queries require capabilities beyond simple repository methods.",
        },
        {
          question: "How should user input normally be passed into QueryBuilder conditions?",
          options: [
            "By string concatenation",
            "Using named parameters",
            "By disabling SQL validation",
            "By putting input directly into table names",
          ],
          correctIndex: 1,
          explanation: "Parameters avoid unsafe string concatenation and let the database driver bind values appropriately.",
        },
      ],
    },
    {
      id: "repository-service-boundary",
      title: "Repository vs Service: Where Should Code Live?",
      durationMinutes: 18,
      explanation: `One of the most important repository concepts is knowing where a piece of code belongs.

A common beginner mistake is putting everything into one service.

For example:

UsersService might contain:

- SQL queries
- password hashing
- email sending
- validation
- authorization
- business rules
- transaction handling
- response formatting

It may work initially, but the service becomes difficult to understand and test.

A better approach is to give each layer a clear responsibility.

<b>Controller:</b>

Receives HTTP requests and returns HTTP responses.

<b>Service:</b>

Coordinates business rules and application workflows.

<b>Repository:</b>

Reads and writes persistent data.

For example, consider creating an order.

The controller receives:

POST /orders

with:

{
  "items": [...]
}

The service might perform:

1. Validate the customer's account.
2. Retrieve the requested products.
3. Check inventory.
4. Calculate the order total.
5. Create the order.
6. Create order items.
7. Reserve inventory.
8. Start payment processing.
9. Return the result.

The repository handles database operations required by those steps.

For example:

OrderRepository:
- create order
- find orders
- update order status

ProductRepository:
- find products
- find inventory
- update stock

The service coordinates the workflow.

<b>Beginner real-world example:</b>

"Get user by ID."

Controller:
Receives GET /users/10.

Service:
Calls user repository.

Repository:
Queries database.

<b>Intermediate real-world example:</b>

"Register a user."

Controller:
Receives registration request.

Service:
- validates business rules
- checks duplicate account
- hashes password
- creates account
- triggers required side effects

Repository:
- checks for existing user
- persists user

<b>Advanced real-world example:</b>

"Checkout."

This is much more than a CRUD operation.

Checkout may involve:

User
Product
Inventory
Order
OrderItem
Payment
Notification

The CheckoutService should coordinate the process.

It should not contain raw SQL for every table.

Instead:

CheckoutService
   |
   +--> UserRepository
   +--> ProductRepository
   +--> InventoryRepository
   +--> OrderRepository
   +--> PaymentRepository

This makes the business workflow visible.

A very useful rule is:

<b>If the code answers "How do I store or retrieve this data?", it probably belongs near the repository.</b>

<b>If the code answers "What should the application do?", it probably belongs in the service.</b>

There are exceptions, especially in large systems, but this rule is an excellent starting point.

Another important distinction is validation.

Database validation and business validation are not identical.

For example:

Database constraint:
email must be unique.

Business rule:
a user cannot place an order while their account is suspended.

The database can enforce the first.

The service should usually enforce the second.

This distinction keeps business rules visible and testable.`,
      diagram: `CONTROLLER
"HTTP request received"
       |
       v
SERVICE
"What should the application do?"
       |
       +----------------------+
       |          |           |
       v          v           v
 USER REPO   ORDER REPO   PRODUCT REPO
 "How do I   "How do I    "How do I
 retrieve    persist      retrieve
 this data?" this data?"  this data?"
       |          |           |
       +----------+-----------+
                  |
                  v
             DATABASE`,
      codeExample: {
        title: "Clean service and repository boundary",
        code: `import { Injectable } from "@nestjs/common";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async checkout(
    userId: number,
    productId: number,
    quantity: number,
  ) {
    const user =
      await this.usersRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("User account is inactive");
    }

    const product =
      await this.productsRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    const total = product.currentPrice * quantity;

    const order = await this.ordersRepository.createOrder({
      userId,
      total,
    });

    await this.ordersRepository.createOrderItem({
      orderId: order.id,
      productId,
      quantity,
      unitPrice: product.currentPrice,
    });

    await this.productsRepository.decreaseStock(
      productId,
      quantity,
    );

    return order;
  }
}

// Repository responsibilities:
//
// UsersRepository
// -> findById()
//
// ProductsRepository
// -> findById()
// -> decreaseStock()
//
// OrdersRepository
// -> createOrder()
// -> createOrderItem()
//
// Business workflow remains in CheckoutService.`,
      },
      keyTakeaways: [
        "Controllers should handle HTTP concerns.",
        "Services should coordinate business workflows and rules.",
        "Repositories should handle persistent data access.",
        "A service can use multiple repositories to complete one business operation.",
        "Database constraints and business rules are not the same thing.",
        "A useful rule is: repositories answer 'how do I access data?' while services answer 'what should the application do?'",
      ],
      commonMistakes: [
        "<b>Putting business rules into repositories.</b> Repositories should not become hidden services.",
        "<b>Putting SQL queries directly into controllers.</b> This makes HTTP and persistence concerns tightly coupled.",
        "<b>Making one giant service.</b> Separate persistence responsibilities and business workflows.",
        "<b>Assuming every validation belongs in the service.</b> Some invariants are better enforced at the database level as constraints.",
        "<b>Creating unnecessary abstractions.</b> The architecture should make the code clearer, not simply add more files.",
      ],
      quiz: [
        {
          question: "Which question best describes a repository responsibility?",
          options: [
            "How should the business handle a suspended account?",
            "How should the HTTP response be formatted?",
            "How do I retrieve this record from the database?",
            "Should the customer receive a promotional email?",
          ],
          correctIndex: 2,
          explanation: "Repository code should focus primarily on persistence and data access.",
        },
        {
          question: "Which question best describes a service responsibility?",
          options: [
            "What should the application do for this business operation?",
            "How does PostgreSQL scan the index?",
            "How should a SQL JOIN be written?",
            "Which database driver should execute the query?",
          ],
          correctIndex: 0,
          explanation: "Services commonly coordinate business rules and workflows.",
        },
      ],
    },
    {
      id: "advanced-repository-pattern",
      title: "Advanced Repository Architecture and Real-World Design",
      durationMinutes: 19,
      explanation: `As an application grows, repository design becomes less about syntax and more about architecture.

A small application may have:

UserService
  |
  v
Repository<User>

That can be enough.

A larger application may have:

UsersService
   |
   +--> UsersRepository

OrdersService
   |
   +--> OrdersRepository

PaymentsService
   |
   +--> PaymentsRepository

NotificationsService
   |
   +--> NotificationsRepository

Each repository represents a persistence boundary.

But advanced applications introduce additional concerns.

<b>1. Transactions</b>

Suppose checkout performs:

1. Create Order.
2. Create OrderItem.
3. Reduce inventory.
4. Create Payment record.

If step 3 fails after step 1 and 2 succeed, you may end up with an incomplete order.

A transaction can make these operations atomic.

The important architectural question becomes:

"Which layer owns the transaction?"

For a business workflow such as checkout, the service often coordinates the transaction because the transaction spans multiple repositories.

<b>2. Pagination</b>

A repository should not casually return 500,000 rows.

Instead, expose pagination:

\`findProducts({ page, limit })\`

The repository translates that into database pagination.

<b>3. Filtering</b>

A product search might support:

- category
- minimum price
- maximum price
- availability
- search text
- seller
- sorting

The repository can translate these filters into efficient database conditions.

<b>4. Reporting</b>

Reporting repositories may not return complete entities.

For example:

\`getDailyRevenue()\`

might return:

{
  date: "2026-09-30",
  revenue: 12500,
  orderCount: 183
}

This is not necessarily a Product or Order entity.

That is completely acceptable.

A repository can return a purpose-specific read model when the query is designed for reporting.

<b>5. Read vs write operations</b>

Large systems sometimes separate read-oriented queries from write-oriented operations.

For example:

OrderRepository
- create
- updateStatus
- findById

OrderReportingRepository
- getDailyRevenue
- getTopProducts
- getCustomerStatistics

This can keep complex reporting queries from making the transactional repository difficult to understand.

<b>6. Avoiding leaky abstractions</b>

A repository abstraction should not pretend the database has capabilities that it does not actually have.

If a query genuinely requires PostgreSQL-specific behavior, it is often better to express that explicitly than to create a fake generic abstraction that hides important database behavior.

<b>Advanced real-world scenario:</b>

Imagine a marketplace processing 100,000 orders per hour.

Checkout requires:

- inventory validation
- order creation
- item creation
- inventory reservation
- payment state
- audit record

A simplistic repository abstraction is not enough.

You need:

- transactions
- proper indexes
- concurrency control
- careful locking where required
- efficient queries
- pagination
- observability
- retry strategies
- clear ownership boundaries

The repository pattern is not a replacement for database engineering.

It is an organizational tool that helps keep database responsibilities in a predictable location.

The final goal is not "more repositories."

The goal is:

<b>Business logic remains understandable while database logic remains organized, reusable, testable, and performant.</b>`,
      diagram: `LARGE APPLICATION

              CheckoutService
                    |
        +-----------+-----------+
        |           |           |
        v           v           v
   UserRepo    ProductRepo   OrderRepo
        |           |           |
        +-----------+-----------+
                    |
                 Database

Reporting path:

AnalyticsService
       |
       v
OrderReportingRepository
       |
       +--> SUM()
       +--> COUNT()
       +--> GROUP BY
       +--> date filtering
       |
       v
   PostgreSQL

Transaction boundary:

CheckoutService
       |
       v
  Transaction
       |
       +--> OrderRepository
       +--> InventoryRepository
       +--> PaymentRepository
       |
       v
 COMMIT / ROLLBACK`,
      codeExample: {
        title: "Advanced repository with filtering and pagination",
        code: `export interface ProductSearchOptions {
  page: number;
  limit: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  onlyAvailable?: boolean;
}

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async search(options: ProductSearchOptions) {
    const {
      page,
      limit,
      categoryId,
      minPrice,
      maxPrice,
      search,
      onlyAvailable,
    } = options;

    const query = this.repository
      .createQueryBuilder("product")
      .leftJoinAndSelect(
        "product.categories",
        "category",
      );

    if (categoryId) {
      query.andWhere(
        "category.id = :categoryId",
        { categoryId },
      );
    }

    if (minPrice !== undefined) {
      query.andWhere(
        "product.currentPrice >= :minPrice",
        { minPrice },
      );
    }

    if (maxPrice !== undefined) {
      query.andWhere(
        "product.currentPrice <= :maxPrice",
        { maxPrice },
      );
    }

    if (search) {
      query.andWhere(
        "product.name ILIKE :search",
        { search: \`%\${search}%\` },
      );
    }

    if (onlyAvailable) {
      query.andWhere(
        "product.stock > 0",
      );
    }

    const skip = (page - 1) * limit;

    const [items, total] = await query
      .orderBy("product.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}`,
      },
      keyTakeaways: [
        "Advanced repositories may handle pagination, filtering, reporting, and complex joins.",
        "Transactions may span multiple repositories and are often coordinated by the service performing the business workflow.",
        "Repositories do not need to return complete entities for every query.",
        "Read-oriented reporting queries can have purpose-specific return shapes.",
        "Large applications may separate transactional repositories from reporting-oriented data access.",
        "Repository architecture should support clarity, testability, reuse, and database performance.",
        "The repository pattern does not replace understanding SQL, transactions, indexing, concurrency, or database behavior.",
      ],
      commonMistakes: [
        "<b>Returning every row from a large table.</b> Use pagination or targeted queries.",
        "<b>Putting reporting queries into unrelated transactional repositories.</b> Separate responsibilities when the query domain becomes large.",
        "<b>Hiding important database behavior behind a fake generic abstraction.</b> Some database-specific capabilities should remain explicit.",
        "<b>Assuming repository separation automatically improves performance.</b> Query design, indexes, joins, and execution plans still determine database performance.",
        "<b>Putting the entire transaction implementation into every repository.</b> Business workflows spanning multiple repositories usually need a higher-level transaction boundary.",
      ],
      quiz: [
        {
          question: "Why is pagination important in repository methods?",
          options: [
            "It prevents unnecessarily loading huge datasets",
            "It removes the need for indexes",
            "It disables database constraints",
            "It makes all queries asynchronous",
          ],
          correctIndex: 0,
          explanation: "Pagination limits the amount of data retrieved and transferred for large datasets.",
        },
        {
          question: "Can a repository return a reporting-specific object instead of an entity?",
          options: [
            "No, never",
            "Yes, if the query is designed around that read model",
            "Only when using MongoDB",
            "Only in frontend applications",
          ],
          correctIndex: 1,
          explanation: "Repositories can expose purpose-specific data shapes for reporting and read-heavy use cases.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the primary responsibility of a repository?",
      options: [
        "Handling HTTP requests",
        "Communicating with persistent storage",
        "Rendering UI components",
        "Managing CSS",
      ],
      correctIndex: 1,
      explanation: "Repositories provide a boundary for database persistence and querying.",
    },
    {
      question: "What does `repository.create()` normally do?",
      options: [
        "Creates an entity instance in memory",
        "Always inserts a database row",
        "Deletes an entity",
        "Creates a database",
      ],
      correctIndex: 0,
      explanation: "`create()` creates an entity object; it normally needs `save()` or another persistence operation to reach the database.",
    },
    {
      question: "Which method is useful for retrieving one entity by a simple condition?",
      options: [
        "findOneBy()",
        "createDatabase()",
        "renderOne()",
        "httpGet()",
      ],
      correctIndex: 0,
      explanation: "`findOneBy()` is designed for retrieving one matching entity.",
    },
    {
      question: "Why can `update()` be useful for large bulk operations?",
      options: [
        "It can update records without loading every entity into application memory",
        "It automatically creates a frontend",
        "It disables transactions",
        "It can only update one record",
      ],
      correctIndex: 0,
      explanation: "Direct update operations can let the database perform bulk work more efficiently.",
    },
    {
      question: "What is a good reason to create a custom repository method?",
      options: [
        "To group a reusable domain-specific database query",
        "To replace every service",
        "To handle HTTP routing",
        "To render HTML",
      ],
      correctIndex: 0,
      explanation: "Custom repository methods give meaningful names to reusable persistence operations.",
    },
    {
      question: "When is QueryBuilder especially useful?",
      options: [
        "For complex joins, filtering, and aggregation",
        "For CSS styling",
        "For TypeScript compilation",
        "For HTTP headers only",
      ],
      correctIndex: 0,
      explanation: "QueryBuilder is useful when standard repository methods are not expressive enough.",
    },
    {
      question: "How should user input normally be passed into QueryBuilder conditions?",
      options: [
        "String concatenation",
        "Named parameters",
        "Direct SQL comments",
        "Table-name interpolation",
      ],
      correctIndex: 1,
      explanation: "Named parameters allow values to be bound safely rather than concatenated into SQL.",
    },
    {
      question: "Which responsibility generally belongs in a service?",
      options: [
        "Coordinating business rules and workflows",
        "Constructing every SQL statement",
        "Creating database indexes at runtime",
        "Rendering HTML",
      ],
      correctIndex: 0,
      explanation: "Services commonly coordinate application workflows and business rules.",
    },
    {
      question: "Which responsibility generally belongs in a repository?",
      options: [
        "Determining whether a customer deserves a refund",
        "Sending an HTTP response",
        "Finding orders that match database conditions",
        "Rendering a dashboard",
      ],
      correctIndex: 2,
      explanation: "Finding records based on persistence conditions is a repository responsibility.",
    },
    {
      question: "Why should large repository queries usually support pagination?",
      options: [
        "To avoid loading unnecessarily large datasets",
        "To remove database indexes",
        "To disable foreign keys",
        "To make SQL unnecessary",
      ],
      correctIndex: 0,
      explanation: "Pagination controls how much data is retrieved and processed for large datasets.",
    },
  ],
  project: {
    name: "Repository-Based E-commerce Data Layer",
    goal: "Build a clean NestJS and TypeORM data-access architecture where repositories handle persistence and querying while services handle business workflows.",
    brief: "Create a repository-based e-commerce data layer containing users, products, orders, order items, and payments. Start with TypeORM's standard Repository, then introduce custom repository-style classes and QueryBuilder for more advanced operations. The goal is to understand not only how repositories work, but also where the repository boundary should exist in a real application.",
    steps: [
      "Create User, Product, Order, OrderItem, and Payment entities.",
      "Register the entities with TypeORM using `TypeOrmModule.forFeature()`.",
      "Inject the standard TypeORM Repository into at least one service.",
      "Implement basic `find`, `findOneBy`, `create`, and `save` operations.",
      "Implement an update operation using `update()`.",
      "Implement a delete operation and decide whether direct deletion or entity removal is appropriate.",
      "Create a dedicated UsersRepository data-access class.",
      "Move user-specific database queries out of UsersService.",
      "Create a ProductRepository with methods for active products and low-stock products.",
      "Create an OrderRepository for order-specific persistence operations.",
      "Implement a repository method that finds an order by ID with its order items and products.",
      "Implement a QueryBuilder search method for products.",
      "Add filters for category, minimum price, maximum price, search text, and stock availability.",
      "Add pagination to the product search repository method.",
      "Implement an OrderRepository reporting query that calculates total revenue and order count.",
      "Use QueryBuilder aggregation with `SUM()` and `COUNT()` for the reporting query.",
      "Use named parameters for all dynamic user-controlled values.",
      "Keep business rules such as account status checks and checkout decisions inside services.",
      "Create a CheckoutService that coordinates UserRepository, ProductRepository, and OrderRepository.",
      "Make the CheckoutService responsible for deciding whether a checkout is allowed.",
      "Keep raw database query construction inside repositories.",
      "Add a transaction boundary around checkout if the operation changes multiple related records that must succeed or fail together.",
      "Test repository methods independently from controller behavior.",
      "Test service business rules independently from low-level query implementation where practical.",
      "Inspect generated SQL or database logs while learning how repository methods translate into database operations.",
      "Test the application with realistic amounts of data rather than only three or four records.",
    ],
    acceptance: [
      "The application has a clear Controller -> Service -> Repository -> Database flow.",
      "Controllers do not contain raw TypeORM queries.",
      "Business rules remain in services rather than being hidden inside repositories.",
      "Basic CRUD operations use TypeORM Repository methods appropriately.",
      "At least one custom repository-style data-access class exists.",
      "Custom repository methods have meaningful domain-oriented names.",
      "At least one complex query uses QueryBuilder.",
      "QueryBuilder uses parameters instead of unsafe string concatenation.",
      "The product search supports multiple filters.",
      "The product search supports pagination.",
      "At least one reporting query uses database aggregation.",
      "Large data retrieval does not blindly load an unlimited number of rows.",
      "The service layer can use multiple repositories for one business workflow.",
      "Repository methods are focused on persistence and data retrieval.",
      "Service methods are focused on business workflows and decisions.",
      "The project demonstrates a clear boundary between business logic and database logic.",
    ],
    stretch: [
      "Create a separate OrderReportingRepository for analytics and reporting queries.",
      "Add cursor-based pagination for a large product or order list.",
      "Create a repository method for searching products using PostgreSQL-specific text search features.",
      "Add database indexes for the most frequently used repository filters.",
      "Compare the execution plan of an indexed query and an unindexed query.",
      "Create a repository method that returns a lightweight read model instead of a complete entity.",
      "Implement an order history query that returns only the columns required by the API response.",
      "Add optimistic or pessimistic concurrency handling for inventory updates.",
      "Wrap checkout operations across Order, OrderItem, Inventory, and Payment repositories in a transaction.",
      "Add integration tests that verify repository behavior against a real PostgreSQL database.",
      "Measure the difference between loading a large dataset into Node.js and performing a database-side bulk update.",
      "Create a reusable filter object for complex product searches.",
      "Add sorting options while preventing users from injecting arbitrary SQL column names.",
      "Introduce separate read and write data-access classes if the reporting workload becomes substantially different from transactional queries.",
      "Document why each repository method belongs in the repository rather than the service.",
    ],
  },
};
