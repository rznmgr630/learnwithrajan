import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_30_LESSONS: LessonDay = {
  day: 30,
  title: "Advanced Queries",
  totalMinutes: 145,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "querybuilder-fundamentals",
      title: "QueryBuilder: From Simple Queries to Complex Database Operations",
      durationMinutes: 20,
      explanation: `QueryBuilder is one of the most useful tools you will learn when working with TypeORM and PostgreSQL.

At the beginning of a project, repository methods such as \`find()\`, \`findOneBy()\`, and \`findBy()\` are usually enough.

For example, if you want one user by ID:

\`userRepository.findOneBy({ id })\`

That is simple and readable.

But real applications quickly become more complicated.

Imagine an e-commerce application where you need to answer this question:

"Find all active products belonging to a particular category, costing between $20 and $100, with inventory available, sort them by newest first, and return only 20 products."

Now the query needs:

- filtering
- multiple conditions
- joins
- sorting
- pagination
- parameters

This is where QueryBuilder becomes useful.

Think of QueryBuilder as a way of constructing a database query step by step.

You can start with:

\`createQueryBuilder("product")\`

Then add:

\`where()\`

Then:

\`andWhere()\`

Then:

\`leftJoinAndSelect()\`

Then:

\`orderBy()\`

Then:

\`skip()\`

Then:

\`take()\`

Finally:

\`getMany()\`

The important thing is that QueryBuilder does not mean "write random SQL."

It gives you a structured way to construct SQL through TypeORM.

<b>Beginner real-world example:</b>

A store has products.

You only want products that are currently active.

Instead of loading every product and filtering them in JavaScript, let PostgreSQL perform the filtering.

This is important because the database is designed to filter data efficiently.

<b>Intermediate real-world example:</b>

An admin dashboard wants:

"All active orders created in the last 30 days where the total is greater than $100."

The database can perform these filters before sending the records to your Node.js application.

<b>Advanced real-world example:</b>

A marketplace search page allows customers to search thousands or millions of products.

The query might include:

- search text
- category
- seller
- minimum price
- maximum price
- inventory status
- rating
- date range
- sorting
- pagination

This is exactly the type of situation where QueryBuilder becomes valuable.

The important architectural lesson is that you should not automatically use QueryBuilder for every database operation.

If this is enough:

\`findOneBy({ id })\`

then use it.

If you need a complex query with several conditions and joins, QueryBuilder can make the query explicit and maintainable.

<b>One more important idea:</b>

QueryBuilder should normally remain inside your repository or data-access layer.

The service should say:

\`productRepository.searchProducts(filters)\`

rather than constructing database queries itself.

That keeps business logic separate from database implementation.`,
      diagram: `Simple lookup:

Service
   |
   v
Repository
   |
   +--> findOneBy({ id })
   |
   v
Database


Complex lookup:

Service
   |
   v
Repository
   |
   v
QueryBuilder
   |
   +--> JOIN
   +--> WHERE
   +--> FILTER
   +--> ORDER BY
   +--> PAGINATION
   |
   v
PostgreSQL`,
      codeExample: {
        title: "Basic to advanced QueryBuilder",
        code: `import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  // BASIC
  async findActiveProducts() {
    return this.repository
      .createQueryBuilder("product")
      .where("product.isActive = :isActive", {
        isActive: true,
      })
      .getMany();
  }

  // INTERMEDIATE
  async findProductsInPriceRange(
    minPrice: number,
    maxPrice: number,
  ) {
    return this.repository
      .createQueryBuilder("product")
      .where("product.currentPrice >= :minPrice", {
        minPrice,
      })
      .andWhere("product.currentPrice <= :maxPrice", {
        maxPrice,
      })
      .getMany();
  }

  // ADVANCED
  async searchProducts(options: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    onlyAvailable?: boolean;
    page: number;
    limit: number;
  }) {
    const query = this.repository
      .createQueryBuilder("product");

    query.where("product.isActive = :isActive", {
      isActive: true,
    });

    if (options.categoryId) {
      query.andWhere(
        "product.category_id = :categoryId",
        {
          categoryId: options.categoryId,
        },
      );
    }

    if (options.minPrice !== undefined) {
      query.andWhere(
        "product.currentPrice >= :minPrice",
        {
          minPrice: options.minPrice,
        },
      );
    }

    if (options.maxPrice !== undefined) {
      query.andWhere(
        "product.currentPrice <= :maxPrice",
        {
          maxPrice: options.maxPrice,
        },
      );
    }

    if (options.search) {
      query.andWhere(
        "product.name ILIKE :search",
        {
          search: \`%\${options.search}%\`,
        },
      );
    }

    if (options.onlyAvailable) {
      query.andWhere(
        "product.stock > 0",
      );
    }

    const skip =
      (options.page - 1) * options.limit;

    query
      .orderBy("product.createdAt", "DESC")
      .skip(skip)
      .take(options.limit);

    return query.getMany();
  }
}`,
      },
      keyTakeaways: [
        "QueryBuilder is useful when queries become more complex than standard repository methods can comfortably express.",
        "QueryBuilder allows you to build a query step by step.",
        "Use `where()` for the initial condition and `andWhere()` or `orWhere()` for additional conditions.",
        "Use parameters instead of concatenating user input into SQL strings.",
        "Keep QueryBuilder logic inside the repository or data-access layer.",
        "Do not use QueryBuilder for simple operations that are easier to express with repository methods.",
      ],
      commonMistakes: [
        "<b>Using QueryBuilder for every query.</b> Simple queries are often clearer with `findOneBy()` or `findBy()`.",
        "<b>Putting QueryBuilder code inside controllers.</b> Database construction belongs in the repository/data-access layer.",
        "<b>Building conditions with string concatenation.</b> Use named parameters.",
        "<b>Forgetting pagination.</b> A search endpoint should not accidentally return hundreds of thousands of rows.",
      ],
      quiz: [
        {
          question: "When is QueryBuilder most useful?",
          options: [
            "For complex queries involving multiple conditions and relationships",
            "Only for creating entities",
            "Only for deleting databases",
            "Only for frontend rendering",
          ],
          correctIndex: 0,
          explanation: "QueryBuilder is especially useful for complex database queries that require joins, filtering, sorting, aggregation, or other advanced SQL features.",
        },
        {
          question: "Where should complex QueryBuilder logic normally live?",
          options: [
            "Controller",
            "Repository or data-access layer",
            "React component",
            "DTO only",
          ],
          correctIndex: 1,
          explanation: "Keeping query construction in the repository keeps database concerns separate from HTTP and business logic.",
        },
      ],
    },
    {
      id: "joins",
      title: "Joins: Connecting Related Tables",
      durationMinutes: 20,
      explanation: `A join allows a database query to combine information from multiple related tables.

This is one of the most important concepts in relational databases.

Imagine an online store.

You have:

User
- id
- name
- email

Order
- id
- user_id
- total
- status

OrderItem
- id
- order_id
- product_id
- quantity

Product
- id
- name
- price

When a customer views an order, the information is spread across several tables.

You may need:

Order
+
User
+
OrderItem
+
Product

A join allows PostgreSQL to connect these records.

<b>Beginner real-world example:</b>

You have an order with:

Order ID: 5001
User ID: 42

The order table knows the user's ID, but it does not contain the user's name.

A join lets you retrieve:

Order #5001
Customer: Sarah
Total: $149.99

<b>Intermediate real-world example:</b>

An order details page needs:

- order information
- customer information
- order items
- product names
- product prices

You can join the related tables instead of making separate database requests for every piece of information.

<b>Advanced real-world example:</b>

An analytics dashboard might need:

"Show the top 20 customers by total spending, including the customer's email and number of completed orders."

That requires joins and aggregation together.

There are several important join types.

<b>INNER JOIN</b>

Returns records where matching records exist on both sides.

For example:

Orders with valid users.

<b>LEFT JOIN</b>

Returns all records from the left table even when there is no matching record on the right.

For example:

All users, including users who have never placed an order.

This difference is extremely important.

Suppose there are 100 users but only 60 have orders.

An INNER JOIN can return 60 users.

A LEFT JOIN can return all 100 users.

That is why choosing the correct join type is a business requirement, not just a syntax decision.

<b>Real-world reporting example:</b>

"Show every seller, including sellers who have made zero sales."

You probably need a LEFT JOIN.

If you use an INNER JOIN, sellers without sales can disappear from the result.

<b>Important performance lesson:</b>

Joins are powerful, but joining many large tables can create very large intermediate result sets.

For example:

1 million orders
x
10 order items per order

can produce millions of joined rows.

This is why indexes, filtering, and careful query design matter.`,
      diagram: `users
  |
  | 1
  |
  | many
  v
orders
  |
  | 1
  |
  | many
  v
order_items
  |
  | many
  |
  | 1
  v
products


INNER JOIN:
Only matching records

LEFT JOIN:
Keep every record from
the left side even if
there is no match.`,
      codeExample: {
        title: "Joining orders, users, and products",
        code: `async findOrderDetails(orderId: number) {
  return this.repository
    .createQueryBuilder("order")
    .innerJoinAndSelect(
      "order.user",
      "user",
    )
    .leftJoinAndSelect(
      "order.items",
      "item",
    )
    .leftJoinAndSelect(
      "item.product",
      "product",
    )
    .where("order.id = :orderId", {
      orderId,
    })
    .getOne();
}

// Result can conceptually contain:
//
// order
//   user
//   items
//     product
//
// Instead of manually making separate queries
// for every relationship.`,
      },
      keyTakeaways: [
        "Joins allow related tables to be queried together.",
        "INNER JOIN keeps rows with matching related records.",
        "LEFT JOIN keeps all rows from the left side even when there is no related record.",
        "The correct join type depends on the business question.",
        "Joining several large tables can produce large result sets.",
        "Foreign keys and indexes are important for efficient joins.",
      ],
      commonMistakes: [
        "<b>Using INNER JOIN when records without relationships should still appear.</b> Consider whether LEFT JOIN is required.",
        "<b>Joining everything automatically.</b> Only retrieve relationships needed for the operation.",
        "<b>Ignoring indexes on foreign keys.</b> Large joins can become expensive without appropriate indexes.",
        "<b>Not understanding row multiplication.</b> Joining one order to ten items produces ten joined rows for that order.",
      ],
      quiz: [
        {
          question: "Which join can keep all users even when they have no orders?",
          options: [
            "LEFT JOIN from users to orders",
            "INNER JOIN only",
            "CROSS JOIN only",
            "No join can do this",
          ],
          correctIndex: 0,
          explanation: "A LEFT JOIN keeps all rows from the left table even when no matching row exists on the right.",
        },
        {
          question: "Why can joining an order with many order items produce multiple rows?",
          options: [
            "Each related order item can create a joined result row",
            "PostgreSQL duplicates the database",
            "TypeScript creates copies",
            "Joins always create exactly one row",
          ],
          correctIndex: 0,
          explanation: "One-to-many relationships naturally produce multiple joined rows.",
        },
      ],
    },
    {
      id: "aggregation",
      title: "Aggregation: COUNT, SUM, AVG, MIN, MAX, and GROUP BY",
      durationMinutes: 20,
      explanation: `Aggregation is how you turn many database rows into useful summary information.

The most common aggregation functions are:

- COUNT()
- SUM()
- AVG()
- MIN()
- MAX()

For example:

COUNT = How many?
SUM = What is the total?
AVG = What is the average?
MIN = What is the smallest?
MAX = What is the largest?

<b>Beginner real-world example:</b>

A store owner asks:

"How many products do we have?"

That is a COUNT.

<b>Intermediate real-world example:</b>

The finance dashboard asks:

"How much money did we make from completed orders?"

That is a SUM.

<b>Another example:</b>

A manager asks:

"What is the average order value?"

That is an AVG.

<b>Advanced real-world example:</b>

A dashboard asks:

"Show revenue grouped by month."

Now you need:

- aggregation
- date functions
- GROUP BY
- filtering

Another dashboard might ask:

"Show total sales for every seller."

Now you group orders by seller.

The important idea is that aggregation happens in the database.

Do not load 10 million orders into Node.js and calculate the total with JavaScript unless you have a very specific reason.

Let PostgreSQL do database work.

For example, this is usually much better:

\`SELECT SUM(total) FROM orders\`

than:

1. Fetch millions of orders.
2. Send them over the network.
3. Store them in Node.js memory.
4. Loop through them.
5. Calculate the total.

The database is designed to perform these operations efficiently.

<b>GROUP BY</b>

Suppose you have:

seller A -> $100
seller A -> $200
seller B -> $50
seller B -> $150

A normal SUM gives:

$500

But:

GROUP BY seller

can give:

seller A -> $300
seller B -> $200

This is incredibly useful for dashboards and reports.

<b>HAVING</b>

There is also an important difference between WHERE and HAVING.

WHERE filters individual rows before grouping.

HAVING filters groups after aggregation.

For example:

"Only show sellers whose total sales exceed $10,000."

That requires HAVING because the condition depends on SUM().`,
      diagram: `orders

seller   total
A        100
A        200
B         50
B        150

GROUP BY seller

A --> SUM = 300
B --> SUM = 200

WHERE:
filters rows before grouping

GROUP BY:
creates groups

HAVING:
filters groups after aggregation`,
      codeExample: {
        title: "Aggregation and grouping with QueryBuilder",
        code: `async getSalesSummary() {
  return this.repository
    .createQueryBuilder("order")
    .select("COUNT(order.id)", "orderCount")
    .addSelect("SUM(order.total)", "revenue")
    .addSelect("AVG(order.total)", "averageOrderValue")
    .where("order.status = :status", {
      status: "completed",
    })
    .getRawOne();
}

async getRevenueBySeller() {
  return this.repository
    .createQueryBuilder("order")
    .select("order.seller_id", "sellerId")
    .addSelect("COUNT(order.id)", "orderCount")
    .addSelect("SUM(order.total)", "revenue")
    .where("order.status = :status", {
      status: "completed",
    })
    .groupBy("order.seller_id")
    .having("SUM(order.total) > :minimum", {
      minimum: 10000,
    })
    .orderBy("revenue", "DESC")
    .getRawMany();
}`,
      },
      keyTakeaways: [
        "Aggregation turns many rows into useful summary values.",
        "COUNT answers how many records exist.",
        "SUM calculates totals.",
        "AVG calculates averages.",
        "MIN and MAX find boundaries.",
        "GROUP BY creates groups for separate aggregate results.",
        "WHERE filters rows before aggregation.",
        "HAVING filters groups after aggregation.",
        "Database aggregation is usually more efficient than loading huge datasets into Node.js just to calculate totals.",
      ],
      commonMistakes: [
        "<b>Using HAVING when WHERE is enough.</b> Use WHERE for row-level filtering.",
        "<b>Forgetting GROUP BY when selecting grouped non-aggregate columns.</b> PostgreSQL requires grouped columns to be handled correctly.",
        "<b>Loading millions of rows into Node.js for a simple SUM.</b> Let the database calculate the aggregate.",
        "<b>Assuming aggregate values always have the desired TypeScript type.</b> Raw database results may require conversion.",
      ],
      quiz: [
        {
          question: "Which function calculates a total?",
          options: [
            "SUM()",
            "COUNT()",
            "AVG()",
            "MIN()",
          ],
          correctIndex: 0,
          explanation: "SUM adds numeric values together.",
        },
        {
          question: "What is HAVING primarily used for?",
          options: [
            "Filtering groups after aggregation",
            "Creating HTTP requests",
            "Sorting TypeScript arrays",
            "Creating database tables",
          ],
          correctIndex: 0,
          explanation: "HAVING filters grouped results after aggregation.",
        },
      ],
    },
    {
      id: "filtering",
      title: "Advanced Filtering: Building Flexible Search Queries",
      durationMinutes: 18,
      explanation: `Filtering is one of the most common requirements in real applications.

A simple filter might be:

\`WHERE product.isActive = true\`

But real-world search pages often have many optional filters.

Imagine an online store.

The customer can select:

- category
- brand
- minimum price
- maximum price
- available only
- minimum rating
- search text
- seller
- created after
- created before

The user might provide only two filters.

The next user might provide six.

Your repository therefore needs to build the query dynamically.

The important principle is:

<b>Only add a condition when the user actually requested that filter.</b>

Do not build one giant query full of unnecessary conditions.

<b>Beginner example:</b>

Filter active products.

<b>Intermediate example:</b>

Filter products between $20 and $100.

<b>Advanced real-world example:</b>

A marketplace search endpoint receives:

{
  categoryId: 10,
  minPrice: 20,
  maxPrice: 100,
  onlyAvailable: true,
  search: "keyboard"
}

The repository builds the database query based on those values.

<b>Important security lesson:</b>

Never trust query parameters.

A user might send:

\`?sort=price\`

which is fine.

But you should not blindly insert arbitrary user-provided strings into SQL identifiers.

Values can be safely parameterized.

Column names are different.

For sorting, use a whitelist.

For example:

Allowed sorting fields:

- price
- createdAt
- name

Then map the requested value to a known database column.

This is an important distinction between parameter values and SQL structure.

<b>Real-world example:</b>

Bad:

\`orderBy("product." + userInput)\`

Better:

const sortColumns = {
  price: "product.currentPrice",
  newest: "product.createdAt",
  name: "product.name",
};

Then only allow known keys.

This prevents arbitrary SQL fragments from becoming part of your query structure.

Filtering is therefore not only about functionality.

It is also about security, performance, and predictable API behavior.`,
      diagram: `HTTP Query Parameters
        |
        v
   DTO / Validation
        |
        v
   Service
        |
        v
 Repository Search
        |
        +--> category filter
        +--> price filter
        +--> stock filter
        +--> text filter
        +--> date filter
        +--> sorting
        +--> pagination
        |
        v
    PostgreSQL`,
      codeExample: {
        title: "Flexible and safe product filtering",
        code: `interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  onlyAvailable?: boolean;
  sort?: "price" | "newest" | "name";
}

async searchProducts(filters: ProductFilters) {
  const query = this.repository
    .createQueryBuilder("product")
    .where("product.isActive = :active", {
      active: true,
    });

  if (filters.categoryId !== undefined) {
    query.andWhere(
      "product.category_id = :categoryId",
      {
        categoryId: filters.categoryId,
      },
    );
  }

  if (filters.minPrice !== undefined) {
    query.andWhere(
      "product.currentPrice >= :minPrice",
      {
        minPrice: filters.minPrice,
      },
    );
  }

  if (filters.maxPrice !== undefined) {
    query.andWhere(
      "product.currentPrice <= :maxPrice",
      {
        maxPrice: filters.maxPrice,
      },
    );
  }

  if (filters.search) {
    query.andWhere(
      "product.name ILIKE :search",
      {
        search: \`%\${filters.search}%\`,
      },
    );
  }

  if (filters.onlyAvailable) {
    query.andWhere(
      "product.stock > 0",
    );
  }

  const sortColumns = {
    price: "product.currentPrice",
    newest: "product.createdAt",
    name: "product.name",
  };

  const sortColumn =
    sortColumns[filters.sort ?? "newest"];

  query.orderBy(sortColumn, "DESC");

  return query.getMany();
}`,
      },
      keyTakeaways: [
        "Optional filters can be added conditionally.",
        "Filter user-provided values using QueryBuilder parameters.",
        "Do not blindly insert user input into SQL identifiers.",
        "Sorting fields should usually come from a whitelist.",
        "Filtering design affects both security and database performance.",
        "Validation should happen before values reach complex repository logic.",
      ],
      commonMistakes: [
        "<b>Concatenating arbitrary search values into SQL.</b> Use parameters.",
        "<b>Allowing arbitrary sort columns.</b> Use a whitelist of allowed sort fields.",
        "<b>Accepting negative page sizes or unreasonable limits.</b> Validate pagination values.",
        "<b>Adding dozens of optional filters without considering indexes.</b> Flexible search can require careful database indexing.",
      ],
      quiz: [
        {
          question: "How should normal user-provided filter values be passed into QueryBuilder?",
          options: [
            "Named parameters",
            "String concatenation",
            "Raw JavaScript execution",
            "Template code without parameters",
          ],
          correctIndex: 0,
          explanation: "Named parameters safely bind values to the query.",
        },
        {
          question: "Why should sort fields usually be whitelisted?",
          options: [
            "Column identifiers cannot be handled like ordinary parameter values and arbitrary SQL structure should not come from users",
            "Sorting is impossible otherwise",
            "PostgreSQL does not support sorting",
            "TypeORM cannot sort",
          ],
          correctIndex: 0,
          explanation: "A controlled mapping prevents arbitrary user input from becoming part of the SQL structure.",
        },
      ],
    },
    {
      id: "sorting-pagination",
      title: "Sorting and Pagination for Production APIs",
      durationMinutes: 16,
      explanation: `Sorting looks simple, but production APIs need to handle it carefully.

A user might request:

- newest products
- cheapest products
- most expensive products
- alphabetical order
- highest-rated products

A database can sort these records using ORDER BY.

For example:

\`ORDER BY product.created_at DESC\`

The next important concept is pagination.

Suppose your store has 2 million products.

This is a bad API design:

GET /products

that returns all 2 million products.

The response would be huge.

Instead, return a limited page.

For example:

page = 1
limit = 20

The database returns 20 rows.

<b>Beginner example:</b>

Display products 1 through 10.

<b>Intermediate example:</b>

Display page 4 with 20 products per page.

<b>Advanced real-world example:</b>

An API may use cursor-based pagination.

Instead of:

\`page=50000\`

the API can say:

"Give me the next 20 products after this cursor."

Cursor pagination can be more stable and efficient for certain large or frequently changing datasets.

Offset pagination is easier to understand and is often completely acceptable for moderate datasets.

The important lesson is to choose pagination based on the application's data size and access pattern.

<b>Stable sorting:</b>

Suppose many products have the same price.

If you sort only by price, the order among equal-price rows may not be stable.

A useful approach is to add a unique secondary sort field.

For example:

ORDER BY price ASC, id ASC

Now records with the same price have a deterministic secondary ordering.

This becomes especially important for pagination.

Without stable ordering, records can appear on multiple pages or disappear between pages when data changes.`,
      diagram: `Products
   |
   v
FILTER
   |
   v
SORT
   |
   +--> price ASC
   +--> createdAt DESC
   +--> id ASC
   |
   v
PAGINATION
   |
   +--> page
   +--> limit
   |
   v
API RESPONSE`,
      codeExample: {
        title: "Sorting with offset pagination",
        code: `async findProducts(
  page: number,
  limit: number,
  sort: "price" | "newest",
) {
  const sortColumns = {
    price: "product.currentPrice",
    newest: "product.createdAt",
  };

  const query = this.repository
    .createQueryBuilder("product")
    .where("product.isActive = :active", {
      active: true,
    });

  query.orderBy(
    sortColumns[sort],
    "ASC",
  );

  // Stable secondary ordering.
  query.addOrderBy(
    "product.id",
    "ASC",
  );

  const skip = (page - 1) * limit;

  query
    .skip(skip)
    .take(limit);

  const [items, total] =
    await query.getManyAndCount();

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit,
    ),
  };
}`,
      },
      keyTakeaways: [
        "Use ORDER BY for database-level sorting.",
        "Production list APIs should normally limit the amount of data returned.",
        "Offset pagination is simple and useful for many applications.",
        "Cursor pagination can be useful for very large or frequently changing datasets.",
        "Stable secondary sorting is important when many records share the same primary sort value.",
        "Pagination strategy should match the application's data volume and access pattern.",
      ],
      commonMistakes: [
        "<b>Returning unlimited rows.</b> Always consider a sensible maximum page size.",
        "<b>Allowing arbitrary sort columns.</b> Use a controlled whitelist.",
        "<b>Sorting only by a non-unique column when stable pagination matters.</b> Add a deterministic secondary sort.",
        "<b>Assuming offset pagination is always ideal.</b> Very large offsets can become expensive depending on the database and query.",
      ],
      quiz: [
        {
          question: "Why is a secondary sort field useful?",
          options: [
            "It creates more deterministic ordering when primary values are equal",
            "It disables indexes",
            "It removes pagination",
            "It prevents database connections",
          ],
          correctIndex: 0,
          explanation: "A unique secondary ordering such as ID helps make pagination order stable.",
        },
        {
          question: "Why should APIs limit page size?",
          options: [
            "To avoid unnecessarily large database results and HTTP responses",
            "Because PostgreSQL cannot return more than 20 rows",
            "Because TypeScript only supports arrays of 20 items",
            "To disable sorting",
          ],
          correctIndex: 0,
          explanation: "Limits protect both database and application resources.",
        },
      ],
    },
    {
      id: "raw-sql",
      title: "Raw SQL: When and How to Use It",
      durationMinutes: 17,
      explanation: `TypeORM provides abstractions over SQL, but sometimes you need SQL directly.

This is not a failure of TypeORM.

SQL is the language of relational databases, and advanced applications sometimes need database-specific features or extremely specialized queries.

You might use raw SQL when:

- a PostgreSQL-specific feature is required
- a complex query is easier to express directly in SQL
- a database function is required
- a specialized reporting query needs exact SQL control
- you need to work with a database feature that TypeORM does not represent cleanly

However, raw SQL should be used intentionally.

<b>Beginner example:</b>

A simple repository method should usually use TypeORM.

Do not write raw SQL for:

"Find user by ID."

TypeORM already handles this cleanly.

<b>Intermediate example:</b>

Suppose PostgreSQL provides a feature that you need and the ORM abstraction becomes awkward.

A raw query may be clearer.

<b>Advanced real-world example:</b>

An analytics system may use PostgreSQL-specific functions, window functions, common table expressions, or carefully optimized reporting queries.

Writing the SQL directly can make the query easier to understand and optimize.

The important rule is:

<b>Raw SQL does not mean unsafe SQL.</b>

You still need parameter binding.

Bad:

\`SELECT * FROM users WHERE email = '\${email}'\`

Better:

\`SELECT * FROM users WHERE email = $1\`

and pass the email separately.

With TypeORM's data source or repository query methods, parameters can be supplied separately from the SQL statement.

<b>Why is this important?</b>

Suppose a malicious user submits:

\`' OR 1=1 --\`

If you concatenate that into SQL, you may accidentally change the meaning of the query.

Parameter binding treats the value as data rather than SQL syntax.

Raw SQL therefore requires both database knowledge and security awareness.

Another consideration is maintainability.

A raw SQL query may be harder for another developer to understand if the team primarily uses TypeORM.

Use comments and meaningful repository method names when raw SQL is justified.

For example:

\`getMonthlyRevenueReport()\`

is more understandable than:

\`runQuery2()\`

The repository method should explain what the query is for.`,
      diagram: `Service
   |
   v
Repository
   |
   +--> TypeORM Repository
   |
   +--> QueryBuilder
   |
   +--> Raw SQL
   |
   v
PostgreSQL

Raw SQL should still use:
        |
        v
Parameter binding
        |
        v
Safe values`,
      codeExample: {
        title: "Raw SQL with parameter binding",
        code: `import { DataSource } from "typeorm";

export class RevenueRepository {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async getRevenueForUser(userId: number) {
    const rows = await this.dataSource.query(
      \`
        SELECT
          user_id,
          COUNT(id) AS order_count,
          SUM(total) AS revenue
        FROM orders
        WHERE user_id = $1
          AND status = $2
        GROUP BY user_id
      \`,
      [userId, "completed"],
    );

    return rows[0] ?? null;
  }
}

// IMPORTANT:
//
// Values are passed separately:
//
// [userId, "completed"]
//
// Do NOT build:
//
// "... WHERE user_id = " + userId`,
      },
      keyTakeaways: [
        "Raw SQL is useful when ORM abstractions are not suitable for a particular database operation.",
        "Do not use raw SQL just because a simple TypeORM method already solves the problem.",
        "PostgreSQL-specific features can be a legitimate reason to use raw SQL.",
        "Raw SQL must still use parameter binding.",
        "Raw SQL belongs in the data-access layer, not controllers.",
        "Meaningful repository method names and comments make raw SQL easier to maintain.",
      ],
      commonMistakes: [
        "<b>Concatenating user input into raw SQL.</b> Always bind dynamic values as parameters.",
        "<b>Using raw SQL for every query.</b> You lose useful ORM abstractions unnecessarily.",
        "<b>Hiding complex raw SQL behind meaningless method names.</b> Give repository methods meaningful names.",
        "<b>Ignoring database portability.</b> PostgreSQL-specific SQL may not work on another database.",
      ],
      quiz: [
        {
          question: "What is one valid reason to use raw SQL?",
          options: [
            "A database-specific feature or highly specialized query",
            "Every simple CRUD operation",
            "Avoid learning repositories",
            "Replace controllers",
          ],
          correctIndex: 0,
          explanation: "Raw SQL can be appropriate when ORM abstractions do not express a specialized database operation well.",
        },
        {
          question: "How should dynamic values be supplied to raw SQL?",
          options: [
            "String concatenation",
            "Parameter binding",
            "Copying them into the SQL manually",
            "Disabling database validation",
          ],
          correctIndex: 1,
          explanation: "Parameter binding keeps values separate from SQL syntax.",
        },
      ],
    },
    {
      id: "parameter-binding",
      title: "Parameter Binding and SQL Injection Prevention",
      durationMinutes: 16,
      explanation: `Parameter binding is one of the most important security concepts in database programming.

The basic idea is simple:

<b>SQL structure and user-provided values should remain separate.</b>

Imagine a login query.

You want:

\`SELECT * FROM users WHERE email = ?\`

The email is data.

It should not become part of the SQL structure.

This distinction protects your application from SQL injection vulnerabilities.

<b>Beginner example:</b>

You receive:

\`email = "sarah@example.com"\`

Instead of creating:

\`SELECT * FROM users WHERE email = 'sarah@example.com'\`

by manually concatenating strings, you use a parameter.

<b>Dangerous example:</b>

A developer writes:

\`"SELECT * FROM users WHERE email = '" + email + "'"\`

Now the SQL statement changes depending on what the user sends.

<b>Intermediate real-world example:</b>

A search endpoint receives:

\`search = "keyboard"\`

Use:

\`WHERE product.name ILIKE :search\`

with:

\`{ search: "%keyboard%" }\`

The value remains separate from the SQL expression.

<b>Advanced real-world example:</b>

A reporting endpoint receives several values:

- start date
- end date
- seller ID
- status
- minimum revenue

Every value should be parameterized.

The query structure can be fixed while the values change.

<b>Important distinction:</b>

Parameter binding works very well for values.

It does not mean you can safely put arbitrary user input everywhere in SQL.

For example, a column name is SQL structure.

You generally should not do:

\`ORDER BY :column\`

and expect a parameter to safely represent an arbitrary SQL identifier.

Instead, use a whitelist.

For example:

\`price -> product.currentPrice\`

\`newest -> product.createdAt\`

\`name -> product.name\`

Then the user chooses from known options.

<b>Security is not only about injection.</b>

Validation also matters.

For example:

page should be a positive integer.

limit should have a maximum.

date ranges should be valid.

IDs should have the expected type.

A secure query system therefore looks like:

HTTP input
   |
   v
DTO validation
   |
   v
Allowed values
   |
   v
Repository
   |
   v
Parameterized SQL

This makes the query predictable and much safer.`,
      diagram: `User input
    |
    v
Validation
    |
    +--> type check
    +--> range check
    +--> allowed values
    |
    v
Repository
    |
    +--> SQL structure
    |
    +--> bound parameters
    |
    v
PostgreSQL

Values != SQL structure`,
      codeExample: {
        title: "Safe parameter binding with QueryBuilder",
        code: `async findUsers(
  email?: string,
  minAge?: number,
) {
  const query = this.repository
    .createQueryBuilder("user")
    .where("user.isActive = :active", {
      active: true,
    });

  if (email) {
    query.andWhere(
      "user.email = :email",
      { email },
    );
  }

  if (minAge !== undefined) {
    query.andWhere(
      "user.age >= :minAge",
      { minAge },
    );
  }

  return query.getMany();
}

// Safe:
//
// user.email = :email
// { email }
//
// Dangerous:
//
// "user.email = '" + email + "'"
//
// The first approach keeps the value separate
// from the SQL structure.`,
      },
      keyTakeaways: [
        "Parameter binding separates SQL structure from dynamic values.",
        "Never concatenate untrusted user input into SQL.",
        "QueryBuilder supports named parameters.",
        "Raw SQL can also use bound parameters.",
        "SQL identifiers such as column names generally need controlled whitelisting rather than ordinary value parameters.",
        "Validation and parameter binding work together to create safer query APIs.",
      ],
      commonMistakes: [
        "<b>Assuming only login queries need protection.</b> Every database query receiving untrusted input needs careful parameter handling.",
        "<b>Using string interpolation for SQL values.</b> Use parameters.",
        "<b>Thinking parameter binding validates business input.</b> You still need DTO and application-level validation.",
        "<b>Allowing arbitrary SQL sort expressions.</b> Use an explicit mapping of allowed sort choices.",
      ],
      quiz: [
        {
          question: "What does parameter binding protect against?",
          options: [
            "SQL injection caused by treating values as SQL syntax",
            "All database outages",
            "All business logic bugs",
            "All network failures",
          ],
          correctIndex: 0,
          explanation: "Parameter binding keeps user-controlled values separate from SQL syntax.",
        },
        {
          question: "How should arbitrary sort columns from users be handled?",
          options: [
            "Concatenate them directly into SQL",
            "Use a whitelist mapping of allowed sort options",
            "Disable SQL parsing",
            "Put them in a password field",
          ],
          correctIndex: 1,
          explanation: "SQL identifiers are structure, so applications should map user choices to known safe identifiers.",
        },
      ],
    },
    {
      id: "advanced-query-architecture",
      title: "Putting Advanced Queries Together in a Real Application",
      durationMinutes: 18,
      explanation: `The real skill is not knowing QueryBuilder, joins, aggregation, filtering, sorting, and raw SQL separately.

The real skill is knowing how these tools work together in a production application.

Imagine an e-commerce product search endpoint:

GET /products

The client can send:

category=10
minPrice=20
maxPrice=200
search=keyboard
sort=price
page=2
limit=20

The complete flow can look like this:

Controller
   |
   v
DTO validation
   |
   v
ProductsService
   |
   v
ProductsRepository
   |
   v
QueryBuilder
   |
   +--> WHERE
   +--> JOIN
   +--> FILTER
   +--> ORDER BY
   +--> OFFSET
   +--> LIMIT
   |
   v
PostgreSQL

The controller should not know the SQL.

The service should not know how the joins are implemented.

The repository should not decide whether a customer is allowed to see a particular product based on a complicated business policy unless that decision is genuinely a persistence concern.

<b>Beginner real-world example:</b>

Search active products by category.

<b>Intermediate real-world example:</b>

Search products by:

- category
- price
- availability
- text

and return paginated results.

<b>Advanced real-world example:</b>

A marketplace search may involve:

Product
Seller
Category
Inventory
Reviews

The query might:

1. Join seller information.
2. Filter active sellers.
3. Join categories.
4. Filter category.
5. Check inventory.
6. Calculate average review rating.
7. Filter by rating.
8. Sort by rating or price.
9. Paginate results.

That is a complex database operation.

You should carefully design the query rather than adding conditions randomly.

<b>Performance thinking:</b>

Once queries become complex, ask:

- Is the filtered column indexed?
- Is the join column indexed?
- How many rows are being joined?
- Are we selecting unnecessary columns?
- Are we loading relationships we do not need?
- Can the database use an index?
- Are we returning too many rows?
- Would aggregation be better performed in SQL?
- Should this query use cursor pagination?
- Does PostgreSQL's execution plan make sense?

This is where database development becomes engineering rather than simply writing ORM methods.

<b>Advanced reporting example:</b>

Suppose management asks:

"Show each seller's completed order count, total revenue, and average order value for the last 30 days, but only include sellers with more than $10,000 in revenue."

This requires:

JOIN
+
WHERE
+
GROUP BY
+
COUNT
+
SUM
+
AVG
+
HAVING
+
ORDER BY

That is an excellent QueryBuilder use case.

The important lesson is that advanced queries should be treated as first-class pieces of application design.

Name them clearly.

Test them with realistic data.

Measure their performance.

And keep them inside the data-access layer.`,
      diagram: `HTTP
 |
 v
ProductsController
 |
 | validated DTO
 v
ProductsService
 |
 | business workflow
 v
ProductsRepository
 |
 | QueryBuilder
 |
 +--> JOIN Seller
 +--> JOIN Category
 +--> WHERE active
 +--> WHERE price
 +--> WHERE stock
 +--> GROUP / AVG rating
 +--> ORDER BY
 +--> OFFSET / LIMIT
 |
 v
PostgreSQL
 |
 v
Paginated response`,
      codeExample: {
        title: "Production-style advanced search repository",
        code: `interface ProductSearchFilters {
  categoryId?: number;
  sellerId?: number;
  minPrice?: number;
  maxPrice?: number;
  minimumRating?: number;
  search?: string;
  onlyAvailable?: boolean;
  sort:
    | "price"
    | "newest"
    | "rating";
  page: number;
  limit: number;
}

async searchProducts(
  filters: ProductSearchFilters,
) {
  const query = this.repository
    .createQueryBuilder("product")
    .leftJoin(
      "product.seller",
      "seller",
    )
    .leftJoin(
      "product.category",
      "category",
    )
    .leftJoin(
      "product.reviews",
      "review",
    )
    .select("product.id", "id")
    .addSelect("product.name", "name")
    .addSelect(
      "product.currentPrice",
      "price",
    )
    .addSelect(
      "AVG(review.rating)",
      "averageRating",
    )
    .where("product.isActive = :active", {
      active: true,
    })
    .andWhere("seller.isActive = :sellerActive", {
      sellerActive: true,
    });

  if (filters.categoryId !== undefined) {
    query.andWhere(
      "category.id = :categoryId",
      {
        categoryId: filters.categoryId,
      },
    );
  }

  if (filters.sellerId !== undefined) {
    query.andWhere(
      "seller.id = :sellerId",
      {
        sellerId: filters.sellerId,
      },
    );
  }

  if (filters.minPrice !== undefined) {
    query.andWhere(
      "product.currentPrice >= :minPrice",
      {
        minPrice: filters.minPrice,
      },
    );
  }

  if (filters.maxPrice !== undefined) {
    query.andWhere(
      "product.currentPrice <= :maxPrice",
      {
        maxPrice: filters.maxPrice,
      },
    );
  }

  if (filters.search) {
    query.andWhere(
      "product.name ILIKE :search",
      {
        search: \`%\${filters.search}%\`,
      },
    );
  }

  if (filters.onlyAvailable) {
    query.andWhere(
      "product.stock > 0",
    );
  }

  query
    .groupBy("product.id")
    .addGroupBy("product.name")
    .addGroupBy("product.currentPrice");

  if (filters.minimumRating !== undefined) {
    query.having(
      "AVG(review.rating) >= :minimumRating",
      {
        minimumRating:
          filters.minimumRating,
      },
    );
  }

  const sortColumns = {
    price: "product.currentPrice",
    newest: "product.createdAt",
    rating: "averageRating",
  };

  query
    .orderBy(
      sortColumns[filters.sort],
      "DESC",
    )
    .addOrderBy(
      "product.id",
      "ASC",
    );

  const skip =
    (filters.page - 1) *
    filters.limit;

  query
    .offset(skip)
    .limit(filters.limit);

  return query.getRawMany();
}`,
      },
      keyTakeaways: [
        "Advanced query development combines multiple SQL concepts rather than treating them as isolated features.",
        "A production search query may use joins, filtering, aggregation, sorting, and pagination together.",
        "Controllers should remain focused on HTTP concerns.",
        "Services should coordinate business workflows.",
        "Repositories should contain complex database query construction.",
        "Advanced queries should be tested with realistic data volumes.",
        "Query performance should be measured rather than guessed.",
        "Indexes, execution plans, selected columns, joins, and pagination all matter as query complexity grows.",
      ],
      commonMistakes: [
        "<b>Putting the complete advanced query in the controller.</b> Keep database logic in the repository.",
        "<b>Selecting every column from every joined table.</b> Retrieve only what the operation actually needs.",
        "<b>Adding joins without understanding their effect on row counts.</b> One-to-many joins can multiply results.",
        "<b>Ignoring query performance until production.</b> Test with realistic data sizes early.",
        "<b>Using raw SQL just because QueryBuilder looks complicated.</b> Choose the simplest tool that clearly expresses the required operation.",
      ],
      quiz: [
        {
          question: "Which layer should normally contain a complex product search QueryBuilder?",
          options: [
            "Controller",
            "Repository",
            "DTO",
            "Frontend component",
          ],
          correctIndex: 1,
          explanation: "The repository is the appropriate data-access boundary for complex database query construction.",
        },
        {
          question: "Why should advanced queries be tested with realistic data volumes?",
          options: [
            "A query that looks fast with 20 rows may behave very differently with millions of rows",
            "TypeScript requires large datasets",
            "PostgreSQL only works with millions of rows",
            "Testing small datasets is impossible",
          ],
          correctIndex: 0,
          explanation: "Database performance depends heavily on data volume, indexes, joins, and execution plans.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is QueryBuilder primarily useful for?",
      options: [
        "Building complex database queries",
        "Creating React components",
        "Handling HTTP authentication",
        "Compiling TypeScript",
      ],
      correctIndex: 0,
      explanation: "QueryBuilder helps construct complex database queries involving filtering, joins, sorting, aggregation, and other SQL operations.",
    },
    {
      question: "Which SQL operation combines related tables?",
      options: [
        "JOIN",
        "COUNT",
        "ORDER BY",
        "LIMIT",
      ],
      correctIndex: 0,
      explanation: "JOIN operations combine rows from related tables.",
    },
    {
      question: "What does an INNER JOIN generally return?",
      options: [
        "Rows with matching records on both sides",
        "Every row from the left table regardless of matches",
        "Only deleted rows",
        "Only database indexes",
      ],
      correctIndex: 0,
      explanation: "An INNER JOIN returns rows where the join condition has matching records.",
    },
    {
      question: "Which JOIN can keep all rows from the left table even without a matching right-side row?",
      options: [
        "LEFT JOIN",
        "INNER JOIN",
        "CROSS JOIN only",
        "No JOIN",
      ],
      correctIndex: 0,
      explanation: "LEFT JOIN preserves rows from the left side even when no related row exists.",
    },
    {
      question: "Which function calculates a total?",
      options: [
        "SUM()",
        "COUNT()",
        "AVG()",
        "MAX()",
      ],
      correctIndex: 0,
      explanation: "SUM calculates the total of numeric values.",
    },
    {
      question: "What does GROUP BY do?",
      options: [
        "Creates groups of rows for aggregate calculations",
        "Deletes duplicate tables",
        "Creates HTTP groups",
        "Disables indexes",
      ],
      correctIndex: 0,
      explanation: "GROUP BY groups rows so aggregate functions can calculate values for each group.",
    },
    {
      question: "What is the difference between WHERE and HAVING?",
      options: [
        "WHERE filters rows while HAVING filters grouped results",
        "WHERE sorts rows while HAVING deletes rows",
        "They are exactly the same in every situation",
        "HAVING is only for HTTP requests",
      ],
      correctIndex: 0,
      explanation: "WHERE filters rows before grouping, while HAVING filters groups after aggregation.",
    },
    {
      question: "Why should user-provided values use parameter binding?",
      options: [
        "To keep values separate from SQL syntax and reduce SQL injection risk",
        "To make SQL slower",
        "To disable database constraints",
        "To remove the need for validation",
      ],
      correctIndex: 0,
      explanation: "Parameter binding separates dynamic values from SQL structure.",
    },
    {
      question: "What is the safer approach for user-selected sorting fields?",
      options: [
        "Whitelist allowed fields and map them to known database columns",
        "Concatenate any string directly into ORDER BY",
        "Allow arbitrary SQL expressions",
        "Disable sorting",
      ],
      correctIndex: 0,
      explanation: "SQL identifiers are part of query structure, so applications should control which identifiers users can select.",
    },
    {
      question: "When can raw SQL be appropriate?",
      options: [
        "For specialized or database-specific operations that are awkward to express through ORM abstractions",
        "For every simple lookup",
        "Only for frontend rendering",
        "Only when TypeScript fails to compile",
      ],
      correctIndex: 0,
      explanation: "Raw SQL can be useful for specialized queries or database-specific features.",
    },
    {
      question: "Should raw SQL still use parameter binding?",
      options: [
        "Yes",
        "No",
        "Only in development",
        "Only for SELECT queries",
      ],
      correctIndex: 0,
      explanation: "Raw SQL still needs safe parameter handling for dynamic values.",
    },
    {
      question: "Why is pagination important for production APIs?",
      options: [
        "It prevents unnecessarily large result sets and responses",
        "It removes the need for databases",
        "It makes SQL unnecessary",
        "It disables joins",
      ],
      correctIndex: 0,
      explanation: "Pagination limits the amount of data retrieved and returned.",
    },
    {
      question: "Why can stable secondary sorting be important?",
      options: [
        "It makes ordering deterministic when multiple rows share the same primary sort value",
        "It disables filtering",
        "It removes indexes",
        "It prevents aggregation",
      ],
      correctIndex: 0,
      explanation: "A secondary unique ordering such as ID can make pagination more stable.",
    },
    {
      question: "Where should complex QueryBuilder logic normally live?",
      options: [
        "Repository or data-access layer",
        "Controller",
        "Frontend component",
        "DTO",
      ],
      correctIndex: 0,
      explanation: "The repository is the appropriate place for persistence and query construction.",
    },
    {
      question: "Why should advanced queries be tested with realistic data?",
      options: [
        "Performance can change dramatically as data volume increases",
        "TypeORM only supports large datasets",
        "PostgreSQL cannot process small datasets",
        "Testing requires exactly one million rows",
      ],
      correctIndex: 0,
      explanation: "Joins, filtering, aggregation, indexes, and pagination can behave very differently at production-scale data volumes.",
    },
  ],
  project: {
    name: "Advanced E-commerce Search and Analytics API",
    goal: "Build a production-style NestJS and TypeORM query layer that demonstrates QueryBuilder, joins, aggregation, filtering, sorting, pagination, raw SQL, and secure parameter binding.",
    brief: "Build an e-commerce backend where customers can search products using multiple filters and administrators can view sales analytics. The project should intentionally move from simple repository methods to advanced QueryBuilder operations. The goal is not only to make the queries work, but to understand why each database technique is being used and where the query belongs in a clean NestJS architecture.",
    steps: [
      "Create Product, Category, Seller, Review, User, Order, and OrderItem entities.",
      "Create relationships between products, categories, sellers, reviews, orders, and users.",
      "Create a ProductRepository that contains all product database queries.",
      "Implement a basic query that retrieves active products.",
      "Implement a price-range filter using QueryBuilder.",
      "Implement category filtering.",
      "Implement seller filtering.",
      "Implement availability filtering using stock quantity.",
      "Implement text search using PostgreSQL-compatible `ILIKE`.",
      "Add minimum and maximum price filters.",
      "Add a minimum rating filter using review aggregation.",
      "Join the product with its seller.",
      "Join the product with its category.",
      "Join reviews when calculating average product ratings.",
      "Use `GROUP BY` for product-level aggregation.",
      "Use `AVG()` to calculate average product ratings.",
      "Use `COUNT()` to count related reviews.",
      "Add sorting options for price, newest products, and rating.",
      "Create a whitelist mapping for allowed sorting fields.",
      "Never concatenate arbitrary user input into the SQL query.",
      "Add offset pagination using page and limit.",
      "Set a maximum allowed page size.",
      "Add deterministic secondary sorting using the product ID.",
      "Return a paginated response containing items, total count, current page, page size, and total pages.",
      "Create an OrderRepository for reporting queries.",
      "Build a revenue summary using `COUNT()`, `SUM()`, and `AVG()`.",
      "Build a seller revenue report using `GROUP BY`.",
      "Use `HAVING` to return only sellers whose revenue exceeds a specified threshold.",
      "Sort the seller report by revenue.",
      "Filter analytics queries by order status.",
      "Filter analytics queries by date range.",
      "Use parameter binding for user-controlled date, seller, status, and threshold values.",
      "Create at least one raw SQL query for a PostgreSQL-specific or highly specialized report.",
      "Keep the raw SQL query inside the repository.",
      "Use parameter binding with the raw SQL query.",
      "Compare the raw SQL implementation with a QueryBuilder implementation.",
      "Create a service that calls the repository without knowing the SQL implementation.",
      "Create a controller that accepts validated search parameters.",
      "Add DTO validation for page, limit, prices, IDs, dates, and allowed sort values.",
      "Test the product search with no filters.",
      "Test the product search with one filter.",
      "Test the product search with several filters together.",
      "Test the search with an empty result set.",
      "Test pagination across multiple pages.",
      "Test sorting when several products have identical prices.",
      "Test products that have no reviews.",
      "Test sellers that have no completed orders.",
      "Test analytics with no completed orders.",
      "Populate the database with enough realistic sample data to expose query behavior.",
      "Inspect generated SQL during development.",
      "Use PostgreSQL `EXPLAIN` or `EXPLAIN ANALYZE` to investigate important queries.",
      "Identify which columns should have indexes based on actual filtering and join patterns.",
    ],
    acceptance: [
      "The application contains a clear Controller -> Service -> Repository -> PostgreSQL flow.",
      "Complex database queries are not written directly inside controllers.",
      "Product search supports multiple optional filters.",
      "Product search supports category filtering.",
      "Product search supports seller filtering.",
      "Product search supports price filtering.",
      "Product search supports availability filtering.",
      "Product search supports text searching.",
      "Product search supports minimum rating filtering.",
      "Product search supports multiple sorting choices.",
      "Sorting choices are controlled by a whitelist.",
      "Product search supports pagination.",
      "Pagination has a maximum page size.",
      "The query uses parameter binding for dynamic values.",
      "The application uses joins between related entities.",
      "The application demonstrates aggregation with `COUNT`, `SUM`, and `AVG`.",
      "The application demonstrates `GROUP BY`.",
      "The application demonstrates `HAVING`.",
      "The application contains at least one advanced reporting query.",
      "The application contains at least one justified raw SQL query.",
      "Raw SQL uses parameter binding.",
      "Repository methods have meaningful names that explain what the query does.",
      "Services do not need to know how QueryBuilder constructs the SQL.",
      "The search results remain correct when optional filters are omitted.",
      "The search handles products with and without related review records appropriately.",
      "The project includes tests for filtering, sorting, pagination, joins, and aggregation.",
      "Important queries have been evaluated with realistic data.",
    ],
    stretch: [
      "Replace offset pagination with cursor-based pagination for a large product feed.",
      "Create a PostgreSQL full-text search implementation instead of using only `ILIKE`.",
      "Add a weighted search ranking system.",
      "Add seller rating aggregation to the product search.",
      "Add a price-history table and query the lowest price over the previous 30 days.",
      "Create a monthly revenue report using PostgreSQL date functions and `GROUP BY`.",
      "Create a daily active-customer report.",
      "Create a top-selling-products report using `SUM(order_item.quantity)`.",
      "Create a report showing each seller's revenue percentage compared with total marketplace revenue.",
      "Use a Common Table Expression in raw SQL for a complex reporting query.",
      "Use a window function such as `RANK()` or `ROW_NUMBER()` in a reporting query.",
      "Compare a QueryBuilder query with an equivalent raw SQL query.",
      "Run `EXPLAIN ANALYZE` on the product search query before and after adding appropriate indexes.",
      "Investigate how different indexes affect category, price, seller, and availability filters.",
      "Test the query with one million simulated products.",
      "Measure response time for page 1 and a very large offset.",
      "Implement cursor pagination and compare its behavior with offset pagination.",
      "Add query-level logging for slow database operations.",
      "Create a reusable query-filter builder while keeping the repository readable.",
      "Create separate repositories for transactional order operations and analytics/reporting queries.",
      "Build an administrator dashboard endpoint that combines multiple aggregate queries.",
      "Create integration tests against a real PostgreSQL database rather than mocking every repository call.",
    ],
  },
};
