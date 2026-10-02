import type { LessonDay } from "@/lib/learn/lesson-types";

export const FILTERING_SEARCHING_DAY_48_LESSONS: LessonDay = {
  day: 48,
  title: "Filtering & Searching",
  totalMinutes: 100,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-48-lesson-1",
      title: "Filtering and Query Parameters",
      durationMinutes: 25,
      explanation: `
<b>Imagine you are building the backend for an online store with 200,000 products.</b> The customer opens the product page and sees... everything? Obviously not. They want to narrow it down. "Show me only red shoes under $100 from Nike, in size 42, that are in stock." That sentence contains five filters. Your API needs to translate those into a database query, and it needs to do it safely, quickly, and without letting a malicious user break your database.

This is the world of <b>filtering</b> — the art of letting clients narrow down a large dataset by specifying conditions. Filtering answers the question <b>"which rows do I want?"</b> It is different from pagination (which answers "which slice?") and different from sorting (which answers "in what order?"). All three work together, but they solve different problems.

<b>Where do filters come from?</b> Almost always from <b>query parameters</b> — the part of a URL after the \`?\`. For example:

\`\`\`
GET /products?category=shoes&color=red&maxPrice=100&brand=nike&inStock=true
\`\`\`

Each \`key=value\` pair is one filter. The server reads them, validates them, and turns them into a \`WHERE\` clause in SQL.

<b>Why does filtering exist?</b> Because users do not want the whole dataset. They want a relevant slice. In an e-commerce store, filtering is a core feature — customers expect to filter by price, brand, size, rating, availability, color. In an admin dashboard, filtering is how support agents find "all orders from last week that are still pending." In a logistics app, filtering is how a dispatcher finds "all deliveries scheduled for tomorrow in this city." Without filtering, every list page would be an unusable dump of everything.

<b>The simplest possible filter</b> is an equality match: \`?status=active\` becomes \`WHERE status = 'active'\`. That is fine for one filter, but real applications need more:

- <b>Multiple values:</b> \`?status=active,pending\` → \`WHERE status IN ('active', 'pending')\`
- <b>Ranges:</b> \`?minPrice=10&maxPrice=100\` → \`WHERE price BETWEEN 10 AND 100\`
- <b>Text match:</b> \`?name=phone\` → \`WHERE name ILIKE '%phone%'\` (case-insensitive partial match)
- <b>Boolean flags:</b> \`?inStock=true\` → \`WHERE stock > 0\`
- <b>Dates:</b> \`?createdAfter=2024-01-01\` → \`WHERE created_at >= '2024-01-01'\`

<b>Here is where beginners usually get confused.</b> They write one endpoint per filter combination. \`/products/red\`, \`/products/red/nike\`, \`/products/red/nike/under-100\`. This explodes into dozens of endpoints and is impossible to maintain. The correct approach is one endpoint that reads query parameters flexibly.

Let us walk through the levels.

<b>BEGINNER level:</b> A single equality filter.

\`\`\`typescript
// products.controller.ts
@Get()
findAll(@Query('category') category?: string) {
  return this.productsService.findAll(category);
}

// products.service.ts
async findAll(category?: string) {
  const where = category ? { category } : {};
  return this.productRepository.find({ where });
}
\`\`\`

This works for a single filter. If the client omits \`category\`, all products are returned. Simple, but it does not scale — add ten filters and the service becomes a mess of conditionals.

<b>INTERMEDIATE level:</b> A filter DTO with several optional fields.

\`\`\`typescript
// filter-products.dto.ts
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FilterProductsDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(100000)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  inStock?: boolean;
}

// products.service.ts
async findAll(filters: FilterProductsDto) {
  const where: FindOptionsWhere<Product> = {};

  if (filters.category) where.category = filters.category;
  if (filters.brand) where.brand = filters.brand;
  if (filters.inStock !== undefined) where.inStock = filters.inStock;

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = Between(
      filters.minPrice ?? 0,
      filters.maxPrice ?? 999999,
    );
  }

  return this.productRepository.find({ where });
}
\`\`\`

<b>Notice the pattern:</b> build the \`where\` object conditionally. If a filter is not provided, do not include it. This lets one endpoint handle any combination of filters. The DTO handles validation — if a client sends \`?minPrice=abc\`, the ValidationPipe rejects the request before it reaches the database.

<b>ADVANCED level:</b> Combining filters with pagination, sorting, and search — and doing it safely.

In a production e-commerce app, the query is usually something like:

\`\`\`
GET /products?category=shoes&brand=nike&minPrice=50&maxPrice=150&inStock=true&sort=price:asc&page=1&limit=20&q=running
\`\`\`

That is five filters, a sort, a search, and pagination in one request. To handle this cleanly, you build the query with the QueryBuilder:

\`\`\`typescript
async findAll(filters: FilterProductsDto, pagination: PaginationDto) {
  const qb = this.productRepository.createQueryBuilder('product');

  // Equality filters
  if (filters.category) {
    qb.andWhere('product.category = :category', { category: filters.category });
  }
  if (filters.brand) {
    qb.andWhere('product.brand = :brand', { brand: filters.brand });
  }

  // Range filter
  if (filters.minPrice !== undefined) {
    qb.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
  }
  if (filters.maxPrice !== undefined) {
    qb.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
  }

  // Boolean filter
  if (filters.inStock === true) {
    qb.andWhere('product.stock > 0');
  }

  // Sorting, pagination, etc.
  qb.orderBy('product.createdAt', 'DESC');
  qb.skip((pagination.page - 1) * pagination.limit);
  qb.take(pagination.limit);

  return qb.getManyAndCount();
}
\`\`\`

<b>Critical safety note: use parameterized queries.</b> \`qb.andWhere('product.category = :category', { category: ... })\` sends the value as a parameter, so the database treats it as data, not as SQL. Never do this:

\`\`\`typescript
// DANGER: SQL INJECTION
qb.andWhere(\`product.category = '\${filters.category}'\`);
\`\`\`

If a malicious user sends \`?category='; DROP TABLE products; --\`, the naive version will destroy your table. Parameterized queries prevent this entirely.

<b>What about filters that must be "in" a list?</b> For "show products in any of these categories":

\`\`\`typescript
if (filters.categories?.length) {
  qb.andWhere('product.category IN (:...categories)', {
    categories: filters.categories,
  });
}
\`\`\`

\`IN\` is efficient when the list is short. Keep it under a few hundred items.

<b>What about optional date filters?</b> Same pattern:

\`\`\`typescript
if (filters.createdAfter) {
  qb.andWhere('product.createdAt >= :createdAfter', {
    createdAfter: filters.createdAfter,
  });
}
\`\`\`

<b>When should you NOT use filtering this way?</b>
- <b>When the filter is a full-text search.</b> \`ILIKE '%term%'\` is slow on large tables. Lesson 3 covers full-text search.
- <b>When filter combinations are truly unknown at design time.</b> Some BI tools allow arbitrary filters. For that, you need a filter DSL with strict validation — never let clients write raw SQL fragments.
- <b>When the filter has security implications.</b> Always add tenant/ownership filters on the server. Never trust the client to include \`?tenantId=5\` — that must come from the authenticated user.

<b>What can go wrong?</b>
- <b>SQL injection.</b> String concatenation into WHERE clauses. Always use parameters.
- <b>Unbounded \`IN\` lists.</b> A client sends \`?ids=1,2,3,...,100000\`. Validate the length.
- <b>Missing indexes.</b> Filters on unindexed columns become full table scans. Add indexes for common filter combinations.
- <b>Ignoring tenant isolation.</b> A multitenant app that forgets to filter by tenant leaks data across customers.
- <b>Inconsistent filter behavior.</b> One endpoint treats \`?inStock=\` (empty string) as true, another as false, another as "ignore." Define a convention and stick to it.
- <b>Forgetting to whitelist.</b> A client sends \`?role=admin\` to a search endpoint. If you accidentally map every query param to a filter, you have just exposed admin-only data.

<b>How this fits into a real application:</b> in an e-commerce backend, the product listing endpoint accepts filters like \`category\`, \`brand\`, \`priceRange\`, \`rating\`, \`inStock\`, and \`shipsIn\`. Each filter is validated and mapped to a WHERE clause. The same endpoint also supports sorting, search, and pagination. This single endpoint powers the storefront, the admin dashboard, and the mobile app — all with the same query parameters, all validated by the same DTO.

Filtering is the foundation of a useful list API. Get it right, and every other feature (search, sorting, pagination) builds cleanly on top.
      `,
      diagram: `
Request: GET /products?category=shoes&minPrice=50&maxPrice=150&inStock=true

        |
        v
+------------------------------+
|   Controller                 |
|   @Query() dto: FilterDto    |
+------------------------------+
        |
        v
+------------------------------+
|   ValidationPipe             |
|   - reject invalid values    |
|   - coerce strings to types  |
+------------------------------+
        |
        v
+------------------------------+
|   Service                    |
|   build where clause from    |
|   provided filters only      |
+------------------------------+
        |
        v
+------------------------------+
|   Repository / QueryBuilder  |
|   AND condition per filter   |
|   parameterized values       |
+------------------------------+
        |
        v
+------------------------------+
|   PostgreSQL                 |
|   uses index on              |
|   (category, price, stock)   |
+------------------------------+
        |
        v
  Response: matching rows only

Rule: build WHERE from the filters that are present.
Never trust client input. Always parameterize.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// FILTERING & QUERY PARAMETERS — BEGINNER TO ADVANCED
// ============================================

// ---------- BEGINNER ----------
// Single equality filter inline in the controller.
@Get()
findAll(@Query('category') category?: string) {
  return this.productsService.findAll(category);
}

async findAll(category?: string) {
  const where = category ? { category } : {};
  return this.productRepository.find({ where });
}

// ---------- INTERMEDIATE ----------
// DTO with multiple optional filters.

// filter-products.dto.ts
import { Type } from 'class-transformer';
import {
  IsBoolean, IsInt, IsOptional, IsString, Max, Min,
} from 'class-validator';

export class FilterProductsDto {
  @IsOptional() @IsString()
  category?: string;

  @IsOptional() @IsString()
  brand?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  minPrice?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Max(100000)
  maxPrice?: number;

  @IsOptional() @Type(() => Boolean) @IsBoolean()
  inStock?: boolean;
}

async findAll(filters: FilterProductsDto) {
  const where: FindOptionsWhere<Product> = {};

  if (filters.category) where.category = filters.category;
  if (filters.brand) where.brand = filters.brand;
  if (filters.inStock !== undefined) where.inStock = filters.inStock;

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = Between(filters.minPrice ?? 0, filters.maxPrice ?? 999999);
  }

  return this.productRepository.find({ where });
}

// ---------- ADVANCED (PRODUCTION) ----------
// QueryBuilder for combined filters with pagination and sorting.
// Every value is parameterized to prevent SQL injection.

async findAll(
  filters: FilterProductsDto,
  pagination: PaginationDto,
  sort: SortDto,
) {
  const qb = this.productRepository.createQueryBuilder('product');

  // Equality filters
  if (filters.category) {
    qb.andWhere('product.category = :category', {
      category: filters.category,
    });
  }
  if (filters.brand) {
    qb.andWhere('product.brand = :brand', { brand: filters.brand });
  }

  // Range filter
  if (filters.minPrice !== undefined) {
    qb.andWhere('product.price >= :minPrice', {
      minPrice: filters.minPrice,
    });
  }
  if (filters.maxPrice !== undefined) {
    qb.andWhere('product.price <= :maxPrice', {
      maxPrice: filters.maxPrice,
    });
  }

  // Boolean filter
  if (filters.inStock === true) {
    qb.andWhere('product.stock > 0');
  }

  // Sorting (whitelisted columns only)
  qb.orderBy(\`product.\${sort.column}\`, sort.direction.toUpperCase() as 'ASC' | 'DESC');
  qb.addOrderBy('product.id', 'DESC'); // deterministic tie-breaker

  // Pagination
  qb.skip((pagination.page - 1) * pagination.limit);
  qb.take(pagination.limit);

  const [items, total] = await qb.getManyAndCount();

  return {
    items,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
      hasNextPage: pagination.page * pagination.limit < total,
      hasPreviousPage: pagination.page > 1,
    },
  };
}

// Required indexes for common filter combinations:
// CREATE INDEX idx_products_category_price ON products (category, price);
// CREATE INDEX idx_products_brand_price    ON products (brand, price);
// CREATE INDEX idx_products_stock_price    ON products (stock, price);

// ---------- SAFETY: parameterized vs unsafe ----------
// SAFE
qb.andWhere('product.category = :category', { category: filters.category });

// DANGEROUS — SQL injection
// qb.andWhere(\`product.category = '\${filters.category}'\`);
      ` },
      keyTakeaways: [
        "Filtering answers 'which rows?' and is separate from pagination ('which slice?') and sorting ('in what order?').",
        "Use query parameters plus a DTO to describe filters; let `ValidationPipe` reject invalid values.",
        "Build the `WHERE` clause conditionally — only include filters the client actually provided.",
        "Always use parameterized queries (`:param`) — never concatenate user input into SQL strings.",
        "Whitelist sortable columns and filterable fields explicitly; never map arbitrary query params to database columns.",
        "Add indexes on the columns used in common filter combinations, especially `(filter_column, sort_column)`.",
        "Enforce tenant/ownership filters on the server side — never trust a client-supplied `tenantId`.",
      ],
      commonMistakes: [
        "<b>String-concatenating filter values into SQL.</b> `\"WHERE category = '\" + category + \"'\"` is a SQL injection hole. A single malicious request can drop your tables. Always use parameters.",
        "<b>Mapping every query parameter to a filter automatically.</b> If you iterate over `req.query` and blindly add WHERE clauses, a client can filter on `password`, `role`, or `isAdmin` and see data they should not access.",
        "<b>Not validating range filters.</b> A client sends `?minPrice=abc` or `?minPrice=-999999`. Without DTO validation, this either crashes the query or returns meaningless results.",
        "<b>Unbounded `IN` lists.</b> `?ids=1,2,...,50000` forces PostgreSQL to build a huge parameter list and can time out. Cap the array length in the DTO (e.g. `@ArrayMaxSize(100)`).",
        "<b>Missing indexes.</b> Filters on unindexed columns turn every request into a full table scan. As the table grows, response time goes from milliseconds to seconds.",
        "<b>Forgetting tenant isolation.</b> Multi-tenant apps must always add `WHERE tenant_id = :currentTenant` from the authenticated session, never from the query string.",
      ],
      quiz: [
        {
          question:
            "A client sends `GET /products?category=shoes&minPrice=abc`. What should the server do?",
          options: [
            "Treat minPrice as 0.",
            "Ignore the invalid value and return all products.",
            "Return 400 because the DTO validation rejects the non-numeric value.",
            "Crash with an internal error.",
          ],
          correctIndex: 2,
          explanation:
            "The DTO uses `@Type(() => Number)` and `@IsInt()`. The ValidationPipe runs first and rejects the request with a 400 before it ever reaches the service. Never let invalid input reach the database layer.",
        },
        {
          question:
            "Why is `qb.andWhere('product.category = :category', { category })` safer than `qb.andWhere(\\`product.category = '${category}'\\`)`?",
          options: [
            "It is faster.",
            "It uses parameterized binding, so the database treats the value as data, not as SQL. The other version is vulnerable to SQL injection.",
            "It is shorter.",
            "The two are equivalent.",
          ],
          correctIndex: 1,
          explanation:
            "Parameterized queries send the value separately from the SQL text. PostgreSQL parses the query structure first, then binds the parameter as a literal value. No matter what the client sends, it cannot change the query's structure.",
        },
        {
          question:
            "You want to support `?brands=nike,adidas,puma`. Which SQL construct best expresses this?",
          options: [
            "Three OR conditions in the WHERE clause.",
            "`WHERE brand IN (:...brands)` with the array parameterized.",
            "Three separate queries merged in JavaScript.",
            "A regular expression match.",
          ],
          correctIndex: 1,
          explanation:
            "`IN (:...brands)` is the standard way to express 'any of these values'. It is efficient, readable, and safe when parameterized. Keep the array small (a few hundred max) for performance.",
        },
        {
          question:
            "Why must you not let clients supply `tenantId` as a filter on a multi-tenant endpoint?",
          options: [
            "Because it is not a valid query parameter.",
            "Because a malicious client could pass another tenant's id and read data that belongs to a different organization.",
            "Because it slows down the query.",
            "Because it is not indexed.",
          ],
          correctIndex: 1,
          explanation:
            "Tenant isolation must be enforced from the authenticated session (e.g. from the JWT), never from client input. If a client can specify `tenantId`, they can read any tenant's data.",
        },
      ],
    },
    {
      id: "day-48-lesson-2",
      title: "Sorting and Query Operators",
      durationMinutes: 25,
      explanation: `
<b>Imagine a customer browsing an e-commerce catalog.</b> They have filtered down to "red Nike running shoes." Now they want to sort by price, lowest first. Another customer wants to sort by newest arrivals. A third wants to see top-rated products first. Same list of products, three different orderings.

<b>Sorting is the answer to "in what order?"</b> It is closely tied to filtering (you sort the filtered results) and pagination (you page through a specific ordering). Sorting is what makes the result set useful rather than arbitrary.

But sorting alone is not enough. Real applications need richer conditions than equality: <i>price between 50 and 150</i>, <i>rating at least 4</i>, <i>name starts with "phone"</i>, <i>created in the last 7 days</i>. These are expressed with <b>query operators</b> — the comparison vocabulary of SQL and TypeORM.

<b>Sorting basics.</b> Every sort has two parts: the column and the direction.

\`\`\`
?sort=price:asc     -> ORDER BY price ASC
?sort=createdAt:desc -> ORDER BY created_at DESC
\`\`\`

That is the API-level syntax. Inside the service, you map the string to an actual column and direction.

<b>Why sorting matters for pagination.</b> Remember from Day 47: pagination without an \`ORDER BY\` is unpredictable. Rows can shift between requests, causing duplicates and missed items. Sorting is not just a nice UX feature — it is a <b>correctness requirement</b> for pagination. The database must have a stable, deterministic ordering, and that ordering must include a unique tie-breaker like \`id\`.

<b>Why does sorting exist?</b> Because different users want different orderings. Some want cheapest first, some want newest, some want best-rated. Sorting turns one dataset into many useful views without duplicating data.

<b>When should you NOT allow arbitrary sorting?</b> When the sort column is not indexed, sorting a million rows becomes slow. When the column is user-supplied and not whitelisted, you are one step away from SQL injection. When the sort is unstable (like \`updated_at\` on a table with frequent updates), pagination breaks. Whitelist allowed sort columns and always add a tie-breaker.

<b>Now let's talk about query operators.</b> Equality is only one of many comparisons:

- <b>Equality:</b> \`= :value\` → "status is active"
- <b>Not equal:</b> \`!= :value\` or \`<>\` → "status is not archived"
- <b>Greater/Less than:</b> \`> :value\`, \`< :value\` → "price above 100"
- <b>Greater/Less than or equal:</b> \`>= :value\`, \`<= :value\` → "rating at least 4"
- <b>Between:</b> \`BETWEEN :min AND :max\` → "price between 50 and 150"
- <b>In:</b> \`IN (:...values)\` → "category is any of shoes, bags, hats"
- <b>Not in:</b> \`NOT IN (:...values)\` → "exclude these brands"
- <b>Null checks:</b> \`IS NULL\`, \`IS NOT NULL\` → "has a discount"
- <b>Like:</b> \`LIKE 'abc%'\`, \`ILIKE '%abc%'\` → "name contains 'phone'"
- <b>Array contains (Postgres):</b> \`@>\` → "tags contain 'sale'"
- <b>JSON key exists (Postgres):</b> \`?\` or \`->>\` → "metadata has key 'color'"

In TypeORM, these map to helpers:

\`\`\`typescript
import {
  Equal, Not, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual,
  Between, In, Not, IsNull, Like, ILike,
} from 'typeorm';

where.price = Between(50, 150);
where.category = In(['shoes', 'bags']);
where.brand = Not('nike');
where.discount = IsNull();
where.name = ILike('%phone%');
\`\`\`

<b>Here is where beginners usually get confused.</b> They think \`LIKE\` and \`ILIKE\` are fine for any text search. \`LIKE 'abc%'\` (prefix) can use an index. \`LIKE '%abc%'\` (substring) cannot use a normal B-tree index — it has to scan every row. Lesson 3 covers how to search text efficiently.

Another confusion: they use \`BETWEEN\` for dates without realizing it is inclusive. \`BETWEEN '2024-01-01' AND '2024-01-31'\` excludes times after midnight on Jan 31. For date ranges, it is safer to use \`>= start AND < end\` with a half-open interval.

Let us look at the levels.

<b>BEGINNER level:</b> A single fixed sort.

\`\`\`typescript
async findAll() {
  return this.productRepository.find({
    order: { createdAt: 'DESC' },
  });
}
\`\`\`

Simple and predictable. The client cannot change the sort.

<b>INTERMEDIATE level:</b> Client-controlled sort with a whitelist.

\`\`\`typescript
// sort.dto.ts
export class SortDto {
  @IsOptional()
  @IsIn(['price', 'createdAt', 'rating', 'name'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc' = 'desc';
}

// products.service.ts
async findAll(sort: SortDto) {
  return this.productRepository.find({
    order: {
      [sort.sortBy]: sort.sortDir.toUpperCase(),
      id: 'DESC', // tie-breaker for stable pagination
    },
  });
}
\`\`\`

<b>The \`@IsIn\` decorator is critical.</b> Without it, a client could send \`?sortBy=password\` and sort by a column they should not see — a subtle data leak. Whitelisting the sortable columns prevents this.

<b>ADVANCED level:</b> A full sorting + filtering + pagination setup with multiple operators, and using QueryBuilder for complex conditions.

\`\`\`typescript
async findAll(
  filters: FilterProductsDto,
  sort: SortDto,
  pagination: PaginationDto,
) {
  const qb = this.productRepository.createQueryBuilder('product');

  // Multiple operators in one query
  if (filters.category) {
    qb.andWhere('product.category = :category', { category: filters.category });
  }
  if (filters.brands?.length) {
    qb.andWhere('product.brand IN (:...brands)', { brands: filters.brands });
  }
  if (filters.minPrice !== undefined) {
    qb.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
  }
  if (filters.maxPrice !== undefined) {
    qb.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
  }
  if (filters.minRating !== undefined) {
    qb.andWhere('product.rating >= :minRating', { minRating: filters.minRating });
  }
  if (filters.excludeBrand) {
    qb.andWhere('product.brand != :excludeBrand', { excludeBrand: filters.excludeBrand });
  }
  if (filters.hasDiscount === true) {
    qb.andWhere('product.discount IS NOT NULL');
  }
  if (filters.createdAfter) {
    qb.andWhere('product.createdAt >= :createdAfter', { createdAfter: filters.createdAfter });
  }
  if (filters.createdBefore) {
    qb.andWhere('product.createdAt < :createdBefore', { createdBefore: filters.createdBefore });
  }

  // Sort with stable tie-breaker
  qb.orderBy(\`product.\${sort.sortBy}\`, sort.sortDir.toUpperCase() as 'ASC' | 'DESC');
  qb.addOrderBy('product.id', 'DESC');

  // Pagination
  qb.skip((pagination.page - 1) * pagination.limit);
  qb.take(pagination.limit);

  const [items, total] = await qb.getManyAndCount();

  return { items, meta: { total, page: pagination.page, limit: pagination.limit } };
}
\`\`\`

<b>Notice the pattern for date ranges.</b> Use \`>=\` for the start and \`<\` for the end — a half-open interval. This avoids the "midnight boundary" problem where \`BETWEEN Jan 1 AND Jan 31\` excludes anything after 00:00:00 on Jan 31.

<b>Performance considerations for sorting:</b>

A sort is only fast if there is an index that matches it. For a query like:

\`\`\`sql
SELECT * FROM products
WHERE category = 'shoes' AND price >= 50
ORDER BY price ASC
LIMIT 20;
\`\`\`

The ideal index is:
\`\`\`sql
CREATE INDEX idx_products_cat_price ON products (category, price);
\`\`\`

The equality-filtered column comes first, then the sort column. PostgreSQL can then seek to \`category = 'shoes'\` and read \`price\` in order without sorting. This is called a "covering index for the sort".

If the sort column is not indexed, PostgreSQL does a \`Seq Scan\` + \`Sort\`. On a million rows, that is seconds per request.

<b>What about multi-column sorts?</b> Say you want "sort by rating DESC, then price ASC." PostgreSQL supports this directly:

\`\`\`sql
ORDER BY rating DESC, price ASC
\`\`\`

But the index must match the exact column order for the sort to be index-assisted: \`(rating DESC, price ASC)\`. Mixed directions in one index require PostgreSQL 12+ for optimal use.

<b>What about sorting by computed values?</b> For example, "sort by discount percentage" where \`discountPercentage = (originalPrice - price) / originalPrice\`. The index cannot help unless you store the computed value as a column and index it. This is called a <b>materialized/denormalized column</b>. Compute it once on write, index it, and sort instantly.

<b>What can go wrong?</b>
- <b>Unstable sort without a tie-breaker.</b> Two products with the same price have no defined order. Pagination breaks. Always add \`id\` (or another unique column) as the last sort key.
- <b>Sorting by unindexed columns.</b> Fine at 10K rows, catastrophic at 10M rows.
- <b>Whitelist missing.</b> A client sorts by \`password_hash\` and gets a timing signal that leaks info. Always \`@IsIn\` the sortable columns.
- <b>Ignoring sort direction validation.</b> A client sends \`?sortDir=DROP TABLE\`. \`@IsIn(['asc', 'desc'])\` prevents this.
- <b>Mixing \`NULL\` ordering.</b> PostgreSQL defaults to \`NULLS LAST\` for ASC and \`NULLS FIRST\` for DESC. Other databases differ. If your API must behave consistently, specify \`NULLS LAST\` explicitly.
- <b>Assuming sort order is stable across requests.</b> Even with a tie-breaker, high-concurrency writes can shift rows between requests. This is why cursor pagination is preferred for feeds.

<b>Real-world application:</b> in a food delivery app, the restaurant listing endpoint supports filters (cuisine, price range, delivery time), sorting (rating, distance, delivery fee, popularity), and pagination. Sorting is whitelisted to those four columns. Each has a supporting index. A "sort by distance" query uses PostGIS to compute distance and sorts by the result — but because it is expensive, the app caches the result for popular locations.

<b>How experienced engineers think:</b> sorting is not just a UX feature — it is a contract with the database. Every sortable column must be whitelisted, indexed, and paired with a unique tie-breaker. If any of those are missing, sorting works in development and breaks in production.

Query operators are the vocabulary of filtering. Master them, and you can express almost any business rule as a safe, fast query.
      `,
      diagram: `
Sorting + Query Operators

  Request: GET /products
    ?minPrice=50
    &maxPrice=150
    &minRating=4
    &brands=nike,adidas
    &excludeBrand=puma
    &hasDiscount=true
    &sort=price:asc
    &page=1&limit=20

        |
        v
+-------------------------------+
|  ValidationPipe + DTOs        |
|  - @IsIn for sortBy           |
|  - @IsIn for sortDir          |
|  - @Min/@Max for numerics     |
|  - @ArrayMaxSize for IN lists |
+-------------------------------+
        |
        v
+-------------------------------+
|  Service                      |
|  operators applied:           |
|   >= , <= , IN , != ,         |
|   IS NOT NULL , >= , <        |
+-------------------------------+
        |
        v
+-------------------------------+
|  QueryBuilder                 |
|  ORDER BY price ASC, id DESC  |
|  LIMIT 20 OFFSET 0            |
+-------------------------------+
        |
        v
+-------------------------------+
|  Index used:                  |
|  (brand, price) or            |
|  (category, price) or         |
|  (rating DESC, price ASC)     |
+-------------------------------+
        |
        v
  Fast, deterministic result set

Key rules:
  - Whitelist sort columns (@IsIn)
  - Always add a unique tie-breaker (id)
  - Index (filter columns..., sort column)
  - Use half-open date ranges [start, end)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// SORTING & QUERY OPERATORS — BEGINNER TO ADVANCED
// ============================================

// ---------- BEGINNER ----------
// Fixed sort, no client control.
async findAll() {
  return this.productRepository.find({
    order: { createdAt: 'DESC' },
  });
}

// ---------- INTERMEDIATE ----------
// Whitelisted client-controlled sort with tie-breaker.

// sort.dto.ts
import { IsIn, IsOptional } from 'class-validator';

export class SortDto {
  @IsOptional()
  @IsIn(['price', 'createdAt', 'rating', 'name'])
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir: 'asc' | 'desc' = 'desc';
}

async findAll(sort: SortDto) {
  return this.productRepository.find({
    order: {
      [sort.sortBy]: sort.sortDir.toUpperCase() as 'ASC' | 'DESC',
      id: 'DESC', // stable tie-breaker for pagination
    },
  });
}

// ---------- ADVANCED (PRODUCTION) ----------
// Combined operators + sort + pagination with QueryBuilder.

async findAll(
  filters: FilterProductsDto,
  sort: SortDto,
  pagination: PaginationDto,
) {
  const qb = this.productRepository.createQueryBuilder('product');

  // Equality
  if (filters.category) {
    qb.andWhere('product.category = :category', {
      category: filters.category,
    });
  }

  // IN list
  if (filters.brands?.length) {
    qb.andWhere('product.brand IN (:...brands)', {
      brands: filters.brands,
    });
  }

  // Range
  if (filters.minPrice !== undefined) {
    qb.andWhere('product.price >= :minPrice', {
      minPrice: filters.minPrice,
    });
  }
  if (filters.maxPrice !== undefined) {
    qb.andWhere('product.price <= :maxPrice', {
      maxPrice: filters.maxPrice,
    });
  }

  // Not equal
  if (filters.excludeBrand) {
    qb.andWhere('product.brand != :excludeBrand', {
      excludeBrand: filters.excludeBrand,
    });
  }

  // Null check
  if (filters.hasDiscount === true) {
    qb.andWhere('product.discount IS NOT NULL');
  }

  // Half-open date range [start, end)
  if (filters.createdAfter) {
    qb.andWhere('product.createdAt >= :createdAfter', {
      createdAfter: filters.createdAfter,
    });
  }
  if (filters.createdBefore) {
    qb.andWhere('product.createdAt < :createdBefore', {
      createdBefore: filters.createdBefore,
    });
  }

  // Sort with stable tie-breaker
  qb.orderBy(
    \`product.\${sort.sortBy}\`,
    sort.sortDir.toUpperCase() as 'ASC' | 'DESC',
  );
  qb.addOrderBy('product.id', 'DESC');

  // Pagination
  qb.skip((pagination.page - 1) * pagination.limit);
  qb.take(pagination.limit);

  const [items, total] = await qb.getManyAndCount();

  return {
    items,
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
}

// Supporting indexes:
// CREATE INDEX idx_products_cat_price     ON products (category, price);
// CREATE INDEX idx_products_brand_price   ON products (brand, price);
// CREATE INDEX idx_products_rating_price  ON products (rating DESC, price ASC);
// CREATE INDEX idx_products_created_id    ON products (created_at DESC, id DESC);

// Postgres-specific operators (advanced):
// - Array contains: WHERE tags @> ARRAY['sale']
// - JSON key exists: WHERE metadata ? 'color'
// - Full-text search: WHERE to_tsvector(name) @@ to_tsquery('phone')

// TypeORM shortcuts for common operators:
import {
  Between, In, Not, IsNull, ILike, MoreThanOrEqual, LessThan,
} from 'typeorm';

// Example: build \`where\` object without QueryBuilder
const where = {
  category: In(['shoes', 'bags']),
  brand: Not('nike'),
  price: Between(50, 150),
  rating: MoreThanOrEqual(4),
  discount: IsNull(),
  name: ILike('%phone%'), // NOTE: slow, see lesson 3
};
      ` },
      keyTakeaways: [
        "Sorting answers 'in what order?' and must always include a unique tie-breaker like `id` for stable pagination.",
        "Whitelist sortable columns with `@IsIn` — never let clients sort by arbitrary database columns.",
        "Use `IN (:...values)` for 'any of these' and `BETWEEN` for ranges, but be careful with date inclusivity.",
        "Prefer half-open date ranges `>= start AND < end` over `BETWEEN` for date filtering.",
        "Index `(equality_filter_column, sort_column)` so PostgreSQL can serve sorted results without an extra sort step.",
        "`LIKE 'abc%'` can use an index; `LIKE '%abc%'` cannot. For substring search on large tables, use full-text search or a trigram index.",
        "PostgreSQL-specific operators (`@>`, `?`, `@@`) unlock array, JSON, and full-text capabilities when a plain equality filter is not enough.",
      ],
      commonMistakes: [
        "<b>Allowing arbitrary sort columns.</b> A client sends `?sortBy=password_hash` and gets a timing signal that leaks information. Always whitelist sortable columns with `@IsIn`.",
        "<b>Forgetting the tie-breaker.</b> Without `id` (or another unique column) as the last sort key, rows with identical values on the primary sort column have no defined order, breaking pagination.",
        "<b>Using `BETWEEN` for dates.</b> `BETWEEN '2024-01-01' AND '2024-01-31'` excludes anything after midnight on Jan 31. Use `>= start AND < end` instead.",
        "<b>Sorting by unindexed columns.</b> Works in development, catastrophically slow in production. Add the supporting index before the table gets big.",
        "<b>Using `LIKE '%term%'` on large tables.</b> A leading wildcard forces a full table scan. Use full-text search (`tsvector`) or `pg_trgm` for substring search.",
        "<b>Mixing `NULLS FIRST` / `NULLS LAST` defaults across databases.</b> PostgreSQL defaults differ from other engines. Specify NULLS ordering explicitly if your API contract requires consistency.",
        "<b>Unbounded `IN` lists.</b> A client sends 10,000 IDs. Cap the list length with `@ArrayMaxSize(100)`.",
      ],
      quiz: [
        {
          question:
            "Why is `@IsIn(['price', 'createdAt', 'rating'])` important on a `sortBy` DTO field?",
          options: [
            "It makes the response faster.",
            "It prevents clients from sorting by arbitrary columns, which could leak information or cause unindexed slow queries.",
            "It is required by TypeORM.",
            "It removes duplicates.",
          ],
          correctIndex: 1,
          explanation:
            "Without a whitelist, a client could sort by any column — including sensitive ones (leaking info) or unindexed ones (causing slow scans). `@IsIn` restricts sort columns to a safe, indexed set.",
        },
        {
          question:
            "You want to filter products created in January 2024. Which is the safest way to express this?",
          options: [
            "`BETWEEN '2024-01-01' AND '2024-01-31'`",
            "`>= '2024-01-01' AND < '2024-02-01'`",
            "`= '2024-01'`",
            "`LIKE '2024-01%'`",
          ],
          correctIndex: 1,
          explanation:
            "The half-open interval `[start, end)` includes everything from 00:00:00 on Jan 1 through 23:59:59.999 on Jan 31, without accidentally excluding Jan 31 after midnight. `BETWEEN` includes both endpoints and is easy to misuse with dates.",
        },
        {
          question:
            "You run `SELECT * FROM products WHERE name LIKE '%phone%' LIMIT 20` on a 5-million-row table. Why is this slow?",
          options: [
            "Because `LIKE` is deprecated.",
            "Because the leading wildcard `%` prevents the use of a standard B-tree index, forcing a full table scan.",
            "Because the table has too many columns.",
            "Because PostgreSQL cannot use LIMIT with LIKE.",
          ],
          correctIndex: 1,
          explanation:
            "A B-tree index can only be used when the pattern has a fixed prefix, like `'phone%'`. A leading `%` makes the pattern unable to use the index, so the database must check every row. Use full-text search or `pg_trgm` for substring search.",
        },
        {
          question:
            "You sort products by `price DESC` and paginate with `LIMIT 20 OFFSET 40`. Why must you also add `id DESC` as a secondary sort?",
          options: [
            "Because `price` is not indexed.",
            "Because multiple products can have the same price, and without a unique tie-breaker the order among them is undefined, which breaks pagination.",
            "Because PostgreSQL requires two sort keys.",
            "Because it speeds up the query.",
          ],
          correctIndex: 1,
          explanation:
            "Rows with the same price have no defined order. Between two page requests, they can appear on different pages, causing duplicates or missing items. A unique tie-breaker like `id` makes the ordering deterministic.",
        },
      ],
    },
    {
      id: "day-48-lesson-3",
      title: "Search and Full-Text Search",
      durationMinutes: 28,
      explanation: `
<b>Imagine you are building the search bar for an e-commerce site.</b> A user types "wireless bluetooth headphones" and expects to see relevant products. Not just products with the exact phrase "wireless bluetooth headphones" — products that contain those words in any form: "Bluetooth Wireless Headphones", "Wireless Headphones (Bluetooth)", "bluetooth headphones wireless", "Headphones — Bluetooth, Wireless". Users do not type queries in exact database matches. They type naturally, with synonyms, word order variations, plurals, and typos.

This is where <b>search</b> diverges from simple filtering. Filtering says "category = shoes." Searching says "find things relevant to this text." Different problem, different tools.

<b>Why does search exist?</b> Because users do not know the exact field values. They know what they <i>mean</i>. Search bridges the gap between natural language and structured data. It is what makes "show me cool sneakers under $100" work — a query with an intent, not a schema.

<b>The naive approach: LIKE.</b> Most developers start here:

\`\`\`sql
SELECT * FROM products WHERE name ILIKE '%headphones%';
\`\`\`

This works for tiny datasets. It fails at scale for three reasons:
1. <b>No index use.</b> The leading \`%\` forces a full table scan.
2. <b>No word awareness.</b> It cannot match "headphone" (singular) when the user typed "headphones" (plural), or rank results by relevance.
3. <b>No ranking.</b> Every row that matches is treated equally. In reality, some are more relevant than others.

<b>The middle step: pg_trgm (trigram search).</b> PostgreSQL has an extension called \`pg_trgm\` that breaks text into three-character chunks and indexes them. This makes \`ILIKE '%term%'\` fast — as long as the term is at least a few characters long. Trigrams also enable fuzzy matching (typo tolerance):

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_products_name_trgm
  ON products USING gin (name gin_trgm_ops);

-- Now this can use the index:
SELECT * FROM products WHERE name ILIKE '%headphone%';

-- Fuzzy match: find names similar to 'headfone' (typo)
SELECT * FROM products
WHERE name % 'headfone'
ORDER BY similarity(name, 'headfone') DESC
LIMIT 20;
\`\`\`

Trigram search is a great step up from \`LIKE\` when you want substring matching plus typo tolerance without a separate search engine.

<b>The proper approach for large text: full-text search (FTS).</b> PostgreSQL has built-in full-text search using \`tsvector\` and \`tsquery\`. It is fast, indexable, and understands language (stemming, stop words, ranking). Here is how it works:

- \`tsvector\` is a prepared representation of a document — a sorted list of lexemes (normalized word stems) with positions.
- \`tsquery\` is a parsed query — a list of lexemes with boolean operators (\`&\`, \`|\`, \`!\`) and prefix matching (\`:*\`).
- \`@@\` is the "matches" operator.
- \`ts_rank\` returns a relevance score.

A quick example:

\`\`\`sql
-- Convert a product name into a searchable vector
SELECT to_tsvector('english', 'Wireless Bluetooth Headphones');

-- Parse a user query
SELECT to_tsquery('english', 'wireless & bluetooth & headphone');

-- Match and rank
SELECT id, name,
       ts_rank(to_tsvector('english', name), to_tsquery('english', 'wireless & bluetooth')) AS rank
FROM products
WHERE to_tsvector('english', name) @@ to_tsquery('english', 'wireless & bluetooth')
ORDER BY rank DESC
LIMIT 20;
\`\`\`

<b>Notice the "english" argument.</b> That is the language configuration — it determines the stemming rules and stop words. \`"headphones"\` stems to \`"headphone"\`, so a query for "headphone" matches. \`"running"\` stems to \`"run"\`, so a query for "run" matches. Stop words like "the", "a", "and" are ignored.

<b>Performance: do not compute tsvector on every query.</b> The expression \`to_tsvector(name)\` above is expensive. In production you store a \`tsvector\` column and index it:

\`\`\`sql
-- Add a tsvector column
ALTER TABLE products
  ADD COLUMN search_vector tsvector;

-- Populate it
UPDATE products
SET search_vector = to_tsvector('english', name || ' ' || COALESCE(description, ''));

-- Keep it up to date with a trigger, or compute it in your application on write
CREATE TRIGGER products_search_vector_update
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.english', name, description);

-- Index it
CREATE INDEX idx_products_search_vector ON products USING gin (search_vector);
\`\`\`

With this in place, the query becomes:

\`\`\`sql
SELECT id, name,
       ts_rank(search_vector, query) AS rank
FROM products,
     to_tsquery('english', 'wireless & bluetooth') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;
\`\`\`

And it is <b>fast</b> — a GIN index on \`tsvector\` can search millions of rows in milliseconds.

<b>Converting a user's natural query into a tsquery.</b> Users type "wireless bluetooth headphones," not "wireless & bluetooth & headphone." You need to convert:

\`\`\`typescript
function toTsQuery(raw: string): string {
  return raw
    .trim()
    .split(/\\s+/)
    .map((word) => word.replace(/[^\\p{L}\\p{N}]/gu, '')) // strip punctuation
    .filter(Boolean)
    .map((word) => \`\${word}:*\`) // prefix match
    .join(' & '); // require all words
}
\`\`\`

The \`:*\` suffix enables prefix matching, so "blue" matches "bluetooth". The \`&\` requires all terms to be present, which gives precise results. You could use \`|\` for looser OR-matching with ranking, or a mix like "all terms preferred but partial match accepted" via \`ts_rank\` weighting.

<b>Why does search exist as a separate concept from filtering?</b> Because filtering is exact and search is approximate. Filtering says "this attribute equals this value." Search says "this document is relevant to this text." The two are complementary — a real e-commerce query often combines both:

\`\`\`sql
SELECT * FROM products
WHERE search_vector @@ to_tsquery('english', 'wireless & headphone')
  AND category = 'audio'
  AND price BETWEEN 50 AND 200
ORDER BY ts_rank(search_vector, to_tsquery('english', 'wireless & headphone')) DESC
LIMIT 20;
\`\`\`

<b>When should you NOT use full-text search?</b>
- <b>For structured data.</b> If you know the exact field ("find user by email"), use equality — do not put email into an FTS index.
- <b>For very short strings.</b> FTS stems words, which is overkill for "SKU12345". Use a normal index.
- <b>For autocomplete or type-ahead.</b> FTS is not ideal for prefix-only queries with ranking. Use a dedicated prefix index (\`varchar_pattern_ops\` or \`pg_trgm\`) instead.
- <b>For complex relevance (facets, synonyms, multi-language, ML-based ranking).</b> This is where a dedicated engine like Elasticsearch or Meilisearch makes sense. PostgreSQL FTS is excellent up to a certain scale; beyond that, dedicated engines give more control and speed.

<b>How to choose the right search tool:</b>

| Situation | Tool |
|-----------|------|
| Exact match | \`WHERE col = :val\` (B-tree index) |
| Prefix match (\`abc%\`) | \`LIKE 'abc%'\` (B-tree with \`text_pattern_ops\`) |
| Substring match on a small table | \`LIKE '%abc%'\` (Seq Scan is fine) |
| Substring + typo tolerance | \`pg_trgm\` with GIN index |
| Natural language search with ranking | PostgreSQL full-text search (\`tsvector\`) |
| Massive scale, faceted search, multi-language, ML ranking | Elasticsearch / Meilisearch / Typesense |

<b>What can go wrong?</b>
- <b>Using \`LIKE '%term%'\` on huge tables.</b> Full table scans, slow queries, high CPU. Move to \`pg_trgm\` or FTS.
- <b>Computing \`to_tsvector\` at query time.</b> Should be materialized into a column and indexed.
- <b>Not handling empty or weird queries.</b> A user sends \`"   !!!   "\`. Your \`to_tsquery\` throws or matches everything. Sanitize input, default to a safe empty result.
- <b>Wrong language configuration.</b> Using \`'english'\` for Spanish content stems incorrectly. Match the language to the content.
- <b>Ignoring ranking.</b> Returning unranked results frustrates users. Always \`ORDER BY ts_rank DESC\` (or a blended score).
- <b>Not handling synonyms.</b> A user searches for "mobile" but your catalog says "phone." FTS does not do synonyms by default — you need a custom dictionary or an external engine.
- <b>Skipping stop words by accident.</b> FTS ignores common words like "the." If your query is only stop words, you get zero results. Handle that case.
- <b>Denial of service via expensive queries.</b> A user sends a 10,000-word query. Cap input length and reject huge queries.

<b>Real-world application:</b> in a marketplace app, the search bar combines multiple strategies:
1. Normalize the query: lowercase, strip punctuation, cap length.
2. Use PostgreSQL FTS with \`tsquery\` on a \`search_vector\` column indexed by GIN.
3. Apply structured filters (category, price, brand) as additional WHERE conditions.
4. Rank results by \`ts_rank\` combined with popularity (views, sales) and recency.
5. Fall back to \`pg_trgm\` similarity if FTS returns zero results (handles typos gracefully).
6. For very common queries, cache the top 20 results in Redis for 5 minutes.

<b>How experienced engineers think:</b> search is not one tool but a family of strategies. Choose the smallest tool that solves the problem. \`LIKE\` for a thousand rows, \`pg_trgm\` for tens of thousands, PostgreSQL FTS for millions, a dedicated engine for billions or for complex ranking. Do not reach for Elasticsearch when a GIN index would have sufficed.
      `,
      diagram: `
Search Strategy Spectrum

  Size of dataset / complexity
      |
      v
  [ Small: < 10K rows ]
    ILIKE '%term%'   (Seq Scan is fine)

  [ Medium: 10K - 1M rows ]
    pg_trgm GIN index
      - substring search
      - fuzzy match (typos)

  [ Large: 1M - 100M+ rows ]
    PostgreSQL Full-Text Search
      - tsvector column (stored, indexed GIN)
      - tsquery for user input
      - ts_rank for relevance

  [ Very large + complex ranking ]
    Elasticsearch / Meilisearch / Typesense

PostgreSQL FTS pipeline:

  product.name + product.description
          |
          v
  to_tsvector('english', ...)
          |
          v
  search_vector column (indexed GIN)
          |
          v
  WHERE search_vector @@ to_tsquery('english', :q)
          |
          v
  ORDER BY ts_rank(search_vector, query) DESC
          |
          v
  LIMIT 20

Example query parsing:
  user input:  "wireless bluetooth headphones"
  tsquery:     "wireless:* & bluetooth:* & headphone:*"
  matches:     "Bluetooth Wireless Headphones"
               "Wireless Headphones — Bluetooth Edition"
      `,
      codeExample: { title: "Example", code: `
// ============================================
// SEARCH & FULL-TEXT SEARCH — BEGINNER TO ADVANCED
// ============================================

// ---------- BEGINNER ----------
// Naive ILIKE — fine for small tables, slow at scale.
async search(query: string) {
  return this.productRepository
    .createQueryBuilder('p')
    .where('p.name ILIKE :q', { q: \`%\${query}%\` })
    .limit(20)
    .getMany();
}

// ---------- INTERMEDIATE: pg_trgm ----------
// Substring search + typo tolerance, indexable.

// Migration (raw SQL):
// CREATE EXTENSION IF NOT EXISTS pg_trgm;
// CREATE INDEX idx_products_name_trgm
//   ON products USING gin (name gin_trgm_ops);

async searchTrgm(query: string) {
  return this.productRepository
    .createQueryBuilder('p')
    .where('p.name % :q', { q: query }) // similarity operator
    .orderBy('similarity(p.name, :q)', 'DESC')
    .setParameter('q', query)
    .limit(20)
    .getMany();
}

// ---------- ADVANCED: PostgreSQL Full-Text Search ----------

// product.entity.ts — add a search_vector column
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // Stored tsvector column, indexed with GIN.
  // TypeORM has limited native support for tsvector, so we use a raw type.
  @Index('idx_products_search_vector', { synchronize: false })
  @Column({
    type: 'tsvector',
    select: false, // do not fetch by default; large and rarely needed
    nullable: true,
  })
  searchVector: string;
}

// products.service.ts
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Convert a natural-language query into a safe tsquery string.
  private buildTsQuery(raw: string): string | null {
    const cleaned = raw
      .trim()
      .slice(0, 200) // cap length to protect the DB
      .split(/\\s+/)
      .map((w) => w.replace(/[^\\p{L}\\p{N}]/gu, ''))
      .filter(Boolean);

    if (cleaned.length === 0) return null;

    return cleaned.map((w) => \`\${w}:*\`).join(' & ');
  }

  async search(rawQuery: string, limit = 20) {
    const tsQuery = this.buildTsQuery(rawQuery);
    if (!tsQuery) return { items: [], query: rawQuery };

    const items = await this.productRepository
      .createQueryBuilder('p')
      .where('p.searchVector @@ to_tsquery(:tsq)', { tsq: tsQuery })
      .orderBy('ts_rank(p.searchVector, to_tsquery(:tsq))', 'DESC')
      .addOrderBy('p.id', 'DESC') // stable tie-breaker
      .limit(limit)
      .getMany();

    return { items, query: rawQuery };
  }

  // Combined FTS + structured filters + pagination
  async searchWithFilters(
    rawQuery: string,
    filters: FilterProductsDto,
    pagination: PaginationDto,
  ) {
    const tsQuery = this.buildTsQuery(rawQuery);
    const qb = this.productRepository.createQueryBuilder('p');

    if (tsQuery) {
      qb.where('p.searchVector @@ to_tsquery(:tsq)', { tsq: tsQuery });
      qb.orderBy('ts_rank(p.searchVector, to_tsquery(:tsq))', 'DESC');
    } else {
      qb.orderBy('p.createdAt', 'DESC');
    }

    if (filters.category) {
      qb.andWhere('p.category = :category', { category: filters.category });
    }
    if (filters.minPrice !== undefined) {
      qb.andWhere('p.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      qb.andWhere('p.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    qb.addOrderBy('p.id', 'DESC');
    qb.skip((pagination.page - 1) * pagination.limit);
    qb.take(pagination.limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, query: rawQuery };
  }

  // Keep search_vector up to date on write.
  // This is often done in a service method or via a DB trigger.
  async createProduct(input: { name: string; description?: string }) {
    await this.productRepository.query(
      \`INSERT INTO products (name, description, search_vector)
       VALUES ($1, $2, to_tsvector('english', $1 || ' ' || COALESCE($2, '')))\`,
      [input.name, input.description ?? ''],
    );
  }
}

// ---------- Controller ----------
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  search(@Query('q') q: string = '') {
    return this.productsService.search(q);
  }

  @Get('search-with-filters')
  searchWithFilters(
    @Query('q') q: string = '',
    @Query() filters: FilterProductsDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.productsService.searchWithFilters(q, filters, pagination);
  }
}

// Recommended migrations:
// CREATE EXTENSION IF NOT EXISTS pg_trgm;
// ALTER TABLE products ADD COLUMN search_vector tsvector;
// UPDATE products SET search_vector =
//   to_tsvector('english', name || ' ' || COALESCE(description, ''));
// CREATE INDEX idx_products_search_vector
//   ON products USING gin (search_vector);
// CREATE INDEX idx_products_name_trgm
//   ON products USING gin (name gin_trgm_ops);
      ` },
      keyTakeaways: [
        "Search answers 'find things relevant to this text', distinct from filtering which answers 'which rows match these exact values'.",
        "`ILIKE '%term%'` scans the full table — acceptable only on small datasets.",
        "`pg_trgm` + GIN index makes substring and fuzzy search indexable; great for typo tolerance.",
        "PostgreSQL full-text search uses a stored `tsvector` column indexed by GIN, queried with `tsquery` via the `@@` operator.",
        "Always `ORDER BY ts_rank(...) DESC` — unranked search results feel random to users.",
        "Convert natural user input into a safe `tsquery` string; cap length and sanitize characters.",
        "Use the right tool for the scale: `LIKE` for small tables, `pg_trgm` for medium, FTS for large, dedicated engines for massive or complex ranking.",
      ],
      commonMistakes: [
        "<b>Computing `to_tsvector` at query time.</b> The expression is expensive on every row. Store it in a `tsvector` column, index it with GIN, and keep it updated on write.",
        "<b>Feeding raw user input into `to_tsquery`.</b> Users type spaces, quotes, and operators that break `to_tsquery`. Sanitize and construct a safe query string.",
        "<b>Forgetting to rank results.</b> Without `ts_rank`, FTS returns matches in arbitrary order. Users expect the most relevant items first.",
        "<b>Using FTS for prefix autocomplete.</b> FTS is designed for word-level search, not type-ahead. For prefix matching, use a B-tree index with `text_pattern_ops` or a `pg_trgm` index.",
        "<b>Ignoring empty or stop-word-only queries.</b> A query of only stop words ('the and a') yields no lexemes. Handle this by returning an empty result or falling back to a different strategy.",
        "<b>Wrong language configuration.</b> Using `'english'` on Spanish content stems incorrectly. Match the configuration to the content language.",
        "<b>No input length cap.</b> A 10,000-word query can be weaponized to slow the database. Cap query length on the server side.",
        "<b>Reaching for Elasticsearch too early.</b> PostgreSQL FTS handles millions of rows well. Introduce a dedicated search engine only when scale or ranking complexity demands it.",
      ],
      quiz: [
        {
          question:
            "Why is `ILIKE '%headphones%'` slow on a large table?",
          options: [
            "Because `ILIKE` is deprecated.",
            "Because the leading wildcard `%` prevents the use of a standard B-tree index, forcing a full table scan on every request.",
            "Because the query is too long.",
            "Because PostgreSQL caches it poorly.",
          ],
          correctIndex: 1,
          explanation:
            "B-tree indexes only help with fixed-prefix patterns like `'headphones%'`. A leading `%` means the database cannot seek; it must check every row. Use `pg_trgm` or full-text search for substring-style matching at scale.",
        },
        {
          question:
            "What is a `tsvector`?",
          options: [
            "A numeric score that ranks results.",
            "A stored representation of a document as a sorted list of normalized word stems, used for full-text search.",
            "A type of index.",
            "A query language.",
          ],
          correctIndex: 1,
          explanation:
            "`tsvector` is the searchable form of a document. It contains lexemes (stemmed, normalized words) with optional positions, produced by `to_tsvector`. It is what the FTS index stores.",
        },
        {
          question:
            "Why store `search_vector` in a column instead of computing `to_tsvector(name)` at query time?",
          options: [
            "Because PostgreSQL does not allow functions in WHERE clauses.",
            "Because computing it on every row on every query is expensive; storing it once and indexing it makes search fast.",
            "Because `tsvector` cannot be computed at query time.",
            "Because it is required by TypeORM.",
          ],
          correctIndex: 1,
          explanation:
            "Computing `to_tsvector` on every row for every search is far more expensive than doing it once on write and storing the result. A GIN index on the stored column makes lookups fast.",
        },
        {
          question:
            "Which tool is best for substring search with typo tolerance on a medium-sized table?",
          options: [
            "`LIKE '%term%'`",
            "`pg_trgm` with a GIN index",
            "A B-tree index on the text column",
            "`ORDER BY` only",
          ],
          correctIndex: 1,
          explanation:
            "`pg_trgm` breaks text into 3-character chunks and enables both substring matching and similarity-based fuzzy matching, all indexable with GIN. This handles typos gracefully and stays fast.",
        },
      ],
    },
    {
      id: "day-48-lesson-4",
      title: "Query Design and Performance",
      durationMinutes: 22,
      explanation: `
<b>Imagine you have built a beautiful products endpoint.</b> It supports filtering, sorting, search, and pagination. It works perfectly in development — 500 test products, responses come back in 8ms. Then the app launches, the product table grows to 3 million rows, and suddenly the same endpoint takes 4 seconds per request. The database CPU is at 100%. Users see timeouts.

What happened? The queries did not change. The data did. And the data is what makes queries fast or slow.

<b>Query design is the discipline of writing queries that stay fast as data grows.</b> It is a combination of three things:
1. <b>The query itself</b> — how it is written matters.
2. <b>The indexes</b> — which indexes exist and how well they match the query.
3. <b>The schema</b> — column types, normalization, and denormalization choices.

Get all three right and queries stay in milliseconds at any scale. Get any one wrong and you hit a wall.

<b>The single most important tool: EXPLAIN ANALYZE.</b> This is PostgreSQL's built-in query profiler. You prefix any query with it and get back a plan showing exactly how the database executed it:

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM products
WHERE category = 'shoes' AND price >= 50
ORDER BY price ASC
LIMIT 20;
\`\`\`

The output looks something like:

\`\`\`
Limit  (cost=0.43..15.87 rows=20 width=128) (actual time=0.031..0.084 rows=20 loops=1)
  ->  Index Scan using idx_products_cat_price on products
        (cost=0.43..7821.44 rows=2000 width=128) (actual time=0.028..0.075 rows=20 loops=1)
        Index Cond: ((category = 'shoes') AND (price >= 50))
Planning Time: 0.121 ms
Execution Time: 0.104 ms
\`\`\`

The key parts to read:
- <b>\`Index Scan\`</b> vs <b>\`Seq Scan\`</b>: Index means the query used an index. Seq means it scanned the whole table. Seq is fine on tiny tables and disastrous on big ones.
- <b>\`actual time\`</b>: Real execution time, in milliseconds.
- <b>\`rows\`</b>: How many rows the step processed.
- <b>\`cost\`</b>: Estimated cost in arbitrary units. Only useful for comparing plans.
- <b>\`Execution Time\`</b>: Total time. This is what matters.

<b>Rule of thumb:</b> if a query takes more than 100ms on a user-facing endpoint, something is wrong. Investigate with EXPLAIN ANALYZE, then add or fix indexes.

<b>The index rules.</b> Indexes are the single biggest lever for query performance. But indexes are not free — each one slows down writes and takes disk space. Design them carefully.

<b>Rule 1: Match the index to the query shape.</b> PostgreSQL uses B-tree indexes most effectively when the index column order matches the query's access pattern:
- Equality filters first
- Then range filters
- Then sort columns
- Then the tie-breaker

For the query:
\`\`\`sql
SELECT * FROM products
WHERE category = 'shoes'         -- equality
  AND price BETWEEN 50 AND 150    -- range
ORDER BY price ASC, id DESC       -- sort + tie-breaker
LIMIT 20;
\`\`\`

The ideal index is:
\`\`\`sql
CREATE INDEX idx_products_cat_price_id
  ON products (category, price, id);
\`\`\`

PostgreSQL can seek to \`category = 'shoes'\`, walk the price range in order, and return rows without an extra sort.

<b>Rule 2: Do not index everything.</b> Each index adds overhead to every INSERT, UPDATE, and DELETE. Ten indexes on a table slow writes by up to 10x. Index only the columns used in real queries.

<b>Rule 3: Indexes can be covering.</b> A covering index includes all the columns the query needs, so PostgreSQL never has to touch the table:

\`\`\`sql
CREATE INDEX idx_products_list_covering
  ON products (category, price)
  INCLUDE (id, name, thumbnail);
\`\`\`

The \`INCLUDE\` clause stores extra columns in the index. Now a list query can be served entirely from the index — no table lookups. This is a big win for high-traffic list endpoints.

<b>Rule 4: Watch for missing or redundant indexes.</b> PostgreSQL can tell you:
\`\`\`sql
-- Which indexes are unused?
SELECT relname, indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Which queries are slow?
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
\`\`\`

Run these regularly. Drop unused indexes. Investigate slow queries.

<b>Rule 5: Beware of functions in WHERE clauses.</b> \`WHERE LOWER(name) = 'shoes'\` cannot use a normal index on \`name\`. You need a functional index:

\`\`\`sql
CREATE INDEX idx_products_lower_name ON products (LOWER(name));
\`\`\`

Or store the normalized value in its own column. This applies to \`to_tsvector\`, \`date_trunc\`, \`extract\`, and any other function used in a WHERE clause.

<b>Query design principles.</b>

<b>Principle 1: Filter before you sort.</b> Sort operations on large datasets are expensive. Push filters as early as possible so the sort operates on fewer rows. PostgreSQL usually does this automatically, but check with EXPLAIN — sometimes a poorly-written query prevents it.

<b>Principle 2: Select only what you need.</b> \`SELECT *\` fetches every column, including large text and JSON fields. List views should select only what they display. This reduces I/O, memory, and serialization cost.

<b>Principle 3: Avoid N+1 queries.</b> A common anti-pattern:

\`\`\`typescript
const products = await this.productRepository.find({ take: 20 });
for (const product of products) {
  product.brand = await this.brandRepository.findOne(product.brandId);
}
// 1 + 20 = 21 queries
\`\`\`

Use a join or \`relations\` option:

\`\`\`typescript
const products = await this.productRepository.find({
  take: 20,
  relations: ['brand'],
});
// 1 query (or 2 with a join strategy)
\`\`\`

<b>Principle 4: Use EXPLAIN on every new query in development.</b> Get into the habit. If a query does a Seq Scan on a million-row table, fix it before it ships.

<b>Principle 5: Denormalize for read-heavy paths.</b> Sometimes you compute a value once on write and store it, instead of computing it on every read. For example, a \`discountPercentage\` column, a \`reviewCount\` column, a \`search_vector\` column. Denormalization trades write cost and storage for read speed. Use it deliberately.

<b>Principle 6: Cache what you can.</b> Frequently requested results (top products, total counts, popular searches) can be cached in Redis or in-memory for 30–60 seconds. This can reduce database load by an order of magnitude on read-heavy endpoints.

<b>Principle 7: Monitor query performance continuously.</b> Set up \`pg_stat_statements\`, log slow queries, and alert on p95/p99 latency. The earlier you catch a regression, the cheaper it is to fix.

<b>Putting it all together: a real optimization story.</b>

You have a products endpoint that supports filters, sorting, and pagination. It looks like this:

\`\`\`sql
SELECT id, name, price, thumbnail
FROM products
WHERE category = 'shoes' AND price BETWEEN 50 AND 200
ORDER BY price ASC, id DESC
LIMIT 20 OFFSET 0;
\`\`\`

At 10K rows, it takes 3ms. At 1M rows, it takes 300ms. At 10M rows, it takes 3 seconds.

Step 1: Add the right index.
\`\`\`sql
CREATE INDEX idx_products_cat_price_id
  ON products (category, price, id)
  INCLUDE (name, thumbnail);
\`\`\`

Now it takes 5ms at 10M rows. The index is covering, so no table lookups are needed.

Step 2: Cap the page size and offset.
The client cannot request \`limit=10000\` or \`page=100000\`. Cap \`limit\` at 100, and switch deep pages to cursor pagination.

Step 3: Cache the total count.
Every request runs \`COUNT(*)\`. Cache it for 60 seconds. That alone halves the database load.

Step 4: Cache the first page.
The first page of common filter combinations is requested far more often than any other page. Cache it for 30 seconds.

Step 5: Monitor.
Set up \`pg_stat_statements\`. Log any query over 200ms. Alert if p99 response time exceeds 500ms.

The result: 3 seconds becomes 5ms, database load drops by 90%, and the endpoint scales to millions of users.

<b>What can go wrong?</b>
- <b>Guessing at indexes.</b> Adding indexes without checking EXPLAIN often misses the target. Always measure.
- <b>Too many indexes.</b> Each one slows writes. Prune regularly.
- <b>Ignoring the query plan.</b> A query that worked yesterday can change plans today as data grows. Plans are not permanent.
- <b>Forgetting about statistics.</b> PostgreSQL uses table statistics to plan queries. If stats are stale, plans can be terrible. \`ANALYZE\` regularly, or rely on autovacuum.
- <b>Not testing at scale.</b> A query that is fast at 10K rows can be unusable at 10M. Seed test data at production scale before launching.
- <b>No monitoring.</b> Without slow query logs, you find out about performance problems from angry users.

<b>How experienced engineers think:</b> performance is not a phase at the end of a project — it is a design constraint from day one. Every query is written with the index that will support it. Every new table is planned with its access patterns. Every endpoint is measured under realistic load. Slow queries are treated as bugs. This is what separates a system that scales from one that falls over the moment it becomes popular.
      `,
      diagram: `
Query Design & Performance Workflow

  New endpoint
      |
      v
  Write the query
      |
      v
  EXPLAIN ANALYZE it
      |
      +-- Index Scan (fast)  -> ship it
      |
      +-- Seq Scan (slow)    -> add the matching index
      |     |
      |     v
      |   (filter_columns..., sort_columns..., tie_breaker)
      |     |
      |     v
      |   Re-run EXPLAIN
      |
      +-- Sort node (expensive) -> add index that provides
      |                            the sort order directly
      |
      v
  Measure at realistic scale
      |
      +-- <100ms  -> good
      |
      +-- >100ms -> cache, denormalize, or redesign

Index design rule:
  (equality_filter, range_filter, sort_col, tie_breaker)
  Optional: INCLUDE (other_columns) for covering index

Monitoring:
  pg_stat_statements   -> slowest queries
  pg_stat_user_indexes -> unused indexes
  slow query log       -> real production issues
  p95 / p99 latency    -> end-to-end user experience

Cache layers:
  Redis:  first page of common filters, total counts
  Memory: hot product metadata, config
  HTTP:   Cache-Control for public, immutable data
      `,
      codeExample: { title: "Example", code: `
// ============================================
// QUERY DESIGN & PERFORMANCE — PRACTICAL EXAMPLE
// ============================================

// ---------- 1. Measure first: EXPLAIN ANALYZE ----------
// In a psql session or a migration script:
//
// EXPLAIN ANALYZE
// SELECT id, name, price
// FROM products
// WHERE category = 'shoes' AND price BETWEEN 50 AND 200
// ORDER BY price ASC, id DESC
// LIMIT 20;
//
// Look for:
//   "Seq Scan"          -> add an index
//   "Sort"              -> add an index matching the ORDER BY
//   "Index Scan"        -> good
//   "actual time=..."   -> how long it really took

// ---------- 2. Add the right index ----------
// Migration:
// CREATE INDEX idx_products_cat_price_id
//   ON products (category, price, id)
//   INCLUDE (name, thumbnail);
//
// This is a covering index. The list query can be served entirely
// from the index without touching the main table.

// ---------- 3. The service endpoint (optimized) ----------
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll(
    filters: FilterProductsDto,
    pagination: PaginationDto,
  ) {
    // Cache the first page of the most common filter combinations.
    const cacheKey = \`products:list:\${JSON.stringify(filters)}:p\${pagination.page}:l\${pagination.limit}\`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const qb = this.productRepository.createQueryBuilder('p');

    // Select only the columns the list view needs.
    qb.select(['p.id', 'p.name', 'p.price', 'p.thumbnail']);

    // Filters (parameterized).
    if (filters.category) {
      qb.andWhere('p.category = :category', { category: filters.category });
    }
    if (filters.minPrice !== undefined) {
      qb.andWhere('p.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      qb.andWhere('p.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    // Sort + tie-breaker.
    qb.orderBy('p.price', 'ASC');
    qb.addOrderBy('p.id', 'DESC');

    // Pagination with a hard cap enforced by DTO.
    qb.skip((pagination.page - 1) * pagination.limit);
    qb.take(pagination.limit);

    // Get items and total in one round trip.
    const [items, total] = await qb.getManyAndCount();

    const response = {
      items,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    // Cache only the first few pages for 30 seconds.
    if (pagination.page <= 3) {
      await this.cache.set(cacheKey, response, 30_000);
    }

    return response;
  }
}

// ---------- 4. Avoid N+1 queries ----------
// BAD: 1 query + N queries.
// const products = await this.productRepository.find({ take: 20 });
// for (const p of products) {
//   p.brand = await this.brandRepository.findOne(p.brandId);
// }

// GOOD: use relations to fetch in one (or two) round trips.
async findAllWithBrands() {
  return this.productRepository.find({
    take: 20,
    relations: ['brand'],
    order: { createdAt: 'DESC', id: 'DESC' },
  });
}

// ---------- 5. Slow query logging in NestJS ----------
// interceptor/logging.interceptor.ts
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class SlowQueryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        if (duration > 200) {
          console.warn(
            \`[SLOW] \${req.method} \${req.url} took \${duration}ms\`,
          );
          // In production, ship this to your log aggregator and alert.
        }
      }),
    );
  }
}

// ---------- 6. Monitoring queries (run periodically) ----------
// Top 10 slowest queries by mean execution time:
// SELECT query, mean_exec_time, calls
// FROM pg_stat_statements
// ORDER BY mean_exec_time DESC
// LIMIT 10;
//
// Unused indexes (candidates for removal):
// SELECT relname, indexrelname, idx_scan
// FROM pg_stat_user_indexes
// WHERE idx_scan = 0
// ORDER BY relname;

// ---------- 7. Test at realistic scale ----------
// Seed the test database with a production-sized dataset
// (e.g. 1 million products) before running performance tests.
// A query that runs in 5ms on 100 rows can take seconds on 1 million.
      ` },
      keyTakeaways: [
        "Always run `EXPLAIN ANALYZE` on new queries — look for `Index Scan` vs `Seq Scan`, and inspect the actual execution time.",
        "Design indexes to match the query shape: equality filters first, then range filters, then sort columns, then the tie-breaker.",
        "Covering indexes with `INCLUDE (...)` can serve list queries without touching the main table.",
        "Each index slows down writes and takes disk space — index deliberately, prune unused indexes regularly.",
        "Functions in `WHERE` clauses (e.g. `LOWER(name)`) require a functional index to be usable.",
        "Avoid N+1 queries by using `relations` or joins; never fetch related data in a loop.",
        "Cache first pages and total counts; cache is the cheapest form of scale.",
        "Test with production-scale data before launch — queries that are fast at 10K rows can be unusable at 10M.",
      ],
      commonMistakes: [
        "<b>Adding indexes by guessing.</b> Without `EXPLAIN ANALYZE`, you do not know which index (if any) will be used. Always measure before and after.",
        "<b>Too many indexes.</b> Each additional index slows INSERT, UPDATE, and DELETE. Drop indexes that `pg_stat_user_indexes` shows as unused (`idx_scan = 0`).",
        "<b>Functions in WHERE clauses without a functional index.</b> `WHERE LOWER(name) = 'shoes'` cannot use a normal index on `name`. Either create a functional index or store a normalized column.",
        "<b>N+1 queries inside paginated lists.</b> Fetching 20 items plus one query per item's relations is 21 queries. Use `relations` or a join.",
        "<b>Skipping `SELECT` when you need only a few columns.</b> `SELECT *` drags large text and JSON columns over the wire on every list request.",
        "<b>Testing on tiny datasets.</b> A query that runs in 3ms on 1,000 rows can take seconds on 10 million. Seed realistic test data before benchmarking.",
        "<b>Ignoring stale statistics.</b> PostgreSQL plans queries based on table statistics. If they are out of date, plans can be catastrophically wrong. Keep autovacuum enabled and run `ANALYZE` after bulk changes.",
        "<b>No slow-query monitoring.</b> Without logs and alerts, you discover performance problems from user complaints instead of from your monitoring dashboard.",
      ],
      quiz: [
        {
          question:
            "You run `EXPLAIN ANALYZE` on a query and see a `Seq Scan` on a 5-million-row table. What does this mean and what should you do?",
          options: [
            "It means the query is using an index efficiently.",
            "It means the database is scanning the entire table. You should add an index matching the query's filter and sort columns.",
            "It means the query will run in constant time.",
            "It means the table is empty.",
          ],
          correctIndex: 1,
          explanation:
            "`Seq Scan` means the database reads every row. On a large table this is slow. Add an index that matches the query's equality filters, range filters, and sort columns.",
        },
        {
          question:
            "Which index best supports `WHERE category = 'shoes' AND price BETWEEN 50 AND 200 ORDER BY price ASC, id DESC`?",
          options: [
            "`(id, price, category)`",
            "`(category, price, id)`",
            "`(price, category)`",
            "`(id)` alone",
          ],
          correctIndex: 1,
          explanation:
            "Equality filter first (`category`), then the range/sort column (`price`), then the tie-breaker (`id`). This lets PostgreSQL seek to the category, walk the price range in order, and return rows without a separate sort step.",
        },
        {
          question:
            "Why does `WHERE LOWER(name) = 'shoes'` fail to use a normal B-tree index on `name`?",
          options: [
            "Because B-tree indexes cannot store text.",
            "Because the function `LOWER` transforms the column value, so the index on the raw column cannot be used — you need a functional index on `LOWER(name)`.",
            "Because `LOWER` is deprecated.",
            "Because indexes do not support WHERE clauses.",
          ],
          correctIndex: 1,
          explanation:
            "B-tree indexes store values as-is. When you wrap the column in a function, the stored values no longer match the transformed values being compared. A functional index on `LOWER(name)` stores the transformed values so the comparison can use it.",
        },
        {
          question:
            "You have a list endpoint that runs a query, then for each of the 20 returned items runs another query to fetch the brand. What is this called, and how do you fix it?",
          options: [
            "A transaction; fix with `COMMIT`.",
            "An N+1 query; fix by using `relations` or a join to fetch everything in one or two round trips.",
            "A deadlock; fix with retries.",
            "A race condition; fix with locks.",
          ],
          correctIndex: 1,
          explanation:
            "This is the classic N+1 problem: 1 query for the list plus N queries for related data. It multiplies load and latency. Use `relations` in TypeORM or an explicit join so the data comes back in one (or two) queries.",
        },
        {
          question:
            "Why should you seed realistic, production-scale data before benchmarking a paginated endpoint?",
          options: [
            "Because small datasets are not valid SQL.",
            "Because query performance depends heavily on data size and index usage — a query that runs in 3ms on 1,000 rows can take seconds on 10 million.",
            "Because PostgreSQL behaves differently with small tables.",
            "Because indexes require at least 1 million rows to activate.",
          ],
          correctIndex: 1,
          explanation:
            "Query plans change with data size. Index usage that seems fine on small data may disappear on large data, or a plan that looks good may collapse under real load. Benchmark with realistic volume.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question:
        "A client sends `GET /products?minPrice=abc`. What should the server do?",
      options: [
        "Treat minPrice as 0.",
        "Ignore the invalid value and return all products.",
        "Return 400 because the DTO validation rejects the non-numeric value.",
        "Crash with an internal error.",
      ],
      correctIndex: 2,
      explanation:
        "The DTO validation (via `@Type(() => Number)` and `@IsInt()`) rejects the request with a 400 before it reaches the database. Input validation is the first line of defense for any filter.",
    },
    {
      question:
        "Why must you use parameterized queries (`:param`) instead of string concatenation in WHERE clauses?",
      options: [
        "Because parameterized queries are shorter.",
        "Because parameterized queries prevent SQL injection — the value is sent as data, not as part of the SQL structure.",
        "Because PostgreSQL requires it.",
        "Because string concatenation is slower.",
      ],
      correctIndex: 1,
      explanation:
        "Parameterized queries separate the SQL structure from the values. No matter what the client sends, it cannot change the query. String concatenation allows attackers to inject arbitrary SQL.",
    },
    {
      question:
        "Why is `@IsIn(['price', 'createdAt', 'rating'])` important on a sort DTO?",
      options: [
        "It makes the response faster.",
        "It prevents clients from sorting by arbitrary columns — which could leak data or trigger unindexed slow queries.",
        "It is required by TypeORM.",
        "It removes duplicate results.",
      ],
      correctIndex: 1,
      explanation:
        "Whitelisting sortable columns protects against data leaks (e.g. sorting by `password_hash`) and performance issues (sorting by unindexed columns). Always restrict what clients can sort by.",
    },
    {
      question:
        "Which is the safest way to express 'created in January 2024' in a WHERE clause?",
      options: [
        "`BETWEEN '2024-01-01' AND '2024-01-31'`",
        "`>= '2024-01-01' AND < '2024-02-01'`",
        "`= '2024-01'`",
        "`LIKE '2024-01%'`",
      ],
      correctIndex: 1,
      explanation:
        "The half-open interval includes everything from Jan 1 00:00:00 to Feb 1 00:00:00 exclusive — including all of Jan 31. `BETWEEN` includes both endpoints but is easy to misuse with timestamps.",
    },
    {
      question:
        "What does `ILIKE '%term%'` do on a large table?",
      options: [
        "Uses an index efficiently.",
        "Forces a full table scan because the leading wildcard prevents B-tree index usage.",
        "Returns no results.",
        "Sorts the table.",
      ],
      correctIndex: 1,
      explanation:
        "A leading `%` means the pattern has no fixed prefix, so a B-tree index cannot be used. The database must check every row. Use `pg_trgm` or full-text search for substring matching at scale.",
    },
    {
      question:
        "What is `pg_trgm` used for?",
      options: [
        "Compressing large text columns.",
        "Trigram-based substring and fuzzy search with GIN index support, including typo tolerance.",
        "Storing JSON documents.",
        "Replicating data between servers.",
      ],
      correctIndex: 1,
      explanation:
        "`pg_trgm` breaks text into 3-character chunks and indexes them, enabling fast substring matching and similarity-based fuzzy matching (helpful for typos).",
    },
    {
      question:
        "Why should you store a `tsvector` column instead of computing `to_tsvector(name)` at query time?",
      options: [
        "Because PostgreSQL forbids functions in WHERE clauses.",
        "Because computing the vector on every row on every query is expensive; storing and indexing it makes search fast.",
        "Because `tsvector` cannot be computed at query time.",
        "Because TypeORM requires it.",
      ],
      correctIndex: 1,
      explanation:
        "Computing `to_tsvector` on every row on every query wastes CPU. Store the vector in a column, keep it updated on write, and index it with GIN. The query then becomes a fast index lookup.",
    },
    {
      question:
        "You run `EXPLAIN ANALYZE` and see a `Seq Scan` on a 5-million-row table. What is the correct next step?",
      options: [
        "Ignore it — Seq Scans are always fine.",
        "Add an index matching the query's filter and sort columns, then re-run EXPLAIN to confirm an Index Scan.",
        "Delete half the rows.",
        "Restart the database.",
      ],
      correctIndex: 1,
      explanation:
        "Seq Scan on large tables is usually a performance bug. Add the right index and verify with EXPLAIN that the plan changed to an Index Scan and the execution time dropped.",
    },
    {
      question:
        "Which index best supports `WHERE category = 'shoes' AND price BETWEEN 50 AND 200 ORDER BY price ASC, id DESC`?",
      options: [
        "`(id, price, category)`",
        "`(category, price, id)`",
        "`(price, category, id)`",
        "`(id)` only",
      ],
      correctIndex: 1,
      explanation:
        "Equality filter first, then the range/sort column, then the tie-breaker. This order lets PostgreSQL seek to the category, walk the price range in sorted order, and avoid a separate sort step.",
    },
    {
      question:
        "Why is `SELECT *` discouraged on list endpoints?",
      options: [
        "Because it is not supported by SQL.",
        "Because it drags every column — including large text and JSON — over the wire and into memory, even when the list view only needs a few fields.",
        "Because it breaks pagination.",
        "Because it prevents the use of indexes.",
      ],
      correctIndex: 1,
      explanation:
        "`SELECT *` transfers every column. List views usually need only a handful. Selecting exactly what you need reduces I/O, memory usage, serialization cost, and response size.",
    },
    {
      question:
        "What is the N+1 query problem?",
      options: [
        "Running one query and then N additional queries to fetch related data, often inside a loop.",
        "Running N+1 queries in parallel.",
        "A query that returns N+1 rows.",
        "A connection pool with N+1 connections.",
      ],
      correctIndex: 0,
      explanation:
        "N+1 occurs when a list query is followed by one query per item to fetch related data. It multiplies load and latency. Use `relations` or a join to fetch related data in one round trip.",
    },
    {
      question:
        "Which column order in an index is best for `WHERE tenant_id = 5 AND status = 'active' ORDER BY created_at DESC`?",
      options: [
        "`(created_at, status, tenant_id)`",
        "`(tenant_id, status, created_at)`",
        "`(status, created_at, tenant_id)`",
        "`(created_at, tenant_id, status)`",
      ],
      correctIndex: 1,
      explanation:
        "Equality filters first (both `tenant_id` and `status` are equality), then the sort column `created_at`. PostgreSQL can seek to the exact tenant+status combination and read rows in the requested order.",
    },
    {
      question:
        "Why is caching the first page of a popular filter combination so effective?",
      options: [
        "Because the first page is always the smallest.",
        "Because the first page is requested far more often than any other page — caching it removes a large fraction of database load with minimal effort.",
        "Because the database caches it automatically.",
        "Because the first page never changes.",
      ],
      correctIndex: 1,
      explanation:
        "User behavior is heavily skewed toward the first page. Caching just the first page (or first few pages) of common filter combinations eliminates most of the database work on read-heavy list endpoints.",
    },
    {
      question:
        "What is the correct fix for `WHERE LOWER(name) = 'shoes'` being slow?",
      options: [
        "Add a normal index on `name`.",
        "Add a functional index: `CREATE INDEX ... ON products (LOWER(name))`.",
        "Use `ILIKE` instead.",
        "Disable the query planner.",
      ],
      correctIndex: 1,
      explanation:
        "A normal index on `name` stores raw values and cannot help when the column is wrapped in a function. A functional index on `LOWER(name)` stores the transformed values, so the comparison can use the index.",
    },
    {
      question:
        "Your list endpoint takes 3ms on 1,000 rows but 3 seconds on 10 million. What is the first thing to check?",
      options: [
        "Upgrade the server CPU.",
        "Run `EXPLAIN ANALYZE` to see whether the query is doing a Seq Scan or a Sort, then add the matching index.",
        "Add more RAM.",
        "Switch to a different database.",
      ],
      correctIndex: 1,
      explanation:
        "The first step is always to look at the query plan. `EXPLAIN ANALYZE` reveals whether the query is scanning the whole table or sorting unnecessarily. Usually a well-designed index turns a 3-second query into milliseconds.",
    },
  ],
  project: {
    name: "Build a Filtered, Searchable, and Sortable Product Catalog for an E-Commerce API",
    goal:
      "Combine filtering, query operators, sorting, full-text search, and performance techniques into a single NestJS product catalog endpoint that behaves like a real production system.",
    brief:
      "You are building the backend for a mid-sized online store with around one million products. Customers must be able to filter by category, brand, price, rating, and stock availability; sort by price, rating, newest, or name; and search by free-text query with relevance ranking. The endpoint must return paginated results quickly even under load, use proper indexes, and handle invalid input safely. This project ties together everything from today's lessons: query parameters, DTO validation, query operators, sorting with whitelisting, PostgreSQL full-text search, `pg_trgm` fallback, indexing, caching, and monitoring.",
    steps: [
      "Create a NestJS project. Add TypeORM, PostgreSQL, `class-validator`, `class-transformer`, and `@nestjs/cache-manager`.",
      "Define a `Product` entity with: `id`, `name`, `description`, `category`, `brand`, `price` (numeric), `rating` (numeric), `stock` (int), `createdAt`, `updatedAt`, and a `searchVector` column of type `tsvector`.",
      "Write a migration that creates the products table, enables `pg_trgm`, and creates these indexes: `(category, price, id)`, `(brand, price, id)`, `(rating DESC, id DESC)`, `(created_at DESC, id DESC)`, a GIN index on `search_vector`, and a GIN trigram index on `name`.",
      "Populate `search_vector` with a `BEFORE INSERT OR UPDATE` trigger that concatenates `name` and `description` and calls `to_tsvector('english', ...)`. Alternatively, compute it in a service method on write — but if you do, document why.",
      "Create a `FilterProductsDto` with optional fields: `category` (string), `brands` (string array, `@ArrayMaxSize(20)`), `minPrice` / `maxPrice` (numbers), `minRating` (number 0–5), `inStock` (boolean), `createdAfter` / `createdBefore` (ISO date strings). Use `@Type` and appropriate validators.",
      "Create a `SortDto` with `sortBy` whitelisted to `['price', 'rating', 'createdAt', 'name']` and `sortDir` whitelisted to `['asc', 'desc']`.",
      "Create a `PaginationDto` with `page` (default 1, min 1) and `limit` (default 20, min 1, max 100).",
      "Implement `GET /products` that combines all filters, the sort, and pagination into a QueryBuilder query. Always add `id DESC` as the final tie-breaker. Return the standard pagination envelope with meta fields.",
      "Implement `GET /products/search?q=...` that converts the user query into a safe `tsquery` string (prefix matching with `:*`, `&` between terms), runs an FTS query on `search_vector`, ranks by `ts_rank` DESC, and returns paginated results.",
      "Add a fallback in the search endpoint: if FTS returns zero results, run a `pg_trgm` similarity query on `name` to catch typos, and return those results with a flag indicating fallback was used.",
      "Cache the first page (page 1, limit 20) of common filter combinations in memory for 30 seconds. Cache the total count for 60 seconds.",
      "Add a `SlowQueryInterceptor` that logs any request taking more than 200ms.",
      "Add Swagger decorators to document all query parameters, their defaults, and the response shape.",
      "Write e2e tests covering: invalid `minPrice=abc` → 400, invalid `sortBy=password` → 400, `limit=5000` → 400, filter combination returning expected subset, sorting by each whitelisted column, search query matching a known product, search query with a typo returning a fallback result, and page beyond the end returning empty items.",
    ],
    acceptance: [
      "`GET /products?category=shoes&minPrice=50&maxPrice=200&sortBy=price&sortDir=asc` returns products matching the filters, sorted by ascending price, with `id DESC` as the deterministic tie-breaker.",
      "`GET /products?sortBy=password` returns 400 due to the `@IsIn` whitelist.",
      "`GET /products?limit=5000` returns 400 (or clamps to 100 — document which).",
      "`GET /products?minPrice=abc` returns 400 with a clear validation error.",
      "`GET /products/search?q=wireless+headphones` returns products whose names or descriptions match, ranked by `ts_rank` descending.",
      "`GET /products/search?q=headfones` (typo) returns sensible results via the trigram fallback.",
      "`EXPLAIN ANALYZE` on the main list query shows an Index Scan on the appropriate index, not a Seq Scan.",
      "The FTS query uses the GIN index on `search_vector` (verify with EXPLAIN).",
      "The first page of common filters is served from cache on repeated requests within 30 seconds.",
      "All e2e tests pass, and slow query logs appear for artificially slow requests.",
    ],
    stretch: [
      "Add a `/products/suggest?q=...` endpoint for type-ahead autocomplete that uses a `pg_trgm` index on `name` and returns the top 5 prefix matches with `similarity` scores.",
      "Add faceted filtering: return the counts of matching products per category and per brand alongside the item list, so the UI can show 'Shoes (234)', 'Bags (81)', etc. Compute the counts in a single aggregate query.",
      "Add Redis caching with `@nestjs/cache-manager` and a Redis store. Invalidate cache entries on product create, update, or delete using an event or interceptor.",
      "Add `pg_stat_statements` monitoring and expose an admin-only `GET /admin/slow-queries` endpoint that returns the top 10 slowest queries from the view.",
      "Add synonyms support: maintain a small `synonyms(term, expansion)` table and rewrite the user query before building the `tsquery` so that 'mobile' also matches 'phone'.",
      "Add multi-language FTS: store a `language` column and use `to_tsvector(language, ...)` so that English and Spanish products are stemmed correctly. Document how to extend to more languages.",
      "Add cursor-based search pagination (from Day 47) for infinite-scroll search results, keeping offset pagination for the filterable catalog page where 'Page X of Y' matters.",
      "Add a benchmark script that seeds 1 million fake products, then measures p50/p95/p99 latency of the list and search endpoints under load (e.g. with autocannon or k6). Document the results and the impact of each index and cache you added.",
    ],
  },
};
